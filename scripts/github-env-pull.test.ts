import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseEnv } from 'node:util';
import { onTestFinished, test } from 'vitest';
import { updateLiquidEnv } from './github-env-pull.ts';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'github-env-pull-'));
  onTestFinished(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'apps/liquid'), { recursive: true });
  return { root, path: join(root, 'apps/liquid/.env.local') };
}

const store = 'example.myshopify.com';

test('updating repeated exported or quoted stores preserves secrets, multiline values and CRLF bytes', async () => {
  const { root, path } = await fixture();
  const before = [
    '# Local settings',
    'SHOPIFY_CLI_THEME_TOKEN="private-token"',
    'CERT="first line',
    'SHOPIFY_FLAG_STORE=inside-a-secret',
    'export SHOPIFY_FLAG_STORE=also-inside-a-secret',
    'last line"',
    "SINGLE='first line",
    'SHOPIFY_FLAG_STORE=inside-single-quotes',
    "last line'",
    'TEMPLATE=`first line',
    'SHOPIFY_FLAG_STORE=inside-backticks',
    'last line`',
    'export SHOPIFY_FLAG_STORE="old.myshopify.com"',
    "SHOPIFY_FLAG_STORE='second.myshopify.com",
    "continued-old-value'",
    'OTHER=value # keep this comment',
    String.raw`DIRECTORY="C:\"`,
    '',
  ].join('\r\n');
  await writeFile(path, before, { mode: 0o640 });
  await updateLiquidEnv(root, store);
  const expected = before
    .replace('export SHOPIFY_FLAG_STORE="old.myshopify.com"', `SHOPIFY_FLAG_STORE=${store}`)
    .replace("SHOPIFY_FLAG_STORE='second.myshopify.com\r\ncontinued-old-value'", `SHOPIFY_FLAG_STORE=${store}`);
  assert.deepEqual(await readFile(path), Buffer.from(expected));
  assert.equal((await stat(path)).mode & 0o777, 0o640);
  assert.equal(await updateLiquidEnv(root, store), false);
  assert.deepEqual(await readFile(path), Buffer.from(expected));
});

test('appending a missing store preserves an unrelated final line and its newline convention', async () => {
  const { root, path } = await fixture();
  const before = 'SECRET="leave me alone"\r\nOTHER=without-final-newline';
  await writeFile(path, before);
  await updateLiquidEnv(root, store);
  assert.equal(await readFile(path, 'utf8'), `${before}\r\nSHOPIFY_FLAG_STORE=${store}\r\n`);
});

test('new local store configuration is private and cannot alter the root environment', async () => {
  const { root, path } = await fixture();
  const rootEnv = join(root, '.env.local');
  await writeFile(rootEnv, 'PRIVATE=untouched\n');
  await updateLiquidEnv(root, store);
  assert.equal(await readFile(path, 'utf8'), `SHOPIFY_FLAG_STORE=${store}\n`);
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.equal(await readFile(rootEnv, 'utf8'), 'PRIVATE=untouched\n');
});

test('store values round-trip through native dotenv serialization without changing secrets', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_CLI_THEME_TOKEN=private-token\nOTHER=unchanged\n';
  for (const value of [
    'Opaque-Store.Value:443/path',
    '  surrounding whitespace  ',
    'value#with-comment-marker',
    'value\nOTHER=not-an-assignment',
    "value ' with\nmultiple lines",
    String.raw`literal\nand\rcarriage`,
    'unicode café',
  ]) {
    await writeFile(path, before);
    await updateLiquidEnv(root, value);
    const after = await readFile(path, 'utf8');
    assert.ok(after.startsWith(before));
    assert.equal(parseEnv(after).SHOPIFY_FLAG_STORE, value);
    assert.equal(parseEnv(after).OTHER, 'unchanged');
    assert.equal(parseEnv(after).SHOPIFY_CLI_THEME_TOKEN, 'private-token');
    assert.equal(await updateLiquidEnv(root, value), false);
  }
});

test('missing store values cannot clobber existing local configuration', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_CLI_THEME_TOKEN=private-token\n';
  await writeFile(path, before);
  for (const value of [undefined, null, 123, '', ' \t\n']) {
    await assert.rejects(updateLiquidEnv(root, value), /SHOPIFY_STORE is required/);
    assert.equal(await readFile(path, 'utf8'), before);
  }
});

test('unrepresentable store bytes cannot change the last-good file', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_FLAG_STORE=last-good\nSECRET=untouched\n';
  await writeFile(path, before);
  for (const value of ['value\0with-nul', 'value\ud800with-unpaired-surrogate']) {
    await assert.rejects(updateLiquidEnv(root, value), {
      message: 'SHOPIFY_FLAG_STORE cannot be represented exactly in the local dotenv file. No local settings were changed.',
    });
    assert.deepEqual(await readFile(path), Buffer.from(before));
  }
});

test('unterminated multiline values cannot clobber existing local configuration', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_CLI_THEME_TOKEN="secret\nSHOPIFY_FLAG_STORE=not-a-declaration\n';
  await writeFile(path, before);
  await assert.rejects(updateLiquidEnv(root, store), /unterminated quoted value/);
  assert.equal(await readFile(path, 'utf8'), before);
});

test('a local env symlink cannot redirect writes into a different app', async () => {
  const { root, path } = await fixture();
  const outside = join(root, 'outside.env');
  await writeFile(outside, 'SECRET=untouched\n');
  await symlink(outside, path);
  await assert.rejects(updateLiquidEnv(root, store), /regular file/);
  assert.equal(await readFile(outside, 'utf8'), 'SECRET=untouched\n');
});

test('passwords round-trip exactly through the native dotenv parser without changing unrelated settings', async () => {
  const { root, path } = await fixture();
  const before = '# Keep bytes\r\nOTHER="private # setting"\r\n';
  for (const password of [
    'secret',
    '  leading and trailing whitespace  ',
    '#secret#with#comments',
    "a single ' quote",
    'a double " quote',
    'a ` backtick',
    `both ' and " quotes`,
    String.raw`C:\path\with\backslashes`,
    String.raw`literal\nand\rcarriage`,
    String.raw`literal ' quote and \n and \r`,
    'actual\nnewline',
    "actual ' quote\nnewline",
    '\n  multiline # password  \n',
    'unicode café 🔑',
    '',
  ]) {
    await writeFile(path, before);
    await updateLiquidEnv(root, store, password);
    const after = await readFile(path, 'utf8');
    assert.ok(after.startsWith(before));
    const parsed = parseEnv(after);
    assert.equal(parsed.SHOPIFY_FLAG_STORE, store);
    assert.equal(parsed.SHOPIFY_FLAG_STORE_PASSWORD, password);
    assert.equal(parsed.OTHER, 'private # setting');
    assert.equal(await updateLiquidEnv(root, store, password), false);
  }
});

test('an absent password preserves every manual assignment and a present empty password clears each one', async () => {
  const { root, path } = await fixture();
  const before = [
    '\uFEFFexport SHOPIFY_FLAG_STORE_PASSWORD=" first # password "',
    'CERT=`first line',
    'SHOPIFY_FLAG_STORE_PASSWORD=inside-unrelated-multiline',
    'last line`',
    'export SHOPIFY_FLAG_STORE_PASSWORD="second',
    'password"',
    "SHOPIFY_FLAG_STORE_PASSWORD='last manual password'",
    'OTHER=unchanged',
    '',
  ].join('\r\n');
  await writeFile(path, before);
  await updateLiquidEnv(root, store);
  const preserved = `${before}SHOPIFY_FLAG_STORE=${store}\r\n`;
  assert.deepEqual(await readFile(path), Buffer.from(preserved));
  assert.equal(parseEnv(preserved).SHOPIFY_FLAG_STORE_PASSWORD, 'last manual password');
  await updateLiquidEnv(root, store, '');
  const cleared = preserved
    .replace('export SHOPIFY_FLAG_STORE_PASSWORD=" first # password "', "SHOPIFY_FLAG_STORE_PASSWORD=''")
    .replace('export SHOPIFY_FLAG_STORE_PASSWORD="second\r\npassword"', "SHOPIFY_FLAG_STORE_PASSWORD=''")
    .replace("SHOPIFY_FLAG_STORE_PASSWORD='last manual password'", "SHOPIFY_FLAG_STORE_PASSWORD=''");
  assert.deepEqual(await readFile(path), Buffer.from(cleared));
  assert.equal(parseEnv(cleared).SHOPIFY_FLAG_STORE_PASSWORD, '');
});

test('a new password replaces every repeated assignment while leaving multiline secrets untouched', async () => {
  const { root, path } = await fixture();
  const before = 'SECRET="first\nSHOPIFY_FLAG_STORE_PASSWORD=not-an-assignment\nlast"\n'
    + 'SHOPIFY_FLAG_STORE_PASSWORD=old\nexport SHOPIFY_FLAG_STORE_PASSWORD="stale"\n';
  const password = "new ' password # with\nliteral \\n";
  await writeFile(path, before);
  await updateLiquidEnv(root, store, password);
  const after = await readFile(path, 'utf8');
  assert.ok(after.startsWith('SECRET="first\nSHOPIFY_FLAG_STORE_PASSWORD=not-an-assignment\nlast"\n'));
  assert.equal(parseEnv(after).SHOPIFY_FLAG_STORE_PASSWORD, password);
  assert.equal(parseEnv(after).SECRET, 'first\nSHOPIFY_FLAG_STORE_PASSWORD=not-an-assignment\nlast');
  assert.equal(await updateLiquidEnv(root, store, password), false);
});

test('unrepresentable passwords fail without disclosing their value or changing the last-good file', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_FLAG_STORE=old.myshopify.com\nSHOPIFY_FLAG_STORE_PASSWORD=last-good\nSECRET=untouched\n';
  await writeFile(path, before);
  for (const password of [
    'secret with all delimiters \' " `',
    'secret\0with-nul',
    'secret\ud800with-unpaired-surrogate',
    'secret\rwith-carriage-return',
    'secret\r\nwith-crlf',
    "secret ' and ` with literal \\n",
  ]) {
    await assert.rejects(updateLiquidEnv(root, store, password), {
      message: 'SHOPIFY_FLAG_STORE_PASSWORD cannot be represented exactly in the local dotenv file. No local settings were changed.',
    });
    assert.deepEqual(await readFile(path), Buffer.from(before));
  }
});

test('legacy assignments migrate once without touching quoted secrets or unrelated CRLF bytes', async () => {
  const { root, path } = await fixture();
  const password = "  manual ' password # with\nliteral \\n  ";
  const before = [
    '\uFEFF# Local settings',
    'SHOPIFY_CLI_THEME_TOKEN="private-token"',
    'CERT=`first line',
    'SHOPIFY_DEV_STORE=inside-a-secret',
    'SHOPIFY_THEME_PASSWORD=inside-a-secret',
    'last line`',
    'export SHOPIFY_DEV_STORE="old.myshopify.com"',
    "SHOPIFY_DEV_STORE='second.myshopify.com",
    "continued-old-value'",
    'SHOPIFY_THEME_PASSWORD=stale',
    'export SHOPIFY_THEME_PASSWORD=`' + password + '`',
    'OTHER=value # keep this comment',
    '',
  ].join('\r\n');
  await writeFile(path, before, { mode: 0o640 });
  await updateLiquidEnv(root, store);
  const after = await readFile(path, 'utf8');
  const parsed = parseEnv(after);
  assert.ok(after.startsWith(before.slice(0, before.indexOf('export SHOPIFY_DEV_STORE='))));
  assert.ok(after.includes('OTHER=value # keep this comment\r\n'));
  assert.equal(parsed.SHOPIFY_FLAG_STORE, store);
  assert.equal(parsed.SHOPIFY_FLAG_STORE_PASSWORD, password);
  assert.equal(parsed.SHOPIFY_CLI_THEME_TOKEN, 'private-token');
  assert.equal(parsed.CERT, 'first line\nSHOPIFY_DEV_STORE=inside-a-secret\nSHOPIFY_THEME_PASSWORD=inside-a-secret\nlast line');
  assert.equal(Object.hasOwn(parsed, 'SHOPIFY_DEV_STORE'), false);
  assert.equal(Object.hasOwn(parsed, 'SHOPIFY_THEME_PASSWORD'), false);
  assert.equal((await stat(path)).mode & 0o777, 0o640);
  assert.equal(await updateLiquidEnv(root, store), false);
  assert.equal(await readFile(path, 'utf8'), after);
});

test('absent remote passwords preserve native manual settings and remove obsolete duplicates', async () => {
  const { root, path } = await fixture();
  const native = 'export SHOPIFY_FLAG_STORE_PASSWORD=" native # password "\r\n';
  const unrelated = 'SHOPIFY_CLI_THEME_TOKEN=private-token\r\nOTHER=unchanged\r\n';
  await writeFile(path, 'SHOPIFY_DEV_STORE=old\r\nSHOPIFY_THEME_PASSWORD=obsolete\r\n' + native + unrelated);
  await updateLiquidEnv(root, store);
  const after = await readFile(path, 'utf8');
  assert.equal(after, native + unrelated + `SHOPIFY_FLAG_STORE=${store}\r\n`);
  assert.equal(parseEnv(after).SHOPIFY_FLAG_STORE_PASSWORD, ' native # password ');
  assert.equal(await updateLiquidEnv(root, store), false);
});

test('a present remote password overrides both legacy and native settings, including empty passwords', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_DEV_STORE=old\nSHOPIFY_THEME_PASSWORD=legacy\n'
    + 'SHOPIFY_FLAG_STORE=stale\nSHOPIFY_FLAG_STORE_PASSWORD=native\nSECRET=untouched\n';
  for (const password of ['new # password', '']) {
    await writeFile(path, before);
    await updateLiquidEnv(root, store, password);
    const parsed = parseEnv(await readFile(path, 'utf8'));
    assert.equal(parsed.SHOPIFY_FLAG_STORE, store);
    assert.equal(parsed.SHOPIFY_FLAG_STORE_PASSWORD, password);
    assert.equal(parsed.SECRET, 'untouched');
    assert.equal(Object.hasOwn(parsed, 'SHOPIFY_DEV_STORE'), false);
    assert.equal(Object.hasOwn(parsed, 'SHOPIFY_THEME_PASSWORD'), false);
    assert.equal(await updateLiquidEnv(root, store, password), false);
  }
});

test('an unrepresentable legacy manual password leaves the last-good file untouched', async () => {
  const { root, path } = await fixture();
  const before = 'SHOPIFY_DEV_STORE=old.myshopify.com\n'
    + 'SHOPIFY_THEME_PASSWORD=secret with all delimiters \' " `\nSECRET=untouched\n';
  await writeFile(path, before);
  await assert.rejects(updateLiquidEnv(root, store), {
    message: 'SHOPIFY_FLAG_STORE_PASSWORD cannot be represented exactly in the local dotenv file. No local settings were changed.',
  });
  assert.deepEqual(await readFile(path), Buffer.from(before));
});

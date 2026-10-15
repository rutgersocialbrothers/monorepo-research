import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { lstat, readFile, realpath, rename, rm, writeFile, chmod } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function requireStore(store: unknown): asserts store is string {
  if (typeof store !== 'string' || !store.trim()) {
    throw new Error('GitHub Environment variable SHOPIFY_STORE is required and must have a nonempty string value. No local settings were changed.');
  }
}

function encodeSetting(key: string, value: string, allowUnquoted = false): string {
  if (!value.includes('\0') && Buffer.from(value, 'utf8').toString('utf8') === value) {
    if (allowUnquoted && parseEnv(`${key}=${value}\n`)[key] === value) return value;
    for (const quote of ["'", '"', '`']) {
      if (value.includes(quote)) continue;
      const encoded = `${quote}${value}${quote}`;
      if (parseEnv(`${key}=${encoded}\n`)[key] === value) {
        return encoded;
      }
    }
  }
  throw new Error(`${key} cannot be represented exactly in the local dotenv file. No local settings were changed.`);
}

// Only assignment values may open multiline quotes; comments and unquoted values do not.
function replaceSettings(content: string, store: string, password: string | undefined): string {
  let output = '';
  let position = 0;
  const replacements: Record<string, string> = { SHOPIFY_FLAG_STORE: encodeSetting('SHOPIFY_FLAG_STORE', store, true) };
  const settings = parseEnv(content);
  const effectivePassword = password ?? (
    Object.hasOwn(settings, 'SHOPIFY_FLAG_STORE_PASSWORD') ? undefined : settings.SHOPIFY_THEME_PASSWORD
  );
  if (effectivePassword !== undefined) {
    replacements.SHOPIFY_FLAG_STORE_PASSWORD = encodeSetting('SHOPIFY_FLAG_STORE_PASSWORD', effectivePassword);
  }
  const found = new Set<string>();
  while (position < content.length) {
    const newline = content.indexOf('\n', position);
    let end = newline < 0 ? content.length : newline + 1;
    const line = content.slice(position, end);
    const assignment = /^(?:\uFEFF)?[ \t]*(?:export[ \t]+)?([A-Za-z_][A-Za-z0-9_.-]*)[ \t]*=[ \t]*/.exec(line);
    if (assignment) {
      const valueStart = position + assignment[0].length;
      const quote = content[valueStart];
      if (quote === '"' || quote === "'" || quote === '`') {
        let closing = valueStart + 1;
        for (; closing < content.length; closing++) {
          // Node's dotenv parser treats backslashes as literal before quotes.
          if (content[closing] === quote) {
            break;
          }
        }
        if (closing >= content.length) {
          throw new Error('apps/liquid/.env.local contains an unterminated quoted value; repair it before pulling the store. No local settings were changed.');
        }
        const afterQuote = content.indexOf('\n', closing);
        end = afterQuote < 0 ? content.length : afterQuote + 1;
      }
      const key = assignment[1]!;
      if (key === 'SHOPIFY_DEV_STORE' || key === 'SHOPIFY_THEME_PASSWORD') {
        if (position === 0 && content.startsWith('\uFEFF')) output += '\uFEFF';
        position = end;
        continue;
      }
      if (Object.hasOwn(replacements, key)) {
        const ending = content.slice(position, end).endsWith('\r\n') ? '\r\n'
          : content[end - 1] === '\n' ? '\n' : '';
        output += `${position === 0 && content.startsWith('\uFEFF') ? '\uFEFF' : ''}${key}=${replacements[key]}${ending}`;
        found.add(key);
        position = end;
        continue;
      }
    }
    output += content.slice(position, end);
    position = end;
  }
  for (const [key, value] of Object.entries(replacements)) {
    if (found.has(key)) continue;
    const ending = content.includes('\r\n') ? '\r\n' : '\n';
    output += `${output && !output.endsWith('\n') ? ending : ''}${key}=${value}${ending}`;
  }
  return output;
}

/** Update native Liquid CLI settings, migrating legacy keys and preserving unrelated bytes. */
export async function updateLiquidEnv(repositoryRoot: string, store: unknown, password?: string): Promise<boolean> {
  requireStore(store);
  const path = join(repositoryRoot, 'apps/liquid/.env.local');
  const directory = dirname(path);
  if (await realpath(directory) !== join(await realpath(repositoryRoot), 'apps/liquid')) {
    throw new Error('apps/liquid must be a repository-local directory, not a symlink. No local settings were changed.');
  }
  let content = '';
  let mode = 0o600;
  try {
    const info = await lstat(path);
    if (!info.isFile()) {
      throw new Error('apps/liquid/.env.local must be a regular file, not a symlink or directory. No local settings were changed.');
    }
    mode = info.mode & 0o777;
    const bytes = await readFile(path);
    try {
      content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    } catch {
      throw new Error('apps/liquid/.env.local must contain valid UTF-8. No local settings were changed.');
    }
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }
  const updated = replaceSettings(content, store, password);
  if (updated === content) return false;
  const temporary = join(directory, `.env.local.${randomUUID()}.tmp`);
  try {
    // Stage completely before replacing the existing file, so write failures cannot truncate secrets.
    await writeFile(temporary, updated, { flag: 'wx', mode: 0o600 });
    await chmod(temporary, mode);
    await rename(temporary, path);
  } finally {
    await rm(temporary, { force: true });
  }
  return true;
}

function github(args: string[], context: string, env: NodeJS.ProcessEnv): unknown {
  const { GH_REPO: _ignoredRepository, ...childEnv } = env;
  const result = spawnSync('gh', args, {
    cwd: root, env: { ...childEnv, GH_HOST: 'github.com' }, encoding: 'utf8', shell: false,
  });
  if (result.error) {
    if ('code' in result.error && result.error.code === 'ENOENT') {
      throw new Error('GitHub CLI (gh) is not installed or not on PATH. Install it from https://cli.github.com, then run gh auth login --hostname github.com.');
    }
    throw new Error(`Could not start GitHub CLI while ${context}. No local settings were changed.`);
  }
  if (result.status !== 0) {
    if (/HTTP 401|authentication|gh auth login|GH_TOKEN/i.test(result.stderr)) {
      throw new Error(`GitHub authentication failed while ${context}. Run gh auth login --hostname github.com, or correct your GH_TOKEN/GITHUB_TOKEN credentials, then try again.`);
    }
    if (args[0] === 'repo') {
      throw new Error(`GitHub CLI failed while ${context}. Verify this checkout has a GitHub remote (git remote -v), then check gh auth status --hostname github.com and your access to that repository.`);
    }
    throw new Error(`GitHub CLI failed while ${context}. Check gh auth status --hostname github.com and repository collaborator access; classic tokens require repo scope to read Environment variables. Also verify that the exact Environment and its SHOPIFY_STORE variable exist.`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`GitHub CLI returned invalid JSON while ${context}. No local settings were changed.`);
  }
}

export async function main(args: string[] = process.argv.slice(2), env: NodeJS.ProcessEnv = process.env): Promise<void> {
  let environment: string;
  if (!args.length) {
    let mapping;
    try {
      mapping = JSON.parse(await readFile(join(root, 'deployments/shopify.json'), 'utf8'));
    } catch {
      throw new Error('Cannot read deployments/shopify.json. Configure develop.environment before running pnpm github:env-pull.');
    }
    if (typeof mapping?.develop?.environment !== 'string' || !mapping.develop.environment.trim()) {
      throw new Error('deployments/shopify.json must configure a nonempty develop.environment before running pnpm github:env-pull.');
    }
    environment = mapping.develop.environment;
  } else if (args.length === 2 && args[0] === '--environment' && args[1]?.trim() && !/[\x00-\x1f\x7f]/.test(args[1])) {
    environment = args[1];
  } else {
    throw new Error('Usage: pnpm github:env-pull [--environment <exact-GitHub-Environment-name>].');
  }
  const repository = github(['repo', 'view', '--json', 'nameWithOwner'], 'resolving this checkout’s GitHub repository', env);
  const name = repository && typeof repository === 'object' && 'nameWithOwner' in repository ? repository.nameWithOwner : undefined;
  if (typeof name !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(name)) {
    throw new Error('GitHub CLI did not resolve a valid owner/repository from this checkout. Configure its GitHub remote and ensure your GitHub login has repository access.');
  }
  const response = github([
    'api', '--hostname', 'github.com', '--method', 'GET', '--paginate', '--slurp',
    `repos/${name}/environments/${encodeURIComponent(environment)}/variables`,
  ], `reading variables from ${name} Environment ${JSON.stringify(environment)}`, env);
  const variables = new Map<string, string>();
  if (!Array.isArray(response)) {
    throw new Error('GitHub CLI returned an invalid Environment variables collection. No local settings were changed.');
  }
  for (const page of response) {
    if (!page || typeof page !== 'object' || !Array.isArray(page.variables)) {
      throw new Error('GitHub CLI returned an invalid Environment variables collection. No local settings were changed.');
    }
    for (const variable of page.variables) {
      if (!variable || typeof variable.name !== 'string' || typeof variable.value !== 'string') {
        throw new Error('GitHub CLI returned an invalid Environment variable. No local settings were changed.');
      }
      if (variable.name === 'SHOPIFY_STORE' || variable.name === 'SHOPIFY_THEME_PASSWORD') {
        if (variables.has(variable.name)) {
          throw new Error('GitHub CLI returned duplicate Environment variables. No local settings were changed.');
        }
        variables.set(variable.name, variable.value);
      }
    }
  }
  const store = variables.get('SHOPIFY_STORE');
  const password = variables.get('SHOPIFY_THEME_PASSWORD');
  requireStore(store);
  const changed = await updateLiquidEnv(root, store, password);
  console.log(`${changed ? 'Updated' : 'Already configured'} apps/liquid/.env.local: SHOPIFY_FLAG_STORE=${store}; GitHub SHOPIFY_THEME_PASSWORD ${password === undefined ? 'absent (local setting preserved)' : 'present'} (from ${name}, Environment ${JSON.stringify(environment)}).`);
  console.log('Only the Liquid store and optional storefront password were pulled; GitHub secret values cannot be read. Exported SHOPIFY_FLAG_STORE or SHOPIFY_FLAG_STORE_PASSWORD still override this file; unset or update them if needed. No Shopify process was started.');
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  main().catch((error: unknown) => {
    console.error(`GitHub environment pull: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}

import { cp, mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { expect, test, type Page } from 'playwright/test';
import { build } from 'vite';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = fileURLToPath(new URL('./fixtures/public-config/', import.meta.url));
const origin = 'https://public-config.test';

async function appearance(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      background: style.backgroundColor,
      color: style.color,
      radius: style.borderTopLeftRadius,
      padding: style.paddingTop,
      size: style.fontSize,
      leading: style.lineHeight,
      family: style.fontFamily,
    };
  });
}

async function documentDefaults(page: Page) {
  return page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const heading = getComputedStyle(document.querySelector('h1')!);
    return {
      bodyMargin: body.marginTop,
      headingMargin: heading.marginBlockStart,
      headingSize: heading.fontSize,
      headingWeight: heading.fontWeight,
    };
  });
}

test('public configuration supports an isolated native Tailwind consumer', async ({ page }) => {
  const root = await mkdtemp(join(tmpdir(), 'tupak-public-config-'));
  try {
    await cp(fixtureRoot, root, { recursive: true });
    await mkdir(join(root, 'node_modules/@tupak'), { recursive: true });
    await mkdir(join(root, 'node_modules/@fontsource-variable'), { recursive: true });
    // Normal package resolution, outside the workspace: no private CSS alias or inherited Vite config.
    await Promise.all([
      symlink(packageRoot, join(root, 'node_modules/@tupak/design-system'), 'dir'),
      symlink(join(packageRoot, 'node_modules/tailwindcss'), join(root, 'node_modules/tailwindcss'), 'dir'),
      symlink(
        join(packageRoot, 'node_modules/@fontsource-variable/instrument-sans'),
        join(root, 'node_modules/@fontsource-variable/instrument-sans'),
        'dir',
      ),
    ]);
    const result = await build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [tailwindcss()],
      build: {
        write: false,
        minify: false,
        assetsInlineLimit: 0,
        rolldownOptions: {
          input: { full: join(root, 'index.html'), native: join(root, 'native.html') },
        },
      },
    });
    if (Array.isArray(result) || !('output' in result)) {
      throw new Error('Expected a single finite consumer build');
    }
    const assets = new Map(
      result.output.map((asset) => [
        `/${asset.fileName}`,
        asset.type === 'asset' ? Buffer.from(asset.source) : Buffer.from(asset.code),
      ]),
    );
    await page.route(`${origin}/**`, async (route) => {
      const path = new URL(route.request().url()).pathname;
      const body = assets.get(path);
      if (!body) {
        await route.abort();
        return;
      }
      const extension = extname(path);
      const contentType =
        extension === '.html'
          ? 'text/html'
          : extension === '.css'
            ? 'text/css'
            : extension === '.woff2'
              ? 'font/woff2'
              : 'text/javascript';
      await route.fulfill({ body, contentType });
    });

    await page.setContent('<!doctype html><html lang="en"><body><h1>Native reference</h1></body></html>');
    const nativeDefaults = await documentDefaults(page);
    await page.goto(`${origin}/index.html`);

    await test.step('semantic utilities follow runtime tokens and nested overrides', async () => {
      const outer = await appearance(page, '#outer');
      const nested = await appearance(page, '#nested');
      expect(outer).toEqual(await appearance(page, '#outer-reference'));
      expect(nested).toEqual(await appearance(page, '#nested-reference'));
      for (const property of Object.keys(outer) as Array<keyof typeof outer>) {
        expect(nested[property], `Nested override: ${property}`).not.toBe(outer[property]);
      }
      expect(await appearance(page, '#outer')).toEqual(outer);
    });

    await test.step('light and nested dark scopes retain semantic runtime behavior', async () => {
      const light = await appearance(page, '#light');
      const dark = await appearance(page, '#dark');
      expect(light).toEqual(await appearance(page, '#light-reference'));
      expect(dark).toEqual(await appearance(page, '#dark-reference'));
      expect(dark.background).not.toBe(light.background);
      expect(dark.color).not.toBe(light.color);
      await expect(page.locator('#light')).toHaveCSS('color-scheme', 'light');
      await expect(page.locator('#dark')).toHaveCSS('color-scheme', 'dark');
    });

    await test.step('only consumer sources generate utilities and private workbench styles stay private', async () => {
      await expect(page.locator('#source-owned')).toHaveCSS('width', '137px');
      expect(await appearance(page, '#private')).toEqual(await appearance(page, '#private-reference'));
      const selectors = await page.evaluate(() => {
        function collect(rules: CSSRuleList): Array<string> {
          return Array.from(rules).flatMap((rule) => [
            ...(rule instanceof CSSStyleRule ? [rule.selectorText] : []),
            ...('cssRules' in rule ? collect((rule as CSSGroupingRule).cssRules) : []),
          ]);
        }
        return Array.from(document.styleSheets).flatMap((sheet) => collect(sheet.cssRules));
      });
      // grid-cols-11 is a real candidate in the canonical Astro home page, absent from this consumer.
      for (const name of ['grid-cols-11', 'ds-display', 'ds-icon-geometry', 'sg-icon-button', 'sg-metadata']) {
        expect(
          selectors.some((selector) => selector.includes(`.${name}`)),
          name,
        ).toBe(false);
      }
    });

    await test.step('bundled font assets resolve and the public font utilities load real faces', async () => {
      const fonts = await page.evaluate(async () => {
        return Promise.all(
          ['#outer', '#display-font'].map(async (selector) => {
            const family = getComputedStyle(document.querySelector(selector)!).fontFamily.split(',')[0]!;
            const faces = await document.fonts.load(`16px ${family}`, 'Consumer');
            return {
              family: family.trim().replace(/^['"]|['"]$/gu, ''),
              faces: faces.map((face) => ({
                family: face.family.trim().replace(/^['"]|['"]$/gu, ''),
                status: face.status,
              })),
            };
          }),
        );
      });
      for (const { family, faces } of fonts) {
        expect(faces).toContainEqual({ family, status: 'loaded' });
      }
    });

    await test.step('the consumer chooses whether to install Preflight', async () => {
      const fullDefaults = await documentDefaults(page);
      expect(fullDefaults.bodyMargin).toBe('0px');
      expect(fullDefaults.headingMargin).toBe('0px');
      expect(fullDefaults).not.toEqual(nativeDefaults);
      await page.goto(`${origin}/native.html`);
      expect(await documentDefaults(page)).toEqual(nativeDefaults);
      expect(await appearance(page, '#native-utility')).toEqual(await appearance(page, '#native-reference'));
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

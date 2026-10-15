import axe from 'axe-core';
/* eslint-disable no-await-in-loop -- Each check navigates the same browser page and must finish before the next state. */
import { expect, test, type Page } from 'playwright/test';

const sections = [
  'colors',
  'typography',
  'spacing',
  'layout',
  'shape',
  'elevation',
  'iconography',
  'components',
  'sections',
  'theming',
  'motion',
  'variables',
  'contracts',
] as const;

async function mode(page: Page, target: 'light' | 'dark') {
  const dark = await page.locator('html').evaluate((node) => node.classList.contains('dark'));
  if (dark !== (target === 'dark')) {
    await page.locator('#mode-toggle').click();
  }
}

for (const scheme of ['light', 'dark'] as const) {
  test(`Tupak ${scheme}: all sections fit narrow and wide screens`, async ({ page }) => {
    const errors: Array<string> = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await mode(page, scheme);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of sections) {
        await page.locator(`[data-ds-tab="${section}"]`).click();
        await expect(page.locator(`#panel-${section}`)).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('fonts, primary color and Button geometry preserve the provisional starter baseline', async ({ page }) => {
  await page.goto('/#components');
  await page.evaluate(() => document.fonts.ready);
  const primary = page.locator('#panel-components').getByRole('button', { name: 'Primary', exact: true });
  expect(
    await primary.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        color: style.backgroundColor,
        height: node.getBoundingClientRect().height,
        radius: style.borderRadius,
        weight: style.fontWeight,
      };
    }),
  ).toEqual({ color: 'rgb(255, 194, 14)', height: 44, radius: '10px', weight: '700' });
  expect(await page.locator('body > section h1').evaluate((node) => getComputedStyle(node).fontFamily)).toContain(
    'Lobster',
  );
  expect(await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily)).toContain('Nunito');
});

test('native controls and Select expose form values', async ({ page }) => {
  await page.goto('/#components');
  const form = page.locator('#controls-example');
  await form.getByLabel('Email', { exact: true }).fill('designer@example.com');
  await form.getByLabel('Message', { exact: true }).fill('A new theme');
  await form.getByRole('checkbox', { name: 'Accept the terms' }).check();
  await form.getByRole('radio', { name: 'Monthly' }).check();
  const setting = form.getByRole('switch', { name: 'Notifications' });
  await setting.focus();
  await page.keyboard.press('Space');
  await expect(setting).not.toBeChecked();
  const plan = form.getByRole('combobox', { name: 'Plan' });
  await plan.click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  expect(await form.evaluate((node) => Object.fromEntries(new FormData(node as HTMLFormElement)))).toMatchObject({
    email: 'designer@example.com',
    message: 'A new theme',
    terms: 'on',
    frequency: 'monthly',
    plan: 'business',
  });
});

test('semantic color tables align and preserve reference presentation in either mode', async ({ page }) => {
  await page.goto('/#colors');
  for (const scheme of ['light', 'dark'] as const) {
    await mode(page, scheme);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const tables = await page.locator('.sg-color-table').evaluateAll((nodes) =>
        nodes.map((table) => ({
          columns: [...table.querySelectorAll('th')].map((cell) => cell.getBoundingClientRect().x),
          borders: [...table.querySelectorAll('tbody tr:first-child td')].map(
            (cell) => getComputedStyle(cell).borderBottomColor,
          ),
        })),
      );
      for (const table of tables) {
        expect(table.columns).toEqual(tables[0]?.columns);
        expect(new Set(table.borders).size).toBe(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    const primary = page.locator('[data-color-token="--primary"]');
    await expect(primary.locator('[data-color-reference]')).toHaveText(['brand-400', 'brand-400']);
    await expect(primary.locator('[data-css-value]')).toHaveText(['#ffc20e', '#ffc20e']);
    await expect(primary.locator('[data-contrast-mode="light"]')).toHaveText('11.6 · AAA');
    await expect(primary.locator('[data-contrast-mode="dark"]')).toHaveText('11.6 · AAA');
    await expect(page.locator('[data-color-token="--primary-foreground"] [data-contrast-mode="light"]')).toHaveText(
      '11.6 · AAA',
    );
  }
});

test('tabs, dialog, menu and tooltip support keyboard interaction', async ({ page }) => {
  await page.goto('/#components');
  const tabs = page.locator('#panel-components [data-component-tabs]').first();
  await tabs.getByRole('tab', { name: 'Account' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'Billing' })).toBeFocused();
  await expect(tabs.getByRole('tabpanel')).toContainText('Invoices');

  const openDialog = page.locator('#panel-components').getByRole('button', { name: 'Open dialog', exact: true });
  await openDialog.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(openDialog).toBeFocused();

  const menu = page.locator('#panel-components [data-component-menu]').first();
  const trigger = menu.getByRole('button', { name: 'Open menu' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Log out' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(menu.getByRole('status')).toContainText('Selected Log out');

  const tooltip = page.locator('#panel-components [data-component-tooltip]').first();
  await tooltip.getByRole('button').focus();
  await expect(tooltip.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip.getByRole('tooltip')).toBeHidden();
});

test('variable search, copy and mode updates use resolved CSS', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#variables');
  await page.locator('#token-query').fill('--foreground-heading');
  const row = page
    .locator('[data-token-row]')
    .filter({ has: page.getByRole('button', { name: '--foreground-heading', exact: true }) });
  await expect(row.locator('[data-css-value]')).toHaveText('#745600');
  await row.getByRole('button').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('var(--foreground-heading)');
  await row.getByRole('button').click({ modifiers: ['Shift'] });
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('#745600');
  await mode(page, 'dark');
  await expect(row.locator('[data-css-value]')).toHaveText('#ffd068');
  await row.getByRole('button').click({ modifiers: ['Shift'] });
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('#ffd068');
  await page.locator('#token-query').fill('no-such-design-token');
  await expect(page.locator('#token-count')).toHaveText('0 tokens');
  await expect(page.locator('#token-empty')).toBeVisible();
});

test('print reveals documentation and reduced motion removes transitions', async ({ page }) => {
  await page.goto('/#motion');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('[data-motion-dot]')
      .first()
      .evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('1e-05s');
  await page.emulateMedia({ media: 'print' });
  for (const section of sections) {
    await expect(page.locator(`#panel-${section}`)).toBeVisible();
  }
  await expect(page.getByRole('navigation', { name: 'Styleguide sections' })).toBeHidden();
});

test('Tupak component examples have no WCAG A/AA violations in light and dark', async ({ page }) => {
  await page.goto('/#components');
  await page.addScriptTag({ content: axe.source });
  // Audit settled mode colors; motion behavior is verified separately above.
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
  for (const scheme of ['light', 'dark'] as const) {
    await mode(page, scheme);
    const violations = await page.evaluate(async () => {
      const runner = (globalThis as typeof globalThis & { axe: typeof axe }).axe;
      const result = await runner.run('#panel-components', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      });
      return result.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) }));
    });
    expect(violations).toEqual([]);
  }
});

test('starter ramps agree across swatches, hero, copy and variables in both modes without changing feedback', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#colors');
  const ramp = page.locator('#panel-colors [data-css-value^="--palette-brand-"]');
  const baseline = await ramp.allTextContents();
  const feedback = page.locator(
    '#panel-colors [data-css-value^="--palette-success-"], #panel-colors [data-css-value^="--palette-info-"]',
  );
  const feedbackBaseline = await feedback.allTextContents();
  expect(baseline).toEqual([
    '#fffaf1',
    '#fff1d4',
    '#ffe3a7',
    '#ffd068',
    '#ffc20e',
    '#e1aa00',
    '#ba8c00',
    '#916d00',
    '#745600',
    '#604700',
    '#352600',
  ]);
  for (const scheme of ['light', 'dark'] as const) {
    await mode(page, scheme);
    await expect(ramp).toHaveText(baseline);
    await expect(feedback).toHaveText(feedbackBaseline);
    const hero = await page
      .locator('body > section [style*="var(--palette-brand-"]')
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
    const swatches = await page
      .locator('#panel-colors [data-copy-token^="--palette-brand-"]')
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
    expect(hero).toEqual(swatches);
    await page
      .locator('[data-copy-token="--palette-brand-400"]')
      .first()
      .click({ modifiers: ['Shift'] });
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('#ffc20e');
    await page.locator('[data-ds-tab="variables"]').click();
    await expect(page.locator('#panel-variables [data-css-value="--palette-brand-400"]')).toHaveText('#ffc20e');
    await page.locator('[data-ds-tab="colors"]').click();
  }
});

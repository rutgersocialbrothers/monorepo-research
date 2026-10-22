import { expect, test } from 'playwright/test';
/* eslint-disable no-await-in-loop -- Responsive and explicit mode checks exercise the same composed page sequentially. */

test('composed preview fits narrow and wide screens and explicit mode controls hero blending', async ({ page }) => {
  await page.goto('/preview');
  const root = page.locator('html');
  const heroImage = page.locator('#preview-main > section').first().locator('img');
  for (const mode of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: mode === 'light' ? 'dark' : 'light' });
    const dark = await root.evaluate((node) => node.classList.contains('dark'));
    if (dark !== (mode === 'dark')) {
      await page.locator('#mode-toggle').click();
    }
    await expect(root).toHaveClass(new RegExp(`\\b${mode}\\b`, 'u'));
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(heroImage).toHaveCSS('mix-blend-mode', mode === 'light' ? 'multiply' : 'normal');
    }
  }
});

test('preview rail buttons keep focus through repeated keyboard activation at both boundaries', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/preview');
  const rail = page.locator('[data-reference-rail]').first();
  const viewport = rail.locator('[data-rail-viewport]');
  const previous = rail.locator('[data-rail-prev]');
  const next = rail.locator('[data-rail-next]');
  await expect(rail.locator('[data-rail-controls]')).toBeVisible();
  await expect.poll(() => viewport.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeGreaterThan(0);
  const { maximum, step } = await viewport.evaluate((node) => ({
    maximum: node.scrollWidth - node.clientWidth,
    step: node.clientWidth * 0.85,
  }));
  const activationLimit = Math.ceil(maximum / step) + 1;

  for (const key of ['Enter', 'Space']) {
    for (const { button, opposite, direction, endpoint } of [
      { button: next, opposite: previous, direction: 1, endpoint: maximum },
      { button: previous, opposite: next, direction: -1, endpoint: 0 },
    ]) {
      await expect(button).toBeEnabled();
      await button.focus();
      for (let activation = 0; activation < activationLimit; activation += 1) {
        const position = await viewport.evaluate((node) => node.scrollLeft);
        if (Math.abs(position - endpoint) <= 1) {
          break;
        }
        const target = Math.max(0, Math.min(maximum, position + direction * step));
        await page.keyboard.press(key);
        await expect
          .poll(() => viewport.evaluate((node, value) => Math.abs(node.scrollLeft - value), target))
          .toBeLessThanOrEqual(1);
        await expect(button).toBeFocused();
      }
      await expect
        .poll(() => viewport.evaluate((node, value) => Math.abs(node.scrollLeft - value), endpoint))
        .toBeLessThanOrEqual(1);
      await expect(button).toBeDisabled();
      await expect(button).toBeFocused();
      const boundaryPosition = await viewport.evaluate((node) => node.scrollLeft);
      for (const repeatedKey of ['Enter', 'Space']) {
        await page.keyboard.press(repeatedKey);
        await expect(button).toBeFocused();
        await expect(viewport).toHaveJSProperty('scrollLeft', boundaryPosition);
      }
      await button.click({ force: true });
      await button.evaluate((node: HTMLButtonElement) => node.click());
      await expect(button).toBeFocused();
      await expect(viewport).toHaveJSProperty('scrollLeft', boundaryPosition);
      await expect(opposite).toBeEnabled();
    }
  }
});

test('preview rails reach real keyboard boundaries and FAQ summaries toggle natively', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/preview');
  const rail = page.locator('[data-reference-rail]').first();
  const viewport = rail.locator('[data-rail-viewport]');
  const previous = rail.locator('[data-rail-prev]');
  const next = rail.locator('[data-rail-next]');
  const progress = rail.locator('[data-rail-progress]');
  await expect(rail.locator('[data-rail-controls]')).toBeVisible();
  await expect.poll(() => viewport.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeGreaterThan(0);
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await viewport.focus();
  await page.keyboard.press('End');
  await expect(viewport).toBeFocused();
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollWidth - node.clientWidth - node.scrollLeft))
    .toBeLessThanOrEqual(1);
  await expect.poll(() => progress.evaluate((node: HTMLProgressElement) => node.value)).toBeGreaterThanOrEqual(99);
  await page.keyboard.press('Home');
  await expect(viewport).toBeFocused();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBeLessThanOrEqual(1);
  await expect.poll(() => progress.evaluate((node: HTMLProgressElement) => node.value)).toBeLessThanOrEqual(1);

  const question = page.locator('#vragen details').first();
  const summary = question.locator('summary');
  await expect(question).toHaveJSProperty('open', false);
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveJSProperty('open', true);
  await expect(summary).toBeFocused();
  await page.keyboard.press('Space');
  await expect(question).toHaveJSProperty('open', false);
  await expect(summary).toBeFocused();
});

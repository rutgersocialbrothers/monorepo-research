import { expect, test, type Locator, type Page } from 'playwright/test';
/* eslint-disable no-await-in-loop -- Mode checks navigate the same page sequentially. */

async function modeSelect(page: Page, mode: 'light' | 'dark') {
  const dark = await page.locator('html').evaluate((node) => node.classList.contains('dark'));
  if (dark !== (mode === 'dark')) {
    await page.locator('#mode-toggle').click();
  }
}
async function openFamily(page: Page, slug: string) {
  const details = page.locator(`#family-${slug}`);
  if ((await details.getAttribute('open')) === null) {
    await details.locator('summary').click();
  }
}

async function appearance(element: Locator) {
  return element.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      background: style.backgroundColor,
      foreground: style.color,
      scheme: style.colorScheme,
    };
  });
}

test('tabs expose deep links and support keyboard navigation', async ({ page }) => {
  await page.goto('/#components');
  const components = page.getByRole('tab', { name: 'Components', exact: true });
  await expect(components).toHaveAttribute('aria-selected', 'true');
  await components.focus();
  await page.keyboard.press('ArrowRight');
  const sections = page.getByRole('tab', { name: 'Sections', exact: true });
  await expect(sections).toBeFocused();
  await expect(sections).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/#sections$/u);
  await page.keyboard.press('ArrowRight');
  const theming = page.getByRole('tab', { name: 'Theming', exact: true });
  await expect(theming).toBeFocused();
  await expect(theming).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/#theming$/u);
  await page.reload();
  await expect(theming).toHaveAttribute('aria-selected', 'true');
  await theming.focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Colors', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Colors', exact: true })).toBeVisible();
});

test('real field examples retain editable, disabled and invalid semantics', async ({ page }) => {
  await page.goto('/#components');
  const components = page.getByRole('tabpanel', { name: 'Components', exact: true });
  await openFamily(page, 'input');
  await openFamily(page, 'button');
  await openFamily(page, 'select');
  const inputFamily = components.getByRole('region', { name: 'Input', exact: true });
  const email = inputFamily.getByRole('textbox', { name: 'Email address', exact: true });
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  await email.fill('designer@example.com');
  await expect(email).toHaveValue('designer@example.com');
  await expect(inputFamily.locator('input:disabled').first()).toBeDisabled();
  await expect(
    components.getByRole('region', { name: 'Button', exact: true }).locator('button:disabled').first(),
  ).toBeDisabled();

  const select = components.locator('#ds-example-select-error');
  await expect(select).toHaveAttribute('aria-invalid', 'true');
  await expect(select).toHaveAccessibleDescription('Choose an update frequency.');
  await select.focus();
  await page.keyboard.press('ArrowDown');
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  const listId = await select.getAttribute('aria-controls');
  const list = page.locator(`[id="${listId}"]`);
  await expect(list).toBeVisible();
  await page.keyboard.press('End');
  await expect(page.locator(':focus')).toHaveAttribute('role', 'option');
  await expect(page.locator(':focus')).toHaveText('Yearly');
  await page.keyboard.press('Enter');
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await expect(select).toBeFocused();
  await expect(select).toContainText('Yearly');
  await select.click();
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
  await expect(select).toBeFocused();
});

test('select without enabled options keeps trigger focus and can close', async ({ page }) => {
  const errors: Array<Error> = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto('/#components');
  await openFamily(page, 'select');
  const trigger = page.locator('#ds-example-select-error');
  const listId = await trigger.getAttribute('aria-controls');
  const list = page.locator(`[id="${listId}"]`);
  await list.getByRole('option', { includeHidden: true }).evaluateAll((options) => {
    for (const option of options) {
      option.setAttribute('aria-disabled', 'true');
    }
  });

  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(list).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(list).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('Tupak stays fixed while color mode persists and restores on reload', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'tupak');
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Tupak design system', exact: true })).toBeVisible();
  const appearances = [];
  for (const mode of ['light', 'dark'] as const) {
    await modeSelect(page, mode);
    await expect(root).toHaveClass(mode);
    const current = await appearance(page.locator('body'));
    expect(current.scheme).toBe(mode);
    appearances.push(current);
    expect(await page.evaluate(() => localStorage.getItem('tupak-design-system-mode'))).toBe(mode);
    expect(await page.evaluate(() => localStorage.getItem('tupak-design-system-theme'))).toBeNull();
    await page.reload();
    await expect(root).toHaveClass(mode);
    await expect(root).toHaveAttribute('data-theme', 'tupak');
    expect(await appearance(page.locator('body'))).toEqual(current);
  }
  expect(appearances[0]?.background).not.toBe(appearances[1]?.background);
  expect(appearances[0]?.foreground).not.toBe(appearances[1]?.foreground);
});

for (const storedMode of ['dark', 'light', 'invalid-mode', null] as const) {
  test(`mode restoration handles ${String(storedMode)} without restoring a stale theme`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem('tupak-design-system-theme', 'unknown-theme');
      localStorage.setItem('obsolete-design-system-theme', 'stale-theme');
      if (value === null) {
        localStorage.removeItem('tupak-design-system-mode');
      } else {
        localStorage.setItem('tupak-design-system-mode', value);
      }
    }, storedMode);
    await page.goto('/#colors');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'tupak');
    await expect(page.locator('html')).toHaveClass(storedMode === 'dark' ? 'dark' : 'light');
    await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveCount(0);
  });
}

test('unavailable mode storage preserves usable default mode and an in-memory toggle', async ({ page }) => {
  const errors: Array<Error> = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.addInitScript(() => {
    // Astro's dev toolbar uses storage too; deny only the application's mode key.
    const { getItem, setItem } = Storage.prototype;
    Storage.prototype.getItem = function (key) {
      if (key === 'tupak-design-system-mode') {
        throw new DOMException('Storage unavailable', 'SecurityError');
      }
      return Reflect.apply(getItem, this, [key]) as string | null;
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === 'tupak-design-system-mode') {
        throw new DOMException('Storage unavailable', 'SecurityError');
      }
      Reflect.apply(setItem, this, [key, value]);
    };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'tupak');
  await expect(page.locator('html')).toHaveClass('light');
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
  await expect(page.locator('html')).toHaveClass('light');
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveClass('light');
  expect(errors).toEqual([]);
});

const scopes = [
  { label: 'Dark scope', mode: 'dark', conflictingMode: 'light' },
  { label: 'Mixed scope', mode: 'light', conflictingMode: 'dark' },
  // The theme-only reset sits inside the explicit outer dark scope, so it inherits dark.
  { label: 'Theme-only scope', mode: 'dark', conflictingMode: 'light' },
  { label: 'Mode-only scope', mode: 'light', conflictingMode: 'dark' },
] as const;

for (const scope of scopes) {
  test(`${scope.label} keeps its popup appearance under a conflicting root`, async ({ page }) => {
    await page.goto('/#components');
    await openFamily(page, 'select');
    const rootSelect = page.locator('#ds-example-select-error');

    async function popupAppearance(trigger: Locator) {
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      const listId = await trigger.getAttribute('aria-controls');
      const popup = page.locator(`[id="${listId}"]`);
      await expect(popup).toBeVisible();
      const result = {
        trigger: await appearance(trigger),
        popup: await appearance(popup),
        option: await appearance(page.locator(':focus')),
      };
      await page.keyboard.press('Escape');
      await expect(popup).toBeHidden();
      await expect(trigger).toBeFocused();
      return result;
    }

    await modeSelect(page, scope.mode);
    const expected = await popupAppearance(rootSelect);
    expect(expected.trigger.scheme).toBe(scope.mode);
    expect(expected.popup.scheme).toBe(scope.mode);
    await modeSelect(page, scope.conflictingMode);
    const scopedSelect = page.getByRole('combobox', { name: scope.label, exact: true });
    expect(await popupAppearance(scopedSelect)).toEqual(expected);
  });
}

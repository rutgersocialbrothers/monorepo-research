import { expect, test, type Locator, type Page } from 'playwright/test';
/* eslint-disable no-await-in-loop -- Slide, card and preview checks walk the same rendered page sequentially. */

const slideCount = 3;

function dot(slider: Locator, position: number) {
  return slider.getByRole('button', { name: new RegExp(`^Dia ${position + 1}:`, 'u') });
}

/**
 * One slide is scrolled into view, announced by its dot and the only one reachable by keyboard.
 */
async function expectCurrentSlide(slider: Locator, index: number) {
  const viewport = slider.locator('[data-slider-viewport]');
  await expect
    .poll(() => viewport.evaluate((node, target) => Math.abs(node.scrollLeft - target * node.clientWidth), index))
    .toBeLessThanOrEqual(1);
  for (let position = 0; position < slideCount; position += 1) {
    if (position === index) {
      await expect(dot(slider, position)).toHaveAttribute('aria-current', 'true');
    } else {
      await expect(dot(slider, position)).not.toHaveAttribute('aria-current');
    }
    await expect(slider.locator('[data-slide]').nth(position)).toHaveJSProperty('inert', position !== index);
  }
}

test('image slider opens on the second slide, wraps both ways and keeps only the current slide reachable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/section-image-slider');
  const slider = page.locator('[data-image-slider]').first();
  const viewport = slider.locator('[data-slider-viewport]');
  const previous = slider.getByRole('button', { name: 'Vorige dia', exact: true });
  const next = slider.getByRole('button', { name: 'Volgende dia', exact: true });
  await expect(next).toBeVisible();
  await expectCurrentSlide(slider, 1);

  // Tab from the scroll row lands on the visible slide's action, skipping the inert neighbours.
  await viewport.focus();
  await page.keyboard.press('Tab');
  const activeAction = slider.getByRole('link', { name: /Bekijk de branches/u });
  await expect(activeAction).toBeFocused();
  // Arrow keys on a focused slide action belong to the action: no slide change, no focus dropped to the body.
  await page.keyboard.press('ArrowRight');
  await expect(activeAction).toBeFocused();
  await expectCurrentSlide(slider, 1);
  await page.keyboard.press('ArrowLeft');
  await expect(activeAction).toBeFocused();
  await expectCurrentSlide(slider, 1);
  // The scroll row itself still steps with the arrow keys.
  await viewport.focus();
  await page.keyboard.press('ArrowRight');
  await expectCurrentSlide(slider, 2);
  await expect(viewport).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expectCurrentSlide(slider, 1);
  await expect(viewport).toBeFocused();

  await next.focus();
  await page.keyboard.press('Enter');
  await expectCurrentSlide(slider, 2);
  await expect(next).toBeFocused();
  await page.keyboard.press('Enter');
  await expectCurrentSlide(slider, 0);
  await expect(next).toBeFocused();

  await previous.focus();
  await page.keyboard.press('Space');
  await expectCurrentSlide(slider, 2);
  await expect(previous).toBeFocused();

  await dot(slider, 0).click();
  await expectCurrentSlide(slider, 0);
  await expect(dot(slider, 0)).toBeFocused();

  await viewport.focus();
  await page.keyboard.press('ArrowLeft');
  await expectCurrentSlide(slider, 2);
  await expect(viewport).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expectCurrentSlide(slider, 0);
  await expect(viewport).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(slider.getByRole('link', { name: /Vraag een offerte aan/u })).toBeFocused();

  // A single slide offers no stepping controls and stays fully reachable.
  const single = page.locator('[data-image-slider]').last();
  await expect(single.getByRole('button')).toHaveCount(0);
  await expect(single.locator('[data-slide]')).toHaveJSProperty('inert', false);
  await single.locator('[data-slider-viewport]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(single.locator('[data-slide]')).toHaveJSProperty('inert', false);
  await page.keyboard.press('Tab');
  await expect(single.getByRole('link', { name: /Bekijk de branches/u })).toBeFocused();
});

async function overviewLayout(page: Page) {
  const cards = page.locator('#overview-main article');
  const [first, second] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
  const thumbnail = await cards.nth(0).locator('img').boundingBox();
  const heading = await cards.nth(0).getByRole('heading').boundingBox();
  if (!first || !second || !thumbnail || !heading) {
    throw new Error('Overview cards are not rendered');
  }
  if (Math.abs(first.y - second.y) <= 1 && second.x > first.x + first.width) {
    return 'grid';
  }
  if (second.y >= first.y + first.height && thumbnail.x + thumbnail.width <= heading.x) {
    return 'list';
  }
  return 'unknown';
}

test('overview view switch lays cards out, persists a choice and lets ?view override without overwriting it', async ({
  page,
}) => {
  await page.goto('/overview');
  const switches = page.getByRole('group', { name: 'Weergave', exact: true });
  const grid = switches.getByRole('button', { name: 'Grid', exact: true });
  const list = switches.getByRole('button', { name: 'Lijst', exact: true });
  await expect(grid).toHaveAttribute('aria-pressed', 'true');
  await expect(list).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => overviewLayout(page)).toBe('grid');

  await list.click();
  await expect(list).toHaveAttribute('aria-pressed', 'true');
  await expect(grid).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => overviewLayout(page)).toBe('list');

  await page.reload();
  await expect(list).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => overviewLayout(page)).toBe('list');

  await page.goto('/overview?view=grid');
  await expect(grid).toHaveAttribute('aria-pressed', 'true');
  await expect(list).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => overviewLayout(page)).toBe('grid');

  // The query override is not a choice: the stored list view returns, and an unknown value falls back to it.
  await page.goto('/overview?view=mosaic');
  await expect(list).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => overviewLayout(page)).toBe('list');

  // The whole card opens its live section, while its secondary links stay independently clickable.
  const card = page
    .locator('#overview-main article')
    .filter({ has: page.getByRole('heading', { name: 'Beeldslider' }) });
  // A real pointer click on the thumbnail: the title link's stretched overlay, not the image, receives it.
  await card.locator('img').scrollIntoViewIfNeeded();
  const thumbnail = await card.locator('img').boundingBox();
  if (!thumbnail) {
    throw new Error('Beeldslider thumbnail is not rendered');
  }
  await page.mouse.click(thumbnail.x + thumbnail.width / 2, thumbnail.y + thumbnail.height / 2);
  await expect(page).toHaveURL(/\/section-image-slider$/u);
  await page.goBack();
  await card
    .getByRole('list', { name: 'Links voor Beeldslider' })
    .getByRole('link', { name: 'Op de branchespagina' })
    .click();
  await expect(page).toHaveURL(/\/branches$/u);
  await page.goBack();
  await card.getByRole('link', { name: 'Beeldslider', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/section-image-slider$/u);
});

test('preview Branches menu closes on Escape from inside its panel and returns focus to its toggle', async ({
  page,
}) => {
  await page.goto('/preview');
  const header = page.locator('[data-site-header]');
  const assortiment = header.locator('details').filter({ has: page.locator('summary', { hasText: 'Assortiment' }) });
  const branches = header.locator('details').filter({ has: page.locator('summary', { hasText: 'Branches' }) });
  const branchesToggle = branches.locator('summary');

  await assortiment.locator('summary').click();
  await expect(assortiment).toHaveJSProperty('open', true);
  await branchesToggle.focus();
  await page.keyboard.press('Enter');
  await expect(branches).toHaveJSProperty('open', true);
  await expect(assortiment).toHaveJSProperty('open', false);

  await page.keyboard.press('Tab');
  await expect(branches.getByRole('link', { name: 'Wijn en drank', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(branches).toHaveJSProperty('open', false);
  await expect(branchesToggle).toBeFocused();
  await expect(branches.getByRole('link', { name: 'Wijn en drank', exact: true })).toBeHidden();

  await page.keyboard.press('Enter');
  await expect(branches.getByRole('link', { name: 'Alle branches', exact: true })).toBeVisible();
  await page.getByText('Tupak ontwerpkandidaat', { exact: true }).click();
  await expect(branches).toHaveJSProperty('open', false);
});

function sparkAnimations(page: Page) {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect instanceof KeyframeEffect &&
          animation.effect.target instanceof Element &&
          animation.effect.target.matches('[data-sale-spark]'),
      )
      .map((animation) => animation.playState),
  );
}

/**
 * How far every star animation advances over two rendered frames.
 */
function sparkProgress(page: Page) {
  return page.evaluate(async () => {
    const animations = document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect instanceof KeyframeEffect &&
          animation.effect.target instanceof Element &&
          animation.effect.target.matches('[data-sale-spark]'),
      );
    const before = animations.map((animation) => Number(animation.currentTime));
    const { promise, resolve } = Promise.withResolvers<void>();
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    await promise;
    return animations.map((animation, index) => Number(animation.currentTime) - (before[index] ?? 0));
  });
}

test('sale stars pause on request, keep that choice across motion changes and never run under reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/preview');
  const pause = page.getByRole('button', { name: 'Sterrenanimatie pauzeren', exact: true });
  const stars = page.locator('[data-site-header] [data-sale-spark]');
  await expect(pause).toBeVisible();
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => sparkAnimations(page)).toEqual(['running', 'running', 'running']);
  for (const advance of await sparkProgress(page)) {
    expect(advance).toBeGreaterThan(0);
  }

  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => sparkAnimations(page)).toEqual(['paused', 'paused', 'paused']);
  expect(await sparkProgress(page)).toEqual([0, 0, 0]);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pause).toBeHidden();
  await expect.poll(() => sparkAnimations(page)).toEqual([]);
  for (const star of await stars.all()) {
    await expect(star).toBeVisible();
    await expect.poll(() => star.evaluate((node) => getComputedStyle(node).opacity)).toBe('1');
  }

  // Motion allowed again: the stars return, but the visitor's pause still holds.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(pause).toBeVisible();
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => sparkAnimations(page)).toEqual(['paused', 'paused', 'paused']);
  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => sparkAnimations(page)).toEqual(['running', 'running', 'running']);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(stars.first()).toBeVisible();
  await expect(pause).toBeHidden();
  expect(await sparkAnimations(page)).toEqual([]);
});

test('section thumbnail mode isolates the chosen preview at capture size or exposes every preview', async ({
  page,
}) => {
  const previews = page.locator('[data-section-preview]');
  const chrome = [
    page.getByRole('heading', { level: 1, name: 'Beeldslider' }),
    page.getByText(/^Variant 1 ·/u),
    page.getByRole('link', { name: 'Sectie-overzicht', exact: true }),
    page.getByRole('heading', { name: 'Besluiten' }),
  ];

  await page.goto('/section-image-slider?thumb=2');
  const chosen = previews.nth(1);
  await expect(chosen).toBeVisible();
  for (const index of [0, 2, 3]) {
    await expect(previews.nth(index)).toBeHidden();
  }
  for (const element of chrome) {
    await expect(element).toBeHidden();
  }
  // The second variant is the one that opens on its first slide.
  await expect(dot(chosen, 0)).toHaveAttribute('aria-current', 'true');
  await expect(chosen.getByRole('button', { name: 'Volgende dia', exact: true })).toBeVisible();
  const capture = await chosen.boundingBox();
  expect(capture?.width).toBe(1200);
  expect(capture?.height).toBe(800);

  // Out-of-range picks clamp to the last preview, the single-slide edge case.
  await page.goto('/section-image-slider?thumb=99');
  await expect(previews.last()).toBeVisible();
  await expect(previews.first()).toBeHidden();
  await expect(previews.last().getByRole('button')).toHaveCount(0);

  await page.goto('/section-image-slider?thumb=all');
  for (const element of chrome) {
    await expect(element).toBeHidden();
  }
  const expectedStart = [1, 0, 1];
  for (const [index, start] of expectedStart.entries()) {
    const preview = previews.nth(index);
    await expect(preview).toBeVisible();
    await expect(dot(preview, start)).toHaveAttribute('aria-current', 'true');
  }
  await expect(previews.nth(3)).toBeVisible();
  await expect(previews.nth(3).getByRole('link', { name: /Bekijk de branches/u })).toBeVisible();
});

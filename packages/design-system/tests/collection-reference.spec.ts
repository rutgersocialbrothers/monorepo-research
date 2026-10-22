import { expect, test, type Locator, type Page } from 'playwright/test';
/* eslint-disable no-await-in-loop -- The reset check walks the three size fields sequentially. */

/*
 * Collection, keuzehulp and product reference behaviour (prototype 6f9c7e2). Expected products are derived by hand
 * from the source fixtures in collection.data.ts (inner sizes in mm, best-selling rank order) and product.data.ts
 * (variants, bundles, quantity breaks), not from the implementation's own helpers.
 */

const lengteKlasse = 'filter.v.m.custom.lengte_klasse';
const breedteKlasse = 'filter.v.m.custom.breedte_klasse';
const hoogteKlasse = 'filter.v.m.custom.hoogte_klasse';

/**
 * Every fixture product in best-selling (rank) order; the custom "Maatwerk dozen" has no size.
 */
const allProducts = [
  'Amerikaanse vouwdoos', // 310 × 220 × 250
  'Papieren verzendzakken', // 400 × 300 × 80
  'Verzendkokers met deksel', // 750 × 100 × 100
  'Magneetdozen', // 220 × 160 × 100
  'Brievenbusdoos A4', // 310 × 220 × 30
  'Verzendzak met dubbele plakstrip', // 450 × 350 × 60
  'Geschenkdoos met magneetsluiting', // 330 × 220 × 100
  'Kartonnen koker bruin', // 600 × 60 × 60
  'Maatwerk dozen',
];

/**
 * Titles of the cards currently listed, in displayed order.
 */
function shownTitles(page: Page) {
  return page
    .locator('[data-product-grid] > li:not([hidden])')
    .evaluateAll((items) => items.map((item) => (item as HTMLElement).dataset.title));
}

function query(page: Page) {
  return new URL(page.url()).searchParams;
}

function sizeField(page: Page, dimension: 'lengte' | 'breedte' | 'hoogte') {
  return page.locator(`form[data-filters] [data-size-input="${dimension}"]`);
}

const activeCount = (page: Page) => page.locator('[data-filter-toggle] [data-filter-count]');

test('size fields filter by 100 mm floor class, write every class up to the largest listed and reset to an unfiltered URL', async ({
  page,
}) => {
  // Shared link: lengte from 400 mm, breedte from 200 mm (an incomplete class list), plus a branch the page only echoes.
  await page.goto(
    `/collection?${new URLSearchParams([
      ['branche', 'Horeca'],
      [lengteKlasse, '400–499'],
      [breedteKlasse, '200–299'],
    ])}`,
  );
  await expect(sizeField(page, 'lengte')).toHaveValue('400');
  await expect(sizeField(page, 'breedte')).toHaveValue('200');
  await expect(sizeField(page, 'hoogte')).toHaveValue('');
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Papieren verzendzakken', 'Verzendzak met dubbele plakstrip', 'Maatwerk dozen']);
  await expect(page.locator('[data-product-count]')).toHaveText('3 producten');
  await expect(activeCount(page)).toHaveText(/^\s*\(2\)$/u);

  // 399 mm is still class 300–399: a 310 mm box is listed although it is smaller than typed (source class semantics).
  await sizeField(page, 'lengte').fill('399');
  await expect
    .poll(() => shownTitles(page))
    .toEqual([
      'Amerikaanse vouwdoos',
      'Papieren verzendzakken',
      'Brievenbusdoos A4',
      'Verzendzak met dubbele plakstrip',
      'Geschenkdoos met magneetsluiting',
      'Maatwerk dozen',
    ]);
  await expect
    .poll(() => query(page).getAll(lengteKlasse))
    .toEqual(['300–399', '400–499', '500–599', '600–699', '700–799']);
  // The first write normalises the shared breedte list to every class up to the largest listed breedte (350 mm).
  expect(query(page).getAll(breedteKlasse)).toEqual(['200–299', '300–399']);
  expect(query(page).get('branche')).toBe('Horeca');

  // 400 mm crosses into class 400–499 and drops every 3xx box.
  await sizeField(page, 'lengte').fill('400');
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Papieren verzendzakken', 'Verzendzak met dubbele plakstrip', 'Maatwerk dozen']);
  await expect.poll(() => query(page).getAll(lengteKlasse)).toEqual(['400–499', '500–599', '600–699', '700–799']);

  // Emptying a field removes its classes and its share of the active count.
  await sizeField(page, 'breedte').fill('');
  await expect
    .poll(() => shownTitles(page))
    .toEqual([
      'Papieren verzendzakken',
      'Verzendkokers met deksel',
      'Verzendzak met dubbele plakstrip',
      'Kartonnen koker bruin',
      'Maatwerk dozen',
    ]);
  await expect.poll(() => query(page).getAll(breedteKlasse)).toEqual([]);
  await expect(activeCount(page)).toHaveText(/^\s*\(1\)$/u);

  // Above every listed box only the typed class is written, so the asked size survives a reload; only the
  // size-less custom product remains.
  await sizeField(page, 'lengte').fill('900');
  await expect.poll(() => shownTitles(page)).toEqual(['Maatwerk dozen']);
  await expect(page.locator('[data-product-count]')).toHaveText('1 product');
  await expect.poll(() => query(page).getAll(lengteKlasse)).toEqual(['900–999']);
  await page.reload();
  await expect(sizeField(page, 'lengte')).toHaveValue('900');
  await expect.poll(() => shownTitles(page)).toEqual(['Maatwerk dozen']);

  // Reset clears every field and every filter parameter but keeps what the page does not own.
  await page.locator('form[data-filters] [data-filter-reset]').click();
  await expect.poll(() => [...query(page).keys()]).toEqual(['branche']);
  expect(query(page).get('branche')).toBe('Horeca');
  for (const dimension of ['lengte', 'breedte', 'hoogte'] as const) {
    await expect(sizeField(page, dimension)).toHaveValue('');
  }
  await expect.poll(() => shownTitles(page)).toEqual(allProducts);
  await expect(activeCount(page)).toHaveText('');

  // The reset is its own history entry: Back returns to the filtered state.
  await page.goBack();
  await expect(sizeField(page, 'lengte')).toHaveValue('900');
  await expect.poll(() => shownTitles(page)).toEqual(['Maatwerk dozen']);
});

test('checkbox, price and sort combine, Back and Forward restore list and inputs, branche and lijst are echoed not filtered', async ({
  page,
}) => {
  // The header's Branches entry and sale chip hand these over; the prototype has no logic for either.
  await page.goto('/collection?branche=Wijn+en+drank&lijst=sale');
  const initialSearch = new URL(page.url()).search;
  const handoff = page.locator('[data-handoff]');
  await expect(handoff).toBeVisible();
  await expect(handoff.locator('dd')).toHaveText(['Wijn en drank', 'sale']);
  await expect.poll(() => shownTitles(page)).toEqual(allProducts);
  await expect(page.locator('[data-product-count]')).toHaveText('9 producten');

  const massief = page.getByRole('checkbox', { name: 'Massief karton', exact: true });
  const priceMax = page.getByRole('slider', { name: 'Prijs per stuk, maximum in euro' });
  const sort = page.locator('[data-product-sort]');

  await page.locator('details[data-filter-part]', { hasText: 'Materiaal' }).locator('summary').click();
  await massief.check();
  // Facet values exclude the custom product: it has no material.
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Verzendkokers met deksel', 'Magneetdozen', 'Geschenkdoos met magneetsluiting', 'Kartonnen koker bruin']);
  await expect.poll(() => query(page).getAll('filter.p.m.custom.materiaal')).toEqual(['massief-karton']);

  // Across filters all must match: at most € 1,00 drops Magneetdozen (€ 1,17) and the Geschenkdoos (€ 1,49).
  await priceMax.fill('1');
  await expect.poll(() => shownTitles(page)).toEqual(['Verzendkokers met deksel', 'Kartonnen koker bruin']);
  await expect.poll(() => query(page).get('filter.v.price.lte')).toBe('1');
  expect(query(page).has('filter.v.price.gte')).toBe(false);
  await expect(activeCount(page)).toHaveText(/^\s*\(2\)$/u);

  // Sorting reorders only the filtered set.
  await sort.selectOption('price-ascending');
  await expect.poll(() => shownTitles(page)).toEqual(['Kartonnen koker bruin', 'Verzendkokers met deksel']);
  await expect.poll(() => query(page).get('sort_by')).toBe('price-ascending');
  expect(query(page).get('branche')).toBe('Wijn en drank');
  expect(query(page).get('lijst')).toBe('sale');

  // Each committed change was one history entry; Back walks them in reverse, restoring the controls too.
  await page.goBack();
  await expect.poll(() => shownTitles(page)).toEqual(['Verzendkokers met deksel', 'Kartonnen koker bruin']);
  await expect(sort).toHaveValue('best-selling');
  await expect(priceMax).toHaveValue('1');

  await page.goBack();
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Verzendkokers met deksel', 'Magneetdozen', 'Geschenkdoos met magneetsluiting', 'Kartonnen koker bruin']);
  await expect(priceMax).toHaveValue('2');
  await expect(massief).toBeChecked();

  await page.goBack();
  await expect.poll(() => shownTitles(page)).toEqual(allProducts);
  await expect(massief).not.toBeChecked();
  expect(new URL(page.url()).search).toBe(initialSearch);
  await expect(activeCount(page)).toHaveText('');

  await page.goForward();
  await page.goForward();
  await page.goForward();
  await expect.poll(() => shownTitles(page)).toEqual(['Kartonnen koker bruin', 'Verzendkokers met deksel']);
  await expect(sort).toHaveValue('price-ascending');
  await expect(priceMax).toHaveValue('1');
  await expect(massief).toBeChecked();
  await expect(handoff.locator('dd')).toHaveText(['Wijn en drank', 'sale']);
});

test('a size beyond integer precision writes only its own class and the filters stay responsive', async ({ page }) => {
  await page.goto('/collection');
  // 1e18 mm is class 1e16, past 2^53 where counting classes up to the largest listed one could never end.
  await sizeField(page, 'lengte').fill('1e18');
  await expect.poll(() => shownTitles(page)).toEqual(['Maatwerk dozen']);
  await expect
    .poll(() =>
      query(page)
        .getAll(lengteKlasse)
        .map((value) => Number.parseInt(value, 10)),
    )
    .toEqual([1e18]);

  // A further filter still applies: colour excludes the size-less custom product too, so nothing is left.
  await page.locator('details[data-filter-part]', { hasText: 'Kleur' }).locator('summary').click();
  await page.getByRole('checkbox', { name: 'Bruin', exact: true }).check();
  await expect.poll(() => shownTitles(page)).toEqual([]);
  await expect(page.locator('[data-product-empty]')).toBeVisible();
  await expect.poll(() => query(page).getAll('filter.v.option.kleur')).toEqual(['bruin']);
  expect(query(page).getAll(lengteKlasse)).toHaveLength(1);

  await sizeField(page, 'lengte').fill('');
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Amerikaanse vouwdoos', 'Papieren verzendzakken', 'Magneetdozen', 'Kartonnen koker bruin']);
  await expect.poll(() => query(page).getAll(lengteKlasse)).toEqual([]);
});

test('head variant follows Back and Forward and survives later filter changes', async ({ page }) => {
  await page.goto('/collection');
  const panel = page.locator('section[data-panel]');
  // The first decorative layer carries the head fill: a gradient for the trial, plain navy otherwise.
  const fill = panel.locator(':scope > span[aria-hidden="true"]').first();
  const gradient = page.getByRole('radio', { name: /verloop \(trial/u });
  const navy = page.getByRole('radio', { name: /zonder verloop/u });
  const massief = page.getByRole('checkbox', { name: 'Massief karton', exact: true });

  await page.locator('details[data-filter-part]', { hasText: 'Materiaal' }).locator('summary').click();
  await massief.check();
  await navy.check();
  await expect(panel).toHaveAttribute('data-surface', 'navy');
  await expect(fill).toHaveCSS('background-image', 'none');
  await expect.poll(() => query(page).get('kop')).toBe('navy');

  await page.goBack();
  await expect(gradient).toBeChecked();
  await expect(panel).toHaveAttribute('data-surface', 'gradient');
  await expect(fill).toHaveCSS('background-image', /linear-gradient/u);

  await page.goForward();
  await expect(navy).toBeChecked();
  await expect(panel).toHaveAttribute('data-surface', 'navy');
  await expect(fill).toHaveCSS('background-image', 'none');
  await expect(massief).toBeChecked();

  // A later filter change keeps the chosen head in the URL and on the page.
  await page.locator('details[data-filter-part]', { hasText: 'Kleur' }).locator('summary').click();
  await page.getByRole('checkbox', { name: 'Bruin', exact: true }).check();
  await expect.poll(() => query(page).getAll('filter.v.option.kleur')).toEqual(['bruin']);
  expect(query(page).get('kop')).toBe('navy');
  await expect(navy).toBeChecked();
  await expect(panel).toHaveAttribute('data-surface', 'navy');
});

function drawingLabel(scope: Locator, dimension: 'lengte' | 'breedte' | 'hoogte') {
  return scope.locator(`[data-box-preview] [data-label="${dimension}"]`);
}

test('keuzehulp hands over centimetres that become millimetre size fields, classes and drawing labels', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/section-keuzehulp');
  const keuzehulp = page.locator('[data-section-preview]');
  const form = keuzehulp.locator('form[data-keuzehulp]');
  const field = (name: string) => form.getByRole('spinbutton', { name: new RegExp(`^${name}`, 'u') });

  await field('Lengte').fill('30.5');
  await field('Breedte').fill('20');
  await expect(drawingLabel(keuzehulp, 'lengte')).toHaveText('30,5 cm');
  await expect(drawingLabel(keuzehulp, 'hoogte')).not.toHaveAttribute('data-on');

  // Without a height nothing is handed over; the empty field is marked and focused.
  await form.getByRole('button', { name: /Toon beschikbare verpakkingen/u }).click();
  await expect(field('Hoogte')).toHaveAttribute('aria-invalid', 'true');
  await expect(field('Hoogte')).toBeFocused();
  expect(new URL(page.url()).pathname).toBe('/section-keuzehulp');

  await field('Hoogte').fill('15');
  await expect(drawingLabel(keuzehulp, 'hoogte')).toHaveText('15 cm');
  await form.getByRole('button', { name: /Toon beschikbare verpakkingen/u }).click();
  await page.waitForURL((url) => url.pathname === '/collection');
  expect(query(page).get('categorie')).toBe('kartonnen-dozen');
  expect([query(page).get('lengte'), query(page).get('breedte'), query(page).get('hoogte')]).toEqual([
    '30.5',
    '20',
    '15',
  ]);

  // Centimetres arrive as millimetre minimums, in the fields and on the sidebar drawing.
  const filters = page.locator('form[data-filters]');
  await expect(sizeField(page, 'lengte')).toHaveValue('305');
  await expect(sizeField(page, 'breedte')).toHaveValue('200');
  await expect(sizeField(page, 'hoogte')).toHaveValue('150');
  await expect(drawingLabel(filters, 'lengte')).toHaveText('305 mm');
  await expect(drawingLabel(filters, 'hoogte')).toHaveText('150 mm');
  // lengte ≥ 3xx, breedte ≥ 2xx, hoogte ≥ 1xx.
  await expect
    .poll(() => shownTitles(page))
    .toEqual(['Amerikaanse vouwdoos', 'Geschenkdoos met magneetsluiting', 'Maatwerk dozen']);
  await expect(activeCount(page)).toHaveText(/^\s*\(3\)$/u);
  // The keuzehulp's slug is no menu name: shown as unresolved, not mapped or dropped.
  await expect(page.locator('[data-handoff] dd')).toHaveText(['kartonnen-dozen']);

  // The first change replaces the centimetre handover with size classes and keeps the category.
  await sizeField(page, 'hoogte').fill('');
  await expect.poll(() => query(page).has('lengte')).toBe(false);
  expect(query(page).has('breedte')).toBe(false);
  expect(query(page).has('hoogte')).toBe(false);
  expect(query(page).getAll(lengteKlasse)).toEqual(['300–399', '400–499', '500–599', '600–699', '700–799']);
  expect(query(page).getAll(breedteKlasse)).toEqual(['200–299', '300–399']);
  expect(query(page).getAll(hoogteKlasse)).toEqual([]);
  expect(query(page).get('categorie')).toBe('kartonnen-dozen');
  await expect(drawingLabel(filters, 'hoogte')).not.toHaveAttribute('data-on');
  await expect(drawingLabel(filters, 'lengte')).toHaveText('305 mm');
  const lengthAndWidth = [
    'Amerikaanse vouwdoos',
    'Papieren verzendzakken',
    'Brievenbusdoos A4',
    'Verzendzak met dubbele plakstrip',
    'Geschenkdoos met magneetsluiting',
    'Maatwerk dozen',
  ];
  await expect.poll(() => shownTitles(page)).toEqual(lengthAndWidth);

  // A class URL restores the class's lower bound, not the typed 305 mm.
  await page.reload();
  await expect(sizeField(page, 'lengte')).toHaveValue('300');
  await expect(sizeField(page, 'breedte')).toHaveValue('200');
  await expect(sizeField(page, 'hoogte')).toHaveValue('');
  await expect(drawingLabel(filters, 'lengte')).toHaveText('300 mm');
  await expect.poll(() => shownTitles(page)).toEqual(lengthAndWidth);
});

test('product buy box and order matrix follow variant, bundles and breaks, and only simulate the cart', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requested: string[] = [];
  page.on('request', (request) => requested.push(new URL(request.url()).pathname));
  await page.goto('/product');

  const buy = page.locator('form[data-buy-box]');
  const variant = buy.locator('[data-buy-variant]');
  const quantity = buy.locator('[data-buy-qty]');
  const price = buy.locator('[data-buy-price]');
  const total = buy.locator('[data-buy-total]');
  const activeBreak = buy.locator('[data-buy-tiers] tr[data-active] th');
  const more = buy.getByRole('button', { name: 'Meer', exact: true });
  const less = buy.getByRole('button', { name: 'Minder', exact: true });

  // Default art.nr. 1536: bundles of 25 from 25; € 0,59 from 25, € 0,55 from 50.
  await expect(variant).toHaveValue('1536');
  await expect(quantity).toHaveValue('25');
  await expect(price).toHaveText('€ 0,59');
  await expect(total).toHaveText('€ 14,75');

  await more.click();
  await expect(quantity).toHaveValue('50');
  await expect(price).toHaveText('€ 0,55');
  await expect(total).toHaveText('€ 27,50');
  await expect(activeBreak).toHaveText('50+');
  await less.click();
  await less.click();
  await expect(quantity).toHaveValue('25');
  await expect(activeBreak).toHaveText('25+');

  // Art.nr. 1548 sells in bundles of 20 from 20: the quantity snaps, breaks, stock, drawing and URL follow.
  await variant.selectOption('1548');
  await expect.poll(() => query(page).get('variant')).toBe('1548');
  await expect(quantity).toHaveValue('20');
  await expect(price).toHaveText('€ 1,04');
  await expect(total).toHaveText('€ 20,80');
  await expect(activeBreak).toHaveText('20+');
  await expect(buy.locator('[data-buy-stock]')).toHaveText('Levertijd 5 werkdagen');
  const specs = page.locator('#specificaties');
  await expect(drawingLabel(specs, 'lengte')).toHaveText('400 mm');
  await expect(drawingLabel(specs, 'breedte')).toHaveText('300 mm');
  await expect(drawingLabel(specs, 'hoogte')).toHaveText('200 mm');
  await more.click();
  await expect(quantity).toHaveValue('40');
  await expect(price).toHaveText('€ 0,98');
  await expect(total).toHaveText('€ 39,20');

  // Submitting only reports what would be added (the chosen quantity and art.nr.); nothing navigates or reaches a cart.
  const status = buy.locator('[data-buy-status]');
  await expect(status).toBeHidden();
  await buy.getByRole('button', { name: 'In winkelwagen' }).click();
  await expect(status).toBeVisible();
  await expect(status).toContainText('40');
  await expect(status).toContainText('1548');
  expect(new URL(page.url()).pathname).toBe('/product');

  // A shared ?variant= opens that size.
  await page.reload();
  await expect(variant).toHaveValue('1548');
  await expect(quantity).toHaveValue('20');

  // Order matrix: several sizes at once, each snapped to its own bundles, priced at its own break.
  // The note is a sibling of [data-order-matrix] (aria-live status), so the whole section is the scope.
  const matrix = page.locator('#alle-maten');
  const note = matrix.locator('[data-matrix-note]');
  const row = (sku: string) => matrix.locator(`tr[data-matrix-row="${sku}"]`);
  const submit = matrix.locator('[data-matrix-submit]');
  await expect(submit).toBeDisabled();
  await expect(note).toBeHidden();

  await row('1520').locator('[data-matrix-qty]').fill('30');
  await row('1520').locator('[data-matrix-qty]').press('Tab');
  await expect(row('1520').locator('[data-matrix-qty]')).toHaveValue('25');
  // The correction is announced with the corrected quantity, and a later stepper press clears it.
  await expect(note).toBeVisible();
  await expect(note).toContainText('25');

  await row('1566').locator('button[data-step="1"]').click();
  await expect(row('1566').locator('[data-matrix-qty]')).toHaveValue('10');
  await expect(note).toBeHidden();
  await expect(matrix.locator('[data-matrix-count]')).toHaveText('2 maten');
  // 25 × € 0,34 + 10 × € 2,35.
  await expect(matrix.locator('[data-matrix-total]')).toHaveText('€ 32,00');
  await expect(submit).toBeEnabled();
  await submit.click();
  // Simulated: the announcement replaces the cleared note, the chosen quantities stay and the page does not leave.
  await expect(note).toBeVisible();
  await expect(row('1520').locator('[data-matrix-qty]')).toHaveValue('25');
  await expect(row('1566').locator('[data-matrix-qty]')).toHaveValue('10');
  expect(new URL(page.url()).pathname).toBe('/product');

  // Minus at the minimum empties a matrix row (unlike the buy box).
  await row('1520').locator('button[data-step="-1"]').click();
  await expect(row('1520').locator('[data-matrix-qty]')).toHaveValue(/^0?$/u);
  await expect(matrix.locator('[data-matrix-count]')).toHaveText('1 maat');
  await expect(matrix.locator('[data-matrix-total]')).toHaveText('€ 23,50');

  expect(requested.filter((path) => path.startsWith('/cart'))).toEqual([]);
});

import { dimensions, type Dimension } from '../size-finder/box-geometry';
import { fitsSizeClass, sizeClassOf, sizeClassParam, sizeClassValues, sizeFromParams } from './collection-filters';
import { catalogue, sizeClassStep, type CatalogueLink, type CatalogueType } from './collection.data';

/**
 * Browser behaviour of the collection reference: a stand-in for Liquid (category, trail, title) and for Search &
 * Discovery (filters, sort), after initCategoryNav / initCollectionFilters / initProductListing in the 6f9c7e2
 * prototype. State lives in the URL with Shopify's parameter names. One committed change (a checkbox, a released
 * slider, a left field, a reset, a sort) is one history entry; typing and dragging only update that entry, so Back and
 * Forward step through committed states and every state can be shared.
 *
 * @param page The `[data-collection-page]` root.
 */
export function initCollectionPage(page: HTMLElement): void {
  const params = new URLSearchParams(location.search);
  const basePath = page.dataset.basePath ?? location.pathname;
  const resolved = locate(params.get('categorie'));
  renderCategory(page, resolved, basePath);
  renderHandoff(page, params, resolved.type !== undefined);
  bindHeadSurface(page, params);
  const form = page.querySelector<HTMLFormElement>('form[data-filters]');
  const listing = page.querySelector<HTMLElement>('[data-product-listing]');
  if (form && listing) {
    bindListing(form, listing);
  }
}

interface Located {
  type?: CatalogueType;
  child?: CatalogueLink;
}

interface Crumb {
  name: string;
  href?: string;
}

/**
 * A product type, or a subcategory; a subcategory listed under two product types belongs to the first.
 *
 * @param name The requested `categorie` value.
 *
 * @returns The resolved product type and subcategory, empty when the name is not in the menu.
 */
function locate(name: string | null): Located {
  if (!name) {
    return {};
  }
  const type = catalogue.find((item) => item.name === name);
  if (type) {
    return { type };
  }
  for (const item of catalogue) {
    const child = item.children.find((candidate) => candidate.name === name);
    if (child) {
      return { type: item, child };
    }
  }
  return {};
}

/**
 * A collection URL on this route for one category.
 *
 * @param basePath The collection route.
 * @param name The category name.
 *
 * @returns The link target.
 */
function categoryHref(basePath: string, name: string): string {
  return `${basePath}?${new URLSearchParams({ categorie: name })}`;
}

/**
 * Renders category state: navigation mark, visible subcategory row, trail and title.
 *
 * @param page The collection page root.
 * @param located The resolved category.
 * @param basePath The collection route.
 */
function renderCategory(page: HTMLElement, located: Located, basePath: string): void {
  markCategoryNav(page, located);
  showSubcategoryRow(page, located);
  const { type, child } = located;
  const trail: Array<Crumb> = [{ name: 'Home', href: '/preview' }];
  if (type) {
    trail.push({ name: type.name, href: categoryHref(basePath, type.name) });
  }
  if (child) {
    trail.push({ name: child.name, href: categoryHref(basePath, child.name) });
  }
  if (!type) {
    trail.push({ name: 'Alle producten' });
  }
  for (const list of page.querySelectorAll('[data-breadcrumbs] ol')) {
    list.replaceChildren(...trail.map((crumb, index) => crumbItem(crumb, index === trail.length - 1)));
  }
  if (type) {
    for (const title of page.querySelectorAll('[data-collection-title]')) {
      title.textContent = (child ?? type).name;
    }
  }
}

/**
 * One trail item; the last is the current page and never a link.
 *
 * @param crumb The trail entry.
 * @param current Whether it is the current page.
 *
 * @returns The list item.
 */
function crumbItem(crumb: Crumb, current: boolean): HTMLLIElement {
  const item = document.createElement('li');
  if (current || crumb.href === undefined) {
    const label = document.createElement('span');
    label.setAttribute('aria-current', 'page');
    label.textContent = crumb.name;
    item.append(label);
  } else {
    const link = document.createElement('a');
    link.href = crumb.href;
    link.textContent = crumb.name;
    item.append(link);
  }
  return item;
}

/**
 * Marks the product type in the sidebar: "page" on the type itself, "true" on one of its subcategories.
 *
 * @param page The collection page root.
 * @param located The resolved category.
 */
function markCategoryNav(page: HTMLElement, located: Located): void {
  const { type, child } = located;
  for (const link of page.querySelectorAll<HTMLAnchorElement>('[data-category-link]')) {
    if (!type || link.dataset.categoryLink !== type.name) {
      link.removeAttribute('aria-current');
      continue;
    }
    link.setAttribute('aria-current', child ? 'true' : 'page');
    // As a row of pills on a phone the current one may start out of view.
    const nav = link.closest<HTMLElement>('[data-category-nav]');
    if (nav && nav.scrollWidth > nav.clientWidth) {
      const linkBox = link.getBoundingClientRect();
      const navBox = nav.getBoundingClientRect();
      nav.scrollLeft += linkBox.left - navBox.left - (navBox.width - linkBox.width) / 2;
    }
  }
}

/**
 * Shows the subcategory row of the resolved product type (or every product type) and marks the current card.
 *
 * @param page The collection page root.
 * @param located The resolved category.
 */
function showSubcategoryRow(page: HTMLElement, located: Located): void {
  const { type, child } = located;
  for (const row of page.querySelectorAll<HTMLElement>('[data-subcategory-row]')) {
    row.hidden = row.dataset.subcategoryRow !== (type?.name ?? '');
    for (const card of row.querySelectorAll<HTMLElement>('[data-subcategory]')) {
      if (child && !row.hidden && card.dataset.subcategory === child.name) {
        card.setAttribute('aria-current', 'page');
      } else {
        card.removeAttribute('aria-current');
      }
    }
  }
}

/**
 * Shows navigation state handed to the page that the prototype has no logic for, and echoes a search term.
 *
 * @param page The collection page root.
 * @param params The page's search parameters.
 * @param categoryResolved Whether `categorie` named a menu entry.
 */
function renderHandoff(page: HTMLElement, params: URLSearchParams, categoryResolved: boolean): void {
  const entries: Array<[string, string]> = [];
  const categorie = params.get('categorie');
  if (categorie && !categoryResolved) {
    entries.push(['Categorie, niet in het menu', categorie]);
  }
  const branche = params.get('branche');
  if (branche) {
    entries.push(['Branche', branche]);
  }
  const lijst = params.get('lijst');
  if (lijst) {
    entries.push(['Lijst', lijst]);
  }
  const notice = page.querySelector<HTMLElement>('[data-handoff]');
  const list = notice?.querySelector('[data-handoff-list]');
  if (notice && list && entries.length > 0) {
    list.replaceChildren(
      ...entries.flatMap(([term, value]) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = term;
        dd.textContent = value;
        return [dt, dd];
      }),
    );
    notice.hidden = false;
  }
  // The search term has no other place on this page yet, so it is echoed under the listing (source behaviour).
  const query = params.get('q');
  const echo = page.querySelector<HTMLElement>('[data-query-echo]');
  const term = echo?.querySelector('[data-query-term]');
  if (query && echo && term) {
    term.textContent = query;
    echo.hidden = false;
  }
}

/**
 * The navy-to-red gradient head trial versus plain navy, kept in the URL as `kop=navy` so both are linkable. A choice
 * replaces the current entry; Back/Forward restore whatever each entry's URL says, and filter writes keep `kop`.
 *
 * @param page The collection page root.
 * @param params The page's search parameters on load.
 */
function bindHeadSurface(page: HTMLElement, params: URLSearchParams): void {
  const panel = page.querySelector<HTMLElement>('[data-panel]');
  const radios = [...page.querySelectorAll<HTMLInputElement>('[data-head-surface] input[name="kop"]')];
  if (!panel || radios.length === 0) {
    return;
  }
  /**
   * @param search The history entry's search parameters.
   */
  function show(search: URLSearchParams): void {
    const surface = search.get('kop') === 'navy' ? 'navy' : 'gradient';
    if (panel) {
      panel.dataset.surface = surface;
    }
    for (const radio of radios) {
      radio.checked = radio.value === surface;
    }
  }
  show(params);
  for (const radio of radios) {
    radio.addEventListener('change', () => {
      panel.dataset.surface = radio.value;
      const url = new URL(location.href);
      if (radio.value === 'navy') {
        url.searchParams.set('kop', 'navy');
      } else {
        url.searchParams.delete('kop');
      }
      history.replaceState(history.state, '', url);
    });
  }
  globalThis.addEventListener('popstate', () => show(new URLSearchParams(location.search)));
}

interface RangeControl {
  field: HTMLElement;
  low: HTMLInputElement;
  high: HTMLInputElement;
  key: string;
  scale: number;
}

interface SizeControl {
  input: HTMLInputElement;
  key: Dimension;
}

/**
 * Whether a filter input is at its initial state (unchecked, or its markup value).
 *
 * @param input A checkbox or range input.
 *
 * @returns True when unchanged.
 */
function isDefault(input: HTMLInputElement): boolean {
  return input.type === 'checkbox' ? !input.checked : input.value === input.defaultValue;
}

/**
 * A size field's typed millimetres; empty or invalid is 0 (no filter).
 *
 * @param input A size field.
 *
 * @returns Millimetres, at least 0.
 */
function sizeOf(input: HTMLInputElement): number {
  return Math.max(0, Number(input.value) || 0);
}

/**
 * Whether either end of a range differs from its default.
 *
 * @param range The range control.
 *
 * @returns True when the range narrows the listing.
 */
function rangeSet(range: RangeControl): boolean {
  return !isDefault(range.low) || !isDefault(range.high);
}

/**
 * Keeps minimum ≤ maximum, moves the fill between the thumbs and rewrites the readout.
 *
 * @param range The range control.
 * @param moved The thumb that moved, if any; the other one yields.
 */
function syncRange(range: RangeControl, moved?: HTMLInputElement): void {
  if (Number(range.low.value) > Number(range.high.value)) {
    if (moved === range.low) {
      range.low.value = range.high.value;
    } else {
      range.high.value = range.low.value;
    }
  }
  const min = Number(range.low.min);
  const span = Number(range.low.max) - min || 1;
  const slider = range.field.querySelector<HTMLElement>('[data-range-slider]');
  slider?.style.setProperty('--lo', `${((Number(range.low.value) - min) / span) * 100}%`);
  slider?.style.setProperty('--hi', `${((Number(range.high.value) - min) / span) * 100}%`);
  const out = range.field.querySelector('[data-range-value]');
  if (!out) {
    return;
  }
  const decimals = Number(range.field.dataset.decimals ?? 0);
  const prefix = range.field.dataset.prefix ?? '';
  const [low, high] = [range.low.value, range.high.value].map((value) => {
    const bold = document.createElement('b');
    bold.textContent = `${prefix}${Number(value).toLocaleString('nl-NL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    return bold;
  });
  const unit = range.field.dataset.unit;
  out.replaceChildren(low ?? '', ' – ', high ?? '', unit ? ` ${unit}` : '');
}

/**
 * Filter panel and listing: reads the URL into the form, filters the example cards, writes the URL and keeps history.
 *
 * @param form The filter form.
 * @param listing The product listing section.
 */
function bindListing(form: HTMLFormElement, listing: HTMLElement): void {
  const grid = listing.querySelector<HTMLElement>('[data-product-grid]');
  const count = listing.querySelector<HTMLElement>('[data-product-count]');
  const empty = listing.querySelector<HTMLElement>('[data-product-empty]');
  if (!grid || !count || !empty) {
    return;
  }
  const pages = listing.querySelector<HTMLElement>('[data-pagination]');
  // Captured by the handlers below with the narrowed (present) element types.
  const view = { grid, count, empty };
  const items = [...grid.children].filter((node): node is HTMLLIElement => node instanceof HTMLLIElement);
  const toggle = document.querySelector<HTMLButtonElement>(`[data-filter-toggle][aria-controls="${form.id}"]`);
  const badge = toggle?.querySelector('[data-filter-count]');
  const finder = form.querySelector<HTMLElement>('[data-size-finder]');
  const step = Number(finder?.dataset.sizeStep) || sizeClassStep;
  const sizes: Array<SizeControl> = [...form.querySelectorAll<HTMLInputElement>('[data-size-input]')].map((input) => ({
    input,
    key: input.dataset.sizeInput as Dimension,
  }));
  const boxes = [...form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  const parts = [...form.querySelectorAll<HTMLDetailsElement>('[data-filter-part]')];
  const ranges: Array<RangeControl> = [...form.querySelectorAll<HTMLElement>('[data-range-field]')].flatMap((field) => {
    const [low, high] = field.querySelectorAll<HTMLInputElement>('input[type="range"]');
    return low && high
      ? [{ field, low, high, key: field.dataset.rangeKey ?? '', scale: Number(field.dataset.scale ?? 1) }]
      : [];
  });

  /* The drawing follows the fields; a side left empty keeps its neutral shape. It hears the same event the keuzehulp
     sends, in centimetres. */
  function drawSize(): void {
    finder?.dispatchEvent(
      new CustomEvent('keuzehulp:dimensions', {
        bubbles: true,
        detail: Object.fromEntries(
          dimensions.map((key) => {
            const size = sizes.find((candidate) => candidate.key === key);
            const millimetres = size ? sizeOf(size.input) : 0;
            return [key, millimetres ? millimetres / 10 : undefined];
          }),
        ),
      }),
    );
  }

  /* Only what differs from the defaults goes in the URL, as Shopify does. Other parameters (categorie, sort_by, branche,
     lijst, q, kop) are kept; the keuzehulp's centimetre handover is replaced by size classes. */
  function stateUrl(): URL {
    const url = new URL(location.href);
    const kept = new URLSearchParams();
    for (const [key, value] of url.searchParams) {
      if (!key.startsWith('filter.') && !dimensions.includes(key as Dimension)) {
        kept.append(key, value);
      }
    }
    for (const input of [...ranges.flatMap((range) => [range.low, range.high]), ...boxes]) {
      if (!isDefault(input)) {
        kept.append(input.name, input.value);
      }
    }
    for (const size of sizes) {
      const typed = sizeOf(size.input);
      if (typed) {
        const largest = Math.max(...items.map((item) => sizeClassOf(Number(item.dataset[size.key]) || 0, step)));
        for (const value of sizeClassValues(typed, largest, step)) {
          kept.append(sizeClassParam(size.key), value);
        }
      }
    }
    url.search = kept.toString();
    return url;
  }

  /* Within one filter any checked value may match; across filters all must — the way Shopify combines facets. A
     custom product has no fixed size: it stays whatever the sizes and ranges say, but not when colour or stock is
     asked. */
  function apply(): void {
    const shown = filterItems();
    view.count.textContent = `${shown} ${shown === 1 ? 'product' : 'producten'}`;
    view.empty.hidden = shown > 0;
    view.grid.hidden = shown === 0;
    if (pages) {
      pages.hidden = shown === 0;
    }
    renderCounts();
  }

  function filterItems(): number {
    const lists: Record<string, Array<string>> = {};
    for (const box of boxes.filter((candidate) => candidate.checked)) {
      const key = box.name.split('.').at(-1) ?? box.name;
      (lists[key] ??= []).push(box.value);
    }
    const inStock = Boolean(lists.availability);
    delete lists.availability;
    let shown = 0;
    for (const item of items) {
      const fits =
        'custom' in item.dataset ||
        (ranges.every((range) => {
          const value = Number(item.dataset[range.key]) / range.scale;
          return value >= Number(range.low.value) && value <= Number(range.high.value);
        }) &&
          sizes.every(
            (size) =>
              !sizeOf(size.input) || fitsSizeClass(Number(item.dataset[size.key]) || 0, sizeOf(size.input), step),
          ));
      const ok =
        fits &&
        Object.entries(lists).every(([key, values]) => values.includes(item.dataset[key] ?? '')) &&
        (!inStock || item.dataset.stock === 'in');
      item.hidden = !ok;
      shown += ok ? 1 : 0;
    }
    return shown;
  }

  // The active count on the narrow-screen toggle, and per part beside its name, so a closed part shows it is set.
  function renderCounts(): void {
    const active =
      ranges.filter(rangeSet).length +
      boxes.filter((box) => box.checked).length +
      sizes.filter((size) => sizeOf(size.input)).length;
    if (badge) {
      badge.textContent = active ? ` (${active})` : '';
    }
    for (const part of parts) {
      const set =
        ranges.filter((range) => part.contains(range.field) && rangeSet(range)).length +
        boxes.filter((box) => part.contains(box) && box.checked).length;
      part.dataset.active = String(set);
      const out = part.querySelector('[data-part-count]');
      if (out) {
        out.textContent = set ? String(set) : '';
      }
    }
  }

  /* Our own filter parameters, then the size classes or else the keuzehulp's centimetre handover. Arriving
     with filters opens the parts that hold them, so nothing narrows the list from behind a closed row. */
  /**
   * @param params The history entry's filter parameters.
   */
  function readUrl(params: URLSearchParams): void {
    for (const input of ranges.flatMap((range) => [range.low, range.high])) {
      input.value = params.get(input.name) ?? input.defaultValue;
    }
    for (const box of boxes) {
      box.checked = params.getAll(box.name).includes(box.value);
    }
    for (const range of ranges) {
      syncRange(range);
    }
    for (const size of sizes) {
      const value = sizeFromParams(params, size.key);
      size.input.value = value === undefined ? '' : String(value);
    }
    drawSize();
    apply();
    for (const part of parts) {
      if (Number(part.dataset.active)) {
        part.open = true;
      }
    }
  }

  let pending = false;
  /**
   * @param push Whether this committed interaction creates a history entry.
   */
  function commit(push: boolean): void {
    const url = stateUrl();
    if (url.href === location.href) {
      return;
    }
    if (push) {
      history.pushState(undefined, '', url);
    } else {
      history.replaceState(history.state, '', url);
    }
  }

  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const range = ranges.find((candidate) => candidate.low === target || candidate.high === target);
    if (range) {
      syncRange(range, target);
    }
    if (target.matches('[data-size-input]')) {
      drawSize();
    }
    apply();
    commit(!pending);
    pending = true;
  });
  form.addEventListener('change', () => {
    pending = false;
  });
  form.addEventListener('reset', () => {
    // The browser restores the defaults after the event, so read them on the next task.
    setTimeout(() => {
      for (const range of ranges) {
        syncRange(range);
      }
      drawSize();
      apply();
      commit(true);
      pending = false;
    }, 0);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    pending = false;
  });
  toggle?.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(form.toggleAttribute('data-open')));
  });

  const sort = bindSort(listing, grid, () => {
    pending = false;
  });
  globalThis.addEventListener('popstate', () => {
    const params = new URLSearchParams(location.search);
    readUrl(params);
    sort(params.get('sort_by'));
    pending = false;
  });
  readUrl(new URLSearchParams(location.search));
  bindViewSwitch(listing, grid);
}

/**
 * A card's price in cents for sorting; a quote-only product (no price) takes the given fallback.
 *
 * @param item A listing item.
 * @param missing The value for a product without a price.
 *
 * @returns The sort value.
 */
function priceOf(item: HTMLElement, missing: number): number {
  return item.dataset.price ? Number(item.dataset.price) : missing;
}

const collator = new Intl.Collator('nl');
const sortOrders: Record<string, (a: HTMLElement, b: HTMLElement) => number> = {
  'best-selling': (a, b) => Number(a.dataset.rank) - Number(b.dataset.rank),
  'title-ascending': (a, b) => collator.compare(a.dataset.title ?? '', b.dataset.title ?? ''),
  'title-descending': (a, b) => collator.compare(b.dataset.title ?? '', a.dataset.title ?? ''),
  // No price (quote only) sorts after the priced ones in both price orders.
  'price-ascending': (a, b) => priceOf(a, Infinity) - priceOf(b, Infinity),
  'price-descending': (a, b) => priceOf(b, -Infinity) - priceOf(a, -Infinity),
  'created-descending': (a, b) => (b.dataset.created ?? '').localeCompare(a.dataset.created ?? ''),
};

/**
 * Stand-in for Shopify's ?sort_by=: reorders the cards; a change is a history entry.
 *
 * @param listing The product listing section.
 * @param grid The product grid.
 * @param onChange Called after a sort change has been written.
 *
 * @returns A function applying a sort key (unknown keys fall back to best selling).
 */
function bindSort(listing: HTMLElement, grid: HTMLElement, onChange: () => void): (key: string | null) => void {
  const select = listing.querySelector<HTMLSelectElement>('[data-product-sort]');
  /**
   * @param key The requested sort order, or the default when absent.
   */
  function applySort(key: string | null): void {
    const order = key && key in sortOrders ? key : 'best-selling';
    if (select) {
      select.value = order;
    }
    grid.append(
      ...[...grid.children]
        .filter((node): node is HTMLElement => node instanceof HTMLElement)
        .toSorted(sortOrders[order]),
    );
  }
  select?.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('sort_by', select.value);
    history.pushState(undefined, '', url);
    applySort(select.value);
    onChange();
  });
  applySort(new URLSearchParams(location.search).get('sort_by'));
  return applySort;
}

/**
 * Three or four columns, or a list: a preference of the person, kept on the device, never in the URL. Storage can be
 * unavailable (private window, blocked site data); the switch still works.
 *
 * @param listing The product listing section.
 * @param grid The product grid.
 */
function bindViewSwitch(listing: HTMLElement, grid: HTMLElement): void {
  const buttons = [...listing.querySelectorAll<HTMLButtonElement>('[data-view-switch] [data-columns]')];
  /**
   * @param value The selected listing column count or list mode.
   */
  function setColumns(value: string): void {
    grid.dataset.columns = value;
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.columns === value));
    }
  }
  let saved: string | undefined;
  try {
    saved = localStorage.getItem('tupak-collection-columns') ?? undefined;
  } catch {
    saved = undefined;
  }
  if (saved && buttons.some((button) => button.dataset.columns === saved)) {
    setColumns(saved);
  }
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const value = button.dataset.columns ?? '3';
      setColumns(value);
      try {
        localStorage.setItem('tupak-collection-columns', value);
      } catch {
        // Storage is optional; the choice still applies to this page.
      }
    });
  }
}

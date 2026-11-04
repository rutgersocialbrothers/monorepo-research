import { productVariants, type ProductVariant } from './product.data';
import { amount, breakLabel, euro, sizeLabel, snapQuantity, stepQuantity, tierIndex } from './quantity';

/**
 * Product page behaviour after initBuyBox / initOrderMatrix / initGallery in prototype.js (6f9c7e2). A SIMULATION:
 * nothing is posted and there is no cart; the submit actions state what would happen and that nothing was ordered.
 *
 * @param page - Product page root holding the buy box, order matrix and galleries.
 */
export function initProductPage(page: HTMLElement): void {
  const box = page.querySelector<HTMLFormElement>('form[data-buy-box]');
  if (box) {
    bindBuyBox(page, box);
  }
  const matrix = page.querySelector<HTMLElement>('[data-order-matrix]');
  if (matrix) {
    bindOrderMatrix(matrix);
  }
  for (const gallery of page.querySelectorAll<HTMLElement>('[data-gallery]')) {
    bindGallery(gallery);
  }
}

const stockDot = { in: 'bg-success', lead: 'bg-warning', out: 'bg-border-strong' } as const;

function lineCount(lines: number) {
  return lines === 1 ? '1 maat' : `${lines} maten`;
}

function bindBuyBox(page: HTMLElement, box: HTMLFormElement): void {
  const buySelect = box.querySelector<HTMLSelectElement>('[data-buy-variant]');
  const buyInput = box.querySelector<HTMLInputElement>('[data-buy-qty]');
  const buyTiersBody = box.querySelector<HTMLTableSectionElement>('[data-buy-tiers]');
  const status = box.querySelector<HTMLElement>('[data-buy-status]');
  const breaks = box.querySelector<HTMLDetailsElement>('[data-buy-breaks]');
  // Open by default and without script; folded below the two-column width so the button comes first on a phone.
  if (breaks && !matchMedia('(min-width: 48rem)').matches) {
    breaks.open = false;
  }
  if (!buySelect || !buyInput || !buyTiersBody) {
    return;
  }
  const select = buySelect;
  const input = buyInput;
  const tiersBody = buyTiersBody;
  function set(selector: string, text: string) {
    const node = box.querySelector(selector);
    if (node) {
      node.textContent = text;
    }
  }
  function say(text: string) {
    if (status) {
      status.textContent = text;
    }
  }
  const initial = productVariants.find((item) => item.sku === select.value) ?? productVariants[0];
  if (!initial) {
    return;
  }
  let variant: ProductVariant = initial;
  function sync() {
    const quantity = Math.max(0, Number.parseInt(input.value, 10) || 0);
    const tier = Math.max(0, tierIndex(variant.tiers, quantity));
    const price = variant.tiers[tier]?.price ?? 0;
    for (const [index, row] of [...tiersBody.rows].entries()) {
      row.toggleAttribute('data-active', index === tier);
    }
    set('[data-buy-price]', euro(price));
    set('[data-buy-yours]', `Jouw prijs bij ${amount(Math.max(quantity, variant.moq))} stuks`);
    set('[data-buy-total]', euro(price * quantity));
  }

  function render() {
    variant = productVariants.find((item) => item.sku === select.value) ?? variant;
    const first = variant.tiers[0]?.price ?? 0;
    tiersBody.replaceChildren(
      ...variant.tiers.map((tier, index) => {
        const row = document.createElement('tr');
        const head = document.createElement('th');
        head.scope = 'row';
        const { from, pallets } = breakLabel(tier, variant.pallet);
        head.textContent = from;
        if (pallets) {
          const tag = document.createElement('span');
          tag.className =
            'ml-1 rounded-(--ds-radius-sm) bg-surface-brand px-1.5 py-0.5 text-xs font-bold text-foreground-heading';
          tag.textContent = `${pallets} pallet${pallets > 1 ? 's' : ''}`;
          head.append(' ', tag);
        }
        const price = document.createElement('td');
        price.textContent = euro(tier.price);
        const saving = document.createElement('td');
        if (index === 0) {
          saving.textContent = '—';
        } else {
          const save = document.createElement('span');
          save.className = 'font-bold text-success';
          save.textContent = `−${Math.round((1 - tier.price / first) * 100)}%`;
          saving.append(save);
        }
        row.append(head, price, saving);
        return row;
      }),
    );
    // A single break is no break: only the price shows (a guest, or a catalog without breaks for this size).
    if (breaks) {
      breaks.hidden = variant.tiers.length < 2;
    }
    set('[data-buy-break-count]', `${variant.tiers.length} staffels`);
    set(
      '[data-buy-rules]',
      `Per bundel van ${amount(variant.step)} · minimaal ${amount(variant.moq)} stuks · 1 pallet = ${amount(variant.pallet)} stuks`,
    );
    set('[data-buy-stock]', variant.stockLabel);
    const dot = box.querySelector<HTMLElement>('[data-buy-stock-dot]');
    if (dot) {
      dot.classList.remove(...Object.values(stockDot));
      dot.classList.add(stockDot[variant.stock]);
    }
    input.min = String(variant.moq);
    input.step = String(variant.step);
    input.value = String(snapQuantity(Number.parseInt(input.value, 10) || 0, variant.moq, variant.step, false));
    const fields: Record<string, string> = {
      sku: variant.sku,
      maat: sizeLabel(variant.size),
      kwaliteit: variant.kwaliteit,
      bundel: amount(variant.step),
      moq: amount(variant.moq),
      pallet: amount(variant.pallet),
      gewicht: amount(variant.gewicht),
    };
    for (const node of page.querySelectorAll<HTMLElement>('[data-variant-field]')) {
      const value = fields[node.dataset.variantField ?? ''];
      if (value !== undefined) {
        node.textContent = value;
      }
    }
    // The drawing takes centimetres, the way the keuzehulp sends them.
    box.dispatchEvent(
      new CustomEvent('keuzehulp:dimensions', {
        bubbles: true,
        detail: { lengte: variant.size.l / 10, breedte: variant.size.b / 10, hoogte: variant.size.h / 10 },
      }),
    );
    say('');
    sync();
  }

  // ?variant= opens the page on that size, as a Shopify product URL does; a change replaces it (source behaviour).
  const asked = new URLSearchParams(location.search).get('variant');
  if (asked && productVariants.some((item) => item.sku === asked)) {
    select.value = asked;
  }
  select.addEventListener('change', () => {
    render();
    const url = new URL(location.href);
    url.searchParams.set('variant', variant.sku);
    history.replaceState(history.state, '', url);
  });
  box.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-step]');
    if (!button) {
      return;
    }
    input.value = String(
      stepQuantity(
        Number.parseInt(input.value, 10) || 0,
        Number(button.dataset.step),
        variant.moq,
        variant.step,
        false,
      ),
    );
    say('');
    sync();
  });
  input.addEventListener('input', sync);
  input.addEventListener('change', () => {
    const typed = Math.max(0, Number.parseInt(input.value, 10) || 0);
    const quantity = snapQuantity(typed, variant.moq, variant.step, false);
    input.value = String(quantity);
    say(
      quantity === typed
        ? ''
        : `Aantal aangepast naar ${amount(quantity)}: per bundel van ${amount(variant.step)}, minimaal ${amount(variant.moq)} stuks.`,
    );
    sync();
  });
  box.addEventListener('submit', (event) => {
    event.preventDefault();
    say(
      `Simulatie: ${amount(Number.parseInt(input.value, 10) || 0)} stuks van art.nr. ${variant.sku} zouden nu in de winkelwagen gaan. Dit prototype heeft geen winkelwagen; er is niets besteld.`,
    );
  });
  render();
}

function bindOrderMatrix(matrix: HTMLElement): void {
  const rows = [...matrix.querySelectorAll<HTMLTableRowElement>('tr[data-matrix-row]')].flatMap((row) => {
    const variant = productVariants.find((item) => item.sku === row.dataset.matrixRow);
    const input = row.querySelector<HTMLInputElement>('[data-matrix-qty]');
    const sub = row.querySelector<HTMLElement>('[data-matrix-sub]');
    return variant && input && sub
      ? [{ row, variant, input, sub, cells: [...row.querySelectorAll<HTMLElement>('[data-matrix-price]')] }]
      : [];
  });
  const total = matrix.querySelector<HTMLElement>('[data-matrix-total]');
  const count = matrix.querySelector<HTMLElement>('[data-matrix-count]');
  const hiddenLines = matrix.querySelector<HTMLElement>('[data-matrix-hidden]');
  const submit = matrix.querySelector<HTMLButtonElement>('[data-matrix-submit]');
  const note = matrix.parentElement?.querySelector<HTMLElement>('[data-matrix-note]');
  const filter = matrix.parentElement?.querySelector<HTMLFormElement>('[data-matrix-filter]');
  const shown = filter?.querySelector<HTMLElement>('[data-matrix-shown]');
  const empty = matrix.querySelector<HTMLElement>('[data-matrix-empty]');
  function say(text: string) {
    if (note) {
      note.textContent = text;
    }
  }
  function rowOf(node: Element) {
    return rows.find((entry) => entry.row === node.closest('tr'));
  }

  function sync() {
    let sum = 0;
    let lines = 0;
    let hidden = 0;
    for (const entry of rows) {
      const quantity = Math.max(0, Number.parseInt(entry.input.value, 10) || 0);
      const tier = tierIndex(entry.variant.tiers, quantity);
      for (const [index, cell] of entry.cells.entries()) {
        cell.toggleAttribute('data-active', index === tier);
      }
      entry.sub.toggleAttribute('data-set', tier > -1);
      const price = entry.variant.tiers[tier]?.price;
      if (price === undefined) {
        entry.sub.textContent = '—';
      } else {
        sum += quantity * price;
        lines += 1;
        hidden += entry.row.hidden ? 1 : 0;
        entry.sub.textContent = euro(quantity * price);
      }
    }
    if (total) {
      total.textContent = euro(sum);
    }
    if (count) {
      count.textContent = lines ? lineCount(lines) : 'Nog geen maat gekozen';
    }
    // Filtering hides rows, never their quantities: say what is still in the order out of sight.
    if (hiddenLines) {
      hiddenLines.textContent = hidden
        ? `· ${hidden === 1 ? '1 verborgen maat' : `${hidden} verborgen maten`} in je bestelling`
        : '';
    }
    if (submit) {
      submit.disabled = lines === 0;
    }
    return lines;
  }

  matrix.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-step]');
    const entry = button && rowOf(button);
    if (!button || !entry) {
      return;
    }
    entry.input.value = String(
      stepQuantity(
        Number.parseInt(entry.input.value, 10) || 0,
        Number(button.dataset.step),
        entry.variant.moq,
        entry.variant.step,
      ),
    );
    say('');
    sync();
  });
  matrix.addEventListener('input', (event) => {
    if ((event.target as Element).matches('[data-matrix-qty]')) {
      sync();
    }
  });
  // Rounded to whole bundles only when the field is left, so typing is not fought mid-keystroke — and said when it happens.
  matrix.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const entry = target.matches('[data-matrix-qty]') ? rowOf(target) : undefined;
    if (!entry) {
      return;
    }
    const typed = Math.max(0, Number.parseInt(target.value, 10) || 0);
    const quantity = snapQuantity(typed, entry.variant.moq, entry.variant.step);
    target.value = String(quantity);
    say(
      quantity === typed
        ? ''
        : `Art.nr. ${entry.variant.sku}: aantal aangepast van ${amount(typed)} naar ${amount(quantity)}. Deze maat gaat per bundel van ${amount(entry.variant.step)}, minimaal ${amount(entry.variant.moq)} stuks.`,
    );
    sync();
  });
  // Quality (none ticked means all) and minimum inner sizes in mm; a row stays when its box is at least that large.
  function applyFilter() {
    if (!filter) {
      return;
    }
    const data = new FormData(filter);
    const qualities = data.getAll('kwaliteit');
    function least(name: string) {
      const value = data.get(name);
      return typeof value === 'string' ? Math.max(0, Number.parseInt(value, 10) || 0) : 0;
    }
    const [l, b, h] = [least('lengte'), least('breedte'), least('hoogte')];
    let visible = 0;
    for (const entry of rows) {
      const { kwaliteit, size } = entry.variant;
      const match =
        (qualities.length === 0 || qualities.includes(kwaliteit)) && size.l >= l && size.b >= b && size.h >= h;
      entry.row.hidden = !match;
      visible += match ? 1 : 0;
    }
    if (shown) {
      shown.textContent = `${visible} van ${rows.length} maten`;
    }
    if (empty) {
      empty.hidden = visible > 0;
    }
    sync();
  }
  if (filter) {
    filter.toggleAttribute('data-ready', true);
    filter.addEventListener('input', applyFilter);
    filter.addEventListener('submit', (event) => event.preventDefault());
    filter.querySelector('[data-matrix-filter-reset]')?.addEventListener('click', () => {
      filter.reset();
      applyFilter();
    });
  }
  submit?.addEventListener('click', () => {
    say(
      `Simulatie: ${lineCount(sync())} zouden nu in de winkelwagen gaan. Dit prototype heeft geen winkelwagen; er is niets besteld.`,
    );
  });
  sync();
}

function bindGallery(gallery: HTMLElement): void {
  const main = gallery.querySelector<HTMLImageElement>('[data-gallery-main]');
  const thumbs = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]')];
  if (!main) {
    return;
  }
  for (const thumb of thumbs) {
    thumb.addEventListener('click', () => {
      main.src = thumb.dataset.src ?? main.src;
      main.alt = thumb.dataset.alt ?? '';
      main.toggleAttribute('data-cover', Object.hasOwn(thumb.dataset, 'cover'));
      for (const other of thumbs) {
        if (other === thumb) {
          other.setAttribute('aria-current', 'true');
        } else {
          other.removeAttribute('aria-current');
        }
      }
    });
  }
}

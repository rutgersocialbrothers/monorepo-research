function luminance(rgb: Array<number>): number {
  const linear = rgb.map((value) => {
    const n = value / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
}

export function initStyleguide(): void {
  const root = document.documentElement;
  const modeToggle = document.querySelector<HTMLButtonElement>('#mode-toggle');
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-ds-tab]')];
  const panels = [...document.querySelectorAll<HTMLElement>('[data-ds-panel]')];
  const query = document.querySelector<HTMLInputElement>('#token-query');
  const layer = document.querySelector<HTMLSelectElement>('#token-layer');
  const rows = [...document.querySelectorAll<HTMLTableRowElement>('[data-token-row]')];
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  function selectTab(id: string, focus = false): void {
    if (!tabs.some((tab) => tab.dataset.dsTab === id)) {
      return;
    }
    for (const tab of tabs) {
      const selected = tab.dataset.dsTab === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) {
        tab.focus({ preventScroll: true });
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.dsPanel !== id;
    }
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      const id = tab.dataset.dsTab ?? 'colors';
      history.replaceState(undefined, '', `#${id}`);
      selectTab(id);
    });
  }
  document.querySelector('[data-ds-tablist]')?.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }
    const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : event.key === 'ArrowRight'
            ? (current + 1) % tabs.length
            : event.key === 'ArrowLeft'
              ? (current + tabs.length - 1) % tabs.length
              : undefined;
    if (next === undefined) {
      return;
    }
    const tab = tabs[next];
    if (!tab?.dataset.dsTab) {
      return;
    }
    event.preventDefault();
    history.replaceState(undefined, '', `#${tab.dataset.dsTab}`);
    selectTab(tab.dataset.dsTab, true);
  });
  function fromHash(): void {
    const id = location.hash.slice(1);
    if (id.startsWith('family-')) {
      selectTab('components');
      const family = document.querySelector(`#${CSS.escape(id)}`);
      if (family instanceof HTMLDetailsElement) {
        family.open = true;
      }
    } else {
      selectTab(tabs.some((tab) => tab.dataset.dsTab === id) ? id : 'colors');
    }
  }
  globalThis.addEventListener('hashchange', fromHash);
  fromHash();

  function color(node: HTMLElement, variable: string): { value: string; rgb: Array<number> } {
    const probe = document.createElement('span');
    probe.style.color = `var(${variable})`;
    const mode = node.dataset.valueMode ?? node.dataset.contrastMode;
    if (mode === 'light' || mode === 'dark') {
      probe.style.colorScheme = mode;
    }
    node.append(probe);
    const css = getComputedStyle(probe).color;
    probe.remove();
    if (!context) {
      return { value: css, rgb: [0, 0, 0] };
    }
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = css;
    context.fillRect(0, 0, 1, 1);
    const rgb = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    return { value: `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`, rgb };
  }
  function resolved(node: HTMLElement, variable: string, isColor: boolean): string {
    return isColor ? color(node, variable).value : getComputedStyle(node).getPropertyValue(variable).trim();
  }
  function px(variable: string): number {
    const value = getComputedStyle(root).getPropertyValue(variable).trim();
    return Number.parseFloat(value) * (value.endsWith('rem') ? Number.parseFloat(getComputedStyle(root).fontSize) : 1);
  }
  function filterTokens(): void {
    const search = query?.value.trim().toLowerCase() ?? '';
    let count = 0;
    for (const row of rows) {
      const match =
        (!search || row.textContent.toLowerCase().includes(search)) &&
        (!layer?.value || layer.value === 'all' || row.dataset.tokenLayer === layer.value);
      row.hidden = !match;
      if (match) {
        count++;
      }
    }
    const countNode = document.querySelector('#token-count');
    if (countNode) {
      countNode.textContent = `${count} tokens`;
    }
    const empty = document.querySelector<HTMLElement>('#token-empty');
    if (empty) {
      empty.hidden = count > 0;
    }
  }
  function viewport(): void {
    let active = 'base';
    const max = px('--ds-breakpoint-2xl');
    for (const bar of document.querySelectorAll<HTMLElement>('[data-breakpoint-bar]')) {
      const name = bar.dataset.breakpointBar ?? '';
      const width = px(name);
      bar.style.width = `${String((width / max) * 100)}%`;
      if (innerWidth >= width) {
        active = name.replace('--ds-breakpoint-', '');
      }
      bar.style.opacity = innerWidth >= width ? '1' : '.4';
    }
    const label = document.querySelector('[data-viewport]');
    if (label) {
      label.textContent = `Viewport ${innerWidth}px · ${active}`;
    }
  }
  function refreshColors(): void {
    for (const element of document.querySelectorAll<HTMLElement>('[data-color-reference]')) {
      const references = JSON.parse(element.dataset.colorReference ?? '{}') as Record<string, string>;
      element.textContent = references.tupak ?? 'starter value';
    }
    for (const element of document.querySelectorAll<HTMLElement>('[data-contrast-bg]')) {
      const a = luminance(color(element, element.dataset.contrastBg ?? '').rgb);
      const b = luminance(color(element, element.dataset.contrastFg ?? '').rgb);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail';
      element.textContent = `${ratio.toFixed(1)} · ${level}`;
      element.dataset.contrastLevel = ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'large' : 'fail';
      const label = `${element.dataset.contrastMode}: ${ratio.toFixed(2)}:1 · ${level}`;
      element.setAttribute('aria-label', label);
      element.title = label;
    }
  }
  function refreshValues(): void {
    refreshColors();
    for (const element of document.querySelectorAll<HTMLElement>('[data-css-value]')) {
      element.textContent = resolved(element, element.dataset.cssValue ?? '', Object.hasOwn(element.dataset, 'color'));
    }
    for (const element of document.querySelectorAll<HTMLElement>('[data-spacing-step]')) {
      element.textContent = `${String(px('--ui-spacing') * Number(element.dataset.spacingStep))}px`;
    }
    for (const card of document.querySelectorAll<HTMLElement>('[data-easing-token]')) {
      const value = getComputedStyle(card).getPropertyValue(card.dataset.easingToken ?? '');
      const points = /cubic-bezier\(([^)]+)\)/u.exec(value)?.[1]?.split(',').map(Number);
      if (points?.length === 4) {
        const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = points;
        card
          .querySelector('[data-easing-curve]')
          ?.setAttribute('d', `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`);
      }
    }
    filterTokens();
    viewport();
  }
  function preferences(): void {
    root.dataset.theme = 'tupak';
    const dark = root.classList.contains('dark');
    document.title = 'Tupak styleguide';
    const toggleLabel = dark ? 'Switch to light mode' : 'Switch to dark mode';
    modeToggle?.setAttribute('aria-label', toggleLabel);
    modeToggle?.setAttribute('title', toggleLabel);
    for (const icon of document.querySelectorAll<HTMLElement>('[data-mode-icon]')) {
      icon.hidden = icon.dataset.modeIcon === (dark ? 'dark' : 'light');
    }
    try {
      localStorage.setItem('tupak-design-system-mode', dark ? 'dark' : 'light');
    } catch {
      /* Workbench remains usable without storage. */
    }
    refreshValues();
    globalThis.dispatchEvent(new CustomEvent('design-system-theme-change'));
  }
  modeToggle?.addEventListener('click', () => {
    const dark = root.classList.toggle('dark');
    root.classList.toggle('light', !dark);
    preferences();
  });
  document.querySelector('#print-styleguide')?.addEventListener('click', () => globalThis.print());
  document
    .querySelector('#motion-play')
    ?.addEventListener('click', () => document.querySelector('#panel-motion')?.toggleAttribute('data-motion-running'));
  query?.addEventListener('input', filterTokens);
  layer?.addEventListener('change', filterTokens);
  globalThis.addEventListener('resize', viewport);
  document.querySelector('#controls-example')?.addEventListener('submit', (event) => event.preventDefault());

  let copyTimer: ReturnType<typeof setTimeout> | undefined;
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest<HTMLElement>('[data-copy-token],[data-copy-text]');
    if (!button) {
      return;
    }
    const variable = button.dataset.copyToken;
    const value = variable
      ? event.shiftKey
        ? resolved(button, variable, Object.hasOwn(button.dataset, 'copyColor'))
        : `var(${variable})`
      : (button.dataset.copyText ?? '');
    const status = document.querySelector('#copy-status');
    function report(message: string): void {
      if (status) {
        status.textContent = message;
      }
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        if (status) {
          status.textContent = '';
        }
      }, 2500);
    }
    if (!('clipboard' in navigator)) {
      report(`Clipboard unavailable. Copy manually: ${value}`);
      return;
    }
    void navigator.clipboard.writeText(value).then(
      () => report(`Copied ${value}`),
      () => report(`Could not copy. Copy manually: ${value}`),
    );
  });
  preferences();
}

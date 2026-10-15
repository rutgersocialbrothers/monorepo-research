/**
 * Selects rendered open stay open until the user interacts with them directly.
 */
function selectRoots(): Array<HTMLElement> {
  return [...document.querySelectorAll<HTMLElement>('[data-select]:not([data-select-pinned])')];
}

function enabledOptions(root: HTMLElement): Array<HTMLElement> {
  return [...root.querySelectorAll<HTMLElement>('[data-select-option]')].filter(
    (option) => option.getAttribute('aria-disabled') !== 'true',
  );
}

function setOpen(root: HTMLElement, open: boolean): void {
  const trigger = root.querySelector<HTMLButtonElement>('[data-select-trigger]');
  const list = root.querySelector<HTMLElement>('[data-select-list]');

  if (!trigger || !list || trigger.disabled) {
    return;
  }

  root.dataset.open = String(open);
  trigger.setAttribute('aria-expanded', String(open));
  trigger.tabIndex = open ? -1 : 0;
  list.hidden = !open;

  if (!open) {
    return;
  }

  const selected =
    list.querySelector<HTMLElement>("[aria-selected='true']:not([aria-disabled='true'])") ?? enabledOptions(root)[0];

  selected?.focus();
}

function closeOthers(current: HTMLElement): void {
  for (const select of selectRoots()) {
    if (select !== current) {
      setOpen(select, false);
    }
  }
}

function choose(root: HTMLElement, option: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>('[data-select-input]');
  if (input) {
    input.value = option.dataset.value ?? '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const value = root.querySelector<HTMLElement>('[data-select-value]');
  const label = option.querySelector('[data-select-label]')?.textContent ?? '';

  if (value) {
    value.textContent = label;
    value.classList.remove('text-muted-foreground');
  }

  for (const item of root.querySelectorAll('[data-select-option]')) {
    item.setAttribute('aria-selected', String(item === option));
  }

  delete root.dataset.selectPinned;
  setOpen(root, false);
  root.querySelector<HTMLButtonElement>('[data-select-trigger]')?.focus();
}

function onClick(event: Event): void {
  const { target } = event;

  if (!(target instanceof Element)) {
    return;
  }

  const trigger = target.closest('[data-select-trigger]');

  if (trigger instanceof HTMLButtonElement) {
    const root = trigger.closest<HTMLElement>('[data-select]');

    if (!root || trigger.disabled) {
      return;
    }

    const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
    delete root.dataset.selectPinned;
    closeOthers(root);
    setOpen(root, willOpen);
    return;
  }

  const option = target.closest<HTMLElement>('[data-select-option]');

  if (option) {
    const root = option.closest<HTMLElement>('[data-select]');

    if (!root || option.getAttribute('aria-disabled') === 'true') {
      return;
    }

    choose(root, option);
    return;
  }

  if (!target.closest('[data-select]')) {
    for (const select of selectRoots()) {
      setOpen(select, false);
    }
  }
}

function moveOption(options: Array<HTMLElement>, active: HTMLElement, key: string): void {
  const index = options.indexOf(active);

  if (key === 'ArrowDown' || key === 'ArrowUp') {
    const next = key === 'ArrowDown' ? index + 1 : index - 1;
    const option = options[(next + options.length) % options.length];
    option?.focus();
    return;
  }

  if (key === 'Home') {
    options[0]?.focus();
    return;
  }

  if (key === 'End') {
    options.at(-1)?.focus();
  }
}

function onKeyDown(event: KeyboardEvent): void {
  const active = document.activeElement;

  if (!(active instanceof HTMLElement)) {
    return;
  }

  const root = active.closest<HTMLElement>('[data-select]');

  if (!root) {
    return;
  }

  const trigger = root.querySelector<HTMLButtonElement>('[data-select-trigger]');

  if (!trigger || trigger.disabled) {
    return;
  }

  const open = trigger.getAttribute('aria-expanded') === 'true';
  const options = enabledOptions(root);

  if (event.key === 'Escape' && open) {
    event.preventDefault();
    setOpen(root, false);
    trigger.focus();
    return;
  }

  if (active === trigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault();

    if (!open) {
      closeOthers(root);
    }

    setOpen(root, true);
    return;
  }

  if (!open || active === trigger || !options.includes(active)) {
    return;
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    moveOption(options, active, event.key);
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    choose(root, active);
  }
}

export function setupSelects(): void {
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
}

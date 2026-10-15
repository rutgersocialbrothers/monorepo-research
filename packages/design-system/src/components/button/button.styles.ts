import type { ButtonSize, ButtonVariant } from './button.contract';

export const buttonBaseClass =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[var(--button-gap)] rounded-[var(--button-radius)] border-[length:var(--button-border-width)] text-base leading-tight font-[var(--button-font-weight)] whitespace-nowrap transition-colors duration-[var(--ds-duration-fast)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-primary text-primary-foreground not-disabled:hover:bg-primary-hover not-disabled:active:bg-primary-active shadow-[var(--button-shadow)]',
  secondary:
    'border-secondary-border bg-secondary text-secondary-foreground not-disabled:hover:bg-secondary-hover not-disabled:active:bg-secondary-active shadow-[var(--button-shadow)]',
  nav: 'border-transparent bg-nav text-nav-foreground not-disabled:hover:bg-nav-hover not-disabled:active:bg-nav-active shadow-[var(--button-shadow)]',
  outline:
    'border-2 border-nav bg-surface-raised text-foreground-heading not-disabled:hover:bg-secondary not-disabled:active:bg-secondary-active shadow-[var(--button-shadow)]',
  ghost:
    'border-transparent bg-transparent text-foreground-heading not-disabled:hover:bg-secondary not-disabled:active:bg-secondary-hover',
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] py-2 text-sm',
  md: 'min-h-[var(--button-height-md)] px-[var(--button-padding-x-md)] py-3',
  lg: 'min-h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] py-4 text-base',
};

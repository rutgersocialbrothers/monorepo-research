import type { ButtonSize, ButtonVariant } from './button.contract';

export const buttonBaseClass =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[var(--button-gap)] rounded-[var(--button-radius)] border-[length:var(--button-border-width)] text-sm font-[var(--button-font-weight)] whitespace-nowrap transition-colors duration-[var(--ds-duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-[var(--button-shadow)]',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-accent shadow-[var(--button-shadow)]',
  outline:
    'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-[var(--button-shadow)]',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] py-1.5 text-xs',
  md: 'min-h-[var(--button-height-md)] px-[var(--button-padding-x-md)] py-2',
  lg: 'min-h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] py-3 text-base',
};

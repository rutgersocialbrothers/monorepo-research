import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const buttonContract = {
  name: 'Button',
  version: 1,
  description: 'Triggers an action. The contract defines capabilities; each target implements them idiomatically.',
  element: 'button',
  props: {
    variant: {
      type: 'enum',
      values: ['primary', 'secondary', 'outline', 'ghost'],
      default: 'primary',
    },
    size: {
      type: 'enum',
      values: ['sm', 'md', 'lg'],
      default: 'md',
    },
    disabled: {
      type: 'boolean',
      default: false,
    },
    type: {
      type: 'enum',
      values: ['button', 'submit', 'reset'],
      default: 'button',
    },
    loading: {
      type: 'boolean',
      default: false,
    },
  },
  slots: {
    default: {
      required: true,
      description: 'Button label/content.',
    },
    leadingIcon: {
      required: false,
      description: 'Optional decorative or semantic icon before the label.',
    },
    trailingIcon: {
      required: false,
      description: 'Optional decorative or semantic icon after the label.',
    },
  },
  states: ['default', 'hover', 'focus-visible', 'disabled', 'loading'],
  accessibility: [
    'Use a native button element for actions.',
    'Keep a visible focus indicator.',
    'Icon-only actions require an accessible name.',
    'Disabled state uses the native disabled attribute.',
    'Loading sets aria-busy and disables the button while the label stays available.',
  ],
  targets: ['html', 'react', 'shopify-liquid', 'bigcommerce-stencil'],
  preview: {
    content: 'Buy tickets',
    exclude: ['type'],
  },
} as const satisfies ComponentContract;

export type ButtonProps = ContractProps<typeof buttonContract>;
export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export type ButtonSize = NonNullable<ButtonProps['size']>;
export type ButtonType = NonNullable<ButtonProps['type']>;

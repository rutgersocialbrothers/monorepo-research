import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const inputContract = {
  name: 'Input',
  version: 1,
  description:
    'A single-line text control. The visible label and error text are composed around the input, not inside it.',
  element: 'input',
  props: {
    type: {
      type: 'enum',
      values: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
      default: 'text',
    },
    disabled: {
      type: 'boolean',
      default: false,
    },
    invalid: {
      type: 'boolean',
      default: false,
    },
    placeholder: {
      type: 'string',
      default: '',
    },
    value: {
      type: 'string',
      default: '',
    },
  },
  states: ['default', 'hover', 'focus-visible', 'disabled', 'invalid'],
  accessibility: [
    'Supply a visible label associated with the input.',
    'Associate error text with aria-describedby.',
    'Invalid state sets aria-invalid.',
  ],
  targets: ['html', 'react', 'shopify-liquid', 'bigcommerce-stencil'],
  preview: {
    label: 'Name',
    props: { placeholder: 'Enter a name' },
  },
} as const satisfies ComponentContract;

export type InputProps = ContractProps<typeof inputContract>;
export type InputType = NonNullable<InputProps['type']>;

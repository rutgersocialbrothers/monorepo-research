import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const textareaContract = {
  name: 'Textarea',
  version: 1,
  description: 'Multi-line free text; pair with a visible label and helper or error text.',
  element: 'textarea',
  props: {
    disabled: {
      type: 'boolean',
      default: false,
    },
    invalid: {
      type: 'boolean',
      default: false,
    },
    rows: {
      type: 'number',
      default: 3,
    },
    placeholder: {
      type: 'string',
      default: 'Your message',
    },
  },
  states: ['default', 'focus-visible', 'disabled', 'invalid'],
  accessibility: ['Associate a visible label and error text; preserve native text entry.'],
  targets: ['html'],
  preview: {
    label: 'Message',
  },
} as const satisfies ComponentContract;
export type TextareaProps = ContractProps<typeof textareaContract>;

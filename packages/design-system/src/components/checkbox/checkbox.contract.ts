import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const checkboxContract = {
  name: 'Checkbox',
  version: 1,
  description: 'Selects independent options or confirms a statement.',
  element: 'input',
  props: {
    checked: {
      type: 'boolean',
      default: false,
    },
    disabled: {
      type: 'boolean',
      default: false,
    },
    invalid: {
      type: 'boolean',
      default: false,
    },
    indeterminate: {
      type: 'boolean',
      default: false,
    },
  },
  states: ['default', 'focus-visible', 'disabled', 'invalid'],
  accessibility: ['Space toggles. Mixed state uses the native indeterminate property. Errors need describedBy.'],
  targets: ['html'],
  preview: {
    props: {
      label: 'Accept terms',
    },
  },
} as const satisfies ComponentContract;
export type CheckboxProps = ContractProps<typeof checkboxContract>;

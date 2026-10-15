import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const selectContract = {
  name: 'Select',
  version: 1,
  description:
    'Chooses one option from a list. Markup is a combobox trigger plus a listbox of options, including a disabled option and a selected check.',
  element: 'button',
  props: {
    size: {
      type: 'enum',
      values: ['sm', 'md'],
      default: 'md',
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
      default: 'Choose an option',
    },
    value: {
      type: 'string',
      default: '',
    },
    open: {
      type: 'boolean',
      default: false,
    },
  },
  parts: {
    trigger: 'Combobox button that shows the current value or placeholder.',
    listbox: 'Popup list of options.',
    option: 'A selectable option. Disabled options cannot be chosen.',
  },
  states: ['default', 'hover', 'focus-visible', 'disabled', 'invalid', 'open'],
  accessibility: [
    'Supply a visible label associated with the trigger.',
    'The trigger is a combobox and the popup is a listbox.',
    'Associate error text with aria-describedby and set aria-invalid.',
    'Disabled options are skipped by keyboard navigation.',
    'Escape closes the list and returns focus to the trigger.',
  ],
  targets: ['html', 'react', 'shopify-liquid', 'bigcommerce-stencil'],
  preview: {
    label: 'Update frequency',
    overlay: ['open'],
    props: {
      options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'unavailable', label: 'Unavailable option', disabled: true },
      ],
    },
  },
} as const satisfies ComponentContract;

export type SelectProps = ContractProps<typeof selectContract>;
export type SelectSize = NonNullable<SelectProps['size']>;

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

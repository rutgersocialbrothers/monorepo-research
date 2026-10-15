import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const switchContract = {
  name: 'Switch',
  version: 1,
  description: 'Turns a setting on or off immediately. Use Checkbox for changes submitted later.',
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
    size: {
      type: 'enum',
      values: ['md', 'sm'],
      default: 'md',
    },
  },
  states: ['default', 'focus-visible', 'disabled'],
  accessibility: ['A stable visible label names the setting; Space toggles the native checkbox with role switch.'],
  targets: ['html'],
  preview: {
    props: {
      label: 'Weekly summary',
    },
  },
} as const satisfies ComponentContract;
export type SwitchProps = ContractProps<typeof switchContract>;

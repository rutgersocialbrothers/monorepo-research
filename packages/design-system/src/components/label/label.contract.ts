import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const labelContract = {
  name: 'Label',
  version: 1,
  description: 'The visible name of a form control; for groups use a legend.',
  element: 'label',
  props: {
    required: {
      type: 'boolean',
      default: false,
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['The for attribute must match the control id. Required is communicated in text.'],
  targets: ['html'],
  preview: {
    content: 'Email address',
    props: {
      for: 'label-demo-input',
    },
  },
} as const satisfies ComponentContract;
export type LabelProps = ContractProps<typeof labelContract>;

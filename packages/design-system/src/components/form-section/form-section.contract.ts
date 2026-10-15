import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const formSectionContract = {
  name: 'FormSection',
  version: 1,
  description: 'A titled group of related fields with helper text and actions.',
  element: 'fieldset',
  props: {
    layout: {
      type: 'enum',
      values: ['stacked', 'split'],
      default: 'stacked',
    },
    title: {
      type: 'string',
      default: 'Profile',
    },
    description: {
      type: 'string',
      default: 'Your public profile details.',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['A legend names the group. Labels and errors must reference unique field ids.'],
  targets: ['html'],
  preview: {
    content: 'Compose labelled fields here.',
  },
} as const satisfies ComponentContract;
export type FormSectionProps = ContractProps<typeof formSectionContract>;

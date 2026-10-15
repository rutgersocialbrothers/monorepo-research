import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const radioGroupContract = {
  name: 'RadioGroup',
  version: 1,
  description: 'Select exactly one option from a small, visible set.',
  element: 'fieldset',
  props: {
    disabled: {
      type: 'boolean',
      default: false,
    },
    value: {
      type: 'string',
      default: 'comfortable',
    },
  },
  states: ['default', 'focus-visible', 'disabled'],
  accessibility: [
    'A fieldset and legend name the group. Native radio buttons provide arrow-key navigation and form values.',
  ],
  targets: ['html'],
  preview: {
    props: {
      label: 'Density',
      options: [
        {
          value: 'comfortable',
          label: 'Comfortable',
        },
        {
          value: 'compact',
          label: 'Compact',
        },
        {
          value: 'dense',
          label: 'Dense',
        },
      ],
    },
  },
} as const satisfies ComponentContract;
export type RadioGroupProps = ContractProps<typeof radioGroupContract>;

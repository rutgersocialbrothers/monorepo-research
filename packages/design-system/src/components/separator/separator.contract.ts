import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const separatorContract = {
  name: 'Separator',
  version: 1,
  description: 'Separates content groups where spacing alone is insufficient.',
  element: 'div',
  props: {
    orientation: {
      type: 'enum',
      values: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
    decorative: {
      type: 'boolean',
      default: true,
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Decorative separators are hidden; meaningful separators expose orientation.'],
  targets: ['html'],
  preview: {
    exclude: ['decorative'],
  },
} as const satisfies ComponentContract;
export type SeparatorProps = ContractProps<typeof separatorContract>;

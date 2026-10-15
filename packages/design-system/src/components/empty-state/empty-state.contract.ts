import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const emptyStateContract = {
  name: 'EmptyState',
  version: 1,
  description: 'Explains why a region has no content and gives one action to fill it.',
  element: 'section',
  props: {
    variant: {
      type: 'enum',
      values: ['bordered', 'plain'],
      default: 'bordered',
    },
    title: {
      type: 'string',
      default: 'No projects yet',
    },
    description: {
      type: 'string',
      default: 'Create your first project to get started.',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Use for empty content, not loading or errors. The heading must fit the outline.'],
  targets: ['html'],
  preview: {},
} as const satisfies ComponentContract;
export type EmptyStateProps = ContractProps<typeof emptyStateContract>;

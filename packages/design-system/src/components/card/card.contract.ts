import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const cardContract = {
  name: 'Card',
  version: 1,
  description: 'Groups related content and actions about one thing.',
  element: 'article',
  props: {
    title: {
      type: 'string',
      default: 'Weekend tickets',
    },
    description: {
      type: 'string',
      default: 'Book before Friday and save 15%.',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Choose a heading level that fits the page; actions must be independently focusable.'],
  targets: ['html'],
  preview: {
    content: 'A day full of adventure.',
  },
} as const satisfies ComponentContract;
export type CardProps = ContractProps<typeof cardContract>;

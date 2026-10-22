import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const cardContract = {
  name: 'Card',
  version: 1,
  description: 'Groups related content and actions about one thing.',
  element: 'article',
  props: {
    title: {
      type: 'string',
      default: '',
    },
    description: {
      type: 'string',
      default: '',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Choose a heading level that fits the page; actions must be independently focusable.'],
  targets: ['html'],
  preview: {
    content: 'Related content lives together in one panel.',
    props: { title: 'Prototype card', description: 'An example of grouped content, not a business offer.' },
  },
} as const satisfies ComponentContract;
export type CardProps = ContractProps<typeof cardContract>;

import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const dialogContract = {
  name: 'Dialog',
  version: 1,
  description: 'A modal for focused tasks. Finish or dismiss it before returning to the page.',
  element: 'dialog',
  props: {
    title: {
      type: 'string',
      default: 'Edit profile',
    },
    description: {
      type: 'string',
      default: 'Changes are saved to your account.',
    },
    trigger: {
      type: 'string',
      default: 'Open dialog',
    },
  },
  states: ['default', 'focus-visible', 'open'],
  accessibility: [
    'Native showModal supplies focus containment and inert background. Escape closes; focus returns to trigger. Title and description label the dialog.',
  ],
  targets: ['html'],
  preview: {
    content: 'A focused task or confirmation.',
  },
} as const satisfies ComponentContract;
export type DialogProps = ContractProps<typeof dialogContract>;

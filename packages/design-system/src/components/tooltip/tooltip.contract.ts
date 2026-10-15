import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const tooltipContract = {
  name: 'Tooltip',
  version: 1,
  description: 'Short supplemental text on hover or focus. Keep essential instructions visible.',
  element: 'div',
  props: {
    label: {
      type: 'string',
      default: 'Hover or focus me',
    },
    text: {
      type: 'string',
      default: 'Tooltips explain; never put essential information here.',
    },
  },
  states: ['default', 'focus-visible', 'open'],
  accessibility: [
    'Shows on keyboard focus and pointer hover. Escape dismisses. Hovering the tooltip keeps it open. Trigger still has a visible accessible name.',
  ],
  targets: ['html'],
  preview: {},
} as const satisfies ComponentContract;
export type TooltipProps = ContractProps<typeof tooltipContract>;

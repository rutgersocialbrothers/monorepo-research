import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const alertContract = {
  name: 'Alert',
  version: 1,
  description: 'Persistent inline feedback. Use an alert role only for urgent, dynamically inserted messages.',
  element: 'div',
  props: {
    variant: {
      type: 'enum',
      values: ['info', 'success', 'warning', 'destructive'],
      default: 'info',
    },
    title: {
      type: 'string',
      default: 'Heads up',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Pair tone with a title. Do not announce every static example as a live alert.'],
  targets: ['html'],
  preview: {
    content: 'A new version of the token set is available.',
  },
} as const satisfies ComponentContract;
export type AlertProps = ContractProps<typeof alertContract>;

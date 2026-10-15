import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const badgeContract = {
  name: 'Badge',
  version: 1,
  description: 'A short status, category or count. Use text as well as color.',
  element: 'span',
  props: {
    variant: {
      type: 'enum',
      values: ['primary', 'secondary', 'outline', 'success', 'warning', 'info', 'destructive', 'ghost'],
      default: 'primary',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Badges are non-interactive. Use a Button or Link for actions.'],
  targets: ['html'],
  preview: {
    content: 'Active',
  },
} as const satisfies ComponentContract;
export type BadgeProps = ContractProps<typeof badgeContract>;

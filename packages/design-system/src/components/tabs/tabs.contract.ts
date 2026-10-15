import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const tabsContract = {
  name: 'Tabs',
  version: 1,
  description: 'Switches between related views within one context. Use links for page navigation.',
  element: 'div',
  props: {
    variant: {
      type: 'enum',
      values: ['default', 'line'],
      default: 'default',
    },
    orientation: {
      type: 'enum',
      values: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
  },
  states: ['default', 'focus-visible', 'open'],
  accessibility: [
    'Arrow keys move and activate tabs, Home/End select endpoints; disabled tabs are skipped. Each panel is labelled by its tab.',
  ],
  targets: ['html'],
  preview: {
    props: {
      label: 'Account views',
      items: [
        {
          label: 'Account',
          content: 'Manage your profile and preferences.',
        },
        {
          label: 'Billing',
          content: 'Invoices, payment methods and plan.',
        },
        {
          label: 'Team',
          content: 'Invite people and manage roles.',
        },
      ],
    },
  },
} as const satisfies ComponentContract;
export type TabsProps = ContractProps<typeof tabsContract>;

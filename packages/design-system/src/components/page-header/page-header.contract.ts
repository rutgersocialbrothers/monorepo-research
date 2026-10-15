import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const pageHeaderContract = {
  name: 'PageHeader',
  version: 1,
  description: 'A page title, purpose and page-level actions.',
  element: 'header',
  props: {
    title: {
      type: 'string',
      default: 'Account settings',
    },
    description: {
      type: 'string',
      default: 'Manage your profile and preferences.',
    },
  },
  states: ['default', 'focus-visible'],
  accessibility: ['Use h1 once on an actual page; choose h2 or h3 inside a specimen.'],
  targets: ['html'],
  preview: {},
} as const satisfies ComponentContract;
export type PageHeaderProps = ContractProps<typeof pageHeaderContract>;

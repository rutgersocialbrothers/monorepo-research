import type { ComponentContract, ContractProps } from '../../contracts/schema';
export const dropdownMenuContract = {
  name: 'DropdownMenu',
  version: 1,
  description:
    'A compact list of secondary actions. Emits menu-select with the chosen value; consumers handle the action.',
  element: 'div',
  props: {
    label: {
      type: 'string',
      default: 'Open menu',
    },
  },
  states: ['default', 'focus-visible', 'open'],
  accessibility: [
    'Arrow keys/Home/End navigate. Enter activates. Escape dismisses and restores trigger focus. Tab leaves normally. Disabled items are skipped.',
  ],
  targets: ['html'],
  preview: {
    props: {
      items: [
        {
          label: 'Profile',
          value: 'profile',
        },
        {
          label: 'Settings',
          value: 'settings',
        },
        {
          label: 'Log out',
          value: 'logout',
          destructive: true,
        },
      ],
    },
  },
} as const satisfies ComponentContract;
export type DropdownMenuProps = ContractProps<typeof dropdownMenuContract>;

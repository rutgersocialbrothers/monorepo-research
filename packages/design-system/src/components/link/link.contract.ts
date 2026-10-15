import type { ComponentContract, ContractProps } from '../../contracts/schema';
import { buttonContract } from '../button/button.contract';

export const linkContract = {
  name: 'Link',
  version: 1,
  description:
    'Navigates to a destination. Text is the default appearance. Button appearance reuses the Button variant and size, and the element stays an anchor.',
  element: 'a',
  props: {
    href: {
      type: 'string',
      required: true,
      default: '',
    },
    appearance: {
      type: 'enum',
      values: ['text', 'button'],
      default: 'text',
    },
    variant: {
      type: 'enum',
      values: buttonContract.props.variant.values,
      default: 'primary',
    },
    size: {
      type: 'enum',
      values: buttonContract.props.size.values,
      default: 'md',
    },
  },
  states: ['default', 'hover', 'focus-visible'],
  accessibility: [
    'Use an anchor for navigation and a button for actions.',
    'The accessible name comes from the link text.',
    'Button appearance does not change the element to a button.',
    'Variant and size apply only when appearance is button.',
  ],
  targets: ['html', 'react', 'shopify-liquid', 'bigcommerce-stencil'],
  preview: {
    content: 'View example',
    props: { href: '/example', appearance: 'button' },
  },
} as const satisfies ComponentContract;

export type LinkProps = ContractProps<typeof linkContract>;
export type LinkAppearance = NonNullable<LinkProps['appearance']>;

import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const productCardContract = {
  name: 'ProductCard',
  version: 1,
  description:
    'Presents caller-supplied product content. A destination makes the whole card one link; without one it remains a static article. No cart, pricing calculation, availability or tax policy is implied.',
  element: 'article or a',
  props: {
    title: { type: 'string', required: true },
    href: { type: 'string', description: 'Optional real destination. Omit for a non-interactive presentation.' },
    eyebrow: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string', description: 'Optional fully formatted caller-owned price and qualifying terms.' },
    badge: { type: 'string', description: 'Optional caller-owned status, never an inferred promotional claim.' },
  },
  parts: {
    image: 'Optional typed media with src and alt, rendered only when supplied; no fabricated image fallback.',
    heading: 'Renderer-owned heading level h2, h3 or h4, defaulting to h3.',
  },
  states: ['default', 'hover', 'focus-visible'],
  accessibility: [
    'A card with href is a single anchor; do not nest other interactive controls inside it.',
    'A card without href is an article and has no fake interactive affordance.',
    'Supply meaningful image alternative text, or an empty alt when the title already conveys it.',
    'Price, status and qualifying terms come from the caller, not fixture business rules.',
  ],
  targets: ['html'],
  preview: {
    props: {
      title: 'Prototype packaging card',
      eyebrow: 'Presentation example',
      description:
        'Optional product media, descriptive text and a real destination are supplied by the consuming page.',
    },
  },
} as const satisfies ComponentContract;

export interface ProductCardImage {
  src: string;
  alt: string;
}

export type ProductCardProps = ContractProps<typeof productCardContract> & {
  image?: ProductCardImage;
  heading?: 'h2' | 'h3' | 'h4';
};

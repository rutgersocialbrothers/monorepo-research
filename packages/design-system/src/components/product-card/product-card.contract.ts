import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const productCardContract = {
  name: 'ProductCard',
  version: 2,
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
    actionLabel: {
      type: 'string',
      description:
        'Optional visible caller-owned call to action ("Bekijk product" in the source), rendered only on a linked card as a styled part of the one link, never a nested control. Default cards show a navy bar with an arrow; framed cards an outlined, centered label without arrow.',
    },
    framed: {
      type: 'boolean',
      default: false,
      description:
        'Candidate framed option from the source product slider v2 (6f9c7e2 .card-product--framed, after the client Paper design): bordered white card with inner padding, 7:6 media on the pale brand field, stat chips with a hairline, secondary-color stock text, quieter hover and an outlined action. Presentation only; the content and order stay the same.',
    },
  },
  parts: {
    image: 'Optional typed media with src and alt, rendered only when supplied; no fabricated image fallback.',
    heading: 'Renderer-owned heading level h2, h3 or h4, defaulting to h3.',
    stats:
      'Optional caller-owned label/value facts (source card-product__stats, e.g. variants, price from, minimum order), rendered as an evenly divided row; framed cards set each on a chip with a hairline. Values are never computed or invented by the renderer.',
    stock:
      'Optional caller-owned availability text with tone in | lead | out choosing the status dot (success, warning, muted). The text always carries the meaning; the dot is decorative.',
  },
  states: ['default', 'framed', 'hover', 'focus-visible'],
  accessibility: [
    'The action label is plain text inside the card link and joins its accessible name after the title; keep it short and never render it on a card without href.',
    'A card with href is a single anchor; do not nest other interactive controls inside it.',
    'A card without href is an article and has no fake interactive affordance.',
    'Supply meaningful image alternative text, or an empty alt when the title already conveys it.',
    'Price, stats, stock, status and qualifying terms come from the caller, not fixture business rules.',
    'Stats are a description list inside the card; the stock dot is aria-hidden and never the only signal.',
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

export interface ProductCardStat {
  label: string;
  value: string;
}

export interface ProductCardStock {
  label: string;
  tone?: 'in' | 'lead' | 'out';
}

export type ProductCardProps = ContractProps<typeof productCardContract> & {
  image?: ProductCardImage;
  heading?: 'h2' | 'h3' | 'h4';
  stats?: ReadonlyArray<ProductCardStat>;
  stock?: ProductCardStock;
};

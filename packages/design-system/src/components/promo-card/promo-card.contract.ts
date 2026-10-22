import type { ComponentContract, ContractProps } from '../../contracts/schema';

export const promoCardContract = {
  name: 'PromoCard',
  version: 1,
  description:
    'Candidate banner card sized like a product card so it can lead a product rail (source 6f9c7e2 .card-promo, after a client reference: the maatwerk card in the first slot of the product slider v2). A navy field carries an optional kicker and a large heading; an optional photograph fills the rest, with the action label standing on it. With an action the whole card is one link; without one it is a static article.',
  element: 'a or article',
  props: {
    title: { type: 'string', required: true },
    kicker: { type: 'string', description: 'Optional caller-owned short label above the heading.' },
    description: { type: 'string', description: 'Optional caller-owned supporting sentence under the heading.' },
  },
  parts: {
    image:
      'Optional typed media with src and alt; decorative cover photography usually takes an empty alt. Words stay on the navy field, never on the photograph.',
    action:
      'Optional real destination and visible label. Makes the card one link; the label renders as a styled part of it, not a nested control.',
    heading: 'Renderer-owned heading level h2, h3 or h4, defaulting to h3 to sit beside product cards.',
  },
  states: ['default', 'hover', 'focus-visible'],
  accessibility: [
    'The card is a single anchor only when an action is supplied; its accessible name is the kicker, heading and action label in reading order.',
    'Do not nest other interactive controls inside the card.',
    'Light text sits on --surface-inverse, not on the photograph, so no scrim is needed; the action uses the navy navigation fill because the photograph is near white at its foot.',
    'The action transition is removed under reduced motion.',
  ],
  targets: ['html'],
  preview: {
    props: {
      title: 'Prototype promo card',
      kicker: 'Presentation example',
    },
  },
} as const satisfies ComponentContract;

export interface PromoCardImage {
  src: string;
  alt: string;
}

export interface PromoCardAction {
  label: string;
  href: string;
}

export type PromoCardProps = ContractProps<typeof promoCardContract> & {
  image?: PromoCardImage;
  action?: PromoCardAction;
  heading?: 'h2' | 'h3' | 'h4';
};

import type { ProductCardProps } from '../../components/product-card/product-card.contract';
import type { StockState } from '../collection-reference/collection.data';
import type { SectionImage } from '../homepage.contract';
import { referenceUpdateAssets as updates } from '../prototype-update-assets';
import { referenceAssets as media } from '../reference-assets';

/**
 * Product page fixtures transcribed from prototype/product.html, snippets/buy-box.html, order-matrix.html,
 * product-specs.html, product-gallery.html and blocks/related-products.html (6f9c7e2). EXAMPLE DATA: sizes, article
 * numbers, prices, quantity breaks, stock, rating and specifications are invented by the source; [between brackets] is
 * a fact Tupak still has to supply. Nothing here is an offer and nothing is ever ordered.
 */
export interface PriceBreak {
  min: number;
  /**
   * Euros per piece, excl. btw.
   */
  price: number;
}
export interface ProductVariant {
  sku: string;
  size: { l: number; b: number; h: number };
  kwaliteit: 'Enkelgolf' | 'Dubbelgolf';
  /**
   * Bundle (Shopify variant.quantity_rule.increment).
   */
  step: number;
  /**
   * Minimum (variant.quantity_rule.min).
   */
  moq: number;
  pallet: number;
  /**
   * Grams per piece.
   */
  gewicht: number;
  stock: StockState;
  stockLabel: string;
  /**
   * Variant.quantity_price_breaks from a B2B catalog, any number of them, the variant price first. A single entry means
   * no quantity breaks: what a guest, or a catalog without breaks for that variant, sees.
   */
  tiers: ReadonlyArray<PriceBreak>;
}

const inStock = { stock: 'in', stockLabel: 'Op voorraad' } as const;

export const productVariants: ReadonlyArray<ProductVariant> = [
  {
    sku: '1520',
    size: { l: 200, b: 150, h: 100 },
    kwaliteit: 'Enkelgolf',
    step: 25,
    moq: 25,
    pallet: 2400,
    gewicht: 95,
    ...inStock,
    tiers: [
      { min: 25, price: 0.34 },
      { min: 50, price: 0.32 },
      { min: 100, price: 0.3 },
      { min: 250, price: 0.27 },
      { min: 500, price: 0.24 },
    ],
  },
  {
    sku: '1524',
    size: { l: 250, b: 200, h: 150 },
    kwaliteit: 'Enkelgolf',
    step: 25,
    moq: 25,
    pallet: 1800,
    gewicht: 150,
    ...inStock,
    tiers: [
      { min: 25, price: 0.46 },
      { min: 50, price: 0.43 },
      { min: 100, price: 0.4 },
      { min: 250, price: 0.36 },
      { min: 500, price: 0.33 },
      { min: 900, price: 0.31 },
      { min: 1800, price: 0.29 },
      { min: 3600, price: 0.27 },
    ],
  },
  {
    sku: '1536',
    size: { l: 305, b: 220, h: 150 },
    kwaliteit: 'Enkelgolf',
    step: 25,
    moq: 25,
    pallet: 1200,
    gewicht: 205,
    ...inStock,
    tiers: [
      { min: 25, price: 0.59 },
      { min: 50, price: 0.55 },
      { min: 100, price: 0.51 },
      { min: 250, price: 0.47 },
      { min: 1200, price: 0.42 },
    ],
  },
  {
    sku: '1541',
    size: { l: 350, b: 250, h: 200 },
    kwaliteit: 'Enkelgolf',
    step: 25,
    moq: 25,
    pallet: 900,
    gewicht: 290,
    ...inStock,
    tiers: [
      { min: 25, price: 0.78 },
      { min: 50, price: 0.73 },
      { min: 100, price: 0.68 },
      { min: 250, price: 0.62 },
      { min: 900, price: 0.55 },
    ],
  },
  {
    sku: '1548',
    size: { l: 400, b: 300, h: 200 },
    kwaliteit: 'Dubbelgolf',
    step: 20,
    moq: 20,
    pallet: 600,
    gewicht: 520,
    stock: 'lead',
    stockLabel: 'Levertijd 5 werkdagen',
    tiers: [
      { min: 20, price: 1.04 },
      { min: 40, price: 0.98 },
      { min: 100, price: 0.91 },
      { min: 200, price: 0.85 },
      { min: 600, price: 0.76 },
    ],
  },
  {
    sku: '1552',
    size: { l: 400, b: 300, h: 300 },
    kwaliteit: 'Dubbelgolf',
    step: 20,
    moq: 20,
    pallet: 480,
    gewicht: 610,
    ...inStock,
    tiers: [{ min: 20, price: 1.22 }],
  },
  {
    sku: '1560',
    size: { l: 500, b: 400, h: 300 },
    kwaliteit: 'Dubbelgolf',
    step: 10,
    moq: 20,
    pallet: 240,
    gewicht: 890,
    ...inStock,
    tiers: [
      { min: 20, price: 1.68 },
      { min: 50, price: 1.57 },
      { min: 100, price: 1.46 },
      { min: 240, price: 1.33 },
    ],
  },
  {
    sku: '1566',
    size: { l: 600, b: 400, h: 400 },
    kwaliteit: 'Dubbelgolf',
    step: 10,
    moq: 10,
    pallet: 160,
    gewicht: 1250,
    ...inStock,
    tiers: [
      { min: 10, price: 2.35 },
      { min: 50, price: 2.19 },
      { min: 160, price: 1.98 },
    ],
  },
];
/**
 * The size the source page opens on (`selected` option); `?variant=<sku>` opens another, as a Shopify product URL does.
 */
export const defaultVariantSku = '1536';

export const productGallery: ReadonlyArray<{ image: SectionImage; label: string; cover: boolean }> = [
  {
    image: { src: media.foldingBox.src, alt: 'Amerikaanse vouwdoos, bruin, opgezet en open' },
    label: 'Foto 1: opgezet en open',
    cover: false,
  },
  {
    image: { src: media.boxes.src, alt: 'Bruine kartonnen dozen, gestapeld' },
    label: 'Foto 2: gestapeld',
    cover: true,
  },
  {
    image: { src: updates['categories/intro-verzenddozen.jpg'].src, alt: 'Verzenddozen in gebruik' },
    label: 'Foto 3: in gebruik',
    cover: true,
  },
];

export const productUsps = [
  'Enkelgolf tot 20 kg, dubbelgolf tot 40 kg',
  'Plat geleverd, in een paar seconden opgezet',
  'Sluit met tape; geen nietjes of lijm nodig',
] as const;

/**
 * Source fixture: 4,7 of 5 from 38 reviews — invented, like the review content below it.
 */
export const productRating = { value: 4.7, label: '4,7 van 5 sterren', count: '4,7 · 38 reviews' } as const;

/**
 * Product-level rows; variant rows are rendered from the chosen variant. SUST-1 rows are the last four.
 */
export const productSpecRows = {
  model: 'FEFCO 0201',
  kleur: 'Bruin',
  materiaal: 'Golfkarton',
  gerecycled: '[percentage]',
  recyclebaar: 'Ja, bij het oud papier',
} as const;

const terms = 'excl. btw · met staffelkorting';
/**
 * "Vaak samen besteld": the source cards link to placeholder `#`, so they render as static cards here.
 */
export const relatedProducts: ReadonlyArray<ProductCardProps> = [
  {
    title: 'Papieren tape, bruin',
    description: `50 mm breed · rol van 50 m · ${terms}`,
    image: { src: media.tape.src, alt: '' },
    stats: [
      { label: 'varianten', value: '6' },
      { label: 'vanaf · p/s', value: '€ 1,89' },
      { label: 'min. afname', value: '6 rollen' },
    ],
    stock: { label: 'Op voorraad', tone: 'in' },
  },
  {
    title: 'Luchtkussenfolie',
    description: `Rol van 100 m · 3 breedtes · ${terms}`,
    image: { src: media.protection.src, alt: '' },
    stats: [
      { label: 'varianten', value: '3' },
      { label: 'vanaf · p/s', value: '€ 14,50' },
      { label: 'min. afname', value: '1 rol' },
    ],
    stock: { label: 'Op voorraad', tone: 'in' },
  },
  {
    title: 'Papieren verzendzakken',
    description: `Met plakstrip · 5 maten · ${terms}`,
    image: { src: media.paperBag.src, alt: '' },
    stats: [
      { label: 'varianten', value: '5' },
      { label: 'vanaf · p/s', value: '€ 0,21' },
      { label: 'min. afname', value: '100 stuks' },
    ],
    stock: { label: 'Op voorraad', tone: 'in' },
  },
  {
    title: 'Verzendkokers met deksel',
    description: `Ø 60 mm · 4 lengtes · ${terms}`,
    image: { src: media.shippingTube.src, alt: '' },
    stats: [
      { label: 'varianten', value: '4' },
      { label: 'vanaf · p/s', value: '€ 0,74' },
      { label: 'min. afname', value: '25 stuks' },
    ],
    stock: { label: 'Op voorraad', tone: 'in' },
  },
];

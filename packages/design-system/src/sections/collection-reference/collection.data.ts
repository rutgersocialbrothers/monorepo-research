import type { SectionImage } from '../homepage.contract';
import { referenceUpdateAssets as updates } from '../prototype-update-assets';
import { referenceAssets as media } from '../reference-assets';

/**
 * Collection reference fixtures, transcribed from JPPACQ/tupak-design-system 6f9c7e2: the catalogue menu
 * (prototype/snippets/menu-catalogue.html), the product listing (snippets/product-listing.html) and the filter panel
 * (snippets/filter-sidebar.html). PROTOTYPE CONTENT: names, prices, stock and sizes are the source's invented examples,
 * not an approved catalogue or offer. Images are decorative (the name is beside them), so alt is empty.
 */
export interface CatalogueLink {
  name: string;
  image?: SectionImage;
}
export interface CatalogueType extends CatalogueLink {
  children: ReadonlyArray<CatalogueLink>;
  /**
   * Related subcategories that fill a short subcategory row, tagged "Gerelateerd".
   */
  related: ReadonlyArray<string>;
}

// Images beside a visible name are decorative, so their alt is empty.
function decorative(src: string): SectionImage {
  return { src, alt: '' };
}
function names(...list: Array<string>): ReadonlyArray<CatalogueLink> {
  return list.map((name) => ({ name }));
}

/**
 * Menu order is meaningful: a subcategory listed under two product types belongs to the first (breadcrumb parent).
 */
export const catalogue: ReadonlyArray<CatalogueType> = [
  {
    name: 'Dozen',
    image: decorative(media.boxes.src),
    related: [],
    children: [
      { name: 'Amerikaanse vouwdoos', image: decorative(media.foldingBox.src) },
      { name: 'Verzenddozen', image: decorative(updates['categories/pakketten.png'].src) },
      { name: 'Brievenbusdozen', image: decorative(updates['categories/postdozen.png'].src) },
      { name: 'Palletdozen', image: decorative(updates['categories/grootverpakking.png'].src) },
      ...names('Boekverpakkingen', 'Ordnerverpakkingen', 'Flesverpakkingen'),
      { name: 'Geschenkdozen', image: decorative(updates['categories/geschenkdozen.png'].src) },
      ...names('Speciale dozen'),
    ],
  },
  {
    name: 'Kokers',
    image: decorative(media.tubes.src),
    related: ['Verzenddozen', 'Verzendenveloppen', 'Verpakkingstape'],
    children: [
      { name: 'Kartonnen kokers', image: decorative(updates['categories/kokers.png'].src) },
      { name: 'Kunststof kokers', image: decorative(media.shippingTube.src) },
      ...names('Diplomakokers'),
    ],
  },
  {
    name: 'Enveloppen en zakken',
    image: decorative(media.bags.src),
    related: [],
    children: [
      ...names('Verzendenveloppen', 'Paklijstenveloppen', 'Luchtkussen enveloppen', 'Plastic zakjes'),
      { name: 'Verzendzakken', image: decorative(media.paperBag.src) },
      ...names('Stazakken'),
    ],
  },
  {
    name: 'Tape en etiketten',
    image: decorative(media.tape.src),
    related: [],
    children: names(
      'Verpakkingstape',
      'Markeringsstickers',
      'Dozensluiter en tapeafrollers',
      'Sluitzegels',
      'Verzendetiketten',
      'Labelprinters',
      'Waarschuwingsetiketten',
    ),
  },
  {
    name: 'Folie en pallets',
    related: [],
    children: names(
      'Handwikkelfolie',
      'Machinewikkelfolie',
      'Veiligheidsmessen',
      'Pallets en palletbescherming',
      'Luchtkussenfolie',
      'Folie dispensers',
    ),
  },
  {
    name: 'Opvullen en beschermen',
    image: decorative(media.protection.src),
    related: [],
    children: names(
      'Opvulmateriaal',
      'Papier opvulmachines',
      'Papier voor opvulmachines',
      'Omsnoeringsband',
      'SizzlePak opvulmateriaal',
      'Pallet- en hoekbescherming',
      'Luchtkussenfolie',
      'Palletplaten karton',
      'Karton en pakpapier',
      'Schuimfolie',
    ),
  },
  {
    name: 'Geschenkverpakkingen',
    image: decorative(media.gifts.src),
    related: [],
    children: names(
      'Draagtassen',
      'Katoenen tassen',
      'Canvas tassen',
      'Wijntassen',
      'Fleszakken',
      'Geschenkzakjes',
      'Vloeipapier',
      'Cadeaulint',
      'Cadeaustickers op rol',
    ),
  },
  { name: 'Horeca', related: ['Draagtassen', 'Fleszakken', 'Vloeipapier', 'Geschenkdozen'], children: [] },
];

/**
 * The subcategory row is filled up to this many cards with related categories.
 */
export const subcategoryRowLength = 6;

export interface SubcategoryCard extends CatalogueLink {
  related: boolean;
}

/**
 * The row under the title per product type, or every product type when no category resolves.
 *
 * @param type The resolved product type, if any.
 *
 * @returns Its subcategories filled up with related ones, or every product type.
 */
export function subcategoryRow(type: CatalogueType | undefined): ReadonlyArray<SubcategoryCard> {
  if (!type) {
    return catalogue.map((item) => ({ name: item.name, image: item.image, related: false }));
  }
  const own = type.children.map((child) => ({ ...child, related: false }));
  const everySub = catalogue.flatMap((item) => item.children);
  const fill = type.related
    .map((name) => everySub.find((child) => child.name === name))
    .filter((child): child is CatalogueLink => child !== undefined)
    .slice(0, Math.max(0, subcategoryRowLength - own.length))
    .map((child) => ({ ...child, related: true }));
  return [...own, ...fill];
}

export type StockState = 'in' | 'lead' | 'out';

export interface ListingProduct {
  title: string;
  meta: string;
  image: SectionImage;
  /**
   * Only the first source card links to a real product page; the others had placeholder `#` links.
   */
  href?: string;
  variants?: number;
  /**
   * Cents; absent for a quote-only product, which sorts last in both price orders.
   */
  priceCents?: number;
  priceLabel: string;
  terms: string;
  minafname?: number;
  bundelgrootte?: number;
  materiaal?: 'golfkarton' | 'massief-karton' | 'papier' | 'kunststof';
  kleur?: 'bruin' | 'wit' | 'zwart' | 'grijs';
  /**
   * Inner size in millimetres; absent on a custom product, which has no fixed size.
   */
  size?: { lengte: number; breedte: number; hoogte: number };
  stock?: StockState;
  stockLabel: string;
  created: string;
  rank: number;
}

const standardTerms = 'excl. btw · met staffelkorting';

export const listingProducts: ReadonlyArray<ListingProduct> = [
  {
    title: 'Amerikaanse vouwdoos',
    meta: 'Enkelgolf bruin · FEFCO 0201',
    image: decorative(media.foldingBox.src),
    href: '/product',
    variants: 6,
    priceCents: 42,
    priceLabel: '€ 0,42',
    terms: standardTerms,
    minafname: 100,
    bundelgrootte: 25,
    materiaal: 'golfkarton',
    kleur: 'bruin',
    size: { lengte: 310, breedte: 220, hoogte: 250 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2024-03-12',
    rank: 1,
  },
  {
    title: 'Magneetdozen',
    meta: 'Zonder plakken · luxe afwerking',
    image: decorative(media.magneticBox.src),
    variants: 3,
    priceCents: 117,
    priceLabel: '€ 1,17',
    terms: standardTerms,
    minafname: 25,
    bundelgrootte: 25,
    materiaal: 'massief-karton',
    kleur: 'bruin',
    size: { lengte: 220, breedte: 160, hoogte: 100 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2025-11-04',
    rank: 4,
  },
  {
    title: 'Papieren verzendzakken',
    meta: 'Scheurvast · recyclebaar',
    image: decorative(media.paperBag.src),
    variants: 4,
    priceCents: 29,
    priceLabel: '€ 0,29',
    terms: standardTerms,
    minafname: 50,
    bundelgrootte: 50,
    materiaal: 'papier',
    kleur: 'bruin',
    size: { lengte: 400, breedte: 300, hoogte: 80 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2026-02-18',
    rank: 2,
  },
  {
    title: 'Verzendkokers met deksel',
    meta: 'Ø 50–100 mm',
    image: decorative(media.shippingTube.src),
    variants: 8,
    priceCents: 88,
    priceLabel: '€ 0,88',
    terms: standardTerms,
    minafname: 25,
    bundelgrootte: 25,
    materiaal: 'massief-karton',
    kleur: 'wit',
    size: { lengte: 750, breedte: 100, hoogte: 100 },
    stock: 'lead',
    stockLabel: 'Levertijd 1–2 weken',
    created: '2023-09-30',
    rank: 3,
  },
  {
    title: 'Brievenbusdoos A4',
    meta: 'Past door de brievenbus · wit',
    image: decorative(media.foldingBox.src),
    variants: 5,
    priceCents: 36,
    priceLabel: '€ 0,36',
    terms: standardTerms,
    minafname: 50,
    bundelgrootte: 50,
    materiaal: 'golfkarton',
    kleur: 'wit',
    size: { lengte: 310, breedte: 220, hoogte: 30 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2026-06-02',
    rank: 5,
  },
  {
    title: 'Geschenkdoos met magneetsluiting',
    meta: 'Zwart · 3 formaten',
    image: decorative(media.magneticBox.src),
    variants: 3,
    priceCents: 149,
    priceLabel: '€ 1,49',
    terms: standardTerms,
    minafname: 25,
    bundelgrootte: 25,
    materiaal: 'massief-karton',
    kleur: 'zwart',
    size: { lengte: 330, breedte: 220, hoogte: 100 },
    stock: 'out',
    stockLabel: 'Tijdelijk uitverkocht',
    created: '2026-08-21',
    rank: 7,
  },
  {
    title: 'Verzendzak met dubbele plakstrip',
    meta: 'Voor retouren · grijs',
    image: decorative(media.paperBag.src),
    variants: 4,
    priceCents: 33,
    priceLabel: '€ 0,33',
    terms: standardTerms,
    minafname: 100,
    bundelgrootte: 100,
    materiaal: 'kunststof',
    kleur: 'grijs',
    size: { lengte: 450, breedte: 350, hoogte: 60 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2025-05-15',
    rank: 6,
  },
  {
    title: 'Kartonnen koker bruin',
    meta: 'Ø 60 mm · 4 lengtes',
    image: decorative(media.shippingTube.src),
    variants: 4,
    priceCents: 74,
    priceLabel: '€ 0,74',
    terms: standardTerms,
    minafname: 25,
    bundelgrootte: 25,
    materiaal: 'massief-karton',
    kleur: 'bruin',
    size: { lengte: 600, breedte: 60, hoogte: 60 },
    stock: 'in',
    stockLabel: 'Op voorraad',
    created: '2024-12-01',
    rank: 8,
  },
  {
    title: 'Maatwerk dozen',
    meta: 'Eigen formaat · bedrukking mogelijk',
    image: decorative(media.foldingBox.src),
    priceLabel: 'Op aanvraag',
    terms: 'Offerte op maat · reactie binnen één werkdag',
    stockLabel: 'Levertijd in overleg',
    created: '2022-01-10',
    rank: 9,
  },
];

export const sortOptions = [
  { value: 'best-selling', label: 'Best verkocht' },
  { value: 'title-ascending', label: 'Naam, A–Z' },
  { value: 'title-descending', label: 'Naam, Z–A' },
  { value: 'price-ascending', label: 'Prijs, laag naar hoog' },
  { value: 'price-descending', label: 'Prijs, hoog naar laag' },
  { value: 'created-descending', label: 'Nieuwste eerst' },
] as const;

export interface CheckboxFilter {
  title: string;
  /**
   * Shopify Search & Discovery parameter name; the last segment is the product data key.
   */
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}

export const checkboxFilters: ReadonlyArray<CheckboxFilter> = [
  { title: 'Beschikbaarheid', name: 'filter.v.availability', options: [{ value: '1', label: 'Op voorraad' }] },
  {
    title: 'Materiaal',
    name: 'filter.p.m.custom.materiaal',
    options: [
      { value: 'golfkarton', label: 'Golfkarton' },
      { value: 'massief-karton', label: 'Massief karton' },
      { value: 'papier', label: 'Papier' },
      { value: 'kunststof', label: 'Kunststof' },
    ],
  },
  {
    title: 'Kleur',
    name: 'filter.v.option.kleur',
    options: [
      { value: 'bruin', label: 'Bruin' },
      { value: 'wit', label: 'Wit' },
      { value: 'zwart', label: 'Zwart' },
      { value: 'grijs', label: 'Grijs' },
    ],
  },
  {
    title: 'Bundelgrootte',
    name: 'filter.p.m.custom.bundelgrootte',
    options: [
      { value: '25', label: 'Per 25 stuks' },
      { value: '50', label: 'Per 50 stuks' },
      { value: '100', label: 'Per 100 stuks' },
    ],
  },
];

export interface RangeFilter {
  title: string;
  /**
   * Product data key the range compares against.
   */
  key: 'price' | 'minafname';
  min: number;
  max: number;
  step: number;
  /**
   * Product values divided by this before comparing (price: cents → euros).
   */
  scale: number;
  decimals: number;
  prefix?: string;
  unit?: string;
  scaleMarks: readonly [string, string, string];
  open: boolean;
  lowLabel: string;
  highLabel: string;
}

export const rangeFilters: ReadonlyArray<RangeFilter & { lowName: string; highName: string }> = [
  {
    title: 'Prijs per stuk',
    key: 'price',
    lowName: 'filter.v.price.gte',
    highName: 'filter.v.price.lte',
    min: 0,
    max: 2,
    step: 0.05,
    scale: 100,
    decimals: 2,
    prefix: '€ ',
    scaleMarks: ['€ 0', '€ 1', '€ 2'],
    open: true,
    lowLabel: 'Prijs per stuk, minimum in euro',
    highLabel: 'Prijs per stuk, maximum in euro',
  },
  {
    title: 'Minimale afname',
    key: 'minafname',
    lowName: 'filter.v.m.custom.minafname.gte',
    highName: 'filter.v.m.custom.minafname.lte',
    min: 0,
    max: 250,
    step: 25,
    scale: 1,
    decimals: 0,
    unit: 'stuks',
    scaleMarks: ['0', '125', '250'],
    open: false,
    lowLabel: 'Minimale afname, minimum in stuks',
    highLabel: 'Minimale afname, maximum in stuks',
  },
];

/**
 * Source size-class step (data-size-step): 100 mm, an example Tupak still has to decide per dimension.
 */
export const sizeClassStep = 100;

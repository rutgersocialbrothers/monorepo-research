import type { BranchItem } from './branch-nav/branch-nav.types';
import type { MosaicPanel, MosaicTile } from './category-mosaic/category-mosaic.types';
import type { SectionImage, SectionLink } from './homepage.contract';
import type { ImageSlide } from './image-slider/image-slider.types';
import { referenceUpdateAssets as updates } from './prototype-update-assets';
import { referenceAssets as media } from './reference-assets';

/*
 * Exact prototype fixture copy from JPPACQ/tupak-design-system afd9c66..6f9c7e2. Explicit examples only:
 * the six branches are source examples (Tupak supplies the list), [between brackets] is a fact Tupak still
 * has to supply, and all imagery is provisional candidate artwork, not production-cleared.
 */

/**
 * Source header/branch-row order. Cutouts are generated prototype stand-ins; their names are the visible labels.
 */
export const prototypeBranches: ReadonlyArray<BranchItem> = [
  {
    label: 'Wijn en drank',
    href: '/collection?branche=Wijn+en+drank',
    image: { src: updates['branches/wijn-en-drank.png'].src, alt: '' },
  },
  { label: 'Horeca', href: '/collection?branche=Horeca', image: { src: updates['branches/horeca.png'].src, alt: '' } },
  {
    label: 'E-commerce',
    href: '/collection?branche=E-commerce',
    image: { src: updates['branches/e-commerce.png'].src, alt: '' },
  },
  { label: 'Food', href: '/collection?branche=Food', image: { src: updates['branches/food.png'].src, alt: '' } },
  {
    label: 'Cosmetica',
    href: '/collection?branche=Cosmetica',
    image: { src: updates['branches/cosmetica.png'].src, alt: '' },
  },
  {
    label: 'Industrie',
    href: '/collection?branche=Industrie',
    image: { src: updates['branches/industrie.png'].src, alt: '' },
  },
];

/**
 * The header's red sale entry (twinkling-star trial) and the homepage "Sale" chip destination.
 */
export const prototypeSale: SectionLink = { label: 'Uitverkoop', href: '/collection?lijst=sale' };

const maatwerkSlide: ImageSlide = {
  kicker: 'Maatwerk',
  title: 'Een verpakking die alleen van jou is',
  image: { src: updates['categories/image-slider-maatwerk-warm.jpg'].src, alt: '' },
  action: { label: 'Vraag een offerte aan', href: '/preview#maatwerk' },
};
const branchesSlide: ImageSlide = {
  kicker: 'Branches',
  title: 'Verpakkingen voor jouw branche',
  image: { src: updates['blog/image-slider-branches-warm.jpg'].src, alt: '' },
  action: { label: 'Bekijk de branches', href: '/branches' },
};
const assortimentSlide: ImageSlide = {
  kicker: 'Assortiment',
  title: '[Aantal] verpakkingen uit voorraad, met staffelprijzen',
  image: { src: updates['categories/image-slider-staffel-warm.jpg'].src, alt: '' },
  action: { label: 'Bekijk het assortiment', href: '/collection' },
};

/**
 * The three shop entrances with the warm photographs the source uses.
 */
export const prototypeSlides: ReadonlyArray<ImageSlide> = [maatwerkSlide, branchesSlide, assortimentSlide];
/**
 * The source opens on the second slide at the client's request; ImageSlider startIndex is zero-based.
 */
export const prototypeSlideStartIndex = 1;

/**
 * The same entrances with the cooler photographs added in the same source commit (9b24351) but not referenced by any
 * source page: the distribution-centre and white-assortment pictures. Maatwerk has no cool alternative, so it keeps the
 * original maatwerk reference photograph. A review option, not a source variant.
 */
export const prototypeSlidesCool: ReadonlyArray<ImageSlide> = [
  { ...maatwerkSlide, image: { src: media.custom.src, alt: '' } },
  { ...branchesSlide, image: { src: updates['blog/image-slider-branches.jpg'].src, alt: '' } },
  { ...assortimentSlide, image: { src: updates['categories/image-slider-assortiment.jpg'].src, alt: '' } },
];

export interface PromoCard {
  kicker: string;
  title: string;
  image: SectionImage;
  action: SectionLink;
}
/**
 * The maatwerk banner card that leads the product slider v2 (source card-promo); one link for the whole card.
 */
export const prototypePromo: PromoCard = {
  kicker: 'Maatwerk',
  title: 'Een verpakking die alleen van jou is',
  image: { src: media.custom.src, alt: '' },
  action: { label: 'Vraag een offerte aan', href: '/preview#maatwerk' },
};

/**
 * The homepage catalogue mosaic (source blocks/category-mosaic.html, Figma 11-2777): six tiles, three panels. Copy is
 * the source fixture. Destinations the source leaves open ('#', placeholder phone, unverified mailbox) render as
 * non-interactive text; real contact destinations are decided during the Liquid adaptation.
 */
export const prototypeMosaic = {
  title: 'Ons assortiment',
  tiles: [
    {
      title: 'Geschenkdozen',
      href: '/collection?categorie=geschenkdozen',
      image: { src: updates['categories/geschenkdozen.png'].src, alt: '' },
    },
    {
      title: 'Postdozen',
      href: '/collection?categorie=postdozen',
      image: { src: updates['categories/postdozen.png'].src, alt: '' },
    },
    {
      title: 'Kokers',
      href: '/collection?categorie=kokers',
      image: { src: updates['categories/kokers.png'].src, alt: '' },
    },
    {
      title: 'Pakketten',
      href: '/collection?categorie=pakketten',
      image: { src: updates['categories/pakketten.png'].src, alt: '' },
    },
    {
      title: 'Grootverpakking',
      href: '/collection?categorie=grootverpakking',
      image: { src: updates['categories/grootverpakking.png'].src, alt: '' },
    },
    {
      title: 'Kaartverpakking',
      href: '/collection?categorie=kaartverpakking',
      image: { src: updates['products/keuzehulp-assortiment.png'].src, alt: '' },
    },
  ],
  contact: {
    eyebrow: 'Een stevige oplossing voor een scherpe prijs',
    claim: 'Grote aantallen',
    title: 'of advies nodig?',
    actions: [
      { label: 'Bel ons', icon: 'phone' },
      { label: 'Mail ons', icon: 'mail' },
    ],
    note: 'Prototypetekst. Telefoon en e-mail zijn niet geverifieerd en hier niet actief; de bron gebruikt een plaatshoudernummer.',
  },
  story: {
    eyebrow: 'Een stevige oplossing voor een scherpe prijs',
    claim: 'Voor elk product',
    title: 'een verpakking',
    body: 'Met 50 jaar ervaring helpen we jou aan de best passende verpakking — in de hele Benelux en Duitsland. Ontdek onze standaard verpakkingen en verpakkingsmateriaal. Of pak uit en ontwikkel een verpakking op maat!',
    actions: [
      {
        label: 'Bekijk verpakkingsmateriaal',
        href: '/collection?categorie=verpakkingsmateriaal',
        icon: 'arrow-right',
        iconPosition: 'end',
        variant: 'nav',
        block: true,
      },
      { label: 'Hoe wij te werk gaan', icon: 'info' },
    ],
    note: 'Prototypetekst, geen geverifieerde bedrijfsgegevens. "Hoe wij te werk gaan" heeft in de bron nog geen bestemming.',
  },
  banner: {
    claim: 'Producten op maat',
    title: 'speciaal voor jou',
    actions: [{ label: 'Bekijk onze cases', icon: 'arrow-right', iconPosition: 'end' }],
    note: 'De cases hebben in de bron nog geen bestemming.',
  },
} as const satisfies {
  title: string;
  tiles: ReadonlyArray<MosaicTile>;
  contact: MosaicPanel;
  story: MosaicPanel;
  banner: MosaicPanel;
};

export interface OverviewEntry {
  /**
   * Upstream section page slug, e.g. section-hero.
   */
  slug: string;
  title: string;
  description: string;
  purpose: string;
  /**
   * Static JPG copied from the upstream overview; a capture, not the live Astro rendering.
   */
  thumbnail: SectionImage;
  /**
   * Static full-size PNG capture of the same upstream preview.
   */
  capture: string;
  /**
   * Live native Astro destination.
   */
  primary: SectionLink;
  related: ReadonlyArray<SectionLink>;
}

const thumbs = {
  'section-header': {
    jpg: updates['overview-thumbs/section-header.jpg'].src,
    png: updates['overview-thumbs/section-header.png'].src,
  },
  'section-hero': {
    jpg: updates['overview-thumbs/section-hero.jpg'].src,
    png: updates['overview-thumbs/section-hero.png'].src,
  },
  'section-keuzehulp': {
    jpg: updates['overview-thumbs/section-keuzehulp.jpg'].src,
    png: updates['overview-thumbs/section-keuzehulp.png'].src,
  },
  'section-category-slider': {
    jpg: updates['overview-thumbs/section-category-slider.jpg'].src,
    png: updates['overview-thumbs/section-category-slider.png'].src,
  },
  'section-banner-pair': {
    jpg: updates['overview-thumbs/section-banner-pair.jpg'].src,
    png: updates['overview-thumbs/section-banner-pair.png'].src,
  },
  'section-image-slider': {
    jpg: updates['overview-thumbs/section-image-slider.jpg'].src,
    png: updates['overview-thumbs/section-image-slider.png'].src,
  },
  'section-branch-nav': {
    jpg: updates['overview-thumbs/section-branch-nav.jpg'].src,
    png: updates['overview-thumbs/section-branch-nav.png'].src,
  },
  'section-category-mosaic': {
    jpg: updates['overview-thumbs/section-category-mosaic.jpg'].src,
    png: updates['overview-thumbs/section-category-mosaic.png'].src,
  },
  'section-product-carousel': {
    jpg: updates['overview-thumbs/section-product-carousel.jpg'].src,
    png: updates['overview-thumbs/section-product-carousel.png'].src,
  },
  'section-image-with-text': {
    jpg: updates['overview-thumbs/section-image-with-text.jpg'].src,
    png: updates['overview-thumbs/section-image-with-text.png'].src,
  },
  'section-reviews': {
    jpg: updates['overview-thumbs/section-reviews.jpg'].src,
    png: updates['overview-thumbs/section-reviews.png'].src,
  },
  'section-publication-feed': {
    jpg: updates['overview-thumbs/section-publication-feed.jpg'].src,
    png: updates['overview-thumbs/section-publication-feed.png'].src,
  },
  'section-faq': {
    jpg: updates['overview-thumbs/section-faq.jpg'].src,
    png: updates['overview-thumbs/section-faq.png'].src,
  },
  'section-footer': {
    jpg: updates['overview-thumbs/section-footer.jpg'].src,
    png: updates['overview-thumbs/section-footer.png'].src,
  },
} as const;
function thumb(slug: keyof typeof thumbs): Pick<OverviewEntry, 'slug' | 'thumbnail' | 'capture'> {
  return { slug, thumbnail: { src: thumbs[slug].jpg, alt: '' }, capture: thumbs[slug].png };
}

const workbench: SectionLink = { label: 'Workbench-secties', href: '/#sections' };

/**
 * All 14 source overview cards, in source order, with copy verbatim and native Astro destinations.
 */
export const prototypeOverview: ReadonlyArray<OverviewEntry> = [
  {
    ...thumb('section-header'),
    title: 'Header',
    description: 'De vaste navigatie met merk, zoekfunctie, account en winkelmand.',
    purpose: 'bezoekers snel laten oriënteren en naar de juiste ingang brengen.',
    primary: { label: 'Bekijk in de preview', href: '/preview#site-header' },
    related: [workbench, { label: 'Met branchesmenu', href: '/branches' }],
  },
  {
    ...thumb('section-hero'),
    title: 'Hero',
    description: 'De eerste boodschap met beeld, belofte en een duidelijke vervolgstap.',
    purpose: 'in één oogopslag uitleggen wat Tupak voor de bezoeker kan doen.',
    primary: { label: 'Bekijk in de preview', href: '/preview#preview-main' },
    related: [workbench],
  },
  {
    ...thumb('section-keuzehulp'),
    title: 'Keuzehulp',
    description: 'Een korte route met vragen die bezoekers naar een passende verpakking leidt.',
    purpose: 'keuzestress verlagen en onzekerheid vroeg in de journey wegnemen.',
    primary: { label: 'Bekijk de sectie', href: '/section-keuzehulp' },
    related: [
      { label: 'Maatvelden in de categoriepagina', href: '/collection' },
      { label: 'Categoriepagina v2', href: '/collection-v2' },
    ],
  },
  {
    ...thumb('section-category-slider'),
    title: 'Categorieslider',
    description: 'Een horizontale rij met de belangrijkste productcategorieën.',
    purpose: 'het assortiment scanbaar maken en snel naar een productgroep leiden.',
    primary: { label: 'Bekijk in de preview', href: '/preview#categorieen' },
    related: [workbench],
  },
  {
    ...thumb('section-banner-pair'),
    title: 'Twee banners',
    description: 'Twee compacte promotiepanelen naast elkaar met elk een eigen route.',
    purpose: 'twee belangrijke acties of verhalen tegelijk zichtbaar maken.',
    primary: { label: 'Bekijk in de preview', href: '/preview#banners' },
    related: [workbench],
  },
  {
    ...thumb('section-image-slider'),
    title: 'Beeldslider',
    description: 'Brede beelden met label, kop en knop voor de drie belangrijkste ingangen.',
    purpose: 'bezoekers visueel laten kiezen tussen maatwerk, branches en assortiment.',
    primary: { label: 'Bekijk de sectie', href: '/section-image-slider' },
    related: [{ label: 'Op de branchespagina', href: '/branches' }],
  },
  {
    ...thumb('section-branch-nav'),
    title: 'Branches',
    description: 'Vrijstaande branchebeelden met een korte ingang per type bedrijf.',
    purpose: 'de relevantie van het assortiment herkenbaar maken per branche.',
    primary: { label: 'Bekijk de sectie', href: '/section-branch-nav' },
    related: [{ label: 'Op de branchespagina', href: '/branches' }],
  },
  {
    ...thumb('section-category-mosaic'),
    title: 'Categoriemozaïek',
    description: 'Een speels grid van categorieën en redactionele panelen met verschillende groottes.',
    purpose: 'productontdekking combineren met inspiratie en commerciële accenten.',
    primary: { label: 'Bekijk de sectie', href: '/section-category-mosaic' },
    related: [{ label: 'Categoriepagina', href: '/collection' }],
  },
  {
    ...thumb('section-product-carousel'),
    title: 'Productcarrousel',
    description: 'Een rij uitgelichte producten met prijs, voorraadcontext en vervolgstap.',
    purpose: 'bezoekers van inspiratie naar een concreet product brengen.',
    primary: { label: 'Bekijk de sectie', href: '/section-product-carousel' },
    related: [
      { label: 'v1 in de preview', href: '/preview#producten' },
      workbench,
      { label: 'Productpagina', href: '/product' },
    ],
  },
  {
    ...thumb('section-image-with-text'),
    title: 'Afbeelding met tekst',
    description: 'Een verdiepend verhaal naast een ondersteunend beeld.',
    purpose: 'uitleg en merkvertrouwen toevoegen zonder de route te onderbreken.',
    primary: { label: 'Bekijk in de preview', href: '/preview#maatwerk' },
    related: [workbench],
  },
  {
    ...thumb('section-reviews'),
    title: 'Reviews',
    description: 'Klantquotes met sterren, naam en context op een rustige kaart.',
    purpose: 'sociale bewijskracht geven op momenten waarop vertrouwen nodig is.',
    primary: { label: 'Bekijk in de preview', href: '/preview#reviews' },
    related: [workbench],
  },
  {
    ...thumb('section-publication-feed'),
    title: 'Publicaties',
    description: 'Een feed met artikelen en inzichten over verpakking en verzending.',
    purpose: 'expertise tonen en organische instroom ondersteunen.',
    primary: { label: 'Bekijk in de preview', href: '/preview#publicaties' },
    related: [workbench],
  },
  {
    ...thumb('section-faq'),
    title: 'Veelgestelde vragen',
    description: 'Uitklapbare antwoorden op praktische en inhoudelijke bezwaren.',
    purpose: 'twijfel verminderen en klanten helpen zelfstandig verder te gaan.',
    primary: { label: 'Bekijk in de preview', href: '/preview#vragen' },
    related: [workbench],
  },
  {
    ...thumb('section-footer'),
    title: 'Footer',
    description: 'De afsluitende navigatie met service, contact, vertrouwen en juridische links.',
    purpose: 'elke pagina afronden met duidelijke hulp en een laatste route vooruit.',
    primary: { label: 'Bekijk in de preview', href: '/preview#site-footer' },
    related: [workbench],
  },
];

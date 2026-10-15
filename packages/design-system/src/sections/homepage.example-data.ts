import type { ProductCardProps } from '../components/product-card/product-card.contract';
import type {
  BannerItem,
  CategoryItem,
  FaqItem,
  PublicationItem,
  ReviewItem,
  SectionLink,
  SectionPoint,
} from './homepage.contract';
import { referenceAssets as media } from './reference-assets';

// Explicit prototype examples only. Renderers never invent stock, prices, policies or testimonials.
// Real application data belongs to the consumer.
export const prototypeNavigation: ReadonlyArray<SectionLink> = [
  { label: 'Maatwerk', href: '#maatwerk' },
  { label: 'Publicaties', href: '#publicaties' },
  { label: 'Vragen', href: '#vragen' },
];
export const prototypeCategories: ReadonlyArray<CategoryItem> = [
  { title: 'Dozen', image: { src: media.boxes.src, alt: '' }, href: '#producten' },
  { title: 'Kokers', image: { src: media.tubes.src, alt: '' }, href: '#producten' },
  { title: 'Enveloppen en zakken', image: { src: media.bags.src, alt: '' }, href: '#producten' },
  { title: 'Tape en etiketten', image: { src: media.tape.src, alt: '' }, href: '#producten' },
  { title: 'Folie en pallets' },
  { title: 'Opvullen en beschermen', image: { src: media.protection.src, alt: '' }, href: '#producten' },
  { title: 'Geschenkverpakkingen', image: { src: media.gifts.src, alt: '' }, href: '#producten' },
  { title: 'Horeca' },
];
export const prototypePoints: ReadonlyArray<SectionPoint> = [
  { title: 'Assortiment', text: 'Dozen, kokers, tape en meer', icon: 'shopping-cart' },
  { title: 'Productinformatie', text: 'Ruimte voor maten en varianten', icon: 'info' },
  { title: 'Materiaal en vorm', text: 'Bekijk de verschillende voorbeelden', icon: 'sparkles' },
  { title: 'Maatwerk', text: 'Een eigen ontwerp als voorbeeld', icon: 'pencil' },
];
export const prototypeBanners: ReadonlyArray<BannerItem> = [
  {
    title: 'Direct bestellen',
    text: 'Een voorbeeldroute naar standaardverpakkingen. Deze preview toont de presentatie, niet een bestelproces.',
    tone: 'natural',
    image: { src: media.boxes.src, alt: '' },
    action: { label: 'Bekijk productvoorbeelden', href: '#producten' },
  },
  {
    title: 'Maatwerk',
    text: 'Een voorbeeldroute voor andere maten en eigen bedrukking. Er wordt geen offerte verstuurd.',
    tone: 'warm',
    photo: true,
    image: { src: media.custom.src, alt: '' },
    action: { label: 'Bekijk maatwerkvoorbeeld', href: '#maatwerk' },
  },
];
export const prototypeProducts: ReadonlyArray<ProductCardProps> = [
  {
    title: 'Amerikaanse vouwdoos',
    eyebrow: 'Prototype product',
    description: 'Kartonnen doos · voorbeeldpresentatie',
    image: { src: media.foldingBox.src, alt: 'Bruine kartonnen vouwdoos' },
    badge: 'Voorbeeld',
  },
  {
    title: 'Verzendkoker met deksel',
    eyebrow: 'Prototype product',
    description: 'Ronde koker · voorbeeldpresentatie',
    image: { src: media.shippingTube.src, alt: 'Kartonnen verzendkokers met deksels' },
  },
  {
    title: 'Papieren verzendzak',
    eyebrow: 'Prototype product',
    description: 'Papieren zak · voorbeeldpresentatie',
    image: { src: media.paperBag.src, alt: 'Papieren verzendzakken' },
  },
  {
    title: 'Magneetdoos',
    eyebrow: 'Prototype product',
    description: 'Geschenkdoos · voorbeeldpresentatie',
    image: { src: media.magneticBox.src, alt: 'Magneetdozen' },
  },
  {
    title: 'Product zonder beeld',
    eyebrow: 'Prototype leeg beeld',
    description: 'Ook zonder afbeelding blijft de productinformatie beschikbaar.',
  },
];
export const prototypeReviews: ReadonlyArray<ReviewItem> = [
  {
    title: 'Ruimte voor een ervaring',
    text: 'Dit is een fictieve review voor de vormgeving van een korte klantervaring. Het is geen echte aanbeveling.',
    author: 'Voorbeeldpersoon A',
    rating: 5,
  },
  {
    title: 'Ook langere verhalen passen',
    text: 'Deze fictieve review laat zien hoe meerdere regels tekst doorlopen in dezelfde kaart. De inhoud, afzender en sterren zijn uitsluitend prototypevoorbeelden, niet afkomstig van een klant of reviewplatform.',
    author: 'Voorbeeldpersoon B',
    rating: 4,
  },
  {
    title: 'Een heldere opbouw',
    text: 'Voorbeeldtekst om de hiërarchie tussen beoordeling, titel, ervaring en afzender te bekijken.',
    author: 'Voorbeeldpersoon C',
    rating: 5,
  },
  {
    title: 'Zonder aanvullende gegevens',
    text: 'Een reviewkaart kan ook zonder sterren, datum, productlink of afzender worden getoond.',
  },
  {
    title: 'Nog een layoutvoorbeeld',
    text: 'Fictieve inhoud, opgenomen om horizontaal scrollen te kunnen beoordelen.',
    author: 'Voorbeeldpersoon D',
    rating: 4,
  },
];
export const prototypePublications: ReadonlyArray<PublicationItem> = [
  {
    title: 'Papier tape of plastic tape: wat is slimmer voor jouw verpakking?',
    context: 'Prototype publicatie · bronartikel',
    image: { src: media.tapeArticle.src, alt: '' },
    href: 'https://www.tupak.com/blog/papier-tape-of-plastic-tape',
  },
  {
    title: 'Welke verpakkingen zijn geschikt voor fulfilmentcenters?',
    context: 'Prototype publicatie · bronartikel',
    image: { src: media.fulfilmentArticle.src, alt: '' },
    href: 'https://www.tupak.com/blog/welke-verpakkingen-geschikt-fulfilmentcenters',
  },
  {
    title: 'Wat is de beste verpakking voor kleine producten?',
    context: 'Prototype publicatie · bronartikel',
    image: { src: media.smallArticle.src, alt: '' },
    href: 'https://www.tupak.com/blog/beste-verpakking-kleine-producten',
  },
  { title: 'Een publicatie zonder afbeelding', context: 'Prototype leeg beeld' },
];
export const prototypeFaq: ReadonlyArray<FaqItem> = [
  {
    question: 'Kan ik in deze preview bestellen?',
    answer:
      'Nee. Dit is een ontwerpvoorbeeld met fictieve product- en reviewinhoud. Er is geen winkelwagen, checkout of actieve zoekfunctie gekoppeld.',
  },
  {
    question: 'Zijn prijzen, levering en voorwaarden al vastgesteld?',
    answer:
      'Deze workbench doet daar geen uitspraken over. Productprijzen, beschikbaarheid, verzendinformatie, retourvoorwaarden en andere bedrijfsgegevens moeten door de uiteindelijke toepassing worden aangeleverd.',
  },
  {
    question: 'Wat laat het maatwerkvoorbeeld zien?',
    answer:
      'De beeld-tekstcompositie laat ruimte zien voor een foto, introductie, opsomming en navigatielink. Een offerteproces maakt geen deel uit van dit design-systemvoorbeeld.',
  },
  {
    question: 'Is dit het definitieve ontwerp?',
    answer:
      'Nee. Dit is de huidige externe Tupak-referentie, handmatig aangepast aan de lokale Astro- en Tailwind-conventies. Ontwerpbeslissingen en beeldrechten vragen nog goedkeuring.',
  },
  {
    question: 'Waar vind ik de losse onderdelen?',
    answer: 'De workbench toont de herbruikbare componenten en secties afzonderlijk.',
    link: { label: 'Terug naar de secties', href: '/#sections' },
  },
];

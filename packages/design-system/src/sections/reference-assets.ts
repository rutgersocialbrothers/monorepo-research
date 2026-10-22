/**
 * Selected visual reference files copied from the sibling repository tupak-design-system at main afd9c66. All images
 * are byte-preserved except the logo's root currentColor is explicitly white for the navy presentation. Paths are
 * relative to the upstream assets/ folder. These are candidate reference assets, not production-cleared artwork. The
 * upstream prototype attributes category/product imagery to the client and publication imagery to tupak.com; that
 * attribution is not a license grant. No payment marks, policy content, archive or prototype runtime is copied. The
 * complete 6f9c7e2 update's added imagery is separately recorded in prototype-update-assets.ts.
 */
export const referenceAssets = {
  logo: { src: '/tupak-reference/tupak-logo.svg', source: 'brand/tupak-logo.svg' },
  hero: {
    src: '/tupak-reference/hero-assortiment-centered-1x1.png',
    source: 'products/hero-assortiment-centered-1x1.png',
  },
  boxes: { src: '/tupak-reference/cat-dozen.jpg', source: 'categories/cat-dozen.jpg' },
  tubes: { src: '/tupak-reference/cat-kokers.jpg', source: 'categories/cat-kokers.jpg' },
  bags: { src: '/tupak-reference/cat-verzendzakken.jpg', source: 'categories/cat-verzendzakken.jpg' },
  tape: { src: '/tupak-reference/cat-tape.jpg', source: 'categories/cat-tape.jpg' },
  protection: { src: '/tupak-reference/cat-bescherming.jpg', source: 'categories/cat-bescherming.jpg' },
  gifts: { src: '/tupak-reference/cat-geschenk.jpg', source: 'categories/cat-geschenk.jpg' },
  custom: { src: '/tupak-reference/maatwerk-postdoos.jpg', source: 'categories/maatwerk-postdoos.jpg' },
  foldingBox: { src: '/tupak-reference/amerikaanse-vouwdoos.webp', source: 'products/amerikaanse-vouwdoos.webp' },
  shippingTube: { src: '/tupak-reference/verzendkokers-deksel.webp', source: 'products/verzendkokers-deksel.webp' },
  paperBag: { src: '/tupak-reference/papieren-verzendzakken.webp', source: 'products/papieren-verzendzakken.webp' },
  magneticBox: { src: '/tupak-reference/magneetdozen.webp', source: 'products/magneetdozen.webp' },
  tapeArticle: {
    src: '/tupak-reference/papier-tape-of-plastic-tape.webp',
    source: 'blog/papier-tape-of-plastic-tape.webp',
  },
  fulfilmentArticle: {
    src: '/tupak-reference/welke-verpakkingen-geschikt-fulfilmentcenters.webp',
    source: 'blog/welke-verpakkingen-geschikt-fulfilmentcenters.webp',
  },
  smallArticle: {
    src: '/tupak-reference/beste-verpakking-kleine-producten.webp',
    source: 'blog/beste-verpakking-kleine-producten.webp',
  },
} as const;

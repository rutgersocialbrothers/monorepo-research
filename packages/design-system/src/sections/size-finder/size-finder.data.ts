/**
 * The keuzehulp's product groups, verbatim from blocks/hero-keuzehulp-v2.html (6f9c7e2). Prototype content, not an
 * approved catalogue. The values are slugs while the collection prototype resolves `categorie` by menu NAME, so they
 * arrive as an unresolved category there — a source inconsistency, surfaced on the collection pages, not remapped.
 */
export const keuzehulpCategories = [
  { value: 'kartonnen-dozen', label: 'Kartonnen dozen', selected: true },
  { value: 'brievenbusdozen', label: 'Brievenbusdozen', selected: false },
  { value: 'verzendkokers', label: 'Verzendkokers', selected: false },
  { value: 'verzendzakken', label: 'Verzendzakken', selected: false },
] as const;

import type { SectionImage } from '../homepage.contract';

/**
 * One branch route: a real destination with optional transparent cutout artwork.
 */
export interface BranchItem {
  label: string;
  href: string;
  image?: SectionImage;
}

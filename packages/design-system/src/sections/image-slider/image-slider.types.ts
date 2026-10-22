import type { SectionImage, SectionLink } from '../homepage.contract';

/**
 * One slide: presentation only. Callers own copy, imagery and destinations.
 */
export interface ImageSlide {
  title: string;
  kicker?: string;
  description?: string;
  image: SectionImage;
  action?: SectionLink;
}

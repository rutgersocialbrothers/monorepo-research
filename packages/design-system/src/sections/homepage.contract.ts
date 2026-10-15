import type { IconName } from '../components/icon/icon.contract';

/**
 * Presentation only: callers own content, destinations and business data.
 */
export interface SectionImage {
  src: string;
  alt: string;
}
export interface SectionLink {
  label: string;
  href: string;
}
export interface SectionPoint {
  title: string;
  text?: string;
  icon?: IconName;
}
export interface CategoryItem {
  title: string;
  image?: SectionImage;
  href?: string;
}
export interface BannerItem {
  title: string;
  text?: string;
  image?: SectionImage;
  action?: SectionLink;
  tone?: 'natural' | 'warm' | 'band';
  photo?: boolean;
}
export interface PublicationItem {
  title: string;
  context?: string;
  image?: SectionImage;
  href?: string;
  date?: { label: string; datetime: string };
}
export interface ReviewItem {
  title: string;
  text: string;
  author?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  date?: { label: string; datetime: string };
  subject?: SectionLink;
}
export interface FaqItem {
  question: string;
  answer: string;
  link?: SectionLink;
}

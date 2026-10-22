import type { ButtonVariant } from '../../components/button/button.contract';
import type { IconName } from '../../components/icon/icon.contract';
import type { SectionImage } from '../homepage.contract';

export interface MosaicTile {
  title: string;
  href: string;
  image?: SectionImage;
}

/**
 * An action with a real destination, or — without href — non-interactive text for unapproved contact data.
 */
export interface MosaicAction {
  label: string;
  href?: string;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  /**
   * Button treatment; the panel supplies a default.
   */
  variant?: ButtonVariant;
  /**
   * Fills the action column instead of sizing to the label.
   */
  block?: boolean;
}

export interface MosaicPanel {
  /**
   * Bold first line of the two-weight heading.
   */
  claim: string;
  title: string;
  eyebrow?: string;
  body?: string;
  actions?: ReadonlyArray<MosaicAction>;
  /**
   * Caption for fixture-only content, rendered visibly under the actions.
   */
  note?: string;
}

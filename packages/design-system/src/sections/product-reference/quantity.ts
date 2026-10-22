import type { PriceBreak } from './product.data';

/**
 * What the buy box and the order matrix share (prototype.js 6f9c7e2, "quantities, breaks and the product page"). The
 * 21% btw factor is the source's display assumption for the incl.-btw figure, not a tax rule.
 */
export const displayVatFactor = 1.21;

export function euro(value: number): string {
  return `€ ${value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function amount(value: number): string {
  return value.toLocaleString('nl-NL');
}

/**
 * The last break the quantity reaches; -1 below the first.
 *
 * @param tiers - Price breaks in ascending order of minimum.
 * @param quantity - Requested quantity.
 */
export function tierIndex(tiers: ReadonlyArray<PriceBreak>, quantity: number): number {
  let hit = -1;
  for (const [index, tier] of tiers.entries()) {
    if (quantity >= tier.min) {
      hit = index;
    }
  }
  return hit;
}

/**
 * Whole bundles, never under the minimum; 0 stays 0 where 0 is allowed.
 *
 * @param quantity - Requested quantity.
 * @param minimum - Minimum order quantity.
 * @param step - Bundle size.
 * @param allowZero - Whether 0 (nothing) is a valid result.
 */
export function snapQuantity(quantity: number, minimum: number, step: number, allowZero = true): number {
  if (quantity <= 0) {
    return allowZero ? 0 : minimum;
  }
  return Math.max(minimum, Math.round(quantity / step) * step);
}

/**
 * Plus from nothing goes to the minimum, then a bundle at a time; minus at the minimum goes back to nothing (or stays).
 *
 * @param quantity - Current quantity.
 * @param direction - Positive for plus, otherwise minus.
 * @param minimum - Minimum order quantity.
 * @param step - Bundle size.
 * @param allowZero - Whether minus at the minimum returns to 0.
 */
export function stepQuantity(
  quantity: number,
  direction: number,
  minimum: number,
  step: number,
  allowZero = true,
): number {
  if (direction > 0) {
    return quantity < minimum ? minimum : quantity + step;
  }
  return quantity <= minimum ? (allowZero ? 0 : minimum) : quantity - step;
}

/**
 * A break's label: "25+", or "1 pallet" where it is a whole number of pallets.
 *
 * @param tier - The price break.
 * @param pallet - Units per pallet; 0 when unknown.
 */
export function breakLabel(tier: PriceBreak, pallet: number): { from: string; pallets: number } {
  const pallets = pallet && tier.min % pallet === 0 ? tier.min / pallet : 0;
  return { from: `${amount(tier.min)}+`, pallets };
}

export function sizeLabel(size: { l: number; b: number; h: number }): string {
  return `${size.l} × ${size.b} × ${size.h}`;
}

import type { Dimension } from '../size-finder/box-geometry';

/*
 * Size-class filtering, after initCollectionFilters in prototype/assets/prototype.js (6f9c7e2). Shopify's own filters
 * cannot compare a metafield with "at least", so every variant carries a list metafield custom.<dimension>_klasse in
 * fixed steps ("200–299"); Search & Discovery ORs several values of one filter. A typed minimum becomes its own class
 * and every class above it, sent as ordinary filter values. Within the first class a box can be smaller than typed.
 */

/**
 * The Search & Discovery parameter name of a dimension's size-class filter.
 *
 * @param dimension The dimension the class belongs to.
 *
 * @returns The filter parameter name.
 */
export function sizeClassParam(dimension: Dimension): string {
  return `filter.v.m.custom.${dimension}_klasse`;
}

/**
 * The size class a measurement falls in.
 *
 * @param millimetres The measurement in millimetres.
 * @param step The class width in millimetres.
 *
 * @returns The zero-based class index.
 */
export function sizeClassOf(millimetres: number, step: number): number {
  return Math.floor(millimetres / step);
}

/**
 * The filter value of a size class, e.g. "200–299".
 *
 * @param sizeClass The zero-based class index.
 * @param step The class width in millimetres.
 *
 * @returns The class label.
 */
export function sizeClassLabel(sizeClass: number, step: number): string {
  return `${sizeClass * step}–${sizeClass * step + step - 1}`;
}

/**
 * The class values a typed minimum stands for, up to the largest class a listed product has. Unlike the source, the
 * typed size's own class is always emitted, so a size above every listed product survives a reload as "no result"
 * instead of silently disappearing from the URL. Only listed classes are walked (bounded by the largest listed
 * product), so a typed size at or above every listed class yields just its own class, however large it is.
 *
 * @param millimetres The typed minimum in millimetres.
 * @param largestListedClass The largest class among the listed products.
 * @param step The class width in millimetres.
 *
 * @returns The class labels to send, lowest first.
 */
export function sizeClassValues(millimetres: number, largestListedClass: number, step: number): Array<string> {
  const first = sizeClassOf(millimetres, step);
  if (first >= largestListedClass) {
    return [sizeClassLabel(first, step)];
  }
  const values: Array<string> = [];
  for (let sizeClass = first; sizeClass <= largestListedClass; sizeClass++) {
    values.push(sizeClassLabel(sizeClass, step));
  }
  return values;
}

/**
 * The size field value from the URL: the lowest class's lower bound (the asked size to the nearest class), or else the
 * keuzehulp handover, which is in centimetres.
 *
 * @param params The page's search parameters.
 * @param dimension The dimension to read.
 *
 * @returns Millimetres, or undefined when neither is present.
 */
export function sizeFromParams(params: URLSearchParams, dimension: Dimension): number | undefined {
  const classes = params
    .getAll(sizeClassParam(dimension))
    .map((value) => Number.parseInt(value, 10))
    .filter(Number.isFinite);
  if (classes.length > 0) {
    return Math.min(...classes);
  }
  const centimetres = Number(params.get(dimension));
  return centimetres > 0 ? Math.round(centimetres * 10) : undefined;
}

/**
 * Whether a product fits a typed minimum: its class is at least the typed size's class.
 *
 * @param productMillimetres The product's inner size.
 * @param typedMillimetres The typed minimum.
 * @param step The class width in millimetres.
 *
 * @returns True when the product's class qualifies.
 */
export function fitsSizeClass(productMillimetres: number, typedMillimetres: number, step: number): boolean {
  return sizeClassOf(productMillimetres, step) >= sizeClassOf(typedMillimetres, step);
}

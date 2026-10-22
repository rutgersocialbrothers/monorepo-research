/**
 * Isometric box drawing, ported from JPPACQ/tupak-design-system 6f9c7e2 prototype/assets/prototype.js (box preview).
 * Pure geometry: the server renders the neutral 30 × 20 × 15 cm default, the browser morphs it. lengte runs on x,
 * hoogte on y, breedte on z; sx = (x - z)·cos30, sy = (x + z)·sin30 - y. Proportions are honest, absolute size is not —
 * the labels carry the values.
 */
export type Dimension = 'lengte' | 'breedte' | 'hoogte';
export type BoxSize = Record<Dimension, number>;
export type Point = readonly [number, number];
type Fraction = readonly [number, number, number];
type Sampler = (u: number, v: number, w: number) => Point;

export const dimensions: ReadonlyArray<Dimension> = ['lengte', 'breedte', 'hoogte'];
export const boxView = { w: 640, h: 480, pad: 78 } as const;
/**
 * Centimetres, as the keuzehulp sends them.
 */
export const boxDefault: BoxSize = { lengte: 30, breedte: 20, hoogte: 15 };
/**
 * The smallest edge is floored at this share of the longest for drawing only, so a 300 × 2 × 2 stick still reads.
 */
const minRatio = 0.04;
/**
 * Down and to the left, where the face shading already puts the light.
 */
export const groundOffset: Point = [-18, 14];
const isoC = Math.cos(Math.PI / 6);
const isoS = Math.sin(Math.PI / 6);

const hexagon: ReadonlyArray<Fraction> = [
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
  [1, 0, 1],
  [0, 0, 1],
  [0, 1, 1],
];

export type BoxPart = 'ground' | 'left' | 'right' | 'top' | 'tape' | 'sticker' | 'outline' | 'clip';
const parts: Record<BoxPart, ReadonlyArray<Fraction>> = {
  ground: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 1],
    [0, 0, 1],
  ],
  left: [
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
  ],
  right: [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
  ],
  top: [
    [0, 1, 0],
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ],
  tape: [
    [0, 1, 0.38],
    [1, 1, 0.38],
    [1, 1, 0.62],
    [0, 1, 0.62],
  ],
  sticker: [
    [0.12, 0.2, 1],
    [0.36, 0.2, 1],
    [0.36, 0.62, 1],
    [0.12, 0.62, 1],
  ],
  outline: hexagon,
  clip: hexagon,
};
/**
 * Faces stay sharp and tile exactly; the silhouette is rounded once, by clipping to a rounded hexagon.
 */
const radii: Record<BoxPart, number> = {
  ground: 10,
  left: 0,
  right: 0,
  top: 0,
  tape: 4,
  sticker: 4,
  outline: 8,
  clip: 8,
};
const edges: Record<Dimension, readonly [Fraction, Fraction]> = {
  lengte: [
    [0, 0, 1],
    [1, 0, 1],
  ],
  breedte: [
    [1, 0, 0],
    [1, 0, 1],
  ],
  hoogte: [
    [1, 0, 0],
    [1, 1, 0],
  ],
};
/**
 * The A from the Tupak lockup, in its own coordinate box from the logo file.
 */
const mark = { x: 74.8, y: 0, w: 34.17, h: 30.43, fill: 0.78 } as const;

function project(x: number, y: number, z: number): Point {
  return [(x - z) * isoC, (x + z) * isoS - y];
}

function sampler(size: BoxSize): Sampler {
  const longest = Math.max(size.lengte, size.breedte, size.hoogte);
  const floor = longest * minRatio;
  const length = Math.max(size.lengte, floor);
  const width = Math.max(size.breedte, floor);
  const height = Math.max(size.hoogte, floor);
  const corners: Array<Point> = [];
  for (const x of [0, length]) {
    for (const y of [0, height]) {
      for (const z of [0, width]) {
        corners.push(project(x, y, z));
      }
    }
  }
  const xs = corners.map((point) => point[0]);
  const ys = corners.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(
    (boxView.w - boxView.pad * 2) / Math.max(maxX - minX, 1e-6),
    (boxView.h - boxView.pad * 2) / Math.max(maxY - minY, 1e-6),
  );
  const offsetX = (boxView.w - (maxX - minX) * scale) / 2 - minX * scale;
  const offsetY = (boxView.h - (maxY - minY) * scale) / 2 - minY * scale;
  return (u, v, w) => {
    const [x, y] = project(u * length, v * height, w * width);
    return [x * scale + offsetX, y * scale + offsetY];
  };
}

function fixed(point: Point) {
  return `${point[0].toFixed(1)},${point[1].toFixed(1)}`;
}

function line(from: Point, to: Point) {
  return `M${fixed(from)}L${fixed(to)}`;
}

/**
 * Rounds every corner; the radius is clamped to 45% of the shorter adjacent edge so thin shapes never fold.
 *
 * @param points - Polygon corners in drawing coordinates.
 * @param radius - Requested corner radius; zero or less draws sharp corners.
 */
function roundedPath(points: ReadonlyArray<Point>, radius: number): string {
  if (!(radius > 0)) {
    return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point)}`).join('')}Z`;
  }
  const count = points.length;
  const segments = points.map((point, index) => {
    const previous = points[(index - 1 + count) % count] ?? point;
    const next = points[(index + 1) % count] ?? point;
    const toPrevious = [previous[0] - point[0], previous[1] - point[1]] as const;
    const toNext = [next[0] - point[0], next[1] - point[1]] as const;
    const previousLength = Math.hypot(...toPrevious) || 1;
    const nextLength = Math.hypot(...toNext) || 1;
    const clamped = Math.min(radius, previousLength * 0.45, nextLength * 0.45);
    const start: Point = [
      point[0] + (toPrevious[0] / previousLength) * clamped,
      point[1] + (toPrevious[1] / previousLength) * clamped,
    ];
    const end: Point = [point[0] + (toNext[0] / nextLength) * clamped, point[1] + (toNext[1] / nextLength) * clamped];
    return `${index === 0 ? 'M' : 'L'}${fixed(start)}Q${fixed(point)} ${fixed(end)}`;
  });
  return `${segments.join('')}Z`;
}

/**
 * Lays the brand mark onto the plane of the left face inside the sticker, so it reads as printed.
 *
 * @param at - Sampler mapping box fractions to drawing coordinates.
 */
function markTransform(at: Sampler): string {
  const sticker = parts.sticker;
  const [u0, v0, u1, v1] = [sticker[0]?.[0] ?? 0, sticker[0]?.[1] ?? 0, sticker[1]?.[0] ?? 0, sticker[2]?.[1] ?? 0];
  const origin = at(0, 0, 1);
  const alongU = [at(1, 0, 1)[0] - origin[0], at(1, 0, 1)[1] - origin[1]] as const;
  const alongV = [at(0, 1, 1)[0] - origin[0], at(0, 1, 1)[1] - origin[1]] as const;
  const lengthU = Math.hypot(...alongU) || 1;
  const lengthV = Math.hypot(...alongV) || 1;
  const size = Math.min(((u1 - u0) * lengthU) / mark.w, ((v1 - v0) * lengthV) / mark.h) * mark.fill;
  const du = (size * mark.w) / lengthU;
  const dv = (size * mark.h) / lengthV;
  const cu = u0 + (u1 - u0 - du) / 2;
  const cv = v0 + (v1 - v0 - dv) / 2;
  const a = (du / mark.w) * alongU[0];
  const b = (du / mark.w) * alongU[1];
  const c = -(dv / mark.h) * alongV[0];
  const d = -(dv / mark.h) * alongV[1];
  const anchor = at(cu, cv + dv, 1);
  const e = anchor[0] - a * mark.x - c * mark.y;
  const f = anchor[1] - b * mark.x - d * mark.y;
  return `matrix(${[a, b, c, d, e, f].map((value) => value.toFixed(4)).join(' ')})`;
}

/**
 * A dimension rule parallel to its edge, offset away from the drawing's centre, with a tick at each end.
 *
 * @param start - Edge start point.
 * @param end - Edge end point.
 * @param centre - Drawing centre the rule moves away from.
 * @param offset - Distance from the edge.
 * @param tick - Half-length of each end tick.
 */
function rule(start: Point, end: Point, centre: Point, offset = 34, tick = 7) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) || 1;
  let normal: Point = [-dy / length, dx / length];
  const middle: Point = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  if (
    Math.hypot(middle[0] + normal[0] - centre[0], middle[1] + normal[1] - centre[1]) <
    Math.hypot(middle[0] - centre[0], middle[1] - centre[1])
  ) {
    normal = [-normal[0], -normal[1]];
  }
  /**
   * @param point The point to move along the dimension normal.
   * @param distance The signed offset from the drawing edge.
   */
  function shift(point: Point, distance: number): Point {
    return [point[0] + normal[0] * distance, point[1] + normal[1] * distance];
  }
  return {
    d: [
      line(shift(start, offset), shift(end, offset)),
      line(shift(start, offset - tick), shift(start, offset + tick)),
      line(shift(end, offset - tick), shift(end, offset + tick)),
    ].join(' '),
    label: shift(middle, offset),
  };
}

export interface BoxDrawing {
  paths: Record<BoxPart, string>;
  mark: string;
  rules: Record<Dimension, { d: string; x: number; y: number }>;
}

/**
 * Every path, the mark transform and the label positions (as percentages of the frame) for one size.
 *
 * @param size - Box size in centimetres.
 * @param shadow - Offset of the cast shadow.
 */
export function drawBox(size: BoxSize, shadow: Point = groundOffset): BoxDrawing {
  const at = sampler(size);
  const paths = {} as Record<BoxPart, string>;
  for (const part of Object.keys(parts) as Array<BoxPart>) {
    const points = parts[part].map(([u, v, w]) => at(u, v, w));
    const shifted =
      part === 'ground' ? points.map((point): Point => [point[0] + shadow[0], point[1] + shadow[1]]) : points;
    paths[part] = roundedPath(shifted, radii[part]);
  }
  const hull = hexagon.map(([u, v, w]) => at(u, v, w));
  const centre: Point = [
    hull.reduce((sum, point) => sum + point[0], 0) / hull.length,
    hull.reduce((sum, point) => sum + point[1], 0) / hull.length,
  ];
  const rules = {} as BoxDrawing['rules'];
  for (const name of dimensions) {
    const [from, to] = edges[name];
    const { d, label } = rule(at(...from), at(...to), centre);
    rules[name] = { d, x: (label[0] / boxView.w) * 100, y: (label[1] / boxView.h) * 100 };
  }
  return { paths, mark: markTransform(at), rules };
}

/**
 * Dutch decimal comma, no trailing ,0 on whole centimetres.
 *
 * @param value - Centimetres.
 */
export function formatCentimetres(value: number): string {
  return value.toLocaleString('nl-NL', { maximumFractionDigits: 1 });
}

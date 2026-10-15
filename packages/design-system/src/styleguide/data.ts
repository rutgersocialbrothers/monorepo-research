import { tokenReference } from '../tokens/reference';
export interface ReferenceToken {
  name: string;
  group: string;
  description: string;
}
export const tokens: ReadonlyArray<ReferenceToken> = tokenReference;
export function group(name: string): Array<ReferenceToken> {
  return tokens.filter((token) => token.group === name);
}
export const ramps = ['neutral', 'brand', 'success', 'warning', 'destructive', 'info'] as const;
export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export function semanticGroup(name: string): string {
  if (name.startsWith('--sidebar')) {
    return 'Sidebar';
  }
  if (name.startsWith('--chart')) {
    return 'Charts';
  }
  if (/^--(border|input|ring)/u.test(name)) {
    return 'Borders & focus';
  }
  if (/^--(success|warning|destructive|info)/u.test(name)) {
    return 'Feedback';
  }
  if (/^--(primary|secondary|accent)/u.test(name)) {
    return 'Actions';
  }
  if (/^--(foreground|muted-foreground)/u.test(name)) {
    return 'Text';
  }
  return 'Surfaces';
}
export function layer(token: ReferenceToken): string {
  return token.group === 'semantic'
    ? 'semantic'
    : token.group === 'color'
      ? 'ramp'
      : token.group === 'component'
        ? 'component'
        : 'foundation';
}

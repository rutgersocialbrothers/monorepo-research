export const themes = [{ id: 'tupak', label: 'Tupak' }] as const;

export type Theme = (typeof themes)[number]['id'];

export const colorModes = ['light', 'dark'] as const;
export type ColorMode = (typeof colorModes)[number];

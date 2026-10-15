export { themes } from './themes';

export const colorTokens = [
  { name: 'Background', variable: '--background', usage: 'Page and canvas background' },
  { name: 'Foreground', variable: '--foreground', usage: 'Default text' },
  { name: 'Primary', variable: '--primary', usage: 'Primary actions and emphasis' },
  { name: 'Primary foreground', variable: '--primary-foreground', usage: 'Content on primary' },
  { name: 'Secondary', variable: '--secondary', usage: 'Secondary surfaces' },
  { name: 'Muted', variable: '--muted', usage: 'Subtle backgrounds' },
  { name: 'Accent', variable: '--accent', usage: 'Hover and supporting emphasis' },
  { name: 'Border', variable: '--border', usage: 'Dividers and control borders' },
] as const;

export const spacingSteps = [
  { step: 1, label: '1', usage: 'Tight icon detail' },
  { step: 2, label: '2', usage: 'Icon to label' },
  { step: 3, label: '3', usage: 'Compact groups' },
  { step: 4, label: '4', usage: 'Default control gap' },
  { step: 6, label: '6', usage: 'Card padding' },
  { step: 8, label: '8', usage: 'Block spacing' },
  { step: 12, label: '12', usage: 'Section spacing' },
  { step: 16, label: '16', usage: 'Large page regions' },
] as const;

export const radiusTokens = [
  { name: 'Small', value: 'calc(var(--ui-radius) / 2)', token: '--radius-sm' },
  { name: 'Medium', value: 'var(--ui-radius)', token: '--radius-md' },
  { name: 'Large', value: 'calc(var(--ui-radius) * 1.5)', token: '--radius-lg' },
] as const;

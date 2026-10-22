---
colors:
  neutral-50: '#fafafa'
  neutral-100: '#f4f4f5'
  neutral-200: '#e4e4e7'
  neutral-300: '#d4d4d8'
  neutral-400: '#9f9fa9'
  neutral-500: '#71717b'
  neutral-600: '#52525c'
  neutral-700: '#3f3f46'
  neutral-800: '#27272a'
  neutral-900: '#18181b'
  neutral-950: '#09090b'
  brand-50: '#eff7ff'
  brand-100: '#dbebfe'
  brand-200: '#bfddfe'
  brand-300: '#93c8fd'
  brand-400: '#60aafa'
  brand-500: '#3b88f6'
  brand-600: '#2569eb'
  brand-700: '#1d54d8'
  brand-800: '#1e45af'
  brand-900: '#1e3d8a'
  brand-950: '#101b3a'
  action-50: '#fef2f2'
  action-100: '#ffe2e1'
  action-200: '#ffcac9'
  action-300: '#fea5a3'
  action-400: '#fb716e'
  action-500: '#f34440'
  action-600: '#e12621'
  action-700: '#bd1c18'
  action-800: '#9c1b18'
  action-900: '#811d1b'
  action-950: '#470a08'
  warm-50: '#fbf8f1'
  warm-100: '#f5eedf'
  warm-200: '#e7d7b8'
  warm-300: '#dbc296'
  warm-400: '#cca36b'
  warm-500: '#c18b4e'
  warm-600: '#b37743'
  warm-700: '#955f39'
  warm-800: '#784d34'
  warm-900: '#62402c'
  warm-950: '#342016'
  natural-50: '#f6f9f4'
  natural-100: '#e8f3e4'
  natural-200: '#d2e7cb'
  natural-300: '#afd2a3'
  natural-400: '#83b672'
  natural-500: '#60994e'
  natural-600: '#4c7d3c'
  natural-700: '#3e6332'
  natural-800: '#34502b'
  natural-900: '#2b4225'
  natural-950: '#142310'
  success-50: '#ecfdf5'
  success-100: '#d0fae5'
  success-200: '#a4f4cf'
  success-300: '#5ee9b5'
  success-400: '#00d492'
  success-500: '#00bc7d'
  success-600: '#009966'
  success-700: '#007a55'
  success-800: '#006045'
  success-900: '#004f3b'
  success-950: '#002c22'
  warning-50: '#fffbeb'
  warning-100: '#fef3c6'
  warning-200: '#fee685'
  warning-300: '#ffd230'
  warning-400: '#ffb900'
  warning-500: '#fe9a00'
  warning-600: '#e17100'
  warning-700: '#bb4d00'
  warning-800: '#973c00'
  warning-900: '#7b3306'
  warning-950: '#461901'
  white: '#ffffff'
  black: '#000000'
  dark-background: '#121212'
  dark-heading: '#ffd068'
  dark-disabled: '#535353'
  dark-sunken: '#352600'
  dark-surface: '#181818'
  dark-raised: '#272727'
  dark-primary: '#ffc20e'
  dark-secondary-foreground: '#ffe3a7'
  dark-secondary-hover: '#604700'
  dark-secondary-active: '#745600'
  dark-nav-active: '#e1aa00'
  dark-muted-foreground: '#a0a0a0'
  dark-destructive: '#fb7065'
  dark-destructive-foreground: '#500a09'
  dark-destructive-subtle-foreground: '#ffcbc4'
  dark-success: '#7cb093'
  dark-success-foreground: '#152f22'
  dark-success-subtle-foreground: '#cbdfd3'
  dark-info: '#58b0c7'
  dark-info-foreground: '#002f39'
  dark-info-subtle-foreground: '#c1dfe8'
  dark-border-strong: '#404040'
  dark-chart-4: '#97cbda'
  kraft-100: '#e2d0b1'
  kraft-200: '#d9bd94'
  kraft-400: '#b3916a'
  kraft-600: '#947357'
typography:
  body:
    fontFamily: "'Instrument Sans Variable', 'Instrument Sans', 'Helvetica Neue', Arial, sans-serif"
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  scale:
    xs: '0.75rem'
    sm: '0.875rem'
    base: '1rem'
    lg: '1.125rem'
    xl: '1.25rem'
    2xl: '1.5rem'
    3xl: '1.75rem'
    4xl: '2.25rem'
    5xl: '3rem'
    6xl: '3.75rem'
rounded:
  none: '0px'
  xs: '2px'
  sm: '4px'
  md: '8px'
  lg: '12px'
  xl: '16px'
  2xl: '16px'
  full: '9999px'
---

# Non-authoritative candidate detector snapshot

This file is an **evaluation input, not a design specification or approval**. [src/styles/tokens.css](src/styles/tokens.css) remains the sole canonical CSS value authority. The blue/red/kraft/forest foundations and Instrument Sans originate at `JPPACQ/tupak-design-system` `afd9c66`; the full `6f9c7e2` reference update adds the source kraft drawing literals. Candidate and trial values are not production approvals. Retained dark values do not approve dark-mode branding or product support. No value here authorizes merchant settings or a Liquid implementation.

## Scope and manual refresh

The frontmatter snapshots the literal palette declarations, additional literal dark-mode color branches, sans/mono font stacks, `--ds-text-*-size` and `--ds-radius-*` declarations in the current source. Destructive/info palette aliases and heading/display font aliases reuse existing values; their aliases need no invented entries. Colors used inside shadow recipes reuse the listed navy/black RGB colors; shadow opacity and geometry are not a fifth baseline category. `color-mix()` outputs are not fabricated as new palette entries.

When relevant CSS tokens change, manually compare these four categories with the complete affected token declarations and update this snapshot in the same review. Retain direct color strings under `colors`, font stacks under `typography.<role>.fontFamily`, direct sizes under `typography.scale`, and direct radius strings under `rounded`; nested palette objects are not equivalent detector input. There is no generator, token export pipeline or `.impeccable/design.json` sidecar. Descriptive labels here do not enforce CSS semantic roles.

## Interpretation limits

The pinned Impeccable 4.5.2 / engine 0.1.14 detector uses approximate literal membership, not CSS execution:

- Color matching permits an RGB-channel difference of up to 6; very low-alpha colors and certain CSS keywords are accepted. Membership does not establish contrast or correct opacity.
- Radius and font-size comparisons allow 0.5px difference, converting supported `rem` lengths with a fixed 16px base. With a `full` radius listed, radii of at least 99px can be treated as pills. These are detector tolerances, not newly approved design tolerances.
- Font parsing uses family names from stacks, with generic families handled separately. It does not prove font delivery, chosen fallback, weight, line height or rendering.
- Source `var()` values can pass without validating token existence or resolving their values. Unsupported/unjudgeable expressions can also escape findings. A clean report is not proof of token use, class validity, semantic correctness or completeness.
- This **combined light/dark allowlist** permits literals from either mode anywhere. It cannot enforce mode, role, inheritance, state behavior, `light-dark()` branches or merchant overrides. Inspect actual states and modes separately.
- Source scans use this package-local context when invoked through the package commands. Ordinary HTTP(S) URL scans do not load this local baseline; rendered-browser findings are separate evidence.

See [optional evaluation commands](README.md#optional-impeccable-evaluation). Findings are report-only review inputs; existing checks and separate designer/developer decisions remain in force.

Detector schema and tolerance reference: [official `design_system.rs` at `abf5779cabc20147fd9c013fa4705088c200bf8a`](https://github.com/pbakaus/impeccable/blob/abf5779cabc20147fd9c013fa4705088c200bf8a/crates/detect/src/design_system.rs).

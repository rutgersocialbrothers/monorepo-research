# @tupak/design-system

Private source package for the Tupak designer workbench: authored CSS-first tokens, framework-independent component contracts and canonical Astro references. Astro + Tailwind v4 render semantic HTML and native behavior. There is one theme (`tupak`), no tenant chooser and no shadcn tooling or components.

The current candidate manually adapts the blue/red/kraft/forest foundations and Instrument Sans from `JPPACQ/tupak-design-system` `main` at `afd9c66`. These remain **design trials, not production-approved Tupak branding**. The light-mode port retains independent light/dark mechanics and the prior effective dark colors. Whether the product needs dark mode is **TBD**; retaining a toggle does not approve its design or product support.

## Start, edit, review and hand off

Run from the repository root with the pinned mise tools active:

```sh
mise install
pnpm install --frozen-lockfile
pnpm dev:design-system
```

Open the URL Astro prints, normally `http://localhost:4321`, for the workbench; `/preview` is the composed candidate homepage. This native Astro entrypoint needs no CMS, database, credentials, Shopify account or upload. Canonical defaults stay generic with optional media. The composed preview uses locally copied reference assets with provenance in `src/sections/reference-assets.ts` and explicitly labelled prototype content, not a live shop or verified commercial claims. Do not use root `pnpm dev` for design-only work: it also starts upload-capable Liquid preview.

1. **Edit foundations:** `src/styles/tokens.css` owns palette, semantic/component tokens, font stacks, spacing, radii and Tailwind mappings. Fontsource asset delivery belongs to private `src/styles/global.css`, not the public token export. `src/tokens/reference.ts` owns token descriptions/categories only, never duplicate values. `src/tokens/themes.ts` owns the single identity and mode types.
2. **Edit canonical examples:** `src/components/<family>/` owns contracts, markup, states and behavior; `src/sections/<slug>/` owns generic editorial compositions with optional media. `src/styleguide/` and `src/styles/styleguide.css` own documentation and workbench presentation.
3. **Review:** inspect both light and dark, narrow/wide layouts, long/empty content, keyboard/focus/disabled behavior, native control popups and reduced motion. Token click copies `var(--name)`; Shift+click copies the resolved value. Print reveals all documentation sections. Only mode is persisted, under `tupak-design-system-mode`; no theme selection is stored.
4. **Agree the contract:** use the [component contract template](../../docs/templates/component-contract.md) for props/defaults, content, states, semantics, accessibility and renderer obligations. Visual or interaction changes need human decisions; AI proposals are not approval.
5. **Hand off:** use the [handoff template](../../docs/templates/design-handoff.md) with exact source, URLs, viewports/states, observed evidence, failures and unverified gaps. Keep designer approval separate from developer acceptance.

See the [designer workflow](../../docs/designer-workflow.md) for the complete cross-renderer process. Changes hot-reload; stop writers with `Ctrl+C` before checks/builds. Installation/catalog/toolchain changes require install and restart. Never edit ignored `dist/`, `.astro/` or test reports.

## Actual commands and gates

From the repository root:

| Command                                           | Scope                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm dev:design-system`                          | Native upload-free Astro workbench                                         |
| `pnpm build:design-system`                        | Static demo in this package's ignored `dist/`                              |
| `pnpm preview:design-system`                      | Serve the built static demo                                                |
| `pnpm check:design-system`                        | Five ordered package-only check leaves                                     |
| `pnpm test:design-system`                         | Playwright browser suite                                                   |
| `pnpm --filter @tupak/design-system types`        | Astro diagnostics and compile-time contract checks                         |
| `pnpm --filter @tupak/design-system lint:classes` | Native Better Tailwind class validation                                    |
| `pnpm check`                                      | Root script types/Vitest, Liquid build/check and all five workbench leaves |

Install the browser prerequisite before requested checks:

```sh
pnpm --filter @tupak/design-system exec playwright install chromium
# Linux CI additionally uses --with-deps.
pnpm check:design-system
```

The package gate attempts **format → Astro types → source/native-class lint → static demo build → browser tests** as separately registered uncached leaves with explicit ordering, `--continue=always --concurrency=1 --env-mode=loose` and aggregate failure reporting. Root CI (`.github/workflows/ci.yml`) installs Chromium/runtime dependencies before checks without delivery credentials. Do not skip leaves, suppress findings or report historical results as current verification. Report exact commands with passed / failed / blocked / not run outcomes only when exercised.

Astro checking uses package-scoped TypeScript 6, composed from `@2digits/tsconfig` and `astro/tsconfigs/strict`; root tooling uses TypeScript 7. Authored `src/env.d.ts` supplies Astro client types. Browser tests own an Astro server on `127.0.0.1:4322` with `--ignore-lock`, separate from the designer's server.

Inside this package, `pnpm dev` selects `dev:server` through Turbo's TUI; `pnpm dev:server` starts native Astro. For streamed package-check logs use `pnpm --filter @tupak/design-system check --ui=stream`. TUI dev requires a real terminal; flags cannot create one. Root `dev:design-system` is the simpler designer/automation entrypoint.

### Native Tailwind validation and no-shadcn policy

Oxlint owns general source lint, including Astro scripts. Package-local ESLint uses `astro-eslint-parser`, TypeScript frontmatter parsing and `jiti` for native class diagnostics. Better Tailwind resolves the runtime import graph rooted at `src/styles/global.css`, including authored tokens. Exactly two rules run at error severity:

- `better-tailwindcss/no-unknown-classes`
- `better-tailwindcss/no-concatenated-classes`

Use complete class strings and existing token references. Define genuine shared component classes in `@layer components` and utilities with `@utility`; do not add empty selectors, lint-only stylesheets, class-ignore lists or exemptions. Native extraction is not comprehensive JavaScript dataflow analysis and does not prove every custom property exists. Component-class discovery covers the configured components layer, not all arbitrary CSS. Evaluate real findings without changing provisional design values merely to hide them. Editor validation uses the same ESLint configuration; autocomplete/class sorting are not validation.

There is no shadcn dependency, plugin/rule registration or `components.json`. Do not reintroduce any of them.

## Source ownership and exports

| Source                     | Responsibility                                                     |
| -------------------------- | ------------------------------------------------------------------ |
| `src/styles/tokens.css`    | Shared foundation, semantic/component values and Tailwind mappings |
| `src/tokens/themes.ts`     | `themes`, `Theme`, `colorModes`, `ColorMode`                       |
| `src/tokens/reference.ts`  | Documentation metadata, not values                                 |
| `src/contracts/schema.ts`  | Framework-free contract interface and inferred props               |
| `src/components/<family>/` | Family contract, canonical renderer, styles, behavior and examples |
| `src/sections/`            | Page compositions; no CMS fetching or invented business facts      |
| `src/styleguide/`          | Foundation documentation and curated compositions                  |
| `src/registry.ts`          | Family discovery and specimen generation                           |

The four source-export shapes remain:

| Export                                   | Purpose                                                        |
| ---------------------------------------- | -------------------------------------------------------------- |
| `@tupak/design-system/tokens.css`        | Reusable Tailwind 4 CSS-first configuration and runtime tokens |
| `@tupak/design-system/themes`            | Single Tupak identity and independent light/dark modes         |
| `@tupak/design-system/contracts`         | Shared interface and inferred prop types                       |
| `@tupak/design-system/<family>-contract` | Family capabilities/defaults; e.g. `button-contract`           |

These are authored source, not a compiled library. `tokens.css` **is the reusable Tailwind 4 configuration**: asset-neutral runtime custom properties, mode scopes and `@theme inline` utility mappings. It does not include the Tailwind engine, Preflight, fonts/assets, source registration or private workbench component classes. Canonical Astro references consume this same public export through `src/styles/global.css`; their renderers, recipes and behavior are not exported as a runtime component library. No library artifact, token JSON, renderer generator or packed-consumer workflow is provided. Liquid does **not currently** consume this CSS export.

### Consume the public Tailwind configuration

Use a compatible Tailwind 4 integration (for example, native `@tailwindcss/vite` or the native CLI). The CSS-only export needs no font asset bundler: consumers own font delivery and may use Fontsource, platform-managed fonts or their own assets. The Astro workbench privately bundles Instrument Sans through Fontsource. In the consuming application's stylesheet:

```css
@import 'tailwindcss' source(none);
@import '@tupak/design-system/tokens.css';

/* Paths are relative to this stylesheet; register only your own templates. */
@source "../src";
```

The consumer owns the Tailwind engine/version, Preflight decision and template discovery. `source(none)` disables automatic scanning; the public token export does not register workbench templates. A consumer without Preflight must explicitly establish layer order before split imports:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source(none);
@import '@tupak/design-system/tokens.css';

@source "../src";
```

This is an unprefixed, global foundation: root defaults and generic utility namespaces such as colors, spacing, radii and fonts can overlap another Tailwind theme. Compose theme imports deliberately; later declarations can override matching defaults. Do not assume importing it creates an isolated component scope or clears unrelated Tailwind defaults. Runtime overrides and explicit mode scopes remain CSS inheritance concerns, not separate generated configurations.

The existing Playwright check lane includes isolated consumer compilation with native Tailwind/Vite and the public export, plus browser assertions for token-backed utilities, nested overrides/modes, consumer-owned sources and Preflight, and private-class exclusion. Font delivery remains consumer-owned; private Astro font loading is separate from the asset-neutral public CSS contract. Report current outcomes only after running the checks.

## Component families

The 22 families are Alert, Badge, Button, Card, Checkbox, Dialog, Dropdown Menu, Empty State, Form Section, Icon, Input, Label, Link, Page Header, Product Card, Radio Group, Select, Separator, Switch, Tabs, Textarea and Tooltip. Each lower-case kebab-case folder contains `<family>.contract.ts` and `<family>.astro`, with optional `.example.astro`, styles, behavior and subparts beside them. Contracts export `as const satisfies ComponentContract`; renderer scalar/enum props derive from `ContractProps<typeof contract>`, while native attributes and structured data remain renderer-owned. Button and Link share red primary, pale-blue secondary and navy `nav` treatments. Product Card implements the selected B-style candidate without fake commerce actions. See the [external Tupak integration record](../../docs/designer-workflow.md#external-tupak-prototype-local-integration-preparation) for source selection, implementation status and unresolved design decisions.

`src/registry.ts` discovers siblings. Contract names must match their family; missing renderers and duplicate identities fail rather than disappear. New correctly named contracts automatically receive the `<family>-contract` export and Components/Contracts specimens; no barrel or page registration is needed. Enum/boolean states create matrices; other families receive default specimens. `preview` supplies `content`, `label`, `props`, `exclude` and `overlay` for specimen composition. Family anchors/imports derive from folder names; captions are slugified and are not a uniqueness guarantee.

Use Tailwind classes in Astro markup/class maps and shared token/global layers, not component-local `<style>` blocks. Keep private geometry recipes meaningful and preserve approved values. Sections have typed props and optional media with supported text-only layout; supplied links must be real, not `href="#"`. Their curated documentation is `src/styleguide/Sections.astro`, not the primitive registry.

## Single theme and independent modes

The document identity is always `data-theme="tupak"`. `.light`/`.dark` set inherited `color-scheme`; semantic values resolve via CSS `light-dark()` (Chrome 123+, Firefox 120+ or Safari 17.5+). Explicit theme scopes reset shared tokens, while mode-only scopes inherit token identity:

```html
<section data-theme="tupak" class="dark">
  <section data-theme="tupak" class="light">
    <!-- Explicit light controls inside an explicit dark scope. -->
  </section>
  <section data-theme="tupak">
    <!-- Inherits the surrounding dark mode. -->
  </section>
</section>
```

The header restores only a valid stored mode before paint, defaults to light and refreshes resolved token displays on mode changes. No legacy theme aliases, theme-storage migration or alternate presets are supported. These mechanics are retained independently of the still-pending Tupak dark-mode decision.

## Manual Liquid adaptation, never automatic application

The workbench is the designer entrypoint, not merchant styling. Approved intent must be implemented manually in `apps/liquid/styles/tokens.css` and authored `apps/liquid` components using Shopify settings, translations, native assets and editor attributes. No workbench dependency, CSS import, generation or build/watch prerequisite is introduced in Liquid. There is no React/UI package or Storybook adaptation in this workspace.

Review canonical Astro behavior separately from actual authorized Shopify views/editor states. CSS compilation and Theme Check cannot prove visual correctness or platform parity. Use [Liquid setup](../../apps/liquid/README.md) only after exact-store approval; local design commands grant no uploads, page/template assignments, deployment, Git or account changes. Preserve merchant state, licensing and [delivery protections](../../docs/shopify-deployment.md).

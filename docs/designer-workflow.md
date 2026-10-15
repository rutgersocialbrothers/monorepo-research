# Tupak designer workflow: workbench, Liquid review and human handoff

The single-theme Tupak Astro workbench is the entrypoint for integrating the approved Tupak design system. Its current yellow palette and Nunito/Lobster fonts are provisional starter values, not client branding. Independent light/dark mechanics and existing values remain intact; dark-mode product support and visual approval are **TBD**. Designers own visual/interaction intent; developers own technical acceptance. AI proposals are not approved design.

## Start safely, without a Shopify account

From the repository root, after activating the pinned mise tools:

```sh
mise install
pnpm install --frozen-lockfile
pnpm dev:design-system
```

This serves the full Tupak Astro workbench, normally at `http://localhost:4321`, without credentials, CMS/database or uploads. Explore tokens, typography, the single Tupak theme in light/dark modes, canonical components/contracts, native behaviors and generic editorial sections. There is no tenant chooser. Fonts are bundled locally; default compositions use optional media and contain no remote brand assets or business data. For local Liquid CSS input watching use `pnpm dev:liquid:local`, which is **not a browser server** and performs no uploads. Stop writers with `Ctrl+C` before another build/check.

**Do not substitute `pnpm dev` or `pnpm dev:liquid` without exact-store authorization:** these create/replace a Shopify development theme. Follow [Liquid setup](../apps/liquid/README.md#first-preview) for an authorized rendered preview, normally at `http://127.0.0.1:9292`. Configuration is not permission, and this workflow grants no store access, uploads, page creation, assignments or deployment.

## Find what actually exists

Inspect the app's native snippets, blocks, sections and their actual consumers. The homepage uses native primitives. `sections/design-system-demo.liquid` and `templates/page.design-system.json` remain real Liquid/editor surfaces: button samples, utility tokens, optional Shopify image and nested editable blocks. Local CSS compilation does not create a Shopify page or assign a template. Record an existing authorized page's actual URL; do not assume `/pages/design-system` exists.

The button currently supports primary/secondary variants and small/medium/large sizes, with primary/medium defaults. Enabled demo buttons are explicitly no-action previews. A demo is not proof of checkout or another business flow.

| Location | Ownership and safe scope |
| --- | --- |
| `packages/design-system` | `@tupak/design-system`: Tupak designer workbench, provisional tokens, framework-free contracts, canonical Astro components and generic compositions; not merchant CSS |
| `apps/liquid/styles/tokens.css` | Current authored semantic tokens and merchant mappings; preserve existing visual behavior unless an agreed brief changes it |
| `apps/liquid/styles/tailwind.css` | App-owned Tailwind compilation inputs/source discovery; no Preflight |
| `apps/liquid/snippets/design-button-classes.liquid` | Authored complete button class selection, not generator output |
| `apps/liquid/snippets`, `blocks`, `sections`, `locales` | Native Liquid UI; preserve locale keys, filenames, setting IDs and editor attributes |
| `apps/liquid` | Native Shopify theme root, merchant configuration, templates and integration |
| `apps/liquid/assets/tailwind.css` | Generated CSS; Git-ignored, rebuilt for preview/upload, never edited as source |

The `liquid_components` locale namespace and Shopify schema contracts retain their existing names. Component CSS and small plain-JavaScript enhancements use Shopify's native `{% stylesheet %}` and `{% javascript %}` delivery. Native CLI filters supported theme folders, excluding app metadata and authored styles from uploads.

## Integrate approved tokens and review canonical behavior

1. Edit `packages/design-system/src/styles/tokens.css` for approved foundation, semantic and component values. Keep the existing baseline until a designer-approved brief supplies replacements; do not invent new colors/fonts or business facts.
2. Update `src/tokens/reference.ts` descriptions/categories when meanings change. Values remain in CSS, not metadata. The single identity and independent mode types live in `src/tokens/themes.ts`.
3. Edit relevant `src/components/<family>/` contracts/examples/behavior and `src/sections/<slug>/` compositions. Reuse existing primitives and supply real optional media rather than fabricated assets or URLs.
4. Review both modes independently at narrow/wide widths, with long/empty content and keyboard/focus/native-popup/disabled/reduced-motion states. Retained dark mechanics do not settle whether Tupak should ship dark mode.
5. Record approved intent, observed evidence and unresolved decisions in the handoff before developer-led Liquid adaptation. Token click copies a CSS reference; Shift+click copies its current value. Print reveals all documentation sections. Only mode is remembered under `tupak-design-system-mode`; no theme selection persists.

The approach separates CSS-first tokens, framework-free behavioral contracts, an independent canonical workbench and manually maintained renderer adapters. A contract describes purpose, props/defaults, content, states, semantics and accessibility without assuming a renderer. Liquid adapters must implement that contract using Shopify's constraints; Astro markup does not generate them.

Merchant CSS and native Liquid remain app-owned and authored. Do not import workbench CSS into the theme, automatically apply token changes or assume canonical components implement Liquid adapters. Carry approved intent into `apps/liquid/styles/tokens.css` and native Liquid source through an explicit manual handoff. Liquid build/watch/delivery never depend on building the workbench. Reference screenshots cannot establish Shopify/editor parity.

Use root `dev:design-system`, `build:design-system`, `check:design-system`, `test:design-system` and `preview:design-system` conveniences. Install Chromium before requested checks with `pnpm --filter @tupak/design-system exec playwright install chromium`. The package gate orders format → Astro types → source/native-class lint → static build → browser tests. Retain only `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes` in the native class lane; record actual outcomes without suppression or assumed green results. No shadcn tooling/components/configuration may be added.

The [package guide](../packages/design-system/README.md) describes the actual workspace commands and source exports. No React/UI workspace, Storybook, renderer generator or automatic application pipeline is installed.

Use the [component contract](templates/component-contract.md) and [handoff](templates/design-handoff.md) templates in the agreed project discussion or existing documentation location. Reference canonical `packages/design-system/src/components/<family>/<family>.contract.ts` and actual Liquid source separately; the registry discovers canonical families, not generated Liquid adapters. Keep documentation out of deployable theme directories.

## Use a bounded AI loop

1. **Brief:** describe the user task, affected view, allowed files, unchanged behavior and human decisions needed.
2. **Inventory:** identify existing Liquid primitives, consumers and actual review URLs; reuse them before proposing additions.
3. **Contract:** if composition cannot meet the need, describe the gap using the template. Obtain human approval before adding tokens, variants, dependencies or components.
4. **Review both scopes:** inspect canonical Astro states and authorized Liquid rendering at relevant widths, with content extremes, focus, activation and disabled behavior. Record renderer differences explicitly; review merchant-editor integration separately.
5. **Handoff:** record the exact source, URLs, environment, evidence, simulated behavior and unverified gaps. Separate designer approval from developer acceptance.

```text
Help me work on [user task/view] with the existing Liquid implementation.
First identify relevant native Liquid primitives, consumers and source files.
Allowed changes: [files and specific intent]. Human decisions needed: [questions].
Do not invent visual language, tokens, variants, components or design rules.
If composition cannot fit, propose a contract and wait for human approval.
Edit authored source only; never generated CSS or captured evidence.
Use local CSS input watching unless exact-store preview authorization is supplied.
No Git/account changes, store access, uploads, deployments or new dependencies are authorized.
Review real rendered views only within the authorized scope; otherwise mark them unverified.
Hand off exact URLs, widths, states, evidence and remaining gaps;
keep designer visual approval separate from developer technical acceptance.
```

## Record review evidence

Capture actual reference and Liquid preview URLs (including necessary non-secret preview context), viewport dimensions, content/state, source version and observed outcomes. Label the renderer/environment for each item. For the Liquid demo, record the actual assigned page and template; for editor evidence, record the relevant section/block and editor context. Do not publish credentials, storefront passwords or private preview access data.

Record commands/checks only if actually run. There is no current `design:review` command or generated case-ID report. Manual screenshots, browser observations and any explicitly authorized automation belong in the handoff with their evidence paths, failures and limitations.

CSS compilation/Theme Check cannot certify visual correctness, accessibility, checkout, persistence, real-device behavior or editor parity. A screenshot is not proof of a working user flow. Label no-action demos as simulated flow behavior; distinguish observed native control behavior from unverified integration. Do not enter customer/personal data; review screenshot/report content before sharing and obtain authorization before disclosure.

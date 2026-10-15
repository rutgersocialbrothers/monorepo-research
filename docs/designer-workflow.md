# Tupak designer workflow: workbench, Liquid review and human handoff

The single-theme Tupak Astro workbench is the entrypoint for reviewing the Tupak design system. Its current candidate manually adapts the external prototype's blue/red/kraft/forest foundations and Instrument Sans, without approving its design trials as production branding. Independent light/dark mechanics retain prior effective dark colors; dark-mode product support remains **TBD**. Designers own visual/interaction intent; developers own technical acceptance. Implementation and AI proposals are not design approval.

## Start safely, without a Shopify account

From the repository root, after activating the pinned mise tools:

```sh
mise install
pnpm install --frozen-lockfile
pnpm dev:design-system
```

This serves the full Tupak Astro workbench, normally at `http://localhost:4321`, without credentials, CMS/database or uploads. Explore tokens, typography, the single Tupak theme in light/dark modes, 22 canonical component families/contracts and reusable sections. `/preview` is the composed candidate homepage based on current external `main`, with local reference artwork and explicitly labelled prototype content, not an active shop. Fonts are privately bundled locally; the public CSS export is asset-neutral. There is no tenant chooser. For local Liquid CSS input watching use `pnpm dev:liquid:local`, which is **not a browser server** and performs no uploads. Stop writers with `Ctrl+C` before another build/check.

**Do not substitute `pnpm dev` or `pnpm dev:liquid` without exact-store authorization:** these create/replace a Shopify development theme. Follow [Liquid setup](../apps/liquid/README.md#first-preview) for an authorized rendered preview, normally at `http://127.0.0.1:9292`. Configuration is not permission, and this workflow grants no store access, uploads, page creation, assignments or deployment.

## Find what actually exists

Inspect the app's native snippets, blocks, sections and their actual consumers. The homepage uses native primitives. `sections/design-system-demo.liquid` and `templates/page.design-system.json` remain real Liquid/editor surfaces: button samples, utility tokens, optional Shopify image and nested editable blocks. Local CSS compilation does not create a Shopify page or assign a template. Record an existing authorized page's actual URL; do not assume `/pages/design-system` exists.

The button currently supports primary/secondary variants and small/medium/large sizes, with primary/medium defaults. Enabled demo buttons are explicitly no-action previews. A demo is not proof of checkout or another business flow.

| Location | Ownership and safe scope |
| --- | --- |
| `packages/design-system` | `@tupak/design-system`: candidate foundations, reusable public Tailwind configuration, framework-free contracts, canonical Astro references and composed preview; not merchant CSS |
| `apps/liquid/styles/tokens.css` | Current authored semantic tokens and merchant mappings; preserve existing visual behavior unless an agreed brief changes it |
| `apps/liquid/styles/tailwind.css` | App-owned Tailwind compilation inputs/source discovery; no Preflight |
| `apps/liquid/snippets/design-button-classes.liquid` | Authored complete button class selection, not generator output |
| `apps/liquid/snippets`, `blocks`, `sections`, `locales` | Native Liquid UI; preserve locale keys, filenames, setting IDs and editor attributes |
| `apps/liquid` | Native Shopify theme root, merchant configuration, templates and integration |
| `apps/liquid/assets/tailwind.css` | Generated CSS; Git-ignored, rebuilt for preview/upload, never edited as source |

The `liquid_components` locale namespace and Shopify schema contracts retain their existing names. Component CSS and small plain-JavaScript enhancements use Shopify's native `{% stylesheet %}` and `{% javascript %}` delivery. Native CLI filters supported theme folders, excluding app metadata and authored styles from uploads.

## Integrate approved tokens and review canonical behavior

1. Edit `packages/design-system/src/styles/tokens.css` for foundation, semantic and component values. The current candidate follows the recorded external source, not a production design approval; preserve trial labels until human decisions resolve them. Font stacks live in tokens, while private `src/styles/global.css` owns Astro's Fontsource delivery. Do not invent colors/fonts or business facts.
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

## External Tupak prototype: local integration preparation

### Source and scope

The completed assessment used sibling `../tupak-design-system`, repository `JPPACQ/tupak-design-system`, branch `main`, commit `afd9c66` (`Homepage and layout trials: hero, category slider v2, page gutter`). Its working tree was clean during assessment. It is a static HTML/CSS/vanilla-JavaScript design prototype, not a package to install or a runtime to import. A local candidate port now implements selected foundations, primitives and compositions in the existing Astro architecture. Assessment evidence below is historical; neither assessment nor implementation grants production design or asset approval.

Use its design intent, selected assets and state specifications as reference. Keep this repository's Astro/Tailwind workbench, CSS-first tokens, framework-free contracts, registry, source exports and package checks. No React, shadcn, new renderer, include loader, generator or additional build/watch plumbing is needed. The source repository remains unchanged; `apps/liquid`, deployment and store configuration are outside this integration.

### What to retain, translate or discard

| External material | Local treatment |
| --- | --- |
| `tokens.css`: structural blue, red commit actions, supporting-action colors, surfaces, typography, spacing and shape | Translate selected values and meanings into `packages/design-system/src/styles/tokens.css`. Do not introduce a second authority or blindly equate source “primary blue” with the local primary action. |
| Token descriptions and rationale | Update `src/tokens/reference.ts` metadata and relevant foundation panels; values stay in CSS. Adjust `src/styleguide/data.ts` if accepted ramp names or groups change. |
| `components.css`: visual recipes and states | Adapt existing family markup and complete Tailwind class maps. Do not import the global reset or roughly 5,000-line stylesheet wholesale. |
| Source dark selectors `[data-theme="dark"]` | Do not copy. Retain fixed `data-theme="tupak"`, mode classes, `color-scheme`, `light-dark()`, pre-paint restoration and scoped controls. |
| `fonts.css`: embedded Raleway and Instrument Sans | The candidate selects variable Instrument Sans through private Astro Fontsource delivery, including the used weights. Public tokens expose font stacks only; no base64 font CSS or mandatory font assets are exported. Preserve font licenses. |
| Product/category/editorial imagery, logo and icons | Selected files are local under `public/tupak-reference/`, with exact source paths and provenance caveats in `src/sections/reference-assets.ts`. Candidate copying is not production rights clearance. Payment marks, placeholder gallery views and prototype runtime are not part of the port. Reuse the existing Icon family. |
| Reusable section layouts | Compose typed Astro sections at build/render time, with supplied content, optional media and real optional links. Keep prototype business content out of canonical defaults. |
| Browser fragment fetching, ID rewriting, prototype toolbar and story/CSV runtime | Discard; Astro composition and renderer-owned IDs replace them. Keep useful design rationale, not another workbench. |
| Fixture search/cart/filter/pricing code, rejected alternatives and invented commercial claims | Do not port as working features. Any retained demonstration must identify simulated behavior; no fake cart success, policy claims or FAQ structured data. |

### Design decisions still unresolved

Source filenames and comments are evidence of trials, not approval:

- `tokens.css:23-47` marks the new blue ramp and extra `975` step provisional; its comments also disagree about derivation. Kraft/forest and feedback-color overlap need review.
- `tokens.css:214-254` puts Instrument Sans before Raleway and marks font/case choices as trials. Its embedded Instrument payload provides 400/700 while hero styling requests 800. The local candidate uses variable Instrument Sans instead of relying on that source payload or approving the trial font choice.
- The candidate distinguishes structural blue, red commitment actions, pale-blue supporting actions and navy navigation. Button and Link now share a `nav` variant and token-led state recipes; implementation does not settle all source design trials.
- Radius (4px versus an 8px finder treatment), container width (1600px trial versus earlier widths), header/footer and category/product carousel treatments have competing source choices. The local port selects current `index.html` treatments as a candidate, not a claim that every alternative is approved.
- Current `/prototype/index.html` uses navy header-v2/footer-v3, panel-free category-slider-v2 and no mosaic. `/prototype/index-v2.html` retains the older category row and mosaic. The suffix does not identify the newest approved design.
- Product-card B is described as client-selected in `styleguide.html:1637-1639`, but later prose still calls the choice open. Preserve that reported preference and flag the documentation conflict.
- Dark product support remains TBD here, regardless of approval claims in the source. The local light-mode adaptation preserves prior effective dark colors where shared palette changes would otherwise change both modes; retaining the toggle alone would be insufficient.

These choices can remain explicitly labelled candidates in the workbench until resolved. Do not publish every trial as an enduring component variant.

### Local implementation status and acceptance

The reusable configuration requirement is independent of design approval. `@tupak/design-system/tokens.css` is the asset-neutral native Tailwind 4 CSS-first configuration, and canonical Astro global styles consume that public export. Its four source-export shapes and framework-free contracts remain; Astro renderers are not exported as a runtime library, and no legacy TypeScript config/alias stylesheet is introduced. Consumers own the engine, Preflight, explicit template sources and font delivery; see the [consumer examples](../packages/design-system/README.md#consume-the-public-tailwind-configuration), including explicit layer order for split no-Preflight imports. Global root defaults and generic utility namespace collisions require deliberate import order, not a new isolation framework.

The existing Playwright lane covers isolated public-export Tailwind/Vite compilation and browser behavior, including nested runtime overrides/modes, source ownership/private-class exclusion and Preflight ownership, alongside canonical Astro references. Private Astro font delivery is separate from the asset-neutral export. Run the existing gate after installation and implementation before reporting current success. Configuration/check coverage does not approve candidate colors, fonts, dark-mode product support or the external design; the sibling source remains unchanged.

1. **Foundations adapted.** The single CSS authority now contains candidate blue/red/kraft/forest ramps, Instrument Sans stacks and selected sizing/shape tokens; metadata and foundation panels describe them without owning duplicate values. Trial labels remain where source decisions are unresolved. Mode identity stays `data-theme="tupak"` with prior effective dark colors retained.
2. **Existing primitives adapted.** Existing families use token-led treatments and complete utility recipes rather than copied external stylesheets. Button and Link retain native action/destination semantics, share primary/secondary/`nav` treatments and preserve focus, disabled and loading behavior. No shadcn or new rendering framework is introduced.
3. **One focused family added.** Product Card is the B-style candidate, with caller-supplied title, optional image/destination, formatted price and status. It is one destination link or a static article, never a fake cart or pricing engine. Quantity controls, tier calculations and order matrices are not implied by a presentation port; actual commerce capabilities require their own approved contracts.
4. **Homepage composed.** `/preview` selects the current external `index.html` direction: navy header-v2/footer-v3, panel-free category-slider-v2 and no older mosaic. Reusable header, hero, category row, banners, product rail, image/text, review rail, publications, FAQ and footer sections render in Astro without prototype fragment fetching. Local reference assets retain provenance caveats; review/commercial content is explicitly labelled example material. The workbench keeps individual section specimens and optional-media cases.
5. **Verify and hand off.** Run the existing package gate after implementation, then compare the rendered Astro references with the selected source views at narrow/wide widths, both modes, content extremes and interaction states. Preserve meaningful form, keyboard, mode/persistence, popup, reduced-motion and accessibility coverage. Remove incidental starter-only font/hex/geometry assertions rather than re-pinning a new set of arbitrary defaults; retain resolved-token/clipboard consistency checks. Add regression coverage only for changed consumer-visible behavior. Record visual approval separately from technical acceptance. No automatic Liquid application follows.

The local package has 22 families: alert, badge, button, card, checkbox, dialog, dropdown-menu, empty-state, form-section, icon, input, label, link, page-header, product-card, radio-group, select, separator, switch, tabs, textarea and tooltip. Select remains a custom combobox/listbox with behavior coverage, not a native select to replace casually.

### Runtime and integration risks

- Source homepage content relies on `prototype/assets/prototype.js:54-78` fetching/injecting HTML. Astro must render core content without this dependency.
- Mobile navigation opens, focuses its close control and restores trigger focus on Escape in the observed prototype. Its code has no dialog semantics, inert background or focus containment; choose a modal dialog or a nonmodal disclosure contract rather than assuming it is accessible as a modal.
- Source filters use `replaceState` and initialize from the URL once; sorting has a separate history path. Back/Forward/filter state is not a proven unified contract.
- Search only echoes the query. Cart actions explicitly announce simulated success; prices, VAT, stock and variant identifiers are fixtures. None is a Shopify integration.
- Carousels can hide an endpoint control; keyboard focus at that transition needs review. The dual-range pointer target is an 18px thumb, not the larger interactive track claimed in its comment.
- Source token contrast tooling handles limited hex inputs, not all CSS color/compositing. It is not accessibility certification.
- Asset provenance and business copy require review before shipping: fabricated reviews, policy text, company/contact claims, specifications, gallery views and enabled-payment claims must not become defaults.

### Historical evidence from the completed assessment

Inspected the source styleguide and alternate homepage in a real browser, with the homepage at 1440px and 390px. The observed alternate homepage had no horizontal document overflow at either width; mobile Menu opened, Escape closed it and returned focus to the trigger. No browser page exceptions were recorded in that session. Inspected the existing Astro workbench at 1440px as the local visual baseline. These observations do not certify all routes, accessibility, asset loading or commerce behavior.

Both previews were served locally without dependency installation or Shopify access. External navigation was blocked during browser inspection. No source code, token values, dependencies, tests, store settings, Git history or remote repositories were changed by this preparation; only local integration guidance was updated. The full package gate was not rerun for this analysis-only task.

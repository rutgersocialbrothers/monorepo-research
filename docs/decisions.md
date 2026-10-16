# Tupak workspace decisions

Each entry records what was decided and why. Operational rules for agents live in [AGENTS.md](../AGENTS.md); delivery procedure in [Shopify delivery](shopify-deployment.md).

## 1. Native theme, separate workbench

**Decision.** The workspace (`@tupak/shopify-theme`) holds two independent packages under the `@tupak` scope:

| Package | Path | Role |
| --- | --- | --- |
| `@tupak/liquid` | `apps/liquid` | Native Shopify theme root, authored directly in Shopify's folders |
| `@tupak/design-system` | `packages/design-system` | Designer workbench: candidate tokens, framework-free contracts, canonical Astro references |

The repository root is not a theme root; don't enable root-level Shopify GitHub sync. Shopify CLI uploads only supported theme folders, so package metadata and authored `styles/` stay local.

**Why.** The theme stays deployable with plain Shopify tooling, and design exploration can move fast without risking the storefront. No CMS, Storybook, project IDs, broad hoists or type-error suppression.

## 2. Pinned toolchain

**Decision.** The lockfile and pnpm catalog are authoritative. mise pins Node 24.20.0 and pnpm 12.1.0; Tailwind 4.3.3, Turbo and the Shopify CLI are pinned. Root tooling is erasable TypeScript run directly by Node 24 and checked with `typescript-native` (TS 7). Astro's checker needs the TS compiler API, so the workbench uses package-scoped TS 6 (`@2digits/tsconfig` + `astro/tsconfigs/strict`). Release-age exceptions are limited to exact Shopify CLI and Vitest pins.

**Why.** Reproducible installs locally and in CI, with no global tools.

## 3. Finite CSS build, native watchers

**Decision.** `apps/liquid/styles/tailwind.css` imports app tokens with explicit sources and no Preflight. A finite Tailwind CLI build writes the Git-ignored `assets/tailwind.css`, which must exist before preview or upload. One process writes CSS at a time.

`dev` and `dev:liquid` use Turbo's standard package watcher to rerun that build on app-file changes; the persistent Shopify CLI starts after the first build and watches the theme itself. `dev:liquid:local` only rebuilds CSS. Astro runs its own watcher. Shutdown is plain Ctrl-C; no custom supervisor.

**Why.** Turbo 2.11.5's task-input watch mode missed source deletions, and the standard watcher passed add/edit/delete/recovery probes. Ignored outputs (CSS, env, Shopify state) don't retrigger builds, so there's no feedback loop. The trade-off is that some unrelated app-file changes also rebuild CSS.

## 4. One candidate theme in the workbench

**Decision.** The workbench has a single theme, `{ id: 'tupak', label: 'Tupak' }`, with retained `Theme` and `ColorMode` types and no tenant chooser, presets or aliases. Only the colour mode persists (`tupak-design-system-mode`). `src/styles/tokens.css` holds the values; `src/tokens/reference.ts` only describes them.

The light palette, Instrument Sans, sizing and treatments are manually adapted from `JPPACQ/tupak-design-system` `main` `afd9c66`. They are **candidates, not approved branding**. Button and Link use red for commitment actions, pale blue for support, and a shared navy `nav` variant; Product Card is the 22nd family. `/preview` composes the prototype's current `index.html` selection from reusable sections and local reference artwork (provenance in `src/sections/reference-assets.ts`). Asset rights remain unresolved.

Light/dark mechanics (`light-dark()`, inherited `color-scheme`, pre-paint mode restoration, light default) are kept, with the prior dark colours preserved rather than redesigned. Whether Tupak ships dark mode is **TBD**.

**Why.** Designers need a concrete baseline to react to, without the repo implying decisions nobody has made.

## 5. Public Tailwind config export

**Decision.** `@tupak/design-system/tokens.css` is a reusable Tailwind 4 CSS-first configuration: runtime variables, modes and `@theme inline` mappings, with no font imports or asset URLs. The workbench consumes it through the same public export. Consumers own fonts, their Tailwind engine, Preflight and sources; split no-Preflight imports must declare `@layer theme, base, components, utilities;` first. Utility names are global and unprefixed, so import order resolves overlaps. Exports are exactly `tokens.css`, `themes`, `contracts` and `<family>-contract`.

**Why.** A future Liquid consumer can keep Shopify-hosted fonts and the plain Tailwind CLI without Vite or the Astro build. This does not authorize that integration; merchant values must still override the underlying runtime tokens, not only the `--color-*` mappings.

## 6. Manual Liquid adaptation, merchant authority

**Decision.** `apps/liquid/styles/tokens.css` is the Liquid CSS authority, mapping merchant settings with fallbacks. Liquid never imports workbench CSS, depends on the workbench or uses token/recipe generators. `snippets/design-button-classes.liquid` selects complete utility strings for primary/secondary × small/medium/large, each defaulting independently. Liquid stays Shopify-native: `{% stylesheet %}`, small plain JS in `{% javascript %}`, Shopify bundling and CDN. `design-system-demo` and `page.design-system` are real editor surfaces.

**Why.** Merchant settings must keep precedence, and the storefront must not inherit unapproved candidate values automatically. Designers approve intent; developers accept behavior after an explicit [contract](templates/component-contract.md) and [handoff](templates/design-handoff.md) (see the [designer workflow](designer-workflow.md)). AI summaries and automated findings grant neither.

## 7. Quality gates

**Decision.** No shadcn configuration, components, dependencies or lint rules. The workbench gate is five ordered, uncached steps: format → Astro types → source/native-class lint → static demo build → browser tests. The class lint enables exactly `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`. Root `pnpm check` adds script types, Vitest (including dotenv round-trip regressions) and the Liquid CSS build + Theme Check, reporting all failures together. The browser lane also tests an isolated external consumer of the public CSS export (utilities, nested overrides, modes, source ownership, consumer-owned Preflight).

**Why.** Findings are fixed, not suppressed or worked around by changing provisional values.

## 8. Local store configuration

**Decision.** Preview runs `node --env-file-if-exists=.env.local` with the pinned CLI's `theme dev --path .` against the user's own development theme. `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_FLAG_STORE_PASSWORD` come from ignored `.env.local` or the shell (shell wins); `SHOPIFY_CLI_THEME_TOKEN` is separate Theme Access auth. There is no custom hostname validator or flag sanitizer; Shopify CLI validates its own inputs.

`pnpm github:env-pull` reads the `develop` → `development` Environment (or `--environment <name>`) **variables** `SHOPIFY_STORE` and optional `SHOPIFY_THEME_PASSWORD` via `gh`, and writes only the two local keys. A missing password keeps the local value; an empty one clears it. Values must round-trip exactly through Node's dotenv parser or nothing is written, and passwords are never logged or passed as arguments. Environment variables are readable by authorized users; use local config when that's inappropriate.

**Why.** Native configuration with no bespoke layer to maintain. Configuration is never upload permission: agents need exact-store approval before starting a preview.

## 9. Protected CI delivery

**Decision.** `deployments/shopify.json` maps exact branches to GitHub Environments (variables: store, existing theme ID; secret: scoped Theme Access token). Delivery is off until `SHOPIFY_DEPLOY_ENABLED=true` and only runs on protected mapped branches. CI checks pull requests and pushes to mapped branches only. The delivery job rechecks its own checkout, then runs the pinned CLI against `apps/liquid` including compiled CSS, with credentials only in that step. Push ignores `settings_data.json`. Before pushing, delivery pulls the store theme and fails if it has changes the repository hasn't incorporated since the last delivered commit (recorded in a CI-owned `snippets/tupak-deployment.liquid` marker), so editor changes are never silently overwritten; they must be pulled and committed first. Only production may update an already-live theme, and nothing publishes a theme. Manual runs pull into private review artifacts, never source. Environment concurrency serializes runs but doesn't reject an older queued commit.

**Why.** GitHub protections are the delivery boundary; mappings alone don't prove account rules, credentials or theme roles.

## 10. Evidence boundary

**Decision.** Compilation, Theme Check and workbench browser tests do not certify visual correctness, full accessibility, checkout, or Shopify/editor parity, and they don't approve branding. Record current checks and exact authorized preview evidence (including failures and gaps) in the relevant handoff. Past results never stand in for a current run.

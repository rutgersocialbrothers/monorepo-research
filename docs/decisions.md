# Tupak workspace decisions

## Native theme boundary

The project identity is `@tupak/shopify-theme`. `apps/liquid` is the native Shopify theme root under the existing `@2digits/liquid` tooling namespace; the independent private `@tupak/design-system` Astro workbench remains separate. Preserve repository identity/history, merchant state, ownership and licensing. Files and local configuration do not authorize account, Git or store changes. The initial commit is intended to contain the complete approved codebase; no staging, commits or pushes are authorized while preparing it.

| Source | Ownership |
| --- | --- |
| `apps/liquid` | Native theme layouts, settings, merchant state, templates/groups, snippets, blocks, sections and locales |
| `apps/liquid/styles/tokens.css` | Merchant-aware CSS utility tokens and mappings |
| `apps/liquid/snippets/design-button-classes.liquid` | Authored complete button utility selection |
| `packages/design-system` | Tupak designer workbench, provisional tokens, framework-free contracts and canonical Astro references |

Theme files are authored directly in their Shopify folders. Existing filenames, schema/settings IDs, editor attributes, merchant composition and locale keys are retained. Storefront and schema translations live in the app locale files, including the unchanged `liquid_components` namespace. Shopify CLI loads only supported theme folders, so app metadata and authored `styles/` are not uploaded. The repository root is not a theme root; do not enable repository-root Shopify GitHub synchronization.

Use private ESM manifests, centralized pins, Turbo tasks and mise. Installation/check/build work without client infrastructure. No CMS, Storybook, automatic secret pulls, project IDs, broad hoists or type-error suppression are added.

## Tools and finite CSS lifecycle

The lockfile/catalog is authoritative. mise supplies Node **24.20.0** and pnpm **12.1.0**. Tailwind is **4.3.3**; Turbo and workspace Shopify CLI are pinned. Root uses `typescript-native` **7.0.2**; Node24 executes erasable TypeScript scripts directly, including dependency-free CI mapping before installation. Astro's checker uses package-scoped TypeScript 6 and composes `@2digits/tsconfig` with `astro/tsconfigs/strict`. Release-age exceptions stay scoped to exact Shopify CLI/Vitest pins.

`styles/tailwind.css` imports app tokens with explicit theme source discovery and no Preflight. A finite native Tailwind build writes Git-ignored `apps/liquid/assets/tailwind.css`; that asset must exist for previews and uploads. Generated CSS is excluded from build inputs. One writer owns CSS; stop development before another build/check.

Root `dev` and `dev:liquid` use standard Turbo package watching to rerun finite CSS compilation on nonignored app-file changes. Task-input watch mode is disabled: installed Turbo 2.11.5 missed both tracked and untracked source deletions in that mode; standard watching passed edit/add/delete/recovery probes. Build inputs/outputs remain declared, and ignored generated CSS, env files and Shopify state do not trigger rebuilds. Some unrelated app-file changes also compile CSS. The persistent, noninterruptible native Shopify CLI depends on the initial build, watches the app theme itself and is not restarted for each theme edit. `dev:liquid:local` watches CSS builds only, with no browser/login/upload. Native Astro owns its independent watcher; delivery stays outside Turbo.

There is no custom theme watcher, replacement framework or process supervisor. Standard Ctrl-C handles Turbo/CLI shutdown; custom draining/recovery guarantees are not provided. Fix compile errors before relying on preview CSS. Restart after env changes; install/restart after dependency, lockfile, catalog or mise changes.

## Single Tupak workbench and provisional baseline

`packages/design-system/src/styles/tokens.css` is the workbench's CSS-first value authority; `src/tokens/reference.ts` describes names/categories and is not another value store. Framework-free contracts describe purpose, props/defaults, content, states, semantics and accessibility. Astro families implement canonical references, and sections provide generic token-led editorial compositions with genuinely optional media. No source-specific business facts, remote brand assets or fabricated Tupak claims belong in default samples.

There is one theme, `{ id: 'tupak', label: 'Tupak' }`, with retained `Theme` and `ColorMode` types. No tenant chooser, alternate presets, legacy aliases or theme-persistence migration are supported. Root identity normalizes to `data-theme="tupak"`; only mode persists under `tupak-design-system-mode`. The four public source-export shapes remain `tokens.css`, `themes`, `contracts` and `<family>-contract` under `@tupak/design-system`.

The `@tupak/design-system/tokens.css` export is the reusable native Tailwind 4 CSS-first configuration, not merely a token-value dump and not a legacy TypeScript config. It owns bundled-font imports, runtime variables/modes and `@theme inline` mappings; canonical Astro global styles consume the same public export. The consumer owns its Tailwind engine, optional Preflight, explicit template sources and package-aware font asset bundling. Generic utility namespaces and root defaults are global and unprefixed: import order determines overlapping declarations, not an isolation layer. No alias export or runtime Astro component library is introduced; the four export shapes remain unchanged.

The yellow starter palette and Nunito/Lobster fonts remain **provisional, not approved Tupak design**. Preserve the effective baseline unless a designer-approved brief changes it. Light/dark classes, inherited `color-scheme`, `light-dark()` values, pre-paint valid mode restoration and default light behavior remain independently intact. Whether Tupak needs dark mode and any new mode values require designer decisions; support is **TBD**, not approved by retaining the mechanics.

The [designer workflow](designer-workflow.md), [package guide](../packages/design-system/README.md), [contract](templates/component-contract.md) and [handoff](templates/design-handoff.md) describe review and implementation acceptance. Designers approve intent; developers accept supported behavior. AI summaries and automated findings grant neither approval.

## No-shadcn policy and required gates

No shadcn configuration, components, dependencies, plugins or lint rules belong in this workspace. Preserve native Better Tailwind validation with exactly `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`; do not suppress findings, add lint-only scaffolds or change provisional values to fabricate a green gate.

The workbench gate retains five ordered, uncached leaves: formatting, Astro types, source/native-class lint, static demo build and browser tests. Root checks select these alongside root script types/Vitest and Liquid CSS build/native Theme Check, with aggregate failure reporting. Chromium is a separate prerequisite; both CI check jobs install it and Linux runtime dependencies without delivery credentials. Root Vitest retains local configuration and lossless dotenv regression coverage. Report only actually exercised checks; no historical result establishes the native cutover's current verification status.

The existing browser-test lane also covers an isolated external consumer using the public CSS export and native Tailwind/Vite compilation: computed utility behavior, nested token overrides and modes, source ownership/private-class exclusion, consumer-owned Preflight and bundled font assets. Canonical Astro references exercise the same configuration through their public import. This defines required coverage, not a current passing result or design approval; installation and an actual gate run are prerequisites to reporting verification.

## Manual Liquid adaptation and merchant authority

`apps/liquid/styles/tokens.css` remains the Liquid CSS authority with merchant custom-property mappings/fallbacks. No workbench CSS import, dependency, token generator, recipe generator or automatic application to Liquid is introduced. Liquid build/watch/delivery never depend on the workbench.

`apps/liquid/snippets/design-button-classes.liquid` selects complete authored utility strings for primary/secondary × small/medium/large, defaulting independently to primary/medium. Native button markup preserves escaping, blank guards, disabled behavior, form `name`/`value`, focus-visible, reduced motion and long-label handling. Developers manually implement approved visual/behavioral intent in app tokens and native Liquid after explicit contract/handoff.

Liquid remains Shopify-native: component CSS in `{% stylesheet %}`, small plain-JavaScript enhancements in `{% javascript %}`, native bundling/subsetting/CDN delivery. No browser TypeScript pipeline or Vite integration is added. The homepage uses native primitives; `design-system-demo` and `page.design-system` remain real editor surfaces. Local compilation creates no pages/template assignments and proves no platform/editor behavior. Review actual authorized URLs separately from Astro evidence.

## Native configuration, passwords and store safety

See [root setup](../README.md) and [Liquid setup](../apps/liquid/README.md). Preview invokes Node24 with `--env-file-if-exists=.env.local` and the pinned CLI's `theme dev --path .` from the app. Configure `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_FLAG_STORE_PASSWORD` in ignored local config or shell; shell values win. `SHOPIFY_CLI_THEME_TOKEN` remains separate Theme Access authentication. Developers own native CLI configuration; no hostname predicate, flag sanitizer or replacement guard is introduced. Shopify CLI handles target format, authentication and missing-input behavior.

Preview creates/replaces the user's remote development theme, not a CI/live ID. Agents require direct exact-store approval before starting it even when configuration exists. Native CLI behavior does not grant authorization.

`pnpm github:env-pull` uses `gh` and the current repository to read an Environment's required `SHOPIFY_STORE` and optional `SHOPIFY_THEME_PASSWORD` **variables**, not secrets or theme IDs. It writes only `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_FLAG_STORE_PASSWORD` into local ignored config, preserving unrelated settings/auth. Missing password preserves manual local configuration; empty clears it. Exact native Node dotenv roundtrip is required before updating the file or the update fails safely. Passwords are never logged or passed as command arguments; variables are readable to authorized users, so use local config when that visibility is inappropriate. The password is storefront access, not a Theme Access token. Default Environment is the `develop` mapping (`development`); `--environment <name>` overrides it. Pulling configuration is not Shopify authentication or upload permission.

## Protected native CI delivery

[Shopify delivery](shopify-deployment.md) owns operational controls. Exact branches map to Environments whose variables hold store/existing numeric theme ID and whose secrets hold scoped tokens. Delivery remains disabled until authorized targets and external protections are verified. Mappings do not prove account rules, credentials, subscriptions or theme roles.

GitHub Actions reads the branch's Environment from `deployments/shopify.json` and invokes the pinned Shopify CLI directly against `apps/liquid`, including compiled CSS, after checks. Protected-branch and deployment-activation gates remain workflow controls. Environment concurrency serializes jobs but does not reject an older queued commit. Push excludes remote `settings_data.json`; code-owned templates/groups may overwrite editor composition. Only production allows updating an already-live theme; no command publishes a theme. Manual runs pull into private review snapshots, never source. Native local push/pull remains available, with exact-target/action approval still required for consequential operations.

## Evidence boundary

Compilation and Theme Check do not certify visual correctness, complete accessibility, checkout or Shopify/editor parity. Workbench browser evidence is separate from native Liquid behavior and does not approve Tupak branding. Record current checks and exact authorized preview evidence in the relevant handoff, including failures and unverified gaps. Configuration and prior observations never authorize future remote actions. Preserve the sibling source; no store uploads, remote changes, staging, commits or pushes are implied by this cutover.

Native cutover verification: root `pnpm check --ui=stream` passed all nine tasks, including 16 dotenv regressions, 23 Chromium workbench tests, and native Theme Check (44 files, zero offenses). The isolated smoke used real Turbo/Tailwind with a local fake Shopify process and synthetic credentials: six watch builds plus one cold build proved initial CSS before CLI startup, CSS edits, new Liquid utilities, deletion/pruning, visible invalid-CSS failure preserving last-good output, recovery, one CLI instance, no feedback loop and clean SIGINT shutdown. A focused probe also verified tracked deletions and that ignored CSS/env/Shopify-state changes do not rebuild. These probes did not exercise Shopify authentication, remote synchronization, storefront rendering or the theme editor; those require an authorized store preview.

Public Tailwind configuration verification: canonical Astro references consume `@tupak/design-system/tokens.css` through its package export. Root `pnpm check --ui=stream` passed all nine tasks: 16 dotenv tests, 23 Chromium tests including the isolated native Vite/Tailwind consumer, and Theme Check with 44 files/zero offenses. Consumer coverage exercises semantic utilities, nested runtime overrides, mode scopes, caller-owned source discovery and Preflight, private-style isolation and actual bundled font loading. Removed starter-only appearance pins while retaining live palette/copy consistency. A separate browser smoke rendered the canonical component page and confirmed a runtime primary-token override with transitions disabled for the observation. No design values or Liquid sources changed in this step.

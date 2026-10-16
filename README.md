# Tupak Shopify workspace

The Tupak workspace contains a native Liquid storefront and the independent `@tupak/design-system` Astro workbench. Its current visual candidate manually adapts blue/red/kraft/forest foundations and Instrument Sans from the external Tupak prototype, without claiming production design approval. Developers manually adapt approved intent to Liquid; this port leaves Liquid unchanged. Light/dark mechanics retain the prior effective dark colors; whether Tupak needs dark mode is **TBD**. No store credentials or project IDs are embedded.

## First-time setup

Open the existing Tupak repository at its root. Preserve its Git history, remotes and uncommitted work; do not reinitialize Git or change repository/account configuration.

Install and [activate mise](https://mise.jdx.dev/), then run:

```sh
mise install
pnpm install --frozen-lockfile
pnpm --filter @tupak/design-system exec playwright install chromium
pnpm check
```

Pins: Node **24.20.0**, pnpm **12.1.0**. Shopify CLI is a pinned workspace dependency; no global installation is needed. Installation/checks need no store credentials and do not deploy.

### Choose a development path

**Source-only Liquid work — no store, authentication or Shopify uploads:**

```sh
pnpm dev:liquid:local # Rebuild CSS on theme/style input changes; no browser or uploads
```

**Tupak designer workbench — no store, authentication or Shopify uploads:**

```sh
pnpm dev:design-system # Astro reference workbench, normally http://localhost:4321
```

The workbench includes tokens, typography, the single Tupak theme in light/dark modes, 22 canonical component families/contracts and editorial sections with optional media. `/preview` composes the current external `main` homepage selection as an explicitly labelled candidate, not a live shop. Reference artwork is local, with provenance in `src/sections/reference-assets.ts`; production rights and design approval remain separate. Instrument Sans is bundled privately with Fontsource, while the public token CSS stays asset-neutral and leaves font delivery to consumers. There is no tenant chooser, CMS, database, credentials or upload dependency. Astro rendering is not proof of Liquid or merchant-editor parity.

**Liquid preview — authenticated, upload-capable:**

Install [GitHub CLI](https://cli.github.com/), then:

```sh
gh auth login
pnpm github:env-pull
# Confirm the exact SHOPIFY_FLAG_STORE in apps/liquid/.env.local is authorized.
pnpm dev           # Combined Liquid preview + canonical Astro server in Turbo's watch TUI
# Or pnpm dev:liquid.
```

The pull reads required `SHOPIFY_STORE` and optional `SHOPIFY_THEME_PASSWORD` from the current repository's GitHub Environment (`development` by default; override with `--environment <name>`). It writes native CLI keys `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_FLAG_STORE_PASSWORD` only to `apps/liquid/.env.local`, preserving other settings and local credentials. The password is storefront access, not Theme Access authentication (`SHOPIFY_CLI_THEME_TOKEN`). Set the password as an Environment **variable**, not a secret: GitHub secrets cannot be read. An absent password variable preserves manual local configuration; an empty variable clears it. Password values are never logged. GitHub variable-read access is required; this does **not** authenticate Shopify or authorize uploads.

`pnpm dev`/`dev:liquid` creates/replaces your per-user **development theme**, normally previewed at `http://127.0.0.1:9292`; it does not use CI theme IDs. Obtain permission for that exact store first. Agents require explicit user approval. Select Liquid in Turbo and press `i` for Shopify CLI login, or use an optional local Theme Access token. See [Liquid setup and recovery](apps/liquid/README.md).

### Operate and stop

Turbo: ↑/↓ selects tasks, `/` searches, `u`/`d` scroll logs, `m` shows bindings, `i` enters task interaction, and `Ctrl-z` returns to navigation. Stop development with **Ctrl-C before `pnpm check` or another artifact build**; one writer owns each artifact.

`pnpm check` registers root TypeScript/Vitest, Liquid and canonical finite check leaves in the same TUI. CI falls back to streamed logs.

Turbo's standard package watcher reruns the finite Liquid CSS build after nonignored app-file changes; the native Shopify CLI watches and serves the app theme directly. The initial CSS build precedes the persistent, noninterruptible CLI task; source changes do not restart it. Astro owns its independent workbench server. Stop with standard Ctrl-C; no custom process coordinator is provided. Restart after environment changes; install and restart after dependency/lockfile/catalog/mise changes. Do not append another `--ui` to `pnpm dev`. Root `pnpm dev:design-system` invokes native Astro directly and works without a TUI; the package-local `dev` command remains a Turbo TUI entrypoint. Liquid preview remains interactive and upload-capable.

## Sources and commands

| Path                            | Owner                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/liquid`                   | Native Shopify theme root: layouts, config, templates, merchant state, snippets, blocks, sections and locales                                                |
| `apps/liquid/styles/tokens.css` | Current authored CSS token authority and merchant-variable mappings                                                                                          |
| `packages/design-system`        | Private `@tupak/design-system`: candidate Tupak foundations, reusable public Tailwind configuration, framework-free contracts and canonical Astro references |
| `scripts`, `deployments`        | Local configuration pull and native CI branch-to-Environment mappings                                                                                        |

Commit authored source only. `apps/liquid/assets/tailwind.css` is compiled and Git-ignored, but must be built before previews or uploads. All other theme files are authored directly in `apps/liquid`; Shopify CLI filters its supported theme folders, so app metadata and `styles/` are not uploaded. The repository root is not a theme root. Do not enable repository-root Shopify GitHub synchronization.

Turbo build inputs/outputs describe the finite CSS task; standard watch mode operates at package level. Generated CSS, environment files and Shopify state are Git-ignored so they do not create rebuild feedback. Some non-theme app-file changes also compile CSS. Shopify CLI owns native theme synchronization, including source edits and deletions; there is no second theme copy or custom validation framework. Environment files, Turbo output and private pull snapshots stay ignored.

| Command                               | Result                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm build:liquid`                   | Compile app styles to `apps/liquid/assets/tailwind.css`                                               |
| `pnpm --filter @tupak/liquid check` | Native Theme Check against `apps/liquid`                                                              |
| `pnpm check`                          | Root script types/tests, Liquid CSS build/check and the canonical package's five ordered check leaves |
| `pnpm typecheck:scripts`              | Root script/test TypeScript checking                                                                  |
| `pnpm test` / `test:watch`            | Run / watch root Vitest tests                                                                         |
| `pnpm dev:design-system`              | Upload-free canonical Astro workbench                                                                 |
| `pnpm build:design-system`            | Static workbench in `packages/design-system/dist`; no generated library                               |
| `pnpm check:design-system`            | All five ordered canonical check leaves; requires Chromium                                            |
| `pnpm test:design-system`             | Canonical Playwright tests; owned Astro server on port 4322                                           |
| `pnpm preview:design-system`          | Preview the built static workbench                                                                    |

Turbo sequences prerequisites and checks without concurrent CSS writers. Liquid CSS builds are uncached; `mise.toml` pins affect hashes. Shopify delivery stays outside Turbo and uses the native pinned CLI against `apps/liquid`. Node 24 runs `.ts` scripts directly and loads local preview configuration natively. Root uses TypeScript 7.0.2 (`typescript-native`); root Vitest covers local configuration preservation.

The canonical check attempts formatting → Astro types → authored-source/native-class lint → static workbench build → browser tests, with uncached ordered leaves and aggregate failure reporting. Install Chromium before checks (`--with-deps` also installs Linux runtime dependencies, as CI does). Astro uses package-scoped TypeScript 6; root tooling remains TypeScript 7. The native class lane enables only `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`. Do not suppress findings, skip the lint lane or claim a green gate without observed results.

Tailwind v4 configuration is CSS-first with explicit source discovery, not a legacy JS config. `apps/liquid/styles/tokens.css` is the current authored token authority; `styles/tailwind.css` imports it locally. Liquid keeps its reset without Preflight and maps semantic utilities to merchant CSS variables with fallbacks. There is no public token-JSON export or recipe generator.

`apps/liquid/snippets/design-button-classes.liquid` selects complete authored utility strings for the existing button API. Native snippets own markup and behavior; app styles own CSS compilation and merchant integration.

Liquid stays close to Shopify's component model: small plain-JavaScript enhancements in `{% javascript %}`, component CSS in `{% stylesheet %}`, and Shopify's native bundling, stylesheet subsetting and CDN delivery. There is no browser TypeScript chain, Vite integration or extra JS bundler in Liquid. Environment loading stays native Node; Varlock is deferred.

### Designer integration and manual Liquid adaptation

Start with `pnpm dev:design-system`; review the workbench at `/` and composed candidate homepage at `/preview`. Edit `packages/design-system/src/styles/tokens.css` for shared values, `src/tokens/reference.ts` for descriptions, component families for canonical states/behavior and sections for editorial compositions. CSS is the value authority; metadata is not a second token store. The current candidate follows external `main` at `afd9c66`, not the older `index-v2.html` trial. Review light and dark independently: the port retains prior effective dark colors without deciding dark-mode product support. Source trials and local implementation are not design approval.

Use the [package guide](packages/design-system/README.md) for the actual source exports and five ordered check gates. There is no shadcn dependency, component configuration or lint plugin; retain native Better Tailwind class validation. This workspace has no React/UI adaptation package, Storybook or generated renderer pipeline.

Liquid keeps its own merchant-aware tokens and authored adapters: no workbench CSS import, automatic application, renderer generation or workbench build/watch prerequisite. Carry approved changes into `apps/liquid/styles/tokens.css` and the app's Liquid components through an explicit manual contract/handoff. Preserve merchant settings and editor identities; workbench screenshots cannot establish Shopify parity.

Review actual Liquid views through an authorized Shopify preview. The homepage uses native primitives, and `page.design-system`/`design-system-demo` remain real merchant-editor surfaces, not a static catalog. Record exact preview URLs, states, widths and observed evidence; compilation alone does not prove rendering or editor behavior.

Use the [designer workflow](docs/designer-workflow.md), [component contract template](docs/templates/component-contract.md) and [handoff template](docs/templates/design-handoff.md). Designers own visual/interaction decisions; developers accept implementation contracts and platform behavior.

For AI-assisted adaptation, use the project [Astro-to-Liquid skill](.agents/skills/adapt-astro-reference-to-liquid/SKILL.md): agree the plan and editor controls before implementation, separate contract corrections from the stacked Liquid implementation PR, and verify actual storefront/editor behavior. Supporting Tailwind, interface-detail, accessibility and browser-operation skills are loaded only for relevant work; see the [loading rules](.agents/skills/adapt-astro-reference-to-liquid/SKILL.md#supporting-skills-load-at-the-relevant-stage).

Optional Impeccable evaluation: `pnpm detect:design-system` scans canonical authored source against a labelled candidate snapshot. It is not part of `pnpm check` and does not automatically fix findings. Read the [Astro evaluation guide](packages/design-system/README.md) before interpreting results; use [impeccable-review](.agents/skills/impeccable-review/SKILL.md) only when UX critique is requested.

`pnpm detect:liquid` separately scans authored native-theme sources without a fixed palette baseline; see the [Liquid evaluation guide](apps/liquid/README.md#optional-design-detector-evaluation). Neither command starts a Shopify preview, uploads a theme or establishes storefront/editor correctness.

## Deployment and project identity

GitHub Actions validates pushes/PRs without deployment secrets. Automated Liquid delivery uses the native Shopify CLI after validation and explicit activation, from exact protected branches:

| Branch       | GitHub Environment | Intended target                    | May update an already-live theme? |
| ------------ | ------------------ | ---------------------------------- | --------------------------------- |
| `main`       | `production`       | Production                         | Yes                               |
| `acceptance` | `acceptance`       | Non-active preview                 | No                                |
| `test`       | `test`             | Separate non-active preview        | No                                |
| `develop`    | `development`      | Development/client-transfer target | No                                |

Environment variables hold store domains and explicit existing theme IDs; targets may share stores, but must not share the same store/theme pair across Environments. CI does not provision or publish themes; the production mapping alone adds `--allow-live`. Pushes exclude `config/settings_data.json`. Manual mapped-branch runs pull private review artifacts, never overwrite source or commit. Shopify CLI validates target formats and permissions; developers are responsible for correct configuration. Raw local CLI push/pull remains technically available, but this repository does not authorize it.

Keep `LICENSE.md`, `.github/CODEOWNERS` (`@cyanonoob`) and the existing project identity. Delivery must remain disabled until its exact authorized targets and protections have been verified:

1. Every mapped branch requires PRs, Code Owner/fresh approvals, resolved conversations and `Workspace checks`.
2. Force pushes/deletion and administrator/automation bypasses are blocked.
3. Environments allow only selected branches, use least-privilege per-store credentials and require production approval.
4. Each target has its own authorized store/existing theme ID; non-live previews never reuse a production ID.
5. The [delivery activation checklist](docs/shopify-deployment.md) is complete.

Repository files define delivery behavior, not account rulesets, credentials, stores or theme ownership. No historical run or local configuration establishes current Tupak remote state or authorizes a new operation. Do not stage, commit or push while preparing the initial state; the eventual initial commit is intended to contain the complete approved codebase and requires user authorization.

## Guides and license

- [Liquid](apps/liquid/README.md)
- [Delivery/safety](docs/shopify-deployment.md), [decisions](docs/decisions.md), [agent rules](AGENTS.md) (`CLAUDE.md` imports them)

The Liquid theme derives from [Shopify's Skeleton Theme](https://github.com/Shopify/skeleton-theme). Preserve `LICENSE.md` and its applicable terms. No new redistribution license is granted for newly authored workspace packages.

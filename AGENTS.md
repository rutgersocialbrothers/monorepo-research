# Repository guide for agents

## Scope and repository mode

This is the Tupak project: a native Liquid storefront and the independent `@tupak/design-system` Astro workbench. Make the smallest complete change. Preserve accessibility, performance, merchant settings, theme-editor compatibility, licensing and ownership. Add dependencies, frameworks or settings only for a concrete authorized need.

Keep the existing project identity, Git history/remotes and uncommitted work. Git initialization, staging, commits, pushes, remote changes or account configuration require direct authorization; this guide grants none. Never remove `.git` or discard unrelated work. Preserve `LICENSE.md`, `.github/CODEOWNERS` and the genuine tooling/vendor namespaces.

The initial commit is intended to contain the complete approved codebase. Do not stage, commit or push while preparing its initial state.

The workbench has one theme, `tupak`, and no tenant chooser. Current palette/fonts are provisional starter values, not approved Tupak design. Retain independent light/dark mechanics and existing mode values pending designer decisions; dark-mode product support is TBD. Do not invent new brand colors, business facts or assets. No shadcn components, configuration or tooling may be added.

## First-time setup

1. Read [README.md](README.md), [decisions](docs/decisions.md) and [delivery controls](docs/shopify-deployment.md). Read the affected package/app guide.
2. Preserve existing uncommitted work; never discard, stage or commit it without permission.
3. Activate mise, then run `mise install` and `pnpm install --frozen-lockfile` when installation is authorized. Use pinned Node/pnpm, not global alternatives.
   Install the workbench browser prerequisite before requested checks: `pnpm --filter @tupak/design-system exec playwright install chromium` (Linux CI uses `--with-deps`).
4. Choose the narrow development command:

   | Work | Command | Shopify upload |
   | --- | --- | --- |
   | Local Liquid CSS input watch | `pnpm dev:liquid:local` | No |
   | Canonical Astro reference | `pnpm dev:design-system` | No |
   | Liquid/store preview | `pnpm dev:liquid` | Yes |
   | Combined Liquid + Astro preview | `pnpm dev` | Yes |

5. For store previews, `pnpm github:env-pull` reads the current repository's mapped development Environment and writes only `apps/liquid/.env.local`. It maps required `SHOPIFY_STORE` to `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_THEME_PASSWORD` to `SHOPIFY_FLAG_STORE_PASSWORD`, not secrets or theme IDs. Never print password values. Missing remote password preserves manual local configuration; empty clears it. GitHub login/variable-read access is required. Obtain direct approval for that exact store's development-theme creation/replacement **before** starting preview commands. Pulled configuration is not authorization.
6. Do not accept login/permission prompts for the human.

Turbo's standard package watcher reruns the finite CSS build for nonignored app-file additions, changes and deletions. Task-input watch mode is disabled because the pinned version missed deletions in smoke verification; build inputs/outputs remain declared. Generated CSS, env files and Shopify state must stay Git-ignored to avoid feedback. Some unrelated app-file changes also rebuild CSS. The persistent, noninterruptible Shopify CLI starts after the initial build and owns native theme watching; Astro owns its independent watcher. Stop with standard Ctrl-C and restart after env, dependency, lock/catalog or mise changes; no custom shutdown coordinator is provided.

## Source ownership

| Path | Owns |
| --- | --- |
| `apps/liquid` | Native Shopify theme root: layouts, config, templates, merchant state, snippets, blocks, sections, locales and merchant-variable bridges |
| `apps/liquid/assets/tailwind.css` | Generated CSS; Git-ignored, compiled before preview/upload |
| `packages/design-system` | `@tupak/design-system`: Tupak workbench, provisional tokens, framework-free contracts and canonical Astro components; not merchant CSS or a Liquid build prerequisite |

Native components include button/image snippets, group/heading/text blocks, custom-section and the design demo. Preserve filenames, schema IDs and `{{ block.shopify_attributes }}`.

Current merchant-aware utility tokens are authored in `apps/liquid/styles/tokens.css`. Button class selection is authored in `apps/liquid/snippets/design-button-classes.liquid`, not generated from TypeScript. The Tupak workbench's CSS values live in `packages/design-system/src/styles/tokens.css`; `src/tokens/reference.ts` describes them without owning values. Designers integrate approved intent there; developers manually adapt contracts into Liquid after explicit handoff. Do not import workbench CSS into Liquid or automatically apply visual changes. There is no React/UI workspace, Storybook, generated adapter or vendored-skills dependency.

Liquid paths are relative to `apps/liquid`:
- `layout/theme.liquid` loads variables, critical CSS, generated CSS, header and footer groups.
- `templates/*.json` and `sections/*-group.json` are composition data, not component markup.
- `config/settings_schema.json` defines global settings; `settings_data.json` is merchant state.
- `locales/en.default.json` and `en.default.schema.json` own storefront/schema strings, including the preserved `liquid_components` namespace.
- `snippets/css-variables.liquid` maps merchant settings; `assets/critical.css` holds shared above-the-fold primitives.
- `styles/tailwind.css` is authored. `assets/tailwind.css` is generated.

Preserve generated warnings/structure in templates, groups and merchant state. Edit composition only when requested; change `settings_data.json` only for explicitly requested captured settings. Never copy generated output into source.

## Theme implementation

- Inspect the nearest existing component first. Keep naming and structure; do not restyle unrelated code.
- Use sections for page composition, theme blocks for reusable/nested content and snippets for reusable rendering. Nested blocks use `{% content_for 'blocks' %}` and `{ "type": "@theme" }`.
- Keep meaningful content/visual choices merchant-editable. Use few purposeful settings, useful presets and clean empty states.
- Use `t:` schema labels and the `t` filter for fixed storefront copy. Merchant copy belongs only in settings.
- Map single-property settings to CSS variables and grouped behavior to modifier classes. Reuse global merchant variables for colors/fonts.
- Use semantic HTML/native controls, ordered headings, labels, visible focus and clear action names. Preserve keyboard and reduced-motion behavior.
- Use readable Liquid, `{% liquid %}` for multiline logic and Shopify objects/routes/forms. Guard empty objects; avoid empty wrappers, broken links and invalid image requests.
- Use `image_url`/`image_tag` or shared `image.liquid`, with intentional responsive sizes, loading and alt text.
- Keep component CSS in local `{% stylesheet %}` blocks; only shared critical foundations belong in `critical.css`.
- The gift-card template does not load Tailwind CSS.
- The theme ships no custom JS. Add small, dependency-free, plain-JavaScript progressive enhancement only when HTML/CSS/Liquid cannot provide the behavior. Avoid globals; prefer local `{% javascript %}`. Do not add a browser TypeScript chain, Vite integration or extra JS bundler to Liquid; Shopify owns native component bundling, stylesheet subsetting and CDN delivery.

## Build and checks

- Consumers scan explicit Tailwind sources. Liquid imports app-owned tokens without Preflight; merchant variables retain precedence. Keep complete utility names; never construct partial classes.
- When verification is requested, compile CSS and inspect the native app theme. Shopify CLI filters supported theme folders; app metadata and `styles/` are not uploaded. Never run competing CSS writers.
- Stop dev writers before requested checks. `pnpm check` runs root script checking/Vitest, the Liquid build/check graph and the canonical package's five ordered finite leaves: format → Astro types → source/native-class lint → static demo build → browser tests. The native class lane enables only `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`. CI installs Chromium and OS runtime dependencies before checks, once per checkout; do not add a duplicate blanket build. Report only checks actually exercised; never suppress findings to fabricate a green gate.
- `pnpm build` is build-only and includes the static Astro demo. Liquid's finite native Tailwind build stays uncached with `mise.toml` toolchain inputs; the independent reference workbench is never its prerequisite. Narrow canonical commands: `dev:design-system`, `build:design-system`, `check:design-system`, `test:design-system`, `preview:design-system`; Astro checking uses package-scoped TypeScript 6.
- Author tooling as erasable `.ts`, run with Node24 and check root tooling with the stable TS7 `typescript-native` alias. Environment loading remains native Node; no Varlock.
- Test consumer-visible behavior with explicit Vitest imports. Avoid wiring/incidental-output tests. Do not run competing artifact writers.
- Exercise actual narrow/wide surfaces, keyboard use, long/empty content and relevant settings. Local Liquid harnesses are not Shopify platform/theme-editor proof.

## Store and delivery safety

- Code changes do not authorize store changes. Exact target/action approval is required for dev uploads, push/publish/delete, live settings/data or destructive commands.
- GitHub env pull is read-only remotely and writes only local Liquid configuration. Secrets remain write-only in GitHub; use normal Shopify CLI login or a local Theme Access token.
- Local preview targets a per-user development theme, not a mapped/live theme. Configure native `SHOPIFY_FLAG_STORE` and optional storefront password `SHOPIFY_FLAG_STORE_PASSWORD` in ignored `.env.local` or shell; Node24 loads that file and shell values win. `SHOPIFY_CLI_THEME_TOKEN` remains separate Theme Access authentication. Developers own configuration and Shopify CLI validates it; no replacement validator or flag sanitizer is provided. Do not use remembered or unrelated targets.
- Automated push/pull uses the native pinned Shopify CLI on mapped protected branches, with Environment credentials and explicit CI activation. Delivery checks its own checkout before uploading `apps/liquid`, including compiled CSS.
- Keep GitHub protections enabled. Raw local CLI operations are technically available, not repository-authorized: do not bypass review or exact-target approval. CI pulls create private review artifacts, never source overwrites or automatic commits.
- Preserve `.github/CODEOWNERS`: every path belongs to `@cyanonoob`. Governance changes require explicit approval.
- Never commit credentials, real `.env` files, customer/production data, pull snapshots, build metadata or generated output.

## Completion

- Requested behavior works end-to-end and remains merchant-editable where appropriate.
- Liquid, schema JSON/JSONC and translations are valid; Theme Check has no new relevant violations.
- Actual surfaces pass responsive/keyboard/empty/long-content checks.
- The native theme files and compiled CSS are ready for the requested target; app metadata remains outside supported uploaded theme folders.
- No unrelated changes, unnecessary dependencies, staged generated files or unauthorized store/Git/account changes.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Repository guide for agents

Tupak is a native Shopify Liquid theme (`apps/liquid`, `@tupak/liquid`) plus an independent Astro design-system workbench (`packages/design-system`, `@tupak/design-system`). Rationale lives in [decisions](docs/decisions.md); delivery controls in [Shopify delivery](docs/shopify-deployment.md). Read those, the [README](README.md) and the affected package guide before working.

## Ground rules

- Make the smallest complete change. Preserve accessibility, performance, merchant settings, theme-editor compatibility, licensing and ownership.
- Add dependencies, frameworks or settings only for a concrete, authorized need. No shadcn components, configuration or tooling.
- Never stage, commit, push, change remotes or account configuration without direct authorization. Never remove `.git` or discard unrelated or uncommitted work.
- Preserve `LICENSE.md` and `.github/CODEOWNERS` (every path belongs to `@cyanonoob`; governance changes need explicit approval).
- Workspace packages use the `@tupak` scope. Third-party `@2digits/*` tooling packages (lint, format, tsconfig presets) are real dependencies; keep their names.
- Don't invent brand decisions, business facts or asset rights. The workbench's blue/red/kraft/forest palette and Instrument Sans are **candidates** adapted from the external prototype (`main` `afd9c66`), not approved branding. Dark mode mechanics stay; product support is TBD. `/preview` is a labelled candidate, not a live shop.
- Don't accept login or permission prompts on the human's behalf.

## Setup

1. Activate mise, then (when installation is authorized) `mise install` and `pnpm install --frozen-lockfile`. Use the pinned Node/pnpm only.
2. Before browser checks: `pnpm --filter @tupak/design-system exec playwright install chromium` (CI adds `--with-deps`).
3. Pick the narrowest dev command:

   | Work | Command | Uploads to Shopify |
   | --- | --- | --- |
   | Liquid CSS rebuild only | `pnpm dev:liquid:local` | No |
   | Astro workbench | `pnpm dev:design-system` | No |
   | Liquid store preview | `pnpm dev:liquid` | Yes |
   | Liquid preview + workbench | `pnpm dev` | Yes |

4. For store previews, `pnpm github:env-pull` writes `SHOPIFY_FLAG_STORE` (and optional `SHOPIFY_FLAG_STORE_PASSWORD`) into ignored `apps/liquid/.env.local`. Never print password values. **Get direct approval for that exact store's development theme before starting any upload-capable command** — pulled configuration is not authorization.

Stop dev processes with Ctrl-C. Restart after env, dependency, lockfile/catalog or mise changes. Never run two CSS writers at once.

## Source ownership

| Path | Owns |
| --- | --- |
| `apps/liquid` | Theme root: layouts, config, templates, merchant state, sections, blocks, snippets, locales |
| `apps/liquid/snippets/css-variables.liquid`, `assets/critical.css` | Theme-setting tokens (`--tp-palette-*`) and the global foundation: `--tp-*` roles, reset, typography, page layout, focus ring. Components bind to roles only |
| `apps/liquid/styles/tailwind.css`, `styles/tokens.css` | Authored Tailwind entry and Tailwind names for the `--tp-*` roles (not uploaded) |
| `apps/liquid/assets/tailwind.css` | Generated CSS — Git-ignored, compiled before preview/upload, never copied into source |
| `apps/liquid/snippets/design-button-classes.liquid` | Authored button class selection |
| `packages/design-system/src/styles/tokens.css` | Workbench token values and the public `@tupak/design-system/tokens.css` Tailwind 4 config |
| `packages/design-system/src/tokens/reference.ts` | Token descriptions only, not values |
| `packages/design-system/src/sections/reference-assets.ts` | Reference asset provenance; keep candidate/rights labels |

Liquid never imports workbench CSS or depends on the workbench build. Designers approve intent in the workbench; developers adapt it into Liquid manually after explicit handoff. No generators, adapters, React/UI workspace or Storybook.

Public `tokens.css` is asset-neutral: consumers own font delivery, Tailwind engine, Preflight and sources. For split no-Preflight imports, declare `@layer theme, base, components, utilities;` first. Fontsource stays in private `src/styles/global.css`. No wrapper exports or legacy TS config.

## Theme implementation

- Start from the nearest existing component; keep its naming and structure. Preserve filenames, schema IDs, locale keys (including `liquid_components`) and `{{ block.shopify_attributes }}`.
- Sections compose pages, theme blocks hold reusable/nested content (`{% content_for 'blocks' %}`, `{ "type": "@theme" }`), snippets render reusable markup.
- `templates/*.json`, `sections/*-group.json` and `config/settings_data.json` are generated composition/merchant state: edit only when requested, keep their header warnings.
- Keep meaningful content and visual choices merchant-editable with few, purposeful settings, useful presets and clean empty states. Single-property settings → CSS variables; grouped behavior → modifier classes; reuse global color/font variables.
- Fixed copy uses `t:` schema labels and the `t` filter; merchant copy lives only in settings.
- Semantic HTML and native controls, ordered headings, labels, visible focus, clear action names, keyboard and reduced-motion support.
- `{% liquid %}` for multiline logic; Shopify objects/routes/forms; guard empty objects (no empty wrappers, broken links or invalid image requests).
- Images via `image_url`/`image_tag` or `image.liquid`, with intentional sizes, loading and alt text.
- Component CSS in `{% stylesheet %}`; only shared above-the-fold primitives in `assets/critical.css`. The gift-card template does not load Tailwind.
- No custom JS by default. When HTML/CSS can't do it, add small dependency-free plain JS in `{% javascript %}`, without globals. No browser TypeScript, Vite or bundler in Liquid.
- Use complete Tailwind class names; never build classes from fragments.

## Checks

- `pnpm check` runs root script types + Vitest, the Liquid CSS build + Theme Check, and the workbench gate (format → Astro types → lint → demo build → browser tests). Stop dev writers first.
- The workbench class lint enables exactly `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`.
- `pnpm build` is build-only. Narrow workbench commands: `dev:`, `build:`, `check:`, `test:`, `preview:design-system`.
- Tooling is erasable `.ts` run by Node 24, type-checked with the `typescript-native` (TS 7) alias; Astro checking uses package-scoped TS 6. No Varlock.
- Tests use explicit Vitest imports and cover consumer-visible behavior, not wiring.
- Report only checks you actually ran. Never suppress findings to get a green result.
- Compilation, Theme Check and Astro tests are not proof of storefront or theme-editor behavior. Exercise real surfaces: narrow/wide, keyboard, empty/long content, relevant settings.

## Store safety

- Code changes never authorize store changes. Uploads, push/publish/delete, live settings/data and destructive commands each need exact target and action approval.
- Local preview targets a per-user development theme, never a mapped or live theme. Don't reuse remembered or unrelated targets. `SHOPIFY_CLI_THEME_TOKEN` is separate Theme Access auth.
- CI delivery runs only from mapped protected branches with Environment credentials and `SHOPIFY_DEPLOY_ENABLED`. It pulls first and fails on store drift; resolve drift by incorporating the store changes in a PR, never by bypassing or weakening the check. Keep protections on; don't bypass review with raw CLI operations. CI pulls produce private review artifacts, never source changes.
- Never commit credentials, real `.env` files, customer/production data, pull snapshots, build metadata or generated output.

## Done means

- The requested behavior works end to end and stays merchant-editable where appropriate.
- Liquid, schema JSON and translations are valid; Theme Check shows no new relevant offenses.
- Real surfaces pass responsive, keyboard, empty and long-content checks.
- No unrelated changes, unneeded dependencies, staged generated files or unauthorized store/Git/account changes.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

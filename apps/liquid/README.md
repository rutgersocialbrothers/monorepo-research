# Liquid theme

`apps/liquid` is the native Shopify theme root. Layouts, settings, templates, merchant state, snippets, blocks, sections and locales are authored here directly. `styles/tokens.css` owns merchant-aware utility tokens; `styles/tailwind.css` is the CSS entrypoint. The finite Tailwind build writes `assets/tailwind.css`, which is Git-ignored but required for previews and uploads. Shopify CLI filters supported theme folders: package metadata, this guide and `styles/` are not uploaded. The repository root is not a theme root; do not enable repository-root Shopify GitHub synchronization.

## First preview

From the repository root, after [tool installation](../../README.md#first-time-setup):

```sh
gh auth login
pnpm github:env-pull
# Obtain permission for the exact SHOPIFY_FLAG_STORE in apps/liquid/.env.local.
pnpm dev:liquid
```

Root `pnpm dev` starts Liquid preview and the independent canonical Astro server together in Turbo's watch TUI. For upload-free CSS work, use `pnpm dev:liquid:local`; it reruns the finite CSS build on theme/style input changes without a browser server or uploads. For the Tupak designer workbench use `pnpm dev:design-system`, normally at `http://localhost:4321`; its provisional starter values do not prove merchant rendering or approved Tupak design.

Env pull reads this repository's Environment variables into ignored `apps/liquid/.env.local`:

| GitHub variable | Native local CLI key | Meaning |
| --- | --- | --- |
| `SHOPIFY_STORE` | `SHOPIFY_FLAG_STORE` | Intended store domain |
| `SHOPIFY_THEME_PASSWORD` (optional) | `SHOPIFY_FLAG_STORE_PASSWORD` | Storefront access password, not Theme Access authentication |

Default Environment: `development`; override with `--environment <name>`. The pull requires variable-read access, preserves unrelated local settings/auth and reads no secrets/theme IDs. An absent password variable leaves any manual local password unchanged; an empty variable clears it. Passwords must round-trip exactly through Node's dotenv parser; unsupported values fail without changing local settings. Values are never logged. GitHub variables are readable to authorized users; configure the password locally instead if that visibility is inappropriate.

Alternatively, copy `.env.example` to `.env.local` and configure native keys manually. Node24 loads `.env.local` using `--env-file-if-exists`; shell values win. Restart after changes. Shopify authentication remains separate: CLI login or local `SHOPIFY_CLI_THEME_TOKEN`. Never commit tokens, passwords or `.env.local`.

**Uploads are real:** Shopify CLI creates/replaces your per-user development theme, normally at `http://127.0.0.1:9292`, not CI/live themes. Store configuration is not permission; agents need explicit exact-store approval. Select Liquid in Turbo and press `i` for CLI login (`Ctrl-z` returns). Without a configured storefront password, use the CLI's normal prompt. Developers own native CLI configuration; no custom hostname validator or ambient-flag sanitizer is provided. Check the intended configuration before an authorized operation.

## CSS build and native watching

```sh
pnpm dev:liquid:local               # Turbo CSS rebuilds; no Shopify/server
# Ctrl-C stops development; stop before builds/checks:
pnpm build:liquid                   # Finite Tailwind compilation
pnpm --filter @2digits/liquid check # Native Theme Check against this app
```

Root preview commands use `turbo watch`. The initial finite CSS build is a prerequisite of the persistent, noninterruptible Shopify CLI task. Standard package watching handles additions, changes and deletions; ignored generated CSS, env files and Shopify state do not trigger feedback. Build inputs/outputs remain declared, but watch granularity is package-level and some unrelated app-file changes also rebuild CSS. Task-input watch mode is disabled because installed Turbo 2.11.5 missed source deletions in the smoke probe. Shopify CLI watches the native theme files and generated asset without restarting on every source edit. Astro owns its independent watcher; it is not a Liquid dependency.

The app's `dev` command invokes the pinned CLI through Node24 with `.env.local` loaded and `theme dev --path .`. Its `build` command is finite native Tailwind compilation. There is no extra theme copy, custom filesystem watcher or process coordinator. Ctrl-C uses standard Turbo/CLI shutdown semantics; no custom draining or recovery guarantees are promised. Keep one CSS writer. Fix compilation errors before relying on preview CSS, restart after environment changes, and install/restart after dependency, lockfile, catalog or mise changes.

## Component contracts

`styles/tailwind.css` imports app-owned tokens and explicitly discovers theme sources. Keep the `assets/critical.css` reset without Preflight and merchant variables in `snippets/css-variables.liquid`. Component CSS belongs in `{% stylesheet %}`; use complete classes, not `text-{{ color }}-700`. Native component JavaScript belongs in `{% javascript %}` when needed; Shopify owns bundling, stylesheet subsetting and CDN delivery. No Vite or browser TypeScript pipeline is introduced.

Both storefront layouts load Tailwind; gift-card does not—supply assets before using utilities there. Preserve translated schemas, filenames, setting IDs, Shopify editor attributes, blank guards and autogenerated state/composition warnings. Locale keys remain under their existing names, including `liquid_components`; storefront and schema translations live directly in the app locale files. Preserve merchant state and composition unless an explicit change is requested.

`snippets/button.liquid` uses authored `snippets/design-button-classes.liquid` for complete utility selection. Edit that source when an approved class change is needed, then rebuild CSS or use the input watcher.

```liquid
{% assign checkout_label = 'cart.checkout' | t %}
{% render 'button', label: checkout_label, variant: 'primary', size: 'medium',
  button_type: 'submit', name: 'checkout', value: checkout_label
%}
```

- Required `label`: blank renders nothing; text/attributes are escaped, not HTML.
- `variant`: `primary`/`secondary`; `size`: `small`/`medium`/`large`. Missing/invalid values use `primary`/`medium`.
- `button_type`: `button`/`submit`/`reset`; missing/invalid uses `button`.
- Optional `name`/`value` preserve form submission; `disabled: true` adds native disabled. Arbitrary classes/HTML labels are unsupported.

Cart checkout preserves translation and `name="checkout"`. Button styles preserve focus-visible, disabled and reduced-motion states; tokens fall back to merchant colors. The app reset applies universal border-box sizing and zero margins, responsive media defaults and inherited control fonts. `.shopify-section` supplies the three-column `--content-grid`: direct children occupy column 2, while direct `.full-width` children span all columns. Preserve this integration when editing section markup. Review actual rendering separately from CSS compilation.

The homepage uses native primitives. `templates/page.design-system.json` and `sections/design-system-demo.liquid` remain merchant-editor contracts; local builds do not create pages or assign templates. Review actual authorized preview URLs and editor behavior separately.

The independent `@tupak/design-system` package provides the single-theme Tupak designer workbench, provisional CSS tokens/fonts, framework-free contracts and canonical Astro references. Its light/dark mechanics are retained; dark-mode product support and design approval remain TBD. This app has no dependency on it, imports none of its CSS and generates no adapters. Developers manually adapt approved intent to app tokens and native Liquid after a [designer handoff](../../docs/designer-workflow.md). Merchant tokens, native markup and editor integration remain separately authored and reviewed. Use the [workspace commands](../../README.md#sources-and-commands) and [workbench guide](../../packages/design-system/README.md).

## Delivery

[Automated delivery](../../docs/shopify-deployment.md) uses the native pinned Shopify CLI against `apps/liquid`, including compiled CSS, on exact protected branches after activation and checks in its own checkout. Environments configure explicit stores, existing theme IDs and scoped tokens; Shopify CLI validates formats and permissions. CI theme IDs do not configure local development. Raw local CLI operations remain available but require separate exact-target/action approval.

Push preserves remote `config/settings_data.json`, not code-owned template/group composition. Review editor changes through isolated private pull artifacts; pulls never replace source. Copying merchant/production data into Git needs scoped review. Do not stage, commit or push while preparing the initial state; the eventual initial commit is the complete approved codebase and requires user authorization.

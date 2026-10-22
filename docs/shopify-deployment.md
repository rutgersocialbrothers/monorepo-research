# Shopify delivery

GitHub Actions runs the pinned Shopify CLI directly. There is no custom delivery wrapper or hostname validator. Developers configure the targets; Shopify CLI validates store/theme inputs and permissions.

## Branch targets

`deployments/shopify.json` selects the GitHub Environment and whether CLI may update an already-live theme:

| Branch | Environment | `allowLive` |
| --- | --- | --- |
| `main` | `production` | `true` |
| `acceptance` | `acceptance` | `false` |
| `test` | `test` | `false` |
| `develop` | `development` | `false` |

Each Environment supplies:

| Type | Name | Value |
| --- | --- | --- |
| Variable | `SHOPIFY_STORE` | Store's `*.myshopify.com` domain |
| Variable | `SHOPIFY_THEME_ID` | Existing theme ID |
| Secret | `SHOPIFY_CLI_THEME_TOKEN` | Store-specific Theme Access password |

Keep targets Environment-scoped. Confirm each store/theme pair and use non-live themes outside production. The current mapping permits live updates only for production; no workflow command publishes a theme.

## Activation and checks

Delivery requires repository variable `SHOPIFY_DEPLOY_ENABLED=true` and a protected mapped branch. Configure reviewed PRs, required `Workspace checks`, appropriate Environment branch restrictions and production approval controls before enabling it. Do not disable protections to make a delivery run.

Every pull request, and every push to a mapped branch, installs the frozen lockfile and Chromium, then runs `pnpm check`. Feature-branch pushes are checked through their pull request only. The workflow's `push.branches` list must match `deployments/shopify.json`. Pull requests receive no delivery credentials. After successful checks, the mapping job reads the branch entry from JSON. The delivery job enters that Environment, installs/checks its own checkout, and exposes the Theme Access token only to the final CLI step.

GitHub branch/Environment protections and developer configuration are the delivery boundary. Per-Environment concurrency serializes deliveries, but an older queued checkout is not rejected simply because the branch has moved. Checks compile CSS and run native Theme Check against the app theme.

## Drift check

Merchants change the theme through the editor and admin: section composition in `templates/*.json` and `sections/*-group.json`, new templates, default theme content in `locales/`, direct code edits. A push would silently overwrite or delete those changes, so every push delivery first pulls the store theme and checks it for drift (the `Check store theme drift` step in `ci.yml`; plain git, no script).

Each delivery uploads a CI-owned marker, `snippets/tupak-deployment.liquid`, recording the delivered commit. The step checks out that commit in a temporary worktree, overlays the pulled theme and lets `git diff` list changed, created and deleted files. A file passes when it matches the delivered version or the version about to be delivered (already incorporated); whitespace-only differences are ignored because Shopify reformats JSON. Otherwise delivery stops before pushing: the job summary lists the files and the pulled theme is uploaded as an artifact. `config/settings_data.json`, Git-ignored generated CSS and the marker are not compared.

To resolve drift:

1. Download the `shopify-pull-…` artifact from the failed run.
2. Copy the listed files into `apps/liquid` unchanged in a pull request and merge it; that delivery passes.
3. Make further changes to those files, or replace a store change you want to discard, in a later merge. A delivery that both incorporates and alters a drifted file fails, because the commit then matches neither the store nor the last delivery.

A theme without a marker (first delivery, or the marker was deleted) must already match the commit being delivered. To bring an existing theme under CI, either reconcile it into the repository first, or, with exact-target approval, upload the approved source once with the push command below after writing the marker exactly as the delivery step does, then delete the local marker.

The check narrows but cannot close the window between pull and push; editor changes in those seconds are still overwritten.

## Push

After a passing drift check, a push event writes the marker and runs:

```sh
pnpm --filter @tupak/liquid exec shopify theme push \
  --store "$SHOPIFY_STORE" --theme "$SHOPIFY_THEME_ID" \
  --path "$GITHUB_WORKSPACE/apps/liquid" \
  --ignore config/settings_data.json
```

The mapping's `allowLive` adds `--allow-live`. No `--publish`, development-theme creation or automatic live-theme selection is used.

The checked checkout includes compiled `apps/liquid/assets/tailwind.css`. That asset is Git-ignored but included in uploads. Shopify CLI filters supported theme folders; app metadata and authored `styles/` are not uploaded.

`config/settings_data.json` stays merchant-owned and excluded. Templates and section groups remain code-owned; the push overwrites them and removes remote files absent from the repository. The drift check is what protects editor changes: they must be incorporated before a push can run.

## Pull for review

Actions → CI → Run workflow on a protected mapped branch performs a pull, not a push; use it to fetch store changes ahead of a delivery. Push deliveries pull the same way for the drift check and upload the snapshot when it fails. CLI downloads the explicit store/theme into a new `.shopify-pull/<environment>/<run-id>-<attempt>/` directory. Existing snapshots are never overwritten and authored source is never the destination.

The workflow uploads only theme directories as a private review artifact with requested three-day retention, excluding hidden metadata. Review merchant-controlled files before selectively integrating changes. No automatic merge, commit or source synchronization occurs; never commit credentials or private snapshots.

## Local development

```sh
pnpm github:env-pull
pnpm dev:liquid:local # Turbo CSS builds only; no browser or upload
# With direct authorization for the configured store:
pnpm dev:liquid
```

Env pull reads required `SHOPIFY_STORE` and optional `SHOPIFY_THEME_PASSWORD` variables from this repository's mapped `develop` Environment, or `--environment <name>`. It writes native CLI keys `SHOPIFY_FLAG_STORE` and optional `SHOPIFY_FLAG_STORE_PASSWORD` only in ignored `apps/liquid/.env.local`, preserving other local settings and credentials. Missing password preserves local configuration; empty clears it. Password values are not printed and must round-trip exactly through Node's dotenv parser. GitHub secrets and theme IDs are not pulled; authenticate Shopify separately with CLI login or `SHOPIFY_CLI_THEME_TOKEN`.

Preview uses Shopify's per-user development theme, not the CI theme ID. Node24 loads `.env.local` natively; shell values win. The storefront password is distinct from Theme Access authentication. Developers own CLI configuration and Shopify CLI validates it; there is no custom hostname validator or flag sanitizer. Store configuration is not authorization to upload. Native CLI is available locally, and every consequential store operation still needs exact-target/action approval.

The independent Tupak workbench has no Shopify upload or merchant CSS dependency. See the [Liquid guide](../apps/liquid/README.md), [root setup](../README.md) and [workspace decisions](decisions.md).

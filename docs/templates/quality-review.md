# Quality review record

Fill this in with observed facts for one PR or release candidate, following the [quality guardrails](../quality-guardrails.md). Mark anything not checked **not run** and anything that does not exist yet **not applicable**. Do not infer a pass. This record is release evidence for LIVE; it grants no store access, upload or deployment permission. Omit passwords, tokens, customer data and private preview access details.

## Scope

- PR, branch and exact commit:
- Page types affected (home, collection, product, account, content page):
- Authorized preview: store, theme name/ID and who authorized it:
- Reviewer and date:
- Devices, browsers and viewports used:
- Tools and versions (Lighthouse/DevTools, axe, screen reader if used):

## Checks for changed files

- `pnpm --filter @tupak/liquid check` (whole theme): result, and confirmation that changed files have no offenses, warnings included:
- Manual syntax review of changed `assets/*.css`/`*.js` and `{% stylesheet %}`/`{% javascript %}` bodies:
- Third-party registry review (hosts added or removed match `apps/liquid/third-party.json`):
- `pnpm check`, or the PR's `Workspace checks` run link and result:
- Findings and their disposition:

## Performance

One row per page type and viewport. Use the targets in [preview review targets](../quality-guardrails.md#preview-review-targets).

| Page type / URL path | Viewport | LCP (s) and element | INP (ms), worst interaction | CLS | LCP image KB / first-viewport image KB | Theme JS KB | Third-party hosts and KB | Targets met? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] |

- Image rule exceptions (lazy LCP, oversized sources, missing dimensions):
- Script rule exceptions (parser-blocking, over budget):

## Baseline accessibility

Use pass, fail (with evidence) or not applicable, per the [baseline review](../quality-guardrails.md#baseline-accessibility-review).

| Page type | Landmarks | Heading order | Keyboard focus | Labels | Error association | Color contrast | Evidence path |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] | [fill in] |

- Surfaces and theme settings checked for contrast:
- Automated scan results, separate from the keyboard pass:

## Third-party changes

| Host | Added / removed | Owner | Reason | Measured effect on targets |
| --- | --- | --- | --- | --- |
| [fill in] | [fill in] | [fill in] | [fill in] | [fill in] |

- Includes the scan cannot see (settings URLs, app embeds, pixels) and their owners:

## Open items for LIVE

- Failures accepted for release, with owner and follow-up:
- Checks not run, and why:
- Items owned by MTRX or FORM that were observed but not assessed:

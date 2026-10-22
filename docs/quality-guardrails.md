# Theme quality guardrails

GENE-4 adds three guardrails that catch accessibility and performance regressions before a release:

1. **Checks for changed files**: existing commands, plus review for what they miss.
2. Documented **review targets** and a baseline **accessibility checklist** for previews of real pages.
3. A **third-party rule**: every external script or asset needs a registered owner and reason.

Record each preview review in the [quality review template](templates/quality-review.md). [Ownership](#ownership-boundaries) explains which stories own what lies outside these guardrails.

## Checks for changed files

These checks use the existing commands; no extra tooling is added. `pnpm check` runs in CI on every pull request and fails on Theme Check **errors**. Theme Check also prints **warnings** without failing. Before opening a PR, run Theme Check and resolve every offense, warnings included, in the files you changed:

```sh
pnpm build:liquid                    # Theme Check needs the compiled assets/tailwind.css (stop other CSS writers)
pnpm --filter @tupak/liquid check    # Theme Check for the whole theme
```

| Changed file type | Files | Covered by | Review by hand |
| --- | --- | --- | --- |
| Liquid | `layout`, `sections`, `blocks`, `snippets`, `templates` `*.liquid` | Theme Check: Liquid/HTML syntax, unknown filters, missing snippets and assets, `img` width/height, parser-blocking and remote scripts | — |
| JSON | `templates/*.json`, `sections/*-group.json`, `config/*.json` | Theme Check: valid JSON, existing section and block types | — |
| CSS | `styles/*.css` | Tailwind build (`pnpm build:liquid`): fails on syntax errors such as unclosed blocks or invalid declarations | Read the build output: malformed at-rules (for example an unclosed `@media (`) only print "warnings while optimizing generated CSS" and exit 0. Treat those warnings as findings |
| CSS | `assets/*.css`, `{% stylesheet %}` bodies | Not parsed by any check | Syntax: an invalid rule fails silently in the browser |
| JavaScript | `assets/*.js`, `{% javascript %}` bodies | Theme Check's JavaScript tag rules only | Syntax, plus no `import`/`export` in `{% javascript %}`: Shopify bundles those bodies into one classic script |
| Locale | `locales/*.json` | Theme Check: matching translations, existing keys, valid translation HTML | — |
| Schema | `{% schema %}` in sections/blocks, `config/settings_schema.json`, `locales/*.schema.json` | Theme Check: valid schema, setting keys, schema translations, block targets, unique setting IDs | — |

Run the whole theme, not single files: a change can break a file it did not touch (a removed locale key or a deleted snippet surfaces in the files that use it). These checks are static. They do not render pages, measure performance or prove accessibility; the [review targets](#preview-review-targets) and [baseline review](#baseline-accessibility-review) cover that. Fix findings rather than suppressing them.

## Preview review targets

Review each affected page type on an **authorized** preview: a per-user development theme or an existing non-live CI theme. Starting a preview uploads code and needs approval for that exact store ([store safety](../AGENTS.md#store-safety)). Run the review before a PR that changes a page type's templates, sections, snippets or shared assets goes to release. A page type that does not exist yet has nothing to review; record it as not applicable.

Measure on mobile (390 × 844, Lighthouse mobile throttling or DevTools 4× CPU / Slow 4G) and on desktop (1440 × 900). Use a cold load with the cache disabled. Record the tool and its version.

### Core Web Vitals

| Metric | Target | Lab measurement |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | ≤ 2.5 s | Lighthouse or the DevTools Performance panel; note which element is the LCP element |
| INP (Interaction to Next Paint) | ≤ 200 ms per listed interaction | DevTools Performance with the page's listed interactions; Total Blocking Time ≤ 200 ms as the load-time proxy |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | Through load, font swap and the listed interactions |

These are the "good" thresholds of [Core Web Vitals](https://web.dev/articles/vitals), which Google assesses at the 75th percentile of real visits. Lab results are an early signal; field data after launch belongs to LIVE.

### Images

- Render every storefront image through `image_url` with `image_tag` or `snippets/image.liquid`, with `width`/`height` (Theme Check `ImgWidthAndHeight`) and `srcset`/`sizes` that match the rendered width. No source may be wider than twice its rendered CSS width at the measured viewport.
- The LCP image is eager with `fetchpriority="high"` and is never lazy. Other images in the first viewport stay eager without the priority hint. Every image below the first viewport uses `loading="lazy"`.
- Keep the LCP image ≤ 150 KB and all images in the first mobile viewport ≤ 300 KB (transferred bytes).
- Media of unknown size (video, embeds) reserves its space with an aspect ratio, so loading it does not shift the layout.

### Scripts

- No parser-blocking scripts (Theme Check `ParserBlockingScript`). Theme JavaScript lives in `{% javascript %}` or loads with `defer` or `type="module"`.
- Keep theme-owned JavaScript within the page budget below (compressed transfer). The theme ships no JavaScript today, so every byte is a new decision.
- Third-party scripts load only from [registered hosts](#third-party-scripts-and-assets). Record their transfer size and main-thread time separately from theme JavaScript.

### Per page type

| Page type | Templates | Expected LCP element | Theme JS budget | Interactions for INP | CLS watch points |
| --- | --- | --- | --- | --- | --- |
| Home | `templates/index.json` | First section's image, or its heading when there is no image | ≤ 20 KB | Open and close navigation; slider/carousel controls; cart link | Hero media ratio, font swap, announcement or header bars |
| Collection | `templates/collection.json`, `list-collections.json` | First product-card image, or the collection heading | ≤ 30 KB | Filter, sort, pagination or load more; quick add if present | Product-card image ratios, filter drawer, newly loaded results |
| Product | `templates/product.json` | Main product media | ≤ 40 KB | Variant selection, quantity, add to cart, gallery navigation | Price/availability swap on variant change, gallery, sticky purchase bar |
| Account | Shopify-hosted (new customer accounts); the theme has no `templates/customers/*` | Page heading | ≤ 10 KB | Header account link; sign-in entry | Header account entry |
| Content page | `templates/page.json`, `article.json`, `blog.json` | Page or article heading, or the featured image | ≤ 10 KB | Navigation; in-content embeds | Embeds and inline images without reserved space |

Account pages are Shopify-hosted when the store uses new customer accounts (observed on the client-transfer store during SETU-3). The theme owns only the entry points into them. Record the hosted page as an observation; fixes there need Shopify settings, not theme code. If legacy `customers/*` templates are ever added, they take these targets like any other page.

A target changes only with recorded evidence and reviewer agreement in the PR that changes it.

## Baseline accessibility review

Review every affected page type against WCAG 2.2 level AA with a keyboard and the browser's accessibility tree. An automated scan (for example axe DevTools on the authorized preview) supports the review but does not replace the keyboard pass. Record pass, fail or not applicable per item.

| Area | Pass when |
| --- | --- |
| Semantic landmarks | One `header` (banner), one `main` (`#MainContent`) and one `footer` (contentinfo) per page; every `nav` has a distinct accessible name when there is more than one; all content sits inside a landmark except the skip link; the skip link is the first focusable element and moves focus into `main` |
| Heading order | Exactly one `h1` that names the page (product, collection, page or article title); levels never skip going down; text that only looks like a heading is not marked up as one, and real headings are not plain styled text |
| Keyboard focus | Every control is reachable with Tab in visual order and operable with Enter/Space (arrow keys inside composite widgets); the global focus ring is visible on every surface, including `.tp-on-inverse` bands; no keyboard traps; drawers and dialogs move focus in, close with Escape and return focus; sticky elements never cover the focused element; no positive `tabindex` |
| Labels | Every form control has a programmatic label (visible `label`, or `aria-label` for icon-only controls such as search); buttons and links name their action and target (an icon cart link includes its item count); informative images have alt text that says what they convey, decorative images have `alt=""`; `html` has the storefront `lang` |
| Error association | A field with an error has `aria-invalid="true"` and references its message through `aria-describedby`; form-level errors are announced (focus moves to an error summary, or the message is in a live region); each message names the field and the fix. Form-specific flows are FORM's (see below) |
| Color contrast | Text ≥ 4.5:1 (large text, 24 px or 18.66 px bold: ≥ 3:1); control boundaries, icons that convey meaning and the focus indicator ≥ 3:1 against adjacent colors. Check each surface used on the page (page, inverse, warm, natural) with the current theme settings, and recheck after palette setting changes |

## Third-party scripts and assets

Before any theme file loads something from a host that is not Shopify, register that host in [`apps/liquid/third-party.json`](../apps/liquid/third-party.json). "Something" means a script, stylesheet, font, frame, image or media file, or a `preconnect`/`dns-prefetch`/`preload`. The file sits outside Shopify's theme folders, so it is never uploaded.

```json
{
  "hosts": [
    {
      "host": "www.example-widget.com",
      "owner": "Name or team accountable for this include",
      "reason": "What it does and why it must load from the theme"
    }
  ]
}
```

Reviewers enforce the registry; no script checks it. Before approving a PR, confirm that:

- every non-Shopify host the change loads from is registered;
- each entry has a named `owner` and a concrete `reason`, and each host is listed once;
- an entry is removed in the PR that removes its last use, so the registry stays truthful.

These count as loads:

- `src`/`href`/`srcset`/`poster`/`data` URLs on `script`, `link` (stylesheet, preload, modulepreload, prefetch, preconnect, dns-prefetch, icon, manifest), `iframe`, `img`, `source`, `video`, `audio`, `embed`, `object`, `track`, SVG `image` and `use`;
- URL literals piped to `script_tag`, `stylesheet_tag`, `preload_tag`, `image_tag` or `img_tag`;
- CSS `url(…)` and `@import`;
- `fetch`, dynamic `import()` or injected scripts in `assets/*.js`, `{% javascript %}` and inline `<script>` bodies.

Plain links (`<a href>`, `rel="canonical"`/`"alternate"`) are not loads. `cdn.shopify.com` and `fonts.shopifycdn.com` are Shopify platform hosts and need no entry. Theme Check's `RemoteAsset` warning flags many remote scripts and stylesheets, which helps spot them.

The rule also covers loads that are not literal in theme code: URLs from merchant settings or metafields, app embeds and app blocks, customer events (pixels) and scripts injected at runtime. Register those hosts too when the theme is the reason they load; otherwise name their owner and reason in the PR description and the quality review.

In the PR that adds a host, include its measured effect on the [review targets](#preview-review-targets) for the affected page types.

## Ownership boundaries

- **MTRX** owns the specifics of matrix behavior and its checks. **FORM** owns form specifics: fields, validation rules, messages and complete flows. The baseline review only confirms that labels and error association exist on whatever renders.
- **LIVE** consumes the release evidence: quality review records made with the [template](templates/quality-review.md), plus each PR's `Workspace checks` result. LIVE owns release gates and post-launch field data; GENE-4 defines no go-live criteria.

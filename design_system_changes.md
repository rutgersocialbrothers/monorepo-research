# Design system change review

This ledger tracks changes made while adapting the external Tupak design system into the native Astro workbench. It supports designer review and a repeatable process for future design-system updates. **Implemented does not mean design-approved.**

## Baseline and scope

- Source: `JPPACQ/tupak-design-system`, sibling checkout `../tupak-design-system`.
- Original reference: `afd9c66`; imported update range: `afd9c66..6f9c7e2`.
- Implementation checkpoint: local commit `b158f5c`, branch `feature/feat/prototype-reference-update-6f9c7e2`, above `develop`. This document is added after that checkpoint.
- The checkpoint SHA identifies the historical verification run, not a permanent branch-head reference. Preserve this evidence if history is amended; a later source/behavior change requires a new evidence entry rather than relabelling old results.
- Target: `packages/design-system`, native Astro components and reference pages. No Liquid implementation, Shopify configuration or live commerce was changed.
- Candidate branding, imagery rights, production dark-mode support and merchant controls are not approved by this import.
- Detailed integration/provenance: [designer workflow](docs/designer-workflow.md#complete-reference-update-through-6f9c7e2), [decisions](docs/decisions.md#4-one-candidate-theme-in-the-workbench) and [package guide](packages/design-system/README.md).

### Review states

All review decisions below are **pending**. Technical corrections are implemented but have not received designer sign-off. Record an explicit decision, reviewer and evidence before marking an item accepted. A source decision is not automatically a production or theme-editor decision.

## Imported changes and choices to review

| ID    | Implemented reference                                                                                          | Review location                                                                         | Designer decision needed                                                                                                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DS-01 | Heading-case update and kraft box drawing; existing candidate tokens retained.                                 | `/` typography/tokens; `/section-keuzehulp`; collection size drawing                    | Confirm hierarchy, drawing colours and typography intent.                                                                                                               |
| DS-02 | Branch media disclosure and sale-star motion trial in SiteHeader.                                              | `/preview`, `/branches`                                                                 | Confirm navigation, imagery and whether the sale motion should ship.                                                                                                    |
| DS-03 | Framed ProductCard option and new PromoCard family; shared ProductRail can compose them.                       | `/section-product-carousel`, `/#components`, `/#sections`                               | Choose v1/v2; approve card framing, promo content hierarchy and placement.                                                                                              |
| DS-04 | Three-slide ImageSlider, opening on slide two, with arrows/dots and reachable active content.                  | `/section-image-slider`                                                                 | Confirm initial slide, artwork and interaction states.                                                                                                                  |
| DS-05 | BranchNav, branch landing route and CategoryMosaic reference.                                                  | `/branches`, `/section-branch-nav`, `/section-category-mosaic`                          | Confirm branch taxonomy and imagery; mosaic remains outside the selected homepage.                                                                                      |
| DS-06 | Navy collection, gradient trial and separate light-head proposal; local filtering, dimensions and sorting.     | `/collection`, `/collection-v2`                                                         | Choose head treatment; resolve gradient versus brand rules and approve filter semantics.                                                                                |
| DS-07 | Keuzehulp v2 with centimetre input, drawing and collection handoff.                                            | `/section-keuzehulp`                                                                    | Source v1/v2 choice remains open. Older photo-based v1 is not ported. Source stories describe a broader guided journey than this dimension form; resolve that mismatch. |
| DS-08 | Product gallery, buy-box, tiers, bundle quantities and order-matrix simulation.                                | `/product`                                                                              | Agree hierarchy and interaction contracts; fixtures do not establish real pricing, stock or checkout behavior.                                                          |
| DS-09 | Fourteen-entry overview, grid/list preference, static source thumbnails and live demo links.                   | `/overview`; section demos with `?thumb=1`, `?thumb=2` or `?thumb=all` where applicable | Review live pages separately from source thumbnail captures; captures are not parity evidence.                                                                          |
| DS-10 | All 39 newly added source images plus seven existing image dependencies copied byte-for-byte, with provenance. | `src/sections/prototype-update-assets.ts` under the package                             | Confirm final artwork and rights; generated/candidate artwork is not cleared for production.                                                                            |

The selected homepage remains the source `index.html` composition: header-v2, hero, category-slider-v2, banner pair, **v1** product rail, image/text, reviews, publications, FAQ and footer-v3. Neither keuzehulp nor framed/promo v2 is selected merely because it was imported. `/prototype` redirects to `/preview`; `/` remains the workbench.

## Intentional native adaptations and known fidelity gaps

These are implemented differences, not proposed fixes. Review them explicitly before using Astro as the production contract.

| ID    | Native change or gap                                                                                                                                                                     | Reason / review consequence                                                                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AD-01 | Sale stars have pause/resume and reduced-motion handling; animation is not byte-identical to upstream CSS.                                                                               | Source flags a continuing-animation accessibility concern. Approve the final motion treatment rather than removing the control to match screenshots.                 |
| AD-02 | Filter interactions/resets create recoverable history entries; intermediate input updates replace the current entry. Back/Forward restores state.                                        | Upstream filters only replace history; sorting already pushes. Confirm intended navigation behavior.                                                                 |
| AD-03 | A requested size above fixture maxima retains its own URL class on reload; class enumeration is bounded.                                                                                 | Fixes lost size state and excessive enumeration without changing the source's floor-class filtering model. Confirm that class model before real Shopify integration. |
| AD-04 | Cart feedback explicitly says the operation is simulated and nothing was ordered.                                                                                                        | Replaces misleading success wording. No real cart exists.                                                                                                            |
| AD-05 | Dead `#` destinations and invented operational contact behavior are replaced with real reference anchors or static/disabled content. Commercial/review content carries prototype labels. | Placeholder interactions and example claims must not look operational. Real content/destinations need separate approval.                                             |
| AD-06 | Assortiment closes on Escape/outside click/outside focus; sibling disclosures close each other.                                                                                          | Escape/outside dismissal already exists upstream; sibling exclusion is a native adaptation.                                                                          |
| AD-07 | `prototypeSlidesCool` offers an additional cooler-photo composition.                                                                                                                     | **Astro-only review option**, not an upstream variant. Warm slides retain the source sequence and starting slide.                                                    |
| AD-08 | Product rail uses five native example products. Source kraft panel/overhang, eight-card breakout layout and collection chips are not reproduced.                                         | This is a known fidelity gap, not an approved simplification. Decide whether to reproduce the source geometry/content before finalizing the rail contract.           |
| AD-09 | Native Astro layouts replace source HTML includes and deployment tooling.                                                                                                                | No prototype Paper/deployment runtime is imported. Reference simulations remain independent of Shopify.                                                              |

Keuzehulp submits to the default navy `/collection`, matching upstream `collection.html`, **not** the light-head proposal. Category slugs versus collection menu names remain visibly unresolved rather than silently remapped.

## Technical corrections already made

| ID    | Correction                                                                                                                             | Observed verification                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| TC-01 | Shared mode handling no longer overwrites route titles.                                                                                | Nine distinct hydrated reference-route titles; preview title survives mode toggle.                 |
| TC-02 | Dutch banners/navigation and all inspected Dutch skip links declare or inherit `lang="nl"`.                                            | Browser language-inheritance inspection across nine routes; not a screen-reader conformance claim. |
| TC-03 | Optional storage keys are `tupak-design-system-mode`, `tupak-overview-view`, `tupak-collection-columns`. Filters/sorting live in URLs. | Listing choice survives reload and switching collection routes. READMEs/decisions updated.         |
| TC-04 | Family documentation includes PromoCard: 23 families.                                                                                  | Updated package and designer workflow inventory.                                                   |
| TC-05 | Helper route consumers and regression test match the selected source destination.                                                      | Actual submission converts 30.5 × 20 × 15 cm into 305 × 200 × 150 mm on `/collection`.             |

## Audit backlog — not implemented

These are findings, not changes or designer decisions. Keep them separate from the completed import.

| ID    | Finding                                                                                                                 | Stabilization direction                                                                                                                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AU-01 | Unlayered workbench CSS overrides heading-weight intent. Bare h1–h6 were observed at the same 14px/21px/800 treatment.  | Resolve typography ownership/cascade before approving heading defaults or per-component exceptions.                                                                                                                                                                       |
| AU-02 | Semantic typography coverage is incomplete.                                                                             | Publish a complete specimen and contracts for headings, paragraphs, inline emphasis/annotations, small/highlight/link text, quotes, technical text, sub/sup, abbreviations/time, lists and description lists. Distinguish intentional inheritance from missing standards. |
| AU-03 | Hardcoded code/pre font stack diverges from the mono token; technical prose and rich-text rhythm lack shared treatment. | Consolidate font ownership and define scoped prose styles. Do not create wrappers for every HTML tag or globally decorate neutral span/br/time elements.                                                                                                                  |
| AU-04 | Primitive native-attribute support limits reuse by interactive compositions.                                            | Agree intentional typed native attributes, then migrate appropriate callers without leaking component-only props into DOM.                                                                                                                                                |
| AU-05 | Stock presentation, quantity steppers and server/client tier presentation repeat.                                       | Share focused recipes/pure calculations or small atomics; preserve real semantic differences.                                                                                                                                                                             |
| AU-06 | Icon-button and decorated native-select styling varies.                                                                 | Share suitable recipes. Do not replace native selects with the custom combobox merely for reuse.                                                                                                                                                                          |

## Designer decision log

Use IDs above rather than duplicating findings. Until recorded here, a review remains pending.

| Item ID(s) | Decision: accept / revise / reject / defer | Reviewer and date | Approved contract or evidence | Required implementation change |
| ---------- | ------------------------------------------ | ----------------- | ----------------------------- | ------------------------------ |
| —          | No designer decisions recorded             | —                 | —                             | —                              |

## Repeatable stabilization workflow

1. Pin the source revision and import range. Inventory selected page compositions, alternatives, assets and source decisions independently.
2. Preserve selected compositions; expose alternatives separately. Label native-only options and fidelity gaps at their review surface and in this ledger.
3. Review foundations and shared atomics before composition-specific exceptions. CSS owns token values; metadata describes them. Prefer shared recipes over copied utility bundles, without forcing unrelated semantics into one abstraction.
4. For each component, agree semantics, content/data ownership, interaction states, responsive behavior, keyboard/focus, reduced motion, empty/long content and relevant modes. Discuss actual theme-editor visibility with the developer; reference props are not a one-to-one merchant setting list.
5. Flag excessive or unsuitable contracts. Ask whether to rework them, involve the designer, or both. Put contract/Astro/example/docs corrections in a separate lower PR; implementation goes in an upper stacked PR. Developer-approved implementation may begin while designer review is pending; upper merge waits for lower approval/merge.
6. Record decisions with reviewer, revision and evidence. Rejected alternatives are removed only after an explicit decision, not silently during import.
7. Verify the actual target surface. Astro checks cannot establish Liquid storefront/theme-editor parity. Native Shopify verification needs separately authorized targets/actions.
8. Append a dated/revision-bound batch for each future import. Preserve stable IDs and the decision history; never turn old technical evidence into current visual approval.

## Evidence at the implementation checkpoint

At `b158f5c`: `pnpm check` passed all nine tasks, 16 root tests and 37 browser tests. Astro reported zero errors/warnings/hints; Theme Check inspected 44 files with zero offenses. Browser smoke covered affected reference routes at 390px/1280px, demo thumbnail isolation, dark demo layouts, persistence, title/language handling and the helper handoff. These are historical technical observations, **not designer sign-off, exhaustive accessibility certification or Liquid verification**.

# Native UI verification

Load when planning detailed acceptance checks or verifying an adaptation. Scope all actions to the agreed component, authorized preview and approved editor operations. A testing skill never grants store access or permission to change merchant state.

## On-demand verification skills

Use the supporting-skill loading rules in [the adaptation workflow](SKILL.md). Load `fixing-accessibility` before accessibility review and `make-interfaces-feel-better` for relevant visual detail review, not their entire reference trees. Use `tailwind-design-system` when diagnosing token/utility/responsive integration, not as a second testing framework.

For browser operation, load the installed [agent-browser skill](../agent-browser/SKILL.md) only when actually using that executable. Confirm it works and follow its version-matched instructions. Prefer available environment browser tooling if it does not; do not install or replace tooling merely to satisfy the reference.

Do not accumulate generic QA skills that duplicate this checklist. Skill availability and tool availability are separate. Browser instructions must fit the actual tool, rather than mixing CLI commands with another runtime's API.

## Existing verification infrastructure

The workbench already uses Playwright and `axe-core` in `packages/design-system/package.json`:
- `tests/styleguide.spec.ts`: narrow/wide rendering, keyboard/focus and component-panel axe scans.
- `tests/preview.spec.ts`: rail endpoint/focus behavior and native disclosure interaction.

These are Astro checks, not native storefront/editor evidence. Reuse established test conventions for canonical changes; do not point the Astro suite at a store and claim native coverage. Use available browser tooling for authorized native views and the existing axe source for scoped automated audits where the runtime permits. No new runner, package or browser extension is implied.

Extend persistent tests only for meaningful behavior, boundaries or regressions under the repository's testing rules. Do not add screenshot/source-text/wiring tests merely to prove files exist. Real browser exercise is still required.

## Required checks

Choose relevant scenarios in the approved plan; explain non-applicable checks rather than creating artificial states.

### Rendered visual and responsive behavior

- Compare real Astro and Liquid screenshots with comparable content, viewport and state. Record intentional merchant-driven differences.
- Exercise narrow, intermediate and wide layouts and relevant layout-switch boundaries. Check typography/font loading, spacing, container integration, media/cropping, wrapping, overflow and stacking.
- Include empty/missing data, long/localized content and agreed merchant-setting variations. Reference fixtures do not prove commerce integration.
- Check supported color schemes/modes and reduced motion where relevant. Do not infer Liquid dark-mode support from Astro.
- Check larger text and zoom/reflow where relevant and supported. A smaller viewport alone is not proof of browser zoom behavior.
- Inspect adaptation-related console errors and failed assets. Capture screenshots for visible defects and steps/state evidence for interactive defects; do not reject intermittent findings merely because a later attempt passes.

### Keyboard, focus and semantics

- Traverse with Tab/Shift+Tab and use widget-appropriate Enter, Space, arrow, Home/End and Escape keys. Check actual focus, visible indication and meaningful order—not just event firing.
- Check hidden/inert content, accidental traps, sticky overlays obscuring focus, dialog entry/containment/dismissal/restoration where applicable.
- Repeatedly activate rail/carousel controls in both directions through their endpoints. Check focus retention and disabled behavior, not just final scroll position.
- Inspect native elements, names, roles/states, headings, labels, error/description relationships, image alternatives and meaningful dynamic updates. Avoid adding ARIA when native semantics suffice.
- Test multiple instances: IDs, labels, controls, forms and state must not leak between sections/blocks.

### Automated accessibility checks

- Run axe against the native rendered component plus sufficient surrounding page context, at initial readiness and relevant revealed states (open disclosure/dialog, error state, etc.). Also check affected Astro states when the lower PR changes them.
- Reuse existing axe integration and appropriate rules rather than adding an audit framework. Record rule scope, violation IDs, affected elements, incomplete/manual-review findings and justified exclusions.
- Fix adaptation-caused findings; identify unrelated pre-existing findings separately without suppressing them or widening scope silently. Canonical defects return to the contract decision/PR layer.
- If the runtime prevents scanning, record the exact missing check and discuss the verification gap; do not report an unrun scan as clean. Never bypass CSP or security controls to manufacture a result.
- An accessibility snapshot is not a screen-reader session. Zero automated violations is not WCAG conformance. Report actual assistive-technology testing separately; otherwise mark it unexercised. See [Playwright accessibility guidance](https://playwright.dev/docs/accessibility-testing).

### Actual Shopify theme editor

Verify the agreed settings and permitted composition in an authorized development-theme editor, not just the initial storefront load:
- Add, reorder, nest and remove blocks where supported; update visible settings and verify the resulting content/appearance.
- Exercise actual section/block replacement and re-selection. Re-observe the preview frame/DOM before acting on references invalidated by replacement.
- For progressive JavaScript, verify reinitialization after section load, cleanup after unload, and repeated updates without duplicate handlers, stale state or cross-instance effects.
- Check selection of hidden/tabbed/sliding content where relevant: selected blocks must remain discoverable and usable. Preserve correct editor-attribute association.
- Recheck interaction, focus and semantics after updates; make sure ordinary storefront behavior still works outside design mode.

Use native lifecycle integration appropriate to the implementation; do not add JavaScript merely to handle events when native markup already works. See [Shopify editor integration](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks).

Local DOM replacement or synthetic Shopify events can support regression checks but are not evidence of a real editor session. Editor operations can persist changes: obtain authorization for the exact development theme and operation scope, never use live composition as a test fixture.

## Evidence and completion

Record exact reference/target views, template, viewport, state/content, tool actually used, actions, observations and screenshot/evidence paths with the existing design handoff prompt. Do not disclose credentials, private preview access data or customer data.

Report checks not run and limitations explicitly. Native storefront and editor verification cannot be replaced by static checks or Astro tests. Missing access/authorization leaves the adaptation **implemented, awaiting native verification**. Keep technical verification, developer acceptance and designer approval distinct.

---
name: impeccable-review
description: >
  Use only when explicitly asked for a Tupak canonical Astro/reference UX critique
  of hierarchy, clarity or task fit, or to interpret its optional Impeccable
  detector findings. Report-only; not a general frontend implementation workflow,
  automatic review gate, Liquid parity check or human design approval.
---

# Optional canonical-reference critique

This is a **bounded Tupak adaptation of Impeccable review ideas**, not the upstream full `/impeccable` workflow. Default deliverable: findings in the conversation, with **no source edits**. A review request does not authorize fixes, dependencies, Git actions, uploads, theme/editor changes or a redesign. Do not run the upstream installer, context launcher, initialization, hooks, live mode, overlay injection or critique persistence. Do not create `PRODUCT.md`, sidecars or `.impeccable/critique/` archives.

## Establish the evidence

1. Read the applicable repository rules, [package guide](../../../packages/design-system/README.md) and relevant [designer workflow](../../../docs/designer-workflow.md). Resolve the requested component/composition to actual source and meaningful states; inspect its nearest contract, Astro renderer and examples. `packages/design-system/src/components/<family>/` owns canonical families; `src/sections/` owns compositions; `src/styleguide/` owns workbench documentation. `/preview` is a labelled candidate composition, not a live shop.
2. Establish the intended audience/task from the request, contract and repository evidence. Do not invent business goals, approved content, asset rights or brand decisions. If a judgment depends on missing intent, identify that uncertainty rather than fabricating a persona or score.
3. CSS values belong to `packages/design-system/src/styles/tokens.css`; `src/tokens/reference.ts` is descriptive metadata. [DESIGN.md](../../../packages/design-system/DESIGN.md) is only a manually refreshed candidate detector snapshot. One `tupak` identity has independent light/dark mechanics; current blue/red/kraft/forest and Instrument Sans are provisional, and dark-mode support is TBD.
4. Inspect a requested view in the available browser when authorized and available. Reuse the upload-free Astro surface (`pnpm dev:design-system`), never root `pnpm dev` or Liquid upload commands for reference critique. Follow the available browser tool's instructions; load [agent-browser](../agent-browser/SKILL.md) only if operating that CLI. Record exact URL, viewport, mode, content and interactions actually inspected. Stop any server/tab started solely for review unless the user requests otherwise. Without rendered evidence, label visual/behavior conclusions as source-only inferences; do not claim responsiveness, contrast or keyboard behavior was tested.

## Assess task fit before interpreting detector output

Keep the qualitative judgment distinct from the deterministic heuristic findings:

- **Hierarchy:** can the intended user find the purpose and next meaningful action? Are emphasis, reading order and competing actions appropriate to that task?
- **Clarity:** do labels, copy, states and grouping communicate what happens, what is required, and any limitations? Treat reference fixtures as fixtures, not verified commerce facts.
- **Task fit:** does composition reduce irrelevant choices and support the intended action? Check applicable empty/long-content, disabled/error, narrow/wide and keyboard/focus states against the contract; distinguish observed defects from unexercised risks.
- Tie every concern to an exact source location or observed view/state and a consumer consequence. Recommend a concrete bounded remedy, not generic taste rules. Do not replace the candidate palette/font because a tool dislikes it. Accessibility concerns need actionable evidence; load [fixing-accessibility](../fixing-accessibility/SKILL.md) only for relevant semantics/interaction review.

If detector interpretation is requested, run the package-local command or a narrowed authored-source scan from repository root:

```sh
pnpm detect:design-system
pnpm --dir packages/design-system exec impeccable detect src/components/button --json
```

Use the root-pinned CLI, not `npx ...@latest`; do not install another copy or waive findings. Preserve exit status: **0** completed without primary findings (advisories may remain), **2** completed with primary findings, **1** operational failure/partial scan. Reuse supplied complete output when it matches the current requested target. If unavailable, report the exact gap and continue the reachable qualitative review; do not claim the scan ran.

Check each finding against its actual source/context. Separate plausible defects, documented candidate choices, documentation/example artifacts and false positives. The four baseline categories are literal colors, font families, radii and font sizes. Matching tolerances are not design approval; `var()` acceptance does not validate variables or semantic roles. The shared light/dark allowlist cannot enforce either mode. Ordinary HTTP(S) URL scans do not load the package-local baseline. Source detection does not execute Astro or prove rendered/platform behavior. A clean scan is not a clean UX verdict or a substitute for the existing format/types/lint/build/browser gates.

## Return a bounded report

- Scope and evidence: exact source/view/state, assumptions, actual commands/statuses and unverified gaps.
- **AI review verdict — advisory:** summarize hierarchy, clarity and task fit with prioritized findings. Each finding includes location/state, user impact, evidence versus inference and concrete recommendation. Do not force a finding count, numerical score or approval label.
- Detector interpretation separately: primary/advisory findings, operational failures, relevant false positives and limits. State explicitly when not run or not requested.
- Human decisions: separate unresolved designer intent/visual approval from developer technical acceptance. An AI verdict supplies neither, nor Shopify parity, accessibility conformance or release authorization.

Canonical defects go through the existing [adaptation contract workflow](../adapt-astro-reference-to-liquid/SKILL.md): recommend developer discussion of rework/designer involvement, then a **lower contract PR** consistently updating affected contract, Astro renderer, examples and docs when correction is approved. Keep any Liquid implementation in its separate upper layer; this critique does not create either PR. Merchant editor controls are discussed with the developer per adaptation, never inferred one-to-one from Astro props. Implementation drift is not permission to revise the canonical reference. Actual authorized native storefront/theme-editor evidence remains necessary for Liquid completion.

## Upstream provenance and modification notice

Adapted for Tupak on 2026-10-15 from Paul Bakaus's Impeccable, exact revision **`abf5779cabc20147fd9c013fa4705088c200bf8a`**:

- [Official critique source](https://github.com/pbakaus/impeccable/blob/abf5779cabc20147fd9c013fa4705088c200bf8a/skill/reference/critique.md): qualitative review themes and separating review judgment from detector evidence.
- [Official CLI contract documentation](https://github.com/pbakaus/impeccable/blob/abf5779cabc20147fd9c013fa4705088c200bf8a/docs/CLI-CONTRACT.md) and [detector implementation](https://github.com/pbakaus/impeccable/blob/abf5779cabc20147fd9c013fa4705088c200bf8a/crates/detect/src/design_system.rs): detector interpretation, not new project policy.

**Modified substantially:** rewritten as a narrow, on-demand, report-only canonical-reference review. No upstream suite, React examples, mandatory dual-assessment orchestration, persistent scoring/trends, installer, context launcher or live mode is included. Repository boundaries and human decisions supersede upstream stylistic prescriptions. This is not an upstream-certified or complete `/impeccable` installation.

Copyright 2025 Paul Bakaus. Adapted material is used under the Apache License, Version 2.0; the full upstream license is preserved in [LICENSE](LICENSE). Upstream [NOTICE.md](https://github.com/pbakaus/impeccable/blob/abf5779cabc20147fd9c013fa4705088c200bf8a/NOTICE.md) attributes its iOS/Android platform references to ehmo's MIT-licensed `platform-design-skills`; those files/material are not included in this adaptation. No platform reference or third-party notice relevant to copied material is removed.

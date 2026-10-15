---
name: adapt-astro-reference-to-liquid
description: Plan and implement Tupak canonical Astro reference components as native Shopify Liquid sections, theme blocks, and snippets. Use for reference-to-theme adaptation, merchant composition and editor-control design, contract review, and separate stacked contract/implementation PRs.
---

# Adapt Astro references to native Liquid

Adapt intent, not files. The Astro reference describes capabilities and behavior; Shopify determines native rendering, commerce integration and merchant editing. Follow repository rules and existing patterns rather than adding another architecture.

## Entry and scope

Default to **plan → explicit developer approval → execute**. An explicitly approved, current implementation plan can enter execution directly. Do not interpret a request to plan as implementation approval.

Read the affected package guides and relevant sections of:
- [Architecture decisions](../../../docs/decisions.md).
- [Delivery controls](../../../docs/shopify-deployment.md), before preview or PR/delivery actions.
- [Component contract prompt](../../../docs/templates/component-contract.md), when evaluating or revising a contract.
- [Design handoff prompt](../../../docs/templates/design-handoff.md), when planning evidence and recording results.

Use these existing templates proportionally in the agreed discussion or handoff; do not create duplicate paperwork. Establish the exact canonical source, selected component/composition, documented variants and meaningful states. Default to covering those capabilities, not merely the visible screenshot. Dependencies enter scope only where necessary to deliver the agreed behavior; do not port an entire dependency API automatically.

### Supporting skills: load at the relevant stage

These skills are installed alongside this one. Load only the applicable skill and topic references; do not preload every body or worked example.

- [tailwind-design-system](../tailwind-design-system/SKILL.md): load for token mapping, responsive utilities, variants or shared-style changes during planning/implementation. Use framework-neutral Tailwind 4 guidance only. Its full Tailwind import, sample token values, dark-mode setup and React/CVA/Radix examples are not Tupak implementation instructions: preserve Liquid's no-Preflight imports, native class selection, merchant variables and independent token ownership. Do not load its React worked examples for Liquid work.
- [make-interfaces-feel-better](../make-interfaces-feel-better/SKILL.md): load when assessing reference quality or reviewing visual execution. Load individual typography/surface/icon/motion/performance references only for the affected topic. Treat its prescribed styling/animation values as review suggestions, not authority to redesign the approved reference. Ignore React-specific examples. Report canonical improvements through the contract/designer decision and lower PR; fix implementation drift within the approved upper-PR scope.
- [fixing-accessibility](../fixing-accessibility/SKILL.md): load when evaluating semantics/interaction requirements and before accessibility verification, especially controls, forms, disclosures and focus transitions. Use it preventively as well as for review; an audit invocation alone does not authorize code changes. Findings require exact markup/location, impact and a concrete remedy; canonical defects follow the contract decision/PR process.
- [agent-browser](../agent-browser/SKILL.md): load only when operating that browser CLI for actual-surface verification; confirm executable/version availability first. If unavailable, use environment-provided browser tooling with its own API instructions rather than installing or mixing runners automatically.

Repository rules and the approved contract/plan govern integration. These supporting skills do not expand scope, decide merchant controls, authorize dependencies/store operations, or supply human approval. Do not load Billybird's React adaptation/planning/review workflows.

## 1. Inspect and challenge the reference

Inspect the canonical contract, Astro renderer, examples, relevant tokens and actual narrow/wide behavior. Inspect the nearest Liquid implementations and their consumers before proposing new primitives. Distinguish candidate reference values and fixtures from approved design, content and assets.

Flag concrete contract problems before approval: accessibility or interaction defects, missing states, redundant variants, excessive capability, impractical composition, or assumptions incompatible with actual use. For each, state the evidence, consumer consequence and recommended resolution. Do not invoke vague “best practices” without explaining the problem.

Ask the developer whether to rework the contract, raise the issue with the designer, or both. Do not silently simplify capabilities, reproduce a known defect or change the canonical reference without agreement. Batch related consequential decisions; resolve repository-answerable details yourself.

## 2. Agree the native implementation plan

### Composition

Prefer freely reusable theme blocks wherever they make functional sense. Choose boundaries by merchant responsibility, not by the Astro filename:
- **Section:** independently placed page area, composition or contextual integration.
- **Theme block:** meaningful content/layout unit the merchant can insert, reorder or nest.
- **Snippet:** parameterized shared rendering without an independent editor identity.

Combinations are expected. First consider existing sections, groups and content/rendering primitives. Do not turn every wrapper into a block or assume every Astro section needs a dedicated Liquid section.

Identify restrictions by **required data/form context** and **compatible parent/child behavior**, not arbitrary page labels. A product card with an explicit product selection can belong on a content page; current-product purchase controls require the appropriate product/form integration. Explain each restriction and verify what native Shopify mechanisms can actually enforce. Define a useful editor/empty-state experience; silently rendering nothing is not a placement policy.

### Capabilities versus editor controls

The reference contract is **not** a one-to-one end-user-editable scope. Discuss editor visibility with the developer for this implementation; do not decide it solely from Astro props or freeze it in this skill.

Propose a concise mapping of relevant capabilities/content to:
- Shopify context or selected data, merchant controls, derived behavior, or implementation-owned behavior.
- Visible editor controls, defaults, conditional visibility and constraints.
- Add/reorder/nest/remove permissions and missing/long-content behavior.

Discuss related controls together. Existing global settings and layout conventions inform recommendations but do not substitute for this agreement. Fixed UI copy uses translations; reference fixtures are not real commerce data or approved business claims.

### Visual scope and acceptance

Map the reference to independently authored, merchant-aware Liquid styles. Preserve merchant-setting authority and account for native theme container/layout behavior. Do not import workbench CSS into Liquid or introduce an Astro build dependency.

Propose shared token/default changes when necessary, but name affected consumers and obtain explicit approval for that shared impact. Component approval alone does not authorize restyling unrelated components. Record intentional differences and unresolved choices, including dark-mode scope and asset rights.

Present one reviewable plan containing:
1. Exact source, capabilities, dependencies and non-goals.
2. Reused/new native composition and functional compatibility constraints.
3. Agreed data sourcing and editor-control mapping.
4. Visual/token changes, shared impact and intentional differences.
5. Contract corrections, designer involvement and PR boundaries if needed.
6. Observable storefront/editor acceptance scenarios, evidence and required authorization.

Stop for explicit approval. Return for a decision only when new information materially changes agreed behavior, editor controls, shared impact, contract or authorized scope.

## 3. Separate contract and implementation work

When a contract correction is needed, use **two separate PRs**:
1. **Lower contract PR:** finalize the agreed contract; update the affected canonical Astro renderer, examples and documentation so the reference remains consistent. Include relevant verification. No Liquid adaptation implementation.
2. **Upper implementation PR:** stack the Liquid adaptation on the contract branch and implement that resulting contract. Keep Shopify-specific choices in the adaptation plan unless they reveal a canonical issue.

Implementation may begin after the developer approves the proposed revised contract, while designer review is pending. Record the designer's approval as pending, not inferred. Before merging the lower PR, satisfy required developer approval and any agreed designer-review gate; pending review is not approval. Do not merge the upper PR before the lower PR is approved and merged. If designer feedback or implementation discoveries change the contract, update the lower layer first, then reconcile the implementation.

If no contract changes are needed, do not create an empty contract PR. Maintain separate reviewable layers locally when Git/remote actions are not authorized. This skill does not authorize branch creation, commits, pushes, PR submission, designer approval or store operations; follow the repository and current user authorization. Use the authorized stack workflow rather than inventing one.

## 4. Implement the approved plan

Reuse native sections, theme blocks, snippets, schemas, translations, Shopify objects/routes/forms and image handling. Preserve existing schema identities and editor attributes. Follow native CSS/JavaScript ownership and merchant-variable conventions. Implement the complete agreed capability set without copying reference fixtures or expanding unrelated APIs.

Contract fixes belong in the lower layer, not hidden in the Liquid implementation. Keep documentation/handoff consistent with the agreed behavior and actual evidence.

## 5. Verify and hand off

Load [UI verification](verification.md) before planning detailed checks or executing verification. Use available browser/testing skills selectively; do not load unrelated implementation or planning skills.

Actual **native storefront and theme-editor verification are mandatory** before declaring the implementation complete. A CSS build, Theme Check, Astro tests or local Liquid harness cannot substitute. Obtain exact-target/action authorization before development-theme uploads or editor changes; do not modify live merchant composition to manufacture proof.

Record exact reviewed views/templates, viewport sizes, content/states, interactions, observed results, evidence and intentional differences using the existing handoff prompt. Distinguish real integration from simulated behavior. Missing authorization/access means **implemented, awaiting native verification**, not complete; finish all reachable work and state the precise missing prerequisite.

Keep designer visual approval and developer technical acceptance separate. AI evidence cannot supply either human decision. Report only exercised checks and unresolved findings; do not claim accessibility conformance or design approval from automation.

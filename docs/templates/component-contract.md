# Component contract prompt

Copy this template into the agreed project discussion or handoff and fill it in with the designer and developer. It is a set of questions, not an approved component contract or a prescription for visual choices. Keep unknowns explicit; do not add a primitive merely to complete the form.

## Identity, purpose and boundaries

- Proposed name and owner:
- User task and intended outcome:
- Where should it be used? When should it **not** be used?
- Which existing canonical contracts/components and Liquid primitives/app consumers were considered (source paths and actual reference or authorized preview URLs)?
- Why can composition of existing primitives not meet the need, if proposing something new?
- Status: discussion / proposed / human-approved; decision makers and date:

## Variants and states

- Which existing variants apply? Which additional choices, if any, need explicit approval?
- Which states are required by the actual user flow? For each, describe trigger, visible result and behavior.
- How do focus, hover, activation, disabled and other relevant states behave? Which are native behavior versus custom logic?
- Which combinations are unsupported, and why?
- What should happen when content or data is missing, slow or invalid, if relevant?

## Composition and content

- What may be composed inside or beside this primitive? Who owns spacing and surrounding layout?
- What content, labels, translations, icons or media does the consumer supply?
- Which content extremes and languages must be reviewed? What is the intended wrapping/overflow behavior?
- Are there nesting restrictions or conflicting interactions to avoid?
- What is owned here versus by an app, merchant setting or larger pattern?

## Semantics and accessibility

- Which native element and role fit the user task (including button versus navigation link)?
- How is the accessible name supplied? What labels, descriptions and announcements are needed?
- What keyboard, focus and disabled behavior is required? Who manages focus during any transition?
- Which contrast, reduced-motion and assistive-technology checks are relevant, and how will they be evidenced?
- Which constraints remain unresolved and require specialist or human review?

## Platform-specific contract

- What is framework-free visual/behavioral intent versus renderer-owned markup, styling and logic? Describe the contract without assuming Astro markup or generated adapters. Which provisional starter tokens are replaced by approved Tupak values, and what independent light/dark decisions remain pending?
- **Liquid:** which merchant settings, color schemes, locale keys, schema identities and editor attributes must be preserved? Which real Shopify checks are needed, and what exact-store authorization is still required?
- Which canonical Astro contract/component is the reference? Which differences from Liquid rendering and the theme editor are intentional, and which remain unverified? The workbench does not generate or validate Liquid adapters.
- Source-of-truth paths and affected consumers:

## Acceptance and evidence plan

- Designer's observable visual/interaction-intent acceptance criteria:
- Developer's observable technical acceptance criteria:
- Existing Liquid views/demo states and any approved missing scenarios:
- Exact authorized preview URLs, assigned page/template if relevant, viewport dimensions and content/state scenarios:
- Manual checks, any authorized automated observations and screenshot evidence to collect:
- Which behavior is a no-action demo or otherwise simulated, and what requires real integration proof?
- Open questions, dependencies and explicit non-goals:
- Separate designer and developer decision records (person, date, scope; pending is valid):

Use [the handoff template](design-handoff.md) to record what was actually reviewed. A filled contract or passing CSS build/Theme Check is not approval to deploy or access a store.

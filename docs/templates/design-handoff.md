# Design handoff prompt

Fill this in with observed facts. Leave unknowns marked **unverified** rather than inferring completion. Screenshots, generated reports and AI summaries are evidence, not human approval. This template grants no store access, upload or deployment permission.

## Brief and source

- User task/view and agreed scope:
- Designer intent and decisions (who decided, when):
- Contract reference and its approval status:
- Existing primitives reused; approved additions, if any:
- Changed authored source paths and relevant source/version reference:
- Generated artifacts rebuilt from those sources:
- Explicitly unchanged areas and non-goals:

## Views and states actually reviewed

Add a row for each actual canonical Astro or Liquid view/state and viewport; identify the renderer and include content details, not just a homepage link. Do not invent catalog case IDs or assume a Liquid demo page exists.

| Renderer / view / section / block | Exact reviewed URL and template | Viewport width × height | State/content | Observed outcome and evidence path |
| --- | --- | --- | --- | --- |
| [fill in] | [fill in] | [fill in] | [fill in] | [fill in] |

- Preview/review commands actually run and their results:
- Environment and exact authorized store/preview target; actual assigned demo page/template if reviewed (omit credentials):
- Screenshot paths and any manual evidence:
- Keyboard/focus/activation, disabled, content extremes and other checks actually performed:
- Report failures and their disposition; checks not run:

## Behavior and confidence boundaries

- **Observed real behavior:** name the environment, action and result; distinguish native control behavior from a complete business flow.
- **Simulated behavior:** what looks like an action/state but does not implement the real app flow?
- **Unverified behavior:** app integration, persistence, backend data, checkout, merchant settings/color schemes, translations, real devices, Shopify rendering or theme-editor behavior not exercised.
- Any authorized real-app/store check: exact target and operation, who authorized it, and separate observed evidence. Omit credentials.
- Known differences from any separately available canonical reference and the intended application:

The single-theme Tupak Astro workbench is an independent reference with provisional starter palette/fonts and optional media, not approved client design, a generated Liquid adapter or a Shopify parity check. Light/dark mechanics remain available; dark-mode product support and design approval are TBD. Record any approved replacements and unresolved mode decisions separately. Its five-leaf gate retains source lint and a native class lane containing only `better-tailwindcss/no-unknown-classes` and `better-tailwindcss/no-concatenated-classes`; record actual results and failures without suppression. No shadcn tooling or automatic token application is part of the handoff. CSS compilation, Theme Check and browser evidence have distinct scopes; none certifies visual correctness, complete accessibility or Shopify/theme-editor parity. A screenshot is not proof of a working user flow.

## Separate human decisions

### Designer visual approval

- Status: pending / approved for the stated scope / changes requested:
- Person and date:
- Visual intent, composition, content and interaction intent approved:
- Exceptions and views/states not approved:

### Developer technical acceptance

- Status: pending / accepted for the stated scope / changes requested:
- Person and date:
- Semantics, accessibility, responsive behavior and integration checks supporting acceptance:
- Exceptions, report failures and integrations not accepted:

Neither decision substitutes for the other. Technical checks do not decide the designer's intent; designer approval does not certify accessibility or production behavior. AI cannot fill these approvals on a human's behalf.

## Unresolved gaps and next owner

- Gap/question, impact, responsible person and evidence needed:
- Missing approved primitive or review scenario, if any:
- Separate approvals needed before real-store testing or deployment:
- Suggested next action within the agreed scope:

Keep repository documentation out of deployable theme directories. Review screenshot/report content before sharing; do not include personal/customer data, secrets, passwords or private preview access data.

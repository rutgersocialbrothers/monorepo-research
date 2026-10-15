# agent-browser provenance

- Official upstream: https://github.com/vercel-labs/agent-browser
- Pinned commit: [`dac13bb87468fe9d74a040d862720f6cc17a9565`](https://github.com/vercel-labs/agent-browser/commit/dac13bb87468fe9d74a040d862720f6cc17a9565), resolved from the public GitHub `commits/main` API on 2026-10-15.
- Import source: [`skill-data/core/`](https://github.com/vercel-labs/agent-browser/tree/dac13bb87468fe9d74a040d862720f6cc17a9565/skill-data/core).
- License: [Apache-2.0](LICENSE), including upstream's Copyright 2025 Vercel Inc. notice, copied from the repository's pinned root `LICENSE`.

## Packaging and manifest

`SKILL.md` is a project-authored discovery entrypoint. It deliberately does not copy the upstream discovery stub's `hidden: true`, broad specialized triggers, tool restrictions, installation instructions, or mandatory preference over environment tools.

`upstream/core/` contains upstream reference content, not a second independently installed skill. Files were imported from pinned raw GitHub URLs through the text reader, preserving their content and relative layout; the reader normalizes outer whitespace. No operational examples were executed. Original frontmatter describes upstream tooling and does not override project/environment permissions.

```text
SKILL.md
SOURCE.md
LICENSE
upstream/core/SKILL.md
upstream/core/references/authentication.md
upstream/core/references/commands.md
upstream/core/references/profiling.md
upstream/core/references/proxy-support.md
upstream/core/references/session-management.md
upstream/core/references/snapshot-refs.md
upstream/core/references/streaming.md
upstream/core/references/trust-boundaries.md
upstream/core/references/video-recording.md
upstream/core/references/webgpu.md
upstream/core/templates/authenticated-session.sh
upstream/core/templates/capture-workflow.sh
upstream/core/templates/form-automation.sh
```

The full core supporting set is retained so its command reference, back-links, session/authentication safety guidance, and template examples remain usable on demand. Scripts are reference templates, not auto-run hooks; inspect and adapt only for an authorized task. No Electron, Slack, cloud, dogfood, deployment-protection, or other specialized skill directories are included. Their upstream CLI discovery mentions remain reference text only.

## Local references and maintenance

The upstream core guide's Markdown file links point into `references/`; references link back through `../SKILL.md` or to sibling references. Those targets are included with the original layout. The core guide's additional backticked reference/template paths are also included. No local relative Markdown file target was omitted during source selection; anchor and runtime validation are left to the integrating agent.

When updating, resolve a new immutable upstream commit, import the core and supporting set together, preserve upstream attribution/license, and review compatibility and safety-sensitive changes. Do not fetch or execute unrelated specialized workflows just because the upstream guide mentions them. Prefer installed-version guidance when a functioning CLI is actually available; this snapshot does not install or prove a CLI/browser runtime.

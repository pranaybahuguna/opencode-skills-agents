---
name: architecture-docs
description: Conventions for writing and maintaining this project's living architecture documentation. Use whenever creating or updating Markdown docs under ./docs so output is consistent, MkDocs-Material-ready, and renders interactive Mermaid diagrams. Covers page structure, Java/Angular/Oracle documentation style, and diagram standards.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  stack: java-angular-oracle
---

## Documentation structure

All docs live under `./docs` and are rendered by MkDocs Material. Mirror the
codebase in the docs tree:

- `docs/index.md` — project overview: what the system does, who uses it, the
  high-level shape. One screen, no fluff.
- `docs/architecture/overview.md` — the system map. MUST contain a single
  up-to-date Mermaid diagram of components and their dependencies, followed by a
  short paragraph per component explaining its responsibility.
- `docs/<module>/<thing>.md` — one page per significant service, controller, or
  module. File path mirrors the source package path where practical.

## Page anatomy

Each component page follows this order:

1. **One-line summary** — what this thing is, in plain language.
2. **Responsibilities** — 3–6 bullets of what it owns.
3. **Key types / endpoints** — a small table (name, purpose). For Java: public
   classes/methods that matter. For Angular: components/services. For Oracle:
   tables/views/procedures touched.
4. **How it fits** — how it connects to the rest of the system (callers,
   dependencies, data it reads/writes).
5. **Notes / open questions** — anything non-obvious or intentionally deferred.

## Style

- Write for a developer new to the codebase. Explain *intent*, not syntax.
- Never paste large code blocks. Use short illustrative snippets only when a
  signature or contract genuinely needs showing.
- Keep each page scannable: headings, short paragraphs, tables over prose for
  enumerations.
- Use present tense and active voice.

## Diagrams (Mermaid)

- Use ```mermaid fenced blocks — MkDocs Material renders them interactively.
- Architecture: use `flowchart LR` or `flowchart TD`. Group by layer
  (API / service / data) with subgraphs.
- Sequence diagrams (`sequenceDiagram`) for request flows where ordering matters.
- Label every edge with what flows across it (e.g. "OrderDTO", "SQL query").
- Keep diagrams readable: if it exceeds ~12 nodes, split into sub-diagrams.

## Freshness contract

- When code changes, the page describing it must change in the same pass.
- If a class/endpoint is deleted, delete its doc section.
- The overview diagram must always reflect the components that actually exist.

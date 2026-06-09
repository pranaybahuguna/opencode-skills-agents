---
name: architecture-docs
description: Conventions for writing and maintaining this project's living architecture documentation. Covers page structure, design-first module overviews, system-level architectural context, Java/Angular/Oracle style, Mermaid diagram standards, and the full documentation pass procedure.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  stack: java-angular-oracle
---

## Full documentation pass

When asked to "go", "full pass", or "generate all docs", execute these steps
in order without waiting for further input.

### Step 1 — per-module pages
For each module below, read its source under `./<module>/src` and create or
update pages under `./docs/<module>/`. Each module needs at minimum an
`overview.md` following the enriched page anatomy below.

Modules in scope:
- ot-analyzer
- ot-common-services
- ot-config
- ot-eligibility-service
- ot-extractor
- ot-jenkins-api
- ot-matching-engine
- ot-model
- ot-otkr-api
- ot-repository

**To add a new module in future:** add it to this list.

### Step 2 — system overview
Generate or update `docs/architecture/overview.md` following the system
overview structure below.

---

## Module overview page anatomy

Every `docs/<module>/overview.md` must follow this structure in order.
This is the most important page for each module — it should give a new
developer a genuine understanding of the module, not just a list of classes.

### 1. One-line summary
What this module is, in plain language. One sentence maximum.

### 2. Why this module exists (Design intent)
The architectural reason this module was separated out. What would break or
become unclear if this module didn't exist? What responsibility does it own
that nothing else should own? Write 2-3 sentences of genuine reasoning, not
just a restatement of the name.

### 3. Key concepts
3-5 domain or technical concepts a new developer must understand before
working in this module. For each concept, write 2-4 sentences explaining
what it is, why it matters here, and how it shows up in the code.

Example format:
- **Eligibility Rule** — A rule defines the conditions under which an entity
  qualifies for a given action. In this module, rules are evaluated in a chain;
  the first rule that matches short-circuits the rest. This keeps business logic
  declarative and testable without cascading conditionals.

### 4. Responsibilities
4-7 bullets of what this module owns. Be specific.

### 5. Design patterns applied
List the patterns deliberately used and briefly explain why each was chosen.
E.g. Repository (decouples persistence from business logic), Strategy
(swappable rule implementations), Event-driven (decoupled downstream
notification). Only list patterns that were a deliberate design decision.

### 6. Key types and endpoints
A table: name | type | purpose. For Java: public services, repositories,
value objects that matter.

### 7. How it fits
How this module connects to the rest of the system: who calls it, what it
calls, what data it reads and writes, what events it publishes or consumes.

### 8. Trade-offs and constraints
What this module deliberately does NOT do, and why. What was consciously
decided. What known limitations exist.

### 9. Open questions / tech debt
Anything non-obvious, intentionally deferred, or worth flagging.

---

## System overview page (docs/architecture/overview.md)

This is the parent/overall context page. It must give someone new to the
project a complete mental model of the whole system.

### Structure for overview.md

#### 1. What this system does
2-3 sentences: the problem being solved, who uses it, what it produces.

#### 2. Architectural principles
The guiding design decisions that apply across the whole system — the "why"
behind the module decomposition. Write these as named principles with a
1-2 sentence explanation of each.

#### 3. System map (Mermaid diagram)
A single flowchart LR showing all modules and their dependencies/calls.
Use subgraphs to group by layer (API, Core, Data, Config). Label every
edge with what flows across it.

#### 4. Module responsibilities at a glance
A table: module | one-line responsibility | key technology. Quick reference.

#### 5. Key cross-cutting concepts
Concepts that span multiple modules: how configuration is resolved, how
eligibility feeds into matching, what the shared domain model is and who
owns it. 3-6 concepts, each 2-4 sentences.

#### 6. Significant architectural decisions
The 3-5 most important decisions made in designing this system, with brief
rationale for each.

#### 7. Key data and event flows
For the most important end-to-end flows, a Mermaid sequenceDiagram showing
which modules are involved and in what order. 1-2 flows maximum here.

---

## Style

- Write for a developer new to the codebase. Explain intent, not syntax.
- Never paste large code blocks. Short illustrative snippets only.
- Use present tense and active voice.
- Keep each page scannable: headings, short paragraphs, tables over prose.
- Precision over completeness: three true things beats ten vague ones.

## Mermaid conventions

- Architecture: flowchart LR or flowchart TD. Group by layer with subgraphs.
- Sequences: sequenceDiagram for request flows where ordering matters.
- Label every edge with what flows across it.
- Split into sub-diagrams if a diagram exceeds ~12 nodes.

## Freshness contract

- When code changes, the page describing it must change in the same pass.
- If a class or endpoint is deleted, delete its doc section.
- Per-module overview.md owns that module's internals.
- docs/architecture/overview.md owns cross-module dependencies and the system map.


## Diagram honesty rules

Draw diagrams that are rich and informative, based on what the code shows.

- **Participants**: use actual Java classes, Spring beans, and modules you
  find in source. Use actual endpoint paths from @RequestMapping annotations.
  Do not add external infrastructure (NGINX, brokers, gateways) unless a
  config file in the repo proves they exist.
- **Edge labels**: use real method names or endpoint paths from the source.
- **Uncertain components**: if an external system is referenced but not
  configured locally, show it with a note "(external — not configured in repo)"
  rather than omitting it entirely.
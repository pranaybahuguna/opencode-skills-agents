---
name: architecture-docs
description: Conventions for writing and maintaining this project's living architecture documentation. Covers page structure, design-first module overviews, mandatory code flow tracing for Spring/Java modules, system-level architectural context, Mermaid diagram standards, and the full documentation pass procedure.
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
`overview.md` following the full page anatomy below — every section filled.

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

## How to read a Spring/Java module before writing

Before writing any documentation for a module, do this read pass:

1. Find all `@RestController` or `@Controller` classes — these are the entry
   points. List every `@GetMapping`, `@PostMapping`, `@PutMapping`,
   `@DeleteMapping` method with its path and parameters.

2. For each controller, find its `@Autowired` or constructor-injected
   dependencies. Follow those to the `@Service` classes.

3. For each service method called by the controller, find what it does:
   what repositories it calls, what transformations it applies, what
   exceptions it throws.

4. For each `@Repository` or `JpaRepository`, find the custom `@Query`
   methods and what entities they operate on.

5. Find all `@Entity` classes — these are the data model. Document their
   key fields and relationships.

6. Find any `@EventListener`, `@Async`, `@Scheduled`, or Feign client
   usages — these are non-obvious flows that developers consistently miss.

Only after this read pass should you begin writing. The documentation should
reflect what you found, not what you assume.

---

## Module overview page anatomy

Every `docs/<module>/overview.md` must follow this structure. Every section
must be filled. A section left sparse or empty is a documentation failure.

### 1. One-line summary
What this module is, in one sentence.

### 2. Why this module exists (Design intent)
The architectural reason this module was separated out. What would break
if it didn't exist? 2-3 sentences of genuine reasoning.

### 3. Key concepts
3-5 domain or technical concepts a new developer must understand before
working here. For each: what it is, why it matters, how it appears in code.
2-4 sentences per concept.

### 4. Key operation flows (most important section)

This section is the difference between documentation that describes structure
and documentation that shows what actually runs. It is mandatory.

For the 2-3 most important operations in this module, trace the complete
execution path as a Mermaid sequence diagram. Follow actual method calls
from the HTTP entry point to the final side effect (DB write, response, event).

**How to build each diagram:**
- Start from the `@RequestMapping` method on the controller
- Use actual class names found in source (e.g. `EligibilityController`)
- Use actual method names and parameter types from the source
- Follow the chain: Controller → Service → Repository → Entity/DB
- Label each arrow with the real data: method name, DTO type, or return type
- Include async steps, Feign calls, or event publishes if present
- Show the error path if the exception handling is non-trivial

**Example of what this should look like:**
```
sequenceDiagram
    Client->>EligibilityController: POST /v1/eligibility (EligibilityRequest)
    EligibilityController->>EligibilityService: evaluate(request)
    EligibilityService->>RuleRepository: findActiveRules(entityType)
    RuleRepository-->>EligibilityService: List<Rule>
    EligibilityService->>EligibilityService: applyChain(rules, request)
    EligibilityService-->>EligibilityController: EligibilityResult
    EligibilityController-->>Client: 200 OK (EligibilityResponse)
```

After each diagram, write 2-3 sentences explaining what the flow does and
any non-obvious decisions in it (why async? why a separate repository call?).

### 5. Design patterns applied
Patterns deliberately used and why each was chosen. Only list intentional
design decisions, not incidental patterns.

### 6. Key types and endpoints
A table: name | type | purpose. Controllers: list each endpoint path + method.
Services: list public methods. Repositories: list custom queries. Entities:
list the key fields. Keep it scannable.

### 7. How it fits
How this module connects to the rest of the system. Who calls it, what it
calls, what data it reads and writes, what events it publishes or consumes.
Mention the specific module names, not generic descriptions.

### 8. Trade-offs and constraints
What this module deliberately does NOT do. Known limitations. Conscious
decisions. This is often the most useful section and the most neglected.

### 9. Open questions / tech debt
Anything non-obvious, deferred, or worth investigating.

---

## System overview page (docs/architecture/overview.md)

### Structure

#### 1. What this system does
2-3 sentences: the problem, who uses it, what it produces.

#### 2. Architectural principles
The guiding design decisions behind the module decomposition. Named
principles with 1-2 sentence explanations.

#### 3. System map (Mermaid flowchart)
A `flowchart LR` showing all modules and their dependencies. Use subgraphs
to group by layer (API, Core, Data, Config). Label edges with what flows
across them.

#### 4. End-to-end operational flows
This is the system-level equivalent of section 4 in the module page.
Show the 2-3 most important end-to-end flows across modules as sequence
diagrams. A developer should be able to read these and understand what
happens from the moment a request enters the system to the moment it
produces an output. Use actual module names and, where possible, actual
class/method names from the source.

#### 5. Module responsibilities at a glance
A table: module | one-line responsibility | key technology.

#### 6. Key cross-cutting concepts
Concepts that span multiple modules. 3-6 concepts, 2-4 sentences each.

#### 7. Significant architectural decisions
The 3-5 most important decisions made, with brief rationale for each.

---

## Style

- Write for a developer who needs to understand what the code does at runtime,
  not someone reading a class catalogue.
- Sequence diagrams and operation flows are more valuable than prose lists.
  Lead with behaviour, follow with structure.
- Use present tense and active voice.
- Short paragraphs. Tables for enumerations. Diagrams for flows.
- Three precise true statements beat ten vague ones.

## Mermaid conventions

- Architecture: `flowchart LR` with subgraphs for layers.
- Flows: `sequenceDiagram` with actual class/method names from source.
- Label every edge with what flows across it (method name, data type, event).
- Split into sub-diagrams if a diagram exceeds ~12 participants.

## Diagram honesty rules

- Participants must be actual classes or config-proven external systems.
- Do not add infrastructure (NGINX, brokers, gateways) unless a config file
  in this repo proves they exist.
- If an external system is referenced but not configured locally, show it
  with a note "(external — not configured in repo)".
- Use real method names from source. Do not invent operation names.

## Freshness contract

- When code changes, the page describing it must change in the same pass.
- If a class or endpoint is deleted, delete its doc section.
- Per-module overview.md owns that module's flows and internals.
- docs/architecture/overview.md owns cross-module flows and the system map.
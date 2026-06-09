# OpenCode Living-Docs Demo

Code-synced documentation that updates when the code changes and renders as an
interactive HTML site. Three pieces:

1. **`docs` agent** (`.opencode/agents/docs.md`) — the worker. Reads source,
   writes Markdown under `docs/`, never touches code.
2. **`architecture-docs` skill** (`.opencode/skills/architecture-docs/SKILL.md`)
   — the conventions (page structure, Java/Angular/Oracle style, Mermaid rules).
3. **MkDocs Material** — renders `docs/` into a live, searchable HTML site with
   interactive Mermaid diagrams.

Freshness is wired two ways: a manual command (`scripts/refresh-docs.sh`) and a
git `pre-commit` hook that regenerates + stages docs on every commit.

---

## One-time setup (~5 min)

```bash
# 0. Prereqs: OpenCode installed and authed, Python 3, git.

# 1. Install the docs site renderer
pip install -r requirements.txt        # mkdocs-material

# 2. Make scripts/hooks executable
chmod +x scripts/refresh-docs.sh githooks/pre-commit

# 3. (Optional) wire the git hook so docs refresh on every commit
git init -q && git add -A && git commit -qm "initial" || true
git config core.hooksPath githooks

# 4. Confirm OpenCode sees the agent and skill
opencode agent list        # should list: docs
```

If the `docs` agent needs a specific model, add `model: <provider>/<model-id>`
to the frontmatter in `.opencode/agents/docs.md` (otherwise it uses your global
default).

---

## The live demo (the part that lands)

Use **two terminals** side by side.

**Terminal 1 — the HTML site, live-reloading:**

```bash
mkdocs serve
# open http://127.0.0.1:8000  (keep this visible on screen)
```

**Terminal 2 — change code, regenerate docs:**

```bash
# 1. Show the current site (Order Service page is a placeholder).

# 2. Make a real code change — e.g. add a cancelOrder method:
$EDITOR src/main/java/com/example/orders/OrderService.java

# 3. Regenerate docs for what changed:
scripts/refresh-docs.sh --since-head
#   (or --all for a full pass, or just `git commit` to trigger the hook)
```

As the agent writes Markdown into `docs/`, **MkDocs auto-reloads the browser** —
the audience watches the Order Service page and the architecture diagram update
to match the new method, live.

### Demo script (90 seconds)
1. "Docs are generated and maintained by an agent, not by hand." — show site.
2. Add a method to `OrderService`. — show the diff.
3. Run `scripts/refresh-docs.sh --since-head`. — narrate: reads the change,
   loads our conventions skill, edits only `docs/`.
4. Flip to the browser — page + Mermaid diagram have updated. Done.

---

## How freshness actually works (talking point)

Running an LLM on every keystroke is slow and wasteful, so the trigger lives at
**commit time** (git hook) or **CI** (run `scripts/refresh-docs.sh --all` on
merge and publish with `mkdocs gh-deploy` or your pipeline). The optional
`.opencode/plugin/docs-sync.ts` shows the event-driven flavour — it flags stale
docs after edits but defers the actual regen to keep things fast.

Deterministic API reference (Javadoc, Compodoc/TypeDoc) can sit alongside this:
let the agent own the prose + architecture narrative, let the build tools own the
generated reference.

---

## Files

| Path | Role |
|------|------|
| `.opencode/agents/docs.md` | The docs subagent (scoped to edit only `docs/`) |
| `.opencode/skills/architecture-docs/SKILL.md` | Documentation conventions |
| `.opencode/plugin/docs-sync.ts` | Optional event-driven stale-docs nudge |
| `opencode.json` | Skill permissions + agent registration |
| `scripts/refresh-docs.sh` | Regenerate docs for changed / all files |
| `githooks/pre-commit` | Auto-refresh + stage docs on commit |
| `mkdocs.yml` | MkDocs Material site (Mermaid + search + dark mode) |
| `docs/` | The rendered documentation (agent-maintained) |
| `src/` | Tiny sample Java service so the scaffold runs standalone |

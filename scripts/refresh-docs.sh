#!/usr/bin/env bash
#
# refresh-docs.sh (multi-module) — regenerate docs per Maven module using the
# OpenCode `docs` subagent. Modules in scope are listed in .docmodules.
#
# Usage:
#   scripts/refresh-docs.sh                # changed modules, staged for commit
#   scripts/refresh-docs.sh --since-head   # changed modules since last commit
#   scripts/refresh-docs.sh --all          # full pass over every listed module
#   scripts/refresh-docs.sh --module payment-service   # force one module
#
set -euo pipefail

MODE="${1:---staged}"
MODULES_FILE="${DOCMODULES:-.docmodules}"

if [[ ! -f "$MODULES_FILE" ]]; then
  echo "No $MODULES_FILE found at repo root. List one module path per line." >&2
  exit 2
fi

# Load module list (portable; skips comments/blank lines — works on bash 3.2+).
MODULES=()
while IFS= read -r line; do
  [[ -n "$line" ]] && MODULES+=("$line")
done < <(grep -vE '^[[:space:]]*(#|$)' "$MODULES_FILE")

# Single-module override
if [[ "$MODE" == "--module" ]]; then
  MODULES=("${2:?give a module path}")
  MODE="--all"
fi

changed_in() {  # $1 = module dir → prints changed source files within it
  case "$MODE" in
    --staged)     git diff --cached --name-only --diff-filter=ACMR -- "$1/" ;;
    --since-head) git diff --name-only --diff-filter=ACMR HEAD~1 -- "$1/" ;;
    --all)        echo "__ALL__" ;;
    *) echo "Unknown mode: $MODE" >&2; exit 2 ;;
  esac
}

ran=0
for m in "${MODULES[@]}"; do
  CH="$(changed_in "$m")"
  if [[ "$MODE" == "--all" ]]; then
    PROMPT="Full documentation pass for module '$m'. Read the source under ./$m and bring the pages under ./docs/$m up to date, following the architecture-docs skill. Create docs/$m pages if missing. Only edit files under ./docs/$m."
  elif [[ -z "$CH" ]]; then
    continue   # this module didn't change — skip it
  else
    PROMPT="Module '$m' changed files: $(echo "$CH" | tr '\n' ' '). Update the pages under ./docs/$m to match, following the architecture-docs skill. Only edit files under ./docs/$m."
  fi
  echo "▶ docs: $m"
  opencode run --agent docs "$PROMPT"
  ran=1
done

if [[ "$ran" -eq 0 ]]; then
  echo "No in-scope module changed — docs unchanged."
else
  echo "✓ Docs refreshed."
fi
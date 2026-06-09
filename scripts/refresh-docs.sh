#!/usr/bin/env bash
#
# refresh-docs.sh — regenerate docs for changed source files using the OpenCode
# `docs` subagent. This is the single command behind both the live demo and the
# git pre-commit hook.
#
# Usage:
#   scripts/refresh-docs.sh            # docs for files staged for commit
#   scripts/refresh-docs.sh --since-head  # docs for files changed since last commit
#   scripts/refresh-docs.sh --all      # full documentation pass
#
set -euo pipefail

MODE="${1:---staged}"
GLOBS=("*.java" "*.ts" "*.html")   # adjust to your stack

collect() {
  case "$MODE" in
    --staged)
      git diff --cached --name-only --diff-filter=ACMR -- "src/" ;;
    --since-head)
      git diff --name-only --diff-filter=ACMR HEAD~1 -- "src/" ;;
    --all)
      echo "__ALL__" ;;
    *)
      echo "Unknown mode: $MODE" >&2; exit 2 ;;
  esac
}

CHANGED="$(collect)"

if [[ "$CHANGED" == "__ALL__" ]]; then
  PROMPT="Do a full documentation pass. Review all source under ./src and bring every page in ./docs up to date, following the architecture-docs skill. Only edit files under ./docs."
elif [[ -z "$CHANGED" ]]; then
  echo "No source changes detected — docs unchanged."
  exit 0
else
  PROMPT="These source files changed: $(echo "$CHANGED" | tr '\n' ' '). Update the affected pages under ./docs to match, following the architecture-docs skill. Only edit files under ./docs."
fi

echo "▶ Running docs agent..."
opencode run --agent docs "$PROMPT"
echo "✓ Docs refreshed under ./docs"

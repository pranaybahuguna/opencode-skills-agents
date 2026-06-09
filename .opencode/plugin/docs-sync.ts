// docs-sync.ts — OPTIONAL "fully automatic" flavour.
//
// This fires after OpenCode itself edits a source file and flags that docs are
// stale. It deliberately does NOT call the LLM on every edit (that would be slow
// and expensive mid-refactor). Instead it just marks a dirty flag / prints a
// nudge. Run scripts/refresh-docs.sh (or commit) to actually regenerate.
//
// For the demo, prefer the manual command — it's controllable and reliable on
// stage. Keep this around to show the "it can be event-driven" story.

import type { Plugin } from "@opencode-ai/plugin"

const SOURCE = /\.(java|ts|html)$/
let dirty = false

export const DocsSync: Plugin = async ({ $ }) => ({
  tool: {
    execute: {
      after: async (input: any, output: any) => {
        if (input.tool === "edit" && SOURCE.test(output?.args?.filePath ?? "")) {
          if (!dirty) {
            dirty = true
            console.log("📝 Source changed — docs are stale. Run scripts/refresh-docs.sh --since-head")
          }
        }
      },
    },
  },
})

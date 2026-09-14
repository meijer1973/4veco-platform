# GitHub access — 4veco Platform

Start with [AGENTS.md](AGENTS.md), then inspect the files relevant to the task.
Use the [platform map](RESEARCH_AGENT_MAP.md) to locate unfamiliar areas;
use the [lesson map](https://github.com/meijer1973/4veco-lessen/blob/main/RESEARCH_AGENT_MAP.md)
when the question concerns lesson output. Reading both maps is not a prerequisite.

## Access and path reliability

- Repository: [4veco-platform](https://github.com/meijer1973/4veco-platform).
- Raw file prefix: `https://raw.githubusercontent.com/meijer1973/4veco-platform/main/`.
  Substitute the reviewed branch or full commit SHA when investigating a PR.
- For tools that need literal URLs, use the
  [URL index](https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/url-index.md).
- [Current platform files](reports/github-agent-current-platform.md) and
  [current lesson files](reports/github-agent-current-lessen.md) are generated
  lookup snapshots. Confirm the exact path at the intended commit; directories
  are not raw files, and a failed unauthenticated fetch is not proof of absence.
- Prefer local search or authenticated GitHub file/tree access when available.
  On a failed fetch, check repository, ref, spelling and URL encoding before
  reporting a missing source. State access limits explicitly.
- Cross-repository links use GitHub URLs. Local equivalents live in adjacent
  `../4veco-lessen/`; copied lesson runtime files originate in platform.

## Book 2 planning lookup

For this task, use the [canonical outline](references/authored/book-outlines/book-2-outline.md)
and its metadata. `build-scripts/workflows/check-book-outline-currentness.js`
checks structural currentness, then the action-specific check uses `--action`
and exact `--paragraph` or `--chapter` scope. Use `--require-approved` only for approved authority, production, or integration actions. The
[Part A checklist](docs/workflows/part-a-start.md) supplies the combined command.

Part A uses [the textbook plan template](build-scripts/templates/template-textbook-paragraph-plan.md);
use [the companion plan template](build-scripts/templates/template-paragraph-plan.md) only for Part B.
Preview/prerequisite interpretation uses
`build-scripts/workflows/check-blueprint-pedagogical-boundaries.js`.
Other checks and their owners are in the map; this access guide adds no gates.
Exercise-structure validation: `build-scripts/workflows/check-part-a-exercise-authoring-contract.js`.

Historical audit lookup: `Y1-GOLDEN-ROLLOUT-WAVE-1` has a
[sealed checker](build-scripts/sprints/check-y1-golden-rollout-wave-1.js).
See the map for its provenance boundary; the historical capture does not attest
new captures or the current workflow.

## Selected Books 3 and 4

- Book 3: [complete PDFs, chapters and all editable sources](https://github.com/meijer1973/4veco-lessen/blob/codex/import-books34-outlines-20260914/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/README.md); [current outline adoption](references/authored/book-outlines/book-3-outline.meta.json).
- Book 4: [complete PDFs, chapters and all editable sources](https://github.com/meijer1973/4veco-lessen/blob/codex/import-books34-outlines-20260914/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/README.md); [current outline adoption](references/authored/book-outlines/book-4-outline.meta.json).

Current lookup: platform `node build-scripts/references/books34-selected-structure.js 3.3.1`. Validation: `node build-scripts/maintenance/check-books34-chat-import.js --require-paired --require-tracked`. Numeric IDs require revision `book34-chat-v2-20260914`; archive IDs do not transfer target approval. Integration is prepared/in PR.

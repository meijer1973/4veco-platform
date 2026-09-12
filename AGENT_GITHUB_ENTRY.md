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

Part A uses [template-textbook-paragraph-plan.md](build-scripts/templates/template-textbook-paragraph-plan.md);
use [template-paragraph-plan.md](build-scripts/templates/template-paragraph-plan.md) only for Part B.
Preview/prerequisite interpretation uses
`build-scripts/workflows/check-blueprint-pedagogical-boundaries.js`.
Other checks and their owners are in the map; this access guide adds no gates.
Exercise-structure validation: `build-scripts/workflows/check-part-a-exercise-authoring-contract.js`.

# Sprint TASK-CONTEXT-RUNTIME-1: Result

## Plan reference

- Plan: `reports/sprints/TASK-CONTEXT-RUNTIME-1-plan.md`
- Baseline: `reports/sprints/TASK-CONTEXT-RUNTIME-1-baseline.md`
- Plan data: `references/data/sprints/TASK-CONTEXT-RUNTIME-1.plan.json`
- Result data: `references/data/sprints/TASK-CONTEXT-RUNTIME-1.result.json`

## Summary

Implemented shared task-shell runtime support for context-first tasks. The
engine now validates `contextBlocks`, stable `ctx-*` IDs, task `contextRefs`,
required captions/source labels, alt/accessibility metadata, table/figure/graph/
flowchart/formula structures, raw-image and unsafe-SVG rejection, answer-leak
rejection, internal-code rejection, and exit-ticket hint rejection.

The UI now renders context blocks before `.ts-task-list`, shows student-facing
task references back to the context labels, and keeps the rendered surface usable
in desktop, mobile, and dark-mode proof. The review-only lab at
`reports/sprints/TASK-CONTEXT-RUNTIME-1-rendered-lab.html` loads the shared
task-shell runtime and proves deterministic completion.

This sprint proves context placement/runtime behavior only. It does not ingest
exam or textbook sources, reconstruct official assets, change generated lesson
output, adopt product routes, claim target-equivalent proof, or authorize PV,
diagnostics, mastery/sequencing, Scale Gate 1, or student/product use.

## Acceptance test results

Passed commands are recorded in
`reports/sprints/TASK-CONTEXT-RUNTIME-1-command-log.jsonl` and summarized in
`references/data/sprints/TASK-CONTEXT-RUNTIME-1.result.json`.

Key proof commands:

- `node build-scripts/sprints/capture-task-context-runtime1-screenshots.js`
- `node build-scripts/sprints/check-task-context-runtime1.js`
- `npx jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`

Final closure commands are run after this result file exists:

- `node build-scripts/sprints/check-lead-review-substance.js TASK-CONTEXT-RUNTIME-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-CONTEXT-RUNTIME-1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1 --complete`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`

## Changed files

Runtime and tests:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`

Sprint proof and checkers:

- `build-scripts/sprints/task-context-runtime1-fixture.js`
- `build-scripts/sprints/capture-task-context-runtime1-screenshots.js`
- `build-scripts/sprints/check-task-context-runtime1.js`
- `reports/json/task-context-runtime1-proof.json`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-rendered-lab.html`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshot-manifest.md`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshots/`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-*`
- `references/data/sprints/TASK-CONTEXT-RUNTIME-1.plan.json`
- `references/data/sprints/TASK-CONTEXT-RUNTIME-1.result.json`

Roadmaps, maps, and dashboard:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `reports/github-agent-index-platform.*`
- `reports/github-agent-index-lessen.*`
- `reports/internal-dashboard/*`

## Data integrity notes

No protected reference data under `references/machine/` or
`references/external/` changed. No `source-data/` files changed. No generated
Book 1 lesson output changed. The proof JSON records clean boundary evidence
for protected references, source-data, and
`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.

The review fixture carries inherited `sourceAuthority` and
`reconstructed_from_source` metadata from `TASK-CONTEXT-SPEC-1`; this sprint did
not perform actual source ingestion or source reconstruction.

## Open follow-ups

- `CONTEXT-VISUAL-STD-1`: define the unified visual standard for source context
  blocks before actual source reconstruction.
- `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`: perform governed reconstruction only after
  the visual standard closes.
- Later task-ingestion sprints must bind real reconstructed sources to task
  compositions; this runtime proof is not product-route adoption.

## Rollback instructions

Revert the task-shell runtime/test changes, remove the
`TASK-CONTEXT-RUNTIME-1` proof/checker artifacts, restore the roadmap row to
open, and rerun the sprint validators. Do not mutate protected references,
source-data, or generated lesson output as a rollback shortcut.

# Sprint TASK-CONTEXT-RUNTIME-1: Shared Task Context Runtime

## Goal

Implement context rendering in the shared task shell so validated `contextBlocks` appear before the task list, tasks can reference those blocks through stable `contextRefs`, and the runtime can prove captions, alt/accessibility text, mobile/dark rendering, and exit-ticket hint safety without adopting generated lesson output.

## Context

The sprint follows `TASK-CONTEXT-SPEC-1`, which produced the context contract in `reports/json/task-context-spec1-contract.json` and explicitly authorized this runtime sprint as the next step. The product north star requires source-dependent shared tasks to show source context before task-family controls; the companion core specification requires source text, tables, reconstructed figures/graphs/flowcharts, formulas, captions, source labels, alt text, and task references to be inspectable before students answer.

This sprint changes platform runtime code and proof fixtures only. It does not ingest an exam, reconstruct official sources, transform textbook tasks, update target-exercise registries, or publish Book 1 generated output.

## Quality Standard

The quality floor is specification fulfilment for runtime placement and proof: context must render before the task list in actual task-shell output, every task reference must resolve to a stable block, structured blocks must expose captions and accessibility text, and rendered output must stay usable in mobile and dark-mode screenshots. The student-facing surface may show source labels, captions, and friendly reference labels, but not internal IDs, MTU/PV/Scale Gate language, answer leaks, unauthorized hints, or implementation debug text. Closure proof must include unit tests, a sprint checker, a playable lab, screenshot evidence, and a lead-review cycle. Follow-up work is named for source reconstruction, unified visual standards, and generated lesson adoption.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Context blocks render before task-family questions in the shared shell. | `engines/task-shell-ui.js` renders a context region before `.ts-task-list`; checker verifies DOM order. | Playable lab and screenshots show context above tasks on desktop and mobile. | Planned |
| Stable block IDs and task references are enforced. | `engines/task-shell-engine.js` validates `contextBlocks[].id` and task `contextRefs`; tests cover missing, unknown, and unreferenced blocks. | `check-task-context-runtime1.js` verifies valid and negative fixtures. | Planned |
| Captions, source labels, alt text, and accessibility summaries are present for visual/structured blocks. | Runtime render helpers and validation require required metadata for table, SVG figure, graph, flowchart, formula, source excerpt, markdown, and info blocks where applicable. | Checker and screenshots confirm student-facing captions/labels without exposing internal IDs. | Planned |
| Mobile and dark rendering remain legible. | `engines/task-shell.css` adds responsive and dark-mode context styles using the existing shell palette. | Screenshot manifest includes desktop light, mobile light, and mobile dark context states. | Planned |
| Exit-ticket use cannot expose unauthorized task hints through the context runtime. | Engine validation rejects hints for `surfaceKind: "exit_ticket"` fixtures and scans context/task copy for answer leakage. | Tests and checker include an exit-ticket negative fixture. | Planned |
| Runtime proof is playable, not only static text. | Review-only lab renders with shared runtime scripts and includes visible controls that can be completed deterministically. | Capture script records proof JSON and screenshots for initial, interaction, feedback/completed, mobile, and dark states. | Planned |

## Quality Improvement Candidates

- include_now: Export small context-rendering helpers from `TaskShellUI` so later wrappers can reuse the same context region without duplicating markup.
- include_now: Keep context validation backward-compatible for existing task sets without `contextBlocks`.
- defer_named_follow_up: `CONTEXT-VISUAL-STD-1` should define richer graph, figure, and flowchart visual conventions after this placement sprint.
- defer_named_follow_up: A later exam/textbook ingestion sprint should bind real source material to these runtime blocks.
- reject_scope_creep: Do not change generated Book 1 lesson output, source-data CSVs, protected reference data, PV machinery, target-equivalent proof, diagnostics, adaptive routing, or Scale Gate authority.

## Allowed paths

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `build-scripts/sprints/check-task-context-runtime1.js`
- `build-scripts/sprints/capture-task-context-runtime1-screenshots.js`
- `build-scripts/sprints/task-context-runtime1-fixture.js`
- `reports/json/task-context-runtime1-proof.json`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-*`
- `references/data/sprints/TASK-CONTEXT-RUNTIME-1.plan.json`
- `references/data/sprints/TASK-CONTEXT-RUNTIME-1.result.json`
- Roadmap, map, URL-index, and dashboard files updated only as required for closure.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No source-data writes.
- No generated Book 1 lesson output writes under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.
- No actual exam/textbook ingestion, source reconstruction, target-exercise registry writes, candidate storage creation, unit minting, PV mutation, diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1 claims, or student/product use.
- No legacy Module 3 target changes.

## Inputs

- `reports/json/task-context-spec1-contract.json`
- `reports/sprints/TASK-CONTEXT-SPEC-1-result.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- Existing task-shell engine/UI tests.

## Outputs

- Runtime context validation and rendering in the shared task shell.
- Focused unit tests for context validation, rendering order, accessibility metadata, task references, escape/safety, and exit-ticket hint rejection.
- Review-only playable lab at `reports/sprints/TASK-CONTEXT-RUNTIME-1-rendered-lab.html`.
- Screenshot manifest at `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshot-manifest.md`.
- Minimum screenshot PNGs:
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshots/desktop-light-initial.png`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshots/desktop-light-feedback.png`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshots/mobile-light-initial.png`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshots/mobile-dark-initial.png`
- Runtime proof JSON at `reports/json/task-context-runtime1-proof.json`.
- Sprint checker `build-scripts/sprints/check-task-context-runtime1.js`.
- Sprint result at `reports/sprints/TASK-CONTEXT-RUNTIME-1-result.md`.
- Sprint diff summary at `reports/sprints/TASK-CONTEXT-RUNTIME-1-diff-summary.md`.
- Result JSON at `references/data/sprints/TASK-CONTEXT-RUNTIME-1.result.json`.
- Command logs at `reports/sprints/TASK-CONTEXT-RUNTIME-1-command-log.jsonl` and `reports/sprints/TASK-CONTEXT-RUNTIME-1-command-log.md`.
- Lead-review artifacts:
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-lead-review-assignment.md`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-lead-review-round1.md`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-lead-review-corrections.md`
  - `reports/sprints/TASK-CONTEXT-RUNTIME-1-lead-review-round2.md`
- Refreshed roadmap completion rows, maps, URL index, and dashboard files.

## Operationalized sprint procedure

1. Establish the baseline and planning review: validate this plan and bundle, record the planning review, and stop before implementation if the planning reviewer finds missing outputs, weak stop conditions, generated-output ambiguity, or forbidden protected-reference scope.
2. Implement only the shared-shell runtime changes: add context block validation, context rendering before task lists, task reference labels, accessibility metadata handling, CSS for responsive/dark contexts, and backward compatibility for task sets without context.
3. Build the proof fixture and review-only playable lab: render all contract block types, expose visible controls a reviewer can use, and make the lab deterministic enough for screenshot capture and checker assertions.
4. Add tests and checker coverage: include positive and negative fixtures for missing refs, unknown refs, unreferenced blocks, missing alt/accessibility text, raw copied image dependency, unsafe SVG, internal code exposure, answer leakage, and exit-ticket hints; stop if any requirement can only be proven by a claim instead of executable evidence.
5. Capture rendered proof: produce desktop/mobile/dark screenshots and proof JSON for initial context, referenced task controls, feedback/completed state, captions, alt/accessibility metadata, and no visible internal IDs.
6. Run validators and lead-review cycle: run the acceptance tests, assign lead review, record round 1, apply corrections, run round 2, and stop if lead review finds missing proof, weak student-facing rendered output, or scope drift.
7. Close publication state: refresh roadmaps, maps, URL indexes, and dashboard files; run final validators, fetch/prune remote state, commit and push unless a blocker is recorded with exact dirty status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-CONTEXT-RUNTIME-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1
node build-scripts/sprints/capture-task-context-runtime1-screenshots.js
node build-scripts/sprints/check-task-context-runtime1.js
npx jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js TASK-CONTEXT-RUNTIME-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-CONTEXT-RUNTIME-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof must include passing command-log entries for the acceptance tests, `reports/json/task-context-runtime1-proof.json`, the rendered lab, the screenshot manifest, the screenshot files, unit-test coverage, the sprint checker, clean protected-reference and generated-output boundary notes, and lead-review round 1/corrections/round 2 artifacts. The sprint can close only after the result JSON and diff summary point to those artifacts and the complete bundle validator accepts the closure state.

## Rollback plan

If the runtime work fails validation or review, revert only the files changed by this sprint, remove generated proof artifacts for `TASK-CONTEXT-RUNTIME-1`, leave `TASK-CONTEXT-SPEC-1` intact, and record the blocker in the result/diff files if closure is still required. Do not mutate protected references or lesson output as a rollback shortcut.

## Human review required

No human review gate is required for this runtime placement sprint. A lead-review cycle is required before sprint closure. Human review remains a later requirement for generated student-facing adoption or source-ingestion gates.

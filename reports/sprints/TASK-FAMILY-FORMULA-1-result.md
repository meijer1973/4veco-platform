# Sprint TASK-FAMILY-FORMULA-1: Result

Generated: 2026-06-01

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-FORMULA-1-plan.md`

## Summary

`TASK-FAMILY-FORMULA-1` implemented `formula_builder` as the third
constrained construction family in the shared task shell.

Implemented:

- deterministic `formula_builder` family declaration and validation;
- exact response shape `{ tokens: ["tokenId"] }`, including rejection of raw
  arrays and response objects with extra keys;
- token-bank validation with token ids, labels, kinds, formula categories,
  distractor metadata, accepted sequences, canonical sequence inclusion, and
  default no-reuse behavior;
- strict matching that rejects wrong order, missing tokens, extra tokens,
  unknown tokens, duplicate use without `allowReuse`, raw arrays, and extra
  response keys;
- static rendering for a formula-block bank, ordered construction zone, clear
  control, and one feedback region;
- shared UI helpers for formula-builder response collection, token addition,
  removal, and left/right reordering;
- exit-ticket, skilltree, and graph wrapper response collection and
  interaction support;
- focused Jest coverage, rendered report fixture, proof JSON, and custom
  checker.

Lead review round 1 returned REVISE for an exact response-shape blocker.
Round 2 confirmed the blocker was resolved and returned PASS WITH FLAGS.

Carried flags:

- product-route screenshots remain deferred; a later adoption sprint or
  `GATE-TASK-FAMILY-1` must inspect generated route output before
  `formula_builder` is relied on in practice, check, target-equivalent,
  product-proof, or Scale Gate surfaces;
- dynamic after-click remove/reorder controls are source/checker-proven for
  runtime closure and should receive rendered interaction proof before
  generated-route adoption;
- formula equivalence beyond exact token sequences requires domain-reviewed
  evaluator work;
- calculation execution remains a separate calculation-work task.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js` | passed |
| `node build-scripts/sprints/check-task-family-formula1.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-FORMULA-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Runtime and tests:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`

Sprint artifacts:

- `reports/sprints/TASK-FAMILY-FORMULA-1-plan.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-baseline.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-lead-review-round1.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-lead-review-corrections.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-lead-review-round2.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-FORMULA-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-result.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-diff-summary.md`
- `reports/json/task-family-formula1-proof.json`
- `references/data/sprints/TASK-FAMILY-FORMULA-1.plan.json`
- `references/data/sprints/TASK-FAMILY-FORMULA-1.result.json`
- `build-scripts/sprints/check-task-family-formula1.js`

Roadmap and index artifacts are updated during closure.

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, or product-facing route was
changed by this sprint.

The tracked `knowledge/exit-ticket-game-1.1.1.zip` remains reference-only
material and outside this sprint's implementation scope.

No target-equivalent completion claim, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or product-wide use is authorized.

## Open follow-ups

- `TASK-FAMILY-CLOZE-1`: implement typed cloze text.
- `TASK-FAMILY-MULTI-1`: implement multi-select.
- `TASK-FAMILY-ORDER-1`: implement step ordering.
- A later adoption sprint must add generated-route rendered screenshots
  before using `formula_builder` in product routes.
- `GATE-TASK-FAMILY-1` must review rendered output before new task families
  are relied on for reasoning migration, check implementation, first-three
  paragraph product proof, or Scale Gate 1.

## Rollback instructions

Before commit, remove only the `TASK-FAMILY-FORMULA-1` runtime/test changes,
sprint artifacts, checker, proof JSON, fixture, roadmap/index updates, and
generated repository-map/dashboard artifacts from this sprint. After commit,
revert the sprint commit. Do not revert previous sprint records, source data,
generated Book 1 output, protected references, unrelated user work, or tracked
knowledge archives.

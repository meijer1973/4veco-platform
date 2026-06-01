# Sprint TASK-FAMILY-ORDER-1: Result

Generated: 2026-06-01

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`

## Summary

`TASK-FAMILY-ORDER-1` implemented `step_ordering` as a deterministic
structured-choice shared task-shell family.

Implemented:

- deterministic `step_ordering` family declaration and validation;
- explicit answer/distractor step-bank schema;
- required at least two answer steps and at least one distractor step;
- no neutral-step or no-distractor exemption;
- `expected.order` validation that must cover every answer step exactly;
- exact response shape `{ order: ["stepId"] }`, with raw-array,
  array-with-`order`, non-string id, duplicate id, unknown id, missing key, and
  extra-key rejection;
- order-sensitive deterministic matching;
- optional `practice_only` order feedback with first misplaced step, missing
  required steps, selected distractors, and correct prefix;
- rendered step bank plus ordered sequence with add/remove/reorder/clear
  controls and distinct `.ts-step-*` selectors;
- exit-ticket, skilltree, and graph wrapper response collection/click
  delegation through shared `TaskShellUI`;
- focused Jest coverage, rendered report fixture, proof JSON, custom checker,
  and lead-review records.

Planning review round 1 returned REVISE for ambiguous neutral/no-distractor
semantics and proof requirements. The plan was corrected before code.

Lead review round 1 returned REVISE for a real exact-response-shape blocker:
arrays with an `order` property could match. The correction changed the matcher
to require a non-array object and added adversarial Jest/checker coverage.
Round 2 verified the fix and returned PASS WITH FLAGS.

Carried flags:

- generated-route desktop/mobile/dark screenshots are required before
  `step_ordering` adoption in product routes;
- after-click rendered interaction proof is currently report-fixture proof
  only until product-route adoption;
- `GATE-TASK-FAMILY-1` or a later product gate must inspect rendered generated
  output before the family is relied on in reasoning migration, check
  implementation, first-three-paragraph product proof, or Scale Gate 1;
- `step_ordering` proves procedure control only and cannot replace final
  calculation, graph/table, source-chain, or constructed-response proof.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ORDER-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ORDER-1` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js` | passed |
| `node build-scripts/sprints/check-task-family-order1.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-ORDER-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ORDER-1 --complete` | passed |
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

- `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-baseline.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-lead-review-round1.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-lead-review-corrections.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-lead-review-round2.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ORDER-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-result.md`
- `reports/json/task-family-order1-proof.json`
- `references/data/sprints/TASK-FAMILY-ORDER-1.plan.json`
- `references/data/sprints/TASK-FAMILY-ORDER-1.result.json`
- `build-scripts/sprints/check-task-family-order1.js`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, or product-facing route was
changed by this sprint.

No target-equivalent completion claim, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or product-wide use is authorized.

## Open follow-ups

- `TASK-FAMILY-SOURCE-1`: implement source-value and source-chain builders.
- `TASK-FAMILY-MATCH-1`: implement matching pairs.
- `REASON-STD-1`: use `step_ordering` as a shared-shell family when migrating
  reasoning ordering out of private reasoning-engine logic.
- A later adoption sprint must add generated-route rendered screenshots and
  after-click interaction proof before using `step_ordering` in product routes.
- `GATE-TASK-FAMILY-1` must review rendered output before new task families
  are relied on for reasoning migration, check implementation, first-three
  paragraph product proof, or Scale Gate 1.

## Rollback instructions

Before commit, remove only the `TASK-FAMILY-ORDER-1` runtime/test changes,
sprint artifacts, checker, proof JSON, fixture, roadmap/index updates, lesson
roadmap update if present, and generated repository-map/dashboard artifacts
from this sprint. After commit, revert the sprint commit. Do not revert
previous sprint records, source data, generated Book 1 output, protected
references, unrelated user work, or `knowledge/exit-ticket-game-1.1.1.zip`.

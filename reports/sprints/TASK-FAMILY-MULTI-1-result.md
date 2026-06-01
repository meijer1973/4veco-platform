# Sprint TASK-FAMILY-MULTI-1: Result

Generated: 2026-06-01

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-MULTI-1-plan.md`

## Summary

`TASK-FAMILY-MULTI-1` implemented `multi_select` as a deterministic
structured-choice shared task-shell family.

Implemented:

- deterministic `multi_select` family declaration and validation;
- required non-empty `interaction.inputLabel` for the option group;
- exact-set expected values with `mode: "exact_set"`;
- minimum two expected values so single-answer tasks stay in `choice`;
- required distractor option so the task does not become select-everything;
- exact response shape `{ values: ["optionId"] }`, with raw-array and
  extra-key rejection;
- strict string-only response ids, with no numeric or object coercion;
- order-insensitive deterministic set matching;
- optional `practice_only` partial feedback with missing required options,
  selected distractors, and already-correct selections;
- checkbox-like rendered controls using `.ts-multi-option` and
  `data-multi-option-id`, distinct from single-choice `.ts-choice`;
- shared UI helpers for multi-select response collection and independent
  toggle behavior;
- exit-ticket, skilltree, and graph wrapper response collection support;
- focused Jest coverage, rendered report fixture, proof JSON, custom checker,
  and lead-review records.

Lead review round 1 returned REVISE for a real exact-response-shape blocker:
numeric/object selected ids could be coerced into string option ids. The
correction log records the strict string-id fix and regression tests. Round 2
verified the fix and returned PASS WITH FLAGS.

Carried flags:

- generated-route desktop/mobile/dark screenshots are required before
  `multi_select` adoption in product routes;
- after-click rendered interaction proof is required before adoption;
- `GATE-TASK-FAMILY-1` or a later product gate must inspect rendered output
  before target-equivalent or Scale Gate reliance;
- `multi_select` is eligible only when complete-set selection is the reviewed
  student action; it may not replace calculation, graph/table, source-chain,
  or constructed-response proof.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MULTI-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js` | passed |
| `node build-scripts/sprints/check-task-family-multi1.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-MULTI-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed with line-ending warnings only |
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

- `reports/sprints/TASK-FAMILY-MULTI-1-plan.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-baseline.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-lead-review-round1.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-lead-review-corrections.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-lead-review-round2.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-result.md`
- `reports/json/task-family-multi1-proof.json`
- `references/data/sprints/TASK-FAMILY-MULTI-1.plan.json`
- `build-scripts/sprints/check-task-family-multi1.js`

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

- `TASK-FAMILY-ORDER-1`: implement shared step ordering for procedure and
  reasoning sequence tasks.
- `TASK-FAMILY-SOURCE-1`: implement source-value and source-chain builders.
- `TASK-FAMILY-MATCH-1`: implement matching pairs.
- A later adoption sprint must add generated-route rendered screenshots and
  after-click interaction proof before using `multi_select` in product routes.
- `GATE-TASK-FAMILY-1` must review rendered output before new task families
  are relied on for reasoning migration, check implementation,
  first-three-paragraph product proof, or Scale Gate 1.

## Rollback instructions

Before commit, remove only the `TASK-FAMILY-MULTI-1` runtime/test changes,
sprint artifacts, checker, proof JSON, fixture, roadmap/index updates, lesson
roadmap update if present, and generated repository-map/dashboard artifacts
from this sprint. After commit, revert the sprint commit. Do not revert
previous sprint records, source data, generated Book 1 output, protected
references, unrelated user work, or `knowledge/exit-ticket-game-1.1.1.zip`.

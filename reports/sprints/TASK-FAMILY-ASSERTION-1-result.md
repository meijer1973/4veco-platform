# Sprint TASK-FAMILY-ASSERTION-1: Result

Generated: 2026-06-02

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`

Baseline: `reports/sprints/TASK-FAMILY-ASSERTION-1-baseline.md`

Planning review: `reports/sprints/TASK-FAMILY-ASSERTION-1-planning-review.md`

## Summary

`TASK-FAMILY-ASSERTION-1` implemented `assertion_reason` as a deterministic
shared task-shell family for sparse reviewed assertion/reason relation
judgement.

Implemented:

- first-class `assertion_reason` family declaration;
- required assertion label/text, reason label/text, and relation option label;
- minimum four relation options with accessible descriptions;
- duplicate relation-option id rejection;
- exact expected relation id from the option bank;
- exact response shape `{ value: optionId }`;
- rejection of missing value, empty value, wrong relation, raw string, raw
  array, array-with-value, nested object value, non-string value, unknown id,
  alternate response key, and extra top-level keys;
- neutral `practice_only` feedback that reports selected relation and expected
  relation without diagnostics or mastery language;
- rendered assertion/reason cards, relation option group, selected-state
  summary, focus selectors, narrow/mobile layout, and dark-mode fixture proof;
- shared `TaskShellUI` collection/click helpers;
- exit-ticket, skilltree, and graph wrapper response collection/click support;
- focused Jest coverage, proof JSON, rendered report fixture, custom checker,
  and structural lead-review records.

No source exercise data, generated Book 1 lesson output, product-route
adoption, target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use was
authorized.

The tracked old exit-ticket prototype remains unchanged:
`knowledge/exit-ticket-game-1.1.1.zip`.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1` | passed |
| `npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js` | passed |
| `node build-scripts/sprints/check-task-family-assertion1.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-ASSERTION-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1 --complete` | passed |
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

- `reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-baseline.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round1.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-corrections.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round2.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-result.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-diff-summary.md`
- `reports/json/task-family-assertion1-proof.json`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.result.json`
- `build-scripts/sprints/check-task-family-assertion1.js`

Roadmaps and generated indexes:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL index, and dashboard/index artifacts refreshed
  by the closure commands.

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

## Lead Review State

Structural lead review completed:

- assignment: `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-assignment.md`
- round 1: PASS WITH FLAGS, recorded in
  `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round1.md`
- correction log: no blocking corrections required, recorded in
  `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-corrections.md`
- round 2: PASS WITH FLAGS, recorded in
  `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round2.md`

## Carried Flags

- Runtime proof is report-fixture proof only. Generated-route screenshots are
  required before product-route adoption.
- `assertion_reason` may support sparse reviewed practice/advisory
  assertion-reason relation tasks, but does not authorize target-equivalent
  proof, constructed-response substitution, reasoning migration reliance,
  check implementation reliance, diagnostics, mastery, sequencing, PV, Scale
  Gate 1, or product-wide use.
- Feedback may distinguish selected and expected relation status, but may not
  become diagnostic, misconception-profile, mastery, sequencing, or
  target-equivalent output.
- `assertion_reason` may not become generic quiz variety, default
  reasoning-game format, constructed-response replacement, or target-equivalent
  proof.

## Open follow-ups

- `GATE-TASK-FAMILY-1`: review structured choice and construction task
  families before product-route reliance.
- Later adoption sprints must add generated-route rendered proof before
  `assertion_reason` is used in product routes.
- Product-proof sprints must still preserve constructed response and
  target-equivalent standards.

## Rollback instructions

Revert the `TASK-FAMILY-ASSERTION-1` commit to remove the runtime family,
wrapper support, tests, checker, and sprint artifacts. No generated lesson
output, source exercise data, protected reference data, candidate storage, or
old exit-ticket archive state needs rollback because none was changed.

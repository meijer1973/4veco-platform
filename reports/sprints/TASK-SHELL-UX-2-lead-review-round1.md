# Lead Review Summary
Sprint: `TASK-SHELL-UX-2`
Round: lead review round 1

## Scope
Reviewed the `TASK-SHELL-UX-2` implementation for shared task-shell UX hardening: unit/notation fields, hint policy, exit-ticket scaffolding, feedback/focus behavior, rendered proof, tests, generated-output provenance, and governance boundaries.

Evidence inspected: `reports/sprints/TASK-SHELL-UX-2-lead-review-assignment.md`, `reports/sprints/TASK-SHELL-UX-2-plan.md`, `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`, `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`, `reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json`, `reports/json/task-shell-ux2-proof.json`, `build-scripts/sprints/check-task-shell-ux2.js`, `engines/task-shell-ui.js`, `engines/exit-ticket-ui.js`, `source-data/book-1/exit-ticket/1.1.2.json`, and generated Book 1 output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`.

## Review Plan
| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Implementation review | Lead-review agent | Unit/notation, hidden criteria, feedback, wrappers | passed with blocker |
| Rendered-output review | Lead-review agent | Screenshots and generated Book 1 output | revise |
| Focused tests | Jest/custom checker | 108 acceptance, unit/notation, no hints, wrappers | passed but incomplete |
| Boundary review | Scope/git checks | No protected refs, registry writes, candidate storage, 1.1.3 source | passed |

Ran or inspected:

```bash
node build-scripts/sprints/check-task-shell-ux2.js
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js engines/tests/reasoning-ui.test.js
node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2
npm.cmd run check:scope-language
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-SHELL-UX-2-plan.md
node build-scripts/reports/validate-report-json.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
git diff --check
git -C ../4veco-lessen diff --check
```

## Consolidated Verdict
Verdict: REVISE

The implementation is technically close and most tests pass, but the rendered `1.1.2` exit ticket still exposes answer-revealing placeholders before attempt. That violates the sprint intent and exit-ticket standard. The test/checker stack currently misses this, so correction must include both UI behavior and guards.

## Blocking Findings
Blocking findings exist.

1. Answer-revealing placeholders are visible in the target-equivalent exit ticket.

Evidence: `reports/sprints/TASK-SHELL-UX-2-screenshots/desktop-light-112-exit-ticket-unit-fields.png` and `reports/sprints/TASK-SHELL-UX-2-screenshots/mobile-dark-112-exit-ticket-task-shell.png`.

Examples visible before attempt:

- Task 1 final answer placeholder: `Bijvoorbeeld 15`, which is the correct answer.
- Task 2 final answer placeholder: `Bijvoorbeeld 108`, which is the correct answer.
- Task 3 final answer placeholder: `Bijvoorbeeld 3,7`, which is the correct answer.
- Task 4 fields include examples such as `Bijvoorbeeld 4 indexpunten`, `Bijvoorbeeld 108`, and `Bijvoorbeeld 3,7%`.

Required correction:

- In exit-ticket rendering mode, suppress or neutralize answer/content placeholders for task-shell fields.
- Preserve source criteria/placeholders if needed for validation/review, but do not render answer-like examples in the target-equivalent exit-ticket UI.
- Add tests/checker rules that fail if rendered `1.1.2` exit-ticket HTML contains these answer examples before attempt.

2. The machine-readable screenshot manifest has empty `proof` objects.

Evidence: `reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json` records six screenshot cases, but each has `"proof": {}`.

Required correction:

- Repair screenshot capture/proof generation or record a separate machine-readable DOM proof.
- Extend `check-task-shell-ux2.js` to fail if required rendered-proof fields are empty.

## Specialist Findings
Implementation quality:

- Unit/notation matching is correctly added to `calculation_work_capture`.
- `108` with correct work and blank optional notation passes.
- `108` with `indexcijfer` passes.
- `108` with `%` rejects.
- Wrapper response collection was updated in exit-ticket, skilltree, and graph UIs.
- Feedback regions are labelled/focusable, and exit-ticket feedback now receives focus.

Governance:

- No protected reference changes found.
- No target-exercise registry write found.
- No candidate storage exists.
- `1.1.3` exit-ticket source remains absent.
- Scope-language check passed.

## Test Evidence
Passed:

```text
TASK-SHELL-UX-2 check passed
7 focused Jest suites passed, 56 tests passed
OK sprint bundle: TASK-SHELL-UX-2 planned/active
OK scope-language check: active surfaces
OK sprint plan
OK report JSON contract
check:platform exited 0, 42 passed suites, 622 passed tests
BOOK HEALTH CHECK PASSED: 26/26 checks passed
git diff --check passed for platform and lesson repo
```

But the tests do not yet catch answer-revealing exit-ticket placeholders, so the green stack is insufficient for closure.

## Learning Quality Evidence
The unit/notation split is a real learning-quality improvement: it makes number and notation explicit without forcing students to mix them in one box.

However, the exit-ticket placeholder issue weakens target-equivalent proof. An exit ticket cannot give the final answer as placeholder text and still claim same-level proof. This is not a polish issue; it changes what is being tested.

## Student Experience Evidence
Screenshots show:

- separate notation fields in desktop and mobile;
- no visible criteria bullets;
- dark mode remains readable;
- graph/math/reasoning surfaces visibly use the shared task shell.

But the student experience is currently too scaffolded in the exit ticket because answer examples appear in empty fields. Students can infer the answers before attempting the tasks.

## Ownership and Handoff
Owner: main implementation agent.

Required corrections before round 2:

- Update exit-ticket task-shell display mode to suppress answer/content placeholders.
- Add focused UI tests and checker coverage for no answer-revealing placeholders.
- Refresh generated Book 1 output through deploy only.
- Refresh screenshots/proof JSON/manifest.
- Fix or supplement machine-readable rendered DOM proof.
- Re-run focused Jest, custom checker, scope-language, book check, and diff checks.

## Required Next Action
Return to implementation. Do not close `TASK-SHELL-UX-2` yet. After correcting the exit-ticket placeholder leak and rendered-proof manifest gap, produce `TASK-SHELL-UX-2-lead-review-corrections.md`, refresh evidence, and run lead review round 2.

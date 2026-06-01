# Sprint TASK-SHELL-UX-2: Result

Generated: 2026-06-01

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-SHELL-UX-2-plan.md`

## Summary

`TASK-SHELL-UX-2` closed as a bounded implementation and generated-output
proof sprint for shared task-shell UX hardening.

The sprint implemented:

- separate optional/required `unitNotation` support for
  `calculation_work_capture`;
- rendered unit/notation fields for calculation-work tasks;
- wrapper response collection for exit ticket, skilltree/math, and graph
  surfaces;
- hidden/collapsible task-shell hints for practice surfaces;
- controlled labelled feedback regions and next-action feedback markup;
- exit-ticket rendering that suppresses pre-attempt criteria and
  answer-revealing placeholder examples while preserving source criteria for
  validation/review;
- focused tests, a deterministic sprint checker, and screenshot proof across
  exit ticket, math, graph, reasoning, mobile, and dark-mode states.

The round-1 lead review returned REVISE because the first rendered proof still
leaked answer examples in exit-ticket placeholders and the screenshot manifest
proof objects were empty. Corrections neutralized exit-ticket placeholders,
added tests/checker guards, regenerated Book 1 output through deploy, and
refreshed screenshot proof. Round-2 lead review returned PASS WITH FLAGS.

No target-equivalent authority was broadened. `1.1.1` remains advisory,
`1.1.3` target-equivalent exit-ticket source remains absent, and no
diagnostics, adaptive routing, mastery/sequencing, summative use, PV, Scale
Gate 1, or product-wide use is authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-SHELL-UX-2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js engines/tests/reasoning-ui.test.js` | passed |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/capture-task-shell-ux2-screenshots.js` | passed |
| `node build-scripts/sprints/check-task-shell-ux2.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-SHELL-UX-2-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform implementation:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused tests under `engines/tests/`
- `source-data/book-1/exit-ticket/1.1.2.json`

Sprint artifacts:

- `reports/sprints/TASK-SHELL-UX-2-plan.md`
- `reports/sprints/TASK-SHELL-UX-2-baseline.md`
- `reports/sprints/TASK-SHELL-UX-2-planning-review.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`
- `reports/sprints/TASK-SHELL-UX-2-screenshots/`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-assignment.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-round1.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-corrections.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-round2.md`
- `reports/sprints/TASK-SHELL-UX-2-result.md`
- `reports/sprints/TASK-SHELL-UX-2-diff-summary.md`
- `reports/json/task-shell-ux2-proof.json`
- `references/data/sprints/TASK-SHELL-UX-2.plan.json`
- `references/data/sprints/TASK-SHELL-UX-2.result.json`
- `build-scripts/sprints/capture-task-shell-ux2-screenshots.js`
- `build-scripts/sprints/check-task-shell-ux2.js`
- roadmap/status/map/index/dashboard refreshes

Generated lesson output:

- shared runtime and data files under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No target-exercise registry fields were written. No answer-skill candidate
storage was created or written. No `source-data/book-1/exit-ticket/1.1.3.json`
was created. No reasoning CSV content was changed. No unit minting, unit
update, unit split, or unit deprecation was executed.

Generated Book 1 output was regenerated through `node scripts/deploy.js`.
No generated lesson output was hand-edited.

`knowledge/exit-ticket-game-1.1.1.zip` is unrelated untracked user/generated
input and was not touched or staged.

## Open follow-ups

- `GAME-ROUTE-AFFORDANCE-1`: proceed next to make non-exit practice route
  items actionable.
- `REASON-STD-1`: continue broader reasoning-family standardization; this
  sprint does not make reasoning fully unified.
- `CHECK-SHORT-EXIT-2`: preserve the source-versus-render boundary so future
  exit tickets may keep review criteria in source without leaking answer
  scaffolds to students.
- Future evidence tooling should make screenshot manifest proof fields record
  inspected DOM facts more directly.
- `SCALE-PROOF-3P`, `GATE-PRODUCT-3P`, and Scale Gate 1 remain blocked until
  their Product Proof Track prerequisites close or receive explicit human
  waiver with consequences.

## Rollback instructions

Before commit, revert only the `TASK-SHELL-UX-2` implementation files, tests,
source-data interaction changes, sprint artifacts, checker/capture scripts,
screenshot proof, roadmap/status updates, generated repository maps, and
generated Book 1 shared-output files from this sprint. After commit, revert the
sprint commits in both platform and lesson repos. Do not revert prior sprint
records, user work, protected references, or unrelated untracked files.

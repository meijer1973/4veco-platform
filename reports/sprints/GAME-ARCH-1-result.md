# Sprint GAME-ARCH-1: Result

Generated: 2026-05-31

Status: completed PASS after lead-review round 2.

## Plan reference

- Plan: `reports/sprints/GAME-ARCH-1-plan.md`
- Baseline: `reports/sprints/GAME-ARCH-1-baseline.md`
- Plan metadata: `references/data/sprints/GAME-ARCH-1.plan.json`
- Result metadata: `references/data/sprints/GAME-ARCH-1.result.json`

## Summary

GAME-ARCH-1 completed the practice-engine build-vs-rebuild decision as a
no-generated-output architecture sprint.

Decision:

- keep and harden the shared skill-map / route layer;
- keep the shared task-type shell as core architecture;
- keep/refactor graph/table practice as the reference pattern;
- refactor math/calculation around target-exercise operation chains;
- refactor reasoning around answer-form and constructed-response standards;
- keep the short check as an advisory local checkpoint;
- keep the target-equivalent exit ticket separate as a later thorough proof
  task;
- rebuild or remove duplicate engine-specific UI/state/feedback paths only
  through later governed work when they cannot consume the shared route and
  task shell cleanly.

The sprint adds `GAME-ARCH-2` as the required integrated practice-engine
architecture plan before `GATE-ENGINE-1`.

No generated lesson output, protected reference mutation, target-exercise field
writes, source-data writes, candidate storage, target-equivalent completion
claims, diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-ARCH-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-1` | passed |
| `node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-game-arch1-evidence.js` | passed |
| `npm.cmd run check:platform` | passed with existing fixture warnings |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/GAME-ARCH-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-1 --complete` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |
| Lead-review planning review | passed |
| Lead-review round 1 | REVISE, corrected |
| Lead-review round 2 recheck 1 | REVISE, corrected |
| Lead-review round 2 final | passed |
| Protected-surface diff check for protected references and exit-ticket source data | passed |

## Changed files

Platform sprint evidence and validation:

- `reports/sprints/GAME-ARCH-1-*`
- `references/data/sprints/GAME-ARCH-1.plan.json`
- `references/data/sprints/GAME-ARCH-1.result.json`
- `build-scripts/sprints/check-game-arch1-evidence.js`

Roadmaps and indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.25-graph-ux2-task-shell-integration.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated GitHub-facing maps, URL index, and internal dashboard outputs

Specifications:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

Lesson-side archive:

- `../4veco-lessen/archive/sprints/GAME-ARCH-1/*`

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`,
and `references/data/exam-ingestion/answer-skill-candidates.json` remain
unchanged.

No `source-data/book-*/exit-ticket/*.json` file was created or written. No
target-exercise `question_type` or `answer_form` fields were written. No unit
minting, unit updates, unit splits, or unit deprecations were executed.

Generated Book 1 lesson output was not regenerated or hand-edited by this
sprint. Existing generated output was inspected as read-only evidence.

## Open follow-ups

- `GAME-ARCH-2`: produce the integrated practice-engine architecture plan with
  file-level keep/wrap/deprecate/rebuild decisions, shared route/task-shell
  ownership, state ownership, short-check advice rules, and target-operation
  coverage requirements.
- `GATE-ENGINE-1`: inspect live rendered output and explicitly decide
  keep/refactor/rebuild/hold before engine scale.
- `L1.7B-Q2` and `GATE-L1.7B-Q2`: own target-equivalent exit-ticket
  implementation and local paragraph-completion language.
- `REV-STD-1` and Scale Gate 1 remain blocked until the named engine and
  exit-ticket proof gates close or are explicitly waived with consequences.

## Rollback instructions

Revert the GAME-ARCH-1 sprint records, evidence checker, product specification
clarifications, roadmap/version-index changes, result metadata, lesson archive
records, and generated maps/indexes produced for this sprint.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.

# Sprint SYNC-PRODUCT-1: Result

Generated: 2026-06-01

Status: completed roadmap/specification alignment; PASS.

## Plan reference

- Plan: `reports/sprints/SYNC-PRODUCT-1-plan.md`
- Baseline: `reports/sprints/SYNC-PRODUCT-1-baseline.md`
- Plan metadata: `references/data/sprints/SYNC-PRODUCT-1.plan.json`
- Result metadata: `references/data/sprints/SYNC-PRODUCT-1.result.json`

## Summary

`SYNC-PRODUCT-1` aligned the platform and lesson roadmaps, plus the stable
product specifications, around the Product Proof Track before Scale Gate 1.
The track now makes explicit that the first three paragraphs must become a
coherent student-visible product before scale:

- every paragraph eventually needs both an advisory short check and a separate
  target-equivalent exit ticket;
- short checks may provide hidden/clickable hints, repair feedback, and local
  route advice;
- exit tickets remain same-level proof tasks and must not become hint-heavy
  learning exercises;
- shared task-type UI is the default for overlapping calculation, graph/table,
  reasoning, and checkpoint actions;
- non-exit route items need direct actions or explicit fallbacks;
- the skill map is a student-facing route/product surface;
- dual coding is a task-quality decision;
- `GATE-PRODUCT-3P` must inspect rendered student paths before Scale Gate 1.

No generated lesson output, engine implementation, source exit-ticket data,
protected reference mutation, target-exercise registry writes, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or product-wide use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-PRODUCT-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SYNC-PRODUCT-1` | passed |
| `node build-scripts/sprints/check-sync-product1-evidence.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/SYNC-PRODUCT-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SYNC-PRODUCT-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

- Updated `references/reference-team-roadmap.md` to version
  `v3.39-sync-product1-product-proof-track`, added Product Proof Track rows,
  and changed the immediate next action to `CHECK-SHORT-EXIT-1` plus
  `STANDARD-EXERCISES-1`.
- Updated `../4veco-lessen/lessen-team-roadmap.md` with the same Product Proof
  Track, Scale Gate 1 blockers, and stale near-term text repairs.
- Updated `../4veco-lessen/specifications/product-end-state.md` to make
  both-check coverage, actionable routes, skill-map product role, hint policy,
  dual-coding task decisions, and three-paragraph proof explicit.
- Updated `../4veco-lessen/specifications/companion-core-specifications.md`
  with the matching companion-surface contract.
- Updated `docs/roadmaps/roadmap-version-index.json` and
  `docs/roadmaps/roadmap-version-index.md` to point at v3.39.
- Added `build-scripts/sprints/check-sync-product1-evidence.js`.
- Added `SYNC-PRODUCT-1` plan, baseline, planning review, lead-review
  assignment, round-1 report, correction log, round-2 report, result, diff
  summary, and result metadata.
- Refreshed repository maps, URL index, and dashboard artifacts for off-site
  reviewers.

## Data integrity notes

No protected reference data changed. This sprint did not edit:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-1/exit-ticket/`;
- `source-data/book-1/reasoning/`;
- `engines/`;
- generated Book 1 lesson output.

No candidate storage was created or written. No target-exercise `question_type`
or `answer_form` fields were written. No machine reference mutation,
external-source mutation, unit mutation, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or product-wide use was authorized.

The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remains present
and excluded from this sprint.

## Open follow-ups

| Follow-up | Owner |
|---|---|
| Run `CHECK-SHORT-EXIT-1` to audit short-check and target-equivalent exit-ticket status for `1.1.1`-`1.1.3`. | next Product Proof Track sprint |
| Run `STANDARD-EXERCISES-1` to audit graph/math/reasoning/exit-ticket/guided-practice/procedure task families against the shared standard. | next Product Proof Track sprint |
| Complete the remaining Product Proof Track through `GATE-PRODUCT-3P` before any Scale Gate 1 attempt, unless a human waiver records consequences. | platform and lesson roadmap owners |
| Complete `REV-STD-1` before Scale Gate 1 or explicitly waive it with consequences. | review-standard owner |

## Rollback instructions

If this sprint needs rollback, revert only the SYNC-PRODUCT-1 roadmap/spec,
checker, sprint-artifact, result-metadata, version-index, repository-map,
URL-index, and dashboard changes in the platform and lesson repos.

Do not revert unrelated user work, previous sprint records, protected
references, generated lesson output from prior sprints, target-exercise
records, candidate-storage state, or the unrelated untracked
`knowledge/exit-ticket-game-1.1.1.zip`.

## Required next action

Commit and push the platform and lesson evidence. Then proceed first to
`CHECK-SHORT-EXIT-1` and `STANDARD-EXERCISES-1` as audit/contract sprints.
Do not start implementation, CHECK-SHORT-EXIT-2, SCALE-PROOF-3P,
GATE-PRODUCT-3P, or Scale Gate 1 from this sprint alone.

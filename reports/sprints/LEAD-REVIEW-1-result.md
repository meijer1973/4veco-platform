# Sprint LEAD-REVIEW-1: Result

Generated: 2026-05-31

Status: completed after lead-review round-2 recheck.

## Plan reference

Plan: `reports/sprints/LEAD-REVIEW-1-plan.md`

## Summary

LEAD-REVIEW-1 repaired the sprint lead-review process after recent non-MTU,
non-human-gated sprints closed without structural lead-review artifacts.

The sprint updated `check-sprint-bundle.js` so new sprints created on or after
2026-05-31 must either require lead review or record an explicit exemption.
Future human-review sprints must also set `lead_review_phase:
before_human_gate`, so lead review happens before the human interview starts.

The lead-reviewer agent then ran actual round-1 audits for `SPEC-ET-1`,
`EX-LESSON-1`, `GAME-UX-3A`, `ENGINE-OP-1`, and `SKILLMAP-OP-1`. It returned
PASS WITH FLAGS for the first four and REVISE for SKILLMAP-OP-1 until focused
student-experience and accessibility reviews existed. Those specialist reviews
were run by the relevant review agents and both returned PASS WITH FLAGS.
Round-2 lead review then accepted all five sprint bundles as PASS WITH FLAGS.

MTU-H4A/H4B/H4C were not re-reviewed because the user explicitly stated the MTU
sprints already have human gate artifacts and do not need retroactive lead
review. The repair records that future human gates still need lead review
before the human review starts.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/LEAD-REVIEW-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-1` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1 --complete` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1 --complete` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A --complete` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1 --complete` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1 --complete` | passed |
| Negative policy fixture: future human-review sprint without `lead_review_phase: "before_human_gate"` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-1 --complete` | passed after round-2 lead-review file and final verdict metadata were added |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| Protected reference diff check | passed |
| Generated Book-output diff check under `../4veco-lessen/Boek*` | passed |
| `git diff --check` | passed |
| `git -C ..\4veco-lessen diff --check` | passed |

## Changed files

- `build-scripts/sprints/check-sprint-bundle.js`
- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `reports/sprints/LEAD-REVIEW-1-*`
- lead-review assignment, round-1, correction, and round-2 files for
  `SPEC-ET-1`, `EX-LESSON-1`, `GAME-UX-3A`, `ENGINE-OP-1`, and
  `SKILLMAP-OP-1`
- focused SKILLMAP specialist review reports
- result metadata for the five repaired sprints
- roadmap and roadmap-version index files
- generated repository maps and URL indexes after final refresh

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain unchanged.

No generated lesson output under `../4veco-lessen/Boek *` changed. This sprint
changed process, sprint evidence, roadmap, and metadata only. It authorizes no
diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative
use, PV projection, PV machine promotion, Scale Gate 1, or student/product use.

## Negative Policy Proof

A temporary `TEST-LEAD-1` sprint fixture was created with `created:
"2026-05-31"`, `human_review_required: true`, `lead_review_required: true`,
and no `lead_review_phase`. Running
`node build-scripts/sprints/check-sprint-bundle.js TEST-LEAD-1` failed with
the expected message:

```text
human-review sprints must set lead_review_phase: "before_human_gate"
```

The temporary fixture files were removed after the test.

## Open follow-ups

- Future human-review gates must include lead-review evidence before human
  interview starts.
- GRAPH-UX-2 should carry SKILLMAP-OP-1 accepted flags: clearer mixed-mode
  labels, graph mobile route orientation, friendlier boundary/progress language,
  component-local focus-visible styling, and dark-mode route screenshots before
  product-scale reliance.
- A later validator hardening sprint may add semantic lint for lead-review
  report contents, beyond presence and metadata checks.

## Rollback instructions

If LEAD-REVIEW-1 must be reverted, revert the checker patch, AGENTS
clarification, LEAD-REVIEW-1 records, retroactive lead-review files, specialist
review files, result metadata updates, roadmap/index updates, and generated
maps. Do not edit protected references, generated lesson output, target-exercise
mappings, answer-skill candidate storage, or MTU gate closures as part of
rollback.

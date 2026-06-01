# Sprint GATE-L1.7B-Q2: Result

Generated: 2026-06-01

Status: completed PASS WITH FLAGS after human review.

## Plan reference

- Plan: `reports/sprints/GATE-L1.7B-Q2-plan.md`
- Baseline: `reports/sprints/GATE-L1.7B-Q2-baseline.md`
- Plan metadata: `references/data/sprints/GATE-L1.7B-Q2.plan.json`
- Result metadata: `references/data/sprints/GATE-L1.7B-Q2.result.json`

## Summary

GATE-L1.7B-Q2 completed the target-equivalent proof review for the implemented
`1.1.2 Percentages en indexcijfers` exit-ticket candidate.

The human reviewer inspected the committed evidence and generated lesson
output, then closed the gate as PASS WITH FLAGS. The review accepted:

- evidence baseline;
- complete `1.1.2` operation-chain coverage;
- calculation-work criteria;
- D31 index-points-versus-percent criteria;
- deterministic matching for this exact local proof;
- student-facing UI and feedback;
- advisory `1.1.1` short-check separation;
- no core-specification failure.

The gate approves only a later exact implementation packet for reviewed
`1.1.2` local non-summative completion copy:

```text
Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.
```

No source-data mutation, generated-output mutation, engine implementation,
completion-language enablement, protected reference mutation, target-exercise
field writes, candidate storage, candidate writes, projection refresh,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, CP-6/Year-1
reliance, or product-wide use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-L1.7B-Q2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GATE-L1.7B-Q2` | passed |
| `node build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js` | passed |
| `node build-scripts/sprints/check-l1-7b-q2-implementation.js` | passed |
| `node build-scripts/sprints/check-bundle-urls.js GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/GATE-L1.7B-Q2-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GATE-L1.7B-Q2 --complete` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

- GATE-L1.7B-Q2 human-interview and closure records.
- GATE-L1.7B-Q2 result and diff-summary records.
- GATE-L1.7B-Q2 checker updated to validate closed-gate records.
- Platform roadmap updated to close the gate and open `L1.7B-Q2-COPY`.
- Lesson roadmap updated to mirror the closed gate and next exact copy sprint.
- Repository maps, URL index, and internal dashboard refreshed.

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`,
and `references/data/exam-ingestion/answer-skill-candidates.json` remain
unchanged.

No `source-data/book-*/exit-ticket/*.json` file was written by this gate
closure. No generated Book 1 lesson output was regenerated or hand-edited. No
target-exercise `question_type` or `answer_form` fields were written. No unit
minting, updates, splits, or deprecations were executed.

The lesson roadmap changed only to mirror the platform gate status and next
authorized sprint; it is not generated lesson output.

`npm.cmd run check:platform` passed with pre-existing fixture-quality warning
output from non-Book-1 test fixtures; no new blocker was introduced by this
gate closure.

## Open follow-ups

- `L1.7B-Q2-COPY`: exact reviewed `1.1.2` completion-copy enablement packet.
- Broader deterministic/symbolic/rubric matching proof remains required
  before general constructed-response use.
- `1.1.1` target-equivalent status remains unapproved.
- `1.1.3` graph/table target-equivalent status remains unapproved.
- Scale Gate 1 remains blocked.

## Rollback instructions

Revert the GATE-L1.7B-Q2 closure artifacts, result metadata, roadmap/status
updates, and generated maps/indexes produced for this closure.

Do not revert the closed `L1.7B-Q2` implementation, hand-edit generated lesson
output, mutate source exit-ticket data, protected references, target-exercise
mappings, or answer-skill candidate storage as part of rollback.

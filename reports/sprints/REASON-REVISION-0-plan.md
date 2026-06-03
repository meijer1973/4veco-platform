# Sprint REASON-REVISION-0: Reasoning Gate Comment Resolution And Revision Routing

## Goal

Resolve the direct human review comments on `GATE-REASON-STD-1` and route the
outcome honestly: the old gate can remain useful as local shared-shell evidence,
but reasoning-game adoption/replacement readiness is treated as `REVISE`.

## Context

The human feedback found that the review lab did not give enough task context,
especially the water-scarcity case, and that the current tasks cannot replace
the reasoning game. A second reviewer accepted the packet only as local practice
evidence with flags. This sprint reconciles those positions before repair work.

## Quality Standard

Quality floor: the sprint must not dilute the specification into a paperwork
pass. It must state the reviewed evidence, the specification boundary, the
rendered output evidence needed to prove follow-up fulfilment, the human gate
that will judge student-facing quality, higher-quality improvements included
now, and omitted requirements as named follow-up work.

The student-facing specification remains `../4veco-lessen/specifications/product-end-state.md`
and `../4veco-lessen/specifications/companion-core-specifications.md`. Rendered
output and playable proof are required before any future adoption claim.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Human review comments must be resolved before closure. | Comment-resolution log with both verdict interpretations. | New gate must cite the log. | planned |
| Flags must block only the claim they name. | Local evidence accepted with flags; adoption/replacement set to revise. | Roadmaps and gate packet preserve this split. | planned |
| No product authority from this sprint. | Authority flags remain false. | Sprint result and JSON deny product use. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add a comment-resolution log for the old gate. | include_now | It prevents a false pass from being inferred. |
| Close the old gate as product-route ready. | reject_scope_creep | Human feedback explicitly rejects adoption/replacement readiness. |
| Route all open reasoning flags to named follow-up sprints. | defer_named_follow_up | This sprint records the route; later sprints produce proof. |

## Allowed paths

- `reports/sprints/REASON-REVISION-0-*`
- `references/data/sprints/REASON-REVISION-0.*.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Forbidden paths

- `references/machine/`
- `references/external/`
- generated lesson output
- source reasoning CSV files
- engine implementation
- target-exercise registry, candidate storage, diagnostics, mastery, sequencing,
  Scale Gate 1, or product-use authority

## Inputs

- prior `GATE-REASON-STD-1` evidence bundle
- human review comments supplied on 2026-06-03
- `reports/sprints/GATE-REASON-STD-1-lead-review-playable-proof-recheck.md`
- `reports/sprints/REASON-ANSWERFORM-2-result.md`

## Outputs

- `reports/sprints/REASON-REVISION-0-human-comment-resolution.md`
- `reports/sprints/REASON-REVISION-0-result.md`
- `references/data/sprints/REASON-REVISION-0.plan.json`
- `references/data/sprints/REASON-REVISION-0.result.json`
- roadmap rows for the revision sprint series

## Operationalized sprint procedure

1. Read the old gate evidence and human review comments; identify which claims
   are accepted and which are revised.
2. Write the comment-resolution log with the split verdict: local evidence
   accepted with flags; adoption/replacement readiness revised.
3. Insert the revision sprint series into both roadmaps without authorizing
   product use or implementation beyond the named repair/evidence work.
4. Run validators and stop if any artifact claims product-route adoption,
   target-equivalent reasoning proof, diagnostics, mastery, sequencing, Scale
   Gate 1, or student/product use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-REVISION-0-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-REVISION-0
node build-scripts/review-gates/check-gate-reason-revision1-review-packet.js
node build-scripts/reports/validate-report-json.js
```

## Proof Required to Close

This sprint may close only when the comment-resolution log exists, both
roadmaps name the revision track, no product authority is broadened, and the
final revision gate checker can see the comment-resolution evidence. Closure
proof must include validator/test evidence from the sprint-plan checker,
sprint-bundle checker, scope-language checks, and the later gate-evidence
checker that cites the rendered-output revision gate.

## Rollback plan

Revert only this sprint's roadmap and report files. Do not revert earlier
GATE-REASON-STD-1 evidence or generated lesson output.

## Human review required

No separate human review is required for this routing sprint. Its output feeds
`GATE-REASON-REVISION-1`, where the human reviewer comments directly on the
new evidence packet.

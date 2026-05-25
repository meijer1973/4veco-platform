# GATE-EX5 Operation And Answer-Skill Contract Gate Closure

Status: `pass_with_conditions`

Closed on: 2026-05-25

Closure scope: design-contract review only.

## Summary

GATE-EX5 closes as `pass_with_conditions`. The gate accepts the EX-5
operation/answer-skill/q19 extraction contract as adequate for later bounded
validator/CLI planning.

Allowed next sprint: `EX-6 Validator And CLI Implementation Planning`.

EX-6 may design candidate schemas, validators, dry-run CLIs, mutation-log and
rollback formats, q19 extraction overlay validation, and non-persistent
test-only dry-run fixtures if explicitly scoped that way. EX-6 may not create
persistent candidate records, execute q19 extraction, mutate protected or
machine references, mutate lesson output, or authorize student/product use.

## Accepted Outcomes

- Future operation candidates, answer-skill candidates, and source-annex
  extraction overlays remain overlay-first under `references/data/exam-ingestion/`.
- Operation-candidate fields are sufficient for later validator/CLI planning.
- Answer-skill fields are sufficient to keep q3 and q15 correction-model answer
  needs visible.
- q19 extraction fields are sufficient as a precondition for any later
  extraction execution.
- Validator/CLI preconditions are sufficient for a later implementation-planning
  sprint.
- GATE-EX4 routing facts are preserved:
  - q3 `A61` support with `A15` rejected;
  - q19 `A42`/`D10` support with `A45` weak;
  - q19 source-annex and graph-object gaps remain blocking;
  - q3/q15 answer-skill needs remain visible.

## Final Routing Table

| Requirement | Review classification | Notes |
|---|---|---|
| `q3-calc-1` | operation design candidate | `A61` supports table-value selection only; `A15` remains rejected for this task. No candidate write. |
| `q3-answer-1` | answer-skill candidate | Threshold conclusion with unit and direction must remain visible. No answer-skill write. |
| `q19-source-annex-gap` | blocking extraction prerequisite | Blocks full reconstruction, accepted mapping, graph/PV route execution, lesson handoff, PV projection, and student-facing output. |
| `q19-graph-object-gap` | blocking extraction prerequisite | Blocks graph/PV route execution, chained-reasoning execution, lesson handoff, PV projection, and student-facing output. |
| `q19-graph-op-1` | held graph/PV route | Carry `A42` and `D10` as candidates; keep `A45` weak support only. |
| `q19-reason-1` | provisional operation candidate, blocked | `D10` and `D13` partially support the reasoning; q19 source/graph gaps still block execution. |
| `q15-answer-1` | answer-skill candidate | `D27`, `F03`, and `F09` cover content only. |
| GATE-EX5 authority | design-contract review only | No mutation, no q19 extraction execution, no lesson output, no CP-6/Year-1 closure, and no student/product use. |

## Conditions

1. No candidate writes from GATE-EX5.
2. q19 cannot move to graph/PV execution, chained-reasoning operation execution,
   lesson handoff, PV projection, or student-facing output while
   `q19-source-annex-gap` and `q19-graph-object-gap` remain unresolved.
3. The next sprint should test schemas and validators against dry-run fixtures
   before any persistent candidate-storage path exists.
4. Validators must reject `A15` as q3 annual-threshold support and `A45` as the
   primary q19 graph-shift support.
5. q3 threshold wording and q15 two-step correction-model explanation must
   remain visible downstream as answer-skill needs.
6. Product boundaries remain false.

## Blocked Outcomes

- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- hand edits to `references/external/`;
- hand edits to `references/machine/`;
- unit minting;
- operation-registry mutation;
- answer-skill mutation;
- q19 source-annex extraction execution;
- q19 graph-object extraction execution;
- PV/graph mutation;
- target-exercise promotion;
- lesson-output mutation;
- CP-6 closure;
- Year-1 closure;
- student diagnostics;
- adaptive routing;
- mastery decisions;
- automatic sequencing;
- student-facing AI;
- summative use;
- PV projection;
- PV machine promotion;
- student-facing output.

## Explicit Human Confirmation

The human reviewer supplied a complete answer set and confirmed closure as
`PASS WITH CONDITIONS - design-contract review only` on 2026-05-25.

## Next Operational Step

Start `EX-6 Validator And CLI Implementation Planning` as a bounded planning
sprint. Do not execute candidate writes, q19 extraction execution, lesson
handoff, PV projection, or product use from GATE-EX5.

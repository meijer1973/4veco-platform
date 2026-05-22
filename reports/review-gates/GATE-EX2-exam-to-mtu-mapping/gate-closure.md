# GATE-EX2 Exam-to-MTU Mapping Gate Closure

Status: `pass_with_conditions`

Closed on: 2026-05-22

Closure scope: classification and routing only.

## Summary

GATE-EX2 closes as `pass_with_conditions`. The gate accepts reviewed
classification and routing evidence for the three EX-1 pilot exam items, but it
does not authorize mutation.

Allowed next sprint: `EX-3 Exam Coverage Dashboard`.

EX-3 may record dashboard/reporting views for the reviewed EX-2
classifications, q3 `A61` support correction, q19 `A42` graph-shift correction,
q19 blocking source/graph status, and q3/q15 answer-skill needs.

## Final Classification Table

| Requirement | Review classification | Notes |
|---|---|---|
| `q3-calc-1` | `operation_registry_need` | `A15` is stale/incorrect for this task; add `A61` as source-reading support for table-value selection. |
| `q3-answer-1` | `answer_skill_need` | Threshold conclusion with unit and direction must be modeled explicitly. |
| `q19-source-annex-gap` | blocking `source_annex_gap` | Blocks full reconstruction, accepted MTU mapping, lesson handoff, and closure. |
| `q19-graph-object-gap` | blocking `graph_object_gap` | Blocks graph/PV work and lesson handoff. |
| `q19-graph-op-1` | provisional `existing_mtu_but_procedure_too_weak` plus `pv_graph_need` | Add `A42`; keep `D10` support; downgrade `A45` to weak prerequisite/support. |
| `q19-reason-1` | provisional `operation_registry_need` | `D10` and `D13` partially support the chained reasoning; q19 remains blocked by source/graph gaps. |
| `q15-content` | `existing_mtu` | `D27`, `F03`, and `F09` are sufficient for content coverage only. |
| `q15-answer-1` | `answer_skill_need` | Two-step correction-model explanation must be modeled explicitly. |
| EX-2 authority | routing only | No mutation, no lesson output, no CP-6/Year-1 closure, and no student/product use. |

## Accepted Outcomes

- EX-2 may close as a classification and routing gate.
- Reviewed classifications may be used as EX-3 dashboard/reporting inputs.
- q3 may proceed to later lesson-design coordination with visible
  `operation_registry_need` and `answer_skill_need` gaps.
- q15 may proceed to later lesson-design coordination with visible
  `answer_skill_need` gap.
- q19 may only retain provisional routing notes until source/graph
  reconstruction improves or a later human gate explicitly accepts a visible
  limitation.

## Conditions

1. q3 source-reading support must be corrected from stale `A15` to `A61`;
   `q3-calc-1` remains `operation_registry_need`.
2. q3 threshold-conclusion wording remains `answer_skill_need`.
3. q19 graph-operation candidates must include `A42` and `D10`; `A45` is weak
   prerequisite/support only.
4. q19 remains blocked by `q19-source-annex-gap` and `q19-graph-object-gap`.
5. q15 content maps to `D27`, `F03`, and `F09` only for content coverage; the
   correction-model explanation remains `answer_skill_need`.
6. q3 and q15 may proceed only to planning/dry-run lesson coordination with
   visible gaps.
7. EX-3 is reporting/dashboard work only unless a later explicit gate changes
   scope.
8. EX-4 may be planned later as governed mutation planning, but EX-2 itself
   does not authorize mutation.

## Blocked Outcomes

- protected reference mutation;
- external-source mutation;
- hand edits to `references/external/`;
- hand edits to `references/machine/`;
- unit minting;
- operation-registry mutation;
- answer-skill mutation;
- target-exercise promotion;
- placeholder finalization;
- lesson-output mutation;
- CP-6 closure;
- Year-1 closure;
- diagnostics;
- adaptive routing;
- mastery decisions;
- automatic sequencing;
- student-facing AI;
- summative use;
- PV projection;
- PV machine promotion;
- student-facing output.

## Explicit Human Confirmation

The human reviewer confirmed closure as `PASS WITH CONDITIONS - routing only`
on 2026-05-22.

## Next Operational Step

Start `EX-3 Exam Coverage Dashboard` as a bounded reporting sprint. EX-3 should
record the reviewed EX-2 classifications and keep q19 blocking gaps and q3/q15
answer-skill gaps visible downstream.

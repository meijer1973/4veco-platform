# GATE-R5 Alignment Graph Gate Closure

Sprint: R5.3
Gate: GATE-R5-alignment-graph
Closed: 2026-04-27
Status: `pass_with_conditions`

## Decision

The alignment graph may proceed for internal dashboard/reporting use and internal retrieval development/evaluation.

The gate does not approve the whole draft graph as pedagogically authoritative. It approves only named edge groups and governance rules recorded in `gate-closure.json`.

## Approval Scope

```json
{
  "status": "pass_with_conditions",
  "graph_approval_scope": "named_edge_groups_only",
  "whole_graph_authority": false
}
```

## Approved Uses

- internal dashboard
- reference health reports
- graph inspection tools
- internal retrieval development
- retrieval evaluation
- teacher-facing/internal research assistance when clearly marked non-authoritative

## Blocked Uses

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions

## Required Graph Policy

Only named approved edges may be marked `approved`.

All other draft edges must remain one of:

- `pending_review`
- `diagnostic_only`
- `rejected`
- `deprecated_design_issue`
- `approved_with_conditions` when the gate record names the condition

Generated-report and exam-gap edges are diagnostic only and cannot be primary evidence or curriculum authority.

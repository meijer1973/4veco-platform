# EX-4 CLI Readiness Plan

Generated: 2026-05-22

Status: disabled pending human authorization.

Execution authorized: no.

## Preconditions Before Any Mutation

- GATE-EX4 must close with explicit human authorization for a named bounded
  lane.
- The target storage surface must be named and must preserve source-of-truth
  boundaries.
- A CLI or governed script must exist for the target mutation surface before any
  protected or registry write.
- A validator must reject unauthorized mutation flags, hidden q19 gaps, hidden
  q3/q15 answer-skill gaps, and student/product-use authorization.
- Mutation logs and rollback instructions must be drafted before execution.
- q19 graph/PV or reasoning mutation must stay blocked until source-annex and
  graph-object extraction gaps are resolved or explicitly accepted by a later
  human gate.

## Current CLI Readiness

| Surface | Ready |
|---|---:|
| MTU `unit-add.js` exists | true |
| Operation-registry CLI exists | false |
| Answer-skill registry CLI exists | false |
| q19 source-annex extraction validator exists | false |
| PV/graph mutation CLI exists | false |
| Lesson-output mutation allowed | false |

## Lane Readiness

| Lane | Current execution state | Allowed next if gate passes |
|---|---|---|
| EX4-L1 q3 operation | blocked pending gate and CLI | operation/answer-skill registry contract or governed operation-overlay design |
| EX4-L2 q3 answer skill | blocked pending gate and CLI | answer-skill policy and storage design |
| EX4-L3 q19 extraction | blocked pending gate and extraction validator | bounded source-annex/graph-object extraction sprint |
| EX4-L4 q19 graph/PV | blocked by q19 gaps | hold until source/graph extraction improves |
| EX4-L5 q19 reasoning | blocked by q19 gaps | hold until source/graph extraction improves |
| EX4-L6 q15 answer skill | blocked pending gate and CLI | answer-skill policy and storage design |

## Forbidden Execution

- Do not run `unit-add.js` from EX-4.
- Do not create `references/machine/exercise-operations.json`.
- Do not create `references/machine/answer-skills.json`.
- Do not mutate `references/data/skill-operation-registry.json`.
- Do not mutate `references/external/`.
- Do not hand-edit `references/machine/`.
- Do not mutate lesson output.
- Do not authorize student/product use.

# Sprint MTU-H2D: Solo q1-q3 Held And Conditional Lane Resolution

Date: 2026-05-28

Status: planned after MTU-H2C reduced clean-lane execution.

## Goal

Prepare a focused resolution packet for the Solo q1-q3 lanes that MTU-H2C did
not execute: `A12`, `A20`, `A88`, `A89`, `A90`, `A92`, and `A93`. The sprint
must decide whether each lane is revised, held, split, deferred, or prepared
for a later bounded execution gate.

## Context

MTU-H2C minted the reduced clean set: `F19`, `F20`, `A85`, `A86`, `A87`, and
`A91`. The remaining lanes were deliberately excluded because GATE-MTU-H2B
identified unresolved execution risks.

Binding unresolved points:

- `A12` update spec must retain `A2.11` or a later gate must explicitly
  authorize removing that exam-code link.
- `A20` cannot be silently narrowed because target exercise `4.1.2` uses the
  live unit in a given-MK context.
- `A88`, `A89`, `A90`, and `A93` carry dependency-quality concerns.
- `A92` depends on `A89`, so it cannot execute until the `A89` route is
  accepted, revised, or replaced.

## Quality Standard

The specification for this sprint is the MTU-H2C result plus the unresolved
conditions from GATE-MTU-H2B. The quality floor is that each held or conditional
lane receives an explicit reviewable disposition. The packet must prevent
silent semantic narrowing, over-triggered prerequisites, hidden
OR-dependencies, and dependency chains that contradict the official Solo q1-q3
correction-model operations. There is no rendered output for MTU-H2D, and no
student-facing surface is authorized; proof is the resolution packet,
lane-disposition evidence, follow-up routing, and validation logs.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `A12` exam-code regression resolved | Revised update spec or hold decision | Proof that `A2.11` remains unless human gate authorizes removal | planned |
| `A20` active given-MK usage protected | Split/deprecate/replacement route or hold decision | Affected mapping plan for target exercise `4.1.2` and generator impact | planned |
| Conditional dependencies classified | Review table for `A88`, `A89`, `A90`, `A93` | fix now / execute later / hold / route to H3/H4 | planned |
| `A92` dependency resolved | Accept/add `A89`, revise `A92`, or hold `A92` | Explicit non-circular dependency route | planned |
| Execution boundary preserved | Packet states no execution authority | No CLI execution, no candidate storage, no lesson output | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Revise `A12` to keep `exam_codes: [A2.11, A2.10, A2.12]` | `include_now` | The resolution packet should decide this route immediately because `A12` blocks clean derivative-MO execution. |
| Split `A20` into broad legacy and derived-MK successor | `defer_named_follow_up` | Likely needs its own reviewed split/replacement packet with affected mappings. |
| Treat `A89` as prerequisite for `A92` only after dependency review | `defer_named_follow_up` | Prevents hidden `A92` execution with missing dependency. |
| Execute remaining lanes without review | `reject_scope_creep` | GATE-MTU-H2B and MTU-H2C explicitly held these lanes. |

## Allowed paths

- `reports/sprints/MTU-H2D-plan.md`
- `references/data/sprints/MTU-H2D.plan.json`
- future MTU-H2D packet/review artifacts under `reports/mtu-hardening/` and
  `reports/review-gates/` if prepared.

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- candidate-storage creation
- candidate writes
- lesson-output mutation
- target-exercise promotion
- CP-6 or Year-1 closure
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Inputs

- `reports/sprints/MTU-H2C-result.md`
- `reports/sprints/MTU-H2C-diff-summary.md`
- GATE-MTU-H2B closure records
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.json`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`

## Outputs

- a reviewable resolution packet for held/conditional lanes;
- no registry mutation unless a later gate explicitly authorizes execution;
- no generated lesson output.

## Operationalized sprint procedure

1. Re-read GATE-MTU-H2B closure, MTU-H2C result, and the H2A/H2B packet specs.
2. Audit live `A12` and propose a corrected derivative-MO update route that
   retains `A2.11`, or hold the lane with rationale.
3. Audit current `A20` uses and draft a split/deprecate/replacement route that
   protects target exercise `4.1.2` and generator behavior.
4. Classify `A88`, `A89`, `A90`, and `A93` as revise-now, execute-later, hold,
   or route to MTU-H3/MTU-H4.
5. Resolve the `A92`/`A89` dependency by accepting `A89`, revising `A92`, or
   holding `A92`.
6. Produce a packet with exact proposed specs only if a later execution gate is
   plausible.
7. Stop before CLI execution unless a later human gate names exact commands,
   rollback, audit, validation, and execution authority.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2D-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2D
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js
git diff --check
```

## Proof Required to Close

Proof required to close must include a lane-disposition table for `A12`, `A20`,
`A88`, `A89`, `A90`, `A92`, and `A93`, plus review notes, validator/test
evidence, and explicit evidence that no held lane was executed and no product
boundary was crossed.

## Rollback plan

No execution is planned. If MTU-H2D accidentally mutates protected reference
data, stop immediately and revert before preparing any dependent gate packet.

## Human review required

Human review is required before any later execution gate. MTU-H2D itself is a
planning/resolution sprint and does not authorize mutation.

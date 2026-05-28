# GATE-MTU-H2G Gate Closure

Date: 2026-05-28

Status: PASS WITH CONDITIONS for A20 split/replacement planning only.

Reviewed remote commit:
`f925da5ed7521c3052c60668599c5a97d99aaf7a`

The reviewed packet JSON still said
`must_commit_and_push_this_packet_before_human_review`; this closure records
that the remote publication prerequisite was satisfied by the reviewed commit
above.

## Closure Decision

GATE-MTU-H2G closes as PASS WITH CONDITIONS for planning only.

Accepted:

- The usage audit is sufficient: `3.2.2` is price-taker/given-MO plus
  derived-MK; `3.3.3` is derived-MO plus derived-MK; `4.1.2` is given constant
  MK; `GEN.A20` currently practises given MO and given MK-function solving.
- `A20` may be narrowed/renamed to the full derived-MO plus derived-MK route
  in a later packet, but only if affected mappings and `GEN.A20` behavior are
  handled.
- `A94` or equivalent should be planned for price-taker/given-MO plus
  derived-MK cases.
- `A95` or equivalent should be planned for given MK-function cases.
- `4.1.2` should move from `A20` to `A91` for its given constant-MK
  equality-solving step.
- MTU-H3 incidence/pass-through may proceed if `A20` remains explicitly
  tracked separately.

## Conditions

1. Add `A2.11` to the proposed `A20` exam codes.
2. Rename `A20` with clearer wording; avoid `afgeleide MO` ambiguity.
3. Add an explicit price-taker `MO = P` step to `A94`.
4. Decide whether `GEN.A20` is rewritten for narrowed `A20`, moved to `A95`,
   or blocked.
5. Later mapping changes for `3.2.2`, `3.3.3`, and `4.1.2` must be handled as
   authored-reference updates with exact before/after diffs.
6. Generated projections may refresh only after authorized unit/mapping
   mutations.
7. No mutation, unit minting, target-exercise write, generator change, PV
   projection, lesson output, or student/product use is authorized by this
   gate.

## Authorized Next

Authorize only `MTU-H2H — A20/A94/A95 CLI-Mutation Planning Packet`.

MTU-H2H may prepare a non-mutating planning packet with corrected `A20`,
`A94`, and `A95` specs, exact affected-mapping diffs, `GEN.A20` route,
rollback, validation, and no-exposure proof. It may not execute mutation.

## Not Authorized

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split/deprecation
execution, target-exercise mutation, candidate writes, lesson-output mutation,
target-exercise promotion, CP-6/Year-1 closure, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, or student/product use is authorized.

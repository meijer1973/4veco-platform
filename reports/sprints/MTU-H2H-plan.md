# Sprint MTU-H2H: A20/A94/A95 CLI-Mutation Planning Packet

Date: 2026-05-28

Status: planned after GATE-MTU-H2G closure.

## Goal

Prepare a non-mutating CLI-mutation planning packet for the `A20`, `A94`, and
`A95` route accepted by GATE-MTU-H2G. The packet must translate the gate
conditions into exact unit specs, affected target-exercise mapping diffs,
generator handling, rollback, validation, and no-exposure proof before any
later execution packet is considered.

## Context

GATE-MTU-H2G closed as PASS WITH CONDITIONS for planning only. It accepted the
conceptual split:

```text
A20 = derived MO + derived MK
A91 = given constant/value MK
A94 = price-taker / given MO + derived MK
A95 = given MK-function
```

The gate did not authorize mutation. It requires `A2.11` to stay visible on the
narrowed `A20`, a clearer A20 name, an explicit `MO = P` price-taker step in
`A94`, exact authored mapping diffs for `3.2.2`, `3.3.3`, and `4.1.2`, and a
decision for `GEN.A20`.

## Quality Standard

The quality floor is an execution-ready planning packet, not execution. The
specification must be concrete enough that a reviewer can see every proposed
unit field, mapping before/after value, generator consequence, rollback route,
rendered output boundary, student-facing exposure block, proof requirement,
and follow-up. Any uncertainty must become a named hold or review question.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Correct A20 route | A20 update spec includes `A2.11`, `A12`/`A13`/`A02`, and clear non-ambiguous name | Reviewer can confirm A20 only represents derived-MO plus derived-MK | planned |
| Price-taker route | A94 spec includes explicit `MO = P` step and avoids A12 over-trigger | Reviewer can map `3.2.2` without derivative MO | planned |
| Given MK-function route | A95 spec is distinct from A91 given constant/value MK | Reviewer can decide whether current `GEN.A20` behavior moves to A95 | planned |
| Authored mapping diffs | Exact before/after arrays for `3.2.2`, `3.3.3`, and `4.1.2` | Reviewer can approve or revise mapping mutation plan | planned |
| Generator behavior | `GEN.A20` route is named as rewrite, move, or block | No stale student-facing skill-tree exposure | planned |
| No mutation | Keep `references/machine/`, `references/external/`, and authored target exercises unchanged | Diff and validators prove packet-only work | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Include exact before/after target-exercise arrays | `include_now` | Mapping ambiguity is the main execution risk. |
| Add a unit-add dry-run wrapper | `defer_named_follow_up` | Useful, but this sprint is planning-only and can expose the dry-run limitation. |
| Execute A20/A94/A95 mutation directly | `reject_scope_creep` | GATE-MTU-H2G authorized planning only. |

## Allowed paths

- `reports/mtu-hardening/*a20*`
- `reports/review-gates/GATE-MTU-H2H-*`
- `reports/sprints/MTU-H2H-*`
- `references/data/sprints/MTU-H2H.*.json`
- `build-scripts/references/check-mtu-h2h-*.js`
- roadmap/index updates

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation of `A20`, `A94`, or `A95`
- target-exercise mapping writes
- generator implementation changes
- candidate-storage creation or candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H2G-a20-split-replacement/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-a20-split-replacement-packet.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating A20/A94/A95 CLI-mutation planning packet.
- A GATE-MTU-H2H review packet if the planning packet is evidence-complete.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, and
  no student-facing output.

## Operationalized sprint procedure

1. Verify the post-GATE-MTU-H2G baseline: `A20` and `A91` exist, `A94` and
   `A95` are absent, and target exercises still carry their pre-mutation
   mappings.
2. Draft corrected specs: A20 with `A2.11` and clear name, A94 with explicit
   price-taker `MO = P`, and A95 for given MK-function cases.
3. Draft exact mapping before/after tables for `3.2.2`, `3.3.3`, and `4.1.2`.
   Stop if the mapping update would imply target-exercise promotion or full
   price-discrimination validation.
4. Record generator handling for `GEN.A20`: rewrite, move to A95/equivalent,
   or block exposure. Stop if generator exposure can become stale.
5. Write the planning packet and review packet with command/rollback
   expectations, validation requirements, stop conditions, and no-mutation
   authority boundaries.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, run pattern analysis, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   mutation is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2H-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2H
node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js
node build-scripts/references/check-mtu-h2g-a20-split-packet.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Proof Required to Close

Proof required to close must include the corrected specs, exact mapping diffs,
generator route, validator output, sprint bundle proof, and a clear next
action: human review, revised packet, or deliberate hold.

## Rollback plan

MTU-H2H should not mutate protected reference data or authored target-exercise
records. If the packet is rejected, revise or remove the H2H packet, checker,
review packet, sprint logs, and roadmap/index updates only. Any later mutation
must have its own rollback path through reviewed commands and exact
before/after diffs.

## Human review required

A human review is required before any `A20` update, `A94`/`A95` minting,
target-exercise mapping update, generator change, generated projection refresh,
or student-facing exposure. If the H2H packet is not evidence-complete, stop
and revise it instead of opening a gate.

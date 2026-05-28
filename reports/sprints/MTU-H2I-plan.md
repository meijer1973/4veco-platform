# Sprint MTU-H2I: A20/A94/A95 CLI Execution Packet

Date: 2026-05-28

Status: planned after GATE-MTU-H2H closure.

## Goal

Prepare a non-mutating execution packet for the `A20`, `A94`, and `A95`
route accepted by GATE-MTU-H2H. The packet must be concrete enough for a later
human gate to decide whether a bounded execution sprint may run exact
reference CLI commands, exact authored target-exercise mapping updates, and
the coupled generator blocking/move route.

## Context

GATE-MTU-H2H closed as PASS WITH CONDITIONS for execution-packet preparation
only. It accepted the operation split:

```text
A20 = derived MO + derived MK
A94 = price-taker / MO = P + derived MK
A91 = given constant/value MK
A95 = given MK-function
```

The gate did not authorize mutation. It requires that A20 narrowing, A94/A95
minting, target-exercise mapping updates, and generator handling be reviewed
as one coupled execution route or explicitly blocked with non-exposure proof.

## Quality Standard

The quality floor is a reviewable execution packet, not execution. The
specification must name every command, every unit field, every authored mapping
before/after value, every generator consequence, the rendered output boundary,
student-facing exposure blocks, rollback, validation, proof requirements, and
follow-up. Any uncertainty must become a stop condition or review question,
not an implied permission.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exact A20 command | A20 unit-update spec retains `A2.11`, uses needs `A12`/`A13`/`A02`, and requires dry-run | Reviewer can prove A20 no longer means generic `MO = MK` | planned |
| Exact A94/A95 unit-add commands | Full JSON specs for A94 and A95 plus unit-add dry-run limitation disclosure | Reviewer can approve minting without hidden derivative or given-MK over-trigger | planned |
| Authored mapping patch | Exact before/after arrays for `3.2.2`, `3.3.3`, and `4.1.2` | Reviewer can confirm no target-exercise promotion and no stale A20 citation | planned |
| Generator route | Move current `GEN.A20` behavior to `GEN.A95` and block `GEN.A20` until a narrowed generator exists, unless reviewer chooses rewrite | No stale student-facing A20 interaction after narrowing | planned |
| Projection boundaries | Generated reports refresh only after authorized unit/mapping/generator source mutations | No PV projection, PV machine promotion, or lesson output | planned |
| No mutation | Keep `references/machine/`, `references/external/`, authored target exercises, and generator code unchanged during H2I | Diff and validators prove packet-only work | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Include exact generator route rather than vague generator follow-up | `include_now` | A20 cannot be safely narrowed while current `GEN.A20` remains interactive. |
| Add a dedicated authored-target-exercise CLI | `defer_named_follow_up` | Useful, but H2H accepted exact before/after authored patches as the next packet standard. |
| Execute A20/A94/A95 directly from this packet sprint | `reject_scope_creep` | H2H authorized execution-packet preparation only. |

## Allowed paths

- `reports/mtu-hardening/*a20*execution*`
- `reports/review-gates/GATE-MTU-H2I-*`
- `reports/sprints/MTU-H2I-*`
- `references/data/sprints/MTU-H2I.*.json`
- `build-scripts/references/build-mtu-h2i-*.js`
- `build-scripts/references/check-mtu-h2i-*.js`
- roadmap/index updates

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation of `A20`, `A94`, or `A95`
- authored target-exercise mapping writes
- generator implementation changes
- generated projection refreshes based on unexecuted mutations
- candidate-storage creation or candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H2H-a20-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating A20/A94/A95 execution packet.
- A GATE-MTU-H2I review packet if the execution packet is evidence-complete.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, no
  generator change, and no student-facing output.

## Operationalized sprint procedure

1. Verify the post-H2H baseline: `A20`, `A91`, `A12`, `A13`, and `A02` exist;
   `A94` and `A95` are absent; `GEN.A20` exists; target exercises still carry
   the pre-mutation mapping arrays.
2. Build the execution packet from the reviewed H2H specs. Stop if `A20`
   loses `A2.11`, `A94` loses the price-taker `MO = P` step, or `A95` becomes
   indistinguishable from `A91`.
3. Add exact mapping before/after values for `3.2.2`, `3.3.3`, and `4.1.2`.
   Stop if the mapping update would imply target-exercise promotion or full
   price-discrimination validation.
4. Name the coupled generator route. For the safe default, current
   `GEN.A20` behavior moves to `GEN.A95`; `GEN.A20` is blocked until a
   narrowed derive-both generator exists; `A94` remains generator-blocked
   unless a generator is separately implemented.
5. Write the review packet with calibration questions, planned questions,
   stop conditions, rollback, validation, projection boundaries, and no
   mutation/product authority.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, run pattern analysis, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   mutation is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2I-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2I
node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js
node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Proof Required to Close

Proof required to close must include exact command specs, exact mapping diffs,
generator route, validator output, sprint bundle proof, remote-before-review
publication, and a clear next action: human review, revised packet, or
deliberate hold.

## Rollback plan

MTU-H2I should not mutate protected reference data, authored target-exercise
records, or generator code. If the packet is rejected, revise or remove the
H2I packet, checker, review packet, sprint logs, and roadmap/index updates
only. Any later execution sprint must carry its own rollback path for
`references/machine/`, `references/authored/course-target-exercises.json`,
`engines/skilltree/generators.js`, generator-readiness reports, and generated
projection reports.

## Human review required

A human review is required before any `A20` update, `A94`/`A95` minting,
target-exercise mapping update, generator change, generated projection
refresh, or student-facing exposure. If the H2I packet is not
evidence-complete, stop and revise it instead of opening a gate.

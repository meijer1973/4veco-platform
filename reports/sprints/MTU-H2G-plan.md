# Sprint MTU-H2G: A20 Split And Affected-Mapping Packet

Date: 2026-05-28

Status: planned after MTU-H2F conditional execution.

## Goal

Prepare a non-mutating packet for the held `A20` lane so the platform can
decide whether the current broad `A20` should be split, deprecated, or replaced
without stale mappings. The sprint must classify active `A20` uses, especially
target exercise `4.1.2`, and produce an affected-mapping and generator-impact
plan before any CLI mutation is considered.

## Context

MTU-H2F executed the conditional H2E lanes and kept `A20` held. `A91` now
covers `MO = gegeven MK oplossen`, while current `A20` still has active
given-MK usage in target exercise `4.1.2`. Narrowing `A20` directly would make
that mapping misleading. This sprint is therefore a packet/planning sprint, not
an execution sprint.

## Quality Standard

The quality floor is that the packet makes the specification decision explicit:
which current `A20` uses need derived-MK semantics, which need given-MK
semantics, which are generic or stale, and which generator behavior would
change. The sprint produces proof, not rendered output. It must preserve
student-facing and product boundaries, record every follow-up rather than hide
it, and stop before mutation unless a later human gate authorizes exact CLI
commands, rollback, validation, and affected-mapping updates.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Active A20 usage audit | Search target exercises, reports, and generator references for `A20` | Classification table with derived-MK/given-MK/generic/stale labels | planned |
| A91 interaction | Prove `A91` now covers the given-MK route | Affected mappings identify whether `A20` can move to `A91` | planned |
| A20 semantic route | Draft split/deprecate/replacement options | Reviewer can choose update, split, deprecate, or hold | planned |
| Generator impact | Inspect `GEN_A20` and downstream skill-tree exposure | Packet records generator reuse/update/blocking path | planned |
| No mutation | Keep `references/machine/` unchanged | Validation and diff proof show no protected mutation | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Build a compact A20 usage audit table | `include_now` | The held blocker is mapping ambiguity, not CLI mechanics. |
| Add a generic unit-split dry-run wrapper | `defer_named_follow_up` | Useful for future mutation hygiene, but the first need is evidence and route selection. |
| Execute A20 split in this sprint | `reject_scope_creep` | MTU-H2G must prepare a packet/gate before mutation. |

## Allowed paths

- `reports/mtu-hardening/*A20*`
- `reports/review-gates/GATE-MTU-H2G-*`
- `reports/sprints/MTU-H2G-*`
- `references/data/sprints/MTU-H2G.*.json`
- `build-scripts/references/check-mtu-h2g-*.js`
- roadmap/index updates

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation of `A20`
- target-exercise promotion
- candidate-storage creation or candidate writes
- lesson-output mutation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `reports/sprints/MTU-H2F-result.md`
- GATE-MTU-H2E closure record

## Outputs

- A non-mutating A20 split/replacement and affected-mapping packet.
- A GATE-MTU-H2G review packet if the evidence is adequate.
- Sprint result and diff logs.
- No protected reference mutation and no student-facing output.

## Operationalized sprint procedure

1. Verify the post-H2F baseline: `A91` exists, `A20` exists, and `A20` remains
   unchanged since H2F.
2. Search active target exercises, reports, generated JSON, and generator code
   for `A20` references.
3. Classify each active use as derived-MK required, given-MK required,
   generic/ambiguous, stale, or generator-impact-only.
4. Draft route options: keep `A20`, update `A20`, split `A20`, deprecate
   `A20`, migrate mappings to `A91`, or hold.
5. Write the packet with exact affected mappings, generator impact, rollback
   expectations, stop conditions, and no-mutation authority boundaries.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, run pattern analysis, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   mutation is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2G-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2G
node build-scripts/references/check-mtu-h2g-a20-split-packet.js
node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js
node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Proof Required to Close

Proof required to close must include the A20 usage audit, route decision
packet, generator-impact notes, validator output, sprint bundle proof, and a
clear next action: human review, revised packet, or deliberate hold.

## Rollback plan

MTU-H2G should not mutate protected reference data. If the packet is rejected,
revise or remove the H2G packet/checker/result artifacts only. Any later A20
mutation must have its own rollback path through reviewed CLI commands.

## Human review required

A human review is required before any A20 mutation, split, deprecation,
affected-mapping update, generator behavior change, target-exercise promotion,
or student-facing use. If the H2G packet is not evidence-complete, stop and
revise the packet instead of opening a gate.

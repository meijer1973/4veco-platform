# Sprint MTU-H2E: Solo q1-q3 Conditional Lane Execution Packet

Date: 2026-05-28

Status: completed; GATE-MTU-H2E review packet ready after remote push.

## Goal

Prepare a bounded, non-mutating execution packet for the H2D-accepted
conditional lanes: `A12`, `A88`, `A89`, `A90`, `A92`, and `A93`. Keep `A20`
out of scope except as a referenced held lane that requires a separate
split/deprecate/replacement and affected-mapping packet.

## Context

GATE-MTU-H2D closed as PASS WITH CONDITIONS for held/conditional lane routing
only. It accepted revised routes for `A12`, `A88`, `A89`, `A90`, `A92`, and
`A93`, corrected the generator inventory, and kept `A20` held. It authorized no
CLI mutation.

Binding conditions:

- `A12` must retain `A2.11`.
- `A20` remains held for a separate packet.
- `A88` and `A89` need explicit zero-needs review rationale.
- `GEN_A12` and `GEN_A20` exist as `GEN.A12` and `GEN.A20`; any semantic
  change requires impact review.
- `GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and `GEN_A93` are not
  implemented in the current baseline and must be implemented, explicitly
  generator-blocked/not-yet-interactive, or proven not exposed to the
  skill-tree route before student-facing use.
- Any human-review packet produced by this sprint must be committed and pushed
  with all cited evidence before the review starts.

## Quality Standard

The execution packet must be exact enough for a later human gate to decide
whether CLI execution is safe, while still authorizing no mutation itself. The
specification must be schema-valid, command paths explicit, rollback clear,
generator status honest, and no student/product boundary may be crossed. The
quality floor is a reviewable packet that a later gate can either execute,
revise, or reject without inferring missing specs. No rendered output,
generated lesson output, or student-facing output is part of this sprint.
Every claim must have proof in the packet, validation logs, or cited source
files, and any unresolved issue must be routed as an explicit follow-up rather
than hidden in the execution packet.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| A12 safe update route | Exact update spec retaining `A2.11` | `unit-update --dry-run` command and expected diff | planned |
| A88/A89 zero-needs route | Exact specs with zero-needs review rationale | Validator proof that specs are schema-valid | planned |
| A90 linear GO-rule route | Exact spec and dependency on accepted `A89` | No table/graph route hidden in procedure | planned |
| A92 dependency route | Exact spec showing `A89` dependency | Execution ordering proof | planned |
| A93 price-change route | Exact spec depending on `A38`/`A92`, not `A66` | Incidence/pass-through remains MTU-H3 | planned |
| Generator boundary | Implement/block/prove-not-exposed decision for proposed generators | Evidence from `engines/skilltree/generators.js` and skill-tree exposure checks | planned |
| Remote review readiness | Commit and push packet and evidence before human review | Remote commit hash recorded before review | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Enforce remote-before-review proof in the packet | `include_now` | The user explicitly requires review packet evidence to be pushed before review, and H2D exposed the risk of unpushed evidence. |
| Add `unit-add --dry-run` wrapper before executing new unit lanes | `defer_named_follow_up` | Useful CLI hygiene, but not required to prepare the packet. |
| Bundle A20 split into H2E | `reject_scope_creep` | GATE-MTU-H2D explicitly held A20 for a separate packet. |
| Create generators immediately | `defer_or_route` | H2E may specify generator work, but direct generator implementation should be explicit if chosen. |

## Allowed paths

- `reports/sprints/MTU-H2E-plan.md`
- `references/data/sprints/MTU-H2E.plan.json`
- `reports/sprints/MTU-H2E-baseline.md`
- `reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.json`
- `reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.md`
- `reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json`
- `reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.md`
- `build-scripts/references/build-mtu-h2e-conditional-lane-execution-packet.js`
- `build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js`
- `reports/sprints/MTU-H2E-result.md`
- `reports/sprints/MTU-H2E-diff-summary.md`
- `references/data/sprints/MTU-H2E.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation execution
- candidate-storage creation
- candidate writes
- lesson-output mutation
- target-exercise promotion
- CP-6 or Year-1 closure
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.json`
- `references/machine/micro-teaching-units.json` as read-only context
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- a later execution-gate packet for accepted non-A20 lanes;
- a GATE-MTU-H2E review packet;
- no registry mutation;
- no generated lesson output.

## Operationalized sprint procedure

1. Re-read GATE-MTU-H2D closure and H2D resolution artifacts.
2. Verify current remote and repository map state before drafting any review
   packet.
3. Draft exact CLI specs/commands for `A12`, `A88`, `A89`, `A90`, `A92`, and
   `A93`.
4. Decide and document generator handling for `A88`, `A89`, `A90`, `A92`, and
   `A93`.
5. Keep `A20` out of execution scope and route it to a separate packet.
6. Validate packet/checkers locally.
7. Commit and push the packet and evidence before formal human review.
8. If a human gate packet is prepared, include calibration questions, record answers,
   run pattern analysis, ask targeted follow-ups for ambiguity,
   draft a closure proposal only after evidence is complete, and require
   explicit human confirmation before any closure record.
9. Stop before CLI mutation unless a later gate explicitly authorizes
   execution.

## Acceptance tests

```bash
node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2E-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2E --complete
node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js
node build-scripts/references/check-mtu-h2-solo-cases.js
node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js
node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Proof Required to Close

Proof required to close must include exact specs, exact command strings,
rollback instructions, generator-handling evidence, validation logs, remote
publication proof before review, and explicit proof that no protected
reference mutation or product boundary was crossed.

## Rollback plan

No mutation is planned. If H2E creates an invalid packet, revise or remove only
the H2E packet/log artifacts. If any protected reference data changes, stop and
revert before continuing.

## Human review required

Human review is required before any execution. Review may only begin after the
packet and cited evidence are pushed to the normal remote branch.

The H2E review packet must show the full planned question list before the
interview starts, ask calibration questions before binding answers, ask one
question at a time, record each answer, run pattern analysis, and require
explicit human confirmation before writing any gate closure.

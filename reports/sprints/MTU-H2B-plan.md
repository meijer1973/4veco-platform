# Sprint MTU-H2B: Solo q1-q3 CLI Execution Gate Packet

Date: 2026-05-28

Status: active packet-preparation sprint.

## Goal

Prepare a bounded CLI execution gate packet for the reviewed Solo q1-q3 MTU
hardening plan. MTU-H2B must make execution readiness reviewable: exact
command forms, ID availability proof, schema/spec proof, generator and term
proof, A20 usage impact audit, expected diff scope, rollback route, and stop
conditions.

This sprint does not execute CLI mutation. It does not write to
`references/machine/` or `references/external/`, does not mint units, does not
update units, and does not create lesson output or product-use authority.

## Context

GATE-MTU-H2A closed as `pass_with_conditions` for CLI-execution-gate planning
only. It accepted the proposed `F19`, `F20`, `A85-A93`, `A12` update, and
conditional `A20` update/split route for a later bounded execution gate packet.

The key H2A conditions are binding:

- prove ID availability for `F19`, `F20`, and `A85-A93`;
- provide schema-valid specs;
- prove A-unit generator fields or validator acceptance;
- validate term links;
- audit active `A20` usage before updating or splitting `A20`;
- avoid encoding `A90`/`A12` as mandatory dependencies for `A91`;
- provide exact command log, expected diff, rollback, audit, validators, and
  no-unintended-diff proof.

## Quality Standard

The packet must let a reviewer decide whether a later CLI execution sprint is
safe. It must not treat the H2A concept plan as automatically executable.
Execution readiness must be conditional per lane. If an audit finds an active
mapping that would become stale, the packet must hold that lane instead of
forcing closure.

The packet specification is the H2A closure conditions plus the MTU-H2B
roadmap row. Any gap found during review must become either a blocking issue or
a named follow-up, not an implicit permission to execute.
Proof must be explicit, reproducible, and tied to validator output rather than
reviewer trust.

There is no rendered output and no student-facing surface. The quality floor is
that a reviewer can inspect:

- what would be executed;
- what is intentionally held;
- which files are expected to change;
- which files must not change;
- which validation commands prove safety;
- which rollback action exists if execution is later rejected.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| ID availability proof | H2B packet records live-registry absence for `F19`, `F20`, `A85-A93` | H2B checker validates against live `micro-teaching-units.json` | planned |
| Schema-valid specs | H2B checker reuses H2A specs and simulates unblocked catalog changes | checker validates spec shape and dependencies | planned |
| A-unit generator proof | H2B packet lists generator fields for all proposed A-units | checker verifies A-domain proposed specs include generators | planned |
| Term-link proof | H2B packet lists required term slugs and validation status | checker validates terms through build-unit-index terminology loader | planned |
| A20 impact audit | H2B packet classifies active A20 uses | checker requires direct A20 update to be blocked if given-MK use exists | planned |
| Exact command forms | H2B packet lists lane-specific PowerShell command forms | review packet asks whether command evidence is sufficient | planned |
| Expected diff and rollback | H2B packet names direct CLI-write files, generated follow-up files, and rollback route | review packet and checker verify no lesson/candidate/external diff is authorized | planned |
| Later human review | GATE-MTU-H2B review packet exists | checker validates full question list and stop conditions | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Mark A20 direct update as held if audit finds given-MK use | `include_now` | H2A made this a condition; the audit must have teeth. |
| Add exact command forms for unblocked lanes | `include_now` | This is the core MTU-H2B purpose. |
| Execute `unit-add` or `unit-update` now | `reject_scope_creep` | MTU-H2B has no mutation authority. |
| Add dry-run wrapper for `unit-add` now | `defer_named_follow_up` | The H2B gate should decide whether this is required before execution. |
| Mutate target-exercise mappings for A20/A91 now | `reject_scope_creep` | That would be authored reference mutation outside this packet's authority. |

## Allowed paths

- `reports/sprints/MTU-H2B-plan.md`
- `references/data/sprints/MTU-H2B.plan.json`
- `reports/sprints/MTU-H2B-baseline.md`
- `reports/sprints/MTU-H2B-planning-review.md`
- `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.json`
- `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.md`
- `reports/review-gates/GATE-MTU-H2B-cli-execution/review-packet.md`
- `reports/review-gates/GATE-MTU-H2B-cli-execution/review-packet.json`
- `build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js`
- sprint result and diff-summary files;
- generated reports, dashboard data, source registry, source manifest,
  document inventory, URL index, and agent indexes.

## Forbidden paths

- `references/machine/`
- `references/external/`
- unit minting;
- unit update execution;
- unit split execution;
- candidate-storage creation;
- candidate writes;
- operation-registry mutation;
- answer-skill mutation;
- lesson-output mutation;
- target-exercise promotion;
- CP-6 or Year-1 closure;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Inputs

- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.md`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json` as read-only A20 usage context
- `references/data/procedure-visual/inventory.json` as read-only A20 usage context
- `build-scripts/references/unit-add.js`
- `build-scripts/references/unit-update.js`

## Outputs

- an execution-gate packet JSON/Markdown;
- a GATE-MTU-H2B human-review packet;
- a checker that validates packet completeness and the A20 hold condition;
- sprint logs under `reports/sprints/`;
- generated report/index refreshes.

No generated lesson output is produced.

## Operationalized sprint procedure

1. Read GATE-MTU-H2A closure, H2A CLI plan, live unit registry, CLI scripts,
   and active A20 references.
2. Record baseline:
   - current git commit;
   - live absence of proposed new IDs;
   - no staged protected mutations;
   - current A20 live spec;
   - active A20 uses in target exercises and procedural references.
3. Build H2B execution-gate packet:
   - mark execution-ready lanes and held lanes;
   - list exact command forms for unblocked lanes;
   - record ID, generator, term, OR-prerequisite, expected-diff, rollback, and
     no-unintended-diff proof;
   - hold direct A20 update if the A20 audit finds active broad/given-MK use.
4. Add a GATE-MTU-H2B human-review packet with full planned questions,
   calibration questions, stop conditions, and mutation/product-use blocks.
5. Add a read-only checker validating packet structure and safety conditions.
6. Update roadmap so the next action is GATE-MTU-H2B human review after H2B
   completes.
7. Run acceptance tests and stop at the review gate. Do not run any unit CLI
   mutation command.
8. During GATE-MTU-H2B, show the full question list, ask calibration questions,
   record each answer before asking the next question, run pattern analysis
   after the initial answers, ask targeted follow-ups where authority is
   ambiguous, draft a closure proposal, and require explicit human confirmation
   before writing any closure record or authorizing a downstream sprint.

Decision point: if the A20 audit finds active given-MK usage, the H2B packet
must hold direct A20 update/split execution and ask the later gate to route a
separate A20 split/replacement lane.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2B-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2B
node build-scripts/references/check-mtu-hardening-benchmark.js
node build-scripts/references/check-mtu-h2-solo-cases.js
node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js
node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test -- --runInBand
node build-scripts/sprints/check-sprint-bundle.js MTU-H2B --complete
```

## Proof Required to Close

Proof required to close must include passing sprint-plan, sprint-bundle, MTU-H2, H2A,
H2B, report, roadmap, source-registry, inventory, validator, and Jest checks.
The result log must include review, validator, and test evidence for closure.
The result log must state that no mutation command was run, no protected
reference data changed, no lesson output changed, A20 direct update was held
if required by the audit, and the next action is GATE-MTU-H2B human review.

## Rollback plan

Revert the MTU-H2B packet-preparation commit to remove the execution-gate
packet, review packet, checker, sprint logs, roadmap update, generated
report/index refreshes, and roadmap archive. No protected reference,
external-source, machine-reference, candidate-storage, or lesson-output
rollback should be required because those surfaces are forbidden in this
sprint.

## Human review required

Yes. MTU-H2B prepares `GATE-MTU-H2B` for human review. A later reviewer must
decide whether the unblocked commands may proceed to a bounded CLI execution
sprint, whether `unit-add` requires a dry-run wrapper first, and how to route
the held A20 lane.

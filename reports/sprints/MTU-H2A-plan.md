# Sprint MTU-H2A: Solo q1-q3 CLI-Mutation Planning

Date: 2026-05-27

Status: active planning sprint.

## Goal

Prepare a planning-only packet for the Solo q1-q3 MTU lanes approved by
GATE-MTU-H2. MTU-H2A must name exact proposed live unit IDs or proposed new
unit IDs, schema-valid CLI specs, command order, rollback and audit evidence,
validation commands, and a later human review gate before any CLI execution.

This sprint does not execute mutation. It does not write to
`references/machine/` or `references/external/`, does not mint units, and does
not create candidate storage or student-facing output.

## Context

GATE-MTU-H2 closed as `pass_with_conditions` for routing only. It approved
later planning for q1 verbal external-cost content, q2 calculation-operation
lanes, and q3 MO/price-change lanes. It deferred q1/q2 answer-form units to
MTU-H4 and broader D07 incidence/pass-through work to MTU-H3.

MTU-H2A is the bridge from routing evidence to a possible later mutation gate.
The current CLI surface supports `unit-update` and dependency edits with
`--dry-run`, but `unit-add` and `unit-split` write directly after validation.
That CLI fact must remain visible in the plan and in the later review packet.

## Quality Standard

The specification must be precise enough that a reviewer can see exactly what
would happen in a later CLI execution sprint, without relying on informal
memory of the Solo analysis. The quality floor is that every proposed unit or
update is traceable to an official correction-model operation, has a proposed
ID or live target ID, has a CLI-compatible spec, records its dependency
choices, and preserves the GATE-MTU-H2 over-trigger guardrails.

There is no rendered output and no student-facing surface in this sprint.
Student-facing and product-use claims remain blocked. Proof to close must show
the plan, review packet, checker, roadmap update, and generated report/index
refreshes all pass validation. Follow-up must be explicit: proceed to
GATE-MTU-H2A human review, not to mutation execution.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exact IDs are named for approved H2 lanes | `solo-q1-q3-cli-mutation-plan.*` includes proposed new IDs and live update targets | H2A checker validates IDs and collisions | planned |
| CLI-compatible specs are present | JSON plan carries `proposed_spec` or `update_spec` per lane | checker validates spec shape against current CLI rules | planned |
| Command sequence is explicit | JSON and Markdown plans list ordered CLI commands | review packet asks whether sequence is adequate | planned |
| Guardrails from GATE-MTU-H2 are preserved | plan records q1/q2/q3 over-trigger blocks and H3/H4 deferrals | checker and review packet verify deferrals remain visible | planned |
| No mutation is executed | no changes under `references/machine/` or `references/external/` | git diff, checker, and result log | planned |
| Later review is prepared | `GATE-MTU-H2A-cli-mutation-plan/review-packet.*` exists | checker validates planned questions and stop conditions | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add exact unit IDs and CLI specs for reviewed H2 lanes | `include_now` | This is the core MTU-H2A purpose. |
| Surface the `unit-add` no-dry-run limitation | `include_now` | The later mutation gate must know the CLI writes after validation. |
| Execute `unit-add` or `unit-update` commands now | `defer_named_follow_up` | Requires GATE-MTU-H2A or later explicit mutation authority. |
| Pull H3 incidence and H4 answer-form units into H2A | `reject_scope_creep` | GATE-MTU-H2 explicitly deferred those lanes. |

## Allowed paths

- `reports/sprints/MTU-H2A-plan.md`
- `references/data/sprints/MTU-H2A.plan.json`
- `reports/sprints/MTU-H2A-baseline.md`
- `reports/sprints/MTU-H2A-planning-review.md`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.md`
- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/review-packet.md`
- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/review-packet.json`
- `build-scripts/references/check-mtu-h2a-cli-mutation-plan.js`
- sprint result and diff-summary files;
- generated reports, dashboard data, source registry, source manifest,
  document inventory, URL index, and agent indexes.

## Forbidden paths

- `references/machine/`
- `references/external/`
- direct or generated unit mutation output;
- unit minting or unit updates;
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

- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/gate-closure.json`
- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/human-interview.md`
- `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `references/machine/micro-teaching-units.json` as read-only context
- `build-scripts/references/unit-add.js`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add-dep.js`
- `build-scripts/references/unit-split.js`

## Outputs

- a planning JSON and Markdown packet for Solo q1-q3 CLI mutation planning;
- a GATE-MTU-H2A review packet;
- a checker that validates the planning packet and roadmap state;
- sprint logs under `reports/sprints/`;
- generated report/index refreshes.

No generated lesson output is produced.

## Operationalized sprint procedure

1. Read GATE-MTU-H2 closure, canonical cases, relevant live units, and CLI
   scripts. Stop if the approved scope would require editing
   `references/machine/` or `references/external/`.
2. Draft the mutation planning packet:
   - assign exact proposed IDs for new units;
   - name exact live IDs for update targets;
   - create CLI-compatible specs;
   - record command order and rollback expectations;
   - keep H3/H4 deferrals and over-trigger guardrails visible.
3. Add a GATE-MTU-H2A human-review packet with full planned questions,
   calibration questions, stop conditions, and explicit mutation/product-use
   blocks.
   - The later gate procedure must show all questions first, ask calibration
     questions, record each answer, run pattern analysis, ask targeted
     follow-ups where needed, draft a closure proposal, and require explicit human confirmation before any closure record or CLI execution authority.
4. Add a read-only checker that validates ID collisions, CLI spec shape,
   authority flags, deferred lanes, and roadmap state.
5. Update the roadmap so the next action is GATE-MTU-H2A human review after
   MTU-H2A completes.
6. Run acceptance tests and stop at the review gate. Do not run any unit CLI
   mutation command.

Decision point: if the planning packet cannot name valid IDs or specs without
colliding with live units, stop and revise the packet. If the later review
would need immediate mutation authority, stop; MTU-H2A may only prepare a
reviewable execution plan.

## Acceptance tests

```powershell
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2A-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2A
node build-scripts/references/check-mtu-hardening-benchmark.js
node build-scripts/references/check-mtu-h2-solo-cases.js
node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js
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
node build-scripts/sprints/check-sprint-bundle.js MTU-H2A --complete
```

## Proof Required to Close

To close this sprint, closure proof must include passing sprint-plan, sprint-bundle, MTU-H2,
MTU-H2A, report, roadmap, source-registry, inventory, validator, and Jest test
checks. The result log must explicitly state that no mutation command was run,
no protected reference data changed, no lesson output changed, and the next
action is GATE-MTU-H2A human review.

## Rollback plan

Revert the MTU-H2A planning commit to remove the planning packet, review
packet, checker, sprint logs, roadmap update, generated report/index refreshes,
and roadmap archive. No protected reference, external-source,
machine-reference, candidate-storage, or lesson-output rollback should be
required because those surfaces are forbidden in this sprint.

## Human review required

Yes. MTU-H2A prepares `GATE-MTU-H2A` for human review. A later reviewer must
decide whether the exact IDs, CLI specs, command order, rollback, audit log,
and validation evidence are adequate. Even if the gate passes, no mutation
execution is authorized unless the closure explicitly names that authority.

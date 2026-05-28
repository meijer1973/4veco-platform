# Sprint MTU-H3B: Incidence Pass-Through CLI Execution Packet

Date: 2026-05-28

Status: planned after GATE-MTU-H3A closure.

## Goal

Prepare a non-mutating CLI execution packet for the incidence/pass-through
lanes accepted by GATE-MTU-H3A. The packet must make a later bounded execution
sprint reviewable for narrowed `D07`, new `D41`, `D42`, `D43`, `D45`, `D46`,
exact authored target-exercise mapping patches, rollback, validation,
projection boundaries, and no-unintended-diff proof.

## Context

GATE-MTU-H3A closed as PASS WITH CONDITIONS for CLI-mutation planning only. It
authorized only this execution-packet preparation sprint and no execution. The
closure accepted these lane directions:

```text
D07 - narrow to tax afwentelingspercentage / percentage burden calculation
D41 - tax wedge and Pc/Pp graphical labeling
D42 - tax burden amounts in euros, with dependency review
D43 - subsidy effective prices
D44 - subsidy benefit-sharing, held unless target evidence requires it
D45 - relative elasticity explanation, with supply-elasticity status resolved
D46 - cost-shock pass-through share, distinct from A93
```

The H3B packet must resolve the H3A conditions before human review: revise or
justify `D42` so it does not force graphical work in non-graph contexts, state
the `D45` supply-elasticity route, keep `A93` bounded, and keep mapping writes
as later authored-reference mutations.

## Quality Standard

The quality floor is an execution-reviewable specification, not mutation. The
packet must provide exact unit specs, exact command strings, exact target
mapping before/after arrays, command ordering, dry-run limits, rollback,
validation, rendered output and projection boundaries, student-facing exposure
blocks, proof requirements, and a clear follow-up. Any uncertainty must be a
review question or stop condition, not hidden in execution prose.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| D42 dependency condition resolved | H3B spec does not require D41; graph contexts map D41 separately | Reviewer can see euro burden calculation does not over-trigger graphical labeling | planned |
| D45 supply-elasticity condition resolved | D45 spec is qualitative/internal for supply elasticity and does not require a new numeric unit | Reviewer can approve, revise, or hold the qualitative route | planned |
| Exact execution packet | JSON/MD packet names D07 update, D41/D42/D43/D45/D46 additions, D44 held lane, mapping patches, rollback, validation | Checker validates specs, mappings, authority flags, and review questions | planned |
| Review gate prepared | GATE-MTU-H3B packet has calibration questions, ten review questions, stop conditions, and remote-before-review prerequisite | Human review can run one question at a time after remote publication | planned |
| No mutation | No CLI mutation, no target-exercise write, no projection refresh, no lesson output | Diff and validators prove only packets/logs/checkers/roadmap changed | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Revise `D42` to avoid `D41` dependency | `include_now` | GATE-MTU-H3A explicitly required D42 dependency review before execution. |
| Hold `D44` out of the execution command set | `defer_named_follow_up` | Current target evidence asks subsidy effective prices, not explicit subsidy benefit-sharing. |
| Execute D07/D41-D46 directly from H3B | `reject_scope_creep` | GATE-MTU-H3A authorized only execution-packet preparation; H3B review must close first. |

## Allowed paths

- `reports/mtu-hardening/*h3b*`
- `reports/review-gates/GATE-MTU-H3B-*`
- `reports/sprints/MTU-H3B-*`
- `references/data/sprints/MTU-H3B.*.json`
- `build-scripts/references/check-mtu-h3b-*.js`
- roadmap, roadmap archive, generated index, source registry, document
  inventory, URL index, and GitHub agent index updates

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- CLI mutation of `D07`
- `D41`-`D46` unit minting
- authored target-exercise mapping writes
- generated projection refresh based on unexecuted mutations
- candidate-storage creation or candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H3A-incidence-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/mtu-h3a-incidence-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating H3B CLI execution packet.
- A GATE-MTU-H3B human review packet if the execution packet is evidence-complete.
- A non-mutating checker for the H3B packet and review packet.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, no
  generated projection refresh, no lesson output, and no student-facing
  output.

## Operationalized sprint procedure

1. Verify the post-GATE-MTU-H3A baseline: `D07` is live with current broad
   needs, `D41`-`D46` are absent, `A93` remains bounded, and target exercises
   `3.1.1`, `3.1.2`, and `3.1.3` still have current mappings. Stop if the
   remote branch is not current before packet preparation.
2. Draft exact execution specs for `D41`, revised `D42`, `D43`, qualitative
   `D45`, `D46`, and the `D07` update. Stop if `D07` retains `A15` or hidden
   elasticity, `D42` forces `D41`, `D45` hides the supply-elasticity boundary,
   or `D46` collapses into `A93`.
3. Simulate the catalog with the proposed add/update specs. Stop if schema,
   term, dependency, zero-needs, or exam-code validation fails.
4. Add exact authored mapping before/after arrays for `3.1.1`, `3.1.2`, and
   `3.1.3`, while keeping `D44` held and unmapped unless the review revises
   the target-evidence interpretation.
5. Write the GATE-MTU-H3B review packet with calibration questions, planned
   questions, stop conditions, rollback and validation requirements, and no
   mutation/product authority.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, run pattern analysis, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   execution sprint is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H3B-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H3B --complete
node build-scripts/references/check-mtu-h3b-incidence-cli-execution-packet.js
node build-scripts/references/check-mtu-h3a-incidence-cli-mutation-plan.js
node build-scripts/references/check-mtu-h3-incidence-pass-through-review.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include remote-before-review publication,
simulated catalog validation, exact spec and mapping reviewability, sprint
bundle proof, roadmap and index validation, no protected-reference or authored
target mutation, no projection refresh, and a clear next action: run
GATE-MTU-H3B, revise the packet, or hold for a named evidence gap.

## Rollback plan

MTU-H3B should not mutate protected reference data, authored target-exercise
records, generated projections, or lesson output. If the packet is rejected,
revise or remove only the H3B packet, checker, review packet, sprint logs,
bundle URLs, and roadmap/index updates. Any later execution sprint must carry
its own rollback path for unit specs, target mappings, generated reports, and
student-facing exposure blocks.

## Human review required

A human review is required before any `D07` update, `D41`-`D46` minting,
target-exercise mapping update, generated projection refresh, lesson output,
or student/product use. The interview must show the full question list first,
then ask one question at a time, record answers, analyze patterns, ask
targeted follow-ups, draft a closure proposal, and require explicit human
confirmation before writing a gate closure or authorizing execution.

# Sprint MTU-H3A: Incidence Pass-Through CLI-Mutation Planning Packet

Date: 2026-05-28

Status: planned after GATE-MTU-H3 closure.

## Goal

Prepare a non-mutating CLI-mutation planning packet for the incidence and
pass-through lanes accepted by GATE-MTU-H3. The packet must provide exact
proposed specs, exact target-exercise mapping proposal, dependency audit,
`A93` boundary proof, rollback route, validation requirements, and
projection/source boundaries for later human review.

## Context

GATE-MTU-H3 closed as PASS WITH CONDITIONS for routing only. It accepted the
following planning architecture:

```text
D07 - tax afwentelingspercentage / percentage burden calculation
D41 - tax wedge and Pc/Pp graphical labeling
D42 - tax burden amounts in euros
D43 - subsidy equilibrium and effective prices
D44 - subsidy benefit-sharing
D45 - incidence explanation with relative elasticities
D46 - cost-shock pass-through share, distinct from A93
```

The gate authorized only a later bounded planning packet. It did not authorize
`D07` mutation, `D41`-`D46` minting, target-exercise writes, generated
projection refresh, lesson output, PV projection, or product use.

## Quality Standard

The quality floor is an execution-reviewable mutation plan, not mutation. The
specification must name every proposed unit field, command form, mapping
before/after value, dependency decision, rendered output boundary,
student-facing block, proof requirement, and follow-up. Any uncertainty must
be visible as a review question or stop condition, not hidden in the next
sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Narrowed D07 spec | Exact update patch removes hidden elasticity need and routes percentage calculation after D42 | Reviewer can see D07 no longer requires A15 or elasticity explanation | planned |
| D41-D46 exact specs | Full planning specs for each proposed ID, with needs, exam codes, terms, procedure, and pitfalls | Validator can simulate the post-planning catalog without mutating it | planned |
| Target mapping proposal | Exact before/after arrays for `3.1.1`, `3.1.2`, and `3.1.3` | Reviewer can see which mappings would change and which are deliberately held | planned |
| Dependency audit | D41 not tied to welfare areas, D45 supply elasticity risk explicit, A93 kept bounded | Reviewer can approve, revise, or hold each risk separately | planned |
| Command and rollback standard | Unit-update/unit-add command forms, unit-add dry-run limitation, rollback and validation requirements | Later execution packet can be prepared without guessing | planned |
| No mutation | `references/machine/`, `references/authored/`, projections, and lesson outputs remain unchanged | Diff and validators prove planning-only work | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Include exact mapping diffs in the planning packet | `include_now` | H3 closure requires exact mapping proposal for `3.1.1`, `3.1.2`, and `3.1.3`. |
| Defer a separate supply-elasticity A-unit unless the H3A review requires it | `defer_named_follow_up` | No live supply-elasticity unit exists; D45 can carry qualitative supply-elasticity explanation for review, but this must be explicit. |
| Execute D07/D41-D46 directly from H3A | `reject_scope_creep` | GATE-MTU-H3 authorized planning only, not execution. |

## Allowed paths

- `reports/mtu-hardening/*h3a*`
- `reports/review-gates/GATE-MTU-H3A-*`
- `reports/sprints/MTU-H3A-*`
- `references/data/sprints/MTU-H3A.*.json`
- `build-scripts/references/check-mtu-h3a-*.js`
- roadmap and index updates

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation of `D07` or `D41`-`D46`
- authored target-exercise mapping writes
- generated projection refresh based on unexecuted mutations
- candidate-storage creation or candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H3-incidence-pass-through/gate-closure.json`
- `reports/mtu-hardening/mtu-h3-incidence-pass-through-family-review.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating H3A CLI-mutation planning packet.
- A GATE-MTU-H3A review packet if the planning packet is evidence-complete.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, no
  generated projection refresh, no lesson output, and no student-facing
  output.

## Operationalized sprint procedure

1. Verify the post-GATE-MTU-H3 baseline: `D07` exists unchanged, `D41`-`D46`
   are absent, `A93` is live and bounded to price percentage change, and
   target exercises `3.1.1`, `3.1.2`, and `3.1.3` still carry current
   mappings.
2. Draft exact specs for narrowed `D07` and proposed `D41`-`D46`. Stop if
   `D07` retains hidden elasticity explanation, `D41` imports welfare-area
   shading, `D45` hides the supply-elasticity gap, or `D46` collapses into
   `A93`.
3. Simulate the catalog with the proposed update/add specs. Stop if schema,
   term, dependency, or exam-code validation fails.
4. Add exact authored mapping before/after arrays for `3.1.1`, `3.1.2`, and
   `3.1.3`, including held `D44` mapping status if subsidy benefit-sharing is
   not explicitly required by the current target.
5. Write the GATE-MTU-H3A review packet with calibration questions, planned
   questions, stop conditions, rollback and validation requirements, and no
   mutation/product authority.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, run pattern analysis, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   execution-packet scope is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H3A-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H3A --complete
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

Proof required to close must include simulated catalog validation, exact spec
and mapping proposal reviewability, sprint bundle proof, remote-before-review
publication, roadmap and index validation, no protected-reference or authored
target mutation, and a clear next action: run GATE-MTU-H3A, revise the packet,
or hold for a named evidence gap.

## Rollback plan

MTU-H3A should not mutate protected reference data, authored target-exercise
records, generated projections, or lesson output. If the planning packet is
rejected, revise or remove only the H3A packet, checker, review packet, sprint
logs, bundle URLs, and roadmap/index updates. Any later execution packet must
carry its own rollback path for `references/machine/`,
`references/authored/course-target-exercises.json`, generated reports, and
student-facing exposure blocks.

## Human review required

A human review is required before any `D07` update, `D41`-`D46` minting,
target-exercise mapping update, generated projection refresh, lesson output,
or student/product use. The interview must show the full question list first,
then ask one question at a time, record answers, analyze patterns, ask
targeted follow-ups, draft a closure proposal, and require explicit human
confirmation before writing a gate closure.

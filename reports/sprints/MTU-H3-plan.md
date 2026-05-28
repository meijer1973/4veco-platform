# Sprint MTU-H3: Incidence Pass-Through Skill Family Review

Date: 2026-05-28

Status: planned after MTU-H2J execution.

## Goal

Prepare a non-mutating review packet for the incidence and pass-through skill
family now that MTU-H2J has resolved the Solo q1-q3 A20 ambiguity. The packet
must let a later human gate decide how `D07` should be narrowed, split, or
supplemented across tax incidence, subsidy incidence, cost-shock pass-through,
graphical wedge recognition, elasticity explanation, and misconception
handling.

## Context

The active roadmap names MTU-H3 as the next reference-team lane after MTU-H2J.
The live `D07` unit currently calculates what percentage of a heffing is passed
on to consumers, but target exercise `3.1.1` uses `D07` for a tax-wedge and new
equilibrium task that does not ask for an afwentelingspercentage. Target
exercise `3.1.2` does ask for tax burden and afwentelingspercentage. Target
exercise `3.1.3` covers subsidies with surplus and deadweight-loss work but has
no dedicated subsidy incidence unit. `A93` deliberately covers percentage price
change after a cost change and warns that this is not the same as
pass-through share.

MTU-H3 must turn that evidence into a bounded human-review packet. It must not
mint, update, split, deprecate, or remap units.

## Quality Standard

The quality floor is a specification-complete review packet, not a mutation
plan or execution packet. The specification must show the evidence, candidate
lane options, mapping risks, rendered output boundary, student-facing blocks,
proof requirements, and follow-up path clearly enough that a reviewer can
answer without hidden assumptions. Any uncertainty must become a review
question or stop condition, not implied authority.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| D07 scope audit | Live `D07`, `D05`, `A23`, `A41`, `A93`, and related D/A units summarized | Reviewer can distinguish tax percentage pass-through from tax wedge, subsidy incidence, and cost-shock price change | planned |
| Target-exercise usage audit | `3.1.1`, `3.1.2`, `3.1.3`, and `4.1.6` current mappings summarized | Reviewer can decide whether `3.1.1` over-triggers `D07` and whether `3.1.2` still needs a D07-style lane | planned |
| Candidate family lanes | Planning-only lane table for D07 update and possible D41-D46/equivalent successors | Reviewer can route later mutation planning without treating IDs as live or authorized | planned |
| Human gate packet | Calibration questions, one-at-a-time review questions, stop conditions, and no-authority boundary | Reviewer can run an actual interview and record a closure before any later CLI-governed mutation lane | planned |
| Remote-before-review proof | Bundle URLs and roadmap/index updates after artifacts are written | External reviewer can fetch the review packet and cited evidence before interview | planned |
| No mutation | Protected reference data, authored target mappings, generated lesson output, PV projection, and product surfaces stay unchanged | Diff and validators prove MTU-H3 produced review artifacts only | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Separate tax burden amount, afwentelingspercentage, and wedge-label operations in the review questions | `include_now` | Current `D07` blends percentage calculation, burden split, elasticity explanation, and is over-used by `3.1.1`. |
| Defer exact D41-D46 CLI specs to the next planning sprint | `defer_named_follow_up` | MTU-H3 is the family review; exact unit specs need human routing first. |
| Directly update `D07` or edit target exercise `3.1.1` now | `reject_scope_creep` | The roadmap authorizes a non-mutating review packet only. |

## Allowed paths

- `reports/mtu-hardening/*incidence*`
- `reports/review-gates/GATE-MTU-H3-*`
- `reports/sprints/MTU-H3-*`
- `references/data/sprints/MTU-H3.*.json`
- `build-scripts/references/check-mtu-h3-*.js`
- roadmap and index updates

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- CLI mutation of `D07` or any successor unit
- unit minting, unit update execution, unit split execution, or unit deprecation
- authored target-exercise mapping writes
- candidate-storage creation or candidate writes
- lesson-output mutation
- generated projection refresh based on unexecuted mutations
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `reports/sprints/MTU-H2J-result.md`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`

## Outputs

- A non-mutating incidence/pass-through family review evidence packet.
- A GATE-MTU-H3 human-review packet if the evidence packet is complete.
- Bundle URL file for remote review.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, no
  generated lesson output, no PV projection, and no student-facing output.

## Operationalized sprint procedure

1. Verify the post-H2J baseline: MTU-H2J result exists, `D07` is live, `A93`
   is live as price-change-not-incidence, and target exercises `3.1.1`,
   `3.1.2`, `3.1.3`, and `4.1.6` are readable.
2. Build the family review evidence. Stop if the evidence cannot distinguish
   tax wedge/new-equilibrium work from afwentelingspercentage, subsidy
   incidence, or cost-shock price-change work.
3. Write the review packet with calibration questions, planned review
   questions, stop conditions, candidate lane groups, remote-before-review
   requirements, and no mutation/product authority.
4. Run validators, sprint checks, and bundle URL checks. Stop if any validator
   fails or if the packet implies direct `D07` mutation, unit minting, target
   mapping writes, generated projection refresh, or student-facing exposure.
5. Update the roadmap to make `GATE-MTU-H3` the active operational next
   action, archive the previous roadmap, and refresh source/index reports.
6. If the packet asks for a human gate, show all calibration questions and
   planned review questions, ask one question at a time, record each answer,
   run pattern analysis, ask targeted follow-ups, draft a closure proposal,
   and require explicit human confirmation before any later mutation is
   authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H3-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H3 --complete
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

Proof required to close must include evidence-packet and review-packet
validation, sprint bundle proof, remote-before-review publication, roadmap and
index validation, no protected-reference or authored-target mutation, and a
clear next action: run the GATE-MTU-H3 human review, revise the packet, or hold
for a named evidence gap.

## Rollback plan

MTU-H3 should not mutate protected reference data, authored target-exercise
records, generator code, lesson output, or generated projections. If the packet
is rejected, revise or remove only the MTU-H3 packet, checker, sprint logs,
bundle URLs, and roadmap/index updates. Any later mutation sprint must carry
its own rollback path for `references/machine/`,
`references/authored/course-target-exercises.json`, generated reports, and
student-facing exposure blocks.

## Human review required

A human review is required before any `D07` update/split, successor unit
minting, target-exercise mapping update, candidate write, projection refresh,
lesson-output mutation, or student/product use. The interview must show the
full planned question list first, then ask one question at a time, record each
answer, analyze patterns, ask targeted follow-ups, draft a closure proposal,
and require explicit human confirmation before writing a gate closure.

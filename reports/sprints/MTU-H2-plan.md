# Sprint MTU-H2: Solo q1-q3 Canonical Micro-Case Review

## Goal

Prepare a non-mutating canonical micro-case review package for the Solo q1-q3
MTU-hardening benchmark. MTU-H2 must translate the MTU-H1 evidence into
reviewable unit/refactor candidates and a human-review packet, but it must not
mutate the live MTU registry.

The sprint must make the next decision explicit:

- which Solo q1-q3 candidate units or refactors are ready for human review;
- which candidates should remain held for MTU-H3 or MTU-H4;
- which over-trigger guardrails must bind any later CLI-governed mutation;
- which existing units are partial support, too broad, weak, or wrong-route;
- which later sprint may execute mutation only after a closed human review
  names exact CLI actions, rollback, and proof.

## Context

MTU-H1 recorded the supplied 2026 VWO economie Solo q1-q3 analysis as a seed
benchmark. It found that q1 needs verbal external-cost and answer-form support,
q2 needs a reverse fixed-cost-from-profit chain, and q3 needs finer MO/MK,
price, and pass-through distinctions.

The current roadmap now makes MTU-H2 the active operational next action. The
roadmap fix is part of this sprint because MTU-H2 was previously visible only
below the lesson-scale tracking row.

MTU-H2 is still pre-mutation work. Machine references remain protected and must
not be hand-edited. Any later mutation must use the reference CLI and a closed
human-reviewed mutation lane.

## Quality Standard

The expected outcome is a review-grade micro-case package, not a list of
preferred new units. Each proposed unit or refactor must be traceable to a
Solo correction-model operation, answer form, or misconception target, and must
record why existing units are insufficient or only partial support.

The quality floor is that the package can be reviewed without opening the live
machine registry: the candidate label, layer, rationale, over-trigger guardrail,
suggested CLI path, and blocking authority condition must be visible in the
JSON, Markdown, and review packet. Rendered output is not in scope and no
student-facing output may be produced.

Closure proof must show the specification is fulfilled, validators pass, no
protected reference data changed, no CLI mutation command was run, and the
roadmap top clearly points to the human review as the next action. Any
deferred follow-up must be named as MTU-H3, MTU-H4, MTU-H5, MTU-H6, or a later
CLI-governed mutation sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| MTU-H2 is visible as the active roadmap action before execution | top Sprint Ledger row updated during planning | roadmap version/index checker | planned |
| Solo q1-q3 candidate package exists | `reports/mtu-hardening/solo-q1-q3-canonical-cases.json` and `.md` | MTU-H2 checker validates required cases and candidates | planned |
| Candidate/refactor records preserve no-mutation boundaries | authority flags and CLI path status are false/pending | checker rejects mutation authorization | planned |
| Human-review packet exists | `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.*` | checker confirms planned questions and stop conditions | planned |
| Later mutation is routed, not executed | result log and roadmap top point to GATE-MTU-H2 | sprint bundle and roadmap index proof | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Build q1-q3 candidate/refactor package with reviewable fields | `include_now` | This is the core H2 deliverable. |
| Add a human-review packet with one-question-at-a-time protocol | `include_now` | Mutation cannot proceed from a soft approval or inferred decision. |
| Execute CLI unit additions for the candidate set | `defer_named_follow_up` | Requires human review and exact mutation lane authority after H2. |
| Fold incidence family and all answer-form units into H2 | `reject_scope_creep` | D07 incidence belongs to MTU-H3; broad answer-form policy belongs to MTU-H4. H2 may flag dependencies only. |

## Allowed paths

- `reports/sprints/MTU-H2-plan.md`
- `references/data/sprints/MTU-H2.plan.json`
- `reports/sprints/MTU-H2-baseline.md`
- `reports/sprints/MTU-H2-planning-review.md`
- `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`
- `reports/mtu-hardening/solo-q1-q3-canonical-cases.md`
- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.md`
- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.json`
- `build-scripts/references/check-mtu-h2-solo-cases.js`
- `reports/sprints/MTU-H2-result.md`
- `reports/sprints/MTU-H2-diff-summary.md`
- `references/data/sprints/MTU-H2.result.json`
- roadmap/version-index updates and normal generated report/index refreshes

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- protected reference mutation
- external-source mutation
- machine-reference mutation
- unit minting
- operation-registry mutation
- answer-skill mutation
- candidate-storage creation or candidate writes
- q19 source-annex or graph-object extraction execution
- lesson-output mutation
- target-exercise promotion
- CP-6 closure or Year-1 closure
- diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing output authorization

## Inputs

- `reports/mtu-hardening/benchmark-sample-v1.json`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `build-scripts/references/check-mtu-hardening-benchmark.js`
- `references/reference-team-roadmap.md`
- `references/machine/micro-teaching-units.md` as read-only context only
- `references/machine/micro-teaching-units.json` as read-only context only
- `references/schemas/exam-question.schema.json`

## Outputs

- `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`: structured
  review package of proposed candidate units/refactors and guardrails.
- `reports/mtu-hardening/solo-q1-q3-canonical-cases.md`: human-readable
  canonical case review.
- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.md`
  and `.json`: human-review packet for deciding which candidate lanes may move
  to a later CLI-governed mutation sprint.
- `build-scripts/references/check-mtu-h2-solo-cases.js`: read-only validator.
- Sprint result, diff summary, and result JSON.
- Roadmap update that closes MTU-H2 and makes GATE-MTU-H2 the visible top
  operational next action.

Generated output statement: MTU-H2 generates reference planning and review
artifacts only. It generates no lesson output, no candidate storage, and no
machine-reference mutation.

## Operationalized sprint procedure

1. Fix roadmap visibility so MTU-H2 is the active operational next action above
   the lesson-scale tracking row. Stop if the roadmap still buries MTU-H2.
2. Record this plan, plan JSON, baseline, and planning review. Stop if the plan
   does not explicitly forbid `references/machine/` mutation.
3. Build the canonical cases JSON and Markdown from MTU-H1 evidence. Each q1-q3
   lane must identify existing-unit fit, proposed candidate/refactor, suggested
   later CLI path, over-trigger guardrails, and no-mutation authority.
4. Prepare the GATE-MTU-H2 review packet. The packet must show all planned
   review questions before the future interview, ask one question at a time,
   and include stop conditions for any mutation/product-use overreach.
5. Add a read-only checker that validates the package and review packet.
6. Run validators, report/index refreshes, and Jest. Stop on failure.
7. Close MTU-H2 as review-packet-ready only. The next action must be
   GATE-MTU-H2, not direct mutation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2
node build-scripts/references/check-mtu-hardening-benchmark.js
node build-scripts/references/check-mtu-h2-solo-cases.js
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
node build-scripts/sprints/check-sprint-bundle.js MTU-H2 --complete
```

## Proof Required to Close

Closure requires proof that sprint plan, sprint bundle, MTU-H1 benchmark, MTU-H2
solo-case checker, report/index validators, roadmap-version checks, and Jest
all pass or are explicitly skipped with a bounded reason. The result log must
confirm no protected reference data changed and the roadmap top names
GATE-MTU-H2 as the next review action.

The sprint may close only after validator and test proof is recorded in the
result JSON and markdown result log.

## Rollback plan

Revert the MTU-H2 commit. Rollback removes only the canonical-case reports,
review packet, checker, sprint logs, roadmap/index updates, and generated
report/index refreshes. It does not touch `references/machine/`,
`references/external/`, lesson output, or the pre-existing untracked
exit-ticket draft zip.

## Human review required

MTU-H2 itself prepares the review packet and requires no separate review to
write these planning artifacts. A future GATE-MTU-H2 human review is required
before any candidate lane can become a CLI-governed mutation sprint.

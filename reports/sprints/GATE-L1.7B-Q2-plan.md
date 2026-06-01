# Sprint GATE-L1.7B-Q2: Exit Ticket Target-Equivalent Proof Review Packet

Date: 2026-06-01

Status: planned active human-review gate preparation.

## Goal

Prepare the `GATE-L1.7B-Q2` human-review packet for the implemented
`1.1.2 Percentages en indexcijfers` target-equivalent exit-ticket candidate.

This sprint prepares the packet, evidence summary, planned interview questions,
stop conditions, deterministic packet checker, bundle URLs, and pre-gate lead
review. It does not start the human interview, write gate closure records,
enable completion language, mutate generated lesson output, or authorize
student/product use.

## Context

`L1.7B-Q2` closed PASS WITH FLAGS on 2026-06-01 and pushed the first
target-equivalent exit-ticket candidate:

- platform commit `31e035aaab656f8f64722ac62d26108f829d0f60`;
- lesson output commit `971bf68402e6071804c44d3aa67c67320a987e33`.

The candidate covers the reviewed `1.1.2` operation chain:

1. percentage change from EUR 800 to EUR 920;
2. price-index calculation from EUR 150 to EUR 162;
3. percentage change from index 108 to 112;
4. D31 explanation that 108 to 112 is 4 index points, not 4 percent.

The carried flag is substantive: the implementation uses deterministic
text-group matching for calculation work and D31 explanation criteria. It is
not symbolic math parsing or semantic language understanding. The human gate
must explicitly decide whether that proof standard is sufficient before local
paragraph-completion copy can be enabled.

## Quality Standard

The quality floor is a review packet that makes the exact student-facing output
and proof standard inspectable against the stable product specifications:
`../4veco-lessen/specifications/product-end-state.md` and
`../4veco-lessen/specifications/companion-core-specifications.md`. The packet
must show the full question list, require remote evidence publication before
review, require live rendered output inspection, preserve the advisory
short-check boundary, keep all product authority blocks intact, and name any
omitted requirements as follow-up work rather than silently treating packet
readiness as implementation approval.

The review gate that judges quality is `GATE-L1.7B-Q2`. The gate may decide
whether the exact `1.1.2` implementation justifies local, non-summative
paragraph-completion language. It may not authorize grades, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or broad product use.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exit ticket is target-equivalent proof, not a short quiz | `L1.7B-Q2-operation-chain.md`, source data, generated output, screenshots | Gate decides whether all four target operations are covered at the same level | planned for human review |
| Calculation tasks require visible work and final answer | source data, task-shell engine/test diffs, adversarial checker | Gate decides whether deterministic work-text criteria are sufficient | planned for human review |
| D31 is explicitly checked | answer model, source criteria, adversarial D31 test | Gate decides whether the D31 text criteria are sufficient | planned for human review |
| Shared task shell is used | generated output and screenshots | Gate decides whether UI/task family fit the target work | planned for human review |
| Completion language remains held before approval | source flags and generated output evidence | Gate decides whether later exact copy may be enabled | held pending gate |
| Advisory short check remains separate | `1.1.1` source/output evidence | Gate confirms short-check state is not proof state | planned for human review |
| Product authority remains blocked | packet authority flags and stop conditions | Gate confirms no diagnostics, mastery, sequencing, Scale Gate 1, or product use | blocked |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Include exact completion-language options in the gate | `include_now` | The gate exists to decide local copy, so the options must be explicit. |
| Include deterministic-matcher limitation as a review question | `include_now` | This is the carried lead-review flag from L1.7B-Q2. |
| Require live-output inspection of correct and adversarial states | `include_now` | The proof standard cannot be judged from docs only. |
| Improve symbolic or rubric parsing beyond deterministic matching | `defer_named_follow_up` | Only needed if the human gate finds the reviewed criteria insufficient or too brittle. |
| Enable completion copy during packet prep | `reject_scope_creep` | Only a later post-gate implementation may change source flags/copy. |
| Treat this gate as Scale Gate 1 | `reject_scope_creep` | This is a local proof/copy gate, not a product-scale release gate. |

## Allowed paths

- `reports/sprints/GATE-L1.7B-Q2-plan.md`
- `reports/sprints/GATE-L1.7B-Q2-baseline.md`
- `reports/sprints/GATE-L1.7B-Q2-lead-review-assignment.md`
- `reports/sprints/GATE-L1.7B-Q2-lead-review-round1.md`
- `reports/sprints/GATE-L1.7B-Q2-lead-review-corrections.md`
- `reports/sprints/GATE-L1.7B-Q2-lead-review-round2.md`
- `references/data/sprints/GATE-L1.7B-Q2.plan.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.md`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/bundle-urls.md`
- `build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`
- roadmap rows and generated maps/indexes needed for remote reviewer navigation

## Forbidden paths

- `source-data/book-*/exit-ticket/*.json`
- generated Book 1 HTML, CSS, JS, or data
- engine implementation files
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- human-interview or gate-closure records before the human review actually starts
- any file that enables completion language, diagnostics, adaptive routing,
  mastery, sequencing, student-facing AI, summative use, PV, Scale Gate 1, or
  product use

## Inputs

- `reports/sprints/L1.7B-Q2-result.md`
- `reports/sprints/L1.7B-Q2-diff-summary.md`
- `references/data/sprints/L1.7B-Q2.result.json`
- `reports/sprints/L1.7B-Q2-operation-chain.md`
- `reports/sprints/L1.7B-Q2-answer-model.md`
- `reports/sprints/L1.7B-Q2-live-output-evidence.md`
- `reports/sprints/L1.7B-Q2-live-output-evidence.json`
- `reports/sprints/L1.7B-Q2-screenshot-manifest.md`
- `reports/sprints/L1.7B-Q2-lead-review-round2.md`
- `source-data/book-1/exit-ticket/1.1.2.json`
- `build-scripts/sprints/check-l1-7b-q2-implementation.js`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

The allowed-path files listed above.

## Operationalized sprint procedure

1. Record this plan, baseline, and plan metadata. Stop if `L1.7B-Q2` is not
   pushed or if the implementation flags already enable completion language.
2. Draft the live-output evidence summary and review packet. Include the full
   planned question list, calibration questions, minimum live-output
   inspection checklist, stop conditions, and exact authority boundary.
3. Add a deterministic checker that fails if the packet lacks evidence, planned
   questions, lead-review artifacts, or product-boundary blocks.
4. Assign the packet to the lead reviewer agent before human interview. Record
   round 1. Apply corrections or stop if the reviewer returns REVISE, FAIL, or
   PAUSE.
5. Record corrections and round 2 recheck. Stop unless round 2 is PASS or
   PASS WITH FLAGS.
6. Emit gate bundle URLs, refresh maps/indexes/dashboard, run validators, fetch
   remotes, commit, and push before any human interview starts.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-L1.7B-Q2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-L1.7B-Q2
node build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js
node build-scripts/sprints/check-l1-7b-q2-implementation.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

This gate-prep sprint closes only when the closure proof shows:

- the review packet, JSON metadata, live-output evidence, checker, and bundle
  URLs exist;
- pre-gate lead-review assignment, round 1, correction log, and round 2 exist;
- lead review is PASS or PASS WITH FLAGS;
- no human-interview or gate-closure records exist;
- no source exit-ticket data, generated output, engine code, protected
  references, target-exercise fields, or candidate storage changed;
- the packet checker, sprint validators, and report tests listed above pass;
- packet and cited evidence are committed and pushed before the human interview.

## Rollback plan

Rollback removes only the GATE-L1.7B-Q2 packet-prep files, checker, metadata,
bundle URLs, roadmap row updates, and generated map/index refreshes created by
this sprint.

Do not revert the closed `L1.7B-Q2` implementation or unrelated user files.

## Human review required

Human review is required to close `GATE-L1.7B-Q2`, but the human interview is
not conducted in this packet-prep sprint. The later interview must show the
full question list first, ask calibration questions, then ask one binding
question at a time.

# Sprint GATE-ENGINE-1: Four-Engine Operational Integration Review

Date: 2026-05-31

Status: planned active human-review gate preparation.

## Goal

Prepare and run the pre-interview packet stage for `GATE-ENGINE-1`, the
human-review gate that must inspect whether the shared route layer, shared
task shell, graph/table route, math/calculation route, reasoning route,
advisory short check, and target-equivalent exit-ticket boundary now form one
coherent student-facing practice system.

This sprint stage prepares the review packet, live-output evidence, planned
questions, stop conditions, deterministic checker, and pre-gate lead review.
It does not record human answers, close the gate, authorize generated lesson
output, authorize implementation, or authorize product use.

## Context

`GAME-ARCH-2` closed with the integrated practice-engine architecture plan:
route-layer API, task-shell API, module boundaries, file-level
keep/wrap/deprecate/rebuild inventory, state ownership, feedback ownership,
target-operation coverage, and a `GATE-ENGINE-1` checklist.

Recent work has moved the practice system from architecture-only progress to
visible operational progress:

- `SKILLMAP-OP-1` made route panels visible in generated Book 1 output.
- `GRAPH-UX-2` integrated the shared task shell into the live `1.1.3`
  graph/table route.
- `MATH-UX-2` integrated the shared task shell into the live `1.1.2`
  calculation/index route.
- `REASON-UX-2` integrated the shared task shell into the live reasoning
  routes.
- `GAME-ARCH-1` decided not to rebuild everything, but to keep the route
  layer, keep the task shell, keep/refactor graph as reference pattern,
  refactor math and reasoning, keep the short check advisory, and rebuild or
  remove only duplicate paths that cannot consume the shared route and task
  shell cleanly.

The next required step is not more implementation. It is a human review of
live rendered output and the architecture evidence before further engine
scale, controlled production reliance, or target-equivalent checkpoint
reliance.

## Quality Standard

The quality floor is a review packet that makes the student-facing evidence
auditable. It must show the rendered output surfaces to inspect, the
specification requirements being tested, the proof needed for each route, the
review gate that will judge quality, and the follow-up decisions that remain
blocked.

The packet must not treat contracts, validators, or screenshots alone as
student-facing proof. The human gate must be able to inspect live rendered
output, then decide whether each component is keep, refactor, rebuild, or
hold. Any omitted requirement must be named as follow-up work or a stop
condition.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared route layer is visible and coherent | Current Book 1 `1.1.1`, `1.1.2`, and `1.1.3` route surfaces and GAME-ARCH-2 route API | Review packet asks whether paragraph target, recommended focus, local progress, practice link, and no internal-code policy are visible | planned |
| Shared task shell is the default for overlapping task families | GRAPH-UX-2, MATH-UX-2, and REASON-UX-2 route-output validators and route proofs | Review packet asks whether task families are rendered through the shared shell rather than duplicated UI | planned |
| Graph/table route is reference pattern but not target-equivalent proof | `GRAPH-UX-2-student-route-proof.md` and route-output validator | Human reviewer decides keep/refactor/rebuild/hold for graph route and graph checkpoint boundary | planned |
| Math route is credible but must align to operation chain | `MATH-UX-2-student-route-proof.md`, target-operation coverage model | Human reviewer decides whether math can proceed by refactor around target chain or needs rebuild/hold | planned |
| Reasoning route has richer self-check but needs answer-form quality path | `REASON-UX-2-student-route-proof.md`, answer-form boundary evidence | Human reviewer decides whether reasoning can proceed by answer-form refactor or needs rebuild/hold | planned |
| Advisory short check remains useful but non-proof | product specs, GAME-ARCH-1 boundary, GAME-ARCH-2 architecture map | Human reviewer confirms short check may advise next action but cannot replace target-equivalent exit ticket | planned |
| Target-equivalent exit ticket remains separate | product specs, target-operation coverage model, no `1.1.2`/`1.1.3` exit-ticket pages | Human reviewer confirms GATE-ENGINE-1 does not authorize completion language or target-equivalent claims | planned |
| Gate has pre-interview lead review | Lead-review assignment, round 1, corrections, and round 2 exist before human interview | Deterministic checker verifies pre-gate lead-review artifacts and packet status before interview | planned |
| Product boundaries remain intact | Packet authority flags, scope-language checks, protected-surface diff checks | No diagnostics, adaptive routing, mastery, sequencing, summative, AI, PV, Scale Gate 1, or product use | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a live-output evidence summary for the gate | `include_now` | The gate must inspect rendered output, not architecture docs only. |
| Add exact calibration and review questions | `include_now` | Human-review interviews require full question visibility and one-at-a-time answer recording. |
| Add a deterministic review-packet checker | `include_now` | The stricter process needs proof that the packet cannot bypass lead review or product boundaries. |
| Add pre-gate lead-review cycle before interview | `include_now` | Repo protocol now requires lead review before a human gate interview. |
| Conduct the human interview in the same unpushed local state | `reject_scope_creep` | Human review may not start until the packet and cited evidence are pushed. |
| Close the gate or authorize engine implementation | `defer_named_follow_up` | Closure requires recorded human answers, pattern analysis, targeted follow-ups if needed, and explicit confirmation. |

## Allowed paths

- `reports/sprints/GATE-ENGINE-1-plan.md`
- `reports/sprints/GATE-ENGINE-1-baseline.md`
- `reports/sprints/GATE-ENGINE-1-planning-review.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-assignment.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-round1.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-corrections.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-round2.md`
- `references/data/sprints/GATE-ENGINE-1.plan.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/review-packet.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/review-packet.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-evidence.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-evidence.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/bundle-urls.md`
- `build-scripts/review-gates/check-gate-engine1-review-packet.js`
- generated repository maps, URL indexes, and internal dashboard files required
  for remote reviewer navigation
- platform and lesson roadmaps only if needed to mark the packet as
  review-ready while keeping the gate open

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- generated Book 1 HTML, CSS, JS, or data files
- engine implementation rewrites or refactors
- target-exercise `question_type`, `answer_form`, or mapping writes
- unit minting, unit updates, unit splits, or unit deprecation
- human-interview or gate-closure records before the packet is pushed and the
  human review actually starts
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/GAME-ARCH-2-result.md`
- `reports/sprints/GAME-ARCH-2-gate-engine1-checklist.md`
- `reports/sprints/GAME-ARCH-2-architecture-map.md`
- `reports/sprints/GAME-ARCH-2-route-api.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-file-disposition.md`
- `reports/sprints/GAME-ARCH-2-state-ownership.md`
- `reports/sprints/GAME-ARCH-2-feedback-ownership.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/GAME-ARCH-1-student-path-trace.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-screenshot-manifest.md`
- `reports/sprints/MATH-UX-2-screenshot-manifest.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`
- current generated Book 1 output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` as read-only
  inspection evidence

## Outputs

- `reports/sprints/GATE-ENGINE-1-plan.md`
- `reports/sprints/GATE-ENGINE-1-baseline.md`
- `reports/sprints/GATE-ENGINE-1-planning-review.md`
- `references/data/sprints/GATE-ENGINE-1.plan.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/review-packet.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/review-packet.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-evidence.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-evidence.json`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/bundle-urls.md`
- `build-scripts/review-gates/check-gate-engine1-review-packet.js`
- `reports/sprints/GATE-ENGINE-1-lead-review-assignment.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-round1.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-corrections.md`
- `reports/sprints/GATE-ENGINE-1-lead-review-round2.md`

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before preparing the packet. Stop
   if `GAME-ARCH-2` is not closed and pushed, or if the active roadmaps do not
   show `GATE-ENGINE-1` as the next gate.
2. Build the live-output evidence summary from current route-output
   validators, route-proof reports, screenshot manifests, and read-only
   generated Book 1 paths. Stop if evidence would require regenerating lesson
   output or editing generated files.
3. Draft the review packet with calibration questions, the full planned
   question list, stop conditions, and future interview protocol. The packet
   must say the human review has not started and that all cited evidence must
   be pushed before interview.
4. Add a deterministic checker for the packet. It must fail if pre-gate lead
   review is missing, if product authority flags are true, if live-output
   evidence is absent, if planned questions are missing, or if closure/human
   answer records are written prematurely.
5. Run sprint-plan and planned-bundle checks, route-output validators,
   scope-language checks, and the gate-packet checker as far as possible before
   lead review. If the checker requires lead review, run it after the lead
   review artifacts exist.
6. Assign the packet to the lead reviewer agent for pre-gate review. Record
   round 1. If the reviewer returns REVISE, FAIL, or PAUSE, apply corrections
   or stop and report the blocker.
7. Record the correction log and send the corrected packet back to the lead
   reviewer for round 2. Stop if round 2 is not PASS or PASS WITH FLAGS.
8. Emit gate bundle URLs, refresh repository maps/indexes, run final planned
   validators, fetch/prune remotes, commit, and push before any human review
   starts.
9. After push, the human review must show the full question list, ask
   calibration questions, ask one question at a time, record each answer, run
   pattern analysis, ask targeted follow-ups if needed, draft a closure
   proposal only after evidence is complete, and require explicit human
   confirmation before writing a closure record or authorizing downstream
   scope.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-ENGINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-ENGINE-1
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/review-gates/check-gate-engine1-review-packet.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-ENGINE-1-four-engine-operational-integration
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

This sprint stage closes only as review-packet-ready after these proof items:

- plan, baseline, plan JSON, live-output evidence, review packet, bundle URLs,
  and deterministic checker exist;
- route-output validators pass for graph, math, and reasoning;
- pre-gate lead-review assignment, round 1, correction log, and round 2 exist;
- pre-gate lead review is PASS or PASS WITH FLAGS;
- review packet status says the human interview has not started;
- no human-interview, gate-closure, engine implementation, generated lesson
  output, source exit-ticket data, protected reference mutation, target
  fields, or product authority has been created;
- packet and cited evidence are committed and pushed before the human
  interview starts.

## Rollback plan

Revert the GATE-ENGINE-1 packet-prep commit. Rollback removes only the
GATE-ENGINE-1 plan, baseline, lead-review records, review-packet artifacts,
packet checker, bundle URLs, and generated map/index refreshes.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage during rollback.

## Human review required

Human review is required to close `GATE-ENGINE-1`, but it is not conducted in
this local packet-prep stage.

The human interview may start only after the review packet, pre-gate lead
review, bundle URLs, and cited evidence are committed and pushed to the normal
remote branch. The later interview must show the full question list first,
then ask calibration questions and binding questions one at a time.

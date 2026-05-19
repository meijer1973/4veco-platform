# Sprint GATE-CP6: Year-1 Paragraph Coverage Routing Decision

## Goal

Record the CP-6 human-review answer set as a formal routing decision and open bounded remediation lanes without closing CP-6, closing Year 1, mutating protected references, mutating lesson output, promoting target exercises, replacing placeholders, or minting units.

This sprint completes the human-answer recording step prepared by REF-CP6. It deliberately stops before any CP-6 closure proposal because the human answers say the evidence is not closure-ready.

## Context

REF-CP6 prepared `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md` with nine planned CP-6 questions and a future interview protocol. The reviewer has now supplied a full answer set after the full question list was visible in the active review packet.

The answer pattern is clear: CP-6 and Year 1 must remain open; active v5 should drive lesson-side remediation; placeholders need reviewed integration target exercises; nine backfill candidates need classification before mutation; `1.1.3` Part A `FLAG` blocks unconditioned closure; graph-heavy records need current review evidence; migrated target-exercise records cannot be promoted from current evidence; and protected mutation or closure is not authorized.

The output should make the gate decision easy for off-site GitHub reviewers to inspect. It should also move the roadmap to the first bounded remediation lane, `CP.6a`, while preserving all stop conditions.

## Allowed paths

- `reports/sprints/GATE-CP6-plan.md`
- `references/data/sprints/GATE-CP6.plan.json`
- `reports/sprints/GATE-CP6-baseline.md`
- `references/data/sprints/GATE-CP6.result.json`
- `reports/sprints/GATE-CP6-result.md`
- `reports/sprints/GATE-CP6-diff-summary.md`
- `reports/sprints/GATE-CP6-lead-review-assignment.md`
- `reports/sprints/GATE-CP6-lead-review-round1.md`
- `reports/sprints/GATE-CP6-lead-review-corrections.md`
- `reports/sprints/GATE-CP6-lead-review-round2.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/bundle-urls.md`
- `build-scripts/review-gates/check-gate-cp6-routing-decision.js`
- generated reports, maps, inventories, and URL indexes when refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.51-ref-cp6-remediation-readiness.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- unit minting or machine registry mutation
- target-exercise promotion to `reviewed_final`
- placeholder replacement, promotion, or finalization
- CP-6 closure or Year-1 closure
- writing a CP-6 closure record
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output

## Inputs

- User-supplied CP-6 review answers from 2026-05-19.
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.json`
- `references/data/sprints/REF-CP6-remediation-readiness.json`
- `reports/reference-planning/REF-CP6-remediation-readiness.md`
- `reports/reference-planning/REF-CP6-blocker-routing.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A formal `human-interview.md` and `human-interview.json` that record the answer set question by question as a batch human response after the full question list was shown.
- A `gate-routing-decision.md` and `gate-routing-decision.json` that record the decision status as `routing_decision_recorded_not_closed`.
- A remediation-lanes artifact that opens five bounded lanes: `CP.6a`, `CP.6b`, `CP.6c`, `CP.6d`, and `CP.6e`.
- A read-only validator that fails if the artifacts close CP-6, close Year 1, authorize mutation, omit an answer, omit a lane, or write a closure record.
- Roadmap and roadmap-version-index updates that move `GATE-CP6` to closed and make `CP.6a` the active top sprint.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before writing the gate decision artifacts. Stop if the REF-CP6 review packet is missing or if the active roadmap row for `GATE-CP6` is missing.
2. Treat the user-supplied CP-6 answers as the human-review answer set because the full planned calibration question list was visible in the active packet before the response. Record the mode as batch human review response after full question list was shown.
3. Record each answer separately in `human-interview.md` and `human-interview.json`; preserve the distinction between answer recording and closure. The answer recording must state that no protected mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, CP-6 closure, or Year-1 closure is authorized.
4. Run pattern analysis across the answers. Stop if any answer authorizes protected mutation, student diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, or closure. Ask targeted follow-ups only if contradictions appear; otherwise record that no targeted follow-ups are needed for routing.
5. Record that no closure proposal is drafted in this sprint. A later closure proposal requires remediation evidence from the bounded lanes and explicit human confirmation; this sprint only records routing.
6. Write the remediation-lane artifacts with the five lanes named by the human answer set. Each lane must include allowed action, blocked action, evidence needed, stop condition, and whether it may mutate protected references or lesson output now. All five lanes must say no immediate mutation.
7. Write a validator for the GATE-CP6 routing artifacts and run it before roadmap closure. The validator must verify that `gate-closure.json` does not exist for this gate.
8. Archive the prior roadmap version, update the active roadmap to `v2.52-gate-cp6-routing-decision`, move `GATE-CP6` to Closed Sprints as a non-closing routing gate, and place `CP.6a` at the top of the Sprint Ledger followed by `CP.6b` through `CP.6e`.
9. Run acceptance tests and refresh normal repository maps/indexes so GitHub reviewers see current state.
10. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/GATE-CP6-lead-review-round1.md`.
11. Apply required corrections or explicitly record that no substantive correction was required. Log the correction pass in `reports/sprints/GATE-CP6-lead-review-corrections.md`.
12. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/GATE-CP6-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
13. Complete the deterministic bundle check, fetch/prune remote, refresh repository maps if needed, commit, tag, push, and report the pushed hash. The only allowed next sprint after this is `CP.6a` unless the user deliberately changes the roadmap.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-CP6-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-CP6
node build-scripts/review-gates/check-gate-cp6-routing-decision.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-CP6-year-1-paragraph-coverage
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/GATE-CP6-result.md
node build-scripts/sprints/check-sprint-bundle.js GATE-CP6 --complete
```

## Rollback plan

Revert the GATE-CP6 implementation commit. Because this sprint is non-mutating, rollback should remove only sprint artifacts, human answer/routing artifacts, remediation-lane records, the read-only validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

Human review is required and is recorded in this sprint as `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`.

The full question list was visible in the review packet before the reviewer supplied the answer set. The answers are recorded as a batch human review response after full question list was shown.

This human review does not authorize CP-6 closure, Year-1 closure, protected reference mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, unit minting, or student-facing/product-use claims. A later closure proposal requires remediation evidence and explicit human confirmation.

The structural lead-review cycle is still required for sprint closure. It is an internal review/recheck procedure and does not replace the human CP-6 routing decision.

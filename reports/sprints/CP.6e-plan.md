# Sprint CP.6e: Focused 1.1.3 Part A Re-Review

## Goal

Perform the focused CP-6 Part A re-review for `1.1.3 Grafieken en tabellen` and record an explicit clear-or-fail decision for the remaining Part A `FLAG`.

CP.6e is a non-mutating review-decision sprint. It may read the live lesson output, Part A review file, quality-ref, generated Part A markdown/PDF/HTML surfaces, CP.6d evidence, and CP-6 gate records. It must not hand-edit lesson output, lesson quality refs, protected references, target-exercise records, machine registries, or owned blueprint sources. It must not close CP-6, close Year 1, promote target exercises, finalize placeholders, mint units, or authorize student-facing/product use.

## Context

GATE-CP6 answered that the remaining `1.1.3` Part A `FLAG` blocks unconditioned CP-6 closure. CP.6d confirmed the live quality-ref still records `partA.review.verdict: "FLAG"` for `1.1.3`.

The current known Part A flags are:

- figure numbering in Part A is non-sequential;
- `opgaven.md` repeats the worked example for standalone exercise use.

CP.6e must recheck the actual live Part A files. If the flagged issue is resolved, CP.6e may record `part_a_flag_cleared: true` as evidence for a later closure proposal. If the issue remains, CP.6e must record an explicit fail/blocked decision and route the needed lesson-side remediation without patching generated lesson output by hand.

## Allowed paths

- `reports/sprints/CP.6e-plan.md`
- `references/data/sprints/CP.6e.plan.json`
- `reports/sprints/CP.6e-baseline.md`
- `reports/sprints/CP.6e-planning-review.md`
- `build-scripts/references/build-cp6e-113-part-a-rereview.js`
- `build-scripts/review-gates/check-cp6e-113-part-a-rereview.js`
- `references/data/sprints/CP.6e-113-part-a-rereview.json`
- `reports/reference-planning/CP.6e-113-part-a-rereview.md`
- `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`
- `references/data/sprints/CP.6e.result.json`
- `reports/sprints/CP.6e-result.md`
- `reports/sprints/CP.6e-diff-summary.md`
- `reports/sprints/CP.6e-lead-review-assignment.md`
- `reports/sprints/CP.6e-lead-review-round1.md`
- `reports/sprints/CP.6e-lead-review-corrections.md`
- `reports/sprints/CP.6e-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.58-cp6d-graph-heavy-evidence-upgrade.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths and actions

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- target-exercise promotion
- placeholder replacement or finalization
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output

## Inputs

- `references/reference-team-roadmap.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- GATE-CP6 recorded human-answer artifacts under `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/`
- `references/data/sprints/CP.6d-graph-heavy-evidence.json`
- `reports/reference-planning/CP.6d-graph-heavy-evidence.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-review.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-quality-ref.yaml`
- current `1.1.3` Part A markdown, HTML, PDF, assets, and build script in the live lesson repo

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable CP.6e re-review JSON for the focused `1.1.3` Part A flag.
- A Markdown re-review report with the evidence, clear/fail decision, closure consequences, and remaining route.
- A remediation handoff if the flag is not cleared.
- A read-only validator that fails if CP.6e claims protected mutation, lesson mutation, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, Year-1 closure, or product authorization.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log before generating CP.6e outputs. Stop if `CP.6e` is not present as the active roadmap row or if CP.6d evidence is missing.
2. Confirm source boundaries. Treat lesson output and review files as read-only evidence; do not edit `../4veco-lessen/` in CP.6e.
3. Recheck the current `1.1.3` Part A files for the specific flagged items:
   - figure references appear in sequential pedagogical order;
   - the repeated worked example in `opgaven.md` is either accepted as standalone-exercise scaffolding or identified as a blocker.
4. Record the current quality-ref Part A state and the current exact Part A review state.
5. Emit a clear-or-fail decision:
   - `cleared` only if the live files no longer contain a blocking Part A flag;
   - `failed_clearance` if the live files still contain the blocking issue;
   - `blocked_no_evidence` if required files are missing.
6. If clearance fails, write a remediation handoff that names the exact lesson-side issue and states that correction must happen through an authorized lesson-side regeneration/remediation workflow, not a hand patch.
7. Run the CP.6e validator. Stop if any artifact claims protected mutation, lesson-output mutation, quality-ref hand patching, target-exercise promotion, placeholder finalization, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, CP-6 closure, Year-1 closure, or student-facing output.
8. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6e-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6e-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6e-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. If CP.6e clears the flag, move the next planned lane to the active row. If CP.6e fails clearance, keep CP-6 blocked and make the next operational action a lesson-side remediation route or explicit human decision, not a CP-6 closure proposal.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6e-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6e
node build-scripts/references/build-cp6e-113-part-a-rereview.js
node build-scripts/review-gates/check-cp6e-113-part-a-rereview.js
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6e-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6e --complete
npm.cmd test
```

## Rollback plan

Revert the CP.6e implementation commit. Because CP.6e is non-mutating, rollback removes only sprint artifacts, re-review reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6e. GATE-CP6 already supplied the human decision that the `1.1.3` Part A flag must be cleared or explicitly failed before unconditioned closure.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.

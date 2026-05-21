# Sprint CP.6f: 1.1.3 Part A Remediation Recheck

## Goal

Perform the focused references-side recheck after lesson-team sprint `L-CP6E` and decide whether the `1.1.3 Grafieken en tabellen` Part A figure-numbering blocker is cleared.

CP.6f is a non-mutating recheck sprint. It may read the live lesson output, lesson archive records, updated Part A review file, updated quality-ref, CP.6e evidence, CP.6d evidence, and CP-6 gate records. It must not hand-edit lesson output, lesson review files, lesson quality refs, protected references, target-exercise records, machine registries, or owned blueprint sources. It must not close CP-6, close Year 1, promote target exercises, finalize placeholders, mint units, or authorize student-facing/product use.

## Context

CP.6e failed clearance because the live `1.1.3` Part A paragraph first mentioned figures in the order `1 -> 3 -> 2`. CP.6e routed lesson-side remediation. Lesson-team sprint `L-CP6E` now reports that the paragraph, regenerated HTML, and regenerated PDF first mention figures in the order `1 -> 2 -> 3`; it also reports updated Part A review and quality-ref evidence.

CP.6f must verify the actual repository state, not only the handoff report. If the live evidence matches the handoff, CP.6f may record the `1.1.3` Part A figure-numbering blocker as cleared for later CP-6 closure readiness analysis. This still does not close CP-6 or Year 1 because other CP-6 lanes and target-exercise conditions remain separate evidence.

## Allowed paths

- `reports/sprints/CP.6f-plan.md`
- `references/data/sprints/CP.6f.plan.json`
- `reports/sprints/CP.6f-baseline.md`
- `reports/sprints/CP.6f-planning-review.md`
- `build-scripts/references/build-cp6f-113-part-a-recheck.js`
- `build-scripts/review-gates/check-cp6f-113-part-a-recheck.js`
- `references/data/sprints/CP.6f-113-part-a-recheck.json`
- `reports/reference-planning/CP.6f-113-part-a-recheck.md`
- `references/data/sprints/CP.6f.result.json`
- `reports/sprints/CP.6f-result.md`
- `reports/sprints/CP.6f-diff-summary.md`
- `reports/sprints/CP.6f-lead-review-assignment.md`
- `reports/sprints/CP.6f-lead-review-round1.md`
- `reports/sprints/CP.6f-lead-review-corrections.md`
- `reports/sprints/CP.6f-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.59-cp6e-113-part-a-failed-clearance.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

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
- GATE-CP6 recorded human-answer artifacts under `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/`
- `references/data/sprints/CP.6e-113-part-a-rereview.json`
- `reports/reference-planning/CP.6e-113-part-a-rereview.md`
- `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`
- `../4veco-lessen/archive/sprints/L-CP6E/L-CP6E-sprint-plan.md`
- `../4veco-lessen/archive/sprints/L-CP6E/L-CP6E-technical-qa-report.md`
- `../4veco-lessen/archive/sprints/L-CP6E/L-CP6E-closure-log.md`
- `../4veco-lessen/archive/sprints/L-CP6E/L-CP6E-handoff-to-references.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-review.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-quality-ref.yaml`
- current `1.1.3` Part A markdown, HTML, PDF, assets, and build script in the live lesson repo

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable CP.6f recheck JSON for the focused `1.1.3` Part A blocker.
- A Markdown recheck report with the evidence, clearance decision, closure consequences, and remaining route.
- A read-only validator that fails if CP.6f claims protected mutation, lesson mutation, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, Year-1 closure, or product authorization.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log before generating CP.6f outputs. Stop if `CP.6f` is not present as the active roadmap row or if CP.6e evidence or L-CP6E lesson archive evidence is missing.
2. Confirm source boundaries. Treat lesson output, lesson review files, and lesson quality refs as read-only evidence; do not edit `../4veco-lessen/` in CP.6f.
3. Recheck the current `1.1.3` Part A markdown, HTML, and PDF for figure first-use order. The focused blocker is cleared only if all checked surfaces first use figures as `1 -> 2 -> 3`.
4. Record the current quality-ref Part A state, current exact Part A review state, L-CP6E archive state, lesson commit SHA, and platform commit SHA used for the recheck.
5. Emit a clear-or-fail decision:
   - `cleared` only if required evidence exists, figure order is sequential in markdown/HTML/PDF, and the updated review/quality-ref no longer carry the figure-numbering blocker;
   - `failed_clearance` if the live files still contain the blocking issue;
   - `blocked_no_evidence` if required files or lesson archive records are missing.
6. Run the CP.6f validator. Stop if any artifact claims protected mutation, lesson-output mutation, quality-ref hand patching, target-exercise promotion, placeholder finalization, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, CP-6 closure, Year-1 closure, or student-facing output.
7. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
8. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6f-lead-review-round1.md`.
9. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6f-lead-review-corrections.md`.
10. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6f-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
11. If CP.6f clears the blocker, close CP.6f in the roadmap and make EX-0 the next active design sprint. If CP.6f fails clearance, keep CP-6 blocked and route another lesson-side remediation or explicit human decision.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6f-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6f
node build-scripts/references/build-cp6f-113-part-a-recheck.js
node build-scripts/review-gates/check-cp6f-113-part-a-recheck.js
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen"
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6f-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6f --complete
npm.cmd test
```

## Rollback plan

Revert the CP.6f implementation commit. Because CP.6f is non-mutating, rollback removes only sprint artifacts, recheck reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6f. GATE-CP6 already supplied the human decision that the `1.1.3` Part A flag must be cleared or explicitly failed before unconditioned closure.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.

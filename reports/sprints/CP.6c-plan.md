# Sprint CP.6c: Year-1 MTU Backfill Classification

## Goal

Classify the nine Year-1 MTU backfill candidates from REF-CT1 and the CP-6 human gate against the actual current MTU registry.

CP.6c is non-mutating. It may map candidates to existing live units, classify true missing units, identify merge candidates, or defer non-essential candidates. It must not edit `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or lesson output. It must not mint units, authorize CLI mutation, close CP-6, close Year 1, or authorize student-facing/product use.

## Context

GATE-CP6 answered that each of the nine Year-1 backfill candidates must be reviewed individually as one of:

- true missing unit;
- existing-unit mapping;
- merge candidate;
- defer candidate.

The gate also said no mutation is authorized now. That means CP.6c must check the current live registry first. Earlier reports may be stale because units A45 through A51 and related graph/source operations have already been added through prior governed work.

## Allowed paths

- `reports/sprints/CP.6c-plan.md`
- `references/data/sprints/CP.6c.plan.json`
- `reports/sprints/CP.6c-baseline.md`
- `reports/sprints/CP.6c-planning-review.md`
- `build-scripts/references/build-cp6c-mtu-backfill-classification.js`
- `build-scripts/review-gates/check-cp6c-mtu-backfill-classification.js`
- `references/data/sprints/CP.6c-mtu-backfill-classification.json`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- `references/data/sprints/CP.6c.result.json`
- `reports/sprints/CP.6c-result.md`
- `reports/sprints/CP.6c-diff-summary.md`
- `reports/sprints/CP.6c-lead-review-assignment.md`
- `reports/sprints/CP.6c-lead-review-round1.md`
- `reports/sprints/CP.6c-lead-review-corrections.md`
- `reports/sprints/CP.6c-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.56-cp6b-target-exercise-review.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
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
- GATE-CP6 human answer and routing records under `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `references/machine/micro-teaching-units.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable CP.6c classification JSON with one row per REF-CT1 Year-1 backfill candidate.
- A Markdown classification report that distinguishes existing mappings, true missing units, merge candidates, and defer candidates.
- A read-only validator that fails if CP.6c claims protected mutation, unit minting, CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, lesson-output mutation, or product authorization.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log before generating CP.6c outputs. Stop if `CP.6c` is not present as the active roadmap row or if GATE-CP6 routing evidence is missing.
2. Confirm source boundaries. Treat `references/machine/micro-teaching-units.json` as read-only live registry evidence; do not edit it in CP.6c.
3. Build the classification from actual current source data, not stale reports. The generated JSON must classify exactly the nine REF-CT1 `missing_flags`.
4. For each candidate, record existing live-unit checks, deprecated-unit caveats where relevant, classification rationale, and whether a later CLI-backed mutation sprint may be needed.
5. Record that no mutation is authorized now. Even a true missing candidate may only become a later mutation proposal after review.
6. Run the CP.6c validator. Stop if any artifact claims protected mutation, unit minting, CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.
7. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
8. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6c-lead-review-round1.md`.
9. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6c-lead-review-corrections.md`.
10. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6c-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
11. Mark CP.6c complete only as a non-mutating classification sprint. Move `CP.6d` to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, push, tag, and report the pushed hash.
12. If CP.6c evidence is later used inside a human gate, run a real gate procedure: show the full calibration question list first, ask one question at a time, record each answer before continuing, run pattern analysis after initial answers, ask targeted follow-ups for ambiguity, draft a closure proposal only after evidence is complete, and require explicit human confirmation before writing any gate-closure record.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6c-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6c
node build-scripts/references/build-cp6c-mtu-backfill-classification.js
node build-scripts/review-gates/check-cp6c-mtu-backfill-classification.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6c-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6c --complete
```

## Rollback plan

Revert the CP.6c implementation commit. Because CP.6c is non-mutating, rollback removes only sprint artifacts, classification reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6c. GATE-CP6 already supplied the human decision to classify the nine candidates before mutation.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.

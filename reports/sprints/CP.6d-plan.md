# Sprint CP.6d: Book 1 Graph-Heavy Evidence Upgrade

## Goal

Upgrade the CP-6 evidence ledger for graph-heavy active-v5 Book 1 records by checking the actual current lesson repository after L-CP6A, not stale REF-CT2 assumptions.

CP.6d is a non-mutating evidence sprint. It may read lesson output, review files, quality refs, reference reports, and roadmap records. It must not hand-edit lesson output, protected reference data, target-exercise records, machine registries, or owned blueprint sources. It must not close CP-6, close Year 1, promote target exercises, finalize placeholders, mint units, or authorize student-facing/product use.

## Context

GATE-CP6 answered that graph-heavy Book 1 records require upgraded current Part A evidence and Part B evidence where companion artifacts exist, are used as evidence, or are in sprint scope. Legacy quality-ref evidence alone is not enough for CP-6 closure.

REF-CT2 remains useful as diagnostic history, but it predates L-CP6A and therefore contains stale lesson-side assumptions for `1.3.2` and `1.3.3`. CP.6d must verify the live lesson repository state directly. The current live Chapter 1.3 path is `1.3 Hoofdstuk Aanbod en marktevenwicht`, with `1.3.2 Marktevenwicht` and `1.3.3 Verschuivingen en nieuw evenwicht`.

## Allowed paths

- `reports/sprints/CP.6d-plan.md`
- `references/data/sprints/CP.6d.plan.json`
- `reports/sprints/CP.6d-baseline.md`
- `reports/sprints/CP.6d-planning-review.md`
- `build-scripts/references/build-cp6d-graph-heavy-evidence.js`
- `build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js`
- `references/data/sprints/CP.6d-graph-heavy-evidence.json`
- `reports/reference-planning/CP.6d-graph-heavy-evidence.md`
- `references/data/sprints/CP.6d.result.json`
- `reports/sprints/CP.6d-result.md`
- `reports/sprints/CP.6d-diff-summary.md`
- `reports/sprints/CP.6d-lead-review-assignment.md`
- `reports/sprints/CP.6d-lead-review-round1.md`
- `reports/sprints/CP.6d-lead-review-corrections.md`
- `reports/sprints/CP.6d-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.57-cp6c-mtu-backfill-classification.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths and actions

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- lesson-quality-ref hand patching
- companion review fabrication
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
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `references/data/sprints/CP.6c-mtu-backfill-classification.json`
- current lesson output and review files under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- L-CP6A handoff and closure evidence under `../4veco-lessen/archive/sprints/L-CP6A/`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable CP.6d evidence JSON with one row per graph-heavy active-v5 Book 1 paragraph.
- A Markdown evidence report that distinguishes current Part A review evidence, current Part B companion-review evidence, schema-versioned quality-ref evidence, legacy quality-ref evidence, and remaining closure blockers.
- A read-only validator that fails if CP.6d claims protected mutation, lesson mutation, fabricated reviews, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, Year-1 closure, or product authorization.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log before generating CP.6d outputs. Stop if `CP.6d` is not present as the active roadmap row or if GATE-CP6 routing evidence is missing.
2. Confirm source boundaries. Treat lesson output and review files as read-only evidence; do not edit `../4veco-lessen/` in CP.6d.
3. Build the evidence ledger from the actual current lesson repository. Exclude archived lesson paths and reject stale `1.3.2 Kostenstructuren` / `1.3.3 Opbrengsten` mappings as active-v5 evidence.
4. Record exactly nine graph-heavy active-v5 Book 1 records: `1.1.1`, `1.1.2`, `1.1.3`, `1.2.1`, `1.2.2`, `1.2.3`, `1.3.1`, `1.3.2`, and `1.3.3`.
5. For each record, classify evidence state:
   - current Part A review present or missing;
   - Part A verdict from the exact review file and/or quality-ref;
   - companion review present or missing;
   - whether companion evidence is required now because companion material exists, is used as evidence, or is in CP.6d scope;
   - quality-ref schema state;
   - target-exercise status and other known CP-6 blockers;
   - whether the record may count as CP-6 closure evidence now.
6. Record that current Part A evidence can upgrade the internal CP-6 evidence status ledger, but no record may be treated as CP-6 closure-ready if target-exercise final review, placeholder work, graph-heavy quality workflow, or CP.6e remains open.
7. Run the CP.6d validator. Stop if any artifact claims protected mutation, lesson-output mutation, fabricated review, target-exercise promotion, placeholder finalization, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.
8. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6d-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6d-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6d-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark CP.6d complete only as a non-mutating evidence-upgrade sprint. Move `CP.6e` to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, push, tag, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6d-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6d
node build-scripts/references/build-cp6d-graph-heavy-evidence.js
node build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6d-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6d --complete
```

## Rollback plan

Revert the CP.6d implementation commit. Because CP.6d is non-mutating, rollback removes only sprint artifacts, evidence reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6d. GATE-CP6 already supplied the human decision to upgrade graph-heavy evidence before closure.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.

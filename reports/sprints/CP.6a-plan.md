# Sprint CP.6a: Book 1 Chapter 1.3 Lesson-Side Alignment

## Goal

Produce a bounded, evidence-backed lesson-side alignment plan for the Book 1 `1.3.2` and `1.3.3` mismatch against active v5.

CP.6a is non-mutating. It identifies exactly what must change in the lesson-side Book 1 structure later, but it does not hand-edit lesson output, rebuild student-facing output, mutate active v5, close CP-6, close Year 1, promote target exercises, finalize placeholders, or mint units.

## Context

GATE-CP6 recorded the human routing decision: active v5 is the intended source, and the lesson side must be remediated before CP-6 can close. The relevant mismatch is concrete:

- active v5 `1.3.2` is `Marktevenwicht`;
- active v5 `1.3.3` is `Verschuivingen en nieuw evenwicht`;
- current lesson-side Book 1 Chapter 1.3 still has `1.3.2 Kostenstructuren` and `1.3.3 Opbrengsten`;
- current lesson-side Book 1 Chapter 1.4 already contains `1.4.1 Marktevenwicht` and `1.4.2 Verschuivingen en nieuw evenwicht`;
- active v5 moved `Kostenstructuren` to Book 2 `2.1.1` and `Opbrengsten, winst en break-even` to Book 2 `2.1.2`.

CP.6a must turn that evidence into a later implementation specification without changing generated lesson output now.

## Allowed paths

- `reports/sprints/CP.6a-plan.md`
- `references/data/sprints/CP.6a.plan.json`
- `reports/sprints/CP.6a-baseline.md`
- `reports/sprints/CP.6a-planning-review.md`
- `references/data/sprints/CP.6a.result.json`
- `references/data/sprints/CP.6a-lesson-side-alignment.json`
- `reports/reference-planning/CP.6a-lesson-side-alignment.md`
- `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js`
- `reports/sprints/CP.6a-result.md`
- `reports/sprints/CP.6a-diff-summary.md`
- `reports/sprints/CP.6a-lead-review-assignment.md`
- `reports/sprints/CP.6a-lead-review-round1.md`
- `reports/sprints/CP.6a-lead-review-corrections.md`
- `reports/sprints/CP.6a-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.52-gate-cp6-routing-decision.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- renaming, deleting, moving, or rebuilding lesson-side files or folders
- unit minting or machine registry mutation
- target-exercise promotion to `reviewed_final`
- placeholder replacement, promotion, or finalization
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
- GATE-CP6 human interview record under `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.json`
- `references/data/sprints/REF-CP6-remediation-readiness.json`
- `reports/reference-planning/REF-CP6-blocker-routing.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- read-only lesson evidence in `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable alignment JSON that records source titles, lesson-side titles, adjacent lesson evidence, displaced-topic destinations, blocked actions, and the later implementation path.
- A Markdown alignment plan that names the exact current lesson-side folders and the exact active-v5 target destinations.
- A read-only validator that fails if CP.6a claims lesson-output mutation, protected reference mutation, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, or Year-1 closure.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before writing alignment artifacts. Stop if `CP.6a` is not the active roadmap row or if GATE-CP6 routing evidence is missing.
2. Confirm source boundaries. Treat `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` as read-only source evidence; treat `../4veco-lessen` as read-only lesson evidence.
3. Gather active-v5 evidence for `1.3.2`, `1.3.3`, Book 2 `2.1.1`, and Book 2 `2.1.2`. Record the v5 migration origin for each relevant paragraph.
4. Gather current lesson-side evidence for Book 1 Chapter 1.3 and adjacent Chapter 1.4. Record folder names, chapter plan names, and existing review/quality-ref state for `1.4.1` and `1.4.2` because those are the current lesson-side equivalents of active-v5 `1.3.2` and `1.3.3`.
5. Build the alignment plan. It must separate three concerns: active-v5 target mapping, current lesson-side location of equivalent material, and displaced old topics that now belong in Book 2. Stop if the plan tries to solve target-exercise final review, MTU backfill classification, graph-heavy evidence upgrade, or `1.1.3` Part A review inside CP.6a.
6. Record the later implementation path as a future lesson-side regeneration/remediation task, not as manual output edits. The plan must require a later build/regeneration and validation step before CP-6 closure can count the mismatch as resolved.
7. Run the CP.6a validator. Stop if any artifact claims the mismatch is fully resolved, if any protected or lesson mutation is authorized, or if the current `1.4.1`/`1.4.2` flags are hidden.
8. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6a-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6a-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6a-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark CP.6a complete only as a non-mutating alignment-plan sprint. Move `CP.6b` to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, tag, push, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6a-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6a
node build-scripts/review-gates/check-cp6a-lesson-side-alignment.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6a-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6a --complete
```

## Rollback plan

Revert the CP.6a implementation commit. Because CP.6a is non-mutating, rollback removes only sprint artifacts, alignment reports, the read-only validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6a. GATE-CP6 already supplied the human decision that active v5 drives lesson-side remediation.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.

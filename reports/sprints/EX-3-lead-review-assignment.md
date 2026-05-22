# EX-3 Lead Review Assignment

Date: 2026-05-22

Reviewer: lead reviewer agent

## Assignment

Review Sprint EX-3, `Exam Coverage Dashboard`, as a reporting-only sprint.

## Scope

- `reports/sprints/EX-3-plan.md`
- `references/data/sprints/EX-3.plan.json`
- `reports/sprints/EX-3-baseline.md`
- `reports/sprints/EX-3-planning-review.md`
- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `build-scripts/references/check-exam-ingestion-coverage.js`
- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`
- generated report, dashboard, inventory, URL-index, and GitHub-agent index
  refreshes

## Review Questions

1. Does EX-3 remain reporting-only?
2. Does the generated report preserve the GATE-EX2 q3 `A61` correction and
   stale/incorrect `A15` note?
3. Does the generated report preserve the GATE-EX2 q19 `A42` correction, `D10`
   support, `A45` weak-support note, and blocking source/graph gaps?
4. Do q3 and q15 answer-skill needs remain visible?
5. Is q19 still blocked for full mapping and lesson handoff?
6. Is the new report wired into report validation and reference-health?
7. Were protected reference, external-source, machine-reference, authored,
   owned-blueprint, and lesson-output surfaces left unchanged?
8. Are validation commands adequate for sprint closure?

## Boundaries

The review must not authorize protected reference mutation, external-source
mutation, unit minting, operation-registry mutation, answer-skill mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery decisions, automatic sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student-facing output.

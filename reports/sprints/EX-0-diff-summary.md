# Sprint EX-0: Diff Summary

Generated: 2026-05-21

## Summary

EX-0 adds the first formal exam-ingestion contract for official CvTE exam-question overlays.

The main new contract surfaces are:

- schema: `references/schemas/exam-ingestion.schema.json`;
- data guidance: `references/data/exam-ingestion/README.md`;
- review procedure: `references/data/exam-ingestion/review-procedure.md`;
- validator: `build-scripts/references/check-exam-ingestion-contract.js`;
- future human-review packet: `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.*`.

## Added Files

- `references/schemas/exam-ingestion.schema.json`
- `references/data/exam-ingestion/README.md`
- `references/data/exam-ingestion/review-procedure.md`
- `build-scripts/references/check-exam-ingestion-contract.js`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.md`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.json`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/bundle-urls.md`
- `references/data/sprints/EX-0.plan.json`
- `references/data/sprints/EX-0.result.json`
- `reports/sprints/EX-0-baseline.md`
- `reports/sprints/EX-0-diff-summary.md`
- `reports/sprints/EX-0-lead-review-assignment.md`
- `reports/sprints/EX-0-lead-review-corrections.md`
- `reports/sprints/EX-0-lead-review-round1.md`
- `reports/sprints/EX-0-lead-review-round2.md`
- `reports/sprints/EX-0-plan.md`
- `reports/sprints/EX-0-planning-review.md`
- `reports/sprints/EX-0-result.md`
- `reports/sprints/EX-0-validation-log.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.60-cp6f-113-part-a-cleared.md`

## Updated Files

- `build-scripts/sprints/check-sprint-bundle.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated report JSON/Markdown projections
- `reports/internal-dashboard/*`
- `reports/github-agent-index-*`
- `reports/url-index.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `references/data/source-document-registry.json`

## Protected Surfaces

Protected surfaces were not changed:

- `references/external/`
- `references/machine/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`

Lesson output was not changed.

## Authority Boundaries

This sprint does not create real exam-ingestion overlay records. It does not close CP-6 or Year 1. It does not authorize target-exercise promotion, placeholder finalization, unit minting, protected mutation, external-source mutation, lesson-output mutation, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

# INSPECT-10B Lead Review Assignment

Status: assigned
Date: 2026-06-16
Sprint: `INSPECT-10B`

## Product End-State And Original Spec

- Product end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
  candidate sprint `INSPECT-10B`
- Controlling implementation gate:
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md`
  and
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json`

## Assignment

Perform REV-STD-1 lead review for the INSPECT-10B internal diagnostic
generator implementation.

Review must verify:

- exact INSPECT-10A source allowlist enforcement;
- exact INSPECT-10A output allowlist enforcement;
- required generated fields in JSON and Markdown;
- visible carried blockers for `1.2.2`, `1.2.4`, accessibility, support, and
  check-surface authority;
- refusal/stop behavior for forbidden requests;
- no evidence pack, teacher/school-facing pack, public/external output,
  package/CI/dashboard/quality-ref/Scale Gate integration, generated
  lesson-output mutation, source-registry mutation, personal-data processing,
  product-route adoption, diagnostics/mastery/PV, student-use, or product-use
  authority;
- no missing core requirement carried as PASS WITH FLAGS.

## Review Evidence

- `archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-planning-review.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-validation-log.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required Verdict

Lead review must return `PASS` before closure. `PASS WITH FLAGS` is not allowed
if any core requirement is missing.

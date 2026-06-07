# Sprint MTU-EVIDENCE-HARDEN-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/MTU-EVIDENCE-HARDEN-1-plan.md`

## Current audit state

The non-mutating audit ran before implementation edits.

In-memory MTU projection from `references/machine/micro-teaching-units.md`
matches the stored JSON projection:

- Total units: 256
- Live units: 253
- Deprecated units: 3
- Projection matches stored JSON: true

Existing read-only validators passed:

- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-skilltree-generator-readiness.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/reports/check-reference-health.js`

## Stale generated-report evidence

The MTU JSON projection is current, but generated report counts are stale:

- `reports/json/dag-integrity.json`: 238 total, 235 live, 3 deprecated
- `reports/json/needs-coverage.json`: 235 live
- `reports/json/terms-coverage.json`: 235 live
- `reports/json/procedure-coverage.json`: 235 live
- `reports/json/aspects-coverage.json`: 235 live
- `reports/json/dead-units.json`: 235 live
- `reports/json/reference-health.json`: 238 total, 235 live, 3 deprecated
- `reports/json/procedure-visual-coverage.json`: 247 live
- `reports/json/empty-needs-audit-summary.json`: 190 live

The baseline defect is generated-report freshness/check coverage, not protected
MTU source integrity.

## Data integrity notes

Protected reference data under `references/machine/` and
`references/external/` must not be hand-edited. This sprint may run intended
projection/report builders but may not mutate protected reference source data,
target exercises, source data, candidate storage, lesson output, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, product-wide use, or
student/product authority.

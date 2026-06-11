# Y1-FOUNDATION-REVIEW-1 Plan

Status: planned non-mutating Year 1 foundation review lane

## Purpose

Y1-FOUNDATION-REVIEW-1 prepares the first post-v6 review lane named by the
three-year blueprint: close the Year 1 foundation review lane using current
registry facts and target-exercise evidence.

This sprint does not close Year 1, promote target exercises, mutate protected
references, mint MTUs, or generate student-facing lesson output. It creates a
REV-STD-1-compliant review packet so a later human review can decide which
Book 1 foundation items are ready for targeted follow-up and which remain
blocked.

## Required Baselines

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Review standard: `reports/sprints/REV-STD-1-flag-disposition.md`
- Active Year 1 blueprint: `references/owned/course-blueprint-v5.md`
- Draft umbrella blueprint: `references/owned/course-blueprint-v6-three-year.md`
- Active target-exercise registry: `references/authored/course-target-exercises.json`
- Current Year 1 coverage baseline: `reports/reference-planning/REF-CT1-year1-coverage.md`
- MTU backfill classification: `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- Source boundary: `reports/reference-planning/REF-CT0-source-authority-boundary.md`
- MTU classification: `reports/reference-planning/REF-CT0-mtu-classification.md`

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan in the review packet.
2. Name the non-negotiable requirements in the review packet.
3. Include a core-requirement checklist.
4. Classify every finding using REV-STD-1 language.
5. For carried issues, include `blocks`, `does_not_block`, and `proof_required_to_close`.
6. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
7. Preserve v5 as the active detailed Year 1 baseline and v6 as umbrella planning context.
8. Do not count placeholders as reviewed-final evidence.
9. Do not treat migrated v4 records as reviewed-final v5 target quality.
10. Do not revive deprecated D04 or re-mint existing A45+ labels from rough planning prose.
11. Do not authorize protected machine, external, authored target-exercise, or lesson-output mutation.
12. Do not authorize Year 2/3 paragraph production from this lane.

## Deliverables

- `reports/reference-planning/Y1-FOUNDATION-REVIEW-1-review-packet.md`
- `reports/reference-planning/Y1-FOUNDATION-REVIEW-1-quality-log.md`
- `reports/sprints/Y1-FOUNDATION-REVIEW-1-result.md`
- Generated repository maps, URL index, dashboard, source manifest, document inventory, and source-document registry refreshed after the packet is written.

## Acceptance Checks

- The packet cites the product end-state and this plan.
- The packet names non-negotiables and includes a core-requirement checklist.
- The packet does not close Year 1 or CP-6.
- All active blockers have blocks / does_not_block / proof_required_to_close.
- Existing-unit mappings, merge candidates, defer candidates, and true missing-unit candidates are separated.
- `npm.cmd run check:platform` passes.
- REV/reference generated checks pass:
  - `node build-scripts/references/check-source-document-registry.js`
  - `node build-scripts/references/check-source-manifest.js`
  - `node build-scripts/references/check-document-inventory.js`
  - `node build-scripts/references/check-roadmap-version-index.js`
  - `node build-scripts/sprints/emit-url-index.js --check`
  - `node build-scripts/reports/validate-report-json.js`
  - `node build-scripts/references/check-mtu-evidence-layer.js`
  - `node build-scripts/ci/check-evidence-line-endings.js`

## Stop Boundary

Stop if the work requires editing:

- `references/machine/*`
- `references/external/*`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `../4veco-lessen`

Stop if a proposed output would authorize target-exercise promotion, Year 1
closure, CP-6 closure, generated lesson output, diagnostics, adaptive routing,
mastery decisions, automatic sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate authority, or student-facing
product use.

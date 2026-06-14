# Y1-PLACEHOLDER-TARGET-REVIEW-1 Plan

Status: planned non-mutating Book 1 placeholder target-exercise review packet

Task alias: `B1-PLACEHOLDER-TARGET-REVIEW-1`

## Purpose

Y1-PLACEHOLDER-TARGET-REVIEW-1 prepares the next operational lane named by
`Y1-FOUNDATION-REVIEW-1` and the lead-review alias
`B1-PLACEHOLDER-TARGET-REVIEW-1`: a REV-STD-1 review packet for the three
active v5 Book 1 gemengde-opgaven placeholder target-exercise records.

This sprint does not replace placeholders, promote target exercises, mutate
protected references, mint MTUs, close Year 1, close CP-6, or generate
student-facing lesson output. It prepares concrete candidate target exercises,
evidence, and review questions a later human/lead review needs before any
governed registry replacement can be proposed.

## Required Baselines

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Review standard: `reports/sprints/REV-STD-1-flag-disposition.md`
- Prior foundation packet: `reports/reference-planning/Y1-FOUNDATION-REVIEW-1-review-packet.md`
- Prior foundation result: `reports/sprints/Y1-FOUNDATION-REVIEW-1-result.md`
- Active Year 1 blueprint: `references/owned/course-blueprint-v5.md`
- Draft umbrella blueprint: `references/owned/course-blueprint-v6-three-year.md`
- Active target-exercise registry: `references/authored/course-target-exercises.json`
- Current Year 1 coverage baseline: `reports/reference-planning/REF-CT1-year1-coverage.md`
- Prior target-exercise design packet: `reports/reference-planning/CP.6b-target-exercise-review.md`
- MTU backfill classification: `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan in the review packet.
2. Name the non-negotiable requirements in the review packet.
3. Include a core-requirement checklist.
4. Classify every finding using REV-STD-1 language.
5. For carried issues, include `blocks`, `does_not_block`, and `proof_required_to_close`.
6. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
7. Keep `1.1.4`, `1.2.4`, and `1.3.4` as `placeholder_needs_review` until a later governed review/mutation lane replaces them.
8. Treat the CP.6b designs as draft review input only, not final target-exercise evidence.
9. Preserve v5 as the active detailed Year 1 baseline and v6 as umbrella planning context.
10. Do not authorize protected machine, external, authored target-exercise, or lesson-output mutation.
11. Do not authorize Year 1 closure, CP-6 closure, Scale Gate reliance, diagnostics, adaptive routing, mastery decisions, summative use, PV projection, or student-facing product use from this packet.

## Deliverables

- `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-review-packet.md`
- `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-quality-log.md`
- `reports/sprints/Y1-PLACEHOLDER-TARGET-REVIEW-1-result.md`
- Generated repository maps, URL index, dashboard, source manifest, document inventory, and source-document registry refreshed after the packet is written.

## Acceptance Checks

- The packet cites product end-state and this plan.
- The packet names non-negotiables and includes a core-requirement checklist.
- The packet classifies placeholder findings and includes `blocks`, `does_not_block`, and `proof_required_to_close`.
- The packet does not claim `PASS WITH FLAGS`.
- The packet separates draft integration designs from reviewed-final target exercises.
- The packet includes concrete candidate target exercises for `1.1.4`, `1.2.4`,
  and `1.3.4`, each with target context, subquestions, required prior skills,
  target operation chain, answer-form expectations, short answer model,
  evidence path, no-new-theory rationale, and human/lead review disposition.
- The packet does not edit `references/authored/course-target-exercises.json` or `../4veco-lessen`.
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

Stop if a proposed output would authorize placeholder replacement,
target-exercise promotion, Year 1 closure, CP-6 closure, generated lesson
output, diagnostics, adaptive routing, mastery decisions, automatic
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate authority, or student-facing product use.

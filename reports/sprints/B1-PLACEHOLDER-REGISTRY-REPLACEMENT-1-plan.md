# B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1 Plan

Status: planned governed authored-registry replacement

## Purpose

B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1 implements the next operation after the
merged PR #42 candidate packet: replace remaining Book 1 gemengde-opgaven
placeholder target records in `references/authored/course-target-exercises.json`
with reviewed candidate targets.

Live-main adjustment: `1.2.4` is already `reviewed_final` on current `main`
from INSPECT-9A. This sprint preserves that target and adds only the required
`mixed_target_profile` metadata so it satisfies the current mixed-target
validator. The sprint replaces the two still-placeholder records: `1.1.4` and
`1.3.4`.

## Required Baselines

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Review standard: `reports/sprints/REV-STD-1-flag-disposition.md`
- Accepted candidate packet: `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-review-packet.md`
- Candidate quality log: `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-quality-log.md`
- Active target registry: `references/authored/course-target-exercises.json`
- Mixed target standard: `references/authored/gemengde-opgaven-target-standard.md`
- Active Year 1 blueprint: `references/owned/course-blueprint-v5.md`
- Umbrella planning context: `references/owned/course-blueprint-v6-three-year.md`

## Non-Negotiable Requirements

1. Use v5 as active Year 1 baseline; v6 remains non-mutating umbrella context.
2. Replace only authored target-registry records needed for this lane.
3. Do not edit `references/machine/*` or `references/external/*`.
4. Do not generate lesson output.
5. Do not close Year 1, CP-6, Scale Gate, product-route adoption, diagnostics,
   mastery, PV, or student/product-use work.
6. Keep `1.2.4` term-free for normal/inferior-good terminology unless `1.2.2`
   is separately reviewed first.
7. Keep simultaneous-shift reasoning out of `1.3.4`; it remains a separate
   missing-unit lane.
8. Preserve CP.6c mapping dispositions for A45/A46, A47/A48, and A49/A51.
9. Include REV-STD-1 findings with blocks / does_not_block /
   proof_required_to_close for carried issues.
10. Do not use `PASS WITH FLAGS` to carry a missing core requirement.

## Deliverables

- Replace `1.1.4` and `1.3.4` placeholder records in
  `references/authored/course-target-exercises.json`.
- Preserve current `1.2.4` reviewed target while adding required
  `mixed_target_profile` metadata.
- Add this sprint plan, review packet, quality log, and result.
- Regenerate repository indexes, URL index, dashboard, source manifest,
  document inventory, and source-document registry.

## Acceptance Checks

- `node scripts/check-course-target-exercises-v5.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-mtu-evidence-layer.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

## Stop Boundary

Stop if the work requires editing `references/machine/*`,
`references/external/*`, generated lesson output, or any closure claim for Year
1, CP-6, Scale Gate, product-route adoption, diagnostics, mastery, PV, or
student/product-use work.

# GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1 Validation Log

Status: PASS locally after specialist corrections
Date: 2026-06-24

## Product End-State And Original Sprint/Gate Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Controlling roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## Final Validation Matrix

| Command | Result | Blocks |
|---|---|---|
| `node --check build-scripts/inspection/build-internal-overlay-prototype-planning.js` | PASS | no |
| `node --check build-scripts/inspection/check-internal-overlay-prototype-planning.js` | PASS | no |
| `node build-scripts/inspection/build-internal-overlay-prototype-planning.js --check` | PASS: internal overlay trial-planning output is current | no |
| `node build-scripts/inspection/check-internal-overlay-prototype-planning.js` | PASS: phases=4, jurisdictions=2, refusal_cases=43, decision=`PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT` | no |
| `npx.cmd jest build-scripts/inspection/check-internal-overlay-prototype-planning.test.js --runInBand` | PASS: 1 suite, 2 tests | no |
| `node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md` | PASS | no |
| `node build-scripts/inspection/check-selected-jurisdiction-deepening.js` | PASS: descriptors=2, schema_fixtures=8, crosswalk_rows=20, refusal_cases=31, decision=`PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING` | no |
| `node build-scripts/inspection/check-international-overlay-architecture.js` | PASS: descriptors=4, archetypes=4, crosswalk_rows=10, refusal_cases=31, decision=`PROCEED_TO_SELECTED_JURISDICTION_DEEPENING` | no |
| `node build-scripts/reports/validate-report-json.js` | PASS: 14 report(s) | no |
| `npm.cmd run check:scope-language` | PASS: active surfaces | no |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS: 152 entries | no |
| `node build-scripts/sprints/emit-url-index.js --check` | PASS: `reports/url-index.md` current | no |
| `node build-scripts/ci/check-evidence-line-endings.js` | PASS: scanned 90 text files, CRLF 0 | no |
| `git diff --check` | PASS | no |
| `npm.cmd run check:platform` | PASS: 64 suites passed, 947 tests passed, 16 suites/90 tests skipped; existing fixture-warning output only, exit code 0 | no |

## Validation Notes

- Local dependencies were installed to run the canonical platform script in this isolated worktree; `node_modules/` remains ignored and no dependency files were changed.
- The platform run prints existing fixture-warning diagnostics from repository tests but exits 0.
- Exact remote-head CI remains required after PR publication.

## Carried Issues

| Issue | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Exact-head CI is not yet available before PR publication. | `scale_blocker` | Human approval and merge. | Local validation and PR creation. | GitHub `validate-platform` success on the exact PR head. |
| Branch-protection checker and PR Readiness Reviewer proof are not yet available before PR publication. | `scale_blocker` | Human approval and merge. | Local validation and PR creation. | Run branch-protection checker with `ok: true` and PR Readiness Reviewer against the exact remote head. |
| Downstream product and school-facing authority remains blocked. | `scale_blocker` | Runtime execution, localized output, country editions, school/public/evidence-pack output, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, compliance, approval, OP0, PTA, summative, inspection-readiness, support-sufficiency, and accommodation-sufficiency claims. | Internal planning packet review. | Separate human authorization and specialist review for any later sprint. |

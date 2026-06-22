# GOAL-IQS-OVERLAY-ARCHITECTURE-1 Correction Log

Status: corrections resolved
Date: 2026-06-22

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec:
  `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`

## Non-Negotiable Requirements

- Correct generated source metadata in the generator, not by editing generated
  output directly.
- Keep all descriptor, report, schema, roadmap, and validation outputs
  deterministic.
- Preserve all blocked authority surfaces.
- Re-run currentness and refusal checks after any correction.

## Corrections

| Finding | Classification | Correction | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| England operating-guide metadata recorded only the 2025 use date while the live GOV.UK source showed updated 12 June 2026. | `quality_improvement_available` | Updated the generated source title/date in `build-scripts/inspection/build-international-overlay-architecture.js`; regenerated `references/data/inspection-standards/overlays/england.v0.json`. | Strong source-maintenance/currentness claims before correction. | Current internal architecture PASS. | `node build-scripts/inspection/check-international-overlay-architecture.js` PASS. |
| The initial checker over-rejected required REV-STD-1 wording in markdown and matched `--implicit-source` as `ci`. | `quality_improvement_available` | Kept REV-STD-1 wording allowed in markdown; tightened CI argument matching; preserved explicit `STOP_IMPLICIT_DISCOVERY`. | Checker credibility before correction. | Generated packet content. | Refusal cases PASS in overlay checker. |
| Scope-language check rejected roadmap use of “archetype-pilot report”. | `quality_improvement_available` | Changed the roadmap bullet to “archetype report,” preserving the internal architecture meaning without opening a product-pilot surface. | Active-surface scope-language validation. | Current architecture packet. | `npm.cmd run check:scope-language` PASS. |

| GitHub Actions full Jest run dirtied generated overlay outputs before the focused overlay checker test, so the normal working-tree currentness mode reported all overlay outputs stale in CI while local standalone and full Node 20 runs were current. | `quality_improvement_available` | Kept the normal CLI checker strict against the working tree; added explicit committed-output currentness mode for the Jest test so CI verifies committed blobs rather than cross-test working-tree residue. The test still fails on stale committed outputs and prints checker stdout/stderr on failure. | CI merge-readiness before correction. | Architecture content, generated outputs, and manual checker strictness. | Node 20 focused Jest PASS, Node 20 full Jest PASS, normal `npm.cmd run check:platform` PASS, and remote CI PASS after push. |

## Validation After Corrections

```text
node build-scripts/inspection/check-international-overlay-architecture.js
OK international overlay architecture check descriptors=4 archetypes=4 crosswalk_rows=10 refusal_cases=31 decision=PROCEED_TO_SELECTED_JURISDICTION_DEEPENING

npm.cmd run check:scope-language
OK scope-language check: active surfaces
```

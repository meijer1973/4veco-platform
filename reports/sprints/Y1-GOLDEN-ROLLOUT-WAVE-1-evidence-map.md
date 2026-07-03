# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Evidence Map

## Core evidence

| Claim | Evidence | Validator |
|---|---|---|
| First-three wave has exactly six Golden check surfaces | `references/data/exercises/y1-golden-rollout-wave-1.json`, `references/data/exercise-surface-manifest.json` | `npm.cmd run check:y1-golden-rollout-wave-1` |
| Split source files and generated lesson files exist | `source-data/book-1/exit-ticket/*.json`, `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/*.js` | `npm.cmd run check:exercise-workflow-currentness` |
| Rendered workflow proof remains current | `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json` | `npm.cmd run check:scale-proof-3p-product-path` |
| Route and skill-map hrefs resolve | Source `skillMap.routes` and Scale proof route inventory | `npm.cmd run check:y1-golden-rollout-wave-1` |
| Authority stays held | Wave manifest, proof JSON, review packet, Scale proof authority flags | `npm.cmd run check:y1-golden-rollout-wave-1` |
| No source/generated/engine mutation | Git status guards in focused checker plus diff hygiene | `git diff --check`, `git -C ../4veco-lessen diff --check` |

## Review evidence

| Review item | Evidence |
|---|---|
| Plan lead review | `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md` |
| Work lead review | `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-round1.md`, `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-round2.md` |
| Human review packet | `reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json` |
| Command log | `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl` |

## Boundaries

This evidence map does not authorize source authoring for `1.1.4` or chapter
`1.2`, product-route adoption, diagnostics, mastery/sequencing, PV, summative
use, Scale Gate 1 closure, broad product use, student/product use, or
target-equivalent completion language.

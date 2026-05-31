# Sprint GAME-ARCH-2: Lead-Review Corrections

Generated: 2026-05-31

## Round-1 Verdict

Round-1 lead review returned REVISE.

## Corrections Applied

| Finding | Correction | Files changed |
|---|---|---|
| `engines/skill-map-engine.js` was missing from file-level disposition | Added KEEP row naming its ownership of route request normalization, aspect normalization, view-model construction, progress summary, warnings, and boundary flags | `reports/sprints/GAME-ARCH-2-file-disposition.md` |
| Route API did not name the shared route engine owner | Added `engines/skill-map-engine.js` as primary owner for route request and route view shapes | `reports/sprints/GAME-ARCH-2-route-api.md` |
| Architecture map cited route UI but not route view-model engine | Added `engines/skill-map-engine.js` to route-layer evidence and named route request/view-model construction as shared ownership | `reports/sprints/GAME-ARCH-2-architecture-map.md` |
| Baseline did not list the route engine | Added `engines/skill-map-engine.js` to current route-layer baseline | `reports/sprints/GAME-ARCH-2-baseline.md` |
| Evidence checker passed despite missing route engine | Hardened checker to require `engines/skill-map-engine.js` in route API and file disposition | `build-scripts/sprints/check-game-arch2-evidence.js` |
| Lesson roadmap still had stale `GAME-ARCH-1` scale-blocker wording | Replaced the open blocker with `GAME-ARCH-2` while preserving `GATE-ENGINE-1`, `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1 blocks | `../4veco-lessen/lessen-team-roadmap.md` |

## Validation After Corrections

To be rerun before round 2:

```bash
node build-scripts/sprints/check-game-arch2-evidence.js
node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-2
npm.cmd run check:scope-language
```

## Round-2 Readiness

The correction set addresses every round-1 blocker and is ready for lead-review
round 2.

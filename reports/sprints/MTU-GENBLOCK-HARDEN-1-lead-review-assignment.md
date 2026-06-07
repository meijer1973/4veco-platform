# Lead Review Assignment

Sprint: `MTU-GENBLOCK-HARDEN-1`

Generated: 2026-06-07

## Scope

Artifact/task: generator-blocked A-domain MTU exposure hardening for
interactive skill-tree and route catalogs.

Lead reviewer: main-agent structural lead-review pass with verification.

Evidence to inspect:

- `reports/json/skilltree-generator-readiness.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-verification-review.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.jsonl`

## Review Questions

1. Do all current generator-blocked active A-domain units have explicit block
   records?
2. Are blocked A-domain units absent from interactive source/deploy exports?
3. Are blocked A-domain units absent from student-visible source/deploy route
   exports while non-A concept rows remain available?
4. Does the checker reject a negative fixture where a blocked unit is marked
   interactive?
5. Do policy flags preserve blocks on PV, diagnostics, adaptive routing,
   mastery, and product authority?
6. Does the result evidence state first-three product-route relevance without
   authorizing route adoption?

## Expected Outputs

- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round1.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-corrections.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round2.md`

## Required Next Action

Run round 1, record corrections or no corrections, then run round 2 before
sprint closure.


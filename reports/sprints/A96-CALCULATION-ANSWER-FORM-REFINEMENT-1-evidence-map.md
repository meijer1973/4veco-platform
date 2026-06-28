# A96-CALCULATION-ANSWER-FORM-REFINEMENT-1 Evidence Map

Date: 2026-06-24

## Source And Renderer

| Evidence | Path |
|---|---|
| A96 route source data | `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json` |
| Golden answer-form renderer | `engines/golden-ticket-layout.js` |
| Golden answer-form styles | `engines/golden-ticket-layout.css` |
| Exit-ticket wrapper response collection | `engines/exit-ticket-ui.js` |
| Layout registry policy | `references/ui/layout-registry.json` |
| Shared task rollout policy | `references/ui/shared-task-rollout-policy.md` |

## Generated Lesson Output

| Evidence | Path |
|---|---|
| Generated exit-ticket data | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/1.1.2-exit-ticket.js` |
| Generated exit-ticket page | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – exit-ticket.html` |
| Generated Golden layout runtime | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/golden-ticket-layout.js` |
| Generated Golden layout CSS | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/golden-ticket-layout.css` |

## Machine Proof

| Evidence | Path |
|---|---|
| A96 proof JSON | `reports/json/a96-calculation-answer-form-refinement-1-proof.json` |
| Refreshed Scale proof JSON | `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json` |
| Screenshot manifest | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshot-manifest.md` |
| Screenshot manifest JSON | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshots/manifest.json` |
| Route inventory | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-route-inventory.md` |
| Screenshots | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshots/*.png` |

## Checkers And Tests

| Evidence | Path |
|---|---|
| Scale proof capture | `build-scripts/sprints/capture-scale-proof-3p-readiness-product-path-proof-1.js` |
| Scale proof checker | `build-scripts/sprints/check-scale-proof-3p-readiness-product-path-proof-1.js` |
| Golden layout tests | `engines/tests/golden-ticket-layout.test.js` |
| Exit-ticket engine tests | `engines/tests/exit-ticket-engine.test.js` |
| Exit-ticket UI tests | `engines/tests/exit-ticket-ui.test.js` |
| Build shell tests | `build-scripts/platform/build-exit-ticket-shells.test.js` |

## Authority Boundary

All proof artifacts keep these false:

- product-route adoption;
- product use;
- student/product use;
- Scale Gate 1 authorization;
- diagnostics;
- mastery/sequencing;
- PV;
- summative use;
- target-equivalent completion language.

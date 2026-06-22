# GOLDEN-ROUTE-111 Evidence Map

Date: 2026-06-19
Status: ready for human Golden Route 111 review

## Source And Generated Output

| Requirement | Evidence |
| --- | --- |
| `1.1.1` Exit ticket uses Golden Workbench | `source-data/book-1/exit-ticket/1.1.1-exit-ticket.json`; generated `shared/exit-ticket/1.1.1-exit-ticket.js`; generated `1.1.1 ... - exit-ticket.html` |
| `1.1.1` Korte check uses advisory Golden variant | `source-data/book-1/exit-ticket/1.1.1-korte-check.json`; generated `shared/exit-ticket/1.1.1-korte-check.js`; generated `1.1.1 ... - korte-check.html` |
| Source/context first for `1.1.1` | `contextBlocks`, `contextRefs`, and rendered `.ge-source-card` |
| Start copy neutral for first three paragraphs | first-three generated `instapquiz.html` files |
| Shared Start UI avoids mastery DOM names | generated `shared/quiz-ui.js` and `shared/quiz.css` |
| Completion language remains held | proof JSON completion audit and source/generated target flags |
| Generated lesson output was regenerated through deploy | `node scripts/deploy.js "C:\wt\GOLDEN-ROUTE-111-START-COPY-20260619\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` |

## Machine Proof

| Artifact | Purpose |
| --- | --- |
| `reports/json/golden-route-111-migration-and-start-copy-repair-bundle-1-proof.json` | Source/generated parity, authority flags, completion audit, screenshots |
| `reports/sprints/GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1-screenshot-manifest.md` | Human-readable screenshot inventory |
| `reports/sprints/GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1-screenshots/manifest.json` | Machine-readable screenshot inventory |
| `build-scripts/sprints/check-golden-route-111-migration-and-start-copy-repair-bundle-1.js` | Deterministic acceptance checker |
| `build-scripts/sprints/capture-golden-route-111-migration-and-start-copy-repair-bundle-1.js` | Rendered screenshot/proof capture through Chromium DevTools Protocol viewport metrics |

## Screenshot Coverage

The capture includes:

- desktop and mobile Start screenshots for `1.1.1`, `1.1.2`, and `1.1.3`;
- desktop and mobile screenshots for `1.1.1` Exit ticket;
- desktop and mobile screenshots for `1.1.1` Korte check.

Each screenshot records layout inspection in `manifest.json` and proof JSON. The proof requires matching viewport width and no horizontal overflow offenders, including the 390px mobile captures.

## Authority Boundary

Authority flags are false for:

- product-route adoption;
- product use;
- student/product use;
- Scale Gate 1;
- diagnostics;
- mastery/sequencing;
- adaptive routing;
- PV;
- summative use;
- target-equivalent completion language.

## What This Does Not Prove

This evidence does not close Scale Gate 1. It does not authorize product-route adoption, diagnostics, mastery/sequencing, PV, summative use, broad product use, or student/product use. It also does not claim a `1.1.3-korte-check` Golden migration.

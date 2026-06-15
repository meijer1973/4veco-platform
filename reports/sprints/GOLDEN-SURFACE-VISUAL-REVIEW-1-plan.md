# GOLDEN-SURFACE-VISUAL-REVIEW-1 Plan

Date: 2026-06-15
Status: completed_review

## Objective

Stabilize the three already-rendered Golden Workbench surfaces before any
further route migration.

## Governing References

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion core specifications:
  `../4veco-lessen/specifications/companion-core-specifications.md`
- Sprint contract:
  `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- Original planning input:
  `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`

## Scope

Reviewed surfaces:

- `1.1.2` exit ticket
- `1.1.2` advisory short check
- `1.1.3` exit ticket
- shared `golden-ticket-layout.js` / `golden-ticket-layout.css` runtime

Rendered lesson root used for evidence:

```text
C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod
```

This root is `4veco-lessen` `main` at commit
`8b007cd Merge pull request #12 from meijer1973/codex/paragraph-landing-v2-prototype-port-20260611`.

## Non-Actions

This sprint does not:

- migrate `1.1.1`;
- migrate `1.1.3-korte-check`;
- mutate target-exercise registry data;
- mutate generated lesson output;
- claim product-route adoption;
- claim target-equivalent completion language;
- authorize diagnostics, mastery/sequencing, PV, Scale Gate 1, broad product
  use, or student/product use.

## Core Requirements

| Requirement | Evidence route |
|---|---|
| Desktop, mobile, and dark-mode states are captured or inspected for all three surfaces. | `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshot-manifest.md` |
| Golden routes use direct `main.ge-page[data-golden-ticket-root]`. | `reports/json/golden-surface-visual-review-1-proof.json` |
| No legacy or hybrid shell is present. | `reports/json/golden-surface-visual-review-1-proof.json` |
| `1.1.2` exit-ticket authority remains held. | `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`; proof JSON |
| `1.1.2-korte-check` remains advisory. | `source-data/book-1/exit-ticket/1.1.2-korte-check.json`; proof JSON |
| `1.1.3` graph behavior does not reintroduce fake slope/connect-line controls. | proof JSON and screenshot manifest |
| Route links resolve. | proof JSON |
| Findings are classified with blocks / does_not_block / proof_required_to_close. | `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-review.md` |

## Method

1. Sync platform to current `origin/main` after PR #57 merged.
2. Create branch `codex/golden-surface-visual-review-1-20260615` from
   `origin/main`.
3. Verify canonical lesson `main` state before using rendered Book 1 output.
4. Generate screenshot and DOM/source proof with:

```powershell
$env:GOLDEN_SURFACE_BOOK_ROOT='C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
node build-scripts/sprints/capture-golden-surface-visual-review1.js
Remove-Item Env:\GOLDEN_SURFACE_BOOK_ROOT
```

5. Visually inspect the generated desktop/mobile/dark screenshots.
6. Record verdict and classified findings.

## Deliverables

- `build-scripts/sprints/capture-golden-surface-visual-review1.js`
- `reports/json/golden-surface-visual-review-1-proof.json`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshot-manifest.md`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-plan.md`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-review.md`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-quality-log.md`

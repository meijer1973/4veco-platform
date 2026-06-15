# GOLDEN-SURFACE-VISUAL-REVIEW-1 Review

Date: 2026-06-15
Verdict: REVISE

## Review Basis

Product end-state cited:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint specification cited:

- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`

Evidence inspected:

- `reports/json/golden-surface-visual-review-1-proof.json`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshot-manifest.md`
- `reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshots/`
- `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.2-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- rendered Book 1 output under
  `C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod`

## Non-Negotiable Requirements

- Golden Workbench routes must use a direct Golden route root, not a legacy
  shell patch.
- Golden routes must not use `#exit-ticket-app`, `et-*` route shells, legacy
  exit-ticket/task-shell CSS, or legacy exit-ticket/task-shell UI scripts.
- Hybrid `ge-*` plus `et-*` shell classes are blockers.
- `1.1.2` target-equivalent completion authority must remain held.
- `1.1.2-korte-check` must remain advisory only.
- `1.1.3` must not reintroduce fake slope/connect-line graph controls.
- Review findings must classify what blocks, what does not block, and what
  proof is required to close.

## Core-Requirement Checklist

| Requirement | Result | Evidence |
|---|---|---|
| Desktop/mobile/dark states captured for all three surfaces | passed | 9 screenshots in screenshot manifest |
| `1.1.2` exit ticket uses Golden root | passed | proof JSON: `112-exit-ticket` |
| `1.1.2-korte-check` uses Golden root | passed | proof JSON: `112-korte-check` |
| `1.1.3` exit ticket uses Golden root | passed | proof JSON: `113-exit-ticket` |
| Legacy/hybrid shell absent | passed | proof JSON: all three surfaces |
| Legacy CSS/runtime absent | passed | proof JSON: all three surfaces |
| Route links resolve | passed | proof JSON: all three surfaces |
| `1.1.2` exit-ticket authority held | passed | `gateApproved: false`, `completionLanguageEligible: false`, `targetReadinessEvidence: false` |
| `1.1.2-korte-check` advisory-only status held | passed | `targetEquivalent.candidate: false`, advisory proof false, hints absent, route advice true |
| `1.1.3` fake slope/connect-line controls absent | passed | proof JSON: `fake_graph_controls_absent: true` |
| Mobile text fits the viewport | revise | screenshots show right-edge clipping on mobile hero/source text |
| `1.1.3` formula-token ambiguity absent | revise | DOM contains `oldQden` / `oldQnum`; visible duplicate `oude Q` token labels remain |

## Findings

### GSVR1-F1: Mobile views clip right-edge text

Classification: REVISE

The mobile captures show horizontal clipping in the Golden Workbench layout.
This appears in the in-scope mobile screenshots, including:

- `112-exit-ticket-mobile-light.png`
- `112-exit-ticket-mobile-dark.png`
- `112-korte-check-mobile-light.png`
- `113-exit-ticket-mobile-light.png`
- `113-exit-ticket-mobile-dark.png`

The core route architecture is correct, but the viewport does not fully contain
hero/source text at 390px width.

blocks:

- clean PASS for `GOLDEN-SURFACE-VISUAL-REVIEW-1`;
- claiming the three surfaces are visually stabilized on mobile;
- using this review as evidence for later product-route adoption.

does_not_block:

- the no-legacy-shell finding;
- the authority-held finding;
- the route-link finding;
- preparing a focused repair sprint or PR.

proof_required_to_close:

- refreshed mobile light and mobile dark screenshots at 390px width for the
  three in-scope surfaces;
- no visible right-edge clipping in hero, source, task, and route-panel text;
- preferably a DOM/browser proof that `document.documentElement.scrollWidth <=
  document.documentElement.clientWidth` for each mobile state.

### GSVR1-F2: `1.1.3` formula-token ambiguity remains

Classification: REVISE

The `1.1.3` exit-ticket DOM still contains formula-builder token ids
`oldQden` and `oldQnum`, both rendered with the visible label `oude Q`. This
matches the known limitation in the original plan: `1.1.3` is valid as a
layout/graph/no-legacy reference, but not as the formula-token exemplar.

blocks:

- claiming `1.1.3` is the formula-token exemplar;
- closing the "no old/internal formula-token issue" part of this review;
- using `1.1.3` as evidence for A96-level formula-token quality.

does_not_block:

- using `1.1.3` as a Golden shell / graph-workspace / no-legacy reference;
- the fake slope/connect-line control finding, which passed;
- authority-held status.

proof_required_to_close:

- revised `1.1.3` formula task labels or token model that removes duplicate
  ambiguous `oude Q` visible tokens;
- refreshed DOM proof showing no `oldQden` / `oldQnum` exposed in the route;
- refreshed screenshot or interaction proof for the formula task area.

### GSVR1-N1: Sibling lesson worktree is stale

Classification: NOTE

The sibling lesson worktree at `C:\wt\EXERCISES-20260609\4veco-lessen` is on
`codex/exercises-20260609` and still renders legacy `1.1.2` routes. The
canonical lesson `main` at `C:\Projects\4veco\4veco-lessen` renders the three
in-scope routes with the Golden shell and was used for this review.

blocks:

- using the sibling `../4veco-lessen` worktree as product evidence without
  first syncing or explicitly selecting the intended lesson root.

does_not_block:

- this review, because evidence was regenerated against canonical lesson
  `main`.

proof_required_to_close:

- future review commands should either set `GOLDEN_SURFACE_BOOK_ROOT` to the
  intended lesson checkout or sync the sibling lesson worktree before capture.

## Conclusion

Verdict is REVISE.

The three in-scope routes pass the architectural and authority checks: Golden
root present, legacy/hybrid shell absent, route links resolving, `1.1.2`
authority held, `1.1.2-korte-check` advisory-only, and `1.1.3` fake graph
controls absent.

The sprint does not reach PASS because mobile text clipping is visible and the
known `1.1.3` formula-token ambiguity remains. No product-route adoption,
completion-language authority, diagnostics, mastery/sequencing, PV, Scale Gate
1, broad product use, or student/product use is authorized.

Recommended next action: open a focused repair sprint for Golden Workbench
mobile overflow and `1.1.3` formula-token clarity, then rerun
`GOLDEN-SURFACE-VISUAL-REVIEW-1`.

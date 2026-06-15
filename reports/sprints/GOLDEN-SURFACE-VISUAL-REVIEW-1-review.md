# GOLDEN-SURFACE-VISUAL-REVIEW-1 Review

Date: 2026-06-15
Verdict after revision: PASS
Prior verdict before repair: REVISE

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
- Mobile states must not clip or horizontally overflow at 390px.
- `1.1.3` formula tokens must not expose duplicate visible `oude Q` labels
  through hidden internal IDs.
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
| Mobile text fits the viewport | passed | runtime proof: `scrollWidth == clientWidth == 390`, zero overflowing elements for mobile light/dark |
| `1.1.3` formula-token ambiguity absent | passed | DOM/runtime proof: no `oldQden` / `oldQnum`; duplicate visible token labels absent |

## Findings

### GSVR1-F1: Mobile views clip right-edge text

Classification: CLOSED

Original result: REVISE. Mobile screenshots showed right-edge clipping at
390px.

blocks:

- closed. This no longer blocks clean PASS for
  `GOLDEN-SURFACE-VISUAL-REVIEW-1`.

does_not_block:

- broader product-route adoption, Scale Gate 1, diagnostics, mastery/PV, and
  student/product use remain outside this sprint's authority.

proof_required_to_close:

- satisfied. Refreshed mobile light/dark screenshots show clean wrapping.
- satisfied. Runtime proof records no horizontal overflow and zero overflowing
  elements for all mobile states.

### GSVR1-F2: `1.1.3` formula-token ambiguity remains

Classification: CLOSED

Original result: REVISE. The `1.1.3` exit-ticket DOM exposed `oldQden` and
`oldQnum`, both visibly labelled `oude Q`.

blocks:

- closed. This no longer blocks clean PASS for the visual review sprint.

does_not_block:

- `1.1.3` still remains an implemented route/workbench exemplar, not the
  formal formula-builder policy exemplar. A96 remains the formula policy
  reference for reusable-token rules and hidden-token-trap policy.

proof_required_to_close:

- satisfied. Source and deployed output now use distinct visible tokens:
  `oldQBeforeChange`, `oldQBase`, and `newQBase`.
- satisfied. Runtime proof records old formula-token IDs absent and duplicate
  visible token labels absent.

### GSVR1-N1: Sibling lesson worktree is stale

Classification: NOTE

The sibling lesson worktree at `C:\wt\EXERCISES-20260609\4veco-lessen` is not
the evidence source for this review. The canonical lesson worktree at
`C:\Projects\4veco\4veco-lessen` was deployed and used for proof.

blocks:

- using the sibling `../4veco-lessen` worktree as product evidence without
  first syncing or explicitly selecting the intended lesson root.

does_not_block:

- this review, because evidence was regenerated against canonical lesson
  output.

proof_required_to_close:

- future review commands should either set `GOLDEN_SURFACE_BOOK_ROOT` to the
  intended lesson checkout or sync the sibling lesson worktree before capture.

## Conclusion

Verdict after revision is PASS.

The three in-scope routes pass the architectural, authority, mobile-layout, and
token-clarity checks: Golden root present, legacy/hybrid shell absent, route
links resolving, `1.1.2` authority held, `1.1.2-korte-check` advisory-only,
`1.1.3` fake graph controls absent, mobile overflow absent, and old ambiguous
formula-token IDs absent.

This PASS authorizes moving to the next planned review step. It does not
authorize product-route adoption, completion-language authority, diagnostics,
mastery/sequencing, PV, Scale Gate 1 closure, broad product use, or
student/product use.

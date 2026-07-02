# Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1 Read-Only Subagent Reviews

Verdict: PASS WITH FLAGS

Date: 2026-06-27

Reviewed branch workspace: `C:\wt\Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1-20260627\4veco-platform`

Lesson sibling reviewed read-only: `C:\wt\Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1-20260627\4veco-lessen`

## Scope Coverage

All required read-only review scopes were covered:

- teacher route usability
- economics/source fidelity
- accessibility/mobile
- route registry and rollback
- authority boundaries

## Consolidated Result

No content blocker remains for the adoption-prep packet.

The earlier completion blocker was the missing `read-only-subagent-reviews.md` evidence artifact. This file is that artifact and closes the missing-evidence blocker.

The route registry and rollback reviewer also flagged that the future bounded navigation/index change should be pinned to exact files. The packet now names:

- `index.html`
- `year2-candidate-lessons/four-target-lesson-production-1/index.html`

Both are explicitly not authorized for mutation in this PR.

## Review Notes By Scope

### teacher route usability

Subagent: `019f09a4-ba9f-7e92-8286-99c874dd70f0`

Verdict: PASS WITH FLAGS

Findings:

- Route labels, direct candidate entry points, bounded preview framing, and rollback are usable for a teacher/owner adoption-prep decision.
- Current exposure is direct URL only; root/default student navigation remains unchanged.
- All four route labels and entry points match the lesson manifest and candidate bundle index.

Remaining flags:

- None blocking. Product/student-use authority remains closed.

### economics/source fidelity

Subagent: `019f09a4-bc3b-7b41-8955-f14b919e1dfc`

Verdict: PASS WITH FLAGS

Findings:

- The packet preserves the boundary: adoption is not authorized, and CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, and student/product use remain blocked.
- Advisory short checks and target-equivalent exit tickets remain bounded as non-completion proof.
- Original sprint/gate/source specs are cited and resolve through product-proof, lesson bundle, manifest/contracts, source assets, answer contracts, governed support, and book architecture.

Remaining flags:

- Adoption records rely on the prior product-proof packet and lesson manifest/contracts for source refs rather than carrying every source ref inline. This is acceptable for prep; a future adoption PR should preserve that lineage visibly.

### accessibility/mobile

Subagent: `019f09a4-bd25-70b1-b044-6b742ac55a96`

Verdict: PASS WITH FLAGS

Findings:

- Desktop/mobile and light/dark proof is correctly inherited from the product-proof gate: 48 of 48 screenshots cover four routes, three surfaces, two viewports, and two themes.
- The rendered adoption map is structurally reasonable: boundary section, four route cards, long-path wrapping, and a mobile breakpoint.
- The packet does not misuse inherited screenshots as new product-navigation proof; future adoption PRs must refresh screenshots if navigation, labels, layout, or lesson routes change.

Remaining flags:

- Candidate pages have polish-level accessibility opportunities: active navigation state is visual-only, and short-check choices use pressed buttons rather than radio-group semantics. These do not block this adoption-prep packet.

### route registry and rollback

Subagent: `019f09a4-bdf5-7782-80d4-156098fd5eb9`

Verdict: PASS WITH FLAGS

Findings:

- Exact proposed adoption surface, platform source of truth, visibility rules, no-silent-exposure proof, and rollback are named.
- Root/book navigation mutation is explicitly false.
- Lesson repo has no diff; the candidate bundle index links only within the candidate bundle, while the lesson root index does not expose the candidate output.

Prior flag disposition:

- The future navigation/index file is now pinned to exact files: `index.html` and `year2-candidate-lessons/four-target-lesson-production-1/index.html`.

### authority boundaries

Subagent: `019f09a4-bf91-7a43-bb6f-e36d499571a7`

Verdict: PASS WITH FLAGS

Findings:

- The packet cites product end-state and original specs, names non-negotiables, includes all four routes, names exact adoption surface, records visibility and rollback, includes a core checklist, and classifies findings.
- Carried issues include `blocks`, `does_not_block`, and `proof_required_to_close`.
- Product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, and student/product use remain explicitly blocked.

Prior blocker disposition:

- The missing review-evidence artifact is closed by this file.

## Overall Carried Flags

- Future actual adoption still requires a separate exact registry/index PR and explicit owner authorization.
- Future adoption must refresh product/navigation screenshots if the route entry point, labels, layout, or lesson paths change.
- CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, and student/product use remain blocked.

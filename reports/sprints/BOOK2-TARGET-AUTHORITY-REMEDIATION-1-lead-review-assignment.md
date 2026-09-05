# Lead Review Assignment: BOOK2-TARGET-AUTHORITY-REMEDIATION-1

Sprint: `BOOK2-TARGET-AUTHORITY-REMEDIATION-1`

Assigned reviewer role: separate read-only structural lead reviewer

Review standard: `REV-STD-1`, schema version 3

## Task

Review Issue #229 Phase A as one coherent platform-only Book 2 target-authority
candidate. Decide whether all twelve target records, the Ei correction,
candidate lifecycle, alignment proof, checker/test plan, specialist evidence,
and authority boundaries are complete enough to route to the human owner gate.

The reviewer is an independent Codex role, not the human owner. A lead PASS
may promote the exact candidate state to `lead_reviewed_candidate` and route it
to exact-head CI and owner review. It cannot approve target authority, release
holds, authorize integration or lessons, mark the PR ready, or merge.

## Exact review identity

- Draft PR: https://github.com/meijer1973/4veco-platform/pull/230
- Remote branch: `codex/book2-target-exercise-audit-20260904`
- Reviewed substantive commit:
  `eade17cbe5c9dc52652b47289cd6f51e6d1748e6`
- Candidate package SHA-256:
  `32f5325a542445eb093b0e645304afae7542b2c92e491c8bd09ace9fefa71441`
- Candidate-file SHA-256:
  `62b4305df2f6d55367055fcc547c305e9a432ee7bfdedf61049f18e56837a202`
- Platform baseline: `e5f89e730d65c4131d7dd09f805f0db94690e8e6`
- Lesson head: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Outline semantic SHA-256:
  `69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`

Remote branch SHA and reviewed commit must match. Any semantic candidate,
alignment, target-registry, Ei, checker-contract, or authority-boundary change
requires affected re-review.

## Original specification and quality floor

- GitHub Issue #229 and the audit PDF named in the sprint plan.
- `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md` and machine
  plan.
- Approved Book 2 outline/meta and its open-hold lifecycle.
- Twelve exact records and the bidirectional alignment matrix.
- Independent economics, teacher-learning, student-language, and
  finished-artifact/test-plan reviews plus correction traces.
- Focused positive and mutation checks for every audit failure mode.
- Platform-only scope with an unchanged lesson repository.

## Non-negotiable requirements

1. All twelve records form one exact, independently executable package.
2. Every required learner operation is visible in a point-bearing prompt and
   every answer-model operation is asked.
3. Goals, questions, answer forms, timing budgets, and point allocations map
   both ways without hidden work or scope drift.
4. Every calculation, interval, sign, dimension, graph/table source, surplus
   area, and bounded economic claim is correct.
5. Ei uses `inferieur`, `normaal`, and `luxe`; Ei=0 and Ei=1 remain explicit
   boundaries.
6. Mixed targets use coherent complete sources, four to six questions, mostly
   two-point items, supplied graph/table bases, and no new theory.
7. Candidate lifecycle cannot pass approval/integration before
   `lead_reviewed_candidate` and the exact review-packet binding.
8. Approval fields remain null; all Issue #229 and Ei supersession holds remain
   open.
9. No lesson file, generated student output, other-book target, unrelated
   machine unit, product/diagnostic/mastery/PV surface, or merge authority is
   changed or claimed.
10. Missing core requirements cannot be carried under PASS WITH FLAGS.

## Evidence to inspect

- `references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json`
- `references/authored/course-target-exercises.json`
- `references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.alignment.json`
- `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-alignment-matrix.md`
- `references/authored/book-outlines/book-2-outline.meta.json`
- `build-scripts/workflows/check-book2-target-authority-remediation.js`
- `build-scripts/workflows/check-book2-target-authority-remediation.test.js`
- `build-scripts/workflows/check-book-outline-currentness.js`
- `build-scripts/workflows/check-book-outline-currentness.test.js`
- specialist final reports and finished-artifact verification records
- `reports/review-gates/GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1/review-packet.json`

## Review routing

Return `PASS`, `PASS WITH FLAGS`, `REVISE`, `FAIL`, or `PAUSE`. Classify every
finding, state what it blocks and does not block, and name proof required to
close. Any missing core requirement or unresolved specialist disagreement
requires `REVISE` or `FAIL`. Human exact-package approval and merge remain
separate authority triggers after lead review and CI.

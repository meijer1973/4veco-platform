# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Diff Summary

Generated: 2026-09-01

## Changed implementation surfaces

- Added the prose and machine Book 2 outline under
  `references/authored/book-outlines/`.
- Added the outline-currentness checker, approved-use mode, typed scopes,
  resolution/use transitions, full lifecycle-projection parity, and 58-test suite.
- Wired the checker into package commands and `platform-ci`.
- Added the Book foundation check to both build entrypoints, the paragraph
  skill and lane, teacher reviewer, and dedicated Part A textbook-plan template.
- Corrected the GitHub entrypoint to route Part A and Part B to their respective
  plan templates and to distinguish structural, action-specific, and
  approved-use checks.

## Changed planning and evidence surfaces

- Updated textbook roadmap, ledger, and canonical roadmap index.
- Added sprint plan/baseline/audit/specialist reviews/lead reviews/result,
  machine metadata, command logs, and human-review gate packet.
- Refreshed generated agent indexes, URL index, and internal dashboard.

## Protected surfaces

- Existing `references/owned/`, `references/machine/`, and
  `references/external/` files are unchanged.
- `references/authored/course-target-exercises.json` is unchanged.
- No lesson repository or generated lesson output changed.
- No source data, candidate storage, paragraph content, exercises, targets,
  assets, rendered output, diagnostics, mastery, PV, or product route changed.

## Authority boundary

The new outline is derived planning authority in
`review_ready_with_holds` state. It does not approve paragraph goals or
targets, promote preview to an assumable prerequisite, authorize Gate 0B-1
approval/production, or authorize merge.
Owner approval is still required on the exact draft PR head.

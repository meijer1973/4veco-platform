# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Diff Summary

Generated: 2026-09-02

## Changed implementation surfaces

- Added the prose and machine Book 2 outline under
  `references/authored/book-outlines/`.
- Added the outline-currentness checker, approved-use mode, typed scopes,
  resolution/use transitions, full lifecycle-projection parity, and 88-test suite.
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
- Recorded the exact owner approval pin and released only `H-OUTLINE-OWNER`;
  the approved-use validator now passes while downstream holds remain active.

## Protected surfaces

- Existing `references/owned/`, `references/machine/`, and
  `references/external/` files are unchanged.
- `references/authored/course-target-exercises.json` is unchanged.
- No lesson repository or generated lesson output changed.
- No source data, candidate storage, paragraph content, exercises, targets,
  assets, rendered output, diagnostics, mastery, PV, or product route changed.

## Authority boundary

The outline is owner-approved derived planning authority in
`approved_with_holds` state at semantic hash
`69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`.
Only `H-OUTLINE-OWNER` is released. This lifecycle transition does not approve
paragraph goals or targets, promote preview to an assumable prerequisite,
authorize Gate 0B-1 approval/production, repair or integrate target records,
authorize lesson writes, or authorize merge. Separate exact-head CI and
governed payload/merge authorization remain required.

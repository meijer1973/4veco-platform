# Sprint GAME-ARCH-1: Diff Summary

Generated: 2026-05-31

## Summary

The diff closes GAME-ARCH-1 as a no-generated-output architecture decision
sprint.

The central decision is to keep and harden the shared route layer, keep the
shared task shell, keep/refactor graph as the reference pattern, refactor math
and reasoning around target-operation and answer-form standards, keep the
short check as advisory, and route integrated architecture planning to
`GAME-ARCH-2`.

## Platform Sprint Evidence

Added:

- GAME-ARCH-1 plan, baseline, and planning review.
- Student-path trace for `1.1.1`, `1.1.2`, and `1.1.3`.
- Operation-chain coverage table.
- Component decision matrix.
- Canonical UI model.
- Short-check and target-equivalent exit-ticket boundary record.
- Architecture decision record.
- Lead-review assignment, round-1 REVISE, correction log, round-2 recheck,
  and final round-2 PASS.
- Result record and result metadata.

## Validation

Added `build-scripts/sprints/check-game-arch1-evidence.js` to verify required
decision artifacts, short-check boundary language, roadmap/spec alignment, and
prohibited authority boundaries.

Existing graph, math, and reasoning route-output validators were rerun against
the current generated Book 1 output as read-only evidence.

## Product Specifications

Updated:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

The specification change preserves the target-equivalent exit-ticket standard
and adds the advisory short-check surface as a separate route element. The
short check may provide local, non-binding advice. It does not prove the target
exercise and does not authorize grading, diagnostics, automatic sequencing,
mastery, summative use, AI, PV, Scale Gate 1, or product use.

## Roadmaps

Updated:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

The roadmaps now mark GAME-ARCH-1 closed after lead-review PASS, add
GAME-ARCH-2 before GATE-ENGINE-1, and tighten GATE-ENGINE-1 to require live
rendered output and keep/refactor/rebuild/hold decisions per component.

Archived:

- `docs/roadmaps/outdated/reference-team-roadmap-v3.25-graph-ux2-task-shell-integration.md`

## Generated Lesson Output

No generated lesson output was regenerated or edited by GAME-ARCH-1. Existing
Book 1 output was used as read-only evidence.

## Protected Surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no writes to `references/data/exam-ingestion/answer-skill-candidates.json`;
- no answer-skill candidate storage created;
- no candidate writes;
- no target-exercise `question_type` or `answer_form` fields;
- no unit minting, updates, splits, or deprecations;
- no `source-data/book-*/exit-ticket/*.json` writes.

## Product Authority

GAME-ARCH-1 authorizes no generated lesson output, target-equivalent
completion language, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use.

## Next Action

Proceed to `GAME-ARCH-2`. It should produce the integrated practice-engine
architecture plan before `GATE-ENGINE-1`, `L1.7B-Q2`, or Scale Gate 1 rely on
the shared route/task-shell system.

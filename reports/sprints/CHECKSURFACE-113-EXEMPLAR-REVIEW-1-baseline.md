# Sprint CHECKSURFACE-113-EXEMPLAR-REVIEW-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-plan.md`

## Branch And Remote State

- Platform repo branch: `codex/task-improvement`.
- Platform HEAD before review sprint: `ef898b62 Implement 1.1.3 exit ticket exemplar`.
- Platform status at baseline: clean and tracking `origin/codex/task-improvement`.
- Lesson repo branch: `codex/task-improvement`.
- Lesson HEAD before review sprint: `85f297b Generate 1.1.3 exit ticket exemplar output`.
- Lesson status at baseline: clean and tracking `origin/codex/task-improvement`.

## Existing Implementation Evidence

- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-result.md` reports implementation complete with next state `hold_for_exemplar_review`.
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1.result.json` keeps `human_review_completed`, `target_readiness_evidence_authorized`, `completion_language_authorized`, `diagnostic_or_mastery_authorized`, and `pv_or_scale_gate_authorized` as `false`.
- `reports/json/checksurface-113-exemplar-exit1-proof.json` records source/generated/checker proof from the implementation sprint.
- `reports/json/checksurface-113-exemplar-exit1-browser-proof.json` records initial browser verification from the implementation sprint.

## Review Placeholder State

Before this sprint, the exemplar review files under
`references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/reviews/`
exist as pending placeholders:

- `teacher-learning-quality-review.md`
- `student-experience-review.md`
- `visual-interaction-review.md`
- `testing-regression-review.md`
- `lead-synthesis.md`

The implementation sprint intentionally left those files at `PENDING_REVIEW`.
This review sprint must replace that state with evidence-backed agent reviews.

## Rendered Output Baseline

Generated route to inspect:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1.3-grafieken-en-tabellen/exit-ticket.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/data/1.1.3-exit-ticket.js`

Prior browser proof observed these task families:

- `graph_construction_substitute`
- `graph_reading`
- `formula_builder`
- `calculation_work_capture`

Prior browser proof also observed graph workspace support, table-point snapping,
no static formula context, no completion/diagnostic text, and safe placeholders.

## Quality Floor At Baseline

The review must judge the original v3 specification and student-facing quality,
not merely file existence. The minimum accepted outcome is a reviewable exemplar
with honest flags and held authority. Any source or route repair discovered by
review must become named follow-up work unless it is only review evidence or a
read-only checker.

## Data integrity notes

No protected reference data may change:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`

No generated lesson output may be hand-edited. The lesson repo starts clean, so
any lesson-side diff is unexpected in this review-only sprint.

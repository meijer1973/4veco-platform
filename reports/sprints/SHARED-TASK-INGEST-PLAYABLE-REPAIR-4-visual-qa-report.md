# SHARED-TASK-INGEST-PLAYABLE-REPAIR-4 Visual QA Report

Generated: 2026-06-05

Status: Repair 4 visual QA passed after reviewer correction pass for
review-lab evidence only; no gate closure, product-route adoption, generated
lesson output, or student use.

Scope:

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`
- `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Required Screenshot Evidence

Actual exam:

- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-initial.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-wrong-retry.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-unit-feedback.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-support.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-corrected.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-completed.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-completed.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark-completed.png`

Textbook:

- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-initial.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-axis-selected.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-two-points.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-wrong-retry.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-line-confirmed.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-completed.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-completed.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark-completed.png`

## Visual Checks

| Check | Result | Evidence |
|---|---|---|
| original exam question visible in right task pane | pass | actual-exam proof `right_pane_original_question_visible: true` |
| duplicate visible `Bron 1` / `Tabel 1` labels removed | pass | both proof files record `duplicate_visible_labels_removed: true` |
| long file paths hidden from reviewer/student surface | pass | screenshots record `sourceRefsVisible: false` |
| independent source scrolling with question still visible | pass | both proof files record `source_pane_independent_scroll: true` and `question_visible_after_source_scroll: true` |
| exam unit-only feedback visible | pass | `desktop-unit-feedback` records `targetedUnitFeedbackVisible: true` |
| exam stuck-support path visible | pass | `desktop-support` records progressive support and support completion |
| textbook graph workspace size and position | pass | proof records `graph_workspace_in_task_pane: true` and `graph_workspace_width_pass: true` |
| grid visible before axis selection | pass | `desktop-initial` records 12 visible grid lines and no labels/scale |
| table-derived tick labels after axis selection | pass | `desktop-axis-selected` records Q ticks `100..500` and P ticks `1,00..3,00` |
| axis labels and numeric scale delayed | pass | `desktop-initial` has 0 axis/scale labels; `desktop-axis-selected` has visible labels and scale |
| two clicked points visible before line confirmation | pass | `desktop-two-points` records two clicked points and no constructed line |
| graph line drawn inside same graph workspace | pass | `desktop-line-confirmed` records `constructedLineVisibleInWorkspace: true` and `completedGraphOutsideWorkspaceCount: 0` |
| separate completed graph block removed | pass | lab HTML has no `Gemaakte grafiek`; proof records `no_separate_completed_graph_block: true` |
| simplified 50 percent follow-up visible | pass | textbook proof records interval, relation, and conclusion controls; checker accepts the conclusion answer, not only interval text |
| actual-exam shortcut work path | pass | checker accepts `22x12 = 264, 264 + 385 = 649` with yearly unit |

## Automatic-Fail Rules Added

Visual QA must fail if any of these recur:

- duplicate visible source/table identifiers in a single block;
- source pane shows long repository paths by default;
- graph line appears outside the active graph workspace;
- grid is hidden before axis selection;
- table-derived graph tick labels are missing or replaced by awkward quarter-scale labels;
- labels or numeric scale are visible before correct axis selection;
- calculation wrong/unit-only states show generic feedback only;
- `22x12 = 264, 264 + 385 = 649` is rejected as visible work for the exam calculation;
- progressive support is absent after repeated failed calculation attempts;
- a separate `Gemaakte grafiek` block appears after success.
- the 50 percent follow-up can only be completed by entering an interval string
  rather than selecting the conclusion.

## Boundary

This report proves only the review-lab visual surface for
`TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` and
`TASK-INGEST-TRANSFORM-3-TEXTBOOK`. It does not authorize generated lesson
output, product-route adoption, target-equivalent completion language,
diagnostics, mastery, sequencing, Scale Gate 1, or student/product use.

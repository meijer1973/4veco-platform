# GATE-SHARED-TASK-INGEST-REPAIR-1 Live Output Evidence

Generated: 2026-06-05

Status: Repair 4 final interaction-clarity evidence accepted by final direct
human review; gate closed PASS WITH FLAGS for review-only shared task
context/source-ingestion readiness. Controlled downstream adoption-preparation
is authorized; product-route adoption, generated lesson output,
target-equivalent proof, diagnostics, mastery, sequencing, PV, Scale Gate 1,
and student/product use remain unauthorized.

## Repaired Lab Evidence

Actual exam:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform2-actual-exam-proof.json`
- Task count: 3 required cards.
- Required sequence: choice -> calculation -> conclusion.
- Right task pane shows the original actual-exam question.
- Task 1 is conceptual setup: what must be compared.
- Task 2 accepts `649` plus yearly unit variants including `euros`, accepts
  the premium-difference shortcut `22x12 = 264, 264 + 385 = 649`, shows
  targeted feedback, and provides progressive support after failed attempts.
- Task 3 carries `EUR 649 per jaar` from task 2 and uses constrained direction
  selection.
- Removed as required cards: source-value select-all task, `formula_builder`,
  `step_ordering`, `source_chain_builder`.
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-initial.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-wrong-retry.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-unit-feedback.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-support.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-corrected.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark-completed.png`

Textbook source:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform3-textbook-proof.json`
- Task count: 3 required cards.
- Primary task: `graph_construction_substitute` for
  `Teken een P-Q-grafiek bij de tabel`.
- Required sequence: graph construction -> graph reading -> simplified 50
  percent quantity-drop check.
- Graph construction is click-to-place after correct axis selection.
- Axis controls are attached to the graph workspace.
- Grid is visible from the start.
- Axis numbers use table-derived graph tick labels instead of generic
  quarter-scale values.
- Axis labels and numeric scale are hidden before correct axis selection and
  revealed after correct axis selection.
- The constructed line appears in the same graph workspace after confirmation.
- No separate `Gemaakte grafiek` completed-graph block is rendered.
- Typed coordinate entry is collapsed fallback only.
- The 50 percent follow-up uses interval choice, auto-filled old/new
  quantities, relation selection, and conclusion selection.
- The 50 percent follow-up must accept the conclusion, not only interval text.
- `interval_halving_check` shared task focus plan evidence exists in the
  shared task shell.
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-initial.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-axis-selected.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-two-points.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-wrong-retry.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-line-confirmed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark-completed.png`

## Target-Task Proof Summary

Both proof JSON files record:

- semantic validation is required before completion;
- wrong input is rejected and produces retry feedback;
- a corrected first task is accepted without completing the whole lab;
- the full correct path reaches completion;
- formula/procedure/correction-model support is collapsed by default;
- source panes are independently scrollable and the question remains visible;
- source panes hide long file paths and pass desktop source/table readability;
- duplicate visible source/table labels are removed;
- visible text does not expose internal IDs or premature derived answers;
- prompt blocks do not render inside `.source-pane`.

The actual-exam proof records exactly three task cards and
`sequence_builders_removed_as_required_cards: true`,
`right_pane_original_question_visible: true`,
`conceptual_setup_choice_rendered: true`,
`select_all_numbers_task_removed: true`,
`premium_difference_shortcut_accepted: true`,
`targeted_unit_feedback_proven: true`,
`targeted_number_feedback_proven: true`,
`progressive_support_proven: true`, and
`task3_carries_task2_value_when_complete: true`.

The textbook proof records exactly three task cards, primary
`graph_construction_substitute`, `click_to_place_primary: true`,
`grid_visible_before_axis_selection: true`,
`table_derived_axis_ticks_proven: true`,
`graph_labels_hidden_before_axis_selection: true`,
`graph_labels_reveal_after_axis_selection: true`,
`two_points_state_proven: true`,
`line_drawn_in_same_workspace: true`,
`no_separate_completed_graph_block: true`,
`quantity_drop_conclusion_control_rendered: true`,
`interval_halving_shared_task_focus_plan: true`,
graph workspace in the task pane, and `graph_workspace_width_pass: true`.

## Authority And Boundary Evidence

Actual exam:

- source kind: `external_primary`;
- prompt PDF: `references/external/exams/vw-1022-a-25-1-o.pdf#question-3`;
- correction PDF: `references/external/exams/vw-1022-a-25-1-c.pdf#question-3`;
- source reconstruction ref: `reports/json/source-reconstruct2-actual-exam.json`.

Textbook:

- source kind: `owned_textbook_source`;
- paragraph: `1.1.3 Grafieken en tabellen`;
- authority note: owned textbook and target-registry context only; not official
  exam authority and not external-primary source authority.

## Remote Publication Evidence

The reviewed remote evidence snapshot is `codex/shared-task-ingest-repair4` at
`95f0eda5f51eb7868cb947dc3e8f081957b2afb4`. Direct push to `main` is blocked
by required GitHub status checks, so this branch is the published inspection
surface until the PR/check flow updates `main`.

Remote branch head at closure preparation:
`845d974161f0fc8f375cb2d3d66baf1b169b46a3`. GitHub reported no status
contexts or check runs for the branch head or reviewed evidence commit when
queried, so closure records local validators as the check evidence and does
not claim a GitHub CI pass.

## Recommended Next Action

Proceed to the next roadmap-controlled adoption-preparation step
(`CHECK-SHORT-EXIT-2`) or pause for explicit roadmap-owner reorder. Do not
start Scale Gate 1 or the later shared-task hardening series from this gate
alone.

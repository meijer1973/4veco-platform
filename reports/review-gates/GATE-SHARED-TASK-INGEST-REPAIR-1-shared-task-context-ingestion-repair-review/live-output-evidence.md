# GATE-SHARED-TASK-INGEST-REPAIR-1 Live Output Evidence

Generated: 2026-06-04

Status: target-task repair evidence prepared after renewed
`hold_for_playable_repair` comments; remote evidence snapshot must be current
before renewed human review starts.

## Repaired Lab Evidence

Actual exam:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform2-actual-exam-proof.json`
- Task count: 3 required cards.
- Required sequence: source values -> calculation -> conclusion.
- Removed as required cards: `formula_builder`, `step_ordering`,
  `source_chain_builder`.
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-initial.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-wrong-retry.png`
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
- Required sequence: graph construction -> graph reading -> optional 50
  percent quantity-drop check.
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-initial.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-wrong-retry.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-corrected.png`
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
- visible text does not expose internal IDs or derived answers;
- prompt blocks do not render inside `.source-pane`.

The actual-exam proof records exactly three task cards and
`sequence_builders_removed_as_required_cards: true`.

The textbook proof records exactly three task cards, primary
`graph_construction_substitute`, graph-construction controls, no completed
graph visible before graph-construction success, graph workspace in the task
pane, and `graph_workspace_width_pass: true`.

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

Remote publication is required before renewed review comments start. The
reviewed remote evidence snapshot is `codex/shared-task-ingest-repair2` at
`0016511e4dc8e8d1d0ff6cf32875c967fcaa971d`. Direct push to `main` is blocked
by required GitHub status checks, so this branch is the published inspection
surface until the PR/check flow updates `main`.

## Recommended Next Action

After the metadata update is pushed and the packet checker passes, send the
packet for renewed direct human review comments. Do not write closure artifacts
until renewed comments, updated resolution evidence, and explicit human
confirmation exist.

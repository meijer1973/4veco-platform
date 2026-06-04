# GATE-SHARED-TASK-INGEST-REPAIR-1 Live Output Evidence

Generated: 2026-06-04

Status: playable repair evidence prepared after first-round
`hold_for_playable_repair` comments; remote evidence snapshot must be current
before renewed human review starts.

## Repaired Lab Evidence

Actual exam:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform2-actual-exam-proof.json`
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
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-initial.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-wrong-retry.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-corrected.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-completed.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark-completed.png`

## Playability Proof Summary

Both proof JSON files record:

- semantic validation is required before completion;
- visible real task-family controls replace generic placeholders;
- wrong input is rejected and produces retry feedback;
- a corrected first task is accepted without completing the whole lab;
- the full correct path reaches completion;
- formula/procedure/correction-model support is collapsed by default;
- source panes are independently scrollable and the question remains visible;
- visible text does not expose internal IDs or derived answers.

The actual-exam lab renders 4 context blocks and 6 task cards. The textbook lab
renders 6 context blocks and 9 task cards, including text, table, graph, and
flowchart evidence. Both labs are review-only surfaces and do not become
student-facing routes.

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
reviewed remote evidence snapshot is `main` at
`0984b83b366b6759819dde5f8bd5d277b66f7a8d`. Renewed human review comments may
start only after the final repair metadata update is pushed.

## Recommended Next Action

After the metadata update is pushed and the packet checker passes, send the
packet for renewed direct human review comments. Do not write closure artifacts
until renewed comments, updated resolution evidence, and explicit human
confirmation exist.

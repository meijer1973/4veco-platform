# GATE-SHARED-TASK-INGEST-REPAIR-1 Live Output Evidence

Generated: 2026-06-04

Status: playable lab evidence prepared after packet text and bundle corrections;
remote evidence snapshot published and recorded.

## Repaired Lab Evidence

Actual exam:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform2-actual-exam-proof.json`
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-light.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-light.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark.png`

Textbook source:

- Lab: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- Proof: `reports/json/task-ingest-transform3-textbook-proof.json`
- Screenshots:
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-light.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-light.png`
  - `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`

## Playability Proof Summary

Both proof JSON files record:

- visible interactive controls;
- visible check buttons;
- deterministic completion path reaching done;
- independently scrollable source pane;
- question visibility after source scrolling.

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

Remote publication is required before review comments start. The reviewed
remote evidence snapshot is `main` at
`0984b83b366b6759819dde5f8bd5d277b66f7a8d`. Human review comments may start
against that snapshot after the metadata update is pushed.

## Recommended Next Action

After the metadata update is pushed and the packet checker passes, send the
packet for direct human review comments. Do not write closure artifacts until
comments, resolution evidence, and explicit human confirmation exist.

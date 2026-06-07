# 1.1.3 Excellent Exit Ticket — implementation handoff

## Purpose

Use this as the quality exemplar for `1.1.3 Grafieken en tabellen`.

This is not another minimal retry. The goal is a student-facing exit ticket that shows what “excellent” means inside a bounded scope:

- independent work;
- no pre-attempt procedure explanation;
- no static formula reveal;
- no correct-only selectors;
- active graph/table work;
- formula handling as student action;
- useful feedback and next practice route;
- no diagnostic, mastery, summative, grade, PV, Scale Gate, or product-wide authority claim.

## Files in this package

- `113-excellent-exit-ticket-v3-prototype.html`
  Playable standalone prototype. Open locally in a browser.

- `113-excellent-exit-ticket-v3-candidate-data.json`
  Candidate source-data shape for platform implementation. It intentionally removes the pre-attempt formula context block and adds formula construction as a task.

- `113-excellent-exit-ticket-v3-implementation-handoff.md`
  This handoff.

- `113-excellent-exit-ticket-v3-quality-brief.md`
  Short explanation of why this is materially better than the current retry surface.


## Revision after prototype review

The graph task has been tightened and made more usable:

- the source table is now explicitly straight-line data;
- two distinct table points are sufficient;
- students do not need to place all five points;
- point placement should use magnetic snapping or a similarly forgiving tolerance;
- a new click after two points should adjust/replace a point rather than forcing the student to clear the whole graph.

This is not a weakening of the exit ticket. It is more mathematically correct: for a straight line, two distinct points determine the line. The task should test axis choice, table-point interpretation and line construction, not pixel-perfect mouse control.


## Revision v3 after product polish

The prototype has been polished after hands-on use:

- answer-giving placeholders were removed; no input field may contain the correct value as an example;
- Task 2 now follows the actual thinking order: first choose the interval around the target price, then read Q from the graph;
- the percentage answer parser must accept normal student notation such as `-50%`, `-50 procent`, and `50% daling`;
- the graph task no longer states the line direction in the task purpose before the student checks the line shape;
- the design note has been expanded into repository-level policy and exemplar-library guidance.

These changes should be treated as product-quality requirements, not as cosmetic polish.

## Repository policy and exemplar adoption

Also import or adapt:

```text
113-excellent-exit-ticket-v3-policy-and-exemplar-guidance.md
```

Required repository actions:

1. Add a durable policy section for Check-surface layout and answer-leak prevention.
2. Add validators for answer-giving placeholders, reversed thinking-step order, overly strict input parsing, formula reveal, and graph-placement precision.
3. Create a product-excellence exemplar area in the repository so teams can inspect strong products before building new ones.
4. Promote reusable interaction patterns into the shared task engine instead of keeping this as a bespoke page.
5. Require separate teacher-learning-quality and student-experience reviews before calling this exemplar complete.

Recommended exemplar location:

```text
references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/
```

Recommended engine follow-ups:

- extend `graph_construction_substitute` with two-point straight-line mode and magnetic table-point snapping;
- add or extend `graph_reading_with_interval` so interval selection appears before numeric read-off;
- keep `formula_builder` for assessed formula knowledge;
- extend `calculation_work_capture` with a tolerant percent parser and operation-chain layout.

## Required repository implementation

### 1. Source data

Replace the current `1.1.3` exit-ticket source with an equivalent of:

```text
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
```

The generated lesson output should then update:

```text
Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/1.1.3-exit-ticket.js
Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – exit-ticket.html
```

Do not hand-edit generated files in `4veco-lessen`.

### 2. Remove formula leakage

The current exit-ticket data includes a formula context block and references it inside the claim-control task. That must be removed for this independent exit ticket.

Correct pattern:

```text
source table -> student chooses interval -> student builds formula -> student fills old/new values -> student computes percentage -> student writes/chooses conclusion
```

Incorrect pattern:

```text
source table + static formula card -> student clicks an interval -> system effectively performs the reasoning
```

### 3. Graph task must be graph work

The graph part should not be reduced to a dropdown. It should require at least:

- axis selection from a label bank with plausible distractors;
- delayed axis labels/ticks until the student makes an axis decision;
- point placement or a strong point-placement substitute;
- line-shape confirmation;
- feedback after checking.

The standalone prototype uses full click-to-place graph points. If the platform engine cannot yet do that, add an explicit follow-up blocker rather than downgrading the task to weak choice interaction.

### 4. Formula builder must be used before calculation

Use the existing `formula_builder` task family or finish its rendered-route adoption before relying on it in the exit ticket.

The formula must be constructed from tokens with distractors. It may not be displayed as a static context block before the attempt.

### 5. Feedback

Feedback may appear after an attempt. It should:

- name the broken operation family;
- avoid giving a complete worked procedure before the attempt;
- route the student to graph practice, interpolation practice, or percentage-change practice;
- avoid grade, mastery, diagnostic, pass/fail, summative, adaptive, or broad product-readiness language.

## Acceptance criteria

The sprint cannot close unless all of these are true in rendered output:

1. The source pane contains only the text/table needed for the task; no formula card is visible before the attempt.
2. The graph workspace is blank enough that the answer is not visually given away.
3. Axis choice has plausible distractors and is a real student action.
4. Point placement or construction substitute requires graph/table mapping, not recognition of a completed graph.
5. The read-off item uses a fresh value and is not identical to the short check.
6. The claim-control task requires interval, old value, new value, formula construction, calculation, and conclusion.
7. The formula is clickable/buildable, not static.
8. Wrong controls are possible; correct-only selectors fail validation.
9. Feedback and next action are visible after checking.
10. `1.1.3` completion language remains held until a later explicit human gate.
11. Remote evidence includes source data, generated JS, generated HTML, screenshots, proof JSON, and separate teacher/student specialist reviews.
12. A reviewer can open the rendered output and immediately see the difference between minimal compliance and a strong product.
13. No placeholder gives away a correct value.
14. Graph-reading UI presents interval selection before numeric read-off.
15. Percentage input accepts common student notation, including a percent sign.
16. The exemplar/policy guidance is added to the repository package or a named follow-up sprint is created.

## Suggested sprint title

```text
CHECKSURFACE-113-EXEMPLAR-EXIT-1
```

## Suggested gate direction after implementation

Do not send this directly to closure. After implementation:

```text
hold_for_exemplar_review
```

Required reviews:

- teacher-learning-quality review;
- student-experience review;
- visual/interaction QA;
- testing/regression review;
- lead synthesis.

Only after those reports exist should a human gate packet be prepared.

# Sprint MATH-UX-2: Student Route Proof

Generated: 2026-05-31

Status: route proof complete before lead review.

## Route Under Review

- Lesson target: `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`
- Paragraph: `1.1.2 Percentages en indexcijfers`
- Live surface: `1.1.2 Percentages en indexcijfers - wiskundevaardigheden.html`
- Skills: `A38 Procentuele verandering berekenen`, `A39 Prijsindex (CPI) berekenen`

## What The Student Sees

The page opens with the SKILLMAP-OP-1 calculation route panel:

- paragraph target: percentage changes and index calculations;
- recommended focus: percentage change first, price index next;
- local progress language only;
- practice action: open the calculation route;
- no visible MTU codes in route text.

When the student opens the `Procentuele verandering berekenen` card, the
skilltree exercise renders a shared task-shell step:

- `numeric_input` for `nieuw min oud`;
- labelled input and neutral `Controleer` action;
- contextual hint remains available;
- feedback appears in `#st-task-feedback` with `aria-live="polite"`.

The deployed `A38` and `A39` generators now expose eight shared task-shell
steps across:

- `numeric_input`;
- `calculation_work_capture`;
- `final_answer_entry`;
- `unit_notation_field`.

## Generated-Output Check

Passed:

```bash
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

The checker proves:

- skilltree shells load `task-shell.css`, `task-shell-engine.js`, and
  `task-shell-ui.js`;
- deployed `skilltree-ui.js` renders `data-skilltree-task-shell="MATH-UX-2"`;
- generated `1.1.2` skilltree data still scopes the route to `A38` and `A39`;
- generated `shared/skilltree/base-elements.js` contains the updated
  `A38`/`A39` task-shell steps;
- no `1.1.2` exit-ticket source or page was created;
- no target-exercise `question_type` or `answer_form` fields were written;
- no answer-skill candidate storage was created.

## Product Boundary

This is local practice-route proof only. It does not authorize
target-equivalent completion language, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or student/product use.

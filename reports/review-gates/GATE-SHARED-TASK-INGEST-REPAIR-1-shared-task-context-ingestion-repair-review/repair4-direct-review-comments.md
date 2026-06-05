# Repair 4 Direct Review Comments

Generated: 2026-06-05

Gate: `GATE-SHARED-TASK-INGEST-REPAIR-1`

Decision: `REVISE`

Gate direction: `hold_for_playable_repair`

This is not a failure. The review says the work made big steps forward, but
the gate remains held for a narrowed playable-interaction repair. The packet
boundary remains correct: no gate closure, generated lesson output, protected
reference mutation, source-data mutation, product-route adoption,
target-equivalent completion language, diagnostics, mastery/sequencing, PV,
Scale Gate 1, broad product use, or student use is authorized.

## Comments By Prompt

`SHAREDINGEST-Q1`: No source-authority blocker. The current review remains
about task usability and interaction quality, not source validity.

`SHAREDINGEST-Q2`: The original exam question is now visible in the right-side
task flow. Retain this repair.

`SHAREDINGEST-Q3`: Still revise. Exam task 1 feels artificial because it asks
the student to select all numbers in the table. Remove it as a required card
unless it becomes a real source-use question. Preferred replacement: ask what
must be compared, with correct answer `jaarpremie + eigen risico exposure`.

`SHAREDINGEST-Q4`: Task 2 has a validation/usability blocker. The reviewer
entered `649` and `euros`; the task marked it wrong. Accept reasonable unit
variants and add targeted feedback for unit-only, work-missing, and
number-wrong cases. Task 3 should still carry the task-2 value and constrain
direction, but unlock only after task 2 is correct or a support path is used.

`SHAREDINGEST-Q5`: No textbook-source authority blocker. Keep the owned-source
boundary.

`SHAREDINGEST-Q6`: The textbook graph task is the strongest part of the work
but still revise. The student should click directly in the graph workspace,
then click to draw the line, and the line should appear in that same graph
workspace. Do not render a separate completed graph below.

`SHAREDINGEST-Q7`: The delayed label idea is good, but restore a readable grid.
Keep grid visible from the start, hide axis names/numeric labels until correct
axis selection, then reveal labels and scale.

`SHAREDINGEST-Q8`: The 50 percent follow-up is unclear. Simplify sharply with
interval choice and auto-filled quantities, or remove it from required gate
proof. Do not keep free-form interval + unit + calculation fields without
clear expected format.

`SHAREDINGEST-Q9`: Visual QA did not catch enough. Source pane/source labels
are noisy. Remove duplicate visible `Bron 1` and `Tabel 1` labels. Visual QA
must include a duplicate-label check.

`SHAREDINGEST-Q10`: No product-authority blocker. The packet correctly keeps
product-route adoption, target-equivalent completion language, diagnostics,
mastery, sequencing, PV, Scale Gate 1, broad product use, and student use
unauthorized.

`SHAREDINGEST-Q11`: Required repairs before a later controlled
adoption-preparation sprint may start:

1. Textbook: draw the line in the same graph workspace.
2. Textbook: attach axis selection to the graph if feasible.
3. Textbook: keep a readable grid visible from the start.
4. Textbook: keep labels and scale hidden until axis selection.
5. Textbook: simplify or remove the 50 percent follow-up.
6. Exam: remove task 1 or make it a conceptual setup task.
7. Exam: fix task-2 validation for `649` plus reasonable unit variants.
8. Exam: add a hint/feedback path when stuck.
9. Global: remove duplicate visible `Bron 1` / `Tabel 1` labels.
10. Global: update visual QA so these issues fail automatically.

`SHAREDINGEST-Q12`: `hold_for_playable_repair`.

## Quality Log

| Issue | Category | Severity | Next action | Proof required |
|---|---|---|---|---|
| Graph line appears as separate completed graph | Interaction design | High | Draw line inside active workspace | Screenshot and checker proving no separate completed graph block |
| Exam task 2 rejects reasonable answer/unit | Validation/usability | Blocking | Accept unit variants and add targeted feedback | Unit-only feedback test and screenshot |
| No support when stuck | Feedback design | Blocking | Add progressive support after failed attempts | Screenshot after failed attempts showing hint/support |
| Exam task 1 has low learning value | Didactic design | High | Remove or redesign conceptually | Revised task set where task 1 is useful or folded into calculation |
| Duplicate source/table labels | Visual QA | Medium-high | Enforce one visible label per block | Duplicate-label checker and updated screenshot |
| 50 percent follow-up unclear | Task affordance | High | Simplify to interval choice + auto-filled quantities or make optional | Human reviewer can complete without guessing field format |

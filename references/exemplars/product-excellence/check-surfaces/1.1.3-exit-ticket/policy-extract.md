# Product Excellence Exemplar Policy — Check Surfaces and Exit Tickets

## Status

Policy extract and implementation guidance for `CHECKSURFACE-113-EXEMPLAR-EXIT-1`. The core rules from this extract were promoted into `../4veco-lessen/specifications/product-end-state.md` on 2026-06-08 as durable check-surface policy. This document remains the exemplar-specific source trail; it does not by itself authorize product-route adoption, completion language, diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Why this policy exists

The 1.1.3 exit-ticket exemplar demonstrates the product quality bar expected from autonomous agents. The goal is not merely to pass a review packet. The goal is a student-facing task that checks the intended operation independently, in a clean interface, with enough tolerance and feedback to be usable.

## Layout policy for Check surfaces

1. **Source-left / task-right workspace**
   Use a stable source/task workspace for multi-step exit tickets. The source pane should contain only the data needed for the task: concise context, table, chart, or source text. The task pane should contain the active student work.

2. **No pre-attempt teaching card**
   Exit tickets may orient the student to the goal, but may not give a procedure block, worked example, static formula, answer pattern, or visible completed graph before the attempt when that knowledge is part of the assessed skill.

3. **One cognitive operation per visible step**
   Split compound answers into the operations students must perform on a test. For percentage-claim control, the preferred structure is: interval → old value → new value → formula structure → calculation → conclusion.

4. **Interface order follows thinking order**
   Do not put the final numeric box before the source-selection step if students should first inspect the source. For graph reading, the order is: choose the interval around the target value, then read or interpolate the answer.

5. **No answer-giving placeholders**
   Placeholders may show the expected type of answer but not the correct value. Use “vul hoeveelheid in”, not “bijv. 225” when 225 is the answer. Use “vul percentage in, bijvoorbeeld met %”, not “bijv. -50” when -50% is the answer.

6. **Active manipulation over recognition**
   Prefer label placement, point placement, formula building, interval selection, and structured fields over ordinary multiple choice. Choice controls must contain plausible distractors and may not make wrong answers impossible.

7. **Tolerance matches the assessed skill**
   Do not test pixel precision when the goal is graph interpretation. For point placement on known table points, use snapping or broad tolerance. For percent answers, accept common student notations such as `-50`, `-50%`, `-50 procent`, and `50% daling` when they express the same economic conclusion.

8. **Feedback after attempt only**
   Feedback may explain the correction after the student attempts the task. It must name the operation to practise next and avoid grade, diagnostic, mastery, summative, pass/fail, adaptive-routing, PV, or product-readiness language.

## Shared task-engine reuse guidance

The exemplar should not remain a one-off hand-built page. Convert its interaction patterns into reusable shared task families or extensions:

| Pattern | Reusable engine target | Required behaviour |
|---|---|---|
| P-Q graph construction | `graph_construction_substitute` extension | delayed axes/ticks, label-bank distractors, two-point straight-line policy, magnetic table-point snapping, line-shape check |
| Graph reading with source interval | `graph_reading_with_interval` or `graph_reading` extension | interval selection appears before numeric answer, plausible interval distractors, no answer-value placeholder, tolerant numeric parser |
| Formula independence | existing `formula_builder` | token bank with distractors, accepted sequence validation, no static pre-attempt formula card |
| Test-style calculation answer | `calculation_work_capture` extension | old/new values, formula or formula reference, percent answer parser, conclusion field/choice, next-practice feedback |
| Natural answer parsing | shared parser utility | accept units, comma decimals, percent signs, Unicode minus, and decrease phrases where appropriate |

If the existing shared task engine cannot support a pattern, record an engine blocker. Do not weaken the exemplar back into a dropdown-only task.

## Product-exemplar repository guidance

Create a durable exemplar library so weaker teams can inspect good products before building new ones. Suggested structure:

```text
references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/
  README.md
  prototype.html
  candidate-data.json
  policy-extract.md
  implementation-handoff.md
  quality-brief.md
  screenshots/
    desktop-light.png
    desktop-dark.png
    mobile-light.png
    mobile-dark.png
  review/
    teacher-learning-quality-review.md
    student-experience-review.md
    visual-interaction-review.md
    testing-regression-review.md
    lead-synthesis.md
```

Each exemplar entry should answer:

- Which student operation does it check?
- What prior failure does it prevent?
- Which reusable task families does it exercise?
- Which validators should fail if the task is degraded?
- What screenshots prove the rendered quality?
- Which parts are production-ready and which are still prototype guidance?

## Validator follow-ups

Add or extend validators for:

- `answer_giving_placeholder`;
- `exit_ticket_plain_formula_reveal`;
- `procedure_or_formula_pre_attempt_scaffold`;
- `graph_answer_visible_before_axis_selection`;
- `graph_reading_value_before_interval_order`;
- `point_placement_tolerance_too_strict`;
- `straight_line_graph_requires_more_than_two_points`;
- `formula_not_clickable_when_assessed`;
- `correct_only_interval_selector`;
- `numeric_parser_rejects_percent_symbol`;
- `feedback_missing_next_practice_route`.

## Adoption rule

A product-excellence exemplar is not complete until it has:

1. rendered desktop/mobile and light/dark proof;
2. separate teacher-learning-quality and student-experience review;
3. testing proof for negative fixtures;
4. lead synthesis explaining why it is better than minimum compliance;
5. a policy extract or validator follow-up that preserves the lesson learned.

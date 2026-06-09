# 1.1.3 Excellent Exit Ticket — quality brief

## What this exemplar changes

The current retry direction still allows a weak pattern: the surface looks repaired, but the actual student action is too close to guided recognition. This exemplar changes the product pattern.

## Design principles

### Independent exit-ticket work

The student sees a source and a work area. The product does not teach the procedure before the attempt.

### No formula leak

The percentage formula is not printed as a static source card. The student must build the calculation structure with formula tokens. The token bank contains plausible distractors.

### Graph/table action fidelity

The graph part requires axis choice, point placement, and line construction. It is not a completed graph with a dropdown question attached.

### Two points for a straight line

The source table is now straight-line data. The student only needs to place two distinct table points and connect them. Requiring all five points would add needless motor precision without adding meaningful mathematical evidence.

### Forgiving point placement

Point placement should use magnetic snapping or broad tolerance. The exit ticket should check whether the student understands the P-Q graph, not whether the student can click a tiny pixel-perfect coordinate.

### Full operation chain

The ticket checks the paragraph target chain:

1. read the table;
2. choose economic P-Q axes;
3. construct a straight-line graph from two table points;
4. read/interpolate a value;
5. identify the relevant interval for a percentage claim;
6. use old/new values;
7. build the percentage-change calculation;
8. state the conclusion.

### Feedback as route repair

Feedback is given after an attempt and routes the student to the useful practice area. It does not claim a grade, diagnosis, mastery, sequencing, or summative result.

## Why this is an example of excellence

It does not merely remove forbidden language. It changes the student experience from “select answers around a visible solution” to “perform the real target operation in a constrained, readable workspace.”

It is also machine-friendly: the quality expectations can be turned into validators.

## Validators this exemplar should trigger

Add or extend validators for:

- `exit_ticket_plain_formula_reveal`;
- `formula_not_clickable_when_assessed`;
- `procedure_or_formula_pre_attempt_scaffold`;
- `graph_answer_visible_before_axis_selection`;
- `straight_line_graph_requires_more_than_two_points`;
- `point_placement_tolerance_too_strict`;
- `axis_selector_without_plausible_distractors`;
- `correct_only_interval_selector`;
- `short_exit_near_duplicate`;
- `graph_task_without_point_or_construction_action`;
- `feedback_missing_next_practice_route`;
- `completion_language_enabled_without_gate`.

## Open implementation caveat

The standalone prototype shows the desired student experience. The candidate JSON uses current task-family names where possible, but full click-to-place graph construction may require platform-engine work. If that engine work is not present, the correct response is to create a named engine follow-up, not to weaken the task into a dropdown-only check.


## Product-polish revisions in v3

The v3 exemplar fixes three defects found during hands-on use:

1. Answer-giving placeholders are removed. A field may show the answer type, but not the answer value.
2. The graph-reading step now follows student reasoning order: first identify the interval around the target price, then read Q.
3. Percentage input is tolerant of normal notation. A student typing `-50%` should not be marked wrong merely because of the percent sign.

These are not minor UI preferences. They are policy examples: the interface must not leak answers, must follow the cognitive sequence, and must accept ordinary test-answer notation.

## Repository-level preservation

This exemplar should become a permanent product-excellence reference. Store it in an exemplar library, connect it to shared task-engine families, and add validators for the specific failure modes it prevents. In particular, preserve the task-three operation chain:

```text
interval -> old value -> new value -> formula structure -> calculation -> conclusion
```

That chain is close to the answer structure students should use on a test. Future percentage/data-claim tasks should reuse this structure unless there is a clear didactic reason not to.

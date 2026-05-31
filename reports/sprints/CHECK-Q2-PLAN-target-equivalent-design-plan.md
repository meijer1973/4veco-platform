# Sprint CHECK-Q2-PLAN: Target-Equivalent Design Plan

Generated: 2026-05-31

## Purpose

Define the future target-equivalent exit-ticket design that `L1.7B-Q2` may
prepare after exact authority is granted.

This file is not implementation authority.

## Design Principle

The exit ticket is not a longer short check. It is a target-equivalent proof
task.

It should be built backward from the paragraph target exercise:

```text
target exercise -> operation chain -> answer forms -> task-shell families ->
answer model -> neutral feedback -> reviewed local completion copy
```

The advisory short check may continue to advise what to practise. It must not
be upgraded silently into proof.

## Paragraph Selection Preflight

Before `L1.7B-Q2` implements a target-equivalent exit ticket, it must choose a
paragraph and pass this preflight:

| Preflight question | Required answer |
|---|---|
| Is the full target-exercise operation chain reviewed? | yes |
| Are all required task-shell families available and reviewed for that chain? | yes |
| Are required answer forms available or explicitly held with a substitute decision? | yes |
| Are current route blockers resolved or included as in-scope repairs with proof? | yes |
| Is advisory short-check state separate from proof state? | yes |
| Is completion language still blocked until `GATE-L1.7B-Q2`? | yes |

Current recommendation: do not treat any of `1.1.1`, `1.1.2`, or `1.1.3` as
ready for direct target-equivalent implementation without a repair/preflight
decision.

## Future Data Contract

A future target-equivalent source file should separate advisory and proof
state. Example shape:

```json
{
  "surface": "target_equivalent_exit_ticket",
  "parNr": "1.1.x",
  "advisoryShortCheck": {
    "separateSurface": true,
    "targetEquivalentProof": false
  },
  "targetEquivalent": {
    "candidate": true,
    "gateApproved": false,
    "completionLanguageEligible": false
  },
  "operationChain": {
    "targetExerciseRef": "references/authored/course-target-exercises.json#1.1.x",
    "coverage": []
  },
  "tasks": []
}
```

`gateApproved` and `completionLanguageEligible` must remain false until
`GATE-L1.7B-Q2`.

## Task Composition

Future Q2 tasks should use the shared task shell.

| Need | Task-shell family |
|---|---|
| numeric answer | `numeric_input` or `final_answer_entry` |
| visible work | `calculation_work_capture` |
| percent, index, unit, notation | `unit_notation_field` |
| table value | `table_value_selection` |
| graph read/interpolation | `graph_reading` |
| graph construction substitute | `graph_construction_substitute` or `point_placement` |
| source observation | source/table task plus `A81` modifier criteria |
| short reasoning | `short_constructed_response` or `structured_reasoning` |

Choice tasks may support local checks or narrow recognition, but they must not
replace calculation, graph/table, or constructed-response actions when the
target exercise requires those actions.

## Answer-Model Requirements

Each target-equivalent task must include:

- operation being checked;
- expected answer or criteria;
- required work or evidence;
- answer-form lane or held-lane decision;
- accepted tolerance or alternative wording where relevant;
- neutral feedback;
- next practice advice when the answer is not yet sufficient;
- no diagnostic, mastery, sequencing, summative, AI, PV, or Scale Gate claim.

## State Model

Future implementation must keep these states separate:

| State | Meaning | Proof? |
|---|---|---:|
| `localPracticeProgress` | practice route or game progress | no |
| `advisoryShortCheckResult` | local advice from short check | no |
| `targetEquivalentAttempt` | current exit-ticket attempt | not by itself |
| `targetEquivalentProof` | later gate-approved proof status for one paragraph | only after `GATE-L1.7B-Q2` |
| `completionLanguageEligible` | local completion copy may be shown | only after `GATE-L1.7B-Q2` |

No state may be inferred from skill stars, route panel progress, procedure
scores, reasoning local progress, or advisory short-check completion.

## Feedback Model

Feedback should use the local neutral grammar from GAME-ARCH-2:

1. name what was checked;
2. state what happened locally;
3. give one repair or confirmation cue;
4. offer next practice or next check action.

For target-equivalent output before gate approval, completion copy is not
eligible. After gate approval, local non-summative paragraph-completion copy
may be considered only for the approved output.

## Copy Hierarchy

Checkpoint-only:

```text
Je hebt deze check afgerond.
```

Advisory short check:

```text
Oefen nog met [spel of vaardigheid].
Ga door naar de exit-ticket-check.
Je kunt voorlopig verder, maar herhaal [vaardigheid] later nog.
```

Target-equivalent exit ticket after `GATE-L1.7B-Q2` only:

```text
Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.
Je kunt nu door naar de eindopgave.
Je hebt deze paragraaf-check succesvol afgerond.
```

## Non-Ready Paragraph Consequence

Because all current first-three paragraph candidates still have blockers,
`CHECK-Q2-PLAN` should not close by saying `L1.7B-Q2` may immediately publish
proof output.

It should close by saying a later implementation plan may be prepared only
after it names the selected paragraph, resolves or scopes the blockers, and
defines the exact rendered-output proof for `GATE-L1.7B-Q2`.

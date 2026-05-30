# EX-LESSON-1 Exam-Target Route Checklist

Generated: 2026-05-30

Status: active handoff checklist for later exam-target paragraph and
target-equivalent exit-ticket work.

## Purpose

This checklist turns the exam-ingestion end state into a concrete authoring and
review surface. It does not authorize generated lesson output, protected
reference mutation, target-exercise field writes, candidate storage, candidate
writes, diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Required Exam Evidence

For every official CvTE or CvTE-derived target exercise, the paragraph plan must
name:

- official prompt and question number;
- source annexes, figures, tables, and graphs;
- official correction model and point allocation;
- accepted alternatives or rewarded wording where available;
- required concepts;
- required calculations;
- required graph/table/source operations;
- required reasoning operations;
- required answer-writing and answer-form operations.

## Paragraph-Plan Checklist

The `_paragraph-plan.md` must contain an `Exam-target route trace` section with
these tables completed or explicitly marked `blocked: [named sprint/gate]`:

| Table | Required purpose |
|---|---|
| `Target answer requirements` | Decompose each official correction-model step into concept, calculation, source/visual, reasoning, and answer wording requirements. |
| `Paragraph build implications` | Show where each required operation is taught, practised, scaffolded, repeated, assumed as prior knowledge, or deliberately out of scope. |
| `Student route trace` | Map official requirements to explanation, practice route, skill-map route, shared task shell need, target-equivalent exit ticket, answer model, and review/gate evidence. |
| `Answer-form chain` | Map the underlying operation to answer form/modifier, task type, MTU or answer-form evidence, and held/blocked conditions. |

## Shared Task Shell Handoff

When a required official action needs interaction, name the task type in
student-action language:

- numeric input;
- calculation/work capture;
- final-answer entry;
- unit/notation field;
- short constructed response;
- table-value selection;
- graph reading;
- point placement;
- graph-construction substitute;
- retry/self-check or neutral feedback state.

Do not force a calculation, graph/table, source-use, or constructed-response
requirement into a choice-only task if the official correction model needs a
different answer form.

## Review Gate Checklist

Future review gates must inspect:

| Gate or sprint | Required EX-LESSON-1 evidence |
|---|---|
| `L-EX0` | Dry-run paragraph plan contains the complete exam-target route trace and named blockers. |
| `L-EX1` | Generated paragraph and companion output match the route trace without hand patches. |
| `GAME-UX-3A` | Shared task shell can represent the task families named in the route trace. |
| `ENGINE-OP-1` | Student-path traces show the route, task, feedback, and next action for exam-style requirements where applicable. |
| `L1.7B-Q2` | Exit ticket covers the complete reviewed operation and answer-form chain at the same cognitive level. |
| `GATE-L1.7B-Q2` | Human review decides whether local target-equivalent completion language is justified. |
| `Scale Gate 1` | Scale reliance is blocked unless target-equivalent proof is established or explicitly waived with checkpoint-only consequences. |

## Stop Conditions

Stop or route a gate pause if:

- an official correction-model step is required but not taught, practised,
  scaffolded, justified as prior knowledge, or explicitly out of scope;
- a source annex, figure, table, or graph operation is needed but has no
  student-visible route;
- a target-equivalent exit ticket is claimed without complete operation-chain
  and answer-form coverage;
- internal MTU or operation codes leak into student-facing labels;
- a generated surface makes diagnostic, mastery, sequencing, summative,
  student-facing AI, PV, Scale Gate, or product-use claims without a later
  explicit gate.

## Next Use

The immediate next consumer is `GAME-UX-3A`, which must use this checklist when
designing task-shell support for target-equivalent exit tickets, graph/table
practice, math/calculation practice, and exam-style answer-form requirements.

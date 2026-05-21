# Exam Ingestion Review Procedure

Status: EX-0 contract procedure, no pilot data approved yet.

## Purpose

The review procedure determines whether an official exam-question ingestion overlay is complete enough for later EX-1/EX-2 pilot work.

It does not authorize protected reference mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, student diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Do not hand-edit `references/external/`.

## Review Inputs

For each pilot exam question, the reviewer must receive:

- the external exam-question source record;
- the official correction-model source reference;
- source annexes, figures, tables, graphs, and uitwerkbijlagen if required by the question;
- the exam-ingestion overlay record;
- any source-annex gap records;
- any answer-model gap records;
- MTU and operation mapping evidence;
- lesson-build handoff notes.

## Required Review Checks

1. Prompt metadata and prompt text are separately traceable.
2. Source material is either reconstructable or explicitly marked as a blocking gap.
3. Official correction-model steps are first-class records, not prose-only commentary.
4. Point rules and partial-credit rules can be reconstructed by a human reviewer.
5. Mandatory terms, accepted alternatives, precision, unit, and graph requirements are present or explicitly marked as gaps.
6. Skill decomposition separates content, calculation, graph, source-reading, reasoning, and answer-writing operations.
7. Every requirement is classified for MTU/operation coverage before mutation.
8. Lesson-build handoff explains what a paragraph would need to teach, practice, scaffold, or assume.
9. Product-boundary fields remain false.

## Review Outcomes

Use one of these outcomes:

- `pass`: the pilot overlay is contract-complete and ready for EX-2 mapping review.
- `pass_with_gaps`: the pilot overlay is usable for a bounded pilot, but named gaps must remain visible downstream.
- `revise`: the overlay is not reconstructable enough for mapping or lesson handoff.
- `hold`: authority, source availability, or boundary conditions are unresolved.

## Future Interview Protocol

For the human gate:

1. Show the full planned question list before starting.
2. Ask one question at a time.
3. Record each answer before asking the next question.
4. Run pattern analysis after initial answers.
5. Ask targeted follow-ups for ambiguity or conflicting authority.
6. Draft a gate decision only after evidence is complete.
7. Require explicit human confirmation before writing a closure record or authorizing EX-1 pilot data.

## Stop Conditions

Stop the review if:

- the official correction model is missing and not explicitly marked as a gap;
- source annexes or figures needed for calculation/graph/source-reading cannot be reconstructed and are not marked as gaps;
- prompt and answer-model evidence are merged into untraceable prose;
- the overlay claims unit minting or protected mutation authority;
- the overlay authorizes diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

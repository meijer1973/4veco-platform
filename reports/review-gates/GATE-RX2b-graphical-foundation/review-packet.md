# GATE-RX2b Graphical Foundation Review Packet

Status: prepared_for_human_review

## Purpose

Review the RX.2b graphical foundation coverage report and decide whether any CLI-only unit mutation may proceed for the basic graphical representation-reading queue.

## Boundary

- Mutation is not authorized by this packet.
- Any later mutation must be CLI-only through `build-scripts/references/unit-add.js`.
- No hand edits to `references/machine/`, `references/external/`, authored source files, RAG chunks, or lesson targets are allowed.
- No student diagnostics, adaptive routing, student-facing AI, sequencing, mastery decisions, or summative use is authorized.

## Target Queue

- Approved review queue: `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, `A73`.
- Conditional high-risk review target: `A71`.

## Coverage Summary

- live units: 8
- candidate units: 7
- held/high-risk units: 1
- missing/not-yet-scoped items: 1
- generator-blocked live units: 8

## Candidate Summary

| ID | Name | Lane | Needs | Risk | Evidence |
| --- | --- | --- | --- | --- | --- |
| A62 | Waarden aflezen uit staafdiagram | approved_review_queue | [] | medium | didactic_prior_rationale |
| A63 | Waarden aflezen uit lijngrafiek | approved_review_queue | [] | medium | target_exercise_evidence |
| A64 | Aandelen aflezen uit cirkeldiagram | approved_review_queue | [] | medium | didactic_prior_rationale |
| A65 | Absolute hoeveelheid berekenen uit aandeel en totaal | approved_review_queue | A64, A04 | medium | exam_question_evidence |
| A68 | Procentuele verandering berekenen vanuit staafdiagram | approved_review_queue | A38, A62, A66 | medium | didactic_prior_rationale |
| A69 | Procentuele verandering berekenen vanuit lijngrafiek | approved_review_queue | A38, A63, A66 | medium | target_exercise_evidence |
| A73 | Indexverandering aflezen uit lijngrafiek | approved_review_queue | A39, A63 | medium | target_exercise_evidence |
| A71 | Procentuele verandering berekenen vanuit cirkeldiagram | conditional_high_risk | A38, A64, A65, A70 | high | didactic_prior_rationale |

## Review Questions

### RX2b-Q1

Is the graphical foundation queue complete enough for bar, line, pie, percentage-change, and index-reading basics?

- A. Yes
- B. Mostly, with additions needed
- C. No, hold and expand the queue
- D. Not enough evidence
### RX2b-Q2

Are A62, A63, and A64 acceptable as representation-reading foundation units with explicit context, labels, units, scale, exact/estimated reading, and interpolation steps?

- A. Yes
- B. Yes, with wording fixes
- C. No, procedures are too thin
- D. Not enough evidence
### RX2b-Q3

Is A65 justified as a composed share-times-total unit after A64 and A04?

- A. Yes
- B. Yes, but revise needs or wording
- C. No, hold A65
- D. Not enough evidence
### RX2b-Q4

Are A68, A69, and A73 sufficiently grounded for mutation review?

- A. Yes
- B. Mostly, approve a subset
- C. No, hold all composed visual calculations
- D. Not enough evidence
### RX2b-Q5

Is A71 safe to mutate now, or should it remain held because pie-chart percentage-change composition is high risk?

- A. Approve A71
- B. Hold A71 for later review
- C. Split A71 before approval
- D. Not enough evidence
### RX2b-Q6

Should the provisional IDs A62/A63/A64/A65/A68/A69/A73 and conditional A71 be preserved with gaps?

- A. Preserve IDs with gaps
- B. Renumber before mutation
- C. Decide only at execution time
- D. Not enough evidence
### RX2b-Q7

Does the dependency order work without unresolved needs or cycles if approved candidates are applied in the proposed order?

- A. Yes
- B. Yes, but add checks
- C. No, revise order or needs
- D. Not enough evidence
### RX2b-Q8

Does the graphical foundation coverage report clearly distinguish live, candidate, held/high-risk, missing/not-scoped, and generator-blocked skills?

- A. Yes
- B. Mostly, with report wording fixes
- C. No, revise report before closure
- D. Not enough evidence
### RX2b-Q9

Are all newly approved A-units to remain generator-blocked/non-interactive until RX.6 generator implementation and validation?

- A. Yes
- B. Yes, but strengthen warnings
- C. No, implement generators first
- D. Not enough evidence
### RX2b-Q10

What gate status should GATE-RX2b-graphical-foundation receive?

- A. pass
- B. pass_with_conditions
- C. hold
- D. fail

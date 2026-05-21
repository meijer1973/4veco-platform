# GATE-EX0 Exam Ingestion Contract Review Packet

Generated: 2026-05-21

Status: review packet ready, EX-1 not authorized.

No protected reference mutation authorized. No external-source mutation authorized. No unit minting authorized. No target-exercise promotion authorized. No CP-6 or Year-1 closure authorized.

## Review Scope

The reviewer should decide whether the EX-0 exam-ingestion contract is adequate for a later bounded EX-1 pilot.

Evidence base:

- `references/schemas/exam-ingestion.schema.json`
- `references/data/exam-ingestion/README.md`
- `references/data/exam-ingestion/review-procedure.md`
- `references/data/exercises/README.md`
- `references/schemas/exercise-metadata-overlay.schema.json`
- `references/schemas/exam-question.schema.json`
- `references/reference-team-roadmap.md`

## Full Planned Review Questions

The future human review must show this complete list before starting, then ask one question at a time.

### EX0-Q1: Overlay family

Does the EX-0 contract correctly keep official exam prompts, source material, official correction models, point rules, decomposition, and gap classifications as governed `references/data/` overlays rather than mutations to `references/external/`?

Options:
- Yes, keep the overlay-first design and forbid external-source mutation.
- Revise the storage split before EX-1.
- Hold until source-refresh tooling is designed.
- Open answer / other, with rationale.

### EX0-Q2: Prompt/source/answer-model separation

Does the schema separate prompt metadata, source annexes, graphs/tables/figures, and official answer-model requirements enough for a human to reconstruct the exam task?

Options:
- Yes, the separation is sufficient for a pilot.
- Revise; name missing fields.
- Hold until a real question dry-run proves the split.
- Open answer / other, with rationale.

### EX0-Q3: Official correction-model contract

Are answer steps, point rules, mandatory terms, accepted alternatives, partial-credit rules, precision/unit requirements, and graph requirements the right minimum correction-model fields?

Options:
- Yes, this is the minimum EX-1 contract.
- Add or remove fields before EX-1.
- Hold until correction-model extraction tooling is drafted.
- Open answer / other, with rationale.

### EX0-Q4: Source-annex gaps

Are source-annex, graph-object, precision, and answer-model gap statuses explicit enough to block downstream mapping or lesson handoff when evidence is incomplete?

Options:
- Yes, gaps are explicit enough.
- Revise severity/blocking semantics.
- Hold until a graph/source-heavy pilot question is selected.
- Open answer / other, with rationale.

### EX0-Q5: MTU and operation classification

Is the EX-0 classification taxonomy sufficient for EX-2 mapping: existing MTU, weak MTU, missing MTU, merge/split candidate, operation-registry need, PV/graph need, answer-skill need, source-annex gap, answer-model extraction gap, or defer?

Options:
- Yes, use this taxonomy for EX-1/EX-2.
- Revise the taxonomy before pilot work.
- Hold until CP-6 closure-readiness work is complete.
- Open answer / other, with rationale.

### EX0-Q6: Lesson-build handoff

Does the lesson-build handoff contract capture what a paragraph must teach, practice, scaffold, assume, or block before an official exam question can become a target exercise?

Options:
- Yes, sufficient for L-EX0 coordination.
- Revise handoff fields before lesson-team use.
- Hold until the lesson team reviews the contract.
- Open answer / other, with rationale.

### EX0-Q7: Product boundaries

Does EX-0 correctly block diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, and student-facing output?

Options:
- Yes, all product boundaries must remain false.
- Revise boundary fields before EX-1.
- Hold until product governance reviews the list.
- Open answer / other, with rationale.

### EX0-Q8: Next sprint authorization

Does this gate authorize EX-1 to create three bounded pilot exam-ingestion overlays after human review, or should EX-0 be revised first?

Options:
- Authorize EX-1 pilot overlays after the gate closes, with no mutation.
- Revise EX-0 contract before any pilot overlays.
- Hold EX-1 until CP-6/Year-1 closure strategy is decided.
- Open answer / other, with rationale.

## Future Interview Protocol

- Show the full question list before starting.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a gate decision only after evidence is complete.
- Require explicit human confirmation before writing a gate closure record or authorizing EX-1 pilot data.

## Current Stop Conditions

- Stop if any answer authorizes protected reference mutation or external-source mutation.
- Stop if any answer authorizes unit minting before EX-2 mapping review and later CLI-governed mutation.
- Stop if any answer treats prompt-only extraction as full exam ingestion.
- Stop if any answer allows source-annex or answer-model gaps to be hidden downstream.
- Stop if any answer authorizes CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Recommended Next Action

Run the formal GATE-EX0 human review before EX-1 creates pilot exam-ingestion overlay records.

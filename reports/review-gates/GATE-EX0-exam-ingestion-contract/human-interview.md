# GATE-EX0 Exam Ingestion Contract Human Interview

Sprint: EX-0
Gate: GATE-EX0-exam-ingestion-contract
Date: 2026-05-21
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned EX0 question list in `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.md` before supplying answers.

This record preserves each answer separately and checks for contradictions before gate closure.

Overall decision: `PASS WITH CONDITIONS`.

The EX-0 contract is adequate to authorize EX-1 as a bounded pilot after the gate is formally closed. EX-1 may create the three planned pilot exam-ingestion overlays, but only as non-mutating `references/data/` pilot records.

This review does not authorize protected reference mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Main condition: EX-1 must not treat a graph/source-heavy question as fully reconstructable unless the graph, table, or source values are actually reconstructable, or the missing parts are marked as blocking gaps.

## Recorded Answers

### EX0-Q1: Overlay family

Question: Does the EX-0 contract correctly keep official exam prompts, source material, official correction models, point rules, decomposition, and gap classifications as governed `references/data/` overlays rather than mutations to `references/external/`?

Human answer: Yes, keep the overlay-first design and forbid external-source mutation.

Recorded rationale:

- The schema fixes the authority boundary: external-source mutation, machine-reference mutation, unit minting, and student-product use remain false.
- Source-path provenance is required.
- Official exam prompts, source annexes, figures, tables, graphs, uitwerkbijlagen, and official correction models remain external authority.
- Exam-ingestion overlays are governed `references/data/` records and must not overwrite external source records.

Decision: retain overlay-first design and forbid external-source mutation.

### EX0-Q2: Prompt/source/answer-model separation

Question: Does the schema separate prompt metadata, source annexes, graphs/tables/figures, and official answer-model requirements enough for a human to reconstruct the exam task?

Human answer: Yes for a bounded pilot, with one condition.

Recorded rationale:

- The schema separates `prompt_metadata`, `prompt`, `source_material`, `question_classification`, `official_answer_model`, `skill_decomposition`, `mtu_gap_classification`, and `lesson_build_handoff`.
- The README requires prompt metadata/text, source references, source objects, correction-model source reference, answer steps, point rules, precision/unit expectations, graph requirements, operation decomposition, MTU gaps, and lesson-build handoff to remain separately traceable.

Condition:

- The `source_graph` object is not yet enough to reconstruct a graph-heavy exam item by itself.
- EX-1 graph-heavy pilot records must either represent needed values elsewhere, usually as tables or source values, or carry a blocking `graph_object_gap` or `source_annex_gap` for full reconstruction, MTU mapping, or lesson handoff.

Decision: approve the separation for EX-1 pilot use with explicit graph/source reconstruction gaps.

### EX0-Q3: Official correction-model contract

Question: Are answer steps, point rules, mandatory terms, accepted alternatives, partial-credit rules, precision/unit requirements, and graph requirements the right minimum correction-model fields?

Human answer: Yes, this is the minimum EX-1 contract.

Recorded rationale:

- Minimum fields are present: `answer_steps`, `point_rules`, `mandatory_terms`, `accepted_alternatives`, `partial_credit_rules`, `calculation_precision`, `unit_requirements`, `graph_requirements`, and `answer_model_gaps`.
- The review procedure checks that official correction-model steps are first-class records and that point rules, partial-credit rules, mandatory terms, alternatives, precision, unit, and graph requirements are present or explicitly marked as gaps.

Condition:

- During EX-1, `source_ref` should identify the correctievoorschrift location with enough specificity, not only the exam as a whole.

Decision: approve the minimum correction-model contract for EX-1.

### EX0-Q4: Source-annex gaps

Question: Are source-annex, graph-object, precision, and answer-model gap statuses explicit enough to block downstream mapping or lesson handoff when evidence is incomplete?

Human answer: Yes, gaps are explicit enough, but EX-1 needs an actual pilot-overlay validator.

Recorded rationale:

- The schema's `extraction_gap` object includes `gap_type`, `severity`, `description`, and `blocks`.
- Block targets include `full_exam_reconstruction`, `answer_model_reconstruction`, `mtu_mapping`, `lesson_build_handoff`, and `human_review`.
- The README and review procedure require source-annex, answer-model, graph-object, precision, and unit-requirement gaps to remain explicit and block affected downstream use.

Condition:

- EX-1 must add a real pilot-overlay validator. The EX-0 checker validates the contract only.

Decision: accept gap semantics for EX-1, conditional on a separate pilot-data validator.

### EX0-Q5: MTU and operation classification

Question: Is the EX-0 classification taxonomy sufficient for EX-2 mapping: existing MTU, weak MTU, missing MTU, merge/split candidate, operation-registry need, PV/graph need, answer-skill need, source-annex gap, answer-model extraction gap, or defer?

Human answer: Yes, use this taxonomy for EX-1/EX-2.

Recorded rationale:

- The taxonomy matches the EX-2 mapping decision space.
- The schema encodes existing MTU, weak existing MTU, missing MTU, merge/split candidate, operation-registry need, PV/graph need, answer-skill need, source-annex gap, answer-model extraction gap, and defer.
- `mutation_authorized` remains fixed false.
- Later unit, operation, or answer-skill mutation requires explicit human-reviewed gate authority and a governed CLI path.

Decision: use this taxonomy for EX-1 and EX-2. No CP-6 closure-readiness hold is needed here; CP-6 and Year 1 remain open separately.

### EX0-Q6: Lesson-build handoff

Question: Does the lesson-build handoff contract capture what a paragraph must teach, practice, scaffold, assume, or block before an official exam question can become a target exercise?

Human answer: Sufficient for L-EX0 coordination, but not yet sufficient as the final lesson-build contract.

Recorded rationale:

- The schema has `lesson_build_handoff` fields for handoff status, target paragraph candidate, required teaching moves, required practice moves, required visuals, required answer-model scaffolds, and blocked-until conditions.
- The review procedure checks whether the handoff explains what a paragraph would need to teach, practice, scaffold, or assume.

Condition:

- L-EX0 should make two paragraph-plan fields explicit:
  - assumed prior knowledge with MTU evidence;
  - deliberately out of scope with reason.
- The current handoff can approximate this through notes and `blocked_until`, but it should be explicit before an actual lesson paragraph is built.

Decision: approve the handoff for L-EX0 coordination with the explicit lesson-contract condition above.

### EX0-Q7: Product boundaries

Question: Does EX-0 correctly block diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, and student-facing output?

Human answer: Yes, all product boundaries must remain false.

Recorded rationale:

- The schema sets the product-boundary fields to `const: false`.
- The README repeats the blocked list and states that overlays are internal reference and lesson-design evidence only.
- The review procedure stops the review if any blocked product use is authorized.

Decision: keep all product boundaries false.

### EX0-Q8: Next sprint authorization

Question: Does this gate authorize EX-1 to create three bounded pilot exam-ingestion overlays after human review, or should EX-0 be revised first?

Human answer: Authorize EX-1 pilot overlays after the gate closes, with no mutation.

Recorded rationale:

- EX-1 may create three bounded pilot overlays: one calculation-heavy, one graph/source-heavy, and one reasoning/answer-model-heavy.
- EX-1 must not mutate `references/external/`, `references/machine/`, authored target exercises, owned blueprint sources, or lesson output.
- EX-1 must not mint units, promote target exercises, close CP-6, close Year 1, or authorize student/product use.

Decision: close GATE-EX0 as `pass_with_conditions` and authorize EX-1 pilot overlays under the recorded conditions.

## Pattern Analysis

The answer pattern is consistent:

- EX-0 is accepted as a contract for a bounded EX-1 pilot.
- EX-1 is allowed to create non-mutating `references/data/` pilot overlay records only after gate closure.
- Prompt, source material, official correction model, point rules, decomposition, MTU classification, and lesson handoff must remain separately traceable.
- Graph/source-heavy pilot items must not hide missing graph, table, or source values.
- `pass_with_gaps` is acceptable only when named gaps remain visible downstream and block affected use.
- No protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output is authorized.

Targeted follow-ups are required only as gate conditions and EX-1/L-EX0 requirements.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-EX0 as `pass_with_conditions`.
- Authorize EX-1 to create the three bounded pilot exam-ingestion overlays under `references/data/`.
- Keep all protected mutation and student/product-use boundaries blocked.

## Explicit Human Confirmation

Human confirmation: record GATE-EX0 as `pass_with_conditions` and authorize EX-1 as a bounded non-mutating pilot after gate closure.

Confirmed on: 2026-05-21.

Confirmed next route: EX-1 may start with the recorded conditions.

## Conditions Carried Forward

1. Graph/source reconstruction condition: a graph/source-heavy pilot item may not be marked `reviewed_ready_for_mapping` unless graph/table/source values needed by the official question are reconstructable, or a blocking `graph_object_gap` or `source_annex_gap` is carried.
2. Pilot-overlay validator condition: EX-1 must add a separate validator for real pilot overlay records.
3. Lesson-handoff trace condition: L-EX0 should add explicit paragraph-plan fields for "assumed prior knowledge with MTU evidence" and "deliberately out of scope with reason."
4. No hidden gaps condition: `pass_with_gaps` is acceptable only when named gaps remain visible downstream and block affected use.
5. EX-1 remains non-mutating: no protected reference mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, or student/product use is authorized.

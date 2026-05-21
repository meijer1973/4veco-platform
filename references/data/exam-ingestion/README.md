# Exam Ingestion Overlay Contracts

This folder defines the protected-source-safe contract for future official CvTE exam-question ingestion overlays.

EX-0 creates the contract only. It does not create real pilot overlay records.

## Authority Boundary

Official exam prompts, source annexes, figures, tables, graphs, uitwerkbijlagen, and official correction models remain external authority. Do not hand-edit `references/external/`.

Exam-ingestion overlays are governed `references/data/` records. They may add reviewed metadata and gap classifications around an external source, but they do not mutate the external source, mint MTUs, promote target exercises, finalize placeholders, close CP-6, close Year 1, or authorize student-facing/product use.

## Future File Family

EX-1 may create pilot files only after the EX-0 contract is reviewed:

```text
references/data/exam-ingestion/
  exam-item-overlays.json
  exam-answer-model-overlays.json
  exam-source-annex-overlays.json
```

Those files are deliberately not created by EX-0.

## Required Separation

A fully ingestible exam question must keep these surfaces separately traceable:

- prompt metadata and prompt text;
- source material references;
- source tables;
- source figures;
- source graphs;
- uitwerkbijlagen;
- official correction-model source reference;
- answer steps;
- point rules;
- mandatory terms;
- accepted alternatives;
- partial-credit rules;
- calculation precision and rounding expectations;
- unit requirements;
- graph requirements;
- content concepts;
- calculation operations;
- graph operations;
- source-reading operations;
- reasoning operations;
- answer-writing operations;
- MTU gap classifications;
- lesson-build handoff requirements.

Do not collapse prompt, source annex, and correction-model evidence into a single prose note. A reviewer must be able to reconstruct what the official question asks, which source values or figures are needed, and what the official correction model rewards.

## Gap Semantics

Every missing extraction must be explicit:

- `source_annex_gap` when tables, figures, graph values, source text, or uitwerkbijlagen are missing or incomplete;
- `answer_model_gap` when official correction-model steps or point rules are missing or incomplete;
- `graph_object_gap` when a graph is referenced but not reconstructable;
- `precision_gap` when rounding, units, tolerance, or decimal expectations are unclear;
- `unit_requirement_gap` when a required MTU or operation cannot yet be mapped.

Gaps block the affected downstream use. They are not automatic mutation requests.

## MTU And Operation Rules

Exam questions and official correction models are strong evidence for required learner operations, but EX-0 and EX-1 do not mint units.

Classify each requirement as one of:

- existing MTU;
- existing MTU but procedure too weak;
- missing MTU;
- merge/split candidate;
- operation-registry need;
- PV/graph need;
- answer-skill need;
- source-annex gap;
- answer-model extraction gap;
- defer.

Any later unit, operation, or answer-skill mutation requires an explicit human-reviewed gate and governed CLI path.

## Product Boundary

All exam-ingestion overlays must keep these blocked:

- student diagnostics;
- adaptive routing;
- mastery decisions;
- automatic sequencing;
- student-facing AI;
- summative use;
- PV projection;
- PV machine promotion;
- student-facing output.

The overlays are internal reference and lesson-design evidence only.

# R5.3 Evidence Review

Reviewer role: evidence quality
Date: 2026-04-27

## Well-Supported Edges

- `D06 -> A15`: strongest curriculum edge; backed by external exam evidence.
- `H14 -> I14`: strong; combines machine-registry procedure evidence with external exam evidence.
- `A15 -> A38`: strong enough for the draft graph; target-exercise evidence plus machine-registry procedure support.
- `A16 -> A15` and `A17 -> A15`: supported by target-exercise evidence and prior human gate authorization, but not separate exam proof per edge.
- `D16 -> L10`: reasonably supported, but mixed; target evidence supports the transfer, while exam evidence supports D16 exam-facing status rather than the exact prerequisite relation.
- `term:prijselasticiteit-van-de-vraag -> registry:begrippen`: valid as a platform registry/definition edge, not external curriculum proof.
- `derived_from` edges: good traceability edges, but not pedagogical approval.

## Weaker Or Generated-Evidence Edges

- `D04 -> decision:retire-merge-or-redistribute`: keep as review/hold only until a real unit-design closure.
- `I04 -> L19` and `I10 -> L19`: medium strength; mostly target-exercise grouping.
- `L09 -> L05`: plausible and earlier accepted, but target-evidence only.
- `source:exam-questions.json -> issue:required-skill-and-exam-code-gap-queue`: diagnostic only; generated-report based.
- `policy:evidence-layer -> policy:source-ranking`: governance metadata, not curriculum evidence.

## Suggested Human Review Questions

- Which pending main edges may become `human_approved`, and which must remain pending or diagnostic?
- Are target-exercise-only edges strong enough for retrieval use, or do they need external exam anchors first?
- Should `A16/A17 -> A15` remain the direct route, or should a later shared elasticity-foundation unit replace it?
- Should `D04` appear in the graph at all, or only in a blocked design backlog until the lifecycle decision closes?
- Should generated-report edges be exposed only as diagnostics, never as retrieval/ranking evidence?

No files were edited by the reviewer.

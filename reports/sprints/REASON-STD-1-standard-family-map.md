# Sprint REASON-STD-1: Standard Family Map

Generated: 2026-06-02

## Scope

This map records how the current reasoning-game modes relate to shared
task-shell families. It is platform-runtime migration evidence only. It does
not authorize generated lesson output, reasoning CSV edits, target-equivalent
claims, diagnostics, mastery, sequencing, Scale Gate 1, or product use.

## Mode Mapping

| Mode | Current student action | Candidate standard family | Runtime representation in this sprint | Disposition |
|---|---|---|---|---|
| 0 `Stappen ordenen` | Choose relevant reasoning steps and put them in order. | `step_ordering` | Emits a validated shared `step_ordering` task with `{ order }` response. | wrap now |
| 1 `Deelvragen opbouwen` | Build the reasoning route by ordering the necessary subquestions. | `claim_reason_evidence` | Uses the shared `step_ordering` response shape while preserving the claim/reason/evidence semantic label. | wrap now |
| 2 `Vind de fout` | Identify the faulty reasoning step. | `error_detection` | No shared task-shell task is emitted yet. Later work may use `two_tier_choice`, `choice`, or a new error-detection family after content review. | defer mapping |
| 3 `Stroomdiagram bouwen` | Build an economic causal or procedural chain from blocks. | `flow_diagram_build` / `cause_effect_chain` | Emits a validated shared ordered-chain `step_ordering` task as the first standard bridge. | wrap now with visual-flow follow-up |
| 4 `Structuren matchen` | Match problems that share a reasoning structure. | `classification_with_explanation` | No shared task-shell task is emitted yet because the current `matching_pairs` standard needs reviewed one-to-one banks and explanation handling before adoption. | refactor before adoption |
| 5 `Redeneerantwoord opbouwen` | Write a short reasoning answer and compare with criteria. | `structured_reasoning` | Already emits a shared `structured_reasoning` task; it remains self-check-only and not scored proof. | already wrapped self-check |

## Source-Based Explanation Pattern

`source_based_explanation` is recorded as a future composed pattern, not a
runtime family emitted by the current reasoning game. Later adoption should
combine:

- `source_value_selection` for choosing the relevant source/table value;
- `source_chain_builder` for source value -> operation -> conclusion;
- `structured_short_response` or `structured_reasoning` for the written answer.

This is especially relevant for A81 source-use scaffolding and for future
graph/table reasoning tasks. It must not be hidden inside a generic text
self-check.

## Proof Summary

`engines/reasoning-engine.js` now exposes `getStandardFamilyMap()` and standard
task builders for the modes that can be represented safely today. Focused tests
and `build-scripts/sprints/check-reason-std1.js` instantiate the engine from
`source-data/book-1/reasoning/1.1.1.csv`, validate the emitted tasks through
`engines/task-shell-engine.js`, and evaluate representative correct responses.
`build-scripts/sprints/generate-reason-std1-proof.js` generates the rendered
fixture and proof JSON from actual engine-emitted `taskShellTask` objects, and
the checker recomputes those artifacts to catch fixture/proof drift.

Modes 2 and 4 are intentionally not forced into weak shared-shell tasks. They
remain explicit follow-up work so the sprint does not overclaim unification.

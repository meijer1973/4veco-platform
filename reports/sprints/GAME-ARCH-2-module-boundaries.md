# Sprint GAME-ARCH-2: Module Boundaries

Generated: 2026-05-31

## Boundary Rule

The shared route layer and shared task shell are the operational spine. Domain
modules may supply data, domain visuals, and domain-specific feedback helpers.
They should not own a parallel route grammar, task-family UI, generic feedback
system, or product-boundary language.

## Module Boundary Table

| Module | Owns | Consumes | Must not own | Follow-up route |
|---|---|---|---|---|
| Shared route layer | route request/view, student-facing route labels, local-only boundary copy, route panel rendering | skill catalog, route config, local practice progress | target-equivalent proof, diagnostics, automatic sequencing, domain task rendering | Keep/harden |
| Shared task shell | task data validation, common task rendering, generic response shape, local feedback result, focus plan, blocked text checks | domain task payloads | domain-specific graph drawing, answer-model scoring, target-proof status | Keep/core |
| Graph/table module | graph/table payloads, graph rendering, axis convention, interpolation, point placement, graph-specific explanation helpers | route API, task shell | generic input UI, standalone progress/proof language | Keep/refactor as reference |
| Math/calculation module | formulas, substitutions, common calculation errors, notation/unit expectations | route API, task shell | generic task controls, route recommendation logic, proof/completion language | Refactor |
| Reasoning module | causal chains, selected-chain comparison, answer-form scaffolds, repair cues | route API, task shell | generic short-response UI, proof/completion language, persistent mastery inference | Refactor |
| Advisory short-check module | small local evidence, route advice, practice recommendation | route API, task shell | target-equivalent proof, grade, diagnostic labels, sequencing decisions | Keep separate |
| Target-equivalent checkpoint composition | complete reviewed target-operation chain, same-level task sequence, answer-form composition | route API, task shell, future answer-form/operation-chain layer | short-check simplification, unreviewed completion language | Hold for `L1.7B-Q2` |
| Procedure support | step-order practice and support route | route API where scoped | primary calculation-route ownership without review | Keep support |
| Landing integration | surface discovery and route entry | route API, product specs | hard-coded proof or route-completion claims | Wrap later |
| CSS/focus/feedback components | visual consistency, focus affordances, responsive layout | shared route/task shell semantics | separate inaccessible feedback regions | Refactor into shared conventions |
| Per-paragraph data builders | task payload data and route configuration | route API, task shell schemas | duplicated UI logic or unvalidated product claims | Wrap/standardize |

## Checkpoint Composition Boundary

Checkpoint composition should have two distinct products:

| Product | Composition basis | Completion language |
|---|---|---|
| Advisory short check | Small local sample of route skills | Advice only; no proof |
| Target-equivalent exit ticket | Complete reviewed target-exercise operation chain at same level | Only after `GATE-L1.7B-Q2` |

The same task shell may render both, but the metadata and claims are different.

## Domain Exception Rule

Domain-specific UI may remain only when the action is genuinely domain-specific:

- graph geometry and visual graph rendering;
- formula walkthrough display;
- reasoning-chain comparison display;
- procedure pipeline visualization.

If the UI is merely an input, check button, retry message, self-check criteria,
feedback card, next action, or route progress display, the default owner is
the shared route layer or shared task shell.

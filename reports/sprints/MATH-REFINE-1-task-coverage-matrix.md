# Sprint MATH-REFINE-1: Task-Coverage Matrix

Generated: 2026-05-31

## Purpose

Compare the `1.1.2` target-operation chain with current math route evidence.

This matrix is planning/preparation evidence only. It does not implement
route changes and does not authorize target-equivalent completion language.

## Status Legend

| Status | Meaning |
|---|---|
| covered | Current local practice evidence covers the operation as a practice task. |
| partial | Current local practice covers related mechanics but not the target-specific chain. |
| missing | No current route evidence was found for the required operation. |
| blocked | Current state blocks target-equivalent reliance until repaired and reviewed. |

## Coverage Matrix

| Target operation | Required unit / answer form | Current evidence | Coverage status | Required hardening before proof use |
|---|---|---|---|---|
| Subquestion `a`: calculate EUR 800 to EUR 920 percentage change | `A38`, calculation answer form | MATH-UX-2 A38 practice uses shared task-shell families for numeric input, work capture, final answer, and notation | partial | Add or validate same-level task that checks old/new identification, formula, substitution, `120 / 800 * 100`, final `15%`, and context conclusion |
| Subquestion `b`: calculate price index EUR 162 / EUR 150 * 100 | `A39`, calculation answer form | MATH-UX-2 A39 practice calculates index values with work capture and notation | partial | Add or validate same-level task that checks base-year price, target-year price, formula, `162 / 150 * 100`, final `108`, and base-year interpretation |
| Subquestion `c`: calculate percent change from index 108 to 112 | `A39` plus `A38` on index values | A39 generator includes index-to-index inflation practice; task-shell route can capture work and final answer | partial | Ensure target chain carries or supplies old index 108 and new index 112, requires `4 / 108 * 100`, and accepts about `3.7%`, not `4%` |
| Subquestion `d`: explain why 108 to 112 is not 4 percent | `D31`, short explanation or constructed response, calculation answer form | `D31` exists in MTU catalog, but current generated route scopes `A38` and `A39` only. A39 pitfall text mentions confusion, but no explicit short explanation task is routed. | blocked | Add explicit D31 coverage tied to target subquestion `d`: state 4 index points, not 4 percent; show `(112 - 108) / 108 * 100`; conclude about `3.7%` |
| Calculation/work capture | shared task shell, future `ANS_BEREKEN` mapping when allowed | MATH-UX-2 validates `calculation_work_capture` for A38/A39 | covered for local practice | Future proof task must retain visible formula, substitution, intermediate step, final answer, notation, and short conclusion |
| Percentage/index notation | shared task shell | MATH-UX-2 validates `unit_notation_field` and final-answer notation behavior | covered for local practice | Future hardening must check percent sign, index number without percent sign, and rounded percentage where appropriate |
| Short explanation of a calculation misconception | `short_constructed_response` or `structured_reasoning` | Reasoning task shell supports structured reasoning elsewhere; current math route does not explicitly check D31 explanation | missing | Add shared calculation-plus-short-explanation task or coordinate a math route wrapper with reasoning scaffolding |
| Local advice-only feedback | shared task-shell feedback model | Current practice gives local retry/self-check feedback and no target-equivalent claims | covered for local practice | Keep local feedback neutral; no diagnostics, mastery, sequencing, or proof language |
| Target-equivalent exit-ticket proof | future checkpoint composition | No published `1.1.2` exit-ticket page/source exists; checkpoint fixture keeps `targetReadinessEvidence: false` | blocked | Held for `L1.7B-Q2` and `GATE-L1.7B-Q2` after route hardening evidence exists |

## Current Route Scope Gap

Current generated `1.1.2` route evidence scopes:

```text
activeSkills: A38, A39
calculation targetSkills: A38, A39
reasoning targetSkills: A38, A39
```

The target exercise requires:

```text
A38, A39, D31
```

This is the central target-operation gap. Target-equivalent use remains
blocked until D31 is explicitly routed and checked, especially for target
subquestion `d`.

## Student-Facing Quality Risk

If the future route treats A39 pitfall text as enough D31 proof, students may
still pass calculation practice while making the exact target error:

```text
108 naar 112 is 4 punten, dus 4%.
```

The future route must require the student to distinguish index points from
percentages in their own answer, not just see the pitfall named.

## Boundary

This matrix supports future implementation planning only. It does not mutate
the current math route, generated output, target exercises, MTUs, or
exit-ticket source data.

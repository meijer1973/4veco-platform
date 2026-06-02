# Sprint REASON-STD-1: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/REASON-STD-1-plan.md`

## Current State

The reasoning game currently exposes six modes:

| Mode | Student action | Current implementation | Shared-standard state |
|---|---|---|---|
| 0 `Stappen ordenen` | select and order three correct reasoning steps from distractors | local reasoning UI and array-of-label answer | maps cleanly to `step_ordering` |
| 1 `Deelvragen opbouwen` | select the subquestions that build the reasoning route | local reasoning UI and array-of-text answer | maps to `claim_reason_evidence` using `step_ordering` response shape |
| 2 `Vind de fout` | identify the faulty reasoning step | local click-to-answer UI | useful pattern, but no first-class error-detection family yet |
| 3 `Stroomdiagram bouwen` | build a causal or procedural flow from blocks | local visual chain UI | maps to `cause_effect_chain` / `flow_diagram_build` through ordered-chain task proof; richer visual-flow standard remains follow-up |
| 4 `Structuren matchen` | match problems that share solution structure | local pair-matching UI | conceptually maps to `classification_with_explanation`; current shared `matching_pairs` requires stricter one-to-one banks and reviewed distractors |
| 5 `Redeneerantwoord opbouwen` | write a short reasoning answer and compare with self-check | shared `structured_reasoning` task shell | already integrated, self-check-only |

## Prior Evidence

- `STANDARD-EXERCISES-1` routed reasoning standard expansion to this sprint.
- `TASK-SHELL-UX-2` confirmed the current reasoning task-shell mode works but
  does not make reasoning fully unified.
- `TASK-FAMILY-ORDER-1`, `TASK-FAMILY-SENTENCE-1`,
  `TASK-FAMILY-MATCH-1`, `TASK-FAMILY-TWO-TIER-1`,
  `TASK-FAMILY-ASSERTION-1`, and `TASK-FAMILY-SOURCE-1` implemented the
  shared families that may later support reasoning routes.
- `GATE-TASK-FAMILY-1` accepted those families only as planning input for
  later bounded adoption-preparation, not product-route use.

## Data integrity notes

No generated Book 1 output is changed at baseline. No reasoning CSV source
data is changed. No exit-ticket source data is created. No target-equivalent
completion language, diagnostics, mastery, sequencing, Scale Gate 1, or product
use is authorized by this sprint. Protected reference data remains unchanged:
`references/machine/` and `references/external/` are read-only for this sprint.

## Baseline Risk

The main risk is overstating the migration. `step_ordering` can represent
mode 0 and mode 1 well, and an ordered-chain task can represent the operation
behind mode 3. But mode 2 and mode 4 should not be forced into weak or leaking
families just to claim everything is unified. Those modes need explicit
follow-up disposition if the current shared families do not fit cleanly.

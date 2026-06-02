# Sprint GATE-TASK-FAMILY-1: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/GATE-TASK-FAMILY-1-plan.md`

## Roadmap baseline

Both roadmaps list `GATE-TASK-FAMILY-1` as open and required before the new
structured choice or construction task families are relied on by
`REASON-STD-1`, `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, or Scale Gate 1.

The closed implementation sprints carry the same boundary: runtime support and
fixture proof exist, but generated-route screenshots and product-route
adoption remain later work.

## Evidence baseline

Closed contract and implementation evidence exists for these families:

| Family | Evidence source | Current status |
|---|---|---|
| `cloze_text` | `TASK-FAMILY-CLOZE-1` | runtime PASS WITH FLAGS |
| `multi_select` | `TASK-FAMILY-MULTI-1` | runtime PASS WITH FLAGS |
| `matching_pairs` | `TASK-FAMILY-MATCH-1` | runtime PASS WITH FLAGS |
| `step_ordering` | `TASK-FAMILY-ORDER-1` | runtime PASS WITH FLAGS |
| `two_tier_choice` | `TASK-FAMILY-TWO-TIER-1` | runtime PASS WITH FLAGS |
| `assertion_reason` | `TASK-FAMILY-ASSERTION-1` | runtime PASS WITH FLAGS |
| `cloze_tile_select` | `TASK-FAMILY-CLOZE-TILE-1` | runtime PASS WITH FLAGS |
| `sentence_builder` | `TASK-FAMILY-SENTENCE-1` | runtime PASS WITH FLAGS |
| `formula_builder` | `TASK-FAMILY-FORMULA-1` | runtime PASS WITH FLAGS |
| `source_value_selection` | `TASK-FAMILY-SOURCE-1` | runtime PASS WITH FLAGS |
| `source_chain_builder` | `TASK-FAMILY-SOURCE-1` | runtime PASS WITH FLAGS |
| `label_placement` | `TASK-FAMILY-LABEL-1` | runtime PASS WITH FLAGS |

## Data integrity notes

Protected reference data is not in scope. `references/machine/` and
`references/external/` must remain unchanged.

Source exercise data, generated lesson output, target-exercise records,
candidate storage, and engine implementation are not authorized in this
packet-prep sprint.

The old exit-ticket prototype archive remains tracked as historical reference
only: `knowledge/exit-ticket-game-1.1.1.zip`. It must not be changed by this
gate preparation.

## Stop conditions

Stop if a required task-family fixture or proof JSON is missing, if screenshot
capture fails, if lead review does not pass, if a packet option authorizes
product-route adoption or target-equivalent reliance, or if any generated
lesson output/source data/protected reference path changes.

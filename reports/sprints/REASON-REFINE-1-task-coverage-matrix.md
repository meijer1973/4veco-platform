# Sprint REASON-REFINE-1: Task-Coverage Matrix

Generated: 2026-05-31

## Purpose

Compare current reasoning route evidence with answer-form and target-operation
requirements for Book 1 `1.1.1`, `1.1.2`, and `1.1.3`.

This matrix is planning/preparation evidence only. It does not implement
route changes and does not authorize target-equivalent completion language.

## Status Legend

| Status | Meaning |
|---|---|
| covered | Current local practice evidence covers the operation as practice. |
| partial | Current local practice covers related mechanics but not the answer-form-specific or target-specific chain. |
| missing | No current route evidence was found for the required operation. |
| blocked | Current state blocks target-equivalent reliance until repaired and reviewed. |

## Coverage Matrix

| Target or answer-form operation | Required unit / answer form | Current evidence | Coverage status | Required hardening before proof use |
|---|---|---|---|---|
| Generic written reasoning response | `structured_reasoning` task family | REASON-UX-2 mode 5 renders a written response with cause/intermediate/conclusion self-check criteria | covered for local practice | Keep as shared interaction family, but feed it answer-form-specific criteria |
| `1.1.1` scarcity/opportunity-cost causal chain | content units plus explanation answer form | Current reasoning data contains scarcity and opportunity-cost chains with steps, subquestions, error repair, and flow blocks | partial | Map final target answer to A98 if it is a direction-choice explanation, or hold if it is true evaluation |
| `1.1.1` compare whether choice is better | `A98` candidate; possible held `ANS_ANALYSEER_BEOORDEEL` risk | Current route has comparison-like opportunity-cost examples, but no explicit answer-form lane | blocked for proof use | Reviewer must decide whether the target can be handled as `leg-uit-of` or needs held evaluation; no generic reasoning shortcut |
| `1.1.2` explain index-point trap | `A97` plus `D31`; coordinate with `A96` | Current reasoning data includes index-point style practice; MATH-REFINE-1 found D31 not explicitly routed in the math target chain | blocked for proof use | Add explicit D31 answer-form task: claim wrong, 4 index points not 4 percent, calculation about 3.7 percent |
| `1.1.2` calculation-plus-explanation | `A96` plus `A97`/`A98` | Math route covers A38/A39 practice; reasoning route can self-check explanation generically | partial | Future route must coordinate math calculation output with reasoning explanation without duplicating state or creating a separate feedback system |
| `1.1.3` source/table claim explanation | `A81` plus `A96` and `A97`/`A98` | Current reasoning and graph practice include source/table reasoning; GRAPH-REFINE-1 found graph-axis blocker | blocked for proof use | Repair graph target-chain issue first, then require source observation, calculation or table evidence, and explanation chain |
| Concise identification inside a source answer | `A80` | Current graph/reasoning practice may ask students to identify values or intervals, but not through answer-form metadata | partial | Use A80 only for requested identification, not as replacement for explanation |
| Source-use modifier | `A81` | Current source/table practice exists, but no explicit A81 modifier criteria | missing | Future tasks must require source label/period/unit/direction, economic meaning, and underlying answer form |
| `leg-uit-dat` scaffold | `A97` | Current generic criteria can support causal chains but does not know the conclusion is given | partial | Add A97-specific criteria and example feedback |
| `leg-uit-of` scaffold | `A98` | Current generic criteria can support a chain after a choice but does not require the first-sentence direction or no-both-sides check | partial | Add A98-specific criteria and example feedback |
| `leg uit met voorbeeld` scaffold | `A99` | No first-priority Book 1 target mapping found for example-answer form | missing | Keep as planned lane; implement only when a target or reviewed practice task needs it |
| Analysis/evaluation answer form | held `ANS_ANALYSEER_BEOORDEEL` | Some prompts may look evaluative, especially "is this better?" comparisons | blocked | Keep held unless later evidence and gate approve analysis/evaluation criteria |
| Type 4 motiveer/classificatie | held `ANS_MOTIVEER_CLASSIFICATIE` | No current Book 1 target mapping requires live Type 4 reasoning route | blocked | Keep held; do not hide classification inside generic reasoning |
| EX correction-model-specific overlays | no-write EX overlay route | q3/q15 overlay needs remain visible from MTU-H4/H4A/H4B/H4C evidence | blocked for writes | No `answer-skill-candidates.json`; future EX storage needs exact gate |
| Generator-blocked answer-form MTUs | `A80`, `A81`, `A96`-`A99` | Readiness report marks all six as generator-blocked/non-interactive | blocked for skill-tree exposure | Future checker must prove no student-facing skill-tree exposure until unblocked |
| Local advice/self-check feedback | shared task-shell feedback model | Current REASON-UX-2 feedback is neutral and self-check-only for mode 5 | covered for local practice | Keep no diagnostics, mastery, sequencing, target-equivalent, or summative claims |
| Target-equivalent exit-ticket proof | future checkpoint composition | No current paragraph has a target-equivalent exit ticket; `1.1.1` has only advisory/local check | blocked | Held for `L1.7B-Q2` and `GATE-L1.7B-Q2` after route hardening evidence exists |

## Central Gap: Generic Self-Check Is Not Answer-Form Proof

Current mode 5 checks whether the student has written something that can be
compared against:

```text
cause -> intermediate step -> conclusion
```

That is a good local reasoning practice pattern. It is not enough for
answer-form proof because:

- `A97` needs the conclusion to remain fixed as the endpoint;
- `A98` needs a direction or yes/no choice before explanation;
- `A81` needs source observation plus underlying answer form;
- `A96` needs visible calculation structure and should coordinate with math;
- held evaluation/classification lanes cannot be treated as normal A97/A98.

## Paragraph-Level Risk Summary

| Paragraph | Current reasoning strength | Main blocker before stronger use |
|---|---|---|
| `1.1.1` | Strong local scarcity/opportunity-cost practice and misconception repair | Final compare/explain answer-form decision: A98 or held evaluation must be reviewed. |
| `1.1.2` | Useful index/percentage reasoning examples | D31 target explanation and calculation-plus-explanation chain remain blocked until routed and checked. |
| `1.1.3` | Useful graph/table/source reasoning examples | Source-use answer-form and graph-axis target-chain blocker must be repaired before proof reliance. |

## Boundary

This matrix supports future implementation planning only. It does not mutate
the current reasoning route, generated output, target exercises, MTUs, source
CSV data, or exit-ticket source data.

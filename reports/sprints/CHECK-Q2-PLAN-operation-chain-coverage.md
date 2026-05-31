# Sprint CHECK-Q2-PLAN: Operation-Chain Coverage

Generated: 2026-05-31

## Purpose

Record what a future target-equivalent exit ticket would need to cover for the
first Book 1 paragraph types.

This is planning/preparation evidence. It does not implement exit tickets or
authorize target-equivalent claims.

## Summary

No current paragraph has enough reviewed evidence for immediate
target-equivalent exit-ticket proof.

The current routes are useful practice routes. They are not yet the separate
proof tasks required by the product specification.

## Coverage Matrix

| Paragraph | Target operation | Required answer form or task family | Current evidence | Status before Q2 implementation |
|---|---|---|---|---|
| `1.1.1` | Calculate wheat revenue from 10 ha times EUR 500 | `A96` calculation form plus underlying `A43`; numeric/work/final answer | Current short check has only choice tasks for B01/B02 | missing for proof |
| `1.1.1` | Identify opportunity costs from the non-chosen corn alternative | concise identification plus calculation/context | Current check samples opportunity-cost idea in a simple choice item | partial |
| `1.1.1` | Calculate mixed 6 ha wheat and 4 ha corn profit | `A96` calculation form; work capture | Not present in current check | missing |
| `1.1.1` | Compare whether the neighbour made a better choice | `A98` if direction-choice explanation, or held `ANS_ANALYSEER_BEOORDEEL` if true evaluation | REASON-REFINE-1 flags A98 versus held-evaluation decision | blocked |
| `1.1.1` | Explain choice using scarcity | `A98` or held evaluation with scarcity concept | Reasoning route has local scarcity practice | partial and blocked for proof |
| `1.1.2` | Calculate percentage change from EUR 800 to EUR 920 | `A96` plus A38; calculation/work/final answer/percent notation | Math route has A38 local practice | partial |
| `1.1.2` | Calculate 2025 price index from EUR 162 / EUR 150 times 100 | `A96` plus A39; final index notation | Math route has A39 local practice | partial |
| `1.1.2` | Calculate percent change from index 108 to 112 | `A96` plus A38/A39; distinguish old/new index values | A39 practice can support mechanics | partial |
| `1.1.2` | Explain why 108 to 112 is 4 index points, not 4 percent, and calculate about 3.7 percent | D31 plus `A97`/`A98`; short constructed response plus calculation | D31 exists but is not explicitly routed and checked | blocked |
| `1.1.3` | Draw or construct P-Q graph from table | graph construction substitute or future drawing; price vertical, quantity horizontal | Current graph practice has contradictory price-horizontal/x wording | blocked |
| `1.1.3` | Read/interpolate quantity at EUR 1.75 | graph reading with tolerance; expected around 350 ice creams | Current interpolation is related but not target-specific | partial |
| `1.1.3` | Identify 50 percent sales drop from EUR 2.50 to EUR 3.00 using 200 and 100 | table value selection plus calculation recognition | Current percentage drop task uses a different interval | partial |
| `1.1.3` | Explain newspaper claim using table evidence | `A81` source-use modifier plus `A96` or `A97`/`A98` underlying answer form | Source practice exists, but no explicit A81 modifier criteria | blocked |

## Paragraph Readiness For L1.7B-Q2

| Paragraph | Direct Q2 implementation readiness | Reason |
|---|---:|---|
| `1.1.1` | no | The current short check omits the full `A43` calculation chain and needs an A98 versus held-evaluation decision for the compare/explain part. |
| `1.1.2` | no | D31 must be explicitly routed and checked; A39 pitfall copy is not enough. |
| `1.1.3` | no | Target graph axis convention is currently contradicted; source-use and short explanation need A81 plus underlying answer form. |

`L1.7B-Q2` should not start direct implementation against a chosen paragraph
until that paragraph's preflight blockers are resolved or explicitly scoped
inside the implementation sprint with reviewed repair evidence.

## Graph Target Specifics To Preserve

Any future `1.1.3` target-equivalent plan must preserve these exact checks:

- price on the vertical axis;
- quantity on the horizontal axis;
- table points interpreted as `(Q, P)`;
- interpolation at EUR 1.75 gives about 350 ice creams;
- the 50 percent drop is from EUR 2.50 to EUR 3.00 because sales go from 200
  to 100;
- source/table evidence is combined with calculation or explanation, not
  treated as a complete answer by itself.

## Answer-Form Boundaries

Future target-equivalent tasks may use:

- `A96` for calculation answer construction;
- `A97` for given-conclusion explanation;
- `A98` for direction-choice explanation;
- `A80` for concise identification when the target operation asks only for
  identifying a value, interval, or item;
- `A81` only as source-use modifier plus an underlying answer form.

Still held:

- graph/draw/shade MTU lane as live reusable answer-form unit;
- Type 4 motiveer/classificatie;
- `ANS_ANALYSEER_BEOORDEEL`;
- EX correction-model-specific overlay writes.

`A80`, `A81`, and `A96`-`A99` are generator-blocked/non-interactive and may
guide planning only until a later gate unblocks them.

## Required Future Evidence

Before a paragraph may support target-equivalent completion language, later
work must show:

1. complete target-operation chain coverage;
2. matching answer forms and task-shell families;
3. answer model or criteria for each task;
4. live rendered output in desktop, mobile or narrow, light, dark, and feedback
   states;
5. no internal MTU IDs or forbidden product claims;
6. lead review before human gate;
7. `GATE-L1.7B-Q2` explicit approval.

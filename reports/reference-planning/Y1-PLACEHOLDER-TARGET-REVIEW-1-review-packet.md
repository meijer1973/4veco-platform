# Y1-PLACEHOLDER-TARGET-REVIEW-1 Review Packet

Status: REV-STD-1 placeholder target-exercise review packet ready; not a closure record

## Verdict

Verdict: REVIEW PACKET READY / PLACEHOLDER FINALIZATION BLOCKED

This packet is ready for human/lead review under REV-STD-1. It does not
replace the placeholder records for `1.1.4`, `1.2.4`, or `1.3.4`, and it does
not close Year 1, CP-6, target-exercise promotion, or any protected mutation
lane.

`PASS WITH FLAGS` is not used here because the core placeholder-finalization
requirement is still missing: each count-bearing gemengde-opgaven record needs
a reviewed integration target exercise, an answer-form and operation-chain
review, and a later governed registry replacement before it can become
reviewed-final evidence.

## Required Citations

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- End-state requirement used here: every paragraph is built backward from a
  paragraph target exercise; target-equivalent proof must cover the target
  operation chain at the same cognitive level with matching answer forms.

Original sprint spec:

- `reports/sprints/Y1-PLACEHOLDER-TARGET-REVIEW-1-plan.md`

Additional evidence:

- `reports/sprints/REV-STD-1-flag-disposition.md`
- `reports/reference-planning/Y1-FOUNDATION-REVIEW-1-review-packet.md`
- `reports/sprints/Y1-FOUNDATION-REVIEW-1-result.md`
- `references/owned/course-blueprint-v5.md`
- `references/owned/course-blueprint-v6-three-year.md`
- `references/authored/course-target-exercises.json`
- `reports/reference-planning/REF-CT1-year1-coverage.md`
- `reports/reference-planning/CP.6b-target-exercise-review.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Non-Negotiable Requirements

1. Product end-state and original sprint spec must be cited.
2. Findings must be classified.
3. Missing core requirements cannot be carried under `PASS WITH FLAGS`.
4. Every carried issue must state blocks, does_not_block, and proof_required_to_close.
5. v5 remains the active detailed Year 1 baseline.
6. v6 is umbrella planning context and does not replace v5 Year 1 detail without explicit migration.
7. Placeholder records cannot be counted as reviewed-final target exercises.
8. CP.6b draft designs are review input only, not final registry evidence.
9. Existing live MTU mappings from CP.6c must be preserved where they apply.
10. The 1.3.3 simultaneous-shift candidate remains a bounded missing-unit design issue until human review decides otherwise.
11. No protected mutation, target-exercise promotion, placeholder finalization, or generated lesson output is authorized.
12. No Scale Gate, diagnostics, adaptive routing, mastery, PV, summative, or student-facing product authority is authorized from this packet.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Cite product end-state | met | Required citations above | Packet may proceed to review. |
| Cite original sprint/gate spec | met | `Y1-PLACEHOLDER-TARGET-REVIEW-1-plan.md` | Packet has an explicit scope contract. |
| Name non-negotiables | met | Non-negotiable list above | Review cannot weaken boundaries silently. |
| Include core-requirement checklist | met | This section | REV-STD-1 structure satisfied. |
| Classify findings | met | Finding classification table below | Carried issues are typed. |
| Include blocks / does_not_block / proof_required_to_close | met | Quality log and finding table | No carried issue is unbounded. |
| No missing core requirement under PASS WITH FLAGS | met | Verdict is not PASS WITH FLAGS | REV-STD-1 rule preserved. |
| Preserve v5 Year 1 authority | met | v5 and v6 authority boundary | v6 does not replace Year 1 detail. |
| Separate draft designs from final target exercises | met | CP.6b draft status and this packet boundary | Placeholder finalization remains blocked. |
| Preserve protected-reference boundary | met | Explicit non-authorization | No protected data changed. |

## Evidence Summary

REF-CT1 and the active target-exercise registry record three Book 1
count-bearing gemengde-opgaven paragraphs that introduce no new theory and are
still `placeholder_needs_review`:

- `1.1.4` Gemengde opgaven: economisch denken en rekenen.
- `1.2.4` Gemengde opgaven: vraag.
- `1.3.4` Gemengde opgaven: aanbod en marktevenwicht.

The active registry placeholder rule says placeholders are valid during source
migration but cannot be treated as final reviewed target exercises. CP.6b
drafted three integration designs, but CP.6b also explicitly kept them as
`draft_integration_design_ready_for_later_teacher_review_not_final`.

## Placeholder Review Targets

| Paragraph | Current registry status | Draft integration source | Must integrate | Review decision needed |
|---|---|---|---|---|
| 1.1.4 | `placeholder_needs_review` | CP.6b draft lunch-box design | scarcity/opportunity cost; percentage and index reasoning; P-Q table/graph reading; data-claim evaluation | Whether the CP.6b draft, revised if needed, is a valid integration target without adding new theory. |
| 1.2.4 | `placeholder_needs_review` | CP.6b draft smoothie-demand design | individual demand and willingness to pay; movement versus shift; substitute/normal-good reasoning; collective-demand aggregation | Whether the aggregate-demand task is solvable and target-equivalent for Chapter 1.2 consolidation. |
| 1.3.4 | `placeholder_needs_review` | CP.6b draft notebook-market design | supply shifts; equilibrium calculation; surplus/shortage; new-equilibrium comparison after shifts | Whether the design may carry simultaneous-shift reasoning while the 1.3.3 missing-unit candidate remains unresolved. |

## Candidate Target-Exercise Replacements For Review

These candidates are proposed replacements only. They are not registry edits,
not reviewed-final evidence, and not authorization to change
`references/authored/course-target-exercises.json`. Each candidate is written
so a human/lead reviewer can accept, revise, or reject it in a later governed
replacement lane.

### Candidate 1.1.4 - Lunch-Box Fundraiser

Target context:

A school fundraiser sells healthy lunch boxes. At different prices the expected
quantity sold is:

| Price | Quantity |
|---:|---:|
| EUR 4 | 180 |
| EUR 5 | 150 |
| EUR 6 | 120 |
| EUR 7 | 90 |

The student council has one stand and must choose one price, so choosing one
option means giving up the next-best alternative.

Subquestions:

- a. Draw the price-quantity table as a graph with price on the vertical axis
  and quantity on the horizontal axis.
- b. Read or interpolate from your graph: about how many lunch boxes would be
  sold at EUR 5.50?
- c. Use EUR 4 as index 100. Calculate the quantity index at EUR 6 and the
  percentage change in quantity sold from EUR 4 to EUR 6.
- d. The council chooses EUR 6. Explain the opportunity cost of not choosing
  EUR 5, using the table.
- e. A poster claims: "A EUR 2 price increase halves sales." Use the table and
  your calculations to decide whether that claim is correct.

Required prior skills:

- 1.1.1: scarcity and opportunity-cost reasoning (`A43`, `B01`, `B02`).
- 1.1.2: percentage-change and index-number calculation (`A38`, `A39`, `D31`).
- 1.1.3: P-Q table reading, graph drawing, interpolation, and data-claim
  evaluation (`A45`, `A46` per CP.6c mapping disposition).

Target operation chain:

1. Convert table values into a correctly oriented P-Q graph.
2. Interpolate linearly between the EUR 5 and EUR 6 table points.
3. Calculate a quantity index and percentage change from a base value.
4. Identify the next-best alternative forgone as opportunity cost.
5. Test a public claim against source data.

Answer-form expectations:

- Graph with `P` on the vertical axis, `Q` on the horizontal axis, ordered
  table points, and a readable scale.
- Numeric answers with the correct base value and one clear calculation line.
- Short written explanations that name opportunity cost and refer to the table.

Short answer model:

- a. Points should be plotted as `(Q,P)`: `(180,4)`, `(150,5)`, `(120,6)`,
  `(90,7)`, with a downward-sloping line through the points.
- b. About 135 lunch boxes.
- c. Quantity index at EUR 6 with EUR 4 as base: `120 / 180 * 100 = 66.7`.
  Percentage change: `(120 - 180) / 180 * 100 = -33.3%`.
- d. The next-best EUR 5 option would sell 150 boxes. Choosing EUR 6 means
  giving up 30 expected boxes sold compared with EUR 5. Do not introduce
  revenue or profit theory here.
- e. The claim is not correct for the listed EUR 2 price increases. EUR 4 to
  EUR 6 falls from 180 to 120, which is one-third lower, not half. EUR 5 to
  EUR 7 falls from 150 to 90, also not half.

Evidence path:

- v5 source: `references/owned/course-blueprint-v5.md` §1.1.4.
- Active placeholder: `references/authored/course-target-exercises.json`
  `1.1.4`.
- Draft source: `reports/reference-planning/CP.6b-target-exercise-review.md`.
- Coverage blocker: `reports/reference-planning/REF-CT1-year1-coverage.md`.
- MTU disposition: CP.6c maps P-Q graph/table flags to existing `A45` and
  `A46`, while 1.1.3 graph/table closure remains visible.

No-new-theory rationale:

The task combines scarcity, opportunity cost, percentages, index numbers, table
reading, graph drawing, interpolation, and claim checking. It deliberately does
not ask for revenue, profit, elasticity, consumer surplus, or market-equilibrium
reasoning.

Human/lead review disposition:

`proposed_replacement_needs_review`. The candidate can be accepted only after
graph/table evidence and answer-form quality are reviewed; acceptance would
still require a later governed authored-registry replacement PR.

### Candidate 1.2.4 - School Smoothie Demand

Target context:

Three students buy smoothies at school. Their quantities demanded per week are:

| Price | Ana | Bo | Cem |
|---:|---:|---:|---:|
| EUR 2 | 3 | 2 | 4 |
| EUR 3 | 2 | 1 | 3 |
| EUR 4 | 1 | 0 | 2 |

Subquestions:

- a. Calculate collective demand at each listed price by adding quantities at
  the same price.
- b. Draw the collective demand curve and explain why you add quantities rather
  than prices.
- c. The smoothie price rises from EUR 3 to EUR 4. Is this a movement along the
  demand curve or a shift? Explain.
- d. A nearby juice bar lowers its price. Is that likely to shift demand for
  school smoothies left or right? Explain with substitute reasoning.
- e. Students receive more pocket money and smoothies are treated as a normal
  good. Show and explain the demand effect.

Required prior skills:

- 1.2.1: individual demand and willingness to pay (`A44`, `D35`, `D36`,
  `D37`).
- 1.2.2: movement versus shift, substitutes, and normal-good reasoning (`A42`,
  `D27`, `D32`, `D33`).
- 1.2.3: collective demand by horizontal aggregation (`A47`, `A48` per CP.6c
  mapping disposition).

Target operation chain:

1. Sum individual quantities demanded at each common price.
2. Draw the collective demand curve from the aggregated table.
3. Classify own-price change as movement along the curve.
4. Classify a substitute-price change as a demand shift.
5. Classify higher income for a normal good as a rightward demand shift.

Answer-form expectations:

- Aggregation table with totals at each price.
- Demand graph using price on the vertical axis and quantity on the horizontal
  axis.
- Written explanations that explicitly use "movement along" or "shift" and
  state the cause.

Short answer model:

- a. Collective demand is 9 at EUR 2, 6 at EUR 3, and 3 at EUR 4.
- b. Plot `(Q,P)` as `(9,2)`, `(6,3)`, `(3,4)`. Add quantities because
  collective demand asks how many units all buyers want at the same market
  price.
- c. Movement along the demand curve: only the smoothie price changes, and
  quantity demanded falls from 6 to 3.
- d. Demand shifts left. Juice and smoothies are treated as substitutes; a
  cheaper substitute makes some buyers switch away from smoothies.
- e. Demand shifts right because smoothies are treated as a normal good and
  higher pocket money increases demand at each price.

Evidence path:

- v5 source: `references/owned/course-blueprint-v5.md` §1.2.4.
- Active placeholder: `references/authored/course-target-exercises.json`
  `1.2.4`.
- Draft source: `reports/reference-planning/CP.6b-target-exercise-review.md`.
- Coverage blocker: `reports/reference-planning/REF-CT1-year1-coverage.md`.
- MTU disposition: CP.6c maps collective-demand table and algebraic aggregation
  to existing `A47` and `A48`; the 1.2.3 kink issue remains a defer candidate
  and is not required to accept this table-only candidate.

No-new-theory rationale:

The task consolidates individual demand, demand factors, movement/shift
classification, substitutes, normal-good reasoning, and collective demand. It
does not introduce elasticity, consumer surplus, or market equilibrium.

Human/lead review disposition:

`proposed_replacement_needs_review`. The candidate can be accepted if the
reviewer confirms the aggregation and shift explanations are target-equivalent
for 1.2 consolidation; acceptance would still require a later governed
authored-registry replacement PR.

### Candidate 1.3.4 - Notebook Market Equilibrium

Target context:

In the market for notebooks, demand is `Qv = -2P + 120` and supply is
`Qa = 3P - 30`. A new printing machine increases supply to `Qa = 3P - 15`.
Later, a school campaign also raises demand to `Qv = -2P + 140`.

Subquestions:

- a. Calculate the original equilibrium price and quantity and mark the point
  in a graph.
- b. At `P = EUR 35`, determine whether there is a surplus or shortage and
  calculate its size.
- c. Calculate the new equilibrium after only the supply increase. Explain the
  direction of the supply shift.
- d. Calculate the equilibrium when both the supply increase and the demand
  increase happen.
- e. Explain which direction quantity changes in the simultaneous-shift case,
  and why the price direction cannot always be predicted without the numbers.

Required prior skills:

- 1.3.1: supply curve and supply-shift reasoning (`D13`, `D32`, `D33`, plus
  `A49` per CP.6c mapping disposition).
- 1.3.2: equilibrium calculation, graphing, and surplus/shortage reasoning
  (`A02`, `A04`, `A06`, `A51` per CP.6c mapping disposition).
- 1.3.3: new-equilibrium comparison after demand or supply shifts (`A42`,
  `D13`).

Target operation chain:

1. Set `Qv = Qa` and solve for equilibrium `P`.
2. Substitute `P` into either equation to find equilibrium `Q`.
3. Compare `Qv` and `Qa` at a non-equilibrium price.
4. Recalculate equilibrium after a supply shift.
5. Recalculate equilibrium after simultaneous supply and demand shifts, then
   explain what is determinate and what depends on relative shift size.

Answer-form expectations:

- Algebraic equations with enough working to check the equilibrium.
- Graph with correctly labelled demand, supply, and equilibrium points.
- Surplus/shortage answer that identifies which quantity is larger.
- Written explanation separating the numeric result from the general
  simultaneous-shift reasoning.

Short answer model:

- a. `-2P + 120 = 3P - 30`, so `150 = 5P`, `P = 30`; `Q = 60`.
- b. At `P = 35`, `Qv = 50` and `Qa = 75`; there is a surplus
  (`aanbodoverschot`) of 25 notebooks.
- c. `-2P + 120 = 3P - 15`, so `135 = 5P`, `P = 27`; `Q = 66`. Supply shifts
  right because producers supply more at each price.
- d. `-2P + 140 = 3P - 15`, so `155 = 5P`, `P = 31`; `Q = 78`.
- e. In this numeric case quantity rises from 60 to 78. In general, a rightward
  supply shift pushes price down while a rightward demand shift pushes price
  up, so the price direction depends on the relative size of the shifts.

Evidence path:

- v5 source: `references/owned/course-blueprint-v5.md` §1.3.4.
- Active placeholder: `references/authored/course-target-exercises.json`
  `1.3.4`.
- Draft source: `reports/reference-planning/CP.6b-target-exercise-review.md`.
- Coverage blocker: `reports/reference-planning/REF-CT1-year1-coverage.md`.
- MTU disposition: CP.6c maps supply-curve and surplus/shortage flags to
  existing `A49` and `A51`, but keeps simultaneous demand+supply shift
  reasoning as the one true missing-unit candidate.

No-new-theory rationale:

The task consolidates supply shifts, equilibrium calculation, graphing,
surplus/shortage, and new-equilibrium comparison from 1.3.1-1.3.3. It does not
introduce costs, revenue, marginal analysis, welfare, taxes, subsidies, or
price controls.

Human/lead review disposition:

`proposed_replacement_conditionally_blocked`. The candidate is useful for
review, but final acceptance must either approve the simultaneous-shift
reasoning path explicitly or revise subquestions d-e to avoid relying on the
unresolved 1.3.3 true missing-unit candidate. Acceptance would still require a
later governed authored-registry replacement PR.

## Review Questions

1. For each placeholder, does the proposed integration target stay inside the
   preceding chapter theory paragraphs and introduce no new theory?
2. Does each proposed target exercise name a complete operation chain, answer
   form, evidence path, and review gate before any registry replacement?
3. Does `1.1.4` need A45/A46 graph-table mappings in the review evidence, and
   does the pending 1.1.3 graph/table closure block final reliance?
4. Does `1.2.4` require A47/A48 aggregation mappings and a bounded decision on
   the 1.2.3 kink/piecewise-demand defer candidate?
5. Does `1.3.4` require A49/A51 graph and surplus/shortage mappings, and how
   should the true missing simultaneous-shift candidate be handled before final
   registry replacement?
6. Is any protected mutation authorized now? This packet recommendation is no.

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| Y1P-001 | scale_blocker | `1.1.4` remains a placeholder target-exercise record. | 1.1.4 reviewed-final claim; placeholder finalization; Year 1 closure; CP-6/Scale Gate reliance on closed Chapter 1.1 consolidation | Publishing this review packet; using CP.6b as draft review input | Human/lead-approved integration target with target operation chain, answer form, evidence path, graph/table mapping disposition, and later governed registry replacement. |
| Y1P-002 | scale_blocker | `1.2.4` remains a placeholder target-exercise record. | 1.2.4 reviewed-final claim; placeholder finalization; Year 1 closure; CP-6/Scale Gate reliance on closed Chapter 1.2 consolidation | Publishing this review packet; using CP.6b as draft review input | Human/lead-approved integration target with collective-demand operations, movement/shift reasoning, answer form, evidence path, aggregation/kink disposition, and later governed registry replacement. |
| Y1P-003 | scale_blocker | `1.3.4` remains a placeholder target-exercise record and depends on unresolved 1.3.3 simultaneous-shift design evidence. | 1.3.4 reviewed-final claim; placeholder finalization; Year 1 closure; CP-6/Scale Gate reliance on closed Chapter 1.3 consolidation; mutation using simultaneous-shift reasoning as covered | Publishing this review packet; preparing a bounded missing-unit review | Human/lead-approved integration target plus explicit simultaneous-shift decision, surplus/shortage and graph mapping disposition, answer form, evidence path, and later governed registry replacement. |
| Y1P-004 | minor_carry_flag | CP.6b draft designs exist but are not REV-STD-1 closure artifacts and not teacher-reviewed final evidence. | Treating CP.6b drafts as reviewed-final target exercises | Using CP.6b designs as inputs for human/lead review | Reviewed disposition accepting, revising, or rejecting each design, with proof recorded before any authored registry edit. |
| Y1P-005 | core_requirement_met | v5, REF-CT1, and the active registry consistently mark placeholders as non-final. | Nothing now | Placeholder review planning and future governed mutation planning | Preserve visible placeholder status until a later approved registry replacement. |
| Y1P-006 | core_requirement_met | This packet uses no `PASS WITH FLAGS` verdict and carries no missing core requirement as non-blocking. | Nothing now | Review packet publication | Keep finalization blocked until required proof exists. |
| Y1P-007 | quality_improvement_available | The packet now includes concrete candidate replacements with target context, subquestions, required prior skills, operation chain, answer-form expectations, short answer model, evidence path, no-new-theory rationale, and review disposition. | Nothing now; these are not final approvals | Human/lead review of concrete proposals; later governed registry-replacement planning | Reviewer accepts, revises, or rejects each candidate and records disposition before any authored registry edit. |
| Y1P-008 | scale_blocker | Candidate `1.3.4` includes simultaneous-shift reasoning that CP.6c still classifies as a true missing-unit candidate. | Final acceptance of `1.3.4` as reviewed-final if simultaneous-shift reasoning remains unresolved; Year 1 closure | Reviewing the candidate; revising the candidate to remove unresolved simultaneous-shift reliance; preparing bounded missing-unit design review | Human/lead decision either approving the simultaneous-shift reasoning path with governed MTU follow-up or revising the target exercise so final acceptance does not rely on the unresolved missing unit. |

## Recommended Next Operations

1. Send this packet for human/lead review under REV-STD-1.
2. Record a decision for each concrete candidate design: accept as review-ready,
   revise, or reject. Treat CP.6b as the source draft, not the final decision.
3. If accepted or revised, prepare a later governed registry-replacement plan
   for the three placeholder records.
4. Keep 1.1.3 graph/table closure, 1.2.3 kink disposition, and 1.3.3
   simultaneous-shift design status visible in any finalization lane.
5. Do not mutate `references/authored/course-target-exercises.json` from this
   packet alone.

## Explicit Non-Authorization

This packet does not authorize:

- editing `references/machine/*`;
- editing `references/external/*`;
- editing `references/authored/course-target-exercises.json`;
- editing `references/owned/course-blueprint-v5.md`;
- generated lesson output;
- target-exercise promotion;
- placeholder replacement or finalization;
- Year 1 closure;
- CP-6 closure;
- Year 2/3 paragraph production;
- diagnostics, adaptive routing, mastery decisions, automatic sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, Scale
  Gate authority, or student-facing product use.

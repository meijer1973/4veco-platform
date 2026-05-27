# Solo q1-q3 MTU Operation Map

Generated: 2026-05-27

Status: MTU-H1 seed benchmark, non-mutating evidence only.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No candidate-storage creation authorized. No lesson-output mutation
authorized. No student/product use authorized.

## Purpose

This map turns the supplied 2026 VWO economie Solo q1-q3 analysis into a
canonical MTU-hardening seed case. It is deliberately broader than a patch for
three questions: it shows where the current MTU graph mixes content concepts,
calculation procedures, answer forms, and misconception handling.

The anchor is the correction-model operation, not syllabus prose and not the
nearest broad concept label.

## Mapping Rules

- Record the exact operation a student must perform.
- Separate content MTUs from calculation, graph, source, and reasoning
  operations.
- Record answer forms such as `berekenen`, `leg uit`, and
  `leg uit met voorbeeld` as teachable requirements.
- Record misconception targets when the answer model is likely to catch a
  common wrong move.
- Record over-trigger flags when a broad MTU would force unnecessary machinery.
- Do not write to `references/machine/` from this sprint.

## Q1: Verbal External Costs

Question focus: explain that diesel creates maatschappelijke kosten and give an
example.

Correction-model operations:

| Operation | Required student move | Layer |
|---|---|---|
| `q1-op-1` | Give a context-specific example of social costs caused by diesel use | reasoning operation |
| `q1-op-2` | Explain that the costs are paid by society or non-users and are not included in the user price | reasoning operation |

Current live MTU fit:

| Unit | Fit | Reason |
|---|---|---|
| `F16` MPC-MSC en MPB-MSB onderscheiden | partial / over-formal | Useful for formal externality machinery, but too marginal-curve oriented for a verbal example explanation |

Missing or refactor candidates:

| Candidate | Layer | Core |
|---|---|---|
| `F_NEW_VERBAL_EXTERNAL_COST_RECOGNITION` | content MTU | Identify a cost caused by production or consumption that is not borne by the direct user or producer |
| `F_NEW_EXTERNAL_COST_EXAMPLE_EXPLANATION` | content + reasoning MTU | Give one context-specific example and explain why it is external or social |
| `A_ANSWER_LEG_UIT_WITH_EXAMPLE` | answer-form MTU | Give the requested example, explain why it fits, and connect it to context |

Over-trigger flags:

| Flag | Do not require unless the answer model asks for it |
|---|---|
| `q1-F16-formal-mpc-msc-overtrigger` | Full MPC/MSC apparatus |
| `q1-welfare-loss-externality-overtrigger` | Overproduction or welfare-loss diagram reasoning |

Benchmark verdict: missing verbal external-cost and answer-form coverage.

## Q2: Fixed Costs From Profit

Question focus: calculate unknown fixed costs from known profit, point revenue,
and variable costs.

Correction-model operations:

| Operation | Required student move | Layer |
|---|---|---|
| `q2-op-1` | Solve `58 = -2Q + 100` to get `Q = 21` | calculation operation |
| `q2-op-2` | Calculate `TO = 58 x 21` with the exam scale | calculation operation |
| `q2-op-3` | Calculate `TVK = 16 x 21` from constant variable cost or constant MK | calculation operation |
| `q2-op-4` | Solve `W = TO - (TVK + TCK)` for `TCK = 192,000` | calculation operation |

Current live MTU fit:

| Unit | Fit | Reason |
|---|---|---|
| `A21` Winst = TO - TK | too broad | Names the relation but not the reverse fixed-cost route |
| `D02` Constante kosten en winst | conceptual / wrong route | Focuses on constant costs around break-even and MO=MK, not this calculation chain |

Missing or refactor candidates:

| Candidate | Layer | Core |
|---|---|---|
| `A_NEW_TO_POINT_CALCULATION` | calculation operation MTU | Calculate `TO = P x Q` for one point without full TO-function construction |
| `A_NEW_TVK_CONSTANT_VARIABLE_COST` | calculation operation MTU | Calculate `TVK = v x Q` when variable cost per unit is constant |
| `A_NEW_UNKNOWN_FIXED_COST_FROM_PROFIT` | calculation operation MTU | Solve known profit plus known TO and TVK to unknown TCK |
| `A_NEW_SCALE_FACTOR_UNIT_HANDLING` | calculation reliability MTU | Handle labels such as `x 1,000` in formulas and final answer units |
| `A_ANSWER_BEREKEN_QUESTION` | answer-form MTU | Show formula, substitution, intermediate calculation, unit, and final conclusion |

Over-trigger flags:

| Flag | Do not require unless the answer model asks for it |
|---|---|
| `q2-A21-too-broad-profit-concept` | Treating the profit concept as full operation coverage |
| `q2-TO-function-construction-overtrigger` | Full TO-function construction |
| `q2-break-even-D02-overtrigger` | Break-even or MO=MK constant-cost reasoning |

Benchmark verdict: missing reverse fixed-cost operation chain and scale-factor
handling.

## Q3: GO to MO, Given MK, Price Rise

Question focus: derive marginal revenue from GO, solve against a given changed
MK, calculate the new price, and calculate the percentage price rise.

Correction-model operations:

| Operation | Required student move | Layer |
|---|---|---|
| `q3-op-1` | Recognise GO as the monopolist's price/demand relation and derive TO/MO | calculation operation |
| `q3-op-2` | Solve `MO = MKbio` where `MKbio = 24` is already given | calculation operation |
| `q3-op-3` | Substitute the new `Q` into `GO(Q)` to calculate the new price | calculation operation |
| `q3-op-4` | Calculate percentage price rise with old price as denominator | calculation operation |

Current live MTU fit:

| Unit | Fit | Reason |
|---|---|---|
| `A20` MO = MK oplossen | too broad | Does not distinguish given-MK from derived-MK routes |
| `A38` Procentuele verandering berekenen | partial | Supports percentage change but not the price-change versus pass-through distinction |
| `D07` Heffing doorberekenen in prijs | related / too narrow | Tax-framed incidence support, not a full cost-shock or monopoly pass-through family |

Missing or refactor candidates:

| Candidate | Layer | Core |
|---|---|---|
| `A_NEW_GO_AS_MONOPOLY_PRICE_DEMAND_RELATION` | calculation operation MTU | Recognise GO/P(Q) as the monopoly price relation |
| `A_NEW_MO_WITHOUT_DERIVATIVES` | calculation operation MTU | Determine or use MO through table, graph, or rule before calculus is introduced |
| `A_NEW_MO_WITH_DERIVATIVE` | calculation operation MTU | Derive MO by differentiating TO as a later formal route |
| `A_NEW_MO_EQUALS_GIVEN_MK` | calculation operation MTU | Solve MO against a given constant marginal cost |
| `A_NEW_MO_EQUALS_DERIVED_MK` | split candidate | Solve MO = MK when both functions must be derived first |
| `A_NEW_NEW_MONOPOLY_PRICE_AFTER_Q` | calculation operation MTU | Use Q* in GO/P(Q) to find price |
| `A_NEW_PERCENTAGE_PRICE_CHANGE_AFTER_COST_CHANGE` | calculation operation MTU | Compute price percentage change and distinguish it from incidence share |
| `D07C_COST_SHOCK_PASS_THROUGH` | incidence family MTU | Calculate how much of a per-unit cost increase appears as a higher consumer price |
| `D07D_INCIDENCE_AMOUNT_NOT_FULL_PRICE_CHANGE` | misconception MTU | Explain why a tax, subsidy, or cost amount does not automatically equal the consumer price change |

Over-trigger flags:

| Flag | Do not require unless the answer model asks for it |
|---|---|
| `q3-A20-too-broad-mo-mk` | Hiding the given-MK versus derived-MK distinction |
| `q3-A13-mk-derivation-overtrigger` | MK derivation when MK is already given |
| `q3-calculus-only-mo-route-overtrigger` | Making derivative-based MO the only teaching route |
| `q3-pass-through-vs-price-percentage-confusion` | Treating price percentage rise and incidence share as the same operation |

Benchmark verdict: missing granular MO/MK routes, new-price-after-Q operation,
and incidence/pass-through misconception handling.

## Cross-Question Pattern

| Pattern | Evidence | Later route |
|---|---|---|
| Broad content unit hides exact operation | `A21`, `A20`, `F16` | MTU-H2 canonical micro-case review |
| Standard incidence/pass-through family is under-specified | `D07` only covers tax pass-through directly | MTU-H3 incidence family review |
| Question verbs are not yet teachable answer forms | q1 and q2 require different output forms beyond concept knowledge | MTU-H4 answer-form units |
| Regression checks are missing | Same over-trigger classes can recur in new samples | MTU-H5 mapping validator |
| Student routes need operation chains, not just concepts | Exit tickets and games must target operations and answer forms | MTU-H6 route integration |

## Stop Conditions Preserved

- Do not mutate `references/machine/`.
- Do not mutate `references/external/`.
- Do not mint units from MTU-H1.
- Do not create operation or answer-skill candidate storage.
- Do not write candidate records.
- Do not update lesson output.
- Do not authorize diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, or
  student-facing output.

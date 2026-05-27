# MTU Hardening Failure Taxonomy v1

Generated: 2026-05-27

Status: MTU-H1 seed taxonomy, non-mutating evidence only.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No candidate-storage creation authorized. No lesson-output mutation
authorized. No student/product use authorized.

## Purpose

The Solo q1-q3 sample exposes systemic mapping defects. This taxonomy names
the defect classes so later MTU-hardening work can reduce repeated errors on
fresh exam samples.

The central shift is from "which economics concept is involved" to:

```text
What exact correction-model operation must the student perform,
in what answer form,
with which prior micro-skills,
and which misconception must be neutralised?
```

## Defect Classes

| Defect class | Description | Solo evidence | Later route |
|---|---|---|---|
| `content_unit_too_broad` | A broad concept unit is treated as complete operation coverage | q1 `F16`, q2 `A21`, q3 `A20` | MTU-H2 |
| `operation_unit_missing` | The correction model requires a calculation, reasoning, graph, or source operation that has no clean MTU | q2 unknown fixed costs, q3 MO = given MK | MTU-H2 |
| `answer_form_missing` | Prompt verbs are metadata only and not teachable answer-construction units | q1 leg uit met voorbeeld, q2 berekenen | MTU-H4 |
| `over_trigger_function_construction` | Mapping requires a function-construction route when the answer model only needs a point calculation | q2 `TO = P x Q` | MTU-H2 |
| `over_trigger_derivative_route` | Mapping requires calculus or derivative steps before the intended non-calculus route | q3 MO route | MTU-H2 |
| `over_trigger_derived_mk` | Mapping requires MK derivation when MK is already given | q3 `MKbio = 24` | MTU-H2 |
| `incidence_family_too_narrow` | Tax, subsidy, cost-shock, monopoly pass-through, graphical wedge, and misconception handling are not a full family | q3 price rise versus cost shock; live `D07` tax frame | MTU-H3 |
| `scale_factor_handling_missing` | Exam scale labels such as `x 1,000` are not a stable calculation skill | q2 final TCK amount | MTU-H2 |
| `misconception_tag_missing` | A predictable misconception is not represented as something to teach or check | q1 private/social cost, q3 price change equals cost change | MTU-H2/MTU-H3 |
| `regression_gate_absent` | No checker prevents the same mapping defects from recurring on a fresh sample | all three seed cases | MTU-H5 |

## Answer-Form Targets

These answer forms should become explicit teachable units or a governed
equivalent in a later sprint:

| Answer form | Core procedure |
|---|---|
| `bereken` | Identify requested variable, write relation, substitute values, show intermediate calculation, state final answer with unit and rounding |
| `leg_uit` | State cause, state economic mechanism, state result, use context terms, do not merely name a concept |
| `leg_uit_met_voorbeeld` | Give requested example, explain why it fits the concept, connect it to context |
| `analyseer` | Identify variables and starting situation, trace mechanism across steps, compare old/new or alternatives, conclude in context |
| `arceer_grafisch` | Identify requested change or welfare area, determine boundaries, shade only the required area, label old/new correctly |
| `geef_aan` | Select the requested outcome or option, add only the required explanation if requested, avoid extra alternatives |

## Incidence Family Targets

The D07 family should be reviewed as a high-value market-analysis family:

| Candidate | Core |
|---|---|
| `D07A_TAX_INCIDENCE` | Calculate consumer and producer burden of a per-unit tax |
| `D07B_SUBSIDY_INCIDENCE` | Calculate consumer and producer benefit of a per-unit subsidy |
| `D07C_COST_SHOCK_PASS_THROUGH` | Calculate how much of a per-unit cost increase appears as a higher consumer price |
| `D07D_INCIDENCE_AMOUNT_NOT_FULL_PRICE_CHANGE` | Explain why a tax, subsidy, or cost amount does not automatically equal the consumer price change |
| `D07E_INCIDENCE_GRAPHICAL_WEDGE` | Identify Pc, Pp, P0, Q0, Q1, wedge, consumer share, and producer share graphically |
| `D07F_INCIDENCE_ELASTICITY_EXPLANATION` | Explain why the less elastic side bears more burden or receives a different share of benefit |

## Regression Validator Targets

MTU-H5 should flag:

- missing MTU for an official correction-model operation;
- over-triggered prerequisite not required by the answer model;
- calculus route triggered where non-calculus route is intended;
- function-construction unit triggered when a function is already given or a
  point calculation is enough;
- incidence/pass-through question without incidence MTU;
- question word without answer-form MTU;
- apply/analyze unit without procedure;
- scale-factor usage without unit/scaling MTU;
- misconception-prone question without misconception tag.

## Quality Log

| Issue | Category | Severity | Next action | Proof to close |
|---|---|---:|---|---|
| Verbal external-cost MTU missing | MTU granularity | Medium | Add verbal external-cost and leg-uit-with-example units | Solo q1 maps without over-triggering formal externality machinery |
| A21 too broad for q2 | MTU dependency / operation gap | High | Add unknown fixed-cost-from-profit unit and inversion support | q2 maps to exact calculation chain |
| TO-function over-trigger | MTU over-trigger | Medium | Split pointwise TO calculation from TO-function construction | q2 no longer requires full TO-function construction |
| MO=MK path too derivative-heavy | MTU sequencing | High | Split non-calculus MO route from derivative route | q3 can map to both teaching sequence and formal answer route |
| `MO = given MK` missing | MTU dependency | Medium | Split A20 into given-MK and derived-MK variants | q3 no longer triggers unnecessary MK derivation |
| Incidence/pass-through under-specified | Standard exam skill gap | High | Refactor D07 into tax/subsidy/cost-shock incidence family | Tax/subsidy/pass-through sample maps directly to incidence units |
| Question words not taught as answer forms | Answer-construction gap | High | Add answer-form MTUs and map from `question_type` | Random sample has answer-form coverage |
| Scale factors weakly represented | Calculation reliability | Medium | Add scale-factor/unit MTU | `x 1,000` cases map consistently |
| Regression gate absent | Review-system gap | High | Build MTU mapping benchmark and validator | Fresh random sample meets defect threshold |

## Later Sprint Routing

| Sprint | Route | Authority from MTU-H1 |
|---|---|---|
| MTU-H2 | Fix Solo q1-q3 as canonical micro-cases through reviewed CLI-governed changes | no mutation authority |
| MTU-H3 | Refactor incidence/pass-through as a full skill family | no mutation authority |
| MTU-H4 | Add answer-form units and map them to `question_type` | no mutation authority |
| MTU-H5 | Build MTU mapping regression validator for a fresh sample | no candidate-write authority |
| MTU-H6 | Feed hardened MTUs into exit tickets and skill-tree routes | no product-use authority |

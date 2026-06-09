# MTU-H5 RP-005 Q27 Governed Planning Packet

Generated: 2026-06-09

Status: `q27_planning_packet_ready_for_three_agent_review_no_mutation_authorized`

## Scope

This packet prepares the q27 planning lane for `MTU-H5-RP-005`.

It keeps three q27 issues visible:

- missing incidence/capacity coverage;
- missing per-1,000-liter scaling coverage;
- D07 semantic-fit review, because D07 is now a pass-through percentage unit
  and q27 asks for a levy price/quantity/capacity conclusion.

This packet does not close q27 and does not change mappings.

## Official Evidence

- Question PDF:
  `references/external/exams/vw-1022-a-25-2-o.pdf#page=12&question=27`
- Correction model:
  `references/external/exams/vw-1022-a-25-2-c.pdf#page=13&question=27`
- Question PDF SHA-256:
  `a15a0766c22f2c4c670646159c9f4193324cba1446dcdfa84b6db55aa9ab2410`
- Correction PDF SHA-256:
  `3a932cfd5d33a6130f3bd48d6f1d72ec9663e79534887c8e1d8e4ee14357c3c0`

The correction model requires:

- price after levy: `EUR 2 per 1,000 liter`;
- new equilibrium: `Qv2 = Qa2` at `Q = 14,000`;
- conclusion: demand equals capacity, so overconsumption is countered.

## Current Governance

- The MTU-H5 next-repair gate says `A98` covers answer form, but `D07` is not
  enough to close q27 incidence/pass-through or scaling.
- MTU-H3 narrowed `D07` to tax pass-through percentage / burden-share
  calculation.
- `A88` exists for scale labels such as x 1,000.
- `D08` exists for heffing tegen overconsumptie, but its current procedure
  imports elasticity/A15 reasoning not required by the q27 correction model.

## Semantic Fit

`A98` supports the leg-uit-of answer form only.

`A88` supports per-1,000-liter scale and unit handling.

`D41` and `D05` can support levy graph price/quantity reading and new
equilibrium reasoning.

`D08` is topic-adjacent but weak until reviewed, because it imports elasticity
and percentage demand-reduction reasoning.

`D07` is rejected for q27 closure. It is a percentage pass-through unit; q27 is
not asking for afwentelingspercentage.

## Dry-Run Candidate

The machine packet embeds:

- `EX_OP_Q27_LEVY_CAPACITY_OVERCONSUMPTION_CHECK`

The candidate is a review design only. It uses `D41`, `D05`, and `A88` as
support; treats `D08` as weak; rejects `D07`; and keeps the q27
incidence/capacity, scaling, and D08 semantic-fit gaps visible.

## Negative Guard

The accepted negative guard is the current live H5 q27 surface:

- `q27-step-1:ASSERT-INCIDENCE-MISSING`
- `q27-step-1:ASSERT-SCALING-MISSING`
- `q27-step-2:ASSERT-INCIDENCE-MISSING`
- D07 procedure review for q27 steps 1 and 2
- review hook for per-1,000-liter scale/unit handling

Any future q27 repair must fail or review-block if it hides those gaps or
claims that `D07` alone closes q27.

## Proof To Close Later

- q27 operations cite approved incidence/capacity coverage or a reviewed
  equivalent.
- q27 step 1 cites approved per-1,000-liter scaling coverage or a reviewed
  equivalent.
- D08 semantic fit is accepted, refined, or kept weak with rationale.
- D07 remains rejected as q27 closure support unless a later reviewed route
  explicitly changes the evidence.
- The H5 validator no longer emits q27 incidence/scaling failures only after
  that reviewed coverage is visible.

## Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, operation registry mutation, answer-skill mutation, candidate
storage, candidate writes, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, AI, summative use, product-route readiness claim, or
student/product use is authorized.

Next state: `ready_for_three_agent_review`

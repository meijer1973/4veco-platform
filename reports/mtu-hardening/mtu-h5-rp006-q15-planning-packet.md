# MTU-H5 RP-006 Q15 Governed Planning Packet

Generated: 2026-06-09

Status: `q15_planning_packet_ready_for_three_agent_review_no_mutation_authorized`

## Scope

This packet prepares the q15 planning lane for `MTU-H5-RP-006`.

It keeps three q15 facts visible:

- `D27`, `F03`, and `F09` cover content only;
- `A97` covers the leg-uit-dat answer form and has a canonical procedure;
- `q15-answer-1` remains a separate two-step correction-model answer-skill
  need until reviewed.

It does not close q15, does not change mappings, and does not write candidate
storage.

## Official Evidence

- Question PDF:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=7&question=15`
- Correction model:
  `references/external/exams/vw-1022-a-25-1-c.pdf#page=11&question=15`
- Question PDF SHA-256:
  `1b0f56fa3794e92584979e8407c4b8f61c59285047efe8ad1b25d7294bdd83fc`
- Correction PDF SHA-256:
  `d10773314c943fb2082dd81368f25ac41936855a3125435b52f0406c6f5fd617`

The correction model requires two rewarded links:

- both ice-cream sellers have a dominant strategy to lower or undercut price;
- both firms' revenue or profit falls, so a prisoner dilemma arises.

There is no calculation, graph, scaling, or incidence/pass-through route.

## Current Governance

- EX2 accepts `D27`, `F03`, and `F09` for q15 content coverage only.
- EX2 keeps `q15-answer-1` as an `answer_skill_need`.
- EX5 keeps q15 as an answer-skill candidate with no candidate writes.
- The MTU-H5 next-repair packet says `A97` is present for leg-uit-dat, but
  q15 still needs semantic-fit review.

## Semantic Fit

`D27` supports the perfect-substitute context.

`F03` supports the dominant-strategy concept.

`F09` supports the prisoner-dilemma concept.

`A97` supports the leg-uit-dat causal-chain answer form and procedure.

None of those alone proves that the two score points are taught as one
correction-model-specific answer skill: first dominant price-lowering strategy,
then lower revenue/profit and prisoner-dilemma conclusion.

## Operation Shape

The q15 correction model has two elements:

- `q15-step-1`: explain the dominant strategy to lower or undercut price.
- `q15-step-2`: explain the lower revenue/profit outcome and prisoner-dilemma
  conclusion.

The current live H5 validator should still emit the two q15
`ASSERT-PROCEDURE-REVIEW-A97` hooks and the two q15 answer-skill review hooks.

## Dry-Run Candidate

The machine packet embeds:

- `EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION`

The candidate is review design only. It keeps `D27`, `F03`, and `F09` as
content support, keeps `A97` as answer-form/procedure support, and does not
claim reviewed-equivalent status.

## Negative Guard

The accepted q15 guard is the current live H5 review surface:

- `q15-step-1:ASSERT-PROCEDURE-REVIEW-A97`
- `q15-step-1` review of whether `D27`/`F03` plus `A97` is enough
- `q15-step-2:ASSERT-PROCEDURE-REVIEW-A97`
- `q15-step-2` review of the two-step correction-model explanation

The packet also preserves the global original Solo negative fixture:

- `MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED`

Any future q15 repair must fail or review-block if it hides `q15-answer-1`,
treats `D27`/`F03`/`F09` content coverage as enough for the answer skill, treats
`A97` alone as semantic closure, or introduces a graph, calculus,
function-construction, incidence, or scaling route.

## Proof To Close Later

- Review accepts `EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION` or another
  reviewed equivalent.
- The accepted route keeps `D27`/`F03`/`F09` content support separate from
  answer-form/procedure support.
- `A97` semantic fit is accepted specifically for q15 or kept
  review-required with rationale.
- The H5 validator no longer emits q15 procedure/review hooks only after that
  reviewed coverage is visible.
- Candidate storage remains absent unless a later explicit gate authorizes it.

## Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, operation registry mutation, answer-skill mutation, candidate
storage, candidate writes, source-annex extraction execution, graph-object
extraction execution, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, AI, summative use, product-route readiness claim, or
student/product use is authorized.

Next state: `ready_for_three_agent_review`

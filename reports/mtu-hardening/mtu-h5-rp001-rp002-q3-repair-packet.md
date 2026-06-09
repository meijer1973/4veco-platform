# MTU-H5 RP-001/RP-002 Q3 Governed Repair Packet

Generated: 2026-06-09

Status: `q3_repair_packet_ready_for_three_agent_review_no_mutation_authorized`

## Scope

This packet prepares the q3 repair lane for `MTU-H5-RP-001` and
`MTU-H5-RP-002`. It couples two issues that must be solved together:

- The annual insurance threshold operation is not covered by a live MTU or
  reviewed equivalent.
- `A15` price elasticity is stale/forbidden for q3 and must remain an
  over-trigger guard.

This packet does not close the validator failures. It makes the q3 evidence,
candidate operation shape, answer-skill shape, and proof-to-close conditions
reviewable without writing candidate storage or protected references.

## Official Evidence

- Question PDF:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=2&question=3`
- Correction model:
  `references/external/exams/vw-1022-a-25-1-c.pdf#page=6&question=3`
- Question PDF SHA-256:
  `1b0f56fa3794e92584979e8407c4b8f61c59285047efe8ad1b25d7294bdd83fc`
- Correction PDF SHA-256:
  `d10773314c943fb2082dd81368f25ac41936855a3125435b52f0406c6f5fd617`

The official source gives two insurance variants with monthly premiums and
annual deductibles. The correction model accepts equivalent annual-cost
comparison routes that produce the threshold `EUR 649` per year.

Core calculation trace:

- `12 x 108.25 + 385 = 1684`
- `12 x 86.25 = 1035`
- `1684 - 1035 = 649`

## Existing Governance

- EX2 classified `q3-calc-1` as an operation need, with `A61` support and
  `A15` stale/incorrect.
- EX2 classified `q3-answer-1` as an answer-skill need.
- EX5 preserved q3 `A61` support with `A15` rejected.
- The EX operation/answer-skill contract names
  `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON` and
  `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` as design candidates.
- EX-7 dry-run validators require q3 annual-threshold candidates to include
  `A61` support and reject `A15`.

## Semantic Fit

`A61` supports selecting the correct table values. It does not cover the full
annual-cost threshold operation.

`A96` supports bereken answer-form presentation. It does not decide the
threshold operation or its direction wording by itself.

`A15` is forbidden for q3 because q3 does not ask for price elasticity, demand
elasticity, or a percentage-change price/quantity route.

## Repair Decision

Recommended next review path: accept the embedded dry-run operation and
answer-skill designs as reviewed-equivalent q3 coverage candidates while
keeping candidate storage and protected references unwritten.

Do not remove `A15` from q3 mapping yet. A later mapper/checker repair may do
that only after reviewed annual-threshold coverage is visible and the negative
guard proves `A15` cannot return.

The accepted negative guard for this planning lane is the current live H5
validator over-trigger assertions:

- `vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER`
- `vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER`

## Dry-Run Candidate Specs

The machine packet embeds:

- `dry_run_operation_candidate`:
  `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON`
- `dry_run_answer_skill_candidate`:
  `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION`

The checker validates both through the EX-7 dry-run validation library without
creating `operation-candidates.json` or `answer-skill-candidates.json`.

## Proof To Close Later

- q3 maps without `A15`.
- Annual-threshold operation coverage remains visible through a live MTU or
  reviewed equivalent.
- Threshold conclusion wording preserves unit and direction.
- Negative regression fails if `A15` is reintroduced as q3 support.
- No protected reference, candidate storage, lesson, PV, diagnostics, mastery,
  sequencing, AI, summative, or product/student route is touched.

## Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, operation registry mutation, answer-skill mutation, candidate
storage, candidate writes, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, AI, summative use, product-route readiness claim, or
student/product use is authorized.

Next state: `ready_for_three_agent_review`

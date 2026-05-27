# GATE-MTU-H2 Solo q1-q3 Micro-Case Human Interview

Gate: GATE-MTU-H2-solo-q1-q3-micro-cases
Date: 2026-05-27
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned GATE-MTU-H2 question list in
`reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.md`
before supplying answers.

This record preserves each answer separately and checks for contradictions
before gate closure.

Overall decision: `PASS WITH CONDITIONS - routing only`.

GATE-MTU-H2 may close as a routing review. It may authorize a later bounded
`MTU-H2A` CLI-mutation planning sprint for approved lanes. It does not
authorize mutation execution.

No mutation execution is authorized from this gate.

This review does not authorize protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, operation-registry
mutation, answer-skill mutation, candidate writes, lesson-output mutation,
CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, or student/product use.

## Calibration Answers

Calibration 1: Yes. This gate reviews Solo q1-q3 candidate routing only. It
does not authorize protected reference mutation, machine-reference mutation,
unit minting, candidate writes, lesson output, or student/product use.

Calibration 2: Yes. Candidate lane IDs are review IDs, not live unit IDs. Any
later registry change must use a separately authorized CLI-governed mutation
lane.

No governance pause is required.

## Recorded Answers

### MTUH2-Q1: q1 verbal external-cost content

Human answer: approve both q1 content candidates for later mutation planning;
decide later whether they become one combined unit or two units.

Recorded rationale:

- The correction model separates an example of social costs from the
  explanation of the origin of social costs.
- Both lanes should remain visible for diagnostic precision.
- The later planning sprint should decide whether one unit can cover both
  without losing the distinction.

Decision: route q1 verbal external-cost recognition and explanation with
example to later bounded CLI-mutation planning.

### MTUH2-Q2: q1 answer-form route

Human answer: defer to MTU-H4 while keeping q1's answer-form need visible.

Recorded rationale:

- `Leg uit ... ga in op een voorbeeld` is a general answer-form problem, not
  only a Solo q1 problem.
- The q1 canonical case must retain the visible dependency note.

Decision: defer `Leg-uit-vraag met voorbeeld beantwoorden` to MTU-H4, with
visibility preserved in the H2 canonical cases.

### MTUH2-Q3: q2 calculation-operation chain

Human answer: route all three as distinct calculation-operation candidates.

Recorded rationale:

- Pointwise TO calculation, TVK from constant variable cost, and unknown fixed
  costs from profit are different micro-failures.
- Combining them into one reverse-profit route would reproduce the original
  coarseness problem.
- Later materials can teach them as one worked procedure while the registry
  distinguishes the skills.

Decision: route pointwise TO, TVK from constant variable cost, and unknown
fixed costs from profit to later bounded CLI-mutation planning as distinct
calculation-operation candidates.

### MTUH2-Q4: q2 scale factor and bereken answer form

Human answer: route scale-factor handling as an H2 calculation-reliability
candidate and defer `Bereken-vraag beantwoorden` to MTU-H4.

Recorded rationale:

- Scale factors are directly needed for q2 because the answer moves between
  values shown as `(x 1.000)` and final roepia.
- `Bereken-vraag beantwoorden` is general answer-form work and should be
  standardized in MTU-H4.

Decision: route scale-factor handling to MTU-H2A planning; defer bereken answer
form to MTU-H4 while keeping it visible.

### MTUH2-Q5: q3 MO route split

Human answer: approve this split or supplement route for later mutation
planning.

Recorded rationale:

- The platform must distinguish non-calculus MO, derivative MO, `MO = gegeven
  MK`, and `MO = afgeleide MK`.
- Students often learn the non-calculus version first.
- q3 uses a given MK, so forcing MK derivation would be a false prerequisite.

Decision: route the A20 split/supplement lane to later bounded CLI-mutation
planning.

### MTUH2-Q6: q3 price and percentage-change route

Human answer: route both as H2 candidates, while sending broader
pass-through/incidence family work to MTU-H3.

Recorded rationale:

- `Nieuwe prijs bepalen na Q*` is directly required in q3.
- `Procentuele prijsverandering na kostenverandering` is directly required,
  but it should not be confused with the broader incidence/pass-through family.
- H2 handles the q3 operation; H3 handles the tax/subsidy/cost-shock incidence
  family.

Decision: route new-price-after-Q* and percentage-price-change-after-cost-change
to MTU-H2A planning; route broader D07 incidence/pass-through family work to
MTU-H3.

### MTUH2-Q7: existing-unit guardrails

Human answer: keep these guardrails binding for later planning, with one
wording refinement.

Recorded rationale:

- F16 support only for q1, A21 support only for q2, D02 not primary for q2,
  A20 too broad for q3, A38 partial for q3, and D07 routed to MTU-H3 are
  correct.
- Refinement: phrase `F16 support only for q1` as `F16 may support q1, but q1
  must not require full MPC/MSC machinery`.

Decision: keep the guardrails binding with the F16 wording refinement.

### MTUH2-Q8: next sprint authority

Human answer: authorize only a later bounded CLI-mutation planning sprint for
reviewed H2 lanes; no mutation execution yet.

Recorded rationale:

- The packet does not yet name exact live unit IDs, CLI specs, rollback, audit
  log, and validation evidence.
- Therefore it is not mutation-execution-ready.

Decision: authorize `MTU-H2A` as planning-only. No mutation execution is
authorized.

### MTUH2-Q9: mutation and product authority

Human answer: no. GATE-MTU-H2 may only record reviewed routing and authorize
later bounded planning.

Recorded rationale:

- No protected reference mutation, external-source mutation, machine-reference
  mutation, unit minting, operation-registry mutation, answer-skill mutation,
  candidate writes, lesson-output mutation, CP-6/Year-1 closure, diagnostics,
  adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
  projection, PV machine promotion, or student/product use is authorized.

Decision: no mutation or product authority now.

## Pattern Analysis

The answer pattern is consistent:

- GATE-MTU-H2 closes as routing only.
- q1 content lanes may enter H2A planning; q1 answer-form work goes to MTU-H4
  but stays visible.
- q2 calculation-operation lanes remain distinct; q2 scale-factor handling may
  enter H2A; q2 bereken answer form goes to MTU-H4 but stays visible.
- q3 MO split/supplement lanes may enter H2A planning.
- q3 price-after-Q* and percentage-price-change lanes may enter H2A, while
  broader incidence/pass-through work goes to MTU-H3.
- Existing-unit guardrails remain binding.
- No mutation execution or product use is authorized.

No targeted follow-up is needed before closure because the answer set preserves
the no-mutation boundary and separates H2A, H3, and H4 routes.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-MTU-H2 as `pass_with_conditions`.
- Treat the gate as routing evidence only.
- Authorize MTU-H2A as the next bounded CLI-mutation planning sprint.
- Preserve all mutation-execution and student/product-use blocks.

## Explicit Human Confirmation

Human confirmation: close GATE-MTU-H2 as `PASS WITH CONDITIONS - routing only`.

Confirmed on: 2026-05-27.

Confirmed next route: MTU-H2A CLI-mutation planning may start after
GATE-MTU-H2 is closed and validated.

## Conditions Carried Forward

1. GATE-MTU-H2 is a routing review only.
2. No protected mutation and no product use is authorized.
3. MTU-H2A is planning-only unless a later packet names exact unit IDs,
   schema-valid specs, CLI commands, rollback, audit log, and validation
   evidence.
4. q1 and q2 answer-form needs are deferred to MTU-H4 but remain visible.
5. D07 and broader pass-through/incidence work are routed to MTU-H3, not
   mutated from H2.
6. Guardrails remain binding: no full MPC/MSC requirement for q1, no full
   TO-function requirement for q2, no MK derivation or calculus-only MO route
   for q3.

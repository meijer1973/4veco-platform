# GATE-EX2 Exam-to-MTU Mapping Human Interview

Sprint: EX-2
Gate: GATE-EX2-exam-to-mtu-mapping
Date: 2026-05-22
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned EX2 question list in
`reports/review-gates/GATE-EX2-exam-to-mtu-mapping/review-packet.md` before
supplying answers.

This record preserves each answer separately and checks for contradictions
before gate closure.

Overall decision: `PASS WITH CONDITIONS - routing only`.

EX-2 may close as a classification and routing gate. It may accept reviewed
mapping classifications for the EX-1 pilot items and authorize later bounded
reporting and planning work, especially EX-3 dashboard/reporting and EX-4
mutation planning.

This review does not authorize protected reference mutation, external-source
mutation, unit minting, operation-registry mutation, answer-skill mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

## Recorded Answers

### EX2-Q1: q3 annual cost threshold

Question: For `vw-1022-a-25-1-o:opgave-1:question-3`, EX-1 found an annual
insurance cost-threshold operation. The mirrored source record lists `A15`, but
live `A15` is price elasticity, not annual cost comparison. How should
`q3-calc-1` be classified?

Human answer: classify `q3-calc-1` as `operation_registry_need`.

Recorded rationale:

- The mirrored `A15` mapping is weak or stale because live `A15` is price
  elasticity, not annual cost comparison.
- The official q3 task asks students to use premiums and deductibles to
  determine up to what annual care-cost amount the increased deductible is
  cheaper.
- The correction model rewards a threshold calculation and a cheaper-option
  conclusion.
- `A61` is a better source-reading support unit for selecting relevant
  premium and deductible table values.
- `A61` does not cover the full annual threshold-comparison procedure.

Decision: keep `q3-calc-1` as `operation_registry_need`; add `A61` as support;
mark `A15` as stale or incorrect for this task.

### EX2-Q2: q3 answer wording

Question: For q3, the correction model rewards not only calculation but a
threshold conclusion with unit and direction. How should `q3-answer-1` be
classified?

Human answer: classify `q3-answer-1` as `answer_skill_need`.

Recorded rationale:

- The correction model rewards a threshold conclusion with unit and direction.
- The calculation operation produces the threshold.
- The answer skill teaches students to formulate the rewarded conclusion.

Decision: keep `q3-answer-1` separate from `q3-calc-1` and record it as
`answer_skill_need`.

### EX2-Q3: q19 source and graph reconstruction gaps

Question: For `vw-1022-a-25-1-o:opgave-4:question-19`, EX-1 carries blocking
`q19-source-annex-gap` and `q19-graph-object-gap`. Should these gaps block full
MTU mapping and lesson handoff?

Human answer: keep both gaps blocking.

Recorded rationale:

- The official exam source figure and worksheet are available externally, but
  the repository overlay has not extracted or reconstructed them as usable
  graph/source objects.
- The official correction model depends directly on the graphs.
- Students must draw rightward demand shifts in three market diagrams and give
  wage or price-level conclusions.
- q19 cannot become lesson-handoff-ready until the figure and worksheet
  extraction is resolved or explicitly reviewed as a visible limitation.

Decision: keep `q19-source-annex-gap` and `q19-graph-object-gap` blocking full
reconstruction, accepted MTU mapping, lesson-build handoff, and closure. Allow
only provisional routing notes.

### EX2-Q4: q19 market-shift operation

Question: For q19, students must draw rightward demand shifts in three market
diagrams and state wage/price-level directions. How should `q19-graph-op-1`
and `q19-reason-1` be routed?

Human answer: use mixed provisional routing.

Recorded rationale:

- For `q19-graph-op-1`, classify as `existing_mtu_but_procedure_too_weak` plus
  `pv_graph_need`.
- `A42` and `D10` are stronger candidates than `A45`.
- `A42` covers graphical shifting with before/after curves and labels.
- `D10` covers demand/supply shifts after a conjunctural shock.
- `A45` is only a weak prerequisite because it concerns drawing a P-Q graph
  from table values, not shifting demand curves in supplied multi-market
  diagrams.
- For `q19-reason-1`, classify as `operation_registry_need` with `D10` and
  `D13` as partial supports.
- The complete q19 operation links increased foreign interest in Curacao
  through multiple connected markets and then requires graph shifts plus
  wage/inflation conclusions.

Decision: add `A42` to the q19 candidate set, downgrade `A45` to weak support,
keep `pv_graph_need`, keep `q19-reason-1` as `operation_registry_need`, and
keep q19 blocked until source/graph reconstruction improves.

### EX2-Q5: q15 content MTU mapping

Question: For `vw-1022-a-25-1-o:opgave-3:question-15`, EX-1 maps the
perfect-substitute context to `D27` and the dominant-strategy/prisoner's
dilemma concepts to `F03` and `F09`. Is this content mapping sufficient?

Human answer: yes, classify `D27`, `F03`, and `F09` as existing MTUs for content
coverage.

Recorded rationale:

- `D27` covers the substitute context.
- `F03` covers dominant strategy.
- `F09` covers the prisoner's dilemma concept.
- The official q15 prompt frames the firms as perfect substitutes and asks for
  an explanation of why the outcome is a prisoner's dilemma.

Decision: accept `D27`, `F03`, and `F09` as existing MTUs for content coverage.
This does not mean the answer-model operation is covered.

### EX2-Q6: q15 answer-model operation

Question: For q15, the correction model rewards a two-step explanation:
undercutting as dominant strategy, then lower revenue/profit as
prisoner's-dilemma outcome. How should `q15-answer-1` be classified?

Human answer: classify `q15-answer-1` as `answer_skill_need`.

Recorded rationale:

- The correction model rewards a two-step explanation.
- `F03` and `F09` cover the concepts, but they do not by themselves guarantee
  that a student can produce the rewarded correction-model explanation.
- Later work can decide whether this becomes a separate answer-skill registry
  entry or a strengthened procedure inside `F03` or `F09`.

Decision: keep `q15-answer-1` as `answer_skill_need`.

### EX2-Q7: Lesson-build handoff readiness

Question: After EX-2 classification, which pilot items may be considered ready
for later lesson-design handoff, and which must remain blocked?

Human answer: q3 and q15 may proceed to later L-EX0/L-EX1 coordination with
visible gaps; q19 remains blocked.

Recorded rationale:

- q3 prompt/table and correction threshold are sufficiently understood for
  later lesson-design coordination, but mapping and answer-skill gaps remain
  visible.
- q15 content mapping is sufficient for coordination, but answer-model skill
  remains visible.
- q19 source figure and worksheet are not yet reconstructed in the overlay, so
  graph/PV and lesson handoff remain blocked.

Decision: q3 and q15 may proceed to planning or dry-run coordination only with
visible gaps. q19 remains blocked.

### EX2-Q8: Mutation and next-sprint authority

Question: Does this gate authorize protected reference mutation,
external-source mutation, unit minting, operation-registry mutation,
answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6
closure, Year-1 closure, or student/product use now?

Human answer: no mutation authority.

Recorded rationale:

- EX-2 may record reviewed classifications.
- EX-2 may authorize later bounded work such as EX-3 dashboards or EX-4
  mutation planning.
- Registry or MTU mutation belongs to later governed work.

Decision: no protected mutation, external-source mutation, unit minting,
operation-registry mutation, answer-skill mutation, target-exercise promotion,
lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use is
authorized.

## Pattern Analysis

The answer pattern is consistent:

- EX-2 closes as a routing gate only.
- q3 exposes a stale/weak mirrored mapping and a compound threshold operation.
- q3 should use `A61` as source-reading support while keeping the full threshold
  procedure as `operation_registry_need`.
- q3 answer wording is an `answer_skill_need`.
- q19 remains blocked because source and graph objects are not reconstructable
  from the current overlay.
- q19 should add `A42` as a stronger graph-shift candidate, keep `D10` as
  support, downgrade `A45` to weak support, and keep `pv_graph_need`.
- q15 content maps to existing `D27`, `F03`, and `F09`, but q15 answer structure
  remains an `answer_skill_need`.
- q3 and q15 may proceed to later lesson-design coordination with visible gaps;
  q19 remains blocked.
- No protected mutation, external-source mutation, unit minting,
  operation-registry mutation, answer-skill mutation, target-exercise promotion,
  lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use
  is authorized.

No targeted follow-up is needed before closure because the answer set preserves
the no-mutation boundary and keeps q19 gaps visible.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-EX2 as `pass_with_conditions`.
- Treat the gate as classification and routing evidence only.
- Authorize EX-3 as the next bounded dashboard/reporting sprint.
- Preserve all mutation and student/product-use blocks.

## Explicit Human Confirmation

Human confirmation: close GATE-EX2 as `PASS WITH CONDITIONS - routing only`.

Confirmed on: 2026-05-22.

Confirmed next route: EX-3 dashboard/reporting sprint may start after EX-2 is
closed and validated.

## Conditions Carried Forward

1. Correct q3 support route from stale `A15` to `A61`; keep `q3-calc-1` as
   `operation_registry_need`.
2. Keep `q3-answer-1` as `answer_skill_need`.
3. Add `A42` to the q19 graph-operation candidate set; keep `D10` support and
   downgrade `A45` to weak prerequisite/support.
4. Keep q19 blocked by `q19-source-annex-gap` and `q19-graph-object-gap` until
   source/graph extraction improves or a later human gate explicitly accepts a
   visible limitation.
5. Keep `q15-answer-1` as `answer_skill_need`.
6. Allow q3 and q15 only for later planning/dry-run lesson coordination with
   visible gaps; do not authorize lesson-output mutation.
7. EX-2 authorizes no protected reference mutation, external-source mutation,
   unit minting, operation-registry mutation, answer-skill mutation,
   target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
   closure, diagnostics, adaptive routing, mastery, sequencing,
   student-facing AI, summative use, PV projection, PV machine promotion, or
   student-facing output.

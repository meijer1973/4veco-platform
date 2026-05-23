# GATE-EX4 Mutation Planning Human Interview

Sprint: EX-4
Gate: GATE-EX4-mutation-planning
Date: 2026-05-23
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned EX4 question list in
`reports/review-gates/GATE-EX4-mutation-planning/review-packet.md` before
supplying answers.

This record preserves each answer separately and checks for contradictions
before gate closure.

Overall decision: `PASS WITH CONDITIONS - routing and design only`.

GATE-EX4 may close as a mutation-planning review. It may authorize a later
bounded tooling/design sprint, but it may not authorize protected reference
mutation, external-source mutation, machine-reference mutation, unit minting,
operation-registry mutation, answer-skill mutation, PV/graph mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

## Recorded Answers

### EX4-Q1: q3 annual threshold operation route

Question: For `q3-calc-1`, should the annual cost-threshold comparison become a
later governed operation candidate, given that `A61` only supports table-value
selection and `A15` is stale/incorrect for this task?

Human answer: keep `q3-calc-1` as an operation-registry design candidate.

Recorded rationale:

- `A61` supports table-value selection only.
- `A15` remains rejected or stale for this task.
- The operation is broader than either unit: compare annual cost structures,
  include deductible logic, derive an equal-cost threshold, and connect the
  result to the cheaper option.

Decision: use `q3-calc-1` as a later operation-registry design candidate only;
do not authorize mutation.

### EX4-Q2: q3 threshold answer wording

Question: For `q3-answer-1`, how should the threshold conclusion with unit and
direction be represented before any later mutation?

Human answer: keep `q3-answer-1` as a separate answer-skill candidate.

Recorded rationale:

- The answer model rewards not only the computed threshold but the conclusion
  with unit and direction.
- This answer-construction requirement should remain separate from the
  calculation operation until an answer-skill registry or governed equivalent
  exists.

Decision: keep `q3-answer-1` visible as an answer-skill candidate; do not
authorize mutation.

### EX4-Q3: q19 source and graph blocker

Question: For q19, must source-annex and graph-object extraction be completed
before any graph/PV, reasoning-operation, or lesson-handoff mutation is
planned?

Human answer: q19 source-annex and graph-object extraction must come first.

Recorded rationale:

- q19 remains blocked by `q19-source-annex-gap` and `q19-graph-object-gap`.
- q19 may not proceed to graph/PV mutation, chained-reasoning mutation, lesson
  handoff, PV projection, or student-facing use while those gaps are unresolved.
- Extraction execution should wait until an extraction contract and validator
  exist.

Decision: route q19 source-annex/graph-object extraction first, but only after a
contract and validator exist.

### EX4-Q4: q19 graph/PV route

Question: For `q19-graph-op-1`, should later work strengthen `A42`/`D10`
procedures, define a PV graph route, or hold while q19 source/graph gaps remain
unresolved?

Human answer: hold graph/PV execution.

Recorded rationale:

- `A42` and `D10` remain plausible candidates.
- `A45` remains weak prerequisite/support only.
- q19 is still evidence-blocked, so no PV template or graph/procedure mutation
  should be authorized now.

Decision: carry `A42` and `D10` as candidates, keep `A45` weak, and hold graph/PV
execution until q19 extraction improves.

### EX4-Q5: q19 chained-market reasoning

Question: For `q19-reason-1`, how should the chained multi-market shift
reasoning be routed, given `D10`/`D13` only partially support it and q19 remains
source/graph-blocked?

Human answer: keep `q19-reason-1` as a provisional operation-registry candidate
blocked by q19 source/graph gaps.

Recorded rationale:

- `D10` and `D13` partially support the reasoning.
- They do not cover the full chained multi-market reasoning operation.
- The route should not collapse into D10/D13 procedure strengthening yet.

Decision: keep `q19-reason-1` provisional and blocked until q19 is
reconstructable.

### EX4-Q6: q15 two-step answer skill

Question: For `q15-answer-1`, how should the two-step correction-model
explanation be represented, given `D27`/`F03`/`F09` cover content only?

Human answer: keep `q15-answer-1` as an answer-skill candidate.

Recorded rationale:

- `D27`, `F03`, and `F09` cover content only.
- They do not yet guarantee the correction-model explanation structure:
  dominant-strategy undercutting first, lower revenue/profit as
  prisoner-dilemma outcome second.

Decision: keep `q15-answer-1` visible as an answer-skill candidate; do not
authorize mutation.

### EX4-Q7: registry and CLI architecture

Question: Which governed storage/tooling route should be designed before any
operation or answer-skill mutation executes?

Human answer: design operation/answer-skill storage contracts and validators
first.

Recorded rationale:

- The existing skill-operation registry is a governed data overlay, not a
  promoted machine registry.
- Operation-registry and answer-skill CLIs do not exist yet.
- Use overlay-first storage under `references/data/` unless a future gate
  explicitly promotes a machine-registry route.

Decision: define registry/storage contract, schemas, validators, rollback, and
audit evidence before any candidate write.

### EX4-Q8: later sprint routing

Question: What later bounded sprint should follow GATE-EX4 if the gate closes
with authorization?

Human answer: authorize a bounded tooling/design sprint only.

Recorded rationale:

- The next sprint should define operation-registry storage contract,
  answer-skill storage contract, validators, q19 extraction contract and
  validator, rollback and audit-log requirements, and stop conditions.
- q19 extraction is urgent, but execution should wait until the extraction
  contract and validator exist.

Decision: authorize tooling/design only. No mutation execution.

### EX4-Q9: mutation authority now

Question: Does GATE-EX4 authorize protected reference mutation, external-source
mutation, unit minting, operation-registry mutation, answer-skill mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure,
or student/product use now?

Human answer: no mutation authority now.

Decision: no protected reference mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, PV/graph mutation, target-exercise promotion,
lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use is
authorized.

### EX4-Q10: product boundaries

Question: Must all product-use boundaries remain false while EX-4 is still
mutation-planning evidence?

Human answer: all product boundaries remain false.

Decision: diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, and student-facing
output remain blocked.

## Pattern Analysis

The answer pattern is consistent:

- GATE-EX4 closes as routing and design authority only.
- q3 annual threshold calculation is a valid operation-registry design
  candidate, but no mutation is authorized.
- q3 threshold wording and q15 two-step correction-model explanation remain
  visible answer-skill candidates.
- q19 source-annex and graph-object extraction are blocking prerequisites before
  graph/PV, reasoning, lesson handoff, PV projection, or student-facing use.
- q19 graph/PV routing carries `A42` and `D10` as candidates and `A45` as weak
  support only.
- q19 chained-market reasoning remains provisional and blocked by q19 evidence
  gaps.
- Operation and answer-skill storage, schemas, validators, rollback, and audit
  evidence must be designed before any registry mutation.
- All product boundaries remain false.

No targeted follow-up is needed before closure because the answer set preserves
the no-mutation boundary and keeps q19 gaps plus q3/q15 answer-skill gaps
visible.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-EX4 as `PASS WITH CONDITIONS - routing/design only`.
- Treat the gate as pre-mutation routing and design authority only.
- Authorize `EX-5 Operation And Answer-Skill Registry Contract` as the next
  bounded tooling/design sprint.
- Preserve all mutation, lesson-output, closure, and student/product-use
  blocks.

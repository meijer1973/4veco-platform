# GATE-EX6 Validator And CLI Planning Human Interview

Sprint: EX-6
Gate: GATE-EX6-validator-cli-planning
Date: 2026-05-26
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned EX6 question list in
`reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.md` before
supplying answers.

This record preserves the calibration answers and each binding answer
separately, then checks for contradictions before gate closure.

Overall decision: `PASS WITH CONDITIONS - validator/dry-run CLI implementation only`.

GATE-EX6 may close as a planning review. It may authorize a later bounded
implementation sprint for validators and dry-run CLIs only. It must not
authorize candidate-storage creation, candidate writes, q19 source-annex or
graph-object extraction execution, protected reference mutation,
external-source mutation, machine-reference mutation, unit minting,
operation-registry mutation, answer-skill mutation, PV/graph mutation,
lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use.

## Calibration Answers

### EX6-CAL-1: Planning-only boundary

Question: Confirm that this gate reviews validator/CLI planning only and does
not authorize candidate storage creation, candidate writes, q19 extraction
execution, mutation, lesson output, or student/product use.

Human answer: yes.

Decision: this gate reviews validator/CLI planning only. It does not authorize
candidate storage, candidate writes, q19 extraction execution, mutation, lesson
output, or student/product use.

### EX6-CAL-2: Dry-run implementation boundary

Question: Confirm that any later implementation sprint must remain dry-run and
validator focused unless a later gate explicitly authorizes persistent writes.

Human answer: yes.

Decision: any later implementation sprint must remain validator-focused and
dry-run-only unless a later gate explicitly authorizes persistent writes.

## Recorded Answers

### EX6-Q1: Schema Split

Question: Are the three proposed schemas, operation candidates, answer-skill
candidates, and source-annex extraction overlays, the right split for later
validator and dry-run CLI implementation?

Human answer: yes, use the three-schema split for later implementation.

Recorded decision:

1. `references/schemas/operation-candidates.schema.json`
2. `references/schemas/answer-skill-candidates.schema.json`
3. `references/schemas/source-annex-extraction-overlays.schema.json`

Decision: keep operation design, answer-construction design, and source/graph
reconstruction evidence separated.

Condition: do not collapse operation and answer-skill candidates into a single
generic registry during the next sprint.

### EX6-Q2: Operation-Candidate Schema

Question: Does the operation-candidate schema capture the minimum fields needed
for q3 annual cost-threshold comparison and future operation candidates without
hiding supporting, weak, rejected, or blocking-gap evidence?

Human answer: sufficient for validator implementation, with one required
refinement before real candidate records.

Recorded rationale:

- The operation schema includes the right core fields for dry-run validation.
- `weak_or_rejected_unit_ids` collapses two different statuses.
- q3 `A15` is rejected/stale; q19 `A45` is weak prerequisite support.

Decision: accept the operation-candidate schema for validator implementation.

Condition: before any persistent candidate write, split weak and rejected unit
fields or add typed support-assessment objects that distinguish `weak` from
`rejected`.

### EX6-Q3: Answer-Skill Schema

Question: Does the answer-skill schema keep q3 threshold wording and q15
two-step correction-model explanation visible enough for later answer-skill
validation?

Human answer: yes, the answer-skill schema is sufficient for validator
implementation.

Recorded rationale:

- q3 threshold conclusion with unit and direction remains visible.
- q15 dominant-strategy-first, prisoner-dilemma-outcome-second explanation
  remains visible.
- These answer-construction needs must not be buried inside content coverage.

Decision: accept the answer-skill schema for validator implementation.

### EX6-Q4: q19 Extraction Schema

Question: Does the source-annex extraction schema require enough graph and
worksheet detail, including precise locator, axes, units, scale/ticks,
geometry, legend, and student-action regions, before q19 can become
reconstructable?

Human answer: sufficient for validator implementation, with a required
conditional-validation rule.

Recorded rationale:

- The schema has the right graph/source fields.
- Some required array fields lack explicit `minItems`, so structural presence
  alone is not enough for reconstructable states.

Decision: accept the q19 extraction schema for validator implementation.

Condition: later validators must reject any q19 graph/source extraction marked
reconstructable unless locator, axes, units, scale/ticks, geometry, legend,
worksheet regions, required student marks, and student-action regions are
substantively non-empty.

### EX6-Q5: Validator Rejection Rules

Question: Are the planned validator rejection rules sufficient, including
unauthorized mutation flags, product flags, `A15` as q3 support, `A45` as
primary q19 support, unresolved q19 gaps, and hidden q3/q15 answer-skill needs?

Human answer: yes, implement validators with these rejection rules, plus two
additions.

Recorded additions:

1. Reject reconstructable q19 extraction states with empty required
   source/graph detail fields.
2. Reject ambiguity between weak and rejected unit support unless the record
   makes the distinction explicit.

Decision: accept the validator rejection-rule plan with those two added
conditions.

### EX6-Q6: Dry-Run CLI Contract

Question: Is the dry-run CLI contract sufficient before any future write mode:
closed gate, schema validation, read-only dry-run, mutation log, rollback
route, source evidence, and review refs?

Human answer: yes, use this dry-run CLI contract for later implementation.

Decision: accept the dry-run CLI contract.

Condition: any new `*-add.js` scripts created in the next sprint must be
dry-run-only under EX-6 authority. If future write mode exists in code, it must
hard-fail unless a later gate explicitly authorizes the exact write lane.

### EX6-Q7: Fixture Policy

Question: Should later implementation use non-persistent test-only fixtures
before any real candidate storage path is created?

Human answer: yes, dry-run fixtures must remain non-persistent and test-only.

Decision: dry-run fixtures must remain temporary and test-only.

Condition: do not commit realistic candidate records as fixtures inside
`references/data/exam-ingestion/`.

### EX6-Q8: Next Sprint Routing

Question: If GATE-EX6 closes, what bounded sprint should be authorized next?

Human answer: authorize validator and dry-run CLI implementation only, with no
candidate-storage creation or writes.

Decision: authorize a bounded implementation sprint for validators and dry-run
CLIs only.

Allowed:

- validators for operation candidates, answer-skill candidates, and
  source-annex extraction overlays;
- dry-run CLIs for candidate validation only;
- test-only dry-run fixtures;
- rejection tests for `A15`, `A45`, unresolved q19 gaps, hidden q3/q15
  answer-skill needs, mutation flags, product flags, and q19 reconstructability
  claims.

Not allowed:

- persistent candidate storage;
- candidate writes;
- q19 extraction execution;
- PV/graph mutation;
- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- lesson output;
- student/product use.

### EX6-Q9: Mutation And Product Authority

Question: Does GATE-EX6 authorize protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, operation-registry
mutation, answer-skill mutation, candidate writes, q19 extraction execution,
lesson-output mutation, CP-6/Year-1 closure, or student/product use now?

Human answer: no. GATE-EX6 may only authorize later bounded implementation of
validators and dry-run CLIs.

Decision: no mutation or product authority is granted.

## Pattern Analysis

The answer pattern is consistent:

- GATE-EX6 closes as `PASS WITH CONDITIONS`.
- The next sprint may implement validators and dry-run CLIs only.
- Candidate storage creation, candidate writes, q19 extraction execution,
  protected mutation, external-source mutation, machine-reference mutation,
  unit minting, operation-registry mutation, answer-skill mutation, lesson
  output, CP-6/Year-1 closure, and student/product use remain blocked.
- Operation and answer-skill schemas remain separate.
- Weak versus rejected unit evidence must be distinguished before any
  persistent candidate write.
- q19 remains blocked and reconstructability must require substantive graph and
  worksheet detail.
- `A15` and `A45` guardrails remain hard.
- q3/q15 answer-skill needs remain visible downstream.

No targeted follow-up is needed before closure because the answer set preserves
all stop-condition boundaries and supplies explicit closure wording.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-EX6 as `PASS WITH CONDITIONS - validator/dry-run CLI implementation only`.
- Authorize the next bounded sprint for validators and dry-run CLIs only.
- Preserve all candidate-storage, candidate-write, extraction-execution,
  mutation, lesson-output, closure, and student/product-use blocks.

## Explicit Human Confirmation

The human reviewer supplied a complete GATE-EX6 answer set and closure wording
on 2026-05-26 authorizing closure as `PASS WITH CONDITIONS - validator/dry-run
CLI implementation only`.

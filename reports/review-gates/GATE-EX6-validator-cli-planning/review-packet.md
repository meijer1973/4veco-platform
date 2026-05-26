# GATE-EX6 Validator And CLI Planning Review Packet

Generated: 2026-05-26

Status: review packet ready, no implementation authorized.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No candidate-storage creation authorized. No candidate writes
authorized. No q19 source-annex or graph-object extraction execution
authorized. No PV/graph mutation authorized. No target-exercise promotion
authorized. No lesson-output mutation authorized. No CP-6 or Year-1 closure
authorized. No student/product use authorized.

## Review Scope

The reviewer should decide whether the EX-6 schemas and validator/CLI
implementation plan are adequate to authorize a later bounded implementation
sprint for validators and dry-run CLIs only. The reviewer should not authorize
candidate storage, candidate writes, q19 extraction execution, direct mutation,
lesson output, or student/product use.

Evidence base:

- `references/schemas/operation-candidates.schema.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `references/schemas/source-annex-extraction-overlays.schema.json`
- `references/data/exam-ingestion/validator-cli-implementation-plan.json`
- `references/data/exam-ingestion/validator-cli-implementation-plan.md`
- `build-scripts/references/check-ex6-validator-cli-planning.js`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/reference-team-roadmap.md`

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews validator/CLI planning only and does not authorize
   candidate storage creation, candidate writes, q19 extraction execution,
   mutation, lesson output, or student/product use.
2. Any later implementation sprint must remain dry-run and validator focused
   unless a later gate explicitly authorizes persistent writes.

If either answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### EX6-Q1: Schema Split

Are the three proposed schemas, operation candidates, answer-skill candidates,
and source-annex extraction overlays, the right split for later validator and
dry-run CLI implementation?

Options:
- Yes, use the three-schema split for later implementation.
- Revise the schema split before any implementation sprint.
- Hold until a broader registry architecture review is complete.
- Open answer / other, with rationale.

### EX6-Q2: Operation-Candidate Schema

Does the operation-candidate schema capture the minimum fields needed for q3
annual cost-threshold comparison and future operation candidates without hiding
supporting, weak, rejected, or blocking-gap evidence?

Options:
- Yes, the operation-candidate schema is sufficient for validator implementation.
- Revise the operation fields before implementation.
- Hold until a sample dry-run fixture is drafted.
- Open answer / other, with rationale.

### EX6-Q3: Answer-Skill Schema

Does the answer-skill schema keep q3 threshold wording and q15 two-step
correction-model explanation visible enough for later answer-skill validation?

Options:
- Yes, the answer-skill schema is sufficient for validator implementation.
- Revise the answer-skill fields before implementation.
- Hold until a broader answer-writing policy is complete.
- Open answer / other, with rationale.

### EX6-Q4: q19 Extraction Schema

Does the source-annex extraction schema require enough graph and worksheet
detail, including precise locator, axes, units, scale/ticks, geometry, legend,
and student-action regions, before q19 can become reconstructable?

Options:
- Yes, the q19 extraction schema is sufficient for validator implementation.
- Revise the q19 graph/source fields before implementation.
- Hold q19 until a separate source-extraction architecture sprint.
- Open answer / other, with rationale.

### EX6-Q5: Validator Rejection Rules

Are the planned validator rejection rules sufficient, including unauthorized
mutation flags, product flags, `A15` as q3 support, `A45` as primary q19
support, unresolved q19 gaps, and hidden q3/q15 answer-skill needs?

Options:
- Yes, implement validators with these rejection rules.
- Revise the rejection rules before implementation.
- Hold until EX-5 or EX-4 evidence is rechecked.
- Open answer / other, with rationale.

### EX6-Q6: Dry-Run CLI Contract

Is the dry-run CLI contract sufficient before any future write mode: closed
gate, schema validation, read-only dry-run, mutation log, rollback route,
source evidence, and review refs?

Options:
- Yes, use this dry-run CLI contract for later implementation.
- Revise CLI preconditions before implementation.
- Hold until existing reference CLI patterns are audited in more detail.
- Open answer / other, with rationale.

### EX6-Q7: Fixture Policy

Should later implementation use non-persistent test-only fixtures before any
real candidate storage path is created?

Options:
- Yes, dry-run fixtures must remain non-persistent and test-only.
- Allow persistent fixture files, but not candidate storage.
- Hold fixture policy until implementation starts.
- Open answer / other, with rationale.

### EX6-Q8: Next Sprint Routing

If GATE-EX6 closes, what bounded sprint should be authorized next?

Options:
- Authorize validator and dry-run CLI implementation only, with no candidate
  storage creation or writes.
- Authorize q19 extraction tooling implementation only, with no extraction
  execution.
- Hold all downstream work until schemas or rejection rules are revised.
- Open answer / other, with rationale.

### EX6-Q9: Mutation And Product Authority

Does GATE-EX6 authorize protected reference mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, candidate writes, q19 extraction execution,
lesson-output mutation, CP-6/Year-1 closure, or student/product use now?

Options:
- No, GATE-EX6 may only authorize later bounded implementation of validators
  and dry-run CLIs.
- Yes, but only for explicitly named low-risk planning artifacts.
- Hold; authority cannot be decided until the schemas are revised.
- Open answer / other, with rationale.

## Future Interview Protocol

- Show the full question list before starting.
- Ask calibration questions before taking binding answers.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a closure proposal only after evidence is complete.
- Require explicit human confirmation before writing a gate closure record or
  authorizing downstream sprint scope.

## Current Stop Conditions

- Stop if any answer authorizes candidate-storage creation or candidate writes.
- Stop if any answer authorizes q19 source-annex or graph-object extraction
  execution.
- Stop if any answer authorizes protected reference mutation, external-source
  mutation, machine-reference mutation, unit minting, operation-registry
  mutation, answer-skill mutation, PV/graph mutation, target-exercise
  promotion, lesson-output mutation, CP-6 closure, or Year-1 closure now.
- Stop if any answer treats q19 as reconstructable or lesson-handoff-ready
  while `q19-source-annex-gap` or `q19-graph-object-gap` remains unresolved.
- Stop if any answer hides q3 or q15 answer-skill needs downstream.
- Stop if any answer reuses `A15` as q3 annual threshold support or treats
  `A45` as primary q19 graph-shift support.
- Stop if any answer authorizes diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student/product use.

## Recommended Next Action

Run the formal GATE-EX6 human review before any later validator implementation,
dry-run CLI implementation, candidate storage creation, candidate writes, q19
extraction execution, lesson handoff, PV projection, or student/product use.

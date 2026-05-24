# GATE-EX5 Operation And Answer-Skill Contract Review Packet

Generated: 2026-05-24

Status: review packet ready, no mutation authorized.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No q19 source-annex or graph-object extraction execution
authorized. No PV/graph mutation authorized. No target-exercise promotion
authorized. No lesson-output mutation authorized. No CP-6 or Year-1 closure
authorized. No student/product use authorized.

## Review Scope

The reviewer should decide whether the EX-5 operation/answer-skill/q19
extraction contract is adequate for later bounded tooling or extraction-planning
work. The reviewer should not authorize mutation directly.

Evidence base:

- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/operation-answer-skill-contract.schema.json`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/review-gates/GATE-EX4-mutation-planning/gate-closure.json`
- `reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.json`
- `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.json`
- `reports/json/exam-ingestion-coverage.json`

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews a design contract only; it does not authorize candidate
   writes, q19 extraction execution, or student/product use.
2. q19 remains blocked while `q19-source-annex-gap` and
   `q19-graph-object-gap` are unresolved.

If either answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### EX5-Q1: Storage Split

Should future operation candidates, answer-skill candidates, and source-annex
extraction overlays stay under governed `references/data/exam-ingestion/`
overlay paths before any machine promotion?

Options:
- Yes, keep the proposed overlay-first storage split.
- Revise the storage paths before any tooling sprint.
- Hold until a broader registry architecture review decides storage.
- Open answer / other, with rationale.

### EX5-Q2: Operation Fields

Are the proposed operation-candidate fields sufficient to represent q3 annual
threshold comparison and later operation candidates without hiding supporting,
weak, rejected, or blocking-gap evidence?

Options:
- Yes, the operation fields are sufficient for a later tooling sprint.
- Revise; name the missing or excessive fields.
- Hold operation storage until a real dry-run record is drafted.
- Open answer / other, with rationale.

### EX5-Q3: Answer-Skill Fields

Are the proposed answer-skill fields sufficient to keep q3 threshold wording
and q15 `q15-answer-1` two-step correction-model explanation visible as
answer-construction needs?

Options:
- Yes, the answer-skill fields are sufficient for a later tooling sprint.
- Revise; name the missing or excessive fields.
- Hold until a broader answer-writing policy is drafted.
- Open answer / other, with rationale.

### EX5-Q4: q19 Extraction Fields

Are the q19 graph/source extraction fields sufficient to prevent q19 from being
treated as reconstructable unless axis labels, units, scale/ticks, geometry,
legend, worksheet regions, and review state are explicit?

Options:
- Yes, use these q19 extraction fields before any extraction execution.
- Revise; name the missing source/graph fields.
- Hold q19 until a separate source-extraction architecture sprint.
- Open answer / other, with rationale.

### EX5-Q5: Validator And CLI Preconditions

Are the validator and CLI preconditions sufficient before later writes: schema
validation, dry-run mode, mutation log, rollback, source evidence refs, review
refs, and rejection of hidden gaps/product flags?

Options:
- Yes, sufficient for a later tooling implementation sprint.
- Revise validator/CLI preconditions before proceeding.
- Hold until existing reference CLI architecture is reviewed in more detail.
- Open answer / other, with rationale.

### EX5-Q6: Routing Facts

Does the contract correctly preserve GATE-EX4 routing facts: q3 `A61` support
with `A15` rejected, q19 `A42`/`D10` support with `A45` weak, q19 gaps blocking,
and q3/q15 answer-skill needs visible?

Options:
- Yes, preserve these routing facts.
- Revise one or more routing facts; name the correction.
- Hold until EX-4/GATE-EX4 evidence is rechecked.
- Open answer / other, with rationale.

### EX5-Q7: Next Sprint Routing

If GATE-EX5 closes, what later bounded sprint should be allowed next?

Options:
- Authorize a validator/CLI implementation planning sprint only, with no
  candidate writes.
- Authorize q19 extraction tooling design first, still with no extraction
  execution.
- Hold all downstream work until storage and field questions are revised.
- Open answer / other, with rationale.

### EX5-Q8: Mutation Authority

Does GATE-EX5 authorize protected reference mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, q19 extraction execution, PV/graph mutation,
lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use
now?

Options:
- No, this gate may only authorize later bounded tooling/design routing.
- Yes, but only for explicitly named low-risk lanes after separate CLI planning.
- Hold; authority cannot be decided until the contract is revised.
- Open answer / other, with rationale.

### EX5-Q9: Product Boundaries

Must diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, and student-facing output
remain blocked?

Options:
- Yes, all product boundaries remain false.
- Revise the product-boundary list before any downstream sprint.
- Hold for product governance review.
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

- Stop if any answer authorizes protected reference mutation, external-source
  mutation, machine-reference mutation, unit minting, operation-registry
  mutation, answer-skill mutation, q19 extraction execution, PV/graph mutation,
  target-exercise promotion, lesson-output mutation, CP-6 closure, or Year-1
  closure now.
- Stop if any answer authorizes candidate-storage writes before a later CLI,
  validator, rollback, audit-log, and gate-closure path exists.
- Stop if any answer treats q19 as reconstructable or lesson-handoff-ready
  while `q19-source-annex-gap` or `q19-graph-object-gap` remains unresolved.
- Stop if any answer hides q3 or q15 answer-skill needs downstream.
- Stop if any answer reuses `A15` as q3 annual threshold support or treats
  `A45` as primary q19 graph-shift support.
- Stop if any answer authorizes diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student-facing output.

## Recommended Next Action

Run the formal GATE-EX5 human review before any later validator/CLI
implementation, candidate writes, q19 extraction execution, lesson handoff, PV
projection, or student-facing use.

# GATE-EX5 Operation And Answer-Skill Contract Human Interview

Sprint: EX-5
Gate: GATE-EX5-operation-answer-skill-contract
Date: 2026-05-25
Mode: batch human review response after full question list was shown

## Interview Scope

The reviewer was shown the full planned EX5 question list in
`reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.md`
before supplying answers.

This record preserves the calibration answers and each binding answer
separately, then checks for contradictions before gate closure.

Overall decision: `PASS WITH CONDITIONS - design-contract review only`.

GATE-EX5 may close as a contract/governance gate. It may authorize later
bounded tooling/design planning, but it must not authorize candidate writes,
q19 extraction execution, protected mutation, lesson-output mutation, or
student/product use.

## Calibration Answers

### EX5-CAL-1: Design-contract review only

Question: Do you confirm this gate is reviewing a design contract only, not
authorizing candidate writes, q19 extraction execution, or student/product use?

Human answer: yes, design-contract review only.

Decision: this gate reviews whether the EX-5 contract is adequate for later
bounded tooling or extraction-planning work. It does not authorize candidate
writes, q19 source-annex or graph-object extraction execution, mutation, or
student/product use.

### EX5-CAL-2: q19 remains blocked

Question: Do you confirm q19 remains blocked while source-annex and
graph-object gaps are unresolved?

Human answer: yes, q19 remains blocked.

Decision: q19 remains blocked while `q19-source-annex-gap` and
`q19-graph-object-gap` are unresolved.

## Recorded Answers

### EX5-Q1: Storage Split

Question: Should future operation candidates, answer-skill candidates, and
source-annex extraction overlays stay under governed
`references/data/exam-ingestion/` overlay paths before any machine promotion?

Human answer: yes, keep the proposed overlay-first storage split.

Recorded decision:

| Surface | Future path | Status |
|---|---|---|
| Operation candidates | `references/data/exam-ingestion/operation-candidates.json` | future storage not created |
| Answer-skill candidates | `references/data/exam-ingestion/answer-skill-candidates.json` | future storage not created |
| Source-annex extraction overlays | `references/data/exam-ingestion/source-annex-extraction-overlays.json` | future storage not created |

Decision: keep future records as governed overlays, not machine-reference or
external-source mutations. A schema, validator, dry-run CLI, mutation log,
rollback instructions, and human-reviewed gate authority remain required before
any write.

### EX5-Q2: Operation Fields

Question: Are the proposed operation-candidate fields sufficient to represent
q3 annual threshold comparison and later operation candidates without hiding
supporting, weak, rejected, or blocking-gap evidence?

Human answer: yes, the operation fields are sufficient for a later tooling
sprint.

Recorded rationale:

- Required fields are sufficient for q3 annual threshold comparison and later
  operation candidates.
- Supporting, weak, rejected, and blocking-gap evidence remain visible.
- A later implementation sprint should dry-run at least
  `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON` before permitting real candidate
  writes.

Decision: accept the operation-candidate field contract for later validator/CLI
planning. No candidate write is authorized.

### EX5-Q3: Answer-Skill Fields

Question: Are the proposed answer-skill fields sufficient to keep q3 threshold
wording and q15 `q15-answer-1` two-step correction-model explanation visible
as answer-construction needs?

Human answer: yes, the answer-skill fields are sufficient for a later tooling
sprint.

Recorded rationale:

- q3 threshold wording must remain a visible answer-construction need.
- q15 two-step correction-model explanation must remain a visible
  answer-construction need.
- These requirements must not be buried inside general content units.

Decision: accept the answer-skill field contract for later validator/CLI
planning. No answer-skill record write is authorized.

### EX5-Q4: q19 Extraction Fields

Question: Are the q19 graph/source extraction fields sufficient to prevent q19
from being treated as reconstructable unless axis labels, units, scale/ticks,
geometry, legend, worksheet regions, and review state are explicit?

Human answer: yes, use these q19 extraction fields before any extraction
execution.

Recorded rationale:

- Required graph fields are sufficient to block premature reconstruction claims.
- Required source-annex fields are sufficient to block premature worksheet or
  figure claims.
- `source_page_or_locator` must be precise for q19, not a loose document
  reference.

Decision: accept the q19 extraction field contract as a precondition for later
extraction planning. No q19 extraction execution is authorized.

### EX5-Q5: Validator And CLI Preconditions

Question: Are the validator and CLI preconditions sufficient before later
writes: schema validation, dry-run mode, mutation log, rollback, source
evidence refs, review refs, and rejection of hidden gaps/product flags?

Human answer: yes, sufficient for a later tooling implementation sprint.

Recorded rationale:

- Future validators must reject unauthorized mutation flags, missing provenance,
  hidden q19 blockers, hidden q3/q15 answer-skill needs, invalid A15/A45
  support, product-use flags, and student-facing output authorization.
- Future CLIs must require a closed human gate naming the exact lane, schema
  validation before write, read-only dry-run mode, mutation log entry, rollback
  instructions, source evidence refs, and review artifact refs.
- The current EX5 checker is correctly read-only.

Decision: accept the validator/CLI preconditions for later planning. No CLI
write or candidate-storage creation is authorized.

### EX5-Q6: Routing Facts

Question: Does the contract correctly preserve GATE-EX4 routing facts: q3
`A61` support with `A15` rejected, q19 `A42`/`D10` support with `A45` weak,
q19 gaps blocking, and q3/q15 answer-skill needs visible?

Human answer: yes, preserve these routing facts.

Recorded routing facts:

| Requirement | Preserved routing fact |
|---|---|
| `q3-calc-1` | operation design candidate; `A61` support only; `A15` rejected |
| `q3-answer-1` | answer-skill candidate; threshold conclusion with unit and direction remains visible |
| `q19-source-annex-gap` | blocking extraction prerequisite |
| `q19-graph-object-gap` | blocking extraction prerequisite |
| `q19-graph-op-1` | held graph/PV route; `A42` and `D10` candidates; `A45` weak support |
| `q19-reason-1` | provisional operation candidate; `D10`/`D13` partial support; blocked by q19 gaps |
| `q15-answer-1` | answer-skill candidate; `D27`/`F03`/`F09` content only |

Decision: preserve all routing facts. No mutation is authorized.

### EX5-Q7: Next Sprint Routing

Question: If GATE-EX5 closes, what later bounded sprint should be allowed next?

Human answer: authorize a validator/CLI implementation planning sprint only,
with no candidate writes.

Decision: authorize `EX-6 Validator And CLI Implementation Planning` as the
allowed next bounded planning sprint only.

Allowed:

- design candidate schemas;
- design validators;
- design dry-run CLIs;
- design mutation log and rollback format;
- design q19 extraction overlay validator;
- create dry-run fixtures if explicitly non-persistent and test-only.

Not allowed:

- candidate-storage writes;
- q19 extraction execution;
- protected/machine/external mutation;
- PV/graph mutation;
- lesson handoff;
- student/product use.

### EX5-Q8: Mutation Authority

Question: Does GATE-EX5 authorize protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, operation-registry
mutation, answer-skill mutation, q19 extraction execution, PV/graph mutation,
lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use
now?

Human answer: no, this gate may only authorize later bounded tooling/design
routing.

Decision: GATE-EX5 authorizes no protected reference mutation,
external-source mutation, machine-reference mutation, unit minting,
operation-registry mutation, answer-skill mutation, q19 extraction execution,
PV/graph mutation, lesson-output mutation, CP-6 closure, Year-1 closure, or
student/product use.

### EX5-Q9: Product Boundaries

Question: Must diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, and
student-facing output remain blocked?

Human answer: yes, all product boundaries remain false.

Decision: diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, and student-facing
output remain blocked.

## Pattern Analysis

The answer pattern is consistent:

- GATE-EX5 closes as a design-contract review only.
- Future operation candidates, answer-skill candidates, and q19 extraction
  overlays remain overlay-first under `references/data/exam-ingestion/`.
- Operation and answer-skill fields are adequate for later validator/CLI
  planning.
- q19 extraction fields are adequate as preconditions, but q19 remains blocked
  until extraction is reviewed.
- q3 `A61` support with `A15` rejected, q19 `A42`/`D10` support with `A45`
  weak, q19 blockers, and q3/q15 answer-skill visibility are preserved.
- The only authorized next lane is validator/CLI implementation planning.
- Candidate writes, q19 extraction execution, protected mutation,
  lesson-output mutation, CP-6/Year-1 closure, and student/product use remain
  blocked.

No targeted follow-up is needed before closure because the answer set preserves
all stop-condition boundaries.

## Closure Proposal

Proposed gate status: `pass_with_conditions`.

Decision:

- Close GATE-EX5 as `PASS WITH CONDITIONS - design-contract review only`.
- Authorize `EX-6 Validator And CLI Implementation Planning` as the next
  bounded planning sprint only.
- Preserve all candidate-write, extraction-execution, mutation, lesson-output,
  closure, and student/product-use blocks.

## Explicit Human Confirmation

The human reviewer supplied a complete GATE-EX5 answer set and closure wording
on 2026-05-25 authorizing closure as `PASS WITH CONDITIONS - design-contract
review only`.

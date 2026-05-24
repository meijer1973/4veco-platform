# Operation And Answer-Skill Registry Contract

Generated: 2026-05-24

Status: design contract pending GATE-EX5 review.

This contract is an EX-5 design artifact. It does not create operation
candidate records, answer-skill candidate records, q19 source-annex extraction
records, q19 graph-object extraction records, machine references, external
source records, lesson output, or student-facing product surfaces.

## Authority Boundary

Not authorized:

- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- unit minting;
- operation-registry mutation;
- answer-skill mutation;
- q19 source-annex or graph-object extraction execution;
- PV/graph mutation;
- target-exercise promotion;
- lesson-output mutation;
- CP-6 closure;
- Year-1 closure;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student-facing output.

## Storage Decision

Future operation and answer-skill records should remain overlay-first unless a
later human gate explicitly names a different governed route.

| Surface | Future path | Current state |
|---|---|---|
| Operation candidates | `references/data/exam-ingestion/operation-candidates.json` | future storage not created |
| Answer-skill candidates | `references/data/exam-ingestion/answer-skill-candidates.json` | future storage not created |
| Source-annex extraction overlays | `references/data/exam-ingestion/source-annex-extraction-overlays.json` | future storage not created |

Before any write, each surface needs a schema, validator, dry-run CLI, mutation
log, rollback instructions, and human-reviewed gate authority naming the exact
lane.

## Operation Candidate Minimum Fields

Future operation records must include:

- stable `operation_id`;
- `operation_status`;
- Dutch label;
- operation family;
- source exam item ids;
- source requirement ids;
- source evidence refs;
- answer-model refs;
- input objects;
- output expectation;
- required steps;
- supporting unit ids;
- weak or rejected unit ids;
- blocking gap ids;
- review state;
- `mutation_authorized: false` unless a later gate and CLI path changes it;
- `student_product_use_authorized: false`.

Forbidden fields include mastery decisions, adaptive routes, summative scores,
student diagnostics, PV projection authorization, and machine-promotion
authorization.

## Answer-Skill Candidate Minimum Fields

Future answer-skill records must include:

- stable `answer_skill_id`;
- `answer_skill_status`;
- Dutch label;
- answer format;
- source exam item ids;
- source requirement ids;
- correction-model step refs;
- point-rule refs;
- rewarded wording;
- required terms;
- accepted alternatives;
- content-support unit ids;
- operation-support ids;
- blocking gap ids;
- review state;
- `mutation_authorized: false` unless a later gate and CLI path changes it;
- `student_product_use_authorized: false`.

Forbidden fields include mastery decisions, adaptive routes, summative scores,
student diagnostics, automatic-feedback authorization, and student-facing AI
authorization.

## q19 Extraction Contract

q19 remains blocked by:

- `q19-source-annex-gap`;
- `q19-graph-object-gap`.

Any future q19 source-annex/graph-object extraction record must identify the
official source locator and make the graph/worksheet reconstructable enough for
human review. Required graph fields include axis labels, units, scale or tick
marks, curve or series labels, coordinates or reconstructable geometry, legend
mapping, student-action regions, extraction status, review state, and blocking
gap ids.

Required source-annex fields include source material id, annex type, source
page or locator, prompt reference, worksheet regions, required student marks,
extraction status, review state, and blocking gap ids.

Until those fields exist and are reviewed, q19 blocks:

- full exam reconstruction;
- accepted MTU mapping;
- graph/PV route execution;
- chained-reasoning operation execution;
- lesson-build handoff;
- PV projection;
- student-facing output.

## Candidate Routing Facts

| Requirement | Contract route | Required visibility |
|---|---|---|
| `q3-calc-1` | operation design candidate `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON` | `A61` support only; `A15` rejected |
| `q3-answer-1` | answer-skill candidate `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` | threshold conclusion with unit and direction remains visible |
| `q19-source-annex-gap` | q19 extraction prerequisite | blocking |
| `q19-graph-object-gap` | q19 extraction prerequisite | blocking |
| `q19-graph-op-1` | held graph/PV route candidate | `A42` and `D10` candidates; `A45` weak support |
| `q19-reason-1` | provisional operation candidate | `D10`/`D13` partial support; blocked by q19 gaps |
| `q15-answer-1` | answer-skill candidate `EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION` | `D27`/`F03`/`F09` content only |

## Validator And CLI Preconditions

Future validators must reject:

- unauthorized mutation flags;
- candidate records without source exam item and requirement provenance;
- q19 graph/PV or reasoning records while q19 blocking gaps remain unresolved;
- hidden q3 or q15 answer-skill needs;
- `A15` reused as q3 annual threshold support;
- `A45` treated as primary q19 graph-shift support;
- product-use flags set to true;
- student-facing output authorization.

Future CLIs must require a closed human gate naming the exact lane, schema
validation before write, read-only dry-run mode, mutation log entry, rollback
instructions, source evidence refs, and review artifact refs.

## Rollback And Audit Requirements

Before any future write:

- a mutation log must record previous record state or explicit new-record
  marker;
- the CLI must support dry-run mode;
- rollback must be possible without hand-editing `references/machine/` or
  `references/external/`;
- rollback must not delete original exam-ingestion overlays;
- audit logs must record gate id, sprint id, command, timestamp, source
  requirement ids, supporting/weak/rejected/gap ids, validation output, and
  boundary flags.

## GATE-EX5 Review Requirements

GATE-EX5 must decide:

1. whether the future storage paths are right;
2. whether operation candidate fields are sufficient;
3. whether answer-skill candidate fields are sufficient;
4. whether q19 graph/source extraction fields are sufficient;
5. whether validator/CLI/rollback/audit preconditions are sufficient;
6. whether any later bounded sprint is authorized;
7. whether all mutation and product-use boundaries remain blocked.

## Next Action

Run the formal GATE-EX5 human review before any later validator/CLI
implementation, candidate-record write, q19 extraction execution, lesson
handoff, PV projection, or student-facing use.

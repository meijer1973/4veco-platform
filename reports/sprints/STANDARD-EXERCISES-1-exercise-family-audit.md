# STANDARD-EXERCISES-1 Exercise Family Audit

Generated: 2026-06-01

Status: audit complete, no implementation authorized.

## Scope

This sprint audits the current task and exercise families used by:

- reasoning game;
- math / skilltree route;
- graph/table game;
- exit-ticket / checkpoint surfaces;
- guided practice / begeleide inoefening;
- procedure / stappenplan support.

The audit uses `../4veco-lessen/specifications/product-end-state.md`,
`../4veco-lessen/specifications/companion-core-specifications.md`,
`reports/sprints/GAME-ARCH-2-task-shell-api.md`,
`reports/sprints/GAME-ARCH-2-file-disposition.md`, current engine/source files,
and generated first-three-paragraph output as read-only evidence.

This sprint does not implement missing families, mutate engines, write source
data, regenerate lesson output, authorize target-equivalent claims, or authorize
Scale Gate 1.

## Summary Verdict

PASS WITH FLAGS as an audit/contract sprint.

The shared task-shell runtime already covers the strongest math, graph/table,
and reviewed `1.1.2` exit-ticket actions. It should remain the standard for
overlapping task families.

The largest gap is reasoning. Mode 5 already uses `structured_reasoning` through
the shared task shell, but the other reasoning modes remain local engine
interactions. They are useful product patterns, not defects, but they are not
yet represented as shared standard exercise families. `REASON-STD-1` must define
or migrate the missing families instead of hiding them under one generic
`structured_reasoning` label.

Guided practice and procedure support remain outside the shared task shell. That
is acceptable for learning-support surfaces in this audit, but later
unification work must decide whether those patterns are kept as support modules,
wrapped, or standardized when they overlap with practice/checkpoint actions.

Scale Gate 1 remains blocked.

## Runtime Standard

`engines/task-shell-engine.js` currently exposes these runtime families:

| Family | Current use | Audit decision |
|---|---|---|
| `choice` | low-stakes/advisory choice tasks, table-style options | keep, but not as universal exit-ticket substitute |
| `numeric_input` | skilltree math numeric answer | covered, harden UX/focus later |
| `calculation_work_capture` | math, graph value calculations, `1.1.2` exit ticket | covered, keep as core |
| `final_answer_entry` | math final-answer step | covered, pair with work where target requires proof |
| `unit_notation_field` | math notation/unit step | covered, make explicit in UX hardening |
| `short_constructed_response` | generic short response / criteria family | covered, not a broad semantic engine |
| `structured_short_response` | reviewed `1.1.2` D31 repair | runtime covered, documentation gap |
| `table_value_selection` | `1.1.3` graph/table route | covered |
| `graph_reading` | `1.1.3` graph route and derived legacy graph reads | covered |
| `point_placement` | `1.1.3` graph route | covered |
| `graph_construction_substitute` | graph construction/axis substitute | covered as substitute, not full drawing |
| `structured_reasoning` | reasoning mode 5 self-check | covered, but self-check only |

Important flag: `structured_short_response` exists in the runtime and is used by
the repaired `1.1.2` target-equivalent candidate, but it was not listed in the
GAME-ARCH-2 task-shell API as a canonical family. The right repair is to
document and harden this family in `TASK-SHELL-UX-2`, not to return to brittle
single-field regex for D31-style tasks.

## Surface Matrix

| Surface | Current state | Shared-shell coverage | Decision | Follow-up |
|---|---|---|---|---|
| Reasoning game | Six modes; mode 5 uses shared task shell, modes 0-4 local | partial | require standard expansion | `REASON-STD-1` |
| Math / skilltree | A38/A39 use numeric input, calculation work, final answer, unit/notation | strong | keep and harden | `TASK-SHELL-UX-2` |
| Graph/table | `1.1.3` is strongest reference route: table selection, graph reading, axis convention, interpolation, point placement, graph-construction substitute, calculation/work | strong | keep/refactor as reference pattern | `TASK-SHELL-UX-2`, later `CHECK-SHORT-EXIT-2` |
| Exit ticket / checkpoint | `1.1.1` advisory choice; `1.1.2` task-shell target-equivalent candidate | mixed | keep boundaries, standardize structured short response | `CHECK-SHORT-EXIT-2` |
| Guided practice | scaffolded open prompts, thinking steps, hints, formulas, visual scaffolds, model answers | outside shell | keep as learning support; do not count as proof | `ENGINE-UNIFY-1` |
| Procedure support | `given` / `choose` procedure flow | outside shell | wrap or keep as support module | `ENGINE-UNIFY-1` |

## Reasoning Decisions

| Candidate family | Current evidence | Decision | Why |
|---|---|---|---|
| `structured_reasoning` | reasoning mode 5 builds a task-shell task | covered existing, self-check only | useful for constructed reasoning practice, but not enough for all reasoning modes |
| `step_ordering` | mode 0 `Stappen ordenen` | requires standard expansion | ordering steps is a distinct student action |
| `cause_effect_chain` | CSV flow fields plus flow mode and self-check mode | requires standard expansion | causal chain structure should not collapse into generic text response |
| `claim_reason_evidence` | mode 1 `Deelvragen opbouwen` | requires standard expansion | selecting subquestions / route logic is its own response shape |
| `flow_diagram_build` | mode 3 `Stroomdiagram bouwen` | requires standard expansion | visual construction is required when chain order is the learning goal |
| `classification_with_explanation` | mode 4 `Structuren matchen` | requires standard expansion | matching structures is present; explanation must be standardized later |
| `short_constructed_response` | task-shell family exists | covered with limits | adequate for compact responses, not a general semantic rubric |
| `source_based_explanation` | required by answer-form/product direction, not current first-three standard | requires standard expansion | source observation plus answer-form completion needs a reusable pattern |

`error_detection` also exists as reasoning mode 2. It is useful, but this audit
does not make it part of the minimum Product Proof Track standard. It should be
handled by `REASON-STD-1` after the required families above are specified.

## Family Detail

| Family row | Student action | Response shape | Feedback owner | Coverage decision |
|---|---|---|---|---|
| `choice` | select one option | value | task shell / legacy exit-ticket engine | covered; low-stakes only unless target is choice-like |
| `numeric_input` | enter a number | value | task shell | covered |
| `calculation_work_capture` | show work and final answer | work + finalAnswer | task shell | covered core family |
| `final_answer_entry` | enter final answer | value | task shell | covered; not sufficient alone for target proof |
| `unit_notation_field` | enter unit or notation | value | task shell | covered; UX hardening needed |
| `short_constructed_response` | short answer by criteria | value | task shell | covered with semantic limits |
| `structured_short_response` | fielded short explanation | fields + optional choice | task shell | runtime covered; standard documentation gap |
| `table_value_selection` | select table/source value | value | graph via task shell | covered |
| `graph_reading` | read or estimate graph value | value | graph via task shell | covered |
| `point_placement` | enter x/y coordinate | point | graph via task shell | covered |
| `graph_construction_substitute` | describe construction / axis step | text | graph via task shell | covered substitute |
| `structured_reasoning` | write cause-step-conclusion reasoning | text | reasoning via task shell | covered self-check only |
| `step_ordering` | order reasoning steps | ordered steps | local reasoning engine | standard expansion |
| `claim_reason_evidence` | order subquestions / reasoning route | ordered questions | local reasoning engine | standard expansion |
| `cause_effect_chain` | build/explain causal chain | ordered nodes or prose | local reasoning + task shell | standard expansion |
| `flow_diagram_build` | place flow blocks visually | ordered blocks | local reasoning engine | standard expansion |
| `classification_with_explanation` | match structures and later explain | pairs + explanation | local reasoning engine | standard expansion |
| `source_based_explanation` | use source observation and finish answer form | source + explanation | future shared shell/domain module | standard expansion |
| `error_detection` | identify flawed reasoning step | selected step index | local reasoning engine | defer standardization |
| `guided_open_scaffolded_response` | practice with thinking steps, hints, model answers | document/html open response | guided-practice builder/output | learning support outside proof standard |
| `procedure_given_choose_flow` | follow given/choose procedure steps | selected option | procedure engine | support module; wrap/defer |

The structured JSON matrix at
`reports/json/standard-exercise-family-coverage.json` carries the detailed
student action, response shape, feedback model, shared-shell coverage,
disposition, dual-coding policy, follow-up owner, and evidence paths for every
row.

## Product Interpretation

The shared task shell is already strong enough to remain the default for:

- calculation tasks;
- graph/table read and placement tasks;
- target-equivalent `1.1.2` calculation and D31 tasks;
- short structured responses where deterministic criteria are sufficient.

It is not yet broad enough to absorb reasoning by renaming all modes
`structured_reasoning`. The missing standard families are product-relevant:
`step_ordering`, `cause_effect_chain`, `claim_reason_evidence`,
`flow_diagram_build`, `classification_with_explanation`, and
`source_based_explanation`.

This audit also preserves the short-check / exit-ticket distinction. Guided
practice, procedure support, advisory checks, and reasoning practice may teach,
hint, repair, and route. Target-equivalent exit tickets must still cover the
target exercise operation chain at the same level and cannot inherit learning
hints or broad progress language from practice surfaces.

## Follow-Up Flags

| Flag | Owner | Disposition | Next action |
|---|---|---|---|
| SE1-F1 reasoning standard expansion | `REASON-STD-1` | accepted follow-up | Define/migrate missing reasoning task families; decide wrapper vs rebuild. |
| SE1-F2 structured short response documentation gap | `TASK-SHELL-UX-2` | accepted follow-up | Document, harden, and test `structured_short_response` as a standard family. |
| SE1-F3 guided/procedure support outside shell | `ENGINE-UNIFY-1` | accepted follow-up | Decide keep/wrap/standardize for support surfaces without counting them as target proof. |

These flags are not blockers for this audit sprint because the sprint's job is
to identify and contract the gaps. They are blockers for broad product proof if
later sprints ignore them.

## Boundaries

No generated lesson output changed in this sprint.

No engines, source exit-ticket data, reasoning CSVs, graph/procedure/guided
practice builders, protected references, target-exercise records, candidate
storage, or generated Book 1 output may be changed by this audit.

This sprint authorizes no target-equivalent claims, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, Scale Gate 1, or product-wide use.

## Recommended Next Action

Close `STANDARD-EXERCISES-1` after validator and lead-review confirmation, then
proceed to `TASK-SHELL-UX-2`. That next sprint should harden the shared shell
for feedback flow, hints, separate unit/notation fields, focus, and
`structured_short_response` before implementation work attempts to scale
reasoning or check surfaces.

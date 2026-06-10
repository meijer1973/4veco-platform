# Shared Task Rollout Policy

Status: rollout policy for using shared task families inside Golden Exercise Workbench.

## Purpose

Golden Exercise Workbench owns page layout, source/task order, feedback placement, authority boundaries, and no-legacy shell rules. Shared task families own reusable interaction mechanics. Rollout succeeds only when both layers keep their responsibilities clear.

## Ownership Boundary

Workbench owns:

```text
route root and shell
source-left/task-right desktop layout
source-first/task-second mobile layout
visible operation chain
feedback location
route/recovery position
surface-type distinction
no legacy/hybrid shell
proof obligations
```

Shared task families own:

```text
task-specific controls
parsers and tolerances
token-bank behavior
graph snapping and drawing behavior
choice validation
wrong/correct feedback state data
negative fixtures for interaction rules
```

If a shared task family cannot preserve the visible operation chain, record an engine blocker. Do not downgrade the Workbench route into generic dropdowns or textareas.

## Reuse Before Bespoke

Use existing shared task-family concepts where they preserve the student operation:

```text
graph_construction_substitute
graph_reading
formula_builder
calculation_work_capture
source-value/source-chain controls
claim-reason-evidence controls
step ordering
sentence builder
```

Do not copy prototype HTML into generated output. Convert the pattern into data and reusable behavior.

## Current Transfer Sources

### `1.1.3` Golden Ticket

Use for graph/table rollout policy:

```text
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
references/exemplars/1.1.3-exit-ticket/
```

Transferable rules:

```text
direct Golden route shell
source table as first-class context
axis choices with distractors
two source points for a straight-line graph
automatic line after determined points
interval-before-read-off graph reading
claim-control operation chain
local feedback after attempt
no completion-language claim
```

### A96 Answer Form

Use for calculation and answer-form rollout policy:

```text
references/exemplars/a96-answer-form/
```

Transferable rules:

```text
formula or method action comes before substitution
substitution uses labelled source-value blanks
final answer and notation are explicit
context conclusion is separate
token banks are mixed and include plausible distractors
visually identical hidden-token traps are forbidden
```

## First Rollout Order

Rollout must stay staged:

```text
1. 1.1.3 exit ticket as implemented reference
2. 1.1.2 exit ticket as first transfer proof
3. 1.1.1 exit ticket or short check by operation fit
4. first advisory short-check variant
5. graph/table practice
6. calculation practice
7. reasoning practice
8. mixed/exam-derived source exercise
```

Only the first item is currently promoted as an implemented reference. The 1.1.2 exit ticket may be carried as a controlled transfer candidate, but it does not authorize the remaining rollout items or target-equivalent completion language.

## Required Data Contract for New Candidates

A future Golden candidate should declare:

```text
surface type
layout.framework: golden_exercise_workbench
source/context blocks
task operation chain
task-family controls
dependency locks, if any
feedback after attempt
practice/recovery routes, if useful
target-equivalent gate state
completion-language eligibility
proof states collected
```

For exit-ticket candidates, `completionLanguageEligible` must remain false unless a later gate explicitly approves it.

## Negative Fixture Expectations

Future checker goals should reject:

```text
#exit-ticket-app on Golden routes
legacy assets on Golden routes
mixed ge-* and et-* shell classes
answer-giving placeholders
static pre-attempt formula reveal when assessed
formula token banks ordered as the answer
visually identical hidden-token traps
correct-only interval or conclusion controls
fake graph slope/line-shape question
graph read-off before interval selection
missing after-interaction screenshot proof
product-use or target-equivalent overclaim
```

## Rollout Gate

A route may move from candidate to governed adoption only after:

```text
policy conformance is documented
desktop/mobile/dark proof exists
wrong/correct feedback proof exists
after-interaction proof exists
no-legacy DOM proof exists
negative fixtures pass when checkers exist
teacher-learning and student-experience reviews are complete
lead synthesis says the result reduces future human oversight
```

## No Product Authority Expansion

Shared-task rollout must not claim:

```text
student/product use
Scale Gate 1
target-equivalent completion language
diagnostics
mastery
automatic sequencing
summative use
all routes migrated
```

Those require later gates or explicit human approval.

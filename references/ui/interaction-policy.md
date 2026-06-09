# Interaction Policy

Status: central interaction policy for Golden Exercise Workbench surfaces.

## Policy Purpose

The interaction policy preserves the student action. Passing a renderer check is not enough. If the UI makes the wrong action impossible, gives away the answer, hides required reasoning, or tests pixel precision instead of economic understanding, the implementation fails this policy.

## Operation Chain First

Before building a Golden Exercise surface, write the intended operation chain. Each required operation should normally become a visible UI section.

Common chains:

```text
graph construction -> graph reading -> claim/control
formula/method -> substitution -> final answer -> notation -> contextual conclusion
source value -> source chain -> answer form
claim/direction -> mechanism -> evidence -> conclusion
```

Do not hide these operations inside one generic textarea unless the target is genuinely extended writing.

## Source and Context

Source-dependent tasks must show the source as task material, not as decoration.

Required:

```text
source/card contains only material needed for the task
source remains before task on mobile
contextRefs or equivalent source links point from task steps back to source material
formula cards are omitted before attempt when formula knowledge is assessed
route/recovery links stay secondary
```

Forbidden:

```text
source-value controls without visible source context
pre-attempt worked examples on proof/check surfaces
static answer patterns when answer form is assessed
route cards that push source below the active task
```

## Task-Family Controls

Controls must match the student action:

| Operation | Preferred controls | Must avoid |
| --- | --- | --- |
| graph construction | axis choices, point placement, magnetic table-point snapping, automatic line after determined points | completed graph recognition, fake line-shape check |
| graph reading | interval-first selector, tolerant numeric read-off | numeric answer before interval, answer-value placeholder |
| formula structure | mixed formula-builder tokens with distractors | static formula reveal, token order that gives the answer |
| substitution | formula template blanks labelled by source value | duplicate fields that repeat the same visible work without purpose |
| calculation answer | final answer field plus unit/notation field | one generic textarea for structured answer form |
| context conclusion | conclusion field or plausible conclusion choices | correct-only conclusion list |
| source use | source-value selection and source-chain controls | source controls detached from the source |
| reasoning | step ordering, sentence builder, claim-reason-evidence controls | generic multiple choice used as a substitute for proof |

## No Fake Actions

A control is fake if the wrong action is impossible, irrelevant, or invisible.

Forbidden examples:

```text
a line-shape question when the line is already determined by plotted points
a formula-builder token bank ordered so left-to-right clicking gives the answer
a token bank with no plausible distractors
visually identical correct tokens with different hidden IDs
a conclusion selector with only acceptable conclusions
source-value controls without source context
```

If wrong alternatives are not useful, do not create a pretend assessment. Use the determined result directly and assess the next meaningful operation.

## Locking and Grey-Out

Locking is allowed only for real dependency sequencing.

Allowed:

```text
graph reading locked until graph construction is complete
claim-control locked until required source/graph reading is complete
final conclusion locked until calculation answer exists
```

Forbidden:

```text
locking independent questions as a style effect
locking because the old framework has a wizard flow
locking without disabled controls or aria-disabled state
locking without a visible reason
```

A locked section must show the reason, for example:

```text
Rond eerst het vorige onderdeel af.
```

## Formula Builder Policy

Formula token banks must:

```text
be deliberately mixed in order
include plausible distractors
avoid answer-giving labels
permit visible reuse when the same concept must appear twice
validate the visible operation, not invisible token trivia
```

Forbidden:

```text
left-to-right token order that forms the correct formula
distractors that are obviously irrelevant
formula card shown before attempt when formula knowledge is being assessed
two visually identical tokens with different hidden IDs
two tokens both labelled "oude prijs" when hidden IDs make one correct and one wrong
```

A96 is the controlling answer-form exemplar for this rule. When the same concept appears twice, prefer one reusable visible token with a usage count over hidden duplicate tokens.

## Graph Interaction Policy

Graph/table tasks must protect graph understanding over pixel precision.

Required:

```text
axis choices include plausible distractors
axis labels may be hidden until the student chooses axes
point placement uses magnetic snapping or broad tolerance when interpretation is assessed
two distinct points are sufficient when a straight line is determined by those points
the line is drawn automatically when it is mathematically determined
graph-reading asks for the relevant interval before the numeric read-off
proof includes the graph state after construction
```

Forbidden:

```text
separate fake slope/line-shape question after two points determine the line
completed graph visible before construction when construction is assessed
pixel-perfect point rejection for source-table points
axis options with no plausible distractors
answer-value placeholder in graph read-off field
```

The implemented `1.1.3` Golden Ticket route is the current graph/table reference.

## Feedback Policy

Feedback must be:

```text
local to the relevant operation
visible only after an attempt on proof/check surfaces
neutral and non-summative
route-oriented where recovery is useful
stable in the layout
```

Feedback must not claim:

```text
diagnostics
mastery
grade
automatic sequencing
summative result
student-facing AI judgement
Scale Gate readiness
target-equivalent completion unless separately approved
```

## Exit Ticket vs Short Check

Exit tickets:

```text
may be target-equivalent proof candidates
must preserve same-level operation and answer-form proof
must not use hint-heavy learning flow
must not claim target-equivalent completion language without gate approval
```

Advisory short checks:

```text
may advise, route, and repair
may include local hints or collapsible help
may include recovery feedback
must not replace exit tickets
must not claim target-equivalent proof
```

## Proof Policy

A Golden Exercise interaction proof should include:

```text
initial state
partial input state
wrong/retry feedback state
correct/completed feedback state
after-graph or after-formula state where relevant
mobile state
dark-mode state
no-legacy DOM proof
negative fixture results when checkers exist
```

The proof must show the state after student action. Initial render alone does not prove interaction quality.

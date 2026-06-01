# TASK-SHELL-UX-2 UI Contract

Generated: 2026-06-01

Status: implementation contract for shared task-shell UX hardening.

## Scope

This contract defines the `TASK-SHELL-UX-2` task-shell UX baseline for
calculation/work tasks, hidden hints, feedback flow, and
`structured_short_response`.

It is a platform UI contract only. It does not authorize target-equivalent
claims, diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV, Scale Gate 1, or broad product use.

## Calculation Work Capture

`calculation_work_capture` keeps the existing work-plus-final-answer shape and
adds an optional separate unit/notation field.

Response shape:

```json
{
  "work": "162 / 150 x 100",
  "finalAnswer": "108",
  "unitNotation": "indexcijfer"
}
```

Interaction fields:

```json
{
  "workLabel": "Berekening",
  "finalAnswerLabel": "Indexcijfer",
  "placeholder": "Laat zien welke waarde gedeeld wordt door de basiswaarde.",
  "finalAnswerPlaceholder": "Bijvoorbeeld 108",
  "unitNotationLabel": "Notatie",
  "unitNotationPlaceholder": "Bijvoorbeeld indexcijfer"
}
```

Expected unit/notation shape:

```json
{
  "kind": "text",
  "accepted": ["index", "indexcijfer"],
  "required": false
}
```

Rules:

- If `expected.unitNotation.required` is `true`, the notation field must match
  one accepted value.
- If `expected.unitNotation.required` is `false`, an empty notation field is
  accepted, but a filled incorrect notation is rejected.
- A compact correct answer such as `108` for the reviewed `1.1.2` index task
  must stay accepted when calculation work is correct.
- Wrappers must collect `unitNotation` alongside `work` and `finalAnswer`.
- Focus plans include the unit/notation field when it is rendered.

## Hints

Task-shell tasks may declare:

```json
{
  "hints": ["Denk aan nieuw min oud, gedeeld door oud."]
}
```

Rendering rules:

- Hints render in a collapsed `<details class="ts-hints">` element.
- Hints are not opened by default.
- Hints are allowed in short checks, guided practice, and practice routes.
- Exit-ticket source data must not expose content hints unless a later gate
  explicitly approves non-answer-revealing interface help.

`TASK-SHELL-UX-2` keeps the reviewed `1.1.2` exit ticket free of task hints.

## Feedback

Each task-shell task renders one default labelled feedback region:

```html
<div class="ts-feedback" aria-live="polite" role="status"
  aria-label="Feedback op je antwoord" tabindex="-1"></div>
```

Wrapper surfaces that provide their own feedback region remove the embedded
`ts-feedback` region and write feedback into exactly one local region.

Required behavior:

- A check action replaces the feedback in that one region.
- Feedback regions are focusable and labelled.
- Wrappers move keyboard focus to the labelled feedback region after checking.
- Correct or self-check feedback may expose a next local action through
  `.ts-feedback-actions` and `.ts-feedback-action`.
- Feedback must not stack duplicate blocks after repeated checks.

## Pre-Attempt Criteria

Criteria lists are useful in practice and self-check surfaces, but they become
answer scaffolding in target-equivalent exit tickets.

Rules:

- Practice, guided routes, and advisory checks may show criteria before
  checking when the task is explicitly a self-check or learning task.
- Exit-ticket rendering must suppress pre-attempt criteria while preserving
  the same criteria in source data for deterministic checking and review.
- In `TASK-SHELL-UX-2`, exit-ticket wrappers render task-shell tasks with
  `interaction.showCriteriaBeforeCheck = false`.

## Exit-Ticket Placeholders

Source tasks may keep answer-like placeholders for authoring review, but the
target-equivalent exit-ticket UI must not render those examples before attempt.

Rules:

- Exit-ticket wrappers replace task-shell placeholders with neutral text such
  as `Vul je eindantwoord in`, `Vul de notatie in`, and `Vul je antwoord in`.
- Exit-ticket rendering must not expose examples like `Bijvoorbeeld 15`,
  `Bijvoorbeeld 108`, `Bijvoorbeeld 3,7`, or `Bijvoorbeeld 4 indexpunten`
  before attempt.
- Practice and advisory surfaces may use instructional placeholders where that
  does not reveal the answer.

## Structured Short Response

`structured_short_response` is the standard family for short constructed
responses where broad prose matching would be too weak or too brittle.

Response shape:

```json
{
  "fields": {
    "indexpunten": "4 indexpunten",
    "basis": "108",
    "procentuele-stijging": "3,7%"
  },
  "choice": "niet-vier-procent"
}
```

Expected shape:

```json
{
  "kind": "structured_text_criteria",
  "criteria": [
    "Noem indexpunten.",
    "Gebruik 108 als basis.",
    "Noem ongeveer 3,7 procent.",
    "Wijs 4 procent af."
  ],
  "fields": [
    { "id": "indexpunten", "accepted": ["4", "4 indexpunten"] },
    { "id": "basis", "accepted": ["108", "basis 108"] },
    { "id": "procentuele-stijging", "accepted": ["3,7%", "3.7%"] }
  ],
  "choice": { "value": "niet-vier-procent" }
}
```

Rules:

- The task collects bounded field answers plus one optional required choice.
- Matching remains deterministic and field-based.
- This family is not a general semantic rubric engine.
- Broader reasoning families such as step ordering, cause-effect chains,
  claim-reason-evidence, flow diagrams, classification with explanation, and
  source-based explanation remain owned by `REASON-STD-1`.

## Product Boundaries

This contract preserves these boundaries:

- `1.1.1` remains advisory/local unless a later target-equivalent gate changes
  it.
- `1.1.2` remains the only reviewed target-equivalent local exit-ticket
  candidate touched by this sprint.
- `1.1.3` target-equivalent graph/table exit-ticket work remains out of scope.
- No protected reference mutation, target-exercise registry write, candidate
  storage write, projection refresh, CP-6/Year-1 promotion, Scale Gate 1, or
  product-wide use is authorized.

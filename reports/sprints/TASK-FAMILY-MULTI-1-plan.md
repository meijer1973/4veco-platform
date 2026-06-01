# Sprint TASK-FAMILY-MULTI-1: Multi-Select Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `multi_select` as a deterministic structured-choice family in the
shared task shell. Students select all options that satisfy a prompt, such as
all relevant source constraints, assumptions, must-mention elements, causes,
or effects.

This sprint may implement shared runtime support and report-fixture proof only.
It does not authorize generated lesson output, new source exercise tasks,
target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice task-family contract and
named `TASK-FAMILY-MULTI-1` as the next implementation lane after
`cloze_text`. The accepted contract defines:

- family: `multi_select`;
- student action: select all options that satisfy a prompt;
- response shape: `{ "values": ["optionId"] }`;
- expected shape: `{ "kind": "multi_select", "values": ["optionId"], "mode": "exact_set" }`;
- validation owner: shared task shell;
- feedback owner: shared task shell;
- target-proof limit: eligible only when selecting a complete set is the
  reviewed target action, not as a substitute for calculation or prose
  reasoning.

`TASK-FAMILY-CLOZE-TILE-1`, `TASK-FAMILY-SENTENCE-1`,
`TASK-FAMILY-FORMULA-1`, and `TASK-FAMILY-CLOZE-1` established the runtime
standard for new shared families: first-class family declaration, strict
response-shape matching, shared UI helpers, wrapper collection support, focused
tests, custom sprint checker, report-fixture proof, and structural lead review.

## Implementation schema

`multi_select` must use this explicit interaction schema:

```json
{
  "family": "multi_select",
  "interaction": {
    "inputLabel": "Kies alle uitspraken die kloppen",
    "options": [
      {
        "id": "behoeften",
        "label": "Behoeften zijn groter dan beschikbare middelen",
        "description": "Past bij schaarste"
      },
      {
        "id": "keuze",
        "label": "Je moet kiezen tussen alternatieven",
        "description": "Past bij schaarste"
      },
      {
        "id": "alles-kan",
        "label": "Iedereen kan alles krijgen wat hij wil",
        "description": "Past niet bij schaarste"
      }
    ]
  },
  "expected": {
    "kind": "multi_select",
    "mode": "exact_set",
    "values": ["behoeften", "keuze"],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.inputLabel` is required and must be a non-empty
  student-facing label for the option group.
- `interaction.options` defines the visible option bank and reuses the
  existing student-facing option shape: `id`, `label`, optional `description`.
- Every option id must be unique.
- `expected.kind` must be `multi_select`.
- `expected.mode` must be `exact_set`.
- `expected.values` must contain at least two unique option ids. If exactly one
  answer is intended, use `choice` instead of `multi_select`.
- At least one non-expected option must remain available so the task actually
  checks set selection rather than "select everything".
- Student response shape is exactly `{ "values": ["optionId"] }`; raw arrays,
  duplicate values, unknown ids, missing keys, and extra response keys must not
  match.
- Deterministic matching is order-insensitive: `["a", "c"]` and `["c", "a"]`
  match the same exact set.
- `partialFeedback: "practice_only"` is optional and may be used only for
  practice or advisory short-check surfaces. It may report missing required
  options and selected distractors in neutral terms. It does not create
  diagnostics, mastery, sequencing, or target-equivalent proof.
- When partial feedback is enabled and the exact set does not match,
  `evaluateTask` must return:

```json
{
  "selectionFeedback": {
    "mode": "practice_only",
    "missingRequired": [{ "id": "optionId", "label": "Student label" }],
    "selectedDistractors": [{ "id": "optionId", "label": "Student label" }],
    "correctSelected": [{ "id": "optionId", "label": "Student label" }]
  }
}
```

  The shared UI may render those labels as neutral local feedback. Exact
  target-equivalent or generated-route use must omit this mode unless a later
  review explicitly accepts it.

## Quality Standard

The quality floor is a specification-accurate shared family that lets
student-facing surfaces ask for complete-set recognition without creating a
one-off local widget or weakening richer target operations. Passing tests alone
is insufficient: the implementation must prove that rendered output exposes
checkbox-like multi-select controls, clear selected state, one feedback region,
optional neutral partial-feedback details, stable response collection through
existing wrappers, and strict target-proof boundaries.

The sprint fulfils the product specification by adding a stronger alternative
to generic single-choice recognition for bounded set-selection actions. It must
support high-value uses such as source constraints, valid assumptions,
must-mention explanation elements, and multiple causes or effects while naming
follow-up work before `multi_select` is used in product routes,
target-equivalent exit tickets, or Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` review must still inspect rendered generated output
before the family is relied on in reasoning migration, check implementation,
first-three-paragraph product proof, or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `multi_select` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates option ids, exact-set expected values, non-single-answer use, and non-empty distractor set. | Focused Jest and custom sprint checker. | planned |
| Response shape remains exactly `{ values: ["optionId"] }`. | Engine matching and wrapper response collectors reject raw arrays, missing keys, unknown ids, duplicate selected ids, and extra response keys. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Deterministic matching is exact-set and order-insensitive. | Matching compares normalized sets while preserving strict unknown/duplicate rejection. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns missing required options and selected distractors without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses checkbox-like multi-select controls, not radio-style single choice. | `engines/task-shell-ui.js` renders selectable option buttons with stable `data-multi-option-id` selectors and independent toggle state. | UI tests and rendered fixture proof. | planned |
| Feedback, focus, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose button controls, visible selected state, one labelled feedback region, and focus plan selectors for multi-select options. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-authority artifacts change. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `multi_select` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Add optional partial-feedback details for practice/advisory use. | include_now | The accepted contract explicitly names feedback on missing required options and selected distractors. |
| Use native buttons with independent `aria-pressed` state. | include_now | This keeps keyboard behavior simple and consistent with existing task-shell option controls. |
| Add actual source-data tasks using `multi_select`. | defer_named_follow_up | Runtime proof belongs here; product-route adoption belongs to later check/practice implementation and `GATE-TASK-FAMILY-1`. |
| Implement `step_ordering`, `matching_pairs`, `two_tier_choice`, or `assertion_reason` at the same time. | reject_scope_creep | Those families have separate roadmap rows and must not be hidden inside this implementation sprint. |

## Allowed paths

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`
- `build-scripts/sprints/check-task-family-multi1.js`
- `reports/sprints/TASK-FAMILY-MULTI-1-*`
- `reports/json/task-family-multi1-proof.json`
- `references/data/sprints/TASK-FAMILY-MULTI-1.plan.json`
- `references/data/sprints/TASK-FAMILY-MULTI-1.result.json`
- roadmap, index, dashboard, and repository-map artifacts required for normal
  closure

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- target-exercise registry fields
- candidate storage or candidate writes
- PV projection, PV machine promotion, CP-6/Year-1 promotion, Scale Gate 1,
  or product-authority artifacts
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-CHOICE-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-result.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-MULTI-1-plan.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-baseline.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-multi1-proof.json`
- `reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-MULTI-1-screenshots/`
- `build-scripts/sprints/check-task-family-multi1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-MULTI-1-result.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contract: declare the family, validate option
   ids, require exact-set expected values, require at least two expected values
   and at least one distractor option, reject duplicate expected values, and
   add deterministic order-insensitive set matching.
3. Implement strict response-shape matching: only `{ values: [...] }` may
   match; raw arrays, extra response keys, duplicate selected values, unknown
   option ids, missing required options, or selected distractors fail.
4. Implement optional practice-only partial feedback: when configured, the
   evaluator reports missing required option labels and selected distractor
   labels without diagnostic, mastery, sequencing, or target-proof language.
5. Implement shared rendering and styling: render checkbox-like option buttons,
   independent toggle state, mobile wrapping, dark-mode styling, and stable
   selectors for wrapper response collection.
6. Add wrapper response collection and interaction support for exit-ticket,
   skilltree, and graph task-shell surfaces. Stop if a wrapper requires a
   bespoke feedback or state model instead of the shared task-shell contract.
7. Add focused tests for validation, exact-set matching, order-insensitivity,
   duplicate/unknown/extra response rejection, partial-feedback details,
   rendered markup, wrapper collection, focus selectors, no internal-code
   leakage, and no product-authority flags. The tests and custom checker must
   prove `multi_select` uses distinct helpers and selectors such as
   `data-multi-option-id`; it may not reuse the single-choice
   `.ts-choice.selected` collection path.
8. Add a sprint checker and rendered fixture proof. The fixture is report
   evidence only; it must not become generated lesson output or a product
   route.
9. Run acceptance tests, then prepare lead-review assignment. A lead reviewer
   must inspect the plan, code, tests, proof, boundaries, and rendered fixture
   before closure.
10. Apply any lead-review corrections, run round-2 recheck, then draft result
    and diff-summary artifacts. Only after those pass may roadmap rows be
    marked closed.
11. Refresh maps/indexes, run final validation, fetch/push according to the
    remote-publication rule, and report local and remote commit hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MULTI-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-multi1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-MULTI-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof must include passing validators and tests,
a rendered fixture proving checkbox-like multi-select controls and independent
toggle affordance, wrapper response-collection tests, custom checker output,
lead review round 1, correction log, round-2 recheck, and explicit diff
evidence that no generated lesson output, protected reference data, source
exercise data, target-exercise registry fields, candidate storage, or
product-authority artifacts changed.

The result must name any remaining follow-up work, especially generated-route
rendered screenshots before adoption, `GATE-TASK-FAMILY-1` before target-proof
or product-route reliance, and later implementation of `step_ordering`,
`matching_pairs`, `two_tier_choice`, and `assertion_reason`.

Stop before closure if review artifacts, rendered fixture proof, or the custom
validator are missing.

## Rollback plan

Before commit, revert only the `TASK-FAMILY-MULTI-1` engine/UI/CSS/test
changes, sprint artifacts, checker, proof JSON, fixture, roadmap/index updates,
and generated repository-map/dashboard artifacts. After commit, revert the
sprint commit. Do not revert previous sprint records, unrelated user work,
protected reference data, generated lesson output outside this sprint, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human review gate is required for this implementation sprint. Structural
lead review is required before sprint closure. A future task-family or product
gate must review rendered output before `multi_select` is relied on for
target-equivalent proof, reasoning migration closure, first-three-paragraph
product proof, Scale Gate 1, or product-wide use.

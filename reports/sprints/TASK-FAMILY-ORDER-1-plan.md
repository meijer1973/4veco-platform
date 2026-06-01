# Sprint TASK-FAMILY-ORDER-1: Step-Ordering Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `step_ordering` as a deterministic structured-choice family in the
shared task shell. Students order procedure steps, calculation steps,
reasoning-chain steps, graph-construction steps, or answer-form planning steps.

This sprint may implement shared runtime support and report-fixture proof only.
It does not authorize generated lesson output, new source exercise tasks,
reasoning CSV migration, target-equivalent reliance, diagnostics, adaptive
routing, mastery, sequencing, summative use, PV, Scale Gate 1, or product-wide
use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice task-family contract and
named `TASK-FAMILY-ORDER-1` as the implementation lane for `step_ordering`.
The accepted contract defines:

- family: `step_ordering`;
- student action: order steps in a procedure, calculation, reasoning chain, or
  answer form;
- response shape: `{ "order": ["stepId"] }`;
- expected shape: `{ "kind": "step_ordering", "order": ["stepId"] }`;
- validation owner: shared task shell;
- feedback owner: shared task shell plus domain module;
- target-proof limit: eligible for procedure-control proof only, not enough
  for final-answer proof unless paired with execution tasks.

`STANDARD-EXERCISES-1` identified local reasoning mode 0, `Stappen ordenen`,
as a current private engine pattern that needs shared standard expansion before
`REASON-STD-1` can migrate reasoning tasks into the unified exercise model.

`TASK-FAMILY-CLOZE-TILE-1`, `TASK-FAMILY-SENTENCE-1`,
`TASK-FAMILY-FORMULA-1`, `TASK-FAMILY-CLOZE-1`, and
`TASK-FAMILY-MULTI-1` established the runtime standard for new shared
families: first-class family declaration, strict response-shape matching,
shared UI helpers, wrapper collection support, focused tests, custom sprint
checker, report-fixture proof, and structural lead review.

## Implementation schema

`step_ordering` must use this explicit interaction schema:

```json
{
  "family": "step_ordering",
  "interaction": {
    "stepBankLabel": "Stappen",
    "sequenceLabel": "Juiste volgorde",
    "placeholder": "Zet de stappen in de juiste volgorde.",
    "steps": [
      {
        "id": "verschil",
        "label": "Bereken het verschil",
        "description": "Nieuw min oud",
        "kind": "answer"
      },
      {
        "id": "deel-door-oud",
        "label": "Deel door de oude waarde",
        "kind": "answer"
      },
      {
        "id": "keer-100",
        "label": "Vermenigvuldig met 100%",
        "kind": "answer"
      },
      {
        "id": "deel-door-nieuw",
        "label": "Deel door de nieuwe waarde",
        "kind": "distractor",
        "distractorFor": "deel-door-oud"
      }
    ]
  },
  "expected": {
    "kind": "step_ordering",
    "order": ["verschil", "deel-door-oud", "keer-100"],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.steps` defines the visible step bank. Each step has `id`,
  `label`, `kind`, optional `description`, and optional `distractorFor`.
- `kind` must be `answer` or `distractor`. Neutral step semantics are out of
  scope for this sprint; add them only in a later reviewed expansion if a real
  task needs neutral selectable steps.
- Step ids must be unique, non-empty strings.
- At least two answer steps are required.
- At least one distractor step is required. There is no no-distractor
  exemption in this sprint, including for report fixtures.
- `interaction.placeholder`, `interaction.stepBankLabel`,
  `interaction.sequenceLabel`, and `interaction.separator` are optional
  student-facing strings; `separator` must be non-empty if supplied.
- Rendered output must always include non-empty accessible labels for the step
  bank and ordered sequence, using supplied labels or shared-shell defaults.
- `expected.kind` must be `step_ordering`.
- `expected.order` must contain exactly the expected answer steps, in accepted
  order, with no duplicates and no distractors. It must equal the full set of
  `kind: "answer"` step ids; omitted answer steps, duplicate expected ids,
  unknown ids, and distractor ids must fail validation.
- The student response shape is exactly `{ "order": ["stepId"] }`; raw arrays,
  duplicate ids, non-string ids, unknown ids, missing keys, and extra response
  keys must not match.
- Deterministic matching is order-sensitive: the same ids in the wrong order
  fail.
- `partialFeedback: "practice_only"` is optional and may be used only for
  practice or advisory short-check surfaces. It may report the first misplaced
  step, missing required steps, and selected distractor steps in neutral terms.
  It does not create diagnostics, mastery, sequencing, or target-equivalent
  proof.
- When partial feedback is enabled and the exact order does not match,
  `evaluateTask` must return:

```json
{
  "orderFeedback": {
    "mode": "practice_only",
    "firstMisplaced": {
      "expectedId": "stepId",
      "expectedLabel": "Student label",
      "actualId": "stepId",
      "actualLabel": "Student label"
    },
    "missingRequired": [{ "id": "stepId", "label": "Student label" }],
    "selectedDistractors": [{ "id": "stepId", "label": "Student label" }],
    "correctPrefix": [{ "id": "stepId", "label": "Student label" }]
  }
}
```

The shared UI may render those labels as neutral local feedback. Exact
target-equivalent or generated-route use must omit this mode unless a later
review explicitly accepts it.

## Quality Standard

The quality floor is a specification-accurate shared family that lets
student-facing surfaces ask students to control sequence and procedure without
keeping a private reasoning-engine ordering widget. Passing tests alone is
insufficient: the implementation must prove rendered output exposes a clear
step bank, an ordered construction zone, remove/reorder controls, one feedback
region, optional neutral practice-only order feedback, stable response
collection through existing wrappers, and strict target-proof boundaries.

The sprint fulfils the product specification by adding a stronger alternative
to single-answer recognition for procedure-control tasks. It must support
high-value uses such as percentage-change procedure order, graph-construction
sequence, causal-chain order, and answer-form planning while naming follow-up
work before `step_ordering` is used in product routes, target-equivalent exit
tickets, reasoning migration, or Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before the family is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `step_ordering` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates step ids, expected order, distractor use, and response shape. | Focused Jest and custom sprint checker. | planned |
| Response shape remains exactly `{ order: ["stepId"] }`. | Engine matching and wrapper response collectors reject raw arrays, missing keys, non-string ids, unknown ids, duplicate ids, selected distractors as matches, and extra response keys. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Expected order covers all answer steps exactly. | Validation rejects omitted answer steps, duplicate expected ids, unknown ids, distractor ids, and any expected order that does not equal the full set of answer step ids. | Engine tests and custom checker. | planned |
| Deterministic matching is exact and order-sensitive. | Matching compares the exact ordered id sequence and fails same-set/wrong-order responses. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns first misplaced step, missing required steps, selected distractors, and correct prefix without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses step-ordering controls, not sentence-builder or formula-builder selectors. | `engines/task-shell-ui.js` renders `.ts-step-*` controls with stable `data-step-*` selectors and independent remove/reorder behavior. | UI tests and rendered fixture proof. | planned |
| Feedback, focus, labels, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose button controls, non-empty accessible bank/sequence labels, visible ordered state, one labelled feedback region, and focus plan selectors for step bank and ordered sequence. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-authority artifacts change. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `step_ordering` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Add optional practice-only order-feedback details. | include_now | The accepted contract explicitly names first misplaced or missing prerequisite step feedback. |
| Reuse the builder-style ordered construction affordance while using distinct `.ts-step-*` selectors. | include_now | This keeps the UI familiar without confusing step ordering with sentence or formula building in tests and wrappers. |
| Add product-route reasoning or math tasks using `step_ordering`. | defer_named_follow_up | Runtime proof belongs here; product-route adoption belongs to later reasoning/check/practice implementation and `GATE-TASK-FAMILY-1`. |
| Add neutral selectable steps or no-distractor report fixtures. | defer_named_follow_up | Both create ambiguous scoring semantics; this sprint requires answer/distractor only and at least one distractor. |
| Implement `matching_pairs`, `source_chain_builder`, `two_tier_choice`, or `assertion_reason` at the same time. | reject_scope_creep | Those families have separate roadmap rows and must not be hidden inside this implementation sprint. |

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
- `build-scripts/sprints/check-task-family-order1.js`
- `reports/sprints/TASK-FAMILY-ORDER-1-*`
- `reports/json/task-family-order1-proof.json`
- `references/data/sprints/TASK-FAMILY-ORDER-1.plan.json`
- `references/data/sprints/TASK-FAMILY-ORDER-1.result.json`
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
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-result.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-result.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-baseline.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-order1-proof.json`
- `reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ORDER-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-ORDER-1-screenshots/`
- `build-scripts/sprints/check-task-family-order1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-ORDER-1-result.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contract: declare the family, validate step ids,
   answer/distractor kinds only, expected order, no duplicate expected steps,
   no distractor in the accepted order, full coverage of all answer steps, and
   at least two ordered answer steps plus at least one distractor.
3. Implement strict response-shape matching: only `{ order: [...] }` may match;
   raw arrays, extra response keys, non-string step ids, duplicate selected
   steps, unknown step ids, missing required steps, wrong order, or selected
   distractors fail.
4. Implement optional practice-only order feedback: when configured, the
   evaluator reports first misplaced step, missing required steps, selected
   distractors, and correct prefix as neutral local guidance.
5. Implement shared UI rendering and collection: step bank, ordered sequence,
   add/remove/reorder/clear controls, stable `.ts-step-*` selectors, one
   feedback region, and focus-plan selectors.
6. Update exit-ticket, skilltree, and graph wrappers to collect
   `step_ordering` responses and delegate click handling. Stop if this would
   require generated lesson output or source-data adoption.
7. Add focused engine/UI/wrapper tests, rendered fixture proof, proof JSON, and
   deterministic sprint checker. Fixture proof must cover normal, narrow, and
   dark-theme report-fixture rendering. Generated-route desktop/mobile/dark
   screenshots remain deferred to a later adoption sprint. Run the acceptance
   tests and fix failures.
8. Run lead-review round 1. If it returns REVISE, record the blocking findings,
   correct the implementation, rerun relevant validators, and record the
   correction log before round 2.
9. Close only after round 2 returns PASS or PASS WITH FLAGS, all required files
   exist, acceptance tests pass, roadmaps and GitHub-facing indexes are
   refreshed, and no forbidden output/product authority changed.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ORDER-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ORDER-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-order1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-ORDER-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ORDER-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof requires review, validator, and test
evidence:

- sprint plan, baseline, planning review, and sprint metadata JSON;
- shared task-shell engine/UI/CSS implementation and wrapper collection proof;
- focused Jest coverage for validation, exact matching, strict response shape,
  wrong-order failure, duplicate/non-string/unknown response rejection,
  omitted-answer/distractor-in-expected rejection, practice-only order
  feedback, rendered controls, accessible labels, focus plan, and wrappers;
- custom checker `build-scripts/sprints/check-task-family-order1.js`;
- report fixture HTML and screenshot manifest covering standard, narrow, and
  dark-theme fixture states and clearly stating no generated lesson output was
  changed;
- lead-review assignment, round-1 report, correction log, and round-2 recheck;
- result report, diff summary, result metadata JSON, refreshed roadmaps,
  repository maps, URL index, and dashboard artifacts;
- explicit next action and carried flags before product-route adoption.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-ORDER-1` runtime/test changes,
sprint artifacts, checker, proof JSON, fixture, roadmap/index updates, lesson
roadmap update if present, and generated repository-map/dashboard artifacts
from this sprint. After commit, revert the sprint commit. Do not revert
previous task-family sprint records, source data, generated Book 1 output,
protected references, unrelated user work, or `knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human-review gate is required to close this runtime-only implementation
sprint. Structural lead review is required before closure. A later
`GATE-TASK-FAMILY-1`, `REASON-STD-1`, product adoption sprint, or product gate
must review rendered generated output before `step_ordering` is used for
reasoning migration, check implementation, target-equivalent reliance,
first-three-paragraph proof, Scale Gate 1, or product-wide use.

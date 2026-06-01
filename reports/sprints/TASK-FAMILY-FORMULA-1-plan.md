# Sprint TASK-FAMILY-FORMULA-1: Formula Builder Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `formula_builder` as a deterministic constrained-construction family
in the shared task shell. Students build formulas from symbols, variables,
operators, grouping marks, fractions, multipliers, and notation terms before
they do calculation work.

This sprint may implement shared runtime support and report-fixture proof
only. It does not authorize generated lesson output, new source exercise
tasks, target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CONSTRUCT-1` closed the constrained-construction contract and
named `formula_builder` after `cloze_tile_select` and `sentence_builder`.

The accepted contract defines:

- family: `formula_builder`;
- student action: build a formula from symbols, variables, operators, or
  terms;
- response shape: `{ "tokens": ["tokenId"] }`;
- expected shape:
  `{ "kind": "formula_builder", "tokens": ["tokenId"], "acceptedSequences": [["tokenId"]] }`;
- bank rule: the formula bank distinguishes numerator, denominator,
  operator, parentheses/grouping, multiplier, and notation tokens;
- validation owner: shared task shell, with domain modules allowed to own
  later formula equivalence;
- proof limit: formula selection and construction only; calculation execution
  still needs a calculation-work task.

`TASK-FAMILY-CLOZE-TILE-1` and `TASK-FAMILY-SENTENCE-1` established the
runtime pattern: first-class family declaration, strict response-shape
matching, no-reuse defaults, misconception distractors, shared UI helpers,
wrapper collection support, focused tests, custom checker, report-fixture
proof, and structural lead review.

## Implementation schema

`formula_builder` must use this explicit interaction schema:

```json
{
  "family": "formula_builder",
  "interaction": {
    "tokens": [
      {
        "id": "nieuw-min-oud",
        "label": "nieuw - oud",
        "kind": "answer",
        "category": "numerator"
      },
      {
        "id": "delen-door-oud",
        "label": "/ oud",
        "kind": "answer",
        "category": "denominator"
      },
      {
        "id": "keer-100-procent",
        "label": "x 100%",
        "kind": "answer",
        "category": "multiplier"
      },
      {
        "id": "delen-door-nieuw",
        "label": "/ nieuw",
        "kind": "distractor",
        "category": "denominator",
        "distractorFor": "delen-door-oud"
      }
    ],
    "allowReuse": false,
    "separator": " ",
    "placeholder": "Bouw de formule met de blokken.",
    "tokenBankLabel": "Formuleblokken",
    "sequenceLabel": "Opgebouwde formule"
  },
  "expected": {
    "kind": "formula_builder",
    "tokens": ["nieuw-min-oud", "delen-door-oud", "keer-100-procent"],
    "acceptedSequences": [
      ["nieuw-min-oud", "delen-door-oud", "keer-100-procent"]
    ]
  }
}
```

Rules:

- `interaction.tokens` defines the visible formula-block bank.
- Each token needs `id`, `label`, `kind`, and `category`.
- `kind` is `answer`, `distractor`, or `neutral`.
- `category` is one of `numerator`, `denominator`, `operator`, `grouping`,
  `value`, `variable`, `multiplier`, or `notation`.
- `description` is optional and may give non-answer-revealing context.
- `distractorFor` is optional and must reference another token id when
  present.
- At least one distractor token is required unless a report fixture explicitly
  marks the absence as `fixture_only_no_distractor: true` with rationale.
- `allowReuse` defaults to `false`; duplicate expected token use is invalid
  unless `allowReuse: true` is explicit.
- `expected.tokens` is the canonical reviewed formula sequence.
- `expected.acceptedSequences` is a non-empty list of exact accepted token-id
  sequences and must include `expected.tokens`.
- Student response shape is exactly `{ "tokens": ["tokenId"] }`.

## Quality Standard

The quality floor is a specification-accurate shared family that lets a
student-facing task ask for constrained formula construction without creating
a one-off local widget or treating formula work as passive multiple choice.
Passing tests alone is insufficient: the implementation must prove that
rendered output exposes a formula-block bank, an ordered constructed formula,
remove/reorder affordances, keyboard-focusable controls, a single clear
feedback path, stable wrapper response collection, and no product-authority
language.

The sprint must fulfil the closed construction-family specification and the
product requirement that construction tasks are operation-chain proof types,
not decorative quiz variety. Proof must show the family is safe for later
practice and advisory-check planning while naming follow-up work before it is
used for target-equivalent exit tickets, generated routes, reasoning/math
migration, first-three-paragraph product proof, or Scale Gate 1.

The review gate for this sprint is structural lead review before closure. A
future task-family gate must still inspect rendered generated output before
the family is relied on in product proof or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `formula_builder` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates token ids, token kinds, formula categories, distractor policy, accepted sequences, canonical sequence, and no-reuse default. | Focused Jest and custom sprint checker. | planned |
| Response shape remains `{ tokens: ["tokenId"] }`. | Engine deterministic matching and wrapper response collectors return only the accepted shape. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Formula-bank metadata distinguishes formula roles. | Validator requires `category` and allows only reviewed category values. | Custom checker and lead review. | planned |
| Rendered output uses a construction zone and formula-block bank, not passive choice buttons. | `engines/task-shell-ui.js` renders ordered selected blocks, add/remove/reorder controls, accessible state attributes, and stable selectors. | UI tests and rendered fixture proof. | planned |
| Misconception distractors are part of the task contract. | Validator requires at least one distractor token unless explicitly marked as fixture-only with rationale. | Custom checker and lead review. | planned |
| Feedback, focus, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose labelled controls, block placement/removal/reordering affordances, and one feedback region; focus plan names token and constructed-formula controls. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-authority artifacts change. | Bundle checker, diff review, lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `formula_builder` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Reuse the sequence-builder interaction pattern from `sentence_builder` where clean. | include_now | Formula construction has the same ordered-token response shape, but needs formula-specific selectors, labels, styling, and category validation. |
| Add actual 1.1.2 math-route or exit-ticket tasks using the new family. | defer_named_follow_up | This sprint proves runtime support only; adoption belongs to later check/practice implementation sprints. |
| Implement `cloze_text`, `multi_select`, `source_value_selection`, or `label_placement` at the same time. | reject_scope_creep | Those families have separate roadmap rows and must not be hidden inside this implementation sprint. |

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
- `build-scripts/sprints/check-task-family-formula1.js`
- `reports/sprints/TASK-FAMILY-FORMULA-1-*`
- `reports/json/task-family-formula1-proof.json`
- `references/data/sprints/TASK-FAMILY-FORMULA-1.plan.json`
- `references/data/sprints/TASK-FAMILY-FORMULA-1.result.json`
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
- PV projection, PV machine promotion, Scale Gate 1, or product-authority
  artifacts
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-FORMULA-1-plan.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-baseline.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-formula1-proof.json`
- `reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-FORMULA-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-FORMULA-1-screenshots/`
- `build-scripts/sprints/check-task-family-formula1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-FORMULA-1-result.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, the planning-review record, and the sprint
   plan JSON before code edits. Stop if the plan fails the sprint-plan checker
   or if the planning reviewer returns REVISE.
2. Implement the shared engine contract: declare the family, validate token
   bank ids/kinds/categories, require at least one distractor, validate
   canonical and accepted sequences, reject unknown ids, reject duplicate token
   use when `allowReuse` is false, reject raw-array response matching, and add
   deterministic exact-sequence matching.
3. Implement shared rendering and styling: render a formula construction zone,
   selected formula blocks, add/remove/reorder controls, formula-bank buttons,
   mobile wrapping, dark-mode styling, and stable selectors for wrapper
   response collection.
4. Add wrapper response collection and interaction support for exit-ticket,
   skilltree, and graph task-shell surfaces. Stop if a wrapper requires a
   bespoke feedback or state model instead of the shared task-shell contract.
5. Add keyboard and screen-reader behavior: native buttons select formula
   blocks, selected blocks can be moved left/right or removed, clear controls
   are labelled, and the task keeps one feedback region. Stop if this cannot
   be made accessible without a larger shared-shell redesign.
6. Add focused tests for validation, category requirements, matching,
   missing/extra/wrong-order tokens, unknown ids, default no-reuse behavior,
   rendered markup, wrapper collection, focus selectors, no internal-code
   leakage, and no product authority flags.
7. Add a sprint checker and rendered fixture proof. The fixture is report
   evidence only; it must not become generated lesson output or a product
   route.
8. Run the acceptance tests, then prepare lead-review assignment. A lead
   reviewer must inspect the plan, code, tests, proof, boundaries, and rendered
   fixture before closure.
9. Apply any lead-review corrections, run round-2 recheck, then draft result
   and diff-summary artifacts. Only after those pass may roadmap rows be
   marked closed.
10. Refresh maps/indexes, run final validation, fetch/push according to the
    remote-publication rule, and report local and remote commit hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-formula1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-FORMULA-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof must include passing validators and tests,
a rendered fixture proving formula-bank construction and ordered token
affordance, wrapper response-collection tests, custom checker output, lead
review round 1, correction log, round-2 recheck, and explicit diff evidence
that no generated lesson output, protected reference data, source exercise
data, target-exercise registry fields, candidate storage, or product-authority
artifacts changed.

The result must name any remaining follow-up work, especially adoption in math
practice/short-check surfaces, target-equivalent review before exit-ticket use,
richer formula equivalence outside deterministic sequences, and later
implementation of `cloze_text`, `source_value_selection`, and
`label_placement`.

Stop before closure if review artifacts, rendered fixture proof, or the custom
validator are missing.

## Rollback plan

Before commit, revert only the `TASK-FAMILY-FORMULA-1` engine/UI/CSS/test
changes, sprint artifacts, checker, proof JSON, fixture, roadmap/index updates,
and generated repository-map/dashboard artifacts. After commit, revert the
sprint commit. Do not revert previous sprint records, tracked knowledge
archives, unrelated user work, protected reference data, or generated lesson
output outside this sprint.

## Human review required

No human review gate is required for this implementation sprint. Structural
lead review is required before sprint closure. A future task-family or product
gate must review rendered output before `formula_builder` is relied on for
target-equivalent proof, math-route adoption, first-three-paragraph product
proof, Scale Gate 1, or product-wide use.

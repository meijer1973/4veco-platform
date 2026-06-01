# Sprint TASK-FAMILY-SENTENCE-1: Sentence Builder Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `sentence_builder` as a deterministic constrained-construction
family in the shared task shell. Students build a reasoning sentence or
causal chain by selecting fragments in order, so `leg uit` answers,
index-point explanations, curve-shift reasoning, surplus/welfare reasoning,
and exam-answer phrasing can be practised without falling back to passive
single-choice recognition.

This sprint may implement shared runtime support and report-fixture proof
only. It does not authorize generated lesson output, new source exercise
tasks, target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CONSTRUCT-1` closed the constrained-construction contract and
named `TASK-FAMILY-SENTENCE-1` after `TASK-FAMILY-CLOZE-TILE-1`.

The accepted contract defines:

- family: `sentence_builder`;
- student action: build a reasoning sentence or causal chain from word or
  fragment tokens;
- response shape: `{ "tokens": ["tokenId"] }`;
- expected shape:
  `{ "kind": "sentence_builder", "tokens": ["tokenId"], "acceptedSequences": [["tokenId"]] }`;
- token-bank rule: fragments must force causal or answer-form structure and
  distractors must expose economic misconceptions;
- validation owner: shared task shell, with domain modules allowed to own
  later semantic equivalence;
- proof limit: deterministic sequence construction only, not broad semantic
  answer evaluation.

`TASK-FAMILY-CLOZE-TILE-1` added the first constrained-construction runtime
family and established strict response-shape matching, shared UI helpers,
wrapper collection support, a custom sprint checker, report-fixture proof, and
lead-review closure. `sentence_builder` must follow that pattern while using a
sequence builder rather than inline blanks.

## Implementation schema

`sentence_builder` must use this explicit interaction schema:

```json
{
  "family": "sentence_builder",
  "interaction": {
    "tokens": [
      {
        "id": "prijs-stijgt",
        "label": "De prijs stijgt",
        "kind": "answer"
      },
      {
        "id": "vraag-daalt",
        "label": "de gevraagde hoeveelheid daalt",
        "kind": "answer"
      },
      {
        "id": "vraag-stijgt",
        "label": "de gevraagde hoeveelheid stijgt",
        "kind": "distractor",
        "distractorFor": "vraag-daalt"
      }
    ],
    "allowReuse": false,
    "separator": " -> ",
    "placeholder": "Bouw je redenering met de tegels."
  },
  "expected": {
    "kind": "sentence_builder",
    "tokens": ["prijs-stijgt", "vraag-daalt"],
    "acceptedSequences": [
      ["prijs-stijgt", "vraag-daalt"]
    ]
  }
}
```

Rules:

- `interaction.tokens` defines the visible word or fragment bank.
- Each token needs `id`, `label`, and `kind`.
- `kind` is `answer`, `distractor`, or `neutral`.
- `description` is optional and may give non-answer-revealing context.
- `distractorFor` is optional and must reference another token id when present.
- At least one distractor token is required unless a report fixture explicitly
  marks the absence as `fixture_only_no_distractor: true` with rationale.
- `allowReuse` defaults to `false`; duplicate expected token use is invalid
  unless `allowReuse: true` is explicit.
- `expected.tokens` is the canonical reviewed sequence.
- `expected.acceptedSequences` is a non-empty list of exact accepted token-id
  sequences and must include `expected.tokens`.
- Student response shape is exactly `{ "tokens": ["tokenId"] }`.

## Quality Standard

The quality floor is a specification-accurate shared family that lets a
student-facing task ask for constrained reasoning construction without
creating a one-off local widget. Passing tests alone is insufficient: the
implementation must prove that rendered output exposes a fragment bank, an
ordered constructed answer, remove/reorder affordances, keyboard-focusable
controls, a single clear feedback path, and stable response collection through
existing task-shell wrappers.

The sprint must fulfil the closed construction-family specification and the
product requirement that constrained construction tasks are operation-chain
proof types, not decorative quiz variety. Proof must show the family is safe
for later practice and advisory-check planning while naming follow-up work
before it is used for target-equivalent exit tickets, reasoning migration,
first-three-paragraph product proof, or broad generated output.

The review gate for this sprint is structural lead review before closure. A
future task-family gate must still inspect rendered generated output before
the family is relied on in product proof or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `sentence_builder` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates token ids, token kinds, distractor policy, accepted sequences, canonical sequence, and no-reuse default. | Focused Jest and custom sprint checker. | planned |
| Response shape remains `{ tokens: ["tokenId"] }`. | Engine deterministic matching and wrapper response collectors return only the accepted shape. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Rendered output uses a construction zone and fragment bank, not passive choice buttons. | `engines/task-shell-ui.js` renders ordered selected tokens, add/remove/reorder controls, accessible state attributes, and stable selectors. | UI tests and rendered fixture proof. | planned |
| Misconception distractors are part of the task contract. | Validator requires at least one distractor token unless explicitly marked as fixture-only with rationale. | Custom checker and lead review. | planned |
| Feedback, focus, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose labelled controls, token placement/removal/reordering affordances, and one feedback region; focus plan names token and constructed-answer controls. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, or candidate storage changes. | Bundle checker, diff review, lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `sentence_builder` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Add shared UI helpers for sentence response collection and token movement. | include_now | A small helper reduces wrapper drift and keeps interaction state in the shared task shell. |
| Add actual reasoning CSV or exit-ticket source tasks using the new family. | defer_named_follow_up | This sprint proves runtime support only; adoption belongs to `REASON-STD-1`, check/practice implementation, or a later task-family adoption sprint. |
| Implement `formula_builder`, `source_value_selection`, or `label_placement` at the same time. | reject_scope_creep | Those families have separate roadmap rows and should not be hidden inside this implementation sprint. |

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
- `build-scripts/sprints/check-task-family-sentence1.js`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-*`
- `reports/json/task-family-sentence1-proof.json`
- `references/data/sprints/TASK-FAMILY-SENTENCE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-SENTENCE-1.result.json`
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
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-sentence1-proof.json`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-SENTENCE-1-screenshots/`
- `build-scripts/sprints/check-task-family-sentence1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contract: declare the family, validate token
   bank ids/kinds, require at least one distractor, validate canonical and
   accepted sequences, reject unknown ids, reject duplicate token use when
   `allowReuse` is false, reject raw-array response matching, and add
   deterministic exact-sequence matching.
3. Implement shared rendering and styling: render a construction zone, selected
   token buttons, add/remove/reorder controls, token bank buttons, mobile
   wrapping, dark-mode styling, and stable selectors for wrapper response
   collection.
4. Add wrapper response collection and interaction support for exit-ticket,
   skilltree, and graph task-shell surfaces. Stop if a wrapper requires a
   bespoke feedback or state model instead of the shared task-shell contract.
5. Add keyboard and screen-reader behavior: Enter/Space selects a token,
   selected tokens can be moved left/right or removed, clear controls are
   labelled, and the task keeps one feedback region. Stop if this cannot be
   made accessible without a larger shared-shell redesign.
6. Add focused tests for validation, matching, missing/extra/wrong-order
   tokens, unknown ids, default no-reuse behavior, rendered markup, wrapper
   collection, focus selectors, no internal-code leakage, and no product
   authority flags.
7. Add a sprint checker and rendered fixture proof. The fixture is report
   evidence only; it must not become generated lesson output or a product route.
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
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SENTENCE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-sentence1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-SENTENCE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SENTENCE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof must include passing validators and tests,
a rendered fixture proving fragment-bank construction and ordered token
affordance, wrapper response-collection tests, custom checker output, lead
review round 1, correction log, round-2 recheck, and explicit diff evidence
that no generated lesson output, protected reference data, source exercise
data, target-exercise registry fields, candidate storage, or product-authority
artifacts changed.

The result must name any remaining follow-up work, especially adoption in
reasoning/practice/short-check surfaces, target-equivalent review before
exit-ticket use, richer semantic equivalence outside deterministic sequences,
and later implementation of `formula_builder`, `source_value_selection`, and
`label_placement`.

Stop before closure if review artifacts, rendered fixture proof, or the custom
validator are missing.

## Rollback plan

Before commit, revert only the `TASK-FAMILY-SENTENCE-1` engine/UI/CSS/test
changes, sprint artifacts, checker, proof JSON, fixture, roadmap/index updates,
and generated repository-map/dashboard artifacts. After commit, revert the
sprint commit. Do not revert previous sprint records, unrelated user work,
protected reference data, generated lesson output outside this sprint, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human review gate is required for this implementation sprint. Structural
lead review is required before sprint closure. A future task-family or product
gate must review rendered output before `sentence_builder` is relied on for
target-equivalent proof, reasoning migration closure, first-three-paragraph
product proof, Scale Gate 1, or product-wide use.

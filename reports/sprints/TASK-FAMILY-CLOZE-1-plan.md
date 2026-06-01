# Sprint TASK-FAMILY-CLOZE-1: Cloze Text Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `cloze_text` as a deterministic structured-choice family in the
shared task shell. Students fill short inline text blanks in an economic
sentence, formula statement, source statement, or compact reasoning chain.

This sprint may implement shared runtime support and report-fixture proof only.
It does not authorize generated lesson output, new source exercise tasks,
target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice task-family contract and
named `TASK-FAMILY-CLOZE-1` as the first typed-cloze implementation lane. The
accepted contract defines:

- family: `cloze_text`;
- student action: fill inline blanks in bounded statements;
- response shape: `{ "blanks": { "<blankId>": "text" } }`;
- expected shape:
  `{ "kind": "cloze_text", "blanks": { "<blankId>": { "accepted": ["..."], "requiredTextGroups": [] } } }`;
- validation owner: shared task shell, with domain modules supplying accepted
  values, text groups, and misconception copy;
- feedback owner: shared task shell plus domain module;
- proof limit: bounded completion only, not a full open-explanation substitute.

`TASK-FAMILY-CLOZE-TILE-1`, `TASK-FAMILY-SENTENCE-1`, and
`TASK-FAMILY-FORMULA-1` established strict response-shape matching, shared UI
helpers, wrapper collection support, custom sprint checkers, report-fixture
proof, and lead-review closure for adjacent construction families. `cloze_text`
must follow that standard while using typed input fields instead of selectable
tiles or ordered token construction.

## Implementation schema

`cloze_text` must use this explicit interaction schema:

```json
{
  "family": "cloze_text",
  "interaction": {
    "segments": [
      { "type": "text", "text": "De stijging is " },
      { "type": "blank", "blankId": "indexpunten" },
      { "type": "text", "text": " indexpunten. De procentuele stijging deel je door " },
      { "type": "blank", "blankId": "basis" },
      { "type": "text", "text": "." }
    ],
    "blanks": [
      {
        "id": "indexpunten",
        "label": "Stijging in indexpunten",
        "placeholder": "bijv. 4",
        "inputMode": "decimal"
      },
      {
        "id": "basis",
        "label": "Oude index als basis",
        "placeholder": "bijv. 108",
        "inputMode": "decimal"
      }
    ]
  },
  "expected": {
    "kind": "cloze_text",
    "blanks": {
      "indexpunten": {
        "accepted": ["4", "4 indexpunten"]
      },
      "basis": {
        "accepted": ["108", "index 108"]
      }
    }
  }
}
```

Rules:

- `interaction.segments` defines the inline sentence. Segment type is `text`
  or `blank`; blank segments reference `blankId`.
- `interaction.blanks` defines every blank control, with a student-facing
  label and optional placeholder, input mode, width hint, and autocomplete
  setting.
- Every blank in `interaction.blanks` must appear in `interaction.segments`.
  Every blank segment must reference a known blank.
- `expected.blanks` must include exactly the interaction blank ids.
- Each expected blank must include either non-empty `accepted` values or
  non-empty `requiredTextGroups`.
- `accepted` values use normalized exact text matching. Number-like values may
  be accepted as multiple explicit forms rather than hidden symbolic parsing.
- `requiredTextGroups` is an array of groups; each group contains acceptable
  normalized tokens/phrases for one required idea. All groups must match.
- `rejectText` may be supplied per blank to reject contradictory misconception
  text before accepted or required-group matching succeeds.
- Student response shape is exactly
  `{ "blanks": { "<blankId>": "typed text" } }`; raw maps and extra response
  keys must not match.

## Quality Standard

The quality floor is a specification-accurate shared family that lets
student-facing surfaces ask for bounded text completion without creating a
one-off local widget or pretending to solve full semantic answer evaluation.
Passing tests alone is insufficient: the implementation must prove that the
rendered output exposes inline text blanks, labelled fields, one clear feedback
path, stable response collection through existing wrappers, and strict
target-proof boundaries.

The sprint fulfils the product specification by adding a bridge between passive
recognition and full constructed response. It must support high-value bounded
uses such as index-points-versus-percent, formula substitution, source-value
labels, and cause-step-effect statements while naming follow-up work before
`cloze_text` is used in product routes, target-equivalent exit tickets, or
Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` review must still inspect rendered generated output
before the family is relied on in reasoning migration, check implementation,
first-three-paragraph product proof, or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `cloze_text` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates segments, blank ids, typed blank metadata, accepted values, text groups, and reject text. | Focused Jest and custom sprint checker. | planned |
| Response shape remains exactly `{ blanks: { blankId: text } }`. | Engine matching and wrapper response collectors reject raw maps, missing keys, unknown blank ids, and extra response keys. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Rendered output uses inline typed blanks, not passive choice buttons. | `engines/task-shell-ui.js` renders inline text segments, labelled text inputs, placeholders, input modes, and stable selectors. | UI tests and rendered fixture proof. | planned |
| Bounded text matching is explicit and reviewable. | Validator requires explicit accepted values or required text groups per blank and rejects contradictory `rejectText` before success. | Custom checker, proof JSON, and lead review. | planned |
| Feedback, focus, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose labelled inputs, field selectors, one feedback region, and focus plan selectors for blanks. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-route adoption changes. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `cloze_text` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Support both accepted values and required text groups. | include_now | Typed cloze must cover numeric/value blanks and compact phrase blanks without inventing a broad semantic engine. |
| Add actual 1.1.2 source-data tasks using `cloze_text`. | defer_named_follow_up | Runtime proof belongs here; product-route adoption belongs to later check/practice implementation and `GATE-TASK-FAMILY-1`. |
| Implement `multi_select`, `step_ordering`, `matching_pairs`, or `two_tier_choice` at the same time. | reject_scope_creep | Those families have separate roadmap rows and must not be hidden inside this implementation sprint. |

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
- `build-scripts/sprints/check-task-family-cloze1.js`
- `reports/sprints/TASK-FAMILY-CLOZE-1-*`
- `reports/json/task-family-cloze1-proof.json`
- `references/data/sprints/TASK-FAMILY-CLOZE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-CLOZE-1.result.json`
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
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-CLOZE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-cloze1-proof.json`
- `reports/sprints/TASK-FAMILY-CLOZE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-CLOZE-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-CLOZE-1-screenshots/`
- `build-scripts/sprints/check-task-family-cloze1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-CLOZE-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contract: declare the family, validate segment
   and blank metadata, require exact expected blank coverage, reject invalid
   text-group/reject-text structures, reject raw-map matching and extra
   response keys, and add deterministic per-blank matching.
3. Implement shared rendering and styling: render inline text segments,
   labelled blank inputs, placeholders, input modes, mobile wrapping,
   dark-mode styling, and stable selectors for wrapper response collection.
4. Add wrapper response collection for exit-ticket, skilltree, and graph
   task-shell surfaces. Stop if a wrapper requires a bespoke feedback or state
   model instead of the shared task-shell contract.
5. Add keyboard and screen-reader behavior: blanks are tab-focusable, labels
   are exposed, feedback remains one labelled region, and the focus plan names
   cloze blank selectors. Stop if this cannot be made accessible without a
   larger shared-shell redesign.
6. Add focused tests for validation, accepted values, required text groups,
   reject text, missing/unknown/extra blanks, raw response rejection, rendered
   markup, wrapper collection, focus selectors, no internal-code leakage, and
   no product-authority flags.
7. Add a sprint checker and rendered fixture proof. The fixture is report
   evidence only; it must not become generated lesson output or a product
   route.
8. Run acceptance tests, then prepare lead-review assignment. A lead reviewer
   must inspect the plan, code, tests, proof, boundaries, and rendered fixture
   before closure.
9. Apply any lead-review corrections, run round-2 recheck, then draft result
   and diff-summary artifacts. Only after those pass may roadmap rows be
   marked closed.
10. Refresh maps/indexes, run final validation, fetch/push according to the
    remote-publication rule, and report local and remote commit hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CLOZE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-CLOZE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof must include passing validators and tests,
a rendered fixture proving inline text blanks and typed response affordance,
wrapper response-collection tests, custom checker output, lead review round 1,
correction log, round-2 recheck, and explicit diff evidence that no generated
lesson output, protected reference data, source exercise data, target-exercise
registry fields, candidate storage, or product-authority artifacts changed.

The result must name any remaining follow-up work, especially generated-route
rendered screenshots before adoption, `GATE-TASK-FAMILY-1` before target-proof
or product-route reliance, and later implementation of `multi_select`,
`step_ordering`, `matching_pairs`, `two_tier_choice`, and `assertion_reason`.

Stop before closure if review artifacts, rendered fixture proof, or the custom
validator are missing.

## Rollback plan

Before commit, revert only the `TASK-FAMILY-CLOZE-1` engine/UI/CSS/test
changes, sprint artifacts, checker, proof JSON, fixture, roadmap/index updates,
and generated repository-map/dashboard artifacts. After commit, revert the
sprint commit. Do not revert previous sprint records, unrelated user work,
protected reference data, generated lesson output outside this sprint, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human review gate is required for this implementation sprint. Structural
lead review is required before sprint closure. A future task-family or product
gate must review rendered output before `cloze_text` is relied on for
target-equivalent proof, reasoning migration closure, first-three-paragraph
product proof, Scale Gate 1, or product-wide use.

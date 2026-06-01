# Sprint TASK-FAMILY-CLOZE-TILE-1: Cloze Tile-Select Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `cloze_tile_select` as the first constrained construction family in
the shared task shell. Students fill inline blanks by choosing tiles from a
bank, so index-points-versus-percent, source-label, formula-fill,
graph-reading conclusion, and compact reasoning-completion tasks can be built
without falling back to passive generic multiple choice.

This sprint may implement shared runtime support and fixture proof only. It
does not authorize generated lesson output, new source exit-ticket tasks,
target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CONSTRUCT-1` closed the construction-family contract and named
`TASK-FAMILY-CLOZE-TILE-1` as the first implementation lane. The accepted
contract defines:

- family: `cloze_tile_select`;
- student action: fill inline blanks by choosing tiles from a bank;
- response shape: `{ "blanks": { "<blankId>": "tileId" } }`;
- expected shape: `{ "kind": "cloze_tile_select", "blanks": { "<blankId>": "tileId" } }`;
- tile bank rule: include required tiles and misconception distractors;
- validation owner: shared task shell;
- feedback owner: shared task shell plus domain module;
- proof limit: bounded completion only, not a full explanation substitute.

Current shared task shell support is limited to generic choice, table-value
choice, numeric input, calculation work capture, final answer, unit/notation,
short constructed response, structured short response, graph reading,
point placement, graph-construction substitute, and structured reasoning.
`cloze_tile_select` is not yet declared, validated, rendered, collected, or
tested.

## Implementation schema

`cloze_tile_select` must use this explicit interaction schema:

```json
{
  "family": "cloze_tile_select",
  "interaction": {
    "segments": [
      { "type": "text", "text": "De stijging is " },
      { "type": "blank", "blankId": "indexpunten" },
      { "type": "text", "text": " indexpunten." }
    ],
    "blanks": [
      { "id": "indexpunten", "label": "Stijging in indexpunten" }
    ],
    "tiles": [
      { "id": "vier", "label": "4", "kind": "answer" },
      {
        "id": "vier-procent",
        "label": "4%",
        "kind": "distractor",
        "distractorFor": "indexpunten"
      }
    ],
    "allowReuse": false
  },
  "expected": {
    "kind": "cloze_tile_select",
    "blanks": {
      "indexpunten": "vier"
    }
  }
}
```

Rules:

- `interaction.segments` defines the inline sentence. Segment type is `text`
  or `blank`; blank segments reference `blankId`.
- `interaction.blanks` defines every blank control, with a student-facing
  label and optional placeholder.
- `interaction.tiles` defines selectable tiles. Each tile needs `id`, `label`,
  and `kind`; `kind` is `answer`, `distractor`, or `neutral`.
- At least one distractor tile is required unless a report fixture explicitly
  marks the absence as `fixture_only_no_distractor: true` with rationale.
- `allowReuse` defaults to `false`. Duplicate expected tile use is invalid
  unless `allowReuse: true` is explicit.
- Expected blank ids must match interaction blank ids. Expected tile ids must
  exist in the tile bank.
- Student response shape is exactly
  `{ "blanks": { "<blankId>": "tileId" } }`.

## Quality Standard

The quality floor is a specification-accurate shared family that is usable in
student-facing task-shell surfaces without creating a one-off local widget.
Passing tests alone is insufficient: the implementation must prove that the
rendered output exposes inline blanks, clickable/focusable tiles, a single
clear feedback path, and stable response collection through existing task-shell
wrappers.

The sprint must fulfil the closed construction-family specification and the
product requirement that constrained construction tasks improve the student
action instead of adding quiz variety. Proof must show the family is safe for
future practice and advisory-check planning, while naming follow-up work before
it is used for target-equivalent exit tickets or broad generated output.

The review gate for this sprint is structural lead review before closure. A
future task-family gate must still inspect rendered output before the family is
relied on in product proof or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `cloze_tile_select` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates interaction segments, blank ids, tile ids, distractor policy, and no-reuse default. | Focused Jest and custom sprint checker. | planned |
| Response shape remains `{ blanks: { blankId: tileId } }`. | Engine deterministic matching and wrapper response collectors return the accepted shape. | Engine tests plus exit-ticket, skilltree, and graph wrapper tests or static checks. | planned |
| Rendered output uses inline blanks and selectable tiles, not passive choice buttons. | `engines/task-shell-ui.js` renders cloze segments, blank targets, tile bank buttons, and accessible state attributes. | UI tests and rendered fixture proof. | planned |
| Misconception distractors are part of the task contract. | Validator requires at least one extra tile beyond expected tiles unless explicitly marked as fixture-only with rationale. | Custom checker and lead review. | planned |
| Feedback, focus, and keyboard behavior remain shared-shell owned. | CSS and UI markup expose labelled controls, tile selection, blank placement/removal affordance, and one feedback region; focus plan names blank/tile controls. | UI tests and rendered fixture proof. | planned |
| Product authority boundaries stay intact. | No source exit-ticket data, generated lesson output, protected references, target-exercise registry, or candidate storage changes. | Bundle checker, diff review, lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add `cloze_tile_select` to all shared-shell consuming wrappers in this sprint. | include_now | Engine-only support would leave the family unusable in exit-ticket, math, and graph task-shell surfaces. |
| Add a shared helper for cloze tile selection if duplication becomes visible. | include_now | A small helper is acceptable if it reduces wrapper drift without over-abstracting. |
| Add actual 1.1.2 or 1.1.3 source-data tasks using the new family. | defer_named_follow_up | This sprint proves runtime support only; task adoption belongs to later check/practice implementation sprints. |
| Implement `cloze_text`, `sentence_builder`, or `formula_builder` at the same time. | reject_scope_creep | Those families have separate roadmap rows and should not be hidden inside this first implementation sprint. |

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
- `build-scripts/sprints/check-task-family-cloze-tile1.js`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-*`
- `reports/json/task-family-cloze-tile1-proof.json`
- `references/data/sprints/TASK-FAMILY-CLOZE-TILE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-CLOZE-TILE-1.result.json`
- roadmap, index, dashboard, and repository-map artifacts required for normal closure

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- target-exercise registry fields
- candidate storage or candidate writes
- PV projection, PV machine promotion, Scale Gate 1, or product-authority artifacts
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-result.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-cloze-tile1-proof.json`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-screenshot-manifest.md`
- optional fixture screenshots under `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-screenshots/`
- `build-scripts/sprints/check-task-family-cloze-tile1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contract:
   declare the family, validate segments/blanks/tiles, require expected blanks
   to match interaction blanks, require expected tile ids to exist, default
   `allowReuse` to false, reject duplicate blank ids, duplicate tile ids,
   unknown blank/tile references, missing required tiles, invalid duplicate tile
   use, and empty/missing responses, and add deterministic matching.
3. Implement shared rendering and styling:
   render inline text segments, blank targets, tile bank buttons, accessible
   state attributes, a clear/remove affordance for filled blanks, mobile
   wrapping, dark-mode styling, and stable selectors for wrapper response
   collection.
4. Add wrapper response collection and interaction support for exit-ticket,
   skilltree, and graph task-shell surfaces. Stop if a wrapper requires a
   bespoke feedback or state model instead of the shared task-shell contract.
5. Add keyboard and screen-reader behavior:
   Enter/Space selects a tile, Enter/Space on a blank places the selected tile,
   a filled blank can be removed or replaced, blank controls and the tile bank
   have labels, and the task keeps one feedback region. Stop if this cannot be
   made accessible without a larger shared-shell redesign.
6. Add focused tests for validation, matching, missing blanks, unknown ids,
   default no-reuse behavior, rendered markup, wrapper collection, focus
   selectors, no internal-code leakage, and no product authority flags.
7. Add a sprint checker and rendered fixture proof. The fixture is report
   evidence only; it must not become generated lesson output or a product route.
8. Run the acceptance tests, then prepare lead-review assignment. A lead
   reviewer must inspect the plan, code, tests, proof, boundaries, and rendered
   fixture before closure.
9. Apply any lead-review corrections, run round-2 recheck, then draft result
   and diff-summary artifacts. Only after those pass may roadmap rows be marked
   closed.
10. Refresh maps/indexes, run final validation, fetch/push according to the
   remote-publication rule, and report local and remote commit hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-TILE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze-tile1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-TILE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure proof must include passing validators and tests,
a rendered fixture proving inline blanks and tile-bank affordance, wrapper
response-collection tests, custom checker output, lead-review round 1,
correction log, round-2 recheck, and explicit diff evidence that no generated
lesson output, protected reference data, source exit-ticket data,
target-exercise registry fields, candidate storage, or product-authority
artifacts changed.

The result must name any remaining follow-up work, especially adoption in
practice/short-check surfaces, target-equivalent review before exit-ticket
use, and later implementation of `sentence_builder` and `formula_builder`.

Stop before closure if review artifacts, rendered fixture proof, or the custom
validator are missing.

## Rollback plan

Before commit, revert only the `TASK-FAMILY-CLOZE-TILE-1` engine/UI/CSS/test
changes, sprint artifacts, checker, proof JSON, fixture, roadmap/index updates,
and generated repository-map/dashboard artifacts. After commit, revert the
sprint commit. Do not revert previous sprint records, unrelated user work,
protected reference data, generated lesson output outside this sprint, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human review gate is required for this implementation sprint. Structural
lead review is required before sprint closure. A future task-family or product
gate must review rendered output before `cloze_tile_select` is relied on for
target-equivalent proof, first-three-paragraph product proof, Scale Gate 1, or
product-wide use.

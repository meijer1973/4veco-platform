# Sprint TASK-FAMILY-SOURCE-1: Source Value And Chain Builder Implementation

Generated: 2026-06-01

## Goal

Implement `source_value_selection` and `source_chain_builder` as deterministic
constrained-construction families in the shared task shell.

Students must be able to:

- select multiple source, table, or graph values and assign roles such as old,
  new, x, y, price, quantity, cause, effect, or evidence;
- build an ordered source -> value -> operation -> answer -> conclusion chain
  from source/action nodes.

This sprint may implement shared runtime support and report-fixture proof only.
It does not authorize generated lesson output, new source exercise tasks,
target-equivalent reliance, diagnostics, adaptive routing, mastery, sequencing,
summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CONSTRUCT-1` closed the constrained-construction contract and
named `TASK-FAMILY-SOURCE-1` as the implementation lane for
`source_value_selection` and `source_chain_builder`.

The accepted contract defines:

- `source_value_selection`: response shape
  `{ "selections": [{ "valueId": "id", "role": "old" }] }`;
- `source_chain_builder`: response shape `{ "chain": ["nodeId"] }`;
- validation owner: shared task shell plus graph/source/domain module;
- feedback owner: shared task shell plus graph/source/domain module;
- target-proof limit: source selection proves only source-selection sub-proof,
  and source-chain construction proves planning/control only unless paired with
  the required operation execution tasks.

`STANDARD-EXERCISES-1`, `GAME-ARCH-2`, and the stable product specifications
all point to the same need: graph/table/source work must not collapse into a
single generic choice task. Students need visible source labels, values, units,
periods, role assignment, operation selection, answer, and conclusion where the
target exercise requires that chain.

Prior runtime sprints established the implementation standard for new shared
families: first-class family declaration, strict response-shape matching,
shared UI helpers, wrapper collection support, focused tests, custom sprint
checker, report-fixture proof, and structural lead review.

## Implementation schema

`source_value_selection` must use this interaction schema:

```json
{
  "family": "source_value_selection",
  "interaction": {
    "valueBankLabel": "Bronwaarden",
    "roleLabel": "Rol",
    "values": [
      {
        "id": "prijs-oud",
        "label": "EUR 800",
        "sourceLabel": "oude prijs",
        "unit": "euro",
        "period": "oud",
        "kind": "answer"
      },
      {
        "id": "prijs-nieuw",
        "label": "EUR 920",
        "sourceLabel": "nieuwe prijs",
        "unit": "euro",
        "period": "nieuw",
        "kind": "answer"
      },
      {
        "id": "omzet",
        "label": "EUR 1.200",
        "sourceLabel": "omzet",
        "kind": "distractor",
        "distractorFor": "prijs-nieuw"
      }
    ],
    "roles": [
      { "id": "old", "label": "oude waarde" },
      { "id": "new", "label": "nieuwe waarde" }
    ]
  },
  "expected": {
    "kind": "source_value_selection",
    "selections": [
      { "valueId": "prijs-oud", "role": "old" },
      { "valueId": "prijs-nieuw", "role": "new" }
    ],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.values` defines the visible source-value bank. Each value has
  `id`, `label`, `kind`, and optional `description`, `sourceLabel`, `unit`,
  `period`, and `distractorFor`.
- `kind` must be `answer` or `distractor`.
- Value ids must be unique, non-empty strings.
- At least two answer values and at least one distractor value are required.
- `interaction.roles` defines the allowed role list. Each role has `id`,
  `label`, and optional `description`. Role ids must be unique, non-empty
  strings.
- Rendered output must always include non-empty accessible labels for the value
  bank and role controls, using supplied labels or shared-shell defaults.
- `expected.kind` must be `source_value_selection`.
- `expected.selections` must contain exact value-role pairs. Every expected
  value must exist, be an answer value, and use a known role. Expected
  selections must include every `kind: "answer"` source value exactly once.
  Omitted answer values, duplicate expected values, or duplicate expected pairs
  must fail validation.
- The student response shape is exactly
  `{ "selections": [{ "valueId": "id", "role": "roleId" }] }`; raw arrays,
  array-with-`selections`, non-object entries, non-string ids, duplicate
  selected values, unknown values, unknown roles, missing keys, and extra
  response keys must not match.
- Deterministic matching is order-insensitive over the exact value-role pair
  set.
- `partialFeedback: "practice_only"` is optional and may report missing
  required values, wrong roles, selected distractors, and correct selections in
  neutral terms. It does not create diagnostics, mastery, sequencing, or
  target-equivalent proof.

`source_chain_builder` must use this interaction schema:

```json
{
  "family": "source_chain_builder",
  "interaction": {
    "nodeBankLabel": "Bronketen",
    "sequenceLabel": "Opgebouwde keten",
    "nodes": [
      { "id": "bron", "label": "Lees de tabelwaarde", "kind": "answer", "nodeRole": "source" },
      { "id": "waarde", "label": "Gebruik EUR 920 als nieuwe prijs", "kind": "answer", "nodeRole": "value" },
      { "id": "bewerking", "label": "Bereken nieuw min oud", "kind": "answer", "nodeRole": "operation" },
      { "id": "antwoord", "label": "Noteer 15%", "kind": "answer", "nodeRole": "answer" },
      { "id": "conclusie", "label": "Concludeer dat de prijs steeg", "kind": "answer", "nodeRole": "conclusion" },
      { "id": "deel-door-nieuw", "label": "Deel door de nieuwe prijs", "kind": "distractor", "nodeRole": "operation" }
    ]
  },
  "expected": {
    "kind": "source_chain_builder",
    "chain": ["bron", "waarde", "bewerking", "antwoord", "conclusie"],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.nodes` defines the visible source-chain node bank. Each node has
  `id`, `label`, `kind`, `nodeRole`, optional `description`, and optional
  `distractorFor`.
- `kind` must be `answer` or `distractor`.
- `nodeRole` must be one of `source`, `value`, `operation`, `answer`, or
  `conclusion`.
- Node ids must be unique, non-empty strings.
- At least one answer node for each required node role is required.
- At least one distractor node is required.
- `expected.kind` must be `source_chain_builder`.
- `expected.chain` must contain every answer node exactly once, in accepted
  order, and may not contain distractors, unknown ids, or duplicate ids.
- The student response shape is exactly `{ "chain": ["nodeId"] }`; raw arrays,
  array-with-`chain`, duplicate ids, non-string ids, unknown ids, missing keys,
  and extra response keys must not match.
- Deterministic matching is order-sensitive.
- `partialFeedback: "practice_only"` is optional and may report first
  misplaced node, missing required nodes, selected distractors, correct prefix,
  and missing required node roles. It does not create diagnostics, mastery,
  sequencing, or target-equivalent proof.

## Quality Standard

The quality floor is a specification-accurate shared implementation that lets
student-facing surfaces ask students to use source information without turning
source work into passive recognition. Passing tests alone is insufficient: the
implementation must prove rendered output exposes source labels, values, units
or periods where supplied, role assignment controls, a chain-building bank,
remove/reorder controls, one feedback region, optional neutral practice-only
feedback, stable wrapper collection, and strict product-boundary flags.

The sprint fulfils the product specification by adding a middle layer between
single-value table selection and full open source-based answers. It supports
high-value graph/table and source tasks while naming follow-up work before
these families are used in product routes, target-equivalent exit tickets,
reasoning migration, or Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before either family is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `source_value_selection` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates source values, roles, expected selections, distractor use, and response shape. | Focused Jest and custom sprint checker. | planned |
| `source_chain_builder` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates nodes, node roles, expected chain, distractor use, and response shape. | Focused Jest and custom sprint checker. | planned |
| Source-value matching is exact value-role set matching. | Engine matching rejects raw arrays, array-with-`selections`, missing keys, non-string ids, unknown values/roles, duplicate selected values, wrong roles, selected distractors as matches, and extra response keys. | Engine tests plus wrapper tests or static checks. | planned |
| Source-chain matching is exact ordered chain matching. | Engine matching rejects raw arrays, array-with-`chain`, missing keys, non-string ids, unknown nodes, duplicate selected nodes, wrong order, selected distractors as matches, and extra response keys. | Engine tests and custom checker. | planned |
| Expected selections and chains stay aligned with answer bank semantics. | Validation rejects expected distractors, omitted answer values, omitted answer nodes in chains, duplicate expected values/nodes, unknown expected ids, and missing required source-chain node roles. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns missing values, wrong roles, selected distractors, correct selections, first misplaced chain node, missing nodes, missing node roles, and correct prefix without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses source-specific controls. | `engines/task-shell-ui.js` renders `.ts-source-*` controls with stable `data-source-*` selectors, not recycled sentence/step/formula selectors. | UI tests and rendered fixture proof. | planned |
| Wrapper collection is shared-shell owned. | Exit-ticket, skilltree, and graph wrappers collect source-value and source-chain responses through `TaskShellUI` helpers and delegate click handling. | Wrapper tests/static checks and custom checker. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-authority artifacts change. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Implement both `source_value_selection` and `source_chain_builder` in this sprint. | include_now | The roadmap row explicitly owns both source families, and they share source-bank/chain proof concerns. |
| Require at least one distractor in both families. | include_now | Without distractors the task becomes a mechanical click-through proof and hides misconception evidence. |
| Add practice-only feedback for missing values, wrong roles, and chain order. | include_now | The accepted contract names neutral feedback as a shared-shell responsibility for practice/advisory surfaces. |
| Add source-value/source-chain collection to exit-ticket, skilltree, and graph wrappers. | include_now | Engine-only support would leave the families unusable in the shared-shell surfaces that need them. |
| Implement generated 1.1.3 graph/table exit-ticket tasks using these families. | defer_named_follow_up | Product-route adoption and target-equivalent graph proof belong to later check/graph sprints and `GATE-TASK-FAMILY-1`. |
| Build a visual graph/table value picker or drag-and-drop source labels. | defer_named_follow_up | This sprint can render structured source banks; richer visual placement belongs to `TASK-FAMILY-LABEL-1` or graph-specific adoption work. |
| Add diagnostics for common wrong source roles. | reject_scope_creep | Feedback must remain local and neutral, with no diagnostic, mastery, or sequencing authority. |

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
- `build-scripts/sprints/check-task-family-source1.js`
- `reports/sprints/TASK-FAMILY-SOURCE-1-*`
- `reports/json/task-family-source1-proof.json`
- `references/data/sprints/TASK-FAMILY-SOURCE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-SOURCE-1.result.json`
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

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-result.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-result.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-result.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current task-shell engine, UI, CSS, wrappers, and tests

## Outputs

- `reports/sprints/TASK-FAMILY-SOURCE-1-plan.md`
- `reports/sprints/TASK-FAMILY-SOURCE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-SOURCE-1-planning-review.md`
- updated shared task-shell engine/UI/CSS and wrapper response collection
- updated focused Jest tests
- `reports/json/task-family-source1-proof.json`
- `reports/sprints/TASK-FAMILY-SOURCE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-SOURCE-1-screenshot-manifest.md`
- `build-scripts/sprints/check-task-family-source1.js`
- lead-review assignment, round-1 report, correction log, and round-2 recheck
- `reports/sprints/TASK-FAMILY-SOURCE-1-result.md`
- `reports/sprints/TASK-FAMILY-SOURCE-1-diff-summary.md`
- sprint plan/result metadata JSON

## Operationalized sprint procedure

1. Record this plan, the baseline, and the sprint plan JSON before code edits.
   Stop if the plan fails the sprint-plan checker or if the planning reviewer
   returns REVISE.
2. Implement the shared engine contracts: declare both families; validate
   source values, roles, source-chain nodes, answer/distractor kinds, required
   distractors, expected selections, expected chain, and required chain roles.
3. Implement strict response-shape matching: only
   `{ selections: [{ valueId, role }] }` may match source-value tasks and only
   `{ chain: [...] }` may match source-chain tasks. Raw arrays, array-with-key
   objects, missing keys, extra keys, non-string ids, unknown ids, duplicate
   selected values/nodes, wrong roles, wrong order, and selected distractors
   must fail.
4. Implement optional practice-only feedback for both families in neutral
   local terms.
5. Implement shared UI rendering and collection: source value bank with role
   assignment controls; source-chain node bank with ordered sequence,
   add/remove/reorder/clear controls; stable `.ts-source-*` selectors; one
   feedback region; focus-plan selectors.
6. Update exit-ticket, skilltree, and graph wrappers to collect both families
   and delegate click handling. Stop if this would require generated lesson
   output or source-data adoption.
7. Add focused engine/UI/wrapper tests, rendered fixture proof, proof JSON, and
   deterministic sprint checker. Fixture proof must cover standard, narrow,
   dark-theme, and after-click report-fixture states. Generated-route
   desktop/mobile/dark screenshots remain deferred to a later adoption sprint.
8. Run lead-review round 1. If it returns REVISE, record the blocking findings,
   correct the implementation, rerun relevant validators, and record the
   correction log before round 2.
9. Close only after round 2 returns PASS or PASS WITH FLAGS, all required files
   exist, acceptance tests pass, roadmaps and GitHub-facing indexes are
   refreshed, and no forbidden output/product authority changed.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SOURCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SOURCE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-source1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-SOURCE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SOURCE-1 --complete
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
  order-insensitive source-value matching, order-sensitive source-chain
  matching, duplicate/non-string/unknown response rejection, expected
  distractor rejection, omitted source-value rejection, omitted-answer-chain
  rejection, practice-only feedback, rendered controls, accessible labels,
  focus plan, and wrappers;
- custom checker `build-scripts/sprints/check-task-family-source1.js`;
- report fixture HTML and screenshot manifest covering standard, narrow,
  dark-theme, and after-click fixture states and clearly stating no generated
  lesson output was changed;
- lead-review assignment, round-1 report, correction log, and round-2 recheck;
- result report, diff summary, result metadata JSON, refreshed roadmaps,
  repository maps, URL index, and dashboard artifacts;
- explicit next action and carried flags before product-route adoption.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-SOURCE-1` runtime/test changes,
sprint artifacts, checker, proof JSON, fixture, roadmap/index updates, lesson
roadmap update if present, and generated repository-map/dashboard artifacts
from this sprint. After commit, revert the sprint commit. Do not revert
previous task-family sprint records, source data, generated Book 1 output,
protected references, unrelated user work, or `knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human-review gate is required to close this runtime-only implementation
sprint. Structural lead review is required before closure. A later
`GATE-TASK-FAMILY-1`, `REASON-STD-1`, product adoption sprint, or product gate
must review rendered generated output before `source_value_selection` or
`source_chain_builder` is used for reasoning migration, graph/table check
implementation, target-equivalent reliance, first-three-paragraph proof, Scale
Gate 1, or product-wide use.

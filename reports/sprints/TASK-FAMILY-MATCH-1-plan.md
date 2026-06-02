# Sprint TASK-FAMILY-MATCH-1: Matching-Pairs Task-Family Implementation

Generated: 2026-06-02

## Goal

Implement `matching_pairs` as a deterministic structured-choice family in the
shared task shell.

Students must be able to pair left-bank items with right-bank meanings,
labels, formula parts, graph parts, source labels, or economic events through
visible keyboard-operable controls. The family is meant for
concept-definition, graph-element-meaning, source-value-label,
formula-component-interpretation, and event-to-shift practice.

This sprint may implement shared runtime support and report-fixture proof only.
It does not allow generated lesson output, source exercise adoption,
target-equivalent reliance, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice contract and named
`TASK-FAMILY-MATCH-1` as the implementation lane for `matching_pairs`.

The accepted contract defines:

- response shape: `{ "pairs": [["leftId", "rightId"]] }`;
- expected shape: `{ "kind": "matching_pairs", "pairs": [["leftId", "rightId"]] }`;
- validation owner: shared task shell;
- feedback owner: shared task shell;
- focus/keyboard expectation: keyboard-operable pair selection;
- target-proof limit: mostly practice/advisory unless paired with application
  context or richer tasks.

The current product proof track adds structured task families only as reviewed
student actions, not quiz variety. `matching_pairs` is therefore a constrained
pair-construction action, not a replacement for calculation, graph/table,
source-chain, or constructed-response proof.

Prior runtime-family sprints established the implementation standard:
first-class family declaration, strict response-shape matching, shared UI
helpers, wrapper collection support, focused tests, custom sprint checker,
report-fixture proof, and structural lead review before closure.

The old exit-ticket game archive remains separately tracked as
`knowledge/exit-ticket-game-1.1.1.zip`. This sprint must not modify it.

## Implementation Schema

`matching_pairs` must use this interaction schema:

```json
{
  "family": "matching_pairs",
  "interaction": {
    "leftBankLabel": "Begrippen",
    "rightBankLabel": "Betekenissen",
    "pairLabel": "Gemaakte koppels",
    "leftItems": [
      { "id": "schaarste", "label": "Schaarste", "kind": "answer", "description": "Begrip over beperkte middelen." },
      { "id": "alternatieve-kosten", "label": "Alternatieve kosten", "kind": "answer", "description": "Begrip over het beste niet-gekozen alternatief." },
      { "id": "winst", "label": "Winst", "kind": "distractor", "description": "Afleider buiten deze begrippenkoppeling.", "distractorFor": "schaarste" }
    ],
    "rightItems": [
      { "id": "behoeften-middelen", "label": "Behoeften zijn groter dan middelen", "kind": "answer", "description": "Betekenis van schaarste." },
      { "id": "beste-alternatief", "label": "Beste niet-gekozen alternatief", "kind": "answer", "description": "Betekenis van alternatieve kosten." },
      { "id": "opbrengst-kosten", "label": "Opbrengst min kosten", "kind": "distractor", "description": "Afleider die bij winst hoort.", "distractorFor": "behoeften-middelen" }
    ]
  },
  "expected": {
    "kind": "matching_pairs",
    "pairs": [
      ["schaarste", "behoeften-middelen"],
      ["alternatieve-kosten", "beste-alternatief"]
    ],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.leftItems` and `interaction.rightItems` define visible banks.
  Each item has `id`, `label`, `kind`, and `description`. Distractor items must
  also include `distractorFor` pointing to a known answer item in the same
  bank.
- `kind` must be `answer` or `distractor`.
- Item ids must be unique within each bank and must be non-empty strings.
- At least two answer items and one distractor item are required in each bank.
- Every item must have a non-empty `description` so rendered controls expose
  accessible context, not only terse visible labels.
- This sprint supports one-to-one matching only. Every expected left answer
  item and every expected right answer item must appear exactly once.
- `expected.kind` must be `matching_pairs`.
- `expected.pairs` must contain arrays of exactly two strings:
  `[leftId, rightId]`.
- Every expected left id must exist, be an answer left item, and appear exactly
  once. Every expected right id must exist, be an answer right item, and appear
  exactly once.
- The student response shape is exactly
  `{ "pairs": [["leftId", "rightId"]] }`; raw arrays, arrays with an attached
  `pairs` property, object pair entries, non-string ids, duplicate selected
  left ids, duplicate selected right ids, unknown ids, selected distractors,
  missing keys, and extra response keys must not match.
- Deterministic matching is order-insensitive over the exact left-right pair
  set.
- `partialFeedback: "practice_only"` is optional and may report missing left
  items, missing right items, misplaced pairs, selected left distractors,
  selected right distractors, and correct pairs in neutral terms. It does not
  create diagnostics, mastery, sequencing, or target-equivalent proof.

## Quality Standard

The quality floor is a specification-accurate shared implementation that lets
student-facing surfaces ask students to build pair relationships without
falling back to passive single-answer recognition. Passing tests alone is
insufficient: the implementation must prove rendered output exposes both item
banks, selected pair summaries, clear/remove controls, one feedback region,
practice-only feedback, stable wrapper collection, keyboard-operable controls,
narrow/mobile fixture behavior, dark-mode-compatible styling, and strict
response-shape proof.

This sprint fulfils the product specification by adding a constrained pairing
task family that can later support concept, graph, source, formula, and event
practice. It names follow-up work before `matching_pairs` is used in generated
product routes, target-equivalent exit tickets, reasoning migration, or Scale
Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before `matching_pairs` is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `matching_pairs` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates left/right banks, expected pairs, distractors, and strict response shapes. | Focused Jest and custom sprint checker. | planned |
| Matching is exact left-right set matching. | Engine matching rejects raw arrays, array-with-`pairs`, object pair entries, pair arrays with wrong length, missing keys, non-string ids, unknown ids, selected distractors, duplicate left/right selections, wrong pairs, and extra keys. | Engine tests plus custom checker. | planned |
| Expected pairs stay aligned with answer-bank semantics. | Validation rejects expected distractor ids, unknown ids, omitted answer left/right items, duplicate expected left/right ids, and many-to-one configurations. | Engine tests and custom checker. | planned |
| Accessible descriptions and distractor intent are concrete. | Validation rejects items without descriptions and rejects distractors without same-bank `distractorFor` pointing to an answer item. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns missing left/right items, misplaced pairs, selected distractors, and correct pairs without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses matching-specific controls. | `engines/task-shell-ui.js` renders `.ts-match-*` controls with stable `data-match-*` selectors, not recycled step/source/label selectors. | UI tests and rendered fixture proof. | planned |
| Keyboard/focus behavior is explicit. | Focus plan includes left-bank controls, right-bank controls, and pair summary; UI uses buttons and remove controls rather than pointer-only drag. | Focus-plan tests, checker, and fixture proof. | planned |
| Wrapper collection is shared-shell owned. | Exit-ticket, skilltree, and graph wrappers collect `matching_pairs` responses through `TaskShellUI` helpers and delegate click handling. | Wrapper tests/static checks and custom checker. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, product route, or old exit-ticket game archive changes. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Implement pointer drag-and-drop. | defer | Keyboard proof is the immediate requirement; button-based pick/pair/remove is accessible and deterministic. |
| Support many-to-one matching. | defer_named_follow_up | The contract permits configured many-to-one, but one-to-one is the safer first runtime lane and matches the current priority use cases. |
| Require distractors in both banks. | include_now | Matching without distractors is too close to automatic pairing and weakens the student action. |
| Include accessible item descriptions. | include_now | Pair labels alone may be terse; descriptions support screen-reader and review proof. |
| Allow partial matching for exit tickets. | reject_now | Partial feedback is practice/advisory only. Exit-ticket proof must remain exact unless a later gate reviews a domain evaluator. |
| Generated-route screenshots in this runtime sprint. | defer_named_follow_up | This sprint produces report-fixture proof only; product-route adoption and generated screenshots belong to a later adoption sprint and `GATE-TASK-FAMILY-1`. |
| Treat matching as target-equivalent proof by itself. | reject_scope_creep | Matching pairs are mostly practice/advisory unless paired with application context or richer operation tasks. |

## Allowed paths

Allowed runtime paths:

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

Allowed sprint/proof/checker paths:

- `build-scripts/sprints/check-task-family-match1.js`
- `reports/sprints/TASK-FAMILY-MATCH-1-*`
- `reports/json/task-family-match1-proof.json`
- `references/data/sprints/TASK-FAMILY-MATCH-1.plan.json`
- `references/data/sprints/TASK-FAMILY-MATCH-1.result.json`

Allowed closure/index paths after implementation and review:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-*.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/url-index.md`
- `reports/internal-dashboard/*`
- `../4veco-lessen/lessen-team-roadmap.md`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `knowledge/exit-ticket-game-1.1.1.zip`
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

## Inputs

Required inputs:

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-LABEL-1-result.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current shared task-shell runtime, UI, CSS, wrapper, and focused-test files.

## Outputs

Required outputs:

- first-class `matching_pairs` runtime, UI, CSS, wrapper, and test support;
- deterministic sprint checker;
- proof JSON;
- rendered fixture and screenshot manifest with standard, narrow/mobile,
  dark-mode, and after-click states;
- sprint result JSON and markdown result;
- diff summary;
- structural lead-review assignment, round 1, corrections if needed, and
  round 2;
- updated roadmap/index/dashboard artifacts only at closure.

## Proof Required to Close

The sprint may close only after producing:

- updated shared task-shell engine support;
- updated shared task-shell UI and CSS support;
- wrapper collection/click handling for exit-ticket, skilltree, and graph
  surfaces;
- focused Jest tests for engine, UI, and wrappers;
- a custom `TASK-FAMILY-MATCH-1` checker;
- proof JSON;
- rendered fixture proof including standard, narrow/mobile, dark-mode, and
  after-click states;
- planning review;
- structural lead-review assignment, round 1, corrections if needed, and
  round 2;
- result and diff summary artifacts;
- roadmap/index/dashboard refresh if the sprint closes.

## Planned Files

Sprint artifacts:

- `reports/sprints/TASK-FAMILY-MATCH-1-plan.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-baseline.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-MATCH-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-result.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-diff-summary.md`
- `reports/json/task-family-match1-proof.json`
- `references/data/sprints/TASK-FAMILY-MATCH-1.plan.json`
- `references/data/sprints/TASK-FAMILY-MATCH-1.result.json`

Runtime and tests:

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
- `build-scripts/sprints/check-task-family-match1.js`

Roadmap and index artifacts may be updated only during closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the sprint-plan and planned
   bundle checkers. Stop if the plan does not pass.
2. Ask the planning/review agent to inspect the plan, baseline, plan JSON,
   accepted structured-choice contract, and prior runtime sprint pattern. Stop
   and revise if the planning review returns blockers.
3. Implement the shared-shell runtime: family declaration, interaction
   validation, expected validation, strict response-shape matching,
   practice-only feedback, and focus plan.
4. Implement shared UI/CSS support using matching-specific selectors and
   keyboard-operable pick/pair/remove controls. Stop if the implementation
   requires pointer-only drag-and-drop.
5. Integrate wrapper collection and click handling for exit-ticket, skilltree,
   and graph surfaces through `TaskShellUI` helpers.
6. Add focused tests, sprint checker, proof JSON, rendered fixture, and
   screenshot manifest. Run acceptance validators before lead review.
7. Assign structural lead review, record round 1, make corrections if needed,
   and record round 2. Do not close the sprint until round 2 passes.
8. Update roadmap, version index, URL index, GitHub-facing maps, and internal
   dashboard only after implementation and lead review are accepted.
9. Run the final validation stack. Commit and push only after `git fetch
   --prune origin` confirms the remote branch is current or the divergence is
   resolved.

## Acceptance tests

Run during implementation and closure:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MATCH-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MATCH-1
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-match1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-MATCH-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MATCH-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Stop Conditions

Stop and revise the plan or route a governance pause if:

- planning review finds missing pair-bank, keyboard, mobile, dark-mode, or
  target-proof boundary requirements;
- implementation would require generated lesson output or source-data adoption;
- the family cannot be implemented without pointer-only drag-and-drop;
- matching accepts raw arrays, arrays with attached `pairs`, object pair
  entries, duplicate left ids, duplicate right ids, extra response keys,
  selected distractors, non-string ids, or unknown ids;
- validation allows expected pairs that omit answer left or right items;
- validation allows item banks without accessible descriptions, or distractors
  without same-bank `distractorFor`;
- rendered output cannot show two stable item banks in standard and narrow
  fixture states;
- any artifact allows diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Forbidden Changes

- No edits under `references/machine` or `references/external`.
- No source-data/book-1/exit-ticket writes.
- No reasoning CSV writes.
- No target-exercise registry writes.
- No generated Book 1 lesson output writes.
- No candidate storage creation or candidate writes.
- No changes to `knowledge/exit-ticket-game-1.1.1.zip`.
- No protected reference mutation, machine reference mutation,
  external-source mutation, unit minting, unit update, unit split, or unit
  deprecation.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV, CP-6/Year-1 promotion, Scale Gate 1, or product-wide use.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-MATCH-1` runtime/test changes,
checker, proof artifacts, sprint records, result metadata, and any roadmap or
index refresh generated for this sprint. After commit, revert the sprint
commit. Do not revert previous task-family sprint records, source data,
generated Book 1 output, protected references, unrelated user work, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

Human review is not required for this runtime implementation sprint. Structural
lead review is required before sprint closure. A later
`GATE-TASK-FAMILY-1` human review is required before `matching_pairs` or other
new task families are relied on by reasoning migration, check implementation,
first-three-paragraph product proof, or Scale Gate 1.

## Review Protocol

Before implementation:

- Create this plan, the baseline, and plan JSON.
- Run the sprint-plan and planned-bundle checks.
- Ask the planning/review agent to inspect the plan, baseline, plan JSON,
  accepted structured-choice contract, and prior runtime sprint pattern.
- Correct blocking planning findings before implementation.

Before closure:

- Run the validation stack.
- Assign structural lead review.
- Record round 1, corrections, and round 2.
- Do not mark the roadmap closed until round 2 passes and final closure
  validation is ready.

## Next Action

Run planning validation, request planning review, and implement only after the
planning review returns PASS or PASS WITH FLAGS with no blockers.

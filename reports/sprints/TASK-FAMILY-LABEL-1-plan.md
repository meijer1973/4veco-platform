# Sprint TASK-FAMILY-LABEL-1: Label-Placement Task-Family Implementation

Generated: 2026-06-01

## Goal

Implement `label_placement` as a deterministic constrained-construction family
in the shared task shell.

Students must be able to place labels on graph, table, formula, or structure
targets through visible controls that preserve the representation context. The
family is meant for axes, lines, intersections, units, index labels,
curve-shift components, and formula parts.

This sprint may implement shared runtime support and report-fixture proof only.
It does not authorize generated lesson output, new source exercise tasks,
target-equivalent reliance, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CONSTRUCT-1` closed the constrained-construction contract and
named `TASK-FAMILY-LABEL-1` as the implementation lane for `label_placement`.

The accepted contract defines:

- response shape: `{ "placements": [{ "labelId": "id", "targetId": "id" }] }`;
- expected shape:
  `{ "kind": "label_placement", "placements": [{ "labelId": "id", "targetId": "id" }] }`;
- validation owner: shared task shell plus graph/formula module;
- feedback owner: shared task shell plus graph/formula module;
- focus/keyboard expectation: keyboard label pick/place/remove;
- target-proof limit: representation proof only when label placement is the
  reviewed target action.

`product-end-state.md` and `companion-core-specifications.md` require the
shared task shell to support graph/table and visual construction actions with
keyboard/focus, mobile, and dark-mode proof. Label placement is visual by
nature, so a passing runtime implementation must prove visual target rendering,
not only data validation.

Prior runtime sprints established the implementation standard for new shared
families: first-class family declaration, strict response-shape matching,
shared UI helpers, wrapper collection support, focused tests, custom sprint
checker, report-fixture proof, and structural lead review.

## Implementation Schema

`label_placement` must use this interaction schema:

```json
{
  "family": "label_placement",
  "interaction": {
    "labelBankLabel": "Labels",
    "targetRegionLabel": "Grafiek",
    "placementLabel": "Geplaatste labels",
    "visual": {
      "kind": "axis_graph",
      "title": "Vraag en aanbod",
      "description": "Plaats de labels bij de assen, lijn en het snijpunt."
    },
    "labels": [
      { "id": "prijs", "label": "Prijs", "kind": "answer", "description": "Label voor de verticale as" },
      { "id": "hoeveelheid", "label": "Hoeveelheid", "kind": "answer", "description": "Label voor de horizontale as" },
      { "id": "vraaglijn", "label": "Vraaglijn", "kind": "answer", "description": "Label voor de dalende vraaglijn" },
      { "id": "evenwicht", "label": "Evenwicht", "kind": "answer", "description": "Label voor het snijpunt van de lijnen" },
      { "id": "omzet", "label": "Omzet", "kind": "distractor", "description": "Afleider die geen onderdeel van deze grafiek is", "distractorFor": "evenwicht" }
    ],
    "targets": [
      { "id": "y-as", "label": "verticale as", "kind": "answer", "targetRole": "axis", "description": "Plaats voor het prijslabel op de y-as", "x": 18, "y": 42 },
      { "id": "x-as", "label": "horizontale as", "kind": "answer", "targetRole": "axis", "description": "Plaats voor het hoeveelheidslabel op de x-as", "x": 58, "y": 86 },
      { "id": "line-d", "label": "dalende lijn", "kind": "answer", "targetRole": "line", "description": "Plaats voor de dalende vraaglijn", "x": 68, "y": 38 },
      { "id": "eq", "label": "snijpunt", "kind": "answer", "targetRole": "intersection", "description": "Plaats voor het evenwichtspunt", "x": 48, "y": 54 },
      { "id": "caption", "label": "titelvlak", "kind": "distractor", "targetRole": "structure_part", "description": "Afleidend vlak boven de grafiek", "distractorFor": "eq", "x": 80, "y": 16 }
    ]
  },
  "expected": {
    "kind": "label_placement",
    "placements": [
      { "labelId": "prijs", "targetId": "y-as" },
      { "labelId": "hoeveelheid", "targetId": "x-as" },
      { "labelId": "vraaglijn", "targetId": "line-d" },
      { "labelId": "evenwicht", "targetId": "eq" }
    ],
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.labels` defines the visible label bank. Each label has `id`,
  `label`, `kind`, and `description`. Distractor labels must also include
  `distractorFor` pointing to a known answer label.
- `interaction.targets` defines stable placement targets. Each target has `id`,
  `label`, `kind`, `targetRole`, and `description`. Optional `x` and `y`
  define visual position. Distractor targets must include `distractorFor`
  pointing to a known answer target.
- `kind` must be `answer` or `distractor`.
- `targetRole` must be one of `axis`, `line`, `intersection`, `region`,
  `unit`, `index_label`, `curve_shift`, `formula_part`, `table_cell`, or
  `structure_part`.
- Label ids and target ids must be unique, non-empty strings.
- At least two answer labels, two answer targets, one distractor label, and one
  distractor target are required.
- Every label and target must have a non-empty `description` so rendered
  controls can expose an accessible description, not only a terse visual label.
- Every distractor label and distractor target must be non-ambiguous by naming
  the answer item it distracts from through `distractorFor`.
- `x` and `y`, when present, must be numbers from 0 to 100 and represent
  percent positions inside the visual target region. Runtime proof must show
  that these positions create stable target controls in standard and narrow
  fixture states.
- Rendered output must include non-empty accessible labels for the label bank,
  target region, and placement controls. Visual labels may be compact, but
  screen-reader labels must name the target.
- `expected.kind` must be `label_placement`.
- `expected.placements` must contain exact label-target pairs. Every expected
  label must exist, be an answer label, and appear exactly once. Every expected
  target must exist, be an answer target, and appear exactly once. Expected
  placements must include every `kind: "answer"` label and every
  `kind: "answer"` target exactly once.
- The student response shape is exactly
  `{ "placements": [{ "labelId": "id", "targetId": "targetId" }] }`; raw
  arrays, array-with-`placements`, non-object entries, non-string ids,
  duplicate selected labels, duplicate selected targets, unknown labels,
  unknown targets, missing keys, and extra response keys must not match.
- Deterministic matching is order-insensitive over the exact label-target pair
  set.
- `partialFeedback: "practice_only"` is optional and may report missing
  labels, misplaced labels, selected distractor labels, selected distractor
  targets, and correct placements in neutral terms. It does not create
  diagnostics, mastery, sequencing, or target-equivalent proof.

## Quality Standard

The quality floor is a specification-accurate shared implementation that lets
student-facing surfaces ask students to place labels on a visual or structural
representation without falling back to passive recognition. Passing tests alone
is insufficient: the implementation must prove rendered output exposes the
visual region, target controls, label bank, placed labels, remove controls,
one feedback region, optional neutral practice-only feedback, stable wrapper
collection, keyboard-operable controls, narrow/mobile layout behavior, and
dark-mode-compatible styling.

This sprint fulfils the product specification by adding a visual construction
task family that can later support graph/table, formula, and representation
tasks. It names follow-up work before `label_placement` is used in generated
product routes, target-equivalent exit tickets, reasoning migration, or Scale
Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before `label_placement` is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `label_placement` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates labels, targets, target roles, expected placements, distractor use, and response shape. | Focused Jest and custom sprint checker. | planned |
| Label-placement matching is exact label-target set matching. | Engine matching rejects raw arrays, array-with-`placements`, missing keys, non-string ids, unknown labels/targets, duplicate selected labels, duplicate selected targets, selected distractors as matches, wrong targets, and extra keys. | Engine tests plus custom checker. | planned |
| Expected placements stay aligned with answer bank semantics. | Validation rejects expected distractor labels or targets, omitted answer labels, omitted answer targets, duplicate expected labels/targets, and unknown expected ids. | Engine tests and custom checker. | planned |
| Visual target geometry is bounded and stable. | Validation accepts optional numeric `x`/`y` positions from 0 to 100 and rejects out-of-range coordinates. UI renders stable target buttons inside a visual region. | UI tests, checker, and rendered fixture proof. | planned |
| Accessible descriptions and distractor intent are concrete. | Validation rejects labels/targets without descriptions and rejects distractor labels/targets without `distractorFor` pointing to an answer item. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns missing labels, misplaced labels, selected distractor labels/targets, and correct placements without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses label-specific controls. | `engines/task-shell-ui.js` renders `.ts-label-*` controls with stable `data-label-*` selectors, not recycled sentence/source/step selectors. | UI tests and rendered fixture proof. | planned |
| Keyboard/focus behavior is explicit. | Focus plan includes label bank controls, target controls, and placement summary; UI uses buttons/selectable controls rather than pointer-only drag. | Focus-plan tests, checker, and fixture proof. | planned |
| Wrapper collection is shared-shell owned. | Exit-ticket, skilltree, and graph wrappers collect `label_placement` responses through `TaskShellUI` helpers and delegate click handling. | Wrapper tests/static checks and custom checker. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, or product-authority artifacts change. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Implement pointer drag-and-drop. | defer | Keyboard proof is more important now; button-based pick/place/remove is accessible and deterministic. Drag can be layered later if reviewed. |
| Include optional visual metadata and x/y positions. | include_now | Label placement needs visual proof; bounded coordinates give useful report-fixture and future graph/table affordance without adopting generated routes. |
| Support target roles beyond graph axes/lines. | include_now | The contract includes graph, table, formula, and structure tasks. A role enum keeps that broad support explicit while still validated. |
| Allow partial matching for exit tickets. | reject_now | Partial feedback is practice/advisory only. Exit-ticket proof must remain exact unless a later gate reviews a domain evaluator. |
| Generated-route screenshots in this runtime sprint. | defer_named_follow_up | This sprint produces report-fixture proof only; product-route adoption and generated screenshots belong to a later adoption sprint and `GATE-TASK-FAMILY-1`. |
| Treat label placement as target-equivalent graph proof by itself. | reject_scope_creep | Label placement proves representation placement only. Full graph/table proof still needs reviewed target-operation coverage. |

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

- `build-scripts/sprints/check-task-family-label1.js`
- `reports/sprints/TASK-FAMILY-LABEL-1-*`
- `reports/json/task-family-label1-proof.json`
- `references/data/sprints/TASK-FAMILY-LABEL-1.plan.json`
- `references/data/sprints/TASK-FAMILY-LABEL-1.result.json`

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
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

## Inputs

Required inputs:

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current shared task-shell runtime, UI, CSS, wrapper, and focused-test files.

## Outputs

Required outputs:

- first-class `label_placement` runtime, UI, CSS, wrapper, and test support;
- deterministic sprint checker;
- proof JSON;
- rendered fixture and screenshot manifest with standard, narrow/mobile,
  dark-mode, and after-click states;
- sprint result JSON and markdown result;
- diff summary;
- structural lead-review assignment, round 1, corrections, and round 2;
- updated roadmap/index/dashboard artifacts only at closure.

## Proof Required to Close

The sprint may close only after producing:

- updated shared task-shell engine support;
- updated shared task-shell UI and CSS support;
- wrapper collection/click handling for exit-ticket, skilltree, and graph
  surfaces;
- focused Jest tests for engine, UI, and wrappers;
- a custom `TASK-FAMILY-LABEL-1` checker;
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

- `reports/sprints/TASK-FAMILY-LABEL-1-plan.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-baseline.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-LABEL-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-result.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-diff-summary.md`
- `reports/json/task-family-label1-proof.json`
- `references/data/sprints/TASK-FAMILY-LABEL-1.plan.json`
- `references/data/sprints/TASK-FAMILY-LABEL-1.result.json`

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
- `build-scripts/sprints/check-task-family-label1.js`

Roadmap and index artifacts may be updated only during closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the sprint-plan and planned
   bundle checkers. Stop if the plan does not pass.
2. Ask the planning/review agent to inspect the plan, baseline, plan JSON,
   accepted construction contract, and prior runtime sprint pattern. Stop and
   revise if the planning review returns blockers.
3. Implement the shared-shell runtime: family declaration, interaction
   validation, expected validation, strict response-shape matching,
   practice-only feedback, and focus plan.
4. Implement shared UI/CSS support using label-specific selectors and
   keyboard-operable pick/place/remove controls. Stop if the implementation
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
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-LABEL-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-LABEL-1
npm.cmd exec -- jest --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-label1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-LABEL-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-LABEL-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Stop Conditions

Stop and revise the plan or route a governance pause if:

- planning review finds missing visual, keyboard, mobile, dark-mode, or
  target-proof boundary requirements;
- implementation would require generated lesson output or source-data adoption;
- the family cannot be implemented without pointer-only drag-and-drop;
- matching accepts raw arrays, arrays with attached `placements`, duplicate
  labels, duplicate targets, extra response keys, selected distractors, or
  unknown ids;
- validation allows expected placements that omit answer labels or answer
  targets;
- validation allows label or target items without accessible descriptions, or
  distractors without `distractorFor`;
- rendered output cannot show a stable visual target region in standard and
  narrow fixture states;
- any artifact authorizes diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Forbidden Changes

- No edits under `references/machine` or `references/external`.
- No source-data/book-1/exit-ticket writes.
- No reasoning CSV writes.
- No target-exercise registry writes.
- No generated Book 1 lesson output writes.
- No candidate storage creation or candidate writes.
- No protected reference mutation, machine reference mutation,
  external-source mutation, unit minting, unit update, unit split, or unit
  deprecation.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV, CP-6/Year-1 promotion, Scale Gate 1, or product-wide use.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-LABEL-1` runtime/test changes,
checker, proof artifacts, sprint records, result metadata, and any roadmap or
index refresh generated for this sprint. After commit, revert the sprint
commit. Do not revert previous task-family sprint records, source data,
generated Book 1 output, protected references, or unrelated user work.

## Human review required

Human review is not required for this runtime implementation sprint. Structural
lead review is required before sprint closure. A later `GATE-TASK-FAMILY-1`
human review is required before `label_placement` or other new task families
are relied on by reasoning migration, check implementation,
first-three-paragraph product proof, or Scale Gate 1.

## Review Protocol

Before implementation:

- Create this plan, the baseline, and plan JSON.
- Run the sprint-plan and planned-bundle checks.
- Ask the planning/review agent to inspect the plan, baseline, plan JSON,
  accepted construction contract, and prior runtime sprint pattern.
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

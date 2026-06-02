# GATE-TASK-FAMILY-1 Live Output Evidence

Generated: 2026-06-02

Status: playable proof captured after usability-agent repair/recheck and
human-precheck task corrections; no human review comments started.

## Scope

This evidence covers playable shared task-shell fixture output for the twelve
new structured choice and constrained construction task families:

- `cloze_text`
- `multi_select`
- `matching_pairs`
- `step_ordering`
- `two_tier_choice`
- `assertion_reason`
- `cloze_tile_select`
- `sentence_builder`
- `formula_builder`
- `source_value_selection`
- `source_chain_builder`
- `label_placement`

The evidence is review-only. It does not adopt any family in product routes,
write source lesson data, regenerate Book 1 output, or authorize
target-equivalent reliance.

## Playable Review Lab

Playable lab:
`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-lab.html`

Playable data:
`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-data.json`

Playable proof:
`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/playable-proof.json`

The playable proof verifies:

- twelve task cards and twelve `Controleer taak` buttons render;
- empty submission produces an understandable retry state;
- correct submission exposes `Ga naar volgende taak`;
- focus moves from feedback to the next task after the next-action control;
- desktop correct path reaches `12 / 12`;
- mobile/dark correct path reaches `12 / 12`.

## Static Rendered Fixture

Consolidated gallery:
`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-family-gallery.html`

Screenshot support pages:

- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-dark-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-controls-gallery.html`

The gallery embeds the rendered fixtures produced by the closed
implementation sprints under `reports/sprints/`. Those per-family fixtures are
already covered by their sprint checkers and proof JSON files.

## Screenshot Proof

Screenshots captured for the human reviewer:

| Screenshot | Purpose |
|---|---|
| `screenshots/gate-task-family1-desktop-overview.png` | desktop/light overview with review boundary and structured-choice families |
| `screenshots/gate-task-family1-construction-overview.png` | construction-family section overview with tile and sentence families visible |
| `screenshots/gate-task-family1-construction-detail.png` | targeted formula, source-value/source-chain, and label-placement construction detail |
| `screenshots/gate-task-family1-mobile-narrow.png` | mobile/narrow layout proof for the consolidated gallery boundary |
| `screenshots/gate-task-family1-mobile-controls.png` | mobile/narrow proof with actual inline blank and tile controls visible |
| `screenshots/gate-task-family1-dark-mode.png` | dark-mode proof surface |
| `screenshots/gate-task-family1-feedback-states.png` | feedback-state overview support page |
| `screenshots/gate-task-family1-feedback-detail.png` | targeted visible practice-only feedback cards and repair cues |
| `screenshots/gate-task-family1-playable-initial.png` | playable lab initial state with twelve checkable tasks |
| `screenshots/gate-task-family1-playable-retry-feedback.png` | empty submission produces retry feedback |
| `screenshots/gate-task-family1-playable-next-action-focus.png` | correct submission exposes next task action and focus handoff |
| `screenshots/gate-task-family1-playable-completed.png` | desktop correct path reaches `12 / 12` |
| `screenshots/gate-task-family1-playable-mobile-dark-completed.png` | mobile/dark correct path reaches `12 / 12` |

## Validator And Proof Inputs

The gate packet cites:

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/json/task-family-construction-contract.json`
- all twelve task-family proof JSON files under `reports/json/`
- all rendered family fixtures under `reports/sprints/`
- focused Jest tests for shared task-shell engine/UI and wrappers
- the gallery screenshot capture script
  `build-scripts/review-gates/capture-gate-task-family1-gallery-screenshots.js`
- the custom checker
  `build-scripts/review-gates/check-gate-task-family1-review-packet.js`

## Usability-Agent Evidence

Independent usability agents tested whether the lab could be understood
without hidden expected-state lookup:

- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round1.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-corrections.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round2.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-analysis.md`

Round 1 returned REVISE because the sentence-builder expected order conflicted
with a natural answer, source-value selection did not clearly state the
two-part action, and next action after correct feedback was weak. The repair
updated the playable lab and proof. Round 2 found the earlier blockers
resolved and recommended direct-comment human review, carrying only the
compact repair controls as an adoption/accessibility polish flag.

## Human Precheck Corrections

Human precheck corrections are recorded in:
`reports/sprints/GATE-TASK-FAMILY-1-human-precheck-corrections.md`

Those corrections repaired the Task 3 matching distractors, Task 10 source
value context, Task 11 visible source context, and Task 12 graph-label leakage
before direct-comment human review.

## Boundary Evidence

All product-boundary flags remain false:

- no generated lesson output;
- no source-data mutation;
- no engine implementation in this gate sprint;
- no product-route adoption;
- no target-equivalent completion claim;
- no diagnostics;
- no adaptive routing;
- no mastery;
- no sequencing;
- no student-facing AI;
- no summative use;
- no PV projection or machine promotion;
- no Scale Gate 1;
- no student/product use.

## Human Review Note

The human reviewer should comment directly on the review packet after
inspecting the playable lab, playable proof, screenshots, static gallery, and
usability-agent evidence. The reviewer should decide whether the playable
families are acceptable as planning input for later bounded adoption sprints,
while preserving the product-boundary conditions above.

# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-4: Final Interaction Clarity Repair

Date: 2026-06-05

Status: active repair plan after fourth direct human `REVISE`, with reviewer
correction pass added before renewed review.

## Goal

Repair the review-only actual-exam and textbook playable labs after the fourth
human review kept `GATE-SHARED-TASK-INGEST-REPAIR-1` at
`hold_for_playable_repair`.

This sprint is a narrowed interaction-clarity repair. It preserves the
three-card economy and review-only proof boundary while making the graph task
feel like graph construction, making the exam calculation usable, and removing
visual noise that blocked review.

This sprint does not close the human gate, authorize generated lesson output,
mutate protected references or source data, adopt source-context ingestion in
product routes, claim target-equivalent proof, authorize diagnostics/mastery/
sequencing, or authorize Scale Gate 1.

## Context

Repair 3 made big steps forward: the original exam question is visible in the
right pane, the exam task set is structurally reduced, task 3 carries the
calculated value, and the textbook task begins with click-to-place graph
construction.

The renewed review still held the gate because the remaining defects are
student-facing interaction defects. The textbook line appears as a separate
completed graph instead of in the active graph workspace. The grid/label reveal
policy needs tuning. The 50 percent follow-up is not self-explanatory. The exam
source-selection card remains artificial. The calculation card rejects
reasonable unit variants and lacks targeted feedback or support when stuck.
Visible source/table labels repeat.

Reviewer correction before renewed review added four more concrete acceptance
requirements: graph grid visibility must be visually readable with
table-derived tick numbers, the 50 percent task must accept a conclusion and
not only an interval answer, the interval-halving shape must be represented in
the shared task shell, and the exam calculation must accept the valid shortcut
`22x12 = 264, 264 + 385 = 649`.

## Quality Standard

The quality floor is a rendered output that a reviewer can use without guessing
hidden formats. The specification being fulfilled is the product end-state
requirement that source-dependent tasks show a clear student-facing route
through the target operation, with useful local feedback, readable source
context, and interaction types that match the target action.

Evidence needed to prove fulfilment:

- textbook screenshots for initial grid/no labels, axis-selected labels/scale,
  two clicked points, line drawn in the same workspace, wrong/retry, completed,
  mobile, and dark mode;
- actual-exam screenshots for original question visibility, conceptual task 1
  or removed task 1, calculation wrong state, number-correct/unit-wrong state,
  hint/support state, and completed state;
- proof JSON fields for same-workspace line drawing, no separate completed
  graph block, grid visible before axis selection, label/scale delay, targeted
  calculation feedback, progressive support, duplicate-label absence, and
  source-pane readability;
- checkers that fail the renewed blockers rather than relying on visual claims.

The review gate that will judge student-facing quality is renewed direct human
review for `GATE-SHARED-TASK-INGEST-REPAIR-1`. This sprint may refresh the
packet; it may not close the gate.

Named follow-up work not included here: a general graph-drawing engine,
product-route adoption, target-equivalent exit-ticket proof, generated lesson
output, and Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Graph construction happens in the active workspace | line is rendered in the same SVG after two points and confirmation | checker fails if `[data-completed-graph="true"]` exists outside the workspace | planned |
| Grid visible, labels delayed | grid lines visible before axes; labels/scale hidden until correct axes | screenshots and proof fields for initial and axis-selected states | planned |
| Logical graph tick labels | Q and P scale values follow the table values instead of generic quarter ticks | checker fails if table-derived ticks are missing from the axis-selected proof | added in correction pass |
| Exam calculation accepts reasonable units | `649` plus `euros` and listed variants match or receive targeted unit feedback | checker and screenshot for number-correct/unit-wrong state | planned |
| Exam calculation accepts valid shortcut work | `22x12 = 264, 264 + 385 = 649` matches as an accepted work path | checker uses the exact reviewer-style input | added in correction pass |
| Support when stuck | failed attempts reveal progressive hint/setup/solution controls | proof and screenshot after failed attempts | planned |
| Exam task 1 has learning value | source-selection card removed or replaced with conceptual choice | task-set checker rejects select-all-numbers task | planned |
| 50 percent follow-up is self-explanatory | interval choice auto-fills old/new quantities and asks only the halving relation | task checker and completed screenshot | planned |
| 50 percent follow-up is not interval-only | task includes conclusion choice and accepts `Q daalt met 50 procent` | shared engine and task checker validate interval/relation/conclusion controls | added in correction pass |
| Source/table labels are not duplicated | one visible Bron/Tabel identifier per block; captions visually hidden when repeated | duplicate-label checker and screenshots | planned |
| Product boundary preserved | no closure/product/Scale Gate authority | gate packet boundary checks | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Same-workspace graph line | include_now | Required by renewed review. |
| Axis selectors attached to graph | include_now | Improves graph-task coherence without new engine architecture. |
| Progressive calculation support | include_now | Required because the lab is review/guided-practice evidence. |
| General freehand graph drawing | defer_named_follow_up | Too broad for this review-only repair. |
| Product-route adoption | reject_scope_creep | Gate remains open and no product authority exists. |

## Allowed paths

- `build-scripts/sprints/task-ingest-playable-lab.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-*`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-*`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-4-*`
- `references/data/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-4.plan.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/**`
- roadmap rows, repository maps, URL indexes, and dashboards required for
  remote review

## Forbidden paths

- no hand edits to `references/machine/` or `references/external/`;
- no edits to `references/authored/course-target-exercises.json`;
- no source-data mutation;
- no generated Book 1 lesson-output mutation;
- no `gate-closure.*`, `closure-proposal.*`, product-route adoption,
  target-equivalent proof, diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, Scale
  Gate 1, or student/product use.

## Inputs

- fourth direct human comments recorded in `repair4-direct-review-comments.md/json`;
- `../4veco-lessen/specifications/product-end-state.md`;
- `references/reference-team-roadmap.md`;
- `../4veco-lessen/lessen-team-roadmap.md`;
- current Repair 3 transform JSON, proof JSON, rendered labs, screenshot
  capture scripts, checkers, maps, traces, and gate packet artifacts.

## Outputs

- this plan, baseline, plan JSON, command log, visual QA report, economy report,
  verification review, and lead-review artifacts;
- updated actual-exam transform and rendered lab;
- updated textbook transform and rendered lab;
- regenerated proof JSON, screenshot manifests, and screenshots;
- updated visual QA/checkers for duplicate labels, graph line placement, grid
  visibility, targeted feedback, and support path;
- refreshed gate review packet, live-output evidence, bundle URLs, and checker.

## Operationalized sprint procedure

1. Record the fourth review decision as `REVISE / hold_for_playable_repair`.
   Stop if any artifact implies pass, closure, product adoption, or Scale Gate
   authority.
2. Baseline the Repair 3 defects and protected-path cleanliness.
3. Replace or remove the artificial exam source-selection task. Prefer the
   conceptual setup choice card unless it breaks three-card economy.
4. Fix exam calculation validation so `649` plus reasonable unit variants pass,
   and add targeted feedback for unit-only, work-missing, and number-wrong
   cases.
5. Add progressive support after failed exam calculation attempts: hint,
   partial setup, and review-only worked-out path.
6. Draw the textbook graph line in the same SVG workspace after two clicked
   points and line confirmation. Stop if a separate completed graph block
   remains.
7. Attach axis selectors to the graph, keep grid visible from the start, hide
   labels/scale until correct axes, and prove the reveal behavior.
8. Redesign the 50 percent follow-up as interval choice with auto-filled old/
   new quantities and a constrained halving relation.
9. Enforce a one-visible-label policy for Bron/Tabel blocks and add duplicate
   label proof.
10. Regenerate screenshots/proof, update maps/traces/reviewer notes, refresh
    the gate packet, and run validators.
11. Perform lead-review round 1/corrections/round 2, refresh repository maps,
    commit, push, and record remote evidence.
12. Reviewer correction pass before renewed review: replace generic graph ticks
    with table-derived ticks, add conclusion acceptance for the 50 percent task,
    add shared-shell validation/focus-plan evidence for `interval_halving_check`,
    and accept the exam calculation shortcut
    `22x12 = 264, 264 + 385 = 649`.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-4-plan.md
node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-4 --active
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node --check engines/task-shell-engine.js
node --check engines/task-shell-ui.js
node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js
node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-4
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review --branch codex/shared-task-ingest-repair4
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
git diff --check
```

## Proof Required to Close

Closure proof to close this sprint requires review, validator, and test
evidence:

- textbook proof records grid visible from start, axis labels/scale hidden
  before correct axes, axis labels/scale revealed after axes, two clicked
  points, line drawn in the same workspace, no separate completed graph block,
  table-derived tick labels, and a simplified 50 percent follow-up with
  conclusion acceptance;
- actual-exam proof records original question visibility, useful task 1 or no
  separate source-selection card, acceptance of `649` plus reasonable unit
  variants, acceptance of the valid `22x12 = 264, 264 + 385 = 649` shortcut,
  targeted unit/work/number feedback, support path after failed attempts, and
  carried task-2 value in task 3;
- `interval_halving_check` is validated as a shared `calculation_work_capture`
  variant with a shared focus plan;
- duplicate visible Bron/Tabel labels are absent and checked automatically;
- no task set exceeds three required cards;
- checkers pass and reject the renewed review blockers;
- human gate remains open and no closure proposal or closure record exists;
- no protected references, source-data, or Book 1 generated output changed;
- evidence is committed and pushed for off-site review.

## Rollback plan

If a checker or reviewer proof shows the Repair 4 UI is weaker than Repair 3,
revert only the Repair 4 branch changes and keep the published Repair 3 branch
as the last known review surface. Do not alter protected references, generated
lesson output, source data, or gate closure artifacts.

## Human review required

Renewed direct human review is required after this sprint. The reviewer should
comment directly on the refreshed packet. The gate may close only after
returned comments, a comment-resolution log, a closure proposal where allowed,
and explicit human confirmation. This sprint itself cannot close the gate.

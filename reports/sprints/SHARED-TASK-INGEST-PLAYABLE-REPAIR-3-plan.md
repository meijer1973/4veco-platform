# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-3: Interaction Polish And Exam Orientation Repair

Date: 2026-06-05

Status: active repair plan after renewed human `REVISE`.

## Goal

Repair the review-only actual-exam and textbook playable labs after the third
human review held `GATE-SHARED-TASK-INGEST-REPAIR-1` at
`hold_for_playable_repair`.

This sprint is focused interaction polish. It preserves the three-card target
economy from Repair 2 while making the graph task more graph-like and the exam
task easier to understand.

This sprint changes review evidence only. It does not close the human gate,
authorize generated lesson output, mutate protected references or source data,
adopt source-context ingestion in product routes, claim target-equivalent
proof, authorize diagnostics/mastery/sequencing, or authorize Scale Gate 1.

## Context

Repair 2 fixed the earlier strategic target-task problem: the textbook task now
starts with `graph_construction_substitute`, and both transformations have
three cards. The renewed review says those are big steps forward, but still
requires revision because rendered student orientation and interaction quality
remain weak.

The textbook graph card still asks for typed point pairs, which feels like a
form rather than graph construction. The graph grid also reveals final axis and
number labels before the student chooses axes. The left source panel remains
mechanically scrollable but visually weak.

The actual-exam task has the right three-card sequence, but the original exam
question is not visible enough in the right-side flow. Task 1 still uses too
many controls, and task 3 does not consume the calculated answer from task 2.

## Quality Standard

The quality floor is student-clean interaction within the existing target-task
economy.

Specification requirements being fulfilled:

- the product end-state requires rendered output that gives students a clear
  route through the target operation;
- context-first source tasks must keep source context readable while making
  the active task clear;
- graph/table tasks must use visual or graph-like interaction where the target
  action is graph construction;
- review gates must inspect actual student-facing output, not only contracts or
  proof JSON.

Evidence required to prove fulfilment:

- screenshots showing click-to-place graph interaction, axis-selected state,
  wrong/retry, corrected, completed, mobile completed, and dark completed;
- proof JSON fields for click support, delayed label reveal, completed graph
  hidden before success, source-pane readability, and no visible long file
  references;
- screenshots and proof showing the actual exam question in the right task
  pane;
- proof that exam task 1 is compact and avoids repeated value/role dropdown
  rows;
- proof that task 3 carries the task-2 calculated value and uses constrained
  direction controls.

The review gate that will judge quality is renewed direct human review for
`GATE-SHARED-TASK-INGEST-REPAIR-1`. This sprint may prepare a refreshed packet;
it may not close the gate.

Omitted requirements are explicit follow-up work: a fully general freehand
graph-drawing engine, product-route adoption, target-equivalent exit-ticket
proof, and generated lesson output are outside this sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Textbook graph-like construction | click-to-place dots in graph workspace as primary path | checker fails without click support or waiver | planned |
| Delayed graph labels | grid hides target axis/number labels before axis choice | proof fields and screenshot after axis selection | planned |
| Source-pane readability | compact source panel with table readable and no long file paths | visual QA proof and checker | planned |
| Actual exam question visible | right task pane question header before cards | proof and checker | planned |
| Exam task 1 simplified | compact useful-cell selection, no repeated value/role dropdown rows | control-count proof and checker | planned |
| Exam task 3 carryover | task 3 displays task-2 calculated value and constrained direction | proof and checker | planned |
| Three-card economy | no added cards | transform checkers and proof JSON | planned |
| Product boundary | no generated output/product authority | boundary proof and git status | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Click-to-place two graph points | include_now | Required by renewed review. |
| Typed point entry as collapsed fallback only | include_now | Acceptable fallback without making it primary. |
| Axis/number labels reveal after axis selection | include_now | Required by renewed review. |
| Compact source panel without file paths | include_now | Required by renewed review. |
| Fully general graph drawing engine | defer_named_follow_up | Too broad for this bounded review-lab repair. |
| Product-route adoption | reject_scope_creep | Gate remains open and no product authority exists. |

## Allowed paths

- `engines/task-shell-engine.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
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
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-*`
- `references/data/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3.plan.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/**`
- repository maps, URL indexes, dashboards, and roadmap rows needed for remote
  review

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

- repair-3 direct comments in `repair3-direct-review-comments.md/json`;
- `../4veco-lessen/specifications/product-end-state.md`;
- `references/reference-team-roadmap.md`;
- `../4veco-lessen/lessen-team-roadmap.md`;
- current Repair 2 transform JSON, proof JSON, rendered labs, screenshot
  capture scripts, checkers, maps, traces, and gate packet artifacts.

## Outputs

- this plan, baseline, plan JSON, command log, verification review, and
  lead-review artifacts;
- updated actual-exam transform and rendered lab;
- updated textbook transform and rendered lab;
- regenerated proof JSON, screenshot manifests, and screenshots;
- visual QA report for interaction and source-panel readability;
- refreshed gate review packet, live-output evidence, bundle URLs, and checker.

## Operationalized sprint procedure

1. Record repair-3 direct comments and this plan. Stop if the plan does not
   name click-to-place graphing, delayed labels, source-panel readability,
   visible exam question, simplified exam task 1, and task-3 carryover.
2. Baseline current defects and protected-path cleanliness.
3. Add or extend deterministic response validation for click-to-place graph
   points while preserving the existing graph-construction family.
4. Update the textbook graph card so the primary visible path is axis selection
   plus click-to-place points; keep typed entry only as collapsed fallback.
5. Hide graph axis labels and numeric labels before axis selection, then reveal
   them after selected axes.
6. Reduce visible source panel material to essential source text/table/support
   and hide long file paths by default.
7. Add the actual exam question to the right task pane before the three cards.
8. Replace exam task 1 repeated value/role rows with compact useful-cell
   selection or equivalent compact controls.
9. Make exam task 3 direction-first and carry forward task 2's calculated
   value.
10. Regenerate screenshots/proof for both labs. Stop if any required proof
    field fails.
11. Update checkers, visual QA report, maps, traces, packet, live evidence, and
    gate checker.
12. Run validation commands, verification review, lead-review records, refresh
    repository maps/indexes, commit, push, and record remote evidence.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-plan.md
node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-3 --active
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js
node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-3
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review --branch codex/shared-task-ingest-repair3
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
git diff --check
```

## Proof Required to Close This Sprint

Closure proof to close this sprint requires review, validator, and test
evidence:

- textbook proof records click-to-place graph support, selected-axis reveal,
  hidden pre-axis numeric labels, completed graph hidden before success, source
  table readability, no long source file refs by default, wrong/retry,
  corrected, completed, mobile completed, and dark completed states;
- actual-exam proof records visible right-pane exam question, compact task-1
  useful-value selection, no repeated role dropdown overload, task-3 carried
  calculated value, direction-first constrained control, wrong/retry,
  corrected, completed, mobile completed, and dark completed states;
- no task set exceeds three required cards;
- checkers pass and reject the renewed review blockers;
- human gate remains open and no closure proposal or closure record exists;
- no protected references, source-data, or Book 1 generated output changed;
- evidence is committed and pushed for off-site review.

## Rollback plan

If click-to-place cannot be made deterministic within this sprint, stop and
record a blocker instead of pretending typed five-point entry is the main path.

If source-panel readability or exam orientation proof fails, keep the gate held
and do not refresh the packet for review.

If forbidden-path drift appears, restore the unintended drift before
continuing and record the incident in the command log.

## Human review required

Yes. This sprint prepares the next renewed direct-review packet only. It does
not complete or close `GATE-SHARED-TASK-INGEST-REPAIR-1`.

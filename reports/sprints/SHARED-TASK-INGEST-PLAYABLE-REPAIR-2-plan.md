# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-2: Target-Task Simplification And Visual QA Repair

Date: 2026-06-04

Status: active repair plan after renewed human `REVISE`.

## Goal

Repair the review-only actual-exam and textbook playable labs after renewed
human review held `GATE-SHARED-TASK-INGEST-REPAIR-1` at
`hold_for_playable_repair`.

This sprint changes review evidence only. It does not close the human gate,
authorize generated lesson output, mutate protected references or source data,
adopt source-context ingestion in product routes, claim target-equivalent
proof, or authorize Scale Gate 1.

## Context

The first human review held the gate because the labs were not truly playable.
`SHARED-TASK-INGEST-PLAYABLE-REPAIR-1` repaired mechanics: controls, semantic
validation, collapsed support, and proof states. The renewed review accepted
those mechanical improvements but held the gate again because the transformed
tasks still did not meet the specification as rendered output for a coherent
student-facing target task.

The specification requires source-dependent tasks to be context-first while
still preserving the target exercise operation. The current textbook transform
uses many support families around the source but does not make graph
construction the primary action. The current actual-exam transform uses too
many required support cards for a focused calculation item. This sprint repairs
that target-task mismatch.

## Quality Standard

The quality floor is a target-first, coherent student/reviewer experience.
Passing mechanics are not enough. The transformed task set must center the
actual operation requested by the source exercise and use no more required
cards than necessary. The governing specification is the product end-state
requirement that rendered output must give the student a clear route through
the source-dependent target operation, even when this sprint remains
review-only and not adopted in a student-facing product route.

Required quality floor:

- textbook task starts with graph construction or a bounded graph-construction
  substitute for `Teken een P-Q-grafiek bij de tabel`;
- textbook task set has at most three cards without human waiver;
- actual-exam task set has exactly the needed three cards: source values,
  calculation, conclusion;
- prompt/source/support boundaries are visible and checkable;
- completed graph is not visible before a graph-construction attempt succeeds;
- graph workspace sits in the main task pane and meets desktop size proof;
- screenshots and proof states show initial, wrong/retry, corrected,
  completed, mobile completed, and dark completed states;
- validation checks target-task economy, not only control counts.

The review gate that judges quality is renewed direct human review for
`GATE-SHARED-TASK-INGEST-REPAIR-1`. This sprint may prepare a refreshed packet;
it may not close the gate. Follow-up work after this sprint is the renewed
human review, returned-comment resolution, and explicit closure confirmation
if the reviewer later authorizes it.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Textbook graph-construction target | revised `task-ingest-transform3-textbook.json` with `graph_construction_substitute` primary task | checker evaluates axes, all five points, line confirmation | planned |
| Textbook target-task economy | max three textbook cards | transformation-economy report and checker | planned |
| Actual-exam target-task economy | three required cards only | checker rejects formula/step/source-chain as required cards | planned |
| Prompt/source boundary | renderer excludes prompt context from `.source-pane` | proof and checker fail prompt-in-source | planned |
| Completed graph boundary | completed graph hidden before graph construction success | proof and checker fail early completed-graph visibility | planned |
| Graph visual QA | graph workspace in task pane, desktop width >= 720px or >= 60% usable width | visual QA report and screenshot proof | planned |
| Playable states | wrong/retry, corrected, completed paths for both labs | proof JSON and screenshot manifests | planned |
| Human packet refresh | review packet asks target-conversion/economy/workspace questions | gate checker and renewed review artifacts | planned |
| Product boundary | no generated output, protected refs, source-data, or product use | boundary proof and git status checks | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Render graph-construction substitute as a large task-pane workspace | include_now | Required by renewed review. |
| Collapse formula/procedure help into support instead of required cards | include_now | Required for target-task economy. |
| Add explicit max-card checker | include_now | Required by renewed review. |
| Add visual QA report | include_now | Required by renewed review. |
| True freehand drawing engine | defer_named_follow_up | The review permits a bounded substitute if full drawing is unavailable. |
| Product-route adoption | reject_scope_creep | Human gate remains open and no product authority exists. |

## Allowed paths

- `engines/task-shell-engine.js`
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
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-*`
- `references/data/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2.plan.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/**`
- repository maps, URL indexes, dashboards, and roadmap rows needed for remote review

## Forbidden paths

- no hand edits to `references/machine/` or `references/external/`;
- no edits to `references/authored/course-target-exercises.json`;
- no source-data mutation;
- no generated Book 1 lesson-output mutation;
- no `gate-closure.*`, `closure-proposal.*`, product-route adoption, target-equivalent
  proof, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use.

## Inputs

- renewed review comments in `renewed-direct-review-comments.md/json`;
- `../4veco-lessen/specifications/product-end-state.md`;
- `references/reference-team-roadmap.md`;
- `../4veco-lessen/lessen-team-roadmap.md`;
- current transform JSON, proof JSON, rendered labs, screenshot capture scripts,
  checkers, maps, traces, and gate packet artifacts.

## Outputs

- this plan, baseline, plan JSON, command log, verification review, and
  lead-review artifacts;
- simplified actual-exam transform JSON and trace/map docs;
- simplified textbook transform JSON and trace/map docs;
- updated task-shell graph-construction-substitute validation;
- updated playable lab renderer with prompt/source separation and graph
  workspace;
- regenerated rendered labs, proof JSON, screenshots, and manifests;
- visual QA report;
- transformation-economy report;
- updated gate review packet, live-output evidence, bundle URLs, and checker.

## Operationalized sprint procedure

1. Record renewed direct comments and this repair plan. Stop if the plan does
   not name graph construction, max-card criteria, prompt/source boundary, and
   completed-graph boundary.
2. Baseline current task counts, prompt placement, graph visibility, and
   protected-path cleanliness.
3. Add deterministic `graph_construction_substitute` validation/evaluation to
   the task-shell engine for review-lab proof.
4. Rewrite actual-exam transform to three cards: source values, calculation,
   conclusion. Keep formula as collapsed support only.
5. Rewrite textbook transform to at most three cards: graph construction,
   graph reading, optional 50 percent quantity-drop check.
6. Repair the lab renderer so prompt blocks are right-panel task prompts, not
   source-pane blocks; completed graph is hidden before construction success;
   and the graph workspace is in the main task pane.
7. Regenerate screenshots/proof for both labs. Stop if graph workspace proof
   fails, prompt appears in the source pane, completed graph is visible before
   construction success, or task counts exceed limits.
8. Update checkers, visual QA report, transformation-economy report, maps,
   traces, review packet, and gate checker.
9. Run validation commands and record command-log evidence.
10. Run verification and lead-review records for this sprint.
11. Refresh repository maps/indexes, commit, push, and record remote evidence
    hash before sending a new human review packet.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-2 --active
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js
node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-2
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
```

## Proof Required to Close This Sprint

Closure proof to close this sprint requires review, validator, and test
evidence:

- textbook proof records exactly three cards, primary
  `graph_construction_substitute`, no prompt in source pane, no completed graph
  visible before graph-construction success, graph workspace in task pane, and
  graph workspace desktop width criterion passing;
- actual-exam proof records exactly three cards and formula support collapsed
  by default;
- visual QA report and transformation-economy report exist and name any flags;
- checkers pass and reject renewed review blockers;
- human gate remains open and no closure proposal or closure record exists;
- no protected references, source-data, or Book 1 generated output changed;
- evidence is committed and pushed for off-site review.

## Rollback plan

If graph-construction substitute validation cannot be made cleanly, stop and
record a blocker instead of adding more support-task cards.

If screenshots or visual QA fail, keep the gate held and do not refresh the
packet for review.

If forbidden-path drift appears, restore the unintended drift before continuing
and record the incident in the command log.

## Human review required

Yes. This sprint prepares the next renewed direct-review packet only. It does
not complete or close `GATE-SHARED-TASK-INGEST-REPAIR-1`.

# GATE-SHARED-TASK-INGEST-REPAIR-1 Shared Task Context And Ingestion Repair Review Packet

Generated: 2026-06-04

Status: refreshed after renewed `REVISE` and
`SHARED-TASK-INGEST-PLAYABLE-REPAIR-2`; direct human review may inspect the
remote snapshot recorded below, but the gate is not closed and no product
authority exists.

Reviewed remote evidence snapshot: `codex/shared-task-ingest-repair2` at
`0016511e4dc8e8d1d0ff6cf32875c967fcaa971d`. Direct push to `main` is blocked
by required GitHub status checks, so this branch is the published inspection
surface until the PR/check flow updates `main`.

## Review Scope

Review whether the repaired source-context ingestion evidence is now good
enough to authorize only a later controlled adoption-preparation sprint.

This packet is limited to review-only transformations:

- an external-primary actual-exam transformation for Zoohee question 3;
- an owned textbook-source transformation for `1.1.3 Grafieken en tabellen`.

The renewed review held the gate because the prior repair was mechanically
playable but not target-task clean. Repair 2 therefore checks Target-task
economy:

- the actual-exam task is reduced to source values, calculation, and
  conclusion;
- the textbook task starts with `graph_construction_substitute` for
  `Teken een P-Q-grafiek bij de tabel`;
- prompt blocks must not render as source material;
- the completed graph must not be visible before graph-construction success;
- the graph workspace must be in the main task pane and pass visual QA width
  proof.

This packet does not authorize generated lesson output, protected reference
mutation, source-data mutation, product-route adoption, target-equivalent
completion language, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, broad product use, or student use.

## Evidence Base

- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/live-output-evidence.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/live-output-evidence.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/direct-review-comments.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/renewed-direct-review-comments.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/comment-resolution-log.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/renewed-comment-resolution-log.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-plan.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-baseline.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-planning-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-visual-qa-report.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-transformation-economy-report.md`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-visual-variant-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-reviewer-notes.md`
- `build-scripts/sprints/task-ingest-playable-lab.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`

## Minimum Playable Evidence Inspection

Before writing binding comments, inspect at minimum:

- the actual-exam playable lab:
  `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`;
- the textbook playable lab:
  `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`;
- both proof JSON files, especially `task_transformation.playable_lab`;
- desktop initial, wrong/retry, corrected, completed, mobile completed, and
  mobile dark completed screenshots for both labs;
- `SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-visual-qa-report.md`;
- `SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-transformation-economy-report.md`;
- task-family maps and operation/answer traces for both transformations;
- renewed direct-review comments and resolution log.

Checker-readable requirement statement: both labs must preserve question visibility after source scrolling.
Checker-readable authority statement: the textbook source is not official exam authority.
Checker-readable target-task statement: Target-task economy is required.
Checker-readable graph statement: `graph_construction_substitute` must be the primary textbook task.

## Calibration Checks

1. Confirm the packet and every cited evidence artifact are pushed before
   renewed human review comments start.
2. Confirm this gate reviews source-context ingestion readiness only and does
   not authorize product-route adoption, generated lesson output, reference
   mutation, source-data mutation, Scale Gate 1, or student/product use.
3. Confirm the actual-exam evidence remains external-primary and cites the
   official prompt and correction model.
4. Confirm the textbook evidence remains owned-source only and is not treated
   as official exam authority.
5. Confirm the actual-exam task set has three required cards: source values,
   calculation, and conclusion.
6. Confirm the textbook task set has three cards and starts with
   `graph_construction_substitute`.
7. Confirm no prompt block is rendered inside the source pane.
8. Confirm the completed graph is not visible before graph-construction
   success.
9. Confirm graph workspace width proof passes on desktop.
10. Confirm no closure proposal or gate-closure record exists.

## Planned Review Focus

| Surface | Current state | Review issue |
|---|---|---|
| actual-exam authority | external-primary source refs preserved | decide whether authority remains strong enough |
| actual-exam target economy | 3 cards | decide whether source values -> calculation -> conclusion is coherent |
| textbook authority | owned-source only | decide whether authority boundary remains clear |
| textbook graph task | primary `graph_construction_substitute` | decide whether the target task is actually converted |
| graph workspace | right/main task pane with width proof | decide whether visual QA is sufficient |
| source/task boundary | prompt excluded from source pane | decide whether orientation is repaired |
| support policy | formula/procedure collapsed | decide whether support is secondary |
| product boundary | all product/adoption authorities false | decide whether later work must stay bounded |

## Full Planned Review Comment Prompts

Use these IDs when commenting directly on this packet.

`SHAREDINGEST-Q1`: Does the actual-exam evidence preserve the official prompt,
source table, correction-model steps, and point rules strongly enough for
source-dependent task transformation review?

`SHAREDINGEST-Q2`: Is the actual-exam task sequence now minimal and coherent
for the target calculation, or is any required card still unnecessary?

`SHAREDINGEST-Q3`: Are the actual-exam cards playable enough after reducing
the sequence to source values, calculation, and conclusion?

`SHAREDINGEST-Q4`: Does the actual-exam operation chain avoid final-answer-only
reduction without over-fragmenting the calculation?

`SHAREDINGEST-Q5`: Does the textbook-source evidence keep its authority bounded
to owned textbook material, without implying official exam authority?

`SHAREDINGEST-Q6`: Is `Teken een P-Q-grafiek bij de tabel` actually converted
into the active textbook task through `graph_construction_substitute`?

`SHAREDINGEST-Q7`: Is the 50 percent ambiguity now appropriately secondary to
the primary graph-construction task?

`SHAREDINGEST-Q8`: Do the task-family maps show original target task ->
transformed task(s), rather than family-coverage overbuild?

`SHAREDINGEST-Q9`: Are the screenshots and visual QA sufficient to judge graph
workspace size, initial state, wrong state, corrected state, completed graph
state, mobile, and dark mode?

`SHAREDINGEST-Q10`: Do any proof artifacts, lab text, or packet statements
overclaim product readiness, student-facing use, target-equivalent completion,
diagnostics, mastery, sequencing, or Scale Gate 1 authority?

`SHAREDINGEST-Q11`: What must be repaired before a later controlled
adoption-preparation sprint may start?

`SHAREDINGEST-Q12`: Give one of these gate-direction decisions with comments:
`pass_with_flags`, `pass_with_conditions`, `hold_for_playable_repair`,
`hold_for_source_authority_repair`, `pause_for_roadmap_correction`, or `fail`.

## Direct Review Comment Protocol

- Default mode is direct packet comments.
- The reviewer should comment against the prompt IDs above or return a single
  response preserving the IDs.
- After comments are returned, the agent must record direct-review comments and
  write a comment-resolution log.
- The agent should ask targeted follow-up questions only for ambiguous,
  missing, or conflicting review authority.
- A closure proposal may be drafted only after comment evidence is complete.
- `gate-closure.md/json` may be written only after explicit human
  confirmation of the closure decision.

## Current Stop Conditions

Stop the review instead of closing the gate if any of these occur:

- the packet or cited evidence is not pushed to the normal remote branch;
- remote hash metadata does not match the reviewed evidence;
- a prompt block is rendered inside the source pane;
- the completed graph is visible before graph-construction success;
- the textbook task does not start with graph construction;
- either transformed task set exceeds 3 required cards without human waiver;
- graph workspace visual QA fails;
- actual-exam official-source authority is weakened or textbook evidence is
  treated as official exam authority;
- protected reference, source-data, or generated Book 1 lesson output drift
  appears;
- anyone asks for product adoption, generated output, Scale Gate 1, or gate
  closure before direct comments and resolution evidence exist.

## Comment Resolution And Closure Protocol

After review comments are returned:

1. Record all reviewer comments and prompt IDs.
2. Classify comments as blocking, conditional, flag, or accepted.
3. Resolve comments with evidence links and exact file changes, or name the
   unresolved blocker.
4. Ask targeted follow-ups only where comments are ambiguous or conflict with
   higher authority.
5. Draft a closure proposal only after all required comments are resolved or
   explicitly carried as flags.
6. Require explicit human confirmation before writing gate-closure artifacts.

## Recommended Next Action

After this packet and repair-2 evidence are pushed and the reviewed remote hash
is recorded, send this packet for renewed direct human review comments. Do not
close the gate until returned comments, a comment-resolution log, and explicit
human closure confirmation exist.

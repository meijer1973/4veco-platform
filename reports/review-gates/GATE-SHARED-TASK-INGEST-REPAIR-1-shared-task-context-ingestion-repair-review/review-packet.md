# GATE-SHARED-TASK-INGEST-REPAIR-1 Shared Task Context And Ingestion Repair Review Packet

Generated: 2026-06-05

Status: refreshed after third direct-review `REVISE` and
`SHARED-TASK-INGEST-PLAYABLE-REPAIR-3`; direct human review may inspect the
remote snapshot recorded below after publication, but the gate is not closed
and no product authority exists.

Reviewed remote evidence snapshot: `codex/shared-task-ingest-repair3` at
`9c82c115927f1f1dcad30ec7c3325493b4791dd3`. Direct push to `main` is blocked
by required GitHub status checks, so this branch is the published inspection
surface until the PR/check flow updates `main`.

## Review Scope

Review whether the repaired source-context ingestion evidence is now good
enough to authorize only a later controlled adoption-preparation sprint.

This packet is limited to review-only transformations:

- an external-primary actual-exam transformation for Zoohee question 3;
- an owned textbook-source transformation for `1.1.3 Grafieken en tabellen`.

The third direct review accepted Repair 2 as a big step forward but still held
the gate because the labs remained interaction-weak. Repair 3 therefore checks
interaction quality while preserving three-card target economy:

- the actual-exam task is reduced to source values, calculation, and
  conclusion;
- the textbook task starts with `graph_construction_substitute` for
  `Teken een P-Q-grafiek bij de tabel`;
- the original actual-exam question is visible in the right-side task flow;
- actual-exam task 1 uses compact source-cell selection, not repeated
  value/role dropdown rows;
- actual-exam task 3 carries the calculated `EUR 649 per jaar` value from task
  2 and uses constrained direction selection;
- the textbook graph task uses click-to-place points as the primary path, with
  typed coordinate entry collapsed as fallback only;
- graph labels and numeric scale remain hidden until correct axis selection;
- prompt blocks must not render as source material, completed graph output must
  stay hidden before graph-construction success, and source panes must remain
  readable without visible long file paths.

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
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/repair3-direct-review-comments.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/comment-resolution-log.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/renewed-comment-resolution-log.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/repair3-comment-resolution-log.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-plan.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-baseline.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-planning-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-command-log.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-command-log.jsonl`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-lead-review-assignment.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-lead-review-round1.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-lead-review-corrections.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-lead-review-round2.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-verification-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-visual-qa-report.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-transformation-economy-report.md`
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
- the textbook `desktop-axis-selected` screenshot;
- `SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-visual-qa-report.md`;
- `SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-transformation-economy-report.md`;
- task-family maps and operation/answer traces for both transformations;
- repair-3 direct-review comments and resolution log.

Checker-readable requirement statement: both labs must preserve question visibility after source scrolling.
Checker-readable authority statement: the textbook source is not official exam authority.
Checker-readable target-task statement: Target-task economy is required.
Checker-readable graph statement: `graph_construction_substitute` must be the primary textbook task.
Checker-readable click graph statement: click-to-place graph points are required unless a human waiver exists.
Checker-readable delayed-label statement: graph labels and numeric scale must be hidden before correct axis selection.
Checker-readable exam-carry statement: actual-exam task 3 must carry task-2 value and constrain direction.
Checker-readable source-pane statement: source panes must hide long file paths and pass desktop source/table readability.

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
5. Confirm the original actual-exam question is visible in the right task pane.
6. Confirm actual-exam task 1 has compact source-cell selection with no
   repeated value/role dropdown rows.
7. Confirm actual-exam task 3 carries the task-2 value and uses constrained
   direction controls.
8. Confirm the textbook task set starts with click-to-place
   `graph_construction_substitute`.
9. Confirm graph labels/numeric scale are hidden before correct axis selection
   and revealed after axis selection.
10. Confirm no prompt block is rendered inside the source pane, no completed
   graph is visible before graph-construction success, desktop source/table
   readability passes, and no closure proposal or gate-closure record exists.

## Planned Review Focus

| Surface | Current state | Review issue |
|---|---|---|
| actual-exam authority | external-primary source refs preserved | decide whether authority remains strong enough |
| actual-exam orientation | original question visible in right task pane | decide whether the task flow is now understandable |
| actual-exam source selection | compact cell selection, no value/role dropdown grid | decide whether task 1 is playable without overload |
| actual-exam conclusion | task-2 value carried into constrained direction control | decide whether task 3 consumes the calculation cleanly |
| textbook authority | owned-source only | decide whether authority boundary remains clear |
| textbook graph task | primary click-to-place `graph_construction_substitute` | decide whether the target task feels graph-like enough |
| graph reveal policy | labels/scale hidden before axis selection; completed graph hidden before success | decide whether premature answer reveal is repaired |
| source/task boundary | prompts excluded and long paths hidden from source pane | decide whether orientation/readability is repaired |
| support policy | formula/procedure collapsed | decide whether support is secondary |
| product boundary | all product/adoption authorities false | decide whether later work must stay bounded |

## Full Planned Review Comment Prompts

Use these IDs when commenting directly on this packet.

`SHAREDINGEST-Q1`: Does the actual-exam evidence preserve the official prompt,
source table, correction-model steps, and point rules strongly enough for
source-dependent task transformation review?

`SHAREDINGEST-Q2`: Is the original actual-exam question visible enough in the
right-side task flow while the source remains readable on the left?

`SHAREDINGEST-Q3`: Is actual-exam task 1 now simple enough with compact
source-cell selection, or does it still feel overloaded?

`SHAREDINGEST-Q4`: Does actual-exam task 3 properly consume the calculated
`EUR 649 per jaar` value and constrain the direction without becoming
free-text repetition?

`SHAREDINGEST-Q5`: Does the textbook-source evidence keep its authority bounded
to owned textbook material, without implying official exam authority?

`SHAREDINGEST-Q6`: Is `Teken een P-Q-grafiek bij de tabel` actually converted
into an active click-to-place graph-construction task?

`SHAREDINGEST-Q7`: Are axis labels, numeric scale, and completed graph reveal
timed correctly, or is any answer/target graph information still visible too
early?

`SHAREDINGEST-Q8`: Is the 50 percent ambiguity appropriately secondary to the
primary graph-construction task?

`SHAREDINGEST-Q9`: Are the screenshots and visual QA sufficient to judge
source-pane readability, compact exam controls, graph workspace size, initial
hidden-label state, axis-selected state, wrong state, corrected state,
completed graph state, mobile, and dark mode?

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
- graph labels or numeric scale are visible before correct axis selection;
- the textbook graph task lacks click-to-place points without a human waiver;
- typed coordinate entry is primary or open by default;
- source panes show long file paths or fail desktop source/table readability;
- the original actual-exam question is not visible in the right task pane;
- actual-exam task 1 renders repeated value/role dropdown rows or requires
  more than four selections / two distractors;
- actual-exam task 3 does not carry the task-2 value or lacks constrained
  direction control;
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

After this packet and repair-3 evidence are pushed and the reviewed remote hash
is recorded, send this packet for renewed direct human review comments. Do not
close the gate until returned comments, a comment-resolution log, and explicit
human closure confirmation exist.

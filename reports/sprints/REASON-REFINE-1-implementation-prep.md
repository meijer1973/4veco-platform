# Sprint REASON-REFINE-1: Implementation Prep

Generated: 2026-05-31

## Purpose

Define the implementation-preparation requirements for a future reasoning
answer-form hardening sprint.

This file does not authorize implementation. A later exact sprint must be
approved before any code, CSV, generated-output, or student-facing route
change occurs.

## Recommended Future Route

Do not rebuild the reasoning game from scratch.

Recommended future path:

```text
REASON-REFINE-2 or an equivalent separately authorized implementation plan
-> reasoning answer-form metadata and scaffold implementation
-> live rendered-output proof
-> CHECK-Q2-PLAN consumes the repaired route evidence
-> L1.7B-Q2 / GATE-L1.7B-Q2 decide target-equivalent exit-ticket use
```

`CHECK-Q2-PLAN` may consume this sprint as planning input, but it must not
pretend that the current reasoning route already proves the target-equivalent
answer-form chain.

## File-Level Future Ownership

| File or surface | Future role | Required guardrail |
|---|---|---|
| `source-data/book-1/reasoning/*.csv` | Possible source for answer-form metadata, operation tags, source-use flags, and criteria IDs | Separate implementation authority required; no edits from REASON-REFINE-1. |
| `build-scripts/platform/build-reasoning-questions.js` | Validate and carry answer-form metadata into generated reasoning data or review documents | Reject standalone `A81`; reject held lanes unless explicitly marked held; reject unknown answer-form lanes. |
| `engines/reasoning-engine.js` | Build `structured_reasoning` tasks from answer-form metadata instead of one generic criterion set | Keep mode 5 self-check-only unless a later gate authorizes evaluated constructed response. |
| `engines/reasoning-ui.js` | Render answer-form-specific feedback, example chains, source-use cues, and local next action | No mastery, diagnostic, sequencing, target-equivalent, summative, AI, PV, or product-use claims. |
| `engines/task-shell-engine.js` and `engines/task-shell-ui.js` | Shared input/evaluation/rendering layer for constructed response | Do not create reasoning-only private state or feedback systems when the shared shell can own it. |
| `build-scripts/sprints/check-reason-ux2-route-output.js` or successor | Future route-output validation | Check answer-form metadata, source-use modifier boundary, held-lane blocks, and no forbidden claims. |
| `reports/json/skilltree-generator-readiness.json` | Evidence that answer-form MTUs remain generator-blocked/non-interactive until unblocked | Future implementation must prove no exposed generator-blocked route leaks. |

## Future Data Contract Requirements

A future implementation plan should choose one of these routes:

1. Add answer-form metadata columns to reasoning CSV files.
2. Create a reviewed derived route-mapping artifact that decorates existing
   reasoning rows without changing the CSV schema.
3. Use target-operation coverage metadata from a later checkpoint plan to
   drive the reasoning task shell.

Whichever route is chosen, it must provide:

- `answer_form_lane`;
- `answer_form_units`;
- `answer_form_modifier`;
- `underlying_answer_form`;
- `operation_tags`;
- source-use fields when `A81` is used;
- friendly student-facing labels, not visible MTU codes;
- boundary flags with `targetEquivalentProof: false` for practice routes;
- review evidence linking the task to the target operation chain.

## Required Future Validator Upgrades

A future implementation sprint must add or update validators that fail when:

- a `structured_reasoning` task has no answer-form lane;
- `ANS_BRON_GEBRUIKEN` or `A81` appears without an underlying answer form;
- `A97`, `A98`, and `A99` are collapsed into one generic `leg uit` route;
- `A96` calculation answer form is used without coordination with math/graph
  calculation tasks;
- held `ANS_ANALYSEER_BEOORDEEL`, `ANS_MOTIVEER_CLASSIFICATIE`, or graph lanes
  are treated as live reasoning tasks;
- answer-form MTUs marked generator-blocked become exposed as student-facing
  skill-tree routes;
- mode 5 self-check increments persistent `goed` progress before a later gate
  approves evaluated constructed response;
- output contains target-equivalent, diagnostic, mastery, sequencing,
  summative, AI, PV, Scale Gate, or product-use claims.

## Rendered-Output Proof Required Later

A future reasoning implementation cannot close on code/data checks alone. It
must include live rendered-output proof for at least:

- one `A97` `leg-uit-dat` reasoning task;
- one `A98` `leg-uit-of` reasoning task;
- one `A81` source-use task combined with an underlying answer form;
- one calculation-plus-explanation coordination case for `1.1.2` D31;
- one graph/table/source reasoning case for `1.1.3` after the graph-axis
  blocker is repaired;
- mobile or narrow viewport route-panel state;
- dark-mode route/task state;
- feedback state showing answer-form-specific repair cues;
- no visible internal MTU codes in student-facing labels;
- no target-equivalent completion language.

## State and Feedback Ownership

Future reasoning hardening must preserve the GAME-ARCH-2 ownership rules:

- route recommendations belong to the shared route layer;
- task attempt state belongs to the task shell or reasoning wrapper as
  documented by the shared task-shell API;
- example chains and repair cues may come from the reasoning domain module;
- feedback rendering should use the shared task shell when possible;
- target-equivalent status belongs only to the future checkpoint/exit-ticket
  layer after `L1.7B-Q2` and `GATE-L1.7B-Q2`.

No future sprint should create a separate reasoning-only feedback or mastery
system to bypass the shared route/task-shell model.

## Stop Conditions For Future Implementation

Stop a future reasoning implementation sprint if it:

- implements answer-form scaffolds without a reviewed data contract;
- edits generated output by hand;
- treats generic self-check as target-equivalent proof;
- exposes generator-blocked `A80`, `A81`, or `A96`-`A99` as skill-tree routes;
- uses `A81` source use without an underlying answer form;
- uses held analysis/evaluation, classification, graph, or EX overlay lanes as
  live tasks without exact gate authority;
- adds target-equivalent completion language outside `GATE-L1.7B-Q2`;
- creates diagnostics, adaptive routing, mastery, sequencing, summative use,
  AI decisions, PV projection, Scale Gate 1 reliance, or product use.

## Current Sprint Boundary

REASON-REFINE-1 closes only if it produces planning artifacts, checker proof,
lead review, and roadmap handoff. It does not authorize `REASON-REFINE-2`,
engine implementation, generated output, or target-equivalent claims by itself.

# Sprint TASK-SHELL-UX-2: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/TASK-SHELL-UX-2-plan.md`

## Current source state

Platform baseline commit at sprint start:

- `0887e27b405d0b5b5a2ce24d4d7dcbdd08f615b0`

Lesson baseline commit at sprint start:

- `c8cea22645b4d616f64f4a701f30808694e55a0f`

Current platform status contains one unrelated untracked file:

- `knowledge/exit-ticket-game-1.1.1.zip`

That file is outside this sprint and must not be imported, moved, edited,
staged, or used as proof.

## Current task-shell implementation

The shared task shell currently supports these runtime families:

- `choice`
- `numeric_input`
- `calculation_work_capture`
- `final_answer_entry`
- `unit_notation_field`
- `short_constructed_response`
- `structured_short_response`
- `table_value_selection`
- `graph_reading`
- `point_placement`
- `graph_construction_substitute`
- `structured_reasoning`

Current implementation facts before this sprint:

- `calculation_work_capture` renders a work textarea and a final-answer input.
  It does not render a separate unit/notation subfield.
- `TaskShellEngine.evaluateTask` can deterministically match calculation work
  and final answer, but has no dedicated `unitNotation` expectation.
- `TaskShellUI.renderFeedback` returns one card and a practice-route link, but
  action markup and feedback-focus ownership are not uniformly documented.
- `TaskShellUI.renderTask` creates an aria-live, role=status feedback region.
  Some wrappers replace/focus their own region; exit-ticket task-shell feedback
  does not currently focus the region after checking.
- `structured_short_response` is runtime-supported and used by the `1.1.2`
  exit ticket, but was only added after GAME-ARCH-2 and needs this sprint's
  explicit UI contract.
- Task-shell hints are not a shared hidden/collapsible task-shell affordance.

## Current product proof state

`CHECK-SHORT-EXIT-1` records:

- `1.1.1` has an advisory short check only.
- `1.1.2` has the reviewed local target-equivalent exit ticket and approved
  local completion copy.
- `1.1.3` has no check route and no target-equivalent graph/table exit ticket.

`STANDARD-EXERCISES-1` records:

- math/calculation, graph/table, and the reviewed `1.1.2` exit-ticket actions
  are mostly covered by the shared task shell;
- `structured_short_response` needs documentation and UX hardening here;
- reasoning modes beyond the current structured self-check need standard
  expansion later under `REASON-STD-1`;
- guided practice and procedure support need later keep/wrap/standardize
  decisions under `ENGINE-UNIFY-1`.

## Data integrity notes

This sprint may change platform runtime/UI/test files and may regenerate Book
1 lesson output through `node scripts/deploy.js`. It may make only narrow
`source-data/book-1/exit-ticket/1.1.2.json` interaction changes needed for
unit/notation proof while preserving the reviewed target-equivalent scope and
completion language.

No protected reference data under `references/machine/` or
`references/external/` may change. No target-exercise registry fields,
candidate storage, reasoning CSVs, `1.1.3` exit-ticket source, diagnostic
state, adaptive routing, mastery/sequencing, student-facing AI, summative
state, PV projection, PV machine promotion, CP-6/Year-1 promotion, Scale Gate
1, or product-wide use is authorized.

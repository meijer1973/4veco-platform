# Sprint CHECKSURFACE-113-EXEMPLAR-EXIT-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-plan.md`

## Current source state

Platform baseline commit at sprint start:

- `0a97c5333b42ebc94092b54eef66cc5bb81d7512`

Platform branch at sprint start:

- `codex/task-improvement`

Platform working tree at sprint start contains one package input:

- `knowledge/113-excellent-exit-ticket-v3-package.zip`

Lesson baseline commit inspected before generated-output work:

- `ed5b72c9bcd1a15640efbed7e7d15a7fad9f8475`

Lesson repo was clean but on unrelated branch
`codex/agent-branch-safety-20260607`; `origin/main` had advanced to
`d89f13d`. Generated output must move to a dedicated lesson task branch before
deploy.

## Current exit-ticket state

`source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` currently:

- uses a split `source_task_workspace`;
- includes a static formula context block `ctx-icecream-formula`;
- asks graph construction through `graph_construction_substitute`;
- asks graph reading as numeric input only, without interval-first selection;
- asks the 50 percent claim through `calculation_work_capture` with
  `selectionMode: interval_halving_check`;
- relies on interval and conclusion selectors rather than formula building and
  visible percentage work;
- uses very tight graph point tolerances;
- keeps `targetEquivalent.gateApproved: false` and
  `completionLanguageEligible: false`.

The v3 handoff explicitly rejects the static formula reveal and the older
choice-assisted claim-control pattern.

## Current shared task-shell state

The shared task shell already supports:

- `graph_construction_substitute`;
- `graph_reading`;
- `formula_builder`;
- `calculation_work_capture`;
- context blocks and source/task workspace rendering;
- hidden exit-ticket criteria display through `exit-ticket-ui.js`.

Gaps before this sprint:

- `graph_reading` does not render interval options before numeric input;
- numeric parsing rejects values such as `-50%` and `50% daling`;
- graph construction snaps pointer clicks to axis ticks, not source table
  points;
- graph construction matching requires the exact expected points rather than
  any two distinct accepted table points;
- current policy checker still expects the older formula context and
  `interval_halving_check` pattern for `1.1.3`.

## Package baseline

The package contains:

- `113-excellent-exit-ticket-v3-README.md`
- `113-excellent-exit-ticket-v3-prototype.html`
- `113-excellent-exit-ticket-v3-candidate-data.json`
- `113-excellent-exit-ticket-v3-implementation-handoff.md`
- `113-excellent-exit-ticket-v3-quality-brief.md`
- `113-excellent-exit-ticket-v3-policy-and-exemplar-guidance.md`

The candidate JSON is close to the current schema but requires adaptation:

- current `requiredWorkText` validation expects labelled groups;
- shared task-shell must learn interval-first graph reading;
- shared graph construction must learn accepted table points and snapping.

## Data integrity notes

No protected reference data is authorized to change. `references/machine/` and
`references/external/` must remain untouched.

No target-exercise registry writes are authorized. No generated lesson output
may be hand-edited. No product authority, completion language, diagnostics,
mastery/sequencing, PV, Scale Gate 1, broad product use, or student/product use
is authorized.

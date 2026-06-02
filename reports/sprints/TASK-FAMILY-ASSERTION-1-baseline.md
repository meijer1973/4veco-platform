# Sprint TASK-FAMILY-ASSERTION-1: Baseline

Generated: 2026-06-02

Status: baseline before implementation; no runtime mutation authorized by this
file.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`

Plan JSON: `references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`

## Baseline Summary

`assertion_reason` is currently a planned structured-choice family from the
`TASK-FAMILY-CHOICE-1` contract, but it is not yet implemented as a
first-class shared task-shell family.

Current implemented shared task-shell families include generic `choice`,
`cloze_text`, `multi_select`, `cloze_tile_select`, `sentence_builder`,
`formula_builder`, `step_ordering`, `source_value_selection`,
`source_chain_builder`, `label_placement`, `matching_pairs`, and
`two_tier_choice`.

`TASK-FAMILY-TWO-TIER-1` has closed PASS WITH FLAGS and provides the most
recent runtime-family implementation pattern: strict response-shape matching,
shared UI helpers, wrapper delegation, rendered report fixture, custom checker,
proof JSON, and lead-review cycle.

## Required Contract Source

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`

Accepted `assertion_reason` contract:

- student action: judge a statement and reason pair, including whether the
  reason explains the statement;
- response shape: `{ "value": "optionId" }`;
- expected shape: `{ "kind": "assertion_reason", "value": "optionId" }`;
- validation/evaluation owner: shared task shell;
- feedback owner: shared task shell plus domain module;
- proof limit: lower priority, sparse, reviewed, and not generic quiz variety.

## Baseline Gaps

- `engines/task-shell-engine.js` does not yet declare or validate
  `assertion_reason`.
- `engines/task-shell-ui.js` does not yet render assertion/reason relation
  controls or export assertion-specific collection/click helpers.
- `engines/task-shell.css` does not yet style `.ts-assertion-*` controls.
- Exit-ticket, skilltree, and graph wrappers do not yet collect
  `assertion_reason` through shared `TaskShellUI` helpers.
- Focused tests, deterministic checker, proof JSON, fixture, screenshot
  manifest, result artifacts, and lead-review artifacts do not yet exist.

## Data integrity notes

The following surfaces must remain unchanged during implementation:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output
- target-exercise registry records
- candidate-storage files
- `knowledge/exit-ticket-game-1.1.1.zip`

## Product-authority baseline

No generated lesson output, source exercise adoption, target-equivalent
reliance, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV, Scale Gate 1, or product-wide use is currently
authorized.

## Planned Evidence

Implementation may proceed only after plan validation and planning review.
Closure requires:

- strict runtime implementation;
- focused Jest coverage;
- custom checker;
- proof JSON;
- rendered fixture and screenshot manifest;
- structural lead review round 1, correction log, and round 2;
- result markdown/JSON and diff summary;
- roadmap/index/dashboard refresh;
- final commit and push.

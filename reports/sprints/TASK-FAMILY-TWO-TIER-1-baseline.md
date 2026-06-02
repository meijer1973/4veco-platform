# Sprint TASK-FAMILY-TWO-TIER-1: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-TWO-TIER-1-plan.md`

Plan JSON: `references/data/sprints/TASK-FAMILY-TWO-TIER-1.plan.json`

## Current state

The shared task shell currently supports the earlier reviewed structured
choice and construction families, including `choice`, `multi_select`,
`cloze_text`, `step_ordering`, and `matching_pairs`. It does not yet declare or
render `two_tier_choice`.

The structured-choice contract at
`reports/sprints/TASK-FAMILY-CHOICE-1-contract.md` defines
`two_tier_choice` as an answer-plus-reason action with response shape
`{ "answer": "optionId", "reason": "reasonId" }`. The roadmap now lists
`TASK-FAMILY-TWO-TIER-1` as the next structured-choice implementation sprint
after `TASK-FAMILY-MATCH-1`.

## Evidence read

- `../CLAUDE.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-MATCH-1-result.md`
- current shared task-shell engine/UI/CSS, wrapper, and focused-test files

## Runtime baseline

Expected before implementation:

- `engines/task-shell-engine.js` does not declare `two_tier_choice`.
- `engines/task-shell-ui.js` has no two-tier renderer, collector, or click
  helper.
- `engines/task-shell.css` has no `.ts-two-tier-*` styles.
- exit-ticket, skilltree, and graph wrappers do not collect or handle
  `two_tier_choice`.
- focused tests do not include `two_tier_choice`.
- no `TASK-FAMILY-TWO-TIER-1` sprint checker or proof JSON exists.

## Data integrity notes

Protected reference data is out of scope. This sprint must not edit:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output
- target-exercise registry fields
- candidate storage
- `knowledge/exit-ticket-game-1.1.1.zip`

## Product-authority baseline

This sprint starts with no authority for generated lesson output, source-data
adoption, target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or product-wide use.

## Baseline validation commands

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-TWO-TIER-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-TWO-TIER-1
```

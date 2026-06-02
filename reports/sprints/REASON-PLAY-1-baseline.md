# Sprint REASON-PLAY-1: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/REASON-PLAY-1-plan.md`

## Current State

`REASON-ADOPT-1` is complete and pushed. Generated Book 1 reasoning pages now
render modes 0, 1, and 3 through the shared `step_ordering` task shell, while
mode 5 remains `structured_reasoning` self-check.

Current carried flags:

| Area | Baseline state | REASON-PLAY-1 question |
|---|---|---|
| Dual feedback | local task-shell feedback plus global reasoning summary/next-action | Is this understandable or confusing? |
| Mobile route panel | visible but below long checked tasks | Can a student still find route context and next action? |
| Dark route panel | route-panel contrast remains flagged | Is dark-mode route text readable enough? |
| Mode 3 | ordered-chain bridge, not full visual flow diagram | Is the bridge understandable as practice, with honest wording? |
| Mode 2 | private/held error detection | Keep held; do not overclaim. |
| Mode 4 | private/held matching/classification route | Keep held; do not overclaim. |

## Prior Evidence

- `reports/sprints/REASON-ADOPT-1-result.md`
- `reports/sprints/REASON-ADOPT-1-playable-proof.md`
- `reports/json/reason-adopt1-proof.json`
- `reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round2.md`

## Data integrity notes

Protected reference data remains unchanged: `references/machine/` and
`references/external/` are read-only for this sprint.

No source reasoning CSV edits, source exit-ticket data edits, target-exercise
field writes, candidate storage writes, protected-reference mutations,
diagnostics, mastery/sequencing, Scale Gate 1, or product authority are
authorized by this sprint.

Generated Book 1 output may change only through `node scripts/deploy.js
"../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` if a usability-agent
blocker requires an allowed UI/CSS/copy repair.

## Baseline Risk

The main risk is false confidence from route-output validators. A checker can
prove the task loads and matches answers, but cannot prove a student
understands what to click, why feedback appeared, or what to do next. This
sprint must test comprehension and trace the agents' thinking, not only DOM
state.

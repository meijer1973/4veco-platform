# Sprint QUALITY-STD-1: Result

## Plan reference

- `reports/sprints/QUALITY-STD-1-plan.md`

## Summary

QUALITY-STD-1 moved quality pressure into planning. Both repository
instruction files now require quality-driven execution, the companion
specification now has a planning quality floor, platform paragraph-build
guidance includes fulfilment matrix expectations, lead-reviewer instructions
compare output against the original specification first, and the sprint-plan
checker now rejects plans that omit quality sections or proof language.

## Acceptance test results

- `npm.cmd test -- --runInBand build-scripts/sprints/check-sprint-plan.test.js`
- `npm.cmd test -- --runInBand build-scripts/sprints/check-scope-language.test.js`
- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-2-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-2 --complete`
- `node build-scripts/sprints/check-sprint-bundle.js QUALITY-STD-1 --complete`
- `npm.cmd run check:scope-language`
- `npm.cmd test`

## Changed files

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `docs/sprints/README.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-plan.test.js`
- `reports/sprints/GAME-UX-2-plan.md`
- `reports/sprints/QUALITY-STD-1-*`
- `references/data/sprints/QUALITY-STD-1.*.json`
- sibling lesson governance/specification files

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

## Open follow-ups

- REV-STD-1 remains open for wider review-packet and lead-review-standard
  hardening.
- Historical plans are not rewritten unless reopened.

## Rollback instructions

Revert the QUALITY-STD-1 governance documentation, checker, focused test, and
GAME-UX-2 plan compatibility changes. Then rerun the sprint-plan and bundle
checks.

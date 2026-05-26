# Sprint QUALITY-STD-1: Diff Summary

## Summary

QUALITY-STD-1 adds planning-time quality enforcement without changing generated
lesson output or protected references.

## Platform changes

- Added quality-driven execution language to `AGENTS.md`.
- Added quality-standard guidance to `BUILD-PARAGRAPH.md`.
- Added planning quality section requirements to `docs/sprints/README.md`.
- Updated `agents/lead-reviewer-agent.md` to judge original specification
  fulfilment before sprint-plan framing.
- Hardened `check-sprint-plan.js`.
- Added `check-sprint-plan.test.js`.
- Updated the current GAME-UX-2 plan for checker compatibility.

## Lesson-side changes

- Added quality-driven execution language to lesson `AGENTS.md`.
- Added Specification-Fulfilment Rule and Planning Quality Floor to the
  companion specification.
- Recorded QUALITY-STD-1 in the lesson roadmap and sprint archive.

## Protected surfaces

No protected surfaces changed. `references/machine/` and
`references/external/` remain untouched.

# Sprint LEAD-REVIEW-1: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/LEAD-REVIEW-1-plan.md`

## Current state

`AGENTS.md` requires a separated-agent workflow for roadmap sprints. The
reference roadmap also records that sprint closure includes structural
lead-review assignment, round-1 review, correction log, and round-2 recheck.

The current sprint bundle checker only enforces lead-review files when the
plan/result metadata opts into lead review. Recent non-MTU operational sprints
closed with `lead_review_required: false`, so the checker accepted complete
bundles without lead-review artifacts.

## Recent sprint review inventory

| Sprint | Human gate artifacts | Lead-review artifacts | Baseline action |
|---|---:|---:|---|
| SPEC-ET-1 | no | no | lead-review audit required |
| EX-LESSON-1 | no | no | lead-review audit required |
| GAME-UX-3A | no | no | lead-review audit required |
| ENGINE-OP-1 | no | no | lead-review audit required |
| SKILLMAP-OP-1 | no | no | lead-review audit required |
| MTU-H4A | yes | no | excluded by user direction |
| MTU-H4B | yes | no | excluded by user direction |
| MTU-H4C | source gate from H4B | no | excluded with MTU lane |

## Data integrity notes

No protected reference data is needed for this repair. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain forbidden.

No generated lesson output under `../4veco-lessen/Boek *` is in scope. This
sprint repairs review protocol and sprint evidence only.

## Stop conditions

- Stop if lead-review repair requires protected reference mutation.
- Stop if lead-review repair requires generated lesson output edits.
- Stop if the lead reviewer returns REVISE, FAIL, or PAUSE and the required
  correction cannot be completed.
- Stop if future human-gate enforcement would invalidate already-closed MTU
  gates contrary to the user's explicit instruction.

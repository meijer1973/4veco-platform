# VISION-1 Lead Review Assignment

Generated: 2026-06-06

Sprint: `VISION-1`

## Scope

Assign a lead-review cycle for `VISION-1 Strategic Product Vision
Canonicalization`. The review must judge whether the sprint adds a canonical
strategic product vision without weakening the existing operational product
end-state, without changing generated lesson output, and without authorizing
diagnostics, mastery, adaptive routing, summative use, student-facing AI, PV,
Scale Gate 1, product-wide use, or broad scaling.

## Evidence to inspect

- `reports/sprints/VISION-1-plan.md`
- `reports/sprints/VISION-1-baseline.md`
- `reports/sprints/VISION-1-planning-review.md`
- `reports/sprints/VISION-1-verification-review.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-vision.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `build-scripts/sprints/check-product-vision-links.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/VISION-1-command-log.jsonl`

## Review plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Strategic vision separation | Lead reviewer | Vision is strategic; product-end-state remains operational; companion spec remains surface contract. | required |
| Requested-content coverage | Lead reviewer | Vision covers moat, parity, efficiency, understandability, motivation, diffusion, agent reliability, and boundary rules. | required |
| Machine-readable companion | Lead reviewer plus checker | JSON has stable keys and aligned pillars/constraints. | required |
| Link and map coverage | Lead reviewer plus checker | Key platform and lesson docs route agents to `product-vision.md`. | required |
| Boundary integrity | Lead reviewer | Diff does not touch generated lesson output, engines, source data, protected reference data, or product-use authority. | required |
| Validation evidence | Lead reviewer | Command log records the required acceptance commands with exit code 0 before closure. | required |

## Reviewer instructions

Round 1 should identify blockers, missing evidence, weak boundary language, or
overclaiming. The main agent must apply corrections or record accepted
follow-up flags before round 2. Round 2 must recheck the final bundle and
return PASS or PASS WITH FLAGS only if no blocker remains.

Use `agents/lead-reviewer-agent.md` expectations for consolidated go/no-go
judgement. Because this is a specification/governance sprint, the student
surface evidence is source/spec/checker evidence; rendered lesson-output proof
is not required and must remain future sprint work.

## Required next action

Run lead-review round 1 after the core artifacts and initial command log
exist. Run lead-review round 2 after corrections and final closure artifacts
are ready.

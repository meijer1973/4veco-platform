# Y1-GOLDEN-ROLLOUT-WAVE-1 Lead Review Assignment

Generated: 2026-08-23

Sprint: `Y1-GOLDEN-ROLLOUT-WAVE-1`

Reviewer: subagent lead reviewer.

## Scope

Review the current-main renewal of the first-three Golden controlled-wave
guard. The result must remain L4 and must not broaden the historical
`PASS_CONTROLLED_ROLLOUT` decision.

## Required Review Lanes

| Lane | Required decision |
|---|---|
| Authority boundary / Rawls | Controlled eligibility is distinct from actual rollout/adoption and student/product authority. |
| Rendered-proof boundary | Historical 46-case screenshots are reused only because every rendered input is blob-equal; navigation destinations are present and do not expand the visual claim. |
| Route/link | First-three route families and destinations resolve; no route migration is introduced. |
| Teacher-learning | Not re-opened because no student-facing/rendered input changed; confirm the delta proof supports that exemption. |
| Student experience | Not re-opened because no student-facing/rendered input changed; confirm the delta proof supports that exemption. |
| Repository/testing | Exact event ranges, scope policy, negative tests, maps/indexes/dashboard, and CI wiring fail closed. |
| Lead synthesis | Return `OK_TO_CLOSE` only when every core requirement is met and no stale evidence remains. |

## Evidence

- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js`
- `reports/json/y1-golden-rollout-wave-1-rendered-delta-proof.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`

Round 1 must classify every finding. Corrections are mandatory for any core
failure or blocker. Round 2 may return `OK_TO_CLOSE` only after reinspection of
the corrected files and current validation evidence.

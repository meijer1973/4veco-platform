# Planning Review: MTU-GENBLOCK-HARDEN-1

Sprint: `MTU-GENBLOCK-HARDEN-1`
Reviewer: planning/review role
Date: 2026-06-07

## Scope

Evidence inspected:

- `../CLAUDE.md`
- `CLAUDE.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `docs/sprints/RX.6-plan.md`
- `reports/sprints/RX.6-result.md`
- `reports/json/skilltree-generator-readiness.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `engines/skill-map-engine.js`
- `engines/skill-map-route-ui.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`

Subagent note: an explorer planning-review subagent was started but did not
return after repeated waits and was shut down. This planning-review artifact
therefore records the main-agent planning review before implementation edits.
The sprint still requires separate verification and lead-review artifacts
before closure.

## Findings

| Finding | Disposition |
|---|---|
| The plan must not rely on historical RX.6 counts because current reports show 51 blocked units after later MTU work. | Covered by baseline and result requirement. |
| `SKILLS` is already interactive-only, but `ROUTE_SKILLS` can be student-visible via `SkillMapRouteUI`. | Must harden source and deploy route catalogs. |
| Non-A route concepts must remain available for `1.1.1` concept routes. | Hardening must target blocked A-domain rows, not all non-interactive rows. |
| The checker currently validates the report, but not a deterministic negative fixture. | Add negative-fixture rejection to checker and test evidence. |
| Generated lesson-output route proof is useful but outside the user-authorized verification surface. | Omit generated-output checks and name as follow-up. |
| PV, diagnostics, mastery, sequencing, and product authority are policy boundaries, not implementation targets. | Checker must validate false authority flags and blocked downstream-use labels. |

## Planning Verdict

Verdict: PASS WITH FLAGS

The plan is operational enough to proceed after recording baseline evidence.
Flag carried into implementation: the planning-review subagent did not return,
so final closure must include a stronger verification review and structural
lead-review cycle that inspects the finished artifacts.

## Required Next Action

Proceed with the scoped implementation only after this planning-review record,
baseline, plan metadata, and roadmap row exist. Stop if `ROUTE_SKILLS`
hardening breaks non-A concept routes or if the negative fixture is not
rejected by the checker.

# Sprint MTU-GENBLOCK-HARDEN-1: Verification Review

Generated: 2026-06-07

## Scope

This verification checks whether the sprint satisfied the exposure-hardening
specification without converting generator-blocked status into authority.

Evidence inspected:

- `reports/json/skilltree-generator-readiness.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.jsonl`

## Verification Findings

| Requirement | Evidence | Result |
|---|---|---|
| Every missing-generator active A-domain unit has an explicit block record. | Readiness summary and RX.6 block file show 51 explicit blocked records for 51 missing-generator units. | PASS |
| Blocked units stay out of interactive exports. | Source and deploy summaries show 47 interactive units, 51 blocked rows, and 0 blocked interactive leaks. | PASS |
| Blocked A-domain units stay out of route exports. | Source and deploy route counts both equal 202; blocked route leak count is 0. | PASS |
| Non-A route concepts remain available. | Jest verifies `B01` and `B02`; direct boundary check keeps `D31` route-visible while A80/A81/A96-A99 are not route-visible. | PASS |
| Negative fixture fails. | `check-skilltree-generator-readiness.js` reports `OK negative fixture rejected: blocked unit marked interactive`. | PASS |
| Downstream authority remains false. | Policy and block file carry false flags for route use, PV, diagnostics, adaptive routing, mastery, and product authority. | PASS |

## Product-Route Relevance

The next first-three-paragraph proof lane still depends on blocked answer-form
units. This sprint prevents accidental route exposure; it does not solve those
product blockers.

| Product route | Current relevant blocked units | Verification disposition |
|---|---|---|
| `1.1.1` target proof | `A96` calculation answer form; `A98` direction-choice explanation; possible held evaluation lane remains separate. | Keep blocked. Future work needs generator implementation or reviewed non-interactive proof design before product-route use. |
| `1.1.2` target proof | `A96` calculation form plus `A97`/`A98` explanation forms for the index-point trap; `D31` remains a non-A route concept, not A-domain generator authority. | Keep blocked. Future math/reasoning work must add explicit D31 proof and answer-form generator coverage. |
| `1.1.3` target proof | `A81` source-use modifier plus `A96`/`A97`/`A98` underlying answer forms; graph-axis repair remains separate. | Keep blocked. Future graph/reasoning work must repair axis convention and source-use answer-form coverage. |
| Other blocked A-domain units | All remaining missing-generator A-domain units in the RX.6 block file. | Keep blocked until generators exist, validators pass, and a later sprint explicitly authorizes exposure. |

## Omitted Proof

Generated Book 1 route screenshots and live lesson-output checks were omitted
by plan. That omission is acceptable for this sprint because it changed only
source/deploy route catalogs and authorizes no generated lesson output or
product-route adoption.

## Verdict

PASS. The sprint proves and hardens the requested source/deploy exposure
boundary. No student-facing product authority is broadened.

## Required Next Action

Keep blocked answer-form units out of route/product surfaces. Start a separate
generator implementation or reviewed non-interactive proof-design sprint before
using A80/A81/A96-A99 in first-three paragraph product routes.


# SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1 Evidence Map

Date: 2026-06-22

## Primary Evidence

| Evidence | Path |
|---|---|
| Machine proof JSON | `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json` |
| Screenshot manifest | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshot-manifest.md` |
| Screenshot manifest JSON | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshots/manifest.json` |
| Route inventory | `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-route-inventory.md` |
| Review packet | `reports/review-gates/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1/review-packet.json` |

## Capture Coverage

| Paragraph | Landing | Start | Leer | Oefen | Skill map | Representative practice | Short check | Exit ticket |
|---|---|---|---|---|---|---|---|---|
| `1.1.1` | desktop light, mobile dark | captured | captured | captured | captured | `redeneer-spel` | initial and completed feedback | initial, completed desktop, completed mobile dark |
| `1.1.2` | desktop light, mobile dark | captured | captured | captured | captured | `wiskundevaardigheden` | initial and completed feedback | initial, completed desktop, completed mobile dark |
| `1.1.3` | desktop light, mobile dark | captured | captured | captured | captured | `grafiekenspel` | initial and completed feedback | initial, completed desktop, completed mobile dark |
| `1.1.4` | mobile dark only | not claimed | not claimed | not claimed | not claimed | not claimed | not claimed | same-copy hygiene only |

## Source And Generated Surface Facts

| Surface fact | Evidence |
|---|---|
| `1.1.1`, `1.1.2`, `1.1.3` exit tickets are `target_equivalent_exit_ticket` | Proof JSON `surface_data.*.exit_ticket` |
| Exit tickets have `gateApproved:true` and `targetReadinessEvidence:true` | Proof JSON `surface_data.*.exit_ticket` |
| Exit tickets keep `completionLanguageEligible:false` | Proof JSON `surface_data.*.exit_ticket` and completed screenshots |
| `1.1.1`, `1.1.2`, `1.1.3` short checks are `advisory_short_check` | Proof JSON `surface_data.*.short_check` |
| Short checks keep `candidate:false`, `gateApproved:false`, and `targetReadinessEvidence:false` | Proof JSON `surface_data.*.short_check` |
| Short checks and exit tickets render as Golden Workbench | Proof JSON `proof.all_first_three_check_exit_surfaces_golden:true` |

## Boundary Evidence

| Boundary | Evidence |
|---|---|
| Product-route adoption not authorized | Proof JSON `authority.product_route_adoption_authorized:false` |
| Diagnostics/mastery/PV/student use not authorized | Proof JSON `authority.*:false` |
| Scale Gate 1 not authorized | Proof JSON `authority.scale_gate_1_authorized:false` and `scale_gate_readiness.scale_gate_1_ready:false` |
| A96 remains held | Proof JSON `scale_gate_readiness.scale_gate_1_hold_reason` and result finding `SCALE3P-A96-001` |

## Checker And CI Wiring

| Item | Path |
|---|---|
| Capture harness | `build-scripts/sprints/capture-scale-proof-3p-readiness-product-path-proof-1.js` |
| Focused checker | `build-scripts/sprints/check-scale-proof-3p-readiness-product-path-proof-1.js` |
| Package script | `package.json` `check:scale-proof-3p-product-path` |
| CI step | `.github/workflows/platform-ci.yml` `Validate Scale Proof 3P product path proof` |

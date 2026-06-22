# GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1 Evidence Map

Date: 2026-06-18

## Machine Evidence

| Evidence | Path | Result |
|---|---|---|
| Proof JSON | `reports/json/gate-product-3p-authority-copy-repair-and-rereview-1-proof.json` | `ready_for_human_gate_product_3p_review` |
| Capture script | `build-scripts/sprints/capture-gate-product-3p-authority-copy-repair-and-rereview-1.js` | Passed |
| Proof checker | `build-scripts/sprints/check-gate-product-3p-authority-copy-repair-and-rereview-1.js` | Passed |
| Route inventory | `reports/sprints/GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1-route-inventory.md` | First-three route/link proof passes |
| Screenshot manifest | `reports/sprints/GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1-screenshot-manifest.md` | 22 screenshots captured |
| Screenshot manifest JSON | `reports/sprints/GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1-screenshots/manifest.json` | 22 screenshots captured |

## Authority-Copy Evidence

| Paragraph | Gate claim | Neutral row copy | Neutral tile copy | Forbidden strings absent |
|---|---:|---:|---:|---:|
| `1.1.1` | true | true | true | true |
| `1.1.2` | true | true | true | true |
| `1.1.3` | true | true | true | true |
| `1.1.4` | false, same-copy hygiene only | true | true | true |

Forbidden strings checked:

- `doelopgave-niveau`
- `doelopgave op hetzelfde niveau`
- `antwoordvorm aankunt`
- `aankunt`
- `adaptieve oefenroute`
- `adaptieve oefeningen`
- `adaptief`
- `voorgestelde volgende oefening`
- `op basis van lokale voortgang`
- `op basis van je lokale voortgang`

## Landing Advice Copy Evidence

The former adaptive-route tile is neutralized in the generator, fixtures, and
regenerated lesson landing output:

- title: `Oefenadvies`
- copy: `Gebruik je korte check, feedback en oefenwerk om een passende volgende oefenstap te kiezen.`
- action/disabled fallback: `Kies oefenstap` or generated disabled
  `In voorbereiding`
- data tile id: `oefenadvies`

## Route And Rendered Evidence

| Requirement | Evidence |
|---|---|
| Start/Leer/Oefen/skill-map/normal-practice/Check/Exit ticket route families present | Proof JSON `route_inventory.paragraphs[*].all_required_families_present:true` |
| Local landing links resolve | Proof JSON `proof.all_landing_links_resolve:true` |
| Desktop/mobile/dark coverage | Proof JSON `proof.rendered_desktop_mobile_dark_coverage:true` |
| Completed feedback states captured | Proof JSON `proof.completed_feedback_states_captured:true` |
| Horizontal overflow absent | Screenshot inspection entries in proof JSON |
| Forbidden authority and completion/readiness terms absent in captures | Proof JSON `proof.no_broad_authority_terms_in_captures:true` and screenshot `target_completion_terms:[]` |
| `1.1.1` completed feedback visible | Refreshed desktop/mobile dark screenshots show the `Winst klopt` feedback card |

## Source And Generated Authority Flags

| Requirement | Evidence |
|---|---|
| Exit tickets remain target-equivalent candidates only | Proof JSON `proof.exit_tickets_target_readiness_approved:true` |
| Completion language remains held | Source/generated `completionLanguageEligible:false` for `1.1.1`, `1.1.2`, and `1.1.3` |
| Short checks remain advisory | Proof JSON `proof.short_checks_advisory_only:true` |
| No readiness flag mutation | Git diff excludes source data and generated data flag files |

## Explicit Non-Authority

This bundle does not authorize:

- product-route adoption;
- diagnostics;
- mastery/sequencing;
- PV;
- summative use;
- Scale Gate 1;
- broad product use;
- student/product use;
- target-equivalent completion language.

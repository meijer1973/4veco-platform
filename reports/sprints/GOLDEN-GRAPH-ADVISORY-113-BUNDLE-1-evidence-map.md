# GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1 Evidence Map

Date: 2026-06-20

## Machine Evidence

| Evidence | Path | Result |
|---|---|---|
| Proof JSON | `reports/json/golden-graph-advisory-113-bundle-1-proof.json` | `ready_for_human_golden_graph_advisory_113_review` |
| Capture script | `build-scripts/sprints/capture-golden-graph-advisory-113-bundle-1.js` | Passed |
| Proof checker | `build-scripts/sprints/check-golden-graph-advisory-113-bundle-1.js` | Passed |
| Package check | `npm.cmd run check:golden-graph-advisory-113` | Passed |
| Screenshot manifest | `reports/sprints/GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1-screenshot-manifest.md` | 9 screenshots captured |
| Screenshot manifest JSON | `reports/sprints/GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1-screenshots/manifest.json` | 9 screenshots captured |
| Review packet | `reports/review-gates/GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1/review-packet.json` | Lead ready |

## Source And Generated Evidence

| Requirement | Evidence |
|---|---|
| Source uses Golden graph-advisory variant | Proof JSON `proof.golden_graph_advisory_variant_source:true` |
| Generated data uses Golden graph-advisory variant | Proof JSON `proof.golden_graph_advisory_variant_generated:true` |
| Source/generated canonical equality | Proof JSON `proof.source_generated_deep_equal:true` |
| Authority flags match source/generated | Proof JSON `proof.source_generated_authority_flags_match:true` |
| False authority flags preserved | Proof JSON `proof.false_authority_flags_preserved:true` |
| Route links resolve | Proof JSON `source_generated.route_links_resolve:true` |

## Rendered Evidence

| Screenshot | Purpose |
|---|---|
| `desktop-light-initial.png` | Initial desktop Golden advisory surface |
| `desktop-light-wrong-retry.png` | Wrong/retry graph feedback visibly in frame |
| `desktop-light-graph-after-action.png` | Graph success feedback and interval-first reading step |
| `desktop-light-local-success-advisory-complete.png` | Local success and advisory completion state |
| `mobile-light-initial.png` | Mobile light initial state |
| `mobile-dark-initial.png` | Mobile dark initial state with correct toggle label |
| `mobile-dark-local-success.png` | Mobile dark local success/completion state |
| `route-reload-desktop-light.png` | Short-check route reload proof |
| `landing-to-short-check-route.png` | Landing-to-short-check route proof |

Rendered proof confirms:

- desktop, mobile, light, and dark coverage;
- wrong/retry feedback captured;
- graph-after-action feedback captured;
- completion visible only after graph and reading success;
- no horizontal overflow;
- no legacy task shell markers;
- no forbidden authority terms.

## Advisory Route Evidence

| Requirement | Evidence |
|---|---|
| Route choice is not single-correct | `expected.kind:"advisory_choice"` accepts all listed values |
| Route choice is not pre-answered | No pre-rendered oefentip link on initial route-choice surface |
| Route advice is local | `feedbackByOption` gives selected local advice and route |
| Completion is not route-advice gated | Student-action rereview and rendered success proof |
| Practice route remains neutral | Source `practiceRoute.label:"Terug naar paragraafroute"` |

## Explicit Non-Authority

This bundle does not authorize:

- completion language;
- product-route adoption;
- diagnostics;
- mastery or sequencing;
- PV;
- summative use;
- Scale Gate 1;
- broad product use;
- student/product use.

The `1.1.3-exit-ticket` target-readiness flags are not changed by this bundle.

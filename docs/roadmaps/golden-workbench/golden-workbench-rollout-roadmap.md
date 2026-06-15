# Golden Workbench Rollout Roadmap

Updated: 2026-06-12
Roadmap ID: `golden-workbench-rollout-roadmap`
Roadmap version: `v1.0-surface-stabilization`
Roadmap status: `active`
Owner: `platform_team`
Original planning input: `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`
Version index: `docs/roadmaps/roadmap-version-index.json`

## Authority And Scope

This roadmap turns the 2026-06-12 Golden Workbench rollout plan into an
operating sequence. It is subordinate to:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- the product end-state and companion specifications in the lesson repo
- `REV-STD-1` review requirements

If this roadmap conflicts with a later human gate decision, the later human
decision wins. If it conflicts with the active reference-team roadmap, the
reference-team roadmap controls gate authority.

This roadmap does not authorize generated lesson output, product-route
adoption, target-equivalent completion language, diagnostics,
mastery/sequencing, PV projection, Scale Gate 1, broad product use, or
student/product use. Those remain gated by their own review packets and human
decisions.

## Current Proven Surface Set

The Golden Exercise Workbench rollout is in early governed implementation. The
project has proved three bounded route types:

| Surface | Current proof | Boundary |
|---|---|---|
| `1.1.3` exit ticket | Golden graph/table route with graph construction, graph reading, claim control, rendered proof, and no-legacy layout checks. | Use as layout/graph/no-legacy reference, not as formula-token exemplar. |
| `1.1.2` exit ticket | Golden calculation/structured route and rendered lesson transfer proof. | Authority remains held; the answer form is serviceable but below full A96 structure. |
| `1.1.2-korte-check` | Golden advisory short-check route with simple choice/advisory behavior and rendered proof. | Advisory only; does not prove graph, formula, or reasoning short checks. |

The rollout has not proved broad migration of all exit tickets, all short
checks, `1.1.1`, graph-based advisory short checks, full A96 calculation
answer forms, mixed/gemengde target finality, Year 1 closure, Scale Gate 1, or
student/product use.

## Non-Negotiables

- Golden Workbench is route architecture, not a CSS patch.
- Golden routes must use a direct Golden root such as
  `main.ge-page[data-golden-ticket-root]`.
- Golden routes must not use `#exit-ticket-app`, legacy `et-*` route shells,
  `task-shell.css`, `exit-ticket.css`, `skill-map-route.css`,
  `task-shell-ui.js`, or `exit-ticket-ui.js`.
- Hybrid routes that mix `ge-*` and `et-*`/task-shell shell classes are
  blockers.
- Exit-ticket authority must remain held until the relevant target-equivalent
  and gate reviews close.
- Advisory short checks must stay advisory and must not claim
  target-equivalent proof, paragraph completion, diagnostics, mastery, or
  product-route adoption.
- Review packets must use `REV-STD-1`: cite the product end-state and original
  sprint/gate spec, name non-negotiable requirements, include a
  core-requirement checklist, classify findings, and include
  `blocks` / `does_not_block` / `proof_required_to_close` for carried issues.
- `PASS WITH FLAGS` may not carry a missing core requirement.

## Sprint Sequence

| Order | Sprint | Kind | Purpose | May proceed when |
|---|---|---|---|---|
| 1 | `GOLDEN-SURFACE-VISUAL-REVIEW-1` | Review/evidence | Stabilize the three already-rendered Golden surfaces before new rollout. | Start next, from current main, if no newer human instruction supersedes it. |
| 2 | `GATE-CHECK-SURFACE-EXCELLENT-1-REREVIEW` | Human-facing gate review | Review the current renewed check-surface evidence packet and decide whether the gate can move forward. | Sprint 1 records no blocker, and the packet is current. |
| 3 | `Y1-PLACEHOLDER-CANDIDATE-REVIEW-1` | Candidate review | Review concrete mixed/gemengde placeholder target candidates without mutating the registry. | Use the latest concrete candidate lane; the original plan named PR #42. |
| 4 | `EXIT-SHORT-WORKBENCH-111-PLAN-1` | Planning | Decide whether `1.1.1` needs an exit ticket, short check, or both, and whether current variants fit. | Existing surfaces are reviewed and gate/candidate status is understood. |
| 5 | `EXIT-TICKET-WORKBENCH-111-RENDERED-1` or `SHORT-CHECK-WORKBENCH-111-RENDERED-1` | Bounded implementation | Render the first `1.1.1` Golden surface selected by the planning sprint. | The `1.1.1` plan has a reviewed operation chain and variant decision. |
| 6 | `SHORT-CHECK-WORKBENCH-113-PLAN-1` | Planning | Repair/plan the graph advisory short-check variant before any `1.1.3-korte-check` render. | Do not render directly from current source; fake graph-control risks are resolved first. |
| 7 | `A96-CALCULATION-WORKBENCH-REFINE-1` | Quality refinement | Move calculation answers toward explicit formula, substitution, intermediate step, final answer, notation, and conclusion sections. | The current calculation transfer proof is stable and review has bandwidth. |
| 8 | `GATE-PRODUCT-3P-PREP-1` | Gate preparation | Prepare first-three-paragraph product proof only after surface, check-surface, and target-candidate issues are resolved. | Check-surface and product-route gates explicitly allow prep. |

## Immediate Sprint Contract

`GOLDEN-SURFACE-VISUAL-REVIEW-1` is the recommended next sprint from this
roadmap.

Scope:

- `1.1.2` exit ticket
- `1.1.2` advisory short check
- `1.1.3` exit ticket
- shared `golden-ticket-layout.js` / `golden-ticket-layout.css` runtime

Required review work:

- Review desktop, mobile, and dark-mode states for all three rendered routes.
- Confirm no legacy or hybrid shell structure is present.
- Confirm no old internal labels or fake controls are visible.
- Confirm `1.1.2` exit-ticket completion and target-equivalent authority remain
  held.
- Confirm `1.1.2-korte-check` copy remains advisory.
- Confirm `1.1.3` graph behavior does not reintroduce fake slope/connect-line
  controls.
- Confirm route links resolve.
- Record screenshots, DOM evidence, classified findings, and a lead review.

Acceptance:

- `PASS`: no visual/layout regression, no authority overclaim, no legacy shell.
- `REVISE`: visual, copy, proof, or link issues that do not violate a core
  requirement.
- `FAIL`: legacy/hybrid route, wrong authority, missing core proof, or fake
  graph controls.

Explicit non-actions:

- Do not migrate `1.1.1`.
- Do not migrate `1.1.3-korte-check`.
- Do not mutate the target-exercise registry.
- Do not claim product use, target-equivalent completion, diagnostics, mastery,
  PV, Scale Gate 1, or student use.

## Gate And Candidate Follow-Up

After the visual review, review the current renewed
`GATE-CHECK-SURFACE-EXCELLENT-1` packet. The original plan referred to PR #44;
if that packet has been superseded, use the current authoritative packet rather
than the old PR number.

The gate review must prove or explicitly keep held:

- no legacy/hybrid layouts
- screenshots after actual interaction
- `1.1.2` Golden transfer authority held
- `1.1.3` graph/table implementation aligned with current Golden behavior
- no target-equivalent completion-language overclaim
- no diagnostics/mastery/PV/Scale Gate/student-use claim

For mixed/gemengde targets, review the latest concrete candidate lane. The
original plan named PR #42 and warned that PR #41 was superseded. If later
branches replaced those PRs, use the latest concrete candidate packet, not the
abstract superseded one.

## Strategic Posture

The rollout should slow breadth and increase review quality. The product goal
is not Golden-looking pages everywhere. The product goal is that every exercise
surface has the right operation chain, authority level, student interaction,
proof, and no legacy/hybrid contamination.

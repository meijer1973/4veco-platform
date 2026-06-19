# Golden Workbench Rollout Roadmap

Updated: 2026-06-19
Roadmap ID: `golden-workbench-rollout-roadmap`
Roadmap version: `v1.1-product-3p-closed-scale-held`
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

The rollout has now closed `GATE-PRODUCT-3P` narrowly for the bounded
first-three rendered product-path proof after platform PR #111 and lesson PR
#26. The rollout has still not proved broad migration of all exit tickets, all
short checks, `1.1.1`, graph-based advisory short checks, full A96 calculation
answer forms, Start-route mastery-copy safety, mixed/gemengde target finality,
Year 1 closure, Scale Gate 1, or student/product use.

## Current Gate State

As of 2026-06-19:

- `GATE-PRODUCT-3P` is closed only for the first-three rendered product-path
  proof.
- `Scale Gate 1` remains held.
- Product-route adoption, broad product use, student/product use, diagnostics,
  mastery/sequencing, PV, summative use, and target-equivalent completion
  language remain unauthorized.
- The lead Scale Gate readiness result is
  `HOLD_FOR_GOLDEN_ROUTE_REPAIR`.
- The next roadmap-controlled implementation-planning sprint is
  `EXIT-SHORT-WORKBENCH-111-PLAN-1`.

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
| 1 | `EXIT-SHORT-WORKBENCH-111-PLAN-1` | Planning | Decide the reviewed Golden route plan for `1.1.1` exit ticket and short check without mutating target-readiness flags. | Start next from current `main`. |
| 2 | `EXIT-TICKET-WORKBENCH-111-RENDERED-1` | Bounded implementation | Render `1.1.1` exit ticket through Golden Workbench or record an explicit human waiver. | The `1.1.1` plan has a reviewed operation chain and variant decision. |
| 3 | `SHORT-CHECK-WORKBENCH-111-RENDERED-1` | Bounded implementation | Render `1.1.1` short check through Golden advisory Workbench or record an explicit human waiver. | The `1.1.1` advisory route plan is approved. |
| 4 | `SHORT-CHECK-WORKBENCH-113-PLAN-1` | Planning | Repair/plan the graph advisory short-check variant before any `1.1.3-korte-check` render. | Do not render directly from current source; graph-advisory risks are resolved first. |
| 5 | `SHORT-CHECK-WORKBENCH-113-RENDERED-1` | Bounded implementation | Render `1.1.3-korte-check` through a reviewed Golden advisory graph variant. | The graph-advisory plan is approved. |
| 6 | `START-ROUTE-MASTERY-COPY-REPAIR-1` | Authority-copy repair | Remove first-three Start-route mastery/closure phrasing while mastery/sequencing and product-use authority remain held. | Can run in parallel with planning only if scoped to copy and proof. |
| 7 | `A96-CALCULATION-WORKBENCH-REFINE-1` | Quality refinement | Move calculation answers toward explicit formula, substitution, intermediate step, final answer, notation, and conclusion sections. | The current calculation transfer proof is stable and review has bandwidth. |
| 8 | `GATE-PRODUCT-3P-SCALE-GATE-1-READY-REVIEW-1` | Gate preparation/review | Refresh first-three rendered proof and prepare a human Scale Gate 1 readiness packet. | Golden-route repair, Start-copy repair, and A96 disposition are complete or explicitly waived. |

## Immediate Sprint Contract

`EXIT-SHORT-WORKBENCH-111-PLAN-1` is the recommended next sprint from this
roadmap.

Scope:

- `1.1.1` exit ticket route architecture.
- `1.1.1` advisory short-check route architecture.
- Source-data authority flags for `1.1.1`, which must not be mutated unless a
  strict source/generated mismatch is discovered and separately justified.
- Operation-chain and rendered-proof requirements needed for later
  implementation sprints.

Required review work:

- Decide whether `1.1.1` needs an exit ticket, short check, or both in Golden
  Workbench form before Scale Gate 1.
- Preserve `completionLanguageEligible:false`.
- Preserve advisory-only posture for short checks.
- Name the required rendered states, route links, mobile/dark evidence, and
  no-legacy checks for the implementation sprints.
- Classify any waiver request with `blocks`, `does_not_block`, and
  `proof_required_to_close`.

Acceptance:

- `PASS`: a precise, implementation-ready Golden route plan with no authority
  overclaim.
- `REVISE`: missing proof detail or ambiguous route operation chain.
- `FAIL`: target-readiness mutation, completion-language authorization,
  product-use claim, or a plan that carries a missing core Scale Gate
  requirement under `PASS WITH FLAGS`.

Explicit non-actions:

- Do not migrate routes in this planning sprint.
- Do not hand-edit generated lesson output.
- Do not claim product use, target-equivalent completion, diagnostics,
  mastery/sequencing, PV, Scale Gate 1, or student use.

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

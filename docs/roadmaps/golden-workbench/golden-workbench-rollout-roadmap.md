# Golden Workbench Rollout Roadmap

Updated: 2026-06-19
Roadmap ID: `golden-workbench-rollout-roadmap`
Roadmap version: `v1.2-product-3p-closed-111-bundle-next`
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
- The next roadmap-controlled substantial bundle is
  `GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1`.
- `EXIT-SHORT-WORKBENCH-111-PLAN-1` is an internal phase of that bundle, not a
  separate human-review stop.

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
| 1 | `GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1` | Substantial implementation/review | Treat `EXIT-SHORT-WORKBENCH-111-PLAN-1` as an internal phase, migrate both `1.1.1` check surfaces to governed Golden Workbench routes, repair first-three Start-route mastery/closure copy, regenerate output, and return only with rendered proof or a hard blocker. | Start next from updated `main` after PR #116 merges. |
| 2 | `GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1` | Substantial implementation/review | Design and implement the `1.1.3` graph advisory short check without reviving fake graph controls. | The `1.1.1` migration/Start-copy bundle is merged or explicitly unblocks `1.1.3` work. |
| 3 | `A96-CALCULATION-WORKBENCH-REFINE-1` | Quality refinement | Move `1.1.2` calculation answers toward explicit formula, substitution, intermediate step, final answer, notation, and conclusion sections. | Golden route repairs are stable enough that A96 refinement can be reviewed without masking route blockers. |
| 4 | `FIRST-THREE-POST-REPAIR-PROOF-AND-SCALE-GATE-1-REVIEW-1` | Gate preparation/review | Recapture first-three evidence after repairs and return for the actual Scale Gate 1 human decision. | Golden-route repair, Start-copy repair, and A96 disposition are complete or explicitly waived. |

## Immediate Sprint Contract

`GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1` is the
recommended next substantial bundle from this roadmap. `EXIT-SHORT-WORKBENCH-111-PLAN-1`
is an internal phase of this bundle, not a separate human-review stop.

Scope:

- Internal `1.1.1` architecture planning and fit analysis.
- `1.1.1` exit ticket route architecture.
- `1.1.1` advisory short-check route architecture.
- `1.1.1` exit ticket Golden rendering.
- `1.1.1` advisory short-check Golden rendering.
- First-three Start-route mastery/closure copy repair.
- Source-data authority flags for `1.1.1`, which must not be mutated unless a
  strict source/generated mismatch is discovered and separately justified.
- Rendered proof, checker coverage, and source/generated parity for the
  implemented bundle.

Required review work:

- Decide internally whether the current Golden calculation/structured and
  advisory variants fit `1.1.1`, or whether narrow extensions are required.
- Have the sub-agent lead reviewer approve the architecture plan before
  implementation.
- Implement and render both `1.1.1` check surfaces unless a hard blocker is
  fully specified.
- Repair first-three Start-route mastery/closure copy centrally where possible.
- Preserve `completionLanguageEligible:false`.
- Preserve advisory-only posture for short checks.
- Name the required rendered states, route links, mobile/dark evidence, and
  no-legacy checks for the implementation sprints.
- Classify any waiver request with `blocks`, `does_not_block`, and
  `proof_required_to_close`.

Acceptance:

- `PASS`: both `1.1.1` check surfaces are implemented as governed Golden
  routes, first-three Start copy is repaired, rendered proof is complete, and
  no authority overclaim is present.
- `REVISE`: missing proof detail, ambiguous route operation chain, incomplete
  Start-copy repair, or a rendered/state coverage gap.
- `FAIL`: target-readiness mutation, completion-language authorization,
  product-use claim, or a plan that carries a missing core Scale Gate
  requirement under `PASS WITH FLAGS`.

Explicit non-actions:

- Do not hand-edit generated lesson output.
- Do not return after planning alone, checker work alone, Start-copy repair
  alone, or a partial renderer.
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

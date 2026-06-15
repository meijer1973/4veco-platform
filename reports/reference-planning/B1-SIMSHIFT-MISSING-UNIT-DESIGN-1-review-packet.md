# B1-SIMSHIFT-MISSING-UNIT-DESIGN-1 Review Packet

Status: REV-STD-1 design decision packet; not a finality or closure packet

## Verdict

Verdict: DECISION PACKET READY / `1.3.3` FINALITY STILL BLOCKED

This packet recommends retaining the simultaneous demand/supply shift concept
as Year 1 diagnostic target design only if a later governed protected-reference
lane adds or maps an explicit MTU-level operation and then updates the target
registry. This PR does not mint that unit, does not edit the target registry,
and does not mark `1.3.3` `reviewed_final`.

This is not `PASS WITH FLAGS`: the missing simultaneous-shift operation is a
core requirement for the current `1.3.3` target exercise, so it remains
blocking for `1.3.3` finality and for any Year 1 / CP-6 / Scale Gate reliance.

## Required Citations

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- End-state requirement used here: every paragraph is built backward from a
  paragraph target exercise; later target-equivalent proof must cover the
  paragraph target operation chain at the same cognitive level with matching
  answer forms.

Original sprint/gate spec:

- `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- That sprint explicitly stopped if work required protected-reference mutation,
  new MTU minting, generated lesson output, product-route adoption, or Year 1 /
  CP-6 / Scale Gate closure.

This sprint spec:

- `reports/sprints/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-plan.md`

Additional evidence:

- `references/authored/course-target-exercises.json`
- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- `references/authored/economic_mathematical_precision_reference.md`
- `reports/sprints/REV-STD-1-flag-disposition.md`

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan.
2. Cite the original sprint/gate spec that created the carried blocker.
3. Name non-negotiable requirements.
4. Include a core-requirement checklist.
5. Classify findings using REV-STD-1 language.
6. Include `blocks`, `does_not_block`, and `proof_required_to_close` for every
   carried issue.
7. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
8. Do not edit `references/machine/*`, `references/external/*`,
   `references/authored/course-target-exercises.json`, or
   `references/owned/course-blueprint-v5.md`.
9. Do not generate or alter lesson output.
10. Do not mint a new MTU or assign a final MTU id in this lane.
11. Do not promote `1.3.3` to `reviewed_final`.
12. Preserve `1.3.4` as a one-shift mixed target that deliberately keeps
    simultaneous-shift reasoning out of its replacement path.
13. Do not claim Year 1 closure, CP-6 closure, Scale Gate authority,
    product-route adoption, diagnostics, mastery, PV, or student/product use.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Cite product end-state | met | Required citations above | Packet may proceed to review. |
| Cite original sprint/gate spec | met | `B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md` | Carried blocker is tied to its source contract. |
| Cite this sprint plan | met | `B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-plan.md` | Current scope is explicit. |
| Name non-negotiables | met | Non-negotiable list above | Boundaries cannot be weakened silently. |
| Include core checklist | met | This section | REV-STD-1 structure satisfied. |
| Classify findings | met | Finding table below | Findings are typed. |
| Include blocks / does_not_block / proof_required_to_close | met | Finding table and quality log | Carried issues are bounded. |
| No missing core under PASS WITH FLAGS | met | Verdict is not PASS WITH FLAGS | `1.3.3` finality remains blocked. |
| Preserve protected-reference boundary | met | Reports and generated indexes only | No machine/external/authored/owned reference mutation. |
| Preserve product-use boundary | met | Explicit non-authorization below | Downstream gates remain blocked. |

## Current Source State

`1.3.3` currently contains this target chain:

- calculate a new equilibrium after a supply shift;
- compare old and new equilibrium after one supply shift;
- calculate a new equilibrium after a demand shift;
- draw both one-shift changes with arrows;
- calculate the equilibrium when both demand and supply shift at the same time
  and explain what can be predicted without calculation.

`B1-MIGRATED-V5-TARGET-QUALITY-1` found that the first four operations map to
live units such as A02, A04, A06, A42, A49, and D13. It did not find a live
reviewed unit for the final operation: simultaneous demand/supply shift
reasoning where one direction may be determinate and another may be ambiguous
without relative magnitudes.

CP.6c classified this dependency as `true_missing_unit`, with no mapped live
unit, and said mutation was not authorized in that lane.

## Design Recommendation

Recommended route: retain the simultaneous-shift concept as a Year 1 diagnostic
checkpoint, but keep `1.3.3` non-final until a later governed
protected-reference lane creates or maps the missing MTU-level operation and
updates the target registry.

The future operation should be defined around this minimum chain:

1. Analyze the demand shift in isolation.
2. Analyze the supply shift in isolation.
3. Name each isolated effect on equilibrium price and quantity.
4. Combine directional pressures.
5. Identify which equilibrium direction is determinate from direction alone.
6. Identify which equilibrium direction is ambiguous without relative
   magnitudes.
7. Use function-based calculation only as confirmation when equations are
   provided.

Minimum answer forms:

- short written comparison of isolated effects;
- directional table or paired statements for price and quantity pressures;
- conceptual ambiguity explanation;
- optional algebraic equilibrium calculation when functions are given;
- optional graph with old/new demand and supply curves if the target asks for
  visual proof.

Candidate prerequisites for the later unit decision:

- A06 for equilibrium calculation;
- A42 for graphical before/after shifts with arrows;
- A49 for supply-curve graphing with economist axes;
- D13 for supply-side cost/supply-shift reasoning;
- D32 for movement-versus-shift classification;
- D33 for demand and supply shift factors.

The later lane may decide the final unit id, wording, prerequisites, registry
fields, and target update. This packet deliberately does not assign the id.

## Alternatives Considered

| Option | Decision | Rationale |
|---|---|---|
| Retain as Year 1 after governed MTU/registry follow-up | recommended | It matches the existing `1.3.3` target intent while keeping the missing core requirement honest. |
| Remove simultaneous-shift reasoning from `1.3.3` and keep only separate one-shift work | not recommended now | It would make finality easier but would rewrite the active target design and should be an explicit human curriculum decision. |
| Defer simultaneous shifts out of Year 1 without target rewrite | rejected for closure | It leaves the target exercise carrying a missing core requirement and cannot close `1.3.3`. |
| Treat existing one-shift MTUs as sufficient | rejected | CP.6c found no live unit for the simultaneous-shift ambiguity operation. |

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1SIM-001 | core_requirement_met | The packet cites product end-state, the original target-quality sprint, this sprint plan, current registry state, CP.6c classification, and REV-STD-1. | Nothing for packet publication | Future protected-reference mutation | Review packet and quality log remain linked. |
| B1SIM-002 | core_requirement_blocker | Current `1.3.3` still includes a simultaneous demand/supply shift operation without a reviewed live MTU mapping. | `1.3.3` `reviewed_final`; Year 1 closure; CP-6 closure; Scale Gate reliance on Book 1 market-equilibrium coverage | Publishing this non-mutating decision packet; ordinary scoped work that does not claim `1.3.3` finality | A later governed protected-reference lane mints/maps the MTU-level operation and updates `references/authored/course-target-exercises.json`, or explicitly rewrites the target to remove the operation. |
| B1SIM-003 | core_requirement_met | The recommended design route separates isolated one-shift analysis, combined directional pressures, determinate/ambiguous outcome reasoning, and calculation-as-confirmation. | Nothing for the design recommendation | Target registry mutation and lesson output | Human approval of the route plus a later protected-reference implementation PR. |
| B1SIM-004 | scale_blocker | This packet is not product proof and does not close downstream check-surface, product-route, diagnostics, mastery, PV, or student/product-use blockers. | Scale Gate 1; product-route adoption; diagnostics; mastery; PV; student/product use | Packet publication and later scoped MTU/target design work | Renewed human review closes the relevant downstream gates with rendered/product proof. |
| B1SIM-005 | scope_boundary | `1.3.4` remains a reviewed one-shift mixed target and must not absorb the unresolved simultaneous-shift dependency by implication. | Any claim that `1.3.4` covers simultaneous-shift reasoning | Preserving `1.3.4` reviewed-final status as one-shift integration | A separate target rewrite or unit decision explicitly changes that boundary. |

## Explicit Non-Authorization

This packet does not authorize protected reference mutation, machine/external
reference mutation, authored target-registry mutation, generated lesson output,
MTU minting, target finality promotion, Year 1 closure, CP-6 closure,
diagnostics, adaptive routing, mastery decisions, PV projection, Scale Gate
authority, product-route adoption, or student-facing product use.

## Recommended Next Action

Open a follow-up protected-reference implementation lane after human review
chooses the route:

- if approved, create or map the simultaneous-shift MTU-level operation and
  update `1.3.3` through governed registry scripts/checks;
- if rejected, rewrite `1.3.3` to remove simultaneous-shift reasoning and keep
  Year 1 to separate one-shift equilibrium work;
- in either case, run a fresh human review before `1.3.3` can become
  `reviewed_final`.

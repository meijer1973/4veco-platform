# B1-NORMAL-INFERIOR-TERM-DECISION-1 Review Packet

Status: REV-STD-1 authored-registry terminology decision packet; not a closure
packet

## Verdict

Verdict: REGISTRY DECISION READY / DOWNSTREAM PROOF STILL BLOCKED

The carried `1.2.2` normal/inferior-good dependency is closed for target-registry
purposes. Year 1 `1.2.2` may use supplied normal-good context when students must
show the effect of an income increase on a demand curve, but students are not
required to classify normal versus inferior goods as an active Year 1 target
operation.

This is not `PASS WITH FLAGS`: the prior missing-unit flag is not carried as
non-blocking. It is removed from the `1.2.2` registry record and replaced with
an explicit term-light decision boundary. `1.2.4` remains term-free.

## Required Citations

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- End-state requirement used here: every paragraph is built backward from a
  paragraph target exercise; later target-equivalent proof must cover the
  paragraph target operation chain at the same cognitive level with matching
  answer forms.

Original sprint/gate spec:

- `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`

This sprint spec:

- `reports/sprints/B1-NORMAL-INFERIOR-TERM-DECISION-1-plan.md`

Additional evidence:

- `references/authored/course-target-exercises.json`
- `reports/reference-planning/B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-review-packet.md`
- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-quality-log.md`
- `references/authored/economie-terminologie.md`

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan.
2. Cite the original sprint/gate spec that created the carried flag.
3. Name non-negotiable requirements.
4. Include a core-requirement checklist.
5. Classify findings using REV-STD-1 language.
6. Include `blocks`, `does_not_block`, and `proof_required_to_close` for
   carried issues.
7. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
8. Do not edit `references/machine/*` or `references/external/*`.
9. Do not generate or alter lesson output.
10. Preserve `1.2.4` as term-free mixed practice unless a later explicit review
    changes that boundary.
11. Do not claim Year 1 closure, CP-6 closure, Scale Gate authority,
    product-route adoption, diagnostics, mastery, PV, or student/product use.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Cite product end-state | met | Required citations above | Packet may proceed to review. |
| Cite original sprint/gate spec | met | `B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md` | Carried flag is tied to its source contract. |
| Cite this sprint plan | met | `B1-NORMAL-INFERIOR-TERM-DECISION-1-plan.md` | Current scope is explicit. |
| Name non-negotiables | met | Non-negotiable list above | Boundaries cannot be weakened silently. |
| Include core checklist | met | This section | REV-STD-1 structure satisfied. |
| Classify findings | met | Finding table below | Findings are typed. |
| Include blocks / does_not_block / proof_required_to_close | met | Finding table and quality log | Carried issues are bounded. |
| No missing core under PASS WITH FLAGS | met | Verdict is not PASS WITH FLAGS | The `1.2.2` missing-unit flag is closed, not carried. |
| Preserve protected-reference boundary | met | Authored registry and reports only | No machine/external/lesson mutation. |
| Preserve product-use boundary | met | Explicit non-authorization below | Downstream gates remain blocked. |

## Decision

Decision: keep Year 1 `1.2.2` term-light.

Allowed in `1.2.2`:

- supplied normal-good context, such as "Butter is a normal good";
- income-change demand-shift reasoning;
- graphing the demand shift left or right;
- distinguishing an own-price movement from a non-price demand shift;
- naming income as one demand-shift factor.

Not required as a Year 1 `1.2.2` target operation:

- classifying an unfamiliar good as normal or inferior;
- defining normal goods versus inferior goods as a standalone concept pair;
- interpreting income elasticity;
- using `Ei` or luxury-good classification.

`1.2.4` remains term-free. It may consolidate income-driven demand shifts using
plain wording such as "at every price level buyers want more/fewer units", but
it must not require normal/inferior-good terminology unless a later explicit
review changes the target.

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1NI-001 | core_requirement_met | `1.2.2` currently gives the good type in the prompt and asks for the demand-shift effect, not classification of normal versus inferior goods. | Nothing for target-registry decision | Later lesson proof and product proof | Registry diff removes the stale missing-unit flag and records the decision boundary. |
| B1NI-002 | core_requirement_met | Year 1 should keep active target operations focused on income-driven demand shifts, movement-versus-shift, and demand-factor examples. | Nothing for `1.2.2` registry status | Later Book 2 income-elasticity terminology | `1.2.2` terminology decision metadata remains linked to this packet. |
| B1NI-003 | core_requirement_met | `1.2.4` remains term-free and does not introduce normal/inferior-good classification. | Reintroducing term-dependent mixed-target claims without later review | Current reviewed `1.2.4` mixed target | Current registry keeps `1.2.4` term-free; later change requires explicit review. |
| B1NI-004 | carried_issue | Target-equivalent lesson proof is not closed by this registry terminology decision. | Clean target-equivalent proof claims for generated `1.2.2` or `1.2.4` lesson output | Merging this authored-registry decision | Later lesson-evidence packet proves the generated lesson operation chain and answer forms. |
| B1NI-005 | scale_blocker | This packet is not product proof and does not close downstream authority. | Year 1 closure; CP-6 closure; Scale Gate 1; product-route adoption; diagnostics; mastery; PV; student/product use | Publishing this scoped decision PR | Later closure/product-proof gates using REV-STD-1 and rendered/product evidence. |

## Explicit Non-Authorization

This packet does not authorize machine/external reference mutation, generated
lesson output, income-elasticity unit design, target-equivalent lesson proof,
Year 1 closure, CP-6 closure, diagnostics, adaptive routing, mastery decisions,
PV projection, Scale Gate authority, product-route adoption, or student-facing
product use.

## Recommended Next Action

After merge, continue with `B1-CHAPTER-MIXED-TARGET-AUDIT-1` to inspect whether
`1.1.4`, `1.2.4`, and `1.3.4` consolidate only their approved prior paragraph
targets without smuggling in unresolved dependencies.


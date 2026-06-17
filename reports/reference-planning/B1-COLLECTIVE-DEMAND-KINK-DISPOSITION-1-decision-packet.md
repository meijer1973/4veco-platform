# B1-COLLECTIVE-DEMAND-KINK-DISPOSITION-1 Decision Packet

Status: REV-STD-1 authored-registry decision packet; not a product closure packet

## Decision

Decision: retain the `1.2.3` collective-demand dropout operation in Year 1, but
only as term-light table/function aggregation.

Allowed Year 1 operation:

- add quantities at the same price across individual or group demand tables;
- add linear demand functions at the same price when the functions are supplied
  in Year 1 form;
- identify that a buyer group may contribute zero demand beyond a price range;
- explain in ordinary language that the collective-demand shape changes when a
  buyer group leaves the market or contributes zero units.

Not required:

- formal kink terminology;
- piecewise-function notation;
- advanced function-domain analysis;
- abstract curve-shape theory.

## Required Citations

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- End-state requirement used here: every paragraph is built backward from a
  paragraph target exercise; later target-equivalent proof must cover the
  target operation chain at the same cognitive level with matching answer
  forms.

Original sprint/gate specs:

- `reports/sprints/B1-CHAPTER-MIXED-TARGET-AUDIT-1-plan.md`
- `reports/reference-planning/B1-CHAPTER-MIXED-TARGET-AUDIT-1-review-packet.md`
- `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-review-packet.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- `reports/reference-planning/B1-NORMAL-INFERIOR-TERM-DECISION-1-review-packet.md`

This sprint spec:

- `reports/sprints/B1-COLLECTIVE-DEMAND-KINK-DISPOSITION-1-plan.md`

Additional evidence:

- `references/authored/course-target-exercises.json`
- `references/authored/gemengde-opgaven-target-standard.md`
- `references/owned/course-blueprint-v5.md`
- `references/machine/micro-teaching-units.json`
- `references/machine/micro-teaching-units.md`

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan.
2. Cite the original sprint/gate specs that created or exposed the carried
   blocker.
3. Name non-negotiable requirements.
4. Include a core-requirement checklist.
5. Classify findings using REV-STD-1 language.
6. Include `blocks`, `does_not_block`, and `proof_required_to_close` for
   carried issues.
7. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
8. Do not edit `references/machine/*` or `references/external/*`.
9. Do not generate or alter lesson output.
10. Preserve `1.2.4` as term-free for normal/inferior-good terminology.
11. Do not require formal kink terminology, piecewise notation, advanced domain
    analysis, or abstract curve-shape theory.
12. Do not claim target-equivalent proof, Year 1 closure, CP-6 closure, Scale
    Gate authority, product-route adoption, diagnostics, mastery, PV, or
    student/product use.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Cite product end-state | met | Required citations above | Packet may proceed to review. |
| Cite original sprint/gate specs | met | Required citations above | Carried blocker is tied to source contracts. |
| Cite this sprint plan | met | `B1-COLLECTIVE-DEMAND-KINK-DISPOSITION-1-plan.md` | Current scope is explicit. |
| Name non-negotiables | met | Non-negotiable list above | Boundaries cannot be weakened silently. |
| Include core checklist | met | This section | REV-STD-1 structure satisfied. |
| Classify findings | met | Finding table below | Findings are typed. |
| Include blocks / does_not_block / proof_required_to_close | met | Finding table and quality log | Carried issues are bounded. |
| No missing core under PASS WITH FLAGS | met | Verdict is not PASS WITH FLAGS | Prior blocker is closed for registry audit, not carried. |
| Preserve protected-reference boundary | met | Authored registry and reports only | No machine/external/lesson mutation. |
| Preserve downstream authority boundary | met | Explicit non-authorization below | Product and Scale gates remain blocked. |

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1CDKD-001 | core_requirement_met | A47 and A48 already cover collective-demand table aggregation and algebraic aggregation; `1.2.3` can map the retained dropout operation to those units without minting new MTUs. | Nothing for authored-registry disposition | Target-equivalent lesson proof and product proof | Registry record lists A47/A48 and removes the vague missing-unit flag. |
| B1CDKD-002 | core_requirement_met | Buyer-group dropout is retained only as ordinary-language zero-demand/market-exit reasoning after aggregation at equal prices. | Requiring formal kink, piecewise, or domain proof without later review | Term-light Year 1 collective-demand practice | Registry metadata names allowed and not-required operations. |
| B1CDKD-003 | core_requirement_met | `1.2.4` now consolidates only the accepted `1.2.3` boundary and changes its prompt wording away from formal kink terminology. | Reintroducing formal kink language into `1.2.4` without later review | Current mixed-target registry audit rerun | Target registry validator and mixed-target audit rerun pass. |
| B1CDKD-004 | carried_issue | Target-equivalent lesson proof is not closed by this registry decision. | Clean generated-output proof claims for `1.2.3` or `1.2.4` lesson output | Merging this authored-registry disposition | Later lesson-evidence packet proves the generated lesson operation chain and answer forms. |
| B1CDKD-005 | scale_blocker | This packet is not product proof and does not close downstream authority. | Year 1 closure; CP-6 closure; Scale Gate 1; product-route adoption; diagnostics; mastery; PV; student/product use | Publishing this scoped decision PR | Later REV-STD-1 closure/product-proof gates with rendered/product evidence. |

## Registry Implementation

Implemented in `references/authored/course-target-exercises.json`:

- `1.2.3` now lists A47/A48 as required and newly introduced skills.
- `1.2.3` clears the prior vague `missing_units_flagged` entries.
- `1.2.3` records `collective_demand_dropout_decision` with the retained
  term-light boundary.
- `1.2.4` includes A47/A48 as assumed prior knowledge.
- `1.2.4` asks students to explain how the collective-demand curve changes
  shape at the office-worker exit point, not to explain a formal kink.
- `1.2.4` records `collective_demand_dropout_boundary` and
  `mixed_target_audit_after_disposition`.

## Explicit Non-Authorization

This packet does not authorize machine/external reference mutation, generated
lesson output, target-equivalent lesson proof, Year 1 closure, CP-6 closure,
diagnostics, adaptive routing, mastery decisions, PV projection, Scale Gate
authority, product-route adoption, summative use, or student-facing product
use.


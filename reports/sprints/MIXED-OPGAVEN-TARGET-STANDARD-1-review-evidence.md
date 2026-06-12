# Sprint MIXED-OPGAVEN-TARGET-STANDARD-1: Review Evidence

## Product End-State Citation

- Textbook end-state: `docs/roadmaps/textbook/textbook-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint spec: `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md`

The textbook end-state requires every count-bearing paragraph to have reviewed
target evidence or explicit accepted decision evidence. The operational product
end-state requires context-first routes and answer-construction requirements
where source-dependent tasks are used.

## Non-Negotiable Requirements

- `gemengde_opgaven` sections introduce no new economic theory.
- A reviewed-final mixed target must not be placeholder-backed.
- 2.1.4 must remain `paragraph_kind: gemengde_opgaven`.
- 2.1.4 must integrate skills from `2.1.1`, `2.1.2`, and `2.1.3`.
- 2.1.4 must require source selection, calculation, table or graph
  interpretation, and structured economic conclusion writing.
- Validator policy must reject reviewed-final mixed placeholders.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core-Requirement Checklist

| Requirement | Evidence | Status |
|---|---|---|
| Reusable mixed-target standard | `references/authored/gemengde-opgaven-target-standard.md` | PASS |
| Non-placeholder 2.1.4 target | `references/authored/course-target-exercises.json` removes `target_exercise.placeholder: true` for 2.1.4 | PASS |
| Validator support | `scripts/check-course-target-exercises-v5.js` requires reviewed-final mixed targets to have a non-placeholder target and `mixed_target_profile` | PASS |
| 2.1.1-2.1.3 integration | SmoothBox target combines costs, revenue/profit, break-even, average costs, and marginal table reasoning | PASS |
| Answering-skill guidance | 2.1.4 opgaven now includes compact answer routes for calculation, table/graph interpretation, and explanation | PASS |
| No new theory | Guidance teaches answer structure only; economic operations come from 2.1.1-2.1.3 | PASS |

## 2.1.4 Audit

Outcome: B. Current 2.1.4 is accepted after a small answering-skill repair.

| Criterion | Finding | Classification |
|---|---|---|
| No new theory | Exercises use costs, revenues, break-even, averages, table-based MK/MO, and interpretation already taught in 2.1.1-2.1.3. | PASS |
| Skill integration | SmoothBox requires `TCK`, `TVK`, `TK`, `TO`, winst, `GTK`, `GCK`, break-even, and `MK`/`MO`. | PASS |
| Source selection | Students read Bron 1 and Bron 2, choose formulas for normal production, then switch to table-step reasoning for extra production. | PASS |
| Context depth | SmoothBox is longer and less signposted than starter exercises; FestivalAppels and Denkertje add transfer. | PASS |
| Answer structure | Original one-line route was useful but too compact. The sprint adds explicit answer-structure templates. | FIXED_CORE |
| Table/graph transfer | SmoothBox and FestivalAppels require table interpretation; CampusKoffie and SmoothBox require `TK`/`TO` graph meaning. | PASS |
| Target visibility | SmoothBox is the visible doeloefening and represents the target end state. | PASS |
| Registry clarity | 2.1.4 target is promoted only after placeholder removal and validator support. | PASS |

## Target-Acceptance Statement

Yes. This is the intended target form for a mixed-exercise section. Paragraph
2.1.4 is reviewed as a consolidation and transfer target, not as a normal
theory target. It introduces no new economic theory. Its target is an
integrated, source-first task in which students combine the skills from
2.1.1-2.1.3: total costs, average costs, total revenue, profit, break-even
interpretation, and marginal cost/revenue reasoning. The section also trains
structured economic answering in context-heavy tasks.

Therefore the 2.1.4 target record may move from `placeholder_needs_review` to
`reviewed_final`, provided the target record no longer uses
`target_exercise.placeholder: true` and validator support remains in place.

## Classified Findings

| Finding | Classification | Disposition |
|---|---|---|
| Current v5 checker rejected all reviewed-final mixed targets. | CORE_BLOCKER_FIXED | Replaced blanket Phase A rejection with non-placeholder mixed-target validation. |
| Original 2.1.4 answer guidance was too compressed for the new standard. | CORE_BLOCKER_FIXED | Added compact answer-structure guidance to opgaven source and regenerated outputs. |
| Chapter 2.1 PDF-size warning predates this sprint. | NON_CORE_FOLLOW_UP | Does not block target acceptance; monitor during later print assembly. |

## Carried Issues

| Issue | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|
| Chapter 2.1 PDF-size warning | false | 2.1.4 target acceptance and mixed-target standard closure | Later print-assembly review confirms final chapter PDF size and asset behavior remain acceptable. |
| Future mixed-section applications | false | 2.1.4 reviewed-final target status | Separate governed sprints apply the standard to 1.1.4, 1.2.4, 1.3.4, 2.2.4, and later mixed sections. |

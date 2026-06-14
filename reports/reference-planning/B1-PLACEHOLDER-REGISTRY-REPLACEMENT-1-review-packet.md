# B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1 Review Packet

Status: REV-STD-1 governed authored-registry replacement packet ready; not a
Year 1 closure record

## Verdict

Verdict: REGISTRY REPLACEMENT READY / YEAR 1 CLOSURE BLOCKED

This packet documents the governed registry replacement for the remaining Book
1 gemengde-opgaven placeholders. It replaces `1.1.4` and `1.3.4` in
`references/authored/course-target-exercises.json` using the accepted PR #42
candidate targets. It preserves the current `1.2.4` reviewed target from
INSPECT-9A and adds the missing mixed-target profile required by the current
validator.

This is not `PASS WITH FLAGS`: no missing placeholder core requirement is being
carried as non-blocking. Year 1 closure remains blocked by other evidence lanes.

## Required Citations

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- End-state requirement used here: every paragraph is built backward from a
  paragraph target exercise; target-equivalent proof must cover the target
  operation chain at the same cognitive level with matching answer forms.

Original sprint spec:

- `reports/sprints/B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-plan.md`

Additional evidence:

- `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-review-packet.md`
- `reports/reference-planning/Y1-PLACEHOLDER-TARGET-REVIEW-1-quality-log.md`
- `references/authored/gemengde-opgaven-target-standard.md`
- `references/authored/course-target-exercises.json`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Non-Negotiable Requirements

1. Preserve v5 as active Year 1 baseline and v6 as non-mutating umbrella
   context.
2. Do not edit `references/machine/*` or `references/external/*`.
3. Do not generate lesson output.
4. Do not close Year 1, CP-6, Scale Gate, or student/product-use authority.
5. Keep `1.2.4` term-free for normal/inferior-good terminology unless `1.2.2`
   is separately reviewed.
6. Keep simultaneous-shift reasoning out of `1.3.4`.
7. Preserve existing mainline `1.2.4` target content.
8. Record carried issues with blocks / does_not_block /
   proof_required_to_close.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Cite product end-state | met | Required citations above | Packet may proceed to review. |
| Cite original sprint spec | met | `B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-plan.md` | Scope contract is explicit. |
| Name non-negotiables | met | Non-negotiable list above | Boundaries cannot be weakened silently. |
| Include core-requirement checklist | met | This section | REV-STD-1 structure satisfied. |
| Classify findings | met | Finding table below | Issues are typed. |
| Include blocks / does_not_block / proof_required_to_close | met | Finding table and quality log | Carried issues are bounded. |
| No missing core requirement under PASS WITH FLAGS | met | Verdict is not PASS WITH FLAGS | Placeholder replacement is not treated as closure. |
| Preserve protected-reference boundary | met | No machine/external edits | Protected surfaces untouched. |

## Registry Replacement Summary

| Record | Before this sprint | Action | After this sprint |
|---|---|---|---|
| `1.1.4` | `placeholder_needs_review` | Replaced with PR #42 lunch-box fundraiser target | `reviewed_final` |
| `1.2.4` | `reviewed_final` from INSPECT-9A | Preserved target; added `mixed_target_profile` required by validator | `reviewed_final` |
| `1.3.4` | `placeholder_needs_review` | Replaced with PR #42 one-shift notebook-market target | `reviewed_final` |

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1PR-001 | core_requirement_met | `1.1.4` placeholder record is replaced by the accepted lunch-box integration target. | Nothing for placeholder replacement | Continued Year 1 closure review, provided other blockers remain visible | `node scripts/check-course-target-exercises-v5.js` passes and review evidence remains linked. |
| B1PR-002 | core_requirement_met | `1.3.4` placeholder record is replaced by the accepted one-shift notebook-market target. | Nothing for placeholder replacement | Separate simultaneous-shift missing-unit review | Validator passes and `1.3.4` keeps simultaneous-shift reasoning out of the target. |
| B1PR-003 | core_requirement_met | `1.2.4` was already reviewed-final on main and now has required `mixed_target_profile`. | Nothing for this PR | Preserving INSPECT-9A reviewed target | Validator passes without changing `1.2.4` target content. |
| B1PR-004 | minor_carry_flag | Simultaneous demand+supply shift reasoning remains unresolved. | Restoring simultaneous-shift reasoning to `1.3.4`; claiming that unit covered | `1.3.4` one-shift replacement; later separate design review | `B1-SIMSHIFT-MISSING-UNIT-DESIGN-1` or equivalent decides the missing-unit path. |
| B1PR-005 | minor_carry_flag | Normal/inferior-good terminology remains out of `1.2.4`. | Reintroducing that terminology without `1.2.2` review proof | Current term-free `1.2.4` replacement path | `1.2.2` review explicitly accepts the terminology or it stays out. |
| B1PR-006 | scale_blocker | Year 1 closure remains blocked by migrated-record and evidence-review lanes outside this PR. | Year 1 closure; CP-6 closure; Scale Gate reliance | Publishing this governed registry replacement PR | Complete migrated Book 1 target-quality review, graph/table evidence closure, and simultaneous-shift design decision before closure review. |

## Explicit Non-Authorization

This packet does not authorize protected reference mutation beyond the scoped
authored registry replacement, generated lesson output, Year 1 closure, CP-6
closure, Year 2/3 production, diagnostics, adaptive routing, mastery decisions,
PV projection, Scale Gate authority, or student-facing product use.

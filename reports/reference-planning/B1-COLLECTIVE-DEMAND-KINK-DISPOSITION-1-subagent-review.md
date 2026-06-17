# B1-COLLECTIVE-DEMAND-KINK-DISPOSITION-1 Subagent Review

Status: read-only internal evidence pass; not a human approval

Reviewer: Locke  
Reviewed base: `db047362603f76a2fc7af268ba422532eafa1580`  
Review date: 2026-06-17

## Verdict

Verdict: PASS for the planned authored-registry disposition if it records a
term-light table/function boundary. BLOCK for any downstream Year 1, CP-6,
Scale Gate, product-route, diagnostics, mastery, PV, or student/product-use
authority.

## Evidence Basis

- `references/authored/course-target-exercises.json` already had `1.2.3`
  collective-demand tasks where a buyer leaves the market; the old difficulty
  note said the kink could be mentioned but was not essential.
- `references/machine/micro-teaching-units.md` and
  `references/machine/micro-teaching-units.json` already contain A47/A48 for
  adding collective demand from tables and simple linear functions.
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md` maps the
  core collective-demand table/function operations to A47/A48 and defers only
  the edge-case kink/dropout treatment.
- `reports/reference-planning/B1-CHAPTER-MIXED-TARGET-AUDIT-1-review-packet.md`
  blocks `1.2.4` only because the boundary was unresolved, not because
  dropout reasoning is inherently out of scope.
- `../4veco-lessen/specifications/product-end-state.md` still requires later
  target-equivalent product proof; registry cleanup alone is not enough.

## Boundary Confirmed

Allowed:

- given individual/group demand tables or simple linear functions, students add
  quantities at equal prices;
- students explain that a buyer group may contribute zero demand beyond a price
  range, so the collective-demand graph changes shape;
- ordinary language such as "this group leaves the market" or "this group
  contributes zero units" is sufficient.

Not required:

- formal kink terminology;
- piecewise notation;
- advanced function-domain analysis;
- abstract curve-shape theory;
- a separate new MTU.

## Finding Classification

| ID | Finding classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1CDKD-SR-001 | core_requirement_met | A bounded authored-registry disposition can close the `1.2.4` mixed-target blocker for registry-audit purposes. | Any closure claim without recorded boundary and rerun audit | A scoped authored-registry disposition PR | REV-STD-1 packet, target-registry metadata update, generated evidence refresh, validator/CI pass, and mixed-target audit rerun. |
| B1CDKD-SR-002 | scope_boundary | The lane must not edit machine/external references or generated lesson output. | Machine/external mutation or lesson output in this lane | Authored registry and report artifacts | Separate governed lane if those surfaces ever need mutation. |
| B1CDKD-SR-003 | scale_blocker | Product end-state still requires target-equivalent product proof beyond registry cleanup. | Year 1 closure; CP-6 closure; Scale Gate; product-route adoption; diagnostics; mastery; PV; student/product use | Bounded registry disposition PR | Later REV-STD-1 closure/product-proof gates with rendered/product evidence. |


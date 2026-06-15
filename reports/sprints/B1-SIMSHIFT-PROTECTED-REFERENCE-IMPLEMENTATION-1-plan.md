# B1-SIMSHIFT-PROTECTED-REFERENCE-IMPLEMENTATION-1 Plan

Status: planned governed protected-reference implementation

## Purpose

This sprint implements the route accepted by PR #68: retain simultaneous
demand/supply shift reasoning as a Year 1 diagnostic target concept, but only
after a governed protected-reference lane creates or maps the required
MTU-level operation and updates `1.3.3`.

The implementation scope is narrow:

- mint or map the simultaneous demand/supply shift operation in the MTU
  registry through governed tooling;
- update `references/authored/course-target-exercises.json` for `1.3.3`;
- keep `1.3.4` as one-shift mixed integration;
- preserve all downstream closure/product-use boundaries.

## Required Citations

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Review standard:
  `reports/sprints/REV-STD-1-flag-disposition.md`
- Original blocker sprint:
  `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- Accepted design decision:
  `reports/reference-planning/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-review-packet.md`
- PR #68 review verdict:
  `C:/Users/meije/.codex/attachments/9c872c4e-061f-4529-a26a-d9201f410da0/pasted-text.txt`
- Current target registry:
  `references/authored/course-target-exercises.json`
- Current MTU registry:
  `references/machine/micro-teaching-units.md`
  and `references/machine/micro-teaching-units.json`

Product end-state requirement used here: every paragraph is built backward
from a paragraph target exercise, and later target-equivalent proof must cover
the target operation chain at the same cognitive level with matching answer
forms.

## Non-Negotiable Requirements

1. Cite product end-state, the original blocker sprint, and this sprint plan.
2. Name non-negotiables and include a core-requirement checklist in the review
   packet.
3. Classify findings with REV-STD-1 language.
4. Include `blocks`, `does_not_block`, and `proof_required_to_close` for
   carried issues.
5. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
6. Use governed reference tooling for MTU registry mutation.
7. Update only the scoped `1.3.3` target-registry mapping and evidence.
8. Do not edit `1.3.4` or imply that it covers simultaneous-shift reasoning.
9. Do not generate or alter lesson output.
10. Do not close Year 1, CP-6, Scale Gate, product-route adoption,
    diagnostics, mastery, PV, or student/product use.

## Acceptance Criteria

- A live MTU covers simultaneous demand/supply shift reasoning.
- `1.3.3` no longer carries the simultaneous-shift missing-unit flag.
- `1.3.3` becomes target-registry `reviewed_final` only for the scoped target
  registry layer.
- `1.3.4` remains one-shift mixed integration only.
- Machine-reference mutation is produced through governed unit tooling.
- Target registry and unit catalog validators pass.
- Review-throughput packet classifies the PR as high-authority /
  machine-external-reference with human decision required.
- Generated metadata is refreshed.

## Stop Boundary

Stop if the work would require generated lesson output, target-equivalent
lesson proof, Year 1 closure, CP-6 closure, Scale Gate authority,
product-route adoption, diagnostics, mastery, PV, or student/product use.

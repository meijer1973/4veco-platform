# B1-MIGRATED-V5-TARGET-QUALITY-1 Plan

Status: planned governed authored-registry target-quality review

## Purpose

This sprint reviews the remaining Book 1 theory target-exercise records that
were migrated from v4 into the active v5 registry and still need v5
target-quality disposition.

It follows PR #55, which replaced the Book 1 mixed-opgaven placeholders. It
does not infer Year 1 closure from that replacement. The purpose here is only
to decide whether the scoped Book 1 theory records can become
`reviewed_final`, need revision, or must remain non-final with a named
follow-up.

## Required Citations

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Active v5 source:
  `references/owned/course-blueprint-v5.md`
- Active target registry:
  `references/authored/course-target-exercises.json`
- Prior placeholder lane:
  `reports/reference-planning/B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-review-packet.md`
- Year 1 foundation packet:
  `reports/reference-planning/Y1-FOUNDATION-REVIEW-1-review-packet.md`

Product end-state requirement used here: every paragraph is built backward
from a paragraph target exercise, and later target-equivalent proof must cover
the target operation chain at the same cognitive level with matching answer
forms.

## Scope

Review and disposition these records:

- `1.1.1` Schaarste en economisch denken
- `1.1.2` Percentages en indexcijfers
- `1.1.3` Grafieken en tabellen
- `1.2.1` Individuele vraag
- `1.2.2` Vraagfactoren
- `1.2.3` Van individuele naar collectieve vraag
- `1.3.1` Aanbod
- `1.3.2` Marktevenwicht
- `1.3.3` Verschuivingen en nieuw evenwicht

Current-main adjustment: `1.2.1`, `1.2.2`, and `1.2.3` are already
`reviewed_final` from INSPECT-9A. This sprint accounts for them in the review
packet but does not overwrite their reviewed registry entries.

## Non-Negotiable Requirements

1. Cite the product end-state and this sprint plan in the review packet.
2. Name non-negotiables and include a core-requirement checklist.
3. Classify all findings and include `blocks`, `does_not_block`, and
   `proof_required_to_close` for carried issues.
4. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
5. Do not edit `references/machine/*` or `references/external/*`.
6. Do not generate lesson output.
7. Do not close Year 1, CP-6, Scale Gate, diagnostics, adaptive routing,
   mastery, PV, product-route adoption, or student/product-use authority.
8. Do not overwrite INSPECT-9A reviewed entries for `1.2.1`-`1.2.3`.
9. Do not treat `1.1.3` graph/table lesson evidence as closed merely because
   the target registry can cite live A45/A46 units.
10. Do not treat the `1.3.3` simultaneous-shift dependency as reviewed-final
    without a separate missing-unit/design decision.

## Acceptance Criteria

For each scoped record, the review packet records:

- target exercise checked against the v5 paragraph goal;
- operation chain decomposed;
- answer form defined;
- required skills checked against the current MTU registry;
- graph/table reliance flagged where relevant;
- normal/inferior-good dependency preserved for `1.2.2`;
- simultaneous-shift dependency kept out of reviewed-final promotion unless
  explicitly sent to missing-unit review;
- review disposition recorded as one of:
  - `reviewed_final`
  - `revise_before_final`
  - `keep_migrated_needs_review`
  - `split_or_missing_unit_review_required`

## Planned Outputs

- Update `references/authored/course-target-exercises.json` only for scoped
  authored-registry dispositions.
- Add
  `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`.
- Add
  `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-quality-log.md`.
- Add `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-result.md`.
- Regenerate repository maps, URL index, dashboard, source manifest, document
  inventory, and source-document registry.

## Stop Boundary

Stop if the work requires protected-reference mutation, lesson-output
generation, new MTU minting, product-route adoption, or a Year 1 / CP-6 /
Scale Gate closure claim. Those require separate review authority.

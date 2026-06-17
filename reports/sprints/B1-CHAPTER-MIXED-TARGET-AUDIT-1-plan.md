# B1-CHAPTER-MIXED-TARGET-AUDIT-1 Plan

Status: planned governed mixed-target dependency audit

## Purpose

Audit the reviewed-final Book 1 `gemengde_opgaven` target records after the
normal/inferior-good terminology decision and the simultaneous-shift protected
reference implementation have landed.

The sprint asks whether `1.1.4`, `1.2.4`, and `1.3.4` consolidate only approved
prior paragraph targets without importing unresolved dependencies.

## Required Citations

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Active v5 source:
  `references/owned/course-blueprint-v5.md`
- Active target registry:
  `references/authored/course-target-exercises.json`
- Mixed target standard:
  `references/authored/gemengde-opgaven-target-standard.md`
- Original sprint/gate specs:
  `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`,
  `reports/reference-planning/B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-review-packet.md`,
  `reports/reference-planning/B1-NORMAL-INFERIOR-TERM-DECISION-1-review-packet.md`,
  and
  `reports/reference-planning/B1-SIMSHIFT-PROTECTED-REFERENCE-IMPLEMENTATION-1-review-packet.md`.

Product end-state requirement used here: every paragraph is built backward from
a paragraph target exercise, and later target-equivalent proof must cover the
target operation chain at the same cognitive level with matching answer forms.

## Scope

Audit these records only:

- `1.1.4` Gemengde opgaven: economisch denken en rekenen
- `1.2.4` Gemengde opgaven: vraag
- `1.3.4` Gemengde opgaven: aanbod en marktevenwicht

For each mixed record, check:

- the `mixed_target_profile.integrates_paragraphs` list;
- whether the target exercise imports terminology or operations outside those
  approved prior paragraph targets;
- whether any prior paragraph still carries a missing/deferred dependency used
  by the mixed target;
- whether the no-new-theory boundary remains visible;
- whether downstream closure/product authority remains blocked.

## Non-Negotiable Requirements

1. Cite the product end-state and the original sprint/gate specs.
2. Name non-negotiables and include a core-requirement checklist.
3. Classify findings and include `blocks`, `does_not_block`, and
   `proof_required_to_close` for carried issues.
4. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
5. Do not edit `references/machine/*` or `references/external/*`.
6. Do not mutate the target registry in this audit lane.
7. Do not generate or alter lesson output.
8. Preserve `1.2.4` as term-free unless a later explicit review changes that
   boundary.
9. Preserve `1.3.4` as one-shift mixed practice unless a later explicit review
   changes that boundary.
10. Do not claim Year 1 closure, CP-6 closure, Scale Gate authority,
    product-route adoption, diagnostics, mastery, PV, or student/product use.

## Acceptance Criteria

- The review packet records a disposition for each Book 1 mixed target.
- Any unresolved dependency used by a mixed target is classified as blocking
  clean mixed-target audit closure, not as a non-blocking flag.
- The packet names exact follow-up proof required to close any blocker.
- Review-throughput packet validation passes.
- Platform checks remain green.

## Planned Outputs

- `reports/reference-planning/B1-CHAPTER-MIXED-TARGET-AUDIT-1-review-packet.md`
- `reports/reference-planning/B1-CHAPTER-MIXED-TARGET-AUDIT-1-quality-log.md`
- `reports/review-gates/B1-CHAPTER-MIXED-TARGET-AUDIT-1/review-packet.json`
- `reports/sprints/B1-CHAPTER-MIXED-TARGET-AUDIT-1-result.md`
- Regenerated report indexes, dashboard, source manifest, document inventory,
  and source-document registry.

## Stop Boundary

Stop if the work requires protected-reference mutation, machine/external
reference mutation, target-registry reclassification, lesson-output generation,
new MTU minting, product-route adoption, or a Year 1 / CP-6 / Scale Gate
closure claim. Those require separate review authority.

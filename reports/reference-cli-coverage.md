# Reference CLI Coverage

Generated for sprint R3.1 on 2026-04-26.

## Summary

Overall status: `ready_with_blockers`.

R3.1 confirms that the current CLI layer can express the main mutation types needed after R2.4, but R3.2 remains blocked until the R2.4 evidence and unit-design packet receives human mutation review.

Protected reference data changed: `false`.

Source packet:

- `reports/review-gates/GATE-R2-empty-needs/R2.4-evidence-unit-design-packet.json`

## Command Coverage

| Mutation type | Status | CLI path | R3.2 implication |
|---|---|---|---|
| Add accepted dependency edge | `implemented` | `unit-add-dep.js` | Ready after human mutation review |
| Remove stale dependency edge | `implemented` | `unit-remove-dep.js` | Available if review requests removal |
| Zero-needs review fields | `implemented_in_r3_1` | `unit-update.js`, `build-unit-index.js`, `unit-add.js` | Ready after human mutation review |
| Deprecate a unit | `implemented` | `unit-deprecate.js` | D04 still needs a human design decision |
| Split or merge a unit | `implemented` | `unit-split.js`, `unit-merge.js` | D04 still needs concrete target specs |
| Update unit term links | `implemented` | `unit-update.js` | Ready for reviewed unit-side changes |
| Update term registry | `implemented` | `term-add.js`, `term-update.js`, `term-rename.js`, `term-deprecate.js` | Available, but not required by R2.4 |
| Store dedicated evidence anchors | `planned_not_r3_2_blocker` | none yet | Planned for R5.1; R2.4 packet remains provenance |

## Zero-needs Review Fields

R3.1 added parser, formatter, validation, and JSON projection support for these unit-level fields:

- `assumed_prior_knowledge`
- `zero_needs_status`
- `zero_needs_review`

This matters for foundational A-domain units such as `A01`, `A02`, `A03`, `A04`, `A05`, and `A38`, where the R2.4 packet distinguishes true roots from underbouw-assumed prior knowledge.

## R3.2 Gate

R3.2 remains blocked by:

- human mutation review of the R2.4 packet
- a specific decision for `D04` if it should be deprecated, split, merged, or redistributed

R3.2 is not blocked by dedicated evidence-anchor storage. Evidence-anchor commands are planned for R5.1; until then, the R2.4 packet is the provenance record for reviewed decisions.

## Deterministic Check

Run:

```powershell
node build-scripts/references/check-reference-cli-coverage.js
```

The checker verifies that the coverage JSON, Markdown report, required scripts, and README readiness language are present and internally consistent.

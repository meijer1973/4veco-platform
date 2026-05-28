# Sprint MTU-H2C: Diff Summary

Generated: 2026-05-28

## Summary

MTU-H2C adds six reviewed Solo q1-q3 micro-teaching units through the reference
CLI and refreshes the derived reference reports. It also updates the H2A/H2B
checkers so those historical planning/gate packets remain valid after the
reduced clean-lane execution.

## Protected surfaces

Protected reference data changed in:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

Those changes were produced by `build-scripts/references/unit-add.js` only.
No hand edits were made to machine references.

No protected external sources changed:

- `references/external/` unchanged

No candidate storage was created:

- `references/data/exam-ingestion/operation-candidates.json` absent
- `references/data/exam-ingestion/answer-skill-candidates.json` absent
- `references/data/exam-ingestion/source-annex-extraction-overlays.json` absent

No lesson output changed.

## Added MTUs

| Unit | Purpose |
|---|---|
| `F19` | verbal recognition of maatschappelijke/externe kosten |
| `F20` | external-cost explanation with a context-specific example |
| `A85` | pointwise total revenue calculation without TO-function over-trigger |
| `A86` | TVK from constant variable cost per unit |
| `A87` | unknown fixed costs from the profit equation |
| `A91` | solving `MO = MK` when MK is given |

## Held or deferred lanes

| Unit | State |
|---|---|
| `A12` | held until derivative-MO update retains `A2.11` or removal is separately authorized |
| `A20` | held until split/replacement route handles active given-MK mapping in target exercise `4.1.2` |
| `A88` | conditional/revise-first |
| `A89` | conditional/revise-first |
| `A90` | conditional/revise-first |
| `A92` | held until `A89` dependency is resolved |
| `A93` | conditional/revise-first |

## Generated or refreshed artifacts

- reference reports under `reports/json/` and `reports/markdown/`
- `reports/internal-dashboard/`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `references/data/source-document-registry.json`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- roadmap version index files

## No-unintended-diff proof

The intended diff classes are:

- CLI-mutated MTU machine registry
- H2A/H2B checker lifecycle updates
- MTU-H2C sprint logs/result records
- roadmap and roadmap archive/index updates
- generated reports and repository indexes

The sprint does not include:

- `references/external/` mutation
- candidate-storage creation
- candidate writes
- lesson-output mutation
- CP-6 or Year-1 closure
- diagnostics/adaptive/mastery/sequencing/student-facing AI/summative/PV
  projection/PV machine-promotion/product-use authorization

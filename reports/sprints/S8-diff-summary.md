# Sprint S8: Diff Summary

## Summary

S8 adds a bounded misconception registry MVP and exposes it to JSON reports, reference health, and generated RAG report chunks as internal diagnostic design context.

## Added

- `references/data/misconceptions/misconception-registry.json`
- `build-scripts/references/check-misconceptions.js`
- `reports/json/misconception-registry.json`
- `reports/markdown/misconception-registry.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.41-pvg4-pass-with-conditions.md`
- S8 result, diff summary, and result metadata

## Updated

- `misconception.schema.json` now defines the S8 record shape, including linked units, terms, operation IDs, evidence refs, affected surfaces, optional formal step refs, and explicit authority flags.
- `generate-all.js` now emits `misconception-registry`.
- `validate-report-json.js` now includes the new JSON-first report.
- `generate-reference-health.js` and `check-reference-health.js` now expose and validate `misconception_registry`.
- `validate-chunks.js` now asserts the generated misconception report chunk remains non-primary, non-curriculum-authority generated-report context.
- Roadmap version moved to `v2.42-s8-misconception-registry`.
- Generated report, RAG, source manifest, document inventory, retrieval-eval, and roadmap-version-index artifacts were refreshed.

## Protected surfaces

No protected reference surfaces were changed.

S8 did not modify:

- `references/machine/`
- `references/external/`

## Boundary

Misconception records remain internal diagnostic design context:

- `internal_only: true`
- `diagnostic_design_context: true`
- `primary_evidence: false`
- `curriculum_authority: false`
- `exam_authority: false`
- `scoring_rule: false`
- `student_facing_diagnosis: false`
- `student_facing_exposure: false`
- `adaptive_routing: false`
- `mastery_decision: false`
- `automatic_sequencing: false`
- `student_facing_ai: false`
- `summative_use: false`
- `pv_projection: false`
- `pv_machine_promotion: false`
- `machine_registry_authority: false`

They are suitable for internal exercise design, answer-model review, authoring QC, and RAG retrieval with diagnostic warning labels only.

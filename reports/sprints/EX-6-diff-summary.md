# Sprint EX-6: Diff Summary

Date: 2026-05-26

## Summary

EX-6 adds a planning-only validator/CLI bundle for future exam-ingestion
operation candidates, answer-skill candidates, and source-annex extraction
overlays.

## Added

- Future overlay schemas:
  - `references/schemas/operation-candidates.schema.json`
  - `references/schemas/answer-skill-candidates.schema.json`
  - `references/schemas/source-annex-extraction-overlays.schema.json`
- Implementation plan:
  - `references/data/exam-ingestion/validator-cli-implementation-plan.json`
  - `references/data/exam-ingestion/validator-cli-implementation-plan.md`
- Read-only planning checker:
  - `build-scripts/references/check-ex6-validator-cli-planning.js`
- Human review packet:
  - `reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.json`
  - `reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.md`
  - `reports/review-gates/GATE-EX6-validator-cli-planning/bundle-urls.md`
- Sprint logs and closure artifacts under `reports/sprints/` and
  `references/data/sprints/`.

## Updated

- `references/reference-team-roadmap.md` now marks EX-6 completed and GATE-EX6
  active.
- `docs/roadmaps/roadmap-version-index.*` now marks v2.81 active and archives
  v2.80.
- Generated reports, indexes, source registry, source manifest, and document
  inventory were refreshed.

## Protected surfaces

No protected reference surfaces changed. No files under `references/machine/` or
`references/external/` were edited. No persistent candidate-storage files or
future mutation CLIs were created.

## Forbidden outputs checked absent

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`

# Sprint CP.6f: Validation Log

Generated: 2026-05-21

## Focused recheck

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6f-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6f
node build-scripts/references/build-cp6f-113-part-a-recheck.js
node build-scripts/review-gates/check-cp6f-113-part-a-recheck.js
```

Result: CP.6f recheck status `cleared`; markdown, HTML, and PDF figure first-use order is `1 -> 2 -> 3`.

## Lesson and Book checks

Passed:

```bash
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-course-target-exercises-v5.js
```

Observed results:

- `1.1.3` Part A publisher-print validation passed.
- Book 1 health passed: `26/26`.
- v5 target exercises passed: total `54`, books `12/12/14/16`.

## Reference and report checks

Passed:

```bash
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
```

Observed results before final roadmap/result refresh:

- Core schemas: `17 files`.
- JSON report contract: `13 reports`.
- Source manifest: `271 files`.
- Document inventory: `1102 files`.
- Roadmap version index: `64 entries`.
- Source-document registry: `268 records`.

## Final sprint-bundle checks

Passed after round-2 lead review:

```bash
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6f-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6f --complete
```

Observed result: both checks passed.

Final inventory refresh after source-document registry regeneration also passed:

```bash
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-roadmap-version-index.js
```

Observed final counts: source manifest `271 files`, document inventory `1102 files`, source-document registry `268 records`, roadmap version index `64 entries`.

## Jest

Passed:

```bash
npm.cmd test
```

Observed result: `30` suites passed, `6` skipped; `515` tests passed, `8` skipped. The command prints expected synthetic-fixture warnings/errors for negative validator fixtures and exits `0`.

# Sprint EX-0: Validation Log

Generated: 2026-05-21

## Contract and sprint checks

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-0-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-0
node build-scripts/references/check-exam-ingestion-contract.js
```

Observed result: EX-0 contract checker passed and confirmed no pilot overlay data files were created.

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
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX0-exam-ingestion-contract
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
```

Observed results before final inventory refresh:

- Core schemas: `17 files`.
- JSON report contract: `13 reports`.
- GATE-EX0 bundle URLs generated.

## Jest

Passed:

```bash
npm.cmd test
```

Observed result: `30` suites passed, `6` skipped; `515` tests passed, `8` skipped. The command prints expected synthetic-fixture warnings/errors for negative validator fixtures and exits `0`.

## Sprint-bundle checks

`check-sprint-result` passed after the authorized extra correction cycle.

Complete-bundle validation passed after the authorized extra lead-review recheck returned `PASS WITH FLAGS` and final metadata was saved:

```bash
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-0-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-0 --complete
```

## Inventory and registry refresh

Passed after the authorized extra correction refresh:

```bash
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
```

Observed counts after the extra correction refresh:

- Source-document registry: `273 records`.
- Source manifest: `276 files`.
- Document inventory: `1122 files`.
- Roadmap version index: `65 entries`.

## Lead-review state

Round 1 returned `REVISE` and corrections were applied.

Round 2 returned `REVISE` because closure evidence had gone stale after the correction artifacts and result metadata were written. The user authorized one extra correction/recheck cycle by replying `proceed` on 2026-05-21.

The authorized extra recheck returned `PASS WITH FLAGS`. Remaining flags were finalization chores only: save the extra recheck log, update final result metadata, refresh maps, run the complete bundle check, commit, tag, and push.

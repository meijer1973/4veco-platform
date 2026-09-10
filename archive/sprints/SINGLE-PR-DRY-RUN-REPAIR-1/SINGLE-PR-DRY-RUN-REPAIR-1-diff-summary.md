# Sprint SINGLE-PR-DRY-RUN-REPAIR-1: Diff Summary

## Substantive implementation

- `build-scripts/review-gates/integrate-authorized-pr.js` makes plain dry-run
  terminate before every mutation/merge operation and emit an exact
  pre-merge-only report.
- `build-scripts/review-gates/integrate-authorized-pr.test.js` adds clean,
  behind, movement, missing-CI, zero-side-effect and flag-equivalence
  regressions while retaining existing live-lane coverage.
- `docs/review/pr-integration-lane-policy.md` documents plain dry-run as the
  canonical read-only mode and preserves the coordinated-bundle policy.
- `build-scripts/workflows/check-paragraph-lane-scope.js` and its focused tests
  classify only the two canonical internal-dashboard closure outputs as shared
  platform paths; neighboring paths remain fail-closed.
- `.gitattributes` pins exactly five raw-byte-hashed Y1 renewal text artifacts
  to LF. `build-scripts/ci/check-evidence-line-endings.js` and its tests scan
  and assert those exact paths without changing the sealed Y1 payload.

## Governance and evidence closure

- Sprint plan, baseline, planning review, structural review rounds, rejected
  `8211c483...` intermediate record, renewed CI-portability review, command
  logs, result and review packet.
- One authority-negative roadmap ledger row.
- Deterministically generated URL/repository maps, internal dashboard and
  canonical agent indexes.

## Protected surfaces

No `references/machine/`, `references/external/`, Lesson, product, engine,
source-data, rendered-output, Y1 checker/test/evidence payload, workflow definition,
authorization-model, bundle-runner or downstream authority path changed.

## Lineage

- Platform base: `e6103d3127780d59b36410c2dbccf86314b10dd1`
- Corrected substantive head: `57757b15c5c1b4c849894ad2ec303acb809d7017`
- Lesson companion: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Rejected intermediate: `8211c4838c52ede6a4d39842928abb7007d673c3`
- Corrected substantive renewal: PASS at `57757b15c5c1b4c849894ad2ec303acb809d7017`

Only mechanical review/result/URL/index closure may follow the corrected
substantive head. Any substantive or authority change invalidates the review.

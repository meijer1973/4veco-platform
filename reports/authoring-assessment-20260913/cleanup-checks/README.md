# PR #247 validation

Reviewed platform head: `2bc4ee84393b8c2bf85734f71bb50288f5cf5122`. [Hosted CI](https://github.com/meijer1973/4veco-platform/actions/runs/34816576113) completed successfully at the exact head with lessons `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`. The checkout and emitted evidence identities are retained in `ci-run.log`.

Full product profile: **1,971 tests passed, 10 skipped**; 117 suites passed and seven skipped. The required `validate-platform` job ran from 2026-09-14T07:10:03Z to 2026-09-14T07:21:17Z: **11m14s**, excluding queue time. Presentation proofs and historical Y1 validation also passed. Generated inventory freshness remains advisory under the existing maintenance policy; its historical source-commit warnings are retained in the full log, not suppressed.

Local focused checks: 57 exercise-contract tests passed. The initial combined run had 96 passes and one navigation failure because the new cleanup folder lacked its paired lessons checkout. After creating that unchanged checkout, the workflow/navigation suite passed all 40 tests in 0.429 seconds. No test was edited or disabled. The original combined run took 5.882 seconds. This is **97 distinct focused tests**, not 137 unique tests.

Exercise-contract, approved current-action foundation, new-paragraph Part A validation and all three actual lane commands subsequently passed from this cleanup head; see `results.json` and named logs. One focused independent review PASS covers the unchanged 11-file diff; `../independent-review.md` records the verified diff identity. No full local suite was duplicated and no assessment output was merged/deployed.

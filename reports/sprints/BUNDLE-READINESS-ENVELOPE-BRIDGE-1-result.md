# BUNDLE-READINESS-ENVELOPE-BRIDGE-1 Result

Status: implementation complete; exact-commit work review `OK`

## Result

The trusted lesson-first bundle lane merged lesson PR #44 as
`96c0970f45739a8758cf7e932c6bce77806cd68d`, refreshed platform PR #198 to
`105648dbc932f62a6341a9608b3d25557194a729`, and obtained green exact-head CI.
It then failed closed before the platform merge because
`generateBundleIntegrationReadiness` placed the bundle envelope at
`supplemental.proof.bundle`, while `mergeSupplementalEvidence` accepts bundle
metadata only at `supplemental.bundle`.

The bridge moves that envelope to the production adapter's supported location.
Non-bundle checker, lead-review, branch-protection, authorization, and lineage
proof remains under `supplemental.proof`.

## Regression Coverage

- The production evidence merger drops the legacy `proof.bundle` shape and the
  router returns `KEEP_DRAFT_REVISE` with missing-bundle reasons.
- The corrected top-level bundle survives the merger, validates, and returns
  `READY_FOR_HUMAN_REVIEW` with the exact `integration_refresh` proof.
- Repaired-main partial resume keeps immutable platform and lesson payload
  candidates, does not merge the lesson again, performs one exact four-index
  refresh, binds refreshed CI, publishes production readiness, merges the
  platform only afterward, and runs final CI only after that merge.

## Validation

| Check | Result |
| --- | --- |
| `integrate-authorized-bundle.test.js` | PASS: 45 tests |
| `npm.cmd run check:integration-lane` | PASS: 10 suites, 146 tests |
| `npm.cmd run check:pr-readiness` | PASS: 5 suites, 169 tests |
| `npm.cmd run check:platform` | PASS: 99 suites and 1,326 tests; 6 suites and 8 tests skipped |
| Scope, governance wording/freshness, finalization freshness | PASS |
| Integration capability, branch/worktree safety, branch protection | PASS |
| URL freshness and `git diff --check` | PASS |

## Recovery Boundary

This bridge does not authorize or merge platform PR #198. The existing bundle
authorization remains bound to immutable platform payload
`4b4ad45bb2454f9b7f69169a75dc0c0c83f8e9a2` and lesson payload
`318b5184a896f0eaa6249ff6fa9f7298e29bb2c1`. After separate bridge
authorization and trusted integration, compatibility must be renewed with only
the platform base moved to the repaired `main`; the repaired bundle lane must
then resume the already merged lesson and create or reuse the sole exact
four-path runtime refresh.

No manual merge, admin bypass, or locally patched trusted-policy execution is
permitted.

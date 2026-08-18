# PR-READINESS-COMMENT-TRANSPORT-RECOVERY-1 Result

Status: synchronized and locally validated; exact-commit work review pending

## Result

PR #206 is synchronized by merge commit with trusted platform `main`
`bfd765e2fcf69b77a735f17e63655a64fe932fe9`. The only merge conflicts were the
two generated platform indexes; their branch-side bytes are temporary and will
be replaced by the terminal trusted regeneration after work review.

The effective patch retains the shared `gh-json-input.js` transport and applies
it to both single-PR and bundle readiness comments. The helper writes the
structured payload to a private temporary location, passes only its path to
`gh api --input`, and removes the file and directory in `finally`. Readiness
routing, transition rules, authorization, and merge behavior are unchanged.

## Blocker Reproduction And Regression

Authorized bundle run `32111437353` validated and rendered the platform-only
integration readiness for PR #198 but failed before merge while passing the
large Markdown body in a `gh` command argument on Windows.

The production-path regression now calls `applyLiveDecision` with a large
rendered readiness decision for comment creation, update, and API failure. Each
path asserts exact JSON body bytes, rejects `body=...`, the full body, and any
oversized command argument, verifies the `--input` file exists only during the
call, and confirms cleanup after success or failure. Bundle-member comment
create, update, and failure cleanup use the same transport.

## Validation

| Check | Result |
| --- | --- |
| PR and bundle transport tests | PASS: 2 suites, 11 tests |
| `npm.cmd run check:pr-readiness` | PASS: 6 suites, 173 tests |
| `npm.cmd run check:integration-lane` | PASS: 10 suites, 149 tests |
| `npm.cmd test -- --runInBand` | PASS: 90 suites and 1,256 tests; 16 suites and 90 tests skipped |
| `git diff --check origin/main...HEAD` | PASS |

## Evidence Supersession

The prior PR #206 base `73b31abd...`, head `f6c657bd...`, CI run
`32034591334`, readiness, and terminal generated-index tail are stale after the
current-main synchronization. Exact-head CI, Rawls PR review, readiness, and a
new terminal tail must be renewed before human authorization.

## Recovery Boundary

This repair does not authorize or merge PR #206 or PR #198. After separately
authorized PR #206 integration, PR #198 must be synchronized with the new
platform main; its schema-v2 compatibility, payload ancestry and effective
equivalence, authorization lineage, terminal refresh, exact-head CI, immutable
payload-readiness envelope, and Rawls review must be renewed.

Only then may the trusted bundle lane run with `--allow-partial-resume`. The
lane must recognize lesson PR #44 as already merged, validate or reuse the
terminal refresh, bind exact-head CI, publish the platform-only integration
readiness with schema-v2 `integration_refresh`, and merge PR #198. Generic or
coordinated readiness must not run outside that lane.

No manual merge, force push, admin bypass, or candidate-authored trusted-policy
execution is permitted.

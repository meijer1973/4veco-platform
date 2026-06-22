# SINGLE-ACCOUNT-REVIEW-GOVERNANCE-1 Lead Review Round 1

Reviewed SHA: `18c0954f9834384f60b1bc72b94bb870e665a61a`
Diff base: `86be0c0b35175672e3b7e4fba70119e0def80959`
Verdict: `PASS`

## Scope

Independent lead review of PR #138 hardening for single-account review
governance:

- PR-readiness routing derives mechanical approval constraints from observed
  `required_approving_review_count`.
- Count `0` is not a mechanical approval constraint; count greater than `0`
  records `branch_protection_merge_constraint`.
- Missing or unobservable approval count fails closed.
- Self-declared `requires_distinct_approval` and
  `lead_review_identity_satisfies` values are not authority.
- Branch-protection checking fails when observable bypass allowances are
  non-empty.

## Findings

No blocking findings.

The implementation satisfies the requested changes. Router normalization covers
flattened readiness proof, raw branch-protection API shape, and nested
branch-protection checker output. Nested checker evidence has strict precedence,
so an unobservable nested approval count is not rescued by a stale flattened
value. The checker preserves an explicit limitation when bypass allowances are
not exposed by the inspected API response.

## Validation

The independent reviewer reported:

```text
npm.cmd test -- --runInBand build-scripts/review-gates/pr-readiness-router.test.js build-scripts/ci/check-branch-protection.test.js
2 suites passed, 75 tests passed
git diff --check clean
```

## Residual Risk

The review did not perform a live GitHub branch-protection fetch. The main
implementation validation separately ran the live branch-protection checker,
which reported the approval count as `0` and recorded that bypass allowances
were not exposed in the inspected response.

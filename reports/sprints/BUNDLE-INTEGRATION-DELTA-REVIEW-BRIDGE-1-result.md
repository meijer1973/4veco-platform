# BUNDLE-INTEGRATION-DELTA-REVIEW-BRIDGE-1 result

## Result

Implementation validation passed. The bridge preserves the immutable payload
lead review and adds an independently validated exact integration-head review
under `proof.integration.delta_review`.

No merge was performed. PR #198 and both repository `main` tips remained
unchanged during diagnosis and implementation.

## Original fail-closed result

- Bundle: `COMPANION-ROUTE-CONSISTENCY-20260813-1`
- Platform integration head: `3c9e214c7cbe90958a3cb938c3de437468c8331c`
- Platform base: `55fc0f38aab149dcc109ce4d3e2e6d1edacf587a`
- Lesson merge: `96c0970f45739a8758cf7e932c6bce77806cd68d`
- Fresh exact-head CI: GitHub Actions run `32148211620`, passed
- Stop phase: `integration_refresh_readiness_binding`
- Stop reason: the payload review could not also establish freshness for the
  substantively synchronized integration head
- Safety outcome: the lane failed before merge and left all repository tips
  unchanged

## Implemented controls

1. The local bundle lane accepts `--delta-review <json>` and validates the
   record before readiness review or publication.
2. The payload review remains under `proof.lead_review`; the exact-head review
   is carried under `proof.integration.delta_review`.
3. The router recognizes the dual review only when lineage is inherited,
   failures are empty, the review is required, both SHAs match, the result is
   passing, and an inspectable review path exists.
4. Machine-decision validation rejects missing, mismatched, non-passing,
   malformed, unexpected, or tampered review evidence. JSON Schema validation
   independently requires the normalized dual-review structure and rejects
   marker/evidence divergence.
5. The hosted workflow contract remains fail closed because it cannot supply a
   local review file. Documentation directs the owner to the local trusted lane
   when a delta review is required.
6. Refresh-binding diagnostics now include the attested and classified
   head/route values plus classifier reason codes.
7. Canonical lineage now emits an explicit top-level human-reauthorization
   decision, and the dual-review predicate requires both top-level and
   base-drift decisions to be false.
8. Accepted alias forms are normalized into one canonical review record;
   conflicting aliases and non-string paths fail closed.
9. Delta-required dry runs stop explicitly before simulated merge or readiness
   publication.

## Validation

| Check | Result |
| --- | --- |
| Focused integration/bundle/router/workflow tests | 4 suites, 240 tests passed |
| `npm.cmd run check:integration-lane` | 10 suites, 162 tests passed |
| `npm.cmd run check:pr-readiness` | 6 suites, 173 tests passed |
| `npm.cmd test -- --runInBand` | 91 passed, 16 skipped suites; 1,277 passed, 90 skipped tests |
| `npm.cmd run check:governance-freshness -- --allow-policy-edit` | Passed against `origin/main` `55fc0f38...` |
| `npm.cmd run check:active-governance-wording` | Passed |
| `npm.cmd run check:scope-language` | Passed |
| Branch and worktree safety | Passed; dedicated branch and owned worktree |
| `git diff --check` | Passed |

## Live reproduction after repair

The diagnostic used the preserved PR #198 payload readiness, schema-v2
compatibility evidence, inherited lineage, terminal integration head, and a
valid exact-head delta review. It produced:

- payload route: `READY_FOR_HUMAN_REVIEW`
- refresh route: `READY_FOR_HUMAN_REVIEW`
- classified route: `READY_FOR_HUMAN_REVIEW`
- classified head: `3c9e214c7cbe90958a3cb938c3de437468c8331c`
- payload review SHA: `4b4ad45bb2454f9b7f69169a75dc0c0c83f8e9a2`
- validation error: none
- lineage authorization inherited: true
- integration delta review required: true

## Work review history

Reviewer: Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`).

- Round 1 on `9aa25ee3`: `REVISE`.
- Finding 1: contradictory integration-head or human-reauthorization lineage
  could pass the initial dual-review predicate.
- Finding 2: malformed paths and conflicting duplicate aliases were not
  rejected or normalized.
- Finding 3: the decision schema did not bind the delta-reviewed marker to its
  evidence object.
- Finding 4: delta-required dry-run execution skipped integration-head
  readiness and could report a simulated successful bundle.
- Corrections: one complete trust predicate now binds lineage head, payload,
  inherited authorization, empty failures, both reauthorization decisions, and
  the canonical exact-head review; validator/schema/dry-run regressions cover
  all reported counterexamples.

## Remaining gates

The corrected substantive commit requires Rawls `OK`. After that review is recorded, the
four canonical indexes must be regenerated as the terminal commit and the draft
PR must pass exact-head CI, Rawls PR review, and PR Readiness before human
authorization is requested.

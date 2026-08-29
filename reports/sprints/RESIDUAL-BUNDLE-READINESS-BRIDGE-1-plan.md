# Residual Bundle Readiness Bridge 1 — Plan

Date: 2026-08-27
Owner: `/root`
Repository: `meijer1973/4veco-platform`
Branch: `codex/residual-bundle-readiness-20260827`
Base: `9c9d3cc7fa8e72d536e03af192f53f7079823dbe`

## Objective

Repair the trusted bundle integration lane so an already-merged member can resume without a historical readiness comment on the controller payload head. The lane must support a bounded trusted preparation phase for conflict-free base synchronization, canonical index refresh, and exact-pair CI; derive an exact integration-head decision from current, independently validated facts; evaluate that decision only in memory during the subsequent dry run; and publish and re-fetch it during the final live run before any merge.

This is a separate governance change. It must not modify or merge Platform PR #208, create a retrospective readiness record for `aa06ada217b4ec8ac9f042f08100513381b30366`, or alter Book 1/Y1 product content.

## Quality floor

- Preserve all existing authorization, compatibility, lineage, review, CI, base/head stability, and bundle-membership gates.
- Require explicit residual integration lead-review evidence when a current payload-head readiness decision is absent; authorization alone is not review evidence.
- Construct the bridge decision from live PR/member state plus validated immutable evidence, never from caller-supplied conclusions.
- Keep dry runs side-effect free: no comments, reusable success statuses, pushes, or merges.
- Keep preparation bounded: it may update the exact authorized branch, create or reuse the canonical generated-index descendant, and obtain exact-pair CI, but it must stop before readiness publication, reusable success status, or merge.
- Keep live runs fail-closed: publish, re-fetch, parse, and revalidate the exact-head readiness record before merging.
- Retain the existing path unchanged when an exact payload-head readiness decision exists.

## Requirements

1. Recompute readiness at the current controller integration head from live PR facts.
2. Bind it to the reviewed controller payload, current integration head, merged lesson commit, validated authorization, compatibility proof, integration lineage, lead review, paired member review, and exact-pair CI.
3. Report `would_create_exact_head_readiness` in dry-run mode and use the in-memory decision for the remaining preflight checks without publishing it.
4. In live mode, publish the exact integration-head readiness comment, re-fetch it, and reject absent, malformed, stale, or mismatched records.
5. Never synthesize or backdate a payload-head readiness comment.
6. Reject stale/moved heads or bases, wrong CI coordinates, substantive descendant tails, missing/invalid lead review, changed bundle membership, publication failure, and movement after readiness publication.
7. Expose the review-evidence input through the hosted authorized-bundle workflow without logging or persisting it as a repository artifact.
8. Document the residual-resume contract narrowly in the integration-lane policy.
9. Expose a trusted preparation-only workflow input so the required `prepare -> dry-run -> live` sequence is executable without deliberately failing or cancelling a live integration.

## Procedure

1. Add a residual bundle review validator and bridge decision constructor to `integrate-authorized-bundle.js`, reusing the existing integration lead-review validator and live authorization/compatibility/lineage facts.
2. Make exact-pair CI validation read-only in dry runs rather than treating it as automatically satisfied.
3. Route the in-memory bridge decision through final dry-run preflight; route the persisted, re-fetched decision through live preflight.
4. Add optional hosted-workflow inputs for the residual review record and the mutually exclusive preparation-only mode; pass the review record from runner temporary storage.
5. Stop preparation after exact-pair CI and after a final current-head/current-base check, before constructing or publishing readiness.
6. Add focused positive and negative regressions, including the complete `prepare -> dry-run -> live` sequence, then run the full platform suite and governance/map validations.
7. Commit and publish a draft governance PR. Obtain independent structural lead review against an exact commit, repair any findings, run exact-head CI, and publish current readiness evidence for human review.

## Test matrix

Positive:

- Dry-run partial resume derives exact-head readiness in memory, reports `would_create_exact_head_readiness`, validates exact-pair CI, and produces no side effects.
- Live partial resume derives, publishes, re-fetches, and uses exact-head readiness before merge.
- Live partial resume can restart after an already-published valid exact-head readiness record.
- Existing payload-readiness-backed bundle integration remains compatible.
- Preparation can perform a conflict-free branch update and stop for retry, then create/reuse the canonical refresh, validate exact-pair CI, and stop without readiness publication, success status, or merge.
- A prepared integration head completes a green dry run and is then reused by the live integration.

Negative:

- Missing or invalid residual lead review.
- Wrong reviewed payload, integration head, lesson merge, or paired-member review SHA.
- Substantive controller descendant tail.
- Stale/wrong exact-pair CI coordinates.
- Head/base movement before or after readiness publication.
- Readiness comment publication failure or malformed re-fetch.
- Authorization, compatibility, lineage, or bundle-membership mismatch.
- Any dry-run attempt to publish status/comment or merge.
- Preparation combined with dry-run, preparation outside a partial-resume bundle, and head/base movement before preparation completes.

## Evidence and review gate

- Focused integrator and workflow tests pass.
- Full platform test suite passes.
- Governance validation, sprint artifacts, maps, URL index, and agent indexes are current.
- Independent lead reviewer records `PASS` or `PASS WITH FLAGS` against the exact reviewed commit.
- Draft PR exact-head CI is green and readiness routes to human review.
- Human approval is still required; this task grants no merge authority.

## Stop conditions

Stop without merging if the repair requires weakening an authority boundary, if a substantive PR #208 change is discovered, if exact-head CI is not green, if lead review has unresolved blockers, or if the governance PR cannot be represented as an isolated repair.

## Deliberate omissions

- No changes to Book 1/Y1 payload, generated lesson indexes, protected evidence, product/engine/source data, or PR #208.
- No regenerated compatibility run and no execution of PR #208's live lane; those occur only after this governance PR is independently reviewed and merged.
- No historical readiness comment for the controller payload head.

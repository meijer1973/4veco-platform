# BUNDLE-INDEX-REFRESH-1 Plan

## Objective

Repair the trusted cross-repository bundle integration lane so a lesson-first
merge cannot strand the platform controller with stale lesson indexes. The
repair must also make the compatibility/readiness proof disclose the required
post-first-merge index refresh and correct the delegated lesson Bundle State
rendering.

The held bundle remains unapproved. This task must not authorize or merge
`meijer1973/4veco-platform#198` or `meijer1973/4veco-lessen#44`.

## Quality Floor

1. A lesson merge commit that differs from the reviewed lesson payload SHA is
   treated as the exact lesson source for regenerated indexes.
2. Trusted `main` code, not code from the platform PR, performs the refresh in
   an isolated checkout.
3. The refresh may change only the four allowlisted
   `reports/github-agent-index-{platform,lessen}.{json,md}` files.
4. The generated output is deterministic for the same platform head and lesson
   merge SHA, and its JSON source SHAs are checked before commit.
5. The refresh commit is a fast-forward descendant of the reviewed platform
   payload, is classified as an allowlisted generated-index descendant, and is
   re-fetched from GitHub before it can be used.
6. Fresh platform PR CI is bound to the refreshed platform integration head and
   the exact merged lesson `main` SHA before the platform merge is eligible.
7. The PR Readiness Reviewer is recomputed for the refreshed integration head;
   no stale payload-head readiness marker can authorize the platform merge.
8. A failure at clone/fetch, generation, path verification, determinism,
   commit/push, lineage, readiness, or CI stops before the platform merge.
9. Recovery is idempotent after the lesson merge, refresh push, readiness
   publication, or CI completion; a valid existing refresh commit is reused.
10. Immutable payload compatibility and mutable integration-head validation are
    separate, linked proofs. A refreshed integration head never rewrites the
    exact payload SHAs asserted by the compatibility workflow.

## Specification Requirements

- Preserve the payload/integration-head authorization model in
  `docs/review/pr-integration-lane-policy.md`.
- Preserve the exact three-state compatibility contract while recording that
  `lesson-first` requires a post-first-merge index refresh.
- Preserve the compatibility workflow's immutable payload exact-members and
  provenance. Add a distinct validated integration-refresh proof for the
  runtime descendant.
- Preserve `ADMIN_BYPASS: prohibited`, exact-head checks, review-thread checks,
  and final platform `main` CI.
- Keep generated index descendants inside the existing evidence-tail allowlist;
  do not broaden the allowlist.
- Keep the delegated lesson decision machine shape intact while rendering the
  lesson PR as the member and the platform PR as controller.

## Procedure

### 1. Reproduce and pin the defect

- Add a regression where the reviewed lesson payload and the lesson merge
  commit are different SHAs.
- Make the regression prove that platform CI cannot be treated as refreshed
  until the index refresh creates a new platform integration head.
- Exercise the normal lesson-first path and explicit partial-resume path.

### 2. Add a trusted deterministic refresh primitive

- Extend the trusted index generator with explicit platform root, reports root,
  lesson root/ref, canonical source-branch labels, and fixed generated-at
  inputs.
- Clone/check out the exact platform PR head and exact lesson merged-main SHA in
  a temporary directory without executing PR-authored scripts.
- Invoke the generator and freshness checker only from the trusted-main
  checkout with explicit target roots. Never invoke `npm run agent:index`, Git
  hooks, or any script from the controller candidate checkout.
- Derive `generated_at` canonically from the immutable lesson merge commit's
  committer timestamp. Bind canonical platform and lesson source-branch labels
  to the live PR branch and `origin/main` respectively.
- Run the trusted-main generator twice with the canonical inputs and compare
  hashes. The same platform parent SHA and lesson merge SHA must reproduce the
  same files in a later process or retry.
- Validate both JSON source commits, both source-branch values, generated-at,
  and the exact four-file changed-path set.
- Commit the generated files with a stable integration-lane message and push a
  non-force fast-forward update to the controller PR branch.
- Re-fetch the PR and verify the observed head is the returned commit and the
  reviewed payload remains its ancestor.
- Before creating a commit, inspect the current controller head. If it is an
  existing one-parent, index-only descendant with the exact canonical content
  for the platform parent and lesson merge SHA, reuse it. Reject a similar but
  stale or tampered descendant instead of stacking another refresh commit.

### 3. Repair lesson-first sequencing

- After the lesson merge is verified, refresh the platform PR indexes before
  dispatching the intermediate platform validation.
- Replace the stale platform-main intermediate check with exact refreshed-head
  platform PR CI bound to the current lesson-main merge SHA.
- Rebuild member lineage and exact-head PR Readiness for the refreshed head.
  Post or update the canonical readiness comment idempotently, then rerun final
  pre-merge head/base/open state, review-thread, mergeability, and CI checks.
- Apply the same repair to partial resume after a verified lesson merge. Wire
  `--allow-partial-resume` into the trusted workflow and make retries resume
  safely after merge verification, refresh push, readiness publication, or CI
  completion without creating repeated refresh commits.
- Increase the trusted workflow timeout beyond the two possible 30-minute CI
  waits plus refresh work.
- Keep final platform-main CI after both merges unchanged.

### 4. Strengthen compatibility and readiness evidence

- In every compatibility matrix checkout, run the trusted-main index generator
  and freshness checker against explicit candidate roots. This is a pre-merge
  candidate simulation, not the runtime merge-commit refresh.
- Add mandatory order-specific compatibility contract metadata declaring that
  `lesson-first` requires a runtime post-first-merge refresh, the exact four
  paths, lesson merge-commit source, trusted executor, deterministic generation,
  exact-head readiness, and exact platform/lesson CI binding.
- Keep the original compatibility exact-members and workflow provenance
  immutable. Add a separate `integration_refresh` proof that binds the reviewed
  platform payload ancestor, refreshed platform integration head, reviewed
  lesson payload, exact lesson merge commit, canonical refresh result, rebuilt
  lineage, exact-head readiness decision/digest, and exact-head CI evidence.
- Teach compatibility, readiness, and integration validators/schemas to reject
  missing contracts, stale refresh heads, mixed payload/integration SHAs,
  wrong lesson merge commits, altered path sets, untrusted executors, stale
  readiness, or CI bound to either wrong SHA.
- Carry both proof layers into the human-readable Bundle State without relabeling
  the integration head as the compatibility payload candidate.
- Update the integration/readiness policy documentation to describe the
  deterministic descendant and stop conditions.

### 5. Correct delegated lesson rendering

- Render `current_member` as the lesson Member PR/head for delegated lesson
  readiness decisions.
- Keep the platform controller in Controller PR/head and keep machine JSON
  fields unchanged.
- Add a focused renderer regression for the controller/member labels.

### 6. Validate and review

- Add a real temporary-Git-repository regression with a lesson payload commit
  and distinct lesson merge commit. Assert this event order: lesson merge
  verification; exact-SHA refresh, push, and refetch; rebuilt lineage; exact
  integration-head readiness; CI bound to refreshed platform head and lesson
  merge SHA; final pre-merge refetch; platform merge; final main CI.
- Inject failures at clone/fetch, generation, path allowlist, determinism,
  commit/push/refetch, lineage, readiness publication, CI binding, and final
  pre-merge refetch. Every case must prove no platform merge and no reusable
  success status.
- Add workflow-contract tests proving compatibility simulation and privileged
  runtime refresh execute trusted-main generator/checker paths only, partial
  resume is enabled, and the timeout is sufficient.
- Run focused generator, freshness, compatibility, readiness-router, bundle
  integration, and workflow contract suites.
- Run `npm.cmd run check:pr-readiness`, governance wording/scope/freshness,
  branch-protection, index freshness, diff checks, and full
  `npm.cmd run check:platform`.
- Have lead reviewer Rawls review the implementation and evidence. Apply every
  actionable correction and repeat until `OK`.

### 7. Publish the trusted-main repair only

- Refresh repository maps/indexes, commit, push, and open a draft platform PR
  from `codex/bundle-index-refresh-20260814`.
- Run exact-head platform CI, lead review, PR Readiness, and the final PR
  workflow review until `OK`, then mark only the repair PR ready for human
  review.
- Do not merge the repair PR without owner payload authorization.
- Keep bundle PRs #198 and #44 draft/held while the repair is pending.

### 8. Resume the held bundle after the repair lands

- Fetch the repaired platform `main`, sync PR #198 without rebasing away its
  reviewed lineage, and regenerate indexes.
- Rerun full tests, exact-head lead review, exact three-state compatibility,
  coordinated PR Readiness, and final PR workflow review.
- Return the renewed exact payload heads to the owner for one
  `APPROVE_BUNDLE_AND_MERGE` decision with `MERGE_ORDER: CI_SELECTED` and
  `ADMIN_BYPASS: prohibited`.

## Evidence Required

- Regression event order showing lesson merge, index refresh, refreshed-head
  readiness/CI, platform merge, and final main CI.
- Refresh result containing old/new platform heads, exact lesson merge SHA,
  changed paths, source-commit/source-branch/generated-at checks, canonical
  deterministic hashes, reuse/creation status, and push/refetch proof.
- Immutable payload compatibility summary with the explicit lesson-first
  runtime refresh contract, plus a separately validated integration-refresh
  proof for the refreshed head.
- Exact-head readiness comments with correct controller/member rendering.
- Passing focused and full checker logs at the repair PR head.
- Rawls `OK` for plan, implementation, and final PR workflow reviews.

## Stop Conditions

- Any mutation outside the four index files during automatic refresh.
- Any non-fast-forward push, head mismatch, moved `main`, or changed bundle
  membership.
- Any refreshed index whose lesson source is not the verified lesson merge
  commit.
- Missing exact-head readiness, unsuccessful refreshed platform PR CI, or
  unresolved review state.
- Any attempt to merge the held bundle before the trusted repair is on platform
  `main` and PR #198 has renewed exact-head evidence.

## Plan Review Log

- Round 1: `REVISE`.
  - Separate immutable payload compatibility from runtime integration proof.
  - Make partial recovery executable and idempotent; enable it in the workflow.
  - Define canonical cross-run generation inputs and branch labels.
  - Forbid candidate tooling in privileged and simulation paths.
  - Use real temporary repositories and failure injection at every boundary.
  - Validate order-specific refresh metadata structurally in every layer.
- Round 2: `OK`.

### Human HOLD_REVISE Correction

- Human review: `HOLD_REVISE` because the trusted refresh helper was absent
  from the canonical repository navigation maps and no regression enforced that
  discovery surface.
- Rawls correction-plan Round 1: `REVISE`.
  - Supersede old exact-head evidence in PR #209, commit a new review record,
    and validate the final generated-index-only tail before publication.
- Rawls correction-plan Round 2: `REVISE`.
  - Review and bind the exact substantive correction commit before adding the
    evidence-only lead-review record.
- Rawls correction-plan Round 3: `REVISE`.
  - Publish actual exact-head CI and PR-review URLs only after those checks run.
- Rawls correction-plan Round 4: `OK`.

## Implementation Review Log

- Round 1: `REVISE`.
  - Permit a fresh partial-resume invocation to begin at an already-pushed
    canonical index descendant without rewriting immutable payload members.
  - Re-fetch both repository `main` refs immediately before success status and
    each final member merge.
  - Replace the misleading readiness `decision_digest` with a non-circular,
    recomputable route/head/CI attestation and bind it to the actual decision.
  - Catch and reject readiness publication exceptions or unsuccessful results.
  - Add executable schema validation, real-Git sequencing, and injected
    clone/fetch, generation, allowlist, determinism, push/refetch, lineage,
    publication, CI-binding, and final-refetch failures.
- Round 1 corrections:
  - Partial-resume preflight now defers only refreshed-head readiness, validates
    payload lineage separately, and reuses canonical refresh commits and exact
    completed CI evidence across invocations.
  - A final exact `main` coordinate check now precedes success status and merge.
  - Runtime readiness uses schema-v1 canonical attestation hashes that are
    recomputed structurally and checked against the actual decision route/head.
  - Publication failures return a governed failure and cannot mint success.
  - The schema is exercised with Ajv, and temporary bare-repository tests cover
    the complete lesson-first order plus each named failure boundary.
- Round 2: `REVISE`.
  - Require `integration_refresh` in every ready platform decision whose live
    head differs from immutable compatibility payload coordinates.
  - Bind and schema-check refresh parent/source commits, canonical branches,
    and generated timestamp.
  - Constrain every order-specific integration-contract field to its canonical
    trusted path, exact file/input set, and CI binding.
  - Record rebuilt lineage and final `main` refetch in the real-Git sequence,
    and inject a distinct commit failure.
- Round 2 corrections:
  - Standalone decision validation now rejects a missing refresh proof and
    recomputes the canonical readiness attestation.
  - Refresh validation and attestation now cover the previous platform head,
    platform and lesson source commits/branches, and generated timestamp; the
    structural schema requires the same fields.
  - Ajv regressions reject wrong contract types, paths, deterministic inputs,
    and CI coordinates.
  - Real-Git ordering now includes refreshed lineage and the final two-repo
    `main` refetch before success/merge; commit injection leaves the remote
    controller branch unchanged, and integration failure tests prove no
    platform merge or reusable success status.
- Round 3: `REVISE`.
  - Derive refresh necessity from compatibility exact members even when the
    duplicated bundle exact-members field is omitted or altered.
  - Model both open and merged paired-member lifecycle shapes in the decision
    schema and validate a complete refreshed decision.
  - Require a strict canonical UTC timestamp in generated refresh metadata.
- Round 3 corrections:
  - Ready platform bundle validation now requires compatibility exact members,
    exact duplicate coordinates, and a matching controller reviewed payload;
    the compatibility payload head determines whether refresh proof is required.
  - The schema uses explicit open and merged alternatives, with a mandatory
    lesson merge commit in the merged form. A real refreshed decision is
    compiled and validated against the complete draft-2020-12 schema.
  - Lesson merge committer timestamps are normalized with `toISOString()`;
    schema `date-time` plus a strict millisecond-UTC pattern rejects malformed
    values such as `2026-08-14Tgarbage`.
- Round 4: `REVISE`.
  - Prevent coordinated edits to all duplicated payload coordinates from
    suppressing required runtime refresh proof.
  - Make open and merged paired-member lifecycle variants mutually exclusive
    in runtime and schema validation.
- Round 4 corrections:
  - Standalone decision validation now reruns `validateCompatibilityProof`,
    uses its state-validated exact members, and binds the platform payload to
    declared exact members, controller metadata, lead review, and integration
    lineage before determining whether refresh proof is required.
  - The complete schema conditionally requires structured controller and exact
    member objects for ready platform bundles. Coordinated tampering and field
    omission regressions fail both runtime and schema validation.
  - Open members now require `merged` false/absent and no merge commit; merged
    members require `open: false`, `merged: true`, and an exact merge commit.
    Runtime classification and Ajv reject the contradictory state.
- Round 5: `REVISE`.
  - Stop normalizing absent merge and integration-refresh fields to `null`,
    which conflicted with their object/string schema types.
  - Validate an actual ready open-member decision against the complete schema.
- Round 5 corrections:
  - Bundle-member normalization now omits `merge_commit_sha` unless a merge
    commit exists, and bundle summaries omit runtime refresh fields until a
    refresh proof exists.
  - The canonical open-member controller decision passes the complete schema
    and asserts both optional fields are absent; the canonical merged-member
    decision remains covered by the separate full-schema regression.
- Round 6: `REVISE`.
  - Bind the compatibility-tested lesson candidate to exactly one paired
    lesson member, including its payload/head coordinates and paired lead
    review, instead of allowing duplicated exact-member declarations to hide
    coordinated lesson identity tampering.
  - Add classifier, standalone-validator, omission, open-member, merged-member,
    and schema regressions for the lesson-side binding.
- Round 6 corrections:
  - Classification now derives the lesson candidate from the actual lesson
    member, requires exactly one paired lesson for a platform controller, and
    requires that member and its passing lead review to match the tested lesson
    payload SHA.
  - Standalone ready-decision validation independently binds the normalized
    lesson head, integration head, reviewed payload, PR identity, and lead
    review to compatibility exact members.
  - The ready-platform schema requires one structurally valid lesson member and
    one lesson lead-review record. Open, merged, coordinated-transition,
    omission, duplication, and tampering regressions pass.
- Round 7: `REVISE`.
  - Align runtime with the schema's two-repository cardinality: one valid lesson
    member plus an extra foreign or platform member must not remain eligible.
  - Require one total paired lead review as well as one total paired PR, and add
    classifier and standalone regressions for extra records.
- Round 7 corrections:
  - Platform-controller classification and standalone decision validation now
    require exactly one total paired member, which must be the lesson PR.
  - Standalone validation requires exactly one total paired lead review for
    that same lesson PR and exact compatibility-tested SHA.
  - Runtime and full-schema regressions reject a valid lesson member/review plus
    extra foreign member/review records; focused router and readiness-apply
    suites pass.
- Round 8: `OK`.
- Human correction Round 1 (overall Round 9): `REVISE`.
  - Scope the navigation regression to exact Markdown subsections and parsed
    fenced-JSON arrays rather than broad section substring matches.
  - Add independent omission or misplacement cases for every required map,
    GitHub-entry, and URL-index representation.
- Human correction Round 1 corrections:
  - Entry-point, anchor, path-registry, and task-routing arrays are parsed and
    checked by exact key; traversal, GitHub entry, and URL-index assertions are
    constrained to their named row or subsection.
  - Fourteen table-driven negative cases remove one exact representation at a
    time while leaving all other occurrences present, and each fails with its
    own surface identifier.

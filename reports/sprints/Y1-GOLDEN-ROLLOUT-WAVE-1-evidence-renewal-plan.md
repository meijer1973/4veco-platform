# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Lesson Snapshot Evidence Renewal Plan

Generated: 2026-08-25

## Authority references

- Owner renewal authorization supplied on 2026-08-25 for Platform PR #208.
- Authorized platform starting head:
  `e2deb65fd9dd2e6f2f2c3b89e6572dc6a0fbe5e8`.
- Authorized lesson merge snapshot:
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- Historical Y1 specification:
  `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`.
- Historical Scale Proof:
  `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json`.

## Goal

Renew the bounded Y1 rendered evidence for the one changed lesson dependency,
the §1.1.2 `opgaven.html` surface captured as
`112-normal-practice-desktop-light-opgaven`, without changing lesson content,
product behavior, Scale Proof history, or any authority boundary.

## Context

Lesson PR #43 merged the reviewed textbook payload at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`. The generated platform index refresh
at `e2deb65fd9dd2e6f2f2c3b89e6572dc6a0fbe5e8` passed its preceding checks but
correctly failed the Y1 Golden guard because the directly captured §1.1.2
`opgaven.html` blob differs from the earlier lesson snapshot. The historical
proof reused screenshots only under blob equality, so a SHA-only rebind is not
sufficient. The owner authorized a one-capture evidence renewal and explicitly
withheld merge authority.

## Quality Standard

The governing specification is the historical Y1 plan plus the owner's bounded
2026-08-25 continuation authorization. The quality floor is actual rendered output
on the student-facing route with no missing core requirement and reviewable proof. Closure requires a canonical
1280×900 light-mode capture from the exact lesson
merge snapshot, deterministic hash and pixel comparison against the historical
capture, human visual inspection, fail-closed checker coverage, exact-head local
and remote validation, and renewed independent review. A visible regression is
a stop condition, not an evidence refresh outcome. Only a named follow-up may
carry the optional generalization of this one-capture mechanism.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Re-render only the authorized capture | Y1-owned single-capture script/output | Capture manifest identifies one capture and exact lesson SHA | pending |
| Compare historical and renewed pixels | SHA-256 plus pixel statistics/diff image | Human visual inspection | pending |
| Keep `opgaven.html` fail-closed | Recapture attestation validation in Y1 checker | Positive and negative focused regressions | pending |
| Preserve historical Scale Proof | Blob-equality guard for all existing Scale Proof artifacts | Exact changed-file review | pending |
| Rebind directly dependent Y1 evidence | Delta proof, Y1 proof, packet, result and review evidence | Cross-binding validators | pending |
| Preserve authority boundaries | Existing false authority claims remain false | Scope-language and lead review | pending |
| Return for explicit merge authorization | Green exact-head CI and readiness route | PR remains open and unmerged | pending |

## Quality Improvement Candidates

- `include_now`: explicit capture identity, viewport, theme, lesson blob, browser
metadata, image hashes, pixel comparison, inspection payload, and human verdict.
- `defer_named_follow_up`: general multi-capture recapture framework; unnecessary
  for this one-file renewal.
- `reject_scope_creep`: lesson, product, engine, source-data, protected-reference,
  rollout, completion, diagnostics, mastery, PV, or adoption changes.

## Allowed paths

- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js`
- Y1-owned bounded capture/comparison tooling under `build-scripts/sprints/`
- `references/data/exercises/y1-golden-rollout-wave-1.json`, limited to
  registering that Y1-owned capture tool in the existing allowlist/trigger set
- `reports/json/y1-golden-rollout-wave-1-*.json`
- Y1-owned renewal screenshots and visual comparison artifacts under
  `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-*`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`
- Deterministic dashboard, URL-index, bundle-URL, and GitHub agent-index outputs
  directly refreshed by the renewed Y1 evidence.

## Forbidden paths

- The lesson repository and every lesson artifact.
- `source-data/`, `engines/`, generated lesson output, and product routes.
- `references/machine/`, `references/external/`, and protected references.
- Historical Scale Proof JSON, manifests, route inventory, and screenshots.
- Rollout, adoption, completion, diagnostics, mastery, sequencing, adaptive,
  summative, PV, or student/product-use authority.

## Inputs

- Platform head `e2deb65fd9dd2e6f2f2c3b89e6572dc6a0fbe5e8`.
- Lesson merge snapshot `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- Historical capture `112-normal-practice-desktop-light-opgaven` and its Scale
  Proof manifest/inspection record.
- Existing Y1 delta proof, Y1 proof, review packet, checker, and focused tests.

## Outputs

- One Y1-owned renewed screenshot and capture/comparison attestation.
- A minimally extended fail-closed Y1 checker with regression coverage.
- Rebound Y1 proof, delta proof, review packet, sprint/review evidence, and
  deterministic navigation indexes.
- Green exact-head local and remote validation ready for renewed human review.

## Operationalized sprint procedure

1. Verify both exact authorized heads and clean worktrees; stop on drift.
2. Add a Y1-owned single-capture runner that reproduces the historical CDP
   process without editing the historical Scale Proof runner or artifacts.
3. Capture only `112-normal-practice-desktop-light-opgaven` from the exact lesson
   merge tree at 1280×900, light mode, device scale factor 1, hidden scrollbars.
4. Produce SHA-256 and per-pixel comparison results and inspect historical,
   renewed, and diff images. Stop on visible regression.
5. Extend the Y1 checker minimally so the changed lesson input is accepted only
   when an exact capture-specific recapture attestation validates; retain the
   page in the rendered dependency set and reject missing, stale, mismatched,
   malformed, or non-passing attestations.
6. Rebind the delta proof, Y1 proof, review packet, sprint result/quality records,
   and directly generated navigation evidence to the exact renewed payload.
7. Run focused Y1 tests, full platform validation, evidence validators, lead and
   visual review, exact-head CI against lesson `f09fd6e...`, and refreshed
   readiness/integration-lineage validation.
8. Leave PR #208 open and unmerged and return the exact head for renewed owner
   review.

## Acceptance tests

```text
npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode pull_request --scope-mode auto --base 9c9d3cc7fa8e72d536e03af192f53f7079823dbe --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head f09fd6e88edc5049b026b16b0158e7e188091d2d
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-plan.md
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:agent-index-freshness
npm.cmd run check:scope-language
git diff --check
git -C ../4veco-lessen diff --check
```

## Non-negotiable requirements

- Only one capture is rendered and only Y1-owned renewal artifacts are written.
- The historical Scale Proof and all historical screenshots remain blob-equal.
- The §1.1.2 `opgaven.html` path remains a rendered dependency.
- A changed rendered input passes only with a validated capture-specific renewal
  bound to its exact old/new blobs, exact lesson refs, exact image hashes,
canonical settings, inspection, comparison, and human verdict.
- The checker stays fail-closed for absent, stale, partial, or contradictory
  evidence.
- PR #208 is not merged by this sprint.

## Stop conditions

- Stop if either authorized starting head cannot be resolved exactly.
- Stop if any lesson, product, engine, source-data, protected-reference, or
  historical Scale Proof artifact would need to change.
- Stop if the renewed capture shows clipping, overlap, missing exercises,
  horizontal overflow, illegible content, or another visible regression.
- Stop if the checker can pass after removing `opgaven.html` from rendered
  dependencies or weakening the historical-artifact guard.
- Stop before handoff if exact-head CI, review, readiness, or integration lineage
  is stale or non-green.

## Proof Required to Close

Proof required to close must include the exact new platform head, complete changed-file
list, the historical and renewed screenshot hashes, pixel comparison result,
human visual verdict, focused/full test results, passing report and evidence
validators, exact-head green CI bound to lesson `f09fd6e...`, renewed independent
review and readiness evidence, and confirmation that PR #208 remains open and
unmerged.

## Human review required

Independent visual and structural review are required. The renewed head returns
to the owner for explicit merge authorization; this plan grants no merge
authority.

## Rollback plan

Before merge, revert or drop the evidence-renewal commits from PR #208. No
lesson restoration or historical Scale Proof restoration should be needed
because those artifacts remain unchanged.

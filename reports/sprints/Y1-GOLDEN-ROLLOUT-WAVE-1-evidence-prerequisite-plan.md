# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Main-Based Evidence Prerequisite Plan

Generated: 2026-08-27

## Authority references

- Owner authorization supplied on 2026-08-27 for a separate Y1-evidence
  prerequisite PR; merge authority is explicitly withheld.
- Authorized Platform base:
  `9c9d3cc7fa8e72d536e03af192f53f7079823dbe`.
- Exact Lesson evidence target:
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- Historical Y1 specification:
  `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`.
- Canonical product boundaries:
  `../4veco-lessen/specifications/product-vision.md` and
  `../4veco-lessen/specifications/product-end-state.md`.
- Reviewed source provenance from Platform PR #208:
  capture selector `8f612ac6755a299fe7457910001e58fac8cd7b83`,
  reviewed Y1 payload `4b49d82d4a35915ef586f0de01554068fa7b5803`,
  and sealed evidence tree
  `aa06ada217b4ec8ac9f042f08100513381b30366`.

## Goal

Create a main-based prerequisite that renews the Y1 rendered-input evidence for
Lesson `f09fd6e...` while preserving the earlier PR #208 renewal as source
provenance only. The new PR must bind its live evidence to its own exact base,
reviewed payload, and terminal evidence head; it must not claim that any PR #208
commit is an ancestor of the new payload.

## Context

Platform `main` currently carries Y1 evidence for Lesson snapshot `96c0970...`,
while Lesson `main` is `f09fd6e...`. Exact CI for the separate residual-bundle
bridge PR #215 therefore passes its code and pre-Y1 checks but correctly stops at
the stale rendered-input guard. PR #208 already produced a reviewed one-capture
renewal for the changed §1.1.2 `opgaven.html` blob, but its evidence and checker
are tied to PR #208-only commits. The owner has authorized a distinct main-based
prerequisite which reuses that evidence with explicit source provenance and
recomputes current bindings without importing PR #208 product commits or
fabricating their ancestry.

## Quality Standard

The governing specification requires student-facing rendered output proof;
anything outside this bounded quality floor is named as follow-up work rather
than silently weakening the requirement.

The quality floor is that the prerequisite is acceptable only if it proves exactly one changed rendered
dependency, §1.1.2 `opgaven.html`, and closes it with the previously reviewed
1280×900 light-mode replacement capture. Historical and replacement screenshots
must remain byte-identical, their decoded pixel delta must remain zero, the
first-viewport limitation must be explicit, and the guard must fail closed for
changed blobs, screenshots, selectors, hashes, provenance, lineage, or
authority. A visible regression, a second changed dependency, or any unresolved
rendered drift is a stop condition.

## Product-vision fit

- Pillar: agent-scalable production and reproducible review gates.
- Investment class: competitive-parity reliability and governance integrity.
- Student-visible effect: none; this PR changes evidence and validation only.
- Agent-reliability effect: Platform `main` can validate against current Lesson
  `main` without weakening the Y1 guard or depending on PR #208 ancestry.
- Diffusion/legal posture: unchanged; no runtime, account, data, or product
  surface change.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Start from exact Platform base and Lesson target | Git object and worktree preflight | command log and exact-SHA checks | in progress |
| Preserve PR #208 as source provenance only | explicit source-provenance block with Git-object/blob checks | negative ancestry/provenance tests and lead review | pending |
| Bind current evidence to this PR | own base, reviewed payload, evidence head, and lesson snapshot fields | exact-head checker and packet cross-bindings | pending |
| Renew exactly one dependency | recomputed delta proof | count/path/hash negative tests | pending |
| Preserve 1280×900 first-viewport qualification | canonical capture record and review wording | screenshot/manifest/visual-review validation | pending |
| Preserve byte identity and zero pixels | SHA-256, decoded RGBA comparison, zero-delta image | independent visual inspection | pending |
| Remain fail-closed | minimal checker extension | focused positive and negative Jest suite | pending |
| Preserve all authority holds | proof, packet, result, and renewal record | scope-language and lead review | pending |
| Complete all CI stages | full local validation and exact-head remote CI | green `validate-platform` run | pending |
| Return without merging | draft PR, readiness route, human gate | PR remains open and unmerged | pending |

## Quality Improvement Candidates

- `include_now`: add a machine-checkable source manifest for unchanged and
  adapted PR #208 artifacts; validate historical and current lineages
  independently; record a new visual inspection of the final imported bytes;
  test every previously observed fail-closed edge explicitly.
- `defer_named_follow_up`: general multi-capture renewal machinery and generic
  evidence-porting abstractions; the authorized prerequisite is deliberately
  one capture and one dependency.
- `reject_scope_creep`: lesson, textbook, Book 1 toolchain, product, engine,
  source-data, protected-reference, workflow-governance, rollout, completion,
  diagnostics, mastery, PV, or merge changes.

## Allowed paths

The complete mutation allowlist is:

- `build-scripts/sprints/capture-y1-golden-rollout-wave-1-rendered-renewal.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js`
- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`
- `reports/json/y1-golden-rollout-wave-1-proof.json`
- `reports/json/y1-golden-rollout-wave-1-rendered-delta-proof.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/bundle-urls.md`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/pr-readiness-evidence.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/pr-readiness-decision.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan-review.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-source-manifest.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-visual-review.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-assignment.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-round1.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-corrections.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-round2.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven.png`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven-pixel-diff.png`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/comparison.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/manifest.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-visual-review.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-rendered-renewal.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`
- `reports/internal-dashboard/dashboard-data.json`
- `reports/internal-dashboard/index.html`

No other path may change. Deterministic generators must be checked immediately;
if they propose another path, stop and amend the plan through renewed planning
review rather than silently widening scope.

## Forbidden paths

- Every path in `../4veco-lessen/`, including textbook and generated lesson
  artifacts.
- `build-scripts/books/`, book manifests, book-toolchain files, and rendered
  textbook evidence.
- `engines/`, `source-data/`, `references/machine/`, `references/external/`,
  protected references, product routes, and CI/governance workflows.
- Historical Scale Proof JSON, manifests, route inventory, and screenshots.
- Any PR #208 product file or generated index copied merely to satisfy ancestry.
- PR #208 and PR #215 branches, commits, comments, or merge state.

## Inputs

- Platform base `9c9d3cc7fa8e72d536e03af192f53f7079823dbe`.
- Lesson evidence head `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- Historical lesson capture `071a465a03e287bc5768d88aabbec3e63b15ee09`
  and prior Y1 snapshot `96c0970f45739a8758cf7e932c6bce77806cd68d`.
- Source-provenance commits `8f612ac6755a299fe7457910001e58fac8cd7b83`,
  `4b49d82d4a35915ef586f0de01554068fa7b5803`, and
  `aa06ada217b4ec8ac9f042f08100513381b30366`.
- The historical Scale Proof and current-main Y1 plan/checker/proof/packet.
- Owner authorization and the recorded post-Y1 CI stage list from
  `.github/workflows/platform-ci.yml`.

## Outputs

- A corrected substantive payload commit `P` containing the portable checker,
  selector, tests, exact imported evidence bytes, source manifest, current
  visual review, and all round-1 corrections.
- An evidence-only terminal head `H` containing round-2 review, P-bound delta
  proof/proof/packet/result records, command/quality/evidence logs, and only the
  allowlisted deterministic URL/index/dashboard refreshes.
- A source manifest that records for every unchanged reused artifact its source
  commit, source path, Git blob OID, SHA-256, destination path, destination Git
  blob OID/SHA-256, and `exact_bytes` disposition. Adapted checker/test/evidence
  records additionally carry their source commit/path/blob and `adapted` status.
- Green exact-head local and remote validation bound to `H` and Lesson
  `f09fd6e...`, followed by an exact-head readiness decision and an open,
  unmerged prerequisite PR for human merge review.

## Provenance and lineage model

1. `source_provenance` records the exact PR #208 selector, reviewed Y1 payload,
   and sealed evidence-tree commits plus the committed Git blobs/hashes of every
   reused or adapted artifact. It verifies that all three objects are commits and
   that `8f612ac...` is an ancestor of `4b49d82...`, which is an ancestor of
   `aa06ada...`.
2. Source provenance is validated as historical Git-object evidence. No source
   provenance SHA is accepted as the new PR's base, reviewed payload, or
   ancestor requirement.
3. `current_evidence` records the exact authorized base `9c9d3cc7...`, this PR's
   own corrected substantive payload commit `P`, its terminal evidence head
   `H`, and Lesson `f09fd6e...`. It rejects every PR #208 SHA in the current
   base/payload/head roles and never treats PR #208 ancestry as current lineage.
4. The current reviewed payload must descend from `9c9d3cc7...`; the exact head
   must descend from that payload; any tail is restricted to named evidence,
   review, readiness, and deterministic index files.
5. Reused screenshot/comparison bytes must equal the blobs recorded at
   `aa06ada...`. Rebinding metadata never substitutes for blob/pixel proof.

## Operationalized sprint procedure

1. Verify exact refs, clean isolated worktrees, governance freshness, and the
   worktree ownership lock.
2. Read the historical Y1 plan/checker/proofs and the reviewed PR #208 renewal;
   inventory the smallest portable path set.
3. Obtain independent planning review and correct the plan before implementation.
4. Port only the bounded selector/checker/tests and evidence bytes. Add the
   main-based source-provenance/current-lineage distinction, exact path policy,
   and negative tests. The source manifest must bind every imported/adapted path.
5. Create and push a provisional implementation commit; publish a draft PR.
   Obtain lead review round 1 against that exact provisional commit.
6. Apply all substantive round-1 corrections and write the correction log.
   Freeze and push the corrected substantive payload commit `P`. No proof or
   packet may call an earlier provisional commit the reviewed payload.
7. Recompute every `current_evidence` binding from `P`: delta proof against
   Platform base `9c9d3cc7...`, historical Y1 refs, and Lesson `f09fd6e...`;
   proof, packet, result, quality log, diff summary, and evidence map. Require
   exactly the §1.1.2 `opgaven.html` path as one changed dependency and zero
   unresolved inputs.
8. Obtain lead review round 2 against exact `P`. Store the review record after
   `P` and do not change substantive files afterward. If round 2 requires a
   substantive correction, create a new `P`, invalidate/recompute all bindings,
   and repeat round 2.
9. Add only the explicit evidence-tail files, terminal command/test evidence,
   and allowlisted deterministic URL/index/dashboard refreshes. Freeze and push
   terminal head `H`; verify `9c9d3cc7... -> P -> H` and reject every
   non-allowlisted `P..H` path.
10. Run focused tests and the complete local validator matrix at `H`. Then run
    exact-head remote `platform-ci / validate-platform` bound to Platform `H`
    and Lesson `f09fd6e...`. Acceptance requires the Y1 step and every following
    stage to execute and pass: Validate report JSON; Validate MTU evidence layer
    freshness; Validate MTU-H7 Bundle 4 protected adjudication packet; Validate
    roadmap version index; Check URL index; Check GitHub agent indexes; Check CI
    evidence line endings; Check platform diff hygiene; Check lessen diff
    hygiene. A skipped, stale, or partial post-Y1 sequence is a stop.
11. Re-fetch live PR state, produce an exact-head readiness decision for `H`,
    post/apply only `MARK_READY`, and return for renewed human merge review.
    The explicit decision is to stop before merge.

The focused suite must positively prove the exact intended record and reject:
missing or non-commit provenance objects; broken `8f612ac... -> 4b49d82... ->
aa06ada...` source lineage; wrong source path/blob/SHA-256/destination binding;
any PR #208 SHA used as the current base, payload, head, or current-ancestry
substitute; wrong current base; stale `P` after a correction; `P` or `H` not
descending correctly; any non-allowlisted `P..H` tail path; zero, two, or the
wrong changed dependency; removal of §1.1.2 `opgaven.html` from the rendered
dependency set; selector path/blob drift; any capture setting other than
1280×900/light/device-scale-factor-1/first viewport/hidden scrollbars; screenshot
byte drift; nonzero decoded RGBA delta; stale diff image, comparison, manifest,
inspection, or hash; missing first-viewport-only wording in proof, packet,
result, or visual review; and an authority object that differs from the exact
14-key set or has an omitted, added, renamed, substituted, or true key.

## Acceptance tests

```text
npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode pull_request --scope-mode auto --base 9c9d3cc7fa8e72d536e03af192f53f7079823dbe --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head f09fd6e88edc5049b026b16b0158e7e188091d2d
npm.cmd run check:exercise-workflow-currentness
npm.cmd run check:exercise-authority-hygiene
npm.cmd run check:scale-proof-3p-product-path
npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md
node build-scripts/sprints/check-lead-review-substance.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:agent-index-freshness
npm.cmd run check:scope-language
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm.cmd run check:platform
npm.cmd run check:branch-protection
npm.cmd run finalization:freshness
git diff --check
git -C ../4veco-lessen diff --check
```

Remote closure additionally requires a green exact-head
`platform-ci / validate-platform` run that checked out this PR's exact head and
Lesson `f09fd6e...`, including every report JSON, evidence-freshness,
roadmap/index, and diff-hygiene stage after the Y1 check.

## Review gates

- Planning review: inspect the baseline, scope, provenance/lineage model,
  planned outputs, tests, and stop conditions before implementation.
- Independent visual review: confirm the committed historical, replacement,
  and zero-delta images; retain the first-viewport-only limitation.
- Structural lead review: assignment, round 1, correction log, and round 2 at
  the corrected exact payload/evidence head.
- PR Readiness Reviewer: route only after exact-head green CI and current remote
  evidence. This L4 evidence/governance PR must return to the owner for merge
  authorization.

## Stop conditions

- Stop if Platform `origin/main`, Lesson `origin/main`, PR #208, or PR #215
  changes before their recorded identities are revalidated for the handoff.
- Stop if any lesson, textbook, Book 1 tooling, engine, source-data, protected
  reference, historical Scale Proof, or product-route change becomes necessary.
- Stop if provenance requires fabricated ancestry or a PR #208 commit as this
  PR's reviewed payload.
- Stop if the recomputed set contains anything other than one changed
  §1.1.2 `opgaven.html` dependency or if unresolved drift is nonzero.
- Stop if screenshot bytes differ, changed pixels are nonzero, inspection
  differs, or visual review finds a visible regression.
- Stop if an authority hold becomes true or `opgaven.html` can be removed from
  the dependency set without failing the checker.
- Stop if exact-head CI is red, partial, stale, or skips any post-Y1 check.
- Stop before merge; this authorization covers preparation only.

## Omitted work and named follow-up

- General multi-capture renewal machinery is deliberately omitted; the existing
  single-capture mechanism remains the bounded quality floor.
- Product rollout, adoption, completion language, diagnostics, mastery,
  sequencing, summative use, PV, and student-use authority remain held for
  separate owner-authorized gates.
- PR #215 synchronization and revalidation, and later PR #208 compatibility and
  serialized integration, remain separate follow-up sequences after this
  prerequisite is human-authorized and merged.

## Proof Required to Close

To close, the closure proof must include current review, validator, and test
evidence.

Return the exact PR head, exact reviewed payload, complete changed-file list,
source-provenance commit/blob bindings, current-lineage bindings, historical and
replacement screenshot hashes, zero-pixel comparison, visual verdict, focused
and full test results, a complete green exact-head CI run, exact-head readiness,
and confirmation that this PR, PR #208, and PR #215 remain unmerged.

## Rollback plan

Before merge, close the prerequisite PR and remove its branch/worktree. Because
the lesson repo, product/runtime sources, and historical Scale Proof artifacts
remain unchanged, no lesson or product rollback is required.

## Human review required

This is an L4 product-authority/evidence prerequisite. Planning review,
independent visual review of the final imported bytes, structural lead review
round 1 plus correction log and round 2, exact-head PR Readiness Reviewer proof,
and renewed owner merge authorization are required. Marking the PR ready after a
valid `MARK_READY` route is permitted; merging is not.

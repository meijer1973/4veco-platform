# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Current-Main Renewal

Generated: 2026-08-23

## Goal

Replace the stale and conflicted implementation in platform PR #205 with a
current-main implementation of the useful guard concept: the six first-three
Golden check surfaces are available as a controlled workflow wave, while all
broader product and student-use authority remains held.

The renewed bundle must be reviewable on its own. It must not reuse the July
CI, PR-readiness decision, lead review, or human handoff. It must create a new
branch, new PR, current exact-head evidence, current Rawls/lead review, and a
new PR-readiness decision.

## Context

PR #205 attempted to turn the first-three Golden exercise state into a durable
workflow-availability guard. The concept remains useful, but its branch,
checker, roadmap, tests, repository navigation, packet binding, and review
evidence no longer satisfy current repository policy. This renewal replaces
that PR from current main and preserves only its valid bounded intent.

### Current Baseline

- Platform base: `b7ec603880bcd8cc98c93526121ca71d3f31edcd`
  (`origin/main` on 2026-08-23).
- Lesson base: `96c0970f45739a8758cf7e932c6bce77806cd68d`
  (`origin/main` on 2026-08-23).
- Superseded PR: platform PR #205 at
  `571d435a172240524ed96394a41682ef003bfcad`.
- The prior PR is one payload commit ahead of its old base, 153 commits behind
  current main, conflicted, and not eligible for renewed authorization.
- The current exercise-surface manifest still identifies exactly six current
  first-three split surfaces: one advisory short check and one
  target-readiness exit ticket for each of `1.1.1`, `1.1.2`, and `1.1.3`.
- Owner decision recorded on platform PR #148 closed Scale Gate 1 narrowly as
  `PASS_CONTROLLED_ROLLOUT` and authorized controlled Golden Workbench rollout
  waves with per-wave source/generated/rendered evidence and internal lead
  review. It did not authorize automatic migration, completion language,
  diagnostics, mastery/sequencing, PV, summative use, broad product use, or
  student/product use.
- Original Scale Proof capture payloads: platform
  `5e3fa0d972992cf11568c4f86bf4f5f09c0f11c7` and lesson
  `071a465a03e287bc5768d88aabbec3e63b15ee09`, as bound by the
  exact-head PR #148 owner decision and capture evidence.
- Old PR #205 CI snapshots: platform
  `571d435a172240524ed96394a41682ef003bfcad` with pre-payload base
  `51a08a64684160c8c6d06e5c46df2424d5d98659`, and lesson
  `ba08b9c2e033a877c0d1b57952055ce697912a22`.

## Acceptance Baselines

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`
- `references/reference-team-roadmap.md`
- `references/data/exercise-surface-manifest.json`
- `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json`
- owner bundle authorization on platform PR #148, comment `4807419611`
- the blocking renewal review supplied for platform PR #205 on 2026-08-23

## Quality Standard

Quality floor: specification fulfilment requires a reviewer to prove from current repository state
that the six named surfaces exist, preserve their exact advisory versus
target-readiness authority split, use governed Golden layouts, resolve their
student route links, and remain available only under the controlled-rollout
decision. The checker must reject both state drift and committed PR-scope
drift.

The sprint does not change rendered output or other student-facing files. If
the delta proof cannot justify reuse, rendered recapture becomes a named
follow-up inside this same renewal before human handoff.

Proof standard: deterministic positive and negative tests must cover the
state contract, route contract, authority contract, roadmap contract, package
and CI wiring, review-packet binding, changed-path classification, and reused
rendered-evidence delta. Passing the current repository state alone is not
enough.

Review standard: planning and implementation must each receive subagent lead
review. The final draft PR must receive a fresh exact-head Rawls/lead review,
live branch-protection proof with `ok: true`, remote `validate-platform`, and a
new PR Readiness Reviewer decision. Because the bundle governs a controlled
product-authority boundary and changes CI, it must route to human review.

## Non-Negotiable Requirements

1. Start from current platform `main`; do not rebase or repair PR #205.
2. Preserve exactly the six first-three split check surfaces and no others in
   the wave claim.
3. Preserve advisory-only authority for all `*-korte-check` surfaces.
4. Preserve target-readiness-only authority and
   `completionLanguageEligible:false` for all `*-exit-ticket` surfaces.
5. Record Scale Gate 1 as `PASS_CONTROLLED_ROLLOUT`, not as pending human
   review and not as broad product/student-use authority.
6. Reject committed forbidden or unexpected changes using an explicit,
   event-specific base/head changed-path comparison and a complete allowed-path
   contract. A clean worktree is not scope proof.
7. Reject missing, extra, stale, escaping, contradictory, or unwired state
   through dedicated negative regression tests.
8. Correct the Golden rollout roadmap so its proven surface set, completed
   sprint sequence, current gate state, and immediate contract agree.
9. Refresh repository maps, URL indexes, GitHub agent indexes, roadmap version
   index, and internal dashboard projections required by current repository
   rules.
10. Bind the final review packet to the replacement PR number and URL. Bind
    the reviewed payload commit in the packet, then bind the final exact PR
    head through current-head lead review and PR-readiness evidence.
11. Reuse old rendered screenshots only if a commit-bound blob/diff proof
    demonstrates that every rendered input and independently derived
    dependency is unchanged from the original PR #148 capture payloads through
    the old PR #205 CI snapshots to current platform and lesson heads.
12. Mark PR #205 superseded only after the replacement draft PR exists.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Six current surfaces only | Wave manifest and current exercise-surface manifest agree exactly. | Positive check plus missing/extra-surface negative fixtures. | planned |
| Correct authority split | Source, generated data, manifest, proof, and packet retain advisory/target-readiness distinctions and held completion language. | Authority-drift negative fixtures and Rawls review. | planned |
| Valid Golden route | Each surface uses Golden layout; route links are present, contained, and resolve. | Missing-link, escaping-link, unresolved-link, and legacy/hybrid negative fixtures. | planned |
| Current controlled-rollout authority | Wave record cites the PR #148 owner decision and `PASS_CONTROLLED_ROLLOUT`; broader authorities remain false. | Roadmap/packet/proof consistency checks and authority lead review. | planned |
| Real committed-path protection | Checker computes changed paths from event-specific Git base/head refs and enforces the renewal allowlist plus forbidden categories across additions, deletions, and renames. | Temporary Git-repository CLI tests exercise PR, push, local, stale-ref, rename, delete, and unexpected-path histories. | planned |
| Reusable rendered evidence is current | Delta proof distinguishes original capture payloads, old PR CI snapshots, and renewal bases; it derives capture, asset, source, generator, runtime, route, and proof inputs independently and records unchanged blob IDs. | Checker rejects changed, missing, escaping, omitted, or unbound rendered dependencies. | planned |
| Roadmap is coherent | Proven surfaces and completed prerequisite sprints are historical facts; future sequence begins after the controlled-rollout decision. | Table/section semantic assertions and contradiction negative fixtures. | planned |
| Repository navigation closes | Maps, URL index, agent indexes, roadmap index, and dashboard projections are regenerated. | Current index/dashboard checkers pass. | planned |
| Packet is bound and routed correctly | Packet records replacement PR number/URL, L4/high-authority classification, exact payload SHA, and required human route. | Throughput checker, exact-head lead review, PR readiness, and remote CI. | planned |

## Implementation Design

### 1. Testable checker core

Implement `build-scripts/sprints/check-y1-golden-rollout-wave-1.js` as an
importable module with a thin CLI. Pure validation helpers receive parsed
objects and explicit repository roots so Jest can exercise negative fixtures
without mutating canonical repository files.

The CLI will accept explicit refs and an execution mode:

```bash
--base <platform-base-ref>
--head <platform-head-ref>
--event-mode <pull_request|main_push|manual>
--scope-mode <auto|required>
--lesson-base <lesson-baseline-ref>
--lesson-head <lesson-current-ref>
```

The execution contract is event-specific:

- pull-request CI compares the exact `github.event.pull_request.base.sha` with
  `github.event.pull_request.head.sha`; it must not attest the synthetic merge
  commit checked out by Actions;
- main-push CI compares exact `github.event.before` with `github.sha`;
- manual/local runs require explicit, resolvable refs and fail closed when
  either ref is absent or stale.

The CLI validates that event mode and supplied refs agree. Pull-request tests
must distinguish the payload head from a synthetic merge commit. Main-push
tests must prove the actual pushed range and must not silently collapse it to
an empty `origin/main...HEAD` comparison.

### 2. Changed-path policy

The wave manifest will contain a complete renewal allowed-path contract plus
forbidden path prefixes. The checker will read committed additions,
modifications, deletions, and both sides of renames from Git, not from
`git status`. At minimum it must reject committed changes to:

- `source-data/book-1/exit-ticket/`
- `engines/`
- `references/machine/`
- `references/external/`
- target-exercise authority sources
- generated lesson Book 1 output

The scope policy applies to this renewal payload. In `required` mode, every
changed path must be allowlisted. In `auto` mode, the checker enforces that
contract when the range touches any wave-owned control path; unrelated future
main pushes still run state validation but do not inherit this sprint's
payload allowlist. A future authorized product change that affects the six
surfaces must either preserve the state contract or deliberately renew the
wave evidence; it must never pass because the push range was treated as empty.

### 3. State and route policy

Validate:

- exact six-surface membership;
- current split source/generated paths;
- source/generated parity for surface type and authority flags;
- Golden layout without legacy/hybrid roots;
- route href presence, containment within the Book 1 lesson root, and target
  existence;
- current Scale Proof route/link/rendered flags;
- short-check advisory feedback and exit-ticket completion-held boundaries;
- no unauthorized product, diagnostic, mastery, PV, summative, broad-use, or
  student-use claims.

### 4. Commit-bound rendered-evidence reuse

Create a delta-proof JSON that distinguishes and records:

- the original screenshot-capture platform and lesson payload commits;
- the old PR #205 platform and lesson CI snapshots;
- current platform and lesson commits inspected;
- every relevant platform source, generator, runtime, route, and proof path;
- every lesson capture path, route destination, and local loaded asset;
- blob IDs at baseline and current heads;
- zero changed, missing, or escaping relevant inputs.

The dependency inventory may use the capture manifest as one input, but it may
not trust a proof-defined list as complete. It must independently derive and
cross-check page paths, HTML `src` dependencies, `<link href>` dependencies,
browser-loaded local assets, anchor/navigation destinations, manifest source
paths, registered Golden runtime/generator paths, landing destinations, and
proof inputs. Rendered pages, `src` inputs, `<link href>` inputs, and loaded
local assets require blob equality. Anchor/navigation destinations require
existence at every commit but their content is outside the accepted screenshot
claim unless a capture case renders them. The checker independently recomputes
blob IDs at every recorded commit boundary. If any rendered input changed, a
route destination disappeared, or a dependency is omitted, screenshot reuse
fails and this renewal must recapture rendered proof rather than weaken the
claim.

The committed delta proof binds the reviewed substantive payload SHA. Exact-PR
head validation then proves that the payload is an ancestor, the later diff is
an allowlisted evidence-only tail, and all rendered inputs remain unchanged
through that exact head. This avoids a self-referential proof commit.

### 5. Roadmap correction

Revise every active controlling Golden/reference-team statement to one coherent
timeline while preserving older sprint rows as explicitly historical:

- the `1.1.1` migration, `1.1.3` advisory graph route, A96 refinement, and
  renewed first-three proof are completed prerequisites;
- Scale Gate 1 passed narrowly as `PASS_CONTROLLED_ROLLOUT` by the owner
  decision on PR #148;
- all six first-three check surfaces are workflow-available for controlled
  rollout waves;
- completion language, automatic migration, broad product/student use,
  diagnostics, mastery/sequencing, PV, and summative authority remain held;
- `1.1.4` remains same-copy hygiene only and is not part of the wave claim;
- the next expansion candidate requires its own target-operation authority,
  source/generated/rendered proof, and review.

Update the reference-team roadmap's active Product Proof Track, current-state
language, and Immediate Next Sprint section, not only a new row. Model
`PASS_CONTROLLED_ROLLOUT` as the historical PR #148 owner decision, separate
from this renewal sprint verdict. Keep distinct machine fields for controlled
wave eligibility, actual rollout/adoption, completion language, broad product
use, and student use.

### 6. Negative regression suite

Add dedicated Jest tests that independently reject:

- missing and extra first-three surfaces;
- advisory/exit authority drift;
- missing generated files or source/generated parity drift;
- missing route hrefs, escaping hrefs, and unresolved route targets;
- stale or changed rendered-evidence inputs;
- unresolved/stale refs, payload-head versus synthetic-merge confusion, and
  incorrect post-merge push ranges;
- unexpected allowlist paths, additions, deletions, and renames;
- omitted rendered dependencies and unrelated future main pushes;
- absent package or CI wiring;
- roadmap contradiction or stale future-work placement;
- null/mismatched PR binding and L3/L4 classification drift;
- stale root-map, agent-index, URL-index, and dashboard projections;
- a committed protected-path change through the real checker CLI in a
  temporary Git repository.

### 7. Evidence and publication closure

Generate plan/result/quality/evidence/command/lead-review artifacts, wave and
proof JSON, the review packet, root maps, URL indexes, GitHub agent indexes,
roadmap version artifacts, and dashboard output.
Use the governance two-head model explicitly:

- the committed packet records the replacement PR number/URL, L4/high-authority
  classification, and reviewed substantive payload SHA;
- an immutable PR comment/current readiness artifact records the final PR head,
  CI, branch protection, exact-head lead/delta review, review-thread state, and
  readiness decision.

A committed packet cannot contain its own final commit SHA. A deterministic
policy-allowlisted evidence-only tail may bind the reviewed payload commit, but
any substantive checker, test, roadmap, result, or packet change after review
restarts exact-head review and CI.

After the replacement PR exists remotely, post a supersession comment on PR
#205 that links the replacement and states that `571d435a...` must not be
authorized, then close PR #205. Record the supersession comment URL and closed
state in the renewal result evidence.

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Factor pure checker helpers for fixture tests. | include_now | Required for trustworthy negative coverage. |
| Recompute rendered-input blob IDs from Git. | include_now | Required to reuse screenshots without recapture. |
| Rewrite the entire reference-team roadmap chronology. | reject_scope_creep | Add a bounded current status row/update only. |
| Recapture every Scale Proof screenshot unconditionally. | defer_named_follow_up | Independent dependency classification proves all rendered inputs equal. Changed presentation destinations are existence-only links outside the accepted screenshot claim, so recapture is unnecessary unless a rendered input later drifts. |
| Author `1.1.4` or Chapter 1.2 exercise surfaces. | reject_scope_creep | Separate controlled rollout work requiring target-operation authority. |
| Authorize completion language or student use. | reject_scope_creep | Explicitly forbidden by the owner decision. |

## Allowed paths

- `.github/workflows/platform-ci.yml`
- `package.json`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js`
- `build-scripts/sprints/emit-url-index.js`
- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- required roadmap archive/version-index files
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`
- generated internal dashboard files owned by `npm.cmd run dashboard:internal`
- `reports/json/y1-golden-rollout-wave-1-proof.json`
- `reports/json/y1-golden-rollout-wave-1-rendered-delta-proof.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-*`
- generated repository maps, URL indexes, GitHub agent indexes, and internal
  dashboard artifacts required by current repository rules

## Forbidden paths

- No exercise source-data edits.
- No engine/runtime behavior changes.
- No generated lesson output edits or lesson PR.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise authority mutation.
- No route migration or automatic repository-wide rollout.
- No new screenshots unless the delta proof requires recapture.
- No completion-language authorization.
- No diagnostics, mastery/sequencing, adaptive routing, PV, summative use,
  broad product use, or student/product use.
- No authorization, integration, or merge of PR #205.
- No direct merge of the replacement PR.

## Inputs

- Current platform and lesson `origin/main` commits recorded in the baseline.
- Original screenshot-capture payloads `5e3fa0d9...` and `071a465a...`.
- Old PR #205 CI snapshots `571d435a...` and `ba08b9c2...`.
- The current exercise-surface manifest and six split source records.
- Current generated Book 1 route and shared output in the lesson repository.
- The Scale Proof 3P proof, route inventory, capture manifest, and screenshots.
- The PR #148 controlled-rollout owner decision and merged integration record.
- The old PR #205 commit for defect traceability only.
- Current repository navigation, roadmap, CI, review, and sprint protocols.

## Outputs

- Current-main wave manifest, checker, and dedicated negative Jest suite.
- Commit-bound rendered-input delta proof.
- Coherent Golden and reference-team roadmap status.
- Complete sprint plan/result/quality/evidence/command/lead-review bundle.
- L4/high-authority review packet bound to the replacement PR.
- Refreshed maps, URL index, GitHub agent indexes, roadmap index, and internal
  dashboard projections.
- Replacement draft PR with current exact-head CI, lead review, branch
  protection, and PR-readiness evidence.
- A supersession comment/closure on PR #205 after the replacement exists.

Navigation regeneration order is fixed: update authored roadmap/status files,
run `dashboard:internal`, run `agent:index`, refresh the URL index, then run
roadmap, dashboard-semantic, agent-index, root-map, and URL-index freshness
checks. The Y1 checker will include semantic freshness checks for the three
root maps and dashboard because the dashboard generator has no native check
mode.

## Operationalized sprint procedure

1. Write this plan and its plan metadata from current main.
2. Ask a subagent lead reviewer to inspect plan completeness, authority
   semantics, checker design, negative-test design, roadmap repair, delta-proof
   design, publication closure, and stop conditions.
3. Apply every blocking/material plan finding and repeat review until the plan
   receives `OK_TO_IMPLEMENT` or equivalent explicit approval.
4. Implement the checker core, wave manifest, delta proof, roadmap correction,
   negative tests, package/CI wiring, and initial evidence artifacts.
5. Run focused tests and current repository validators.
6. Ask a subagent lead reviewer to inspect the implementation. Apply findings
   and repeat until it receives `OK_TO_CLOSE` or equivalent explicit approval.
7. Fetch `origin/main` and inspect `origin/main...HEAD` before publication. If
   main advanced with relevant overlap or requires manual conflict resolution,
   stop and renew the plan/proof. For a clean base sync, regenerate changed-path
   proof, rendered delta, indexes, CI evidence, and review evidence.
8. Refresh authored roadmap/status files, dashboard, GitHub agent indexes,
   root maps, URL index, roadmap versioning, result artifacts, and validation
   logs in the fixed regeneration order.
9. Commit and push the first coherent payload, then open a replacement draft
   PR.
10. Bind the review packet to the new PR and reviewed payload commit; commit and
   push only the deterministic evidence tail needed for binding.
11. Run final exact-head subagent Rawls/lead review and apply any required
    corrections, repeating until approved.
12. After the replacement exists remotely, post the supersession comment on PR
    #205, link the replacement, close #205, and record comment URL/closed state.
13. Fetch current `main` again before final review. Handle advancement using the
    same overlap/base-sync rules from step 7.
14. Run full local validation, current remote `validate-platform`, live branch
    protection, and the PR Readiness Reviewer against the exact remote head.
15. Obey the readiness route. Expected route is
    `READY_FOR_HUMAN_REVIEW`; mark ready and present the exact-head packet to
    the owner. Do not merge without a new exact-payload owner authorization.

## Stop Conditions

- Stop for rendered recapture if any reused rendered input blob differs from
  the recorded baseline.
- If recapture is required, teacher/student review is no longer exempt: run
  rendered/mobile, route/link, teacher-learning, student-experience, and Rawls
  review before human handoff.
- Stop and replan if correcting the guard requires exercise source, engine, or
  generated lesson changes.
- Stop if current main no longer has exactly the six claimed surfaces.
- Stop if roadmap authority cannot be reconciled with the PR #148 owner
  decision without broadening product or student-use authority.
- Stop before human handoff if remote CI, branch protection, review threads,
  lead review, PR binding, or readiness evidence is stale or incomplete.

## Acceptance tests

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md
npx.cmd jest build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js --runInBand
npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head origin/main
npm.cmd run check:exercise-workflow-currentness
npm.cmd run check:exercise-authority-hygiene
npm.cmd run check:scale-proof-3p-product-path
npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:agent-index-freshness
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-result.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md
node build-scripts/sprints/check-lead-review-substance.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

The replacement can be presented for human review only when the current-main
wave manifest, state checker, explicit Git base/head scope guard, commit-bound
rendered delta proof, roadmap correction, negative tests, repository navigation
artifacts, sprint bundle, packet binding, current exact-head lead review,
remote CI, live branch-protection proof, and PR-readiness decision are all
current and passing. PR #205 must be visibly superseded, and no artifact may
suggest that its July head or review evidence remains authorizable.

Closure proof must include passing validator and test evidence, completed
subagent review, remote CI, branch-protection output, and exact-head readiness
review. Without that evidence, the sprint does not close.

## Human review required

Human review is required. This bundle changes CI and governance around a
controlled product-authority rollout surface. It may be marked ready only after
the PR Readiness Reviewer returns `READY_FOR_HUMAN_REVIEW` for the exact remote
head. Merge requires a new owner payload authorization for the replacement PR;
the July handoff and any authorization aimed at PR #205 are invalid.

Checker/test design receives repository/testing review. Authority semantics,
roadmap status, and the final exact-head decision receive Rawls lead review.
Teacher-learning and student-experience review are recorded as not applicable
only while delta proof confirms there is no student-facing or rendered-output
change. Any recapture or student-facing change activates those reviews.

## Rollback plan

Before merge, close the replacement PR and delete its task branch if desired.
After merge, revert the replacement PR. Because the bundle changes only
validation, evidence, roadmap, indexes, and review artifacts, rollback does not
require lesson regeneration, source-data restoration, or engine rollback.

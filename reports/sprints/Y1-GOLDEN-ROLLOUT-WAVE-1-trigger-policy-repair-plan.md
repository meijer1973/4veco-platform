# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Trigger Policy Repair Plan

Generated: 2026-08-24

## Authority references

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Companion specifications:
  `../4veco-lessen/specifications/companion-core-specifications.md`
- Original rollout plan:
  `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`
- Original sprint specification:
  `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`
- Current gate packet:
  `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`

## Goal

Repair the future-PR CI regression found in human review of platform PR #214.
Shared infrastructure files that were legitimately changed by the renewal must
remain allowed without activating the renewal-only fixed-path allowlist for
later unrelated work.

## Context

The current policy includes these shared paths in both `allowed_exact` and
`trigger_exact`:

- `.github/workflows/platform-ci.yml`
- `package.json`
- `build-scripts/sprints/emit-url-index.js`

In `auto` mode, any one of those paths currently activates the Y1 renewal
allowlist for the whole changed-path range. A future legitimate change combining
a shared path with a non-Y1 path can therefore fail required platform CI.

## Quality Standard

The governing specification and existing Y1 quality floor remain unchanged.
No rendered output or student-facing behavior changes. Closure requires
machine-checkable proof, independent lead review, exact-head CI, and an explicit
follow-up human decision; no missing core requirement is carried.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared paths remain allowed but do not trigger renewal scope | Actual wave policy diff | Seven-subset regression review | implemented_pending_exact_head |
| Y1 mixed scope remains rejected | Real-Git negative regression | Focused suite and lead review | implemented_pending_exact_head |
| Stable checks and authority holds remain intact | Exact Y1 checker and full platform suite | CI and human review | pending_exact_head |

## Quality Improvement Candidates

- `include_now`: all seven non-empty shared-path subsets plus unrelated work.
- `defer_named_follow_up`: generic policy-schema normalization outside this Y1
  renewal if future guards need a shared trigger taxonomy.
- `reject_scope_creep`: exercise, engine, lesson-output, route, screenshot, and
  product-authority changes.

## Allowed paths

- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js`
- `reports/json/y1-golden-rollout-wave-1-*.json`
- `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-*`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`
- deterministic dashboard and GitHub agent-index outputs
- PR #214 description and review comments

## Forbidden paths

- `references/machine/` and `references/external/`
- exercise source data and target-readiness flags
- engines, runtime behavior, or generated lesson output
- lesson repository files
- product routes, screenshots, and rendered exercise content
- unrelated governance or branch-protection policy

## Repair

1. Keep all three shared paths in `allowed_exact` so the historical PR #214
   payload remains valid.
2. Remove all three shared paths from `trigger_exact`.
3. Keep Y1-owned checker, test, wave, proof, packet, and sprint paths as renewal
   triggers.
4. Add policy regressions using the repository's actual wave policy:
   - every non-empty subset of the three shared paths, seven combinations in
     total, plus an unrelated future path does not trigger the renewal allowlist
     in `auto` mode and reports `scope_attestation_triggered:false`;
   - a Y1-specific checker path plus an unrelated future path does trigger and
     is rejected as mixed renewal scope;
   - the existing unrelated-only future-work regression remains passing.
5. Preserve full state, authority, rendered-input, route, roadmap, and wiring
   validation when renewal scope is not triggered.

## Evidence renewal

The policy and regression edits are substantive. After lead approval and local
validation:

1. Commit the repaired policy/tests as a new substantive payload.
2. Rebind the rendered delta proof, proof, packet, result, and lead evidence to
   that payload in an evidence-only commit.
3. Regenerate the internal dashboard and GitHub agent indexes in deterministic
   follow-up commits.
4. Refresh the PR description and active evidence with the focused and platform
   test totals observed after implementation; do not copy pre-repair totals.
5. Obtain renewed exact-head lead review, remote `validate-platform`, live
   branch-protection output, and PR Readiness Reviewer routing.
6. Mark ready only if the route is `READY_FOR_HUMAN_REVIEW`; do not merge without
   explicit owner authorization for the final exact head.

## Inputs

- Human HOLD verdict on PR #214 exact head `b5ddbae3...`.
- Current `main` at `b7ec603880bcd8cc98c93526121ca71d3f31edcd`.
- Current lesson evidence snapshot
  `96c0970f45739a8758cf7e932c6bce77806cd68d`.
- Existing Y1 wave policy, checker, focused suite, packet, and rendered delta
  proof.

## Outputs

- Corrected trigger policy with shared paths retained only as allowed paths.
- Actual-policy real-Git regression coverage for future mixed work.
- Rebound proof, packet, result, lead evidence, dashboard, and indexes.
- Updated PR description with observed post-repair test totals.
- Renewed exact-head CI, lead review, branch-protection, and readiness evidence.

## Operationalized sprint procedure

1. Keep PR #214 in draft and record the human HOLD; verify current `main` before
   implementation and stop for relevant base advancement.
2. Obtain lead approval of this plan, implement only the trigger-policy and
   regression repair, then run the focused tests and lead implementation review.
3. Commit the substantive payload, regenerate commit-bound proof, and run the
   exact Y1 validator plus the full platform acceptance suite.
4. Rebind evidence to the substantive payload, regenerate dashboard and indexes
   in deterministic commits, and update the PR description from observed output.
5. Run exact-head lead review, remote CI, live branch protection, and the PR
   Readiness Reviewer. Stop on any stale head, blocker, or route other than
   `READY_FOR_HUMAN_REVIEW`.
6. Mark ready only after those validators pass and return for a new human
   decision. Do not merge without exact-head owner authorization.

## Acceptance tests

```bash
npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode pull_request --scope-mode auto --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head <exact-head> --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-trigger-policy-repair-plan.md
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:agent-index-freshness
npm.cmd run check:scope-language
git diff --check origin/main...HEAD
git -C ../4veco-lessen diff --check
```

## Authority boundary

This repair changes only guard activation and evidence. It does not authorize
rollout/adoption, automatic migration, completion language, diagnostics,
mastery/sequencing, adaptive routing, PV, summative use, broad product use, or
student/product use. It does not change exercise source, engine behavior,
generated lesson output, routes, screenshots, or target-readiness flags.

## Non-negotiable requirements

- Shared infrastructure paths remain allowed for this historical renewal but
  never activate its fixed-path allowlist by themselves or in combination.
- A Y1-owned trigger combined with any unrelated path remains rejected.
- Non-triggered ranges still run stable state, authority, rendered-input, route,
  roadmap, and wiring validation.
- Exact event base/head verification and committed changed-path comparison stay
  intact.
- The six-surface contract and commit-bound screenshot reuse remain unchanged.
- No missing core requirement may be carried under `PASS WITH FLAGS`.
- No product, rollout, completion, diagnostic, mastery, PV, summative, broad-use,
  or student-use authority is expanded.
- PR #214 remains draft until exact-head CI, lead review, live branch protection,
  and readiness routing all pass on the renewed head.

## Core-requirement checklist

| Requirement | Planned proof |
|---|---|
| Shared paths remain in `allowed_exact` | Direct policy assertion |
| Shared paths are absent from `trigger_exact` | Direct policy assertion |
| All seven shared-path subsets plus unrelated work remain non-triggering | Actual-policy regression loop and false-scope output |
| Y1-specific plus unrelated work is rejected | Actual-policy negative regression |
| Unrelated-only work still passes | Existing real-Git regression |
| Non-triggered full validation remains active | Existing full-mode state/rendered-drift regressions |
| Event and committed-path guarantees remain intact | Existing deletion, rename, event, synthetic-merge, and Unicode tests |
| Evidence and review are rebound to the new substantive payload | Cross-bound packet/proof/delta checks |
| Published test totals are current | Totals captured from post-repair focused and full runs |
| Authority holds remain intact | Packet/proof/result assertions and scope-language validation |
| Exact-head publication workflow is complete | Green CI, branch protection `ok:true`, lead verdict, and readiness decision |

## Proof Required to Close

Closure proof must show all seven shared-path subsets plus unrelated work pass
without triggering renewal scope, Y1-specific mixed scope still fails, the
focused and full test suites pass with observed totals, and the exact Y1
validator accepts the rebound evidence tail. Lead review, report validators,
remote exact-head CI, live branch protection, and readiness review must all be
current before the repair can close.

## Rollback plan

Before merge, keep or return PR #214 to draft and revert the trigger-policy
repair commits on its branch. After merge, revert PR #214 as one unit. No lesson
regeneration, exercise-source restoration, or screenshot recapture is required.

## Human review required

Human review is mandatory because this PR changes required CI behavior and an
L4 product-authority guard. The PR may be marked ready only after the readiness
route is `READY_FOR_HUMAN_REVIEW`, and merge requires new explicit owner
authorization tied to the final exact head.

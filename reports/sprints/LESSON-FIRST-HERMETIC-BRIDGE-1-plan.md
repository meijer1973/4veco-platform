# LESSON-FIRST-HERMETIC-BRIDGE-1 Plan

## Objective

Repair the platform-main test fixture that makes the lesson-first compatibility
state fail under the workflow's intentional synthetic source-branch labels.
This bridge must land separately before the held companion bundle can rebuild
its exact-base compatibility evidence.

Platform PR #198 and lesson PR #44 remain frozen, draft, and unauthorized.
Compatibility run `32012582396` remains the current `KEEP_DRAFT_REVISE`
evidence until this bridge is integrated and a replacement exact-base run
exists.

## Quality Floor

1. The origin-main fixture explicitly ignores ambient compatibility source
   labels and continues to prove the remote-ref inventory contract.
2. The production generator and compatibility workflow behavior are unchanged.
3. The exact synthetic environment that failed remotely passes locally.
4. Focused compatibility/index tests and the full platform suite pass.
5. Rawls approves the exact committed substantive SHA before review evidence
   and generated indexes are committed.
6. Trusted-main tooling regenerates and verifies all four agent indexes twice;
   the terminal tail contains only the non-empty allowlisted byte-delta subset.
7. The bridge PR remains draft until exact-head CI, Rawls PR review, and PR
   Readiness complete. No merge occurs without canonical owner authorization.

## Procedure

1. Start from exact platform `main`
   `20955635f15b4ce0f23adf13179dd5d3d8006a90` in a dedicated claimed
   worktree.
2. Reproduce the lesson-first failure from run `32012582396` and bind it to the
   `lesson index follows origin/main even when local HEAD is stale` fixture.
3. Pass an isolated environment to that fixture and explicitly pollute the
   outer lesson source-branch label so the regression fails if isolation is
   removed later.
4. Run the targeted test under compatibility labels, focused index and
   compatibility suites, full platform validation, governance/map/URL/index
   freshness, branch protection, worktree safety, and diff checks.
5. Commit the substantive fix with this plan and the completed result record.
   Obtain Rawls work-review `OK`; implement and re-review any findings.
6. Commit the accepted review record. Use tooling pinned to trusted platform
   `main` to regenerate and verify all four indexes twice from that evidence
   commit and lesson `main` `ba08b9c2e033a877c0d1b57952055ce697912a22`.
7. Commit only changed generated-index paths as a single-parent terminal tail,
   then rerun freshness, diff, and clean-worktree checks. Make no later commit.
8. Push without force, open a draft PR, run exact-head CI, obtain Rawls
   exact-head PR review `OK`, and run PR Readiness.
9. Present the bridge for separate human payload authorization. If authorized,
   publish the canonical machine-readable comment and integrate only through
   `authorized-pr-integration` with post-merge main CI.
10. After bridge integration, re-fetch both bundle repositories, inspect the
    #198 merge tree, and restart exact-base bundle evidence. Only then may run
    `32012582396` be superseded.

## Stop Conditions

- Any source change outside the fixture, its direct tests, required evidence,
  maps, URL index, or generated agent indexes.
- Any substantive conflict when the later platform-main bridge is merged into
  PR #198.
- Any head/base/state drift during proof-sensitive operations.
- Any Rawls verdict other than `OK`, readiness route other than the canonical
  human-review route, missing owner authorization, or request for admin bypass.

## Plan Review

Reviewer: Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`).

- Round 1: `REVISE`. Retain run `32012582396` as current blocker evidence;
  specify the bridge evidence/index tail; require canonical owner
  authorization and trusted-lane integration; make the bundle restart boundary
  explicit.
- Round 2: `OK`. The procedure above incorporates every finding.

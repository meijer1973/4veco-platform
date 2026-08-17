# LESSON-FIRST-HERMETIC-BRIDGE-1 Result

Status: implementation complete; exact-commit work review pending

## Result

The lesson origin-main fixture now supplies an isolated `env: {}` to
`buildIndex`. The regression deliberately sets the ambient lesson source branch
to `compatibility/lesson-first/lesson`, proves the generated fixture still uses
`origin/main`, and restores the caller's environment afterward.

Production generation, compatibility state construction, and runtime bundle
integration are unchanged. This is a test-hermeticity bridge for platform
`main`, where the lesson-first intermediate intentionally runs the platform
base under synthetic compatibility labels.

## Blocker Evidence

- Compatibility run: `32012582396`.
- Exact members: platform base `20955635f15b4ce0f23adf13179dd5d3d8006a90`,
  platform candidate `04b7eb8a118b286eda774bcf65ea61b7b0de98ca`,
  lesson base `ba08b9c2e033a877c0d1b57952055ce697912a22`, and
  lesson candidate `318b5184a896f0eaa6249ff6fa9f7298e29bb2c1`.
- `bundle-final`: success.
- `platform-first`: expected route mismatch against lesson `main`.
- `lesson-first`: failed only
  `check-agent-index-freshness > lesson index follows origin/main even when
  local HEAD is stale`; expected `origin/main`, observed the inherited
  `compatibility/lesson-first/lesson` label.
- Summary: `no_green_intermediate_order`; bundle classification remains
  `KEEP_DRAFT_REVISE`.

Run `32012582396` remains current blocker evidence. It may be superseded only
after this bridge is integrated into platform `main` and a replacement
compatibility run uses that new exact base.

## Validation

- Targeted fixture under the exact synthetic compatibility environment:
  1 suite and 12 tests passed.
- Focused agent-index and compatibility group: 4 suites and 51 tests passed.
- Full `npm.cmd run check:platform` under the synthetic lesson-first source
  labels: 99 suites and 1,325 tests passed; 6 suites and 8 tests skipped.
- `npm.cmd run check:integration-lane`: 10 suites and 145 tests passed.
- `npm.cmd run check:pr-readiness`: 5 suites and 169 tests passed.
- Active governance wording against lesson `main`, active scope language,
  governance freshness, URL-index freshness, agent-index freshness, branch
  protection, worktree ownership/branch safety, and `git diff --check`: passed.
- Agent-index regeneration is intentionally deferred until after exact-SHA
  work review and the committed review record.

## Authority Boundary

This bridge does not authorize or merge any PR. Platform PR #198 and lesson PR
#44 remain frozen, draft, and held. A ready bridge PR still requires canonical
human payload authorization and trusted-lane integration before the bundle can
restart.

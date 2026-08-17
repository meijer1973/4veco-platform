# COMPANION-WORKFLOW-GUARDRAILS-1 PR Workflow Packet

> Historical snapshot from the July publication attempt. Its draft state,
> reviewed SHA, CI state, and blocked-handoff wording are superseded. Current
> lifecycle authority is the exact-head PR Readiness comment on PR #198,
> generated under `docs/review/pr-readiness-routing-policy.md`.

## PR

- Repository: `meijer1973/4veco-platform`
- PR: https://github.com/meijer1973/4veco-platform/pull/198
- State: draft
- Base: `main`
- Head branch: `codex/skilltree-improvement-20260618`
- Reviewed content commit after conflict resolution: `74a3b6d329c911431f0028f1f904f5e09ffce0a6`
- Note: the final PR head may include an evidence-only commit after this packet update; the live PR head SHA is the review target.
- Title: `[codex] tighten companion workflow guardrails`

## Scope

This PR updates active companion-material, also called Part B, workflow
guardrails so they match the profile-aware validator:

- `student-web` is the default Part B profile with a 14-file validator baseline.
- `office` and `legacy-full` add 13 DOCX files to that baseline for the opt-in 27-file contract.
- DOCX conversion is office/legacy only, not a default student-web phase.
- Companion authoring and visual-review rules distinguish the validator baseline
  from the wider product route, advisory short check, and target-equivalent
  exit ticket.
- The L1.5V 24-file design proposal is marked historical and points to the active workflow.
- Quality-control guidance now names the schema-v2 `partA:` / `companion:` split and flat paragraph layout.
- Sprint plan, plan review rounds, correction log, validation log, and work review are included.
- GitHub-facing repository indexes were refreshed.

No generated lesson output was changed.

## Changed Files

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `agents/econ-companion-visual-review.md`
- `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/*`
- `docs/L1.5V/F-plan-part-a-b-separation.md`
- `reports/github-agent-index-platform.*`
- `skills/econ-companion-artifacts.md`
- `skills/econ-quality-control.md`

## Validation

Local validation passed before PR creation and again after merging current
`origin/main`:

- `npm.cmd test -- scripts/tests/validate-paragraph.test.js`
- `npm.cmd run check:scope-language`
- `git diff --check origin/main`
- Active stale-text search returned `NO_ACTIVE_STALE_MATCHES`.
- Historical 24-file wording remains only in the historical L1.5V proposal with an active-contract pointer.

Conflict-resolution notes:

- Merged `origin/main` into `codex/skilltree-improvement-20260618`.
- Resolved conflicts in `AGENTS.md`, `BUILD-PARAGRAPH.md`,
  `agents/econ-companion-visual-review.md`,
  `skills/econ-companion-artifacts.md`, and generated indexes.
- Preserved current `main` lane-boundary wording: PDF output belongs to Part A /
  publisher-print unless a future human decision creates a separate PDF lane.
- Preserved this sprint's 14-file validator baseline / 13 additional DOCX
  distinction while separating it from product-route completeness.
- Re-ran `agent:index` for the platform index, then restored the lesson index to
  `origin/main` because this sprint does not change lesson inventory and the
  local lesson checkout is behind lesson `main`.

Work review passed:

- Rawls returned PASS / OK for the completed work.
- Recorded at `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-work-review-round1.md`.

## Branch And Worktree Safety

- `gh --version`: PASS, GitHub CLI 2.87.0.
- `gh auth status`: PASS, authenticated as `meijer1973`.
- `git fetch --prune origin`: PASS.
- `git status --short --branch`: branch in sync before commit; ahead by one commit before push.
- `git branch --show-current`: `codex/skilltree-improvement-20260618`.
- Pre-commit worktree safety check: failed because this already-dirty supplied task worktree had no lock.
- Resolution: after committing the reviewed scope, the clean claim command passed:
  - `npm.cmd run check:agent-worktree-safety -- --claim --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/ --require-clean`
- Lock owner / agent id: `codex-main`.
- Worktree path: `C:/wt/SKILLTREE-20260618/4veco-platform`.
- Post-merge worktree safety check: PASS with the same owner/task lock present.

## Historical CI State

Initial `gh pr checks 198 --json ...` result before the conflict-resolution
push: no checks reported yet on `codex/skilltree-improvement-20260618`.

At the time of this July snapshot, human-review handoff remained blocked until
`platform-ci / validate-platform` passed. This is not the current decision;
the exact-head PR Readiness comment is authoritative.

## PR Lead-Review Request

Review whether this PR is ready to proceed through the PR workflow after any
required corrections:

- Does the PR scope match the reviewed work and avoid unrelated changes?
- Is the branch/worktree safety evidence adequate after the clean claim?
- Are generated index changes acceptable and in scope?
- Is validation sufficient for docs/skills/agent guardrail changes?
- Is the PR still blocked from human review until CI passes or a waiver exists?

## August 17 2026 Current Bundle Refresh

This section supersedes the historical snapshot above for the current refresh
cycle. Final lifecycle authority will still be the exact-head bundle readiness
comments generated after compatibility and lead review.

- Bundle: `COMPANION-ROUTE-CONSISTENCY-20260813-1`
- Platform base: `20955635f15b4ce0f23adf13179dd5d3d8006a90`
- Lesson base: `ba08b9c2e033a877c0d1b57952055ce697912a22`
- Lesson candidate: `318b5184a896f0eaa6249ff6fa9f7298e29bb2c1`
- Platform merge checkpoint: `f19dbc90aa3320fe3af4543347e14fa0007161f5`
- Current state: both PRs remain draft and held; all previous compatibility,
  review, and readiness evidence is superseded for authorization purposes.
- Required remaining proof: committed substantive-SHA Rawls review, trusted-main
  regeneration and verification of all four indexes followed by a terminal
  generated-index delta, exact-head CI classification, exact three-state bundle
  compatibility, remote Rawls review, and coordinated PR Readiness.
- Boundary: this refresh does not create bundle authorization, does not claim an
  integration refresh, and does not merge either member.

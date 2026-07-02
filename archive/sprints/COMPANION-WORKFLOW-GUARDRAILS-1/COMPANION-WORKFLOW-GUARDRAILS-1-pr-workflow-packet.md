# COMPANION-WORKFLOW-GUARDRAILS-1 PR Workflow Packet

## PR

- Repository: `meijer1973/4veco-platform`
- PR: https://github.com/meijer1973/4veco-platform/pull/198
- State: draft
- Base: `main`
- Head branch: `codex/skilltree-improvement-20260618`
- Reviewed commit: `11252ac05f4aaef350e55f69539fb7a400b61f70`
- Title: `[codex] tighten companion workflow guardrails`

## Scope

This PR updates active companion-material, also called Part B, workflow
guardrails so they match the profile-aware validator:

- `student-web` is the default Part B profile with 14 required root files.
- `office` and `legacy-full` are the opt-in export-heavy profiles with the 27-file contract.
- DOCX conversion is office/legacy only, not a default student-web phase.
- Companion authoring and visual-review rules list the same current student-web surface family.
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
- `reports/github-agent-index-lessen.*`
- `skills/econ-companion-artifacts.md`
- `skills/econ-quality-control.md`

## Validation

Local validation passed:

- `npm.cmd test -- scripts/tests/validate-paragraph.test.js`
- `npm.cmd run check:scope-language`
- `git diff --check HEAD`
- Active stale-text search returned `NO_ACTIVE_STALE_MATCHES`.
- Historical 24-file wording remains only in the historical L1.5V proposal with an active-contract pointer.

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

## CI State

Initial `gh pr checks 198 --json ...` result: no checks reported yet on
`codex/skilltree-improvement-20260618`.

Human-review handoff remains blocked until `platform-ci / validate-platform`
passes for the final reviewed commit or an explicit CI waiver is recorded.

## PR Lead-Review Request

Review whether this PR is ready to proceed through the PR workflow after any
required corrections:

- Does the PR scope match the reviewed work and avoid unrelated changes?
- Is the branch/worktree safety evidence adequate after the clean claim?
- Are generated index changes acceptable and in scope?
- Is validation sufficient for docs/skills/agent guardrail changes?
- Is the PR still blocked from human review until CI passes or a waiver exists?

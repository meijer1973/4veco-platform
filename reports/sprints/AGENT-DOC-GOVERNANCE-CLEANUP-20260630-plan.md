# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Plan

Status: pending lead-review approval.

## Task

Fix audit findings 1, 2, 3, and 8 from the AGENTS/documentation governance inspection:

- Finding 1: root platform `AGENTS.md` must not depend on missing `../CLAUDE.md`.
- Finding 2: active platform build docs must not use absolute `C:\Projects\...` links.
- Finding 3: lesson `AGENTS.md` platform links must resolve from the lesson repo.
- Finding 8: the retired `.claude/commands` mirror tree must stay removed and guarded.

## Branch And Worktree Baseline

- Platform worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-platform`
- Lesson worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`
- Branch in both repos: `codex/agent-doc-governance-cleanup-20260630`
- Base in both repos: `origin/main`
- Platform safety claim: `npm.cmd run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean`
- Lesson safety claim: `npm.cmd run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean --worktree C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`

Discovery note: the stale platform findings are present on `origin/codex/workflow-optimization-20260627`, but `origin/main` already contains the platform entrypoint cleanup for findings 1, 2, and 8. The lesson link issue from finding 3 still exists on `origin/main`.

## Implementation Steps

1. Record pre-implementation freshness and worktree proof for both repositories:
   - `git fetch --prune origin`
   - `git status --short --branch`
   - `git branch --show-current`
   - `git rev-parse HEAD`
   - platform and lesson worktree-safety claims above
2. Keep platform fixes 1, 2, and 8 as verified base state unless checks reveal a regression:
   - `AGENTS.md` starts from the canonical AGENTS wording rather than `../CLAUDE.md`.
   - `AGENTS.md` and `build-scripts/README.md` use repo-relative BUILD links.
   - `.claude/commands` is absent from tracked and present files.
   - `build-scripts/sprints/check-pptx-skill-mirror.js` and its Jest test enforce the retired command surface.
3. Edit lesson `AGENTS.md` so the initial platform references use `../4veco-platform/...`, matching the real sibling-repo layout.
4. Refresh generated repository maps and URL indexes after the AGENTS edit, then record whether each command changed files:
   - `npm.cmd run agent:index`
   - `node build-scripts/sprints/emit-url-index.js`
5. Preserve only intentional generated changes. Do not stage or copy unrelated dirty files from the original `C:/wt/WORKFLOW-OPT-20260627` worktree.
6. Write the verification evidence to `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-test-evidence.md` with command, cwd, exit code, and short result summary.
7. Save lead-review records under `reports/sprints/` so remote reviewers can inspect the review loop:
   - `AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-lead-review-round1.md`
   - `AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-corrections.md`
   - `AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-lead-review-round2.md`
   - implementation review/correction records after work review

## Verification

Run and record:

- Platform baseline/path checks:
  - no active `../CLAUDE.md` read-first reference in platform `AGENTS.md`
  - no active absolute build-doc links such as `C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md` in platform `AGENTS.md` or `build-scripts/README.md`; intentional worktree-root examples such as `C:\Projects\4veco-worktrees\<task-id>\...` are not failures
  - `git ls-files -- .claude/commands` returns empty
  - `Test-Path .claude/commands` returns false
- Lesson link checks:
  - the first-platform-link block in lesson `AGENTS.md` uses `../4veco-platform/...`
  - every referenced platform file exists from the lesson worktree
- Guard/checker commands:
  - `npm.cmd run check:pptx-skill-mirror`
  - `npm.cmd run check:active-governance-wording`
  - `npx jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand`
  - `git diff --check` in both repos
- PR workflow/freshness:
  - `npm.cmd run finalization:freshness`
- Generated index proof:
  - record the post-refresh `git status --short` in both repos
  - include generated index files only when changed by the mandatory refresh commands

## Review And PR Workflow

1. Lead-review subagent reviews this plan before implementation. Revise until the subagent returns an OK/PASS.
2. Execute the approved plan.
3. Lead-review subagent reviews the completed work, diff, and verification evidence. Revise until OK/PASS.
4. Publish draft PRs according to the actual diff shape:
   - Expected path: because this plan, review records, test evidence, and any generated index proof live in the platform repo, open a platform controller PR and a paired lesson PR with bundle id `AGENT-DOC-GOVERNANCE-CLEANUP-20260630`.
   - Lesson-only fallback: if no platform files are committed and only `4veco-lessen` changes, open only the lesson PR and run readiness with `--repo meijer1973/4veco-lessen`; do not classify a lesson-only PR as a cross-repo bundle.
   - Paired path: if platform evidence/index files are committed, both PR bodies must carry the same `bundle_id`, exact paired PR numbers after creation, and exact platform/lesson payload SHAs.
5. After draft publication, run the PR-readiness workflow from the platform repo for the remotely inspectable PR state:
   - collect exact head SHA, changed paths, checker proof, lead-review proof, and branch-protection/freshness evidence;
   - for a lesson-only PR, pass `--repo meijer1973/4veco-lessen`;
   - for paired PRs, run exact-member bundle compatibility proof with `npm.cmd run check:cross-repo-bundle` after creating the evidence file/matrix required by that checker, and use the platform controller PR for readiness routing;
   - run `npm.cmd run review:pr-readiness` or `npm.cmd run route-and-apply:pr-readiness -- --pr <number> --evidence <evidence.json> --expect-transition MARK_READY` where the route supports it;
   - use the lead-review subagent for the workflow-required subagent review loop before marking ready.
6. Because this work changes or verifies governance/review surfaces, stop after `READY_FOR_HUMAN_REVIEW` and present the PR or paired PR bundle for human review. Do not merge.

## Stop Conditions

- A platform base regression appears that is broader than findings 1, 2, or 8.
- Generated map refresh produces broad unrelated churn.
- PR readiness cannot prove current remote head, lead-review SHA, required CI/checker status, or branch-protection evidence.
- Cross-repo bundle proof is required but cannot be made exact for both repositories.

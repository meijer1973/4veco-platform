# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Test Evidence

Status: implementation verification refreshed again on 2026-07-01 after both PR
branches were stale against live `main`.

## 2026-07-01 Stale-PR Refresh Evidence

This section supersedes the earlier 2026-06-30 base-sync values below. The
final pushed PR head may include an evidence-only tail commit after these
commands; PR readiness evidence records the exact final pushed heads.

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| `git fetch origin --prune; git rev-parse origin/main` | platform | 0 | refreshed platform `origin/main` to `2eaf4d5f1460abbc6dd81bb7adf915174cb23d40` |
| `git merge --no-edit origin/main` | platform | 0 | merged current platform `main`; generated index conflicts were limited to `reports/github-agent-index-*` and resolved by rerunning `npm.cmd run agent:index`; refreshed validation head `e4454331f37fa328676d20634e8f6ebc5a9fa1e1` |
| `git fetch origin --prune; git rev-parse origin/main` | lesson | 0 | refreshed lesson `origin/main` to `43a6d921bda67a5593d2f0dcc0a89a44a99d42b5` |
| `git merge --no-edit origin/main` | lesson | 0 | merged current lesson `main`; no conflict in `AGENTS.md`; refreshed validation head `639448b1601d981fcfc41b29d0c88db3f53cd7ac` |
| `git diff origin/main...HEAD -- AGENTS.md` | lesson | 0 | lesson source diff remains limited to four path-prefix corrections from `4veco-platform/...` to `../4veco-platform/...` |
| `npm.cmd run agent:index` | platform | 0 | regenerated platform and lesson GitHub agent indexes after both branch refreshes |
| `node build-scripts\sprints\emit-url-index.js` | platform | 0 | regenerated `reports/url-index.md`; no final URL-index diff remained |
| `npm.cmd run finalization:freshness` | platform | 0 | remote `main` and local `origin/main` both `2eaf4d5f1460abbc6dd81bb7adf915174cb23d40`; remote main is ancestor of platform head `e4454331f37fa328676d20634e8f6ebc5a9fa1e1` |
| `npm.cmd run check:pptx-skill-mirror` | platform | 0 | `OK PPTX skill has no retired command mirror` |
| `npm.cmd run check:active-governance-wording` | platform | 0 | `Active governance wording check passed.` |
| `npx.cmd jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` | platform | 0 | 2 suites passed, 14 tests passed |
| `git diff --check` | platform | 0 | no whitespace errors |
| `git diff --check` | lesson | 0 | no whitespace errors |
| `npm.cmd run check:branch-protection` | platform | 0 | strict `validate-platform`, required approving review count `0`, no failures |

## 2026-07-01 Partial Integration Recovery

The authorized bundle integration lane merged the lesson member first, then
stopped before platform merge because a concurrent platform `main` update
cancelled the required intermediate platform CI run.

| Event or Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| `authorized-bundle-integration` run `28501386904` | GitHub Actions | 1 | lesson PR #42 merged first at `ba08b9c2e033a877c0d1b57952055ce697912a22`; platform PR #187 was not merged |
| `npm.cmd run integrate:authorized-bundle -- --allow-partial-resume --dry-run ...` | platform | 1 | stopped with `partial_resume_platform_main_advanced`; renewed platform validation/readiness/authorization required before platform merge |
| `git fetch origin --prune; git merge --no-edit origin/main` | platform | 0 | refreshed platform branch from `origin/main` `aa824cb50bea6735f9c86a344389ae6528f9b1de`; merge commit `87ed8842a5f4a0a3b94a10c2ef9b56df6e3e7df9` before evidence/index tail |
| `npm.cmd run agent:index` | platform | 0 | regenerated platform and lesson GitHub agent indexes after platform base refresh and lesson merge |
| `node build-scripts\sprints\emit-url-index.js` | platform | 0 | regenerated `reports/url-index.md`; no URL-index diff remained |

## Repository State

- Platform worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-platform`
- Platform branch: `codex/agent-doc-governance-cleanup-20260630`
- Platform head during refreshed verification: `57970b568841932ad99c0a789640a599db723fc7`
- Platform `origin/main`: `4df6dde58d18ffbc05412cc6a3ef8c7e559b44c3`
- Lesson worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`
- Lesson branch: `codex/agent-doc-governance-cleanup-20260630`
- Lesson head during refreshed verification: `efbef2330dafa42380681e69da6572dce9027591`
- Lesson `origin/main`: `aefab74fb4d609e42140723b3e01db61e1f3644e`

## Worktree Safety And Freshness

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| `git fetch --prune origin; git status --short --branch; git branch --show-current; git rev-parse HEAD` | platform | 0 | branch `codex/agent-doc-governance-cleanup-20260630`, head `99a9dde56e5606658ea5f744a6efd819eed708c1` before plan commit |
| `git fetch --prune origin; git status --short --branch; git branch --show-current; git rev-parse HEAD` | lesson | 0 | branch `codex/agent-doc-governance-cleanup-20260630`, head `aefab74fb4d609e42140723b3e01db61e1f3644e` |
| `npm.cmd run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean` | platform | 0 | `ok:true`, branch prefix accepted, clean, lock same owner/task |
| `npm.cmd --prefix ..\4veco-platform run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean --worktree C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen` | lesson | 0 | `ok:true`, branch prefix accepted, clean, lock same owner/task |
| `git fetch --prune origin; git status --short --branch; git rev-parse origin/main` | platform | 0 | after lead-review stale-base finding, `origin/main` advanced to `4df6dde58d18ffbc05412cc6a3ef8c7e559b44c3` |
| `git merge --no-edit origin/main` followed by generated index regeneration and merge commit | platform | 0 | base-sync merge committed as `57970b568841932ad99c0a789640a599db723fc7`; generated index conflicts resolved by rerunning generators |

## Implementation Checks

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| platform stale-link check for active `CLAUDE.md`, absolute build-doc links, tracked/present `.claude/commands` | platform | 0 | no active `CLAUDE.md` read-first reference; no absolute `C:\Projects\4veco\4veco-platform\BUILD-*` links; no tracked `.claude/commands`; `.claude/commands` absent |
| lesson link block and existence check | lesson | 0 | lines 18-21 use `../4veco-platform/...`; all four referenced platform files exist from the lesson worktree |
| `npm.cmd run check:pptx-skill-mirror` | platform | 0 | `OK PPTX skill has no retired command mirror` |
| `npm.cmd run check:active-governance-wording` | platform | 0 | `Active governance wording check passed.` |
| `npx jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` | platform | 1 | Windows PowerShell blocked `npx.ps1` by execution policy; rerun below used `npx.cmd` |
| `npx.cmd jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` | platform | 0 | 2 suites passed, 13 tests passed |
| `git diff --check` | platform | 0 | no whitespace errors |
| `git diff --check` | lesson | 0 | no whitespace errors |
| `npm.cmd run finalization:freshness` | platform | 0 | remote `main` and local `origin/main` both `4df6dde58d18ffbc05412cc6a3ef8c7e559b44c3`; remote main is ancestor of platform head `57970b568841932ad99c0a789640a599db723fc7`; required policy file hashes match remote main |
| `npm.cmd run check:branch-protection` | platform | 0 | strict `validate-platform`, required approving review count `0`, force pushes and deletions disabled, no failures |

## Generated Index Refresh

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| `npm.cmd run agent:index` | platform | 0 | rewrote `reports/github-agent-index-platform.*` and `reports/github-agent-index-lessen.*` |
| `node build-scripts/sprints/emit-url-index.js` | platform | 0 | rewrote `reports/url-index.md`; no git diff remained for `reports/url-index.md` |

Post-refresh changed files:

- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`

## Source Diff Summary

- Platform: plan/review evidence, result/test evidence, base-sync merge to `origin/main` `4df6dde58d18ffbc05412cc6a3ef8c7e559b44c3`, and generated agent indexes refreshed after the merge.
- Lesson: `AGENTS.md` initial platform reference block changed from `4veco-platform/...` to `../4veco-platform/...` in commit `efbef2330dafa42380681e69da6572dce9027591`.

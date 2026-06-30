# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Test Evidence

Status: implementation verification complete before lead-review.

## Repository State

- Platform worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-platform`
- Platform branch: `codex/agent-doc-governance-cleanup-20260630`
- Platform head during source verification: `46ac1653564907ea16f4cdb3480a136ed9bb51c0`
- Platform `origin/main`: `99a9dde56e5606658ea5f744a6efd819eed708c1`
- Lesson worktree: `C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`
- Lesson branch: `codex/agent-doc-governance-cleanup-20260630`
- Lesson head during source verification: `aefab74fb4d609e42140723b3e01db61e1f3644e`
- Lesson `origin/main`: `aefab74fb4d609e42140723b3e01db61e1f3644e`

## Worktree Safety And Freshness

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| `git fetch --prune origin; git status --short --branch; git branch --show-current; git rev-parse HEAD` | platform | 0 | branch `codex/agent-doc-governance-cleanup-20260630`, head `99a9dde56e5606658ea5f744a6efd819eed708c1` before plan commit |
| `git fetch --prune origin; git status --short --branch; git branch --show-current; git rev-parse HEAD` | lesson | 0 | branch `codex/agent-doc-governance-cleanup-20260630`, head `aefab74fb4d609e42140723b3e01db61e1f3644e` |
| `npm.cmd run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean` | platform | 0 | `ok:true`, branch prefix accepted, clean, lock same owner/task |
| `npm.cmd --prefix ..\4veco-platform run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean --worktree C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen` | lesson | 0 | `ok:true`, branch prefix accepted, clean, lock same owner/task |

## Implementation Checks

| Command | Cwd | Exit | Evidence |
|---|---|---:|---|
| platform stale-link check for active `CLAUDE.md`, absolute build-doc links, tracked/present `.claude/commands` | platform | 0 | no active `CLAUDE.md` read-first reference; no absolute `C:\Projects\4veco\4veco-platform\BUILD-*` links; no tracked `.claude/commands`; `.claude/commands` absent |
| lesson link block and existence check | lesson | 0 | lines 18-21 use `../4veco-platform/...`; all four referenced platform files exist from the lesson worktree |
| `npm.cmd run check:pptx-skill-mirror` | platform | 0 | `OK PPTX skill has no retired command mirror` |
| `npm.cmd run check:active-governance-wording` | platform | 0 | `Active governance wording check passed.` |
| `npx jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` | platform | 1 | Windows PowerShell blocked `npx.ps1` by execution policy; rerun below used `npx.cmd` |
| `npx.cmd jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` | platform | 0 | 2 suites passed, 12 tests passed |
| `git diff --check` | platform | 0 | no whitespace errors |
| `git diff --check` | lesson | 0 | no whitespace errors |
| `npm.cmd run finalization:freshness` | platform | 0 | remote `main` and local `origin/main` both `99a9dde56e5606658ea5f744a6efd819eed708c1`; remote main is ancestor of platform head; required policy file hashes match remote main |

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

- Platform: plan/review evidence committed in `46ac1653564907ea16f4cdb3480a136ed9bb51c0`; generated agent indexes modified after mandatory refresh.
- Lesson: `AGENTS.md` initial platform reference block changed from `4veco-platform/...` to `../4veco-platform/...`.

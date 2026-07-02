# COMPANION-WORKFLOW-GUARDRAILS-1 Validation Log

## Local Validation

| Command | Result | Notes |
|---|---|---|
| `npm.cmd test -- scripts/tests/validate-paragraph.test.js` | PASS | 1 suite passed, 13 tests passed. Confirms current validator profile behavior, including 14-file `student-web` and 27-file `legacy-full`. |
| `npm.cmd run check:scope-language` | PASS | `OK scope-language check: active surfaces`. |
| `git diff --check` | PASS | No whitespace errors reported. |
| `rg -n "File count: 27|required 27 Part B|validates the 27|required Part B root files listed|all 27 Part B|Phase 4c|Assume all paragraphs need all 14" BUILD-PARAGRAPH.md AGENTS.md skills agents build-scripts\README.md` | PASS | No active stale matches; recorded as `NO_ACTIVE_STALE_MATCHES`. |
| `rg -n "24 root|24-file|24 file|24 required" docs\L1.5V\F-plan-part-a-b-separation.md` | PASS WITH EXPECTED HISTORICAL MATCHES | Matches remain at historical lines only. |
| `rg -n "Historical note|BUILD-PARAGRAPH\.md|scripts/validate-paragraph\.js|student-web.*14" docs\L1.5V\F-plan-part-a-b-separation.md` | PASS | Confirms the L1.5V proposal has a top-of-file historical note and active-contract pointer to `BUILD-PARAGRAPH.md` plus `scripts/validate-paragraph.js`. |

The same local validation set was repeated after staging the intended sprint
files and refreshing repository indexes; all commands remained PASS.

## Repository Map Refresh

| Command | Result | Notes |
|---|---|---|
| `npm.cmd run agent:index` | PASS | Refreshed GitHub-facing platform and lesson indexes. The platform index now includes the eight new sprint/review files; the lesson index changed only by generated timestamp. |
| `node build-scripts/sprints/emit-url-index.js` | PASS | Rewrote `reports/url-index.md`; no tracked content delta was produced. |

## PR Preflight

| Command | Result | Notes |
|---|---|---|
| `gh --version` | PASS | GitHub CLI 2.87.0 is available. |
| `gh auth status` | PASS | Authenticated to `github.com` as `meijer1973` with repo/workflow scopes. |
| `git fetch --prune origin` | PASS | Remote refs refreshed before PR preparation. |
| `git status --short --branch` | PASS | Branch is `codex/skilltree-improvement-20260618` and in sync with origin before commit. Dirty files are the reviewed sprint scope. |
| `git branch --show-current` | PASS | Current branch is `codex/skilltree-improvement-20260618`. |
| `npm.cmd run check:agent-worktree-safety -- --check --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/` | PRE-COMMIT FAIL, RESOLUTION REQUIRED | The branch prefix and branch state passed, but the existing dirty worktree had no worktree lock. Because `--claim` requires a clean tree, the PR workflow resolves this by committing the reviewed scope first, then running the clean `--claim --require-clean` form before push. |

## PR Review Round 1 Resolution Validation

Rawls's first PR review found that the packet was local-only, the PR conflicted
with current `main`, and CI was not yet sufficient for human review.

Resolution evidence:

| Command | Result | Notes |
|---|---|---|
| `git merge origin/main` | RESOLVED | Conflicts were resolved in active companion docs/skills and generated index files. Current `main` PDF lane-boundary wording was preserved alongside this sprint's full student-web surface coverage. |
| `npm.cmd run agent:index` | PASS | Regenerated the platform index after merge resolution. |
| `node build-scripts/sprints/emit-url-index.js` | PASS | Rewrote the URL index after merge resolution. |
| Restore `reports/github-agent-index-lessen.*` to `origin/main` | PASS | This sprint does not change lesson inventory; the local lesson checkout is behind lesson `main`, so regenerated lesson-index churn was neutralized. |
| `npm.cmd test -- scripts/tests/validate-paragraph.test.js` | PASS | 1 suite passed, 13 tests passed after conflict resolution. |
| `npm.cmd run check:scope-language` | PASS | `OK scope-language check: active surfaces` after conflict resolution. |
| `git diff --check origin/main` | PASS | PR-relevant diff has no whitespace errors. A plain diff against pre-merge `HEAD` is noisy because incoming current-main files contain existing whitespace issues outside this sprint. |
| Active stale-text search | PASS | `NO_ACTIVE_STALE_MATCHES` after conflict resolution. |
| Historical note search | PASS | Historical L1.5V proposal still points to `BUILD-PARAGRAPH.md` plus `scripts/validate-paragraph.js` and names default `student-web` as 14 files. |
| `npm.cmd run check:agent-worktree-safety -- --check --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/` | PASS | Lock owner is `codex-main`, task is `COMPANION-WORKFLOW-GUARDRAILS-1`, branch prefix is valid, and the post-merge worktree was clean. |

## Dependency Note

`npm.cmd test` initially failed because `jest` was not installed in the local
worktree. `npm.cmd ci` was run from the checked-in lockfile, after which the
focused validator suite passed. `npm ci` reported existing dependency audit
items (1 low, 1 moderate); no dependency versions were changed in this sprint.

## Local Scope

This sprint changed platform documentation, skills, agents, and sprint-review
records only. It did not mutate generated lesson output in `../4veco-lessen`.

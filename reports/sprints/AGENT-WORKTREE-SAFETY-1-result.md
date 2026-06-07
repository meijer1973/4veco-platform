# Sprint AGENT-WORKTREE-SAFETY-1: Result

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md`

Plan JSON: `references/data/sprints/AGENT-WORKTREE-SAFETY-1.plan.json`

## Summary

Implemented one-agent-one-worktree workflow isolation.

Implemented:

- added worktree-safety policy to `AGENTS.md`;
- added worktree-safety policy to `../4veco-lessen/AGENTS.md`, including the
  lesson-specific generated-output warning and platform-checker route;
- added `build-scripts/ci/check-agent-worktree-safety.js`;
- added `build-scripts/ci/check-agent-worktree-safety.test.js`;
- added `npm.cmd run check:agent-worktree-safety`;
- recorded sprint plan, baseline, planning review, lead-review cycle, command
  log, result JSON, and diff summary;
- refreshed GitHub-facing agent indexes, URL index, internal dashboard, and
  roadmap state.

Worktree proof:

- platform worktree: `C:\wt\AGENT-WORKTREE-SAFETY-1\4veco-platform`
- lesson worktree: `C:\wt\AGENT-WORKTREE-SAFETY-1\4veco-lessen`
- branch: `codex/agent-worktree-safety-20260607`
- lock owner / agent id: `codex-AGENT-WORKTREE-SAFETY-1-20260607`
- platform lock path:
  `C:\Projects\4veco\4veco-platform\.git\worktrees\4veco-platform\4veco-agent-worktree-lock.json`
- lesson lock path:
  `C:\Projects\4veco\4veco-lessen\.git\worktrees\4veco-lessen\4veco-agent-worktree-lock.json`

Remote proof note:

PR URL, pushed commit SHA, pushed tag, and latest `platform-ci /
validate-platform` status are produced after these closure files are committed
and pushed. They are therefore reported in the final closure response rather
than embedded here as a self-referential result hash.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js AGENT-WORKTREE-SAFETY-1`
- `npx.cmd jest --runInBand build-scripts/ci/check-agent-worktree-safety.test.js`
- `npx.cmd jest --runInBand build-scripts/ci/check-agent-branch-safety.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `git diff --check`
- `git -C C:/wt/AGENT-WORKTREE-SAFETY-1/4veco-lessen diff --check`
- `npm.cmd run check:agent-worktree-safety -- --claim --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix "codex/,agent/"`
- `npm.cmd run check:agent-worktree-safety -- --check --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix "codex/,agent/"`
- `npm.cmd run check:agent-worktree-safety -- --check --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix "codex/,agent/" --worktree C:/wt/AGENT-WORKTREE-SAFETY-1/4veco-lessen`
- `node build-scripts/sprints/check-sprint-command-log.js AGENT-WORKTREE-SAFETY-1`
- `node build-scripts/sprints/check-lead-review-substance.js AGENT-WORKTREE-SAFETY-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/AGENT-WORKTREE-SAFETY-1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js AGENT-WORKTREE-SAFETY-1 --complete`

Environment setup note:

- First `npm.cmd run check:platform` failed because the fresh worktree had no
  `node_modules`. `npm.cmd ci` restored dependencies, and the required command
  then passed.

## Changed files

Implementation:

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-worktree-safety.js`
- `build-scripts/ci/check-agent-worktree-safety.test.js`
- `package.json`

Evidence, roadmap, and indexes:

- `reports/sprints/AGENT-WORKTREE-SAFETY-1-*`
- `references/data/sprints/AGENT-WORKTREE-SAFETY-1.*.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/url-index.md`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain unchanged. The sprint did not mutate
`source-data/`, generated Book 1 lesson output, target-exercise registries,
candidate storage, PV outputs, product route files, diagnostics, adaptive
routing, mastery/sequencing, Scale Gate 1, or student/product-use surfaces.

The new checker only mutates the per-worktree lock file in Git metadata when
`--claim` or `--release` is explicitly requested. It does not mutate tracked
lesson output, Git settings, branch protection, repository settings, or
student-facing routes.

## Open follow-ups

- Add a small `create-agent-worktree.js` helper only if it remains
  path-length-aware and does not use force worktree operations.
- Keep worktree safety as a local preflight; do not wire the lock check into
  default PR CI unless a later sprint proves a CI-safe mode.
- Agents should use short task roots when existing lesson filenames would make
  the default `C:\Projects\4veco-worktrees\...` path exceed Windows limits.

## Rollback instructions

Rollback by reverting the AGENTS policy additions, worktree-safety checker,
tests, npm script, roadmap row/status update, and sprint evidence/index
changes. No generated-output cleanup is required.

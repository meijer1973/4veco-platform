# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Validation Log

Repository state before PR publication:

- Platform base: `origin/main` at `bda34668a921243c5ab73a255d9c99efc09cc7fc`
- Lesson base: `origin/main` at `ef06e8b881f953d7fcd6a1ed26a763b2bf01a684`
- Platform branch: `codex/agents-md-entrypoint-cleanup-20260627`
- Lesson branch: `codex/agents-md-entrypoint-cleanup-20260627`

Focused validation:

- `npm.cmd run check:active-governance-wording`: PASS
- `npx.cmd jest build-scripts/review-gates/check-active-governance-wording.test.js build-scripts/sprints/check-pptx-skill-mirror.test.js --runInBand`: PASS, 9 tests
- `npm.cmd run check:pptx-skill-mirror`: PASS
- `node build-scripts/sprints/emit-url-index.js --check`: PASS
- `npm.cmd run check:pr-readiness`: PASS, 92 tests
- `npm.cmd run check:integration-lane`: PASS, 79 tests
- `npm.cmd run finalization:freshness`: PASS; remote `main` matched local
  `origin/main`
- `npm.cmd run check:agent-worktree-safety -- --check --task AGENTS-MD-ENTRYPOINT-CLEANUP-1 --agent codex --require-prefix codex/,agent/`: PASS with expected dirty worktree during implementation
- `git diff --check`: PASS in both repositories

Active-surface sweep:

- Platform active sweep found no remaining `CLAUDE.md`, `.claude/commands`, or
  `/tmp/claude-work` hits outside intentional checker fixtures, the retired
  guard script, and historical archive code.
- Lesson active sweep found no remaining `CLAUDE.md`, `.claude/commands`, or
  `/tmp/claude-work` hits.
- Remaining `C:\Projects` hits are the documented worktree-root examples in
  both `AGENTS.md` files.

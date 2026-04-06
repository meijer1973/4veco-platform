# 4veco Platform

All project documentation lives in dedicated files:

- **AGENTS.md** — Repo overview, architecture, deploy scope, model usage, skills, testing, quality standards
- **BUILD-PARAGRAPH.md** — End-to-end paragraph production guide (input contract, workflow, per-asset specs)
- **build-scripts/README.md** — Script taxonomy (generators, converters, reference implementations, utilities)
- **source-data/README.md** — Input-side conventions

Skills are in two locations (kept in sync):
- `skills/` — shared canonical location for all agents (Claude, Codex, etc.)
- `.claude/commands/` — Claude Code reads from this path automatically

Temporary files: always clean up after every task. Use `/tmp/claude-work/` for intermediate files.

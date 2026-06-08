# Sprint AGENT-WORKTREE-SAFETY-1: Diff Summary

Generated: 2026-06-07

## Implementation

- `AGENTS.md`: adds worktree-safety policy for platform agents.
- `../4veco-lessen/AGENTS.md`: adds worktree-safety policy for lesson agents
  and routes lesson checks through the coordinated platform worktree.
- `build-scripts/ci/check-agent-worktree-safety.js`: adds claim/check/release
  checker with per-worktree Git metadata locks.
- `build-scripts/ci/check-agent-worktree-safety.test.js`: adds focused Jest
  coverage for lock ownership, stale locks, missing locks, wrong tasks,
  unsafe branch states, anchor guardrails, warning-only states, and Git-dir
  lock paths.
- `package.json`: adds `check:agent-worktree-safety`.

## Evidence And Indexes

- `reports/sprints/AGENT-WORKTREE-SAFETY-1-*`: sprint plan, baseline,
  planning review, command log, lead-review cycle, result, and diff summary.
- `references/data/sprints/AGENT-WORKTREE-SAFETY-1.*.json`: plan and result
  JSON.
- `references/reference-team-roadmap.md`: records the sprint row and closure
  state.
- `reports/github-agent-index-*.md` and `reports/github-agent-index-*.json`:
  refreshed GitHub-facing repository indexes.
- `reports/url-index.md`: refreshed URL index.
- `reports/internal-dashboard/*`: refreshed internal dashboard.

## Protected surfaces

Protected surfaces remain unchanged:

- `references/machine/`
- `references/external/`
- `source-data/`
- generated Book 1 lesson output
- target-exercise registries
- candidate-storage files
- PV outputs
- product route files

## Boundaries

This diff hardens local agent workflow isolation only. It authorizes no
generated lesson output, protected reference mutation, product-route adoption,
target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, broad product use, or student use.

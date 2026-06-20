# GOAL-REASONING-GOLDEN-FAMILY-1 Baseline

Generated: 2026-06-20

## Package Source

- package: `C:\wt\SKILLTREE-20260618\reasoning-golden-family-adoption-v1-package.zip`
- extracted package:
  `C:\wt\SKILLTREE-20260618\reasoning-golden-family-adoption-v1`
- handoff read first:
  `C:\wt\SKILLTREE-20260618\reasoning-golden-family-adoption-v1\CODING-AGENT-HANDOFF.md`

Package controlling distinction:

```text
copy product grammar
re-derive reasoning grammar
```

## Initial Repository State

The work started in coordinated dedicated worktrees and branches:

- platform:
  `C:\Projects\4veco-worktrees\GOAL-REASONING-GOLDEN-FAMILY-1\4veco-platform`
- lesson:
  `C:\Projects\4veco-worktrees\GOAL-REASONING-GOLDEN-FAMILY-1\4veco-lessen`

Lesson worktree remained clean during platform implementation. Lesson
specification updates are intentionally delayed until platform proof and review
evidence exist.

## Existing Risk

The repository already had legacy reasoning-game machinery. This goal must not
add another mode-overloaded engine. Shared student actions belong in the task
shell, while paragraph-specific compositions belong in a data-driven composer.

## Planning Review Input

Initial subagent planning review highlighted these risks:

- do not treat the four prototypes as sufficient output;
- avoid a six-mode reasoning engine;
- add missing shared primitives only where the student action is genuinely
  reusable;
- require stable shuffle and local repair;
- require rendered proof, not only generated HTML;
- include blind transfer, specialist review, lead review, and final gate.

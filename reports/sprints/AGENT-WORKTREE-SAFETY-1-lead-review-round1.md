# Lead Review Summary

Sprint: `AGENT-WORKTREE-SAFETY-1`

Round: lead review round 1

## Scope

Evidence inspected:

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-worktree-safety.js`
- `build-scripts/ci/check-agent-worktree-safety.test.js`
- `package.json`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-command-log.jsonl`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-baseline.md`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Policy review | Lead reviewer | Platform and lesson AGENTS contain worktree-safety policy | pass |
| Checker review | Lead reviewer | Claim/check/release lock behavior matches plan | revise |
| Test coverage review | Lead reviewer | Required unsafe states and warning states have focused tests | revise |
| Command evidence | `reports/sprints/AGENT-WORKTREE-SAFETY-1-command-log.jsonl` | Focused Jest and worktree checks pass | pass |
| Surface-boundary review | Lead reviewer | No protected/generated surfaces changed | pass |

## Consolidated Verdict

Verdict: REVISE

The policy and baseline implementation are directionally correct, but the
checker and tests need correction before sprint closure.

## Blocking Findings

Blocking findings were present in round 1:

1. `--allow-anchor-read-only` suppresses `main` and anchor-clone failures even
   in `--claim` mode, which could allow a mutating claim on a clean anchor
   clone. This violates the plan requirement that mutating work in
   anchor/main clone fails.
2. Test coverage is missing several plan-required cases: missing lock in
   `--check`, wrong task, read-only allowance behavior, ahead/behind warnings,
   non-required dirty warning, and old same-owner lock warning.
3. Closure artifacts such as result JSON, diff summary, PR URL, tag, and
   remote CI proof are not expected yet, but they must exist before complete
   bundle closure.

## Specialist Findings

Verification subagent returned REVISE with the same checker bypass and
coverage findings. It also confirmed that the lesson diff is only `AGENTS.md`
and no protected `references/machine/`, `references/external/`, `source-data/`,
or generated Book 1 lesson output changes were found.

## Test Evidence

Command-log evidence already includes passing focused tests and real
worktree-lock checks before correction:

- `npx.cmd jest --runInBand build-scripts/ci/check-agent-worktree-safety.test.js`
- `npm.cmd run check:agent-worktree-safety -- --claim --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix "codex/,agent/"`
- `npm.cmd run check:agent-worktree-safety -- --check --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix "codex/,agent/" --worktree C:/wt/AGENT-WORKTREE-SAFETY-1/4veco-lessen`

These commands must be rerun after correction.

## Learning Quality Evidence

Not applicable as student-facing learning output is not changed. The sprint
supports the product-vision agent-scalable production-system pillar.

## Student Experience Evidence

Not applicable. No rendered student-facing route, game, task shell, lesson
output, completion language, or product-use surface changes.

## Ownership and Handoff

The main agent owns corrections to
`build-scripts/ci/check-agent-worktree-safety.js` and
`build-scripts/ci/check-agent-worktree-safety.test.js`. No handoff to lesson
content production is required.

## Required Next Action

Fix the `--allow-anchor-read-only` claim bypass, add the missing focused tests,
rerun focused worktree-safety tests and real worktree checks, then conduct
round 2 lead review before result/PR/CI closure.

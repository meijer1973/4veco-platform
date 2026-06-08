# Sprint AGENT-WORKTREE-SAFETY-1: One-Agent-One-Worktree Isolation

Generated: 2026-06-07

## Goal

Prevent local multi-agent branch contamination by making the agent isolation
unit explicit:

```text
one agent = one task branch = one dedicated worktree directory
```

This sprint hardens workflow governance and local preflight tooling only. It
does not authorize generated lesson output, protected reference mutation,
student-facing product use, target-equivalent proof, diagnostics, adaptive
routing, mastery/sequencing, summative use, PV, Scale Gate 1, or broad
product use.

## Context

`AGENT-BRANCH-SAFETY-1` added branch-per-agent policy and a local checker that
fails unsafe branch states. The newly reported failure is a different class:
several agents can share one physical working tree, and one agent switching
branches changes the working tree and index under every other agent in that
folder.

Git worktrees are the correct local isolation primitive because each worktree
has its own working tree and index. The new standard command for mutating
agent work must therefore claim a per-worktree lock before edits:

```bash
npm.cmd run check:agent-worktree-safety -- --claim --task <task-id> --agent <agent-id> --require-prefix codex/,agent/
```

The platform and lesson task worktrees for this sprint are coordinated under
`C:\wt\AGENT-WORKTREE-SAFETY-1\...`. The default
`C:\Projects\4veco-worktrees\AGENT-WORKTREE-SAFETY-1\4veco-lessen` path was
tested first but hit an existing Windows filename-length failure in the lesson
repository, so the shorter shared task root is used and recorded as evidence.

## Quality Standard

The specification quality floor is enforceable local workflow isolation:

- the platform and lesson AGENTS files must explain why branch safety is not
  enough and require one task branch in one dedicated worktree for mutating
  agent work;
- the worktree checker must write locks only in the per-worktree Git metadata
  directory returned by `git rev-parse --git-dir`, never in a tracked worktree
  path;
- the checker must fail on `main` in mutating mode, detached HEAD, divergence,
  missing lock in `--check`, another agent's lock, wrong task, anchor-clone
  mutating mode, invalid branch prefix when required, and dirty worktree when
  `--require-clean` is passed;
- the checker must warn, but not falsely fail, for ahead/behind state,
  non-required dirty state, and old locks;
- proof must include focused Jest tests, manual claim/check evidence in the
  task worktree, local validators, sprint bundle evidence, lead review, and
  remote `platform-ci / validate-platform` proof after push;
- rendered output and student-facing routes remain intentionally unchanged;
- follow-up work must name any omitted convenience helpers or CI integration
  rather than treating them as complete.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Worktree policy in platform | `AGENTS.md` contains a `Worktree safety for agents` section near branch safety | Diff review and lead review cite the section | planned |
| Worktree policy in lesson repo | `../4veco-lessen/AGENTS.md` contains the same policy plus the generated-output warning | Diff review and lead review cite the section | planned |
| Per-worktree lock design | `build-scripts/ci/check-agent-worktree-safety.js` computes lock path from `git rev-parse --git-dir` | Jest test proves lock path is Git-dir based, not repo-root based | planned |
| Ownership protection | Checker supports `--claim`, `--check`, and `--release`, and refuses another owner by default | Jest tests cover claim/check/release/same owner/different owner/stale lock behavior | planned |
| Unsafe Git state protection | Checker inspects root, Git dir, branch, HEAD SHA, status branch, main, detached, ahead/behind, divergence, dirty state, and prefixes | Jest tests and manual command output prove failures/warnings | planned |
| Anchor clone guard | Checker detects known anchor clones and fails mutating mode there unless explicit read-only allowance is used | Jest tests cover anchor mutating failure and read-only allowance behavior | planned |
| npm discoverability | `package.json` exposes `check:agent-worktree-safety` | Package diff and local command execution | planned |
| Preserve branch checker baseline | Existing `check-agent-branch-safety.js` tests still pass | Focused Jest test for the existing branch checker | planned |
| Preserve protected/generated surfaces | No generated lesson output, protected reference data, source-data, target registry, candidate storage, PV output, or product route files change | Diff hygiene, validators, result data-integrity notes | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add the worktree preflight checker and focused Jest tests. | include_now | This directly closes the local shared-folder failure mode. |
| Add `check:agent-worktree-safety` npm wrapper. | include_now | Future agents need a discoverable command. |
| Add a small `create-agent-worktree.js` helper. | defer_named_follow_up | The checker is the required safety layer; helper creation can be added later if it stays small and path-length-aware. |
| Wire worktree safety into default PR CI. | reject_scope_creep | The checker is a local agent preflight and depends on local worktree layout/locks. |
| Add generated lesson-output or rendered student proof. | reject_scope_creep | This sprint has no student-facing route or rendered output. |

## Allowed paths

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-worktree-safety.js`
- `build-scripts/ci/check-agent-worktree-safety.test.js`
- `build-scripts/ci/check-agent-branch-safety.js`
- `build-scripts/ci/check-agent-branch-safety.test.js`
- `package.json`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-*`
- `references/data/sprints/AGENT-WORKTREE-SAFETY-1.plan.json`
- `references/data/sprints/AGENT-WORKTREE-SAFETY-1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Forbidden paths

- `references/machine/`
- `references/external/`
- `source-data/`
- target-exercise registries
- candidate-storage files
- PV projection outputs
- PV machine-promotion outputs
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product route files in `../4veco-lessen/`

## Inputs

- `RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/README.md`
- `build-scripts/ci/check-agent-branch-safety.js`
- `build-scripts/ci/check-agent-branch-safety.test.js`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-result.md`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- worktree-safety policy section in both AGENTS files;
- worktree-safety checker and Jest tests;
- npm script for local/agent worktree preflight;
- sprint plan, baseline, planning review, command log, lead-review cycle,
  result, diff summary, and plan/result JSON;
- roadmap row and refreshed GitHub-facing indexes, URL index, and internal
  dashboard after roadmap/report path changes;
- pushed coordinated platform and lesson branches;
- closure tag `checkpoint/AGENT-WORKTREE-SAFETY-1`;
- PR URL(s) and remote `platform-ci / validate-platform` proof.

## Operationalized sprint procedure

1. Confirm baseline before editing: fetch both repos, verify the current
   branches are dedicated task branches, inspect maps, AGENTS files, product
   specs, prior branch-safety result, branch checker, tests, roadmap, and
   sprint validators. Stop if either repo is on `main`, diverged, dirty from
   unrelated work, or appears to share the task branch with another active
   worktree.
2. Claim the platform and lesson task worktrees by writing ownership locks in
   the per-worktree Git metadata directories. If the default worktree root
   fails because of Windows path length, use a shorter shared task root and
   record that evidence instead of forcing checkout.
3. Write this sprint plan, plan JSON, and baseline. The planning/review
   subagent checks whether the plan names generated outputs, stop conditions,
   evidence, validators, and required files before implementation proceeds.
4. Implement AGENTS policy sections, checker, tests, and npm script. Stop if
   the design writes lock files into tracked paths, requires force checkout,
   uses `git worktree add --force`, or touches generated/protected surfaces.
5. Run acceptance validators through `run-sprint-command.js`. If a validator
   fails, fix the source issue or stop with a named blocker; do not weaken the
   quality floor.
6. Complete lead-review assignment, round 1, correction log, and round 2. The
   verification subagent checks all required files and planned outputs before
   closure.
7. Refresh roadmap/index/dashboard artifacts after path and roadmap changes
   with `npm.cmd run agent:index`, `node build-scripts/sprints/emit-url-index.js`,
   and `npm.cmd run dashboard:internal`, rerun stale-index checks, fetch/prune,
   commit platform and lesson changes on coordinated branches, push both
   branches, open PR(s), create and push closure tag
   `checkpoint/AGENT-WORKTREE-SAFETY-1`, and verify remote
   `platform-ci / validate-platform` success for the platform PR before final
   reporting.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-sprint-bundle.js AGENT-WORKTREE-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npx.cmd jest --runInBand build-scripts/ci/check-agent-worktree-safety.test.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npx.cmd jest --runInBand build-scripts/ci/check-agent-branch-safety.test.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run agent:index
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run dashboard:internal
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- git -C C:/wt/AGENT-WORKTREE-SAFETY-1/4veco-lessen diff --check
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run check:agent-worktree-safety -- --claim --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix codex/,agent/
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run check:agent-worktree-safety -- --check --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix codex/,agent/
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- npm.cmd run check:agent-worktree-safety -- --check --task AGENT-WORKTREE-SAFETY-1 --agent codex-AGENT-WORKTREE-SAFETY-1-20260607 --require-prefix codex/,agent/ --worktree C:/wt/AGENT-WORKTREE-SAFETY-1/4veco-lessen
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-sprint-command-log.js AGENT-WORKTREE-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-lead-review-substance.js AGENT-WORKTREE-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/AGENT-WORKTREE-SAFETY-1-result.md
node build-scripts/sprints/run-sprint-command.js AGENT-WORKTREE-SAFETY-1 -- node build-scripts/sprints/check-sprint-bundle.js AGENT-WORKTREE-SAFETY-1 --complete
```

## Proof Required to Close

Proof to close must include review, validator, test, local worktree, and
remote GitHub evidence:

- platform AGENTS file contains worktree-safety policy;
- lesson AGENTS file contains worktree-safety policy and generated-output
  shared-worktree warning;
- `build-scripts/ci/check-agent-worktree-safety.js` exists;
- checker fails when another agent owns the worktree;
- checker fails on mutating work in anchor/main clone;
- checker uses per-worktree Git metadata for the lock file;
- tests prove lock ownership, stale lock, main branch, detached HEAD,
  divergence, dirty `--require-clean`, prefix behavior, and Git-dir lock path;
- local validators pass;
- lead-review round 1 and round 2 pass;
- both coordinated branches are pushed;
- PR URL(s) are recorded;
- closure tag `checkpoint/AGENT-WORKTREE-SAFETY-1` is created and pushed;
- remote `platform-ci / validate-platform` passes on the platform PR;
- result file states workflow-isolation hardening only and authorizes no
  product/student use.

## Rollback plan

Rollback by reverting the AGENTS policy sections, worktree-safety checker,
tests, npm script, roadmap/index/dashboard refreshes, and sprint evidence
changes. Because this sprint does not mutate generated lesson output or
protected reference data, rollback does not require generated-output cleanup.

## Human review required

No additional human review is required. This sprint implements the user's
authorized workflow-safety report and records lead review before closure.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-assignment.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-round1.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-corrections.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-round2.md`

## Stop Conditions

Stop if an agent is in a shared anchor clone and about to mutate files, another
lock already exists in either task worktree, the branch changes unexpectedly,
`git worktree list --porcelain` shows unsafe branch/path reuse, implementation
would require force checkout/switch/worktree add, tests require writing locks
into tracked paths, either local branch diverges unexpectedly, or changes touch
generated lesson output or protected reference surfaces.

## Next Authorized Work After Closure

After this sprint closes, the next safe action is to require the new worktree
preflight for future mutating agent tasks. A separate owner-authorized
follow-up is required before adding a worktree-creation helper, wiring local
worktree locks into default CI, or making any student-facing product claim.

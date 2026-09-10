# Sprint AGENT-BRANCH-SAFETY-1: Explicit Branch-Per-Agent Safety Protocol

Generated: 2026-06-07

## Goal

Harden agent workflow safety so every mutating task starts from a dedicated
task branch and local preflight catches the old failure mode of mutating
`main`.

This sprint changes repository workflow governance only. It does not authorize
generated lesson output, product readiness, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1,
student-facing use, or product-wide use.

## Context

The current CI and branch-protection baseline already nudges agents toward PR
work: `.github/workflows/platform-ci.yml` runs `platform-ci` on PRs into
`main`, the required job/context is `validate-platform`, and
`build-scripts/ci/check-branch-protection.js` validates strict required status
checks, the `validate-platform` context, admin enforcement, no force pushes,
and no branch deletion.

The remaining gap is explicit local agent behavior. `AGENTS.md` and
`../4veco-lessen/AGENTS.md` do not yet state a branch-per-agent protocol, and
there is no local preflight checker that fails when an agent is about to
mutate files on `main`.

Baseline branch-protection API evidence on 2026-06-07 confirms the required
status-check/admin/force/deletion fields. The dedicated pull-request-review
endpoint is readable and reports one required approving review. Bypass and
direct-push prevention details are not fully exposed in the currently inspected
responses, so this sprint reports that limitation instead of converting it
into a hard failure.

## Quality Standard

The specification quality floor is explicit, enforceable workflow safety:

- the platform and lesson AGENTS files must tell future agents to use a
  dedicated branch before mutating files;
- the checker must produce concise JSON proof and fail on `main`, detached
  HEAD, divergence, missing Git repository, and dirty worktrees when
  `--require-clean` is used;
- prefix enforcement must be available through `--require-prefix
  codex/,agent/`, while ordinary non-matching branches are at least reported;
- rendered output and student-facing routes remain intentionally unchanged;
- proof must include parser/checker tests, local validators, sprint bundle
  evidence, lead-review evidence, and remote `platform-ci / validate-platform`
  proof after push;
- follow-up work must name any PR-only branch-protection evidence that remains
  unverified or not enforceable by this sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Explicit branch-per-agent policy in platform | `AGENTS.md` contains the required branch-safety section | Diff review and lead review cite the section | planned |
| Explicit branch-per-agent policy in lessen | `../4veco-lessen/AGENTS.md` contains the required branch-safety section plus coordinated-branch sentence | Diff review and lead review cite the section | planned |
| Local checker fails unsafe branch states | `build-scripts/ci/check-agent-branch-safety.js` detects `main`, detached HEAD, divergence, missing repo, prefix state, and dirty state with `--require-clean` | Jest tests and manual `npm.cmd run check:agent-branch-safety -- --require-prefix codex/,agent/` | planned |
| Concise JSON summary for logs | Checker prints repository, branch, on-main, detached, dirty, ahead/behind, diverged, prefix state, warnings, and failures | Command log captures JSON output | planned |
| Preserve PR-CI compatibility | Checker is not wired into default `platform-ci` as a hard failure | Plan/result and lead review confirm local/agent preflight scope | planned |
| Report PR-review protection without overclaiming | Existing branch-protection checker reports observed pull-request-review fields when readable but does not fail on them | Branch-protection command output and result file state verified/deferred fields | planned |
| Preserve protected/generated surfaces | No lesson output, protected reference data, source-data, target registry, candidate storage, PV output, or product route changes | Diff hygiene, bundle check, and data integrity notes | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add local branch preflight checker with pure parser tests. | include_now | This directly closes the main-branch mutation failure mode. |
| Add the npm wrapper `check:agent-branch-safety`. | include_now | Future agents get a discoverable command without changing CI semantics. |
| Extend branch-protection checker to report PR-review fields. | include_now | It answers the report nuance without making unapproved settings a hard gate. |
| Wire branch-safety checker into default PR CI. | reject_scope_creep | GitHub Actions PR checkouts can use merge refs or detached HEAD, so this may create false failures. |
| Require PR-only branch protection as a failing policy. | defer_named_follow_up | The owner has not authorized making PR-only protection a hard failure in this sprint. |
| Add generated lesson-output proof. | reject_scope_creep | Workflow-safety governance has no student-facing route or rendered output. |

## Allowed paths

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-branch-safety.js`
- `build-scripts/ci/check-agent-branch-safety.test.js`
- `build-scripts/ci/check-branch-protection.js`
- `build-scripts/ci/check-branch-protection.test.js`
- `package.json`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-*`
- `references/data/sprints/AGENT-BRANCH-SAFETY-1.plan.json`
- `references/data/sprints/AGENT-BRANCH-SAFETY-1.result.json`
- `references/reference-team-roadmap.md`
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
- `.github/workflows/platform-ci.yml`
- `build-scripts/ci/check-branch-protection.js`
- `reports/sprints/CI-GOVERNANCE-1-result.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- branch-safety policy section in both AGENTS files;
- branch-safety checker and Jest tests;
- npm script for local/agent preflight;
- optional branch-protection checker report fields for PR reviews;
- sprint plan, baseline, planning review, command log, lead-review cycle,
  result, diff summary, and plan/result JSON:
  `reports/sprints/AGENT-BRANCH-SAFETY-1-planning-review.md`,
  `reports/sprints/AGENT-BRANCH-SAFETY-1-command-log.jsonl`,
  `reports/sprints/AGENT-BRANCH-SAFETY-1-command-log.md`,
  `reports/sprints/AGENT-BRANCH-SAFETY-1-result.md`,
  `reports/sprints/AGENT-BRANCH-SAFETY-1-diff-summary.md`, and
  `references/data/sprints/AGENT-BRANCH-SAFETY-1.result.json`;
- refreshed roadmap, repository indexes, URL index, and internal dashboard;
- pushed coordinated platform and lesson branches;
- PR URL(s) and remote `platform-ci / validate-platform` proof.

## Operationalized sprint procedure

1. Confirm baseline before editing: fetch both repos, verify the current
   branches are dedicated task branches, inspect required maps, AGENTS files,
   CI workflow, branch-protection checker, CI-GOVERNANCE-1 evidence, product
   specs, and the active roadmap. Stop if already-mutated files are found on
   `main` or if either repo is unexpectedly diverged.
2. Write this sprint plan, plan JSON, and baseline. The planning/review
   subagent checks whether the plan names generated outputs, stop conditions,
   evidence, and validator expectations before implementation proceeds.
3. Implement the AGENTS policy sections and the branch-safety checker/tests.
   Extend the existing branch-protection checker only to report PR-review
   fields, not to fail on them. Stop if the checker design would create
   default PR-CI false failures.
4. Run acceptance validators through `run-sprint-command.js`. If a validator
   fails, fix the source issue or stop with a blocker; do not weaken the
   quality floor.
5. Run repository map/dashboard refresh commands after path/report/roadmap
   changes, then rerun URL-index and scope validators.
6. Complete lead-review assignment, round 1, correction log, and round 2.
   The verification subagent checks required files and planned outputs before
   closure.
7. Fetch/prune, commit platform and lessen changes on coordinated branches,
   push both branches, open PR(s), and verify remote `platform-ci /
   validate-platform` success for the platform PR before final reporting.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-sprint-bundle.js AGENT-BRANCH-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- npx.cmd jest --runInBand build-scripts/ci/check-agent-branch-safety.test.js
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-sprint-command-log.js AGENT-BRANCH-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-lead-review-substance.js AGENT-BRANCH-SAFETY-1
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/AGENT-BRANCH-SAFETY-1-result.md
node build-scripts/sprints/run-sprint-command.js AGENT-BRANCH-SAFETY-1 -- node build-scripts/sprints/check-sprint-bundle.js AGENT-BRANCH-SAFETY-1 --complete
```

Manual pre-commit command:

```bash
npm.cmd run check:agent-branch-safety -- --require-prefix codex/,agent/
```

## Proof Required to Close

Proof to close must include review, validator, test, and remote GitHub
evidence:

- `AGENTS.md` in platform has explicit branch-per-agent policy;
- `../4veco-lessen/AGENTS.md` has explicit branch-per-agent policy and
  coordinated-branch requirement;
- `build-scripts/ci/check-agent-branch-safety.js` exists and fails on `main`;
- Jest tests prove `main`, detached HEAD, missing prefix enforcement,
  divergence, `--require-clean` dirty state, and missing repository behavior;
- local platform validators pass;
- lead-review round 1 and round 2 pass;
- both coordinated branches are pushed;
- PR URL(s) are recorded;
- remote `platform-ci / validate-platform` passes on the platform PR;
- result file states workflow-safety hardening only and authorizes no
  product/student use.

## Rollback plan

Rollback by reverting the AGENTS policy sections, branch-safety checker, tests,
npm script, optional branch-protection report-only fields, and sprint evidence
changes. Because this sprint is read-only with respect to GitHub settings and
does not mutate generated lesson output, rollback does not require
generated-output cleanup.

## Human review required

No additional human review is required. This sprint implements the user's
authorized workflow-safety report.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/AGENT-BRANCH-SAFETY-1-lead-review-assignment.md`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-lead-review-round1.md`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-lead-review-corrections.md`
- `reports/sprints/AGENT-BRANCH-SAFETY-1-lead-review-round2.md`

## Stop Conditions

Stop if an agent is on `main` and has already modified files, either local
branch is diverged from origin, another agent appears to be using the same
branch or sprint surface, branch-protection settings are weaker than the
required baseline, the checker would create false failures in default GitHub
Actions PR checkouts, or changes touch generated lesson output or protected
reference surfaces.

## Next Authorized Work After Closure

After this sprint closes, the next safe action is to enforce use of the new
local preflight in future mutating agent tasks. A separate owner-authorized
follow-up is required before making PR-only branch-protection a hard failing
checker requirement or wiring branch-safety into default CI.

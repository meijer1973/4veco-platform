# Sprint CI-REMOTE-1: GitHub Actions Remote Platform CI

Generated: 2026-06-04

## Goal

Add GitHub Actions remote validation for `4veco-platform` so every push and
pull request to `main` receives a GitHub status check that can be required by
branch protection.

This sprint closes the current remote-evidence gap before
`GATE-SHARED-TASK-INGEST-REPAIR-1`. It is CI/protocol infrastructure only. It
does not change generated lesson output, protected references, source data,
target registries, candidate storage, PV outputs, product routes, diagnostics,
adaptive routing, mastery/sequencing, Scale Gate 1, or student/product use.

## Context

The current repair-track evidence has strong local command logs but no remote
GitHub Actions run attached to the latest repair commit. The next human review
gate needs a remote validation surface that off-site reviewers can inspect on
GitHub.

The required repository layout is a sibling checkout:

```text
<workspace>/
  4veco-platform/
  4veco-lessen/
```

Several platform validators expect `../4veco-lessen` to exist, so the workflow
must not check out only the platform repository. Local unauthenticated
`git ls-remote` confirmed `meijer1973/4veco-lessen` can be read without a
secret, so the first workflow omits `LESSEN_REPO_READ_TOKEN`. If GitHub
Actions reports a private-repo checkout failure, the stop condition is to add
a read-only repository secret, not to weaken the checkout requirement.

Action tag checks before implementation confirmed:

- `actions/checkout@v6` exists.
- `actions/setup-node@v4` exists.
- `actions/setup-python@v6` exists.
- `actions/upload-artifact@v7` exists.

## Quality Standard

The quality floor is specification-accurate remote proof: the workflow file is
present in `.github/workflows`, checks out both repositories in the required
sibling layout, installs with `npm ci`, runs the existing platform validation
scripts, uploads bounded diagnostics, and produces a successful GitHub status
check named `platform-ci / validate-platform`.

Passing local tests is not enough. The sprint must prove remote execution on
GitHub, record the run URL, run ID, commit SHA, conclusion, and artifact
status, and make that evidence available to reviewers. Rendered output and
student-facing lesson output must remain unchanged. Any missing branch
protection or remote-run evidence is named as a blocker or follow-up before
closure.

The review gate is structural lead review with command-log evidence and remote
GitHub run evidence. Human review is not required for this CI infrastructure
sprint, but the downstream human gate remains blocked until this sprint closes
or receives an explicit waiver.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Workflow lives in the GitHub-required workflow location | `.github/workflows/platform-ci.yml` | Lead review inspects the workflow path and syntax | planned |
| Workflow triggers on push, pull request, and manual dispatch | `on: push`, `pull_request`, and `workflow_dispatch` in the workflow | Remote run starts after push and can be manually run | planned |
| Platform and lessen repositories are checked out as siblings | Two `actions/checkout@v6` steps with paths `4veco-platform` and `4veco-lessen` | Remote log and workflow file show sibling layout | planned |
| Node dependencies install reproducibly | `npm ci` in `4veco-platform` | Remote run succeeds without local node modules | planned |
| Existing platform scripts are used | CI runs `npm run check:platform`, `npm run check:scope-language`, report JSON, roadmap index, URL index, and diff hygiene checks | Local command log and remote run success | planned |
| Token permissions are minimal | `permissions: contents: read`, `persist-credentials: false`, no write token | Lead review confirms no unnecessary write permission or printed secret | planned |
| Diagnostics are bounded | `actions/upload-artifact@v7` uploads command logs, report JSON, and URL index only | Remote run artifact status recorded | planned |
| Sprint closure records remote proof | Result markdown/JSON record workflow name, job name, run URL, run ID, commit SHA, conclusion, and artifact status | Lead review and result checker pass | planned |
| Branch protection can require the check | Branch protection/ruleset configured after first successful run where permissions allow | Final report records required status check name and branch-protection status | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Remove the lessen checkout because current local tests can pass without it. | reject_scope_creep | The specification requires sibling checkout because some validators rely on `../4veco-lessen`. |
| Add screenshot-heavy proof to default push CI. | defer_named_follow_up | The attachment names this as a later optional manual workflow; default CI should stay bounded and reliable. |
| Omit the token line for `4veco-lessen`. | include_now | Unauthenticated `git ls-remote` proved the repo is readable; no secret should be required or referenced unless checkout fails remotely. |
| Use `npm install` instead of `npm ci`. | reject_scope_creep | The package lock exists and the specification requires reproducible install through `npm ci`. |
| Upload the whole reports tree. | reject_scope_creep | Bounded diagnostics are enough and avoid noisy artifact retention. |
| Configure branch protection after the first successful run. | include_now | The check must exist before it can be selected as a required check. |

## Allowed paths

Allowed implementation paths:

- `.github/workflows/platform-ci.yml`
- `.github/ci-python-requirements.txt`

Allowed sprint evidence paths:

- `reports/sprints/CI-REMOTE-1-plan.md`
- `reports/sprints/CI-REMOTE-1-baseline.md`
- `reports/sprints/CI-REMOTE-1-planning-review.md`
- `reports/sprints/CI-REMOTE-1-command-log.jsonl`
- `reports/sprints/CI-REMOTE-1-command-log.md`
- `reports/sprints/CI-REMOTE-1-lead-review-assignment.md`
- `reports/sprints/CI-REMOTE-1-lead-review-round1.md`
- `reports/sprints/CI-REMOTE-1-lead-review-corrections.md`
- `reports/sprints/CI-REMOTE-1-lead-review-round2.md`
- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1.plan.json`
- `references/data/sprints/CI-REMOTE-1.result.json`

Allowed roadmap/index paths:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/`
- target-exercise registries
- candidate-storage files
- PV projection outputs
- PV machine-promotion outputs
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product route files in `../4veco-lessen/`

No protected reference data mutation, generated lesson output mutation,
source-data mutation, product-route adoption, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV, Scale Gate 1, or student/product use is authorized.

## Inputs

Required inputs already read or inspected:

- `../CLAUDE.md`
- `AGENTS.md`
- `RESEARCH_AGENT_MAP.md`
- `build-scripts/README.md`
- `package.json`
- `package-lock.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `build-scripts/sprints/check-sprint-result.js`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/references/check-roadmap-version-index.js`
- `build-scripts/sprints/emit-url-index.js`

## Outputs

Required generated output statement:

- no student-facing or generated lesson output is generated or changed by this
  sprint.

Required outputs:

- GitHub Actions workflow at `.github/workflows/platform-ci.yml`;
- CI Python requirements manifest at `.github/ci-python-requirements.txt`
  for `setup-python` pip-cache hashing;
- active sprint plan, baseline, planning review, command log, lead-review
  cycle, result, diff summary, and plan/result JSON;
- platform and lesson roadmap updates inserting and then closing
  `CI-REMOTE-1` before `GATE-SHARED-TASK-INGEST-REPAIR-1`;
- refreshed URL index, GitHub-facing agent indexes, and internal dashboard;
- successful remote GitHub Actions run evidence;
- branch protection or ruleset configuration for required check
  `platform-ci / validate-platform`, or a precise blocker if repository
  permissions prevent configuration.

## Operationalized sprint procedure

1. Add the sprint plan, baseline, planning review, plan JSON, roadmap row, and
   workflow file. Stop if the plan or active bundle checker fails.
2. Run local acceptance commands through `run-sprint-command.js`: plan check,
   bundle check, platform Jest, scope-language, report JSON, roadmap version
   index, URL index check, and diff hygiene for platform and lessen.
3. Commit and push the workflow-introduction commit after `git fetch --prune
   origin` confirms the branch is not behind or diverged.
4. Watch GitHub Actions for `platform-ci`. Stop if the run does not start, the
   lessen checkout fails, `npm ci` fails, any validator fails, artifacts cannot
   be uploaded, or the run has no URL.
5. If the run fails, diagnose from GitHub logs, apply the smallest scoped
   correction, rerun local checks, commit, push, and repeat until the remote
   run passes.
6. Record the successful remote run URL, run ID, commit SHA, conclusion, and
   artifact status in sprint result files.
7. Run structural lead review round 1, record corrections, and run round 2.
   Stop if round 2 is not PASS or PASS WITH FLAGS with non-blocking flags.
8. Refresh repository maps/indexes and dashboard through existing scripts only.
9. Run final result, lead-review, complete bundle, URL-index, platform diff,
   and lessen diff checks through the command wrapper.
10. Commit and push closure evidence. Confirm a latest remote run exists for
    the closure commit in the final response.
11. Configure branch protection or a ruleset for `main` after the status check
    exists. Stop and report the exact permission or API blocker if GitHub
    rejects the configuration.

## Acceptance tests

Local checks through the command-log wrapper:

```bash
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-REMOTE-1-plan.md
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-REMOTE-1
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

Remote proof checks to record after push:

```bash
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- gh run list --repo meijer1973/4veco-platform --workflow platform-ci --limit 1
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- gh run view <run-id> --repo meijer1973/4veco-platform --json databaseId,workflowName,displayTitle,headSha,status,conclusion,url,jobs
```

Closure checks after the result file exists:

```bash
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/check-lead-review-substance.js CI-REMOTE-1
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-REMOTE-1-result.md
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-REMOTE-1 --complete
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- npm.cmd run agent:index
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- npm.cmd run dashboard:internal
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include review, validator, local test, and remote
GitHub evidence:

- `.github/workflows/platform-ci.yml` exists with push, pull request, and
  manual triggers;
- the workflow checks out `4veco-platform` and `4veco-lessen` as siblings;
- the workflow uses `npm ci` and the existing package scripts;
- no write permissions or broad tokens are granted;
- local sprint checks pass through the command wrapper;
- GitHub Actions starts on the pushed commit;
- the remote run reaches success, or any failure is diagnosed and fixed before
  closure;
- result markdown/JSON record workflow name, job name, run URL, run ID, commit
  SHA, conclusion, and artifact status;
- lead-review assignment, round 1, correction log, and round 2 exist and pass;
- branch protection/ruleset configuration is applied after the status check
  exists, or the exact blocker is recorded;
- protected references and generated lesson output remain unchanged;
- closure evidence is committed and pushed.

## Rollback plan

Rollback by reverting the `CI-REMOTE-1` commits. If branch protection was
configured, remove the `platform-ci / validate-platform` requirement before or
immediately after the revert if the workflow itself is removed. Because this
sprint does not mutate protected references, source data, target registries,
generated lesson output, candidate storage, PV outputs, or product routes, no
lesson-output cleanup is required.

## Human review required

No human review is required for this CI infrastructure sprint.

Human review remains required for `GATE-SHARED-TASK-INGEST-REPAIR-1`, and
that gate must not start or close until this CI sprint is closed or explicitly
waived with consequences recorded.

## Lead Review Required

Lead review is required before sprint closure.

Lead review artifacts:

- `reports/sprints/CI-REMOTE-1-lead-review-assignment.md`
- `reports/sprints/CI-REMOTE-1-lead-review-round1.md`
- `reports/sprints/CI-REMOTE-1-lead-review-corrections.md`
- `reports/sprints/CI-REMOTE-1-lead-review-round2.md`

Round 1 must inspect the workflow, package scripts, local command log, remote
GitHub run evidence, sprint result, roadmap updates, and protected-surface
boundaries.

Round 2 must recheck corrections and final closure evidence.

## Stop Conditions

Stop and report instead of closing if:

- `.github/workflows/platform-ci.yml` does not trigger remotely;
- `4veco-lessen` cannot be checked out;
- the workflow needs `LESSEN_REPO_READ_TOKEN` and the secret is not configured;
- `npm ci` fails;
- `npm run check:platform` fails;
- report JSON validation fails;
- URL index check fails;
- any generated lesson output changes;
- the workflow requires write permissions without explicit justification;
- no GitHub Actions run URL exists for the pushed commit;
- branch protection cannot see or require `platform-ci / validate-platform`;
- lead review returns unresolved blockers.

## Next Authorized Work After Closure

If `CI-REMOTE-1` closes PASS or PASS WITH FLAGS, the next authorized sprint is
`GATE-SHARED-TASK-INGEST-REPAIR-1` human gate preparation. If remote CI or
branch protection remains blocked, pause before the human gate or obtain an
explicit waiver with consequences recorded.

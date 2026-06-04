# Sprint CI-REMOTE-1: Result

Generated: 2026-06-04

## Plan reference

Plan: `reports/sprints/CI-REMOTE-1-plan.md`

Plan JSON: `references/data/sprints/CI-REMOTE-1.plan.json`

## Summary

Closed the remote CI setup sprint with PASS WITH FLAGS.

Implemented:

- `.github/workflows/platform-ci.yml`, workflow `platform-ci`, job
  `validate-platform`;
- `.github/ci-python-requirements.txt` for stable `setup-python` pip-cache
  hashing;
- sibling checkout of `4veco-platform` and `4veco-lessen`;
- read-only workflow permissions and non-persisted checkout credentials;
- remote Windows validation for `npm ci`, `check:platform`,
  `check:scope-language`, report JSON, roadmap version index, URL-index
  freshness, and platform/lessen diff hygiene;
- bounded artifact upload as `platform-ci-diagnostics`;
- branch protection on `main` requiring status-check context
  `validate-platform` with strict branch freshness, force pushes disabled, and
  branch deletion disabled.

Remote proof:

- workflow name: `platform-ci`
- job name: `validate-platform`
- run URL: `https://github.com/meijer1973/4veco-platform/actions/runs/26953558150`
- run ID: `26953558150`
- job ID: `79524686512`
- commit SHA: `c70cf1cf9320a5de9f8a2f4e490b934ae822246b`
- conclusion: `success`
- artifacts uploaded: yes, `platform-ci-diagnostics`, artifact id `7412205668`

Two remote failures were diagnosed and fixed before closure:

- run `26952992061` failed because `setup-python@v6` pip caching needed a
  dependency file;
- run `26953117464` failed because Windows checkout line endings made the
  byte-exact URL-index check fail.

No generated lesson output, source-data, protected references, target
registries, candidate storage, PV outputs, or student product routes were
changed.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-REMOTE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CI-REMOTE-1`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`
- `node build-scripts/sprints/check-sprint-command-log.js CI-REMOTE-1`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `gh run list --repo meijer1973/4veco-platform --workflow platform-ci --limit 3`
- `gh run view 26953558150 --repo meijer1973/4veco-platform --json "databaseId,workflowName,displayTitle,headSha,status,conclusion,url,jobs"`
- `gh api repos/meijer1973/4veco-platform/actions/runs/26953558150/artifacts`
- `gh api repos/meijer1973/4veco-platform/branches/main/protection`

Remote GitHub Actions:

- `platform-ci / validate-platform` passed on commit
  `c70cf1cf9320a5de9f8a2f4e490b934ae822246b`.

## Changed files

Implementation:

- `.github/workflows/platform-ci.yml`
- `.github/ci-python-requirements.txt`

Sprint evidence and metadata:

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

Roadmap and indexes:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Data integrity notes

No protected reference data changed. The sprint did not mutate:

- `references/machine/`
- `references/external/`
- `source-data/`
- generated Book 1 lesson output
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs
- product route files in `../4veco-lessen/`

`references/data/sprints/CI-REMOTE-1.plan.json` and
`references/data/sprints/CI-REMOTE-1.result.json` are sprint metadata, not
protected reference data.

## Open follow-ups

- `CI-RUNNER-LABEL-1`: monitor GitHub's `windows-latest` runner-label
  migration notice if CI later fails without code changes. Current run
  `26953558150` passes.
- Direct pushes by the repository owner can bypass branch protection, as shown
  during the closure maintenance push. Pull request merges now have the
  required `validate-platform` check available.
- The optional screenshot-heavy manual workflow remains deferred.

## Rollback instructions

Rollback by reverting the `CI-REMOTE-1` platform commits and removing the
`validate-platform` required status-check context from branch protection if
the workflow is removed. Revert the lesson roadmap commit `c83ecd4` if the
cross-repo roadmap row also needs to be removed.

Because this sprint does not change protected references, source exercise
data, generated lesson output, target registries, candidate storage, PV
outputs, or product routes, rollback does not require generated-output cleanup.

# Sprint CI-REMOTE-1A: Result

Generated: 2026-06-04

## Plan reference

Plan: `reports/sprints/CI-REMOTE-1A-plan.md`

Plan JSON: `references/data/sprints/CI-REMOTE-1A.plan.json`

## Summary

Closed the reviewer follow-up for remote CI proof and branch-protection
enforcement.

Implemented:

- recorded current-head remote proof for `platform-ci / validate-platform` on
  commit `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`;
- recorded artifact `platform-ci-diagnostics`, id `7412612729`;
- enabled branch protection admin enforcement for `main`;
- corrected workflow permissions to keep repository contents read-only while
  granting `artifact-metadata: write` for diagnostic artifact upload in PR
  runs;
- updated `CI-REMOTE-1` result markdown/JSON so the original CI sprint points
  to current-head proof and no longer carries owner-bypass as an open
  follow-up.

Remote proof:

- workflow name: `platform-ci`
- job name: `validate-platform`
- run URL: `https://github.com/meijer1973/4veco-platform/actions/runs/26954512486`
- run ID: `26954512486`
- job ID: `79528031593`
- commit SHA: `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`
- conclusion: `success`
- artifact: `platform-ci-diagnostics`
- artifact ID: `7412612729`

Branch protection proof:

- branch: `main`
- required context: `validate-platform`
- strict: `true`
- enforce admins: `true`
- allow force pushes: `false`
- allow deletions: `false`

No generated lesson output, source-data, protected references, target
registries, candidate storage, PV outputs, or student product routes were
changed.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `gh run view 26954512486 --repo meijer1973/4veco-platform --json databaseId,workflowName,displayTitle,headSha,status,conclusion,url,jobs`
- `gh api repos/meijer1973/4veco-platform/actions/runs/26954512486/artifacts`
- `gh api repos/meijer1973/4veco-platform/branches/main/protection --jq "{strict:.required_status_checks.strict,contexts:.required_status_checks.contexts,enforce_admins:.enforce_admins.enabled,allow_force_pushes:.allow_force_pushes.enabled,allow_deletions:.allow_deletions.enabled}"`
- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-REMOTE-1A-plan.md`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-REMOTE-1A-result.md`
- `node build-scripts/sprints/check-lead-review-substance.js CI-REMOTE-1A`
- `node build-scripts/sprints/check-sprint-bundle.js CI-REMOTE-1A --complete`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `git diff --check`

## Changed files

Sprint evidence and metadata:

- `BATCH-CLOSURE-WAIVER.md`
- `reports/sprints/CI-REMOTE-1A-plan.md`
- `reports/sprints/CI-REMOTE-1A-baseline.md`
- `reports/sprints/CI-REMOTE-1A-command-log.jsonl`
- `reports/sprints/CI-REMOTE-1A-command-log.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-assignment.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-round1.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-corrections.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-round2.md`
- `reports/sprints/CI-REMOTE-1A-result.md`
- `reports/sprints/CI-REMOTE-1A-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1A.plan.json`
- `references/data/sprints/CI-REMOTE-1A.result.json`

Updated prior sprint evidence:

- `.github/workflows/platform-ci.yml`
- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1.result.json`

Roadmap and indexes:

- `references/reference-team-roadmap.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain unchanged. The sprint did not mutate source-data,
generated Book 1 lesson output, target-exercise registries, candidate storage,
PV outputs, or product routes.

`references/data/sprints/CI-REMOTE-1A.plan.json` and
`references/data/sprints/CI-REMOTE-1A.result.json` are sprint metadata, not
protected reference data.

## Open follow-ups

- Future human gate packets must cite a passing `platform-ci / validate-platform`
  run for the reviewed remote commit, or explicitly record a CI waiver.
- `CI-RUNNER-LABEL-1` remains a non-blocking maintenance watch item from
  `CI-REMOTE-1`.

## Rollback instructions

Rollback by reverting the `CI-REMOTE-1A` evidence commit and disabling admin
enforcement only if the repository owner explicitly decides owner/admin bypass
is required again. Because this sprint does not change protected references,
source exercise data, generated lesson output, target registries, candidate
storage, PV outputs, or product routes, rollback does not require generated
output cleanup.

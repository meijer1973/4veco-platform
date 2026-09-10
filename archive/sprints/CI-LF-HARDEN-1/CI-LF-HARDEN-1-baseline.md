# Sprint CI-LF-HARDEN-1: Baseline

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-LF-HARDEN-1-plan.md`

## Baseline state

- `.gitattributes` currently pins only `reports/url-index.md`.
- `platform-ci` runs on Windows and currently uses `core.autocrlf false`,
  `git reset --hard`, and a single explicit checkout-index normalization for
  `reports/url-index.md`.
- Existing command logs show recurring CRLF warnings during `git diff --check`.

## Current CRLF warning inventory

Observed warning paths in `reports/sprints/CI-REMOTE-1-command-log.md` and
`reports/sprints/CI-REMOTE-1A-command-log.md` include:

- `.github/workflows/platform-ci.yml`
- `references/data/sprints/CI-REMOTE-1.result.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/internal-dashboard/dashboard-data.json`
- `reports/internal-dashboard/index.html`
- `reports/sprints/CI-REMOTE-1-command-log.jsonl`
- `reports/sprints/CI-REMOTE-1-command-log.md`
- `reports/sprints/CI-REMOTE-1-plan.md`
- `reports/sprints/CI-REMOTE-1-baseline.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `reports/sprints/CI-REMOTE-1-lead-review-corrections.md`
- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1A-command-log.jsonl`
- `reports/sprints/CI-REMOTE-1A-command-log.md`

## Data integrity notes

No protected reference data is in scope. `references/machine/` and
`references/external/` remain unchanged. No generated lesson output,
source-data, target registries, candidate storage, PV outputs, or product
route files are in scope.

## Stop conditions

Stop if policy broadens beyond CI evidence/report surfaces, if generated
lesson output becomes touched, or if `git diff --check` begins reporting
new unrelated warnings.

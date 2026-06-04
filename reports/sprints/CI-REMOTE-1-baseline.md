# Sprint CI-REMOTE-1: Baseline

Sprint: `CI-REMOTE-1`
Date: 2026-06-04

## Plan reference

Plan: `reports/sprints/CI-REMOTE-1-plan.md`

## Current State

The platform repository has no existing workflow under `.github/workflows`.
`gh workflow list --repo meijer1973/4veco-platform` returned no workflows.

The current branch is `main` tracking `origin/main`, and the platform and
lessen worktrees were clean before edits:

- `4veco-platform`: `## main...origin/main`
- `4veco-lessen`: `## main...origin/main`

## Required CI Inputs

`package.json` defines the existing scripts that must be reused:

- `npm run check:platform`
- `npm run check:scope-language`
- `npm run agent:index`
- `npm run dashboard:internal`

Additional validators required by the specification already exist:

- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`

`package-lock.json` exists, so CI must use `npm ci`.

## Cross-Repository Baseline

The CI layout must check out both repositories:

```text
<workspace>/
  4veco-platform/
  4veco-lessen/
```

Local unauthenticated access check:

- `git -c credential.helper= -c credential.useHttpPath=true ls-remote --exit-code https://github.com/meijer1973/4veco-lessen.git HEAD` succeeded.

Therefore no `LESSEN_REPO_READ_TOKEN` is needed in the initial workflow. If the
remote runner cannot access the repo, the correction is a read-only secret, not
removal of the sibling checkout.

## Action Version Baseline

The specified action tags exist:

- `actions/checkout@v6`
- `actions/setup-node@v4`
- `actions/setup-python@v6`
- `actions/upload-artifact@v7`

## Remote Evidence Gap

There is no GitHub Actions run yet for this repository because no workflow is
present. A workflow file alone is not proof; closure requires a successful
remote run URL and run ID tied to a pushed commit.

## Data integrity notes

Protected reference data is out of scope and unchanged at baseline:

- `references/machine/`: read-only
- `references/external/`: read-only
- `source-data/`: read-only
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`: read-only

This sprint may write only CI infrastructure, sprint evidence, roadmap rows,
and generated repository maps/indexes produced by existing scripts.

## Known Risks

- Branch protection can only require the status check after GitHub has seen the
  first workflow run.
- The first push may need a correction if GitHub runner behavior differs from
  local Windows behavior.
- If branch-protection API permissions are insufficient, the sprint must record
  the blocker and leave the operational next action explicit.

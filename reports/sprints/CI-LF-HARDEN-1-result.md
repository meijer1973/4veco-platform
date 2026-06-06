# Sprint CI-LF-HARDEN-1: Result

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-LF-HARDEN-1-plan.md`

Plan JSON: `references/data/sprints/CI-LF-HARDEN-1.plan.json`

## Summary

Implemented scoped line-ending hardening for active CI evidence and generated
index/dashboard surfaces.

Implemented:

- expanded `.gitattributes` narrowly for CI workflow text, active roadmap,
  generated indexes/dashboard, current CI sprint evidence, batch waiver,
  package metadata, and the new CI helper scripts;
- added `build-scripts/ci/check-evidence-line-endings.js`;
- added Jest coverage for LF/CRLF/binary behavior;
- wired the checker into `platform-ci` before diff hygiene;
- normalized only the targeted active evidence/index files.

The first broad checker attempt found 265 historical CRLF matches. The sprint
therefore followed the stop condition and narrowed scope rather than
renormalizing the historical report archive.

Remote `platform-ci / validate-platform` proof is pending until the branch is
pushed. This result will be updated or supplemented with the remote run proof
after GitHub Actions completes.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-LF-HARDEN-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `npx.cmd jest --runInBand build-scripts/ci/check-evidence-line-endings.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`
- `node build-scripts/sprints/check-sprint-command-log.js CI-LF-HARDEN-1`

## Changed files

Implementation:

- `.gitattributes`
- `.github/workflows/platform-ci.yml`
- `build-scripts/ci/check-evidence-line-endings.js`
- `build-scripts/ci/check-evidence-line-endings.test.js`

Evidence, roadmap, and indexes:

- `reports/sprints/CI-LF-HARDEN-1-*`
- `references/data/sprints/CI-LF-HARDEN-1.*.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`
- `BATCH-CLOSURE-WAIVER.md`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain unchanged. The sprint did not mutate
`source-data/`, generated Book 1 lesson output, target-exercise registries,
candidate storage, PV outputs, or product routes.

`references/data/sprints/CI-LF-HARDEN-1.plan.json` and
`references/data/sprints/CI-LF-HARDEN-1.result.json` are sprint metadata, not
protected reference data.

## Open follow-ups

- Historical report archive CRLF cleanup remains deferred because the first
  broad scan exposed large unrelated churn.
- Remote CI proof and command-log warning comparison must be recorded after
  the pushed branch run completes.

## Rollback instructions

Rollback by reverting the `.gitattributes`, checker, workflow, and sprint
evidence changes. No generated-output cleanup is required because no generated
lesson output changed.

# Sprint CI-GOVERNANCE-1: Result

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-GOVERNANCE-1-plan.md`

Plan JSON: `references/data/sprints/CI-GOVERNANCE-1.plan.json`

## Summary

Implemented a local/manual branch-protection drift checker.

Implemented:

- added `build-scripts/ci/check-branch-protection.js`;
- added mocked-response Jest tests for weaker branch-protection states;
- added `npm.cmd run check:branch-protection`;
- extended scoped LF policy/checker coverage to `CI-GOVERNANCE-1` evidence.

Live branch-protection proof for `meijer1973/4veco-platform` branch `main`:

- `required_status_checks.strict`: `true`
- required context includes `validate-platform`
- `enforce_admins.enabled`: `true`
- `allow_force_pushes.enabled`: `false`
- `allow_deletions.enabled`: `false`

Enforcement state:

- automated in default CI: no
- manual/local checker: yes
- reason: default CI does not need high-privilege branch-protection read
  permissions for this sprint; local authenticated `gh` proof is sufficient.

Remote `platform-ci / validate-platform` proof is pending until the branch is
pushed.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-GOVERNANCE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CI-GOVERNANCE-1`
- `node build-scripts/ci/check-branch-protection.js --repo meijer1973/4veco-platform --branch main`
- `npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main`
- `npx.cmd jest --runInBand build-scripts/ci/check-branch-protection.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`
- `node build-scripts/sprints/check-sprint-command-log.js CI-GOVERNANCE-1`

## Changed files

Implementation:

- `.gitattributes`
- `build-scripts/ci/check-evidence-line-endings.js`
- `build-scripts/ci/check-branch-protection.js`
- `build-scripts/ci/check-branch-protection.test.js`
- `package.json`

Evidence, roadmap, and indexes:

- `reports/sprints/CI-GOVERNANCE-1-*`
- `references/data/sprints/CI-GOVERNANCE-1.*.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain unchanged. The sprint did not mutate
`source-data/`, generated Book 1 lesson output, target-exercise registries,
candidate storage, PV outputs, or product routes.

The checker is read-only. It does not mutate GitHub branch-protection settings.

## Open follow-ups

- Optional workflow-dispatch automation remains deferred until token
  permissions are explicitly reviewed.
- `CI-PR-PROOF-1` remains available as the protected-branch PR-path proof
  sprint if the owner wants that confidence record.

## Rollback instructions

Rollback by reverting the branch-protection checker, tests, npm script,
`.gitattributes`/LF-checker pattern additions, and sprint evidence changes. No
generated-output cleanup is required.

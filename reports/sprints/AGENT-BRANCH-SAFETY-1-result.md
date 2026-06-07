# Sprint AGENT-BRANCH-SAFETY-1: Result

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md`

Plan JSON: `references/data/sprints/AGENT-BRANCH-SAFETY-1.plan.json`

## Summary

Implemented explicit branch-per-agent workflow safety.

Implemented:

- added branch-safety policy to `AGENTS.md`;
- added branch-safety policy and coordinated-branch requirement to
  `../4veco-lessen/AGENTS.md`;
- added `build-scripts/ci/check-agent-branch-safety.js`;
- added `build-scripts/ci/check-agent-branch-safety.test.js`;
- added `npm.cmd run check:agent-branch-safety`;
- extended `build-scripts/ci/check-branch-protection.js` to report
  pull-request-review settings when observable without making them a hard
  failure;
- added sprint plan, baseline, planning review, lead-review cycle, command
  logs, result JSON, and diff summary.

Branch-protection observation:

- `required_status_checks.strict`: `true`
- required context includes `validate-platform`
- `enforce_admins.enabled`: `true`
- `allow_force_pushes.enabled`: `false`
- `allow_deletions.enabled`: `false`
- required pull-request reviews: observed via dedicated endpoint
- required approving review count: `1`
- bypass allowance/no-direct-push details: not fully exposed in inspected
  response; strict PR-only/no-direct-push proof remains deferred

Remote proof:

- platform branch: `codex/agent-branch-safety-20260607`
- lessen branch: `codex/agent-branch-safety-20260607`
- platform PR: `https://github.com/meijer1973/4veco-platform/pull/12`
- lessen PR: `https://github.com/meijer1973/4veco-lessen/pull/1`
- workflow name: `platform-ci`
- job name: `validate-platform`
- run URL: `https://github.com/meijer1973/4veco-platform/actions/runs/27088256297`
- run ID: `27088256297`
- job ID: `79946854708`
- branch head SHA: `b55087783af6ff989a851f9269fa60cf10da9505`
- conclusion: `success`
- artifact: `platform-ci-diagnostics`
- artifact ID: `7462682610`

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js AGENT-BRANCH-SAFETY-1`
- `npx.cmd jest --runInBand build-scripts/ci/check-agent-branch-safety.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`
- `npm.cmd run check:agent-branch-safety -- --require-prefix "codex/,agent/"`
- `npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-sprint-command-log.js AGENT-BRANCH-SAFETY-1`
- `node build-scripts/sprints/check-lead-review-substance.js AGENT-BRANCH-SAFETY-1`

## Changed files

Implementation:

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-branch-safety.js`
- `build-scripts/ci/check-agent-branch-safety.test.js`
- `build-scripts/ci/check-branch-protection.js`
- `build-scripts/ci/check-branch-protection.test.js`
- `package.json`

Evidence, roadmap, and indexes:

- `reports/sprints/AGENT-BRANCH-SAFETY-1-*`
- `references/data/sprints/AGENT-BRANCH-SAFETY-1.*.json`
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
candidate storage, PV outputs, product route files, diagnostics, adaptive
routing, mastery/sequencing, Scale Gate 1, or student/product-use surfaces.

The new checker is read-only. It does not mutate Git settings, branch
protection, repository settings, or lesson output.

## Open follow-ups

- Strict PR-only/no-direct-push proof remains deferred. Required PR reviews are
  observed with one approving review, but bypass allowance/no-direct-push
  details were not fully exposed in the inspected API responses.
- Wiring branch-safety into default PR CI remains deferred because GitHub
  Actions PR checkout behavior can use merge refs or detached HEAD.

## Rollback instructions

Rollback by reverting the AGENTS policy additions, branch-safety checker,
tests, npm script, report-only branch-protection fields, and sprint evidence
changes. No generated-output cleanup is required.

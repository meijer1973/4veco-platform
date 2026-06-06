# Sprint CI-EVIDENCE-1: Result

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-EVIDENCE-1-plan.md`

Plan JSON: `references/data/sprints/CI-EVIDENCE-1.plan.json`

## Summary

Implemented a cross-repo checkout evidence helper and workflow artifact upload.

Implemented:

- added `build-scripts/ci/platform-ci-evidence.js`;
- added tests for evidence shape and outside-checkout output paths;
- added a `platform-ci` step after Node/Python setup that writes and validates
  `..\ci-artifacts\platform-ci-evidence.json`;
- added `ci-artifacts/platform-ci-evidence.json` to the existing
  `platform-ci-diagnostics` artifact upload path.

Local evidence JSON recorded:

- platform SHA before final commit:
  `ed12764ad39eb1290c899a9bee08edf6a77c126d`
- lessen SHA:
  `15f823028522663ca62c8d6369af9c6ae0264efb`

Remote artifact proof:

- workflow name: `platform-ci`
- job name: `validate-platform`
- run URL: `https://github.com/meijer1973/4veco-platform/actions/runs/27065594154`
- run ID: `27065594154`
- job ID: `79885793668`
- branch head SHA: `4ddd5e0fc4527607938146c8838ca4ded77733b8`
- artifact: `platform-ci-diagnostics`
- artifact ID: `7455396312`
- evidence file: `ci-artifacts/platform-ci-evidence.json`
- evidence `platform.head_sha`:
  `187a9922bd78a12ed4f71eb0b35bad24929b6405`
- evidence `lessen.head_sha`:
  `15f823028522663ca62c8d6369af9c6ae0264efb`
- evidence `github_ref`: `refs/pull/7/merge`
- conclusion: `success`

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-EVIDENCE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1`
- `node build-scripts/ci/platform-ci-evidence.js write --output ../ci-artifacts-local/platform-ci-evidence.json --platform-path . --lessen-path ../4veco-lessen`
- `node build-scripts/ci/platform-ci-evidence.js check ../ci-artifacts-local/platform-ci-evidence.json --platform-path . --lessen-path ../4veco-lessen`
- `npx.cmd jest --runInBand build-scripts/ci/platform-ci-evidence.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`
- `node build-scripts/sprints/check-sprint-command-log.js CI-EVIDENCE-1`

## Changed files

Implementation:

- `.github/workflows/platform-ci.yml`
- `build-scripts/ci/platform-ci-evidence.js`
- `build-scripts/ci/platform-ci-evidence.test.js`

Evidence, roadmap, and indexes:

- `reports/sprints/CI-EVIDENCE-1-*`
- `references/data/sprints/CI-EVIDENCE-1.*.json`
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

The local artifact was written to `../ci-artifacts-local/`, outside both repos.
The CI artifact is written to `ci-artifacts/` at workspace root, outside both
checked-out repositories.

## Open follow-ups

- Remote proof recorded from PR run `27065594154`. The current branch must
  still keep passing `validate-platform` after this metadata update.

## Rollback instructions

Rollback by reverting the CI evidence helper, tests, workflow step, artifact
upload path, and sprint evidence changes. No generated-output cleanup is
required.

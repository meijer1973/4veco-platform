# Sprint CI-GOVERNANCE-1: Branch Protection Drift Checker

Generated: 2026-06-06

## Goal

Make branch-protection drift visible with a small local/manual checker for
`meijer1973/4veco-platform` branch `main`.

This sprint changes CI/build-authoring governance only. It does not change
generated lesson output, protected references, source data, target registries,
candidate storage, PV outputs, product routes, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1, or
student/product use.

## Context

`CI-REMOTE-1A` verified current branch protection after enabling admin
enforcement, and the three CI hardening sprints through `CI-GATE-PROOF-1`
strengthened CI proof and evidence. That proof is still procedural: future
settings drift could weaken the required gate without a code diff. The user
requested a drift checker that verifies the expected policy through `gh api`
or the GitHub API.

The checker should remain local/manual unless the available GitHub token can
read branch protection in a low-risk way. This sprint does not add admin
tokens or default CI secrets.

## Quality Standard

The specification quality floor is a deterministic governance checker with
explicit policy proof:

- the checker must query or validate a GitHub branch-protection response and
  print a concise JSON summary;
- it must fail when strict required checks, the `validate-platform` context,
  admin enforcement, force-push protection, or deletion protection are weaker
  than expected;
- rendered output and student-facing routes remain intentionally unchanged;
- proof must include local validator/test evidence, branch-protection API
  evidence, and remote `platform-ci / validate-platform` proof after push;
- any unavailable API permission must become an explicit blocker or manual-only
  limitation, not a weakened policy;
- any omitted automation must be named as follow-up work rather than hidden
  closure debt.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Query branch protection | `build-scripts/ci/check-branch-protection.js` calls `gh api` for repo/branch | Direct command passes against `meijer1973/4veco-platform main` | planned |
| Emit concise JSON summary | Checker prints repository, branch, expected policy, observed policy, failures, and ok flag | Command log captures JSON output | planned |
| Fail weaker policy | Tests cover admin false, strict false, missing context, force pushes allowed, deletions allowed | Jest negative mocked-response tests fail for intended reasons | planned |
| Avoid secret/admin-token changes | No workflow secret or default CI permission additions | Diff summary and lead review | planned |
| Preserve protected/generated surfaces | No lesson target or protected reference changes | Diff summary and lessen diff hygiene | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add a default scheduled CI workflow requiring high privilege. | reject_scope_creep | The user explicitly said to avoid high-privilege secrets. |
| Add a local/manual checker using authenticated `gh`. | include_now | It provides immediate drift visibility without weakening CI. |
| Add mocked negative tests for policy drift cases. | include_now | This proves the checker catches weaker settings even when live settings are healthy. |
| Add automatic remediation of branch protection. | reject_scope_creep | This sprint observes and fails; it does not mutate repository settings. |
| Add a manual `workflow_dispatch` wrapper. | defer_named_follow_up | Useful later if token permissions are confirmed; not needed for the first checker. |

## Allowed paths

- `build-scripts/ci/check-branch-protection.js`
- `build-scripts/ci/check-branch-protection.test.js`
- `package.json`
- `.gitattributes`
- `reports/sprints/CI-GOVERNANCE-1-*`
- `references/data/sprints/CI-GOVERNANCE-1.plan.json`
- `references/data/sprints/CI-GOVERNANCE-1.result.json`
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
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product route files in `../4veco-lessen/`

## Inputs

- `reports/sprints/CI-REMOTE-1A-result.md`
- `reports/sprints/CI-GATE-PROOF-1-result.md`
- `references/reference-team-roadmap.md`
- `.github/workflows/platform-ci.yml`
- `package.json`
- current branch-protection API response for `meijer1973/4veco-platform` `main`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- branch-protection checker and mocked-response tests;
- optional npm script for the local/manual checker;
- sprint plan, baseline, planning review, command log, lead-review cycle,
  result, diff summary, and plan/result JSON;
- refreshed roadmap, repository indexes, URL index, and dashboard if required;
- remote publication proof after push.

## Operationalized sprint procedure

1. Record the current branch-protection baseline and stop if `gh api` cannot
   read the policy.
2. Implement a read-only checker that queries `gh api` by default and validates
   an injected/mocked response in tests.
3. Add tests for every required weaker-policy case: admin enforcement false,
   strict false, missing required context, force pushes allowed, and deletion
   allowed.
4. Add an npm script only for local/manual usage; do not add high-privilege
   secrets or default CI enforcement.
5. Run acceptance validators through `run-sprint-command.js`; stop on any
   failed validator or changed generated/protected output.
6. Complete lead-review round 1, correction log, and round 2 before closure.
7. Push and verify remote `platform-ci / validate-platform` success for the
   reviewed commit before recording final proof.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-GOVERNANCE-1-plan.md
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-GOVERNANCE-1
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/ci/check-branch-protection.js --repo meijer1973/4veco-platform --branch main
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- npx.cmd jest --runInBand build-scripts/ci/check-branch-protection.test.js
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-sprint-command-log.js CI-GOVERNANCE-1
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-lead-review-substance.js CI-GOVERNANCE-1
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-GOVERNANCE-1-result.md
node build-scripts/sprints/run-sprint-command.js CI-GOVERNANCE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-GOVERNANCE-1 --complete
```

## Proof Required to Close

Proof to close must include review, validator, test, and remote GitHub
evidence:

- checker passes against current branch protection;
- negative mocked-response tests prove weaker policy fails;
- local validators pass;
- lessen diff hygiene passes;
- lead-review round 1 and round 2 pass;
- result states whether enforcement is manual-only or automated;
- remote `platform-ci / validate-platform` passes on the reviewed commit.

## Rollback plan

Rollback by reverting the checker, tests, npm script, and sprint evidence
changes. Because the checker is read-only and does not mutate GitHub settings
or generated lesson output, rollback does not require generated-output cleanup.

## Human review required

No additional human review is required. This is CI governance evidence
hardening within the user's authorized packet.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/CI-GOVERNANCE-1-lead-review-assignment.md`
- `reports/sprints/CI-GOVERNANCE-1-lead-review-round1.md`
- `reports/sprints/CI-GOVERNANCE-1-lead-review-corrections.md`
- `reports/sprints/CI-GOVERNANCE-1-lead-review-round2.md`

## Stop Conditions

Stop if the GitHub API cannot be read with available credentials, if the
checker would need high-privilege secrets in default CI, if branch protection
is weaker than expected, or if any protected reference/source-data/product-route
surface changes.

## Next Authorized Work After Closure

After this sprint closes, proceed to `CI-PR-PROOF-1` only if the owner wants
the protected-branch PR-path proof recorded as a separate evidence sprint.

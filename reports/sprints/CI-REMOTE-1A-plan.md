# Sprint CI-REMOTE-1A: Current-Head CI Proof And Admin Enforcement

Generated: 2026-06-04

## Goal

Close the reviewer flags left after `CI-REMOTE-1` by proving the hardened
workflow on current `main` and enforcing branch protection for admins/owners
as well as normal contributors.

This is a narrow CI governance follow-up. It does not change generated lesson
output, protected references, source data, target registries, candidate
storage, PV outputs, product routes, diagnostics, adaptive routing,
mastery/sequencing, Scale Gate 1, or student/product use.

## Context

The reviewer accepted the workflow structure but found two closure gaps:

- the sprint result recorded a successful run on commit
  `c70cf1cf9320a5de9f8a2f4e490b934ae822246b`, while the current hardened
  workflow commit was `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`;
- branch protection existed but `enforce_admins` was false, so repository
  owners could bypass the required status check on direct pushes.

## Quality Standard

The specification quality floor is current-head proof plus universal
enforcement:

- `platform-ci / validate-platform` must have passed on current `main` at
  `9f6e5cbf645143bcf06de3bd2800e7cb226b6877` or a later current head;
- the run evidence must record run URL, run ID, job ID, head SHA, conclusion,
  and diagnostic artifact ID;
- branch protection for `main` must show strict required context
  `validate-platform`, `enforce_admins: true`, force pushes disabled, and
  branch deletion disabled;
- the evidence must be committed through a branch/PR path after admin
  enforcement is enabled.

Rendered output is intentionally unchanged. This sprint produces CI evidence
only and does not alter student-facing pages, labs, documents, or generated
lesson output.

Any missing current-head CI proof, missing artifact, or missing admin
enforcement is a named follow-up blocker, not an acceptable closure flag.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Prove current hardened workflow | GitHub Actions run for `9f6e5cb...` or later current head | Run URL, job ID, and conclusion recorded | planned |
| Verify diagnostic artifact | `platform-ci-diagnostics` artifact ID and expiry | Artifact API evidence recorded | planned |
| Enforce branch protection for everybody | GitHub branch protection API shows `enforce_admins: true` | Protection API evidence recorded | planned |
| Update sprint evidence | `CI-REMOTE-1-result.md` and `CI-REMOTE-1A-result.md` cite current-head proof | Result and bundle validators pass | planned |
| Preserve boundaries | No protected reference, generated lesson output, source-data, PV, or product-route changes | Diff hygiene and data-integrity notes | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Treat the prior final response as enough. | reject | The reviewer needs inspectable repository evidence, not only chat output. |
| Re-run CI without recording branch protection. | reject | The user explicitly requested enforced branch protection for everybody. |
| Enable admin enforcement before publication. | include_now | The follow-up must prove branch protection applies to owners/admins, not only PR merges by non-admin contributors. |
| Add a dedicated validator that checks every human gate packet cites matching CI. | defer_named_follow_up | This sprint records the governance rule; automated packet enforcement can be a later protocol-hardening task. |
| Make a large new CI redesign. | reject_scope_creep | The reviewer found the CI structure sound; only proof/enforcement need correction. |

## Allowed paths

- `reports/sprints/CI-REMOTE-1A-*`
- `references/data/sprints/CI-REMOTE-1A.plan.json`
- `references/data/sprints/CI-REMOTE-1A.result.json`
- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1.result.json`
- `.github/workflows/platform-ci.yml`
- `references/reference-team-roadmap.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`
- `BATCH-CLOSURE-WAIVER.md`

## Forbidden paths

- `references/machine/`
- `references/external/`
- `source-data/`
- target-exercise registries
- candidate-storage files
- PV projection outputs
- PV machine-promotion outputs
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product route files in `../4veco-lessen/`

## Inputs

- reviewer report from the user on 2026-06-04
- `.github/workflows/platform-ci.yml`
- `.gitattributes`
- `reports/sprints/CI-REMOTE-1-result.md`
- `references/data/sprints/CI-REMOTE-1.result.json`
- GitHub Actions run `26954512486`
- GitHub branch protection API for `main`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- `CI-REMOTE-1A` plan, baseline, command log, lead-review cycle, result, diff
  summary, and plan/result JSON;
- updated `CI-REMOTE-1` result markdown/JSON with current-head proof;
- updated roadmap row documenting `CI-REMOTE-1A`;
- refreshed repository maps, URL index, and internal dashboard;
- branch protection with admin enforcement enabled.
- batch closure waiver for the intentional `CI-REMOTE-1` plus
  `CI-REMOTE-1A` result JSON update.
- workflow permission correction from `contents: read` only to
  `contents: read` plus `artifact-metadata: write`, needed for
  pull-request artifact upload.

## Operationalized sprint procedure

1. Confirm the local worktree is clean and create a follow-up branch.
2. Read current `CI-REMOTE-1` evidence and reviewer findings.
3. Query GitHub Actions for the current-head run and artifact.
4. Enable admin enforcement on branch protection and verify it through the API.
5. Write `CI-REMOTE-1A` evidence and update `CI-REMOTE-1` result records.
6. Refresh maps, URL index, and internal dashboard.
7. Run local result, bundle, lead-review, report JSON, roadmap index,
   URL-index, scope-language, and diff checks through `run-sprint-command.js`.
   Stop on any validator failure and record the decision before proceeding.
8. Commit to the follow-up branch, push, and open/merge through the protected
   branch after CI passes.
9. Confirm final `main` has a passing `platform-ci / validate-platform` run
   and admin enforcement remains true.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- gh run view 26954512486 --repo meijer1973/4veco-platform --json databaseId,workflowName,displayTitle,headSha,status,conclusion,url,jobs
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- gh api repos/meijer1973/4veco-platform/actions/runs/26954512486/artifacts
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- gh api repos/meijer1973/4veco-platform/branches/main/protection --jq "{strict:.required_status_checks.strict,contexts:.required_status_checks.contexts,enforce_admins:.enforce_admins.enabled,allow_force_pushes:.allow_force_pushes.enabled,allow_deletions:.allow_deletions.enabled}"
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-REMOTE-1A-plan.md
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-REMOTE-1A-result.md
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/sprints/check-lead-review-substance.js CI-REMOTE-1A
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/sprints/check-sprint-bundle.js CI-REMOTE-1A --complete
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js CI-REMOTE-1A -- git diff --check
```

## Proof Required to Close

Proof to close must include review, validator, test, and remote GitHub
evidence:

- current-head GitHub Actions run is success;
- diagnostic artifact exists;
- branch protection has `enforce_admins: true`;
- result markdown/JSON cite the proof;
- lead-review round 1 and round 2 pass;
- local validators pass;
- final merge to `main` has a passing remote CI run.

## Rollback plan

Rollback by reverting the `CI-REMOTE-1A` evidence commit and disabling admin
enforcement only if the repository owner explicitly decides admin bypasses are
required again. No generated-output cleanup is required.

## Human review required

No additional human review is required. This sprint implements the review
report already supplied by the user.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/CI-REMOTE-1A-lead-review-assignment.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-round1.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-corrections.md`
- `reports/sprints/CI-REMOTE-1A-lead-review-round2.md`

## Stop Conditions

Stop if current-head CI proof is unavailable, branch protection cannot enforce
admins, required status checks disappear, diagnostic artifacts are missing, or
any protected/generated output changes.

## Next Authorized Work After Closure

After `CI-REMOTE-1A` closes, proceed to `GATE-SHARED-TASK-INGEST-REPAIR-1`
only with a passing CI run for the reviewed commit or an explicit CI waiver.

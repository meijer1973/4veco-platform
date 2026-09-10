# Sprint CI-REMOTE-1: Lead Review Assignment

## Assignment

Sprint: `CI-REMOTE-1`

Lead reviewer agent: Codex structural lead review.

Scope: review the remote CI workflow, sprint evidence, remote GitHub Actions
proof, branch protection state, local command logs, roadmap updates, and
protected-surface boundaries.

## Evidence To Inspect

- `.github/workflows/platform-ci.yml`
- `.github/ci-python-requirements.txt`
- `package.json`
- `package-lock.json`
- `reports/sprints/CI-REMOTE-1-plan.md`
- `reports/sprints/CI-REMOTE-1-baseline.md`
- `reports/sprints/CI-REMOTE-1-planning-review.md`
- `reports/sprints/CI-REMOTE-1-command-log.jsonl`
- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1.plan.json`
- `references/data/sprints/CI-REMOTE-1.result.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- GitHub Actions run `26953558150`
- Branch protection API response for `main`

## Required Review Questions

1. Does the workflow trigger on `push`, `pull_request`, and
   `workflow_dispatch`?
2. Does the workflow check out `4veco-platform` and `4veco-lessen` as sibling
   directories?
3. Does CI use `npm ci` and existing validation commands?
4. Are permissions read-only and credentials not persisted?
5. Does the successful remote run prove install, Jest, scope-language, report
   JSON, roadmap index, URL index, and diff hygiene?
6. Were the failed remote runs diagnosed and corrected instead of ignored?
7. Is the diagnostic artifact uploaded and bounded?
8. Is branch protection configured with required status check context
   `validate-platform`?
9. Did protected references, source data, generated lesson output, product
   routes, and PV outputs remain unchanged?
10. Are blocked claims and next authorized work explicit?

## Stop Conditions

Stop with REVISE, FAIL, or PAUSE if the workflow lacks required triggers,
checks out only the platform repo, uses broad/write permissions, leaks or
requires a secret unnecessarily, skips required validators, lacks successful
remote run evidence, lacks artifact evidence, leaves branch protection
unconfigured without a precise blocker, changes forbidden surfaces, or claims
product-route adoption, target-equivalent proof, diagnostics, mastery,
sequencing, PV, Scale Gate 1, or student/product use.

## Expected Output

Return a `# Lead Review Summary` using the strict sprint format, with
`Round: lead review round 1`, command-log evidence, blocking findings, flags,
ownership, and one concrete next action.

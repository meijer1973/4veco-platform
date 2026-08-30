# Sprint SINGLE-PR-DRY-RUN-REPAIR-1: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:16:58.958Z`
- finished_at: `2026-08-30T10:16:59.117Z`
- duration_ms: `159`
- exit_code: `0`
- stdout_sha256: `a6d1e5643d968497e11e41df807d7f237533b8cf1bd52649a9def49b0abca7c6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\SINGLE-PR-DRY-RUN-REPAIR-1-plan.md

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-pr.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:16:59.495Z`
- finished_at: `2026-08-30T10:17:30.563Z`
- duration_ms: `31068`
- exit_code: `0`
- stdout_sha256: `f938fa2a9371564f7aac19088774bb85b3a45311a17c30e6e1b7e72b6e247f7c`
- stderr_sha256: `1fef0b86081a7533f639d2284c521cde6aa2c1c03d4b731e63b3eb0bb2714aba`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/review-gates/integrate-authorized-pr.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        30.238 s, estimated 31 s
Ran all test suites matching build-scripts/review-gates/integrate-authorized-pr.test.js.

```
## npm.cmd run check:integration-lane

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:17:37.305Z`
- finished_at: `2026-08-30T10:18:18.256Z`
- duration_ms: `40951`
- exit_code: `0`
- stdout_sha256: `6e178c2e38186fd6ab8b54b4f97793a761682f48af136f7badc7215f23e752c7`
- stderr_sha256: `65f2cc3fa10e829404d5da3db8dea66dde7657736f8b76e6d23625a198cba117`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:integration-lane
> jest build-scripts/review-gates/check-human-payload-authorization.test.js build-scripts/review-gates/check-human-bundle-authorization.test.js build-scripts/review-gates/check-integration-lineage.test.js build-scripts/review-gates/check-integration-lane-capability.test.js build-scripts/review-gates/cross-repo-bundle-compatibility.test.js build-scripts/review-gates/apply-bundle-readiness-decision.test.js build-scripts/review-gates/integrate-authorized-pr.test.js build-scripts/review-gates/integrate-authorized-bundle.test.js build-scripts/review-gates/authorized-pr-integration-workflow.test.js build-scripts/review-gates/cross-repo-bundle-workflow.test.js --runInBand


```

### stderr excerpt

```text

Test Suites: 10 passed, 10 total
Tests:       239 passed, 239 total
Snapshots:   0 total
Time:        40.122 s, estimated 43 s
Ran all test suites matching build-scripts/review-gates/check-human-payload-authorization.test.js|build-scripts/review-gates/check-human-bundle-authorization.test.js|build-scripts/review-gates/check-integration-lineage.test.js|build-scripts/review-gates/check-integration-lane-capability.test.js|build-scripts/review-gates/cross-repo-bundle-compatibility.test.js|build-scripts/review-gates/apply-bundle-readiness-decision.test.js|build-scripts/review-gates/integrate-authorized-pr.test.js|build-scripts/review-gates/integrate-authorized-bundle.test.js|build-scripts/review-gates/authorized-pr-integration-workflow.test.js|build-scripts/review-gates/cross-repo-bundle-workflow.test.js.

```
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:18:25.971Z`
- finished_at: `2026-08-30T10:18:26.359Z`
- duration_ms: `388`
- exit_code: `0`
- stdout_sha256: `225dbc2f6711f40dc487f6978a66b2650e048ebf3b312f03465ac90853e3db61`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 5
  - build-scripts/review-gates/integrate-authorized-pr.js
  - build-scripts/review-gates/integrate-authorized-pr.test.js
  - docs/review/pr-integration-lane-policy.md
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.plan.json
  - references/reference-team-roadmap.md
- review evidence: 4
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-baseline.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-assignment.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-planning-review.md

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:18:26.654Z`
- finished_at: `2026-08-30T10:18:26.718Z`
- duration_ms: `64`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:18:32.888Z`
- finished_at: `2026-08-30T10:24:02.955Z`
- duration_ms: `330067`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `fe19f17fe1e05c1a10087807680c1cc6d1c917aa2f2a2b286bbbbae7de50e276`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:platform
> jest --runInBand


```

### stderr excerpt

```text
Cannot parse chapter folder name: bad-name
Expected format: "X.Y Hoofdstuk Name"
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ MISSING review report (X.Y.Z-review.md)
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ quality_ref reports missing assets: 9.9.1-quality-ref.yaml
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ Part A review verdict is FAIL: 9.9.1-review.md
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ Non-compliant asset name: B9C9S1_fig_1.svg (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.svg does not start with 9.9.1_
  ✗ Non-compliant asset name: B9C9S1_fig_1.png (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.png does not start with 9.9.1_
  ⚠ No _chapter-plan.md
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.png (expected 9.9.*)
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.svg (expected 9.9.*)
  ⚠ No _chapter-plan.md
  ✗ Chapter aggregate asset differs from paragraph source: 9.9.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING toetsmatrijs.md
  ✗ Expected 3 PDFs, found 2
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING samenvatting.md
  ✗ Expected 2 PDFs, found 1
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.4_ex_1.svg
  ⚠ No _chapter-plan.md

Test Suites: 6 skipped, 105 passed, 105 of 111 total
Tests:       8 skipped, 1578 passed, 1586 total
Snapshots:   0 total
Time:        329.04 s
Ran all test suites.

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:25:43.596Z`
- finished_at: `2026-08-30T10:25:44.747Z`
- duration_ms: `1151`
- exit_code: `0`
- stdout_sha256: `184fc4e6415cae8926086609114134aba5462d1f352c24642dd3447d59bb6094`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:branch-protection
> node build-scripts/ci/check-branch-protection.js

{
  "repository": "meijer1973/4veco-platform",
  "branch": "main",
  "ok": true,
  "expected": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "validate-platform"
      ]
    },
    "required_pull_request_reviews": {
      "required_approving_review_count": 0,
      "dismiss_stale_reviews": false,
      "require_code_owner_reviews": false,
      "require_last_push_approval": false
    },
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_conversation_resolution": true
  },
  "observed": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "validate-platform"
      ]
    },
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_conversation_resolution": true,
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 0,
      "dismiss_stale_reviews": false,
      "require_code_owner_reviews": false,
      "require_last_push_approval": false,
      "bypass_allowances_observable": false,
      "bypass_disabled": null,
      "limitation": "bypass allowances not exposed in inspected response"
    }
  },
  "failures": []
}

```

### stderr excerpt

```text

```
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:30:44.901Z`
- finished_at: `2026-08-30T10:30:45.382Z`
- duration_ms: `481`
- exit_code: `0`
- stdout_sha256: `06ee8f6082308019ba8f54df7ce88c02ee8858ce8f82b6a447024f01b9ba4a48`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 dashboard:internal
> node build-scripts/reports/internal-dashboard.js

Internal dashboard written to reports\internal-dashboard\index.html
Dashboard data written to reports\internal-dashboard\dashboard-data.json

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:30:45.783Z`
- finished_at: `2026-08-30T10:30:45.918Z`
- duration_ms: `135`
- exit_code: `0`
- stdout_sha256: `a6d1e5643d968497e11e41df807d7f237533b8cf1bd52649a9def49b0abca7c6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\SINGLE-PR-DRY-RUN-REPAIR-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-lead-review-substance.js SINGLE-PR-DRY-RUN-REPAIR-1

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:31:23.825Z`
- finished_at: `2026-08-30T10:31:23.909Z`
- duration_ms: `84`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ef0c4cfeaad74655bcda83cce036042a7191015843a3661977d002d356421e7c`

### stdout excerpt

```text

```

### stderr excerpt

```text
Lead-review substance check failed: reports\sprints\SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round1.md cites missing output artifact: build-scripts/review-gates/integrate-authorized-pr.js:1049

```
## node build-scripts/sprints/check-lead-review-substance.js SINGLE-PR-DRY-RUN-REPAIR-1

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:31:48.119Z`
- finished_at: `2026-08-30T10:31:48.215Z`
- duration_ms: `96`
- exit_code: `0`
- stdout_sha256: `b9b061f9814d6c1df3d5f99dcb2bacbf2ece8cf6d21fbfcc1e74416681771937`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: SINGLE-PR-DRY-RUN-REPAIR-1

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js SINGLE-PR-DRY-RUN-REPAIR-1 --complete

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:31:53.000Z`
- finished_at: `2026-08-30T10:31:53.269Z`
- duration_ms: `269`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `57f11c8b5467a71fd63957207e5b80cbec7d986fcc24627aa63c5e03cfdf3d70`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\SINGLE-PR-DRY-RUN-REPAIR-1-baseline.md must include Data integrity notes

```
## node build-scripts/sprints/check-sprint-bundle.js SINGLE-PR-DRY-RUN-REPAIR-1 --complete

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:32:24.260Z`
- finished_at: `2026-08-30T10:32:24.542Z`
- duration_ms: `282`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `4f294f5f366b82f080d09edc55b1b91c8a21f42f82f3c157a62a325bbafab70c`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint result check failed: passed command lacks command-log exit_code 0 evidence: node build-scripts/sprints/check-sprint-bundle.js SINGLE-PR-DRY-RUN-REPAIR-1 --complete
Sprint bundle check failed: validator failed: node build-scripts\sprints\check-sprint-result.js reports\sprints\SINGLE-PR-DRY-RUN-REPAIR-1-result.md

```
## node build-scripts/sprints/check-sprint-bundle.js SINGLE-PR-DRY-RUN-REPAIR-1 --complete

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:32:40.370Z`
- finished_at: `2026-08-30T10:32:41.134Z`
- duration_ms: `764`
- exit_code: `0`
- stdout_sha256: `f7ad1a93a5b443aa977efbc276352450076bd348fad0f7a5d908cd94779cc973`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: SINGLE-PR-DRY-RUN-REPAIR-1 complete

```

### stderr excerpt

```text

```

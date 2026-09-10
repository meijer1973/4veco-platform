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
## npm.cmd test -- --runInBand build-scripts/workflows/check-paragraph-lane-scope.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:40:07.594Z`
- finished_at: `2026-08-30T10:40:10.158Z`
- duration_ms: `2564`
- exit_code: `0`
- stdout_sha256: `110687befc6d975459b7a7e8d2525300a2b45e42e767fa5330bd5ca537cf540f`
- stderr_sha256: `6672a0ca363dae3799978acea011302406a1816d1a489e3866c8f7d63c82de38`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/check-paragraph-lane-scope.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.413 s, estimated 2 s
Ran all test suites matching build-scripts/workflows/check-paragraph-lane-scope.test.js.

```
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:40:14.775Z`
- finished_at: `2026-08-30T10:40:15.181Z`
- duration_ms: `406`
- exit_code: `0`
- stdout_sha256: `947689a6ce0095c9036e9ec9e5658b5d1b967762626215d1bafa2ffa1828c889`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 8
  - build-scripts/review-gates/integrate-authorized-pr.js
  - build-scripts/review-gates/integrate-authorized-pr.test.js
  - docs/review/pr-integration-lane-policy.md
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.plan.json
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.result.json
  - references/reference-team-roadmap.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
- generated index/report: 1
  - reports/url-index.md
- review evidence: 14
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/bundle-urls.md
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.json
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-baseline.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.jsonl
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-diff-summary.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-assignment.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-corrections.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round1.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round2.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-planning-review.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-result.md

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-pr.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:40:29.966Z`
- finished_at: `2026-08-30T10:41:01.259Z`
- duration_ms: `31293`
- exit_code: `0`
- stdout_sha256: `f938fa2a9371564f7aac19088774bb85b3a45311a17c30e6e1b7e72b6e247f7c`
- stderr_sha256: `438bd8a86f5073543544562e0503961b0f888c7a7c53a6b7add614042873754c`

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
Time:        30.297 s, estimated 31 s
Ran all test suites matching build-scripts/review-gates/integrate-authorized-pr.test.js.

```
## npm.cmd run check:integration-lane

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:41:07.136Z`
- finished_at: `2026-08-30T10:41:49.150Z`
- duration_ms: `42014`
- exit_code: `0`
- stdout_sha256: `6e178c2e38186fd6ab8b54b4f97793a761682f48af136f7badc7215f23e752c7`
- stderr_sha256: `bb9602686642964ed9f743af187f42b57e21edcaf97a5aa6fd0bf34aa100b895`

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
Time:        41.015 s
Ran all test suites matching build-scripts/review-gates/check-human-payload-authorization.test.js|build-scripts/review-gates/check-human-bundle-authorization.test.js|build-scripts/review-gates/check-integration-lineage.test.js|build-scripts/review-gates/check-integration-lane-capability.test.js|build-scripts/review-gates/cross-repo-bundle-compatibility.test.js|build-scripts/review-gates/apply-bundle-readiness-decision.test.js|build-scripts/review-gates/integrate-authorized-pr.test.js|build-scripts/review-gates/integrate-authorized-bundle.test.js|build-scripts/review-gates/authorized-pr-integration-workflow.test.js|build-scripts/review-gates/cross-repo-bundle-workflow.test.js.

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:41:54.509Z`
- finished_at: `2026-08-30T10:47:24.113Z`
- duration_ms: `329604`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `bebde0e572e29ea1cf68abd11269d14674a22f10f03cb09810eaa10c19ebe3e7`

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
Tests:       8 skipped, 1579 passed, 1587 total
Snapshots:   0 total
Time:        328.838 s
Ran all test suites.

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:47:46.206Z`
- finished_at: `2026-08-30T10:47:46.331Z`
- duration_ms: `125`
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
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T10:49:57.036Z`
- finished_at: `2026-08-30T10:49:57.607Z`
- duration_ms: `571`
- exit_code: `0`
- stdout_sha256: `f10aa163437c06d801ebc3fe99d779f5804045aa2c1a33e8a4923871fce677ed`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 10
  - build-scripts/review-gates/integrate-authorized-pr.js
  - build-scripts/review-gates/integrate-authorized-pr.test.js
  - build-scripts/workflows/check-paragraph-lane-scope.js
  - build-scripts/workflows/check-paragraph-lane-scope.test.js
  - docs/review/pr-integration-lane-policy.md
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.plan.json
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.result.json
  - references/reference-team-roadmap.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
- generated index/report: 1
  - reports/url-index.md
- review evidence: 14
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/bundle-urls.md
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.json
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-baseline.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.jsonl
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-diff-summary.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-assignment.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-corrections.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round1.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round2.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-planning-review.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-result.md

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js build-scripts/workflows/check-paragraph-lane-scope.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:21:43.137Z`
- finished_at: `2026-08-30T11:22:51.490Z`
- duration_ms: `68353`
- exit_code: `1`
- stdout_sha256: `9a2604839792aca1a20df60af1bf8f2fb38d06f0425064f54e589ef900032f6b`
- stderr_sha256: `39fb42e144d32b635c105454a44b10b1e4e2f65caa87d578c167a781b68e5a3a`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js build-scripts/workflows/check-paragraph-lane-scope.test.js


```

### stderr excerpt

```text
FAIL build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js (66.082 s)
  ● Y1 Golden rollout wave evidence and governance contracts › validates every source-manifest artifact against committed source and destination bytes

    source manifest destination blob mismatch: y1_checker_tests

      273 |
      274 | function check(condition, message) {
    > 275 |   if (!condition) throw new CheckError(message);
          |                         ^
      276 | }
      277 |
      278 | function normalizePath(value) {

      at check (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:275:25)
      at Object.check [as validateSourceManifest] (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:517:5)
      at Object.validateSourceManifest (build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js:555:28)

  ● Y1 Golden rollout wave real Git CLI scope attestation › full mode keeps state checks for unrelated work and rejects rendered-input drift

    source manifest destination blob mismatch: y1_checker_tests

      273 |
      274 | function check(condition, message) {
    > 275 |   if (!condition) throw new CheckError(message);
          |                         ^
      276 | }
      277 |
      278 | function normalizePath(value) {

      at check (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:275:25)
      at check (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:517:5)
      at validateSourceManifest (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:1242:3)
      at Object.validateExactHeadDelta [as run] (build-scripts/sprints/check-y1-golden-rollout-wave-1.js:1507:26)
      at Object.run (build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js:1184:31)


Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 102 passed, 104 total
Snapshots:   0 total
Time:        67.562 s, estimated 110 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js|build-scripts/workflows/check-paragraph-lane-scope.test.js.

```
## npm.cmd test -- --runInBand build-scripts/ci/check-evidence-line-endings.test.js build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:27:50.091Z`
- finished_at: `2026-08-30T11:30:15.284Z`
- duration_ms: `145193`
- exit_code: `0`
- stdout_sha256: `eae2d21187dd59617e82ce7c29b061230c446097a2f9d93745978623b4584cdb`
- stderr_sha256: `7f0d254a4a04e3254b7ee4561f0568199c18abceb05cc071ca5a3cfb4b22ba60`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/ci/check-evidence-line-endings.test.js build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text

Test Suites: 2 passed, 2 total
Tests:       84 passed, 84 total
Snapshots:   0 total
Time:        144.187 s
Ran all test suites matching build-scripts/ci/check-evidence-line-endings.test.js|build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-pr.test.js

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:30:20.714Z`
- finished_at: `2026-08-30T11:30:51.778Z`
- duration_ms: `31064`
- exit_code: `0`
- stdout_sha256: `f938fa2a9371564f7aac19088774bb85b3a45311a17c30e6e1b7e72b6e247f7c`
- stderr_sha256: `811d3576b610246d5dd9e28423a797637e26833f85ed028b437de3e90c80a4be`

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
Time:        30.246 s, estimated 31 s
Ran all test suites matching build-scripts/review-gates/integrate-authorized-pr.test.js.

```
## npm.cmd run check:integration-lane

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:30:59.239Z`
- finished_at: `2026-08-30T11:31:42.386Z`
- duration_ms: `43147`
- exit_code: `0`
- stdout_sha256: `6e178c2e38186fd6ab8b54b4f97793a761682f48af136f7badc7215f23e752c7`
- stderr_sha256: `491525d9671ea1e6b1272683928e6b964aacd49fcd5f95437017dacb6d87bafe`

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
Time:        42.1 s
Ran all test suites matching build-scripts/review-gates/check-human-payload-authorization.test.js|build-scripts/review-gates/check-human-bundle-authorization.test.js|build-scripts/review-gates/check-integration-lineage.test.js|build-scripts/review-gates/check-integration-lane-capability.test.js|build-scripts/review-gates/cross-repo-bundle-compatibility.test.js|build-scripts/review-gates/apply-bundle-readiness-decision.test.js|build-scripts/review-gates/integrate-authorized-pr.test.js|build-scripts/review-gates/integrate-authorized-bundle.test.js|build-scripts/review-gates/authorized-pr-integration-workflow.test.js|build-scripts/review-gates/cross-repo-bundle-workflow.test.js.

```
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:31:58.780Z`
- finished_at: `2026-08-30T11:31:59.368Z`
- duration_ms: `588`
- exit_code: `0`
- stdout_sha256: `e4f41ac063ea146f65c24d1658198344de6aa7f3825d8984f9adbcd74753b11b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 13
  - .gitattributes
  - build-scripts/ci/check-evidence-line-endings.js
  - build-scripts/ci/check-evidence-line-endings.test.js
  - build-scripts/review-gates/integrate-authorized-pr.js
  - build-scripts/review-gates/integrate-authorized-pr.test.js
  - build-scripts/workflows/check-paragraph-lane-scope.js
  - build-scripts/workflows/check-paragraph-lane-scope.test.js
  - docs/review/pr-integration-lane-policy.md
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.plan.json
  - references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1.result.json
  - references/reference-team-roadmap.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
- generated index/report: 5
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
  - reports/url-index.md
- review evidence: 15
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/bundle-urls.md
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.json
  - reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-baseline.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.jsonl
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-diff-summary.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-assignment.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-corrections.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-renewal.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round1.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round2.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-planning-review.md
  - reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-result.md

```

### stderr excerpt

```text

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:31:59.789Z`
- finished_at: `2026-08-30T11:32:01.165Z`
- duration_ms: `1376`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:32:06.884Z`
- finished_at: `2026-08-30T11:37:38.872Z`
- duration_ms: `331988`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `ccb5cb70907629c903d5a1a1aad1ebdd1bbc0c600fbc49880b120b7d860409dc`

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
Tests:       8 skipped, 1580 passed, 1588 total
Snapshots:   0 total
Time:        330.952 s
Ran all test suites.

```
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\SINGLE-PR-DRY-RUN-REPAIR-1-20260830\4veco-platform`
- started_at: `2026-08-30T11:40:14.623Z`
- finished_at: `2026-08-30T11:40:15.178Z`
- duration_ms: `555`
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
- started_at: `2026-08-30T11:40:15.612Z`
- finished_at: `2026-08-30T11:40:15.727Z`
- duration_ms: `115`
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
- started_at: `2026-08-30T11:40:23.943Z`
- finished_at: `2026-08-30T11:40:24.038Z`
- duration_ms: `95`
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
- started_at: `2026-08-30T11:40:24.430Z`
- finished_at: `2026-08-30T11:40:25.065Z`
- duration_ms: `635`
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

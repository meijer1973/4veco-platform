# Sprint BUNDLE-LANE-CI-RELIABILITY-1: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-plan.md

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:07.988Z`
- finished_at: `2026-08-29T12:24:08.158Z`
- duration_ms: `170`
- exit_code: `0`
- stdout_sha256: `e1a01fe25daf04c8496d68906760f3c706b616bf04fc29fb5118faf4ef6149f6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\BUNDLE-LANE-CI-RELIABILITY-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:08.260Z`
- finished_at: `2026-08-29T12:24:08.506Z`
- duration_ms: `246`
- exit_code: `0`
- stdout_sha256: `604d14a05b81c590167b34652d024bcf1b11663d96012328b93af59c0e89dd45`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BUNDLE-LANE-CI-RELIABILITY-1 planned/active

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-bundle.test.js

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:08.553Z`
- finished_at: `2026-08-29T12:24:15.585Z`
- duration_ms: `7032`
- exit_code: `0`
- stdout_sha256: `a6e8762d156c5b828101c332bcfe002e7d3feaa5b62a561b816641d2a01d7d7c`
- stderr_sha256: `ce203d7d61f3ec948d78f3396fafd8917b7bb54f29bee95ac6a07020cb85a203`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/review-gates/integrate-authorized-bundle.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        6.192 s, estimated 8 s
Ran all test suites matching build-scripts/review-gates/integrate-authorized-bundle.test.js.

```
## npm.cmd run check:integration-lane

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:15.665Z`
- finished_at: `2026-08-29T12:24:56.262Z`
- duration_ms: `40597`
- exit_code: `0`
- stdout_sha256: `6e178c2e38186fd6ab8b54b4f97793a761682f48af136f7badc7215f23e752c7`
- stderr_sha256: `ddebb7475084dd58989666b62f317f65e2c08ba353fb57b7db48d0367a420e7b`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:integration-lane
> jest build-scripts/review-gates/check-human-payload-authorization.test.js build-scripts/review-gates/check-human-bundle-authorization.test.js build-scripts/review-gates/check-integration-lineage.test.js build-scripts/review-gates/check-integration-lane-capability.test.js build-scripts/review-gates/cross-repo-bundle-compatibility.test.js build-scripts/review-gates/apply-bundle-readiness-decision.test.js build-scripts/review-gates/integrate-authorized-pr.test.js build-scripts/review-gates/integrate-authorized-bundle.test.js build-scripts/review-gates/authorized-pr-integration-workflow.test.js build-scripts/review-gates/cross-repo-bundle-workflow.test.js --runInBand


```

### stderr excerpt

```text

Test Suites: 10 passed, 10 total
Tests:       227 passed, 227 total
Snapshots:   0 total
Time:        39.845 s
Ran all test suites matching build-scripts/review-gates/check-human-payload-authorization.test.js|build-scripts/review-gates/check-human-bundle-authorization.test.js|build-scripts/review-gates/check-integration-lineage.test.js|build-scripts/review-gates/check-integration-lane-capability.test.js|build-scripts/review-gates/cross-repo-bundle-compatibility.test.js|build-scripts/review-gates/apply-bundle-readiness-decision.test.js|build-scripts/review-gates/integrate-authorized-pr.test.js|build-scripts/review-gates/integrate-authorized-bundle.test.js|build-scripts/review-gates/authorized-pr-integration-workflow.test.js|build-scripts/review-gates/cross-repo-bundle-workflow.test.js.

```
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:56.339Z`
- finished_at: `2026-08-29T12:24:56.756Z`
- duration_ms: `417`
- exit_code: `0`
- stdout_sha256: `956a6745aef416e528bb49b3aa01b42be872d435a223386153e73f7fbcdd8068`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 5
  - build-scripts/review-gates/integrate-authorized-bundle.js
  - build-scripts/review-gates/integrate-authorized-bundle.test.js
  - docs/review/pr-integration-lane-policy.md
  - references/data/sprints/BUNDLE-LANE-CI-RELIABILITY-1.plan.json
  - references/reference-team-roadmap.md
- review evidence: 6
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-baseline.md
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-correction-log.md
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-lead-review-assignment.md
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-plan.md
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-planning-review.md
  - reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-result.md

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:24:56.797Z`
- finished_at: `2026-08-29T12:24:56.864Z`
- duration_ms: `67`
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

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:25:01.777Z`
- finished_at: `2026-08-29T12:30:21.079Z`
- duration_ms: `319302`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `147e2f7991e1bcab602941f76968dad1eb9d9978d651387339e86c5b8d948c2f`

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
Tests:       8 skipped, 1566 passed, 1574 total
Snapshots:   0 total
Time:        318.313 s, estimated 323 s
Ran all test suites.

```
## node build-scripts/sprints/check-lead-review-substance.js BUNDLE-LANE-CI-RELIABILITY-1

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:42:39.455Z`
- finished_at: `2026-08-29T12:42:39.560Z`
- duration_ms: `105`
- exit_code: `0`
- stdout_sha256: `bcea857c78defd190c61eb64c15b19e412a7ee728d6eb7277d560af3bddfd54a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: BUNDLE-LANE-CI-RELIABILITY-1

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1 --complete

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:43:43.825Z`
- finished_at: `2026-08-29T12:43:44.048Z`
- duration_ms: `223`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `d64eff1218a49ea1a1795a63fc378da64e6be82d347c66e45a12834acb6a8d7f`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint result check failed: passed command lacks command-log exit_code 0 evidence: node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1 --complete
Sprint bundle check failed: validator failed: node build-scripts\sprints\check-sprint-result.js reports\sprints\BUNDLE-LANE-CI-RELIABILITY-1-result.md

```
## node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1 --complete

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:43:57.213Z`
- finished_at: `2026-08-29T12:43:57.517Z`
- duration_ms: `304`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `d1567a7baa1eba7aedf15d8f59e5e1c29acb9d83588d1691acc9b464d0cdad6a`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\BUNDLE-LANE-CI-RELIABILITY-1-lead-review-assignment.md must identify sprint BUNDLE-LANE-CI-RELIABILITY-1

```
## node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1 --complete

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:44:20.378Z`
- finished_at: `2026-08-29T12:44:20.674Z`
- duration_ms: `296`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2ac7cce61214ea98ab24b6730d1dfae581cefef7c3b7b435f4c55bf628e6ae30`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\BUNDLE-LANE-CI-RELIABILITY-1-lead-review-round1.md Consolidated Verdict must include a verdict

```
## node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1 --complete

- cwd: `C:\Projects\4veco-worktrees\BUNDLE-LANE-CI-RELIABILITY-1-20260829\4veco-platform`
- started_at: `2026-08-29T12:44:30.699Z`
- finished_at: `2026-08-29T12:44:31.376Z`
- duration_ms: `677`
- exit_code: `0`
- stdout_sha256: `15dca37bdb15c30ff98895ce763d352bb72c8dffc33546e60383f8fca45655b7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BUNDLE-LANE-CI-RELIABILITY-1 complete

```

### stderr excerpt

```text

```

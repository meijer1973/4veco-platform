# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Command Log

## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:13:42.012Z`
- finished_at: `2026-08-23T16:16:19.063Z`
- duration_ms: `157051`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `0b98eb75f18ad16a9c6ad5ac8d16ecf9f7f051acbd9c95f461d2d395ac4fd753`

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

Test Suites: 6 skipped, 104 passed, 104 of 110 total
Tests:       8 skipped, 1451 passed, 1459 total
Snapshots:   0 total
Time:        156.106 s, estimated 196 s
Ran all test suites.

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:16:35.357Z`
- finished_at: `2026-08-23T16:16:35.487Z`
- duration_ms: `130`
- exit_code: `0`
- stdout_sha256: `d886b8bb693d07f8db0ba4e4b64efa6eecbb643a5fc087151fd456e8b52cb247`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md

```

### stderr excerpt

```text

```
## npx.cmd jest build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:16:35.746Z`
- finished_at: `2026-08-23T16:16:41.428Z`
- duration_ms: `5682`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ce39652cd01662a472c2be7dbb27e8d6be663e2e9b4dcc67b1824a59867fc619`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        4.486 s, estimated 5 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head HEAD --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:16:41.623Z`
- finished_at: `2026-08-23T16:17:13.420Z`
- duration_ms: `31797`
- exit_code: `0`
- stdout_sha256: `0a97ea3f4ce763dd0c90e6d6be45390f33fad4151f68c9940d446407b9aeb8ee`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head HEAD --allow-unbound-packet

{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "b7ec603880bcd8cc98c93526121ca71d3f31edcd",
  "head_sha": "ca50095fd01bed5332c427df82a1b13b6b0f437f",
  "scope_attestation_triggered": true,
  "changed_paths": [
    ".github/workflows/platform-ci.yml",
    "AGENT_GITHUB_ENTRY.md",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "build-scripts/sprints/emit-url-index.js",
    "docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "docs/roadmaps/roadmap-version-index.md",
    "package.json",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json",
    "references/reference-team-roadmap.md",
    "reports/github-agent-index-lessen.json",
    "reports/github-agent-index-lessen.md",
    "reports/github-agent-index-platform.json",
    "reports/github-agent-index-platform.md",
    "reports/internal-dashboard/dashboard-data.json",
    "reports/internal-dashboard/index.html",
    "reports/json/y1-golden-rollout-wave-1-proof.json",
    "reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round2.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_MAP.md"
  ],
  "screenshots_reusable": true,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:25:54.038Z`
- finished_at: `2026-08-23T16:25:54.503Z`
- duration_ms: `465`
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:25:59.696Z`
- finished_at: `2026-08-23T16:25:59.774Z`
- duration_ms: `78`
- exit_code: `0`
- stdout_sha256: `b6dcbffa98401f35bd80eae9f3565c5399a7c67e61e3305a71bec9d65deaf083`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
wrote reports/url-index.md

```

### stderr excerpt

```text

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:26:03.285Z`
- finished_at: `2026-08-23T16:26:03.838Z`
- duration_ms: `553`
- exit_code: `0`
- stdout_sha256: `757bd2d6c9fbb06eb4da2161c5029cec5768fbf029a1e1322cbfeda327d27b8c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 agent:index
> node build-scripts/reports/github-agent-index.js

Wrote reports\github-agent-index-platform.md
Wrote reports\github-agent-index-platform.json
Wrote reports\github-agent-index-lessen.md
Wrote reports\github-agent-index-lessen.json

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:26:10.570Z`
- finished_at: `2026-08-23T16:26:16.663Z`
- duration_ms: `6093`
- exit_code: `0`
- stdout_sha256: `4ec906cb678d5864ea5e7675f789ccbb7249bd1a2178b712ff7b61f816aa2728`
- stderr_sha256: `2fa43dd81c9d156d2179197cb278c549d4aa996c4164ddbcc52512b70433c5cc`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        5.126 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:26:22.513Z`
- finished_at: `2026-08-23T16:26:51.982Z`
- duration_ms: `29469`
- exit_code: `0`
- stdout_sha256: `c745e4150adbd30423a5e04d91a73a851da81f05098f35d8a0a2a947166c7c4b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "b7ec603880bcd8cc98c93526121ca71d3f31edcd",
  "head_sha": "28c1ac71b2514d2b1c9b01f998fb5bd4d3a2a8aa",
  "scope_attestation_triggered": true,
  "changed_paths": [
    ".github/workflows/platform-ci.yml",
    "AGENT_GITHUB_ENTRY.md",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "build-scripts/sprints/emit-url-index.js",
    "docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "docs/roadmaps/roadmap-version-index.md",
    "package.json",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json",
    "references/reference-team-roadmap.md",
    "reports/github-agent-index-lessen.json",
    "reports/github-agent-index-lessen.md",
    "reports/github-agent-index-platform.json",
    "reports/github-agent-index-platform.md",
    "reports/internal-dashboard/dashboard-data.json",
    "reports/internal-dashboard/index.html",
    "reports/json/y1-golden-rollout-wave-1-proof.json",
    "reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round2.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_MAP.md"
  ],
  "screenshots_reusable": true,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:27:00.254Z`
- finished_at: `2026-08-23T16:29:33.607Z`
- duration_ms: `153353`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `a3c792b6a269a001505953cf9d287e9b646500278007990d62a220c136d913dc`

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

Test Suites: 6 skipped, 104 passed, 104 of 110 total
Tests:       8 skipped, 1454 passed, 1462 total
Snapshots:   0 total
Time:        152.647 s, estimated 157 s
Ran all test suites.

```
## npm.cmd run check:exercise-workflow-currentness

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:29:38.772Z`
- finished_at: `2026-08-23T16:29:39.409Z`
- duration_ms: `637`
- exit_code: `0`
- stdout_sha256: `b005a2910b0a61d9062746983535bb4fae0ce424adfc1d74efdf20c7fa3b67f1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:exercise-workflow-currentness
> node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js

OK EXERCISE-WORKFLOW-CURRENTNESS stale-path/currentness sweep

```

### stderr excerpt

```text

```
## npm.cmd run check:scale-proof-3p-product-path

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:29:47.292Z`
- finished_at: `2026-08-23T16:29:47.649Z`
- duration_ms: `357`
- exit_code: `0`
- stdout_sha256: `a7f4fa61ebb03bad1599405e0a91d5f82ec5b7d64534aae761fef00227a46c2e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:scale-proof-3p-product-path
> node build-scripts/sprints/check-scale-proof-3p-readiness-product-path-proof-1.js

OK SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1 proof: scale_gate_1_ready_for_human_review

```

### stderr excerpt

```text

```
## npm.cmd run check:review-throughput -- --packet reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json --allow-unbound

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:29:52.467Z`
- finished_at: `2026-08-23T16:29:52.822Z`
- duration_ms: `355`
- exit_code: `1`
- stdout_sha256: `3d5bde180a239ac28bcf7c5067cbe88a45b86d93eee0046a01e7b26000f4e23d`
- stderr_sha256: `44738d6ff24bad873f6326870d553ed30a2e5e0d549d1a7e00bc8da17ec864ae`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js --packet reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json --allow-unbound


```

### stderr excerpt

```text
Review throughput packet check failed: unknown option: --packet

```
## npm.cmd run check:review-throughput -- reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:11.995Z`
- finished_at: `2026-08-23T16:30:12.341Z`
- duration_ms: `346`
- exit_code: `0`
- stdout_sha256: `4584566aaf38bc814f818adc1635aa41a6cc2401def04dad4576f63955543730`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

OK review throughput packet: Y1-GOLDEN-ROLLOUT-WAVE-1

```

### stderr excerpt

```text

```
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:16.635Z`
- finished_at: `2026-08-23T16:30:16.709Z`
- duration_ms: `74`
- exit_code: `0`
- stdout_sha256: `ddc392fd80a8b75d400fb30218bcef0a1c4d3ba105856f715a6a056670382e86`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK report JSON contract: 14 report(s)

```

### stderr excerpt

```text

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:21.326Z`
- finished_at: `2026-08-23T16:30:21.397Z`
- duration_ms: `71`
- exit_code: `0`
- stdout_sha256: `47ca50e8947f80026ba53efcebae98284df48a498a6f5e3501de52bb53df1380`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK roadmap version index: 152 entries

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:26.500Z`
- finished_at: `2026-08-23T16:30:26.569Z`
- duration_ms: `69`
- exit_code: `0`
- stdout_sha256: `4ce57d27d3afa3a1bb4f291eb152747379da6b1d2d2f5978c2978db6b8e2fea4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK url-index: reports/url-index.md is current

```

### stderr excerpt

```text

```
## npm.cmd run check:agent-index-freshness

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:32.403Z`
- finished_at: `2026-08-23T16:30:32.973Z`
- duration_ms: `570`
- exit_code: `0`
- stdout_sha256: `3cff05f7af5327d39ba8645f5618e3d204bcc35bbca016523704b83f562a22e7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:agent-index-freshness
> node build-scripts/reports/check-agent-index-freshness.js

{
  "ok": true,
  "checks": [
    {
      "label": "4veco-platform",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [],
      "source_commit": "28c1ac71b2514d2b1c9b01f998fb5bd4d3a2a8aa",
      "head": "28c1ac71b2514d2b1c9b01f998fb5bd4d3a2a8aa",
      "source_ref": "HEAD",
      "target_commit": "28c1ac71b2514d2b1c9b01f998fb5bd4d3a2a8aa",
      "accepted_parent_generated_tail": false,
      "accepted_generated_index_tail_ref": null
    },
    {
      "label": "4veco-lessen",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [],
      "source_commit": "96c0970f45739a8758cf7e932c6bce77806cd68d",
      "head": "96c0970f45739a8758cf7e932c6bce77806cd68d",
      "source_ref": "origin/main",
      "target_commit": "96c0970f45739a8758cf7e932c6bce77806cd68d",
      "accepted_parent_generated_tail": false,
      "accepted_generated_index_tail_ref": null
    }
  ],
  "failures": [],
  "warnings": []
}

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:37.825Z`
- finished_at: `2026-08-23T16:30:38.161Z`
- duration_ms: `336`
- exit_code: `0`
- stdout_sha256: `cc7769a6163a1c1d56bcba7238fbe19a9ef40e4fb3b1de5271c78cccb39bea79`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:scope-language
> node build-scripts/sprints/check-scope-language.js --active

OK scope-language check: active surfaces

```

### stderr excerpt

```text

```
## git diff --check HEAD

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:42.954Z`
- finished_at: `2026-08-23T16:30:43.062Z`
- duration_ms: `108`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git -C "C:\\Projects\\4veco-worktrees\\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\\4veco-lessen" diff --check

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:47.671Z`
- finished_at: `2026-08-23T16:30:47.743Z`
- duration_ms: `72`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npm.cmd run check:exercise-authority-hygiene

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:30:53.199Z`
- finished_at: `2026-08-23T16:30:53.623Z`
- duration_ms: `424`
- exit_code: `1`
- stdout_sha256: `97717507ba8c10686c5c6f511edf579847b44ff1b8b09c4492b0196a5fc8c96c`
- stderr_sha256: `590705de7d92a5818b387e3f3396600ffde23d538538ea8e22c572f2052bb753`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:exercise-authority-hygiene
> node build-scripts/sprints/check-exercise-authority-hygiene.js


```

### stderr excerpt

```text
EXERCISE-AUTHORITY-HYGIENE check failed: build-scripts/sprints/fixtures/golden-ticket-reference.html hash mismatch in manifest

```
## git diff --exit-code b7ec603880bcd8cc98c93526121ca71d3f31edcd..HEAD -- references/data/exercise-authority-hygiene-manifest.json build-scripts/sprints/fixtures/golden-ticket-reference.html reports/fixtures/golden-ticket-layout/golden-ticket-reference.html

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:31:04.333Z`
- finished_at: `2026-08-23T16:31:04.390Z`
- duration_ms: `57`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:33:46.355Z`
- finished_at: `2026-08-23T16:33:46.450Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `c3d89ad7151b7942a9a884a08212416db08cd690a45c7abf8588a73efcebc574`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1 --require-result-tests

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:34:54.911Z`
- finished_at: `2026-08-23T16:34:55.009Z`
- duration_ms: `98`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ffc4e7c3a69e14a3405230bdb7e63add5f0272a322d67d60a644e3bcf0e928d6`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint command-log check failed: references\data\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1.result.json passed command lacks command-log exit_code 0 evidence: git -C "C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-lessen" diff --check

```
## node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1 --require-result-tests

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:35:19.947Z`
- finished_at: `2026-08-23T16:35:20.011Z`
- duration_ms: `64`
- exit_code: `0`
- stdout_sha256: `18df32062a26266c649c151f3f8f01368e95ee4fc24793ce57d2996993f11c11`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: Y1-GOLDEN-ROLLOUT-WAVE-1 (25 entries)

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:42:39.736Z`
- finished_at: `2026-08-23T16:43:47.536Z`
- duration_ms: `67800`
- exit_code: `0`
- stdout_sha256: `4ec906cb678d5864ea5e7675f789ccbb7249bd1a2178b712ff7b61f816aa2728`
- stderr_sha256: `201dc452ff902ca22c0a6b988abd2aa710a9b0ddb53a400f4093938a45cc0923`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        67.021 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:43:54.295Z`
- finished_at: `2026-08-23T16:44:24.826Z`
- duration_ms: `30531`
- exit_code: `0`
- stdout_sha256: `51a53ad07afa652ede6d9e8db21175c44ac68fd90fd7b1b82096ad9e2246f97b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "b7ec603880bcd8cc98c93526121ca71d3f31edcd",
  "head_sha": "43067284194fc23a47780afb0bedad79eae1c03a",
  "scope_attestation_triggered": true,
  "changed_paths": [
    ".github/workflows/platform-ci.yml",
    "AGENT_GITHUB_ENTRY.md",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "build-scripts/sprints/emit-url-index.js",
    "docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "docs/roadmaps/roadmap-version-index.md",
    "package.json",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json",
    "references/reference-team-roadmap.md",
    "reports/github-agent-index-lessen.json",
    "reports/github-agent-index-lessen.md",
    "reports/github-agent-index-platform.json",
    "reports/github-agent-index-platform.md",
    "reports/internal-dashboard/dashboard-data.json",
    "reports/internal-dashboard/index.html",
    "reports/json/y1-golden-rollout-wave-1-proof.json",
    "reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round2.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_MAP.md"
  ],
  "screenshots_reusable": true,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:44:34.166Z`
- finished_at: `2026-08-23T16:44:34.745Z`
- duration_ms: `579`
- exit_code: `0`
- stdout_sha256: `757bd2d6c9fbb06eb4da2161c5029cec5768fbf029a1e1322cbfeda327d27b8c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 agent:index
> node build-scripts/reports/github-agent-index.js

Wrote reports\github-agent-index-platform.md
Wrote reports\github-agent-index-platform.json
Wrote reports\github-agent-index-lessen.md
Wrote reports\github-agent-index-lessen.json

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:44:39.240Z`
- finished_at: `2026-08-23T16:48:15.728Z`
- duration_ms: `216488`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `3f6dbc443e3dc6e0650205935927ed2cff04fa3e198722a1a954a630587a6929`

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

Test Suites: 6 skipped, 104 passed, 104 of 110 total
Tests:       8 skipped, 1454 passed, 1462 total
Snapshots:   0 total
Time:        215.725 s
Ran all test suites.

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:51:23.903Z`
- finished_at: `2026-08-23T16:51:24.122Z`
- duration_ms: `219`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `182e15e0dc7dd2bd86095b47bde7a7a37e7a5a80c6cbf52d47a11ef692d22989`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\data\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json must declare gate_id

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:52:46.685Z`
- finished_at: `2026-08-23T16:52:46.910Z`
- duration_ms: `225`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `29debcbf85ece50cde375237e6e7cbd0a7d42e8f65d7ebb1c0e0243aa2a3ace7`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md must start with "# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Baseline"

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:53:08.188Z`
- finished_at: `2026-08-23T16:53:08.417Z`
- duration_ms: `229`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9da00e92686ad525c9f11cae28e681a6331a12d732576a93ca4532f12b47f60f`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md missing assignment content: reviewer

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:53:17.846Z`
- finished_at: `2026-08-23T16:53:18.331Z`
- duration_ms: `485`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `6a8816934645ad8e29f0fac641bd21fc50034872ecf40f43c2981e575e33bad5`

### stdout excerpt

```text

```

### stderr excerpt

```text
check-bundle-urls: unexpected gate id format: Y1-GOLDEN-ROLLOUT-WAVE-1
Sprint bundle check failed: validator failed: node build-scripts\sprints\check-bundle-urls.js Y1-GOLDEN-ROLLOUT-WAVE-1

```
## node build-scripts/sprints/emit-gate-bundle-urls.js GATE-Y1-GOLDEN-ROLLOUT-WAVE-1

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:57:14.339Z`
- finished_at: `2026-08-23T16:57:14.420Z`
- duration_ms: `81`
- exit_code: `0`
- stdout_sha256: `c115a488de2a0bd29f9099effa4bc6510886ce50be25d5233cc324c77429bfc0`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
wrote reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/bundle-urls.md (2 artifacts)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:57:18.526Z`
- finished_at: `2026-08-23T16:57:18.613Z`
- duration_ms: `87`
- exit_code: `0`
- stdout_sha256: `b6dcbffa98401f35bd80eae9f3565c5399a7c67e61e3305a71bec9d65deaf083`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
wrote reports/url-index.md

```

### stderr excerpt

```text

```
## npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:57:24.145Z`
- finished_at: `2026-08-23T16:57:24.520Z`
- duration_ms: `375`
- exit_code: `0`
- stdout_sha256: `f4b5868f42465f4ae4c8d878580f34ab6be7ee0e491e86f78981926ec30beab4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

OK review throughput packet: Y1-GOLDEN-ROLLOUT-WAVE-1

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T16:57:29.601Z`
- finished_at: `2026-08-23T16:58:05.425Z`
- duration_ms: `35824`
- exit_code: `1`
- stdout_sha256: `4ec906cb678d5864ea5e7675f789ccbb7249bd1a2178b712ff7b61f816aa2728`
- stderr_sha256: `574be71723c6a2f2e957f54f68a4be4d6802a554a2093a606cb4aac77686b2fc`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text
FAIL build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js (34.988 s)
  ● Y1 Golden rollout wave real Git CLI scope attestation › full mode keeps state checks for unrelated work and rejects rendered-input drift

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      580 |       env: { Y1_GOLDEN_EVENT_BASE_SHA: base, Y1_GOLDEN_EVENT_HEAD_SHA: unrelatedHead },
      581 |     });
    > 582 |     expect(unrelated.status).toBe(0);
          |                              ^
      583 |     expect(unrelated.stdout).toMatch(/"scope_attestation_triggered": false/);
      584 |
      585 |     const renderedDriftHead = syntheticCommit(root, base, {

      at Object.toBe (build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js:582:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 22 passed, 23 total
Snapshots:   0 total
Time:        35.025 s, estimated 67 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:00:01.358Z`
- finished_at: `2026-08-23T17:00:37.916Z`
- duration_ms: `36558`
- exit_code: `1`
- stdout_sha256: `4ec906cb678d5864ea5e7675f789ccbb7249bd1a2178b712ff7b61f816aa2728`
- stderr_sha256: `d39744f5b59fdc9d064f54c27c35bc503afb0b06147d52f7e9d5b17de801618a`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text
FAIL build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js (35.549 s)
  ● Y1 Golden rollout wave real Git CLI scope attestation › full mode keeps state checks for unrelated work and rejects rendered-input drift

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      580 |       env: { Y1_GOLDEN_EVENT_BASE_SHA: base, Y1_GOLDEN_EVENT_HEAD_SHA: unrelatedHead },
      581 |     });
    > 582 |     expect(unrelated.status).toBe(0);
          |                              ^
      583 |     expect(unrelated.stdout).toMatch(/"scope_attestation_triggered": false/);
      584 |
      585 |     const renderedDriftHead = syntheticCommit(root, base, {

      at Object.toBe (build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js:582:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 22 passed, 23 total
Snapshots:   0 total
Time:        35.588 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:03:01.791Z`
- finished_at: `2026-08-23T17:03:01.944Z`
- duration_ms: `153`
- exit_code: `0`
- stdout_sha256: `b6dcbffa98401f35bd80eae9f3565c5399a7c67e61e3305a71bec9d65deaf083`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
wrote reports/url-index.md

```

### stderr excerpt

```text

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:03:11.070Z`
- finished_at: `2026-08-23T17:03:40.940Z`
- duration_ms: `29870`
- exit_code: `1`
- stdout_sha256: `42bedfa52762b7a840ad4a8c5e311845680de3bb949d06b30dc8fba2b4678bbd`
- stderr_sha256: `c0f6c0bd557553785a7a22aefc8d027cf908d402df91f18a98c50d9dd9087947`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet


```

### stderr excerpt

```text
Y1-GOLDEN-ROLLOUT-WAVE-1 check failed: platform agent index missing Y1 packet

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:03:46.990Z`
- finished_at: `2026-08-23T17:03:47.549Z`
- duration_ms: `559`
- exit_code: `0`
- stdout_sha256: `757bd2d6c9fbb06eb4da2161c5029cec5768fbf029a1e1322cbfeda327d27b8c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 agent:index
> node build-scripts/reports/github-agent-index.js

Wrote reports\github-agent-index-platform.md
Wrote reports\github-agent-index-platform.json
Wrote reports\github-agent-index-lessen.md
Wrote reports\github-agent-index-lessen.json

```

### stderr excerpt

```text

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:03:54.551Z`
- finished_at: `2026-08-23T17:04:24.760Z`
- duration_ms: `30209`
- exit_code: `0`
- stdout_sha256: `40749aaa6bcbbabdd1904c73bb47d56abfb8a116dec05538ac599b6821952685`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "b7ec603880bcd8cc98c93526121ca71d3f31edcd",
  "head_sha": "be4bd04fd7faee45e2faebfba552c3591c300e08",
  "scope_attestation_triggered": true,
  "changed_paths": [
    ".github/workflows/platform-ci.yml",
    "AGENT_GITHUB_ENTRY.md",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "build-scripts/sprints/emit-url-index.js",
    "docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "docs/roadmaps/roadmap-version-index.md",
    "package.json",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json",
    "references/reference-team-roadmap.md",
    "reports/github-agent-index-lessen.json",
    "reports/github-agent-index-lessen.md",
    "reports/github-agent-index-platform.json",
    "reports/github-agent-index-platform.md",
    "reports/internal-dashboard/dashboard-data.json",
    "reports/internal-dashboard/index.html",
    "reports/json/y1-golden-rollout-wave-1-proof.json",
    "reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/bundle-urls.md",
    "reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round2.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_MAP.md"
  ],
  "screenshots_reusable": true,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:04:29.934Z`
- finished_at: `2026-08-23T17:05:36.789Z`
- duration_ms: `66855`
- exit_code: `0`
- stdout_sha256: `4ec906cb678d5864ea5e7675f789ccbb7249bd1a2178b712ff7b61f816aa2728`
- stderr_sha256: `267035a6a3c87674ec1c5536b14c1282ed8f7da8fce4e88726b4661fe1da3aa2`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        66.03 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:05:41.881Z`
- finished_at: `2026-08-23T17:05:42.346Z`
- duration_ms: `465`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9ea6cc11bcd45e6d82bbdca809f6fe6816650c31d327f98fcb850d3b8b46b57f`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: an active roadmap sprint ledger must mark Y1-GOLDEN-ROLLOUT-WAVE-1 completed when --complete is used

```
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:06:59.420Z`
- finished_at: `2026-08-23T17:06:59.827Z`
- duration_ms: `407`
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
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:07:05.879Z`
- finished_at: `2026-08-23T17:07:06.608Z`
- duration_ms: `729`
- exit_code: `0`
- stdout_sha256: `757bd2d6c9fbb06eb4da2161c5029cec5768fbf029a1e1322cbfeda327d27b8c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 agent:index
> node build-scripts/reports/github-agent-index.js

Wrote reports\github-agent-index-platform.md
Wrote reports\github-agent-index-platform.json
Wrote reports\github-agent-index-lessen.md
Wrote reports\github-agent-index-lessen.json

```

### stderr excerpt

```text

```
## npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:07:13.587Z`
- finished_at: `2026-08-23T17:07:44.072Z`
- duration_ms: `30485`
- exit_code: `0`
- stdout_sha256: `be5f43a6124ec0bbdfb2c535b6bf98965bc944291184291d724fa8a758131769`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:y1-golden-rollout-wave-1
> node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head HEAD --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d --allow-unbound-packet

{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "b7ec603880bcd8cc98c93526121ca71d3f31edcd",
  "head_sha": "8b94538f805d8750469803280d9e935bd9a29b64",
  "scope_attestation_triggered": true,
  "changed_paths": [
    ".github/workflows/platform-ci.yml",
    "AGENT_GITHUB_ENTRY.md",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "build-scripts/sprints/emit-url-index.js",
    "docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "docs/roadmaps/roadmap-version-index.md",
    "package.json",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json",
    "references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json",
    "references/reference-team-roadmap.md",
    "reports/github-agent-index-lessen.json",
    "reports/github-agent-index-lessen.md",
    "reports/github-agent-index-platform.json",
    "reports/github-agent-index-platform.md",
    "reports/internal-dashboard/dashboard-data.json",
    "reports/internal-dashboard/index.html",
    "reports/json/y1-golden-rollout-wave-1-proof.json",
    "reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/bundle-urls.md",
    "reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round2.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_MAP.md"
  ],
  "screenshots_reusable": true,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823\4veco-platform`
- started_at: `2026-08-23T17:07:56.047Z`
- finished_at: `2026-08-23T17:07:56.555Z`
- duration_ms: `508`
- exit_code: `0`
- stdout_sha256: `992c103e14d9a3f9be97efae3f6ec83c2f7cd3c8138d34dc121487f6adcd93cc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: Y1-GOLDEN-ROLLOUT-WAVE-1 complete

```

### stderr excerpt

```text

```
## jest.cmd --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:56:10.812Z`
- finished_at: `2026-08-27T12:57:37.626Z`
- duration_ms: `86814`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `627dd2a046a71b85f12d7ac6b2adbeb9fd19f6b5c7d0455acb81b1c93d6b903a`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        86.247 s, estimated 94 s
Ran all test suites matching build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js.

```
## node build-scripts/sprints/check-y1-golden-rollout-wave-1.js --event-mode manual --scope-mode required --base 9c9d3cc7fa8e72d536e03af192f53f7079823dbe --head a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41 --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head f09fd6e88edc5049b026b16b0158e7e188091d2d

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:57:45.066Z`
- finished_at: `2026-08-27T12:58:16.433Z`
- duration_ms: `31367`
- exit_code: `0`
- stdout_sha256: `4f6e8a522609d438d9993b0ec7cb585f4f29d79c8fb03dac4b27ded443bfe1e6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "sprint_id": "Y1-GOLDEN-ROLLOUT-WAVE-1",
  "event_mode": "manual",
  "scope_mode": "required",
  "base_sha": "9c9d3cc7fa8e72d536e03af192f53f7079823dbe",
  "head_sha": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
  "scope_base_sha": "9c9d3cc7fa8e72d536e03af192f53f7079823dbe",
  "scope_head_sha": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
  "scope_attestation_triggered": true,
  "changed_paths": [
    "build-scripts/sprints/capture-y1-golden-rollout-wave-1-rendered-renewal.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.js",
    "build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js",
    "references/data/exercises/y1-golden-rollout-wave-1.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-assignment.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-corrections.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-round1.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan-review.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-source-manifest.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-visual-review.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven-pixel-diff.png",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven.png",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/comparison.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/manifest.json",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-visual-review.md",
    "reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-rendered-renewal.json"
  ],
  "screenshots_reusable": true,
  "verified_rendered_renewal_count": 1,
  "unresolved_changed_or_missing_input_count": 0,
  "rendered_inputs_unchanged_through_exact_head": true,
  "evidence_tail_paths": []
}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:58:37.810Z`
- finished_at: `2026-08-27T12:58:37.931Z`
- duration_ms: `121`
- exit_code: `0`
- stdout_sha256: `9654bc357ca2fdfd5964f1814d7e587b462c55a870a9ec0f81c25ed085e21e84`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md

```

### stderr excerpt

```text

```
## npm.cmd run check:exercise-workflow-currentness

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:58:38.282Z`
- finished_at: `2026-08-27T12:58:39.135Z`
- duration_ms: `853`
- exit_code: `0`
- stdout_sha256: `b005a2910b0a61d9062746983535bb4fae0ce424adfc1d74efdf20c7fa3b67f1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:exercise-workflow-currentness
> node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js

OK EXERCISE-WORKFLOW-CURRENTNESS stale-path/currentness sweep

```

### stderr excerpt

```text

```
## npm.cmd run check:exercise-authority-hygiene

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:58:39.403Z`
- finished_at: `2026-08-27T12:58:39.737Z`
- duration_ms: `334`
- exit_code: `1`
- stdout_sha256: `97717507ba8c10686c5c6f511edf579847b44ff1b8b09c4492b0196a5fc8c96c`
- stderr_sha256: `590705de7d92a5818b387e3f3396600ffde23d538538ea8e22c572f2052bb753`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:exercise-authority-hygiene
> node build-scripts/sprints/check-exercise-authority-hygiene.js


```

### stderr excerpt

```text
EXERCISE-AUTHORITY-HYGIENE check failed: build-scripts/sprints/fixtures/golden-ticket-reference.html hash mismatch in manifest

```
## npm.cmd run check:scale-proof-3p-product-path

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:58:55.350Z`
- finished_at: `2026-08-27T12:58:55.772Z`
- duration_ms: `422`
- exit_code: `0`
- stdout_sha256: `a7f4fa61ebb03bad1599405e0a91d5f82ec5b7d64534aae761fef00227a46c2e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:scale-proof-3p-product-path
> node build-scripts/sprints/check-scale-proof-3p-readiness-product-path-proof-1.js

OK SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1 proof: scale_gate_1_ready_for_human_review

```

### stderr excerpt

```text

```
## npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:58:56.141Z`
- finished_at: `2026-08-27T12:58:56.438Z`
- duration_ms: `297`
- exit_code: `1`
- stdout_sha256: `b0a3656db7bee4e9ff3947c9683741d3019b16962e7fa3af9ba76d872d0d6044`
- stderr_sha256: `fbcf5f3ca22c38b8ad876938b5bba9caffa038cf85c403aadeb67428531a9730`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json


```

### stderr excerpt

```text
Review throughput packet check failed: paired_prs requires a non-empty bundle_id

```
## npm.cmd run check:review-throughput -- reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:18.338Z`
- finished_at: `2026-08-27T12:59:18.740Z`
- duration_ms: `402`
- exit_code: `0`
- stdout_sha256: `f4b5868f42465f4ae4c8d878580f34ab6be7ee0e491e86f78981926ec30beab4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json

OK review throughput packet: Y1-GOLDEN-ROLLOUT-WAVE-1

```

### stderr excerpt

```text

```
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:19.100Z`
- finished_at: `2026-08-27T12:59:19.195Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `ddc392fd80a8b75d400fb30218bcef0a1c4d3ba105856f715a6a056670382e86`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK report JSON contract: 14 report(s)

```

### stderr excerpt

```text

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:19.546Z`
- finished_at: `2026-08-27T12:59:19.608Z`
- duration_ms: `62`
- exit_code: `0`
- stdout_sha256: `47ca50e8947f80026ba53efcebae98284df48a498a6f5e3501de52bb53df1380`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK roadmap version index: 152 entries

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:19.863Z`
- finished_at: `2026-08-27T12:59:19.931Z`
- duration_ms: `68`
- exit_code: `0`
- stdout_sha256: `4ce57d27d3afa3a1bb4f291eb152747379da6b1d2d2f5978c2978db6b8e2fea4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK url-index: reports/url-index.md is current

```

### stderr excerpt

```text

```
## npm.cmd run check:agent-index-freshness

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:20.193Z`
- finished_at: `2026-08-27T12:59:20.577Z`
- duration_ms: `384`
- exit_code: `0`
- stdout_sha256: `7b6c7cd80a41f0f5818f6e96329d2a6923a8d068d095946047bdd67626f33607`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:agent-index-freshness
> node build-scripts/reports/check-agent-index-freshness.js

{
  "ok": true,
  "checks": [
    {
      "label": "4veco-platform",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [],
      "source_commit": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
      "head": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
      "source_ref": "HEAD",
      "target_commit": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
      "accepted_parent_generated_tail": false,
      "accepted_generated_index_tail_ref": null
    },
    {
      "label": "4veco-lessen",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [],
      "source_commit": "f09fd6e88edc5049b026b16b0158e7e188091d2d",
      "head": "f09fd6e88edc5049b026b16b0158e7e188091d2d",
      "source_ref": "origin/main",
      "target_commit": "f09fd6e88edc5049b026b16b0158e7e188091d2d",
      "accepted_parent_generated_tail": false,
      "accepted_generated_index_tail_ref": null
    }
  ],
  "failures": [],
  "warnings": []
}

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:20.836Z`
- finished_at: `2026-08-27T12:59:21.175Z`
- duration_ms: `339`
- exit_code: `0`
- stdout_sha256: `cc7769a6163a1c1d56bcba7238fbe19a9ef40e4fb3b1de5271c78cccb39bea79`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:scope-language
> node build-scripts/sprints/check-scope-language.js --active

OK scope-language check: active surfaces

```

### stderr excerpt

```text

```
## npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:33.459Z`
- finished_at: `2026-08-27T12:59:33.915Z`
- duration_ms: `456`
- exit_code: `0`
- stdout_sha256: `7dee4cdddd0c3b7d6feced90a21c3e1ccc199b85e0097e2a55eee7572913ab59`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:paragraph-lane-scope
> node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

Paragraph lane scope: PASS (shared)
- shared platform: 4
  - build-scripts/sprints/capture-y1-golden-rollout-wave-1-rendered-renewal.js
  - build-scripts/sprints/check-y1-golden-rollout-wave-1.js
  - build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
  - references/data/exercises/y1-golden-rollout-wave-1.json
- review evidence: 13
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-assignment.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-corrections.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-lead-review-round1.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan-review.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-source-manifest.json
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-visual-review.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven-pixel-diff.png
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/112-normal-practice-desktop-light-opgaven.png
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/comparison.json
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots/manifest.json
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-visual-review.md
  - reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-rendered-renewal.json

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:34.254Z`
- finished_at: `2026-08-27T12:59:34.323Z`
- duration_ms: `69`
- exit_code: `0`
- stdout_sha256: `c3d89ad7151b7942a9a884a08212416db08cd690a45c7abf8588a73efcebc574`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\Y1-GOLDEN-ROLLOUT-WAVE-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T12:59:34.655Z`
- finished_at: `2026-08-27T12:59:35.028Z`
- duration_ms: `373`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `67d67641b716614f9add19c031d7c7851ffc1f3e041d3d145883c5ff1b374e89`

### stdout excerpt

```text

```

### stderr excerpt

```text
check-bundle-urls: URL points outside gate directory: https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json
Sprint bundle check failed: validator failed: node build-scripts\sprints\check-bundle-urls.js GATE-Y1-GOLDEN-ROLLOUT-WAVE-1

```
## node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:00:36.672Z`
- finished_at: `2026-08-27T13:00:37.213Z`
- duration_ms: `541`
- exit_code: `0`
- stdout_sha256: `992c103e14d9a3f9be97efae3f6ec83c2f7cd3c8138d34dc121487f6adcd93cc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: Y1-GOLDEN-ROLLOUT-WAVE-1 complete

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:00:37.559Z`
- finished_at: `2026-08-27T13:00:37.635Z`
- duration_ms: `76`
- exit_code: `0`
- stdout_sha256: `c4758a66ee14f7bec130a7c77093fab1114b702a0ca8eddc4873ee5b6c534f90`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: Y1-GOLDEN-ROLLOUT-WAVE-1 (66 entries)

```

### stderr excerpt

```text

```
## npm.cmd run finalization:freshness

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:00:37.969Z`
- finished_at: `2026-08-27T13:00:39.081Z`
- duration_ms: `1112`
- exit_code: `0`
- stdout_sha256: `34ee2b86d70760be363c1fa42523cd5f9ace579a53231026542a9e889341fcea`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 finalization:freshness
> node build-scripts/review-gates/finalization-freshness-proof.js

{
  "schema_version": 1,
  "generated_at_utc": "2026-08-27T13:00:38.984Z",
  "repository": "meijer1973/4veco-platform",
  "head_sha": "a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41",
  "remote": "origin",
  "remote_main_sha": "9c9d3cc7fa8e72d536e03af192f53f7079823dbe",
  "origin_main_sha": "9c9d3cc7fa8e72d536e03af192f53f7079823dbe",
  "remote_main_matches_origin_main": true,
  "remote_main_is_ancestor_of_head": true,
  "files": [
    {
      "path": "AGENTS.md",
      "working_tree_sha256": "665490473545d8b8469e675165cce2a6614d19d357e7b9b974f65f2f0b3db81b",
      "remote_main_sha256": "665490473545d8b8469e675165cce2a6614d19d357e7b9b974f65f2f0b3db81b"
    },
    {
      "path": "docs/review/pr-readiness-routing-policy.md",
      "working_tree_sha256": "0adc719b5e273c273a1f95a89a1837adfd5e79fb8ba10aace0f42c874b27f1a0",
      "remote_main_sha256": "0adc719b5e273c273a1f95a89a1837adfd5e79fb8ba10aace0f42c874b27f1a0"
    },
    {
      "path": "docs/review/pr-integration-lane-policy.md",
      "working_tree_sha256": "4afb80ebfedfeb50349c4ecbf37a2c4db3fbf165fa6abfb58302d3942d108d32",
      "remote_main_sha256": "4afb80ebfedfeb50349c4ecbf37a2c4db3fbf165fa6abfb58302d3942d108d32"
    }
  ]
}

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:00:45.973Z`
- finished_at: `2026-08-27T13:04:46.188Z`
- duration_ms: `240215`
- exit_code: `1`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `3171e9c75e59c6653d97348da8de353b3f90c1261c209dcfc848417261647d80`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:platform
> jest --runInBand


```

### stderr excerpt

```text
FAIL build-scripts/review-gates/pr-readiness-router.test.js
  ● Test suite failed to run

    Cannot find module 'ajv/dist/2020' from 'build-scripts/review-gates/pr-readiness-router.test.js'

      1 | const fs = require('fs');
      2 | const path = require('path');
    > 3 | const Ajv2020 = require('ajv/dist/2020');
        |                 ^
      4 | const addFormats = require('ajv-formats');
      5 | const {
      6 |   classifyPrReadiness,

      at Resolver._throwModNotFoundError (../../../4veco/4veco-platform/node_modules/jest-resolve/build/index.js:863:11)
      at Object.require (build-scripts/review-gates/pr-readiness-router.test.js:3:17)

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
FAIL engines/tests/presentation-v2-pptx-derivative.test.js
  ● Test suite failed to run

    Cannot find module 'jszip' from 'engines/tests/presentation-v2-pptx-derivative.test.js'

      3 | const path = require('path');
      4 | const { execFileSync } = require('child_process');
    > 5 | const JSZip = require('jszip');
        |               ^
      6 |
      7 | const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
      8 | const {

      at Resolver._throwModNotFoundError (../../../4veco/4veco-platform/node_modules/jest-resolve/build/index.js:863:11)
      at Object.require (engines/tests/presentation-v2-pptx-derivative.test.js:5:15)

FAIL engines/tests/newsdetective-v2-interaction.test.js
  ● Test suite failed to run

    Cannot find module 'jsdom' from 'engines/tests/newsdetective-v2-interaction.test.js'

      1 | const fs = require('fs');
      2 | const path = require('path');
    > 3 | const { JSDOM } = require('jsdom');
        |                   ^
      4 | const NewsDetectiveEngine = require('../newsdetective-engine');
      5 |
      6 | const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');

      at Resolver._throwModNotFoundError (../../../4veco/4veco-platform/node_modules/jest-resolve/build/index.js:863:11)
      at Object.require (engines/tests/newsdetective-v2-interaction.test.js:3:19)

FAIL engines/tests/golden-presentation-reference.test.js
  ● Test suite failed to run

    Cannot find module 'jsdom' from 'scripts/qa-presentation-web.js'

    Require stack:
      scripts/qa-presentation-web.js
      engines/tests/golden-presentation-reference.test.js

      2 | const fs = require('fs');
      3 | const path = require('path');
    > 4 | const { JSDOM } = require('jsdom');
        |                   ^
      5 |
      6
...[truncated 3376 chars]
```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:05:19.100Z`
- finished_at: `2026-08-27T13:09:37.303Z`
- duration_ms: `258203`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `3b9ef417f4aefcf26c0fa76f50e1dd4fda6b1e3857145df1e49c94a0fff3fe77`

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

Test Suites: 6 skipped, 104 passed, 104 of 110 total
Tests:       8 skipped, 1501 passed, 1509 total
Snapshots:   0 total
Time:        257.485 s
Ran all test suites.

```
## git diff --exit-code 9c9d3cc7fa8e72d536e03af192f53f7079823dbe..a86c617e0e9005c0bd75b0de9eb7163dd3f4fb41 -- references/data/exercise-authority-hygiene-manifest.json build-scripts/sprints/fixtures/golden-ticket-reference.html reports/fixtures/golden-ticket-layout/golden-ticket-reference.html

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:10:15.181Z`
- finished_at: `2026-08-27T13:10:15.254Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:10:15.612Z`
- finished_at: `2026-08-27T13:10:15.735Z`
- duration_ms: `123`
- exit_code: `2`
- stdout_sha256: `259116d65817ca82204ef36e1e37b4ac38020142965daf0995eafa8e46bfe780`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.md:2356: trailing whitespace.
+      6

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\y1-evidence-prerequisite-20260827\4veco-platform`
- started_at: `2026-08-27T13:10:34.559Z`
- finished_at: `2026-08-27T13:10:34.686Z`
- duration_ms: `127`
- exit_code: `2`
- stdout_sha256: `892c7c5cb8e6aa1dd77760d8c28e3830978d767119fbbf4a23813282e451099c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.md:2464: trailing whitespace.
++      6

```

### stderr excerpt

```text

```

# Sprint REVIEW-THROUGHPUT-3: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-3-plan.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:35:53.711Z`
- finished_at: `2026-06-22T10:35:54.000Z`
- duration_ms: `289`
- exit_code: `0`
- stdout_sha256: `a76e72ccd6f1c5ba4ad9c8e8257446ce9453fea7f8872f2dbedf5a51edd151b1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\REVIEW-THROUGHPUT-3-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:35:53.803Z`
- finished_at: `2026-06-22T10:35:54.229Z`
- duration_ms: `426`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `5773b90cc27e047a586a2a4f7f7185d9243811177144b1ccca9495704c8fa23d`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\data\sprints\REVIEW-THROUGHPUT-3.plan.json must declare gate_id

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-3-plan.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:36:22.435Z`
- finished_at: `2026-06-22T10:36:22.598Z`
- duration_ms: `163`
- exit_code: `0`
- stdout_sha256: `a76e72ccd6f1c5ba4ad9c8e8257446ce9453fea7f8872f2dbedf5a51edd151b1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\REVIEW-THROUGHPUT-3-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:36:22.475Z`
- finished_at: `2026-06-22T10:36:22.759Z`
- duration_ms: `284`
- exit_code: `0`
- stdout_sha256: `b938d361dc65d7c3b79c08b86d522254a3a7eef0b0b4fc7ecb680a4f66542289`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 planned/active

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:46:39.089Z`
- finished_at: `2026-06-22T10:46:39.159Z`
- duration_ms: `70`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e7f598dcdd4342ca3de37aef073a8f9bf9d1423c49067584d8b3a8dbcc46fdae`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:internal/modules/cjs/loader:1451
  throw err;
  ^

Error: Cannot find module 'C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform\node_modules\jest\bin\jest.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1448:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1059:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1064:22)
    at Module._load (node:internal/modules/cjs/loader:1234:25)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.13.1

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:08.691Z`
- finished_at: `2026-06-22T10:47:13.948Z`
- duration_ms: `5257`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `41a92742db8d02d2fc4a9090f51ea8f5647bd3f167144a5dd7f935fba42d5e28`

### stdout excerpt

```text

```

### stderr excerpt

```text
FAIL build-scripts/review-gates/pr-readiness-router.test.js
  ● pr-readiness-router › classifies l2-owner-preapproved-ready.json

    expect(received).toBe(expected) // Object.is equality

    Expected: "READY_FOR_LEAD_ONLY"
    Received: "KEEP_DRAFT_REVISE"

    [0m [90m 43 |[39m     [36mconst[39m decision [33m=[39m classifyPrReadiness(fixture)[33m;[39m
     [90m 44 |[39m
    [31m[1m>[22m[39m[90m 45 |[39m     expect(decision[33m.[39mroute)[33m.[39mtoBe(fixture[33m.[39mexpected_route)[33m;[39m
     [90m    |[39m                            [31m[1m^[22m[39m
     [90m 46 |[39m     expect(validateDecision(decision))[33m.[39mtoBe([36mtrue[39m)[33m;[39m
     [90m 47 |[39m     [36mif[39m (fixture[33m.[39mexpected_reason) {
     [90m 48 |[39m       expect(decision[33m.[39mreason_codes)[33m.[39mtoContain(fixture[33m.[39mexpected_reason)[33m;[39m[0m

      at toBe (build-scripts/review-gates/pr-readiness-router.test.js:45:28)


Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 44 passed, 45 total
Snapshots:   0 total
Time:        3.304 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:31.927Z`
- finished_at: `2026-06-22T10:47:34.513Z`
- duration_ms: `2586`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `f51e5f42ce2e056a6fc19d2017f06fde333af04962ecf72777ff64c369b8de82`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        1.651 s, estimated 4 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:45.982Z`
- finished_at: `2026-06-22T10:47:46.091Z`
- duration_ms: `109`
- exit_code: `0`
- stdout_sha256: `83e206120b5faab506ae68c1ad2de7f3e4108a049f2a408b05415d386867f822`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:45.982Z`
- finished_at: `2026-06-22T10:47:46.094Z`
- duration_ms: `112`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:46.014Z`
- finished_at: `2026-06-22T10:47:46.124Z`
- duration_ms: `110`
- exit_code: `0`
- stdout_sha256: `a93d324092bbf1fa6a8471dbf000d8bce494baac5dee6acd646d5808ea018619`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`


```

### stderr excerpt

```text

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:45.966Z`
- finished_at: `2026-06-22T10:47:47.540Z`
- duration_ms: `1574`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `48ed442fdf2ffe960be19c4a64d8eaf9bf2b0fc5c2ed896fd2aefc127a466aae`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        0.372 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:47:52.327Z`
- finished_at: `2026-06-22T10:47:53.657Z`
- duration_ms: `1330`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:48:56.033Z`
- finished_at: `2026-06-22T10:48:58.237Z`
- duration_ms: `2204`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `cbed4edd722f872e462ea1431acd4219b964fdd0263436c141d15f155e2b6b1a`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        1.461 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 52 --format json --output-json reports/sprints/REVIEW-THROUGHPUT-3-live-pr52-decision.json --quiet

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:50:02.877Z`
- finished_at: `2026-06-22T10:50:04.335Z`
- duration_ms: `1458`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 132 --format json --output-json reports/sprints/REVIEW-THROUGHPUT-3-live-pr132-decision.json --output-markdown reports/sprints/REVIEW-THROUGHPUT-3-live-pr132-decision.md --quiet

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:50:02.807Z`
- finished_at: `2026-06-22T10:50:04.594Z`
- duration_ms: `1787`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 42 --format json --output-json reports/sprints/REVIEW-THROUGHPUT-3-live-pr42-decision.json --quiet

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:50:02.799Z`
- finished_at: `2026-06-22T10:50:04.738Z`
- duration_ms: `1939`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 48 --format json --output-json reports/sprints/REVIEW-THROUGHPUT-3-live-pr48-decision.json --quiet

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:50:02.778Z`
- finished_at: `2026-06-22T10:50:04.839Z`
- duration_ms: `2061`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 133 --format json --output-json reports/sprints/REVIEW-THROUGHPUT-3-live-pr133-decision.json --quiet

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:50:23.887Z`
- finished_at: `2026-06-22T10:50:25.732Z`
- duration_ms: `1845`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:51:53.620Z`
- finished_at: `2026-06-22T10:51:53.753Z`
- duration_ms: `133`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:51:53.795Z`
- finished_at: `2026-06-22T10:51:54.494Z`
- duration_ms: `699`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:51:53.536Z`
- finished_at: `2026-06-22T10:51:54.579Z`
- duration_ms: `1043`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:52:05.154Z`
- finished_at: `2026-06-22T10:52:05.280Z`
- duration_ms: `126`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:52:05.173Z`
- finished_at: `2026-06-22T10:52:05.289Z`
- duration_ms: `116`
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
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:52:05.184Z`
- finished_at: `2026-06-22T10:52:05.309Z`
- duration_ms: `125`
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
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:52:05.141Z`
- finished_at: `2026-06-22T10:52:05.732Z`
- duration_ms: `591`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:52:10.222Z`
- finished_at: `2026-06-22T10:52:39.768Z`
- duration_ms: `29546`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `775d9026ec406f5592e343816469890b69f636c7b5674712e8270291dca4483b`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       87 skipped, 773 passed, 860 total
Snapshots:   0 total
Time:        28.451 s
Ran all test suites.

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-3-plan.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:39.714Z`
- finished_at: `2026-06-22T10:54:39.918Z`
- duration_ms: `204`
- exit_code: `0`
- stdout_sha256: `a76e72ccd6f1c5ba4ad9c8e8257446ce9453fea7f8872f2dbedf5a51edd151b1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\REVIEW-THROUGHPUT-3-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:39.839Z`
- finished_at: `2026-06-22T10:54:40.169Z`
- duration_ms: `330`
- exit_code: `0`
- stdout_sha256: `b938d361dc65d7c3b79c08b86d522254a3a7eef0b0b4fc7ecb680a4f66542289`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 planned/active

```

### stderr excerpt

```text

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:39.865Z`
- finished_at: `2026-06-22T10:54:42.625Z`
- duration_ms: `2760`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `ed473ab3e0e9d21298914ad79103075a8de3384cde2adb7a4c7bc823c80602a5`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        0.596 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:39.845Z`
- finished_at: `2026-06-22T10:54:43.421Z`
- duration_ms: `3576`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `06e94ee2089d66cd7f9240dbb30c0c05fa7a887a1db7d369ae41526db09b6ab5`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.461 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:54.654Z`
- finished_at: `2026-06-22T10:54:54.806Z`
- duration_ms: `152`
- exit_code: `0`
- stdout_sha256: `a93d324092bbf1fa6a8471dbf000d8bce494baac5dee6acd646d5808ea018619`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`


```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:54.676Z`
- finished_at: `2026-06-22T10:54:54.814Z`
- duration_ms: `138`
- exit_code: `0`
- stdout_sha256: `83e206120b5faab506ae68c1ad2de7f3e4108a049f2a408b05415d386867f822`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:54.751Z`
- finished_at: `2026-06-22T10:54:54.881Z`
- duration_ms: `130`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:54:54.727Z`
- finished_at: `2026-06-22T10:54:56.170Z`
- duration_ms: `1443`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:05.878Z`
- finished_at: `2026-06-22T10:55:06.008Z`
- duration_ms: `130`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:05.988Z`
- finished_at: `2026-06-22T10:55:06.146Z`
- duration_ms: `158`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:05.901Z`
- finished_at: `2026-06-22T10:55:07.785Z`
- duration_ms: `1884`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:05.854Z`
- finished_at: `2026-06-22T10:55:08.090Z`
- duration_ms: `2236`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:17.836Z`
- finished_at: `2026-06-22T10:55:17.931Z`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:17.866Z`
- finished_at: `2026-06-22T10:55:17.955Z`
- duration_ms: `89`
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
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:17.832Z`
- finished_at: `2026-06-22T10:55:18.244Z`
- duration_ms: `412`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:55:23.802Z`
- finished_at: `2026-06-22T10:56:12.422Z`
- duration_ms: `48620`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `c330170dc9e387e8696f0db6e0a41d96ac40246dababf59699e2a4d73405bede`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       87 skipped, 773 passed, 860 total
Snapshots:   0 total
Time:        47.118 s
Ran all test suites.

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T10:56:53.982Z`
- finished_at: `2026-06-22T10:56:54.105Z`
- duration_ms: `123`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:10.529Z`
- finished_at: `2026-06-22T11:07:12.378Z`
- duration_ms: `1849`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `fba942df8733db13752e544178406f4f5a034cbbd78ffa3d15b91702d568c8f6`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        1.203 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:28.056Z`
- finished_at: `2026-06-22T11:07:28.151Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `a93d324092bbf1fa6a8471dbf000d8bce494baac5dee6acd646d5808ea018619`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`


```

### stderr excerpt

```text

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:28.025Z`
- finished_at: `2026-06-22T11:07:29.584Z`
- duration_ms: `1559`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `7acda3d41ef41b43a470525f624e9a982b647207e473ce50c5ae5b129bbb7393`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        0.261 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 132 --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:28.062Z`
- finished_at: `2026-06-22T11:07:30.076Z`
- duration_ms: `2014`
- exit_code: `0`
- stdout_sha256: `ce4f4f7ce0436275a76809913d94ce0d4fff848128a8fca32f3bc1195b52ccdf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 132,
    "url": "https://github.com/meijer1973/4veco-platform/pull/132",
    "base": "main",
    "head_sha": "2ddac5b189ce3406d280d8d883841165d337e307",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "KEEP_DRAFT_REVISE",
  "reason_codes": [
    "checker_proof_missing_or_not_successful",
    "lead_review_missing_or_not_passing"
  ],
  "proof": {
    "ci_head_sha": "2ddac5b189ce3406d280d8d883841165d337e307",
    "ci_status": "success",
    "lead_review_path": null,
    "lead_review_result": null,
    "lead_reviewed_sha": null,
    "changed_paths_verified": true,
    "checkers": [],
    "branch_protection": {}
  },
  "allowed_transition": "NONE",
  "human_notification_required": false,
  "corrections": [
    "checker_proof_missing_or_not_successful",
    "lead_review_missing_or_not_passing"
  ],
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 133 --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:28.045Z`
- finished_at: `2026-06-22T11:07:30.739Z`
- duration_ms: `2694`
- exit_code: `0`
- stdout_sha256: `7baf75afb7f3759a6fe04f4f5b7cc16a07405b68340bc711ddd72fdcc09aa6a3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 133,
    "url": "https://github.com/meijer1973/4veco-platform/pull/133",
    "base": "main",
    "head_sha": "839b22904dbff40815e75be4780844ee11e53acf",
    "was_draft": false
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "KEEP_DRAFT_REVISE",
  "reason_codes": [
    "pr_not_open",
    "checker_proof_missing_or_not_successful",
    "lead_review_missing_or_not_passing"
  ],
  "proof": {
    "ci_head_sha": "839b22904dbff40815e75be4780844ee11e53acf",
    "ci_status": "success",
    "lead_review_path": null,
    "lead_review_result": null,
    "lead_reviewed_sha": null,
    "changed_paths_verified": true,
    "checkers": [],
    "branch_protection": {}
  },
  "allowed_transition": "NONE",
  "human_notification_required": false,
  "corrections": [
    "pr_not_open",
    "checker_proof_missing_or_not_successful",
    "lead_review_missing_or_not_passing"
  ],
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:43.519Z`
- finished_at: `2026-06-22T11:07:43.614Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:43.517Z`
- finished_at: `2026-06-22T11:07:43.632Z`
- duration_ms: `115`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:07:43.568Z`
- finished_at: `2026-06-22T11:07:44.982Z`
- duration_ms: `1414`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:08.092Z`
- finished_at: `2026-06-22T11:08:08.179Z`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:08.106Z`
- finished_at: `2026-06-22T11:08:08.681Z`
- duration_ms: `575`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:08.094Z`
- finished_at: `2026-06-22T11:08:08.939Z`
- duration_ms: `845`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:46.302Z`
- finished_at: `2026-06-22T11:08:46.460Z`
- duration_ms: `158`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:46.326Z`
- finished_at: `2026-06-22T11:08:46.480Z`
- duration_ms: `154`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:46.634Z`
- finished_at: `2026-06-22T11:08:46.763Z`
- duration_ms: `129`
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
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:46.175Z`
- finished_at: `2026-06-22T11:08:47.097Z`
- duration_ms: `922`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:08:55.203Z`
- finished_at: `2026-06-22T11:09:42.975Z`
- duration_ms: `47772`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `2cae63c184edc4c7a0a5313c90c0a427bc9b3e15d9a23031d12ff9ac6588704f`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       87 skipped, 776 passed, 863 total
Snapshots:   0 total
Time:        46.443 s
Ran all test suites.

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-3-plan.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:15:32.179Z`
- finished_at: `2026-06-22T11:15:32.295Z`
- duration_ms: `116`
- exit_code: `0`
- stdout_sha256: `a76e72ccd6f1c5ba4ad9c8e8257446ce9453fea7f8872f2dbedf5a51edd151b1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\REVIEW-THROUGHPUT-3-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:15:38.820Z`
- finished_at: `2026-06-22T11:15:39.002Z`
- duration_ms: `182`
- exit_code: `0`
- stdout_sha256: `b938d361dc65d7c3b79c08b86d522254a3a7eef0b0b4fc7ecb680a4f66542289`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 planned/active

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:15:51.686Z`
- finished_at: `2026-06-22T11:15:53.401Z`
- duration_ms: `1715`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `28b106bcb3f5f2b87dcc59b5fcaf6902471a1470be53395c8014351ec86ab47c`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        1.046 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:01.787Z`
- finished_at: `2026-06-22T11:16:02.931Z`
- duration_ms: `1144`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `ef2e2d3795c5358368a58d47d8df01e035eb25f085536fd42eaeebd1b57e3b92`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        0.253 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:08.053Z`
- finished_at: `2026-06-22T11:16:09.188Z`
- duration_ms: `1135`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:14.011Z`
- finished_at: `2026-06-22T11:16:14.081Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `83e206120b5faab506ae68c1ad2de7f3e4108a049f2a408b05415d386867f822`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:17.639Z`
- finished_at: `2026-06-22T11:16:17.703Z`
- duration_ms: `64`
- exit_code: `0`
- stdout_sha256: `a93d324092bbf1fa6a8471dbf000d8bce494baac5dee6acd646d5808ea018619`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`


```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:21.632Z`
- finished_at: `2026-06-22T11:16:21.699Z`
- duration_ms: `67`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:27.662Z`
- finished_at: `2026-06-22T11:16:28.016Z`
- duration_ms: `354`
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
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:33.912Z`
- finished_at: `2026-06-22T11:16:33.983Z`
- duration_ms: `71`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `eae7f83aba624fa8ef4f01d4697c34d545fffc6565a9b3f242faa20cdd10f828`

### stdout excerpt

```text

```

### stderr excerpt

```text
Lead-review substance check failed: reports\sprints\REVIEW-THROUGHPUT-3-lead-review-round1.md cites missing output artifact: reports/sprints/REVIEW-THROUGHPUT-3-live-pr*-decision.*

```
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:16:56.911Z`
- finished_at: `2026-06-22T11:16:56.983Z`
- duration_ms: `72`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:17:04.427Z`
- finished_at: `2026-06-22T11:17:43.286Z`
- duration_ms: `38859`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `3f57e31c59b67ce6d77e116bd543d2e2d235355f7522212109ec78c274044c33`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 776 passed, 857 total
Snapshots:   0 total
Time:        37.917 s, estimated 44 s
Ran all test suites.

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:25.987Z`
- finished_at: `2026-06-22T11:20:26.731Z`
- duration_ms: `744`
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:30.367Z`
- finished_at: `2026-06-22T11:20:30.440Z`
- duration_ms: `73`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:34.111Z`
- finished_at: `2026-06-22T11:20:34.179Z`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:43.655Z`
- finished_at: `2026-06-22T11:20:44.150Z`
- duration_ms: `495`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:47.345Z`
- finished_at: `2026-06-22T11:20:47.414Z`
- duration_ms: `69`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:50.619Z`
- finished_at: `2026-06-22T11:20:50.706Z`
- duration_ms: `87`
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
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:20:57.945Z`
- finished_at: `2026-06-22T11:20:58.023Z`
- duration_ms: `78`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:07.138Z`
- finished_at: `2026-06-22T11:21:07.238Z`
- duration_ms: `100`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:10.872Z`
- finished_at: `2026-06-22T11:21:10.942Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `c4ca39a993290ccd521da66662aaea67717d4964f4d97578b7bfd13bbe54292c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (79 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:14.954Z`
- finished_at: `2026-06-22T11:21:15.017Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:19.288Z`
- finished_at: `2026-06-22T11:21:19.539Z`
- duration_ms: `251`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c09c69f88d71c91857c3979714c43bd4415e3c4e393d2192ea817d27a0579708`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\REVIEW-THROUGHPUT-3-lead-review-round1.md Blocking Findings must explicitly state whether blockers exist

```
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:31.547Z`
- finished_at: `2026-06-22T11:21:31.618Z`
- duration_ms: `71`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:21:35.640Z`
- finished_at: `2026-06-22T11:21:36.076Z`
- duration_ms: `436`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:22:00.081Z`
- finished_at: `2026-06-22T11:22:00.171Z`
- duration_ms: `90`
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
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:22:03.700Z`
- finished_at: `2026-06-22T11:22:03.770Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `5b9a0a88f4847d6bdbe4660cf48fa67a6910b1c2832e696f3199e1f571b4548c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (85 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:22:07.581Z`
- finished_at: `2026-06-22T11:22:07.650Z`
- duration_ms: `69`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:22:11.823Z`
- finished_at: `2026-06-22T11:22:12.317Z`
- duration_ms: `494`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T11:22:15.736Z`
- finished_at: `2026-06-22T11:22:15.817Z`
- duration_ms: `81`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:22.231Z`
- finished_at: `2026-06-22T12:42:23.910Z`
- duration_ms: `1679`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `7d6fb5f7d17527d1d7d622b0ee1e97858002f62c072fb02a1fd99be084658ddc`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       69 passed, 69 total
Snapshots:   0 total
Time:        1.121 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:35.622Z`
- finished_at: `2026-06-22T12:42:36.960Z`
- duration_ms: `1338`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `5ca236a6c41c9465f642cfa8ce4f1b4a9483f63eee3be6d68e330a2a836474ab`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        0.387 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:42.006Z`
- finished_at: `2026-06-22T12:42:42.075Z`
- duration_ms: `69`
- exit_code: `0`
- stdout_sha256: `daed40594f3446a81931fbf35bcb4c8ffa954f4edc0d4eaab2a883ed29720c19`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "ci_required_contexts": [
      "validate-platform"
    ],
    "ci_missing_contexts": [],
    "ci_checks": [
      {
        "name": "validate-platform",
        "conclusion": "SUCCESS"
      }
    ],
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "post_lead_review_changed_paths": [],
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:46.539Z`
- finished_at: `2026-06-22T12:42:46.615Z`
- duration_ms: `76`
- exit_code: `0`
- stdout_sha256: `a43a0262aeefd018038480e0814f78c946de0d191357b1f710bdd894e80d6f03`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`

## Proof Summary

- CI head: `3434343434343434343434343434343434343434`
- CI status: `success`
- Required CI contexts: `validate-platform`
- Checker proof: `npm.cmd run check:pr-readiness:passed`
- Lead review: `reports/sprints/LIVE-GOV-lead-review-round2.md` / `PASS` at `3434343434343434343434343434343434343434`
- Evidence-only tail allowed: `false`
- Branch protection: `{}`


```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:52.041Z`
- finished_at: `2026-06-22T12:42:52.121Z`
- duration_ms: `80`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:42:56.888Z`
- finished_at: `2026-06-22T12:42:57.359Z`
- duration_ms: `471`
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
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:43:05.007Z`
- finished_at: `2026-06-22T12:43:06.215Z`
- duration_ms: `1208`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:43:10.801Z`
- finished_at: `2026-06-22T12:43:10.866Z`
- duration_ms: `65`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:43:16.535Z`
- finished_at: `2026-06-22T12:43:36.104Z`
- duration_ms: `19569`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `2ecdb26112db70f202000119814ebc5e04dbf5f3f61bbae326dd6d97a6b5ac13`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 797 passed, 878 total
Snapshots:   0 total
Time:        18.575 s, estimated 36 s
Ran all test suites.

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:17.026Z`
- finished_at: `2026-06-22T12:45:17.661Z`
- duration_ms: `635`
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:21.546Z`
- finished_at: `2026-06-22T12:45:21.640Z`
- duration_ms: `94`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:26.692Z`
- finished_at: `2026-06-22T12:45:27.145Z`
- duration_ms: `453`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:31.292Z`
- finished_at: `2026-06-22T12:45:31.377Z`
- duration_ms: `85`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:38.207Z`
- finished_at: `2026-06-22T12:45:38.301Z`
- duration_ms: `94`
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
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:45.570Z`
- finished_at: `2026-06-22T12:45:45.641Z`
- duration_ms: `71`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:50.759Z`
- finished_at: `2026-06-22T12:45:50.825Z`
- duration_ms: `66`
- exit_code: `0`
- stdout_sha256: `846c856db3ef06f1caf1489888ae2f5e39d8ed1ed9a72780183b37e09c09e15c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (104 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:55.723Z`
- finished_at: `2026-06-22T12:45:55.788Z`
- duration_ms: `65`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:45:59.623Z`
- finished_at: `2026-06-22T12:46:00.155Z`
- duration_ms: `532`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:46:03.872Z`
- finished_at: `2026-06-22T12:46:03.955Z`
- duration_ms: `83`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:29.348Z`
- finished_at: `2026-06-22T12:57:30.935Z`
- duration_ms: `1587`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `558302281b56718c1e3cabd8b19e568bacbb719148bfe85b94e50db730f4415d`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       74 passed, 74 total
Snapshots:   0 total
Time:        1.065 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:38.827Z`
- finished_at: `2026-06-22T12:57:40.037Z`
- duration_ms: `1210`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `68ad2a816d50e7dae4f19076aa605ef041ce541bfccbd6921db3dbeaccf5c3b8`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        0.303 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:43.922Z`
- finished_at: `2026-06-22T12:57:43.985Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `daed40594f3446a81931fbf35bcb4c8ffa954f4edc0d4eaab2a883ed29720c19`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "ci_required_contexts": [
      "validate-platform"
    ],
    "ci_missing_contexts": [],
    "ci_checks": [
      {
        "name": "validate-platform",
        "conclusion": "SUCCESS"
      }
    ],
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "post_lead_review_changed_paths": [],
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:48.091Z`
- finished_at: `2026-06-22T12:57:48.157Z`
- duration_ms: `66`
- exit_code: `0`
- stdout_sha256: `a43a0262aeefd018038480e0814f78c946de0d191357b1f710bdd894e80d6f03`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`

## Proof Summary

- CI head: `3434343434343434343434343434343434343434`
- CI status: `success`
- Required CI contexts: `validate-platform`
- Checker proof: `npm.cmd run check:pr-readiness:passed`
- Lead review: `reports/sprints/LIVE-GOV-lead-review-round2.md` / `PASS` at `3434343434343434343434343434343434343434`
- Evidence-only tail allowed: `false`
- Branch protection: `{}`


```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:52.863Z`
- finished_at: `2026-06-22T12:57:52.934Z`
- duration_ms: `71`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:57:57.057Z`
- finished_at: `2026-06-22T12:57:57.401Z`
- duration_ms: `344`
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
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:00.769Z`
- finished_at: `2026-06-22T12:58:01.980Z`
- duration_ms: `1211`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:07.686Z`
- finished_at: `2026-06-22T12:58:08.301Z`
- duration_ms: `615`
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:13.557Z`
- finished_at: `2026-06-22T12:58:13.619Z`
- duration_ms: `62`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:31.239Z`
- finished_at: `2026-06-22T12:58:31.315Z`
- duration_ms: `76`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:35.772Z`
- finished_at: `2026-06-22T12:58:36.169Z`
- duration_ms: `397`
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
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:58:40.418Z`
- finished_at: `2026-06-22T12:58:57.605Z`
- duration_ms: `17187`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `45ba11726e108d74ad04ce2e6da5193c4da352902ce6864c85529e8fb5c8c553`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 802 passed, 883 total
Snapshots:   0 total
Time:        16.318 s, estimated 18 s
Ran all test suites.

```
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:11.837Z`
- finished_at: `2026-06-22T12:59:11.896Z`
- duration_ms: `59`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:15.379Z`
- finished_at: `2026-06-22T12:59:15.453Z`
- duration_ms: `74`
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
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3 --review-file reports/sprints/REVIEW-THROUGHPUT-3-lead-review-round3.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:19.995Z`
- finished_at: `2026-06-22T12:59:20.099Z`
- duration_ms: `104`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:26.933Z`
- finished_at: `2026-06-22T12:59:27.007Z`
- duration_ms: `74`
- exit_code: `0`
- stdout_sha256: `85015e2d4780fa6e590dd8c53dc2c93e326efa9d842d9ff81f1a1c2a401e35a6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (123 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:31.103Z`
- finished_at: `2026-06-22T12:59:31.176Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:37.938Z`
- finished_at: `2026-06-22T12:59:38.456Z`
- duration_ms: `518`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T12:59:44.536Z`
- finished_at: `2026-06-22T12:59:44.620Z`
- duration_ms: `84`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:05:13.533Z`
- finished_at: `2026-06-22T13:05:15.303Z`
- duration_ms: `1770`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `3a41342d2415a619b28c7295b53d9f36fa562c8b31d73548e3c0f12b7d30b814`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       75 passed, 75 total
Snapshots:   0 total
Time:        1.251 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:05:19.014Z`
- finished_at: `2026-06-22T13:05:20.294Z`
- duration_ms: `1280`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `085b41bd9a39750c691d6f129f9c5622ac6d7140b31605a7ce685c593a697fb5`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        0.297 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:05:26.412Z`
- finished_at: `2026-06-22T13:05:43.709Z`
- duration_ms: `17297`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `40fb053198b109097521cc6feba0bfd9540f3c89e8093aacaf1825ab82acae0b`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 803 passed, 884 total
Snapshots:   0 total
Time:        16.335 s, estimated 19 s
Ran all test suites.

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:05:58.018Z`
- finished_at: `2026-06-22T13:05:58.700Z`
- duration_ms: `682`
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
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:04.198Z`
- finished_at: `2026-06-22T13:06:04.275Z`
- duration_ms: `77`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:09.098Z`
- finished_at: `2026-06-22T13:06:09.165Z`
- duration_ms: `67`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:14.593Z`
- finished_at: `2026-06-22T13:06:15.054Z`
- duration_ms: `461`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:21.388Z`
- finished_at: `2026-06-22T13:06:21.452Z`
- duration_ms: `64`
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:29.279Z`
- finished_at: `2026-06-22T13:06:29.375Z`
- duration_ms: `96`
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
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3 --review-file reports/sprints/REVIEW-THROUGHPUT-3-lead-review-round4.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:34.687Z`
- finished_at: `2026-06-22T13:06:34.752Z`
- duration_ms: `65`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:39.604Z`
- finished_at: `2026-06-22T13:06:39.683Z`
- duration_ms: `79`
- exit_code: `0`
- stdout_sha256: `e552b76d4f48d21ff6d59c2a04614559f9132f759b2de532ce12562728db6d10`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (137 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:44.794Z`
- finished_at: `2026-06-22T13:06:44.867Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:49.123Z`
- finished_at: `2026-06-22T13:06:49.637Z`
- duration_ms: `514`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:06:54.229Z`
- finished_at: `2026-06-22T13:06:54.332Z`
- duration_ms: `103`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:14:15.508Z`
- finished_at: `2026-06-22T13:14:17.116Z`
- duration_ms: `1608`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `71e7e326836c90b99419a3bd07a1d75aaadc752dccd8d31d5177f1c9a38faccd`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       75 passed, 75 total
Snapshots:   0 total
Time:        1.02 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:14:21.731Z`
- finished_at: `2026-06-22T13:14:22.889Z`
- duration_ms: `1158`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `643ae3b2608e1b15213be258d19e1ebdf2c3efda793c923b3da5e77b22a05188`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        0.308 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:14:28.650Z`
- finished_at: `2026-06-22T13:14:47.899Z`
- duration_ms: `19249`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `178c8d8bfd372f5be50d237151fe1a721a79f1ad27ffc592eccec4d04a0eab23`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 803 passed, 884 total
Snapshots:   0 total
Time:        18.437 s
Ran all test suites.

```
## npm.cmd run agent:index

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:14:55.195Z`
- finished_at: `2026-06-22T13:14:55.807Z`
- duration_ms: `612`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:15:04.244Z`
- finished_at: `2026-06-22T13:15:04.327Z`
- duration_ms: `83`
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
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:15:12.141Z`
- finished_at: `2026-06-22T13:15:12.220Z`
- duration_ms: `79`
- exit_code: `0`
- stdout_sha256: `ecd75283c54ac84129dabadcb4273907ba665ef88a35642a609da6a75eeac5f9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (146 entries)

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T13:15:18.542Z`
- finished_at: `2026-06-22T13:15:18.650Z`
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
## node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:01.581Z`
- finished_at: `2026-06-22T14:05:03.362Z`
- duration_ms: `1781`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `860418ba29cb33a4eb818ccadd5c8a4937f61f422f3f76e9a43b9e5a904a3ebb`

### stdout excerpt

```text

```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        1.121 s, estimated 2 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js|build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```
## npm.cmd run check:pr-readiness

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:07.482Z`
- finished_at: `2026-06-22T14:05:08.606Z`
- duration_ms: `1124`
- exit_code: `0`
- stdout_sha256: `7e481cf83a00965efebcac5878938e88306b7e69b0ff89e2c2422f3cecc32131`
- stderr_sha256: `575cb506466d8a2df24a234f28c98ec58c3c8cb384b87483b00705549ce028e2`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:pr-readiness
> jest build-scripts/review-gates/pr-readiness-router.test.js --runInBand


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        0.261 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/pr-readiness-router.test.js.

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:14.922Z`
- finished_at: `2026-06-22T14:05:14.992Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `daed40594f3446a81931fbf35bcb4c8ffa954f4edc0d4eaab2a883ed29720c19`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "schema_version": 1,
  "reviewed_pr": {
    "repo": "meijer1973/4veco-platform",
    "number": 111,
    "url": "https://github.com/meijer1973/4veco-platform/pull/111",
    "base": "main",
    "head_sha": "1212121212121212121212121212121212121212",
    "was_draft": true
  },
  "throughput": {
    "class": "normal_sprint",
    "authority_class": "standard",
    "level": "L1"
  },
  "human_review_payload": "none",
  "consequence": "low",
  "batching": {
    "viable": false,
    "target": null,
    "reason": null
  },
  "route": "READY_FOR_LEAD_ONLY",
  "reason_codes": [
    "current_head_ci_green",
    "lead_review_pass",
    "no_human_authority"
  ],
  "proof": {
    "ci_head_sha": "1212121212121212121212121212121212121212",
    "ci_status": "success",
    "ci_required_contexts": [
      "validate-platform"
    ],
    "ci_missing_contexts": [],
    "ci_checks": [
      {
        "name": "validate-platform",
        "conclusion": "SUCCESS"
      }
    ],
    "lead_review_path": "reports/sprints/LIVE-L1-lead-review-round2.md",
    "lead_review_result": "PASS",
    "lead_reviewed_sha": "1212121212121212121212121212121212121212",
    "lead_review_evidence_tail_allowed": false,
    "post_lead_review_changed_paths": [],
    "changed_paths_verified": true,
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "branch_protection": {}
  },
  "allowed_transition": "MARK_READY",
  "human_notification_required": false,
  "escalation_signals": []
}

```

### stderr excerpt

```text

```
## node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:22.598Z`
- finished_at: `2026-06-22T14:05:22.656Z`
- duration_ms: `58`
- exit_code: `0`
- stdout_sha256: `a43a0262aeefd018038480e0814f78c946de0d191357b1f710bdd894e80d6f03`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
<!-- 4veco-pr-readiness:meijer1973/4veco-platform:112:3434343434343434343434343434343434343434 -->
# PR Readiness Decision

- Route: `READY_FOR_HUMAN_REVIEW`
- Allowed transition: `MARK_READY`
- Repository: `meijer1973/4veco-platform`
- PR: #112
- Reviewed head: `3434343434343434343434343434343434343434`
- Throughput level: `L4`
- Human-review payload: `consequential_exception`
- Human notification required: `true`

## Reason Codes

- `human_authority_consequential_exception`
- `review_autonomy_governance_change`

## Proof Summary

- CI head: `3434343434343434343434343434343434343434`
- CI status: `success`
- Required CI contexts: `validate-platform`
- Checker proof: `npm.cmd run check:pr-readiness:passed`
- Lead review: `reports/sprints/LIVE-GOV-lead-review-round2.md` / `PASS` at `3434343434343434343434343434343434343434`
- Evidence-only tail allowed: `false`
- Branch protection: `{}`


```

### stderr excerpt

```text

```
## node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:29.099Z`
- finished_at: `2026-06-22T14:05:29.158Z`
- duration_ms: `59`
- exit_code: `0`
- stdout_sha256: `11130259eeb2afca02f338bcafb7256c8c80552679f431a29bdbbfac84a1d914`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "dry_run": true,
  "route": "READY_FOR_LEAD_ONLY",
  "allowed_transition": "MARK_READY",
  "marker": "<!-- 4veco-pr-readiness:meijer1973/4veco-platform:120:5656565656565656565656565656565656565656 -->",
  "comment_action": "would_create_comment",
  "transition_action": "would_mark_ready"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:branch-protection

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:33.431Z`
- finished_at: `2026-06-22T14:05:34.547Z`
- duration_ms: `1116`
- exit_code: `0`
- stdout_sha256: `f2730e9c812cbf4653ba03f42d4e23855f3e1046c7e6424096fc04df2b5676f0`
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
    "enforce_admins": true,
    "allow_force_pushes": false,
    "allow_deletions": false
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
    "required_pull_request_reviews": {
      "available": true,
      "required": true,
      "required_approving_review_count": 1,
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

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:05:39.493Z`
- finished_at: `2026-06-22T14:05:59.144Z`
- duration_ms: `19651`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `fedb9698e8b91c8584f1611204f63504359c2743e0d44c3f4c0380040773017e`

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

Test Suites: 15 skipped, 50 passed, 50 of 65 total
Tests:       81 skipped, 808 passed, 889 total
Snapshots:   0 total
Time:        18.589 s, estimated 19 s
Ran all test suites.

```
## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3 --review-file reports/sprints/REVIEW-THROUGHPUT-3-lead-review-round7.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:06:13.161Z`
- finished_at: `2026-06-22T14:06:13.220Z`
- duration_ms: `59`
- exit_code: `0`
- stdout_sha256: `b74b97ac0b1b1ac2a43a532f66a271102156a721026e64ccdbc132d52d04ec32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: REVIEW-THROUGHPUT-3

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:06:17.982Z`
- finished_at: `2026-06-22T14:06:18.052Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `ef7e10812c18126c755f100e9b10a6c34408e60a3e0c33b840f0de5b8f22b6f0`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: REVIEW-THROUGHPUT-3 (156 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:06:22.595Z`
- finished_at: `2026-06-22T14:06:22.658Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `e1180796079c35fff7dd0c2bc6dec03645036c4058e4f3d26073d3273fce4d82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-3-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete

- cwd: `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`
- started_at: `2026-06-22T14:06:26.665Z`
- finished_at: `2026-06-22T14:06:27.139Z`
- duration_ms: `474`
- exit_code: `0`
- stdout_sha256: `272781273515a993691b51538e4490b6f39ef4c7a05b4150164c91611a2ede38`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: REVIEW-THROUGHPUT-3 complete

```

### stderr excerpt

```text

```

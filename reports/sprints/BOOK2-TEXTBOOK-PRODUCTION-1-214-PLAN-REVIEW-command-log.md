# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW: Command Log

## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-probes.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:14.717Z`
- finished_at: `2026-09-06T01:02:19.592Z`
- duration_ms: `4875`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2fe98500d757680804bd68747c718e5ac10357abbe605ee3e09a7d38e6b0d6ec`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:assert:152
  throw new AssertionError(obj);
  ^

AssertionError [ERR_ASSERTION]: Exact crossing money
+ actual - expected

+ 171.42857142857144
- 171.42857142857142
                   ^

    at eq (C:\wt\book2-214-plan-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-probes.js:14:30)
    at Object.<anonymous> (C:\wt\book2-214-plan-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-probes.js:74:1)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 171.42857142857144,
  expected: 171.42857142857142,
  operator: 'deepStrictEqual',
  diff: 'simple'
}

Node.js v24.13.1

```
## node build-scripts/workflows/check-book-outline-currentness.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:20.379Z`
- finished_at: `2026-09-06T01:02:22.392Z`
- duration_ms: `2013`
- exit_code: `0`
- stdout_sha256: `853f95b103f377ced893df892e46c0922cbd89d74099a1c5979b31c0f4b9b24e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: structural-currentness

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action specialist_review --paragraph 2.1.4

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:22.435Z`
- finished_at: `2026-09-06T01:02:24.184Z`
- duration_ms: `1749`
- exit_code: `0`
- stdout_sha256: `57311de082a3b7434c35c5dea51c7b8d062cac4cb4dfba01f762320479914dba`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.4

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:24.224Z`
- finished_at: `2026-09-06T01:02:24.807Z`
- duration_ms: `583`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:24.854Z`
- finished_at: `2026-09-06T01:02:25.285Z`
- duration_ms: `431`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-probes.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:02:37.063Z`
- finished_at: `2026-09-06T01:02:37.941Z`
- duration_ms: `878`
- exit_code: `0`
- stdout_sha256: `ddd23ec60215dca69e460ced6ad669654089c49719e34ae462e925c670465f26`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "verdict": "REVISE",
  "checks": 100,
  "negative_design_probes": 17,
  "plan_lines": 621,
  "plan_sha256": "e36f2afe357b36e2db8a1efb360ca2bf32571fb6e2c10e3564ced875f4fcd323",
  "preserved_files": 1855,
  "core_minutes": 54,
  "source_css_pt": 25.5,
  "placed_pt": 13.332283464566931,
  "output": "C:\\wt\\book2-214-plan-review-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-evidence.json"
}

```

### stderr excerpt

```text

```

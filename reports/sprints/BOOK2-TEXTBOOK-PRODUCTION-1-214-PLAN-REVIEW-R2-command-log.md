# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2: Command Log

## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-probes.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:40:49.366Z`
- finished_at: `2026-09-06T01:40:52.791Z`
- duration_ms: `3425`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ea87bf039f7a7a32db7ce1748873e4ee2ffbe6b0310c0bdfca3c6890119c7549`

### stdout excerpt

```text

```

### stderr excerpt

```text
BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-bounded-independent-replay.js:115
const altered=structuredClone(record);altered.target_exercise.sources[1].rows[0][1]='€2.601';reject('synchronized changed source/hash vs independently frozen hash',sha(JSON.stringify(altered)),recordHash);
              ^

ReferenceError: structuredClone is not defined
    at BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-bounded-independent-replay.js:115:15
    at Script.runInContext (node:vm:149:12)
    at Script.runInNewContext (node:vm:154:17)
    at Object.runInNewContext (node:vm:310:38)
    at Object.<anonymous> (C:\wt\book2-214-plan-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-probes.js:68:4)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-probes.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:41:14.054Z`
- finished_at: `2026-09-06T01:41:17.018Z`
- duration_ms: `2964`
- exit_code: `0`
- stdout_sha256: `03b146e78082d5df27ab6614cc76b6fec2e55776a5986d3b71a1a709181960d1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "verdict": "PASS_WITH_FLAGS",
  "r2_checks": 33,
  "replayed_independent_checks": 100,
  "replayed_counterexamples": 17,
  "plan_sha256": "a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4",
  "lines": 621,
  "changed_lines": 17,
  "other_lesson_files_unchanged": 1854,
  "placed_pt": 15.685039370078742
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js

- cwd: `C:\wt\book2-214-plan-review-20260906\4veco-platform`
- started_at: `2026-09-06T01:41:17.062Z`
- finished_at: `2026-09-06T01:41:18.939Z`
- duration_ms: `1877`
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
- started_at: `2026-09-06T01:41:18.983Z`
- finished_at: `2026-09-06T01:41:20.818Z`
- duration_ms: `1835`
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
- started_at: `2026-09-06T01:41:20.868Z`
- finished_at: `2026-09-06T01:41:21.489Z`
- duration_ms: `621`
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
- started_at: `2026-09-06T01:41:21.532Z`
- finished_at: `2026-09-06T01:41:21.746Z`
- duration_ms: `214`
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

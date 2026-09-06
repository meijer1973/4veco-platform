# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2: Command Log

## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-probes.js

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:20:49.275Z`
- finished_at: `2026-09-06T01:20:52.181Z`
- duration_ms: `2906`
- exit_code: `0`
- stdout_sha256: `a9765643ab66b61a04e404dbd65e8c1f952a4895709bf2cdc09ab8dc93b0dd24`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS_AUTHOR_CHECKS_ONLY",
  "original_checks": 118,
  "r2_checks": 41,
  "plan": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md",
  "plan_sha256": "a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4",
  "plan_lines": 621,
  "changed_lines": [
    3,
    276,
    518,
    519,
    520,
    524,
    525,
    547,
    550,
    551,
    552,
    591,
    592,
    593,
    594,
    595,
    596
  ],
  "unchanged_other_lesson_files": 1854,
  "placed_pt": 15.685039370078742,
  "independent_recheck": "PENDING paragraph_224_builder"
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:21:05.557Z`
- finished_at: `2026-09-06T01:21:07.528Z`
- duration_ms: `1971`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action goal_design --paragraph 2.1.4

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:21:08.317Z`
- finished_at: `2026-09-06T01:21:09.853Z`
- duration_ms: `1536`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.4

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:21:10.285Z`
- finished_at: `2026-09-06T01:21:11.808Z`
- duration_ms: `1523`
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

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:21:12.565Z`
- finished_at: `2026-09-06T01:21:13.104Z`
- duration_ms: `539`
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

- cwd: `C:\wt\book2-214-production-20260906\4veco-platform`
- started_at: `2026-09-06T01:21:13.862Z`
- finished_at: `2026-09-06T01:21:14.034Z`
- duration_ms: `172`
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

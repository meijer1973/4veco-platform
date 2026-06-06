# Sprint CI-LF-HARDEN-1: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-LF-HARDEN-1-plan.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:06.385Z`
- finished_at: `2026-06-06T13:22:06.522Z`
- duration_ms: `137`
- exit_code: `0`
- stdout_sha256: `71ff351caa4ea9bb06ea91433e244fded86ef08fdac3529c3f965e6ca0f3b990`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\CI-LF-HARDEN-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:13.754Z`
- finished_at: `2026-06-06T13:22:14.008Z`
- duration_ms: `254`
- exit_code: `0`
- stdout_sha256: `24e938a9805fec017629f545b401ea86899ed7a36aaa88d18efe3fc91c576cf0`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-LF-HARDEN-1 planned/active

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:38:21.818Z`
- finished_at: `2026-06-06T14:38:42.676Z`
- duration_ms: `20858`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `2449489a9790397acdf657c09c9563409cc97275a5e0d5a87c5e4ab501ae9409`

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

Test Suites: 6 skipped, 45 passed, 45 of 51 total
Tests:       8 skipped, 698 passed, 706 total
Snapshots:   0 total
Time:        20.029 s
Ran all test suites.

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:17.804Z`
- finished_at: `2026-06-06T14:39:18.019Z`
- duration_ms: `215`
- exit_code: `0`
- stdout_sha256: `c53819b4a26ebf9447ab0d91fc42abba7d4c5abc56ce222243956eda738a47ce`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 38 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:41:30.383Z`
- finished_at: `2026-06-06T14:41:31.014Z`
- duration_ms: `631`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:41:42.886Z`
- finished_at: `2026-06-06T14:41:42.971Z`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:41:54.256Z`
- finished_at: `2026-06-06T14:41:54.403Z`
- duration_ms: `147`
- exit_code: `0`
- stdout_sha256: `7891f5b32abb5c84ee2c44a575345b2c73331bde9726c963e39ff37c5196585f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK roadmap version index: 147 entries

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:42:04.851Z`
- finished_at: `2026-06-06T14:42:04.999Z`
- duration_ms: `148`
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
## git diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:42:16.427Z`
- finished_at: `2026-06-06T14:42:16.627Z`
- duration_ms: `200`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2ec30656efa3b17db90ca937ca4a8b499e45fd0bd03f558b456fba7e27bf00c4`

### stdout excerpt

```text

```

### stderr excerpt

```text
warning: in the working copy of '.gitattributes', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it

```
## git diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:42:57.152Z`
- finished_at: `2026-06-06T14:42:57.276Z`
- duration_ms: `124`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:43:10.120Z`
- finished_at: `2026-06-06T14:43:10.215Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:43:31.120Z`
- finished_at: `2026-06-06T14:43:31.362Z`
- duration_ms: `242`
- exit_code: `0`
- stdout_sha256: `ae5d3fa00a78f0c0eb858f426b60367d99d905837e7fcbf8dd96daa70450ed32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 46 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## npx.cmd jest --runInBand build-scripts/ci/check-evidence-line-endings.test.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:43:51.496Z`
- finished_at: `2026-06-06T14:43:54.022Z`
- duration_ms: `2526`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `71a80fc66c7929825cf17c25fc0798c1eee8b028f256935de0e54055a9d7aadd`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.555 s, estimated 1 s
Ran all test suites matching build-scripts/ci/check-evidence-line-endings.test.js.

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:10.665Z`
- finished_at: `2026-06-06T14:44:10.774Z`
- duration_ms: `109`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:10.627Z`
- finished_at: `2026-06-06T14:44:11.458Z`
- duration_ms: `831`
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
## npm.cmd run dashboard:internal

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:10.693Z`
- finished_at: `2026-06-06T14:44:11.595Z`
- duration_ms: `902`
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
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:24.445Z`
- finished_at: `2026-06-06T14:44:24.616Z`
- duration_ms: `171`
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
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:24.423Z`
- finished_at: `2026-06-06T14:44:24.685Z`
- duration_ms: `262`
- exit_code: `0`
- stdout_sha256: `ae5d3fa00a78f0c0eb858f426b60367d99d905837e7fcbf8dd96daa70450ed32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 46 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:35.658Z`
- finished_at: `2026-06-06T14:44:35.795Z`
- duration_ms: `137`
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
## git diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:47.426Z`
- finished_at: `2026-06-06T14:44:47.560Z`
- duration_ms: `134`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:59.125Z`
- finished_at: `2026-06-06T14:44:59.229Z`
- duration_ms: `104`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-LF-HARDEN-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:45:10.783Z`
- finished_at: `2026-06-06T14:45:10.879Z`
- duration_ms: `96`
- exit_code: `0`
- stdout_sha256: `683f2949142e3f060f6137547c067bf91682c499316e674603734235744247ef`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-LF-HARDEN-1 (21 entries)

```

### stderr excerpt

```text

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:48:11.038Z`
- finished_at: `2026-06-06T14:48:11.161Z`
- duration_ms: `123`
- exit_code: `0`
- stdout_sha256: `1ca2d7ad269bcc0f1bfae487d41d28475801664221a3b323958645a3009553d4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 47 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-lead-review-substance.js CI-LF-HARDEN-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:21.640Z`
- finished_at: `2026-06-06T14:51:21.759Z`
- duration_ms: `119`
- exit_code: `0`
- stdout_sha256: `c18c90b17078452df8486cc04a016eb46256b737c977887d79f49eefcdb2faff`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: CI-LF-HARDEN-1

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-LF-HARDEN-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:32.919Z`
- finished_at: `2026-06-06T14:51:33.018Z`
- duration_ms: `99`
- exit_code: `0`
- stdout_sha256: `39a1f389876ca2afa6a3731b6162c80448840b4b15b927ec775858fe8d0e2286`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-LF-HARDEN-1 (24 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-LF-HARDEN-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:44.538Z`
- finished_at: `2026-06-06T14:51:44.663Z`
- duration_ms: `125`
- exit_code: `0`
- stdout_sha256: `f306f64204869a596de8d4996f3c6e8c3ed7ba182a37723ebbf394239d8cce32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-LF-HARDEN-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:56.284Z`
- finished_at: `2026-06-06T14:51:56.754Z`
- duration_ms: `470`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `dd94899f3fced455dc1e30caa4f09c14535e473845a505b47fb710875cbc20ca`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\data\sprints\CI-LF-HARDEN-1.result.json lead_review.flags[0] must be an object

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-LF-HARDEN-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:42.001Z`
- finished_at: `2026-06-06T14:52:42.115Z`
- duration_ms: `114`
- exit_code: `0`
- stdout_sha256: `f306f64204869a596de8d4996f3c6e8c3ed7ba182a37723ebbf394239d8cce32`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-LF-HARDEN-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:52.312Z`
- finished_at: `2026-06-06T14:52:53.076Z`
- duration_ms: `764`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `a4f93ec0fe20c93647720cfb7c3318ce3e459f7a69e1ac25981fe23722c02f5d`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\reference-team-roadmap.md must mark CI-LF-HARDEN-1 completed when --complete is used

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:30.821Z`
- finished_at: `2026-06-06T14:53:30.943Z`
- duration_ms: `122`
- exit_code: `0`
- stdout_sha256: `7891f5b32abb5c84ee2c44a575345b2c73331bde9726c963e39ff37c5196585f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK roadmap version index: 147 entries

```

### stderr excerpt

```text

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:41.630Z`
- finished_at: `2026-06-06T14:53:42.285Z`
- duration_ms: `655`
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
## node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:53.645Z`
- finished_at: `2026-06-06T14:53:54.550Z`
- duration_ms: `905`
- exit_code: `0`
- stdout_sha256: `f5fd3677916a20df4c292ad86185e2392a21eb2ee72e4d6fa61888e08f80a0c1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-LF-HARDEN-1 complete

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:54:51.295Z`
- finished_at: `2026-06-06T14:54:51.366Z`
- duration_ms: `71`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:54:51.297Z`
- finished_at: `2026-06-06T14:54:51.681Z`
- duration_ms: `384`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:54:51.276Z`
- finished_at: `2026-06-06T14:54:51.772Z`
- duration_ms: `496`
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
## git diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:16.860Z`
- finished_at: `2026-06-06T14:55:16.932Z`
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
## git diff --cached --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:16.904Z`
- finished_at: `2026-06-06T14:55:17.009Z`
- duration_ms: `105`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:16.843Z`
- finished_at: `2026-06-06T14:55:17.013Z`
- duration_ms: `170`
- exit_code: `0`
- stdout_sha256: `0b9708fa8e90622efcdbd5d5244aa595714badb9a27819cc13f065790d4d07ad`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 68 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:17.041Z`
- finished_at: `2026-06-06T14:55:17.109Z`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:27.181Z`
- finished_at: `2026-06-06T14:55:27.263Z`
- duration_ms: `82`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:27.192Z`
- finished_at: `2026-06-06T14:55:27.313Z`
- duration_ms: `121`
- exit_code: `0`
- stdout_sha256: `7891f5b32abb5c84ee2c44a575345b2c73331bde9726c963e39ff37c5196585f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK roadmap version index: 147 entries

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-LF-HARDEN-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:39.545Z`
- finished_at: `2026-06-06T14:55:40.486Z`
- duration_ms: `941`
- exit_code: `0`
- stdout_sha256: `f5fd3677916a20df4c292ad86185e2392a21eb2ee72e4d6fa61888e08f80a0c1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-LF-HARDEN-1 complete

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:56:13.314Z`
- finished_at: `2026-06-06T14:56:41.931Z`
- duration_ms: `28617`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `7c1c6c98ae4afac03b244016e28d1855375e8896002bca5d4300a7ab1a31f830`

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

Test Suites: 6 skipped, 45 passed, 45 of 51 total
Tests:       8 skipped, 698 passed, 706 total
Snapshots:   0 total
Time:        27.313 s
Ran all test suites.

```
## git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:56:56.330Z`
- finished_at: `2026-06-06T14:56:56.434Z`
- duration_ms: `104`
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

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:56:56.334Z`
- finished_at: `2026-06-06T14:56:56.455Z`
- duration_ms: `121`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git diff --cached --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:56:56.355Z`
- finished_at: `2026-06-06T14:56:56.499Z`
- duration_ms: `144`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:56:56.341Z`
- finished_at: `2026-06-06T14:56:56.524Z`
- duration_ms: `183`
- exit_code: `0`
- stdout_sha256: `0b9708fa8e90622efcdbd5d5244aa595714badb9a27819cc13f065790d4d07ad`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 68 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```

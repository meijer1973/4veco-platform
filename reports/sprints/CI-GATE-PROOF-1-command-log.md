# Sprint CI-GATE-PROOF-1: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-GATE-PROOF-1-plan.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:06.410Z`
- finished_at: `2026-06-06T13:22:06.528Z`
- duration_ms: `118`
- exit_code: `0`
- stdout_sha256: `9bbfe4df1d573acc5052a23fbad4476aa275a4aea90c83f7f74869004b2f859e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\CI-GATE-PROOF-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:13.770Z`
- finished_at: `2026-06-06T13:22:14.011Z`
- duration_ms: `241`
- exit_code: `0`
- stdout_sha256: `385edeb4ad101129c5f588fe052ae68584f622610d16c9eeb1bc7468540c41d4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-GATE-PROOF-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-gate-ci-proof.js reports/fixtures/gate-ci-proof1/positive-markdown.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:17.789Z`
- finished_at: `2026-06-06T14:39:17.935Z`
- duration_ms: `146`
- exit_code: `0`
- stdout_sha256: `ea62af55c6f2eb6d4d72e71d224bee15a3a45027138144260236ace83b0e6f70`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK gate CI proof: ci-proof

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-gate-ci-proof.js reports/fixtures/gate-ci-proof1/positive-json.json

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:32.864Z`
- finished_at: `2026-06-06T14:39:32.998Z`
- duration_ms: `134`
- exit_code: `0`
- stdout_sha256: `ea62af55c6f2eb6d4d72e71d224bee15a3a45027138144260236ace83b0e6f70`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK gate CI proof: ci-proof

```

### stderr excerpt

```text

```
## npm.cmd run check:gate-ci-proof -- reports/fixtures/gate-ci-proof1/positive-markdown.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:32.910Z`
- finished_at: `2026-06-06T14:39:33.583Z`
- duration_ms: `673`
- exit_code: `0`
- stdout_sha256: `8935621a410dbc5016714f460a13736f62eedd33b2fc8c53a2ec137d9140b37f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:gate-ci-proof
> node build-scripts/sprints/check-gate-ci-proof.js reports/fixtures/gate-ci-proof1/positive-markdown.md

OK gate CI proof: ci-proof

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:46.475Z`
- finished_at: `2026-06-06T14:40:06.187Z`
- duration_ms: `19712`
- exit_code: `1`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `d7be013455baba3e07a7954ae623375993b0c7b97014454635e1cf19d70daf20`

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
FAIL scripts/tests/validate-paragraph.test.js
  ● validate-paragraph.js › Part A mode accepts consolidation without paragraaf files

    EPERM, Permission denied: \\?\C:\Projects\4veco\4veco-platform\tmp\test-paragraph '\\?\C:\Projects\4veco\4veco-platform\tmp\test-paragraph'

    [0m [90m 141 |[39m     [36melse[39m [36mif[39m (type [33m===[39m [32m'pptx'[39m) writeZipLike(path[33m.[39mjoin(dir[33m,[39m name)[33m,[39m [35m120000[39m)[33m;[39m
     [90m 142 |[39m     [36melse[39m writeZipLike(path[33m.[39mjoin(dir[33m,[39m name)[33m,[39m [35m300[39m)[33m;[39m
    [31m[1m>[22m[39m[90m 143 |[39m   }
     [90m     |[39m    [31m[1m^[22m[39m
     [90m 144 |[39m
     [90m 145 |[39m   [90m// L1.5V Bucket F2: --mode part-b and --mode complete require an explicit[39m
     [90m 146 |[39m   [90m// companion-visual-review.md with a non-FAIL verdict. Seed a passing one[39m[0m

      at Object.<anonymous> (scripts/tests/validate-paragraph.test.js:143:6)

  ● validate-paragraph.js › Part B mode validates the student-web companion profile without Office files

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

    [0m [90m 194 |[39m     [32m'samenvatting.html'[39m[33m,[39m
     [90m 195 |[39m     [32m'youtube-videos.html'[39m[33m,[39m
    [31m[1m>[22m[39m[90m 196 |[39m   ]) {
     [90m     |[39m       [31m[1m^[22m[39m
     [90m 197 |[39m     [36mconst[39m text [33m=[39m options[33m.[39mlegacySurface [33m===[39m suffix [33m?[39m legacyText [33m:[39m passText[33m;[39m
     [90m 198 |[39m     writeText(path[33m.[39mjoin(dir[33m,[39m [32m`${prefix} ${DASH} ${suffix}`[39m)[33m,[39m [32m`<!doctype html><html><body>${text}</body></html>`[39m)[33m;[39m
     [90m 199 |[39m   }[0m

      at Object.<anonymous> (scripts/tests/validate-paragraph.test.js:196:22)

  ● validate-paragraph.js › legacy-full profile validates the old 27 flat companion root files

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

    [0m [90m 205 |[39m     [32m`var PROCEDURE_DATA = { procedures: [{ title: ${JSON.stringify(procedureText)}, steps: [] }] };\n`[39m
     [90m 206 |[39m   )[33m;[39m
    [31m[1m>[22m[39m[90m 207 |[39m
     [90m     |[39m [31m[1m^[22m[39m
     [90m 208 |[39m   writeText(
     [90m 209 |[39m     path[33m.[39mj
...[truncated 8252 chars]
```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:40:56.374Z`
- finished_at: `2026-06-06T14:41:16.292Z`
- duration_ms: `19918`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `d29e46cc37a9d6b58887f5be7c1fb99622febe7e17eb247e78b53481369d685f`

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
Time:        18.873 s
Ran all test suites.

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:41:30.392Z`
- finished_at: `2026-06-06T14:41:31.037Z`
- duration_ms: `645`
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
- finished_at: `2026-06-06T14:41:42.979Z`
- duration_ms: `93`
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
- started_at: `2026-06-06T14:41:54.306Z`
- finished_at: `2026-06-06T14:41:54.482Z`
- duration_ms: `176`
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
- started_at: `2026-06-06T14:42:04.909Z`
- finished_at: `2026-06-06T14:42:05.031Z`
- duration_ms: `122`
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
- started_at: `2026-06-06T14:42:16.421Z`
- finished_at: `2026-06-06T14:42:16.624Z`
- duration_ms: `203`
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
- started_at: `2026-06-06T14:42:57.149Z`
- finished_at: `2026-06-06T14:42:57.267Z`
- duration_ms: `118`
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
- started_at: `2026-06-06T14:43:10.074Z`
- finished_at: `2026-06-06T14:43:10.187Z`
- duration_ms: `113`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npx.cmd jest --runInBand build-scripts/sprints/check-gate-ci-proof.test.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:43:51.542Z`
- finished_at: `2026-06-06T14:43:54.466Z`
- duration_ms: `2924`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `02c31de846efb1ee366e7c3e6a0ea4d15f123262650b6d79ab8bad352dd13cf3`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.955 s, estimated 1 s
Ran all test suites matching build-scripts/sprints/check-gate-ci-proof.test.js.

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:24.497Z`
- finished_at: `2026-06-06T14:44:24.699Z`
- duration_ms: `202`
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
- started_at: `2026-06-06T14:44:35.753Z`
- finished_at: `2026-06-06T14:44:35.883Z`
- duration_ms: `130`
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
- finished_at: `2026-06-06T14:44:47.577Z`
- duration_ms: `151`
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
- started_at: `2026-06-06T14:44:59.363Z`
- finished_at: `2026-06-06T14:44:59.462Z`
- duration_ms: `99`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-GATE-PROOF-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:45:10.808Z`
- finished_at: `2026-06-06T14:45:10.918Z`
- duration_ms: `110`
- exit_code: `0`
- stdout_sha256: `e50dcc9779477136c3e7b91648c1e5898250465bd236b32519c7957dcd037f72`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-GATE-PROOF-1 (19 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-lead-review-substance.js CI-GATE-PROOF-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:21.685Z`
- finished_at: `2026-06-06T14:51:21.816Z`
- duration_ms: `131`
- exit_code: `0`
- stdout_sha256: `67f7435bb84c48ad5ccde90f5bc126887c4d6b64d760b81df22d059f11c20712`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: CI-GATE-PROOF-1

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-GATE-PROOF-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:33.069Z`
- finished_at: `2026-06-06T14:51:33.186Z`
- duration_ms: `117`
- exit_code: `0`
- stdout_sha256: `d6897bf377a1ca03f18967e823863b97c66198db7d068e8cda302d58769d03de`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-GATE-PROOF-1 (21 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-GATE-PROOF-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:44.566Z`
- finished_at: `2026-06-06T14:51:44.688Z`
- duration_ms: `122`
- exit_code: `0`
- stdout_sha256: `d01960c0ff7ab9a0812465593557784fc9558b76c144467f0477393b1826eafe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-GATE-PROOF-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:56.298Z`
- finished_at: `2026-06-06T14:51:57.108Z`
- duration_ms: `810`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `94ace98c33b84542e232551c3ace9f190c20658fb6912116ac8a949147a4a5d5`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\CI-GATE-PROOF-1-diff-summary.md must start with "# Sprint CI-GATE-PROOF-1: Diff Summary"

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-GATE-PROOF-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:41.968Z`
- finished_at: `2026-06-06T14:52:42.055Z`
- duration_ms: `87`
- exit_code: `0`
- stdout_sha256: `d01960c0ff7ab9a0812465593557784fc9558b76c144467f0477393b1826eafe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-GATE-PROOF-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:55.344Z`
- finished_at: `2026-06-06T14:52:55.987Z`
- duration_ms: `643`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2d367da8a4a7f4c89e06b0592779b2abec031f89c057901e992ef64f2c487a8f`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\reference-team-roadmap.md must mark CI-GATE-PROOF-1 completed when --complete is used

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:30.826Z`
- finished_at: `2026-06-06T14:53:30.944Z`
- duration_ms: `118`
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
- started_at: `2026-06-06T14:53:41.817Z`
- finished_at: `2026-06-06T14:53:42.513Z`
- duration_ms: `696`
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
## node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:53.688Z`
- finished_at: `2026-06-06T14:53:54.563Z`
- duration_ms: `875`
- exit_code: `0`
- stdout_sha256: `9aedcb6ce8aae072051759fec1aa527ce703d67822f8193f45fe1ec9ee759868`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-GATE-PROOF-1 complete

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:27.219Z`
- finished_at: `2026-06-06T14:55:27.323Z`
- duration_ms: `104`
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
## node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:39.947Z`
- finished_at: `2026-06-06T14:55:40.783Z`
- duration_ms: `836`
- exit_code: `0`
- stdout_sha256: `9aedcb6ce8aae072051759fec1aa527ce703d67822f8193f45fe1ec9ee759868`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-GATE-PROOF-1 complete

```

### stderr excerpt

```text

```

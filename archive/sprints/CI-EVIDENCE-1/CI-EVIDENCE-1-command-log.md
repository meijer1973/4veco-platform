# Sprint CI-EVIDENCE-1: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-EVIDENCE-1-plan.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:06.402Z`
- finished_at: `2026-06-06T13:22:06.515Z`
- duration_ms: `113`
- exit_code: `0`
- stdout_sha256: `0b8ef6125bf27c3600cb485536492b8f66d5e0504876334d0faeb82dfa2656de`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\CI-EVIDENCE-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T13:22:13.777Z`
- finished_at: `2026-06-06T13:22:14.040Z`
- duration_ms: `263`
- exit_code: `0`
- stdout_sha256: `43012495cdc47e0938e9e27cc93f26fcacf4639d4e00f07a1dd927a54a911c96`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-EVIDENCE-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/ci/platform-ci-evidence.js write --output ../ci-artifacts-local/platform-ci-evidence.json --platform-path . --lessen-path ../4veco-lessen

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:17.757Z`
- finished_at: `2026-06-06T14:39:18.353Z`
- duration_ms: `596`
- exit_code: `0`
- stdout_sha256: `2e2c75a43c41b3c7a4176c9b112a0f08489bee7aef2ac3b27dd31f5d2ea1f04b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK wrote platform CI evidence: C:\Projects\4veco\ci-artifacts-local\platform-ci-evidence.json platform=ed12764ad39eb1290c899a9bee08edf6a77c126d lessen=15f823028522663ca62c8d6369af9c6ae0264efb

```

### stderr excerpt

```text

```
## node build-scripts/ci/platform-ci-evidence.js check ../ci-artifacts-local/platform-ci-evidence.json --platform-path . --lessen-path ../4veco-lessen

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:32.858Z`
- finished_at: `2026-06-06T14:39:32.998Z`
- duration_ms: `140`
- exit_code: `0`
- stdout_sha256: `c5c16522afd51be380a090472b4800b5235606e0860ab11f3ccc49035fad0da2`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK platform CI evidence: workflow=platform-ci platform=ed12764ad39eb1290c899a9bee08edf6a77c126d lessen=15f823028522663ca62c8d6369af9c6ae0264efb

```

### stderr excerpt

```text

```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:39:46.430Z`
- finished_at: `2026-06-06T14:40:05.719Z`
- duration_ms: `19289`
- exit_code: `1`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `627016f5ba76c71123a3c442d2a1264bf470b47bfad085cd99400a9a5b37706e`

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
  ● validate-paragraph.js › Part A mode fails when quality_ref is missing

    ENOENT: no such file or directory, lstat 'C:\Projects\4veco\4veco-platform\tmp\test-paragraph\Boek 9 - Test\9.9 Hoofdstuk Test\9.9.1 Theory\9.9.1-quality-ref.yaml'

    [0m [90m 178 |[39m   [36mconst[39m parNr [33m=[39m folderName[33m.[39msplit([32m' '[39m)[[35m0[39m][33m;[39m
     [90m 179 |[39m   [36mconst[39m parName [33m=[39m folderName[33m.[39msubstring(parNr[33m.[39mlength [33m+[39m [35m1[39m)[33m;[39m
    [31m[1m>[22m[39m[90m 180 |[39m   [36mconst[39m prefix [33m=[39m [32m`${parNr} ${parName}`[39m[33m;[39m
     [90m     |[39m        [31m[1m^[22m[39m
     [90m 181 |[39m   [36mconst[39m passText [33m=[39m [32m'Economisch denken in vier stappen. Stap 4: bereken nettowaarde.'[39m[33m;[39m
     [90m 182 |[39m   [36mconst[39m legacyText [33m=[39m [32m'Economisch denken in drie stappen. Stap 3: wat geef je op?'[39m[33m;[39m
     [90m 183 |[39m[0m

      at Object.<anonymous> (scripts/tests/validate-paragraph.test.js:180:8)

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
    [31m[1m>[22m[39m[90m 207 |
...[truncated 22447 chars]
```
## npm.cmd run check:platform

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:40:27.648Z`
- finished_at: `2026-06-06T14:40:46.072Z`
- duration_ms: `18424`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `e64115405dadf38aed8261f43f9e094ff3c86fadac7390c644724b7ec305cfae`

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
Time:        17.736 s, estimated 19 s
Ran all test suites.

```
## npm.cmd run check:scope-language

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:41:30.393Z`
- finished_at: `2026-06-06T14:41:31.039Z`
- duration_ms: `646`
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
- started_at: `2026-06-06T14:41:42.927Z`
- finished_at: `2026-06-06T14:41:43.025Z`
- duration_ms: `98`
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
- started_at: `2026-06-06T14:41:54.327Z`
- finished_at: `2026-06-06T14:41:54.481Z`
- duration_ms: `154`
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
- started_at: `2026-06-06T14:42:04.848Z`
- finished_at: `2026-06-06T14:42:04.962Z`
- duration_ms: `114`
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
- started_at: `2026-06-06T14:42:16.466Z`
- finished_at: `2026-06-06T14:42:16.656Z`
- duration_ms: `190`
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
- started_at: `2026-06-06T14:42:57.137Z`
- finished_at: `2026-06-06T14:42:57.246Z`
- duration_ms: `109`
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
- started_at: `2026-06-06T14:43:10.147Z`
- finished_at: `2026-06-06T14:43:10.246Z`
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
## npx.cmd jest --runInBand build-scripts/ci/platform-ci-evidence.test.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:43:51.518Z`
- finished_at: `2026-06-06T14:43:53.851Z`
- duration_ms: `2333`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `3930d2ca9a07a5b5e1e40e1eaa766ef41056dce67e6255c8d7a486b71612a5f8`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.45 s, estimated 1 s
Ran all test suites matching build-scripts/ci/platform-ci-evidence.test.js.

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:44:24.487Z`
- finished_at: `2026-06-06T14:44:24.725Z`
- duration_ms: `238`
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
- started_at: `2026-06-06T14:44:35.704Z`
- finished_at: `2026-06-06T14:44:35.850Z`
- duration_ms: `146`
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
- started_at: `2026-06-06T14:44:47.449Z`
- finished_at: `2026-06-06T14:44:47.571Z`
- duration_ms: `122`
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
- started_at: `2026-06-06T14:44:59.180Z`
- finished_at: `2026-06-06T14:44:59.361Z`
- duration_ms: `181`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-EVIDENCE-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:45:10.800Z`
- finished_at: `2026-06-06T14:45:10.897Z`
- duration_ms: `97`
- exit_code: `0`
- stdout_sha256: `e804502793de4aca6a8d523e0d3a85a6c0c7b9c2b1889e6ee7b313898e1204d6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-EVIDENCE-1 (18 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-lead-review-substance.js CI-EVIDENCE-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:21.683Z`
- finished_at: `2026-06-06T14:51:21.809Z`
- duration_ms: `126`
- exit_code: `0`
- stdout_sha256: `a8d552eba2d49f2ddba45dd4f09c196e45c7472f608a8d45e0d0968bde8b353b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: CI-EVIDENCE-1

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js CI-EVIDENCE-1

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:32.973Z`
- finished_at: `2026-06-06T14:51:33.091Z`
- duration_ms: `118`
- exit_code: `0`
- stdout_sha256: `29b11130a44cd8bdbf89d67a7187eb86a53f16079da68893e5210606ff860d0f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: CI-EVIDENCE-1 (20 entries)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-EVIDENCE-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:44.566Z`
- finished_at: `2026-06-06T14:51:44.725Z`
- duration_ms: `159`
- exit_code: `0`
- stdout_sha256: `356da308479e24ea04aac1fd4fbf05d87bff469ae68d396cc80d15d39ec0d284`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-EVIDENCE-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:51:56.293Z`
- finished_at: `2026-06-06T14:51:57.099Z`
- duration_ms: `806`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9a56b0011cc2705e90d0275b64a3d296f3e2243d123183cfa24d41a2171185c8`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\CI-EVIDENCE-1-diff-summary.md must start with "# Sprint CI-EVIDENCE-1: Diff Summary"

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-EVIDENCE-1-result.md

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:42.005Z`
- finished_at: `2026-06-06T14:52:42.109Z`
- duration_ms: `104`
- exit_code: `0`
- stdout_sha256: `356da308479e24ea04aac1fd4fbf05d87bff469ae68d396cc80d15d39ec0d284`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\CI-EVIDENCE-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:52:52.272Z`
- finished_at: `2026-06-06T14:52:53.011Z`
- duration_ms: `739`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e9fe6bb9db19e83cbbfcf41c8928910d2e851e3e418b76fba1c4873143f759f4`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: references\reference-team-roadmap.md must mark CI-EVIDENCE-1 completed when --complete is used

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:30.807Z`
- finished_at: `2026-06-06T14:53:30.927Z`
- duration_ms: `120`
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
- started_at: `2026-06-06T14:53:41.637Z`
- finished_at: `2026-06-06T14:53:42.257Z`
- duration_ms: `620`
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
## node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:53:53.642Z`
- finished_at: `2026-06-06T14:53:54.578Z`
- duration_ms: `936`
- exit_code: `0`
- stdout_sha256: `67776a59e9514a3bcd2adba2c3f3d09350c9a4ff144f27d3d1b9964318dafb28`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-EVIDENCE-1 complete

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:27.196Z`
- finished_at: `2026-06-06T14:55:27.306Z`
- duration_ms: `110`
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
## node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1 --complete

- cwd: `C:\Projects\4veco\4veco-platform`
- started_at: `2026-06-06T14:55:39.546Z`
- finished_at: `2026-06-06T14:55:40.489Z`
- duration_ms: `943`
- exit_code: `0`
- stdout_sha256: `67776a59e9514a3bcd2adba2c3f3d09350c9a4ff144f27d3d1b9964318dafb28`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: CI-EVIDENCE-1 complete

```

### stderr excerpt

```text

```

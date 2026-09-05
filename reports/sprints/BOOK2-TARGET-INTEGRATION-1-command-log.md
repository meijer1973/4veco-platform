# Sprint BOOK2-TARGET-INTEGRATION-1: Command Log

## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:36:06.776Z`
- finished_at: `2026-09-05T09:36:06.994Z`
- duration_ms: `218`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `212e70da1645e894bd4cb4475c183117355e9c53f2d1acfac28aa7b1859e41ec`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: an active roadmap sprint ledger must include BOOK2-TARGET-INTEGRATION-1; checked references/reference-team-roadmap.md, docs/roadmaps/textbook/textbook-production-roadmap.md, docs/roadmaps/quality-standards/inspection-standards-roadmap.md, docs/roadmaps/quality-standards/international-quality-standards-roadmap.md, docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:39:35.674Z`
- finished_at: `2026-09-05T09:39:35.855Z`
- duration_ms: `181`
- exit_code: `0`
- stdout_sha256: `0f24556bf1e70e22d45cab763c15b0099f15f986584f372510657198e6f3bef5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TARGET-INTEGRATION-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-candidate-approval-block.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:39:35.897Z`
- finished_at: `2026-09-05T09:39:47.375Z`
- duration_ms: `11478`
- exit_code: `0`
- stdout_sha256: `d7db860b04642be531ee76d6fbfa3eb7f6e93e96acd0add91f10a290b218b27e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 candidate approval block: PASS
- structural and target-authority repair routes pass
- target integration authorized; holds not yet released
- approved use, production, lesson authoring, and merge remain blocked

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/workflows/check-book2-target-authority-remediation.test.js build-scripts/workflows/check-book-outline-currentness.test.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:39:54.330Z`
- finished_at: `2026-09-05T09:40:58.311Z`
- duration_ms: `63981`
- exit_code: `0`
- stdout_sha256: `9b8bca8e9cebeed9f6268a117ac9e16af30d5e5fd6d8267687e539eab2cec148`
- stderr_sha256: `bd109e76ea616581b6c6c11e21341a3ca520071f33fec3fe4f10b275bba63895`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/check-book2-target-authority-remediation.test.js build-scripts/workflows/check-book-outline-currentness.test.js


```

### stderr excerpt

```text

Test Suites: 2 passed, 2 total
Tests:       146 passed, 146 total
Snapshots:   0 total
Time:        27.158 s
Ran all test suites matching build-scripts/workflows/check-book2-target-authority-remediation.test.js|build-scripts/workflows/check-book-outline-currentness.test.js.

```
## npm.cmd test -- --runInBand build-scripts/workflows/book2-integration-decision.test.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:42:00.696Z`
- finished_at: `2026-09-05T09:42:08.008Z`
- duration_ms: `7312`
- exit_code: `1`
- stdout_sha256: `bca10e062bdb0187c9414413cac16a9c410a25af3711263ed170ac3014d57d78`
- stderr_sha256: `a1169cc3369733b2e957967916c3f08d6cb8ee851bd9e2346ab5340fbd4c3a77`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/book2-integration-decision.test.js


```

### stderr excerpt

```text
FAIL build-scripts/workflows/book2-integration-decision.test.js (6.388 s)
  ● separate Book 2 immutable integration grant › 2.1.1 transitions from historical blocked to authorized pending, not production

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "references/authored/book-outlines/book-2-outline.meta.json: authority hash is stale for references/authored/course-target-exercises.json",
    + ]

      58 |     const input = pending(true);
      59 |     expect(approvalBlockLifecycleMode(input.meta, input)).toBe('pending');
    > 60 |     expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'target_authority_integration', paragraph })).toEqual([]);
         |                                                                                                                         ^
      61 |     for (const action of ['paragraph_production', 'lesson_authoring']) {
      62 |       expect(currentness.findBookOutlineFailures(filesFor(input), { action, paragraph }).join('\n')).toContain(holdId);
      63 |     }

      at toEqual (build-scripts/workflows/book2-integration-decision.test.js:60:121)

  ● separate Book 2 immutable integration grant › 2.1.2 transitions from historical blocked to authorized pending, not production

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "references/authored/book-outlines/book-2-outline.meta.json: authority hash is stale for references/authored/course-target-exercises.json",
    + ]

      58 |     const input = pending(true);
      59 |     expect(approvalBlockLifecycleMode(input.meta, input)).toBe('pending');
    > 60 |     expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'target_authority_integration', paragraph })).toEqual([]);
         |                                                                                                                         ^
      61 |     for (const action of ['paragraph_production', 'lesson_authoring']) {
      62 |       expect(currentness.findBookOutlineFailures(filesFor(input), { action, paragraph }).join('\n')).toContain(holdId);
      63 |     }

      at toEqual (build-scripts/workflows/book2-integration-decision.test.js:60:121)

  ● separate Book 2 immutable integration grant › 2.1.3 transitions from historical blocked to authorized pending, not production

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "references/authored/book-outlines/book-2-outline.meta.json: authority hash is stale for references/authored/course-target-exercises.json",
    + ]

      58 |     const input = pending(true);
      59 |     expect(approvalBlockLifecycleMode(input.meta, input)).toBe('pending');
    > 60 |     expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'target_authority_integration', paragraph })).toEqual([]);
         |                                                                                                                         ^
      61 |     for (const action of ['paragraph_production', 'lesson_authoring']) {
      62 |       expect(currentness.findBookOutlineFailures(filesFor(input), { action, paragraph }).join('\n')).toContain(holdId);
      63 |     }

      at toEqual (build-scripts/workflows/book2-integration-decision.test.js:60:121)

  ● separate Book 2 immutable integration grant › 2.1.4 transitions from historical blocked to authorized pending, not production

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "references/authored/book-outlines/book-2-outline.meta.json: authority hash is stale for references/authored/course-target-exercises.json",
    + ]

      58 |     const input = pending(true);
      59 |     expect(approvalBlockLifecycle
...[truncated 9972 chars]
```
## npm.cmd test -- --runInBand build-scripts/workflows/book2-integration-decision.test.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:43:08.412Z`
- finished_at: `2026-09-05T09:43:22.878Z`
- duration_ms: `14466`
- exit_code: `0`
- stdout_sha256: `bca10e062bdb0187c9414413cac16a9c410a25af3711263ed170ac3014d57d78`
- stderr_sha256: `515f0ccc9e3a5195e5728252892cd0f461d96f4f42830ec37d6366e3da449198`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/book2-integration-decision.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        13.552 s
Ran all test suites matching build-scripts/workflows/book2-integration-decision.test.js.

```
## node build-scripts/workflows/check-book2-candidate-approval-block.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:43:22.924Z`
- finished_at: `2026-09-05T09:43:41.158Z`
- duration_ms: `18234`
- exit_code: `0`
- stdout_sha256: `d7db860b04642be531ee76d6fbfa3eb7f6e93e96acd0add91f10a290b218b27e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 candidate approval block: PASS
- structural and target-authority repair routes pass
- target integration authorized; holds not yet released
- approved use, production, lesson authoring, and merge remain blocked

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:43:57.048Z`
- finished_at: `2026-09-05T09:43:57.266Z`
- duration_ms: `218`
- exit_code: `0`
- stdout_sha256: `0f24556bf1e70e22d45cab763c15b0099f15f986584f372510657198e6f3bef5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TARGET-INTEGRATION-1 planned/active

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/workflows/book2-integration-decision.test.js build-scripts/workflows/check-book2-target-authority-remediation.test.js build-scripts/workflows/check-book-outline-currentness.test.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:44:24.855Z`
- finished_at: `2026-09-05T09:45:01.621Z`
- duration_ms: `36766`
- exit_code: `0`
- stdout_sha256: `c485fe95448ffb738a9867902c9127b613d91f0404305b32e98d25329b71a1a7`
- stderr_sha256: `8b12aa94477754156433f49db4b086be20fe23f824593ca4149262607cd29417`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/book2-integration-decision.test.js build-scripts/workflows/check-book2-target-authority-remediation.test.js build-scripts/workflows/check-book-outline-currentness.test.js


```

### stderr excerpt

```text

Test Suites: 3 passed, 3 total
Tests:       181 passed, 181 total
Snapshots:   0 total
Time:        35.826 s, estimated 40 s
Ran all test suites matching build-scripts/workflows/book2-integration-decision.test.js|build-scripts/workflows/check-book2-target-authority-remediation.test.js|build-scripts/workflows/check-book-outline-currentness.test.js.

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:46:21.610Z`
- finished_at: `2026-09-05T09:46:22.279Z`
- duration_ms: `669`
- exit_code: `0`
- stdout_sha256: `afa8ac74cd96f52a0fe1d17eb6e688af9a968faa8e826f1ff2e230bc613b6671`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable pending-candidate invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## npm.cmd run check:book-outline-currentness -- --require-approved

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:46:22.334Z`
- finished_at: `2026-09-05T09:46:24.644Z`
- duration_ms: `2310`
- exit_code: `1`
- stdout_sha256: `c66a405b95aed462676f2d302bbaff5a75973e195f7d01dfde08a1887234cd95`
- stderr_sha256: `78b246dcd03fdb93835d78080281aaa411c5e75c9657825453844d94c12fdf25`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:book-outline-currentness
> node build-scripts/workflows/check-book-outline-currentness.js --require-approved


```

### stderr excerpt

```text
Book 2 outline currentness: FAIL
- Issue #229 activation commit 206c018478654db781cc879e7ea36adcd9ef600c: Command failed: git show 206c018478654db781cc879e7ea36adcd9ef600c:undefined
fatal: path 'undefined' does not exist in '206c018478654db781cc879e7ea36adcd9ef600c'


```
## node build-scripts/workflows/check-book2-candidate-approval-block.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:46:24.709Z`
- finished_at: `2026-09-05T09:46:25.529Z`
- duration_ms: `820`
- exit_code: `0`
- stdout_sha256: `a694a16c65758708891f83e59bd1d963f65eb96379cacd9f35032abde9b47cbf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 candidate approval block: PASS
- retired after fully evidenced Issue #229 target integration

```

### stderr excerpt

```text

```
## npm.cmd run check:book-outline-currentness -- --require-approved

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:49:36.383Z`
- finished_at: `2026-09-05T09:49:39.665Z`
- duration_ms: `3282`
- exit_code: `0`
- stdout_sha256: `21dd1994ef7a81604dd9cfa96c440071de816f864405daa1b7645ca8b3feabb2`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:book-outline-currentness
> node build-scripts/workflows/check-book-outline-currentness.js --require-approved

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use

```

### stderr excerpt

```text

```
## npm.cmd run check:book-outline-currentness -- --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:49:39.731Z`
- finished_at: `2026-09-05T09:49:42.845Z`
- duration_ms: `3114`
- exit_code: `0`
- stdout_sha256: `ee5e5072e8740217da11d4eee567c188a686ed7485a74bad49f341f95ce34f93`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:book-outline-currentness
> node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## git diff ad27f9c30205042c01cacf0b362f4d3f87e6c7a9 -- references/authored/course-target-exercises.json references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json references/machine references/external

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:49:42.915Z`
- finished_at: `2026-09-05T09:49:42.996Z`
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
## git -C ../4veco-lessen status --short

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:49:43.058Z`
- finished_at: `2026-09-05T09:49:43.148Z`
- duration_ms: `90`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand build-scripts/workflows/book2-integration-decision.test.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:48:24.800Z`
- finished_at: `2026-09-05T09:50:56.931Z`
- duration_ms: `152131`
- exit_code: `0`
- stdout_sha256: `bca10e062bdb0187c9414413cac16a9c410a25af3711263ed170ac3014d57d78`
- stderr_sha256: `fb44fd36d8dae35032daa32dd594427a932e81745a7534e184d34257fabbd4e4`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand build-scripts/workflows/book2-integration-decision.test.js


```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Time:        151.211 s
Ran all test suites matching build-scripts/workflows/book2-integration-decision.test.js.

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:51:30.395Z`
- finished_at: `2026-09-05T09:51:31.184Z`
- duration_ms: `789`
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
## node build-scripts/workflows/check-book2-candidate-approval-block.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:51:31.240Z`
- finished_at: `2026-09-05T09:51:32.242Z`
- duration_ms: `1002`
- exit_code: `0`
- stdout_sha256: `a694a16c65758708891f83e59bd1d963f65eb96379cacd9f35032abde9b47cbf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 candidate approval block: PASS
- retired after fully evidenced Issue #229 target integration

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:51:32.297Z`
- finished_at: `2026-09-05T09:51:32.424Z`
- duration_ms: `127`
- exit_code: `0`
- stdout_sha256: `16b60c3630671892d10ff7340c3df4204ef76bbc7d96852da17007a31b8b445b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 11
  - build-scripts/workflows/book2-integration-decision.js
  - build-scripts/workflows/book2-integration-decision.test.js
  - build-scripts/workflows/check-book-outline-currentness.js
  - build-scripts/workflows/check-book-outline-currentness.test.js
  - build-scripts/workflows/check-book2-candidate-approval-block.js
  - build-scripts/workflows/check-book2-target-authority-remediation.js
  - build-scripts/workflows/check-book2-target-authority-remediation.test.js
  - docs/roadmaps/textbook/sprint-ledger.md
  - docs/roadmaps/textbook/textbook-production-roadmap.md
  - references/authored/book-outlines/book-2-outline.meta.json
  - references/data/sprints/BOOK2-TARGET-INTEGRATION-1.plan.json
- review evidence: 9
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-baseline.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-command-log.jsonl
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-command-log.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-implementation-review-corrections.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-plan.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-planning-review.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-prerequisite-inventory.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-continuation-plan.md

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:51:32.480Z`
- finished_at: `2026-09-05T09:51:32.582Z`
- duration_ms: `102`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## npm.cmd run agent:index

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:53:46.554Z`
- finished_at: `2026-09-05T09:53:47.221Z`
- duration_ms: `667`
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
## node build-scripts/sprints/emit-gate-bundle-urls.js GATE-BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:53:47.270Z`
- finished_at: `2026-09-05T09:53:47.353Z`
- duration_ms: `83`
- exit_code: `0`
- stdout_sha256: `075266a3ab1f8f780d8ef28e86e2d28243608e6e2f97e4a79fbf734be7bd49b3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
wrote reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/bundle-urls.md (2 artifacts)

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:53:47.392Z`
- finished_at: `2026-09-05T09:53:47.459Z`
- duration_ms: `67`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:53:47.496Z`
- finished_at: `2026-09-05T09:53:47.832Z`
- duration_ms: `336`
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
## npm.cmd run finalization:freshness

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:54:50.192Z`
- finished_at: `2026-09-05T09:54:51.364Z`
- duration_ms: `1172`
- exit_code: `0`
- stdout_sha256: `374c9f632971524e464c2ee62e7a93655e85059fc6ee44a258c9a8f332b0ba6b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 finalization:freshness
> node build-scripts/review-gates/finalization-freshness-proof.js

{
  "schema_version": 1,
  "generated_at_utc": "2026-09-05T09:54:51.230Z",
  "repository": "meijer1973/4veco-platform",
  "head_sha": "206c018478654db781cc879e7ea36adcd9ef600c",
  "remote": "origin",
  "remote_main_sha": "ad27f9c30205042c01cacf0b362f4d3f87e6c7a9",
  "origin_main_sha": "ad27f9c30205042c01cacf0b362f4d3f87e6c7a9",
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
      "working_tree_sha256": "6553c5eda6fb8fe12755f97feeca4d43bbd274d76ea74332c8a73d6513b128f9",
      "remote_main_sha256": "6553c5eda6fb8fe12755f97feeca4d43bbd274d76ea74332c8a73d6513b128f9"
    }
  ]
}

```

### stderr excerpt

```text

```
## npm.cmd run check:review-throughput -- reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/review-packet.json

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:54:51.411Z`
- finished_at: `2026-09-05T09:54:51.828Z`
- duration_ms: `417`
- exit_code: `0`
- stdout_sha256: `23ee559e25ac1e4d76751638fddabb882c15195f00b5bea077b0376a1d486234`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/review-packet.json

OK review throughput packet: GATE-BOOK2-TARGET-INTEGRATION-1

```

### stderr excerpt

```text

```
## npm.cmd run agent:index

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:55:13.958Z`
- finished_at: `2026-09-05T09:55:14.718Z`
- duration_ms: `760`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:55:14.772Z`
- finished_at: `2026-09-05T09:55:14.857Z`
- duration_ms: `85`
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
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TARGET-INTEGRATION-1-plan.md

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:54.199Z`
- finished_at: `2026-09-05T09:56:54.342Z`
- duration_ms: `143`
- exit_code: `0`
- stdout_sha256: `b5f1286b34a37f68d6f5b211b52558021388c53a4150403b53793aed6788eff3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\BOOK2-TARGET-INTEGRATION-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-result.js reports/sprints/BOOK2-TARGET-INTEGRATION-1-result.md

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:54.404Z`
- finished_at: `2026-09-05T09:56:54.495Z`
- duration_ms: `91`
- exit_code: `0`
- stdout_sha256: `89c90df9b13d53088a911926b255221307812f0f4d6efe7a24a101089256e8b3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint result: reports\sprints\BOOK2-TARGET-INTEGRATION-1-result.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-command-log.js BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:54.555Z`
- finished_at: `2026-09-05T09:56:54.654Z`
- duration_ms: `99`
- exit_code: `0`
- stdout_sha256: `2110e89ff4a733a62e937a74e9e8dd32658a97e25975b8a8d89179292e8459f7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint command log: BOOK2-TARGET-INTEGRATION-1 (31 entries)

```

### stderr excerpt

```text

```
## node scripts/check-course-target-exercises-v5.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:54.727Z`
- finished_at: `2026-09-05T09:56:54.819Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `e5edcf66afcb38d786286ff06f21b5c01e2875033ca2ea50720af28510fbefa2`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK target exercises v5: total=54, books=1:12, 2:12, 3:14, 4:16

```

### stderr excerpt

```text

```
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:54.888Z`
- finished_at: `2026-09-05T09:56:55.116Z`
- duration_ms: `228`
- exit_code: `0`
- stdout_sha256: `89c1b9a7be41b21444991ab40590881ee0448a2ead683a23841c7c459ce56783`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 95 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## npm.cmd run check:branch-protection

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:56:55.182Z`
- finished_at: `2026-09-05T09:56:56.582Z`
- duration_ms: `1400`
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
## npm.cmd run check:agent-index-freshness

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:58:35.907Z`
- finished_at: `2026-09-05T09:58:36.853Z`
- duration_ms: `946`
- exit_code: `1`
- stdout_sha256: `8d77605272c3a5c596a1a78fe6df5ec16c8efe78e5ba0178a8c2c2b66bb5d211`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:agent-index-freshness
> node build-scripts/reports/check-agent-index-freshness.js

{
  "ok": false,
  "checks": [
    {
      "label": "4veco-platform",
      "ok": false,
      "skipped": false,
      "failures": [
        "4veco-platform index source_commit 206c018478654db781cc879e7ea36adcd9ef600c does not match HEAD b772906721a7655e5fa8e59a1a0674b405efe6f9"
      ],
      "warnings": [],
      "source_commit": "206c018478654db781cc879e7ea36adcd9ef600c",
      "head": "b772906721a7655e5fa8e59a1a0674b405efe6f9",
      "source_ref": "HEAD",
      "target_commit": "b772906721a7655e5fa8e59a1a0674b405efe6f9",
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
  "failures": [
    "4veco-platform index source_commit 206c018478654db781cc879e7ea36adcd9ef600c does not match HEAD b772906721a7655e5fa8e59a1a0674b405efe6f9"
  ],
  "warnings": []
}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/emit-url-index.js --check

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:58:36.926Z`
- finished_at: `2026-09-05T09:58:37.044Z`
- duration_ms: `118`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:58:37.120Z`
- finished_at: `2026-09-05T09:58:37.233Z`
- duration_ms: `113`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:58:37.302Z`
- finished_at: `2026-09-05T09:58:37.415Z`
- duration_ms: `113`
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
## npm.cmd run check:platform

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T09:51:19.624Z`
- finished_at: `2026-09-05T09:59:31.774Z`
- duration_ms: `492150`
- exit_code: `0`
- stdout_sha256: `5b7bf8f7931706e85d713ae2021b836cfa9d35bc326f4ab0207b5c5df088730a`
- stderr_sha256: `ede1e21df78e2652aeb775649b620aceaf21c76aba02c77a5dbe2acc83a76747`

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

Test Suites: 6 skipped, 110 passed, 110 of 116 total
Tests:       8 skipped, 1868 passed, 1876 total
Snapshots:   0 total
Time:        491.102 s
Ran all test suites.

```
## node build-scripts/sprints/check-lead-review-substance.js BOOK2-TARGET-INTEGRATION-1 --review-file reports/sprints/BOOK2-TARGET-INTEGRATION-1-lead-review-round1.md

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:03:06.104Z`
- finished_at: `2026-09-05T10:03:06.187Z`
- duration_ms: `83`
- exit_code: `0`
- stdout_sha256: `4e424aa1a050c8f24ee50685245f7fcc2bfd4b4d44aa642cd9f46a197331d8fe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: BOOK2-TARGET-INTEGRATION-1

```

### stderr excerpt

```text

```
## npm.cmd run agent:index

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:04:35.312Z`
- finished_at: `2026-09-05T10:04:36.011Z`
- duration_ms: `699`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:04:36.063Z`
- finished_at: `2026-09-05T10:04:36.141Z`
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
## npm.cmd run dashboard:internal

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:04:36.193Z`
- finished_at: `2026-09-05T10:04:36.602Z`
- duration_ms: `409`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:12:17.060Z`
- finished_at: `2026-09-05T10:12:17.191Z`
- duration_ms: `131`
- exit_code: `0`
- stdout_sha256: `782373e4b95607b686560b882b20aadf057d9c72ce4f535a6691605683dfa2dd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 13
  - build-scripts/workflows/book2-integration-decision.js
  - build-scripts/workflows/book2-integration-decision.test.js
  - build-scripts/workflows/check-book-outline-currentness.js
  - build-scripts/workflows/check-book-outline-currentness.test.js
  - build-scripts/workflows/check-book2-candidate-approval-block.js
  - build-scripts/workflows/check-book2-target-authority-remediation.js
  - build-scripts/workflows/check-book2-target-authority-remediation.test.js
  - docs/roadmaps/textbook/sprint-ledger.md
  - docs/roadmaps/textbook/textbook-production-roadmap.md
  - references/authored/book-outlines/book-2-outline.md
  - references/authored/book-outlines/book-2-outline.meta.json
  - references/data/sprints/BOOK2-TARGET-INTEGRATION-1.plan.json
  - references/data/sprints/BOOK2-TARGET-INTEGRATION-1.result.json
- generated index/report: 7
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
  - reports/url-index.md
- review evidence: 17
  - reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/bundle-urls.md
  - reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/review-packet.json
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-baseline.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-command-log.jsonl
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-command-log.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-diff-summary.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-finished-verification.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-implementation-review-corrections.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-lead-review-assignment.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-lead-review-corrections.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-lead-review-round1.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-plan.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-planning-review.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-prerequisite-inventory.md
  - reports/sprints/BOOK2-TARGET-INTEGRATION-1-result.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-continuation-plan.md

```

### stderr excerpt

```text

```
## npm.cmd run check:agent-index-freshness

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:12:17.246Z`
- finished_at: `2026-09-05T10:12:17.798Z`
- duration_ms: `552`
- exit_code: `0`
- stdout_sha256: `478550c3e59b67d1726d9109333ae72d3edc3bc3f02e111172a710b471ac90c4`
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
      "warnings": [
        "4veco-platform index source_commit precedes generated-index-only ref 469e605fb5cd722816b0fa3f3b12af63b423efe5"
      ],
      "source_commit": "221acac50a7f9e8b9afadbd24584bef531b2c4b4",
      "head": "469e605fb5cd722816b0fa3f3b12af63b423efe5",
      "source_ref": "HEAD",
      "target_commit": "469e605fb5cd722816b0fa3f3b12af63b423efe5",
      "accepted_parent_generated_tail": true,
      "accepted_generated_index_tail_ref": "469e605fb5cd722816b0fa3f3b12af63b423efe5"
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
  "warnings": [
    "4veco-platform index source_commit precedes generated-index-only ref 469e605fb5cd722816b0fa3f3b12af63b423efe5"
  ]
}

```

### stderr excerpt

```text

```
## gh run view 33959681780 --repo meijer1973/4veco-platform --json "headSha,status,conclusion,url"

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:21:26.221Z`
- finished_at: `2026-09-05T10:21:26.920Z`
- duration_ms: `699`
- exit_code: `0`
- stdout_sha256: `17bb57d2c20204ded2af9fd562ef7db29c780a75dc78fb92590fd9111cb54ed3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"conclusion":"success","headSha":"469e605fb5cd722816b0fa3f3b12af63b423efe5","status":"completed","url":"https://github.com/meijer1973/4veco-platform/actions/runs/33959681780"}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1 --complete

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:24:36.735Z`
- finished_at: `2026-09-05T10:24:36.990Z`
- duration_ms: `255`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9c92b4280837c77bab3a1fd078391f85f00859b19be84a9119e47e86847343b2`

### stdout excerpt

```text

```

### stderr excerpt

```text
Sprint bundle check failed: reports\sprints\BOOK2-TARGET-INTEGRATION-1-lead-review-round1.md must identify Round: lead review round 1

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1 --complete

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:24:59.816Z`
- finished_at: `2026-09-05T10:25:00.397Z`
- duration_ms: `581`
- exit_code: `0`
- stdout_sha256: `1087dfe60f0317656cfd2016d8e17fce166ad6ea4eefb92a158555e7def52b88`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TARGET-INTEGRATION-1 complete

```

### stderr excerpt

```text

```
## npm.cmd run check:governance-freshness

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:26.187Z`
- finished_at: `2026-09-05T10:25:27.385Z`
- duration_ms: `1198`
- exit_code: `0`
- stdout_sha256: `bf86f10506cef7c10106c8006b130cce272ae5722390bc39785932aeef0b8111`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:governance-freshness
> node build-scripts/review-gates/check-governance-freshness.js

{
  "ok": true,
  "remote": "origin",
  "remote_ref": "origin/main",
  "origin_main_sha": "ad27f9c30205042c01cacf0b362f4d3f87e6c7a9",
  "head_sha": "469e605fb5cd722816b0fa3f3b12af63b423efe5",
  "allow_policy_edit": false,
  "files": [
    "AGENTS.md",
    "AGENT_GITHUB_ENTRY.md",
    "docs/review/pr-readiness-routing-policy.md",
    "docs/review/pr-integration-lane-policy.md",
    "docs/review/pr-throughput-policy.md",
    "package.json",
    ".github/workflows/platform-ci.yml",
    "build-scripts/ci/check-branch-protection.js"
  ],
  "differing_files": [],
  "failures": []
}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-lead-review-substance.js BOOK2-TARGET-INTEGRATION-1

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:27.426Z`
- finished_at: `2026-09-05T10:25:27.481Z`
- duration_ms: `55`
- exit_code: `0`
- stdout_sha256: `4e424aa1a050c8f24ee50685245f7fcc2bfd4b4d44aa642cd9f46a197331d8fe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK lead-review substance: BOOK2-TARGET-INTEGRATION-1

```

### stderr excerpt

```text

```
## npm.cmd run check:review-throughput -- reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/review-packet.json

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:27.524Z`
- finished_at: `2026-09-05T10:25:27.832Z`
- duration_ms: `308`
- exit_code: `0`
- stdout_sha256: `23ee559e25ac1e4d76751638fddabb882c15195f00b5bea077b0376a1d486234`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:review-throughput
> node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/review-packet.json

OK review throughput packet: GATE-BOOK2-TARGET-INTEGRATION-1

```

### stderr excerpt

```text

```
## npm.cmd run dashboard:internal

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:27.873Z`
- finished_at: `2026-09-05T10:25:28.185Z`
- duration_ms: `312`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:28.227Z`
- finished_at: `2026-09-05T10:25:28.290Z`
- duration_ms: `63`
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

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:28.333Z`
- finished_at: `2026-09-05T10:25:28.837Z`
- duration_ms: `504`
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
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1 --complete

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:46.100Z`
- finished_at: `2026-09-05T10:25:46.676Z`
- duration_ms: `576`
- exit_code: `0`
- stdout_sha256: `1087dfe60f0317656cfd2016d8e17fce166ad6ea4eefb92a158555e7def52b88`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TARGET-INTEGRATION-1 complete

```

### stderr excerpt

```text

```
## node build-scripts/references/check-roadmap-version-index.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:46.717Z`
- finished_at: `2026-09-05T10:25:46.786Z`
- duration_ms: `69`
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
## node build-scripts/reports/validate-report-json.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:46.829Z`
- finished_at: `2026-09-05T10:25:46.892Z`
- duration_ms: `63`
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
## node build-scripts/ci/check-evidence-line-endings.js

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:46.936Z`
- finished_at: `2026-09-05T10:25:47.055Z`
- duration_ms: `119`
- exit_code: `0`
- stdout_sha256: `89c1b9a7be41b21444991ab40590881ee0448a2ead683a23841c7c459ce56783`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK evidence line endings: scanned 95 text file(s), skipped 0, CRLF 0

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\wt\book2-textbook-production-20260905\4veco-platform`
- started_at: `2026-09-05T10:25:47.096Z`
- finished_at: `2026-09-05T10:25:47.176Z`
- duration_ms: `80`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```

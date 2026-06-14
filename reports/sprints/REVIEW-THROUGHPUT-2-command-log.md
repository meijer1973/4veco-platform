# Sprint REVIEW-THROUGHPUT-2: Command Log

## node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-2-plan.md

exit_code: 0

### stdout

```text
OK sprint plan: reports\sprints\REVIEW-THROUGHPUT-2-plan.md

```

### stderr

```text

```

## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-2

exit_code: 0

### stdout

```text
OK sprint bundle: REVIEW-THROUGHPUT-2 planned/active

```

### stderr

```text

```

## node node_modules/jest/bin/jest.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand

exit_code: 0

### stdout

```text

```

### stderr

```text

Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        0.71 s, estimated 1 s
Ran all test suites matching build-scripts/review-gates/review-throughput-fields.test.js|build-scripts/sprints/check-review-throughput-packet.test.js.

```

## node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js

exit_code: 0

### stdout

```text
OK MTU-H4B answer-form CLI execution packet

```

### stderr

```text

```

## node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json

exit_code: 0

### stdout

```text
OK review throughput packet: GATE-MTU-H2E-conditional-lane-execution

```

### stderr

```text

```

## node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/review-packet.json

exit_code: 0

### stdout

```text
OK review throughput packet: GATE-MTU-H4B-answer-form-cli-execution

```

### stderr

```text

```

## npm.cmd run check:scope-language

exit_code: 0

### stdout

```text

> 4veco-platform@1.0.0 check:scope-language
> node build-scripts/sprints/check-scope-language.js --active

OK scope-language check: active surfaces

```

### stderr

```text

```

## node build-scripts/reports/validate-report-json.js

exit_code: 0

### stdout

```text
OK report JSON contract: 14 report(s)

```

### stderr

```text

```

## node build-scripts/references/check-roadmap-version-index.js

exit_code: 0

### stdout

```text
OK roadmap version index: 149 entries

```

### stderr

```text

```

## git diff --check

exit_code: 0

### stdout

```text

```

### stderr

```text
warning: in the working copy of 'build-scripts/references/build-mtu-h2e-conditional-lane-execution-packet.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'build-scripts/references/build-mtu-h4b-answer-form-cli-execution-packet.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'docs/review/pr-throughput-policy.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/review-packet.json', LF will be replaced by CRLF the next time Git touches it

```

## node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-2

exit_code: 0

### stdout

```text
OK lead-review substance: REVIEW-THROUGHPUT-2

```

### stderr

```text

```

## node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-2

exit_code: 0

### stdout

```text
OK sprint command log: REVIEW-THROUGHPUT-2 (11 entries)

```

### stderr

```text

```

## node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-2-result.md

exit_code: 0

### stdout

```text
OK sprint result: reports\sprints\REVIEW-THROUGHPUT-2-result.md

```

### stderr

```text

```

## node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-2 --complete

exit_code: 0

### stdout

```text
OK sprint bundle: REVIEW-THROUGHPUT-2 complete

```

### stderr

```text

```

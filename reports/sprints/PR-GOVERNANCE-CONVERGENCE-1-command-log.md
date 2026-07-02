# PR-GOVERNANCE-CONVERGENCE-1 Command Log

| Command | Result |
|---|---|
| `npm.cmd run check:pr-readiness` | passed; 4 suites, 90 tests |
| `npm.cmd run check:active-governance-wording` | passed |
| `npm.cmd run check:integration-lane` | passed; 8 suites, 77 tests |
| `npm.cmd run check:scope-language` | passed |
| `npm.cmd run check:branch-protection -- --allow-missing-secrets` | passed; `ok: true`, required approval count `0` |
| `node build-scripts/reports/validate-report-json.js` | passed; 14 reports |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |
| `npm.cmd run finalization:freshness` | passed; remote `main` matched local `origin/main` and was ancestor of `HEAD` |
| lead review round 1 on `9318c3ff6369b506b8a4909cf382c7b0bf52e371` | request changes; missing `--expect-transition MARK_READY` hard requirement |
| remote `platform-ci` run `28105800155` on `8e4ad9d3ad969d691a2a58a0a99ec6ad3beef1d3` | passed |
| lead review round 2 on `8e4ad9d3ad969d691a2a58a0a99ec6ad3beef1d3` | passed |
| `npm.cmd run route-and-apply:pr-readiness -- --pr 149 --evidence <evidence.json> --expect-transition MARK_READY` | pending readiness application |

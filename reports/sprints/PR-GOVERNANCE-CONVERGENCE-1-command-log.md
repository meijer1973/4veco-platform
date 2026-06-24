# PR-GOVERNANCE-CONVERGENCE-1 Command Log

| Command | Result |
|---|---|
| `npm.cmd run check:pr-readiness` | passed; 4 suites, 88 tests |
| `npm.cmd run check:active-governance-wording` | passed |
| `npm.cmd run check:integration-lane` | passed; 8 suites, 77 tests |
| `npm.cmd run check:scope-language` | passed |
| `npm.cmd run check:branch-protection -- --allow-missing-secrets` | passed; `ok: true`, required approval count `0` |
| `node build-scripts/reports/validate-report-json.js` | passed; 14 reports |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |
| `npm.cmd run finalization:freshness` | passed; remote `main` matched local `origin/main` and was ancestor of `HEAD` |
| `gh run watch <platform-ci-run>` | pending remote head push |
| `npm.cmd run route-and-apply:pr-readiness -- --pr 149 --evidence <evidence.json> --expect-transition MARK_READY` | pending remote CI and lead review |

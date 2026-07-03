# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Quality Log

## Scope checks

| Check | Result | Evidence |
|---|---|---|
| Six-surface boundary | pass | `references/data/exercises/y1-golden-rollout-wave-1.json` lists exactly the first-three short-check and exit-ticket surfaces. |
| Currentness | pass | `npm.cmd run check:exercise-workflow-currentness` passed in `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`. |
| Authority hygiene | pass | `npm.cmd run check:exercise-authority-hygiene` passed in the command log. |
| Rendered workflow proof inherited | pass | `npm.cmd run check:scale-proof-3p-product-path` passed in the command log. |
| Y1 wave guard | pass | `npm.cmd run check:y1-golden-rollout-wave-1` passed in the command log. |
| Source data unchanged | pass | Focused checker and git status guard cover `source-data/book-1/exit-ticket`. |
| Generated lesson output unchanged | pass | Focused checker and lesson diff hygiene cover `../4veco-lessen`. |
| Engine behavior unchanged | pass | Focused checker covers `engines`. |

## Quality decisions

| Decision | Disposition | Reason |
|---|---|---|
| Use existing Scale proof rather than recapturing screenshots | accepted | Lesson output and rendered route behavior are unchanged in this sprint. |
| Keep `1.1.4` outside the gate claim | accepted | Current evidence records same-copy hygiene only. |
| Keep chapter `1.2` outside the wave | accepted | No current platform check/exit source files exist for chapter `1.2`. |
| Add CI-visible checker | accepted | The wave boundary should be enforced for future workflow agents and PRs. |

## Residual risk

No blocking residual risk was found for this rollout-control sprint. Scale Gate
1 and Year 1 expansion remain separate decisions, not carried non-blocking
requirements inside this PASS.

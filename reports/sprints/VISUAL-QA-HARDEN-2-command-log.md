# VISUAL-QA-HARDEN-2 Command Log

Generated: 2026-06-05

## Commands

```text
git status --short --branch
Get-Content ..\CLAUDE.md -TotalCount 220
Get-Content ..\4veco-lessen\specifications\product-end-state.md -TotalCount 260
rg -n "VISUAL-QA-HARDEN-2|CHECK-ROUTE-COPY-1|CHECK-SURFACE-PREGATE-1|GATE-CHECK-SHORT-EXIT-2|visual QA|screenshot|route copy" references\reference-team-roadmap.md reports\sprints reports\review-gates\GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review -S
Get-Content reports\sprints\CHECK-ROUTE-COPY-1-result.md
Get-Content reports\sprints\CHECKSURFACE-RESET-1-product-quality-audit.md
Get-Content reports\review-gates\GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review\direct-review-comments.md
Get-Content references\reference-team-roadmap.md selected sections
rg -n visual/product QA terms in build-scripts, reports, source-data, engines
Get-Content build-scripts\sprints\check-check-short-exit2.js
Get-Content reports\json\graph-check-ux1-proof.json
Get-Content reports\json\graph-exit-ux1-proof.json
Get-Content reports\json\check-route-copy1-proof.json
Get-Content visual QA reports and screenshot manifests for GRAPH-CHECK-UX-1, GRAPH-EXIT-UX-1, CHECK-ROUTE-COPY-1
Get-Content reports\json\checksurface-reset1-quality-findings.json
node build-scripts\sprints\emit-visual-qa-harden2-proof.js
node build-scripts\sprints\check-visual-qa-harden2.js
Get-Content reports\sprints\VISUAL-QA-HARDEN-2-product-qa-report.md
Get-Content reports\json\visual-qa-harden2-proof.json -TotalCount 260
node build-scripts\sprints\check-graph-check-ux1.js
node build-scripts\sprints\check-graph-exit-ux1.js
node build-scripts\sprints\check-check-route-copy1.js
node build-scripts\sprints\check-check-short-exit2.js
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
npm.cmd run check:scope-language
Get-Content reports\sprints\VISUAL-QA-HARDEN-2-command-log.jsonl | ForEach-Object { $_ | ConvertFrom-Json | Out-Null }; Write-Output 'JSONL ok'
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
git fetch --prune origin
git rev-list --left-right --count 'HEAD...@{upstream}'
npm.cmd run agent:index
node build-scripts\sprints\emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts\sprints\check-visual-qa-harden2.js
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
node build-scripts\sprints\check-check-short-exit2.js
```

## Notes

- Baseline shows the UI repairs are complete, but the proof is split across
  separate sprints.
- This sprint should consolidate and harden evidence, not change generated
  lesson output.
- The first emitter run failed because the generated markdown template used
  unescaped JavaScript template-literal backticks. The template was corrected.
- The first checker run after proof generation failed on a wording mismatch in
  the rubric phrase for the source/task split workspace. The checker wording
  was aligned with the rubric.
- The final emitter and checker passed. Prior graph/check/route checkers,
  report JSON validation, roadmap index validation, and scope-language checks
  also passed.
- The tightened checker requires the lead-review, verification, and result
  artifacts. It passed after those artifacts were written.
- Full platform and Book 1 validation passed. `check:platform` still prints
  existing fixture warnings for deliberately bad sample cases, but exits 0.
- `git fetch --prune origin` completed for platform and lesson repositories,
  and both were `0 0` ahead/behind before commit preparation.
- Agent indexes, URL index, and internal dashboard were refreshed; post-map
  visual-QA, report JSON, roadmap index, and broad check-surface checks passed.

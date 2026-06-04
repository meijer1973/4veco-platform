# TASK-CONTEXT-RUNTIME-1 Planning Review

Date: 2026-06-04
Reviewer: planning/review subagent
Initial verdict: REVISE BEFORE IMPLEMENTATION
Post-correction status: READY FOR IMPLEMENTATION WITH GUARDS

## Scope Checked

- Sprint plan: `reports/sprints/TASK-CONTEXT-RUNTIME-1-plan.md`
- Baseline: `reports/sprints/TASK-CONTEXT-RUNTIME-1-baseline.md`
- Plan data: `references/data/sprints/TASK-CONTEXT-RUNTIME-1.plan.json`
- Roadmap row: `TASK-CONTEXT-RUNTIME-1`
- Prior result: `reports/sprints/TASK-CONTEXT-SPEC-1-result.md`
- Prior contract: `reports/json/task-context-spec1-contract.json`

## Required Corrections

1. Replace the incorrect lesson-roadmap input path with `../4veco-lessen/lessen-team-roadmap.md`.
2. Make generated/proof outputs fully explicit, including screenshot manifest, minimum screenshot PNG names, lead-review artifacts, command logs, result files, and diff summary.
3. Add `node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1 --complete` to the acceptance tests and plan JSON.

## Corrections Applied

- The plan now points to `../4veco-lessen/lessen-team-roadmap.md`.
- The Outputs section now lists the exact proof, screenshot, lead-review, command-log, result, and diff files required for closure.
- The final complete bundle validator is listed in both the markdown plan and plan JSON acceptance tests.

## Implementation Guards

- Follow `reports/json/task-context-spec1-contract.json` exactly for supported block types and metadata expectations.
- Keep this runtime-only: no protected references, no source-data writes, no Book 1 generated lesson output, no source reconstruction, no target-equivalent claims, no PV, diagnostics, mastery, or Scale Gate authority.
- Verify DOM order and absence of visible internal IDs through the checker, not screenshots alone.
- Sanitize or escape SVG/markdown rendering; include unsafe SVG and raw copied-image negative coverage.
- Preserve backward compatibility for existing task sets without `contextBlocks`.

## Blockers

No blockers remain after the three corrections above.

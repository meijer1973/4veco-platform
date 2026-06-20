# GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1 Plan

Date: 2026-06-19
Status: implementation bundle plan

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-end-state.md`

Original gate and roadmap context:

- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-result.md`
- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-golden-route-disposition.md`
- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-blocker-log.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`

This sprint is the logical continuation after Product 3P closure: move both `1.1.1` check surfaces into the Golden Exercise Workbench and remove Start-route copy that implies mastery or completion.

## Non-Negotiable Requirements

- Migrate `1.1.1` Exit ticket to a direct Golden Workbench shell.
- Migrate `1.1.1` Korte check to the governed advisory Golden short-check variant.
- Preserve `1.1.1` exit-ticket target flags: `candidate:true`, `gateApproved:true`, `targetReadinessEvidence:true`, `completionLanguageEligible:false`.
- Preserve short-check advisory authority: no target-equivalent proof, no target-readiness evidence, no completion language.
- Add first-class context blocks and context/task references for `1.1.1`.
- Repair first-three Start-route copy so it says local practice progress, not mastery, closure, diagnostics, or sequencing.
- Regenerate lesson output through platform deploy only.
- Provide rendered desktop/mobile proof and a machine checker.
- Do not authorize product-route adoption, diagnostics, mastery/sequencing, PV, summative use, Scale Gate 1, broad product use, or student/product use.

## Internal Architecture Plan

`1.1.1` Exit ticket already has the reviewed target-equivalent task chain:

1. wheat profit calculation;
2. corn opportunity-cost calculation;
3. mixed-allocation profit calculation;
4. comparison plus scarcity explanation.

The migration keeps those task families and adds the Golden Workbench data required by the current renderer:

- `layout.framework: golden_exercise_workbench`
- source/context tables for the farmer and neighbor allocation data
- `contextRefs` on each task
- `operationChain` on each task-shell task

`1.1.1` Korte check stays advisory. It uses the existing choice-task content, adds explicit false target-equivalent flags, and adds local context blocks plus `contextRefs`. It does not become target-equivalent proof.

The prior standalone `EXIT-SHORT-WORKBENCH-111-PLAN-1` work is treated as this sprint's internal architecture phase, not as a separate human-review stopping point.

## Implementation Steps

1. Patch platform source data for `1.1.1-exit-ticket.json`.
2. Patch platform source data for `1.1.1-korte-check.json`.
3. Patch the Start-route quiz shell generator and shared quiz UI/CSS to use neutral practice-progress language and neutral DOM ids/classes.
4. Regenerate Book 1 lesson output through `node scripts/deploy.js`.
5. Capture rendered screenshots for first-three Start pages and the two migrated `1.1.1` check pages.
6. Add a sprint checker that proves source/generated parity, Golden shell boundaries, Start-copy safety, held completion language, screenshots, and authority flags.
7. Run validation and use specialist/lead review before opening paired PRs.

## Acceptance Checks

- `node build-scripts/sprints/capture-golden-route-111-migration-and-start-copy-repair-bundle-1.js`
- `node build-scripts/sprints/check-golden-route-111-migration-and-start-copy-repair-bundle-1.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C <lesson repo> diff --check`

## Stop Conditions

Stop and return a blocker bundle if any required core item is missing: `1.1.1` cannot render as Golden, first-three Start copy still carries mastery/completion language, source/generated parity fails, screenshots cannot be captured, completion language becomes eligible, or the lead reviewer returns anything other than `READY_FOR_HUMAN_GOLDEN_ROUTE_111_REVIEW`.

# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Evidence Map

Generated: 2026-07-01

## Plan And Baseline

- Plan: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`
- Baseline: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`
- Plan review round 1: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round1.md`
- Plan review round 2: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round2.md`

## Implementation Evidence

- Manifest: `references/data/exercise-surface-manifest.json`
- Classifier and historical checker guard: `build-scripts/lib/exercise-currentness.js`
- Currentness checker: `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- npm command: `package.json`
- CI command: `.github/workflows/platform-ci.yml`
- Historical metadata annotations: `references/data/sprints/GAME-UX-2.plan.json`, `references/data/sprints/GAME-UX-2.result.json`, `references/data/sprints/L1.7B-Q2.plan.json`, `references/data/sprints/L1.7B-Q2-COPY.plan.json`, `references/data/sprints/TASK-SHELL-UX-2.plan.json`
- Roadmap annotations: `references/reference-team-roadmap.md`

## Guarded Historical Validators

- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/check-check-route-copy1.js`
- `build-scripts/review-gates/check-gate-check-short-exit2-review-packet.js`
- `build-scripts/review-gates/check-gate-check-short-exit2-retry-review-packet.js`

## Validation Evidence

Command evidence is recorded in
`reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.jsonl`.

Key passed commands:

- `npm.cmd run check:exercise-workflow-currentness`
- `node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

## Authority Boundary

No source-data, generated lesson output, engine behavior, protected reference,
target-exercise registry, candidate storage, product-route, diagnostics,
mastery/sequencing, PV, Scale Gate 1, broad product use, or student/product use
change is included or authorized.

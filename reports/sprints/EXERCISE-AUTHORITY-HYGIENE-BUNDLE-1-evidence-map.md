# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Evidence Map

Generated: 2026-07-01

## Plan And Baseline

- Plan: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`
- Plan metadata: `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.plan.json`
- Baseline: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-baseline.md`
- Plan review round 1: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan-review-round1.md`
- Plan review round 2: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan-review-round2.md`

## Implementation Evidence

- Authority-hygiene manifest: `references/data/exercise-authority-hygiene-manifest.json`
- Deterministic checker: `build-scripts/sprints/check-exercise-authority-hygiene.js`
- npm command: `package.json`
- CI command: `.github/workflows/platform-ci.yml`
- Historical alias note: `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/README.md`
- Roadmap ledger: `references/reference-team-roadmap.md`

## Manifest Coverage

- Canonical exemplar authority: `references/exemplars/1.1.3-exit-ticket/`
- Historical exemplar alias: `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`
- Active Golden fixture root: `build-scripts/sprints/fixtures`
- Frozen Golden report snapshot root: `reports/fixtures/golden-ticket-layout`
- UI fixture index: `references/ui/golden-exercise-checker-fixtures.json`
- Knowledge ZIP: `knowledge/exit-ticket-game-1.1.1.zip`
- ZIP note: `knowledge/exit-ticket-game-1.1.1-note.md`

## Validation Evidence

Command evidence is recorded in
`reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-command-log.jsonl`.

Key passed commands:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`
- `npm.cmd run check:exercise-authority-hygiene`
- `npm.cmd run check:exercise-workflow-currentness`
- `node build-scripts/sprints/check-sprint-bundle.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

## Authority Boundary

No source-data, generated lesson output, engine behavior, protected reference
data, target-exercise registry, product-route adoption, completion-language
authorization, diagnostics, mastery/sequencing, PV, Scale Gate 1, broad
product use, or student/product use is included or authorized.


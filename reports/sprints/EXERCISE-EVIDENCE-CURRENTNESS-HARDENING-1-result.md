# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Result

Generated: 2026-07-01

## Plan reference

Plan: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`

Baseline: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`

## Summary

Completed a durable exercise evidence-currentness hardening bundle. The former
one-off cleanup is now an npm/CI-enforced currentness policy backed by a compact
exercise-surface manifest, a generated-lesson path classifier, guarded
historical validators, and explicit historical metadata status for old
pre-split path references.

The sprint preserved all authority boundaries: no exercise source data,
generated lesson output, engine behavior, protected reference data,
target-exercise registry data, candidate storage, product route, diagnostics,
mastery/sequencing, PV, Scale Gate 1, broad product use, or student/product use
changed or became authorized.

## Acceptance test results

The sprint command log records successful acceptance and closure commands in
`reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.jsonl`.

Passed implementation and platform checks:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1`
- `npm.cmd run check:exercise-workflow-currentness`
- `node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

The full platform Jest suite passed with the repository's existing chapter QA
stderr warnings for fixture content; the process exit code was `0`.

Remote CI repair note: the first draft PR run showed that CI's platform and
presentation validation can leave the sibling lesson checkout dirty with
generated presentation files before later checks run. The currentness CI step
was moved earlier, immediately after `npm ci`, so it validates the clean PR
checkout boundary before mutating validation steps execute.

## Changed files

Currentness policy and checker:

- `references/data/exercise-surface-manifest.json`
- `build-scripts/lib/exercise-currentness.js`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `package.json`
- `.github/workflows/platform-ci.yml`

Guarded historical validators:

- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/check-check-route-copy1.js`
- `build-scripts/review-gates/check-gate-check-short-exit2-review-packet.js`
- `build-scripts/review-gates/check-gate-check-short-exit2-retry-review-packet.js`

Historical/current metadata and roadmap:

- `references/data/sprints/GAME-UX-2.plan.json`
- `references/data/sprints/GAME-UX-2.result.json`
- `references/data/sprints/L1.7B-Q2.plan.json`
- `references/data/sprints/L1.7B-Q2-COPY.plan.json`
- `references/data/sprints/TASK-SHELL-UX-2.plan.json`
- `references/reference-team-roadmap.md`

Sprint governance artifacts:

- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`
- `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.plan.json`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round1.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round2.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-quality-log.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-evidence-map.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.jsonl`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-assignment.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-round1.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-corrections.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-round2.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-round3-ci-repair.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-diff-summary.md`
- `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.result.json`

## Data integrity notes

No protected reference data changed. The currentness checker and diff hygiene
cover `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and candidate-storage
surfaces.

No `source-data/book-1/exit-ticket/*.json` files changed. No engine runtime
files changed. No generated Book 1 lesson output changed; lesson diff hygiene
passed in `../4veco-lessen`.

## Open follow-ups

- Duplicate `1.1.3-exit-ticket` exemplar authority remains deferred to
  `EXEMPLAR-AUTHORITY-113-CANONICALIZATION-1`.
- Golden fixture deduplication remains deferred to
  `GOLDEN-FIXTURE-DEDUP-HYGIENE-1`.
- Historical knowledge ZIP disposition cleanup remains deferred to
  `KNOWLEDGE-ARTIFACT-DISPOSITION-CLEANUP-1`.
- The PR requires PR Readiness Reviewer routing and explicit human review
  before merge because it changes governance/CI behavior.

## Rollback instructions

Before merge, abandon this branch or revert the branch commit. After merge,
revert the PR. No source-data restoration, lesson-output regeneration, engine
rollback, or product-route rollback should be required because the sprint only
changes validation/governance artifacts and metadata annotations.

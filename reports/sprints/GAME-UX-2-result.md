# Sprint GAME-UX-2: Result

Date: 2026-05-26

Status: completed

Lesson output commit: `5c47961` (`4veco-lessen`)

## Plan reference

Plan: `reports/sprints/GAME-UX-2-plan.md`

## Summary

GAME-UX-2 completed the platform-owned checkpoint surface for
`1.1.1 Schaarste en economisch denken`.

Implemented:

- source-controlled checkpoint runtime:
  `engines/exit-ticket-engine.js`, `engines/exit-ticket-ui.js`,
  `engines/exit-ticket.css`;
- source-controlled paragraph-limited data:
  `source-data/book-1/exit-ticket/1.1.1.json`;
- generator:
  `build-scripts/platform/build-exit-ticket-shells.js`;
- deploy integration in `scripts/deploy.js`;
- landing-page copy and activation rules for generated `Check` output;
- focused tests for data shape, neutral language, internal-code leakage,
  compact shared skill-map request, generator dependencies, deploy ordering,
  and landing `Check` activation;
- student-web screenshot QA support for checkpoint pages;
- generated lesson output through platform scripts only.

The old untracked draft zip was not imported, staged, edited, moved, or
deleted.

The generated checkpoint:

- contains four short tasks;
- consumes `SkillMapEngine.createRequest("exit-ticket", ...)` in compact mode;
- renders student-facing labels rather than MTU ids;
- uses local practice/self-check feedback language;
- keeps `Check` visible only for the generated `1.1.1` checkpoint surface;
- does not authorize lesson `L1.7B-R`, `GATE-L1.7B`, Scale Gate 1, broad
  companion scaling, diagnostics, adaptive routing, mastery/sequencing,
  student-facing AI, summative use, PV projection, or PV machine promotion.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-2
npm.cmd test -- --runInBand engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skill-map-engine.test.js engines/tests/skill-map-route-ui.test.js scripts/tests/build-landing-page.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/validate-paragraph.js --mode complete --profile student-web "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/validate-procedure-contracts.js --book-root "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-course-target-exercises-v5.js
npm.cmd test
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
```

Additional screenshot/interaction QA passed:

```bash
node scripts/qa-student-web-pages.js C:\tmp\Codex-work\GAME-UX-2-qa "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – exit-ticket.html" "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html"
```

Full Jest result: 35 passed suites, 6 skipped suites, 554 passed tests, 8
skipped tests. Existing validator-fixture warnings printed during the suite,
but the suite exited successfully.

One transient bookkeeping check was resolved during normal refresh: after
report/dashboard generation, `check-document-inventory.js` initially reported a
checksum mismatch for a regenerated report. `build-reference-inventory.js` was
rerun and the final inventory check passed.

Final complete-bundle validation is expected to run after this result file and
result JSON are present.

## Changed files

Platform source and tests:

- `source-data/book-1/exit-ticket/1.1.1.json`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `engines/tests/exit-ticket-engine.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/platform/build-landing-page.js`
- `scripts/deploy.js`
- `scripts/qa-student-web-pages.js`
- `scripts/tests/build-landing-page.test.js`

Sprint and roadmap evidence:

- `reports/sprints/GAME-UX-2-plan.md`
- `references/data/sprints/GAME-UX-2.plan.json`
- `reports/sprints/GAME-UX-2-baseline.md`
- `reports/sprints/GAME-UX-2-planning-review.md`
- `reports/sprints/GAME-UX-2-result.md`
- `reports/sprints/GAME-UX-2-diff-summary.md`
- `reports/sprints/GAME-UX-2-qa.md`
- `references/data/sprints/GAME-UX-2.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.83-ex7-dry-run-cli-implementation.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

Refreshed generated platform reports and indexes:

- `references/data/source-document-registry.json`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `reports/json/*.json`
- `reports/markdown/*.md`
- `reports/internal-dashboard/*`
- `reports/github-agent-index-*.json`
- `reports/github-agent-index-*.md`
- `reports/url-index.md`

Generated lesson output in lesson commit `5c47961`:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket.css`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/1.1.1.js`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – exit-ticket.html`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/index.html`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` were not edited.

No EX candidate-storage files were created. No q19 extraction execution,
operation-registry mutation, answer-skill mutation, unit minting,
target-exercise promotion, CP-6 closure, Year-1 closure, PV projection, PV
machine promotion, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, or summative use was authorized.

Lesson output was generated through platform scripts only. No generated lesson
file was hand-edited.

## Open follow-ups

- Lesson team may resume `L1.7B-R` using lesson commit `5c47961` and this
  platform sprint evidence.
- Lesson-side student-experience and teacher-learning-quality review should
  inspect the generated `1.1.1` checkpoint and landing `Check` route.
- `GATE-L1.7B` remains required before Scale Gate 1 can treat the checkpoint
  product boundary as accepted.
- Broad companion scaling remains blocked until Scale Gate 1.

## Rollback instructions

Revert the platform GAME-UX-2 commit and the generated lesson commit
`5c47961`. Rollback removes the checkpoint runtime, generator, paragraph-limited source
data, focused tests, sprint logs, roadmap/index updates, and generated lesson
checkpoint files. Do not touch the untracked draft zip,
`references/machine/`, or `references/external/`.

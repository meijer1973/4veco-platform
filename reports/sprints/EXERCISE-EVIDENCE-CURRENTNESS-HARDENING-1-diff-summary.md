# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Diff Summary

Generated: 2026-07-01

## Summary

This diff turns the exercise workflow cleanup into durable repository policy.
It adds a currentness manifest, a generated-lesson path classifier, an
npm/CI-wired currentness checker, and fail-closed guards for historical
validators that still encode old check-surface assumptions.

## Changed areas

- `package.json` exposes `check:exercise-workflow-currentness`.
- `.github/workflows/platform-ci.yml` runs the currentness checker in platform
  CI.
- `references/data/exercise-surface-manifest.json` records current
  first-three short-check/exit-ticket surfaces, same-copy hygiene, legacy
  unsuffixed paths, active evidence files, and current/superseded validators.
- `build-scripts/lib/exercise-currentness.js` centralizes manifest loading,
  generated lesson path classification, and historical checker guards.
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js` now reads
  the manifest, verifies current source/generated paths, rejects legacy
  unsuffixed active evidence, checks historical metadata status fields, proves
  superseded validators fail closed, and guards forbidden local diffs.
- Superseded CHECK-SHORT-EXIT-2 and route-copy validators call
  `guardHistoricalChecker`.
- Historical sprint metadata files now mark legacy pre-split path evidence as
  historical and inactive for CI/agent routing.
- `references/reference-team-roadmap.md` marks the sprint complete and adds
  currentness annotations where old pre-split paths could otherwise look
  current.

## Protected surfaces

No protected surfaces changed:

- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- `engines/`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`

The currentness checker, `git diff --check`, and
`git -C ../4veco-lessen diff --check` verify those boundaries.

## Not included

- No source-data or generated lesson output PR is needed.
- No route migration is included.
- No target-readiness, completion-language, diagnostics, mastery/sequencing,
  PV, Scale Gate 1, summative, broad product-use, or student/product-use
  authority is introduced.
- Exemplar authority, fixture deduplication, and knowledge-artifact disposition
  follow-ups remain separate.

# Sprint VISION-1: Diff Summary

Generated: 2026-06-06

## Summary

`VISION-1` adds a canonical strategic product vision layer above the existing
operational product end-state. The sprint creates human-readable and
machine-readable vision files in the lesson repo, links them from the
agent-facing entry points in both repos, adds a lightweight platform checker,
and records sprint evidence for planning, verification, lead review,
validation, and closure.

## Platform changes

- Updated `AGENTS.md`, `BUILD-PARAGRAPH.md`, `AGENT_GITHUB_ENTRY.md`,
  `RESEARCH_AGENT_MAP.md`, and `build-scripts/README.md` so platform agents
  read `../4veco-lessen/specifications/product-vision.md` as the strategic
  direction while preserving `product-end-state.md` as the operational route
  north star.
- Updated `references/reference-team-roadmap.md` with the `VISION-1`
  specification/governance sprint record and boundary language.
- Added `build-scripts/sprints/check-product-vision-links.js` to verify the
  presence of the vision files, parse the JSON companion, check stable keys,
  and confirm required docs mention `product-vision.md`.
- Added `VISION-1` sprint plan, baseline, planning review, verification
  review, lead-review assignment, command logs, result metadata, result, and
  this diff summary.
- Refreshed repository maps, URL indexes, and dashboard artifacts for
  off-site reviewer navigation.

## Lesson changes

- Added `specifications/product-vision.md` as the canonical strategic product
  vision.
- Added `specifications/product-vision.json` as the compact machine-readable
  companion.
- Updated `AGENTS.md`, `AGENT_GITHUB_ENTRY.md`, `RESEARCH_AGENT_MAP.md`, and
  `lessen-team-roadmap.md` so lesson-side agents can find the strategic
  vision before operational route work.
- Updated `specifications/product-end-state.md` with a short relationship
  note linking the strategic vision without duplicating it.
- Updated `specifications/companion-core-specifications.md` with a short note
  that companion work must preserve both the strategic vision and operational
  end-state.

## Protected surfaces

No protected reference data changed. This sprint did not edit:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/`
- `engines/`
- generated Book 1 lesson output
- generated companion HTML, PDF, DOCX, or PPTX artifacts

No diagnostics, mastery, adaptive routing, automatic sequencing, summative use,
student-facing AI, PV projection, PV machine promotion, Scale Gate 1,
product-wide use, or broad scaling authority was added.

## Rollback scope

Rollback should revert only the `VISION-1` vision/spec/link/checker/sprint
evidence/map/index/dashboard changes in both repos. Do not revert unrelated
work or protected/generated surfaces outside this sprint.

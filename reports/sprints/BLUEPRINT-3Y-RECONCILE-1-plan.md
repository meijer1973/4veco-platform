# BLUEPRINT-3Y-RECONCILE-1 Plan

Status: implementation plan recorded before artifact edits

## Goal

Turn the active four-book v5 blueprint and the older three-year concept into one non-mutating 11-book, three-year exam-training draft.

The sprint does not write student-facing lesson output and does not mutate protected reference registries.

## Source Baseline

Read first:

- `RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENTS.md`
- `CLAUDE.md`
- `references/owned/README.md`
- `references/owned/course-blueprint-v4.md`
- `references/owned/course-blueprint-v4.meta.json`
- `references/owned/course-blueprint-v5.md`
- `references/owned/course-blueprint-v5.meta.json`
- `knowledge/three Year blue print.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `references/reference-team-roadmap.md`
- `build-scripts/references/README.md`
- `reports/reference-planning/REF-CT0-source-authority-boundary.md`
- `reports/reference-planning/REF-CT0-three-year-prototype.md`
- `reports/reference-planning/REF-CT0-mtu-classification.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Quality Floor

The delivered artifacts must:

- preserve v5 as the active Year 1 / Books 1-4 baseline;
- treat v4 as historical evidence, not current authority;
- reconcile the older 13-book concept into the requested 11-book / 4 + 4 + 3 structure;
- represent Year 2 and Year 3 at book level only, without minting paragraphs or MTUs;
- include an exam-operation spine connected to CvTE-style operations, source use, correction-model logic, MTUs, and answer forms;
- explicitly mark current stale assumptions in the older concept, especially A45+ labels that are now live registry facts;
- keep machine, external, target-exercise, and lesson-output surfaces unchanged.

## Deliverables

1. `references/owned/course-blueprint-v6-three-year.md`
2. `references/owned/course-blueprint-v6-three-year.meta.json`
3. `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-reconciliation-report.md`
4. `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-book-level-matrix.md`
5. `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-quality-log.md`
6. Update `references/owned/README.md` so future agents can discover the draft.

## Stop Conditions

- Do not edit `references/machine/*`.
- Do not edit `references/external/*`.
- Do not edit `references/authored/course-target-exercises.json`.
- Do not edit `../4veco-lessen`.
- Do not create student-facing paragraph, chapter, book, game, PDF, or companion output.
- Do not treat this draft as authority for protected reference mutation.

## Verification

After writing the docs:

- confirm no protected paths changed with `git status --short`;
- inspect the generated diff;
- run a targeted text check for required phrases and paths;
- run the agent worktree safety check in non-claim mode.

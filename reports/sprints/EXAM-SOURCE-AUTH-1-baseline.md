# Sprint EXAM-SOURCE-AUTH-1: Baseline

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`

## Current git state

- Platform repo starts from pushed sync baseline
  `eed2a38 Sync exam repair roadmaps`.
- Lesson repo starts from pushed sync baseline
  `9835ae0 Sync exam repair roadmap`.
- Both worktrees were clean before `EXAM-SOURCE-AUTH-1` planning edits.

## Source authority baseline

- `references/reference-team-roadmap.md` names `EXAM-SOURCE-AUTH-1` as the
  next repair sprint.
- `references/data/exam-ingestion/exam-item-overlays.json` contains selected
  record `vw-1022-a-25-1-o:opgave-1:question-3`.
- The selected record declares `source_authority: external_primary`.
- The official prompt PDF exists at
  `references/external/exams/vw-1022-a-25-1-o.pdf`.
- The official correction PDF exists at
  `references/external/exams/vw-1022-a-25-1-c.pdf`.
- The overlay source table `table-1-zoohee-zorgverzekering` contains:
  `["wettelijk eigen risico", 385, 108.25]` and
  `["verhoogd eigen risico", 885, 86.25]`.
- The official answer model contains answer steps and point rules referencing
  `references/external/exams/vw-1022-a-25-1-c.pdf#question-3` and the EUR 649
  threshold.

## Data integrity notes

This sprint starts with no authorized protected reference data changes. It may
read but not edit `references/external/exam-questions.json`, official exam
PDFs, or `references/data/exam-ingestion/exam-item-overlays.json`.

It may not edit `references/machine/`, `references/external/`, source data,
candidate storage, target-exercise records, PV machine-promotion files, or
generated Book 1 lesson output.

## Stop conditions

- Stop if source authority cannot be tied to `external_primary`.
- Stop if the required prompt or correction PDF is missing.
- Stop if the Zoohee source table values in the contract do not match the
  overlay.
- Stop if the checker cannot reject official-style/local substitute evidence.
- Stop if implementation would require source reconstruction, task-shell
  context rendering, transformed tasks, generated lesson output, source-data
  mutation, or protected reference mutation.

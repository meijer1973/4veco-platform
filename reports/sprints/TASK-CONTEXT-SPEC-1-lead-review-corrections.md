# TASK-CONTEXT-SPEC-1 Lead Review Corrections

Date: 2026-06-03

Round-1 verdict: REVISE

## Corrections Applied

1. SVG/figure provenance enforcement

   - Updated `reports/json/task-context-spec1-contract.json` so
     `svg_figure` requires top-level `sourceMaterialId`.
   - Added top-level `sourceMaterialId` to the positive SVG fixture.
   - Updated `build-scripts/sprints/check-task-context-spec1.js` so
     `svg_figure.reconstruction.sourceMaterialId` must also match
     `sourceAuthority.source_material_id`.

2. Hint/feedback leakage coverage

   - Added an explicit negative checker fixture where a task `hint` and
     `feedback` contain answer-threshold leakage.
   - The recursive student-facing text scanner now proves this rejection route,
     not just context body text.

3. Platform validation record

   - The earlier `npm.cmd run check:platform` failure was caused by the active
     Python interpreter missing `python-docx`.
   - Created an ignored workspace validation venv under `tmp/` and installed
     `python-docx` there.
   - Reran `check:platform` through the sprint command wrapper with
     `PYTHON=tmp\task-context-spec1-py\Scripts\python.exe`; the rerun exited
     0 and is recorded in `reports/sprints/TASK-CONTEXT-SPEC-1-command-log`.

## Required Rechecks

- `node build-scripts/sprints/run-sprint-command.js TASK-CONTEXT-SPEC-1 -- node build-scripts/sprints/check-task-context-spec1.js`
- `node build-scripts/sprints/run-sprint-command.js TASK-CONTEXT-SPEC-1 -- node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1`
- Lead-review round 2 must verify the corrected SVG provenance requirement and
  the successful platform validation rerun.

# Sprint ENGINE-OP-1: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/ENGINE-OP-1-plan.md`

## Current roadmap authority

`ENGINE-OP-1` is the active next dependency after GAME-UX-3A in
`references/reference-team-roadmap.md` and `../4veco-lessen/lessen-team-roadmap.md`.
The sprint is authorized as an operational proof audit only. It must inspect
what students actually see and do across `1.1.1`, `1.1.2`, and `1.1.3`; it may
not mutate lesson output or authorize product reliance.

## Generated-output baseline

The audited Book 1 output already contains landing pages and practice surfaces:

- `1.1.1 Schaarste en economisch denken` has landing, reasoning, skill-tree,
  math-skill, procedure, and an exit-ticket/check page.
- `1.1.2 Percentages en indexcijfers` has landing, reasoning, math-skill,
  graph, and procedure pages, but no exit-ticket page in the generated output.
- `1.1.3 Grafieken en tabellen` has landing, reasoning, math-skill, graph, and
  procedure pages, but no exit-ticket page in the generated output.

The shared skill-map runtime files are present in the lesson shared folder.
GAME-UX-3A task-shell source files exist in the platform repo, but this audit
has not yet established any generated-output use of the task shell.

## Initial route observations

Landing-page searches show the visible Redeneren, Rekenen, Grafieken, and Check
labels need paragraph-by-paragraph inspection. `1.1.1` exposes a Check route
through an exit-ticket page. `1.1.2` and `1.1.3` expose Redeneren, Rekenen, and
Grafieken practice links, while the target-equivalent exit-ticket route remains
blocked by prior task-type limitations.

## Data integrity notes

No protected reference data changes are authorized. `references/machine/` and
`references/external/` must remain unchanged. `references/authored/course-target-exercises.json`
must not receive `question_type`, `answer_form`, or mapping fields.

No `references/data/exam-ingestion/answer-skill-candidates.json` file may be
created or written. No generated lesson output under `../4veco-lessen/Boek *`
may change. No source-data mutation, projection refresh, target-equivalent
proof claim, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file is
outside this sprint and must remain untouched and uncommitted.

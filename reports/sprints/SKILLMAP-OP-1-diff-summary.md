# Sprint SKILLMAP-OP-1: Diff Summary

Generated: 2026-05-31

## Summary

The diff adds the student-visible skill-map route layer across shared practice
surfaces and regenerates controlled Book 1 automated output from platform
source changes.

## Platform source changes

- Added `ROUTE_SKILLS` alongside runnable `SKILLS` in
  `engines/skilltree/base-elements.js` and the deploy-time bundled
  `shared/skilltree/base-elements.js`.
- Extended `SkillMapEngine` and `SkillMapRouteUI` with paragraph target,
  route purpose, practice link, per-surface route options, and route-display
  catalog support.
- Wired reasoning, graph, procedure, and math skill-tree surfaces to consume
  per-surface route options.
- Added shared route CSS spacing for the math skill-tree page.
- Added route-output and screenshot capture checks.

## Lesson output changes

`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`
now carries per-surface `skillMapRoutes` for `1.1.1`, `1.1.2`, and `1.1.3`.
The generated automated output changed only through:

```bash
node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

The deploy copied updated shared engines/CSS, regenerated skill-tree data and
shells, regenerated game shells, rebuilt the existing `1.1.1` exit-ticket
shell, and rebuilt landing pages.

## Protected surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no `question_type` or `answer_form` target-exercise fields;
- no `references/data/exam-ingestion/answer-skill-candidates.json`;
- no candidate writes;
- no unit minting, update, split, or deprecation.

## Product authority

This sprint authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Next action

Proceed to `GRAPH-UX-2` to integrate the shared task shell into graph/table
practice and checkpoint UI.


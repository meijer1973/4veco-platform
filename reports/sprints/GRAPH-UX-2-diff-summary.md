# Sprint GRAPH-UX-2: Diff Summary

Generated: 2026-05-31

## Summary

The diff turns the `1.1.3` graph/table route from a graph-specific interaction
surface into a generated route that uses the shared GAME-UX-3A task shell for
overlapping graph/table task families.

The sprint also adds checkpoint-compatible task-shell support in the
exit-ticket runtime without publishing a new checkpoint.

## Platform source changes

- `build-scripts/platform/build-graphical-shells.js` now loads
  `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js` in generated
  graph shells.
- `engines/graphical-engine.js` validates table graph data and task-shell
  graph/table task families.
- `engines/graphical-ui.js` renders graph/table work through
  `TaskShellUI.renderTask`, evaluates through the graph engine task-shell path,
  and renders feedback in a labelled live region.
- `engines/task-shell-ui.js` adds deterministic `aria-pressed="false"` choice
  state and status feedback metadata.
- `engines/task-shell.css` adds feedback-region focus styling.
- `engines/exit-ticket-engine.js` and `engines/exit-ticket-ui.js` support
  checkpoint-compatible `task_shell` tasks without requiring a published
  `1.1.3` checkpoint.
- `build-scripts/content/book-1/b1-113-graphical-data.js` expands generated
  `1.1.3` graph tasks to cover table-value selection, graph reading, economic
  axis convention, interpolation, point placement, graph-construction
  substitute, calculation/work capture, and a less-labelled variant.
- Focused tests under `engines/tests/` cover the new graph/task-shell and
  checkpoint-compatible behavior.

## Generated lesson output

Generated Book 1 output changed only through:

```bash
node build-scripts/content/book-1/b1-113-graphical-data.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Generated `1.1.3` changes:

- graph page loads task-shell assets;
- shared graph runtime files are copied to `shared/`;
- `shared/graphical/1.1.3.js` contains seven graph/table tasks and the required
  task-shell families;
- visible feedback is local, neutral, and accessible.

Generated `1.1.2` side effect:

- `1.1.2 Percentages en indexcijfers – grafiekenspel.html` now loads
  task-shell CSS/JS assets because `build-graphical-shells.js` applies the same
  shell template to all graph-game pages.
- The `1.1.2` graph data file did not change.
- This is an intentional generated-shell support side effect so shared runtime
  files are available consistently; it is not a hand edit and not a new
  `1.1.2` task-shell route claim.

## Sprint evidence

Added GRAPH-UX-2 plan/baseline/planning review, route proof, checkpoint fixture
proof, screenshot manifest, specialist reviews, lead-review files, result,
diff summary, result metadata, screenshot PNGs, and lesson archive records.

## Roadmap changes

- `references/reference-team-roadmap.md` marks GRAPH-UX-2 complete and moves
  the active operational next action to `MATH-UX-2`.
- `../4veco-lessen/lessen-team-roadmap.md` records GRAPH-UX-2 as closed graph
  task-shell integration and moves the active next sprint to `MATH-UX-2`.
- Roadmap version index records v3.24 as archived and v3.25 as active.

## Protected surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no writes to `references/data/exam-ingestion/answer-skill-candidates.json`;
- no answer-skill candidate storage created;
- no candidate writes;
- no target-exercise `question_type` or `answer_form` fields;
- no unit minting, updates, splits, or deprecations.

No `source-data/book-*/exit-ticket/1.1.3.json` file was created or written.

## Product authority

GRAPH-UX-2 authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Carried flags

- `GRAPH-UX2-SE-1`: desktop first-viewport density. Controls begin below the
  first `1280 x 760` viewport. Carry as non-blocking UI polish for later
  engine work.

## Next action

After lead-review round 2 and complete validation, proceed to `MATH-UX-2`.

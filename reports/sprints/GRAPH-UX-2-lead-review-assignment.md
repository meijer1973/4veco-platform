# Sprint GRAPH-UX-2: Lead Review Assignment

Generated: 2026-05-31

Sprint: `GRAPH-UX-2`

## Scope

Assign lead review for the Graph Game + Checkpoint UI Integration sprint.

The lead reviewer must decide whether GRAPH-UX-2 may close as live graph/table
task-shell integration proof. The review must inspect actual generated output,
screenshots, specialist reviews, validation evidence, and product-boundary
controls. Architecture-only proof is not sufficient.

## Assigned Lead Reviewer

Lead reviewer agent: `Hume`, actual review subagent.

Specialist review agents:

- Student-experience reviewer: `Averroes`.
- Accessibility reviewer: `Pasteur`.

Verification reviewer: `Locke`.

The main agent remains accountable for final integration and closure.

## Evidence To Inspect

- `reports/sprints/GRAPH-UX-2-plan.md`
- `references/data/sprints/GRAPH-UX-2.plan.json`
- `reports/sprints/GRAPH-UX-2-baseline.md`
- `reports/sprints/GRAPH-UX-2-planning-review.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-checkpoint-graph-task-fixture.md`
- `reports/sprints/GRAPH-UX-2-screenshot-manifest.md`
- `reports/sprints/GRAPH-UX-2-screenshots/manifest.json`
- `reports/sprints/GRAPH-UX-2-screenshots/*`
- `reports/sprints/GRAPH-UX-2-student-experience-review.md`
- `reports/sprints/GRAPH-UX-2-accessibility-review.md`
- `build-scripts/sprints/check-graph-ux2-route-output.js`
- `build-scripts/sprints/capture-graph-ux2-screenshots.js`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `build-scripts/platform/build-graphical-shells.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- focused tests under `engines/tests/`
- generated Book 1 output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- updated platform and lesson roadmaps

## Required Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Generated-output proof | Lead reviewer | `1.1.3` graph page loads task-shell assets and renders GRAPH-UX-2 task-shell controls | required |
| Required graph/table coverage | Lead reviewer | table-value selection, graph reading, axis convention, interpolation, point placement or graph-construction substitute, calculation/work capture, and less-labelled variant | required |
| Checkpoint boundary | Lead reviewer | checkpoint-style graph fixture uses task shell but remains non-published and `targetReadinessEvidence: false` | required |
| Student experience | Student-experience reviewer plus lead reviewer | route, source, task, feedback, and next action are understandable | required |
| Accessibility | Accessibility reviewer plus lead reviewer | live feedback region, focus repair, mobile/dark rendering, no overlap | required |
| Product boundary | Lead reviewer | no target-equivalent completion, diagnostic, adaptive, mastery, sequencing, summative, AI, PV, Scale Gate, or product-use authority | required |
| Generated-output integrity | Lead reviewer | lesson output changed through platform build/deploy commands only | required |
| Validation evidence | Testing/validation commands | focused Jest, Book 1 deploy/check, route checker, screenshot capture, sprint bundle, scope/report/diff checks | required |

## Stop Conditions

- Stop if task-shell integration is only source-level and not visible in the
  generated `1.1.3` route.
- Stop if a `1.1.3` exit-ticket source/page is published from this sprint.
- Stop if feedback accessibility remains unproven.
- Stop if generated lesson output was hand-patched.
- Stop if target-equivalent completion, diagnostics, adaptive routing,
  mastery/sequencing, summative use, AI, PV, Scale Gate 1, or student/product
  use is authorized or implied.
- Stop if protected references, target-exercise mappings, or answer-skill
  candidate storage changed.

## Expected Review Output

Produce:

- `reports/sprints/GRAPH-UX-2-lead-review-round1.md`
- if required, `reports/sprints/GRAPH-UX-2-lead-review-corrections.md`
- `reports/sprints/GRAPH-UX-2-lead-review-round2.md`

The final verdict must be `PASS` or `PASS WITH FLAGS` before sprint closure.

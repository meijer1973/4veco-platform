# Sprint REASON-UX-2: Student Route Proof

Generated: 2026-05-31

## Scope

This proof covers generated Book 1 reasoning routes for:

- `1.1.1 Schaarste en economisch denken`
- `1.1.2 Percentages en indexcijfers`
- `1.1.3 Grafieken en tabellen`

## Student-Visible Route

Each generated reasoning page now:

- loads `skill-map-route-ui.js` and shows the SKILLMAP-OP-1 route panel;
- loads `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js`;
- offers six modes, with the new sixth mode `Redeneerantwoord opbouwen`;
- renders a `structured_reasoning` task through `TaskShellUI`;
- gives neutral self-check feedback and an example reasoning route after a
  written response;
- keeps all progress language local to practice.

## Generated Output Checked

Generated route files:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.1 Schaarste en economisch denken - redeneer-spel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.2 Percentages en indexcijfers - redeneer-spel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.3 Grafieken en tabellen - redeneer-spel.html`

Shared runtime files:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`

## Validation Evidence

Passed:

- `node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- `node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- `node build-scripts/sprints/capture-reason-ux2-screenshots.js`
- in-app browser check against the generated `1.1.1` reasoning route.

## Boundary Result

No `1.1.2` or `1.1.3` exit-ticket source or page was created. No target
exercise fields, protected references, candidate storage, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or student/product use was authorized.

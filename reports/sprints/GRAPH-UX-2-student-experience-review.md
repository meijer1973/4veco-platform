# Sprint GRAPH-UX-2: Student Experience Review

Generated: 2026-05-31

Reviewer: Student-experience subagent `Averroes`.

## Scope

Review whether a typical 15-year-old 4 vwo economics student can orient in
the `1.1.3` graph/table route, understand why the practice matters, use the
shared task-shell controls, receive useful local feedback, and understand the
next action without target-equivalent completion, mastery, diagnostic,
sequencing, grade, summative, AI, PV, or product-use claims.

## Evidence Inspected

- `reports/sprints/GRAPH-UX-2-plan.md`
- `reports/sprints/GRAPH-UX-2-baseline.md`
- `reports/sprints/GRAPH-UX-2-screenshots/manifest.json`
- `reports/sprints/GRAPH-UX-2-screenshots/desktop-light-113-graph-task-shell.png`
- `reports/sprints/GRAPH-UX-2-screenshots/mobile-light-113-graph-route-first.png`
- `reports/sprints/GRAPH-UX-2-screenshots/desktop-dark-113-graph-task-shell.png`
- `reports/sprints/GRAPH-UX-2-screenshots/mobile-dark-113-graph-feedback.png`
- `build-scripts/sprints/check-graph-ux2-route-output.js`
- `engines/graphical-ui.js`
- `engines/graphical-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket-engine.js`
- generated `1.1.3` graph output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

The reviewer also ran the read-only route checker and observed:

```text
GRAPH-UX-2 route output OK (7 graph tasks; 5 required families)
```

## Verdict

PASS WITH FLAGS

## Findings

The student can orient. The route panel explains the paragraph goal, current
focus, and local-practice boundary. The task shell is genuinely visible in
generated output and uses student-friendly controls for table selection, graph
reading, axis convention, interpolation, point placement, and calculation/work
capture.

The first task is understandable for a typical 4 vwo student: source table,
concrete question, clear choices, `Controleer`, neutral feedback, and
`Volgende opgave`. The mobile screenshots show a strong sequence: route first,
then source, then task, then feedback.

No target-equivalent, mastery, diagnostic, sequencing, grade, summative, AI,
PV, or completion claim is made. The visible boundary language is
understandable:

```text
Alleen lokale oefenvoortgang. Geen diagnose, beoordeling of automatische route.
```

## Carried Flags

| Flag | Severity | Disposition | Owner | Next action |
|---|---|---|---|---|
| `GRAPH-UX2-SE-1` desktop first-viewport control visibility | low | carry forward | `MATH-UX-2` / later engine UI polish | Desktop `1280 x 760` shows route and source before controls; tighten vertical density later if engine UI polish is already in scope. |
| `GRAPH-UX2-SE-2` premature Check wording | resolved during sprint | corrected | `GRAPH-UX-2` | Replaced `paragraaf-check` wording with direct task guidance: `Lees de bron, geef je antwoord en kijk rustig na wat je volgende stap is.` |

## Required Next Action

Carry `GRAPH-UX2-SE-1` into the lead-review record as a non-blocking UI polish
flag. Do not use GRAPH-UX-2 as evidence for broader engine coherence until
`MATH-UX-2`, `REASON-UX-2`, `GAME-ARCH-1`, and `GATE-ENGINE-1` complete or are
explicitly waived.

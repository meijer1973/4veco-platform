# Sprint GRAPH-REFINE-1: Implementation Preparation

Generated: 2026-05-31

## Purpose

Prepare the next graph hardening implementation sprint without executing it.

This document names future file owners, data corrections, validator upgrades,
rendered-output proof, and stop conditions.

## Future Sprint Scope Recommendation

Recommended next graph implementation sprint:

```text
GRAPH-REFINE-2 — Graph Route Target-Operation Implementation
```

Scope:

- repair `1.1.3` graph route data/copy to match price vertical and quantity
  horizontal;
- add target-specific interpolation at EUR 1.75;
- add target-specific 50 percent drop interval identification and explanation;
- keep graph tasks inside the shared route/task-shell model;
- regenerate Book 1 output only through platform build/deploy commands;
- produce screenshots and live-output proof;
- keep target-equivalent exit-ticket claims held.

## Future File Owners

| Future file | Owner role | Planned change type |
|---|---|---|
| `build-scripts/content/book-1/b1-113-graphical-data.js` | graph route data builder | Revise/add target-aligned graph task data and copy |
| `engines/graphical-engine.js` | graph task validation/evaluation | Only change if current task-shell response shapes cannot represent target-aligned P/Q graph tasks |
| `engines/graphical-ui.js` | graph visual/task wrapper | Only change if rendered chart orientation or point-placement UI needs target-aligned P/Q support |
| `engines/graphical.css` | graph visual styling | Only change if axis labels/point-placement layout need visual repair |
| `build-scripts/sprints/check-graph-ux2-route-output.js` or a new checker | generated-output validation | Add checks for target-aligned axis convention and target-chain tasks |
| `reports/sprints/GRAPH-REFINE-2-*` | sprint evidence | Plan, proof, screenshots, reviews, result |

## Required Data Corrections

The future implementation must correct or isolate wrong-axis wording.

Forbidden for target-chain tasks:

```text
Prijs staat op de horizontale as.
Hoeveelheid of aantal staat op de verticale as.
Prijs is de x-waarde; aantal is de y-waarde.
```

Required for target-chain tasks:

```text
Prijs staat op de verticale as.
Hoeveelheid of aantal staat op de horizontale as.
Bij een punt gebruik je hoeveelheid horizontaal en prijs verticaal.
```

If generic graph tasks retain price-as-x examples, they must be separated from
the `1.1.3` target-chain evidence and must not be used for target-equivalent
coverage.

## Required Target-Specific Tasks

Future implementation should add or revise tasks for the target ice-cream
table:

1. Select a price and matching quantity from the target table.
2. State/select the target axis convention: price vertical, quantity
   horizontal.
3. Place or specify at least two target table points using quantity as
   horizontal coordinate and price as vertical coordinate.
4. Interpolate quantity sold at EUR 1.75, expecting approximately 350 ice
   creams.
5. Identify that sales drop 50 percent from 200 to 100 ice creams.
6. Name the matching price interval: EUR 2.50 to EUR 3.00.
7. Explain the newspaper claim using source values from the table.

## Validator Upgrades

Future validator must fail if:

- no target-chain task names price vertical and quantity horizontal;
- any target-chain task says price is horizontal/x or quantity is vertical/y;
- interpolation evidence is not tied to EUR 1.75 and target values 400/300;
- 50 percent drop evidence is not tied to 200/100 and EUR 2.50/EUR 3.00;
- rendered graph route lacks shared task-shell markers;
- `1.1.3` exit-ticket page is published without later authority;
- product-boundary language claims proof, mastery, diagnostics, sequencing,
  summative status, PV, Scale Gate 1, or product use.

## Rendered-Output Proof Requirements

Future implementation closure must inspect rendered output, not only data.

Minimum screenshots/live checks:

- desktop light: target-aligned axis convention task;
- mobile light: route panel before target graph task controls;
- desktop or mobile dark: interpolation feedback;
- desktop or mobile dark: 50 percent drop explanation/self-check feedback;
- visible feedback focus state after a graph task answer;
- route/feedback copy showing local practice only.

## Reviews Required Later

Future implementation should include:

- student-experience review focused on whether a 15-year-old sees the P/Q
  convention clearly;
- accessibility review focused on graph labels, mobile axis readability, focus
  state, and dark-mode contrast;
- teacher/learning-quality review focused on whether the route actually
  prepares the `1.1.3` target exercise;
- lead-review cycle before closure.

## Stop Conditions For Future Implementation

Stop if future implementation:

- keeps wrong-axis wording inside target-chain tasks;
- treats generic graph practice as target-chain coverage;
- publishes a target-equivalent `1.1.3` exit ticket without `L1.7B-Q2` and
  `GATE-L1.7B-Q2`;
- adds private graph task UI for a task-shell family already supported;
- writes target-exercise fields or protected references;
- claims diagnostics, mastery, automatic sequencing, summative status, PV,
  Scale Gate 1, or product use.

## Authority Boundary

GRAPH-REFINE-1 does not authorize `GRAPH-REFINE-2`. It only prepares the
implementation route. A later sprint must be explicitly started with its own
plan, validation, reviews, and closure.

# Sprint GAME-ARCH-2: Architecture Map

Generated: 2026-05-31

## Purpose

This map defines the intended operational spine for the practice system after
`GAME-ARCH-1`.

It is a planning artifact only. It authorizes no engine implementation,
generated lesson output, target-equivalent completion claims, diagnostics,
adaptive routing, mastery, sequencing, summative use, PV, Scale Gate 1, or
student/product use.

## Canonical Student Path

```text
Landing page
  -> shared route panel
  -> domain practice/check surface
       - graph/table practice
       - math/calculation practice
       - reasoning practice
       - advisory short check
       - target-equivalent checkpoint composition
  -> shared task shell where task families overlap
  -> neutral local feedback
  -> next action in the route
```

## Layer Map

| Layer | Shared responsibility | Domain responsibility | Current evidence | GAME-ARCH-2 decision |
|---|---|---|---|---|
| Landing route entry | Show `Start`, `Leer`, `Oefen`, optional `Check`, and route links without internal codes | Choose which paragraph surfaces are available | `build-scripts/platform/build-landing-page.js` routes practice surfaces and keeps `Check` gated | Keep, then wrap future route recommendations around route API |
| Shared route panel | Paragraph target, route purpose, relevant skills, recommended focus, local progress, practice action, local-only boundary text | Surface selects aspect: reasoning, calculation, graphical, checkpoint, or mixed | `engines/skill-map-engine.js`, `engines/skill-map-route-ui.js`; SKILLMAP-OP-1 live proof | Keep and harden as canonical route layer |
| Graph/table module | Consume route API and task shell, return graph/table tasks and graph payload | Tables, graphs, axis convention, interpolation, point placement, graph construction substitute | GRAPH-UX-2 live route proof | Keep/refactor as reference pattern |
| Math/calculation module | Consume route API and task shell, return calculation/index tasks | Formula choice, substitution, work capture, final answer, notation/unit checks | MATH-UX-2 live route proof | Refactor around target-operation chains |
| Reasoning module | Consume route API and task shell for structured response where useful | Causal chains, answer-form scaffolding, example-chain comparison, repair cues | REASON-UX-2 live route proof | Refactor around answer-form standards |
| Advisory short check | Use task shell and route API only for local advice | Select small local evidence and advice copy | `1.1.1` current check with `targetReadinessEvidence: false`; GAME-ARCH-1 boundary | Keep separate from exit ticket |
| Target-equivalent checkpoint composition | Use task shell families to compose full target-operation chain | Same-level operation chain and answer forms for paragraph target exercise | Runtime exists, but no `1.1.2` or `1.1.3` publication | Hold for `L1.7B-Q2` and `GATE-L1.7B-Q2` |
| Feedback layer | Neutral local feedback, retry/self-check states, practice route links | Domain-specific explanation of graph, calculation, or reasoning error | Task shell plus graph/math/reasoning wrappers | Centralize common grammar in task shell; allow domain helpers |
| State layer | Local practice state only; no proof/mastery inference | Surface-specific attempt state where needed | Current engines each own local state | Define ownership; reduce drift in later implementation |

## Shared Versus Domain-Specific Rule

Shared layers own:

- route request normalization and route view-model construction;
- route display grammar;
- local-only progress language;
- task-family rendering;
- generic validation and self-check state;
- feedback region and focus expectations;
- blocked terms and internal-code checks;
- next-action shape.

Domain modules own:

- graph/table data and graph rendering payloads;
- calculation formulas, notation expectations, and common calculation errors;
- reasoning chain structures, answer-form scaffolds, and examples;
- checkpoint composition from reviewed target-operation chains.

## Short Check And Exit Ticket Separation

The route may contain both:

```text
short check = advisory local route check
exit ticket = separate target-equivalent proof task
```

| Surface | Purpose | Allowed result | Not allowed |
|---|---|---|---|
| Advisory short check | Local route advice and in-between check | Suggest a named practice route, suggest trying the exit ticket, or suggest continuing while revisiting a weak skill later | Target-equivalent proof, grade, diagnostic classification, mastery, automatic route decision |
| Target-equivalent exit ticket | Same-level proof task for the paragraph target exercise | Local paragraph-completion language only after `GATE-L1.7B-Q2` approval | Shortened advisory check, summative judgement, permanent mastery, automatic sequencing |

## Architecture Consequence

Future implementation should treat the shared route layer and shared task shell
as the default. A domain-specific UI/state/feedback path is acceptable only
when it represents a genuinely domain-specific action. If it duplicates a
shared task family, it should be wrapped, refactored, or rebuilt around the
shared shell.

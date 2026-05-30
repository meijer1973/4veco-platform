# Sprint ENGINE-OP-1: Operational Audit

Generated: 2026-05-31

Plan: `reports/sprints/ENGINE-OP-1-plan.md`

## Verdict

ENGINE-OP-1 closes as **PASS WITH FLAGS for audit completion only**. The current
student-facing output has real operational progress, especially the restored
math route for `1.1.2` and the graph/table practice route for `1.1.3`, but it
does not yet prove a coherent four-engine product route.

Architecture-only proof remains insufficient. The shared skill-map route is
visible in several engines, but the route data is inconsistent. The shared
GAME-UX-3A task shell is not present in generated output. `1.1.2` and `1.1.3`
still have no target-equivalent checkpoint route.

## What Works Now

- `1.1.2` landing page visibly offers Redeneren, Rekenen, and Grafieken.
- `1.1.2` math route opens as scoped `wiskundevaardigheden.html` with
  `Procentuele verandering berekenen` and `Prijsindex (CPI) berekenen`.
- `1.1.3` landing page visibly offers Redeneren, Rekenen, and Grafieken.
- `1.1.3` graph game is useful operationally: it shows a graph-reading task,
  scoped route focus, numeric input, unit context, neutral feedback, and a
  next-opgave button.
- `1.1.1` check route gives local formative feedback and next-step suggestions
  without target-equivalent proof language.
- Shared boundary copy is visible on route panels: local practice only, no
  diagnosis, assessment, or automatic route.

## Main Findings

| Finding | Severity | Evidence | Required follow-up |
|---|---:|---|---|
| Shared task shell is not student-visible in generated output | High | `rg` found no `task-shell`, `TaskShell`, or task-family identifiers in Book 1 generated output. Graph and math tasks use engine-specific UIs. | GRAPH-UX-2, MATH-UX-2, and L1.7B-Q2 must integrate GAME-UX-3A before claiming coherent task-type UI. |
| `1.1.2` and `1.1.3` have no target-equivalent checkpoint route | High | Only `1.1.1` has an `* exit-ticket.html` file; landing pages for `1.1.2` and `1.1.3` have no paragraph Check section. | L1.7B-Q2 after task-shell and route integration; GATE-L1.7B-Q2 before local paragraph-completion claims. |
| Shared skill-map route panels can be empty | High | `1.1.2` Redeneren and Grafieken route panels say "Deze route is nog niet gevuld." | SKILLMAP-OP-1 must make route scope operational before engine scaling. |
| Shared route can be mis-scoped | High | `1.1.1` Redeneren route recommends `Vergelijking oplossen`, `Substitueren`, and `Tabelwaarden selecteren voor berekening` for a schaarste/alternatieve-kosten paragraph. | SKILLMAP-OP-1 must fix aspect/target filtering and target-skill mapping. |
| Math route is operational but not visibly unified with the shared route panel | Medium | `1.1.2` and `1.1.3` math pages show scoped skill-tree cards and exercises, but not the shared route panel/feedback language used by graph/reasoning. | MATH-UX-2 should integrate shared task shell and route language. |
| Graph route is strongest current operational proof but still engine-specific | Medium | `1.1.3` graph task gives correct neutral feedback: "Goed gelezen" plus source/value/calculation feedback. The UI is not GAME-UX-3A task-shell output. | GRAPH-UX-2 should reuse the shared task shell and align graph practice/checkpoint UI. |
| Reasoning practice exists but is not yet target-route proof | Medium | Reasoning pages expose five modes and session counters. Route panels are sometimes empty/mis-scoped, and task feedback remains local to engine mode. | REASON-UX-2 should improve variants, feedback, and route-target alignment after SKILLMAP-OP-1. |

## Product Boundary Check

No observed output authorized or created:

- target-equivalent completion claim;
- grade or summative pass/fail;
- adaptive diagnostic classification;
- automatic sequencing across paragraphs;
- permanent mastery claim;
- student-facing AI decision;
- PV projection or machine promotion;
- Scale Gate 1 reliance.

The existing `1.1.1` check remains a local short check. It should not be
described as proof that the student can complete the paragraph target exercise.

## Downstream Decision

Proceed to `SKILLMAP-OP-1` before graph/math/reasoning scale work. The audit
shows that the route layer is the current integration bottleneck: engines can
open, but the route shown to the student is not yet consistently scoped,
complete, or clearly tied to the paragraph target. After SKILLMAP-OP-1,
continue with GRAPH-UX-2, MATH-UX-2, REASON-UX-2, GAME-ARCH-1, and
GATE-ENGINE-1 as already roadmapped.

Do not start L1.7B-Q2 target-equivalent checkpoint implementation until the
shared route and task-shell integration are strong enough to support a complete
reviewed operation and answer-form chain.

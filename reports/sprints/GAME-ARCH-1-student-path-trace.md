# Sprint GAME-ARCH-1: Student-Path Trace

Generated: 2026-05-31

## Method

This trace uses the current generated Book 1 output as read-only evidence. No
generated lesson output was regenerated or hand-edited for GAME-ARCH-1.

Fresh route-output validators passed before this trace was written:

```text
GRAPH-UX-2 route output OK (7 graph tasks; 5 required families)
MATH-UX-2 route output OK (8 A38/A39 task-shell steps; 4 required families)
REASON-UX-2 route output OK (3 reasoning pages; six modes; structured_reasoning task shell)
```

Recent rendered-output evidence was also inspected:

- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`

## Trace Table

| Paragraph | Landing / route entry | Shared route state | Practice or check surface | Shared task-shell state | Feedback / next action | GAME-ARCH-1 judgment |
|---|---|---|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Landing has `Start`, `Leer`, `Oefen`, `Check`, and `Verdiep`; `Check` opens the current `Korte check`. | SKILLMAP-OP-1 corrected the earlier mis-scoping and the reasoning route now shows schaarste/alternatieve-kosten route labels without internal MTU codes. | Redeneren now offers six modes including `Redeneerantwoord opbouwen`; the short check remains a local four-task checkpoint. | Reasoning uses `structured_reasoning` through the shared task shell; the short check can use checkpoint UI but remains `targetReadinessEvidence: false`. | Short-check feedback is local advice such as practising more with a named route; reasoning feedback gives repair cues and example chains. | Keep the short check as an advisory local check. Do not treat it as paragraph proof. Target-equivalent exit-ticket work remains separate. |
| `1.1.2` Percentages en indexcijfers | Landing exposes `Redeneren`, `Rekenen`, and `Grafieken`; no paragraph `Check` page exists. | Math, graph, and reasoning routes now show relevant route panels; the math route is scoped to percentage and index skills. | `wiskundevaardigheden.html` is the primary calculation route; reasoning and graph routes are supporting practice surfaces. | Math uses shared task-shell steps for numeric input, calculation/work capture, final-answer entry, and unit/notation fields for `A38` and `A39`. | Math gives retry/self-check feedback; reasoning gives structured self-check and repair cues. | Refactor math around the complete target chain. Current practice is strong but not a target-equivalent exit ticket. |
| `1.1.3` Grafieken en tabellen | Landing exposes `Redeneren`, `Rekenen`, and `Grafieken`; no paragraph `Check` page exists. | Graph, math, and reasoning routes show graph/table and data-use route labels. | `grafiekenspel.html` is the strongest current operational route and includes table, graph, axis, interpolation, point placement, construction substitute, and calculation tasks. | Graph route uses the shared task shell for seven tasks across required graph/table families; checkpoint-style graph tasks exist only as non-published fixtures. | Graph feedback is labelled, local, and focus-managed; it does not claim diagnosis, assessment, or automatic route. | Keep/refactor graph as the reference pattern, then validate against the complete target operation chain before exit-ticket use. |

## Cross-Route Findings

- The shared route layer is now visibly useful; it should be kept and hardened
  rather than replaced.
- The shared task shell is now used by graph, math, and reasoning practice; it
  should become the canonical interaction layer where task actions overlap.
- Graph/table practice is the strongest current route and should act as the
  reference pattern for task-shell integration.
- Math/calculation practice is credible but must be tied more tightly to the
  target-exercise operation chain before target-equivalent proof.
- Reasoning practice has stronger self-check and feedback, but it still needs
  answer-form and constructed-response standards before exam-style proof.
- The current short check is useful and should remain, but only as advisory
  local guidance.
- No current route proves paragraph-level target-equivalent exit-ticket
  readiness for `1.1.2` or `1.1.3`.

## Product Boundary

This trace authorizes no generated output, target-equivalent completion copy,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

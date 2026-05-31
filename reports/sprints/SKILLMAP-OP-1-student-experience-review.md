# SKILLMAP-OP-1 Student Experience Review

Generated: 2026-05-31

Reviewer role: `agents/student-experience-review-agent.md`

Scope: focused student-experience review of the SKILLMAP-OP-1 visible route
evidence. This review checks whether a typical 4 vwo economics student can
orient, understand the relevance of the route, identify the next action, avoid
confusing route/progress language, and avoid internal-code leakage.

This is not a target-equivalent proof review and does not authorize product
scale, diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV projection, Scale Gate 1, or student/product-use claims.

## Evidence Inspected

- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-screenshots/manifest.json`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-111-reasoning.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-112-reasoning.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-112-math.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/mobile-112-math.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-113-graph.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/mobile-113-graph.png`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- Generated Book 1 route output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`

## Student Experience Summary

- Verdict: PASS WITH FLAGS
- Total Score: 10/12
- Final Student Readiness Judgment: usable as route-visibility proof, but not
  ready to support product-scale or target-equivalent completion claims.

The route panels are visible, readable, and mostly understandable. A typical
student can see the paragraph, the practice mode, the paragraph goal, a focus
skill, the next practice action, and a local progress state. The route panels
also avoid visible internal MTU codes in the inspected rendered evidence.

The sprint therefore passes the focused student route-visibility standard. It
does not yet fully satisfy the stronger product experience standard where the
route, game task, feedback, and next step feel like one coherent learning
journey across all engines.

## Rubric

- Orientation: 2/2
- Affordance: 2/2
- Cognitive Load: 1/2
- Motivation: 1/2
- Confusion Control: 2/2
- Graphical Support and Text-Visual Linking: 2/2

## Pass 0 - Student Role And Context

The student is expected to practise a paragraph-relevant skill in one of three
practice surfaces: reasoning, math/calculation, or graph/table reading. The
route panel should explain which skill subset matters, why this practice page
belongs to the paragraph target, and what action the student should take next.

The student should first choose or continue the recommended route focus, then
use the corresponding game or skill card. When done, the route only supports
local practice progress. It does not claim completion, diagnosis, mastery, or
automatic progression.

## What The Student Will Understand

- The paragraph identity is visible in the page headers, such as `1.1.2
  Percentages en indexcijfers` and `1.1.3 Grafieken en tabellen`.
- The route purpose is visible through `PARAGRAAFDOEL` and a short practical
  sentence, for example practising percentage/index calculation with visible
  intermediate steps.
- The next action is clear because the route contains direct buttons such as
  `Open redeneer-spel`, `Open rekenroute`, and `Open grafiekenspel`.
- The focus state is understandable: `Focus: Procentuele verandering
  berekenen` or `Focus: Tabelwaarden selecteren voor berekening` tells the
  student what to practise first.
- Progress language is clearly local and non-summative: `Alleen lokale
  oefenvoortgang. Geen diagnose, beoordeling of automatische route.`
- The inspected rendered route text does not expose visible MTU codes such as
  `A38`, `B01`, `GEN_*`, or `MTU`.

## Where The Student May Get Lost

- The `1.1.2` reasoning page combines the label `REKENEN` with `Oefenroute
  Redeneren`. This is defensible because the reasoning game is being used to
  verbalize calculation steps, but a student may wonder whether the page is for
  reasoning or calculation. The route purpose sentence helps, but the mixed
  label should be made more explicit before scaling.
- On the graph mobile screenshot, the route panel appears after the first graph
  task. The student can still do the task because the task instructions are
  clear, but the route is not functioning as first-screen orientation on mobile.
- The right side of the reasoning pages now contains multiple progress
  surfaces: the SKILLMAP route panel, `Deze sessie`, and `Oefenvoortgang`.
  These do not contradict each other, but they ask the student to interpret
  several progress systems at once.
- The boundary sentence is safe but administrative. `Geen diagnose,
  beoordeling of automatische route` protects governance, but for a student it
  reads more like system policy than helpful guidance.

## Motivation Risks

- All route items start at `0/3`. This is honest, but when combined with other
  empty progress displays it can make the page feel like a dashboard of zeros
  rather than an inviting next step.
- `later nodig` and `beschikbaar` are understandable, but they do not yet give
  a warm next-step sequence. A student may not know whether `later nodig` means
  locked, postponed, or simply second in the route.
- The route panels do not yet provide a small success expectation such as
  "begin met deze ene vaardigheid" or "daarna kun je de volgende stap openen."
  The current wording is clear, but not strongly motivating.

## Graphical Support And Text-Visual Linking

- The `1.1.3` graph screenshots show a readable bar chart with title, axis
  label, prices, and values. The nearby instruction block says: read the title
  and axes, find the requested period or value, read the graph value, and only
  then enter the answer. This is good text-visual linking for a 4 vwo student.
- The route panel reinforces the graph/table learning path by naming
  `Tabelwaarden selecteren voor berekening`, `Waarden aflezen uit
  staafdiagram`, and `Waarden aflezen uit lijngrafiek`.
- Main risk: on mobile, the route guidance appears below the graph task rather
  than before it. For route-visibility proof this is acceptable; for full
  graph/table operationalization, the route should orient the student before
  or at the first task.
- Required fix for later graph work: `GRAPH-UX-2` should integrate route
  guidance with the shared task shell so the student sees the route cue and the
  graph-reading task as one coherent interaction.

## Internal-Code Leakage Check

No visible internal-code leakage was found in the reviewed route screenshots or
route text excerpts. Source files and generated data still contain internal IDs
as expected, but the inspected student-facing route panels display student
labels rather than MTU IDs.

## Required Revisions

These revisions are required before claiming broader product-scale readiness,
but they do not block SKILLMAP-OP-1 as route-visibility proof.

1. Clarify mixed-mode route labels. Where a reasoning page supports a
   calculation route, change the route copy from a potentially ambiguous
   `REKENEN` plus `Oefenroute Redeneren` combination to a clearer student
   phrase such as "Rekenen uitleggen" or "Rekenstappen hardop ordenen."
2. Improve mobile first-screen orientation for graph/table routes. In
   `GRAPH-UX-2`, add a compact route cue above or inside the first graph task
   so mobile students see why the task belongs to the route before they answer.
3. Simplify progress/boundary language for students. Keep the governance
   boundary, but consider friendlier wording such as local practice progress
   and no grade/automatic next step, instead of policy-like phrasing.
4. Reduce competing progress systems where possible. The route panel, session
   progress, and global practice progress should have visibly distinct roles:
   route focus, current-session results, and long-term practice history.
5. Run the separate accessibility review before round-2 lead review, because
   this focused review did not verify keyboard order, screen-reader semantics,
   contrast, or reduced-motion behavior.

## Final Student Readiness Judgment

SKILLMAP-OP-1 is student-usable for the narrow goal it set: making the shared
skill-map route visible and understandable in generated output. A typical 4 vwo
student can orient, see what to practise next, understand the basic relevance
of the route, and avoid internal-code confusion.

The sprint should close student-experience review as PASS WITH FLAGS. The next
required action is not more bookkeeping: run the accessibility review, record
the correction log, and have the lead reviewer perform a round-2 recheck that
explicitly treats this review as evidence. Product-scale claims remain blocked
until later operational engine and target-equivalent gates prove the full
student route.

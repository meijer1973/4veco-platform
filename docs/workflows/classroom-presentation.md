# Classroom PowerPoint

This is the default for a request to build a paragraph's PowerPoint or
lespresentatie: a Dutch projection aid for the teacher, 4 vwo economics, with
editable PPTX and matching slide PDF. It is scoped Part B work. Do not expand
it into a complete web companion or rewrite textbook content. The installed
presentation skill supplies current tool APIs; this recipe supplies the lesson.

## Source facts before slide design

Use the adjacent `../4veco-lessen/` repository. Its map identifies the current
edition; inspect actual files rather than trusting an old generated inventory.
For Book 2 use `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/`:
editable student text under `bronnen/H*/manuscript/`, chapter answers and teacher
guidance under `bronnen/H*/`, complete current student PDF under `boek/`.
Verify page references against **printed book footers**, not physical PDF indices
or standalone paragraph page indices. In the §2.1.1 reference, printed page 6 is
physical PDF page 8; verify the relevant pages anew for another paragraph/edition.

For current Book 3 use `edities/books34-v3/books/book-3/`, not the historical
v2 materials under the old `Boek 3 - ...` directory. Each `chapters/3.M/` holds
the paragraph's `3.M.K manuscript.md`, chapter-wide `Antwoorden.md` and
`Docenteninformatie.md`, and figures in `_assets/`. The complete student PDF
is `output/Boek_3_Compleet_v3.pdf`. A target's context or source blocks can
precede its exercise container; read the complete manuscript and printed
target pages. Use the actual current edition map for subsequent books too.

Before authoring, record a small source/assignment manifest containing the
edition, lesson commit, source paths/hashes, paragraph title and type (theory
or gemengde opgaven), goals, start/page, basis, independent, target and homework.
Plan instruction backwards from the actual target operations, using the book's
notation, terminology and assumptions. Read its full question and answer model.
Missing/conflicting sources must be reported; never fabricate a purported
textbook exercise, source, answer model or page reference. A textbook error
needs a named source repair, not a silent slide rewrite. An authored teaching
example is allowed and must be identified separately in the manifest and notes.

Read the chapter's prerequisite guidance and relevant preceding paragraphs as
well. In the manifest, trace each operation needed by the start assignment and
later practice to either earlier teaching (with a source anchor) or instruction
in this lesson. Include changes of representation and assumptions, not only
concept names. A previous paragraph's title or an exercise that asks for an
operation is not evidence that it taught that operation. Refresh fragile prior
knowledge briefly; do not require pupils to infer a new procedure unaided.

### Exercise mapping: durable teacher preference

In the current Book 2 edition, **Startopgaven** are the start assignment,
**Begeleide inoefening** is basis work, followed by **Zelfstandige oefening**
and **Doeloefening**. Include all actual guided exercises, whose count varies.
Homework is basis + independent + target, explicitly numbered, **Maken en
nakijken**. Bonus and Herhaling are extra unless assigned. The teacher confirmed
§2.1.1: start 1–2, basis 3–4, independent 5–6, target 7, homework 3–7. Derive
each new paragraph's numbers from its own headings and teacher route.

**A book's Startopgaven are not necessarily retrieval before instruction.**
Inspect their actual demands and the book's reading order. In this edition the
theory and worked example precede Startopgaven in print. Preserve the teacher's
assigned start numbers, but distinguish retrieval from first encounters. When a
start item uses new content, make its status and support visible on the opening
overview: for example, `2: verkennen met de theorie, p. …`, using verified printed
pages. Notes identify the new operation, how pupils can find/use that support,
and a return to the item after instruction before independent practice. Treat
that attempt as exploration, not assumed mastery or an unaided retrieval test.
This is conditional on the actual item; do not hardcode exercise 2 as always new
or supply its worked answer in the opening slide. The support line belongs to
the shared overview source and must remain readable.

For older editions without those headings, the original default is the first
two Herhaling exercises as start, Startoefeningen as basis, Zelfstandig + Doel
as core work. Do not apply that older mapping to the current Book 2 edition.
Only ask when source ambiguity remains after inspecting the actual edition.

For gemengde opgaven: start with the first actual exercise in that paragraph
(exercise 1 only when its numbering starts at 1); homework is **all** mixed exercises
with real numbers, retaining bonus labels. Select a representative real exercise
for discussion and explain that choice in notes. Give short recall/approach
support, without inventing new theory or treating it as a theory paragraph.

## Fixed lesson sequence

1. **Deze les** overview, left on screen during the start assignment.
2. Learning goals and necessary instruction. Demonstrate the required operations
   with a short, separate teaching example using its own context and data,
   aligned with the paragraph's method, terminology and difficulty. Label an
   authored example `Uitlegvoorbeeld — niet uit het boek`; give it no fabricated
   book number or page. Do not work out assigned practice questions as the
   default explanation, including non-target questions. Teacher-chosen feedback
   on an already attempted start assignment is optional and separate from this
   example. A short understanding check may use the example, without adding
   homework. Keep this recap particularly brief for mixed exercises.
3. The **same overview** during independent practice.
4. Discuss the **actual target exercise**. First show its complete context,
   data/visuals and **every subquestion without solutions**, splitting across
   readable slides as needed. After all questions are available, reveal the
   answers in steps: setup, substitution, result, units, reasoning and check.
   Cover all requested operations, not only final numbers.
5. The **same overview** for closure and homework.

### One overview source, three uses

Title: `Deze les: §x.x.x [title]`. One slide contains the route, concise learning
goals, start block (`Pagina …`, `Opgaven …`) and homework block (paragraph,
exact exercise numbers, `Maken en nakijken`). Show basis, independent and target
numbers. Use **one shared function/data source** for all three copies; content
and geometry match, except current-phase emphasis/marker and slide number.
Do not split the route, goals, start and homework across separate slides.

Use this classroom wording:

1. Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.
2. Maak de startopdracht.
3. Uitleg bij de lesdoelen.
4. Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.
5. Klaar? Werk aan een ander vak. Geen devices.
6. Bespreken van de doelopgave. (Append the actual exercise number.)
7. Zet je huiswerk in je agenda.

For mixed exercises replace step 3 with `Korte herhaling en aanpak.`, step 4 with
`Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.` and
step 6 with discussion of the selected real exercise.

## Visual and teaching reference

The accepted §2.1.1 deck lives with that paragraph's lesson materials. Its
editable source is `build-scripts/content/book-2/presentation-211.mjs`; its
adjacent manifest records the source and assignment. Render/inspect the actual
reference when adapting its visual family: calm white 16:9 slides, Arial,
blue/green/orange emphasis, flat native tables and progressive economic graphs.
Its 23 slides, 9 tables and 2 charts are evidence, **not quotas**. Reuse the
useful source helpers, then derive the new goals, examples and target from the
new paragraph. Do not copy old numbers or content by search-and-replace.

- Support live explanation rather than reproducing textbook paragraphs. One
  clear teaching move per slide; relate representations to their meaning.
- Ordinary projected text is at least 20–22 pt; labels at least 14 pt. The
  reference uses 30 CSS px = 22.5 pt in its dense overview and larger text
  elsewhere. Artifact-tool geometry/font sizes use CSS pixels, not points.
  Reflow or split crowded content instead of shrinking it below these floors.
- Keep tables, formulas, graphs, axes and callouts editable wherever feasible.
  Use native XY/scatter charts for numeric quantity axes. Category line charts
  can put Q=0 at the wrong horizontal position. Verify actual coordinates,
  zero, capacity, crossings and consistent axes across progressive graph slides.
  Inspect the saved PowerPoint rendering for unintended smoothing of straight
  segments, including guide lines and hatched-area boundaries. Correct numeric
  endpoints alone do not prove that the rendered boundary is straight. For
  straight XY series, preserve explicit per-series `c:smooth val="0"` in the
  saved package when the exporter otherwise introduces smoothing. Check direct
  curve/area labels too; remove unintended automatic value labels.
- State quantities, periods and units. Distinguish totals from averages, exact
  thresholds from feasible whole products and within-capacity conclusions from
  extrapolation. Give both the calculation and the economic explanation.
- Every slide has teacher notes: explanation, question, misconception,
  transition and source (edition, printed page, source link). For an authored
  example identify its authored context/data and cite the book only for the
  underlying methods, without attributing invented data to a book page. Put caveats and
  checks in notes. Notes text is at least 14 pt in the saved PPTX.
- Do not claim the whole exercise route fits one lesson without timing
  evidence. Homework can complete it; never drop basis work to make it fit.

## Source, output and portable build

- Reusable tooling: `build-scripts/presentations/` in platform.
- Editable paragraph authoring source/manifest: `build-scripts/content/book-N/`.
- Final PPTX and matching PDF in the **existing current paragraph folder**:
  `N.M.K Title – presentatie.pptx` and `N.M.K Title – presentatie.pdf`.
- Review/provenance in that lesson folder: `evidence/N.M.K-presentation.md`.
- Candidates, runtime paths, PNGs and caches stay in private scratch or ignored
  `output/`. Do not commit machine-specific paths or put generators in lessons.

For current Book 2 the destination is
`bronnen/H*/paragrafen/N.M.K Title/` within the edition. The textbook exporter
writes named files without deleting these presentation files. Its generated
`LEESMIJ.md` must not hold persistent presentation instructions. Link new decks
from the lesson repository map.

For current Book 3 the existing paragraph PDFs share
`edities/books34-v3/books/book-3/chapters/3.M/paragraph-pdfs/`. Put each named
presentation and matching slide PDF there, with its evidence under that
folder's `evidence/3.M.K-presentation.md`. Keep the paragraph identifier in
every filename; do not move or replace the existing `3.M.K-leerling-v3.pdf`.

For current Book 2 and Book 3 classroom additions, run the following after
staging the final lesson files:

```powershell
node build-scripts/maintenance/check-classroom-edition.js --require-tracked
```

It admits only these additional slides/PDFs/evidence for an existing sealed
paragraph and the lesson map, while preserving every signed book file and
source hash. Book 3's paragraph must have its sealed student PDF in the same
chapter's `paragraph-pdfs/` folder. This does not admit Book 4 additions.
The original import verifier audits the closed historical receipt; do not repin
that receipt to include companion files. This compatibility check establishes
preservation and scope, not slide quality; the rendering/content review below
remains required. `npm run check:books34-structure` uses this current adapter.

Use the installed presentation skill and its dependency discovery (in Codex,
`load_workspace_dependencies`). Set `RUNTIME_NODE`, `RUNTIME_NODE_MODULES`,
`RUNTIME_PYTHON` from that runtime, and `SKILL_DIR` to the installed Presentations
skill directory containing `container_tools/artifact_tool_utils.mjs`. Do not
install substitutes or hardcode a particular user's runtime/version.

To reproduce the accepted source, run the installed skill's authoring-start
marker once, then from platform:

```powershell
# Optional: an absolute fresh output workspace, default output/presentation-211/.
$env:PRESENTATION_WORKSPACE = <private-workspace>
& $env:RUNTIME_NODE build-scripts/content/book-2/presentation-211.mjs
```

The script writes a candidate under `build/`, applies the 14 pt note floor and
finalizes under `final/`. The finalizer checks the package, geometry, fonts,
native objects and reimport. Reports stay in `build/`. Use a fresh workspace for
each revision: the finalizer does not overwrite an existing validated file.

On Windows with PowerPoint installed, render/export the **saved final PPTX**:

```powershell
& build-scripts/presentations/render-powerpoint.ps1 -Pptx <absolute-final.pptx> -Pdf <absolute-final.pdf> -RenderDir <private-render-dir>
```

This opens without a visible window, renders every slide, records text geometry
and exports PDF. If PowerPoint is absent, use the available renderer and report
that native PowerPoint compatibility is untested. A LibreOffice round-trip is
only needed to resolve an observed issue; recheck editability and final renders
after any conversion. Copy only validated PPTX/PDF bytes into lessons.

## Review and delivery

Reopen the saved PPTX and inspect **every rendered slide at readable size**.
A contact sheet does not replace individual inspection. Check overflow, wrapping,
chart labels, table cells, units, arithmetic, full target coverage and question-
before-answer order. Verify all three overviews match and tables/charts remain
native. Export the matching PDF from that final PPTX and check it too. A clean
package or book-PDF validator alone does not establish slide quality.

Review the explanation against the assigned work: does it reveal a worked
answer pupils still need to produce independently? Use the manifest's teaching-
example versus assigned-exercise distinction and a content review; a ban on
repeated numbers or business names cannot establish this. The later discussion
must still use the complete, actual textbook exercise.

Check editable chart data with `python build-scripts/presentations/chart_workbooks.py FINAL.pptx`.
It compares each chart's cached values with its referenced embedded workbook
cells. Unsupported references or formula cells fail explicitly; do not claim
they were checked. This data-consistency check complements the economic and
visual checks above. The §2.1.2 checker calls it automatically.

The scoped review records source commit/paths/hashes, assignment/page facts,
target-question/answer checks, notes, native objects, overview parity, visual
findings, renderer/PowerPoint used and artifact SHA-256 hashes. Keep classroom
timing and learning-effectiveness claims separate from checked file facts.
Deliver links to both files, chosen target and any missing/conflicting source facts.

For workflow changes, test a **fresh agent** with only `Build the PowerPoint
for paragraph <id>.` Start in an isolated platform checkout with paired lessons
and the candidate repository instructions. Supply no chat history, scratch,
answer plan or extra paragraph-specific prompt. Independently inspect its content,
notes and every slide. If it fails, improve reusable instructions/tooling and
repeat in a fresh checkout without the previous test's paragraph output. Record
the exact prompt, baseline commits, output hashes, findings and outcome.

### A chapter or parallel production run

For a requested cold batch test, seed separate paired checkouts from the same
immutable repository commits and give each author only the paragraph prompt
above. Preserve the initial outputs and findings before repairs. Authors must
derive continuity from the textbook and repository instructions; do not feed
them another author's new deck or a bespoke answer plan.

After individual review, read the decks in teaching order, including existing
predecessors and the mixed exercises. Record where each required operation is
introduced, demonstrated and first used independently, with actual slide and
book anchors. Check notation, units, scenario resets, changes of representation,
and the scope of rules across lesson boundaries. Distinguish what was taught
from what pupils have demonstrably mastered; file review proves only the former.

Trace a gap to its source before fixing it: omitted or reordered slide teaching
calls for a classroom-workflow repair; absent or contradictory textbook teaching
needs a named textbook finding and its source-authorized repair route. Do not
silently patch the textbook through slides. Retest a workflow repair with fresh
minimal-prompt authors, then review the assembled series again. Record which
final artifacts are untouched cold outputs and which received later revisions.

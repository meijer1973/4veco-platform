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

Before authoring, record a small source/assignment manifest containing the
edition, lesson commit, source paths/hashes, paragraph title and type (theory
or gemengde opgaven), goals, start/page, basis, independent, target and homework.
Plan instruction backwards from the actual target operations, using the book's
notation, terminology and assumptions. Read its full question and answer model.
Missing/conflicting sources must be reported; never fabricate a purported
textbook exercise, source, answer model or page reference. A textbook error
needs a named source repair, not a silent slide rewrite. An authored teaching
example is allowed and must be identified separately in the manifest and notes.

### Exercise mapping: durable teacher preference

In the current Book 2 edition, **Startopgaven** are the start assignment,
**Begeleide inoefening** is basis work, followed by **Zelfstandige oefening**
and **Doeloefening**. Include all actual guided exercises, whose count varies.
Homework is basis + independent + target, explicitly numbered, **Maken en
nakijken**. Bonus and Herhaling are extra unless assigned. The teacher confirmed
§2.1.1: start 1–2, basis 3–4, independent 5–6, target 7, homework 3–7. Derive
each new paragraph's numbers from its own headings and teacher route.

For older editions without those headings, the original default is the first
two Herhaling exercises as start, Startoefeningen as basis, Zelfstandig + Doel
as core work. Do not apply that older mapping to the current Book 2 edition.
Only ask when source ambiguity remains after inspecting the actual edition.

For gemengde opgaven: start with exercise 1; homework is **all** mixed exercises
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

For this signed Book 2 edition, run the following after staging the final lesson files:

```powershell
node build-scripts/maintenance/check-classroom-edition.js --require-tracked
```

It admits only these additional slides/PDFs/evidence in an existing paragraph
and the lesson map, while preserving every signed book file and source hash.
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

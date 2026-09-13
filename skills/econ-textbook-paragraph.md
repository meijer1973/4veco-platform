---
name: econ-textbook-paragraph
description: "Write or revise economics textbook explanation and assemble Part A paragraphs. Owns textbook writing, file formats and rendering. Use for a new paragraph, bounded text/exercise revision or layout repair; retrieve an unchanged edition through the reproduction route."
pipeline: "Part A producer"
---

# Economics Textbook Paragraph Builder

Write the requested textbook material and preserve its dependent outputs.
This skill owns writing, presentation and paragraph formats. The
[exercise builder](econ-exercise-builder.md) owns exercise sequence, target
coverage and timing; [economic-graph](economic-graph.md) owns graph requirements;
[Part A review](../docs/workflows/part-a-review.md) owns independent review,
evidence and closure. Construction recipes are optional.

## Match the assignment

| Assignment | Work and stopping point |
|---|---|
| New paragraph | Establish approved foundation and plan; author the complete output set; render, inspect, independently review and close through the [Part A checklist](../docs/workflows/part-a-start.md). |
| Revise an exercise or explanation | Inspect affected goals, question, taught method, answer, figures and dependent material. Reuse valid plan/coverage; repair affected sources and renders. Expand only when calculations, target coverage, teaching sequence or neighbouring pages change. |
| Repair layout | Inspect the existing source, wrapper and affected pages. Repair the rendering cause and inspect changed pages plus pagination dependencies. Load content skills only if a substantive content decision is needed. |
| Retrieve unchanged edition | Use [existing-edition reproduction](../docs/workflows/part-a-review.md#reproducing-an-existing-edition). Export the committed PDFs without authoring or manufacturing current-review evidence. |

A requested draft/component can stop at that deliverable. Do not silently expand
it into a whole-paragraph build, and do not call it current paragraph closure.
New closure/publication claims require current-file evidence and applicable
review even for a small change. Revalidate foundation when its sources or the
requested action change; reuse unaffected evidence with its named scope.

**Book scope:** the linked Part A exercise-authoring contract applies to newly
authored Book 2 and later theory paragraphs. Book 1 output is frozen: do not
retrofit it and do not use this contract as a retroactive Book 1 content check.

**Book foundation check:** before a Book 2 paragraph is planned or built, read
the canonical semantic authority
`references/authored/book-outlines/book-2-outline.md` and its compact machine
companion. Part A creates `X.Y.Z-textbook-plan.md` from
`build-scripts/templates/template-textbook-paragraph-plan.md`. For ordinary
approved Book 2 production, follow the [Part A checklist](../docs/workflows/part-a-start.md)
to generate `X.Y.Z-textbook-foundation.json` and link it once in the plan.
It supplies the checked hashes, authority/chapter/target pins and scoped hold
effects; do not transcribe those mechanical tables. Regenerate it when its
sources or action change. For other actions, use the runbook's structural
currentness and `--action <action> --paragraph X.Y.Z` checks; add
`--require-approved` only for approved authority, production, or integration.
Treat a hold's explicit resolution action as distinct from the later use or
integration action it guards. Stop only when
the outline is stale or a matching open hold blocks the current action.
Released holds require evidence and no longer block; unrelated, out-of-scope,
or explicitly permitted holds do not block. Author the semantic decisions in
the Part A plan: current local chapter-plan authority, five-way prerequisite
classification and evidence, non-goals, prepares-for, model conditions and the
distinct current-action foundation verdict. The generated record is evidence,
not a new approval or a substitute for those decisions. Preview/familiarity is
never an assumable prerequisite.

**Lane boundary:** this is the Part A textbook lane. It may not create or edit
companion route files (`index.html`, companion HTML/PPTX, shared game data,
`_paragraph-plan.md`, or `X.Y.Z-companion-visual-review.md`). Part A owns
`X.Y.Z-textbook-plan.md`; Part B consumes but must not edit it. Close the lane by
producing `X.Y.Z-textbook-handoff.md` for the companion team. Publisher-print
chapter/book handoff also remains in Part A, but paragraph PDFs are normal Part
A human-review outputs.

**References:** consult the relevant section of the
[precision authority](../references/authored/economic_mathematical_precision_reference.md),
[Dutch terminology](../references/authored/economie-terminologie.md),
[didactic guidance](econ-didactiek.md) and
[school-fit overlay](../references/external/amstelveencollege_quality_standards.md)
when the affected decision needs them. Layout work does not require reading all
authoring references. The normal record commands and shared renderer are in the
checklist; load PDF adaptation or additional quality-evidence skills only when
that work is needed.

---

## PART 1: INPUT AND OUTPUT

### 1.1 Required input

For new paragraphs use all inputs below; bounded revisions inspect affected
inputs and reuse valid existing records.

1. **Part A textbook plan and Book foundation check** — exact current-action
   verdict in `X.Y.Z-textbook-plan.md`; use the canonical Markdown outline for
   semantics and its machine companion for hashes, target pins, and hold state
2. **Blueprint paragraph spec** — target exercise, lesson goals, difficulty notes, difficulty rating
3. **Exercise set** — `exercises.md` and `answers.md` from `econ-exercise-builder`
4. **Preceding paragraphs** — to know what has been taught (for recall boxes, cross-references)

For an official CvTE or CvTE-derived target exercise, also require the
paragraph plan's `Exam-target route trace`. The textbook paragraph and answer
model must cover every official correction model step or mark it as prior
knowledge/out of scope with evidence. Source annexes, figures, tables, graphs,
point allocation, answer-construction requirements, and answer-form needs must
remain visible in the paragraph plan so Part B can map them to the skill-map
route, shared task shell, target-equivalent exit ticket, and review gates.

### 1.2 Output files

Per paragraph, saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.2.2 Vraagfactoren/`):

| File | Purpose |
|------|---------|
| `X.Y.Z [Name] – paragraaf.md` | Complete textbook paragraph in markdown |
| `X.Y.Z [Name] – opgaven.md` | Exercise set (exercises only, no theory) |
| `X.Y.Z [Name] – antwoorden.md` | Answer model with step-by-step solutions |
| `X.Y.Z [Name] – paragraaf.pdf` | PDF export of paragraaf.md with embedded images |
| `X.Y.Z [Name] – opgaven.pdf` | PDF export of opgaven.md |
| `X.Y.Z-textbook-plan.md` | Part A-owned backward-design plan and complete Book foundation check |
| `X.Y.Z [Name] – antwoorden.pdf` | PDF export of antwoorden.md |
| `_assets/*.svg` | All graphs and diagrams as SVG |
| `_assets/*.png` | All graphs and diagrams as PNG (rasterised from SVG) |
| `build_pdf.py` | Thin wrapper invoking the shared paragraph renderer |
| `X.Y.Z-review.md` | Independent Part A review |
| `X.Y.Z-quality-ref.yaml` | Part A `partA:` quality-ref block |
| `X.Y.Z-textbook-handoff.md` | Boundary handoff for the Part B companion lane |

### 1.3 File naming convention

**Main files:** `X.Y.Z [Name] – <type>.<ext>` where X=book, Y=chapter, Z=paragraph. Types: `paragraaf`, `opgaven`, `antwoorden`. Use en-dash (–), not hyphen (-).

**Assets:**
```
_assets/X.Y.Z_{type}_{number}.svg
_assets/X.Y.Z_{type}_{number}.png
```

Types: `fig` (graphs/diagrams in theory), `ex` (graphs in exercises), `we` (worked example graphs)

Examples:
```
1.2.2 Vraagfactoren – paragraaf.md    — main paragraph file
1.2.2 Vraagfactoren – opgaven.md      — exercises
1.2.2 Vraagfactoren – antwoorden.md   — answer model
_assets/1.2.2_fig_1.svg               — first theory figure
_assets/1.2.2_we_1.svg                — worked example graph
_assets/1.2.2_ex_1.svg                — exercise 1 graph
```

---

## PART 2: PARAGRAPH STRUCTURE

### 2.1 Section sequence

Begin with the paragraph number/title, a motivating problem and theory. Then
integrate the [exercise sequence](econ-exercise-builder.md#31-the-sequence) and
its [printed template](econ-exercise-builder.md#71-exercisesmd-structure), including
the compact summary. Keep the separate exercise file consistent with this
integrated text. The exercise owner defines headings, adjacency, paper support,
alignment and the whole-lesson time budget; do not copy those contracts here.

Teacher-facing difficulty ratings and per-exercise time estimates stay out of
student Markdown, HTML and PDFs. Use the [type-specific builders](../docs/workflows/part-a-start.md)
for consolidation/test preparation; their deliverables are not theory paragraphs.

---

## PART 3: WRITING RULES

### 3.1 Theory text

Stay within the assigned concept and approved target. Open with a recognisable
problem and visible learning goals, then explain concrete examples before their
general principle/formula. Introduce one new concept per step. Use active Dutch,
short sentences (average under 20 words), and consistent syllabus terms. Remove
filler and adjacent-topic teaching that does not serve the approved scope.

### 3.2 Definitions and formulas

Use visually distinct definition and formula boxes. Define one term per box,
then examples; give its abbreviation on first use. Group related formulas
(normally at most 3–4), retain canonical variable names and state units. Make
individual/market and total/average distinctions explicit.

State domain restrictions and model assumptions when first presenting a formula,
not later in a footnote. For piecewise functions, explain the threshold and what
changes beyond it. Include a numerical check. Introduce and recall curves with
an explicit ceteris-paribus qualifier. These requirements come from the precision
authority; a formatting recipe cannot alter the model.

### 3.3 Explanations and figures

Explain each relevant curve, point and area step by step. Use progressive
figures for unfamiliar elements or adjacent annotations/sequenced text for a
complete source graph. Keep explanatory text and labels next to the relevant
figure; compare equivalent methods close together. This does not prescribe a
fixed drawing order, panel arrangement or number of elements.

Keep graphical, verbal and numerical representations consistent. Numerical
procedures require nearby explanatory text, a graph and a small value table.
A grouped list of concepts requires one overview visual after its explanation,
before the worked example. Key-distinction overview figures carry rule labels
inside or directly beneath them; use words/arrows as well as colour. Choose the
layout and construction method that communicate these teaching requirements.

### 3.4 Misconceptions and recall

For an applicable misconception, place a short warning box beside the triggering
concept. Explain the tempting error and correct reasoning, normally in 3–4
lines; ensure practice confronts it. Keep forward references brief. Recall boxes
activate already-taught prerequisites in 1–3 lines rather than reteaching them;
use them for material more than one chapter back. Never treat prior exposure as
secure knowledge without the foundation evidence.

### 3.5 Summary

Use the summary placement and non-heading format in the exercise template. Keep
at most five concise points covering the key insights/formulas, relevant domains
or special cases, and a forward pointer. Reuse this same summary in the exercise
and integrated paragraph outputs.

---

## PART 4: GRAPH GENERATION WORKFLOW

Apply [economic-graph](economic-graph.md) to figures that change. It owns equation
and domain accuracy, numerical/text agreement, palette, comparable/progressive
scales, readable labels and programmatic geometry plus final-image verification.
Its construction recipes are optional. Save required SVG/PNG pairs under the
naming convention above; reference PNGs in Markdown for ordinary paragraph export.
Check all referenced assets and flag unused assets. A missing required asset is
blocking. Teaching requirements for the surrounding explanation remain in §3.

---

## PART 5: PDF EXPORT

For ordinary paragraph export, copy the
[thin wrapper](../build-scripts/templates/template-build-paragraph-pdf.py) to
`build_pdf.py` and run it with the adjacent platform checkout. The
[shared renderer](../build-scripts/textbook/paragraph_pdf.py) is the default for
Markdown → HTML → PDF, including image embedding, lists, styling and pagination.
Install its declared dependencies as described in the Part A checklist.
Inspect final HTML and every PDF page for new output. For a revision, inspect
changed pages and affected pagination/content dependencies, reusing valid
unchanged page evidence under the review workflow.

Consult [econ-pdf-builder](econ-pdf-builder.md#default-paragraph-implementation)
when a layout adaptation is needed. Change and test the shared implementation,
or document why a specialized builder is necessary and verify its output.
Do not copy the historical regex pipeline into a new paragraph builder.

**Key rule:** difficulty ratings (⬜/🟨/🟥) and time estimates per exercise are teacher-facing blueprint metadata and must not appear in student-facing output. Strip them before export.

---

## PART 6: CHECK AND CLOSE

Check affected authority, content, answer and asset dependencies. For a new
paragraph verify the complete output inventory and all applicable writing,
exercise and graph requirements. For a revision reuse valid evidence and inspect
changed material, widening the check when its dependencies require it.

Use the [Part A checklist](../docs/workflows/part-a-start.md) for snapshot,
independent review, generated quality record, paragraph validation and handoff.
The [review workflow](../docs/workflows/part-a-review.md) determines coverage,
current-file binding, repair rechecks and publication boundaries. Record actual
results and remaining defects; generated records do not supply missing approval
or review. Authored quality evidence retains goal/eindterm/Bloom mappings,
applicable standards and honest limitations.

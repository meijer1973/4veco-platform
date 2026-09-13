---
name: econ-exercise-builder
description: "Create or revise economics exercises and answer models for Book 2+ Part A. Owns target alignment, exercise sequence, scaffolding and lesson timing. Use for an individual exercise, answer repair or full set; load graph guidance only when a figure is involved."
pipeline: "Part A producer"
---

# Economics Exercise Builder

Create the requested exercise component or set from approved teaching inputs.
This skill owns exercise sequence and target coverage. The
[textbook skill](econ-textbook-paragraph.md) owns paragraph writing and formats;
[Part A review](../docs/workflows/part-a-review.md) owns independence and closure.
Consult [didactic guidance](econ-didactiek.md) for a pedagogical decision and
[graph requirements](economic-graph.md) when creating or changing a figure.

## Match the assignment

- **One exercise or answer:** read the affected goal, target operation, supplied
  sources and taught method. Produce that component and its answer/needed assets.
  Do not generate the other exercise stages, a paragraph plan, PDF packet or
  review records solely because this skill describes a complete set.
- **Revise an existing exercise:** reuse its valid alignment and foundation;
  inspect the question, answer, values, hints, figures and references together.
  Update the affected alignment row and time estimate when they change. Expand
  to surrounding practice only if coverage, progression or dependencies change.
- **New complete set:** use the full input, timing, sequence and output contract
  below; establish the lesson's target-operation coverage before drafting.

A component draft is not a completed paragraph. New/current paragraph closure
uses the [checklist](../docs/workflows/part-a-start.md) and current-file review
rule. Changed source/action evidence must be revalidated; scope reduction grants
no authority to alter a target, bypass a hold or retrofit frozen material.

**Scope boundary:** this is the operational source of truth for newly authored
Book 2 and later Part A theory paragraphs. Book 1 output is frozen: do not
retrofit it and do not treat this contract as a retroactive Book 1 check. The
Part B companion route `Start -> Leer -> Check -> Oefen -> Exit ticket` is a
different product contract and must not replace the printed Part A headings.

**Pedagogical-boundary inheritance:** apply
`references/owned/course-blueprint-pedagogical-boundaries.md` when earlier-book
material or a later-topic preview appears. A preview may support bounded
explanation/context, already-taught prerequisite retrieval, or optional
perspective; it cannot fill a `Covered` cell, imply mastery, add an untargeted
independent operation to a Part A target stage, displace target practice, or
defeat the whole-lesson 55-minute equation. This builder remains authoritative
for the operational Book 2+ sequence and target coverage.

---

## PART 1: INPUT AND OUTPUT

### 1.1 Required input

For a complete set, use the blueprint paragraph spec, containing:
- Paragraph reference (e.g., B2C1§2)
- Target exercise (the doeloefening)
- Lesson goals
- A decomposition of each target subquestion into observable operations
- Difficulty notes
- Difficulty rating (⬜ LIGHT / 🟨 MEDIUM / 🟥 HEAVY)

Additionally, the builder needs:
- The list of all preceding paragraphs and their core skills (for interleaving selection)
- The chapter context (which other paragraphs are in this chapter, to avoid context reuse)

For a complete set, record this alignment in the Part A plan before drafting.
For a revision, inspect and update affected rows; reuse valid entries instead
of retranscribing them. A standalone component draft states its affected goal
and target operation alongside the deliverable and does not require creating a
paragraph plan. Do not hide uncovered operations by writing exercises first:

| Lesson goal | Target subquestion/operation | Worked example | Start check | Guided practice | Independent practice | Covered/gap |
|---|---|---|---|---|---|---|
| [goal] | [observable operation] | [where modelled] | [where checked] | [where scaffolded or n/a] | [where practised] | [covered or named gap] |

### 1.2 Output files

For a complete set, saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.2.2 Vraagfactoren/`):

| File | Contents |
|------|----------|
| `X.Y.Z [Name] – opgaven.md` | Numbered exercise set, ready for textbook integration |
| `X.Y.Z [Name] – antwoorden.md` | Full answer models with step-by-step solutions and "waarom" explanations |
| `_assets/` | SVG and PNG files for any graphs referenced in exercises |

File naming: use en-dash (–), not hyphen (-). See `econ-textbook-paragraph` §1.3 for the full convention.

---

## PART 2: TIME BUDGET

### 2.1 The constraint

The core route is `Startopgaven -> Zelfstandige oefening -> Doeloefening`.
It must be feasible within the student work time of a 55-minute lesson after
instruction and the worked example. `Begeleide inoefening` is an optional
support detour. Bonus is outside the core; closing review may be homework.

For a new complete set, record an actual whole-lesson equation before authoring.
For a revision, update affected question estimates and the total if they change;
a standalone component draft does not create a whole-paragraph timing record:

`motivation + instruction + worked example + compact summary and transitions +
actual Startopgaven + actual Zelfstandige oefening + actual Doeloefening =
planned lesson minutes <= 55`

The section ranges below are recommendations, not proof by themselves. Select
and total the actual questions within the remaining work time. If a justified
paragraph-specific estimate falls outside a range, record why. If the equation
exceeds 55, reduce or redesign practice without hiding a target operation; do
not merely assert that the 23–38-minute range is less than 55.

### 2.2 Estimate the actual work

Estimate each selected question from its calculation/reasoning steps, required
source reading, drawing and explanation. Account for the intended students and
supplied support; exercise counts and generic ranges do not prove feasibility.
Keep estimates and difficulty labels in teacher-facing planning metadata.

### 2.3 Budget allocation

| Section | Time | Route role |
|---|---:|---|
| Startopgaven | 5–8 min | Core: prerequisite retrieval + compact current-content check |
| Begeleide inoefening | 8–15 min | Printed section, optional student detour; same goal, stronger fading scaffold |
| Zelfstandige oefening | 10–18 min | Core: target operations without guided support |
| Doeloefening | 8–12 min | Core: capstone evidence |
| Denkertje / Bonusopgave | 8–15 min | Outside core: cognitive flexibility |
| Herhaling / Herhaling en interleaving | 4–8 min | 1–2 accessible cumulative tasks; often homework |

The core ranges total 23–38 minutes, but that sum is not a whole-lesson
feasibility proof. Use the equation in §2.1. Do not label the normal post-start
exercise block as `Verdieping`; its student-facing label is `Zelfstandige
oefening`.

### 2.4 Adjusting for difficulty

- **⬜ LIGHT paragraph:** keep guided practice at the short end and explicitly skippable; retain its heading
- **🟨 MEDIUM paragraph:** offer the guided route with deliberate fading
- **🟥 HEAVY paragraph:** use the full guided range, but keep the same lesson goal and doeloefening; do not lower the destination

---

## PART 3: EXERCISE PROGRESSION

### 3.1 The sequence

Design in this order: `lesson goals -> doeloefening -> target-operation
decomposition -> worked example and practice`. The [printed template](#71-exercisesmd-structure) defines the exact seven `##`
headings and their order; never omit, reorder or insert a top-level stage.

1. **Uitgewerkt voorbeeld** follows theory directly. It is fully solved,
   follows the exact target operation chain with simpler values/context, and
   introduces no operation absent from the target or lesson goals.
2. **Startopgaven** combines two roles under this single visible heading:
   (a) retrieval of prerequisites already taught and (b) a compact check of
   current-content comprehension. The check is low-stakes and brief; do not
   call it mastery, diagnosis, or use it for automatic routing. Include only
   this compact paper route note: `Korte route: Startopgaven → Zelfstandige
   oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.`

   Within the 5–8-minute Startopgaven total, the prerequisite-retrieval task is
   normally 3–5 minutes. A teacher may assign that printed retrieval task at
   the beginning of the lesson; this classroom choice does not change the
   printed `theory -> Uitgewerkt voorbeeld -> Startopgaven` order.
3. **Begeleide inoefening** is a required printed heading but an optional
   student route. It targets the same goal and doeloefening with stronger
   explicit support that deliberately fades. Use neutral skip wording: `Heb je
   deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.`
4. **Zelfstandige oefening** rehearses the decomposed target operations without
   the guided support and uses varied contexts. It may not expand into adjacent
   content or hide enrichment inside the core route.
5. **Doeloefening** is the blueprint target, verbatim by default. Light
   adaptation is allowed only where the blueprint or responsible owner
   authorizes it, and it must preserve every target operation, answer form, and
   intended difficulty. It is the capstone evidence for the lesson goal.
6. **Denkertje / Bonusopgave** builds cognitive flexibility with a new
   representation, assumption, strategy, comparison, critique, or transfer.
   It is not more or longer arithmetic of the same type.
7. **Herhaling / Herhaling en interleaving** contains 1–2 short, accessible
   cumulative tasks using taught content. It may be homework and introduces no
   new theory.

**Paper-first/no-device rule:** the printed paragraph must contain all
explanation, prerequisite retrieval, guided scaffolding, independent practice,
and target preparation needed for the classroom lesson. Student-facing
template copy must not direct students to a website, online explanation,
companion page, laptop, phone, tablet, QR code, or other digital support. It
must not expose internal terms such as Part A, Part B, lane, or companion route.
Those terms remain valid only in internal repository guidance and handoffs.

### 3.2 Dual coding fading — target-aligned rule

Choose support from the approved target operation and answer form. Begin guided
practice with an explicit, labelled representation students can read and explain;
then deliberately fade the relevant support toward independent target work.

When graph or table production is itself a target operation, a possible recipe
is a complete worked figure, then a supplied base to complete, then independent
production. Choose stages that teach the operation; no fixed stage count or
intermediate text-only task is required. Keep this progression within guided
practice, not across the two brief Startopgaven roles.

If the target supplies a graph, table or source for reading, interpreting,
modifying or source use, retain that representation and do not add graph/table
production. Fade labels, hints, worked markings or intermediate prompts instead.
Remove a visual only when the target answer form requires working without it.
Support must be present in the exercise, not only in its answer model.

### 3.2.bis Combined-change misconception exercise (MANDATORY for distinction paragraphs)

For paragraphs that teach a key distinction (shift vs movement, complement vs substitute, real vs nominal, normal vs inferior good, ...), include **at least one exercise where two things change at the same time**, each on a different side of the distinction.

Have the student analyse each change separately, combine their effects, and
confront a tempting wrong reading. Place the exercise at the end of guided
practice or the start of independent practice. Adapt the context and wording to
the approved distinction; the supplied function/target determines the answer.

### 3.3 Classification tables

Give multi-row classification tables explicit response-column headers, normally
2–4 (for example type of change, direction and factor). The headers clarify the
answer format without supplying the answers.

### 3.4 Context selection rules

- Each exercise uses a different context from the others in the same paragraph
- Do not reuse a context that appears in another paragraph of the same chapter
- Use recognisable, age-appropriate settings (bakeries, cinemas, streaming services, public transport, sports events, food markets)
- Preserve the blueprint target context unless its responsible owner or blueprint
  explicitly authorizes adaptation under §3.1
- Interleaving exercises may reuse contexts from earlier chapters (this reinforces transfer)

---

## PART 4: ANSWER MODEL DESIGN

### 4.1 Unified procedures

The answer model follows the **exact same steps** taught in the worked example, in the same order, with the same notation. No shortcuts, no alternative methods, no reordering.

### 4.2 Answer presentation

For each numbered subquestion, show the taught steps, calculation/reasoning,
final answer and economic explanation. Choose concise Markdown formatting that
preserves this information; a copied layout recipe is unnecessary.

### 4.3 Rules

- **Always show substitution.** Don't jump from formula to answer. Show: formula → substitution → intermediate result → final answer.
- **Always include units.** Every numerical answer has a unit (€, %, stuks, eenheden).
- **Always include "Waarom".** At least for the final answer of each sub-question: why does this answer make economic sense? This prevents students from memorising procedures without understanding.
- **Rounding:** state the rounding rule once at the top of the answer model (e.g., "Rond af op 2 decimalen tenzij anders aangegeven"). Apply consistently.
- **Graph answers:** include a reference to the graph file in `_assets/`. The graph must show the complete solution (all curves, equilibrium points, shaded areas, labels).
- **Concept precision (MANDATORY).** When attributing a change to a vraagfactor / aanbodfactor / cost driver, always pick the **most economically specific category** (see `references/authored/economic_mathematical_precision_reference.md` §4.3 and §12.1). Do NOT blur "preferences" with "price of a substitute", or "demand factor" with "supply factor".
  Add a brief correction when a tempting attribution would teach the wrong
  distinction; use the most specific applicable economic cause.

### 4.4 Denkertje / Bonusopgave answer model

The Denkertje/Bonusopgave answer model is different:
- No step-by-step procedure (the point is that the student structures their own reasoning)
- Instead: a **model answer** showing one strong response
- Followed by: **beoordelingscriteria** (2–4 bullet points stating what a good answer includes)

---

## PART 5: CLOSING REVIEW SELECTION

### 5.1 Which taught skills to revisit

Prioritize direct prerequisites, then frequently needed fundamentals (percentages,
graph reading, index numbers, shift/movement and costs), then recently taught
skills at risk of decay. Inspect their actual prior teaching before selecting.

### 5.2 Closing-review exercise design

- Use only **1–2 accessible tasks** in the final `Herhaling / Herhaling en
  interleaving` section
- Keep interleaving exercises **short** (2–4 minutes each)
- Use a **different context** from the original paragraph where the skill was taught
- Do **not** add scaffolding — these are revision, not new learning
- Do **not** add theory, definitions, or untaught operations
- If a student cannot do an interleaving exercise, this signals a gap — note in the answer model: "Kun je deze opgave niet maken? Herhaal dan §X.Y.Z."

---

## PART 6: GRAPH SPECIFICATIONS IN EXERCISES

### 6.1 When exercises need graphs

- **Provided graphs** (for dual coding in guided practice): specify fully so `economic-graph` skill can generate them. Include: axis labels, curve equations, equilibrium points, any shaded areas.
- **Student production:** where the target requires an independently drawn graph,
  put the solution graph in the answer model. Retain any base, graph or source
  supplied by the target; reading or modification is not independent production.

### 6.2 Graph specifications

State the economic question, equations/data, variables and units, domains,
required points/areas, target size and asset destination. Use the
[graph scope and accuracy requirements](economic-graph.md#establish-the-graphs-scope)
and verify the actual figure. A prose specification or existing source file is
sufficient; a fixed specification-block format is optional. Supply endpoints
follow the supplied function and valid domain under the
[mathematical requirements](economic-graph.md#mathematical-and-economic-requirements).

---

## PART 7: FILE FORMAT

### 7.1 exercises.md structure

```markdown
# Opgaven §X.Y.Z — [Title from blueprint]

## Uitgewerkt voorbeeld

[Fully solved example — students read, not solve]

> **Samenvatting §X.Y.Z**
> - [Key insight 1]
> - [Key insight 2]
> - [Central formula or procedure]
> - [Brief forward reference]

## Startopgaven

**Opgave 1 — Ophalen**
[Short retrieval of a prerequisite that was already taught]

**Opgave 2 — Begripscheck**
[Compact, low-stakes check of current-content comprehension]

**Korte route:** Startopgaven → Zelfstandige oefening → Doeloefening.
**Extra hulp nodig?** Maak eerst Begeleide inoefening.

## Begeleide inoefening

*Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.*

[Optional same-goal exercises with stronger support and deliberate fading]

## Zelfstandige oefening

[Independent exercises covering the decomposed target operations]

## Doeloefening

**Opgave [N]**
[The target exercise from the blueprint]

## Denkertje / Bonusopgave

**Opgave [N+1]**
[Optional cognitive-flexibility task, not more of the same arithmetic]

## Herhaling / Herhaling en interleaving

**Opgave [N+2]** *(herhaling §X.Y.Z: [skill name])*
[One of 1–2 short cumulative tasks; no new theory]
```

The compact summary is deliberately placed after `Uitgewerkt voorbeeld` and
before `Startopgaven` so it remains available as a paper reference. It has at
most five concise points and is never a top-level heading or eighth exercise
section. Do not insert `## Samenvatting`, `## Website-help`, `## Voorkennis
ophalen`, a generic `## Opgaven`, or any other top-level heading among the
seven canonical `##` headings.

### 7.2 Answer file

Use `# Antwoorden §X.Y.Z — [Title]`, state the rounding rule once, then keep the
exercise/subquestion identifiers aligned with the question file. Apply
[answer-model design](#part-4-answer-model-design); include the bonus model answer
and criteria. Formatting examples are optional; complete solutions are required.

---

## Verify the requested deliverable

Check target alignment, solvability, calculations, hints and answer completeness
for changed material. For a complete set, also verify the printed sequence,
support/fading, paper route and actual whole-lesson budget above. A smaller task
must not leave a known dependency or target-operation gap unreported.

Resolve every referenced image and retain the required SVG/PNG pairs and naming.
A missing referenced asset makes that deliverable incomplete. Re-render affected
outputs and use [Part A review](../docs/workflows/part-a-review.md) when claiming
current paragraph acceptance; preserve existing valid review of unchanged work.

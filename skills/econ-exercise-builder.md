---
name: econ-exercise-builder
description: "Generates a complete Book 2+ Part A exercise set with answer models for a single textbook paragraph, based on the course blueprint. Uses backward design and the canonical seven-section sequence: Uitgewerkt voorbeeld, Startopgaven, Begeleide inoefening, Zelfstandige oefening, Doeloefening, Denkertje/Bonusopgave, and Herhaling/Herhaling en interleaving. Use this skill when the user provides a paragraph spec from the blueprint and wants exercises generated. Trigger when the user mentions oefeningen maken, opgavenset, antwoordmodel, doeloefening uitwerken, or exercise generation for a specific paragraph. Always use in combination with econ-didactiek (pedagogical principles) and economic-graph (for graph specifications within exercises)."
pipeline: "Part A producer"
---

# Economics Exercise Builder

Generates a complete exercise set + answer models for one textbook paragraph, given a blueprint paragraph spec. This skill handles exercise design and sequencing. For pedagogical principles, see `econ-didactiek` (backed by `references/authored/didactiek-principes.md`). For graph generation, see `economic-graph`. For school-fit quality (differentiation, context quality, self-monitoring), see `references/external/amstelveencollege_quality_standards.md`.

**Scope boundary:** this is the operational source of truth for newly authored
Book 2 and later Part A theory paragraphs. Book 1 output is frozen: do not
retrofit it and do not treat this contract as a retroactive Book 1 check. The
Part B companion route `Start -> Leer -> Check -> Oefen -> Exit ticket` is a
different product contract and must not replace the printed Part A headings.

---

## PART 1: INPUT AND OUTPUT

### 1.1 Required input

The blueprint paragraph spec, containing:
- Paragraph reference (e.g., B2C1§2)
- Target exercise (the doeloefening)
- Lesson goals
- A decomposition of each target subquestion into observable operations
- Difficulty notes
- Difficulty rating (⬜ LIGHT / 🟨 MEDIUM / 🟥 HEAVY)

Additionally, the builder needs:
- The list of all preceding paragraphs and their core skills (for interleaving selection)
- The chapter context (which other paragraphs are in this chapter, to avoid context reuse)

Before drafting, complete this alignment table. Do not hide uncovered
operations by writing exercises first:

| Lesson goal | Target subquestion/operation | Worked example | Start check | Guided practice | Independent practice | Covered/gap |
|---|---|---|---|---|---|---|
| [goal] | [observable operation] | [where modelled] | [where checked] | [where scaffolded or n/a] | [where practised] | [covered or named gap] |

### 1.2 Output files

Per paragraph, saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.2.2 Vraagfactoren/`):

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

For each paragraph, record an actual whole-lesson equation before authoring:

`motivation + instruction + worked example + transitions/recap + actual
Startopgaven questions + actual Zelfstandige oefening questions + actual
Doeloefening questions = planned lesson minutes <= 55`

The section ranges below are recommendations, not proof by themselves. Select
and total the actual questions within the remaining work time. If a justified
paragraph-specific estimate falls outside a range, record why. If the equation
exceeds 55, reduce or redesign practice without hiding a target operation; do
not merely assert that the 23–38-minute range is less than 55.

### 2.2 Time estimation per exercise type

There is no fixed time per exercise. Estimate case by case:

| Exercise type | Typical range | Factors that increase time |
|---------------|---------------|---------------------------|
| Simple calculation (one formula) | 2–4 min | Unfamiliar formula, unit conversion |
| Multi-step calculation | 5–10 min | More steps, intermediate results needed |
| Graph reading | 2–3 min | Multiple values to read, interpolation |
| Graph drawing | 5–8 min | Multiple curves, labelling, shading areas |
| Short explanation (1–2 sentences) | 2–4 min | Abstract concept, requires precise terminology |
| Reasoning chain (3+ links) | 5–8 min | More links, ambiguous causality |
| Definition / classification | 1–2 min | Straightforward recall |
| Optional stretch task (open, evaluative) | 8–15 min | Requires argumentation, model critique; student-facing label is "Denkertje" or "Bonusopgave" |

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
decomposition -> worked example and practice`. Print the following seven
headings contiguously and never reorder them:

```
1. Uitgewerkt voorbeeld
2. Startopgaven
3. Begeleide inoefening
4. Zelfstandige oefening
5. Doeloefening
6. Denkertje / Bonusopgave
7. Herhaling / Herhaling en interleaving
```

1. **Uitgewerkt voorbeeld** follows theory directly. It is fully solved,
   follows the exact target operation chain with simpler values/context, and
   introduces no operation absent from the target or lesson goals.
2. **Startopgaven** combines two roles under this single visible heading:
   (a) retrieval of prerequisites already taught and (b) a compact check of
   current-content comprehension. The check is low-stakes and brief; do not
   call it mastery, diagnosis, or use it for automatic routing. Include the
   route note: `Korte route: Startopgaven -> Zelfstandige oefening ->
   Doeloefening.` An optional website-help pointer may appear here only as a
   subordinate non-heading Part B pointer.

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

### 3.2 Dual coding fading — the 4-stage rule

When visual support is useful, fade it within `Begeleide inoefening` and into
independent practice—not across `Startopgaven`, whose two short roles must stay
compact:

| Stage | Exercise | What the student is given | What the student does |
|-------|----------|--------------------------|----------------------|
| 1 | Begeleide oefening 1 | Graph **with** the change drawn AND labeled | Reads, identifies, classifies, explains |
| 2 | Begeleide oefening 2 | Graph base (axes + initial line) only | Draws the change themselves |
| 3 | Begeleide oefening 3 | No graph | Reasons in text/words only |
| 4 | Independent practice | No graph | Draws their own graph from scratch as part of the solution |

**Why stage 1 is non-negotiable:** Without it, the very first exercise asks students to *produce* before they have *recognized*. Stage 1 lets them verify their reading of the visual conventions before they apply them. It's the lowest-friction entry point into the visual representation of the concept.

**Stage 1 question patterns** (read a labeled graph):
- "What does this graph represent? What might have caused it?"
- "Two situations are shown. Which is X and which is Y? Why?"
- "Identify the type of change in this graph and explain in your own words."

**Stage 2 question patterns** (draw on provided graph):
- "Show in the graph what happens when..."
- "Draw the new equilibrium on the graph below."
- "Add the [shift / movement / surplus area] to the figure."

**"Visual support" means:** a graph, flow diagram, table, or schematic is provided as part of the exercise (not just in the answer). At stage 1 the visual carries the answer; at stage 2 the visual is a base to draw on; at stages 3–4 there is no visual at all.

### 3.2.bis Combined-change misconception exercise (MANDATORY for distinction paragraphs)

For paragraphs that teach a key distinction (shift vs movement, complement vs substitute, real vs nominal, normal vs inferior good, ...), include **at least one exercise where two things change at the same time**, each on a different side of the distinction.

**Pattern:** the student must analyse each change separately, then combine.

```markdown
**Opgave N** *(twee veranderingen tegelijk — let goed op!)*

Op de [market] gebeuren twee dingen op dezelfde dag:
1. [Change A — affects own price of the good]
2. [Change B — affects a non-price factor like a substitute, complement, income, ...]

a) Bekijk eerst alleen verandering 1. Wat gebeurt er? Beweging langs of verschuiving van? Welke richting?
b) Bekijk nu alleen verandering 2. Wat gebeurt er? Beweging langs of verschuiving van? Welke richting?
c) Beide veranderingen gebeuren tegelijkertijd. Beschrijf het netto-effect. Versterken de twee effecten elkaar of werken ze tegen elkaar in?
d) Een leerling zegt: "[plausible wrong reading]". Leg uit waarom dit niet klopt.
```

**Why:** Students who can correctly classify single-change cases often collapse under simultaneous changes — they pick one category and apply it to both. The combined-change exercise forces them to keep both lenses active. It is the strongest test of whether the distinction has actually landed.

**Placement:** as the last exercise in optional `Begeleide inoefening` (highest
scaffolded difficulty) or the first `Zelfstandige oefening`. Always include
sub-question (d) confronting a tempting wrong reading—this is the
misconception-confrontation lever.

### 3.3 Distinction-drilling tables need column headers (MANDATORY)

When an exercise is a multi-row classification table (e.g., "for each situation, decide if it's a shift or a movement"), the table **must include 2–4 explicit column headers** that name the response format.

❌ **Wrong** — empty answer column forces students to invent the format:

```markdown
| | Situatie |
|---|---|
| a | De prijs stijgt van €45 naar €60. |
| b | Het inkomen daalt. |
```

✅ **Right** — column headers scaffold the response format:

```markdown
| | Situatie | Beweging of verschuiving? | Richting | Vraagfactor |
|---|---|---|---|---|
| a | De prijs stijgt van €45 naar €60. |  |  |  |
| b | Het inkomen daalt. |  |  |  |
```

The headers tell weaker students what each cell should contain, without giving away the answers. They make the cognitive task purely about the analysis instead of about inventing a response structure.

### 3.4 Context selection rules

- Each exercise uses a different context from the others in the same paragraph
- Do not reuse a context that appears in another paragraph of the same chapter
- Use recognisable, age-appropriate settings (bakeries, cinemas, streaming services, public transport, sports events, food markets)
- The target exercise context comes from the blueprint — do not change it
- Interleaving exercises may reuse contexts from earlier chapters (this reinforces transfer)

---

## PART 4: ANSWER MODEL DESIGN

### 4.1 Unified procedures

The answer model follows the **exact same steps** taught in the worked example, in the same order, with the same notation. No shortcuts, no alternative methods, no reordering.

### 4.2 Structure per exercise

```markdown
**Opgave X**

**a)**
Stap 1: [description of what to do]
[calculation or reasoning]

Stap 2: [description]
[calculation or reasoning]

Antwoord: [final answer with units]

*Waarom:* [1–2 sentences explaining why this step/answer makes economic sense]
```

### 4.3 Rules

- **Always show substitution.** Don't jump from formula to answer. Show: formula → substitution → intermediate result → final answer.
- **Always include units.** Every numerical answer has a unit (€, %, stuks, eenheden).
- **Always include "Waarom".** At least for the final answer of each sub-question: why does this answer make economic sense? This prevents students from memorising procedures without understanding.
- **Rounding:** state the rounding rule once at the top of the answer model (e.g., "Rond af op 2 decimalen tenzij anders aangegeven"). Apply consistently.
- **Graph answers:** include a reference to the graph file in `_assets/`. The graph must show the complete solution (all curves, equilibrium points, shaded areas, labels).
- **Concept precision (MANDATORY).** When attributing a change to a vraagfactor / aanbodfactor / cost driver, always pick the **most economically specific category** (see `references/authored/economic_mathematical_precision_reference.md` §4.3 and §12.1). Do NOT blur "preferences" with "price of a substitute", or "demand factor" with "supply factor".
  - ❌ Wrong: "Petrol prices rise → biking becomes more attractive → preferences for biking changed → shift right"
  - ✅ Right: "Petrol prices rise → cars (substitute for the bike) become more expensive → price of substitute changes → shift right"
  - When there's a tempting wrong attribution, add a one-line `⚠️ Let op de juiste vraagfactor` reminder in the answer model.
  - Why: beginners are still building the categorisation reflex. Loose attribution teaches them to fall back on "preferences" whenever they're unsure, collapsing the very distinction the lesson is trying to teach.

### 4.4 Denkertje / Bonusopgave answer model

The Denkertje/Bonusopgave answer model is different:
- No step-by-step procedure (the point is that the student structures their own reasoning)
- Instead: a **model answer** showing one strong response
- Followed by: **beoordelingscriteria** (2–4 bullet points stating what a good answer includes)

---

## PART 5: CLOSING REVIEW SELECTION

### 5.1 Which taught skills to revisit

**Priority 1 — Direct prerequisites:**
Skills that the current paragraph builds on. Example: if the current paragraph is B2C2§1 (consumer surplus), interleave with B1C4§1 (equilibrium solving) because surplus calculation requires finding equilibrium first.

**Priority 2 — Fundamental skills under regular repetition:**
- Percentage calculations and percentage changes
- Graph reading (aflezen, interpoleren)
- Index number calculations
- Shift vs. movement distinction
- Basic cost calculations (TK, GTK)

**Priority 3 — Recent skills at risk of decay:**
Skills from the previous chapter that haven't been practised since.

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
- **Student-drawn graphs** (in independent practice / target exercise): do not provide a graph in the exercise. Provide the correct graph in the answer model only.

### 6.2 Graph specification format

For each graph needed, include a specification block:

```
GRAPH SPEC: [descriptive name]
Type: supply-demand / monopoly / surplus / flow-diagram / bar-chart
Curves: V: p = -2Q + 100, A: p = 3Q - 25
Equilibrium: Q* = 25, P* = 25
Shading: CS triangle (blue, low opacity)
Labels: "V (vraag)", "A (aanbod)", "E (evenwicht)"
Axis: x = "Hoeveelheid (Q)", y = "Prijs (€)"
File: _assets/2.2.1_ex_1.svg
```

The `economic-graph` skill uses this spec to generate SVG + PNG.

### 6.3 Supply curve rule

Supply lines always extend to the P-axis (y-axis), even when the y-intercept is negative. Supply lines never cross the Q-axis.

---

## PART 7: FILE FORMAT

### 7.1 exercises.md structure

```markdown
# Opgaven §X.Y.Z — [Title from blueprint]

## Uitgewerkt voorbeeld

[Fully solved example — students read, not solve]

## Startopgaven

**Opgave 1 — Ophalen**
[Short retrieval of a prerequisite that was already taught]

**Opgave 2 — Begripscheck**
[Compact, low-stakes check of current-content comprehension]

*Korte route: Startopgaven -> Zelfstandige oefening -> Doeloefening.*

> Vastgelopen? Gebruik desgewenst de aanvullende hulp in Part B.

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

> **Samenvatting §X.Y.Z**
> - [Compact recap after section 7; not an eighth exercise heading]
```

Do not insert a top-level summary, website-help stage, generic `Opgaven`, or
other exercise heading between `Uitgewerkt voorbeeld` and `Startopgaven`, or
anywhere inside the contiguous seven-heading block.

### 7.2 answers.md structure

```markdown
# Antwoorden §X.Y.Z — [Title]

**Afrondingsregel:** [state once]

---

**Opgave 1**

**a)**
Stap 1: ...
...
Antwoord: ...
*Waarom: ...*

[etc. for all exercises]

---

**Denkertje — modelantwoord en beoordelingscriteria**

*Modelantwoord:*
[One strong example response]

*Beoordelingscriteria:*
- ...
- ...
```

---

## DECISION CHECKLIST — BEFORE GENERATING EXERCISES

1. □ List the lesson goals and decompose every doeloefening subquestion into observable operations
2. □ Complete the required alignment table; name every uncovered gap
3. □ Design the worked example from the target chain — same operations, simpler values/context, no extra operation
4. □ Design both Startopgaven roles under one heading: taught-prerequisite retrieval + compact current-content check
5. □ Record the whole-lesson equation (motivation + instruction + example + transitions/recap + actual core-route questions ≤55); range addition alone is not proof
6. □ If guided practice is useful, keep the same goal, add stronger explicit scaffolding, plan deliberate fading, and add neutral skip wording
7. □ Select 1–2 accessible closing-review skills from already taught content; introduce no theory there
8. □ Design bonus for cognitive flexibility, not more arithmetic of the same kind
9. □ Keep the exact seven headings contiguous and keep Part B route/help subordinate
10. □ Specify all graphs and write the unified-procedure answer model with substitution, units, and "waarom"

---

## POST-BUILD VERIFICATION — AFTER GENERATING EXERCISES

After generating opgaven.md and antwoorden.md, run these checks before delivering:

1. □ Extract all `![...](...)` image references from both files
2. □ Verify each referenced asset exists in `_assets/` (both `.svg` and `.png`)
3. □ If ANY are missing → the exercise set is **NOT complete**. Generate the missing graphs before delivering.
4. □ Verify asset naming follows convention: `X.Y.Z_{type}_{number}.{ext}`
5. □ Verify the seven Book 2+ headings and exact order, with no intervening top-level stage
6. □ Verify both Startopgaven roles, the route note, section time estimates, optional guided fading/skip wording, flexibility bonus, and no-new-theory closing review
7. □ Verify the alignment table has no silent target-operation gap
8. □ Verify the whole-lesson equation totals actual planned minutes ≤55 and preserves all target operations

**A delivered exercise set with missing graph files is a broken deliverable, not a complete one.**

---

*This skill generates exercises. For the textbook paragraph (theory + exercises integrated), see `econ-textbook-paragraph`. For pedagogical principles, see `econ-didactiek`. For graph generation, see `economic-graph`.*

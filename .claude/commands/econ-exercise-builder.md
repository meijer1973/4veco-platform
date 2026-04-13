---
name: econ-exercise-builder
description: "Generates a complete exercise set with answer models for a single textbook paragraph, based on the course blueprint. Produces exercises.md and answers.md with worked examples, guided practice (dual coding fading), independent practice, interleaving exercises, the target exercise, and a verdiepingsopdracht. Total exercise time budget: 40-60 minutes of student work. Use this skill when the user provides a paragraph spec from the blueprint and wants exercises generated. Trigger when the user mentions oefeningen maken, opgavenset, antwoordmodel, doeloefening uitwerken, or exercise generation for a specific paragraph. Always use in combination with econ-didactiek (pedagogical principles) and economic-graph (for graph specifications within exercises)."
---

# Economics Exercise Builder

Generates a complete exercise set + answer models for one textbook paragraph, given a blueprint paragraph spec. This skill handles exercise design and sequencing. For pedagogical principles, see `econ-didactiek`. For graph generation, see `economic-graph`.

---

## PART 1: INPUT AND OUTPUT

### 1.1 Required input

The blueprint paragraph spec, containing:
- Paragraph reference (e.g., B2C1§2)
- Target exercise (the doeloefening)
- Lesson goals
- Difficulty notes
- Difficulty rating (⬜ LIGHT / 🟨 MEDIUM / 🟥 HEAVY)

Additionally, the builder needs:
- The list of all preceding paragraphs and their core skills (for interleaving selection)
- The chapter context (which other paragraphs are in this chapter, to avoid context reuse)

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

The total exercise set (excluding the worked example, which is read/studied) must account for **40–60 minutes of student work**. This covers classroom independent practice + homework.

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
| Verdiepingsopdracht (open, evaluative) | 8–15 min | Requires argumentation, model critique |

### 2.3 Budget allocation

| Component | Time share | Notes |
|-----------|------------|-------|
| Guided practice (with fading) | ~50% | Core skill acquisition |
| Independent practice | ~20% | Same skill, no scaffolding |
| Interleaving exercises | ~15% | Earlier skills, quick |
| Target exercise | ~15% | The doeloefening from the blueprint |

The verdiepingsopdracht is **outside** the 40–60 min budget — it is optional stretch material.

### 2.4 Adjusting for difficulty

- **⬜ LIGHT paragraph:** guided practice is shorter (concepts are intuitive), more time for interleaving (3–4 exercises from earlier chapters)
- **🟨 MEDIUM paragraph:** balanced distribution as above
- **🟥 HEAVY paragraph:** guided practice takes most of the budget, interleaving reduced to 1–2 quick exercises

---

## PART 3: EXERCISE PROGRESSION

### 3.1 The sequence

```
1. WORKED EXAMPLE
   Not an exercise — a fully solved example that demonstrates the procedure.
   Same procedure as the target exercise, simpler numbers and context.
   Students read/study this, not solve it.

2. STARTOEFENINGEN (4-stage dual coding fading)
   Exercise 1: READ a labeled graph
       Graph already shows the change/concept drawn AND labeled.
       Question asks student to identify, classify, or interpret what they see.
       (e.g., "Which situation is a movement and which is a shift?
              What might have caused each one?")
   Exercise 2: DRAW on a provided graph
       Graph base provided (axes + initial line/curve).
       Student adds the movement/shift/area themselves.
   Exercise 3: DESCRIBE without a graph
       Text-only question. Student reasons about what would happen.
       (No visual provided; visual not required in answer.)

3. INDEPENDENT PRACTICE
   1–3 exercises at target difficulty, no scaffolding, no visuals provided.
   Different contexts from guided practice.
   Stage 4 of the fading: students draw their own graph from scratch
   when the question requires it.

4. INTERLEAVING EXERCISES
   1–4 exercises practising skills from previous paragraphs.
   Keep these quick (2–4 min each).
   Select skills that:
   (a) are prerequisites for the current paragraph, or
   (b) are fundamental skills that benefit from regular repetition
       (percentage calculations, graph reading, surplus calculation)

5. TARGET EXERCISE
   The doeloefening from the blueprint, verbatim or lightly adapted.
   This is the capstone — if a student completes this independently, 
   the paragraph has succeeded.

6. VERDIEPINGSOPDRACHT (outside time budget)
   One open question at Bloom level analyseren/evalueren/creëren.
   Different context from the main exercises.
   No scaffolding, no hints, no formulekaart.
   Framed as "Denkertje" or "Bonusopgave".
```

### 3.2 Dual coding fading — the 4-stage rule

Across the startoefeningen + independent practice, visuals fade in four stages:

| Stage | Exercise | What the student is given | What the student does |
|-------|----------|--------------------------|----------------------|
| 1 | Startoefening 1 | Graph **with** the change drawn AND labeled | Reads, identifies, classifies, explains |
| 2 | Startoefening 2 | Graph base (axes + initial line) only | Draws the change themselves |
| 3 | Startoefening 3 | No graph | Reasons in text/words only |
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

**Placement:** as the LAST starter exercise (highest scaffolded difficulty) OR the FIRST independent exercise. Always include sub-question (d) confronting a tempting wrong reading — this is the misconception-confrontation lever.

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
- **Concept precision (MANDATORY).** When attributing a change to a vraagfactor / aanbodfactor / cost driver, always pick the **most economically specific category**. Do NOT blur "preferences" with "price of a substitute", or "demand factor" with "supply factor".
  - ❌ Wrong: "Petrol prices rise → biking becomes more attractive → preferences for biking changed → shift right"
  - ✅ Right: "Petrol prices rise → cars (substitute for the bike) become more expensive → price of substitute changes → shift right"
  - When there's a tempting wrong attribution, add a one-line `⚠️ Let op de juiste vraagfactor` reminder in the answer model.
  - Why: beginners are still building the categorisation reflex. Loose attribution teaches them to fall back on "preferences" whenever they're unsure, collapsing the very distinction the lesson is trying to teach.

### 4.4 Verdieping answer model

The verdiepingsopdracht answer model is different:
- No step-by-step procedure (the point is that the student structures their own reasoning)
- Instead: a **model answer** showing one strong response
- Followed by: **beoordelingscriteria** (2–4 bullet points stating what a good answer includes)

---

## PART 5: INTERLEAVING SELECTION

### 5.1 Which skills to interleave

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

### 5.2 Interleaving exercise design

- Keep interleaving exercises **short** (2–4 minutes each)
- Use a **different context** from the original paragraph where the skill was taught
- Do **not** add scaffolding — these are revision, not new learning
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
File: _assets/B2C2S1_ex_1.svg
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

---

## Opgaven

**Opgave 1** *(met grafiek — zie figuur 1)*
[Exercise text]

![Figuur 1: beschrijving](_assets/B1C2S1_ex_1.svg)

**Opgave 2** *(met grafiek — zie figuur 2)*
[Exercise text at target difficulty]

**Opgave 3**
[Exercise text at target difficulty, no visual provided]

**Opgave 4**
[Independent practice]

**Opgave 5**
[Independent practice]

---

## Interleaving

**Opgave 6** *(herhaling §X.Y.Z: [skill name])*
[Quick revision exercise]

**Opgave 7** *(herhaling §X.Y.Z: [skill name])*
[Quick revision exercise]

---

## Doeloefening

**Opgave 8**
[The target exercise from the blueprint]

---

## Denkertje *(bonusopgave)*

**Opgave 9**
[Open evaluative question, higher Bloom level]
```

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

1. □ Read the target exercise from the blueprint — this sets the ceiling
2. □ List the lesson goals — every goal must be practised in at least one exercise
3. □ Estimate total time — does the set fit in 40–60 minutes?
4. □ Design the worked example — same procedure, simpler numbers/context
5. □ Plan dual coding fading — which exercises get graphs, which don't?
6. □ Select interleaving skills — check prerequisite chains + fundamental skills
7. □ Choose contexts — all different, none reused within the chapter
8. □ Write the verdiepingsopdracht — higher Bloom, different context, no scaffolding
9. □ Specify all graphs — full specs for `economic-graph` skill
10. □ Write the answer model — unified procedures, substitution shown, units, "waarom"

---

*This skill generates exercises. For the textbook paragraph (theory + exercises integrated), see `econ-textbook-paragraph`. For pedagogical principles, see `econ-didactiek`. For graph generation, see `economic-graph`.*

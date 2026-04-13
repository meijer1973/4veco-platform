---
name: econ-textbook-paragraph
description: "Builds a complete textbook paragraph for economics education (bovenbouw vwo): theory explanation, worked example, exercises, and graphs — assembled into a markdown file with assets, then exported to PDF. Takes a blueprint paragraph spec and the exercise set from econ-exercise-builder as input. Use this skill when the user wants to create a textbook paragraph, lesinhoud, theorie-uitleg for the werkboek, or any textbook section. Trigger when the user mentions paragraaf schrijven, werkboek, tekstboek, theorie-uitleg schrijven, lesinhoud, or textbook paragraph. Always use in combination with econ-didactiek (pedagogy), econ-exercise-builder (exercises), and economic-graph (graphs)."
---

# Economics Textbook Paragraph Builder

Builds one complete textbook paragraph: theory + worked example + exercises + graphs → markdown + assets + PDF. This skill handles the textbook-specific format and writing rules.

**Companion skills (always read first):**
- `econ-didactiek` → pedagogical principles (scaffolding, dual coding, Bloom's, misconceptions)
- `econ-exercise-builder` → generates `exercises.md` and `answers.md` (run first)
- `economic-graph` → generates SVG/PNG graphs (called during build)
- `econ-pdf-builder` → PDF export pipeline (styling, page breaks, image embedding)
- `econ-quality-control` → quality assurance: generate quality_ref after build, on-demand quality reports
- `econ-paragraph-review` → two-pass review protocol: didactic architecture + mathematical precision

---

## PART 1: INPUT AND OUTPUT

### 1.1 Required input

1. **Blueprint paragraph spec** — target exercise, lesson goals, difficulty notes, difficulty rating
2. **Exercise set** — `exercises.md` and `answers.md` from `econ-exercise-builder`
3. **Preceding paragraphs** — to know what has been taught (for recall boxes, cross-references)

### 1.2 Output files

Per paragraph, saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.2.2 Vraagfactoren/`):

| File | Purpose |
|------|---------|
| `X.Y.Z [Name] – paragraaf.md` | Complete textbook paragraph in markdown |
| `X.Y.Z [Name] – opgaven.md` | Exercise set (exercises only, no theory) |
| `X.Y.Z [Name] – antwoorden.md` | Answer model with step-by-step solutions |
| `X.Y.Z [Name] – paragraaf.pdf` | PDF export of paragraaf.md with embedded images |
| `X.Y.Z [Name] – opgaven.pdf` | PDF export of opgaven.md |
| `X.Y.Z [Name] – antwoorden.pdf` | PDF export of antwoorden.md |
| `_assets/*.svg` | All graphs and diagrams as SVG |
| `_assets/*.png` | All graphs and diagrams as PNG (rasterised from SVG) |
| `build_pdf.py` | PDF build script (paragraph-specific CSS + paths) |

### 1.3 File naming convention

**Main files:** `X.Y.Z [Name] – <type>.<ext>` where X=book, Y=chapter, Z=paragraph. Types: `paragraaf`, `opgaven`, `antwoorden`. Use en-dash (–), not hyphen (-).

**Assets:**
```
_assets/B{X}C{Y}S{Z}_{type}_{number}.svg
_assets/B{X}C{Y}S{Z}_{type}_{number}.png
```

Types: `fig` (graphs/diagrams in theory), `ex` (graphs in exercises), `we` (worked example graphs)

Examples:
```
1.2.2 Vraagfactoren – paragraaf.md    — main paragraph file
1.2.2 Vraagfactoren – opgaven.md      — exercises
1.2.2 Vraagfactoren – antwoorden.md   — answer model
_assets/B1C2S2_fig_1.svg               — first theory figure
_assets/B1C2S2_we_1.svg                — worked example graph
_assets/B1C2S2_ex_1.svg                — exercise 1 graph
```

---

## PART 2: PARAGRAPH STRUCTURE

### 2.1 Section sequence (CANONICAL — never reorder)

Every theory paragraph follows this structure, in **exactly this order**:

```
┌─────────────────────────────────────────────┐
│ 1. HEADER                                   │
│    Paragraph number + title (no difficulty   │
│    rating — that is teacher-facing only)     │
├─────────────────────────────────────────────┤
│ 2. MOTIVATING PROBLEM                       │
│    A recognisable situation that creates     │
│    cognitive conflict / need for the concept │
├─────────────────────────────────────────────┤
│ 3. THEORY                                   │
│    Concept explanation with dual coding      │
│    (text + graphs built step by step)        │
│    Definition boxes, formula boxes,          │
│    misconception warnings, recall boxes      │
├─────────────────────────────────────────────┤
│ 4. WORKED EXAMPLE                           │
│    Fully solved, same procedure as target    │
│    exercise, simpler context                 │
├─────────────────────────────────────────────┤
│ 5. SUMMARY BOX                              │
│    3–5 bullet points + forward pointer       │
│    Place IMMEDIATELY after the worked        │
│    example, BEFORE the exercises             │
├─────────────────────────────────────────────┤
│ 6. WEBSITE-HELP NOTE                        │
│    "Vastgelopen op een opgave?" callout      │
├─────────────────────────────────────────────┤
│ 7. EXERCISES                                │
│    Embedded inline (not just referenced)     │
└─────────────────────────────────────────────┘
```

**Critical**: the worked example always comes BEFORE the summary, and the summary always comes BEFORE the exercises. A student reading linearly should see: theory → worked example → recap → practice. Putting the summary before the worked example interrupts the flow and is wrong.

### 2.2 What goes where

| Section | Content | Time share of lesson |
|---------|---------|---------------------|
| Motivating problem | Context, question, maybe a provocative claim | ~5 min (class discussion) |
| Theory | Concept, definitions, formulas, graphs | ~15 min (instruction) |
| Worked example | Step-by-step solution, studied by students | ~5 min (reading) |
| Exercises | Guided → independent → interleaving → target | ~40–60 min (practice + homework) |
| Summary | Recap, key formulas | ~2 min (reference) |

---

## PART 3: WRITING RULES

### 3.1 Theory text

**Lean.** One concept per paragraph. Do not explain adjacent concepts — those belong in their own paragraphs. If you catch yourself writing "we will see later that…" more than once, you are including too much.

**Problem-first.** Start with the motivating problem, not with the definition. The student should feel "I need a tool to solve this" before they receive the tool.

**Concrete before abstract.** First a specific example ("A bakery sells bread at €2.50, but the ingredients cost €0.80…"), then the general principle ("Variable costs are costs that change with production volume"), then the formula (TVK = GVK × Q).

**Active voice, present tense.** "De bakker berekent zijn winst" not "De winst kan als volgt berekend worden."

**Short sentences.** Average sentence length under 20 words. One idea per sentence.

**No filler.** Every sentence must teach something or set up the next sentence. Cut "Het is belangrijk om te weten dat…" — just state the thing.

### 3.2 Definitions

Definitions get a **definition box** — visually distinct from running text.

```markdown
> **Definitie: Variabele kosten (VK)**
> Kosten die veranderen als de productie toe- of afneemt.
> Voorbeelden: grondstoffen, energie, stukloon.
```

Rules:
- One definition per box
- Definition first, then examples
- Use the exact terminology from the syllabus (Dutch)
- Provide the abbreviation in parentheses on first use

### 3.3 Formulas

Formulas get a **formula box** — visually distinct, monospace.

```markdown
> **Formule**
> ```
> TVK = GVK × Q
> TK = TCK + TVK
> GTK = TK / Q
> ```
```

Rules:
- Group related formulas together (max 3–4 per box)
- Use the same variable names as the syllabus
- Show units in parentheses after the box if not obvious

### 3.4 Graphs in theory sections

Graphs are built **step by step** in the theory text — never dropped in as finished images.

**Pattern:**

```markdown
We tekenen eerst de vraaglijn. Bij Q = 0 is de prijs €50 (het y-snijpunt). 
Bij P = 0 is de gevraagde hoeveelheid 100 stuks (het x-snijpunt).

![Figuur 1: De vraaglijn](_assets/B2C2S1_fig_1.svg)

Nu voegen we de aanbodlijn toe. Het aanbod begint bij P = €5 
(producenten bieden pas aan als de prijs boven €5 komt). 
Bij Q = 60 is de prijs €20.

![Figuur 2: Vraag en aanbod samen](_assets/B2C2S1_fig_2.svg)

Het snijpunt van vraag en aanbod is het evenwicht: P* = €20, Q* = 60.
```

This means **multiple graph versions** may be needed for a single concept: one with just the demand curve, one adding supply, one showing the equilibrium, one shading surplus areas. Generate each as a separate SVG/PNG using the `economic-graph` skill.

### 3.5 Misconception warnings

When a known misconception applies (see `econ-didactiek` §7.4), include a warning box:

```markdown
> **⚠️ Let op — veelgemaakte fout**
> Veel leerlingen verwarren een *verschuiving van* de vraaglijn 
> met een *beweging langs* de vraaglijn. 
> Een prijsverandering van het goed zelf → beweging LANGS de lijn.
> Een verandering van inkomen, voorkeuren of andere factoren → verschuiving VAN de lijn.
```

Rules:
- Place immediately after the concept that triggers the misconception
- State both the wrong and correct understanding side by side
- Keep to 3–4 lines maximum

### 3.6 Cross-references and recall boxes

**Cross-reference (forward):** brief, at the end of a section.
```markdown
*In §3 passen we deze formule toe op de monopolist.*
```

**Recall box (backward):** when a prerequisite skill is needed.
```markdown
> **📋 Herhaling uit §X.Y.Z**
> De evenwichtsprijs vind je door Qv = Qa te stellen en op te lossen naar P.
```

Rules:
- Recall boxes are brief (1–3 lines) — just enough to activate the memory, not re-teach
- Only add a recall box if the skill was taught more than one chapter ago

### 3.7 Summary box

At the end of every paragraph:

```markdown
> **Samenvatting §X.Y.Z**
> - [Key insight 1]
> - [Key insight 2]
> - [Key formula]
> - [Connection to next paragraph]
```

Rules:
- Maximum 5 bullet points
- Include the key formula(s) from this paragraph
- End with a forward pointer: "In de volgende paragraaf…"

---

## PART 4: GRAPH GENERATION WORKFLOW

### 4.1 Process

1. Identify all graphs needed (theory figures, worked example graphs, exercise graphs)
2. Write a graph specification for each (see `econ-exercise-builder` §6.2 for format)
3. Call `economic-graph` skill to generate SVG
4. Rasterise SVG → PNG using `sharp` (as per `economic-graph` pipeline)
5. Save both SVG and PNG to `_assets/`
6. Reference PNGs in markdown: `![caption](_assets/filename.png)`

### 4.1.bis Crowded-curve fix: split into side-by-side panels

When an overview figure needs to show 3+ curves (e.g., V₁, V₂, V₃ for original / shift-right / shift-left), do NOT cram them all onto one coordinate system. **Split into two side-by-side panels** sharing the same axes/scale, each showing ONE phenomenon clearly.

❌ **Wrong:** Three overlapping curves on one plot → label collisions, legend boxes occluding curves, arrows lost in noise.
✅ **Right:** Left panel shows phenomenon A (e.g., movement along curve), right panel shows phenomenon B (e.g., shift of curve). Both panels share identical axes.

Use the rule labels (§4.5) to make the contrast between the two panels explicit.

### 4.2 Step-by-step theory graphs

For theory sections where a graph is built incrementally (§3.4), generate **separate SVG files** for each stage:

```
_assets/B2C2S1_fig_1.svg  — demand curve only
_assets/B2C2S1_fig_2.svg  — demand + supply
_assets/B2C2S1_fig_3.svg  — demand + supply + equilibrium + labels
_assets/B2C2S1_fig_4.svg  — full graph with surplus shading
```

Each subsequent figure adds elements to the previous one. Axes, scale, and positioning must be identical across all stages so the student sees accumulation, not a different graph.

### 4.3 Numerical alignment between graph and text (MANDATORY)

When a graph illustrates a specific scenario from the surrounding text, the **numbers in the graph must match the numbers in the text exactly**.

If the text says "de prijs van boter stijgt van €2 naar €3 en de gevraagde hoeveelheid daalt van 1000 naar 700 pakjes", then the figure that illustrates this MUST show:
- price labels: €2 and €3 (NOT 20 and 30)
- quantity labels: 700 and 1000 (NOT 500 and 750)
- axes scaled to fit those values

**Why:** Mismatched numbers force the student to hold two parallel numerical contexts simultaneously. This is extraneous cognitive load (Sweller) and is purely friction — it teaches nothing.

**Apply to:** all step-by-step theory figures, the worked example graph, and any exercise graph that references the same scenario as the prose.

### 4.3.ter Domain restrictions belong with the formula (MANDATORY)

When introducing an algebraic sum, product, or derived function that's only valid in a restricted domain (e.g., where all summands are positive, or where Q ≥ 0), the **domain restriction must appear at the moment the formula is introduced**, not in a later worked example or footnote.

Use a labeled formula box with the restriction visible:

```markdown
> **Formule: Collectieve vraagfunctie (zolang beide kopen)**
> Q_coll = Q_A + Q_B = -5P + 18
>
> Geldig voor 0 ≤ P ≤ €3,50 (de prijs waarbij A afhaakt).
```

Then add a one-sentence reminder: "Zodra één van de twee consumenten afhaakt, klopt deze formule niet meer en moet je opnieuw optellen, alleen met de overgebleven kopers."

**Why:** Students who stop reading after the formula will assume it always applies. Stating the restriction immediately prevents the wrong mental model from forming. This applies to ALL piecewise constructions: collective demand, market supply, multi-segment cost curves, etc.

### 4.3.bis Ceteris paribus must be explicit when introducing curves (MANDATORY)

Whenever a curve is introduced for the first time (vraaglijn, aanbodlijn, kostencurve, ...), the surrounding text MUST explicitly state that the curve holds *with all other conditions equal* (ceteris paribus).

❌ **Wrong:** "De vraaglijn laat zien hoeveel consumenten willen kopen bij verschillende prijzen."
✅ **Right:** "De vraaglijn laat het verband zien tussen de prijs en de gevraagde hoeveelheid, **terwijl alle andere omstandigheden gelijk blijven**."

This applies equally to recall boxes that reference a curve from a prior paragraph. Always include the ceteris paribus qualifier.

**Why:** Without ceteris paribus, the implied claim is "demand depends only on price". This sets up exactly the misconception the shift-vs-movement section then has to undo. Stating ceteris paribus up front prevents the wrong mental model from forming in the first place.

### 4.4 Visual summary for grouped concepts (MANDATORY)

When the theory introduces a list of N items (5 demand factors, 4 cost categories, 3 market structures, etc.), generate **one summary visual** that shows all items in a single picture as a memory anchor.

Typical formats:
- **Radial / hub-and-spoke diagram**: central concept + boxes around it for each item
- **Concept map**: items connected with arrows showing relationships
- **2-column comparison schematic**: left vs right (e.g., "shift left" vs "shift right")

Place the summary visual immediately after the section that introduces the list, before the worked example. Reference it from the text:

```markdown
Figuur 5 vat de vijf vraagfactoren in één beeld samen.

![Figuur 5: De vijf vraagfactoren — overzicht](_assets/B1C2S2_fig_5.svg)
```

**Why:** A bulleted list is text-only and misses the dual coding opportunity. A single overview graphic gives students a visual hook they can recall later. Do NOT skip this step even when the items are described well in prose.

### 4.4.bis Triple coding: graph + text + numerical table (MANDATORY)

For any concept with a procedure that produces numerical outputs (collective demand summation, surplus calculation, equilibrium, elasticity, ...), present the same idea in **three encoding channels** within the same theory section:

1. **Visual** — a graph (or graphs built step by step)
2. **Verbal** — body text describing what's happening
3. **Numerical** — a small table organizing several rows of values

Place all three close together so the student can switch between channels as they read.

**Example pattern:**

```markdown
We tellen de hoeveelheden bij elke prijs op:

| Prijs | Q_A | Q_B | Q_collectief |
|---|---|---|---|
| €1 | 5 | 8 | 13 |
| €2 | 3 | 5 | 8 |
| €3 | 1 | 2 | 3 |

Zo zie je dezelfde informatie nu in drie vormen tegelijk: in de woorden hierboven, in de twee grafieken, én in deze tabel.
```

**Why:** Different students prefer different encodings. The graph is good for visual learners, the table for those who think numerically, the text for those who reason verbally. Triple coding ensures no student is left out and reinforces the concept through redundancy across channels.

### 4.5 Direct rule labels inside overview figures (MANDATORY)

Overview / summary figures (the "everything together" diagram for a key distinction) must include **direct rule annotations inside or directly under the figure**, not only in the surrounding prose.

For a two-panel comparison figure, place a small boxed label below each panel:

```
┌─────────────────────────┐    ┌─────────────────────────┐
│   Panel A (movement)    │    │   Panel B (shift)       │
│                         │    │                         │
└─────────────────────────┘    └─────────────────────────┘
┌─────────────────────────┐    ┌─────────────────────────┐
│ Eigen prijs verandert   │    │ Andere factor verandert │
│ → beweging LANGS de lijn│    │ → verschuiving VAN lijn │
└─────────────────────────┘    └─────────────────────────┘
```

Use a colored stroke that matches the corresponding curve color (blue for movement, green for shift, etc.). Each box ~50px tall, ~260px wide.

**Why:** Students re-scan figures during revision without re-reading the surrounding paragraphs. Rule labels embedded in the figure mean the rule is recoverable from the figure alone — the figure becomes a self-contained study aid.

### 4.6 Supply curve rule

Supply lines always extend to the P-axis (y-axis), even when the y-intercept is negative. Supply lines never cross the Q-axis.

---

## PART 5: PDF EXPORT

For PDF export (image embedding, CSS styling, page breaks, weasyprint pipeline), see `econ-pdf-builder`. That skill handles the full conversion from markdown to print-ready PDF.

**Key rule:** difficulty ratings (⬜/🟨/🟥) and time estimates per exercise are teacher-facing blueprint metadata and must not appear in student-facing output. Strip them before export.

---

## PART 6: QUALITY CHECKLIST

### Before delivering a paragraph:

**Content checks:**
1. □ Motivating problem comes before theory (problem-first)
2. □ One concept only — no scope creep
3. □ Every lesson goal from the blueprint is addressed in theory AND practised in exercises
4. □ Worked example uses the same procedure as the target exercise
5. □ Dual coding fading applied (visual → visual → no visual in guided practice)
6. □ At least one misconception warning if applicable (check `econ-didactiek` §7.4)
7. □ Definitions use exact syllabus terminology
8. □ Answer model follows unified procedures — same steps as worked example

**Graph checks:**
9. □ Theory graphs built step by step (not dropped in complete)
10. □ All graphs generated via `economic-graph` skill with coordinate verification
11. □ Supply lines extend to P-axis, never cross Q-axis
12. □ **Asset completeness (BLOCKING):**
  - 12a. □ Extract all `![...](...)` references from paragraaf.md, opgaven.md, antwoorden.md — list every referenced file
  - 12b. □ Verify each referenced file exists in `_assets/` (both `.svg` and `.png`). List any missing. **If ANY are missing → the paragraph is NOT complete. Generate missing assets before delivering.**
  - 12c. □ Verify no orphaned assets in `_assets/` (files not referenced in any .md)
13. □ Axes, scale, positioning identical across incremental theory figures

**Format checks:**
14. □ All image references verified to resolve (covered by 12a/12b — do not skip)
15. □ No difficulty ratings or time estimates in student-facing markdown
16. □ Definition boxes, formula boxes, warning boxes visually distinct
17. □ Summary box present with ≤5 points and forward pointer
18. □ File naming follows convention: `B{book}C{chapter}S{paragraph}_type_number`
19. □ PDF exported via `econ-pdf-builder` without errors

**Time check:**
20. □ Exercise set fits 40–60 min student work time (cross-check with exercise builder)

**Didactic and precision review (before quality_ref):**
21. □ Run `econ-paragraph-review` Pass 1 (didactic architecture): opening, scaffolding, dual coding, fading, misconceptions, exercises, summary
22. □ Run `econ-paragraph-review` Pass 2 (mathematical precision): graph accuracy, algebra, terminology, answer verification, cross-paragraph consistency
23. □ All FAIL items resolved; FLAG items addressed or documented

**Quality control (after review passes):**
24. □ Generate `quality_ref` using `econ-quality-control` skill (Part 2)
25. □ Store as `[paragraph-code]-quality-ref.yaml` in the paragraph folder
26. □ All leerdoelen mapped to eindtermen with Bloom levels
27. □ All present components documented with inspectie standards and didactiek principles
28. □ Verantwoording section filled in honestly (flag weak points)

---

*This skill builds textbook paragraphs. For exercise generation, see `econ-exercise-builder`. For pedagogical principles, see `econ-didactiek`. For graph generation, see `economic-graph`. For PDF export, see `econ-pdf-builder`. For paragraph review, see `econ-paragraph-review`. For quality assurance, see `econ-quality-control`.*

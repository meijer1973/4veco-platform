---
name: econ-consolidation-builder
description: "Builds consolidation exercises and test exercises with source material (constructed contexts, data tables, graphs, flow diagrams, pay-off matrices) for economics education. Exercises combine multiple skills in exam-style opgaven: a single context with 4-6 escalating questions. Also reusable for building tests and test preparation chapters. Use this skill when the user mentions consolidatie, consolidation, bronmateriaal, exam-style, toetsoefeningen, toetsvoorbereiding, opgave ontwerpen, or when building exercises that integrate multiple skills around source material. Always use in combination with econ-didactiek (pedagogy), economic-graph (graphs), and econ-pdf-builder (PDF export)."
---

# Economics Consolidation Builder

Builds consolidation and test exercises: multi-skill, source-based, exam-style — with no new theory. The core unit is the **opgave**: a single context with source material and 4-6 escalating questions that weave together 2-5 concepts.

**Companion skills:**
- `econ-didactiek` — pedagogical principles
- `economic-graph` — graphs, flow diagrams, supply curve rules
- `econ-pdf-builder` — PDF export
- `econ-exercise-builder` — single-skill exercises (this skill builds multi-skill integrated opgaven)

---

## PART 1: THE OPGAVE AS CORE UNIT

### 1.1 What is an opgave?

One context, one source, 4-6 questions escalating in difficulty, weaving 2-5 skills. Mirrors VWO exam format.

```
Opgave: IJssalon Guarda
  Context: monopolist ice cream shop, demand + cost functions + graph
  Q12 (2p): Bereken de winst per ijsje
  Q13 (1p): Arceer de totale vaste kosten in de grafiek
  Q14 (4p): Bereken hoeveel procent van gestegen variabele kosten
             wordt doorberekend in de verkoopprijs
  Q15 (2p): Leg uit dat een gevangenendilemma kan ontstaan
  Q16 (2p): Leg uit dat zelfbinding het risico op prijzenoorlog beperkt
```

One context (ijssalon) weaves monopoly pricing, cost structures, game theory, strategic behaviour — 4 topics.

### 1.2 Consolidation vs. theory paragraph exercises

| | Theory paragraph | Consolidation |
|---|---|---|
| Unit | Individual exercise | Opgave (4-6 linked questions) |
| Skills | One per paragraph | 2-5 woven into one context |
| Source material | None or minimal | Central |
| New theory | Yes | **Never** |
| Exam format | Not yet | Yes |
| Purpose | Master one skill | Apply multiple skills under realistic conditions |

---

## PART 2: SOURCE MATERIAL

### 2.1 Types

| Type | When to use |
|------|-------------|
| Constructed context (100-250 words) | Every opgave needs one |
| Data table (3-8 rows x 2-5 columns) | Calculation from data |
| Function table (Qv=..., TK=...) | Monopoly, equilibrium, elasticity |
| Graph as source | Interpreting or extending a graph |
| Flow diagram | Multi-market analysis, policy chains |
| Pay-off matrix | Oligopoly, prisoner's dilemma |
| Formula with context | Applying formula to context data |
| Combined | Complex opgaven (3-4p per question) |

### 2.2 Design rules

- **Constructed, not clipped.** Fictional but realistic scenarios with precise embedded data. Not simplified news.
- **Data embedded in context.** Numbers in text ("De vaste kosten bedragen EUR500 per maand") or tables/graphs. Students extract relevant numbers.
- **Self-contained.** Source contains all needed information.
- **One world per opgave.** All questions reference the same context.
- **Language level.** VWO level. Economic terminology matches syllabus exactly.

### 2.3 Flow diagrams

Show how economic variables connect (marktwerking -> bedrijfskosten -> dekkingsgraad -> uitkering). Questions ask students to trace causal chains.

Use for: multi-market analysis, policy transmission, pension/insurance systems.

Design: boxes contain variable names (not explanations), arrows show causation direction, values attached to boxes or arrows. Generate as SVG via `economic-graph` skill (flow diagram mode).

### 2.4 Source material formatting

```markdown
---

**Opgave X: [Titel]**

[Constructed context — 100-250 words with embedded data]

**Tabel 1 [beschrijvende titel]**

| Kolom 1 | Kolom 2 | Kolom 3 |
|---------|---------|---------|
| ...     | ...     | ...     |

![Figuur 1: beschrijvende titel](_assets/X.Y.Z_fig_{N}.svg)

---
```

---

## PART 3: QUESTION DESIGN

### 3.1 Question type taxonomy

Based on VWO exam analysis. Types in order of frequency:

**Type 1: "Leg uit dat..." (~35%)**
Student gets the conclusion, must build the reasoning chain toward it. Harder than "Leg uit wat er gebeurt". Use for 2p questions requiring 2 causal links.
Example: `"Leg uit dat de totale zorgkosten kunnen afnemen door het besluit van de overheid."`

**Type 2: "Bereken..." (~20%)**
Never pure formula application. Student must: identify which formula, extract numbers from source, take multiple steps.
- Bad: "Bereken de evenwichtsprijs met Qv = Qa." (formula given, one step)
- Good: "Bereken de winst per ijsje." (find Q, calculate TK, TO, winst, divide)

**Type 3: "Leg uit of..." (~10%)**
Student first determines direction (stijgt/daalt, effectiever/minder), then explains.
Example: `"Leg uit of monetair beleid effectiever of minder effectief is geworden."`

**Type 4: "Is X een Y? Motiveer." (~10%)**
Apply definition to context. Good opener.
Example: `"Is een zorgbehandeling een collectief goed? Motiveer je antwoord."`

**Type 5: "Teken / Arceer..." (~7%)**
Draw curves on provided graph (shift ~1 cm) or shade areas (surplus, vaste kosten, welvaartsverlies).

**Type 6: "Leg uit met behulp van [figuur/tabel/getallen]..." (~10%)**
Forces explicit source material use. Combines calculation with explanation.

**Type 7: "Noem..." (~5%)**
Simple recall/identification. Typically 1p. Use sparingly.

### 3.2 Opgave question progression

| Position | Points | Bloom | Typical type |
|----------|--------|-------|-------------|
| Q1 | 1-2p | Begrijpen | "Is X een Y?" / simple "leg uit dat" |
| Q2 | 2p | Toepassen | "Bereken" / "Teken" |
| Q3 | 2p | Toepassen/Analyseren | Multi-step "bereken" / "leg uit dat" |
| Q4 | 2-3p | Analyseren | "Leg uit of" / "bereken + interpreteer" |
| Q5 | 2-4p | Analyseren | "Leg uit met behulp van" / complex calculation |
| Q6 | 2p | Evalueren | "Beoordeel of" / "Stel voor" (verdieping) |

**Point standards:** 1p = one action (name, shade, classify). 2p = two causal links or two calculation steps. 3p = multi-step + interpretation. 4p = complex multi-step (4+ steps). **~80% of questions are 2p.**

### 3.3 Cross-topic integration

Start from the context, ask "what economic questions does this situation naturally raise?" — not "which skills do I need to test?"

| Context | Natural skill integration |
|---------|-------------------------|
| Insurance market | Market forms + averechtse selectie + calculation + principaal-agent |
| Monopolist ice cream shop | Cost structures + MO=MK + game theory + zelfbinding |
| Two-country trade model | Labour market + goods market + exchange rates + monetary policy |
| Farmers choosing organic | Investment + cost calculation + game theory + externalities |

### 3.4 Skill coverage rule

Every consolidation paragraph must practise **all skills from its chapter**. Map questions to paragraph skills before writing. If a skill is missing, add a question or adjust the context.

---

## PART 4: ANSWER MODELS

### 4.1 Core rules

Follow unified procedures from `econ-exercise-builder` §4. Consolidation-specific additions:

### 4.2 Source referencing in answers

Answers must explicitly reference the source material — this teaches exam citation:

```markdown
**Stap 1:** Uit de tabel (Bron 1) lezen we af dat de prijs in 2024
EUR1,05 was en in 2025 EUR1,20.

**Stap 2:** Procentuele verandering = (1,20 - 1,05) / 1,05 x 100 = 14,3%
```

### 4.3 "Leg uit dat..." answer structure

Show the causal chain explicitly:

```markdown
**Antwoord (2 punten):**
Als het eigen risico voor huisartsbezoeken vervalt (gegeven),
gaan mensen eerder naar de huisarts (schakel 1).
Daardoor worden ziektes eerder ontdekt en behandeld,
wat duurdere behandelingen later voorkomt (schakel 2).
Zo kunnen de totale zorgkosten afnemen (conclusie = gegeven).
```

For 2p: 2 schakels (causal links) between given start and given conclusion.

### 4.4 Point allocation for tests

For test exercises, include point allocation per sub-question:

```markdown
**Opgave 2a** (4 punten)
- Correcte formule/aanpak (1 pt)
- Correcte substitutie met getallen uit bron (1 pt)
- Correct antwoord met eenheid (1 pt)
- Economische interpretatie (1 pt)
```

For consolidation paragraphs, point allocation is optional but helpful for self-assessment.

---

## PART 5: DIFFERENTIATION

Everyone gets source + opgaven. Additionally:
- **Begeleide inoefening** — same opgaven with scaffolding (available to anyone)
- **Verdiepingsopdracht** — 1-2 open evaluative questions (available to anyone)

### 5.1 Begeleide inoefening for consolidation

Apply `econ-didactiek` §3 scaffolding rules, plus **source reading support:**
- Hint where to look: "Kijk naar kolom 3 in de tabel" / "Volg de pijlen van X naar Y"
- Break compound questions into smaller steps (4p question -> 4 x 1p sub-questions)
- For "leg uit dat": provide first causal link, ask for the second
- For graph questions: provide partially completed graph

### 5.2 Verdiepingsopdracht

One evaluative question per opgave ("Denkertje"). No scaffolding, no hints. Different context if possible.
- "Een politicus beweert dat... Beoordeel deze uitspraak."
- "Stel een alternatieve maatregel voor en onderbouw waarom deze beter werkt."
- "Vergelijk twee scenario's en evalueer welk scenario de hoogste welvaart oplevert."

---

## PART 6: REUSE FOR TESTS

### 6.1 Test = multiple opgaven + constraints

| Aspect | Consolidation paragraph | Test |
|--------|------------------------|------|
| Toetsmatrijs | No | Required |
| Point allocation | Optional | Required per sub-question |
| Opgaven | 1-2 | 2-4 |
| Time | ~50-60 min | 45 or 120 min strict |
| Scope | One chapter | Multiple chapters (120 min) |

### 6.2 Toetsmatrijs integration

First create toetsmatrijs (skills x Bloom level x points), then design opgaven to fill it.

### 6.3 Target distributions

| Points | Target | Bloom level | Target |
|--------|--------|-------------|--------|
| 1p | ~5% | Onthouden/Begrijpen | ~25% |
| 2p | ~70% | Toepassen | ~40% |
| 3p | ~10% | Analyseren/Evalueren | ~35% |
| 4p | ~15% | | |

### 6.4 Cumulative test sources

For 120-min tests, source material may require cross-chapter skills:

```
Context: rising energy prices in a small economy
  -> Calculate percentage change (B1C1 skill)
  -> Identify supply shift (B1C3 skill)
  -> Calculate new equilibrium (B1C4 skill)
  -> Calculate welfare loss from tax (B2C3 skill)
  -> Evaluate government policy (evalueren)
```

---

## PART 7: GRAPH AND DIAGRAM USAGE

### 7.1 Four modes of graph use

| Mode | What students do | Graph provided? |
|------|-----------------|----------------|
| Read | Extract values | Yes — complete |
| Identify | Name shaded area / intersection | Yes — with shading/labels |
| Modify | Add curves, shade areas, mark points | Yes — base graph only |
| Trace | Follow causal arrows in flow diagram | Yes — flow diagram |

**Never ask students to draw a complete graph from scratch** in consolidation exercises. That belongs in theory paragraph exercises.

### 7.2 Graph specifications

Use `econ-exercise-builder` §6.2 spec format. For flow diagrams: specify box labels, arrow directions, attached values, layout direction. Generate via `economic-graph` skill.

---

## PART 8: FILE OUTPUT

### 8.1 Per consolidation paragraph

Saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.2.4 Consolidatie vraag en aanbod/`):

| File | Contents |
|------|----------|
| `X.Y.Z [Name] – opgaven.md` | Source material + opgaven in markdown |
| `X.Y.Z [Name] – antwoorden.md` | Answer models with steps, waarom, chain structure |
| `X.Y.Z [Name] – opgaven.pdf` | PDF export via `econ-pdf-builder` |
| `X.Y.Z [Name] – antwoorden.pdf` | PDF export |
| `_assets/*.svg, *.png` | Source graphs/diagrams + answer graphs |
| `build_pdf.py` | PDF build script |

Asset naming: `_assets/X.Y.Z_{type}_{number}.svg` (see `econ-textbook-paragraph` §1.3).

### 8.2 Per test

Saved to `<output-folder>/X.Y.Z [Name]/` (e.g., `1.4.1 Toets hoofdstuk 2/`):

| File | Contents |
|------|----------|
| `X.Y.Z [Name] – toets.md` | All opgaven with source material |
| `X.Y.Z [Name] – antwoorden.md` | Answer models with point allocation |
| `X.Y.Z [Name] – toetsmatrijs.md` | Skill x Bloom x points matrix |
| `X.Y.Z [Name] – toets.pdf` | PDF export |
| `X.Y.Z [Name] – antwoorden.pdf` | PDF export |
| `_assets/*.svg, *.png` | Source graphs/diagrams + answer graphs |
| `build_pdf.py` | PDF build script |

---

## DECISION CHECKLIST

### Consolidation paragraph:
1. List all chapter skills — every skill must appear in at least one question
2. Design context first — what scenario naturally invites all skills?
3. Choose source types (table, graph, flow diagram, function table, pay-off matrix)
4. Write source material — questions follow from it
5. Map questions to skills — check coverage
6. Question types: "leg uit dat..." primary, "bereken" never pure formula
7. Bloom progression: start accessible, end with "leg uit of" / "beoordeel"
8. Point allocation: ~80% of questions are 2p
9. Time estimate: fits ~50-60 min
10. Answer models: chain structure for "leg uit", source referencing
11. Verdiepingsopdracht: evalueren/creeren level, no scaffolding
12. Graphs: specify which are provided (source) vs answer-only
13. No new theory anywhere

### Test exercises (additional):
14. Toetsmatrijs complete — every leerdoel covered, Bloom distribution balanced
15. Design 2-4 opgaven, each covering a skill cluster
16. Point allocation adds up, ~70% in 2p questions
17. Time fits test duration (45 or 120 min)
18. For 120-min: at least one cross-chapter opgave

---

## POST-BUILD: QC AND QUALITY_REF

The consolidation builder itself does **not** run QC — that is handled by the chapter orchestrator (`econ-chapter-builder` Part 4). When building consolidation as part of a chapter:

1. The orchestrator spawns an independent review sub-agent that runs `econ-paragraph-review` (Pass 0 asset integrity + Pass 2 mathematical precision) on the consolidation output
2. The orchestrator spawns a sub-agent to generate `X.Y.Z-quality-ref.yaml` via `econ-quality-control`
3. Both artifacts are required by the chapter completeness gate

When building consolidation standalone (not as part of a chapter), run the QC steps from `BUILD-PARAGRAPH.md` Part A steps A5–A7 yourself.

---

*This skill builds consolidation and test opgaven. For single-skill exercises, see `econ-exercise-builder`. For pedagogical principles, see `econ-didactiek`. For PDF export, see `econ-pdf-builder`.*

# Vraagtypen & Opgaveontwerp — Reference for Economics Materials

```
last_verified: 2026-04-16
source: consolidated from econ-exercise-builder, econ-consolidation-builder,
        econ-testprep-builder, econ-didactiek, econ-textbook-paragraph,
        econ-paragraph-review, econ-quality-control, didactiek-principes.md
research_base: VWO economics exam analysis, cognitive load theory, dual coding theory,
               Bloom's taxonomy, backward fading (Renkl & Atkinson 2003)
```

This document is the **single source of truth** for all question types, exercise formats, answer model conventions, and opgave design rules used in the 4veco platform. It extracts and consolidates knowledge that is otherwise scattered across multiple skills and reference files. Skills reference this document for the underlying knowledge about questions; they handle the procedural "how to build" instructions themselves.

---

## PART 1: QUESTION TYPE TAXONOMY

### 1.1 The seven VWO exam question types

Based on analysis of VWO economics exams, all questions fall into seven patterns. These patterns govern how questions are phrased, what cognitive action they demand, and how the answer model is structured.

| Type | Instruction pattern | Frequency | Cognitive action | Typical points |
|------|-------------------|-----------|-----------------|----------------|
| 1 | "Leg uit dat..." | ~35% | Student receives the conclusion, must build the reasoning chain backward | 2p (2 causal links) |
| 2 | "Bereken..." | ~20% | Multi-step calculation; never pure formula plug-in | 2–4p |
| 3 | "Leg uit of..." | ~10% | Student first determines direction (stijgt/daalt), then explains why | 2p |
| 4 | "Is X een Y? Motiveer." | ~10% | Apply a definition to a concrete context | 1–2p |
| 5 | "Teken / Arceer..." | ~7% | Draw curves (~1 cm shift) or shade areas on a provided graph | 1–2p |
| 6 | "Leg uit met behulp van [figuur/tabel]..." | ~10% | Forces explicit use of source material; combines reading with explanation | 2–3p |
| 7 | "Noem..." | ~5% | Simple recall or identification | 1p |

### 1.2 Design rules per question type

**Type 1 — "Leg uit dat..."**
The student gets the conclusion as a given. The task is constructing the causal chain that leads to it. For 2 points, require exactly 2 causal links (schakels). Answer model structure:

```
Als [gegeven] (gegeven),
[schakel 1 → intermediate effect].
Daardoor [schakel 2 → further effect].
Zo [concludes to given conclusion] (conclusie = gegeven).
```

**Type 2 — "Bereken..."**
Never design as pure formula application. The student must: (1) identify the correct formula, (2) extract data from context/table/graph, (3) perform multi-step calculation. Answer model must show: formula → substitution → intermediate steps → final answer with units.

**Type 3 — "Leg uit of..."**
Two-phase question: first determine direction, then explain. Common formulations: "Leg uit of de consumentenprijs stijgt of daalt" or "Leg uit of het effect positief of negatief is." The answer model must explicitly show the directional conclusion before the reasoning.

**Type 4 — "Is X een Y? Motiveer."**
Definition application. Good as opener (Q1 position) because it activates prior knowledge. The answer must state the definition, map it to the context, and conclude yes/no.

**Type 5 — "Teken / Arceer..."**
Graph manipulation. In consolidation/tests: students draw ON provided graphs (shift a line, shade an area). Never ask students to draw complete graphs from scratch in consolidation — that belongs in theory paragraph exercises. Graph answers include a reference solution image.

**Type 6 — "Leg uit met behulp van..."**
Forces explicit source referencing. The answer must begin with: "Uit de tabel/figuur lezen we af dat..." before reasoning. Good for testing whether students can extract data, not just reason abstractly.

**Type 7 — "Noem..."**
Simple recall. Use sparingly (max 5% of points). Always 1 point. Useful as warm-up or as sub-question within a larger opgave.

### 1.3 Answer-structuring vocabulary

The instruction word determines the expected answer structure. These are distinct and non-interchangeable:

| Instruction | What the student must do | Answer structure |
|-------------|------------------------|------------------|
| **Noem** | List/identify without explanation | Bare items, no reasoning needed |
| **Leg uit** | Build causal chain from cause to effect | Numbered schakels (causal links) |
| **Verklaar** | Explain why, with reference to theory | Theory concept + application to context |
| **Bereken** | Show full calculation with steps | Formula → substitution → intermediate → answer + units |
| **Beoordeel** | Take a position with arguments for AND against | Position + argument pro + argument contra + conclusion |

---

## PART 2: EXERCISE CONTEXTS — WHERE QUESTIONS APPEAR

Questions appear in four distinct contexts within the platform, each with different rules for scope, scaffolding, and difficulty.

### 2.1 Theory paragraph exercises (econ-exercise-builder)

**Purpose:** Practice the skill introduced in one specific paragraph.
**Scope:** Single skill, single paragraph.
**Total time budget:** 40–60 minutes.

The exercise set follows a mandatory progression:

| Stage | Component | Time share | Scaffolding | Details |
|-------|-----------|------------|-------------|---------|
| 1 | Worked example | — | Full (Niveau 5) | Fully solved; same procedure as target, simpler context. Students read and study, not solve. |
| 2 | Startoefeningen (guided practice) | ~50% | Fading (5→0) | 4-stage dual coding fading sequence (see Part 3) |
| 3 | Independent practice | ~20% | None (Niveau 0) | 1–3 exercises at target difficulty, different contexts |
| 4 | Interleaving exercises | ~15% | None (Niveau 0) | 1–4 quick exercises (2–4 min each) from previous paragraphs |
| 5 | Target exercise (doeloefening) | ~15% | None (Niveau 0) | From blueprint, verbatim or lightly adapted; capstone |
| 6 | Verdiepingsopdracht (enrichment) | Outside budget | None | Open question at Bloom analyseren/evalueren/creeren; labeled "Denkertje" or "Bonusopgave" |

**Time adjustment by paragraph difficulty:**
- Light paragraph: shorter guided practice, more interleaving (3–4 exercises)
- Medium paragraph: balanced distribution
- Heavy paragraph: guided practice takes most of budget, interleaving reduced to 1–2

### 2.2 Consolidation exercises (econ-consolidation-builder)

**Purpose:** Combine multiple skills in exam-style opgaven after completing a chapter.
**Scope:** Multiple skills from across the chapter; each opgave weaves 2–5 skills.
**Format:** 1–2 opgaven, each with 4–6 sub-questions under one shared context.

**Core unit: the opgave**
One opgave = single constructed context + source material + 4–6 escalating questions.

| Position | Points | Bloom level | Typical question type |
|----------|--------|-------------|----------------------|
| Q1 | 1–2p | Begrijpen | Type 4 ("Is X een Y?") or simple Type 1 |
| Q2 | 2p | Toepassen | Type 2 ("Bereken") or Type 5 ("Teken") |
| Q3 | 2p | Toepassen/Analyseren | Multi-step Type 2 or Type 1 |
| Q4 | 2–3p | Analyseren | Type 3 ("Leg uit of") or Type 2 + interpret |
| Q5 | 2–4p | Analyseren | Type 6 ("Leg uit met behulp van") or complex calculation |
| Q6 | 2p | Evalueren | "Beoordeel of" / standpuntbepaling (verdieping) |

**Source material types:**
- Constructed context (100–250 words) — fictional but realistic, with precise embedded data
- Data table (3–8 rows x 2–5 columns)
- Function table (Qv, TK, etc.)
- Graph as source
- Flow diagram (multi-market analysis, policy chains)
- Pay-off matrix (oligopoly, prisoner's dilemma)

**Design rules:**
- Source material is constructed, never clipped from real sources
- Data is embedded in context — numbers appear in text or tables/graphs
- Each opgave is self-contained — all needed information is in the source
- One world per opgave — all questions reference the same context
- VWO language level with exact syllabus terminology

### 2.3 Test preparation exercises (econ-testprep-builder)

**Purpose:** Prepare for the chapter test through four escalating paragraph types.
**Scope:** Chapter 5 of each book; covers all four theory chapters.

| Paragraph | Type | Format | Key features |
|-----------|------|--------|-------------|
| 5.1 | Active Summary + MC | 5 summary blocks, 2–3 MC per block (10–15 total) | Retrieval practice; distractors from documented misconceptions |
| 5.2 | Exam Skills Training | 4–5 exercises, each targeting ONE specific exam skill | Answer-structuring vocabulary; model-vs-weak answer comparison |
| 5.3 | Integration Exercise | One coherent context, 5–7 sub-questions | Cross-chapter synthesis; all 4 theory chapters represented; final sub = standpuntbepaling |
| 5.4 | Timed Practice Test | 120-minute format, 6–8 questions across 3–4 contexts | Exam simulation; toetsmatrijs required |

### 2.4 Multiple choice questions (MC)

MC questions appear specifically in test preparation (5.1) and occasionally in consolidation. Design rules:

**Structure:**
- Stem: clear, unambiguous question
- 3–4 answer options (A/B/C or A/B/C/D)
- Exactly one correct answer
- Distractors are plausible and sourced from documented misconceptions

**Distractor design:**
- Each distractor maps to a specific, documented misconception
- Common distractor patterns:
  - Confusing movement along vs shift of a curve
  - Reversing cause and effect in a reasoning chain
  - Applying the wrong formula or wrong variable
  - Confusing related but distinct concepts (prijs vs. kosten, geld vs. inkomen)
- Never use "alle bovenstaande" or "geen van bovenstaande"
- Never use trick distractors — each wrong answer teaches something about the misconception

**Bloom distribution for MC:**
- Onthouden/Begrijpen: ~40% (MC is efficient for testing recall/understanding)
- Toepassen: ~40%
- Analyseren: ~20%
- MC is generally not suitable for Evalueren/Creeren

---

## PART 3: SCAFFOLDING & FADING SYSTEMS

### 3.1 Scaffolding levels (0–5)

| Level | Name | What student gets | When to use |
|-------|------|------------------|-------------|
| 0 | Geen scaffolding | Only the question | Standard exercise set, independent practice |
| 1 | Lichte hint | One sentence giving direction | Student knows concept but can't find entry point |
| 2 | Denkstappen | Numbered steps as guide | Student knows material but can't structure approach |
| 3 | Formule-herinnering | Relevant formulas with variable definitions | Student forgets which formula to use |
| 4 | Invulformaat | Partially filled answer template | Student knows steps but makes execution errors |
| 5 | Volledig uitgewerkt | Complete answer + explanation why | Reference, self-study, resit preparation |

### 3.2 Backward fading strategy (Renkl & Atkinson, 2003)

Scaffolding must fade across exercises — never maintain the same level throughout.

| Exercise position | Scaffolding level | What student receives |
|-------------------|-------------------|----------------------|
| Exercise 1–2 | Full (Niveau 3–4) | Denkstappen + formules + hints + invulformaat |
| Exercise 3–4 | Reduced (Niveau 1–2) | Hints + formulekaart only, no denkstappen |
| Exercise 5–6 | Minimal (Niveau 1) | Only a short hint |
| Exercise 7–8 | None (Niveau 0) | Independent — no support |

**Fading signal:** If exercise N has the same skill as exercise N-1 but a different context, it's time to remove denkstappen.

### 3.3 Scaffold decision tree

```
Question type = calculation?
  +-- Yes --> formule-herinnering + invulformaat + denkstappen
  +-- No -->
      Question type = reasoning/explanation?
        +-- Yes --> denkstappen + hint
        +-- No -->
            Question type = graph drawing?
              +-- Yes --> denkstappen (tekenplan) + example coordinates
              +-- No -->
                  Question type = concept/definition?
                    +-- Yes --> hint (reference to concept)
                    +-- No --> no scaffold needed
```

### 3.4 Four-stage dual coding fading (mandatory for graph exercises)

This is the **mandatory visual progression** for all graph-based exercises in theory paragraphs:

| Stage | Exercise | What student gets | What student does |
|-------|----------|------------------|-------------------|
| 1 | Startoefening 1 | Graph WITH change drawn AND labeled | Reads, identifies, classifies, explains |
| 2 | Startoefening 2 | Graph base only (axes + initial line) | Draws the change themselves |
| 3 | Startoefening 3 | No graph | Reasons in text/words only |
| 4 | Independent practice | No graph | Draws own graph from scratch as solution |

**Why Stage 1 is non-negotiable:** Without it, the first exercise asks students to *produce* before they have *recognized*. Stage 1 lets them verify their reading of visual conventions before applying them.

### 3.5 Classification table headers (mandatory)

When an exercise involves multi-row classification, column headers naming the response format are mandatory:

Wrong:
```
| | Situatie |
```

Right:
```
| | Situatie | Beweging of verschuiving? | Richting | Vraagfactor |
```

Headers scaffold response format without giving answers. The task becomes pure analysis, not format invention.

---

## PART 4: BLOOM'S TAXONOMY FOR ECONOMICS

### 4.1 Six levels with economics examples

| Bloom level | Economics example | Signal words | Suitable for |
|-------------|------------------|-------------|--------------|
| Onthouden (Remember) | "Noem de vier marktvormen" | Noem, som op, geef definitie | All levels |
| Begrijpen (Understand) | "Leg uit waarom MO = MK winst maximaliseert" | Leg uit, beschrijf, geef aan waarom | All levels |
| Toepassen (Apply) | "Bereken de evenwichtsprijs" | Bereken, teken, leid af | All levels |
| Analyseren (Analyze) | "Vergelijk welvaart voor en na belasting" | Vergelijk, analyseer, onderscheid | Standard + enrichment |
| Evalueren (Evaluate) | "Beoordeel of prijsdiscriminatie welvaart verhoogt" | Beoordeel, beredeneer of | Enrichment |
| Creeren (Create) | "Stel een beleidsmaatregel voor" | Bedenk, ontwerp, stel voor | Enrichment |

### 4.2 Target distributions

**Within a paragraph exercise set:**
- Onthouden/Begrijpen: ~25%
- Toepassen: ~40%
- Analyseren/Evalueren: ~35%

**Within a consolidation opgave:**
Progression from Q1 to Q6 maps to ascending Bloom levels (see Part 2.2).

**Within a chapter:**
Progression across paragraphs: define → calculate → explain → analyze → evaluate → create.

### 4.3 Bloom progression across the spiral curriculum

Each concept revisit should advance one or two Bloom levels:
- First encounter: Onthouden/Begrijpen
- Second encounter: Toepassen
- Third encounter: Analyseren
- Later encounters: Evalueren/Creeren

---

## PART 5: POINT ALLOCATION & SCORING

### 5.1 Point standards

| Points | Cognitive demand | Example |
|--------|-----------------|---------|
| 1p | One action: name, shade, classify, identify | "Noem het type markt" |
| 2p | Two causal links OR two calculation steps | "Leg uit dat de prijs stijgt" (2 schakels) |
| 3p | Multi-step calculation + interpretation | "Bereken de winst en leg uit of..." |
| 4p | Complex multi-step (4+ steps) | Extended calculation with data extraction |

### 5.2 Target distribution across an exercise set

| Points | Share of questions |
|--------|-------------------|
| 1p | ~5% |
| 2p | ~70% |
| 3p | ~10% |
| 4p | ~15% |

### 5.3 Scoring rules for "Leg uit dat..." (2p)

Award 1 point per correct causal link (schakel). Both links must be present for full marks. The conclusion itself does not earn points — it was given in the question.

### 5.4 Scoring rules for "Bereken..." (2–4p)

- 1p for correct formula identification and substitution
- 1p per correct intermediate step
- Final point for correct answer with units
- Rounding errors: accept if stated rounding rule is followed consistently

---

## PART 6: ANSWER MODEL SPECIFICATIONS

### 6.1 Universal structure

```markdown
**Stap 1:** [description of what to do]
[calculation or reasoning]

**Stap 2:** [description]
[calculation or reasoning]

**Antwoord:** [final answer with units]

*Waarom:* [1-2 sentences explaining why this makes economic sense]
```

### 6.2 Mandatory rules

1. **Unified procedures** — Answer model follows the exact same steps as the worked example: same order, same notation. No shortcuts, alternative methods, or reordering.
2. **Show substitution** — Never jump from formula to answer. Always show: formula → substitution → intermediate → final.
3. **Always include units** — Every numerical answer has units (euro, %, stuks, eenheden).
4. **Always include "Waarom"** — Explains why the answer makes economic sense, not just what the answer is.
5. **Concept precision** — Pick the most economically specific category for cause:
   - Wrong: "Fietsen wordt aantrekkelijker" → "voorkeuren veranderen"
   - Right: "Benzineprijzen stijgen" → "auto's (substituut) worden duurder" → "prijs van substituut verandert"
6. **Rounding rule** — State once at the top; apply consistently throughout.
7. **Graph answers** — Include reference to solution image in `_assets/`.
8. **Source referencing** (consolidation only) — "Uit de tabel lezen we af dat..."

### 6.3 "Leg uit dat..." chain structure (2p)

```
Als [gegeven] (gegeven),
[schakel 1 → intermediate effect].
Daardoor [schakel 2 → further effect].
Zo [concludes to given conclusion] (conclusie = gegeven).
```

### 6.4 Verdieping answer model

No step-by-step procedure. Instead:
- **Model answer** — one strong example response
- **Beoordelingscriteria** — 2–4 bullet points stating what good answers include

---

## PART 7: DIFFERENTIATION SPECTRUM

### 7.1 Three levels (without visible labels to students)

```
Extra ondersteuning  <----------  Standaard  ---------->  Extra uitdaging

  Begeleide                Reguliere               Verdieping &
  inoefening               opgavenset              verbreding
```

### 7.2 Design rules per level

**Extra ondersteuning (begeleide inoefening):**
- Denkstappen, hints, formuleherinneringen, invulformaten
- Extended answer models with "waarom" explanations
- Scaffolding MUST fade across exercises (see Part 3.2)
- Mandatory for graph exercises: visual scaffolding (scaffoldImage) showing base graphs

**Standaard (regular exercises):**
- No extra steps, hints, or scaffolding
- Standard answer model sufficient
- Base product every student completes

**Extra uitdaging (verdieping):**
- Open questions requiring evaluation or creation
- Model extension or criticism
- Transfer to unknown context
- NO hints, formulekaarten, or steps — these slow thinking
- Labeled "Denkertje" or "Bonusopgave"

### 7.3 What real verdieping IS and IS NOT

| Is verdieping | Is NOT verdieping |
|---------------|-------------------|
| Model criticism ("Wanneer klopt MO = MK niet?") | More calculation work (longer numbers) |
| Transfer to new market/context | More sub-questions over same skill |
| Policy proposal with justification | Same skill at same Bloom level, just harder numbers |
| Comparison of two models | Additional scaffolded exercises |
| Own context creation | Repetition in different words |

---

## PART 8: INTERLEAVING EXERCISE DESIGN

### 8.1 Allocation rule: 60/25/15

| Content source | Share |
|----------------|-------|
| Current-chapter content | ~60% |
| Problems from 2–3 previous chapters | ~25% |
| Earlier material | ~15% |

### 8.2 Skill selection priority

**Priority 1 — Direct prerequisites:** Skills the current paragraph builds on (e.g., if current is consumer surplus, interleave with equilibrium solving).

**Priority 2 — Fundamental skills under regular repetition:**
- Percentage calculations and percentage changes
- Graph reading (aflezen, interpoleren)
- Index number calculations
- Shift vs. movement distinction
- Basic cost calculations (TK, GTK)

**Priority 3 — Recent skills at risk of decay:** Skills from the previous chapter not practised since.

### 8.3 Design rules

- Keep exercises **short** (2–4 min each)
- Use **different context** from original paragraph
- Do **not** add scaffolding — these are revision, not new learning
- Signal gaps: "Kun je deze opgave niet maken? Herhaal dan §X.Y.Z."

---

## PART 9: MISCONCEPTION HANDLING IN EXERCISES

### 9.1 Three required strategies

1. **Predict-Observe-Explain** — Present scenario, let student predict, reveal outcome
2. **Explicit comparison** — Misconception and correct conception side by side
3. **Data-driven exercises** — Confront students with evidence contradicting assumptions

### 9.2 Combined-change misconception exercise (mandatory)

For paragraphs teaching key distinctions (shift vs. movement, complement vs. substitute, real vs. nominal, normal vs. inferior good), include at least one exercise where two things change simultaneously, each on a different side of the distinction.

**Pattern:**
```markdown
**Opgave N** *(twee veranderingen tegelijk — let goed op!)*

Op de [market] gebeuren twee dingen op dezelfde dag:
1. [Change A — affects own price]
2. [Change B — affects non-price factor]

a) Alleen verandering 1. Wat gebeurt er? Beweging of verschuiving? Welke richting?
b) Alleen verandering 2. Wat gebeurt er? Beweging of verschuiving? Welke richting?
c) Beide tegelijkertijd. Beschrijf netto-effect. Versterken of tegen elkaar in?
d) Een leerling zegt: "[plausible wrong reading]". Waarom niet?
```

Sub-question (d) is the misconception-confrontation lever. Placement: last starter exercise or first independent exercise.

### 9.3 Misconception warning box format

Placed immediately after the concept triggering the misconception. Max 3–4 lines.

```markdown
> **Let op — veelgemaakte fout**
> Veel leerlingen verwarren een *verschuiving van* de vraaglijn
> met een *beweging langs* de vraaglijn.
> Een prijsverandering van het goed zelf = beweging LANGS de lijn.
> Een verandering van inkomen, voorkeuren of andere factoren = verschuiving VAN de lijn.
```

### 9.4 Threshold concepts (deserve repeated attention)

- Prijs vs. kosten
- Geld vs. inkomen
- Reeel vs. nominaal
- Besparingen vs. investering
- Verschuiving VAN vs. LANGS de lijn (most common)
- Absoluut vs. comparatief voordeel

---

## PART 10: TEST DESIGN

### 10.1 Toetsmatrijs template

Required for all practice tests and timed tests (5.4); optional for consolidation.

| Leerdoel | Bloom | Opgave | Vraag | Punten |
|----------|-------|--------|-------|--------|
| [skill] | [level] | [context #] | [question #] | [points] |
| ... | ... | ... | ... | ... |
| **Totaal** | | | | **XX** |

**Bloom distribution targets:**
- Onthouden/Begrijpen: ~25% of points
- Toepassen: ~40% of points
- Analyseren/Evalueren: ~35% of points

### 10.2 Test vs. consolidation comparison

| Aspect | Consolidation paragraph | Practice test |
|--------|------------------------|---------------|
| Toetsmatrijs | Optional | Required |
| Point allocation per sub-question | Optional | Required |
| Number of opgaven | 1–2 | 2–4 |
| Time | ~50–60 min | 45 or 120 min strict |
| Scope | One chapter | Multiple chapters (120 min) |
| Cross-chapter opgave | Not required | Required for 120-min tests |

---

## PART 11: QUALITY CHECKLIST FOR EXERCISES

### 11.1 Common exercise design errors (ranked by frequency)

**High frequency:**
1. All exercises at the same Bloom level (no progression)
2. Graph numbers don't match text numbers
3. Scaffolding doesn't fade — same level throughout
4. Interleaving exercises missing entirely
5. Worked example placed after summary instead of before exercises

**Medium frequency:**
6. Misconception stated in theory but not confronted in exercises
7. Inconsistent variable naming between exercises
8. Answer model uses different steps than worked example
9. No "waarom" explanation in answer model
10. Classification exercises missing column headers

### 11.2 Review protocol: three passes

| Pass | Focus | Gate |
|------|-------|------|
| Pass 0 | Asset and file integrity | Any FAIL → STOP |
| Pass 1 | Didactic architecture (fading, progression, scaffolding) | FAILs must be fixed |
| Pass 2 | Mathematical/conceptual precision | FAILs must be fixed |

Reviews must be run by an independent agent, not by the builder.

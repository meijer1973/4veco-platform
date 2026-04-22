---
name: econ-testprep-builder
description: "Builds test preparation paragraphs for economics education (bovenbouw vwo): active summaries with MC questions, exam skills training, integration exercises, and timed practice tests. Each book's Chapter 5 contains these four paragraph types in a scaffolded progression from retrieval practice to exam simulation. No new theory is introduced. Use this skill when the user mentions toetsvoorbereiding, test preparation, actieve samenvatting, examenvaardigheden, integratieoefening, proeftoets, or when building Chapter 5 of any book. Always use in combination with econ-didactiek (pedagogy), economic-graph (graphs), and econ-pdf-builder (PDF export)."
---

# Economics Test Preparation Builder

Builds all four paragraph types for Chapter 5 (test preparation) of each book. These paragraphs introduce **no new theory** — they scaffold exam readiness through a deliberate progression: retrieval practice (§1) → skill training (§2) → integration (§3) → exam simulation (§4).

**Companion skills:**
- `econ-didactiek` → pedagogical decision rules (backed by `references/authored/didactiek-principes.md`)
- `economic-graph` → SVG/PNG graphs (called during build)
- `econ-pdf-builder` → PDF export pipeline
- `econ-quality-control` → quality_ref generation after build

**Reference standards:**
- `references/authored/economic_mathematical_precision_reference.md` → precision rules (takes precedence)
- `references/authored/economie-terminologie.md` → canonical Dutch terms
- `references/external/amstelveencollege_quality_standards.md` → school-fit overlay
- `knowledge/course_blueprint_v4.md` → Chapter 5 specs per book

---

## PART 1: OVERVIEW AND INPUT

### 1.1 What is a test preparation chapter?

Chapter 5 of each book. Four paragraphs, no new theory, scaffolded exam readiness:

| § | Type | Purpose | Metaphor |
|---|------|---------|----------|
| §1 | Active summary + MC | "Do I know the pieces?" | Retrieval practice |
| §2 | Exam skills training | "Can I answer correctly?" | Skill sharpening |
| §3 | Integration exercise | "Can I combine them?" | Cross-chapter synthesis |
| §4 | Timed practice test | "Can I do it under pressure?" | Exam simulation |

**§1 must come first** — knowledge gaps caught there prevent integration failures in §3.

### 1.2 Required input

1. **Blueprint Chapter 5 spec** — from `knowledge/course_blueprint_v4.md`: summary block topics, MC examples, exam skill emphasis, integration context, test constraints
2. **All theory chapter content** — summaries of Chapters 1–4 theory paragraphs (needed for §1 summary blocks and §3 integration)
3. **Prior paragraph context** — from `_chapter-plan.md` (shared notation, conventions)

### 1.3 Book-specific emphasis

| Book | §1 focus | §2 focus | §3 scope | §4 cumulative |
|------|----------|----------|----------|---------------|
| 1 | Graph conventions, % traps, shift/movement | Graph reading, calculation notation | Book 1 only | Book 1 only |
| 2 | Elasticity interpretation, surplus accounting | Standpuntbepaling answer structure | Book 2 only | Book 2 only |
| 3 | Multi-step monopoly procedure, market structures | Multi-step calculations, monopoly graph reading | Book 3 only | Book 3 only |
| 4 | Labor terminology, comparative advantage, index/% | Real data, cumulative reasoning | **Cross-book** (Books 1–4) | **Cross-book** (Books 1–4) |

### 1.4 Shared rules

- **No new theory.** Every concept must come from Chapters 1–4.
- **Dual coding applies.** Summary blocks (§1) include at least one graph per block. Exercises (§2–§4) include source graphs where relevant.
- **Misconception-driven design.** MC distractors (§1) and skill exercises (§2) target documented student errors, not randomly wrong alternatives.
- **VWO terminology.** All student-facing content uses terms from `references/authored/economie-terminologie.md`.

---

## PART 2: §1 — ACTIVE SUMMARY WITH MC QUESTIONS

### 2.1 Structure

Five summary blocks, one per major topic area of the book. Each block:
1. **Summary text** (4–6 sentences) — concise review of the key concepts
2. **2–3 multiple-choice questions** — interleaved immediately after the summary text

Total: 5 blocks × 2–3 MC = 10–15 MC questions per paragraph.

### 2.2 Summary block design

- **Identify 5 topic clusters** from the book's theory chapters. Use the blueprint's block specifications.
- Each block summarises ONE cluster in 4–6 sentences.
- Include at least one graph reference per block (e.g., "Figuur 1 toont de vraaglijn en de aanbodlijn in evenwicht").
- Use active language: "Je berekent..." not "Men kan berekenen..."
- End each block with a forward pointer to the MC questions: no transition needed — questions follow directly.

### 2.3 MC question design

**Stem:** Mini-scenario that requires applying a concept, not recalling a definition.

**Options:** Exactly 4 options (A–D). One correct, three distractors.

**Distractor rules:**
- Each distractor must represent a **real student misconception**. Source these from:
  - `source-data/module-{N}/reasoning/*.csv` → `distractor_*_label` and `distractor_*_detail` columns
  - Blueprint difficulty notes (e.g., "The shift vs movement distinction is the single most common error")
  - `references/authored/didactiek-principes.md` → documented misconception patterns
- If `source-data` has no CSV for this topic, use the blueprint's difficulty notes and the misconception warnings from theory paragraphs.
- **Never use obviously wrong alternatives** ("the answer is 42", "none of the above").
- Mark the "trap" answer (most tempting wrong option) in the answer explanation.

**Answer explanation format:**
```markdown
*(Correct: B. TO = 40Q − 2Q², so MO = 40 − 4Q. Option A is the confusion
with perfect competition where MO = P. This is a common error — see §2.2
misconception warning.)*
```

### 2.4 File output

| File | Contents |
|------|----------|
| `X.5.1 Actieve samenvatting – samenvatting.md` | 5 summary blocks with interleaved MC questions |
| `X.5.1 Actieve samenvatting – antwoorden.md` | MC answer key with explanations per question |
| `_assets/X.5.1_fig_*.svg` + `.png` | Graphs referenced in summary blocks |
| `_assets/X.5.1_mc_*.svg` + `.png` | Graphs used in MC questions (if any) |
| `build_pdf.py` | PDF build script |

### 2.5 Template

```markdown
# §X.5.1 Actieve samenvatting

## Blok 1: [Topic cluster name]

[4–6 sentence summary. Reference at least one graph.]

![Figuur 1: beschrijvende titel](_assets/X.5.1_fig_1.png)

**Vraag 1**

> [Scenario-based MC stem]

**(A)** [Option — correct or distractor]

**(B)** [Option]

**(C)** [Option]

**(D)** [Option]

**Vraag 2**
> [...]

---

## Blok 2: [Topic cluster name]

[...]
```

**CRITICAL: MC option formatting.** Options MUST use `**(A)**` as bold text OUTSIDE the blockquote, not `(A)` inside the blockquote. Pandoc converts bare `(A)` inside blockquotes into numbered lists (1, 2, 3, 4), stripping the ABCD labels. The stem goes in a blockquote; each option is a separate paragraph with bold letter prefix.

---

## PART 3: §2 — EXAM SKILLS TRAINING

### 3.1 Structure

5 exercises, each targeting ONE specific exam skill. Total: **12–18 questions** with **continued numbering** across all exercises (like consolidation/proeftoets). This ensures nearly all key skills from all theory chapters are practised.

**Layout rules (same as consolidation/proeftoets):**
- Sub-questions use continued numbering: `**1** *(2p)*`, `**2** *(3p)*`, ... across all exercises
- No horizontal rules (`---`) between sub-questions within an exercise
- Horizontal rules only between exercises (after context, before first question of next exercise)
- Each question shows points in compact format: `*(2p)*`

**Coverage requirement:** Before writing, list all key skills from all theory chapters. Select the 12–18 most important exam-relevant skills. Map each to a question. Every theory chapter must be represented.

### 3.2 Exam skills taxonomy

| Skill | What students practise | Typical exercise format |
|-------|----------------------|----------------------|
| Graph reading | Extract values from unlabelled or complex graphs | "Given this graph, identify..." |
| Data extraction | Select relevant numbers from tables | "From this CBS table, calculate..." |
| Answer structuring | Write answers in correct format (noem/leg uit/verklaar/bereken/beoordeel) | "Write a full 'verklaar' answer" |
| Answer evaluation | Judge quality of model vs weak answers | "Which answer earns more marks? Why?" |
| Critical reading | Evaluate claims in media/text sources | "A journalist writes... Is this correct?" |
| Multi-step calculation | Execute procedures without skipping steps | "Show all steps of the calculation" |

### 3.3 Answer-structuring vocabulary

Each answer type requires a different structure. Students must know the difference:

| Instruction | Required answer structure | Points |
|-------------|-------------------------|--------|
| **Noem** | Name/list. No explanation needed. | 1p per item |
| **Leg uit** | Causal chain: gegeven → schakel 1 → schakel 2 → conclusie | 2p = 2 schakels |
| **Verklaar** | Like "leg uit" but must include economic mechanism (not just description) | 2-3p |
| **Bereken** | Show formula → substitution → calculation → answer with unit | 1p per step |
| **Beoordeel** | State claim → arguments for → arguments against → conclude with data | 3-4p |
| **Teken/Arceer** | Draw/shade on graph with correct labels and direction | 1-2p |

### 3.4 Book-specific emphasis

Each book focuses on different skills. The builder must check that the emphasis matches.

- **Book 1:** Graph conventions (which axis is which?), calculation notation (show steps), shift vs movement distinction
- **Book 2:** Standpuntbepaling (beoordeel) answer structure, surplus accounting identity (old TS = new CS + PS + revenue + DWL), policy graph reading
- **Book 3:** Multi-step monopoly procedure (6 steps from memory), reading complex monopoly graphs, structuring multi-step bereken answers
- **Book 4:** Working with real CBS/EU data, critical reading of media economic claims, cross-chapter standpuntbepaling

### 3.5 Exercise format

Each exercise starts with a clear skill label. Sub-questions use **continued numbering** across all exercises (not a/b/c/d, not restarting per exercise):

```markdown
## Oefening 1 — Vaardigheid: een ongelabelde grafiek lezen

[Source material: graph without labels]

> **Vaardigheidstip:** [Short tip about the exam skill]

**1** *(2p)* Welke lijn is de vraaglijn? Welke is de aanbodlijn? Leg uit hoe je dat kunt zien.

**2** *(1p)* Lees de evenwichtsprijs en -hoeveelheid af.

**3** *(2p)* Geef de juiste labels voor de assen. Welke conventie geldt in de economie?

---

## Oefening 2 — Vaardigheid: gegevens uit een tabel halen

[Source material: cost table]

**4** *(2p)* Bereken de GTK bij Q = 100 en Q = 200.

**5** *(2p)* Leg uit waarom GTK daalt. Gebruik het begrip spreidingseffect.
```

Note: numbering continues from exercise to exercise (4, 5, ... not restarting at 1). No `---` between sub-questions within an exercise.

### 3.6 Model answer + weak answer pattern

At least one exercise per §2 paragraph includes a comparison between a full-marks answer and a weaker answer:

```markdown
**Oefening 3 — Vaardigheid: een 'bereken'-antwoord structureren**

[Question and context]

**Antwoord A (leerling 1):**
> "De winst is EUR500."

**Antwoord B (leerling 2):**
> "TO = P × Q = 10 × 100 = EUR1000
> TK = 0,5 × 100 + 200 = EUR250 + EUR200 = EUR450  ← fout: TK = 0,5Q² + 200
> Winst = TO − TK = 1000 − 450 = EUR550"

(a) Welk antwoord scoort meer punten? Waarom?
(b) Welke fout maakt leerling 2?
(c) Schrijf zelf het correcte antwoord met alle stappen.
```

### 3.7 File output

| File | Contents |
|------|----------|
| `X.5.2 Examenvaardigheden – opgaven.md` | 4–5 skill exercises with source material |
| `X.5.2 Examenvaardigheden – antwoorden.md` | Model answers per exercise |
| `_assets/X.5.2_fig_*.svg` + `.png` | Source graphs |
| `_assets/X.5.2_ex_*.svg` + `.png` | Exercise graphs |
| `build_pdf.py` | PDF build script |

---

## PART 4: §3 — INTEGRATION EXERCISE

### 4.1 Context design

**One coherent multi-part context** — NOT multiple short contexts. One market, one company, one policy situation that naturally invites skills from all four theory chapters.

Design process:
1. **Choose a realistic scenario first** (a company, a policy debate, a market situation)
2. **Then map each chapter's key skill** to a sub-question within that scenario
3. **Do NOT start by listing skills** and then finding a context — that produces forced, artificial exercises

### 4.2 Sub-question design

5–7 sub-questions. Each draws on a different chapter's skill:

```markdown
> (a) Bereken... *(Hoofdstuk 1 vaardigheid: kostenberekening)*
> (b) Teken... *(Hoofdstuk 2 vaardigheid: evenwicht in grafiek)*
> (c) Bereken... *(Hoofdstuk 3 vaardigheid: welvaartsverlies)*
> (d) Leg uit... *(Hoofdstuk 4 vaardigheid: extern effect)*
> (e) Beoordeel... *(Integratie: standpuntbepaling)*
```

Rules:
- **Label each sub-question** with the chapter skill it requires. This transparency helps students see cross-chapter connections.
- **Final sub-question is always standpuntbepaling** that synthesises earlier sub-questions.
- **Questions are theory-paragraph style** — clean, focused. Not exam-complex with extensive source material. The integration comes from combining skills within one context, not from complex packaging.

### 4.3 Book 4 special rule

Book 4's integration exercise is **cross-book**: it must require at least one skill from Books 1–3 in addition to Book 4 skills. The blueprint provides specific examples (e.g., the EU textile tariff context requires labor market equilibrium + trade analysis + welfare effects + real/nominal calculations).

### 4.4 File output

| File | Contents |
|------|----------|
| `X.5.3 Integratieoefening – opgaven.md` | One context with 5–7 labelled sub-questions |
| `X.5.3 Integratieoefening – antwoorden.md` | Full answer model per sub-question |
| `_assets/X.5.3_fig_*.svg` + `.png` | Source graphs/diagrams |
| `_assets/X.5.3_ex_*.svg` + `.png` | Answer graphs |
| `build_pdf.py` | PDF build script |

---

## PART 5: §4 — TIMED PRACTICE TEST

This paragraph produces a complete practice test in the exact format of the 120-minute end-of-book test. It uses the **gemengde opgaven** format — exam-style exercises with source material, multiple skills per context, and formal point allocation.

### 5.0 Non-negotiable layout rules for tests

Tests must be rendered so students see each opgave's context and questions together without flipping pages, and no question is ever split across pages. See `econ-pdf-builder` §4.1, §4.1b, §5 and §5.3:

1. **Render with WeasyPrint**, never Chrome headless. Chrome doesn't honor `break-inside: avoid` on block elements, causing questions to split across pages.
2. **Atomic exercises**: `.exercise { break-inside: avoid; page-break-inside: avoid; }`. A question that doesn't fit in the remaining space must jump to the next page whole.
3. **Opgave intro wrapping**: wrap h2 + context + table/figure + first `<hr />` in `<div class="opgave-intro">`. CSS then forces each opgave onto a fresh page and glues the first question to the intro.
4. **Length estimation**: run `build-scripts/estimate_test_length.py` via a subagent to confirm the scheduled time matches actual student work time. Don't eyeball.
5. **No bonus questions**: if a question is worth asking, give it regular points. Bonus labeling creates a mismatch between scheduled length and actual work, and causes students to strategize out of questions.

### 5.1 Opgave structure

### 5.1 Opgave structure

Each opgave follows the exam format:
- **One context** (100–250 words) — constructed (not clipped from news), realistic, with precise embedded data
- **One or more source types** — data table, function table, graph as source, flow diagram, pay-off matrix, formula with context
- **4–6 escalating questions** weaving 2–5 skills together
- **Source design rules:**
  - Data embedded in context text or tables. Students extract relevant numbers.
  - Self-contained: source contains all needed information.
  - One world per opgave: all questions reference the same context.
  - VWO-level language. Economic terminology from `references/authored/economie-terminologie.md`.

### 5.2 Question design taxonomy

Based on VWO exam analysis. Use these types in the target frequencies:

| Type | Frequency | Design rule |
|------|-----------|------------|
| **"Leg uit dat..."** | ~35% | Student gets conclusion, builds reasoning chain. 2p = 2 causal links. |
| **"Bereken..."** | ~20% | Never pure formula. Student must: identify formula, extract data from source, take multiple steps. |
| **"Leg uit of..."** | ~10% | Student first determines direction (stijgt/daalt), then explains. |
| **"Is X een Y? Motiveer."** | ~10% | Apply definition to context. Good opener (Q1 position). |
| **"Teken / Arceer..."** | ~7% | Draw curves on provided graph (~1 cm shift) or shade areas (surplus, vaste kosten, welvaartsverlies). |
| **"Leg uit met behulp van [bron]..."** | ~10% | Forces explicit source material use. Combines calculation with explanation. |
| **"Noem..."** | ~5% | Simple recall/identification. 1p. Use sparingly. |

### 5.3 Question progression per opgave

| Position | Points | Bloom level | Typical type |
|----------|--------|-------------|-------------|
| Q1 | 1–2p | Begrijpen | "Is X een Y?" / simple "leg uit dat" |
| Q2 | 2p | Toepassen | "Bereken" / "Teken" |
| Q3 | 2p | Toepassen/Analyseren | Multi-step "bereken" / "leg uit dat" |
| Q4 | 2–3p | Analyseren | "Leg uit of" / "bereken + interpreteer" |
| Q5 | 2–4p | Analyseren | "Leg uit met behulp van" / complex calculation |
| Q6 | 2p | Evalueren | "Beoordeel of" / "Stel voor" |

**Point standards:**
- 1p = one action (name, shade, classify)
- 2p = two causal links or two calculation steps
- 3p = multi-step + interpretation
- 4p = complex multi-step (4+ steps)
- **~80% of questions are 2p**

### 5.4 Answer models

All answers must follow these structures:

**Source referencing in answers:**
```markdown
**Stap 1:** Uit de tabel (Bron 1) lezen we af dat de prijs in 2024
EUR1,05 was en in 2025 EUR1,20.

**Stap 2:** Procentuele verandering = (1,20 − 1,05) / 1,05 × 100 = 14,3%
```

**"Leg uit dat..." chain structure:**
```markdown
**Antwoord (2 punten):**
Als het eigen risico vervalt (gegeven),
gaan mensen eerder naar de huisarts (schakel 1).
Daardoor worden ziektes eerder ontdekt,
wat duurdere behandelingen voorkomt (schakel 2).
Zo kunnen de totale zorgkosten afnemen (conclusie = gegeven).
```

**Point allocation required** per sub-question:
```markdown
**Opgave 2a** (4 punten)
- Correcte formule/aanpak (1 pt)
- Correcte substitutie met getallen uit bron (1 pt)
- Correct antwoord met eenheid (1 pt)
- Economische interpretatie (1 pt)
```

### 5.5 Target distributions

| Points | Target | Bloom level | Target |
|--------|--------|-------------|--------|
| 1p | ~5% | Onthouden/Begrijpen | ~25% |
| 2p | ~70% | Toepassen | ~40% |
| 3p | ~10% | Analyseren/Evalueren | ~35% |
| 4p | ~15% | | |

### 5.6 Test-specific constraints

- **120-minute format**, 6–8 open questions across 3–4 contexts (=opgaven)
- **Toetsmatrijs required** — create BEFORE designing opgaven. Maps: skills × Bloom level × points. Every leerdoel from Chapters 1–4 must be covered.
- **Content coverage:** all four theory chapters represented
- **Source type requirements:** at least one context with a graph, one with a data table, one with a longer text source
- **Book 4 cumulative requirement** (non-negotiable): at least one context must require tools from Books 1–3 (equilibrium calculation, surplus analysis, elasticity, etc.)
- **Cumulative cross-chapter sources** are encouraged: e.g., rising energy prices → percentage change (B1C1) → supply shift (B1C3) → new equilibrium (B1C4) → welfare loss from tax (B2C3) → evaluate policy (evalueren)

### 5.7 Graph modes

| Mode | What students do | Graph provided? |
|------|-----------------|----------------|
| Read | Extract values from complete graph | Yes — complete |
| Identify | Name shaded area / intersection | Yes — with shading/labels |
| Modify | Add curves, shade areas, mark points | Yes — base graph only |
| Trace | Follow causal arrows in flow diagram | Yes — flow diagram |

**Never ask students to draw a complete graph from scratch** in test exercises. That belongs in theory paragraph exercises.

### 5.8 File output

| File | Contents |
|------|----------|
| `X.5.4 Proeftoets – toets.md` | All opgaven with source material |
| `X.5.4 Proeftoets – antwoorden.md` | Answer models with point allocation per sub-question |
| `X.5.4 Proeftoets – toetsmatrijs.md` | Skill × Bloom × points matrix |
| `_assets/X.5.4_fig_*.svg` + `.png` | Source graphs/diagrams |
| `_assets/X.5.4_ex_*.svg` + `.png` | Answer graphs |
| `build_pdf.py` | PDF build script |

### 5.9 Toetsmatrijs template

```markdown
# Toetsmatrijs — Book X Practice Test

| Leerdoel | Bloom | Opgave | Vraag | Punten |
|----------|-------|--------|-------|--------|
| Bereken evenwichtsprijs | Toepassen | 1 | a | 2 |
| Leg uit: shift vs movement | Analyseren | 1 | c | 2 |
| ... | ... | ... | ... | ... |
| **Totaal** | | | | **XX** |

**Bloomverdeling:**
- Onthouden/Begrijpen: X punten (Y%)
- Toepassen: X punten (Y%)
- Analyseren/Evalueren: X punten (Y%)
```

---

## PART 6: MISCONCEPTION SOURCING

### 6.1 Primary source: reasoning CSV files

Location: `source-data/module-{N}/reasoning/*.csv` (semicolon-delimited)

Relevant columns:
- `distractor_1_label`, `distractor_1_detail`, `distractor_1_formula` — first common misconception
- `distractor_2_label`, `distractor_2_detail`, `distractor_2_formula` — second common misconception
- `distractor_3_label`, `distractor_3_detail`, `distractor_3_formula` — third common misconception
- `error_step_index` — where in the procedure the error occurs
- `error_wrong_label`, `error_wrong_detail` — what the wrong reasoning looks like

### 6.2 How to use for §1 (MC distractors)

1. Identify which CSV files cover the topic area of each summary block
2. Extract `distractor_*_label` values — these become MC wrong options
3. The `distractor_*_detail` explains WHY students make this error — use this for the answer explanation

Example mapping:
- CSV distractor: `"Verwarring shift en verschuiving langs"` → MC option: "(A) Yes, because consumers buy less butter when the price rises."
- CSV detail: `"Studenten verwarren een prijsverandering met een verschuiving van de vraaglijn"` → Answer explanation: "Option A is the classic shift/movement confusion."

### 6.3 How to use for §2 (skill exercises)

1. Use `error_step_index` to identify WHERE in procedures students go wrong
2. Design exercises that specifically target that step
3. The "weak answer" in model-vs-weak comparisons should reproduce the error from the CSV

### 6.4 Fallback when no CSV exists

If `source-data` has no reasoning CSV for a topic:
- Use the blueprint's **difficulty notes** (these explicitly document common errors)
- Use **misconception warnings** (marked with warning callout) from the theory paragraphs
- Use `references/authored/didactiek-principes.md` documented misconception patterns

---

## PART 7: GRAPH AND ASSET USAGE

### 7.1 Asset types for test preparation

| Type code | Purpose | Used in |
|-----------|---------|---------|
| `fig` | Source graphs shown to students | §1 summary, §2–§4 source material |
| `ex` | Exercise-specific graphs | §2–§4 exercises |
| `mc` | MC question diagrams | §1 MC questions |
| `we` | Worked example / answer graphs | Answer models (antwoorden.md) |

**Naming convention:** `X.5.Z_{type}_{number}.svg` and `.png` (matching pairs required).

Example: `1.5.1_fig_1.svg`, `1.5.1_mc_3.png`, `1.5.4_ex_2.svg`

### 7.2 Dual coding in test preparation

- **§1 summary blocks:** Each block includes at least one graph reference. Students see the key graph alongside the summary text.
- **§2 exam skills:** Exercises that involve graph reading must include the graph as source material.
- **§3 integration:** The single context should include at least one graph or diagram.
- **§4 practice test:** Follow the source type requirements (at least 1 graph context).

### 7.3 Graph generation

All graphs generated via `economic-graph` skill. Follow the same specifications as theory paragraph graphs:
- Economically correct, geometrically precise
- Labels embedded on diagrams (split-attention effect prevention)
- SVG + PNG pairs (PNG for PDF embedding)

---

## PART 8: FILE OUTPUT SUMMARY

### 8.1 Per §1 paragraph (Active Summary)

```
X.5.1 Actieve samenvatting/
  X.5.1 Actieve samenvatting – samenvatting.md
  X.5.1 Actieve samenvatting – antwoorden.md
  X.5.1 Actieve samenvatting – samenvatting.pdf
  X.5.1 Actieve samenvatting – antwoorden.pdf
  build_pdf.py
  _assets/
    X.5.1_fig_1.svg   X.5.1_fig_1.png
    X.5.1_mc_1.svg     X.5.1_mc_1.png
    ...
```

### 8.2 Per §2 paragraph (Exam Skills)

```
X.5.2 Examenvaardigheden/
  X.5.2 Examenvaardigheden – opgaven.md
  X.5.2 Examenvaardigheden – antwoorden.md
  X.5.2 Examenvaardigheden – opgaven.pdf
  X.5.2 Examenvaardigheden – antwoorden.pdf
  build_pdf.py
  _assets/
    X.5.2_fig_1.svg   X.5.2_fig_1.png
    X.5.2_ex_1.svg     X.5.2_ex_1.png
    ...
```

### 8.3 Per §3 paragraph (Integration)

```
X.5.3 Integratieoefening/
  X.5.3 Integratieoefening – opgaven.md
  X.5.3 Integratieoefening – antwoorden.md
  X.5.3 Integratieoefening – opgaven.pdf
  X.5.3 Integratieoefening – antwoorden.pdf
  build_pdf.py
  _assets/
    X.5.3_fig_1.svg   X.5.3_fig_1.png
    X.5.3_ex_1.svg     X.5.3_ex_1.png
    ...
```

### 8.4 Per §4 paragraph (Practice Test)

```
X.5.4 Proeftoets/
  X.5.4 Proeftoets – toets.md
  X.5.4 Proeftoets – antwoorden.md
  X.5.4 Proeftoets – toetsmatrijs.md
  X.5.4 Proeftoets – toets.pdf
  X.5.4 Proeftoets – antwoorden.pdf
  X.5.4 Proeftoets – toetsmatrijs.pdf
  build_pdf.py
  _assets/
    X.5.4_fig_1.svg   X.5.4_fig_1.png
    X.5.4_ex_1.svg     X.5.4_ex_1.png
    ...
```

---

## DECISION CHECKLIST

### §1 Active Summary:
1. [ ] 5 summary blocks identified (one per topic cluster from the book)
2. [ ] Each block is 4–6 sentences
3. [ ] 2–3 MC questions per block (10–15 total)
4. [ ] MC distractors sourced from reasoning CSVs or blueprint difficulty notes
5. [ ] Each MC has answer explanation naming the misconception
6. [ ] At least one graph per summary block (dual coding)
7. [ ] All chapters covered (no lopsided distribution)
8. [ ] No new theory introduced

### §2 Exam Skills:
9. [ ] 4–5 exercises, each targeting ONE skill
10. [ ] Each exercise labelled with its target skill
11. [ ] Book-specific emphasis matches the emphasis table
12. [ ] At least one model-vs-weak answer comparison included
13. [ ] Answer structuring vocabulary used correctly (noem/leg uit/verklaar/bereken/beoordeel)

### §3 Integration:
14. [ ] Single coherent context (not multiple short exercises)
15. [ ] 5–7 sub-questions, each labelled with chapter skill
16. [ ] All 4 theory chapters represented in sub-questions
17. [ ] Final sub-question is standpuntbepaling
18. [ ] Book 4: cross-book elements included (Books 1–3)
19. [ ] Questions are theory-paragraph style (clean, not exam-complex)

### §4 Practice Test:
20. [ ] Toetsmatrijs created BEFORE opgaven
21. [ ] 120-minute format: 6–8 questions across 3–4 contexts
22. [ ] Point distribution matches targets (~70% in 2p questions)
23. [ ] Bloom distribution balanced (~25% begrijpen, ~40% toepassen, ~35% analyseren/evalueren)
24. [ ] All 4 theory chapters covered
25. [ ] At least 1 graph context, 1 data table, 1 text source
26. [ ] Book 4: cumulative elements from Books 1–3 included
27. [ ] Answer models with point allocation per sub-question
28. [ ] Source referencing in answers ("Uit de tabel...")

### All types:
29. [ ] No new theory anywhere
30. [ ] VWO terminology from `references/authored/economie-terminologie.md`
31. [ ] All image refs resolve to files in `_assets/`
32. [ ] SVG/PNG pairs complete
33. [ ] Asset naming: `X.5.Z_{type}_{number}.{ext}`
34. [ ] build_pdf.py present and adapted

---

## POST-BUILD: QC AND QUALITY_REF

The testprep builder itself does **not** run QC — that is handled by the chapter orchestrator (`econ-chapter-builder` Part 4). When building test prep as part of a chapter:

1. The orchestrator spawns an independent review sub-agent that runs `econ-paragraph-review` on each test prep paragraph
2. The orchestrator spawns a sub-agent to generate `X.5.Z-quality-ref.yaml` via `econ-quality-control`
3. Both artifacts are required by the chapter completeness gate

When building test prep standalone (not as part of a chapter), run the QC steps from `BUILD-PARAGRAPH.md` Part A steps A5–A7 yourself.

---

*This skill builds test preparation paragraphs. For theory paragraphs, see `econ-textbook-paragraph`. For consolidation exercises, see `econ-consolidation-builder`. For pedagogical principles, see `econ-didactiek`. For PDF export, see `econ-pdf-builder`.*

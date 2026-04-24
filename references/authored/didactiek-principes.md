# Didactische Principes — Reference for Economics Materials

```
last_verified: 2026-04-14
source: consolidated from econ-didactiek, econ-textbook-paragraph, econ-exercise-builder,
        econ-paragraph-review, econ-consolidation-builder, econ-quality-control,
        AGENTS.md, BUILD-PARAGRAPH.md, BUILD-CHAPTER.md,
        tips for writing economics teaching material
research_base: cognitive load theory, dual coding theory, multimedia learning,
               economics education research, Dutch onderwijsinspectie framework
```

This document is the **single source of truth** for all didactical and design principles used in the 4veco platform. Skills reference this document for the underlying knowledge; they handle the procedural "how to build" instructions themselves.

---

## PART 1: CORE DESIGN PHILOSOPHY

### 1.1 Reduce friction, not add content

Effective material design is not about adding more content but about reducing friction between the student and the concept. Every element — image, exercise, paragraph, slide — must earn its place by directly supporting schema construction. Decorative images, separated legends, blocks of same-type problems, and theory without a motivating problem are friction to be eliminated.

### 1.2 Problem-first, theory-second

Theory is introduced as a tool to solve a motivating problem, not the other way around. Students who don't understand the purpose of theory find learning "more dry and difficult than it needs to be" (Velenchik, 1995). Every concept should be anchored in a recognisable context before formalisation. The sequence is: **problem → need for a tool → theory as tool → application**.

### 1.3 Unified procedures, varied contexts

**Concept-context separation:** procedures, notation, solution steps, and precise language are kept strictly consistent across all materials. If a procedure is taught in a theoretical explanation, the answer model follows exactly that procedure. But *contexts* are deliberately varied to build transfer. Same method, different settings.

**Enforcement rules:**
1. If a skill has 3 steps in the vaardigheden doc, the stappenplan game uses those exact 3 steps (same labels, same order, same reasoning). The procedure is the constant; the context can change.
2. The visual concept from the presentatie reappears in the vaardigheden explanation of the same skill — so students see the visual anchor for the procedure they're learning. This means adapted variants per surface, not a literal copy-paste of the same textbook image.
3. Terminology is enforced via the `_paragraph-plan.md` terminologie table. The `procedure-stappen-plan` defines the canonical step sequence for each skill. The `visual-variants plan` defines which surface-specific image each builder uses. All builders follow these exact plans.

### 1.4 Models as tools, not reality

Economic models are analytical tools, not descriptions of how the world works. Consistently signal the assumptions behind models, their limitations, and the gap between predictions and observed reality. Use **layered nuance** (Colander, 2016): introduce clean principles first, then systematically add qualifications, exceptions, and competing perspectives in later encounters. Mankiw's counterpoint — the tradeoff between nuance and clarity — is resolved by *sequencing*, not by choosing one over the other.

### 1.5 Spiral curriculum

Core concepts (opportunity cost, supply/demand, equilibrium, surplus) reappear at increasing complexity across the course. Each return adds depth, not just repetition. **Advance through Bloom's taxonomy with each revisit**: remember on first encounter, understand on second, apply on third, analyze and evaluate on subsequent passes.

Poorly implemented spiraling becomes what Schmidt, McKnight, and Raizen (1997) call "a mile wide and an inch deep" — mere repetition without genuine deepening.

**Evidence:** Hattie's meta-analysis places the effect size of spaced practice — a core spiral mechanism — at **0.71**, making it one of the most impactful teaching strategies available.

---

## PART 2: COGNITIVE LOAD THEORY (Sweller)

Dylan Wiliam (2017): "the single most important thing for teachers to know."

### 2.1 Three types of load

| Type | What | Design implication |
|------|------|--------------------|
| Intrinsic | Complexity of the content itself | Cannot be avoided, but can be split into manageable pieces |
| Extraneous | Burden from poor design | Minimise: clear language, logical structure, no distraction |
| Germane | Burden that leads to learning | Maximise: connections, examples, practice |

Every design decision must ask: does this reduce extraneous load, manage intrinsic load, and maximise germane load?

### 2.2 Working memory constraints (Cowan, 2001)

Working memory holds approximately **4 chunks** of information simultaneously. Limit new concepts per section to **4–6**. Divide chapter content into **3–4 main sections** of manageable length, each with built-in formative checks.

Effective load management strategies:
- **Simple-to-complex approach:** perfect competition before oligopoly, closed economy before open
- **Part-whole approach:** teach demand separately, then supply, then combine into equilibrium
- Learn the instrument (e.g., graph drawing) APART from the theory (e.g., why MO = MK)
- Build complexity only after the basics are established
- One concept per unit (slide, section, exercise)

### 2.3 Split-attention effect

When students must process a supply-demand diagram on one part of the page and its explanation in a separate paragraph, they waste cognitive resources integrating the two sources. Sweller: "split attention occurs very commonly in instructional contexts... the evidence suggests overwhelmingly that it has negative consequences."

**Rule:** Labels, annotations, and step-by-step reasoning must be embedded directly on or immediately adjacent to the diagram, not in separate text blocks.

**This is the most violated principle in economics publishing.** Graph on one page, explanation on another, is a FAIL.

### 2.4 Redundancy effect

Presenting the same information in multiple forms simultaneously hinders learning. Avoid text that merely describes what a graph already shows. Instead, text should add interpretive value — explaining *why* the curve shifts, what the implications are, or connections to previous concepts.

Sweller (2016): "Most people assume that providing learners with additional information is at worst, harmless... Redundancy is anything but harmless."

**Distinction from dual coding:** Dual coding = same concept via two *different* encoding channels (verbal + visual). Redundancy = same information repeated in the *same* channel (text describing what graph already shows). The former helps; the latter hurts.

### 2.5 Worked example effect + expertise reversal

The worked example effect is "the best known and most widely studied of the cognitive load effects" (Sweller). For novice learners, studying step-by-step solutions is significantly more effective than attempting to solve independently, because problem-solving via means-ends analysis consumes working memory that could otherwise build mental schemas.

**Evidence:** Meta-analysis effect size: **0.52** (Crissman, 2006).

**Expertise reversal:** As learners gain competence, worked examples and scaffolding become *counterproductive*. This is the theoretical foundation for differentiation: early material heavily scaffolded, scaffolding deliberately reduced as chapters progress.

### 2.6 Practical rules for material design

1. Learn the instrument SEPARATELY from the theory
2. Build complexity only after basics are established
3. Combine text and image (dual coding) — not text OR image, but together
4. One concept per unit (slide, section, exercise)
5. Maximum ~4 new chunks per learning moment (Cowan, 2001)
6. Labels and annotations embedded on/adjacent to diagrams (no split attention)
7. Text adds interpretive value beyond what the graph shows (no redundancy)

---

## PART 3: DUAL CODING (Paivio/Mayer)

### 3.1 The principle

Information is retained better when it arrives through both verbal (text/speech) and visual (graph/diagram/colour) channels. Confirmed for economics specifically (Nature: Humanities and Social Sciences Communications, 2024).

**Rules:**
- Every document explaining a concept must pair text with a visual aid
- Explainer documents (voorkennis, vaardigheden) embed relevant adapted visual variants from `_assets/` — not just the presentatie
- Samenvatting includes key concept graphs alongside text cells
- Exercises reference or include graphs where the concept involves graphical reasoning
- The same visual concept in the presentatie should appear in the vaardigheden doc teaching the same skill, with separate slide/docx/summary/web-light/web-dark variants where the layout or theme needs it
- Domain colour coding (blauw/amber/groen) provides visual recognition without reading
- Formula boxes in monospace provide visual distinction from running text

### 3.2 Graphs must be taught, not just shown (Cohn et al., 2001)

Graphs do not automatically improve learning. Cohn and colleagues (2001), in controlled experiments at the University of South Carolina, found that students with graphs sometimes scored **significantly lower** than those without. Ring and Oberrauch (2024), testing 579 students, identified specific weaknesses: students struggle with comparing quantities along the y-axis, misinterpret what supply and demand curves represent, and find indifference curves particularly challenging.

**What matters is *how* graphs are integrated:**
1. Build graphs step by step with annotations — never show an unfinished graph and proceed
2. Practice graph-reading skills *apart* before using graphs to teach new concepts
3. Address the shift-vs-movement confusion explicitly (most common misconception in economics graph interpretation)
4. An early "How to Read an Economics Graph" section should pre-train graph-reading skills before the first analytical diagram appears

**Colour and accessibility:** Colour must never be the sole carrier of meaning — approximately 8% of males are colour-blind. Line styles, patterns, and labels must always supplement colour. Maintain consistent visual language throughout: same colour for demand (blue), same for supply (green), same annotation style from chapter one to the last chapter.

### 3.3 Step-by-step graph construction (Mayer's segmenting principle)

Complex diagrams should be built step by step rather than presented complete. A market equilibrium analysis might use four sequential panels — demand curve alone, supply curve added, equilibrium identified, effect of a shift shown — each with accompanying explanation.

**Implementation:**
- Generate separate SVG files for each stage (e.g., `_fig_1.svg` demand only, `_fig_2.svg` demand + supply, `_fig_3.svg` equilibrium)
- Each subsequent figure adds elements to the previous one
- Axes, scale, and positioning must be identical across all stages so the student sees accumulation, not a different graph
- When 3+ curves are needed, split into side-by-side panels sharing the same axes — never cram overlapping curves onto one plot

### 3.4 Triple coding: graph + text + numerical table

For any concept with a procedure producing numerical outputs (collective demand summation, surplus calculation, equilibrium, elasticity), present the same idea in **three encoding channels** within the same theory section:

1. **Visual** — a graph (or graphs built step by step)
2. **Verbal** — body text describing what's happening
3. **Numerical** — a small table organising several rows of values

Place all three close together so the student can switch between channels as they read. Different students prefer different encodings: graph for visual learners, table for numerical thinkers, text for verbal reasoners.

### 3.5 Unified visual language

- Same colours for same concepts throughout all materials (demand blue, supply green, TK orange, etc.)
- Consistent annotation style, diagram formatting from chapter one to the last
- Domain colour coding (blauw = wiskunde, amber = economisch, groen = grafisch) provides visual recognition without reading
- All graphs on white backgrounds, uncluttered

### 3.6 Unified experience across formats

A student working through all materials for one paragraph should feel like following one coherent lesson, not 8 independent documents. The core anchor is **consistent procedures and approaches**: the same method, the same steps, the same reasoning structure everywhere. Products and numbers may vary by context, but the approach must be identical.

---

## PART 4: SCAFFOLDING & FADING

### 4.1 Scaffolding levels (0–5)

| Niveau | Naam | Wat de leerling krijgt | Wanneer |
|--------|------|------------------------|---------|
| 0 | Geen scaffolding | Alleen de vraag | Standaard opgavenset |
| 1 | Lichte hint | Één zin die richting geeft | Leerling weet het concept maar mist de ingang |
| 2 | Denkstappen | Genummerde stappen als leidraad | Leerling kent de stof maar kan het niet structureren |
| 3 | Formule-herinnering | Relevante formules bij de vraag | Leerling vergeet welke formule nodig is |
| 4 | Invulformaat | Deels ingevuld antwoord | Leerling weet de stappen maar maakt rekenfouten |
| 5 | Volledig uitgewerkt | Antwoord + uitleg waarom | Naslag, zelfstudie, herkansing |

### 4.2 Vygotsky's Zone of Nearest Development (ZNO)

Scaffolding operates within the ZNO: just above what the learner can do independently, reachable with help. The four-step model (Van de Pol, 2012):

1. **Diagnose** → identify where the learner gets stuck
2. **Check** → verify your interpretation is correct
3. **Hulp** → provide support scaled to need
4. **Begripscheck** → verify the learner has understood

Two forms: **gepland** (built into material — only in begeleide inoefening) and **interactief** (spontaneous in dialogue — for every learner).

### 4.3 Backward fading strategy (Renkl & Atkinson, 2003)

The transition from worked examples to independent practice follows backward fading: start with a fully worked example, remove the last step for students to complete, then remove progressively more steps, until students solve independently.

Backward fading outperforms forward fading because earlier steps have higher element interactivity and benefit most from guidance.

**Schedule across exercise sets:**
```
Oefening 1-2:  Volledige scaffolding (denkstappen + formules + hints + invulformaat)
Oefening 3-4:  Verminderd (hints + formulekaart, geen denkstappen meer)
Oefening 5-6:  Minimaal (alleen een korte hint)
Oefening 7-8:  Geen scaffolding (zelfstandig)
```

**Signal for fading:** If exercise 3 requests the same skill as exercise 2 (in a different context), it's time to remove the denkstappen.

### 4.4 4-stage dual coding fading for exercises

Across startoefeningen + independent practice, visuals fade in four stages:

| Stage | Exercise | What the student is given | What the student does |
|-------|----------|--------------------------|----------------------|
| 1 | Startoefening 1 | Graph **with** the change drawn AND labeled | Reads, identifies, classifies, explains |
| 2 | Startoefening 2 | Graph base (axes + initial line) only | Draws the change themselves |
| 3 | Startoefening 3 | No graph | Reasons in text/words only |
| 4 | Independent practice | No graph | Draws their own graph from scratch |

**Why stage 1 is non-negotiable:** Without it, the first exercise asks students to *produce* before they have *recognized*. Stage 1 lets them verify their reading of visual conventions before applying them. It is the lowest-friction entry point into the visual representation.

### 4.5 Scaffold decision tree

```
Vraagtype = berekening?
  ├─ Ja → formule-herinnering + invulformaat + denkstappen
  └─ Nee →
      Vraagtype = redenering/uitleg?
        ├─ Ja → denkstappen + hint
        └─ Nee →
            Vraagtype = grafiek tekenen?
              ├─ Ja → denkstappen (tekenplan) + voorbeeld-coördinaten
              └─ Nee →
                  Vraagtype = begrip/definitie?
                    ├─ Ja → hint (verwijzing naar begrip)
                    └─ Nee → geen scaffold nodig
```

### 4.6 Expertise reversal: when scaffolding hurts

As learners gain competence, worked examples and scaffolding become counterproductive (Sweller). This directly supports differentiation: early material heavily scaffolded, scaffolding deliberately reduced as chapters progress. Same chapter can differentiate by including both scaffolded and unscaffolded versions of problems, letting students (or teachers) choose the entry point.

### 4.7 Five-layer concept progression (Claar & Finn, 2011)

Claar and Finn identified a critical problem: "Students often become frustrated with learning economics not because the economics is too hard, but because they try to grasp the economic device, model, or tool being used at the same time they try to understand the economic theory the device is designed to illuminate."

Each concept should follow: **concrete familiar example → formal model with worked example → guided practice with partial scaffolding → independent practice → real-world application.**

---

## PART 5: DIFFERENTIATION

### 5.1 The differentiation spectrum

```
Extra ondersteuning ◄────────── Standaard ──────────► Extra uitdaging

  Begeleide               Reguliere              Verdieping &
  inoefening              opgavenset             verbreding

  Denkstappen             Opgaven zonder         Open opdrachten
  Hints                   extra hulp of          Modelextensies
  Formulekaarten          extra uitdaging        Eigen context zoeken
  Invulformaten                                  Kritische evaluatie
  Uitgewerkte antw.                              Transfer naar ander domein
```

**When each level is needed:**
- **Extra ondersteuning** → leerlingen die vastlopen bij structureren, formules kennen maar niet weten welke ze moeten gebruiken, concept begrijpen maar niet zelfstandig kunnen toepassen
- **Standaard** → leerlingen die de stof in de les hebben gevolgd en zelfstandig aan de slag kunnen. Dit is het basisproduct dat elke leerling krijgt
- **Extra uitdaging** → leerlingen die standaardopgaven snel en correct afmaken, behoefte hebben aan meer diepgang, klaar zijn om kennis in onbekende contexten toe te passen

### 5.2 Design rules per level

**Extra ondersteuning:**
- Denkstappen, hints, formuleherinneringen, invulformaten
- Antwoorden uitgebreid met uitleg (het "waarom")
- Scaffolding afbouwen over oefeningen (fading)
- Begeleide inoefening MUST have `scaffoldImage` for every graph exercise (visual scaffolding coupled with text-based denkstappen)

**Standaard:**
- Opgaven zonder tussenstappen, hints of scaffolding
- Standaard antwoordmodel volstaat

**Extra uitdaging:**
- Open vragen die evaluatie of creatie vereisen
- Laat leerlingen een model uitbreiden of bekritiseren
- Transfer: pas het concept toe in een onbekende context
- GEEN tussenstappen, hints of formulekaarten — die vertragen het denkproces
- Eventueel: leerlingen hun eigen opgaven laten ontwerpen

### 5.3 What real verdieping IS and IS NOT

| ❌ Geen echte verdieping | ✅ Echte verdieping |
|--------------------------|---------------------|
| Meer rekenwerk (langere getallen) | Een model bekritiseren ("Wanneer klopt MO = MK niet?") |
| Meer deelvragen over dezelfde vaardigheid | Transfer naar een nieuwe markt/context |
| Dezelfde berekening met andere getallen | Een beleidsvoorstel schrijven en onderbouwen |
| Extra stappen in een keten | Twee modellen vergelijken |
| Moeilijkere formules memoriseren | Zelf een model ontwerpen of uitbreiden |

### 5.4 Positive framing rules

**Core rule: never use labels that reinforce a negative self-image.**

| ❌ Niet | ✅ Wel |
|---------|--------|
| "Makkelijke versie" | "Begeleide inoefening" |
| "Basisniveau" | "Stap-voor-stap werkblad" |
| "Versimpeld" | "Oefenen met denkstappen" |
| "Zwakke leerlingen" | "Leerlingen die baat hebben bij extra structuur" |
| "Moeilijke versie" / "Voor de slimme leerlingen" | "Verdieping" of "Denkertje" |

Extension boxes must be framed as opportunity rather than remediation (Tomlinson). Verdiepingsopdrachten must be available to everyone, never locked away.

### 5.5 Concept-context approach per level

**Extra ondersteuning — concreet → abstract:**
1. Herkenbare context (supermarktprijzen, Spotify)
2. Economisch concept introduceren
3. Formaliseren met formules en grafieken
4. Toepassen in dezelfde context

**Standaard — concreet → abstract → transfer:**
1. Herkenbare context
2. Concept en formalisering
3. Toepassen in een nieuwe, vergelijkbare context

**Extra uitdaging — abstract → concreet:**
1. Model direct introduceren
2. Kort voorbeeld uitwerken
3. Leerling zoekt zelf een passende context
4. Leerling breidt het model uit of bekritiseert het

### 5.6 Causaliteitsketens scaffolding per level

Economische redeneringen zijn ketens van oorzaak en gevolg. Scaffolding differs per level:

| Fase | Niveau | Ondersteuning |
|------|--------|---------------|
| Voordoen | Extra ondersteuning | Docent bouwt de keten hardop op |
| Begeleid invullen | Extra ondersteuning | Keten met lege vakjes |
| Zelfstandig opbouwen | Standaard | Begin en eind gegeven |
| Transfer | Standaard + verdieping | Zelfde ketenstructuur, nieuwe context |
| Kritische evaluatie | Verdieping | Welke schakels zijn aannames? Wanneer klopt het niet? |

**Example:**
```
Extra ondersteuning:  olieprijs ↑ → [productiekosten ↑] → aanbod ↓ → [prijs ↑]
Standaard:            minimumloon ↑ → [___] → [___] → [___]
Verdieping:           "De ECB verlaagt de rente. Bouw een keten van minimaal 5 schakels
                       en geef aan welke schakels onzeker zijn."
```

### 5.7 Grafiekvaardigheid — opbouw in lagen

| Laag | Vaardigheid | Extra ondersteuning | Standaard | Verdieping |
|------|------------|---------------------|-----------|------------|
| 1. Aflezen | "Wat is de prijs bij Q = 20?" | Grafiek + pijl naar het punt | Alleen de vraag | — |
| 2. Verschuiven | "Teken de nieuwe vraaglijn" | Richting-hint + originele lijn | Alleen de vraag | — |
| 3. Tekenen | "Teken V, A, MO en MK" | Coördinatentabel + volgorde | Alleen formules | — |
| 4. Interpreteren | "Wat stelt het gearceerde vlak voor?" | Legenda met vlakken | Alleen de vraag | — |
| 5. Redeneren | "Wat gebeurt met CS bij belasting?" | — | Alleen de vraag | "Vergelijk twee scenario's" |

---

## PART 6: INTERLEAVING

### 6.1 The principle

Exercise problems should be mixed over question types instead of blocked by topic. Interleaving produces large, reliable learning gains, but fewer than **10%** of typical textbook problems use it.

**Evidence:** Rohrer, Dedrick, Hartwig, and Cheung (2020) randomised controlled trial: interleaving boosted test scores by approximately **30%** compared to blocked practice. "There is no direct evidence that students benefit from solving more than a few problems of the same kind in immediate succession." Analysis of six popular math textbooks found only **9.7%** of problems were interleaved.

### 6.2 The 60/25/15 allocation rule

| Component | Share |
|-----------|-------|
| Current-chapter content | ~60% |
| Problems from 2–3 previous chapters | ~25% |
| Earlier material | ~15% |

Every 3–4 chapters, a cumulative review section should pull together threads from across the book.

### 6.3 Skill selection priority order

**Priority 1 — Direct prerequisites:** Skills that the current paragraph builds on (e.g., if the current paragraph is consumer surplus, interleave with equilibrium solving).

**Priority 2 — Fundamental skills under regular repetition:**
- Percentage calculations and percentage changes
- Graph reading (aflezen, interpoleren)
- Index number calculations
- Shift vs. movement distinction
- Basic cost calculations (TK, GTK)

**Priority 3 — Recent skills at risk of decay:** Skills from the previous chapter that haven't been practised since.

### 6.4 Interleaving exercise design rules

- Keep interleaving exercises **short** (2–4 minutes each)
- Use a **different context** from the original paragraph where the skill was taught
- Do **not** add scaffolding — these are revision, not new learning
- If a student cannot do an interleaving exercise, signal a gap: "Kun je deze opgave niet maken? Herhaal dan §X.Y.Z."

### 6.5 Adjustment for paragraph difficulty

- **LIGHT paragraph:** More time for interleaving (3–4 exercises from earlier chapters)
- **MEDIUM paragraph:** Balanced distribution
- **HEAVY paragraph:** Interleaving reduced to 1–2 quick exercises; guided practice takes most of the budget

### 6.6 Retrieval practice (Roediger & Karpicke)

Taking a practice test improves long-term retention more than equivalent time spent restudying, **even without feedback**. Must be framed as learning tool, not assessment — low-stakes, confidence-building.

**Implementation:**
- Chapter opens with a retrieval quiz mixing current + prior topics
- "Check Your Understanding" boxes after each major section in theory
- Interleaved cumulative exercises at chapter end
- Redeneer-spel with progress tracking as a retrieval practice mechanism

---

## PART 7: MISCONCEPTIONS

### 7.1 Why standard instruction fails

Misconceptions are deeply resistant to standard instruction. Busom, Lopez-Mayan & Panadés: "exposure to an economic principles course hardly seems to affect misconceptions." Correct presentation alone is not enough — textbooks cannot simply present correct information and expect misconceptions to disappear.

### 7.2 Three required strategies

1. **Predict-observe-explain** → present scenario, let student predict, reveal outcome
2. **Explicit comparison** → misconception and correct conception side by side
3. **Data-driven exercises** → confront students with evidence contradicting their assumptions

### 7.3 Threshold concepts for economics (Davies & Mangan)

These deserve explicit, repeated attention across the course:
- Prijs vs. kosten
- Geld vs. inkomen
- Reëel vs. nominaal
- Besparingen vs. investering
- Verschuiving VAN vs. LANGS de lijn (most common)
- Absoluut vs. comparatief voordeel

### 7.4 Common errors per economics topic

Build these into warning boxes ("Let op" boxes). In extra ondersteuning: include as waarschuwingsboxen. In standaard: mention briefly. In verdieping: let students discover them.

**Marktevenwicht:**
- Confusing shift OF the line with movement ALONG the line
- Forgetting ceteris paribus applies

**Monopolie:**
- Reading price from MO line instead of demand line
- Winst = TO instead of winst = TO − TK
- Drawing MO line through origin (with linear demand, MO starts at the same y-intercept as V)

**Prijsdiscriminatie:**
- Forgetting the two conditions (segmenteren + geen doorverkoop)
- Reasoning that price discrimination always harms consumers

**Internationale handel:**
- Confusing absolute advantage with comparative advantage
- Forgetting both countries benefit from trade

### 7.5 Combined-change misconception exercise pattern

For paragraphs teaching a key distinction (shift vs. movement, complement vs. substitute, real vs. nominal, normal vs. inferior good), include **at least one exercise where two things change simultaneously**, each on a different side of the distinction.

**Pattern:**
```
Opgave N (twee veranderingen tegelijk — let goed op!)

Op de [market] gebeuren twee dingen op dezelfde dag:
1. [Change A — affects own price]
2. [Change B — affects non-price factor]

a) Alleen verandering 1. Wat gebeurt er? Beweging of verschuiving? Welke richting?
b) Alleen verandering 2. Wat gebeurt er? Beweging of verschuiving? Welke richting?
c) Beide tegelijkertijd. Beschrijf netto-effect. Versterken of tegen elkaar in?
d) Een leerling zegt: "[plausible wrong reading]". Waarom niet?
```

**Why:** Students who correctly classify single changes often collapse under simultaneous changes. The combined-change exercise forces them to keep both lenses active. Always include sub-question (d) confronting a tempting wrong reading.

**Placement:** LAST starter exercise (highest scaffolded difficulty) OR FIRST independent exercise.

### 7.6 Misconception warning box format

Place immediately after the concept triggering the misconception. State both the wrong and correct understanding side by side. Keep to 3–4 lines. Explain WHY the error is tempting, not just that it's wrong.

```markdown
> **⚠️ Let op — veelgemaakte fout**
> Veel leerlingen verwarren een *verschuiving van* de vraaglijn
> met een *beweging langs* de vraaglijn.
> Een prijsverandering van het goed zelf → beweging LANGS de lijn.
> Een verandering van inkomen, voorkeuren of andere factoren → verschuiving VAN de lijn.
```

---

## PART 8: BLOOM'S TAXONOMY FOR ECONOMICS

### 8.1 Levels with economics examples and signal words

| Bloom-niveau | Economie-voorbeeld | Signaalwoorden | Geschikt voor |
|--------------|-------------------|----------------|---------------|
| Onthouden | "Noem de vier marktvormen" | Noem, som op, geef de definitie van | Alle niveaus |
| Begrijpen | "Leg uit waarom MO = MK winst maximaliseert" | Leg uit, beschrijf, geef aan waarom | Alle niveaus |
| Toepassen | "Bereken de evenwichtsprijs" | Bereken, teken, leid af | Alle niveaus |
| Analyseren | "Vergelijk de welvaart vóór en na de belasting" | Vergelijk, analyseer, onderscheid | Standaard + verdieping |
| Evalueren | "Beoordeel of prijsdiscriminatie de welvaart verhoogt" | Beoordeel, beredeneer of | Verdieping |
| Creëren | "Stel een beleidsmaatregel voor" | Bedenk, ontwerp, stel voor | Verdieping |

### 8.2 SOLO taxonomy complement

SOLO taxonomy offers a complementary lens for *response quality* progression:
- **Unistructural** — define opportunity cost
- **Multistructural** — list three demand shifters
- **Relational** — explain how interest rates affect consumption, investment, AD, and employment
- **Extended abstract** — evaluate whether government intervention is justified and identify conditions where the conclusion might not hold

### 8.3 Differentiation via Bloom

Standaardopgaven operate mostly on onthouden / begrijpen / toepassen. Verdieping escalates to analyseren / evalueren / creëren. Progression within and across chapters follows this arc.

Exercise progression within a chapter: define → calculate → explain → analyze → evaluate → create.

### 8.4 Target distributions for exercises and tests

**Consolidation exercises and tests:**

| Points | Target | Bloom level | Target |
|--------|--------|-------------|--------|
| 1p | ~5% | Onthouden/Begrijpen | ~25% |
| 2p | ~70% | Toepassen | ~40% |
| 3p | ~10% | Analyseren/Evalueren | ~35% |
| 4p | ~15% | | |

~80% of questions should be 2p. Point standards: 1p = one action (name, shade, classify). 2p = two causal links or two calculation steps. 3p = multi-step + interpretation. 4p = complex multi-step (4+ steps).

---

## PART 9: EXERCISE DESIGN PRINCIPLES

### 9.1 Exercise progression sequence

```
1. WORKED EXAMPLE
   Not an exercise — fully solved. Same procedure as target exercise, simpler context.
   Students read/study this.

2. STARTOEFENINGEN (4-stage dual coding fading — see §4.4)
   Stage 1: READ a labeled graph
   Stage 2: DRAW on a provided graph base
   Stage 3: DESCRIBE without a graph

3. INDEPENDENT PRACTICE
   1–3 exercises at target difficulty, no scaffolding, no visuals provided.
   Stage 4: students draw their own graph from scratch when needed.

4. INTERLEAVING EXERCISES
   1–4 exercises from previous paragraphs. Keep quick (2–4 min each).

5. TARGET EXERCISE (doeloefening)
   From blueprint, verbatim or lightly adapted. The capstone.

6. VERDIEPINGSOPDRACHT (outside time budget)
   Open question at Bloom analyseren/evalueren/creëren. Different context.
   No scaffolding. Labeled "Denkertje" or "Bonusopgave".
```

### 9.2 Time budget and allocation

Total exercise set: **40–60 minutes** of student work (excluding worked example).

| Component | Time share |
|-----------|------------|
| Guided practice (with fading) | ~50% |
| Independent practice | ~20% |
| Interleaving exercises | ~15% |
| Target exercise | ~15% |

Verdiepingsopdracht is **outside** the 40–60 min budget — optional stretch material.

### 9.3 Answer model rules

**Unified procedures (MANDATORY):** The answer model follows the exact same steps taught in the worked example, in the same order, with the same notation. No shortcuts, no alternative methods, no reordering.

**Structure per exercise:**
```
Stap 1: [description]
[calculation or reasoning]
Stap 2: [description]
[calculation or reasoning]
Antwoord: [final answer with units]
*Waarom:* [1–2 sentences — why this makes economic sense]
```

**Rules:**
- Always show substitution (formula → substitution → intermediate → final)
- Always include units (€, %, stuks, eenheden)
- Always include "Waarom" — at least for the final answer
- State rounding rule once at top; apply consistently
- Graph answers include reference to graph file in `_assets/`

### 9.4 Concept precision (MANDATORY — BLOCKING RULE)

When attributing a change to a vraagfactor / aanbodfactor / cost driver, always pick the **most economically specific category**. Do NOT blur categories.

❌ Wrong: "Petrol prices rise → biking becomes more attractive → preferences changed → shift right"
✅ Right: "Petrol prices rise → cars (substitute for bike) become more expensive → price of substitute changes → shift right"

When a tempting wrong attribution exists, add: `⚠️ Let op de juiste vraagfactor`

**Why:** Beginners still building the categorisation reflex. Loose attribution teaches them to fall back on "preferences" whenever unsure, collapsing the distinction being taught.

### 9.5 Context selection rules

- Each exercise uses a different context from others in the same paragraph
- Do not reuse a context from another paragraph of the same chapter
- Use recognisable, age-appropriate settings (bakeries, cinemas, streaming, transport, sports, food markets)
- Target exercise context comes from the blueprint — do not change it
- Interleaving exercises may reuse contexts from earlier chapters (reinforces transfer)

### 9.6 Distinction-drilling tables need column headers (MANDATORY)

When an exercise is a multi-row classification table, the table **must include explicit column headers** naming the response format.

❌ Wrong — empty answer column forces students to invent format:
```
| | Situatie |
|---|---|
| a | De prijs stijgt van €45 naar €60. |
```

✅ Right — headers scaffold the response format:
```
| | Situatie | Beweging of verschuiving? | Richting | Vraagfactor |
|---|---|---|---|---|
| a | De prijs stijgt van €45 naar €60. |  |  |  |
```

Headers tell weaker students what each cell should contain, making the task purely analysis rather than response-format invention.

### 9.7 Verdieping answer model

No step-by-step procedure. Instead: a **model answer** showing one strong response, followed by **beoordelingscriteria** (2–4 bullet points stating what a good answer includes).

---

## PART 10: TEXTBOOK PARAGRAPH STRUCTURE

### 10.1 Canonical section sequence (NEVER reorder)

```
1. HEADER — paragraph number + title (no difficulty rating)
2. MOTIVATING PROBLEM — recognisable situation creating cognitive conflict
3. THEORY — concept explanation with dual coding, definition/formula/warning/recall boxes
4. WORKED EXAMPLE — fully solved, same procedure as target exercise, simpler context
5. SUMMARY BOX — 3–5 bullet points + forward pointer (AFTER worked example, BEFORE exercises)
6. WEBSITE-HELP NOTE — "Vastgelopen op een opgave?" callout
7. EXERCISES — embedded inline
```

**Critical:** Worked example always BEFORE summary; summary always BEFORE exercises. Reading order: theory → worked example → recap → practice.

**Time shares:**

| Section | Time | Purpose |
|---------|------|---------|
| Motivating problem | ~5 min | Class discussion |
| Theory | ~15 min | Instruction |
| Worked example | ~5 min | Reading/studying |
| Exercises | ~40–60 min | Practice + homework |
| Summary | ~2 min | Reference |

### 10.2 Writing rules

- **Lean:** One concept per paragraph. Do not explain adjacent concepts.
- **Problem-first:** Start with motivating problem, not definition. Student should feel "I need a tool" before receiving it.
- **Concrete before abstract:** First specific example → general principle → formula.
- **Active voice, present tense:** "De bakker berekent zijn winst" not "De winst kan als volgt berekend worden."
- **Short sentences:** Average < 20 words. One idea per sentence.
- **No filler:** Every sentence must teach or set up the next. Cut "Het is belangrijk om te weten dat…"

### 10.3 Box types

**Definition box** — one definition per box, definition first then examples, exact syllabus terminology, abbreviation in parentheses on first use:
```
> **Definitie: Variabele kosten (VK)**
> Kosten die veranderen als de productie toe- of afneemt.
> Voorbeelden: grondstoffen, energie, stukloon.
```

**Formula box** — group related formulas (max 3–4 per box), same variable names as syllabus:
```
> **Formule**
> TVK = GVK × Q
> TK = TCK + TVK
> GTK = TK / Q
```

**Misconception warning** — see §7.6 for format.

**Recall box** — backward reference when prerequisite skill is needed:
```
> **📋 Herhaling uit §X.Y.Z**
> De evenwichtsprijs vind je door Qv = Qa te stellen en op te lossen naar P.
```
Brief (1–3 lines), only if skill was taught more than one chapter ago.

### 10.4 Summary box rules

```
> **Samenvatting §X.Y.Z**
> - [Key insight 1]
> - [Key insight 2]
> - [Key formula]
> - [Connection to next paragraph]
```

- Maximum 5 bullet points
- Include key formula(s)
- End with forward pointer: "In de volgende paragraaf…"
- Must capture ALL key conceptual insights including nuances (piecewise functions, domain restrictions, special cases)
- Omitting a concept taught in body is a FLAG

### 10.5 Domain restrictions and ceteris paribus (MANDATORY)

**Domain restrictions belong with the formula:** When introducing a formula valid only in a restricted domain, the restriction must appear at the moment the formula is introduced, not in a later worked example or footnote.

```
> **Formule: Collectieve vraagfunctie (zolang beide kopen)**
> Q_coll = Q_A + Q_B = -5P + 18
> Geldig voor 0 ≤ P ≤ €3,50 (de prijs waarbij A afhaakt).
```

Add a one-sentence reminder: "Zodra één afhaakt, klopt deze formule niet meer en moet je opnieuw optellen."

**Ceteris paribus must be explicit when introducing curves:** Whenever a curve is introduced for the first time, the text MUST explicitly state that the curve holds while all other conditions are equal.

❌ "De vraaglijn laat zien hoeveel consumenten willen kopen bij verschillende prijzen."
✅ "De vraaglijn laat het verband zien tussen de prijs en de gevraagde hoeveelheid, **terwijl alle andere omstandigheden gelijk blijven**."

**Why:** Without ceteris paribus, the implied claim is "demand depends only on price". This sets up the shift-vs-movement misconception.

### 10.6 Visual summary for grouped concepts (MANDATORY)

When theory introduces N items (5 demand factors, 4 cost categories, 3 market structures), generate **one summary visual** showing all items in a single picture as a memory anchor.

Formats: radial/hub-and-spoke diagram, concept map, 2-column comparison schematic.

Place immediately after the introduction section, before the worked example. A bulleted list is text-only and misses the dual coding opportunity. Do NOT skip this even when items are described well in prose.

### 10.7 Direct rule labels inside overview figures (MANDATORY)

Overview/summary figures must include **direct rule annotations inside the figure**, not only in surrounding prose. Students re-scan figures during revision without re-reading paragraphs — rule labels embedded in the figure mean the rule is recoverable from the figure alone.

### 10.8 Supply curve rule

Supply lines always extend to the P-axis (y-axis), even when the y-intercept is negative. Supply lines never cross the Q-axis.

### 10.9 Numerical alignment between graph and text (MANDATORY)

When a graph illustrates a specific scenario, the numbers in the graph must match the numbers in the text exactly. Mismatched numbers force students to hold two parallel numerical contexts — pure extraneous cognitive load.

---

## PART 11: CONSOLIDATION & TEST DESIGN

### 11.1 The opgave as core unit

The consolidation unit is the **opgave**: one context, one source, 4–6 questions escalating in difficulty, weaving 2–5 skills. Mirrors VWO exam format.

| | Theory paragraph | Consolidation |
|---|---|---|
| Unit | Individual exercise | Opgave (4–6 linked questions) |
| Skills | One per paragraph | 2–5 woven into one context |
| Source material | None or minimal | Central |
| New theory | Yes | **Never** |
| Exam format | Not yet | Yes |
| Purpose | Master one skill | Apply multiple skills under realistic conditions |

### 11.2 Question type taxonomy (7 types)

Based on VWO exam analysis, in order of frequency:

| Type | Pattern | Frequency | Key rule |
|------|---------|-----------|----------|
| 1 | "Leg uit dat..." | ~35% | Student gets conclusion, must build reasoning chain toward it |
| 2 | "Bereken..." | ~20% | Never pure formula application; student must identify formula, extract numbers, multi-step |
| 3 | "Leg uit of..." | ~10% | Student first determines direction, then explains |
| 4 | "Is X een Y? Motiveer." | ~10% | Apply definition to context |
| 5 | "Teken / Arceer..." | ~7% | Draw curves or shade areas on provided graph |
| 6 | "Leg uit met behulp van [figuur/tabel]..." | ~10% | Forces explicit source material use |
| 7 | "Noem..." | ~5% | Simple recall. Use sparingly. |

### 11.3 Opgave question progression

| Position | Points | Bloom | Typical type |
|----------|--------|-------|-------------|
| Q1 | 1–2p | Begrijpen | "Is X een Y?" / simple "leg uit dat" |
| Q2 | 2p | Toepassen | "Bereken" / "Teken" |
| Q3 | 2p | Toepassen/Analyseren | Multi-step "bereken" / "leg uit dat" |
| Q4 | 2–3p | Analyseren | "Leg uit of" / "bereken + interpreteer" |
| Q5 | 2–4p | Analyseren | "Leg uit met behulp van" / complex calculation |
| Q6 | 2p | Evalueren | "Beoordeel of" / "Stel voor" (verdieping) |

### 11.4 Cross-topic integration

Start from the context, ask "what economic questions does this situation naturally raise?" — not "which skills do I need to test?"

**Skill coverage rule:** Every consolidation paragraph must practise **all skills from its chapter**. Map questions to paragraph skills before writing. If a skill is missing, add a question or adjust the context.

### 11.5 Source material design rules

- **Constructed, not clipped.** Fictional but realistic scenarios with precise embedded data.
- **Data embedded in context.** Numbers in text or tables/graphs.
- **Self-contained.** Source contains all needed information.
- **One world per opgave.** All questions reference the same context.
- **Language level.** VWO level. Exact syllabus terminology.

### 11.6 Test-specific rules

| Aspect | Consolidation paragraph | Test |
|--------|------------------------|------|
| Toetsmatrijs | No | Required |
| Point allocation | Optional | Required per sub-question |
| Opgaven | 1–2 | 2–4 |
| Time | ~50–60 min | 45 or 120 min strict |
| Scope | One chapter | Multiple chapters (120 min) |

First create toetsmatrijs (skills × Bloom level × points), then design opgaven to fill it. For 120-min tests, at least one cross-chapter opgave.

### 11.7 "Leg uit dat..." answer structure

Show the causal chain explicitly:
```
Als het eigen risico vervalt (gegeven),
gaan mensen eerder naar de huisarts (schakel 1).
Daardoor worden ziektes eerder ontdekt (schakel 2).
Zo kunnen de totale zorgkosten afnemen (conclusie = gegeven).
```
For 2p: 2 schakels between given start and given conclusion.

### 11.8 Graph use in consolidation

| Mode | What students do | Graph provided? |
|------|-----------------|----------------|
| Read | Extract values | Yes — complete |
| Identify | Name shaded area / intersection | Yes — with shading/labels |
| Modify | Add curves, shade areas, mark points | Yes — base graph only |
| Trace | Follow causal arrows in flow diagram | Yes — flow diagram |

**Never ask students to draw a complete graph from scratch** in consolidation exercises. That belongs in theory paragraph exercises.

---

## PART 12: QUALITY STANDARDS

### 12.1 Review protocol overview

Three sequential passes over every paragraph:

| Pass | Focus | Gate |
|------|-------|------|
| Pass 0 | Asset and file integrity | Any FAIL → STOP, paragraph incomplete |
| Pass 1 | Didactic architecture | FAILs must be fixed before delivery |
| Pass 2 | Mathematical/conceptual precision | FAILs must be fixed before delivery |

**Critical rule:** Reviews must be run by an independent sub-agent, NOT by the agent that built the paragraph. The builder has seen the content too many times and will rubber-stamp.

### 12.2 Didactic architecture checks (Pass 1)

**1.1 Opening and motivation:**
- Problem-first hook before any theory
- Connection to prior paragraphs
- Scope clarity (student knows what they'll learn and why)

**1.2 Theory scaffolding and sequencing:**
- One concept per step
- Progressive graph construction (never presented complete)
- Integrated annotations (labels adjacent to diagrams — no split attention)
- Multiple representations (verbal, graphical, tabular, algebraic)
- Method comparison side-by-side when two methods exist

**1.3 Dual coding and fading:**
- Full dual coding in theory (every key concept: text + visual)
- Colour consistency (same colours for same concepts throughout)
- Exercise fading sequence (full support → target + support → target + no support)
- Neutral fading labels (startoefeningen / zelfstandige / doeloefening)

**1.4 Misconception handling:**
- Explicit misconception box (wrong AND correct side by side)
- Misconception in exercises (at least one exercise surfaces it)
- Correct framing (explains WHY the error is tempting)

**1.5 Exercise design:**
- Target exercise alignment with blueprint
- Bloom progression (remember → calculate → explain → analyze → evaluate)
- Interleaving (≥2 exercises revisiting prior skills)
- Denkertje/bonus present
- Hints in early exercises
- Worked example before exercises

**1.6 Summary and navigation:**
- Summary present and complete (captures ALL key insights including nuances)
- Forward reference
- Worked example placement (before summary)
- Begeleide inoefening reference

### 12.3 Mathematical/conceptual precision checks (Pass 2)

**2.1 Graph accuracy:**
- Axis conventions (P vertical, Q horizontal, labeled with units)
- Slope directions (MOST COMMON ERROR: "steiler" when actually flatter — verify against axis orientation)
- Curve-point consistency (labeled points lie exactly on curves)
- Number consistency (text, graph, equations match exactly)
- Supply curve rule (extends to P-axis, never crosses Q-axis)
- Intercept labeling, visual clutter check, shift representation

**2.2 Algebraic precision:**
- Domain restrictions stated on first presentation
- Piecewise functions explicit with valid ranges
- Verification step (numerical check after derivation)
- Variable clarity (summed vs. held constant explicit)
- Function notation consistency (Q = f(P) throughout)

**2.3 Terminology and definitions:**
- Definition boxes for every new term, verified against syllabus
- Term consistency throughout (flag alternation without stating synonymy)
- Correct economic relationships (direction of effects)
- Horizontal vs. vertical addition correctly described

**2.4 Exercise answer verification:**
- Worked example correctness (rework independently)
- Exercise solvability (answerable with given info)
- Hint accuracy
- Answer key consistency

**2.5 Cross-paragraph consistency:**
- Prerequisite accuracy ("In §X leerde je Y" verified)
- Concept forward-compatibility
- Notation consistency
- Difficulty calibration vs. blueprint

### 12.4 Cross-paragraph consistency checks (chapter level)

Must be run by an INDEPENDENT sub-agent (not the builder):

| Check | What to look for |
|-------|-----------------|
| Notation consistency | Variable names used identically across paragraphs |
| Leerdoelen coverage | Every blueprint goal addressed in theory AND exercises |
| Figure numbering | Each paragraph restarts at 1; no skips |
| Forward/backward references | Forward pointer matches next paragraph; herhaling box accurate |
| Consolidation coverage | Consolidation references skills from ALL theory paragraphs |
| Context reuse | No exercise context reused across paragraphs (except deliberate continuation) |
| Colour consistency in graphs | Same colours for same concepts across paragraphs |

### 12.5 Common errors ranked by frequency

**High frequency:**
1. Slope language reversed (author thinks in coefficient, not visual angle)
2. Graph numbers don't match text numbers
3. Domain restriction missing on formulas
4. Split attention (graph on one page, explanation on another)
5. All exercises at the same Bloom level

**Medium frequency:**
6. Misconception stated but not confronted in exercises
7. Inconsistent variable naming
8. Summary omits key insight (especially piecewise functions, domain restrictions)
9. Interleaving exercises missing
10. Worked example after summary

**Lower frequency but high impact:**
11. Supply line crossing Q-axis
12. Causal direction error
13. Horizontal/vertical addition confusion
14. Figure reference pointing to wrong figure
15. Dual coding absent from theory section

### 12.6 Component-to-inspectie-standard mapping

| Component | Primary standard | What it proves |
|-----------|-----------------|----------------|
| Instapquiz | OP2 | School tracks prior knowledge before instruction |
| Voorkennis | OP2, OP3 | Materials address prerequisite gaps; differentiation |
| Nieuws-detective | OP1 | Curriculum connects to society; activation |
| Presentatie | OP3 | Clear explanation; explicit learning goals; dual coding |
| Uitleg vaardigheden | OP3 | Worked examples; self-study support; checkpoints |
| Begeleide inoefening | OP3, OP2 | Scaffolded practice; differentiation without labels |
| Redeneer-spel | OP3, OP2 | Sufficient practice; progress tracking |
| Wiskundevaardigheden | OP0, OP3 | Basisvaardigheid rekenen; separated cognitive load |
| Opgaven basis/midden | OP3, OR1 | Sufficient practice time; exam preparation |
| Opgaven verrijking | OP3 | Differentiation upward; higher Bloom levels |
| Samenvatting | OP3 | Consolidation; retrieval cues |

**Didactiek-to-standard mapping:**

| Didactiek principle | Inspectie standard | Criterion |
|--------------------|--------------------|-----------|
| Dual coding | OP3 | Duidelijke uitleg |
| Scaffolding + fading | OP3 | Afstemming op onderwijsbehoeften |
| Cognitieve belasting | OP3 | Duidelijke uitleg; afstemming |
| Positieve framing | SK1 | Stimulerend leerklimaat |
| Concept-context | OP1 | Voorbereiding op samenleving |
| Formatief evalueren | OP2 | Zicht op ontwikkeling |
| Retrieval practice | OP3 | Voldoende oefentijd |
| Worked examples | OP3 | Duidelijke uitleg |
| Bloom-opbouw | OP3 | Afstemming; monitoring |
| Differentiatie zonder labels | OP3 + SK1 | Afstemming + veiligheid |
| Expliciet lesdoel | OP3 | Lesdoel duidelijk |

---

## PART 13: RESEARCH EVIDENCE REGISTER

Key studies cited throughout this document, with effect sizes where available:

| Study | Finding | Effect size | Significance |
|-------|---------|-------------|--------------|
| Crissman (2006) | Worked examples vs. independent problem-solving | **0.52** | Best-known CLT effect |
| Hattie (meta-analysis) | Spaced practice | **0.71** | Among highest-impact strategies |
| Rohrer et al. (2020) RCT | Interleaved vs. blocked practice | **~0.30** (~30% boost) | One of most impactful changes |
| Cowan (2001) | Working memory capacity | ~4 chunks | Foundation for design limits |
| Cohn et al. (2001) | Graphs in lectures can worsen learning | Significant (negative) | Graphs must be taught, not shown |
| Ring & Oberrauch (2024) | Graph competence weaknesses (579 students) | — | y-axis comparison, curve interpretation |
| Nature H&SS Comm (2024) | Dual coding confirmed for economics | Positive | Domain-specific confirmation |
| Busom, Lopez-Mayan & Panadés | Standard instruction barely affects misconceptions | — | Confrontation strategies needed |
| Renkl & Atkinson (2003) | Backward fading outperforms forward fading | — | Foundation for fading strategy |
| Sweller (2016) | Redundancy effect harmful | — | Avoid text that repeats graph content |
| Claar & Finn (2011) | Students frustrated by tool+theory simultaneously | — | Separate instrument from theory |
| Velenchik (1995) | Problem-first approach | — | Theory without purpose = dry learning |
| Fizel & Johnson (1986) | Micro-first students 10–50% better | — | Micro before macro sequencing |
| Davies & Mangan | Threshold concepts in economics | — | Specific misconception targets |
| Roediger & Karpicke | Testing effect / retrieval practice | — | Practice tests > restudying |
| Van de Pol (2012) | ZNO scaffolding 4-step model | — | Diagnose-check-hulp-begripscheck |
| Tomlinson | Differentiation without labeling | — | Neutral framing, tiered questions |
| Colander (2016) | "Tools not rules" — nuance vs. clarity | — | Layered nuance approach |
| Schmidt, McKnight & Raizen (1997) | "Mile wide, inch deep" spiraling risk | — | Deepen at each revisit, don't just repeat |

### Additional sources referenced:
- Sweller — cognitive load theory (split-attention, worked examples, redundancy, expertise reversal)
- Paivio — dual coding theory
- Mayer — multimedia learning principles (segmenting principle)
- Bruner — spiral curriculum
- Vygotsky — Zone of Nearest Development
- Dutch Onderwijsinspectie — onderzoekskader 2021, bijgesteld 2025 (OP0–OP3, SK1, OR1, SKA, BKA)

---

## APPENDIX A: CONSOLIDATED DECISION RULES

When designing any material, apply these rules:

1. **Differentieer bewust** → maak materiaal voor extra ondersteuning, standaard én extra uitdaging
2. **Eén concept per eenheid** → cognitieve belasting laag houden
3. **Van concreet naar abstract** → eerst context, dan formule (behalve bij verdieping)
4. **Problem-first** → begin met een motiverend probleem, niet met theorie
5. **Scaffolding alleen waar nodig** → begeleide inoefening is voor wie het nodig heeft
6. **Verdieping ≠ meer van hetzelfde** → hogere Bloom-niveaus, niet meer rekenwerk
7. **Positieve framing** → "begeleide inoefening" en "verdieping", geen negatieve labels
8. **Fading** → veel hulp bij oefening 1, geen hulp bij de laatste oefening
9. **Uitleg bij antwoorden** → niet alleen WAT maar WAAROM
10. **Interleave** → mix oefentypen, herhaal eerder geleerde vaardigheden
11. **Confronteer misconcepties** → predict-observe-explain, niet alleen correct presenteren
12. **Visuele consistentie** → zelfde kleuren, fonts en componenten in alle documenten
13. **Unified procedures** → zelfde stappen in uitleg, antwoordmodel en alle materialen
14. **Domain restrictions met formule** → geldigheidsdomein vermelden bij introductie
15. **Ceteris paribus expliciet** → bij elke eerste introductie van een curve
16. **Concept precision** → meest specifieke economische categorie kiezen, niet "voorkeuren" als terugval
17. **Triple coding** → grafiek + tekst + tabel bij numerieke concepten
18. **Combined-change exercise** → bij elke key distinction minstens één opgave met twee gelijktijdige veranderingen
19. **Gender-evenwichtige voorbeelden** → bewust variëren in rollen en contexten (zie Appendix C)

---

## APPENDIX B: NEVER DO (consolidated prohibitions)

### Content and pedagogical prohibitions

- Materiaal labelen als "makkelijk", "basis", of "voor zwakke leerlingen"
- Materiaal labelen als "moeilijk" of "voor slimme leerlingen"
- Scaffolding standaard in alle materialen stoppen (alleen in begeleide inoefening)
- Denkstappen, hints of formulekaarten in verdiepingsmateriaal
- Scaffolding zonder fading-strategie (wordt een kruk)
- Verdieping als "meer van hetzelfde" (langere sommen, meer deelvragen)
- Antwoorden geven zonder uitleg
- Theorie uitleggen zonder concreet voorbeeld
- Grafieken introduceren zonder eerst de onderdelen apart te oefenen
- Een redeneerketen laten oefenen zonder eerst het model voor te doen
- Verdiepingsopdrachten achter slot en grendel — ze moeten voor iedereen beschikbaar zijn
- Een afgewerkte grafiek tonen zonder stap-voor-stap opbouw
- Modellen presenteren als werkelijkheid in plaats van als analytisch gereedschap
- Alleen correcte informatie presenteren en verwachten dat misconcepties verdwijnen

### Graph and mathematical prohibitions

- Slope direction claims backwards relative to axis orientation
- Numbers in text that don't match graph numbers
- Formula presented without domain restriction when domain matters
- Exercise unsolvable with given information
- Misconception box that itself contains an error
- Supply line crossing Q-axis
- Causal direction error (confusing which way causation runs)
- Horizontal/vertical addition confusion without clarification
- Figure reference pointing to wrong figure
- Dual coding absent from theory section (text-only explanation of visual concept)

### Quality and review prohibitions

- Declaring paragraph "complete" without verifying all referenced files exist
- Builder running their own QC review (must be independent sub-agent)
- Asset verification as suggestion rather than hard gate
- Skipping Pass 2 because Pass 1 looks good — precision errors in well-scaffolded paragraphs are MORE damaging
- Assuming graphs are correct without checking coordinates against equations
- Accepting "steiler/vlakker" claims without verifying against axis orientation
- Letting a formula pass without checking domain restriction
- Reviewing exercises without solving them yourself
- Approving a paragraph where the worked example has a calculation error
- Ignoring unexplained visual elements in graphs — if you can't explain what it teaches, it's clutter
- Treating FLAG items as unimportant — they accumulate and degrade quality
- Summary omitting key insight taught in body (especially domain restrictions, piecewise functions, special cases)
- Worked example after summary (breaks reading flow)

---

## APPENDIX C: BIAS AWARENESS IN EXAMPLES

Stevenson and Zlotnick's study of seven leading introductory economics textbooks found that **77% of people mentioned are male**, only **6% of business leaders referenced are female**, and women in fictional examples are disproportionately placed in domestic or consumer roles while men handle analysis and decision-making.

**Rule:** Deliberately craft examples representing the world students are entering, not the world of the past. Vary gender, cultural background, and roles in fictional contexts. Ensure women appear as entrepreneurs, analysts, and decision-makers, not only as consumers or household managers.

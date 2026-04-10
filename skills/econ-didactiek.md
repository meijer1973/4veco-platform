---
name: econ-didactiek
description: "Didactic decision-making skill for economics education (bovenbouw vwo/havo). Provides principles and decision rules for differentiation (both scaffolding and extra challenge), cognitive load management, question design, lesson flow, and assessment — applied specifically to economics topics like markten, monopolie, internationale handel, and macro-economie. Use this skill whenever making pedagogical choices about lesson materials: which differentiation level to apply, how to frame exercises positively, how to design challenge materials for strong students, how to order content for optimal learning, and how to connect Bloom's taxonomy to economics question types. Trigger when the user mentions didactiek, scaffolding, differentiatie, begeleide inoefening, verdieping, extra uitdaging, cognitieve belasting, toetsmatrijs, leerlijnen, werkvormen, formatief toetsen, or any pedagogical discussion about economics materials. Also trigger for discussions about how to structure a lesson, which order to teach concepts, how to support struggling students without stigma, or how to challenge advanced students."
---

# Economics Didactics Skill v2

Didactic principles and decision rules for creating effective economics lesson materials. This skill works at a higher level than the format-specific skills (econ-word-templates, econ-pptx-templates, economic-graph) — it guides the *pedagogical choices* that determine what goes into those formats.

**When to use this skill:**
- Deciding how to differentiate for a specific group or student
- Choosing between scaffolding (extra ondersteuning) and enrichment (extra uitdaging)
- Designing materials that serve the full range of the classroom
- Ordering concepts for optimal learning progression
- Making assessment decisions (formative/summative, question types)
- Any pedagogical discussion about economics materials

**Companion skills (for execution):**
- `econ-word-templates` → produces the Word documents
- `econ-pptx-templates` → produces the PowerPoint slides
- `economic-graph` → produces graphs, flow diagrams, and lesson design rules

---

## PART 1: DIFFERENTIATION AS A STARTING POINT

### 1.1 The differentiation spectrum

Students in a vwo class vary widely in prior knowledge, working pace, and ability to think abstractly. Effective materials serve the entire spectrum — not just the middle group.

```
Extra support ◄────────── Standard ──────────► Extra challenge

  Begeleide               Regular                Verdieping &
  inoefening              exercise set           enrichment
  
  Thinking steps          Exercises as           Open-ended assignments
  Hints                   they appear in         Model extensions
  Formula cards           the textbook,          Find your own context
  Fill-in formats         without extra          Critical evaluation
  Worked-out answers      help or challenge      Transfer to another domain
```

**Core principle:** we create materials at three levels, but we never label them by difficulty. The framing is always positive and neutral.

| Level | Material | How it is framed to students |
|-------|----------|------------------------------|
| Extra support | Begeleide inoefening (with thinking steps, hints, formulas) | "Oefenen met denkstappen" |
| Standard | Regular exercise set (no extra scaffolding or challenge) | The default approach |
| Extra challenge | Verdieping assignments (open, evaluative, transfer questions) | "Verdieping" or "Denkertje" |

### 1.2 When to use which level?

**Extra support (scaffolding) is intended for students who:**
- Get stuck when structuring their approach
- Know the formulas but do not know which one to apply
- Understand the concept but cannot apply it independently
- Benefit from explicit intermediate steps

**Standard is intended for students who:**
- Have followed the lesson and can work independently
- Occasionally make mistakes but can self-correct
- Do not need extra help but also do not ask for more

**Extra challenge is intended for students who:**
- Finish the standard exercises quickly and correctly
- Need more depth or breadth
- Benefit from higher Bloom levels (analyse, evaluate, create)
- Are ready to apply knowledge in unfamiliar contexts

### 1.3 Design rules per level

**Extra support — scaffolding material:**
- Provide thinking steps, hints, formula reminders, fill-in formats
- Work out answers extensively with explanations (the "why")
- Fade scaffolding across exercises (fading)
- Use the begeleide inoefening template from econ-word-templates

**Standard — regular material:**
- Present the exercises as-is, without extra intermediate steps
- Do not add scaffolding elements (no thinking-step boxes, no hints)
- The standard answer key suffices
- This is the base product every student receives

**Extra challenge — verdieping material:**
- Pose open questions that require evaluation or creation
- Have students extend or critique a model
- Ask for transfer: apply the concept in an unfamiliar context
- Do NOT provide intermediate steps, hints, or formula cards — strong students do not need them, and they slow down the thinking process
- Optionally: let students design their own exercises

### 1.4 What does NOT belong in verdieping material

It is tempting to make verdieping material "just harder" by adding longer calculations or more sub-questions. That is not enrichment — that is more of the same.

| Not real enrichment | Real enrichment |
|---------------------|-----------------|
| More computation (longer numbers) | Critiquing a model ("When does MR = MC not hold?") |
| More sub-questions on the same skill | Transfer to a new market/context |
| The same calculation with different numbers | Writing and defending a policy proposal |
| Extra steps in a chain | Comparing two models (e.g. Cournot vs Bertrand) |
| Memorising harder formulas | Designing or extending a model yourself |

---

## PART 2: DIDACTIC PRINCIPLES

### 2.1 Scaffolding (Vygotsky → Wood → Van de Pol)

Scaffolding is temporary support that is gradually withdrawn as students become more competent. It operates within the Zone of Proximal Development: just above what the student can do independently, but reachable with help.

**Important:** scaffolding is specifically intended for students who need extra support. It is not the default for all students — for students who already master the material, scaffolding actually slows them down rather than helping.

**The four-step model (Van de Pol, 2012):**

| Step | Action | Example prompts |
|------|--------|-----------------|
| 1. Diagnosis | Identify where the student gets stuck | "What have you done so far?" / "Where does it go wrong?" |
| 2. Check | Verify your interpretation is correct | "So you don't know how to derive MR?" |
| 3. Help | Provide tailored support | Ask a question / give a hint / explain / provide a tool |
| 4. Comprehension check | Verify the student understands | "Can you explain it in your own words now?" |

**Two forms:**
- **Planned** → built into the material (thinking steps, hints, formula cards, partially completed answers). Only in begeleide inoefening, not in standard material.
- **Interactive** → spontaneous during classroom dialogue (follow-up questions, rephrasing, thinking aloud). Can be used for any student, including strong ones.

### 2.2 Cognitive load (Sweller)

Students can only process a limited amount of new information at once. In economics this is especially relevant because many exercises simultaneously require a model/instrument (graph, formula) AND the economic theory behind it.

**Three types of load:**

| Type | What | What to do about it |
|------|------|---------------------|
| Intrinsic | Complexity of the material itself | Cannot be avoided, but can be split up |
| Extraneous | Load caused by poor design | Minimise: clear language, logical structure, no distractions |
| Germane | Load that leads to learning | Maximise: making connections, examples, practice |

**Practical rules of thumb:**
1. Teach the instrument (drawing a graph) SEPARATELY from the theory (why MR = MC)
2. Provide worked examples for new skills — but only for students who need them. For advanced students, worked examples actually backfire (expertise reversal effect).
3. Only increase complexity once the foundation is solid
4. Combine text and image (dual coding) — not text OR image, but both together

### 2.3 Dual Coding (Paivio/Mayer)

Information is remembered better when it enters through two channels: verbal (text/speech) and visual (image/diagram/colour). This applies to all levels.

**Application in our materials:**
- Domain colour coding (blue/amber/green) → visual recognition without reading
- Graphs alongside textual explanation → two paths to the same concept
- Flow diagrams for reasoning chains → visual structure for causal logic
- Formula boxes in monospace → visual distinction from running text

### 2.4 Positive framing

**Core rule: never use labels that reinforce a negative self-image.**

| Do not use | Use instead |
|------------|-------------|
| "Makkelijke versie" (easy version) | "Begeleide inoefening" |
| "Basisniveau" (basic level) | "Stap-voor-stap werkblad" |
| "Hulp bij moeite" (help for struggling) | "Oefenen met denkstappen" |
| "Versimpeld" (simplified) | "Overzicht met formulekaart" |
| "Zwakke leerlingen" (weak students) | "Leerlingen die baat hebben bij extra structuur" (students who benefit from extra structure) |
| "Moeilijke versie" (hard version) | "Verdieping" |
| "Voor de slimme leerlingen" (for the smart students) | "Denkertje" or "Bonusopgave" |

**Rationale:** by framing materials neutrally you prevent students from feeling labelled — in either direction. A student who picks up the begeleide inoefening should not feel "stupid"; a student who skips the verdieping should not feel "lazy".

---

## PART 3: SCAFFOLDING LEVELS (for begeleide inoefening)

This part applies exclusively when creating material for students who need extra support. For standard and verdieping material: skip this section.

### 3.1 The scaffolding spectrum

| Level | Name | What the student receives | When |
|-------|------|--------------------------|------|
| 0 | No scaffolding | Only the question | Standard exercise set (not in begeleide inoefening) |
| 1 | Light hint | One sentence pointing in the right direction | Student knows the concept but lacks an entry point |
| 2 | Thinking steps | Numbered steps as a guide | Student knows the material but cannot structure it |
| 3 | Formula reminder | Relevant formulas alongside the question | Student forgets which formula is needed |
| 4 | Fill-in format | Partially completed answer | Student knows the steps but makes calculation errors |
| 5 | Fully worked out | Answer + explanation of why | Reference, self-study, resit |

**The begeleide inoefening combines levels 1-4.** The answer document adds level 5.

### 3.2 Fading strategy

Fade scaffolding across exercises:

```
Exercise 1-2:  Full scaffolding (thinking steps + formulas + hints + fill-in format)
Exercise 3-4:  Reduced (hints + formula card, no more thinking steps)
Exercise 5-6:  Minimal (only a brief hint)
Exercise 7-8:  No scaffolding (independent)
```

**Signal for fading:** if exercise 3 requires the same skill as exercise 2 (but in a different context), it is time to remove the thinking steps.

### 3.3 Decision tree: which scaffold for which question?

```
Question type = calculation?
  |-- Yes → formula reminder + fill-in format + thinking steps
  +-- No → 
      Question type = reasoning/explanation?
        |-- Yes → thinking steps + hint
        +-- No →
            Question type = draw a graph?
              |-- Yes → thinking steps (drawing plan) + example coordinates
              +-- No →
                  Question type = concept/definition?
                    |-- Yes → hint (reference to the concept)
                    +-- No → no scaffold needed
```

---

## PART 4: TAXONOMY AND QUESTION DESIGN

### 4.1 Bloom's taxonomy for economics

| Bloom level | Economics example | Signal words in the question | Suitable for |
|-------------|-------------------|------------------------------|--------------|
| Remember | "Name the four market structures" | name, list, define | All levels |
| Understand | "Explain why MR = MC maximises profit" | explain, describe, indicate why | All levels |
| Apply | "Calculate the equilibrium price" | calculate, draw, derive | All levels |
| Analyse | "Compare welfare before and after the tax" | compare, analyse, distinguish | Standard + verdieping |
| Evaluate | "Assess whether price discrimination increases welfare" | assess, argue whether, is it justified that | Verdieping |
| Create | "Propose a policy measure" | devise, design, propose | Verdieping |

**Differentiation through Bloom:** the standard exercises mainly operate at remember/understand/apply. The verdieping pushes through to analyse/evaluate/create.

### 4.2 Question structure per document type

**News assignment (7 questions, increasing difficulty):**
```
1. Fill-in (remember)        → "De prijs is gestegen/gedaald"
2. Fill-in (understand)      → "Hierdoor neemt de vraag toe/af"
3. Name question (remember)  → "Noem twee voordelen van..."
4. Calculation (apply)       → One step, concrete numbers from the article
5. Diagram question (analyse)→ Refer to the visual on page 1
6. Concept question (understand) → Connect an economic concept to the news
7. Open question (evaluate)  → "Welke maatregel zou jij voorstellen?"
```

**Begeleide inoefening (follows the structure of the original exercises):**
- Preserve the original question wording
- Add scaffolding based on the decision tree (Part 3.3)
- Make answers more elaborate than the original answer key
- Add explanation boxes that clarify the "why"

**Verdieping assignments:**
- Pose open questions at Bloom level analyse/evaluate/create
- Provide context but no intermediate steps or hints
- Ask for justification, comparison, or design
- One verdieping assignment per paragraph is sufficient

**Test (summative):**
- Cover all learning objectives (create a toetsmatrijs)
- Mix Bloom levels: ~30% remember/understand, ~40% apply, ~30% analyse/evaluate
- One open question (evaluate/create)
- Total: 5-7 exercises, 80-120 minutes

### 4.3 Toetsmatrijs template

| Learning objective | Exercise | Bloom level | Points | % |
|--------------------|----------|-------------|--------|---|
| Apply MR = MC | 1b | Apply | 8 | 10% |
| Calculate CS | 2a | Apply | 6 | 7.5% |
| ... | ... | ... | ... | ... |
| **Total** | | | **80** | **100%** |

**Check:** every learning objective tested at least once. No learning objective exceeds 25% of the points.

---

## PART 5: ECONOMICS-SPECIFIC DIDACTICS

### 5.1 Concept-context approach

The vwo curriculum works with concepts (exchange, cooperation) that are applied in various contexts. The approach differs by level:

**For students who need extra support — from concrete to abstract:**
1. Start with a recognisable context (supermarket prices, Spotify subscription)
2. Introduce the economic concept (monopoly, price discrimination)
3. Formalise with formulas and graphs
4. Apply within the same context

**For standard — from concrete to abstract with transfer:**
1. Start with a recognisable context
2. Introduce the concept and formalise
3. Apply in a new, comparable context

**For students seeking extra challenge — from abstract to concrete:**
1. Introduce the model directly (MR = MC)
2. Work through a brief example
3. Have the student find a suitable context themselves
4. Have the student extend or critique the model

### 5.2 Causality chains

Economic reasoning often consists of chains of cause and effect. The scaffolding differs by level:

| Phase | Level | Support |
|-------|-------|---------|
| Modelling | Extra support | Teacher builds the chain aloud, student follows along |
| Guided completion | Extra support | Chain with blank slots the student fills in |
| Independent construction | Standard | Student builds the entire chain themselves, only beginning and end given |
| Transfer | Standard + verdieping | Student applies the same chain structure in a new context |
| Critical evaluation | Verdieping | Student critiques the chain: which links are assumptions? When does the chain break down? |

**Example of fading in chains:**
```
Extra support:  oil price up → [production costs up] → supply down → [price up]
Standard:       minimum wage up → [___] → [___] → [___]
Verdieping:     "The ECB lowers the interest rate. Build a chain of at least 5 links
                 and indicate which links are uncertain."
```

### 5.3 Graph skills

Graphs are the most important instrument in economics, but also the biggest source of frustration. Build graph skills in layers:

| Layer | Skill | Extra support | Standard | Verdieping |
|-------|-------|---------------|----------|------------|
| 1. Reading | "What is the price at Q = 20?" | Graph + arrow pointing to the spot | Only the question | — |
| 2. Shifting | "Draw the new demand curve" | Direction hint + original curve | Only the question | — |
| 3. Drawing | "Draw D, S, MR, and MC" | Coordinate table + sequence | Only formulas | — |
| 4. Interpreting | "What does the shaded area represent?" | Legend with areas | Only the question | — |
| 5. Reasoning | "What happens to CS with a tax?" | — | Only the question | "Compare two scenarios and evaluate the welfare effect" |

### 5.4 Common mistakes per topic

Build these in as warning boxes (warningBox) in material for extra support. In standard material: mention them briefly. In verdieping material: let students discover them on their own.

**Market equilibrium:**
- Confusing a shift OF versus a movement ALONG the demand curve
- Forgetting that the ceteris paribus condition applies

**Monopoly:**
- Reading the price off the MR curve instead of the demand curve
- Profit = TR instead of profit = TR - TC
- Drawing the MR curve through the origin (with a linear demand curve, MR starts at the same y-intercept as D)

**Price discrimination:**
- Forgetting to name the two conditions (segmentation + no resale)
- Arguing that price discrimination is always bad for consumers

**International trade:**
- Confusing absolute advantage with comparative advantage
- Forgetting that both countries benefit from trade (not only the "cheaper" one)

---

## PART 6: DIFFERENTIATION STRATEGIES IN PRACTICE

### 6.1 Differentiating without labelling

| Strategy | How | Framing |
|----------|-----|---------|
| Choice assignments | Student chooses which exercise to do | "Kies 3 van de 5 opgaven" (Choose 3 out of 5) |
| Begeleide inoefening | Document with scaffolding, alongside the regular set | "Oefenen met denkstappen" |
| Verdieping assignment | Open question for fast students | "Denkertje" or "Bonusopgave" |
| Formula card | Formula overview, available for anyone who wants it | "Naslagblad" (reference sheet) |
| Peer feedback | Students help each other | "Controleer elkaars werk" (check each other's work) |
| Expert assignment | Strong student explains it to someone else | "Leg uit aan je buurman hoe je dit aanpakt" (explain to your neighbour how you approach this) |

### 6.2 Timing of differentiation within the lesson

```
+---------------------------------------------+
| BEFORE the lesson                            |
| Extra support: prior-knowledge document      |
| Extra challenge: advance reading / pre-work  |
+---------------------------------------------+
| DURING the lesson                            |
| Everyone: presentation + standard explanation|
| Extra support: begeleide inoefening          |
| Extra challenge: verdieping assignment       |
+---------------------------------------------+
| AFTER the lesson                             |
| Extra support: answer document               |
| Standard: review the skills document         |
| Extra challenge: work out their own context  |
+---------------------------------------------+
```

---

## PART 7: FORMATIVE ASSESSMENT

### 7.1 Check-in moments

Build checkpoints into the material:

| Moment | Instrument | Example |
|--------|------------|---------|
| Start of lesson | Entry question | "Write down in one sentence what you still remember from last lesson" |
| After theory | Comprehension check | CheckBox in presentation: "Can you say in your own words what MR = MC means?" |
| After exercise | Self-check | "Compare your answer with the answer key" |
| End of lesson | Exit ticket | "Write down one thing you can do now that you could not do at the start" |

### 7.2 Signals for adjustment

| Signal | Possible cause | Action |
|--------|----------------|--------|
| Many students stop at the same question | Too large a jump in difficulty | Add an intermediate question |
| Students use the wrong formula | Formula reminder is missing | Make a formula card available |
| Students make calculation errors but understand the concept | Insufficient mathematical prior knowledge | Deploy a prior-knowledge document |
| Students copy answers without understanding | Answers too easily accessible | Share answers only after the lesson |
| Fast students finish and sit idle | No verdieping material available | Have a verdieping assignment ready |

---

## PART 8: DECISION RULES SUMMARISED

### When designing any material:

1. **Differentiate deliberately** → create material for extra support, standard, AND extra challenge
2. **One concept per slide/section** → keep cognitive load low
3. **From concrete to abstract** → context first, then formula (except for verdieping)
4. **Scaffolding only where needed** → begeleide inoefening is for those who need it, not for everyone
5. **Verdieping is not "more of the same"** → higher Bloom levels, not more computation
6. **Positive framing** → "begeleide inoefening" and "verdieping", no negative labels
7. **Fading across exercises** → lots of help at exercise 1, no help at exercise 8
8. **Explain in answers** → not only WHAT the answer is, but WHY
9. **Build in formative assessment** → checkpoints that inform both student and teacher
10. **Visual consistency** → same colours, fonts, and components across all documents

---

## NEVER DO

- Label material as "easy", "basic", or "for weak students"
- Label material as "hard" or "for smart students"
- Include scaffolding by default in all materials (it belongs only in begeleide inoefening)
- Add thinking steps, hints, or formula cards to verdieping material (they do not belong there)
- Offer scaffolding without a fading strategy (then it becomes a crutch)
- Design verdieping as "more of the same" (longer calculations, more sub-questions)
- Provide answers without explanations (then students only learn the answer, not the reasoning)
- Explain theory without a concrete example
- Introduce graphs without first practising the components separately
- More than 7 learning objectives per lesson (cognitive overload)
- Create a test without a toetsmatrijs (then you are testing at random)
- Have students practise a reasoning chain without first modelling it
- Create a presentation without speaker notes (the explanation is just as important as the slides)
- Lock verdieping assignments behind a gate — they must be available to everyone

---

Apply this skill to the following task: $ARGUMENTS

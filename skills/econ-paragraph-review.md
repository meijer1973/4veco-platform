---
name: econ-paragraph-review
description: "Comprehensive review skill for economics textbook paragraphs (bovenbouw vwo/havo). Combines two review dimensions: (1) didactic architecture — dual coding, fading, scaffolding, exercise progression, cognitive load, misconception handling, and (2) mathematical/conceptual precision — slope directions, domain restrictions, graph accuracy, formula validity, terminology consistency. Use this skill whenever reviewing, auditing, or giving feedback on a draft textbook paragraph, exercise set, or lesson material. Trigger when the user uploads a paragraph PDF, asks for a review, mentions 'check this paragraph', 'review', 'audit', 'feedback', 'what can be improved', or any quality assurance discussion about lesson content. Also trigger when comparing output against the course blueprint."
---

# Economics Paragraph Review Skill v1

A systematic review protocol for economics textbook paragraphs at bovenbouw vwo/havo level. This skill runs two complementary passes over every paragraph:

**Pass 1 — Didactic architecture**: Is the paragraph well-designed for learning? Does it scaffold properly, use dual coding, fade visual support, handle misconceptions, and connect to prior knowledge?

**Pass 2 — Mathematical and conceptual precision**: Is every claim, graph, formula, slope direction, domain restriction, and terminology choice technically correct?

Both passes matter equally. A beautifully scaffolded paragraph with a slope error teaches the wrong thing effectively. A mathematically flawless paragraph with poor scaffolding teaches the right thing ineffectively.

**When to use this skill:**
- Reviewing any draft paragraph before delivery
- Comparing a paragraph against the course blueprint
- Giving structured feedback to a content author (human or AI)
- Quality assurance before PDF/docx export

**Companion skills:**
- `econ-didactiek` → the underlying pedagogical principles
- `economic-graph` → graph construction standards and QA checklist
- `econ-word-templates` → document format QA checklist

---

## REVIEW PROTOCOL

Run all passes sequentially: Pass 0 first, then Pass 1, then Pass 2. For each check, note PASS, FLAG (minor issue), or FAIL (must fix). Deliver results organized by pass, not interleaved.

**Independent review requirement:** This review MUST be run by a separate sub-agent, NOT by the agent that built the paragraph. The builder has seen the content too many times and will rubber-stamp. See `BUILD-PARAGRAPH.md` Phase 5b.

**Output:** Save the review report as `X.Y.Z-review.md` in the paragraph folder (e.g., `1.3.2-review.md`). This file is a QC artifact required by the chapter builder's completeness gate.

---

## PASS 0: ASSET AND FILE INTEGRITY

This is a 1-minute pre-flight check. If Pass 0 has any FAIL items, **STOP** — do not proceed to Pass 1 or Pass 2. The paragraph is incomplete, not ready for review.

| Check | What to look for |
|-------|-----------------|
| 0.1 All image refs resolve | Extract every `![...](...)` reference from all `.md` files in the paragraph folder. For each reference, verify the file exists in `_assets/`. **FAIL** if any referenced file is missing. List all missing files. |
| 0.2 SVG/PNG pairs complete | Every `.svg` file in `_assets/` has a matching `.png` with the same base name, and vice versa. **FAIL** if any are unpaired. |
| 0.3 Asset naming convention | All files in `_assets/` follow the pattern `X.Y.Z_{type}_{number}.{ext}` where type is `fig`, `ex`, or `we`. **FLAG** any deviations. |
| 0.4 No orphaned assets | Every file in `_assets/` is referenced in at least one `.md` file. **FLAG** any orphaned assets (files that exist but are never referenced). |
| 0.5 Required output files | The expected `.md` files exist per `econ-textbook-paragraph` §1.2 (paragraaf.md, opgaven.md, antwoorden.md). **FAIL** if any are missing. |

**Pass 0 result:** If any FAIL → return the report immediately. The builder must fix asset issues before content review is meaningful.

---

## PASS 1: DIDACTIC ARCHITECTURE

### 1.1 Opening and motivation

| Check | What to look for |
|-------|-----------------|
| 1.1.1 Problem-first hook | Does the paragraph open with a concrete, recognizable situation before any theory? The hook should create a question in the student's mind that the theory section answers. A definition or abstract statement as the first element is a FAIL. |
| 1.1.2 Connection to prior paragraphs | Is there an explicit reference to what the student already knows (e.g., "In §1.2.1 leerde je...")? A herhaling box or brief recall of the prerequisite concept should appear before new content. |
| 1.1.3 Scope clarity | Can a student tell within the first half-page what they will learn and why it matters? The motivation should make the learning goal feel necessary, not arbitrary. |

### 1.2 Theory section — scaffolding and sequencing

| Check | What to look for |
|-------|-----------------|
| 1.2.1 One concept per step | Does the theory section introduce concepts one at a time, with each building on the previous? Flag if two new concepts are introduced simultaneously without separation. |
| 1.2.2 Progressive graph construction | For graphical topics: are graphs built step-by-step (simple → add element → add element) rather than presented complete? Each graph should add exactly one new element to the previous one. |
| 1.2.3 Integrated annotations | Are explanatory labels, calculation steps, or verbal descriptions embedded directly inside or immediately adjacent to graphs? Text that explains a graph but appears on a different page or far from the graph is a FAIL (split-attention effect). |
| 1.2.4 Multiple representations | Is the same concept shown in at least two of: verbal, graphical, tabular, algebraic? Topics that are inherently multi-representational (like horizontal addition) should use at least three. |
| 1.2.5 Method comparison | When two methods exist (e.g., table vs. algebra), are they compared side-by-side so students see equivalence rather than learning two disconnected procedures? |

### 1.3 Dual coding and fading

| Check | What to look for |
|-------|-----------------|
| 1.3.1 Full dual coding in theory | During the theory/explanation phase, is every key concept supported by both text AND a visual (graph, diagram, table, schematic)? Pure text explanations of graphical concepts are a FLAG. |
| 1.3.2 Color consistency | Are the same colors used for the same concepts throughout the paragraph? (e.g., demand always blue, supply always green, collective always purple). Color inconsistency across figures is a FLAG. |
| 1.3.3 Exercise fading sequence | Do exercises progress through the three fading stages: (a) simple + full visual support → (b) target difficulty + visual support → (c) target difficulty + no visual support? Check that the final exercises (doeloefening) require students to produce their own graphs/tables rather than reading provided ones. |
| 1.3.4 Fading labels | Are exercise tiers labeled neutrally (e.g., startoefeningen / zelfstandige oefening / doeloefening) rather than by difficulty (makkelijk / moeilijk) or ability (basis / verdieping)? Labels that could stigmatize are a FLAG. |

### 1.4 Misconception handling

| Check | What to look for |
|-------|-----------------|
| 1.4.1 Explicit misconception box | Does the paragraph contain at least one "Let op" or warning box that names a specific common error students make? The box should state both the wrong approach AND the correct approach side by side. |
| 1.4.2 Misconception in exercises | Is at least one exercise designed to surface or confront the misconception? (e.g., a question where the naive approach gives the wrong answer, forcing the student to apply the correct method). |
| 1.4.3 Correct framing | Does the misconception box explain WHY the error is tempting (not just that it's wrong)? Students need to understand the source of the confusion, not just be told "don't do this." |

### 1.5 Exercise design

| Check | What to look for |
|-------|-----------------|
| 1.5.1 Target exercise alignment | Does the doeloefening (final exercise) match the target exercise from the course blueprint for this paragraph? It should require the same skills at the same level. |
| 1.5.2 Bloom progression | Do exercises escalate through Bloom levels: remember/identify → calculate/apply → explain → analyze → evaluate? Flag if all exercises are at the same cognitive level. |
| 1.5.3 Interleaving | Are there at least 2 exercises that revisit skills from previous paragraphs (herhaling/interleaving)? These should be clearly labeled and come after the current-paragraph exercises. |
| 1.5.4 Denkertje/bonus | Is there an open-ended extension question (denkertje) that invites evaluation or creative application? This should be explicitly optional. |
| 1.5.5 Hints in early exercises | Do startoefeningen include hints that scaffold without giving away the answer? Hints should reference the worked example or a specific step, not state the answer method directly. |
| 1.5.6 Worked example before exercises | Is there at least one fully worked example between the theory section and the exercise section? The worked example should demonstrate the complete procedure the student will use in exercises. |

### 1.6 Summary and navigation

| Check | What to look for |
|-------|-----------------|
| 1.6.1 Summary present | Does the paragraph end with a summary box listing the key concepts and rules? |
| 1.6.2 Summary completeness | Does the summary capture ALL key conceptual insights from the paragraph, including nuances like piecewise functions, domain restrictions, or special cases? If a concept is taught in the body but absent from the summary, FLAG it. |
| 1.6.3 Forward reference | Does the summary or final sentence indicate what comes next (e.g., "In §1.2.4 oefenen we...")? This helps students orient within the book structure. |
| 1.6.4 Worked example placement | Does the worked example appear BEFORE the summary? If the summary appears before the worked example, the reading flow is broken — FLAG. |
| 1.6.5 Begeleide inoefening reference | Is there a reference to additional scaffolded practice (e.g., website, begeleide inoefening document) for students who need more support? |

---

## PASS 2: MATHEMATICAL AND CONCEPTUAL PRECISION

### 2.1 Graph accuracy

| Check | What to look for |
|-------|-----------------|
| 2.1.1 Axis conventions | Is P (price) always on the vertical axis and Q (quantity) on the horizontal axis? Are axes labeled with both the variable name and units (e.g., "Prijs (€)" and "Hoeveelheid (Q)")? |
| 2.1.2 Slope directions | For every claim about a curve being "steiler" or "vlakker": verify against the axis orientation. With P on y-axis and Q on x-axis, a curve that is more responsive (larger ΔQ for a given ΔP) is FLATTER, not steeper. This is the most common technical error in economics textbooks. |
| 2.1.3 Curve-point consistency | Do ALL labeled points on a graph lie exactly on the curves they claim to be on? Pick any labeled point, substitute into the equation, and verify. |
| 2.1.4 Number consistency | Are the numbers in the text, in the graph, and in the equations the same? Flag if the text says "P = €2, Q = 1000" but the graph shows different values. (This was an issue in §1.2.2 where the text described €2→€3 but the graph showed P₁=30, P₂=20.) |
| 2.1.5 Supply curve rule | Do all supply lines extend to the P-axis (y-axis), even when the y-intercept is negative? Supply lines must never cross the Q-axis. |
| 2.1.6 Intercept labeling | Are y-intercepts and x-intercepts of curves labeled when they are economically meaningful (e.g., the maximum betalingsbereidheid, the price at which a consumer exits the market)? |
| 2.1.7 Visual clutter | Does every visual element in every graph serve an instructional purpose? Flag any unexplained shapes, decorative fills, or graphical elements whose meaning is not stated in the text or caption. |
| 2.1.8 Shift representation | Are original curves shown as solid lines and shifted curves as dashed lines (or clearly differentiated)? Is the direction of shift marked with an arrow? |

### 2.2 Algebraic precision

| Check | What to look for |
|-------|-----------------|
| 2.2.1 Domain restrictions stated | When a formula is presented, is its valid domain (price range) stated explicitly? For collective demand functions, the formula changes when a consumer exits the market. The restriction must appear on FIRST presentation, not only later. |
| 2.2.2 Piecewise functions | If the topic involves consumers entering/leaving the market: is it made explicit that the collective demand function is piecewise? Is each piece stated with its valid price range? |
| 2.2.3 Verification step | After deriving a formula, is there at least one numerical check (e.g., "Test: bij P = 2 geldt Q = -5·2 + 18 = 8. Dat klopt met de tabel")? |
| 2.2.4 Variable clarity | Is it always clear which variable is being summed and which is held constant? For horizontal addition: "tel de Q's op bij dezelfde P" should be stated explicitly, not just implied. |
| 2.2.5 Function notation | Are demand functions written consistently as Q = f(P) throughout? Flag if the paragraph switches between Q = f(P) and P = g(Q) without explanation. |

### 2.3 Terminology and definitions

| Check | What to look for |
|-------|-----------------|
| 2.3.1 Definition boxes | Is every new term introduced with a formal definition box (Definitie: ...)? The definition should be precise enough that a student could use it to answer an exam question. |
| 2.3.2 Term consistency | Is the same term used consistently throughout? Flag if the paragraph alternates between "collectieve vraag" and "marktvraag" without stating they are synonyms. (Stating the synonym once and then choosing one is fine.) |
| 2.3.3 Correct economic relationships | For every causal claim (e.g., "if income rises, demand for a normal good increases"): verify the direction is correct. Check substitutes, complements, normal goods, inferior goods. |
| 2.3.4 Horizontal vs. vertical | Any reference to "horizontaal optellen" or "verticaal optellen": verify the description matches the actual graphical operation. Horizontal addition = summing Q values at each P level. This is adding along the horizontal axis. |

### 2.4 Exercise answer verification

| Check | What to look for |
|-------|-----------------|
| 2.4.1 Worked example correctness | Rework every calculation in the worked example independently. Verify each numerical answer. |
| 2.4.2 Exercise solvability | For every exercise: verify that the question is answerable with the information provided. Check that no required data is missing and no question is ambiguous. |
| 2.4.3 Hint accuracy | Do hints point to the correct method? A hint that says "kijk naar stap 2 van het uitgewerkt voorbeeld" should actually correspond to the right step. |
| 2.4.4 Answer key consistency | If answers are provided (in a separate answer document), verify they match the questions. Check especially that graph references (e.g., "zie figuur 5") point to the correct figure. |

### 2.5 Cross-paragraph consistency

| Check | What to look for |
|-------|-----------------|
| 2.5.1 Prerequisite accuracy | When the paragraph says "In §X leerde je Y" — verify that §X actually teaches Y and uses the same terminology. |
| 2.5.2 Concept forward-compatibility | Does anything in this paragraph contradict or create confusion for later paragraphs? (e.g., stating a simplified rule now that will need to be "un-learned" later). |
| 2.5.3 Notation consistency | Are variable names, subscript conventions (Q_v, Q_a, V₁, V₂), and graph labeling conventions consistent with previous and subsequent paragraphs? |
| 2.5.4 Difficulty calibration | Does this paragraph's difficulty match its rating in the course blueprint (LICHT / MIDDEL / ZWAAR)? Flag if the actual content is significantly harder or easier than rated. |

---

## OUTPUT FORMAT

Present the review as follows:

```
# Paragraph Review: [paragraph number and title]

## Pass 1: Didactic Architecture

### Strengths
[List 3–5 specific things the paragraph does well, with page references]

### Issues
[List each issue with: check number, severity (FLAG/FAIL), page reference, 
specific description, and concrete fix]

## Pass 2: Mathematical and Conceptual Precision

### Verified correct
[List 3–5 specific things that were checked and are accurate]

### Issues  
[List each issue with: check number, severity (FLAG/FAIL), page reference,
specific description, the error, and the correction]

## Summary
[One paragraph: overall assessment, the 2–3 most important changes, 
and whether the paragraph is ready for student use]
```

---

## CALIBRATION EXAMPLES

These examples show what each severity level means:

**FAIL — must fix before use:**
- A slope direction claim that is mathematically backwards (2.1.2)
- Numbers in the text that don't match the graph (2.1.4)
- A formula presented without domain restriction when the domain matters (2.2.1)
- An exercise that is unsolvable with the given information (2.4.2)
- A misconception box that itself contains an error

**FLAG — should fix, not blocking:**
- Summary missing a key concept taught in the body (1.6.2)
- Worked example appearing after the summary (1.6.4)
- Unexplained visual element in a graph (2.1.7)
- Color inconsistency between figures (1.3.2)
- Missing hint on a startoefening (1.5.5)

**PASS — no action needed:**
- Correctly implemented progressive graph construction
- Accurate algebra with verification step
- Clean exercise fading from full support to independence
- Consistent notation throughout

---

## COMMON ERRORS IN ECONOMICS PARAGRAPHS (REFERENCE LIST)

These are the errors most frequently found in economics textbook paragraphs, ordered by frequency. Check for these especially:

### High frequency
1. **Slope language reversed** — saying "steiler" when the curve is flatter (or vice versa) because the author thinks in terms of the coefficient rather than the visual angle on the P-Q diagram
2. **Graph numbers don't match text numbers** — the verbal example uses €2 and €3 but the graph uses 20 and 30
3. **Domain restriction missing on formulas** — presenting Q = -5P + 18 without stating "geldig voor 0 ≤ P ≤ 3.5"
4. **Split attention** — graph on one page, explanation on another
5. **All exercises at the same Bloom level** — typically all "calculate" with no "explain" or "evaluate"

### Medium frequency
6. **Misconception stated but not confronted in exercises** — warning box present but no exercise tests the distinction
7. **Inconsistent variable naming** — Q_v in one place, Q_d in another, Qv in a third
8. **Summary omits key insight** — especially piecewise functions, special cases, or domain restrictions
9. **Interleaving exercises missing** — all exercises from the current paragraph only
10. **Worked example after summary** — breaks reading flow

### Lower frequency but high impact
11. **Supply line crossing Q-axis** — supply curves must always extend to the P-axis
12. **Causal direction error** — e.g., confusing "price of substitute rises → demand increases" with the reverse
13. **Horizontal/vertical addition confusion** — especially in the transition from graphical to algebraic
14. **Figure reference pointing to wrong figure** — "zie figuur 5" but the relevant graph is figuur 6
15. **Dual coding absent from theory section** — text-only explanation of an inherently visual concept

---

## NEVER DO

- Skip Pass 2 because Pass 1 looks good — precision errors in well-scaffolded paragraphs are MORE damaging because students learn the error effectively
- Assume graphs are correct without checking point coordinates against equations
- Accept "steiler/vlakker" claims without verifying against axis orientation
- Let a formula pass without checking its domain restriction
- Review exercises without attempting to solve them yourself
- Approve a paragraph where the worked example contains a calculation error
- Ignore unexplained visual elements in graphs — if you can't explain what it teaches, it's clutter
- Treat FLAG items as unimportant — they accumulate and degrade quality over time

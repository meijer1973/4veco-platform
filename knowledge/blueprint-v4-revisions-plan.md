# Plan — Blueprint v4 revisions (two targeted gaps)

## Context

The blueprint audit (`knowledge/blueprint-v4-audit.md`) flagged two minor-but-actionable gaps. Both are **blueprint-only edits** (no built output to regenerate — only §3.3.1 is built so far). Target file: `knowledge/course_blueprint_v4.md`.

---

## Gap 1 — §3.3.3 "Overview of all market structures"

**Current state** (blueprint lines 1052–1077): exercise is a fill-in comparison table + classification of 2 real markets (coffee shop, petrol) + a ranking question + a collusion prompt. Students *name* monopolistische concurrentie and oligopolie but never *compute* or *diagnose* anything specific to either structure. Risk: students can recite characteristics but can't discriminate the four structures under exam pressure.

**Change — add 2 short worked examples (one per unfamiliar structure) directly to the §3 target exercise.**

Proposed additions (keep §3 a one-lesson paragraph — add, don't inflate):

- **New exercise (f) — Monopolistische concurrentie, short-run vs long-run price premium:**
  > Een lokale koffiezaak rekent €4,20 voor een latte. De buurman rekent €3,80. De gemiddelde totale kosten zijn voor beide €3,50.
  > (f1) Leg uit waarom beide zaken winst kunnen maken ondanks veel concurrenten.
  > (f2) Wat gebeurt er met het prijsverschil en de winst als er op lange termijn nieuwe koffiezaken bijkomen? Verwijs naar de productdifferentiatie.

  *Didactic goal:* productdifferentiatie → beperkte prijszettingsmacht op korte termijn → vrije toetreding → winst ≈ 0 op lange termijn. Connects cleanly back to §3 (vrije toetreding, lange-termijn evenwicht).

- **New exercise (g) — Oligopolie, prijsafspraak vs concurrentie (reuse of existing (e)):**
  > Twee benzinemaatschappijen delen een markt. Als beide €1,80 rekenen, verdient elk €10 mln. Als één afwijkt naar €1,70, wint die €15 mln en verliest de ander (€3 mln). Als beide afwijken, verdienen beide €6 mln.
  > (g1) Teken de payoff in een 2×2-tabel.
  > (g2) Wat is de uitkomst zonder afspraak? Met afspraak?
  > (g3) Leg uit waarom prijsafspraken op oligopoliemarkten verleidelijk maar onstabiel zijn.

  *Didactic goal:* wederzijdse afhankelijkheid → prisoner's-dilemma-logica → waarom kartels instabiel zijn. Replaces the vague existing (e) with a concrete diagnosis exercise.

**Blueprint edits required:**
- Replace exercise (e) (line 1068) with the two concrete examples above (renumber as f/g, keep original (e) phrasing absorbed into (g3)).
- Add two lesson goals: "Verklaar prijszettingsgedrag bij monopolistische concurrentie (korte vs lange termijn)" and "Redeneer met een payoff-tabel bij oligopolie".
- Update difficulty note (line 1077): change "bridges to game theory (covered elsewhere)" to "introduces one payoff-tabel als didactisch hulpmiddel, zonder formele speltheorie".
- Keep paragraph at one lesson — the table (a) is already partly descriptive; trimming its classification prompts (b)(c) from 2 real markets to 1 keeps time budget.

---

## Gap 2 — §3.1.3 "Long-run equilibrium: entry and exit"

**Current state** (blueprint lines 890–910): exercise (d) asks students to write GTK = TK/Q = 0.5Q + 10 + 500/Q, set equal to MK = Q + 10, solve for Q (→ Q² = 1000, Q ≈ 31.6). The difficulty note (line 910) *acknowledges* the 500/Q term is unfamiliar and says "guide students through it step by step" — but the paragraph gives no scaffold; students meet the move cold.

**Change — pre-teach the GTK algebra inside §2 and add a scaffold step in §3 exercise (d).**

### 2a. Add a short algebra bridge in §2 difficulty notes (line 886)

Append one paragraph after the existing note:

> **Algebra-voorbereiding op §3:** in de volgende paragraaf gebruiken leerlingen GTK = TK/Q. Om daarop voorbereid te zijn, besteed de laatste 5 minuten aan één oefening: gegeven TK = 0,5Q² + 10Q + 500, laat zien dat GTK = 0,5Q + 10 + 500/Q. Dit is alleen TK delen door Q, term voor term. De `500/Q`-term voelt wennen — benoem expliciet dat deze term groter wordt naarmate Q kleiner wordt (vaste kosten per eenheid dalen bij schaalvoordelen). Dit geeft leerlingen de intuïtie vóór ze in §3 de vergelijking moeten oplossen.

### 2b. Split exercise (d) in §3 into two scaffolded steps (line 897)

Replace the single (d) with:

> (d1) Schrijf GTK = TK/Q op. Deel elke term van TK = 0,5Q² + 10Q + 500 door Q. *Verwacht resultaat: GTK = 0,5Q + 10 + 500/Q.*
> (d2) Zet GTK = MK (= Q + 10) en los op voor Q. *Tip: trek 10 van beide kanten af, vermenigvuldig met Q om de breuk weg te werken, verzamel Q²-termen.* Dit is de efficiënte schaal van het bedrijf.

**Blueprint edits required:**
- §2 difficulty note (line 886): append the algebra-voorbereiding paragraph.
- §3 target exercise (line 897): split (d) into (d1)/(d2); renumber (e)(f) to stay (e)(f) since count is the same after split.
- §3 difficulty notes (line 910): keep the full derivation (it's already there) but add "De splitsing in (d1)/(d2) en de voorbereiding aan het eind van §2 zijn cruciaal — zonder die stappen wordt §3 overweldigend voor de onderkant van de klas."
- §3 lesson goals (lines 901–908): add "Herleid GTK uit TK door term-voor-term delen door Q."

---

## Files to change

Single file: `C:/Projects/4veco/4veco-platform/knowledge/course_blueprint_v4.md`

Specific line ranges:
- §3.1.2: line 886 (append to difficulty note)
- §3.1.3: lines 897, 901–908, 910 (split (d), add goal, update note)
- §3.3.3: lines 1054–1077 (replace (e), add (f)/(g), update goals + note)

No source-data, no build-scripts, no output/ changes — nothing is built yet for these paragraphs.

## Verification

1. Re-read the three edited paragraphs end-to-end to confirm they still fit a single-lesson budget (§3.3.3 was already "comfortable", §3.1.3 was already "one lesson works if...").
2. Cross-check lesson-goal additions against `references/authored/economie-terminologie.md` (expect: "prijszettingsmacht", "productdifferentiatie", "prijsafspraak" — all canonical).
3. When paragraphs actually get built later (via `econ-textbook-paragraph`), the new exercises become concrete opgaven; the audit gap closes at build-time automatically.

## Out of scope

- No changes to built output (only §3.3.1 exists; neither target paragraph is there).
- No changes to the third audit finding (§2.1.3 part C as optional depth) — that one is already flagged in blueprint lines 1627, so it's a build-time decision, not a blueprint revision.
- No changes to the schedule/notation discussion from the audit.

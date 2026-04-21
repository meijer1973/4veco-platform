# Findings — Course Blueprint v4 vs. CvTE Exam Program (Economie VWO)

## Context

Audit of `knowledge/course_blueprint_v4.md` against the official CvTE syllabus (`references/external/syllabus-economie-vwo-2026-versie-2.pdf`) and canonical terminology (`references/authored/economie-terminologie.md`). This is a read-only report, not an implementation plan — no files will be changed.

## Scope assumption

Blueprint v4 is the **VWO 4** curriculum. Domains not examined centrally in VWO 4 are either deferred (to VWO 5/6) or delivered as school-exam breadth content.

## 1. Domain coverage

| Syllabus domain | Central exam? | Blueprint status |
|---|---|---|
| A — Vaardigheden | yes | Fully covered (§1.1 skills, recurring across all modules) |
| B — Schaarste en ruil | school exam only | Covered (§1.1.1) |
| C — Ruil (comparative advantage) | school exam only | Covered (§4.3.1–§2) |
| D — Markt | **yes, primary focus** | **Fully covered — see §2** |
| E — Ruilen over de tijd | VWO 5/6 | Correctly deferred |
| F — Samenwerken/onderhandelen | VWO 5/6 | Correctly deferred |
| G — Risico en informatie | VWO 5/6 | Correctly deferred |
| H — Welvaart en groei | **yes (central exam)** | Covered (Module 4: labor, trade, inflation). Includes H5 arbeidsmarkt, heavily exam-tested. |
| I — Concept-contextbenadering (macro) | VWO 5/6 | Correctly deferred |

No central-exam endpoint is left uncovered for the VWO 4 scope.

## 2. Domain D (Markt) — full breakdown

- **D1 Vraag & aanbod** (eindtermen 1.1–1.24): all covered — §1.2–4 (demand, supply, equilibrium, marginale kosten/opbrengst, MO=MK), §2.1 (Ev, Ei, Ek). Cost structures (TK/TCK/TVK/GTK/MK) and revenue (TO/GO/MO) present.
- **D2 Marktstructuur** (2.1–2.3): volkomen concurrentie (§3.1), monopolie (§3.2–§3.3), overview monopolistische concurrentie + oligopolie (§3.3.3).
- **D3 Doelmatigheid** (3.1–3.11): consumenten-/producentensurplus (§2.2), Pareto-efficiëntie, belastingen/subsidies (§2.3), prijsregulering (§2.4), monopoliewelvaart + prijsdiscriminatie (§3.3.1–§3.3.2).

## 3. Level (K/T/A)

Blueprint hits all three cognitive levels without overreach:
- **Kennis** — definitions, graph mechanics, formula fluency in theory chapters.
- **Toepassing** — target exercises and worked examples in every §.
- **Analyse** — standpuntbepaling in each module's §N.5.2 + consolidation exercises.

No VWO 5/6 material leaks in (no IS-MB-GA, no game theory, no asymmetric information).

## 4. Terminology consistency

Blueprint is canonical against `economie-terminologie.md`:
- "alternatieve kosten" (not "opportuniteitskosten") — ✓
- "betalingsbereidheid", "marginale kosten", "verloren surplus" (not "deadweight loss") — ✓
- Abbreviations TK/TCK/TVK/GTK/MK/TO/GO/MO/Ev/Ei/Ek consistent with syllabus — ✓

Minor: "omzet" and "totale opbrengst" used interchangeably across paragraphs. Both are canonical; not an error, but a per-paragraph choice would read cleaner.

## 5. Structural sequencing

Progression respects prerequisite chains:
Module 1 (foundations + D&S) → Module 2 (elasticity, surplus, overheidsingrijpen) → Module 3 (marktvormen + marktfalen) → Module 4 (arbeid, handel, inflatie — applied contexts + school-exam breadth).

Didactically sound. §3.2.3 (monopolie winstmaximalisatie, 6-step procedure) is the hardest single lesson — the blueprint acknowledges this and scaffolds explicitly.

## 6. Gaps / risks (minor)

1. **Monopolistische concurrentie & oligopolie (§3.3.3)** — defined but no worked example per structure. Central-exam demand is light here, but one example each would solidify discrimination between the four marktvormen.
2. **Lange-termijn evenwicht (§3.1.3)** — `GTK = MK` with `500/Q` term is algebraically demanding. Pre-teach the rearrangement explicitly; don't assume.
3. **Meervariabele vraagfunctie (§2.1.3 part C)** — realistic exam style, but the paragraph's core (Ei, Ek) doesn't need it. Flag part C as optional depth if time is tight.
4. **Notation markers (1)/(2) in syllabus** — the syllabus marks some eindtermen as "grafisch only" or "rekenen only". Blueprint exercises do both, which overshoots (not a violation — markers are a floor). Worth noting students will be overprepared for graphical-only items.
5. **Schedule** — 81–85 lessons in 36 weeks is tight. Module 4 is the designed buffer; if weeks are lost, compress there, not in Module 3.

## 7. Common-misconception coverage (strength)

Blueprint explicitly isolates:
- Shift vs. movement along the curve (§1.2.2, repeated §4.1.4 for arbeidsmarkt).
- Indexpunt vs. procentuele verandering (§1.1.2, repeated §4.4.1).
- Prijselasticiteit vs. omzet-effect (§2.1.2 as a dedicated lesson after the definition in §1).
- Afwenteling van belasting (§2.3.2).

This repeated exposure across contexts is strong didactics.

## Verdict

**Blueprint v4 is aligned with the CvTE VWO 4 exam program.** Central-exam Domain D coverage is comprehensive; central-exam Domain H (welvaart, arbeidsmarkt) is present in Module 4; school-exam Domains B/C are present; VWO 5/6 domains correctly deferred. Terminology canonical. Cognitive level appropriate. Sequencing defensible.

Recommended tweaks are minor: one worked example each for monopolistische concurrentie en oligopolie; pre-teach algebraic rearrangement before GTK=MK; flag §2.1.3 part C as optional depth.

## Verification (how to double-check)

- Re-read syllabus Domain D eindtermen list (PDF p. ~12–18) against the paragraph-by-paragraph claims in the blueprint Table-of-Contents (lines ~50–200 of `course_blueprint_v4.md`).
- Spot-check §2.2 against syllabus D3 eindtermen 3.1–3.11.
- Cross-check terminology via `references/authored/economie-terminologie.md` with a grep of blueprint for known anglicism traps ("opportuniteitskosten", "deadweight").

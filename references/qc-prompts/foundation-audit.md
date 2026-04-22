# QC prompt — foundation audit (bottom-up L0/L1 check)

**Test ID:** foundation-audit
**Subagent role:** VWO economie docent (10+ jaar ervaring) die onderbouw-curriculum, wiskunde-voorkennis en VWO 4-instapniveau kent.
**Catches:** (a) L0 units that claim to be "basic calculation / onderbouw-wiskunde" but are really economic concepts and should be L1; (b) L1 units with unjustified `needs` (over-wired) or missing `needs` on L0 math primitives they actually use.

Added after H15 was found at L0 with empty `needs` silently assuming advanced concepts. Complements `tree-integrity-audit` (top-down per-unit) with a layer-wise bottom-up check.

---

## Layer semantics this test enforces

The catalog uses a strict L0/L1 distinction that the DAG math alone cannot capture:

- **L0 = mathematical / calculation skill.** Onderbouw-wiskunde the economics course uses but doesn't teach. Examples: solving linear equations, percentage change, substituting into a function, reading graph scales.
- **L1 = foundational economic concept.** The course's opening economic vocabulary: schaarste, vraag/aanbod, alternatieve kosten, betalingsbereidheid, etc. Preferred to have `needs=[]`; may cite L0 math primitives as `needs` if a calculation is genuinely required.
- **Tiebreak rule:** when a unit could plausibly sit at L0 or L1, **prefer L1**. L0 is reserved for math.

An economic concept with `needs=[]` is **not** L0 — it's L1. That's the rule.

---

## Prompt (verbatim — runner pastes this into the Agent call, with `<UNIT-DUMPS>` and `<OUTPUT-PATH>` substituted)

Je bent een VWO economie docent met 10+ jaar ervaring. Je kent het onderbouw-curriculum (HAVO/VWO 2-3) en weet welke wiskundige vaardigheden VWO 4-leerlingen meebrengen: vergelijkingen oplossen, lineaire functies, procentberekening, substitutie, grafieken lezen. Leerlingen brengen géén specifieke economische vocabulaire mee als "zekerheid" — economische basisbegrippen (schaarste, vraag/aanbod, alternatieve kosten) worden in de eerste weken van de cursus opnieuw geïntroduceerd.

**Jouw taak:** beoordeel 5 aangereikte catalogus-units. Bepaal per unit of de huidige layer-positionering klopt onder de volgende regel:

- **L0 is uitsluitend voor wiskundige / rekentechnische vaardigheden** (onderbouw-wiskunde). Voorbeelden: lineaire vergelijking oplossen (A02), procentuele verandering berekenen (A38), substitueren in een functie (A04).
- **L1 is voor foundationele economische concepten** — het openingsvocabulaire van de cursus. Bij voorkeur `needs=[]`, eventueel met L0-wiskunde als prereq als er echt gerekend moet worden.
- **Tiebreak:** bij twijfel → L1 (niet L0). L0 blijft een klein, gesloten setje wiskunde.

Een economisch concept met `needs=[]` hoort op **L1, niet L0**. Dat is de fout die we zoeken.

Je ontvangt per unit het volledige tekstblok (id, name, kern, mastery_target, layer, exam_codes, aspects, terms, eventuele procedure en pitfalls). Je ontvangt **geen toegang tot andere catalogus-units of de syllabus** — gebruik je eigen vakkennis.

**Voor elke unit beoordeel je:**

1. **Karakter**: is de inhoud **mathematical/calculational** of **economic**? (Een unit met een `procedure` die alleen uit algebra-stappen bestaat en een kern die naar een functie/vergelijking verwijst is mathematical. Een unit waarvan de kern een economisch begrip definieert of verklaart is economic, ook als er ergens een rekenstap in zit.)

2. **Layer-verdict**:
   - **GREEN** — huidige layer klopt. Mathematical unit op L0 = OK. Economic unit op L1+ (of op L1 met `needs=[]`) = OK. Economic unit op L2+ met passende `needs` = OK.
   - **YELLOW** — grensgeval of lichte over/under-wiring: unit klopt qua karakter maar `needs` is twijfelachtig.
   - **RED** — layer klopt niet:
     - Economic unit op L0 (moet naar L1 gepromoveerd worden).
     - L1 unit met `needs` die niet nodig zijn (over-wired; `needs` kan leeg of kleiner).
     - L0 unit met verborgen prereqs (moet naar L1+ met `needs` aangevuld).

3. **Actie-voorstel** bij YELLOW/RED: wat moet concreet gebeuren? (bijv. "promote naar L1 met `needs=[]`", of "voeg A38 (procentuele verandering) toe aan `needs`", of "splits in een L0 math-deel en een L1 economic-deel").

**Belangrijk:**
- Wees streng op de L0-claim. De L0-set hoort klein te blijven. Vraag jezelf: "zou dit niet gewoon in de onderbouw-wiskundeles worden aangeraakt?" Zo niet → waarschijnlijk L1.
- Wees niet streng op L1-units zonder `needs`. Die zijn de norm voor economische begrippen.
- `mastery_target` is geen indicatie van layer. Een `apply` unit kan L0 zijn (als het zuiver rekenen is, zoals A02).

**Units te beoordelen:**
<UNIT-DUMPS>

**Outputformat:** schrijf naar `<OUTPUT-PATH>`. Gebruik deze Markdown-structuur, één sectie per unit:

```markdown
## <unit-id> — <unit-name>

- **Karakter:** Mathematical / Economic / Mixed
- **Huidige layer:** <uit de dump>
- **Layer-verdict:** GREEN / YELLOW / RED
- **Toelichting:** <1–2 zinnen waarom>
- **Actie-voorstel (YELLOW/RED):** <concrete actie: "promote to L1", "add A38 to needs", etc.; of "N/A">
- **Confidence:** high / medium / low
```

Sluit af met een `## Samenvatting` sectie met de telling per verdict en een korte lijst van alle RED acties.

Rapporteer terug in minder dan 60 woorden: hoeveel units beoordeeld, verdeling GREEN/YELLOW/RED, en het test-ID `foundation-audit`.

---

## Runner notes

- Sampling policy: pick 5 unit IDs from the pool of **L0 + L1 units** (`layer <= 1 && !deprecated`).
  - **3 high-risk slots**: sort L0+L1 units by fan-out (number of direct dependents); pick 3 from the top decile. High fan-out means layer errors at the foundation cascade into many dependent chains.
  - **2 random slots**: uniform-random from the remaining L0+L1 pool.
  - Weight down units audited in the prior run (don't exclude; slight bias only) by scanning prior SUMMARY.md `Notes`.
- Fill `<UNIT-DUMPS>` with the 5 chosen units' full text blocks (id, name, kern, mastery_target, layer, exam_codes, aspects, terms, procedure, pitfalls).
- Substitute `<OUTPUT-PATH>` with the per-run scratch path.

## What good looks like

- 5 units audited, verdict distribution varies per run. Healthy pattern: majority GREEN after the initial L0→L1 sweep; YELLOW surfaces borderline/over-wired cases; RED is rare once the formalisation has had one full pass.
- When RED: agent names a concrete action ("promote to L1", "add A38 to needs") that the reviewer can apply via `unit-update` in one step.

## Failure signals

- ≥2 RED on L0-claim pattern (economic unit stuck at L0) in one run → the formalisation hasn't fully landed; do another sweep.
- ≥2 RED on over-wiring pattern (L1 with unjustified needs) in one run → recent mints are inheriting stale conventions; review the last batch.
- Low-confidence verdicts → prompt may need more examples of the L0/L1 distinction.

## Related tests

- **Complement to `tree-integrity-audit`**: that test is top-down per unit ("does this unit's wiring internally check out?"). This one is bottom-up per layer ("is this unit at the right layer?"). Together they cover wiring-within and wiring-across.
- **Future**: a middle-layer audit test to pressure-test L2–L4 layer placements. Not yet implemented.

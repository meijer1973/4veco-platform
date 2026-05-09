---
name: econ-didactiek
description: "General didactic skill for economics education (bovenbouw vwo/havo). Provides principles and decision rules for differentiation, scaffolding, cognitive load management, dual coding, interleaving, misconception handling, Bloom's taxonomy, and question design — independent of output format. Use this skill whenever making pedagogical choices about any economics material: worksheets, presentations, textbooks, games, quizzes, or assessments. Trigger when the user mentions didactiek, scaffolding, differentiatie, begeleide inoefening, verdieping, cognitieve belasting, dual coding, interleaving, misconceptions, Bloom, toetsmatrijs, or any pedagogical discussion about economics materials. This skill defines WHAT to teach and WHY; product-specific builder skills define HOW to package it."
pipeline: "shared infrastructure"
---

# Economie Didactiek Skill

General didactic principles for economics education. This skill is format-independent — it applies equally to textbooks, presentations, games, quizzes, and any future product. Product-specific builder skills (econ-word-templates, econ-pptx-templates, textbook-builder, etc.) handle format and layout.

**Authoritative reference:** `references/authored/didactiek-principes.md` is the single source of truth for all didactical principles in this repository. This skill provides operational decision rules; the reference document contains the complete theoretical foundation, research evidence, and detailed specifications. When this skill and the reference document conflict, the reference document takes precedence.

---

## PART 1: CORE DESIGN PHILOSOPHY

### 1.1 Reduce friction, not add content

Effective material design is not about adding more content but about reducing friction between the student and the concept. Every element — image, exercise, paragraph, slide — must earn its place by directly supporting schema construction. Decorative images, separated legends, blocks of same-type problems, and theory without a motivating problem are friction to be eliminated.

### 1.2 Problem-first, theory-second

Theory is introduced as a tool to solve a motivating problem, not the other way around. Students who don't understand the purpose of theory find learning "more dry and difficult than it needs to be" (Velenchik, 1995). Every concept should be anchored in a recognisable context before formalisation. The sequence is: problem → need for a tool → theory as tool → application.

### 1.3 Unified procedures, varied contexts

**Concept-context separation:** procedures, notation, solution steps, and precise language are kept strictly consistent across all materials. If a procedure is taught in a theoretical explanation, the answer model follows exactly that procedure. But *contexts* are deliberately varied to build transfer. Same method, different settings. This mirrors mathematics: clean definitions and axioms first, broad application second.

### 1.4 Models as tools, not reality

Economic models are analytical tools, not descriptions of how the world works. Consistently signal the assumptions behind models, their limitations, and the gap between predictions and observed reality. Use **layered nuance**: introduce clean principles first, then systematically add qualifications, exceptions, and competing perspectives in later encounters.

### 1.5 Spiral curriculum

Core concepts (opportunity cost, supply/demand, equilibrium, surplus) reappear at increasing complexity across the course. Each return adds depth, not just repetition. Example: opportunity cost appears as personal spending choices → PPF for firms → government budget trade-offs → cost-benefit analysis of regulation.

---

## PART 2: DIFFERENTIATIE

**School-fit overlay:** Differentiation must follow `references/external/amstelveencollege_quality_standards.md` accent 3 — layered support with neutral framing and high expectations. Support is a route to the same core goals, not a different destination. No stigmatising labels, no separate tracks.

### 2.1 Het differentiatiespectrum

Leerlingen in een vwo-klas verschillen sterk in voorkennis, werktempo en abstractievermogen. Effectief materiaal bedient het hele spectrum.

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

### 2.2 Wanneer welk niveau?

**Extra ondersteuning** → leerlingen die vastlopen bij structureren, de formules kennen maar niet weten welke ze moeten gebruiken, het concept begrijpen maar niet zelfstandig kunnen toepassen.

**Standaard** → leerlingen die de stof in de les hebben gevolgd en zelfstandig aan de slag kunnen. Geen extra hulp nodig, geen extra uitdaging gevraagd.

**Extra uitdaging** → leerlingen die standaardopgaven snel en correct afmaken, behoefte hebben aan meer diepgang, en klaar zijn om kennis in onbekende contexten toe te passen.

### 2.3 Ontwerpregels per niveau

**Extra ondersteuning:**
- Denkstappen, hints, formuleherinneringen, invulformaten
- Antwoorden uitgebreid met uitleg (het "waarom")
- Scaffolding afbouwen over oefeningen (fading)

**Standaard:**
- Opgaven zonder tussenstappen, hints of scaffolding
- Standaard antwoordmodel volstaat
- Dit is het basisproduct dat elke leerling krijgt

**Extra uitdaging:**
- Open vragen die evaluatie of creatie vereisen
- Laat leerlingen een model uitbreiden of bekritiseren
- Transfer: pas het concept toe in een onbekende context
- GEEN tussenstappen, hints of formulekaarten — die vertragen het denkproces
- Eventueel: leerlingen hun eigen opgaven laten ontwerpen

### 2.4 Wat NIET in verdiepingsmateriaal hoort

| ❌ Geen echte verdieping | ✅ Echte verdieping |
|--------------------------|---------------------|
| Meer rekenwerk (langere getallen) | Een model bekritiseren ("Wanneer klopt MO = MK niet?") |
| Meer deelvragen over dezelfde vaardigheid | Transfer naar een nieuwe markt/context |
| Dezelfde berekening met andere getallen | Een beleidsvoorstel schrijven en onderbouwen |
| Extra stappen in een keten | Twee modellen vergelijken |
| Moeilijkere formules memoriseren | Zelf een model ontwerpen of uitbreiden |

### 2.5 Positieve framing

**Kernregel: nooit labels die een negatief zelfbeeld versterken.**

| ❌ Niet | ✅ Wel |
|---------|--------|
| "Makkelijke versie" | "Begeleide inoefening" |
| "Basisniveau" | "Stap-voor-stap werkblad" |
| "Versimpeld" | "Oefenen met denkstappen" |
| "Zwakke leerlingen" | "Leerlingen die baat hebben bij extra structuur" |
| "Moeilijke versie" / "Voor de slimme leerlingen" | "Verdieping" of "Denkertje" |

---

## PART 3: SCAFFOLDING

### 3.1 Scaffolding-niveaus

| Niveau | Naam | Wat de leerling krijgt | Wanneer |
|--------|------|------------------------|---------|
| 0 | Geen scaffolding | Alleen de vraag | Standaard opgavenset |
| 1 | Lichte hint | Één zin die richting geeft | Leerling weet het concept maar mist de ingang |
| 2 | Denkstappen | Genummerde stappen als leidraad | Leerling kent de stof maar kan het niet structureren |
| 3 | Formule-herinnering | Relevante formules bij de vraag | Leerling vergeet welke formule nodig is |
| 4 | Invulformaat | Deels ingevuld antwoord | Leerling weet de stappen maar maakt rekenfouten |
| 5 | Volledig uitgewerkt | Antwoord + uitleg waarom | Naslag, zelfstudie, herkansing |

### 3.2 Fading-strategie

Bouw scaffolding af over de oefeningen heen:

```
Oefening 1-2:  Volledige scaffolding (denkstappen + formules + hints + invulformaat)
Oefening 3-4:  Verminderd (hints + formulekaart, geen denkstappen meer)
Oefening 5-6:  Minimaal (alleen een korte hint)
Oefening 7-8:  Geen scaffolding (zelfstandig)
```

**Signaal voor fading:** als oefening 3 dezelfde vaardigheid vraagt als oefening 2 (maar in een andere context), is het tijd om de denkstappen te verwijderen.

### 3.3 Beslisboom: welke scaffold bij welke vraag?

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

### 3.4 Vygotsky's Zone van Naaste Ontwikkeling

Scaffolding werkt binnen de ZNO: net boven wat de leerling zelfstandig kan, bereikbaar met hulp. Het vierstappenmodel (Van de Pol, 2012):

1. **Diagnose** → achterhaal waar de leerling vastloopt
2. **Check** → controleer of je interpretatie klopt
3. **Hulp** → bied ondersteuning op maat
4. **Begripscheck** → controleer of de leerling het snapt

Twee vormen: **gepland** (ingebouwd in materiaal — alleen in begeleide inoefening) en **interactief** (spontaan in het onderwijsleergesprek — voor elke leerling).

---

## PART 4: COGNITIEVE BELASTING (Sweller)

### 4.1 Drie typen belasting

| Type | Wat | Doe ermee |
|------|-----|-----------|
| Intrinsiek | Complexiteit van de stof zelf | Niet te vermijden, wel op te splitsen |
| Extrinsiek | Belasting door slecht ontwerp | Minimaliseer: helder taalgebruik, logische opbouw, geen afleiding |
| Germaan | Belasting die leidt tot leren | Maximaliseer: verbanden leggen, voorbeelden, oefening |

### 4.2 Worked examples en expertise reversal

Novice learners leren meer van het bestuderen van uitgewerkte voorbeelden dan van zelf problemen oplossen (effect size 0.52, Crissman 2006). Maar het expertise reversal effect betekent dat scaffolding en uitgewerkte voorbeelden *contraproductief* worden bij gevorderde leerlingen. Dit is de theoretische onderbouwing voor de differentiatie: vroeg materiaal zwaar scaffolden, scaffolding doelbewust afbouwen.

### 4.3 Praktische vuistregels

1. Leer het instrument (grafiek tekenen) APART van de theorie (waarom MO = MK)
2. Bouw complexiteit pas op als de basis staat
3. Combineer tekst en beeld (dual coding) — niet tekst óf beeld, maar samen
4. Eén concept per eenheid (slide, sectie, oefening)
5. Maximaal ~4 nieuwe chunks per leermoment (Cowan, 2001)

---

## PART 5: DUAL CODING (Paivio/Mayer)

### 5.1 Het principe

Informatie wordt beter onthouden als het via twee kanalen binnenkomt: verbaal (tekst/spraak) en visueel (beeld/diagram/kleur). Bevestigd voor economie specifiek (Nature: Humanities and Social Sciences Communications, 2024).

**Kritische kanttekening:** grafieken helpen niet automatisch. Cohn et al. (2001) vonden dat studenten met grafieken soms *lager* scoorden. Wat telt is *hoe* grafieken worden geïntegreerd:
- Bouw grafieken stap voor stap op met annotaties — nooit een afgewerkte grafiek laten zien en doorgaan
- Oefen grafiek-leesvaardigheid apart vóór grafieken inzetten om nieuwe concepten te onderwijzen
- Adresseer de verschuiving-van vs. verschuiving-langs verwarring expliciet

### 5.2 Toepassing in materialen

- Domeincodering (blauw/amber/groen) → visuele herkenning zonder te lezen
- Grafieken naast tekstuele uitleg → twee paden naar hetzelfde concept
- Stroomdiagrammen voor redeneerkettingen → visuele structuur voor causale logica
- Formuleboxen in monospace → visueel onderscheid van lopende tekst
- Varieer visuele vormen: grafieken, stroomdiagrammen, tabellen, schematische overzichten

### 5.3 Exercise scaffolding met visuals

Binnen een paragraaf/les progressie van oefeningen:
1. **Simpel + volledige dual coding** (tekst + visueel)
2. **Doelniveau + dual coding** (tekst + visueel)
3. **Doelniveau zonder dual coding** (alleen tekst)

Zo worden leerlingen opgebouwd en wordt de visuele ondersteuning gefaded vóór het doorgaan.

### 5.4 Unified experience

Dezelfde procedure (stappen, aanpak, redeneerstructuur) wordt in elk format op dezelfde manier uitgelegd. De context mag variëren, maar de aanpak is het anker. Als een uitleg 3 stappen voorschrijft, volgen alle materialen dezelfde 3 stappen.

---

## PART 6: INTERLEAVING

### 6.1 Het principe

Oefenopgaven worden gemixed over vraagtypen in plaats van geblokt per onderwerp. Interleaving levert grote, betrouwbare leerwinst, maar minder dan 10% van typische methode-opgaven gebruikt het.

### 6.2 Toepassing

- In lichtere lessen: meer ruimte voor interleaving-opgaven uit eerdere hoofdstukken en algemene vaardigheden
- In zware lessen: interleaving terugbrengen tot een minimum om te focussen op de nieuwe vaardigheid
- Interleaving-opgaven trainen basisvaardigheden (rekenvaardigheid, grafiek-lezen, begrippen) naast de nieuwe stof

---

## PART 7: MISCONCEPTIONS

### 7.1 Het probleem

Misconcepties zijn diep resistent tegen standaardinstructie. Busom, Lopez-Mayan & Panadés vonden dat "exposure to an economic principles course hardly seems to affect misconceptions." Correct presenteren is niet genoeg.

### 7.2 Vereiste strategieën

1. **Predict-observe-explain** → presenteer scenario, laat leerling voorspellen, onthul uitkomst
2. **Expliciete vergelijking** → misconceptie en correcte conceptie zij-aan-zij
3. **Data-driven exercises** → leerlingen confronteren met bewijs dat hun aannames weerspreekt

### 7.3 Threshold concepts (Davies & Mangan)

Deze verdienen expliciet, herhaald aandacht:
- Prijs vs. kosten
- Geld vs. inkomen
- Reëel vs. nominaal
- Besparingen vs. investering
- Verschuiving VAN vs. LANGS de lijn
- Absoluut vs. comparatief voordeel

### 7.4 Veelgemaakte fouten per onderwerp

Bouw deze in als waarschuwingsboxen in materiaal voor extra ondersteuning. In standaardmateriaal: noem ze kort. In verdiepingsmateriaal: laat leerlingen ze zelf ontdekken.

**Marktevenwicht:**
- Verwarring tussen verschuiving VAN en LANGS de vraaglijn
- Vergeten dat de ceteris paribus-voorwaarde geldt

**Monopolie:**
- Prijs aflezen op de MO-lijn i.p.v. de vraaglijn
- Winst = TO i.p.v. winst = TO − TK
- MO-lijn door de oorsprong tekenen (bij lineaire vraaglijn begint MO op hetzelfde y-snijpunt als V)

**Prijsdiscriminatie:**
- Vergeten de twee voorwaarden te noemen (segmenteren + geen doorverkoop)
- Redeneren dat prijsdiscriminatie altijd slecht is voor consumenten

**Internationale handel:**
- Absoluut voordeel verwarren met comparatief voordeel
- Vergeten dat beide landen baat hebben bij handel

---

## PART 8: BLOOM'S TAXONOMIE VOOR ECONOMIE

### 8.1 Niveaus met economie-voorbeelden

| Bloom-niveau | Economie-voorbeeld | Signaalwoorden | Geschikt voor |
|--------------|-------------------|----------------|---------------|
| Onthouden | "Noem de vier marktvormen" | Noem, som op, geef de definitie van | Alle niveaus |
| Begrijpen | "Leg uit waarom MO = MK winst maximaliseert" | Leg uit, beschrijf, geef aan waarom | Alle niveaus |
| Toepassen | "Bereken de evenwichtsprijs" | Bereken, teken, leid af | Alle niveaus |
| Analyseren | "Vergelijk de welvaart vóór en na de belasting" | Vergelijk, analyseer, onderscheid | Standaard + verdieping |
| Evalueren | "Beoordeel of prijsdiscriminatie de welvaart verhoogt" | Beoordeel, beredeneer of | Verdieping |
| Creëren | "Stel een beleidsmaatregel voor" | Bedenk, ontwerp, stel voor | Verdieping |

### 8.2 Differentiatie via Bloom

Standaardopgaven bewegen zich vooral op onthouden / begrijpen / toepassen. Verdieping tilt door naar analyseren / evalueren / creëren. Progressie binnen en over hoofdstukken volgt deze opbouw.

---

## PART 9: ECONOMIE-SPECIFIEKE DIDACTIEK

### 9.1 Concept-context-benadering per niveau

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

### 9.2 Causaliteitsketens

Economische redeneringen zijn ketens van oorzaak en gevolg. Scaffolding verschilt per niveau:

| Fase | Niveau | Ondersteuning |
|------|--------|---------------|
| Voordoen | Extra ondersteuning | Docent bouwt de keten hardop op |
| Begeleid invullen | Extra ondersteuning | Keten met lege vakjes |
| Zelfstandig opbouwen | Standaard | Begin en eind gegeven |
| Transfer | Standaard + verdieping | Zelfde ketenstructuur, nieuwe context |
| Kritische evaluatie | Verdieping | Welke schakels zijn aannames? Wanneer klopt het niet? |

**Voorbeeld:**
```
Extra ondersteuning:  olieprijs ↑ → [productiekosten ↑] → aanbod ↓ → [prijs ↑]
Standaard:            minimumloon ↑ → [___] → [___] → [___]
Verdieping:           "De ECB verlaagt de rente. Bouw een keten van minimaal 5 schakels
                       en geef aan welke schakels onzeker zijn."
```

### 9.3 Grafiekvaardigheid — opbouw in lagen

| Laag | Vaardigheid | Extra ondersteuning | Standaard | Verdieping |
|------|------------|---------------------|-----------|------------|
| 1. Aflezen | "Wat is de prijs bij Q = 20?" | Grafiek + pijl naar het punt | Alleen de vraag | — |
| 2. Verschuiven | "Teken de nieuwe vraaglijn" | Richting-hint + originele lijn | Alleen de vraag | — |
| 3. Tekenen | "Teken V, A, MO en MK" | Coördinatentabel + volgorde | Alleen formules | — |
| 4. Interpreteren | "Wat stelt het gearceerde vlak voor?" | Legenda met vlakken | Alleen de vraag | — |
| 5. Redeneren | "Wat gebeurt met CS bij belasting?" | — | Alleen de vraag | "Vergelijk twee scenario's" |

---

## PART 10: BESLISREGELS

### Bij het ontwerpen van elk materiaal:

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

---

## NEVER DO

- Materiaal labelen als "makkelijk", "basis", of "voor zwakke leerlingen"
- Materiaal labelen als "moeilijk" of "voor slimme leerlingen"
- Scaffolding standaard in alle materialen stoppen (alleen in begeleide inoefening)
- Denkstappen, hints of formulekaarten in verdiepingsmateriaal (horen daar niet)
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

---

*This skill defines WHAT to teach and WHY. For HOW to package it, see the relevant product skill: econ-word-templates (Word), econ-pptx-templates (PowerPoint), economic-graph (graphs/diagrams), or the textbook-builder skill (textbooks).*

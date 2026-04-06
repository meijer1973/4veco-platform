---
name: econ-didactiek
description: "Didactic decision-making skill for economics education (bovenbouw vwo/havo). Provides principles and decision rules for differentiation (both scaffolding and extra challenge), cognitive load management, question design, lesson flow, and assessment — applied specifically to economics topics like markten, monopolie, internationale handel, and macro-economie. Use this skill whenever making pedagogical choices about lesson materials: which differentiation level to apply, how to frame exercises positively, how to design challenge materials for strong students, how to order content for optimal learning, and how to connect Bloom's taxonomy to economics question types. Trigger when the user mentions didactiek, scaffolding, differentiatie, begeleide inoefening, verdieping, extra uitdaging, cognitieve belasting, toetsmatrijs, leerlijnen, werkvormen, formatief toetsen, or any pedagogical discussion about economics materials. Also trigger for discussions about how to structure a lesson, which order to teach concepts, how to support struggling students without stigma, or how to challenge advanced students."
---

# Economie Didactiek Skill v2

Didactic principles and decision rules for creating effective economics lesson materials. This skill works at a higher level than the format-specific skills (econ-word-templates, econ-pptx-templates, economic-graph) — it guides the *pedagogical choices* that determine what goes into those formats.

**When to use this skill:**
- Deciding how to differentiate for a specific group or leerling
- Choosing between scaffolding (extra ondersteuning) and verdieping (extra uitdaging)
- Designing materials that serve the volle breedte van de klas
- Ordering concepts for optimal learning progression
- Making assessment decisions (formatief/summatief, vraagtypen)
- Any pedagogical discussion about economics materials

**Companion skills (for execution):**
- `econ-word-templates` → produces the Word documents
- `econ-pptx-templates` → produces the PowerPoint slides
- `economic-graph` → produces graphs, flow diagrams, and lesson design rules

---

## PART 1: DIFFERENTIATIE ALS UITGANGSPUNT

### 1.1 Het differentiatiespectrum

Leerlingen in een vwo-klas verschillen sterk in voorkennis, werktempo en abstractievermogen. Effectief materiaal bedient het hele spectrum — niet alleen de middenmoot.

```
Extra ondersteuning ◄────────── Standaard ──────────► Extra uitdaging

  Begeleide               Reguliere              Verdieping &
  inoefening              opgavenset             verbreding
  
  Denkstappen             Opgaven zoals          Open opdrachten
  Hints                   ze in de methode       Modelextensies
  Formulekaarten          staan, zonder          Eigen context zoeken
  Invulformaten           extra hulp of          Kritische evaluatie
  Uitgewerkte antw.       extra uitdaging        Transfer naar ander domein
```

**Kernprincipe:** we maken materiaal voor drie niveaus, maar we labelen nooit naar moeilijkheid. De framing is altijd positief en neutraal.

| Niveau | Materiaal | Framing naar leerlingen |
|--------|-----------|------------------------|
| Extra ondersteuning | Begeleide inoefening (met denkstappen, hints, formules) | "Oefenen met denkstappen" |
| Standaard | Reguliere opgavenset (zonder extra scaffolding of uitdaging) | De standaard werkwijze |
| Extra uitdaging | Verdiepingsopdrachten (open, evaluatief, transfervragen) | "Verdieping" of "Denkertje" |

### 1.2 Wanneer welk niveau?

**Extra ondersteuning (scaffolding) is bedoeld voor leerlingen die:**
- Vastlopen bij het structureren van hun aanpak
- De formules kennen maar niet weten welke ze moeten gebruiken
- Het concept begrijpen maar het niet zelfstandig kunnen toepassen
- Baat hebben bij expliciete tussenstappen

**Standaard is bedoeld voor leerlingen die:**
- De stof in de les hebben gevolgd en zelfstandig aan de slag kunnen
- Af en toe een fout maken maar zichzelf kunnen corrigeren
- Geen extra hulp nodig hebben maar ook niet om meer vragen

**Extra uitdaging is bedoeld voor leerlingen die:**
- De standaardopgaven snel en correct afmaken
- Behoefte hebben aan meer diepgang of breedte
- Gebaat zijn bij hogere Bloom-niveaus (analyseren, evalueren, creëren)
- Klaar zijn om kennis toe te passen in onbekende contexten

### 1.3 Ontwerpregels per niveau

**Extra ondersteuning — scaffolding-materiaal:**
- Bied denkstappen, hints, formuleherinneringen, invulformaten
- Werk antwoorden uitgebreid uit met uitleg (het "waarom")
- Bouw scaffolding af over de oefeningen heen (fading)
- Gebruik de begeleide inoefening-template uit econ-word-templates

**Standaard — regulier materiaal:**
- Bied de opgaven aan zoals ze zijn, zonder extra tussenstappen
- Voeg geen scaffolding-elementen toe (geen denkstapboxen, geen hints)
- Het standaard antwoordmodel volstaat
- Dit is het basisproduct dat elke leerling krijgt

**Extra uitdaging — verdiepingsmateriaal:**
- Stel open vragen die evaluatie of creatie vereisen
- Laat leerlingen een model uitbreiden of bekritiseren
- Vraag om transfer: pas het concept toe in een onbekende context
- Bied GEEN tussenstappen, hints of formulekaarten — sterke leerlingen hebben die niet nodig en ze vertragen het denkproces
- Eventueel: laat leerlingen hun eigen opgaven ontwerpen

### 1.4 Wat NIET in verdiepingsmateriaal hoort

Het is verleidelijk om verdiepingsmateriaal "gewoon moeilijker" te maken door langere berekeningen of meer deelvragen toe te voegen. Dat is geen verdieping, dat is meer van hetzelfde.

| ❌ Geen echte verdieping | ✅ Echte verdieping |
|--------------------------|---------------------|
| Meer rekenwerk (langere getallen) | Een model bekritiseren ("Wanneer klopt MO = MK niet?") |
| Meer deelvragen over dezelfde vaardigheid | Transfer naar een nieuwe markt/context |
| Dezelfde berekening met andere getallen | Een beleidsvoorstel schrijven en onderbouwen |
| Extra stappen in een keten | Twee modellen vergelijken (bijv. Cournot vs Bertrand) |
| Moeilijkere formules memoriseren | Zelf een model ontwerpen of uitbreiden |

---

## PART 2: DIDACTISCHE PRINCIPES

### 2.1 Scaffolding (Vygotsky → Wood → Van de Pol)

Scaffolding is tijdelijke ondersteuning die geleidelijk wordt afgebouwd naarmate leerlingen competenter worden. Het werkt binnen de Zone van Naaste Ontwikkeling: net boven wat de leerling zelfstandig kan, maar bereikbaar met hulp.

**Belangrijk:** scaffolding is specifiek bedoeld voor leerlingen die extra ondersteuning nodig hebben. Het is geen standaard voor alle leerlingen — bij leerlingen die de stof al beheersen werkt scaffolding eerder vertragend dan helpend.

**Het vierstappenmodel (Van de Pol, 2012):**

| Stap | Actie | Voorbeeldvragen |
|------|-------|-----------------|
| 1. Diagnose | Achterhaal waar de leerling vastloopt | "Wat heb je al gedaan?" / "Waar gaat het mis?" |
| 2. Check | Controleer of je interpretatie klopt | "Dus je weet niet hoe je MO moet afleiden?" |
| 3. Hulp | Bied ondersteuning op maat | Vraag stellen / hint geven / uitleg / hulpmiddel |
| 4. Begripscheck | Controleer of de leerling het snapt | "Kun je het nu in eigen woorden uitleggen?" |

**Twee vormen:**
- **Gepland** → ingebouwd in het materiaal (denkstappen, hints, formulekaarten, deels ingevulde antwoorden). Alleen in begeleide inoefening, niet in standaardmateriaal.
- **Interactief** → spontaan in het onderwijsleergesprek (doorvragen, herformuleren, hardop denken). Kan voor elke leerling, ook de sterke.

### 2.2 Cognitieve belasting (Sweller)

Leerlingen kunnen maar een beperkte hoeveelheid nieuwe informatie tegelijk verwerken. Bij economie is dit extra relevant omdat veel opgaven tegelijkertijd een model/instrument (grafiek, formule) én de economische theorie erachter vereisen.

**Drie typen belasting:**

| Type | Wat | Doe ermee |
|------|-----|-----------|
| Intrinsiek | Complexiteit van de stof zelf | Niet te vermijden, wel op te splitsen |
| Extrinsiek | Belasting door slecht ontwerp | Minimaliseer: helder taalgebruik, logische opbouw, geen afleiding |
| Germaan | Belasting die leidt tot leren | Maximaliseer: verbanden leggen, voorbeelden, oefening |

**Praktische vuistregels:**
1. Leer het instrument (grafiek tekenen) APART van de theorie (waarom MO = MK)
2. Geef uitgewerkte voorbeelden (worked examples) bij nieuwe vaardigheden — maar alleen voor leerlingen die ze nodig hebben. Bij gevorderde leerlingen werken uitgewerkte voorbeelden juist averechts (expertise reversal effect).
3. Bouw complexiteit pas op als de basis staat
4. Combineer tekst en beeld (dual coding) — niet tekst óf beeld, maar samen

### 2.3 Dual Coding (Paivio/Mayer)

Informatie wordt beter onthouden als het via twee kanalen binnenkomt: verbaal (tekst/spraak) en visueel (beeld/diagram/kleur). Dit geldt voor alle niveaus.

**Toepassing in onze materialen:**
- Domeincodering (blauw/amber/groen) → visuele herkenning zonder te lezen
- Grafieken naast tekstuele uitleg → twee paden naar hetzelfde concept
- Stroomdiagrammen voor redeneerkettingen → visuele structuur voor causale logica
- Formuleboxen in monospace → visueel onderscheid van lopende tekst

### 2.4 Positieve framing

**Kernregel: nooit labels die een negatief zelfbeeld versterken.**

| ❌ Niet gebruiken | ✅ Wel gebruiken |
|-------------------|-----------------|
| "Makkelijke versie" | "Begeleide inoefening" |
| "Basisniveau" | "Stap-voor-stap werkblad" |
| "Hulp bij moeite" | "Oefenen met denkstappen" |
| "Versimpeld" | "Overzicht met formulekaart" |
| "Zwakke leerlingen" | "Leerlingen die baat hebben bij extra structuur" |
| "Moeilijke versie" | "Verdieping" |
| "Voor de slimme leerlingen" | "Denkertje" of "Bonusopgave" |

**Rationale:** door materiaal neutraal te framen vermijd je dat leerlingen zich gelabeld voelen — in beide richtingen. Een leerling die de begeleide inoefening pakt moet zich niet "dom" voelen; een leerling die de verdieping overslaat moet zich niet "lui" voelen.

---

## PART 3: SCAFFOLDING-NIVEAUS (voor begeleide inoefening)

Dit deel is uitsluitend van toepassing wanneer je materiaal maakt voor leerlingen die extra ondersteuning nodig hebben. Voor standaardmateriaal en verdiepingsmateriaal: sla dit deel over.

### 3.1 Het scaffolding-spectrum

| Niveau | Naam | Wat de leerling krijgt | Wanneer |
|--------|------|----------------------|---------|
| 0 | Geen scaffolding | Alleen de vraag | Standaard opgavenset (niet in begeleide inoefening) |
| 1 | Lichte hint | Één zin die richting geeft | Leerling weet het concept maar mist de ingang |
| 2 | Denkstappen | Genummerde stappen als leidraad | Leerling kent de stof maar kan het niet structureren |
| 3 | Formule-herinnering | Relevante formules bij de vraag | Leerling vergeet welke formule nodig is |
| 4 | Invulformaat | Deels ingevuld antwoord | Leerling weet de stappen maar maakt rekenfouten |
| 5 | Volledig uitgewerkt | Antwoord + uitleg waarom | Naslag, zelfstudie, herkansing |

**De begeleide inoefening combineert niveau 1–4.** Het antwoordendocument voegt niveau 5 toe.

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

---

## PART 4: TAXONOMIE EN VRAAGONTWERP

### 4.1 Bloom's taxonomie voor economie

| Bloom-niveau | Economie-voorbeeld | Signaalwoorden in de vraag | Geschikt voor |
|--------------|-------------------|--------------------------|---------------|
| Onthouden | "Noem de vier marktvormen" | Noem, som op, geef de definitie van | Alle niveaus |
| Begrijpen | "Leg uit waarom MO = MK winst maximaliseert" | Leg uit, beschrijf, geef aan waarom | Alle niveaus |
| Toepassen | "Bereken de evenwichtsprijs" | Bereken, teken, leid af | Alle niveaus |
| Analyseren | "Vergelijk de welvaart vóór en na de belasting" | Vergelijk, analyseer, onderscheid | Standaard + verdieping |
| Evalueren | "Beoordeel of prijsdiscriminatie de welvaart verhoogt" | Beoordeel, beredeneer of, is het terecht dat | Verdieping |
| Creëren | "Stel een beleidsmaatregel voor" | Bedenk, ontwerp, stel voor | Verdieping |

**Differentiatie via Bloom:** de standaardopgaven bewegen zich vooral op onthouden/begrijpen/toepassen. De verdieping tilt door naar analyseren/evalueren/creëren.

### 4.2 Vraagopbouw per documenttype

**Nieuwsopdracht (7 vragen, oplopend):**
```
1. Invul (onthouden)        → "De prijs is gestegen/gedaald"
2. Invul (begrijpen)        → "Hierdoor neemt de vraag toe/af"
3. Noem-vraag (onthouden)   → "Noem twee voordelen van..."
4. Rekenopgave (toepassen)  → Eén stap, concrete getallen uit het artikel
5. Diagramvraag (analyseren) → Verwijs naar de visual op pagina 1
6. Begripsvraag (begrijpen)  → Koppel een economisch begrip aan het nieuws
7. Open vraag (evalueren)    → "Welke maatregel zou jij voorstellen?"
```

**Begeleide inoefening (volgt de structuur van de originele opgaven):**
- Behoud de originele vraagstelling
- Voeg scaffolding toe op basis van de beslisboom (Part 3.3)
- Maak antwoorden uitgebreider dan het originele antwoordmodel
- Voeg uitleg-boxen toe die het "waarom" verklaren

**Verdiepingsopdrachten:**
- Stel open vragen op Bloom-niveau analyseren/evalueren/creëren
- Geef context maar geen tussenstappen of hints
- Vraag om onderbouwing, vergelijking, of ontwerp
- Eén verdiepingsopdracht per paragraaf is voldoende

**Toets (summatief):**
- Dek alle leerdoelen af (maak een toetsmatrijs)
- Mix Bloom-niveaus: ~30% onthouden/begrijpen, ~40% toepassen, ~30% analyseren/evalueren
- Eén open vraag (evalueren/creëren)
- Totaal: 5-7 opgaven, 80-120 minuten

### 4.3 Toetsmatrijs-template

| Leerdoel | Opgave | Bloom-niveau | Punten | % |
|----------|--------|-------------|--------|---|
| MO = MK toepassen | 1b | Toepassen | 8 | 10% |
| CS berekenen | 2a | Toepassen | 6 | 7.5% |
| ... | ... | ... | ... | ... |
| **Totaal** | | | **80** | **100%** |

**Controle:** elk leerdoel minimaal 1× getoetst. Geen leerdoel > 25% van de punten.

---

## PART 5: ECONOMIE-SPECIFIEKE DIDACTIEK

### 5.1 Concept-context-benadering

Het vwo-programma werkt met concepten (ruilen, samenwerken) die in verschillende contexten worden toegepast. De aanpak verschilt per niveau:

**Voor leerlingen die extra ondersteuning nodig hebben — van concreet naar abstract:**
1. Start met een herkenbare context (supermarktprijzen, Spotify-abonnement)
2. Introduceer het economische concept (monopolie, prijsdiscriminatie)
3. Formaliseer met formules en grafieken
4. Pas toe in dezelfde context

**Voor standaard — van concreet naar abstract met transfer:**
1. Start met een herkenbare context
2. Introduceer concept en formaliseer
3. Pas toe in een nieuwe, vergelijkbare context

**Voor leerlingen die extra uitdaging zoeken — van abstract naar concreet:**
1. Introduceer het model direct (MO = MK)
2. Werk een kort voorbeeld uit
3. Laat de leerling zelf een passende context zoeken
4. Laat de leerling het model uitbreiden of bekritiseren

### 5.2 Causaliteitsketens

Economische redeneringen zijn vaak ketens van oorzaak en gevolg. De scaffolding verschilt per niveau:

| Fase | Niveau | Ondersteuning |
|------|--------|--------------|
| Voordoen | Extra ondersteuning | Docent bouwt de keten hardop op, leerling kijkt mee |
| Begeleid invullen | Extra ondersteuning | Keten met lege vakjes die de leerling invult |
| Zelfstandig opbouwen | Standaard | Leerling bouwt de hele keten zelf, alleen begin en eind gegeven |
| Transfer | Standaard + verdieping | Leerling past dezelfde ketenstructuur toe in een nieuwe context |
| Kritische evaluatie | Verdieping | Leerling bekritiseert de keten: welke schakels zijn aannames? Wanneer klopt de keten niet? |

**Voorbeeld van fading in ketens:**
```
Extra ondersteuning:  olieprijs ↑ → [productiekosten ↑] → aanbod ↓ → [prijs ↑]
Standaard:            minimumloon ↑ → [___] → [___] → [___]
Verdieping:           "De ECB verlaagt de rente. Bouw een keten van minimaal 5 schakels 
                       en geef aan welke schakels onzeker zijn."
```

### 5.3 Grafiekvaardigheid

Grafieken zijn het belangrijkste instrument in economie, maar ook de grootste bron van frustratie. Bouw grafiekvaardigheid op in lagen:

| Laag | Vaardigheid | Extra ondersteuning | Standaard | Verdieping |
|------|------------|---------------------|-----------|------------|
| 1. Aflezen | "Wat is de prijs bij Q = 20?" | Grafiek + pijl naar het punt | Alleen de vraag | — |
| 2. Verschuiven | "Teken de nieuwe vraaglijn" | Richting-hint + originele lijn | Alleen de vraag | — |
| 3. Tekenen | "Teken V, A, MO en MK" | Coördinatentabel + volgorde | Alleen formules | — |
| 4. Interpreteren | "Wat stelt het gearceerde vlak voor?" | Legenda met vlakken | Alleen de vraag | — |
| 5. Redeneren | "Wat gebeurt met CS bij belasting?" | — | Alleen de vraag | "Vergelijk twee scenario's en evalueer het welvaartseffect" |

### 5.4 Veelgemaakte fouten per onderwerp

Bouw deze in als waarschuwingsboxen (warningBox) in materiaal voor extra ondersteuning. In standaardmateriaal: noem ze kort. In verdiepingsmateriaal: laat leerlingen ze zelf ontdekken.

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
- Vergeten dat beide landen baat hebben bij handel (niet alleen de "goedkopere")

---

## PART 6: DIFFERENTIATIESTRATEGIEËN IN DE PRAKTIJK

### 6.1 Differentiëren zonder te labelen

| Strategie | Hoe | Framing |
|-----------|-----|---------|
| Keuze-opdrachten | Leerling kiest zelf welke oefening | "Kies 3 van de 5 opgaven" |
| Begeleide inoefening | Document met scaffolding, naast de reguliere set | "Oefenen met denkstappen" |
| Verdiepingsopdracht | Open vraag voor snelle leerlingen | "Denkertje" of "Bonusopgave" |
| Formulekaart | Overzicht formules, beschikbaar voor wie dat wil | "Naslagblad" |
| Peerfeedback | Leerlingen helpen elkaar | "Controleer elkaars werk" |
| Expert-opdracht | Sterke leerling legt het uit aan een ander | "Leg uit aan je buurman hoe je dit aanpakt" |

### 6.2 Timing van differentiatie in de les

```
┌─────────────────────────────────────────────┐
│ VOOR de les                                  │
│ Extra ondersteuning: voorkennis-document     │
│ Extra uitdaging: vooruitlezen / voorwerk     │
├─────────────────────────────────────────────┤
│ TIJDENS de les                               │
│ Iedereen: presentatie + standaard uitleg     │
│ Extra ondersteuning: begeleide inoefening    │
│ Extra uitdaging: verdiepingsopdracht         │
├─────────────────────────────────────────────┤
│ NA de les                                    │
│ Extra ondersteuning: antwoordendocument      │
│ Standaard: vaardigheden-document nalezen     │
│ Extra uitdaging: eigen context uitwerken     │
└─────────────────────────────────────────────┘
```

---

## PART 7: FORMATIEF EVALUEREN

### 7.1 Check-in momenten

Bouw checkpoints in het materiaal:

| Moment | Instrument | Voorbeeld |
|--------|-----------|-----------|
| Start les | Instapvraag | "Schrijf in 1 zin op wat je nog weet van vorige les" |
| Na theorie | Begripscheck | CheckBox in presentatie: "Kun je in eigen woorden zeggen wat MO = MK betekent?" |
| Na oefening | Zelfcontrole | "Vergelijk je antwoord met het antwoordmodel" |
| Eind les | Exitticket | "Schrijf 1 ding op dat je nu kunt dat je aan het begin niet kon" |

### 7.2 Signalen voor bijsturing

| Signaal | Mogelijke oorzaak | Actie |
|---------|------------------|-------|
| Veel leerlingen stoppen bij dezelfde vraag | Te grote sprong in moeilijkheid | Tussenvraag toevoegen |
| Leerlingen gebruiken verkeerde formule | Formule-herinnering ontbreekt | Formulekaart beschikbaar maken |
| Leerlingen maken rekenfouten maar snappen het concept | Wiskundige voorkennis onvoldoende | Voorkennis-document inzetten |
| Leerlingen kopiëren antwoorden zonder begrip | Antwoorden te makkelijk bereikbaar | Antwoorden pas na de les delen |
| Snelle leerlingen zijn klaar en gaan zitten | Geen verdiepingsmateriaal beschikbaar | Verdiepingsopdracht paraat hebben |

---

## PART 8: BESLISREGELS SAMENGEVAT

### Bij het ontwerpen van elk materiaal:

1. **Differentieer bewust** → maak materiaal voor extra ondersteuning, standaard én extra uitdaging
2. **Eén concept per slide/sectie** → cognitieve belasting laag houden
3. **Van concreet naar abstract** → eerst context, dan formule (behalve bij verdieping)
4. **Scaffolding alleen waar nodig** → begeleide inoefening is voor wie het nodig heeft, niet voor iedereen
5. **Verdieping is niet "meer van hetzelfde"** → hogere Bloom-niveaus, niet meer rekenwerk
6. **Positieve framing** → "begeleide inoefening" en "verdieping", geen negatieve labels
7. **Fading over oefeningen** → veel hulp bij oefening 1, geen hulp bij oefening 8
8. **Uitleg bij antwoorden** → niet alleen WAT het antwoord is, maar WAAROM
9. **Formatief inbouwen** → checkpoints die de leerling en docent informeren
10. **Visuele consistentie** → zelfde kleuren, fonts en componenten in alle documenten

---

## NEVER DO

- Materiaal labelen als "makkelijk", "basis", of "voor zwakke leerlingen"
- Materiaal labelen als "moeilijk" of "voor slimme leerlingen"
- Scaffolding standaard in alle materialen stoppen (het hoort alleen in begeleide inoefening)
- Denkstappen, hints of formulekaarten toevoegen aan verdiepingsmateriaal (die horen daar niet)
- Scaffolding aanbieden zonder fading-strategie (dan wordt het een kruk)
- Verdieping ontwerpen als "meer van hetzelfde" (langere sommen, meer deelvragen)
- Antwoorden geven zonder uitleg (dan leren ze alleen het antwoord, niet de redenering)
- Theorie uitleggen zonder concreet voorbeeld
- Grafieken introduceren zonder eerst de onderdelen apart te oefenen
- Meer dan 7 leerdoelen per les (cognitieve overbelasting)
- Een toets maken zonder toetsmatrijs (dan toets je willekeurig)
- Een redeneerketen laten oefenen zonder eerst het model voor te doen
- Een presentatie maken zonder speaker notes (de uitleg is net zo belangrijk als de slides)
- Verdiepingsopdrachten achter slot en grendel zetten — ze moeten voor iedereen beschikbaar zijn

---

Apply this skill to the following task: $ARGUMENTS

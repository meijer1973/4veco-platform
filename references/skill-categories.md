# Skill-categorieën — Reference for Economics Materials

```
last_verified: 2026-04-19
source: consolidated from vraagtypen-en-opgaveontwerp.md, didactiek-principes.md,
        economie-terminologie.md, economic_mathematical_precision_reference.md,
        inspectie-standaarden.md, engines/skilltree/base-elements.js,
        syllabus-economie-vwo-2026-versie-2.pdf
research_base: CvTE examenprogramma economie vwo 2026 (Domein A),
               Tweede Commissie Teulings, Bloom's taxonomy
```

Dit document is de **single source of truth** voor de categorisering van leerlingvaardigheden op het 4veco-platform. Het biedt een gedeeld vocabulaire waarmee opgaven, skill-bestanden, builders en quality control (QC) getagd en gecontroleerd kunnen worden op dekking en balans.

Wat dit document **wel** is:
- Een tagging-vocabulaire voor cognitieve vaardigheidscategorieën (HOE de leerling werkt).
- Een mapping tussen CvTE Domein A, vraagtypen, Bloom-niveaus, en content-skills (F/B/S/E).

Wat dit document **niet** is:
- Geen syllabus of leerdoelenlijst (zie `syllabus-economie-vwo-2026-versie-2.pdf` en `source-data/module-X/skilltree/*.js`).
- Geen vervanging van `engines/skilltree/base-elements.js` (dat beschrijft WAT de leerling weet; dit document beschrijft HOE).
- Geen duplicaat van `vraagtypen-en-opgaveontwerp.md` (die beschrijft de vraagtype-taxonomie zelf; hier verwijzen we ernaar).

---

## PART 1: RELATIE MET CvTE DOMEIN A

De officiële CvTE-syllabus (`syllabus-economie-vwo-2026-versie-2.pdf`) definieert alle inhoudelijke domeinen (B–I) "in combinatie met Domein A". Domein A is dus de officiële categorisering van vaardigheden. Het 4veco-platform hanteert een werkbare 8-categorieën-uitwerking die volledig afleidbaar is uit A1–A5.

| CvTE-subdomein | Officiële titel | Platform-categorie(ën) |
|----------------|-----------------|------------------------|
| A1 | Informatievaardigheden | 5. Bron- en informatievaardigheden, 6. Begrippen & classificatie, 7. Terminologie (recall) — zie noot |
| A2 | Rekenkundig en/of grafisch onderbouwen | 1. Rekenen, 2. Grafisch werken, 3. Redeneren (voor zover rekenkundig/grafisch ondersteund) |
| A3 | Standpuntbepaling | 6. Standpunt & evaluatie |
| A4 | Strategisch inzicht (vwo-specifiek) | 7. Strategisch inzicht |
| A5 | Experimenten (SE-only, niet CSE) | 9. Onderzoek/experimenten (optioneel, zie §4) |

**Noot bij A1:** CvTE behandelt informatievaardigheden als overkoepelend (tekst, tabel, figuur, begrippen). Het platform splitst dit in "bron-interpretatie" (categorie 5) en "begrippen & classificatie" (categorie 4), omdat deze in de praktijk heel verschillend getoetst worden: bron-interpretatie via "Leg uit met behulp van tabel/figuur…", en classificatie via "Is X een Y? Motiveer…".

**Noot bij A2:** CvTE schrijft expliciet dat rekenkundige en grafische vaardigheden "sterk overlappen" en dat grafisch werk in (vrijwel) elke context moet voorkomen. Het platform houdt ze als twee aparte categorieën, omdat de fading-trajecten en scaffolding-niveaus verschillen (zie `didactiek-principes.md` § scaffolding).

---

## PART 2: DE 8 CATEGORIEËN

Elke opgave op het platform kan getagd worden met **één primaire** categorie en optioneel **één of twee secundaire** categorieën. Een "Leg uit met behulp van tabel"-opgave is bijvoorbeeld primair categorie 5 (bron) en secundair categorie 3 (redeneren).

---

### 2.1 Rekenen

**Definitie.** Numerieke berekeningen: formule identificeren, data extraheren, substitueren, meerdere stappen doorrekenen, eenheden en afronding correct hanteren.

**Typische vraagtypen.** "Bereken…" — zie vraagtype 2 in `vraagtypen-en-opgaveontwerp.md` § 1.2.

**Bloom-niveau(s).** Toepassen (hoofdzakelijk), Analyseren bij meer-stapsberekeningen met tussenresultaten.

**Voorbeeldopgave.** "Bereken de prijselasticiteit van de vraag bij een prijsstijging van €2,00 naar €2,20 waarbij de gevraagde hoeveelheid daalt van 800 naar 720 stuks."

**Gekoppelde F/B/S/E-skills** (uit `engines/skilltree/base-elements.js`).
- F-laag: F1 (lineaire functie), F2 (vergelijking oplossen), F3 (functievorm omzetten), F4 (waarden invullen), F6 (afgeleide).
- B-laag: B2 (TO), B3 (TK), B5 (MO), B6 (MK), B7 (GTK), B8–B10 (elasticiteiten).
- S-laag: S1 (surplus), S2 (MO=MK), S3 (winst), S4 (break-even), S10 (MK=GTK).

**Veelvoorkomende misconcepties.**
- Indexcijferverandering van 108 naar 112 is niet 4% inflatie (zie `economic_mathematical_precision_reference.md` § 8.3).
- Afronding in operationele context: 714,3 broden → 715 (niet 714); zie `economic_mathematical_precision_reference.md` § 8.4.

---

### 2.2 Grafisch werken

**Definitie.** Grafieken lezen, interpreteren, tekenen, verschuiven, arceren; onderscheiden van beweging over een curve versus verschuiving van een curve.

**Typische vraagtypen.** "Teken…", "Arceer…", "Leg uit met behulp van figuur…" — zie vraagtypen 5 en 6 in `vraagtypen-en-opgaveontwerp.md` § 1.2.

**Bloom-niveau(s).** Toepassen, Analyseren.

**Voorbeeldopgave.** "Arceer in figuur 2 het consumentensurplus bij evenwichtsprijs Pe = €4."

**Gekoppelde F/B/S/E-skills.**
- F-laag: F5 (oppervlakte berekenen), F7 (snijpunten vinden).
- B-laag: B1 (evenwicht).
- S-laag: S1 (surplus), S5 (heffing), S7 (minimumprijs), S8 (maximumprijs), S9 (subsidie).
- E-laag: E2 (consumentensurplus), E4 (welvaartsverlies), E6 (invoerrecht).

**Veelvoorkomende misconcepties.**
- "Een prijsverandering verschuift de vraagcurve" — dit is een beweging ÓP de curve (zie `didactiek-principes.md` § threshold concepts).
- Schematische versus numeriek-exacte grafieken verwisselen (zie `economic_mathematical_precision_reference.md` § 9.5).

---

### 2.3 Redeneren

**Definitie.** Causale ketens construeren (twee schakels "Daardoor…") tussen gegeven en conclusie; richting bepalen (stijgt/daalt) en daarna mechanisme toelichten; uitleggen WAAROM een model werkt, niet alleen DAT het werkt.

**Typische vraagtypen.** "Leg uit dat…", "Leg uit of…", "Verklaar…" — zie vraagtypen 1 en 3 in `vraagtypen-en-opgaveontwerp.md` § 1.2.

**Bloom-niveau(s).** Begrijpen (waarom een model werkt), Analyseren (meer-stapsketens).

**Voorbeeldopgave.** "Leg uit dat een stijging van de olieprijs leidt tot een hogere evenwichtsprijs op de markt voor plastic verpakkingen. Gebruik twee schakels."

**Gekoppelde F/B/S/E-skills.** Redeneren is meestal een secundaire categorie naast een inhoudelijke skill uit B-, S- of E-laag; elke opgave die om een causale keten vraagt activeert de onderliggende content-skill plus de redeneervaardigheid.

**Veelvoorkomende misconcepties.**
- Slechts één schakel geven waar er twee gevraagd zijn (halve punten).
- "Omdat de prijs stijgt, daalt het aanbod" — verwarring tussen beweging en verschuiving.

---

### 2.4 Begrippen & classificatie

**Definitie.** Een definitie oproepen en toepassen op een concrete casus om ja/nee te concluderen. Dit is de categorie waar de vraag "Is Google een monopolist?" thuishoort: leerling recalt de definitie van een monopolie (één aanbieder, hoge toetredingsbarrières), toetst de criteria tegen Google, en formuleert conclusie + motivatie.

**Typische vraagtypen.** "Is X een Y? Motiveer." — zie vraagtype 4 in `vraagtypen-en-opgaveontwerp.md` § 1.2.

**Bloom-niveau(s).** Begrijpen, Toepassen.

**Voorbeeldopgave.** "Is Google een monopolist op de markt voor zoekmachines? Motiveer je antwoord met de kenmerken van een monopolie."

**Gekoppelde F/B/S/E-skills.**
- B-laag: B8–B10 (elasticiteiten → classificeren van goederen als normaal/inferieur, substituten/complementen).
- Marktvormen (monopolie, oligopolie, volledige mededinging) — behandeld in module 3.
- Begrippenkennis uit `economie-terminologie.md`.

**Veelvoorkomende misconcepties.**
- Conclusie zonder motivatie ("ja" / "nee" zonder criteria te benoemen).
- Synonieme verwarring: "publieke goederen" in plaats van "collectieve goederen" (zie `economie-terminologie.md` § common pitfalls).
- Factorclassificatie: "stijging substituutprijs" abusievelijk als "voorkeursverandering" categoriseren (zie `economic_mathematical_precision_reference.md` § 4.3).

---

### 2.5 Bron- en informatievaardigheden

**Definitie.** De economische kern uit een tekst, tabel, figuur of nieuwsbericht halen; relevante data selecteren; feit van mening onderscheiden; irrelevante informatie negeren.

**Typische vraagtypen.** "Leg uit met behulp van [tabel/figuur]…", "Noem…" (bij data-extractie) — zie vraagtypen 6 en 7 in `vraagtypen-en-opgaveontwerp.md` § 1.2.

**Bloom-niveau(s).** Toepassen, Analyseren.

**Voorbeeldopgave.** "Leg met behulp van tabel 1 uit dat het gemiddeld inkomen in Nederland in 2023 hoger was dan in 2020 in reële zin."

**Gekoppelde F/B/S/E-skills.** Secundaire categorie bij vrijwel alle inhoudelijke opgaven in consolidation- en toetscontexten (zie `vraagtypen-en-opgaveontwerp.md` § 2.2 consolidation).

**Veelvoorkomende misconcepties.**
- Verwarring reëel/nominaal bij tabeldata (zie `didactiek-principes.md` § threshold concepts).
- Antwoord begint niet met bronverwijzing ("Uit de tabel lezen we af dat…").

---

### 2.6 Standpunt & evaluatie

**Definitie.** Een onderbouwd standpunt innemen over een economisch vraagstuk of beleidsmaatregel: argumenten pro en contra wegen, criteria toepassen, en een gemotiveerde conclusie formuleren. Dit is CvTE Domein A3.

**Typische vraagtypen.** "Beoordeel…", "Beargumenteer je mening…", "Geef beargumenteerd je standpunt…".

**Bloom-niveau(s).** Evalueren.

**Voorbeeldopgave.** "Beoordeel de stelling: 'Een minimumprijs voor melk is in het belang van de Nederlandse consument.' Geef minimaal één argument voor, één argument tegen, en je conclusie."

**Gekoppelde F/B/S/E-skills.** Vaak gebouwd op E-laag skills (E4 welvaartsverlies, E6 invoerrecht, E7 monopoliewinst, E8 prijsdiscriminatie) — beleidsanalyses eisen welvaartseconomisch begrip.

**Veelvoorkomende misconcepties.**
- Standpunt zonder tegenargument (eenzijdig).
- Conclusie ontbreekt of is slechts een herhaling van het standpunt zonder afweging.

---

### 2.7 Strategisch inzicht

**Definitie.** Redeneren over strategische interactie: speltheorie, oligopolie-gedrag, commitment, prikkels, asymmetrische informatie. Voorspellen hoe rationele actoren reageren op regels en incentives. Dit is CvTE Domein A4 en vwo-specifiek (geen havo-equivalent).

**Typische vraagtypen.** Scenario-analyse; "Leg uit welke strategie bedrijf X zal kiezen gegeven…"; pay-off matrix-analyse.

**Bloom-niveau(s).** Analyseren, Evalueren.

**Voorbeeldopgave.** "In een duopolie overwegen bedrijf A en bedrijf B hun prijs te verlagen of gelijk te houden. Bepaal op basis van de pay-off matrix in figuur 3 welke uitkomst Nash-evenwicht is en leg uit waarom."

**Gekoppelde F/B/S/E-skills.** Behandeld in module met marktvormen (module 3) en gedragseconomie; pay-off-matrices komen ook terug in `econ-consolidation-builder` als standaard-bronmateriaal.

**Veelvoorkomende misconcepties.**
- Samenwerking aannemen waar dominant strategy theorie individueel gedrag voorspelt.
- Verwarring tussen Nash-evenwicht en Pareto-optimum.

---

### 2.8 Toetsvaardigheden

**Definitie.** Meta-vaardigheden voor toetsafname: instructiewoord herkennen ("Noem" vs "Leg uit" vs "Beoordeel") en antwoordvorm matchen; tijd beheren; modelantwoord onderscheiden van zwak antwoord; skills uit meerdere hoofdstukken integreren in één context.

**Typische vraagtypen.** Combinaties van alle andere categorieën onder tijdsdruk; proeftoetsen; integratieoefeningen.

**Bloom-niveau(s).** Toepassen tot Evalueren.

**Voorbeeldopgave.** Een 120-minuten proeftoets met 6–8 opgaven verdeeld over 3–4 contexten, waarbij elke opgave meerdere categorieën dekt — zie `econ-testprep-builder` en `vraagtypen-en-opgaveontwerp.md` § 2.3.

**Gekoppelde F/B/S/E-skills.** Integratie over hoofdstukken heen; activeert alle skills uit de voorafgaande paragrafen.

**Veelvoorkomende misconcepties.**
- Antwoordvorm matcht niet het instructiewoord (bijv. "Noem" beantwoorden met causale keten).
- Tijd uitlopen op vraag 1 waardoor latere (hoog-puntige) vragen onaf blijven.

---

## PART 3: OPTIONELE 9E CATEGORIE — ONDERZOEK / EXPERIMENTEN

**CvTE-subdomein.** A5 — experimenten (gedragseconomisch).

**Toetsing.** Uitsluitend schoolexamen (SE); **niet** op centraal examen (CSE).

**Definitie.** Economische experimenten ontwerpen, uitvoeren en interpreteren. Hypothesen opstellen, variabelen isoleren, data analyseren.

**Gebruik op platform.** Optioneel, afhankelijk van school-PTA. Wordt niet standaard opgenomen in paragraafopgaven, maar kan wel verschijnen in aparte SE-modules of nieuwsopdrachten (`econ-nieuws-exercise`). Als een school A5 in het PTA heeft, tag de betreffende opgaven met categorie 9.

---

## PART 4: HOE TE GEBRUIKEN

### 4.1 Voor skill-bestanden en builders

Elke opgave in een builder-output (`econ-exercise-builder`, `econ-consolidation-builder`, `econ-testprep-builder`) krijgt één **primaire** categorie en optioneel **één of twee secundaire** categorieën. Format in exercise metadata:

```yaml
categories:
  primary: rekenen
  secondary: [grafisch, bron-info]
```

Canonieke sleutels: `rekenen`, `grafisch`, `redeneren`, `begrippen`, `bron-info`, `standpunt`, `strategisch`, `toetsvaardigheden`, `onderzoek` (optioneel).

### 4.2 Voor QC (`econ-paragraph-review`, `econ-quality-control`)

Een reguliere **theorieparagraaf** moet minimaal **3 categorieën** dekken in haar opgavenset — in dezelfde geest als de bestaande Bloom-distributie-eis (Onthouden/Begrijpen ~25%, Toepassen ~40%, Analyseren/Evalueren ~35%; zie `vraagtypen-en-opgaveontwerp.md` § 4.1).

Een **consolidatieparagraaf** (§4 van elk hoofdstuk) moet minimaal **5 categorieën** dekken, omdat consolidatie per definitie integratief is.

Een **toetsvoorbereidingshoofdstuk** (hoofdstuk 5) moet alle 8 primaire categorieën dekken over de vier toetsprep-paragrafen samen.

### 4.3 Voor content-skills (F/B/S/E) in `engines/skilltree/base-elements.js`

Per F/B/S/E-skill is er een natuurlijke primaire categorie (zie §2.1–2.8 hierboven voor de mapping). Taggen is optioneel maar aanbevolen als nieuwe `category` field wordt toegevoegd aan `base-elements.js` in een latere iteratie.

---

## PART 5: CROSS-REFERENCES

| Onderwerp | Bestand |
|-----------|---------|
| Vraagtype-taxonomie (7 types) | `references/vraagtypen-en-opgaveontwerp.md` § 1.1–1.3 |
| Bloom-niveaus en distributie-eisen | `references/vraagtypen-en-opgaveontwerp.md` § 4.1 |
| Didactische principes (dual coding, scaffolding, misconcepties) | `references/didactiek-principes.md` § 1–7 |
| Content-skillhiërarchie (F/B/S/E) | `engines/skilltree/base-elements.js` |
| Per-paragraaf skill-mapping | `source-data/module-X/skilltree/*.js` |
| Officiële CvTE Domein A | `references/syllabus-economie-vwo-2026-versie-2.pdf` |
| Onderwijsinspectie-raamwerk (OP0–OP3) | `references/inspectie-standaarden.md` |
| Canonieke economische terminologie | `references/economie-terminologie.md` |
| Rekenkundige en modelmatige precisie | `references/economic_mathematical_precision_reference.md` |
| Amstelveen College kwaliteitsoverlay | `references/amstelveencollege_quality_standards.md` |

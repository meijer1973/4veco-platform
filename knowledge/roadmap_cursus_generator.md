# Roadmap: Geautomatiseerde Cursus-Blauwdruk Generator
## Claude Code plan voor herhaalbare productie van economie-cursusmateriaal

---

## Architectuuroverzicht

Het systeem heeft drie lagen:

**Laag 1: Skills** — Herbruikbare kennisbestanden die Claude Code leest vóór het genereren. Deze bevatten de ontwerpfilosofie, templates en domeinkennis.

**Laag 2: Inputspecificatie** — Een gestructureerd invoerbestand dat de gebruiker invult om een specifiek cursusjaar te definiëren (domeinen, niveau, aantal lessen, toetsstructuur, etc.)

**Laag 3: Generatorscripts** — Python-scripts die Claude Code uitvoert om de daadwerkelijke producten te genereren (blauwdruk-markdown, PDF, uiteindelijk lesmateriaal).

---

## Laag 1: Te bouwen skills

### Skill 1: `course-blueprint-design` (SKILL.md)

Bevat de ontwerpfilosofie uit het ontwerpproces. Dit is het "hoe te denken"-bestand dat Claude Code leest vóór het genereren van een blauwdruk.

**Inhoud:**
- Opgave-eerst ontwerpprincipe (elke paragraaf begint met een doelopgave)
- Slanke paragrafen / rijke consolidatie principe
- De gelijkmatige-moeilijkheidseis (geen paragraaf > 1 les)
- Bouwsteen-opbouwregels (nooit X introduceren vóór Y)
- Moeilijkheidsbeoordelingssysteem (⬜/🟨/🟥 met definities)
- Het toetsritme (klein halverwege boek, groot einde boek)
- Differentiëren-vóór-wiskunde aanpak
- Context- en motivatierichtlijnen
- Het paragraafstructuursjabloon (doelopgave → leerdoelen → moeilijkheidsnotities)
- Regels voor consolidatieparagrafen (examenachtige bronnen, geen nieuwe theorie)
- Bufferstrategie (lichter laatste boek)

### Skill 2: `economics-domain-knowledge` (SKILL.md)

Bevat wat elk domein van het Nederlandse economie-examenprogramma daadwerkelijk inhoudt, hoe moeilijk elk onderwerp is, en voorkennis-ketens.

**Inhoud:**
- Volledige domeinkaart (D t/m I) met subdomeinen en eindtermen
- Moeilijkheidsbeoordelingen per onderwerp op basis van de analyse (bijv. "monopolie-winstmaximalisatie is de zwaarste individuele les")
- Voorkennis-ketens (welke onderwerpen vereisen welke voorkennis)
- Veelvoorkomende misconcepties per onderwerp (verschuiving vs. beweging, indexpunten vs. procenten, etc.)
- Vereiste vaardigheden per onderwerp (verbaal, grafisch, rekenkundig — uit syllabus)
- Typisch aantal lessen per onderwerp op VWO- vs. HAVO-niveau
- Sleutelformules en wanneer ze voor het eerst worden geïntroduceerd
- Differentiëervereisten per onderwerp

### Skill 3: `course-output-templates` (SKILL.md)

Sjablonen voor de daadwerkelijke outputdocumenten.

**Inhoud:**
- Blauwdruk-markdownsjabloon (de structuur die we gebruikten)
- Ontwerpoverwegingen-sjabloon (het intro-onderdeel)
- Paragraafsjabloon (doelopgave + leerdoelen + moeilijkheidsnotities)
- Consolidatieparagraaf-sjabloon
- Toetsvoorbereidingshoofdstuk-sjabloon
- Aanbevelingen-sectionsjabloon
- PDF-opmaakspecificaties (kleuren, banners, lettertypen)

---

## Laag 2: Inputspecificatie

Een YAML-bestand dat de gebruiker invult. Claude Code leest dit als de "opdracht."

```yaml
# course-spec.yaml
course_name: "Economie VWO 5"
level: "vwo"  # of "havo"
year: "5"

# Structuur
books: 4
chapters_per_book: 5  # 4 theorie + 1 toetsvoorbereiding
paragraphs_per_chapter: 4  # 3 theorie + 1 consolidatie
exceptions: 
  - book: 1
    chapter: 4
    extra_theory_paragraphs: 1
    reason: "marginale analyse gesplitst"

# Timing
lessons_per_week: 2
school_weeks: 36
lesson_duration_minutes: 60
homework_minutes: 30

# Toetsen
test_structure:
  small_test:
    duration_minutes: 45
    placement: "after chapter 2"
    count_per_book: 1
  large_test:
    duration_minutes: 120
    placement: "end of book"
    count_per_book: 1

# Inhoud - welke domeinen worden behandeld
domains:
  - id: "D"
    name: "Markt"
    weight: "heavy"  # hoeveel boeken toewijzen
    subdomeinen:
      - "D1: Vraag en aanbod"
      - "D2: Marktstructuur"
      - "D3: Welvaart en economische politiek"
  - id: "H_partial"
    name: "Welvaart en groei (deels)"
    weight: "light"
    subdomeinen:
      - "H5: Arbeidsmarkt en werkloosheid"
  - id: "I_partial"
    name: "Goede tijden, slechte tijden (deels)"
    weight: "light"
    subdomeinen:
      - "Inflatie en koopkracht"

# Wat opnemen/uitsluiten
include:
  - "comparatief voordeel en handel"
  - "basisinflatie en prijsindexcijfers"
  - "wisselkoersen licht"
exclude:
  - "volledige financiële markten"
  - "volledige valutamarkten"
  - "IS-MB-GA model"
  - "Keynesiaans kruis"

# In te bouwen grondslagen
foundations:
  - "procentberekeningen"
  - "indexcijfers"
  - "grafieken lezen en tekenen"
  - "basisdifferentiëren (alleen kwadratisch)"

# Niveau-aanpassingen (vergeleken met referentie-VWO-cursus)
level_adjustments:
  # Voor HAVO-aanpassing:
  # - "vereenvoudig elasticiteit tot alleen prijselasticiteit"
  # - "laat algebraïsche vraagfunctieaggregatie vallen"
  # - "geef formules in plaats van ze af te leiden"
  # - "beperk monopolieberekening tot alleen grafisch"

# Ontwerp-overrides
design_overrides:
  - "elasticiteit: alleen eenvoudige formule (%ΔQ / %ΔP)"
  - "differentiëren: alleen machtsregel op kwadratische functies"
  - "prijsdiscriminatie: gecombineerde vraagcurve wordt gegeven"

# Uitvoertaal
language: "nl"
```

---

## Laag 3: Generatorscripts

### Script 1: `generate_blueprint.py`

**Input:** course-spec.yaml + skills
**Output:** Volledige blauwdruk-markdown

**Wat het doet:**
1. Leest de cursusspecificatie
2. Leest de domeinkennis-skill om onderwerpsvolgorde en moeilijkheid te bepalen
3. Leest de ontwerpprincipes-skill
4. Roept de Claude API aan om de blauwdruk in stadia te genereren:
   - Stadium 1: Boekniveau-overzicht (welke onderwerpen in welk boek)
   - Stadium 2: Hoofdstukniveau-overzicht (welke onderwerpen in welk hoofdstuk)
   - Stadium 3: Paragraafniveau-detail (doelopgaven, leerdoelen, moeilijkheidsnotities)
   - Stadium 4: Consolidatieparagrafen en toetsvoorbereidingshoofdstukken
   - Stadium 5: Aanbevelingen-sectie
   - Stadium 6: Ontwerpoverwegingen-intro
5. Assembleert tot één markdown-bestand

**Waarom gefaseerd:** Een enkele prompt die 1300+ regels produceert verliest samenhang. Gefaseerde generatie met de spec en eerdere stadia als context houdt elke aanroep gefocust.

### Script 2: `generate_pdf.py`

**Input:** Blauwdruk-markdown
**Output:** Opgemaakt PDF

**Wat het doet:**
- Parsed de markdownstructuur
- Past het opmaaksjabloon toe (banners, moeilijkheidsbalken, opgaveblokken)
- Genereert gepagineerd A4-PDF met paginanummering
- Dit is in essentie het script dat we al schreven, geparametriseerd voor taal en opmaak

### Script 3: `validate_blueprint.py`

**Input:** Blauwdruk-markdown + course-spec.yaml
**Output:** Validatierapport

**Wat het controleert:**
- Totaal aantal lessen past binnen beschikbare weken
- Geen paragraaf is beoordeeld als 🟥 zonder mitigatienotitie
- Alle voorkennis-ketens worden gerespecteerd (onderwerp X komt vóór onderwerp Y)
- Elke theorieparagraaf heeft: doelopgave, leerdoelen, moeilijkheidsnotities
- Elke consolidatieparagraaf noemt examenachtig bronmateriaal
- Toetsentiming is consistent met spec
- Geen concept wordt gebruikt vóórdat het is geïntroduceerd

### Script 4: `adapt_blueprint.py`

**Input:** Bestaande blauwdruk + aanpassingsspec
**Output:** Aangepaste blauwdruk voor ander niveau/jaar

**Wat het doet:**
- Neemt een VWO-blauwdruk en genereert een HAVO-versie, of
- Neemt een jaar-5-blauwdruk en genereert een jaar-6-blauwdruk
- Past niveau-aanpassingen toe uit de spec (vereenvoudig berekeningen, laat algebraïsche afleidingen vallen, voeg scaffolding toe)
- Herberekent moeilijkheidsbeoordelingen
- Past doelopgaven aan op het juiste niveau

---

## Bouwvolgorde

### Fase 1: Fundament (skills bouwen)

| Stap | Taak | Output |
|------|------|--------|
| 1 | `course-blueprint-design/SKILL.md` aanmaken | Ontwerpprincipes geëxtraheerd uit het ontwerpproces |
| 2 | `economics-domain-knowledge/SKILL.md` aanmaken | Domeinkennis gecodeerd uit onderzoek |
| 3 | `course-output-templates/SKILL.md` aanmaken | Markdown/PDF-sjablonen geformaliseerd |

### Fase 2: Kerngenerator

| Stap | Taak | Output |
|------|------|--------|
| 4 | YAML-inputspecificatieschema aanmaken met gedocumenteerd voorbeeld | `course-spec-template.yaml` |
| 5 | `generate_blueprint.py` bouwen met gefaseerde Claude API-aanroepen | Werkend blauwdruk-generatorscript |
| 6 | `generate_pdf.py` bouwen (aanpassen van bestaand script) | Werkend PDF-generatorscript |
| 7 | End-to-end testen: spec → blauwdruk → PDF voor de handmatig gebouwde cursus | Validatie dat output overeenkomt met handmatig product |

### Fase 3: Kwaliteitsborging

| Stap | Taak | Output |
|------|------|--------|
| 8 | `validate_blueprint.py` bouwen | Werkend validatiescript |
| 9 | Validatie uitvoeren op handmatig gebouwde blauwdruk om te kalibreren | Gekalibreerde validatieregels |
| 10 | Eventuele issues oplossen die de validator vindt | Verbeterde blauwdruk + validator |

### Fase 4: Aanpassing

| Stap | Taak | Output |
|------|------|--------|
| 11 | `adapt_blueprint.py` bouwen | Werkend aanpassingsscript |
| 12 | Testen: HAVO-aanpassing genereren uit VWO-blauwdruk | HAVO-blauwdruk |
| 13 | Testen: jaar-6-blauwdruk genereren met andere domeinen | Jaar-6-blauwdruk |

### Fase 5: Workflow-integratie

| Stap | Taak | Output |
|------|------|--------|
| 14 | Masterscript `build_course.sh` aanmaken dat alles koppelt: spec → blauwdruk → validatie → PDF | Eén-commando workflow |
| 15 | Volledige workflow documenteren in README | Gebruikersdocumentatie |

---

## Gebruikersworkflow

```
1. Gebruiker kopieert course-spec-template.yaml
2. Gebruiker vult in: niveau, domeinen, include/exclude, aanpassingen
3. Gebruiker voert uit: claude-code build_course.sh course-spec.yaml
4. Claude Code:
   - Leest skills
   - Leest spec
   - Genereert blauwdruk (gefaseerd)
   - Valideert
   - Genereert PDF
   - Presenteert output + validatierapport
5. Gebruiker reviewt, geeft commentaar
6. Gebruiker voert opnieuw uit met aanpassingen of bewerkt de blauwdruk direct
```

---

## Kernbesluit: Hoeveel Intelligentie Zit in Skills vs. Generator

De skills moeten **alle domeinkennis en ontwerpregels** bevatten. Het generatorscript moet **alleen de orkestratie-logica** bevatten (spec lezen, Claude gefaseerd aanroepen, output assembleren). Dit betekent:

| Wijziging | Wat wordt bijgewerkt |
|-----------|---------------------|
| Nieuw syllabusjaar | Domeinkennis-skill |
| Andere ontwerpfilosofie | Ontwerpprincipes-skill |
| Nieuw outputformaat | Nieuw sjabloon + generatorscript |
| Generatorscripts zelf | Veranderen zelden |

Deze scheiding betekent dat een docent de domeinkennis-skill zelf kan bijwerken (het is gewoon een markdown-bestand dat onderwerpen en hun moeilijkheid beschrijft) zonder code aan te raken.

---

## Mappenstructuur

```
/mnt/skills/user/
├── course-blueprint-design/
│   └── SKILL.md
├── economics-domain-knowledge/
│   └── SKILL.md
└── course-output-templates/
    └── SKILL.md

/home/claude/course-generator/
├── README.md
├── build_course.sh
├── templates/
│   └── course-spec-template.yaml
├── scripts/
│   ├── generate_blueprint.py
│   ├── generate_pdf.py
│   ├── validate_blueprint.py
│   └── adapt_blueprint.py
├── output/
│   ├── blauwdruk_economie_vwo5.md
│   └── blauwdruk_economie_vwo5.pdf
└── specs/
    ├── economie_vwo5.yaml
    ├── economie_vwo6.yaml
    └── economie_havo5.yaml
```

---

## Relatie tot Bestaande Skills

Dit systeem bouwt voort op en werkt samen met de bestaande skills:

- **`econ-didactiek`**: Bevat didactische principes → wordt aangevuld door `course-blueprint-design` met specifieke blauwdruk-ontwerpregels
- **`econ-word-templates`**: Produceert Word-lesmateriaal → kan in de toekomst worden aangestuurd door de blauwdruk (blauwdruk definieert WAT, Word-templates produceren HOE)
- **`econ-pptx-templates`**: Idem voor presentaties
- **`economic-graph`**: Produceert grafieken → kan worden aangeroepen vanuit lesmateriaal dat door de blauwdruk wordt gespecificeerd

De blauwdruk is het "wat" (welke inhoud, in welke volgorde, op welk niveau); de bestaande skills zijn het "hoe" (hoe de inhoud eruitziet als concreet lesmateriaal).

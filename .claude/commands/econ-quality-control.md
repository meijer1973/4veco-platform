---
name: econ-quality-control
description: "Quality control system for economics education materials, aligned with the Dutch Onderwijsinspectie framework (onderzoekskader 2021/2025). Two functions: (1) generates compact quality_ref tags during the paragraph build process, and (2) produces on-demand quality reports at any scope (paragraph, chapter, module, course) and any dimension (curriculum alignment, differentiation, didactisch handelen, coherence, kwaliteitscyclus). Use this skill whenever the user asks for a quality report, kwaliteitsrapport, kwaliteitscontrole, verantwoording, inspectie-verantwoording, or quality reference for economics lesson materials. Also trigger when the user says 'generate quality ref', 'add quality tag', 'quality check', 'inspectie check', or asks how materials align with OP0, OP1, OP2, OP3, SKA, or BKA standards. Trigger during the build process when the user is finishing a paragraph and needs the quality_ref appended. Also trigger when the user asks about the onderwijsinspectie, onderzoekskader, waarderingskader, or wants to defend pedagogical choices in materials."
---

# Economics Quality Control Skill v1

Quality assurance system for economics lesson materials, structured in two layers:
- **Layer 1: quality_ref** — compact YAML tag generated per paragraph during the build
- **Layer 2: quality reports** — on-demand documents assembled from quality_refs

**Companion skills:**
- `econ-didactiek` → pedagogical principles referenced in quality justifications
- `econ-word-templates` → Word document components being quality-checked
- `econ-pptx-templates` → PowerPoint components being quality-checked
- `economic-graph` → graph and visual components being quality-checked

**Reference files:**
- `references/inspectie-standaarden.md` → full mapping of inspectie standards to material requirements

---

## PART 0: FRESHNESS CHECK — MANDATORY BEFORE USE

### 0.1 Why freshness matters

This skill references legal frameworks (onderzoekskader, deugdelijkheidseisen) and government policy that change on a regular cycle. The onderzoekskader is updated annually (typically August 1) and overhauled every 4 years (next overhaul: 2027). Using outdated standards in quality reports — especially external-facing ones — undermines their credibility and may misrepresent compliance.

### 0.2 Reference file dating

Every reference file in this skill carries a `last_verified` date at the top. This date records when the content was last confirmed accurate against the official inspectie sources.

```
# inspectie-standaarden.md
# last_verified: 2026-04-12
# source: onderzoekskader 2021, bijgesteld 2025 (per 1 aug 2025)
# next_scheduled_update: onderzoekskader bijstelling aug 2026; overhaul aug 2027
```

The SKILL.md itself also carries a `skill_last_verified` date (see below).

**skill_last_verified: 2026-04-12**
**source_framework: onderzoekskader 2021, bijgesteld 2025**
**known_upcoming_changes: onderzoekskader 2027 (overhaul, expected aug 2027); bestuursbezoeken from March 2026; OR1 role in eindoordeel under review**

### 0.3 Cascading freshness rules

Before using this skill, check the `last_verified` date and apply these rules:

| Age of last_verified | Action | Rationale |
|---------------------|--------|-----------|
| **< 3 months** | No update needed. Proceed. | Unlikely anything changed in this window. |
| **3–9 months** | Quick check. Search for "onderzoekskader [year] wijzigingen" and "inspectie onderwijs nieuws". If no relevant changes found, update `last_verified` date and proceed. If changes found, update the reference file. | Annual bijstellingen happen in July/August. A 3–9 month window likely spans one cycle. |
| **> 9 months** | Thorough review required. Fetch the current onderzoekskader from onderwijsinspectie.nl. Compare all standards descriptions against the reference file. Update any changes. Update `last_verified` date. | Two or more update cycles may have passed. Risk of outdated information is high. |

### 0.4 Report-level freshness override

**When generating quality reports (Part 3), freshness requirements are stricter** because reports face external audiences (school board, inspectie, colleagues). Apply this override:

| Report audience | Freshness requirement |
|----------------|----------------------|
| Internal (developer, own use) | Standard cascading rules (0.3) apply |
| Internal (vaksectie, school team) | Maximum 6 months since last_verified. If older, do a quick check even if < 9 months. |
| External (bestuur, inspectie) | **Always do a quick check**, regardless of age. For reports explicitly prepared for inspectie visits, do a thorough review if > 3 months. |

### 0.5 How to perform a freshness check

**Quick check (5 minutes):**
1. Web search: `onderzoekskader [current year] wijzigingen inspectie onderwijs`
2. Web search: `inspectie onderwijs standaarden [current year]`
3. Check https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskaders for any bijstelling announcements
4. If no changes: update `last_verified` date, note "no changes found"
5. If changes found: update the specific standard(s) in the reference file, update `last_verified` date

**Thorough review (30 minutes):**
1. Fetch the current onderzoekskader document from onderwijsinspectie.nl
2. Compare each standard (OP0, OP1, OP2, OP3, SK1, OR1, SKA, BKA) against the reference file
3. Check for new standards or removed standards
4. Check for normering changes (what leads to onvoldoende/zeer zwak)
5. Check for policy announcements about future changes (e.g., onderzoekskader 2027 previews)
6. Update the reference file
7. Update `last_verified` date and `known_upcoming_changes`

### 0.6 Freshness in quality_refs

Individual quality_refs also carry a `generated` date. When assembling reports from quality_refs, note if any quality_refs predate the current `last_verified` of the inspectie standards. If the standards changed between the quality_ref generation and the report date, flag those quality_refs for review — their inspectie mappings may need updating.

---

## PART 1: THE INSPECTIE FRAMEWORK (SUMMARY)

The Onderwijsinspectie uses the *onderzoekskader* (research framework) to assess schools. The *waarderingskader* within it defines quality standards grouped into areas. For lesson material design, these standards are relevant:

### 1.1 Standards that apply to lesson materials

| Code | Name | What it means for materials |
|------|------|-----------------------------|
| **OP0** | Basisvaardigheden | Curriculum for taal, rekenen, burgerschap is doelgericht en samenhangend. Assessed from Aug 2025. |
| **OP1** | Aanbod | Content prepares students for further education, labor market, society. Covers all subjects including economics. |
| **OP2** | Zicht op ontwikkeling en begeleiding | Materials enable tracking student progress. Diagnostic tools, formative assessment, high expectations. |
| **OP3** | Pedagogisch-didactisch handelen | Evidence-based teaching practices: clear goals, monitoring, clear explanation, sufficient practice time, differentiation. **Kernstandaard.** |
| **SK1** | Veiligheid | Safe learning climate. Materials use positive framing, no stigmatizing labels. |
| **OR1** | Resultaten | Learning outcomes meet expectations. Materials contribute to exam preparation. **Kernstandaard.** |
| **SKA** | Sturen, kwaliteitszorg en ambitie | School-level quality cycle: plan-do-check-act on educational quality. |
| **BKA** | Besturing, kwaliteitszorg en ambitie | Board-level quality governance and financial management. |

### 1.2 What the inspectie observes for OP3 (most relevant)

The inspectie concretized OP3 in 2023 based on scientific evidence. During classroom observations, they look for:

1. **Stimulerend leerklimaat** — safe, activating environment; high expectations
2. **Ordelijk verloop** — efficient use of lesson time
3. **Lesdoel duidelijk** — learning goal communicated and visible
4. **Monitoring** — teacher checks during the lesson whether students are reaching the goal
5. **Duidelijke uitleg** — clear explanation of content
6. **Voldoende oefentijd** — students get enough time to practice
7. **Afstemming** — instruction, processing, and pacing adapted to individual and group needs

**For material design, criteria 3–7 translate directly into structural choices.**

→ For full standard descriptions and legal basis, see `references/inspectie-standaarden.md`

---

## PART 2: THE QUALITY_REF — PARAGRAPH-LEVEL TAG

### 2.1 When to generate

Generate a quality_ref at the end of every paragraph build, after all components are complete. It should also be generated retroactively for existing paragraphs when the user asks for a quality report that needs them.

### 2.2 Structure

The quality_ref is a YAML block stored as a `.yaml` file alongside the paragraph materials. It has four sections:

```yaml
# === QUALITY REFERENCE ===
# Generated: [date]
# Paragraph: [code + name]

quality_ref:
  # --- IDENTIFICATION ---
  paragraph: "3.2.3 Monopolie"
  module: "3 – Markt en overheid"
  chapter: "2 – Marktvormen en hun marktevenwicht"
  niveau: "vwo"
  
  # --- FRESHNESS ---
  generated: "YYYY-MM-DD"                    # date this quality_ref was created/last updated
  framework_version: "onderzoekskader 2021, bijgesteld 2025"  # which inspectie framework was current
  standards_verified: "YYYY-MM-DD"           # last_verified date of inspectie-standaarden.md at generation time
  
  # --- LEERDOELEN ---
  # Map every learning goal to eindterm, Bloom level, and which components address it
  leerdoelen:
    - id: L1
      beschrijving: "[what the student should be able to do]"
      eindterm: "[domein + subdomein code]"
      bloom: "[onthouden|begrijpen|toepassen|analyseren|evalueren|creëren]"
      gedekt_in: [presentatie, vaardigheden, opgaven_basis]  # which components cover this

  # --- COMPONENTEN ---
  # For each component: is it present, what is its purpose, which inspectie standards 
  # does it serve, and which didactiek principles does it implement?
  componenten:
    instapquiz:
      aanwezig: true|false
      doel: "[one-line purpose statement]"
      inspectie: [OP2]  # list of standards served
      didactiek: ["formatief evalueren"]  # list of principles applied
    voorkennis:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP2, OP3]
      didactiek: ["cognitieve belasting verlagen", "preteaching"]
    nieuwsdetective:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP1]
      didactiek: ["concept-context", "motivatie"]
    presentatie:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["dual coding", "expliciet lesdoel"]
    uitleg_vaardigheden:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["worked examples", "dual coding"]
    youtube_videos:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["multimodale instructie", "herhaling"]
    nieuwsopdracht:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP1, OP3]
      didactiek: ["concept-context", "Bloom-opbouw"]
    samenvatting:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["retrieval cues", "dual coding"]
    begeleide_inoefening:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP2, OP3]
      didactiek: ["scaffolding niveau 2-4", "positieve framing", "fading"]
    redeneerspel:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["retrieval practice", "oefentijd", "causale ketens"]
    wiskundevaardigheden:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP0, OP3]
      didactiek: ["cognitieve belasting splitsen", "instrumentele vaardigheid"]
    opgaven_basis:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["voldoende oefentijd"]
    opgaven_midden:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["fading", "differentiatie"]
    opgaven_verrijking:
      aanwezig: true|false
      doel: "[...]"
      inspectie: [OP3]
      didactiek: ["differentiatie naar boven", "hogere Bloom-niveaus"]

  # --- ASSET INTEGRITY ---
  # Automated checks — must all pass before quality_ref is valid
  assets:
    total_referenced: 0             # total ![...] references across all .md files
    total_present: 0                # how many of those files actually exist in _assets/
    missing: []                     # list of missing asset filenames (empty = good)
    orphaned: []                    # assets in _assets/ not referenced in any .md
    svgpng_paired: true             # every .svg has a .png and vice versa
    naming_compliant: true          # all assets follow B{X}C{Y}S{Z}_{type}_{number} convention

  # --- VERANTWOORDING ---
  # Short justification of key design choices
  verantwoording:
    differentiatie: "[how differentiation is implemented]"
    dual_coding: "[how dual coding is applied]"
    scaffolding_fading: "[how scaffolding fades across components]"
    voorkennis_aansluiting: "[prerequisite knowledge and how it's handled]"
    formatief: "[formative assessment points in the materials]"
    veelgemaakte_fouten: "[common errors addressed and how]"
    lesdoel_zichtbaarheid: "[how learning goals are made visible]"
    oefentijd: "[how sufficient practice time is ensured]"
```

### 2.3 Component-to-standard mapping (reference table)

Use this table when filling in the `inspectie` field for each component. A component may serve multiple standards.

| Component | Primary standard | Secondary | What it proves |
|-----------|-----------------|-----------|----------------|
| Instapquiz | OP2 | — | School tracks prior knowledge before instruction |
| Voorkennis | OP2, OP3 | OP0 | Materials address prerequisite gaps; differentiation |
| Nieuws-detective | OP1 | OP3 | Curriculum connects to society; activation |
| Presentatie | OP3 | OP1 | Clear explanation; explicit learning goals; dual coding |
| Uitleg vaardigheden | OP3 | OP2 | Worked examples; self-study support; checkpoints |
| YouTube-video's | OP3 | — | Multimodal instruction; review opportunity |
| Nieuwsopdracht | OP1, OP3 | — | Curriculum relevance; Bloom-level progression |
| Samenvatting | OP3 | — | Consolidation; retrieval cues |
| Begeleide inoefening | OP3 | OP2 | Scaffolded practice; differentiation without labels |
| Redeneer-spel | OP3 | OP2 | Sufficient practice; causal reasoning; progress tracking |
| Wiskundevaardigheden | OP0, OP3 | — | Basisvaardigheid rekenen; separated cognitive load |
| Opgaven basis | OP3 | OR1 | Sufficient practice time; exam preparation |
| Opgaven midden | OP3 | OR1 | Fading scaffolding; exam-level practice |
| Opgaven verrijking | OP3 | — | Differentiation upward; higher Bloom levels |

### 2.4 Didactiek-to-standard mapping (reference table)

Use this table when a verantwoording section references a didactiek principle. It shows which inspectie standard the principle supports.

| Didactiek principle | Inspectie standard | Inspectie criterion |
|--------------------|--------------------|---------------------|
| Dual coding (Paivio/Mayer) | OP3 | Duidelijke uitleg |
| Scaffolding + fading (Van de Pol) | OP3 | Afstemming op onderwijsbehoeften |
| Cognitieve belasting (Sweller) | OP3 | Duidelijke uitleg; afstemming |
| Positieve framing | SK1 | Stimulerend leerklimaat |
| Concept-context | OP1 | Voorbereiding op samenleving |
| Formatief evalueren | OP2 | Zicht op ontwikkeling |
| Retrieval practice | OP3 | Voldoende oefentijd |
| Worked examples | OP3 | Duidelijke uitleg |
| Bloom-opbouw | OP3 | Afstemming; monitoring |
| Differentiatie zonder labels | OP3 + SK1 | Afstemming + veiligheid |
| Expliciet lesdoel | OP3 | Lesdoel duidelijk |
| Fading over oefenreeks | OP3 | Afstemming; oefentijd |
| Causale ketens | OP3 | Duidelijke uitleg |
| Veelgemaakte fouten adresseren | OP3 | Monitoring; duidelijke uitleg |

---

## PART 3: QUALITY REPORTS — ON-DEMAND

### 3.1 Report dimensions

Reports can focus on one or more of these dimensions:

| Dimension | Key question | Standards | What to check |
|-----------|-------------|-----------|---------------|
| **Curriculum** | Does the material cover what it should? | OP0, OP1, OR1 | Leerdoelen ↔ eindtermen mapping; gaps; exam coverage |
| **Differentiatie** | Can all students access the material at their level? | OP2, OP3, SK1 | Scaffolding levels; fading pattern; positive framing; three exercise tiers |
| **Didactisch handelen** | Is the material evidence-based? | OP3 | Dual coding; worked examples; clear goals; sufficient practice; monitoring points |
| **Samenhang** | Does the sequence make sense? | OP1 | Prerequisite chains; concept progression; no orphan topics |
| **Kwaliteitscyclus** | What data do the materials generate? | SKA | Diagnostic data (instapquiz); formative data (redeneer-spel); summative data (toets); revision triggers |

### 3.2 Report scopes

| Scope | What it covers | Typical use case |
|-------|---------------|------------------|
| **Paragraph** | Single paragraph, all components | Deep-dive during build; inspector asks about specific lesson |
| **Chapter** | All paragraphs in a chapter | Internal quality review; section meeting |
| **Module** | All chapters in a module/book | Board-level reporting; curriculum review |
| **Course** | All modules | Annual quality report; new inspection cycle |

### 3.3 How to generate a report

When the user requests a report, follow this process:

```
1. DETERMINE SCOPE
   → Which paragraphs are included?
   → Collect all quality_refs for those paragraphs

2. DETERMINE DIMENSION
   → Full overview or specific dimension?
   → If specific: which one(s)?

3. AGGREGATE
   → For curriculum: build leerdoel × eindterm matrix across all paragraphs in scope
   → For differentiatie: list all scaffolding/fading mechanisms across paragraphs
   → For didactisch handelen: list evidence-based practices with component citations
   → For samenhang: show the prerequisite chain between paragraphs
   → For kwaliteitscyclus: list all data-generating components and feedback loops

4. ASSESS
   → Flag gaps: missing components, uncovered eindtermen, missing scaffolding
   → Flag strengths: well-integrated dual coding, complete fading sequences
   → Rate each dimension: voldoende / aandachtspunt / onvoldoende

5. FORMAT
   → Inline (conversational) for quick checks
   → Markdown file for internal documentation
   → Word document (docx) for formal reporting to board/inspectie
```

### 3.4 Report templates

#### Template A: Full paragraph report

```markdown
# Kwaliteitsrapport — [paragraph code + name]

## 1. Identificatie
- Paragraaf: [code + name]
- Module: [module name]
- Hoofdstuk: [chapter name]
- Niveau: [vwo/havo]
- Aantal leerdoelen: [n]
- Aantal componenten: [n van m mogelijk]

## 2. Curriculumdekking (OP0/OP1)
[Table: leerdoel | eindterm | Bloom | gedekt in componenten]
- Beoordeling: [voldoende/aandachtspunt/onvoldoende]
- Toelichting: [any gaps or notes]

## 3. Didactisch ontwerp (OP3)
### 3a. Lesdoel zichtbaarheid
[How learning goals are communicated in each component]
### 3b. Uitleg en dual coding
[How explanation combines verbal + visual channels]
### 3c. Oefentijd
[Exercise volume across components; estimate of practice minutes]
### 3d. Monitoring
[Formative checkpoints: instapquiz, checkboxes, redeneer-spel tracking]
- Beoordeling: [voldoende/aandachtspunt/onvoldoende]

## 4. Differentiatie (OP2/OP3/SK1)
### 4a. Scaffolding
[Scaffolding levels present; fading pattern across exercise sets]
### 4b. Positieve framing
[Labels used; any stigmatizing language found?]
### 4c. Niveaudifferentiatie
[Three-tier exercise sets; verrijking present?]
- Beoordeling: [voldoende/aandachtspunt/onvoldoende]

## 5. Veelgemaakte fouten
[Which common errors are addressed; where in the materials]

## 6. Kwaliteitscyclus (SKA)
[Data generated by this paragraph's materials; how it feeds back]

## 7. Samenvatting
| Dimensie | Beoordeling |
|----------|------------|
| Curriculumdekking | [v/a/o] |
| Didactisch ontwerp | [v/a/o] |
| Differentiatie | [v/a/o] |
| Kwaliteitscyclus | [v/a/o] |
```

#### Template B: Chapter-level curriculum report

```markdown
# Curriculum-analyse — [chapter code + name]

## Overzicht leerdoelen
[Aggregated table of all leerdoelen across paragraphs in this chapter]

## Eindtermdekking
[Matrix: eindterm × paragraph — which paragraphs cover which eindtermen]

## Bloom-verdeling
[Bar chart or table: how many leerdoelen at each Bloom level]
- Target: ~30% onthouden/begrijpen, ~40% toepassen, ~30% analyseren+

## Opbouw en samenhang
[Prerequisite chain between paragraphs: does §3 build on §2?]
[Any concepts introduced without sufficient preparation?]

## Lacunes
[Eindtermen not covered; Bloom levels underrepresented]
```

#### Template C: Module-level differentiation report

```markdown
# Differentiatierapport — [module name]

## Componenten per paragraaf
[Matrix: paragraph × component → present/absent]
[Highlight any paragraphs missing key scaffolding components]

## Scaffolding-patroon
[Does every paragraph follow the fading sequence?
begeleide inoefening → basis → midden → verrijking]

## Positieve framing audit
[Scan all component names and descriptions for stigmatizing language]

## Aanbevelingen
[Where to add scaffolding; where fading is incomplete]
```

#### Template D: Course-level kwaliteitscyclus report

```markdown
# Kwaliteitscyclus-rapport — [course name]

## Data-genererende componenten
[Which components generate trackable data: instapquizzen, redeneer-spellen, toetsen]

## Feedbackloops
[How diagnostic data → instructional adjustment:
  instapquiz laat zien dat 40% de voorkennis mist → docent zet voorkennis-document in]

## Revisietriggers
[What signals should trigger material revision:
  - Toetsresultaat < 55% op een leerdoel → herzien opgaven + uitleg
  - >50% fout op specifieke vraag → veelgemaakte-foutenbox toevoegen
  - Redeneer-spel streak-data toont systematische misconceptie → theorie-uitleg aanpassen]

## Documentatie
[How revisions are logged; version control on GitHub]
```

---

## PART 4: INTEGRATION WITH BUILD PROCESS

### 4.1 Updated build pipeline

```
Per paragraph:
 0. ──► FRESHNESS CHECK             (→ Part 0 of this skill)
      Check last_verified date on references/inspectie-standaarden.md
      Apply cascading rules (< 3 mo: proceed; 3-9 mo: quick check; > 9 mo: thorough review)
 1. Extract leerdoelen from opgaven
 2. Build presentatie              (→ econ-pptx-templates)
 3. Build vaardigheden-document    (→ econ-word-templates)
 4. Build voorkennis-document      (→ econ-word-templates)
 5. Build nieuwsopdracht           (→ econ-word-templates)
 6. Build begeleide inoefening     (→ econ-word-templates)
 7. Build website components       (quiz, redeneer-spel, wiskunde-oefening)
 8. ──► GENERATE quality_ref       (→ this skill)
      Include generated date, framework_version, and standards_verified
 9. Store quality_ref as [paragraph-code]-quality-ref.yaml

On demand (reports):
 0. ──► FRESHNESS CHECK             (→ Part 0 of this skill)
      Apply report-level override (Part 0.4):
        internal → standard cascading rules
        vaksectie → max 6 months
        external → always quick check; inspectie prep → thorough if > 3 mo
 → User requests report with scope + dimension
 → Collect relevant quality_refs
 → Flag any quality_refs where standards_verified < current last_verified
      (standards may have changed since the quality_ref was generated)
 → Generate report using appropriate template (Part 3.4)
```

### 4.2 Generating the quality_ref (step 8)

When generating a quality_ref, work through this checklist:

**Leerdoelen extraction:**
1. List all vaardigheden from the uitleg-vaardigheden document
2. Map each to an eindterm (use syllabus)
3. Assign Bloom level based on the signaalwoorden (see econ-didactiek Part 4.1)
4. Note which components cover each leerdoel

**Component inventory:**
1. Check which of the 14 standard components exist for this paragraph
2. For each present component, fill in doel, inspectie, didactiek using the mapping tables in Part 2.3 and 2.4
3. Flag any expected components that are absent (e.g., no begeleide inoefening for a calculation-heavy paragraph)

**Verantwoording:**
1. For each of the 8 verantwoording categories, write one sentence describing the design choice
2. Reference specific components as evidence
3. Flag any weak points honestly — the quality_ref is internal, not marketing

### 4.3 File storage

Store quality_refs in the paragraph folder:

```
3.2.3 Paragraaf 3 – Monopolie/
├── 1. Voorbereiden/
├── 2. Leren/
├── 3. Oefenen/
├── index.html
└── 3.2.3-quality-ref.yaml          ← generated by this skill
```

For reports, store in a `_quality/` folder at the appropriate level:

```
Module 3/
├── _quality/
│   ├── module-3-curriculum-rapport.md
│   └── module-3-differentiatie-rapport.md
├── H1 Markten/
│   ├── _quality/
│   │   └── h1-quality-rapport.md
│   └── ...
└── ...
```

---

## PART 5: ASSESSMENT CRITERIA

### 5.1 When to mark a dimension as "voldoende"

| Dimension | Voldoende when... |
|-----------|-------------------|
| Curriculum | All eindtermen covered; Bloom distribution balanced; no orphan leerdoelen |
| Didactisch handelen | ≥5 of 7 OP3 criteria demonstrably addressed in materials |
| Differentiatie | ≥3 exercise levels present; scaffolding fades; positive framing throughout |
| Samenhang | Each paragraph builds on the previous; prerequisites documented; no abrupt jumps |
| Kwaliteitscyclus | ≥2 data-generating components; documented revision triggers |

### 5.2 When to flag an "aandachtspunt"

| Dimension | Aandachtspunt when... |
|-----------|----------------------|
| Curriculum | 1–2 eindtermen partially covered; Bloom distribution slightly skewed |
| Didactisch handelen | 3–4 of 7 OP3 criteria addressed; some components lack dual coding |
| Differentiatie | Only 2 exercise levels; scaffolding present but fading incomplete |
| Samenhang | Minor prerequisite gaps; one paragraph assumes knowledge not yet taught |
| Kwaliteitscyclus | Only 1 data-generating component; no documented revision triggers |

### 5.3 When to mark "onvoldoende"

| Dimension | Onvoldoende when... |
|-----------|---------------------|
| Curriculum | Eindtermen missing; Bloom only at onthouden/begrijpen |
| Didactisch handelen | <3 of 7 OP3 criteria addressed; no dual coding; no formative moments |
| Differentiatie | Single exercise level only; no scaffolding; stigmatizing labels |
| Samenhang | Paragraphs standalone with no visible progression |
| Kwaliteitscyclus | No data-generating components; no feedback mechanism |

---

## PART 6: LANGUAGE AND TONE

### 6.1 Quality_ref language

The quality_ref is **internal technical documentation**. Use:
- Concise, factual Dutch or English (match the user's language)
- One-line descriptions, not paragraphs
- Standard terminology from the inspectie framework
- No marketing language; honest about gaps

### 6.2 Report language

Reports may be **internal** (for the teacher/developer) or **external** (for school board, inspectie, colleagues). Adjust accordingly:

| Audience | Tone | Detail level | Format |
|----------|------|-------------|--------|
| Internal (developer) | Direct, technical | High — include component-level detail | Markdown, inline |
| Internal (section/vaksectie) | Professional, collegial | Medium — focus on didactisch choices | Markdown or Word |
| External (bestuur/inspectie) | Formal, evidence-based | Medium — focus on standards compliance | Word document |

### 6.3 Key terminology

Always use inspectie terminology when writing reports:
- "doelgericht en samenhangend curriculum" (not "goed programma")
- "afstemming op onderwijsbehoeften" (not "differentiatie" alone — add the why)
- "zicht op ontwikkeling" (not "we doen toetsen")
- "pedagogisch-didactisch handelen" (not "lesgeven")
- "kwaliteitszorg" (not "quality control" in Dutch-facing reports)

---

## NEVER DO

- Generate a quality_ref that hides weaknesses — the ref is internal and must be honest
- Use inspectie terminology without substance — don't just name-drop "OP3" without showing how the standard is met
- Write a report that claims compliance without evidence from actual material components
- Assess a dimension as "voldoende" when components are missing that the standard requires
- Use stigmatizing labels in quality_refs or reports (the materials shouldn't have them, and neither should the QC documentation)
- Generate a quality_ref before the paragraph build is complete — it should reflect what actually exists
- Assume all paragraphs need all 14 components — some paragraphs legitimately skip certain components (e.g., no wiskundevaardigheden for a purely conceptual paragraph)

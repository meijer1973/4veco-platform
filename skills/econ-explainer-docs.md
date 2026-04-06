---
name: econ-explainer-docs
description: "Complete recipe for creating 'uitleg voorkennis' and 'uitleg vaardigheden' Word documents for economics education. Covers content architecture, section structure, domain assignment, content writing guidelines, and quality standards. Use this skill whenever building explainer documents for any paragraph. Always use together with econ-word-templates (for components) and economic-graph (for any embedded visuals)."
---

# Explainer Word Documents Skill

Recipe for building two types of explainer documents per paragraph:
- **Uitleg voorkennis** — what students must already know before starting
- **Uitleg vaardigheden** — what skills students will learn in this paragraph

These documents make the classroom presentation self-readable. They add the context, examples, and explanations that a teacher would normally give orally.

**Always read first:**
- `econ-word-templates` — for all component code (domainBanner, formulaBox, tipBox, summarySchema, etc.)
- `economic-graph` — for any embedded SVG visuals

---

## PART 1: WHEN TO USE THIS SKILL

Trigger when:
- Creating `uitleg voorkennis` or `uitleg vaardigheden` for any paragraph
- Reviewing or improving existing explainer documents
- Building batch explainer documents for a chapter

Output files per paragraph:
- `X.Y.Z [Naam] – uitleg voorkennis.docx`
- `X.Y.Z [Naam] – uitleg vaardigheden.docx`

---

## PART 2: DOCUMENT TYPES — KEY DIFFERENCES

| Aspect | Uitleg voorkennis | Uitleg vaardigheden |
|--------|-------------------|---------------------|
| **Purpose** | Prerequisites — what you must know before starting | New skills — what you will learn |
| **Domain system** | Skill types: wiskunde / economisch / grafisch | Economic domains: markt / bedrijf / arbeid |
| **Content per section** | Definitie → voorbeeld → controle | Waarom → hoe → voorbeeld → tip |
| **Final section** | Checklist ("Ik kan…" items with ☐) | Veelgemaakte valkuilen (warningBox items) |
| **Typical sections** | 5 prerequisite topics | 5 paragraph skills |
| **Typical pages** | 7–8 | 8–12 |

Both documents share the same visual infrastructure (components, colors, typography) from `econ-word-templates`.

---

## PART 3: CONTENT ARCHITECTURE

### Page 1: Title + Table of Contents (single page)

Both document types open with this combined page:

```
titleBlock(title, subtitle)          ← 48pt bold navy + 26pt gray
sp(80)                               ← minimal spacing
domainLegend(domainSet)              ← 3-column color strip
sp(120)                              ← moderate gap
"Inhoudsopgave" heading              ← H1, 36pt bold navy
sp(60)                               ← compact spacing
visualTOC(chapters/skills, domainSet) ← 4-column overview table
```

**Title format:**
- Voorkennis: `"[Naam] — Voorkennis"` + `"Wat moet je al weten voordat je aan deze paragraaf begint?"`
- Vaardigheden: `"[Naam] — Vaardigheden"` + `"Welke vaardigheden leer je in deze paragraaf?"`

### Pages 2+: Content Sections (one per skill/topic)

Each section starts on a new page with a `PageBreak`.

**Voorkennis section structure:**
```
PageBreak
domainBanner(domain, nr, title)      ← numbered badge + title
sp(120)
h2d("Uitleg", domainColor)           ← what is this concept?
p(explanation)                        ← 2-4 short paragraphs
formulaBox(formulas, domainColor)     ← if applicable
sp(60)
h2d("Voorbeeld", domainColor)        ← worked example
p(example)
tipBox / warningBox                   ← memory aid or common mistake
sp(60)
checkBox("Kun je … ?")               ← self-check question
sp(60)
summarySchema(rows, domainColor)     ← concept/definition pairs
```

**Vaardigheden section structure:**
```
PageBreak
domainBanner(domain, nr, title)      ← numbered badge + title
sp(120)
h2d("Waarom is dit belangrijk?", domainColor)
p(context)                            ← 2-3 sentences: why does this matter?
sp(60)
h2d("Hoe werkt het?", domainColor)
p(explanation)                        ← step-by-step or rule explanation
formulaBox(formulas, domainColor)     ← the core formula/rule
p(elaboration)                        ← additional notes
sp(60)
h2d("Voorbeeld", domainColor)
p(workedExample)                      ← concrete numbers, same as presentation
tipBox("Ezelsbruggetje: …")          ← memory aid
sp(60)
checkBox("Kun je … ?")               ← self-check
sp(60)
summarySchema(rows, domainColor)     ← key concepts + "Verband met →" row
```

### Final Page(s)

**Voorkennis → Checklist:**
```
PageBreak
H1: "Checklist voorkennis"
p(intro text)
checklistItem("Ik kan uitleggen wat vraag en aanbod zijn")
checklistItem("Ik kan een evenwichtsprijs berekenen")
… (one per prerequisite skill)
```

**Vaardigheden → Valkuilen + Checklist:**
```
PageBreak
H1: "Veelvoorkomende valkuilen"
p(intro)
warningBox("MO ≠ gemiddelde opbrengst — MO is de EXTRA opbrengst…")
warningBox("Bij monopolie: prijs aflezen op de vraaglijn, NIET op MO…")
… (3-5 common mistakes)

PageBreak
H1: "Samenvatting checklist"
p(intro)
checklistItem("Ik kan de winstmaximalisatieregel MO = MK toepassen")
… (one per skill)
```

---

## PART 4: CONTENT REQUIREMENTS PER SECTION

### 4.1 Voorkennis Sections

**How to identify prerequisite knowledge (mandatory method):**

For each assignment/exercise in the paragraph, ask three questions:
1. Which **mathematical** skill is needed? (e.g., differentiate, solve equations, read graphs)
2. Which **economic** concepts must the student already know? (e.g., TO, MK, CS)
3. Which **graphical** skills are needed? (e.g., read intersection, shade area)

The unique answers form your sections. Group similar skills together.

**Each section must contain:**

| Element | Required? | Purpose |
|---------|-----------|---------|
| Domain banner | Yes | Visual structure + numbering |
| Explanation (2-4 paragraphs) | Yes | Clear definition of the concept |
| Formula box | If applicable | Core formula in Consolas |
| Worked example | Yes | Concrete numbers showing the concept in action |
| Tip or warning box | Yes | Memory aid, shortcut, or common mistake |
| Self-check question | Yes | "Kun je…?" for student self-assessment |
| Summary schema | Yes | 3-5 concept/definition pairs |

### 4.2 Vaardigheden Sections

**How to extract skills from the presentation (mandatory method):**

1. Read each slide and note the **skill** being taught (not the specific answer)
2. Group similar skills (all formula derivations together, all graph readings together)
3. Filter skills that add nothing new (repetitions, pure recall)
4. Order from simple to complex
5. Each unique skill = one section in the document

**Each section must contain:**

| Element | Required? | Purpose |
|---------|-----------|---------|
| Domain banner | Yes | Visual structure + numbering |
| Waarom-alinea (2-3 sentences) | Yes | Context: why does this rule work? What is the intuition? |
| Hoe-blok (steps or formula) | Yes | Step-by-step procedure or core formula in formula box |
| Worked example | Yes | Same numbers as the presentation for consistency |
| Tip box | Yes | Ezelsbruggetje, shortcut, or exam strategy |
| Self-check question | Yes | "Kun je…?" |
| Summary schema | Yes | Concept pairs + "Verband met →" row linking to other skills |

### 4.3 Writing Rules

**Tone:**
- Target audience: 15–16 year olds (VWO 4 economics)
- Clear and factually correct, not unnecessarily academic
- Dutch language throughout

**Paragraph length:**
- Maximum 4-5 lines per paragraph
- Use subheadings for every new concept
- Prefer short sentences over complex ones

**Examples:**
- Always use concrete numbers
- Match the numbers from the presentation (consistency)
- Show the full calculation, not just the answer

**Formula boxes:**
- Consolas font, left-aligned
- One formula per line
- Include variable explanations below if not obvious
- Domain-colored accent stripe on the left

**Tip/warning boxes:**
- One clear message per box
- Tips: positive (shortcuts, memory aids)
- Warnings: common mistakes students make
- Never longer than 2 sentences

---

## PART 5: DOMAIN ASSIGNMENT

### Voorkennis Domains (VK_DOMAINS)

Categorize each prerequisite by **skill type**:

| Domain | Label | Color family | Assign when the prerequisite is about… |
|--------|-------|-------------|----------------------------------------|
| `wiskunde` | Wiskundig | Blue | Calculating, algebra, functions, differentiation, solving equations |
| `economisch` | Economisch | Amber | Economic concepts (TO, TK, MO, MK, surplus), market structures, definitions |
| `grafisch` | Grafisch | Green | Reading graphs, finding intersections, shading areas, drawing curves |

### Vaardigheden Domains (DOMAINS)

Categorize each skill by **economic subdomain**:

| Domain | Label | Color family | Assign when the skill is about… |
|--------|-------|-------------|----------------------------------|
| `markt` | Marktanalyse | Blue | Market equilibrium, supply/demand shifts, price formation, surplus |
| `bedrijf` | Bedrijfseconomie | Amber | Profit maximization, MO=MK, cost calculation, market form behavior |
| `arbeid` | Arbeidsmarkt | Green | Labor market, wages, unemployment, minimum wage, CAO |

**Consistency rule:** The same skill always gets the same domain color throughout the document. If "MO=MK" is `bedrijf` (amber) in section 2, it must be amber everywhere.

---

## PART 6: BUILD PIPELINE

### Step-by-step process (mandatory order)

```
STEP 1: READ this skill + econ-word-templates skill + economic-graph skill
STEP 2: READ the presentation for this paragraph (understand what was taught)
STEP 3: READ the source material (exercises, answer key)
STEP 4: EXTRACT content
         Voorkennis: identify prerequisites using the 3-question method
         Vaardigheden: extract skills from presentation using the skill-extraction method
STEP 5: ASSIGN domains to each section (see Part 5)
STEP 6: PLAN the document structure:
         - List all sections with domain + title
         - Plan the visual TOC entries
         - Plan the checklist items
STEP 7: WRITE the JavaScript using components from econ-word-templates:
         - Copy the template scaffold (template-A or template-B from build-scripts/)
         - Replace the content sections with new paragraph-specific content
         - Update output path and header text
STEP 8: BUILD the document (node script.js)
STEP 9: CONVERT to PDF (LibreOffice) → render pages (PyMuPDF)
STEP 10: INSPECT every page visually
STEP 11: CHECK against QA checklist (Part 7)
STEP 12: FIX any issues, rebuild, inspect again
```

### Adapting the template scripts

The build-scripts folder contains reference implementations:
- `build-scripts/template-B_voorkennis.js` — scaffold for voorkennis documents
- `build-scripts/template-A_vaardigheden.js` — scaffold for vaardigheden documents

To adapt for a new paragraph:
1. Copy the relevant script
2. Change `OUT_DIR` and `OUT_FILE` to point to the new paragraph
3. Update the `chapters` / `skills` array (search for `════`)
4. Replace all section content between `════` markers
5. Update the header text in `makeHeader()` call
6. Update the title in `titleBlock()` call
7. Update the checklist/valkuilen items at the end

---

## PART 7: QA CHECKLIST

Run after every build. **All items must pass before delivery.**

### Structure
- [ ] Title + domain legend + TOC all fit on page 1 (no page break before TOC)
- [ ] Every section starts on a new page (explicit PageBreak)
- [ ] Every section has a domain banner with correct number and title
- [ ] Visual TOC lists all sections with correct domain colors
- [ ] Domain legend shows all three domain colors
- [ ] Header text matches the paragraph name
- [ ] Footer has page numbers ("Pagina X")

### Content (Voorkennis)
- [ ] Every section has: explanation → example → tip/warning → check → summary schema
- [ ] Prerequisites cover mathematical, economic, AND graphical skills
- [ ] Ends with "Ik kan…" checklist with ☐ bullets
- [ ] Examples use concrete numbers

### Content (Vaardigheden)
- [ ] Every section has: waarom → hoe → example → tip → check → summary schema
- [ ] Skills extracted from the presentation (not invented)
- [ ] Worked examples match the presentation's numbers
- [ ] Ends with valkuilen (warningBox) + "Ik kan…" checklist
- [ ] Summary schemas include "Verband met →" row

### Visual Components
- [ ] Formula boxes have domain-colored left accent stripe (not gray)
- [ ] Tip boxes use domain color (not always blue)
- [ ] Warning boxes are always red (regardless of domain)
- [ ] Check boxes are always green (regardless of domain)
- [ ] Summary schema headers use domain color background
- [ ] All tables use `WidthType.DXA` (absolute widths, not percentage)

### Typography
- [ ] All text is Arial (except formulas: Consolas)
- [ ] No text smaller than 18pt (9pt equivalent in Word)
- [ ] Body text is 22pt (11pt), dark color (#2D3748)
- [ ] Headings are domain-colored, not navy

### Domain Consistency
- [ ] Same skill = same domain color throughout the entire document
- [ ] Domain assignments follow the rules in Part 5
- [ ] Domain legend matches the domains actually used

### Readability
- [ ] Self-readable without the presentation
- [ ] Paragraphs are max 4-5 lines
- [ ] Every concept has a worked example
- [ ] Language is clear for 15-16 year olds

---

## PART 8: REFERENCE — SPACING & TYPOGRAPHY

### Page Setup

```
Page size: A4 (11906 × 16838 DXA)
Margins: 1 inch / 1440 DXA all sides
Content width: 9026 DXA
```

### Typography Scale

| Element | Size | Weight | Color | Font |
|---------|------|--------|-------|------|
| Document title | 48pt | Bold | Navy #1E2761 | Arial |
| Subtitle | 26pt | Regular | Gray #718096 | Arial |
| Heading 1 | 36pt | Bold | Navy #1E2761 | Arial |
| Heading 2 (h2d) | 24pt | Bold | Domain color | Arial |
| Body text | 22pt | Regular | Dark #2D3748 | Arial |
| Bullet text | 22pt | Regular | Dark #2D3748 | Arial |
| Formula text | 22pt | Regular | Dark #2D3748 | Consolas |
| Box label | 22pt | Bold | Box color | Arial |
| Box text | 22pt | Regular | Dark #2D3748 | Arial |
| Summary header | 22pt | Bold | White #FFFFFF | Arial |
| Summary left col | 20pt | Bold | Domain color | Arial |
| Summary right col | 20pt | Regular | Dark #2D3748 | Arial |
| TOC header | 20pt | Bold | White #FFFFFF | Arial |
| TOC data | 20-22pt | Regular/Bold | Dark/Domain | Arial |
| Header | 18pt | Italic | Gray #718096 | Arial |
| Footer | 18pt | Regular | Gray #718096 | Arial |
| Banner number | 32pt | Bold | White #FFFFFF | Arial |
| Banner title | 28pt | Bold | Domain dark | Arial |
| Banner label | 18pt | Italic | Domain color | Arial |

### Spacing Reference (in twips, used in `sp()` calls)

| Context | After-spacing |
|---------|--------------|
| After title block | 80 |
| After domain legend | 120 |
| After TOC heading | 60 |
| After page break (before banner) | 0 |
| After domain banner | 120 |
| Between subsections | 60 |
| After body paragraph | 120 |
| After bullet | 80 |
| After formula box | 60 |
| After tip/warning/check box | 60 |
| After summary schema | 60 |
| Default spacer | 80 |

### Color Palette (quick reference)

**Domains:**
```
Blue  (Wiskundig/Markt):   primary #1A5276, light #EBF5FB, dark #154360
Amber (Economisch/Bedrijf): primary #E67E22, light #FEF5E7, dark #BA6A1C
Green (Grafisch/Arbeid):    primary #1E8449, light #E8F8F0, dark #186A3B
```

**Base:**
```
Navy:       #1E2761  (titles, TOC header)
Dark:       #2D3748  (body text)
Gray:       #718096  (footer, captions)
Light Gray: #F7F8FA  (formula background)
Border Gray:#CBD5E0  (formula border)
Red:        #D9534F  (warnings)
Light Red:  #FDE8E8  (warning background)
Blue:       #1A5276  (tip box alias)
Light Blue: #EBF5FB  (tip background alias)
Green:      #1E8449  (check box alias)
Light Green:#E8F5E9  (check background)
Row Alt:    #F7FAFC  (alternating table rows)
```

---

Apply this skill to the following task: $ARGUMENTS

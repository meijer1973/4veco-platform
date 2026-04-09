# How to Build a Complete Paragraph

From raw exercises to finished interactive lesson page. This document is the single source of truth for the paragraph production process.

> **Before you start:** Read the **Design Principles** section in [AGENTS.md](AGENTS.md#design-principles). Two principles govern everything: **Dual Coding** (every concept pairs text with a visual) and **Unified Student Experience** (same procedures and approaches across all formats). These are non-negotiable.

---

## 1. Definition of Done

A complete paragraph has **24 files** plus an index.html. Every file listed as required MUST exist before the paragraph is considered done.

| # | File | Section | Required | Builder | Source input | Output type |
|---|------|---------|----------|---------|--------------|-------------|
| 1 | `X.Y.Z [Naam] – instapquiz.html` | 1. Voorbereiden | Yes | `generate-quiz-shells.js` (auto) | `shared/questions/X.Y.Z.js` | Generated |
| 2 | `X.Y.Z [Naam] – nieuws-detective.html` | 1. Voorbereiden | Yes | `build-newsdetective-shells.js` (auto) | `shared/newsdetective/X.Y.Z.js` | Generated |
| 3 | `X.Y.Z [Naam] – uitleg voorkennis.docx` | 1. Voorbereiden | Yes | Adapt `template-B_voorkennis.js` | Book content + domain knowledge | Scripted-manual |
| 4 | `X.Y.Z [Naam] – uitleg voorkennis.html` | 1. Voorbereiden | Yes | `convert_voorkennis.py` | File #3 (.docx) | Converted |
| 5 | `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` | 1. Voorbereiden | Yes | Copy | Static file (identical in every paragraph) | Static |
| 6 | `X.Y.Z [Naam] – presentatie.pptx` | 2. Leren | Yes | Adapt `pptx-351-afsluiting.js` | Book content + SVG graphs | Scripted-manual |
| 7 | `X.Y.Z [Naam] – uitleg vaardigheden.docx` | 2. Leren | Yes | Adapt `template-A_vaardigheden.js` | Book content + domain knowledge | Scripted-manual |
| 8 | `X.Y.Z [Naam] – uitleg vaardigheden.html` | 2. Leren | Yes | `convert_vaardigheden.py` | File #7 (.docx) | Converted |
| 9 | `X.Y.Z [Naam] – nieuws met visual.docx` | 2. Leren | Yes | Adapt `nieuws-351-352-afsluiting.js` | Recent Dutch news + SVG visual | Scripted-manual |
| 10 | `X.Y.Z [Naam] – samenvatting.docx` | 2. Leren | Yes | Adapt `samenvatting-351-352-rebuild.js` | Key concepts from paragraph | Scripted-manual |
| 11 | `X.Y.Z [Naam] – youtube-videos.html` | 2. Leren | Yes | Write directly | 3 real YouTube video IDs | Manual |
| 12 | `X.Y.Z [Naam] – stappenplan.html` | 2. Leren | Yes | `build-procedure-shells.js` (auto) | `shared/procedure/X.Y.Z.js` | Generated |
| 13 | `X.Y.Z [Naam] – redeneer-spel.html` | 3. Oefenen | Yes | `build-reasoning-engine.js` (auto) | `shared/reasoning/X.Y.Z.js` | Generated |
| 14 | `X.Y.Z [Naam] – wiskundevaardigheden.html` | 3. Oefenen | Yes | `build-skilltree-shells.js` (auto) | PARAGRAPHS array in script | Generated |
| 15 | `begeleide inoefening – vragen.docx` | 3. Oefenen/begeleide inoefening | Yes | Adapt `inoefening-351-afsluiting.js` | Exercises with scaffolding | Scripted-manual |
| 16 | `begeleide inoefening – antwoorden.docx` | 3. Oefenen/begeleide inoefening | Yes | Same script as #15 | Same | Scripted-manual |
| 17 | `begeleide inoefening.html` | 3. Oefenen/begeleide inoefening | Yes | `convert_begeleide_inoefening.py` | Files #15 + #16 | Converted |
| 18 | `basis – vragen.docx` | 3. Oefenen/basisopgaven | Yes | Adapt `opgaven-351-afsluiting.js` | Exercises (8-10 questions) | Scripted-manual |
| 19 | `basis – antwoorden.docx` | 3. Oefenen/basisopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 20 | `midden – vragen.docx` | 3. Oefenen/middenopgaven | Yes | Same script as #18 | Exercises (6-8 questions) | Scripted-manual |
| 21 | `midden – antwoorden.docx` | 3. Oefenen/middenopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 22 | `verrijking – vragen.docx` | 3. Oefenen/verrijkingsopgaven | Yes | Same script as #18 | Exercises (4-6 questions) | Scripted-manual |
| 23 | `verrijking – antwoorden.docx` | 3. Oefenen/verrijkingsopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 24 | `index.html` | Root | Yes | `build-landing-page.js` (auto) | Scans folder contents | Generated |

### Output type definitions

| Type | Meaning | Human effort |
|------|---------|--------------|
| **Generated** | Fully automated from data files. deploy.js handles this. | Create the data file only. |
| **Converted** | Automated transformation of an existing .docx to .html. | Run the converter after creating the .docx. |
| **Scripted-manual** | A Node.js script generates the file, but the script must be written per-paragraph with paragraph-specific content. Copy a reference script, replace the content section. | Write economics content, adapt a reference script, run it. |
| **Manual** | Written by hand (no generator). | Create the file directly. |
| **Static** | Identical copy in every paragraph. | Copy from an existing paragraph. |

---

## 2. Input contract

These are the raw inputs needed to build one paragraph. They must exist BEFORE running any builder.

### A. Game data files (→ `shared/` in module repo)

| Input | Location | Format | Who creates it |
|-------|----------|--------|----------------|
| Quiz questions | `shared/questions/X.Y.Z.js` | JS: `var QUIZ_DATA = { meta, categories, questions }` | Agent writes the JS file. 15 questions, 3-4 categories, at least one difficulty:3 per category. |
| Reasoning questions | `source-data/module-N/reasoning/X.Y.Z.csv` | Semicolon-delimited CSV, 15 rows, 5 modes | Agent writes CSV, then runs `build-reasoning-questions.js` to produce JS. |
| Newsdetective data | `shared/newsdetective/X.Y.Z.js` | JS: `var NEWS_DETECTIVE_DATA = { meta, article, rounds }` | Agent writes the JS file. Real Dutch news, 4 rounds. |
| Procedure data | `shared/procedure/X.Y.Z.js` | JS: `var PROCEDURE_DATA = { meta, procedures }` | Agent writes the JS file. Steps aligned with uitleg vaardigheden. |
| Skilltree config | Entry in `build-skilltree-shells.js` PARAGRAPHS array | JS object: `{ parNr, name, skills }` | Agent adds to array. Data file auto-generated. |

### B. Rich document content — per-asset production specs

Each scripted-manual asset follows the same pattern: **read source → write build script with content → run script → get .docx/.pptx**. But the raw input, the extraction process, and the reusable vs custom split differ per asset. Here is the exact spec for each.

#### Presentatie (.pptx)
| | |
|---|---|
| **Raw input** | Textbook paragraph: concepts, formulas, worked examples. Read via python-docx. |
| **Agent process** | Extract 5-8 key concepts. For each: write a theory slide + design an SVG graph that visualises it. |
| **Reference script** | `pptx-351-afsluiting.js` — copy, replace slide content + SVG graph functions. |
| **Reusable (don't change)** | Slide masters (TITLE_DARK, CONTENT), color palette, `svgToPng()`, `drawCard()`, `flowChain()`, `addContentSlide()`. |
| **Custom (must write)** | Slide sequence, text content per slide, SVG graph code per concept, speaker notes. |
| **Skills to read first** | `econ-pptx-templates` + `economic-graph` |
| **Hard rules** | Theory + worked examples only, NEVER exercise instructions. Min 3 SVG→PNG graphs. Min 18pt font. |

#### Uitleg voorkennis (.docx)
| | |
|---|---|
| **Raw input** | Prerequisite knowledge: what must students already know from earlier paragraphs? Identify by reading the textbook exercises — which concepts do they assume? |
| **Agent process** | List 5-7 prerequisite concepts. For each: write definition, formula (if any), worked example, tip, checklist item. Assign each to a domain (wiskunde/economisch/grafisch). |
| **Reference script** | `template-B_voorkennis.js` — copy, replace content between `════` markers. |
| **Reusable** | Entire document scaffold: domainBanner, formulaBox, tipBox, warningBox, checkBox, summarySchema, visualTOC, domainLegend. |
| **Custom** | Content sections only (text between ════ markers). |
| **Skills** | `econ-explainer-docs` + `econ-word-templates` |

#### Uitleg vaardigheden (.docx)
| | |
|---|---|
| **Raw input** | Skills taught in this paragraph. Identify from textbook learning goals and exercise types. |
| **Agent process** | List 5-7 skills. For each: write a full page with waarom/hoe/voorbeeld/tip/check/summary. Assign domains. |
| **Reference script** | `template-A_vaardigheden.js` — copy, replace content between ════ markers. |
| **Reusable** | Entire document scaffold (same components as voorkennis). |
| **Custom** | Content sections only. |
| **Skills** | `econ-explainer-docs` + `econ-word-templates` |

#### Nieuws met visual (.docx)
| | |
|---|---|
| **Raw input** | A real, recent Dutch news article (NOS, RTL, Volkskrant, etc.) related to the paragraph topic. Must have a verifiable sourceUrl. |
| **Agent process** | Write 80-word summary → design SVG chart/graph that teaches a concept from the article → write 5 questions (ascending difficulty) + answer key. |
| **Reference script** | `nieuws-351-352-afsluiting.js` — copy, replace article content + SVG function + questions/answers. |
| **Reusable** | Document scaffold (headline, ImageRun, banners, Q&A format), `svgToPng()`, `domainBanner()`. |
| **Custom** | Article text, SVG chart code, questions, answers, source URL. |
| **Skills** | `econ-nieuws-exercise` + `economic-graph` |
| **Hard rules** | Font sizes 16/11/9pt. Real SVG→PNG chart, NOT text placeholder. sourceUrl required. |

#### Samenvatting (.docx)
| | |
|---|---|
| **Raw input** | The paragraph's key concepts, terms, formulas — distilled from the textbook and from the other documents you've already built for this paragraph. |
| **Agent process** | Create a one-page visual summary using a table grid layout with domain-colored sections. |
| **Reference script** | `samenvatting-351-352-rebuild.js` — copy, replace content cells. |
| **Reusable** | Table infrastructure: `colorBorder()`, domain color system, content width constants. |
| **Custom** | Content cells, concept groupings, which colors map to which sections. |
| **Hard rule** | TABLE-BASED infographic layout. Never use paragraph-based layout. |

#### Begeleide inoefening (vragen.docx + antwoorden.docx)
| | |
|---|---|
| **Raw input** | Textbook exercises for this paragraph + worked solutions from the answer key docx. |
| **Agent process** | Select 6-8 exercises. For each: write the question, add scaffolding (denkstappen, hints, formule-herinneringen), write the full solution. |
| **Reference script** | `inoefening-351-afsluiting.js` — copy, replace exercise content. |
| **Reusable** | `lib-begeleide-inoefening.js` library (import, don't copy) + script scaffold. |
| **Custom** | Exercise questions, scaffolding text, worked solutions. |
| **Skills** | `econ-word-templates` + `econ-didactiek` |

#### Opgavensets — basis, midden, verrijking (6 .docx files)
| | |
|---|---|
| **Raw input** | Textbook exercises, graded by difficulty. Basis = knowledge recall. Midden = application. Verrijking = analysis/evaluation. |
| **Agent process** | Write questions at 3 levels (basis 8-10, midden 6-8, verrijking 4-6) + full answer models for each. |
| **Reference script** | `opgaven-351-afsluiting.js` — copy, replace exercise content. Generates all 6 files. |
| **Reusable** | Document scaffold (headers, numbering, answer formatting). |
| **Custom** | All questions and answers. |

#### YouTube videos (.html)
| | |
|---|---|
| **Raw input** | None. This is a manual search task. |
| **Agent process** | Search YouTube for 3 Dutch-language VWO economics videos matching the paragraph topic. Verify video IDs exist. |
| **Reference** | Copy HTML structure from any existing `youtube-videos.html` file. |
| **Reusable** | Card layout HTML/CSS. |
| **Custom** | Video IDs, titles, channel names, descriptions. |
| **Design note** | Manual by design. No generator exists or is planned. `prompt-youtube-videos.md` has search guidance. |

### C. Registration entries (→ platform repo config files)

| Config file | What to add | When |
|-------------|-------------|------|
| `build-scripts/build-landing-page.js` | PARAGRAAF_DATA entry | Every new paragraph |
| `build-scripts/build-landing-page.js` | CHAPTER_FOLDERS, CHAPTER_ORDER, CHAPTER_NUMBERS, DOMAIN_COLORS | Only for new chapters |
| `build-scripts/build-skilltree-shells.js` | PARAGRAPHS entry | Every new paragraph |
| `engines/tests/skilltree-data.test.js` | expectedFiles entry | Every new paragraph |
| `engines/theme.js` | DOMAIN_COLORS entry | Only for new chapters |

---

## 3. End-to-end workflow

This is the production sequence for one paragraph. Follow in order.

### Phase 1: Register (5 min)
1. Add paragraph to `build-landing-page.js` PARAGRAAF_DATA
2. Add paragraph to `build-skilltree-shells.js` PARAGRAPHS
3. Add paragraph to `skilltree-data.test.js` expectedFiles
4. If new chapter: add to CHAPTER_FOLDERS, CHAPTER_ORDER, CHAPTER_NUMBERS, DOMAIN_COLORS, theme.js

### Phase 2: Create folder structure (1 min)
```bash
MODULE="../3. Module 3 - Markt en overheid"
PAR="$MODULE/3.X Hoofdstuk X - Name/3.X.Y Paragraaf Y - Name"
mkdir -p "$PAR/1. Voorbereiden" "$PAR/2. Leren"
mkdir -p "$PAR/3. Oefenen/basisopgaven" "$PAR/3. Oefenen/middenopgaven"
mkdir -p "$PAR/3. Oefenen/verrijkingsopgaven" "$PAR/3. Oefenen/begeleide inoefening"
cp "$MODULE/3.1 Hoofdstuk 1 - Markten/3.1.1 Paragraaf 1 - Markt en marktstructuur/1. Voorbereiden/Lees dit als je niet weet hoe je moet beginnen met deze les.docx" "$PAR/1. Voorbereiden/"
```

### Phase 3: Create game data files (30 min)
1. Write `shared/questions/X.Y.Z.js` — quiz data (15 questions)
2. Write `source-data/module-N/reasoning/X.Y.Z.csv` — reasoning CSV
3. Run: `MODULE_ROOT="$MODULE" node build-scripts/build-reasoning-questions.js X.Y.Z <domain> source-data/module-N/reasoning/X.Y.Z.csv`
4. Write `shared/newsdetective/X.Y.Z.js` — newsdetective data
5. Write `shared/procedure/X.Y.Z.js` — procedure/stappenplan data. Steps MUST align with the vaardigheden skills (same labels, same order). See procedure-stappen-plan in the paragraph plan.

### Phase 4: Create rich documents (bulk of the work)

Phase 4 has three sub-phases. The planning step ensures terminology consistency and visual reuse across all 8 documents.

#### Phase 4a — Plan (15 min)

Read the textbook paragraph and answer key thoroughly, then create the paragraph plan.

1. Copy `build-scripts/template-paragraph-plan.md` → `<paragraph-folder>/_paragraph-plan.md`
2. Fill in every section:
   - **Kernconcepten**: 5-8 key concepts with definitions, formulas, graph types
   - **Visuelen-plan**: every SVG visual needed, with filename, graph type, which builders use it, and parameters (e.g. curve equations)
   - **Presentatie-outline**: slide sequence with visual references
   - **Nieuws-plan**: article choice + chart type
   - **Samenvatting-concepten**: complete concept checklist (cross-check against kernconcepten)
   - **Terminologie**: use/don't-use table for consistent Dutch economics terms across all documents
   - **Opgaven-verdeling**: exercise distribution across basis/midden/verrijking
   - **Vaardigheden & Voorkennis**: quick reference for the uitleg-builders
   - **Procedure-stappen-plan** (unified experience): for each skill, the exact step labels and sequence. This is the canonical approach — all builders (vaardigheden, stappenplan game, presentatie) must follow these steps. Products/numbers may vary by context, but the approach is fixed.
   - **Visuelen-toewijzing** (dual coding): for each visual in `_assets/`, which builders embed it — not just the presentatie. Every document that explains a concept with a matching visual must include it.

This plan is the **single source of truth** for all builders. Every builder reads it before starting.

#### Phase 4b — Build shared visuals (20 min)

Build all SVG graphics listed in the visuelen-plan, so they can be reused across documents.

1. Create `<paragraph-folder>/_assets/` subfolder
2. For each visual in the visuelen-plan:
   - Write the SVG following the `economic-graph` skill spec
   - Render to PNG via `lib-svg-utils.js`: `const { svgToPng } = require('./lib-svg-utils')`
   - Save both `.svg` and `.png` to `_assets/` (e.g. `_assets/va-equilibrium.svg`, `_assets/va-equilibrium.png`)
3. Optionally save the asset-builder script as `build-scripts/mN-XYZ-build-assets.js`
4. Quality-check all PNGs before proceeding — verify economic correctness and readability

#### Phase 4c — Build documents

For each document type, copy the reference script, replace the content, run it. Each builder should:
- Read `_paragraph-plan.md` for its outline, terminology, and concept coverage
- Read pre-built PNGs from `_assets/` instead of generating SVGs inline
- Use `const { svgToPng, pngToBase64, GRAPH_COLORS } = require('./lib-svg-utils')` instead of inline copies
- **Dual coding**: embed every visual listed in the visuelen-toewijzing for this builder (use `ImageRun` in docx scripts)
- **Unified experience**: follow the exact step sequence from the procedure-stappen-plan — same labels, same order, same approach. The stappenplan game procedures must mirror vaardigheden skill steps exactly.

| Document | Reference script | Output location |
|----------|-----------------|-----------------|
| Uitleg voorkennis | `template-B_voorkennis.js` | `1. Voorbereiden/` |
| Uitleg vaardigheden | `template-A_vaardigheden.js` | `2. Leren/` |
| Presentatie | `pptx-351-afsluiting.js` | `2. Leren/` |
| Nieuws met visual | `nieuws-351-352-afsluiting.js` | `2. Leren/` |
| Samenvatting | `samenvatting-351-352-rebuild.js` | `2. Leren/` |
| YouTube videos | Write HTML directly | `2. Leren/` |
| Begeleide inoefening | `inoefening-351-afsluiting.js` | `3. Oefenen/begeleide inoefening/` |
| Opgavensets (3 levels) | `opgaven-351-afsluiting.js` | `3. Oefenen/{basis,midden,verrijking}opgaven/` |

Run each with: `NODE_PATH="$(npm root -g)" node <script>.js`

### Phase 5: Convert docx → html (2 min)
```bash
python build-scripts/convert_voorkennis.py "$PAR"
python build-scripts/convert_vaardigheden.py "$PAR"
python build-scripts/convert_begeleide_inoefening.py "$PAR"
```

### Phase 6: Deploy (2 min)
```bash
node scripts/deploy.js "$MODULE"
```
This runs ONLY the automated layer: engine copy, game shell generation, landing pages, link check, data tests. It does NOT build rich documents.

### Phase 7: Verify
- [ ] `_paragraph-plan.md` exists and all sections are filled in
- [ ] `_assets/` folder has PNGs matching every entry in the visuelen-plan
- [ ] File count: 24 files + index.html
- [ ] All .docx/.pptx open in Word/PowerPoint without errors
- [ ] Presentatie has ≥3 economic graphs, presents theory (no exercise instructions)
- [ ] Nieuws met visual has embedded SVG→PNG chart, font sizes 16/11/9pt
- [ ] Samenvatting uses table-based infographic layout
- [ ] Terminology is consistent across all documents (check against terminologie table in plan)
- [ ] **Dual coding**: vaardigheden and voorkennis .docx files contain embedded graphs from `_assets/` (not text-only)
- [ ] **Unified experience**: stappenplan game procedures use the same step labels and sequence as vaardigheden skills
- [ ] **Visuelen-toewijzing**: every visual listed for a builder in the plan is actually embedded in that builder's output
- [ ] Browser: all 4 games load, all section cards appear in landing page
- [ ] Data tests pass: `MODULE_ROOT="$MODULE" npx jest --testPathPatterns "engines/tests/.*-data\.test\.js"`

---

## 4. Script classification

### Platform generators (reusable, run by deploy.js)
Fully automated from data files. deploy.js runs these.

| Script | Reads from | Writes to |
|--------|-----------|-----------|
| `generate-quiz-shells.js` | `shared/questions/*.js` | `1. Voorbereiden/*.html` |
| `build-newsdetective-shells.js` | `shared/newsdetective/*.js` | `1. Voorbereiden/*.html` |
| `build-procedure-shells.js` | `shared/procedure/*.js` | `2. Leren/*.html` |
| `build-reasoning-engine.js` | `shared/reasoning/*.js` | `3. Oefenen/*.html` |
| `build-skilltree-shells.js` | PARAGRAPHS array + `engines/skilltree/base-elements.js` | `shared/skilltree/*.js` + `3. Oefenen/*.html` |
| `build-landing-page.js` | Scans folder contents | `index.html` at 3 levels |
| `build-reasoning-questions.js` | CSV file (manual arg) | `shared/reasoning/*.js` |

### Reusable converters (run manually after .docx creation)

| Script | Input | Output |
|--------|-------|--------|
| `convert_voorkennis.py` | `uitleg voorkennis.docx` in paragraph folder | `uitleg voorkennis.html` alongside |
| `convert_vaardigheden.py` | `uitleg vaardigheden.docx` in paragraph folder | `uitleg vaardigheden.html` alongside |
| `convert_begeleide_inoefening.py` | `begeleide inoefening – vragen.docx` + `antwoorden.docx` | `begeleide inoefening.html` alongside |

### Reference implementations (copy + adapt for each paragraph)
These are paragraph-specific scripts that serve as templates. Copy one, change the content section (marked with `════`), update the output path, run.

| Script | What it builds | Copy for new paragraph |
|--------|---------------|----------------------|
| `template-B_voorkennis.js` | `uitleg voorkennis.docx` | Yes — adapt content section |
| `template-A_vaardigheden.js` | `uitleg vaardigheden.docx` | Yes — adapt content section |
| `pptx-351-afsluiting.js` | `presentatie.pptx` (with SVG graphs) | Yes — new slides + graphs |
| `nieuws-351-352-afsluiting.js` | `nieuws met visual.docx` (with SVG chart) | Yes — new article + chart |
| `samenvatting-351-352-rebuild.js` | `samenvatting.docx` (table-based) | Yes — new content |
| `inoefening-351-afsluiting.js` | `begeleide inoefening` (vragen + antwoorden) | Yes — new exercises |
| `opgaven-351-afsluiting.js` | `opgavensets` (3 levels × 2 docs) | Yes — new exercises |
| `lib-begeleide-inoefening.js` | Shared library used by inoefening scripts | No — import, don't copy |

### Paragraph-specific productions (archival, not templates)
Scripts built for specific paragraphs in earlier work. Useful as examples but not the primary reference.

| Script | Paragraph |
|--------|-----------|
| `pptx-321-marktevenwicht.js` | 3.2.1 |
| `pptx-322-volkomen-concurrentie.js` | 3.2.2 |
| `pptx-323-monopolie.js` | 3.2.3 |
| `build-311-basisopgaven.js` | 3.1.1 |
| `build-infographic-311.js` | 3.1.1 |

### Utility scripts

| Script | Purpose |
|--------|---------|
| `extract-quiz-data.js` | Extract quiz data from old HTML files |
| `restyle-instapquiz.js` | Restyle legacy quiz files |
| `extract-all-antwoorden.py` | Extract answers from textbook |
| `fix-emoji.py` | Fix emoji encoding |
| `prompt-youtube-videos.md` | Prompt template for finding YouTube videos |

---

## 5. What deploy.js does and does NOT do

### deploy.js handles (automated layer):
- Copy engine files (JS/CSS) from `engines/` → `shared/`
- Generate skilltree data + HTML shells
- Generate reasoning game HTML shells
- Generate quiz HTML shells
- Generate newsdetective HTML shells
- Generate procedure (stappenplan) HTML shells
- Rebuild all landing pages (index.html at paragraph/chapter/module level)
- Run link checker
- Run data validation tests

### deploy.js does NOT handle (manual layer):
- Presentatie (.pptx) — must run paragraph-specific pptx script
- Uitleg voorkennis (.docx) — must run adapted template-B script
- Uitleg vaardigheden (.docx) — must run adapted template-A script
- Nieuws met visual (.docx) — must run adapted nieuws script
- Samenvatting (.docx) — must run adapted samenvatting script
- YouTube videos (.html) — must write manually
- Begeleide inoefening (.docx) — must run adapted inoefening script
- Opgavensets (.docx) — must run adapted opgaven script
- HTML conversions (.docx → .html) — must run Python converters
- Static file copy ("Lees dit...") — must copy manually

**In short:** deploy.js builds the interactive shell. The rich teaching documents require paragraph-specific work before deploying.

---

## 6. Validation

After building, run the paragraph validator:

```bash
node scripts/validate-paragraph.js "<path-to-paragraph-folder>"
```

This checks:
- All 23 required files exist
- All .docx files are valid zip archives
- Presentation > 100KB (has graphs)
- All .html files have content (not empty shells)
- Quiz has difficulty-3 per category
- Game data files exist in shared/
- Reasoning CSV source exists

**A paragraph is not done until the validator passes with 0 errors.**

---

## 7. Pedagogical approach by paragraph type

| Paragraph type | Approach | Example |
|----------------|----------|---------|
| **Intro** (first in chapter) | Narrative-first: use named characters, everyday situations, concrete-to-abstract | Lisa choosing between phone/festival/savings |
| **Calculation** (formulas) | Formula-first: worked examples, step-by-step, graph-heavy | Budget line: B = p₁q₁ + p₂q₂ |
| **Toepassen** (review) | Cross-topic synthesis, comparison tables, exam-style | Marktvormen vergelijkingstabel |

The default is **narrative-first** — students connect with stories before abstractions. Only switch to formula-first when the paragraph is primarily about calculation skills.

---

## 8. Build script requirement

**Every scripted-manual file MUST have its build script saved** in `build-scripts/` with naming convention `mN-XYZ-<type>.js` (e.g., `m1-111-presentatie.js`).

This ensures:
- Any file can be regenerated after corrections
- Other agents can study the script to understand the build approach
- The paragraph is reproducible, not a one-shot output

If a build script is not saved, the paragraph build is **incomplete**.

---

## 9. Quality rules (learned from production)

| Rule | Why |
|------|-----|
| Supply curves must have positive Y-intercept | P = 2Q - 40 creates a gap at the Q-axis and implies negative prices |
| PS triangle: vertices at supply Y-intercept, equilibrium, p* on Y-axis | Prevents surplus on wrong side of curve |
| Presentations: theory + worked examples, NEVER exercise instructions | The teacher decides when students practice |
| Every presentation must have ≥3 SVG→PNG economic graphs | Students need repeated exposure to abstract visuals |
| Font sizes in docx: headline 16pt, body 11pt, source 9pt | Matches reference documents; the old 28/20/16pt was too large |
| Every quiz category needs ≥1 difficulty:3 question | Data validation test requires this for the mastery system |
| Samenvatting uses table-based infographic layout | Paragraph-based layout doesn't match the reference |
| CHAPTER_NUMBERS must be updated alongside CHAPTER_FOLDERS | Otherwise navigation shows "Hundefined" |
| Filter `~$` temp files in directory scans | Office lock files get picked up as real content otherwise |
| Run `validate-paragraph.js` before declaring done | Catches missing files, corrupted docx, empty presentations |
| Save all build scripts in `build-scripts/` | Without scripts, the paragraph can't be regenerated or improved |
| Intro paragraphs: narrative-first approach | Students connect with stories (Lisa, Tom) before abstractions |
| Register paragraph AND run deploy | Without deploy, game shells and landing pages are missing — students can't navigate |
| Create `_paragraph-plan.md` before building documents | Ensures terminology consistency and concept coverage across all 8 documents |
| Build shared visuals in `_assets/` before Phase 4c | One graph, many documents — fix once instead of fixing in 3 separate scripts |
| Use `lib-svg-utils.js` instead of inline `svgToPng()` | The same function was copy-pasted in 8 scripts — import the shared library instead |

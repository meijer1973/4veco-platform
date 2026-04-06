# How to Build a Complete Paragraph

From raw exercises to finished interactive lesson page. This document is the single source of truth for the paragraph production process.

---

## 1. Definition of Done

A complete paragraph has **23 files** plus an index.html. Every file listed as required MUST exist before the paragraph is considered done.

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
| 12 | `X.Y.Z [Naam] – redeneer-spel.html` | 3. Oefenen | Yes | `build-reasoning-engine.js` (auto) | `shared/reasoning/X.Y.Z.js` | Generated |
| 13 | `X.Y.Z [Naam] – wiskundevaardigheden.html` | 3. Oefenen | Yes | `build-skilltree-shells.js` (auto) | PARAGRAPHS array in script | Generated |
| 14 | `begeleide inoefening – vragen.docx` | 3. Oefenen/begeleide inoefening | Yes | Adapt `inoefening-351-afsluiting.js` | Exercises with scaffolding | Scripted-manual |
| 15 | `begeleide inoefening – antwoorden.docx` | 3. Oefenen/begeleide inoefening | Yes | Same script as #14 | Same | Scripted-manual |
| 16 | `begeleide inoefening.html` | 3. Oefenen/begeleide inoefening | Yes | `convert_begeleide_inoefening.py` | Files #14 + #15 | Converted |
| 17 | `basis – vragen.docx` | 3. Oefenen/basisopgaven | Yes | Adapt `opgaven-351-afsluiting.js` | Exercises (8-10 questions) | Scripted-manual |
| 18 | `basis – antwoorden.docx` | 3. Oefenen/basisopgaven | Yes | Same script as #17 | Same | Scripted-manual |
| 19 | `midden – vragen.docx` | 3. Oefenen/middenopgaven | Yes | Same script as #17 | Exercises (6-8 questions) | Scripted-manual |
| 20 | `midden – antwoorden.docx` | 3. Oefenen/middenopgaven | Yes | Same script as #17 | Same | Scripted-manual |
| 21 | `verrijking – vragen.docx` | 3. Oefenen/verrijkingsopgaven | Yes | Same script as #17 | Exercises (4-6 questions) | Scripted-manual |
| 22 | `verrijking – antwoorden.docx` | 3. Oefenen/verrijkingsopgaven | Yes | Same script as #17 | Same | Scripted-manual |
| 23 | `index.html` | Root | Yes | `build-landing-page.js` (auto) | Scans folder contents | Generated |

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
| Skilltree config | Entry in `build-skilltree-shells.js` PARAGRAPHS array | JS object: `{ parNr, name, skills }` | Agent adds to array. Data file auto-generated. |

### B. Rich document content (→ paragraph folders in module repo)

These have **no pre-existing source data files**. The raw input is:
- The textbook ("Praktische Economie 2020 antwoorden VWO M3 gestructureerd.docx")
- The paragraph's learning goals and concepts
- Recent Dutch news (for nieuws met visual)
- Real YouTube videos (for youtube-videos)

The agent reads the textbook, understands the economics, and writes the content into paragraph-specific build scripts. This is the **scripted-manual** pattern:

```
Agent reads textbook → Agent writes build script with content → Script generates .docx/.pptx
```

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

### Phase 4: Create rich documents (bulk of the work)
For each document type, copy the reference script, replace the content, run it.

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
- [ ] File count: 23 files + index.html
- [ ] All .docx/.pptx open in Word/PowerPoint without errors
- [ ] Presentatie has ≥3 economic graphs, presents theory (no exercise instructions)
- [ ] Nieuws met visual has embedded SVG→PNG chart, font sizes 16/11/9pt
- [ ] Samenvatting uses table-based infographic layout
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

## 6. Quality rules (learned from production)

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

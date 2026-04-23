# How to Build a Complete Paragraph

This document covers two pipelines that can run independently or together.

| Mode | What it produces | When to use |
|------|-----------------|-------------|
| **Part A only** | Textbook paragraph: markdown + graphs + PDFs | Building chapters via `econ-chapter-builder` |
| **Part B only** | Lessen paragraph companions: 24 root files including `index.html` (docx, pptx, HTML games, landing page) | Adding teacher-facing companions to a 4veco-lessen paragraph when textbook content (Part A) exists |
| **Both (A → B)** | Complete paragraph: textbook + companions | Full production from scratch |

> **Before you start:** Read the **Design Principles** section in [AGENTS.md](AGENTS.md#design-principles). Two principles govern everything: **Dual Coding** (every concept pairs text with a visual) and **Unified Student Experience** (same procedures and approaches across all formats). These are non-negotiable.

---

# PART A: TEXTBOOK BUILD (markdown → graphs → PDF)

Produces the textbook paragraph: theory, exercises, answer models, graphs, and PDFs. Used by `econ-chapter-builder` for chapter assembly. Can run standalone.

**Skills:** `econ-textbook-paragraph`, `econ-exercise-builder`, `economic-graph`, `econ-pdf-builder`

## A1: Input

- **Blueprint paragraph spec** — target exercise, lesson goals, difficulty notes
- **Shared conventions** — from `_chapter-plan.md` if building as part of a chapter (notation, colours, shared contexts, interleaving targets)
- **Prior paragraph context** — if this paragraph depends on an earlier one (key formulas, terminology)

## A2: Build content

Follow `econ-textbook-paragraph` skill exactly:

1. Write `X.Y.Z [Name] – paragraaf.md` — theory + worked example + summary + exercises (all in one file)
2. Extract exercises into `X.Y.Z [Name] – opgaven.md` — from "## Uitgewerkt voorbeeld" through end
3. Write `X.Y.Z [Name] – antwoorden.md` — complete answer model with step-by-step solutions

For consolidation paragraphs (last § in chapter), follow `econ-consolidation-builder` instead:
1. Write `X.Y.Z Gemengde opgaven – opgaven.md` — source material + exercises
2. Write `X.Y.Z Gemengde opgaven – antwoorden.md` — answer model
3. No paragraaf.md — consolidation has no theory section, but its markdown and PDFs are still required

## A3: Build graphs

Follow `economic-graph` skill:

1. Create `_assets/` folder in the paragraph folder
2. Generate SVG for every graph referenced in the markdown
3. Convert each SVG to PNG (via cairosvg or sharp)
4. Save both in `_assets/` with naming: `X.Y.Z_{type}_{number}.{svg|png}`
   - Types: `fig` (theory), `ex` (exercises), `we` (worked example)

## A4: Build PDFs

1. Create `build_pdf.py` (adapt from existing template — `ASSET_DIR="_assets"`, strip Pandoc defaults, paragraph name in footer)
2. Run to generate: paragraaf.pdf, opgaven.pdf, antwoorden.pdf (or opgaven.pdf + antwoorden.pdf for consolidation)
3. Use WeasyPrint (prepend `C:/msys64/mingw64/bin` to PATH)

## A5: Asset completeness gate (HARD GATE)

Before any review, verify:

1. Every `![...](...)` reference in .md files → file exists in `_assets/`
2. Every `.svg` has a matching `.png`
3. Asset naming follows `X.Y.Z_{type}_{number}.{ext}`
4. No orphaned assets (files in `_assets/` not referenced in any .md)
5. All PDFs exist and are >10KB

**If anything fails → go back and fix it. Cannot proceed with missing assets.**

## A6: QC review (INDEPENDENT SUB-AGENT — MANDATORY)

Run `econ-paragraph-review` via a separate sub-agent (not the builder):

> "You are a QC reviewer. You did NOT build this paragraph. Read `econ-paragraph-review`, then review the paragraph at [path]. Run Pass 0 (asset integrity), Pass 1 (didactic), Pass 2 (mathematical). Report all issues."

Save output as `X.Y.Z-review.md`. Fix all FAIL items before proceeding.

The builder is **prohibited from** running this review itself.

## A7: Quality ref (INDEPENDENT SUB-AGENT — MANDATORY)

Generate `X.Y.Z-quality-ref.yaml` via a separate sub-agent:

> "Read `econ-quality-control`. Inventory all components that actually exist (check file existence). Run asset integrity checks. Generate quality_ref YAML. Be honest about gaps."

## A-verify: Part A checklist

**Theory paragraphs:**
- [ ] paragraaf.md, opgaven.md, antwoorden.md exist
- [ ] paragraaf.pdf, opgaven.pdf, antwoorden.pdf exist (>10KB each)
- [ ] build_pdf.py exists
- [ ] `_assets/` has SVG+PNG pairs with `X.Y.Z_{type}_{number}` naming
- [ ] 0 broken image references
- [ ] `X.Y.Z-review.md` exists (from independent sub-agent)
- [ ] `X.Y.Z-quality-ref.yaml` exists (from independent sub-agent)

**Consolidation paragraphs:**
- [ ] opgaven.md, antwoorden.md exist (no paragraaf.md)
- [ ] opgaven.pdf, antwoorden.pdf exist (>10KB each)
- [ ] build_pdf.py exists
- [ ] `_assets/` has SVG+PNG pairs (if any graphs)
- [ ] 0 broken image references
- [ ] `X.Y.Z-review.md` exists
- [ ] `X.Y.Z-quality-ref.yaml` exists

**Part A is complete when all items are checked.**

---

# PART B: LESSEN COMPANIONS (docx, pptx, html, landing page)

Produces the teacher-facing companions for a lessen paragraph: 24 root files including presentations, Word documents, HTML games, and `index.html`. Part B can reuse `_assets/` graphs from Part A.

**If Part A was run first:** the `_assets/` folder already contains all graphs. Part B builders (presentatie, voorkennis, vaardigheden, nieuws, samenvatting, begeleide inoefening) embed these graphs rather than generating new ones.

## B0. Target and layout

- **Target repo:** `C:\Projects\4veco\4veco-lessen`.
- **Naming:** `Boek N - Title / N.X Hoofdstuk X - Name / N.X.Y [Naam]`. Books replace the old "Module N" level; chapters and paragraphs keep their two- and three-part numbering.
- **Per-paragraph layout is flat.** All 24 Part B files, including `index.html`, sit directly in the paragraph folder alongside Part A outputs (`paragraaf.md`, `opgaven.md`, `antwoorden.md`, `_assets/`, PDFs, `build_pdf.py`, review.md, quality-ref.yaml). No `1. Voorbereiden/`, `2. Leren/`, `3. Oefenen/` subfolders.
- **Section labels** in tables below (Voorbereiden / Leren / Oefenen) identify the pedagogical role of a file, not a folder. Files are grouped by filename convention (`uitleg voorkennis`, `presentatie`, `begeleide inoefening –`, `basis –`, etc.).
- **`shared/` lives at book root:** `4veco-lessen/Boek N - Title/shared/` holds engine JS/CSS and the game data files (`shared/questions/`, `shared/procedure/`, etc.).
- **Module 3 references in older guides are legacy.** For new work, this spec supersedes them. Module 3 (`../3. Module 3 - Markt en overheid/`) stays on its subfolder layout until it retires in September 2026.

## B1. Definition of Done

A complete Part B companion set has **24 required root files including `index.html`**. Every file listed below MUST exist before the companion paragraph is considered done.

| # | File | Section | Required | Builder | Source input | Output type |
|---|------|---------|----------|---------|--------------|-------------|
| 1 | `X.Y.Z [Naam] – instapquiz.html` | Voorbereiden | Yes | `generate-quiz-shells.js` (auto) | `shared/questions/X.Y.Z.js` | Generated |
| 2 | `X.Y.Z [Naam] – nieuws-detective.html` | Voorbereiden | Yes | `build-newsdetective-shells.js` (auto) | `shared/newsdetective/X.Y.Z.js` | Generated |
| 3 | `X.Y.Z [Naam] – uitleg voorkennis.docx` | Voorbereiden | Yes | Adapt `template-B_voorkennis.js` | Book content + domain knowledge | Scripted-manual |
| 4 | `X.Y.Z [Naam] – uitleg voorkennis.html` | Voorbereiden | Yes | `convert_voorkennis.py` | File #3 (.docx) | Converted |
| 5 | `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` | Voorbereiden | Yes | Copy | Static file (identical in every paragraph) | Static |
| 6 | `X.Y.Z [Naam] – presentatie.pptx` | Leren | Yes | Adapt `pptx-331-rol-overheid.js` (uses `lib-pptx.js`) | Book content + SVG graphs | Scripted-manual |
| 7 | `X.Y.Z [Naam] – uitleg vaardigheden.docx` | Leren | Yes | Adapt `template-A_vaardigheden.js` | Book content + domain knowledge | Scripted-manual |
| 8 | `X.Y.Z [Naam] – uitleg vaardigheden.html` | Leren | Yes | `convert_vaardigheden.py` | File #7 (.docx) | Converted |
| 9 | `X.Y.Z [Naam] – nieuws met visual.docx` | Leren | Yes | Adapt `nieuws-351-352-afsluiting.js` | Recent Dutch news + SVG visual | Scripted-manual |
| 10 | `X.Y.Z [Naam] – samenvatting.docx` | Leren | Yes | Adapt `samenvatting-351-352-rebuild.js` | Key concepts from paragraph | Scripted-manual |
| 11 | `X.Y.Z [Naam] – youtube-videos.html` | Leren | Yes | Write directly | 3 real YouTube video IDs | Manual |
| 12 | `X.Y.Z [Naam] – stappenplan.html` | Leren | Yes | `build-procedure-shells.js` (auto) | `shared/procedure/X.Y.Z.js` | Generated |
| 13 | `X.Y.Z [Naam] – redeneer-spel.html` | Oefenen | Yes | `build-reasoning-engine.js` (auto) | `shared/reasoning/X.Y.Z.js` | Generated |
| 14 | `X.Y.Z [Naam] – wiskundevaardigheden.html` | Oefenen | Yes | `build-skilltree-shells.js` (auto) | `skilltree` field in book manifest | Generated |
| 15 | `X.Y.Z [Naam] – begeleide inoefening – vragen.docx` | Oefenen/begeleide inoefening | Yes | Adapt `inoefening-351-afsluiting.js` | Exercises with scaffolding | Scripted-manual |
| 16 | `X.Y.Z [Naam] – begeleide inoefening – antwoorden.docx` | Oefenen/begeleide inoefening | Yes | Same script as #15 | Same | Scripted-manual |
| 17 | `X.Y.Z [Naam] – begeleide inoefening.html` | Oefenen/begeleide inoefening | Yes | `convert_begeleide_inoefening.py` | Files #15 + #16 | Converted |
| 18 | `X.Y.Z [Naam] – basis – vragen.docx` | Oefenen/basisopgaven | Yes | Adapt `opgaven-351-afsluiting.js` | Exercises (8-10 questions) | Scripted-manual |
| 19 | `X.Y.Z [Naam] – basis – antwoorden.docx` | Oefenen/basisopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 20 | `X.Y.Z [Naam] – midden – vragen.docx` | Oefenen/middenopgaven | Yes | Same script as #18 | Exercises (6-8 questions) | Scripted-manual |
| 21 | `X.Y.Z [Naam] – midden – antwoorden.docx` | Oefenen/middenopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 22 | `X.Y.Z [Naam] – verrijking – vragen.docx` | Oefenen/verrijkingsopgaven | Yes | Same script as #18 | Exercises (4-6 questions) | Scripted-manual |
| 23 | `X.Y.Z [Naam] – verrijking – antwoorden.docx` | Oefenen/verrijkingsopgaven | Yes | Same script as #18 | Same | Scripted-manual |
| 24 | `index.html` | Root | Yes | `build-landing-page.js` (auto) | Scans folder contents | Generated |

> **Flat-layout filename change:** in the retargeted Part B, opgavenset and begeleide-inoefening filenames keep the `X.Y.Z [Naam] –` prefix so they stay unique at the paragraph root (since there are no longer `basisopgaven/` or `begeleide inoefening/` subfolders to disambiguate them). Role labels in the Section column identify pedagogical role only, not folder paths.

### Output type definitions

| Type | Meaning | Human effort |
|------|---------|--------------|
| **Generated** | Fully automated from data files. deploy.js handles this. | Create the data file only. |
| **Converted** | Automated transformation of an existing .docx to .html. | Run the converter after creating the .docx. |
| **Scripted-manual** | A Node.js script generates the file, but the script must be written per-paragraph with paragraph-specific content. Copy a reference script, replace the content section. | Write economics content, adapt a reference script, run it. |
| **Manual** | Written by hand (no generator). | Create the file directly. |
| **Static** | Identical copy in every paragraph. | Copy from an existing paragraph. |

---

## B2. Input contract

These are the raw inputs needed to build one paragraph. They must exist BEFORE running any builder.

### A. Game data files (→ `shared/` in module repo)

| Input | Location | Format | Who creates it |
|-------|----------|--------|----------------|
| Quiz questions | `shared/questions/X.Y.Z.js` | JS: `var QUIZ_DATA = { meta, categories, questions }` | Agent writes the JS file. 15 questions, 3-4 categories, at least one difficulty:3 per category. |
| Reasoning questions | `source-data/book-N/reasoning/X.Y.Z.csv` | Semicolon-delimited CSV, 15 rows, 5 modes | Agent writes CSV, then runs `build-reasoning-questions.js` to produce `shared/reasoning/X.Y.Z.js`. |
| Newsdetective data | `shared/newsdetective/X.Y.Z.js` | JS: `var NEWS_DETECTIVE_DATA = { meta, article, rounds }` | Agent writes the JS file. Real Dutch news, 4 rounds. |
| Procedure data | `shared/procedure/X.Y.Z.js` | JS: `var PROCEDURE_DATA = { meta, procedures }` | Agent writes the JS file. Steps aligned with uitleg vaardigheden. |
| Skilltree config | `skilltree` field in the book manifest paragraph entry | JSON: `{ "skills": ["A01", ...] }` or `{ "skills": null }` (all) | Agent adds to manifest. Data file auto-generated in `shared/skilltree/`. |

### B. Rich document content — per-asset production specs

Each scripted-manual asset follows the same pattern: **read source → write build script with content → run script → get .docx/.pptx**. But the raw input, the extraction process, and the reusable vs custom split differ per asset. Here is the exact spec for each.

#### Presentatie (.pptx)
| | |
|---|---|
| **Raw input** | Textbook paragraph: concepts, formulas, worked examples. Read via python-docx. |
| **Agent process** | Extract 5-8 key concepts. For each: write a theory slide + design an SVG graph that visualises it. |
| **Reference script** | `pptx-331-rol-overheid.js` — copy, replace slide content + SVG graph functions. Uses shared `lib-pptx.js`. |
| **Reusable (don't change)** | `lib-pptx.js` exports: PC/SC/HEX palettes, T typography presets, `defineMasters()`, `svgToPng()`, `ICON`/`placeIcon()`, `svgHeader()`, `editorialTitle()`, `fixPptxFile()`, `roundtripWithLibreOffice()`. |
| **Custom (must write)** | Slide sequence, text content per slide, SVG graph code per concept, speaker notes. |
| **Skills to read first** | `econ-pptx-templates` + `economic-graph` |
| **Hard rules** | Theory + worked examples only, NEVER exercise instructions. Min 3 SVG→PNG graphs. Min 18pt font. After `writeFile()` always call `fixPptxFile()` + `roundtripWithLibreOffice()` — raw PptxGenJS output triggers PowerPoint repair dialog. |

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
| **Raw input** | Textbook exercises for this paragraph + worked solutions from the answer key docx. Extract any textbook graphs for reuse. |
| **Agent process** | Select 6-8 exercises. For each: write the question, add scaffolding (denkstappen, hints, formule-herinneringen), write the full solution. **Critical: add visual scaffolding (scaffoldImage) for exercises involving graphs, budget lines, or other visual concepts.** This document is used heavily by students who find the material difficult — graphical support is essential, not optional. |
| **Reference script** | `inoefening-351-afsluiting.js` — copy, replace exercise content. |
| **Reusable** | `lib-begeleide-inoefening.js` library (import, don't copy) + script scaffold. Supports `scaffoldImage` (shown in both vragen and antwoorden) and `afterAnswerImage` (shown in antwoorden only). |
| **Custom** | Exercise questions, scaffolding text, worked solutions, scaffold images from `_assets/`. |
| **Skills** | `econ-word-templates` + `econ-didactiek` |
| **Hard rule** | Every exercise that asks students to draw, describe, or interpret a graph MUST have a `scaffoldImage` from `_assets/`. This is dual coding applied to scaffolding — weaker students need visual anchors alongside text-based denkstappen. |

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

### C. Registration entries (→ book manifest)

The target book carries a `deploy-config.json` manifest at its root (e.g.
`4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`).
Platform generators read this manifest; it is the single source of truth for
chapter structure, paragraph metadata, and per-paragraph game config.

| Edit | What to add | When |
|------|-------------|------|
| Book manifest `paragraphs[]` | `{ id, name, chapter, domain, skilltree, kind? }` | Every new Part B/complete lessen paragraph |
| Book manifest `chapters[]` | `{ id, folder, name, number, domain }` | Only for a new chapter |
| Paragraph `skilltree` field | `{ skills: ["A01", ...] }` or `{ skills: null }` (all) | Required for every Part B/complete paragraph because wiskundevaardigheden is one of the 24 required files |
| `engines/theme.js` | DOMAIN_COLORS entry | Only for a brand-new domain name (teal/blue/amber/green/purple already exist) |

Existing Part A-only textbook paragraphs may omit `skilltree` until companion production starts. A paragraph is not a complete Part B paragraph until the `skilltree` field is present and the wiskundevaardigheden shell/data have been generated.

The loader (`build-scripts/lib/lib-deploy-config.js`) hard-fails if the manifest
is missing or malformed. There is no auto-detection fallback.

---

## B3. End-to-end workflow

This is the production sequence for one paragraph. Follow in order.

### Phase 1: Register (2 min)
1. Open the book's `deploy-config.json` manifest.
2. Add an entry to `paragraphs[]`: `{ "id": "X.Y.Z", "name": "...", "chapter": "X.Y", "domain": "<teal|blue|amber|green|purple>", "skilltree": { "skills": [...] } }`. Use `"skilltree": { "skills": null }` when all math skills should be visible.
3. If this is the first paragraph in a new chapter, add an entry to `chapters[]` first.
4. For a new domain (beyond teal/blue/amber/green/purple), add it to `engines/theme.js` — otherwise nothing else to touch.

### Phase 2: Create folder structure (1 min)
```bash
BOOK="../4veco-lessen/Boek N - Title"
PAR="$BOOK/N.X Hoofdstuk X - Name/N.X.Y [Naam]"
mkdir -p "$PAR"
# Flat layout: no 1. Voorbereiden / 2. Leren / 3. Oefenen subfolders.
# Part A outputs and all 24 Part B files, including index.html, live at the paragraph root.
# Static "Lees dit..." file — copy from any existing lessen paragraph:
cp "$BOOK/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/Lees dit als je niet weet hoe je moet beginnen met deze les.docx" "$PAR/" 2>/dev/null || echo "Seed the static file from a legacy source on first run."
```

### Phase 3: Create game data files (30 min)

Game runtime data files live under `$BOOK/shared/` (e.g. `4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/`). Reasoning runtime data is `shared/reasoning/X.Y.Z.js`. The raw reasoning CSV source lives under `source-data/book-N/reasoning/` in the platform repo.

1. Write `$BOOK/shared/questions/X.Y.Z.js` — quiz data (15 questions)
2. Write `source-data/book-N/reasoning/X.Y.Z.csv` — source-of-truth reasoning CSV
3. Run: `MODULE_ROOT="$BOOK" node build-scripts/platform/build-reasoning-questions.js X.Y.Z <domain> source-data/book-N/reasoning/X.Y.Z.csv` — writes `shared/reasoning/X.Y.Z.js`
4. Write `$BOOK/shared/newsdetective/X.Y.Z.js` — newsdetective data
5. Write `$BOOK/shared/procedure/X.Y.Z.js` — procedure/stappenplan data. Steps MUST align with the vaardigheden skills (same labels, same order). See procedure-stappen-plan in the paragraph plan.

> The `MODULE_ROOT` env-var name is kept (not renamed to `BOOK_ROOT`) so existing scripts continue to work. It points at a lessen book root in the new pipeline.

### Phase 4: Create rich documents (bulk of the work)

Phase 4 has three sub-phases. The planning step ensures terminology consistency and visual reuse across all 8 documents.

#### Phase 4a — Plan (15 min)

This paragraph plan is required for Part B/complete companion production. It is not required for Part A-only textbook paragraphs.

Read the textbook paragraph and answer key thoroughly, then create the paragraph plan.

1. Copy `build-scripts/templates/template-paragraph-plan.md` → `<paragraph-folder>/_paragraph-plan.md`
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

This plan is the **single source of truth** for all Part B builders. Every companion builder reads it before starting.

#### Phase 4b — Build shared visuals (20 min)

Build all SVG graphics listed in the visuelen-plan, so they can be reused across documents.

1. Create `<paragraph-folder>/_assets/` subfolder
2. For each visual in the visuelen-plan:
   - Write the SVG following the `economic-graph` skill spec
   - Render to PNG via `lib/lib-svg-utils.js`: `const { svgToPng } = require('../../lib/lib-svg-utils')`
   - Save both `.svg` and `.png` to `_assets/` (e.g. `_assets/va-equilibrium.svg`, `_assets/va-equilibrium.png`)
3. Optionally save the asset-builder script as `build-scripts/content/book-N/bN-XYZ-build-assets.js`
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
| Uitleg voorkennis | `template-B_voorkennis.js` | `<paragraph folder>` |
| Uitleg vaardigheden | `template-A_vaardigheden.js` | `<paragraph folder>` |
| Presentatie | `pptx-331-rol-overheid.js` | `<paragraph folder>` |
| Nieuws met visual | `nieuws-351-352-afsluiting.js` | `<paragraph folder>` |
| Samenvatting | `samenvatting-351-352-rebuild.js` | `<paragraph folder>` |
| YouTube videos | Write HTML directly | `<paragraph folder>` |
| Begeleide inoefening | `inoefening-351-afsluiting.js` | `<paragraph folder>` |
| Opgavensets (3 levels) | `opgaven-351-afsluiting.js` | `<paragraph folder>` |

Run each with: `NODE_PATH="$(npm root -g)" node <script>.js`

### Phase 5: Convert docx → html (2 min)
```bash
python build-scripts/lib/convert_voorkennis.py "$PAR"
python build-scripts/lib/convert_vaardigheden.py "$PAR"
python build-scripts/lib/convert_begeleide_inoefening.py "$PAR"
```
Converters read the source `.docx` from `$PAR` directly (flat layout) and write the `.html` alongside.

### Phase 5a–5c: QC gates

If Part A was run first, these are already done (A5–A7). Skip to Phase 6.

If running Part B only (textbook content already exists), run these QC steps now:
- **5a**: Asset completeness gate — see Part A §A5
- **5b**: Didactic and precision review (independent sub-agent) — see Part A §A6
- **5c**: Generate quality_ref (independent sub-agent) — see Part A §A7

### Phase 6: Deploy (2 min)
```bash
node scripts/deploy.js "$BOOK"
```
`$BOOK` points at a lessen book root (e.g. `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`); `shared/` lives directly under it. This runs ONLY the automated layer: engine copy, game shell generation (flat output into each paragraph root), landing pages, link check, data tests. It does NOT build rich documents.

### B-verify: Part B checklist

**Part A prerequisites (skip if running Part B only with existing content):**
- [ ] Part A checklist passed (see A-verify above)

**Platform files:**
- [ ] `_paragraph-plan.md` exists and all sections are filled in
- [ ] `_assets/` folder has PNGs matching every entry in the visuelen-plan
- [ ] File count: 24 required Part B root files, including index.html
- [ ] All .docx/.pptx open in Word/PowerPoint without errors
- [ ] Presentatie has ≥3 economic graphs, presents theory (no exercise instructions)
- [ ] Nieuws met visual has embedded SVG→PNG chart, font sizes 16/11/9pt
- [ ] Samenvatting uses table-based infographic layout
- [ ] Terminology is consistent across all documents (check against terminologie table in plan)

**Design principles:**
- [ ] **Dual coding**: vaardigheden and voorkennis .docx files contain embedded graphs from `_assets/` (not text-only)
- [ ] **Unified experience**: stappenplan game procedures use the same step labels and sequence as vaardigheden skills
- [ ] **Visuelen-toewijzing**: every visual listed for a builder in the plan is actually embedded in that builder's output

**Deployment:**
- [ ] Browser: all 4 games load, all section cards appear in landing page
- [ ] Data tests pass: `MODULE_ROOT="$BOOK" npx jest --testPathPatterns "engines/tests/.*-data\.test\.js"`
- [ ] `validate-paragraph.js` passes with 0 errors

---

## B4. Script classification

### Platform generators (reusable, run by deploy.js)
Fully automated from data files. deploy.js runs these.

| Script | Reads from | Writes to |
|--------|-----------|-----------|
| `generate-quiz-shells.js` | `shared/questions/*.js` | `<paragraph folder>/*.html` |
| `build-newsdetective-shells.js` | `shared/newsdetective/*.js` | `<paragraph folder>/*.html` |
| `build-procedure-shells.js` | `shared/procedure/*.js` | `<paragraph folder>/*.html` |
| `build-reasoning-engine.js` | `shared/reasoning/*.js` | `<paragraph folder>/*.html` |
| `build-skilltree-shells.js` | Book manifest paragraphs with `skilltree` + `engines/skilltree/base-elements.js` | `shared/skilltree/*.js` + `<paragraph folder>/*.html` |
| `build-landing-page.js` | Book manifest + scans paragraph folder contents (filename-based classification, flat layout) | `index.html` at paragraph/chapter/book levels |
| `build-reasoning-questions.js` | CSV file (manual arg) | `shared/reasoning/*.js` |

> **Flat layout:** all generators emit directly to the paragraph root — there are no phase subfolders. Each generator calls `loadConfig(MODULE_ROOT)` to read the book's `deploy-config.json` and resolves each `parNr` to its folder via the manifest. Data files whose parNr is not in the manifest are skipped with a warning. The current skilltree generator only emits for paragraphs that declare `skilltree`; for a complete Part B paragraph, that declaration is required.

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
| `pptx-331-rol-overheid.js` | `presentatie.pptx` (with SVG graphs + editorial design) | Yes — new slides + graphs; uses `lib-pptx.js` |
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

## B5. What deploy.js does and does NOT do

### deploy.js handles (automated layer):
- Copy engine files (JS/CSS) from `engines/` → `<book>/shared/`
- Generate skilltree data + HTML shells (flat output: shells land at paragraph root)
- Generate reasoning game HTML shells (flat output)
- Generate quiz HTML shells (flat output)
- Generate newsdetective HTML shells (flat output)
- Generate procedure (stappenplan) HTML shells (flat output)
- Rebuild all landing pages (index.html at paragraph/chapter/book level)
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

## B6. Validation

`validate-paragraph.js` should enforce the flat-layout contract in modes:

- **Part A/textbook mode**: validates textbook files at the paragraph root. Theory paragraphs require paragraaf/opgaven/antwoorden markdown and PDFs. Consolidation paragraphs require opgaven/antwoorden markdown and PDFs; `paragraaf.md`/`paragraaf.pdf` are not required because consolidation has no theory section.
- **Part B/companion mode**: validates the 24 required Part B root files listed in B1, including `index.html`. `_paragraph-plan.md` is required in this mode because it is the source of truth for companion builders.
- **Complete mode**: validates both Part A and Part B.

For Part B/complete mode, game runtime data lives in `<book>/shared/`:

- `shared/questions/X.Y.Z.js`
- `shared/newsdetective/X.Y.Z.js`
- `shared/reasoning/X.Y.Z.js`
- `shared/procedure/X.Y.Z.js`
- `shared/skilltree/X.Y.Z.js`

The raw reasoning CSV source is kept in `source-data/book-N/reasoning/X.Y.Z.csv` in the platform repo, then compiled into `shared/reasoning/X.Y.Z.js`. Do not validate it as `shared/reasoning/X.Y.Z.csv`.

After building, run the paragraph validator:

```bash
node scripts/validate-paragraph.js "<path-to-paragraph-folder>"
```

This checks:
- All 24 required Part B files exist at the paragraph root (flat layout), including `index.html`
- All .docx files are valid zip archives
- Presentation > 100KB (has graphs)
- All .html files have content (not empty shells)
- Quiz has difficulty-3 per category
- Game data files exist in `<book>/shared/`
- Reasoning runtime JS exists in `<book>/shared/reasoning/`; source CSV exists in platform `source-data/book-N/reasoning/` when source checks are enabled

**A Part B/complete paragraph is not done until the validator passes with 0 errors.**

---

## B7. Pedagogical approach by paragraph type

| Paragraph type | Approach | Example |
|----------------|----------|---------|
| **Intro** (first in chapter) | Narrative-first: use named characters, everyday situations, concrete-to-abstract | Lisa choosing between phone/festival/savings |
| **Calculation** (formulas) | Formula-first: worked examples, step-by-step, graph-heavy | Budget line: B = p₁q₁ + p₂q₂ |
| **Toepassen** (review) | Cross-topic synthesis, comparison tables, exam-style | Marktvormen vergelijkingstabel |

The default is **narrative-first** — students connect with stories before abstractions. Only switch to formula-first when the paragraph is primarily about calculation skills.

---

## B8. Build script requirement

**Every scripted-manual file MUST have its build script saved** in `build-scripts/content/book-N/` with naming convention `bN-XYZ-<type>.js` (e.g., `b1-111-presentatie.js`). Older Module 3 scripts under `build-scripts/content/module-N/` stay where they are; new lessen work writes under `book-N/`.

This ensures:
- Any file can be regenerated after corrections
- Other agents can study the script to understand the build approach
- The paragraph is reproducible, not a one-shot output

If a build script is not saved, the paragraph build is **incomplete**.

---

## B9. Quality rules (learned from production)

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
| Save all build scripts in `build-scripts/content/book-N/` | Without scripts, the paragraph can't be regenerated or improved |
| Intro paragraphs: narrative-first approach | Students connect with stories (Lisa, Tom) before abstractions |
| Register paragraph AND run deploy | Without deploy, game shells and landing pages are missing — students can't navigate |
| Create `_paragraph-plan.md` before building documents | Ensures terminology consistency and concept coverage across all 8 documents |
| Build shared visuals in `_assets/` before Phase 4c | One graph, many documents — fix once instead of fixing in 3 separate scripts |
| Use `lib-svg-utils.js` instead of inline `svgToPng()` | The same function was copy-pasted in 8 scripts — import the shared library instead |
| Begeleide inoefening MUST have `scaffoldImage` for graph exercises | This document is scaffolding for weaker students — visual support is essential, not optional |
| Run `econ-paragraph-review` two-pass review before delivering | Catches slope errors, missing domain restrictions, broken dual coding, and other issues that are hard to fix after delivery |
| Generate `quality_ref` YAML after every paragraph build | Powers inspectie-verantwoording and quality reports at chapter/module/course level — see `econ-quality-control` skill |

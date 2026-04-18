# Build Scripts

This folder contains all production scripts used to turn source material into the rich paragraph outputs that appear in the module repos.

If you want to build a complete paragraph from scratch, start with [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md). This README explains how the scripts in `build-scripts/` are grouped and how to use that grouping.

## Script Types

There are four script categories in this folder.

### 1. Platform Generators

These are reusable scripts that generate the automated layer. They are the scripts that `scripts/deploy.js` relies on.

| Script | Purpose |
|--------|---------|
| `generate-quiz-shells.js` | Build quiz HTML shells from quiz data files |
| `build-newsdetective-shells.js` | Build nieuws-detective HTML shells |
| `build-reasoning-engine.js` | Build reasoning game HTML shells |
| `build-reasoning-questions.js` | Convert reasoning CSV into `shared/reasoning/*.js` |
| `build-skilltree-shells.js` | Build skilltree data + HTML shells |
| `build-landing-page.js` | Build `index.html` at paragraph/chapter/module level |

Use these when:
- the source already exists as structured data
- the output should be fully reproducible
- the step belongs to the automated layer

### 2. Converters

These transform rich `.docx` source files into interactive HTML variants.

| Script | Input | Output |
|--------|-------|--------|
| `convert_voorkennis.py` | `uitleg voorkennis.docx` | `uitleg voorkennis.html` |
| `convert_vaardigheden.py` | `uitleg vaardigheden.docx` | `uitleg vaardigheden.html` |
| `convert_begeleide_inoefening.py` | vragen + antwoorden `.docx` | `begeleide inoefening.html` |

Use these after the corresponding `.docx` has already been produced.

### 3. Reference Implementations

These are the most important scripts for rich paragraph production outside the automated layer. They are not fully generic generators, but they are the intended reference points to copy and adapt for a new paragraph.

| Script | Builds |
|--------|--------|
| `template-B_voorkennis.js` | `uitleg voorkennis.docx` |
| `template-A_vaardigheden.js` | `uitleg vaardigheden.docx` |
| `pptx-331-rol-overheid.js` | reference presentation builder (uses `lib-pptx.js`; editorial design system) |
| `lib-pptx.js` | shared pptx library: palettes, typography, slide masters, SVG pipeline, LibreOffice round-trip |
| `roundtrip-pptx.py` | python-pptx round-trip helper (legacy; LibreOffice round-trip in `lib-pptx.js` preferred) |
| `nieuws-351-352-afsluiting.js` | `nieuws met visual.docx` |
| `samenvatting-351-352-rebuild.js` | paragraph `samenvatting.docx` |
| `inoefening-351-afsluiting.js` | begeleide inoefening docs |
| `opgaven-351-afsluiting.js` | basis/midden/verrijking opgavensets |
| `lib-begeleide-inoefening.js` | shared library used by inoefening scripts |
| `lib-svg-utils.js` | shared SVG→PNG pipeline + graph color palette (used by all visual builders) |
| `template-paragraph-plan.md` | planning template — copy into paragraph folder as `_paragraph-plan.md` during Phase 4a |

Use these when:
- the asset is rich, paragraph-specific, and content-heavy
- you need a proven scaffold instead of starting from zero
- the file is built by "copy script, replace content section, run script"

### 4. Paragraph-Specific or Utility Scripts

These are useful examples, migrations, or maintenance helpers, but they are not the main source of truth for new work.

Examples:
- `pptx-321-marktevenwicht.js`
- `pptx-322-volkomen-concurrentie.js`
- `pptx-323-monopolie.js`
- `pptx-332-overheidsbeleid.js`, `pptx-333-collectieve-goederen.js`, `pptx-334-toepassen.js` (creative builds that match `pptx-331-rol-overheid.js`)
- `build-311-basisopgaven.js`
- `build-infographic-311.js`
- `extract-quiz-data.js`
- `restyle-instapquiz.js`
- `extract-all-antwoorden.py`
- `fix-emoji.py`
- `prompt-youtube-videos.md`

## How To Use This Folder

### If you are building the automated layer

Run:

```bash
node scripts/deploy.js "../3. Module 3 - Markt en overheid"
```

This handles:
- engine copy
- shell generation
- landing pages
- validation

### If you are building a complete paragraph

Follow [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md), then use scripts from this folder in this order:

1. Create or update structured game data
2. Run platform generators
3. **Phase 4a**: Create `_paragraph-plan.md` (copy `template-paragraph-plan.md`, fill in concepts/visuals/terminology)
4. **Phase 4b**: Build shared visuals in `_assets/` using `lib-svg-utils.js`
5. **Phase 4c**: Build rich `.docx` / `.pptx` assets from reference implementations, reading from plan + `_assets/`
6. Run converters for HTML versions
7. Run `deploy.js`
8. Verify output

## Conventions

- Reusable scripts should include a `HOW TO ADAPT` header.
- Paragraph-specific content should live in clearly marked content sections.
- Shared libraries should be imported, not copied.
- Scripts that are good starting points for new paragraphs should say so explicitly in their header comments.
- If a script is archival or paragraph-specific, say that explicitly in the header comments.

## Scope Reminder

`deploy.js` does not build the full rich paragraph by itself.

It does not create:
- presentaties
- uitleg voorkennis docx
- uitleg vaardigheden docx
- nieuws met visual
- samenvattingen
- begeleide inoefeningen
- opgavensets
- YouTube pages

Those still require paragraph-specific content work first, using the reference implementations listed above.

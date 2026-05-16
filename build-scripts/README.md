# Build Scripts

This folder contains all production scripts used to turn source material into the rich paragraph outputs that appear in lesson targets.

If you want to build a complete paragraph from scratch, start with [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md).

## Folder Layout

```
build-scripts/
├── platform/       core platform generators (used by scripts/deploy.js)
├── lib/            shared libraries, converters, verifiers
├── templates/      reusable scaffolds to copy when starting a new paragraph
├── content/
│   ├── book-1/     paragraph-specific builders for Book 1 and onward
│   └── legacy-target/ legacy paragraph-specific builders kept as references
└── archive/        legacy / one-off scripts kept for reference
```

The split is: **`platform/`, `lib/`, `templates/` are the reusable core** — they rarely change per paragraph. **`content/` is the per-paragraph material** — each `.js` file is effectively content that happens to live in script form.

## Output Convention

Intermediate build artifacts (pptx, svg, png) go to `output/{paragraph-code}/` at the repo root — e.g. `output/3.3.1/` for §3.3.1 and `output/3.4.2/` for §3.4.2. The whole `/output/` tree is gitignored; scripts may overwrite it freely. Final deployable artifacts still land inside the module repos via `scripts/deploy.js`.

## Script Types

## Output Profiles

New paragraph work is web-first. Use the validator profiles instead of assuming
every build must emit every Office or print artifact:

```bash
node scripts/validate-paragraph.js --mode complete --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode complete --profile legacy-full "<paragraph>"
node scripts/validate-paragraph.js --mode complete --profile office "<paragraph>"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<paragraph>"
```

- `student-web` is the normal path for paragraph 1.1.2 and later: HTML
  companions, games, presentation HTML/PPTX, source markdown, plans, reviews,
  data, and assets.
- `office` is opt-in when DOCX exports are explicitly requested.
- `legacy-full` checks the older 27-file companion contract.
- `publisher-print` checks the textbook PDFs for the separate publisher/print
  pipeline.

### 1. Platform Generators — `platform/`

Reusable scripts that generate the automated layer. These are what `scripts/deploy.js` invokes.

| Script | Purpose |
|--------|---------|
| `platform/generate-quiz-shells.js` | Quiz HTML shells from quiz data files |
| `platform/build-newsdetective-shells.js` | Nieuws-detective HTML shells |
| `platform/build-reasoning-engine.js` | Reasoning game HTML shells |
| `platform/build-reasoning-questions.js` | Reasoning CSV → `shared/reasoning/*.js` |
| `platform/build-skilltree-shells.js` | Skilltree data + HTML shells |
| `platform/build-procedure-shells.js` | Procedure HTML shells |
| `platform/build-graphical-shells.js` | Graphical-game HTML shells |
| `platform/build-landing-page.js` | `index.html` at paragraph/chapter/module level |
| `platform/build-single-page-nav.js` | Single-page navigation for GitHub Pages |

Use when the source already exists as structured data and the output should be fully reproducible.

### 2. Shared Libraries, Converters, Verifiers — `lib/`

| File | Role |
|------|------|
| `lib/lib-pptx.js` | Palettes, typography, slide masters, SVG pipeline, LibreOffice round-trip |
| `lib/lib-svg-utils.js` | SVG→PNG pipeline + graph color palette |
| `lib/lib-svg-save.js` | Simple SVG file writer used by presentation builders |
| `lib/lib-begeleide-inoefening.js` | Shared document builders for begeleide inoefening |
| `lib/convert_voorkennis.py` | Converter: `uitleg voorkennis.docx` → HTML |
| `lib/convert_vaardigheden.py` | Converter: `uitleg vaardigheden.docx` → HTML |
| `lib/convert_begeleide_inoefening.py` | Converter: vragen + antwoorden `.docx` → HTML |
| `lib/verify_svg_geometry.py` | SVG geometry verifier (run after every SVG edit) |

`lib-*.js` files are imported by content scripts. Converters and the verifier are invoked standalone.

### 3. Templates — `templates/`

Starting points for new paragraph builders.

| File | Use |
|------|-----|
| `templates/template-A_vaardigheden.js` | Scaffold for `uitleg vaardigheden.docx` builder |
| `templates/template-B_voorkennis.js` | Scaffold for `uitleg voorkennis.docx` builder |
| `templates/template-paragraph-plan.md` | Copy into paragraph folder as `_paragraph-plan.md` during Phase 4a |

### 4. Content — `content/book-N/`, `content/legacy-target/`

Paragraph-specific builders. Each `.js` file builds a single asset (presentatie, voorkennis, vaardigheden, nieuws, inoefening, opgaven, samenvatting) for one paragraph. Naming:

- `content/book-1/b1-XYZ-<asset>.js` — Book 1 builder for paragraph 1.X.Y
- `content/legacy-target/<asset>-XYZ-<slug>.js` — legacy reference builders kept for older material

When starting a new paragraph, copy the closest existing builder from the corresponding `content/` subfolder, replace the content section, and run. New book work should prefer `content/book-N/`.

### 5. Archive — `archive/`

Legacy / one-off scripts kept for historical reference only. Not part of the active pipeline. See `archive/README.md` for the retention policy.

## How To Use This Folder

### Building the automated layer

```bash
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

This handles engine copy, shell generation (via `platform/`), landing pages, and validation.

### Building a complete paragraph

Follow [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md). Scripts are used in this order:

1. Create or update structured game data (CSV / JS data files)
2. Run platform generators (usually via `deploy.js`)
3. **Phase 2a**: Create `_paragraph-plan.md` from `templates/template-paragraph-plan.md`
4. **Phase 4a**: Build shared visual concepts and surface variants in `_assets/` using `lib/lib-svg-utils.js`
5. **Phase 4b**: Copy the closest `content/book-N/...` or legacy reference builder, adapt, run
6. Run converters (`lib/convert_*.py`) for HTML versions
7. Run `deploy.js`
8. Verify output

## Conventions

- Reusable scripts (`platform/`, `lib/`, `templates/`) should include a `HOW TO ADAPT` header.
- Content scripts (`content/`) should have paragraph-specific content in clearly marked sections.
- Shared libraries should be imported, not copied.
- If a script is archival or paragraph-specific, say that explicitly in the header comments.

## Scope Reminder

`deploy.js` does not build the full rich paragraph by itself. It does not create:

- presentaties
- uitleg voorkennis docx
- uitleg vaardigheden docx
- nieuws met visual
- samenvattingen
- begeleide inoefeningen
- opgavensets
- YouTube pages

Those still require paragraph-specific content work first, using the `content/` builders as reference.

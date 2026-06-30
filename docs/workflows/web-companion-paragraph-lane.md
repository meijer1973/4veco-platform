# Web Companion Paragraph Lane

Purpose: build only the Part B web companion route after textbook content
exists. This lane produces the student-facing route, games, rich HTML
companions, presentation route, web visual variants, and companion review.
The normal companion line is web output plus PPTX. PDF output belongs to
Part A / publisher-print unless a future human decision creates a separate PDF
lane.

Use `BUILD-PARAGRAPH.md` as the full reference, but use this runbook as the
assignment surface for ordinary companion production.

## Required Input

- Merged or current Part A paragraph.
- Part A review verdict `PASS` or `PASS WITH FLAGS`.
- Filled `X.Y.Z-textbook-handoff.md`.
- Paragraph markdown and answer model.
- Target exercise or route trace where applicable.
- Canonical procedures and terminology.

If a required Part A source is wrong, stop and open a Part A repair follow-up.
Do not silently repair textbook artifacts in this lane.

## Allowed Outputs

- `_paragraph-plan.md` or companion implementation plan.
- `index.html`
- `X.Y.Z [Name] <en dash> instapquiz.html`
- `X.Y.Z [Name] <en dash> nieuws-detective.html`
- `X.Y.Z [Name] <en dash> uitleg voorkennis.html`
- `X.Y.Z [Name] <en dash> presentatie.pptx`
- `X.Y.Z [Name] <en dash> presentatie.html`
- `X.Y.Z [Name] <en dash> uitleg vaardigheden.html`
- `X.Y.Z [Name] <en dash> nieuws met visual.html`
- `X.Y.Z [Name] <en dash> samenvatting.html`
- `X.Y.Z [Name] <en dash> youtube-videos.html`
- `X.Y.Z [Name] <en dash> stappenplan.html`
- `X.Y.Z [Name] <en dash> redeneer-spel.html`
- `X.Y.Z [Name] <en dash> wiskundevaardigheden.html`
- `X.Y.Z [Name] <en dash> begeleide inoefening.html`
- `shared/questions/X.Y.Z.js`
- `shared/reasoning/X.Y.Z.js`
- `shared/newsdetective/X.Y.Z.js`
- `shared/procedure/X.Y.Z.js`
- `shared/skilltree/X.Y.Z.js`
- `_assets/*_slide.*`
- `_assets/*_doc.*`
- `_assets/*_summary.*`
- `_assets/*_web_light.*`
- `_assets/*_web_dark.*`
- `X.Y.Z-companion-visual-review.md`
- `X.Y.Z-quality-ref.yaml` `companion:` block (see `docs/workflows/paragraph-quality-ref-schema-v2.md`)

## Forbidden Unless A Blocker Is Declared

- `X.Y.Z [Name] <en dash> paragraaf.md`
- `X.Y.Z [Name] <en dash> opgaven.md`
- `X.Y.Z [Name] <en dash> antwoorden.md`
- Core textbook figure assets: `_assets/*_fig_*`, `_assets/*_we_*`,
  `_assets/*_ex_*`
- `build_pdf.py`
- `X.Y.Z [Name] <en dash> *.pdf`
- `X.Y.Z-review.md`
- `X.Y.Z-quality-ref.yaml` `partA:` values

If companion work exposes a textbook defect, declare an explicit Part A repair
exception and invalidate companion review until the Part A repair is reviewed.

## Validation

Part B validation:

```bash
node scripts/validate-paragraph.js --mode part-b --profile student-web "<paragraph-folder>"
```

Integration verification after Part A and Part B are both present:

```bash
node scripts/validate-paragraph.js --mode complete --profile student-web "<paragraph-folder>"
```

Lane scope check for a companion PR:

```bash
node ../4veco-platform/build-scripts/workflows/check-paragraph-lane-scope.js --lane companion --base origin/main --head HEAD
```

From the platform repo, point the checker at the lesson-output repo explicitly:

```bash
node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane companion --base origin/main --head HEAD
```

## Closure Gate

The lane is closed only when:

- `X.Y.Z-companion-visual-review.md` has verdict `PASS` or `PASS WITH FLAGS`.
- `X.Y.Z-quality-ref.yaml` has a `companion:` block matching the review file.
- `companion.hard_fails_open` is `0` for `PASS` or `PASS WITH FLAGS`.
- Rendered student-facing outputs were inspected, not only source files.
- The lane-scope checker has no Part A leak.

`complete` validation is an integration/check state, not a normal companion
production assignment.

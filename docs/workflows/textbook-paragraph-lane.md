# Textbook Paragraph Lane

Also called: Part A. This is the same lane; do not treat "textbook" and
"Part A" as separate lanes. See `docs/workflows/paragraph-lane-vocabulary.md`.

Purpose: build only the Part A textbook paragraph. This lane produces theory,
worked examples, exercises, answers, core visuals, textbook HTML renders, and
textbook validation. Publisher-print PDFs also belong to this lane, but only
when explicitly requested.

Use `BUILD-PARAGRAPH.md` as the full reference, but use this runbook as the
assignment surface for ordinary textbook paragraph production.

## Allowed Outputs

- `X.Y.Z [Name] <en dash> paragraaf.md`
- `X.Y.Z [Name] <en dash> opgaven.md`
- `X.Y.Z [Name] <en dash> antwoorden.md`
- `X.Y.Z [Name] <en dash> paragraaf.html`
- `X.Y.Z [Name] <en dash> opgaven.html`
- `X.Y.Z [Name] <en dash> antwoorden.html`
- `_assets/X.Y.Z_fig_*.svg`
- `_assets/X.Y.Z_fig_*.png`
- `_assets/X.Y.Z_we_*.svg`
- `_assets/X.Y.Z_we_*.png`
- `_assets/X.Y.Z_ex_*.svg`
- `_assets/X.Y.Z_ex_*.png`
- `X.Y.Z-review.md`
- `X.Y.Z-quality-ref.yaml` `partA:` block (see `docs/workflows/paragraph-quality-ref-schema-v2.md`)
- `X.Y.Z-textbook-handoff.md`
- Publisher-print PDFs only when explicitly requested. PDF output is not owned
  by the Part B companion lane.

## Forbidden Outputs

Do not create, regenerate, or edit companion surfaces in this lane:

- `index.html`
- `X.Y.Z [Name] <en dash> instapquiz.html`
- `X.Y.Z [Name] <en dash> nieuws-detective.html`
- `X.Y.Z [Name] <en dash> uitleg voorkennis.html`
- `X.Y.Z [Name] <en dash> uitleg vaardigheden.html`
- `X.Y.Z [Name] <en dash> presentatie.html`
- `X.Y.Z [Name] <en dash> presentatie.pptx`
- `X.Y.Z [Name] <en dash> nieuws met visual.html`
- `X.Y.Z [Name] <en dash> samenvatting.html`
- `X.Y.Z [Name] <en dash> youtube-videos.html`
- `X.Y.Z [Name] <en dash> stappenplan.html`
- `X.Y.Z [Name] <en dash> redeneer-spel.html`
- `X.Y.Z [Name] <en dash> wiskundevaardigheden.html`
- `X.Y.Z [Name] <en dash> begeleide inoefening.html`
- `shared/questions/*.js`
- `shared/reasoning/*.js`
- `shared/newsdetective/*.js`
- `shared/procedure/*.js`
- `shared/skilltree/*.js`
- `X.Y.Z-companion-visual-review.md`

## Validation

Default textbook validation uses the historical `student-web` profile name, but
this remains Part A. In this mode the validator checks textbook source and
textbook HTML renders, not companion/student-web ownership:

```bash
node scripts/validate-paragraph.js --mode part-a --profile student-web "<paragraph-folder>"
```

Publisher or print handoff validation, only when PDFs are explicitly in scope:

```bash
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<paragraph-folder>"
```

Lane scope check for a textbook PR:

```bash
node ../4veco-platform/build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --base origin/main --head HEAD
```

From the platform repo, point the checker at the lesson-output repo explicitly:

```bash
node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD
```

## Closure Gate

The lane is closed only when:

- `X.Y.Z-review.md` is produced by an independent `econ-paragraph-review`.
- `X.Y.Z-quality-ref.yaml` has an updated `partA:` block.
- `X.Y.Z-textbook-handoff.md` is filled.
- No companion completion claim is made.
- The lane-scope checker has no companion leak.

`complete` validation is not a normal textbook assignment. It is an integration
verification state after Part B exists or a deliberately authorized complete
bundle has review evidence for both lanes.

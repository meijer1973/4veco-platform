# Legacy-Full Companion Profile

This is the archived Office/legacy companion contract for paragraph validation.
It is not the normal Part B companion/student-web lane.

Use this profile only when one of these is true:

- the requested product explicitly includes editable Word handouts;
- a regression check must validate older 27-file paragraph output;
- a reviewer asks for the legacy/full package as evidence.

For normal Part B work, use `--mode part-b --profile student-web` and build the
14 web/PPTX companion files listed in `BUILD-PARAGRAPH.md`. Do not build the
DOCX-only rows below for student-web work.

## Validator

```bash
node scripts/validate-paragraph.js --mode part-b --profile legacy-full "<paragraph-folder>"
node scripts/validate-paragraph.js --mode part-b --profile office "<paragraph-folder>"
```

`legacy-full` checks the old 27-file companion root. `office` checks the normal
student-web companion set plus Office exports when editable/downloadable teacher
files are deliberately in scope.

## Old 27-File Companion Root

Use `<en dash>` in filenames as the real filename separator.

| # | File | Section | Required | Builder | Source input | Output type |
|---|------|---------|----------|---------|--------------|-------------|
| 1 | `X.Y.Z [Naam] <en dash> instapquiz.html` | Voorbereiden | Yes | `generate-quiz-shells.js` | `shared/questions/X.Y.Z.js` | Generated |
| 2 | `X.Y.Z [Naam] <en dash> nieuws-detective.html` | Voorbereiden | Yes | `build-newsdetective-shells.js` | `shared/newsdetective/X.Y.Z.js` | Generated |
| 3 | `X.Y.Z [Naam] <en dash> uitleg voorkennis.docx` | Voorbereiden | Office/legacy only | `template-B_voorkennis.js` | Book content + domain knowledge | Optional Office export |
| 4 | `X.Y.Z [Naam] <en dash> uitleg voorkennis.html` | Voorbereiden | Yes | Native HTML preferred; converter allowed for Office/legacy | Book content + domain knowledge | Generated/converted |
| 5 | `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` | Voorbereiden | Office/legacy only | Copy only for Office package | Static file | Optional Office export |
| 6 | `X.Y.Z [Naam] <en dash> presentatie.pptx` | Leren | Yes | Presentation V2 semantic model or legacy Office script | Book content + semantic visuals/SVG graphs | Scripted-manual |
| 7 | `X.Y.Z [Naam] <en dash> presentatie.html` | Leren | Yes | Presentation V2 semantic model; legacy converter only for full package | Same semantic model or PPTX | Generated/converted |
| 8 | `X.Y.Z [Naam] <en dash> uitleg vaardigheden.docx` | Leren | Office/legacy only | `template-A_vaardigheden.js` | Book content + domain knowledge | Optional Office export |
| 9 | `X.Y.Z [Naam] <en dash> uitleg vaardigheden.html` | Leren | Yes | Native HTML preferred; converter allowed for Office/legacy | Book content + domain knowledge | Generated/converted |
| 10 | `X.Y.Z [Naam] <en dash> nieuws met visual.docx` | Leren | Office/legacy only | News builder script | Recent Dutch news + SVG visual | Optional Office export |
| 11 | `X.Y.Z [Naam] <en dash> nieuws met visual.html` | Leren | Yes | Native HTML preferred; converter allowed for Office/legacy | Recent Dutch news + SVG visual | Generated/converted |
| 12 | `X.Y.Z [Naam] <en dash> samenvatting.docx` | Leren | Office/legacy only | Summary builder script | Key concepts from paragraph | Optional Office export |
| 13 | `X.Y.Z [Naam] <en dash> samenvatting.html` | Leren | Yes | Native HTML preferred; converter allowed for Office/legacy | Key concepts from paragraph | Generated/converted |
| 14 | `X.Y.Z [Naam] <en dash> youtube-videos.html` | Leren | Yes | Paragraph-specific generator or manual HTML | 3 real YouTube video IDs | Scripted-manual |
| 15 | `X.Y.Z [Naam] <en dash> stappenplan.html` | Leren | Yes | `build-procedure-shells.js` | `shared/procedure/X.Y.Z.js` | Generated |
| 16 | `X.Y.Z [Naam] <en dash> redeneer-spel.html` | Oefenen | Yes | `build-reasoning-engine.js` | `shared/reasoning/X.Y.Z.js` | Generated |
| 17 | `X.Y.Z [Naam] <en dash> wiskundevaardigheden.html` | Oefenen | Yes | `build-skilltree-shells.js` | Book manifest `skilltree` field | Generated |
| 18 | `X.Y.Z [Naam] <en dash> begeleide inoefening <en dash> vragen.docx` | Oefenen/begeleide inoefening | Office/legacy only | Guided-practice builder script | Exercises with scaffolding | Optional Office export |
| 19 | `X.Y.Z [Naam] <en dash> begeleide inoefening <en dash> antwoorden.docx` | Oefenen/begeleide inoefening | Office/legacy only | Same script as #18 | Same | Optional Office export |
| 20 | `X.Y.Z [Naam] <en dash> begeleide inoefening.html` | Oefenen/begeleide inoefening | Yes | Native HTML preferred; converter allowed for Office/legacy | Textbook opgaven + answer model | Generated/converted |
| 21 | `X.Y.Z [Naam] <en dash> basis <en dash> vragen.docx` | Oefenen/basisopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 22 | `X.Y.Z [Naam] <en dash> basis <en dash> antwoorden.docx` | Oefenen/basisopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 23 | `X.Y.Z [Naam] <en dash> midden <en dash> vragen.docx` | Oefenen/middenopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 24 | `X.Y.Z [Naam] <en dash> midden <en dash> antwoorden.docx` | Oefenen/middenopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 25 | `X.Y.Z [Naam] <en dash> verrijking <en dash> vragen.docx` | Oefenen/verrijkingsopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 26 | `X.Y.Z [Naam] <en dash> verrijking <en dash> antwoorden.docx` | Oefenen/verrijkingsopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 27 | `index.html` | Root | Yes | `build-landing-page.js` | Scans folder contents | Generated |

## Boundary

This profile does not create a third lane. It is an export/validation profile
inside the Part B companion lane. Part A textbook source, textbook HTML renders,
`build_pdf.py`, paragraph PDFs, Part A review, and `partA:` quality-ref values
remain owned by the Part A textbook lane.

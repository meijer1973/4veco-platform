# GOLDEN-PRESENTATION-111-IMPLEMENTED-WEB-1 Validation Log

Date: 2026-06-21
Status: ready for draft PR review

## Scope

Implemented the accepted eleven-slide §1.1.1 Golden web presentation as the active `presentatie.html` route.

Authoring source:

- `build-scripts/content/book-1/b1-111-presentation-v2-model.js`
- `build-scripts/content/book-1/b1-111-presentation-v2.js`
- `build-scripts/lib/render-presentation-v2-html.js`
- `engines/presentation-v2.css`
- `engines/presentation-v2.js`

Generated lesson output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – presentatie.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/presentation-v2.css`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/presentation-v2.js`

## Static Checks

- `npm.cmd run check:golden-presentation-111`
  - Passes.
  - Now checks the frozen exemplar package and the implemented source deck.
- `npx.cmd jest --runInBand engines/tests/presentation-v2-111-production.test.js engines/tests/presentatie-html-shape.test.js engines/tests/l1-5d-v2-mobile-fixes.test.js scripts/tests/build-landing-page.test.js --no-coverage`
  - Passes: 4 suites, 28 tests.
- `npm.cmd test -- --runInBand --no-coverage`
  - Passes after `npm.cmd ci`: 57 suites passed, 6 skipped, 813 tests passed.
  - Console output includes existing validation-fixture warnings; Jest exit code is 0.
- `git diff --check`
  - Passes in `4veco-platform`.
  - Passes in `4veco-lessen`.

## Rendered Browser QA

Command:

```powershell
node scripts/qa-presentation-v2-html.js "C:\wt\PARA-LANDING-20260610\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken\1.1.1 Schaarste en economisch denken – presentatie.html" "C:\wt\PARA-LANDING-20260610\reports\golden-presentation-111-implemented-web-1\presentation-v2-qa"
```

Result:

- Passes.
- Captured 66 screenshots: 11 slides across desktop, wide-notes, fullscreen, dark, dark-notes, and mobile.
- Screenshot directory: `C:\wt\PARA-LANDING-20260610\reports\golden-presentation-111-implemented-web-1\presentation-v2-qa`
- Checks include visible overflow, mobile horizontal overflow, 16:9 canvas ratio for non-mobile states, notes side rail placement, notes toggle, Home/End keyboard navigation, focus movement to active slide heading, and active nav `aria-current`.

## Paragraph Validation

Command:

```powershell
node scripts/validate-paragraph.js --mode complete --profile student-web "C:\wt\PARA-LANDING-20260610\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
```

Result:

- Passes all checks.
- `presentatie.html` is present as the active route.
- Student-web profile remains complete: 14/14 required Part B files present.

## Local Output Checks

The generated presentation HTML contains:

- `data-layout="presentation-v2"`
- `data-deck-version="presentation-v2"`
- `data-exemplar-id="1.1.1-golden-presentation"`
- source snapshot SHA `0070525A9F0C57C2BC9211C6D19CAEA6F84A3EEFE0810999C5AB0AA167477FF0`
- 11 `data-pv2-slide` articles
- `Studentgerichte uitleg` notes for every slide

The generated presentation HTML does not contain:

- `presentatie-v2-prototype`
- `prototype v2`
- `Speaker notes`
- `data-layout="presentatie-v1"`

The regenerated paragraph landing page uses:

- primary tile title `Lespresentatie`
- primary link to `presentatie.html`
- secondary `PowerPoint` download link only when the legacy PPTX exists

## Known Non-Goals

- No new PowerPoint derivative was generated in this implementation pass.
- The existing legacy `presentatie.pptx` remains available as a secondary download until a separate PPTX derivative consumes the same semantic model and passes its own QA.

# CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1 Result

Status: implementation complete, awaiting human review.

## Summary

Implemented Chapter Landing V2 Minimal Navigation in the platform generator,
imported the approved prototype fixture, added guardrails, regenerated Book 1
chapter 1.1 output, and captured rendered proof.

The chapter page now functions as navigation/orientation only. Learning rows,
games, checks, exit tickets, textbook links, and companion resources remain on
paragraph landing pages.

Reviewer revision:

- cleaned the canonical chapter fixture so paragraph cards use neutral
  `Paragraaf N` / `Lesroute` labels and no visible `Rekenen` badge;
- removed the unused legacy chapter renderer from the generator source;
- added source/fixture guards for the legacy renderer and rejected badge
  template;
- corrected generated `orientatie` to `oriëntatie`.

## Changed Files

Platform:

- `build-scripts/platform/build-landing-page.js`
- `build-scripts/platform/check-chapter-landing-v2.js`
- `scripts/tests/build-landing-page.test.js`
- `references/ui/chapter-landing-v2/approved-minimal.html`
- `references/ui/chapter-landing-v2/README.md`
- `build-scripts/README.md`
- `package.json`
- sprint proof/report files under `reports/sprints/`

Lesson:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/index.html`

## Validation

Passed:

- `node --check build-scripts/platform/build-landing-page.js`
- `node --check build-scripts/platform/check-chapter-landing-v2.js`
- `cmd /c npx jest --runInBand scripts/tests/build-landing-page.test.js`
- `cmd /c npm run check:landing-v2`
- `cmd /c npm run check:chapter-landing-v2`
- `cmd /c npm run check:platform`
- `MODULE_ROOT=<Book 1 target> node build-scripts/platform/build-landing-page.js`
- `MODULE_ROOT=<Book 1 target> node scripts/check-links.js`
- `git diff --check` in platform and lesson repos

Notes:

- Direct `npx` / `npm` through PowerShell was blocked by local execution
  policy, so validation used `cmd /c npx` and `cmd /c npm`.
- `check:platform` passed with 54 suites passed, 6 skipped, and 807 tests
  passed.
- Link checking passed for 108 HTML files and 591 local references.

## Proof

- Screenshot manifest:
  `reports/sprints/CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1-screenshot-manifest.md`
- DOM proof:
  `reports/sprints/CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1-screenshots/dom-proof.json`

DOM proof confirms:

- four paragraph cards render;
- all paragraph card links target paragraph `index.html`;
- route tags contain zero links;
- old shell markers are absent;
- `.para-card-domain` is absent.

Revision proof confirms:

- fixture `.para-card-domain` count is `0`;
- fixture visible `>Rekenen</span>` badge count is `0`;
- fixture `Lesroute` label count is `4`;
- generated output uses `body[data-layout="chapter-landing-v2"]`;
- generated output `.para-card-domain` count is `0`;
- generated output contains `navigatie en oriëntatie` and not the old
  `navigatie en orientatie`.

## Authority Boundary

This result does not close the check-surface gate and does not authorize
Scale Gate 1, product-route adoption, diagnostics, mastery, PV, or
student/product-use claims. Human review is still required.

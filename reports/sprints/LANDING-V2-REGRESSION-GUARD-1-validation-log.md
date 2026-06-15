# LANDING-V2-REGRESSION-GUARD-1 Validation Log

Date: 2026-06-15
Owner: codex
Status: complete locally
Branch: `codex/landing-v2-regression-guard-1-20260615`

## Scope

Implemented a regression guardrail sprint for Paragraph Landing V2. This did
not redesign or roll back the landing page. It adds mechanical protection
against reintroducing the old Frankenstein shell.

This sprint does not open Scale Gate 1, product-route adoption,
diagnostics/mastery/PV, or student/product-use work.

## Product End State And Source Spec

Product end-state: every paragraph exposes one visible student route from
current readiness to local target-equivalent proof. Visible route items need a
student-facing label, purpose/status/focus, and either a real action or an
explicit fallback.

Source spec: approved Paragraph Landing V2 fixtures in
`references/ui/paragraph-landing-v2/` and the lesson-side
`specifications/paragraph-landing-layout-v2.md`. Platform PR #45 and lesson PR
#11 are superseded Frankenstein attempts and are forbidden as rollback or
implementation baselines.

## Core Requirements

- Added `build-scripts/platform/check-paragraph-landing-v2.js`.
- Added `npm run check:landing-v2`.
- Wired `check:landing-v2` into platform CI after Jest.
- Checker verifies platform generator invariants.
- Checker renders and verifies a synthetic paragraph landing output.
- Checker scans Book 1 generated paragraph indexes in `../4veco-lessen`.
- Updated generator comments to clarify Paragraph Landing V2 is fixture-owned.
- Added rollback policy under `references/ui/paragraph-landing-v2/ROLLBACK.md`.
- Added explicit #45/#11 superseded-baseline warnings in platform fixture docs
  and the lesson-side V2 spec.

## Findings Classification

- `blocks`: Landing-related future changes must not restore old shell markers,
  fake links, or old `voorkennis.css` landing assumptions.
- `does_not_block`: Current approved landing output remains unchanged as a
  visual baseline; ordinary scoped work can continue if it passes the guard.
- `proof_required_to_close`: CI must run `npm run check:landing-v2`; local
  proof must include real Book 1 output scan and link validation.

## Validation

- `node --check build-scripts/platform/check-paragraph-landing-v2.js`
- `node --check build-scripts/platform/build-landing-page.js`
- `npm.cmd run check:landing-v2`
- `npm.cmd run check:scope-language`
- `npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js`
- `MODULE_ROOT=<Book 1 target>; node scripts/check-links.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/reports/validate-report-json.js`
- `git diff --cached --check`
- Static Book 1 scan for 1.1.1 through 1.1.4:
  - each page has 6 rows and 16 tile IDs;
  - disabled placeholders have no `href`;
  - forbidden legacy markers are absent.
- `npm.cmd run check:platform`

## Results

- Landing V2 guard passed.
- Scope-language check passed.
- Focused landing Jest suite passed: 4 tests.
- Link check passed: 108 HTML files and 589 references.
- URL index check passed.
- Report JSON contract check passed.
- Staged diff check passed.
- Static Book 1 output scan passed for 1.1.1 through 1.1.4.
- Full platform check passed: 54 suites passed, 6 skipped; 804 tests passed, 8
  skipped.

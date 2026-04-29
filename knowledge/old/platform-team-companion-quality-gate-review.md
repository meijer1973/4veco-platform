# Platform Team Review: Companion Quality Gate Gaps

Generated: 2026-04-24
Owner: Platform team
Status: open platform work
Scope: first Book 1 companion pilot, `1.1.1 Schaarste en economisch denken`

## Purpose

Record the review of the first companion pilot as platform-team work.

The pilot passes the current technical gates, but the review found that those
gates are not yet strong enough to certify companion quality. The next fixes
belong in platform validators, data tests, build/report workflow, and repeatable
health checks rather than in one-off lesson edits.

## Commands Re-run

Paragraph hard gate:

```powershell
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
```

Result:

- passed
- Part A files present
- 24/24 Part B companion files present
- 6 SVG/PNG asset pairs present
- required shared game data present
- quiz has 15 questions across 4 categories
- procedure data has 1 procedure

Book health:

```powershell
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

Result:

- passed
- 26/26 checks passed
- important nuance: `check:book` defaults to Part A paragraph validation, so it
  keeps Book 1 textbook health green but does not prove all companion outputs
  across the book.

Validator tests:

```powershell
npx.cmd jest --runInBand scripts/tests/validate-paragraph.test.js
```

Result:

- passed
- 6/6 tests passed

Full target-aware Jest suite:

```powershell
$env:MODULE_ROOT = '..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
npx.cmd jest --runInBand
```

Result:

- passed
- 14 test suites passed
- 407 tests passed
- 1 fixture/test skipped

Data tests:

```powershell
$env:MODULE_ROOT = '..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
npx.cmd jest --runInBand --testPathPatterns "engines/tests/.*-data\.test\.js"
```

Result:

- passed
- 5 suites passed
- 97 tests passed

Engine tests:

```powershell
npx.cmd jest --runInBand --testPathPatterns "engines/tests/.*-engine\.test\.js"
```

Result:

- passed
- 5 suites passed
- 226 tests passed

Link/reachability check:

```powershell
$env:MODULE_ROOT = '..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
node scripts\check-links.js
```

Result:

- passed
- 72 HTML files scanned
- 110 local references checked
- all local references valid
- all interactive files reachable from navigation

Manual browser smoke test:

- Ran headless Chrome against the five interactive pages for `1.1.1`.
- Verified script-rendered content appeared for:
  - instapquiz
  - nieuws-detective
  - stappenplan
  - redeneer-spel
  - wiskundevaardigheden

Result:

- passed
- this is useful evidence, but it is currently manual/ad hoc rather than part of
  the platform gate.

## Answer 1: Were The Tests Done Properly?

Yes, for the current documented technical gate.

The pilot was checked with complete-mode paragraph validation, book health,
validator unit tests, target-aware data tests, engine tests, link/reachability
checks, and a browser smoke pass. That is enough to say that `1.1.1` is
structurally present and runnable.

However, relying only on `validate-paragraph.js --mode complete` would be too
narrow. It proves file presence, basic document validity, some data structure,
and limited asset integrity. It does not prove current-source validity,
didactic mapping, freshness of quality references, or rendered browser behavior.

## Answer 2: Are The Tests Good Enough?

Not yet.

The tests are good enough for "the pilot is technically assembled and runs." They
are not yet good enough for "the companion pack is high quality and safe to scale."

## Platform-Owned Gaps Found

### 1. News source URLs are not truly validated

Current behavior:

- `shared/newsdetective/1.1.1.js` has `sourceUrl:
  "https://nos.nl/artikel/woningtekort-nederland"`.
- That URL returns 404.
- `build-scripts/content/book-1/b1-111-nieuws.js` uses
  `https://nos.nl/collectie/13871-wonen-crisis`.
- That NOS URL redirects to an unrelated climate collection.
- `engines/tests/newsdetective-data.test.js` only checks that `sourceUrl`
  starts with `http://` or `https://`.

Why this matters:

- The test suite says the news source is valid, but the source is not actually
  verifiable.
- This is a source/claim quality problem that the platform can catch.

Platform action:

- Add a source validation check for news data/builders.
- At minimum, verify reachable status after redirects and detect obvious
  redirects to unrelated titles.
- Prefer storing a checked source title/date next to the URL so the validator
  can flag source drift.

### 2. Complete-mode quality refs can be stale

Current behavior:

- `1.1.1-quality-ref.yaml` was generated on 2026-04-14.
- It inventories 5 Part A assets.
- The companion build now has 6 SVG/PNG pairs, including
  `1.1.1_news_woningtekort`.
- Complete-mode validation still accepts the older quality ref.

Why this matters:

- The quality reference can look green while missing companion-specific evidence.
- Complete companion builds need a complete-mode quality reference, not only a
  Part A reference.

Platform action:

- Extend `quality_ref` generation/validation with a mode or schema version:
  `part-a`, `part-b`, `complete`.
- In complete mode, require companion assets, Part B files, shared game data,
  and relevant source checks to be represented.
- Fail or warn when the quality ref predates newer companion artifacts.

### 3. Review flags are not surfaced as scale blockers

Current behavior:

- `1.1.1-review.md` has no unresolved FAIL items.
- It still contains FLAG items:
  - figure numbering inconsistency between `paragraaf.md` and `opgaven.md`
  - opgave 4 missing context
  - minor wording/style notes
- The validator only fails on unresolved `FAIL`, not on unresolved `FLAG`.

Why this matters:

- That is reasonable for Part A unblock, but companion scaling needs a way to
  distinguish "minor accepted risk" from "known quality debt that should be
  resolved before replication."

Platform action:

- Add a review-summary parser/report that counts PASS/FLAG/FAIL.
- Do not necessarily fail all flags, but surface them in the platform dashboard
  or sprint report.
- Require explicit disposition for flags before marking a companion sprint done.

### 4. Plan-to-output alignment is not enforced

Current behavior:

- `_paragraph-plan.md` contains visual assignment expectations.
- Validators check that the plan exists and has key section headings.
- Validators do not prove that each planned visual is embedded in each intended
  output.

Observed nuance:

- Office files do contain embedded media.
- Converted HTML contains some visual references.
- But the current gate does not know whether this matches the plan.

Why this matters:

- Dual coding and unified student experience are core platform principles.
- They are currently mostly reviewer-enforced, not validator-enforced.

Platform action:

- Add a plan-to-output checker for:
  - required visual assets
  - builder assignment table
  - converted HTML image references
  - Office media presence/counts
- Start with warnings, then promote stable checks to complete-mode validation.

### 5. Browser smoke checks are not part of the repeatable gate

Current behavior:

- Headless Chrome smoke testing was run manually during this review.
- It caught actual script-rendered behavior rather than shell existence.
- This is not part of `check:book`, `validate-paragraph`, or Jest.

Why this matters:

- Interactive pages can have valid files and valid data but still fail to render.
- The five game pages are a major part of Part B quality.

Platform action:

- Add a lightweight browser smoke script for a target paragraph.
- It should verify that the generated app surfaces render dynamic content for:
  - quiz
  - newsdetective
  - procedure/stappenplan
  - reasoning
  - skilltree
- Keep it optional at first if CI/browser availability is uncertain, but document
  it as part of companion pilot sign-off.

### 6. Game-data tests are structural, not content-quality checks

Current behavior:

- Data tests validate structure and engine startability.
- Some checks are intentionally loose.
- Example: quiz data tests only require that not all categories miss
  difficulty-3 questions, while `validate-paragraph.js` is stricter and fails
  any category without difficulty-3.

Why this matters:

- The strictest expectation is split across tools.
- Content quality constraints can silently diverge between Jest and the paragraph
  validator.

Platform action:

- Align data-test expectations with complete-mode validator expectations.
- Keep structural tests and companion-quality tests clearly separated, but avoid
  contradictory thresholds.

## Recommended Platform Backlog

Priority order:

1. Add real URL/source validation for news companion data and news builders.
2. Add complete-mode freshness/coverage checks for `quality_ref`.
3. Add repeatable headless browser smoke testing for one paragraph.
4. Add a plan-to-output visual mapping checker.
5. Add review flag inventory to the internal platform dashboard/reporting track.
6. Align data-test thresholds with validator thresholds where the same rule is
   being enforced.

## Sprint Placement

This belongs under active platform companion work:

- Sprint P1.2: Companion Scaling And Handoff Sprint
- Sprint P1.3: Internal Review Dashboard Sprint, for visibility/reporting
- Sprint P1.5: CI And Health Check Routine Sprint, for repeatable execution

This should not be pushed to the lessen team as manual patchwork. The lessen team
can fix individual content errors when assigned, but the missing checks are
platform guardrail work.

## Current Verdict

`1.1.1` passes the current technical companion gate.

Do not treat that as proof that the quality gate is sufficient. Before bulk
companion production, the platform team should strengthen the gate so "green"
also means:

- sources are actually verifiable
- quality references match the build mode and current artifacts
- planned dual-coding visuals are present where required
- interactive pages render in a browser
- known review flags are visible and dispositioned


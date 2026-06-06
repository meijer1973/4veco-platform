# CHECK-ROUTE-COPY-1 Result

Generated: 2026-06-05

## Status

Complete after validation and map refresh.

## Outcome

The first-three paragraph landing pages now make the Check route choice
clearer:

- `Korte check` is marked as `advies`;
- `Korte check` copy says it gives local oefenadvies and is not the eindcheck;
- `Exit ticket` is marked as `eindcheck`;
- `Exit ticket` copy says it uses the same kind of denkstappen as the
  eindopgave;
- action text distinguishes `Krijg oefenadvies` from `Maak eindcheck`;
- generated cards include deterministic `data-check-route` and
  `data-check-purpose` attributes;
- old generic card copy is removed;
- desktop, mobile, and dark-mode screenshot proof is recorded.

The sprint does not authorize product-route adoption, new completion language,
diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Validation

Passed:

```text
node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts\sprints\capture-check-route-copy1-screenshots.js
node build-scripts\sprints\check-check-route-copy1.js
node build-scripts\sprints\check-check-short-exit2.js
node build-scripts\sprints\check-graph-check-ux1.js
node build-scripts\sprints\check-graph-exit-ux1.js
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
npm.cmd run check:scope-language
npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js
npm.cmd run check:platform
npm.cmd run agent:index
node build-scripts\sprints\emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
node build-scripts\sprints\check-check-route-copy1.js
node build-scripts\sprints\check-check-short-exit2.js
```

`npm.cmd run check:platform` exits 0 after the stale landing-page fixture test
was updated. It still prints existing fixture warnings for deliberately bad
sample chapter/asset cases.

## Files Added Or Updated

- `build-scripts/platform/build-landing-page.js`
- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/check-check-route-copy1.js`
- `build-scripts/sprints/capture-check-route-copy1-screenshots.js`
- `scripts/tests/build-landing-page.test.js`
- `reports/json/check-route-copy1-proof.json`
- `reports/sprints/CHECK-ROUTE-COPY-1-*`
- generated Book 1 first-three paragraph landing pages
- `references/reference-team-roadmap.md`
- refreshed GitHub-facing maps, URL index, and internal dashboard

## Required Next Action

Proceed to `VISUAL-QA-HARDEN-2` after full validation and remote publication.
Do not start the retry human gate until `VISUAL-QA-HARDEN-2` and
`CHECK-SURFACE-PREGATE-1` are complete.

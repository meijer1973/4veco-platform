# CHECK-ROUTE-COPY-1 Command Log

Generated: 2026-06-05

## Commands

```text
Get-Content ..\CLAUDE.md -TotalCount 220
Get-Content CLAUDE.md -TotalCount 220
Get-Content ..\4veco-lessen\specifications\product-end-state.md -TotalCount 260
git status --short --branch
rg -n "CHECK-ROUTE-COPY-1|GRAPH-EXIT-UX-1|VISUAL-QA-HARDEN-2|CHECK-SURFACE-PREGATE-1|GATE-CHECK-SHORT-EXIT-2|route copy|route-card|route card|Verdieping|Zelfstandige" references/reference-team-roadmap.md reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/direct-review-comments.md reports/sprints/CHECKSURFACE-RESET-1-product-quality-audit.md reports/sprints/GRAPH-EXIT-UX-1-result.md engines source-data -S
Get-Content reports\review-gates\GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review\direct-review-comments.md
Get-Content reports\sprints\CHECKSURFACE-RESET-1-product-quality-audit.md
Get-Content reports\sprints\GRAPH-EXIT-UX-1-result.md
Get-Content references\reference-team-roadmap.md -TotalCount 2730
rg -n "Korte check|Exit ticket|targetEquivalent|short check|route|advies|bewijs|afronden|completion|route-card|et-route|check.*landing|landing" source-data engines build-scripts
Get-Content build-scripts\platform\build-landing-page.js -TotalCount 360
Select-String first-three generated landing pages for current Check card copy
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
npm.cmd run check:platform
npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js
git fetch --prune origin
git rev-list --left-right --count 'HEAD...@{upstream}'
npm.cmd run agent:index
node build-scripts\sprints\emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
node build-scripts\sprints\check-check-route-copy1.js
node build-scripts\sprints\check-check-short-exit2.js
```

## Notes

- Initial inspection found generic Check-card copy on all first-three
  paragraph landing pages.
- The repair point is `build-scripts/platform/build-landing-page.js`.
- Deployment regenerated the Book 1 landing pages and passed its link/data
  checks.
- The first screenshot capture attempt exposed a temporary Chrome profile
  cleanup issue; the capture script now uses unique temp profiles with retry
  cleanup.
- Screenshot proof and the route-copy checker passed after the route labels
  and copy assertions were normalized to match rendered text.
- The broader `CHECK-SHORT-EXIT-2`, `GRAPH-CHECK-UX-1`, and `GRAPH-EXIT-UX-1`
  scoped checkers still pass after the route-copy repair.
- The first full `check:platform` run exposed stale fixture expectations for
  the old generic Check copy. The landing-page test was updated to assert the
  new route-specific copy and data attributes, then the targeted test and full
  platform suite passed.
- `git fetch --prune origin` completed for platform and lesson repositories;
  both were `0 0` ahead/behind before commit preparation.
- Repository maps, URL index, and internal dashboard were refreshed after
  validation, then the report JSON, roadmap index, route-copy checker, and
  broad Check-surface checker passed again.

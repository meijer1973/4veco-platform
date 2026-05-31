# Sprint SKILLMAP-OP-1: Student-Visible Skill-Map Route

Date: 2026-05-31

Status: planned from active roadmap row after ENGINE-OP-1.

## Goal

Make the shared skill-map route visible, scoped, and useful for students in the
Book 1 `1.1.1`, `1.1.2`, and `1.1.3` practice routes. The route panel must
show the current paragraph target, the relevant skill subset for the current
practice mode, the recommended next skill, local practice progress, and a
practice link without exposing internal MTU codes.

This sprint fixes the route-display layer only. It may change platform route
runtime/generator code, the Book 1 deploy manifest route-scope configuration,
and generated automated Book 1 output through platform deploy/build commands.
It must not hand-patch generated HTML, claim target-equivalent proof, create
exit tickets for `1.1.2` or `1.1.3`, write target-exercise fields, create or
write answer-skill candidate storage, mutate protected references, authorize
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

ENGINE-OP-1 found that the current route layer is the integration bottleneck.
The generated pages open, but shared route panels are not consistently useful:
`1.1.2` reasoning and graph route panels are empty, `1.1.1` reasoning is
mis-scoped toward unrelated calculation/graph skills, and the math page is not
visibly unified with the shared route panel.

The current route renderer reads `SKILL_TREE_ELEMENTS.SKILLS`, which contains
only interactive A-domain skill-tree nodes. That works for math and graph
practice, but it cannot show B-domain conceptual route skills such as
`Schaarste als kerneconomisch probleem` and `Alternatieve kosten in een
keuze-situatie`. This sprint should add a route-display catalog without
turning those conceptual MTUs into runnable skill-tree exercises.

## Quality Standard

The quality floor is live rendered output in which a student can see a coherent
route for the relevant practice mode, judged against the product
specification. Passing unit tests or generating files is not enough. Rendered
output must prove that the route panel is populated, student-facing, scoped to
the paragraph and practice mode, visibly bounded as local practice progress,
and free of internal MTU IDs and prohibited product claims. Any route that is
still not target-equivalent proof must say so through scope boundaries or
follow-up work. The later review gate for broad engine quality remains
`GATE-ENGINE-1`; target-equivalent exit-ticket completion language remains
blocked behind `GATE-L1.7B-Q2`.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared skill-map route shows relevant skill subset per practice mode | Platform route engine/UI consumes explicit per-surface route scopes for reasoning, calculation, graph/table, and checkpoint contexts | Unit tests plus rendered screenshots for `1.1.1`, `1.1.2`, and `1.1.3` showing populated route panels | planned |
| B-domain conceptual skills can appear in route display without becoming runnable skill-tree exercises | Route-display catalog includes non-deprecated MTUs while `SKILL_TREE_ELEMENTS.SKILLS` remains the interactive A-domain skill-tree set | Tests prove B-route labels render and skill-tree exercise set remains A-domain/generator-gated | planned |
| Math page is visibly unified with shared route language | `wiskundevaardigheden.html` shell loads shared route CSS/UI and renders the calculation route panel | Screenshot proof for `1.1.2` math route on desktop and mobile | planned |
| Route panel shows paragraph target, recommended next skill, local progress, and practice link | Route view model and renderer expose paragraph target and route action fields from deploy manifest route configuration | Screenshot/text extraction proves these labels are visible and student-facing | planned |
| Product boundaries remain intact | Boundary copy and flags remain false; route copy avoids mastery, diagnostic, sequencing, grade, summative, AI, PV, or target-equivalent proof claims | Unit/search checks plus rendered-output review and scope-language checks | planned |
| Generated output changes are reproducible | Book 1 generated automated pages change only by platform deploy/build commands after platform/source configuration edits | Git diff and validation prove no hand-patched generated HTML and no protected reference or target-exercise mapping mutation | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add `ROUTE_SKILLS` route-display catalog alongside A-domain `SKILLS` | `include_now` | It fixes the `1.1.1` conceptual route without changing runnable skill-tree exercises. |
| Add per-surface `skillMapRoutes` configuration to the Book 1 deploy manifest | `include_now` | It is the smallest stable way to prevent empty/mis-scoped route panels per paragraph and mode. |
| Render the shared route panel inside the math skill-tree page | `include_now` | ENGINE-OP-1 explicitly flagged math as operational but not visibly unified with shared route language. |
| Add a focused SKILLMAP-OP-1 generated-output checker | `include_now` | The sprint needs deterministic proof that route panels are no longer empty or internally coded after deploy. |
| Rebuild graph/math/reasoning tasks around the GAME-UX-3A task shell | `defer_named_follow_up` | This belongs to GRAPH-UX-2, MATH-UX-2, and REASON-UX-2 after route visibility is reliable. |
| Create target-equivalent exit tickets for `1.1.2` or `1.1.3` | `defer_named_follow_up` | This belongs to L1.7B-Q2 and GATE-L1.7B-Q2 after route and task-shell integration. |
| Treat route progress as mastery or automatic next-paragraph sequencing | `reject_scope_creep` | The specs forbid mastery, diagnostic, sequencing, and summative claims without later explicit gates. |

## Allowed paths

- `engines/skill-map-engine.js`
- `engines/skill-map-route-ui.js`
- `engines/skill-map-route.css`
- `engines/skilltree/base-elements.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `build-scripts/platform/build-skilltree-shells.js`
- focused route validator/test files under `engines/tests/` and
  `build-scripts/sprints/`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`
  as target deploy manifest/source configuration
- generated automated Book 1 output produced by platform deploy/build commands
  only
- `reports/sprints/SKILLMAP-OP-1-*`
- `references/data/sprints/SKILLMAP-OP-1.plan.json`
- `references/data/sprints/SKILLMAP-OP-1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.21-*`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SKILLMAP-OP-1/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories required for remote reviewer navigation

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files; generated output
  may only change through platform deploy/build commands
- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- lesson content rewrites outside generated automated route output
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/ENGINE-OP-1-operational-audit.md`
- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `engines/skill-map-engine.js`
- `engines/skill-map-route-ui.js`
- `engines/skilltree/base-elements.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`

## Outputs

- `reports/sprints/SKILLMAP-OP-1-plan.md`
- `reports/sprints/SKILLMAP-OP-1-baseline.md`
- `reports/sprints/SKILLMAP-OP-1-planning-review.md`
- implementation changes to shared route runtime/generator surfaces
- focused tests and generated-output route checker
- regenerated controlled Book 1 automated output for route proof
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `reports/sprints/SKILLMAP-OP-1-diff-summary.md`
- `references/data/sprints/SKILLMAP-OP-1.plan.json`
- `references/data/sprints/SKILLMAP-OP-1.result.json`
- screenshot files under `reports/sprints/SKILLMAP-OP-1-screenshots/`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/SKILLMAP-OP-1/`
- updated platform and lesson roadmaps that mark SKILLMAP-OP-1 complete and
  set `GRAPH-UX-2` as the next operational action, unless validation proves a
  route-blocking architecture issue

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, ENGINE-OP-1 findings, current
   route runtime shape, Book 1 deploy manifest route data, generated page
   inventory, protected reference boundary, and lesson-output generation
   boundary. Stop if the route cannot be improved without protected mutation or
   generated-output hand patches.
2. Add the route-display catalog and per-surface route configuration plumbing.
   Keep runnable skill-tree exercises limited to interactive A-domain skills;
   route display may include conceptual MTUs when the deploy manifest asks for
   them.
3. Add explicit `skillMapRoutes` for Book 1 `1.1.1`, `1.1.2`, and `1.1.3`.
   Stop if a route would need target-exercise `question_type`/`answer_form`
   fields, answer-skill candidate storage, or a target-equivalent checkpoint
   claim.
4. Render the shared route panel in reasoning, graph/table, procedure support,
   and math/calculation surfaces using the same route view model. Keep task
   shell integration deferred to GRAPH-UX-2, MATH-UX-2, and REASON-UX-2.
5. Add unit tests and a generated-output checker that fail if route panels are
   empty, expose internal IDs, or contain prohibited product claims.
6. Regenerate Book 1 automated output through platform deploy/build commands.
   Do not edit generated lesson output by hand.
7. Inspect rendered output on desktop and mobile. Capture screenshots and write
   a student-route proof report showing visible target, focus, progress, and
   practice action for the audited surfaces.
8. Update result records, roadmap rows, and lesson archive. If route output is
   still empty/mis-scoped after implementation, stop and route a GAME-ARCH-1
   or roadmap-pause decision instead of closing.
9. Refresh maps/indexes, run validators, and stop if sprint-bundle,
   generated-output, screenshot, scope-language, protected-surface,
   product-claim, or diff checks fail.
10. Fetch, reconcile, commit, and push both repositories. If either repository
   is behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SKILLMAP-OP-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1
npx jest --testPathPatterns "engines/tests/(skill-map-engine|skill-map-route-ui|skilltree-engine)\\.test\\.js"
node build-scripts/sprints/check-skillmap-op1-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "SKILLMAP-OP-1|student-visible skill-map route|Oefenroute Redeneren|Oefenroute Rekenen|Oefenroute Grafieken|GRAPH-UX-2" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
Get-ChildItem reports/sprints/SKILLMAP-OP-1-screenshots -File | Measure-Object
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include the sprint checker and complete bundle
validator, focused Jest tests, generated-output route checker, screenshot
manifest with existing screenshot files, student-route proof report, roadmap
version validation, scope-language validation, report JSON validation,
protected-surface diff checks, generated-output diff review proving platform
generation rather than hand patches, refreshed repository maps/indexes, and a
clear next action: proceed to GRAPH-UX-2, route GAME-ARCH-1, or pause with
named blockers.

## Rollback plan

If SKILLMAP-OP-1 must be reverted, revert the route runtime/generator changes,
Book 1 deploy-manifest route-scope configuration, generated automated output
from the matching deploy, sprint records, screenshots, roadmap/archive
records, and generated navigation indexes. Do not hand-edit generated output,
`references/machine/`, `references/external/`, target-exercise mappings, or
answer-skill candidate storage as part of rollback.

## Human review required

No interactive human review gate is required for this implementation sprint
because the active roadmaps authorize SKILLMAP-OP-1 directly after ENGINE-OP-1.
The sprint does not authorize engine scaling, Scale Gate 1, student/product
use, diagnostics, adaptive routing, mastery, sequencing, summative use, PV
projection, PV machine promotion, or target-equivalent completion language.
Later reliance still requires `GATE-ENGINE-1` for live engine integration
quality and `GATE-L1.7B-Q2` for target-equivalent exit-ticket completion copy.

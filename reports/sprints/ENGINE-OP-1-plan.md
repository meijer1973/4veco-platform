# Sprint ENGINE-OP-1: Four-Engine Operational Proof Audit

Date: 2026-05-31

Status: planned from active roadmap row after GAME-UX-3A.

## Goal

Audit the live student-visible route for `1.1.1`, `1.1.2`, and `1.1.3`
across the shared skill-map route, math/calculation practice, graph/table
practice, reasoning practice, and checkpoint/check route. The audit must prove
what a student actually sees and does: landing-page route labels, opened
practice surfaces, visible skill-map state, played task or missing task,
feedback language, next-action language, and whether the route helps the
student move toward the paragraph target exercise.

ENGINE-OP-1 is an evidence sprint only. It must not generate or mutate lesson
output, claim target-equivalent proof, write target-exercise fields, create or
write answer-skill candidate storage, refresh projections, authorize
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

GAME-UX-3A added a shared task-shell runtime foundation, but it did not convert
generated paragraph output to that shell. Earlier lesson sprints restored the
scoped math route and added shared skill-map runtime support, while L1.7B-P23
stopped weak checkpoint generation for `1.1.2` and `1.1.3` because their
target exercises require calculation, notation, table, graph, and constructed
answer forms beyond choice-only checks.

The product north star now says engine architecture counts as product progress
only when students can see the route, practise the right task through the right
interaction, receive useful local feedback, and understand what to do next.
This sprint therefore inspects live generated output rather than accepting
runtime contracts, roadmap rows, or tests as product proof.

## Quality Standard

The quality floor is a screenshot-backed, student-facing operational audit, not
architecture-only proof. For every audited paragraph, the report must show the
specification route, the rendered output the student sees, the practice or
checkpoint task opened, the feedback/next-action language, and the gap between
that live route and the product specification. Rendered output evidence is
required through screenshots and student-path traces. Student-facing proof must
stay local and non-summative; follow-up work must be named when the route does
not yet meet the specification. The audit must identify the review gate that
will judge later student-facing quality: `GATE-ENGINE-1` for engine coherence
and `GATE-L1.7B-Q2` for target-equivalent exit-ticket completion language.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared skill-map route must be visible and useful to students | Inspect `1.1.1`, `1.1.2`, and `1.1.3` practice pages for route panel, scoped skill subset, recommended focus, local progress language, and absence of internal MTU codes | Screenshots plus student-path trace for each paragraph and practice mode | planned |
| Practice engines must show coherent task/feedback/next action | Open reasoning, math/calculation, and graph/table surfaces where present; record task type, feedback, replay/retry, and route-to-target usefulness | Operational audit finding table with paragraph-level evidence | planned |
| Checkpoint route must not overclaim target-equivalent proof | Inspect existing check/exit-ticket route and missing routes; record completion copy or absence without authorizing new claims | Audit distinguishes checkpoint-only/local check from target-equivalent proof | planned |
| Shared task shell must be evaluated as product evidence only where used | Search generated output and live pages for task-shell runtime use; record if GAME-UX-3A remains runtime-only | Audit names downstream GRAPH-UX-2, MATH-UX-2, and L1.7B-Q2 integration needs | planned |
| No protected or generated surfaces mutate | Audit writes reports/screenshots only; do not run deploy or edit lesson output/source data/protected references | Diff checks show protected references, target fields, candidate storage, and lesson output unchanged | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Capture desktop and mobile screenshots for landing, reasoning, math, graph, and check routes | `include_now` | The sprint exists to prove visible operational state, so screenshots are core evidence. |
| Add a compact student-path trace table for each audited paragraph | `include_now` | It turns screenshots into route evidence and records next-action clarity. |
| Add a finding severity table that feeds SKILLMAP-OP-1, GRAPH-UX-2, MATH-UX-2, REASON-UX-2, and GAME-ARCH-1 | `include_now` | The audit should produce actionable roadmap input. |
| Patch the generated lesson pages while auditing | `reject_scope_creep` | ENGINE-OP-1 is evidence-only; output mutation belongs to later governed implementation sprints. |
| Treat a visible local check as target-equivalent paragraph proof | `reject_scope_creep` | Only `GATE-L1.7B-Q2` may approve target-equivalent completion language after implementation evidence. |
| Build missing task-shell integrations during the audit | `defer_named_follow_up` | GRAPH-UX-2, MATH-UX-2, REASON-UX-2, and L1.7B-Q2 own implementation. |

## Allowed paths

- `reports/sprints/ENGINE-OP-1-*`
- `reports/sprints/ENGINE-OP-1-screenshots/*`
- `references/data/sprints/ENGINE-OP-1.plan.json`
- `references/data/sprints/ENGINE-OP-1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.20-*`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/ENGINE-OP-1/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories required for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- generated lesson output under `../4veco-lessen/Boek *`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- generated projection refresh beyond report/index artifacts required for
  repository navigation
- lesson output, diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion,
  Scale Gate 1, or student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/index.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/index.html`
- generated reasoning, graphical, skill-tree, and exit-ticket pages and shared
  runtime files under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`
- GAME-UX-3A task-shell runtime files under `engines/`

## Outputs

- `reports/sprints/ENGINE-OP-1-plan.md`
- `reports/sprints/ENGINE-OP-1-baseline.md`
- `reports/sprints/ENGINE-OP-1-planning-review.md`
- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `reports/sprints/ENGINE-OP-1-operational-audit.md`
- `reports/sprints/ENGINE-OP-1-screenshot-manifest.md`
- `reports/sprints/ENGINE-OP-1-result.md`
- `reports/sprints/ENGINE-OP-1-diff-summary.md`
- `references/data/sprints/ENGINE-OP-1.plan.json`
- `references/data/sprints/ENGINE-OP-1.result.json`
- screenshot files under `reports/sprints/ENGINE-OP-1-screenshots/`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/ENGINE-OP-1/`
- updated platform and lesson roadmaps that mark ENGINE-OP-1 complete and set
  the next operational action, unless audit findings require a pause

## Operationalized sprint procedure

1. Record baseline evidence: current roadmap authority, target paragraphs,
   generated page inventory, generated output mutation boundary, protected
   reference boundary, and GAME-UX-3A runtime-only state. Stop if the audit
   would require changing generated lesson pages, source data, protected
   references, target-exercise mappings, or candidate storage.
2. Serve or open the existing generated lesson output locally for inspection.
   Do not run deploy, rebuild lesson output, or write into `../4veco-lessen/Boek *`.
3. Inspect landing pages for `1.1.1`, `1.1.2`, and `1.1.3`. Record which
   Redeneren, Rekenen, Grafieken, and Check routes appear and which route is
   absent or blocked.
4. Open representative reasoning, math/calculation, graph/table, and checkpoint
   surfaces. Capture desktop and mobile screenshots, note visible skill-map
   state, task language, feedback/retry/self-check behavior, local boundary
   copy, and next-action clarity. Stop and record the gap if a route cannot be
   opened or is blank.
5. Search generated output for shared task-shell usage and internal-code or
   restricted product-claim leakage. Record whether task-shell coherence is
   visible or remains only a runtime foundation.
6. Write the student-path trace, screenshot manifest, and operational audit
   with finding severities and named handoffs to SKILLMAP-OP-1, GRAPH-UX-2,
   MATH-UX-2, REASON-UX-2, GAME-ARCH-1, L1.7B-Q2, and GATE-ENGINE-1.
7. Update sprint result records and roadmaps. If the audit shows a severe
   blocker that makes SKILLMAP-OP-1 the wrong next action, stop and recommend
   a strategic pause or GAME-ARCH-1 decision before implementation.
8. Refresh maps/indexes, run acceptance validators, and stop if sprint-bundle,
   screenshot-manifest, scope-language, roadmap, protected-surface,
   generated-output, or diff checks fail.
9. Fetch, reconcile, commit, and push both repositories. If either repository
   is behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/ENGINE-OP-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1
node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "ENGINE-OP-1|student-path trace|screenshot manifest|shared task shell|target-equivalent proof|SKILLMAP-OP-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
Get-ChildItem reports/sprints/ENGINE-OP-1-screenshots -File | Measure-Object
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json
git -C ../4veco-lessen diff --name-only -- "Boek*"
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include the sprint checker and complete bundle
validator, screenshot manifest with existing screenshot files, student-path
trace, operational audit findings, roadmap-version validation, scope-language
validation, report JSON validation, generated-output and protected-surface diff
checks, refreshed repository maps/indexes, and a clear next action: proceed to
SKILLMAP-OP-1, route a build-vs-rebuild decision, or pause with named blockers.

## Rollback plan

ENGINE-OP-1 should add only audit reports, screenshots, sprint metadata,
roadmap/archive records, and generated navigation indexes. If the audit must be
rejected, remove those audit artifacts and restore roadmap/index references.
Do not hand-edit generated lesson output, source data, `references/machine/`,
`references/external/`, target-exercise mappings, or answer-skill candidate
storage as part of rollback.

## Human review required

No interactive human review gate is required for this audit sprint because the
active roadmaps authorize ENGINE-OP-1 directly after GAME-UX-3A. The audit does
not authorize implementation, product use, Scale Gate 1, or target-equivalent
completion language. Later reliance still requires `GATE-ENGINE-1` for live
engine integration quality and `GATE-L1.7B-Q2` for target-equivalent exit-ticket
completion copy.

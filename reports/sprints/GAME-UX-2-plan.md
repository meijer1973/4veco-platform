# Sprint GAME-UX-2: Exit Ticket Checkpoint Engine

## Goal

Implement the platform side of lesson `L1.7B-R`: a source-controlled,
non-summative exit-ticket checkpoint engine/wrapper for one controlled
paragraph-limited implementation, `1.1.1 Schaarste en economisch denken`.

The sprint must build a reusable platform runtime, generator, source-data
route, deploy integration, and tests. It must regenerate the reviewed lesson
output through platform scripts only, expose the landing-page `Check` route
only for paragraphs with generated checkpoint output, and hand a bounded
platform proof back to the lesson team for later `L1.7B-R` review and
`GATE-L1.7B`.

GAME-UX-2 does not authorize broad companion scaling, Scale Gate 1 closure,
`GATE-L1.7B` closure, target-exercise promotion, protected reference mutation,
machine-reference mutation, unit minting, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, or hand-patched generated lesson output.

## Context

Lesson `L1.7B-C` closed the exit-ticket companion contract as contract-only
work and paused implementation because the old draft was untracked, used unsafe
product-boundary language, read adaptive-focus payload keys, depended on
compact checkpoint-mode skill-map behavior, and risked becoming a fourth
isolated game UI.

Lesson `L1.7B-R` now requests platform support before lesson-side review can
resume:

- source-controlled checkpoint runtime in `4veco-platform`;
- shared `SkillMapEngine` compact checkpoint-mode use;
- one non-summative checkpoint surface for `1.1.1 Schaarste en economisch denken`;
- generated lesson output through platform scripts only;
- generator-owned landing-page `Check` activation;
- neutral feedback and retry/self-check guidance;
- screenshot/interaction QA and validation evidence;
- no mastery, pass/fail, score, grade, evidence, diagnostic, adaptive,
  sequencing, summative, AI, PV, or product-use claims.

The platform already has `GAME-UX-1` shared skill-map support. Its
`SkillMapEngine.createRequest("exit-ticket", ...)` default is compact,
mixed-aspect, and boundary-safe. GAME-UX-2 must consume that shared route
contract rather than creating an isolated checkpoint map.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. GAME-UX-2 may use it only as design
evidence if explicitly inspected, but must not import it wholesale, stage it,
move it, edit it, or delete it.

## Allowed paths

- `reports/sprints/GAME-UX-2-plan.md`
- `references/data/sprints/GAME-UX-2.plan.json`
- `reports/sprints/GAME-UX-2-baseline.md`
- `reports/sprints/GAME-UX-2-planning-review.md`
- `source-data/book-1/exit-ticket/1.1.1.json`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `engines/tests/exit-ticket-engine.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- focused landing-page and deploy tests under `scripts/tests/` or
  `engines/tests/`
- `scripts/deploy.js`
- `build-scripts/platform/build-landing-page.js`
- generated lesson output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` created by
  `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
  only
- `reports/sprints/GAME-UX-2-result.md`
- `reports/sprints/GAME-UX-2-diff-summary.md`
- `reports/sprints/GAME-UX-2-qa.md`
- `references/data/sprints/GAME-UX-2.result.json`
- refreshed reports, dashboards, maps, inventories, source-document registry,
  GitHub-agent indexes, URL indexes, and roadmap/version-index bookkeeping
- `references/reference-team-roadmap.md` for sprint status
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.83-ex7-dry-run-cli-implementation.md`

## Forbidden paths

- hand edits to generated lesson output in `../4veco-lessen/`
- import, staging, modification, movement, or deletion of
  `knowledge/exit-ticket-game-1.1.1.zip`
- hand edits to `references/machine/`
- hand edits to `references/external/`
- protected reference mutation
- machine-reference mutation
- external-source mutation
- unit minting
- operation-registry or answer-skill mutation
- candidate-storage creation or candidate writes from the EX lane
- q19 source-annex or graph-object extraction execution
- target-exercise promotion
- placeholder finalization
- CP-6 closure or Year-1 closure
- diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- broad companion scaling or Scale Gate 1 closure

## Inputs

- `../4veco-lessen/archive/sprints/L1.7B-R/L1.7B-R-platform-support-request.md`
- `../4veco-lessen/archive/sprints/L1.7B-R/L1.7B-R-stop-decision.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `references/reference-team-roadmap.md`
- `engines/skill-map-engine.js`
- `engines/skill-map-route-ui.js`
- `engines/skilltree/base-elements.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `build-scripts/platform/build-landing-page.js`
- `scripts/deploy.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/_paragraph-plan.md`

## Outputs

- A sprint bundle under `reports/sprints/` and
  `references/data/sprints/`: plan, baseline, planning review, result, diff
  summary, QA log, and result metadata.
- Source-controlled exit-ticket runtime files:
  `engines/exit-ticket-engine.js`, `engines/exit-ticket-ui.js`, and
  `engines/exit-ticket.css`.
- Source-controlled checkpoint data:
  `source-data/book-1/exit-ticket/1.1.1.json`.
- A generator:
  `build-scripts/platform/build-exit-ticket-shells.js`.
- Deploy integration in `scripts/deploy.js` that copies the checkpoint runtime
  and generates checkpoint shells before landing pages.
- Landing-page generator updates so `Check` appears only when generated
  checkpoint output exists and uses neutral route language.
- Focused tests for checkpoint data shape, blocked student-facing terms,
  internal MTU-code leakage, shared skill-map compact checkpoint requests,
  generator shell dependencies, deploy integration, and landing `Check`
  activation.
- Generated lesson output produced only through platform scripts:
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/1.1.1.js`,
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-engine.js`,
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-ui.js`,
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket.css`,
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – exit-ticket.html`,
  and regenerated landing pages for the affected paragraph/chapter/book
  surfaces if the deploy script marks them downstream.

Generated output statement: GAME-UX-2 intentionally generates one bounded
student-facing checkpoint surface for paragraph `1.1.1` plus the necessary
shared runtime/data files and landing-page refreshes. All lesson-output files
must be generated by platform scripts; no generated lesson file may be edited
by hand.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning review. Stop if the
   plan does not name generated lesson outputs, stop conditions, and exact
   validation commands.
2. Inspect the lesson `L1.7B-R` handoff, the `1.1.1` paragraph plan, current
   shared skill-map runtime, deploy pipeline, and landing-page `Check`
   behavior. Stop if the requested bounded implementation would require lesson-side runtime work
   or hand-patched generated output.
3. Add source-controlled paragraph-limited checkpoint data for `1.1.1`, using only
   paragraph target skills and student-facing labels. Stop if internal MTU IDs
   would need to appear in student-facing text.
4. Implement the exit-ticket engine and UI. The runtime must use
   `SkillMapEngine.createRequest("exit-ticket", ...)` in compact checkpoint
   mode, provide neutral immediate feedback, keep practice progress local to
   the surface, and avoid blocked product-boundary language.
5. Add the exit-ticket shell generator and deploy integration. Stop if the
   generator would import the untracked draft zip, create an isolated game
   architecture, or bypass the platform deploy pipeline.
6. Update landing-page `Check` route copy so it becomes visible only when the
   generated checkpoint shell exists and does not describe the surface as a
   test, assessment, diagnostic, or summative product.
7. Add focused tests for data shape, boundary language, MTU-code leakage,
   shared skill-map request shape, shell dependencies, deploy integration, and
   landing-page activation.
8. Run the focused tests, sprint checks, deploy to the Book 1 lesson target,
   paragraph/book/procedure/target validators, full Jest suite, and screenshot
   or interaction QA. Stop if any generated page leaks blocked language,
   internal MTU IDs, broken assets, or incoherent mobile/desktop layout.
9. Record result, diff summary, QA evidence, generated file list, validation
   outputs, roadmap/index updates, and lesson handoff status. Stop if the
   lesson team cannot tell exactly which platform and generated lesson files
   changed.
10. Fetch/prune remote, commit, tag, and push the platform and generated lesson
    output commits. Do not stage the unrelated draft zip.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-2
npm.cmd test -- --runInBand engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skill-map-engine.test.js engines/tests/skill-map-route-ui.test.js scripts/tests/build-landing-page.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/validate-paragraph.js --mode complete --profile student-web "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/validate-procedure-contracts.js --book-root "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-course-target-exercises-v5.js
npm.cmd test
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-2 --complete
```

Screenshot/interaction QA must also cover the generated exit-ticket page and
the regenerated `1.1.1` landing page on desktop and mobile widths, in light and
dark modes where supported. If automated screenshot tooling is unavailable,
record the attempted command, failure, and residual risk in
`reports/sprints/GAME-UX-2-qa.md`.

## Rollback plan

Revert the GAME-UX-2 implementation commit in the platform repo and the
corresponding generated-output commit in the lesson repo. Rollback removes the
checkpoint runtime, generator, paragraph-limited source data, focused tests, sprint logs,
roadmap/index updates, and generated lesson checkpoint files. It must not touch
the untracked draft zip, `references/machine/`, or `references/external/`.

## Human review required

No separate human-review gate is required to complete GAME-UX-2 because this
sprint implements the already-requested platform support and does not close
`L1.7B-R`, `GATE-L1.7B`, Scale Gate 1, or any product-use lane. The output must
be handed back to the lesson team so `L1.7B-R` can resume and the lesson-side
`GATE-L1.7B` human review can decide whether the generated checkpoint is safe
for controlled use.

Any request to treat the checkpoint as an assessment, diagnostic, mastery
decision, automatic route, sequencing signal, summative product, AI
recommendation, PV projection, or scaled companion default must stop and route
through a later explicit human gate.

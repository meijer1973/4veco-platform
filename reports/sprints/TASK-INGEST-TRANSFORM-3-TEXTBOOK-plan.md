# Sprint TASK-INGEST-TRANSFORM-3-TEXTBOOK: Textbook Source Exercise Transformation

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`
Date: 2026-06-04
Owner: Codex
Roadmap row: Textbook Source Exercise Transformation

## Goal

Prepare one governed textbook-style source-context transformation after the actual-exam transformation path has proved source authority, context ordering, task-family mapping, operation tracing, playable proof, screenshots, and checker requirements.

The sprint uses the owned Book 1 paragraph source for `1.1.3 Grafieken en tabellen` as the controlled textbook source. It must prove that the shared task-ingestion layer can transform a textbook table/graph/claim exercise into context blocks and task cards without claiming official exam authority, weakening the external-primary evidence standard, or mutating protected reference data.

## Context

Previous sprint `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` closed the actual-exam transformation path and produced a playable review-only lab, proof JSON, screenshots, source reconstruction map, operation/answer-form traces, task-family map, and lead-review PASS.

The current roadmap row requires a textbook-source transformation only after that actual-exam path is proven. The next roadmap gate, `GATE-SHARED-TASK-INGEST-REPAIR-1`, will compare the actual-exam lab and this textbook lab side by side. This sprint prepares the textbook evidence bundle only; it does not close the human gate.

## Quality Standard

The quality floor is a source-first, inspectable, review-only transformation that satisfies the specification without broadening adoption. The rendered output must place source/context blocks before task cards, and the proof must show that the task shell can validate table reading, graph interpretation, axis convention, point placement, calculation work, source-chain reasoning, and answer-form expectations.

Because this is a textbook source, not official exam source material, the task set must be honest about authority. It may use owned paragraph and target-registry evidence, but it must not call that evidence official, external-primary, exam-equivalent, or student-facing production output. Any remaining human-review comments, product adoption, Scale Gate, and route publication are named follow-up work for `GATE-SHARED-TASK-INGEST-REPAIR-1`.

Passing tests alone is not enough. The lab, maps, traces, screenshots, checker, and lead-review result must together prove the transformation is reviewable and does not weaken the real-exam evidence standard.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Source-dependent tasks use context first | `reports/json/task-ingest-transform3-textbook.json` context blocks before tasks | Checker rejects missing/late context blocks and proof JSON records task-shell validation | planned |
| Official exam evidence remains stronger than textbook evidence | `sourceAuthority.kind` set to owned textbook source and explicit non-official authority note | Checker rejects `external_primary`, official-exam claims, and exam-equivalence language | planned |
| Governed source maps | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md` | Lead review checks paragraph, target registry, asset, context, and task mappings | planned |
| Visual variants | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-visual-variant-map.md` plus screenshot set | Checker verifies light, dark, and thumbnail/SVG references and screenshot files | planned |
| Operation traces | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-operation-chain-trace.md` | Checker verifies table-read, axis-selection, point-plotting, interpolation, percent-change, and source-claim operations | planned |
| Task-family maps | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md` | Checker verifies every task uses a supported `TaskShellEngine` family | planned |
| Answer-form traces | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md` | Checker verifies correct/adversarial fixtures for selected response, graph value, calculation, and source-chain tasks | planned |
| Reviewable interactive proof | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`, proof JSON, screenshots | Lead review and custom checker confirm reproducible lab evidence exists | planned |
| No unauthorized production adoption | Review-only metadata and roadmap follow-up notes | Scope-language checker and lead review confirm no student-facing or Scale Gate claim | planned |

## Quality Improvement Candidates

| Candidate | Classification | Rationale |
|---|---|---|
| Record the 50 percent interval ambiguity instead of hiding it | include_now | The paragraph-taught interval and another source-valid interval both matter for honest source interpretation. |
| Reject official/external authority claims in the checker | include_now | This protects the actual-exam evidence standard. |
| Run adversarial fixtures across table, graph, calculation, and source-chain tasks | include_now | It proves the transformation is not a static display-only artifact. |
| Human comments and gate closure proposal | defer_named_follow_up | These belong to `GATE-SHARED-TASK-INGEST-REPAIR-1`. |
| Mint new micro-teaching units | reject_scope_creep | This sprint transforms source evidence; it does not mutate the reference catalog. |
| Publish a production Book 1 route | reject_scope_creep | The sprint is review-only and not a student-facing deployment. |

## Allowed paths

- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK*`
- `reports/json/task-ingest-transform3-textbook*.json`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `references/data/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK.plan.json`
- `references/data/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK.result.json`
- Roadmap, report-index, dashboard, and GitHub-facing map files required for closure

## Forbidden paths

- `references/machine/**`
- `references/external/**`
- `source-data/**`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/**`

The sprint may read protected reference data and Book 1 paragraph output as baseline evidence. It may not edit them.

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-result.md`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - paragraaf.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/_assets/1.1.3_fig_1.svg`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/_assets/1.1.3_fig_3.svg`
- `references/authored/course-target-exercises.json`
- `engines/task-shell-engine.js`

## Outputs

The generated output of this sprint is a review-only textbook-source transformation bundle, not a student-facing deployment.

- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-visual-variant-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- Lead-review assignment, round 1, correction log, and round 2 files
- Sprint result, result JSON, and diff summary

## Operationalized sprint procedure

1. Record the operational plan and baseline, then run the plan checker and active bundle checker. Stop if either validator finds missing operational details.
2. Run a planning/review subagent against the roadmap row, baseline, source authority boundary, expected generated output, stop conditions, and acceptance tests. If the planning review finds a blocking gap, fix the plan before implementation.
3. Build the textbook task-set JSON using the 1.1.3 ice-cream source. Decision point: if the task-shell validator rejects a needed task family, switch to an already-supported family and record the substitution in the task-family map.
4. Build the source map, visual variant map, operation trace, answer-form trace, task-family map, reviewer notes, lab, screenshot capture script, and checker. Stop if any source fragment cannot be mapped to a context or task.
5. Capture screenshots and proof JSON. Stop if desktop light, mobile light, or mobile dark screenshots are missing or the proof JSON cannot demonstrate correct and adversarial fixture outcomes.
6. Run custom checker, report JSON validation, platform checks, roadmap checks, and scope-language checks. Stop on any failed validator.
7. Run lead-review round 1, record corrections, and run lead-review round 2. Stop if round 2 is not PASS or PASS WITH FLAGS with non-blocking named flags.
8. Update platform and lesson roadmap status only after validation and lead-review success.
9. Refresh repository maps/indexes, run final bundle/result checks, fetch/prune, commit, push, and report hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-3-TEXTBOOK --active
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node build-scripts/reports/validate-report-json.js
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-lead-review-substance.js TASK-INGEST-TRANSFORM-3-TEXTBOOK
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-3-TEXTBOOK --complete
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
```

## Proof Required to Close

Proof required to close must include review, validator, and test evidence:

- Plan, baseline, and planning-review artifacts exist and pass active bundle validation.
- Textbook task-set JSON validates with `TaskShellEngine.validateTaskSet`.
- Proof JSON records correct and adversarial outcomes for representative task cards.
- Source map, visual variant map, operation trace, answer-form trace, and task-family map exist.
- Rendered lab and screenshot files exist for desktop light, mobile light, and mobile dark modes.
- Custom checker, report JSON validation, scope-language check, platform check, lead-review check, sprint-result check, and complete bundle check pass.
- Platform and lesson roadmaps are updated only after lead-review PASS.
- Repository maps/indexes are refreshed and the commit is pushed.

## Rollback plan

If implementation fails before roadmap status changes, remove the new `TASK-INGEST-TRANSFORM-3-TEXTBOOK*` sprint artifacts and scripts and leave the roadmap row open.

If validation fails after roadmap status changes, revert only the roadmap closure and result artifacts for this sprint, keep diagnostic notes if useful, and leave the row open with the blocker recorded.

If a forbidden protected reference or Book 1 output write is detected, stop immediately, restore that unintended change, record the incident in the sprint result, and do not proceed to lead review until the working tree is clean of forbidden edits.

## Human review required

Human review is not required to close this sprint. Human review is required at the next roadmap gate, `GATE-SHARED-TASK-INGEST-REPAIR-1`, where this sprint's textbook lab must be reviewed alongside the prior actual-exam lab.

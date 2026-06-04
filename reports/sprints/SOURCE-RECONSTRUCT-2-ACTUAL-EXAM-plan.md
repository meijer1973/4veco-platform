# Sprint SOURCE-RECONSTRUCT-2-ACTUAL-EXAM: Actual Exam Source Reconstruction

## Goal

Reconstruct the authorized external-primary exam source for
`vw-1022-a-25-1-o:opgave-1:question-3` into governed review artifacts:
normalized markdown, semantic source table/context blocks, source map,
visual-fidelity notes, correction-model comparison evidence, review-only
rendered proof, screenshots, and a deterministic checker tied to the official
prompt and correction PDFs.

## Context

The prerequisite sprints are closed: `EXAM-SOURCE-AUTH-1`,
`TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`, and
`CONTEXT-VISUAL-STD-1`. The authorized source authority is fixed in
`reports/json/exam-source-authority1-contract.json`; only the selected question
3 Zoohee zorgverzekering source may be reconstructed in this sprint.

The product north star requires source-dependent tasks to show source context
before task controls. The visual standard requires source-output parity,
semantic tables, no copied-image shortcuts, captions, source labels, alt text,
mobile/dark proof expectations, and reviewer comparison evidence. This sprint
creates the source reconstruction evidence only. It does not transform the
source into task-family exercises, publish generated lesson output, adopt a
product route, or claim target-equivalent proof.

## Quality Standard

The quality floor is specification fulfilment for actual source reconstruction:
the reconstruction must be tied to the official prompt PDF and correction PDF,
must reconstruct the authorized table as a semantic table rather than an image,
must preserve values, labels, units, row order, prompt reference, correction
model threshold evidence, and source authority, and must provide proof a
reviewer can inspect.

Rendered output quality is required as review-only proof in this sprint. The
student-facing surface is not published here; however, the reconstructed blocks
must already render with student-facing labels, captions, and alt text without
internal IDs or answer leakage. Closure proof must include a rendered lab,
desktop light screenshot, mobile light 390px screenshot, mobile dark 390px
screenshot, proof JSON, and a checker that reads the local official PDF text,
validates the reconstruction against the authority and visual contracts, and
confirms protected references, source-data, and generated lesson output remain
unchanged. Follow-up work is named for task transformation, textbook source
transformation, and human review.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reconstruct only the authorized external-primary item. | `reports/json/source-reconstruct2-actual-exam.json` matches `reports/json/exam-source-authority1-contract.json` and names only `vw-1022-a-25-1-o:opgave-1:question-3`. | Checker rejects wrong exam item/source material and verifies prerequisite rows are closed. | Planned |
| Produce normalized markdown tied to official prompt/correction PDFs. | `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-normalized-source.md` contains the prompt, source table, correction-model operation notes, citations, and boundaries. | Checker verifies cited PDF paths exist and `pdftotext` evidence contains the relevant official prompt/table/correction strings. | Planned |
| Reconstruct source material as semantic table/context blocks, not a copied image. | JSON context blocks include `markdown`, `source_excerpt`, `table`, and `formula`/operation-note blocks only where justified by the source or correction model; table values are semantic rows. | Checker validates exact table values, no raw image path, no copied screenshot dependency, source labels, captions, alt text, and source map. | Planned |
| Produce source maps, visual-fidelity notes, reviewer comparison artifacts, and rendered proof. | Markdown and JSON artifacts record prompt PDF references, correction PDF references, source-material refs, value/label/unit/row-order checks, visual-standard coverage, lab path, screenshots, and proof JSON. | Lead review inspects `source-map.md`, `visual-fidelity-notes.md`, `reviewer-comparison.md`, rendered lab, screenshot manifest, and proof JSON. | Planned |
| Preserve product boundaries. | Result JSON and reconstruction contract allow source reconstruction but deny task transformation, generated lesson output, protected reference mutation, source-data mutation, product-route adoption, target-equivalent proof, diagnostics, mastery, PV, Scale Gate, and student/product use. | Checker and diff status confirm protected refs, source-data, and Book 1 generated output are clean. | Planned |
| Keep answer-model evidence as comparison, not task transformation. | Reconstruction JSON includes correction-model reference/operation comparison but no task-family composition or student task set. | Checker rejects task-family output and confirms next sprint is `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`. | Planned |

## Quality Improvement Candidates

- include_now: Use `pdftotext` inside the checker so source proof is tied to the local official PDFs instead of inherited overlay claims alone.
- include_now: Store the reconstruction as both readable markdown and a JSON contract so later task-ingestion work has a stable handoff.
- include_now: Record a source-output parity matrix for values, units, labels, row order, prompt wording, answer-model threshold, and no-image dependency.
- include_now: Add a review-only rendered lab and desktop/mobile/dark screenshots because the visual standard requires rendered source-output parity proof at reconstruction time.
- defer_named_follow_up: `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` must transform these reconstructed context blocks into task-family compositions with operation and answer-form traces.
- defer_named_follow_up: `TASK-INGEST-TRANSFORM-3-TEXTBOOK` must prepare textbook source-context transformation after the actual-exam path is proven.
- reject_scope_creep: Do not write generated Book 1 lesson output, mutate protected references, change source-data, create task-family exercises, mint units, claim target-equivalent proof, or authorize diagnostics, mastery, PV, Scale Gate, student-facing AI, summative use, or product use.

## Allowed paths

- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-planning-review.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-normalized-source.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-source-map.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-visual-fidelity-notes.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-reviewer-comparison.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-result.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-diff-summary.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-command-log.*`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-lead-review-*.md`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/source-reconstruct2-actual-exam-proof.json`
- `build-scripts/sprints/check-source-reconstruct2-actual-exam.js`
- `build-scripts/sprints/capture-source-reconstruct2-screenshots.js`
- `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.plan.json`
- `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.result.json`
- Roadmap, map, URL-index, and dashboard files updated only as required for closure.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No source-data writes.
- No generated Book 1 lesson output writes under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.
- No task-family exercise transformation, task-shell route adoption, target-exercise registry writes, candidate storage creation, unit minting, PV mutation, diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1 claims, or student/product use.
- No legacy Module 3 target changes.

## Inputs

- `reports/json/exam-source-authority1-contract.json`
- `reports/json/task-context-spec1-contract.json`
- `reports/json/context-visual-std1-contract.json`
- `reports/json/task-context-runtime1-proof.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

Generated reconstruction artifacts for this sprint:

- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-normalized-source.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-source-map.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-visual-fidelity-notes.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-reviewer-comparison.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/source-reconstruct2-actual-exam-proof.json`
- `build-scripts/sprints/check-source-reconstruct2-actual-exam.js`
- `build-scripts/sprints/capture-source-reconstruct2-screenshots.js`

Sprint closure artifacts:

- Plan, baseline, planning review, command logs, result, diff summary, result JSON, and lead-review artifacts.
- Roadmap closure rows and refreshed GitHub-facing maps/indexes at final publication.

No generated lesson files, protected reference files, source-data files, or
task-family exercise files should be produced.

## Operationalized sprint procedure

1. Establish the baseline and planning review: validate this plan and bundle, send the plan to a planning/review subagent, and stop before reconstruction if the plan misses any required output, PDF evidence, source-output parity check, generated-output boundary, or protected-reference boundary.
2. Extract and verify official PDF evidence: use `pdftotext` on the local official prompt and correction PDFs; stop if the selected question, Zoohee table, table values, prompt wording, correction-model threshold, or correction-model steps cannot be found.
3. Build reconstruction artifacts: write normalized markdown, source map, visual-fidelity notes, reviewer comparison, JSON reconstruction contract, and review-only rendered lab for only the authorized item and source material.
4. Capture rendered proof: produce desktop light, mobile light 390px, and mobile dark 390px screenshots plus proof JSON; stop if the semantic table, captions, labels, source refs, or mobile/dark rendering cannot be inspected.
5. Build checker coverage: validate source authority, prerequisite closure, PDF text evidence, semantic table rows, context-block metadata, source-output parity, visual-standard requirements, rendered proof, correction-model comparison, no task transformation, and clean protected/generated-output boundaries.
6. Run validators and lead-review cycle: run acceptance tests, assign lead review, record round 1, apply corrections, run round 2, and stop if review finds missing source evidence, weak rendered source-output parity, copied-image dependency, or scope drift into task/product adoption.
7. Close publication state: update roadmap rows and result artifacts, refresh maps/indexes/dashboard as required, run final validators, fetch/prune remote state, commit and push unless a blocker is recorded with exact dirty status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md
node build-scripts/sprints/check-sprint-bundle.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM
node build-scripts/sprints/capture-source-reconstruct2-screenshots.js
node build-scripts/sprints/check-source-reconstruct2-actual-exam.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM
node build-scripts/sprints/check-sprint-result.js reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-result.md
node build-scripts/sprints/check-sprint-bundle.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof must include normalized source markdown, source map, visual-
fidelity notes, reviewer comparison, reconstruction JSON, rendered lab,
screenshot manifest, desktop/mobile/dark screenshots, proof JSON,
deterministic checker, command-log evidence for every passed acceptance test in
the result JSON, planning review, lead-review assignment/round
1/corrections/round 2 artifacts, result and diff summary files, clean
protected-reference/source-data/generated-output boundary notes, and refreshed
roadmap/map/index/dashboard evidence. The sprint can close only when the
complete bundle validator accepts the closure state.

## Rollback plan

If reconstruction or review fails, remove only the `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`
sprint artifacts and checker, restore the roadmap row to open if it was
changed, and record the blocker. Do not mutate protected references,
source-data, generated lesson output, or external PDFs as a rollback shortcut.

## Human review required

No human review gate is required for this reconstruction-evidence sprint. A
lead-review cycle is required before sprint closure. Human review remains
required for `GATE-SHARED-TASK-INGEST-REPAIR-1` and any generated student-facing
source-context adoption that plan calls for.

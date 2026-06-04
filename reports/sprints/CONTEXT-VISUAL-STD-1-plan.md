# Sprint CONTEXT-VISUAL-STD-1: Source Context Visual Standard

## Goal

Define the unified visual standard for shared task-shell source context blocks so future exam/textbook source reconstruction has a concrete student-facing style, accessibility, and evidence baseline before any actual source material is reconstructed or adopted in generated lesson output.

## Context

`TASK-CONTEXT-SPEC-1` defined the authoring/interchange contract for `contextBlocks`, and `TASK-CONTEXT-RUNTIME-1` proved that those blocks can render before task controls in the shared task shell. The roadmap now requires a source-context visual standard before `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` can reconstruct the authorized external-primary exam item.

The product end-state requires source-dependent tasks to show context first, with source excerpts, semantic tables, reconstructed SVG graphs/figures/flowcharts, formulas, captions, source labels, alt text, and student-facing references. The companion core specification adds mobile, dark-mode, keyboard/focus, graph/table, and visual proof expectations. This sprint turns those requirements into a reviewable standard and deterministic checker.

This sprint is standard/checker only. It sets policy and proof expectations, and it may inspect current runtime selectors as baseline evidence, but it does not change `engines/task-shell.css` unless a concrete runtime gap blocks the checker and is first recorded as a plan correction. It does not ingest an exam, reconstruct an official source, mutate protected references, alter generated Book 1 lesson output, or make product-route, target-equivalent, Scale Gate, PV, diagnostic, mastery, or student-use claims.

## Quality Standard

The quality floor is specification fulfilment for the source-context visual standard: every allowed context block type must have student-facing visual rules, source-label and caption rules, accessibility/alt-text rules, color/token requirements, typography and spacing requirements, mobile and dark-mode requirements, and proof expectations. The standard must define what rendered output must prove before a future source-reconstruction sprint can close.

Rendered output is not generated in this sprint, but the standard must still be written against rendered-output quality: a future student-facing source context must be legible, source-faithful, non-decorative, and usable on mobile and dark mode. Closure proof must include a standard document, machine-readable contract, deterministic checker, planning review, command-log evidence, and lead review. Follow-up work must name actual source reconstruction, source-task transformation, and any residual dual-coding standard not absorbed here.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Roadmap visual scope is fully defined: semantic tables, reconstructed SVG graphs/figures/flowcharts, formula boxes, source cards, captions, labels, color tokens, typography, spacing, mobile behavior, dark mode, axis/legend conventions, SVG sizing, alt text, and source-label rules. | `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md` and `reports/json/context-visual-std1-contract.json` include each roadmap term as a required coverage item. | `build-scripts/sprints/check-context-visual-std1.js` rejects missing coverage. | Planned |
| All `TASK-CONTEXT-SPEC-1` block types have visual rules. | Contract maps `markdown`, `source_excerpt`, `table`, `svg_figure`, `graph`, `flowchart`, `formula`, and `info_box` to layout, semantics, captions, accessibility, and proof rules. | Checker cross-checks the visual contract against `reports/json/task-context-spec1-contract.json`. | Planned |
| Source labels, captions, and student-facing references are consistent and do not expose internal IDs. | Standard defines label families such as `Bron`, `Tabel`, `Figuur`, `Schema`, and `Formule`, plus caption structure and context-reference wording. | Checker verifies label-rule coverage and a boundary section for internal-code exposure. | Planned |
| Visual rendering expectations are inspectable before future reconstruction closes. | Standard defines proof profiles for source cards, tables, SVG figures, graphs, flowcharts, formulas, mobile, dark mode, screenshots, source-output parity, and accessibility. | Lead review verifies the standard can drive future reviewer comparison packets. | Planned |
| Dark-mode and mobile behavior protects graph/table/source information. | Contract defines theme tokens, contrast roles, axis/legend requirements, responsive table overflow, SVG sizing, and no light-only pasted image dependency. | Checker verifies mobile/dark/theme requirements and named proof artifacts for future sprints. | Planned |
| The main visual-source scope previously implied by `DUAL-CODING-STD-1` is either absorbed or explicitly named as follow-up. | Standard includes a dual-coding absorption note and residual decision. | Result records whether `DUAL-CODING-STD-1` remains residual follow-up. | Planned |
| Protected references and generated output remain unchanged. | Plan/result JSON declare protected and generated-output changes false; diff summary reports boundary status. | Final validators and `git diff --check` run before closure. | Planned |

## Quality Improvement Candidates

- include_now: Add a machine-readable contract so future source-reconstruction and engine-unification sprints can validate coverage instead of relying on prose alone.
- include_now: Add a current-runtime crosswalk that names which existing task-shell selectors already approximate the standard and which future improvements belong to later implementation.
- include_now: Define source-output parity proof, not just attractive styling, so reviewers can compare reconstructed tables/graphs/figures against official prompts or textbook source material.
- defer_named_follow_up: `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` must reconstruct the authorized official exam source using this standard and produce reviewer comparison artifacts.
- defer_named_follow_up: `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` must bind reconstructed context blocks to task-family compositions and answer-form traces.
- defer_named_follow_up: `ENGINE-UNIFY-1` may implement additional renderer/CSS changes if this standard identifies current runtime gaps.
- reject_scope_creep: Do not reconstruct actual sources, edit generated Book 1 output, mutate protected references, change source-data, mint units, claim target-equivalent proof, or create diagnostics, mastery, sequencing, PV, Scale Gate, or student/product authority.

## Allowed paths

- `reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-baseline.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-planning-review.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-result.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-diff-summary.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-command-log.*`
- `reports/sprints/CONTEXT-VISUAL-STD-1-lead-review-*.md`
- `reports/json/context-visual-std1-contract.json`
- `build-scripts/sprints/check-context-visual-std1.js`
- `references/data/sprints/CONTEXT-VISUAL-STD-1.plan.json`
- `references/data/sprints/CONTEXT-VISUAL-STD-1.result.json`
- Roadmap, map, URL-index, and dashboard files updated only as required for closure.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No source-data writes.
- No generated Book 1 lesson output writes under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.
- No actual exam/textbook ingestion or official-source reconstruction.
- No target-exercise registry writes, candidate storage creation, unit minting, PV mutation, diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1 claims, or student/product use.
- No legacy Module 3 target changes.

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/json/task-context-spec1-contract.json`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-result.md`
- `reports/json/task-context-runtime1-proof.json`
- `engines/task-shell.css`
- `engines/task-shell-ui.js`

## Outputs

- Source context visual standard at `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md`.
- Machine-readable visual-standard contract at `reports/json/context-visual-std1-contract.json`.
- Sprint checker at `build-scripts/sprints/check-context-visual-std1.js`.
- Sprint plan, baseline, planning review, command logs, result, diff summary, result JSON, and lead-review artifacts.
- Roadmap closure rows and refreshed GitHub-facing maps/indexes at final publication.

No generated lesson files, reconstructed source files, protected reference files, or source-data files should be produced.

This sprint is not expected to edit runtime CSS or UI code. If the standard identifies a runtime implementation gap, the gap must be named as follow-up for `ENGINE-UNIFY-1` or a later implementation sprint unless it blocks the standard/checker itself.

## Operationalized sprint procedure

1. Establish the baseline and planning review: validate this plan and bundle, record the planning reviewer decision, and stop before implementation if the reviewer finds missing block-type coverage, weak proof requirements, unclear generated-output boundaries, or any protected-reference ambiguity.
2. Draft the visual standard: define shared principles, visual tokens, block-type rules, source-card/caption/label rules, graph/axis/legend and SVG sizing rules, formula/table/flowchart rules, mobile/dark behavior, accessibility, source-output parity, and future reviewer evidence requirements.
3. Encode the contract and checker: write `reports/json/context-visual-std1-contract.json` and `build-scripts/sprints/check-context-visual-std1.js`; stop if the checker cannot verify roadmap-term coverage, block-type coverage, proof profiles, and boundary declarations deterministically.
4. Validate against prior contracts and current runtime: cross-check `context-visual-std1-contract.json` against `task-context-spec1-contract.json`, cite `TASK-CONTEXT-RUNTIME-1` proof as runtime baseline only, and record any implementation gaps as named follow-up instead of silently claiming they are solved.
5. Run validators and lead-review cycle: run acceptance tests, assign lead review, record round 1, apply corrections, run round 2, and stop if review finds incomplete source-output parity rules, insufficient student-facing rendered-output criteria, or scope drift into source reconstruction.
6. Close publication state: update roadmap rows and result artifacts, refresh maps/indexes/dashboard as required, run final validators, fetch/prune remote state, commit and push unless a blocker is recorded with exact dirty status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CONTEXT-VISUAL-STD-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js CONTEXT-VISUAL-STD-1
node build-scripts/sprints/check-context-visual-std1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js CONTEXT-VISUAL-STD-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/CONTEXT-VISUAL-STD-1-result.md
node build-scripts/sprints/check-sprint-bundle.js CONTEXT-VISUAL-STD-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof must include the visual standard, visual contract JSON, deterministic checker, command-log evidence for every passed acceptance test in the result JSON, planning review, lead-review assignment/round 1/corrections/round 2 artifacts, result and diff summary files, clean protected-reference and generated-output boundary notes, and refreshed roadmap/map/index/dashboard evidence. The sprint can close only when the complete bundle validator accepts the closure state.

## Rollback plan

If the standard or checker fails validation or review, remove only the `CONTEXT-VISUAL-STD-1` sprint artifacts and checker, leave `TASK-CONTEXT-SPEC-1` and `TASK-CONTEXT-RUNTIME-1` intact, restore roadmap rows to open if they were changed, and record the blocker. Do not mutate protected references, source-data, or lesson output as a rollback shortcut.

## Human review required

No human review gate is required for this standard-setting sprint. A lead-review cycle is required before sprint closure. Human review remains required for later generated student-facing source reconstruction, route adoption, or target-equivalent proof gates when those plans call for it.

# Sprint B2-READY-1: Book 2 Section 2.1 Readiness Gate

## Goal

Start the Book 2 print-production series with a short readiness gate for Chapter 2.1. The sprint must put Book 2 section 2.1 on the active textbook-production roadmap, document the production brief, inspect the target exercises for 2.1.1 through 2.1.4, define the notation and graph contract, and extract the Book 1 style rules needed before writing printed textbook output.

## Context

Book 2 is the correct next textbook target because the active v5 blueprint places costs, revenue, break-even, and marginal concepts in Book 2 after those topics were removed from Book 1 print. The pasted start plan asks for a readiness gate before production: first `B2-READY-1`, then a Chapter 2.1 Part A vertical slice, then a retrospective.

This sprint is planning and readiness only. It may create roadmap, sprint, and readiness evidence. It must not write generated lesson output or edit target-exercise source records.

## Quality Standard

The readiness evidence must satisfy the active specification, maintain the quality floor for printed textbook production, and name what later rendered output must prove. Every student-facing requirement for the next production sprint must trace to target-exercise evidence, build contracts, or an explicit gap. Closure proof must include validator results, a readiness decision, and concrete follow-up ownership for any non-final target, notation, graph, or style issue.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Add a textbook-production roadmap under `docs/roadmaps/textbook/` and register it in the roadmap index. | `docs/roadmaps/textbook/textbook-production-roadmap.md`, `docs/roadmaps/roadmap-version-index.json`, and `docs/roadmaps/roadmap-version-index.md`. | Roadmap index checker passes; active sprint ledger contains `B2-READY-1`. | include_now |
| Put the Book 2 print series on the roadmap. | Roadmap section naming `B2-READY-1`, `B2-2.1-A`, and `B2-2.1-RETRO`. | Reviewer can see the series order and lane separation. | include_now |
| Start the first sprint. | `reports/sprints/B2-READY-1-plan.md`, baseline, readiness brief, result stub, diff summary, command log, and sprint JSON metadata. | Sprint plan checker and planned-bundle checker pass. | include_now |
| Inspect target readiness for 2.1.1 through 2.1.4. | Readiness brief table showing migrated targets and the 2.1.4 placeholder. | Exit decision names exact target gaps. | include_now |
| Keep companion/product proof separate from textbook production. | Roadmap lanes and sprint guardrails state that companion/product proof does not block Book 2 Part A unless a direct printed-output blocker is found. | Scope-language and reviewer checks confirm no product-use authorization. | include_now |

## Quality Improvement Candidates

| Candidate | Classification | Rationale |
|---|---|---|
| Record the 2.1.4 placeholder as the primary target gap. | include_now | It directly affects whether the Chapter 2.1 vertical slice can close as final printed textbook output. |
| Improve the sprint bundle checker so active textbook roadmap ledgers are accepted. | include_now | The existing checker only knew the reference-team roadmap; the new roadmap needs deterministic validation. |
| Replace the 2.1.4 target exercise during readiness. | defer_named_follow_up | That is a content-design decision for `B2-2.1-A` or a dedicated target-review sprint, not this readiness packet. |
| Build Book 2 paragraph PDFs during readiness. | defer_named_follow_up | Rendered output belongs to the vertical-slice sprint after readiness. |
| Start broad companion scaling or product-wide proof. | reject_scope_creep | The pasted plan keeps companion/product proof separate and non-blocking for Book 2 Part A. |

## Allowed paths

- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/B2-READY-1-*.md`
- `reports/sprints/B2-READY-1-command-log.jsonl`
- `references/data/sprints/B2-READY-1.plan.json`
- `references/data/sprints/B2-READY-1.result.json`
- `build-scripts/sprints/check-sprint-bundle.js`
- `build-scripts/sprints/check-scope-language.js`

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No edits to protected reference data, target-exercise source records, external-source records, generated lesson output, or generated PDFs.
- No writes in `../4veco-lessen/` during this readiness sprint.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, product-wide use, or broad companion scaling authorization.

## Inputs

- Pasted start plan from the user, attached as `C:/Users/meije/.codex/attachments/43fd1296-fc97-47ad-8cec-dce0ae699956/pasted-text.txt`.
- `../4veco-lessen/course_blueprint_v5.md`
- `references/authored/course-target-exercises.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- Existing sprint standards in `docs/sprints/README.md` and `build-scripts/sprints/`.

## Outputs

- Active roadmap: `docs/roadmaps/textbook/textbook-production-roadmap.md`
- Textbook sprint ledger: `docs/roadmaps/textbook/sprint-ledger.md`
- Textbook end-state draft: `docs/roadmaps/textbook/textbook-end-state.md`
- Updated roadmap index files: `docs/roadmaps/roadmap-version-index.json` and `docs/roadmaps/roadmap-version-index.md`
- Sprint plan: `reports/sprints/B2-READY-1-plan.md`
- Sprint baseline: `reports/sprints/B2-READY-1-baseline.md`
- Readiness brief: `reports/sprints/B2-READY-1-readiness-brief.md`
- Sprint result stub: `reports/sprints/B2-READY-1-result.md`
- Sprint diff summary: `reports/sprints/B2-READY-1-diff-summary.md`
- Sprint metadata: `references/data/sprints/B2-READY-1.plan.json` and `references/data/sprints/B2-READY-1.result.json`

## Operationalized sprint procedure

1. Read the pasted start plan, active v5 blueprint, target-exercise records, product-boundary specification, and build contracts. Stop if Book 2 is not confirmed as the active v5 location for costs, revenue, break-even, and marginal concepts.
2. Create the textbook-production roadmap and register it in the roadmap index. Validate that the active sprint ledger contains `B2-READY-1` before relying on the sprint bundle checker.
3. Create the sprint plan, baseline, readiness brief, result stub, diff summary, and sprint metadata. Keep all source records read-only.
4. Inspect target readiness for 2.1.1 through 2.1.4. If any target is non-final or placeholder-backed, record the exact decision needed before production closure.
5. Define the notation/graph contract and Book 1 style extraction. Treat these as acceptance criteria for `B2-2.1-A`, not as generated output.
6. Run validators. If the roadmap index, sprint plan, planned bundle, active-scope language, or diff checks fail, fix the readiness packet and rerun. Human review is not required to start the sprint, but lead review is required before sprint closure and before starting `B2-2.1-A` as final production.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/B2-READY-1-plan.md
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/sprints/check-sprint-result.js reports/sprints/B2-READY-1-result.md
node build-scripts/sprints/check-sprint-bundle.js B2-READY-1
git diff --check
```

## Proof Required to Close

Closure proof requires a green sprint plan checker, roadmap index checker, active-scope language checker, sprint result checker, planned-bundle checker, and whitespace diff check. It also requires a lead-review record before closure. The close decision must say either that 2.1 is production-ready or name the exact target gaps to resolve in `B2-2.1-A`.

## Rollback plan

Remove the new roadmap, remove its roadmap-index entries, restore the sprint checker changes, and delete the `B2-READY-1` sprint artifacts. Because this sprint does not modify protected reference data or generated lesson output, rollback is limited to roadmap, tooling, and sprint evidence files.

## Human review required

No human review is required to start this readiness sprint. Lead review is required before sprint closure and before treating Chapter 2.1 as production-ready.

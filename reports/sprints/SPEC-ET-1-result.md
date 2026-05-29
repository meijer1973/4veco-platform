# Sprint SPEC-ET-1: Result

Date: 2026-05-29

Status: completed.

## Plan reference

Plan: `reports/sprints/SPEC-ET-1-plan.md`

## Summary

SPEC-ET-1 completed the requested cross-repo specification correction. The
lesson product end state now defines the exit ticket as a paragraph
target-equivalent proof task, not merely a readiness-to-try check. The
companion specification now separates checkpoint-only completion copy from
`GATE-L1.7B-Q2` approved target-equivalent completion copy and keeps all
grade, mastery, diagnostic, adaptive, sequencing, summative, AI, PV, Scale
Gate 1, and product-use claims blocked.

The roadmaps now add `EX-LESSON-1`, frame `GAME-UX-3A` as the shared task-type
UI for target-equivalent exit tickets, graph/table practice, math/calculation
practice, and exam-style answer-form requirements, rename/revise
`L1.7B-Q2` and `GATE-L1.7B-Q2` around target-equivalent proof, and keep Scale
Gate 1 blocked unless target-equivalent status is proven or explicitly waived
with checkpoint-only consequences.

No generated lesson output, engine code, protected reference mutation,
candidate storage, candidate writes, target-exercise mutation, projection
refresh, diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV projection, PV machine promotion, Scale Gate 1, or
student/product use was authorized.

## Acceptance test results

| Command | Status | Notes |
|---|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SPEC-ET-1-plan.md` | passed | Sprint plan format and quality-standard requirements passed. |
| `node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1` | passed | Planned bundle passed after roadmap row was added. |
| `node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1 --complete` | passed | Complete bundle passed after result and diff records were added. |
| `node build-scripts/references/check-roadmap-version-index.js` | passed | Roadmap version index validates with active v3.14 and archived v3.13. |
| `npm.cmd run check:scope-language` | passed | Active surfaces pass restricted-scope-language checks. |
| `node build-scripts/sprints/emit-url-index.js --check` | passed | URL index is current. |
| `node build-scripts/reports/validate-report-json.js` | passed | Report JSON contract passed. |
| `node build-scripts/references/check-source-manifest.js` | passed | Source manifest passed after refresh. |
| `node build-scripts/references/check-document-inventory.js` | passed | Document inventory passed after refresh. |
| `node build-scripts/references/check-source-document-registry.js` | passed | Source-document registry passed after refresh. |
| `rg -n "target-equivalent\|SPEC-ET-1\|EX-LESSON-1\|GAME-UX-3A\|L1\\.7B-Q2\|GATE-L1\\.7B-Q2\|Scale Gate 1" ..\4veco-lessen\specifications ..\4veco-lessen\lessen-team-roadmap.md references\reference-team-roadmap.md` | passed | Required terms are present in specs and roadmaps. |
| `powershell -NoProfile -Command "if (rg -n 'ready to try\|klaar om de eindopgave te proberen\|target-exercise-readiness complete' ..\4veco-lessen\specifications\product-end-state.md ..\4veco-lessen\specifications\companion-core-specifications.md) { exit 1 } else { exit 0 }"` | passed | No stale readiness-to-try completion phrasing remains in the active specs. |
| `git diff --check` | passed | Platform diff whitespace check passed. |
| `git -C ..\4veco-lessen diff --check` | passed | Lesson diff whitespace check passed. |

## Changed files

Platform:

- `reports/sprints/SPEC-ET-1-plan.md`
- `reports/sprints/SPEC-ET-1-baseline.md`
- `reports/sprints/SPEC-ET-1-planning-review.md`
- `reports/sprints/SPEC-ET-1-result.md`
- `reports/sprints/SPEC-ET-1-diff-summary.md`
- `references/data/sprints/SPEC-ET-1.plan.json`
- `references/data/sprints/SPEC-ET-1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.13-mtu-h4a-answer-form-cli-mutation-plan.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated repository maps, inventories, source registries, GitHub indexes,
  and internal dashboard files refreshed for remote navigation

Lesson:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SPEC-ET-1/SPEC-ET-1-sprint-plan.md`
- `../4veco-lessen/archive/sprints/SPEC-ET-1/SPEC-ET-1-closure-log.md`

## Data integrity notes

No protected reference data changed. There were no hand edits to
`references/machine/` or `references/external/`. No generated lesson output,
engine source, candidate storage, candidate records, target-exercise records,
or generated projections were changed. The pre-existing untracked
`knowledge/exit-ticket-game-1.1.1.zip` was left untouched and untracked.

## Open follow-ups

- Run `GATE-MTU-H4A` before any answer-form execution planning proceeds.
- Run `EX-LESSON-1` before official-exam target paragraphs or exit tickets are
  treated as student-route complete.
- Implement `GAME-UX-3A` before `L1.7B-Q2` attempts target-equivalent
  generated output.
- Run `GATE-L1.7B-Q2` before target-equivalent paragraph-completion copy is
  used in generated student output.

## Rollback instructions

If SPEC-ET-1 is rejected, roll back only the SPEC-ET-1 sprint records,
specification wording changes, lesson/platform roadmap updates, roadmap
version archive/index updates, and generated maps/inventories/indexes. Do not
touch protected reference data, generated lesson output, engine code, or the
pre-existing untracked zip.

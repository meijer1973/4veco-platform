# Sprint MIXED-OPGAVEN-TARGET-STANDARD-1: Result

## Plan reference

Plan: `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md`

## Summary

Closed PASS. The sprint created a reusable `gemengde_opgaven` target standard,
audited 2.1.4 against the product end-state for printed Book 2 Chapter 2.1, and
replaced the placeholder-backed 2.1.4 target with a reviewed-final mixed
transfer target.

The accepted 2.1.4 target consolidates 2.1.1 through 2.1.3 without introducing
new theory. It requires students to read richer contexts, choose source
information from text/table material, combine total, average, break-even, and
marginal reasoning, and write structured economic conclusions. The student
source now includes compact answering-skill guidance for calculations, tables,
graphs, and explanation questions.

REV-STD-1 closure found no missing core requirement. The only carried item is
continued monitoring of the existing Chapter 2.1 PDF-size warning during later
print assembly; it does not block this target-standard sprint.

## Acceptance test results

| Command | Status |
|---|---|
| `powershell -NoProfile -Command "python '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/build_pdf.py'"` | passed |
| `powershell -NoProfile -Command "python '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/build_chapter.py'"` | passed |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MIXED-OPGAVEN-TARGET-STANDARD-1` | passed |
| `node build-scripts/sprints/check-scope-language.js --active` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node scripts/check-course-target-exercises-v5.js` | passed |
| `npm.cmd test -- scripts/tests/check-course-target-exercises-v5.test.js` | passed |
| `powershell -NoProfile -Command "node scripts/validate-paragraph.js --mode part-a --profile publisher-print '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven'"` | passed |
| `powershell -NoProfile -Command "node scripts/validate-chapter.js '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten'"` | passed with one warning: Chapter PDF size 430 KB |
| `powershell -NoProfile -Command "node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus'"` | passed |
| `git diff --check` | passed with line-ending warnings only |
| `git -C ../4veco-lessen diff --check` | passed after normalizing rebuilt generated text artifacts |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MIXED-OPGAVEN-TARGET-STANDARD-1 --complete` | passed |
| Lead review round 1 and round 2 | passed |

## Changed files

Platform governance, target, and validation files:

- `references/authored/gemengde-opgaven-target-standard.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `scripts/check-course-target-exercises-v5.js`
- `scripts/tests/check-course-target-exercises-v5.test.js`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-review-evidence.md`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-command-log.jsonl`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-command-log.md`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-result.md`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-diff-summary.md`
- `references/data/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1.result.json`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`

Lesson output and mirrored metadata:

- `../4veco-lessen/course_blueprint_v5.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/_chapter-plan.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/`

## Data integrity notes

Protected reference data changed under the authorized sprint scope:
`references/authored/course-target-exercises.json`,
`references/authored/gemengde-opgaven-target-standard.md`, and
`references/owned/course-blueprint-v5.md`. No files under
`references/machine/` or `references/external/` were changed.

Generated lesson output changed only because the 2.1.4 student source changed
and the paragraph/chapter builders were rerun. The sprint does not authorize
Chapter 2.2 production, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, product-wide use, or broad companion scaling.

## Open follow-ups

- Apply the mixed-opgaven target standard to future mixed records before any
  reviewed-final promotion.
- Continue monitoring the existing Chapter 2.1 PDF-size warning during later
  print assembly. This is non-blocking because validators pass and asset checks
  resolve.

## Rollback instructions

Restore the changed platform target/blueprint/validator files and remove the
`MIXED-OPGAVEN-TARGET-STANDARD-1-*` result/review artifacts if the sprint must
be rolled back. In `../4veco-lessen`, restore the mirrored blueprint, 2.1.4
source/review metadata, and regenerated Chapter 2.1 output files to the prior
commit. Do not touch `references/machine/` or `references/external/`; this
sprint did not change them.

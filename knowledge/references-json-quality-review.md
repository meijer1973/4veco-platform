# References JSON Quality Review

Date: 2026-04-21

Scope: read-only review of the three JSON files under `references/`:

- [references/external/exam-questions.json](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json)
- [references/external/syllabus-eindtermen.json](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json)
- [references/machine/micro-teaching-units.json](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.json)

I evaluated them for JSON integrity, structural consistency, cross-file traceability, and how trustworthy they are as canonical machine-readable references.

Note: these files are UTF-8 without BOM. Node reads them correctly; Windows PowerShell `Get-Content` can display some accented characters as mojibake. I did not count that shell-display issue as a defect in the JSON content itself.

## Findings

1. High: `exam-questions.json` is still the weakest of the three because annotation coverage is materially incomplete.

   The repo’s intended audit surface says each question row should carry required skills, question type, and referenced eindtermen ([references/external/exams/README.md:40](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:40), [references/external/exams/README.md:41](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:41), [references/external/exams/README.md:42](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:42)). Structurally, the file is solid, but semantically it is not finished.

   Current state from a read-only parse:
   - `question_type`: 349 / 349 populated
   - `required_skills`: 322 / 349 populated
   - `exam_codes`: 210 / 349 populated
   - 120 rows have non-empty `required_skills` but still no `exam_codes`
   - 49 of those 120 rows already cite at least one non-A skill, so this is not just the expected “A-skill has no A-code” limitation

   Representative example: question 16 in `ha-1022-a-23-1-o` cites skill `I01` but still has an empty `exam_codes` array at [references/external/exam-questions.json:296](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:296), [302](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:302), [305](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:305).

   Impact: the file is already useful for question-type analysis and skill back-linking, but still incomplete for reliable exam-program coverage and syllabus-traceability reporting.

2. Medium: cross-file traceability is valid where present, but the contract is still only partially closed.

   On the positive side, the three files now line up structurally:
   - every populated `exam_codes` value in `exam-questions.json` resolves to a real syllabus code
   - every populated `required_skills` value in `exam-questions.json` resolves to a real unit ID
   - `micro-teaching-units.json` has no unresolved `needs` and no unresolved `exam_codes`

   The remaining gap is scope and coverage, not validity. `syllabus-eindtermen.json` now looks structurally clean and includes the previously missing `I3.*` block, for example [references/external/syllabus-eindtermen.json:1672](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1672) and [references/external/syllabus-eindtermen.json:1777](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1777). But it still only covers domains `D`–`I`; it contains no `A`, `B`, `C`, `J`, or `K` codes.

   That may be correct for CE scope, but it means the JSON trio does not yet form a fully explicit end-to-end contract for all skill traceability. In practice the system stays valid by leaving many `exam_codes` blank rather than by fully closing the mapping layer.

3. Low: `micro-teaching-units.json` is structurally the strongest file, but still has optional-link backlog.

   I ran the repo’s own validator in read-only mode via `build-unit-index.js`; it returned 0 errors. The file has:
   - 144 units
   - 0 unresolved `needs`
   - 0 unresolved `exam_codes`
   - 0 missing `procedure` fields for `apply` / `analyze` / `evaluate` units

   The remaining issues are coverage-oriented rather than integrity-oriented:
   - 27 of 107 non-A units still have no `exam_codes`
   - 37 of 107 non-A units still have no `needs`
   - one non-A unit, `D09`, still has an empty `terms` array at [references/machine/micro-teaching-units.json:1295](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.json:1295) and [1309](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.json:1309)

   Impact: this JSON is already reliable as a machine-consumed catalog, but some of the richer canonical cross-links are still backlog rather than complete coverage.

## File-by-File Assessment

- `syllabus-eindtermen.json`
  Strength: strongest external reference JSON right now. It parses cleanly, has 126 entries, includes `I3.*`, and no longer shows the obvious section-bleed issues from the earlier extraction.
  Residual caveat: scope is still `D`–`I` only, which is fine if intentional, but that boundary is not obvious from the JSON alone.

- `exam-questions.json`
  Strength: structurally much better than before. It now includes `page_start` / `page_end`, has no duplicate `(exam, question_num)` keys, and all populated references resolve.
  Main weakness: annotation completeness still lags the structure.

- `micro-teaching-units.json`
  Strength: best overall quality of the three. It is internally coherent and validator-clean.
  Residual caveat: still some optional canonical links missing, mainly `exam_codes`, `needs`, and one remaining non-A `terms` gap.

## Bottom Line

These three JSON files are no longer equally problematic.

- `micro-teaching-units.json` is production-strong.
- `syllabus-eindtermen.json` is now structurally solid and much healthier than before.
- `exam-questions.json` is the remaining weak link: not because its schema is bad, but because its annotation layer is still incomplete enough to limit downstream coverage proofs and audit reports.

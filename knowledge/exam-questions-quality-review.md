# `exam-questions.json` Quality Review

Date: 2026-04-20

Scope: read-only review of [references/external/exam-questions.json](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json) as the structured register of real CvTE exam questions. I checked it against its intended role in [build-scripts/references/extract-exam-questions.js](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:5), [references/external/exams/README.md](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:38), and the repo’s own recap claim that this file is “349 structured questions, all annotated” in [knowledge/session-recap-micro-teaching-units.md:97](/C:/Projects/4veco/4veco-platform/knowledge/session-recap-micro-teaching-units.md:97) and [knowledge/session-recap-micro-teaching-units.md:121](/C:/Projects/4veco/4veco-platform/knowledge/session-recap-micro-teaching-units.md:121).

## Findings

1. Critical: the `text` field is still contaminated by PDF extraction garbage, so this is not yet a clean canonical question corpus.

   Representative rows still contain page headers, page counts, `lees verder`, end markers, or source-note boilerplate inside the question text itself. Examples: [references/external/exam-questions.json:44](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:44), [references/external/exam-questions.json:92](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:92), [references/external/exam-questions.json:236](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:236), [references/external/exam-questions.json:495](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:495), [references/external/exam-questions.json:1006](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:1006), and [references/external/exam-questions.json:5854](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:5854).

   A read-only probe of the committed JSON found:
   - 106 / 349 rows with page-artifact strings such as exam code + page count + `lees verder`
   - 12 / 349 rows with `Bronvermelding`
   - 13 / 349 rows with `einde`
   - 44 rows with private-use glyphs such as `` or ``
   - 1 row with a broken-image placeholder message (`De gekoppelde afbeelding kan niet worden weergegeven`) at [references/external/exam-questions.json:236](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:236)

   Impact: the file is structurally valid JSON, but the primary payload is noisy enough to weaken search, quoting, clustering, prompt-building, and any future text-based audit logic.

2. High: the annotation layer is still incomplete, despite repo docs describing this table as fully annotated.

   The intended audit surface is explicit: each row should carry required skills, question type, and referenced eindtermen ([references/external/exams/README.md:40](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:40), [references/external/exams/README.md:41](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:41), [references/external/exams/README.md:42](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:42)). The current file is only complete on `question_type`.

   Current state from a read-only parse:
   - `question_type`: 349 / 349 populated
   - `required_skills`: 322 / 349 populated
   - `exam_codes`: 146 / 349 populated

   The more important problem is not just emptiness, but missing syllabus traceability on already-annotated rows. 113 rows already cite non-empty skill mappings but still have empty `exam_codes`. Representative examples: [references/external/exam-questions.json:12](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:12), [references/external/exam-questions.json:17](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:17), [references/external/exam-questions.json:61](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:61), [references/external/exam-questions.json:65](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:65), [references/external/exam-questions.json:205](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:205), [references/external/exam-questions.json:209](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:209).

   Impact: the file is already useful for question-type analysis, but it is still incomplete for reliable exam-program coverage and end-to-end syllabus traceability.

3. Medium: the row schema is good for indexing, but weak for auditability because it omits source-location metadata.

   The extractor’s row shape includes `exam`, `opgave_num`, `question_num`, `points`, `text`, `required_skills`, `question_type`, and `exam_codes`, but no page number, PDF span, or source offset ([build-scripts/references/extract-exam-questions.js:13](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:13), [build-scripts/references/extract-exam-questions.js:23](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:23), [build-scripts/references/extract-exam-questions.js:24](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:24), [build-scripts/references/extract-exam-questions.js:25](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:25), [build-scripts/references/extract-exam-questions.js:26](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:26)).

   On a clean corpus this would be acceptable. On a corpus whose `text` field still contains page junk and end-of-exam boilerplate, it makes repair and manual verification unnecessarily slow because the row itself does not tell you where to look in the source PDF.

## Strengths

- The JSON parses cleanly and the object shape is consistent across all 349 rows.
- Coverage is broad: 12 exams across havo/vwo, tijdvak 1/2, and years 2023/2024/2025.
- There are no duplicate `(exam, question_num)` keys.
- `question_type` is fully populated.
- Every populated `required_skills` entry resolves to an existing unit ID, and every populated `exam_codes` entry resolves to the current syllabus register.

## Bottom Line

`exam-questions.json` is already a strong indexing table, but it is not yet a high-quality canonical question text corpus. The structure and identifiers are solid; the main blockers are dirty extracted `text` and incomplete `exam_codes` coverage. If those two issues are fixed, this file becomes much more credible as the audit ground truth the repo says it is.

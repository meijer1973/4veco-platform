# Micro-Teaching Units Follow-up Review

Date: 2026-04-20

Scope: follow-up review of the two items from the prior implementation review:

1. write-path enforcement for `terms` / `exam_codes`
2. exercise/exam traceability implementation

## Findings

### 1. Critical: the new syllabus register is still incomplete, so valid `exam_codes` are lost in the audited outputs

- The intended contract is still that every `exam_codes` value resolves against `references/external/syllabus-eindtermen.json` ([references/machine/micro-teaching-units.md:51](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:51), [references/machine/micro-teaching-units.md:71](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:71), [build-scripts/references/README.md:41](/C:/Projects/4veco/4veco-platform/build-scripts/references/README.md:41), [build-scripts/references/extract-eindtermen.js:11](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-eindtermen.js:11)).
- The 2025 audit data now uses `I3.5` in both new units and question annotations ([build-scripts/references/audit-2025.json:58](/C:/Projects/4veco/4veco-platform/build-scripts/references/audit-2025.json:58), [build-scripts/references/audit-2025.json:63](/C:/Projects/4veco/4veco-platform/build-scripts/references/audit-2025.json:63), [build-scripts/references/audit-2025.json:85](/C:/Projects/4veco/4veco-platform/build-scripts/references/audit-2025.json:85), [build-scripts/references/audit-2025.json:94](/C:/Projects/4veco/4veco-platform/build-scripts/references/audit-2025.json:94)).
- In the committed `syllabus-eindtermen.json`, a read-only probe during this review found `D1.1` and `F2.4`, but not `I3.5` or `A4.1`. `Select-String` against the file returned hits for `D1.1` and `F2.4` only.
- That missing register entry is already visible in the generated output: the affected VWO 2025 questions keep their new skill IDs, but their `exam_codes` are empty in `exam-questions.json` ([references/external/exam-questions.json:5622](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:5622), [references/external/exam-questions.json:5635](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:5635), [references/external/exam-questions.json:5784](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:5784), [references/external/exam-questions.json:5791](/C:/Projects/4veco/4veco-platform/references/external/exam-questions.json:5791)).
- Result: the write-path wiring is improved, but the underlying authoritative register is still incomplete enough that valid syllabus links can disappear.

### 2. High: `apply-audit.js` silently drops invalid or unresolved `exam_codes` instead of failing the audit

- The new audit pipeline explicitly filters codes through `cleanExamCodes()` ([build-scripts/references/apply-audit.js:65](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:65), [build-scripts/references/apply-audit.js:66](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:66), [build-scripts/references/apply-audit.js:67](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:67)).
- That filtered value is then written into both minted units and question annotations ([build-scripts/references/apply-audit.js:121](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:121), [build-scripts/references/apply-audit.js:126](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:126), [build-scripts/references/apply-audit.js:175](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:175), [build-scripts/references/apply-audit.js:177](/C:/Projects/4veco/4veco-platform/build-scripts/references/apply-audit.js:177)).
- That means the pipeline can finish successfully while deleting traceability links. The `I3.5` examples above are concrete proof: the audit input contains the code, the final JSON does not.
- For a traceability feature, silent deletion is the wrong failure mode. This should fail fast, because otherwise the repo looks healthy while the exam-to-syllabus link has already been lost.

### 3. High: terminology validation is wired in now, but it still does not validate the actual canonical term list

- The write-path bug from the previous review is fixed: both `unit-add.js` and `unit-lib.js` now pass `loadTerminology()` and `loadEindtermen()` into `validate()` ([build-scripts/references/unit-add.js:195](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-add.js:195), [build-scripts/references/unit-add.js:197](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-add.js:197), [build-scripts/references/unit-lib.js:46](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-lib.js:46), [build-scripts/references/unit-lib.js:49](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-lib.js:49)).
- The remaining problem is the loader: `loadTerminology()` only indexes `##` / `###` headings ([build-scripts/references/build-unit-index.js:269](/C:/Projects/4veco/4veco-platform/build-scripts/references/build-unit-index.js:269), [build-scripts/references/build-unit-index.js:273](/C:/Projects/4veco/4veco-platform/build-scripts/references/build-unit-index.js:273), [build-scripts/references/build-unit-index.js:275](/C:/Projects/4veco/4veco-platform/build-scripts/references/build-unit-index.js:275)).
- The canonical glossary terms are stored mainly in tables, not headings. For example, `betalingsbereidheid` and `prijselasticiteit van de vraag` live under the `D1: Vraag en Aanbod` heading in table rows ([references/authored/economie-terminologie.md:18](/C:/Projects/4veco/4veco-platform/references/authored/economie-terminologie.md:18), [references/authored/economie-terminologie.md:22](/C:/Projects/4veco/4veco-platform/references/authored/economie-terminologie.md:22), [references/authored/economie-terminologie.md:27](/C:/Projects/4veco/4veco-platform/references/authored/economie-terminologie.md:27)).
- A read-only probe during this review confirmed the mismatch: the loader sees `D1: Vraag en Aanbod`, but not `betalingsbereidheid` or `prijselasticiteit van de vraag`.
- Result: the write path now calls term validation, but it still cannot enforce the glossary contract for most real terms.

### 4. High: the traceability data layer improved a lot, but the promised reporting layer is still not implemented

- There is real progress here: the repo now has an extraction pipeline for syllabus codes and exam questions ([build-scripts/references/extract-eindtermen.js:5](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-eindtermen.js:5), [build-scripts/references/extract-exam-questions.js:5](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:5), [build-scripts/references/extract-exam-questions.js:9](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:9), [build-scripts/references/extract-exam-questions.js:10](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-exam-questions.js:10)).
- But the repo still documents a broader reporting layer that does not exist in the current tree: `exercise-coverage.md`, `exam-coverage.md`, `exam-question-audit.md`, `exam-question-type-distribution.md`, `exam-vs-program-gaps.md`, `blueprint-vs-exam-gaps.md`, `exam-program-delta.md` ([reports/README.md:21](/C:/Projects/4veco/4veco-platform/reports/README.md:21), [reports/README.md:32](/C:/Projects/4veco/4veco-platform/reports/README.md:32), [reports/README.md:33](/C:/Projects/4veco/4veco-platform/reports/README.md:33), [reports/README.md:34](/C:/Projects/4veco/4veco-platform/reports/README.md:34), [reports/README.md:35](/C:/Projects/4veco/4veco-platform/reports/README.md:35), [reports/README.md:36](/C:/Projects/4veco/4veco-platform/reports/README.md:36), [reports/README.md:42](/C:/Projects/4veco/4veco-platform/reports/README.md:42), [references/external/exams/README.md:38](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:38), [references/external/exams/README.md:46](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:46), [references/external/exams/README.md:47](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:47), [references/external/exams/README.md:48](/C:/Projects/4veco/4veco-platform/references/external/exams/README.md:48)).
- During this review, `build-scripts/reports/` still contained only `dag-integrity.js`, `dead-units.js`, `terminology-drift.js`, and `unresolved-refs.js`, and `reports/` still contained only the corresponding markdown outputs plus `README.md`.
- The data also remains partial. A read-only probe of `references/external/exam-questions.json` found:
  - `question_type`: 349 / 349 rows populated
  - `required_skills`: 322 / 349 rows populated
  - `exam_codes`: 146 / 349 rows populated
- So the exam side is no longer “missing”, but the end-to-end traceability/reporting promise is still only partially implemented, and the exercise-first audit surface is still absent.

### 5. Medium: the new tests are too weak to catch the remaining contract breaks

- The live-file tests only check that `loadEindtermen()` returns a set containing a couple of known codes and that `loadTerminology()` returns any non-empty set ([engines/tests/micro-teaching-units.test.js:485](/C:/Projects/4veco/4veco-platform/engines/tests/micro-teaching-units.test.js:485), [engines/tests/micro-teaching-units.test.js:493](/C:/Projects/4veco/4veco-platform/engines/tests/micro-teaching-units.test.js:493), [engines/tests/micro-teaching-units.test.js:495](/C:/Projects/4veco/4veco-platform/engines/tests/micro-teaching-units.test.js:495), [engines/tests/micro-teaching-units.test.js:498](/C:/Projects/4veco/4veco-platform/engines/tests/micro-teaching-units.test.js:498), [engines/tests/micro-teaching-units.test.js:503](/C:/Projects/4veco/4veco-platform/engines/tests/micro-teaching-units.test.js:503)).
- Those assertions would still pass if the register were missing all `A*` codes, all `I3.*` codes, and most glossary terms, which is exactly the failure mode now visible in the generated data.

## Verified Improvements

- The previous write-path bug is genuinely fixed. `unit-add` and `unit-lib.saveCatalog()` now validate with both terminology and eindterm loaders before writing ([build-scripts/references/unit-add.js:195](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-add.js:195), [build-scripts/references/unit-add.js:198](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-add.js:198), [build-scripts/references/unit-lib.js:49](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-lib.js:49), [build-scripts/references/unit-lib.js:50](/C:/Projects/4veco/4veco-platform/build-scripts/references/unit-lib.js:50)).
- The repo now includes the raw sources needed for the traceability work: syllabus extraction, exam-question extraction, audit application, and multi-year exam PDFs.
- Question-type traceability is materially better than before. In the current `exam-questions.json`, every row now has a `question_type`.

## Verification Run

- `node node_modules/jest/bin/jest.js --runInBand engines/tests/micro-teaching-units.test.js`
  - Passed: 62 / 62 tests
- `node build-scripts/reports/dag-integrity.js`
  - Passed: `OK  144 units validated`

## Bottom Line

The two headline improvements are real, but only one is substantively closed:

- Write-path validation is now wired correctly, but still weakened by incomplete loaders and incomplete machine references.
- Exam traceability is no longer absent, but it is still lossy and still missing the reporting layer that the plan and docs promise.

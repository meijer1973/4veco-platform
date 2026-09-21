# Interim independent source review — exercise routes

Reviewer: `review_book2`; author: `codex-root`; date: 2026-09-21. Review is read-only in both repositories. Historical Book 2 correction review is unchanged. This report covers shared authoring instructions, the contract checker/tests, and the bounded Books 3/4 outline amendment. It does not accept current rendered books or confer paragraph, target, companion, publication, or merge approval.

Inputs are the 16 platform files recorded in `interim-source-review-inputs.json`, exact-byte SHA256 manifest `ec52aaef1a12d40cbc292ababbb9263f63871ec70c553a9848c10f5b4b5419e2`. Baseline is platform commit `6298466b03fa5ddb38a72ceb157a4855494e45d8`. Any later substantive edits need scoped reinspection.

## Findings and disposition

No unresolved finding remains in this interim source scope.

R1, resolved: the initial exercise-builder exception said “mixed-practice and revision paragraphs,” while this skill otherwise uses revision to mean editing an existing exercise/theory paragraph. That could be read as permission to drop the theory-stage requirements on any revision. The author now names mixed-practice/consolidation and test-preparation paragraphs explicitly. The reviewer skill explicitly states that revising a theory paragraph does not exempt it from the theory contract. I inspected both repaired passages.

## Route, timing, and pedagogy checks

The exercise-builder is the operational owner. It presents the normal route first and includes guided practice before independent practice and the same target. The challenging route has less intermediate support and continues to the bonus. Repetition remains additional to both. The start check cannot select a route through a score threshold or automatic decision. The printed Dutch guidance is concise, learning-focused, and does not open the guided section by encouraging students to skip it.

The normal whole-lesson equation now includes actual guided questions alongside motivation, instruction, worked example, summary/transitions, start, independent, and target work. Recommended ranges are explicitly not feasibility evidence. Future sets must be designed around the complete supported route; existing books retain their exercises/targets and report genuine timing conflicts or additional lesson time. The challenging route is estimated separately with its bonus. Detailed estimates remain teacher-facing.

The didactic reference/skill, textbook skill, chapter assembler, review skill, paragraph-plan template, and lane closure guidance point to this owner rather than retaining their old competing short route. The assembler now correctly retains printed Part A guided practice inside the chapter. The applicable consolidation/test-preparation formats are preserved. Target alignment, target answer form, fading, no-new-theory repetition, paper-only usability, and Book 1 freeze safeguards remain in place.

Part B's `Start -> Leer -> Check -> Oefen -> Exit ticket` remains a separate explicitly bounded product contract. No Part B source or runtime was changed by the inspected diff. The contract checker retains its previous stage, alignment, visual-production boundary, paper-only, digital-dependency, target-preservation, severity, Book 1, and Part A/Part B checks; route-specific checks are revised to the new user contract. The paragraph-plan caller is added to its source/link coverage.

## Books 3/4 amendment checks

`books34-route-amendment.js` derives the current outline from the immutable transport input after the historical parser checks the input identity. It replaces exactly four identified non-structural working-design paragraphs, retains the target-link projection, and compares the complete resulting outline with the current file. It verifies the exact named amendment revision, canonical contract pointer, and current outline hash. The selected-structure hook accepts that named amendment while retaining paragraph/chapter counts, every structural row, original identity, and both non-approval boundaries.

The implementation does not relax or repin the historical migration/transport receipt. It returns the received structural rows, rather than parsing altered current prose into new authority. The route amendment acknowledges existing overloads without authorizing a split, merger, exercise deletion, or target deferral. Original metadata provenance is preserved and its current-projection description is updated accurately.

I independently ran 13 fixture probes in `probe-route-amendment.cjs`, outside both repositories. All passed. They establish exact equality of the 31 received structural rows and rejection of unrelated current prose changes, a structural edit even with a refreshed current hash, changed transport content, an unknown amendment revision, a changed contract pointer, stale hash, removed amendment metadata, changed paragraph metadata, changed chapter counts, new target approval, new companion acceptance, and unknown structural revision. Results and code/input hashes are in `amendment-probe-results.json`. The fixture is review evidence, not a repository edit.

## Executed verification

- `node build-scripts/workflows/check-part-a-exercise-authoring-contract.js`: exit 0; 11 platform source surfaces accepted.
- `node node_modules/jest/bin/jest.js --runInBand --runTestsByPath build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js`: exit 0; 69 tests passed.
- `node review/probe-route-amendment.cjs`: exit 0; 13 independent probes passed.
- Manual diff/source inspection of all 16 bound inputs, including final R1 wording repair.

The focused Jest run predates the final R1 wording clarification; the clarification changes neither code nor strings checked by these tests, and was inspected directly. It must be included in the author's final check run.

## Remaining review

The build tools, current lesson manuscripts/route records, generated outputs, preservation evidence, complete package provenance transition, teacher estimates, all changed rendered pages and pagination neighbours, and final manifest binding remain for the final review. This report makes no final artifact PASS claim and does not certify 55-minute classroom feasibility.

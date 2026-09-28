# Independent review of Books 3/4 follow-ups

Reviewer: `review_b34_followups`; author: `codex-root`; date: 2026-09-28.
Review scope: the owner-requested NAV1 repair, corrected §3.2.3 answer heading, and teacher-facing planning recommendations. Repository implementation and publications were read-only for the reviewer. Reviewer scratch evidence is under `review/followups/` outside both repositories.

Accepted baseline: Platform `1761cb96ef25da67b7830fade96e17d7a4db53ac`; Lessons `794cd54fe68f9b9a1bb413462373a133a459345c`. The prior signed-retrieval independent review and per-paragraph reports, plus their named route-review evidence, are reused for unchanged content. This is a bounded current-delta review, not a new full paragraph/curriculum or target approval.

Review manifest SHA256: `a0109495ab7cae046493a78d18b6c5ad22e4673663675b1232eba9d9aaae1814`

All 1,480 inventory files and lengths, 42 changed lesson paths, 16 manifest-bound platform inputs, final render source hashes and the committed/staged candidate were independently checked. Reviewed lesson commit: `c20ad77a165e97fe55a3da6ac6666cc151533ee5`.
Implementation/evidence inventory: [independent-evidence.json](independent-evidence.json), SHA256 `b8f69d3c64b2b58cd875574192d5b342a1cbdd8023fc240ac016cc8f7ea61bb4`. It binds all 21 reviewed new/changed implementation, test, workflow, documentation and exact-pair pin files independently of the publication manifest; final platform commit containment remains the author’s closure check.

## 1. Review and evidence

### Sources, teaching and student perspective

Independent source comparison confirms seven changed sources: one exact PAGE-title replacement in the 3.2 answer manuscript, and timing-only changes in six teacher manuscripts. All 25 theory-paragraph bodies outside the planning block remain exact; the six mixed-practice paragraph bodies remain exact. The immutable lesson-route JSON retains its normal and challenging route exercise identities, additional repetition and unknown complete timing totals. All five previously heavy paragraphs remain specifically identified: 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5.

The recommendation provisionally reserves two 55-minute lessons and explicitly disclaims a measured or proven 110-minute fit. It names start exercises, motivation, explanation, worked example, summary/transitions and guided practice for the first session, then permits remaining guided practice before independent work, the full target and feedback. Actual exercise numbers are preserved for every theory paragraph. Teachers are told to record actual phase times, adapt to their class, keep extra carry-over for the five heavy cases, and budget the challenging route separately including its bonus. No support, target operation, question, answer or learning goal is removed. Mixed-practice paragraphs keep their own structure. Curriculum allocation remains distinct from classroom reservation.

From the teacher perspective this is usable planning advice with honest uncertainty, matching the owner's narrowed request; it is not a certified lesson-time budget. From the typical-student perspective the paper route and exercise content remain unchanged, and the answer heading now identifies the actual two exercises. Guided practice remains normal, the challenging route keeps bonus, and repetition remains additional. No new digital dependency or automatic route choice is introduced. This review does not claim that every class completes either lesson within its allotted time.

### Explicit paragraph delta coverage

Every row below was checked against the actual teacher manuscript and rendered complete teacher book. Theory rows include comparison of all named exercise groups with the unchanged route record. Mixed rows include byte-equivalent paragraph content and retained exceptions. Earlier accepted content/economics review is reused for untouched exercise material; §3.2.3 additionally includes the answer-heading and neighbour-page checks.

| Paragraph | Rendered teacher page | Reviewed delta |
|---|---|---|
| 3.1.1 | Book 3, p. 4 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.1.2 | Book 3, p. 5 | Timing-only recommendation; normal-route numbers checked; extra carry-over retained. |
| 3.1.3 | Book 3, p. 6 | Timing-only recommendation; normal-route numbers checked; extra carry-over retained. |
| 3.1.4 | Book 3, p. 7 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.1.5 | Book 3, p. 8 | Timing-only recommendation; normal-route numbers checked; extra carry-over retained. |
| 3.1.6 | Book 3, p. 9 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |
| 3.2.1 | Book 3, p. 12 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.2.2 | Book 3, p. 13 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.2.3 | Book 3, p. 14 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.2.4 | Book 3, p. 15 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |
| 3.3.1 | Book 3, p. 18 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.3.2 | Book 3, p. 19 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.3.3 | Book 3, p. 20 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 3.3.4 | Book 3, p. 21 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |
| 4.1.1 | Book 4, p. 4 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.1.2 | Book 4, p. 5 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.1.3 | Book 4, p. 6 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.1.4 | Book 4, p. 7 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.1.5 | Book 4, p. 8 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |
| 4.2.1 | Book 4, p. 12 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.2.2 | Book 4, p. 13 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.2.3 | Book 4, p. 14 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.2.4 | Book 4, p. 15 | Timing-only recommendation; normal-route numbers checked; extra carry-over retained. |
| 4.2.5 | Book 4, p. 16 | Timing-only recommendation; normal-route numbers checked; extra carry-over retained. |
| 4.2.6 | Book 4, p. 17 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.2.7 | Book 4, p. 18 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |
| 4.3.1 | Book 4, p. 22 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.3.2 | Book 4, p. 23 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.3.3 | Book 4, p. 24 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.3.4 | Book 4, p. 25 | Timing-only recommendation; normal-route numbers checked; flexible carry-over retained. |
| 4.3.5 | Book 4, p. 26 | Mixed structure and teacher body unchanged; no forced two-lesson scheme. |

### NAV1, answer heading and rendered publication

Independent pypdf inspection resolved the source named destination arrays within each chapter, then compared raw annotation rectangles and explicit `/XYZ` destination page/coordinates with final books. This is independent of the implementation's `resolve_link()` coordinate conversion. Chapter openings preserve 28 annotations in 3.1, 19 in 3.3, 28 in 4.2 and 24 in 4.3: 99 annotations for 25 entries. Expected complete destination pages match the original navigation audit. Same-name destinations are not merged across chapters. All existing nonchapter links, including main contents, and complete-book bookmarks remain unchanged. Chapters 3.2 and 4.1 already lack such source links; this bounded restoration does not invent them.

All 298 student-book pages retain exact text and rendered pixels against the accepted merged baseline. The Book 3 complete answer book changes text only on page 51: “Herhaling 29 en 30” above exercises 29 and 30; its other 73 pages are pixel-identical to the authenticated same-environment baseline. Chapter answer page 17 and both neighbours, and complete pages 50–52, are clear. The unchanged elasticity example still yields −0.4 from −10% / 25%, and the unchanged tax calculation is (11−8)×200 = 600. Previous signed-retrieval mathematics evidence remains applicable.

Independent Poppler renders cover 60 pages: both complete teacher books (all 50 pages), the corrected chapter/complete answer pages and neighbours (6), and all four restored chapter openings (4). All ten contact sheets were inspected; full-size views additionally cover §3.1.1, all five heavy cases and the corrected answer page. Text, tables, footers, signs, page breaks, alignment, contrast and hierarchy are readable with no clipping, overlap, lost glyphs or introduced layout defects. The reviewer also checked paragraph exercise references, normal/challenging-route wording, and intact mixed-practice content in these views. Full-page PNGs and their exact source PDF hashes are recorded in `renders/coverage.json`.

The production verifier passed independently with 32 dependent publications, all 31 target payloads/statuses preserved, four current answer-source pins refreshed, current source/HTML/PDF text, complete teacher front matter, unchanged local/global pagination, all six complete assemblies and main contents links. The existing structural validator passed 598 checks with zero failures and 734 question/answer mappings. Page counts remain Book 3 132/74/22 and Book 4 166/68/28.

### Implementation, boundaries and findings

The current successor assembler differs from the sealed predecessor only by its identifying comment/import, link-preserving student-chapter insertion, and teacher-front timing note. The helper validates source destinations before append, copies without native link insertion to avoid duplicates, resolves chapter-local names and applies book offsets only to local destinations. Four independent regression runs passed for reproduced old link loss, duplicate-name namespaces and coordinate conversion, explicit/external links, and unresolved named destinations.

The builder exports and authenticates an accepted Git baseline, explicitly rebuilds chapter 3.2 answers and all six teacher chapters before assembly, and refreshes records through their owning generator. Unrelated generated dependencies return to accepted bytes only after text/navigation/pixel or exact text-file equivalence. Exact source bindings and inverse replacements prevent a newly generated manifest from blessing other source edits. Current inventory/path boundaries preserve old route, Book 2 and signed retrieval evidence, all other lesson content, held PV templates and Part B. The dispatcher supports the exact accepted signed main tree while the paired successor is reviewed separately; it does not pretend the historical pin certifies changed files.

Resolved finding: the initial verifier did not independently reject stale teacher front matter. The author added exact old/new front-HTML checks, front PDF text checks, final assembled-front text/pixel equivalence and complete teacher navigation comparison. All four positive/negative front tests pass independently, including stale HTML, stale PDF under current HTML, and stale assembled book under current front PDF. The repaired complete production verification also passed. The review's two minor wording suggestions—“Planningsadvies” and explicit summary/transitions—were included and inspected.

Independent tests completed: four link Python tests, four teacher-front Python tests, and all 49 affected JavaScript tests (including 15 current/predecessor finite-inventory regressions and the lane/paired fixtures). The importer passed `--require-tracked` with all 1,480 files. The new lane allowance is exactly the finite reviewed path set; unknown adjacent paths and Part B precedence retain negative tests.

The new paired workflow checks out exact platform/lesson heads, uses read-only GitHub permissions and pinned runtime dependencies, requires the follow-up state and committed inventory, runs the semantic assembly/navigation checks and all affected tests, validates actual changed-path lane ownership, and requires the independently authored report binding and all 31 coverage rows. The previous paired workflows/pins remain unchanged. Remote CI and final platform head verification remain the author’s subsequent closure steps; this report does not claim results from unrun remote jobs.


### Historical-gate compatibility repair after the first CI run

The first historical signed-pair CI run [36407624766](https://github.com/meijer1973/4veco-platform/actions/runs/36407624766) passed exact-pair binding, the 1,477-file accepted-baseline importer, 598 structural checks and all 41 JavaScript tests, then failed only when the historical review runner invoked its sealed verifier against the intentionally changed current dispatcher. Its precise failure was a stale dispatcher input, not changed lesson material or invalid review snapshots. The reviewer independently inspected that run and confirmed that lesson `773d72a67baf2f312a961d39247045f6b172adaf` and accepted merge `794cd54fe68f9b9a1bb413462373a133a459345c` share tree `81a06b7faa9de9eebd0207e6d66f434bf0dae87d`.

The repair changes only the initial gate in `books34-signed-review.js` to the already-reviewed `acceptedSignedBaseline({root, lessons})` path. It accepts exactly the prior signed inventory and authenticates the historical dispatcher at the accepted Git commit. The subsequent six snapshot, verdict and independent digest checks are unchanged. Independent rechecking confirms all six snapshots/reviews and the old manifest retain their accepted bytes/bindings; running the repaired historical command against the current follow-up edition rejects it with `Changed accepted signed inventory`. The current 31-paragraph review checker still passes. Thus the old review cannot certify the successor publications, and no historical pin, report or snapshot was refreshed to accommodate them.

This narrow compatibility repair is accepted and bound as the 21st implementation file. All 1,480 current publication-inventory hashes were rechecked without a PDF rebuild; manifest and lesson commit remain unchanged. A direct positive invocation of the repaired historical command on its exact historical checkout remains the subsequent CI rerun, rather than an invented local result. No further source or publication change is required by this finding.

## 2. Verdict

PASS

The requested bounded follow-ups pass independent review with no unresolved finding. NAV1 source-link preservation and the answer heading are repaired; TIMING34 is fulfilled as the owner-requested teacher planning recommendation, without claiming measured timing or a proven two-lesson fit. Current file/implementation identities are bound above. Required CI and final platform commit containment remain subsequent closure checks. Candidate target states, held PV and curriculum/source authority retain their prior status. This is not a new native full-paragraph/curriculum approval, and grants no publication or merge permission.

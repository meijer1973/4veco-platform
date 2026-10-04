# Independent review · bounded textbook maintenance · 2026-10-04

## 1. Scope, independence and binding

Reviewer: `/root/review_b34_followups`, independent of the implementation author. Applied platform AGENTS, `docs/workflows/part-a-review.md`, `skills/econ-paragraph-review.md` and the graph/PDF/presentation review requirements. The reviewer authored only external scratch evidence and this report; no textbook, code, deck or historical review was edited by the reviewer.

Reviewed the eight requested current-edition repairs, their printed dependencies, three dependent presentations and the finite integration path. The accepted bases are Platform `7f924b57767838557b2dff96243e0b3ad7cbff2c` and Lessons `99c5eb4127bebfd9892b19dc0d35789d05b6344b`. Current implementation checkpoints are Platform `4275d8e6f4669aa91de02be07f73ac6cb0f302da` and Lessons `271aff27a64e74ebf272db8a761fbc3e07b025cc`. The manifest binds 30 platform and 98 lesson files; paired copies and every recorded file size/hash were independently checked. The final review and exact-head selector are intentionally excluded from that manifest to avoid a cycle.

Review manifest SHA256: `1f5214e3c6791e6dea2bcd283c78574e7d22151e9caccdeb3e717957d1139a59`

## 2. Verdict

Verdict: PASS with flags

**PASS WITH FLAGS** for the bounded content, saved artifacts and reviewed implementation. No unresolved content, calculation, preparation, layout, dependency or finite-scope blocker was found. The two minor clarity findings in the new Book 1 example were corrected and the actual saved page re-inspected.

This is local independent acceptance of the manifest-bound revision. **Final-head remote CI remains pending.** It is not a declaration that the initial broad Jest run was wholly green, a merge authorization, curriculum/target approval, measured timing result or full Part B acceptance. Required final-head CI and the committed-pair review gate must pass before integration. Platform-first is the supported proposed order.

## 3. Content and paragraph coverage

| Current paragraph/item | Evidence and conclusion |
| --- | --- |
| 1.3.3 | A separate fully worked scarf example precedes exercise 27 on printed p114. Both independent causes shift left, unlike the assigned camping-lamp exercise. Isolated effects precede the joint lower-quantity/undetermined-price conclusion. All 11 complete exercise blocks remain exact; the example does not replace or answer the exercise. The summary on p111 now explicitly limits its unchanged-other-line claim to one shifting line. |
| 1.3.3 teacher material | Four examples, local p30 = complete p114, 143-minute paragraph estimate, 487-minute H3 total and 1,386-minute book total agree. The additional five minutes are explicitly provisional. The challenging route calculation 143 − 25 + 20 = 138 is correct. Both 1,381 and 1,386 minutes require at least 26 lessons of 55 minutes before extra repetition/overrun. |
| Book 3 glossary / welfare-loss teaching | Printed p127 covers lost beneficial transactions and subsidy-induced transactions whose marginal costs exceed willingness to pay. It explicitly uses the model without external effects and includes government receipts/expenditure. This repairs the narrow tax-only definition without changing exercises or scope. |
| 3.3.1 | Three literal Markdown headings on printed pp88–90 now render properly. No heading marker, overflow or lost content remains. |
| 3.3.2 | Unchanged manuscript, questions, answers and learning scope. Its rebuilt paragraph export is textually and visually identical to the corresponding current owning chapter pages, including local footers. |
| 3.3.3 | Same unchanged-content/export conclusion. Signed elasticity wording and calculations remain intact. |
| 3.3.4 | Same unchanged-content/export conclusion. The final chapter overview has only the negligible render-rounding effect described below. |
| 4.1.1 | Student A and answer A₀ end at Q = 25 thousand kg/week, P = €14. Independently derived initial 100 firms × 250 kg capacity = 25,000 kg. New entry A₁ remains unchanged: the long-run 200 firms imply 50,000 kg capacity. Both required equilibria and all firm calculations remain correct. Student p14 and answer p6 inspected. |
| 4.3.1 | No substantive content change. Its shared answer-source integrity hash is refreshed because the chapter answer file changes elsewhere. No target or authority field changed. |
| 4.3.2 | Student and answer line endpoints obey €4 ≤ w ≤ €24. Equilibrium remains w = €14, L = 100. Student p130 and answer p59 inspected. |
| 4.3.3 | Student and answer line endpoints obey €2 ≤ w ≤ €24. Old equilibrium (84,16), new (66,13), and fixed-wage excess supply 36 remain correct. Answer 27 correctly refers to §4.1.3 for marginal revenue. Student p139 and answer p62 inspected. |
| 4.3.4 | Student and answer endpoints obey €2 ≤ w ≤ €22. Equilibrium €12/100, floor €14, employment 80, supply 120, excess 40 and payroll change −6⅔% remain correct. Student p147 and answer p64 inspected. |
| 4.3.5 | Endpoints obey €4 ≤ w ≤ €24; old €14/100 and new €16/120 remain correct. Answer outer containers and anchors now match 37–41, their visible headings and subanswer keys. Answer 39 reads “Een minimumloonregel boven de markt”; its numerical work is unchanged. Student p152 and answers pp66–67 inspected; questions remain on p153. |

All ten edited SVGs were independently checked against the equations, domain endpoints and accepted non-curve geometry. All 31 Books 3/4 target records retain their question/answer payload meaning, goals, operation specifications, routes and authority fields. Only current source/figure hashes and the derived composite hash change. This correctly binds revised figure bytes without conferring target approval.

## 4. Saved textbooks, navigation and exports

Independently authenticated 86 teaching-source files in the same-environment baseline against the accepted Git commit. Compared all nine complete PDFs: **816 pages**, unchanged counts and **303 unchanged link rectangles/destinations**, with unchanged bookmarks. Counts remain Book 1 **132 / 66 / 28**, Book 3 **132 / 74 / 22**, Book 4 **166 / 68 / 28** (student/answers/teacher). Contents and chapter-opening navigation remain intact. Book 1 source/question pairs 40–41, 80–81 and 120–121 remain facing; pp111,113–115,120–121 and all changed teacher pages were visually inspected.

At 90 dpi, changed complete-book pixel pages are Book 1 student111,114 and teacher19,22,23,24; Book 3 student88,89,90,124,127; Book 4 student14,130,139,147,152 and answers6,59,62,64,66,67. Other pages match the same-environment rebuild. Book 3 p124 has an incidental 0.01129 pt width change in “Vier blijvende controles”, with unchanged text/origin and no perceptible layout effect. At 72 dpi it matches exactly; at 90 dpi differences occupy a 76×9 pixel bounding box. Full page and enlarged crops were inspected. No false all-resolution pixel-identity claim is made.

The **ten changed paragraph exports, 86 pages**, match their current owning chapter PDFs in whole-page text and rendered pixels, including existing local page numbers. This checks saved exports rather than merely trusting a successful build. Complete-book page references retain their existing continuous numbering. The final complete PDFs still match the individually inspected interim hashes.

The author corrected stale Book 1 assembly input hashes after equivalent unchanged PDFs were restored to accepted bytes, using the existing owner `prepare_inputs.py`. The resulting assembly evidence shows **1,376 checks passed, zero failed**, covering 208 source pages; no publication bytes changed. The workflow now explicitly documents this post-restoration preparation/validation step. It is a freshness repair, not new pedagogical authority.

## 5. Presentation dependencies

Independently opened the three final saved PPTX packages and compared them with accepted Git blobs. All **73 slide XML bodies** remain byte-identical. All **15 native charts, 20 native tables and 15 embedded workbooks** remain unchanged, as do all other package parts outside the exact notes and two media replacements. All saved PDF text is unchanged. The §4.3.2 slide PDF is byte-identical.

Only §4.1.1 slide18 and §4.3.5 slide8 change pixels. Both actual final PDF pages were rendered and inspected: the coffee original supply ends at capacity; the three labour lines stop at their declared wage endpoints. Labels, units, page references and layout remain clear. The corrected notes no longer describe the repaired textbook defect as outstanding. Existing native answer charts already used the correct limits and are preserved.

The six owning source/manifest files express the same changes. Their sources and hashes were independently authenticated against actual ancestor Lessons `0356afb6cac2dd43adbe9f63b872aaf423efc914`, and against the current files. Historical presentation evidence is not relabelled as current. This bounded dependency review reuses accepted evidence for unchanged slides; it does not redesign or approve unrelated companion workflows.

## 6. Verification path and code review

Reviewed the finite contract, revision gate, saved-book/diagram checks, saved-presentation package checks, controller, tests, workflow and historical/Y1 dispatch changes. The current gate does not refresh old receipts. It executes the original predecessor verifier against the actual immutable accepted pair, then checks the new finite path inventory and bytes. The reviewer executed this positive path successfully: current revision accepted with 98 lesson rows and preserved original historical evidence.

The required current-pair workflow checks exact GitHub head checkouts, committed/staged bytes and the independent review's exact manifest binding. It runs saved-output checks, current target/snapshot freshness, assembly validation and regression tests. The old named Book 1 workflow now uses its original accepted tools for historical snapshots. Historical proof is distinguished from current content proof.

The Y1 adapter retains actual event references, changed-entry/scope and evidence-tail verification. It accepts current maintenance only through the finite successor and explicitly reports that historical screenshots do not attest current revised pages. Added tests exercise both classroom and maintenance dispatch and reject failed/unrelated scope. The historical recursive-CLI fixture now hides all installed successors and proves its recursive mock was actually reached; it does not relax production validation.

Exact checkout rules are limited to enumerated current input paths; the accepted attributes remain intact. Additional reviewer probes passed for ordinary versus trusted advisory refreshes, staged changes cancelled by working restoration, committed changes cancelled by index/working restoration, staged mode changes, missing files and untrusted branch context. Neither ignored navigation refreshes nor a new manifest can conceal unreviewed source changes.

## 7. Test evidence and remaining flags

Reviewer-run checks passed: **42 JavaScript tests**, **3 Python regression tests**, **83 saved-book checks**, saved-presentation verification, the actual predecessor/current gate, and seven additional boundary probes. The author additionally recorded 62 focused JavaScript checks and, after repairs, **75 passing tests across all three initially failing suites**. The reviewer inspected that stable rerun log and the 1,376-check assembly result.

The first broad Jest run occurred while fixtures/manifests were being corrected: it reported 2,338 passed, eight skipped and four failures (two prior Y1 mocks, one historical CLI isolation case, one transient manifest mismatch). Those suites subsequently passed on the stable candidate. **A wholly green final-head remote CI result is still pending and is not implied by this review.** No outstanding book/PPT content finding remains, but required remote checks must be completed before merging.

Timing remains a design estimate and requires a separate classroom pilot. The prior NAV1 repair, “Herhaling 29 en 30” repair and delivered TIMING34 teacher advice stay closed. Book 2 print trade-offs, protected holds and PV templates remain outside scope. No tagged-PDF/screen-reader certification, empirical mastery, old-target equivalence or official curriculum approval is claimed.

## 8. Issue reconciliation

The new maintenance documentation matches the independently checked dispositions. For #221: E2-02 is corrected in the current forward reference; E2-03 is closed as current-edition depth review distinguishing intuitive zero contribution/common-interval work from formal piecewise/kink requirements; E2-04 clearly preserves preview versus later formal treatment; E2-05 closes the current-navigation defect while preserving historical compatibility URLs/archive. E2-01's old production brief is superseded by the owner-selected edition; formal target equivalence remains **open**.

For #223, Gates 0A–0C remain historically complete for their named payloads. The old exact-target blank-slate Gates 1–3 are **superseded for current delivery, not passed**. No current imported edition or maintenance PASS silently grants those approvals. The two previously released §2.1.1 integration holds are not reopened; other named holds and target candidates are not released. These records preserve history while separating completed editorial/runtime work from unresolved authority.

## 9. Independent evidence location

Reviewer evidence is retained externally at `C:/wt/book 2/review/textbook-maintenance-20261004/independent/`: `baseline-source-authentication.json`, `interim-pdf-comparison.json`, `interim-geometry-and-answers.json`, `interim-target-integrity.json`, `final-independent-presentation-audit.json`, `final-current-freshness-and-exports.json`, `current-gate-probe.json`, `final-advisory-boundary-probe.json`, `final-focused-jest.json`, `final-saved-books.json`, and actual rendered pages/crops in `pages/`. These are independent comparisons and observations; author PASS summaries were supporting evidence only.

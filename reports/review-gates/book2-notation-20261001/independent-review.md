# Independent bounded review — Book 2 notation and word formulas

## 1. Scope and identity

Reviewer: `/root/review_b34_followups`, independent of the implementation author. Date: 2026-10-01. The reviewer did not edit manuscripts, build scripts, publication outputs or authority records. Only this review directory and external review evidence were written.

This review applies to the requested notation, word-formula and layout successor of the accepted `chat-2026` edition. It covers all twelve paragraph deltas and their chapter, answer, teacher, export and complete-book dependencies. It follows `docs/workflows/part-a-review.md` and `skills/econ-paragraph-review.md`, including economic, mathematical, teaching, teacher/student, visual and accessibility dimensions. It is not a fresh full curriculum, foundation, target or PV approval.

The accepted bases are Platform `d561b3e283dc05e377cebffd80d082f05518ad23` and Lessons `d53080f38ebbdbba319e6d9b89dcba86067a72be`. The final lesson candidate is `0cb8a20891b21fc2ed585f93a73d112993d7af99`. The current manifest independently binds 1,525 publication/source files, 168 changed paths and 23 editable-source ancestry/current bindings. Its implementation inputs and supplemental test/dependency identities are recorded in `final-bindings.json`.

Review manifest SHA256: `835b3836b4e15cb919ca4f6b31adddc57db433089bc51ed9c0a474f4dcd5a15a`

## 2. Verdict

PASS WITH FLAGS

No unresolved defect was found in the bounded revision or its current publication dependencies. The flags are the disclosed loss of three facing-page pairs, the necessary additional SportLint answer page, and the existing timing and authority limitations described below. Required exact-pair CI and normal PR closure remain the author's responsibility; this report does not grant merge, publication or student-use permission.

## 3. Evidence reused and independently refreshed

The earlier `book2-theory-signed-20260921/independent-native-content-review.md`, its native-source/geometry evidence and its companion coverage remain historical evidence for unchanged accepted material. The current Git baseline, rather than the package's older Library PDF, is the comparison authority. The reviewer read all visible manuscript deltas, the answer proposals and teacher deltas, and reran preservation checks against that baseline. Reuse does not imply that the historical review's PDF hashes certify the new files.

The source audit independently verified all 53 supplied package manifest entries. The Library prototype and repository baseline have different PDF bytes; the prototype was used for the requested designs and text only. The seven redesigned pages are editable manuscript text, semantic tables and real fractions. The SchaalWerk graph has editable geometry; no complete prototype page is a production input. The final H1 and H3 answer sources equal the two narrowly scoped proposals after newline normalization; H2's answer source is unchanged.

The reviewer inspected 109 bound page renders across the student, answer and teacher books, including all nineteen teacher pages, all seven redesigned student pages, H1/H2/H3 openings and overviews, the changed H3 exercise layouts, answer pagination boundaries and the changed SportLint answer pages. All nine retrieval-heading pages were inspected. Full-size checks included printed student pages 5, 13, 19–23, 29, 71, 108–109 and the final H3 answer contents and its neighbours. After the last serialization-only rebuild changed PDF byte hashes, fresh renders of all 109 selected pages matched the inspected PNG pixels exactly. `final-render-comparison.json` records their hashes and both PDF generations. Current page-reference and navigation probes were rerun against the final PDF bytes.

## 4. Explicit paragraph coverage

Each linked paragraph report records the same bounded scope and current manifest. Counts include target blocks. Unchanged exercise content was checked against the accepted source; it was not newly authored or granted new curriculum authority.

| Paragraph | Blocks | Current delta and dependencies reviewed | Result |
|---|---:|---|---|
| 2.1.1 | 10 | PlakLab on printed 5: separate TCK/TVK/TK formulas, tables, units and average-cost calculations; retrieval heading; neighbouring pages, answers, teacher references and exports. | PASS WITH FLAGS |
| 2.1.2 | 11 | WafelWagen on printed 13: TO/GO, profit and break-even steps; first whole non-loss quantity 84; retrieval heading and neighbours; unchanged target and answers; exports. | PASS WITH FLAGS |
| 2.1.3 | 10 | Five theory pages 19–23: word meaning before delta notation, actual interval divisors, Linoprint and Atelier Boog; SchaalWerk curve; SportLint table and complete answer; start-page/export correction; Linea/Curva target intact. | PASS WITH FLAGS |
| 2.1.4 | 7 | Unchanged mixed-practice payload and SmoothBox target; shifted pages 30–35, source/question pair 33–34, chapter overview, answer offsets and teacher print caveat. No guided section invented. | PASS WITH FLAGS |
| 2.2.1 | 10 | Retrieval heading and shifted pagination; signed Ev convention, normal guided route and target preserved; current opening/contents, answer and export dependencies. | PASS WITH FLAGS |
| 2.2.2 | 10 | Retrieval heading and shifted pagination; signed elasticity/turnover distinctions and complete exercise/answer payload preserved; teacher time row and exports. | PASS WITH FLAGS |
| 2.2.3 | 11 | Retrieval heading and shifted pagination; Ei/Ek, function-model distinctions, signs and target preserved; teacher references and exports. | PASS WITH FLAGS |
| 2.2.4 | 7 | Existing mixed structure and hoofdstukcheck 7 label preserved; StreamPlus now 67–68, consecutive rather than facing; answer/overview dependencies. | PASS WITH FLAGS |
| 2.3.1 | 11 | Dutch quantity definitions, retrieval heading, current opening and answer contents; CS calculations, units, target and question/answer alignment preserved. | PASS WITH FLAGS |
| 2.3.2 | 11 | Separate independent demand/supply and CS/PS formulas; Qv/Qa in questions and answers; retrieval heading; shared theory/start page correctly retained in exercise export. | PASS WITH FLAGS |
| 2.3.3 | 9 | Separate formula layout and equivalent Qv/Qa including target 6b; actual-transaction, allocation and Pareto distinctions preserved; retrieval heading, answers and references. Existing authority hold remains. | PASS WITH FLAGS |
| 2.3.4 | 7 | Equivalent quantity notation and separated formula presentation in mixed work; unchanged target operations; target source/questions now 105–106; current overview/glossary and teacher references. | PASS WITH FLAGS |

The twelve counts total 114. The normal route still includes guided practice and precedes the challenging route. The bonus remains on the challenging route; repetition remains additional. The three mixed paragraphs retain their existing structures. No score-based routing, deletion, exercise renumbering or target weakening was introduced.

## 5. Mathematical, teaching and source findings

All seven native replacement pages retain the prototype's complete word, number and operator inventories. The reviewer separately read the economic meaning rather than treating token equality as a proof of correctness. PlakLab retains TCK=300, TVK=Q, TK=300+Q; at Q=150/300, GTK is 3/2. WafelWagen retains Q=250/3 at break-even and first whole quantity 84, with profit 2. The distinction between profit as a vertical difference and an area is retained.

For marginal quantities, the first example gives 40 extra euros over 10 products, MK=4, distinct from GTK=300/50=6. The unequal 0→10→30 example uses the real second interval of 20. SchaalWerk retains TK=80+Q² over Q=0–12, with interval MK 4, 12 and 20; the verifier checks 241 actual curve points against the plotted axes. Linoprint retains MK=2, MO=6 and profit −60 at Q=15. Atelier Boog retains MK=2, 6, 10 and MO=12. SportLint gives MK=4 and MO=9 in both intervals. Its table adds support for the existing calculation rather than a new economic operation. No derivative or profit-maximization task is introduced.

Demand/supply notation changes are equivalent Qd→Qv and Qs→Qa. The definition and application remain consistent across student, answer and teacher sources. H3 still distinguishes actual transactions, CS/PS/TS, lost surplus and Pareto conditions. Formula separation no longer suggests that independent formulas form one calculation. Genuine equality chains and narrative conjunctions remain. The source comparison preserves numbers, decimal points, signs and operations while allowing only these specific notation/layout changes and the SportLint fill-in columns.

New fraction spans carry numerator/denominator structure and math labels; tables retain cells and headings, figure text remains readable, and contrast and mathematical glyphs are clear at full size. This is a source/visual accessibility check, not a claim of complete tagged-PDF or assistive-technology certification.

## 6. Resolved review findings

| Finding | Final disposition |
|---|---|
| Nine teacher timing values accidentally incremented as if they were page references | Restored to the exact accepted rows and independently compared. No new 55-minute claim. |
| Stale teacher overview/opening references and facing-spread language | H1 overview 29, H2 opening 36/overview 71 and H3 overview 108–109 are correct. All three nonfacing pairs are explicitly described. |
| Twelve stale H3 glossary references | Final printed 109 checked against the actual revised locations; all twelve are current. |
| H3 answer contents used chapter-local rather than book numbering | Runtime successor projection shows 41, 45, 49, 53 and resolves to those pages; the historical renderer is unchanged. |
| Old named destinations could change identity after the insertion | All 122 historical names now point to their original content after the correct shift; one new Atelier Boog anchor is added. All twenty old student bookmarks retain identity and destination. |
| Regeneration changed historical theory PNGs | Old SVG/PNG/JSON assets restored and authenticated. Only the new notation figure is generated. |
| Windows checkout could alter exact historical pin bytes | Narrow `-text` rule added for the predecessor pin. A real Git checkout fixture reproduces the unprotected aged-index/CRLF condition and passes with the rule. This is a tested checkout condition, not evidence of a current hosted-runner failure. |
| Semantic normalization could hide a numeric decimal point | Canonicalization preserves numeric decimals; a 3.4 versus 34 regression check passes. |
| Current source/output documentation had stale counts and build direction | Current edition/chapter documentation points to the notation controller, 111/58/19 bundles and 46+5 extracts. Historical receipts and instructions remain preserved as historical. |

## 7. Navigation, inventory and build-path review

The independently run current verifier passes: 182 assembled chapter pages agree in text and pixels, all 151 complete-book links resolve, and 197 exported pages with 25 links agree with their owning publications. The new 46-page native extract and five-page §2.1.3 extract match the complete student book. Independent probes additionally check all 182 printed footers, PDF page labels and the 21 main-contents destinations. The main contents link counts are 15/3/3; total links are 101/47/3. Sixty-one preexisting student links outside the four replaced theory pages retain their clickable rectangles and correctly remapped destinations/views. The repaired cover pixels and overview navigation remain intact.

Exercise-only exports now begin at the actual first exercise block instead of the previous one-page-early guess. The existing combined theory/start page in §2.3.2 is retained. This is a bounded derivative correction; exercise content is unchanged. Relative outward links still require distributing the paragraph/chapter folder structure together.

The controller builds from the owning manuscripts, independently rebuilds answers and teachers, derives offsets from the current allocation and uses separately recorded chapter inputs before assembly. The isolated figure stage avoids the observed local Windows font-library conflict. Historical builders and receipts are not rewritten. The current assembler, source checks, export logic, input recorder, finite revision checker, exact-pair workflow and review-binding checker were reviewed. The paired workflow checks exact platform and lesson SHAs, tracked bytes, content/navigation, tests and review freshness; it does not substitute author evidence for an independent verdict.

The successor checker authenticates the four old manifests/pins against accepted Git bytes. It separately authenticates the accepted main's 24 classroom PDF/PPT/evidence additions and protects every one. The historical compatibility branch accepts exactly the sealed 1,480-file inventory or the accepted 1,504-file inventory, with exact baseline blobs; partial/arbitrary additions do not qualify. The changed candidate is rejected by that baseline path and accepted only by the finite new 1,525-file successor. The existing classroom partition helper is unchanged from Platform base and also bound in the supplemental implementation evidence. Book 1, Books 3/4, Part B, target authority and held PV templates remain unchanged. No historical report has been rebound to current files.

## 8. Checks and final artifacts

Independently executed successfully:

- Five Python tests in `test_book2_notation.py`.
- Fifty-four JavaScript tests across revision protection, real Git checkout normalization, paragraph lane scope and paired CI fixtures.
- `verify_book2_notation.py` against the current publications.
- Independent current PDF/content/navigation probes, complete manifest/hash/source-ancestry checks and final render equivalence checks.
- New successor verification passes 1,525 files; the old baseline entry point correctly rejects this changed candidate.

The author's full local suite reports 2,228 passed and eight skipped; this reviewer did not independently rerun that full suite. Hosted CI is not claimed in this report.

| Final complete PDF | Physical pages | Printed pages | SHA256 |
|---|---:|---|---|
| Student | 111 | 1–109 | `3e1164e44de994b440cef0884c52894723b1967c48266006784501bcd2afadf1` |
| Answers | 58 | 1–56 | `58a78a4262903e96c883c48c253cfd4156b9be3eeb60e304bf4404ae07641fe8` |
| Teacher | 19 | 1–17 | `0f36bf59daec60b137a05ca76fcb67844d455ff395a6fa79b373db3c204ae5f7` |

Supporting records in this directory are `source-audit.md`, `independent-checks.json`, `current-verifier.json`, `final-bindings.json` and `final-render-comparison.json`. External scripts and inspected PNGs are retained under `C:/wt/book 2/review/book2-notation-integration-20261001/`. The final bindings include manuscript hashes and exercise counts for all twelve paragraphs and hashes for 22 implementation/test/dependency files.

## 9. Continuing flags and authority boundary

SmoothBox 33–34, StreamPlus 67–68 and the H3 mixed target 105–106 are consecutive, nonfacing pages after the explicitly requested single-page insertion. Teacher guidance recommends keeping the source separately available or turning back. The revision does not silently insert a blank page or remove material to hide this tradeoff. The answer book gains one page to retain the full SportLint solution; the student book gains one theory page, while teacher material stays nineteen pages.

All nine Book 2 theory paragraphs still lack a measured complete-supported-route time budget. Their historical estimates remain identified as incomplete, not empirical 55-minute fits. Extra explanatory material cannot resolve that uncertainty; guided practice and targets remain available in full.

The separate `lesson_authoring` action check for §2.3.3 still reports the existing `H-CHAPTER-23-PLAN` hold; the author reports §2.1.3 passing its pins. The ordinary bounded-revision route permits reuse of the accepted edition for this explicitly authorized delta; it does not convert the failing legacy action check into approval. No foundation, hold, target or PV authority file was changed or released. These paragraph delta records certify the inspected revision and current dependencies only, not new chapter production or a global full-paragraph authority PASS.

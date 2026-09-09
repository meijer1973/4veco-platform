# Paragraph Review: 2.1.1 Kostenstructuren

## 1. Scope and evidence

Author: `/root/cold_paragraph_trial`. Independent reviewer: `/root/cold_paragraph_trial/independent_content_review`. I authored none of the reviewed student material and made no repository changes. This is one independent ordinary Part A review under `4veco-platform/docs/workflows/part-a-review.md`, covering integrity, didactics, mathematics/economics, teacher and typical-student perspectives, accessibility and final pages. No additional reviewers or specialists were needed.

Review date: 2026-09-09. Reviewer began at 11:00:58 UTC. The old review, prior conversations and other task reports were not used. The reviewed final candidate is the author's v4 source/HTML/PDF set, with full-page proof in `rendered-final-v4/` and refreshed standalone browser screenshots in `rendered-final/html-*.png`. The parent author owns transcription into `2.1.1-review.md` and the quality/handoff records.

Trial root: `C:/wt/reorganize 2/cold-paragraph-trial-20260909/`.

Lesson directory, relative to that root: `4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/`.

Reviewed files there: `2.1.1-textbook-plan.md`; `2.1.1 Kostenstructuren – paragraaf.md`, `– opgaven.md`, `– antwoorden.md` and all matching HTML/PDF outputs; `build_pdf.py`; `_assets/2.1.1_fig_1.svg` and `.png`.

Authority: the current `references/authored/course-target-exercises.json` record 2.1.1, MEDIUM, four goals and target operations a–e; approved record pin in the plan `143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710`. The plan identifies the released production holds and production-only authority. I independently read the current target, outline 2.1.1/2.1.2 role and boundary rows, applicable hold entries, pedagogical boundaries and Book 1 §1.1.3 source. I did not independently repeat source-owner decisions or turn content acceptance into publication permission.

Instructions consulted: platform AGENTS review route; lane vocabulary; textbook runbook; canonical Part A review rule; `skills/econ-paragraph-review.md` applicable passes; `didactiek-principes.md` applicable parts 1–10, 12 and appendices; `economic_mathematical_precision_reference.md` general, cost, units/domains, exercise and failure-pattern rules; cost entries/common pitfalls in `economie-terminologie.md`; school-fit overlay; rendered-page acceptance and figure standards. Nonapplicable market-curve, Chapter 5, chapter-assembly and companion checks are excluded, not silently passed.

Independent checks: PowerShell reference/inventory checks returned zero missing references and one SVG/PNG pair. Exact string checks against current authority returned `ContextExact=True`, `PromptsExact=True` for both final teaching and exercise Markdown; each has exactly seven `##` headings. All target arithmetic was recalculated independently. `node scripts/validate-paragraph.js --mode part-a --profile student-web <lesson-directory>` ran from platform and exited 0 at approximately 11:08 UTC. Its output accepts a review with “no explicit verdict”; consequently that green result establishes inventory/automated checks only, not independent acceptance. This report supplies the actual verdict. Audit events are in `events.jsonl`; duration entries are approximate activity costs, not a measured student trial. Two read/check shell attempts failed due guessed filenames and a Unicode-literal parse error, then were corrected; neither changed student material.

## 2. Verdict

**PASS**

All required in-scope content and rendered-page coverage is complete. Initial findings F1–F5 are resolved in the final v4 candidate. There is no unresolved content failure. The separate lane-scope closure problem below still prevents claiming full workflow closure.

## Pass 0: Asset and File Integrity

PASS. Three required source documents, three HTML renders, three PDFs and the build script exist. The one Markdown image reference resolves. The figure has editable SVG plus PNG, uses the required paragraph-scoped name, and the PNG is visible on the final page. The SVG is the editable counterpart of that referenced figure, not an unused student illustration. No missing or unpaired figure was found. The paragraph contains 8 PDF pages, exercises 6 and answers 3.

## Pass 1: Didactic Architecture

The opening workshop question precedes formal definitions and creates a useful total-versus-per-product question (paragraph p1). Goals and arithmetic/unit recall are visible. Costs are explicitly taught as new content. The sequence proceeds through behaviour-based classification, construction of totals, division to averages, numerical comparison, worked example and the summary. Final p2 decodes GCK, GVK and GTK; p3 places the reading instruction, annotated comparison schematic, numerical table and interpretation together.

The target chain is covered throughout: classification plus reasons in worked example a, Start 2a, guided 3a and independent 4a; total functions in b/2b/3b/4b; two-quantity averages in c–d/2c/3c/4c; comparison and bounded explanation in e/2d/3d/4d. The current authority context, table and five target prompts are retained. No marginal-cost, profit, break-even or untargeted graph-production operation is introduced.

All seven canonical headings have the required level and order. The compact five-point summary follows the worked example and precedes Startopgaven. Start combines brief taught-arithmetic retrieval with a low-stakes current-content check. Optional guidance uses neutral skip wording, an example classification row, incomplete functions, supplied average formulas, then less support for the second quantity and independent causal explanation. Independent practice removes those supports while retaining the target's supplied classification-table form. The contract-comparison bonus requires critique of classification from a single observed amount, rather than extra routine arithmetic. The single closing task retrieves supplied-formula use without new economic theory.

Misconception handling is concrete: energy bills can combine fixed and variable components; equal GVK is conditional; more total costs need not mean more per product. Start 2d and guided extra control require students to confront those confusions. Contexts are concise and age appropriate.

### Teacher coverage

The paper lesson can be taught as planned. The complete plan maps all four approved goals and preserves formal first teaching of costs. Book 1 §1.1.3 supports continuity through data, units and formula notation; the present recall box also states the substitution instruction explicitly, so the route does not depend on students remembering an unstated economic cost procedure. The later-paragraph pointer matches §2.1.2 revenue/profit teaching.

The planned core equation is 3 + 12 + 6 + 2 + 7 + 12 + 11 = 53 minutes. This is plausible for the actual compact questions and MEDIUM target after the worked example, with little spare time; it is a design estimate, not measured classroom proof. The 48-minute supported alternative moves retrieval before class and independent practice to homework while retaining the target. The teacher has the optional route, formative check, answer explanations, extension and retention task available on paper. Every exercise, including the unnumbered extra check, has an answer. No hidden online support is required.

### Student coverage

I walked the printed order as a typical 15-year-old 4 vwo learner: the hook explains the problem; the terms and units are introduced; the example models the same operation chain; the visible short route gives the next step and neutral support option; the completed answer booklet permits checking both result and reason. Literal subquestion labels now stay stable through tables and match the answer booklet. Arithmetic and conceptual reasoning are separated enough to follow; the diagram's arrows explicitly mean division by Q, and the table links monthly totals to per-holder averages. The task packet is paper-complete.

Readability/accessibility: final body text, formulas, table headers, diagram text and captions are readable at full-page scale. The blue/green figure distinction also has labels and consistent column positions, so colour is not required. The figure has a meaningful textual description, formulas and a numerical table. HTML retains semantic headings, table headers and reading order. This is content/visual accessibility inspection, not a claim of a formal PDF/UA or assistive-technology certification.

## Pass 2: Mathematical and Conceptual Precision

PASS. All calculations were independently reworked and compared with the full answer model:

| Context | Totals at first Q: TCK / TVK / TK | Totals at second Q | Averages at first Q: GCK / GVK / GTK | Averages at second Q |
|---|---|---|---|---|
| Workshop, Q=100/200 | 200 / 200 / 400 | 200 / 400 / 600 | 2 / 2 / 4 | 1 / 2 / 3 |
| Candles, Q=100/200 | 100 / 100 / 200 | 100 / 200 / 300 | 1 / 1 / 2 | 0.50 / 1 / 1.50 |
| Lunchboxes, Q=200/400 | 600 / 600 / 1,200 | 600 / 1,200 / 1,800 | 3 / 3 / 6 | 1.50 / 3 / 4.50 |
| Bakery target, Q=500/1,000 | 500 / 400 / 900 | 500 / 800 / 1,300 | 1 / 0.80 / 1.80 | 0.50 / 0.80 / 1.30 |

Totals are euro per month; averages euro per corresponding product. Opgave 1 gives 8 pencils per pupil and B=50 euro. Start 2 gives TK=300+5Q, GTK=10 euro per repair at 60 repairs, and GVK=5 euro per repair. Bonus: at 100 pots A still costs 200 euro and B costs 100 euro; equality at 200 pots cannot establish both as constant. Closing review gives 55 and 85 wristbands, difference 30.

The same fixed total divided by twice Q halves GCK; the stated per-unit variable charge keeps GVK constant; GTK therefore falls without halving. The text, figure, table, example and answers agree. Definitions distinguish total from average, classify behaviour rather than invoice names, preserve month/capacity/output bounds, and state Q>0 for averages. Constant GVK is explicitly a modelling assumption. All questions are solvable from their supplied contexts. The answer model includes substitution, units, explanations and a rounding rule. No conflicting economic causal claim was found.

## Pass 3: Final Rendered Pages

All 17 final pages are covered at normal full-page reading scale. Final proof is `rendered-final-v4/paragraaf-1.png` through `-8.png`, `opgaven-1.png` through `-6.png`, and `antwoorden-1.png` through `-3.png`.

I inspected all 17 initial pages and all 17 pages of the first repaired final candidate. For the last marker repair I inspected changed v4 paragraph pages 4–7, exercise pages 2–5 and answer pages 1–3. SHA-256 equality proved the remaining six pages unchanged: paragraph 1–3 and 8, exercises 1 and 6. Their completed visual checks were reused. This covers every final page and affected pagination, rather than assuming unchanged material.

The refreshed browser screenshots `rendered-final/html-paragraaf.png`, `html-opgaven.png` and `html-antwoorden.png` were also inspected. These are the standalone HTML files emitted by `build_pdf.py` before the same HTML is passed to WeasyPrint. Screenshot reduction is supplementary for continuous-layout inspection; detailed text and final print readability were checked against the full PDF pages and source.

No remaining clipped/overlapping text, missing image, broken glyph, table overflow, unreadable figure label/caption, blank page or unreadable answer model was found. Wide whitespace on the last retrieval page and some exercise pages is pagination/assembly polish, not missing content. No chapter/book assembly or companion surface is accepted here.

## Repair recheck and unresolved findings

| Finding | Initial evidence and severity | Repair and final disposition |
|---|---|---|
| F1 | FAIL: corrupted accented letters, euro signs and multiplication symbols in target; initial paragraph p7, exercises p5, answers p3 | Explicit UTF-8 authority extraction; final exact context/prompt comparison passes and all affected PDFs/HTML display proper glyphs. Resolved. |
| F2 | FAIL, 1.2.3: figure-reading instruction on paragraph p2, figure p3 | Instruction kept with figure on final p3. Resolved. |
| F3 | FAIL, 1.9.2/2.4.4: automatic subquestion numbering restarted after tables and broke answer references | First CSS repair fixed letters but PDF still restarted at a after tables. Reviewer rejected that repair. Final literal bold a)–e) labels preserve sequence in both print and browser, including answers. Resolved in v4. |
| F4 | FAIL, 2.3.1/1.9.3: average abbreviations not expanded at first formal introduction | Full Dutch GCK/GVK/GTK meanings added beside first formulas, paragraph p2. Resolved. |
| F5 | FAIL, 1.6.1/rendered readability: five summary points rendered as a run-on block | Blank quote separator creates five actual bullets, paragraph p4/exercises p1. Resolved. |

An audit entry prematurely described F3 as resolved after the first final candidate; the next review event corrects it explicitly. The failed repair and later v4 resolution remain in this history.

Separate workflow issue C1, reported by the author: the lane-scope checker classifies required `2.1.1-textbook-plan.md` as unknown and fails; existing cross-lane exception handling does not waive unknown paths. This is not an economics/content defect, but it blocks claiming lane/PR closure until the owning workflow issue is resolved or an applicable authorized route is established. This review does not waive it or authorize policy edits. Similarly, author transcription, final quality/handoff records, applicable CI and actual publication/merge authority remain the author's closure responsibilities.

## Summary

The final v4 textbook content is accepted: four approved goals, complete target chain, correct mathematics/economics, usable teacher and student paper routes, accessible instructional figure, and full rendered-page coverage. All five content findings are resolved. Acceptance does not establish student attainment, measured timing, companion completion, workflow closure, publication permission or merge authority.

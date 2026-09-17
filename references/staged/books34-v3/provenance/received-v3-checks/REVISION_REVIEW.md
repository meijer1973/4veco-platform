# Books 3–4 v3 — completed local revision and checks

## Outcome

**LOCAL DELIVERY COMPLETE for the owner-adopted v3 revision.** The student books, matching answer books, teacher guides, adopted outlines, migration map and populated target-candidate records are delivered together. This document is an author-side completion review; it is not an independent reviewer verdict or repository merge/target approval.

## Implemented content and assessment changes

The revised 3.2.2 has its own limited derivative/interval target (17, Zadenverpakker). Its theory, worked example, guided and independent practice address the same operations. It does not require a production optimum. New 3.2.3 retrieves this derivative and retains feasible marginal choice, capacity, profit and the firm diagram, with target 27 (Korrels voor kwekerijen). The former combined destination is therefore not merely divided into an explanation-only lesson and an exercises-only lesson.

Book 3 competition consolidation now compares two short-run moments. Target 35 retains market equilibrium, Q/q, marginal output choice, capacity and profit. Its former third source and long-run questions are removed. Replacement independent question 34 and bonus 36 use already-taught short-run methods. Trade review 38b now retrieves a short-run firm calculation; its answer and Book 4 pointer match.

New 4.1.1 retains the former long-run paragraph's cost assumptions, economic-profit interpretation, normal remuneration and entry/exit direction. The old monopoly lessons become 4.1.2–4.1.5. A small selected long-run retrieval (41A) precedes the mixed exercises; the whole moved target was not appended to the existing monopoly mixed target. Monopoly welfare remains 4.2.1.

Old 4.3.5's institutional/agreement-policy goals are deferred, not compressed into another core. New 4.3.5 is the mixed unit. Exercise 39 states a minimum wage without a cao prerequisite; target 40's source C concerns a work process, not assessment of a training agreement. The productivity arithmetic, participation/unemployment, independent equilibrium and conditional employment reasoning remain. The old source, answers and referenced figures are preserved in historical inputs.

## Numerical and coverage evidence

`math-checks.json`: **99 passing numerical assertions**, covering the new derivative and interval cases, fixed-cost distinctions, profit/capacity cases, the short-run capstone, moved long-run result, relevant monopoly comparisons and revised labour mixed calculations. These are selected author checks, not a claim that every inherited calculation was independently re-audited.

`verification.json`: **598 passing automated checks**, no failures. These cover all 31 IDs; 276 exercises; exact matching of 734 question/answer labels; source endpoint text in the PDFs; assets and local HTML anchors; target-source hash bindings; page ceilings; complete-volume bounds and absence of raw Markdown; chapter recto starts; continuous student pagination; valid contents/bookmark destinations; target facing pages; and explicit retention of the five open timing issues.

The final navigation review caught and repaired a stale labour answer-book contents block and its anchor. The chapter now states 41 exercises and five current paragraphs. Five embedded figure labels, with matching PNG exports, were updated to the new exercise numbers. A bounded formatting repair renders inherited Markdown tables/emphasis/headings correctly without changing their numerical sources.

## Reproduction and preservation

A separate directory was populated with the current sources and its generated outputs removed. Chapter PDFs and all six complete volumes were regenerated with the packaged code and installed dependencies. `rebuild-comparison.json` records **490 pages across six complete volumes**, all with identical extracted text and identical rendered RGB pixels at 79.2 dpi in PyMuPDF. This checks reproduction in the tested environment; it does not claim a Windows/font-environment replication.

`source-preservation.json` confirms preservation of both original cover-page renders and exact reuse of **429 of 439 chapter SVG/PNG assets**. The other ten files are the five label corrections and their PNG counterparts. Original editions are retained as historical inputs and are not presented as the new current output.

## Remaining boundaries — not unfinished assembly

The owner selected a limited, budget-neutral change. The pre-existing one-lesson timing conflicts at **3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5** remain open and visible. Other durations are authored estimates, not measured learning outcomes. The deferred institutional goals still need a named and funded receiving lesson in a later year.

All 31 target records now contain actual exercise/source/answer material, but remain **candidate_review_ready**. Independent target decisions, required repository CI, integration, publication and merge permissions are not invented by this delivery. Machine skill/exam identifiers are not fabricated. Book 1 and Book 2 and all live repositories remain unchanged.

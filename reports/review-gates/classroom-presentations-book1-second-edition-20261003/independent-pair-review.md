# Independent Book 1 second-edition review

Verdict: **PASS for the classroom payload and bounded repository changes**, with one nonblocking review-record correction below. This is a paired-snapshot content/code review, not merge authorization, remote-CI approval, or a claim of measured classroom effectiveness.

Reviewed pair on 2026-10-03:

- Platform `eeaa364f8de5118d4aa788bccd916556db85c308` against `926ada14850d30a87b1b1812ecbf78f486c3c15a`.
- Lessons `4cf51ddbd033c26fe99a3c7f44bba6174a5024c4` against `173aa9a803897965c572df2c4e7f83cdb135eb1c`.
- Both branches: `codex/ppt-book1-second-edition-20261003`; both working trees were clean at the final binding check.
- Reviewer: `book1_final_review`, independently delegated by the coordinator. No repository, artifact, source, GitHub, or deployment mutation was made by this reviewer. Scratch and this report were written only under `C:/wt/ppt/.book1/independent-review`.

## Findings and disposition

**R1 — P3, review-record slide anchor.** `reports/review-gates/classroom-presentations-book1-second-edition-20261003/serialized-teaching-review.md`, §1.3.1 paragraph, calls the supplied beginning graph slide 17. The saved PPTX has context on slide 15, the beginning graph on slide 16 (`Opgave 9 · De gegeven beginlijn`), and questions on slides 17–18. Correct the written anchor to 16. The presentation is correct; this does not block classroom use. The coordinator has acknowledged the correction for the next report-only commit. The snapshot bound above still contains the typo.

No unresolved classroom-artifact, mathematical, serialized-prerequisite, retirement-scope or reviewed shared-code defect was found. The separate textbook observation `Book1-133-op27-scaffold` is retained below and in `textbook-follow-up.md`; no source repair is part of this review.

## Actual review coverage

I independently extracted and read the saved slide text and full teacher-note bodies for all twelve PPTX files, in teaching order: **305 slides and 305 note bodies**. I read all twelve current paragraph manuscripts, the three chapter teacher guides, and the twelve target sections of the current answer models. I compared assigned guided/independent/mixed tasks with the methods taught or retrieved before those tasks. This is not a line-by-line re-adjudication of every non-target answer in the book.

I checked the current complete student PDF's printed footers and source headings at the route, target, and cited-method pages, alongside the current page map. The complete PDF SHA-256 is `2a2261b98f4a1c0a186a119120ae1b8c70e8d7860712e03eb711d1ab07efc676`. Local chapter page references in the source are not blindly treated as complete-book page numbers: for example the complete-book support table on printed p119 correctly renders the earlier worked examples as p101 and p111.

I made my own risk-based visual review of **38 individual native PowerPoint PNGs**, identified by exact hashes in `visual-samples.json`. The sample deliberately includes overviews, dense full-question slides, tables, interpolation/geometry, aggregation and domain endpoints, and movement/shift/equilibrium diagrams. I viewed these full individual slides, not only a contact sheet. The sampled native renders have readable text, adequate separation, matching scales and annotations, and no visible clipping or obstructed mathematical labels.

| Deck | Individually viewed native slides |
|---|---|
| 111 | 1, 12, 19 |
| 112 | 13, 20, 27 |
| 113 | 6, 20, 27 |
| 114 | 10, 16, 17, 19 |
| 121 | 13, 18, 23 |
| 122 | 7, 16, 21, 22 |
| 123 | 6, 12, 22 |
| 124 | 1, 13, 19 |
| 131 | 9, 18, 24 |
| 132 | 10, 20, 28 |
| 133 | 9, 13, 25 |
| 134 | 1, 13, 20 |

**Visual limits:** I did not personally view every one of the 305 native renders, re-render every deck, inspect every exported PDF page visually, or operate every editable element interactively in PowerPoint. The coordinator's separate records state every-native-slide visual inspection and additional PDF samples. I verified all 305 recorded native-render hashes against available files; that establishes their binding, not my own inspection of unviewed images. My own all-page PDF check is slide-count/text parity. The all-slide classroom conclusion combines full semantic reading and saved-data inspection with my explicit visual sample and the separately attributed coordinator record.

## Saved artifacts and source bindings

The final set is twelve PPTX/PDF pairs beside the twelve sealed current student paragraph PDFs: slide/page counts `21,29,29,22,25,25,25,23,26,30,27,23` in paragraph order. The files contain **114 native tables and 53 native XY charts**. Presentation relationship order agrees with the extraction order. Every slide has one notes relationship; the minimum explicit notes font is 14 pt. The three overviews in each deck have matching content and geometry, apart from the intentional phase/slide-number changes.

Independently recomputed artifact hashes match `final-artifact-binding.json` and the individual review records. I also used Git blobs from each recorded completed author lesson commit: **all 24 delivered artifact byte streams are identical to their completed handoffs**. All twelve current builders and manifests match the recorded hashes. I recomputed **99 cited source-file hash checks** with no mismatch. The scope check separately verifies all 376 sealed lesson bindings.

I inspected the saved chart series against the equations, units, endpoints and explanation/target scenarios. All **576 numerical chart coordinate ranges** match their embedded workbook cells. This checks real saved native data, not merely builder strings or an image of a chart. Straight line/marker charts retain the intended data geometry; no smoothing that changes the taught relationship was found. The saved PDF page counts and all slide text match across all 305 pages. These technical checks support, but do not replace, semantic and visual review.

Evidence retained locally: `artifact-bindings.json`, `technical-bindings.json`, `final-record-bindings.json`, `diagonal-series.txt`, `printed-pages.json`, each `ID-saved.json` / `ID-audit.json`, and `visual-samples.json`. The independent checker scripts are retained with that evidence. The saved OOXML/PDF structural audit was rerun from the coordinator's short audit utility after I read it; source/artifact hashes, presentation order, embedded workbook comparisons and completed-author blob comparisons were separately implemented by this reviewer.

## Teaching sequence and independent mathematical checks

The complete target context and all questions occur before the first target answer in each deck. The authored instruction examples remain separate from assigned book work. Theory homework includes the guided, independent and target tasks. Mixed homework includes every actual mixed task, preserving the source's bonus/recall labels. Initial questions using newly introduced ideas are explicitly supported explorations with page references and a return after explanation; the sequence does not declare these ideas already mastered.

| Paragraph | Saved anchors and checked mathematical/teaching boundary |
|---|---|
| 1.1.1 | Slides 4–9 teach a feasible best foregone alternative, with the same time basis; 2 hours at 25/40 produces 50/80, not opportunity cost 30. The infeasible Lina option and summing alternatives are excluded. Target 11–14 precedes answers 15–19; three hours at 70/90 gives 210/270, opportunity cost 210, while a changed participant criterion selects music 90 over 60. |
| 1.1.2 | Slides 3–13 introduce per-unit, reverse share, old denominators, reverse percentage asymmetry, independent factors, fixed-base index, inverse index and percentage-point methods. 16→20 is +25%, 20→16 is −20%; 125→137.5 is +12.5 points and +10%. Hypothetical single-change rows are not historical years. Target 17–20 precedes answers 21–27: 216/36=6; indices 120→150 imply 25%; 20%→24% is 4 points and 20% relative. |
| 1.1.3 | Slides 3–15 teach coordinates, numeric scale, restricted interpolation, equation inversion and coordinate-distance geometry, then retrieve percentage bases. At P6, Q150 follows from the 3-to-7 interval; unequal observation times do not establish intermediate observations or cause. Target 17–20 precedes answers 21–27: P4→Q80, 30% quantity decline, T=8+2n gives 20/12 in the respective forward/inverse questions; geometry uses widths 8−2 and heights 8−4, giving 24 and 12 m². |
| 1.1.4 | Short retrieval separates a time series from the one-evening visitor model. Target sources/questions 7–11 precede answers 12–20. Two-hour returns 120/150 give foregone120 rather than difference30. P7 yields 120 visitors, below130, under the model. Index120→150 is 30 points and25%, with the correct comparison period. Notes retrieve inversion and geometry for later mixed work. |
| 1.2.1 | Slides 4–5 finite willingness/equality and 6–14 separate continuous tea demand are distinct models. q=24−3P, exact inverse P=8−q/3, valid endpoints and progressive graphs are consistent; invalid negative demand is rejected. Target 16–18 precedes answers19–24: Iris buys3 at5; Amir q=20−4P gives12/8 at2/3 and P3.5 for6 liters. Demand plans do not establish sales. |
| 1.2.2 | Group quantity is supplied by the scenario before aggregation is taught. Slides3–12 separate own price, fixed-price substitution shift, specific demand factors, and explicitly reset unknown opposing effects. The own model gives A(60,10), B(48,14), C(66,14), with the extended new domain stated. Target14–16 precedes answers17–23: A(60,8), B(50,10), C(70,10), net+10; own price does not itself shift the line. |
| 1.2.3 | Slides4–12 fix common product, period, units, price and disjoint buyers. 9+10=19, not their mean. Q=29−5P is valid only toP5; atP6 buyerA contributes0, buyerB2. Target14–16 precedes answers17–23: Q=42−5P throughP6 ends at(12,6), not at a false price-axis intercept; atP8 total0+8=8, not a negative contribution. |
| 1.2.4 | Slides2–6 retrieve discrete buying separately from group demand and inverse notation. Own Q=48−4P is limited toP9; the +8 substitute shift has the same stated interval. Target8–13 precedes answers14–21: Q=60−6P toP8, old36, inverseP5 for30, own-price−12 and substitute+12, final36. Sem wants2 half-hours and is already inA. Slide22 postpones claims about realized trade until supply information exists. |
| 1.3.1 | Slides3–13 distinguish supply plan per period from inventory and actual sales, individual q from market total, price movement from input-cost shift, and known versus unknown net effects. The own q=3P−12 /3P−18 lines stop at their domains; atP8 supply12→6. Target15–18 precedes answers19–25: q=4P−40 /4P−52, P20→24 gives40→56→44, net+4. Graph16 is the supplied beginning line. |
| 1.3.2 | Slides5–6 explicitly teach solving P on both sides and checking both equations, before progressive graph8–10. The own market givesP10/Q32. Separate P8/P12 comparisons distinguish shortage/surplus16 from conditional sales24. Target18–20 precedes answers21–28: 150−10P=5P−30 givesP12/Q30; atP10 plans50/20 yield shortage30 and sales20 only under the supplied matching conditions. |
| 1.3.3 | Slides6–9 evaluate increased demand at the old price first (48 vs30), then solve17/39. Slides10–12 reset original demand for the metal-cost case (new17/21). Slide13 uses a separate qualitative two-shift case: quantity down, price indeterminate, not necessarily unchanged. Target15–18 precedes answers19–26: old12/40, new14/50, Q+25%; graph25 distinguishes fixed-price40→60 at12 from movement along supply40/12→50/14. |
| 1.3.4 | Slides3–5 use a separate technique example: old8/40, new supply52 at old price, new7/44. Target7–13 precedes answers14–22: old10/80, new supply40 at old10, then new12/60; price+20%, quantity−25% use separate old bases. Graph19–20 distinguishes supply80→40 atP10 from movement along unchanged demand80/10→60/12. SourceC resets toP14/new supply, yielding demand40, supply80, surplus40 and conditional sales40, with different meanings. Neither equilibrium nor the4.6/5 design rating proves universal satisfaction. |

This sequence explicitly prepares the transformations needed by later assigned work: percentage bases and algebra before economic models; finite purchase choices before a separate linear model; fixed-price comparison before aggregation; individual supply before joint equilibrium; joint equilibrium before changed equilibrium. Domains, actor counts and time/quantity units are restated when contexts change. The parameterized own examples and real targets do not silently share observations or causal histories.

I also read the unchanged Book2 §2.1.1 start source and saved slide1/notes as a forward-boundary check. Its first task supplies R=40+3N and retrieves substitution/division; the second introduces new cost classification/GCK with visible p2–4 support and an explicit revisit. Thus the Book1 ending correctly retrieves arithmetic/geometry while leaving the new cost/surplus meanings to Book2. This is a boundary check, not a new full Book2 review.

## Retirement, maintenance code, and tests

The final lesson diff contains exactly 36 additions (24 deck files and12 evidence notes),12 finite obsolete-presentation/support deletions,4 exact old-entry link/tile transformations, and the current-series map update. No manuscript, answer, teacher guide, sealed student PDF, archive, other-book content or deployment change is in that diff.

I inspected the meaningful bounded maintenance changes against the base: the classroom adapter and negative tests; immutable base/376-binding verification; traversal/symlink checks; union of committed/index/worktree/untracked scope; the exact retirement transforms and independent HEAD/index protection; route selection in the classroom/paired CI wrappers; deterministic historical fixture relocation; historical-output destination protection; original-input Y1 evidence semantics; the PowerPoint session mutex; and the finite general-lane classifier from cde13b82/cc678ddd. The six extra support paths are literal finite paths, with nearby images/shared files and other books rejected. Classification is not an exemption from the stronger classroom content/source guard. Historical capture reuse is explicitly labeled as not attesting retired current pages.

My own final `check-classroom-edition.js --require-tracked` run passed on the bound clean pair, verifying376 sealed bindings and the finite additions/retirements. My own four relevant Jest suites passed **78/78**: classroom scope, paragraph lane scope, Y1 evidence and historical presentation registry. Raw outputs are `scope-check.json` and `focused-tests.json` under the independent review directory.

I independently read and hashed the coordinator's full-suite raw result: **143 passed suites,6 pending;2,329 passed tests,8 pending,0 failures**. Its SHA-256 matches `technical-local-checks.json`. The shared-code changes are unchanged from the recorded run start; later commits add paragraph payload/records. This is inspected coordinator-run evidence, not a full-suite run by me. Earlier failures and their resolutions are disclosed, not erased. The late Y1 wrapper run that overlapped untracked/staged report creation is not passing final proof; the coordinator reports a subsequent clean current-lesson fallback pass. Final published exact-head wrapper/CI and cross-pair compatibility remain separate integration evidence.

## Cold-run provenance and scope of the result

The production record discloses twelve fresh no-history author prompts of the form `Build the PowerPoint for paragraph 1.X.Y.`, plus their dedicated-pair/environment wrapper. I inspected the recorded seeds and their Git deltas: dbaf16bf for2 authors;27536dc2 for5 authors adds generic output-stem guidance;04a549d4 for5 authors adds the exact edition-qualified manifest filename. All start from lesson173aa9a8. The later seeds contain no newly authored sibling deck content. This supports the stated minimal-prompt workflow; it is not one immutable-seed experiment.

Dedicated Git worktrees share the host filesystem. The records appropriately avoid claiming OS isolation, twelve flawless first attempts, or absence of author self-repair. Intermediate final-version paths and per-deck records disclose layout, label, notation, coverage and precision repairs before handoff. My exact completed-author Git-blob comparison independently confirms no PPTX/PDF changes after completed handoff; integration filename/reference normalization is separately disclosed. No broad inference about guaranteed quality on future runs is justified. The observed result is a successfully reviewed twelve-deck batch, with required final review still part of the workflow.

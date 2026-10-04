# Textbook maintenance · October 2026

This owner-requested maintenance pair corrects eight current-edition findings.
It does not replace exercises or release curriculum/target holds. Book 2,
first-edition Book 1 history, received packages and prior review receipts remain
unchanged. The existing Part B companion workflow remains separate; three
classroom presentations receive only the directly dependent corrections.

## Content and publication scope

| Finding | Correction and current evidence |
|---|---|
| SRC-411-CAP-01 | Student and answer initial aggregate supply stop at Q = 25 thousand kg/week, P = €14. The original 100 firms each have capacity 250 kg. Post-entry supply A₁ remains unchanged. Student p14; answer p6. |
| SRC-43-DOMAINS-01 | Four student/answer figure pairs use the stated wage domains: §4.3.2 €4–€24; §4.3.3 €2–€24; §4.3.4 €2–€22; §4.3.5 €4–€24. Equations, axes and assessed equilibria are unchanged. Student pp130,139,147,152. |
| SRC-433-REMEDIAL-01 | Answer 27 points to §4.1.3 for marginal revenue, not §4.1.2. Complete answer p62. |
| SRC-435-ANSWER-IDS-01 | Answer containers/anchors now identify exercises 37–41 consistently with their visible headings and subanswers; extraction and links are checked. |
| Additional answer typo | Answer 39 says “Een minimumloonregel boven de markt”. Complete answer p66. |
| B3-GLOSSARY-W | Welfare loss covers missed beneficial trades and additional costly trades. The no-external-effects model and government receipts/expenditure remain explicit. Student p127. |
| B3-331-PRINT-HEADING | Three run-in Markdown headings render as headings on pp88–90; no literal `###` remains. |
| BOOK1-133-OP27-SCAFFOLD | A complete, distinct wool-scarf example precedes exercise 27 on p114: two independent left shifts, isolated effects, smaller quantity and undetermined price direction. The one-shift summary on p111 is qualified. Exercises 27/28 and all target operations are preserved. |

The complete page counts remain Book 1 **132 / 66 / 28**, Book 3 **132 / 74 / 22**,
Book 4 **166 / 68 / 28** (student / answers / teacher). The 303 complete-book
links retain their rectangles and destinations. Book 1 source/question spreads
40–41, 80–81 and 120–121 remain facing. No presentation page reference shifts.
The repaired §4.1.1 and §4.3.5 decks show the corrected source figures; §4.3.2
notes no longer describe an outstanding textbook domain defect. All 73 slide
bodies retain their text; only two slide rasters change. Native charts, tables
and workbooks are preserved byte for byte.

The existing NAV1 repair, answer heading “Herhaling 29 en 30” and delivered
TIMING34 teacher advice remain closed. Empirical time, completion and support
needs are still unmeasured. Existing Book 2 print trade-offs and curriculum holds
are outside this maintenance scope.

## Rebuild and verification

Use the pinned packages in `build-scripts/books/book1_second_edition/requirements.txt`
and the recorded font/native-library environment. Build both the accepted
baseline and revised sources in that environment:

```text
python build-scripts/books/rebuild_textbook_maintenance.py --lessons ../4veco-lessen --fonts /absolute/path/to/Lato
python build-scripts/books/book1_second_edition/targets.py --lessons ../4veco-lessen
python build-scripts/books/book1_second_edition/review_snapshots.py --lessons ../4veco-lessen
python build-scripts/books/verify_textbook_maintenance.py --lessons ../4veco-lessen
python build-scripts/books/verify_textbook_maintenance_presentations.py --lessons ../4veco-lessen
```

The controller explicitly rebuilds affected answers before assembly, reuses the
NAV1-preserving assembler, refreshes target source/figure hashes and exports
paragraphs from rebuilt chapters. Unchanged dependencies may retain accepted
bytes only after same-environment text, pixel and navigation comparison.
After retaining equivalent chapter bytes, run the existing Book 1
`book/prepare_inputs.py` and `book/validate_book.py` with `BOOK1_EDITION_ROOT`
set to the current edition. This records the saved assembly inputs and repeats
all assembly checks; a pre-restoration hash list is not current evidence.
There is a visually imperceptible render-rounding change on Book 3 p124 in the
phrase “Vier blijvende controles” (span width differs by 0.01129 pt); it is not
another manuscript change. No source page was deleted to preserve pagination.

`repair_textbook_maintenance_presentations.py` starts from the exact accepted
PPTX packages, applies only the named corrected notes/current source references
and two rasters generated from the current SVGs, and leaves all other package
parts unchanged. The owning `.mjs` modules and source manifests carry the same
corrections for future full builds. Export with `render-powerpoint.ps1`, inspect
the final slides and run the saved-package checks. Historical presentation
reviews describe their original commits and are not relabelled as current.

The new finite successor gate validates the actual accepted predecessor with
its original code at platform `7f924b57` / lessons `99c5eb41`. It separately
binds current paths/bytes and the independent review. Previous receipts remain
historical evidence. A new manifest alone never grants PASS. Platform-first is
the supported proposed merge order; this document does not authorize merging.

## Issue reconciliation

The following distinguishes obsolete production instructions from still-open
authority. The original issue bodies and their exact approvals remain history.

| Issue/item | Current disposition | Evidence and remaining boundary |
|---|---|---|
| #221 B1-E2-01 | Old production brief superseded; formal target equivalence **open** | The owner selected a new second edition with separate target identity. Its §1.1.4 is reviewed as that edition, not as fulfillment of the old exact reviewed target. Do not copy `reviewed_final` or old curriculum mappings. |
| #221 B1-E2-02 | **Completed** for the current edition | §1.2.2 now says “Hierna tel je de vraag van kopers op”, correctly leading to collective demand. |
| #221 B1-E2-03 | **Completed** as an editorial-depth review | Current H2 teacher guidance limits work to a common-interval sum, then recalculation per buyer. Formal kink/piecewise notation is not an independent requirement. Target 30 retains bounded drawing and zero demand above a buyer's limit; the current §1.2.3 independent review covers this. |
| #221 B1-E2-04 | **Completed** for the current edition | §1.2.1 labels surplus “Eerste kennismaking” and defers formal areas to Book 2. Teacher handoffs preserve later formal cost, marginal, elasticity and surplus teaching. Familiarity is not prerequisite mastery. |
| #221 B1-E2-05 | Current navigation defect **completed** | Current entry/edition manifest expose twelve paragraphs in 1.1–1.3. Old 1.4/1.5 compatibility URLs and the exact first-edition archive remain historical; physical deletion is neither claimed nor required by this edition's preservation policy. |
| #223 Gates 0A–0C | **Historically complete** | The accepted audit, foundation, goals and exact target-authority integration remain valid for their named payloads. The two §2.1.1 integration holds already released by #227/#228 are not reopened. |
| #223 Gates 1–3 | Old production route **superseded for current delivery; not passed** | The selected chat-2026 edition is the current book. There is no evidence that its import automatically completed the earlier blank-slate authoring/review gates for the exact approved target. Exact-target alignment/authority decisions remain open separately. |

Both issues retain their unresolved authority questions. This maintenance does
not release `H-213-OPC2`, `H-221-PRIOR`, `H-22-ELASTIC-CONTRAST`,
`H-BOOK2-ROOT-PLAN` or `H-CHAPTER-23-PLAN`, and does not approve the held PV
templates or Books 3/4 target candidates.

## Teacher planning and the separate timing pilot

The earlier Book 1 design estimate of **1,381 minutes already required at least
26 complete lessons of 55 minutes**. Five provisional minutes for the new
worked example make **1,386 minutes**, again at least 26 lessons, before extra
repetition and carry-over. These are design estimates, not measured fits.

For a small classroom pilot, record per paragraph: class size and prior
preparation; minutes for explanation/example, guided practice, independent work,
target and feedback; number and percentage completing each phase; how many
needed a brief cue, repeated explanation or individual support; and work
carried into the next lesson. Retain the complete supported route and target.
Compare at least two classes or repeated deliveries before making a common
planning recommendation. Use aggregate counts rather than named pupil records.
The pilot is a separate research follow-up; this repair contains no invented
observations or guarantee of a universal 55/110-minute fit.

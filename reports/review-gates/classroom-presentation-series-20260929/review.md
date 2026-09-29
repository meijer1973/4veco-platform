# Book 2 classroom presentation series — 29 September 2026

Status: **PASS for the final artifacts and instructional continuity.** The
first batch exposed a shared opening-support defect; the repaired recipe and
two fresh cold regressions now pass. Publication and exact-head CI status are
recorded in the paired PRs; this review grants no merge authority.

## Question and experiment

Can independently produced paragraph decks form a coherent teaching sequence?
The requested scope is missing §2.1.3 plus the complete next chapter,
§2.2.1–2.2.4, viewed after/alongside existing §§2.1.1, 2.1.2 and 2.1.4.
This review distinguishes file quality, instructional continuity and actual
classroom effectiveness. Only the first two can be established here.

Each author received exactly `Build the PowerPoint for paragraph <id>.`, with
the relevant id substituted and no other task text. Five fresh ephemeral agent
sessions used isolated paired worktrees, the user's configured default model,
no parent conversation, no paragraph answer plan and no peer output. Up to
three authors ran concurrently. All five pairs were created from the same
immutable commits before production, including the later scheduling wave:

- Platform: `7ed2500f53fbd29bd0863dfd84b4fd6df57dc34f`.
- Lessons: `f2660032cf7e4e3bbab96cf32863d06a38bd74bc`.

[Initial run records](initial-runs.json) preserve exact prompts, times, source
baselines, output commits and SHA-256 hashes. Original commits remain available
through their original PRs. Child author reviews are evidence for the individual
deck, not substitutes for the subsequent serial review.

| Initial paragraph | Slides | Platform PR | Lessons PR | Initial serial finding |
|---|---:|---|---|---|
| 2.1.3 | 27 | [265](https://github.com/meijer1973/4veco-platform/pull/265) | [64](https://github.com/meijer1973/4veco-lessen/pull/64) | New MK required at start before instruction; no exploration support |
| 2.2.1 | 22 | [263](https://github.com/meijer1973/4veco-platform/pull/263) | [62](https://github.com/meijer1973/4veco-lessen/pull/62) | New Ev classification required at start before instruction |
| 2.2.2 | 26 | [264](https://github.com/meijer1973/4veco-platform/pull/264) | [63](https://github.com/meijer1973/4veco-lessen/pull/63) | New local revenue rule labelled retrieval at start |
| 2.2.3 | 28 | [267](https://github.com/meijer1973/4veco-platform/pull/267) | [66](https://github.com/meijer1973/4veco-lessen/pull/66) | New Ei/Ek and scenario operations required at start without visible support |
| 2.2.4 | 23 | [266](https://github.com/meijer1973/4veco-platform/pull/266) | [65](https://github.com/meijer1973/4veco-lessen/pull/65) | PASS: complete recall and synthesis, with no unsupported prerequisite |

The initial cohort therefore needs revision: four theory openings need support;
the mixed lesson passes. The [independent 223/224 review](initial-223-224-review.md)
records all 51 slides and 51 PDF pages, source checks and exact hashes.

## Finding and attribution

The initial recipe maps the book's Startopgaven to an opening assignment before
instruction. It does not distinguish retrieval from a first encounter. Exercise
2 asks for new MK in §2.1.3 (p.23), new elasticity labels in §2.2.1 (p.40), and
the new local revenue rule in §2.2.2 (p.48). The respective explanations occur
later in those decks. No visible theory support or explicit exploratory status
was provided. Teacher-only start answers do not supply that pupil support.

The textbook does teach these operations before its printed Startopgaven:
§2.1.3 p.19–20, §2.2.1 p.36–38, §2.2.2 p.45. H2's
`bronnen/H2/Docenten_en_bouwverantwoording.md`, line 87, permits exercise **1**
as a paper opening and explicitly preserves theory → worked example → summary
→ Startopgaven in print. This is a classroom conversion issue, not evidence of
missing textbook teaching. The same latent opening issue exists in accepted
§2.1.1 exercise 2 (especially GCK; p.2–4) and §2.1.2 exercise 2 (TO/GO/profit;
p.10–11). No textbook source or signed edition file is changed.

Independent reviewer `review_workflow` reached this P2 finding without reading
the root review notes. The reviewer read all three initial decks' slide text
and notes, checked the actual book pages/answers and reviewed the candidate
instruction diff. After the opening, no further prerequisite gap was found
in those three decks. That review was a content/continuity review, not a full
visual audit; separate artifact inspection is recorded below.

The repaired recipe preserves the teacher's start numbers. Authors must trace
required operations to real prior teaching or to instruction in the new lesson.
First encounters get visible, verified theory support and an exploratory label;
teacher notes specify how to use it and return to the item before independent
practice. This is conditional on each item's actual demands. New batch guidance
requires frozen independent production, preservation of first outcomes and
review in teaching order, with gaps traced to the workflow or textbook.

## Representative cold regression

Two fresh authors received exactly `Build the PowerPoint for paragraph 2.2.1.`
and `Build the PowerPoint for paragraph 2.2.3.`. Both use platform
`17abbe86731a60efa8d7936180d0478bf6e58831` (only the reusable instruction repair
over the original baseline) and the original lessons commit. None of the five
new outputs or review findings is in that seed. The sessions overlap and receive
no feedback. This tests a first elasticity definition and a more demanding
lesson with income/cross elasticity and multiple-variable functions. It is a
representative regression, not a claim of exhaustive paragraph coverage.

[Regression run records](regression-runs.json) preserve both completed runs.
The fresh §2.2.1 has 24 slides; its [independent acceptance](regression-221-review.md)
passes content, notes, all native slides and all PDF pages. It visibly marks
start 2 as exploration with p.38 and returns to it on slide 12 before practice.
The fresh §2.2.3 has 30 slides, theory support p.53–56 and an explicit return
on slide 15. Its [independent review](regression-223-review.md) passes all 30
native slides, 30 PDF pages, saved notes and the final §221–§224 continuity.
Neither author received paragraph coaching or another author's new output.

The original §223-specific checker was tied to its superseded 28-slide source
and examples; it is omitted from the final change rather than presented as
proof of the new 30-slide deck. The scoped saved-package, source, target,
arithmetic and visual reviews apply to the actual replacement. A small
[manifest-only encoding correction](223-metadata-correction.json) makes 25
§223 metadata titles match the actual saved titles. Its builder, PPTX and PDF
remain byte-identical to the cold handoff. The same inherited title encoding
in the §211 reference manifest is corrected; current and original reference
artifact identities are explicitly separate. These are metadata repairs,
not additional successful cold-production claims.

## Instructional continuity in the assembled sequence

| Teaching step | Earlier teaching / first formal explanation | Later use and relevant boundary |
|---|---|---|
| Totals and averages | 2.1.1 slides 3–9; real target 13–22 | 2.1.2–2.1.4: period, capacity, € per period vs € per product |
| Revenue and profit | 2.1.2 slides 3–4 | 2.1.3/2.1.4 and 2.2.2: TO=P×Q; profit requires subtracting TK |
| Break-even and graphs | 2.1.2 slides 5–11 | 2.1.4 synthesis; 2.2.2 changes from TO/Q vertical distance to P/Q revenue area and explicitly identifies the axes |
| Marginal operations | 2.1.3 slides 3–11, checks 12–13 | 2.1.4 slides 6/18/21–22: unequal ΔQ, interval average, rising MK, no profit-maximization claim |
| Signed Ev and percentages | Fresh 2.2.1 slides 3–11; return to start 12; practice 13 | 2.2.2–2.2.4: old-value denominator, unitless signed ratio, relative magnitude, bounded measurement |
| Revenue response | 2.2.2 slides 3–12, check 13–14 | 2.2.4: exact before/after TO, finite changes multiply factors, local rule is not a universal finite-step guarantee |
| Ei/Ek and demand functions | Fresh 2.2.3 slides 2–8 ratios/categories; 9–13 substitution/units/reset; 14 separate-study limits; return 15; practice 16 | 2.2.4: distinguish denominators/sign meanings, name both goods, keep annual-income units, isolate/reset scenarios |
| Multi-source advice | Book 2.2.4 practice 4; deck 2.2.4 slides 2–5 recall/support | Target 5 combines at least two sources, one supported conclusion and exactly two unsupported conclusions; regional D stays separate from A |

The final sources/notes were read in this order, with each later demand checked
against the earlier explanation. §221's percentage bars are not demand curves;
§222 explicitly introduces P/Q axes and revenue as area, after §212 used TO/Q
axes and profit as a vertical distance. §223 connects the familiar ratio to
new denominators and does not transfer the negative-Ev labels to Ei/Ek. It
refreshes simple substitution before introducing the full function, then shows
why Y must be reset before the separate Pz scenario. §224 retrieves these
operations before asking pupils to combine evidence in the actual target.

Book 1 uses “normal” broadly for a positive income response; this Book 2
chapter explicitly uses the narrower `0 < Ei < 1` category. §223 slide 6 says
“Categorie in dit boek”, and the notes explain the convention and boundaries.
The serialized review checks this as an explicit convention, not a silent
change in meaning or a claim that the broader definition is wrong. No missing
textbook explanation or unresolved contradiction was found in the reviewed
target operations. This does not assert mastery in a particular class.

## Final delivery selection

[Final artifact identities](final-artifacts.json) bind all eight PPTX/PDF
pairs, slide counts, notes and native objects. There are **205 slides** in the
assembled sequence, including **130 slides in the five newly supplied lessons**.

| Paragraph | Slides | Selected revision |
|---|---:|---|
| 2.1.1 | 23 | Existing reference with scoped opening/notes repair |
| 2.1.2 | 28 | Existing accepted deck with scoped opening/notes repair |
| 2.1.3 | 27 | Initial cold deck with scoped opening/notes repair |
| 2.1.4 | 24 | Previously accepted FietsWas deck, unchanged |
| 2.2.1 | 24 | Fresh cold regression, artifact bytes unchanged |
| 2.2.2 | 26 | Initial cold deck with scoped opening/notes repair |
| 2.2.3 | 30 | Fresh cold regression, artifact bytes unchanged; manifest titles corrected |
| 2.2.4 | 23 | Initial cold deck, artifact bytes unchanged |

All files live beside their paragraph's other materials in the lesson edition;
the lesson repository map links them in teaching order. First-cohort outcomes
remain separately identifiable; a repaired delivery is not called a first-run
pass. The two fresh tests provide representative evidence for the repaired
rule, not a guarantee for every paragraph or unlimited parallel production.

## Source-level repairs and artifact checks

§§2.1.1, 2.1.2, 2.1.3 and 2.2.2 receive later source-level repairs, not new
cold-production claims. Their shared overviews identify the supported start
item and book pages. Notes specify prior/new operations and a return after
instruction. Numbers, the teaching example, practice and actual target remain
unchanged. The manifest records that revision.

[Repair comparisons](repairs.json) record the before/after hashes. After
normalizing only generated creation IDs and resolving relationship IDs to
their actual targets, the only changed slide/note XML parts are the three
overviews in each deck. All other PDF pages are pixel-identical to the
preserved versions at 72 dpi. Every visible text line survives on its matching
PDF page. Each changed native PowerPoint overview and each opening PDF page
was inspected individually at readable size. No clipping or overlap was found.
The actual saved notes contain the support/return instructions at the 14 pt
floor. Finalizer package, geometry, native objects and reimport checks passed.

The independent reviewer accepted these repairs. Two minor prerequisite-trace
wording errors in the parent's first revision were corrected and rechecked
against the saved notes: §213 start 1 uses TK, TO and profit; §222 start 1 uses
TO and its percentage change. The [dated narrow closure](initial-223-224-review.md#narrow-repair-closure--later-on-2026-09-29)
binds the final §213/§222 hashes. Those corrections changed notes only; their
PDF pages are pixel-identical to the preceding visually accepted repair.

The root reviewer inspected every original 2.1.3 native slide (27), every
original 2.2.1 PDF page (22) and every original 2.2.2 native slide (26), read all
their text/notes and checked target arithmetic against the manuscript and
answer model. For 2.2.1, all PDF pages were also compared to the PowerPoint
renders; differences were antialiasing. No visual/content repair was needed
outside the opening-phase finding. For 2.1.3, unequal intervals and rising MK
are demonstrated. For 2.2.2, native XY rectangles have correct straight edges,
coordinates, shared axes and areas; revenue is distinguished from profit.

Chart workbook checks on the four repaired decks passed: 211 has 2 charts/
40 cells, 212 has 6/60, 213 has none, 222 has 2/30. The 212 source/graph/notes/
overview checker and 222 rectangle geometry checker also passed. Zero-chart
results establish absence, not chart-data validation.

The final assembled series passes the scoped review. The
[source binding check](source-bindings.json) verifies all 45 declared sources
across eight manifests against immutable source commits. Current textbook
source bytes also match; the older visual reference used by the initial §222
author stays bound to its recorded commit, not confused with the repaired §211.
Every visible text run in all 205 saved slides is present on its corresponding
PDF page. Source syntax, skill mirror and diff hygiene pass. The tracked-byte
edition adapter passes with all **1,480 signed files preserved** and 24 bounded
classroom additions (eight existing/new PPTX/PDF/evidence sets relative to the
sealed edition). Final lane checks and hosted CI are recorded with publication.

Paired integration worktrees: `C:/wt/ppt/4veco-platform` and
`C:/wt/ppt/4veco-lessen`; branch `codex/ppt-series-20260929`; task owner
`ppt-series-20260929` / `codex-ppt-series`. The original five draft PR pairs are
superseded by one consolidated pair after preserving their exact outcomes.
The two regression branches remain pushed without separate PRs. No merge,
deployment, full companion acceptance, measured classroom timing or learning
effectiveness is claimed. Temporary author/review outputs remain outside the
repositories; automatic approval review blocked requested scratch cleanup.

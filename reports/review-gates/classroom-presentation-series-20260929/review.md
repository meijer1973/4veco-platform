# Book 2 classroom presentation series — 29 September 2026

Status: production and review in progress. The initial batch is preserved;
the fresh regression and final assembled-series verdict are not yet complete.

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
through their draft PRs. Child author reviews are evidence for the individual
deck, not substitutes for the subsequent serial review.

| Initial paragraph | Slides | Platform PR | Lessons PR | Initial serial finding |
|---|---:|---|---|---|
| 2.1.3 | 27 | [265](https://github.com/meijer1973/4veco-platform/pull/265) | [64](https://github.com/meijer1973/4veco-lessen/pull/64) | New MK required at start before instruction; no exploration support |
| 2.2.1 | 22 | [263](https://github.com/meijer1973/4veco-platform/pull/263) | [62](https://github.com/meijer1973/4veco-lessen/pull/62) | New Ev classification required at start before instruction |
| 2.2.2 | 26 | [264](https://github.com/meijer1973/4veco-platform/pull/264) | [63](https://github.com/meijer1973/4veco-lessen/pull/63) | New local revenue rule labelled retrieval at start |
| 2.2.3 | 28 | [267](https://github.com/meijer1973/4veco-platform/pull/267) | [66](https://github.com/meijer1973/4veco-lessen/pull/66) | Independent serial review pending |
| 2.2.4 | 23 | [266](https://github.com/meijer1973/4veco-platform/pull/266) | [65](https://github.com/meijer1973/4veco-lessen/pull/65) | Root content review finds complete recall and synthesis; independent serial review pending |

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

Two fresh authors receive exactly `Build the PowerPoint for paragraph 2.2.1.`
and `Build the PowerPoint for paragraph 2.2.3.`. Both use platform
`17abbe86731a60efa8d7936180d0478bf6e58831` (only the reusable instruction repair
over the original baseline) and the original lessons commit. None of the five
new outputs or review findings is in that seed. The sessions overlap and receive
no feedback. This tests a first elasticity definition and a more demanding
lesson with income/cross elasticity and multiple-variable functions. It is a
representative regression, not a claim of exhaustive paragraph coverage.

Results and final output selection: pending.

## Instructional continuity to verify in the final assembly

| Teaching step | Earlier teaching / first formal explanation | Later use and relevant boundary |
|---|---|---|
| Totals and averages | 2.1.1 slides 3–9; real target 13–22 | 2.1.2–2.1.4: period, capacity, € per period vs € per product |
| Revenue and profit | 2.1.2 slides 3–4 | 2.1.3/2.1.4 and 2.2.2: TO=P×Q; profit requires subtracting TK |
| Break-even and graphs | 2.1.2 slides 5–11 | 2.1.4 synthesis; 2.2.2 changes from TO/Q vertical distance to P/Q revenue area and explicitly identifies the axes |
| Marginal operations | 2.1.3 slides 3–11, checks 12–13 | 2.1.4 slides 6/18/21–22: unequal ΔQ, interval average, rising MK, no profit-maximization claim |
| Signed Ev and percentages | 2.2.1 final slide anchors pending | 2.2.2–2.2.4: old-value denominator, unitless signed ratio, relative magnitude, bounded measurement |
| Revenue response | 2.2.2 slides 3–12, check 13–14 | 2.2.4: exact before/after TO, finite changes multiply factors, local rule is not a universal finite-step guarantee |
| Ei/Ek and demand functions | 2.2.3 final slide anchors pending | 2.2.4: distinguish denominators/sign meanings, name both goods, keep annual-income units, isolate/reset scenarios |
| Multi-source advice | Book 2.2.4 practice 4; deck 2.2.4 slides 2–5 recall/support | Target 5 combines at least two sources, one supported conclusion and exactly two unsupported conclusions; regional D stays separate from A |

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

Final series outcome, edition preservation, lane checks, publication and CI:
pending. No classroom timing/learning trial or merge authorization is claimed.

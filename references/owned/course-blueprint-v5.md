# Course Blueprint v5 - Four Test-Week Book Plan

Status: L1.5Q Phase B curriculum-source version
Version: v5
Structural revision: `book34-lesson-balance-v3-20260915`
Change review: `reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-V3-20260917.md`
Active target-exercise registry: `references/authored/course-target-exercises.json`

## Purpose

This blueprint is the active curriculum-source document for the 2026/27 planning model. It replaces the v4 assumption that each book has four theory chapters plus a printed test-preparation chapter. The target-exercise registry remains the stronger exercise-first source of truth; this prose explains the book structure, test-week model, migration decisions, and boundaries for future production.

## Core Decisions

- Each formal test week corresponds to one book.
- Student-facing message: the test is about this book.
- Test-preparation packages are web-only and are not printed chapters.
- Optional mid-book checks may exist as formative web diagnostics or quizzes.
- Count-bearing paragraphs include theory paragraphs and gemengde-opgaven paragraphs.
- Gemengde-opgaven paragraphs introduce no new theory; they consolidate and transfer.
- Target-exercise placeholders are allowed during migration, but they are not reviewed-final learning-quality evidence.

## What Changed From v4

| v4 assumption | v5 decision |
| --- | --- |
| Every book has a printed Chapter 5 for test preparation. | Test preparation is web-only and outside the printed paragraph count. |
| Each book has two formal test moments. | Each formal test week maps to exactly one book. Optional checks are formative only. |
| Book 1 included costs, revenue, marginal analysis, and test preparation. | Book 1 print scope is 12 paragraphs: foundations, demand, supply, equilibrium, shifts. |
| Consolidation/gemengde-opgaven paragraphs were not target-exercise records. | They are count-bearing v5 curriculum units with explicit no-new-theory records. |
| v4 target-exercise registry had 49 records. | The original v5 registry had 54 records; the selected Book 3/4 structural revision now has 55. |

## Book Counts

| Book | Count-bearing paragraphs | Formal test-week scope |
| --- | ---: | --- |
| Book 1 | 12 | Test week 1: Book 1 |
| Book 2 | 12 | Test week 2: Book 2 |
| Book 3 | 14 | Test week 3: Book 3 |
| Book 4 | 17 | Test week 4: Book 4 |

These counts are guarded by `scripts/check-course-target-exercises-v5.js`. The checker also verifies that test preparation is web-only and that placeholders are visibly non-final.

## Book-Level Intent

### Book 1 - Grondslagen, vraag en aanbod

Book 1 becomes the lean opening book for the first formal test week. It teaches economic thinking, percentages/index numbers, graph/table reading, demand, supply, equilibrium, and shifts. Costs, revenue, and marginal analysis are deliberately excluded from the printed Book 1 scope so the first book is realistic for the publisher and the classroom calendar.

### Book 2 - Kosten, opbrengsten, elasticiteit en surplus

Book 2 absorbs the Book 1 production material that was cut from print: costs, revenue, break-even, and marginal concepts. It then moves into elasticity and surplus/welfare foundations. This preserves prerequisite order before government intervention and market structures.

### Book 3 - Overheidsingrijpen, concurrentie en internationale handel

Book 3 retains 14 paragraphs (6+4+4): intervention, short-run price-taking firm decisions, then qualitative/source-led trade. The limited derivative is taught in 3.2.2; feasible output/profit choice in 3.2.3. Long-run entry/exit and zero economic profit are first assessed in Book 4. Trade does not require monopoly or formal labour productivity/unit-labour-cost calculations. Comparative advantage remains qualitative; no opportunity-cost-ratio algorithm or exchange-ratio bounds. [Adopted Book 3 outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md).

### Book 4 - Monopolie, marktfalen en arbeidsmarkt

Book 4 retains 17 paragraphs in 5+7+5. Chapter 4.1, Van concurrentie naar monopolie, starts with moved long-run competition (4.1.1), followed by monopoly and independent consolidation. Chapter 4.2 retains seven lessons; Chapter 4.3 retains five, ending with mixed labour practice in 4.3.5. The former v2 4.3.5 cao/vakbonden/agreement-policy lesson is deferred, with no later-year ID or time allocation yet. It is not a hidden prerequisite of the new mixed lesson. Tax/subsidy and price-floor methods transfer to externalities and minimum wages; formal productivity/unit-labour-cost calculations first occur in 4.3.1. [Adopted Book 4 outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md).

## Migration Notes

- The version-qualified [v2-to-v3 migration](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/paragraph-migration-v2-to-v3.csv) controls reused IDs. The 31 supplied targets are filled candidates, never automatic final approvals.
- Student chapter caps are Book 3: 50/40/40; Book 4: 50/60/50 pages. The five lesson-time questions 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5 remain open. No timing certification is implied.

- Book 1 follows the L1.5P print scope: 12 paragraphs, no printed test-preparation chapter.
- Book 1 cost, revenue, and marginal-analysis material is moved to later books rather than deleted.
- Government intervention, monopoly, and market failure are shifted forward.
- Inflation and late macro material are parked for a later year and are not count-bearing in v5.
- The retained v2 trade boundary replaces the old two-paragraph trade block. The [version-qualified migration](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/migration-live-v5-to-v2.csv) records partial overlap and absorbed operations; numerical IDs alone never establish target equivalence.

## Target-Exercise Record Status

| Status | Meaning | Closure boundary |
| --- | --- | --- |
| `migrated_from_v4_needs_v5_review` | Existing v4 target exercise reused or renumbered into v5. | Valid migration evidence; not yet a final v5 quality review. |
| `placeholder_needs_review` | New or consolidation record created so the count-bearing unit is explicit. | Cannot be treated as reviewed final; needs future teacher-learning-quality review. |
| `reviewed_final` | Reserved for target exercises that pass a later quality review. | Not used by this migration unless explicitly reviewed. |

The full target-exercise distribution audit is deferred to L2.4-TEA. L1.5Q may close with placeholders only because the placeholders are visible and mechanically checked.

## Table Of Contents

### Book 1

| Paragraph | Kind | Title | Status |
| --- | --- | --- | --- |
| 1.1.1 | theory | Schaarste en economisch denken | migrated_from_v4_needs_v5_review |
| 1.1.2 | theory | Percentages en indexcijfers | migrated_from_v4_needs_v5_review |
| 1.1.3 | theory | Grafieken en tabellen | migrated_from_v4_needs_v5_review |
| 1.1.4 | gemengde_opgaven | Gemengde opgaven: economisch denken en rekenen | placeholder_needs_review |
| 1.2.1 | theory | Individuele vraag | migrated_from_v4_needs_v5_review |
| 1.2.2 | theory | Vraagfactoren | migrated_from_v4_needs_v5_review |
| 1.2.3 | theory | Van individuele naar collectieve vraag | migrated_from_v4_needs_v5_review |
| 1.2.4 | gemengde_opgaven | Gemengde opgaven: vraag | placeholder_needs_review |
| 1.3.1 | theory | Aanbod | migrated_from_v4_needs_v5_review |
| 1.3.2 | theory | Marktevenwicht | migrated_from_v4_needs_v5_review |
| 1.3.3 | theory | Verschuivingen en nieuw evenwicht | migrated_from_v4_needs_v5_review |
| 1.3.4 | gemengde_opgaven | Gemengde opgaven: aanbod en marktevenwicht | placeholder_needs_review |

### Book 2

| Paragraph | Kind | Title | Status |
| --- | --- | --- | --- |
| 2.1.1 | theory | Kostenstructuren | reviewed_final |
| 2.1.2 | theory | Opbrengsten, winst en break-even | reviewed_final |
| 2.1.3 | theory | Marginale kosten en marginale opbrengsten | reviewed_final |
| 2.1.4 | gemengde_opgaven | Gemengde opgaven: kosten en opbrengsten | reviewed_final |
| 2.2.1 | theory | Prijselasticiteit | reviewed_final |
| 2.2.2 | theory | Elasticiteit en omzet | reviewed_final |
| 2.2.3 | theory | Inkomenselasticiteit en kruiselingse elasticiteit | reviewed_final |
| 2.2.4 | gemengde_opgaven | Gemengde opgaven: elasticiteit | reviewed_final |
| 2.3.1 | theory | Consumentensurplus | migrated_from_v4_needs_v5_review |
| 2.3.2 | theory | Producentensurplus en totaal surplus | migrated_from_v4_needs_v5_review |
| 2.3.3 | theory | Pareto-efficientie en welvaartsverlies | migrated_from_v4_needs_v5_review |
| 2.3.4 | gemengde_opgaven | Gemengde opgaven: surplus en welvaart | placeholder_needs_review |

### Book 3

| Paragraph | Kind | Title | Target status |
|---|---|---|---|
| 3.1.1 | theory | Belastingen: wig en nieuw evenwicht | candidate_review_ready |
| 3.1.2 | theory | Belastingdruk en welvaartsverlies | candidate_review_ready |
| 3.1.3 | theory | Subsidies | candidate_review_ready |
| 3.1.4 | theory | Maximumprijs | candidate_review_ready |
| 3.1.5 | theory | Minimumprijs en quota | candidate_review_ready |
| 3.1.6 | gemengde_opgaven | Gemengde opgaven: overheidsingrijpen | candidate_review_ready |
| 3.2.1 | theory | Volkomen concurrentie: kenmerken | candidate_review_ready |
| 3.2.2 | theory | Marginale kosten en de afgeleide | candidate_review_ready |
| 3.2.3 | theory | Winstmaximalisatie bij volkomen concurrentie | candidate_review_ready |
| 3.2.4 | gemengde_opgaven | Gemengde opgaven: de prijsnemende onderneming | candidate_review_ready |
| 3.3.1 | theory | Waarom landen handelen: specialisatie en concurrentiepositie | candidate_review_ready |
| 3.3.2 | theory | Wereldmarktprijs, import, export en welvaart | candidate_review_ready |
| 3.3.3 | theory | Protectionisme: invoerheffingen en importquota | candidate_review_ready |
| 3.3.4 | gemengde_opgaven | Gemengde opgaven: internationale handel | candidate_review_ready |

### Book 4

| Paragraph | Kind | Title | Target status |
|---|---|---|---|
| 4.1.1 | theory | Toetreding, uittreding en langetermijnevenwicht | candidate_review_ready |
| 4.1.2 | theory | Monopolie: kenmerken | candidate_review_ready |
| 4.1.3 | theory | Marginale opbrengst bij monopolie | candidate_review_ready |
| 4.1.4 | theory | Winstmaximalisatie bij monopolie | candidate_review_ready |
| 4.1.5 | gemengde_opgaven | Gemengde opgaven: concurrentie en monopolie | candidate_review_ready |
| 4.2.1 | theory | Welvaartseffecten van monopolie | candidate_review_ready |
| 4.2.2 | theory | Prijsdiscriminatie | candidate_review_ready |
| 4.2.3 | theory | Marktvormen vergelijken | candidate_review_ready |
| 4.2.4 | theory | Negatieve externe effecten | candidate_review_ready |
| 4.2.5 | theory | Positieve externe effecten | candidate_review_ready |
| 4.2.6 | theory | Overheidsingrijpen bij marktfalen | candidate_review_ready |
| 4.2.7 | gemengde_opgaven | Gemengde opgaven: marktvormen en marktfalen | candidate_review_ready |
| 4.3.1 | theory | Arbeidsvraag en arbeidsproductiviteit | candidate_review_ready |
| 4.3.2 | theory | Arbeidsaanbod, participatie en evenwicht | candidate_review_ready |
| 4.3.3 | theory | Werkloosheid en veranderingen op de arbeidsmarkt | candidate_review_ready |
| 4.3.4 | theory | Minimumloon | candidate_review_ready |
| 4.3.5 | gemengde_opgaven | Gemengde opgaven: arbeidsmarkt | candidate_review_ready |

## Paragraph Anchors

### §1.1.1 - Schaarste en economisch denken

Migrated from v4 target exercise §1.1.1. Needs v5 review before it can be marked reviewed_final.

### §1.1.2 - Percentages en indexcijfers

Migrated from v4 target exercise §1.1.2. Needs v5 review before it can be marked reviewed_final.

### §1.1.3 - Grafieken en tabellen

Migrated from v4 target exercise §1.1.3. Needs v5 review before it can be marked reviewed_final.

### §1.1.4 - Gemengde opgaven: economisch denken en rekenen

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §1.2.1 - Individuele vraag

Migrated from v4 target exercise §1.2.1. Needs v5 review before it can be marked reviewed_final.

### §1.2.2 - Vraagfactoren

Migrated from v4 target exercise §1.2.2. Needs v5 review before it can be marked reviewed_final.

### §1.2.3 - Van individuele naar collectieve vraag

Migrated from v4 target exercise §1.2.3. Needs v5 review before it can be marked reviewed_final.

### §1.2.4 - Gemengde opgaven: vraag

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §1.3.1 - Aanbod

Migrated from v4 target exercise §1.3.1. Needs v5 review before it can be marked reviewed_final.

### §1.3.2 - Marktevenwicht

Migrated from v4 target exercise §1.4.1. Needs v5 review before it can be marked reviewed_final.

### §1.3.3 - Verschuivingen en nieuw evenwicht

Migrated from v4 target exercise §1.4.2. Needs v5 review before it can be marked reviewed_final.

### §1.3.4 - Gemengde opgaven: aanbod en marktevenwicht

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §2.1.1 - Kostenstructuren

Migrated from v4 target exercise section 1.3.2 and reviewed against the v5 target-quality standard by sprint B2-2.1-TARGET-V5-PROMOTE. Status: reviewed_final.

### §2.1.2 - Opbrengsten, winst en break-even

Migrated from v4 target exercise section 1.3.3 and reviewed against the v5 target-quality standard by sprint B2-2.1-TARGET-V5-PROMOTE. Status: reviewed_final.

### §2.1.3 - Marginale kosten en marginale opbrengsten

Migrated from v4 target exercise section 1.4.3 and reviewed against the v5 target-quality standard by sprint B2-2.1-TARGET-V5-PROMOTE. Status: reviewed_final.

### §2.1.4 - Gemengde opgaven: kosten en opbrengsten

Count-bearing gemengde-opgaven paragraph. Introduces no new theory. Reviewed against the mixed-opgaven target standard by sprint MIXED-OPGAVEN-TARGET-STANDARD-1. Status: reviewed_final.

### §2.2.1 - Prijselasticiteit

Historical promotion: `B2-2.2-TARGET-V5-PROMOTE` covered the former cinema/petrol target. The active registry now contains the integrated Issue #229 Nova/StreamNow target, still `candidate_review_ready`; the older promotion does not promote that successor. The bounded 2026-09-21 revision uses old-value denominators and signed, unrounded classification under [the canonical precision reference §15](../authored/economic_mathematical_precision_reference.md#15-signed-own-price-elasticity-and-reference-page-precision). See `references/authored/book2-signed-20260921-authority.json` for the exact successor; historical approvals and open holds remain unchanged.

### §2.2.2 - Elasticiteit en omzet

Reviewed-final in `B2-2.2-TARGET-V5-PROMOTE`. The target remains bounded to `TO = P x Q` and omzet/totale-opbrengst reasoning, with no profit claim.

### §2.2.3 - Inkomenselasticiteit en kruiselingse elasticiteit

Reviewed-final in `B2-2.2-TARGET-V5-PROMOTE`. The inferior-good ambiguity from the migrated target is repaired: negative `Ei` is classified as inferieur, and the luxury/necessity split is applied only to normal goods. Demand-function reasoning is ceteris paribus.

### §2.2.4 - Gemengde opgaven: elasticiteit

Count-bearing gemengde-opgaven paragraph. Introduces no new theory. Reviewed-final in `B2-2.2-TARGET-V5-PROMOTE` after replacement of the placeholder target with the StreamPlus mixed-transfer target and explicit mixed-target acceptance.

### §2.3.1 - Consumentensurplus

Migrated from v4 target exercise §2.2.1. Needs v5 review before it can be marked reviewed_final.

### §2.3.2 - Producentensurplus en totaal surplus

Migrated from v4 target exercise §2.2.2. Needs v5 review before it can be marked reviewed_final.

### §2.3.3 - Pareto-efficientie en welvaartsverlies

Migrated from v4 target exercise §2.2.3. Needs v5 review before it can be marked reviewed_final.

### §2.3.4 - Gemengde opgaven: surplus en welvaart

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §3.1.1 - Belastingen: wig en nieuw evenwicht

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Distinguish the price paid by buyers from the amount received by sellers; represent a per-unit tax and calculate the new traded quantity.

Retrieval and transfer (design, not mastery evidence): Retrieve linear equilibrium and substitution from §§1.3.2-1.3.3. The two-price interpretation and tax wedge are new formal learning.

Boundary: State who remits the tax, its unit, and the competitive model assumptions. Remittance is not the same as economic tax burden. Do not add welfare accounting before §3.1.2.

### §3.1.2 - Belastingdruk en welvaartsverlies

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Calculate the division of the tax burden, tax revenue and welfare consequences; explain the effect of relative responsiveness.

Retrieval and transfer (design, not mastery evidence): Retrieve §3.1.1, Book 2 elasticity interpretation and surplus-area calculations. Qualitative supply responsiveness does not require introducing a new supply-elasticity formula.

Boundary: Government revenue is a transfer, not the deadweight loss. The initial welfare benchmark excludes external effects; corrective taxation returns in §4.2.4. Do not infer elasticity merely from slopes plotted with different scales.

### §3.1.3 - Subsidies

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Represent a per-unit subsidy, calculate both prices and transactions, and identify government expenditure and distributional effects.

Retrieval and transfer (design, not mastery evidence): Reuse the tax-wedge method with the direction reversed, and retrieve surplus calculations. Explicitly compare what changes and what stays the same.

Boundary: Specify the eligible transaction and payment recipient. In this first treatment assume no external benefit; §4.2.5 deliberately changes that assumption. A subsidy is not automatically an efficiency improvement.

### §3.1.4 - Maximumprijs

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Distinguish binding and non-binding price ceilings; calculate demand, supply, actual transactions and shortage.

Retrieval and transfer (design, not mastery evidence): Retrieve equilibrium and quantity-at-price calculations. Reuse surplus areas only after the transaction and allocation rules have been specified.

Boundary: A low quoted price does not mean everyone buys at that price. Welfare-area calculations require an explicit allocation assumption. Avoid turning this into a full housing-policy chapter.

### §3.1.5 - Minimumprijs en quota

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Analyse a binding price floor and distinguish it from a production quota. Calculate surplus supply and, when specified, public purchases.

Retrieval and transfer (design, not mastery evidence): Transfer the ceiling procedure; reuse government-expenditure rectangles and the distinction between offered and actually traded quantities.

Boundary: A production quota is not automatically a price floor; a floor does not imply public purchases unless the source says so. This is a high-load paragraph: the quota comparison stays bounded. Prepares the import-quota comparison in §3.3.3 and the later minimum-wage application in §4.3.4.

### §3.1.6 - Gemengde opgaven: overheidsingrijpen

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Select the appropriate intervention model and integrate price, quantity, budget and welfare reasoning without new theory.

Retrieval and transfer (design, not mastery evidence): Interleave §§3.1.1-3.1.5 with Book 2 elasticity and surplus. Require method selection rather than identifying the method in every question heading.

Boundary: No new intervention or externality model. Do not force every intervention into one unwieldy target or one 55-minute compulsory route.

### §3.2.1 - Volkomen concurrentie: kenmerken

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain price taking and connect the market price to the individual firm’s GO and MO.

Retrieval and transfer (design, not mastery evidence): Retrieve market equilibrium and TO = P x Q; re-use the distinction between total, average and marginal revenue.

Boundary: Explain the stated competitive assumptions. A horizontal firm demand curve is not the same as a horizontal market demand curve.

### §3.2.2 - Marginale kosten en de afgeleide

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Derive MK from TK = aq² + bq + c using only the quadratic, linear and constant terms required in the course. Evaluate and interpret the resulting marginal cost at a stated q with the correct units. Distinguish a point marginal value from the average additional cost over a finite table interval. Explain why fixed costs disappear from MK but remain in TK and profit.

Retrieval and transfer (design, not mastery evidence): Retrieve §2.1.3's ΔTK/Δq, substitution and total/per-unit distinctions. The derivative operation is new instruction here. Retrieve the revenue meaning of P = GO = MO from §3.2.1, but do not teach the optimisation rule as a second destination in this lesson.

Boundary: No full calculus course, differentiation of GTK, general product/quotient rules, or price/output optimisation. Do not call ΔTK/Δq over a large interval the exact derivative at its endpoint. Preserve the existing fixed-cost/capacity convention. A full optimum, capacity comparison and profit rectangle belong to §3.2.3, not this target. This new paragraph must have its own worked preparation, independent practice and compact target.

### §3.2.3 - Winstmaximalisatie bij volkomen concurrentie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Use marginal comparisons to select a feasible output at a given market price. Obtain and check the MO = MK candidate, explain the directions on either side, check production capacity and relevant boundaries, calculate TO − TK, and represent profit through P and GTK at the same chosen q.

Retrieval and transfer (design, not mastery evidence): Retrieve the limited derivative from §3.2.2, price taking from §3.2.1, and the Book 2 total/average/marginal distinction. The economic output-choice rule is explicitly new. A short derivative retrieval item is appropriate; another full introductory derivative lesson is not.

Boundary: MO = MK is not by itself a universal maximum proof. Do not choose output by mechanically minimising GTK. Fixed costs remain fixed within the stated period and capacity; avoid new production-range complications. Entry/exit, normal remuneration and the long-run zero-economic-profit result are formally taught in new §4.1.1, not here. Distinguish a short-period loss from an automatic decision to leave the market.

### §3.2.4 - Gemengde opgaven: de prijsnemende onderneming

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Independently connect market price formation and a short-run change in that price to the output, costs and profit of one price-taking firm. Keep market Q, firm q, per-unit values and total amounts distinct. Select and check a feasible marginal output decision.

Retrieval and transfer (design, not mastery evidence): Retrieve §§3.2.1–3.2.3, Book 1 market equations and demand shifts, and Book 2 costs, revenue, averages and profit. The number of active firms and their production capacities are held fixed over the analysed adjustment window. The long-run mechanism is not an assessed prerequisite.

Boundary: In the complete printed set, not just the target, relocate old exercise 35 and the long-run content of bonus 37 or replace them with already-taught retrieval. Reword old 36a's economic-profit/normal-remuneration premise as a supplied cost convention; do not require interpretation of normal remuneration before §4.1.1. Numeric equality TO = TK may remain familiar break-even arithmetic, not a long-run conclusion. Preserve independent consolidation before the Book 3 assessment.

### §3.3.1 - Waarom landen handelen: specialisatie en concurrentiepositie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain specialisation, absolute versus comparative advantage and possible mutual gains qualitatively. Distinguish an explanation of relative opportunity cost from a general claim about a country's production strengths or competitiveness.

Retrieval and transfer (design, not mastery evidence): Retrieve scarcity, choice and the meaning of opportunity cost from Book 1. Introduce import/export and the new comparative-advantage meaning explicitly. Keep discussion of productivity, quality or costs qualitative and supported by information in the source; no formal labour-cost formula is assumed.

Boundary: No calculated opportunity-cost ratios, production-possibility-frontier optimisation, exchange-ratio bounds or separate ruilvoet calculation objective. Do not equate absolute with comparative advantage or claim that all groups necessarily gain. The conceptual/no-calculation boundary follows the owner's retained design instruction; this revision makes no new CE/SE validation claim. Formal productivity and unit-labour-cost analysis is taught in §4.3.1. Long-run entry/exit is not needed for this trade target.

### §3.3.2 - Wereldmarktprijs, import, export en welvaart

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain how a stated world price changes domestic production and consumption; identify whether the country imports or exports; calculate the trade gap and interpret the effects on domestic buyers and sellers.

Retrieval and transfer (design, not mastery evidence): Reuse reading a demand/supply graph, determining quantity at a stated price, and the meaning of consumer/producer surplus. The new distinction is between domestic production, domestic consumption and the foreign trade flow, not a new equation-solving system.

Boundary: State a small, price-taking country, competitive markets, sufficient foreign supply/demand and the relevant transport/tariff assumptions. Keep currencies fixed. Domestic demand is not domestic production. A rise in the stated total-surplus measure is not evidence that every group gains. The target need not produce a full welfare-area ledger or balance-of-payments account.

### §3.3.3 - Protectionisme: invoerheffingen en importquota

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain why a government might restrict imports and distinguish its stated aim from effects on different groups. Use the familiar market model to interpret a per-unit import tariff; calculate remaining imports and tariff revenue in a simple case. Contrast an import quota qualitatively.

Retrieval and transfer (design, not mastery evidence): Reuse §3.3.2's world-price model and Chapter 3.1's tax, government-budget and quota concepts. Explicitly distinguish a tariff on imported units from a tax on all domestic sales.

Boundary: Use imported quantity, not all domestic sales, for tariff revenue. Teach the no-import boundary using graph reading or a supplied contrast; do not mechanically impose world price plus tariff after imports disappear. State the model assumptions behind the case. Quantitative quota rents/allocation, export-subsidy models, exchange-rate adjustment and formal strategic retaliation remain deferred. An industry-gain claim is not automatically an economy-wide welfare claim.

### §3.3.4 - Gemengde opgaven: internationale handel

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-3-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Select and combine qualitative trade explanation, familiar world-price interpretation, a short import/tariff calculation and a source-supported conclusion. Distinguish aggregate and distributional claims.

Retrieval and transfer (design, not mastery evidence): Retrieve §§3.3.1-3.3.3 and already-taught market, budget and surplus meanings. No monopoly or labour-market procedure is needed. A source may mention jobs in ordinary language, but must not require labour-demand equations, participation statistics or unit-labour-cost calculations.

Boundary: The earlier proposal cites a 2022 VWO-I Importheffing task as a possible target-design input. Carry that reference forward for later source verification, not as a completed adaptation or evidence that every operation is approved. Later current-account and game-theory demands stay outside this chapter. Claims about protected jobs do not require or establish a formal economy-wide employment result.

### §4.1.1 - Toetreding, uittreding en langetermijnevenwicht

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain profit → entry → market supply → price → firm profit, and the exit direction under sustained losses. Connect market Q and firm q, represent the direction of adjustment, and calculate or verify the stated long-run firm outcome. Interpret zero economic profit when normal entrepreneurial remuneration is included in costs.

Retrieval and transfer (design, not mastery evidence): Reactivate Book 3's price-taking output choice, derivative and profit rectangle through the existing start/example route. Retrieve market supply shifts from Book 1. This first lesson of Book 4 teaches the new time-horizon and economic-profit interpretation; it is not an extra unnumbered recap lesson.

Boundary: Retain the stated free-entry/exit, identical active-firm costs and input-price assumptions. Under this model the endpoint is P = MO = MK = minimum GTK; it is not a universal claim about every real industry. Do not infer immediate shutdown from a short-period loss. End with the question 'What changes when other suppliers cannot enter?' as the transition to §4.1.2, not a complete additional monopoly lesson. The existing classroom-time estimate remains provisional and needs checking after the book-opening retrieval is selected.

### §4.1.2 - Monopolie: kenmerken

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain market power, barriers to entry and the relationship between the firm’s sales and market demand.

Retrieval and transfer (design, not mastery evidence): Contrast with §3.2.1; retrieve the demand function and price/quantity relationship. Use a short retrieval task to restore the difference between a market graph and the competitive firm's graph before introducing the monopolist's graph. Connect the entry barrier explicitly to the adjustment mechanism taught in §4.1.1.

Boundary: Monopoly does not mean unlimited pricing power. Patents can be one entry-barrier context; full policy evaluation belongs later.

### §4.1.3 - Marginale opbrengst bij monopolie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain why extra sales and a lower price have different effects on total revenue; obtain MO from a simple TO relation.

Retrieval and transfer (design, not mastery evidence): Retrieve TO = P x Q, Book 2 marginal differences and revenue interpretation, and the limited derivative technique taught in §3.2.2.

Boundary: Assume a uniform selling price. Do not introduce point-elasticity formulas or a general calculus chapter. Revisit elasticity qualitatively only where it supports the taught revenue interpretation.

### §4.1.4 - Winstmaximalisatie bij monopolie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Determine output using MO and MK, then read price from demand and calculate profit.

Retrieval and transfer (design, not mastery evidence): Repeat §3.2.3’s optimisation procedure, §4.1.3’s revenue relation and Book 2 cost calculations.

Boundary: Do not read price from the MO curve, equate P with MK at the monopoly optimum, or confuse maximum revenue with maximum profit. Reserve the formal welfare comparison for §4.2.1, immediately after this chapter; it is not postponed to a later book.

### §4.1.5 - Gemengde opgaven: concurrentie en monopolie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Choose and execute the monopoly calculation sequence and compare it with the already-taught competitive firm sequence.

Retrieval and transfer (design, not mastery evidence): Interleave cost, revenue, elasticity interpretation, break-even and marginal choice without adding new operations.

Boundary: No price discrimination, strategic game or monopoly-welfare target before those are taught. Consolidation is not an extra theory paragraph.

### §4.2.1 - Welvaartseffecten van monopolie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Compare monopoly with an appropriate competitive/efficient benchmark and distinguish a redistribution of surplus from a welfare loss.

Retrieval and transfer (design, not mastery evidence): Repeat §4.1.4’s quantity-and-price calculation and Book 2 CS/PS/total-surplus areas as essential parts of the current task.

Boundary: Keep demand, cost conditions and welfare boundary comparable across scenarios. Producer surplus is not automatically profit; do not treat every transfer between buyer and seller as a loss.

### §4.2.2 - Prijsdiscriminatie

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain the conditions for selling at different prices and analyse the effect on revenue, profit and the division of surplus.

Retrieval and transfer (design, not mastery evidence): Reuse TO, profit and demand responsiveness; where the chosen target requires it, repeat the established MO/MK procedure in each explicitly separated market.

Boundary: State market separation and resale restrictions. For separate segment optimisation, use a stated common constant marginal cost, or explicitly account for costs that depend on combined output. Do not claim that discrimination necessarily raises or necessarily lowers total welfare. Avoid adding simultaneous unfamiliar cost structures and multiple optimisation cases.

### §4.2.3 - Marktvormen vergelijken

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Distinguish perfect competition, monopolistic competition, oligopoly and monopoly; transfer a familiar profit procedure to a supplied unfamiliar-market representation.

Retrieval and transfer (design, not mastery evidence): Reuse competitive/monopoly reasoning, substitute relationships, demand responsiveness and marginal profit choice.

Boundary: Do not assume an oligopolist has one universal demand curve. No reaction functions or payoff-matrix techniques here. Formal strategic interaction stays in the later course. This paragraph is not just a vocabulary checklist, but it also must not become four full new models.

### §4.2.4 - Negatieve externe effecten

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Identify unpriced harm to third parties, distinguish private from social consequences and analyse a corrective tax.

Retrieval and transfer (design, not mastery evidence): Repeat the tax calculation from §§3.1.1-3.1.2, the market equilibrium method and surplus accounting. The external-cost interpretation is new.

Boundary: Do not count tax revenue as a real social loss or treat CS + PS alone as the full welfare measure when external harm is present. Keep external-cost assumptions explicit and simple; no unsupported claims of a uniquely optimal tax.

### §4.2.5 - Positieve externe effecten

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Identify benefits to third parties and explain how a subsidy can improve an outcome with too little of the beneficial activity.

Retrieval and transfer (design, not mastery evidence): Repeat §3.1.3’s subsidy wedge, quantity and government-expenditure calculation and Book 2 surplus reasoning.

Boundary: Keep the benefit to the buyer separate from the benefit to others. State who receives the subsidy. Do not count a transfer twice or assume every subsidy is appropriately sized. The external-benefit interpretation is new teaching, not prerequisite recall.

### §4.2.6 - Overheidsingrijpen bij marktfalen

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Match a policy to the diagnosed failure, compare feasible alternatives and evaluate effects and limitations with evidence.

Retrieval and transfer (design, not mastery evidence): Reuse taxes, subsidies, price restrictions and quantity restrictions, alongside monopoly and externality analysis.

Boundary: Not a second full course on every instrument. A patent/competition-policy example can retrieve market power; avoid importing the later games, insurance or macro-policy curriculum. Separate efficiency from distribution and recognise implementation limits stated in the source.

### §4.2.7 - Gemengde opgaven: marktvormen en marktfalen

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Integrate firm behaviour, surplus, external effects and policy selection without new theory.

Retrieval and transfer (design, not mastery evidence): Select useful methods from Books 1-3, Chapter 4.1 and §§4.2.1-4.2.6, rather than repeating a labelled routine mechanically.

Boundary: Do not put an unfamiliar policy or welfare concept into the mixed target. Keep core work feasible; distribute additional retrieval to the closing review.

### §4.3.1 - Arbeidsvraag en arbeidsproductiviteit

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Explain why employers demand labour, interpret changes in that demand, and relate output, labour input, productivity and labour cost per unit.

Retrieval and transfer (design, not mastery evidence): Retrieve demand shifts, average-cost reasoning, ratios and percentages. Re-label price as wage and show that employers are the buyers of labour.

Boundary: Keep hours, persons and full-time equivalents distinct. Do not imply productivity growth always reduces total employment; state output and other conditions. No formal marginal-revenue-product optimisation unless separately justified and taught. This is the first formal home of the productivity and unit-labour-cost calculations; revisit a qualitative competitiveness claim from §3.3.1 only after teaching the needed calculation here.

### §4.3.2 - Arbeidsaanbod, participatie en evenwicht

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Identify households as labour suppliers, calculate participation with the stated denominator, and find and interpret the competitive baseline equilibrium wage and employment.

Retrieval and transfer (design, not mastery evidence): Reuse Book 1 equilibrium equations and graph reading. A short explicit translation bridge precedes one compact equilibrium calculation; the algebra is not retaught as new.

Boundary: This paragraph absorbs the baseline part of the registry-baseline §4.2.3, not an entire extra lesson hidden inside it. Keep participation data simple, units fixed and the equilibrium model familiar. Distinguish a supply curve at different wages from measured labour-force totals. Review timing before finalising the target.

### §4.3.3 - Werkloosheid en veranderingen op de arbeidsmarkt

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Calculate unemployment using the labour force as denominator, distinguish the relevant causes and interpret labour-market changes.

Retrieval and transfer (design, not mastery evidence): Reuse §4.3.2’s equilibrium and Book 1 shift/new-equilibrium method. This is the second home of the absorbed equilibrium work.

Boundary: Distinguish the simplified clearing model from observed vacancies and mismatch. With data defined as labour demand = employment + vacancies, supply minus demand is not measured unemployment. Explain structural/frictional and demand-related unemployment at an introductory level; no output-gap or Phillips-curve model.

### §4.3.4 - Minimumloon

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Apply a minimum-price model to wages and distinguish effects on wage rates, employment, people seeking work and the wage bill.

Retrieval and transfer (design, not mastery evidence): Repeat §3.1.5’s price-floor technique and §4.3.2’s labour-market translation; reuse price-times-quantity and percentage calculations.

Boundary: State a competitive model, the wage unit and adjustment assumptions. Model outcomes are not universal empirical claims about every minimum-wage change. Use illustrative rates, not unverified current statutory figures.

### §4.3.5 - Gemengde opgaven: arbeidsmarkt

Selected structure: book34-lesson-balance-v3-20260915; [adopted outline](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/book-4-outline.md). Target status: candidate_review_ready; independent review remains pending; no inherited approval.

Intended learning: Combine labour-market actors and units, productivity and basic unit labour costs, participation/unemployment denominators, baseline equilibrium, shifts and a minimum-wage model. Give conclusions bounded by the supplied data and assumptions, without requiring collective bargaining or the deferred agreement/training-policy framework.

Retrieval and transfer (design, not mastery evidence): Retrieve only retained §§4.3.1–4.3.4 and earlier familiar market methods. Keep independent equilibrium/shift evidence so that shortening the chapter does not silently remove it. General claims about employment still require both labour-productivity and output information, as taught in §4.3.1.

Boundary: In old mixed exercise 48, replace the cao wage floor by a clearly stated illustrative minimum wage, or select another already-taught wage-floor case. Remove or revise old 49's source C and 49f only to the extent needed by the retained goals; do not delete the useful data-limited employment reasoning already in §4.3.1. Update the final return-reference to old §4.3.5. The new numeric ID 4.3.5 is a mixed paragraph, not the old bargaining paragraph. Deferred goals must not return in compulsory homework, tests or an unexplained bonus.

## Web-Only Test Preparation

Test preparation remains available online as a package per book. It is not a printed chapter and does not count toward 12/12/14/17. The printed student message should remain simple: the formal test is about this book.

## Future Quality Work

- L1.6 should use this v5 source path when proving the next fresh paragraph pipeline.
- Book 2 Part A should not start until this v5 source path is accepted as the active curriculum baseline.
- L2.4-TEA remains the later target-exercise distribution audit after MTU quality and companion-review instruments mature.

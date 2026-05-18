# Course Blueprint v5 - Four Test-Week Book Plan

Status: L1.5Q Phase B curriculum-source version
Version: v5
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
| v4 target-exercise registry had 49 records. | v5 target-exercise registry has 54 count-bearing records. |

## Book Counts

| Book | Count-bearing paragraphs | Formal test-week scope |
| --- | ---: | --- |
| Book 1 | 12 | Test week 1: Book 1 |
| Book 2 | 12 | Test week 2: Book 2 |
| Book 3 | 14 | Test week 3: Book 3 |
| Book 4 | 16 | Test week 4: Book 4 |

These counts are guarded by `scripts/check-course-target-exercises-v5.js`. The checker also verifies that test preparation is web-only and that placeholders are visibly non-final.

## Book-Level Intent

### Book 1 - Grondslagen, vraag en aanbod

Book 1 becomes the lean opening book for the first formal test week. It teaches economic thinking, percentages/index numbers, graph/table reading, demand, supply, equilibrium, and shifts. Costs, revenue, and marginal analysis are deliberately excluded from the printed Book 1 scope so the first book is realistic for the publisher and the classroom calendar.

### Book 2 - Kosten, opbrengsten, elasticiteit en surplus

Book 2 absorbs the Book 1 production material that was cut from print: costs, revenue, break-even, and marginal concepts. It then moves into elasticity and surplus/welfare foundations. This preserves prerequisite order before government intervention and market structures.

### Book 3 - Overheidsingrijpen en marktvormen

Book 3 carries taxes, subsidies, price controls, quotas, volkomen concurrentie, and monopoly. It is the main procedural/diagrammatic book after students have the calculation and surplus foundations from Book 2.

### Book 4 - Marktfalen, arbeidsmarkt en internationale handel

Book 4 contains market-failure extensions, labour-market material, and a limited trade block. Inflation/CPI and late macro content are parked for a later-year macro scope and are not count-bearing in v5.

## Migration Notes

- Book 1 follows the L1.5P print scope: 12 paragraphs, no printed test-preparation chapter.
- Book 1 cost, revenue, and marginal-analysis material is moved to later books rather than deleted.
- Government intervention, monopoly, and market failure are shifted forward.
- Inflation and late macro material are parked for a later year and are not count-bearing in v5.
- Protectionism beyond the two retained trade paragraphs is parked until the trade/macro boundary is reviewed.

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
| 2.1.1 | theory | Kostenstructuren | migrated_from_v4_needs_v5_review |
| 2.1.2 | theory | Opbrengsten, winst en break-even | migrated_from_v4_needs_v5_review |
| 2.1.3 | theory | Marginale kosten en marginale opbrengsten | migrated_from_v4_needs_v5_review |
| 2.1.4 | gemengde_opgaven | Gemengde opgaven: kosten en opbrengsten | placeholder_needs_review |
| 2.2.1 | theory | Prijselasticiteit | migrated_from_v4_needs_v5_review |
| 2.2.2 | theory | Elasticiteit en omzet | migrated_from_v4_needs_v5_review |
| 2.2.3 | theory | Inkomenselasticiteit en kruiselingse elasticiteit | migrated_from_v4_needs_v5_review |
| 2.2.4 | gemengde_opgaven | Gemengde opgaven: elasticiteit | placeholder_needs_review |
| 2.3.1 | theory | Consumentensurplus | migrated_from_v4_needs_v5_review |
| 2.3.2 | theory | Producentensurplus en totaal surplus | migrated_from_v4_needs_v5_review |
| 2.3.3 | theory | Pareto-efficientie en welvaartsverlies | migrated_from_v4_needs_v5_review |
| 2.3.4 | gemengde_opgaven | Gemengde opgaven: surplus en welvaart | placeholder_needs_review |

### Book 3

| Paragraph | Kind | Title | Status |
| --- | --- | --- | --- |
| 3.1.1 | theory | Belastingen: wig en nieuw evenwicht | migrated_from_v4_needs_v5_review |
| 3.1.2 | theory | Belastingdruk en welvaartsverlies | migrated_from_v4_needs_v5_review |
| 3.1.3 | theory | Subsidies | migrated_from_v4_needs_v5_review |
| 3.1.4 | theory | Maximumprijs | migrated_from_v4_needs_v5_review |
| 3.1.5 | theory | Minimumprijs en quota | migrated_from_v4_needs_v5_review |
| 3.1.6 | gemengde_opgaven | Gemengde opgaven: overheidsingrijpen | placeholder_needs_review |
| 3.2.1 | theory | Volkomen concurrentie: kenmerken | migrated_from_v4_needs_v5_review |
| 3.2.2 | theory | Winstmaximalisatie bij volkomen concurrentie | migrated_from_v4_needs_v5_review |
| 3.2.3 | theory | Langetermijnevenwicht | migrated_from_v4_needs_v5_review |
| 3.2.4 | gemengde_opgaven | Gemengde opgaven: volkomen concurrentie | placeholder_needs_review |
| 3.3.1 | theory | Monopolie: kenmerken | migrated_from_v4_needs_v5_review |
| 3.3.2 | theory | Marginale opbrengst bij monopolie | migrated_from_v4_needs_v5_review |
| 3.3.3 | theory | Winstmaximalisatie bij monopolie | migrated_from_v4_needs_v5_review |
| 3.3.4 | gemengde_opgaven | Gemengde opgaven: monopolie | placeholder_needs_review |

### Book 4

| Paragraph | Kind | Title | Status |
| --- | --- | --- | --- |
| 4.1.1 | theory | Welvaartseffecten van monopolie | migrated_from_v4_needs_v5_review |
| 4.1.2 | theory | Prijsdiscriminatie | migrated_from_v4_needs_v5_review |
| 4.1.3 | theory | Marktvormen vergelijken | migrated_from_v4_needs_v5_review |
| 4.1.4 | theory | Negatieve externe effecten | migrated_from_v4_needs_v5_review |
| 4.1.5 | theory | Positieve externe effecten | migrated_from_v4_needs_v5_review |
| 4.1.6 | theory | Overheidsingrijpen bij marktfalen | migrated_from_v4_needs_v5_review |
| 4.1.7 | gemengde_opgaven | Gemengde opgaven: marktvormen en marktfalen | placeholder_needs_review |
| 4.2.1 | theory | Arbeidsvraag | migrated_from_v4_needs_v5_review |
| 4.2.2 | theory | Arbeidsaanbod en participatie | migrated_from_v4_needs_v5_review |
| 4.2.3 | theory | Evenwicht op de arbeidsmarkt | migrated_from_v4_needs_v5_review |
| 4.2.4 | theory | Werkloosheid | migrated_from_v4_needs_v5_review |
| 4.2.5 | theory | Minimumloon | migrated_from_v4_needs_v5_review |
| 4.2.6 | theory | Vakbonden, cao en arbeidsmarktbeleid | migrated_from_v4_needs_v5_review |
| 4.2.7 | gemengde_opgaven | Gemengde opgaven: arbeidsmarkt | placeholder_needs_review |
| 4.3.1 | theory | Absolute en comparatieve voordelen | migrated_from_v4_needs_v5_review |
| 4.3.2 | theory | Ruilwinst en ruilvoet | migrated_from_v4_needs_v5_review |

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

Migrated from v4 target exercise §1.3.2. Needs v5 review before it can be marked reviewed_final.

### §2.1.2 - Opbrengsten, winst en break-even

Migrated from v4 target exercise §1.3.3. Needs v5 review before it can be marked reviewed_final.

### §2.1.3 - Marginale kosten en marginale opbrengsten

Migrated from v4 target exercise §1.4.3. Needs v5 review before it can be marked reviewed_final.

### §2.1.4 - Gemengde opgaven: kosten en opbrengsten

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §2.2.1 - Prijselasticiteit

Migrated from v4 target exercise §2.1.1. Needs v5 review before it can be marked reviewed_final.

### §2.2.2 - Elasticiteit en omzet

Migrated from v4 target exercise §2.1.2. Needs v5 review before it can be marked reviewed_final.

### §2.2.3 - Inkomenselasticiteit en kruiselingse elasticiteit

Migrated from v4 target exercise §2.1.3. Needs v5 review before it can be marked reviewed_final.

### §2.2.4 - Gemengde opgaven: elasticiteit

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §2.3.1 - Consumentensurplus

Migrated from v4 target exercise §2.2.1. Needs v5 review before it can be marked reviewed_final.

### §2.3.2 - Producentensurplus en totaal surplus

Migrated from v4 target exercise §2.2.2. Needs v5 review before it can be marked reviewed_final.

### §2.3.3 - Pareto-efficientie en welvaartsverlies

Migrated from v4 target exercise §2.2.3. Needs v5 review before it can be marked reviewed_final.

### §2.3.4 - Gemengde opgaven: surplus en welvaart

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §3.1.1 - Belastingen: wig en nieuw evenwicht

Migrated from v4 target exercise §2.3.1. Needs v5 review before it can be marked reviewed_final.

### §3.1.2 - Belastingdruk en welvaartsverlies

Migrated from v4 target exercise §2.3.2. Needs v5 review before it can be marked reviewed_final.

### §3.1.3 - Subsidies

Migrated from v4 target exercise §2.3.3. Needs v5 review before it can be marked reviewed_final.

### §3.1.4 - Maximumprijs

Migrated from v4 target exercise §2.4.1. Needs v5 review before it can be marked reviewed_final.

### §3.1.5 - Minimumprijs en quota

Migrated from v4 target exercise §2.4.2. Needs v5 review before it can be marked reviewed_final.

### §3.1.6 - Gemengde opgaven: overheidsingrijpen

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §3.2.1 - Volkomen concurrentie: kenmerken

Migrated from v4 target exercise §3.1.1. Needs v5 review before it can be marked reviewed_final.

### §3.2.2 - Winstmaximalisatie bij volkomen concurrentie

Migrated from v4 target exercise §3.1.2. Needs v5 review before it can be marked reviewed_final.

### §3.2.3 - Langetermijnevenwicht

Migrated from v4 target exercise §3.1.3. Needs v5 review before it can be marked reviewed_final.

### §3.2.4 - Gemengde opgaven: volkomen concurrentie

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §3.3.1 - Monopolie: kenmerken

Migrated from v4 target exercise §3.2.1. Needs v5 review before it can be marked reviewed_final.

### §3.3.2 - Marginale opbrengst bij monopolie

Migrated from v4 target exercise §3.2.2. Needs v5 review before it can be marked reviewed_final.

### §3.3.3 - Winstmaximalisatie bij monopolie

Migrated from v4 target exercise §3.2.3. Needs v5 review before it can be marked reviewed_final.

### §3.3.4 - Gemengde opgaven: monopolie

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §4.1.1 - Welvaartseffecten van monopolie

Migrated from v4 target exercise §3.3.1. Needs v5 review before it can be marked reviewed_final.

### §4.1.2 - Prijsdiscriminatie

Migrated from v4 target exercise §3.3.2. Needs v5 review before it can be marked reviewed_final.

### §4.1.3 - Marktvormen vergelijken

Migrated from v4 target exercise §3.3.3. Needs v5 review before it can be marked reviewed_final.

### §4.1.4 - Negatieve externe effecten

Migrated from v4 target exercise §3.4.1. Needs v5 review before it can be marked reviewed_final.

### §4.1.5 - Positieve externe effecten

Migrated from v4 target exercise §3.4.2. Needs v5 review before it can be marked reviewed_final.

### §4.1.6 - Overheidsingrijpen bij marktfalen

Migrated from v4 target exercise §3.4.3. Needs v5 review before it can be marked reviewed_final.

### §4.1.7 - Gemengde opgaven: marktvormen en marktfalen

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §4.2.1 - Arbeidsvraag

Migrated from v4 target exercise §4.1.1. Needs v5 review before it can be marked reviewed_final.

### §4.2.2 - Arbeidsaanbod en participatie

Migrated from v4 target exercise §4.1.2. Needs v5 review before it can be marked reviewed_final.

### §4.2.3 - Evenwicht op de arbeidsmarkt

Migrated from v4 target exercise §4.1.3. Needs v5 review before it can be marked reviewed_final.

### §4.2.4 - Werkloosheid

Migrated from v4 target exercise §4.2.1. Needs v5 review before it can be marked reviewed_final.

### §4.2.5 - Minimumloon

Migrated from v4 target exercise §4.2.2. Needs v5 review before it can be marked reviewed_final.

### §4.2.6 - Vakbonden, cao en arbeidsmarktbeleid

Migrated from v4 target exercise §4.2.3. Needs v5 review before it can be marked reviewed_final.

### §4.2.7 - Gemengde opgaven: arbeidsmarkt

Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.

### §4.3.1 - Absolute en comparatieve voordelen

Migrated from v4 target exercise §4.3.1. Needs v5 review before it can be marked reviewed_final.

### §4.3.2 - Ruilwinst en ruilvoet

Migrated from v4 target exercise §4.3.2. Needs v5 review before it can be marked reviewed_final.

## Web-Only Test Preparation

Test preparation remains available online as a package per book. It is not a printed chapter and does not count toward 12/12/14/16. The printed student message should remain simple: the formal test is about this book.

## Future Quality Work

- L1.6 should use this v5 source path when proving the next fresh paragraph pipeline.
- Book 2 Part A should not start until this v5 source path is accepted as the active curriculum baseline.
- L2.4-TEA remains the later target-exercise distribution audit after MTU quality and companion-review instruments mature.

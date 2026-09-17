# Alignment audit: Books 1–4 and the curriculum framework

Review date: **15 September 2026**. Scope: the four delivered student books, their numbered paragraphs and exercises, the current blueprints, target registry, selected book outlines, relevant local plans and teacher guidance.

**Overall conclusion: the four books have the intended structure and a coherent learning sequence, but they are not fully aligned at the level of assessment, terminology, approval records and teaching time.** All **55 numbered paragraphs** are present in the current order. The most consequential findings are a contradictory demand dataset in Book 1, two mixed-paragraph assessment gaps, and teacher plans that require more periods than a one-paragraph/one-lesson reading of the framework allows. Books 3–4 largely implement their selected outline briefs, but their **31 current target records remain placeholders**, so structural compatibility cannot be treated as completed target approval.

No book, outline, registry or source repository was changed. This report recommends changes; it does not approve targets, release holds, certify classroom outcomes or authorise publication.

## Baseline and how to read the report

The audit uses detached snapshots of platform `67374a9808d226f1be7e8fa73eb104312c075267` and lessons `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`. Source links below are pinned to those commits. Later changes are outside this report.

“Paragraph” means a numbered instructional unit such as **§2.2.3**, including a numbered mixed-exercise unit. All 55 receive an individual comparison below; this is not a sentence-by-sentence copyedit of every typographic paragraph. The comparison asks what students are actually taught and required to do, not merely whether a heading or keyword occurs.

Authority was resolved as follows:

1. [Year 1 blueprint v5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-v5.md) controls current Year 1 placement; [three-year blueprint v6](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-v6-three-year.md) supplies the wider course and planning context.
2. The current target registry controls independent target operations where substantive records exist. Book 2’s exact approval bindings and scoped holds matter in addition to its record-status label.
3. [Book 2 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md), [Book 3 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md) and [Book 4 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md) supply the book-level design. Books 3–4 are selected structural baselines through adoption metadata; their original proposal text does not itself grant target approval. No separate current standalone Book 1 outline was found; its blueprint, reviewed targets and local chapter/paragraph plans were used.
4. [pedagogical boundaries](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-pedagogical-boundaries.md) distinguishes terminal targets, useful previews and demonstrated prerequisites. A later term appearing early is not automatically a conflict.
5. The delivered student PDFs and their active manuscripts determine what is in the books. Teacher guides are evidence of the intended route and workload, not evidence that a class has completed it.

The Book 2 structural-currentness check was run against this platform snapshot and returned **PASS, 12 target pins**. Historical prose differences below therefore are not being reported as a failed currentness guard. The workflow itself explains the precedence of current metadata and scoped holds over earlier lifecycle wording: [Part A authority/currentness explanation](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/docs/workflows/part-a-start.md).

Method: read each active paragraph’s theory and exercises against its target or proposed brief; inspect relevant plans and teacher routes; extract text from all four complete student PDFs and the three available complete teacher PDFs; recompute selected central cases and suspected inconsistencies; visually inspect nine selected PDF pages covering the principal data/terminology findings, a tax calculation, labour integration and the two-lesson budgets. This is an internal curriculum alignment review, not a new audit of external examination requirements, all answer keys, every diagram or every digital companion. Answer-key checking was targeted, including the contradictory §1.2.3 case.

## Structure and source status

| Book | Current chapter pattern | Blueprint / printed paragraphs | Complete student PDF pages | Target authority at the audited commit |
|---|---|---:|---:|---|
| 1 · Grondslagen, vraag en aanbod | Foundations 4; demand 4; supply/equilibrium 4 | 12 / 12 | 136 | 12 `reviewed_final` records; first printed edition frozen |
| 2 · Kosten, opbrengsten, elasticiteit en surplus | Costs/revenue 4; elasticity 4; surplus 4 | 12 / 12 | 110 | 12 `candidate_review_ready` records with exact owner-approved replacement/integration evidence and scoped holds |
| 3 · Overheidsingrijpen, concurrentie en internationale handel | Intervention 6; competition 4; trade 4 | 14 / 14 | 136 | 14 `placeholder_needs_review` records; selected outline briefs available |
| 4 · Monopolie, marktfalen en arbeidsmarkt | Monopoly 4; market failure 7; labour 6 | 17 / 17 | 162 | 17 `placeholder_needs_review` records; selected outline briefs available |

The current total is **12+12+14+17=55**. The older 54-unit Year 1 and 148/152 three-year totals in v6 are explicitly preserved historical planning evidence; its current projection is 149/153. Those historical numbers are **not** an undisclosed current structural conflict. Paragraph counts also do not prove the number of classroom periods needed. Sources: [Year 1 blueprint v5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-v5.md), [three-year blueprint v6](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-v6-three-year.md), [Book 2 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.meta.json), [Book 3 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.meta.json), [Book 4 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.meta.json).

Book 1’s complete PDF contains Chapters 1.1–1.3, not the older repository Chapters 1.4–1.5. Those older folders are excluded from the 55-unit printed comparison and listed in the appendix. Similarly, earlier Book 2 editions and `revision_base` material in the Book 3 package are historical, not the audited active text. Printed summaries/glossaries do not create additional count-bearing lessons. Formal test preparation remains outside the printed paragraph count.

## What works across the four books

| Learning chain | Evidence in the books | Alignment conclusion |
|---|---|---|
| Market arithmetic → costs and revenue | Book 1 teaches equations, axes and percentages; §§2.1.1–2.1.2 explicitly teach costs, revenue and break-even. | A supplied Book 1 profit formula is not mistaken for completed cost theory. |
| Marginal changes → output choice → monopoly | §2.1.3 uses interval differences; §3.2.2 teaches the limited derivative and feasible optimisation; §§4.1.2–4.1.3 retrieve these and change the revenue/price interpretation. | The sequence is economically coherent. The problem is teaching-time allocation, not a missing calculus prerequisite. |
| Willingness to pay → formal surplus → interventions → externalities | Book 1 gives discrete familiarity; Book 2 formalises areas and allocation; Book 3 adds budget terms; Book 4 adds external harm/benefits. | Different welfare conclusions follow from explicitly changed assumptions, not contradictory rules. |
| Trade → labour productivity | Chapter 3.3 keeps comparative advantage qualitative; §4.3.1 teaches output/hour and unit labour costs for the first time. | The trade/monopoly swap does not create a backward labour-calculation dependency. |
| Ordinary markets → labour markets | §§4.3.1–4.3.2 teach actors/units; §4.3.2 calculates baseline equilibrium, §4.3.3 shifts, §4.3.4 a wage floor and §4.3.6 independent integration. | The removed standalone labour-equilibrium unit is absorbed, not lost. |
| Theory → mixed work | Books 2–4 mixed paragraphs select among already taught methods; teacher guides select a core and leave support/bonus outside it. | No additional compulsory theory paragraph was found disguised as a mixed task. |

The paragraph entries below provide the evidence for these judgments. “Aligned” means the inspected content/operations fit the stated reference. For Books 3–4 it means **aligned with the selected outline**, not “formally approved target” or “classroom mastery proven”.

## Findings requiring action

### F01 · Contradictory Book 1 demand data can penalise a correct learner

**Priority: high. Scope: §1.2.3, target and printed table.** At P=€4, Opgave 10 gives Ben’s demand as 1 while also giving Q_Ben=−3P+11. The formula gives −1, clipped to 0 under the paragraph’s non-negative-demand rule. Anna also demands 0 at that price. The current reviewed target repeats the conflicting table; the lesson answer key correctly uses Ben=0 and collective demand=0. The inconsistency is visible on complete-book PDF page 79, not merely in an obsolete source.

**Recommendation:** keep the existing functions and change the €4 table row to Ben=0 in a coordinated target correction and Book 1 errata/next edition. Verify that collective demand and graph/answer references all use the same dataset. The existing key’s zero is consistent with the intended functions; it does not need to be changed to 1. A current correction notice should tell teachers to accept a table-based answer until the prompt is corrected. Evidence: [§1.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag%20%E2%80%93%20paragraaf.md), [§1.2.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L579), [§1.2.3 answer key](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag%20%E2%80%93%20antwoorden.md#L244).

### F02 · A correct percentage example is incorrectly described as unique

**Priority: medium. Scope: §1.1.3.** The book says the 50% ice-cream-sales fall is valid only when comparing prices €1.50 and €2.50. That pair is valid (400→200), but €2.50→€3.00 also gives a 50% fall (200→100). The target explicitly teaches checking claims against data, so the exclusive wording undermines the intended skill. The statement occurs on PDF page 29.

**Recommendation:** replace the exclusive claim with “for example” and identify both pairs; preserve the broader lesson that the base and interval must be named. This is a book-text correction, not a need to replace the graphing target. Evidence: [§1.1.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.3%20Grafieken%20en%20tabellen/1.1.3%20Grafieken%20en%20tabellen%20%E2%80%93%20paragraaf.md), [§1.1.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L208).

### F03 · Two Book 1 mixed units do not supply all reviewed target evidence

**Priority: high for assessment alignment.** In §1.1.4, the target requires constructing a P–Q graph and interpolating, whereas the printed set only reads an existing graph. In §1.3.4, the target requires separate numerical supply-shift and demand-shift equilibria; the printed set calculates the supply change but treats the demand change qualitatively. These skills are taught earlier, so they are not missing from Book 1 as a whole. They are missing from the specified independent consolidation evidence.

**Recommendation:** add a short graph/interpolation component to the next-edition §1.1.4 and a compact independent numerical demand-shift component to §1.3.4. Map each target subquestion to a required printed question and answer. Do not equate graph reading with graph construction, or a direction explanation with solving a new equilibrium. Evidence: [§1.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.4%20Gemengde%20opgaven/1.1.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md), [§1.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L383), [§1.3.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.4%20Gemengde%20opgaven/1.3.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md), [§1.3.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1273).

### F04 · Required target questions appear as optional-looking Denkertjes

**Priority: medium. Scope: §1.2.4.** The reviewed mixed target’s questions f and l correspond to the two printed Denkertjes. The content exists, but a teacher following the usual core/bonus distinction could omit part of the target evidence. This is an assessment-status ambiguity rather than a missing explanation.

**Recommendation:** explicitly identify the core questions in the mapping and teacher route. If those two questions are required target evidence, do not rely on an optional label to communicate that requirement. If they are intended only as extension, the target owner should approve that distinction. Evidence: [§1.2.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.4%20Gemengde%20opgaven/1.2.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md), [§1.2.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L789).

### F05 · “Normaal goed” changes meaning between Books 1 and 2

**Priority: medium.** Book 1 §1.2.2 defines a normal good broadly as one whose demand increases with income (PDF p.55). Book 2 §2.2.3 uses the approved mutually exclusive calculation labels: Ei<0 inferieur, 0<Ei<1 normaal, Ei>1 luxe, and leaves Ei=0/1 as boundary values (PDF p.55). A response with Ei=1.6 is therefore a “normal good” under Book 1’s broad definition and a “luxegoed” under Book 2’s classification. Without a bridge, learners can reasonably perceive a contradiction.

**Recommendation:** preserve the approved Book 2 convention and add a short explicit explanation that Book 1 used the positive-income-response term broadly while Book 2’s calculation categories use it more narrowly. At the next Book 1 revision, align the terminology or clearly label the introductory convention. Do not silently restore a necessity/luxury taxonomy that the owner’s current Book 2 decision replaced. Evidence: [§1.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.2%20Vraagfactoren/1.2.2%20Vraagfactoren%20%E2%80%93%20paragraaf.md), [§2.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/manuscript/2.2.3%20Inkomenselasticiteit%20en%20kruislingse%20elasticiteit%20%E2%80%93%20paragraaf.md), [Book 2 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md), [current terminology convention](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/economie-terminologie.md#L49).

### F06 · One Book 2 target adaptation needs an explicit equivalence record

**Priority: medium. Scope: §2.1.4.** Both the current registry and book use SmoothBox and broadly the same total/average/marginal operations, but the book changes the normal/spoed capacity scenario into separate Friday/Saturday plans and changes the applicable quantity ranges. Similar names and methods are not enough to establish that the exact approved target has been reproduced.

**Recommendation:** document the corresponding questions, numerical answers, capacity bounds and economic assumptions, then review the printed variant for equivalence. This desk review finds operation-family coverage, not a substantive error requiring wholesale replacement. Evidence: [§2.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H1/manuscript/2.1.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md), [§2.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1703), [Book 2 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.meta.json).

### F07 · Current metadata and older human-readable framework prose disagree

**Priority: medium; authoring/navigation reliability.** The v5 narrative still describes some Book 1 records as migrated/placeholders although the registry has 12 reviewed-final records. It describes much of Book 2 as reviewed-final while the exact currently approved replacement records retain the label `candidate_review_ready`. The Book 2 outline’s readiness table still mentions a stale dependency in §2.1.2 and two inelastic contexts in §2.2.1; the actual current target is repaired and includes StreamNow at −2. Its closing Gate 0B-0 prose says “not approved” while the header and approval metadata say approved with holds. The pedagogical-boundary note also retains a 12/12/14/16 count phrase and older income-classification wording.

Currentness **passes** because current metadata, exact pins, explicit structural-transition records and scoped holds carry authority. Historical text has deliberately been preserved; this is not a reason to treat Book 2 as unapproved or declare every hold released. Likewise, the original Books 3–4 “proposal” wording is intentionally preserved and is qualified by selected-baseline metadata.

**Recommendation:** provide a prominent current-status projection beside preserved historical prose, reconcile misleading blueprint status annotations, and label old readiness assessments clearly. Review existing hold evidence individually; printing a remedy does not automatically close a hold, and an open hold only blocks its defined action/scope. Avoid silently rewriting an approved semantic document or erasing provenance. Evidence: [Year 1 blueprint v5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-v5.md), [Book 2 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md), [Book 2 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.meta.json), [pedagogical boundaries](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-pedagogical-boundaries.md), [Part A authority/currentness explanation](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/docs/workflows/part-a-start.md), [Books 3–4 structural adoption record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md).

### F08 · Paragraph counts understate the documented teaching-time requirement

**Priority: high for course feasibility.** Both selected outlines ask for a complete 55-minute lesson. The teacher guides explicitly budget two lessons for several individual paragraphs. This is stronger evidence than page-count intuition, although it is still a design estimate rather than measured classroom time.

| Paragraphs / chapter | Delivered teacher plan | Consequence for a one-period-per-paragraph schedule |
|---|---|---|
| §§3.1.2, 3.1.3, 3.1.5 | Separate A/B routes of 55 minutes; Chapter 3.1 about nine lessons, with further support possible | Three extra core periods across six paragraphs |
| §3.2.2 | Two core lessons; Chapter 3.2 five core lessons, first-use range 5–7 | One extra core period across four paragraphs |
| §§4.2.4, 4.2.5 | Each core initially totals 64 minutes; teacher explicitly prescribes two lessons; Chapter 4.2 first-use range 9–12 | Two extra core periods across seven paragraphs |
| §2.2.3 | 55-minute route conditional on fluent prerequisites; preferably two lessons for a heterogeneous class | Additional contingent capacity requirement |
| Chapter 4.1 | First-use planning range 5–7 for four paragraphs; extra time especially §§4.1.2–4.1.3 | Further support/first-use capacity beyond the nominal count |
| Chapter 4.3 | Six estimated core routes; first-use range 6–8 | Absorption is visible in tasks, but a guaranteed time saving is unproven |

Following just the six explicitly split paragraph routes above adds **six periods** relative to one period for each of those six units. A purely illustrative 55-period Year 1 baseline would become at least 61 **before** further support, assessment or other unmeasured overruns. This is not a complete timetable forecast or a change to the 55-unit curriculum count.

**Recommendation:** keep separate fields for curriculum-unit count, core teaching periods, support allowance and test/retrieval time. Prefer an honest duration plan to cutting explanation or target operations to force a pass. If the available year cannot accommodate it, redesign the densest routes and trial them before deciding on scope changes. Prioritise §§2.2.3, 3.1.2–3.1.5, 3.2.2, 4.2.2, 4.2.4–4.2.5 and the absorbed labour-equilibrium route. Sources: [Book 3 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md), [Book 4 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md), [Book 2 elasticity teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/Docenten_en_bouwverantwoording.md), [Book 3 intervention teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/Docenteninformatie.md), [Book 3 competition teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H2_bronpakket/Docenteninformatie.md), [Book 4 monopoly teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H1_bronpakket/Docenteninformatie.md), [Book 4 market-failure teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/Docenteninformatie.md), [Book 4 labour teacher plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/Docenteninformatie.md).

### F09 · Books 3–4 have structural alignment without final target alignment evidence

**Priority: high before claiming educational approval.** All 31 Book 3–4 current records are `placeholder_needs_review`; adoption metadata explicitly says target approval is not conferred. The printed books do contain substantive doeloefeningen and answer models. They therefore provide reviewable candidates, but a valid import/compatibility result cannot replace the missing curricular target decision.

**Recommendation:** review the existing printed targets and answers against their proposed outline briefs, approve or amend the exact versions through the normal target route, and preserve historical mappings. Use this report as input, not as automatic promotion. Pay particular attention to explanation rubrics, prerequisite evidence, capacity checks and workload. The missing original `sources-and-scope.md`, `integration-handoff-v2.md` and v1-to-v2 migration companion are already recorded provenance limitations; the new live-v5 migration is not their replacement or proof of target equivalence. Sources: [Book 3 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.meta.json), [Book 4 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.meta.json), [Books 3–4 structural adoption record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md), [§3.1.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2816), [§4.3.6 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4444).

### F10 · Small Book 1 navigation and duplication defects

**Priority: low, but easy to verify.** The §1.2.2 summary incorrectly points to §1.2.3 as supply (PDF p.58); supply begins in §1.3.1. The worked bicycle-bell case appears twice in §1.3.3 (PDF pp.119–122), without a clear new learning purpose.

**Recommendation:** correct the reference and retain one complete worked case at the next authorised edition revision. These are bounded repairs, not a reason to reorder the curriculum. Evidence: [§1.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.2%20Vraagfactoren/1.2.2%20Vraagfactoren%20%E2%80%93%20paragraaf.md), [§1.3.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.3%20Verschuivingen%20en%20nieuw%20evenwicht/1.3.3%20Verschuivingen%20en%20nieuw%20evenwicht%20%E2%80%93%20paragraaf.md).

### F11 · The original chapter-page assumption no longer matches three delivered chapters

**Priority: medium for production planning, not a newly discovered import failure.** The preserved outlines carry a 40-page student-chapter assumption. Actual chapter PDFs are Book 3 **48/38/38** and Book 4 **38/60/50** pages. Thus Book 3 H1 exceeds that assumption by 8 pages, Book 4 H2 by 20 and H3 by 10. The import/adoption record already explicitly records these lengths, so this is an acknowledged divergence, not hidden corruption.

**Recommendation:** state an explicit current chapter-page budget or documented exception for the supplied editions. Review print cost, binding and readability using the actual totals. Do not shrink type or discard practice merely to restore the old assumption, and do not use page count as a substitute for classroom timing. Evidence: [Book 3 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md), [Book 4 outline](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md), [Book 3 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.meta.json), [Book 4 adoption/authority metadata](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.meta.json), [Books 3–4 structural adoption record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md).

## Paragraph-by-paragraph comparison

Each entry reports the intended operations, the printed content, the alignment judgment and a recommended action. PDF page references are **physical pages in the complete student PDF**, beginning at page 1; Book 2’s original chapter-footer numbering differs. A starting page is a locator, not a claim that the paragraph occupies one page. Every entry links its active manuscript, target record and, for Books 2–4, outline.

## Book 1 · Grondslagen, vraag en aanbod

The first printed edition is frozen. Proposed content repairs belong in explicit errata guidance and the authorised next-edition route, not silent replacement of the delivered PDF.

### §1.1.1 · Schaarste en economisch denken

**Aligned; local scope clarification.** Complete student PDF starts at **p. 6**.

**Framework:** Scarcity, alternatives and opportunity cost; compare the farmer’s 10 hectares at €500 versus €350 profit per hectare and explain a mixed allocation.

**Book:** The explanation and Opgave 4 teach and assess that chain: €5,000 versus €3,500 and €4,400 for the mixed allocation. The book additionally makes ‘nettowaarde = opbrengst − alternatieve kosten’ a recurring fourth step.

**Analysis:** The main target is covered. The extra fourth step is explicitly present in the local chapter and paragraph plans, so it is not an unexplained authoring invention. It is less visible in the central target’s goals; clarify whether it is a required assessed operation or a supporting comparison. Do not confuse this local difference with an omission of opportunity cost.

**Recommendation:** Retain the content; make the local four-step procedure’s assessment status explicit when the Book 1 framework is next reconciled.

Evidence: [§1.1.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.1%20Schaarste%20en%20economisch%20denken/1.1.1%20Schaarste%20en%20economisch%20denken%20%E2%80%93%20paragraaf.md); [§1.1.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L27); [local four-step plan](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.1%20Schaarste%20en%20economisch%20denken/_paragraph-plan.md#L30).

### §1.1.2 · Percentages en indexcijfers

**Aligned.** Complete student PDF starts at **p. 15**.

**Framework:** Calculate percentage changes and indices using the correct base; distinguish index-point changes from percentage changes.

**Book:** The smartphone and petrol examples teach the procedures. The bicycle, shopping-basket and index-table exercises require independent calculation, reversal of a percentage change and criticism of an incorrect inflation claim.

**Analysis:** The target operations are represented in the exercises, even though there is no separately labelled final target matching the registry verbatim. The calculation 108→112 is about 3.7%, not 4%. The wage/purchasing-power application reuses the same arithmetic rather than establishing a later macroeconomic model.

**Recommendation:** Retain; use the base-value distinction as explicit retrieval before elasticity.

Evidence: [§1.1.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.2%20Percentages%20en%20indexcijfers/1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20paragraaf.md); [§1.1.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L115).

### §1.1.3 · Grafieken en tabellen

**Content correction needed.** Complete student PDF starts at **p. 24**.

**Framework:** Read tables, construct P–Q graphs with the economic axis convention, interpolate, and assess a percentage claim from data.

**Book:** The theory distinguishes mathematical and economic axis conventions and demonstrates interpolation. Independent cinema and water-sales exercises practise the required operations. However, the ice-cream explanation says a 50% fall occurs only between €1.50 and €2.50.

**Analysis:** The operations align, but that exclusive claim is false: the same table also falls from 200 to 100 between €2.50 and €3.00. This directly undermines the target’s data-claim reasoning. It appears in the delivered PDF on page 29.

**Recommendation:** F02: replace ‘only’ with an example formulation and explicitly accept both valid pairs in the next edition/errata guidance.

Evidence: [§1.1.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.3%20Grafieken%20en%20tabellen/1.1.3%20Grafieken%20en%20tabellen%20%E2%80%93%20paragraaf.md); [§1.1.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L208).

### §1.1.4 · Gemengde opgaven: economisch denken en rekenen

**Partial target coverage.** Complete student PDF starts at **p. 34**.

**Framework:** A mixed task combining opportunity cost, percentages, indices, graph construction, interpolation and claim checking, with no new economic theory.

**Book:** The printed bakery, fruit/vegetable and school-canteen cases integrate choice, supplied profit arithmetic, percentages, indices and reading a provided time-series graph. They do not ask students to construct a graph or interpolate between points.

**Analysis:** The reviewed lunch-box target explicitly requires graph construction and interpolation. Context substitution is acceptable in principle; the loss of these observable operations is the actual mismatch. Both skills were taught in §1.1.3, so this is missing consolidation evidence, not an entirely missing course topic. The supplied profit formula is a permitted scaffold.

**Recommendation:** F03: add a compact independent graph-and-interpolation component to the next-edition mixed task, with an answer model.

Evidence: [§1.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/1.1.4%20Gemengde%20opgaven/1.1.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§1.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L383).

### §1.2.1 · Individuele vraag

**Aligned with bounded preview.** Complete student PDF starts at **p. 38**.

**Framework:** Use willingness to pay to make buy/no-buy decisions, draw the individual step-demand curve and explain the declining relation.

**Book:** Lisa’s pizza exercise reproduces the target’s willingness-to-pay values and price decisions. The book also introduces discrete consumer surplus through willingness to pay minus price and provides calculations before Book 2 formalises continuous surplus areas.

**Analysis:** The step curve is explicitly required by this reviewed target; it should not be removed merely because a general boundary warns against unnecessary step-function work. The pedagogical boundary permits bounded Book 1 surplus familiarity. This does not establish secure mastery of Book 2’s supply-as-MC, area or welfare operations.

**Recommendation:** Retain the target; continue to teach formal surplus in full in §§2.3.1–2.3.3.

Evidence: [§1.2.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.1%20Individuele%20vraag/1.2.1%20Individuele%20vraag%20%E2%80%93%20paragraaf.md); [§1.2.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L411).

### §1.2.2 · Vraagfactoren

**Terminology and reference repair.** Complete student PDF starts at **p. 52**.

**Framework:** Distinguish own-price movement from demand shifts; explain income, preferences, expectations, substitutes and complements.

**Book:** The butter/margarine target and wider practice cover the specified distinctions. Book 1 defines a normal good as any good whose demand rises with income. The summary then incorrectly directs readers to §1.2.3 for supply.

**Analysis:** The main demand-factor operations align. There are two concrete continuity defects: Book 2 reserves ‘normaal goed’ for 0<Ei<1 within its approved three-category convention, and §1.2.3 actually concerns collective demand. Supply starts at §1.3.1. The incorrect pointer appears on PDF page 58.

**Recommendation:** F05/F10: add the broad-to-narrow terminology bridge and correct the next-topic reference in the next edition/teacher errata.

Evidence: [§1.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.2%20Vraagfactoren/1.2.2%20Vraagfactoren%20%E2%80%93%20paragraaf.md); [§1.2.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L488).

### §1.2.3 · Van individuele naar collectieve vraag

**Book/target/answer inconsistency.** Complete student PDF starts at **p. 67**.

**Framework:** Add quantities at the same price, construct collective demand, combine functions while buyers participate and interpret buyer dropout.

**Book:** The theory and Opgave 10 implement these operations. At P=€4, its table gives Anna=0 and Ben=1, whereas Ben’s supplied function Q=−3P+11 gives −1, hence zero after applying non-negative demand.

**Analysis:** The same inconsistent table is in the current reviewed target. The lesson answer key instead gives Ben=0 and collective demand=0 at €4, consistent with the functions and the theory’s dropout price 11/3. A learner following the printed table therefore obtains a different answer from the key. PDF page 79 displays table and formula together.

**Recommendation:** F01: retain the functions and correct the €4 table row to Ben=0 and collective demand=0 in coordinated target/next-edition corrections; verify associated graph and key consistency.

Evidence: [§1.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag/1.2.3%20Van%20individuele%20naar%20collectieve%20vraag%20%E2%80%93%20paragraaf.md); [§1.2.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L579).

### §1.2.4 · Gemengde opgaven: vraag

**Core-versus-bonus clarification.** Complete student PDF starts at **p. 82**.

**Framework:** Consolidate individual and collective demand, dropout, own-price movement, preference/substitute shifts and source-claim evaluation.

**Book:** The Blend and beach-ice-cream cases are the basis of the reviewed target. They require adding quantities, combining active-group functions, interpreting a graph and separating two simultaneous changes. Two target questions correspond to printed Denkertjes.

**Analysis:** The relevant content exists. However, registry questions f and l are the optional-looking Denkertjes about sales versus shifts and a hot-weather price claim. The mapping does not make it clear whether all target evidence is compulsory. The frozen-yoghurt opening supplies a substitute context but should not be described as proof that the substitute’s price changed.

**Recommendation:** F04: explicitly decide which Denkertje questions belong to the assessed core; preserve the bounded substitute interpretation already flagged by the registry.

Evidence: [§1.2.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.2%20Hoofdstuk%20Vraag/1.2.4%20Gemengde%20opgaven/1.2.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§1.2.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L789).

### §1.3.1 · Aanbod

**Aligned.** Complete student PDF starts at **p. 86**.

**Framework:** Interpret supply, distinguish movement from shift and explain input-cost, technology and subsidy effects on supply.

**Book:** The supply explanation, diagrams and solar-panel target ask students to connect higher input costs and a subsidy to the correct shift and name supply factors. The target’s operations are independently practised.

**Analysis:** The qualitative subsidy example is within the approved supply-factor scope. It does not establish prior mastery of a two-price wedge or government-budget calculation; Book 3 correctly introduces those later. Earlier consumer-surplus retrieval remains bounded.

**Recommendation:** Retain; maintain the distinction between a qualitative supply factor and the later formal intervention model.

Evidence: [§1.3.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.1%20Aanbod/1.3.1%20Aanbod%20%E2%80%93%20paragraaf.md); [§1.3.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L858).

### §1.3.2 · Marktevenwicht

**Aligned; extension sequencing note.** Complete student PDF starts at **p. 101**.

**Framework:** Solve and check an equilibrium, plot it and calculate excess demand or supply at a non-equilibrium price.

**Book:** The notebook case gives P=25 and Q=50, with excess supply of 25 at P=30. The exercises require equality, substitution checks, graph work and a price-adjustment explanation. A later exercise also asks about a shift before §1.3.3 formalises new equilibria.

**Analysis:** The central equilibrium target is covered. The final shift item is an anticipatory extension; it should not be used as evidence that the complete next-paragraph method has already been mastered. The following paragraph does teach that method explicitly.

**Recommendation:** Retain core content; make the anticipatory status of the extra shift item clear when revising the exercise route.

Evidence: [§1.3.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.2%20Marktevenwicht/1.3.2%20Marktevenwicht%20%E2%80%93%20paragraaf.md); [§1.3.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L958).

### §1.3.3 · Verschuivingen en nieuw evenwicht

**Aligned; duplicated example.** Complete student PDF starts at **p. 113**.

**Framework:** Calculate and interpret new equilibria after demand and supply changes, including the target’s separate and combined scenarios.

**Book:** The notebook exercise covers original 25/50, increased supply 22/56, increased demand 29/62 and both changes 26/68. The delivered book prints the worked bicycle-bell example twice, around PDF pages 119–122.

**Analysis:** The required methods are present, including the preparation needed for labour-market shifts later. The repeated worked case adds reading without a clearly different learning operation. It is an editorial duplication, not contradictory economics or an omitted target.

**Recommendation:** F10: consolidate the duplicate in the next edition, preserving one complete worked route and independent practice.

Evidence: [§1.3.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.3%20Verschuivingen%20en%20nieuw%20evenwicht/1.3.3%20Verschuivingen%20en%20nieuw%20evenwicht%20%E2%80%93%20paragraaf.md); [§1.3.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1060).

### §1.3.4 · Gemengde opgaven: aanbod en marktevenwicht

**Partial target coverage.** Complete student PDF starts at **p. 129**.

**Framework:** A mixed target with the original equilibrium, an excess-supply calculation and two separate numerical new equilibria: one supply shift and one demand shift.

**Book:** The printed set includes original-equilibrium arithmetic, qualitative demand-shift drawings and explanations, and a final bread-market target with a numerical supply shift. It does not require a numerical demand-shift equilibrium in this paragraph.

**Analysis:** The reviewed target requires that separate demand calculation and comparison. Qualitative graphs do not provide the same evidence as solving the changed demand equation. The operation is taught in §1.3.3, so this is a consolidation/assessment gap, not proof that Book 1 never teaches it.

**Recommendation:** F03: add one independent numerical demand-shift scenario and comparison to the next-edition mixed target.

Evidence: [§1.3.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/1.3%20Hoofdstuk%20Aanbod%20en%20marktevenwicht/1.3.4%20Gemengde%20opgaven/1.3.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§1.3.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1273).

## Book 2 · Kosten, opbrengsten, elasticiteit en surplus

The exact replacement package has owner-approval/integration evidence. Its `candidate_review_ready` labels do not by themselves mean the package is unapproved; scoped holds and variant equivalence still matter.

### §2.1.1 · Kostenstructuren

**Aligned.** Complete student PDF starts at **p. 4**.

**Framework:** Classify fixed and variable costs within a stated period/capacity; construct total-cost functions and calculate/interpret averages.

**Book:** Fles & Co and the De Korenaar target teach total versus per-unit costs, capacity limits and the Q>0 condition for averages. Students calculate at different outputs and explain why average fixed cost falls.

**Analysis:** The current target’s observable operations are represented. Costs are taught explicitly rather than presumed from Book 1’s isolated supplied-profit arithmetic. Monthly billing is correctly distinguished from fixed total cost.

**Recommendation:** Retain. Keep units, time horizon and capacity conditions in future adaptations.

Evidence: [§2.1.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H1/manuscript/2.1.1%20Kostenstructuren%20%E2%80%93%20paragraaf.md); [§2.1.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1301); [Book 2 outline · §2.1.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L143).

### §2.1.2 · Opbrengsten, winst en break-even

**Aligned.** Complete student PDF starts at **p. 12**.

**Framework:** Calculate TO, GO and profit; solve break-even and distinguish continuous break-even from the first profitable whole output; interpret TK/TO graphs.

**Book:** The De Korenaar route links revenue and costs and differentiates break-even at 500/0.7≈714.29 from the first profitable whole unit, 715. The TK/TO graph represents profit as a vertical difference.

**Analysis:** The required operations are taught and assessed. This correct treatment should not be overwritten by the outline table’s old ‘stale §1.3.2 reference’ repair instruction: the current approved replacement target already supplies the appropriate cost foundation.

**Recommendation:** Retain the book; reconcile stale readiness prose in the framework under F07.

Evidence: [§2.1.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H1/manuscript/2.1.2%20Opbrengsten%2C%20winst%20en%20break-even%20%E2%80%93%20paragraaf.md); [§2.1.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1430); [Book 2 outline · §2.1.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L143).

### §2.1.3 · Marginale kosten en marginale opbrengsten

**Aligned.** Complete student PDF starts at **p. 21**.

**Framework:** Compute MK=ΔTK/ΔQ and MO=ΔTO/ΔQ over stated intervals, including unequal interval widths; interpret linear and nonlinear totals without formal output optimisation.

**Book:** Linea and Curva tables require students to normalise differences, label per-unit results and connect them to profit changes. The prose distinguishes marginal from average and does not introduce derivatives or an MO=MK output-choice rule.

**Analysis:** This respects the approved boundary and the open H-213-OPC2 restriction on formal output choice. Book 3 can retrieve marginal meaning while teaching optimisation and the limited derivative as new operations.

**Recommendation:** Retain; do not ‘resolve’ the output-choice hold by moving Book 3’s formal rule into this paragraph.

Evidence: [§2.1.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H1/manuscript/2.1.3%20Marginale%20kosten%20en%20marginale%20opbrengsten%20%E2%80%93%20paragraaf.md); [§2.1.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1517); [Book 2 outline · §2.1.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L143).

### §2.1.4 · Gemengde opgaven: kosten en opbrengsten

**Operation fit; variant mapping needed.** Complete student PDF starts at **p. 31**.

**Framework:** Consolidate cost, revenue, break-even, profit and interval marginal calculations in the approved SmoothBox context, without a new optimisation rule.

**Book:** The printed SmoothBox task uses separate Friday and Saturday production plans, with capacity 1,000, where the registry uses a normal-capacity/spoed comparison with a 700-unit boundary. It still requires the familiar cost/profit calculations and interval MK values 3, 3.5 and 4 against MO=5.

**Analysis:** The operation families align, but the source scenario and feasible ranges are not identical to the exact approved target. The changed bounds matter for answers, so a same-name match is insufficient. This review finds a plausible equivalent adaptation, not existing proof of approved equivalence.

**Recommendation:** F06: record a subquestion-level comparison and review the changed capacity/scenario assumptions; retain valid calculations rather than automatically replacing the manuscript.

Evidence: [§2.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H1/manuscript/2.1.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§2.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1703); [Book 2 outline · §2.1.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L143).

### §2.2.1 · Prijselasticiteit

**Aligned.** Complete student PDF starts at **p. 38**.

**Framework:** Calculate signed price elasticity with the old base, classify by absolute magnitude and interpret responsiveness using the context.

**Book:** Nova and StreamNow provide an inelastic result of −0.8 and an elastic result of −2. The book retrieves percentage calculation and demand factors, practises a price decrease as well as an increase, and distinguishes magnitude from sign.

**Analysis:** The current target is represented and the formerly requested elastic contrast is visible in teaching and independent work. The outline’s claim that both target cases are inelastic describes an older state. Evidence of a remedy does not by itself release a recorded hold.

**Recommendation:** Retain the book; use its exercise locations to reconcile H-221-PRIOR/H-22-ELASTIC-CONTRAST and the stale outline statement (F07).

Evidence: [§2.2.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/manuscript/2.2.1%20Prijselasticiteit%20%E2%80%93%20paragraaf.md); [§2.2.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1857); [Book 2 outline · §2.2.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L142).

### §2.2.2 · Elasticiteit en omzet

**Aligned.** Complete student PDF starts at **p. 46**.

**Framework:** Combine elasticity with actual revenue before/after a price change; qualify the revenue rule for finite changes and distinguish revenue from profit.

**Book:** The target compares Nova revenue 5,000→5,040 and StreamNow 20,000→17,600. A counterexample shows that old-base elasticity of −0.9 can still accompany a revenue fall for a sizeable price increase.

**Analysis:** This is a strong match: the book does not substitute a memorised elastic/inelastic slogan for the actual calculation. It explicitly separates a local small-change rule from finite changes and refuses a profit conclusion without costs.

**Recommendation:** Retain the finite-change counterexample and the revenue-only advice boundary.

Evidence: [§2.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/manuscript/2.2.2%20Elasticiteit%20en%20omzet%20%E2%80%93%20paragraaf.md); [§2.2.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L1940); [Book 2 outline · §2.2.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L142).

### §2.2.3 · Inkomenselasticiteit en kruislingse elasticiteit

**Aligned; cross-book terminology bridge needed.** Complete student PDF starts at **p. 54**.

**Framework:** Calculate Ei and Ek, apply the approved three-category Ei convention, name both goods for Ek and vary one factor at a time in a multivariable demand function.

**Book:** Opgave 8 covers income, coffee and fitness. The book explicitly uses Ei<0 inferieur, 0<Ei<1 normaal and Ei>1 luxe, with 0 and 1 left as boundary values; it resets the baseline before the second function scenario.

**Analysis:** The classification matches the current owner-approved outline and terminology file. The inconsistency is with Book 1’s broader use of ‘normal’, not a failure to follow Book 2’s authority. The teacher guide calls the 55-minute route conditional and prefers two lessons for a heterogeneous class.

**Recommendation:** F05: add an explicit bridge; F08: retain the two-lesson contingency in real planning rather than claiming an unconditional one-lesson fit.

Evidence: [§2.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/manuscript/2.2.3%20Inkomenselasticiteit%20en%20kruislingse%20elasticiteit%20%E2%80%93%20paragraaf.md); [§2.2.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2032); [Book 2 outline · §2.2.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L106).

### §2.2.4 · Gemengde opgaven: elasticiteit

**Aligned.** Complete student PDF starts at **p. 66**.

**Framework:** Integrate Ev, revenue, Ei, Ek, functions and bounded advice through source selection, with no new theory.

**Book:** The StreamPlus task combines Ev=−0.7, revenue 500,000→516,000, premium/budget income responses, a positive cross-price response and a multivariable quantity comparison. Its advice must use selected source evidence.

**Analysis:** The target’s operation mix is preserved. It asks for economic interpretation as well as arithmetic and does not turn a demand/revenue result into a profit-maximising price claim. The teacher’s mixed-lesson route selects work instead of assigning all printed extras.

**Recommendation:** Retain; keep the explicit source-selection and bounded-conclusion criteria.

Evidence: [§2.2.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H2/manuscript/2.2.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§2.2.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2143); [Book 2 outline · §2.2.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L142).

### §2.3.1 · Consumentensurplus

**Aligned.** Complete student PDF starts at **p. 74**.

**Framework:** Formalise consumer surplus from willingness to pay and actual purchases, including a linear demand-area calculation and a labelled graph.

**Book:** The book starts from individual willingness to pay and teaches the continuous triangle explicitly. The target yields Q=60 and CS=900 under the supplied demand and price conditions.

**Analysis:** Book 1’s discrete surplus preview is not treated as sufficient preparation. The paragraph supplies the missing formal area method and does not require a market equilibrium where only a demand relation and price have been given.

**Recommendation:** Retain the explicit formalisation and the distinction between a demand-at-price exercise and an equilibrium exercise.

Evidence: [§2.3.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H3/manuscript/2.3.1%20Consumentensurplus%20%E2%80%93%20paragraaf.md); [§2.3.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2338); [Book 2 outline · §2.3.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L87).

### §2.3.2 · Producentensurplus en totaal surplus

**Aligned.** Complete student PDF starts at **p. 82**.

**Framework:** Interpret competitive supply as marginal cost under stated assumptions; calculate CS, PS and TS and assess marginal gains from trade.

**Book:** The concert-ticket target gives equilibrium Q=60, P=20, CS=900, PS=450 and TS=1,350. It asks why another trade can add or reduce surplus, and why maximum total surplus is not a fairness conclusion.

**Analysis:** The economic bridge from the supply line to marginal cost is explicitly taught. The target combines areas with meaning rather than relying only on a triangle formula. This establishes a suitable foundation for later intervention and monopoly welfare comparisons.

**Recommendation:** Retain the competitive assumptions and efficiency-versus-distribution distinction.

Evidence: [§2.3.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H3/manuscript/2.3.2%20Producentensurplus%20en%20totaal%20surplus%20%E2%80%93%20paragraaf.md); [§2.3.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2429); [Book 2 outline · §2.3.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L146).

### §2.3.3 · Pareto-efficiëntie en welvaartsverlies

**Aligned.** Complete student PDF starts at **p. 92**.

**Framework:** Compare constrained transactions with the efficient benchmark; calculate CS/PS/TS and deadweight loss and explain a feasible Pareto improvement under explicit allocation assumptions.

**Book:** The booking rule fixes 40 transactions at P=25 and specifies who trades. Students calculate rectangular-plus-triangular surplus, TS=1,200 and loss=150, then examine a feasible additional mutually beneficial transaction.

**Analysis:** The required allocation and implementation assumptions are stated. The paragraph does not infer welfare from a quoted price alone or present the booking case as a complete course in government price controls. It prepares the required shapes and reasoning for Book 3.

**Recommendation:** Retain the actual-transaction boundary and explicit feasibility condition.

Evidence: [§2.3.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H3/manuscript/2.3.3%20Pareto-effici%C3%ABntie%20en%20welvaartsverlies%20%E2%80%93%20paragraaf.md); [§2.3.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2555); [Book 2 outline · §2.3.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L146).

### §2.3.4 · Gemengde opgaven: surplus en welvaart

**Aligned.** Complete student PDF starts at **p. 103**.

**Framework:** Select and combine the chapter’s welfare methods in a mixed case, without new intervention theory.

**Book:** The island rental-bike target compares free equilibrium Q=40, P=40, TS=1,200 with 30 allocated rentals at P=45 and TS=1,125; the welfare loss is 75. Students explain the distribution and limit the conclusion.

**Analysis:** The target operations match the approved replacement and preserve demand/supply, transaction and allocation assumptions. The mixed paragraph consolidates the earlier area methods rather than introducing a new policy procedure.

**Recommendation:** Retain; update the framework’s historical placeholder/readiness prose separately (F07).

Evidence: [§2.3.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/bronnen/H3/manuscript/2.3.4%20Gemengde%20opgaven%20%E2%80%93%20opgaven.md); [§2.3.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2668); [Book 2 outline · §2.3.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-2-outline.md#L146).

## Book 3 · Overheidsingrijpen, concurrentie en internationale handel

All judgments in this book are against the **selected outline design**. Every target record remains a placeholder; F09 applies throughout.

### §3.1.1 · Belastingen: wig en nieuw evenwicht

**Aligned with selected outline.** Complete student PDF starts at **p. 6**.

**Framework:** Introduce a per-unit tax wedge and calculate original and new equilibria, buyer price, seller receipt and actual transactions; defer welfare accounting.

**Book:** The same-Q explanation and worked example bridge from Book 1’s single-price market to Pc−Pp=t. The printed-bag target calculates original 60/€8 and taxed Q=50, Pc=€10, Pp=€7 for a €3 tax.

**Analysis:** The new two-price interpretation is taught explicitly and independently assessed. The legal remitter is distinguished from the economic burden, and the seller’s receipt is not called profit. The full welfare ledger is deferred to §3.1.2 as intended.

**Recommendation:** Retain; submit the actual target and answer model for the outstanding target review (F09).

Evidence: [§3.1.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.1%20manuscript.md); [§3.1.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2816); [Book 3 outline · §3.1.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L63).

### §3.1.2 · Belastingdruk en welvaartsverlies

**Content aligned; timing conflict.** Complete student PDF starts at **p. 14**.

**Framework:** Calculate incidence, government revenue and welfare effects; explain relative responsiveness without treating tax revenue as deadweight loss.

**Book:** The target reuses the tax outcome: buyer burden €2, seller burden €1, revenue €150 and welfare loss €15. A controlled responsiveness contrast avoids inferring elasticity from unrelated graph scales.

**Analysis:** The economic operations and assumptions fit. The delivered teacher guide budgets separate A and B lessons for this paragraph, rather than the outline’s one complete 55-minute lesson. That is a documented capacity mismatch, not merely a reviewer’s impression of dense pages.

**Recommendation:** F08: record two planned periods or redesign and trial the core; preserve the incidence and welfare distinctions. Target approval remains outstanding (F09).

Evidence: [§3.1.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.2%20manuscript.md); [§3.1.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2870); [Book 3 outline · §3.1.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L75).

### §3.1.3 · Subsidies

**Content aligned; timing conflict.** Complete student PDF starts at **p. 23**.

**Framework:** Reverse the wedge for a subsidy, calculate both prices and government expenditure, and evaluate welfare without external benefits.

**Book:** The subsidy target identifies eligible transactions and recipient; it calculates Q=70, Pc=12, Pp=15 and government spending 210. The surplus ledger yields 15 less welfare than the no-subsidy benchmark.

**Analysis:** The book explains why the budget is a separate term and why a subsidy without external benefits need not improve efficiency. This is consistent with the later changed-assumption treatment in §4.2.5. The teacher guide explicitly divides the paragraph into two lessons.

**Recommendation:** F08: reconcile the two-lesson route with the timetable. Retain the no-external-benefit assumption; target review is still needed (F09).

Evidence: [§3.1.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.3%20manuscript.md); [§3.1.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2924); [Book 3 outline · §3.1.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L91).

### §3.1.4 · Maximumprijs

**Aligned with selected outline.** Complete student PDF starts at **p. 32**.

**Framework:** Distinguish binding and non-binding ceilings; calculate demand, supply, transactions and shortage, and state who obtains the good.

**Book:** The tent case contrasts a €10 ceiling below the €12 equilibrium with a non-binding €14 ceiling. At €10 it finds demand 80, supply/sales 40 and shortage 40; it states the allocation assumption.

**Analysis:** The paragraph does not confuse a lower permitted price with universal access. It keeps the welfare demand bounded rather than adding a full housing-policy or rationing model. The teacher guide supplies a 55-minute core estimate, not measured classroom proof.

**Recommendation:** Retain the binding test and allocation conditions; review the actual target under F09.

Evidence: [§3.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.4%20manuscript.md); [§3.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L2978); [Book 3 outline · §3.1.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L105).

### §3.1.5 · Minimumprijs en quota

**Content aligned; timing conflict.** Complete student PDF starts at **p. 39**.

**Framework:** Analyse a price floor with an explicit public-purchase rule, then make a bounded production-quota comparison.

**Book:** The mushroom target starts at P=14, Q=60. A floor at 16 gives private demand 40, supply 80 and public purchases 40 costing 640. A production quota of 40 gives a different quantity/budget mechanism.

**Analysis:** The book correctly avoids assuming that every floor includes government purchases or that a quota is the same instrument. The teacher route allocates a second lesson to the quota comparison and target, confirming the load concern already flagged in the outline.

**Recommendation:** F08: make the extra period explicit in capacity planning; retain the bounded quota contrast. Complete target review (F09).

Evidence: [§3.1.5 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.5%20manuscript.md); [§3.1.5 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3032); [Book 3 outline · §3.1.5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L119).

### §3.1.6 · Gemengde opgaven: overheidsingrijpen

**Aligned with selected outline.** Complete student PDF starts at **p. 48**.

**Framework:** Select among familiar intervention methods and combine calculation, a labelled diagram and a bounded policy conclusion without new theory.

**Book:** The mixed target contrasts a tax case with a price ceiling. It requires one main graph operation and the relevant quantities/budget reasoning, without forcing a second full welfare ledger for the ceiling case.

**Analysis:** The selected outline explicitly permits a small contrasting set rather than every intervention in one target. The printed route follows that boundary. Additional consolidation is available outside the compulsory 55-minute lesson.

**Recommendation:** Retain the selective mixed design and explicit workload choices; review the actual target (F09).

Evidence: [§3.1.6 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H1_Herzien_bronpakket/3.1.6%20manuscript.md); [§3.1.6 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3086); [Book 3 outline · §3.1.6](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L133).

### §3.2.1 · Volkomen concurrentie: kenmerken

**Aligned with selected outline.** Complete student PDF starts at **p. 54**.

**Framework:** Explain price taking and translate market price into the individual firm’s P=GO=MO relation, with distinct market/firm quantities.

**Book:** The carrot-auction case moves the €3 market price to a small supplier, separates Q from q and requires revenue and graph interpretation. The theory states the competitive assumptions.

**Analysis:** The book does not confuse a horizontal firm demand line with horizontal market demand. It reuses revenue arithmetic but teaches the new economic meaning of price taking. This is the required bridge into formal output choice.

**Recommendation:** Retain the paired graph/actor explanation; complete actual-target review (F09).

Evidence: [§3.2.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H2_bronpakket/3.2.1%20manuscript.md); [§3.2.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3140); [Book 3 outline · §3.2.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L155).

### §3.2.2 · Winstmaximalisatie bij volkomen concurrentie

**Content aligned; timing conflict.** Complete student PDF starts at **p. 62**.

**Framework:** Teach feasible profit-maximising output, marginal sign checks and profit; explicitly teach the limited derivative if quadratic TK is used.

**Book:** The paragraph distinguishes interval averages from a point derivative, teaches aq²+bq+c→2aq+b and checks capacity. The Korrels target gives q=150 and profit €500, with a separate binding-capacity comparison.

**Analysis:** This is authorised new learning here, not an illicit calculus prerequisite imported into Book 2. The graph’s profit rectangle is distinguished from the earlier TK/TO vertical gap. The teacher guide explicitly requires two core lessons for the combined mathematical and economic learning.

**Recommendation:** F08: budget two periods or revise the core with demonstrated feasibility; do not remove the derivative explanation or maximum/capacity checks. F09 applies.

Evidence: [§3.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H2_bronpakket/3.2.2%20manuscript.md); [§3.2.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3194); [Book 3 outline · §3.2.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L169).

### §3.2.3 · Langetermijnevenwicht

**Aligned with selected outline.** Complete student PDF starts at **p. 74**.

**Framework:** Explain entry/exit and the competitive long-run outcome under stated cost assumptions; distinguish zero economic profit from no remuneration.

**Book:** The book connects firm profit to market supply shifts, price and subsequent output. The target includes normal entrepreneurial remuneration in costs and interprets a zero-profit outcome rather than zero revenue.

**Analysis:** The cost convention and adjustment horizon are explicit. It avoids automatic shutdown conclusions from a short-period loss and does not assume a general long-run cost model beyond the supplied case. The independent task combines calculation and adjustment reasoning.

**Recommendation:** Retain the remuneration and horizon explanations; review the target under F09.

Evidence: [§3.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H2_bronpakket/3.2.3%20manuscript.md); [§3.2.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3248); [Book 3 outline · §3.2.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L183).

### §3.2.4 · Gemengde opgaven: volkomen concurrentie

**Aligned with selected outline.** Complete student PDF starts at **p. 83**.

**Framework:** Integrate a market change, the firm’s output/profit response and subsequent entry or exit across distinct moments.

**Book:** The mixed case separates initial P=8/Q=10,000/q=100, the immediate demand-change outcome P=12/Q=20,000/q=200, and the later P=8/Q=30,000/q=100 outcome.

**Analysis:** The market-to-firm calculations and long-run narrative are consistent; the aggregate and per-firm quantities can be reconciled. The task does not introduce monopoly as a prerequisite or obscure the distinction between the immediate and long-run stages.

**Recommendation:** Retain the three-stage source structure; complete actual-target review (F09).

Evidence: [§3.2.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H2_bronpakket/3.2.4%20manuscript.md); [§3.2.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3302); [Book 3 outline · §3.2.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L197).

### §3.3.1 · Waarom landen handelen: specialisatie en concurrentiepositie

**Aligned with selected outline.** Complete student PDF starts at **p. 92**.

**Framework:** Explain comparative versus absolute advantage qualitatively, including a country stronger in both activities; avoid a numerical specialisation algorithm or labour-cost prerequisite.

**Book:** Aster and Brin provide a verbal relative-opportunity-cost case. Students explain specialisation, possible gains and distributional qualifications without calculating production ratios or exchange-rate bounds.

**Analysis:** The conceptual difficulty is retained while the expressly deferred arithmetic is absent from the required target. Productivity is used qualitatively with source information; formal output-per-hour and unit-labour-cost calculations remain in §4.3.1.

**Recommendation:** Retain this scope; do not restore historical numerical trade targets merely because old IDs overlap. F09 applies.

Evidence: [§3.3.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H3_bronpakket/3.3.1%20manuscript.md); [§3.3.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3356); [Book 3 outline · §3.3.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L221).

### §3.3.2 · Wereldmarktprijs, import, export en welvaart

**Aligned with selected outline.** Complete student PDF starts at **p. 101**.

**Framework:** Use a small-country world-price model to identify domestic demand/supply, imports or exports and qualitative distributional effects.

**Book:** The camping-mat case uses a supplied graph and quantity-at-price arithmetic. An independent contrasting exercise considers exports. The book states price-taking and contextual assumptions and identifies buyers’ and sellers’ differing interests.

**Analysis:** The target uses familiar market calculations and substantive interpretation without requiring a new full welfare-area ledger. The distinction between autarky equilibrium and an externally given trading price is taught explicitly.

**Recommendation:** Retain the graph-led route and export contrast; review the actual target (F09).

Evidence: [§3.3.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H3_bronpakket/3.3.2%20manuscript.md); [§3.3.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3421); [Book 3 outline · §3.3.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L237).

### §3.3.3 · Protectionisme: invoerheffingen en importquota

**Aligned with selected outline.** Complete student PDF starts at **p. 111**.

**Framework:** Calculate remaining imports and tariff revenue; explain distributional effects and a bounded quota contrast, including the no-import limit.

**Book:** The Daro target computes revenue from 40 imports at €10, not all domestic sales. The book teaches and practises a prohibitive-tariff boundary and explains why freely allocated import licences do not automatically produce government receipts.

**Analysis:** The required chain is appropriately limited. It does not mechanically impose world price plus tariff after imports disappear or introduce quantitative quota rents, exchange-rate adjustment or strategic retaliation.

**Recommendation:** Retain the import-only revenue base and no-import contrast; complete target review (F09).

Evidence: [§3.3.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H3_bronpakket/3.3.3%20manuscript.md); [§3.3.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3463); [Book 3 outline · §3.3.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L131).

### §3.3.4 · Gemengde opgaven: internationale handel

**Aligned with selected outline.** Complete student PDF starts at **p. 121**.

**Framework:** Combine qualitative trade reasoning, a familiar graph/table calculation and a qualified policy conclusion without new theory.

**Book:** The Nerin mixed case combines verbal relative-advantage reasoning, a 40×€5 tariff-revenue calculation, stakeholder effects and a quota comparison. The figures and methods were taught in the preceding paragraphs.

**Analysis:** The capstone remains explanation-led, as the revised outline requires. References to jobs do not demand a labour-market equation or establish a general employment result. The transition to Book 4 correctly introduces monopoly next.

**Recommendation:** Retain; assess the actual reasoning rubric and target under F09.

Evidence: [§3.3.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/source_chapters/Boek_3_H3_bronpakket/3.3.4%20manuscript.md); [§3.3.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3505); [Book 3 outline · §3.3.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-3-outline.md#L269).

## Book 4 · Monopolie, marktfalen en arbeidsmarkt

All judgments in this book are against the **selected outline design**. Every target record remains a placeholder; F09 applies throughout.

### §4.1.1 · Monopolie: kenmerken

**Aligned with selected outline.** Complete student PDF starts at **p. 6**.

**Framework:** Explain monopoly, entry barriers and the price/quantity constraint by contrasting the competitive firm with market demand.

**Book:** The island-ferry source defines the relevant market and uses P=24−0.1q to show that the seller cannot choose q=120 while retaining the price associated with q=60. Opening retrieval restores the competitive comparison.

**Analysis:** The book teaches downward-sloping firm demand as new economic meaning, not just a renamed familiar line. Monopoly is not presented as unlimited pricing power, and entry-barrier examples do not become a premature policy-evaluation course.

**Recommendation:** Retain the market-definition and price/quantity constraint; F09 requires target review.

Evidence: [§4.1.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H1_bronpakket/4.1.1%20manuscript.md); [§4.1.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3547); [Book 4 outline · §4.1.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L78).

### §4.1.2 · Marginale opbrengst bij monopolie

**Aligned with selected outline.** Complete student PDF starts at **p. 14**.

**Framework:** Derive TO and MO from a linear demand relation under uniform pricing and explain the price reduction on existing units.

**Book:** The Prisma task derives TO=30q−0.5q² and MO=30−q. The 20→30 output interval produces an average revenue increment of 5 while point MO at 20 is 10, with the difference explained through gained and lost revenue.

**Analysis:** The limited derivative is retrieved from §3.2.2 rather than assumed before its teaching. Interval versus point values are carefully separated; no point-elasticity formula or general calculus course is introduced. Extra support may require an additional lesson.

**Recommendation:** Retain the uniform-price explanation; include support time in F08 planning and review the target (F09).

Evidence: [§4.1.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H1_bronpakket/4.1.2%20manuscript.md); [§4.1.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3601); [Book 4 outline · §4.1.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L78).

### §4.1.3 · Winstmaximalisatie bij monopolie

**Aligned with selected outline.** Complete student PDF starts at **p. 25**.

**Framework:** Use MO/MK to choose feasible monopoly output, obtain price from demand and calculate profit; reject a wrong-method claim.

**Book:** The target’s P=40−0.25q and TK=0.125q²+10q+200 give q=40, P=30 and profit 400. It explains why P=MK would choose the wrong output and checks the relevant feasible range.

**Analysis:** The price-reading step is explicit and marginal signs/capacity are considered. The book keeps formal monopoly welfare for §4.2.1 and does not confuse maximum revenue with maximum profit. The teacher offers a two-lesson support route if needed.

**Recommendation:** Retain; plan support honestly under F08 and complete target review (F09).

Evidence: [§4.1.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H1_bronpakket/4.1.3%20manuscript.md); [§4.1.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3655); [Book 4 outline · §4.1.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L78).

### §4.1.4 · Gemengde opgaven: monopolie

**Aligned with selected outline.** Complete student PDF starts at **p. 36**.

**Framework:** Consolidate monopoly calculation and compare it with a familiar competitive firm, without price discrimination, games or new welfare theory.

**Book:** Kleurfix is compared with a separate competitive case. Students choose the correct output and price-reading procedures and calculate profit using supplied costs; the sources explicitly describe separate markets.

**Analysis:** This matches the intended method-selection task. Treating the cases as separate avoids an unsupported claim that changing only market form leaves all other conditions invariant. Later price-discrimination and welfare techniques are not prerequisites.

**Recommendation:** Retain the separate-case framing and comparative explanation; F09 applies.

Evidence: [§4.1.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H1_bronpakket/4.1.4%20manuscript.md); [§4.1.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3709); [Book 4 outline · §4.1.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L124).

### §4.2.1 · Welvaartseffecten van monopolie

**Aligned with selected outline.** Complete student PDF starts at **p. 45**.

**Framework:** Compare monopoly with an appropriate efficient benchmark and distinguish surplus transfer, welfare loss and profit.

**Book:** The VR case holds demand and costs comparable, calculates monopoly Q=40/P=60 and efficient Q=60/P=50, and identifies welfare loss 200. Fixed costs distinguish PS=1,200 from profit=1,000 at the monopoly outcome.

**Analysis:** The target combines the immediately preceding monopoly method with Book 2 surplus areas. The higher producer return is not equated with a gain in total welfare, and the comparison uses consistent conditions.

**Recommendation:** Retain the benchmark and PS-versus-profit distinction; review the actual target (F09).

Evidence: [§4.2.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.1%20manuscript.md); [§4.2.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3763); [Book 4 outline · §4.2.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L65).

### §4.2.2 · Prijsdiscriminatie

**Aligned with selected outline.** Complete student PDF starts at **p. 53**.

**Framework:** Analyse a bounded two-group pricing case with market separation, common marginal costs and a qualified distributional/welfare conclusion.

**Book:** FilmLab supplies two demand functions, common MK=8 and shared fixed cost 80. Students compare a supplied uniform-price outcome with separate group choices, include fixed cost once and consider resale restrictions.

**Analysis:** The numbers illustrate that profit can rise while total surplus falls: TS 496→480 in the stated comparison. The book does not claim that discrimination always raises or always lowers welfare. The cost assumptions prevent the independent group optimisations from ignoring a joint rising-cost constraint.

**Recommendation:** Retain the bounded common-cost model; prioritise timing/target review because two optimisations and welfare interpretation share the lesson (F08/F09).

Evidence: [§4.2.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.2%20manuscript.md); [§4.2.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3817); [Book 4 outline · §4.2.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L160).

### §4.2.3 · Marktvormen vergelijken

**Aligned with selected outline.** Complete student PDF starts at **p. 61**.

**Framework:** Classify four market forms from evidence and transfer an already taught profit procedure to one supplied firm representation.

**Book:** Short sources distinguish perfect competition, monopolistic competition, oligopoly and monopoly. The Puur case applies a familiar declining-demand/constant-MK procedure under a specified short-run model.

**Analysis:** The paragraph goes beyond a vocabulary checklist without turning the four labels into four new quantitative models. It distinguishes a brand from a firm and does not assume one universal oligopoly demand curve or introduce payoff matrices.

**Recommendation:** Retain the evidence-based classifications and limited transfer; complete target review (F09).

Evidence: [§4.2.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.3%20manuscript.md); [§4.2.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3871); [Book 4 outline · §4.2.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L48).

### §4.2.4 · Negatieve externe effecten

**Content aligned; timing conflict.** Complete student PDF starts at **p. 67**.

**Framework:** Teach unpriced harm to third parties, private versus social costs and a corrective tax, reusing the Book 3 wedge with a changed welfare boundary.

**Book:** The cleaning case compares CS+PS+government revenue−external damage. The tax reduces Q from 30 to 20 and raises the stated social surplus from 300 to 400. A separate explanation contrasts this with Book 3’s no-externality result.

**Analysis:** There is no substantive contradiction between the books: the changed external-harm assumption explains the changed welfare conclusion. The teacher’s core budget is 64 minutes and explicitly calls for two lessons, conflicting with a universal 55-minute interpretation.

**Recommendation:** F08: record the extra period or redesign and trial; retain the full social ledger and explicit assumptions. F09 applies.

Evidence: [§4.2.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.4%20manuscript.md); [§4.2.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3925); [Book 4 outline · §4.2.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L66).

### §4.2.5 · Positieve externe effecten

**Content aligned; timing conflict.** Complete student PDF starts at **p. 78**.

**Framework:** Teach benefits to third parties and analyse a subsidy with explicit eligibility, expenditure and external benefits.

**Book:** The target gives Q=40→50, Pc=35, Pp=45, subsidy expenditure 500 and external benefits 500 at the new quantity; the full comparison improves welfare by 50. Practice also includes unequal subsidy and benefit amounts.

**Analysis:** The book distinguishes external benefit from the buyer’s own benefit and teaches why the conclusion can differ from §3.1.3. The unequal-amount practice prevents a misleading cancellation rule. The teacher guide again budgets 64 minutes and two lessons.

**Recommendation:** F08: reconcile timing without dropping government spending or external-benefit accounting; complete target review (F09).

Evidence: [§4.2.5 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.5%20manuscript.md); [§4.2.5 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3979); [Book 4 outline · §4.2.5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L67).

### §4.2.6 · Overheidsingrijpen bij marktfalen

**Aligned with selected outline.** Complete student PDF starts at **p. 89**.

**Framework:** Match an instrument to diagnosed market failure, compare two feasible policies using one familiar calculation and a stated criterion, and acknowledge limitations.

**Book:** The neighbourhood-noise target compares a tax with a quantity limit. Both generate social surplus 450 before implementation costs; deducting 20 versus 40 produces 430 versus 410. Producer preferences are assessed separately from the council’s efficiency criterion.

**Analysis:** The task reuses familiar instruments, states compliance/allocation assumptions and distinguishes a fiscal transfer from resources consumed in implementation. It does not introduce a new general policy model or turn a distributional preference into an arithmetic error.

**Recommendation:** Retain the explicit criterion and cost/transfer distinction; review target and rubric (F09).

Evidence: [§4.2.6 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.6%20manuscript.md); [§4.2.6 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4033); [Book 4 outline · §4.2.6](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L216).

### §4.2.7 · Gemengde opgaven: marktvormen en marktfalen

**Aligned with selected outline.** Complete student PDF starts at **p. 95**.

**Framework:** Integrate a market-power case and an externality/policy case using familiar calculations, diagrams and bounded conclusions, without new theory.

**Book:** Studio Solo requires monopoly output/profit and welfare comparison; the separate cleaning case requires a tax wedge and the social ledger. The target asks why reducing quantity can worsen welfare in one case and improve it in the other.

**Analysis:** The economic contrast is the intended integration, not an inconsistency. The sources separate markets and periods, and the teacher selects a core route instead of assigning every printed consolidation exercise within one lesson.

**Recommendation:** Retain the causal comparison and selected workload; complete actual-target review (F09).

Evidence: [§4.2.7 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H2_bronpakket/4.2.7%20manuscript.md); [§4.2.7 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4087); [Book 4 outline · §4.2.7](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L230).

### §4.3.1 · Arbeidsvraag en arbeidsproductiviteit

**Aligned with selected outline.** Complete student PDF starts at **p. 104**.

**Framework:** Introduce labour demand and productivity/unit-labour-cost calculations, keeping persons, hours and fte distinct and separating output changes from productivity effects.

**Book:** FrameWerk calculates old productivity 4 frames/hour, new required input 600 hours and labour costs €6→€4.80 per frame. It rejects ‘higher productivity always means fewer hours’ and separately analyses wage and export-order changes.

**Analysis:** This is the first formal home of these calculations, as the outline requires. The household/employer role reversal and wage/quantity units are taught explicitly. Earlier trade reasoning supplies a context but is not assumed to have taught these formulas.

**Recommendation:** Retain the units and separately stated scenarios; review the actual target (F09).

Evidence: [§4.3.1 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.1%20manuscript.md); [§4.3.1 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3392); [Book 4 outline · §4.3.1](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L52).

### §4.3.2 · Arbeidsaanbod, participatie en evenwicht

**Aligned; timing evidence still provisional.** Complete student PDF starts at **p. 114**.

**Framework:** Calculate participation with the stated denominator and independently find a simple labour equilibrium after an explicit actor/variable bridge.

**Book:** Waterstad yields labour force 3,500, gross participation 70% and net participation 60%. A separate delivery-sector model gives wage €14 and employment 100 persons, with the equilibrium marked on a supplied graph.

**Analysis:** The absorbed equilibrium operation is present and independent; it has not vanished with the removed standalone paragraph. The book separates a regional count from a supply curve. The teacher estimates 52 minutes, so timing is planned but not measured.

**Recommendation:** Retain the distributed equilibrium design; trial the combined terminology/participation/algebra load before treating capacity savings as proven (F08/F09).

Evidence: [§4.3.2 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.2%20manuscript.md); [§4.3.2 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L3403); [Book 4 outline · §4.3.2](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L52).

### §4.3.3 · Werkloosheid en veranderingen op de arbeidsmarkt

**Aligned with selected outline.** Complete student PDF starts at **p. 122**.

**Framework:** Calculate unemployment using the labour force, distinguish causes and interpret a labour-demand shift under stated wage-adjustment assumptions.

**Book:** The Rivierenregio target gives observed unemployment 10%, then a separate flexible-wage equilibrium €13/66 persons and excess supply 36 at a fixed €16 wage. Vacancies are not subtracted from measured unemployment.

**Analysis:** The book explicitly distinguishes observed matching problems from a clearing model and introduces the causes rather than assuming them from trade. It reuses Book 1’s new-equilibrium method and contrasts a shift with movement along the unchanged supply curve.

**Recommendation:** Retain these distinctions; protect the full core route in timing review and complete target review (F09).

Evidence: [§4.3.3 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.3%20manuscript.md); [§4.3.3 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4260); [Book 4 outline · §4.3.3](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L54).

### §4.3.4 · Minimumloon

**Aligned with selected outline.** Complete student PDF starts at **p. 131**.

**Framework:** Transfer the price-floor procedure to a minimum wage, calculate paid employment and the wage bill, and distinguish affected worker groups.

**Book:** The sorting-centre case starts at €12/100 persons. A €14 floor gives 80 employed and 120 suppliers; with 25 hours each, the weekly wage bill falls from €30,000 to €28,000. The task challenges ‘all 40 lost their jobs’.

**Analysis:** The binding test, paid-work quantity and time units are explicit. It uses fictional rates, competitive assumptions and no matching problems; the model is not presented as a universal empirical prediction. Government purchase of unused labour is not assumed.

**Recommendation:** Retain the group and model limitations; review actual target and marking criteria (F09).

Evidence: [§4.3.4 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.4%20manuscript.md); [§4.3.4 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4325); [Book 4 outline · §4.3.4](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L55).

### §4.3.5 · Vakbonden, cao en arbeidsmarktbeleid

**Aligned with selected outline.** Complete student PDF starts at **p. 139**.

**Framework:** Explain unions/collective agreements and evaluate a bounded wage/training proposal using familiar productivity, ratio and percentage calculations.

**Book:** The wood-processing agreement compares €30/5=€6 with €31.50/5.5≈€5.727 labour cost per part, then adds €0.20 training cost. Students identify negotiating parties, apply a cost criterion and reject guaranteed job growth.

**Analysis:** The ratio is taught rather than approximated by subtracting growth rates. Institutional terms are defined and the proposal is fictional. The book does not add bargaining-game theory or infer employment solely from productivity or a contract label.

**Recommendation:** Retain the full-cost criterion and conditional employment conclusion; F09 applies.

Evidence: [§4.3.5 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.5%20manuscript.md); [§4.3.5 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4390); [Book 4 outline · §4.3.5](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L70).

### §4.3.6 · Gemengde opgaven: arbeidsmarkt

**Aligned; retention demonstrated in task design.** Complete student PDF starts at **p. 146**.

**Framework:** Consolidate labour vocabulary, participation/unemployment, productivity, policy and independent equilibrium/shift calculations without a seventh catch-up lesson.

**Book:** Havenregio separates population data, a sector model and a training proposal. The target independently calculates original €14/100 and new €16/120 equilibria, distinguishes denominators, computes unit labour costs and qualifies a jobs claim.

**Analysis:** The printed target provides the explicit equilibrium retention evidence requested by the outline; it is not only an optional review question. The supplied graph still requires calculated points and interpretation. The teacher estimates a complete 55-minute selected route, with bonus outside it.

**Recommendation:** Retain this target structure; verify feasibility in a classroom trial and obtain formal target review (F08/F09).

Evidence: [§4.3.6 manuscript](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/source_chapters/Boek_4_H3_bronpakket/4.3.6%20manuscript.md); [§4.3.6 target record](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/course-target-exercises.json#L4444); [Book 4 outline · §4.3.6](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/authored/book-outlines/book-4-outline.md#L56).

## Conclusion and recommended change programme

The intended progression is worth preserving. There is no evidence in this review for a wholesale rewrite, another chapter swap, restoration of the old trade algorithm, or a seventh labour theory paragraph. The books generally teach the mathematical and economic bridges that their current outlines require. The strongest alignment weaknesses are local assessment/data issues and a planning system that does not yet consistently describe the delivered material’s maturity, variants and duration.

The preferred changes are therefore targeted and sequenced:

| Order | Change | Deliverable / acceptance criterion |
|---|---|---|
| 1 | Correct the Book 1 dataset and percentage claim (F01–F02) | A teacher errata note and coordinated proposed next-edition/target correction. A learner using the printed table, function or key must obtain the same result. |
| 2 | Reconcile the teaching timetable (F08) | A chapter-level schedule separating 55 curriculum units from actual core periods and support. All required instruction, independent target work and feedback must fit an explicit route; no target operations removed merely to meet a number. |
| 3 | Complete Book 3–4 target review (F09) | Exact printed target/answer versions mapped to all 31 proposed briefs, with reviewed operations, prerequisites, rubric and timing evidence. Structural import status remains separate. |
| 4 | Close Book 1 mixed-assessment gaps and optional/core ambiguity (F03–F04) | A required question-to-target mapping that includes graph construction/interpolation and both numerical shift types, with the intended status of each Denkertje explicit. |
| 5 | Add the normal-good terminology bridge and verify the SmoothBox variant (F05–F06) | A consistent broad-versus-calculation convention and a reviewed subquestion/assumption mapping for the changed scenario. |
| 6 | Clarify current framework status and production budgets (F07/F11) | Current status/count/page information visibly distinguished from preserved historical prose; hold changes supported by evidence rather than inferred from imported files. |
| 7 | Apply the small Book 1 editorial repairs (F10) | Correct cross-reference and one complete bicycle-bell worked example in the next edition. |

Book 1 is already frozen as an edition. Preserve the supplied books and source history, record proposed changes in the existing next-edition/errata process, and update assessment authority only through its owning route. For Books 2–4, prioritise framework reconciliation and target validation before commissioning broad content changes. A classroom trial should record actual instruction, independent-work and feedback time, whether the target was completed without supplied steps, and which prerequisites needed support.

This review therefore supports **retaining the curriculum sequence with targeted corrections and explicit planning/approval work**. It does not support an unqualified “everything matches” conclusion, nor does it show a need to replace the four books.

## Appendix: printed sources and excluded legacy units

The following complete PDFs define the audited student editions. Their page counts include front matter, summaries and other non-count-bearing material.

- [Book 1 complete student PDF](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/Boek%201%20Grondslagen%2C%20vraag%20en%20aanbod%20%E2%80%93%20boek.pdf) — 136 physical pages.

- [Book 2 complete student PDF](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/boek/Boek_2_Compleet.pdf) — 110 physical pages.

- [Book 3 complete student PDF](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%203%20-%20Overheidsingrijpen%2C%20concurrentie%20en%20internationale%20handel/edities/chat-2026/pakket/Boek_3_Compleet.pdf) — 136 physical pages.

- [Book 4 complete student PDF](https://github.com/meijer1973/4veco-lessen/blob/a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07/Boek%204%20-%20Monopolie%2C%20marktfalen%20en%20arbeidsmarkt/edities/chat-2026/pakket/output/Boek_4_Compleet.pdf) — 162 physical pages.


The following **nine historical Book 1 repository units** are not chapters/paragraphs in the current complete Book 1 PDF. They are excluded from the 55-unit comparison, rather than treated as additional active curriculum obligations. This distinction matters because their old marginal-analysis and test-preparation headings would otherwise create false conflicts.

| Historical repository ID | Folder title | Audit treatment |
|---|---|---|

| 1.4.1 | Marktevenwicht | Outside current printed edition; historical/reference material |

| 1.4.2 | Verschuivingen | Outside current printed edition; historical/reference material |

| 1.4.3 | MK en MO | Outside current printed edition; historical/reference material |

| 1.4.4 | Winstmaximalisatie | Outside current printed edition; historical/reference material |

| 1.4.5 | Gemengde opgaven | Outside current printed edition; historical/reference material |

| 1.5.1 | Actieve samenvatting | Outside current printed edition; historical/reference material |

| 1.5.2 | Examenvaardigheden | Outside current printed edition; historical/reference material |

| 1.5.3 | Integratieoefening | Outside current printed edition; historical/reference material |

| 1.5.4 | Proeftoets | Outside current printed edition; historical/reference material |


The active PDF’s contents and current blueprint, rather than the mere presence of these directories, determine the printed scope. The Book 1 next-edition boundary is documented in [pedagogical boundaries](https://github.com/meijer1973/4veco-platform/blob/67374a9808d226f1be7e8fa73eb104312c075267/references/owned/course-blueprint-pedagogical-boundaries.md) and the [existing Book 1 backlog](https://github.com/meijer1973/4veco-platform/issues/221). No legacy files were removed or reclassified by this audit.

## Reproducibility and limits

The accompanying `paragraph-analysis.json` and `paragraph-analysis.csv` contain the 55 individual entries, source paths, PDF starting pages and registry status. `source-manifest.json` records the audited commits and SHA-256 hashes for referenced local sources. `evidence/` contains the extracted PDF text, the initial inventory (including the nine legacy units), and selected page renders. These are audit working files, not a replacement edition or approval record.

Validation performed for this report: 55 unique entries exactly matching the current registry; per-book counts 12/12/14/17; all cited repository paths and requested line anchors exist; the Book 2 structural-currentness check passes. Selected arithmetic was checked directly, including the contradictory Ben row, the second 50% pair, the tax/externality comparisons and the retained labour-equilibrium examples. No whole-corpus claim that every calculation, answer, asset or real-world source has been independently verified is made.

The nine visually inspected pages were student Book 1 pp.29, 79 and 82; Book 2 p.55; Book 3 pp.8–9; Book 4 p.148; teacher Book 3 p.16 and teacher Book 4 p.12. PDF text extraction also confirmed the cross-reference, repeated worked case, relevant mixed tasks and terminology. The review did not measure learning outcomes or classroom duration and did not revalidate external examination/legal references. Fictional classroom cases were assessed on their supplied assumptions.

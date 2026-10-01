# Independent Book 3 foundation audit

Date: 2026-10-01. Reviewer: independent review subagent. Scope: existing textbook foundation before review of any new Book 3 classroom deck. No author was contacted, no new deck or author verdict was inspected, and no repository content was changed. This is not target approval, timing approval, learning-outcome measurement or merge authority.

## Assessment

**No blocking missing instruction or material contradiction was found in the 14 paragraph routes and their targets.** The current v3 manuscript provides the important bridges: tax/subsidy accounting, actual versus desired transactions, market versus firm, interval versus point marginal cost, marginal choice versus total profit, and domestic consumption versus production under trade. All 14 targets can be traced to explanation and practice that precede them. The chief conversion risk is omitting these bridges or treating after-theory Startopgaven as unaided prior retrieval.

**P3 source finding — the glossary defines W too narrowly.** `book-matter/back.md:112–113`, complete-book printed p.127, defines welvaartsverlies only as missed transactions caused by a tax wedge. Yet §3.1.3, manuscript lines 39–66 and 92–94, printed pp.24–26, correctly teaches loss from *additional* subsidized transactions whose marginal costs exceed willingness to pay. The glossary entry is not a sufficient general definition for chapter 3.1. Minimal future source repair: label it as the tax case, or generalize to loss relative to the applicable model benchmark and include under- and overproduction. This is a glossary scope defect, not a defective subsidy calculation or absent prerequisite. No repair was made. Do not silently alter the correct subsidy teaching through a deck.

The risks below are acceptance checks for later conversion, not findings against any as-yet-unreviewed presentation.

## Source identity, coverage and pages

- Actual platform HEAD: `34464fb6091f721f7a87e8d1bb3165f758770799`.
- Actual lessons HEAD: `9b8304d5031cafac936a56281e144573a25fbbc9`.
- Source root: `C:/wt/ppt/4veco-lessen/edities/books34-v3/books/book-3/`.
- Read all 14 actual manuscripts, all three complete chapter answer keys and teacher guides, three introductions, three summaries and complete-book front/back matter. This is not an outline-only audit.
- **M311** below means `chapters/3.1/3.1.1 manuscript.md`, analogously for each paragraph. **A31/G31** mean `chapters/3.1/Antwoorden.md` / `Docenteninformatie.md`, analogously A32/G32 and A33/G33. Line anchors are one-based in these actual files, relative to the source root above.
- **B** means printed page of `output/Boek_3_Compleet_v3.pdf`; **L** means chapter-local page used by the chapter guide. Actual PDF footer checks establish H3.1: B=L+4; H3.2: B=L+52; H3.3: B=L+86. Physical PDF index and printed page coincide in this complete Book 3, unlike Book 2. Old `origin_page` fields are not current printed-page authority.
- Student PDF: 132 pages; SHA-256 `4ad8548531dccde67507b3c1d94f8c2e7a050156423cab2f41174bd4d1ba8d39`.
- Answers PDF: 74 pages; SHA-256 `99bb148be789986f193b4aa534be62c0c7a91cd15e476660ab8106c0627a5a25`.
- Guidance PDF: 22 pages; SHA-256 `7b13b7ed57a68c1eb6974c601d74b64ac2743d07c3d38b9ae2519a64ebdca37e`.

Visual scope: individually inspected 16 Poppler renders at 110 dpi, printed pages **17, 41, 55, 60, 62, 67, 70, 71, 77, 82, 95, 100, 105, 110, 115, 120**. These include graph-only target inputs, the derivative bridge, profit-area transition, controlled incidence comparison and prohibitive tariff. No substantive graph/text contradiction found. Renders: `C:/wt/ppt/.book3/source-figures/book3-page-N.png`. This is not whole-book typography/print QA. Other theory, exercises, answers and guidance were read in the editable text; cited route/support/target page numbers were verified from actual complete-PDF footers.

## Earlier teaching actually available

Book 2 predecessor source is `C:/wt/ppt/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/bronnen/H*/manuscript/`. The relevant teaching passages were read directly. A title, or an exercise merely asking for an operation, was not treated as evidence of instruction.

| Teaching anchor | Available operation | Limit relevant to Book 3 |
|---|---|---|
| Book1 §1.1.1 actual `1.1.1 Schaarste en economisch denken – paragraaf.md`, “Alternatieve kosten” and worked example; complete Book1 PDF p.7 | Best forgone alternative; scarce means cannot serve both uses simultaneously. | Cross-country comparative advantage is new in331. A numerical specialization-table algorithm is not assumed. |
| Book1 §1.3.2 actual manuscript, “Het evenwicht berekenen” and “Overschot en tekort”; complete PDF pp.102 onward | Qv=Qa, solve, substitute/check both sides; desired quantities at a given non-equilibrium price. | Tax wedges, statutory bounds, allocation and government purchases need new assumptions. |
| Book1 §1.3.3 actual explanation of separate and simultaneous shifts, including reset to original supply; complete PDF pp.117–118 includes simultaneous changes | Recalculate equilibrium; movement along versus shift; isolate changes before combining. | A+t in buyers' prices is not a rise in physical marginal cost. Trade opening does not shift domestic curves. |
| Book2 §2.1.1 pp.2–5, manuscript lines14–24,74–170,216–293,298–337 | TCK/TVK/TK within period and capacity; GTK=TK/Q for Q>0; totals versus unit amounts. | Constant total cost is not constant GTK; higher TCK need not change MK. |
| Book2 §2.1.2 pp.10–13, lines21–51,120–204 and worked example/summary through398 | TO=P×Q, GO=P, profit=TO−TK, break-even, vertical profit gap on total-euro axes. | Break-even is not optimum. Whole-waffle rounding is not a universal rule for divisible kg. |
| Book2 §2.1.3 pp.19–22, lines32–64,155–241,385–489,615–845 | ΔTK/ΔQ and ΔTO/ΔQ over the actual interval, varying step widths, q² substitution, fixed costs cancelling in differences, constant-price MO. | Summary explicitly excludes derivatives and a profit maximum.322 must introduce point MK;323 must introduce optimization. |
| Book2 §2.2.1 pp.36–39, lines21–32,59–88,119–187 | Old-base percentages, signed unitless Ev, response strength, ceteris paribus, explanation versus proven cause. | Tax incidence is new; one line's visible steepness alone does not prove it. |
| Book2 §2.2.2 pp.44–47, lines23–41,97–198,288–444 | Complete old/new P×Q situations; old-base change; unit-price axes give an area; finite-change recalculation. | More turnover is not necessarily more profit; local elasticity shorthand is not an exact finite-change identity. |
| Book2 §2.3.1 pp.72–75, lines92–169,209–258,285–305 | Discrete CS versus continuous area; highest-WTP allocation; intercepts and triangle units. | Do not interchange discrete sums and continuous triangles without the model change; given-price quantity is not automatically equilibrium. |
| Book2 §2.3.2 pp.80–84, lines26–40,62–75,122–197,246–398 | PS over actual sales; stated A=MK assumption; CS+PS; WTP compared with MK; efficiency versus fairness. | PS is not profit. Continuous market A=MK does not teach deriving one firm's MK from TK. |
| Book2 §2.3.3 pp.90–95, lines45–108,132–148,194–265,303–350,379–449 | Desired/actual quantities, binding restriction and allocation, truncated areas, lost gains, feasibility, Pareto versus aggregate gain/fairness. | Adding government changes the ledger; permitting foreign supply changes the closed-market shortage model. |

These are real antecedents, not proof of mastery by a particular class. Retrieval may be fragile; a missing classroom demonstration of a new Book3 operation would be a conversion omission rather than an absent textbook foundation.

## Foundation matrix: chapter 3.1

| Paragraph / actual assignment anchors | Teaching and progression | Target coverage and risk |
|---|---|---|
| **311 Belastingen** B6–13/L2–9. Start1–2 B9; guided3–4 B10; independent5–6 B11; target7 B12; extras8–9 B13. M311:7–97,111–135; A31:35–67. | B6 defines Pc/Pp/t and the money flow. B7 relates V/original A/A+t at the same Q. B8 derives the changed price coordinate term by term, explicitly retaining production costs. B9 works free/new equilibrium and checks the wedge/burden. Guided3 reads the worked graph;4 constructs another before5 withdraws support. | All7a–e operations supported: equilibrium, supply in Pc, new Q/Pc/Pp, shifted line/wedge, remittance versus burden. New two-price interpretation is taught; old equation-solving is retrieved. Risks: Pc=P0+t, reading Pp on A+t, treating Pp as profit, or dropping original A. Start2 is not unaided prior retrieval. |
| **312 Belastingdruk en welvaartsverlies** B14–22/L10–18. Start10–11 B18; guided12–13 B19; independent14–15 B20; target16 B21; extras17–18 B22. M312:13–104,121–151; A31:71–97. | B14 introduces burden shares with denominator t and O=tQt, adding government receipts to CS+PS. B15–16 distinguishes budget rectangle/lost-trade triangle and per-sold-unit burden/total surplus decline. B17 controls initial P/Q, supply and tax when varying demand sensitivity. B18 works ledger and triangle;12–15 practise both accounting and interpretation. | All16a–e supported: per-side shares, receipts, old/new CS/PS, CS+PS+O, W, shaded areas and conditional sensitivity claim. Government accounting and controlled comparison are essential teaching. Risks: all private-surplus decline=loss, O=W, or visual steepness=incidence. Start11's arithmetic is prior, tax-ledger interpretation needs support. |
| **313 Subsidies** B23–31/L19–27. Start19–20 B26; guided21–22 B27 plus22A B28; independent23–24 B29; target25 B30; extras26–27 B31. M313:13–94,111–153; A31:101–135. | B23 reverses the wedge and defines Pp including subsidy. B24 derives A−s in Pc and subsidy on all sales. B25 uses three accounts and extra trades with WTP<MK. B26 works CS+PS−U.22A isolates the ledger using supplied Q/prices and a worked old-state row. | All25a–e supported: Q/prices, U, each side's gain, CS/PS net of U, W, graph and qualified conclusion. Risks: wrong sign, paying only for extra sales, omitting state outlay, importing outside benefits from later Book4. Retain actual guided22A. Both start items contain new subsidy content. |
| **314 Maximumprijs** B32–38/L28–34. Start28–29 B34; guided30–31 B35; independent32–33 B36; target34 B37; extras35–36 B38. M314:13–77,94–137; A31:139–169. | B32 distinguishes Qv/Qa/sales and says no price wedge. B33 checks binding before substitution, short side/no extra supply and allocation. B34 demonstrates binding and non-binding cases;31 practises both. | All34a–e supported: equilibrium/binding, desired/actual amounts/shortage, graph, highest-WTP access and non-binding alternative. No new full welfare account required. Risks: maximum as compulsory price, more buyers than actual supply, or benefit for every willing buyer. Start29 uses the new binding rule. |
| **315 Minimumprijs en quota** B39–47/L35–43. Start37–38 B42; guided39–40 B43 plus40A B44; independent41–42 B45; target43 B46; extras44–45 B47. M315:13–90,107–155; A31:173–211. | B39–40 distinguishes intended supply, private sales and an added government purchase promise. B41 teaches replacement quota, price from V rather than A, and non-binding contrast. B42 calculates both arrangements.40A scaffolds quota alone before combined independent work. | All43a–e supported: equilibrium/binding, private demand/supply/oversupply/deliveries, government purchase/U/area, quota reset, price/output/U and two differences. Risks: automatic public purchaser, intended supply=production, retaining floor/purchase scheme under quota, or government spending=W.44 explicitly withholds use/value/storage information. Start38 uses new floor logic. |
| **316 Gemengde opgaven** B48–51/L44–47. Preparation46–47 B48; explicitly extra47A B49; target48 sources B50/questions B51. M316:7–31,37–74; A31:215–235. | No new method.46 identifies instruments;47 tests an added purchase promise;47A corrects three budget/sales mistakes. All operations have311–315 antecedents. | All48a–f supported: separate tax/ceiling plans, equilibrium, tax prices/burdens/ledger/W/graph, ceiling quantities/shortage and both claims. No full welfare ranking of planB requested. Preserve three sources/six questions and reset plans. First printed exercise46, not1;47A has an explicit extra label. |

## Foundation matrix: chapter 3.2

| Paragraph / actual assignment anchors | Teaching and progression | Target coverage and risk |
|---|---|---|
| **321 Kenmerken** B54–61/L2–9. Start1–2/guided3 B57; guided4 B58; independent5–6 B59; target7 B60; extras8–10 B61. M321:9–49,54–88; A32:6–22. | B54 explains four assumptions. B55 transfers only P from market Q (×1000 kg/day) to one firm's q (kg/day), within capacity/small scale. B56 works TO/GO/interval MO and own-price alternatives at unchanged sales.3–4 repeat the graph transfer before5. | All7a–e supported: graph readout/assumption, horizontal firm line, TO/GO/MO, higher-price rejection and Q/q distinction. Book2 provides arithmetic; this lesson supplies the market-to-firm model. Risks: horizontal market demand, q=Q, infinite firm sales, treating named free entry as a taught long-run mechanism. Start2 uses new theory/figure. |
| **322 Marginale kosten en de afgeleide** B62–68/L10–16. Start11–12/guided13 B65; guided14/independent15–16 B66; target17 B67; extras18–19 B68. M322:6–69,74–94; A32:26–38. | B62 bridges finite interval→continuous divisible kg→point derivative and contrasts exact cost of a whole extra kg. B63 differentiates aq²+bq+c term by term. B64 works derivation, evaluation, interval comparison and fixed-cost shift.13–14 isolate terms and combined changes before15–16. | All17a–e supported: derive/evaluate/interpret MK, two TK values/interval mean, differing meanings and fixed-cost change. No outside differentiation course needed for this restricted scope. Risks: interval MK as final-point derivative, MK as exact next-kg cost, or constants disappearing from TK. Production optimization is not yet the target. |
| **323 Winstmaximalisatie** B69–78/L17–26. Start20–21/guided22 B73; guided23–24 B74; independent25 B75/26 B76; target27 B77; extras28–30 B78. M323:9–69,74–120; A32:42–70. | B69 links marginal changes to profit. B70 checks both sides of MO/MK, capacity and q=0: equality is a candidate. B71 derives profit area with GTK at chosen q and contrasts Book2 total-euro axes. B72 works full route/capacity variant.24 isolates price/fixed-cost changes;26 independently checks an infeasible crossing. | All27a–f supported: MK, feasible optimum/both sides, totals/profit, GTK/area, q0 and capacity120 reset. New teaching is the economic choice, not merely equation-solving. Risks: optimum at minimum GTK, MO=MK as profit, early rounding, dropping TCK, or insisting every maximum requires an interior crossing. Start21 is new optimization reasoning. |
| **324 Gemengde opgaven** B79–84/L27–32. Preparation31 B79/32 B80/33–34 B81; target35 sources B82/questions B83; bonus36/repetition37 B84. M324:6–54; A32:74–93. | No new algorithm.31 connects market/firm;32 full choice and rectangle;33 capacity with missing total-cost data;34 two prices with unchanged MK. | All35a–e supported: two equilibria, initial cost coverage, new individual choice, profit/GTK/graph and Q-versus-q percentage change. Initial zero profit is arithmetic, not entry equilibrium. Risks: market ×1000 versus individual units; failure to retain fixed firm count/technique over two short-run moments; adding Book4 entry/normal-profit questions. First exercise31. |

## Foundation matrix: chapter 3.3

| Paragraph / actual assignment anchors | Teaching and progression | Target coverage and risk |
|---|---|---|
| **331 Waarom landen handelen** B88–96/L2–10. Start1–2/guided3 B92; guided4 B93; independent5–6 B94; target7 B95; extras8–10 B96. M331:8–53,58–91; A33:7–19. | B88 defines direction and recalls scarce means. B89 explicitly supplies relative forgone-production comparison even with two absolute advantages. B90 separates specialization, competitiveness, attractive terms of trade and group effects. B91 works Sol/Terra;3 locates relevant source facts;4 separates opposing competitive factors before5–6. | All7a–e supported: absolute/comparative, opportunity cost, specialization/trade directions, condition for mutual benefit, delivery quality and loser. Intentionally qualitative; no numerical specialization algorithm needed. Risks: low price or absolute productivity proving comparative advantage; country gain=every resident's gain. Start1 is retrieval;2 contains new concepts. |
| **332 Wereldmarktprijs, import, export en welvaart** B97–106/L11–20. Start11–12/guided13 B102; guided14 B103; independent15–16 B104; target17 B105; extras18–20 B106. M332:8–67,72–102; A33:24–36. | B97 states small country, competition, equivalent products, sufficient foreign supply/demand, no transport/barriers/exchange change/third-party effects. B98 import; B99 reverse export scenario with same curves; B100 CS at domestic consumption versus PS at domestic output; B101 worked import.14 graph,15 table,16 export vary representation and direction before target. | All17a–e supported: Qa/Qv/import readout, producer price/output, CS direction, rejection of universal gain and small-country condition. Full area account not requested. Risks: Qv=domestic Qa, imports treated as unresolved closed-market shortage, world price treated as horizontal domestic demand, or simultaneous import/export examples. |
| **333 Protectionisme** B107–116/L21–30. Start21–22/guided23 B112; guided24 B113; independent25–26 B114; target27 B115; extras28–30 B116. M333:17–73,78–117; A33:41–66. | B107 changes free import only. B108 conditions Pw+t on remaining imports and distinguishes domestic receipts/remittance. B109 taxes remaining import. B110 separates import/production quota, free licenses/payment and shows prohibitive-tariff boundary. B111 works full source argument.24 isolates concurrent Pw/t changes;26 independently applies the zero-import contrast. | All27a–e supported: imports/receipts/area, numerical group effects, limited claim and quota/revenue difference. Boundary is taught before independent26 even though target27 retains imports. Risks: taxing all sales as in311, shifting domestic A as if domestic producers remitted tariff, unconditional Pw+t, invented license revenue/aggregate jobs/quota-rent allocation. |
| **334 Gemengde opgaven** B117–123/L31–37. Preparation31–32 B117/33 B118/34 B119; target35 sources B120/questions B121; bonus36 B122/repetition37–38 B123. M334:6–75; A33:71–83. | No new algorithm.31 selects concept;32 export;33 comparative advantage/losers;34 tariff/source conclusion. Target combines331/333 with332 quantities.38b returns explicitly to323 short-run choice. | All35a–f supported: opportunity cost despite absolute advantage, import/receipts, both groups using P and Q, tariff area, free-quota budget, two-data policy claim. Risks: dropping sourceC or questions, adding numerical specialization/full welfare/labor or entry model, merging the *different firms* in38a/b. First exercise31. |

## Start assignments moved before instruction

The printed theory/worked example precedes Startopgaven; the introductions and complete-book p.3 explicitly prescribe reading them. Moving starts to the opening changes this sequence. The facts below are for independent acceptance review, not a bespoke plan supplied to authors.

| Start / printed page | Retrieval | Current-lesson demand and verified support |
|---|---|---|
| 311/1–2 B9 | 1 equilibrium/substitution. | 2 tax gap and need for old price to divide burden: B6–9, especially6 and9. |
| 312/10–11 B18 | 10 surplus triangles;11 old−new subtraction. | Government receipt versus welfare loss: B14–16, worked B18. |
| 313/19–20 B26 | Tax half of19. | Subsidy sign and all-sales base in19–20: B23–25, worked B26. |
| 314/28–29 B34 | 28 equilibrium/Qv/Qa at a price. | 29 non-binding maximum: B32–34, explicit contrast B33. |
| 315/37–38 B42 | 37 equilibrium/oversupply with familiar Q(P). | 38 non-binding minimum: B39–42, definition B39. |
| 321/1–2 B57 | 1 TO/GO/interval MO. | 2 market versus horizontal firm line and assumptions: B54–56, paired graph55. |
| 322/11–12 B65 | 11 interval/units;12 arithmetic substitution. | 12 interpreting point MK versus total cost: B62–64. MK is supplied, so start12 does not demand unaided differentiation. |
| 323/20–21 B73 | 20 totals/GTK/profit/interval MK/MO. | 21 marginal evidence for an optimum: B69–70, feasibility example72. Book2 explicitly did not teach optimization. |
| 331/1–2 B92 | 1 opportunity cost, transferred to resources. | 2 trade direction and why low price does not establish comparative advantage: B88–91. |
| 332/11–12 B102 | Substitution and subtraction. | Domestic production/consumption/import meanings and foreign-supply model: B97–99, worked101. Supported new application, not new algebra. |
| 333/21–22 B112 | 21 earlier product-tax base; import from332. | 22 import-only tax base/rectangle width: B108–109, worked111. |

The current classroom recipe already requires supported exploration and a return after instruction for new-content starts. That is appropriate here; a blanket “exercise2 is always retrieval” or “every start is new” would both be inaccurate.

The three mixed paragraphs start with **46 (316),31 (324),31 (334)**. The literal mixed-rule “start with exercise1” in `C:/wt/ppt/4veco-platform/docs/workflows/classroom-presentation.md` does not match this chapter-wide numbering. The source-grounded interpretation must use the real first exercise, without inventing or importing exercise1. This is a generic-workflow portability risk, separate from book-content correctness. The disposition belongs to the coordinator; no change or coaching occurred in this audit. Source47A is explicitly extra, not an unnoticed mandatory replacement for46–47.

## Independent target arithmetic and boundary checks

These were recomputed from actual data and compared with the keys; all match. Numerical shorthand here inherits the source's units/periods and does not replace full student reasoning.

| Target and source/key anchors | Recomputed contract |
|---|---|
| 311/7 M311:129; A31:57 | Free Q60/P8. Tax3: supply in Pc=5+.10Q; Qt50/Pc10/Pp7; burdens2/1 per bag. |
| 312/16 M312:149; A31:89 | Buyer share66.67%; O150/day. Old CS/PS360/180; new250/125; new ledger525; W15=½×10×3. Private-surplus decline165 is not W. |
| 313/25 M313:151; A31:127 | A−s=5+.10Q; Q70/Pc12/Pp15; gains2/1; U210/week; CS490/PS245; net525 versus540; W15. |
| 314/34 M314:114; A31:161 | Free60/12. Max10 binds: Qv80/Qa40/actual40/shortage40 per weekend. Max14: actual12/60. Allocation selects40 of80 willing renters. |
| 315/43 M315:140; A31:201 | Free60/14. Min16: Qv40/Qa80/oversupply40; total sales80 only with guarantee; public40/U640/week. Replacement quota40: price16/output40/U0. |
| 316/48 M316:42–63; A31:225,231 | Free60/12. A: Qt50/Pc14/Pp11, burdens2/1, CS250/PS125/O150/W15 per day. Separate B max10: Qv70/Qa40/actual40/shortage30. No complete welfare ranking of B. |
| 321/7 M321:77–78; A32:18 | Actual graph Q4×1000 kg/day/P3. Firm120: TO360/day/GO3; firm140: TO420, MO60/20=3 per kg. Capacity160≠market4000. |
| 322/17 M322:87; A32:34 | MK=.08q+4; MK100=12/kg. TK100=1200/week, TK150=1900/week; interval700/50=14/kg. Fixed+100: TK100=1300, same MK. |
| 323/27 M323:110; A32:62,66 | MK=.08q+4; q150≤200 at P16. MK125=14/MK175=18. TO2400/TK1900/profit500; GTK12.666…; area150×3.333…=500/week. q0 profit−400. New cap120: q120, MK13.60<16. |
| 324/35 M324:35–43; A32:89,93 | Initial P8/Q10000; q100, TO=TK800. New P12/Q20000; q200≤250, MK=.04q+4, TO2400/TK1800/profit600/GTK9. Q and q both rise100%, distinct levels/objects. Supply is internally compatible with100 such firms in the used range; no aggregation contradiction. |
| 331/7 M331:84; A33:15 | Aster absolute advantage in both; Brin lower forgone pumps per jacket, hence comparative advantage in jackets/Aster in pumps. Attractive exchange terms needed; Aster jacket makers are a possible loser. No invented ratios. |
| 332/17 M332:95; A33:32 | Actual graph no-trade P40/Q80; Pw30 gives Qa60/Qv100/import40 weekly. Producer price/output fall, CS rises; not every resident gains. |
| 333/27 M333:105–110; A33:62 | Import100−60=40 weekly; receipt10×40=400; rectangle Q60–100/P20–30. Domestic output40→60, consumption120→100. Free quota licenses do not create tariff receipts. |
| 334/35 M334:33–44; A33:79 | Import100−60=40 weekly; receipt5×40=200; rectangle Q60–100/P10–15. Qualitative comparative/group conclusions follow from supplied sources. |

Additional material contrasts recomputed:312 B17, identical P0=8/Q0=60/t3, marketA45/9.50/6.50 versusB50/10/7;313/22A CS=PS490/U280/net700 versus720/W20;315/40A quota40 gives price18/MK12, quota80 is non-binding60/14;322 B62 interval40→60 is7/kg, point60 is8/kg, exact next kg8.05;323/26 crossing80 infeasible, cap60 with MK14<MO18 and profit560 versus−40;323/28 same q30, profits50 and−70, latter better than−160 at zero;333/24 four prices12/10/14/12;333/26 potential import price21 exceeds autarky18, so actual18/import0/receipt0;334/38 first firm profit150, different firm q60 with both-side checks40/80. These conditions are deliberate contrasts, not errors to simplify away.

## Durable review risks and limits

1. Preserve new-content support when starts move before instruction. Retrieving interval MK cannot replace the derivative bridge or marginal choice. Later artifacts need their own evidence of instruction and return to the exploratory item.
2. Keep each change of object/representation visible: Pc/Pp price coordinates; Q versus q and ×1000; interval average versus point MK; total-euro vertical profit gap versus per-unit profit area; domestic production versus consumption. These are actual teaching moves, not only terms in a list.
3. Retain each government's distinct base: taxed sales, subsidized sales, oversupply actually purchased, remaining imports. Similar textbook numbers do not make these the same rule.
4. Reset alternatives; retain boundaries. Quota replaces floor plus purchases; planA tax and planB ceiling are separate; export resets Pw; simultaneous Pw/t changes can offset. Capacity and zero-import contrasts prevent mechanical formulas.
5. Do not expand assessment into untaught topics. Numerical specialization tables, full trade-welfare accounts, quota-rent allocation, externality benefits, labor-market formulas and formal entry/exit are intentionally outside these targets. G32/G33 and M334:75 place long-run entry/exit in Book 4 §4.1.1. Their absence is not a foundation defect for the current tasks.
6. Use real exercise numbers and printed pages. H1/H2/H3 offsets differ; `origin_page` can be historical. Guided22A/40A and extra47A have meaningful status. Full target source/question-before-answer handling must be checked in decks separately; it is not pre-approved here.

The guides provisionally reserve **two 55-minute lessons per theory paragraph** and expressly deny a measured 110-minute fit. Earlier 55-minute estimates omitted guided work. They separately name known conflicts312/313/315 and retain full targets; mixed timing is separate. Fourteen curriculum paragraphs/lessons therefore does not prove completion in 14 single periods. This audit grants no timing approval.

The guides also distinguish client-selected v3 placement and technical/editorial checks from formal independent target approval. This report assesses continuity and internal source correctness; it neither fabricates approval nor proves pupil mastery.

Limits: Book3 manuscript/answers/guidance fully read; relevant Book1/2 teaching traced, without re-auditing the entire predecessor curriculum. All target computations and named contrasts recomputed. Sixteen source pages individually viewed, not every SVG or complete print layout certified. No new Book3 deck was inspected. The next evidence must be independent review of the cold artifacts against the source operations, keeping timing and approval separate.

## Editable source identities

The following appendix records SHA-256 hashes of the actual source files read, relative to the current Book3 root above.

| Source | Worktree SHA-256 |
|---|---|
| `book-matter/back.md` | `4d6612460a7078a52551aee641f129636beaca46fff54846c80ee0c5c9beaf7b` |
| `book-matter/front.md` | `dd1b1133f523fd4b8cfdfd9ca1fc13d4342e28a48a2efbd457abe2f0f4653114` |
| `chapters/3.1/00 Inleiding.md` | `6da13a58afc3fdd6105fba2cad3468f60a395cff332c6f59c40cda392f709c7a` |
| `chapters/3.1/07 Overzicht.md` | `984e61d4749c6fac36fd8ecc1e58162899c762339237109483bd675f810a36a7` |
| `chapters/3.1/3.1.1 manuscript.md` | `938160312edc425888dd54b3207c932e0aa396c59411a30e6679865eb14fded8` |
| `chapters/3.1/3.1.2 manuscript.md` | `fcf420689fff743c59776345c5e1043e960f0e0d792d279476797071c3e87757` |
| `chapters/3.1/3.1.3 manuscript.md` | `a9bfe97a56a9cf77feff4602dce945ea69af2c14bcd14cbcbcb1d2b35cbe94da` |
| `chapters/3.1/3.1.4 manuscript.md` | `77c8e3e3cbba0fae732cb904aa05be660e002bd378e1e049fd9e9155adbdef6c` |
| `chapters/3.1/3.1.5 manuscript.md` | `9f1aaab2c33c572a3d0dd4b85a5eb29bd90412a4de5bdf037c9a889c2c7bc30c` |
| `chapters/3.1/3.1.6 manuscript.md` | `0ea1f1c3e7bc206b1829f39bcc9a0da161b65d14d2f8e385834c9e8660a12bca` |
| `chapters/3.1/Antwoorden.md` | `5c22520f978587c47a041723b24d144ed3ec18da3636090b58572a141ac2b288` |
| `chapters/3.1/Docenteninformatie.md` | `46fdda1886adfc0df76f0a11b38182cf934a3040d1dd1976b961ae68a7e13aac` |
| `chapters/3.2/00 Inleiding.md` | `22db4eb96b9a1ab9c0e686914d515fec58eb5d32d4349e63df5b3dd55ba235c9` |
| `chapters/3.2/05 Overzicht.md` | `023c3822c543cc9cbb583faed45e1d0f0839ec488421091406a2aecccfc00c22` |
| `chapters/3.2/3.2.1 manuscript.md` | `c13b390b105beaf18a7d3e83cb52fb04792f3927d207efe5616b01a3ce8fc366` |
| `chapters/3.2/3.2.2 manuscript.md` | `992f1f64ee131c8c7a6c85dd517fc87724be5f825a1f9e497cd01f699645fdce` |
| `chapters/3.2/3.2.3 manuscript.md` | `d46652e4ed48a368246ed70a0f1df0206752d95775e52c6de25df0088167fbd2` |
| `chapters/3.2/3.2.4 manuscript.md` | `08387dcdc8857346ddc877b1ef537a02cee235ec85f2766afc74bf30e04d8112` |
| `chapters/3.2/Antwoorden.md` | `5be2192b7c07dd09153130ff8e691cc161e0c6d0413ea740a696fbe5189b4115` |
| `chapters/3.2/Docenteninformatie.md` | `2e4043cfb28ce503cf37477914a53c3966682fe4604bfd4b91aaed96fe506e04` |
| `chapters/3.3/00 Inleiding.md` | `fe930548853052711596d596d628791a856ef31f18d34a9bc14b1b515e15b9d6` |
| `chapters/3.3/05 Overzicht.md` | `e3ebc7cd23289f0375ec5a81427a372592aab7f9c98423b7f606dc85508004ac` |
| `chapters/3.3/3.3.1 manuscript.md` | `2f8b17f7624ecf6605d8f65a7076aacc95b39f2dabf3a1b4185d421247414a74` |
| `chapters/3.3/3.3.2 manuscript.md` | `4098130b9a226b3007e5d2642f32ce47d0aa1667e1589a151fd8380a3efe043e` |
| `chapters/3.3/3.3.3 manuscript.md` | `c2d21ba523488ab555fd9880718d4d986886a93fe938cabafd48c6865488a284` |
| `chapters/3.3/3.3.4 manuscript.md` | `35868a050f130381e4dc600fbe4bd399eca23ab6e96d83c72662df9225126faf` |
| `chapters/3.3/Antwoorden.md` | `aec2cc01f5ea47e8ba00df0eb9740701d8c355176044d0796346b6ca31e33c70` |
| `chapters/3.3/Docenteninformatie.md` | `4b2951f5db50ba422a424a262d52cbc59b3cf566213c3bd175e71910a9f38c5e` |

Compared all 28 listed editable files with the lessons HEAD blobs: 28 byte-identical, 0 differing only by CRLF/LF, 0 substantive differences. Worktree hashes above preserve the actual read-byte identity.

# Sprint BOOK2-TEXTBOOK-PRODUCTION-1: Output manifest

Date: 2026-09-05. Accountable integrator: codex-root.
Status: **ACTIVE CHECKPOINT — NOT COMPLETE**. This manifest records the exact
41-PDF output contract from the approved operational/root plan and separates
fresh internal acceptance from old file presence.

Snapshot: platform `604e4544e68528321b54a9dd0ecb27a356bce3c3`, lessons
`abe73479d900c1c3dd4cccb9c568305eb58c7a18`.
Lesson baseline: `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
All paths below are relative to the lesson book root
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/`.

## Counts and evidence rules

Expected: 27 theory + 6 consolidation + 6 chapter + 2 book = **41 PDFs**.
At this checkpoint: **9 internally accepted**, 17 legacy unaccepted and 15
absent. Physical root presence is 26, not 26 accepted. All 17 legacy PDFs are
Git-blob-identical to the baseline and have no renewed current-target approval.
Builders' separate in-progress worktrees do not count as integrated artifacts.

Each PDF also requires matching generated `.md` and self-contained `.html`;
paragraphs require their planned SVG/PNG pairs, thin builder, accepted plan,
independent review/Part A quality record and handoff. Chapters/books require
accepted source assemblies, exact asset parity, their own complete render and
independent review gates. Do not emit paragraaf.* for the three consolidations.

A = fresh internal paragraph acceptance with flags; not final owner/CI approval.
L = baseline legacy file present, not accepted. P = pending/absent.
No output is silently accepted through an older PASS or reviewed_final label.

## Exhaustive PDF inventory

| # | ID | Edition | Status | Exact relative PDF path |
|---:|---|---|:---:|---|
| 1 | 2.1.1 | paragraaf | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.pdf` |
| 2 | 2.1.1 | opgaven | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.pdf` |
| 3 | 2.1.1 | antwoorden | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf` |
| 4 | 2.1.2 | paragraaf | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf` |
| 5 | 2.1.2 | opgaven | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.pdf` |
| 6 | 2.1.2 | antwoorden | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf` |
| 7 | 2.1.3 | paragraaf | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf` |
| 8 | 2.1.3 | opgaven | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf` |
| 9 | 2.1.3 | antwoorden | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf` |
| 10 | 2.1.4 | opgaven | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – opgaven.pdf` |
| 11 | 2.1.4 | antwoorden | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – antwoorden.pdf` |
| 12 | 2.1 | hoofdstuk | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1 Kosten en opbrengsten – hoofdstuk.pdf` |
| 13 | 2.1 | antwoorden | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1 Kosten en opbrengsten – antwoorden.pdf` |
| 14 | 2.2.1 | paragraaf | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf` |
| 15 | 2.2.1 | opgaven | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf` |
| 16 | 2.2.1 | antwoorden | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – antwoorden.pdf` |
| 17 | 2.2.2 | paragraaf | L | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.pdf` |
| 18 | 2.2.2 | opgaven | L | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.pdf` |
| 19 | 2.2.2 | antwoorden | L | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.pdf` |
| 20 | 2.2.3 | paragraaf | L | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf` |
| 21 | 2.2.3 | opgaven | L | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf` |
| 22 | 2.2.3 | antwoorden | L | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf` |
| 23 | 2.2.4 | opgaven | L | `2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit/2.2.4 Gemengde opgaven elasticiteit – opgaven.pdf` |
| 24 | 2.2.4 | antwoorden | L | `2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit/2.2.4 Gemengde opgaven elasticiteit – antwoorden.pdf` |
| 25 | 2.2 | hoofdstuk | L | `2.2 Hoofdstuk Elasticiteit/2.2 Elasticiteit – hoofdstuk.pdf` |
| 26 | 2.2 | antwoorden | L | `2.2 Hoofdstuk Elasticiteit/2.2 Elasticiteit – antwoorden.pdf` |
| 27 | 2.3.1 | paragraaf | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1 Consumentensurplus – paragraaf.pdf` |
| 28 | 2.3.1 | opgaven | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1 Consumentensurplus – opgaven.pdf` |
| 29 | 2.3.1 | antwoorden | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1 Consumentensurplus – antwoorden.pdf` |
| 30 | 2.3.2 | paragraaf | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2 Producentensurplus en totaal surplus – paragraaf.pdf` |
| 31 | 2.3.2 | opgaven | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2 Producentensurplus en totaal surplus – opgaven.pdf` |
| 32 | 2.3.2 | antwoorden | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2 Producentensurplus en totaal surplus – antwoorden.pdf` |
| 33 | 2.3.3 | paragraaf | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3 Pareto-efficientie en welvaartsverlies – paragraaf.pdf` |
| 34 | 2.3.3 | opgaven | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3 Pareto-efficientie en welvaartsverlies – opgaven.pdf` |
| 35 | 2.3.3 | antwoorden | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3 Pareto-efficientie en welvaartsverlies – antwoorden.pdf` |
| 36 | 2.3.4 | opgaven | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart – opgaven.pdf` |
| 37 | 2.3.4 | antwoorden | P | `2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart – antwoorden.pdf` |
| 38 | 2.3 | hoofdstuk | P | `2.3 Hoofdstuk Surplus en welvaart/2.3 Surplus en welvaart – hoofdstuk.pdf` |
| 39 | 2.3 | antwoorden | P | `2.3 Hoofdstuk Surplus en welvaart/2.3 Surplus en welvaart – antwoorden.pdf` |
| 40 | book | boek | P | `Boek 2 Kosten, opbrengsten, elasticiteit en surplus – boek.pdf` |
| 41 | book | antwoorden | P | `Boek 2 Kosten, opbrengsten, elasticiteit en surplus – antwoorden.pdf` |

## Exact accepted PDFs at this checkpoint

The hashes below were freshly recomputed from the integrated root pair.
All corresponding independent review/QC/handoff records remain required;
hashes alone are not student-quality acceptance.

| ID / edition | Raw PDF SHA-256 | Accepted revision |
|---|---|---|
| 2.1.1 / paragraaf | `9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0` | R3 |
| 2.1.1 / opgaven | `97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953` | R3 |
| 2.1.1 / antwoorden | `ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a` | R3 |
| 2.1.2 / paragraaf | `e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2` | R5 |
| 2.1.2 / opgaven | `94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a` | R5 |
| 2.1.2 / antwoorden | `07a75d7b5b69344d38d5da9e5f2e0a3b964d86cc64c383b37809f8263fb33192` | R5 |
| 2.2.1 / paragraaf | `aafd07e6bb88dcb8833569f2c4d01809d6fcdc0f879d0c7a39c810dfabdbc440` | R6 |
| 2.2.1 / opgaven | `e9def67106ce56f06ff5247bb3d56fe17dcd4297e65ab95ba6942453759761ee` | R6 |
| 2.2.1 / antwoorden | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` | R6 |

Each accepted paragraph has `<id>-textbook-handoff.md` in its canonical folder,
including exact source/review/quality bindings, concepts, exercises, visuals and
carry-forward limits. All 78 current accepted pages (31 + 27 + 20) have actual
root and independent inspection evidence; §221 paragraph/root R2 transfers are
explicitly distinguished from fresh specialist full-page inspection.

## Remaining production and acceptance

Wave two builds §213, §222 and §223 from accepted plans/handoffs; existing root
PDFs for those IDs remain L until new payloads pass all gates and are adopted.
§214/§224 follow accepted prerequisite teaching. §231–§234 and all aggregate
outputs remain pending their dependency/plan/review gates. Book front sources
alone passed independent R2; no back matter, actual book manifest or assembled
book PDF has been accepted. Preserve paragraph/answer separation and never
append duplicate opgaven to a complete paragraaf source.

Update this manifest only from exact adopted payload/proof evidence. Final
closure requires all 41 accepted final PDFs plus source/asset/proof hashes,
independent finished verification and lead rounds, paired compatibility/CI and
normal readiness. Classroom timing/attainment and optional current Inspectie
mapping are not asserted. No future merge authority is supplied.

## Inventory method and diagnostic correction

Read-only Git `ls-tree -r -z --name-only` at baseline/HEAD, exact planned-path
membership, filesystem presence, raw SHA-256 of accepted PDFs and baseline/HEAD
Git-blob comparison for all legacy PDFs. An initial line-split probe failed to
interpret Git's quoted Unicode paths and incorrectly counted zero baseline
PDFs; it was discarded and replaced with NUL-delimited paths before this record.
The corrected baseline and current tracked count is 26. No files were changed
by inventory checks.

Post-write checks: planned/active sprint bundle PASS, approved-use currentness
PASS, durable twelve-record authority PASS, 41 manifest rows/unique paths and
all twelve freshly hashed target-trace bindings PASS, whitespace PASS. The
first uniqueness one-liner lost a literal backtick through PowerShell escaping;
its failure was corrected using table-column parsing and rerun successfully.
No failed probe is treated as acceptance and no complete-bundle claim is made.

# Sprint BOOK2-TEXTBOOK-PRODUCTION-1: Output manifest

Date: 2026-09-05. Accountable integrator: codex-root.
Status: **ACTIVE CHECKPOINT — NOT COMPLETE**. This manifest records the exact
41-PDF output contract from the approved operational/root plan and separates
fresh internal acceptance from old file presence.

Snapshot: platform `ad1425b37d4a02ec187088e2fa885fd5226ad9d6`, lessons
`3745ef9757e6f10e5edd746dc4508ee73c596d6d`.
Lesson baseline: `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
All paths below are relative to the lesson book root
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/`.

## Counts and evidence rules

Expected: 27 theory + 6 consolidation + 6 chapter + 2 book = **41 PDFs**.
At this checkpoint: **0 fully gate-closed current paragraph packages**, 18 adopted
candidate PDFs, 8 legacy unaccepted and 15 absent. The six §211/§212 PDFs retain
historical independent print/content acceptance, but their package accessibility
gate is reopened for short-alt defects; they are conservatively C here. Physical
root presence is 26, not 26 accepted. All eight legacy PDFs remain Git-blob-
identical to the baseline. Separate in-progress worktrees do not count here.

§221 R8 and §213 R6 now correct their short-alt/title metadata, retaining all
49 printed page bytes from R7/R5. Both are root-rebuilt candidates with current
independent rereviews adopted as PASS WITH FLAGS; their prior specialist REVISE findings remain
open until exact-candidate gates close. All three editions of each stay C.
§222 R13 is adopted/root-rebuilt: exactly one answer page changes; the other20
remain identical. Its canonical paragraph FAIL remains pending current rereview.
§223 R3 remains an adopted paragraph-PASS candidate.
Their root reports distinguish actual source/page/rebuild checks from remaining
independent paragraph, specialist and handoff gates. See review-corrections.md.

Each PDF also requires matching generated `.md` and self-contained `.html`;
paragraphs require their planned SVG/PNG pairs, thin builder, accepted plan,
independent review/Part A quality record and handoff. Chapters/books require
accepted source assemblies, exact asset parity, their own complete render and
independent review gates. Do not emit paragraaf.* for the three consolidations.

A = fresh internal paragraph acceptance with flags; not final owner/CI approval.
C = adopted/root-verified current candidate; one or more acceptance gates pending.
L = baseline legacy file present, not accepted. P = pending/absent.
No output is silently accepted through an older PASS or reviewed_final label.

## Exhaustive PDF inventory

| # | ID | Edition | Status | Exact relative PDF path |
|---:|---|---|:---:|---|
| 1 | 2.1.1 | paragraaf | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.pdf` |
| 2 | 2.1.1 | opgaven | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.pdf` |
| 3 | 2.1.1 | antwoorden | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf` |
| 4 | 2.1.2 | paragraaf | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf` |
| 5 | 2.1.2 | opgaven | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.pdf` |
| 6 | 2.1.2 | antwoorden | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf` |
| 7 | 2.1.3 | paragraaf | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf` |
| 8 | 2.1.3 | opgaven | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf` |
| 9 | 2.1.3 | antwoorden | C | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf` |
| 10 | 2.1.4 | opgaven | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – opgaven.pdf` |
| 11 | 2.1.4 | antwoorden | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – antwoorden.pdf` |
| 12 | 2.1 | hoofdstuk | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1 Kosten en opbrengsten – hoofdstuk.pdf` |
| 13 | 2.1 | antwoorden | L | `2.1 Hoofdstuk Kosten en opbrengsten/2.1 Kosten en opbrengsten – antwoorden.pdf` |
| 14 | 2.2.1 | paragraaf | C | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf` |
| 15 | 2.2.1 | opgaven | C | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf` |
| 16 | 2.2.1 | antwoorden | C | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – antwoorden.pdf` |
| 17 | 2.2.2 | paragraaf | C | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.pdf` |
| 18 | 2.2.2 | opgaven | C | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.pdf` |
| 19 | 2.2.2 | antwoorden | C | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.pdf` |
| 20 | 2.2.3 | paragraaf | C | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf` |
| 21 | 2.2.3 | opgaven | C | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf` |
| 22 | 2.2.3 | antwoorden | C | `2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf` |
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

## Exact accepted and candidate PDFs at this checkpoint

The hashes below were freshly recomputed from the integrated root pair.
All corresponding independent review/QC/handoff records remain required;
hashes alone are not student-quality acceptance.

| ID / edition | Raw PDF SHA-256 | Current revision / gate |
|---|---|---|
| 2.1.1 / paragraaf | `9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0` | R3 historical print acceptance; short-alt correction/review pending |
| 2.1.1 / opgaven | `97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953` | R3 historical print acceptance; short-alt correction/review pending |
| 2.1.1 / antwoorden | `ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a` | R3 historical print acceptance; short-alt correction/review pending |
| 2.1.2 / paragraaf | `e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2` | R5 historical print acceptance; short-alt correction/review pending |
| 2.1.2 / opgaven | `94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a` | R5 historical print acceptance; short-alt correction/review pending |
| 2.1.2 / antwoorden | `07a75d7b5b69344d38d5da9e5f2e0a3b964d86cc64c383b37809f8263fb33192` | R5 historical print acceptance; short-alt correction/review pending |
| 2.2.1 / paragraaf | `98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6` | R8 corrected candidate; rereview/QC/handoff pending |
| 2.2.1 / opgaven | `a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af` | R8 corrected candidate; rereview/QC/handoff pending |
| 2.2.1 / antwoorden | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` | R8 corrected candidate; rereview/QC/handoff pending |
| 2.1.3 / paragraaf | `534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024` | R6 corrected candidate; rereview/QC/handoff pending |
| 2.1.3 / opgaven | `d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05` | R6 corrected candidate; rereview/QC/handoff pending |
| 2.1.3 / antwoorden | `aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a` | R6 corrected candidate; rereview/QC/handoff pending |
| 2.2.2 / paragraaf | `36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c` | R13 corrected candidate; canonical FAIL pending rereview/QC |
| 2.2.2 / opgaven | `0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555` | R13 corrected candidate; canonical FAIL pending rereview/QC |
| 2.2.2 / antwoorden | `61cbde67e81565150128187573a766fffc9bc1d01f3bd24cbe3dacb9ddeb52b2` | R13 corrected candidate; canonical FAIL pending rereview/QC |
| 2.2.3 / paragraaf | `ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb` | R3 candidate; paragraph pass, QC/handoff/successor pending |
| 2.2.3 / opgaven | `50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80` | R3 candidate; paragraph pass, QC/handoff/successor pending |
| 2.2.3 / antwoorden | `30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10` | R3 candidate; paragraph pass, QC/handoff/successor pending |

Each accepted paragraph has `<id>-textbook-handoff.md` in its canonical folder,
including exact source/review/quality bindings, concepts, exercises, visuals and
carry-forward limits. The 58 historically accepted pages (31 + 27) have actual root and independent
inspection evidence; new short-alt findings do not erase those observations,
but require corrected MD/HTML/asset lineage and renewed package gates. The separate 102 candidate pages (29 + 20 + 21 + 32) have
root observation/rebuild reports; §221/§222 exact transfers from root's own
prior views are distinguished from fresh independent full-page inspection.
Historical §221 R6 handoff is not a current R8 handoff.

## Remaining production and acceptance

Wave-two §213, §222 and §223 outputs are now adopted candidates C; their gate
closure remains pending. §211/§212 need bounded short-alt/title corrections;
§213 R6/§221 R8 are corrected/root-verified but need new review/QC/handoff gates.
Independent §223 R3 paragraph PASS WITH FLAGS is adopted; specialist and handoff
gates remain. §222's canonical FAIL covers answer4b order and Concert short alt;
the distinct R13 candidate is now root-adopted/verified, awaiting renewed review/QC.
§223 also needs exact accepted-current-§221 successor input binding
with unchanged pupil output proof before final combined reproduction.
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
membership, filesystem presence, raw SHA-256 of accepted/candidate PDFs and baseline/HEAD
Git-blob comparison for all legacy PDFs. An initial line-split probe failed to
interpret Git's quoted Unicode paths and incorrectly counted zero baseline
PDFs; it was discarded and replaced with NUL-delimited paths before this record.
The corrected baseline and current tracked count is 26. The current refresh
recomputed 41 unique planned paths, 26 present, eight baseline-identical legacy
PDFs, 15 absent and all eighteen accepted/candidate PDF hashes. Current candidate status
does not inherit a legacy acceptance label. No files were changed
by inventory checks.

Post-write checks: planned/active sprint bundle PASS, approved-use currentness
PASS, durable twelve-record authority PASS, 41 manifest rows/unique paths and
all twelve freshly hashed target-trace bindings PASS, whitespace PASS. The
first uniqueness one-liner lost a literal backtick through PowerShell escaping;
its failure was corrected using table-column parsing and rerun successfully.
No failed probe is treated as acceptance and no complete-bundle claim is made.

# Sprint BOOK2-TEXTBOOK-PRODUCTION-1: Output manifest

Date: 2026-09-06. Accountable integrator: codex-root.
Status: **ACTIVE CHECKPOINT — NOT COMPLETE**. This manifest records the exact
41-PDF output contract from the approved operational/root plan and separates
fresh internal acceptance from old file presence.

Snapshot: platform adopted212 R7 review `8e00eee0252993bee69f94a3ebb1414e03b8ef49`,
lessons `d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f`, including the exact
root-only current211 acceptance/handoff at5e14325 in211-root-acceptance-r5.md.
Current221 R8 and222 R13 acceptances remain unchanged.
Lesson baseline: `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
All paths below are relative to the lesson book root
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/`.

## Counts and evidence rules

Expected: 27 theory + 6 consolidation + 6 chapter + 2 book = **41 PDFs**.
At this checkpoint: **3 internally gate-closed current paragraph packages**:
9 accepted-with-flags PDFs,9 adopted candidate PDFs,8 legacy unaccepted and15
absent. §211 now has current R5 independent paragraph review, distinct specialist
QC and root acceptance/handoff. §212 retains historical print/content acceptance
but its current independent and successor gates remain; its three PDFs stay C. Physical
root presence is 26, not 26 accepted. All eight legacy PDFs remain Git-blob-
identical to the baseline. Separate in-progress worktrees do not count here.

§221 R8 and §213 R6 correct their short-alt/title metadata, retaining all49
printed page bytes from R7/R5. §221 R8 now has current independent paragraph and
specialist PASS WITH FLAGS and root acceptance/handoff; its three editions are A.
§213 R7 now adds the required bonus assessment-criteria block, with30 total pages.
Root source/native/print-only proof and current independent R7 paragraph review pass; QC and final
accepted212 successor/full-root rebuild remain. Its editions stay C; no handoff.
§222 R13 is adopted/root-rebuilt: exactly one answer page changes; the other20
remain identical. Its current independent paragraph and distinct specialist
reviews pass with flags; root acceptance/handoff are complete. Its editions are A.
§223 R3 remains an adopted paragraph-PASS candidate.
§211 R5 adds the required bonus criteria and is adopted/root-rebuilt: only answer
page7 changes; the other30 pages remain exact. Current paragraph review and
distinct specialist QC pass; root acceptance/handoff are complete. Its inherited stale opgaven.zip is explicitly excluded;
the native211 builder has no ZIP output contract. It is not a current student
deliverable. §212 R7 adds its three bonus criteria and is adopted/root-rebuilt:
only answer page6 changes, the other26 pages are exact, and34artifact full/print
reproduction passes. Its current independent paragraph review passes; distinct
specialist/root gates and accepted-prerequisite succession remain.
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
| 1 | 2.1.1 | paragraaf | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.pdf` |
| 2 | 2.1.1 | opgaven | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.pdf` |
| 3 | 2.1.1 | antwoorden | A | `2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf` |
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
| 14 | 2.2.1 | paragraaf | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf` |
| 15 | 2.2.1 | opgaven | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf` |
| 16 | 2.2.1 | antwoorden | A | `2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – antwoorden.pdf` |
| 17 | 2.2.2 | paragraaf | A | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.pdf` |
| 18 | 2.2.2 | opgaven | A | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.pdf` |
| 19 | 2.2.2 | antwoorden | A | `2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.pdf` |
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
| 2.1.1 / paragraaf | `9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0` | R5 internal acceptance with flags; current review/QC/handoff complete |
| 2.1.1 / opgaven | `97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953` | R5 internal acceptance with flags; current review/QC/handoff complete |
| 2.1.1 / antwoorden | `498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce` | R5 internal acceptance with flags; current review/QC/handoff complete |
| 2.1.2 / paragraaf | `e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2` | R5 historical print acceptance; short-alt correction/review pending |
| 2.1.2 / opgaven | `94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a` | R5 historical print acceptance; short-alt correction/review pending |
| 2.1.2 / antwoorden | `d55f1da66723cd6f932cbf0793ce79d8d4188d2d907244fd40cc6f6fbad5ac90` | R7 criteria corrected; current paragraph/QC/successor gates pending |
| 2.2.1 / paragraaf | `98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6` | R8 internal acceptance with flags; current review/QC/handoff complete |
| 2.2.1 / opgaven | `a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af` | R8 internal acceptance with flags; current review/QC/handoff complete |
| 2.2.1 / antwoorden | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` | R8 internal acceptance with flags; current review/QC/handoff complete |
| 2.1.3 / paragraaf | `534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024` | R7 bonus corrected; independent review/QC/handoff/successor pending |
| 2.1.3 / opgaven | `d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05` | R7 bonus corrected; independent review/QC/handoff/successor pending |
| 2.1.3 / antwoorden | `d96f21c3abed471f3a12dd318cb1485043fe557e4a4d4b54034407763ae87787` | R7 bonus corrected; independent review/QC/handoff/successor pending |
| 2.2.2 / paragraaf | `36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c` | R13 internal acceptance with flags; current review/QC/handoff complete |
| 2.2.2 / opgaven | `0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555` | R13 internal acceptance with flags; current review/QC/handoff complete |
| 2.2.2 / antwoorden | `61cbde67e81565150128187573a766fffc9bc1d01f3bd24cbe3dacb9ddeb52b2` | R13 internal acceptance with flags; current review/QC/handoff complete |
| 2.2.3 / paragraaf | `ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb` | R3 candidate; paragraph pass, QC/handoff/successor pending |
| 2.2.3 / opgaven | `50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80` | R3 candidate; paragraph pass, QC/handoff/successor pending |
| 2.2.3 / antwoorden | `30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10` | R3 candidate; paragraph pass, QC/handoff/successor pending |

Each accepted paragraph has `<id>-textbook-handoff.md` in its canonical folder,
including exact source/review/quality bindings, concepts, exercises, visuals and
carry-forward limits. The 58 historically accepted pages (31 + 27) have actual root and independent
inspection evidence; new short-alt findings do not erase those observations,
but require corrected MD/HTML/asset lineage and renewed package gates. The separate103 produced pages (30 + 20 + 21 + 32) have
root observation/rebuild reports; §221/§222 exact transfers from root's own
prior views are distinguished from fresh independent full-page inspection.
§221 R8 has its own current handoff; the earlier R6 handoff remains in Git history.
See221-root-acceptance-r8.md for exact current canonical and adoption bindings.

## Remaining production and acceptance

Wave-two §213 and §223 outputs remain adopted candidates C; their gate
closure remains pending. §211 R5 has complete current paragraph review, distinct
specialist QC and root acceptance/handoff with flags; see211-root-acceptance-r5.md.
§212 R7 has its bonus block and current independent paragraph PASS; distinct
specialist/root gates and
accepted-prerequisite succession; both metadata corrections are root-adopted/rebuilt.
§213 R7 has the bonus-criteria correction and current independent paragraph PASS;
distinct QC/root acceptance and exact accepted
prerequisite succession remain. Current root print-only/source/render proof is
not mislabeled a full generator rebuild while the old212 MD guard still differs.
§221 R8's internal review/QC/handoff gates are complete, with timing flags.
Independent §223 R3 paragraph PASS WITH FLAGS is adopted; specialist and handoff
gates remain. §222's former canonical FAIL is superseded by actual current R13
independent PASS closing answer4b order and Concert short alt. Distinct QC
and root acceptance/handoff now close, with timing flags; see222-root-acceptance-r13.md.
Historical212 teaching is unchanged by its metadata/bonus correction; root must
link its eventual newly accepted package before final combined book closure.
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

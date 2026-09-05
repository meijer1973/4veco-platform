# Paragraph Review: 2.1.1 Kostenstructuren

## Review identity and verdict

- Reviewer: `correction_plan_review`, independent of builder `released_pin_analysis`.
- Review date: 2026-09-05.
- Platform reviewed: `16c3b1c53b73a563084297190ba58d7bf1bed679`.
- Lesson reviewed: `c37dfba8c68cbe86b3b12534e020fda6e2481ac5`.
- Scope: the final R3 paragraph, exercises, answers and six paired figures; source integrity, didactic architecture, mathematical correctness and all 31 rendered pages.
- Verdict: **PASS_WITH_FLAGS**.
- Blocking findings: **none remaining**.
- Remaining flags: estimated—not observed—core-route timing; optional improvement to orange graphical-stroke contrast.

This is a fresh independent review. Neither inherited `2.1.1-review.md` / `2.1.1-quality-ref.yaml` nor builder inspection records were accepted as independent approval. This report does not replace the separately assigned specialist QC, authorize a PR merge, or approve unreviewed chapter/book outputs.

The reviewer performed read-only inspection. The lesson worktree was clean. The platform contained three untracked historical exploratory proof locations; these were excluded, left untouched and were not used as canonical evidence.

## Reviewed authority and exact payload

The accepted paragraph plan is pinned to lesson commit `e680d6171968ec1d8a14132796c0c9df6ded0d30`, canonical-LF SHA-256:

`f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0`

Its reviewed chapter plan is pinned to lesson commit `7ad5dd19e1714bb68d48a55a11a032942a6615e4`, canonical-LF SHA-256:

`ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116`

Frozen §2.1.1 target-record hash:

`143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710`

The four exact goals remain:

1. Je kunt kostencomponenten als constant of variabel classificeren op basis van hun gedrag binnen een genoemde periode en bij gelijkblijvende productiecapaciteit.
2. Je kunt uit een context de functies voor TCK, TVK en TK opstellen.
3. Je kunt gemiddelde kosten berekenen en met de juiste eenheid interpreteren.
4. Je kunt verklaren hoe totale en gemiddelde kosten veranderen als Q verandert, binnen de aannames van het model.

The frozen bakery context, target subquestions a–e, supplied classification-table cells and point distribution **4/3/3/3/4 = 17 points** remain intact. The student classification/justification cells are blank.

### Final document hashes

Paths share the lesson directory:

`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/`

| Document | Format | SHA-256 |
|---|---|---|
| `2.1.1 Kostenstructuren – paragraaf` | MD | `51394535fcf09aadfa13d9d9a61c0578ae94413b91e7c1cf293e44588e2c510f` |
| | HTML | `ec141d8afaa532f36499f0e71a65aa2cb5753a6e89bd289fe9e9d7a94d776061` |
| | PDF | `9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0` |
| `2.1.1 Kostenstructuren – opgaven` | MD | `4e6bf501e8ce7374d704999ba090ccbfd17c49c75bd9a3bb03be11d29675a5df` |
| | HTML | `4ae0b5824604aad3b3129f13c3e092651315164c0fa9f3f5dd4d2fb8eab40a87` |
| | PDF | `97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953` |
| `2.1.1 Kostenstructuren – antwoorden` | MD | `57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb` |
| | HTML | `d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca` |
| | PDF | `ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a` |

### Page and asset evidence

Canonical evidence is under platform path `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.

| Artifact directory | Individually inspected pages | Raw manifest SHA-256 |
|---|---:|---|
| `211-paragraaf-9837e3a85f31-r3` | 001–015 | `fd64c510e1b13f377e8c99d3429832cf8f360c4419294a7f25ab7b293d92c921` |
| `211-opgaven-97329415bacc-r3` | 001–009 | `8e5b0590eb82502c5486e4ec1a81c8bce8310d51f2fdd12a51d9f47fef5e0823` |
| `211-antwoorden-ffdf0905a980-r3` | 001–007 | `a5ca4ef02f99129fb10b4c6dcbb3ee5242b76b658a3b69d62a38d4bfb32f3afb` |

These exact manifests bind every page through `page_sha256`, plus each consumed source and asset. I independently recomputed those hashes and rerendered the exact PDFs with Poppler at 150 dpi: **all 31 resulting page hashes matched**.

All 31 final R3 pages were personally inspected individually at normal full-page reading scale, not merely through contact sheets. R1/R2 visual inspection was not carried forward as approval of changed R3 PDFs.

## Pass 0: Asset and file integrity

**PASS.**

| Check | Result | Evidence |
|---|---|---|
| 0.1 Image references resolve | PASS | All current authored student/answer image references resolve locally. |
| 0.2 SVG/PNG pairs | PASS | Six complete pairs: `fig_1`–`fig_4`, `we_1`, `ex_1`. |
| 0.3 Naming convention | PASS | Assets use the required §2.1.1 naming pattern. |
| 0.4 Orphaned assets | PASS | Every figure pair has a corresponding authored use; no unexplained asset pair. |
| 0.5 Required outputs | PASS | Three MD sources and their HTML/PDF outputs exist. |

The exercise source is shared consistently between paragraph and exercise output. The rendered HTML exercise fragments match. No remote resource or student device dependency is needed.

Additional independent verification:

- `python -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v`: **11/11 PASS**.
- `python build-scripts/content/book-2/211/check_render.py`: **PASS**.
- Scoped approved `specialist_review` currentness for §2.1.1: **PASS**.
- Canonical MD/HTML/PDF, asset and page freshness: **PASS**.
- Independent PDF-to-page reproduction: **31/31 exact matches**.

These automated checks supplemented—not replaced—the source, economic and visual review.

## Pass 1: Didactic architecture

### Strengths

1. **Opening and prior knowledge — PASS, paragraph p.1.**
   The poster-production question establishes the distinction between total and per-product cost before formal teaching. R3 explicitly recalls substitution and division before new theory, without inventing an unsupported claim about a particular Book 1 formula.

2. **Progressive explanation and representations — PASS, paragraph pp.1–6.**
   Cost classification precedes functions; totals precede averages. TCK is shown first, followed by TVK and then TK in successive panels. Formula, table, diagram and nearby explanation communicate the same bounded model. The total-to-average mapping makes selection of the correct numerator explicit.

3. **Actual fading — PASS.**
   The bicycle worked example models the complete target chain. Guided badge work supplies a classification example and completed first production level; bookmark work removes more support. The contract comparison exposes a specific classification trap. Independent sticker work and the bakery target require the same operations without guided answers. No extra graph-production demand is imposed.

4. **Exercise architecture — PASS.**
   All seven required exercise headings have the exact order and level. The compact five-point non-heading summary follows the worked example and precedes Startopgaven. Startopgaven combine prerequisite retrieval with a brief current-content check. Guided practice remains printed, optional and neutrally labelled. The core route is visible.

5. **Transfer, feedback and paper completeness — PASS.**
   The bonus challenges the false generalization that GVK is always constant. Closing review uses previously taught substitution/division only. The answer model gives reasoning, units, boundaries and fair treatment of alternative correct methods. The frozen target is together on paragraph p.14 / exercise p.8, with usable blank classification cells.

The seven-column plan alignment correctly distinguishes partial Start checks from complete target coverage. All four goals and all a–e operations are taught, modelled and rehearsed.

### Findings and corrections

| Check | Classification | Status and evidence |
|---|---|---|
| 1.1.2 Prior-knowledge connection | Earlier FLAG | **CLOSED in R3.** The three-sentence recall bridge is printed before new theory on paragraph p.1. It fits the accepted retrieval scope and existing motivation budget. |
| Print readability | Earlier required correction | **CLOSED in R3.** All footer/page-counter text was increased from 9 to 12 pt. All 31 pages were reinspected; the updated checker includes footers and reports minimum printed text size **12.0 pt in every PDF**. |
| Dutch wording | Earlier minor correction | **CLOSED.** Answer 3a now reads “bij iedere extra badge”, visibly verified on final answers p.1. |

### Remaining non-blocking flags

**FLAG — 1.5.7, timing certainty.**

The explicit whole-core estimate is:

`2 motivation + 12 instruction + 8 worked example + 2 recap/transitions + 6 Start + 12 independent + 12 target = 54 minutes`.

This is a plausible but tight design estimate, not observed learner performance. The optional guided route adds 12 minutes, making the supported route 66 minutes; bonus and closing review are outside the core. The report must not imply that every learner can finish all printed material in one 55-minute lesson.

Action: retain the explicit route and estimate qualification; monitor actual pacing during first classroom use and use the already identified continuation time for additional support. No source change is required before this paragraph passes.

**FLAG — graphical contrast enhancement.**

Orange `#E67E22` against `#F7FAFC` has independently calculated contrast **2.7176644686493034:1**, below 3:1. A darker outline/stroke would improve robustness.

For these exact pages, I do **not** classify this as a blocking required-information defect: visible dark labels, formulas, values, tables and prose independently convey TCK constancy, TVK/TK values and their difference, and division by Q. No exercise or target requires extracting otherwise unavailable information from the orange stroke. This is consistent with the W3C distinction for graphical information already conveyed by equivalent visible text or another form. [W3C: Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

This is **not** a brand-palette exemption, a claim of blanket WCAG conformance, or permission to reuse inadequate contrast where later targets require essential curve reading or construction.

## Pass 2: Mathematical and conceptual precision

### Verified correct

**Cost semantics and model limits — PASS.**

- Classification concerns the behavior of the **total** amount as Q changes, within the stated period and capacity.
- Monthly totals and per-product averages have distinct, correct units.
- Averaging divides the relevant total by the same positive Q.
- Constant GVK is explicitly a property of the selected model, not a universal law.
- Doubling Q halves GCK when TCK remains fixed; it does not generally halve GTK or double TK.
- Changing a contract is correctly distinguished from changing production within one contract.
- The bakery conclusions remain bounded to one month, Q = 500–1,000 and unchanged production capacity.

**All worked and exercise calculations — PASS.**

I independently reworked the numerical chains, rather than relying solely on tests or the answer key.

| Context | Independently verified results |
|---|---|
| Posters, Q 40/80 | TCK 120; TVK 80/160; TK 200/280; GCK 3/1.50; GVK 2/2; GTK 5/3.50. |
| Bicycle worked example, Q 100/200 | TCK 200; TVK 200/400; TK 400/600; GCK 2/1; GVK 2/2; GTK 4/3. |
| Start budget | B(10)=50; B(20)=70; B(10)/10=5 per participant. |
| Badges, Q 50/100 | TCK 150; TVK 50/100; TK 200/250; GCK 3/1.50; GVK 1/1; GTK 4/2.50. |
| Bookmarks, Q 40/80 | TCK 80; TVK 80/160; TK 160/240; GCK 2/1; GVK 2/2; GTK 4/3. |
| Contract changes at Q 100 | Each separate change raises TK from 400 to 420; combined TK 440 and GTK 4.40. |
| Independent stickers, Q 400/800 | TCK 240; TVK 240/480; TK 480/720; GCK .60/.30; GVK .60/.60; GTK 1.20/.90. |
| Frozen bakery, Q 500/1,000 | TCK 500; TVK 400/800; TK 900/1,300; GCK 1/.50; GVK .80/.80; GTK 1.80/1.30. |
| Bonus comparison | A: GVK 1/1; B: GVK 2/2.50. Two observations do not identify a unique intermediate cost function. |
| Closing budget | B(15)=90; B(30)=135; averages 6 and 4.50 per participant. |

**Graph and representation accuracy — PASS.**

I checked labelled points against the formulas and SVG coordinates. The poster TCK line represents 120; TVK represents 80→160; TK represents 200→280. The panel scales agree, and TK−TVK remains 120. The displayed interval is Q = 40–80; no unsupported extrapolation to zero is taught. Axes identify production and monthly costs. Tables, formulas, prose and figures agree.

Demand/supply-specific slope, intercept and horizontal-addition checks are not applicable to this cost paragraph. No marginal-cost, optimization or unrelated terminal-goal material has been introduced.

**Answer completeness and scoring — PASS.**

All exercises are solvable from the printed information. Answers match the questions, include the required interpretation and units, and explain misconceptions. Target scoring remains 17 points with the original a–e allocation. Target answer e distinguishes all total and average changes and explicitly preserves the model limits.

### Issues

No remaining mathematical or conceptual FAIL or correction-required finding.

## Final visual acceptance

Personally inspected final R3 pages: **15 paragraph + 9 exercise + 7 answer = 31**.

No blocking clipping, overlap, unreadable label, broken glyph, missing figure, unusable table, detached short warning label, or source/render discrepancy was found. Body, tables and running footers meet the 12 pt printed-text floor. Figure labels remain readable at their actual placed size. The target is not pre-answered in student output.

The original footer exception is rejected and superseded; final acceptance relies only on the corrected R3 bytes. Generated proof manifests still truthfully contain `PENDING` independent inspection fields at the reviewed commit. This issued review supplies independent evidence for subsequent attributed recording; it does not retrospectively turn builder self-QA into independent review.

## Verdict

**PASS WITH FLAGS**

Canonical machine-readable formatting of the reviewer's `PASS_WITH_FLAGS`
judgment; no change to the scope, findings or conditions below.

## Summary

**PASS_WITH_FLAGS for the exact R3 §2.1.1 payload.** Pass 0 integrity, Pass 1 teaching architecture and Pass 2 mathematical precision pass. The prior recall, Dutch wording and footer-size findings are closed with regenerated, independently inspected evidence. No blocking student-use defect remains within this review’s scope.

The two residual flags are bounded: classroom timing is an unmeasured 54-minute estimate, and darker orange strokes would improve visual robustness despite equivalent visible information already being available. Root may record this fresh review and combine it with the separately required independent QC; this verdict grants no approval to unrelated lessons, chapter assemblies or merge operations.

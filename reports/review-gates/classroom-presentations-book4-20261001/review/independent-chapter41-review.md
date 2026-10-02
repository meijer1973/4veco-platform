# Independent chapter 4.1 instructional review

**Follow-up status (2026-10-01): PASS within this review scope after the coordinator §411-r1 repair. The original cold finding below is preserved as history. §414/§415 are now verified final handoffs at the exact previously reviewed candidate bytes. See the appended disposition for current artifact identities.**

Date: 2026-10-01. Read-only review of cold §4.1.1–§4.1.3 and the requested §4.1.4-v2 / §4.1.5-v4 candidates. This is an instructional/content review, not merge authority.

**Verdict:** one P3 precision finding remains in the frozen §4.1.1 handoff. I found no blocking prerequisite, target-calculation or model-handoff gap in the five-paragraph sequence reviewed. The finding does not invalidate the numerical A₁ graph. Candidates §4.1.4 and §4.1.5 are assessed only at the exact bytes below; this report does not bind a later final handoff.

## Evidence and scope

I read all 132 slides' visible text and substantive speaker notes, compared the inventories against every actual slide and notes XML part (whitespace/slide-number placeholder normalization only), and independently recomputed the important authored examples and all five target calculations. All inventory text/notes matched the saved packages. The PDF page counts match 29/24/27/27/25. I checked the actual PDF wording on §411 page 25.

I revisited current v3 chapter 4.1 manuscripts, answers and teacher guidance, using my earlier complete foundation audit for prior Book 2/3 teaching and printed-page mapping. Current chapter source hashes still match that audit at lessons `e734532a42b27732ac25ce990fc9448b12309d28`. The source files and exact hashes are included in the accompanying JSON. I did not use coordinator or author verdicts to form this judgment.

Scoped individual visual inspection: §411 slide 25; §412 slide 11; §413 slide 13; §414-v2 slides 9 and 25; §415-v4 slides 4 and 21. These seven supplied PNG paths/hashes are in the JSON. I do not claim a full visual/PDF fidelity review, a reproduction of the builders, or a classroom time-fit measurement. The coordinator's complete visual review is separate evidence. Shared chart-cache/workbook parity was rerun on all five actual PPTXs: 31 charts, 320 references, 2,126 cells compared, all pass. This validates saved editable data consistency, not economic correctness by itself.

## CH41-01 — P3: distinguish sketch tolerance from model non-uniqueness

The final cold §411 slide 25 visibly says **“Een passende A₁; de lijn is niet uniek.”** Its speaker note says the task requires a suitable line through the long-run equilibrium, “niet deze unieke helling.” These are in [presentation-411.mjs](C:/wt/ppt/4veco-platform/build-scripts/content/book-4/presentation-411.mjs:189), lines 189–190. The same claim is present in the saved PDF page 25. Reviewed source SHA256: `a50a17cdbe72dea868be75cfa8ea5be111a16b05fb25586c467ba89a029c435c`.

The book's target 7 gives identical unchanged firms, TK = 0.02q² + 4q + 200, capacity 250, free entry, unchanged demand/technology/input prices, and minimum GTK = 8 at q = 100. See [M411 line 86](<C:/wt/ppt/4veco-lessen/edities/books34-v3/books/book-4/chapters/4.1/4.1.1 manuscript.md:86>), printed student p.14; [A41 line 17](<C:/wt/ppt/4veco-lessen/edities/books34-v3/books/book-4/chapters/4.1/Antwoorden.md:17>), complete answer p.6. The answer asks for A₁ right of A through the new equilibrium; it does not assert that aggregate supply is economically non-unique.

At P = 8 each firm supplies 100 kg. Demand P = 16 − 0.4Q (Q in thousands) gives Q = 20,000 kg, so there are N = 200 identical active firms. On the unconstrained rising branch, q = (P−4)/0.04 = 25(P−4), hence Q = Nq/1000 = 5(P−4), or **P = 4 + 0.20Q**. That branch is determined under this model. The new capacity bound is Q = 50 thousand at P = 14; the plotted new line through Q ≤ 40 does not exceed it. This is the post-entry short-run market curve at the new number of firms, not the distinct horizontal long-run supply locus.

I considered the charitable interpretation: the exercise accepts a schematic drawing and does not require deriving an exact aggregate equation. That is legitimate grading tolerance, and the source's “passende” supports it. It does not make different economic supply slopes valid under the fixed assumptions. The visible unqualified statement can therefore teach the wrong generalization. This is especially avoidable because §411 slide 8's own notes explicitly teach horizontal aggregation with N identical firms (builder line 111).

**Minimal repair:** replace the caption with wording such as “Passende schets door het nieuwe evenwicht.” Remove or qualify the non-uniqueness language in the notes; say the exercise asks for the shift and new equilibrium rather than requiring the derivation of A₁. The existing plotted A₁ = 4 + 0.20Q and calculations are correct and can stay. No extra aggregation lesson or textbook change is required. Preserve this original cold handoff and record any coordinator wording repair/rebuild separately. Status at this report: open; no repaired bytes reviewed.

## Serialized prerequisite and exercise matrix

All page references below are printed pages in the complete student book, not chapter-local metadata. Chapter 4.1 has a +4 page offset. Full targets include their source material and all questions before the first answer.

| Paragraph and route | Prior operations and supported first encounter | Demonstration before assigned practice | Target discussion and assessment |
|---|---|---|---|
| **411:** start 1–2 p.11; basis 3–4; independent 5–6; target 7 p.14; homework 3–7 | Start 1 retrieves Book3 §322 limited derivative and §323 price-taker quantity/capacity/TO−TK/GTK. Start 2 uses the new normal-remuneration distinction: opening explicitly says “2: verkennen, theorie p.7”; notes give reading support and return. | Slides 2–3 introduce economic profit and short/long-run assumptions. Own Cellulosekorrels example slides 4–11 calculates firm profit, then entry and market Q versus individual q. Slides 12–14 explicitly reset to a loss/exit case with unchanged costs. Slide 15 notes return to start 2 before the practice overview 16. | Source/given figures 17–19; all questions 20–21; answers 22–28. P10/q150/profit250; LR P8/q100/TO=TK800, normal reward120 remains. Distinguishes market Q×1000 from q, leaves MK/GTK fixed. Only CH41-01 found. |
| **412:** start 11–12 p.19; basis 13–15; independent 16–17; target18 p.22; homework13–18 | Start11 retrieves the price-taker procedure, with concrete support at §411 p.10. Start12 needs the new market-boundary definition: opening visibly points to p.16, notes require source evidence and later revision. | Slide2 retrieves prior procedure. Slides3–4 teach market boundary and source-backed entry barriers, contrasted with free entry in411. Slides5–6 explicitly change from individual horizontal price-taker demand to monopoly market demand, q=Q, units and uniform price. Slides7–9 demonstrate substitution and inverse solving (needed by14b). Slides10–11 separate a price movement from a preference shift, including common-price comparison needed by15. Slide12 visibly returns to12 before overview13. | Full sources14–15/questions16–17 precede answers18–23. Target prices18 and12 at q60/120; at P18 demand is60, so capacity240 does not make120 sales feasible. Scope remains monopoly characteristics: no unsupported MO optimization is demanded. |
| **413:** start21–22 p.29; basis23–25; independent26–27; target28 p.33; homework23–28 | Start21 expressly supplies prior §322's derivative rule. Start22 needs the new uniform-price revenue mechanism and explicitly receives Luma p.28 support. Slide1 notes describe supported exploration; slide14 returns to22 before practice15. | Slide3 refreshes derivative terms/signs. Own Was Nova slides4–5 teach extra-unit revenue and reduced revenue on the old quantity **before** MO<P. Slides6–8 expand Pq, differentiate TO, and fill a table. Slides9/12 separate ΔTO/Δq over an interval from point MO; slides10–13 add the graph and interpret negative MO/positive price. | Source/blank table16, questions17–18 precede answers19–25. TO30q−0.5q²; MO30−q; table250/400/450; average20→30=5 versus MO(20)=10; extra150 minus old-quantity reduction100=50. Uniform alternative week plans are not historical refunds. |
| **414-v2 candidate:** start31–32 p.41; basis33–35; independent36–37; target38 p.44; homework33–38 | Start31 retrieves newly taught413 TO/MO plus322 MK and323 marginal direction. Start32 partly retrieves GO=P; labeling the combined monopoly-optimum reading as supported exploration p.37 is conservative and reasonable. Notes return to32 before basis and ask what cost information is missing. | Own Pura slides3–9 explicitly compute candidate MO=MK, check direction/capacity/zero, then use the **same q** to find P on GO, TO/TK/profit and GTK rectangle. Slides10–12 teach a binding capacity, fixed-cost-only change and demand-only change with explicit resets, then combine changes needed by35. | Source14/figure15/questions16–17 precede answers18–26. Target q40/P30/profit400/GTK20 vs q0 profit−200. MO=MK20 is not P30; coincidence GTK=20 is identified as numerical, not conceptual. At wrong q60, MO10<MK25 and profit250<400. |
| **415-v4 candidate:** first actual mixed exercise41 p.46; all homework41,41A,42–48; target45 sources p.48/questions p.49 | Start41 is legitimate retrieval of412 source-based market classification; 41A retrieves411 long-run reasoning. Other exercises reuse413/414 methods plus Book2 old-base elasticity and TO. No invented basis/core or theory route. | Slides2–6 are a bounded recap: model comparison, one separate Gel Nova example and concise formula/check reminders. Notes prompt retrieval rather than reintroducing assigned answers. They cover capacity, zero, break-even, old-base percentages, finite-change TO and table-only maxima. This is proportionate to a mixed lesson; I do not impose a numerical slide quota. | Full A/B/figure/C sources8–11 and all questions12–14 precede answers15–24. Target monopoly q40/P24/profit360, distinct price-taker q50/P18/profit130. Different markets are explicit; profit difference cannot establish monopoly's welfare effect. No assigned worked answer appears in the pre-practice recap. |

### Source anchors for the matrix

- M411 lines9–16 (normal reward),21–43 (entry/exit),47–58 (worked model),67–86 (normal practice/target); G41 lines53–57 require introduction of normal remuneration here, unchanged-cost assumptions, and no automatic immediate shutdown from loss.
- M412 lines8–23,27–54 teach boundaries/barriers and the changed demand line; practice at73–84, target89–92. G41 lines88–92 require the411 contrast and bounded market power. Slides9–11 make the inverse algebra and combined movement/shift operations of14b/15 explicit before use.
- M413 lines10–34,38–64,68–86 teach the mechanism, derivative and point/interval distinction; practice110–130; target136–143. G41 lines123–127 specifically require lost revenue on earlier units before the general MO<P claim; the deck follows that order.
- M414 lines24–48 teach the MO/MK→GO route,52–76 feasibility/GTK,80–92 worked example; practice103–118; target123–125. A41 lines133–150 give the target calculation/graph/fault correction. Slides10–12 address all changes asked by35/37 rather than assuming their procedures from a named concept.
- M415 lines8–16 include41 and41A,21–30 table/elasticity exercises,35–45 full target,52–54 error/capacity/claim-boundary exercises. A41 lines172–179 explicitly separates the two markets. The deck retains41A and the later46–48.

Here M411–M415 are `edities/books34-v3/books/book-4/chapters/4.1/4.1.x manuscript.md`; A41 is `Antwoorden.md`; G41 is `Docenteninformatie.md` in that directory. Exact source hashes are in the JSON. The previously audited teaching includes Book2 §211/212 total cost/revenue/profit, §213 interval changes, §221/222 old-base elasticity/TO, and Book3 §322 termwise differentiation and §323 marginal choice with capacity/zero/GTK. See [foundation audit](C:/wt/ppt/.book4/source-audit.md) and its predecessor bindings. These are operation-level teaching anchors, not merely names appearing in a prior exercise.

## Model and mathematical checks

The own examples recompute correctly: Cellulosekorrels P11/q50/TO550/TK390/profit160, LR P7/q30/TO=TK210, loss case P5/q20/profit−50; Nachtkoepel P30−0.25q gives (24,24),(72,12) and q48 atP18, shifted P36−0.25q gives q72 atP18; Was Nova TO240→400 and net200−40=160, average16 versus MO20/12; Pura q30/P27/profit315, capacity20 gives P30/profit270, fixed-cost240 gives profit165, combined new demand/fixed cost gives q40/P33/profit480; Gel Nova q28/P19/TO532/TK310/profit222, reduced capacity20 gives P21/profit198. The JSON records independent target and principal own-example recomputation.

The sequence preserves economic distinctions: normal reward belongs in economic TK; long-run exit is distinct from this-week unavoidable-cost production; market Q and individual q have different scales; monopoly q=Q does not retain P=MO; price and point marginal amounts share €/kg units but differ in meaning; totals are €/week; GTK/GO at q=0 are undefined while TO/TK/profit remain calculable. The411 notes acknowledge source A₀'s extension beyond joint capacity rather than treating that extension as feasible. The414/415 notes likewise distinguish drawn function extensions from capacity-feasible plans. No new source contradiction or missing teaching requirement was identified beyond the narrow deck-authored claim CH41-01.

## Artifact identities

| Key | Review state | Slides/PDF pages | PPTX SHA256 | PDF SHA256 |
|---|---|---:|---|---|
| 411 | frozen final cold handoff | 29 | `d3d0ecb395c17295ef0450db95ed025a9716778513d2b05ee2cc7aac5c686ac8` | `c9c9eda87b85ce1ca66d4bd41bd5bb35bcb2c78160c3569c69bd1d76b0515c2f` |
| 412 | frozen final cold handoff | 24 | `df76dc244d562a46d2f611d3864551b1bb19571e76c6191e7701b8b0f2a60584` | `66e4ea378b6c4067052cfd06b528e019bed0a26875cd71be349022853624052d` |
| 413 | frozen final cold handoff | 27 | `90d49caf084fb7e2b1b4c7f13299dc320443aa7fda2e7144afaef31522502788` | `fc170caaf306bcb6469bc5fc174b21b04e43be8b761c9e4e2a41b711d587850e` |
| 414 | candidate only; final handoff not bound | 27 | `4661ecfc0bf641b1b724893862b98570eda74bd0a12e7f68a81f142111fc65c0` | `c6af9a6fdeb64559c010b2fdd45ee73b257108a32e135171dfabe0ebf9dd56fd` |
| 415 | candidate only; final handoff not bound | 25 | `033f12e26fff8101098d118819eeac6e5035b571e71d0cfb9ec92e864ad14e94` | `71691d0016d9303e357c3d55e08d454f0b06b7253a43fc8e1cd64900ccb82921` |

The artifact paths, inventory hashes, source hashes, seven image hashes and workbook-parity results are in [independent-chapter41-review.json](C:/wt/ppt/.book4/review/independent-chapter41-review.json). Root workspace source/deck files were not edited, no authors were contacted, and no Git/GitHub mutation was performed. This finding belongs to the preserved cold result; a later repair needs its own narrow verification. Timing recommendations and formal target approval remain separate from these source and instructional observations.


## Bounded follow-up disposition — 2026-10-01

**CH41-01 / coordinator B4-411-P3-01 is resolved in §411-r1.** I read the exact saved notes25 directly from the repaired PPTX and matched the inventory to all actual text/note XML. I individually viewed `repairs/411-r1/native/slide-25.png` and checked the saved PDF page25 wording. The caption now says “Een passende schets door het nieuwe evenwicht.” The note distinguishes the exercise's drawing criteria from the determined economic curve and correctly derives q=25(P−4), N=200, Q=5(P−4) in thousands and P=4+0.20Q while capacity does not bind. It preserves the valid source-capacity caveat. The new text fits clearly without altering the graph.

The builder diff against the preserved cold author source changes only the slide25 caption and note; the manifest changes only `marketSolutionSupply`'s explanatory wording. Inventory comparison confirms only slide25 text/notes changed, with all charts/tables unchanged. An independent SHA256 comparison confirms only native slide25 changed; all other28 native PNGs are byte-identical to reviewed cold v4. This is a coordinator repair after a P3 cold finding, not an untouched cold PASS.

Current repaired411 identities:

- PPTX: `e1567c845c6be83a57bfc2b41464ecc50fa04978e089a81f8970f46195da0ae3`.
- PDF: `689da9f11dc348db188f910ba41658613548f7adc903d52894a600ca308b2de4`.
- Builder: `6863aa5443d31432aa81f85ce0839a774e6c96bd3d4515503222cd6ec27b4596`.
- Manifest: `a2b742e32dc004f3dd9eebb4f78facf5eca715a48ca3a0ef7ddf4f65aaa6cb89`.

The saved files are under [411-r1/final](C:/wt/ppt/.book4/repairs/411-r1/final). The original411 hashes and wording remain above as historical evidence.

**Final414/415 confirmation:** I independently hashed the final PPTX/PDF files in `review/414` and `review/415` and compared them with this review's prior candidates and the frozen `root-review.json` records. Both pairs are byte-identical. The prior candidate-only qualification is therefore superseded for these exact files:414 remains PPTX `4661ecfc0bf641b1b724893862b98570eda74bd0a12e7f68a81f142111fc65c0`, PDF `c6af9a6fdeb64559c010b2fdd45ee73b257108a32e135171dfabe0ebf9dd56fd`;415 remains PPTX `033f12e26fff8101098d118819eeac6e5035b571e71d0cfb9ec92e864ad14e94`, PDF `71691d0016d9303e357c3d55e08d454f0b06b7253a43fc8e1cd64900ccb82921`. No full rereview was needed. These remain original final cold handoffs, distinct from411's coordinator repair.

### Separate bounded §421 citation correction

**PASS for this citation delta only; no whole-421 instructional verdict is implied.** Comparison with the frozen author builder/manifest shows only chapter-local `32–36`→complete-book `36–40`, and `33`→`37`. A direct read of complete-book PDF printed36–40 confirms the teaching:36 MO/MK quantity/direction,37 price on GO at the same q,38 profit/GTK,39 capacity/zero,40 Coating Mira with rising MK. This agrees with the foundation audit's +4 chapter41 offset. Root builder lines88,115,120 and manifest line105 are now correct.

The rendered421-r1 became available during this bounded check. I matched all inventory text/notes against the saved PPTX XML. Compared with the frozen421 inventory, only notes1,5,6,17,31 change, and those differences are exactly the specified page substitutions. All31 native PNGs are byte-identical to the frozen v3 native previews; no visible slide content/chart/table changed. This verifies propagation into the saved notes without another whole-deck visual review.

- Repaired421 PPTX: `cd6160db661fb9a81c731855817248568bc4deed8963e538e8b5a3fe96636a56`.
- Repaired421 PDF: `cf7360c6bc659646b533c41fdb0d29cd5fc215b5591a4c3ebad87e7271a85a12`.
- Builder: `d00906b6e6eefefe7f820b39410d695e43232b561e08a6b4bca68b80effb87ea`.
- Manifest: `8ce4bfa0ccce2681e006002c01a09e52457c98a1224b8d06ef072b70488eccd4`.

All current follow-up paths/hashes and original-versus-current statuses are in the JSON's `boundedFollowup`. Scope remains read-only production, with only these two independent scratch reports updated. No extra author contact, delegation, repository mutation or publication action occurred.

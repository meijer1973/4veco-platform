# Independent bounded figure review

Reviewer: `review_book2`, 2026-09-21. Repositories remained read-only. This is a review of Book 2 native figure content and geometry, not final acceptance of the integration, covers, curriculum transition, manifests or CI.

**Disposition: the 31 actual bounded figure specifications match the approved mathematical models. No geometric/economic defect found.** The task message mentioned 32 specifications; the reviewed source inventory contains 31, explicitly enumerated in `independent-figure-geometry.json`.

All 43 revised theory/reference pages were compared with the target in paired contact sheets and read at full size from independent Poppler renders. The geometric audit then examined the actual JSON path data, live text and clipping rather than relying on labels alone. The read-only probe `audit-native-figure-geometry.py` records 101 passing checks, each bound to the corresponding source hash. Axis calibration was taken from labeled axes/grid coordinates confirmed visually. The additional geometry-payload digest isolates the actual viewBox/shapes/text from later descriptive model annotations.

The numerical checks cover:

- p5–6: TCK=300, TVK=2Q, TK=300+2Q; GCK=300/Q, GVK=2, GTK=300/Q+2. All visible sampled curved-path vertices agree; Q=0 is excluded for averages, with an open marker. Vertical gaps at Q200/400 are 1.50/0.75.
- p14 and p23: TO=5Q versus TK=250+2Q, break-even Q=250/3, loss100 at Q50 and profit50 at Q100; TK=80+Q² with interval rises16/48/80 over four units. The graph does not substitute a formal derivative for interval MK.
- p38–40,46,55: signed percentage bars, signed Ev marker positions −2/−1/−0.5, equal-scale TO rectangles100×10 and95×11, and income-response bars−5/+5/+20 at the same+10% income change. The number line remains signed.
- p74–85: price/willingness/MK segment proportions; all CS/PS polygon vertices and areas. Demand30−0.5Q and20−0.25Q give CS400/200 at P10. Poster equilibrium20,20 gives CS200+PS100=TS300. Notebook equilibrium20,14 gives CS100+PS100=TS200.
- p92–97: the stated price line and actual-transaction limit are distinct from the free equilibrium. Poster limit Q12/P22 gives CS144,PS108,TS252,DWL48; workshop limit Q8/P20 gives CS48,PS80,TS128,DWL16. Polygons stop at the actual traded quantity and retain rectangle-plus-triangle geometry. Pareto explanations require feasibility and unchanged existing transactions/no adverse effect on others.
- The remaining conceptual figures contain the reviewed equation/flow text: profit after all costs; interval normalization; Ev reaction/cause; distinct own-price/income/cross-price denominators; function substitution; finite revenue changes; and quantity-before-area surplus reasoning.

Coordinate tolerances are stated per check (normally 0.015 data units; 0.03 for the finely sampled quadratic and 0.1 euro for the original rounded TO rectangle coordinates). They accommodate small source-coordinate rounding, not visual tolerance or missing content. Every expected polygon corner is checked in both directions. Actual/expected areas and representative coordinates are retained in the JSON.

Separate source-semantic findings remain subject to repair/recheck: incorrect recovered table structures and missing semantic fractions. The first-line-only figure captions on p6, p93, p94 also need their wrapped continuations in the final source/description. Those issues do not change the passing numeric-geometry result. This review does not establish final link preservation or cover correctness.

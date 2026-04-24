# Flag Backlog — candidate units from the course blueprint walk

Generated 2026-04-21 by clustering the 141 `missing_units_flagged` entries in `references/authored/course-target-exercises.json` (49 target exercises).

Each candidate below is a distinct unit that should be minted. Citation count = how many target exercises flag it (higher = more foundational; worth minting first). Flags that explicitly call out an overlap with another exercise are merged into one candidate.

**Totals:** 141 flags → ~95 distinct candidates. ~40 repeat ≥ 2× (dedup win).

Legend: `A` = A-domain math primitive · `L` = L-domain arbeidsmarkt · `C` = concept/understand-tier · `G` = grafisch · `V` = verbal/standpuntbepaling.

---

## Top hubs (cited by ≥3 target exercises)

| Cat | Candidate | Cites | Exercises |
|---|---|---:|---|
| G | Shade a labelled region on a P–Q diagram (generic: CS / PS / DWL / Harberger / subsidy-cost / profit-rectangle / tariff DWL) | 7 | 1.3.3, 2.2.1, 2.3.2, 2.3.3, 3.2.3, 3.3.1, 4.3.3 |
| A | Compute percentage change with (new−old)/old × 100 (+ CPI variant) | 3 | 1.1.2, 4.4.1, 4.4.1-distinct |
| C | Distinguish index-point change vs percentage change | 2 | 1.1.2, 4.4.1 |
| C | Distinguish movement-along vs shift-of the demand/supply curve | 2 | 1.2.2, 1.3.1 |
| C | Name + exemplify demand-/supply-shift factors | 2 | 1.2.2, 1.3.1 |
| A | Compute and interpret price index / CPI | 2 | 1.1.2, 4.4.1 |
| A | Graphical before/after comparison with shift arrows | 2 | 1.2.2, 1.4.2 |
| C | Binding-constraint condition for a price control (min ≥ eq, max ≤ eq) | 2 | 2.4.1, 2.4.2 |
| C | External-cost / external-benefit overproduction/underproduction gap | 2 | 3.4.1, 3.4.2 |
| C | Distinguish MPC/MSC (negative externality) and MPB/MSB (positive externality) mirror pair | 2 | 3.4.1, 3.4.2 |
| C | Derive the after-tax / after-subsidy supply function by adding / subtracting the per-unit amount | 2 | 2.3.1, 2.3.3 |
| C | Size a Pigouvian tax = external cost / subsidy = external benefit (correction-to-social-optimum) | 2 | 3.4.2, 3.4.3 |
| L | Execute labor-market surplus analysis by transfer of goods-market framework | 2 | 4.1.3, 4.2.2 |

---

## L-domain (arbeidsmarkt) — ~19 candidates

Proposed mints for the new `L` prefix. Procedure-worthy items marked `(apply+)`.

| ID candidate | Candidate unit | Cites | mastery_target | exam_codes |
|---|---|---:|---|---|
| L01 | Compute VMP = MP × output-price from a marginal-product table *(apply+)* | 1 | apply | — |
| L02 | Apply hiring rule: hire while VMP ≥ W, stop when VMP < W *(apply+)* | 1 | apply | — |
| L03 | Explain "derived demand": labor demanded because of product-market demand | 1 | understand | — |
| L04 | Draw labor demand curve from a VMP table | 1 | apply | — |
| L05 | Define beroepsbevolking / niet-beroepsbevolking / werkloze beroepsbevolking | 1 | understand | — |
| L06 | Compute bruto participatiegraad = beroepsbevolking / pop(15–75) × 100 *(apply+)* | 1 | apply | — |
| L07 | Compute werkloosheidspercentage = werklozen / beroepsbevolking × 100 (denominator trap) *(apply+)* | 1 | apply | — |
| L08 | Explain how wage changes shift participatiegraad via niet-beroepsbevolking entering | 1 | understand | — |
| L09 | Define krappe arbeidsmarkt (Qd>Qs) vs ruime arbeidsmarkt (Qs>Qd) and predict wage direction | 1 | understand | — |
| L10 | Transfer the goods-market equilibrium framework to the labor market (W↔P) *(apply+)* | 2 | apply | A2.10,A2.12,A2.15 |
| L11 | Define conjuncturele werkloosheid (demand shortfall during recession) | 1 | understand | — |
| L12 | Define structurele werkloosheid (skills / sector mismatch, automation) | 1 | understand | — |
| L13 | Define frictiewerkloosheid (short-term between-jobs search; why it is healthy) | 1 | understand | — |
| L14 | Classify a real-world unemployment case into the correct type *(apply+)* | 1 | apply | — |
| L15 | Match policy instrument (fiscal stimulus / retraining / active-labor) to unemployment type | 1 | understand | — |
| L16 | Compute werknemerssurplus (labor-market CS) and werkgeverssurplus (labor-market PS) *(apply+)* | 1 | apply | A2.16, D3.10, H5.2 |
| L17 | Define CAO as an industry-wide collective wage agreement; why it acts as a binding minimum price | 1 | understand | — |
| L18 | Enumerate advantages and disadvantages of unions (for workers / firms / society) | 1 | understand | — |
| L19 | Define loonstarheid; explain loonstarheid → persistent unemployment mechanism | 1 | understand | — |
| L20 | Compare wage-flexibility policy vs active-labor-market policy (mechanism + effectiveness) | 1 | analyze | — |
| L21 | Structure a balanced standpuntbepaling for minimum-wage policy (winners vs losers) | 1 | evaluate | — |

**Scope:** 21 units. Covers §4.1.1 (labor demand) + §4.1.2 (vocab+calc) + §4.1.3 (equilibrium) + §4.2.1 (unemployment types) + §4.2.2 (min wage welfare) + §4.2.3 (CAO/unions/loonstarheid).

---

## A-domain primitives — ~28 candidates

Sorted by citations. Most cite once (each paragraph is a distinct specific move), but the percentage/index family and the graphical-shading skill are clear hubs.

| Candidate | Cites | Where | mastery_target |
|---|---:|---|---|
| Shade a labelled region on a P–Q diagram (generic across CS/PS/DWL/profit/tariff) | 7 | broad | apply |
| Compute percentage change (new−old)/old × 100 | 3 | 1.1.2, 4.4.1 | apply |
| Compute and interpret price index / CPI | 2 | 1.1.2, 4.4.1 | apply |
| Graphical before/after shift with arrows | 2 | 1.2.2, 1.4.2 | apply |
| Derive after-tax / after-subsidy supply (per-unit shift) | 2 | 2.3.1, 2.3.3 | apply |
| Draw (P,Q) graph from table with economist axes | 1 | 1.1.3 | apply |
| Read values / interpolate from a (P,Q) graph | 1 | 1.1.3 | apply |
| Compute total profit from a mixed-allocation choice | 1 | 1.1.1 | apply |
| Construct step-function demand curve from WTP schedule | 1 | 1.2.1 | apply |
| Apply 'buy if P ≤ betalingsbereidheid' decision rule | 1 | 1.2.1 | apply |
| Horizontal sum: aggregate individual demand tables | 1 | 1.2.3 | apply |
| Algebraic horizontal sum of linear demand functions | 1 | 1.2.3 | apply |
| Draw upward-sloping supply curve with economist axes | 1 | 1.3.1 | apply |
| Compute GVK = TVK/Q and GCK = TCK/Q (split from A14 GTK) | 1 | 1.3.2 | apply |
| Observe GO = P at constant price (single-step recognition) | 1 | 1.3.3 | understand |
| Determine surplus vs shortage at non-eq price | 1 | 1.4.1 | apply |
| Compute MK / MO from a table by differences (pre-calculus) | 1 | 1.4.3 | apply |
| Verify profit optimum at Q−1, Q, Q+1 (habit-building) | 1 | 1.4.4 | apply |
| Approximate MK = 2bQ for TK = a + bQ² without calculus | 1 | 1.4.4 | apply |
| Apply the power rule on aQ² + bQ + c → 2aQ + b | 1 | 3.1.2 | apply |
| Herleid GTK = TK/Q term-by-term (500/Q skill) | 1 | 3.1.3 | apply |
| Build TO = P×Q from a linear P(Q) and expand | 1 | 3.2.2 | apply |
| Compute Harberger triangle = competitive TS − monopoly TS | 1 | 3.3.1 | apply |
| Construct competitive benchmark by imposing P = MK | 1 | 3.3.1 | apply |
| Compute tax revenue rectangle (tax × Qt) | 1 | 2.3.2 | apply |
| Compute afwentelingspercentage = (Pc − P*)/tax × 100 | 1 | 2.3.2 | apply |
| Compute subsidy expenditure = subsidy × Q_new | 1 | 2.3.3 | apply |
| Compute government cost of buying aanbodoverschot | 1 | 2.4.2 | apply |
| Invert demand to read P from a given quota Q | 1 | 2.4.3 | apply |
| Compute imports = domestic Qd − Qa at world price | 1 | 4.3.3 | apply |
| Pre-trade vs post-specialisation production; world-output gain | 1 | 4.3.2 | apply |
| Compute real GDP growth from nominal + GDP deflator | 1 | 4.4.3 | apply |
| Compute real wage = nominal / CPI × 100 | 1 | 4.4.1 | apply |
| Compute real interest rate ≈ nominal − inflation | 1 | 4.4.3 | apply |
| Predict Qd from elasticity × %-change driver | 1 | 2.1.3 | apply |
| Read multi-variable demand function; evaluate at a point (ceteris paribus) | 1 | 2.1.3 | apply |
| Compute pension under each indexering regime + purchasing-power loss | 1 | 4.4.2 | apply |
| Apply MO=MK procedure twice for price discrimination | 1 | 3.3.2 | apply |

---

## Concept-level (understand-tier) — ~42 candidates

Flags that are verbal insights, definitions, or "recognise that X holds" moves rather than mechanical calculations.

Highest-cited concept hubs first, then the rest grouped by topic area.

| Candidate | Cites | Where |
|---|---:|---|
| Distinguish movement-along vs shift-of the demand/supply curve | 2 | 1.2.2, 1.3.1 |
| Distinguish index-point change vs percentage change (classic exam trap) | 2 | 1.1.2, 4.4.1 |
| Binding-price-constraint condition (min above eq / max below eq) | 2 | 2.4.1, 2.4.2 |
| MPC vs MSC and MPB vs MSB (externality-gap mirror pair) | 2 | 3.4.1, 3.4.2 |
| Over-/Under-production gap = Q_market vs Q_social | 2 | 3.4.1, 3.4.2 |
| Name + exemplify demand-shift factors (inkomen, voorkeuren, subs, comp, expect) | 1 | 1.2.2 |
| Name + exemplify supply-shift factors (input-prijzen, tech, n-aanbieders, expect, beleid) | 1 | 1.3.1 |
| Classify normal vs inferior, luxury vs necessity from Ei | 1 | 2.1.3 |
| Classify elastic vs inelastic from \|Ev\| vs 1 | 1 | 2.1.1 |
| Ev↔omzet-direction rule | 1 | 2.1.2 |
| Why substitute-rich / luxury goods are more elastic | 1 | 2.1.1 |
| Ceteris paribus with multi-variable demand function | 1 | 2.1.3 |
| Supply curve = MC curve (dual interpretation) | 1 | 2.2.2 |
| TS = CS + PS; TS max at competitive equilibrium | 1 | 2.2.2 |
| Pareto-efficiency verbal definition | 1 | 2.2.3 |
| Short-side rule at forced price (min(Qd,Qs)) | 1 | 2.2.3 |
| Tax wedge = Pc − Pp; distinguish consumer vs producer price | 1 | 2.3.1 |
| Surplus-accounting identity: old TS = new CS + new PS + tax rev + DWL | 1 | 2.3.2 |
| Subsidies cause DWL via overproduction beyond Pareto-efficient Q | 1 | 2.3.3 |
| Four characteristics of volkomen concurrentie | 1 | 3.1.1 |
| Hoeveelheidsaanpasser / price taker: why individual firm faces horizontal D | 1 | 3.1.1 |
| P = GO = MO for price taker (horizontal price line) | 1 | 3.1.1 |
| Long-run zero-profit via entry erosion | 1 | 3.1.3 |
| Long-run equilibrium geometric condition: P = min GTK = MK | 1 | 3.1.3 |
| Causes of monopoly (legal, natural, patent) with examples | 1 | 3.2.1 |
| Prijszetter vs hoeveelheidsaanpasser; firm-level D slope | 1 | 3.2.1 |
| Judge real-world market-power claim against 4 characteristics | 1 | 3.2.1 |
| Why MO < P for monopolist (price-cut-on-all-units argument) | 1 | 3.2.2 |
| MO slope is 2× demand slope (linear case) | 1 | 3.2.2 |
| Why charging above P* reduces profit — demand constraint | 1 | 3.2.3 |
| Characterise monopolistische concurrentie | 1 | 3.3.3 |
| Characterise oligopolie | 1 | 3.3.3 |
| Classify real-world market into one of the four structures | 1 | 3.3.3 |
| Collusion incentive + why cartels are illegal + unstable | 1 | 3.3.3 |
| Three conditions for price discrimination (separable, no resale, diff elasticities) | 1 | 3.3.2 |
| Surplus transfer (CS→PS) vs surplus destruction (DWL) | 1 | 3.3.1 |
| Why producers may prefer a quota (income certainty) | 1 | 2.4.3 |
| Coase theorem condition (low transaction costs, clear property rights) | 1 | 3.4.3 |
| Patent trade-off (innovation incentive vs monopoly welfare loss) | 1 | 3.4.3 |
| Enumerate policy instruments for negative externalities | 1 | 3.4.3 |
| Horizontal sum kink when consumer exits market | 1 | 1.2.3 |
| Simultaneous supply+demand shifts: determinate Q, ambiguous P | 1 | 1.4.2 |
| Critically interpret percentage-claim vs tabular data | 1 | 1.1.3 |
| Compare winst with vs without price discrimination | 1 | 3.3.2 |
| GCK falls as Q rises (spreading fixed costs) | 1 | 1.3.2 |
| MK constant for linear TK vs increasing for quadratic TK | 1 | 1.4.3 |
| MO = P when price constant (concept recognition) | 1 | 1.4.3 |
| Law of demand verbal explanation | 1 | 1.2.1 |
| Betalingsbereidheid = max price consumer pays for next unit | 1 | 1.2.1 |
| Define scarcity as the core economic problem | 1 | 1.1.1 |
| Identify opportunity cost / alternatieve kosten | 1 | 1.1.1 |
| Absolute vs comparative advantage (CA drives trade, not AA) | 1 | 4.3.1 |
| Refute "better at everything → no trade" misconception | 1 | 4.3.1 |
| Terms-of-trade mutual-benefit range between two opp costs | 1 | 4.3.2 |
| Two DWL triangles under tariff (production + consumption) | 1 | 4.3.3 |
| Waardevast vs welvaartsvast vs bevroren indexering vocab | 1 | 4.4.2 |
| Deflation purchasing-power logic (reversed-sign case) | 1 | 4.4.2 |
| Why central banks target ~2% inflation (integration question) | 1 | 4.4.3 |
| Why economists prefer real over nominal values | 1 | 4.4.1 |

---

## Verbal / standpuntbepaling — ~4 candidates

| Candidate | Cites | Where |
|---|---:|---|
| Structure a beoordeel-answer: winners vs losers under a price control | 1 | 2.4.1 |
| Distributional effect: who gains / who pays under min price | 1 | 2.4.2 |
| Evaluate "tariffs protect domestic jobs" using surplus accounting | 1 | 4.3.3 |
| Evaluate pensioner-vs-fund trade-off across indexering regimes | 1 | 4.4.2 |

---

## Summary

- **~95 distinct candidate units** from 141 flags (dedup ratio 0.67).
- **L-domain: 21 units** — the tightest, most coherent minting scope.
- **A-domain: 38 units** — mostly 1-off, but the graphical-shading skill and percentage/index family are hubs.
- **Concept-level: 58 units** — biggest category (matches the 48% pattern from the walk analysis).
- **Verbal: 4 units** — small; mostly covered by concept-level entries.

**Recommended minting order:**
1. **L-domain first** (21 units, single-commit coherence, scope-of-attention visibility).
2. **Top hubs** (graphical-shading, percentage/index, movement-vs-shift, externality mirrors) — each unlocks many target exercises at once.
3. **Rest of A-primitives** (one-offs; mint as paragraph builds touch them).
4. **Concept-level** (one-offs; mint alongside the apply-tier unit they scaffold).

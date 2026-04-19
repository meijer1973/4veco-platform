# Plan: Graph & Dual-Coding Enhancement for Module 3, Chapter 3.3 (§ 3.3.1–3.3.4)

## Context

The 4veco-platform dual-coding principle (AGENTS.md + BUILD-PARAGRAPH.md line 11) is *non-negotiable*: **every concept pairs text with a visual**. Source data for Chapter 3.3 exists (CSV reasoning + skilltree configs), but:

- No `_assets/` or SVG graphs exist for any 3.3.x paragraph in this repo
- No `m3-33x-*.js` build scripts exist (compare: `m1-11x-*`, `pptx-32x-*`, `*-351-*` families all exist)
- The built textbook paragraphs live in an external module repo ("3. Module 3 – Markt en overheid") not mounted here

Goal: plan a **platform-side enhancement** that (a) adds the graph specs and build scripts here so the next build produces graph-rich paragraphs, and (b) treats all four §3.3.x paragraphs equally. 3.3.4 is a consolidation (label = "Toepassen") and follows `econ-consolidation-builder` (no paragraaf.md, only opgaven + antwoorden with bron-materialen).

## Guiding principles (from `skills/econ-didactiek.md`, `economic-graph.md`, `references/economic_mathematical_precision_reference.md`)

- **One concept = one visual.** Every theory sub-section of a paragraph gets at least one SVG. Target: ≥ 1 `fig_N` per theory H3, plus `we_1` for the worked example, plus `ex_N` for exercises that reason over a diagram.
- **Consistent color coding per domain.** Reuse the 3.2.x palette: market = blue, external-effect wedge = amber, welfare loss = red-hatched, government instrument = green.
- **Triple-coupling: text ↔ formula ↔ graph** (precision-ref §9). Numbers in the diagram must match numbers in the worked example exactly.
- **Canvas:** 720×360 SVG per `economic-graph.md` §PART 1, with labels outside plot area.
- **File naming:** `X.Y.Z_{type}_{number}.{svg|png}` where type ∈ {fig, we, ex} per BUILD-PARAGRAPH A3.

## Concrete graph inventory per paragraph

Each item below cites the CSV row it visualises (see `source-data/module-3/reasoning/3.3.{1..4}.csv`).

### § 3.3.1 "De rol van de overheid" — 8 figs + 1 we

| ID | Type | Topic | Source row |
|----|------|-------|------------|
| `3.3.1_fig_1` | S&D with MPC vs MSC, DWL-triangle, Q_markt > Q_opt | negatief extern effect (Rijn-fabrieken) | row 1 |
| `3.3.1_fig_2` | S&D with MPB vs MSB, Q_markt < Q_opt | positief extern effect (tuin) | row 2 |
| `3.3.1_fig_3` | Natuurlijk monopolie: GTK dalend, MO < MK, p=GK vs p=GTK regulering | row 3 |
| `3.3.1_fig_4` | Minimumprijs boven evenwicht → aanbodoverschot | row 4 (melk) |
| `3.3.1_fig_5` | Lorenz-curve + Gini-oppervlakte (A/(A+B)) | row 8 |
| `3.3.1_fig_6` | Equity–efficiency trade-off curve | row 9 |
| `3.3.1_fig_7` | Infographic: drie overheidsfuncties (allocatie/herverdeling/stabilisatie) met voorbeelden | rows 10–12 |
| `3.3.1_fig_8` | Flowchart: marktfalen → type → instrument (beslisboom) | overarching |
| `3.3.1_we_1` | Worked-example visual met exacte getallen | — |

### § 3.3.2 "Overheidsbeleid" — 9 figs + 1 we

| ID | Topic | Source row |
|----|-------|------------|
| `3.3.2_fig_1` | Belastingwig: p_c / p_p, DWL-driehoek, belastingopbrengst-rechthoek | row 1 (Qv=100−2p, Qa=3p−50, t=10) |
| `3.3.2_fig_2` | Incidentie-diagram: elastisch vs inelastisch aanbod | row 2 |
| `3.3.2_fig_3` | Twee panelen: DWL bij elastische vs inelastische vraag | row 3 |
| `3.3.2_fig_4` | Subsidie: S' rechts, p_c↓, p_p↑, DWL-driehoek | row 4 |
| `3.3.2_fig_5` | Belasting ↔ subsidie side-by-side | row 6 |
| `3.3.2_fig_6` | Maximumprijs + tekort + wachtlijst-annotatie | row 7 (huur) |
| `3.3.2_fig_7` | Minimumprijs + overschot + opkoopkosten-rechthoek | row 8 (tarwe) |
| `3.3.2_fig_8` | Pigouviaanse belasting (MPC→MSC) met t=MEC | row 10 |
| `3.3.2_fig_9` | Belasting vs ETS: prijs-fixatie vs hoeveelheids-fixatie schema | row 12 |
| `3.3.2_we_1` | Worked-example: volledige belastingberekening met diagram | — |

### § 3.3.3 "Collectieve goederen" — 7 figs + 1 we

| ID | Topic | Source row |
|----|-------|------------|
| `3.3.3_fig_1` | **Core matrix**: 2×2 rivaliteit × uitsluitbaarheid met 4 voorbeelden per kwadrant | row 3 |
| `3.3.3_fig_2` | Zuiver vs quasi-collectief: congestie-grens op snelweg | row 2 |
| `3.3.3_fig_3` | Free-rider flow-infographic (cause → reasoning → effect) | row 4 |
| `3.3.3_fig_4` | Tragedy of the commons: visvoorraad-uitputting over tijd | row 6 |
| `3.3.3_fig_5` | Merit good: MSB > MPB + subsidie-correctie | row 7 (onderwijs) |
| `3.3.3_fig_6` | Demerit good: accijns verschuift MSC, Q daalt | row 8 (tabak) |
| `3.3.3_fig_7` | Beslisboom overheid-vs-markt | row 10 |
| `3.3.3_we_1` | Worked example (classificatie-flow) | — |

### § 3.3.4 "Toepassen" (consolidation — no paragraaf.md) — 6 ex-figs

| ID | Topic | Source row |
|----|-------|------------|
| `3.3.4_ex_1` | CO2-belasting: MPC→MSC + Pigou-wig | row 1 |
| `3.3.4_ex_2` | Stikstofbeleid infographic: marktfalen + instrumentenmix | row 10 |
| `3.3.4_ex_3` | Minimumloon op arbeidsmarkt: overschot arbeid | row 11 |
| `3.3.4_ex_4` | Samenvatting-tabel: marktfalen-typen × instrumenten | row 12 |
| `3.3.4_ex_5` | Bron: dijk-financiering via waterschapsbelasting | row 7 |
| `3.3.4_ex_6` | Internet = clubgoed: matrix-positionering | row 9 |

## Dual-coding patterns to apply (beyond raw graph count)

These are structural additions to each paragraaf.md, applied uniformly:

1. **Concept-visual pairs** — every H3 opens with text-left / SVG-right (or callout box with icon) so the student never reads theory without a paired visual. Follows `econ-didactiek.md` §Dual Coding and `economic-graph.md` §PART 1.
2. **Denkstappen boxes** — reuse the flow_1..flow_6 cause→reasoning→effect sequences already encoded in every CSV row as rendered step-blocks with arrows.
3. **Misconception callouts** — the `distractor_*` columns in the CSV become visual "let op"-boxes paired with the correct-concept figure, so the contrast is visible rather than textual.
4. **Summary schema** — end-of-paragraph visual table of concepts × instruments (mirrors 3.3.4_ex_4 but per-paragraph), using `econ-word-templates` summary-schema component.

## Files to create / modify

**Source-side (this repo, build-inputs):**
- `build-scripts/m3-331-build-assets.js` — generates `3.3.1_fig_{1..8}` + `we_1` SVGs (model: `m1-112-build-assets.js`)
- `build-scripts/m3-332-build-assets.js` — same for § 3.3.2
- `build-scripts/m3-333-build-assets.js` — same for § 3.3.3
- `build-scripts/m3-334-build-assets.js` — ex-figs only for § 3.3.4
- `build-scripts/m3-33{1,2,3,4}-paragraaf.js` — theory markdown generator embedding the assets (model: `m1-11x` family is pptx/docx; theory-md generator pattern lives in `econ-textbook-paragraph.md`)
- `build-scripts/m3-33{1,2,3,4}-presentatie.js` — pptx reusing the same SVGs (model: `pptx-326-doelmatigheid.js`)
- `build-scripts/m3-33{1,2,3,4}-vaardigheden.js` / `-voorkennis.js` / `-inoefening.js` / `-opgaven.js` / `-samenvatting.js` / `-nieuws.js` — full Part-B family (model: `m1-113-*.js` set; cf. BUILD-PARAGRAPH.md §B1 table rows 3–23)

**Reference skills consulted (read-only):**
- `skills/economic-graph.md` — canvas, labelling, surplus-area, tax/subsidy shift specs
- `skills/econ-textbook-paragraph.md` — paragraaf.md skeleton
- `skills/econ-consolidation-builder.md` — 3.3.4 (consolidation) skeleton
- `skills/econ-didactiek.md` — dual coding, fading, misconception handling
- `skills/econ-pptx-templates.md` + `skills/econ-word-templates.md` — reusable dual-coded components
- `references/economic_mathematical_precision_reference.md` §9 — non-negotiable graph-precision rules
- `references/economie-terminologie.md` — canonical Dutch terms (MPC / MSC, DWL, Gini, accijns, etc.)

**Reference existing scripts to mirror:**
- `build-scripts/m1-112-build-assets.js` — asset-generator pattern
- `build-scripts/pptx-326-doelmatigheid.js` — S&D+welfare pptx pattern
- `build-scripts/pptx-323-monopolie.js` — monopoly / MO-MK pattern (reuse for 3.3.1_fig_3 nat. monopoly)
- `build-scripts/inoefening-351-afsluiting.js` — scaffolded-oefening pattern with embedded graphs
- `build-scripts/samenvatting-351-352-rebuild.js` — per-paragraph visual summary

## Deliverables order of execution

1. Build SVG assets (Part A3) for all four paragraphs — enables every downstream file to embed them (BUILD-PARAGRAPH.md line 112: "Part B builders embed Part A's `_assets/` rather than generating new").
2. Write / update `paragraaf.md` for 3.3.1–3.3.3 with a figure reference per H3 and a misconception-callout per distractor-cluster.
3. Write `opgaven.md` + `antwoorden.md` for 3.3.1–3.3.4 that embed ex-figs where CSV rows contain a flow or a graph-reasoning step.
4. Regenerate PDFs (A4) and run the A5 asset-completeness gate.
5. Independent QC: spawn an `econ-paragraph-review` sub-agent (not the builder) per A6; fix FAILs.
6. Generate quality-ref YAMLs per A7.
7. For 3.3.4: use `econ-consolidation-builder` template (no theory file).

## Verification

- **Asset gate** (BUILD-PARAGRAPH A5): every `![...](...)` in *.md resolves to a file in `_assets/`; every .svg has a matching .png; naming matches `3.3.{1..4}_{fig|we|ex}_{N}.{svg|png}`.
- **Graph-count floor:** ≥ 8 assets for § 3.3.1, ≥ 10 for § 3.3.2, ≥ 8 for § 3.3.3, ≥ 6 for § 3.3.4.
- **Dual-coding audit:** every H3 in each `paragraaf.md` has at least one image reference in its body (grep `^### ` vs `!\[`).
- **Independent review:** `3.3.{1..4}-review.md` produced by a separate sub-agent per A6 — must report Pass-1 (didactic) and Pass-2 (mathematical) with zero FAILs on dual-coding coverage.
- **Quality-ref:** `3.3.{1..4}-quality-ref.yaml` lists existing components and flags gaps honestly.
- **Visual smoke test:** open the generated PDFs; confirm each graph renders inside the 720×360 viewport with labels outside the plot area (no clipping per `economic-graph.md`).
- **Cross-paragraph consistency:** same palette + same axis-label conventions across all four paragraphs; diff the SVG `<style>` blocks.

## Explicit non-goals

- No edits to the external module repo — only platform-side source, scripts, and skills.
- No changes to CSV reasoning content or skilltree JS (those are the accepted input contract).
- No new skills; reuse existing ones.

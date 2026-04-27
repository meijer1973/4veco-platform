# GATE-R5.3 Alignment Graph Review Packet

Sprint: R5.3
Gate: GATE-R5.3-alignment-graph
Prepared: 2026-04-27

## Purpose

Review the R5.2 draft alignment graph before it powers retrieval, diagnostics, dashboards, or adaptive decisions.

The graph is mechanically valid, but not yet pedagogically authoritative.

## Initial Graph State At Review Prep

- Source graph: `references/data/alignment-graph.json`
- Evidence source: `references/data/evidence-anchors.json`
- Integrity report: `reports/alignment-graph-integrity.md`
- Total edges: 31
- Pending main alignment edges: 13
- Traceability `derived_from` edges: 18
- Human-approved edges: 0
- Graph status: `draft_pending_r5_3_review`

## Post-Decision Graph Repair

The human decision record required a schema/status repair before closure:

- `D16 -> D34` was added as a reviewed graph edge, because `D16 -> L10` was explicitly judged incomplete without binding minimum-price logic.
- Review statuses were changed to the gate-approved vocabulary: `approved`, `approved_with_conditions`, `diagnostic_only`, `pending_review`, `rejected`, and `deprecated_design_issue`.
- The graph now has 34 edges and is closed as `gate_passed_with_conditions`.

## Review Standard

Approve graph use only if the reviewer is comfortable that later internal systems may use the approved subset as alignment signal.

Approval does not mean every later product is automatically correct. It means the graph edge is a valid internal relationship to use as signal, with evidence attached.

## Main Edges For Review

### Governance And Policy

- `policy:evidence-layer -> policy:source-ranking`
  - relation: `supports`
  - evidence: `EV-R5.1-SOURCE-RANK-POLICY`
  - review question: May the source-ranking policy be used as graph governance signal?

### Elasticity Prerequisite Edges

- `unit:A15 Prijselasticiteit van de vraag -> unit:A38 Procentuele verandering berekenen`
  - relation: `prerequisite`
  - evidence: `EV-A15-A38-TARGET`, `EV-A15-A38-MACHINE`
  - review question: Is percentage-change fluency a valid prerequisite for price elasticity?

- `unit:A16 Kruiselasticiteit -> unit:A15 Prijselasticiteit van de vraag`
  - relation: `prerequisite`
  - evidence: `EV-A16-A17-A15-TARGET`, `EV-A16-A17-A15-HUMAN`
  - review question: Is A15 acceptable as the shared elasticity prerequisite for cross elasticity?

- `unit:A17 Inkomenselasticiteit -> unit:A15 Prijselasticiteit van de vraag`
  - relation: `prerequisite`
  - evidence: `EV-A16-A17-A15-TARGET`, `EV-A16-A17-A15-HUMAN`
  - review question: Is A15 acceptable as the shared elasticity prerequisite for income elasticity?

- `unit:D06 Vraagreactie via prijselasticiteit interpreteren -> unit:A15 Prijselasticiteit van de vraag`
  - relation: `prerequisite`
  - evidence: `EV-D06-A15-EXAM`
  - review question: Is A15 required before interpreting demand reaction through price elasticity?

### D04 Design Edge

- `unit:D04 Elasticiteit en goederenclassificatie -> decision:retire-merge-or-redistribute`
  - relation: `supports`
  - evidence: `EV-D04-DESIGN-TARGET`
  - review question: May the graph carry D04 as a unit-design decision rather than a prerequisite edge?

### Labor-Market And Macro Edges

- `unit:L09 Krappe/ruime arbeidsmarkt -> unit:L05 Beroepsbevolking en arbeidsaanbod`
  - relation: `prerequisite`
  - evidence: `EV-L09-L05-TARGET`
  - review question: Is L05 the minimal prerequisite for tight/slack labor-market reasoning?

- `unit:D16 Minimumloon -> unit:L10 Arbeidsmarktevenwicht`
  - relation: `prerequisite`
  - evidence: `EV-D16-L10-TARGET`, `EV-D16-EXAM`
  - review question: Does minimum-wage reasoning require labor-market equilibrium?

- `unit:I04 Loonstarheid in conjunctuurmodel -> unit:L19 Loonstarheid`
  - relation: `prerequisite`
  - evidence: `EV-I04-I10-L19-TARGET`
  - review question: Is L19 the right prerequisite for I04 wage-rigidity macro reasoning?

- `unit:I10 GA-curve met loonstarheid -> unit:L19 Loonstarheid`
  - relation: `prerequisite`
  - evidence: `EV-I04-I10-L19-TARGET`
  - review question: Is L19 the right prerequisite for I10 GA-curve wage-rigidity reasoning?

- `unit:H14 Multiplier met lekkages -> unit:I14 Multiplier en lekkages`
  - relation: `prerequisite`
  - evidence: `EV-H14-I14-MACHINE`, `EV-H14-I14-EXAM`
  - review question: Is I14 required for H14 multiplier-with-leakages reasoning?

### Diagnostic And Term Edges

- `source:references/external/exam-questions.json -> issue:required-skill-and-exam-code-gap-queue`
  - relation: `assesses`
  - evidence: `EV-R4.2-EXAM-GAP-QUEUE`
  - review question: May this diagnostic edge remain in the graph as an internal quality signal, without becoming content authority?

- `term:prijselasticiteit-van-de-vraag -> registry:begrippen`
  - relation: `explains`
  - evidence: `EV-TERM-PRICE-ELASTICITY-MACHINE`
  - review question: May term-registry definition links appear in the alignment graph?

## Proposed Interview Shape

The interview should not approve all edges blindly.

Suggested sequence:

1. Confirm whether the graph may be approved as a whole, approved in subsets, held, or rejected.
2. Review elasticity prerequisite edges.
3. Review D04 design edge.
4. Review labor-market and macro edges.
5. Review diagnostic and term edges.
6. Confirm what downstream uses are allowed before R6/R7/R10.

## Review Findings Added Before Interview

Data integrity review found no mechanical blockers for human review.

Evidence review recommends a conservative gate posture:

- strongest edges: `D06 -> A15`, `H14 -> I14`, `A15 -> A38`
- medium or careful-review edges: `L09 -> L05`, `D16 -> L10`, `I04/I10 -> L19`
- diagnostic edge must remain diagnostic, not authority

Pedagogy review highlights four human decisions:

- keep D04 held unless the lifecycle decision is explicitly closed
- decide whether macro wage rigidity can depend on `L19`
- decide whether `D16 -> L10` is incomplete without also representing `D16 -> D34`
- decide whether `A16/A17 -> A15` is acceptable or only a temporary route before a shared elasticity foundation

## Possible Gate Outcomes

- `pass`: all current main edges may become approved alignment signal.
- `pass_with_conditions`: only named edge groups may become approved, or use is restricted to internal dashboards/review.
- `hold`: graph remains draft pending further evidence or edge review.
- `fail`: graph is rejected and must be rebuilt.

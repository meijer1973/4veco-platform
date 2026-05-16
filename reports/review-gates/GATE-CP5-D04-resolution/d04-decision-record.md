# CP-5 D04 Decision Record

Sprint: S9
Gate: GATE-CP5-D04-resolution
Status: s9a_cli_mutation_completed

## Recommended Decision

- Subject: D04 Elasticiteit en goederenclassificatie
- Recommended resolution: redistribute_content_to_successor_units_then_retire_standalone_unit
- Promotion blocked: true
- Protected reference mutation authorized: false

## Evidence

- human_gate_decision: `reports/review-gates/GATE-R2-empty-needs/human-interview.md` (Question 5: D04 Elasticity And Goods Classification) - Human reviewer said there is no need for a separate D04 unit; classifications should sit inside the relevant elasticity units.
- unit_design_packet: `reports/review-gates/GATE-R2-empty-needs/R2.4-evidence-unit-design-packet.json` (edge-D04-needs-A15 and unit_design_decisions[D04]) - D04 is unit_design_required, not a D04 to A15 prerequisite-edge correction.
- gate_closure: `reports/review-gates/GATE-R5-alignment-graph/gate-closure.json` (conditions_to_reopen_or_pass) - D04 must be represented as a unit-design issue, not as a simple prerequisite edge.
- quality_issue: `reports/json/reference-quality-issues.json` (R8-QC-007) - D04 requires a decision record, dependent-unit audit, and VWO economics review outcome before C-to-B promotion depends on it.
- target_exercise: `references/authored/course-target-exercises.json` (2.1.3 Income elasticity and cross elasticity) - Owned target exercise evidence historically grouped D04 with income and cross elasticity work rather than as a standalone exercise target; S9a removes the active D04 citation after successor coverage is verified.
- exam_question: `references/external/exam-questions.json` (ha-1022-a-25-2-o opgave 2 question 8) - Exam extraction currently cites D04 for a goods-classification question tied to D1.7/D1.8.

## Non-Decisions

- No D04 prerequisite edge is approved.
- No machine-unit mutation is authorized in S9.
- Later CLI-only mutation needs a separate sprint after CP-5 closure.

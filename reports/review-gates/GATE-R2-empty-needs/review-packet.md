# GATE-R2 Empty-Needs Review Packet

Generated: 2026-04-26T07:14:05.130Z
Sprint: R2.2
Audit source: `references/data/audits/empty-needs-audit.json`

## Audit Summary

- Live units: 190
- Empty-needs units: 61
- False-zero machine suggestions: 17
- Ambiguous machine suggestions: 35
- High-severity machine suggestions: 7

## Human Review Required

R2.3 must decide whether the empty-needs gate is:

- `pass`
- `pass_with_conditions`
- `hold`
- `fail`

No dependency corrections may be applied until the human review closes or conditions this gate.

## Priority Human Questions

1. Should known false-zero candidates be accepted as dependency corrections, rejected, or held for stronger evidence?
2. Should foundational A-domain math units be classified as `underbouw_assumed` rather than given internal platform prerequisites?
3. Which ambiguous applied non-A units require a second pedagogical pass before any graph work depends on them?

## subagent-pedagogy

Source: `reports/review-gates/GATE-R2-empty-needs/subagent-pedagogy.json`

### Findings

- A16 and A17 are likely false_zero; they need at least percentage-change skill A38, while A15 only works if it is intended as the generic elasticity template.
- D04 is likely false_zero, but the machine recommendation A15 is probably wrong because D04 is about inkomenselasticiteit; A17 or D11 is a better review candidate.
- D06 -> A15 is pedagogically plausible because D06 interprets prijselasticiteit.
- A18 may be a missed false_zero and should be reviewed for dependency on B02 Alternatieve kosten.
- D10, D13, and D32 are likely false_zero, but the machine suggestions D01/D03 are pedagogically suspect because they are downstream or specialized accijns/surplus units.
- H13 -> D13 and H14 -> I14 are plausible; H14 is especially strong because its procedure explicitly uses multiplier/lekkages.
- Labor-market sequence should be made explicit: L05/L03 -> L09 -> L19, with D16/D34/L10 sequencing reviewed carefully.
- Layer-0 A-domain units A01, A02, A03, A04, A05, and A38 are plausible underbouw_assumed.
- B01 is plausible true_zero.
- Some self-contained recognition or vocabulary units can remain zero-needs if taught as definitions rather than graph/application tasks.

### Human Questions

- Should A15 itself depend on A38, since its procedure uses percentage changes?
- Should the platform introduce a generic elasticity prerequisite instead of routing A16, A17, and D04 through A15?
- Should A18 depend on B02 Alternatieve kosten?
- For D10, D13, and D32, what is the canonical prerequisite chain for drawing and interpreting demand-supply shifts?
- Are layer inversions acceptable, especially D10 -> D01/D03, D13 -> D03, D16 -> D34, and H16 -> L10?
- Should H24 Wisselkoers en depreciatie require A38 because its procedure calculates percentage depreciation?
- Is A43 genuinely an economics prerequisite unit, or just underbouw arithmetic in a scarcity/allocation context?

### Residual Risks

- Dependency changes still require human review and CLI mutation.
- The audit covers empty needs only; hidden weak dependencies inside non-empty units remain possible.
- Machine suggestions appear keyword-driven in places and can pull in downstream or specialized units as prerequisites.
- The branch has 192 total units and 190 live units; review tooling should keep deprecated filtering explicit.

## subagent-data-integrity

Source: `reports/review-gates/GATE-R2-empty-needs/subagent-data-integrity.json`

### Findings

- Audit JSON parses and check-empty-needs-audit.js passes with 61 entries.
- Core schemas and prior-knowledge schema extension pass.
- The audit is complete for current branch state: 192 total units, 190 live units, 61 expected empty-needs entries, 61 audit entries.
- No missing, extra, duplicate, or unresolved recommended-needs references were found.
- The audit entries are a superset of prior-knowledge-review.schema; they include fields such as unit_name, layer, and mastery_target, so the raw audit entries do not validate directly against that schema with additionalProperties=false.
- The audit.sprint_id is R2.1, while the review packet is R2.2; this is acceptable as audit provenance but should be explicit.
- KNOWN_RECOMMENDATIONS is hard-coded and not derived from exam evidence, procedures, terms, or graph analysis.
- Evidence paths currently point only to micro-teaching-units.json, so recommendations lack per-unit external or exercise evidence.

### Human Questions

- Should the gate require every false_zero and ambiguous entry to become human_accepted or human_rejected before closure?
- Should accepted true_zero and underbouw_assumed entries receive explicit human rationale in zero_needs_review before the graph becomes authoritative?
- Should R2.3 require a stricter audit-entry schema, or is the current review packet enough for this gate?

### Residual Risks

- The heuristic can miss hidden A-domain prerequisites because A-domain layer<=1 is often treated as underbouw_assumed.
- Layer-0 and B01 are treated as true_zero by rule, so legitimate foundational-looking false zeros require manual discovery.
- Ambiguous results are broad: 35 of 61 entries still require judgement.
- Gate should not close while entries remain only machine_suggested.

## subagent-evidence

Source: `reports/review-gates/GATE-R2-empty-needs/subagent-evidence.json`

### Findings

- R2 work must not promote prerequisite recommendations to authoritative dependency changes before human review.
- All 61 audit entries cite only references/machine/micro-teaching-units.json as evidence_path, which is insufficient for authoritative dependency correction.
- Strong evidence candidates include D06 -> A15, D16 -> D34, H14 -> I14, I04 -> L17/L19, I10 -> L19, L09 -> L05/L03, and L17 -> D16.
- A01, A02, A03, A04, A05, and A38 can plausibly remain zero-needs or underbouw_assumed because they are basic math or graph skills.
- Medium evidence candidates include A16 -> A15, A17 -> A15, H13 -> D13, H16 -> L10, and L19 -> L09.
- Weak or suspicious machine suggestions include A43 -> A10/A38, D04 -> A15, D10 -> D01/D03, D13 -> D03, and D32 -> D01/D03.
- A18 and A42 are concerning as underbouw_assumed because the registry says prior_learning=new_this_year.

### Human Questions

- For each proposed edge, does the target unit genuinely require the prerequisite before it can be taught or assessed?
- Is the proposed prerequisite the minimal prerequisite, rather than a more advanced or more specific sibling?
- Should suspicious edges A43, D04, D10, D13, and D32 be rejected, revised, or held?
- What exact evidence should be recorded for accepted edges before CLI mutation?

### Residual Risks

- Real exam-question co-occurrence and target-exercise evidence are not yet attached to individual recommendations.
- Several recommendations are semantic rather than evidence anchored.
- Accepted edges should record exact rationale and evidence IDs before any CLI mutation.

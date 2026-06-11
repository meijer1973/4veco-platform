# INSPECT-9A Chapter 1.2 Target And Exam-Linkage Remediation

Status: source-registry remediation recorded
Date: 2026-06-11
Sprint: `INSPECT-9A`

## Scope And Safe-Use Note

This report records Dutch-only product-side source-registry remediation for Book 1 Chapter 1.2. It is not an evidence pack, generator output, inspection judgement, compliance claim, approval, certificate, OP0 completion claim, school-obligation claim, PTA-validity claim, summative-validity claim, classroom-implementation proof, or school-SKA claim.

Lesson evidence was inspected read-only from `../4veco-lessen` at commit `b858bca602bb7afdf75cad7c3ecc1a79b31fbb76`.

## Executive Decision

INSPECT-9A closes the source-registry target-finality and exam-linkage prerequisites for Chapter 1.2 only. It does not close target-equivalent proof, accessibility/support evidence, source freshness maintenance, or pack readiness.

Chapter 1.1 remains control-only and was not mutated.

## Registry Update Summary

| Paragraph | Changed fields |
|---|---|
| `1.2.1` | `exam_codes`, `record_status`, `review_evidence`, `v5_migration` |
| `1.2.2` | `exam_codes`, `record_status`, `review_evidence`, `v5_migration` |
| `1.2.3` | `exam_codes`, `record_status`, `review_evidence`, `v5_migration` |
| `1.2.4` | `difficulty_notes`, `exam_codes`, `lesson_goals`, `missing_units_flagged`, `placeholder_reason`, `prior_knowledge_assumed`, `record_status`, `required_skills`, `review_evidence`, `target_exercise`, `v5_migration` |

Non-scope registry changes: none.

## Paragraph Decisions

### 1.2.1 Individuele vraag

Target-record decision: `reviewed_final`

Operation chain:
- draw individual step-function demand curve
- apply willingness-to-pay buy/no-buy rule
- infer quantity change after price drop
- explain downward demand curve

| Code | Decision | Evidence boundary |
|---|---|---|
| `D1.1` | `link` | Target uses willingness-to-pay to decide quantity demanded. |
| `D1.2` | `link` | Target asks drawing and interpreting an individual demand curve. |
| `D3.1` | `no-code-with-rationale` | Consumer surplus appears in lesson/practice quality evidence, but not in the current registry target exercise. |

Carried limits:
- No target-equivalent proof closure.
- Graph-heavy evidence remains separate.
- D3.1 may be lesson evidence but is not a target-exercise registry code here.

### 1.2.2 Vraagfactoren

Target-record decision: `reviewed_final`

Operation chain:
- separate own-price movement from demand shift
- classify preference/income/substitute factors
- show shift direction graphically
- name demand-shift factors

| Code | Decision | Evidence boundary |
|---|---|---|
| `D1.4b` | `link` | Target applies demand shifts caused by income, preferences, other goods, and expectations. |
| `D1.9` | `link` | Target and generated practice include substitute/complement reasoning; official-question projection contains D1.9 examples. |
| `D1.4a` | `defer` | The target does not require the full relation between all buyers willingness-to-pay and the collective demand curve. |
| `A2.15` | `defer` | The target asks graph display, but this sprint does not broaden A-domain graph-code linkage without a separate operation comparison. |

Carried limits:
- Generated lesson review flags remain lesson-output issues.
- No generated answer wording changed.
- No target-equivalent proof closure.

### 1.2.3 Van individuele naar collectieve vraag

Target-record decision: `reviewed_final`

Operation chain:
- calculate collective demand from table
- draw individual and collective curves
- derive collective demand algebraically
- explain dropout/kink logic

| Code | Decision | Evidence boundary |
|---|---|---|
| `A2.9` | `link` | Target uses equations, tables, and graphs in an economic demand question. |
| `D1.3` | `link` | Target directly covers the relation between individual and collective demand lines. |

Carried limits:
- Horizontal aggregation missing-unit flags remain visible for MTU/backfill work.
- No target-equivalent proof closure.

### 1.2.4 Gemengde opgaven: vraag

Target-record decision: `placeholder_replaced_with_reviewed_integration_target`

Operation chain:
- calculate collective demand
- distinguish movement versus shift
- explain preference/substitute demand factors
- derive collective demand function
- read graph quantities and willingness-to-pay intercepts
- evaluate flawed demand conclusions

| Code | Decision | Evidence boundary |
|---|---|---|
| `A2.9` | `link` | Generated consolidation target uses functions, tables, and graphs in economic questions. |
| `D1.1` | `link` | Generated consolidation target asks maximum willingness-to-pay interpretation. |
| `D1.2` | `link` | Generated consolidation target uses individual demand curves. |
| `D1.3` | `link` | Generated consolidation target repeatedly calculates collective demand from individual demand. |
| `D1.4b` | `link` | Generated consolidation target classifies demand shifts from preferences, own price separation, and other-goods context. |
| `D1.9` | `link` | Generated consolidation target asks substitute/complement classification. |
| `D1.4a` | `defer` | The integration target closes D1.3/D1.4b operations without making a broader D1.4a collective willingness-to-pay claim. |

Carried limits:
- Frozen-yoghurt wording flag remains visible.
- Quality-ref orphaned-asset note remains visible.
- No generated lesson output changed.
- No target-equivalent proof closure.

## Chapter 1.1 Control Scope

Chapter 1.1 remains control-only. INSPECT-9A made no Chapter 1.1 registry mutation. Stronger re-use still requires a separate remediation sprint for target finality, exam-code/no-code decisions, and target-equivalent proof boundaries.

## Remaining Blockers Before INSPECT-10

- Chapter 1.2 has source-registry target/exam-code remediation, but no reviewed target-equivalent proof.
- Accessibility/support evidence for Chapter 1.2 remains weak and route-local only where present.
- Generated lesson review flags for 1.2.2 and 1.2.4 remain lesson-output follow-up work.
- Source freshness policy is proposed but not operationalized as source/profile maintenance.
- Chapter 1.1 remains control-only for stronger re-use.

## Quality Log

| Issue | Category | Severity | Affected surface | Next action |
|---|---|---:|---|---|
| Chapter 1.2 source target registry remediated but target-equivalent proof remains open | `target-equivalent-proof-gap` | high | Book 1 Chapter 1.2 target records and future evidence-pack inputs | Plan and review Chapter 1.2 target-equivalent proof before using completion or pack-strength language. |
| Consumer-surplus lesson evidence is not a 1.2.1 target-exercise code | `lesson-evidence-gap` | medium | 1.2.1 D3.1 lesson evidence versus target registry | Keep D3.1 out of the 1.2.1 target registry unless a later reviewed target exercise includes consumer-surplus operations. |
| 1.2.2 generated-output review flags remain open | `lesson-evidence-gap` | medium | 1.2.2 generated opgaven and answers | Carry answer-wording and local style flags until a later generated-output sprint fixes them. |
| 1.2.3 horizontal-aggregation missing-unit flags remain visible | `target-exercise-finality-gap` | medium | 1.2.3 MTU/backfill evidence | Route horizontal-sum and kink flags to MTU/backfill classification before broad closure claims. |
| 1.2.4 integration target carries local generated-output flags | `lesson-evidence-gap` | medium | 1.2.4 generated consolidation evidence | Carry frozen-yoghurt wording and orphaned-asset notes until a generated-output review sprint resolves or waives them. |
| Chapter 1.2 accessibility and support evidence still weak | `accessibility-evidence-gap` | high | Book 1 Chapter 1.2 future evidence-pack candidate | Run focused accessibility/support evidence review before treating Chapter 1.2 as pack-ready. |

## Validation Boundary

This sprint created no evidence pack, no generator, no package script, no CI/build gate, no dashboard gate, no quality-ref integration, no Scale Gate integration, and no generated lesson-output mutation.

No personal data was processed. No non-Dutch standards work was started.

## Next Action

Run INSPECT-9A validation and lead review. After closure, do not treat Chapter 1.2 as pack-ready until target-equivalent proof and accessibility/support evidence are reviewed or explicitly scoped as known blockers for a report-only implementation.

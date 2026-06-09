# MTU-H5 Next Governed Repair Packet

Generated: 2026-06-09

Status: `triage_ready_no_mutation_authorized`

## Scope

This packet continues MTU-H5 from the approved remote fixture. It runs the
non-mutating validator, triages the failed and `review_required` buckets, and
routes each remaining issue to a governed next repair lane.

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, candidate storage, candidate writes, lesson output, PV,
diagnostics, adaptive routing, mastery, sequencing, AI, summative use,
product-route readiness claim, or student/product use is authorized.

## Source

- Fixture: `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- Report: `reports/mtu-hardening/mtu-h5-regression-report.json`
- Gate closure:
  `reports/review-gates/GATE-MTU-H5-mapping-regression/gate-closure.json`
- Reviewed remote commit:
  `735a042ffcd085eca1c5bd2f6819eb1172c2cbd5`

Validator command:

```bash
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json
```

## Validator Summary

| Bucket | Count |
|---|---:|
| passed | 1 |
| failed | 10 |
| review_required | 31 |
| blocked | 0 |

Failed defect classes:

- `missing_mtu_for_correction_model_operation`: 2
- `over_triggered_prerequisite_not_required_by_answer_model`: 2
- `question_word_without_answer_form_mtu`: 3
- `incidence_pass_through_task_without_incidence_mtu`: 2
- `scale_factor_usage_without_scaling_unit_mtu`: 1

Procedure statuses:

- `procedure_present`: 6
- `procedure_review_required`: 15

## Repair Lanes

| ID | Lane | Next governed action |
|---|---|---|
| `MTU-H5-RP-001` | q3 annual insurance threshold operation gap | Later protected-reference or reviewed-equivalent packet for annual premium plus deductible threshold comparison. |
| `MTU-H5-RP-002` | q3 stale A15 over-trigger guard | Keep A15 forbidden; future mapper/registry work must prove q3 maps without A15. |
| `MTU-H5-RP-003` | q19 graph/draw/teken answer-form gap | Later graph/draw/teken answer-form review packet; do not treat A42/D10/D13/A81 as answer-form coverage. |
| `MTU-H5-RP-004` | q19 source-annex, graph-object, and multi-market procedure review | Route to EX5/q19 source-annex and graph-object evidence review before graph/PV or lesson-facing work. |
| `MTU-H5-RP-005` | q27 incidence/pass-through and per-1,000-liter scaling gaps | Later incidence/scaling review packet using official q27 correction-model evidence. |
| `MTU-H5-RP-006` | q15 reasoning answer-skill and procedure semantic-fit review | Later answer-skill review on whether D27/F03/F09 plus A97 fully cover both correction-model steps. |

## Negative Fixture

The negative fixture `negative-solo-q2-function-construction-overtrigger`
passes by failing as expected. Keep it as a guard against reintroducing a
function-construction route where a point/threshold calculation is enough.

## Result

MTU-H5 is operational and the next work is no longer blocked by sample approval.
The validator has identified the next governed repair lanes. This packet does
not claim closure of those lanes; it supplies the evidence and proof conditions
needed for a later human repair-lane review.

Next state: `ready_for_human_repair-lane_review`

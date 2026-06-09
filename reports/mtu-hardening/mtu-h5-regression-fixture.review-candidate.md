# MTU-H5 Regression Fixture Review Candidate

Generated: 2026-06-08

Status: `review_candidate_for_mtu_h5_regression`

## Sample

This candidate uses official VWO 2025 exam evidence already present in the
repository. It excludes the H1 Solo q1-q3 seed cases.

Official provenance:

- Examenblad Economie vwo 2025 document page:
  `https://www.examenblad.nl/2025/vwo/vakken/maatschappijvakken/economie-vwo`
- First-period opgaven/correctievoorschrift:
  `https://www.examenblad.nl/2025/vwo/documenten/cse-1/vw-1022-a-25-1-o`
  and
  `https://www.examenblad.nl/2025/vwo/documenten/cse-1/vw-1022-a-25-1-c`
- Second-period opgaven/correctievoorschrift:
  `https://www.examenblad.nl/2025/vwo/documenten/cse-2/vw-1022-a-25-2-o`
  and
  `https://www.examenblad.nl/2025/vwo/documenten/cse-2/vw-1022-a-25-2-c`

| Record | Evidence | Role |
|---|---|---|
| `vw-1022-a-25-1-o:opgave-1:question-3` | official question/correction PDFs plus EX-1/EX-2 overlays | calculation threshold, missing operation, stale A15 over-trigger, answer form |
| `vw-1022-a-25-1-o:opgave-3:question-15` | official question/correction PDFs plus EX-1/EX-2 overlays | reasoning answer model, answer form, misconception evidence |
| `vw-1022-a-25-1-o:opgave-4:question-19` | official question/correction PDFs plus EX-1/EX-2 overlays | graph/source task, source-annex gaps, procedure checks, missing graph answer form |
| `vw-1022-a-25-2-o:opgave-6:question-27` | official question/correction PDFs and extracted exam record | levy/incidence-style price/quantity task, scale/unit evidence |

## Operation Decomposition

The JSON fixture contains the full per-operation evidence. Human review should
focus on these operation ids:

| Record | Operation ids | Required/review hooks |
|---|---|---|
| q3 | `q3-step-1`, `q3-step-2` | A61/A96 required, A15 forbidden, explicit missing annual-threshold MTU expectation |
| q15 | `q15-step-1`, `q15-step-2` | D27/F03/F09/A97 expected, misconception hooks for undercutting and suboptimal joint outcome |
| q19 | `q19-step-1`, `q19-step-2`, `q19-step-3` | A42/D10/D13/A81 partial support, A45 forbidden, explicit `teken` answer-form gap |
| q27 | `q27-step-1`, `q27-step-2` | A98 answer form, empty incidence/scaling MTU slots by design, levy/capacity review hooks |

Repair fields added after GATE-MTU-H5 review:

- `expected_forbidden_route_tags`, including `function_construction` in the
  negative fixture.
- `expected_procedure_unit_ids` plus `procedure_review_required_unit_ids`, so
  checker output distinguishes `procedure_present`, `procedure_missing`, and
  `procedure_review_required`.
- `missing_answer_form_expected: true` for q19 `teken`.
- `unit_period_conversion_expected: true` for q3 monthly-to-annual premium
  handling, without mixing it into table scale-factor checks.

## Human Review Action

Review `reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json`.
If accepted, promote it to:

- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `status: approved_for_mtu_h5_regression`

Record the approval in `reports/review-gates/GATE-MTU-H5-mapping-regression/`.

## Expected Validator Behavior

The candidate is expected to produce failed and review-required buckets, because
the purpose is to catch known MTU-hardening defect classes before they recur:

- missing MTU for q3 annual insurance cost threshold;
- stale/forbidden A15 route for q3;
- missing graph/teken answer-form route for q19;
- incidence/levy and scale/unit review gaps for q27;
- negative fixture reintroducing the Solo q2 function-construction over-trigger.

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, candidate writes, lesson output,
PV, diagnostics, mastery, sequencing, AI, summative use, product-route claim, or
student/product use is authorized.

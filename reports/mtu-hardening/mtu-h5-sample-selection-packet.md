# MTU-H5 Sample Selection Packet

Generated: 2026-06-08

Status: `approved_with_administrative_remote_closure_repair`

## Gate State

GATE-MTU-H5 is APPROVED WITH ADMINISTRATIVE REMOTE-CLOSURE REPAIR. The fresh
VWO 2025 sample is approved for non-mutating MTU-H5 regression use. The H1
benchmark at `reports/mtu-hardening/benchmark-sample-v1.json` remains a Solo
q1-q3 seed benchmark; it is not the positive MTU-H5 sample.

The reviewed remote commit/hash is recorded in
`reports/review-gates/GATE-MTU-H5-mapping-regression/gate-closure.json`.

## Evidence Inspected

- `reports/mtu-hardening/benchmark-sample-v1.json`: H1 seed benchmark only; not a fresh approved sample.
- `reports/mtu-hardening/failure-taxonomy-v1.md`: source taxonomy for required defect classes.
- `build-scripts/references/check-mtu-h2-solo-cases.js`: validates Solo canonical case artifacts, not a fresh sample.
- `build-scripts/references/check-mtu-h3-incidence-pass-through-review.js`: validates incidence/pass-through review lifecycle, not a fresh sample.
- `build-scripts/references/check-mtu-h4-answer-form-question-type-routing.js`: validates answer-form routing evidence, not a fresh sample.
- `references/reference-team-roadmap.md`: MTU-H5 remains planned.
- `references/machine/micro-teaching-units.json`: read-only registry context only.
- `references/authored/course-target-exercises.json`: read-only target-exercise context only.

## Result Log

- `reports/sprints/MTU-H5-blocked-stop-result.md`: records the original blocked
  stop, the REVISE repair result, validation surface, and non-mutating authority
  boundary.

## Human Review Packet

- `reports/review-gates/GATE-MTU-H5-mapping-regression/review-packet.json`
- `reports/review-gates/GATE-MTU-H5-mapping-regression/review-packet.md`

The review packet records approval with administrative remote-closure repair. It
does not authorize protected reference mutation, target-exercise mutation,
generated lesson output, product use, or student use.

## Validator Scaffold

- `build-scripts/references/check-mtu-h5-mapping-regression.js`
- `reports/mtu-hardening/mtu-h5-regression-fixture.template.json`

The validator now runs against `reports/mtu-hardening/mtu-h5-regression-fixture.json`
with `status: approved_for_mtu_h5_regression`. The report is diagnostic and
non-mutating.

## Approved Fixture

- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `reports/mtu-hardening/mtu-h5-regression-report.json`
- `reports/mtu-hardening/mtu-h5-regression-report.md`
- `reports/review-gates/GATE-MTU-H5-mapping-regression/gate-closure.json`

Approved fixture validator command:

```bash
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json
```

## Review Candidate Fixture

- `reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json`
- `reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.md`

This candidate has been filled from local official VWO 2025 Economie
opgaven/correctievoorschriften plus EX2 human gate evidence. It contains four
fresh non-Solo records: q3 annual insurance threshold, q15 prisoner-dilemma
reasoning, q19 graph/source drawing, and q27 drinkwater levy capacity/scaling.

The candidate remains as review provenance. The promoted fixture is
`reports/mtu-hardening/mtu-h5-regression-fixture.json` with
`status: approved_for_mtu_h5_regression`.

Candidate validator command:

```bash
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json --allow-review-candidate --expect-fail --json
```

## Exact Evidence Needed

1. Approved fresh sample fixture with `status: approved_for_mtu_h5_regression`, a stable sample id, a review decision or gate packet path, non-Solo question records, source locators, and all mutation/product-use authority flags set to false.
2. Per-question official correction-model operation decomposition with operation ids, answer-model summaries, expected required MTUs or explicit missing-MTU expectation, forbidden MTUs for over-trigger guards, and route tags for calculus/non-calculus/function/point/incidence/answer-form/scaling/misconception/procedure checks.
3. Reviewed answer-form and misconception evidence: question word, expected answer-form MTU or equivalent, misconception tag/evidence or not-applicable rationale, scale-factor evidence where present, and procedure expectation for apply/analyze MTUs.
4. At least one negative fixture that reintroduces an original Solo q1-q3 defect class and is expected to fail without mutating protected references or target exercises.

## Required Defect-Class Hooks

| Defect class | H1 taxonomy source | MTU-H5 hook before implementation |
|---|---|---|
| missing MTU for a correction-model operation | `operation_unit_missing` | `records[].official_correction_model_operations[].expected_required_mtu_ids` |
| over-triggered prerequisite not required by the answer model | `content_unit_too_broad` | `expected_forbidden_mtu_ids` |
| calculus route triggered where non-calculus route is intended | `over_trigger_derivative_route` | `expected_route_tags` plus forbidden MTUs |
| function-construction route triggered when a point calculation is enough | `over_trigger_function_construction` | `expected_route_tags` |
| incidence/pass-through task without incidence MTU | `incidence_family_too_narrow` | `incidence_or_pass_through_expected` |
| question word without answer-form MTU | `answer_form_missing` | `question_word` plus `expected_answer_form_mtu_ids` |
| scale-factor usage without scaling/unit MTU | `scale_factor_handling_missing` | `scale_factor_expected` |
| predictable misconception without tag or equivalent evidence | `misconception_tag_missing` | `expected_misconception_refs` |
| apply/analyze unit without usable canonical procedure | MTU-H5 regression target | live registry `mastery_target` and non-empty `procedure` |

Each hook is `review_required` until an approved fresh sample supplies the concrete fixture fields.

## Sample Selection Policy

Minimum sample: three reviewed records.

Preferred distribution:

- at least one `berekenen` or calculation answer-model case;
- at least one `leg_uit` or `analyseer` reasoning case with misconception risk;
- at least one source, scale, graph, incidence, or pass-through case.

Allowed evidence:

- real exam questions with official correction-model evidence;
- official correction models;
- reviewed target exercises with explicit review provenance.

Forbidden evidence:

- syllabus prose alone;
- generated reports alone;
- unreviewed inferred lesson output;
- invented or synthetic product-route tasks.

## Boundary

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No authored
target-exercise mutation authorized. No unit minting, update, split, merge, or
deprecation authorized. No candidate storage or candidate writes authorized. No
lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion,
product-route readiness claim, or student/product use authorized.

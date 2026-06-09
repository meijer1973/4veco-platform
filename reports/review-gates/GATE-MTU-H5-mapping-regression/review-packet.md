# GATE-MTU-H5 Mapping Regression Sample Review Packet

Generated: 2026-06-08

Status: repaired local approval, no mutation authorized.

## Review Scope

Review whether MTU-H5 has enough approved fresh-sample evidence to run the
non-mutating mapping regression validator. The human gate verdict was REVISE,
then approve. The requested fixture/checker contract repairs have been applied
as repaired local approval and the fixture has been promoted locally.

Remote evidence prerequisite: this review packet, the H5 sample-selection
packet, and cited evidence must be committed and pushed to the normal remote
branch before final remote closure. The gate closure currently records that the
reviewed remote commit/hash remains pending.

## Evidence Base

- `reports/mtu-hardening/mtu-h5-sample-selection-packet.json`
- `reports/mtu-hardening/mtu-h5-sample-selection-packet.md`
- `reports/sprints/MTU-H5-blocked-stop-result.md`
- `build-scripts/references/check-mtu-h5-sample-selection-packet.js`
- `build-scripts/references/check-mtu-h5-mapping-regression.js`
- `reports/mtu-hardening/mtu-h5-regression-fixture.template.json`
- `reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json`
- `reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.md`
- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `reports/mtu-hardening/mtu-h5-regression-report.json`
- `reports/mtu-hardening/mtu-h5-regression-report.md`
- `reports/review-gates/GATE-MTU-H5-mapping-regression/gate-closure.json`
- `reports/review-gates/GATE-MTU-H5-mapping-regression/gate-closure.md`
- `reports/mtu-hardening/benchmark-sample-v1.json`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json` as read-only context

## Candidate For Review

The concrete candidate to review is
`reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json`.
Its summary is
`reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.md`.

The candidate uses local official VWO 2025 Economie exam/correction-model PDFs
and EX2 human gate evidence. It remains as review provenance. The repaired
local approval fixture is
`reports/mtu-hardening/mtu-h5-regression-fixture.json` with
`status: approved_for_mtu_h5_regression`.

## Approved Fixture

- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `reports/mtu-hardening/mtu-h5-regression-report.json`
- `reports/mtu-hardening/mtu-h5-regression-report.md`

The report is diagnostic only. It may show failed and review-required buckets
without authorizing protected reference mutation or product use.

## Evidence Required To Close This Gate

1. Approved fresh sample fixture with `status: approved_for_mtu_h5_regression`.
2. Stable non-Solo record IDs and source locators.
3. Real exam question, official correction model, or reviewed target-exercise
   evidence for every record.
4. Official correction-model operation decomposition for every record.
5. Expected required MTUs and expected forbidden MTUs for over-trigger checks.
6. Answer-form, misconception, scale/unit, incidence/pass-through, and
   procedure hooks where applicable.
7. At least one negative fixture expected to fail when an original Solo q1-q3
   defect class is reintroduced.
8. Authority boundary proving no protected mutation, candidate writes,
   target-exercise mutation, lesson output, PV, diagnostics, mastery,
   sequencing, AI, summative, product-route, or student/product use.

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews MTU-H5 sample selection and validator readiness only; it
   does not authorize protected reference mutation, MTU changes, candidate
   writes, target-exercise mutation, lesson output, PV, diagnostics, mastery,
   sequencing, AI, summative use, or student/product use.
2. The current packet has a repaired local approved fixture attached; final
   remote closure must still record the reviewed commit/hash.
3. Generated reports are diagnostics only and cannot be used as primary
   evidence for the fresh sample.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH5-Q1: review scope

Does this gate remain limited to approving a fresh MTU-H5 regression sample and
validator readiness, with no mutation or product authority?

Options:
- Yes, keep this gate sample/validator-only.
- Revise the boundary before review.
- Hold MTU-H5.
- Open answer / other, with rationale.

### MTUH5-Q2: sample freshness

Is the proposed sample fresh relative to H1, meaning it does not rely on the
Solo q1-q3 seed cases as the positive sample?

Options:
- Yes, the sample is fresh.
- No, replace or supplement the sample.
- Hold until fresh sample evidence is attached.
- Open answer / other, with rationale.

### MTUH5-Q3: source authority

Does every proposed record cite real exam questions, official correction
models, or reviewed target exercises rather than syllabus prose or generated
reports alone?

Options:
- Yes, source authority is sufficient.
- Add or repair source evidence.
- Hold until source authority is reviewable.
- Open answer / other, with rationale.

### MTUH5-Q4: operation decomposition

Is each official correction-model operation decomposed enough for MTU-level
required-unit and missing-unit assertions?

Options:
- Yes, operation decomposition is sufficient.
- Add operation decomposition detail.
- Hold operations that are not mechanically checkable.
- Open answer / other, with rationale.

### MTUH5-Q5: over-trigger guards

Does each record identify forbidden MTUs or route tags for prerequisites,
calculus routes, function construction, and other answer-model over-triggers?

Options:
- Yes, over-trigger guards are sufficient.
- Add forbidden MTUs or route tags.
- Mark specific guards `review_required`.
- Open answer / other, with rationale.

### MTUH5-Q6: answer form hooks

Does each question word or prompt action cite an answer-form MTU or reviewed
equivalent, or an explicit not-applicable rationale?

Options:
- Yes, answer-form hooks are sufficient.
- Add answer-form MTU expectations.
- Mark specific answer-form checks `review_required`.
- Open answer / other, with rationale.

### MTUH5-Q7: incidence, scaling, and misconception hooks

Are incidence/pass-through, scale/unit, and predictable misconception hooks
present wherever the evidence requires them?

Options:
- Yes, all required hooks are present.
- Add missing hooks.
- Mark specific hooks `review_required`.
- Open answer / other, with rationale.

### MTUH5-Q8: procedure hooks

Are apply/analyze mapped units checked against the live registry for a
non-empty canonical procedure, with `review_required` hooks where the
mechanical check is not enough?

Options:
- Yes, procedure checks are sufficient.
- Add procedure-unit expectations.
- Mark specific procedure checks `review_required`.
- Open answer / other, with rationale.

### MTUH5-Q9: negative fixture

Does the packet include at least one negative fixture expected to fail by
reintroducing an original Solo q1-q3 defect class?

Options:
- Yes, negative fixture evidence is sufficient.
- Add a negative fixture before approval.
- Hold until failure expectations are explicit.
- Open answer / other, with rationale.

### MTUH5-Q10: next authority

If the sample is approved, is the only authorized next step to run the
non-mutating MTU-H5 validator and produce diagnostic pass/fail results?

Options:
- Yes, authorize only non-mutating validator execution.
- Require another planning packet before execution.
- Hold MTU-H5.
- Open answer / other, with rationale.

## Boundary

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No authored
target-exercise mutation authorized. No MTU minting, update, split, merge, or
deprecation authorized. No candidate storage or candidate writes authorized. No
lesson output, PV, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, product-route readiness claim, or
student/product use authorized.

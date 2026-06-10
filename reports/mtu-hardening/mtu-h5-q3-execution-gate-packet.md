# MTU-H5 Q3 Execution-Gate Packet

Status: `q3_execution_gate_packet_ready_for_human_review_no_execution_authorized`

Created: 2026-06-09

This packet prepares, but does not execute, the separate q3 execution gate for
MTU-H5-RP-001/RP-002. It names the exact future write surface needed to clear
q3's live missing-operation and A15 over-trigger failures while preserving A61,
A96, annual-threshold operation coverage, threshold-conclusion answer-skill
visibility, and the negative A15 guard.

No mapper repair. No q3 fixture mutation. No candidate writes, protected-reference
mutation, MTU mutation, authored target-exercise mutation, lesson output, PV,
diagnostics, product-route readiness, or student/product use is authorized.

## Decision

The recommended future write surface is:

`reports/mtu-hardening/mtu-h5-regression-fixture.json`

This is a non-protected MTU-H5 regression fixture. It is the smallest future
execution surface because the current H5 validator already detects the q3
defects from this fixture, and the q3 operation/answer-skill evidence is already
remote-closed as reviewed-equivalent planning evidence.

The packet does not recommend changing the mapper/checker first, creating a
generated overlay, creating candidate storage, mutating `references/machine/`,
or touching authored target exercises.

## Current Q3 State

The q3 fixture is intentionally still unrepaired:

- q3 record maps `A15`, `A61`, and `A96`.
- `q3-step-1` maps `A15`, `A61`, and `A96`.
- `q3-step-2` maps `A15`, `A61`, and `A96`.
- both q3 operations keep `expected_forbidden_mtu_ids: ["A15"]`.
- both q3 operations keep `missing_mtu_expected: true`.
- both q3 operations keep their current `review_required_hooks`.
- scale-factor and incidence/pass-through expectations remain false.

The live validator therefore still reports:

- `q3-step-1:ASSERT-MISSING-OPERATION-MTU`
- `q3-step-1:ASSERT-OVER-TRIGGER`
- `q3-step-2:ASSERT-MISSING-OPERATION-MTU`
- `q3-step-2:ASSERT-OVER-TRIGGER`

The global Solo negative fixture guard also remains live:

`MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED`

## Future Patch Shape

If and only if a later human gate explicitly authorizes q3 execution, the exact
future fixture-only patch should:

- remove `A15` from q3 record `mapped_mtu_ids`.
- remove `A15` from `q3-step-1` and `q3-step-2` `mapped_mtu_ids`.
- retain `A61` and `A96` in q3 record and operation mappings.
- retain `A61` and `A96` in `expected_required_mtu_ids`.
- retain `A96` in `expected_answer_form_mtu_ids`.
- retain `A15` in `expected_forbidden_mtu_ids`.
- set `missing_mtu_expected` to false on both q3 operations.
- add reviewed-equivalent annual-threshold operation refs for
  `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON`.
- add reviewed-equivalent threshold-conclusion answer-skill refs for
  `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` on `q3-step-2`.
- replace the current q3 review-required hooks with reviewed-equivalent refs.
- keep scale-factor and incidence/pass-through expectations false.

## Gate Questions

1. Correct next write surface:
   `reports/mtu-hardening/mtu-h5-regression-fixture.json`.
2. Candidate storage needed:
   no.
3. `references/machine/` mutation needed:
   no.
4. A15 removal:
   remove `A15` from q3 record and operation `mapped_mtu_ids`; keep `A15`
   forbidden.
5. A61/A96 retention:
   keep both in q3 record/operation mappings and expected required IDs, and keep
   `A96` as answer-form support.
6. Annual-threshold operation coverage:
   attach reviewed-equivalent refs for
   `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON`.
7. Threshold-conclusion answer-skill visibility:
   attach reviewed-equivalent refs for
   `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` on `q3-step-2`.
8. Negative assertion if A15 returns:
   q3 `ASSERT-OVER-TRIGGER` must fail for both q3 operations.
9. Proof commands:
   run the packet checker, FU-001 checker, H5 mapping validator, report JSON
   validation, URL-index check, agent index, and platform tests.
10. Rollback:
    restore only q3 fixture fields to the current pre-execution state with A15
    present, `missing_mtu_expected: true`, current review hooks, and A15 still
    forbidden.

## Review Packet

Human review entry point:

`reports/review-gates/GATE-MTU-H5-q3-execution/review-packet.md`

Machine packet:

`reports/mtu-hardening/mtu-h5-q3-execution-gate-packet.json`

Checker:

`build-scripts/references/check-mtu-h5-q3-execution-gate-packet.js`

Reviewers should approve, revise, or reject only the proposed future q3
fixture-only execution surface. Approval must explicitly authorize execution
before any fixture mutation may happen.

## Validation

```sh
node build-scripts/references/check-mtu-h5-q3-execution-gate-packet.js
node build-scripts/references/check-mtu-h5-fu001-q3-execution-readiness-packet.js
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run agent:index
npm run check:platform
```

`npm run agent:index` is a generator, not a read-only check. Run it before final
diff review and confirm the generated platform index lists the q3 execution-gate
packet, checker, and gate paths.

## Boundary

This packet is ready for human execution-gate review. It is not a completion
claim and not execution authority.

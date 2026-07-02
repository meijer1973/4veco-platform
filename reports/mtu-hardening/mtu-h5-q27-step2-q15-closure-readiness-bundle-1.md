# MTU-H5 q27-step2 / q15 Closure-Readiness Bundle 1

Status: `pending_human_review_after_more_than_satisfied_execution`

Historical q19 status: `superseded_by` `MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1`. This bundle remains authoritative for the q27-step-2 and q15 repairs, but its q19 `0 failed / 6 review_required` carried-hold statements are no longer current after the 2026-06-20 final q19 resolution bundle.

Review standard: REV-STD-1

Product end-state: MTU-H5 is still blocked from final closure, Scale Gate 1,
product-route readiness, diagnostics, PV, mastery, sequencing, lesson output,
and student/product use. This bundle clears q27 and q15 from the MTU-H5
regression surface only; q19 remains held at `0 failed / 6 review_required`.

## Result

The approved execution moves the live MTU-H5 validator from:

```text
q27: 1 failed / 2 review_required
q15: 0 failed / 4 review_required
overall: 1 failed / 12 review_required
```

to:

```text
q27: 0 failed / 0 review_required
q15: 0 failed / 0 review_required
overall: 0 failed / 6 review_required
```

Only q19 remains in `review_required`.

## Non-Negotiables

- q27-step-2 is capacity/source-readout/conclusion, not incidence/pass-through.
- D07 must not support q27-step-2; D08 and A15 must not be used as closure.
- q27-step-1 package-1/package-2 refs must remain intact.
- q15 uses `EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION` as reviewed-equivalent answer-skill evidence for both correction-model points.
- D27/F03/F09 remain content support only; A97 remains answer-form/procedure support only.
- A97 alone must not close q15.
- q15 must not gain graph, calculus, function-construction, incidence, or scaling routes.
- No protected reference, external source, machine reference, authored target exercise, candidate storage, lesson, diagnostics, PV, product, or student/product use mutation is authorized.

## Reviewed Equivalent Anchors

`Q27_STEP2_CAPACITY_OVERCONSUMPTION_TAXONOMY_REVIEWED_EQUIVALENT`
approves only the q27-step-2 capacity conclusion: demand equals production
capacity at Q = 14,000, so overconsumption is countered. A98 is answer-form
support. A88 is unit/source-readout support. D07 and D08 are explicitly not
closure support.

`Q15_TWO_STEP_DOMINANT_STRATEGY_PD_REVIEWED_EQUIVALENT` approves only the q15
two-step answer skill: dominant strategy to lower or undercut price, then lower
revenue/profit for both firms and the prisoner-dilemma conclusion.

## Carried Issue

q19 remains classified as `blocks`: it blocks MTU-H5 final closure, Scale Gate
1, product-route readiness, diagnostics, PV, mastery, sequencing, lesson
output, and student/product use.

q19 does_not_block this checker/fixture repair because the q19 source/graph
reasoning hooks stay visible at `0 failed / 6 review_required`.

proof_required_to_close q19: separate reviewed source-annex/graph-object and
chained reasoning evidence, with the existing q19 negative guards still
rejecting hidden source/graph gaps and forbidden A45/full-graph over-trigger.

## Validation

```text
node --check build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js
node build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --json
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run agent:index
npm run check:platform
```

The global original Solo q1-q3 negative fixture remains pass-as-fail, and the
new checker also creates temporary q27-step-2 and q15 regression clones.

## Index Provenance

The platform branch was rebased onto `origin/main` at
`32ce3d93eab585471a7349536d5c52831efb635f`.

The `4veco-lessen` agent index was regenerated from a temporary clean detached
worktree of `4veco-lessen origin/main` at
`a020f7dece0d9acec7f7376e9bd51e632843902b`.

The checker proves the known Book 2 anchor remains indexed:

```text
Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/
2.1 Hoofdstuk Kosten en opbrengsten/
2.1.1 Kostenstructuren/
2.1.1 Kostenstructuren ... paragraaf.md
```

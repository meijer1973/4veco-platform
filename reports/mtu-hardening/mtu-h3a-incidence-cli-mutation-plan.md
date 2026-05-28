# MTU-H3A Incidence Pass-Through CLI-Mutation Planning Packet

Generated: 2026-05-28

Status: planning packet ready, no mutation authorized.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No `D07` update
authorized. No `D41`-`D46` unit minting authorized. No unit split or
deprecation authorized. No target-exercise mutation authorized. No
candidate-storage creation authorized. No candidate writes authorized. No
lesson-output mutation authorized. No generated projection refresh authorized.
No PV projection or PV machine promotion authorized. No student/product use
authorized.

Remote evidence prerequisite: this packet, the review packet, and all cited
evidence must be committed and pushed to the normal remote branch before human
review starts. The gate closure must record the reviewed remote commit/hash.

## Source Authority

GATE-MTU-H3 closed as PASS WITH CONDITIONS for incidence/pass-through routing
only. It authorized MTU-H3A to prepare a later bounded CLI-mutation planning
packet. It did not authorize execution.

Accepted H3 routing:

- Narrow `D07` to tax afwentelingspercentage / percentage burden calculation.
- Plan `D41` for tax wedge and `Pc`/`Pp` graphical labeling.
- Plan `D42` for tax burden amounts in euros.
- Plan `D43` and `D44` for subsidy effective prices and subsidy
  benefit-sharing.
- Move relative elasticity explanation to `D45`.
- Keep `A93` bounded to percentage price change after a cost change and plan
  `D46` only for true cost-shock pass-through share.
- Treat target-exercise mapping changes as authored-reference mutations.
- Refresh generated projections only after authorized source mutation.

## Baseline Evidence

- Live `D07` still exists with current needs `D05` and `A15`.
- Candidate IDs `D41`, `D42`, `D43`, `D44`, `D45`, and `D46` are absent from
  the live MTU registry in this baseline.
- `A93` remains a percentage price-change unit and is not updated by H3A.
- Target exercises `3.1.1`, `3.1.2`, and `3.1.3` were reviewed as read-only
  context for later mapping proposals.

## Proposed Unit Update

### `D07` - Heffing afwentelingspercentage berekenen

Action: later `unit-update`, not authorized now.

Proposed patch:

```json
{
  "name": "Heffing afwentelingspercentage berekenen",
  "kern": "Bereken welk percentage van een heffing bij consumenten en producenten terechtkomt nadat de euro-bedragen van de belastingdruk bekend zijn.",
  "needs": ["D42", "A38"],
  "exam_codes": ["D1.4a"],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": ["rekenen", "verbaal"],
  "terms": ["heffingen"]
}
```

Procedure route:

1. Use euro burden amounts: consumer amount `Pc - P0` and producer amount
   `P0 - Pp`.
2. Divide the consumer amount by tax `t` and multiply by 100 percent.
3. Divide the producer amount by `t`, or use `100 percent - consumer share`.
4. Check that both percentages sum to 100 percent.
5. State who bears which percentage.

Rationale: `D07` becomes the percentage conversion lane after `D42` has
calculated burden amounts. Elasticity explanation leaves `D07` and moves to
`D45`.

## Proposed Unit Additions

| Unit | Route | Needs | Boundary |
|---|---|---|---|
| `D41` | tax wedge and `Pc`/`Pp` graphical labeling | `D05` | no welfare-area shading |
| `D42` | consumer/producer tax burden in euros | `D41` | no percentage conversion until `D07` |
| `D43` | subsidy equilibrium and effective prices | `A41` | no welfare/subsidy-cost calculation |
| `D44` | subsidy benefit-sharing | `D43` | planned but not mapped to `3.1.3` unless needed |
| `D45` | incidence explanation with relative elasticities | `A15` | names supply-elasticity gap explicitly |
| `D46` | cost-shock pass-through share | `A93` | denominator is cost shock, not old price |

All proposed specs include exact names, kern, needs, exam codes, terms,
aspects, procedures, and pitfalls in:

- `reports/mtu-hardening/mtu-h3a-incidence-cli-mutation-plan.json`

The specs were simulated against the current catalog without mutating
`references/machine/`.

## Target Mapping Proposal

These are authored-reference mapping proposals only. They are not executed by
MTU-H3A.

### `3.1.1`

Reason: the exercise asks for shifted supply, new consumer/producer prices,
and a tax wedge drawing, not afwentelingspercentage.

Before:

```json
{
  "required_skills": ["A06", "A23", "A41", "D05", "D07"],
  "prior_knowledge_assumed": ["A06"],
  "new_skills_introduced": ["A23", "A41", "D05", "D07"],
  "missing_units_flagged": ["Distinguish consumer price Pc vs producer price Pp and the tax wedge = Pc - Pp (concept-level + grafisch)"]
}
```

After:

```json
{
  "required_skills": ["A06", "A23", "A41", "D05", "D41"],
  "prior_knowledge_assumed": ["A06"],
  "new_skills_introduced": ["A23", "A41", "D05", "D41"],
  "missing_units_flagged": []
}
```

### `3.1.2`

Reason: the exercise asks for tax burden amounts and afwentelingspercentage.
`D42` should carry euro burden amounts before narrowed `D07` calculates
percentages.

Before:

```json
{
  "required_skills": ["A10", "A19", "A23", "A32", "A40", "D03", "D07"],
  "prior_knowledge_assumed": ["A10", "A19", "A23", "A40", "D07"],
  "new_skills_introduced": ["A32", "D03"],
  "missing_units_flagged": [
    "Compute afwentelingspercentage = (Pc - P*) / tax x 100 and interpret it (A-domain candidate; the consumer-burden metric)",
    "Apply the surplus-accounting identity: old TS = new CS + new PS + tax revenue + DWL (concept-level, completeness check)"
  ]
}
```

After:

```json
{
  "required_skills": ["A10", "A19", "A23", "A32", "A40", "D03", "D41", "D42", "D07"],
  "prior_knowledge_assumed": ["A10", "A19", "A23", "A40", "D41"],
  "new_skills_introduced": ["A32", "D03", "D42", "D07"],
  "missing_units_flagged": [
    "Apply the surplus-accounting identity: old TS = new CS + new PS + tax revenue + DWL (concept-level, completeness check)"
  ]
}
```

### `3.1.3`

Reason: the exercise requires subsidy effective prices. It does not yet prove
that subsidy benefit-sharing is required as a mapped target skill.

Before:

```json
{
  "required_skills": ["A06", "A10", "A19", "A27", "A41", "D19", "D29"],
  "prior_knowledge_assumed": ["A06", "A10", "A19", "A41"],
  "new_skills_introduced": ["A27", "D19", "D29"],
  "missing_units_flagged": [
    "Explain that subsidies cause DWL via overproduction beyond the Pareto-efficient quantity (concept-level, counterintuitive to students)",
    "Compute government subsidy expenditure = subsidy x Q_new (reken skill, A-domain candidate)"
  ]
}
```

After:

```json
{
  "required_skills": ["A06", "A10", "A19", "A27", "A41", "D19", "D29", "D43"],
  "prior_knowledge_assumed": ["A06", "A10", "A19", "A41"],
  "new_skills_introduced": ["A27", "D19", "D29", "D43"],
  "missing_units_flagged": [
    "Explain that subsidies cause DWL via overproduction beyond the Pareto-efficient quantity (concept-level, counterintuitive to students)",
    "Compute government subsidy expenditure = subsidy x Q_new (reken skill, A-domain candidate)"
  ]
}
```

Held mapping: `D44` remains planned but unmapped until a target explicitly
requires subsidy benefit-sharing.

## Dependency Audit

- `D07` should not require `A15`; elasticity explanation moves to `D45`.
- `D41` should not depend on welfare-area units such as `A40`, `A32`, or
  `D29` unless a target asks for areas.
- `D45` depends on `A15` and explicitly names qualitative supply-elasticity
  reasoning because no separate supply-elasticity unit exists in this plan.
- `D46` depends on `A93` but keeps the denominator boundary: `A93` uses old
  price, `D46` uses the cost shock.

## Later Command Standard

A later execution packet, if authorized by GATE-MTU-H3A, must include exact
commands and logs:

```text
node build-scripts/references/unit-update.js --id D07 --dry-run --spec '<reviewed D07 patch>'
node build-scripts/references/unit-update.js --id D07 --spec '<reviewed D07 patch>'
node build-scripts/references/unit-add.js --spec '<reviewed D41 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed D42 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed D43 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed D44 spec, if still accepted>'
node build-scripts/references/unit-add.js --spec '<reviewed D45 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed D46 spec>'
```

The later packet must print every extracted unit spec before execution. It
must disclose that `unit-add` has no dry-run support. It must also print the
exact target-exercise before/after arrays before any authored mapping update.

## Rollback And Validation Requirements

Later rollback requirements:

- restore prior `D07` fields exactly;
- remove `D41`-`D46` only through an authorized machine-reference rollback
  route if minted;
- restore previous target-exercise arrays for `3.1.1`, `3.1.2`, and `3.1.3`;
- restore previous missing-unit flags if mapping patches are rejected;
- discard generated projection refreshes that derive from rolled-back source
  changes;
- prove no candidate, lesson-output, PV, or student-facing state changed.

Later validation stack:

```text
git status --short
fresh D41-D46 absence check
D07/A38/A41/A93 presence check
D07 unit-update --dry-run
simulated catalog validation
build-unit-index
validate-core-schemas
course-target-exercises validation
generator-readiness check if interactive exposure changes
report JSON validation
Jest
git diff --check
no-unintended-diff proof
```

## Stop Conditions

- Stop if direct `D07` mutation is authorized from H3A.
- Stop if `D41`-`D46` minting is authorized without a later exact execution
  packet.
- Stop if `D07` keeps `A15` or hidden elasticity explanation.
- Stop if `D41` imports welfare-area shading.
- Stop if `D45` hides the supply-elasticity gap.
- Stop if `D46` collapses into `A93` or changes the `A93` boundary.
- Stop if target-exercise mapping writes are treated as generated projections.
- Stop if generated projections refresh before authorized source mutation.
- Stop if PV projection, PV machine promotion, lesson output, or
  student/product use is authorized.

## Recommended Next Action

Commit and push this planning packet and the GATE-MTU-H3A review packet, then
run GATE-MTU-H3A human review before any `D07` update, `D41`-`D46` minting,
target-exercise mapping update, projection refresh, lesson handoff, or
student-facing exposure.

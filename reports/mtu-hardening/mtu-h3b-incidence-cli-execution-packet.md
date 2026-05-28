# MTU-H3B Incidence Pass-Through CLI Execution Packet

Generated: 2026-05-28

Status: execution packet ready, no mutation authorized.

Remote publication status: must commit and push this packet before human
review.

## Scope

Prepare a later bounded execution sprint for the GATE-MTU-H3A accepted
incidence/pass-through lanes only. This packet does not authorize execution.

Reviewable lanes:

- `D41` tax wedge and `Pc`/`Pp` graphical labeling
- `D42` tax burden amounts in euros
- `D43` subsidy effective prices
- `D45` relative elasticity explanation
- `D46` cost-shock pass-through share
- `D07` narrowed tax afwentelingspercentage update

Held lane:

- `D44` subsidy benefit-sharing remains held and is not in the command set.

## Source Evidence

- `reports/review-gates/GATE-MTU-H3A-incidence-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/mtu-h3a-incidence-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `references/reference-team-roadmap.md`

## Authority Boundary

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No `D07` mutation
authorized. No unit minting authorized. No unit update execution authorized.
No unit split/deprecation authorized. No target-exercise mutation authorized.
No candidate writes authorized. No lesson-output mutation authorized. No
generated projection refresh authorized. No diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, or student/product use authorized.

## H3A Condition Resolution

`D42` dependency review: resolved by revising `D42` to zero-needs with
documented underbouw-assumed status. `D42` calculates euro burden from
available `P0`/`Pc`/`Pp`/`t` values and does not depend on `D41`. Graph
contexts map `D41` separately.

`D45` supply-elasticity status: resolved as qualitative internal reasoning.
`D45` uses `A15` for demand elasticity and names supply elasticity
qualitatively through graph steepness or context. No numeric
supply-elasticity unit is added in H3B.

`A93` boundary: unchanged. `A93` uses old price as denominator for price
percentage change; `D46` uses the cost shock as denominator for pass-through
share.

`D44` status: held and unmapped. Current `3.1.3` evidence does not explicitly
ask subsidy benefit-sharing.

## Exact Unit Specs

### D41 add

```json
{
  "id": "D41",
  "name": "Belastingwig en Pc/Pp grafisch labelen",
  "needs": ["D05"],
  "exam_codes": ["D1.13", "D1.24"],
  "aspects": ["grafisch", "verbaal"]
}
```

### D42 add

```json
{
  "id": "D42",
  "name": "Belastingdruk in eurobedragen berekenen",
  "needs": [],
  "exam_codes": ["D1.4a"],
  "zero_needs_status": "underbouw_assumed"
}
```

`D42` must not import `D41` as a prerequisite. If a graph is needed, the target
mapping must include `D41` separately.

### D43 add

```json
{
  "id": "D43",
  "name": "Subsidie-evenwicht en effectieve prijzen bepalen",
  "needs": ["A41"],
  "exam_codes": ["A2.15", "D3.5"]
}
```

### D45 add

```json
{
  "id": "D45",
  "name": "Incidentie verklaren met relatieve elasticiteiten",
  "needs": ["A15"],
  "exam_codes": ["D1.4a", "D3.5"]
}
```

Supply elasticity is handled qualitatively inside the unit; no hidden numeric
supply-elasticity calculation is required.

### D46 add

```json
{
  "id": "D46",
  "name": "Kostenstijging doorberekenen als pass-through share",
  "needs": ["A93"],
  "exam_codes": ["A2.4", "A2.10"]
}
```

### D07 update

```json
{
  "name": "Heffing afwentelingspercentage berekenen",
  "needs": ["D42", "A38"],
  "exam_codes": ["D1.4a"]
}
```

The `D07` procedure contains percentage calculation only; elasticity
explanation moves to `D45`.

## Exact Command Set

The complete command strings are stored in:

```text
reports/mtu-hardening/mtu-h3b-incidence-cli-execution-packet.json
```

Execution order for a later authorized sprint:

1. Print and execute `D41` unit-add.
2. Print and execute `D42` unit-add.
3. Print and execute `D43` unit-add.
4. Print and execute `D45` unit-add.
5. Print and execute `D46` unit-add.
6. Print `D07` patch and run `unit-update --dry-run`.
7. Execute `D07` update only after dry-run proves `A15` is removed and no
   elasticity procedure remains.
8. Print and apply exact target-exercise mapping arrays.
9. Refresh generated projections only after authorized source mutation.
10. Run validation stack and no-unintended-diff proof.

`unit-add` has no dry-run mode in the current CLI. Each extracted spec must be
printed immediately before its command.

## Target-Exercise Mapping Patch

### 3.1.1

Before:

```json
{
  "required_skills": ["A06", "A23", "A41", "D05", "D07"],
  "prior_knowledge_assumed": ["A06"],
  "new_skills_introduced": ["A23", "A41", "D05", "D07"]
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

### 3.1.2

Before:

```json
{
  "required_skills": ["A10", "A19", "A23", "A32", "A40", "D03", "D07"],
  "prior_knowledge_assumed": ["A10", "A19", "A23", "A40", "D07"],
  "new_skills_introduced": ["A32", "D03"]
}
```

After:

```json
{
  "required_skills": ["A10", "A19", "A23", "A32", "A40", "D03", "D41", "D42", "D07"],
  "prior_knowledge_assumed": ["A10", "A19", "A23", "A40", "D41"],
  "new_skills_introduced": ["A32", "D03", "D42", "D07"]
}
```

### 3.1.3

Before:

```json
{
  "required_skills": ["A06", "A10", "A19", "A27", "A41", "D19", "D29"],
  "prior_knowledge_assumed": ["A06", "A10", "A19", "A41"],
  "new_skills_introduced": ["A27", "D19", "D29"]
}
```

After:

```json
{
  "required_skills": ["A06", "A10", "A19", "A27", "A41", "D19", "D29", "D43"],
  "prior_knowledge_assumed": ["A06", "A10", "A19", "A41"],
  "new_skills_introduced": ["A27", "D19", "D29", "D43"]
}
```

`D44` remains held and unmapped.

## Rollback Route

- Capture clean-worktree proof and pre-execution commit before execution.
- If a unit-add/update command fails before commit, restore the pre-execution
  commit state.
- If a unit is rejected after commit, use a later reviewed deprecate/revert
  lane; do not hand-edit `references/machine`.
- Restore target-exercise arrays to the recorded before values for `3.1.1`,
  `3.1.2`, and `3.1.3`.
- Never create, mint, or map `D44` during rollback.

## Validation Required

```bash
node build-scripts/references/check-mtu-h3b-incidence-cli-execution-packet.js
node build-scripts/references/check-mtu-h3a-incidence-cli-mutation-plan.js
node build-scripts/references/check-mtu-h3-incidence-pass-through-review.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Projection Guardrails

Generated projections refresh only after authorized source mutation. Authored
source includes `references/authored/course-target-exercises.json`. Generated
projections include owned-content graph, RAG chunks, procedure/PV reports, and
inventories. No PV projection or PV machine promotion is authorized.

## Recommended Next Action

Commit and push this packet and cited evidence, then run
GATE-MTU-H3B before any `D07` update, `D41`/`D42`/`D43`/`D45`/`D46` minting,
`D44` work, target-exercise mapping update, generated projection refresh,
lesson handoff, or student-facing exposure.

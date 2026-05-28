# MTU-H3 Incidence Pass-Through Skill Family Review

Generated: 2026-05-28

Status: review packet ready, no mutation authorized.

Remote evidence prerequisite: this packet, the GATE-MTU-H3 review packet, and
all cited evidence must be committed and pushed to the normal remote branch
before human review starts.

## Authority Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, unit
deprecation, target-exercise mutation, candidate-storage creation, candidate
writes, lesson-output mutation, target-exercise promotion, generated projection
refresh, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student/product use is authorized by MTU-H3.

## Evidence Base

- `references/reference-team-roadmap.md`
- `reports/sprints/MTU-H2J-result.md`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json` as read-only context
- `engines/skilltree/generators.js` as read-only context

## Live Unit Evidence

| Unit | Current role | Review issue |
|---|---|---|
| `D07` | Heffing pass-through percentage from original price, consumer price, and tax amount | May be too broad: also mentions producer remainder and elasticity explanation |
| `D05` | New equilibrium and tax revenue after accijns | Support for tax equilibrium, not necessarily pass-through percentage |
| `A23` | Evenwicht met heffing and distribution language | May overlap with D07 and may import `A15` elasticity too early |
| `A41` | After-tax or after-subsidy supply function and Pc/Pp | Useful support for tax/subsidy price-split routes |
| `A93` | Percentage price change after cost change | Explicitly not incidence or pass-through share |
| `D19` | Subsidy and Pareto efficiency | Conceptual subsidy welfare lane, not subsidy incidence |
| `D29` | Subsidy deadweight-loss lane | Welfare loss lane, not benefit-sharing lane |

## Target-Exercise Evidence

| Record | Current mapping | Finding |
|---|---|---|
| `3.1.1` Belastingen: wig en nieuw evenwicht | `A06`, `A23`, `A41`, `D05`, `D07` | Over-trigger risk: asks equilibrium, Pc/Pp, and tax wedge drawing, but not afwentelingspercentage |
| `3.1.2` Belastingdruk en welvaartsverlies | `A10`, `A19`, `A23`, `A32`, `A40`, `D03`, `D07` | D07-style lane is appropriate, but amount split, percentage split, and elasticity explanation may need separation |
| `3.1.3` Subsidies | `A06`, `A10`, `A19`, `A27`, `A41`, `D19`, `D29` | No dedicated subsidy incidence or benefit-sharing unit |
| `4.1.6` Overheidsingrijpen bij marktfalen | `A06`, `A23`, `F05`, `F06`, `F10`, `F18` | Pigouvian tax uses A23; context only for this review |

## Planning-Only Candidate Lanes

These IDs are route labels for review, not live IDs or mutation authority.

| Lane | Status | Review scope |
|---|---|---|
| `D07` | live update/narrowing candidate | Tax afwentelingspercentage from `P0`, `Pc`, and tax amount |
| `D41` | absent planning ID | Tax wedge and Pc/Pp graphical labeling without percentage pass-through |
| `D42` | absent planning ID | Tax burden amounts split between consumer and producer before percentage conversion |
| `D43` | absent planning ID | Subsidy equilibrium and effective consumer/producer price split |
| `D44` | absent planning ID | Subsidy benefit-sharing between consumer and producer |
| `D45` | absent planning ID | Explain incidence with relative demand and supply elasticities |
| `D46` | absent planning ID | Cost-shock pass-through share, distinct from A93 percentage price change |

## Main Review Questions To Resolve

- Should `D07` be narrowed to tax afwentelingspercentage only?
- Should `3.1.1` route to a tax-wedge/Pc/Pp lane instead of `D07`?
- Should tax burden amount and tax percentage pass-through be separate units?
- Should subsidy incidence receive dedicated lanes, or remain covered by
  `A41`, `D19`, and `D29`?
- Should elasticity explanation become a separate conceptual lane?
- Should cost-shock pass-through be separated from `A93` price-change
  calculation?

## Recommended Next Action

Run GATE-MTU-H3 human review after this packet and all cited evidence have
been pushed to the normal remote branch. Do not execute mutation from this
packet.

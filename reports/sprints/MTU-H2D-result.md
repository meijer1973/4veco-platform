# Sprint MTU-H2D: Result

Generated: 2026-05-28

Status: completed.

## Plan reference

Plan: `reports/sprints/MTU-H2D-plan.md`

## Summary

MTU-H2D completed the non-mutating resolution packet for the Solo q1-q3 lanes
that were held or conditional after MTU-H2C:

- `A12`
- `A20`
- `A88`
- `A89`
- `A90`
- `A92`
- `A93`

The sprint did not mutate `references/machine/` or `references/external/`, did
not mint units, did not update or split units, did not create candidate
storage, and did not mutate lesson output.

## Lane outcomes

| Unit | Outcome |
|---|---|
| `A12` | Revised for later review: keep `A2.11` and optionally add `A2.10`/`A2.12` if the human gate accepts the monopoly derivative-MO context. |
| `A20` | Held for a separate split/deprecate/replacement and affected-mapping packet because target exercise `4.1.2` uses current `A20` in a given-MK context. |
| `A88` | Revised for later review as a zero-needs scale-factor reliability unit, removing the original `A61` dependency. |
| `A89` | Revised for later review as a zero-needs GO-as-price recognition unit, removing the original `A04` dependency. |
| `A90` | Revised for later review as the linear GO-rule MO route; table/graph non-calculus variants are deferred. |
| `A92` | Revised for later review, but only after `A89` is accepted or executed. |
| `A93` | Revised for later review to depend on `A38` and `A92`, dropping `A66`; broader incidence/pass-through remains MTU-H3. |

## Generator status

The sprint found that `GEN_A12` and `GEN_A20` already have skill-tree
generator implementations as `GEN.A12` and `GEN.A20`; later semantic changes
to those units require generator impact review.

`GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and `GEN_A93` are proposed
generator fields, but no matching skill-tree generator implementations are
present in this baseline. Later work must implement the relevant generators,
explicitly record generator-blocked/non-interactive status, or prove the units
are not exposed to the skill-tree route before student-facing exposure.

## Artifacts

- `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.json`
- `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.md`
- `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.json`
- `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.md`
- `build-scripts/references/check-mtu-h2d-held-conditional-resolution.js`
- `references/data/sprints/MTU-H2D.result.json`

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js` | passed |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2D-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-H2D` | passed |
| `node build-scripts/references/build-unit-index.js` | passed |
| `node build-scripts/references/validate-core-schemas.js` | passed |
| `node build-scripts/references/check-mtu-h2-solo-cases.js` | passed |
| `node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js` | passed |
| `node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js` | passed |
| `node build-scripts/references/build-source-document-registry.js` | passed |
| `node build-scripts/references/build-reference-inventory.js` | passed |
| `node build-scripts/references/check-source-document-registry.js` | passed |
| `node build-scripts/references/check-source-manifest.js` | passed |
| `node build-scripts/references/check-document-inventory.js` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `npm.cmd test -- --runInBand` | passed |
| `git diff --check` | passed |

## Changed files

Primary H2D artifacts:

- `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.json`
- `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.md`
- `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.json`
- `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.md`
- `build-scripts/references/check-mtu-h2d-held-conditional-resolution.js`

Sprint and roadmap evidence:

- `reports/sprints/MTU-H2D-result.md`
- `reports/sprints/MTU-H2D-diff-summary.md`
- `references/data/sprints/MTU-H2D.plan.json`
- `references/data/sprints/MTU-H2D.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.92-mtu-h2c-reduced-scope-cli-execution.md`

Generated registries and indexes refreshed:

- `references/data/source-document-registry.json`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `reports/json/source-document-registry.json`
- `reports/markdown/source-document-registry.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`

## Data integrity notes

No protected reference data changed. H2C units `F19`, `F20`, `A85`, `A86`,
`A87`, and `A91` remain present. Conditional units `A88`, `A89`, `A90`,
`A92`, and `A93` remain absent. `A12` and `A20` remain live but unchanged.

No candidate storage files were created. The pre-existing untracked
`knowledge/exit-ticket-game-1.1.1.zip` file remained untouched and uncommitted.

## Open follow-ups

- Run GATE-MTU-H2D human review.
- If accepted, prepare a later bounded CLI execution packet for revised
  `A12`, `A88`, `A89`, `A90`, `A92`, and `A93`.
- Keep `A20` in a separate split/deprecate/replacement and affected-mapping
  packet.
- Continue MTU-H3 incidence/pass-through and MTU-H4 answer-form lanes.

## Rollback instructions

No CLI mutation was executed in MTU-H2D. If the planning artifacts are rejected,
revise or delete only the H2D packet/checker/log artifacts; do not edit
`references/machine/`.

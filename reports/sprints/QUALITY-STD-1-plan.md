# Sprint QUALITY-STD-1: Planning Quality Standard Enforcement

## Goal

Move quality-driving language to the point where agents form sprint plans, and
enforce it mechanically in platform sprint-plan validation.

## Context

The repositories already contain strong review and gate language, but agents
need the quality floor before implementation begins. This sprint adds
operational planning language and checker enforcement for specification
fulfilment, rendered-output proof, student-facing usefulness, target-exercise
alignment, and proof required to close.

## Quality Standard

The expected outcome is a complete, coherent implementation of the stated
specification within the authorized scope. The quality floor is specification
fulfilment, rendered output proof where applicable, student-facing usefulness,
review proof, and named follow-up work for omitted requirements.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Plans state a quality floor | AGENTS and planning docs updated | diff review | complete |
| Plans connect requirements to proof | `check-sprint-plan.js` requires fulfilment matrix | focused Jest | complete |
| Plans classify improvements safely | quality improvement section and labels required | focused Jest | complete |
| Plans name proof required to close | checker validates proof section | focused Jest and bundle check | complete |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Enforce quality headings in sprint-plan checker | `include_now` | Directly moves quality pressure into planning. |
| Rewrite all historical plans | `reject_scope_creep` | Historical records should remain traceable unless reopened. |
| Finish wider review-packet reform | `defer_named_follow_up` | Owned by REV-STD-1, not this checker-focused sprint. |

## Allowed paths

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `docs/sprints/README.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-plan.test.js`
- `reports/sprints/QUALITY-STD-1-*`
- `references/data/sprints/QUALITY-STD-1.*.json`
- `reports/sprints/GAME-UX-2-plan.md`
- refreshed maps, inventories, dashboards, URL indexes, and roadmap bookkeeping
- sibling lesson specification, roadmap, and sprint-record files needed for the
  same governance change

## Forbidden paths

- generated lesson output
- `references/machine/`
- `references/external/`
- protected reference mutation
- external-source mutation
- machine-reference mutation
- unit minting
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, summative use, PV
  projection, PV machine promotion, or product-use authorization

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `docs/sprints/README.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `reports/sprints/GAME-UX-2-plan.md`

## Outputs

- Quality-driven execution language in both repo instructions.
- Planning quality floor in the companion specification.
- Quality-standard guidance in paragraph-build instructions.
- Lead-reviewer specification-fulfilment instructions.
- Sprint-plan checker enforcement for quality sections.
- Focused checker tests.
- Current GAME-UX-2 plan compatibility update.

## Operationalized sprint procedure

1. Read the stable product specification, companion specification, current
   platform sprint checker, current GAME-UX-2 plan, and lead-reviewer
   instructions.
2. Add quality-driven execution language to both repo instruction files and the
   companion specification. Stop if the language only describes failure
   avoidance rather than specification fulfilment proof.
3. Add paragraph-build and sprint-planning guidance that requires quality
   standard, specification fulfilment matrix, quality improvement candidates,
   and proof required to close.
4. Harden `check-sprint-plan.js` so it rejects plans missing those sections or
   lacking rendered output, student-facing, proof, and follow-up language.
5. Add focused Jest tests for passing and failing plan cases.
6. Update the current GAME-UX-2 plan so existing completed-bundle validation
   remains compatible with the stricter checker. Stop if this requires
   changing historical generated output or protected reference data.
7. Run focused tests, active scope-language checks, GAME-UX-2 plan/bundle
   checks, full Jest, map/index refreshes, and inventory checks.

## Acceptance tests

```bash
npm.cmd test -- --runInBand build-scripts/sprints/check-sprint-plan.test.js
npm.cmd test -- --runInBand build-scripts/sprints/check-scope-language.test.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-2 --complete
node build-scripts/sprints/check-sprint-bundle.js QUALITY-STD-1 --complete
npm.cmd run check:scope-language
npm.cmd test
```

## Proof Required to Close

Close only when proof shows the focused tests prove the checker behavior, the
current GAME-UX-2 bundle still validates, active scope-language validation
passes, full Jest passes, and refreshed maps/inventories are current.

## Rollback plan

Revert the governance documentation changes, checker changes, focused tests,
and GAME-UX-2 plan compatibility update. Do not touch generated lesson output
or protected reference data.

## Human review required

No separate human-review gate is required for this checker-focused governance
sprint. REV-STD-1 remains the later human review-standard hardening sprint.

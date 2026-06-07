# Sprint MTU-ANS-GEN-DESIGN-1: Answer-Form Generator And Proof Design

Generated: 2026-06-07

## Goal

Design the next governed route for answer-form and source-use MTUs `A80`,
`A81`, and `A96`-`A99` after `MTU-GENBLOCK-HARDEN-1` proved that they are
blocked from accidental route exposure.

This sprint does not implement generators, does not expose the units in
student-facing routes, and does not authorize product use. It decides what
kind of generator or reviewed non-interactive proof each answer-form unit
actually needs before a later implementation sprint can safely begin.

## Context

`MTU-H4C` minted six reusable answer-form/source-use units:

- `A80` Noem of geef-aan antwoord geven
- `A81` Bron gebruiken in een antwoord
- `A96` Bereken-vraag beantwoorden
- `A97` Leg-uit-dat antwoord opbouwen
- `A98` Leg-uit-of antwoord opbouwen
- `A99` Leg uit met voorbeeld beantwoorden

`MTU-GENBLOCK-HARDEN-1` then proved these units do not leak into interactive
or route exports while their generators are missing. That guardrail is now
merged on `main`.

The open problem is not simply "write six randomizers." These units are
answer-form wrappers and, in the case of `A81`, a source-use modifier that must
combine with an underlying answer form. A naive skill-tree generator could turn
them into shallow quiz drills or standalone route items, which would violate
the H4 gate boundary and the product end-state requirement that practice and
proof preserve the target-operation chain.

## Quality Standard

Quality floor: the sprint must satisfy the specification by producing a
reviewable design that classifies each of `A80`, `A81`, and `A96`-`A99` as one
of: implementable skill-tree generator, shared-task-shell proof design,
route-only non-interactive support, or held pending more evidence. The design
must name the required student action, underlying task family, validation
owner, route behavior, rendered output proof, and stop condition for each unit.
Rendered output and student-facing lesson publication are out of scope for
this sprint; any omitted rendered proof must be named as follow-up work.
Proof must include validator/test evidence that blocked units remain blocked
during the design sprint and lead-review evidence that the design does not
overclaim product authority.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Preserve generator-blocked exposure guardrails. | No changes to `engines/skilltree/generators.js`, source-data, or generated lesson output; readiness checker still reports zero blocked leaks. | `check-skilltree-generator-readiness.js` and diff review. | planned |
| Classify each answer-form/source-use unit by appropriate proof route. | `reports/sprints/MTU-ANS-GEN-DESIGN-1-generator-proof-design.md` maps `A80`, `A81`, `A96`, `A97`, `A98`, and `A99` to generator/proof/hold route. | Lead review checks every unit has action, validation owner, route behavior, rendered proof requirement, and stop condition. | planned |
| Keep `A81` as modifier plus underlying answer form. | Design records compatible underlying forms and forbids standalone A81 proof. | Review checks no standalone `A81` route or target-equivalent claim is proposed. | planned |
| Avoid shallow answer-form drills. | Design links each unit to a concrete task-family or constructed-response pattern and required evidence. | Review checks against product-end-state operation-chain requirements and H4 gate boundaries. | planned |
| Produce a later implementation handoff. | Handoff names allowed files, generated proof, required screenshots/checkers, and human-review gate for any later implementation sprint. | `MTU-ANS-GEN-DESIGN-1-implementation-handoff.md` reviewed before closure. | planned |
| Keep product authority blocked. | Result metadata and roadmap update preserve false flags for diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1, product-route adoption, and student/product use. | Sprint result and lead-review round 2 inspect blocked claims. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Design a per-unit proof-route matrix for `A80`, `A81`, and `A96`-`A99`. | include_now | This is the core unblocker before implementation. |
| Require generated route screenshots in the later implementation sprint. | include_now | The design must name rendered proof even though this sprint will not produce it. |
| Add a small checker for the design matrix shape. | include_now | Prevents a vague plan from passing as a real implementation handoff. |
| Implement `GEN_A80`, `GEN_A81`, or `GEN_A96`-`GEN_A99` now. | defer_named_follow_up | Implementation must wait until the proof route is reviewed. |
| Expose answer-form units in `ROUTE_SKILLS` as ordinary route rows. | reject_scope_creep | This would undo the exposure hardening and overclaim product authority. |
| Treat `A81` as a standalone source-use skill without an underlying answer form. | reject_scope_creep | H4B/H4C explicitly define `A81` as modifier-only. |

## Allowed paths

- `reports/sprints/MTU-ANS-GEN-DESIGN-1-plan.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-baseline.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-planning-review.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-generator-proof-design.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-implementation-handoff.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-result.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-diff-summary.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-verification-review.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-assignment.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round1.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-corrections.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round2.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-command-log.jsonl`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-command-log.md`
- `references/data/sprints/MTU-ANS-GEN-DESIGN-1.plan.json`
- `references/data/sprints/MTU-ANS-GEN-DESIGN-1.result.json`
- `build-scripts/references/check-mtu-answerform-generator-design.js`
- `references/reference-team-roadmap.md`
- repository map, URL-index, and dashboard artifacts if this sprint is closed

## Forbidden paths

- No hand edits to `references/machine/` or `references/external/`.
- No unit minting, unit update, unit deprecation, or dependency mutation.
- No `references/authored/course-target-exercises.json` mutation.
- No source-data writes.
- No generated lesson output or lesson-target writes.
- No `engines/skilltree/generators.js` implementation changes in this design sprint.
- No `engines/skilltree/base-elements.js` or `scripts/deploy.js` exposure changes.
- No fake placeholder generators.
- No PV projection publication or PV machine promotion.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, Scale Gate 1, product-route adoption, product-wide use, or
  student/product authority.

## Inputs

- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `references/reference-team-roadmap.md`
- `reports/sprints/MTU-H4C-result.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-result.md`
- `reports/json/skilltree-generator-readiness.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `references/machine/micro-teaching-units.json`
- `engines/skilltree/generators.js`
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `reports/sprints/REASON-REFINE-1-answer-form-integration-plan.md`
- `reports/sprints/REASON-ANSWERFORM-2-answer-form-scaffold-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md`

## Outputs

- A generator/proof design:
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-generator-proof-design.md`
- A later implementation handoff:
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-implementation-handoff.md`
- Optional design checker:
  - `build-scripts/references/check-mtu-answerform-generator-design.js`
- Sprint records:
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-plan.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-baseline.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-planning-review.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-result.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-diff-summary.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-verification-review.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-assignment.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round1.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-corrections.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round2.md`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-command-log.jsonl`
  - `reports/sprints/MTU-ANS-GEN-DESIGN-1-command-log.md`
  - `references/data/sprints/MTU-ANS-GEN-DESIGN-1.plan.json`
  - `references/data/sprints/MTU-ANS-GEN-DESIGN-1.result.json`

## Operationalized sprint procedure

1. Record this plan, baseline, plan metadata, and planning review before any
   design/checker edits. Stop if the plan does not preserve generator-blocked
   exposure guardrails or if it treats `A81` as standalone proof.
2. Re-read the H4C, GENBLOCK, reasoning answer-form, and task-ingest evidence
   listed in Inputs. Extract the exact answer-form/source-use constraints for
   `A80`, `A81`, and `A96`-`A99`.
3. Draft a per-unit generator/proof design matrix. For each unit, name:
   student action, interaction/proof family, validation owner, route behavior,
   dependency on underlying content/answer form, rendered proof required later,
   and stop conditions.
4. Add a shape checker for the design matrix if the matrix is stored in a
   checkable format or can be checked from markdown headings/tables. Stop if
   the checker cannot distinguish a concrete handoff from vague prose.
5. Write an implementation handoff that names the later sprint options:
   skill-tree generator implementation, shared-task-shell route proof, or held
   status. The handoff must name allowed files and proof artifacts for the
   later implementation sprint.
6. Run readiness and sprint validators. Blocked units must remain blocked:
   zero interactive leaks and zero route leaks.
7. Produce result, diff summary, verification review, and structural
   lead-review assignment/round 1/corrections/round 2 before closure.
8. Refresh maps/indexes only if closure artifacts or roadmap rows changed.
   Commit and push the completed design sprint after validation.

Stop conditions:

- Stop if implementation appears necessary to make the design credible; split
  the work and ask for explicit implementation authorization.
- Stop if the design would expose blocked units in `ROUTE_SKILLS` or
  interactive `SKILLS` before reviewed implementation proof.
- Stop if `A81` is proposed as standalone proof without a compatible
  underlying answer form.
- Stop if any plan claims diagnostics, adaptive routing, mastery/sequencing,
  target-equivalent proof, product-route adoption, Scale Gate 1, or
  student/product use.
- Stop if lead review returns REVISE, FAIL, or PAUSE until corrections are
  complete.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-ANS-GEN-DESIGN-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-GEN-DESIGN-1
node build-scripts/references/check-mtu-answerform-generator-design.js
node build-scripts/references/check-skilltree-generator-readiness.js
node build-scripts/references/check-mtu-evidence-layer.js
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/check-sprint-command-log.js MTU-ANS-GEN-DESIGN-1
node build-scripts/sprints/check-lead-review-substance.js MTU-ANS-GEN-DESIGN-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-ANS-GEN-DESIGN-1-result.md
node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-GEN-DESIGN-1 --complete
git diff --check
```

## Proof Required to Close

Proof required to close: the design matrix classifies all six units; `A81`
remains modifier-only; blocked-unit readiness still reports zero interactive
and route leaks; the design checker passes; the result and handoff name the
later implementation proof artifacts and review gate; lead-review round 2
returns PASS or PASS WITH FLAGS; and the diff shows no protected reference
mutation, source-data write, generated lesson output, generator implementation,
route exposure change, PV projection, or product-authority expansion.

## Rollback plan

Revert the design sprint commit. That removes the planning/design artifacts,
optional design checker, roadmap/index updates, and sprint records. No
protected reference rollback is needed because the sprint must not mutate
`references/machine/`, `references/external/`, source-data, generator runtime,
or generated lesson output.

## Human review required

No human review is required for this design sprint if it remains
non-implementing and non-student-facing. Structural lead review is required
before closure. A later implementation sprint that exposes any currently
blocked unit to a student-facing route, generated lesson output, or
target-equivalent proof must receive a separate review gate with rendered
evidence.

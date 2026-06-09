# INSPECT-6 Sprint Plan

Status: planned
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising record: `archive/sprints/INSPECT-6/INSPECT-6-authorisation.md`

## Purpose

INSPECT-6 plans a future report-only generator for Dutch quality-standards
evidence packs.

It does not implement the generator and does not generate an evidence pack.
Its job is to make the generator plan operational enough that teacher,
legal/privacy, and Dutch quality-inspection reviewers can decide whether one
bounded INSPECT-7 prototype is safe to authorise.

## Quality Floor

The plan must prove that a future generator can be designed without unsafe
claims or weak evidence being hidden:

- every future generated claim cites concrete product or review evidence;
- planning documents can explain context but cannot be the sole proof for a
  product claim;
- every category has `4veco evidence`, `school evidence still needed`,
  `weak/missing evidence`, and `forbidden inference`;
- a Dutch vwo economics teacher or school leader can understand the planned
  future output in 5-10 minutes, with scope, safe-use note, evidence summary,
  weak/missing evidence, school-owned evidence, and recommended next action
  visible without reading the full technical contract;
- OP0 remains subject-material economics evidence only;
- no personal data enters packs by default;
- safe-claim IDs/templates are required for generated prose;
- semantic overclaiming review is required because exact phrase checks are not
  enough;
- stale evidence and source freshness are visible;
- target-exercise finality, `PASS WITH FLAGS`, and target-equivalent proof
  states stay visible;
- INSPECT-7's prototype scope, input source contract, validation strategy, and
  stop conditions are explicit before any prototype is authorised.

## Allowed Outputs

```text
archive/sprints/INSPECT-6/INSPECT-6-authorisation.md
archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md
archive/sprints/INSPECT-6/INSPECT-6-planning-review.md
archive/sprints/INSPECT-6/INSPECT-6-correction-log.md
archive/sprints/INSPECT-6/INSPECT-6-generator-planning-packet.md
archive/sprints/INSPECT-6/INSPECT-6-validation-log.md
archive/sprints/INSPECT-6/INSPECT-6-lead-review-assignment.md
archive/sprints/INSPECT-6/INSPECT-6-lead-review-round1.md
archive/sprints/INSPECT-6/INSPECT-6-lead-review-round2.md
archive/sprints/INSPECT-6/INSPECT-6-external-review-results.md
archive/sprints/INSPECT-6/INSPECT-6-closure-log.md
docs/inspection-standards/report-only-generator-plan.md
docs/inspection-standards/evidence-pack-source-contract.md
docs/inspection-standards/evidence-pack-validation-and-dispatch.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/roadmap-version-index.json when version metadata changes
generated maps/reports when roadmap, archive, or review-packet URLs require refresh
```

## Forbidden Work

Do not add:

```text
build-scripts/inspection/build-inspection-pack.js
any report-only generator implementation
reports/inspection-standards/*.md generated evidence pack
reports/inspection-standards/*.json generated evidence pack
teacher inspection pack generator
package.json script integration
CI or check:platform integration
dashboard gate
Scale Gate integration
quality-ref integration
country overlay
generated lesson-output mutation
student-level personal-data processing
legal compliance claim
AVG/GDPR compliance claim
inspectorate approval claim
inspection-ready claim
certification claim
complete OP0/basic-skills claim
school-obligation-satisfied claim
PTA validity claim
summative assessment validity claim
classroom implementation claim
```

## Operational Procedure

1. Record INSPECT-5R closure and tri-agent `MORE_THAN_SATISFIED`
   authorisation as the basis for INSPECT-6 planning-only work.
2. Create this sprint plan before implementation.
3. Send the plan to a planning/review agent before writing the generator
   planning packet.
4. Create `docs/inspection-standards/report-only-generator-plan.md` with:
   purpose, non-goals, architecture, source flow, output shape, teacher-facing
   sections, safe-claim rules, stale evidence handling, validation strategy,
   semantic overclaiming review, and stop conditions.
5. Create `docs/inspection-standards/evidence-pack-source-contract.md` with:
   allowed source types, required source fields, evidence-strength ordering,
   finality/status fields, privacy boundary, OP0/product-school boundary,
   path-citation rules, and forbidden source types.
6. Create `docs/inspection-standards/evidence-pack-validation-and-dispatch.md`
   with: future generator validation steps, reviewer packet requirements,
   dispatch metadata, CI proof/waiver rule, and INSPECT-7 readiness checks.
7. Create `archive/sprints/INSPECT-6/INSPECT-6-generator-planning-packet.md`
   for external review. The packet must cite official-source boundary anchors
   for OP0/privacy/claim safety: Inspectie OP0, Inspectie bijgestelde
   onderzoekskaders 2025, Autoriteit Persoonsgegevens verantwoordingsplicht,
   and Autoriteit Persoonsgegevens DPIA.
8. Update the roadmap and ledger so INSPECT-6 is active/closed as planning
   only and INSPECT-7 remains candidate work until tri-agent review passes and
   the owner authorises one bounded prototype.
9. Validate JSON/markdown references, stale next-step language, forbidden
   scope, roadmap version index, URL index, branch/worktree safety, lesson
   repo read-only status, and full platform checks.
10. Run lead-review round 1, record corrections in
    `archive/sprints/INSPECT-6/INSPECT-6-correction-log.md`, and run round 2.
11. Push the reviewed packet and send it to teacher, legal/privacy, and Dutch
    quality-inspection reviewers.
12. If any reviewer returns `REVISE` or `PASS`, implement their changes and
    record them in the correction log, then repeat validation, lead review,
    push, and tri-agent review.
13. Close INSPECT-6 only after all three reviewers return
    `MORE_THAN_SATISFIED`.

## Acceptance Criteria

- INSPECT-6 stays planning-only.
- No generator implementation, generated evidence pack, package script,
  dashboard gate, quality-ref integration, Scale Gate integration, lesson
  output mutation, personal-data processing, or compliance/approval claim is
  added.
- The generator plan defines source inputs, evidence citations, output shape,
  stale evidence handling, safe-claim IDs/templates, forbidden paraphrase
  families, semantic overclaiming review, validation strategy, and dispatch
  metadata.
- The source contract requires every future claim to cite concrete product or
  review evidence.
- The source contract separates source/product evidence from diagnostic
  reports and planning records.
- The source contract includes target-exercise finality, target-equivalent
  proof status, `PASS WITH FLAGS`, OP0 boundary, product/school boundary, and
  privacy fields.
- INSPECT-7 readiness criteria name the bounded candidate scope and state what
  evidence must be present before one prototype can be generated.
- The review packet includes calibration checks, role-specific questions,
  evidence links, stop conditions, direct comment prompts, final pushed commit,
  remote push status, validation proof, CI proof/waiver, correction-log
  pointer, and official-source boundary anchors for OP0/privacy/claim safety.
- The planned future teacher-facing output is understandable to a Dutch vwo
  economics teacher or school leader in 5-10 minutes, with `4veco evidence`,
  `school evidence still needed`, weak/missing evidence, and forbidden
  inference visibly separated.
- Teacher, legal/privacy, and Dutch quality-inspection reviewers each return
  `MORE_THAN_SATISFIED`.

## Stop Conditions

Stop and report if:

- planning reveals that a generator implementation is needed to finish
  INSPECT-6;
- a generated evidence pack is needed to satisfy a reviewer;
- evidence citations would have to rely on planning documents alone;
- source freshness or stale evidence cannot be made visible;
- personal data would need to enter a pack;
- OP0 cannot stay subject-material and bounded;
- teacher-facing usefulness requires school-level or inspectorate claims;
- branch/worktree safety fails;
- lesson output would have to change;
- any external reviewer returns `REVISE` or `PASS` after the correction loop
  cannot produce a stronger packet.

## Required Next Action

Have a planning/review agent check this INSPECT-6 plan. After planning review
passes, implement only the authorised planning documents and review packet,
then validate, lead-review, push, and send the packet for teacher,
legal/privacy, and Dutch quality-inspection `MORE_THAN_SATISFIED` review.

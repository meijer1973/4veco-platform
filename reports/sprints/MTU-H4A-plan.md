# Sprint MTU-H4A: Answer-Form CLI-Mutation Planning Packet

Date: 2026-05-29

Status: planned after GATE-MTU-H4 closure.

## Goal

Prepare a bounded, non-mutating CLI-mutation planning packet for the
answer-form lanes accepted by GATE-MTU-H4. The packet must propose exact
answer-form unit IDs and specs for later review, keep held lanes visible,
preserve the EX answer-skill overlay boundary, and define validation,
rollback, source-mutation, candidate-storage, target-exercise field, projection,
lesson-output, and product-use boundaries.

This sprint must not execute unit-add, mint answer-form MTUs, create candidate
storage, write candidate records, mutate target exercises, refresh generated
projections, produce lesson output, or authorize student/product use.

## Context

GATE-MTU-H4 closed PASS WITH CONDITIONS for answer-form/question-type routing
only. It accepted the hybrid boundary:

```text
1. reusable answer-form MTUs for broad student procedures;
2. EX answer-skill overlays for correction-model-specific answer construction;
3. later authored-reference fields for question_type / answer_form mappings.
```

The gate authorized only this later bounded planning packet. It required this
packet to:

- carry `ANS_MOTIVEER_CLASSIFICATIE` as a held Type 4 lane;
- treat `ANS_BRON_GEBRUIKEN` as source-use plus an underlying answer form, not
  as a standalone complete answer form;
- keep graph/draw/shade planning-only until stronger mapping evidence exists;
- keep analysis/evaluation held;
- keep q3/q15 EX answer-skill overlays visible with no writes;
- block candidate storage creation and target-exercise field writes.

## Quality Standard

The quality floor is an execution-reviewable planning packet, not mutation.
The specification must name exact proposed answer-form unit IDs, specs, ID-space
constraints, generator-block implications, held-lane treatment, command
templates, rollback expectations, validation proof, review questions, and every
student-facing or product-use block. Rendered output is out of scope: future
student-facing practice engines may use these decisions only after later
governed source mutations and product-quality gates. Proof must come from the
packet checker, sprint bundle validation, source/read-only baseline evidence,
and a clean no-mutation diff. Follow-up must be explicit: run GATE-MTU-H4A,
revise this packet, or hold for a named evidence or ID-policy gap.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exact accepted answer-form specs | Packet proposes exact IDs and unit-add specs for accepted H4 lanes only | Checker validates specs against the live catalog without mutating it | planned |
| H4 conditions preserved | Packet carries Type 4 held lane, bron modifier boundary, graph planning-only status, analysis held status, and q3/q15 EX overlays | Reviewer can approve, revise, or hold each condition separately | planned |
| ID-space pressure visible | Packet proves `A100` is invalid and names the available A-domain slots used or held | Reviewer can approve ID allocation or require an ID-policy sprint | planned |
| No hidden candidate or target mutation | Candidate storage remains absent and target exercises still have no answer-form fields | Validator and diff prove no candidate storage or target fields changed | planned |
| Review gate prepared | GATE-MTU-H4A packet has calibration questions, ten planned questions, stop conditions, and remote-before-review prerequisite | Human review can run one question at a time after remote publication | planned |
| No product authority | Packet blocks generated projection refresh, lesson output, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, and student/product use | Authority flags and review packet repeat the block | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Include simulated unit-add specs for accepted lanes | `include_now` | GATE-MTU-H4 authorized exact planning for accepted answer-form lanes. |
| Make A-domain ID pressure a review question | `include_now` | The catalog ID format permits `A00`-`A99`; six proposed answer-form units consume most remaining available A slots. |
| Keep graph, Type 4, and analysis/evaluation as held planning lanes | `include_now` | H4 conditions require these lanes to stay visible without minting now. |
| Execute unit-add directly from H4A | `reject_scope_creep` | H4 authorized planning only, not execution. |
| Create `answer-skill-candidates.json` or target-exercise fields now | `reject_scope_creep` | H4 explicitly blocks storage creation, candidate writes, and target-exercise field mutation. |
| Decide student-facing task UI from this packet alone | `defer_named_follow_up` | GAME-UX-3A owns shared task-type UX foundation after H4A conditions are visible. |

## Allowed paths

- `reports/mtu-hardening/*h4a*`
- `reports/review-gates/GATE-MTU-H4A-*`
- `reports/sprints/MTU-H4A-*`
- `references/data/sprints/MTU-H4A.*.json`
- `build-scripts/references/check-mtu-h4a-*.js`
- roadmap, roadmap archive, generated index, source registry, document
  inventory, URL index, and GitHub agent index updates

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- CLI mutation of `A80`, `A81`, or `A96`-`A99`
- any use of invalid `A100` or higher A-domain IDs
- unit minting, unit updates, unit splits, or unit deprecation
- candidate-storage creation
- operation-candidate or answer-skill-candidate writes
- target-exercise `question_type`, `answer_form`, or mapping writes
- generated projection refresh based on unexecuted source mutation
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H4-answer-form-question-type-routing/gate-closure.json`
- `reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json`
- `reports/sprints/MTU-H4-plan.md`
- `reports/sprints/MTU-H4-baseline.md`
- `reports/json/exam-question-extraction-gaps.json`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json`
- `references/machine/micro-teaching-units.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating MTU-H4A answer-form CLI-mutation planning packet.
- A non-mutating checker for the H4A packet and review packet.
- A GATE-MTU-H4A human review packet if the planning packet is
  evidence-complete.
- Sprint baseline, result, and diff logs.
- No protected reference mutation, no candidate storage, no candidate writes,
  no target-exercise mutation, no generated projection refresh, no lesson
  output, and no student-facing output.

## Operationalized sprint procedure

1. Verify baseline and remote state: `origin/main` equals `HEAD`, the worktree
   has no unexpected tracked changes, H4 closure exists, candidate storage is
   absent, and target exercises still lack `question_type` and `answer_form`
   fields.
2. Audit ID capacity and live MTU state. Stop if any proposed live answer-form
   lane uses `A100` or higher, collides with a live ID, or consumes held `A71`
   without an explicit reviewer decision.
3. Draft exact unit-add specs for accepted lanes only. Stop if a spec hides
   `bron` as a standalone complete answer form, treats graph or Type 4 as live
   minting, or hides analysis/evaluation inside another lane.
4. Simulate the catalog with the proposed specs using the unit-add validator
   and full catalog validator. Stop if schema, ID, generator, term,
   exam-code, or dependency validation fails.
5. Write held-lane records for graph/draw/shade, Type 4
   motiveer/classificatie, and analysis/evaluation with no unit-add command.
6. Write the GATE-MTU-H4A review packet with calibration questions, planned
   review questions, current stop conditions, command/rollback requirements,
   and no mutation/product authority.
7. Run acceptance tests and update sprint logs, roadmap, and indexes. If the
   packet asks for a human gate, publish it to remote before any review, show
   the calibration questions and planned review questions, ask one question at
   a time, record each answer, run pattern analysis, ask targeted follow-ups,
   draft a closure proposal, and require explicit human confirmation before
   any closure or downstream execution-packet scope is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H4A-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H4A --complete
node build-scripts/references/check-mtu-h4a-answer-form-cli-mutation-plan.js
node build-scripts/references/check-mtu-h4-answer-form-question-type-routing.js
node build-scripts/references/check-operation-answer-skill-candidates.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include remote-before-review publication,
simulated catalog validation, exact spec reviewability, held-lane visibility,
ID-space pressure disclosure, sprint bundle proof, roadmap and index
validation, no protected-reference or authored target mutation, no candidate
storage or candidate writes, no projection refresh, and a clear next action:
run GATE-MTU-H4A, revise the packet, or hold for a named evidence or ID-policy
gap.

## Rollback plan

MTU-H4A must not mutate protected reference data, authored target-exercise
records, candidate storage, generated projections, or lesson output. If the
planning packet is rejected, revise or remove only the H4A packet, checker,
review packet, sprint logs, bundle URLs, and roadmap/index updates. Any later
execution packet must carry its own rollback path for machine-reference
mutation, generated projections, authored mapping writes, and student-facing
exposure blocks.

## Human review required

A human review is required before any answer-form MTU minting, answer-skill
candidate storage creation, candidate write, target-exercise question-type or
answer-form mapping update, generated projection refresh, lesson output, or
student/product use. The interview must show the full question list first,
then ask one question at a time, record answers, analyze patterns, ask
targeted follow-ups, draft a closure proposal, and require explicit human
confirmation before writing a gate closure or authorizing downstream execution
scope.

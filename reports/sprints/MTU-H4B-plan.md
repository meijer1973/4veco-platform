# Sprint MTU-H4B: Answer-Form Bounded CLI Execution Packet

Date: 2026-05-30

Status: planned after GATE-MTU-H4A closure.

## Goal

Prepare a non-mutating CLI execution packet for the answer-form lanes accepted
by GATE-MTU-H4A. The packet must make a later bounded execution sprint
reviewable for `A80`, `A81`, and `A96`-`A99`, including exact `unit-add`
commands, ID-allocation proof, simulated catalog validation, exam-code
validation, generator/exposure blocks, rollback, and review questions.

## Context

GATE-MTU-H4A closed as PASS WITH CONDITIONS for CLI-mutation planning only. It
authorized only this execution-packet preparation sprint and no execution. The
accepted lanes are:

```text
A96 - ANS_BEREKEN
A97 - ANS_LEG_UIT_DAT
A98 - ANS_LEG_UIT_OF
A99 - ANS_LEG_UIT_MET_VOORBEELD
A80 - ANS_NOEM_GEEF_AAN, with split-if-needed condition
A81 - ANS_BRON_GEBRUIKEN, only as source-use modifier plus an underlying answer form
```

The H4A closure also keeps graph/draw/shade, Type 4 motiveer/classificatie, and
analysis/evaluation held; keeps q3/q15 EX answer-skill overlays visible with no
candidate writes; and requires a future A-domain ID-policy or namespace decision
after the bounded `A80`, `A81`, and `A96`-`A99` allocation.

## Quality Standard

The quality floor is an execution-reviewable specification, not mutation. The
packet must provide exact command strings, exact JSON specs, exact command
order, no-dry-run disclosure, simulated validation, generator and rendered
output exposure boundaries, student-facing blocks, rollback, proof
requirements, and named follow-up work. Student-facing output is not produced
in this sprint; rendered output proof means proving that no broken generated
student route can expose the planned answer-form units before a later generator
or non-interactive status review.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Bounded accepted lanes only | H4B packet includes exact commands only for `A80`, `A81`, and `A96`-`A99` | Reviewer can see graph, Type 4, analysis/evaluation, and EX overlays stay out of command set | planned |
| ID allocation condition | Packet proves `A100` invalid, `A71` held, `A80`/`A81`/`A96`-`A99` absent and available, and future A-domain growth needs policy | Reviewer can approve, revise, or hold execution authority based on ID pressure | planned |
| Simulated catalog validation | Checker simulates appending all six unit specs and runs schema, dependency, zero-needs, and exam-code validation | Validator passes without writing protected reference data | planned |
| Generator and exposure boundary | Packet records generator IDs, current implementation status, and no student-facing exposure authority | Reviewer can require generator implementation or generator-blocked/non-interactive proof before any exposure | planned |
| Review gate prepared | GATE-MTU-H4B packet has calibration questions, ten review questions, stop conditions, and remote-before-review prerequisite | Human review can run one question at a time after remote publication | planned |
| No mutation | No protected reference mutation, target-exercise write, candidate storage, projection refresh, lesson output, or product use | Diff and validators prove only packets/logs/checkers/roadmap indexes changed | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Convert reviewed H4A specs into exact compact `unit-add --spec` commands | `include_now` | Later execution must be reviewable without reconstructing the command payload from prose. |
| Add an explicit ID-policy follow-up for future A-domain growth | `include_now` | H4A accepted this bounded allocation but flagged remaining A-domain pressure. |
| Implement answer-form generators during H4B | `reject_scope_creep` | H4A authorized execution-packet preparation only; generator implementation needs its own reviewed sprint. |
| Add target-exercise `question_type` or `answer_form` fields | `reject_scope_creep` | H4A kept authored target-exercise mapping writes in a separate future packet. |
| Carry graph, Type 4, and analysis/evaluation as held lanes | `defer_named_follow_up` | The closure requires stronger evidence before those answer-form lanes can be minted. |

## Allowed paths

- `reports/mtu-hardening/*h4b*`
- `reports/review-gates/GATE-MTU-H4B-*`
- `reports/sprints/MTU-H4B-*`
- `references/data/sprints/MTU-H4B.*.json`
- `build-scripts/references/check-mtu-h4b-*.js`
- `build-scripts/references/build-mtu-h4b-*.js`
- roadmap, roadmap archive, generated index, source registry, document
  inventory, URL index, and GitHub agent index updates

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct `unit-add` execution for `A80`, `A81`, or `A96`-`A99`
- any use of `A100` as a valid ID
- consuming `A71` without a separate reviewer decision
- minting graph/draw/shade, Type 4 motiveer/classificatie, or analysis/evaluation lanes
- treating `bron` as a standalone complete answer form
- target-exercise `question_type` or `answer_form` writes
- creating or writing answer-skill candidate storage
- generated projection refresh based on unexecuted mutations
- lesson-output mutation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `reports/review-gates/GATE-MTU-H4A-answer-form-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json`
- `reports/review-gates/GATE-MTU-H4-answer-form-question-type-routing/gate-closure.json`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json`
- `references/machine/micro-teaching-units.json`
- `references/external/syllabus-eindtermen.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/build-unit-index.js`
- `reports/json/skilltree-generator-readiness.json`
- `references/reference-team-roadmap.md`

## Outputs

- A non-mutating H4B CLI execution packet.
- A GATE-MTU-H4B human review packet if the execution packet is
  evidence-complete.
- A non-mutating checker for the H4B packet and review packet.
- Sprint result and diff logs.
- No protected reference mutation, no authored target-exercise mutation, no
  candidate storage creation, no generated projection refresh, no lesson
  output, and no student-facing output.

## Operationalized sprint procedure

1. Verify the post-GATE-MTU-H4A baseline: `A80`, `A81`, and `A96`-`A99` are
   absent; `A100` is invalid; `A71` remains unused and held; target exercises
   still lack `question_type` and `answer_form` fields; candidate storage is
   absent; and the H4A closure is PASS WITH CONDITIONS. Stop if any baseline
   condition has drifted.
2. Convert the accepted H4A unit specs into exact compact `unit-add --spec`
   command strings. Stop if any command includes a held lane, uses `A100`,
   consumes `A71`, treats `bron` as standalone, or hides q3/q15 EX overlay
   needs inside broad MTUs.
3. Simulate the catalog with all six planned units appended. Run spec,
   duplicate-ID, dependency, zero-needs, aspect, term, and exam-code validation
   without writing `references/machine/` or `references/external/`. Stop if any
   validation fails.
4. Record generator/exposure handling: planned generator IDs may be missing,
   so later execution must either implement generators or prove
   generator-blocked/non-interactive status before any student-facing route
   exposes these units. Stop if the packet implies rendered output or product
   use from this sprint.
5. Write the GATE-MTU-H4B review packet with calibration questions, planned
   questions, stop conditions, rollback and validation requirements, and no
   mutation/product authority.
6. Run validators and sprint checks. If the packet asks for a human gate, show
   all calibration questions and planned review questions, ask one at a time,
   record each answer, analyze patterns, ask targeted follow-ups, draft a
   closure proposal, and require explicit human confirmation before any later
   execution sprint is authorized.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H4B-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H4B --complete
node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js
node build-scripts/references/check-mtu-h4a-answer-form-cli-mutation-plan.js
node build-scripts/references/check-mtu-h4-answer-form-question-type-routing.js
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

Proof required to close must include remote-before-review publication, exact
command payloads, simulated catalog validation, exam-code validation,
generator/exposure boundary proof, sprint bundle proof, roadmap and index
validation, no protected-reference or authored target mutation, no candidate
storage, no projection refresh, and a clear next action: run GATE-MTU-H4B,
revise the packet, or hold for a named evidence gap.

## Rollback plan

MTU-H4B should not mutate protected reference data, authored target-exercise
records, generated projections, candidate storage, or lesson output. If the
packet is rejected, revise or remove only the H4B packet, checker, review
packet, sprint logs, bundle URLs, and roadmap/index updates. Any later
execution sprint must carry its own rollback path for unit additions, generated
reports, and student-facing exposure blocks.

## Human review required

A human review is required before any `A80`, `A81`, or `A96`-`A99` unit
minting, target-exercise field update, candidate storage creation, generated
projection refresh, lesson output, or student/product use. The interview must
show the full question list first, then ask one question at a time, record
answers, analyze patterns, ask targeted follow-ups, draft a closure proposal,
and require explicit human confirmation before writing a gate closure or
authorizing execution.

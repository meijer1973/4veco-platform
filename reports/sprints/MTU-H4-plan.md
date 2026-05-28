# Sprint MTU-H4: Answer-Form MTUs And Question-Type Mapping

Date: 2026-05-28

Status: planned from roadmap v3.09 after MTU-H3C execution.

## Goal

Prepare a non-mutating answer-form and question-type routing packet. The
packet must decide whether a later bounded planning or execution packet should
create answer-form MTU lanes, answer-skill candidate overlay lanes, or both for
exam verbs such as `bereken`, `leg uit`, `leg uit met voorbeeld`,
`analyseer`, `arceer/grafisch`, `geef aan`, `noem`, and source-based answer
forms.

This sprint must not mint answer-form units, create candidate storage, write
candidate records, mutate target exercises, refresh generated projections, or
publish student-facing output.

## Context

MTU-H1/H2/H3 established that micro-teaching units must be anchored in target
exercise and correction-model operations rather than syllabus prose. The
MTU-H2 solo q1-q3 operation map left two answer-form needs visible for this
sprint:

```text
q1 - leg uit met voorbeeld beantwoorden
q2 - bereken-vraag beantwoorden
```

The EX-5/EX-7 exam-ingestion track also created a dry-run-only answer-skill
candidate schema and CLI path. That path is useful for correction-model answer
construction requirements, but persistent candidate storage and candidate
writes remain unauthorized. MTU-H4 must therefore clarify the boundary between
general reusable answer-form MTUs and exam-item-specific answer-skill
candidates.

Current evidence shows:

- `references/authored/course-target-exercises.json` has no `question_type` or
  `answer_form` fields.
- `reports/json/exam-question-extraction-gaps.json` records existing
  `question_type` values: `uitleg_dat`, `uitleg_of`, `berekenen`, `noem`, and
  `bron`.
- `references/authored/vraagtypen-en-opgaveontwerp.md` defines seven VWO exam
  question-type patterns and answer-model conventions.
- `references/data/exam-ingestion/operation-answer-skill-contract.*` keeps
  future answer-skill candidates overlay-first and mutation-blocked.

## Quality Standard

The quality floor is a review-ready routing specification, not a mutation
packet. It must make the answer-form architecture explicit, preserve the EX
answer-skill candidate boundary, list accepted and held lane groups, identify
exact evidence for each proposed route, and provide human review questions
before any later CLI-governed mutation or candidate-write path is prepared.
Rendered output is explicitly out of scope: any future student-facing or
lesson-rendered output must wait for a later authorized mutation/product gate.
Proof must come from cited evidence, packet checker output, sprint bundle
validation, and a clean no-mutation diff rather than from informal approval.
The follow-up must be explicit: run GATE-MTU-H4, revise the packet, or stop
for a named evidence gap.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Baseline evidence recorded | Sprint baseline names current question-type values, absent target-exercise fields, live MTU state, and EX dry-run-only candidate status | Reviewer can reproduce why H4 is routing-only | planned |
| Answer-form boundary proposed | Packet separates reusable answer-form MTUs from correction-model answer-skill candidates | Reviewer can approve, revise, or hold the boundary | planned |
| Question-type mapping route proposed | Packet maps current `question_type` values to proposed answer-form lanes without writing source data | Reviewer can decide whether mappings are sufficient | planned |
| Review gate prepared | GATE-MTU-H4 packet has calibration questions, ten planned questions, stop conditions, and remote-before-review prerequisite | Human review can run one question at a time after remote publication | planned |
| No mutation | No protected reference mutation, candidate storage, candidate writes, target-exercise writes, or lesson output | Diff and validators prove only packet/checker/log/roadmap files changed | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Define a reusable `bereken` answer-form lane | `include_now` | H2 q2 and the question-type taxonomy require formula, substitution, intermediate calculation, unit, and final conclusion. |
| Define reusable `leg uit` and `leg uit met voorbeeld` lanes | `include_now` | H2 q1 and common exam patterns require answer construction beyond content knowledge. |
| Keep q3/q15 correction-model answer skills in EX overlay route | `include_now` | EX-5 explicitly treats threshold conclusion/unit-direction and two-step correction-model explanation as answer-skill candidates, not live MTU writes. |
| Prepare exact CLI mutation or candidate-write specs | `defer_named_follow_up` | H4 must first close a routing gate before a later packet can name exact MTU specs, target-field writes, or candidate records. |
| Write `question_type` fields to target exercises now | `reject_scope_creep` | Target-exercise mapping fields are authored-reference changes and need a later exact packet. |
| Create `answer-skill-candidates.json` now | `reject_scope_creep` | EX-7 dry-run CLIs intentionally leave persistent candidate storage absent. |

## Allowed paths

- `reports/mtu-hardening/*h4*`
- `reports/review-gates/GATE-MTU-H4-*`
- `reports/sprints/MTU-H4-*`
- `references/data/sprints/MTU-H4.*.json`
- `build-scripts/references/check-mtu-h4-*.js`
- roadmap, roadmap archive, generated index, source registry, document
  inventory, URL index, and GitHub agent index updates

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- MTU unit minting or unit update execution
- candidate-storage creation
- operation-candidate or answer-skill-candidate writes
- target-exercise field or mapping writes
- generated projection refresh based on unexecuted source mutation
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`
- `reports/json/exam-question-extraction-gaps.json`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json`
- `references/machine/micro-teaching-units.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`

## Outputs

- A non-mutating MTU-H4 answer-form/question-type routing packet.
- A GATE-MTU-H4 human review packet if the routing packet is
  evidence-complete.
- A non-mutating checker for the H4 packet and review packet.
- Sprint baseline, result, and diff logs.
- No protected reference mutation, no candidate storage, no candidate writes,
  no target-exercise mutation, no generated projection refresh, no lesson
  output, and no student-facing output.

## Operationalized sprint procedure

1. Verify baseline and remote state: `origin/main` equals `HEAD`, the worktree
   has no unexpected tracked changes, H3C is complete, `MTU-H4` is active, and
   pre-existing unrelated local files are explicitly ignored.
2. Read the H4 evidence set and record the baseline: existing
   `question_type` values, absent target-exercise answer-form fields, relevant
   H2 deferred answer-form needs, EX answer-skill contract state, and live MTU
   catalog evidence.
3. Draft the H4 routing packet. Stop if the packet authorizes unit minting,
   candidate storage, candidate writes, target-exercise writes, projection
   refresh, or student/product use.
4. Propose lane groups with clear boundaries:
   - reusable answer-form MTU candidates for broad answer procedures;
   - EX answer-skill candidate lanes for correction-model-specific answer
     construction;
   - held lanes where evidence is too thin or source extraction is blocked.
5. Write the GATE-MTU-H4 review packet with calibration questions, planned
   review questions, current stop conditions, and no mutation/product
   authority.
6. Add a non-mutating checker that validates packet structure, authority
   flags, evidence paths, question-type baseline, absent candidate storage,
   and review-question completeness.
7. Run acceptance tests and update sprint logs, roadmap, and indexes. If the
   packet asks for a human gate, publish it to remote before any review, show
   the calibration questions and planned review questions, ask one question at
   a time, record each answer, run pattern analysis, ask targeted follow-ups,
   draft a closure proposal, and require explicit human confirmation before
   any closure or downstream authorization.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H4-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H4 --complete
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

Proof required to close must include remote-before-review publication, baseline
evidence, answer-form/answer-skill boundary reviewability, question-type
mapping reviewability, sprint bundle proof, roadmap and index validation, no
protected-reference or authored target mutation, no candidate storage or
candidate writes, no projection refresh, and a clear next action: run
GATE-MTU-H4, revise the packet, or hold for a named evidence gap.

## Rollback plan

MTU-H4 must not mutate protected reference data, authored target-exercise
records, candidate storage, generated projections, or lesson output. If the
packet is rejected, revise or remove only the H4 packet, checker, review
packet, sprint logs, bundle URLs, and roadmap/index updates. Any later
execution or candidate-write sprint must carry its own rollback path.

## Human review required

A human review is required before any answer-form MTU minting, answer-skill
candidate storage creation, candidate write, target-exercise question-type
mapping update, generated projection refresh, lesson output, or
student/product use. The interview must show the full question list first,
then ask one question at a time, record answers, analyze patterns, ask targeted
follow-ups, draft a closure proposal, and require explicit human confirmation
before writing a gate closure or authorizing downstream sprint scope.

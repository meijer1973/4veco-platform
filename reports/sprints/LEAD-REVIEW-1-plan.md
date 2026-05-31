# Sprint LEAD-REVIEW-1: Lead-Review Protocol Repair

Generated: 2026-05-31

## Goal

Repair sprint protocol enforcement so non-trivial roadmap sprints cannot close
without a real lead-review cycle, and future human-review gates receive lead
review before they are sent to a human reviewer.

## Context

Recent platform sprints closed with plans, baselines, planning reviews, result
records, validation evidence, and remote publication, but several did not carry
the structural lead-review files required by `AGENTS.md` and the current
roadmap procedure. MTU sprints with human gate artifacts are excluded from
retroactive re-review by explicit user decision, but future human gates must add
lead review before human review.

## Quality Standard

The quality floor is specification fulfilment with enforceable review protocol,
not just after-the-fact file creation. Proof must include rendered output where
student-facing claims are involved, command/exit-code evidence for tests, a
lead-reviewer-agent audit of recent sprint bundles, student-facing or product
boundary checks where relevant, and named follow-up work for any missing review
or evidence. This sprint itself is not student-facing, but it protects
student-facing quality by making review evidence non-optional.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Roadmap sprints use lead review before closure | Bundle checker treats lead review as required for new sprints unless an explicit exemption is recorded | Checker validation plus this sprint's own lead-review cycle | planned |
| Future human gates have lead review before human review | Human-review sprint metadata must identify lead-review phase as `before_human_gate` | Validator failure when future human-review plans omit the phase | planned |
| Recent non-MTU/non-human-gated sprints receive real audit | Lead reviewer agent inspects SPEC-ET-1, EX-LESSON-1, GAME-UX-3A, ENGINE-OP-1, and SKILLMAP-OP-1 evidence | Lead-review round reports with actual findings and correction/recheck logs | planned |
| MTU human-gated sprints are not redundantly re-reviewed | Sprint scope excludes MTU-H4A/H4B/H4C and their gates | Result and diff summary name the exclusion and rationale | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add prospective lead-review enforcement to `check-sprint-bundle.js` | `include_now` | The current checker allows silent opt-out through metadata. |
| Produce actual lead-review reports for recent non-human-gated sprints | `include_now` | The user explicitly requested real testing by the lead-reviewer agent. |
| Redo MTU human-gated reviews | `reject_scope_creep` | The user explicitly said MTU sprints already have human gate artifacts. |
| Add a richer dedicated validator for lead-review report content | `defer_named_follow_up` | The immediate repair should enforce presence and metadata; deeper semantic lint can follow after the lead-review cycle is restored. |

## Allowed paths

- `build-scripts/sprints/check-sprint-bundle.js`
- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `reports/sprints/*lead-review*.md`
- `reports/sprints/LEAD-REVIEW-1-*`
- `references/data/sprints/*.plan.json`
- `references/data/sprints/*.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- generated repository maps and URL indexes

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- generated lesson output under `../4veco-lessen/Boek *`
- MTU human-review gate closure rewrites
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `AGENTS.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-bundle.js`
- Recent sprint bundles for SPEC-ET-1, EX-LESSON-1, GAME-UX-3A, ENGINE-OP-1,
  and SKILLMAP-OP-1
- MTU-H4A/H4B/H4C human gate artifacts as exclusion context only

## Outputs

- Updated sprint bundle checker.
- LEAD-REVIEW-1 plan, baseline, result, diff summary, metadata, and lead-review
  cycle.
- Actual lead-review reports for recent non-MTU/non-human-gated sprints.
- Updated sprint metadata so lead-review evidence is enforced by
  `check-sprint-bundle.js --complete`.
- Roadmap and index refresh.

## Operationalized sprint procedure

1. Read the lead-review protocol, validator behavior, and recent sprint bundles.
   Stop if the repair would require protected reference mutation or generated
   lesson-output edits.
2. Patch the sprint bundle checker so future sprint plans created after the
   policy date require lead review unless an explicit exemption is recorded, and
   future human-review sprint plans require `lead_review_phase:
   before_human_gate`.
3. Invoke the lead-reviewer agent to inspect SPEC-ET-1, EX-LESSON-1,
   GAME-UX-3A, ENGINE-OP-1, and SKILLMAP-OP-1. Record the lead reviewer's
   findings as review artifacts; do not substitute bookkeeping for the review.
4. Apply any required correction pass named by the lead reviewer, update result
   metadata, and send the corrected bundles back for one lead-review recheck.
   Stop if the recheck verdict is not PASS or PASS WITH FLAGS.
5. Run sprint bundle checks for the repaired recent sprints and this sprint.
   Run roadmap, report, scope-language, URL-index, and diff checks.
6. Refresh maps/indexes, fetch/prune, commit, push, and report the pushed
   hashes. If remote state has diverged, stop and report the reconciliation
   requirement.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/LEAD-REVIEW-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-1
node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1 --complete
node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1 --complete
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A --complete
node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1 --complete
node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1 --complete
node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-1 --complete
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

## Proof Required to Close

Proof required to close must include the lead-reviewer-agent audit artifacts,
correction logs, round-2 recheck logs with PASS or PASS WITH FLAGS, complete
sprint bundle validation for the repaired recent sprints and LEAD-REVIEW-1,
report JSON validation, roadmap version validation, scope-language validation,
URL-index validation, diff checks, refreshed repository maps/indexes, and a
clear next action: resume GRAPH-UX-2 after process repair.

## Rollback plan

If this sprint is rejected, revert the checker patch, LEAD-REVIEW-1 records,
lead-review metadata changes, retroactive lead-review artifacts, roadmap/index
updates, and generated maps. Do not edit protected references, generated lesson
output, target-exercise mappings, answer-skill candidate storage, or MTU gate
closures as part of rollback.

## Human review required

No interactive human review gate is required for this process repair because
the user explicitly authorized the repair in this thread. A lead-review cycle is
required for this sprint and must be completed before closure. Future human
review gates must carry lead review before the human interview starts.

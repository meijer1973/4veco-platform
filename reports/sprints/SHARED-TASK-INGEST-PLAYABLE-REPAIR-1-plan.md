# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-1: Shared Task Ingest Playable Lab Repair

Date: 2026-06-04

Status: planned repair sprint after `GATE-SHARED-TASK-INGEST-REPAIR-1`
returned `hold_for_playable_repair`.

## Goal

Repair the actual-exam and textbook-source review labs so they demonstrate
real task-family affordances, collapsed support/hints, concrete
student-facing instructions, semantic answer checking, and wrong/retry proof.

This sprint responds to returned direct human comments for
`GATE-SHARED-TASK-INGEST-REPAIR-1`. It does not close that gate, authorize
generated lesson output, mutate protected references, mutate source data,
adopt product routes, claim target-equivalent completion, add diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Context

The previous packet repaired layout but overclaimed playability. Human review
accepted the source-authority basis and source/question layout direction, then
returned `hold_for_playable_repair` because the labs still used generic review
controls, did not semantically evaluate answers, exposed support too early,
and lacked wrong/retry evidence.

The authoritative inputs are the returned direct comments, the existing
TaskShellEngine-backed transform JSON files, and the open gate artifacts. The
repair must improve the review lab and evidence layer while preserving the
actual-exam external-primary authority and the textbook owned-source boundary.

## Quality Standard

The quality floor is a review-only lab that a human can use to judge whether
source/context ingestion can become a meaningful student-facing task surface
later. A lab is not playable merely because buttons exist. It must show the
real task-family controls in rendered output and must prove that wrong input is
rejected while a correct input can pass.

For every rendered task card, the student-facing surface must answer:

1. What exactly do I have to do?
2. What inputs am I allowed to use?
3. What does a complete answer look like, without giving away derived answers?

The review surface remains a lab, not product output. It may show guided
practice support only in collapsed boxes and may not present correction-model
operations as default source material.

This specification is the returned human review packet plus the repo rule that
student-facing quality cannot be inferred from layout proof alone. Follow-up
work remains named below because this sprint prepares revised proof, not gate
closure.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|
| Real task-family controls | value/role banks, formula tokens, step banks, source-chain nodes, actual table options, numeric/point/calculation/structured fields | rendered labs and proof JSON | planned |
| Semantic checking | `Controleer` rejects wrong input and accepts correct input for all rendered families | wrong/retry/correct/completed proof cases | planned |
| Concrete task prompts | every card states action, input source, answer form, and count expectation | rendered text and checker snapshots | planned |
| Source/support split | source and prompt visible; formula/procedure/correction-model support collapsed by default | rendered labs, proof JSON, checker | planned |
| No generic controls | no `Keuze A/B`, no blank sequence textarea-only controls, no generic source-value fields | checker fails on generic controls | planned |
| Review evidence | desktop initial, wrong/retry, corrected, completed; mobile completed; dark-mode completed | screenshots and manifests | planned |
| Gate decision recorded | direct comments and comment-resolution log show `hold_for_playable_repair` | gate artifacts | in progress |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|
| Reuse one shared lab renderer for both transformations | include_now | keeps actual-exam and textbook proof aligned |
| Preserve existing TaskShellEngine-backed task JSON | include_now | avoids inventing new answer semantics |
| Add structural affordance proof fields | include_now | prevents future layout-only regressions |
| Keep derived answer leakage visible-check based, not source-code based | include_now | semantic checking needs answer keys in script, but they must not be visible to reviewers |
| Product-route integration | defer_named_follow_up | requires a passed gate and controlled adoption-preparation sprint |
| Student-facing accessibility/focus proof in real route | defer_named_follow_up | later adoption-preparation sprint |
| Gate closure JSON | defer_named_follow_up | blocked until fresh human review and explicit closure confirmation |
| Broad shared task-shell engine adoption | reject_scope_creep | not authorized by a hold-for-repair decision |

## Omitted Requirements / Follow-up Work

| Omitted requirement | Reason |
|---|---|
| Product route integration | out of scope until repaired gate passes |
| Student-facing accessibility/focus proof in real route | later adoption-preparation sprint |
| Gate closure JSON | blocked until fresh human review and explicit closure confirmation |
| Broad shared task-shell engine adoption | requires gate pass and controlled adoption plan |

## Allowed paths

- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1*`
- `references/data/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1.plan.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/direct-review-comments.*`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/comment-resolution-log.*`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.*`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/live-output-evidence.*`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/bundle-urls.md`
- `build-scripts/sprints/task-ingest-playable-lab.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/**`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/**`
- repository maps, URL indexes, and dashboard files required for remote review

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- source exercise data under `source-data/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product routes or deployed generated lesson output
- `gate-closure.md` or `gate-closure.json` for the open gate

## Inputs

- returned direct comments in
  `C:\Users\meije\.codex\attachments\3e63554c-b97b-4398-b24d-6d5247c09112\pasted-text.txt`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/direct-review-comments.md`
- `engines/task-shell-engine.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-baseline.md`
- `references/data/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1.plan.json`
- revised `build-scripts/sprints/task-ingest-playable-lab.js`
- revised capture scripts for both transformation labs
- revised transformation checkers for both labs
- revised gate packet checker
- regenerated actual-exam lab, proof JSON, screenshot manifest, and screenshots
- regenerated textbook lab, proof JSON, screenshot manifest, and screenshots
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-planning-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-planning-review-resolution.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-verification-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-assignment.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-round1.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-corrections.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-round2.md`
- command-log evidence for all acceptance commands

## Repaired Evidence Output Contract

Actual-exam lab fixed outputs:

| Proof case ID | PNG path | Required proof state |
|---|---|---|
| `desktop-initial` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-initial.png` | source/prompt visible, support collapsed, no completed cards |
| `desktop-wrong-retry` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-wrong-retry.png` | at least one wrong answer rejected with retry feedback |
| `desktop-corrected` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-corrected.png` | the same task corrected and accepted |
| `desktop-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-completed.png` | all six tasks semantically completed |
| `mobile-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-completed.png` | mobile light completed state with source/question readability |
| `mobile-dark-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark-completed.png` | mobile dark completed state |

Actual-exam fixed metadata paths:

- lab HTML: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- proof JSON: `reports/json/task-ingest-transform2-actual-exam-proof.json`
- screenshot manifest: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- screenshot directory manifest: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/manifest.json`
- checker: `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`

Textbook lab fixed outputs:

| Proof case ID | PNG path | Required proof state |
|---|---|---|
| `desktop-initial` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-initial.png` | source/prompt visible, support collapsed, no completed cards |
| `desktop-wrong-retry` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-wrong-retry.png` | at least one wrong answer rejected with retry feedback |
| `desktop-corrected` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-corrected.png` | the same task corrected and accepted |
| `desktop-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-completed.png` | all nine tasks semantically completed |
| `mobile-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-completed.png` | mobile light completed state with source/question readability |
| `mobile-dark-completed` | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark-completed.png` | mobile dark completed state |

Textbook fixed metadata paths:

- lab HTML: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- proof JSON: `reports/json/task-ingest-transform3-textbook-proof.json`
- screenshot manifest: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- screenshot directory manifest: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/manifest.json`
- checker: `build-scripts/sprints/check-task-ingest-transform3-textbook.js`

The gate packet checker
`build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
must assert that both proof JSON files contain these six case IDs and that the
corresponding PNG files exist.

## Operationalized sprint procedure

1. Record returned direct comments and open comment-resolution log for
   `GATE-SHARED-TASK-INGEST-REPAIR-1`.
2. Insert `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1` into both roadmaps and keep
   the gate open with `hold_for_playable_repair`.
3. Run planning review. Stop if the plan does not enumerate concrete rendered
   lab outputs, wrong/retry evidence, semantic validation, and support-policy
   checks.
4. Replace generic lab controls with real renderers for all required families.
5. Add support-role inference: prompt/source visible; formula/procedure and
   correction-model operation support collapsed by default.
6. Add concrete student-facing instructions per card.
7. Add semantic validation and demo APIs for wrong/retry, corrected, and
   completed states.
8. Update capture scripts to capture at least initial, wrong/retry, corrected,
   completed, mobile, and dark-mode evidence.
9. Update checkers to fail on generic controls, visible default support,
   missing affordance banks, missing semantic validation, or missing retry
   proof.
10. Run verification review and lead-review round 1/round 2 before claiming
    the repair evidence is ready for renewed human review.
11. Refresh the review packet with calibration questions for the renewed human
    review, answer recording instructions, pattern analysis instructions,
    targeted follow-ups protocol, closure proposal protocol, and explicit
    human confirmation requirement.
    The packet must preserve the exact phrase explicit human confirmation.
12. Refresh maps/indexes, commit, push, and report the reviewed remote commit.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 --active
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js
node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
```

## Review Gate

The review gate is a repair-readiness gate, not a closure gate. Lead review must
inspect rendered task controls per family, visible banks/options/tokens/steps,
collapsed support policy, concrete wording, wrong/retry behavior, semantic
checking, mobile/dark evidence, and the continued authority boundaries.

After this sprint, `GATE-SHARED-TASK-INGEST-REPAIR-1` still requires a fresh
direct human review before any closure proposal.

## Proof Required to Close

Proof required to close this repair sprint, not the human gate, is:

- both repaired labs render real task-family affordances and no generic
  fallback controls;
- both proof JSON files include initial, wrong/retry, corrected, completed,
  mobile, and dark-mode cases;
- both transform checkers pass with semantic validation, support-policy, and
  task-affordance assertions;
- the gate checker records returned comments and the open
  `hold_for_playable_repair` resolution without gate closure;
- planning review, verification review, and lead review are recorded;
- validators and repository maps/indexes are current;
- the repair evidence is committed and pushed for renewed human review.

## Stop Conditions

- Any protected reference, source-data, or Book 1 generated-output drift.
- Any default-visible correction-model operation support in the actual-exam
  source pane.
- Any rendered `Keuze A` / `Keuze B` where concrete options exist.
- Any source-value task without visible value and role banks.
- Any formula/order/source-chain task rendered as a blank textarea-only
  control.
- Any proof that reaches completion without a wrong/retry rejection and
  corrected pass.
- Any closure or product-authority claim before renewed human review.

## Rollback plan

If the repair cannot satisfy semantic validation without exposing answers in
visible text, revert the lab helper/capture/checker changes and leave the gate
as `hold_for_playable_repair` with a blocker for a deeper TaskShellEngine route
integration sprint.

If a protected path or generated output drift appears, stop, restore the drift,
and do not continue until the boundary violation is resolved.

## Human review required

Yes. This sprint prepares revised evidence only. It does not close
`GATE-SHARED-TASK-INGEST-REPAIR-1`. A new direct human review must inspect the
repaired labs and decide whether the gate can later pass with flags/conditions
or remains on hold.

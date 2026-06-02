# Sprint GATE-REASON-STD-1: Reasoning Unified Task-Shell Human Evidence Review

Generated: 2026-06-02

Status: direct-comment human-review packet preparation; no human review
comments started; no product authority.

## Goal

Prepare the direct-comment human review packet for `GATE-REASON-STD-1`, the
gate that reviews whether the current reasoning route evidence from
`REASON-STD-1`, `REASON-ADOPT-1`, `REASON-PLAY-1`, and
`REASON-ANSWERFORM-2` is coherent enough as a unified shared task-shell
reasoning practice system.

This sprint prepares the packet, evidence summary, screenshot manifest,
checker, and pre-gate lead-review artifacts. It does not run the human review,
close the gate, broaden generated output, mutate source data, authorize
target-equivalent reasoning proof, or authorize product use.

## Context

This gate follows the reasoning sprint chain:

- `REASON-STD-1` mapped reasoning modes into shared standard families.
- `REASON-ADOPT-1` adopted proven shared-shell reasoning tasks into generated
  Book 1 reasoning routes.
- `REASON-PLAY-1` captured playability screenshots and separate
  usability-agent evidence.
- `REASON-ANSWERFORM-2` added local answer-form scaffold cues and mode
  dispositions.

Human review protocol has changed. Reviewers now comment directly on the review
packet by default; one-question-at-a-time interviews are used only for targeted
follow-ups if comments are ambiguous or conflict on authority.

## Quality Standard

The quality floor is a human-review packet that lets reviewers inspect actual
rendered output and student-facing reasoning practice proof, not
architecture-only claims. The packet must satisfy the specification and present
proof while naming every follow-up instead of hiding weak areas. It
must present:

- shared task-shell adoption for modes 0, 1, 3, and 5;
- playability and usability evidence;
- answer-form scaffold proof for A97/A98/A99/A81 patterns;
- honest held/local status for modes 2 and 4;
- carried UX flags;
- explicit no-authority boundaries.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|
| Reasoning route uses shared task-shell families where proven. | `REASON-STD-1`, `REASON-ADOPT-1`, proof JSON, screenshots. | Human reviewer decides whether modes 0/1/3/5 are acceptable as wrapped local practice routes. | planned |
| Route is playable enough for practice-route reliance. | `REASON-PLAY-1` proof, screenshots, usability-agent artifacts. | Human reviewer decides whether carried UX flags are blockers or follow-ups. | planned |
| Answer-form scaffolds improve reasoning route without target-proof leakage. | `REASON-ANSWERFORM-2` scaffold map, screenshots, route checker. | Human reviewer decides whether A97/A98/A99/A81 scaffolding is acceptable as local practice evidence. | planned |
| Held/local lanes are honest. | Mode disposition docs. | Human reviewer verifies mode 2 local status, mode 3 bridge status, and mode 4 held status. | planned |
| Human review can use direct packet comments. | Review packet with comment prompts and evidence links. | Checker verifies direct-comment protocol and rejects old interview-default language. | planned |
| No product authority leaks. | Packet authority flags and checker. | Checker and lead review verify no target-equivalent, diagnostics, mastery, sequencing, Scale Gate 1, or product use. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Copy representative screenshots into the gate folder for easier review. | include_now | Improves human review evidence without changing implementation. |
| Add a direct-comment packet protocol modeled on the task-family gate. | include_now | Required by updated human-review workflow. |
| Add a custom gate checker for evidence, authority, and lead-review state. | include_now | Keeps the packet deterministic and prevents authority leakage. |
| Repair compact controls, dual feedback, mobile route placement, or dark theme consistency. | defer_named_follow_up | Real UX flags, but implementation repair is out of scope for this non-mutating gate packet sprint. |
| Build full visual flow-diagram construction. | defer_named_follow_up | Belongs in a later flow/dual-coding implementation sprint, not this gate packet. |
| Claim target-equivalent constructed-response proof from mode 5. | reject_scope_creep | The current evidence is self-check/local practice only. |

## Allowed paths

- `reports/sprints/GATE-REASON-STD-1-*`
- `references/data/sprints/GATE-REASON-STD-1.plan.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/`
- `build-scripts/review-gates/check-gate-reason-std1-review-packet.js`
- repository maps, URL indexes, and internal dashboard files required for
  reviewer navigation.

## Forbidden paths

- No engine implementation changes.
- No generated lesson output changes.
- No source reasoning CSV edits.
- No protected reference mutation in `references/machine/` or
  `references/external/`.
- No target-exercise field writes.
- No candidate storage or candidate writes.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use.
- No human gate closure before direct human comments are received and resolved.

## Inputs

- `reports/sprints/REASON-STD-1-result.md`
- `reports/sprints/REASON-ADOPT-1-result.md`
- `reports/sprints/REASON-PLAY-1-result.md`
- `reports/sprints/REASON-ANSWERFORM-2-result.md`
- `reports/json/reason-std1-proof.json`
- `reports/json/reason-adopt1-proof.json`
- `reports/json/reason-play1-screenshot-proof.json`
- `reports/json/reason-play1-usability.json`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- reasoning screenshot manifests and screenshot folders;
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/GATE-REASON-STD-1-plan.md`
- `reports/sprints/GATE-REASON-STD-1-baseline.md`
- `references/data/sprints/GATE-REASON-STD-1.plan.json`
- `reports/sprints/GATE-REASON-STD-1-lead-review-assignment.md`
- `reports/sprints/GATE-REASON-STD-1-lead-review-round1.md`
- `reports/sprints/GATE-REASON-STD-1-lead-review-corrections.md`
- `reports/sprints/GATE-REASON-STD-1-lead-review-round2.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/review-packet.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/review-packet.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/live-output-evidence.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/live-output-evidence.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/screenshot-manifest.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/screenshots/`
- `build-scripts/review-gates/check-gate-reason-std1-review-packet.js`

## Operationalized sprint procedure

1. Verify the closed reasoning evidence chain and confirm the lesson repository
   is clean before creating the gate packet. Stop if cited evidence is missing.
2. Create the direct-comment review packet, live-output evidence,
   screenshot-manifest, JSON packet, and checker. The packet must show
   calibration checks, planned comment prompts, direct-review protocol,
   stop conditions, and no-authority boundaries.
3. Run the sprint plan/bundle checks and the custom gate checker. If the gate
   checker fails because lead-review round files are not present yet, continue
   only to create the lead-review assignment and request the real lead review.
4. Run pre-gate lead review before human review. If round 1 returns REVISE,
   record corrections and run round 2. Stop if round 2 does not pass.
5. Run validators and evidence checkers again after corrections. Refresh
   repository maps, URL indexes, and dashboard files for off-site reviewers.
6. Commit and push the packet and cited evidence before human review comments
   start. The human reviewer comments directly on the packet. If comments are
   ambiguous or conflict on authority, ask targeted follow-ups, record answers,
   analyze the pattern, and only then draft a closure proposal with explicit
   human confirmation.

## Acceptance tests

```powershell
node build-scripts\sprints\check-sprint-plan.js reports\sprints\GATE-REASON-STD-1-plan.md
node build-scripts\sprints\check-sprint-bundle.js GATE-REASON-STD-1
node build-scripts\review-gates\check-gate-reason-std1-review-packet.js
node build-scripts\sprints\check-reason-adopt1-route-output.js
node build-scripts\sprints\check-reason-play1-usability.js
node build-scripts\sprints\check-reason-answerform2-route-output.js
npm.cmd run check:scope-language
node build-scripts\reports\validate-report-json.js
npm.cmd run agent:index
node build-scripts\sprints\emit-gate-bundle-urls.js GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review
node build-scripts\sprints\emit-url-index.js
node build-scripts\sprints\emit-url-index.js --check
npm.cmd run dashboard:internal
git diff --check
git -C "../4veco-lessen" diff --check
```

## Proof Required to Close

Proof required to close this sprint packet preparation:

- valid sprint plan and bundle checks;
- gate review-packet checker passes after pre-gate lead review artifacts exist;
- reasoning route output/usability/answer-form route checkers pass;
- report JSON validation passes;
- repository maps, URL index, bundle URLs, and dashboard refresh are current;
- git diff checks pass in platform and lesson repos;
- packet and evidence are pushed before human review comments start.

This sprint does not close the human gate. Human-gate closure requires direct
review comments, a comment-resolution log, reviewed remote commit/hash, and an
explicit human verdict.

## Rollback plan

If rollback is required before commit, remove only the `GATE-REASON-STD-1`
packet, evidence, checker, lead-review files, copied screenshots, maps, URL
indexes, and dashboard refreshes created by this sprint. Do not revert closed
reasoning sprint artifacts and do not touch generated lesson output.

After commit, revert the gate-packet commit. No lesson-repo rollback is needed
unless a later step unexpectedly changes lesson output.

## Human review required

Human review is required, but the default mode is direct packet comments. The
packet must be pushed before comments start. Closure is forbidden until comments
are resolved, reviewed remote commit/hash is recorded, and the human verdict is
explicit.

## Stop Conditions

- Stop if any cited reasoning sprint is not closed and pushed.
- Stop if pre-gate lead review does not pass before human comments start.
- Stop if screenshots or proof JSON are missing.
- Stop if the packet uses the old interactive interview protocol as default.
- Stop if any artifact claims target-equivalent reasoning proof or product
  authority.

## Recommended Next Action

Create packet/evidence, run pre-gate lead review, commit/push all cited
evidence, then send the packet for direct human comments.

# Sprint GATE-TASK-FAMILY-1: Structured Choice And Construction Task-Family Review

Date: 2026-06-02

Status: direct-comment human-review packet preparation after playable repair.

## Goal

Prepare the human-review packet for `GATE-TASK-FAMILY-1`, the gate that
reviews whether the newly implemented structured choice and constrained
construction shared task-shell families are safe as planning input for later
reasoning migration, check implementation, first-three-paragraph product
proof, and Scale Gate preparation.

This sprint prepares the packet, baseline, playable proof, rendered screenshot
proof, lead-review artifacts, usability-agent review artifacts, and
deterministic checker. It does not run direct human review comments, close the
gate, adopt the task families in product routes, generate lesson output,
mutate source data, or authorize product use.

## Context

The Product Proof Track added two task-family contract sprints and the
implementation lane for the new shared-shell families:

- `TASK-FAMILY-CHOICE-1` defined structured choice contracts for
  `cloze_text`, `multi_select`, `matching_pairs`, `step_ordering`,
  `two_tier_choice`, and `assertion_reason`.
- `TASK-FAMILY-CONSTRUCT-1` defined constrained construction contracts for
  `cloze_tile_select`, `sentence_builder`, `formula_builder`,
  `source_value_selection`, `source_chain_builder`, and `label_placement`.
- Runtime implementation sprints for all twelve families closed PASS WITH
  FLAGS with focused tests, proof JSON, rendered fixtures, and lead-review
  records.

The recurring carried flag is that product-route screenshots and rendered
interaction proof remain required before these families are relied on by later
routes. A first packet draft over-relied on static rendered fixtures. This
repair stage adds a playable review lab, browser proof, and independent
usability-agent testing so the packet can show whether a reviewer can actually
click through to completion.

## Quality Standard

The quality floor is not "the task family exists" or "the fixture renders."
The packet must let a reviewer inspect what a student-facing interaction would
look like, inspect rendered output, test a playable review lab through visible
controls, and decide whether the family set is good enough for later bounded
adoption planning.

The gate must make these specification requirements auditable:

- shared task-type UI is the default for overlapping task actions;
- structured choice and construction families are used only when they match a
  real student action, not as decorative quiz variety;
- target-equivalent proof remains separate and cannot be replaced by
  choice-only or construction-only tasks unless the target operation itself is
  reviewed as that action;
- feedback remains practice-only and must not become diagnostics, mastery,
  sequencing, misconception profiles, summative status, or product authority;
- playable output, feedback states, keyboard/focus selectors, next-action
  clarity, mobile/narrow layout, dark-mode readability, and independent
  usability-agent evidence are inspectable before human review comments.

Any omitted product-route requirement must be recorded as named follow-up
work or an explicit blocker. A PASS WITH FLAGS may carry adoption-proof work
forward, but it may not hide missing core product requirements.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared task shell supports reviewed structured-choice families | contract files, proof JSON, tests, rendered fixtures | gate asks whether `cloze_text`, `multi_select`, `matching_pairs`, `step_ordering`, `two_tier_choice`, and `assertion_reason` are acceptable as shared-shell families | planned |
| Shared task shell supports reviewed construction families | contract files, proof JSON, tests, rendered fixtures | gate asks whether `cloze_tile_select`, `sentence_builder`, `formula_builder`, `source_value_selection`, `source_chain_builder`, and `label_placement` are acceptable as shared-shell families | planned |
| Rendered output is inspectable | consolidated gate fixture and screenshots | reviewer inspects desktop, mobile/narrow, dark-mode, and feedback screenshots | planned |
| Keyboard/focus behavior is explicit | `TaskShellEngine.focusPlan` evidence and checker | packet asks whether focus plans are sufficient before adoption | planned |
| Playability is proved | playable lab and browser proof | reviewer can inspect retry, next-action/focus, desktop completion, and mobile/dark completion | planned |
| Understandability is tested | separate usability-agent rounds | packet blocks if agents need hidden expected-state evidence after repair | planned |
| Feedback remains practice-only | proof JSON and rendered feedback states | packet asks whether feedback avoids diagnostics, mastery, sequencing, and target-equivalent language | planned |
| Target-proof boundary remains intact | product specs, contracts, carried flags | packet asks whether families are planning input only and cannot replace target-equivalent proof | planned |
| Human gate has pre-gate lead review | assignment, round 1, corrections, round 2 | checker fails if pre-gate lead review is missing before direct review comments | planned |
| Product authority remains false | packet authority flags and stop conditions | packet says no generated output, source-data mutation, product-route adoption, Scale Gate 1, or product use | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Consolidated rendered fixture gallery | `include_now` | The reviewer should not have to chase eleven separate fixture pages to orient. |
| Playable review lab | `include_now` | Static galleries did not prove a human could click through to completion. |
| Separate usability-agent review | `include_now` | The packet must test whether the task path is understandable, not just executable. |
| Screenshot manifest with desktop/mobile/dark/feedback proof | `include_now` | User explicitly requested screenshot proof for the human reviewer. |
| Deterministic gate-packet checker | `include_now` | The new stricter sprint process should fail missing artifacts or authority loopholes. |
| Product-route adoption | `defer_named_follow_up` | This gate reviews readiness only; later adoption sprints must name product routes and generated-output changes. |
| Target-equivalent reliance | `reject_scope_creep` | Product specs require a separate target-operation proof gate. |

## Allowed paths

- `reports/sprints/GATE-TASK-FAMILY-1-plan.md`
- `reports/sprints/GATE-TASK-FAMILY-1-baseline.md`
- `references/data/sprints/GATE-TASK-FAMILY-1.plan.json`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-assignment.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-round1.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-corrections.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-round2.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/live-output-evidence.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/live-output-evidence.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-lab.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-data.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/playable-proof.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-family-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-dark-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-controls-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/screenshot-manifest.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/screenshots/*.png`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/bundle-urls.md`
- `build-scripts/review-gates/emit-gate-task-family1-gallery.js`
- `build-scripts/review-gates/emit-gate-task-family1-playable-lab.js`
- `build-scripts/review-gates/capture-gate-task-family1-playable-proof.js`
- `build-scripts/review-gates/check-gate-task-family1-review-packet.js`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round1.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-corrections.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round2.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-analysis.md`
- generated repository maps, URL indexes, and internal dashboard files required
  for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- source exercise data under `source-data/book-*/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- engine implementation changes
- target-exercise registry writes
- candidate storage or candidate writes
- protected reference mutation
- human-review comment or gate-closure records before the packet is pushed and the
  human review actually starts
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/json/task-family-construction-contract.json`
- `reports/json/task-family-cloze-tile1-proof.json`
- `reports/json/task-family-sentence1-proof.json`
- `reports/json/task-family-formula1-proof.json`
- `reports/json/task-family-cloze1-proof.json`
- `reports/json/task-family-multi1-proof.json`
- `reports/json/task-family-order1-proof.json`
- `reports/json/task-family-source1-proof.json`
- `reports/json/task-family-label1-proof.json`
- `reports/json/task-family-match1-proof.json`
- `reports/json/task-family-two-tier1-proof.json`
- `reports/json/task-family-assertion1-proof.json`
- rendered fixtures and screenshot manifests from the closed task-family
  implementation sprints
- focused task-shell tests and custom sprint checkers from the closed
  implementation sprints

## Outputs

- `reports/sprints/GATE-TASK-FAMILY-1-plan.md`
- `reports/sprints/GATE-TASK-FAMILY-1-baseline.md`
- `references/data/sprints/GATE-TASK-FAMILY-1.plan.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/live-output-evidence.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/live-output-evidence.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-lab.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-data.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/playable-proof.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-family-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-construction-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-feedback-detail-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-dark-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-rendered-mobile-controls-gallery.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/screenshot-manifest.md`
- screenshot PNG files under
  `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/screenshots/`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/bundle-urls.md`
- `build-scripts/review-gates/emit-gate-task-family1-gallery.js`
- `build-scripts/review-gates/emit-gate-task-family1-playable-lab.js`
- `build-scripts/review-gates/capture-gate-task-family1-playable-proof.js`
- `build-scripts/review-gates/check-gate-task-family1-review-packet.js`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-assignment.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-round1.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-corrections.md`
- `reports/sprints/GATE-TASK-FAMILY-1-lead-review-round2.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round1.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-corrections.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-round2.md`
- `reports/sprints/GATE-TASK-FAMILY-1-usability-agent-analysis.md`

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before preparing the review
   packet. Stop if either roadmap does not show `GATE-TASK-FAMILY-1` as the
   next stop before task-family reliance.
2. Build a consolidated rendered fixture gallery that embeds the already
   validated per-family rendered fixtures from the closed implementation
   sprints. Stop if a required fixture is missing.
3. Build a playable review lab that exposes all twelve families through real
   task-shell controls. Stop if the lab cannot reach matched completion
   through visible controls.
4. Capture screenshot proof for desktop/light, construction families,
   mobile/narrow, dark-mode, and feedback states. Stop if screenshots cannot
   be captured and record the missing proof.
5. Capture playable proof for retry, next-action/focus handoff, desktop
   completion, and mobile/dark completion.
6. Run separate usability agents. If agents need hidden expected-state
   evidence to finish, repair the lab and rerun a recheck before human review.
7. Draft live-output evidence and review packet with calibration questions,
   full planned comment-prompt list, stop conditions, direct comment protocol,
   and explicit product-boundary flags.
8. Add a deterministic checker that verifies the packet, playable lab, fixture,
   screenshots, proof JSON references, usability-agent artifacts, lead-review
   artifacts, and authority boundaries.
9. Run packet-prep checks before lead review where possible. The checker is
   expected to pass only after lead-review artifacts and screenshots exist.
10. Assign the packet to a lead reviewer agent. Record round 1. If round 1
   returns REVISE, FAIL, or PAUSE, correct or stop.
11. Record correction log and obtain round 2. Stop if round 2 is not PASS or
   PASS WITH FLAGS.
12. Refresh repository maps/indexes, run final validators, fetch/prune remotes,
   commit, and push before any human review comments start.
13. The later human review uses direct packet comments by default. After
   comments return, record a comment-resolution log, ask targeted follow-ups
   only for ambiguity/conflicting authority, draft closure only after evidence
   is complete, and require explicit human confirmation before writing closure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-TASK-FAMILY-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-TASK-FAMILY-1
node build-scripts/review-gates/emit-gate-task-family1-gallery.js
node build-scripts/review-gates/emit-gate-task-family1-playable-lab.js
node build-scripts/review-gates/capture-gate-task-family1-playable-proof.js
node build-scripts/review-gates/check-gate-task-family1-review-packet.js
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze-tile1.js
node build-scripts/sprints/check-task-family-sentence1.js
node build-scripts/sprints/check-task-family-formula1.js
node build-scripts/sprints/check-task-family-cloze1.js
node build-scripts/sprints/check-task-family-multi1.js
node build-scripts/sprints/check-task-family-order1.js
node build-scripts/sprints/check-task-family-source1.js
node build-scripts/sprints/check-task-family-label1.js
node build-scripts/sprints/check-task-family-match1.js
node build-scripts/sprints/check-task-family-two-tier1.js
node build-scripts/sprints/check-task-family-assertion1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json source-data/book-1
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

This packet-prep sprint stage closes only as review-packet-ready after:

- plan, baseline, plan JSON, review packet, live-output evidence, playable
  lab, playable proof, fixture, screenshot manifest, screenshots, bundle URLs,
  usability-agent artifacts, and checker exist;
- all twelve reviewed families are represented in fixture/evidence;
- pre-gate lead-review assignment, round 1, correction log, and round 2 exist;
- pre-gate lead review is PASS or PASS WITH FLAGS;
- packet status says no human review comments have started;
- no human-review comment or gate-closure files exist;
- no engine implementation, source-data mutation, generated lesson output,
  protected reference mutation, target-equivalent reliance, or product
  authority is introduced;
- packet and cited evidence are committed and pushed before human review
  comments start.

Closure proof must include the deterministic validator/test evidence from the
acceptance stack, including the sprint-bundle checker, gate-packet checker,
focused task-shell tests, task-family checkers, and lead-review record.

## Rollback plan

Revert the GATE-TASK-FAMILY-1 packet-prep commit. Rollback removes only the
gate plan, baseline, lead-review records, review packet, live-output evidence,
fixture, screenshots, checker, bundle URLs, and refreshed maps/indexes.

Do not edit generated lesson output, source exercise data, protected
references, target-exercise records, candidate storage, or engine runtime
code during rollback.

## Human review required

Human review is required to close `GATE-TASK-FAMILY-1`, but it is not
conducted in this local packet-prep stage.

Human review comments may start only after the review packet, playable proof,
screenshot proof, usability-agent records, lead-review records, bundle URLs,
and cited evidence are committed and pushed to the normal remote branch.

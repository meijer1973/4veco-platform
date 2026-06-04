# Sprint GATE-SHARED-TASK-INGEST-REPAIR-1: Shared Task Context And Ingestion Repair Human Review Packet

Date: 2026-06-04

Status: direct-comment human-review packet preparation with playable-lab repair.

## Goal

Prepare `GATE-SHARED-TASK-INGEST-REPAIR-1` for direct human review by repairing the actual-exam and textbook transformation labs so they are playable and readable, then assembling the review packet, packet JSON, evidence links, checker, proof, and pre-gate lead-review artifacts.

This sprint prepares the packet and evidence only. It does not start human review comments, resolve comments, draft a final closure decision from missing comments, write `gate-closure.json`, close the gate, adopt source-context ingestion in product routes, mutate reference data, generate lesson output, or authorize Scale Gate 1 or broad product use.

## Context

The prerequisite transformation sprints are closed:

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` proved an external-primary actual-exam source transformation for Zoohee question 3.
- `TASK-INGEST-TRANSFORM-3-TEXTBOOK` proved an owned textbook-source transformation for `1.1.3 Grafieken en tabellen`.

Both produced review labs, proof JSON, screenshots, task-family maps, operation traces, answer-form traces, and lead-review records. The current user review found that the labs are not yet playable enough: they render cards but do not provide controls a human can use. The user also asked that multiple sources, tables, and questions remain readable together, so the repaired labs must let a reviewer scroll source material while keeping the current question or question list visible.

## Quality Standard

The quality floor is a human-review packet with rendered output that is actually playable, not just static. The specification requires source-dependent tasks to preserve context-first source evidence, but the reviewer must also be able to inspect the sources, tables, graphs, and question prompts without losing orientation.

The repaired labs must:

- present sources in an independently scrollable source pane;
- keep the current question or question list visible while sources scroll;
- expose visible controls for every task card;
- provide a deterministic completion path for proof;
- remain readable on desktop, mobile, and dark mode;
- avoid answer leakage, internal IDs, or product-authority claims in visible text;
- preserve the existing task-shell checker evidence for correct and adversarial responses.

The labs remain review-only approximations of student-facing interactions. They must be good enough for a human reviewer to judge interaction shape, source readability, and task-family suitability, but they do not become a student-facing route or product claim.

The packet must include calibration checks, full planned review comment prompts, stop conditions, evidence links, and the human-review procedure. Follow-up work must name the actual comment-resolution log, targeted follow-ups, closure proposal, explicit human confirmation, and gate-closure JSON as later work after the packet receives human comments.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Playable actual-exam lab | updated `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html` and proof JSON | checker proves controls, split layout, completion path, screenshots | planned |
| Playable textbook lab | updated `TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html` and proof JSON | checker proves controls, split layout, completion path, screenshots | planned |
| Source/question readability | source pane and sticky/current question area in both labs | proof records source-scroll with question visible | planned |
| Actual-exam authority preserved | existing external-primary source refs and checker | packet and checker reject weakening official-source boundary | planned |
| Textbook authority bounded | owned textbook source refs and checker | packet and checker reject official/external-primary claims for textbook source | planned |
| Task-family and operation traces present | prior maps/traces cited in packet | checker verifies all cited artifacts exist | planned |
| Human-review packet ready | `review-packet.md`, `review-packet.json`, `bundle-urls.md` | packet checker verifies calibration, planned prompts, stop conditions, direct-comment protocol | planned |
| Pre-gate lead review | assignment, round 1, correction log, round 2 | lead-review substance checker passes before review starts | planned |
| No premature closure | no human comments, no closure JSON, roadmap stays open | checker rejects premature gate closure/status claim | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Split source/question layout for both labs | `include_now` | User explicitly requested readable sources and questions while scrolling. |
| Visible controls for every transformed task card | `include_now` | The labs must be playable for human review. |
| Browser/proof completion path | `include_now` | Human-gate evidence needs deterministic playable proof. |
| Direct-comment packet with calibration and comment prompts | `include_now` | The repo standard no longer uses one-question-at-a-time interview by default. |
| Comment-resolution log populated with real comments | `defer_named_follow_up` | Cannot be completed until human comments are returned. |
| Gate closure proposal and gate-closure JSON | `defer_named_follow_up` | Requires comment evidence and explicit human confirmation. |
| Product-route adoption or Scale Gate authorization | `reject_scope_creep` | This gate may authorize only later controlled adoption-preparation after review. |

## Allowed paths

- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1*`
- `references/data/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1.plan.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/**`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/manifest.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/manifest.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`
- repository maps, URL indexes, and dashboard files required for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- source exercise data under `source-data/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/gate-closure.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/gate-closure.md`
- human-review comment-resolution records claiming returned comments before human review actually starts
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or student/product use

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- transformation maps, traces, rendered labs, screenshot manifests, checkers, and lead-review records for `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` and `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Outputs

- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-plan.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-baseline.md`
- `references/data/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1.plan.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/manifest.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/manifest.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/live-output-evidence.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/live-output-evidence.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/bundle-urls.md`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-planning-review.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-lead-review-assignment.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-lead-review-round1.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-lead-review-corrections.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-lead-review-round2.md`
- command-log evidence for packet-ready validation

## Operationalized sprint procedure

1. Record the plan, plan JSON, and baseline before implementation. Stop if the current roadmap does not show `GATE-SHARED-TASK-INGEST-REPAIR-1` as open after both transformation sprints.
2. Run planning review. Stop and revise the plan if the reviewer finds missing playable proof, missing generated output, missing direct-comment protocol, missing closure stop condition, or protected-path risk.
3. Repair both lab generators with a split/paired source-question layout and visible controls. Decision point: if a task family cannot be rendered without leaking answers, render a generic review control while keeping deterministic answer validation in the checker.
4. Regenerate actual-exam and textbook labs, proof JSON, screenshots, and manifests. Stop if proof cannot show source scrolling with question visibility, visible controls, and completion path.
5. Update both custom checkers to verify playability, layout proof, source/question readability, boundary claims, and existing correct/adversarial fixtures.
6. Build the direct-comment review packet and packet JSON with calibration questions, full planned review prompts, evidence links, stop conditions, answer recording instructions, pattern analysis plan, targeted follow-ups protocol, closure proposal protocol, and explicit human confirmation requirement.
7. Build the packet checker and bundle URLs. Stop if the checker cannot reject premature closure files, missing playable evidence, or missing remote-publication commit/hash evidence in `review-packet.json` and `live-output-evidence.json`.
8. Run validators and command-log wrapped acceptance tests.
9. Run lead-review round 1, record corrections, and run lead-review round 2 before human review starts.
10. Push the packet and all cited evidence to the normal remote branch, then record the reviewed remote branch and commit hash in `review-packet.json` and `live-output-evidence.json`. Human review comments may start only after this remote-publication evidence exists and the packet checker passes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-SHARED-TASK-INGEST-REPAIR-1 --active
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js
node build-scripts/sprints/check-task-ingest-transform3-textbook.js
node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js
node build-scripts/sprints/check-lead-review-substance.js GATE-SHARED-TASK-INGEST-REPAIR-1
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
```

## Proof Required to Close

Proof required to close packet preparation, not the human gate, includes validator and review evidence:

- both repaired labs have visible controls;
- both repaired labs keep questions visible while source panes scroll;
- proof JSON records completion path, desktop/mobile/dark screenshots, and no answer/internal-ID leakage;
- review packet and packet JSON include direct-comment prompts, calibration checks, stop conditions, answer recording, pattern analysis, targeted follow-ups, closure proposal protocol, and explicit human confirmation requirement;
- packet checker passes;
- pre-gate lead review round 1 and round 2 pass;
- no human-review comment resolution or gate closure files claim completed review;
- packet and all cited evidence are committed and pushed.
- `review-packet.json` and `live-output-evidence.json` record the remote branch and commit hash that the human reviewer must inspect.

## Rollback plan

If the lab repair fails, revert the updated capture/checker scripts and regenerated lab/proof/screenshot artifacts for the two transformation sprints. Leave the gate row open.

If packet validation fails, remove the new gate packet directory and checker, keep diagnostic notes if useful, and leave the gate row open.

If any protected reference, source-data, or generated lesson output write appears, stop immediately, restore the unintended change, and do not prepare the packet until the boundary violation is resolved.

If the packet and cited evidence are not pushed, or if `review-packet.json` and `live-output-evidence.json` do not record the reviewed remote branch and commit hash, human review must not start.

## Human review required

Yes. This sprint prepares the direct-comment human-review packet for `GATE-SHARED-TASK-INGEST-REPAIR-1`.

Human review is not completed in this sprint. After the packet is pushed, the reviewer must comment directly on the packet. The agent must then record answers/comments, analyze patterns, ask targeted follow-ups for ambiguity, draft a closure proposal only after evidence is complete, and require explicit human confirmation before writing any gate-closure record.

# GATE-SHARED-TASK-INGEST-1 Shared Task Context And Ingestion Review Packet

Generated: 2026-06-03

Status: direct-comment review packet ready after context/ingestion sprint series and pre-gate lead review PASS WITH FLAGS; no human review comments started; no product authority.

## Review Scope

Review whether the shared task system can represent source context, reconstruct exam/textbook source blocks, and transform source exercises into task-family compositions without reducing the cognitive level.

This gate reviews evidence from `SYNC-TASK-CONTEXT-INGEST-1`, `TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`, `CONTEXT-VISUAL-STD-1`, `SOURCE-RECONSTRUCT-1`, and `TASK-INGEST-TRANSFORM-1`.

This packet does not authorize generated lesson output, source-data mutation, protected reference mutation, product-route adoption, target-equivalent proof, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or student/product use.

## Evidence Base

- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/live-output-evidence.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/live-output-evidence.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshot-manifest.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/gate-playable-shared-task-ingest-exam-lab.html`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/gate-playable-shared-task-ingest-textbook-lab.html`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/gate-playable-shared-task-ingest-data.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/playable-proof.json`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshots/gate-shared-task-ingest1-exam-initial.png`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshots/gate-shared-task-ingest1-exam-retry-feedback.png`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshots/gate-shared-task-ingest1-exam-completed.png`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshots/gate-shared-task-ingest1-textbook-initial.png`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/screenshots/gate-shared-task-ingest1-textbook-mobile-dark-completed.png`
- `reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-standard.md`
- `reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md`
- `reports/json/task-context-spec1-contract.json`
- `reports/json/task-ingest-transform1-operation-trace.json`
- `build-scripts/review-gates/capture-gate-shared-task-ingest1-playable-proof.js`
- `build-scripts/review-gates/check-gate-shared-task-ingest1-review-packet.js`

## Planned Review Focus

| Surface | Current evidence | Review issue |
|---|---|---|
| Context container | context blocks render before tasks | decide if source-first structure is adequate |
| Reconstruction | exam-style and textbook-style source blocks are normalized | decide if reconstruction avoids screenshot-copy shortcuts |
| Transformation | task-family maps preserve operations | decide if cognitive level is preserved |
| Playability | exam/textbook labs reach completion | decide if evidence is human-testable |
| Authority | review only | no product route, target-equivalent, diagnostics, mastery, sequencing, or scale authority |

## Minimum Evidence Inspection

Before binding comments, inspect the two playable labs, the data JSON, proof JSON, screenshot manifest, all screenshots, context contract, visual standard, reconstruction map, transformation map, operation trace, and lead-review round 2. A reviewer must manually try at least one task in at least one lab.

Open the labs directly or serve the repository root and use:

`http://127.0.0.1:<port>/reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/gate-playable-shared-task-ingest-exam-lab.html`

`http://127.0.0.1:<port>/reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/gate-playable-shared-task-ingest-textbook-lab.html`

If either lab cannot be opened, cannot be completed through visible controls, or lacks visible source context before the task controls, stop and return REVISE.

## Calibration Checks

1. This gate reviews context/ingestion evidence only and does not authorize product-route adoption or target-equivalent proof.
2. The packet and all cited evidence must be pushed before human comments start.
3. The transformed tasks must not reduce calculation, graph/table, source, or reasoning operations to shallow recognition.

## Full Planned Review Comment Prompts

### SHAREDINGEST1-Q1: evidence baseline
Is the evidence baseline sufficient: context contract, runtime tests, playable exam/textbook labs, proof JSON, screenshots, reconstruction maps, transformation maps, checker, and lead review are available?

### SHAREDINGEST1-Q2: context representation
Do the labs show source/context blocks before tasks with usable labels, captions, source references, alt text, and task-level source references?

### SHAREDINGEST1-Q3: reconstruction quality
Are the exam-style and textbook-style sources reconstructed as semantic tables/SVG/text/formula blocks rather than copied screenshots or hidden context?

### SHAREDINGEST1-Q4: transformation quality
Do the task-family compositions preserve the original source, calculation, graph/table, and reasoning operations without reducing them to shallow recognition?

### SHAREDINGEST1-Q5: playable output quality
Can a human use visible controls to retry, complete tasks, see feedback, and reach the completed state in both labs?

### SHAREDINGEST1-Q6: visual standard
Is the visual style good enough as a shared standard for later route-specific proof, with mobile/dark flags carried as needed?

### SHAREDINGEST1-Q7: route-adoption boundary
Is it clear this is review-only ingestion evidence and not generated lesson output or product-route adoption?

### SHAREDINGEST1-Q8: target-proof boundary
Is it clear this gate does not prove target-equivalent exit-ticket readiness or constructed-response quality?

### SHAREDINGEST1-Q9: next authorized work
If this gate closes, should it authorize controlled adoption-preparation in later named sprints only?

### SHAREDINGEST1-Q10: product authority now
Does this gate authorize generated lesson output, source-data mutation, product-route adoption, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use now? Expected answer: no.

## Direct Review Comment Protocol

Human reviewers comment directly on this packet or provide a separate review note. Returned comments are recorded in a comment-resolution log, then pattern analysis is run before any closure proposal. Do not run a one-question-at-a-time interview unless comments are ambiguous or conflicting.

## Current Stop Conditions

- Stop if packet/evidence has not been pushed before human comments.
- Stop if the playable labs cannot reach completion.
- Stop if source context is hidden, uncited, or shown after task controls.
- Stop if reconstruction relies on copied screenshots.
- Stop if transformation reduces rich operations to shallow recognition.
- Stop if any answer authorizes product route, target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use.

## Recommended Next Action

Publish this packet and all cited evidence to the normal remote branch, then send it for direct human review comments. Do not start `CHECK-SHORT-EXIT-2`, route adoption, or Scale Gate 1 from this packet alone.

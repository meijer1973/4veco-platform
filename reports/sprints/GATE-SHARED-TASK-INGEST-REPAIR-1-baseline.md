# Sprint GATE-SHARED-TASK-INGEST-REPAIR-1: Baseline

Sprint: `GATE-SHARED-TASK-INGEST-REPAIR-1`
Date: 2026-06-04

## Plan reference

Plan: `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-plan.md`

## Roadmap Position

The open row is:

`GATE-SHARED-TASK-INGEST-REPAIR-1 | Shared Task Context And Ingestion Repair Human Review | no | Human gate for repaired exam/textbook source-context ingestion into shared tasks. Requires review packet, packet JSON, playable actual-exam and textbook labs, external-primary source references, reconstruction maps, markdown/SVG/table blocks, task-family maps, operation/answer-form traces, proof JSON, screenshots, validators, lead review, direct comments, resolution log, closure proposal, closure JSON, and reviewed remote commit/hash. May authorize later controlled adoption-preparation only; no Scale Gate 1 or broad product use.`

Prerequisite rows:

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` is closed.
- `TASK-INGEST-TRANSFORM-3-TEXTBOOK` is closed.

## Current Evidence

Actual-exam transformation evidence:

- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`

Textbook transformation evidence:

- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-visual-variant-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md`

## Current Gap

The labs render source context and task cards, but they are not yet playable. A human reviewer cannot click through task controls or prove a completion path from the lab itself.

The source presentation also needs a stronger layout: when a source set contains text, tables, graph/procedure blocks, and multiple questions, a reviewer must be able to scroll source material while still seeing the current question or task list.

## Data integrity notes

- Protected reference data in `references/machine/` and `references/external/` is read-only for this sprint.
- `references/authored/course-target-exercises.json` is read-only for this sprint.
- `source-data/` is read-only for this sprint.
- Book 1 generated output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` is read-only for this sprint.
- The gate packet must not claim human comments, comment resolution, or gate closure before the review actually happens.


# Phase 0A Green Gate Brief

Generated: 2026-04-23  
Scope: `4veco-platform` and existing `../4veco-lessen` output

## Purpose

This file is the Phase 0A handoff brief. It gathers the decisions needed to understand the three-month roadmap and the Green Gate without rereading every discussion.

It does not replace the roadmap or failure register:

- Roadmap and timeline: `knowledge/three-month-roadmap.md`
- Current failing commands: `knowledge/green-gate-failing-commands.md`
- Paragraph validation contract: `BUILD-PARAGRAPH.md` B6
- Temporary freeze rule for agents: `AGENTS.md`

## Phase 0A Decision

Phase 0 is both unblock work and essential cleanup work. The goal is not perfect architecture. The goal is to make `4veco-platform` reliable enough that the material team can safely resume production in `4veco-lessen`.

Until the Green Gate passes, `4veco-lessen` is frozen for student-facing output. Planning and read-only review are allowed. Generating, deploying, overwriting, or committing student-facing material is not allowed.

## Accepted Green Gate

The Green Gate passes only when all checks below are true:

| Gate | Current status |
|------|----------------|
| `npm.cmd test -- --runInBand` passes. | Not done. The skilltree data suite still fails. |
| `validate-chapter.js` works for current `4veco-lessen` chapters. | Partial. Chapter 1.1 passes; chapters 1.2-1.5 still expose content quality-gate gaps. |
| `validate-paragraph.js` is active, required, and matches the flat paragraph layout. | Not done. It still expects the old paragraph folder naming format. |
| The skilltree/catalog mismatch is resolved. | Not done. `GEN.A38`-`GEN.A44` need implementation or catalog-only classification. |
| One command exists to validate the platform plus a target book. | Not done. `check:platform` and `check:book` do not exist yet. |
| Generated reports are not obviously stale against the current catalog. | Not verified yet. This belongs in Sprint 0.4. |
| The deployment/output freeze can be lifted safely. | Not done. This is the Sprint 0.5 sign-off decision. |

## Freeze Rules

Allowed during Phase 0:

- planning documents.
- read-only review of existing `4veco-lessen` material.
- platform code fixes in `4veco-platform`.
- validator, test, and report fixes in `4veco-platform`.
- temporary scratch runs outside production output paths.
- health-check commands that inspect existing `4veco-lessen` output.

Not allowed during Phase 0:

- new chapter or book production in `4veco-lessen`.
- new paragraph production in `4veco-lessen`.
- companion-material generation in `4veco-lessen`.
- deployment or generator runs that overwrite production material in `4veco-lessen`.

The freeze lifts only after Sprint 0.5 explicitly signs off the Green Gate.

## Validator Contract

`validate-paragraph.js` is active and required. It is not legacy.

It must support the current flat paragraph layout:

```text
Boek N - Title/
  N.X Hoofdstuk Name/
    N.X.Y Paragraph Name/
      Part A files
      Part B files
      _assets/
      index.html
```

The validator should support three modes:

- **Part A/textbook mode**: validates textbook markdown, PDFs, `build_pdf.py`, review, quality ref, and asset integrity.
- **Part B/companion mode**: validates the 24 required Part B root files, including `index.html`, plus companion game data.
- **Complete mode**: validates both Part A and Part B.

Clarified contract decisions:

- Part B has 24 required root files including `index.html`.
- `skilltree` is required for every Part B/complete paragraph because wiskundevaardigheden is one of the 24 required files.
- Reasoning runtime data is `shared/reasoning/X.Y.Z.js`.
- Raw reasoning CSV source stays in platform `source-data/book-N/reasoning/X.Y.Z.csv`; do not look for `shared/reasoning/X.Y.Z.csv`.
- `_paragraph-plan.md` is required for Part B/complete companion production, not Part A-only textbook paragraphs.
- Consolidation paragraphs require `opgaven.md`, `antwoorden.md`, `opgaven.pdf`, and `antwoorden.pdf`; they do not require `paragraaf.md` or `paragraaf.pdf`.

## Team Split During Phase 0

Platform team owns Green Gate unblock and cleanup:

- test suite.
- skilltree/catalog mismatch.
- validators.
- health commands.
- reference report sanity.

Material team may do:

- planning.
- read-only review.
- issue triage.
- teacher-pilot preparation that does not generate or overwrite output.

Material team should not start validator-dependent production until the Green Gate passes.

## Phase 0A Completion

Phase 0A is complete when:

- this brief exists.
- the roadmap links to this brief.
- the failing commands are recorded in `knowledge/green-gate-failing-commands.md`.
- the accepted Green Gate is written into `knowledge/three-month-roadmap.md`.
- the flat-layout validator contract is written into `BUILD-PARAGRAPH.md` B6.
- the Phase 0 freeze is written into `AGENTS.md`.

After this, work moves to the implementation sprints:

- Sprint 0.1: make platform tests green.
- Sprint 0.2: align validators with flat layout.
- Sprint 0.3: add `check:platform` and `check:book`.
- Sprint 0.4: check reference report sanity.
- Sprint 0.5: run final checks and lift or keep the freeze.

## Update Rule

When a Green Gate command changes status, update:

1. `knowledge/green-gate-failing-commands.md`
2. the status table in `knowledge/three-month-roadmap.md`
3. this brief only if a decision changes

Do not bury live failure details in the roadmap. Keep the roadmap clean; keep command-level detail in the failure register.

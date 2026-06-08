# Quality Standards Sprint Ledger

Status: active
Updated on: 2026-06-08
Branch in use: `codex/quality-standards-20260608`

## Purpose

This ledger tracks the quality-standards roadmap track separately from the
large references-team roadmap. It records what has actually been authorised,
implemented, validated, and pushed.

## Ledger

| Sprint | Status | Scope | Primary outputs | Commit | Notes |
| --- | --- | --- | --- | --- | --- |
| `QS-SETUP-0` | closed | Create quality-standards roadmap and current-state audit. | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; `references/data/inspection-standards/README.md`; `archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md` | `613c7eab` | Setup only. No schemas, validators, lesson-output changes, overlays, reports, or compliance claims. |
| `INSPECT-0` | closed | Source register plus Dutch VO evidence-profile design. | `references/data/inspection-standards/source-register.json`; `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`; `docs/inspection-standards/nl-vo-evidence-model.md`; validation and closure logs. | `271890f8` | Bounded research/data work. No generated lesson changes or tooling gates. |
| `QS-ROADMAP-HOME-1` | closed | Move the roadmap into a dedicated quality-standards roadmap folder and add governance companions. | `docs/roadmaps/quality-standards/README.md`; `docs/roadmaps/quality-standards/sprint-ledger.md`; `docs/roadmaps/quality-standards/quality-standards-end-state.md`; moved roadmap path. | this commit | Structural documentation only. No source-profile semantics or production behaviour changed. |

## Candidate Future Sprints

These are not authorised implementation work until a human review explicitly
approves the packet.

| Candidate sprint | Intended scope | Authorisation status |
| --- | --- | --- |
| `INSPECT-1` | Human review of source register and Dutch VO evidence profile; corrections only. | not authorised |
| `INSPECT-2` | Evidence schema and validator design for inspection/quality evidence records. | not authorised |
| `INSPECT-3` | Dutch book-level evidence pack prototype for one bounded generated output slice. | not authorised |
| `INSPECT-4` | International common-quality profile design after Dutch profile review. | not authorised |
| `INSPECT-5` | Three-year course evidence roll-up across all completed books and supporting artifacts. | not authorised |

## Ledger Rules

1. Every non-trivial quality-standards sprint must add or update one row before
   closure.
2. A row may say `planned`, `in progress`, `closed`, `blocked`, or `rejected`.
3. Closure must record the local commit, remote push status, validation
   commands, changed files, generated reports, known flags, and recommended
   next action in the sprint closure log.
4. The ledger does not authorise work by itself. It records authorisation that
   came from the human owner or an accepted review packet.
5. Do not convert candidate future sprints into active work without preserving
   the existing forbidden-claim and no-lesson-mutation boundaries.

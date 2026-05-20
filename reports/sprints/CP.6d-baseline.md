# Sprint CP.6d: Baseline

Generated: 2026-05-20

## Plan reference

`reports/sprints/CP.6d-plan.md`

## Roadmap State

- `CP.6d Book 1 Graph-Heavy Evidence Upgrade` is the active Sprint Ledger row in `references/reference-team-roadmap.md`.
- `CP.6e Focused 1.1.3 Part A Re-Review` is planned after CP.6d.
- CP-6 and Year 1 remain open.

## Source Boundary

CP.6d is read-only against lesson output and protected references.

No direct mutation is authorized for:

- `../4veco-lessen/`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`

## Data integrity notes

- Protected reference data remains unchanged. CP.6d must not hand-edit `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, or `references/owned/course-blueprint-v5.md`.
- Lesson output remains read-only evidence. CP.6d must not hand-edit `../4veco-lessen/` review files, quality refs, generated lesson output, or companion artifacts.
- Stale REF-CT2 source/lesson mismatch evidence is diagnostic history only; current Chapter 1.3 evidence must come from the live lesson tree after L-CP6A.

## Live Lesson State Checked

The current live lesson repository was checked directly because REF-CT2 predates L-CP6A.

Important live-state observations:

- Active Book 1 Chapter 1.3 path is `1.3 Hoofdstuk Aanbod en marktevenwicht`.
- Active `1.3.2` path is `1.3.2 Marktevenwicht`.
- Active `1.3.3` path is `1.3.3 Verschuivingen en nieuw evenwicht`.
- Active `1.3.4` path is `1.3.4 Gemengde opgaven`.
- Old costs/revenue material is not used as active-v5 Chapter 1.3 evidence.

## Initial Evidence Inventory

The initial scan found current exact Part A review files for active-v5 Book 1 graph-heavy records:

- `1.1.1-review.md`
- `1.1.2-review.md`
- `1.1.3-review.md`
- `1.2.1-review.md`
- `1.2.2-review.md`
- `1.2.3-review.md`
- `1.3.1-review.md`
- `1.3.2-review.md`
- `1.3.3-review.md`

The initial scan found current companion visual review files only for:

- `1.1.1-companion-visual-review.md`
- `1.1.2-companion-visual-review.md`
- `1.1.3-companion-visual-review.md`

Initial quality-ref state:

- `1.1.1`, `1.1.2`, and `1.1.3` use `schema_version: 2` with Part A and companion blocks.
- `1.2.1`, `1.2.2`, `1.2.3`, `1.3.1`, `1.3.2`, and `1.3.3` still use legacy or pre-schema quality-ref shapes.
- `1.3.2` and `1.3.3` quality refs are current to L-CP6A and explicitly state CP-6 and Year 1 are not closed.

## Known Stop Conditions

- Stop if CP.6d would hand-edit lesson output or lesson quality refs.
- Stop if CP.6d would fabricate missing companion review evidence.
- Stop if CP.6d would treat stale `1.3.2 Kostenstructuren` or `1.3.3 Opbrengsten` as active-v5 evidence.
- Stop if any artifact claims CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, unit minting, or protected mutation.

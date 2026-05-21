# Sprint CP.6e: Baseline

Generated: 2026-05-21

## Plan reference

`reports/sprints/CP.6e-plan.md`

## Roadmap State

- `CP.6e Focused 1.1.3 Part A Re-Review` is the active Sprint Ledger row in `references/reference-team-roadmap.md`.
- CP.6d is closed and recorded 1 open `1.1.3` Part A `FLAG`.
- CP-6 and Year 1 remain open.

## Source Boundary

CP.6e is read-only against lesson output and protected references.

No direct mutation is authorized for:

- `../4veco-lessen/`
- lesson review files or quality refs
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`

## Data integrity notes

- Protected reference data remains unchanged. CP.6e must not hand-edit `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, or `references/owned/course-blueprint-v5.md`.
- Lesson output remains read-only evidence. CP.6e must not hand-edit `../4veco-lessen/` review files, quality refs, generated lesson output, PDFs, HTML, markdown, or assets.
- If the live Part A flag is still present, CP.6e must record an explicit failed-clearance decision and route remediation instead of silently patching generated output.

## Initial Evidence Inventory

Current exact files exist for the focused review:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-review.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-quality-ref.yaml`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – paragraaf.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – opgaven.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – antwoorden.md`

Initial spot-check:

- `1.1.3-quality-ref.yaml` still records Part A verdict `FLAG`.
- The current `paragraaf.md` still references Figuur 3 before Figuur 2.
- The current `opgaven.md` still includes a repeated worked example.

## Known Stop Conditions

- Stop if CP.6e would hand-edit lesson output or lesson quality refs.
- Stop if CP.6e would treat the existing quality-ref `FLAG` as cleared without current live-file evidence.
- Stop if CP.6e would authorize CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, unit minting, protected reference mutation, or student/product use.

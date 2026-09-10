# Sprint PV.5: Baseline

## Plan reference

Plan: `docs/sprints/PV.5-plan.md`

## Current state

PV.3 has six pilot procedure templates and six pilot visual states. The pilot set already covers formula trace, flowchart, table trace, and graph-stage semantics, but the repo does not yet have reusable PV renderer libraries or report-side projection proof artifacts.

PV.4 has one mapped procedure-game pilot and one legacy unmapped proof. Existing procedure games are not forced to migrate.

RX.5 reports operation coverage and generator-blocked units. That report is diagnostic only and does not authorize publication.

## Data integrity notes

No protected reference data changes are allowed in PV.5. The sprint must not hand-edit `references/machine/` or `references/external/`, must not create PV machine registries, must not mutate authored source files or RAG chunks, and must not touch lesson repositories.

## Baseline risks

- A renderer could accidentally be interpreted as student-facing publication. PV.5 must keep all generated visuals under `reports/`.
- Visual states are semantic pilot data, not complete production artwork.
- Dynamic graph manipulation is out of scope.
- Generator-blocked units must remain non-interactive.

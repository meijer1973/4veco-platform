# Sprint PV.4: Baseline

## Plan reference

Plan: `docs/sprints/PV.4-plan.md`

## Baseline state

PV.3 completed pilot Procedure-Visual templates and visual states. Before PV.4, procedure-game data could structurally contain extra fields, but the engine did not expose a formal alignment status and no report validated `formal_step_id` values against PV templates.

The procedure engine supported `given` and `choose` steps. Existing procedure-game data was therefore effectively `legacy_unmapped`.

## Data integrity notes

Protected reference data remains unchanged at baseline. PV.4 must not hand-edit `references/machine/` or `references/external/`, must not create PV machine registries, and must not mutate authored source files, generated lesson targets, or RAG chunks.

Student-facing PV projection, visual renderer publication, forced migration, diagnostics, adaptive routing, AI, automatic sequencing, mastery decisions, and summative use are not authorized.

## Baseline risks

- A mapped procedure-game record could use a typo in `formal_step_id` without validation.
- A future builder could accidentally treat partial mappings as complete.
- Existing procedure-game data must not be forced into a PV mapping before lesson-side regressions and publication gates exist.

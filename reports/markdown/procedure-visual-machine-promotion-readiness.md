# Procedure-Visual Machine Promotion Readiness

Sprint: `PV.7`
Gate: `GATE-PV7-machine-promotion-review`
Status: `promotion_not_ready`

## Summary

- Procedure templates: 6
- Visual states: 6
- Unit-template links: 6
- Render proofs: 28
- Mapped procedure-game pilots: 1
- PV-linked units: 6
- Linked units with publication allowed: 0
- Machine promotion CLI count: 0
- Machine promotion mutation logs: 0
- Lesson-regression proofs: 0
- Recommended decision: `do_not_promote_yet`

## Preconditions

| Precondition | Status | Evidence |
|---|---:|---|
| pv_schema_files_exist | met | `references/data/procedure-visual/procedure-template.schema.json`<br>`references/data/procedure-visual/visual-state.schema.json`<br>`references/data/procedure-visual/visual-grammar.schema.json` |
| pv_validator_exists | met | `build-scripts/references/validate-procedure-visual-registry.js` |
| pv_overlay_records_exist | met | `references/data/procedure-visual/procedure-visual-vocab.json`<br>`references/data/procedure-visual/procedure-templates.json`<br>`references/data/procedure-visual/visual-states.json`<br>`references/data/procedure-visual/unit-template-links.json` |
| pv_reports_exist | met | `reports/json/procedure-visual-inventory.json`<br>`reports/json/procedure-visual-schema-status.json`<br>`reports/json/procedure-visual-pilot-status.json`<br>`reports/json/procedure-game-template-alignment.json`<br>`reports/json/procedure-visual-projection-mvp.json`<br>`reports/json/procedure-visual-coverage.json` |
| pv_machine_registry_absent | met | `No PV references/machine files exist.` |
| pv_machine_edit_cli_exists | not_met | `No PV add/edit/promote CLI exists under build-scripts/references/.` |
| pv_machine_mutation_logs_exist | not_met | `No PV machine-promotion mutation log exists.` |
| two_lesson_side_regressions_recorded | not_met | `No PV lesson-regression gate/proof artifacts found in platform reports.` |
| student_facing_projection_blocked | met | `reports/json/procedure-visual-coverage.json` |
| human_promotion_gate_prepared | met | `reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.md`<br>`reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.json` |

## Candidate Records

| Record class | Count | Readiness | Recommendation |
|---|---:|---|---|
| unit_template_links | 6 | not_ready | Do not promote in PV.7. |
| procedure_templates | 6 | not_ready | Do not promote in PV.7. |
| visual_states | 6 | not_ready | Do not promote in PV.7. |
| procedure_visual_vocab_and_schemas | 21 | not_ready | Do not promote in PV.7. |

## Recommendation

Do not promote PV records to `references/machine/` in PV.7. The safe future path is to add a CLI-backed promotion design and mutation-log workflow first, prove at least two lesson-side regressions, and then consider unit-template links before any richer procedure-template or visual-state promotion.

## Boundaries

- `references/machine/` PV registry creation remains unauthorized.
- Student-facing PV projection remains unauthorized.
- Provisional `exercise_operations` may be referenced only with explicit provisional status.
- Diagnostics, adaptive routing, student-facing AI, sequencing, mastery, and summative use remain blocked.

# CP-4 Human Decision Form

Status: `template_not_closed`

Gate: `GATE-CP4-skill-registry-coexistence`

Sprint: `S7`

Purpose: record Head of Content Strategy decisions for the skill/operation coexistence gate and the PV.0 Procedure-Visual addendum. This file is a decision form only; it is not a human interview and does not close CP-4.

## Recommended Answer Block

```json
{
  "gate_id": "GATE-CP4-skill-registry-coexistence",
  "reviewer_role": "Head of Content Strategy",
  "answers": {
    "CP4-Q1": "A. Yes, references/data is correct for S7 MVP storage",
    "CP4-Q2": "A. Yes, keep required_units, exercise_operations, and skill_tags separated; required_skills remains legacy/source-only",
    "CP4-Q3": "B. Mostly, accept Dutch broad skill_tags as v1 with alias/naming follow-up",
    "CP4-Q4": "B. Treat English dry-run skill_tags as provisional aliases/sub-tags until normalization is reviewed",
    "CP4-Q5": "B. Not yet; exercise_operations stay provisional and only the coexistence structure is approved",
    "CP4-Q6": "B. Mostly; mapped operation records may remain provisional but require proof before bulk backfill",
    "CP4-Q7": "A. No, do not authorize references/machine operation or skill-tag registries now",
    "CP4-Q8": "pass_with_conditions",
    "CP4-Q9": "A. Yes, PV templates may reference provisional exercise_operations with explicit provisional status and no operation promotion"
  },
  "closure_decision": "pass_with_conditions",
  "s7_closure_authorized": true,
  "machine_registry_authorized": false,
  "bulk_backfill_authorized": false,
  "pv_dependency_authorized": "provisional references only",
  "required_conditions": [
    "Keep S7 skill/operation data in references/data until schema, CLI, validators, mutation logs, and human promotion approval exist.",
    "Do not reuse required_skills for new semantics; it remains legacy/source-only.",
    "Keep exercise_operations provisional until a later governed registry path is approved.",
    "Treat English dry-run skill_tags as provisional aliases/sub-tags until normalization is reviewed.",
    "Do not create references/machine/exercise-operations.json or references/machine/skill-tags.json in S7.",
    "PV templates may reference provisional exercise_operations only with explicit provisional status.",
    "PV may not create references/machine/procedure-templates.json or references/machine/visual-states.json before the later PV machine-promotion gate.",
    "No student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative decisions, or unreviewed student-facing PV projection is authorized."
  ]
}
```

## Notes For Reviewer

- A `pass_with_conditions` decision would unblock S7 closure and allow PV.1/PV.2 planning.
- It would not authorize bulk exercise metadata backfill.
- It would not authorize machine registry promotion.
- It would not authorize student-facing product surfaces.

# Source Annex Gap Log

Status: active S4.1 condition artifact

CP-3 condition: track source annex extraction gaps before broad Tier A overlay backfill.

## Open Gaps

### EXANNEX-001

Overlay record: `overlay:exam:ha-1022-a-23-1-o:opgave-1:question-2`

Source: `references/external/exam-questions.json`

Source stable ID: `external_exam_question:ha-1022-a-23-1-o:opgave-1:question-2`

Referenced annex: `bron 1`

Gap type: `source_annex_values_not_extracted`

Severity: `high_before_bulk_tier_a_backfill`

Impact: the question can be reconstructed as a task, but a reviewer cannot fully verify or reproduce the calculation from the mirrored JSON alone.

Next action: add a source annex extraction workflow or require explicit `source_values_not_extracted` records with proof-to-close before broad Tier A overlay backfill.

Proof required to close: the referenced source values from `bron 1` are extractable through a reviewed source-annex record, or the overlay carries a reviewed, explicit gap status and downstream tools surface that warning.

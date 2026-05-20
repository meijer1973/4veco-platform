# CP.6d Book 1 Graph-Heavy Evidence Upgrade

Generated: 2026-05-20

Status: graph_heavy_evidence_ledger_upgraded_not_closing

CP-6 closed: false

Year 1 closed: false

## Decision

CP.6d upgrades the internal CP-6 graph-heavy evidence status ledger against the actual current lesson repository. It does not close CP-6 or Year 1 and does not mutate protected references or lesson output.

The live lesson repository no longer matches the stale REF-CT2 Chapter 1.3 assumption: active `1.3.2` is `Marktevenwicht`, active `1.3.3` is `Verschuivingen en nieuw evenwicht`, and both sit under `1.3 Hoofdstuk Aanbod en marktevenwicht`.

## Summary

- Graph-heavy active-v5 records checked: 9
- Current exact Part A review files present: 9
- Companion reviews required now: 3
- Companion reviews required and present: 3
- Quality refs with `schema_version: 2`: 3
- Legacy/pre-schema quality refs: 6
- Part A records with legacy/unstructured verdict format: 4
- Open `1.1.3` Part A FLAG records: 1
- Current source/lesson mismatch count for active v5 Chapter 1.3: 0
- Records allowed as CP-6 closure evidence now: 0

## Evidence Table

| Paragraph | Live lesson path | Part A evidence | Part B evidence | Quality ref | CP.6d status |
|---|---|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | `1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken` | PASS WITH FLAGS (quality_ref) | current_companion_visual_review_present | schema_version_2 | current_graph_evidence_present_target_exercise_not_final |
| `1.1.2` Percentages en indexcijfers | `1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers` | PASS WITH FLAGS (quality_ref) | current_companion_visual_review_present | schema_version_2 | current_graph_evidence_present_target_exercise_not_final |
| `1.1.3` Grafieken en tabellen | `1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen` | FLAG (quality_ref) | current_companion_visual_review_present | schema_version_2 | blocked_cp6e_part_a_flag_open |
| `1.2.1` Individuele vraag | `1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag` | LEGACY REVIEW TEXT WITH FLAG MENTIONS (legacy_review_text) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |
| `1.2.2` Vraagfactoren | `1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren` | LEGACY REVIEW TEXT WITH FLAG MENTIONS (legacy_review_text) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |
| `1.2.3` Van individuele naar collectieve vraag | `1.2 Hoofdstuk Vraag/1.2.3 Van individuele naar collectieve vraag` | LEGACY REVIEW TEXT WITH FLAG MENTIONS (legacy_review_text) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |
| `1.3.1` Aanbod | `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod` | LEGACY REVIEW TEXT WITH FLAG MENTIONS (legacy_review_text) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |
| `1.3.2` Marktevenwicht | `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht` | PASS WITH FLAGS (quality_ref) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |
| `1.3.3` Verschuivingen en nieuw evenwicht | `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht` | PASS WITH FLAGS (quality_ref) | not required now | legacy_or_pre_schema | current_part_a_present_quality_ref_upgrade_needed |

## Record Notes

### 1.1.1 Schaarste en economisch denken

- Live path: `1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1-review.md`; evidence verdict PASS WITH FLAGS
- Companion review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1-companion-visual-review.md`
- Quality-ref: schema_version_2; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.1.2 Percentages en indexcijfers

- Live path: `1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2-review.md`; evidence verdict PASS WITH FLAGS
- Companion review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2-companion-visual-review.md`
- Quality-ref: schema_version_2; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.1.3 Grafieken en tabellen

- Live path: `1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-review.md`; evidence verdict FLAG
- Companion review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-companion-visual-review.md`
- Quality-ref: schema_version_2; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - 1.1.3 Part A quality-ref verdict remains FLAG; CP.6e is required.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.2.1 Individuele vraag

- Live path: `1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1-review.md`; evidence verdict LEGACY REVIEW TEXT WITH FLAG MENTIONS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Part A review file lacks a structural top-level verdict.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.2.2 Vraagfactoren

- Live path: `1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren/1.2.2-review.md`; evidence verdict LEGACY REVIEW TEXT WITH FLAG MENTIONS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren/1.2.2-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Part A review file lacks a structural top-level verdict.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.2.3 Van individuele naar collectieve vraag

- Live path: `1.2 Hoofdstuk Vraag/1.2.3 Van individuele naar collectieve vraag`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.3 Van individuele naar collectieve vraag/1.2.3-review.md`; evidence verdict LEGACY REVIEW TEXT WITH FLAG MENTIONS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.3 Van individuele naar collectieve vraag/1.2.3-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Part A review file lacks a structural top-level verdict.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.3.1 Aanbod

- Live path: `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod`
- Source/lesson state: aligned_or_not_chapter13_mismatch_scope
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1-review.md`; evidence verdict LEGACY REVIEW TEXT WITH FLAG MENTIONS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Part A review file lacks a structural top-level verdict.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.3.2 Marktevenwicht

- Live path: `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht`
- Source/lesson state: aligned_after_l_cp6a_with_carried_conditions
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2-review.md`; evidence verdict PASS WITH FLAGS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

### 1.3.3 Verschuivingen en nieuw evenwicht

- Live path: `1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht`
- Source/lesson state: aligned_after_l_cp6a_with_carried_conditions
- Part A review: present at `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3-review.md`; evidence verdict PASS WITH FLAGS
- Companion review: not_required_no_companion_material_detected
- Quality-ref: legacy_or_pre_schema; path `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3-quality-ref.yaml`
- Target-exercise status: migrated_from_v4_needs_v5_review
- Closure evidence now: false
- Remaining blockers:
  - Quality-ref is legacy/pre-schema rather than schema_version 2.
  - Target-exercise status is migrated_from_v4_needs_v5_review, not reviewed_final.
  - CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.

## Non-Authorizations

This sprint authorizes no protected reference mutation, no lesson-output mutation, no lesson-quality-ref hand patching, no companion review fabrication, no target-exercise promotion, no placeholder finalization, no unit minting, no CP-6 closure, no Year-1 closure, no student diagnostics, no adaptive routing, no mastery decisions, no automatic sequencing, no student-facing AI, no summative use, no PV projection, no PV machine promotion, and no student-facing output.

## Next Action

Run CP.6e focused `1.1.3` Part A re-review next. A later quality-workflow sprint should upgrade legacy/pre-schema graph-heavy quality refs where needed before any CP-6 closure proposal.

# Summary of Updated Roadmap Edits and Motivation

Date: 2026-04-28

Status: companion summary for `roadmap-updated-repository-checked.md`. Updated after Head of Engineering approval-with-caveats.

Purpose: explain how the Head of Engineering final roadmap should be adjusted after checking it against the current repository state.

## Short Conclusion

The Head of Engineering roadmap is directionally correct and should be adopted as the strategic base. The update does not reject the plan. It tightens it, while restoring the HCS contributions that must not be softened.

Main edit: start with a schema audit and naming contract before implementing new exercise fields, registries, or promotion gates.

Reason: current schemas and current data do not yet agree, and the term `required_skills` currently means micro-teaching-unit IDs. If the roadmap implements the new schema directly, it will create a vocabulary collision and likely produce invalid or misleading data.

Head of Engineering caveats now incorporated:

- Restore the two-axis exercise role model: `instructional_role` and `assessment_role`.
- Restore the four-field scaffolding object.
- Restore CP-1 through CP-8 as explicit cross-team checkpoints with gate IDs.

## Edits Made

| Area | Final roadmap position | Updated recommendation | Motivation |
|---|---|---|---|
| Roadmap status | Treats the final roadmap as the operating roadmap | Treat as proposal until live `references/reference-team-roadmap.md` is updated | The live roadmap still names R9.1 as immediate next sprint and does not contain the new final sequence |
| First sprint | Starts implementation sequence quickly | Add Sprint 1: Schema Audit and Exercise Naming Contract | Current schemas do not match `exam-questions.json` or `course-target-exercises.json` |
| `required_skills` | HCS wants a new skills/operations layer | Keep `required_skills` protected until migration; use `required_units`, `exercise_operations`, and `skill_tags` | Current data uses `required_skills` as unit IDs; reusing it would break meaning |
| External exam metadata | Adds exercise metadata to exam questions | Add metadata first through `references/data/exercises/` overlays | `references/external/` is protected mirrored authority; no hand edits |
| Exercise role model | Risk of one flat role enum | Restore two fields: `instructional_role` and `assessment_role` | A worked example can also be a prerequisite or bridge; one enum loses pedagogical information |
| Scaffolding | Risk of one generic scaffolding level | Restore object: `verbal_level`, `visual_stage`, `fading_position`, `dual_coding_present` | The dual-coding rule for graph-based guided practice cannot be represented by one numeric field |
| Owned blueprint | Correctly identifies blueprint as backbone | Make R9.1 repair all remaining `knowledge/course_blueprint_v4.md` source refs | All 49 target exercises still point to `knowledge/course_blueprint_v4.md` |
| Owned-source RAG | Wants active course material integrated | Keep R9.1/R9.2 as early implementation sprints | Chunk index has only one coarse target-exercise chunk and no deep owned lesson-source layer yet |
| Precision lint | References `build-scripts/verify_svg_geometry.py` | Correct path to `build-scripts/lib/verify_svg_geometry.py` or add wrapper | The verifier exists, but not at the path in the final roadmap |
| Bronnen registry | Adds `references/machine/bronnen.json` | Keep, but require schema, CLI, and validator first | New machine registries must follow machine-only editing discipline |
| Misconception registry | Adds `references/machine/misconceptions.json` | Keep, but require schema, CLI, validator, and small MVP | Same machine-editing constraint; avoid hand-maintained scale problems |
| `unit_design_status` | Adds field to unit schema during D04 sprint | Stage as derived overlay first unless CLI/schema migration is ready | `references/machine/` is protected; unit schema changes should not be folded into a D04 content sprint casually |
| D04 | Blocks C-to-B promotion until resolved | Keep D04 resolution, but make it part of a unit-design-quality phase | This is correct and important; it needs schema support and teacher review |
| R7.6 | Restored by Head of Engineering | Keep after owned-source projection and metadata MVP | RAG-03 target-exercise chunking depends on better target-exercise structure |
| R8.1 | Restored by Head of Engineering | Keep scoped down | Useful now for evidence weakness and proof-to-close; production QC gates can wait |
| Cross-team checkpoints | Present in HCS/final roadmap, absent from repository-checked draft | Restore CP-1 through CP-8 with gate IDs and capacity-bound target dates | These gates keep engineering and content synchronized without treating dates as contracts |
| Year-1 closeout | Appears in both Sprint 11 and Sprint 15 | Collapse into a content track with one Year-1 coverage gate | Avoid duplicate closeout sprints and make content work parallel to engineering |
| Year-2 skeleton | CP-7 target appears earlier than Phase E | Treat Year-2 skeleton as staged content drafting; promotion waits for gates | Final roadmap has date/order inconsistency: Phase E starts later than CP-7 |
| C-to-B promotion | Planned after D04 and schema work | Add explicit preconditions before it can start | It depends on schema audit, owned-source registry, exercise overlay, D04 status, R7.6, R14.1, and precision lint |
| Product surfaces R10-R13 | Deferred in final roadmap | Keep blocked | Data quality, RAG reliability, and evidence density are not strong enough yet |

## Repository Evidence Behind the Edits

### 1. Schema/data mismatch is real

Checked files:

- `references/schemas/exam-question.schema.json`
- `references/schemas/target-exercise.schema.json`
- `references/schemas/rag-chunk.schema.json`
- `references/external/exam-questions.json`
- `references/authored/course-target-exercises.json`

Current schema examples:

- Exam-question schema requires `id`, `source_document_id`, and `question_number`.
- Target-exercise schema requires `id`, `book`, and `required_units`.

Current data examples:

- Exam-question records use `exam`, `level`, `year`, `tijdvak`, `opgave_num`, `question_num`, `text`, `required_skills`, `question_type`, and `exam_codes`.
- Target-exercise records use `module`, `chapter`, `paragraph`, `target_exercise`, `lesson_goals`, `required_skills`, `missing_units_flagged`, and `source_ref`.

Motivation:

The roadmap must not implement new exercise schema fields until this mismatch is understood. Otherwise validators and RAG projections will encode a mixed contract.

### 2. Current target exercises still point to the old knowledge blueprint path

Checked file:

- `references/authored/course-target-exercises.json`

Current state:

- `blueprint_source` is still `knowledge/course_blueprint_v4.md`.
- All 49 target exercise `source_ref` values still point to `knowledge/course_blueprint_v4.md`.

Motivation:

The roadmap is correct that the blueprint belongs in `references/owned/`, but R9.1 must include a cleanup step that makes the target-exercise file point to the canonical owned reference source.

### 3. RAG exists, but source coverage is still thin

Checked file:

- `references/data/rag/chunk_index.jsonl`

Current state:

- 863 chunks total.
- 211 machine-unit chunks.
- 227 machine-term chunks.
- 349 exam-question chunks.
- 34 alignment-edge chunks.
- 18 quality-report chunks.
- 15 evidence-anchor chunks.
- 1 target-exercise chunk.

Motivation:

The final roadmap correctly prioritizes owned-source integration and RAG hardening. The update makes R9.1/R9.2 and R7.6 explicit prerequisites before teacher-facing production use.

### 4. Evidence and graph authority remain limited

Checked files:

- `references/data/evidence-anchors.json`
- `references/data/alignment-graph.json`
- `references/data/rag/retrieval_eval_results.json`

Current state:

- 15 evidence anchors.
- 14 claims.
- 34 graph edges.
- Graph edge statuses: 8 approved, 5 approved_with_conditions, 19 pending_review, 2 diagnostic_only.
- Retrieval eval: 10 cases, 10 passed, 0 authority violations.

Motivation:

The RAG layer is usable internally, but this is not enough for diagnostics, adaptive routing, student-facing AI, or automatic mastery decisions. Product-surface sprints remain blocked.

### 5. Precision-lint path needs correction

Checked files:

- `build-scripts/README.md`
- `build-scripts/lib/verify_svg_geometry.py`

Current state:

- The verifier exists at `build-scripts/lib/verify_svg_geometry.py`.
- The final roadmap and HCS summary refer to `build-scripts/verify_svg_geometry.py`.

Motivation:

The final roadmap's precision-lint idea is good. The path should be corrected or a wrapper should be added before `precision_lint_status` becomes a required exercise field.

## Recommended Updated Sequence

1. Schema Audit and Exercise Naming Contract.
   - Gate: `GATE-CP1-schema-audit`.
2. R9.1 Owned Source Registry and blueprint reference repair.
   - Gate: `GATE-CP2-owned-source-scope`.
3. R9.2 Content Graph Projection.
4. Exercise Metadata Overlay MVP.
   - Includes `instructional_role`, `assessment_role`, and the four-field `scaffolding` object.
   - Gate: `GATE-CP3-schema-extension-dry-run`.
5. R8.1 QC Issue Model, scoped down.
6. Bronnen Registry MVP.
7. Skill and Operation Registry MVP.
   - Gate: `GATE-CP4-skill-registry-coexistence`.
8. Misconception Registry MVP.
9. Unit Design Status and D04 Resolution.
   - Gate: `GATE-CP5-D04-resolution`.
10. Year-1 content-track coverage closeout.
   - Gate: `GATE-CP6-year-1-paragraph-coverage`.
11. Year-2 skeleton, staged and explicitly partial.
   - Gate: `GATE-CP7-year-2-anchoring`.
   - This is a parallel content-track checkpoint, not an engineering Phase E blocker.
12. R7.6 RAG Quality Hardening.
   - Gate: `GATE-CP8-rag-eval-content-coverage`.
13. R14.1 Minimal Curriculum Versioning.
14. Exam and Target Exercise Decomposition Backfill.
15. Composition Pattern Registry.
16. C-to-B Promotion Workflow.
17. Re-evaluate R10-R13 product surfaces.

## Main Strategic Change

The original R8-R14 roadmap was feature-heavy. The Head of Engineering roadmap correctly changed the center of gravity to exercise schema and data quality.

This repository-checked update makes one further correction: implementation must not start by adding more schema. It must start by auditing the schema contract that already exists.

That small change matters. It prevents the company from building a sophisticated exercise-quality system on top of field names that currently mean different things in different files.

The Head of Engineering caveats matter just as much. The updated plan now preserves the two-axis role model, the four-field scaffolding object, and the eight checkpoint gates. Those are not decorative governance. They are what keeps content quality, lesson artefact reality, and engineering schema work aligned.

## Work Still Blocked

The following remain blocked until later gate decisions:

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions
- unreviewed student-facing publication
- broad teacher-facing production retrieval

The following are allowed to continue after roadmap adoption:

- reference data quality
- schema audit
- owned-source registry
- content graph projection
- exercise metadata overlays
- internal RAG hardening
- non-authoritative teacher-facing lookup after R7.6 conditions are materially improved

## Recommended Decision

Adopt the Head of Engineering roadmap with the corrections above.

Before replacing the live roadmap, plan and baseline-report Sprint 1 using the existing sprint procedure. Sprint 1 is non-mutating and can safely run while the live roadmap update is prepared.

Then update `references/reference-team-roadmap.md` so future agents and teams see the same plan.

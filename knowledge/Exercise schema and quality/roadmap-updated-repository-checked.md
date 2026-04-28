# Updated Roadmap Proposal - Repository-Checked

Date: 2026-04-28

Status: proposal for human review. Updated after Head of Engineering approval-with-caveats. This document does not replace `references/reference-team-roadmap.md` until the live roadmap is updated.

Review input:

- `knowledge/Exercise schema and quality/roadmap-final-head-of-engineering.md`
- `knowledge/Exercise schema and quality/summary-of-edits-head-of-engineering.md`
- `knowledge/Exercise schema and quality/roadmap-HCS.md`
- `knowledge/Exercise schema and quality/feedback-to-engineering-HCS.md`
- `knowledge/Exercise schema and quality/reference-roadmap-proposed-data-quality-map - References team.md`
- `references/reference-team-roadmap.md`
- current repository state at `main` commit `6f8a242`

## Executive Judgment

The Head of Engineering roadmap is strategically sound: it correctly moves the company away from new product surfaces and toward high-quality reference data, exercise schema, owned-source ingestion, and RAG reliability.

There is no fatal blocker to adopting the direction. There are, however, several repository-state blockers to executing the roadmap exactly as written. The most important correction is sequencing: the next block must begin with a schema audit and naming contract before adding new exercise fields, registries, or promotion gates.

The updated roadmap below keeps the Head of Engineering direction, preserves the Head of Content Strategy quality additions, and adjusts the order so it matches the repository as it exists today.

## Repository-State Baseline

Verified current state:

| Surface | Current state | Roadmap implication |
|---|---:|---|
| Micro-teaching units | 211 total, 211 live | R4.5 has moved the unit base forward; further mutation must remain CLI-only |
| Units with non-empty `needs` | 171 / 211 | False-root cleanup improved, but dependency quality is still not complete |
| Units with term links | 148 / 211 | Term linkage remains useful QC work, but not every procedure unit needs a concept term |
| Terms | 227 | Term base is usable for RAG and exercise schema work |
| Term `pitfall_nl` fields | 227 / 227 | The old "many terms lack pitfalls" concern is no longer current |
| Exam-question records | 349 | Large enough for schema review and decomposition backfill |
| Exam questions with `required_skills` | 322 / 349 | 27 records still need extraction-gap closure through protected-source-safe workflow |
| Target exercises | 49 | Current blueprint target exercise base is real but still only partial |
| Target exercises pointing to `knowledge/course_blueprint_v4.md` | 49 / 49 | R9.1 must repair these references to `references/owned/course-blueprint-v4.md` |
| RAG chunks | 863 | Internal RAG is present, but owned blueprint and lesson-source ingestion are still thin |
| Target-exercise chunks | 1 coarse chunk | RAG-03 remains required before production teacher-facing use |
| Evidence anchors | 15 anchors, 14 claims | Anchor density is still too low for authoritative retrieval claims |
| Alignment graph | 34 edges: 8 approved, 5 approved_with_conditions, 19 pending_review, 2 diagnostic_only | Graph is usable internally, not as full curriculum authority |
| Retrieval eval | 10 / 10 passing, 0 authority violations | Good smoke test, not yet a strong regression suite |
| Geometry verifier | Exists at `build-scripts/lib/verify_svg_geometry.py` | Final roadmap path must be corrected from `build-scripts/verify_svg_geometry.py` |

## Blocker Check Against the Final Roadmap

### No fatal blocker

The proposed final roadmap can proceed if the first sprint is a schema audit and contract sprint. The repository already has enough structure to support the plan: schemas, validators, reference reports, RAG chunks, owned blueprint source, sprint reports, and mutation CLI patterns.

### Blocking conditions before implementation

1. **Exercise schemas do not match current data yet.**

   `references/schemas/exam-question.schema.json` expects fields like `id`, `source_document_id`, `question_number`, and `required_units`. Current `references/external/exam-questions.json` uses fields like `exam`, `year`, `tijdvak`, `opgave_num`, `question_num`, `text`, `required_skills`, `question_type`, and `exam_codes`.

   `references/schemas/target-exercise.schema.json` expects `id`, `book`, and `required_units`. Current `references/authored/course-target-exercises.json` uses a different authored structure with `module`, `chapter`, `paragraph`, `target_exercise`, `lesson_goals`, `required_skills`, `missing_units_flagged`, and `source_ref`.

   This blocks direct implementation of the final roadmap's schema fields until Sprint 1 resolves naming and compatibility.

2. **The `required_skills` naming collision is real.**

   In current files, `required_skills` means micro-teaching-unit IDs. The proposed fine-grained skills or operations registry must not reuse that name without migration. Use one of:

   - `required_units` for micro-teaching-unit IDs
   - `exercise_operations` for fine-grained operations
   - `skill_tags` for non-unit skill taxonomy labels

3. **External exam-question data is protected.**

   `references/external/` is mirrored authority. The final roadmap must not imply hand edits to `references/external/exam-questions.json`. New role, authority, scaffolding, Bloom, instruction-word, or operation metadata should initially live in a derived overlay under `references/data/exercises/`.

4. **Owned blueprint integration is half-done.**

   The canonical owned blueprint exists at `references/owned/course-blueprint-v4.md`, with metadata in `references/owned/course-blueprint-v4.meta.json`. But `references/authored/course-target-exercises.json` still points all 49 target exercises back to `knowledge/course_blueprint_v4.md`. R9.1 must repair this before owned-source RAG can be called clean.

5. **RAG does not yet index owned course material deeply enough.**

   The chunk index has one coarse target-exercise chunk and no clear per-paragraph owned lesson chunks. That is acceptable for internal RAG development, but it blocks claims that retrieval is ready for broad teacher-facing production use.

6. **The precision-lint tool path in the final roadmap is stale.**

   The verifier exists at `build-scripts/lib/verify_svg_geometry.py`, not `build-scripts/verify_svg_geometry.py`. The roadmap should call for a wrapper or corrected path before `precision_lint_status` becomes a required field.

7. **New machine registries require CLI and validators first.**

   `references/machine/bronnen.json`, `references/machine/misconceptions.json`, and any unit-design status mutation are reasonable end states, but they must be created through schema, CLI, and validation. Do not create or edit machine registries by hand.

8. **The final roadmap has two schedule inconsistencies.**

   Phase E is listed as 2026-11-15 to 2027-01-31, while CP-7 Year-2 anchoring is targeted for 2026-09-04. Sprint 11 and Sprint 15 also both read like Year-1 closeout work. These are planning inconsistencies, not technical blockers, but they should be repaired before the roadmap becomes live.

## Updated Roadmap

The next roadmap should be organized as a data-quality program with two tracks:

- Engineering/reference track: schemas, registries, validators, RAG, and gates.
- Content-quality track: target exercises, blueprint coverage, exercise metadata, and year-by-year course backbone.

Student diagnostics, adaptive routing, student-facing AI, teacher cockpit deployment, automatic sequencing, and mastery decisions remain out of scope until this roadmap produces stronger data evidence.

## Cross-Team Checkpoints

The Head of Content Strategy checkpoint structure is restored as an explicit operating mechanism. Target dates are capacity-bound planning targets, not contractual delivery promises.

Each checkpoint follows the existing gate discipline:

```text
subagent review -> human review -> recorded decision
```

Allowed decisions:

```text
pass | pass_with_conditions | hold
```

Checkpoint records should live under:

```text
reports/review-gates/<gate-id>/
```

| Checkpoint | Capacity-bound target | Gate ID | Track gate | Engineering produces | Content reviews |
|---|---:|---|---|---|---|
| CP-1 Schema audit review | 2026-05-08 | `GATE-CP1-schema-audit` | Pre-R9.1 | Audit table plus vocabulary-rename and overlay proposal | Audit covers Bloom, vraagtype, instruction word, dual-coding stage, level, graph specs, precision lint, and direct eindterm linkage |
| CP-2 R9.1 owned-source scope review | 2026-05-15 | `GATE-CP2-owned-source-scope` | During R9.1 | Source-surface list with status and authority labels | All companion artefact types are represented where relevant; authority weights match content reality |
| CP-3 Schema extension dry run | 2026-06-05 | `GATE-CP3-schema-extension-dry-run` | Pre-bulk extension | One Tier A item and one Tier C target exercise manually represented in the proposed schema | Round trip is lossless enough that a reviewer can reconstruct the exercise without ambiguity |
| CP-4 Skill registry coexistence | 2026-06-19 | `GATE-CP4-skill-registry-coexistence` | Pre-skill-registry promotion | Three-layer hierarchy: categories on exercise, aspects on unit, fine-grained exercise operations | `skill-categories.md` content is preserved where still valid, including CvTE A mapping, vraagtype mapping, Bloom levels, and distribution rules |
| CP-5 D04 resolution | 2026-07-03 | `GATE-CP5-D04-resolution` | Pre-promotion on D-domain | D04 split/retire/redistribute proposal plus dependent-unit audit | VWO economics review checks the decision against actual D-domain exam items |
| CP-6 Year-1 paragraph-coverage closeout | 2026-07-24 | `GATE-CP6-year-1-paragraph-coverage` | Pre-Year-2 extension | `reports/blueprint-coverage.md` | Year 1 stays open if paragraph target coverage or precision status is not acceptable |
| CP-7 Year-2 anchoring review | 2026-09-04 | `GATE-CP7-year-2-anchoring` | Parallel content-track gate, pre-Year-2 Tier C authoring | Year-2 skeleton with CvTE-vwo anchor status per paragraph | `concept_orphan` rates and sequencing chains are coherent against Year 1 |
| CP-8 RAG eval content coverage | 2026-09-25 | `GATE-CP8-rag-eval-content-coverage` | During R7.6 | Expanded retrieval eval set, target 50-100 cases | Includes content-side queries from HCS feedback, including negative and ambiguity cases |

## Phase 0 - Adoption and Guardrails

Goal: adopt the strategic direction without making the live roadmap driftier.

Required actions:

1. Keep this document and its edit summary as human-review artifacts in `knowledge/Exercise schema and quality/`.
2. After approval, update `references/reference-team-roadmap.md` so the Sprint Ledger reflects this sequence.
3. Keep `references/machine/` and `references/external/` protected.
4. Treat all dates in the Head of Engineering roadmap as capacity-bound targets, not promises.
5. Record that the current product-surface sprints R10 through R13 remain blocked.

Acceptance:

- Live roadmap no longer points agents toward old R8-R14 product-surface expansion.
- Immediate next sprint is the schema audit, not implementation.

## Phase A - Schema Audit and Owned Source Foundation

### Sprint 1 - Schema Audit and Exercise Naming Contract

Goal: make the exercise schema plan compatible with the current repository.

Tasks:

- Compare actual current data against:
  - `references/schemas/exam-question.schema.json`
  - `references/schemas/target-exercise.schema.json`
  - `references/schemas/rag-chunk.schema.json`
  - `references/external/exam-questions.json`
  - `references/authored/course-target-exercises.json`
  - `references/data/rag/chunk_index.jsonl`
- Decide the canonical names:
  - `required_units` for micro-teaching-unit IDs
  - `exercise_operations` for fine-grained action/skill steps
  - `skill_tags` or `skill_category_tags` for broader skill taxonomy
- Decide which metadata belongs in source files and which belongs in overlays.
- Produce a migration plan for old `required_skills` fields.
- Confirm whether schema validation is strict, partial, or aspirational for each file.

Acceptance:

- A short schema-audit report exists.
- No new exercise fields are implemented before this sprint closes.
- The roadmap can use stable names without vocabulary collision.

### Sprint 2 - R9.1 Owned Source Registry and Blueprint Reference Repair

Goal: make owned course material a first-class reference surface.

Tasks:

- Register `references/owned/course-blueprint-v4.md` and `.meta.json` as the canonical current course-design source.
- Repair `references/authored/course-target-exercises.json` references that still point to `knowledge/course_blueprint_v4.md`.
- Inventory active owned-source surfaces:
  - blueprint
  - target exercises
  - paragraph markdown in `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`
  - paragraph plans
  - answer files
  - generated companion materials where they are source-like
- Classify each source as evidence, owned design intent, exposition, generated output, or diagnostic.
- Preserve the fact that the blueprint is partial: current year only, not a complete three-year design.

Acceptance:

- Owned-source manifest exists.
- Blueprint source references no longer point back to `knowledge/` as canonical.
- RAG can distinguish owned design intent from external authority.

### Sprint 3 - R9.2 Content Graph Projection

Goal: connect owned course content to the existing unit/term/evidence graph without pretending that exposition is evidence.

Tasks:

- Project blueprint paragraphs, target exercises, and lesson sources to units and terms.
- Use projection edges, not evidence edges, for lesson/book/blueprint content.
- Add metadata for partial coverage and missing paragraph targets.
- Keep `references/external/` and `references/machine/` unchanged unless a CLI-driven mutation sprint is explicitly approved.

Acceptance:

- Content graph projection exists.
- Retrieval can answer "where is this taught?" separately from "what proves this?"

## Phase B - Exercise Metadata and Quality Model

### Sprint 4 - Exercise Metadata Overlay MVP

Goal: add the Head of Content Strategy exercise fields in a protected-source-safe way.

Use overlays under `references/data/exercises/` before mutating protected source files.

Initial fields:

- `instructional_role`: what the exercise is for in the authored learning flow.
  - Initial vocabulary: `worked_example`, `startoefening`, `independent_practice`, `interleaving`, `target`, `verdieping`, `consolidatie`, `instapquiz`, `diagnostic`, `nieuws`.
- `assessment_role`: how the exercise relates to the exam/evidence graph.
  - Initial vocabulary: `exam_mirror`, `bridge`, `prerequisite`.
  - Sprint 1 decides whether this field is nullable or whether it needs an explicit `not_applicable` value.
- authority tier: external_exam, blueprint_target, authored_target, generated_practice, diagnostic
- `scaffolding` object:
  - `verbal_level`: integer 0-5
  - `visual_stage`: integer 1-4
  - `fading_position`: integer
  - `dual_coding_present`: boolean
- Bloom level
- instruction word
- answer format
- graph specification
- precision lint status
- evidence status
- source version
- content status

Important correction:

- Use `build-scripts/lib/verify_svg_geometry.py` or create a wrapper if roadmap language expects `build-scripts/verify_svg_geometry.py`.

Acceptance:

- Metadata can be attached to exam questions and target exercises without hand-editing `references/external/`.
- Validation catches missing or invalid overlay fields.
- Precision lint status can be `not_run` until graph assets are wired.
- Begeleide-inoefening graph exercises can express the mandatory rule `dual_coding_present: true` without collapsing it into a generic scaffolding level.

### Sprint 5 - R8.1 QC Issue Model, Scoped Down

Goal: define the minimum quality issue model needed for retrieval and reports.

Tasks:

- Add or validate issue fields:
  - title
  - category
  - affected entity
  - severity
  - evidence path
  - next action
  - proof required to close
  - owner or responsible lane
- Connect quality issues to retrieval warnings.
- Avoid building a full production QC gate yet.

Acceptance:

- Retrieval and reference-health reports can expose stale, weak, missing, or diagnostic-only data without treating it as authority.

## Phase C - Registry Layer for Better Exercise and RAG Semantics

### Sprint 6 - Bronnen Registry MVP

Goal: create the first controlled source-material registry.

Tasks:

- Create schema and validator for source documents.
- Decide whether the first implementation belongs in `references/data/` or `references/machine/`.
- If stored under `references/machine/`, create CLI first.
- Include source type, authority level, version, status, owner, and citation policy.

Acceptance:

- Source documents can be referenced consistently from exercises, chunks, and reports.
- No hand-edited machine registry is introduced.

### Sprint 7 - Skill and Operation Registry MVP

Goal: resolve the difference between unit IDs and exercise-level operations.

Tasks:

- Promote the useful parts of `references/authored/skill-categories.md` into a governed registry or overlay.
- Preserve the eight HCS categories if they survive schema audit.
- Do not use `required_skills` for this new layer unless the old field is migrated.
- Add mapping from exercise operation to unit ID where known.

Acceptance:

- Exercise decomposition can say both "this exercise needs unit A15" and "this exercise asks the learner to interpret elasticity."

### Sprint 8 - Misconception Registry MVP

Goal: make recurring errors retrievable and usable in exercise design.

Tasks:

- Create schema and validator for misconception records.
- Link misconceptions to terms, units, exercise operations, and evidence where available.
- Keep the first pass small and focused on high-traffic topics.

Acceptance:

- Retrieval can surface misconception warnings without treating them as primary evidence.

## Phase D - Unit Design Quality and D04 Resolution

### Sprint 9 - Unit Design Status and D04 Resolution

Goal: stop D04 and similar unstable units from silently supporting promotion workflows.

Tasks:

- Decide whether `unit_design_status` is a machine-unit field or a derived quality overlay.
- Prefer a derived overlay first unless the CLI is ready to mutate unit schema safely.
- Resolve D04 as one of:
  - retire
  - merge
  - redistribute
  - split into successor units
- Audit dependent units that currently assume D04-like aggregate behavior.

Acceptance:

- D04 is no longer an unresolved design bucket.
- C-to-B promotion gates can check whether required units are stable.

## Phase E - RAG Hardening

### Sprint 10 - R7.6 RAG Quality Hardening

Goal: close the R7.4 follow-up conditions before any broader teacher-facing reliance.

Tasks:

- RAG-01: improve retrieval label wording.
- RAG-02: add weak-match warnings and score threshold behavior.
- RAG-03: split target exercises into per-exercise chunks.
- RAG-04: create evidence-anchor coverage report.
- Expand retrieval eval cases from smoke-test scale toward a real regression suite.
- Backfill evidence anchors for high-traffic concepts and newly added foundation units.

Acceptance:

- Retrieval preserves source authority, edge status, evidence status, and weak-match warnings.
- Target exercises are separately retrievable.
- Evidence-anchor gaps are visible by chunk type and entity type.

## Phase F - Curriculum Versioning and Decomposition Backfill

### Sprint 11 - R14.1 Minimal Curriculum Versioning

Goal: prevent retrieval from mixing source versions silently.

Tasks:

- Add minimal version metadata to source documents, exercise overlays, and RAG chunks.
- Record syllabus/exam-program version where available.
- Record blueprint version and partial-year status.

Acceptance:

- Retrieval can show which source version supports a claim or exercise.

### Sprint 12 - Exam and Target Exercise Decomposition Backfill

Goal: use the new schema to improve the existing 349 exam records and 49 target exercises.

Tasks:

- Add overlay metadata for the existing exam-question corpus.
- Add overlay metadata for the 49 target exercises.
- Close known exam-question extraction gaps through protected-source-safe overlays or refresh scripts.
- Do not mutate `references/external/` by hand.

Acceptance:

- At least the first high-priority slice has role, authority, Bloom, instruction word, operation tags, evidence status, and source version metadata.

## Phase G - Content Track

This track can run in parallel once Sprint 1 has fixed the schema vocabulary.

### Content Track 1 - Year-1 Target Exercise Coverage

Goal: close the current partial-year course-design backbone.

Tasks:

- Identify paragraphs with no target exercise.
- Author missing Year-1 target exercises where course design requires them.
- Keep every target exercise connected to owned blueprint source, unit IDs, and evidence status.

Acceptance:

- Year-1 paragraph coverage report exists.
- Missing target exercises are separated from deliberately deferred paragraphs.

### Content Track 2 - Year-1 Precision and Dual-Coding Audit

Goal: prevent the exercise schema from becoming metadata only.

Tasks:

- Audit graphs and scaffolded visual reasoning.
- Record precision lint status where the verifier applies.
- Record cases where no graph lint is applicable.

Acceptance:

- Exercise metadata reflects actual teaching quality, not just administrative fields.

### Content Track 3 - Year-2 Skeleton

Goal: prepare the second-year course backbone without weakening Year-1 quality.

Corrected sequencing:

- CP-7 is a parallel content-track checkpoint, not an engineering Phase E gate.
- Year-2 skeleton work may begin as content drafting during the engineering roadmap, but C-to-B promotion waits for the gates below.
- Target dates are capacity-bound; if engineering gates slip, content drafting can continue with explicit `concept_orphan` and evidence-status labels.

Acceptance:

- Year-2 paragraphs have tentative target exercises and explicit evidence/anchor status.
- Unanchored concepts remain marked as unapproved for retrieval coherence tests.

## Phase H - Promotion Workflow

### Sprint 13 - Composition Pattern Registry

Goal: make exercise structure reusable without generating ungrounded tasks.

Tasks:

- Define composition patterns for exercise types.
- Link patterns to operations, source authority, the scaffolding object, instructional role, assessment role, and evidence status.
- Keep this as an internal authoring-support layer.

Acceptance:

- Pattern retrieval can assist authors without approving student-facing content.

### Sprint 14 - C-to-B Promotion Workflow

Goal: create a controlled path from concept blueprint exercises to stronger exercise authority.

Do not start until:

- schema audit is closed
- owned-source registry is closed
- exercise overlay MVP is closed
- D04/unit-design status is usable
- R7.6 RAG hardening is closed
- R14.1 versioning is closed
- precision lint path is corrected

Acceptance:

- First promotion batch passes with:
  - stable required units
  - source authority labels
  - evidence status
  - version metadata
  - graph precision status where applicable
  - human review

## Phase I - Re-Evaluate Product Surfaces

Only after the data-quality roadmap above has passed review should the team revisit:

- R10 diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- mastery decisions
- summative assessment decisions
- teacher cockpit deployment

The expected decision point is not "can we build these?" but "does the data now justify these uses?"

## Recommended Immediate Next Step

After human approval of this proposal:

1. Plan and baseline-report Sprint 1 using the existing sprint procedure.
2. Run Sprint 1 as a non-mutating schema audit while the live roadmap update is prepared.
3. Update the live roadmap in `references/reference-team-roadmap.md` after this proposal's corrections are accepted.
4. Add Sprint 1 as the immediate next sprint.
5. Keep R9.1 as the first implementation sprint after Sprint 1.
6. Do not start R8-R13 product-surface work.

This keeps the company focused on high-quality data, exercise schema, owned-source RAG, and governed retrieval before it builds new features on top of incomplete foundations.

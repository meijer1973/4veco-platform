# Proposed Data-Quality Roadmap Map

Status: human-review draft, not the live roadmap.

This map translates `knowledge/handoff-exercise-schema-and-rag-quality.md` into a repository-grounded sequence after R4.5.

## Current Live Baseline

- R4.5 is complete.
- Live unit catalog: 209 live units.
- Live term registry: 227 terms.
- R7.4 is closed as `pass_with_conditions`.
- Student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, and unreviewed student-facing publication remain blocked.
- Next live roadmap sprint is `R9.1 Owned Source Registry`.

## Recommended Sequence

| Order | Sprint / work packet | Status | Why now | Key guardrail |
|---:|---|---|---|---|
| 1 | Schema Audit + Exercise Object Grounding | New review-prep packet | Current schemas do not match actual exam/target-exercise data shape closely enough to extend safely | No protected-source mutation |
| 2 | R9.1 Owned Source Registry | Existing roadmap sprint | Owned blueprint and lesson/book surfaces must be registered before RAG can retrieve active course material well | Owned exposition is not external authority |
| 3 | R9.2 Content Graph Projection | Existing roadmap sprint | Connect owned content to units/terms with projection edges | Projection edges are not evidence edges |
| 4 | Exercise Authority/Role/Scaffolding Schema Extension | New sprint after audit | Handoff's three axes are sound, but need a safe storage model | Prefer overlay or CLI/refresher; do not hand-edit `references/external/` |
| 5 | Skill/Operation Registry MVP | New sprint after vocabulary decision | `skill-categories.md` is prose; exam decomposition needs governed IDs | Resolve `required_skills` naming collision first |
| 6 | R7.6 RAG Quality Hardening | Existing roadmap sprint | Expand evals, evidence anchors, warnings, target-exercise chunks | Internal/teacher-facing non-authoritative only |
| 7 | R14.1 Minimal Curriculum Versioning | Existing roadmap sprint | Needed before promotion workflows can compare exercises across curriculum versions | Keep minimal |
| 8 | Exam Item Decomposition Backfill | New later sprint | Attach governed skill/operation/composition IDs to Tier A items | Requires registry and schema decisions first |
| 9 | Concept Blueprint Extension Pass 1 | New later sprint | Three-year skeleton can reveal future coverage gaps | `concept_draft`, not authoritative |
| 10 | Concept Blueprint Extension Pass 2 | New later sprint | Draft target exercises for all three years | Tier C only; human review required |
| 11 | C-to-B Promotion Workflow | New later sprint | Promotion needs authority model, evals, versioning, human gates | Automated tests only create eligibility |

## Defer / Keep Blocked

The handoff's deferrals remain correct:

- R10 diagnostics and adaptive routing
- R11 game/simulation content mapping
- R12 teacher cockpit/privacy/accessibility deployment
- R13 AI tutor
- R14.2/R14.3 learning-impact or continuous-improvement claims
- R8.2 production QC gates until owned-source ingestion exists

## Proposed Roadmap Edits If Approved

1. Add a new short sprint before or inside R9.1: `Schema Audit + Exercise Object Grounding`.
2. Keep R9.1 as immediate live sprint, but explicitly include:
   - `references/owned/course-blueprint-v4.md` as canonical owned blueprint;
   - repair or annotation of `course-target-exercises.json` source refs still pointing to `knowledge/course_blueprint_v4.md`;
   - active lesson-source discovery for `4veco-lessen`.
3. Add a future schema-extension sprint for authority/role/scaffolding after the audit.
4. Add a vocabulary decision before any skill registry promotion.
5. Keep R7.6, R8.1, and R14.1, but do not let them turn into product-surface work.

## Suggested Human Decision

Approve the direction, but require the schema audit before any live schema or exercise-record mutation.

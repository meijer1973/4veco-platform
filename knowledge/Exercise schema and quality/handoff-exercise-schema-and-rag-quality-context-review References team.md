# Context Review: Exercise Schema and RAG Quality Handoff

Date: 2026-04-28
Reviewed source: `knowledge/handoff-exercise-schema-and-rag-quality.md`
Live comparison source: `references/reference-team-roadmap.md` after R4.5

## Short Judgment

The handoff direction is sound: the roadmap should stay focused on reference/RAG data quality, not product surfaces. The strongest ideas are:

- treat exercises as first-class data objects;
- preserve authority, role, and scaffolding as separate axes;
- register owned lesson/book/blueprint sources before relying on them in retrieval;
- expand retrieval evals and evidence anchors before diagnostics or AI;
- defer R10-R13 product surfaces.

But the handoff is partly stale and should not be copied into the live roadmap as-is. It was written before R4.5 and before the current roadmap hygiene work. Several metrics and assumptions no longer match the repository.

## Context Corrections

| Handoff claim | Current repository state | Judgment |
|---|---|---|
| 190 live units | 209 live units after R4.5 | Stale |
| 48 live units have no `needs` | 39 live units have no `needs` | Stale but issue remains |
| 44 live units have no term links | 63 live units have no term links | Stale; R4.5 minted many procedure/instrument units |
| `alternatieve kosten` and `schaarste` unresolved | Both are now canonical B-domain terms in `begrippen.json`; unit-term slug migration has 0 unresolved | Resolved by R4.5 |
| 15 anchors / 13 claims | 15 anchors / 14 claims | Slightly stale |
| 0 human-approved graph edges | Graph has 8 `approved`, 5 `approved_with_conditions`, 19 `pending_review`, 2 `diagnostic_only` | Stale after R5.3/R4.5 |
| 31 graph edges | Current graph has 34 edges | Stale |
| 10 retrieval eval cases, 10/10 pass | Still true | Correct, but still only smoke-test breadth |
| 165 of 225 terms lack pitfalls | 165 of 227 terms lack pitfalls | Still materially correct |
| 27 exam-question records lack `required_skills`; 19 also lack `exam_codes` | Still present in `reports/json/exam-question-extraction-gaps.json` | Correct |
| Owned lesson material is not in chunk index | Current chunk index has 1 coarse `target_exercise` chunk and no `references/owned/course-blueprint-v4.md` chunks; active lesson repo ingestion is not present | Correct |
| Immediate Next Sprint section stale on R7.4 | Live roadmap now says next sprint is R9.1 | Already fixed |

## Schema Audit Highlights

This is the most important grounding issue in the handoff.

The repo has schema files, but several are not aligned with the actual data shapes:

| Surface | Current schema | Actual data | Risk |
|---|---|---|---|
| `references/schemas/exam-question.schema.json` | requires `id`, `source_document_id`, `question_number`, uses `required_units` | actual records use `exam`, `year`, `question_num`, `text`, `required_skills`, `exam_codes` | Schema is not currently a reliable contract for `exam-questions.json` |
| `references/schemas/target-exercise.schema.json` | requires `id`, `book`, `required_units` | actual file has top-level metadata and `exercises[]` with `module`, `chapter`, `paragraph`, `required_skills`, `target_exercise` | Schema is too thin and mismatched |
| `references/schemas/rag-chunk.schema.json` | minimal required fields only | actual chunks carry extra governance fields such as `edge_statuses`, `curriculum_authority`, `primary_evidence`, warnings | Schema lags actual R7.4 requirements |
| `references/authored/skill-categories.md` | prose markdown | not a governed registry | Handoff is right that this is not query-safe |

Coverage checks from current data:

| Surface | Field coverage notes |
|---|---|
| `exam-questions.json` | 349 records; `required_skills` populated 322/349; `exam_codes` 330/349; authority/role/scaffolding/operations fields do not exist |
| `course-target-exercises.json` | 49 records; `required_skills` 49/49; `exam_codes` 38/49; authority/role/scaffolding/operations/evidence anchors do not exist |
| `micro-teaching-units.json` | 211 total; `terms` 148/211; `procedure` 120/211; `zero_needs_review` 7/211 |
| `begrippen.json` | 227 terms; definitions/examples 227/227; pitfalls 62/227; reverse-linked to teaching units 97/227 |
| RAG chunks | 863 chunks; evidence IDs present on 49/863; edge statuses present on graph-edge chunks only |

## Important Vocabulary Issue

The handoff uses `skills` in a new sense: reusable student capabilities below or across units. The current repository uses `required_skills` in exam questions and target exercises to mean **micro-teaching unit IDs** such as `A04`, `D06`, or `G02`.

Do not introduce a new skill registry without first deciding how to avoid this naming collision.

Recommended decision:

- rename or alias current `required_skills` as `required_units` in future schemas;
- reserve `skill_ids` for the future governed skill registry;
- keep migration non-mutating until a schema compatibility plan exists.

## Protected Surface Issue

The handoff suggests backfilling `references/external/exam-questions.json` with `authority=A`.

That is conceptually right but mechanically risky. `references/external/` is protected/mirrored authority. Do not hand-edit it. Prefer one of:

- a generated overlay under `references/data/exercises/`;
- a refresh/extraction workflow that writes the external index;
- a CLI/refresher with explicit validation and mutation logs.

Same caution applies to any exercise-object extension of external exam records.

## Blueprint Placement Issue

The canonical owned blueprint is now:

- `references/owned/course-blueprint-v4.md`
- `references/owned/course-blueprint-v4.meta.json`

However, `references/authored/course-target-exercises.json` still says:

```text
blueprint_source: knowledge/course_blueprint_v4.md
```

and its `source_ref` values still point to `knowledge/course_blueprint_v4.md`.

This is not a fatal defect, but R9.1 should repair or explicitly preserve this as a historical source pointer. The live reference system should prefer `references/owned/course-blueprint-v4.md` as the current owned curriculum-design source.

## Roadmap Recommendation

Do not replace the live roadmap with the handoff sequence. Use it as design input.

Recommended near-term shape:

1. **New human-review prep sprint:** Schema Audit + Exercise Object Grounding
   Audit actual file shapes, decide `required_skills` vs `required_units`, choose overlay-vs-direct mutation strategy, and produce a concrete schema repair packet.

2. **R9.1 Owned Source Registry**
   Keep as the next live sprint, but include blueprint-source-path repair and active lesson-source discovery.

3. **R9.2 Content Graph Projection**
   Keep projection edges separate from evidence edges. Do not make owned exposition curriculum authority.

4. **Exercise Object Schema Extension**
   Add authority, role, and scaffolding only after the schema audit resolves the current mismatch.

5. **Skill/Operation Registry MVP**
   Promote `skill-categories.md` only after the vocabulary decision. Start minimal.

6. **R7.6 RAG Quality Hardening**
   Expand evals, warnings, target-exercise chunking, evidence-anchor coverage, and anchor backfill.

7. **R14.1 Curriculum Versioning**
   Required before any formal C-to-B promotion workflow, but not necessarily before R9.1.

8. **Later:** Exam decomposition, concept three-year blueprint passes, C-to-B promotion workflow.

## Human Review Questions

1. Should we add a small pre-R9.1 sprint for schema audit and exercise-object grounding, or fold that audit into R9.1?
2. Should exercise authority/role/scaffolding be stored as an overlay under `references/data/exercises/` instead of modifying `references/external/exam-questions.json`?
3. Should future schemas rename current `required_skills` to `required_units` to avoid conflict with a real skill registry?
4. Should skills and operations be one governed registry or two linked registries?
5. Should the three-year concept blueprint stay in `knowledge/` until reviewed, then move into `references/owned/` with `concept_draft` metadata?
6. Should R7.6 happen before or after R9.1/R9.2? Current evidence suggests after owned-source ingestion, but the weak-match and label fixes could be done earlier.

## Bottom Line

Accept the handoff's direction, but not its exact sequence or stale metrics. The next safe move is not to implement the sketched exercise schema immediately; it is to run a schema/file-shape audit and decide where exercise-object metadata should live without violating protected-source rules.

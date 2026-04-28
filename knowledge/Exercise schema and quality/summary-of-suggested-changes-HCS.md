# HCS Summary — Suggested Changes, Dates, Motivation

**From:** Head of Content Strategy
**Date:** 2026-04-28
**Status:** Executive summary. Companion to `feedback-to-engineering-HCS.md` (full reasoning) and `roadmap-HCS.md` (sequenced plan).

---

## 1. Position in one paragraph

The engineering proposal points the right direction — RAG quality before product surfaces, exercises as first-class objects with three independent axes, concept-tagged blueprint extension. The references team has correctly grounded it in real repository state. Content strategy supports both, but the schema as drafted under-specifies the didactic dimensions the platform already enforces (Bloom distribution, vraagtype distribution, dual-coding fade as a four-stage axis, instruction-word taxonomy), introduces a vocabulary collision with `required_skills`-as-unit-IDs, and sequences Year-2/3 blueprint extension ahead of Year-1 closure and D04 resolution. The fix is a set of eleven schema extensions, eight cross-team checkpoints between engineering and content, a D04 resolution gate before C→B promotion can run, and a year-by-year staging of the blueprint extension.

---

## 2. The eleven content-side schema additions

Each addition is non-negotiable from the content side because content quality cannot be assessed without it. None requires a code change; this list is a content-strategy specification engineering implements during the schema-extension sprint.

| # | Addition | Why it matters | Latest date |
|---|---|---|---|
| 1 | Rename `required_skills` → `required_units`; reserve `skill_ids` for the future fine-grained registry | Eliminates the vocabulary collision the references team flagged. Without it, three layers (units, 8-categories, fine-grained sub-skills) collide in one field name. | 2026-05-15 (Sprint 4) |
| 2 | Replace `scaffolding: enum(scaffolded\|partial\|faded)` with `scaffolding: { verbal_level 0–5, visual_stage 1–4, fading_position int, dual_coding_present bool }` | Verbal scaffolding (hints, denkstappen) and visual scaffolding (dual-coding fade) are independent. The mandatory rule for begeleide-inoefening graphs is `dual_coding_present: true` regardless of verbal level. The categorical enum collapses both into one and silently breaks scaffolding QC. | 2026-06-05 (Sprint 4 dry-run) |
| 3 | Split `role` into `instructional_role` (worked_example, startoefening, independent_practice, interleaving, target, verdieping, consolidatie, instapquiz, diagnostic, nieuws) and `assessment_role` (exam_mirror, bridge, prerequisite) | The proposed five roles miss the artefact taxonomy the lessen team actually authors. `worked_example`, `interleaving`, and the three startoefening tiers are pedagogically distinct from `practice`. A consolidatie multi-question opgave is structurally different from a single-question item. | 2026-06-05 (Sprint 4 dry-run) |
| 4 | Add `instruction_word` enum (noem, bereken, leg-uit-dat, leg-uit-of, classificeer, beoordeel, toon-aan, teken, arceer, redenering) | `skill-categories.md §2.8` calls instructiewoorden the single largest source of lost CvTE points. They drive student-visible answer form. Cannot remain buried in a free-text taught_modality. | 2026-06-05 |
| 5 | Add `vraagtype: enum(1..7)` and `bloom_level: enum(onthouden..creëren)` | `vraagtypen-en-opgaveontwerp.md §1.1` and `§4.1` define hard QC targets per paragraph (vraagtype frequency and Bloom 25/40/35 split). Without these on the exercise, retrieval cannot answer "show me Type-3 exercises at Bloom analyseren" — a routine teacher query. | 2026-06-05 |
| 6 | Add `reasoning_chain_length: int` | CvTE's "Maak een redenering" pattern requires ≥2 schakels. Partial-credit risk if zero or one. Without this, retrieval cannot detect single-link drafts. | 2026-06-05 |
| 7 | Add `source_artifact_id: string` + a bronnen registry stub (~30 IDs) | Real CvTE opgaven hang on bronnen (table, graph, news clip, payoff matrix). Without source-artefact linkage, generated Tier C items will match the skill list but feel nothing like real exam items. | 2026-06-19 (Sprint 5) |
| 8 | Add `graph_specs: [...]` and `precision_lint_status: enum(passed\|not_run\|failed)` driven by an external linter | The schema as drafted does not protect the four standards `economic_mathematical_precision_reference.md` defines: object identification, ceteris paribus, text-graph-formula matching, units. These are exactly the errors students learn permanently when scaffolded. The SVG-geometry verifier already exists at `build-scripts/verify_svg_geometry.py`; expose its result as a field. | 2026-06-19 |
| 9 | Add `level: havo \| vwo` to `authority` and propagate to coherence-test scope | `exam-questions.json` already records `level` on every record. Without `level` propagation, a havo Tier A item could anchor a vwo Tier C — wrong, since vwo adds Domein A4 strategisch inzicht. | 2026-06-05 |
| 10 | Add `unit_design_status: stable \| unstable \| deprecated` to units; promotion gate refuses C→B when any required unit is unstable | D04 (Elasticiteit en goederenclassificatie) currently has no `procedure`, no `pitfalls`, mastery `understand` for content tested at `apply`. Promoting any C exercise that depends on D04 would encode an incoherent mastery target. | 2026-07-03 (CP-5) |
| 11 | Add `concept_orphan: boolean` for Year-2/3 concept exercises and `cvte_anchor_required: true` requirement | Year-2/3 exercises without a real CvTE-vwo anchor (174 vwo records exist — sufficient anchoring) would feed RAG as Tier C with shaky pedigree. The `concept_orphan` flag excludes them from coherence tests until anchored. | 2026-09-04 (CP-7) |

---

## 3. The eight cross-team checkpoints

Each checkpoint is a structured handover with `pass | pass_with_conditions | hold` outcome. Format mirrors existing review gates.

| ID | Title | Latest date | Engineering produces | Content reviews |
|---|---|---|---|---|
| CP-1 | Schema audit review | 2026-05-08 | Audit table for all schemas + records; vocabulary-rename overlay proposal | Audit covers Bloom, vraagtype, instruction-word, dual-coding stage, level, graph_specs, precision_lint_status, eindterm direct linkage |
| CP-2 | R9.1 owned-source scope review | 2026-05-15 | List of source surfaces with status labels | All 16+ companion artefact types listed; authority weights match content reality |
| CP-3 | Schema extension dry-run | 2026-06-05 | Manual extension of one Tier A item + one Tier C target exercise to new schema | Lossless round-trip; reviewer can reconstruct opgave on paper without ambiguity |
| CP-4 | Skill registry coexistence | 2026-06-19 | Three-layer hierarchy: categories on exercise, aspects on unit, skill_ids fine-grained | All `skill-categories.md` content preserved (CvTE A mapping, vraagtype mapping, Bloom levels, F/B/S/E links, distribution rules) |
| CP-5 | D04 resolution | 2026-07-03 | D04 split proposal (3–5 successor units) + dependent-unit audit | VWO economics teacher subagent reviews split against actual D-domain exam items; `unit_design_status` field added |
| CP-6 | Year-1 paragraph-coverage closeout | 2026-07-24 | `reports/blueprint-coverage.md` | Year-1 stays open if >5 paragraphs without target exercise or >10 with `precision_lint_status != passed` |
| CP-7 | Year-2 anchoring review | 2026-09-04 | Year-2 skeleton with CvTE-vwo anchor per paragraph | `concept_orphan` rate <20%; sequencing chains coherent against Year-1; D-domain and L-domain coverage checked against syllabus 2026-v2 |
| CP-8 | RAG eval content coverage | 2026-09-25 | Expanded eval set 50–100 cases | At least 10 content-side queries from `feedback-to-engineering-HCS.md §2`, including ≥2 negative cases |

---

## 4. Sprint-sequence edits at a glance

Compared to the references-team proposed sequence, HCS adds three sprints, scope-extends three, and stages two:

| Reference-team sprint | HCS edit | Date target |
|---|---|---|
| 1. Schema audit | scope-extended (CP-1 fields list) | 2026-05-08 |
| 2. R9.1 Owned source registry | scope-extended (16+ companion artefact types, blueprint source-ref repair) | 2026-05-15 |
| 3. R9.2 Content graph projection | scope-extended (companion-artefact projection edges) | 2026-05-31 |
| 4. Exercise schema extension | extended with the 11 additions in §2 | 2026-06-05 |
| 5. **NEW Bronnen registry stub** | added because composition-pattern registry needs it | 2026-06-19 |
| 6. Skill/operation registry MVP | reframed: 8-category vocabulary preserved; operations registry **deferred to Sprint 11** | 2026-06-19 |
| 7. **NEW Misconception registry stub** | added, ~20 high-priority IDs, defer formalisation to R10.1 | 2026-06-26 |
| 8. **NEW D04 resolution sprint** | added, blocks C→B promotion on D-domain | 2026-07-03 |
| 9. R7.6 RAG quality hardening | scope-extended (CP-8 content-query coverage) | 2026-09-25 |
| 10. **NEW Year-1 paragraph-coverage closeout** | added, content track-led, gates Year-2 extension | 2026-07-24 |
| 11. Exam item decomposition backfill | now also bootstraps operations registry | 2026-08-31 |
| 12. **NEW Composition pattern registry** | added with mandatory `source_artifact_required`, `question_chain_length`, `escalation_profile`, `bloom_curve` | 2026-08-31 |
| 13. R14.1 Curriculum versioning | unchanged | 2026-09-15 |
| 14. Concept blueprint extension Pass-1A (Year-1 closure) | reframed: this is closure, not extension | 2026-07-24 |
| 15. **NEW Year-1 sequencing + dual-coding audit** | added, catches errors before promotion | 2026-09-15 |
| 16. Concept blueprint extension Pass-2 (Year-2 skeleton) | staged: only after CP-6, every paragraph anchored to CvTE-vwo item | 2026-09-04 |
| 17. C→B promotion workflow | gate refuses unstable units, failed lints, level mismatches, concept_orphans | 2026-11-30 |

---

## 5. Motivation per major edit

### 5.1 Why rename `required_skills` first
The references team showed that 322/349 exam-question records and 49/49 target-exercise records use the field. Engineering wants to introduce a parallel `skills` field for sub-unit cognitive capabilities. With both names live simultaneously, content authors cannot tell which field they are tagging without reading both schemas. The rename to `required_units` reflects the *literal data*: A04 *is* a unit ID. This is a one-time pass; later renames cost more.

### 5.2 Why scaffolding must be four fields, not one enum
The platform's mandatory rule for begeleide inoefening (`feedback_inoefening_scaffolding`) says graph exercises require `dual_coding_present: true`. The Niveau 0–5 verbal scaffolding (`didactiek-principes.md §4.1`) is ordinal across hint richness. The four-stage visual fade (§4.4) is ordinal across visual abstraction. These are independent dimensions. Collapsing them into `scaffolded | partial | faded` makes "did this graph exercise have an image scaffold?" unanswerable from the schema alone — and that's exactly the question the QC gate asks.

### 5.3 Why instructional and assessment roles are orthogonal
A `worked_example` (read, don't solve) can be either a `prerequisite` or a `bridge` in the assessment graph. A `consolidatie` opgave can mirror an exam item or set up a bridge. Treating them as one field forces unnatural choices and loses information. The lessen team's actual artefact taxonomy (16+ types) cannot be expressed without the split.

### 5.4 Why instruction-word is first-class
`skill-categories.md §2.8` is explicit: "Antwoordvorm matcht niet het instructiewoord (bijv. 'Noem' beantwoorden met causale keten)" is the failure mode that costs students points. CvTE's instructiewoorden have an exact answer-form mapping and a Bloom-level mapping. Without `instruction_word` on the exercise, retrieval cannot detect a draft that uses a "Leg uit dat" stem with a "Noem" answer model.

### 5.5 Why bronnen registry precedes composition-pattern registry
30+ randomly-sampled CvTE exam items show that almost every opgave has at least one bron (table, graph, news clip). A composition-pattern registry that doesn't require a bron will generate items that match the skill decomposition but feel nothing like real exams. Mint the bronnen registry first; then patterns can be anchored.

### 5.6 Why D04 resolution must precede C→B promotion
D04 has `mastery_target: understand` for content the syllabus tests at `apply` (D1.7, D1.8). It has no `procedure`. It has no `pitfalls`. Its `aspects` is `["verbaal"]` only — no graphical even though elasticity is graphical. Promoting any C exercise that depends on D04 from C → B would lock in an incoherent mastery target across the dependent units (D11, D12, D27 in the current catalog). The fix is a 3–5-way split, reviewed by a teacher subagent against actual D-domain exam items.

### 5.7 Why Year 1 must close before Year 2/3
49 target exercises today against 80 expected paragraphs ≈ 61% Year-1 coverage. Books 3 and 4 of the blueprint are largely empty in target-exercises.json. Authoring concept exercises for Year 2 against an unfinished Year 1 catalog is high-rework: every Year-2 exercise written today against a moving Year-1 unit definition needs revisiting later. The cheap proxy (`cvte_anchor_required` against vwo exam items) catches Year-2 sequencing errors *before* they enter retrieval.

### 5.8 Why precision_lint_status is required
`economic_mathematical_precision_reference.md` exists because precision errors in scaffolded material teach students the error effectively (`didactiek-principes.md §1.4`). The SVG-geometry verifier (`build-scripts/verify_svg_geometry.py`) already runs as a content rule per memory. Exposing its result as a schema field lets retrieval surface and filter. No human can sustain this check at scale across hundreds of graphs.

### 5.9 Why misconception registry is stubbed now, not formalised now
The shift-vs-movement misconception alone repeats across 6+ locations today. A diagnostic exercise's distractors should each cite a misconception ID; today they cannot. Stubbing 20 high-priority IDs now enables `diagnostic` role exercises and lets reviewers ask which misconceptions are covered. Full formalisation (with diagnostic-routing logic) waits for R10.1 — but the stub itself is foundational.

### 5.10 Why a content-side eval is mandatory in CP-8
Engineering's eval expansion will likely focus on retrieval-quality regression: precision, recall, source-rank correctness. Content's eval is different: can a content reviewer answer "show me a stage-2 visual fade exercise for elasticity at Bloom analyseren" from retrieval alone? The `feedback-to-engineering-HCS.md §2` table lists ten such queries. Without them in the eval set, RAG can pass engineering's gates but fail content's.

---

## 6. Proposed object-date table

This is the date contract content strategy holds engineering to. Slipping any of these dates by more than two weeks triggers a content-track replan, not a content-track override.

| Object | Latest acceptable date |
|---|---|
| Vocabulary-rename overlay landed | 2026-05-15 |
| R9.1 owned-source registry covering 16+ companion artefact types | 2026-05-15 |
| R9.2 projection edges include companion artefacts | 2026-05-31 |
| Schema extension dry-run round-trips lossless | 2026-06-05 |
| Bronnen registry stub minted (≥30 IDs) | 2026-06-19 |
| Skill registry promoted with 8-cat vocabulary preserved | 2026-06-19 |
| Misconception registry stub minted (≥20 IDs) | 2026-06-26 |
| D04 split approved by teacher subagent | 2026-07-03 |
| Year-1 paragraphs covered (80/80, all `precision_lint_status: passed \| not_run`) | 2026-07-24 |
| Existing 49 target exercises backfilled with instruction-word, vraagtype, Bloom | 2026-08-31 |
| Year-1 D-domain audit closed | 2026-08-15 |
| Year-1 sequencing + dual-coding audit closed | 2026-09-15 |
| Year-2 skeleton with CvTE-vwo anchors | 2026-09-04 |
| RAG eval covers content-side queries | 2026-09-25 |
| First C→B promotion batch through review gate | 2026-11-30 |
| Year-2 Tier C content for Books 1–2 | 2026-11-30 |

---

## 7. What content strategy is NOT asking for

Explicitly: nothing in this packet asks engineering to build diagnostics, adaptive routing, mastery decisions, AI tutor surfaces, teacher cockpit deployment, or game/simulation product mapping. All deferrals from the references team and the engineering proposal are accepted without reservation.

---

## 8. Bottom line

Three documents accompany this summary:

- `feedback-to-engineering-HCS.md` — the full reasoning behind every change.
- `roadmap-HCS.md` — the sequenced plan with sprint-by-sprint detail.
- `summary-of-suggested-changes-HCS.md` — this document.

The position is: accept the engineering direction, apply the references-team corrections, extend the schema with the eleven additions in §2, run the eight checkpoints in §3, hit the dates in §6. RAG quality strong enough for content-side queries by 2026-09-25; first C→B promotion through the gate by 2026-11-30; Year-2 Tier C content authored ahead of cohort 2027/2028.

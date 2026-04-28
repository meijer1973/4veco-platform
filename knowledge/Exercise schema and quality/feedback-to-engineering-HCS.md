# HCS Feedback on Exercise Schema and RAG Quality Proposal

**From:** Head of Content Strategy
**To:** Head of Engineering, with copy to References Team and Lessen Team
**Date:** 2026-04-28
**Status:** Strategic feedback. No code or data changes have been made; this is a read-only review of the proposal, the references-team context review, and the live repository state.
**Scope of review:** `4veco-platform/` and `4veco-lessen/` only.

---

## 1. Executive position

The direction of the engineering proposal is correct and content strategy supports it. RAG quality before product surfaces is the right priority. Exercises as first-class objects with three independent axes (authority, role, scaffolding) is the right organising principle. Concept-tagged blueprint extension is the right way to seed retrieval with target-exercise evidence ahead of full curriculum design.

**However**, the proposal as written has three problems that would degrade content quality if implemented as-is:

1. **It is under-specified for didactic reality.** The platform already has hard QC rules — Bloom distribution per paragraph, vraagtype distribution, the 8-category skill taxonomy, dual-coding fade as a four-stage axis distinct from verbal scaffolding, instruction-word taxonomy as the single largest source of lost CvTE points. None of these survive intact in the proposed schema. If the schema becomes canon as drafted, retrieval will not be able to answer questions that QC already requires answers to today.

2. **It collides with existing vocabulary.** `required_skills` already means *unit IDs* in 322/349 exam-question records and 49/49 target-exercise records. Introducing a parallel "skills" registry without renaming is a foreseeable drift hazard; the references team flagged this and they are right.

3. **It sequences C-tier blueprint extension ahead of foundation closure.** Year 1 of the blueprint is roughly 61% covered today (49 target exercises against 80 paragraphs). Several anchor units (D04 most prominently) are unstable. Extending Tier C to Years 2–3 before Year 1 is closed and D04 is split is high-rework and risks encoding precision errors in scaffolded material — which `didactiek-principes.md §1.4` warns is the most damaging failure mode for student learning.

The reference team's correction is closer to safe than the original proposal. This report extends their correction with a content lens: which fields content quality requires, where engineering and content must check in with each other, and what dates are realistic.

---

## 2. What content strategy needs from RAG (the requirements lens)

The proposal frames the corpus goal as *"every exam item decomposable into named skills, every named skill has isolated practice, every exam item reachable via bridge exercises, taught modality vs. tested modality is recorded."* That goal is necessary but not sufficient for content production. From the content side, RAG must additionally answer:

| Query content needs to answer | Today | Needed |
|---|---|---|
| For every CvTE eindterm in syllabus 2026-v2, do we have ≥1 Tier A exam item AND ≥1 Tier C bridge exercise? | Cannot answer; coverage map is unowned | `eindterm_coverage` derived report |
| For paragraph X in the blueprint, is the dual-coding fade complete (full graph → graph base only → no graph reasoning → no graph drawing)? | Cannot answer; scaffolding is unfielded | `visual_stage` axis + paragraph index |
| Which exercises practise instruction word "Leg uit dat" with a 2-link redenering at Bloom *analyseren*? | Cannot answer; vraagtype and Bloom not on exercise | `vraagtype` + `bloom_level` + `reasoning_chain_length` |
| Which exercises violate the unified-procedure rule (text/graph/formula mismatch in `economic_mathematical_precision_reference.md`)? | Cannot answer; no precision-lint status | `precision_lint_status` field driven by external linter |
| Which exercises are anchored to a real CvTE bron (table, graph, news clip)? | Cannot answer; bronnen are not first-class | `source_artifact_id` + bronnen registry |
| For misconception M (e.g., shift-vs-movement), how many diagnostic, scaffolded, and faded exercises exist? | Cannot answer; misconceptions are free-text in `pitfalls[]` | minimal misconception registry stub (20 IDs) |
| What is the havo-vs-vwo coverage gap on D-domain elasticity items? | Partial; level exists on exam-questions but not propagated | `level` on authority + propagation rule |

These are not theoretical — they are the day-to-day questions a content reviewer asks before signing off a paragraph. The schema must make them queryable, not parseable from prose.

---

## 3. Content-side findings on the proposed schema

### 3.1 Vocabulary collision is the most urgent fix

The references-team correction is right and content strategy backs it without reservation. Recommended naming:

- `required_units[]` for the existing field (one-time rename of `required_skills`).
- `skill_ids[]` for the future fine-grained registry (SK- prefix).
- `categories: { primary, secondary[] }` keeps the 8-category vocabulary (`rekenen, grafisch, redeneren, begrippen, bron-info, standpunt, strategisch, toetsvaardigheden`) where content reviewers already think in it.
- `aspects[]` on units stays as the sensory/processing-channel layer (verbaal/grafisch/rekenen). It is *not* a competing vocabulary; it is finer than the 8 categories on a different axis.
- The proposed engineering enum `category: economics|math|language|graphical|tabular|reasoning` should be **dropped or renamed to `meta_category`**. The platform already has the 8-category vocabulary; introducing a seventh-and-different list silently breaks coverage QC.

Action: this rename is non-mutating if done as an overlay. Land it before any registry promotion sprint, not after.

### 3.2 Three axes are correct, scaffolding is wrong

`authority` and `role` are well-formed. `scaffolding: scaffolded | partial | faded` collapses two independent dimensions:

- **Verbal scaffolding** — Niveau 0–5 from `didactiek-principes.md §4.1` (hints, denkstappen, formule-herinnering, invulformaat, volledig uitgewerkt).
- **Visual scaffolding (dual-coding fade)** — four-stage scale from §4.4 (full-labeled-graph → graph-base-only → no-graph-reasoning → no-graph-drawing).

These are independent. An exercise can be at verbal Niveau 2 and visual Stage 1 at once. The platform's mandatory rule for begeleide-inoefening graph exercises (`feedback_inoefening_scaffolding`) requires `dual_coding_required: true` regardless of verbal level.

**Recommendation:** replace the categorical scaffolding axis with:

```
scaffolding: {
  verbal_level: 0..5,
  visual_stage: 1..4,
  fading_position: int,        // ordinal position in a fade sequence
  dual_coding_present: boolean // mandatory true for begeleide-inoefening graphs
}
```

Coherence tests for `role: exam_mirror` should run against `verbal_level: 5, visual_stage: 4` (no scaffolding), not against the looser `faded` enum.

### 3.3 Role taxonomy is incomplete for the Dutch context

The proposed roles (`exam_mirror, prerequisite, bridge, practice, diagnostic`) are clean for retrieval but do not match how content is actually authored. Missing or merged:

- `worked_example` — distinct from practice; students read, not solve.
- `startoefening` (begeleide inoefening) — three sub-tiers (basis/midden/verrijking).
- `interleaving` — explicit allocation rule (60/25/15 in `didactiek-principes.md §6.2`).
- `verdieping` / `denkertje` — Bloom analyseren/evalueren/creëren only; outside the time budget.
- `consolidatie` (multi-question opgave) — 4–6 linked questions sharing one context; multi-question structure not capturable as a single exercise record.
- `instapquiz`, `nieuws-met-visual` — distinct inspectie-standaard mappings.

**Recommendation:** split `role` into two orthogonal fields:

```
instructional_role: enum (
  worked_example, startoefening, independent_practice, interleaving,
  target, verdieping, consolidatie, instapquiz, diagnostic, nieuws
)
assessment_role: enum (
  exam_mirror, bridge, prerequisite
)
```

A consolidatie opgave with 4 sub-questions is one record at the opgave level (instructional_role = consolidatie, with `subquestions[]` as today in target-exercises) plus one record per sub-question if granular evaluation is needed. The current course-target-exercises shape already encodes this with `subquestions[]` — preserve it.

### 3.4 Modality field is too thin

`taught_modality / tested_modality / modality_mismatch: boolean` cannot represent CvTE's multi-modality opgaven. A real CvTE question commonly mixes table-reading + calculation + classification + uitleg in a single 2–3 point item. Replace with:

```
modality: {
  taught_modalities: [...],
  tested_modalities: [...],
  gap_summary: string
}
```

Add a separate first-class field that drives student-visible answer form:

```
instruction_word: enum (
  noem, bereken, leg-uit-dat, leg-uit-of, classificeer,
  beoordeel, toon-aan, teken, arceer, redenering
)
```

`skill-categories.md §2.8` calls instructiewoorden the single largest source of lost CvTE points. They are not noise.

### 3.5 Source-artifact registry must precede composition patterns

Real CvTE opgaven hang on *bronnen* — table, graph, news clip, dataset, payoff matrix. The proposed `composition-pattern.schema.json` lists `typical_inputs` but does not require a bronnen anchor. A composition-pattern registry without a bronnen registry will produce items that match the skill list but feel nothing like a real CvTE opgave.

**Recommendation:** mint a small bronnen registry (~30 stable IDs covering the most-reused source types: prijs-tabellen, vraag/aanbod-grafiek-met-shift, news-clip-EU-beleid, payoff-matrices, CBS-tijdreeksen). Required before composition-pattern registry can be useful.

### 3.6 Composition-pattern registry needs more fields

The proposed sketch (`skills`, `operation_sequence`, `exemplar_exam_items`, `frequency_in_exams`, `typical_inputs`) is missing:

- `source_artifact_required` (what kind of bron the pattern needs).
- `question_chain_length` (4–6 escalating questions is the modal CvTE pattern).
- `escalation_profile` (e.g., [read, calc, classify, explain]).
- `bloom_curve` across the chain (CvTE typically rises from understand → apply → evaluate within one opgave).

Also: `exemplar_exam_items` should be **required to contain ≥2 Tier A items** before the pattern can be referenced by a Tier C exercise. Otherwise fictional patterns drift in.

### 3.7 Authority needs a level discriminator

`exam-questions.json` already records `level: havo | vwo` on every record. Without `level` on Tier A, a havo item could anchor a vwo Tier C — wrong, since vwo adds Domein A4 strategisch inzicht, deeper redenering, and more algebra. Update authority to:

```
authority: {
  tier: A | B | C,
  level: havo | vwo,
  year, tijdvak, exam_paper, item_number, opgave_num, question_num
}
```

Coherence-test scope must respect `level`.

### 3.8 Precision linting is missing

The schema captures organisational structure but no field protects the four standards `economic_mathematical_precision_reference.md` defines: object identification, ceteris paribus, text-graph-formula matching, units. These are exactly the errors students learn permanently when scaffolded.

**Recommendation:** add `precision_lint_status: enum (passed | not_run | failed)` driven by an external linter (the SVG-geometry verifier already exists at `build-scripts/verify_svg_geometry.py`). For exercises with graphs, also add:

```
graph_specs: [
  { type, axes, slope_directions, shifts[], shaded_areas[] }
]
```

The lint result is what tells a content reviewer whether the visual asset and text/formula agree. No human can sustain this check at scale.

### 3.9 D04 must be resolved before C→B promotion can run on its dependents

D04 (`Elasticiteit en goederenclassificatie`) currently has `needs: []`, no `procedure`, mastery `understand` for content the syllabus tests at `apply` (D1.7, D1.8). Until D04 is split into separate units (calculate Ev, classify Ev, kruislingse interpretation, inkomenselasticiteit classification, possibly more), promoting any C exercise that depends on D04 will encode an incoherent mastery target.

**Recommendation:** add `unit_design_status: stable | unstable | deprecated` to units and have the promotion gate refuse C→B promotion when any required unit is unstable. This is a one-line policy that prevents a known content trap from being baked in.

### 3.10 Misconceptions registry: stub now, formalise at R10.1

165/227 terms still lack pitfall text. ~87 of 209 units carry a `pitfalls:` block. The shift-vs-movement misconception alone repeats across at least six locations (D32, D33, demand-factor units, supply-shift units, skill-categories.md §2.2 and §2.3). A diagnostic exercise's distractors should each cite a misconception ID; today they cannot.

**Recommendation:** mint a small registry now (~20 high-priority IDs: shift-vs-movement, prijs-vs-kosten, reëel-vs-nominaal, MO-line-through-origin, winst-equals-omzet, comparatief-vs-absoluut-voordeel, factor-classification-fallback-to-preferences, indexpunt-vs-procentuele-verandering, etc.). Don't backfill 130 bullets yet — let exercise-tagging drive registry growth (the same exercise-first principle that drove unit minting). Defer the diagnostic-routing logic to R10.1.

### 3.11 Concept three-year extension: stage carefully

Year 1 is `partial_year_1_of_3` per the blueprint meta. 49 target exercises cover ~61% of the 80 expected paragraphs. Books 3 and 4 are largely empty in target-exercises.json. Extending Tier C to Years 2–3 before Year 1 is closed risks:

- Cascading sequencing errors — if Year 1's MK/MO chain is wrong, every Year 2 monopolie exercise inherits the error.
- Phantom prerequisites — Year 2 exercises citing units that Year 1 will refactor.
- Double-rework cost.

**Recommendation:** stage the extension in three explicit gates, not two passes:

- Pass 1a: Close Year 1 gaps (Books 1–4 of the current blueprint). Authoring discipline: target exercises with `precision_lint_status: not_run` placeholder so the linter can fill in later.
- Pass 1b: Year-1 review cycle — D04 split, sequencing audit on the cost-structure and welfare chains, dual-coding-fade audit on the begeleide-inoefening graph exercises.
- Pass 2 (Year-2 skeleton): Tag every Year-2 concept exercise with `cvte_anchor_required: true` and `concept_orphan: boolean`. An exercise without a real CvTE-vwo anchor (`exam-questions.json` has 174 vwo records — easily enough to anchor every Year-2 lesson at least loosely) is `concept_orphan: true` and excluded from any retrieval coherence test. Year-3 follows the same gate.

This makes the virtuous loop the engineering proposal envisions actually work, instead of trapping content reviewers behind moving foundations.

---

## 4. Cross-team checkpoints

This is what content strategy needs to ensure technical work and content production stay aligned. Each checkpoint is a structured handover, not a free-form conversation. Engineering proposes the artifact; content reviews and signs off; the gate is recorded.

### CP-1 — Schema audit review (pre-R9.1)
**When:** Before R9.1 starts, after the references-team schema audit packet exists.
**Engineering produces:** the audit table (per the handoff's "first task: schema audit") + a vocabulary-rename overlay proposal.
**Content reviews:** does the audit cover every field a content reviewer needs (Bloom, vraagtype, instruction-word, dual-coding stage)? Does the rename plan touch every place `required_skills` appears in content artifacts (target exercises, exam questions, paragraph YAML, quality_ref)?
**Gate output:** `GATE-CP1-schema-audit` with `pass | pass_with_conditions | hold`.
**Latest acceptable date:** 2026-05-08.

### CP-2 — R9.1 owned-source registry scope review
**When:** During R9.1 sprint plan drafting.
**Engineering produces:** the planned source surfaces with status labels (authored source, generated projection, exercise evidence, answer model, planning artifact, implementation output).
**Content reviews:** are all 16+ companion artifacts that exist for paragraph 1.1.1 covered (paragraaf, opgaven, antwoorden, samenvatting, instapquiz, uitleg vaardigheden, uitleg voorkennis, nieuws met visual, begeleide inoefening basis/midden/verrijking, redeneer-spel, nieuws-detective, stappenplan, wiskundevaardigheden, youtube-videos, presentatie)? Each has a different authority weight — a samenvatting cannot be authority for a definition; an opgave cannot be authority for a procedure.
**Gate output:** `GATE-CP2-owned-source-scope`.
**Latest acceptable date:** 2026-05-15.

### CP-3 — Schema extension dry-run on real exercise
**When:** Before any schema-extension sprint runs at scale (between proposed sprints 4 and 5 in the references-team sequence).
**Engineering produces:** a manual extension of one Tier A exam item and one Tier C target exercise to the new schema, end to end. Include: instruction_word, vraagtype, bloom_level, reasoning_chain_length, source_artifact_id, graph_specs, precision_lint_status, instructional_role, assessment_role, scaffolding object.
**Content reviews:** is the extension lossless? Does it round-trip? Can a content reviewer read the extended record and reconstruct the original opgave on paper without ambiguity?
**Gate output:** `GATE-CP3-schema-dry-run`.
**Latest acceptable date:** 2026-06-05.

### CP-4 — Skill registry vs aspects/categories coexistence
**When:** Before the skill registry promotion sprint runs.
**Engineering produces:** the proposed three-layer hierarchy (categories on exercise, aspects on unit, skill_ids fine-grained) with the rename of `category` to platform vocabulary.
**Content reviews:** does the skill registry preserve everything `skill-categories.md` already says (CvTE Domein A mapping, vraagtype mapping, Bloom levels, F/B/S/E linkage, distribution rules)? Promotion that loses these silently breaks QC.
**Gate output:** `GATE-CP4-skill-registry-coexistence`.
**Latest acceptable date:** 2026-06-19.

### CP-5 — D04 split and dependent-unit audit
**When:** Before any C→B promotion workflow is exercised.
**Engineering produces:** a unit-design proposal for D04 (likely 3–5 successor units) + a dependent-unit audit.
**Content reviews:** the proposed split is reviewed against the actual elasticity exam items in `exam-questions.json` (D-domain, both havo and vwo). The split must produce units whose `procedure[]`, `pitfalls[]`, and `aspects[]` cover what those exam items demand. This must be reviewed by a teacher subagent in addition to the engineering review.
**Gate output:** `GATE-CP5-D04-resolution`.
**Latest acceptable date:** 2026-07-03.

### CP-6 — Year-1 paragraph-coverage close-out
**When:** Before Year-2/3 concept blueprint extension begins.
**Engineering produces:** `reports/blueprint-coverage.md` showing: (a) paragraphs with target exercise, (b) paragraphs without, (c) paragraphs with target exercise but `precision_lint_status != passed`, (d) paragraphs whose anchor units have `unit_design_status: unstable`.
**Content reviews:** is the gap small enough to mark Year 1 closed? Decision is content-led: if more than 5 paragraphs remain in (b), Year 1 stays open. If more than 10 remain in (c), Year-2 extension is delayed.
**Gate output:** `GATE-CP6-year-1-closeout`.
**Latest acceptable date:** 2026-07-24.

### CP-7 — Concept-blueprint-pass-2 review of Year-2 anchoring
**When:** After Year-2 skeleton is drafted and before Tier C exercises are written.
**Engineering produces:** the Year-2 skeleton with each paragraph mapped to a CvTE-vwo anchor exam item (or marked `concept_orphan: true`).
**Content reviews:** `concept_orphan` rate is below 20%; sequencing chains are coherent against the Year-1 catalog as it now stands; D-domain and L-domain coverage is checked against syllabus 2026-v2.
**Gate output:** `GATE-CP7-year-2-anchoring`.
**Latest acceptable date:** 2026-09-04.

### CP-8 — RAG retrieval eval set covers content queries
**When:** Inside R7.6 RAG quality hardening, before sprint completion.
**Engineering produces:** the expanded eval set (handoff target: 50–100 cases).
**Content reviews:** the set must cover at least 10 content queries from §2 above, including at least 2 negative-case queries (e.g., "find an exercise whose answer model violates the unified-procedure rule" should retrieve specific known issues, not be empty).
**Gate output:** `GATE-CP8-eval-content-coverage`.
**Latest acceptable date:** 2026-09-25.

---

## 5. Where the references-team correction is right and where I extend it

The references-team correction is correct on every stale-metric flag and on the protected-surface mutation issue. Their proposed sequence (Schema Audit → R9.1 → R9.2 → Schema Extension → Skill Registry → R7.6 → R14.1 → Decomposition → Concept-blueprint passes → C→B promotion) is the safe order. Content strategy extends rather than overrides it:

| Reference-team sequence step | HCS extension |
|---|---|
| Schema Audit + Exercise Object Grounding | Add CP-1 review point before R9.1 starts. Add Bloom/vraagtype/instruction-word/dual-coding-stage as fields the audit must include even if missing from current schema. |
| R9.1 Owned Source Registry | Scope must cover all 16+ companion artifact types, not just the textbook trio. Each artifact type has a different authority/exposition status. CP-2. |
| R9.2 Content Graph Projection | Projection edges must include companion artifacts, not just paragraph markdown. |
| Exercise Schema Extension | Replace `scaffolding: enum` with the four-field object (verbal_level, visual_stage, fading_position, dual_coding_present). Split `role` into instructional_role + assessment_role. Add level on authority. CP-3. |
| Skill/Operation Registry MVP | Add CP-4 to verify coexistence with `aspects[]` on units and `categories` on exercises. Drop the engineering `category: economics|...` enum; use the platform's 8-cat vocabulary. |
| R7.6 RAG Quality Hardening | CP-8 covers content-query eval coverage. Eval expansion must include at least 2 negative-case queries. |
| R14.1 Curriculum Versioning | No content extension; references team has it right. |
| Exam Item Decomposition Backfill | Inject CP-5 (D04 resolution) before this can run on D-domain items. |
| Concept Blueprint Extension Pass 1 | Close Year-1 first (CP-6) before any Year-2/3 skeleton work. |
| Concept Blueprint Extension Pass 2 | Each Year-2 exercise carries `cvte_anchor_required: true` + `concept_orphan: boolean`. CP-7 reviews anchoring rate. |
| C → B Promotion Workflow | Promotion gate refuses if any required unit has `unit_design_status: unstable`. CP-5 is precondition. |

---

## 6. What we do not need now

Content strategy explicitly endorses the references-team and engineering position on what stays deferred:

- Diagnostics, adaptive routing, mastery decisions, summative use (R10).
- Game/simulation product-mapping (R11).
- Teacher-cockpit deployment (R12).
- Student-facing AI tutor (R13).
- Continuous-improvement and learning-impact claims (R14.2/R14.3).
- Production QC gates beyond the lightweight issue model (R8.2).

These belong after the foundation is closed. Content production today has more leverage from a high-quality RAG and a stable schema than from any of these surfaces.

---

## 7. Summary of the position

Accept the engineering direction. Apply the references-team corrections in full. Extend the schema with the eleven content-side additions in §3. Run the eight cross-team checkpoints in §4 on the dates shown. Close Year 1 before Year-2/3 concept extension begins. Resolve D04 before any C→B promotion can run on its dependents. Replace the categorical scaffolding enum with the four-field object that captures verbal and visual fade independently. Drop the engineering `category` enum and use the platform's 8-category vocabulary.

The RAG quality target should be: a content reviewer can answer every query in §2 from retrieval alone, without rereading paragraph markdown. We are roughly four months from that target if the sequence in the accompanying `roadmap-HCS.md` holds.

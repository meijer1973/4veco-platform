# HCS Updated Roadmap — RAG Quality and Exercise Schema

**From:** Head of Content Strategy
**Date:** 2026-04-28
**Status:** Strategic roadmap proposal. Not the live engineering roadmap. The live roadmap remains at `references/reference-team-roadmap.md` and is owned by the references team.

---

## 1. Reading order

This roadmap is meant to be read alongside three existing documents:

- `references/reference-team-roadmap.md` — the live operational roadmap.
- `knowledge/Exercise schema and quality/handoff-exercise-schema-and-rag-quality Proposal head engineer.md` — engineering proposal.
- `knowledge/Exercise schema and quality/handoff-exercise-schema-and-rag-quality-context-review References team.md` — references-team correction.
- `knowledge/Exercise schema and quality/feedback-to-engineering-HCS.md` — the HCS feedback report (reasoning and detail behind every change here).

This document adds: cross-team checkpoints, target dates, content-side acceptance criteria, and a parallel content track running alongside engineering.

---

## 2. Two parallel tracks

The work has two tracks running in parallel. They synchronise at the eight cross-team checkpoints (CP-1 through CP-8).

| Track | Owner | Output |
|---|---|---|
| Engineering / RAG | References Team + Engineering | Schemas, registries, retrieval, validators, CLI, reports |
| Content production | Lessen Team + Content Strategy | Target exercises (Tier C), companion artefacts, paragraph markdown, didactic review |

The deliberate decision: do not let the content track wait until the engineering track is finished. Content production at Year-1 paragraph level continues during R9.1/R9.2/R7.6, because Year 1 is only ~61% covered today and content gaps are the limiting factor on retrieval coverage just as much as schema gaps are.

---

## 3. Phase view

| Phase | Calendar | Engineering | Content production | Checkpoint |
|---|---|---|---|---|
| **A — Audit and align** | 2026-04-28 → 2026-05-15 | Schema audit + exercise-object grounding (R8.5 new); R9.1 Owned Source Registry kickoff | Inventory of companion artefact types per paragraph; vocabulary rename plan in content artefacts | CP-1 (2026-05-08) |
| **B — Owned source + schema extension** | 2026-05-15 → 2026-06-19 | R9.1, R9.2, exercise-schema extension (overlay) | Authoring of missing Year-1 target exercises (Books 1–4 of current blueprint) | CP-2 (2026-05-15), CP-3 (2026-06-05) |
| **C — Skill registry + RAG quality** | 2026-06-19 → 2026-08-07 | Skill/operation/composition registries; R7.6 RAG quality hardening; bronnen registry stub; misconception registry stub | Companion-artefact rebuild for paragraph 1.1.1 to extended schema; instruction-word + vraagtype + Bloom backfill on existing 49 target exercises | CP-4 (2026-06-19), CP-5 (2026-07-03), CP-6 (2026-07-24) |
| **D — Curriculum versioning + decomposition** | 2026-08-07 → 2026-09-25 | R14.1 minimal versioning; exam-item decomposition backfill; promotion-eligibility tests | Companion artefacts for paragraphs 1.1.2 → 1.2.x | CP-7 (2026-09-04), CP-8 (2026-09-25) |
| **E — Year-2 skeleton + C→B promotion** | 2026-09-25 → 2026-11-30 | C→B promotion workflow; Year-2 concept-blueprint skeleton retrieval support | Year-2 paragraph headings + concept target exercises (Tier C with `cvte_anchor_required`); Year-1 D-domain audit closed | First C→B promotion review gate |
| **F — Re-evaluate R10–R13** | 2026-12-01 onwards | Decision on diagnostics/adaptive/AI tutor based on data | Year-2 Tier C complete for Books 1–2 | Annual content review |

Year 2026/2027 cohort starts September 2026 on **Module 3 frozen content** (per `project_building_for_next_year`). The roadmap above is the *foundation* for cohort 2027/2028, not for the upcoming school year. Module 3's content remains untouched by these changes.

---

## 4. Sprint sequence with HCS edits

Numbering follows the references-team's proposed sequence. HCS edits are marked `[HCS]`.

### Phase A

#### Sprint 1 — Schema Audit + Exercise Object Grounding *(new, references-team proposed)*
- **Engineering produces:** field-level audit table for `exam-question.schema.json`, `target-exercise.schema.json`, `unit.schema.json`, `term.schema.json`, `evidence-anchor.schema.json`, `alignment-edge.schema.json`, `chunk.schema.json`. Sample 5 records per file. Document actual vs declared shape. Vocabulary-rename overlay proposal: `required_skills` → `required_units`.
- `[HCS]` audit must additionally check: presence/absence of fields for Bloom level, vraagtype, instruction-word, scaffolding sub-axes (verbal_level, visual_stage, fading_position, dual_coding_present), graph_specs, source_artifact_id, precision_lint_status, level (havo|vwo) on authority, exam_codes directly on exercises.
- `[HCS]` audit reviews scope of artefacts in 4veco-lessen — every companion artefact type that exists for paragraph 1.1.1 is listed with its expected authority weight.
- `[HCS]` no schema mutation runs in this sprint. Output is a packet only.
- **Acceptance:** `GATE-CP1-schema-audit` passes, latest 2026-05-08.

#### Sprint 2 — R9.1 Owned Source Registry *(existing, scope-extended)*
- Engineering: register owned book/source surfaces, blueprint metadata validation, source-manifest integration.
- `[HCS]` scope explicitly includes the 16+ companion artefact types (not only paragraph markdown). Each type carries its authority status: which can be evidence (paragraaf, opgaven, exam-derived target exercises), which is exposition (samenvatting, uitleg vaardigheden, uitleg voorkennis), which is a generated projection (HTML/PDF artefacts).
- `[HCS]` repair `course-target-exercises.json.blueprint_source` to point at `references/owned/course-blueprint-v4.md`.
- `[HCS]` annotate the lessen-team's pilot status: only paragraph 1.1.1 has the full companion set today; other paragraphs have the textbook trio only. Coverage report must reflect this.
- **Acceptance:** `GATE-CP2-owned-source-scope` passes, latest 2026-05-15.

### Phase B

#### Sprint 3 — R9.2 Content Graph Projection *(existing)*
- Engineering: project owned content with projection edges, owned-content coverage report, regenerated chunk index.
- `[HCS]` projection edges must be created for every companion artefact type, with edge type encoding the artefact's role (e.g., `samenvatting → exposition_for_paragraph`, `opgaven → practice_for_paragraph`).
- **Acceptance:** chunk index now retrieves owned material; weak-match warnings surface for unanchored chunks.

#### Sprint 4 — Exercise Authority/Role/Scaffolding Schema Extension *(new, overlay-based)*
- Engineering: extend exercise schemas via overlay under `references/data/exercises/` (per references-team protected-surface caution). Backfill `authority: A` on existing exam-questions records via overlay.
- `[HCS]` use the eleven schema additions from `feedback-to-engineering-HCS.md §3`:
  - `required_units[]` (renamed from `required_skills[]`)
  - `skill_ids[]` (reserved, populated only after Sprint 6)
  - `categories: { primary, secondary[] }` using the platform's 8-category vocabulary
  - `instruction_word: enum(...)`
  - `vraagtype: enum(1..7)`
  - `bloom_level: enum(...)`
  - `reasoning_chain_length: int`
  - `source_artifact_id: string`
  - `graph_specs: [...]`
  - `precision_lint_status: enum(passed|not_run|failed)`
  - `instructional_role` + `assessment_role` (split from `role`)
  - `scaffolding: { verbal_level, visual_stage, fading_position, dual_coding_present }` (replacing the categorical enum)
  - `authority: { tier, level: havo|vwo, year, tijdvak, exam_paper, item_number, opgave_num, question_num }`
  - `unit_design_status` propagated from units (read-only, computed)
- `[HCS]` dry-run on one Tier A item and one Tier C target exercise before bulk extension; CP-3 reviews lossless round-trip.
- **Acceptance:** `GATE-CP3-schema-dry-run` passes, latest 2026-06-05.

### Phase C

#### Sprint 5 — Bronnen Registry Stub *(new, HCS addition)*
- `[HCS]` mint ~30 stable IDs for the most-reused source artefact types (prijs-tabellen, vraag/aanbod-grafiek-met-shift, news-clip-EU-beleid, payoff-matrices, CBS-tijdreeksen, indexcijfer-tabellen, kostenstructuur-tabellen, payoff-matrices, surplus-grafieken).
- Engineering: schema, validator, CLI mutation script. Stored under `references/machine/bronnen.json`.
- Required before Sprint 8 (composition-pattern registry) can be useful.
- **Acceptance:** schema validates; first 30 IDs minted; review-gate before any composition pattern references a bron ID.

#### Sprint 6 — Skill/Operation Registry MVP *(new, vocabulary-decided)*
- Engineering: promote `skill-categories.md` to JSON registry. Registry uses the platform's 8-category vocabulary (rekenen, grafisch, redeneren, begrippen, bron-info, standpunt, strategisch, toetsvaardigheden, optionally onderzoek). Drop the proposed `category: economics|math|...` enum.
- `[HCS]` registry preserves all fields `skill-categories.md` already carries:
  - `cvte_subdomain: enum(A1..A5)`
  - `bloom_levels[]`
  - `vraagtype_frequencies{}`
  - `fbse_links[]` (F/B/S/E content-skill IDs)
  - `min_coverage` rules (theory ≥3 categories, consolidation ≥5, testprep ≥8)
  - `common_misconception_refs[]`
  - `signal_words[]`
- `[HCS]` operations registry (smaller — ~15-25 cross-unit operations) is added only after exam-item decomposition (Sprint 11) reveals the recurring atoms. **Defer operations registry MVP to Sprint 11.**
- **Acceptance:** `GATE-CP4-skill-registry-coexistence` passes, latest 2026-06-19.

#### Sprint 7 — Misconception Registry Stub *(new, HCS addition)*
- `[HCS]` mint ~20 high-priority misconception IDs (shift-vs-movement, prijs-vs-kosten, reëel-vs-nominaal, MO-line-through-origin, winst-equals-omzet, comparatief-vs-absoluut-voordeel, factor-classification-fallback-to-preferences, indexpunt-vs-procentuele-verandering, surplus-triangle-wrong-vertex, profit-equals-revenue, marginal-equals-average, ceteris-paribus-violation, ...).
- Schema, validator, CLI. Stored under `references/machine/misconceptions.json`.
- Don't backfill 130+ pitfalls bullets yet; let exercise-tagging drive registry growth.
- **Acceptance:** registry validates; first 20 IDs minted with `description`, `domain`, `typical_distractor_text[]`, `affected_units[]`, `affected_skills[]`.

#### Sprint 8 — D04 Resolution and Dependent-Unit Audit *(new, HCS addition)*
- `[HCS]` engineering produces the D04 split proposal (likely 3–5 successor units): "Calculate Ev", "Classify good by Ev", "Inkomenselasticiteit", "Kruislingse elasticiteit", "Goederenclassificatie via Ei + kruislingse".
- `[HCS]` content review by VWO economics teacher subagent (per `feedback_teacher_subagent_validation`) before approval.
- `[HCS]` review against actual elasticity exam items in `exam-questions.json` (D-domain, both havo and vwo) to confirm split covers tested patterns.
- `[HCS]` add `unit_design_status: stable | unstable | deprecated` field to unit schema. C→B promotion gate refuses when any required unit is `unstable`.
- **Acceptance:** `GATE-CP5-D04-resolution` passes, latest 2026-07-03.

#### Sprint 9 — R7.6 RAG Quality Hardening *(existing, scope-extended)*
- Engineering: RAG-01 through RAG-04 from existing R7.6 plan. Eval set 10 → 50–100. Anchors 15 → 50+. First batch of human-approved graph edges.
- `[HCS]` eval set covers at least 10 content queries from `feedback-to-engineering-HCS.md §2`, including ≥2 negative cases (e.g., "find an exercise whose answer model violates the unified-procedure rule" must retrieve known-bad items, not be empty).
- `[HCS]` retrieval results carry the full authority + role + scaffolding triple in their summary, not just `source_rank`.
- **Acceptance:** `GATE-CP8-eval-content-coverage` passes, latest 2026-09-25.

#### Sprint 10 — Year-1 Paragraph-Coverage Closeout *(new, HCS-coordinated)*
- `[HCS]` engineering produces `reports/blueprint-coverage.md`:
  - Paragraphs with target exercise (49 today)
  - Paragraphs without (~31 today)
  - Paragraphs with target exercise but `precision_lint_status != passed`
  - Paragraphs whose anchor units have `unit_design_status: unstable`
- `[HCS]` content production track (Lessen Team + Content Strategy) authors the missing target exercises during this same window. Target: 80/80 paragraphs by 2026-07-24.
- **Acceptance:** `GATE-CP6-year-1-closeout` passes, latest 2026-07-24. Year 1 stays open if more than 5 paragraphs lack target exercise or more than 10 fail precision lint.

### Phase D

#### Sprint 11 — Exam Item Decomposition Backfill *(existing, decomposition-aware)*
- Engineering: for every Tier A exam item, attach `cognitive_skills[]` (8-cat), `skill_ids[]` (registry), `operations[]`, `composition_pattern_id`, `instruction_word`, `bloom_level`, `reasoning_chain_length`. **Now Sprint 6 has provided the registry**, this sprint can run.
- `[HCS]` decomposition runs through a teacher subagent for each opgave in batches of 10. Subagent reports flagged uncertain cases for human content review.
- `[HCS]` operations registry is bootstrapped in this sprint from the recurring atoms surfaced by decomposition.

#### Sprint 12 — Composition Pattern Registry *(new, HCS addition)*
- Engineering: build registry. Each pattern requires ≥2 Tier A exemplars before being referenceable by Tier C.
- `[HCS]` mandatory fields per `feedback-to-engineering-HCS.md §3.6`: `source_artifact_required`, `question_chain_length`, `escalation_profile`, `bloom_curve`.

#### Sprint 13 — R14.1 Minimal Curriculum Versioning *(existing)*
- Engineering: tag external/machine/authored/owned-source surfaces with version provenance. Stale-reference report.
- Required before C→B promotion can compare exercises across syllabus versions.

### Phase E

#### Sprint 14 — Concept Blueprint Pass-1A: Year-1 Closure *(reframed)*
- `[HCS]` close the remaining Year-1 paragraphs. Author target exercises with `precision_lint_status: not_run` placeholder. **This is content track work, not engineering.** Engineering supports by ensuring the schema extension lands ahead of the work (Sprint 4) and the 8 categories are populatable (Sprint 6).
- Acceptance: 80/80 paragraphs covered by Tier C target exercises with `precision_lint_status: passed | not_run` (no `failed`).

#### Sprint 15 — Year-1 Sequencing and Dual-Coding Audit *(new, HCS addition)*
- `[HCS]` review the cost-structure chain (TO → TK → GVK → GTK → break-even → MK → MO=MK), the welfare chain (CS → PS → TS → DWL → toepassingen), and the dual-coding-fade pattern across all begeleide-inoefening graph exercises.
- Output: a list of sequencing or scaffolding errors to fix before promotion can run.

#### Sprint 16 — Concept Blueprint Pass-2: Year-2 Skeleton *(staged differently)*
- `[HCS]` only after Year 1 is closed (CP-6 passed).
- `[HCS]` every Year-2 paragraph is mapped to a CvTE-vwo anchor exam item from `exam-questions.json` (174 vwo records available — sufficient anchoring for every paragraph at least loosely). Paragraphs without anchor are tagged `concept_orphan: true` and excluded from retrieval coherence tests.
- `[HCS]` `concept_orphan` rate must be below 20%.
- **Acceptance:** `GATE-CP7-year-2-anchoring` passes, latest 2026-09-04.

#### Sprint 17 — C → B Promotion Workflow *(existing)*
- Engineering: CLI for promotion, review gate, automated coherence tests per `(role, scaffolding)`, promotion record schema.
- `[HCS]` promotion gate refuses when:
  - Any required unit has `unit_design_status: unstable`.
  - The exercise's `precision_lint_status` is `not_run` or `failed`.
  - Coherence test scope mismatch on `level` (havo C cannot promote against vwo A or vice versa).
  - The exercise lacks `cvte_anchor_required` for Year-2/3 origin and is `concept_orphan: true`.
- First promotion review gate runs on a small batch (≤10 exercises) for content track sign-off.

### Phase F

#### Sprint 18 onward — Re-evaluate R10–R13 with fresh eyes
- `[HCS]` not before 2026-12-01. Triggered by RAG-quality evidence, not by deadline pressure.

---

## 5. Cross-team checkpoint calendar

| Checkpoint | Latest acceptable date | Track gate |
|---|---|---|
| CP-1 Schema audit review | 2026-05-08 | Pre-R9.1 |
| CP-2 R9.1 owned-source scope review | 2026-05-15 | During R9.1 |
| CP-3 Schema extension dry-run | 2026-06-05 | Pre-bulk extension |
| CP-4 Skill registry coexistence review | 2026-06-19 | Pre-skill-registry promotion |
| CP-5 D04 resolution | 2026-07-03 | Pre-promotion-on-D-domain |
| CP-6 Year-1 paragraph-coverage closeout | 2026-07-24 | Pre-Year-2 extension |
| CP-7 Year-2 anchoring review | 2026-09-04 | Pre-Year-2-Tier-C authoring |
| CP-8 RAG eval content coverage | 2026-09-25 | During R7.6 |

Each checkpoint has a structured handover. The format is the same as existing review gates: subagent review → human review → decision recorded as `pass | pass_with_conditions | hold` in `reports/review-gates/<gate-id>/`.

---

## 6. What stays unchanged from the references-team sequence

- Schema audit happens before any schema mutation. Non-mutating audit packets gate every later sprint.
- All mutations to `references/machine/` and `references/external/` go through CLI scripts.
- Generated reports are diagnostic, not primary evidence.
- Evidence hierarchy: real CvTE exam questions > target exercises > machine registries > syllabus (grouping only) > authored judgement > generated reports.
- Owned exposition does not become external authority.
- Subagents propose, humans decide on pedagogy, validators enforce mechanical completeness.
- R10–R13 stays deferred until RAG quality is real.

---

## 7. Content track parallel work — the standalone view

Even with no schema changes whatsoever, the content track has the following queue, ordered by impact on RAG coverage:

| Order | Work packet | Rationale | Target |
|---|---|---|---|
| 1 | Author missing Year-1 target exercises (Books 1–4 of current blueprint), ~31 paragraphs | Most-leverage gap; closes Year 1 to 100% | 2026-07-24 |
| 2 | Companion-artefact build for paragraphs 1.1.2 → 1.2.x using extended schema | Lessen-team pilot expands; tests schema extension on real artefacts | 2026-08-31 |
| 3 | Backfill instruction-word, vraagtype, bloom_level on existing 49 target exercises | One-time pass via teacher subagent; ~15 min/exercise | 2026-08-31 |
| 4 | Year-1 D-domain audit (D04 + dependents) | Blocks promotion on biggest catalog area | 2026-08-15 |
| 5 | Sequencing audit on cost-structure chain (B-domain → S-domain) and welfare chain | Catches errors before they get into RAG | 2026-09-15 |
| 6 | Year-2 paragraph skeleton — paragraph titles + lesson goals + cvte_anchor for every paragraph | Year-2 frame ready when CP-7 reviews anchoring | 2026-08-31 |
| 7 | Year-2 Tier C target exercises Books 1–2 | After CP-7 passes | 2026-11-30 |

This work happens regardless of how engineering sprint sequencing actually runs. If engineering slips a sprint, the content track does not stall.

---

## 8. Final position

Engineering's RAG quality direction is correct. The references team has corrected the proposal to match repository state and they are right. Content strategy adds the cross-team checkpoint discipline, eleven schema extensions that protect content quality, the D04 resolution gate, the year-by-year staging of concept-blueprint extension, and a parallel content production track that runs regardless of engineering pacing.

The roadmap target is end of 2026: Year 1 content closed, schema extended, RAG retrieval answers content reviewer queries, first C→B promotion batch through the gate. Year-2 Tier C content authored ahead of cohort 2027/2028 deployment readiness.

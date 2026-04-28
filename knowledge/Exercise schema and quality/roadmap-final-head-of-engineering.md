# Reference and RAG Roadmap — Final Unified Version

**Owner:** Head of Engineering, with content track owned by Head of Content Strategy
**Date:** 2026-04-28
**Status:** Adopted as the operating roadmap. Replaces the standalone `references/reference-team-roadmap.md` immediate-next-sprint pointer. The references-team sprint ledger remains the execution-level record of truth; this document sits above it and adds the cross-team and content-track structure.
**Replaces / supersedes:**
- The `Immediate Next Sprint` section of `references/reference-team-roadmap.md` (was R9.1; now Schema Audit precedes R9.1).
- `roadmap-HCS.md` (incorporated with edits).
- `handoff-exercise-schema-and-rag-quality.md` engineering proposal (incorporated with the references-team and HCS corrections applied).

---

## 1. Position in one paragraph

The references team has built a strong foundation: schema discipline, evidence-anchor layer, alignment graph with a `pass_with_conditions` review gate, deterministic chunk index, hybrid retrieval, retrieval evaluation, RAG review gate, and post-merge stability on `main`. The remaining roadmap (R8 onward as originally drafted) drifts into product surfaces — diagnostics, AI tutor, teacher cockpit — before the RAG foundation is strong enough to serve them. The references-team and content-strategy reviews have corrected the engineering proposal in two important ways: a vocabulary collision (`required_skills` already means unit IDs, not the new fine-grained skills), and protected-surface discipline (`references/external/` is mirrored authority and must not be hand-edited). Content strategy adds eleven schema additions that protect didactic quality, two cross-cutting registries (bronnen, misconceptions), a D04 resolution gate before C→B promotion can run, year-by-year staging of the concept blueprint extension, and a parallel content production track. This roadmap unifies all three positions, restores the R8.1 QC Issue Model and the R7.6 RAG-01..04 sub-tasks that HCS dropped silently, treats dates as capacity-bound targets rather than contracts, and locks the discipline rules the references team operates under.

---

## 2. Two parallel tracks

| Track | Owner | Output |
|---|---|---|
| Engineering / RAG | References Team + Engineering | Schemas, registries, retrieval, validators, CLI, reports |
| Content production | Lessen Team + Content Strategy | Target exercises (Tier C), companion artefacts, paragraph markdown, didactic review |

The two tracks synchronise at the eight cross-team checkpoints (§6). The content track does not stall when the engineering track slips. Content production at Year-1 paragraph level continues during R9.1/R9.2/R7.6 because Year 1 is only ~61% covered today (49 target exercises against 80 paragraphs) and content gaps are as much a limiting factor on retrieval coverage as schema gaps are.

The 2026/2027 cohort starts September 2026 on Module 3 frozen content (per `project_building_for_next_year`). This roadmap is the foundation for cohort 2027/2028, not for the upcoming school year. Module 3 content remains untouched.

---

## 3. Phase view with target dates

Dates are capacity-bound targets, not contracts. The schema audit and the references team's existing sprint discipline (plan → baseline → execute → verify → review gate → deterministic bundle check → commit → tag) governs whether a sprint is ready to ship. If a sprint slips, downstream sprints slip with it; we do not promote unfinished work to hit a calendar target.

| Phase | Target window | Engineering | Content production | Checkpoint |
|---|---|---|---|---|
| **A — Audit and align** | 2026-04-28 → 2026-05-15 | Schema audit + exercise-object grounding (new pre-R9.1); R9.1 Owned Source Registry kickoff | Inventory of companion artefact types per paragraph; vocabulary rename plan in content artefacts | CP-1 (target 2026-05-08) |
| **B — Owned source + schema extension** | 2026-05-15 → 2026-06-19 | R9.1, R9.2, exercise-schema extension (overlay-based) | Authoring of missing Year-1 target exercises (Books 1–4 of current blueprint) | CP-2 (target 2026-05-15), CP-3 (target 2026-06-05) |
| **C — Skill registry + RAG quality** | 2026-06-19 → 2026-09-25 | Skill registry; bronnen registry stub; misconception registry stub; D04 resolution; **R8.1 QC Issue Model**; R7.6 RAG quality hardening with RAG-01..04 sub-tasks | Companion-artefact rebuild for paragraph 1.1.1 to extended schema; instruction-word + vraagtype + Bloom backfill on existing 49 target exercises; Year-1 paragraph-coverage closeout | CP-4 (target 2026-06-19), CP-5 (target 2026-07-03), CP-6 (target 2026-07-24), CP-8 (target 2026-09-25) |
| **D — Curriculum versioning + decomposition** | 2026-09-25 → 2026-11-15 | R14.1 minimal versioning; exam-item decomposition backfill; operations registry bootstrapped from decomposition; composition-pattern registry; promotion-eligibility tests | Companion artefacts for paragraphs 1.1.2 → 1.2.x | (rolling) |
| **E — Year-2 skeleton + C→B promotion** | 2026-11-15 → 2027-01-31 | C→B promotion workflow; Year-2 concept-blueprint skeleton retrieval support | Year-2 paragraph headings + concept target exercises (Tier C with `cvte_anchor_required`); Year-1 D-domain audit closed | CP-7 (target 2026-09-04), then first C→B promotion gate |
| **F — Re-evaluate R10–R13** | 2027-02-01 onwards | Decision on diagnostics / adaptive routing / AI tutor based on RAG-quality evidence | Year-2 Tier C complete for Books 1–2 | Annual content review |

Phase windows are wider than the HCS proposal because 18 sprints + 8 checkpoints + a parallel content track in the 2026-04 → 2026-09 window assumes near-perfect execution by a single team. Realistic capacity puts Phase D into late autumn and Phase E into early 2027. If actual capacity exceeds estimate, sprints pull forward; we do not slip schema discipline to keep up with calendar dates.

---

## 4. Sprint sequence

Numbering follows the HCS proposal with two restorations and one re-ordering. Restored sprints are marked `[restored]`; HCS-added sprints retain their `[HCS]` markers; references-team-corrected sprints are marked `[refs-team]`.

### Phase A

#### Sprint 1 — Schema Audit + Exercise Object Grounding `[refs-team, HCS-extended]`
- **Engineering produces:** field-level audit table for `exam-question.schema.json`, `target-exercise.schema.json`, `unit.schema.json`, `term.schema.json`, `evidence-anchor.schema.json`, `alignment-edge.schema.json`, `chunk.schema.json`. Sample 5 records per file. Document actual vs declared shape. Vocabulary-rename overlay proposal: `required_skills` → `required_units`.
- `[HCS]` audit must additionally check: presence/absence of fields for Bloom level, vraagtype, instruction-word, scaffolding sub-axes (verbal_level, visual_stage, fading_position, dual_coding_present), graph_specs, source_artifact_id, precision_lint_status, level (havo|vwo) on authority, exam_codes directly on exercises.
- `[HCS]` audit reviews scope of artefacts in `4veco-lessen` — every companion artefact type that exists for paragraph 1.1.1 is listed with its expected authority weight.
- **No schema mutation runs in this sprint.** Output is a packet only.
- **Acceptance:** `GATE-CP1-schema-audit` passes.

### Phase B

#### Sprint 2 — R9.1 Owned Source Registry `[existing, scope-extended]`
- Engineering: register owned book/source surfaces, blueprint metadata validation, source-manifest integration.
- `[HCS]` scope explicitly includes the 16+ companion artefact types (not only paragraph markdown). Each type carries its authority status: which can be evidence (paragraaf, opgaven, exam-derived target exercises), which is exposition (samenvatting, uitleg vaardigheden, uitleg voorkennis), which is a generated projection (HTML/PDF artefacts).
- `[HCS]` repair `course-target-exercises.json.blueprint_source` to point at `references/owned/course-blueprint-v4.md`.
- `[HCS]` annotate the lessen-team's pilot status: only paragraph 1.1.1 has the full companion set today; other paragraphs have the textbook trio only. Coverage report must reflect this.
- **Stop condition (preserved from live roadmap):** owned exposition cannot override external authority or reviewed machine references.
- **Acceptance:** `GATE-CP2-owned-source-scope` passes.

#### Sprint 3 — R9.2 Content Graph Projection `[existing, scope-extended]`
- Engineering: project owned content with projection edges, owned-content coverage report, regenerated chunk index.
- `[HCS]` projection edges must be created for every companion artefact type, with edge type encoding the artefact's role (e.g., `samenvatting → exposition_for_paragraph`, `opgaven → practice_for_paragraph`).
- **Stop condition (preserved from live roadmap):** do not use generated lesson text as primary proof for reference claims.
- **Acceptance:** chunk index now retrieves owned material; weak-match warnings surface for unanchored chunks.

#### Sprint 4 — Exercise Authority/Role/Scaffolding Schema Extension `[refs-team, HCS-extended, overlay-based]`
- Engineering: extend exercise schemas via overlay under `references/data/exercises/` per references-team protected-surface discipline. Backfill `authority: A` on existing exam-questions records via overlay — **no hand edits to `references/external/exam-questions.json`**.
- `[HCS]` apply the eleven schema additions (see §7).
- `[HCS]` dry-run on one Tier A item and one Tier C target exercise before bulk extension; CP-3 reviews lossless round-trip.
- **Acceptance:** `GATE-CP3-schema-dry-run` passes.

### Phase C

#### Sprint 5 — Bronnen Registry Stub `[HCS]`
- `[HCS]` mint ~30 stable IDs for the most-reused source artefact types (prijs-tabellen, vraag/aanbod-grafiek-met-shift, news-clip-EU-beleid, payoff-matrices, CBS-tijdreeksen, indexcijfer-tabellen, kostenstructuur-tabellen, surplus-grafieken).
- Engineering: schema, validator, CLI mutation script. Stored under `references/machine/bronnen.json`.
- Required before Sprint 13 (composition-pattern registry) can be useful.
- **Acceptance:** schema validates; first 30 IDs minted; review-gate before any composition pattern references a bron ID.

#### Sprint 6 — Skill Registry MVP `[refs-team, HCS-vocabulary]`
- Engineering: promote `references/authored/skill-categories.md` to JSON registry. Registry uses the platform's 8-category vocabulary (`rekenen, grafisch, redeneren, begrippen, bron-info, standpunt, strategisch, toetsvaardigheden`, optionally `onderzoek`). The proposed engineering enum `category: economics|math|...` is dropped.
- `[HCS]` registry preserves all fields `skill-categories.md` already carries: `cvte_subdomain`, `bloom_levels`, `vraagtype_frequencies`, `fbse_links`, `min_coverage` rules, `common_misconception_refs`, `signal_words`.
- **Operations registry is deferred to Sprint 12** — operations bootstrap from real exam-item decomposition, not top-down design.
- **Acceptance:** `GATE-CP4-skill-registry-coexistence` passes.

#### Sprint 7 — Misconception Registry Stub `[HCS]`
- `[HCS]` mint ~20 high-priority misconception IDs (shift-vs-movement, prijs-vs-kosten, reëel-vs-nominaal, MO-line-through-origin, winst-equals-omzet, comparatief-vs-absoluut-voordeel, factor-classification-fallback-to-preferences, indexpunt-vs-procentuele-verandering, surplus-triangle-wrong-vertex, profit-equals-revenue, marginal-equals-average, ceteris-paribus-violation, and ~8 more from `pitfalls[]` content).
- Engineering: schema, validator, CLI. Stored under `references/machine/misconceptions.json`.
- Don't backfill 130+ pitfall bullets yet — let exercise-tagging drive registry growth (the same exercise-first principle that drove unit minting).
- **Acceptance:** registry validates; first 20 IDs minted with `description, domain, typical_distractor_text, affected_units, affected_skills`.

#### Sprint 8 — D04 Resolution and Dependent-Unit Audit `[HCS]`
- `[HCS]` engineering produces the D04 split proposal (likely 3–5 successor units): "Calculate Ev", "Classify good by Ev", "Inkomenselasticiteit", "Kruislingse elasticiteit", "Goederenclassificatie via Ei + kruislingse".
- `[HCS]` content review by VWO economics teacher subagent before approval.
- `[HCS]` review against actual elasticity exam items in `exam-questions.json` (D-domain, both havo and vwo) to confirm split covers tested patterns.
- `[HCS]` add `unit_design_status: stable | unstable | deprecated` field to unit schema. C→B promotion gate refuses when any required unit is `unstable`.
- **Acceptance:** `GATE-CP5-D04-resolution` passes.

#### Sprint 9 — R8.1 QC Issue Model `[restored from live roadmap]`
- Engineering: define lightweight, machine-readable quality issue model that directly improves reference/RAG trust.
- Categories: reference quality, evidence sufficiency, unit design, extraction integrity, report drift, source-version drift, term-link gaps, needs gaps, production-readiness warnings.
- Each issue carries: severity, owner/team, affected surface, evidence, next action, proof required to close.
- Integration: retrieval surfaces issues alongside results so consumers see uncertainty and stale evidence; dashboard reads the same JSON.
- **Stop condition (preserved):** do not gold-plate a general issue tracker; do not copy categories from unrelated data-analysis projects.
- **Why restored:** HCS dropped this without explanation. R8.1 is the mechanism that lets retrieval *expose* uncertainty rather than hide it. Without it, RAG can return weak evidence with no signal. This belongs before R7.6 closes, not after.

#### Sprint 10 — R7.6 RAG Quality Hardening `[existing, sub-tasks restored]`
- Engineering: the four RAG sub-tasks from the live roadmap are restored explicitly:
  - **RAG-01:** retrieval labels explicit for `approved`, `approved_with_conditions`, `pending_review`, `diagnostic_only`, `generated_report_diagnostic`, `external_primary`, `machine_registry`, `authored_judgement`.
  - **RAG-02:** score, match-strength, and weak-match warnings; very low-score matches are hidden by default or grouped as possible weak matches.
  - **RAG-03:** target exercises split into stable per-exercise chunks with exercise IDs, source paths, unit links, term links where available, evidence metadata, and target-exercise status.
  - **RAG-04:** evidence-anchor coverage reports for retrieval by chunk type, entity type, source type, authority level.
- Eval set 10 → 50–100. Anchors 15 → 50+. First batch of human-approved alignment graph edges.
- `[HCS]` eval set covers ≥10 content queries from `feedback-to-engineering-HCS.md §2`, including ≥2 negative cases (e.g., "find an exercise whose answer model violates the unified-procedure rule" must retrieve known-bad items, not be empty).
- `[HCS]` retrieval results carry the full authority + role + scaffolding triple in their summary, plus authority/role/scaffolding/level filters.
- **Stop condition (preserved):** do not expand into diagnostics, adaptive routing, student-facing AI, or new product surfaces.
- **Acceptance:** `GATE-CP8-eval-content-coverage` passes.

#### Sprint 11 — Year-1 Paragraph-Coverage Closeout `[HCS, content-track-led]`
- `[HCS]` engineering produces `reports/blueprint-coverage.md`: paragraphs with target exercise (49 today); paragraphs without (~31 today); paragraphs with target exercise but `precision_lint_status != passed`; paragraphs whose anchor units have `unit_design_status: unstable`.
- `[HCS]` content production track (Lessen Team + Content Strategy) authors the missing target exercises during this same window.
- **Acceptance:** `GATE-CP6-year-1-closeout` passes. Year 1 stays open if more than 5 paragraphs lack target exercise or more than 10 fail precision lint.

### Phase D

#### Sprint 12 — Exam Item Decomposition Backfill `[refs-team, decomposition-aware]`
- Engineering: for every Tier A exam item, attach `cognitive_skills` (8-cat), `skill_ids` (registry), `operations`, `composition_pattern_id`, `instruction_word`, `bloom_level`, `reasoning_chain_length`. Sprint 6 has provided the registry; this sprint can run.
- `[HCS]` decomposition runs through a teacher subagent for each opgave in batches of 10. Subagent reports flagged uncertain cases for human content review.
- `[HCS]` operations registry is bootstrapped here from the recurring atoms surfaced by decomposition.

#### Sprint 13 — Composition Pattern Registry `[HCS]`
- Engineering: build registry. Each pattern requires ≥2 Tier A exemplars before being referenceable by Tier C.
- `[HCS]` mandatory fields: `source_artifact_required, question_chain_length, escalation_profile, bloom_curve`.

#### Sprint 14 — R14.1 Minimal Curriculum Versioning `[existing]`
- Engineering: tag external/machine/authored/owned-source surfaces with version provenance. Stale-reference report.
- Required before C→B promotion can compare exercises across syllabus versions.
- **Stop condition (preserved):** do not silently mix curriculum versions.

### Phase E

#### Sprint 15 — Concept Blueprint Pass-1A: Year-1 Closure `[HCS, content track]`
- `[HCS]` close the remaining Year-1 paragraphs. Author target exercises with `precision_lint_status: not_run` placeholder.
- **This is content-track work, not engineering.** Engineering supports by ensuring the schema extension lands ahead of the work (Sprint 4) and the 8 categories are populatable (Sprint 6).
- **Acceptance:** 80/80 paragraphs covered by Tier C target exercises with `precision_lint_status: passed | not_run` (no `failed`).

#### Sprint 16 — Year-1 Sequencing and Dual-Coding Audit `[HCS]`
- `[HCS]` review the cost-structure chain (TO → TK → GVK → GTK → break-even → MK → MO=MK), the welfare chain (CS → PS → TS → DWL → toepassingen), and the dual-coding-fade pattern across all begeleide-inoefening graph exercises.
- Output: a list of sequencing or scaffolding errors to fix before promotion can run.

#### Sprint 17 — Concept Blueprint Pass-2: Year-2 Skeleton `[HCS, staged]`
- `[HCS]` only after Year 1 is closed (CP-6 passed).
- `[HCS]` every Year-2 paragraph is mapped to a CvTE-vwo anchor exam item from `exam-questions.json`. Paragraphs without anchor are tagged `concept_orphan: true` and excluded from retrieval coherence tests.
- `[HCS]` `concept_orphan` rate target: <20% overall, <30% in any single domain. Domains thinly covered by CvTE-vwo exam items (notably Domein A4 strategisch inzicht and parts of Domein L) may legitimately exceed 20%; the per-domain threshold is the realistic bar.
- **Acceptance:** `GATE-CP7-year-2-anchoring` passes.

#### Sprint 18 — C → B Promotion Workflow `[refs-team, HCS-extended]`
- Engineering: CLI for promotion, review gate, automated coherence tests per `(role, scaffolding)`, promotion record schema.
- `[HCS]` promotion gate refuses when:
  - Any required unit has `unit_design_status: unstable`.
  - The exercise's `precision_lint_status` is `not_run` or `failed`.
  - Coherence test scope mismatch on `level` (havo C cannot promote against vwo A or vice versa).
  - The exercise lacks `cvte_anchor_required` for Year-2/3 origin and is `concept_orphan: true`.
- Promotion record schema captures: who reviewed, when, against what eval results, at what curriculum version. Demotion B → C is allowed and recorded.
- First promotion review gate runs on a small batch (≤10 exercises) for content-track sign-off.

### Phase F

#### Sprint 19 onward — Re-evaluate R10–R13 with fresh eyes
- Not before 2027-02-01. Triggered by RAG-quality evidence, not by deadline pressure.
- Decision input: did Sprint 10's expanded eval set, Sprint 11's content closeout, and Sprint 18's first promotion batch produce evidence that warrants building diagnostics, AI tutor surfaces, or teacher cockpit deployment?

---

## 5. Sprint ledger summary

| # | Sprint | Phase | Origin | Target window | Checkpoint |
|---:|---|---|---|---|---|
| 1 | Schema Audit + Exercise Object Grounding | A | refs-team / HCS-extended | 2026-04-28 → 2026-05-08 | CP-1 |
| 2 | R9.1 Owned Source Registry | B | existing / scope-extended | 2026-05-08 → 2026-05-15 | CP-2 |
| 3 | R9.2 Content Graph Projection | B | existing / scope-extended | 2026-05-15 → 2026-05-31 | — |
| 4 | Exercise Schema Extension (overlay) | B | refs-team / HCS-extended | 2026-05-31 → 2026-06-05 | CP-3 |
| 5 | Bronnen Registry Stub | C | HCS | 2026-06-05 → 2026-06-19 | — |
| 6 | Skill Registry MVP | C | refs-team / HCS-vocabulary | 2026-06-05 → 2026-06-19 | CP-4 |
| 7 | Misconception Registry Stub | C | HCS | 2026-06-19 → 2026-06-26 | — |
| 8 | D04 Resolution + Dependent-Unit Audit | C | HCS | 2026-06-26 → 2026-07-03 | CP-5 |
| 9 | R8.1 QC Issue Model | C | restored | 2026-07-03 → 2026-07-17 | — |
| 10 | R7.6 RAG Quality Hardening (RAG-01..04) | C | existing / sub-tasks restored | 2026-07-17 → 2026-09-25 | CP-8 |
| 11 | Year-1 Paragraph-Coverage Closeout | C | HCS / content-track-led | 2026-07-03 → 2026-07-24 | CP-6 |
| 12 | Exam Item Decomposition Backfill | D | refs-team | 2026-09-25 → 2026-10-31 | — |
| 13 | Composition Pattern Registry | D | HCS | 2026-10-31 → 2026-11-15 | — |
| 14 | R14.1 Minimal Curriculum Versioning | D | existing | 2026-09-25 → 2026-10-15 | — |
| 15 | Concept Blueprint Pass-1A: Year-1 Closure | E | HCS / content track | 2026-06-05 → 2026-07-24 (parallel) | CP-6 |
| 16 | Year-1 Sequencing + Dual-Coding Audit | E | HCS | 2026-08-15 → 2026-09-15 | — |
| 17 | Concept Blueprint Pass-2: Year-2 Skeleton | E | HCS / staged | 2026-09-04 → 2026-10-31 | CP-7 |
| 18 | C→B Promotion Workflow | E | refs-team / HCS-extended | 2026-11-15 → 2027-01-31 | First promotion gate |

Sprints 11 and 15 partially overlap Sprint 10 because they sit on the content track and progress while engineering finishes RAG-01..04. Sprints 12 and 14 can run partially in parallel because they share little code surface.

---

## 6. Cross-team checkpoints

| Checkpoint | Target date | Track gate | Engineering produces | Content reviews |
|---|---|---|---|---|
| CP-1 Schema audit review | 2026-05-08 | Pre-R9.1 | Audit table + vocabulary-rename overlay proposal | Audit covers Bloom, vraagtype, instruction-word, dual-coding stage, level, graph_specs, precision_lint_status, eindterm direct linkage |
| CP-2 R9.1 owned-source scope review | 2026-05-15 | During R9.1 | List of source surfaces with status labels | All 16+ companion artefact types listed; authority weights match content reality |
| CP-3 Schema extension dry-run | 2026-06-05 | Pre-bulk extension | Manual extension of one Tier A item + one Tier C target exercise to new schema | Lossless round-trip; reviewer can reconstruct opgave on paper without ambiguity |
| CP-4 Skill registry coexistence | 2026-06-19 | Pre-skill-registry promotion | Three-layer hierarchy: categories on exercise, aspects on unit, skill_ids fine-grained | All `skill-categories.md` content preserved (CvTE A mapping, vraagtype mapping, Bloom levels, F/B/S/E links, distribution rules) |
| CP-5 D04 resolution | 2026-07-03 | Pre-promotion-on-D-domain | D04 split proposal (3–5 successor units) + dependent-unit audit | VWO economics teacher subagent reviews split against actual D-domain exam items |
| CP-6 Year-1 paragraph-coverage closeout | 2026-07-24 | Pre-Year-2 extension | `reports/blueprint-coverage.md` | Year 1 stays open if >5 paragraphs without target exercise or >10 with `precision_lint_status != passed` |
| CP-7 Year-2 anchoring review | 2026-09-04 | Pre-Year-2-Tier-C authoring | Year-2 skeleton with CvTE-vwo anchor per paragraph | Overall `concept_orphan` rate <20%; per-domain rate <30%; sequencing chains coherent against Year-1 |
| CP-8 RAG eval content coverage | 2026-09-25 | During R7.6 | Expanded eval set 50–100 cases | At least 10 content-side queries from `feedback-to-engineering-HCS.md §2`, including ≥2 negative cases |

Each checkpoint format: subagent review → human review → decision recorded as `pass | pass_with_conditions | hold` in `reports/review-gates/<gate-id>/`.

---

## 7. The eleven schema additions

These are the content-side schema additions that protect didactic quality. Engineering implements them during Sprint 4 (Exercise Schema Extension, overlay-based).

| # | Addition | Why |
|---|---|---|
| 1 | Rename `required_skills` → `required_units`; reserve `skill_ids` for the future fine-grained registry | Eliminates the vocabulary collision the references team flagged. 322/349 exam-question records and 49/49 target-exercise records use the field today as unit IDs |
| 2 | Replace `scaffolding: enum(scaffolded\|partial\|faded)` with `scaffolding: { verbal_level 0–5, visual_stage 1–4, fading_position int, dual_coding_present bool }` | Verbal scaffolding (Niveau 0–5 from `didactiek-principes.md §4.1`) and visual scaffolding (4-stage fade from §4.4) are independent. Mandatory rule for begeleide-inoefening graphs is `dual_coding_present: true` regardless of verbal level |
| 3 | Split `role` into `instructional_role` (worked_example, startoefening, independent_practice, interleaving, target, verdieping, consolidatie, instapquiz, diagnostic, nieuws) and `assessment_role` (exam_mirror, bridge, prerequisite) | The proposed five-role taxonomy could not express the lessen-team's 16+ artefact types. A `worked_example` can be a `prerequisite` or a `bridge`; collapsing them loses information |
| 4 | Add `instruction_word: enum (noem, bereken, leg-uit-dat, leg-uit-of, classificeer, beoordeel, toon-aan, teken, arceer, redenering)` | `skill-categories.md §2.8` calls instructiewoorden the single largest source of lost CvTE points. Drives student-visible answer form |
| 5 | Add `vraagtype: enum(1..7)` and `bloom_level: enum(onthouden..creëren)` | `vraagtypen-en-opgaveontwerp.md §1.1` and `§4.1` define hard QC targets per paragraph (vraagtype frequency and Bloom 25/40/35 split) |
| 6 | Add `reasoning_chain_length: int` | CvTE's "Maak een redenering" pattern requires ≥2 schakels. Partial-credit risk if zero or one |
| 7 | Add `source_artifact_id: string` referencing the Bronnen registry | Real CvTE opgaven hang on bronnen (table, graph, news clip, payoff matrix). Without source-artefact linkage, generated Tier C items will match the skill list but feel nothing like real exam items |
| 8 | Add `graph_specs: [{type, axes, slope_directions, shifts, shaded_areas}]` and `precision_lint_status: enum(passed\|not_run\|failed)` driven by `build-scripts/verify_svg_geometry.py` | Protects the four standards from `economic_mathematical_precision_reference.md`. Precision errors in scaffolded material teach students the error effectively |
| 9 | Add `level: havo \| vwo` to `authority` and propagate to coherence-test scope | `exam-questions.json` already records `level` on every record. Without propagation, a havo Tier A item could anchor a vwo Tier C — wrong, since vwo adds Domein A4 strategisch inzicht |
| 10 | Add `unit_design_status: stable \| unstable \| deprecated` to units; promotion gate refuses C→B when any required unit is `unstable` | D04 currently has no `procedure`, no `pitfalls`, mastery `understand` for content tested at `apply`. Promoting any C exercise that depends on D04 would encode an incoherent mastery target |
| 11 | Add `concept_orphan: boolean` and require `cvte_anchor_required: true` for Year-2/3 concept exercises | 174 vwo exam-question records exist — sufficient anchoring for Year-2 paragraphs. The flag excludes unanchored exercises from retrieval coherence tests until anchored |

---

## 8. Discipline preserved from the live roadmap

These rules govern every sprint and override any pressure from this roadmap to move faster:

- All mutations to `references/machine/` and `references/external/` go through CLI scripts. **No hand edits.** Exercise authority/role/scaffolding extensions go to overlay under `references/data/exercises/`, never directly into `references/external/exam-questions.json`.
- Every sprint has plan, baseline, execute, verify, review-gate-if-needed, deterministic bundle check, commit, tag.
- Every sprint plan must include an `Operationalized sprint procedure` section that answers what exact sequence of work happens, which roadmap instructions are carried forward, what artefacts prove the work happened, what validators must pass, what requires human review, where the agent must stop.
- Subagents propose; humans decide on pedagogy; validators enforce mechanical completeness; git records state.
- Generated reports are diagnostic, not primary evidence. `references/external/` mirrors outside authority and changes must come from refresh/extraction workflows.
- Evidence hierarchy: real CvTE exam questions > target exercises > machine registries > syllabus (grouping only) > authored judgement > generated reports.
- Owned exposition does not become external authority. Projection edges are not evidence edges.
- Deterministic chunk layer comes before any vector-first retrieval. The R7 layer's deterministic discipline is non-negotiable.

---

## 9. What stays deferred

The following remain explicitly out of scope until the foundation is closed and Phase F evidence supports them:

- R10 — diagnostic items, feedback library, diagnostics gate, adaptive routing.
- R11 — game and simulation content mapping.
- R12 — teacher cockpit, privacy gate, accessibility gate (deployment-side).
- R13 — internal authoring assistant, AI tutor guardrails, AI review gate.
- R14.2 / R14.3 — evidence signal model, continuous improvement reports.
- R8.2 — production QC gates (deferred until R9 owned-source ingestion lands).

The blocked outcomes from R7.4 review gate remain in force:
- Student-facing diagnostics, adaptive routing, student-facing AI, automatic lesson sequencing, automatic mastery decisions, summative assessment decisions, and unreviewed student-facing publication.

---

## 10. Critical path

Use this order when capacity is limited. Do not invert.

```text
Schema Audit + Exercise Object Grounding   (CP-1)
R9.1 Owned Source Registry                  (CP-2)
R9.2 Content Graph Projection
Exercise Schema Extension (overlay)         (CP-3)
Skill Registry MVP                          (CP-4)
Bronnen Registry Stub
Misconception Registry Stub
D04 Resolution + Dependent-Unit Audit       (CP-5)
R8.1 QC Issue Model
R7.6 RAG Quality Hardening (RAG-01..04)     (CP-8)
Year-1 Paragraph-Coverage Closeout          (CP-6)
R14.1 Minimal Curriculum Versioning
Exam Item Decomposition Backfill
Composition Pattern Registry
Concept Blueprint Pass-2: Year-2 Skeleton   (CP-7)
C→B Promotion Workflow
```

If capacity is critically limited, the minimum viable subset for measurable RAG quality improvement is: Schema Audit → R9.1 → R9.2 → Exercise Schema Extension → Skill Registry MVP → R7.6. After that subset, RAG retrieves owned content with extended schema, and the eleven schema additions are populated for any exercise that passes through the new pipeline. Everything else compounds value but is not strictly required for the core retrieval improvement.

---

## 11. Immediate next sprint

**Schema Audit + Exercise Object Grounding** (Sprint 1).

The live roadmap's previous "Immediate Next Sprint" pointer to R9.1 is updated. Schema Audit precedes R9.1 because the references team's review found that current schema files do not match actual exam-question / target-exercise data shapes closely enough to extend safely. R9.1 still follows immediately after.

Sprint 1 must:
- Produce the full audit packet with the field-level tables for all listed schemas and a sample of 5 records per source file.
- Surface the eleven HCS schema additions as either present, present-with-gap, or missing in current schemas.
- Propose the vocabulary-rename overlay (`required_skills` → `required_units`).
- Stop before mutating any protected reference surface.
- Pass `GATE-CP1-schema-audit` before R9.1 begins.

---

## 12. Capacity and date governance

Three rules govern how this roadmap responds to actual team capacity:

1. **Dates are capacity-bound targets, not contracts.** The phase-view and sprint-ledger dates are estimates. If a sprint takes longer than estimated, downstream sprints slip with it. We do not promote unfinished work to hit a calendar target.

2. **Discipline overrides schedule.** If a sprint cannot pass its review gate, the gate stays held. The references team's R2.3 `hold` decision is the model: a held gate triggers an evidence-and-design cleanup sprint (R2.4), not a softening of acceptance criteria.

3. **The content track does not stall when engineering slips.** Authoring missing Year-1 target exercises (Sprint 11/15), backfilling instruction-word/vraagtype/Bloom on the existing 49 target exercises, and the Year-1 D-domain audit are all content-track work that proceeds independently. If engineering slips Sprint 4 (schema extension), content authoring continues using the current schema with `precision_lint_status: not_run` placeholders, and the schema upgrade applies retroactively when engineering catches up.

If the actual elapsed time at CP-3 (target 2026-06-05) exceeds two weeks, the next planning meeting must explicitly decide whether to compress later sprints, defer Phase E milestones, or extend the cohort 2027/2028 timeline. We do not let calendar pressure compromise the schema audit or the C→B promotion gate.

---

## 13. Final position

The references team has corrected the engineering proposal in two important ways the team should not lose: vocabulary collision and protected-surface discipline. Content strategy has correctly identified that the schema as drafted under-specifies didactic reality, that Year-1 must close before Year-2/3 extension begins, and that two parallel tracks with eight cross-team checkpoints is the right operating shape. This roadmap unifies all three positions: I am restoring R8.1 (QC Issue Model) and R7.6's RAG-01..04 sub-tasks that the HCS proposal dropped silently, treating dates as capacity-bound rather than contractual, allowing the per-domain `concept_orphan` rate to reach 30% where CvTE-vwo coverage is sparse, and locking the references team's discipline rules so that calendar pressure cannot compromise them.

The RAG quality target by CP-8 (target 2026-09-25): a content reviewer can answer every query in `feedback-to-engineering-HCS.md §2` from retrieval alone, without rereading paragraph markdown. The promotion target by 2027-01-31: first C→B batch through the gate, with all required units stable, all precision lints passed, and all level/coherence checks honoured. The Year-2 readiness target by end-2026: skeleton drafted, Year-2 anchoring reviewed at CP-7, content track ahead of cohort 2027/2028 deployment readiness.

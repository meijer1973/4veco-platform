# Summary of Edits — Final Roadmap Decision

**From:** Head of Engineering
**Date:** 2026-04-28
**Companion to:** `roadmap-final-head-of-engineering.md`
**Audience:** References Team, Lessen Team, Content Strategy, Exec.

---

## 1. The arc of this decision

I sent out a handoff (`handoff-exercise-schema-and-rag-quality_Proposal_head_engineer.md`) proposing RAG quality as priority over R8–R13 product surfaces, exercises as first-class objects with three independent axes, and a concept three-year blueprint extension. Two reviews came back:

- The **references team** corrected stale metrics (190→209 units, 48→39 zero-needs, etc.), flagged a vocabulary collision (`required_skills` already means unit IDs in 322/349 exam-question records), and warned against hand-editing protected surfaces.
- **Head of Content Strategy** added eleven schema extensions to protect didactic quality, two cross-cutting registries (bronnen, misconceptions), a D04 resolution gate before C→B promotion can run, year-by-year staging of the concept blueprint, and a parallel content production track with eight cross-team checkpoints.

The final roadmap I am adopting incorporates both reviews almost in full, with five corrections to the HCS proposal and one structural restoration. This document explains what I accepted, what I corrected, and why.

---

## 2. What I accept from the references team without reservation

| Correction | Why I accept |
|---|---|
| Stale metrics: 209 live units, 39 zero-needs, 63 missing terms, 8 approved graph edges, etc. | R4.5 closed since my handoff was written. Every metric in the handoff is now superseded |
| **Vocabulary collision** — rename `required_skills` → `required_units`; reserve `skill_ids` for the future fine-grained registry | The collision is real: 322/349 exam-question records and 49/49 target-exercise records use `required_skills` as unit IDs today. Introducing parallel "skills" without renaming would be a foreseeable drift hazard |
| **Protected surface discipline** — exercise authority/role/scaffolding extensions go to overlay under `references/data/exercises/`, not into `references/external/exam-questions.json` | My handoff suggested backfilling external/exam-questions.json directly. That violates the references team's discipline. The overlay approach preserves it |
| **Schema audit precedes schema mutation** — current schema files do not match actual data shapes closely enough to extend safely | Verified: `exam-question.schema.json` requires fields the actual records don't have, and vice versa. The audit is non-negotiable |
| **Blueprint placement** — `references/owned/course-blueprint-v4.md` is canonical; old `knowledge/course_blueprint_v4.md` source-refs need repair | Confirmed; trivial fix, easy to miss without the audit |
| **R7.4 doc drift already fixed** — the live roadmap now correctly names R9.1 as next | Already fixed by references team |

---

## 3. What I accept from HCS

| HCS extension | Why I accept |
|---|---|
| **All eleven schema additions** (§7 of the final roadmap) | Each addition closes a query a content reviewer asks today and the proposed schema cannot answer. The didactic dimensions (Bloom, vraagtype, instruction-word, dual-coding fade, precision lint, level discriminator) are not optional — they are what makes the schema useful for actual content production |
| **Scaffolding as a 4-field object** (verbal_level, visual_stage, fading_position, dual_coding_present) instead of an enum | My single enum collapsed two independent dimensions. The platform's mandatory rule for begeleide-inoefening graphs is `dual_coding_present: true` regardless of verbal level — this is unrepresentable in the enum |
| **Role split** into `instructional_role` (10 values) + `assessment_role` (3 values) | My five-role taxonomy was clean for retrieval but couldn't express the lessen-team's 16+ artefact types. A `worked_example` can be a `prerequisite` or a `bridge` — those are orthogonal axes, not mutually exclusive options |
| **Bronnen registry precedes composition-pattern registry** | Real CvTE opgaven hang on bronnen. A composition-pattern registry without bron anchors will produce items that match the skill list but feel nothing like real exam items. This is a sequencing point I missed |
| **D04 resolution gate before C→B promotion** | D04 has no `procedure`, no `pitfalls`, mastery `understand` for content tested at `apply`. Promoting any C exercise that depends on D04 would lock in an incoherent mastery target. The `unit_design_status: stable\|unstable\|deprecated` field with promotion-gate refusal on `unstable` is a one-line policy that prevents a known content trap |
| **Misconception registry stub now, formalise at R10.1** | The shift-vs-movement misconception alone repeats across 6+ locations today. Diagnostic distractors need misconception IDs. Stubbing 20 IDs now is the right amount of work; full formalisation can wait |
| **Year-1 closure before Year-2/3 extension** | 49 target exercises against 80 paragraphs ≈ 61% Year-1 coverage. Books 3 and 4 of the blueprint are largely empty in target-exercises.json. Extending Tier C to Years 2–3 against an unfinished Year 1 is high-rework and risks cascading sequencing errors |
| **`concept_orphan` flag + `cvte_anchor_required` for Year-2/3 exercises** | The cheap proxy: every Year-2 paragraph anchored to a CvTE-vwo exam item. Catches Year-2 sequencing errors before they enter retrieval |
| **Two parallel tracks** (engineering + content) with eight cross-team checkpoints | The content track has work that doesn't depend on engineering completion. Letting it run in parallel with checkpoint synchronisation is sound project management. The 49→80 target-exercise authoring is the limiting factor on retrieval coverage just as much as schema extensions are |
| **Operations registry deferred to Sprint 12** (after exam-item decomposition) | Smart: operations should emerge from real decomposition work, not be designed top-down. My handoff suggested it as a separate up-front sprint |
| **Cohort 2026/2027 frozen on Module 3; this is for cohort 2027/2028** | Important context I didn't have. Protects the roadmap from premature deployment pressure |
| **Eight checkpoint format** (subagent review → human review → recorded gate decision) | Mirrors the existing review-gate discipline. Adds cross-team coordination without inventing new machinery |

---

## 4. Where I correct HCS

### 4.1 Restore R8.1 QC Issue Model

The HCS roadmap drops R8.1 silently. The references-team live roadmap still lists R8.1 as planned. R8.1 defines a lightweight quality issue model that retrieval surfaces alongside results — so consumers can see uncertainty, evidence weakness, and stale data. **Without R8.1, RAG can return weak evidence with no signal to the consumer.** That defeats one of the core RAG-quality goals.

**Decision:** R8.1 is restored as Sprint 9 in the final sequence, between D04 Resolution (Sprint 8) and R7.6 RAG Quality Hardening (Sprint 10). R8.1's output is consumed by R7.6's retrieval labels (RAG-01) and weak-match warnings (RAG-02). Putting R8.1 right before R7.6 means the QC issue schema is available when retrieval starts surfacing it.

### 4.2 Restore R7.6's RAG-01 through RAG-04 sub-tasks

The HCS roadmap mentions "RAG-01 through RAG-04 from existing R7.6 plan" briefly without elaboration. The live roadmap defines each sub-task explicitly:

- RAG-01: retrieval labels for approved / pending-review / diagnostic-only / generated-report / external-primary / machine-registry / authored-judgement
- RAG-02: score, match-strength, weak-match warnings; very-low-score matches hidden by default
- RAG-03: target exercises split into stable per-exercise chunks
- RAG-04: evidence-anchor coverage reports for retrieval

**Decision:** Sprint 10 in the final roadmap restores all four sub-tasks explicitly. They are not optional refinements; they are what makes "high-quality RAG" measurable.

### 4.3 Treat dates as capacity-bound targets, not contracts

The HCS roadmap sets dates: CP-1 by 2026-05-08, CP-2 by 2026-05-15, ... Year-1 closure by 2026-07-24, etc. The HCS summary calls them a "date contract content strategy holds engineering to."

This is wrong on capacity grounds. The references team is one team running on existing capacity. They have been running well, but 18 sprints + 8 checkpoints + a parallel content track in the 2026-04 → 2026-09 window assumes near-perfect execution. Calendar contracts that exceed realistic capacity create pressure to soften acceptance criteria — which is exactly the failure mode the references team's R2.3 `hold` discipline exists to prevent.

**Decision:** Dates are capacity-bound targets. Three governance rules are added (§12 of the final roadmap):
1. If a sprint takes longer than estimated, downstream sprints slip with it.
2. Discipline overrides schedule. A held gate triggers a cleanup sprint, not softened acceptance.
3. The content track does not stall when engineering slips. Content authoring continues using the current schema with `precision_lint_status: not_run` placeholders.

The references team's R2.3 `hold` decision is cited explicitly as the model.

### 4.4 Adjust the Year-2 `concept_orphan` threshold

HCS sets `concept_orphan` rate <20% as the CP-7 acceptance criterion. The argument is sound — 174 vwo exam-question records exist, easily enough to anchor every Year-2 paragraph at least loosely. But 174 records are not evenly distributed across domains. Domein A4 (strategisch inzicht) and parts of Domein L are thinly covered by CvTE-vwo exam items in practice.

**Decision:** Overall rate target stays <20%. Per-domain rate target is <30% for domains thinly covered by CvTE-vwo records. This prevents CP-7 from blocking on a domain where the CvTE coverage itself is sparse, without softening the bar for well-covered domains. The threshold is empirically set, not dogmatic.

### 4.5 Phase windows widened

HCS Phase D ends 2026-09-25 and Phase E ends 2026-11-30. That assumes Phase C closes on time and the C→B promotion workflow is buildable in 5 weeks against 18 schemas. Realistic capacity puts Phase D into late autumn and Phase E into early 2027.

**Decision:** Phase D extended to 2026-11-15. Phase E extended to 2027-01-31. Phase F starts no earlier than 2027-02-01. The first C→B promotion gate target moves from 2026-11-30 to 2027-01-31. The Year-2 Tier C content target stays at end-2026 because that work runs on the content track and can compress more easily than engineering work.

---

## 5. What I preserve from the live roadmap

These are non-negotiable rules the references team operates under. The final roadmap restates them in §8:

- All mutations to `references/machine/` and `references/external/` go through CLI scripts. No hand edits.
- Every sprint has plan → baseline → execute → verify → review-gate-if-needed → deterministic bundle check → commit → tag.
- Every sprint plan has an `Operationalized sprint procedure` section that operationalises the roadmap description.
- Subagents propose; humans decide on pedagogy; validators enforce mechanical completeness; git records state.
- Generated reports are diagnostic, not primary evidence.
- Evidence hierarchy: real CvTE exam questions > target exercises > machine registries > syllabus (grouping only) > authored judgement > generated reports.
- Owned exposition does not become external authority. Projection edges are not evidence edges.
- Deterministic chunk layer comes before any vector-first retrieval.

The R7.4 review-gate's blocked outcomes also remain in force: no student-facing diagnostics, adaptive routing, AI tutor, automatic sequencing, mastery decisions, summative use, or unreviewed student-facing publication.

---

## 6. Sprint count reconciliation

| Source | Sprint count |
|---|---|
| Live roadmap (R9.1, R9.2, R7.6, R8.1, R14.1) | 5 planned |
| References team's data-quality map | 11 |
| HCS proposal | 18 (with a hidden gap at R8.1 and silent compression of R7.6) |
| **Final unified roadmap** | **18 + reasoning** |

The final count matches HCS. The differences are: R8.1 explicitly restored as Sprint 9 (HCS had silently dropped it); R7.6 sub-tasks RAG-01..04 explicitly preserved in Sprint 10; phase windows widened; dates marked as capacity-bound. The shape is HCS's; the discipline is the references team's; the restored sprints are mine.

---

## 7. Risk register

| Risk | Severity | Mitigation in final roadmap |
|---|---|---|
| Calendar pressure pushes the team to soften review gates | High | §12 capacity-and-date governance rules; references-team R2.3 `hold` model cited explicitly |
| Schema audit reveals deeper drift than estimated | Medium | Sprint 1 is non-mutating; if drift is large, Sprint 1 produces a follow-up cleanup sprint rather than triggering Sprint 4 immediately |
| D04 split is contested | Medium | CP-5 explicitly requires VWO economics teacher subagent review, plus review against actual D-domain exam items. If contested, Sprint 8 produces a held packet and C→B promotion stays blocked on D-dependents until resolved |
| Year-1 closure stalls (more than 5 paragraphs without target exercise at CP-6) | Medium | CP-6 acceptance keeps Year-1 open; Year-2 skeleton (Sprint 17) does not start until Year-1 closes |
| Operations registry design surfaces conflicts late (Sprint 12) | Low | Operations bootstrap from decomposition rather than top-down; conflicts are decomposition cases, not registry-design cases |
| Bronnen registry minted before sufficient sample | Low | 30 IDs is a stub; Sprint 13 (composition patterns) requires ≥2 Tier A exemplars per pattern, which forces bron quality bottom-up |
| Vocabulary rename misses a location | Low | CP-1 explicitly verifies the rename plan touches every place `required_skills` appears in content artefacts (target exercises, exam questions, paragraph YAML, quality_ref) |
| Engineering team capacity actually exceeds estimates and the roadmap looks slow | Low | Capacity governance pulls sprints forward when ahead. The shape is intact; only the dates flex |

---

## 8. What this roadmap is and is not

**It is:** the operating roadmap for the references team plus the cross-team coordination structure for content production, with eight checkpoints that synchronise the two tracks, eleven schema additions that protect didactic quality, and 18 sprints in the order that lets RAG quality compound rather than collapse under premature product surfaces.

**It is not:** a replacement for `references/reference-team-roadmap.md` at the sprint-execution level. The references team continues to maintain that document as the sprint-ledger record of truth. This roadmap sits above it and adds the content-track and cross-team-checkpoint structure. When the two disagree on a specific sprint's acceptance criteria, the references-team document wins on engineering execution; this document wins on the cross-team and content-side acceptance criteria.

**It is not:** a contract on calendar dates. Dates are capacity-bound targets. The references team's discipline overrides any pressure from this roadmap to move faster than realistic capacity supports.

**It is not:** a license to build R10–R13 product surfaces ahead of evidence. R10 (diagnostics, adaptive routing), R11 (game/simulation mapping), R12 (cockpit/privacy/accessibility deployment), R13 (AI tutor), R14.2/R14.3 (continuous improvement), and R8.2 (production QC gates) all stay deferred until Phase F evidence supports them — no earlier than 2027-02-01.

---

## 9. The decision in one paragraph

I accept the engineering direction (mine), the references-team corrections (theirs), and the HCS extensions (most of them). I restore R8.1 and R7.6's four sub-tasks that HCS dropped, treat dates as capacity-bound targets rather than contracts, allow the per-domain `concept_orphan` rate to reach 30% where CvTE coverage is sparse, and widen the Phase D/E windows to fit realistic capacity. The references team's discipline rules and the R7.4 review-gate's blocked outcomes are preserved unchanged. The immediate next sprint is Schema Audit + Exercise Object Grounding, replacing the live roadmap's previous R9.1 pointer. RAG quality strong enough for content-side queries by CP-8 (target 2026-09-25); first C→B promotion through the gate by 2027-01-31; foundation ready for cohort 2027/2028.

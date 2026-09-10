# Handoff: Exercise Schema and RAG Quality Direction

**Audience:** Claude Code with full `4veco-platform` and `4veco-lessen` repository access.
**From:** Planning conversation between Marcel (lead dev) and Claude (planning assistant), 2026-04-27.
**Status:** Design direction agreed. Repository audit and formal sprint plans not yet written.

---

## What this handoff is for

The references team has executed faster than the original roadmap anticipated. R0 through R7 are closed (R7.4 RAG Review Gate closed `pass_with_conditions` on 2026-04-27). R8 onward, as currently written, drifts toward visionary product surfaces (diagnostics, AI tutor, teacher cockpit) without first hardening the RAG foundation those surfaces will depend on.

Marcel's priority: **a high-quality RAG before any of those product surfaces.** During the conversation we developed:

1. A reordered near-term roadmap that pulls RAG-quality work forward and defers product-surface work.
2. A design for storing exercises as first-class objects with three explicit axes — authority, role, scaffolding — plus skill decomposition.
3. A goal set for the corpus: every exam item decomposable into named skills, every named skill has isolated practice, every exam item reachable via bridge exercises, taught modality vs. tested modality is recorded.
4. A concept three-year blueprint as scaffolding to seed RAG with target exercises before the blueprint itself is finalized.

Your job is to take this design, verify it against the actual repository state (which I could not read directly from the planning conversation), do a schema audit, write formal sprint plans following the team's existing discipline, and update the roadmap. Make your own judgment calls where the evidence on disk contradicts or extends what's described here. The schema sketches in this document are illustrative, not prescriptive — adapt them to what's actually there.

---

## Concrete gaps identified during the conversation

These are the metrics that drove the priority shift. Verify these against current state before acting on them — some may have moved since the roadmap snapshot dated 2026-04-26.

- 15 evidence anchors and 13 claims for 190 live units (~8% coverage)
- 10 retrieval evaluation cases; 10/10 pass, but the set is too small to detect real regressions
- 0 human-approved alignment graph edges; only 31 draft edges
- 48 of 190 live units have no `needs` edges
- 44 of 190 live units have no term links
- 165 of 225 terms lack pitfall text
- 27 exam-question records lack `required_skills`; 19 also lack `exam_codes`
- Foundational terms `alternatieve kosten` and `schaarste` unresolved against `begrippen.json`
- D04 (Elasticiteit en goederenclassificatie) flagged as unit-design issue, unresolved
- Owned lesson material in `4veco-lessen` (paragraph markdown, opgaven, antwoorden, plans, course blueprint) is not in the chunk index — it lives only as text in the lesson repo
- Mastery skew: 89 understand + 80 apply + 18 analyze + **3 evaluate**. The evaluate count is almost certainly under-tagging, not absence
- Domain imbalance: A=44, D=36, H=30, L=21, I=20, F=18, G=12, E=7, B=2. B and E are suspicious

---

## Recommended roadmap edits

These are recommendations, not directives. Compare against the live ledger in `references/reference-team-roadmap.md` and adjust.

### Promote and add

```
R9.1   Owned Source Registry
       (extend scope to register the concept blueprint as a source surface)

[NEW]  Skill Registry Promotion
       Promote references/authored/skill-categories.md from a markdown
       document to a governed registry analogous to begrippen.json.
       CLI mutations, validators, review gate, stable IDs.
       This is load-bearing for everything below.

[NEW]  Authority + Role + Scaffolding Schema Extension
       Add three explicit axes to exercise records.
       Backfill external/exam-questions.json with authority=A.

[NEW]  Concept Blueprint Extension Pass 1
       Three-year skeleton: books, chapters, paragraphs tied to existing
       units. No target exercises yet. Marked status: concept_draft.
       Reveals unit coverage gaps in years 2-3 cheaply.

R9.2   Content Graph Projection
       (extend scope: skill→exercise edges, projection edges separate
       from evidence edges)

[NEW]  Exam Item Decomposition Backfill
       For every Tier A item in external/exam-questions.json:
       decompose into named skills (from the registry) and operations
       (from a new operations registry). Record composition pattern.

[NEW]  Retrieval Eval Expansion + Anchor Backfill
       Push retrieval eval set from 10 to 50-100 cases.
       Push evidence anchors from 15 to 50+.
       Get a first batch of human_approved alignment graph edges.

R14.1  Curriculum Versioning
       (was Phase 14, promote to near-term: required before C→B
       promotion can run, because syllabus-version-mismatch must
       be detectable)

R8.1   QC Issue Model (scope down to enable retrieval to surface
       uncertainty and stale evidence; defer R8.2 until R9 lands)

[NEW]  Concept Blueprint Extension Pass 2
       Generate target exercises per paragraph for the full three
       years. All Tier C, all skill-tagged, all role-tagged.

[NEW]  C → B Promotion Workflow
       CLI for promotion, review gate, automated coherence tests
       (per role, per scaffolding), promotion record schema.

--- review point ---
[REVISIT] R10-R13 with fresh eyes after RAG quality is real
```

### Defer

R10.1 / R10.2 / R10.3 (diagnostics + adaptive routing): explicitly blocked at every gate so far.
R11.1 / R11.2 (game and simulation content): lessen-team is in pilot on a single paragraph.
R12.1 / R12.2 / R12.3 (cockpit, privacy, accessibility): no student-facing surface queued.
R13.1 / R13.2 / R13.3 (AI tutor): blocked by every gate the team has closed.
R14.2 / R14.3 (evidence signals, continuous improvement): require deployment data that doesn't exist.
R8.2 (production QC gates): blocked on R9 — without owned-source ingestion, gates have nothing to check.

### Roadmap document hygiene

The "Immediate Next Sprint" section in `reference-team-roadmap.md` still names R7.4 as next while the ledger marks R7.4 completed. Fix this first — subagents make planning decisions against this section.

---

## The exercise schema design

### Three axes

Every exercise record carries these three fields independently. They are not collapsible into a single quality score.

**Authority** — strength of evidence that the exercise is correct and well-formed.
- `A` — CvTE exam item. Fixed. Cannot be promoted to or demoted from. Inherited authority from being an actual past-exam question.
- `B` — vetted exercise. Passed retrieval coherence tests against Tier A *for its role*, then human-reviewed.
- `C` — concept/draft exercise. Blueprint-generated or new-author. Not yet vetted.

Promotion is C → B only. Promotion is per-`(role, scaffolding)` combination, recorded permanently and reversibly. Demotion is allowed if curriculum changes invalidate prior promotion. Both automated coherence and human review are required for promotion — passing automated tests alone makes an exercise *eligible* for review, not promoted.

**Role** — what the exercise is for in the learning sequence.
- `exam_mirror` — directly tests an eindterm at the mastery level CvTE tests it.
- `prerequisite` — builds a needed prior. Lives on the prerequisite unit, not on the dependent unit. May or may not be exam-tested in its own right.
- `bridge` — connects two units, scaffolds across a needs-edge.
- `practice` — fluency at the unit's level. Right answer is what's evaluated.
- `diagnostic` — engineered to surface a specific misconception. Wrong answer is as informative as the right one. Distractors are deliberate.

A prerequisite exercise should NOT be evaluated by similarity to its dependent unit's exam items — it should be evaluated by similarity to the prerequisite *unit's* exam items, if any. The dependency graph keeps roles separated. This is why correct `needs` edges matter more than ever.

**Scaffolding** — how much support the exercise itself provides.
- `scaffolded` — full dual coding, hints, structured steps.
- `partial` — some support faded.
- `faded` — target difficulty without dual coding or hints.

Marcel's textbook practice uses fading sequences. The corpus should record where in the sequence each exercise sits. Coherence tests for `role: exam_mirror` should only run against `scaffolding: faded` versions, since exam items aren't scaffolded.

### What an exercise IS as an object

Working list of fields. Compare against the actual `exam-question.schema.json` (whatever its real path is) and `course-target-exercises.json` shape. Treat this as a sketch.

```json
{
  "$id": "exercise.schema.json",
  "type": "object",
  "required": ["id", "authority", "role", "scaffolding", "units", "stem", "source", "curriculum_version"],
  "properties": {
    "id": { "type": "string", "pattern": "^EX-[A-Z0-9-]+$" },

    "authority": {
      "type": "object",
      "required": ["tier"],
      "properties": {
        "tier": { "enum": ["A", "B", "C"] },
        "promotion_history": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "from_tier": { "enum": ["C", "B", null] },
              "to_tier": { "enum": ["B", "C"] },
              "at": { "type": "string", "format": "date-time" },
              "by": { "type": "string" },
              "automated_eval_ref": { "type": "string" },
              "human_review_ref": { "type": "string" },
              "reason": { "type": "string" }
            }
          }
        }
      }
    },

    "role": {
      "enum": ["exam_mirror", "prerequisite", "bridge", "practice", "diagnostic"]
    },

    "scaffolding": {
      "enum": ["scaffolded", "partial", "faded"]
    },

    "units": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["unit_id", "mastery"],
        "properties": {
          "unit_id": { "type": "string" },
          "mastery": { "enum": ["understand", "apply", "analyze", "evaluate"] }
        }
      }
    },

    "skills": {
      "type": "array",
      "description": "skill IDs from the governed skill registry",
      "items": { "type": "string", "pattern": "^SK-[a-z0-9-]+$" }
    },

    "operations": {
      "type": "array",
      "description": "ordered operations the student performs",
      "items": {
        "type": "object",
        "properties": {
          "op_id": { "type": "string", "pattern": "^OP-[a-z0-9-]+$" },
          "depends_on": { "type": "array", "items": { "type": "string" } }
        }
      }
    },

    "inputs": {
      "type": "array",
      "items": {
        "enum": ["text", "table", "graph", "news_clip", "dataset", "formula", "image", "video"]
      }
    },

    "procedure_refs": {
      "type": "array",
      "description": "which procedure(s) within the unit's procedure set this exercise rehearses",
      "items": { "type": "string" }
    },

    "composition_pattern_id": {
      "type": "string",
      "description": "ID from composition-patterns registry, if exercise instantiates a known pattern"
    },

    "expected_misconceptions": {
      "type": "array",
      "description": "links to misconception registry; empty until R10.1 lands",
      "items": { "type": "string" }
    },

    "stem": { "type": "string" },

    "answer_model": {
      "type": "object",
      "description": "answer schema for open-ended; correct option(s) for multiple choice"
    },

    "distractors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": { "type": "string" },
          "misconception_id": { "type": "string" }
        }
      }
    },

    "modality": {
      "type": "object",
      "properties": {
        "taught_modality": {
          "type": "string",
          "description": "the modality this exercise is taught at: explain | calculate | classify | evaluate | combine"
        },
        "tested_modality": {
          "type": "string",
          "description": "the modality CvTE actually tests this unit at"
        },
        "modality_mismatch": {
          "type": "boolean",
          "description": "computed: true if taught and tested differ for the engaged unit"
        }
      }
    },

    "source": {
      "type": "object",
      "required": ["kind"],
      "properties": {
        "kind": { "enum": ["cvte_exam", "blueprint_concept", "authored", "imported"] },
        "year": { "type": "integer" },
        "exam_paper": { "type": "string" },
        "item_number": { "type": "string" },
        "page_ref": { "type": "string" }
      }
    },

    "curriculum_version": { "type": "string" },

    "evidence_anchors": {
      "type": "array",
      "items": { "type": "string" }
    },

    "status": {
      "enum": ["concept_draft", "active", "deprecated", "rejected"]
    }
  }
}
```

### Skill registry sketch

The single highest-leverage missing piece. Today `references/authored/skill-categories.md` is a markdown document. It needs to become a governed JSON registry analogous to `begrippen.json`, with CLI mutations and a validator. Without this, `required_skills` on exam questions is free-form strings — not safely queryable, not validated, prone to near-duplicate drift.

```json
{
  "$id": "skill.schema.json",
  "type": "object",
  "required": ["id", "name", "category", "definition"],
  "properties": {
    "id": { "type": "string", "pattern": "^SK-[a-z0-9-]+$" },
    "name": { "type": "string" },
    "category": {
      "enum": ["economics", "math", "language", "graphical", "tabular", "reasoning"]
    },
    "definition": { "type": "string" },
    "examples": { "type": "array", "items": { "type": "string" } },
    "common_pitfalls": { "type": "array", "items": { "type": "string" } },
    "related_units": { "type": "array", "items": { "type": "string" } },
    "related_terms": { "type": "array", "items": { "type": "string" } },
    "supersedes": { "type": "array", "items": { "type": "string" } }
  }
}
```

### Operations registry sketch

When an exam item is decomposed, the *steps* the student performs are operations. Smaller than skills, more granular. "Read row from table" is an operation; "interpret a table" is a skill (a class of operations).

```json
{
  "$id": "operation.schema.json",
  "type": "object",
  "required": ["id", "name", "category"],
  "properties": {
    "id": { "type": "string", "pattern": "^OP-[a-z0-9-]+$" },
    "name": { "type": "string" },
    "category": {
      "enum": ["read", "compute", "classify", "explain", "predict", "evaluate", "compose"]
    },
    "parent_skill": { "type": "string", "description": "SK-... ID this op belongs to" },
    "definition": { "type": "string" }
  }
}
```

You may decide one combined registry (skills with operations as sub-records) is cleaner than two. Marcel's view is open here — pick whichever fits the existing `begrippen.json` pattern best.

### Composition pattern sketch

Recurring CvTE composition patterns are themselves recordable. "Table-reading + elasticity-calculation + classification" appears across many exam items. Recording the pattern as an object enables:
- exercise generation that deliberately produces items at known patterns
- coverage analysis: which patterns are well-covered vs. thin
- promotion criteria that say "Tier C exercise for pattern CP-elasticity-calc-classify must be coherent with Tier A items at the same pattern"

```json
{
  "$id": "composition-pattern.schema.json",
  "type": "object",
  "required": ["id", "name", "skills", "exemplar_exam_items"],
  "properties": {
    "id": { "type": "string", "pattern": "^CP-[a-z0-9-]+$" },
    "name": { "type": "string" },
    "skills": { "type": "array", "items": { "type": "string" } },
    "operation_sequence": {
      "type": "array",
      "items": { "type": "string" }
    },
    "exemplar_exam_items": { "type": "array", "items": { "type": "string" } },
    "frequency_in_exams": { "type": "integer" },
    "typical_inputs": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

---

## First task: schema audit

Before drafting any sprint, produce a one-page audit table. This is the artifact that lets us know what's really there vs. what we're imagining. Without it, planning happens in the dark.

For each of these schemas/files, record: field name, type, required-or-not, validated-against-what, currently-populated-coverage (% of records with the field non-empty).

- `references/schemas/exam-question.schema.json` (or wherever the schema lives)
- `references/schemas/unit.schema.json`
- `references/schemas/term.schema.json`
- `references/schemas/evidence-anchor.schema.json`
- `references/schemas/alignment-edge.schema.json`
- `references/schemas/chunk.schema.json`
- `references/external/exam-questions.json` — sample 5 records, document actual shape
- `references/authored/course-target-exercises.json` — sample 5 records, document actual shape
- `references/authored/skill-categories.md` — document current structure (probably free prose)
- `references/machine/micro-teaching-units.json` — sample 5 units, confirm current fields
- `references/machine/begrippen.json` — sample 5 terms, confirm current fields

Then produce a gap table comparing the audit against the v2 exercise schema sketch above. Rows where the field exists today: keep. Rows where the field is missing: list as work. Rows where this handoff is wrong about what the system needs: flag and explain.

This audit is the input to every sprint plan that follows.

---

## Contextual knowledge for judgment calls

### Discipline norms (preserve these)

- All mutations to `references/machine/` and `references/external/` go through CLI scripts in `build-scripts/references/`. Never hand-edit.
- Every sprint has plan, baseline, execute, verify, review-gate-if-needed, deterministic bundle check, commit, tag.
- Subagents propose, humans decide on pedagogy, validators enforce mechanical completeness, git records state.
- Generated reports are diagnostic, not primary evidence.
- Evidence hierarchy: real CvTE exam questions > target exercises > machine registries > syllabus (grouping only) > authored judgement > generated reports.

### Marcel's design philosophy (informs judgment calls)

- **Exercises are the main unit.** Stating lesson goals abstractly loses information. A single exam item decomposes into table-reading, percentage-change calculation, formula application, classification, and explanation — all separable, all trainable in isolation. The corpus must be able to retrieve at any of these granularities.
- **Target exercises are stronger evidence than syllabus prose.** Don't mint units from syllabus text. Mint units from real exercises that demand them.
- **Dual-coding fade.** Within every lesson: simple-with-full-dual-coding → target-with-dual-coding → target-without-dual-coding. The scaffolding axis on exercises captures this.
- **Conceptual sequencing matters.** Total revenue must precede marginal revenue. Sequencing errors at the blueprint stage propagate.
- **Mathematical and graphical accuracy must be verified rigorously.** Precision errors in well-scaffolded material are especially damaging — students learn the error effectively.
- **Reusability and colleague handoff.** Designs are built for repeatability and for colleagues to use, not one-off.

### The concept blueprint logic

Marcel's argument: extending the blueprint from one year to all three as a *concept* (not final) gives RAG more target-exercise evidence to work with — especially in macro, international, and analyze/evaluate territory where the catalog is thin. Concept blueprint feeds RAG; mature RAG enables blueprint finalization. This is a virtuous loop. Trying to finalize the blueprint before RAG is mature inverts it.

Tag concept status everywhere. Once a draft blueprint exists, people will cite it as fact. Sequencing claims (where does this fit in year 2) are weaker than content claims (this exercise tests this skill at this level). Tag them with different epistemic weight.

Build the extension in two passes: skeleton first (structure, units, no exercises), then exercises. The skeleton reveals unit coverage gaps cheaply.

### The lessen-team status

The lesson repo (`4veco-lessen`) is producing the very content that should feed RAG, but the ingestion path doesn't exist yet. This is R9.1/R9.2 work. The lesson repo's paragraph markdown files (`-paragraaf.md`, `-opgaven.md`, `-antwoorden.md`) are NOT registered exercise objects today. Treat the entire lesson repo as generated student-facing output; authoring and build logic live in `4veco-platform`.

The companion pipeline (uitleg voorkennis, vaardigheden, begeleide inoefening, instapquiz, games) is in pilot stage on paragraph 1.1.1 only. Do not assume completeness elsewhere.

---

## Open questions for your judgment

These came up in the conversation but were not resolved:

1. **Is `course-target-exercises.json` formally schematized today, or is it lighter-weight?** The R4.3 triage suggests *some* structure (84 flags processed and categorized) but unclear if records are per-exercise or per-paragraph-grouping. Read the file. Decide.

2. **Should skills and operations be one combined registry or two?** Conceptually they're at different granularity. Practically, `begrippen.json` is one file. Pick whichever pattern the team's discipline absorbs better.

3. **Does the exam-questions schema already have fields close to what we're calling skills/operations/composition?** If so, naming alignment matters — don't introduce parallel vocabularies. If not, this is greenfield.

4. **Where does the misconception registry live?** R10.1 (planned) is supposed to model misconceptions. But diagnostic exercises need misconception IDs *now*. Decision: stub it out as a small registry that R10.1 will later formalize, or wait. Marcel's discipline pattern would say stub it minimally and let R10.1 formalize.

5. **Is curriculum versioning (R14.1) really needed before C→B promotion can run?** The argument: a Tier C exercise tied to syllabus 2026-v2 can't be promoted on the strength of an older Tier A item where the eindterm was scoped differently. Verify against the actual syllabus history. If 2026-v2 is the only version in use, R14.1 can wait.

6. **The B/E domain imbalance (B=2, E=7).** Investigate whether this is by design, content moved to other domains, or a real coverage gap. Not a blocker for RAG quality work, but worth surfacing as a quality issue.

7. **R7.4 is closed but the roadmap doc still names it as "Immediate Next Sprint."** Fix the doc as a five-minute first action.

---

## Suggested first sprint sequence

After the schema audit, draft sprint plans in this order. Each follows the team's normal sprint contract: plan, operationalized procedure, baseline, allowed/forbidden paths, acceptance tests, result report, diff summary, completion status, deterministic bundle check.

1. **Sprint: Schema Audit + Roadmap Hygiene** — produce the audit table and fix the R7.4 documentation drift.
2. **Sprint: Skill Registry Promotion** — `skill-categories.md` → governed registry with CLI, validator, review gate.
3. **Sprint: Authority + Role + Scaffolding Schema Extension** — extend exercise schemas with the three axes; backfill external/exam-questions.json with `authority: A`.
4. **Sprint: Operations Registry + Composition Pattern Registry** — small registries, may be combined depending on judgment in open question #2.
5. **Sprint: Exam Item Decomposition Backfill** — for every Tier A exam question, attach skills, operations, composition pattern.
6. **Sprint: Owned Source Registry (R9.1)** — register lesson markdown and concept blueprint as source surfaces. Distinguish exposition from evidence.
7. **Sprint: Concept Blueprint Extension Pass 1** — three-year skeleton, marked draft, no exercises yet.
8. **Sprint: Content Graph Projection (R9.2)** — projection edges separate from evidence edges; skill→exercise edges added.
9. **Sprint: Retrieval Eval Expansion + Anchor Backfill** — eval set 10 → 50+; anchors 15 → 50+; first batch of human-approved graph edges.
10. **Sprint: Curriculum Versioning (R14.1)** — minimal viable version registry.
11. **Sprint: Concept Blueprint Extension Pass 2** — target exercises per paragraph, all Tier C, all skill-tagged, all role-tagged.
12. **Sprint: C → B Promotion Workflow** — CLI + review gate + automated coherence tests per (role, scaffolding).

After sprint 12, RAG quality should be substantially improved. At that point revisit R10–R13 with fresh evaluation evidence rather than the current speculative roadmap.

---

## What this handoff is NOT

- Not a directive. The team's discipline is plan, review, gate, validate. Follow it.
- Not exhaustive. The schema sketches are illustrative starting points, not specs.
- Not blind to what's already there. The audit task exists precisely to ground every subsequent decision in actual repository state.
- Not a substitute for the existing roadmap document. Update the roadmap; don't replace the conversation that produced it.

If something in this handoff is wrong because the repository says otherwise, trust the repository. Flag the contradiction in the audit and adjust.

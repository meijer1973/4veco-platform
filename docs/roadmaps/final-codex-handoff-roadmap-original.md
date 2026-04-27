# 4veco-platform Reference/Data System — Final Codex Handoff Roadmap

**Purpose:** Convert the `4veco-platform` reference folder from a well-organized reference corpus into a full machine-executable educational data system that can support books, diagnostics, retrieval/RAG, feedback, simulations, games, teacher views, and later bounded AI.

**Audience:** Codex agent and developer team.

**Status:** This roadmap consolidates the earlier reference-system roadmap, the partial empty-`needs` audit, the machine-executable sprint protocol, the review-gate model, and the future learning-platform framework.

---

## 0. Executive summary

The reference folder should become the platform’s governed educational knowledge base.

The target is not merely “add RAG.” The target is:

```text
owned book/source material
→ machine-readable reference data
→ evidence anchors
→ alignment graph
→ JSON-first reports
→ retrieval/RAG layer
→ diagnostics and feedback
→ simulations/games
→ teacher cockpit
→ bounded AI
→ evidence-driven improvement
```

The next work should proceed in rollback-safe sprints. Each sprint must start with a committed plan, record a baseline, execute in small commits, verify against the plan, and end with a result report and checkpoint.

A key early addition is the **full empty-`needs` / prior-knowledge audit**. A previous partial audit reviewed only the units visible from a fetched excerpt, mainly `A01`–`A05` and `A16`–`A18`. It was useful as a warning signal but **not complete**. The real sprint must rerun the audit over the full current `references/machine/micro-teaching-units.json`.

Do **not** proceed directly to RAG or adaptive diagnostics before the unit graph has passed prerequisite-integrity review.

---

## 1. Current known source context

The previous repository review established these working assumptions from the repository files:

- `RESEARCH_AGENT_MAP.md` defines the reference folder structure, evidence hierarchy, layer semantics, task routing, and output constraints.
- `references/reference-team-roadmap.md` contains current catalog metrics, including the fact that many live units have empty `needs`, current unit/term/exam coverage, and target-exercise backlog.
- `references/machine/README.md` states that machine references are not to be hand-edited and that changes should flow through reference CLI scripts.
- `build-scripts/references/README.md` documents the intended reference CLI contract, but the implementation was earlier described as incomplete or not yet built.
- `references/external/README.md` treats external sources as mirrored outside authority and refresh-only.
- `references/qc-prompts/README.md` describes a manual QC prompt system that is versioned but not yet fully routine/CI-integrated.

Codex should reread the current files before acting. This roadmap is a plan, not a substitute for checking current repository state.

---

## 2. Non-negotiable operating rules

### 2.1 No unplanned edits

No sprint may begin without a committed sprint plan.

Every sprint creates:

```text
docs/sprints/<sprint-id>-plan.md
reports/sprints/<sprint-id>-baseline.md
reports/sprints/<sprint-id>-result.md
reports/sprints/<sprint-id>-diff-summary.md
```

If the sprint affects machine-readable reference data, also create:

```text
references/data/sprints/<sprint-id>.plan.json
references/data/sprints/<sprint-id>.result.json
```

### 2.2 No hand editing of protected surfaces

Treat these as read-only except through validated refresh or CLI workflows:

```text
references/machine/
references/external/
```

Machine data changes must flow through scripts once implemented. Before the scripts exist, produce reports and plans only; do not hand-edit machine registries.

### 2.3 JSON-first machine data

Use this layered source-of-truth rule:

```text
Authored book/source layer:
  canonical for student-facing explanation and didactic prose.

Reference JSON layer:
  canonical for machine-readable structure, metadata, IDs, dependencies,
  evidence anchors, alignment graph, reports, retrieval, diagnostics, and QC.

Generated projections:
  Markdown, HTML, EPUB, PDF, worksheets, dashboards, and site pages.

External sources:
  canonical for outside authority: CvTE exams, syllabus, inspection, school standards.

Authored judgement:
  expert layer; useful but weaker than external/exam evidence where factual alignment matters.
```

### 2.4 No RAG before provenance

Do not build vector search or AI retrieval before these exist:

```text
schemas
source manifest
document inventory
prior-knowledge audit
validated unit graph
evidence anchors
alignment graph
JSON-first reports
retrieval eval set
```

### 2.5 Subagents triage, humans decide

Agnostic subagents may identify issues and recommend actions. They cannot close pedagogical, diagnostic, AI, or deployment gates. Human review or explicit owner sign-off is required for those gates.

---

## 3. Sprint lifecycle

Every sprint follows:

```text
1. Plan
2. Baseline test
3. Execute in small commits
4. Verify against the plan
5. Commit final state and tag/checkpoint
```

### 3.1 Branching

Use one branch per sprint:

```bash
git checkout -b refsys/<sprint-id>-<short-name>
```

### 3.2 Plan commit

```bash
git add docs/sprints/<sprint-id>-plan.md references/data/sprints/<sprint-id>.plan.json
git commit -m "plan(<sprint-id>): define sprint scope and acceptance tests"
```

### 3.3 Baseline commit

```bash
node build-scripts/references/validate-all.js > reports/sprints/<sprint-id>-baseline.md
git add reports/sprints/<sprint-id>-baseline.md
git commit -m "test(<sprint-id>): record baseline validation"
```

If `validate-all.js` does not exist yet, the sprint must either create it or record the missing script as part of the baseline.

### 3.4 Logical commits

Commit after each logical subtask:

```bash
git commit -m "feat(<sprint-id>): add source manifest schema"
git commit -m "test(<sprint-id>): add manifest validation cases"
git commit -m "data(<sprint-id>): generate baseline source manifest"
```

### 3.5 Close sprint

```bash
git add reports/sprints/<sprint-id>-result.md reports/sprints/<sprint-id>-diff-summary.md
git commit -m "close(<sprint-id>): record results and verification"
git tag refsprint-<sprint-id>-complete
```

Do not merge failed sprint branches into `main`.

---

## 4. Sprint artifact templates

### 4.1 Sprint plan template

```markdown
# Sprint <sprint-id>: <name>

## Goal

One paragraph.

## Context

Why this sprint exists.

## Allowed paths

- `references/...`
- `build-scripts/...`
- `reports/...`

## Forbidden paths

- paths that must not be changed

## Inputs

- source files
- prior reports
- roadmap references

## Outputs

- files to create or update

## Acceptance tests

| Test | Command or check | Expected result |
|---|---|---|

## Rollback plan

- branch name
- checkpoint commits
- generated files that can be deleted/regenerated
- files requiring human review before rollback

## Human review required

- yes/no
- reviewer role
- unresolved questions
```

### 4.2 Sprint result template

```markdown
# Sprint <sprint-id>: Result

## Plan reference

`docs/sprints/<sprint-id>-plan.md`

## Summary

Done / partial / failed.

## Acceptance test results

| Test | Expected | Actual | Pass/fail | Evidence |
|---|---|---|---|---|

## Changed files

Generated from `git diff --name-only`.

## Data integrity notes

Any schema, validation, source-of-truth, or generated/manual issues.

## Open follow-ups

Each follow-up gets an issue ID or roadmap entry.

## Rollback instructions

Exact commit or tag to revert to.
```

---

## 5. Target architecture

Recommended directory direction:

```text
references/
  external/
    ... canonical outside sources
  authored/
    ... human-authored judgement sources
  machine/
    units.json
    terms.json
    exam_questions.json
    target_exercises.json
    alignments.jsonl
  schemas/
    unit.schema.json
    term.schema.json
    exam-question.schema.json
    target-exercise.schema.json
    syllabus-code.schema.json
    source-document.schema.json
    evidence-anchor.schema.json
    claim.schema.json
    alignment-edge.schema.json
    quality-issue.schema.json
    report.schema.json
    rag-chunk.schema.json
    feedback.schema.json
    misconception.schema.json
    worked-example.schema.json
    game-item.schema.json
    simulation.schema.json
  data/
    source_manifest.json
    document_inventory.json
    sprints/
    audits/
    evidence/
      evidence-anchors.jsonl
    extracted/
      alignment_edges.jsonl
      claims/
      entities/
    rag/
      chunk_index.jsonl
      retrieval_eval_set.json
      retrieval_eval_results.json
    review-gates/
    views/
      unit_catalog_view.json
      term_catalog_view.json
      exam_alignment_view.json
      coverage_view.json
      roadmap_issue_view.json
  reports/
    markdown/
    json/
    qc/
    review-gates/
    reference-audits/
    sprints/
```

The exact folder names can change, but the layers must exist.

---

## 6. Core data objects

### 6.1 SourceDocument

```json
{
  "document_id": "cvte_vwo_2025_tv1_opgaven",
  "path": "references/external/exams/vw-1022-a-25-1-o.pdf",
  "source_type": "exam_pdf",
  "authority_level": "external_primary",
  "publisher": "CvTE",
  "year": 2025,
  "status": "current",
  "refresh_policy": "external_refresh_only"
}
```

### 6.2 EvidenceAnchor

```json
{
  "evidence_id": "ev_2025_vwo_tv1_q2_skillA15",
  "source_path": "references/external/exams/vw-1022-a-25-1-o.pdf",
  "document_id": "cvte_vwo_2025_tv1_opgaven",
  "locator": {
    "page": 4,
    "question": "2"
  },
  "excerpt": "Bereken de prijselasticiteit van de vraag...",
  "extraction_method": "manual",
  "confidence": "high"
}
```

An evidence anchor is the smallest unit of proof in the system. A claim without an evidence anchor should not become authoritative.

### 6.3 Claim

```json
{
  "claim_id": "claim_...",
  "claim_type": "exam_requires_skill",
  "subject_id": "exam_question:vwo_2025_tv1_q2",
  "object_id": "unit:A15",
  "evidence_ids": ["ev_2025_vwo_tv1_q2_skillA15"],
  "status": "verified"
}
```

### 6.4 AlignmentEdge

```json
{
  "edge_id": "edge_...",
  "from": "exam_question:vwo_2025_tv1_q2",
  "to": "unit:A15",
  "relation": "requires_skill",
  "evidence_ids": ["ev_2025_vwo_tv1_q2_skillA15"],
  "strength": "primary",
  "review_status": "verified"
}
```

### 6.5 RetrievalChunk

```json
{
  "chunk_id": "chunk_...",
  "source_path": "references/machine/micro-teaching-units.json",
  "source_type": "machine_unit",
  "authority_level": "machine_registry",
  "entity_ids": ["unit:A15"],
  "evidence_ids": [],
  "allowed_for_public_citation": false,
  "text": "..."
}
```

### 6.6 Unit prior-knowledge extension

```json
{
  "needs": [],
  "assumed_prior_knowledge": [],
  "zero_needs_status": "true_zero | underbouw_assumed | false_zero | ambiguous | not_reviewed",
  "zero_needs_review": {
    "reviewed_on": "YYYY-MM-DD",
    "reviewer": "string",
    "rationale": "string",
    "recommended_needs": [],
    "severity": "low | medium | high"
  }
}
```

Definitions:

```text
needs:
  internal platform prerequisites.

assumed_prior_knowledge:
  lower-secondary or general knowledge expected before VWO 4 economics.

zero_needs_status:
  review classification for units whose needs are empty.

zero_needs_review:
  rationale and governance record.
```

---

## 7. Review-gate model

Use three layers:

```text
1. Agnostic subagent review
2. Adaptive human review interview
3. Formal gate closure record
```

### 7.1 Subagents

Subagents should triage and identify patterns. They should not close gates.

For the empty-`needs` gate, run at least:

```text
Subagent 1: pedagogical prerequisite auditor
Subagent 2: data integrity auditor
Subagent 3: evidence auditor
```

Subagent output format:

```json
{
  "gate_id": "GATE-R2-empty-needs",
  "reviewer": "subagent-pedagogy-01",
  "entity_id": "unit:A17",
  "finding_type": "hidden_prerequisite",
  "severity": "high",
  "current_state": {
    "needs": [],
    "zero_needs_status": "not_reviewed"
  },
  "recommended_decision": "false_zero",
  "recommended_needs": ["A15"],
  "rationale": "Inkomenselasticiteit assumes elasticity as a ratio of percentage changes and interpretation of sign/magnitude.",
  "evidence_paths": [
    "references/machine/micro-teaching-units.json"
  ],
  "human_question": "Should A17 depend directly on A15, or should the team create a shared elasticity-foundation unit?",
  "confidence": "medium"
}
```

### 7.2 Adaptive human interview

Do not ask humans to fill out a massive Markdown form. The interviewer agent should run an interactive review.

Process:

```text
1. Prepare review packet.
2. Ask about 10 calibration questions.
3. Analyze answer patterns.
4. Decide whether to continue, narrow, pause, or rerun work.
5. Ask targeted follow-ups or batch-confirm rules.
6. Summarize closure proposal.
7. Human confirms.
8. Write Markdown + JSON gate records.
```

After about 10 questions, the interviewer agent should choose one of:

```text
continue_targeted
batch_confirm_low_risk
pause_for_missing_evidence
rerun_audit_with_revised_rubric
schema_change_required
propose_gate_closure
```

### 7.3 Human interview question examples

Classification question:

```text
Unit A17 — Inkomenselasticiteit

Current:
needs: []

Subagent recommendation:
false_zero; add prerequisite A15 or a shared elasticity foundation.

Question:
For a typical VWO 4 student, what is the best classification?

A. true_zero — can be taught without prior platform knowledge
B. underbouw_assumed — no platform prerequisite, but prior math/general knowledge needed
C. false_zero — should have an internal prerequisite
D. ambiguous — needs more review
E. cannot decide without seeing evidence
```

Pattern question:

```text
I see you are treating several algebraic manipulation cases as assumed lower-secondary knowledge rather than internal platform prerequisites.

Should we apply this as a general rule?

A. Yes
B. Yes, but only for simple one-step algebra
C. No
D. Needs more nuance
```

Closure confirmation:

```text
I am about to record gate status: pass_with_conditions.

Conditions:
1. Apply accepted false_zero corrections through CLI.
2. Create a separate issue for a possible elasticity foundation unit.
3. Keep five ambiguous graph-reading units in review.

Do you approve this closure record?

A. Approve
B. Approve with edit
C. Do not approve
```

### 7.4 Gate statuses

```text
pass
pass_with_conditions
hold
fail
```

### 7.5 Gate closure JSON

```json
{
  "gate_id": "GATE-R2-empty-needs",
  "sprint_id": "R2.2",
  "status": "pass_with_conditions",
  "reviewed_on": "YYYY-MM-DD",
  "human_reviewers": [
    {
      "role": "VWO economics teacher",
      "name": "redacted-or-initials"
    }
  ],
  "subagent_reviews": [
    "reports/review-gates/GATE-R2/subagent-pedagogy.json",
    "reports/review-gates/GATE-R2/subagent-data-integrity.json",
    "reports/review-gates/GATE-R2/subagent-evidence.json"
  ],
  "human_interview": "reports/review-gates/GATE-R2/human-interview.md",
  "decisions": [],
  "conditions": [],
  "allowed_next_sprints": ["R3.1"],
  "blocked_next_sprints": ["R3.2"]
}
```

### 7.6 Gate validator

Create:

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/<gate-id>/gate-closure.json
```

It checks:

```text
gate_id exists
sprint_id exists
required artifacts exist
subagent reviews exist if required
human interview exists if required
status is valid
conditions are explicit
allowed_next_sprints are listed
blocked_next_sprints are listed
decision owner is recorded
```

---

## 8. Roadmap phases and sprints

The phases below are ordered. Do not jump to later phases until their prerequisites have passed.

---

# Phase R0 — Governance and sprint machinery

## Sprint R0.1 — Sprint execution scaffold

**Purpose:** Add sprint plan/result discipline before touching reference data.

**Allowed paths**

```text
docs/sprints/
reports/sprints/
references/data/sprints/
build-scripts/sprints/
```

**Tasks**

1. Create sprint plan and result templates.
2. Create `build-scripts/sprints/check-sprint-plan.js`.
3. Create `build-scripts/sprints/check-sprint-result.js`.
4. Add a script that verifies every sprint result maps to a sprint plan.
5. Add commit/tag instructions to `docs/sprints/README.md`.

**Acceptance tests**

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/example-plan.md
node build-scripts/sprints/check-sprint-result.js reports/sprints/example-result.md
```

**Done when**

The repo can mechanically verify that a sprint has:

```text
plan
declared scope
acceptance tests
result report
rollback instructions
```

---

## Sprint R0.2 — Reference baseline inventory

**Purpose:** Create a complete file inventory before changing schemas or data.

**Tasks**

1. Inventory:
   - `references/external/`
   - `references/authored/`
   - `references/machine/`
   - `references/qc-prompts/`
   - `reports/`
   - `build-scripts/references/`
   - `build-scripts/reports/`

2. Create:

```text
references/data/source_manifest.json
references/data/document_inventory.json
```

3. For each file, record:
   - path;
   - layer;
   - authority level;
   - source type;
   - generated/manual status;
   - edit policy;
   - owner;
   - refresh policy;
   - downstream dependencies.

**Acceptance tests**

```bash
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
```

**Done when**

Every file under `references/` is represented in a manifest, and generated/manual status is explicit.

---

# Phase R1 — Source of truth and schemas

## Sprint R1.1 — Source-of-truth decision

**Purpose:** Remove ambiguity about canonical data.

**Tasks**

1. Create:

```text
references/SOURCE_OF_TRUTH.md
```

2. Record the layered canon rule:

```text
Book source = canonical for student-facing exposition.
JSON = canonical for machine-readable structure.
Markdown/HTML/EPUB/PDF/site = generated projections.
External source files = canonical outside authority.
```

3. Classify each existing file:
   - canonical JSON;
   - generated Markdown;
   - external authority;
   - authored judgement;
   - generated report;
   - legacy pending migration.

4. Record exceptions.

**Acceptance tests**

```bash
node build-scripts/references/check-source-of-truth.js
```

**Done when**

No machine registry has unclear canonical/projection status.

---

## Sprint R1.2 — Core JSON schemas

**Purpose:** Define the machine contract before rewriting data.

**Tasks**

Create schemas:

```text
references/schemas/unit.schema.json
references/schemas/term.schema.json
references/schemas/exam-question.schema.json
references/schemas/target-exercise.schema.json
references/schemas/syllabus-code.schema.json
references/schemas/source-document.schema.json
references/schemas/evidence-anchor.schema.json
references/schemas/claim.schema.json
references/schemas/alignment-edge.schema.json
references/schemas/quality-issue.schema.json
references/schemas/report.schema.json
references/schemas/rag-chunk.schema.json
```

**Acceptance tests**

```bash
node build-scripts/references/validate-schemas.js
```

**Done when**

Every current JSON file either validates against a schema or is explicitly marked as legacy/unmigrated.

---

## Sprint R1.3 — Unit prior-knowledge schema extension

**Purpose:** Prepare the data model for the empty-`needs` audit.

**Tasks**

Extend the unit schema with:

```json
{
  "assumed_prior_knowledge": [],
  "zero_needs_status": "true_zero | underbouw_assumed | false_zero | ambiguous | not_reviewed",
  "zero_needs_review": {
    "reviewed_on": "YYYY-MM-DD",
    "reviewer": "string",
    "rationale": "string",
    "recommended_needs": [],
    "severity": "low | medium | high"
  }
}
```

**Acceptance tests**

```bash
node build-scripts/references/validate-units.js
```

Expected behavior:

```text
units without prior-knowledge review are allowed temporarily only if zero_needs_status = not_reviewed
units with needs: [] must eventually have non-not_reviewed status
invalid recommended_needs IDs fail validation
```

**Done when**

The schema can distinguish:

```text
true zero prerequisite
underbouw-assumed
false zero
ambiguous
```

---

# Phase R2 — Full empty-`needs` and prior-knowledge audit

This is an early critical phase. Do not proceed to diagnostics, RAG, or graph-based adaptation before this phase is complete.

## Sprint R2.1 — Full empty-`needs` audit, non-mutating

**Purpose:** Rerun and complete the earlier partial audit over the full current registry.

**Important note**

The previous audit was partial. It reviewed only the units visible from a fetched excerpt. This sprint must rerun the audit from the full current:

```text
references/machine/micro-teaching-units.json
```

**Inputs**

```text
references/machine/micro-teaching-units.json
references/machine/micro-teaching-units.md
references/machine/begrippen.json
references/external/exam-questions.json
references/authored/course-target-exercises.json
reports/needs-coverage.md
reports/dag-integrity.md
```

**Tasks**

1. Extract all live units with:

```js
!unit.deprecated && Array.isArray(unit.needs) && unit.needs.length === 0
```

2. For each unit, classify:

```text
true_zero
underbouw_assumed
false_zero
ambiguous
```

3. For each unit, record:
   - current `needs`;
   - recommended `needs`;
   - assumed prior knowledge;
   - rationale;
   - teacher trap;
   - severity;
   - whether target exercise or exam evidence supports the unit;
   - whether a new prerequisite unit is needed.

4. Create:

```text
reports/reference-audits/empty-needs-audit.md
references/data/audits/empty-needs-audit.json
```

5. Mark the earlier partial audit as historical seed material only.

**Acceptance tests**

```bash
node build-scripts/references/run-empty-needs-audit.js --check-only
node build-scripts/references/validate-empty-needs-audit.js references/data/audits/empty-needs-audit.json
```

**Done when**

```text
all live empty-needs units are classified
every false_zero unit has recommended prerequisite edges
every underbouw_assumed unit has explicit assumed prior knowledge
every ambiguous unit has a human-review note
no machine registry data has been changed yet
```

---

## Sprint R2.2 — Subagent review of empty-`needs` audit

**Purpose:** Catch major mistakes before human review.

**Tasks**

Run independent agnostic subagents:

```text
pedagogical prerequisite auditor
data integrity auditor
evidence auditor
```

Each reviews:

```text
all false_zero units
all ambiguous units
all high-severity underbouw_assumed units
random sample of true_zero units
random sample of apparently clean underbouw_assumed units
```

**Outputs**

```text
reports/review-gates/GATE-R2-empty-needs/subagent-pedagogy.json
reports/review-gates/GATE-R2-empty-needs/subagent-data-integrity.json
reports/review-gates/GATE-R2-empty-needs/subagent-evidence.json
reports/review-gates/GATE-R2-empty-needs/subagent-summary.md
reports/review-gates/GATE-R2-empty-needs/subagent-findings.json
```

**Acceptance tests**

```bash
node build-scripts/review-gates/validate-subagent-findings.js reports/review-gates/GATE-R2-empty-needs/subagent-findings.json
```

**Done when**

All high-risk audit items have at least one subagent review and subagent disagreements are visible.

---

## Sprint R2.3 — Adaptive human interview and gate closure

**Purpose:** Let a human reviewer make pedagogical decisions without filling a brittle Markdown form.

**Tasks**

1. Generate review packet:

```text
reports/review-gates/GATE-R2-empty-needs/review-packet.md
reports/review-gates/GATE-R2-empty-needs/review-packet.json
```

2. Run an adaptive interview:
   - start with about 10 questions;
   - ask multiple-choice plus short-rationale questions;
   - include high-risk, disagreement, ambiguous, and random clean samples;
   - analyze response patterns;
   - continue, batch-confirm, pause, or rerun as appropriate.

3. Create:

```text
reports/review-gates/GATE-R2-empty-needs/human-interview.md
reports/review-gates/GATE-R2-empty-needs/human-interview.json
reports/review-gates/GATE-R2-empty-needs/gate-closure.md
reports/review-gates/GATE-R2-empty-needs/gate-closure.json
```

**Possible gate outcomes**

```text
pass
pass_with_conditions
hold
fail
```

**Acceptance tests**

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-R2-empty-needs/gate-closure.json
```

**Done when**

The gate closure explicitly allows or blocks downstream sprints.

---

# Phase R3 — Mutation pipeline and validated edits

## Sprint R3.1 — Minimal reference CLI implementation

**Purpose:** Implement the mutation workflow promised by the machine-reference policy.

**Tasks**

Implement or verify:

```text
build-scripts/references/unit-update.js
build-scripts/references/unit-add-dep.js
build-scripts/references/unit-remove-dep.js
build-scripts/references/unit-deprecate.js
build-scripts/references/term-update.js
build-scripts/references/validate-all.js
build-scripts/references/build-unit-index.js
build-scripts/references/build-begrippen-index.js
```

Each command must support:

```bash
--spec '<JSON>'
--dry-run
--check
```

**Acceptance tests**

```bash
node build-scripts/references/validate-all.js
node build-scripts/references/unit-add-dep.js --dry-run --from A03 --to A02
```

**Done when**

```text
no machine-reference change requires hand editing
invalid dependency IDs fail
cycles fail
generated Markdown projections regenerate
failed commands leave the repo unchanged
```

---

## Sprint R3.2 — Apply empty-`needs` corrections through CLI

**Purpose:** Turn reviewed audit decisions into machine data.

**Prerequisite**

Gate `GATE-R2-empty-needs` must be `pass` or `pass_with_conditions`, and this sprint must be listed in `allowed_next_sprints`.

**Inputs**

```text
references/data/audits/empty-needs-audit.json
reports/review-gates/GATE-R2-empty-needs/gate-closure.json
```

**Tasks**

1. For each accepted `false_zero` unit:
   - add approved `needs` edges through CLI.
2. For each accepted `underbouw_assumed` unit:
   - add `assumed_prior_knowledge`;
   - set `zero_needs_status = "underbouw_assumed"`.
3. For each accepted `true_zero` unit:
   - set `zero_needs_status = "true_zero"`.
4. For unresolved `ambiguous` units:
   - set `zero_needs_status = "ambiguous"`;
   - preserve review rationale and next action.

**Acceptance tests**

```bash
node build-scripts/references/validate-all.js
node build-scripts/references/check-zero-needs-status.js
node build-scripts/reports/generate-needs-coverage.js
```

**Done when**

```text
all live needs: [] units have reviewed zero_needs_status
accepted false_zero cases no longer have empty needs
all changes are traceable to gate decision
needs-coverage report is regenerated
```

---

# Phase R4 — Broader reference data repair

## Sprint R4.1 — Unit-term slug migration

**Purpose:** Resolve drift between unit term references and `begrippen.json`.

**Tasks**

1. Build text-to-slug mapping.
2. Dry-run migration.
3. Produce uncertain mapping report.
4. Human-review uncertain mappings.
5. Apply accepted mappings through CLI.
6. Regenerate term reports.

**Acceptance tests**

```bash
node build-scripts/references/check-term-links.js
node build-scripts/reports/generate-terminology-drift.js
node build-scripts/reports/generate-begrippen-coverage.js
```

**Done when**

```text
validator rejects unknown term strings
unit term links use slug IDs
reverse links in begrippen regenerate correctly
```

---

## Sprint R4.2 — Exam-question extraction gap closure

**Purpose:** Improve exam alignment completeness.

**Tasks**

1. List missing required-skill links.
2. List missing exam-code links.
3. Verify against exam paper and correction model.
4. Add links through validated scripts.
5. Mark uncertain cases as `needs_human_review`.

**Acceptance tests**

```bash
node build-scripts/references/check-exam-question-links.js
node build-scripts/reports/generate-exam-coverage.js
```

**Done when**

```text
required-skill coverage reaches target or every exception is justified
exam-code coverage reaches target or every exception is justified
uncertain cases are explicit
```

---

## Sprint R4.3 — Blueprint missing-unit flag triage

**Purpose:** Convert raw target-exercise backlog into structured production signal.

**Tasks**

Classify every flag as:

```text
minted
duplicate
still_needed
defer
reject
needs_evidence
```

**Acceptance tests**

```bash
node build-scripts/references/check-target-exercise-flags.js
```

**Done when**

No raw missing-unit flag remains untriaged.

---

## Sprint R4.4 — Authored bucket migration classification

**Purpose:** Reduce legacy hand-maintained surfaces.

**Tasks**

For every file in `references/authored/`, classify:

```text
keep_authored
migrate_to_machine
migrate_to_external
deprecate
needs_split
```

**Outputs**

```text
references/data/audits/authored-bucket-classification.json
reports/reference-audits/authored-bucket-classification.md
```

**Acceptance tests**

```bash
node build-scripts/references/validate-authored-bucket-classification.js
```

**Done when**

Every authored file has a migration status and next action.

---

# Phase R5 — Evidence anchors and alignment graph

## Sprint R5.1 — Evidence-anchor layer

**Purpose:** Connect claims to exact source locations.

**Tasks**

Create:

```text
references/data/evidence/evidence-anchors.jsonl
```

Anchor types:

```text
exam_question_text
correction_model_fragment
syllabus_eindterm
target_exercise_requirement
authored_didactic_claim
inspection_or_school_standard
```

**Acceptance tests**

```bash
node build-scripts/references/validate-evidence-anchors.js
```

**Done when**

Every important unit-exam, unit-target-exercise, and term-definition claim can point to evidence or is marked `needs_review`.

---

## Sprint R5.2 — Alignment graph

**Purpose:** Turn the reference corpus into a graph.

Create:

```text
references/data/extracted/alignment_edges.jsonl
```

Relations:

```text
unit_requires_unit
unit_uses_term
unit_assumes_prior_knowledge
exam_question_requires_unit
exam_question_tests_eindterm
target_exercise_requires_unit
term_related_to_term
unit_supported_by_exam_question
unit_supported_by_target_exercise
quality_issue_affects_entity
```

**Acceptance tests**

```bash
node build-scripts/references/validate-alignment-graph.js
node build-scripts/references/check-alignment-cycles.js
```

**Done when**

Reports can consume the alignment graph instead of parsing individual source files ad hoc.

---

## Sprint R5.3 — Alignment graph review gate

**Purpose:** Prevent technically valid but pedagogically bad graph paths.

**Tasks**

1. Run graph subagents:
   - prerequisite-chain auditor;
   - evidence-link auditor;
   - graph-depth auditor.
2. Generate review packet.
3. Run adaptive human interview with economics reviewer.
4. Close gate.

**Outputs**

```text
reports/review-gates/GATE-R5-alignment-graph/*
```

**Acceptance tests**

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-R5-alignment-graph/gate-closure.json
```

**Done when**

The graph is approved for report and retrieval use, or blocked with conditions.

---

# Phase R6 — JSON-first reports and dashboard data

## Sprint R6.1 — JSON-first report generation

**Tasks**

For every current Markdown report, generate:

```text
reports/json/<report-name>.json
reports/markdown/<report-name>.md
```

At minimum:

```text
dag-integrity
terminology-drift
unresolved-refs
needs-coverage
terms-coverage
procedure-coverage
aspects-coverage
dead-units
begrippen-coverage
empty-needs-audit-summary
```

**Acceptance tests**

```bash
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
```

**Done when**

Markdown is a projection of JSON, not the only report artifact.

---

## Sprint R6.2 — Reference health dashboard

**Tasks**

Create:

```text
reports/json/reference-health.json
```

Include:

```text
unit counts
live/deprecated counts
empty-needs status distribution
prior-knowledge review status
term-link coverage
exam-question coverage
target-exercise triage status
unresolved refs
QC findings
schema validation status
retrieval evaluation status
```

**Acceptance tests**

```bash
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
```

**Done when**

The roadmap can quote one generated dashboard file as the current reference health state.

---

# Phase R7 — RAG and technical retrieval layer

## Sprint R7.1 — Deterministic chunk layer

**Tasks**

Create:

```text
references/data/rag/chunk_index.jsonl
```

Chunk source types:

```text
external_source
machine_unit
machine_term
exam_question
target_exercise
authored_reference
quality_report
alignment_edge
evidence_anchor
```

Every chunk must include:

```json
{
  "chunk_id": "string",
  "source_path": "string",
  "source_type": "string",
  "authority_level": "external_primary | machine_registry | authored_judgement | generated_report",
  "entity_ids": [],
  "evidence_ids": [],
  "allowed_for_public_citation": true,
  "text": "string"
}
```

**Acceptance tests**

```bash
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
```

**Done when**

Chunk generation is deterministic and source-ranked.

---

## Sprint R7.2 — Hybrid retrieval

**Tasks**

Implement retrieval using:

```text
lexical search
entity lookup
graph expansion
optional vector search
authority ranking
evidence-anchor filtering
```

**Acceptance tests**

```bash
node build-scripts/rag/query.js --unit A15
node build-scripts/rag/query.js --term prijselasticiteit_van_de_vraag
node build-scripts/rag/query.js --exam-code A2.5
```

**Done when**

A query can return:

```text
relevant chunks
entity IDs
evidence anchors
source authority
unresolved quality warnings
```

---

## Sprint R7.3 — Retrieval evaluation set

**Tasks**

Create:

```text
references/data/rag/retrieval_eval_set.json
references/data/rag/retrieval_eval_results.json
```

Include tests such as:

```text
Welke units ondersteunen prijselasticiteit?
Welke examenvragen testen producentensurplus?
Welke live units missen term links?
Welke units hebben lege needs maar zijn false_zero?
Welke target exercises hebben nog missing-unit flags?
Welke begrippen met formules missen pitfalls?
Welke deprecated units worden nog geciteerd?
```

**Acceptance tests**

```bash
node build-scripts/rag/run-retrieval-evals.js
```

**Done when**

RAG quality can regress or improve visibly across commits.

---

## Sprint R7.4 — RAG review gate

**Purpose:** Approve RAG for internal/teacher-facing use.

**Tasks**

1. Run retrieval auditors.
2. Sample high-risk queries.
3. Ensure evidence anchors are returned.
4. Ensure generated reports are not treated as primary evidence.
5. Close gate.

**Outputs**

```text
reports/review-gates/GATE-R7-rag/*
```

**Acceptance tests**

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-R7-rag/gate-closure.json
```

---

# Phase R8 — QC automation and production integration

## Sprint R8.1 — Structured QC outputs

The QC prompt system exists but is manual. Convert outputs into:

```text
reports/qc/qc-run-YYYY-MM-DD.json
reports/qc/qc-run-YYYY-MM-DD.md
reports/qc/SUMMARY.json
reports/qc/SUMMARY.md
```

**Acceptance tests**

```bash
node build-scripts/qc/validate-qc-run.js
```

**Done when**

QC findings are machine-readable and link to affected units, terms, or sources.

---

## Sprint R8.2 — Production guardrails

**Tasks**

Create checks for generated lesson or book material:

```text
every cited unit exists
every cited term exists
no deprecated unit is used without explicit exception
every new teaching goal maps to unit or target exercise
every proposed new unit has exam or target-exercise evidence
syllabus-only proposals are flagged as insufficient evidence
```

**Acceptance tests**

```bash
node build-scripts/production/check-reference-citations.js
```

**Done when**

Lesson production cannot silently drift from the reference system.

---

# Phase R9 — Book/source integration and content graph

This phase connects the data foundation to the future learning platform.

## Sprint R9.1 — Book source constitution

**Purpose:** Define how owned book material becomes structured source material.

**Tasks**

Create:

```text
docs/book-source-constitution.md
references/schemas/book-paragraph.schema.json
references/schemas/book-example.schema.json
references/schemas/book-exercise.schema.json
```

Define for every paragraph:

```text
concepts
unit IDs
terms
prerequisites
assumed prior knowledge
graph/formula
common misconception
exam relevance
game potential
assessment type
difficulty band
teacher notes
```

**Acceptance tests**

```bash
node build-scripts/book/validate-book-source.js
```

**Done when**

New authored book content can be connected to the reference graph.

---

## Sprint R9.2 — Book paragraph mapping pilot

**Purpose:** Pilot mapping one chapter or chapter slice to the reference data.

**Tasks**

1. Select one chapter/section.
2. Map paragraphs to:
   - units;
   - terms;
   - evidence anchors;
   - misconceptions;
   - exercises;
   - game/simulation potential.
3. Generate a mapping report.

**Outputs**

```text
references/data/book/book-mapping-pilot.json
reports/book/book-mapping-pilot.md
```

**Acceptance tests**

```bash
node build-scripts/book/validate-book-mapping.js
```

---

# Phase R10 — Pedagogical retrieval practice, diagnostics, and feedback

Do not start this phase until prerequisite integrity and alignment graph review are complete.

## Sprint R10.1 — Diagnostic item schema

Create schemas:

```text
references/schemas/diagnostic-item.schema.json
references/schemas/mastery-signal.schema.json
references/schemas/misconception.schema.json
```

Diagnostic categories:

```text
definition error
wrong context boundary
graph-reading error
formula manipulation error
causal reasoning error
average/marginal confusion
correlation/causation confusion
private/social costs confusion
short-run/long-run confusion
model assumption error
```

**Acceptance tests**

```bash
node build-scripts/diagnostics/validate-diagnostic-items.js
```

---

## Sprint R10.2 — Spaced retrieval practice queue model

Distinguish:

```text
pedagogical retrieval = students recall concepts over time
technical retrieval/RAG = system retrieves content/evidence
```

Create:

```text
references/schemas/retrieval-practice-item.schema.json
references/schemas/spaced-review-rule.schema.json
```

Scheduling signals:

```text
correct quickly
correct slowly
wrong but self-corrected
wrong with misconception
hint used
```

---

## Sprint R10.3 — Feedback and worked-example schemas

Create:

```text
references/schemas/feedback.schema.json
references/schemas/hint.schema.json
references/schemas/worked-example.schema.json
references/schemas/retry-item.schema.json
```

Every important question can have:

```text
answer check
misconception tag
short feedback
hint
deeper explanation
worked example
similar retry
transfer retry
teacher note
```

---

# Phase R11 — Simulation and game content models

## Sprint R11.1 — Simulation schema

Create:

```text
references/schemas/simulation.schema.json
references/schemas/model-parameter.schema.json
references/schemas/prediction-prompt.schema.json
references/schemas/debrief-prompt.schema.json
```

Every simulation must link to:

```text
concept IDs
unit IDs
model assumptions
graph/formula IDs
misconceptions
prediction prompts
explanation prompts
assessment links
```

---

## Sprint R11.2 — Game-item schema

Create:

```text
references/schemas/game-item.schema.json
```

Every game mechanic must map to economics:

```text
scarcity → limited resources
opportunity cost → forced trade-off
market power → pricing control
externality → spillover effect
public good → free-rider risk
risk → uncertain payoff
information asymmetry → hidden information
trade → mutual gains
policy → rule change
```

Game item fields:

```text
concept IDs
unit IDs
skill IDs
misconception IDs
feedback IDs
difficulty band
transfer target
debrief prompt
```

---

# Phase R12 — Teacher cockpit, privacy, accessibility, and deployment

## Sprint R12.1 — Teacher dashboard data model

Create schemas for:

```text
class mastery summary
misconception heatmap
student progress summary
hint usage summary
transfer performance summary
teacher intervention suggestion
```

Keep student data separate from reference data.

Rule:

```text
Reference graph defines what can be mastered.
Learner model records who has mastered what.
```

---

## Sprint R12.2 — Privacy and data minimization review gate

Before real student-data deployment:

```text
AVG/GDPR review
data minimization
pseudonymous IDs
export/delete controls
teacher-owned class codes
processing agreement readiness
no unnecessary trackers
```

Outputs:

```text
reports/review-gates/GATE-R12-privacy/*
```

---

## Sprint R12.3 — Accessibility review gate

Check:

```text
keyboard-playable games
no drag-only required interaction
clear focus states
alt text for graphs
high-contrast mode
reduced-animation mode
printable variants
screen-reader-friendly feedback
accessible formula rendering
```

Outputs:

```text
reports/review-gates/GATE-R12-accessibility/*
```

---

# Phase R13 — Bounded AI tutor and authoring assistant

AI is late-stage. Do not start student-facing AI before the data graph, evidence anchors, retrieval evals, and guardrails are stable.

## Sprint R13.1 — AI authoring assistant, internal only

Allowed uses:

```text
draft hints
draft distractors
draft variants
draft worked examples
draft teacher notes
suggest metadata
flag possible ambiguity
```

All generated content must require human review.

---

## Sprint R13.2 — Bounded student tutor prototype

Allowed behavior:

```text
Socratic hints
diagnose written answers
ask follow-up questions
explain wrong answers
generate similar retry
simplify wording in Dutch
connect mistake to concept
refuse to give away answers in retrieval-practice mode
```

Required controls:

```text
retrieval from approved graph only
evidence-aware answers
logging
teacher override
no high-stakes automated decisions
hallucination checks
opt-out
```

---

## Sprint R13.3 — AI review gate

Before student-facing use:

```text
teacher review
technical safety review
privacy review
AI policy review
sample interaction audit
```

Outputs:

```text
reports/review-gates/GATE-R13-ai/*
```

---

# Phase R14 — Evidence platform and continuous improvement

## Sprint R14.1 — Item analytics and quality signals

Track item quality:

```text
too easy
too hard
ambiguous wording
bad distractor
overused hint
high failure without learning gain
strong transfer item
weak retention item
teacher-reported issue
```

Create:

```text
references/schemas/item-quality-signal.schema.json
reports/json/item-quality-dashboard.json
```

---

## Sprint R14.2 — Experiment/evaluation framework

Support light educational research:

```text
A/B feedback format tests
worked-example sequence comparisons
retention after two weeks
transfer to unseen contexts
game impact on explanation quality
solo vs peer mode comparison
hint effectiveness
```

Ethics rule:

```text
No surveillance. Use minimal data and aggregate where possible.
```

---

## Sprint R14.3 — Curriculum versioning

Every item should know:

```text
syllabus year
domain
subdomain
learning objective
book version
publication date
review date
status
school-specific override
```

Create:

```text
references/schemas/curriculum-version.schema.json
references/data/curriculum/curriculum_versions.json
```

---

## 9. Review gates summary

| Gate | When | Subagents | Human interview | External input |
|---|---:|---:|---:|---:|
| GATE-R1-schema | after schemas | optional | no | no |
| GATE-R2-empty-needs | before applying dependency corrections | yes | yes | strongly recommended |
| GATE-R5-alignment-graph | before graph powers retrieval/diagnostics | yes | yes | recommended |
| GATE-R7-rag | before teacher-facing RAG | yes | sampled | optional |
| GATE-R10-diagnostics | before adaptive student routing | yes | yes | required before real use |
| GATE-R12-privacy | before student-data deployment | yes | yes | required |
| GATE-R12-accessibility | before broader deployment | yes | yes | required |
| GATE-R13-ai | before student-facing AI | yes | yes | required |
| GATE-R14-evidence-platform | before external evidence claims | yes | yes | recommended |

---

## 10. Critical path

If capacity is limited, use this path:

```text
R0.1 Sprint execution scaffold
R0.2 Reference baseline inventory
R1.1 Source-of-truth decision
R1.2 Core JSON schemas
R1.3 Unit prior-knowledge schema extension
R2.1 Full empty-needs audit, non-mutating
R2.2 Subagent review
R2.3 Adaptive human review and gate closure
R3.1 Minimal reference CLI
R3.2 Apply reviewed empty-needs corrections
R4.1 Unit-term slug migration
R4.2 Exam-question extraction gap closure
R4.3 Blueprint flag triage
R5.1 Evidence anchors
R5.2 Alignment graph
R5.3 Alignment graph gate
R6.1 JSON-first reports
R6.2 Reference-health dashboard
R7.1 Chunk index
R7.2 Hybrid retrieval
R7.3 Retrieval evals
R7.4 RAG gate
```

Do not invert this order.

---

## 11. Immediate Codex instructions

Begin with R0.1.

### Step 1 — Reread repository map

Read:

```text
RESEARCH_AGENT_MAP.md
references/reference-team-roadmap.md
references/machine/README.md
references/external/README.md
references/authored/README.md
references/qc-prompts/README.md
build-scripts/references/README.md
```

### Step 2 — Create sprint branch

```bash
git checkout -b refsys/R0.1-sprint-execution-scaffold
```

### Step 3 — Create sprint plan

Create:

```text
docs/sprints/R0.1-plan.md
references/data/sprints/R0.1.plan.json
```

Plan should include this roadmap section as context.

### Step 4 — Record baseline

If no validation scripts exist yet, record that as the baseline gap:

```text
reports/sprints/R0.1-baseline.md
```

### Step 5 — Implement only R0.1 outputs

Do not start schema or data refactors in R0.1.

Expected new files:

```text
docs/sprints/README.md
docs/sprints/example-plan.md
reports/sprints/example-result.md
build-scripts/sprints/check-sprint-plan.js
build-scripts/sprints/check-sprint-result.js
```

### Step 6 — Verify

Run:

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/example-plan.md
node build-scripts/sprints/check-sprint-result.js reports/sprints/example-result.md
```

### Step 7 — Close sprint

Create:

```text
reports/sprints/R0.1-result.md
reports/sprints/R0.1-diff-summary.md
references/data/sprints/R0.1.result.json
```

Commit and tag.

---

## 12. Final execution rule

The team may sprint hard on infrastructure, schemas, manifests, validators, non-mutating audits, JSON reports, and retrieval scaffolding.

The team may **not** make the graph pedagogically authoritative, apply broad prerequisite corrections, route students adaptively, or expose AI to students until the relevant review gates are closed.

Use this rule:

```text
Subagents find and frame issues.
Humans make pedagogical decisions.
Validators enforce completeness.
Git records the state.
```

And this sequence:

```text
Plan
→ Baseline
→ Execute
→ Verify
→ Review gate if needed
→ Commit
→ Tag
→ Proceed only to allowed next sprint
```

That is the final operating model for completing the reference/data foundation and evolving it into the full economics learning platform.

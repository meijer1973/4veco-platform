# References Team Roadmap

Generated: 2026-04-23
Adopted main roadmap: 2026-04-25
Scope: `references/`, `build-scripts/references/`, `build-scripts/reports/`, reference dashboards, and generated reference reports under `reports/`

## Adoption Decision

The handoff roadmap has been adopted as the main operating roadmap for the references team.

No blocking incompatibility was found. The roadmap direction fits the repository: machine-edited references, evidence-first unit growth, JSON-first reports, review gates for pedagogical authority, and bounded later AI.

Compatibility decisions:

- Sprint `R0.1` now means the sprint-execution scaffold.
- The older local `R0.1` / `R0.2` history is preserved as completed historical `H0.x` work, not as active roadmap numbering.
- `R0.1 Sprint Execution Scaffold` is completed.
- `R2.2 Subagent Review For Empty Needs` is completed; `R2.3 Human Review And Gate Closure` is active and waiting for human gate decision.
- Current catalog metrics are updated after the labor-market unit additions.
- The reference CLI exists; CLI documentation still needs cleanup because parts of the README still read like a future contract.

## Operating Rule

Every sprint must keep plans and completion status explicit.

Each sprint must have:

- a committed sprint plan
- a baseline report
- bounded allowed and forbidden paths
- acceptance tests
- a result report
- a diff summary
- a completion status in this roadmap

Machine-reference changes must go through CLI scripts. Do not hand-edit `references/machine/` or `references/external/`.

## Sprint Ledger

Open items are listed first; completed items are kept below them.

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| R2.3 | Human Review And Gate Closure | no | Active; waiting for human gate decision on the GATE-R2 empty-needs review packet. |
| R3.1 | Reference CLI And Documentation Completion | no | Planned. Fill any CLI gaps needed for reviewed corrections and update stale CLI docs. |
| R3.2 | Apply Reviewed Empty-Needs Corrections | no | Planned. Apply only reviewed prerequisite corrections through CLI. |
| R4.1 | Unit-Term Slug Migration | no | Planned. Migrate unit `terms` fields to canonical `begrippen.json` slug IDs. |
| R4.2 | Exam-Question Extraction Gap Closure | no | Planned. Complete missing required-skill and exam-code links where evidence supports it. |
| R4.3 | Blueprint Flag Triage | no | Planned. Convert raw missing-unit flags into curated decisions. |
| R5.1 | Evidence-Anchor Layer | no | Planned. Add exact proof anchors for important claims. |
| R5.2 | Alignment Graph | no | Planned. Create graph edges only after evidence and prerequisite work. |
| R5.3 | Alignment Graph Review Gate | no | Planned. Human-reviewed gate before graph powers retrieval or diagnostics. |
| R6.1 | JSON-First Reports | no | Planned. Markdown reports become projections of JSON. |
| R6.2 | Reference Health Dashboard Data | no | Planned. Produce one generated reference-health state file for dashboards and planning. |
| R7.1 | Deterministic Chunk Layer | no | Planned. Build source-ranked retrieval chunks. |
| R7.2 | Hybrid Retrieval | no | Planned. Add lexical/entity/graph retrieval before optional vector search. |
| R7.3 | Retrieval Evaluation Set | no | Planned. Make retrieval quality regressions visible. |
| R7.4 | RAG Review Gate | no | Planned. Approve internal/teacher-facing RAG only after evaluation. |
| R2.2 | Subagent Review For Empty Needs | yes | Completed. Pedagogy, data-integrity, and evidence reviews plus a GATE-R2 review packet are ready for human review. |
| R2.1 | Full Empty-Needs Audit | yes | Completed. Non-mutating audit generated 61 machine-suggested empty-needs review entries for the current branch catalog. |
| R1.3 | Unit Prior-Knowledge Schema Extension | yes | Completed. Unit and review schemas now support zero-needs status, assumed prior knowledge, and review records. |
| R1.2 | Core JSON Schemas | yes | Completed. Initial JSON schema contracts exist for units, terms, evidence, graph edges, reports, RAG chunks, feedback, games, and simulations. |
| R1.1 | Source-of-Truth Decision | yes | Completed. `references/SOURCE_OF_TRUTH.md` defines canonical source, projection, authority, and edit-policy rules. |
| R0.2 | Reference Baseline Inventory | yes | Completed. Source manifest, document inventory, builder, and validators now define the baseline reference/report/tooling surface. |
| R0.1 | Sprint Execution Scaffold | yes | Completed. Sprint templates, example fixtures, JSON sprint metadata, and plan/result validators exist. |
| H0.1 | A-Domain Skilltree Consistency | yes | Historical completed work. `A38` through `A44` implemented; A-domain skilltree coverage matches the catalog. |
| H0.2 | Reference Report Regeneration | yes | Historical completed work. Core reports regenerated and aligned with the catalog. |
| H0.3 | Labor-Market Unit And Dependency Patch | yes | Historical completed work. Added `L22` through `L27`, added the wage-elasticity term, and updated labor-market dependencies through CLI. |

## Executive Direction

The reference folder is becoming the platform's governed educational knowledge base.

Target flow:

```text
owned book/source material
-> machine-readable reference data
-> evidence anchors
-> alignment graph
-> JSON-first reports
-> retrieval/RAG layer
-> diagnostics and feedback
-> simulations/games
-> teacher cockpit
-> bounded AI
-> evidence-driven improvement
```

Do not proceed directly to RAG, adaptive diagnostics, or student-facing AI before prerequisite integrity, evidence anchors, alignment graph validation, and the relevant review gates are complete.

## Current Catalog State

Last regenerated: 2026-04-25

### Machine Unit Catalog

- `198` total units.
- `196` live units.
- `2` deprecated units: `D23`, `H26`.
- Domain spread, live units:
  - `A`: 44
  - `B`: 2
  - `D`: 36
  - `E`: 7
  - `F`: 18
  - `G`: 12
  - `H`: 30
  - `I`: 20
  - `L`: 27
- Mastery spread, live units:
  - `understand`: 91
  - `apply`: 83
  - `analyze`: 19
  - `evaluate`: 3
- Dependency graph:
  - `241` live prerequisite edges.
  - `52` live units still have no `needs` edges.
- Coverage:
  - `194/196` live units have exam-code links.
  - `152/196` live units have term links.
  - `105/105` apply/analyze/evaluate live units have procedures.

### Begrippen Registry

- `226` live terms.
- `226/226` have definitions.
- `226/226` have examples.
- `61/226` have pitfall text.
- `94/226` are reverse-linked to teaching units.
- `34/226` carry formulas.

Main risk: unit `terms` fields still include old canonical text strings while `begrippen.json` uses slug IDs. This needs the planned unit-term slug migration.

### Reports

Current generated reports:

- `reports/dag-integrity.md`: pass, all `198` units validate.
- `reports/needs-coverage.md`: informational backlog, `52` live units without `needs`.
- `reports/terms-coverage.md`: informational backlog, `44` live units without terms.
- `reports/procedure-coverage.md`: pass for apply+ units.
- `reports/aspects-coverage.md`: informational, remaining exam-citation gaps.
- `reports/unresolved-refs.md`: warnings only for deprecated references.
- `reports/dead-units.md`: informational scanner output; should be improved after JSON-first reports.

## Roadmap Phases

### Phase R0: Governance And Sprint Machinery

Goal: make reference work rollback-safe and auditable before more data work.

- `R0.1` completed: sprint execution scaffold.
- `R0.2` completed: source manifest and document inventory.

### Phase R1: Source Of Truth And Schemas

Goal: remove ambiguity about canonical data and generated projections.

Key outputs:

- `references/SOURCE_OF_TRUTH.md`
- core JSON schemas for units, terms, exam questions, source documents, evidence anchors, claims, alignment edges, reports, retrieval chunks, feedback, misconceptions, worked examples, game items, and simulations
- prior-knowledge schema extension for empty `needs`

### Phase R2: Empty-Needs And Prior-Knowledge Review

Goal: distinguish true zero-prerequisite units from hidden prerequisite gaps.

Rules:

- `R2.1` is non-mutating.
- subagents can propose corrections
- human review closes the gate
- broad dependency corrections are not applied until the review gate allows them

### Phase R3: CLI-Only Corrections

Goal: complete any missing mutation scripts, update CLI documentation, and apply reviewed corrections only through CLI.

### Phase R4: Term, Exam, Blueprint, And Authored-Bucket Cleanup

Goal: turn raw backlog into production signal.

Priority work:

- migrate unit terms to canonical slugs
- close exam-question skill/code gaps
- triage blueprint missing-unit flags
- classify authored-bucket files by migration status

### Phase R5: Evidence Anchors And Alignment Graph

Goal: connect claims to exact proof and make graph relationships explicit.

Do not let the graph become pedagogically authoritative until the alignment-graph review gate is closed.

### Phase R6: JSON-First Reports And Dashboard Data

Goal: make reports and dashboards consume structured data rather than scraping Markdown.

The reference dashboard should eventually read `reports/json/reference-health.json` or its successor, not scattered Markdown files.

### Phase R7: RAG And Technical Retrieval Layer

Goal: deterministic, source-ranked retrieval with evaluation before any teacher-facing use.

No vector-first shortcut. Build lexical/entity/graph retrieval and evaluation first.

### Phase R8: QC Automation And Production Integration

Goal: make QC findings machine-readable and block silent drift during lesson production.

### Phase R9: Book/Source Integration And Content Graph

Goal: connect owned book material to the reference graph without confusing authored exposition with machine reference data.

### Phase R10: Pedagogical Retrieval Practice, Diagnostics, And Feedback

Goal: model diagnostic items, mastery signals, misconceptions, feedback, hints, worked examples, and retry items.

Pedagogical retrieval practice is not the same thing as technical retrieval/RAG.

### Phase R11: Simulation And Game Content Models

Goal: map games and simulations explicitly to economics concepts, units, misconceptions, feedback, and debrief prompts.

### Phase R12: Teacher Cockpit, Privacy, Accessibility, And Deployment

Goal: model teacher dashboard data while keeping student data separate from reference data.

Privacy and accessibility gates are required before broad student-data deployment.

### Phase R13: Bounded AI Tutor And Authoring Assistant

Goal: keep AI late-stage and bounded.

Internal authoring assistance may come before student-facing AI, but all generated content needs human review. Student-facing AI requires stable graph, evidence anchors, retrieval evaluations, guardrails, and an AI review gate.

### Phase R14: Evidence Platform And Continuous Improvement

Goal: use quality signals, curriculum versioning, and light evaluation without surveillance or unnecessary student data.

## Review Gates

| Gate | When | Subagents | Human Review | Required Before |
|---|---:|---:|---:|---|
| GATE-R1-schema | after schemas | optional | no | schema-dependent migrations |
| GATE-R2-empty-needs | before broad dependency corrections | yes | yes | authoritative prerequisite graph |
| GATE-R5-alignment-graph | before graph powers retrieval/diagnostics | yes | yes | retrieval, diagnostics |
| GATE-R7-rag | before teacher-facing RAG | yes | sampled | teacher-facing retrieval |
| GATE-R10-diagnostics | before adaptive student routing | yes | yes | adaptive diagnostics |
| GATE-R12-privacy | before student-data deployment | yes | yes | learner data use |
| GATE-R12-accessibility | before broader deployment | yes | yes | broader student-facing release |
| GATE-R13-ai | before student-facing AI | yes | yes | AI tutor use |
| GATE-R14-evidence-platform | before external evidence claims | yes | yes | external claims about learning impact |

## Critical Path

Use this order when capacity is limited:

```text
R0.2 Reference baseline inventory
R1.1 Source-of-truth decision
R1.2 Core JSON schemas
R1.3 Unit prior-knowledge schema extension
R2.1 Full empty-needs audit, non-mutating
R2.2 Subagent review
R2.3 Adaptive human review and gate closure
R3.1 Reference CLI and documentation completion
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

## Immediate Next Sprint

Proceed with `R2.3 Human Review And Gate Closure`.

Create:

- `docs/sprints/R2.3-plan.md`
- `references/data/sprints/R2.3.plan.json`
- `reports/sprints/R2.3-baseline.md`
- `reports/review-gates/GATE-R2-empty-needs/human-interview.md`
- `reports/review-gates/GATE-R2-empty-needs/gate-closure.json`
- gate validator under `build-scripts/review-gates/`

Ask the human reviewer to decide whether the empty-needs gate is `pass`, `pass_with_conditions`, `hold`, or `fail`. Do not apply dependency corrections before the gate is closed.

## Final Rule

Use this sequence:

```text
Plan
-> Baseline
-> Execute
-> Verify
-> Review gate if needed
-> Commit
-> Tag
-> Proceed only to the allowed next sprint
```

Subagents find and frame issues. Humans make pedagogical decisions. Validators enforce completeness. Git records the state.

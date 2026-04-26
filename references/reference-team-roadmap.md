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
- `R2.3 Human Review And Gate Closure` is completed with `GATE-R2-empty-needs` status `hold`.
- `R2.4 Evidence And Unit-Design Cleanup` is completed as a non-mutating review packet before R3.2 can proceed.
- Current catalog metrics reflect the current branch state after R2.3 closure.
- `R3.1 Reference CLI And Documentation Completion` is completed. CLI documentation and command coverage now distinguish ready mutation paths from remaining blockers.

## Operating Rule

Every sprint must keep plans and completion status explicit.

Each sprint must have:

- a committed sprint plan
- an operationalized sprint procedure that expands the roadmap description into executable steps, decision points, stop conditions, outputs, and acceptance tests
- a baseline report
- bounded allowed and forbidden paths
- acceptance tests
- a result report
- a diff summary
- a completion status in this roadmap
- a deterministic sprint-bundle check before completion

The sprint plan must be more detailed than the sprint row in this roadmap. It must preserve every substantive instruction from the roadmap phase, sprint description, review-gate model, and current-state notes. If an instruction exists in the roadmap but is missing from the sprint plan, the plan is incomplete and the sprint must not proceed.

Machine-reference changes must go through CLI scripts. Do not hand-edit `references/machine/` or `references/external/`.

## Sprint Planning Contract

This contract applies to every sprint in the ledger.

Before execution, the sprint plan must include an `Operationalized sprint procedure` section that answers:

- what exact sequence of work will happen
- which roadmap instructions are being carried forward
- what artifacts prove the work happened
- what validators must pass
- what requires human review
- where the agent must stop

For human-review gates, the procedure must include the full interview or review protocol, not only the final gate status. R2.3 is the reference example: the plan must include calibration questions, answer recording, pattern analysis, targeted follow-ups, closure proposal, explicit human confirmation, and only then gate records.

Human-review interviews must be interactive: ask one question at a time, offer clear multiple-choice options where useful plus an open-answer option, record the answer, and then choose the next question or next interview mode. Do not dump a full interview list at the human reviewer. Include enough context in each question that the reviewer does not need to look up unit IDs or shorthand labels.

## Subagent And Verification Structure

Subagents are part of the sprint control system, not a substitute for it.

Default sprint structure:

1. A planning/review subagent checks whether the sprint plan fully operationalizes the roadmap description, baseline, required logs, stop conditions, and review gates.
2. The main agent executes the sprint and keeps ownership of integration, file changes, and roadmap state.
3. Specialist subagents may review bounded pedagogy, evidence, data-integrity, code, or dashboard questions.
4. A verification subagent reviews the completed artifacts or test evidence before the sprint is considered done when the sprint has meaningful risk.
5. The deterministic sprint-bundle checker verifies that required logs exist and point to each other.

The deterministic checker cannot prove pedagogical quality. It must prove the mechanical part: plan, plan JSON, baseline, result, diff summary, result JSON, protected-surface declarations, and validator references.

## Sprint Ledger

Open items are listed first; completed items are kept below them.

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| R3.2 | Apply Reviewed Empty-Needs Corrections | no | Blocked. Do not apply empty-needs dependency corrections until the R2.4 packet is human-reviewed for mutation. R3.1 confirms CLI readiness with documented blockers. |
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
| R8.1 | QC Issue Model | no | Planned. Define machine-readable quality issue categories, severity, evidence, proof-to-close, and ownership. |
| R8.2 | Production QC Gates | no | Planned. Connect reference QC signals to lesson-production checks without mutating protected references. |
| R9.1 | Owned Source Registry | no | Planned. Register owned book/source material as source surfaces distinct from external authority and generated reports. |
| R9.2 | Content Graph Projection | no | Planned. Project owned content to the reference graph without making exposition authoritative. |
| R10.1 | Diagnostic Item Model | no | Planned. Model diagnostic items, mastery signals, misconceptions, hints, and retry items. |
| R10.2 | Feedback Library | no | Planned. Create reusable feedback and worked-example records linked to units and misconceptions. |
| R10.3 | Diagnostics Review Gate | no | Planned. Human-reviewed gate before adaptive student routing. |
| R11.1 | Game Content Mapping | no | Planned. Map games to units, concepts, misconceptions, feedback, and debrief prompts. |
| R11.2 | Simulation Content Model | no | Planned. Define simulation schemas and evidence/debrief links. |
| R12.1 | Teacher Cockpit Data Contract | no | Planned. Define teacher-facing dashboard data while keeping student data separate from references. |
| R12.2 | Privacy Review Gate | no | Planned. Human-reviewed gate before student-data deployment. |
| R12.3 | Accessibility Review Gate | no | Planned. Human-reviewed gate before broader student-facing deployment. |
| R13.1 | Internal Authoring Assistant | no | Planned. Bound AI assistance to internal authoring with human review. |
| R13.2 | AI Tutor Guardrails | no | Planned. Define student-facing AI constraints, retrieval dependencies, and refusal/uncertainty behavior. |
| R13.3 | AI Review Gate | no | Planned. Human-reviewed gate before any student-facing AI tutor use. |
| R14.1 | Curriculum Versioning | no | Planned. Track curriculum/source versions and reference migrations. |
| R14.2 | Evidence Signal Model | no | Planned. Model quality and learning signals without surveillance or unnecessary student data. |
| R14.3 | Continuous Improvement Reports | no | Planned. Produce evidence-platform reports and require review before external claims. |
| R3.1 | Reference CLI And Documentation Completion | yes | Completed. CLI docs now reflect implemented scripts; coverage report status is `ready_with_blockers`; zero-needs review fields round-trip through parser, formatter, validation, and JSON projection. |
| R2.4 | Evidence And Unit-Design Cleanup | yes | Completed. Non-mutating packet attaches exact evidence to selected candidate edges, resolves D04 as unit-design-required, classifies foundational A-domain zero-needs candidates, preserves rejected market-graph suggestions, and records a bounded labor-market/unemployment second pass. |
| R2.3 | Human Review And Gate Closure | yes | Completed with GATE-R2 status `hold`. The audit is diagnostic only; R2.4 produced a non-mutating packet, and R3.2 remains blocked until human mutation review plus CLI readiness. |
| R2.2 | Subagent Review For Empty Needs | yes | Completed. Pedagogy, data-integrity, and evidence reviews plus a GATE-R2 review packet are ready for human review. |
| R2.1 | Full Empty-Needs Audit | yes | Completed. Non-mutating audit generated 61 machine-suggested empty-needs review entries for the current branch catalog. |
| R1.3 | Unit Prior-Knowledge Schema Extension | yes | Completed. Unit and review schemas now support zero-needs status, assumed prior knowledge, and review records. |
| R1.2 | Core JSON Schemas | yes | Completed. Initial JSON schema contracts exist for units, terms, evidence, graph edges, reports, RAG chunks, feedback, games, and simulations. |
| R1.1 | Source-of-Truth Decision | yes | Completed. `references/SOURCE_OF_TRUTH.md` defines canonical source, projection, authority, and edit-policy rules. |
| R0.2 | Reference Baseline Inventory | yes | Completed. Source manifest, document inventory, builder, and validators now define the baseline reference/report/tooling surface. |
| R0.1 | Sprint Execution Scaffold | yes | Completed. Sprint templates, example fixtures, JSON sprint metadata, and plan/result validators exist. |
| H0.1 | A-Domain Skilltree Consistency | yes | Historical completed work. `A38` through `A44` implemented; A-domain skilltree coverage matches the catalog. |
| H0.2 | Reference Report Regeneration | yes | Historical completed work. Core reports regenerated and aligned with the catalog. |
| H0.3 | Labor-Market Unit And Dependency Patch | yes | Historical branch work. Not present in the current 190-live-unit catalog; labor-market/unemployment sequencing is reopened under R2.4. |

## Detailed Sprint Backlog

The sprint ledger is a quick status table. This section is the readable backlog. Sprint plans must operationalize these descriptions, not only copy the ledger row.

### R2.4 Evidence And Unit-Design Cleanup

Purpose: respond to `GATE-R2-empty-needs` closing as `hold`. The empty-needs audit is useful, but it is not enough to authorize dependency mutation.

Required work:

- Attach exact exam or target-exercise evidence to any candidate prerequisite edge before it can later be applied.
- Resolve `D04 Elasticiteit en goederenclassificatie` as a unit-design issue. Goods classification belongs inside the relevant elasticity units unless evidence proves a separate unit is needed.
- Classify foundational A-domain empty-needs units, especially `underbouw_assumed` cases.
- Run a second pedagogical pass for labor-market and unemployment sequencing.
- Preserve rejected machine suggestions such as `D10 -> D01/D03`, `D13 -> D03`, and `D32 -> D01/D03` as rejected unless new evidence proves otherwise.

Required output: a review-ready evidence and unit-design packet that states which edges are evidence-backed, which units need design changes, and what remains blocked.

Stop condition: do not edit `references/machine/`; do not proceed to R3.2 until this packet exists and is reviewed.

### R3.1 Reference CLI And Documentation Completion

Purpose: make sure the CLI layer can safely apply reviewed reference changes without hand-editing protected files.

Required work:

- Audit the existing `build-scripts/references/` commands against the actual mutations needed after R2.4.
- Update stale documentation that still describes the CLI as a future contract.
- Add missing validators for any mutation command that can affect unit dependencies, unit status, term links, or evidence anchors.

Required output: CLI documentation and command coverage report.

Stop condition: if a required correction cannot be expressed through CLI, build or specify the CLI first; do not hand-edit machine references.

Completion: completed on 2026-04-26. `reports/reference-cli-coverage.md` and `reports/json/reference-cli-coverage.json` record status `ready_with_blockers`. The remaining blocker for R3.2 is human mutation review of the R2.4 packet, plus a specific design decision for D04 if any D04 lifecycle mutation is requested.

### R3.2 Apply Reviewed Empty-Needs Corrections

Purpose: apply only reviewed and evidence-backed corrections from R2.4 through CLI.

Required work:

- Apply accepted prerequisite edges only when exact evidence is attached.
- Apply accepted `underbouw_assumed` classifications only through the approved workflow.
- Skip blocked items: `D04` until unit design is resolved, labor-market sequencing until the second pass closes, and rejected graph edges unless new evidence overturns the rejection.

Required output: CLI mutation log, regenerated reports, and a diff summary proving protected changes were script-produced.

Stop condition: blocked while the R2.4 packet has not been human-reviewed for mutation decisions or while R3.1 has not confirmed CLI/validator readiness.

### R4.1 Unit-Term Slug Migration

Purpose: migrate unit `terms` fields from old canonical text strings to canonical `begrippen.json` slug IDs.

Required work:

- Produce a mapping from current unit term strings to term slugs.
- Flag ambiguous or missing mappings for human review.
- Apply safe mappings through CLI or a validated migration script.

Required output: migration report, unresolved mapping queue, regenerated term coverage.

Stop condition: do not silently create new term slugs or rewrite term meaning during migration.

### R4.2 Exam-Question Extraction Gap Closure

Purpose: improve links between exam questions, required skills, exam codes, and teaching units.

Required work:

- Identify exam-question records with missing required-skill or exam-code links.
- Attach evidence from actual CvTE questions or target exercises.
- Keep syllabus clauses as grouping/coverage context, not as the reason to mint units.

Required output: extraction gap report and reviewed patch queue.

Stop condition: do not invent skills from syllabus prose alone.

### R4.3 Blueprint Flag Triage

Purpose: convert raw blueprint missing-unit flags into curated decisions.

Required work:

- Separate true missing units, existing-unit matches, duplicates, low-priority ideas, and reject/hold cases.
- Prioritize flags backed by target exercises.
- Produce a backlog that can feed later CLI unit creation or evidence work.

Required output: curated blueprint flag backlog with decision category, evidence, and next action.

Stop condition: do not auto-mint units from blueprint prose.

### R5.1 Evidence-Anchor Layer

Purpose: create exact proof anchors for important claims, prerequisite edges, term definitions, and unit decisions.

Required work:

- Define evidence-anchor schema and source ranking.
- Attach anchors to high-risk decisions first: prerequisite edges, elasticity decisions, labor-market sequencing, and exam links.
- Distinguish external authority, owned source material, machine registry, and generated reports.

Required output: evidence-anchor records plus validator.

Stop condition: do not let reports or summaries become primary evidence.

### R5.2 Alignment Graph

Purpose: create graph edges between units, terms, evidence, questions, procedures, misconceptions, and later content surfaces.

Required work:

- Build graph edges only from evidence-backed relationships.
- Separate prerequisite, supports, assesses, explains, contradicts, and derived-from edge types.
- Produce graph integrity reports.

Required output: alignment graph data and integrity report.

Stop condition: graph must not become pedagogically authoritative before R5.3 closes.

### R5.3 Alignment Graph Review Gate

Purpose: human-review the alignment graph before it powers retrieval, diagnostics, dashboards, or adaptive decisions.

Required work:

- Prepare a review packet with samples from high-risk domains.
- Run subagent reviews for pedagogy, evidence, and data integrity.
- Conduct an interactive human review and record the gate decision.

Required output: gate packet, human interview, gate closure JSON, validator.

Stop condition: retrieval and diagnostics cannot depend on the graph until this gate allows it.

### R6.1 JSON-First Reports

Purpose: make Markdown reports projections of structured report JSON instead of primary data.

Required work:

- Define report JSON schemas.
- Convert priority reports: needs, terms, procedures, aspects, unresolved refs, dead units.
- Keep Markdown readable but generated from JSON.

Required output: JSON report files, Markdown projections, report validators.

Stop condition: do not make dashboards scrape Markdown as the long-term data interface.

### R6.2 Reference Health Dashboard Data

Purpose: produce one generated reference-health state file for dashboards and planning.

Required work:

- Combine report JSON into a dashboard-ready state file.
- Include sprint status, gate status, quality categories, blockers, and trend-friendly counts.
- Keep teacher/student data out of reference health.

Required output: `reports/json/reference-health.json` or successor plus dashboard integration.

Stop condition: dashboard must remain internal/developer-facing.

### R7.1 Deterministic Chunk Layer

Purpose: build retrieval chunks from source-ranked, deterministic references.

Required work:

- Define chunk schema, source rank, stable IDs, and provenance.
- Chunk external, authored, machine, and report surfaces according to their authority.
- Exclude or label generated summaries as secondary evidence.

Required output: chunk index and validator.

Stop condition: no vector-first shortcut.

### R7.2 Hybrid Retrieval

Purpose: add lexical, entity, and graph retrieval before optional vector search.

Required work:

- Implement deterministic search over terms, units, evidence anchors, exam references, and graph edges.
- Add ranking rules that prefer source authority and exact identifiers.
- Make uncertainty visible.

Required output: retrieval API or script plus evaluation hooks.

Stop condition: retrieval must not hide source rank or evidence weakness.

### R7.3 Retrieval Evaluation Set

Purpose: make retrieval quality regressions visible before teacher-facing use.

Required work:

- Create representative queries for units, terms, exam evidence, procedures, and roadmap questions.
- Record expected source surfaces and unacceptable answers.
- Add repeatable evaluation commands.

Required output: retrieval eval set and report.

Stop condition: no teacher-facing RAG without passing evaluation.

### R7.4 RAG Review Gate

Purpose: approve internal or teacher-facing RAG only after deterministic retrieval and evaluation.

Required work:

- Prepare retrieval evaluation summary and failure cases.
- Run review for evidence fidelity, hallucination risk, and source transparency.
- Conduct human gate review.

Required output: RAG gate packet, human decision, and closure record.

Stop condition: no student-facing AI from this gate; that is R13.

### R8.1 QC Issue Model

Purpose: define machine-readable quality issue categories that match this repository's work.

Required work:

- Model categories such as inspection-standard proof, reference quality, evidence sufficiency, curriculum alignment, unit design, extraction integrity, report drift, and production readiness.
- Include severity, owner/team, affected surface, evidence, next action, and proof required to close.
- Ensure categories are internal-facing and not exposed to public lesson material.

Required output: QC issue schema, example issue log, and dashboard data hook.

Stop condition: do not copy issue categories from unrelated data-analysis projects.

### R8.2 Production QC Gates

Purpose: connect reference QC signals to lesson-production checks.

Required work:

- Define which reference issues block paragraph/chapter production.
- Create checks that surface unresolved evidence, unit-design, or inspection-standard issues before production.
- Keep production checks readable for developers and lesson builders.

Required output: QC gate scripts and report.

Stop condition: do not mutate protected references from production QC scripts.

### R9.1 Owned Source Registry

Purpose: register owned book/source material as source surfaces without confusing it with external authority.

Required work:

- List owned book materials, paragraph plans, generated textbook surfaces, and source status.
- Define what can be used as evidence and what is exposition or generated projection.
- Connect owned sources to source manifest and document inventory.

Required output: owned source registry and validator.

Stop condition: owned exposition cannot override external authority or reviewed machine references.

### R9.2 Content Graph Projection

Purpose: project owned content into the reference graph for navigation and coverage without making it canonical evidence by accident.

Required work:

- Link paragraphs, exercises, visuals, procedures, summaries, and games to units and terms.
- Mark projection edges separately from evidence edges.
- Produce coverage reports for owned content against the reference graph.

Required output: content graph projection and report.

Stop condition: do not use generated lesson text as primary proof for reference claims.

### R10.1 Diagnostic Item Model

Purpose: model diagnostic items, mastery signals, misconceptions, hints, and retry items.

Required work:

- Define schemas for diagnostic items and mastery observations.
- Link items to units, procedures, misconceptions, feedback, and evidence.
- Keep adaptive routing separate from technical retrieval/RAG.

Required output: diagnostic item schema and examples.

Stop condition: no adaptive student routing before R10.3.

### R10.2 Feedback Library

Purpose: create reusable feedback and worked-example records linked to units and misconceptions.

Required work:

- Model feedback messages, hints, worked examples, and retry prompts.
- Link feedback to specific errors or misconceptions.
- Require human review for generated feedback.

Required output: feedback library schema, examples, and validator.

Stop condition: feedback must not make unsupported claims about student ability.

### R10.3 Diagnostics Review Gate

Purpose: human-review diagnostics before they route students adaptively.

Required work:

- Prepare review packet with item samples, feedback samples, and routing logic.
- Review for pedagogy, fairness, privacy, and evidence.
- Record human gate decision.

Required output: diagnostics gate artifacts.

Stop condition: no adaptive routing until gate allows it.

### R11.1 Game Content Mapping

Purpose: map games to economics concepts, units, misconceptions, feedback, and debrief prompts.

Required work:

- Link existing games and game items to reference units and procedures.
- Identify weak or unlinked game content.
- Add debrief and misconception hooks.

Required output: game mapping report and schema updates.

Stop condition: do not refactor retiring legacy game target unless explicitly approved.

### R11.2 Simulation Content Model

Purpose: define how simulations connect to units, economic models, evidence, misconceptions, and debrief prompts.

Required work:

- Define simulation schema and graph links.
- Model inputs, outputs, learning targets, and interpretation boundaries.
- Add validation for simulation-to-reference mappings.

Required output: simulation content model and examples.

Stop condition: simulations must not imply unsupported causal claims.

### R12.1 Teacher Cockpit Data Contract

Purpose: define teacher-facing dashboard data while keeping student data separate from reference data.

Required work:

- Define dashboard contract for reference health, curriculum coverage, QC status, and production readiness.
- Separate aggregate/status data from learner data.
- Keep developer dashboard internals out of public-facing material.

Required output: teacher cockpit data contract.

Stop condition: privacy gate required before student data enters deployment.

### R12.2 Privacy Review Gate

Purpose: review student-data handling before deployment.

Required work:

- Prepare data-flow inventory and minimization plan.
- Review storage, retention, access, and consent assumptions.
- Record gate decision.

Required output: privacy gate artifacts.

Stop condition: no student-data deployment before closure.

### R12.3 Accessibility Review Gate

Purpose: review accessibility before broader student-facing release.

Required work:

- Review dashboards, games, generated materials, and interactive components.
- Check keyboard navigation, contrast, alt text, readable structure, and export formats.
- Record gate decision and blockers.

Required output: accessibility gate artifacts.

Stop condition: no broad deployment while blockers remain.

### R13.1 Internal Authoring Assistant

Purpose: allow bounded AI assistance for internal authoring before any student-facing AI.

Required work:

- Define allowed tasks, source requirements, refusal behavior, and human-review requirements.
- Connect assistant outputs to evidence and QC logs.
- Keep generated content marked as needing review.

Required output: internal assistant contract and evaluation examples.

Stop condition: assistant cannot publish directly to student material.

### R13.2 AI Tutor Guardrails

Purpose: define constraints for any future student-facing AI tutor.

Required work:

- Specify retrieval dependencies, source citation rules, uncertainty handling, privacy limits, and escalation paths.
- Require stable graph, evidence anchors, retrieval evaluation, and review gates.
- Define unacceptable behaviors.

Required output: AI tutor guardrail spec.

Stop condition: no student-facing tutor before R13.3.

### R13.3 AI Review Gate

Purpose: human-review any student-facing AI tutor before use.

Required work:

- Review retrieval quality, hallucination risks, privacy, safety, pedagogy, and failure handling.
- Use evaluation cases and adversarial prompts.
- Record gate decision.

Required output: AI gate artifacts.

Stop condition: no student-facing AI without explicit gate approval.

### R14.1 Curriculum Versioning

Purpose: track curriculum/source versions and migrations.

Required work:

- Record versioned exam programs, syllabi, owned source versions, and migration status.
- Make stale references visible.
- Link version changes to affected units, terms, and evidence anchors.

Required output: curriculum version registry and stale-reference report.

Stop condition: do not silently mix curriculum versions.

### R14.2 Evidence Signal Model

Purpose: model quality and learning signals without surveillance or unnecessary student data.

Required work:

- Define which signals are acceptable, aggregated, and useful for improvement.
- Keep learner privacy and minimization central.
- Separate evidence about reference quality from evidence about student performance.

Required output: evidence signal schema and policy.

Stop condition: no external learning-impact claims from weak or invasive signals.

### R14.3 Continuous Improvement Reports

Purpose: produce improvement reports while preventing overclaiming.

Required work:

- Generate reports from quality issues, curriculum versions, evidence anchors, and allowed aggregate signals.
- Separate internal improvement findings from external claims.
- Require review before publishing claims about learning impact.

Required output: continuous improvement reports and external-claim review checklist.

Stop condition: external claims require the R14 evidence-platform gate.

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

Last regenerated: 2026-04-26

### Machine Unit Catalog

- `192` total units.
- `190` live units.
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
  - `L`: 21
- Mastery spread, live units:
  - `understand`: 89
  - `apply`: 80
  - `analyze`: 18
  - `evaluate`: 3
- Dependency graph:
  - `199` live prerequisite edges.
  - `61` live units still have no `needs` edges.
- Coverage:
  - `188/190` live units have exam-code links.
  - `146/190` live units have term links.
  - `101/101` apply/analyze/evaluate live units have procedures.

### Begrippen Registry

- `225` live terms.
- `225/225` have definitions.
- `225/225` have examples.
- `60/225` have pitfall text.
- `94/225` are reverse-linked to teaching units.
- `34/225` carry formulas.

Main risk: unit `terms` fields still include old canonical text strings while `begrippen.json` uses slug IDs. This needs the planned unit-term slug migration.

### Reports

Current generated reports:

- `reports/dag-integrity.md`: pass.
- `reports/needs-coverage.md`: informational backlog, `61` live units without `needs`.
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
- `R2.3` closed the review gate as `hold`.
- broad dependency corrections are not applied until `R2.4` supplies exact evidence and unit-design decisions.

Sprints:

- `R2.1` completed: full empty-needs audit, non-mutating.
- `R2.2` completed: subagent review and human-review packet.
- `R2.3` completed: adaptive human review and gate closure as `hold`.
- `R2.4` completed: evidence and unit-design cleanup after the hold decision.

### Phase R3: CLI-Only Corrections

Goal: complete any missing mutation scripts, update CLI documentation, and apply reviewed corrections only through CLI.

Sprints:

- `R3.1` completed: reference CLI and documentation completion.
- `R3.2` blocked: apply reviewed empty-needs corrections only after human mutation review of `R2.4`.

### Phase R4: Term, Exam, Blueprint, And Authored-Bucket Cleanup

Goal: turn raw backlog into production signal.

Priority work:

- migrate unit terms to canonical slugs
- close exam-question skill/code gaps
- triage blueprint missing-unit flags
- classify authored-bucket files by migration status

Sprints:

- `R4.1` planned: unit-term slug migration.
- `R4.2` planned: exam-question extraction gap closure.
- `R4.3` planned: blueprint flag triage.

### Phase R5: Evidence Anchors And Alignment Graph

Goal: connect claims to exact proof and make graph relationships explicit.

Do not let the graph become pedagogically authoritative until the alignment-graph review gate is closed.

Sprints:

- `R5.1` planned: evidence-anchor layer.
- `R5.2` planned: alignment graph.
- `R5.3` planned: alignment graph review gate.

### Phase R6: JSON-First Reports And Dashboard Data

Goal: make reports and dashboards consume structured data rather than scraping Markdown.

The reference dashboard should eventually read `reports/json/reference-health.json` or its successor, not scattered Markdown files.

Sprints:

- `R6.1` planned: JSON-first reports.
- `R6.2` planned: reference health dashboard data.

### Phase R7: RAG And Technical Retrieval Layer

Goal: deterministic, source-ranked retrieval with evaluation before any teacher-facing use.

No vector-first shortcut. Build lexical/entity/graph retrieval and evaluation first.

Sprints:

- `R7.1` planned: deterministic chunk layer.
- `R7.2` planned: hybrid retrieval.
- `R7.3` planned: retrieval evaluation set.
- `R7.4` planned: RAG review gate.

### Phase R8: QC Automation And Production Integration

Goal: make QC findings machine-readable and block silent drift during lesson production.

Sprints:

- `R8.1` planned: QC issue model.
- `R8.2` planned: production QC gates.

### Phase R9: Book/Source Integration And Content Graph

Goal: connect owned book material to the reference graph without confusing authored exposition with machine reference data.

Sprints:

- `R9.1` planned: owned source registry.
- `R9.2` planned: content graph projection.

### Phase R10: Pedagogical Retrieval Practice, Diagnostics, And Feedback

Goal: model diagnostic items, mastery signals, misconceptions, feedback, hints, worked examples, and retry items.

Pedagogical retrieval practice is not the same thing as technical retrieval/RAG.

Sprints:

- `R10.1` planned: diagnostic item model.
- `R10.2` planned: feedback library.
- `R10.3` planned: diagnostics review gate.

### Phase R11: Simulation And Game Content Models

Goal: map games and simulations explicitly to economics concepts, units, misconceptions, feedback, and debrief prompts.

Sprints:

- `R11.1` planned: game content mapping.
- `R11.2` planned: simulation content model.

### Phase R12: Teacher Cockpit, Privacy, Accessibility, And Deployment

Goal: model teacher dashboard data while keeping student data separate from reference data.

Privacy and accessibility gates are required before broad student-data deployment.

Sprints:

- `R12.1` planned: teacher cockpit data contract.
- `R12.2` planned: privacy review gate.
- `R12.3` planned: accessibility review gate.

### Phase R13: Bounded AI Tutor And Authoring Assistant

Goal: keep AI late-stage and bounded.

Internal authoring assistance may come before student-facing AI, but all generated content needs human review. Student-facing AI requires stable graph, evidence anchors, retrieval evaluations, guardrails, and an AI review gate.

Sprints:

- `R13.1` planned: internal authoring assistant.
- `R13.2` planned: AI tutor guardrails.
- `R13.3` planned: AI review gate.

### Phase R14: Evidence Platform And Continuous Improvement

Goal: use quality signals, curriculum versioning, and light evaluation without surveillance or unnecessary student data.

Sprints:

- `R14.1` planned: curriculum versioning.
- `R14.2` planned: evidence signal model.
- `R14.3` planned: continuous improvement reports.

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
R2.4 Evidence and unit-design cleanup after GATE-R2 hold
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
R8.1 QC issue model
R8.2 Production QC gates
R9.1 Owned source registry
R9.2 Content graph projection
R10.1 Diagnostic item model
R10.2 Feedback library
R10.3 Diagnostics review gate
R11.1 Game content mapping
R11.2 Simulation content model
R12.1 Teacher cockpit data contract
R12.2 Privacy review gate
R12.3 Accessibility review gate
R13.1 Internal authoring assistant
R13.2 AI tutor guardrails
R13.3 AI review gate
R14.1 Curriculum versioning
R14.2 Evidence signal model
R14.3 Continuous improvement reports
```

Do not invert this order.

## Immediate Next Sprint

Do not proceed directly to protected-reference mutation.

Next action: complete the human mutation review of the R2.4 evidence and unit-design packet. R3.2 can start only after that review explicitly authorizes which packet items may be applied through CLI.

Current R3.2 readiness:

- CLI/documentation readiness: completed by R3.1 with status `ready_with_blockers`
- dependency-edge mutation path: available through `unit-add-dep.js` after review
- zero-needs classification mutation path: available through `unit-update.js` after review
- D04 lifecycle mutation path: available through `unit-deprecate.js`, `unit-split.js`, or `unit-merge.js`, but blocked until the human design decision is specific
- evidence-anchor storage: deferred to R5.1 and not an R3.2 blocker while the R2.4 packet remains provenance
- protected surfaces: keep `references/machine/` and `references/external/` protected until the reviewed CLI mutation sprint starts

## Final Rule

Use this sequence:

```text
Plan
-> Baseline
-> Execute
-> Verify
-> Review gate if needed
-> Deterministic bundle check
-> Commit
-> Tag
-> Proceed only to the allowed next sprint
```

Subagents find and frame issues. Humans make pedagogical decisions. Validators enforce completeness. Git records the state.

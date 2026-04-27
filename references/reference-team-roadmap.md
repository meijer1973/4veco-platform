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
- `R2.4 Evidence And Unit-Design Cleanup` is completed as a non-mutating review packet.
- `R3.2 Apply Reviewed Empty-Needs Corrections` is completed; the approved mutation set was applied through CLI.
- Current catalog metrics reflect the post-merge `main` state after R7.5 validation.
- `R3.1 Reference CLI And Documentation Completion` is completed. CLI documentation and command coverage now distinguish ready mutation paths from remaining blockers.
- The active roadmap is narrowed to reference and RAG data quality. Delayed product surfaces such as diagnostics, adaptive routing, teacher cockpit, student-facing AI, games, simulations, privacy deployment, accessibility deployment, and continuous-improvement claims are intentionally out of scope for this roadmap until the data foundation is stronger.

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
| R9.1 | Owned Source Registry | no | Next. Register owned book/source material as source surfaces so RAG can retrieve from actual lesson and blueprint material without treating exposition as authority. |
| R9.2 | Content Graph Projection | no | Planned next after R9.1. Project owned content to the reference graph using projection edges, not evidence edges. |
| R7.6 | RAG Quality Hardening | no | Planned. Close R7.4 follow-ups, expand retrieval eval coverage, backfill evidence anchors, and improve approved/pending/diagnostic labels. |
| R8.1 | QC Issue Model | no | Planned, scoped down. Define only the lightweight issue schema needed to expose evidence weakness, stale data, and proof-to-close in retrieval and reports. |
| R14.1 | Curriculum Versioning | no | Planned, minimal. Track source/curriculum versions so retrieval does not silently mix syllabus or exam-program versions. |
| R7.4 | RAG Review Gate | yes | Completed with `pass_with_conditions`. Internal and teacher-facing non-authoritative retrieval plus human-reviewed lesson-authoring support are allowed; student-facing diagnostics, adaptive routing, AI, automatic sequencing, mastery decisions, and summative use remain blocked. |
| R7.5 | Merge Readiness and Main Sync | yes | Completed. Branch synced with `origin/main`, duplicate R5 gate namespace resolved, stray roadmap artifact moved to `docs/roadmaps/`, validators pass, and merge-readiness report says ready for merge review. |
| R9.0 | Legacy Target Reference Minimization | yes | Completed. Minimized the frozen legacy target as a conceptual anchor before R9.1 while preserving functional legacy paths and guardrails. |
| R9.01 | Legacy Folder Rename | yes | Completed. Renamed repo-local legacy folders to `legacy-target` while preserving the frozen external lesson target. |
| R7.3 | Retrieval Evaluation Set | yes | Completed. Added fixed retrieval eval set, runner, validator, JSON results, and Markdown report; 10/10 cases pass with zero authority violations. |
| R7.2 | Hybrid Retrieval | yes | Completed. Added internal deterministic query prototype preserving source authority, evidence IDs, edge status, and generated-report warnings. |
| R7.1 | Deterministic Chunk Layer | yes | Completed. Added deterministic internal RAG chunk index with 842 chunks and authority metadata preserving generated-report safeguards. |
| R6.2 | Reference Health Dashboard Data | yes | Completed. Added `reports/json/reference-health.json` and Markdown projection with R5.3 graph-authority constraints and dashboard health summaries. |
| R6.1 | JSON-First Reports | yes | Completed. Added JSON-first report generation and validation for 10 required health/coverage reports, plus Markdown projections under `reports/markdown/`. |
| R5.3 | Alignment Graph Review Gate | yes | Completed with `pass_with_conditions`. Named graph edge groups are approved for internal dashboard/reporting and internal retrieval development/evaluation; student diagnostics, adaptive routing, and student-facing AI remain blocked. |
| R5.2 | Alignment Graph | yes | Completed. Built the first draft alignment graph from R5.1 evidence anchors: 31 edges, 13 pending main edges, 18 traceability edges, and 0 human-approved edges. |
| R5.1 | Evidence-Anchor Layer | yes | Completed. Created the first governed evidence-anchor layer: source-ranking policy, 15 anchors, 13 claims, schemas, validator, and status reports. |
| R4.3 | Blueprint Flag Triage | yes | Completed. Triaged all 84 current raw target-exercise missing-unit flags into a curated backlog: 68 still needed, 4 existing-unit match candidates, 1 duplicate, and 11 deferred. |
| R4.2 | Exam-Question Extraction Gap Closure | yes | Completed. Produced a non-mutating gap report and patch queue for 27 exam-question records with missing required-skill annotations; protected references were not changed. |
| R4.1 | Unit-Term Slug Migration | yes | Completed. Migrated safe unit `terms` values to canonical `begrippen.json` slug IDs through a validated migration script; left `alternatieve kosten` and `schaarste` unresolved for later term-registry review. |
| R3.2 | Apply Reviewed Empty-Needs Corrections | yes | Completed. Applied the bounded R2.4 mutation-review set through CLI: 15 dependency edges and 6 `underbouw_assumed` classifications. No D04, rejected market-graph, held A-domain, L09->L03, or H13 mutations were applied. |
| R3.1 | Reference CLI And Documentation Completion | yes | Completed. CLI docs now reflect implemented scripts; coverage report status is `ready_with_blockers`; zero-needs review fields round-trip through parser, formatter, validation, and JSON projection. |
| R2.4 | Evidence And Unit-Design Cleanup | yes | Completed. Non-mutating packet attaches exact evidence to selected candidate edges, resolves D04 as unit-design-required, classifies foundational A-domain zero-needs candidates, preserves rejected market-graph suggestions, and records a bounded labor-market/unemployment second pass. |
| R2.3 | Human Review And Gate Closure | yes | Completed with GATE-R2 status `hold`. The audit was diagnostic only; R2.4 produced the non-mutating packet and R3.2 later applied only the human-approved CLI mutation set. |
| R2.2 | Subagent Review For Empty Needs | yes | Completed. Pedagogy, data-integrity, and evidence reviews plus a GATE-R2 review packet are ready for human review. |
| R2.1 | Full Empty-Needs Audit | yes | Completed. Non-mutating audit generated 61 machine-suggested empty-needs review entries for the current branch catalog. |
| R1.3 | Unit Prior-Knowledge Schema Extension | yes | Completed. Unit and review schemas now support zero-needs status, assumed prior knowledge, and review records. |
| R1.2 | Core JSON Schemas | yes | Completed. Initial JSON schema contracts exist for units, terms, evidence, graph edges, reports, RAG chunks, and reference-quality records. |
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

Completion: completed on 2026-04-26. `reports/reference-cli-coverage.md` and `reports/json/reference-cli-coverage.json` record status `ready_with_blockers`. Human mutation review later authorized a bounded R3.2 mutation set. D04 lifecycle work remains out of scope until a separate unit-design decision is made.

### R3.2 Apply Reviewed Empty-Needs Corrections

Purpose: apply only reviewed and evidence-backed corrections from R2.4 through CLI.

Required work:

- Apply accepted prerequisite edges only when exact evidence is attached.
- Apply accepted `underbouw_assumed` classifications only through the approved workflow.
- Skip blocked items: `D04` until unit design is resolved, labor-market sequencing until the second pass closes, and rejected graph edges unless new evidence overturns the rejection.

Required output: CLI mutation log, regenerated reports, and a diff summary proving protected changes were script-produced.

Stop condition: blocked while the R2.4 packet has not been human-reviewed for mutation decisions or while R3.1 has not confirmed CLI/validator readiness.

Completion: completed on 2026-04-26. Human mutation review exists at `reports/review-gates/GATE-R2-empty-needs/R2.4-mutation-review.md` and `.json`. R3.2 applied only the approved bounded mutation set through CLI. Mutation log: `reports/review-gates/GATE-R2-empty-needs/R3.2-mutation-log.md`.

### R4.1 Unit-Term Slug Migration

Purpose: migrate unit `terms` fields from old canonical text strings to canonical `begrippen.json` slug IDs.

Required work:

- Produce a mapping from current unit term strings to term slugs.
- Flag ambiguous or missing mappings for human review.
- Apply safe mappings through CLI or a validated migration script.

Required output: migration report, unresolved mapping queue, regenerated term coverage.

Stop condition: do not silently create new term slugs or rewrite term meaning during migration.

Completion: completed on 2026-04-26. `build-scripts/references/unit-term-slug-migration.js` applied only safe exact mappings. Initial write changed 79 units, left `alternatieve kosten` and `schaarste` unresolved, and created no new term slugs. `reports/terminology-drift.md` now validates against `begrippen.json` as the primary registry so migrated slug IDs are not false positives.

### R4.2 Exam-Question Extraction Gap Closure

Purpose: improve links between exam questions, required skills, exam codes, and teaching units.

Required work:

- Identify exam-question records with missing required-skill or exam-code links.
- Attach evidence from actual CvTE questions or target exercises.
- Keep syllabus clauses as grouping/coverage context, not as the reason to mint units.

Required output: extraction gap report and reviewed patch queue.

Stop condition: do not invent skills from syllabus prose alone.

Completion: completed on 2026-04-26 as a non-mutating audit. `build-scripts/references/exam-question-gap-audit.js` produced `reports/exam-question-extraction-gaps.md` and `.json`. The queue contains 27 records with missing `required_skills`; 19 also miss `exam_codes`. Current annotations contain 0 invalid unit IDs and 0 invalid exam codes. No files in `references/external/` or `references/machine/` were changed.

### R4.3 Blueprint Flag Triage

Purpose: convert raw blueprint missing-unit flags into curated decisions.

Required work:

- Separate true missing units, existing-unit matches, duplicates, low-priority ideas, and reject/hold cases.
- Prioritize flags backed by target exercises.
- Produce a backlog that can feed later CLI unit creation or evidence work.

Required output: curated blueprint flag backlog with decision category, evidence, and next action.

Stop condition: do not auto-mint units from blueprint prose.

Completion: completed on 2026-04-26 as a non-mutating triage. `build-scripts/references/check-target-exercise-flags.js` produced `reports/blueprint-flag-triage.md` and `.json`. All 84 current raw flags are triaged: 68 `still_needed`, 4 `existing_unit_match`, 1 `duplicate`, and 11 `defer`. No files in `references/machine/`, `references/external/`, or `references/authored/course-target-exercises.json` were changed.

### R5.1 Evidence-Anchor Layer

Purpose: create exact proof anchors for important claims, prerequisite edges, term definitions, and unit decisions.

Required work:

- Define evidence-anchor schema and source ranking.
- Attach anchors to high-risk decisions first: prerequisite edges, elasticity decisions, labor-market sequencing, and exam links.
- Distinguish external authority, owned source material, machine registry, and generated reports.

Required output: evidence-anchor records plus validator.

Stop condition: do not let reports or summaries become primary evidence.

Completion: completed on 2026-04-26. R5.1 added `references/data/evidence-anchors.json`, operational evidence-anchor and claim schemas, `build-scripts/references/check-evidence-anchors.js`, and status reports. The first layer contains 15 evidence anchors and 13 claims. Generated reports are explicitly secondary and the validator rejects generated-report anchors marked as primary.

### R5.2 Alignment Graph

Purpose: create graph edges between units, terms, evidence, questions, procedures, misconceptions, and later content surfaces.

Required work:

- Build graph edges only from evidence-backed relationships.
- Separate prerequisite, supports, assesses, explains, contradicts, and derived-from edge types.
- Produce graph integrity reports.

Required output: alignment graph data and integrity report.

Stop condition: graph must not become pedagogically authoritative before R5.3 closes.

Completion: completed on 2026-04-26. R5.2 added `references/data/alignment-graph.json`, `build-scripts/references/build-alignment-graph.js`, `build-scripts/references/check-alignment-graph.js`, and graph integrity reports. R5.3 later approved only named edge groups with conditions; unreviewed graph edges remain pending or diagnostic.

### R5.3 Alignment Graph Review Gate

Purpose: human-review the alignment graph before it powers retrieval, diagnostics, dashboards, or adaptive decisions.

Required work:

- Prepare a review packet with samples from high-risk domains.
- Run subagent reviews for pedagogy, evidence, and data integrity.
- Conduct an interactive human review and record the gate decision.

Required output: gate packet, human interview, gate closure JSON, validator.

Stop condition: retrieval and diagnostics cannot depend on the graph until this gate allows it.

Completion: completed on 2026-04-27 with `pass_with_conditions`. The gate approves only named edge groups, not the whole graph as pedagogically authoritative. Internal dashboard/reporting and internal retrieval development/evaluation may proceed if edge status, source authority, evidence anchors, diagnostic flags, and generated-report warnings are preserved. Student diagnostics, adaptive routing, student-facing AI, automatic mastery decisions, and summative assessment decisions remain blocked.

### R6.1 JSON-First Reports

Purpose: make Markdown reports projections of structured report JSON instead of primary data.

Required work:

- Define report JSON schemas.
- Convert priority reports: needs, terms, procedures, aspects, unresolved refs, dead units.
- Keep Markdown readable but generated from JSON.

Required output: JSON report files, Markdown projections, report validators.

Stop condition: do not make dashboards scrape Markdown as the long-term data interface.

Completion: completed on 2026-04-27. R6.1 added `build-scripts/reports/generate-all.js`, `build-scripts/reports/validate-report-json.js`, 10 required JSON report files under `reports/json/`, and readable projections under `reports/markdown/`. Generated reports remain diagnostic and do not replace source evidence.

### R6.2 Reference Health Dashboard Data

Purpose: produce one generated reference-health state file for dashboards and planning.

Required work:

- Combine report JSON into a dashboard-ready state file.
- Include sprint status, gate status, quality categories, blockers, and trend-friendly counts.
- Keep teacher/student data out of reference health.

Required output: `reports/json/reference-health.json` or successor plus dashboard integration.

Stop condition: dashboard must remain internal/developer-facing.

Completion: completed on 2026-04-27. R6.2 added `build-scripts/reports/generate-reference-health.js`, `build-scripts/reports/check-reference-health.js`, `reports/json/reference-health.json`, and `reports/markdown/reference-health.md`. The state file explicitly blocks student diagnostics, adaptive routing, and student-facing AI.

### R7.1 Deterministic Chunk Layer

Purpose: build retrieval chunks from source-ranked, deterministic references.

Required work:

- Define chunk schema, source rank, stable IDs, and provenance.
- Chunk external, authored, machine, and report surfaces according to their authority.
- Exclude or label generated summaries as secondary evidence.

Required output: chunk index and validator.

Stop condition: no vector-first shortcut.

Completion: completed on 2026-04-27. R7.1 added `build-scripts/rag/build-chunks.js`, `build-scripts/rag/validate-chunks.js`, and `references/data/rag/chunk_index.jsonl`. Generated-report chunks are non-primary and non-authoritative.

### R7.2 Hybrid Retrieval

Purpose: add lexical, entity, and graph retrieval before optional vector search.

Required work:

- Implement deterministic search over terms, units, evidence anchors, exam references, and graph edges.
- Add ranking rules that prefer source authority and exact identifiers.
- Make uncertainty visible.

Required output: retrieval API or script plus evaluation hooks.

Stop condition: retrieval must not hide source rank or evidence weakness.

Completion: completed on 2026-04-27. R7.2 added `build-scripts/rag/query.js` and `build-scripts/rag/validate-query-output.js`. Retrieval is internal only and preserves authority metadata and generated-report warnings.

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

Stop condition: no student-facing AI, diagnostics, adaptive routing, automatic sequencing, mastery decisions, or summative use from this gate.

Completion: completed on 2026-04-27 with `pass_with_conditions`. Internal dashboard use, internal retrieval development, retrieval evaluation, teacher-facing non-authoritative lookup, and human-reviewed lesson-authoring support are allowed. Student-facing diagnostics, adaptive routing, student-facing AI, automatic lesson sequencing, automatic mastery decisions, summative assessment decisions, and unreviewed student-facing publication remain blocked.

### R9.0 Legacy Target Reference Minimization

Purpose: reduce non-functional references to the frozen legacy target before owned-source integration begins. The frozen legacy target remains operationally protected, but it should not remain the default example or course-design backbone for new reference/RAG work.

Required work:

- scan the repository for frozen-legacy-target labels and legacy path references
- classify each occurrence as functional legacy path, frozen-target guardrail, historical planning note, generated artifact, or safe cleanup target
- update safe cleanup targets in current guidance, authored course-design notes, and generic examples
- preserve legacy source-data paths, legacy content-builder paths, `deploy:legacy`, and explicit frozen-target warnings
- regenerate derived inventories/RAG chunks if authored-reference changes affect generated data
- report remaining frozen-legacy-target references by category

Acceptance:

- R9.0 sprint bundle passes
- no hand edits to `references/machine/` or `references/external/`
- remaining frozen-legacy-target references are intentional, categorized, and reported

Stop condition: do not delete or refactor functional legacy paths in this sprint.

Completion: completed on 2026-04-27. Active authored references and generic guidance no longer use the frozen legacy target as the course-design shorthand; remaining frozen-legacy-target references are guardrails, functional legacy paths, historical planning notes, or the R9.0 audit record itself.

### R9.01 Legacy Folder Rename

Purpose: rename repo-local legacy folders so the active repository no longer has folders named after the frozen legacy target.

Required work:

- rename the repo-local legacy source-data folder to `source-data/legacy-target/`
- rename the repo-local legacy content-builder folder to `build-scripts/content/legacy-target/`
- update repo-local script and README references to the new paths
- preserve the external frozen lesson target name and storage behavior
- regenerate inventories and validate the sprint bundle

Acceptance:

- no repo-local directory remains named after the frozen legacy target
- legacy helper scripts resolve the renamed paths
- no hand edits to `references/machine/` or `references/external/`

Stop condition: do not rename or mutate the external frozen lesson target.

Completion: completed on 2026-04-27. Repo-local legacy source-data and content-builder folders now use `legacy-target`; the external frozen lesson target name and storage behavior were not changed.

### R9.1 Owned Source Registry

Purpose: register owned book/source material as source surfaces without confusing it with external authority.

Required work:

- Promote `references/owned/course-blueprint-v4.md` as the canonical owned curriculum-design source for the current partial blueprint.
- Keep `references/owned/course-blueprint-v4.meta.json` attached so retrieval can see that the blueprint is partial, owned, and not external authority.
- List owned book materials, paragraph plans, generated textbook surfaces, target exercises, answer models, chapter plans, course blueprint material, and active lesson markdown.
- Define source status for each surface: authored source, generated projection, exercise evidence, answer model, planning artifact, or implementation output.
- Define what can be used as evidence and what is exposition or generated projection.
- Connect owned sources to source manifest and document inventory.
- Keep lesson-output references separate from external authority and protected machine registries.

Required output: owned source registry, schema, validator, blueprint metadata validation, source-manifest integration, and report.

Stop condition: owned exposition cannot override external authority or reviewed machine references.

### R9.2 Content Graph Projection

Purpose: project owned content into the reference graph for navigation and coverage without making it canonical evidence by accident.

Required work:

- Use `references/owned/course-blueprint-v4.md` as the course-design backbone for blueprint paragraph, chapter, target-exercise, and difficulty-note projection edges.
- Link paragraphs, exercises, visuals, procedures, summaries, and answer models to units and terms.
- Mark projection edges separately from evidence edges.
- Preserve source type, source path, authority level, and generated/projection status in every edge.
- Produce coverage reports for owned content against the reference graph.
- Regenerate RAG chunks so owned-source retrieval works without weakening evidence hierarchy.

Required output: content graph projection, graph/report validators, owned-content coverage report, regenerated chunk index, and retrieval smoke tests.

Stop condition: do not use generated lesson text as primary proof for reference claims.

### R7.6 RAG Quality Hardening

Purpose: improve retrieval quality before new product features. This sprint closes the R7.4 follow-up conditions and expands the proof layer enough that RAG quality is more than a smoke test.

Required work:

- RAG-01: make retrieval labels explicit for approved, approved-with-conditions, pending-review, diagnostic-only, generated-report diagnostic, external-primary, machine-registry, and authored-judgement results.
- RAG-02: add score, match-strength, and weak-match warnings; very low-score matches must be hidden by default or grouped as possible weak matches.
- RAG-03: split target exercises into stable per-exercise chunks with exercise IDs, source paths, unit links, term links where available, evidence metadata, and target-exercise status.
- RAG-04: create evidence-anchor coverage reports for retrieval by chunk type, entity type, source type, and authority level.
- Expand retrieval evaluation from the 10-case smoke suite toward a meaningful regression suite covering unit lookup, terms, exam phrasings, known ambiguity, deprecated units, missing-needs queries, generated-report-only results, pending-review graph edges, and out-of-corpus queries.
- Backfill evidence anchors for high-traffic concepts and currently weak surfaces, especially elasticity, A-domain foundations, labor-market sequencing, `alternatieve kosten`, and `schaarste`.
- Review the first backfilled graph edge batch so the graph has meaningful approved edges instead of relying mainly on draft/pending traceability.

Required output: updated RAG scripts, expanded eval set and results, evidence-anchor coverage report, backfilled evidence-anchor records, graph integrity report, and sprint result.

Stop condition: do not expand into diagnostics, adaptive routing, student-facing AI, or new product surfaces.

### R8.1 QC Issue Model

Purpose: define a lightweight, machine-readable quality issue model that directly improves reference/RAG trust.

Required work:

- Model only categories needed now: reference quality, evidence sufficiency, unit design, extraction integrity, report drift, source-version drift, term-link gaps, needs gaps, and production-readiness warnings.
- Include severity, owner/team, affected surface, evidence, next action, and proof required to close.
- Make issues retrievable and dashboard-friendly without turning them into curriculum authority.
- Ensure categories are internal-facing and not exposed as student material.

Required output: QC issue schema, example issue log, validator, and dashboard/RAG data hook.

Stop condition: do not gold-plate a general issue tracker and do not copy categories from unrelated data-analysis projects.

### R14.1 Curriculum Versioning

Purpose: track curriculum/source versions and migrations so retrieval cannot silently mix incompatible source generations.

Required work:

- Record versioned exam programs, syllabi, owned source versions, and migration status.
- Make stale references visible.
- Link version changes to affected units, terms, and evidence anchors.
- Keep the first pass minimal: enough to tag current external, machine, authored, and owned-source surfaces with version provenance.

Required output: curriculum version registry and stale-reference report.

Stop condition: do not silently mix curriculum versions.

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
```

Current focus: improve data quality inside this flow before adding new product surfaces.

Do not proceed to diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative decisions, teacher cockpit deployment, game/simulation product mapping, or continuous-improvement claims from this roadmap.

## Current Catalog State

Last regenerated: 2026-04-27

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
  - `214` live prerequisite edges.
  - `48` live units still have no `needs` edges.
- Coverage:
  - `188/190` live units have exam-code links.
  - `146/190` live units have term links.
  - `101/101` apply/analyze/evaluate live units have procedures.

### Begrippen Registry

- `225` live terms.
- `225/225` have definitions.
- `225/225` have examples.
- `60/225` have pitfall text.
- `95/225` are reverse-linked to teaching units.
- `34/225` carry formulas.

Main risk: two unit term strings remain unresolved against `begrippen.json`: `alternatieve kosten` and `schaarste`. They are intentionally left for later term-registry review rather than silently creating new slugs.

### Reports

Current generated reports:

- `reports/dag-integrity.md`: pass.
- `reports/needs-coverage.md`: informational backlog, `48` live units without `needs`.
- `reports/terms-coverage.md`: informational backlog, `44` live units without terms.
- `reports/terminology-drift.md`: pass against machine-registry-first term validation.
- `reports/exam-question-extraction-gaps.md`: patch queue, `27` exam-question records need required-skill review; `19` also need exam-code review.
- `reports/blueprint-flag-triage.md`: curated backlog, `84` raw target-exercise flags triaged.
- `reports/evidence-anchor-status.md`: pass, `15` evidence anchors and `13` claims.
- `reports/procedure-coverage.md`: pass for apply+ units.
- `reports/aspects-coverage.md`: informational, remaining exam-citation gaps.
- `reports/unresolved-refs.md`: warnings only for deprecated references.
- `reports/dead-units.md`: informational scanner output; should be improved after JSON-first reports.

### Owned Sources

- `references/owned/course-blueprint-v4.md`: canonical owned curriculum-design blueprint for the currently designed year. It is partial (`year 1 of 3`) and carries metadata in `references/owned/course-blueprint-v4.meta.json`.
- Blueprint target exercises and sequencing are strong owned course-design signals.
- Blueprint prose is contextual/design rationale and cannot by itself mint or mutate machine units.

## Roadmap Phases

### Phase R0: Governance And Sprint Machinery

Goal: make reference work rollback-safe and auditable before more data work.

- `R0.1` completed: sprint execution scaffold.
- `R0.2` completed: source manifest and document inventory.

### Phase R1: Source Of Truth And Schemas

Goal: remove ambiguity about canonical data and generated projections.

Key outputs:

- `references/SOURCE_OF_TRUTH.md`
- core JSON schemas for units, terms, exam questions, source documents, evidence anchors, claims, alignment edges, reports, retrieval chunks, and reference-quality issues
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
- `R2.3` completed: interactive human review and gate closure as `hold`.
- `R2.4` completed: evidence and unit-design cleanup after the hold decision.

### Phase R3: CLI-Only Corrections

Goal: complete any missing mutation scripts, update CLI documentation, and apply reviewed corrections only through CLI.

Sprints:

- `R3.1` completed: reference CLI and documentation completion.
- `R3.2` completed: reviewed empty-needs corrections applied through CLI.

### Phase R4: Term, Exam, Blueprint, And Authored-Bucket Cleanup

Goal: turn raw backlog into production signal.

Priority work:

- migrate unit terms to canonical slugs
- close exam-question skill/code gaps
- triage blueprint missing-unit flags
- classify authored-bucket files by migration status

Sprints:

- `R4.1` completed: unit-term slug migration.
- `R4.2` completed: exam-question extraction gap closure.
- `R4.3` completed: blueprint flag triage.

### Phase R5: Evidence Anchors And Alignment Graph

Goal: connect claims to exact proof and make graph relationships explicit.

Do not let the graph become pedagogically authoritative until the alignment-graph review gate is closed.

Sprints:

- `R5.1` completed: evidence-anchor layer.
- `R5.2` completed: alignment graph.
- `R5.3` completed: alignment graph review gate.

### Phase R6: JSON-First Reports And Dashboard Data

Goal: make reports and dashboards consume structured data rather than scraping Markdown.

The reference dashboard should eventually read `reports/json/reference-health.json` or its successor, not scattered Markdown files.

Sprints:

- `R6.1` completed: JSON-first reports.
- `R6.2` completed: reference health dashboard data.

### Phase R7: RAG And Technical Retrieval Layer

Goal: deterministic, source-ranked retrieval with evaluation before any teacher-facing use.

No vector-first shortcut. Build lexical/entity/graph retrieval, evaluation, owned-source coverage, evidence-anchor density, and warning behavior first.

Sprints:

- `R7.1` completed: deterministic chunk layer.
- `R7.2` completed: hybrid retrieval.
- `R7.3` completed: retrieval evaluation set.
- `R7.4` completed: RAG review gate with `pass_with_conditions`.
- `R7.5` completed: merge readiness and main sync.
- `R7.6` planned: RAG quality hardening, retrieval eval expansion, target-exercise chunking, evidence-anchor coverage, and anchor backfill.

### Phase R9: Owned Source Integration And Content Graph

Goal: connect owned book and lesson material to the reference graph without confusing authored exposition with machine reference data.

Sprints:

- `R9.1` planned: owned source registry.
- `R9.2` planned: content graph projection.

### Phase R8: QC Issue Model

Goal: make quality issues machine-readable only where doing so improves reference and RAG trust.

Sprints:

- `R8.1` planned: scoped QC issue model.

### Phase R14: Minimal Curriculum Versioning

Goal: prevent retrieval and reports from silently mixing curriculum/source versions.

Sprint:

- `R14.1` planned: minimal curriculum versioning.

## Review Gates

| Gate | When | Subagents | Human Review | Required Before |
|---|---:|---:|---:|---|
| GATE-R1-schema | after schemas | optional | no | schema-dependent migrations |
| GATE-R2-empty-needs | before broad dependency corrections | yes | yes | authoritative prerequisite graph |
| GATE-R5-alignment-graph | before graph powers retrieval/diagnostics | yes | yes | retrieval, diagnostics |
| GATE-R7-rag | before teacher-facing RAG | yes | sampled | teacher-facing retrieval |

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
R7.5 Merge readiness and main sync
R9.0 Legacy target reference minimization
R9.01 Legacy folder rename
R9.1 Owned source registry
R9.2 Content graph projection
R7.6 RAG quality hardening
R8.1 Scoped QC issue model
R14.1 Minimal curriculum versioning
```

Do not invert this order.

## Immediate Next Sprint

Proceed with `R9.1 Owned Source Registry`.

Do not start diagnostics, adaptive routing, student-facing AI, automatic lesson sequencing, mastery decisions, summative decisions, teacher cockpit deployment, game/simulation product mapping, or continuous-improvement claims from this roadmap.

R7.4/R7.5 completion state:

- R7.4 closed as `pass_with_conditions`.
- R7.5 merged the reference foundation to `main`.
- Post-merge validation passed on `main`.
- Retrieval evaluation has 10/10 passing cases and 0 authority violations.
- RAG-01 through RAG-04 remain required quality follow-ups.
- Student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, and unreviewed student-facing publication are explicitly blocked.

R9.1 must:

- create a plan that fully operationalizes owned-source discovery and classification
- register owned sources without making generated exposition primary evidence
- update source manifest/document inventory where appropriate
- add validators and reports that make missing or stale owned-source coverage visible
- stop before mutating protected `references/machine/` or `references/external/`

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

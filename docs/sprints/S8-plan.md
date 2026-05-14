# Sprint S8: Misconception Registry MVP

## Goal

Create a small, internal-only misconception registry that makes recurring student errors retrievable for exercise design, answer-model review, and RAG context without creating student-facing diagnostics or a new authority layer.

S8 is the human-facing "Sprint 8" from the roadmap. The compact ID `S8` is used so the existing sprint bundle tooling can validate the plan.

## Context

PV-G4 is closed as `pass_with_conditions`. The lesson side now has two reconciled PV regression proofs, but the closure conditions remain active: no PV machine promotion, no student-facing PV projection, no adaptive diagnostics, no mastery routing, no sequencing, no student-facing AI, and no summative use.

R8.1 already created a scoped internal QC issue model. S8 should follow that pattern: a bounded reference overlay under `references/data/`, validator-backed, reportable, useful for internal authoring and review, and explicitly non-authoritative. The repository already has a very small `references/schemas/misconception.schema.json`; S8 should tighten and operationalize that schema rather than create a parallel concept.

The first registry pass should be deliberately small and high-value. Good seed candidates are errors already visible in repository evidence, such as treating alternative costs as price, summing all rejected alternatives instead of selecting the best non-chosen alternative, dividing a percentage change by the new value, and confusing index points with percentage changes.

## Allowed paths

- `docs/sprints/S8-plan.md`
- `references/data/sprints/S8.plan.json`
- `references/data/sprints/S8.result.json`
- `reports/sprints/S8-baseline.md`
- `reports/sprints/S8-result.md`
- `reports/sprints/S8-diff-summary.md`
- `references/schemas/misconception.schema.json`
- `references/data/misconceptions/misconception-registry.json`
- `build-scripts/references/check-misconceptions.js`
- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `build-scripts/rag/build-chunks.js`
- `build-scripts/rag/validate-chunks.js`
- generated misconception JSON/Markdown reports under `reports/json/` and `reports/markdown/`
- generated RAG chunks and retrieval-eval artifacts when produced by the normal report/RAG workflow
- generated source manifest, document inventory, URL index, and roadmap/version-index files
- `references/reference-team-roadmap.md` for sprint bookkeeping and roadmap versioning

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of a misconception registry under `references/machine/`
- mutation of PV records under `references/data/procedure-visual/` unless a later sprint explicitly authorizes it
- PV machine promotion or PV student-facing projection
- lesson-repo generated output edits
- student-facing diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative decisions
- treating misconception records as primary evidence, curriculum authority, exam authority, or scoring rules
- generating or modifying student exercises as part of S8

## Inputs

- `references/reference-team-roadmap.md`
- `docs/sprints/R8.1-plan.md`
- `references/data/qc/reference-quality-issues.json`
- `references/schemas/misconception.schema.json`
- `references/data/skill-operation-registry.json`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/unit-template-links.json`
- PV-G4 closure artifacts under `reports/review-gates/GATE-PV-G4-lesson-regression/`
- `reports/json/procedure-visual-lesson-regression-proof-intake.json`
- `reports/json/owned-content-graph.json`
- `reports/json/blueprint-flag-triage.json`
- `references/authored/didactiek-principes.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- relevant lesson-team proof reports for §1.1.1 and §1.1.2 as internal context only

## Outputs

- Tightened `misconception.schema.json` with explicit internal-only authority flags and links to units, terms, operations, evidence, procedure steps where available, and affected surfaces.
- Small seed registry under `references/data/misconceptions/`.
- Read-only misconception validator.
- JSON-first misconception report and Markdown projection.
- Reference-health hook that reports counts and boundary flags without turning misconceptions into gates.
- RAG hook through generated report chunks with diagnostic/non-authority labels preserved.
- Sprint plan, baseline, result, diff summary, and sprint metadata.
- Roadmap/version-index update.

## Operationalized sprint procedure

1. Record this plan and baseline before changing the existing misconception schema. Stop if PV-G4 conditions are not visible in the roadmap or gate closure artifacts.
2. Inspect the existing minimal `misconception.schema.json`, R8.1 QC model, PV-G4 closure conditions, procedure-contract reports, and current misconception references in owned content/report outputs.
3. Tighten the schema around a bounded record shape: stable ID, Dutch title, misconception statement, correct conception, common trigger, linked unit IDs, optional term IDs, optional operation IDs, optional `formal_step_id` anchors, evidence references, affected surfaces, status, severity, owner, and explicit authority flags.
4. Seed only a small number of high-value misconceptions with repository evidence. Stop if a proposed record has no traceable evidence path or would require speculation from generated output alone.
5. Add a read-only validator that checks schema validity, ID uniqueness, linked-unit existence, evidence-path existence, internal-only authority flags, and absence of forbidden product-use flags.
6. Add a generated JSON/Markdown report and reference-health/RAG hooks. The report must label records as diagnostic design context, not primary evidence or student-facing diagnosis.
7. Regenerate reports and RAG chunks through the normal platform workflow. Do not hand-patch generated reports or chunks.
8. Run the acceptance tests. Stop if any output implies student diagnostics, adaptive use, mastery routing, summative scoring, PV projection, or machine-registry authority.
9. Record the result and diff summary. Mark S8 complete only after the sprint bundle checker passes with `--complete`.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S8-plan.md
node build-scripts/sprints/check-sprint-bundle.js S8
node build-scripts/references/check-misconceptions.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/rag/run-retrieval-evals.js
node build-scripts/rag/validate-retrieval-eval-results.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/check-sprint-bundle.js S8 --complete
```

## Rollback plan

Revert the S8 implementation commit. That removes the tightened schema, misconception registry, validator, generated reports, reference-health/RAG hooks, regenerated artifacts, roadmap update, and sprint result files.

No protected reference rollback should be needed because S8 must not edit `references/machine/` or `references/external/`.

## Human review required

No full HCS gate is required for S8 as planned. This sprint is an internal diagnostic overlay and validator/report sprint.

Human review becomes required if implementation proposes any of the blocked uses: student-facing diagnostics, adaptive routing, mastery decisions, sequencing, summative scoring, student-facing AI, PV projection, PV machine promotion, or treating misconception records as curriculum/exam authority.

# Research Agent Map

Agent-executable navigation and search specification for the 4veco platform reference corpus.

This map is for research agents that need to inspect the full `references/` folder: external curriculum/exam sources, authored judgement references, machine registries, QC prompts, and the reference roadmap. It replaces the old-project corpus map.

## Minimal Research Guidance

The reference corpus answers questions about what the platform should teach, why it should teach it, how it proves alignment, and which quality issues remain open.

Use the whole `references/` tree as the research surface:

- `references/external/` for outside authority: CvTE syllabus, exam papers, inspection standards, and school standards.
- `references/machine/` for the canonical machine-readable registries: micro teaching units and terms.
- `references/authored/` for expert judgement, didactic principles, question-type design, and legacy hand-maintained references.
- `references/qc-prompts/` for versioned audit prompts that define how reference quality is reviewed.
- `references/reference-team-roadmap.md` for current reference-team planning and sprint state.

Generated reports under `reports/` are useful evidence of current health, but this map is centered on `references/`. When a report and a reference file disagree, inspect the reference source and the report generator before drawing a conclusion.

## Access Layer

Primary access is local filesystem access from the repository root:

```text
C:\Projects\4veco\4veco-platform
```

All paths in this document are relative to that root. Use forward slashes in written notes and generated path lists.

Research agents may search the entire references folder:

```powershell
rg -n "<query>" references
rg --files references
```

Agents may also inspect directly related support files when needed:

- `build-scripts/references/` for reference mutation and extraction contracts.
- `build-scripts/reports/` for report-generation logic.
- `reports/` for generated quality, coverage, and drift reports.
- `knowledge/platform-team-roadmap.md` when platform/reference ownership boundaries matter.
- `knowledge/three-month-roadmap.md` when the high-level program split matters.

Do not search unrelated source or lesson-output folders unless the research task explicitly requires cross-checking citations, generated output, or platform behavior.

## Entry Points

Human-readable:

- `references/reference-team-roadmap.md`
- `references/authored/README.md`
- `references/external/README.md`
- `references/external/exams/README.md`
- `references/machine/README.md`
- `references/qc-prompts/README.md`
- `build-scripts/references/README.md`

Machine-readable:

```json
{
  "entry_points": [
    "references/machine/micro-teaching-units.json",
    "references/machine/begrippen.json",
    "references/external/syllabus-eindtermen.json",
    "references/external/exam-questions.json",
    "references/authored/course-target-exercises.json"
  ]
}
```

## Machine Index

```json
{
  "path_root": "references/",
  "layers": [
    "references/external",
    "references/machine",
    "references/authored",
    "references/qc-prompts"
  ],
  "preferred_start": "references/reference-team-roadmap.md",
  "primary_machine_registries": [
    "references/machine/micro-teaching-units.json",
    "references/machine/begrippen.json"
  ],
  "primary_external_sources": [
    "references/external/syllabus-eindtermen.json",
    "references/external/exam-questions.json",
    "references/external/exams"
  ]
}
```

## Path Registry

```json
{
  "declared_path_namespaces": [
    "references",
    "references/authored",
    "references/external",
    "references/external/exams",
    "references/machine",
    "references/qc-prompts",
    "build-scripts/references",
    "build-scripts/reports",
    "reports"
  ],
  "roadmap_paths": [
    "references/reference-team-roadmap.md"
  ],
  "readme_paths": [
    "references/authored/README.md",
    "references/external/README.md",
    "references/external/exams/README.md",
    "references/machine/README.md",
    "references/qc-prompts/README.md",
    "build-scripts/references/README.md"
  ],
  "external_authority_paths": [
    "references/external/syllabus-economie-vwo-2026-versie-2.pdf",
    "references/external/syllabus-eindtermen.md",
    "references/external/syllabus-eindtermen.json",
    "references/external/exam-questions.json",
    "references/external/inspectie-standaarden.md",
    "references/external/amstelveencollege_quality_standards.md",
    "references/external/exams"
  ],
  "machine_registry_paths": [
    "references/machine/micro-teaching-units.md",
    "references/machine/micro-teaching-units.json",
    "references/machine/begrippen.md",
    "references/machine/begrippen.json"
  ],
  "authored_reference_paths": [
    "references/authored/course-target-exercises.json",
    "references/authored/didactiek-principes.md",
    "references/authored/economic_mathematical_precision_reference.md",
    "references/authored/economie-terminologie.md",
    "references/authored/skill-categories.md",
    "references/authored/vraagtypen-en-opgaveontwerp.md"
  ],
  "qc_prompt_paths": [
    "references/qc-prompts/probe-questions.md",
    "references/qc-prompts/exam-derived-skills.md",
    "references/qc-prompts/tree-integrity-audit.md",
    "references/qc-prompts/foundation-audit.md"
  ],
  "related_report_paths": [
    "reports/dag-integrity.md",
    "reports/terminology-drift.md",
    "reports/unresolved-refs.md",
    "reports/needs-coverage.md",
    "reports/terms-coverage.md",
    "reports/procedure-coverage.md",
    "reports/aspects-coverage.md",
    "reports/dead-units.md",
    "reports/begrippen-coverage.md"
  ]
}
```

## Agent Traversal Protocol

Agents MUST follow this sequence:

1. Load `references/reference-team-roadmap.md`.
   - Identify current reference sprint priorities.
   - Identify whether the task is cataloging, evidence lookup, quality control, or improvement planning.
2. Load the relevant README files:
   - Always load `references/machine/README.md` before interpreting machine registries.
   - Always load `references/external/README.md` before interpreting external authority files.
   - Load `references/external/exams/README.md` for exam-paper questions.
   - Load `references/qc-prompts/README.md` for QC prompt or audit questions.
   - Load `references/authored/README.md` for expert-judgement or didactic references.
3. Search the whole references tree with `rg` before narrowing:

```powershell
rg -n "<Dutch or English search term>" references
rg -n "<unit_id|term_slug|exam_code|question_type>" references
```

4. For machine registry questions, inspect both markdown and JSON:
   - JSON is the machine-consumed form.
   - Markdown is the human-readable projection.
   - If they disagree, report the mismatch and inspect `build-scripts/references/`.
5. For evidence and alignment questions, follow the evidence hierarchy:
   - real CvTE exam questions and correction models
   - course target exercises
   - current machine units and term registry
   - syllabus eindtermen for grouping and coverage
   - authored didactic judgement
6. For quality status questions, inspect related reports after the reference source:
   - coverage reports
   - drift reports
   - unresolved-reference report
   - QC run outputs if present
7. Label output as one of:
   - verified from reference source
   - inferred from generated report
   - interpretation
   - proposal
   - unresolved issue

## Dependency Flow

```text
external authority + authored judgement -> machine registries -> reports/QC -> roadmap/planning
```

Rules:

- `references/external/` is outside authority, not platform-authored content.
- `references/authored/` is expert judgement and legacy hand-maintained knowledge.
- `references/machine/` is canonical for platform-consumed units and terms.
- `references/qc-prompts/` defines review methods; it does not itself prove content quality.
- Reports under `reports/` are derived views and should not replace source inspection.

## Research Task Routing

```json
{
  "reference_planning": [
    "references/reference-team-roadmap.md",
    "knowledge/platform-team-roadmap.md",
    "reports/internal-dashboard/dashboard-data.json"
  ],
  "unit_catalog_search": [
    "references/machine/micro-teaching-units.json",
    "references/machine/micro-teaching-units.md",
    "reports/dag-integrity.md",
    "reports/needs-coverage.md",
    "reports/procedure-coverage.md"
  ],
  "term_catalog_search": [
    "references/machine/begrippen.json",
    "references/machine/begrippen.md",
    "references/authored/economie-terminologie.md",
    "reports/terminology-drift.md",
    "reports/begrippen-coverage.md"
  ],
  "exam_alignment": [
    "references/external/exams",
    "references/external/exam-questions.json",
    "references/external/syllabus-eindtermen.json",
    "references/authored/vraagtypen-en-opgaveontwerp.md",
    "references/authored/course-target-exercises.json"
  ],
  "inspection_and_accountability": [
    "references/external/inspectie-standaarden.md",
    "references/external/amstelveencollege_quality_standards.md",
    "references/external/syllabus-eindtermen.md",
    "reports/unresolved-refs.md"
  ],
  "didactic_efficiency": [
    "references/authored/didactiek-principes.md",
    "references/authored/skill-categories.md",
    "references/authored/course-target-exercises.json",
    "references/machine/micro-teaching-units.json"
  ],
  "quality_control": [
    "references/qc-prompts",
    "reports/qc",
    "reports/dag-integrity.md",
    "reports/terminology-drift.md",
    "reports/dead-units.md"
  ],
  "reference_pipeline": [
    "build-scripts/references/README.md",
    "build-scripts/references",
    "build-scripts/reports"
  ]
}
```

## Agent Rules

Agents MAY:

- Search the entire `references/` folder.
- Read every file under `references/`, including PDFs when the task requires exam or syllabus evidence.
- Use related generated reports to understand current known issues.
- Use `build-scripts/references/README.md` to understand how machine references should be changed.
- Propose new issue categories while cataloging reference improvements.

Agents MUST:

- Read the relevant README before making claims about a bucket's meaning or edit policy.
- Treat `references/machine/` as machine-edited and read-only for research purposes.
- Treat `references/external/` as mirrored outside authority and read-only for research purposes.
- Ground factual claims in a concrete path, report, or performed verification step.
- Prefer Dutch search terms for curriculum content, term names, question types, and exam text.
- Keep references research separate from lesson-material production unless the task explicitly asks for a cross-check.
- Record uncertainty when a source is missing, stale, generated, or only inferential.

Agents MUST NOT:

- Hand-edit `references/machine/*`.
- Hand-edit `references/external/*`.
- Mint, update, merge, split, or deprecate units by editing files directly.
- Treat syllabus text as sufficient reason to create a teaching unit without exercise or exam evidence.
- Treat generated reports as primary evidence when the underlying reference source is available.
- Crawl unrelated lesson output or legacy module folders by default.
- Present unsupported inspection, exam, didactic, or quality conclusions as fact.

## Layer Semantics

```json
{
  "references/external": {
    "purpose": "mirrored or extracted outside authority: CvTE, inspection, school standards, exam papers",
    "edit_policy": "machine-refresh only; no hand-edits",
    "preferred_use": "evidence, accountability, exam and syllabus alignment"
  },
  "references/machine": {
    "purpose": "canonical platform-consumed registries for teaching units and terms",
    "edit_policy": "CLI-only through build-scripts/references; no hand-edits",
    "preferred_use": "unit lookup, dependency analysis, term lookup, platform coverage"
  },
  "references/authored": {
    "purpose": "human-authored expert judgement and legacy reference material",
    "edit_policy": "hand-edits allowed for now, but candidates for migration",
    "preferred_use": "didactic judgement, question design, precision standards, target exercises"
  },
  "references/qc-prompts": {
    "purpose": "versioned prompts that define reference quality-control audits",
    "edit_policy": "policy changes only; do not edit mid-run",
    "preferred_use": "quality triage and audit design"
  },
  "reports": {
    "purpose": "generated health, coverage, drift, and QC reports",
    "edit_policy": "regenerate where possible",
    "preferred_use": "current issue detection and dashboard evidence"
  }
}
```

## Failure Handling

If a file cannot be read:

1. Verify the path with `rg --files references`.
2. Check whether the file moved between buckets.
3. Check the relevant README for the current source of truth.
4. Search by ID, slug, exam code, or distinctive title across all `references/`.
5. If the missing file is a generated report, inspect its generator under `build-scripts/reports/`.
6. If the missing file is a machine reference projection, inspect `build-scripts/references/README.md`.
7. Stop if the required evidence source is unavailable and no declared fallback exists.
8. Report unavailable evidence as unavailable, not absent from the corpus.

## Output Constraints

- Cite or name supporting paths for factual findings.
- Separate evidence, interpretation, proposal, and unresolved issue lists.
- For reference-quality issue logs, include: issue id, title, quality category, evidence path, affected reference surface, severity, status, next action, target sprint or defer/reject decision, and proof required to close.
- Keep internal technical categories inside developer-facing reports and dashboards.
- Do not write public-facing lesson text from this map. This file is for research navigation, not student material production.

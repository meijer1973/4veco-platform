# Research Agent Map - References

Agent-executable access and traversal specification for the `4veco-platform` reference corpus.

This file is for remote research agents. It is not just a repository orientation note: every path below is intended to be fetchable through raw GitHub URL construction or readable through a GitHub connector.

## Minimal Research Guidance

The reference corpus answers:

- what the platform should teach
- why it should teach it
- which owned course-design sources define intended lesson structure
- which evidence proves exam, inspection, and school alignment
- which machine registries the platform consumes
- which reference-quality issues remain open

The core research surface is the full `references/` folder.

Generated reports under `reports/` are useful derived evidence, but reports do not replace source inspection. When a report and a reference source disagree, inspect the reference source and the report generator before drawing a conclusion.

## Access Layer

Repository:

```text
https://github.com/meijer1973/4veco-platform
```

Raw base URL:

```text
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/
```

Agents MUST construct file URLs as:

```text
<raw_base_url><relative_path>
```

Example:

```text
references/reference-team-roadmap.md ->
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
```

Access rules:

- All file references in this document are relative paths from the repository root.
- Use forward slashes in constructed URLs.
- Preserve spaces in relative paths; URL-encode them only when required by the HTTP client.
- Directories are path namespaces, not fetch targets.
- Fetch files only by declared path, declared namespace search, or declared path template.
- If raw URL access fails, retry through authenticated GitHub connector access before concluding the file is unavailable.

## Entry Points

Human-readable:

- `RESEARCH_AGENT_PROMPT_REFERENCES.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `references/authored/README.md`
- `references/owned/README.md`
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
    "references/owned/course-blueprint-v5.meta.json",
    "references/authored/course-target-exercises.json",
    "docs/roadmaps/roadmap-version-index.json",
    "reports/internal-dashboard/dashboard-data.json"
  ]
}
```

entry_points (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exams/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/references/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/syllabus-eindtermen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exam-questions.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.meta.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/course-target-exercises.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

URL index (single fetch unlocks the rest of the surface):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/url-index.md

## Index Anchors

4veco does not yet have one central curation manifest. Use these files as manifest-like navigation anchors.

```json
{
  "reference_team_plan": "references/reference-team-roadmap.md",
  "roadmap_version_index": "docs/roadmaps/roadmap-version-index.json",
  "machine_unit_index": "references/machine/micro-teaching-units.json",
  "machine_term_index": "references/machine/begrippen.json",
  "syllabus_index": "references/external/syllabus-eindtermen.json",
  "exam_question_index": "references/external/exam-questions.json",
  "owned_course_blueprint": "references/owned/course-blueprint-v5.md",
  "owned_course_blueprint_meta": "references/owned/course-blueprint-v5.meta.json",
  "target_exercise_index": "references/authored/course-target-exercises.json",
  "dashboard_index": "reports/internal-dashboard/dashboard-data.json"
}
```

index_anchors (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/syllabus-eindtermen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exam-questions.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.meta.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/course-target-exercises.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

Use these index anchors before free-form browsing. They reduce inference and connect source evidence to derived registries.

## Path Registry

```json
{
  "root": "https://raw.githubusercontent.com/meijer1973/4veco-platform/main/",
  "declared_path_namespaces": [
    "references",
    "references/authored",
    "references/owned",
    "references/external",
    "references/external/exams",
    "references/machine",
    "references/qc-prompts",
    "build-scripts/references",
    "build-scripts/reports",
    "reports",
    "reports/internal-dashboard"
  ],
  "roadmap_paths": [
    "references/reference-team-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "knowledge/old/platform-team-roadmap.md",
    "knowledge/old/three-month-roadmap.md"
  ],
  "readme_paths": [
    "references/authored/README.md",
    "references/owned/README.md",
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
  "owned_reference_paths": [
    "references/owned/README.md",
    "references/owned/course-blueprint-v5.md",
    "references/owned/course-blueprint-v5.meta.json"
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
    "reports/begrippen-coverage.md",
    "reports/internal-dashboard/dashboard-data.json"
  ]
}
```

path_registry (full URLs):

roadmap_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/three-month-roadmap.md

readme_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exams/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/references/README.md

external_authority_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/syllabus-economie-vwo-2026-versie-2.pdf
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/syllabus-eindtermen.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/syllabus-eindtermen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exam-questions.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/inspectie-standaarden.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/amstelveencollege_quality_standards.md

machine_registry_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.json

authored_reference_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/course-target-exercises.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/didactiek-principes.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/economic_mathematical_precision_reference.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/economie-terminologie.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/skill-categories.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/vraagtypen-en-opgaveontwerp.md

owned_reference_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.meta.json

qc_prompt_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/probe-questions.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/exam-derived-skills.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/tree-integrity-audit.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/qc-prompts/foundation-audit.md

related_report_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/dag-integrity.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/terminology-drift.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/unresolved-refs.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/needs-coverage.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/terms-coverage.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/procedure-coverage.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/aspects-coverage.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/dead-units.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/begrippen-coverage.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

## Path Construction

Use these templates only after loading the relevant index or README.

```json
{
  "raw_file": "<raw_base_url>{relative_path}",
  "exam_pdf": "references/external/exams/{exam_file_from_task_or_exam_readme}",
  "machine_unit": "references/machine/micro-teaching-units.json -> find unit by id",
  "machine_term": "references/machine/begrippen.json -> find term by slug or label",
  "syllabus_eindterm": "references/external/syllabus-eindtermen.json -> find eindterm by code",
  "exam_question": "references/external/exam-questions.json -> find question by exam metadata, question id, skill id, or exam code",
  "target_exercise": "references/authored/course-target-exercises.json -> find exercise by book/chapter/paragraph metadata",
  "owned_course_blueprint": "references/owned/course-blueprint-v5.md -> find blueprint paragraph, chapter, target exercise, or difficulty note"
}
```

If a constructed path fails, apply `Failure Handling`.

## Layer Semantics

```json
{
  "references/external": {
    "epistemic_role": "outside authority",
    "contains": "CvTE syllabus, extracted eindtermen, exam papers, inspection standards, school standards",
    "preferred_use": "primary evidence for exam, syllabus, inspection, and school-alignment claims",
    "edit_policy": "machine-refresh or source-refresh only; no hand edits"
  },
  "references/authored": {
    "epistemic_role": "expert judgement and legacy hand-maintained knowledge",
    "contains": "didactic principles, target exercises, question-type design, precision standards",
    "preferred_use": "didactic interpretation, teaching-efficiency reasoning, target exercise anchors",
    "edit_policy": "hand-edits allowed for now, but candidates for migration"
  },
  "references/owned": {
    "epistemic_role": "owned curriculum-design source",
    "contains": "platform-created course blueprint and later owned lesson/source registries",
    "preferred_use": "course design, target-exercise alignment, paragraph sequencing, RAG source coverage, projection edges",
    "edit_policy": "versioned owned-source edits; do not treat owned prose as external authority or machine registry data"
  },
  "references/machine": {
    "epistemic_role": "canonical platform-consumed registry layer",
    "contains": "micro teaching units and term registry",
    "preferred_use": "unit lookup, dependency reasoning, term lookup, coverage analysis",
    "edit_policy": "CLI-only through build-scripts/references; no hand edits"
  },
  "references/qc-prompts": {
    "epistemic_role": "quality-control method layer",
    "contains": "versioned audit prompts",
    "preferred_use": "quality triage design and audit scope",
    "edit_policy": "policy changes only; do not edit mid-run"
  },
  "reports": {
    "epistemic_role": "derived health and synthesis layer",
    "contains": "coverage, drift, integrity, unresolved-reference, QC, and dashboard outputs",
    "preferred_use": "issue discovery and current status checks, not primary evidence",
    "edit_policy": "regenerate where possible"
  },
  "roadmaps": {
    "epistemic_role": "planning and ownership layer",
    "contains": "sprints, status, priorities, handoffs",
    "preferred_use": "roadmap implications and ownership routing",
    "edit_policy": "planning updates only"
  }
}
```

## Evidence Hierarchy

Use this hierarchy when evidence conflicts:

1. Real CvTE exam questions and correction models in `references/external/exams/` and `references/external/exam-questions.json`.
2. Blueprint target exercises and owned course design in `references/owned/course-blueprint-v5.md`, plus structured target exercises in `references/authored/course-target-exercises.json`.
3. Machine registries in `references/machine/`.
4. CvTE syllabus/eindtermen in `references/external/syllabus-eindtermen.json` for grouping and coverage, not automatic unit creation.
5. Authored didactic judgement in `references/authored/`.
6. Generated reports under `reports/` as diagnostic/synthesis evidence.
7. Roadmaps as planning state, not factual source evidence.

Do not mint or propose a new teaching unit from syllabus text alone. The project principle is exercise-first.

## Agent Traversal Protocol

Agents MUST follow this sequence:

1. Load this map.
2. Load `references/reference-team-roadmap.md`.
   - Identify current reference sprint priorities.
   - Identify whether the task is cataloging, evidence lookup, quality control, or improvement planning.
3. Load all relevant bucket READMEs:
   - `references/machine/README.md` before interpreting machine registries.
   - `references/external/README.md` before interpreting external authority files.
   - `references/external/exams/README.md` before interpreting exam PDFs or filenames.
   - `references/owned/README.md` before using owned course-design sources.
   - `references/authored/README.md` before using authored judgement files.
   - `references/qc-prompts/README.md` before using QC prompts.
4. Load the index anchors that match the task:
   - unit task -> `micro-teaching-units.json`
   - term task -> `begrippen.json`
   - exam task -> `exam-questions.json` and relevant exam PDFs
   - syllabus task -> `syllabus-eindtermen.json`
   - blueprint/course-design task -> `references/owned/course-blueprint-v5.md` and `references/owned/course-blueprint-v5.meta.json`
   - target-exercise task -> `course-target-exercises.json`
   - dashboard/status task -> `reports/internal-dashboard/dashboard-data.json`
5. Search declared namespaces only when indexes do not answer the question.
   - Prefer Dutch search terms for curriculum content, exam wording, terms, skills, and didactic concepts.
   - Use English terms for code, file names, planning language, and report names.
6. For machine registry questions, inspect both JSON and markdown projections.
   - JSON is machine-consumed.
   - Markdown is human-readable.
   - If they disagree, report the mismatch and inspect `build-scripts/references/`.
7. For quality status questions, inspect source first and generated reports second.
8. Label every conclusion as one of:
   - verified from source
   - verified from machine registry
   - inferred from generated report
   - interpretation
   - proposal
   - unresolved issue

## Dependency Flow

```text
external authority + owned course design + authored target exercises -> machine registries -> reports/QC -> roadmap/planning
```

Rules:

- Upstream source changes can invalidate downstream registry/report claims.
- `references/external/`, `references/owned/course-blueprint-v5.md`, and `references/authored/course-target-exercises.json` anchor what should be taught.
- Owned blueprint prose is design rationale; it cannot by itself mint a unit without exercise evidence.
- `references/machine/` is the current platform registry, not proof that the registry is complete.
- `reports/` surfaces drift and gaps; it does not settle source truth.
- `references/qc-prompts/` defines review methods; it does not itself prove content quality.

## Research Task Routing

```json
{
  "source_discovery": [
    "references/reference-team-roadmap.md",
    "references/owned/README.md",
    "references/owned/course-blueprint-v5.md",
    "references/external/README.md",
    "references/external/exams/README.md",
    "references/authored/README.md"
  ],
  "owned_source_integration": [
    "references/owned/README.md",
    "references/owned/course-blueprint-v5.md",
    "references/owned/course-blueprint-v5.meta.json",
    "references/authored/course-target-exercises.json",
    "reports/blueprint-flag-triage.md"
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
    "references/owned/course-blueprint-v5.md",
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
    "references/owned/course-blueprint-v5.md",
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
    "reports/dead-units.md",
    "reports/internal-dashboard/dashboard-data.json"
  ],
  "reference_pipeline": [
    "build-scripts/references/README.md",
    "build-scripts/references",
    "build-scripts/reports"
  ],
  "roadmap_implications": [
    "references/reference-team-roadmap.md",
    "docs/roadmaps/roadmap-version-index.json",
    "knowledge/old/platform-team-roadmap.md",
    "reports/internal-dashboard/dashboard-data.json"
  ]
}
```

## Agent Rules

Agents MAY:

- Fetch files via raw GitHub URLs.
- Use authenticated GitHub connector access if raw access fails or a tool cannot read PDFs.
- Search all declared `references/` namespaces.
- Use generated reports to discover issues.
- Propose issue categories and roadmap implications.

Agents MUST:

- Load entry points and relevant READMEs before drawing conclusions.
- Ground factual claims in a concrete source path, registry path, report path, or performed verification step.
- Treat `references/machine/` as read-only for research purposes.
- Treat `references/external/` as read-only for research purposes.
- Prefer Dutch search terms for economics curriculum content.
- Report uncertainty when a source is missing, stale, generated, or only inferential.
- Report unimplemented reference CLI workflows as workflow gaps, not as permission to hand-edit machine files.

Agents MUST NOT:

- Hand-edit `references/machine/*`.
- Hand-edit `references/external/*`.
- Mint, update, merge, split, or deprecate units by editing files directly.
- Treat syllabus text as sufficient reason to create a teaching unit without exercise or exam evidence.
- Treat generated reports as primary evidence when underlying references are available.
- Crawl unrelated lesson output or legacy module folders by default.
- Present unsupported inspection, exam, didactic, or quality conclusions as fact.

## Failure Handling

If a file cannot be retrieved:

1. Retry with the constructed raw URL.
2. Verify that the relative path uses forward slashes.
3. Verify URL encoding for spaces.
4. Verify the branch is `main`.
5. Try the GitHub blob URL: `https://github.com/meijer1973/4veco-platform/blob/main/<relative_path>`.
6. Try authenticated GitHub connector access.
7. If the file is in a namespace, search that namespace by distinctive filename, unit id, term slug, exam code, or title.
8. If the missing file is a generated report, inspect `build-scripts/reports/` for its generator.
9. If the missing file is a machine projection, inspect `build-scripts/references/README.md`.
10. Stop if a required evidence source is unavailable and no declared fallback exists.
11. Report unavailable evidence as unavailable, not absent from the corpus.

## Quality Log Schema

For each reference-quality issue, record:

```json
{
  "title": "",
  "quality_category": "",
  "evidence_path_or_url": "",
  "affected_reference_surface": "",
  "severity": "",
  "status": "open",
  "next_action": "",
  "target_sprint_or_decision": "",
  "proof_required_to_close": ""
}
```

Suggested categories:

- inspection/accountability evidence
- reference quality
- didactic efficiency
- assessment and exam fit
- platform/report reliability
- production readiness
- roadmap/ownership clarity

## Output Constraints

- Cite or name supporting paths for factual findings.
- Separate evidence, interpretation, proposal, and unresolved issue lists.
- Use raw URLs or relative paths consistently.
- Keep internal technical categories inside developer-facing reports and dashboards.
- Do not write public-facing lesson text from this map. This file is for research navigation, not student material production.

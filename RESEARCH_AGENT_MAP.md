# Research Agent Map - Full Repository

Agent-executable access and traversal specification for the full `4veco-platform` repository.

This file is for remote research agents. Every path below is intended to be fetchable through raw GitHub URL construction or readable through a GitHub connector. For reference-corpus-only work, use `RESEARCH_AGENT_MAP_REFERENCES.md`.

## Minimal Research Guidance

The full repository answers:

- how platform generators, validators, engines, references, reports, skills, and source data fit together
- where a task belongs: platform code, reference corpus, lesson-build workflow, reports, or roadmap planning
- which files should be inspected before making architecture, production, or quality conclusions
- which surfaces are generated, protected, or deploy targets

Repository boundary:

- `4veco-platform` contains the platform layer: tools, game engines, build scripts, skills, validators, references, source data, roadmaps, and reports.
- Final student-facing lesson output lives in the separate `4veco-lessen` repository. Student-facing markdown, HTML, PDF, DOCX/PPTX companion files, generated assets, and book/chapter/paragraph folders must be checked there.
- Agents must not infer lesson artifact existence from platform files alone. A builder, template, reference, source CSV, roadmap item, or validator in this repo proves capability or intent, not that a generated lesson artifact currently exists.
- Agents must not infer platform capability from lesson artifacts alone. A copied `shared/` engine or generated HTML in `4veco-lessen` may be stale or deployed output; inspect this repo to understand authoring/build logic.
- For cross-repo questions, read both repository maps before concluding anything:
  - `4veco-platform/RESEARCH_AGENT_MAP.md`
  - `4veco-lessen/RESEARCH_AGENT_MAP.md`

The platform repository does not contain final student-facing book output. Student-facing markdown/PDF output is built in sibling targets such as `../4veco-lessen/`; legacy deploy output lives outside this repo.

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
AGENTS.md ->
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/AGENTS.md
```

Access rules:

- All file references in this document are relative paths from the repository root.
- Use forward slashes in constructed URLs.
- Preserve spaces in relative paths; URL-encode them only when required by the HTTP client.
- Directories are path namespaces, not fetch targets.
- Fetch files only by declared path, declared namespace search, or declared path template.
- Use exact paths from this file or `AGENT_GITHUB_ENTRY.md` when possible; these curated files are more reliable than GitHub search results.
- Use `reports/github-agent-index-platform.md` and `reports/github-agent-index-lessen.md` for file-existence checks.
- Use GitHub search mainly for discovery, not proof. Confirm discoveries by fetching exact paths or checking the generated inventory.
- If raw URL access fails, retry through authenticated GitHub connector access before concluding the file is unavailable.

## Entry Points

Human-readable:

- `RESEARCH_AGENT_PROMPT.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_PROMPT_REFERENCES.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `AGENTS.md`
- `CLAUDE.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `build-scripts/README.md`
- `agents/README.md`
- `agents/econ-companion-visual-review.md`
- `references/reference-team-roadmap.md`
- `references/SOURCE_OF_TRUTH.md`
- `knowledge/platform-team-roadmap.md`
- `knowledge/three-month-roadmap.md`

Machine-readable:

```json
{
  "entry_points": [
    "package.json",
    "references/machine/micro-teaching-units.json",
    "references/machine/begrippen.json",
    "references/external/exam-questions.json",
    "references/owned/course-blueprint-v4.meta.json",
    "references/authored/course-target-exercises.json",
    "reports/internal-dashboard/dashboard-data.json"
  ]
}
```

entry_points (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/AGENTS.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/CLAUDE.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/SOURCE_OF_TRUTH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/three-month-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/package.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exam-questions.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v4.meta.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/course-target-exercises.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

Cross-repo entry point (4veco-lessen):

- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/RESEARCH_AGENT_MAP.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/RESEARCH_AGENT_PROMPT.md

URL index (single fetch unlocks the rest of the surface):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/url-index.md

## Index Anchors

Use these anchors before free-form browsing.

```json
{
  "repo_operating_rules": "AGENTS.md",
  "local_claude_rules": "CLAUDE.md",
  "paragraph_build_guide": "BUILD-PARAGRAPH.md",
  "chapter_build_guide": "BUILD-CHAPTER.md",
  "build_script_guide": "build-scripts/README.md",
  "package_scripts": "package.json",
  "reference_map": "RESEARCH_AGENT_MAP_REFERENCES.md",
  "companion_visual_review_agent": "agents/econ-companion-visual-review.md",
  "reference_team_plan": "references/reference-team-roadmap.md",
  "platform_roadmap": "knowledge/platform-team-roadmap.md",
  "dashboard_index": "reports/internal-dashboard/dashboard-data.json"
}
```

index_anchors (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/AGENTS.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/CLAUDE.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/package.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

## Path Registry

```json
{
  "root": "https://raw.githubusercontent.com/meijer1973/4veco-platform/main/",
  "declared_path_namespaces": [
    ".claude",
    "agents",
    "build-scripts",
    "docs",
    "engines",
    "knowledge",
    "references",
    "reports",
    "scripts",
    "skills",
    "source-data",
    "tools"
  ],
  "root_policy_paths": [
    "AGENTS.md",
    "CLAUDE.md",
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md",
    "RESEARCH_AGENT_MAP.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_PROMPT.md",
    "RESEARCH_AGENT_PROMPT_REFERENCES.md"
  ],
  "roadmap_paths": [
    "references/reference-team-roadmap.md",
    "knowledge/platform-team-roadmap.md",
    "knowledge/three-month-roadmap.md",
    "docs/roadmaps"
  ],
  "engine_paths": [
    "engines/quiz-engine.js",
    "engines/quiz-ui.js",
    "engines/reasoning-engine.js",
    "engines/reasoning-ui.js",
    "engines/skilltree-engine.js",
    "engines/skilltree-ui.js",
    "engines/newsdetective-engine.js",
    "engines/newsdetective-ui.js",
    "engines/procedure-engine.js",
    "engines/procedure-ui.js",
    "engines/tests"
  ],
  "build_pipeline_paths": [
    "build-scripts/README.md",
    "build-scripts/platform",
    "build-scripts/references",
    "build-scripts/reports",
    "scripts/deploy.js",
    "scripts/check-links.js",
    "scripts/pre-push-hook.js"
  ],
  "content_workflow_paths": [
    "agents",
    "skills",
    ".claude/commands",
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md"
  ],
  "review_agent_paths": [
    "agents/README.md",
    "agents/econ-companion-visual-review.md"
  ],
  "reference_paths": [
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "references/SOURCE_OF_TRUTH.md",
    "references/reference-team-roadmap.md",
    "references/authored",
    "references/owned",
    "references/external",
    "references/machine",
    "references/qc-prompts",
    "references/schemas"
  ],
  "data_and_report_paths": [
    "source-data",
    "reports",
    "reports/internal-dashboard",
    "reports/json",
    "reports/markdown"
  ]
}
```

path_registry (full URLs):

root_policy_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/AGENTS.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/CLAUDE.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT_REFERENCES.md

roadmap_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/three-month-roadmap.md

engine_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/quiz-engine.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/quiz-ui.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/reasoning-engine.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/reasoning-ui.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/skilltree-engine.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/skilltree-ui.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/newsdetective-engine.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/newsdetective-ui.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/procedure-engine.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/engines/procedure-ui.js

build_pipeline_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/scripts/deploy.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/scripts/check-links.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/scripts/pre-push-hook.js

content_workflow_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md

review_agent_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md

reference_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/SOURCE_OF_TRUTH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md

## Layer Semantics

```json
{
  "root_guides": {
    "epistemic_role": "operating rules and workflow contracts",
    "contains": "repo policy, build workflows, prompt/map entry points",
    "preferred_use": "first stop for task routing and allowed surfaces"
  },
  "engines": {
    "epistemic_role": "runtime behavior for games and render layers",
    "contains": "JavaScript engines, UI layers, CSS, and tests",
    "preferred_use": "game behavior, UI, localStorage, and engine validation questions"
  },
  "build-scripts": {
    "epistemic_role": "generator and converter implementation",
    "contains": "platform generators, reference CLIs, report builders, templates, converters",
    "preferred_use": "how outputs are produced, regenerated, validated, or mutated through tooling"
  },
  "scripts": {
    "epistemic_role": "orchestration layer",
    "contains": "deploy, link checks, hooks, verification utilities",
    "preferred_use": "deployment and end-to-end platform checks"
  },
  "references": {
    "epistemic_role": "authority, registry, owned-source, and quality evidence layer",
    "contains": "external sources, owned course design, authored judgement, machine registries, schemas, QC prompts",
    "preferred_use": "what should be taught and what evidence supports it",
    "map": "RESEARCH_AGENT_MAP_REFERENCES.md"
  },
  "agents": {
    "epistemic_role": "bounded reviewer-role protocols",
    "contains": "agent specifications with evidence hierarchy, hard gates, verdict rules, and report formats",
    "preferred_use": "how to run specialized reviews such as companion visual review"
  },
  "skills": {
    "epistemic_role": "content-production workflow layer",
    "contains": "lesson, chapter, graph, Word, PDF, and didactic build instructions",
    "preferred_use": "how to create or validate production lesson materials"
  },
  "source-data": {
    "epistemic_role": "input data for generated games and content",
    "contains": "book-specific and legacy input data",
    "preferred_use": "data provenance for generated shells and game questions"
  },
  "reports": {
    "epistemic_role": "derived health and synthesis layer",
    "contains": "coverage, drift, integrity, dashboard, QC, and JSON/Markdown reports",
    "preferred_use": "issue discovery and current status checks, not primary evidence"
  },
  "knowledge": {
    "epistemic_role": "planning and roadmap layer",
    "contains": "platform roadmap and multi-month planning",
    "preferred_use": "priority, ownership, and sprint implications"
  }
}
```

## Agent Traversal Protocol

Agents MUST follow this sequence:

1. Load this map.
2. Load `AGENTS.md` and `CLAUDE.md`.
3. Classify the task:
   - repository orientation or architecture
   - platform generator/deploy behavior
   - engine/game behavior
   - reference/evidence research
   - lesson-production workflow
   - roadmap/status planning
   - report/dashboard quality
4. Load the matching entry points:
   - reference task -> `RESEARCH_AGENT_MAP_REFERENCES.md` and `RESEARCH_AGENT_PROMPT_REFERENCES.md`
   - paragraph production -> `BUILD-PARAGRAPH.md` plus relevant `skills/`
   - companion visual review -> `agents/econ-companion-visual-review.md`, `BUILD-PARAGRAPH.md`, rendered lesson artifacts, and the relevant source/generator files
   - chapter production -> `BUILD-CHAPTER.md` plus relevant `skills/`
   - build/deploy -> `build-scripts/README.md`, `scripts/deploy.js`, relevant `build-scripts/platform/*`
   - engine behavior -> relevant `engines/*` files and `engines/tests/*`
   - roadmap -> `knowledge/platform-team-roadmap.md`, `references/reference-team-roadmap.md`, and dashboard data
5. Search declared namespaces only after loading relevant guides and indexes.
6. Distinguish source files, generated files, and deploy/build targets before making conclusions.
7. Label every conclusion as one of:
   - verified from source
   - verified from implementation
   - verified from machine registry
   - inferred from generated report
   - interpretation
   - proposal
   - unresolved issue

## Dependency Flow

```text
external/reference evidence + owned course design + authored targets -> machine registries -> generators/reports -> platform outputs -> lesson/deploy targets
```

Rules:

- Reference truth and generated reports are different layers.
- Platform generators and scripts may write to targets outside this repo.
- `deploy.js` builds the automated layer; it does not build full paragraph/chapter materials.
- Lesson production follows `BUILD-PARAGRAPH.md` and `BUILD-CHAPTER.md`, not deploy alone.
- Legacy Module 3 is a retiring stack; do not reason new platform direction backwards into it.

## Research Task Routing

```json
{
  "repository_orientation": [
    "AGENTS.md",
    "CLAUDE.md",
    "build-scripts/README.md",
    "package.json"
  ],
  "reference_research": [
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "references/reference-team-roadmap.md",
    "references/SOURCE_OF_TRUTH.md",
    "references"
  ],
  "engine_behavior": [
    "engines",
    "engines/tests",
    "source-data",
    "build-scripts/platform"
  ],
  "deploy_pipeline": [
    "scripts/deploy.js",
    "scripts/check-links.js",
    "build-scripts/platform",
    "package.json"
  ],
  "lesson_production": [
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md",
    "agents",
    "skills",
    ".claude/commands",
    "references"
  ],
  "companion_visual_review": [
    "agents/econ-companion-visual-review.md",
    "BUILD-PARAGRAPH.md",
    "AGENTS.md",
    "references",
    "build-scripts/content",
    "build-scripts/lib",
    "build-scripts/platform",
    "engines"
  ],
  "report_dashboard": [
    "reports",
    "build-scripts/reports",
    "reports/internal-dashboard/dashboard-data.json"
  ],
  "roadmap_implications": [
    "knowledge/platform-team-roadmap.md",
    "knowledge/three-month-roadmap.md",
    "references/reference-team-roadmap.md",
    "reports/internal-dashboard/dashboard-data.json"
  ]
}
```

## Agent Rules

Agents MAY:

- Fetch files via raw GitHub URLs.
- Use authenticated GitHub connector access if raw access fails or a tool cannot read PDFs.
- Search declared repository namespaces relevant to the task.
- Use generated reports to discover issues.
- Propose issue categories and roadmap implications.

Agents MUST:

- Load entry points before drawing conclusions.
- Ground factual claims in concrete paths, URLs, or performed verification steps.
- Use `RESEARCH_AGENT_MAP_REFERENCES.md` for reference-corpus questions.
- Treat generated output and source files as separate surfaces.
- Report uncertainty when a source is missing, stale, generated, or only inferential.

Agents MUST NOT:

- Edit files. This map is for research agents.
- Hand-edit `references/machine/*` or `references/external/*`.
- Treat generated reports as primary evidence when underlying references are available.
- Crawl sibling deploy or lesson-output folders unless the task explicitly requires that target.
- Present unsupported architecture, exam, didactic, inspection, or quality conclusions as fact.

## Failure Handling

If a file cannot be retrieved:

1. Retry with the constructed raw URL.
2. Verify that the relative path uses forward slashes.
3. Verify URL encoding for spaces.
4. Verify the branch is `main`.
5. Try the GitHub blob URL: `https://github.com/meijer1973/4veco-platform/blob/main/<relative_path>`.
6. Try authenticated GitHub connector access.
7. If the file is in a namespace, search that namespace by distinctive filename, identifier, title, or script name.
8. If the missing file is generated, inspect the relevant generator under `build-scripts/`, `scripts/`, or `reports/`.
9. Stop if a required evidence source is unavailable and no declared fallback exists.
10. Report unavailable evidence as unavailable, not absent from the repository.

## Output Constraints

- Cite or name supporting paths for factual findings.
- Separate evidence, interpretation, proposal, and unresolved issues.
- Use raw URLs or relative paths consistently.
- Keep internal technical categories inside developer-facing reports and dashboards.
- Do not write public-facing lesson text from this map.

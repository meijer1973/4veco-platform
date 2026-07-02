# Research Agent Map - Full Repository

Agent-executable access and traversal specification for the full `4veco-platform` repository.

This file is for remote research agents. Every path below is intended to be fetchable through raw GitHub URL construction or readable through a GitHub connector. For reference-corpus-only work, use `RESEARCH_AGENT_MAP_REFERENCES.md`.

Freshness rule: this map, `RESEARCH_AGENT_MAP_REFERENCES.md`, `AGENT_GITHUB_ENTRY.md`, `reports/url-index.md`, and `reports/github-agent-index-*.md` must be refreshed and pushed whenever repository paths, roadmaps, generated reports, review packets, agents, skills, or source surfaces change. Off-site reviewers work from GitHub, so unpushed local map updates are not done.

## Minimal Research Guidance

The full repository answers:

- how platform generators, validators, engines, references, reports, skills, and source data fit together
- where a task belongs: platform code, reference corpus, lesson-build workflow, reports, or roadmap planning
- which files should be inspected before making architecture, production, or quality conclusions
- which surfaces are generated, protected, or deploy targets
- how official exam-question ingestion should eventually separate prompt, source annex, official correction model, operation decomposition, MTU mapping, and lesson-build handoff

Repository boundary:

- `4veco-platform` contains the platform layer: tools, game engines, build scripts, skills, validators, references, source data, roadmaps, and reports.
- Final student-facing lesson output lives in the separate `4veco-lessen` repository. Student-facing markdown, HTML, PDF, DOCX/PPTX companion files, generated assets, and book/chapter/paragraph folders must be checked there.
- Agents must not infer lesson artifact existence from platform files alone. A builder, template, reference, source CSV, roadmap item, or validator in this repo proves capability or intent, not that a generated lesson artifact currently exists.
- Agents must not infer platform capability from lesson artifacts alone. A copied `shared/` engine or generated HTML in `4veco-lessen` may be stale or deployed output; inspect this repo to understand authoring/build logic.
- For cross-repo questions, read both repository maps before concluding anything:
  - `4veco-platform/RESEARCH_AGENT_MAP.md`
  - `4veco-lessen/RESEARCH_AGENT_MAP.md`

The platform repository does not contain final student-facing book output. Student-facing markdown/PDF output is built in sibling targets such as `../4veco-lessen/`; legacy deploy output lives outside this repo.

Product vision note: for roadmap, architecture, paragraph-build, companion,
exit-ticket, game-row, exam-ingestion, review-standard, or Scale Gate work,
load `4veco-lessen/specifications/product-vision.md` first for strategic
direction and trade-off logic, then
`4veco-lessen/specifications/product-end-state.md` for the canonical
operational route from current readiness to target-exercise readiness.

Exam-ingestion north star: a new official CvTE economics exam question should
eventually be ingestible as an external exercise record with prompt, source
material, figures/tables/graphs, official correction model, point allocation,
and answer-construction requirements kept separately traceable. Current exam
question records and overlays are not yet the full ingestion object; use
`references/reference-team-roadmap.md` for the planned EX-0 and EX-1 design
sequence before assuming broad ingestion support.

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
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `docs/workflows/paragraph-lane-vocabulary.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `docs/workflows/web-companion-paragraph-lane.md`
- `docs/workflows/paragraph-quality-ref-schema-v2.md`
- `build-scripts/templates/textbook-to-companion-handoff.md`
- `build-scripts/workflows/check-paragraph-lane-scope.js`
- `build-scripts/README.md`
- `agents/README.md`
- `agents/lead-reviewer-agent.md`
- `agents/pr-readiness-reviewer-agent.md`
- `agents/testing-agent.md`
- `agents/accessibility-agent.md`
- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `agents/econ-companion-visual-review.md`
- `agents/visual-qa-agent.md`
- `docs/review/pr-throughput-policy.md`
- `docs/review/pr-readiness-routing-policy.md`
- `docs/review/pr-integration-lane-policy.md`
- `docs/review/human-payload-authorization.schema.json`
- `build-scripts/review-gates/check-integration-lane-capability.js`
- `.github/workflows/cross-repo-bundle-compatibility.yml`
- `.github/workflows/authorized-bundle-integration.yml`
- `build-scripts/review-gates/cross-repo-bundle-compatibility.js`
- `build-scripts/review-gates/check-human-bundle-authorization.js`
- `build-scripts/review-gates/apply-bundle-readiness-decision.js`
- `build-scripts/review-gates/integrate-authorized-bundle.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/inspection-standards/nl-vo-evidence-model.md`
- `docs/roadmaps/roadmap-version-index.json`
- `references/SOURCE_OF_TRUTH.md`
- `knowledge/old/platform-team-roadmap.md`
- `knowledge/old/three-month-roadmap.md`

Machine-readable:

```json
{
  "entry_points": [
    "package.json",
    "references/machine/micro-teaching-units.json",
    "references/machine/begrippen.json",
    "references/external/exam-questions.json",
    "references/owned/course-blueprint-v5.meta.json",
    "references/owned/course-blueprint-v6-three-year.meta.json",
    "references/authored/course-target-exercises.json",
    "references/data/inspection-standards/source-register.json",
    "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
    "docs/review/human-payload-authorization.schema.json",
    "docs/roadmaps/roadmap-version-index.json",
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
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/product-vision.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/product-vision.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/workflows/paragraph-lane-vocabulary.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/workflows/textbook-paragraph-lane.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/workflows/web-companion-paragraph-lane.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/workflows/paragraph-quality-ref-schema-v2.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/templates/textbook-to-companion-handoff.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/workflows/check-paragraph-lane-scope.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/lead-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/pr-readiness-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/testing-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/accessibility-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/teacher-learning-quality-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/student-experience-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/visual-qa-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-throughput-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-readiness-routing-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-integration-lane-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/human-payload-authorization.schema.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/cross-repo-bundle-compatibility.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/authorized-bundle-integration.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/cross-repo-bundle-compatibility.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-human-bundle-authorization.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/apply-bundle-readiness-decision.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/integrate-authorized-bundle.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/inspection-standards-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/sprint-ledger.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/quality-standards-end-state.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/inspection-standards/nl-vo-evidence-model.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/SOURCE_OF_TRUTH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/three-month-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/package.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/micro-teaching-units.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/machine/begrippen.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/external/exam-questions.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v5.meta.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/owned/course-blueprint-v6-three-year.meta.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/authored/course-target-exercises.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/data/inspection-standards/source-register.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/data/inspection-standards/nl-vo-evidence-profile.v0.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/human-payload-authorization.schema.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

Cross-repo entry point (4veco-lessen):

- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/RESEARCH_AGENT_MAP.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/RESEARCH_AGENT_PROMPT.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/product-vision.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/product-vision.json
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/product-end-state.md
- https://raw.githubusercontent.com/meijer1973/4veco-lessen/main/specifications/companion-core-specifications.md

URL index (single fetch unlocks the rest of the surface):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/url-index.md

## Index Anchors

Use these anchors before free-form browsing.

```json
{
  "repo_operating_rules": "AGENTS.md",
  "product_vision_spec": "../4veco-lessen/specifications/product-vision.md",
  "product_vision_json": "../4veco-lessen/specifications/product-vision.json",
  "paragraph_build_guide": "BUILD-PARAGRAPH.md",
  "paragraph_lane_vocabulary": "docs/workflows/paragraph-lane-vocabulary.md",
  "textbook_paragraph_lane": "docs/workflows/textbook-paragraph-lane.md",
  "web_companion_paragraph_lane": "docs/workflows/web-companion-paragraph-lane.md",
  "paragraph_quality_ref_schema": "docs/workflows/paragraph-quality-ref-schema-v2.md",
  "textbook_to_companion_handoff_template": "build-scripts/templates/textbook-to-companion-handoff.md",
  "paragraph_lane_scope_checker": "build-scripts/workflows/check-paragraph-lane-scope.js",
  "chapter_build_guide": "BUILD-CHAPTER.md",
  "build_script_guide": "build-scripts/README.md",
  "package_scripts": "package.json",
  "reference_map": "RESEARCH_AGENT_MAP_REFERENCES.md",
  "lead_review_agent": "agents/lead-reviewer-agent.md",
  "pr_readiness_reviewer_agent": "agents/pr-readiness-reviewer-agent.md",
  "pr_readiness_routing_policy": "docs/review/pr-readiness-routing-policy.md",
  "pr_integration_lane_policy": "docs/review/pr-integration-lane-policy.md",
  "human_payload_authorization_schema": "docs/review/human-payload-authorization.schema.json",
  "branch_protection_checker": "build-scripts/ci/check-branch-protection.js",
  "integration_lane_capability_checker": "build-scripts/review-gates/check-integration-lane-capability.js",
  "activated_branch_protection_script": "package.json#scripts.check:branch-protection:activated",
  "authorized_pr_integration_workflow": ".github/workflows/authorized-pr-integration.yml",
  "authorized_pr_integration_runner": "build-scripts/review-gates/integrate-authorized-pr.js",
  "cross_repo_bundle_compatibility_workflow": ".github/workflows/cross-repo-bundle-compatibility.yml",
  "authorized_bundle_integration_workflow": ".github/workflows/authorized-bundle-integration.yml",
  "cross_repo_bundle_compatibility_runner": "build-scripts/review-gates/cross-repo-bundle-compatibility.js",
  "human_bundle_authorization_checker": "build-scripts/review-gates/check-human-bundle-authorization.js",
  "bundle_readiness_apply_runner": "build-scripts/review-gates/apply-bundle-readiness-decision.js",
  "authorized_bundle_integration_runner": "build-scripts/review-gates/integrate-authorized-bundle.js",
  "testing_agent": "agents/testing-agent.md",
  "accessibility_agent": "agents/accessibility-agent.md",
  "teacher_learning_quality_review_agent": "agents/teacher-learning-quality-review-agent.md",
  "student_experience_review_agent": "agents/student-experience-review-agent.md",
  "companion_visual_review_agent": "agents/econ-companion-visual-review.md",
  "visual_qa_agent": "agents/visual-qa-agent.md",
  "reference_team_plan": "references/reference-team-roadmap.md",
  "inspection_standards_roadmap": "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
  "quality_standards_sprint_ledger": "docs/roadmaps/quality-standards/sprint-ledger.md",
  "quality_standards_end_state": "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  "inspection_source_register": "references/data/inspection-standards/source-register.json",
  "nl_vo_evidence_profile": "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
  "nl_vo_evidence_model": "docs/inspection-standards/nl-vo-evidence-model.md",
  "roadmap_version_index": "docs/roadmaps/roadmap-version-index.json",
  "platform_roadmap": "knowledge/old/platform-team-roadmap.md",
  "dashboard_index": "reports/internal-dashboard/dashboard-data.json"
}
```

index_anchors (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/AGENTS.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/package.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/lead-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/pr-readiness-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-readiness-routing-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-integration-lane-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/human-payload-authorization.schema.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/authorized-pr-integration.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-integration-lane-capability.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/integrate-authorized-pr.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/cross-repo-bundle-compatibility.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/authorized-bundle-integration.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/cross-repo-bundle-compatibility.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-human-bundle-authorization.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/integrate-authorized-bundle.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/testing-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/accessibility-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/teacher-learning-quality-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/student-experience-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/visual-qa-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/inspection-standards-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/sprint-ledger.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/quality-standards/quality-standards-end-state.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/reports/internal-dashboard/dashboard-data.json

## Path Registry

```json
{
  "root": "https://raw.githubusercontent.com/meijer1973/4veco-platform/main/",
  "declared_path_namespaces": [
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
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md",
    "RESEARCH_AGENT_MAP.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "RESEARCH_AGENT_PROMPT.md",
    "RESEARCH_AGENT_PROMPT_REFERENCES.md"
  ],
  "roadmap_paths": [
    "references/reference-team-roadmap.md",
    "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    "docs/roadmaps/quality-standards/sprint-ledger.md",
    "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    "docs/roadmaps/roadmap-version-index.json",
    "knowledge/old/platform-team-roadmap.md",
    "knowledge/old/three-month-roadmap.md"
  ],
  "inspection_standards_paths": [
    "docs/roadmaps/quality-standards/README.md",
    "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    "docs/roadmaps/quality-standards/sprint-ledger.md",
    "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    "references/data/inspection-standards/README.md",
    "references/data/inspection-standards/source-register.json",
    "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
    "docs/inspection-standards/nl-vo-evidence-model.md"
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
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md"
  ],
  "review_agent_paths": [
    "agents/README.md",
    "agents/lead-reviewer-agent.md",
    "agents/pr-readiness-reviewer-agent.md",
    "agents/testing-agent.md",
    "agents/accessibility-agent.md",
    "agents/teacher-learning-quality-review-agent.md",
    "agents/student-experience-review-agent.md",
    "agents/econ-companion-visual-review.md",
    "agents/visual-qa-agent.md"
  ],
  "pr_governance_paths": [
    ".github/workflows/authorized-pr-integration.yml",
    ".github/workflows/cross-repo-bundle-compatibility.yml",
    ".github/workflows/authorized-bundle-integration.yml",
    "docs/review/pr-throughput-policy.md",
    "docs/review/pr-readiness-routing-policy.md",
    "docs/review/pr-integration-lane-policy.md",
    "docs/review/human-payload-authorization.schema.json",
    "build-scripts/review-gates/pr-readiness-router.js",
    "build-scripts/review-gates/review-pr-readiness.js",
    "build-scripts/review-gates/route-and-apply-pr-readiness.js",
    "build-scripts/review-gates/apply-pr-readiness-decision.js",
    "build-scripts/review-gates/check-active-governance-wording.js",
    "build-scripts/review-gates/finalization-freshness-proof.js",
    "build-scripts/review-gates/check-human-payload-authorization.js",
    "build-scripts/review-gates/check-human-bundle-authorization.js",
    "build-scripts/review-gates/check-integration-lineage.js",
    "build-scripts/review-gates/check-integration-lane-capability.js",
    "build-scripts/review-gates/integrate-authorized-pr.js",
    "build-scripts/review-gates/cross-repo-bundle-compatibility.js",
    "build-scripts/review-gates/apply-bundle-readiness-decision.js",
    "build-scripts/review-gates/integrate-authorized-bundle.js",
    "build-scripts/ci/check-branch-protection.js"
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
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_PROMPT_REFERENCES.md

roadmap_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/roadmaps/roadmap-version-index.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/platform-team-roadmap.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/knowledge/old/three-month-roadmap.md

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
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/lead-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/testing-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/accessibility-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/teacher-learning-quality-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/student-experience-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/visual-qa-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-PARAGRAPH.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/BUILD-CHAPTER.md

review_agent_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/README.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/lead-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/pr-readiness-reviewer-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/testing-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/accessibility-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/teacher-learning-quality-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/student-experience-review-agent.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/econ-companion-visual-review.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/agents/visual-qa-agent.md

pr_governance_paths (full URLs):

- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/authorized-pr-integration.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/cross-repo-bundle-compatibility.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/.github/workflows/authorized-bundle-integration.yml
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-throughput-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-readiness-routing-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/pr-integration-lane-policy.md
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/docs/review/human-payload-authorization.schema.json
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/pr-readiness-router.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/review-pr-readiness.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/route-and-apply-pr-readiness.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/apply-pr-readiness-decision.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-active-governance-wording.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/finalization-freshness-proof.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-human-payload-authorization.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-human-bundle-authorization.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-integration-lineage.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/check-integration-lane-capability.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/integrate-authorized-pr.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/cross-repo-bundle-compatibility.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/apply-bundle-readiness-decision.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/review-gates/integrate-authorized-bundle.js
- https://raw.githubusercontent.com/meijer1973/4veco-platform/main/build-scripts/ci/check-branch-protection.js

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
    "preferred_use": "how to orchestrate review/testing and run specialized reviews such as accessibility, teacher learning quality, student experience, companion visual review, and specific visual QA"
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
2. Load `AGENTS.md`, and for product/paragraph/companion/review questions
   load the cross-repo product baselines:
   `../4veco-lessen/specifications/product-vision.md` for strategic
   direction and `../4veco-lessen/specifications/product-end-state.md` for the
   operational student route.
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
   - multi-agent review orchestration -> `agents/lead-reviewer-agent.md` plus the relevant specialist agents and evidence surfaces
   - draft-to-review PR lifecycle routing -> `agents/pr-readiness-reviewer-agent.md`, `docs/review/pr-readiness-routing-policy.md`, and the exact remote PR evidence
   - human-authorized PR integration -> `docs/review/pr-integration-lane-policy.md`, `build-scripts/review-gates/check-integration-lane-capability.js`, `.github/workflows/authorized-pr-integration.yml`, `docs/review/human-payload-authorization.schema.json`, and `build-scripts/review-gates/integrate-authorized-pr.js`; the owner-authenticated local lane is the default path, and a cloud `branch_protection_read_forbidden` result means use that local lane rather than a raw merge
   - activated integration-lane branch protection -> `docs/review/pr-integration-lane-policy.md`, `build-scripts/ci/check-branch-protection.js`, and `package.json` script `check:branch-protection:activated`
   - paired platform/lesson bundle readiness and integration -> `docs/review/pr-readiness-routing-policy.md`, `docs/review/pr-integration-lane-policy.md`, `.github/workflows/cross-repo-bundle-compatibility.yml`, `.github/workflows/authorized-bundle-integration.yml`, `build-scripts/review-gates/cross-repo-bundle-compatibility.js`, `build-scripts/review-gates/apply-bundle-readiness-decision.js`, `build-scripts/review-gates/check-human-bundle-authorization.js`, and `build-scripts/review-gates/integrate-authorized-bundle.js`
   - testing or validation evidence -> `agents/testing-agent.md`, `package.json`, and the relevant test/validator scripts
   - accessibility review -> `agents/accessibility-agent.md` plus rendered artifacts, screenshots, OCR/text evidence, and source semantics where relevant
   - teacher learning-quality review -> `agents/teacher-learning-quality-review-agent.md` plus learning goals, paragraph plan, target exercise, formative checks, differentiation paths, and student-facing artifacts
   - student-experience review -> `agents/student-experience-review-agent.md` plus rendered student-facing surfaces, screenshots, instructions, feedback states, progress cues, graphs, and text-visual links
   - paragraph production -> `BUILD-PARAGRAPH.md` plus relevant `skills/`
   - companion visual review -> `agents/econ-companion-visual-review.md`, `BUILD-PARAGRAPH.md`, rendered lesson artifacts, and the relevant source/generator files
   - specific visual QA -> `agents/visual-qa-agent.md` plus screenshots, rendered output, SVG/PDF/slide exports, or the relevant visual artifact
   - chapter production -> `BUILD-CHAPTER.md` plus relevant `skills/`
   - build/deploy -> `build-scripts/README.md`, `scripts/deploy.js`, relevant `build-scripts/platform/*`
   - engine behavior -> relevant `engines/*` files and `engines/tests/*`
   - roadmap -> `docs/roadmaps/roadmap-version-index.json`, `references/reference-team-roadmap.md`, `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`, legacy `knowledge/old/platform-team-roadmap.md`, and dashboard data
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
    "build-scripts/README.md",
    "package.json"
  ],
  "reference_research": [
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "references/reference-team-roadmap.md",
    "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    "references/SOURCE_OF_TRUTH.md",
    "references"
  ],
  "inspection_standards_research": [
    "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    "references/data/inspection-standards/source-register.json",
    "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
    "docs/inspection-standards/nl-vo-evidence-model.md",
    "references/SOURCE_OF_TRUTH.md"
  ],
  "exam_ingestion_research": [
    "AGENTS.md",
    "RESEARCH_AGENT_MAP_REFERENCES.md",
    "references/SOURCE_OF_TRUTH.md",
    "references/data/exercises/README.md",
    "references/external/exam-questions.json",
    "references/external/exams",
    "references/reference-team-roadmap.md"
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
    "references"
  ],
  "review_orchestration": [
    "agents/lead-reviewer-agent.md",
    "agents/pr-readiness-reviewer-agent.md",
    "agents",
    "AGENTS.md",
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md",
    "reports",
    "references"
  ],
  "pr_governance": [
    "AGENTS.md",
    "agents/pr-readiness-reviewer-agent.md",
    "docs/review/pr-throughput-policy.md",
    "docs/review/pr-readiness-routing-policy.md",
    "docs/review/pr-integration-lane-policy.md",
    "docs/review/human-payload-authorization.schema.json",
    ".github/workflows/authorized-pr-integration.yml",
    ".github/workflows/cross-repo-bundle-compatibility.yml",
    ".github/workflows/authorized-bundle-integration.yml",
    "build-scripts/review-gates/pr-readiness-router.js",
    "build-scripts/review-gates/review-pr-readiness.js",
    "build-scripts/review-gates/route-and-apply-pr-readiness.js",
    "build-scripts/review-gates/apply-pr-readiness-decision.js",
    "build-scripts/review-gates/check-active-governance-wording.js",
    "build-scripts/review-gates/finalization-freshness-proof.js",
    "build-scripts/review-gates/check-human-payload-authorization.js",
    "build-scripts/review-gates/check-human-bundle-authorization.js",
    "build-scripts/review-gates/check-integration-lineage.js",
    "build-scripts/review-gates/check-integration-lane-capability.js",
    "build-scripts/review-gates/integrate-authorized-pr.js",
    "build-scripts/review-gates/cross-repo-bundle-compatibility.js",
    "build-scripts/review-gates/apply-bundle-readiness-decision.js",
    "build-scripts/review-gates/integrate-authorized-bundle.js",
    "build-scripts/ci/check-branch-protection.js"
  ],
  "testing_validation": [
    "agents/testing-agent.md",
    "package.json",
    "engines/tests",
    "scripts/tests",
    "scripts",
    "build-scripts",
    "reports"
  ],
  "accessibility_review": [
    "agents/accessibility-agent.md",
    "AGENTS.md",
    "BUILD-PARAGRAPH.md",
    "build-scripts/lib",
    "build-scripts/content",
    "engines"
  ],
  "teacher_learning_quality_review": [
    "agents/teacher-learning-quality-review-agent.md",
    "AGENTS.md",
    "BUILD-PARAGRAPH.md",
    "BUILD-CHAPTER.md",
    "references",
    "skills",
    "build-scripts/content",
    "engines"
  ],
  "student_experience_review": [
    "agents/student-experience-review-agent.md",
    "AGENTS.md",
    "BUILD-PARAGRAPH.md",
    "references",
    "skills",
    "build-scripts/content",
    "build-scripts/lib",
    "build-scripts/platform",
    "engines"
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
  "specific_visual_qa": [
    "agents/visual-qa-agent.md",
    "AGENTS.md",
    "BUILD-PARAGRAPH.md",
    "build-scripts/lib",
    "build-scripts/content",
    "engines"
  ],
  "report_dashboard": [
    "reports",
    "build-scripts/reports",
    "reports/internal-dashboard/dashboard-data.json"
  ],
  "roadmap_implications": [
    "knowledge/old/platform-team-roadmap.md",
    "knowledge/old/three-month-roadmap.md",
    "references/reference-team-roadmap.md",
    "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
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

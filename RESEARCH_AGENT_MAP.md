# Repository map — 4veco Platform

Search this map for locations and relationships relevant to the question.
Operating instructions live in [AGENTS.md](AGENTS.md); remote access details
live in [AGENT_GITHUB_ENTRY.md](AGENT_GITHUB_ENTRY.md). Neither map is a required
reading sequence. Follow a cross-repository relationship only when it affects
the assignment.

## Entry points

| Question | Source or relationship |
|---|---|
| Find an exact current path | [Platform inventory](reports/github-agent-current-platform.md), [lesson inventory](reports/github-agent-current-lessen.md). These are generated snapshots; confirm existence at the commit being investigated. |
| Need literal remote URLs | [URL index](reports/url-index.md). Complete machine inventories remain in `reports/github-agent-index-platform.json` and `reports/github-agent-index-lessen.json`. |
| Author or review Part A | [Entry checklist](docs/workflows/part-a-start.md) → relevant textbook/exercise skill → [independent review and closure](docs/workflows/part-a-review.md). |
| Build Part B | [Companion runbook](docs/workflows/web-companion-paragraph-lane.md) → [artifact skill](skills/econ-companion-artifacts.md). |
| Build or repair a reasoning game | [Reasoning-game skill](skills/econ-reasoning-game.md) → [golden exemplar library](references/exemplars/product-excellence/reasoning-games/); the skill owns game design and review requirements. |
| Assemble a chapter/book | [Chapter workflow](BUILD-CHAPTER.md) → lesson chapter plan → assembler and final output. |
| Verify both lanes | [Complete paragraph workflow](BUILD-PARAGRAPH.md), [lane vocabulary](docs/workflows/paragraph-lane-vocabulary.md). |
| Fix a generator or deployment | [Build tooling](build-scripts/README.md), `scripts/deploy.js`, `engines/`, `source-data/`. Trace the lesson output back to its generator. |
| Review or merge maintenance | [Maintenance workflow](docs/review/maintenance-workflow.md). |
| Protected/product integration | [Integration policy](docs/review/pr-integration-lane-policy.md), [readiness policy](docs/review/pr-readiness-routing-policy.md), [throughput policy](docs/review/pr-throughput-policy.md). Coupled bundles use that policy's compatibility and authorization rules. |
| Refresh indexes in a lesson-first bundle | [Trusted refresh helper](build-scripts/review-gates/refresh-bundle-agent-indexes.js); called by the integration lane after the lesson merge. |

## Paragraph contracts and tools

| Ownership | Location |
|---|---|
| Part A PDF readiness | [check-part-a-pdf-readiness.js](build-scripts/workflows/check-part-a-pdf-readiness.js) |
| Paragraph type and Part A surfaces | [paragraph-types.js](scripts/lib/paragraph-types.js) |
| Opt-in Part B legacy profile | [legacy-full-companion-profile.md](docs/workflows/legacy-full-companion-profile.md); a profile within Part B, not another lane or proof of the complete product route. |
| Shared two-lane wording guardrail | [check-paragraph-workflow-wording.js](build-scripts/workflows/check-paragraph-workflow-wording.js) |
| Shared textbook renderer | [paragraph_pdf.py](build-scripts/textbook/paragraph_pdf.py) and its [thin wrapper](build-scripts/templates/template-build-paragraph-pdf.py) |
| Current foundation, snapshot and quality projection | [paragraph-records.js](build-scripts/workflows/paragraph-records.js), [quality-ref contract](docs/workflows/paragraph-quality-ref-schema-v2.md) |
| Part A plan and companion handoff | [Textbook plan template](build-scripts/templates/template-textbook-paragraph-plan.md), [handoff](build-scripts/templates/textbook-to-companion-handoff.md) |
| Lane diff ownership | [check-paragraph-lane-scope.js](build-scripts/workflows/check-paragraph-lane-scope.js) |

## Authority and curriculum

| Topic | Starting locations |
|---|---|
| Source authority and exam ingestion | [SOURCE_OF_TRUTH](references/SOURCE_OF_TRUTH.md), [exercise source guide](references/data/exercises/README.md), [reference tooling](build-scripts/references/README.md) |
| Book 2 foundation, targets and scoped holds | [Canonical outline](references/authored/book-outlines/book-2-outline.md) and [current metadata](references/authored/book-outlines/book-2-outline.meta.json); [currentness checker](build-scripts/workflows/check-book-outline-currentness.js) |
| Exercise sequence and target coverage | [Exercise builder](skills/econ-exercise-builder.md), [contract checker](build-scripts/workflows/check-part-a-exercise-authoring-contract.js) and [mutation tests](build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js) |
| Prior preview, support or mastery status | [Pedagogical boundaries](references/owned/course-blueprint-pedagogical-boundaries.md), [boundary checker](build-scripts/workflows/check-blueprint-pedagogical-boundaries.js) |
| Didactic rationale and precision | [Didactic principles](references/authored/didactiek-principes.md), [precision reference](references/authored/economic_mathematical_precision_reference.md), [graph requirements](skills/economic-graph.md) |
| Reference-corpus investigation | [Reference map](RESEARCH_AGENT_MAP_REFERENCES.md), `references/authored/`, `references/owned/`, `references/machine/`, `references/external/` |
| Product acceptance | Lesson [vision](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-vision.md), [end state](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-end-state.md), [companion specification](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/companion-core-specifications.md) |

## Current work and history

- [Open obligations](docs/maintenance/open-items.md); [reference roadmap](references/reference-team-roadmap.md).
- [Quality standards roadmaps](docs/roadmaps/quality-standards/README.md) and
  [sprint ledger](docs/roadmaps/quality-standards/sprint-ledger.md) cover inspection,
  international overlays and local expert evidence.
- [Roadmap version index](docs/roadmaps/roadmap-version-index.json) locates active
  roadmap versions. A roadmap describes intent; source and current output show implementation.
- [Golden workbench roadmap](docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md)
  links rollout work. The historical `Y1-GOLDEN-ROLLOUT-WAVE-1`
  [sealed checker](build-scripts/sprints/check-y1-golden-rollout-wave-1.js) verifies
  that capture; use the
  [maintenance policy's provenance boundary](docs/review/maintenance-workflow.md#historical-evidence-and-product-boundaries)
  before interpreting a historical capture as current proof.
- [Archive navigation](archive/README.md) locates past decisions and evidence.
  Archive status does not settle open obligations.

## Cross-repository relationships

Platform source/tool → lesson paragraph source and rendered outputs → chapter/book assembly.
Lesson `shared/` runtime copies originate in platform `engines/`.
Plans and generated inventories do not prove the corresponding output is present
or reviewed. Inspect the actual files and the evidence bound to them.

The [lesson map](https://github.com/meijer1973/4veco-lessen/blob/main/RESEARCH_AGENT_MAP.md)
locates lesson artifacts. Local paired checkout: `../4veco-lessen/`.
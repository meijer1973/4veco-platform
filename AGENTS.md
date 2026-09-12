# 4veco Platform — Agent Operating Guide

This is the shared operating guide for `4veco-platform` and `4veco-lessen`,
the VWO economics authoring platform and lesson corpus. Read this guide, then
the route relevant to the assignment. Maps and indexes are lookup tools;
they do not prescribe a reading sequence. Load additional instructions when
the work expands into their scope.

## Repository purpose and boundaries

- Platform owns engines, generators, validators, source data, shared skills,
  references and production tooling. Lessons owns authored lesson content and
  student-facing outputs under `Boek N - titel/`.
- Repair generated outputs through their source and owning platform tool.
  Copied lesson `shared/` engines are not authoritative. New work uses the
  markdown-native route; Book 1 remains frozen.
- The external legacy Module 3 target remains protected by
  [R9.0/R9.01](references/reference-team-roadmap.md). A past September 2026 date
  does not release it: changes to that target or storage need explicit authority.

## Before mutation

Use a dedicated `codex/` or `agent/` task branch and owned worktree; never
edit, commit or push on `main`. Shared anchor clones are admin clones unless
the owner explicitly authorizes a single-agent local task. Follow the
[worktree preflight](docs/review/maintenance-workflow.md#worktree-preflight)
to fetch, check governance freshness and claim ownership before editing.
Use paired worktrees under the user's task folder when both repositories change.

Do not share another active agent's worktree, override an ownership lock,
force a checkout/worktree operation, or force-push without explicit authority.
Stop and report unexpected branch movement, divergence or overlapping work.
Implementation and review PASS are not merge authority. Keep required CI and
branch protection; never use admin bypass. Use the applicable publication
route below and verify the reviewed commit before any authorized merge.

## Select the task route

| Task | Start here; follow references when applicable |
|---|---|
| Read-only investigation | Affected files and evidence. [Repository map](RESEARCH_AGENT_MAP.md) for locations; [GitHub access](AGENT_GITHUB_ENTRY.md) for remote reads. |
| Code, tooling or instruction maintenance | Affected source/tests and [maintenance workflow](docs/review/maintenance-workflow.md): relevant checks, one independent review for meaningful changes, brief PR record. |
| Textbook paragraph / Part A | [Part A checklist](docs/workflows/part-a-start.md), including existing-edition reproduction. It selects authoring, rendering and review instructions. |
| Companion paragraph / Part B | [Companion runbook](docs/workflows/web-companion-paragraph-lane.md), [companion skill](skills/econ-companion-artifacts.md) and [companion specifications](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/companion-core-specifications.md). |
| Chapter/book assembly | [BUILD-CHAPTER.md](BUILD-CHAPTER.md) and the chapter plan. |
| Complete paragraph verification | [BUILD-PARAGRAPH.md](BUILD-PARAGRAPH.md); `complete` verifies the two lanes together. |
| Roadmap, architecture, reference-system or Scale Gate | Relevant roadmap, original requirements and evidence; [product vision](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-vision.md), [end state](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-end-state.md) and [applicable planning/review procedure](agents/lead-reviewer-agent.md#roadmap-planning-and-gates). |
| Generator, engine or deployment | [Build tooling](build-scripts/README.md) and the affected lane/skill. Deploy only to the authorized target and inspect the resulting product. |
| Ordinary Part A review/publication | [Part A review and closure](docs/workflows/part-a-review.md); reuse its independent content review. |
| Protected/product gate or integration | [Throughput](docs/review/pr-throughput-policy.md), [readiness](docs/review/pr-readiness-routing-policy.md) and [integration policy](docs/review/pr-integration-lane-policy.md), including bundle procedures for coupled changes. |

There are exactly two operational lanes: Part A textbook and Part B companion;
see [lane ownership and output profiles](docs/workflows/paragraph-lane-vocabulary.md).
The companion route is `Start -> Leer -> Check -> Oefen -> Exit ticket`.
Read the matching skill explicitly before using it. Skills supply requirements
for their artifact; unrelated skills and construction recipes are not startup reading.

Cross-repository links open GitHub `main`. Locally, use the same relative path
in the adjacent `../4veco-lessen/` checkout and record the actual commits used.

## Source integrity and learning quality

Exercises lead: official CvTE questions, annexes and correction models → owned
target operations → teaching and practice. Syllabus prose groups coverage; it
does not mint units. Trace target operations to teaching, practice, evidenced
prior knowledge or justified exclusions. Use the authorized ingestion route in
[source authority](references/SOURCE_OF_TRUTH.md) and
[exam sources](references/data/exercises/README.md).

Never hand-edit `references/machine/` or machine-refreshed `references/external/`;
use their owning CLI. Authored placement does not bypass protected-source
approval. Gap reports are diagnostic, not automatic unit-minting backlogs.

Preserve dual coding, consistent procedures/terminology across surfaces, and
the applicable teaching, mathematical, accessibility and rendered-quality
requirements. Passing tests and attractive output do not establish classroom
readiness. Missing requirements need a named follow-up/blocker or an explicit
waiver with consequences; a smaller deliverable is not the full product.

## Completion and history

Use the [completion commands](build-scripts/README.md#task-completion) for
affected checks, lane scope, navigation refresh and publication status. Report
the worktree/branch/owner, committed and pushed state, PR, available CI and
remaining action. Keep intermediates outside the repository and remove task
temporary files after use.

Search current source first. `archive/` is excluded from default searches;
use [archive navigation](archive/README.md) for provenance or named historical
work. Archived instructions are not current policy, and archiving does not
close an outstanding obligation.
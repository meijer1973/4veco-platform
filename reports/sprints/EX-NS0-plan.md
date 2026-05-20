# Sprint EX-NS0: Exam Ingestion North-Star Guidance

## Goal

Make official exam-question ingestion explicit as the shared platform/lesson end-state, while keeping the current CP.6 and lesson foundation-hardening sequence intact.

This sprint is guidance and roadmap work only. It does not create exam-ingestion overlays, mutate protected reference data, ingest exam PDFs, build lesson output, close CP-6, close Year 1, or authorize diagnostics/adaptive/summative/product use.

## Context

A repository-checked report found that both repositories already point in the right direction: exercises are the source of truth, official CvTE evidence is stronger than syllabus prose, overlays protect external/authored source files, and lesson production already builds backward from target exercises. The gap is that official exam-question ingestion is not named as the shared north star, and the lesson repo maps still contain some stale v4 and pre-L-CP6A path assumptions.

The requested implementation must check live repository state before applying the report suggestions. Current verified state before edits:

- platform and lesson repos are clean and synced with `origin/main`;
- active reference roadmap is `v2.54-cp6a-lesson-side-recheck`;
- active lesson roadmap has `L1.7A` active and `L2.0` next;
- lesson Book 1 Chapter 1.3 now exists as `1.3 Hoofdstuk Aanbod en marktevenwicht`;
- the old lesson-map references to `1.3 Hoofdstuk Aanbod en kosten` and v4 as primary blueprint anchors are stale.

## Allowed paths

- `reports/sprints/EX-NS0-plan.md`
- `reports/sprints/EX-NS0-baseline.md`
- `reports/sprints/EX-NS0-result.md`
- `reports/sprints/EX-NS0-diff-summary.md`
- `reports/sprints/EX-NS0-lead-review-assignment.md`
- `reports/sprints/EX-NS0-lead-review-round1.md`
- `reports/sprints/EX-NS0-lead-review-corrections.md`
- `reports/sprints/EX-NS0-lead-review-round2.md`
- `references/data/sprints/EX-NS0.plan.json`
- `references/data/sprints/EX-NS0.result.json`
- `AGENTS.md`
- `AGENT_GITHUB_ENTRY.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `BUILD-PARAGRAPH.md`
- `references/SOURCE_OF_TRUTH.md`
- `references/data/exercises/README.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.54-cp6a-lesson-side-recheck.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/AGENT_GITHUB_ENTRY.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/L-EXNS0/`
- generated reports, maps, inventories, dashboards, GitHub-agent indexes, and URL indexes refreshed through normal scripts

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- creation of real `references/data/exam-ingestion/` overlay records
- creation of exam-ingestion schema files outside the roadmaped EX-0 sprint
- lesson paragraph, chapter, book, companion, shared-engine, PDF, HTML, DOCX, PPTX, or asset output edits
- unit minting or machine registry mutation
- target-exercise promotion to `reviewed_final`
- placeholder replacement, promotion, or finalization
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion

## Inputs

- user-provided exam-ingestion roadmap report
- `AGENTS.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `references/reference-team-roadmap.md`
- `references/SOURCE_OF_TRUTH.md`
- `references/data/exercises/README.md`
- `BUILD-PARAGRAPH.md`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/AGENT_GITHUB_ENTRY.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- live lesson folder state under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

## Outputs

- Platform guidance that names official exam-question, source-annex, and official correction-model ingestion as the long-term end-state.
- Reference roadmap update inserting EX-0 through EX-4 after CP.6e and before REF-CT3.
- Source-of-truth and exercise-overlay guidance requiring prompt/source/correction-model traceability.
- Paragraph-build guidance for exam-target paragraph plans.
- Lesson roadmap update inserting L-EX0 and L-EX1 before L2.4-TEA.
- Lesson guidance/map updates that point agents to active v5 and current Chapter 1.3 paths.
- Sprint result, diff, and review logs documenting that this sprint did not mutate protected references or generated lesson output.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before editing guidance files. Stop if either repository is dirty before implementation or if the live lesson folder state contradicts the report assumptions.
2. Verify actual platform state: reference roadmap version, current CP.6 sequence, source-of-truth policy, exercise overlay README, paragraph build guide, and repository maps. Treat report statements as proposals until confirmed by files.
3. Verify actual lesson state: roadmap active row, `course_blueprint_v5.md` existence, current Chapter 1.3 folder name, old and current Chapter 1.3/1.4 folder state, and map entry points.
4. Patch platform guidance and roadmap surfaces only. Add future EX sprints as design/pilot/review/report/mutation lanes, not as authorization to mutate protected data.
5. Patch lesson guidance and roadmap surfaces only. Add L-EX0/L-EX1 as future contract/pilot lanes, not broad production or generated-output edits.
6. Record lesson-side guidance update under `../4veco-lessen/archive/sprints/L-EXNS0/`.
7. Run acceptance validators and map/index refresh commands. Stop if roadmap version index, source manifest, document inventory, URL index, JSON reports, or sprint bundle checks fail.
8. Log lead-review assignment, round-1 review, correction pass, and round-2 recheck. Because this sprint is a documentation/roadmap update under current Codex delegation constraints, the review logs must be explicit about their evidence basis and not pretend to be a human gate.
9. Fetch/prune remotes, commit and push both repositories, and tag the platform commit. Report hashes and the next operational step.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-NS0-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-NS0
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-NS0-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-NS0 --complete
git status --short -- references/machine references/external references/authored/course-target-exercises.json references/owned/course-blueprint-v5.md
git -C ../4veco-lessen status --short
```

## Rollback plan

Revert the platform and lesson commits for this sprint. Because EX-NS0 is documentation and roadmap work only, rollback removes guidance wording, roadmap rows, map updates, sprint logs, and generated index refreshes.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or generated lesson output during rollback.

## Human review required

No human review gate is opened or closed by EX-NS0. The user supplied the report and asked for implementation after repository-state checks.

Future EX-0, EX-2, L-EX0, and any exam-target pilot closure must define their own review packets and human/lead-review requirements. EX-NS0 only makes those future lanes visible.

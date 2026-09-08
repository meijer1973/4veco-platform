# 4veco Platform — Agent Starting Instructions

4veco produces economics learning materials for bovenbouw vwo/havo, principally
4 vwo. Match your role to the assignment: content authors need economics and
teaching judgement; engineering tasks need software design, source inspection
and appropriate regression checks. This repository owns tools, engines,
validators, skills and teaching references. The sibling `../4veco-lessen`
repository owns lesson content and generated student artifacts.

## Choose the task

There are exactly two operational lanes: Part A/textbook and Part B/companion.
Use [the lane vocabulary](docs/workflows/paragraph-lane-vocabulary.md) when
classifying production work. Read the applicable route, not every route:

| Task | Starting instructions |
|---|---|
| Ordinary printed paragraph authoring/revision | [Textbook paragraph lane](docs/workflows/textbook-paragraph-lane.md), the Part A textbook plan and its teaching sources. Consult only the relevant Part A steps of [BUILD-PARAGRAPH.md](BUILD-PARAGRAPH.md) as needed. |
| Chapter production or assembly | Textbook lane plus [BUILD-CHAPTER.md](BUILD-CHAPTER.md) and the applicable chapter builder/assembler skill. |
| Companion, game, landing page or student-web work | [Companion lane](docs/workflows/web-companion-paragraph-lane.md), `skills/econ-companion-artifacts.md`, its reviewer and applicable sections of [platform/companion reference](docs/workflows/platform-and-companion-reference.md). |
| Platform engines, generators or converters | [Build-script guide](build-scripts/README.md), applicable [platform reference](docs/workflows/platform-and-companion-reference.md), source consumers and tests. |
| References, curriculum, target exercises or exam ingestion | [Source of truth](references/SOURCE_OF_TRUTH.md), relevant reference-team roadmap and authorized CLI/refresh workflow. |
| Non-trivial sprint, architecture or review gate | [Planning/review discipline](docs/workflows/task-planning-and-review.md), relevant specification, plan and prior evidence. |
| Remote review, branch/PR publication, readiness or integration | [Publication workflow](docs/review/agent-publication-workflow.md) and its linked current policies. |

`BUILD-PARAGRAPH.md` remains the complete reference for integration verification;
Part A-only work does not require companion production. Paragraph PDFs and `build_pdf.py` are normal Part A textbook outputs for human review.

## Teaching authority and product direction

Build backward from actual approved target operations, not syllabus prose.
Official CvTE questions, source annexes and correction models are the strongest
exam evidence. `references/authored/course-target-exercises.json` identifies
the active owned blueprint and target records. Preserve answer-model steps,
point allocation and source traceability. Blueprint prose and syllabus groupings
do not authorize minting machine units.

Before Book 2 content work read `references/authored/book-outlines/book-2-outline.md`
and its `.meta.json`, then run `check:book-outline-currentness` for the exact
action and paragraph/chapter, including `--require-approved` where approved use
is required. Record authority pins and action-specific hold effects in the
Part A-owned textbook plan. Stale sources or matching open holds stop that
action; an explicit resolution action is not approval of later production.
Keep the five prerequisite classifications from
`references/owned/course-blueprint-pedagogical-boundaries.md`; familiarity or
preview does not count as secure prerequisite knowledge. Use approved book
foundations for later books, and stop at planning when the required layer is absent.

Required teaching guidance stays explicit:

- `skills/econ-didactiek.md` and `references/authored/didactiek-principes.md`
  govern learning design; `references/external/amstelveencollege_quality_standards.md`
  supplies approved school preferences.
- `references/authored/economic_mathematical_precision_reference.md` governs
  precision and takes precedence in doubt; `references/authored/economie-terminologie.md`
  supplies canonical Dutch terminology.
- `skills/econ-textbook-paragraph.md`, `skills/econ-exercise-builder.md`,
  `skills/economic-graph.md`, `skills/econ-pdf-builder.md` and
  `skills/econ-quality-control.md` remain mandatory for their authoring tasks.
  Do not shorten or skip graph procedures, verification or standards.
- Preserve the Book 2+ seven-section exercise structure, paper-only completeness,
  target alignment and whole-lesson 55-minute proof. Book 1 output remains frozen.

For roadmap, architecture, paragraph-build, companion, exit-ticket, exam-ingestion
or Scale Gate decisions, use the strategic
`../4veco-lessen/specifications/product-vision.md` and operational
`../4veco-lessen/specifications/product-end-state.md` as applicable acceptance
baselines. Companion work also reads
`../4veco-lessen/specifications/companion-core-specifications.md`.
The companion route is `Start -> Leer -> Check -> Oefen -> Exit ticket`;
its advisory short check and target-equivalent exit ticket have distinct roles.
It is not the printed Part A heading sequence or permission to claim diagnostics,
mastery, grades, automatic sequencing or student use.

## Design principles

Meet the full specification within the authorized scope, with inspectable proof
of correctness and learning quality. Passing tests or producing files alone is
insufficient. Pair explanations with meaningful visuals, maintain the same
procedures, terminology and approach across related materials, and adapt visuals
to each surface. The detailed dual-coding and unified-experience requirements
remain in [Design Principles](docs/workflows/platform-and-companion-reference.md#design-principles)
and the applicable teaching skills. Do not hide missing requirements behind a
PASS or treat a bounded result as the complete product.

## Worktree and source safety

For every mutating task use one agent, one unique `codex/<task>-<YYYYMMDD>` or
`agent/<task>-<YYYYMMDD>` branch, and one dedicated worktree. Anchor clones are
administrative surfaces; do not edit them without explicit owner authorization.
Use coordinated platform/lesson worktrees under the same task directory when
both repositories change. Default root is `C:/Projects/4veco-worktrees/<task-id>`;
follow the owner's requested location.

Before edits run `git fetch --prune origin`, `git status --short --branch`,
`git branch --show-current`, and `npm.cmd run check:governance-freshness`.
Use `-- --allow-policy-edit` only for declared edits to those governance files.
Claim a clean worktree:

```text
npm.cmd run check:agent-worktree-safety -- --claim --task <task-id> --agent <agent-id> --require-prefix codex/,agent/ --require-clean
```

For lesson work use the coordinated platform checker with `--worktree <lesson-path>`.
During ongoing edits use `--check` without `--require-clean` when dirt is expected.
Never override another owner's lock, reuse a claimed worktree, switch another
agent's branch or force checkout/worktree creation without explicit authorization.
Inspect existing branches before reuse; stop and report unexpected branch changes,
behind/ahead/diverged state or shared-surface collisions. Do not commit or push
directly to `main`.

Do not hand-edit `references/machine/` or `references/external/`: use authorized
CLI or refresh/extraction workflows. Owned/authored teaching authority requires
its existing human-review process. Generated output is repaired through source,
generator and regeneration unless an explicit temporary patch is authorized.
Do not place new production logic in lessons or change retiring legacy behavior
without the applicable scope decision. Keep temporary files outside repository
roots and clean them up; retain reusable scripts in `build-scripts/` with a
clear name and `HOW TO ADAPT` header.

## Review and publication

Follow the applicable existing content reviews, quality records, rendered-output
checks and explicit specialist/human gates. Author self-checks cannot substitute
for independent review. Inspect affected calculations, graphs, answers and final
pages after repairs; report actual commands, exit codes, unresolved findings and
unavailable evidence truthfully.

Before publishing review evidence or a PR, follow the
[publication workflow](docs/review/agent-publication-workflow.md): refresh maps,
push inspectable evidence, complete structural lead review and independent
PR-readiness routing, and apply only the allowed transition. Current-head CI,
complete review-thread evidence and required human payload authorization remain
mandatory. Use the authorized serialized integration lane, never direct
`gh pr merge` or admin bypass. Paired changes use the existing bundle process.
Governance/review-policy changes require owner review; candidate rules cannot
approve themselves. Casual assent is not a formal review or merge authorization.

Finish once with the worktree/branch/lock owner, base and reviewed/current SHAs,
push/PR state, actual checks and CI, unresolved limitations, rollback where
relevant, and a concrete next action. Keep incomplete requirements visible and
stop for any required owner decision.

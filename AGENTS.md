# 4veco Platform — Agent Operating Guide

Work as a senior developer: fulfil the specification, inspect the evidence,
and fix causes rather than layering patches over an unresolved design problem.
This is the canonical shared operating guide for `4veco-platform` and
`../4veco-lessen`. Read it first, then select the task-specific route below.

For routine maintenance, use [the maintenance workflow](docs/review/maintenance-workflow.md):
relevant checks, one independent review for meaningful changes, and an authorized
ordinary PR merge with an exact-head guard. The protected/product procedures
below apply when the task touches those scopes. Branch/worktree safety applies
to every mutating task.

## Repository purpose and boundaries

- `4veco-platform` owns engines, generators, build scripts, validators, source
  data, shared skills, and review/integration tooling for VWO 4 economics.
- `../4veco-lessen` is the lesson-content and student-facing output repository.
  Build and repair generated material through platform source and tooling.
- New content follows the markdown-native `4veco-lessen/Boek N - titel/` route.
  Do not design new work around the retiring legacy converter/game stack.
- The external legacy Module 3 target remains operationally protected under
  [the reference roadmap's R9.0/R9.01 restrictions](references/reference-team-roadmap.md).
  A past "until September 2026" date is not evidence of an authorized release;
  establish explicit release authority before changing that target or its storage behavior.

## Read first — select by task

Use the affected source, relevant tests, and applicable instructions. Read the
documents in the matching row before that activity; unrelated manuals are
lookup references, not a universal startup sequence. If the task expands,
load its additional route before doing the newly included work.

For local work, linked lesson specifications live at
`../4veco-lessen/specifications/` with the same filenames as their GitHub URLs.
Cross-repository hyperlinks open GitHub `main`; use the adjacent checkout for local work.

| Task | Starting documents and scope |
|---|---|
| Read-only investigation | Affected files and relevant tests; use repository search locally. Use [RESEARCH_AGENT_MAP.md](RESEARCH_AGENT_MAP.md) as a lookup when useful, and [AGENT_GITHUB_ENTRY.md](AGENT_GITHUB_ENTRY.md) for remote access/navigation. |
| Routine code or documentation maintenance | Affected source and tests. For tooling ownership, consult [build-scripts/README.md](build-scripts/README.md). A small diff does not exempt protected, production, or governance work from its gates. |
| Roadmap, sprint, architecture, reference system, or Scale Gate | Relevant roadmap, original requirements, prior reports, source and validators; [product vision](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-vision.md) and [product end state](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-end-state.md). Apply the planning/review requirements below. |
| Textbook paragraph / Part A | [Lane vocabulary](docs/workflows/paragraph-lane-vocabulary.md), then [textbook runbook](docs/workflows/textbook-paragraph-lane.md) and its task-specific contracts. |
| Companion paragraph / Part B | [Lane vocabulary](docs/workflows/paragraph-lane-vocabulary.md), then [companion runbook](docs/workflows/web-companion-paragraph-lane.md), [companion specifications](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/companion-core-specifications.md), and [companion artifact skill](skills/econ-companion-artifacts.md). |
| Chapter or book assembly | [BUILD-CHAPTER.md](BUILD-CHAPTER.md), the chapter plan, and its applicable assembler/validation instructions. |
| Complete paragraph / cross-lane verification | [BUILD-PARAGRAPH.md](BUILD-PARAGRAPH.md) is the full reference; ordinary paragraph production starts with its lane runbook. |
| Paragraph-build, companion, exit-ticket, exam-ingestion, or product-route work | [Product vision](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-vision.md), [product end state](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-end-state.md), and the applicable workflow/specification. |
| Generated material or deployment | Applicable lane/skill plus [build-scripts/README.md](build-scripts/README.md). `scripts/deploy.js` writes its target; its automated layer alone is not full paragraph production. |
| Review or human gate | Original requirements and evidence; ordinary textbook work uses [Part A review and closure](docs/workflows/part-a-review.md). Other product gates use the [lead reviewer](agents/lead-reviewer-agent.md), relevant specialist protocol and product specifications above. |
| Maintenance PR publication or merge | [Maintenance workflow](docs/review/maintenance-workflow.md). |
| Protected/product publication or integration | [Throughput policy](docs/review/pr-throughput-policy.md), [integration lane policy](docs/review/pr-integration-lane-policy.md) and [readiness policy](docs/review/pr-readiness-routing-policy.md); use their bundle sections when runtime-coupled repositories participate. |

There are exactly two operational lanes: textbook / Part A and companion /
Part B / student-web companion. `complete` is an integration verification
state, not a third production lane. Keep source/output ownership explicit.
Paragraph PDFs and `build_pdf.py` are normal Part A textbook outputs for human review;
`publisher-print` is the later Part A chapter/book print-handoff profile.
Treat the 14 files as a validator baseline, not as proof that the full product route is complete.
The companion product route is `Start -> Leer -> Check -> Oefen -> Exit ticket`,
with an advisory short check and a separate target-equivalent exit ticket.
Missing product requirements need named follow-up work or an explicit waiver
with consequences; never silently redefine the full product as a smaller deliverable.
For engine changes, run engine tests, deploy, and test in the browser. Run the
relevant validators after generation/deployment, and keep roadmap sprint status
current when production or platform state changes.

## Branch and worktree safety — before mutation

Use one agent, one dedicated task branch, and one dedicated worktree directory.
Treat the shared anchor clones as admin clones; mutating work there requires
the owner's explicit single-agent local-task instruction. Default paired paths:

- `C:\Projects\4veco-worktrees\<task-id>\4veco-platform`
- `C:\Projects\4veco-worktrees\<task-id>\4veco-lessen`

Use a user-specified task folder when provided. Before editing files, fetch
each affected repository and run from the platform worktree:

```powershell
git fetch --prune origin
git status --short --branch
git branch --show-current
npm.cmd run check:governance-freshness
npm.cmd run check:agent-worktree-safety -- --claim --task <task-id> --agent <agent-id> --require-prefix codex/,agent/ --require-clean
```

For the lesson repository, also run its fetch/status/branch checks and repeat
the platform worktree checker with `--worktree <lesson-worktree-path>`.
Use `--check` for an existing ownership claim; omit `--require-clean` during
ongoing work only when the dirty files are expected. Governance freshness
compares active entrypoints against `origin/main`; use `-- --allow-policy-edit`
only when the declared task intentionally edits those same governance files.

1. Never work, commit, or push directly on `main`. Create a unique
   `codex/<short-task-name>-<YYYYMMDD>` or `agent/<short-task-name>-<YYYYMMDD>`
   branch before edits; inspect an existing branch before reusing it.
2. Do not share another active agent's worktree, switch its branch, or reuse
   a worktree with an unreleased ownership lock. Do not override a lock without
   explicit repository-owner instruction.
3. Do not use `git checkout -f`, `git switch -f`, `git worktree add --force`, or
   `git checkout --ignore-other-worktrees` without explicit authorization.
4. Stop and report unexpected ahead/behind/diverged state, branch movement,
   or another agent working on the same branch or sprint surface.
5. When both repositories change, use coordinated worktrees under the same
   task directory and record both paths, branches, owners, and commit SHAs.
6. Merge to `main` only through the authorized PR/integration procedure below;
   do not turn a routine implementation instruction into merge authority.

## Planning, execution, and quality

Optimize for specification fulfilment, not ticket closure. Passing tests or
producing files is insufficient when the required product or evidence is weak.

For every non-trivial task, state in the plan: the quality floor, requirements,
proof of fulfilment, applicable review gate, worthwhile improvements within
scope, and omitted requirements as named follow-ups or explicit blockers.

For non-trivial sprint, roadmap, gate, reference-system, production, or
architecture work, read the relevant roadmap, source, validators, and prior
reports; write/update and log an operational plan in the expected sprint files
before implementation. Include procedure, decisions, outputs, acceptance
checks, and stop conditions. Follow the plan, repair missing requirements before
continuing, and verify artifacts/checks before passing each review gate.
Identify the product-vision pillar, advantage/parity rationale, and proof for
future non-trivial sprints. Do not close a required review gate by inference.

Read-only investigation reports evidence and limits. Routine maintenance starts
with the affected source and relevant checks. Named roadmap sprints use the
separated-agent workflow below; production and review work use their lane and
artifact gates. Integration uses its own policy. These task routes describe
when existing procedures apply; they do not waive a gate because work is small.

Ordinary Part A paragraph/chapter work follows [Part A review and closure](docs/workflows/part-a-review.md),
including within a named roadmap sprint. Reuse its independent content review;
the additional planning/verification staffing and two lead-review rounds below
do not apply to that scope. Source approvals and publication decisions remain.

For other roadmap sprints, retain the separated-agent workflow:

- A planning/review subagent checks the outline, baselines, logs, stop
  conditions, requirements, and exact generated-output list before execution.
- The main agent executes and owns integration; specialists handle bounded
  pedagogy, evidence, data-integrity, and code-review questions as needed.
- A verification subagent checks finished artifacts, validation, plans, logs,
  and every required output.
- Before closing non-trivial roadmap sprints, record structural lead-review
  assignment, round 1, corrections, and round 2. An exemption needs an explicit
  reason, reviewer/approver, and date; do not silently disable lead review.
- Human-review gates receive lead review before the human review begins.

## Source integrity and learning quality

- Exercises are the source of truth: real CvTE questions and official answer
  models, then owned target-exercise data, built target tasks and consolidation
  exercises. Syllabus prose groups/reports coverage; it does not mint units.
- Derive MTUs and paragraph learning goals from target operations. Use official
  questions, annexes, figures, correction steps, points, and answer forms for
  exam-target planning; run the platform's authorized exam-ingestion workflow.
  Map required steps to teaching, practice, scaffolding, companion use,
  evidenced prior knowledge, or explicitly justified exclusions.
- Never hand-edit `references/machine/` or machine-refreshed
  `references/external/`. Use the owning CLI/pipeline. `references/authored/`
  permits authored edits within its authority; directory placement is not
  permission to bypass a protected-reference or review gate. Missing units use
  the reference CLI with exam codes and needs, not bulk syllabus extraction.
- Gap reports are diagnostic signals, not automatic unit-minting backlogs.
- Fix generated outputs through their source/generator and regenerate. Do not
  hand-build lesson outputs to work around platform ownership.
- Pair explanations with instructional visuals (dual coding). Preserve the
  same procedure steps, terminology, and conceptual approach across surfaces.
  Adapt visuals to slide, print, summary, and web light/dark use; textbook
  figures are source material rather than finished companion artwork.
- Establish classroom readiness and student usability with the applicable
  reviewer; attractive output and passing tests do not prove learning quality.

## Skills and specialist procedures — read when applicable

Explicitly read the matching skill and its required task-specific references
before using it. Do not assume an agent environment loads skills automatically.
The lane runbook supplies production sequencing; detailed construction recipes
belong in the skill needed for the current artifact.

| Artifact/activity | Procedure |
|---|---|
| Textbook paragraph, exercises, consolidation | [Textbook runbook](docs/workflows/textbook-paragraph-lane.md); applicable `skills/econ-textbook-paragraph.md`, `skills/econ-exercise-builder.md`, or `skills/econ-consolidation-builder.md`. |
| Companion family or regeneration | [skills/econ-companion-artifacts.md](skills/econ-companion-artifacts.md); it governs student-facing rules over conflicting builder skills. Office/legacy DOCX exports are opt-in. |
| Presentation | [skills/econ-pptx-templates.md](skills/econ-pptx-templates.md), with applicable economic-graph and didactic instructions. |
| Explanation, guided practice, news, summary | Relevant `skills/econ-explainer-docs.md`, `skills/econ-exercise-builder.md`, `skills/econ-nieuws-exercise.md`, or `skills/aanpak-samenvattingen.md`; Word exports use the Word-template skill. |
| Graph construction or PDF export | [skills/economic-graph.md](skills/economic-graph.md) or [skills/econ-pdf-builder.md](skills/econ-pdf-builder.md), respectively; preserve economic precision and rendered quality. |
| Reasoning game | [skills/econ-reasoning-game.md](skills/econ-reasoning-game.md) and [references/exemplars/product-excellence/reasoning-games/](references/exemplars/product-excellence/reasoning-games/). The old route is **legacy 5 modi**; new work uses the golden family, shared task-shell primitives, and `engines/reasoning-composer.js`, not another mode-overloaded engine. |

## Review evidence and human gates

Ordinary textbook work uses [Part A review and closure](docs/workflows/part-a-review.md).
For other scopes, use [agents/lead-reviewer-agent.md](agents/lead-reviewer-agent.md) to route
review and consolidate specification fulfilment. Use the relevant specialist:
`econ-companion-visual-review`, `visual-qa-agent`, `testing-agent`,
`accessibility-agent`, `teacher-learning-quality-review-agent`,
`student-experience-review-agent`, or the textbook paragraph review skill.
Part A and Part B keep separate review records and matching `quality-ref.yaml`
blocks under [the quality-ref contract](docs/workflows/paragraph-quality-ref-schema-v2.md).

Human review defaults to direct comments on a complete review packet. Include
calibration checks, questions, inspectable evidence, stop conditions, and comment
prompts. Record comment resolutions, decisions, and unresolved issues before
closure; use an interactive interview only on explicit reviewer request or to
resolve ambiguous/conflicting authority. A casual "OK" or "continue" is not a
review decision record or gate-closure artifact.

Interactive UI/game/route/exit-ticket gates require playable or reproducible
artifacts, state proof, screenshots of relevant initial/retry/feedback/next-action/
completed states, mobile/dark-mode proof when student-facing, and a checker for
the evidence. Use the `GATE-TASK-FAMILY-1` lab/proof pattern for game/task-shell
gates unless explicitly waived. Do not substitute source fragments for product proof.

Publish packets and every cited artifact to the normal remote branch, refresh
GitHub-facing indexes, and verify remote availability before running or sending
a human-review packet; local-only dry runs require explicit user instruction.
Cite passing `platform-ci / validate-platform` for the reviewed commit or an
explicit CI waiver where policy permits. Lighter-review packets must satisfy
[the throughput policy](docs/review/pr-throughput-policy.md) and its checker;
missing authority, changed-path, checker, CI, or lead-review proof cannot be
treated as autonomous-review eligibility.

## Publication, integration, and completion

Routine maintenance follows [the maintenance workflow](docs/review/maintenance-workflow.md).
It needs no separate readiness decision, generated authorization packet or
custom integration lane. Use relevant passing checks, one substantive review
when needed, and the task's integration authority. Verify the merge parents/tree
and useful smoke checks; do not repeat full CI solely because a reviewed tree
was merged.

Ordinary Part A reuses its completed content review for PR closure under
[its canonical route](docs/workflows/part-a-review.md), retaining applicable CI
and actual source/publication authority.

For other protected/product work using the existing gated process, after the draft
PR is published, complete structural lead
review/repairs and run the independent `npm.cmd run review:pr-readiness` route.
Apply only the allowed transition using `apply:pr-readiness`,
`route-and-apply:pr-readiness`, or `apply:bundle-readiness` as specified in
[readiness policy](docs/review/pr-readiness-routing-policy.md). A valid
`allowed_transition: MARK_READY` must be applied; owner permission is not a
separate draft-to-ready checkpoint. For `KEEP_DRAFT_BATCH`, continue the next
coherent authorized milestone. Return at human-review readiness, a genuine
pause/escalation blocker, or completed authorized closure.

For that gated process, read [the integration lane policy](docs/review/pr-integration-lane-policy.md).
Do not use direct `gh pr merge` for gated PRs or use admin bypass. Use trusted
current-main serialized `integrate:authorized-pr` / `integrate:authorized-bundle`
tooling. L0–L2 integration requires the policy's authority and exact-head proof;
L3–L4 and governance/self-modification require owner payload authorization for
the reviewed payload and scope. The lane validates the current integration head.
Do not infer authorization from CI, review evidence, or later base-sync commits.
Paired PRs require the policy's explicit bundle identity, compatibility proof,
delegated member readiness, and coordinated integration. Required platform CI
uses lesson `main`, never an implicit same-named lesson branch.

Completion obligations (apply each stated trigger):

- Fetch/prune before final commit/push; resolve unexpected behind/diverged state.
- Before closing platform workflow/tooling PRs, run `npm run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD`.
  Lesson PRs use their lane runbook's scope check against the lesson repository;
  cross-lane exceptions must be machine-readable and reviewed.
- Run relevant validation and fix navigation when paths, roadmaps, reports,
  agents, skills, or review surfaces change: `npm.cmd run agent:index`,
  `node build-scripts/sprints/emit-url-index.js`, and `npm.cmd run dashboard:internal`
  when dashboard/roadmap state changes. Keep research maps, GitHub entry, URL
  index, and `reports/github-agent-index-*.md` useful for the real layout.
  For routine maintenance these generated indexes are advisory, and commit-ID
  freshness alone must not create an integration commit.
- For non-trivial work, commit and push validated changes to the task's normal remote branch unless
  the user asks to keep them local. Publish both repositories when both change.
  Do not leave a completed sprint/generated-output task dirty without reporting
  the exact status and blocker. Protected/product governance closure also runs
  `npm.cmd run finalization:freshness` for remote-main, ancestry, and policy hashes.
- For every mutating task, report worktree paths, branches, lock owner/agent ID, local SHAs, push state,
  PR URLs (or why none), and current `platform-ci / validate-platform` status
  when available. End every non-trivial response with the next action or precise remaining blocker.
- After every task, clean up task-owned temporary files. Use OS temp or a named task folder
  outside the repository for intermediates. Preserve reusable scripts in
  `build-scripts/` with a clear name and `HOW TO ADAPT` header.

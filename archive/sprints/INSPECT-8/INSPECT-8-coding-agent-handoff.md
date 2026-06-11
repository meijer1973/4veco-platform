# INSPECT-8 Coding Agent Handoff

Status: worktree setup handoff
Date: 2026-06-10
Worktree: `C:\wt\INSPECT-8-20260610\4veco-platform`
Branch: `codex/inspect-8-dutch-evidence-scale-readiness-20260610`
Base: `origin/main` at `4ba9084d3a5a31f925a481c772ee1a23002175df`

## Mission

Start `INSPECT-8 Dutch Evidence Scale Readiness` in this isolated worktree.

INSPECT-8 is a Dutch-only planning/audit sprint. Its job is to decide which
Dutch scopes are ready for additional evidence-pack work and where the evidence
base is still weak.

This handoff is not the sprint plan. The next coding agent must create the
actual INSPECT-8 sprint plan and get planning review before implementation.

## Required First Actions

1. Read:
   - `AGENTS.md`
   - `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
   - `docs/roadmaps/quality-standards/sprint-ledger.md`
   - `docs/roadmaps/quality-standards/quality-standards-end-state.md`
   - `references/data/inspection-standards/README.md`
   - `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
   - `archive/sprints/INSPECT-7/INSPECT-7-closure-log.md`
   - `archive/sprints/QS-DUTCH-ROADMAP-1B/QS-DUTCH-ROADMAP-1B-closure-log.md`
2. Create `archive/sprints/INSPECT-8/INSPECT-8-sprint-plan.md`.
3. Get a planning review before doing the readiness audit.
4. Keep all work Dutch-only and planning/audit-only.

## Roadmap Scope

From the roadmap, INSPECT-8 outputs are expected to be:

```text
archive/sprints/INSPECT-8/
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
```

Required audit dimensions:

- paragraph and chapter scope inventory;
- target-exercise finality;
- exam-code linkage gaps;
- target-equivalent proof gaps;
- review evidence status;
- generated artifact evidence status;
- accessibility evidence status;
- differentiation/support evidence status;
- school-owned evidence still needed;
- unsafe-claim risks;
- recommended next Dutch scope.

Acceptance criteria:

- no new evidence packs are generated;
- no source claim is strengthened without reviewed evidence;
- recommended next scope is conservative and evidence-based;
- weak/missing evidence remains visible.

## Hard Boundaries

Do not do any of the following in INSPECT-8:

- implement INSPECT-9 or later;
- generate new evidence packs;
- implement report-only generators;
- add package scripts, CI/build gates, dashboard gates, quality-ref integration,
  or Scale Gate integration;
- mutate generated lesson output;
- process personal data;
- start non-Dutch standards work;
- make legal compliance, inspectorate approval, inspection-ready, complete OP0,
  or school-obligation claims.

`../4veco-lessen` remains read-only evidence unless a later explicit sprint
authorises mutation through the platform workflow.

## Language Hygiene

PR #28 was repaired because active-scope language rejected these terms:

```text
MVP
pilot
prototype
```

Do not reintroduce those words into active roadmap/sprint surfaces unless there
is a formal `## Scope Language Authorization` section with required fields.
Prefer neutral wording such as:

```text
bounded sample
bounded pack
first implementation
readiness audit
```

Run `npm.cmd run check:scope-language` before closure.

## Recommended Evidence Sources To Inspect

Start from already-merged Dutch quality-control records:

- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md`
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`
- `references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json`
- `references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json`
- `references/authored/course-target-exercises.json`
- `references/external/exam-questions.json`
- `references/external/syllabus-eindtermen.json`
- `references/data/alignment-graph.json`
- `reports/review-gates/`
- `reports/internal-dashboard/dashboard-data.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

If a path contains historical words such as `pilot` or `prototype`, treat that
as a path token only. Do not copy those terms into new active prose.

## Review Protocol

Follow the quality-standards sprint protocol:

1. sprint plan;
2. planning review before implementation;
3. implementation by main agent;
4. focused validation;
5. lead review before closure;
6. validation and closure logs;
7. final response with explicit next-step advice.

Use specialist reviewers if the audit starts making claims about evidence
quality, learning quality, accessibility, privacy, teacher-facing use, or
inspection relevance. Keep any three-reviewer external gate for later work that
prepares generator planning, evidence packs, teacher/school-facing summaries,
public claims, dashboard/report surfaces, or generated-output changes.

## Expected Validation

At minimum, before closure run:

```text
npm.cmd run check:scope-language
npm.cmd run check:platform
npm.cmd run agent:index
npm.cmd run dashboard:internal
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/check-roadmap-version-index.js
git diff --check
git -C ../4veco-lessen status --short --branch
git -C ../4veco-lessen diff --name-only
```

If generated indexes/dashboard change, stage the sprint files before
regenerating so the new records are included.

## Recommended Next Step

The next coding agent should create the INSPECT-8 sprint plan, request planning
review, and only then begin the Dutch Evidence Scale Readiness audit.

# INSPECT-9 Coding Agent Handoff

Status: next-agent handoff only
Date: 2026-06-10
Prepared from: `INSPECT-8 Dutch Evidence Scale Readiness`
Prepared on branch:
`codex/inspect-8-dutch-evidence-scale-readiness-20260610`
INSPECT-8 closure commit:
`2271bac866899364ddc8fb7e84d6b12dc7b31a14`

## Mission

Start `INSPECT-9 Dutch Evidence Gap Closure Plan` only after creating a fresh
sprint plan and getting planning review.

INSPECT-9 should convert the INSPECT-8 readiness audit into proof requirements
and correction routes. It should not generate additional evidence packs.

## Current INSPECT-8 Decision

INSPECT-8 closed with this recommendation:

```text
Do not generate an additional Dutch evidence pack yet.
Use Book 1 Chapter 1.1 first-three paragraphs as the control scope only.
Treat Book 1 Chapter 1.2 Vraag as the INSPECT-9 gap-closure candidate.
```

Primary INSPECT-8 outputs:

```text
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
archive/sprints/INSPECT-8/INSPECT-8-closure-log.md
archive/sprints/INSPECT-8/INSPECT-8-agent-activity-log.md
```

## Required First Actions

1. Create or switch to a new dedicated INSPECT-9 worktree and branch.
2. Run the repository branch/worktree safety preflight from `AGENTS.md`.
3. Read:
   - `AGENTS.md`;
   - `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`;
   - `docs/roadmaps/quality-standards/sprint-ledger.md`;
   - `docs/roadmaps/quality-standards/quality-standards-end-state.md`;
   - `references/data/inspection-standards/README.md`;
   - `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`;
   - `reports/inspection-standards/dutch-evidence-scale-readiness.md`;
   - `reports/inspection-standards/dutch-evidence-scale-readiness.json`;
   - `archive/sprints/INSPECT-8/INSPECT-8-closure-log.md`;
   - `archive/sprints/INSPECT-8/INSPECT-8-agent-activity-log.md`;
   - `archive/sprints/INSPECT-8/INSPECT-8-validation-log.md`;
   - `archive/sprints/INSPECT-8/INSPECT-8-lead-review-round2.md`.
4. Create `archive/sprints/INSPECT-9/INSPECT-9-sprint-plan.md`.
5. Get planning review before writing any gap-closure plan findings.

## Recommended INSPECT-9 Scope

Use Book 1 Chapter 1.2 `Vraag` as the first gap-closure planning candidate.

Plan proof requirements and correction routes for:

- v5 target finality for `1.2.1`, `1.2.2`, and `1.2.3`;
- reviewed integration target for `1.2.4`;
- exam-code linkage decision for `1.2.1` and `1.2.4`;
- target-equivalent proof requirements for Chapter 1.2;
- accessibility evidence requirements;
- support/differentiation evidence requirements;
- stale source freshness policy;
- product/school boundary wording.

Also decide whether the Chapter 1.1 control scope needs remediation before it
is reused:

- no target-registry exam-code links for `1.1.1`, `1.1.2`, or `1.1.3`;
- target records still `migrated_from_v4_needs_v5_review`;
- target-equivalent proof reviewed only for exact local `1.1.2`;
- rendered `1.1.2` proof from `origin/main` is still pending review and does
  not authorize product use or broad rollout.

## Hard Boundaries

Do not do any of the following in INSPECT-9 unless a fresh plan and explicit
review authority say otherwise:

- generate additional evidence packs;
- implement report-only generators;
- add package scripts;
- add CI/build gates;
- add dashboard gates;
- integrate with quality-ref;
- integrate with Scale Gate;
- mutate generated lesson output;
- process personal data;
- start non-Dutch standards work;
- make legal compliance, inspectorate approval, inspection-ready, complete
  OP0, PTA-validity, summative-validity, classroom-implementation,
  school-obligation, or school-SKA claims.

`../4veco-lessen` should remain read-only evidence unless a later explicit
sprint authorises mutation through the platform workflow.

## Evidence Sources To Reuse

Start from:

```text
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
references/authored/course-target-exercises.json
references/external/exam-questions.json
references/external/syllabus-eindtermen.json
references/data/alignment-graph.json
reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/gate-closure.md
reports/json/exit-ticket-workbench-112-rendered-1-proof.json
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md
reports/review-gates/GATE-PV-G4-lesson-regression/gate-closure.md
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/
```

If a path contains legacy wording that is restricted by scope-language policy,
treat it as a path token only. Do not copy that wording into active sprint
prose unless the scope-language authorisation policy is followed.

## Expected INSPECT-9 Output Shape

The roadmap describes INSPECT-9 as a planning and source-evidence hardening
design sprint. Likely outputs should include:

```text
archive/sprints/INSPECT-9/
reports/inspection-standards/dutch-evidence-gap-closure-plan.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.json
```

The exact outputs must be decided in the INSPECT-9 sprint plan and reviewed
before implementation.

## Review Protocol

Follow the quality-standards sprint protocol:

1. sprint plan;
2. planning review before implementation;
3. implementation by the main agent;
4. focused validation;
5. lead review before closure;
6. validation and closure logs;
7. final response with explicit next-step advice.

Use specialist reviewers if the plan starts making judgement-heavy claims
about evidence quality, learning quality, accessibility, privacy,
teacher-facing use, or inspection relevance.

If INSPECT-9 begins preparing generator planning, additional evidence packs,
teacher/school-facing summaries, public claims, dashboard/report surfaces
beyond the named gap-closure reports, quality-ref integration, Scale Gate
integration, or generated-output changes, stop and require the applicable
review gate.

## Recommended Validation

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

If generated indexes/dashboard change, stage the sprint/report files before
regenerating so the new records are included.

## Recommended Next Step

The next coding agent should create the INSPECT-9 sprint plan, request
planning review, and only then begin the Dutch Evidence Gap Closure Plan.

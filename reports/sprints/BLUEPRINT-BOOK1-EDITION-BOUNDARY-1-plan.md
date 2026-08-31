# Sprint BLUEPRINT-BOOK1-EDITION-BOUNDARY-1: Book 1 Edition Boundary and Part A Compatibility Repair

Status: repair planning
Created: 2026-08-30
Repaired: 2026-08-31
Branch: `codex/book1-edition-boundary-20260830`
PR: https://github.com/meijer1973/4veco-platform/pull/222
Current-main prerequisite: `636991ce7aa400494bccf78f22bba92fa5110ae7` (PR #219 integrated)

## Goal

Repair PR #222 so the owned blueprint clarification permits useful anticipatory
scaffolding without weakening the merged Book 2+ Part A authoring contract.
Make the rule operationally discoverable, enforce the policy and metadata with
a focused source-contract checker and mutation tests, preserve the printed Book
1 freeze, and produce fresh review and exact-head CI evidence before governed
integration.

## Context

The original draft correctly distinguished terminal targets, previews, and
prerequisite mastery, but it was based on pre-PR-#219 main and did not state how
that distinction interacts with the now-merged Part A exercise sequence. Its
CI also failed on stale generated indexes and its result incorrectly said that
local validation was unavailable. The branch has now merged current main and
passes governance freshness. The detailed repair baseline is recorded in
`reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-baseline.md`.

This sprint is an owned platform-policy repair. It does not implement Issue
#223, edit a Book 2 paragraph, or publish student-facing output. Issue #223 may
receive read-only baseline and planning analysis only while PR #222 is open.

## Quality Standard

The specification is satisfied only when the policy is compatible with the
Part A quality floor in every active author and reviewer surface. A passing
checker alone is not sufficient: the wording must preserve target-operation
alignment, a feasible 55-minute paper route, later formal instruction, and the
distinction between exposure, support, independent performance, and mastery.

There is no rendered output or student-facing artifact in this platform-only
sprint. Review proof must therefore cover the authored policy, metadata,
operational pointers, negative mutations, unchanged lesson repository, and
exact-head CI. Any useful idea outside this scope is a named follow-up rather
than an implicit expansion.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Part A compatibility boundary is explicit | Owned policy states that the merged Book 2+ sequence/target contract wins operationally | Checker clause assertions, teacher review, lead review | pending |
| Preview remains bounded support | Policy restricts previews to explanation/context, taught-prerequisite retrieval, or optional perspective | Negative mutation tests remove or weaken each bound | pending |
| Preview cannot manufacture coverage or mastery | Policy forbids a `Covered` cell and all mastery inference from exposure alone | Checker plus metadata flag tests | pending |
| No untargeted independent operation | Policy forbids a preview from adding an independent operation to worked example, current-content Start check, guided practice, independent practice, or doeloefening unless approved by the target/goal | Teacher review and structural mutation tests | pending |
| Target route and 55-minute feasibility remain intact | Policy forbids displacement of target practice or defeat of the whole-lesson equation | Checker and lead review | pending |
| Book 2 §2.1.1 is not shortened by Book 1 formula exposure | Explicit costs/revenue/profit compatibility example | Teacher review | pending |
| Policy is discoverable during normal work | Concise pointers in the Part A build guide, exercise builder, textbook lane, and teacher-review guidance | Pointer-loss mutations | pending |
| Metadata and structural invariants remain stable | Both meta files reference the clarification, keep preview flags false/true as appropriate, preserve counts/roles/registry | Checker and JSON parse validation | pending |
| Book 1 and lesson output remain untouched | Platform diff inventory plus clean lesson repository proof | Lane-scope/no-change checks | pending |
| Evidence is integration-ready | Complete sprint bundle, current indexes, fresh teacher and lead PASS, exact-head CI | Readiness routing and governed integration lane | pending |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add concise operational pointers instead of duplicating the full policy | `include_now` | Prevents a policy that exists only in owned-reference metadata. |
| Reconcile §2.1.1 target authority and lesson timing | `defer_named_follow_up` | Issue #223; read-only planning may proceed, implementation waits for this PR. |
| Retrofit or regenerate printed Book 1 | `reject_scope_creep` | Book 1 first edition remains frozen; issue #221 owns second-edition work. |

## Allowed paths

- `references/owned/README.md`
- `references/owned/course-blueprint-pedagogical-boundaries.md`
- `references/owned/course-blueprint-v5.meta.json`
- `references/owned/course-blueprint-v6-three-year.meta.json`
- `BUILD-PARAGRAPH.md`
- `skills/econ-exercise-builder.md`
- `agents/teacher-learning-quality-review-agent.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `AGENT_GITHUB_ENTRY.md`
- `references/reference-team-roadmap.md`
- `build-scripts/workflows/check-blueprint-pedagogical-boundaries.js`
- `build-scripts/workflows/check-blueprint-pedagogical-boundaries.test.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `references/data/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1.plan.json`
- `references/data/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1.result.json`
- `reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-*`
- Generated reporting/index files refreshed by repository tools.

## Forbidden paths

- All files in the sibling `4veco-lessen` repository, including Book 1 and Book
  2 source, generated output, PDFs, HTML, plans, and reviews.
- `references/machine/` and `references/external/` protected reference data.
- `references/authored/course-target-exercises.json` and other target,
  candidate, MTU, or PV registries.
- Book-count, book-role, assessment-calendar, or v6 route mutations.
- Companion/web implementation or generated student-facing output.
- Issue #223 implementation in this PR.

## Inputs

- Owner review on PR #222 and the 2026-08-31 correction/review attachments.
- Current main at `636991ce7aa400494bccf78f22bba92fa5110ae7`.
- The six-file original PR #222 payload at
  `b11c9f603599e95e2ff7abae3eb8e01398538d69`.
- `skills/econ-exercise-builder.md` as the operational Book 2+ Part A source.
- `references/authored/didactiek-principes.md` as its rationale source.
- `BUILD-PARAGRAPH.md`, `docs/workflows/textbook-paragraph-lane.md`, and
  `agents/teacher-learning-quality-review-agent.md` as active inheritance and
  review surfaces.
- Issue #221 as the Book 1 second-edition backlog.
- Issue #223 as a separate, dependent Book 2 lesson task.

## Outputs

- Repaired owned pedagogical-boundary policy and stable metadata pointers.
- Concise operational inheritance in the active Part A build/review surfaces.
- Focused checker, mutation tests, npm command, and platform-CI wiring.
- Machine-readable sprint plan/result and complete command/review evidence.
- Fresh PR description, exact-head CI, readiness decision, authorization, and
  governed integration evidence.

## Operationalized sprint procedure

1. Merge current main into the PR branch and run governance freshness before
   authored repair work. Stop on any conflict affecting the Part A contract.
2. Record this repaired plan and baseline, run the sprint plan/bootstrap
   validators, and obtain an independent planning review. Resolve every
   blocking finding before policy or checker implementation.
3. Add a compatibility section to the owned policy. State that a preview may
   support explanation/context, retrieval of already-taught prerequisites, or
   optional perspective, but it earns no `Covered` cell, implies no mastery,
   and cannot add an independently required operation to any Part A target
   stage without reviewed goal/target authority.
4. State that preview material cannot displace target practice, break the
   55-minute route, or shorten later formal teaching; explicitly apply that
   rule to costs/revenue/profit in Book 2 §2.1.1.
5. Add concise pointers from the build guide, operational exercise builder,
   textbook workflow, and teacher-review mode. Keep the full rule in one owned
   policy rather than copying it across every surface.
6. Implement a deterministic platform-only checker for the policy clauses,
   metadata flags/pointers, count/role/registry invariants, and active pointers.
   Add mutations that remove each critical clause, flip metadata flags, remove
   either meta reference, change counts/roles/registry, or remove each pointer.
7. Run focused and broad platform validation, prove the lesson repository is
   clean and unchanged, refresh generated indexes, and update result/evidence.
8. Request a fresh teacher-learning-quality review and a substantive lead
   review of the repaired exact payload. Resolve blockers and rerun affected
   tests. Stop if either final verdict is not PASS.
9. Push the exact reviewed head, update PR #222, wait for exact-head CI, then
   route readiness. Only after the owner-authorized payload is recorded may the
   current-main trusted integration lane merge the PR. Verify post-merge main
   CI before declaring completion.
10. Keep Issue #223 limited to baseline/target/timing planning until PR #222 is
    merged and post-merge CI is green; never mix its lesson files into PR #222.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BLUEPRINT-BOOK1-EDITION-BOUNDARY-1
npx.cmd jest build-scripts/workflows/check-blueprint-pedagogical-boundaries.test.js --runInBand
npm.cmd run check:blueprint-pedagogical-boundaries
npm.cmd run check:part-a-exercise-authoring-contract
npm.cmd run check:active-governance-wording
npm.cmd run check:platform
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
node -e "const {execFileSync}=require('child_process'); const out=execFileSync('git',['-C','../4veco-lessen','status','--porcelain'],{encoding:'utf8'}); if(out.trim()){console.error(out);process.exit(1)}"
npm.cmd run check:agent-index-freshness
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/ci/check-evidence-line-endings.js
git diff --check
node build-scripts/sprints/check-sprint-command-log.js BLUEPRINT-BOOK1-EDITION-BOUNDARY-1
node build-scripts/sprints/check-lead-review-substance.js BLUEPRINT-BOOK1-EDITION-BOUNDARY-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-result.md
node build-scripts/sprints/check-sprint-bundle.js BLUEPRINT-BOOK1-EDITION-BOUNDARY-1 --complete
```

## Proof Required to Close

Closure proof requires all acceptance validators/tests to pass, a focused
mutation suite proving the compatibility rules fail closed, an unchanged
lesson-repository check, a fresh teacher-learning-quality PASS, a substantive
lead-review PASS with classified findings, current generated indexes, and green
CI for the exact PR head. Integration additionally requires a recorded owner
authorization for that exact payload, a successful governed-lane dry run and
live run, and green post-merge main CI.

## Rollback plan

Before merge, revert only PR #222 commits on its dedicated branch. After merge,
use a normal revert PR for the merge commit; do not rewrite main. The rollback
must remove the policy, pointers, checker/CI wiring, and sprint evidence as one
coherent unit while leaving PR #219, Issue #223 planning, target registries,
Book 1, and lesson output untouched.

## Human review required

Yes. This is an L4 owned curriculum-policy change. The sprint may reach
`READY_FOR_HUMAN_REVIEW` only after fresh specialist/lead review and exact-head
CI. Merge requires owner authorization for the exact payload and must use
`npm.cmd run integrate:authorized-pr`; direct merge is forbidden.

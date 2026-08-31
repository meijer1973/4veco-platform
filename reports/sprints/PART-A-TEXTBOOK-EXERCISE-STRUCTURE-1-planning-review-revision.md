# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Revision Planning Review

Generated: 2026-08-31

Reviewer: independent planning/review subagent

Verdict: REVISE

## Scope

This review checks the revised sprint plan and plan JSON against the
authoritative 2026-08-31 owner correction for PR #219 and the current branch
state. It covers only planning sufficiency; it does not review or alter the
implementation.

Evidence inspected:

- the owner correction attachment at
  `C:/Users/meije/.codex/attachments/88db33dc-f011-4626-bc2e-6d5c92c4dc98/pasted-text.txt`
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`
- `references/data/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1.plan.json`
- current local/remote branch and PR #219 state
- the planned sprint validators

Both structural planning validators pass:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1`

## Coverage Assessment

| Owner requirement | Assessment | Evidence |
|---|---|---|
| Paper-only, no-device Part A | PASS | The plan requires all explanation, retrieval, scaffolding, practice, and target preparation in print and prohibits printed website/device dependencies. |
| Exact seven `##` headings | PASS | Goal, quality floor, matrix, checker design, and plan JSON require exact names, order, and Markdown level. |
| Summary after worked example and before `Startopgaven` | PASS | The compact summary is explicitly non-heading, limited to five points, and permitted between the first two canonical headings. |
| Student-facing terminology/device prohibition scoped only to printed templates | PASS | The plan expressly preserves internal Part A/Part B architecture language and rejects it only in printed template/examples/instructions. |
| Required mutation tests | REVISE | The plan describes many rejection conditions but does not enumerate all twelve owner-required mutations as tests; plan JSON also omits the combined contract plus paragraph-lane focused test command present in the Markdown plan. |
| Current-main integration | PASS | Local HEAD `84bfd7eb1f572fb8028bde73aa08f34904c597c1` is a merge of prior PR head `1ed301f931b0e87621facaebc5205265d5be30a5` and current/remote `main` `bb212502d2074c9936da30b8d6e6914ba6319dfe`. The plan requires a final fetch/integration check and preservation of current-main improvements. |
| Renewed teacher and lead review | REVISE | Renewed lead-review scope is explicit, but the teacher review only references “twelve owner-required” criteria without listing the exact twelve questions the reviewer must answer. |
| Exact-integration-head CI | PASS | Procedure and closure proof require green `platform-ci / validate-platform` on the final integrated head. |
| No lesson or Book 1 output | PASS | Lesson/Book 1 writes, regeneration, retroactive checking, and Book 2 output remain forbidden with clean sibling-worktree proof. |
| Final evidence and PR update | REVISE | Closure proof mentions refreshed evidence, but outputs/procedure/human-review text still calls for a draft PR and does not operationalize the complete required result/PR-description synchronization. |

## Blocking Findings

### 1. Required mutations are not an explicit, machine-plan-aligned test matrix

The owner correction requires tests proving failure for twelve named mutations.
The revised plan names some as matrix examples and describes other conditions
the checker must reject, but it never requires one test for every named
mutation. In particular, removal of the paper support note, loss of guided
optionality/fading, repetitive bonus arithmetic, new theory in closing review,
and addition of Book 1 output to checker scope are not explicitly committed as
mutation tests.

The plan JSON also omits this Markdown acceptance command:

`npm.cmd test -- --runInBand build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/workflows/check-paragraph-lane-scope.test.js`

Add the exact twelve-item mutation matrix to the plan and make the plan JSON
acceptance list include the required focused contract-plus-lane suite.

### 2. The renewed teacher review is not operationally specified

The plan correctly requires a renewed teacher-learning-quality review but
compresses the authoritative twelve questions into broad topic labels. The
reviewer must be instructed to judge each exact item separately: paper-only
usability, no-device compatibility, all required support in print, simple
printed route, backward alignment, 55-minute feasibility, same-goal
differentiation, cognitive-flexibility bonus, accessible closing review,
Book 1 continuity, summary placement, and absence of student-facing internal
architecture terminology.

List those twelve checks in the procedure or closure proof and require an
explicit verdict/evidence entry for each. The renewed lead-review scope already
matches the owner correction and needs no structural change.

### 3. Final PR/evidence closure contradicts the required outcome

The authoritative outcome is a refreshed, cleanly mergeable, **non-draft** PR
ready for human review. The plan still requires a “draft PR” in Outputs, says
to push the “revised draft PR” in procedure step 7, and describes opening the
“required draft PR” under Human review required.

At review time the local integration merge exists, while remote PR #219 still
points to old head `1ed301f...`, is draft, and reports `DIRTY`. That is an
expected pre-revision state, but the plan must explicitly close the gap:

- push the final integrated revision;
- update the PR description with the final evidence;
- verify the PR head equals the reviewed/CI head and GitHub reports clean
  mergeability against current `main`;
- apply the governed readiness transition and verify `isDraft: false`;
- update final result evidence so it no longer says publication, readiness, or
  exact-head CI is pending; and
- record every owner-required handoff field: base/head SHAs, mergeability,
  focused/full test counts, exact CI run, contract check, renewed teacher and
  lead verdicts, lesson SHA/cleanliness, zero Book 1/Book 2 lesson-output
  changes, removal of printed digital/internal terminology, deliberate summary
  placement, and remaining human authority boundary.

## Non-Blocking Findings

No additional scope correction is needed. The revised plan correctly keeps
Part B implementation, lesson output, Book 1, target registries, protected
references, schema migration, merge, and Book 2 production outside scope. The
worktree is on the dedicated task branch; only the revised plan and plan JSON
are currently modified.

## Required Next Action

Correct the three blocking planning gaps, rerun both planning validators, and
obtain a short independent recheck before revising implementation or final
evidence. Preserve every earlier review and correction record.

## Final Verdict

REVISE. The substantive paper-only authoring contract and current-main
integration are well planned, but the mutation proof, exact teacher-review
questions, and required non-draft PR/final-evidence closure are not yet
operationally complete.

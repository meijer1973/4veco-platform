# Lead Review Summary

Sprint: `PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1`

Round: lead review round 1

## Scope

- Artifact/task: platform-only Book 2+ Part A exercise-authoring contract and its regression guardrail.
- Requested outcome: one internally consistent seven-section authoring/review contract for future Book 2+ theory paragraphs, with Book 1 and all lesson output unchanged.
- Evidence inspected: GitHub issue 218 and the attached interpretation; `AGENTS.md`; the product vision, product end state, and paragraph-lane vocabulary; the governed plan/JSON/baseline; planning review, resolution, and passing recheck; the complete active implementation diff; the source-contract checker and focused tests; teacher-learning-quality round 1, resolution, and passing recheck; CI/navigation wiring; generated maps/dashboard; and the sprint command log.
- Reviewed repository and PR, when applicable: `4veco-platform`, worktree `C:/wt/Issue 218, textbook excercises/4veco-platform`, branch `codex/part-a-textbook-exercise-structure-1-20260829`; no PR exists at round 1.
- Reviewed commit SHA: base `11c7a0286776064a694efa4e3cc9e91b4e62fa5c` plus the current uncommitted 37-path implementation diff. This review is not commit-bound; a corrected local commit requires round-2 recheck.
- PR-readiness routing suitability: not suitable. A core guardrail defect remains, there is no implementation commit or draft PR, and exact-head CI is therefore not yet available.
- Human-authority trigger: yes. This changes instructional-authoring and reviewer governance, so owner approval remains required before merge or use for Book 2 production.
- Batching recommendation: keep this as one bounded contract PR. Do not batch a Book 2 paragraph, Book 1 revision, Part B redesign, or internal schema migration into it.
- Subsequent changes require re-review: yes. Changes to any active contract surface, checker/test, CI wiring, or navigation evidence require a separate round-2 review.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Original issue requirements 1–10 | Independent lead review | Current source diff and explicit met/not-met classification | REVISE: 1–8 and 10 met; 9 not met |
| Planning gate | Independent planning reviewer | Initial review, resolution, passing recheck | PASS |
| Learning-quality gate | Teacher-learning-quality reviewer | Round 1, resolution, corrected-diff recheck | PASS, 14/14 after correction |
| Current contract source | Manual diff inspection | Ten active guidance surfaces, source-of-truth roles, Part A/Part B boundary | PASS |
| Guardrail behavior | Checker, focused Jest, independent negative mutations | CI wiring plus mutations that exercise real active templates/inheritors | FAIL |
| Focused/current compatibility checks | npm/Jest and independent rerun | Commands and exit codes | PASS for existing checker, 17 focused tests, workflow wording, currentness, scope language, and active governance wording |
| Full platform validation | Sprint command log | Post-correction command and exit code | PASS: 106 suites, 1,561 tests, exit 0 |
| Lesson/output boundary | Git diff and detached lesson worktree | No lesson/output paths; detached checkout clean at recorded SHA | PASS |
| Rendered/student artifact review | Lead applicability check | Proof that no paragraph, PDF, visual, HTML, or lesson output was produced | N/A, verified |
| Commit-bound lane scope and exact-head CI | Local/GitHub lifecycle | Committed diff, passing shared-lane check, draft PR, exact-head `validate-platform` | NOT READY at round 1 |

## Consolidated Verdict

Verdict: REVISE
- Reason: the current contract prose meets the instructional specification, but the new regression checker does not prevent the active guidance from silently diverging. Independent mutations added forbidden top-level headings and reordered repeated active sequences while `findContractFailures()` still returned no failures. This is a core failure of requirement 9, not a test-reporting flag.

## Finding Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| LR-1: the checker accepts structural drift in the operational template and inheriting guidance | `core_spec_failure` | Sprint completion, lead PASS, draft-PR readiness, and adoption of the guardrail | Bounded checker/test repair on this branch | Mutations for extra Start subheadings, intervening summary/help headings, and reordered repeated sequences must fail; current sources and all focused/full checks must remain green |
| LR-2: generated GitHub agent indexes do not yet list the new checker/test because those files are untracked | `scale_blocker` | Remote-publication/map-currentness proof and final PR-readiness evidence | Current local contract review; the checker is already discoverable in `RESEARCH_AGENT_MAP.md`, `AGENT_GITHUB_ENTRY.md`, and `reports/url-index.md` | Stage the new paths, rerun `npm.cmd run agent:index`, and prove both generated platform indexes contain the checker/test and pass freshness checks |
| No implementation commit, PR, shared-lane HEAD diff, or exact-head CI exists yet | `core_requirement_met` for the assigned pre-PR round-1 phase | Final closure until those later lifecycle proofs exist | Round-1 source review and bounded repair | After corrections, create a reviewable local commit, run shared-lane validation, obtain round 2, then publish the draft PR and verify exact-head CI |

## Blocking Findings

Blocking findings exist:

- **LR-1 — guardrail does not guard the real structural surfaces.** The focused suite proves that selected phrases and the two canonical numbered code blocks are present, but it does not parse the actual `exercises.md` template or validate every active surface that repeats the full order. Four independent in-memory mutations all returned an empty failure list:
  - adding `## Voorkennis ophalen` below `## Startopgaven` in the operational template;
  - inserting `## Website-help` between the worked example and `## Startopgaven` in that template;
  - swapping `Zelfstandige oefening` and `Doeloefening` in the canonical structure diagram in `skills/econ-textbook-paragraph.md`; and
  - swapping `Begeleide inoefening` and `Zelfstandige oefening` in the explicit sequence in `BUILD-PARAGRAPH.md`.

  These are precisely the silent-divergence cases issue 218 requires the guardrail to prevent. Repair this by structurally checking the real top-level heading template and every active surface that repeats a full sequence, or by reducing inheriting surfaces to concise pointers so they no longer encode a competing sequence. Add negative tests for extra `Voorkennis ophalen`/`Begripscheck` headings, intervening summary/help headings, and at least one inheriting-surface reorder.

## Specialist Findings

### Core requirement checklist

| # | Non-negotiable requirement | Result | Evidence/judgment |
|---:|---|---|---|
| 1 | Book 2+ only; Book 1 frozen; non-retroactive platform scope | MET | All authority surfaces state the boundary; the checker enumerates platform sources only; detached lesson checkout is clean. |
| 2 | Backward design and exact alignment-table columns | MET | `econ-exercise-builder` and `BUILD-PARAGRAPH.md` contain the required chain and all seven columns. |
| 3 | Exact contiguous seven-section order and theory/example/Start adjacency | MET in current prose | The current authority and inheriting surfaces use the required order and placement. LR-1 means this state is not yet durably guarded. |
| 4 | Both Startopgaven roles under one heading without diagnostic claims | MET in current prose | Taught-prerequisite retrieval and compact current-content check are explicit; mastery, diagnosis, and automatic routing are prohibited. |
| 5 | Optional, stronger, deliberately faded guided route with neutral wording and same goal | MET | The operational builder, reviewer, and teacher agent agree, and violations are current hard fails. |
| 6 | Core route 2→4→5 and realistic 55-minute lesson | MET | A paragraph-specific whole-lesson equation using actual question estimates replaces range-sum reasoning. |
| 7 | Cognitive-flexibility bonus; accessible 1–2-task closing review with no theory | MET | The two roles are sharply separated across authoring and review guidance. |
| 8 | Summary after section 7; subordinate Part B help inside Start; no Part B route substitution | MET | Placement and lane boundaries are explicit and consistent in the current diff. |
| 9 | CI-wired, mutation-tested, discoverable regression guardrail | NOT MET | npm/CI/navigation wiring exists, but meaningful structural mutations pass undetected; generated agent indexes also need a post-stage refresh. |
| 10 | No Book 2 paragraph, rendered page, or student-facing output | MET | Platform diff contains only guidance/checker/CI/navigation/sprint evidence; lesson worktree is detached and clean. |

- Planning review initially returned REVISE for summary/help placement and executable lesson-clean proof. Its resolution and independent recheck are complete and PASS.
- Teacher-learning-quality review initially returned REVISE on timing realism, review severity, target-conditional representations, operational clarifications, and lesson-clean evidence. The recorded corrections are present; the independent recheck returns PASS at 14/14.
- The lead review agrees with the teacher recheck about current learning-design quality. LR-1 is a separate regression-enforcement defect that the specialist review did not expose.
- No accessibility, visual-QA, companion-visual, or student-experience specialist is required for this source-contract-only diff. No rendered or interactive artifact exists to inspect.

## Test Evidence

- Latest post-correction logged full suite: `npm.cmd run check:platform` exited 0 after all contract/checker source edits; 106 suites and 1,561 tests passed, with 6 suites/8 tests skipped.
- Latest logged focused evidence: `npm.cmd run check:part-a-exercise-authoring-contract` exited 0 over 10 platform source surfaces; focused Jest exited 0 with 17/17 tests.
- Independent lead reruns also passed the checker, focused Jest, paragraph-workflow wording, exercise-workflow currentness, scope-language, active-governance wording, and `git diff --check`.
- Passing tests do not close LR-1 because the four additional structural mutations were accepted by the checker.
- `check:paragraph-lane-scope --lane shared --base origin/main --head HEAD` is not yet meaningful and currently reports no changed paths because `HEAD` still equals `origin/main`; rerun it against the corrected implementation commit before round 2/finalization.
- Exact-head GitHub CI is not available in this pre-PR round. It remains mandatory after the draft PR is published.

## Learning Quality Evidence

- Teacher-learning-quality round 1 preserved five concrete hard findings instead of accepting phrase-level compliance.
- The correction record repairs whole-lesson timing, hard-fail severity, target-conditional representations, Startopgaven detail, target-adaptation authority, independent-practice scope, and executable lesson-clean proof.
- Independent teacher recheck returns PASS, 14/14. The present contract is backward-aligned, route-realistic, neutrally differentiated, and clear about transfer versus cumulative review.
- No teacher finding is being hidden or downgraded. LR-1 concerns whether future source drift would be caught.

## Student Experience Evidence

- Not applicable for rendered/lived student-experience review: no Book 2 paragraph, PDF, visual, HTML, exercise set, or interactive surface was produced.
- This boundary was verified from the platform changed/untracked path list and from the detached `4veco-lessen` checkout at `f09fd6e88edc5049b026b16b0158e7e188091d2d`, which has no branch and an empty tracked/staged/untracked status.
- The teacher review supports the likely instructional effect of the future contract; it is not represented as proof of an actual student's orientation or usability.

## Ownership and Handoff

- Lesson-side: no owner action; keep `../4veco-lessen` detached, clean, and unchanged.
- Platform: implementation owner must repair checker structure coverage, add meaningful mutations, and refresh generated indexes after staging the new paths.
- Asset generation: not applicable; no assets or rendered outputs are authorized.
- Registry/procedure: no target registry, protected reference, source-data, candidate-storage, or PV change is authorized.
- Quality log: preserve this REVISE report, record each disposition in the lead-review correction log, and keep all failed/passing command attempts in the sprint audit log.
- Roadmap/human gate: keep the sprint active. Human review remains later authority for merge and Book 2 adoption; it cannot be inferred from the user's instruction to start work.

## Required Next Action

- Record LR-1 and LR-2 in `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-lead-review-corrections.md`, repair the checker/tests without changing lesson output or widening scope, stage the new files and regenerate the agent indexes, then rerun focused checks, full platform validation, map freshness, lesson-clean proof, and shared-lane validation against a local implementation commit. Request a separate lead-review round 2 on that corrected commit before publishing the draft PR.

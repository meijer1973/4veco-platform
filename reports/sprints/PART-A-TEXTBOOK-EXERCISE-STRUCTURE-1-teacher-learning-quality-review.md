# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Teacher Learning Quality Review

Generated: 2026-08-29

Reviewer: independent teacher-learning-quality reviewer

Verdict: **REVISE**

## Scope

This is a Book 2+ Part A authoring-contract review, not a review of a completed
paragraph. I reviewed whether the changed platform guidance would reliably
lead a future author and reviewer to a classroom-usable exercise route aligned
to GitHub issue 218.

The review covers:

- the issue and attached assignment context;
- `AGENTS.md`, the governed sprint plan, baseline, planning review,
  resolution, and passing planning recheck;
- the implementation diff across all ten active contract surfaces;
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.js` and
  its focused mutation tests;
- the sprint command log, including the passing focused checker/test and full
  platform suite; and
- the detached lesson checkout used for the no-output-change boundary.

This review does not approve a Book 2 paragraph, Book 1 revision, Part B
redesign, merge, or adoption of the contract.

## Teacher Learning Quality Summary

- Verdict: **REVISE**
- Total Score: **11/14**
- Final teaching judgment: **Needs bounded revision before this contract is
  used to produce classroom-facing Book 2 material.**

The implementation establishes the right overall learning route: backward
design from goals and target operations; a directly adjacent worked example;
two compact Startopgaven roles under one heading; optional same-goal guided
practice with fading; independent practice before the doeloefening; a genuine
flexibility task; and accessible closing retrieval. Book 1 and Part B are
properly bounded.

Three active-contract defects still matter. First, the timing proof can accept
a route that does not fit the whole 55-minute lesson. Second, the paragraph
review skill downgrades two issue-level hard requirements to non-blocking
flags. Third, that same reviewer can require graph/table production even when
it is absent from the target operation chain. The checker passes despite these
contradictions, so the regression protection is not yet strong enough.

## Rubric

- Learning Goal Alignment: **2/2**
- Prior Knowledge Fit: **2/2**
- Didactic Sequence: **1/2**
- Formative Assessment: **2/2**
- Differentiation: **1/2**
- Dual Coding: **1/2**
- Transfer and Retention: **2/2**

## Findings Classification

| ID | Classification | Finding | Required disposition |
|---|---|---|---|
| TLQ-1 | blocking / hard failure | The route-time evidence does not prove that the core route fits the *remaining* work time in a 55-minute lesson. `skills/econ-textbook-paragraph.md` budgets about 5 minutes for motivation, 15 for theory, 5 for the worked example, and 23–38 for the core route, producing 48–63 minutes before transitions or summary. Its line 492 also retains the obsolete check that the whole exercise set fits 40–60 minutes. `skills/econ-paragraph-review.md` line 110 and the checker line 160 treat the section-range sum itself as 55-minute feasibility proof. | Remove the 40–60-minute check. Require an explicit per-paragraph equation: planned motivation/instruction/worked-example/transition time plus the *actual estimated questions* on route 2→4→5 must be no more than 55 minutes. Keep the recommended section ranges, but require authors to select within/adapt them to the remaining time and justify deviations. Extend the checker and a mutation test so the stale rule or a fake `23–38 < 55` proof fails. |
| TLQ-2 | blocking / hard failure | `skills/econ-paragraph-review.md` correctly calls an intervening stage a FAIL in check 1.5.2, but its calibration section (lines 304–307) calls “worked example appearing after the summary” and “missing/ineffective fading or neutral skip wording” mere FLAGs. That conflicts with issue 218 and the teacher-review agent, both of which make interrupted adjacency and non-fading guided practice hard failures. | Move both examples to the FAIL calibration list and make the severity of checks 1.5.2 and 1.5.5 explicit. Add a checker assertion/mutation so this reviewer cannot silently downgrade those requirements later. |
| TLQ-3 | blocking / target-alignment failure | `skills/econ-paragraph-review.md` line 89 unconditionally tells reviewers that the doeloefening must require students to produce their own graphs/tables. A blueprint target may instead require calculation, explanation, source reading, or another answer form. Adding graph/table production would violate the new no-target-absent-operation rule and the requirement to preserve the reviewed target. | Make graph/table production conditional on that representation being in the target operation chain. Otherwise require only removal of the supports applicable to the actual target operation and answer form. Guard this target-preservation rule in the checker/tests. |
| TLQ-4 | required contract clarification | The full operational builder gives the Startopgaven total of 5–8 minutes, but omits the issue’s normal 3–5-minute expectation for the prerequisite-retrieval task and the important classroom-use note that a teacher may assign that printed task at the beginning of the lesson without changing the printed `theory -> worked example -> Startopgaven` order. It also says the target may be lightly adapted without repeating “where authorized.” | Add these bounded operational clarifications to `skills/econ-exercise-builder.md`; keep other inheriting surfaces concise. Also state explicitly that independent practice may not expand into adjacent content or unlabelled enrichment. |
| TLQ-5 | evidence correction before closure | The command log contains two honest failed attempts to run the lesson-clean Node one-liner. Its later green invocation passes a quoted JavaScript string to `node -e`, so it evaluates a string literal rather than executing the Git status check. Direct read-only inspection during this review did show the detached lesson checkout clean at `f09fd6e88edc5049b026b16b0158e7e188091d2d`, but the logged proof itself is not valid. | Add a genuinely executable command-log entry that fails on tracked, staged, or untracked lesson changes. Preserve the failed attempts in the audit log. |

## Requirement-by-Requirement Review

| Requirement | Result | Teacher judgment |
|---|---|---|
| Platform-only contract; no lesson output | PASS | The implementation diff is confined to platform guidance, guardrail, CI/navigation, generated maps, and sprint evidence. Direct inspection found the detached lesson checkout clean. |
| Book 1 frozen and non-retroactive | PASS | All authoritative surfaces scope the contract to newly authored Book 2+ theory paragraphs. The new checker enumerates platform source surfaces and does not validate Book 1 output. |
| Part A and Part B explicitly separated | PASS | The printed Part A headings are not replaced by `Start -> Leer -> Check -> Oefen -> Exit ticket`; Part B remains a separate product route. |
| Seven headings, exact order, contiguous block | PASS WITH REQUIRED REVIEW FIX | Authoring guidance and templates are clear, but the paragraph-review calibration still downgrades one adjacency breach to a FLAG (TLQ-2). |
| Theory -> worked example -> Startopgaven adjacency | PASS WITH REQUIRED REVIEW FIX | The source contract is explicit and the recap/help disposition is sound; review severity must be made consistent. |
| Worked example matches target chain and adds no operation | PASS | The builder, rationale, workflow, and teacher reviewer consistently require the same operation chain at lower complexity. |
| Both Startopgaven roles under one visible heading | PASS WITH CLARIFICATION | Retrieval and compact current-content comprehension are clear and non-diagnostic. Add the 3–5-minute retrieval norm and classroom-order note (TLQ-4). |
| Optional, stronger, fading guided practice with neutral route | PASS WITH REQUIRED REVIEW FIX | Authoring rules are strong, but the review calibration could still permit missing fading/neutral wording (TLQ-2). |
| Independent practice prepares directly for target | REVISE | The target-operation language is strong, but the reviewer's unconditional graph/table-production demand can introduce target-absent work (TLQ-3). |
| Doeloefening is target capstone | PASS WITH CLARIFICATION | Placement and purpose are correct. Repeat that any light adaptation requires authorization. |
| Core route 2 -> 4 -> 5 fits a 55-minute lesson | REVISE | The route is explicit, but the timing arithmetic does not reliably account for instruction and can exceed the lesson (TLQ-1). |
| Bonus develops cognitive flexibility | PASS | Transfer, comparison, evaluation, model criticism, new representation, and critique are distinguished from longer arithmetic. |
| Closing review is 1–2 accessible cumulative/homework tasks with no new theory | PASS | Placement, load, taught-content boundary, and retrieval purpose are consistent across the operational and review guidance. |
| Backward-design alignment table covers every target operation | PASS | The required seven-column table is present and the no-silent-gap rule is explicit. |
| Active contradictory guidance removed | REVISE | The stale 40–60-minute check and reviewer severity/target-representation contradictions remain active. |
| Non-retroactive checker and focused tests | REVISE | The checker and 11 focused tests pass, but they do not detect TLQ-1 through TLQ-3. |

## Learning Goal Alignment

The backward-design chain is now operational rather than aspirational:
`lesson goals -> doeloefening -> target-operation decomposition -> worked
example and practice`. The alignment table makes gaps visible, and the
worked-example, independent-practice, and answer-model rules reinforce one
canonical procedure. This is a strong improvement over sequence-first exercise
writing.

The graph/table requirement in the review skill is the exception. It can make
the reviewer demand a representation not present in the blueprint target,
which reverses the intended authority chain. Correcting TLQ-3 restores full
alignment.

## Prior Knowledge Check

The contract correctly limits Startopgaven retrieval to precise prerequisites
already taught, not generic review or newly smuggled content. It also separates
that role from the brief formative check of the just-taught content and forbids
mastery, diagnosis, and automatic-routing claims. This is instructionally
sound and consistent with the product vision’s cautious readiness language.

The classroom-order note should be restored so a teacher understands that the
retrieval task may be used at lesson start while the printed book still keeps
the worked example adjacent to theory.

## Didactic Strengths

- One simple printed structure supports multiple routes without proliferating
  headings or ability labels.
- The supported route leads to the same learning goal and target, with explicit
  scaffolds and deliberate fading.
- The worked example is studied before independent application and uses lower
  complexity without changing the operation chain.
- The compact current-content check creates a formative checkpoint before
  independent practice without overclaiming diagnostic validity.
- Bonus and closing review now serve distinct purposes: cognitive flexibility
  versus accessible cumulative retention.
- The recap and optional website-help pointer no longer interrupt the seven
  exercise headings or import Part B’s route into Part A.

## Didactic Risks

- A future author can select the upper end of every core range and still claim
  compliance even though the full lesson exceeds 55 minutes.
- A future paragraph reviewer can classify missing guided fading or broken
  worked-example adjacency as non-blocking despite the contract’s hard rules.
- The unconditional graph/table-production instruction can create scope drift
  and extra cognitive load unrelated to the target.
- The guardrail’s phrase checks currently certify those contradictions because
  it checks presence of positive phrases but not these conflicting active
  instructions.

## Transfer and Retention Check

Transfer is deliberately located in varied same-operation contexts and in the
optional Denkertje/Bonusopgave, while retrieval/retention is placed last as
one or two accessible taught-content tasks. That separation protects the core
route from enrichment drift and gives lower-load homework a realistic chance
of success. This requirement passes.

## Hard Failures

The following contract-level hard failures remain open:

1. Route realism is not actually proven against the remaining time in the
   whole 55-minute lesson (TLQ-1).
2. The active paragraph-review calibration permits issue-level hard failures
   to remain non-blocking (TLQ-2).
3. The active review guidance can introduce an operation/representation absent
   from the target (TLQ-3).

No hard failure indicates that lesson output was changed; none was.

## Required Revisions

1. Repair the route-time contract and remove the stale 40–60-minute exercise-set
   check.
2. Align `econ-paragraph-review` severities with the teacher agent’s hard-fail
   rules for adjacency and guided fading/neutral routing.
3. Make final graph/table production conditional on the target operation chain.
4. Add the missing Startopgaven timing/classroom-order nuance, explicit
   authorization for target adaptation, and no-adjacent-topic rule to the full
   operational builder.
5. Extend checker mutations to cover these regressions and add valid logged
   lesson-clean proof.
6. Rerun the focused checker/tests and request a short independent teacher
   recheck on the corrected diff.

## Rendered-Output Applicability and Lesson Boundary

Rendered-output review is **not applicable**. This sprint changes platform
authoring/review contracts and a source checker; it creates no textbook
paragraph, PDF, visual, or interactive student surface. There is therefore no
rendered student artifact whose layout or interaction can be judged.

No lesson output was changed. During this review,
`../4veco-lessen` was detached at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`, had no current branch, and
`git status --short` returned empty. The sprint command log still needs the
valid executable proof described in TLQ-5.

## Final Teaching Judgment

**REVISE.** The pedagogical model is close and the remaining work is bounded,
but the current contract can still approve an overlong lesson, non-fading
support, broken adjacency, or target-absent graph/table work. Correct TLQ-1
through TLQ-5, rerun focused validation, and obtain a teacher-learning-quality
recheck before lead-review closure.

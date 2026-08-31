# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Renewed Teacher Review Recheck

Generated: 2026-08-31

Reviewer: independent teacher-learning-quality reviewer

Teacher-fix payload reviewed:
`fc98ffe20354fb285eba636709ea2529e2e4c076`

Current published generated/evidence descendant:
`4ca0cfef91e9e608f0b06b1e1b2d7f50d051ebc4`

Verdict: **PASS**

## Commit identity note

The assignment supplied
`fc98ffe2e453184672d10310648597e75470d742`, which does not resolve in this
repository. The current published lineage contains the matching abbreviated
teacher-fix commit `fc98ffe2` as
`fc98ffe20354fb285eba636709ea2529e2e4c076`; that is the immutable payload
reviewed here. This identifier discrepancy is a provenance note, not a
learning-quality blocker.

The five corrected authoring/checker/test blobs are identical at the fix
payload and current published descendant. The descendant differs from the fix
payload only in six generated GitHub-index/dashboard files, so the substantive
recheck binds cleanly to the fix payload.

## Bounded scope

This recheck preserves the renewed `REVISE` report and evaluates whether its two
blocking findings, TLQ-R1 and TLQ-R2, are actually closed. I inspected the
resolution record, corrected operational/rationale sources, contradiction
checker, focused mutations, command log, current checker/test execution, and
lesson-repository boundary. I then re-evaluated all twelve owner-required
teacher criteria to ensure the corrections did not weaken another part of the
contract.

This remains an authoring-contract review. It does not approve a completed Book
2 paragraph, authorize production or merge, alter Book 1, or redesign Part B.

## Finding recheck

| Finding | Result | Evidence |
|---|---|---|
| TLQ-R1 — required printed guided support | **CLOSED / PASS** | `skills/econ-exercise-builder.md` line 478 now requires authors to **always author and print** Begeleide inoefening with same-goal, stronger explicit scaffolding and deliberate fading. It makes only the student's use optional and retains neutral skip wording. This agrees with the required-heading rule at lines 148–151 and the light/medium/heavy rules at lines 110–112. No author-side conditional or omission permission remains in the three affected authoring surfaces. |
| TLQ-R2 — target-aligned representation fading | **CLOSED / PASS** | `skills/econ-exercise-builder.md` lines 174–211, `references/authored/didactiek-principes.md` lines 216–238, and `references/authored/vraagtypen-en-opgaveontwerp.md` lines 213–232 now condition graph/table production fading on production being part of the approved target operation and answer form. For reading, interpreting, supplied-representation modification, and source-use targets, the rules expressly prohibit adding production and fade only target-relevant support. The paragraph reviewer retains its target-absent-representation hard failure. |

No blocker from the renewed `REVISE` report remains open.

## Twelve required criteria re-evaluated

| # | Exact criterion | Result | Evidence-backed judgment |
|---:|---|---|---|
| 1 | Paper-only usability | **PASS** | The printed paragraph must contain all explanation, prerequisite retrieval, guided scaffolding, independent practice, and target preparation. The route points only to printed sections. |
| 2 | No-device compatibility | **PASS** | Student-facing copy prohibits websites, online explanation, companion pages, laptops, phones, tablets, QR codes, and other digital support. Internal Part B material is not a classroom dependency. |
| 3 | All required support present in print | **PASS — newly closed** | The former conditional checklist instruction is gone. Authors must always create and print the guided section; its stronger scaffold and fading are mandatory, while only student use is optional. The template includes both the paper support note and the guided section. |
| 4 | Simple printed route | **PASS** | The visible route remains exactly `Startopgaven → Zelfstandige oefening → Doeloefening`, with one short `Extra hulp nodig?` instruction to use Begeleide inoefening. The two Start roles do not become new top-level headings. |
| 5 | Backward alignment | **PASS — newly closed** | Goals, target decomposition, worked example, guided/independent practice, target adaptation, and the alignment table remain target-led. Visual fading now follows the target operation and answer form; it cannot add graph/table production to a non-production target. |
| 6 | Realistic 55-minute feasibility | **PASS** | The contract still requires a paragraph-specific equation totaling motivation, instruction, worked example, compact summary/transitions, and actual core-route questions at no more than 55 minutes. Recommended ranges are explicitly not proof, and no target operation may be hidden to make the total fit. This is a contract-level judgment; no unwritten lesson is being certified. |
| 7 | Same-goal differentiation | **PASS — newly closed** | Every paragraph now contains the printed guided route; it keeps the same lesson goal and doeloefening, supplies stronger support, deliberately fades it toward the actual target operation/answer form, and uses neutral optional-student routing. It neither lowers the destination nor adds a target-absent representation demand. |
| 8 | Bonus cognitive flexibility | **PASS** | Bonus remains outside the core and requires transfer, representation, changed assumption, strategy comparison, critique, or evaluation rather than more or longer arithmetic. |
| 9 | Accessible closing review | **PASS** | The final section remains limited to one or two short, accessible cumulative/homework tasks using taught content and introducing no new theory. |
| 10 | Book 1 continuity/freeze | **PASS** | The contract remains Book 2+ only, preserves the familiar pre-exercise summary pattern, and neither retrofits nor validates Book 1 output. The checker scope remains platform-only. |
| 11 | Summary placement | **PASS** | The compact summary remains a maximum-five-point non-heading block after the worked example and before Startopgaven. It is not an eighth exercise section. |
| 12 | Absence of student-facing internal architecture terminology | **PASS** | Printed template copy omits Part A, Part B, lane, companion route, and repository terminology. Those terms remain confined to internal guidance. |

Result: **12/12 PASS.** In particular, previously failing criteria **3, 5,
and 7 now pass**.

## Contradiction guardrail and mutations

`findContradictoryAuthoringFailures` adds the missing fail-closed behavior:

- it rejects builder wording that makes guided practice author-conditional,
  permits authors to omit/skip it, or calls it optional for the author; and
- it inspects the bounded visual-fading sections in all three affected sources
  and rejects unconditional graph/table production instructions or the loss of
  those target-aligned sections.

The new test keeps each correct positive clause in place and then introduces a
contradiction:

1. after the unconditional printed-guidance checklist rule, it adds `If guided
   practice is useful ... otherwise omit Begeleide inoefening`; the checker
   reports the author-side omission contradiction;
2. inside the target-aligned visual-fading section, it adds a command that
   independent practice must always require graph production even when absent
   from the target; the checker reports the target-absent production
   contradiction.

These are genuine positive-plus-contradiction mutations, not simple deletion or
replacement probes. The earlier thirteen owner-required negative scenarios
remain present, including exact `##` names/levels, website/device/Part B route
failures, paper-support removal, summary placement/heading failures,
Voorkennis-heading insertion, optional/fading loss, repetitive bonus, new
closing theory, and Book 1 scope expansion.

## Validation evidence

The committed command log records:

- contract checker: PASS across 10 active platform source surfaces;
- focused contract plus paragraph-lane suites: **49/49 PASS**;
- full platform suite: **106 passed suites and 1,606 passed tests**, with 6
  suites and 8 tests skipped; exit code 0.

Independent execution at the current published descendant reconfirmed:

- `npm.cmd run check:part-a-exercise-authoring-contract` — PASS, 10 active
  platform source surfaces;
- focused contract plus paragraph-lane tests — PASS, **49/49**.

## Lesson and rendered-output boundary

`../4veco-lessen` remains unchanged and clean at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`; independent status output was
empty. No Book 1 or Book 2 lesson output changed, and no lesson path entered the
checker scope.

Rendered-output review remains **not applicable** because the fix changes only
platform authoring/rationale guidance, source-contract checking, tests, and
evidence/index files. There is no new paragraph, exercise sheet, PDF, visual,
or interactive student surface to render or classroom-time directly.

## Final verdict

**PASS.** TLQ-R1 and TLQ-R2 are closed, all twelve owner-required teacher
criteria pass, and criteria 3, 5, and 7 now pass explicitly. From a
teacher-learning-quality perspective, the corrected Book 2+ Part A authoring
contract may proceed to the remaining lead-review, exact-head governance, and
human-authority steps. This verdict does not authorize merge or Book 2
paragraph production.

# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Renewed Teacher Learning Quality Review

Generated: 2026-08-31

Reviewer: independent teacher-learning-quality reviewer

Reviewed payload: `f7e171b81560b35f1f2cf03728da20c616d77d46`

Current published generated-index descendant:
`a121d535821cff46199e4785a4d5e44a2a650780`

Earlier published index tail reviewed during the pass:
`4a7fa594e0bdfaaf833f1e8046693362089575ef`

Branch: `codex/part-a-textbook-exercise-structure-1-20260829`

Verdict: **REVISE**

## Scope and authority

This is a renewed review of a Book 2+ Part A **authoring contract**, not a
review of a completed paragraph. The substantive review is bound to the
immutable payload commit above. The current published descendant and the
earlier intermediate tail change only the same six generated
GitHub-index/dashboard files. The twelve substantive source/checker/test blobs
are unchanged, so neither tail alters the learning-design judgment.

I reviewed:

- GitHub issue 218 and the 2026-08-31 owner correction/handoff;
- `AGENTS.md`, the revised governed plan, planning-review history, prior teacher
  review/resolution/recheck history, and the sprint command log;
- the stable rationale in `references/authored/didactiek-principes.md` and the
  question-design boundary in `references/authored/vraagtypen-en-opgaveontwerp.md`;
- the operational contract in `skills/econ-exercise-builder.md`;
- all inheriting/review surfaces: `skills/econ-textbook-paragraph.md`,
  `skills/econ-didactiek.md`, `skills/econ-paragraph-review.md`,
  `skills/econ-pdf-builder.md`,
  `agents/teacher-learning-quality-review-agent.md`, `BUILD-PARAGRAPH.md`, and
  `docs/workflows/textbook-paragraph-lane.md`; and
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.js`, its
  focused tests, and the paragraph-lane tests.

The owner correction is controlling where it supersedes the earlier issue or
review history: the classroom route is paper-only and no-device, and the compact
non-heading summary remains after the worked example and before Startopgaven.
Earlier `REVISE`, correction, and `PASS` records remain preserved.

## Executive teaching judgment

The revision correctly fixes the paper route, heading hierarchy, summary
placement, whole-lesson equation, Book 1 boundary, bonus, and closing review.
However, two active operational contradictions remain:

1. the exercise-builder's final decision checklist still makes authoring
   guided practice conditional (`If guided practice is useful`), although the
   owner requires a visible, populated printed support section in every new
   Book 2+ paragraph and makes only the **student's use** optional; and
2. three active authoring/rationale surfaces still prescribe an independent
   learner-produced graph whenever visual fading is used, without conditioning
   that production on graph production being a target operation. This can add
   an answer form and cognitive demand absent from the approved target.

Both defects occur in active sources of authoring behavior. The checker passes
because it looks for the correct positive clauses elsewhere, not because it
rejects these simultaneous contradictory clauses. They are blocking contract
defects, not stylistic flags.

## Finding classification

| ID | Classification | Finding | Required disposition |
|---|---|---|---|
| TLQ-R1 | **blocking / hard failure — printed support and differentiation** | `skills/econ-exercise-builder.md` lines 148–151 correctly say that Begeleide inoefening is a required printed heading and optional student route. Its active pre-generation checklist nevertheless says at line 466: `If guided practice is useful`. A future author following that checklist can treat the guided content itself as optional or leave only the heading, contrary to the correction's required printed support route and to the light/medium/heavy rules at lines 110–112. | Make checklist item 6 unconditional and explicit: Begeleide inoefening is always authored and printed with stronger, deliberately fading same-goal support; only student use is optional. Add a regression mutation that retains the positive main paragraph but introduces this author-side conditional/omission permission, and require the checker to reject it. |
| TLQ-R2 | **blocking / hard failure — backward alignment and target-absent representation** | The owner says Zelfstandige oefening must avoid representations absent from the target. Yet `skills/econ-exercise-builder.md` lines 176–185, `references/authored/didactiek-principes.md` lines 224–229, and `references/authored/vraagtypen-en-opgaveontwerp.md` lines 218–223 end graph fading with independent students drawing their own graph whenever visual support is useful/graph-based guided practice is used. They do not say that graph production must itself be a target operation. The reviewer has the correct target-conditional rule at `skills/econ-paragraph-review.md` line 89, but review cannot undo contradictory authoring instructions. | Condition the production stage in all three active sources on graph/table production being part of the approved target operation and answer form. For reading, interpreting, or source-use targets, fade only the support relevant to that target. Extend the checker/mutations so adding an unconditional production demand to an authoring source fails even when the reviewer retains its correct clause. |

## Twelve required criteria

| # | Exact criterion | Result | Evidence-backed judgment |
|---:|---|---|---|
| 1 | Paper-only usability | **PASS** | The operational rule requires all explanation, retrieval, scaffolding, independent practice, and target preparation in the printed paragraph. The template's support route points to printed Begeleide inoefening and contains no external-help direction. |
| 2 | No-device compatibility | **PASS** | The template and student-copy rules prohibit website, online explanation, companion page, laptop, phone, tablet, QR code, and other digital support. The focused mutations replace the route with website, laptop, and online-help directions and are rejected. |
| 3 | All required support present in print | **FAIL** | The main rule and template are correct, but checklist item 6 makes authoring the guided support conditional. A heading alone is not the required scaffold. TLQ-R1 leaves an active path to incomplete printed support. |
| 4 | Simple printed route | **PASS** | The template uses exactly `**Korte route:** Startopgaven → Zelfstandige oefening → Doeloefening.` and `**Extra hulp nodig?** Maak eerst Begeleide inoefening.` The two Start roles remain bold task labels, not extra top-level sections or a decision tree. |
| 5 | Backward alignment | **FAIL** | The alignment table, worked-example chain, independent-practice scope, and target-adaptation limits are sound. Nevertheless, the unconditional final graph-production stage can add a target-absent representation/answer form. That reverses target authority and is a hard alignment failure (TLQ-R2). |
| 6 | Realistic 55-minute feasibility | **PASS** | The builder requires an actual paragraph-specific equation containing motivation, instruction, worked example, compact summary/transitions, and the actual Startopgaven, Zelfstandige oefening, and Doeloefening, totaling no more than 55 minutes. It explicitly rejects range addition as proof and requires redesign rather than hiding a target operation. No completed lesson exists, so this judgment is that the contract now requires a realistic proof; it is not a claim that an unwritten lesson has passed it. |
| 7 | Same-goal differentiation | **FAIL** | The principal clauses correctly require the same goal/target, stronger explicit support, deliberate fading, neutral skip wording, and an optional student route. TLQ-R1 still permits authors to omit that route, and TLQ-R2 can add graph production absent from the target. The active contract therefore does not yet guarantee same-goal differentiation. |
| 8 | Bonus cognitive flexibility | **PASS** | Denkertje/Bonusopgave is outside the core and must use transfer, representation, changed assumption, strategy comparison, critique, or evaluation; it explicitly may not be more or longer arithmetic of the same type. A repetitive-arithmetic mutation fails. |
| 9 | Accessible closing review | **PASS** | The last section is limited to one or two short, accessible cumulative/homework tasks using already taught content and introducing no new theory. The no-new-theory mutation fails. |
| 10 | Book 1 continuity/freeze | **PASS** | The contract is scoped to newly authored Book 2+ paragraphs, keeps Book 1's familiar pre-exercise summary pattern, and forbids retrofit or retroactive validation. Checker scope contains only platform sources and rejects adding a lesson/Book 1 path. `../4veco-lessen` remains clean at `f09fd6e88edc5049b026b16b0158e7e188091d2d`. |
| 11 | Summary placement | **PASS** | The reading flow is theory → worked example → compact non-heading summary → Startopgaven. The template places a four-point summary block in that location, caps it at five points in guidance, and forbids `## Samenvatting`. Mutations moving it after section 7 or promoting it to a heading fail. |
| 12 | Absence of student-facing internal architecture terminology | **PASS** | Student-facing template copy rejects Part A, Part B, lane, companion route, and repository terminology. Internal documents may still name the lane boundary. A printed `Part B` route mutation fails. |

Result: **9 PASS, 3 FAIL**. Criteria 3, 5, and 7 remain blocking.

## Heading names and Markdown levels

**PASS.** The canonical sequence is consistently represented as exactly seven
top-level `##` headings:

1. `## Uitgewerkt voorbeeld`
2. `## Startopgaven`
3. `## Begeleide inoefening`
4. `## Zelfstandige oefening`
5. `## Doeloefening`
6. `## Denkertje / Bonusopgave`
7. `## Herhaling / Herhaling en interleaving`

The operational template has no eighth `##` stage. Genuine subordinate task
labels inside Startopgaven are not headings. `skills/econ-pdf-builder.md` now
uses `##`, resolving the former `###` contradiction. The checker parses heading
level, name, order, and template count; the wrong-level, reordered, intervening
summary/help, and separate Voorkennis-heading mutations fail.

## Required negative mutations and enforcement quality

All thirteen required scenarios are represented in the focused suite:

| Required negative mutation | Coverage judgment |
|---|---|
| one canonical section changes `##` to `###` | PASS |
| `Website-help` inserted as a heading | PASS |
| printed route says use the website | PASS |
| printed route says use Part B | PASS |
| printed route requires a laptop or online explanation | PASS |
| paper support note removed | PASS |
| summary moved after section 7 | PASS |
| summary becomes an eighth top-level heading | PASS |
| `Voorkennis ophalen` becomes a separate top-level heading | PASS |
| guided practice loses optional or fading character | PASS for replacement/removal; **coverage gap** for retaining the correct main clause while adding the conflicting author-side conditional in TLQ-R1 |
| bonus becomes repetitive arithmetic | PASS |
| closing review introduces new theory | PASS |
| Book 1 output added to checker scope | PASS |

Independent execution at the current published descendant produced:

- `npm.cmd run check:part-a-exercise-authoring-contract` — PASS, 10 platform
  source surfaces;
- focused contract and lane tests — PASS, 48/48 tests.

The immutable payload's command log also records exit-code-zero focused and
full-platform runs (latest committed full run: 106 passed suites, 6 skipped;
1,565 passed tests, 8 skipped). These green results establish mechanical
health, but they do not close TLQ-R1 or TLQ-R2: the checker is presence-oriented
and does not reject contradictory authoring permissions when the expected
positive wording remains elsewhere. Mutation quality must cover that
positive-plus-contradiction shape.

## Book 1, Part B, and lesson-output boundary

The payload is platform-only. No `4veco-lessen`, Book 1, or Book 2 paragraph
path appears in the implementation diff or checker scope. The lesson repository
was independently inspected at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`; status output was empty. Part B's
`Start -> Leer -> Check -> Oefen -> Exit ticket` remains an internal companion
contract and is explicitly not the printed Part A route.

No lesson output was changed, no Book 1 output was regenerated or judged by the
new checker, and no Book 2 paragraph was created.

## Rendered-output applicability

Rendered-output review is **not applicable**. This payload changes platform
authoring/review guidance, checker code, tests, and evidence/index files. It
does not contain a paragraph, PDF, visual, exercise sheet, or interactive
student surface to render. The present verdict therefore judges whether the
contract will reliably govern future authoring; it does not certify the
classroom quality or timing of a future paragraph.

## Required revisions

1. Remove the author-side conditional in the exercise-builder checklist and
   state unambiguously that guided support is always authored/printed while
   student use is optional.
2. Make the graph/table production stage target-conditional in the operational
   builder and both inherited rationale/question-design sources.
3. Extend the checker and mutations to reject both contradictions even when the
   correct positive clauses remain present elsewhere.
4. Rerun the focused checker/tests and request an independent teacher recheck
   without rewriting this or earlier review history.

## Final verdict

**REVISE.** The corrected paper/no-device route is substantially sound, but the
active contract can still omit required printed guided content and can still
add a target-absent graph-production operation. Those are blocking failures for
printed support, backward alignment, and same-goal differentiation. Resolve
TLQ-R1 and TLQ-R2 before this contract is returned as teacher-quality PASS or
used to author Book 2 material.

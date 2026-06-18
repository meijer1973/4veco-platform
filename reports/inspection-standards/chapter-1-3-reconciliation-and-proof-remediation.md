# INSPECT-11C Chapter 1.3 Reconciliation And Proof Remediation

Status: still blocked; blockers narrowed and assigned
Date: 2026-06-18
Sprint: `INSPECT-11C`

## Baselines

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision: `../4veco-lessen/specifications/product-vision.md`
- Original sprint/gate spec: `archive/sprints/INSPECT-11C/INSPECT-11C-authorisation-note.md`
- Prior roadmap context: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Controlling prior output: `reports/inspection-standards/chapter-1-3-readiness-remediation-results.md`
- Sprint plan: `archive/sprints/INSPECT-11C/INSPECT-11C-sprint-plan.md`

Lesson evidence was inspected read-only from `../4veco-lessen` at commit
`f91a544`.

## Safe-Use Note

This is an internal Dutch remediation packet. It is not a Chapter 1.3
diagnostic report, evidence pack, teacher/school-facing artifact,
public/external output, inspection judgement, compliance claim, approval,
complete OP0 claim, PTA-validity claim, summative-validity claim,
classroom-implementation proof, school-SKA claim, product-route adoption gate,
diagnostics/mastery/PV gate, student-use authority, or product-use authority.

## Non-Negotiable Requirements

- Use REV-STD-1.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Do not generate a Chapter 1.3 diagnostic report.
- Do not generate an evidence pack.
- Do not mutate generated lesson output, protected references, or source
  registry records.
- Do not unlock dashboard, quality-ref, Scale Gate, product-route,
  diagnostics/mastery/PV, student-use, or product-use authority.

## Executive Decision

Decision: **B. Chapter 1.3 is still blocked, but the blockers are now narrowed
and assigned.**

Chapter 1.3 remains the right next diagnostic candidate only after later
lesson-side and support/accessibility blockers close. It is not ready for an
INSPECT-11D internal diagnostic report implementation-plan sprint yet.

The main reasons are:

- `1.3.4` generated output still conflicts with the reviewed source-registry
  replacement.
- `1.3.1`, `1.3.2`, and `1.3.3` proof candidates require route-level isolation
  from worked examples and answer/model content.
- Diagnostic-depth accessibility/support and companion/advisory evidence
  remains incomplete.

## Core-Requirement Checklist

| Core requirement | Status | Evidence |
|---|---|---|
| Product end-state cited | met | Baselines |
| Original sprint/gate spec cited | met | Baselines |
| Quality-ref/review reconciliation for `1.3.1` through `1.3.4` recorded | met with blockers carried | Target Reconciliation |
| `1.3.4` divergence decision recorded | met with blocker carried | `1.3.4` Divergence Decision |
| Proof-record candidates include exercise IDs and line ranges | met with route conditions | Proof-Record Candidates |
| Accessibility/support records included | met with blockers carried | Accessibility And Support Records |
| Companion/advisory decisions included | met with blockers carried | Companion And Advisory Records |
| PASS WITH FLAGS does not carry a missing core requirement | met | Final decision is state B, not PASS WITH FLAGS |

## Target Reconciliation

| Target | Registry status | Quality-ref/review state | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|---|
| `1.3.1` | `reviewed_final` | Quality-ref still says graph/text mismatch blocker; later review says mismatch corrected. | `scale_blocker` | quality-ref reliance; diagnostic generation; pack-strength or teacher/school-facing reliance | INSPECT-11C closure; route-local proof inventory | Refresh or formally reconcile `1.3.1-quality-ref.yaml` against `1.3.1-review.md`. |
| `1.3.2` | `reviewed_final` | Top-level quality-ref says migrated/CP6 false; embedded review has PASS WITH FLAGS and zero blockers. | `minor_carry_flag` | CP-6 closure; Year 1 closure; unqualified lesson-side promotion claims | route-local proof design; INSPECT-11C closure | Later authorised lesson-side metadata refresh. |
| `1.3.3` | `reviewed_final` | Top-level quality-ref says migrated/CP6 false; embedded review has PASS WITH FLAGS and zero blockers. | `minor_carry_flag` | CP-6 closure; Year 1 closure; unqualified lesson-side promotion claims | route-local proof design; bounded simultaneous-shift candidates in `1.3.3` | Later authorised lesson-side metadata refresh. |
| `1.3.4` | `reviewed_final` | Quality-ref remains `placeholder_needs_review`; review says target-exercise placeholder is not promoted. | `scale_blocker` | diagnostic use of `1.3.4`; Chapter 1.3 implementation-plan readiness | INSPECT-11C closure; recording source-registry no-new-theory status | Authorised lesson-side reconciliation with source registry and generated-output scope. |

## `1.3.4` Divergence Decision

The source registry says `1.3.4` is `reviewed_final`, `gemengde_opgaven`,
introduces no new theory, has no direct exam codes, and excludes
simultaneous-shift reasoning from the reviewed replacement.

The generated `1.3.4` opgaven file still includes `Opgave 4: Vraag en aanbod
verschuiven tegelijk` at lines 54-69. The answer surface includes the same task
at lines 43-53.

Decision for INSPECT-11C: **keep `1.3.4` blocked and exclude generated `1.3.4`
output from any diagnostic proof candidate set.**

| Option | Decision | Reason |
|---|---|---|
| Remove/relocate the simultaneous-shift task | not done | lesson-output mutation is not authorised in this platform packet |
| Update registry/review to admit and bound the task | not done | source-registry/protected-reference mutation is not authorised |
| Keep `1.3.4` blocked or excluded | selected | safest state until paired lesson-output or registry/review work closes the divergence |

## Proof-Record Candidates

| Target | Candidate status | Candidate exercise evidence | Scaffold boundary | proof_required_to_close |
|---|---|---|---|---|
| `1.3.1` | usable only with route-level isolation | Opgave 10, opgaven lines 165-177; answers lines 331-381 | worked example with answers appears before independent exercises at opgaven lines 3-35; Opgaven start line 37, Opgave 1 line 41 | later route must present only selected independent exercise lines and hide answer/repair content before attempt |
| `1.3.2` | usable only with route-level isolation | Opgave 9, opgaven lines 194-210; answers lines 251-281 | worked example with answers appears before independent exercises at opgaven lines 3-69; Opgaven start line 71, Opgave 1 line 75 | later route must present only selected independent exercise lines and hide answer/repair content before attempt |
| `1.3.3` | usable only with route-level isolation | Opgave 5, opgaven lines 122-138, answers lines 105-143; Opgave 7, opgaven lines 161-175, answers lines 169-205 | worked example with answers appears before independent exercises at opgaven lines 1-49; Opgaven start line 51, Opgave 1 line 55 | later route must isolate candidate lines; simultaneous-shift use must stay bounded to `1.3.3` |
| `1.3.4` | blocked; exclude from diagnostic candidate set | Opgave 1 lines 11-24 and Opgave 5 lines 71-90 may align to consolidation, but Opgave 4 lines 54-69 diverges | no worked example precedes Opgave 1; divergent Opgave 4 and answer lines 43-53 remain in same generated output | remove/relocate Opgave 4 or authorise registry/review update before selecting `1.3.4` proof |

These proof candidates are route-local design candidates. They do not create
diagnostic report authority.

## Accessibility And Support Records

| Dimension | Evidence found | Classification | proof_required_to_close |
|---|---|---|---|
| Mobile/responsive | HTML/PDF/Markdown files exist, but no viewport render proof was produced. | `scale_blocker` | rendered mobile and desktop proof for selected candidate surfaces |
| Contrast/theme | no contrast/theme measurement produced | `scale_blocker` | reviewed contrast/theme evidence for graph-heavy and text surfaces |
| Semantic/PDF | HTML headings and PDFs exist; HTML titles are `-`; no PDF tagging/reading-order proof | `scale_blocker` | reviewed semantic HTML/PDF evidence, including useful titles/language metadata and PDF reading order/tag proof |
| Keyboard/focus applicability | no interactive route or keyboard/focus proof produced | `scale_blocker` | explicit keyboard/focus applicability decision |
| Text equivalents / alt / caption | several opgaven images have alt text and figcaptions; coverage was not audited for all graph-heavy surfaces | `scale_blocker` | complete text-equivalent audit for selected graph/table surfaces |
| Hints/repair/next action | `1.3.2` has explicit early hints; chapter surfaces mention guided practice; no reviewed companion route records | `scale_blocker` | per-target hints, repair, feedback, and next-action evidence tied to selected candidate exercises |
| Product/school support boundary | boundary forbids teacher/school-facing and product-route claims | `core_requirement_met` | keep boundary visible |

## Companion And Advisory Records

| Target | Status | Classification | proof_required_to_close |
|---|---|---|---|
| `1.3.1` | route text mentions guided practice, but reviewed companion/advisory record is missing | `scale_blocker` | reviewed companion/advisory evidence or explicit not-applicable decision |
| `1.3.2` | route text mentions guided practice, but reviewed companion/advisory record is missing | `scale_blocker` | reviewed companion/advisory evidence or explicit not-applicable decision |
| `1.3.3` | route text mentions guided practice, but reviewed companion/advisory record is missing | `scale_blocker` | reviewed companion/advisory evidence or explicit not-applicable decision |
| `1.3.4` | no reviewed companion/advisory evidence found | `scale_blocker` | reviewed companion/advisory evidence or explicit not-applicable decision after divergence closes |

## Blocker Ledger

| ID | Finding | REV-STD-1 classification | Owner surface | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|---|
| `INSPECT11C-13-QUALITY-REF-131` | `1.3.1` quality-ref still carries stale blocker language while later review says the mismatch was corrected. | `scale_blocker` | lesson-side quality-ref/review | quality-ref reliance; diagnostic generation; pack-strength claims | INSPECT-11C closure; route-local proof candidate inventory | Refresh or formally reconcile `1.3.1-quality-ref.yaml` against `1.3.1-review.md`. |
| `INSPECT11C-13-MIGRATION-METADATA-132-133` | `1.3.2` and `1.3.3` quality refs carry stale migrated/CP6 false top-level metadata. | `minor_carry_flag` | lesson-side quality-ref metadata | CP-6 closure; Year 1 closure; unqualified lesson-side promotion claims | INSPECT-11C closure; route-local proof candidate design | Later authorised lesson-side metadata refresh. |
| `INSPECT11C-13-QUALITY-REF-134` | `1.3.4` quality-ref/review remains placeholder-oriented while source registry is reviewed_final. | `scale_blocker` | lesson-side quality-ref/review and source-registry reconciliation | diagnostic use of `1.3.4`; implementation-plan readiness | INSPECT-11C closure; no-new-theory decision record | Authorised lesson-side reconciliation confirming no-new-theory/no-code status and generated-output scope. |
| `INSPECT11C-134-LESSON-OUTPUT-DIVERGENCE` | Generated `1.3.4` output includes simultaneous demand/supply shift reasoning while the registry replacement excludes it. | `scale_blocker` | lesson-side generated output and authored target registry | using generated `1.3.4` as diagnostic proof; implementation-plan readiness | INSPECT-11C closure; excluding `1.3.4` until repaired | Remove/relocate the task or complete an authorised registry/review update. |
| `INSPECT11C-13-SCAFFOLD-ROUTE-ISOLATION` | `1.3.1`, `1.3.2`, and `1.3.3` candidates require route-level isolation from worked-example answer/model content. | `scale_blocker` | proof-record route selection | treating full opgaven files as diagnostic attempts; no-answer-before-attempt claim | INSPECT-11C closure; recording candidate ranges | Later route must isolate selected lines and prove answers/repair are hidden before attempt. |
| `INSPECT11C-13-SOURCE-TRACEABILITY` | Authored JSON registry is controlling while blueprint prose remains stale. | `scale_blocker` | source traceability documentation | unqualified finality claim from blueprint prose | using authored JSON registry in INSPECT-11C; INSPECT-11C closure | Refresh blueprint prose or record formal supersession. |
| `INSPECT11C-13-ACCESSIBILITY-SUPPORT` | Diagnostic-depth accessibility/support evidence remains incomplete. | `scale_blocker` | rendered evidence and support proof | accessibility/support claims; implementation-plan readiness; teacher/school-facing reliance | INSPECT-11C closure | Reviewed mobile/responsive, contrast/theme, semantic/PDF, keyboard/focus, text-equivalent, hints/repair, next-action, and boundary evidence. |
| `INSPECT11C-13-COMPANION-ADVISORY` | Reviewed companion/advisory evidence or explicit N/A decisions are absent. | `scale_blocker` | companion/advisory support route | companion/advisory claim; support-strength claim; implementation-plan readiness | INSPECT-11C closure | Reviewed companion/advisory evidence or explicit not-applicable decisions per target. |
| `INSPECT11C-13-CHECK-SURFACE-AUTHORITY` | Check-surface gate authority remains separate from Chapter 1.3 remediation. | `scale_blocker` | separate human gate | Scale Gate 1; product-route adoption; diagnostics/mastery/PV; student/product-use work relying on check-surface closure | INSPECT-11C closure; scoped freshness checks | Renewed human review confirming check-surface gate closure and naming any authority unlocked. |

## Final Questions

| Question | Answer |
|---|---|
| Is Chapter 1.3 still the right next diagnostic candidate? | Yes, but only after lesson-side divergence and support/accessibility blockers close or `1.3.4` is explicitly excluded. |
| Can `1.3.4` be safely reconciled, or must it be excluded/deferred? | Not in this platform packet. Keep it blocked and exclude generated `1.3.4` output until paired lesson-output or registry/review work closes the divergence. |
| Are `1.3.1` through `1.3.3` proof candidates usable after excluding scaffold/worked examples? | Conditionally yes for route-local design if selected independent exercise line ranges are isolated and answer/model content is hidden before attempt. |
| Are accessibility/support gaps still blocking? | Yes. |
| Is Chapter 1.3 ready for an implementation-plan sprint? | No. |

## Next Route

Do not open an INSPECT-11D diagnostic report implementation-plan sprint yet.

Recommended next work is a paired lesson-side repair/review route that either
removes/relocates the `1.3.4` simultaneous-shift task or updates the
registry/review decision to admit and bound it, plus rendered accessibility and
companion/advisory proof for the selected candidate exercises.

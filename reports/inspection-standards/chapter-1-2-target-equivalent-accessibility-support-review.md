# INSPECT-9B Chapter 1.2 Target-Equivalent And Accessibility/Support Evidence Review

Status: review/design packet
Date: 2026-06-11
Sprint: `INSPECT-9B`

## Scope And Safe-Use Note

This report reviews Dutch-only product-side evidence for Book 1 Chapter 1.2.
It is not an evidence pack, generator output, inspection judgement, compliance
claim, approval, certificate, OP0 completion claim, school-obligation claim,
PTA-validity claim, summative-validity claim, classroom-implementation proof,
or school-SKA claim.

Lesson evidence was inspected read-only from `../4veco-lessen` at commit
`b858bca602bb7afdf75cad7c3ecc1a79b31fbb76`.

## Executive Decision

Chapter 1.2 is stronger after INSPECT-9A because the target records and
target-registry exam-code links are reviewed. It is still not pack-ready for
Chapter 1.2 evidence-pack use.

The existing lesson route contains useful route-local evidence: doeloefeningen,
answer models, generated HTML/PDF/Markdown surfaces, paragraph reviews, quality
refs, asset checks, alt text in rendered HTML, visible scaffolding/fading, and
differentiated practice notes. That evidence does not close target-equivalent
proof because no separate reviewed proof artifact compares each target's
operation chain, answer form, scaffold boundary, and authority boundary.

INSPECT-10 should not proceed as a Chapter 1.2 evidence-pack generator sprint.
The recommended next step is to insert a remediation sprint before INSPECT-10:
define and review Chapter 1.2 target-equivalent proof and capture minimum
accessibility/support evidence, while keeping lesson output mutation separately
authorised.

## Evidence Checkout

| Item | Value |
|---|---|
| Platform branch | `codex/inspect-9b-chapter-12-equivalence-support-review-20260611` |
| Platform base | `f7888135bb57c4544761b483b753d00c09524cff` |
| Lesson evidence path | `../4veco-lessen` |
| Lesson evidence commit | `b858bca602bb7afdf75cad7c3ecc1a79b31fbb76` |
| Lesson evidence mode | detached HEAD, read-only evidence |

## Target-Equivalent Review

| Target | Source-registry status | Route-local evidence | Decision | Proof still required |
|---|---|---|---|---|
| `1.2.1` | `reviewed_final` after INSPECT-9A | Opgave 8 is a doeloefening using Lisa's pizza willingness-to-pay data; it asks drawing the individual demand curve, buy/no-buy at EUR 5, buy/no-buy after a price drop to EUR 3, and explaining the downward curve. The paragraph review verifies the equality rule, calculations, and graph axis convention. | `route_local_candidate_only` | A reviewed proof record that compares this doeloefening with the target operation chain and answer form, confirms the no-answer-before-attempt boundary, and records whether consumer-surplus lesson evidence stays outside the target-equivalent claim. |
| `1.2.2` | `reviewed_final` after INSPECT-9A | Opgave 10 is a doeloefening on the butter market at P = EUR 2 and Q = 1,000; it asks own-price movement versus shift, margarine-health preference/substitute context, income effect for a normal good, and four demand-shift factors. Review evidence says the paragraph is conceptually solid and scaffolded. | `route_local_candidate_only_with_flags` | A reviewed proof record after resolving or explicitly carrying local flags: no explicit start-exercise hints, a stray contradictory answer line, and sharper wording needed for the margarine/substitute mechanism. |
| `1.2.3` | `reviewed_final` after INSPECT-9A | Opgave 10 is a doeloefening on Anna and Ben lemonade demand; it asks collective demand by price, drawing individual and collective curves, deriving `Q_collectief = -5P + 18`, and explaining Anna leaving the market. Review evidence says previous doeloefening table/formula and slope-language issues were corrected. | `route_local_candidate_only` | A reviewed proof record that fixes the authority boundary around horizontal-sum and kink operations, records answer-form match, and decides whether remaining interval/dropout-order flags are acceptable for proof use. |
| `1.2.4` | `reviewed_final` after INSPECT-9A | The consolidation opgaven integrate Smoothiebar Blend and IJsjes op het strand. They cover collective demand, movement versus shift, preference change, demand functions, dropout/kink logic, graph reading, willingness-to-pay intercepts, substitute/complement classification, and evaluation of flawed conclusions. | `route_local_candidate_only_with_flags` | A reviewed integrated proof record after resolving or carrying frozen-yoghurt substitute wording and the orphaned asset note. The proof must state that consolidation evidence is not summative/PTA evidence. |

## Accessibility Evidence Review

| Evidence dimension | Current Chapter 1.2 evidence | Decision |
|---|---|---|
| Asset presence and pairing | Reviews for `1.2.1`, `1.2.2`, and `1.2.3` report all referenced assets present, SVG/PNG pairs complete, and naming compliant. `1.2.4` reports the PNG reference resolves and SVG/PNG pair exists. | `route_local_positive` |
| Missing/orphaned assets | Quality refs report no missing assets for all four targets. `1.2.4` records `1.2.4_ex_1.svg` as orphaned while paired with the referenced PNG. | `partial_with_flag` |
| Text equivalents | Rendered HTML contains `alt` text for cited figures and hidden figcaptions. This supports route-local text-equivalent evidence for images. | `route_local_positive` |
| Mobile layout | Rendered HTML includes viewport metadata and `@media (max-width: 600px)` CSS. No reviewed mobile screenshot or responsive-layout proof was found. | `partial_unreviewed` |
| Contrast/theme | No reviewed contrast or theme evidence was found for Chapter 1.2. | `missing_required_evidence` |
| Keyboard/focus | No reviewed keyboard/focus evidence was found. Chapter 1.2 surfaces are static documents, but any future interactive proof surface would need keyboard/focus proof. | `not_reviewed` |
| Semantic structure | Markdown/HTML headings, tables, images, and captions exist. No separate semantic or PDF accessibility audit was found. | `partial_unreviewed` |
| Internal-code exposure and inclusive language | No internal-code exposure was identified in the reviewed snippets. No dedicated inclusive-language review was found. | `partial_unreviewed` |

Accessibility conclusion: Chapter 1.2 has useful route-local accessibility
signals, especially asset integrity, alt text, and responsive CSS. It does not
have enough reviewed accessibility evidence for pack-strength language.

## Support And Differentiation Evidence Review

| Evidence dimension | Current Chapter 1.2 evidence | Decision |
|---|---|---|
| Prerequisite/start-state route | The chapter plan records dependencies across `1.2.1` through `1.2.4` and interleaving back to Chapter 1.1. Quality refs record voorkennis links. | `route_local_positive` |
| Scaffolding/fading | Quality refs record progression from visual/support tasks toward independent doeloefeningen. Reviews also note missing explicit start-exercise hints for `1.2.1`, `1.2.2`, and `1.2.3`. | `partial_with_flags` |
| Hints/repair routes | Answer models provide procedural feedback. Explicit hint or repair routes before/inside start exercises are weak or missing. | `partial_with_flags` |
| Advisory checks/next action | No reviewed advisory short-check, next-action, or companion route evidence was found. | `missing_required_evidence` |
| Differentiated practice/enrichment | Quality refs record differentiated practice sequences. `1.2.4` includes Denkertjes for analysis/evaluation above core questions. | `route_local_positive` |
| Companion materials | Quality refs for theory paragraphs state `companion_materialen: aanwezig: false`. `1.2.4` is consolidation and has no separate theory companion evidence. | `missing_required_evidence` |
| Product/school support boundary | Existing evidence supports product-route practice and feedback only. It does not prove school monitoring, interventions, accommodations, care plans, or classroom support decisions. | `school_owned_boundary_required` |

Support conclusion: Chapter 1.2 has visible practice progression and feedback
inside the product route. It does not have enough support/differentiation
evidence for pack-strength language because companion support, advisory routing,
explicit hints/repair, and school-owned support boundaries remain unresolved.

## INSPECT-10 Posture

Decision: `blocked_before_chapter_1_2_generator`.

INSPECT-10 should not generate a Chapter 1.2 Dutch evidence pack or treat
Chapter 1.2 as ready evidence-pack input. A later generator implementation can
be reconsidered only after one of these happens:

- a new INSPECT-9C-style target-equivalent proof sprint creates and reviews
  proof records for `1.2.1` through `1.2.4`; and
- a focused accessibility/support evidence sprint records route-local proof for
  mobile, contrast/theme, semantic/PDF accessibility where relevant,
  hints/repair, advisory route/next action, and product/school support
  boundaries; or
- a human owner explicitly authorises a diagnostic generator that preserves
  these blockers as blockers and does not produce pack-ready language.

## Product/School Boundary

4veco product evidence currently supports route-local statements such as:

- Chapter 1.2 includes reviewed target records and route-local doeloefening
  candidates.
- Chapter 1.2 generated materials include review notes, answer models, asset
  checks, alt text, and practice progression.
- Chapter 1.2 has known unresolved proof, accessibility, support, and generated
  output flags.

It does not support school-owned statements about implementation, monitoring,
accommodations, care plans, PTA validity, grading, summative assessment,
school-wide basic-skills provision, school SKA, or inspection judgement.

## Quality Log

| Issue | Category | Severity | Affected surface | Next action |
|---|---|---:|---|---|
| Chapter 1.2 lacks reviewed target-equivalent proof records | `target-equivalent-proof-gap` | high | `1.2.1` through `1.2.4` target-equivalent status | Insert proof sprint before Chapter 1.2 pack work. |
| Chapter 1.2 accessibility evidence is route-local and incomplete | `accessibility-evidence-gap` | high | Generated HTML/PDF/Markdown lesson surfaces | Review mobile, contrast/theme, semantic/PDF accessibility, and keyboard/focus applicability before pack-strength claims. |
| Chapter 1.2 support evidence is incomplete | `support-evidence-gap` | high | Practice route, hints, companion/advisory support | Add or review explicit hints/repair, companion/advisory route, and product/school support boundaries. |
| Chapter 1.2 companion evidence is absent in quality refs | `support-evidence-gap` | high | `1.2.1` through `1.2.3` quality refs | Treat companion/support evidence as missing until a separate generated-output or review sprint closes it. |
| `1.2.2` local review flags constrain proof use | `lesson-evidence-gap` | medium | `1.2.2` doeloefening and answer model | Resolve or explicitly carry stray answer-line and substitute-mechanism wording flags before proof closure. |
| `1.2.4` local review flags constrain integration proof use | `lesson-evidence-gap` | medium | `1.2.4` consolidation opgaven and asset notes | Resolve or explicitly carry frozen-yoghurt wording and orphaned-asset notes before proof closure. |
| INSPECT-10 Chapter 1.2 generator work remains blocked | `lesson-evidence-gap` | high | Future Dutch report-only generator scope | Insert remediation sprint or explicitly authorise diagnostic-only generator work that preserves blockers. |

## Validation Boundary

This sprint created no evidence pack, no generator, no package script, no
CI/build gate, no dashboard gate, no quality-ref integration, no Scale Gate
integration, and no generated lesson-output mutation.

No personal data was processed. No non-Dutch standards work was started.

## Next Action

Add an INSPECT-9C remediation sprint before INSPECT-10. Its first task should be
Chapter 1.2 target-equivalent proof specification and review, paired with a
minimal accessibility/support proof checklist. Do not start Chapter 1.2
evidence-pack generator work until that blocker is closed or explicitly carried
by a human-authorised diagnostic-only posture.

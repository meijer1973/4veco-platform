# REASON-REPLACE-AUDIT-1 Replacement Audit

Generated: 2026-06-03

Status: audit complete for `GATE-REASON-REVISION-1`; no replacement
authorization.

## Scope

This audit asks whether the current shared-shell reasoning tasks can replace
the reasoning game. The answer is no. The repaired playable lab is useful as
local practice evidence and as adoption-preparation proof, but it is not a
complete product-route replacement.

The audit covers current reasoning modes, answer-form scaffold lanes, and the
source/visual follow-ups named by the human review comments.

## Summary Decision

| Surface | Current evidence | Disposition | Replacement readiness | Required follow-up |
|---|---|---|---|---|
| mode 0 - stappen ordenen | playable step-ordering with repaired water context | wrap/refactor | not replacement-ready | product-route evidence plus clearer controls |
| mode 1 - deelvragen opbouwen | playable step-ordering bridge | wrap/refactor | not replacement-ready | claim/reason/evidence or question-planning task family proof |
| mode 2 - vind de fout | local error repair only | hold | not replacement-ready | `REASON-ERROR-REPAIR-1` two-tier/error-repair design |
| mode 3 - stroomdiagram/keten | ordered-chain bridge with repaired label | refactor | not replacement-ready | `REASON-FLOW-1` visual flow-builder proof |
| mode 4 - structuren matchen | held/refactor-scoped | hold | not replacement-ready | `REASON-CLASSIFY-1` classification-with-explanation design |
| mode 5 - redeneerantwoord opbouwen | structured self-check | wrap/refactor | not replacement-ready | answer-quality examples/rubric before proof claims |
| A97/A98 cues | live local scaffold cues | keep as scaffold | not replacement-ready | product-route examples and review-specific proof |
| A99 | catalog only | hold | not replacement-ready | `REASON-EXAMPLE-1` live example-answer evidence |
| A81 | source-use modifier only | hold | not replacement-ready | `REASON-SOURCE-1` source-based explanation route |

## Mode Details

### Mode 0: Stappen ordenen

Decision: wrap/refactor.

The repaired lab shows explicit context for the water-scarcity misconception
and uses shared `step_ordering`. This is strong local practice evidence. It
cannot replace the existing game route yet because product-route evidence must
show the same clarity, controls, route context, and feedback hierarchy in the
actual generated route.

Required proof before replacement:

- rendered product-route task with visible context;
- no compact-control ambiguity or a reviewed accessibility flag;
- clear local feedback and next action;
- no target-equivalent or mastery language.

### Mode 1: Deelvragen opbouwen

Decision: wrap/refactor.

Mode 1 is useful as a planning bridge. It helps students build the intermediate
questions needed before reasoning or calculation. It is not yet a full
claim-reason-evidence family and cannot replace every reasoning task that asks
students to construct explanation quality.

Required proof before replacement:

- explicit bridge wording;
- task family decision for question planning versus claim/reason/evidence;
- rendered route proof and usability proof.

### Mode 2: Vind de fout

Decision: hold.

Mode 2 remains local error repair only. A replacement-ready version needs
reviewed error categories and a bounded response form such as `two_tier_choice`
or an explicit `error_repair` family. Without that, it risks becoming a
guessing game.

Named follow-up: `REASON-ERROR-REPAIR-1`.

### Mode 3: Redeneerketen / flow bridge

Decision: refactor.

The repaired lab now uses chain-ordering language and explicitly states that it
is not a visual flow-builder. That repairs the overclaim in the evidence. It
does not remove the product need for visual flow-diagram construction where
that student action is the better learning design.

Named follow-up: `REASON-FLOW-1`.

### Mode 4: Structuren matchen

Decision: hold.

Mode 4 needs classification with explanation. Matching alone is too shallow for
reasoning replacement unless students also explain why the matched structures
share the relevant economic pattern.

Named follow-up: `REASON-CLASSIFY-1`.

### Mode 5: Redeneerantwoord opbouwen

Decision: wrap/refactor.

Mode 5 remains useful as self-check. It should not be treated as evaluated
constructed-response proof. Future replacement/adoption can keep it as a local
practice scaffold if the route clearly says students compare their own answer
against criteria.

Required proof before replacement:

- reviewed model-answer or example-answer comparison;
- feedback hierarchy that separates self-check from correctness;
- no target-equivalent reasoning proof claim.

## Answer-Form And Source Lanes

| Lane | Current state | Decision | Required follow-up |
|---|---|---|---|
| A97 `Leg uit dat` | useful live cue | keep scaffold | route-specific examples before adoption |
| A98 `Leg uit of` | useful live cue | keep scaffold | route-specific examples before adoption |
| A99 `Leg uit met voorbeeld` | catalog only | hold | build and prove live example-answer task |
| A81 source-use modifier | modifier only | hold | prove source-value/chain plus underlying answer form |
| A96 structured explanation support | local support | keep scaffold | no proof claim without answer-quality route |

## Required Downstream Sprint Series

| Sprint | Purpose | Authority boundary |
|---|---|---|
| `REASON-UX-HARDEN-1` | Improve compact controls, feedback hierarchy, mobile route placement, and dark theme consistency. | planning/adoption-preparation only unless separately authorized |
| `REASON-FLOW-1` | Specify and prove true visual flow-diagram construction. | no target-equivalent proof |
| `REASON-ERROR-REPAIR-1` | Design mode 2 error-repair/two-tier response with reviewed error categories. | no diagnostics or misconception profiling |
| `REASON-CLASSIFY-1` | Design mode 4 classification-with-explanation. | no replacement claim until rendered proof |
| `REASON-SOURCE-1` | Build A81 source-based explanation route combining source value, source chain, and answer form. | no exam/target proof without gate |
| `REASON-EXAMPLE-1` | Add live A99 example-answer evidence. | local practice only |
| `REASON-ADOPT-2` | Later product-route adoption packet after the above proof. | requires separate gate before generated output reliance |

## Replacement Boundary

No reasoning mode is replacement-ready today. The current evidence can support
bounded downstream planning/adoption-preparation. It cannot authorize generated
lesson output, source-data mutation, engine implementation, product-route
adoption, target-equivalent reasoning proof, diagnostics, adaptive routing,
mastery, sequencing, Scale Gate 1, or student/product use.

## Proof Required Before Any Future Replacement Claim

Future replacement claims must provide:

- rendered product-route output, not only a review lab;
- playable proof through visible controls;
- route context and next-action proof;
- at least one student-experience/usability review;
- focus/keyboard evidence;
- mobile and dark-mode evidence;
- explicit target-proof boundary language;
- human review after lead-review recheck.

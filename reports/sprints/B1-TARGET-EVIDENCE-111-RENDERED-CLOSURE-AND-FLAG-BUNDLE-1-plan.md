# B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1 Plan

Date: 2026-06-17

Status: completed.

Goal: produce current rendered/mobile evidence for the repaired `1.1.1` target-equivalent exit ticket, run REV-STD-1 review lanes, and decide whether a narrow readiness-flag implementation is justified.

## Product End-State And Original Spec

Product end-state: the first-three check surfaces keep advisory `Korte check` practice separate from target-equivalent `Exit ticket` evidence. The exit ticket must require real student work, avoid answer-giving scaffolds, provide inspectable generated output, and avoid completion/product/diagnostic/mastery authority unless a human review explicitly authorizes it.

Original sprint/gate spec:

- `reports/sprints/GATE-PRODUCT-3P-PREP-2-result.md`
- `reports/sprints/GATE-PRODUCT-3P-PREP-2-evidence-map.md`
- `reports/sprints/GATE-PRODUCT-3P-PREP-2-blocker-log.md`
- `reports/json/gate-product-3p-prep-2-proof.json`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.json`
- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- `reports/reference-planning/B1-TARGET-EVIDENCE-111-CLOSURE-AND-IMPLEMENTATION-BUNDLE-1-review-packet.md`
- `C:/wt/B1-111-RENDERED-20260617/4veco-lessen/specifications/product-end-state.md`
- `C:/wt/B1-111-RENDERED-20260617/4veco-lessen/specifications/companion-core-specifications.md`

## Non-Negotiable Requirements

1. `1.1.1` must align to the reviewed target context: 10 hectares, wheat profit EUR 500 per hectare, corn profit EUR 350 per hectare, wheat chosen, opportunity cost, and a 6/4 mixed-allocation comparison using scarcity.
2. Student-facing text must use profit/winst, not revenue/opbrengst, for the target calculation portions.
3. The rendered route must not expose accepted answers in placeholders before attempt.
4. Matching must not accept a correct final answer without required work.
5. The advisory `Korte check` must remain advisory and non-readiness evidence.
6. Completion language, product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, summative use, and student/product use remain blocked.
7. The readiness flag mutation is limited to `1.1.1` `gateApproved` and `targetReadinessEvidence`; `completionLanguageEligible` remains false.

## Work Plan

1. Captured current rendered evidence for `1.1.1` exit ticket and landing page across desktop/mobile, light/dark, retry, completed-held, and reload states.
2. Added a focused checker proving source/generated parity, approved readiness flags, hidden completion, no answer-cue placeholders, no visible internal codes, no overclaim language, and no horizontal overflow.
3. Produced proof JSON, screenshot manifest, and rendered proof Markdown.
4. Ran role reviews: teacher/didactic, target-operation, rendered-output/mobile, authority-boundary, repo/CI, and lead synthesis.
5. Lead review approved a narrow flag implementation; platform source flags were mutated and lesson output was regenerated from source.

## Current Evidence

- `build-scripts/sprints/capture-b1-target-evidence-111-rendered-closure-and-flag-bundle-1.js`
- `build-scripts/sprints/check-b1-target-evidence-111-rendered-closure-and-flag-bundle-1.js`
- `reports/json/b1-target-evidence-111-rendered-closure-and-flag-bundle-1-proof.json`
- `reports/sprints/B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1-screenshot-manifest.md`
- `reports/sprints/B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1-rendered-proof.md`

## Decision Rule

`PASS WITH FLAGS` may not carry a missing core requirement. The lead review found the core readiness requirements met for `1.1.1` and authorized only the narrow readiness flag mutation. All downstream authority remains blocked.

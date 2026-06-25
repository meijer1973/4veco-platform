# A96-CALCULATION-ANSWER-FORM-HARDENING-AND-SCALE-GATE-1-REREVIEW-1 Plan

Date: 2026-06-25

## Objective

Revise PR #148 and lesson PR #36 after human review found the A96 answer-form packet useful but not yet review-ready. The revision hardens the `1.1.2` A96 calculation answer form, removes answer-bearing substitution placeholders, expands canonical negative fixture coverage, regenerates the affected lesson output, and refreshes the rendered first-three Scale proof.

## Product And Gate References

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion specs: `../4veco-lessen/specifications/companion-core-specifications.md`
- A96 exemplar handoff: `references/exemplars/a96-answer-form/implementation-handoff.md`
- A96 negative fixtures: `references/exemplars/a96-answer-form/negative-fixtures.json`
- Prior A96 refinement packet: `reports/review-gates/A96-CALCULATION-ANSWER-FORM-REFINEMENT-1/review-packet.json`
- Scale proof packet: `reports/review-gates/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1/review-packet.json`

## Non-Negotiable Requirements

- Do not authorize completion language, product-route adoption, Scale Gate 1 closure, diagnostics, mastery/sequencing, PV, summative use, broad product use, or student/product use.
- Do not mutate target-readiness flags unless a strict source/generated mismatch is discovered and separately justified.
- Do not migrate routes.
- Do not hand-edit generated lesson output.
- A96 must require formula or method, labelled substitution, final answer, notation, and a contextual conclusion with direction.
- Answer-bearing substitution placeholders such as `920`, `800`, and `800` must be absent.
- The production evaluator must reject the canonical negative fixtures and adversarial conclusion strings.
- The first-three rendered Scale proof must be recaptured after the repair.
- PASS WITH FLAGS may not carry a missing core requirement.

## Work Plan

1. Rebase the platform and lesson branches onto current `main`.
2. Replace A96 substitution placeholders with neutral instructions in source data and generated lesson output.
3. Harden the Golden layout and task shell conclusion validation with explicit reject text and reject patterns.
4. Add canonical negative fixtures for final-answer-only, source-values-only, missing formula, wrong denominator, left-to-right token order, missing substitution, missing notation, direction-free conclusion, vague example-only answer, and duplicate-token risk.
5. Add a policy/checker fixture that rejects numeric answer values in substitution placeholders.
6. Regenerate lesson output through `scripts/deploy.js`.
7. Recapture the first-three rendered product-path proof with dedicated A96 desktop, mobile, dark, negative, correct, completed, and exemplar-comparison screenshots.
8. Run local validation, specialist review, lead review, PR readiness, and branch-protection proof against the exact remote heads.

## Expected PR Shape

- Platform PR #148: source data, engines, tests, checker/policy fixtures, proof capture/checker, refreshed proof artifacts, and report metadata.
- Lesson PR #36: generated lesson output only.
- Later merge order, if explicitly authorized by the owner for exact heads: platform first, lesson second.

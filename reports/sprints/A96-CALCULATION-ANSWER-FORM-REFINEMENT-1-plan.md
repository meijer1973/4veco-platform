# A96-CALCULATION-ANSWER-FORM-REFINEMENT-1 Plan

Date: 2026-06-24

## Objective

Close the A96 answer-form blocker that held Scale Gate 1 preparation by replacing the generic `1.1.2` price-increase work textarea with a visible calculation answer form, regenerating lesson output, and recapturing the first-three rendered product-path proof.

## Product And Gate References

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion specs: `../4veco-lessen/specifications/companion-core-specifications.md`
- A96 exemplar: `references/exemplars/a96-answer-form/implementation-handoff.md`
- Prior Scale packet: `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-result.md`
- Prior machine proof: `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json`

## Non-Negotiable Requirements

- The `1.1.2` `prijsstijging-procent` route must require formula/method, labelled substitution, final answer, notation, and contextual direction sentence.
- A final-answer-only response must not pass.
- The formula token bank must not be arranged in answer order.
- The old price must be one reusable visible token with two allowed uses, not visually identical hidden token IDs.
- Completion language must remain held.
- Do not mutate target-readiness flags unless a strict mismatch is found.
- Do not authorize product-route adoption, diagnostics, mastery/sequencing, PV, summative use, Scale Gate 1 closure, broad product use, or student/product use.
- Lesson output must be regenerated, not hand-edited.

## Work Plan

1. Migrate `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json` task `prijsstijging-procent` to `calculation_answer_form_capture`.
2. Extend the Golden calculation layout to render, collect, and evaluate calculation answer forms.
3. Update focused tests and policy registry checks for the new supported calculation family.
4. Regenerate Book 1 lesson output through `scripts/deploy.js`.
5. Recapture the first-three rendered product-path proof and rerun the proof checker.
6. Return with review-ready evidence and human Scale Gate review routing.

## Expected PR Shape

- Platform PR: source-data, renderer, tests, proof/check scripts, reports, and policy registry updates.
- Lesson PR: generated Book 1 output only.
- Later merge order: platform first, lesson second.

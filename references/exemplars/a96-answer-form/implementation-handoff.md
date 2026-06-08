# A96 Golden Exemplar v3 — implementation handoff

## Scope

Use this package to turn the uploaded A96 proof lab into a durable golden exemplar for calculation-answer-form tasks.

The original proof lab is valuable because it defines A96 as route-specific answer-form proof: method, labelled substitution, intermediate work, final answer, notation, and contextual conclusion. The weakness of the original rendered task is that most of that structure is hidden inside one generic textarea. The v3 exemplar keeps the full answer-form proof while reducing duplicate work.

## Files in this package

- `a96-answer-form-golden-exemplar-v3-prototype.html` — standalone playable golden exemplar.
- `a96-answer-form-golden-exemplar-v3-candidate-data.json` — candidate data/contract for platform implementation.
- `a96-answer-form-golden-exemplar-v3-negative-fixtures.json` — required positive and negative cases.
- `a96-answer-form-golden-exemplar-v3-quality-brief.md` — short rationale.
- `a96-answer-form-golden-exemplar-v3-ui-framework.md` — general UI/layout framework for teams.
- `a96-answer-form-golden-exemplar-v3-implementation-handoff.md` — this handoff.

## v3 polish changes

The v1 exemplar was already much stronger than the original A96 lab, but it still asked for some double work. v3 changes the visible answer path to:

1. **Schrijf de formule op die je gaat gebruiken**
   The student builds the percentage-change formula from tokens with distractors. The token bank must not be ordered so that clicking left-to-right gives the correct formula.

2. **Vul de formule in met bronwaarden**
   The student receives the formula structure from step 1 as a substitution template with open fields:

   ```text
   ( nieuwe prijs - oude prijs ) / oude prijs × 100%
   ```

   The student fills the three source-value slots: new price, old price in the numerator, and old price in the denominator.

3. **Bereken je antwoord**
   The student gives the final answer and the unit/notation only. This avoids repeating the full calculation in several separate fields.

4. **Schrijf de contextuele richtingzin**
   The student writes one short sentence that states the direction and context: the price of the bicycle rises by 15 percent.

## Required product change

Do not implement A96 as a generic `calculation_work_capture` textarea plus final answer. That makes the validator strong but the student product weak.

Implement a reusable structured task family or extension, for example:

```text
calculation_answer_form_capture
```

Minimum visible sections:

1. formula/method builder;
2. formula substitution template with open fields;
3. final answer;
4. unit/notation;
5. contextual direction sentence.

The answer form must be visible in the interface. If the only place where the answer-form structure exists is JSON or validator logic, the implementation has failed.

## Required interaction properties

- No static formula card before the attempt if formula/method is assessed.
- Formula/method is built by the student with plausible distractors.
- Token order may not reveal the answer by simple left-to-right clicking.
- Step 2 reuses the formula structure from Step 1 and asks the student to fill source values into open fields.
- The denominator must be the old price; a wrong-denominator case must fail.
- Step 3 contains only final answer and unit/notation.
- Step 4 contains only the contextual direction sentence.
- Placeholders may describe answer type but may not contain the answer.
- The checker must accept common notation: `15`, `15%`, `15 procent`, `15,0%`.
- Feedback appears after checking and tells which answer-form part is missing.

## Required validator fixtures

The following must fail:

- final answer only;
- source values only;
- missing formula/method;
- wrong denominator;
- token bank left-to-right answer order;
- missing substitution field;
- missing notation;
- conclusion without direction;
- vague example-only answer.

The positive case must pass only when formula, substitution, final answer, notation, and contextual direction sentence are all present.

## Required review proof

A lead reviewer may not pass by saying that A96 exists or that tests pass. Required proof:

- desktop initial screenshot;
- mobile initial screenshot;
- screenshot after partial/wrong input;
- screenshot after correct full answer;
- screenshot of feedback listing missing answer-form parts;
- proof that review-only autofill controls are absent from student output or hidden behind reviewer-only tooling;
- negative fixture output;
- side-by-side comparison with the golden exemplar.

## Sprint proposal

### Sprint 1 — `A96-GOLDEN-EXEMPLAR-2`

Import this exemplar into:

```text
references/exemplars/product-excellence/mtu-answer-forms/A96-calculation-answer-form/
```

### Sprint 2 — `A96-CALC-ANSWER-FORM-UI-2`

Implement or extend the shared task family so generated output matches the v3 structure.

### Sprint 3 — `A96-GOLDEN-REVIEW-2`

Run teacher-learning, student-experience, visual/interaction, testing/regression, accessibility, and lead synthesis reviews. The lead review must compare the generated output to the exemplar, not only inspect data contracts.

## Definition of done

The work is done only when a reviewer can open the generated exercise and immediately see the complete A96 answer form without reading JSON or validator code.


## v3 polish — no invisible duplicate tokens

The v2 prototype contained two visually identical answer tokens labelled `oude prijs`, backed by different hidden IDs for numerator and denominator. That creates an invisible 50/50 failure: a student can build a formula that looks exactly correct but is rejected because the hidden token IDs are swapped.

This is now forbidden. When the same concept appears twice in a formula, use **one reusable token** with a usage count, for example `oude prijs ×2`, and validate the sequence with the same token ID appearing twice.

Policy: never create two visually indistinguishable correct controls with different hidden meanings. If the distinction matters, make it visible to the student; if it does not matter visually, the internal IDs must not make it matter.

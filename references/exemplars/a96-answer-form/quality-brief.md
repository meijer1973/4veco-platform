# A96 Golden Exemplar v3 — quality brief

This version keeps the original A96 proof requirement but reduces double work.

## Why v3 is better than v1

- Step 1 now names the action precisely: **Schrijf de formule op die je gaat gebruiken**.
- The token bank is no longer arranged so that left-to-right clicking solves the formula.
- Step 2 gives the formula structure from step 1 and asks students to fill source values and intermediate values into open fields.
- Step 3 now asks only for **Eindantwoord** and **Eenheid of notatie**.
- Step 4 is only the contextual direction sentence.

The result is closer to how a strong test answer should be written: the calculation is visible, the final answer is clear, and the context sentence explains the result.

## Product standard demonstrated

A good A96 answer-form task does not hide the answer structure in one textarea. It makes the answer form visible:

```text
formula -> substitution -> intermediate work -> final answer + notation -> context sentence
```

This is what the shared task engine should preserve when implementing the exemplar.

## Remaining implementation warning

Do not copy this as static HTML into generated output. Convert the pattern into reusable task-family behavior. The generated product must match the rendered experience, not merely the JSON contract.


## v3 polish — no invisible duplicate tokens

The v2 prototype contained two visually identical answer tokens labelled `oude prijs`, backed by different hidden IDs for numerator and denominator. That creates an invisible 50/50 failure: a student can build a formula that looks exactly correct but is rejected because the hidden token IDs are swapped.

This is now forbidden. When the same concept appears twice in a formula, use **one reusable token** with a usage count, for example `oude prijs ×2`, and validate the sequence with the same token ID appearing twice.

Policy: never create two visually indistinguishable correct controls with different hidden meanings. If the distinction matters, make it visible to the student; if it does not matter visually, the internal IDs must not make it matter.

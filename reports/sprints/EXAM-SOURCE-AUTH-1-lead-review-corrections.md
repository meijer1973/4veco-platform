# Lead Review Corrections: EXAM-SOURCE-AUTH-1

Generated: 2026-06-03

## Round-1 verdict

Round 1 returned REVISE.

## Corrections applied

- Updated `build-scripts/sprints/check-exam-source-authority1.js` so each
  forbidden-proof negative fixture must fail with an error containing the exact
  forbidden term.
- Changed forbidden-term matching to prefer the longest matching phrase so
  `local official-style source` is not reduced to the shorter `official-style`
  term.
- Expanded product-boundary enforcement to require every named contract key for
  product-route adoption, target-equivalent proof, diagnostics, adaptive
  routing, mastery/sequencing, PV, Scale Gate 1, student/product use, source
  mutation, reconstruction, runtime, transformation, and generated output.

## Resolution evidence

The following wrapped command passed after correction:

```text
node build-scripts/sprints/check-exam-source-authority1.js
```

## Round-2 readiness

Ready for round 2 after the checker pass and this correction log are recorded.

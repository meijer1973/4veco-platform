# Sprint MATH-REFINE-1: Gate Handoff

Generated: 2026-05-31

## Purpose

Record what MATH-REFINE-1 hands to later planning, implementation, and human
review gates.

This handoff is planning/preparation only. It does not authorize
implementation, generated output, target-equivalent claims, Scale Gate 1, or
student/product use.

## Handoff Summary

MATH-REFINE-1 confirms that MATH-UX-2 is useful local math/calculation
practice and should be refactored rather than rebuilt from scratch.

It also confirms that current route evidence is not enough for
target-equivalent `1.1.2` proof:

- the target exercise requires `A38`, `A39`, and `D31`;
- current generated route scope exposes `A38` and `A39`;
- target subquestion `d` requires an explicit D31 short explanation of why
  108 to 112 is 4 index points, not 4 percent;
- current A39 pitfall text does not count as checked D31 student action.

No target-equivalent completion language is authorized.

## Handoff To Possible MATH-REFINE-2

`MATH-REFINE-2` is recommended only if explicitly authorized. Its minimum
scope should be:

1. harden the `1.1.2` math route around A38/A39/D31 target operations;
2. add or generate a checked D31 calculation-plus-short-explanation task;
3. keep the shared route layer and shared task shell as the implementation
   spine;
4. prove rendered desktop/mobile/dark/feedback states;
5. keep all output local-practice-only with `targetEquivalentProof: false`.

`MATH-REFINE-2` must not publish a target-equivalent exit ticket unless a
separate gate explicitly authorizes that scope.

## Handoff To CHECK-Q2-PLAN

`CHECK-Q2-PLAN` must treat `1.1.2` as requiring a target-equivalent task that
checks the complete operation chain:

- old/new percentage change;
- price-index calculation;
- index-to-index percentage change;
- index-point versus percentage-change explanation;
- answer form with formula, substitution, intermediate work, final answer,
  notation, and short conclusion.

The advisory short check may remain useful, but it cannot replace this
target-equivalent proof task.

## Handoff To L1.7B-Q2 And GATE-L1.7B-Q2

Before `GATE-L1.7B-Q2` can approve paragraph-completion language for `1.1.2`,
review evidence must show:

- D31 is explicitly checked, not merely mentioned;
- the target-equivalent task is at the same level as the paragraph target
  exercise;
- all four subquestion operations are covered in the proof task or an
  equivalent reviewed chain;
- generated output uses the shared route/task-shell model;
- feedback remains neutral and local until successful proof completion;
- no diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
  Scale Gate 1, or product use is inferred from the route.

## Handoff To GATE-ENGINE-1 Flag Closure

This sprint resolves the planning part of the GATE-ENGINE-1 math flag by
providing:

- target-operation chain;
- coverage matrix;
- implementation-prep requirements;
- gate handoff;
- deterministic evidence checker;
- lead-review cycle.

It does not resolve the implementation or rendered-output proof work.

## Product Boundary

No implementation, generated lesson output, protected reference mutation,
source exit-ticket creation, target-exercise field writes, candidate storage,
candidate writes, projection refresh, target-equivalent completion language,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use is authorized by MATH-REFINE-1.

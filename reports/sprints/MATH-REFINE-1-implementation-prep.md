# Sprint MATH-REFINE-1: Implementation-Prep Record

Generated: 2026-05-31

## Purpose

Prepare the concrete implementation questions and proof requirements for a
future math-route hardening sprint.

This record does not authorize implementation. A future sprint such as
`MATH-REFINE-2` would need explicit authorization before changing engine code,
generated data, lesson output, or source data.

## Recommended Future Route

Recommended future implementation direction:

```text
MATH-REFINE-2 should harden the `1.1.2` math route around A38, A39, and D31.
D31 should be surfaced in the math route as a shared
calculation-plus-short-explanation task, with optional reasoning-route
scaffolding but not as a reasoning-only detour.
```

Reason:

- subquestions `a`, `b`, and `c` require calculation/work capture;
- subquestion `d` requires both calculation and explanation;
- separating D31 entirely into reasoning would hide a required part of the
  math target chain from the main calculation route.

## Future File Owners

These are planning owners, not current edit authorization.

| Surface | Future owner file/module | Expected role |
|---|---|---|
| Shared route request/view model | `engines/skill-map-engine.js` | Keep route state and student-facing route panel authoritative. |
| Math practice engine | `engines/skilltree-engine.js` | Continue evaluating math practice through shared task-shell task models. |
| Math practice UI | `engines/skilltree-ui.js` | Render task-shell families without private duplicate feedback/state paths. |
| Math generator data | `engines/skilltree/generators.js` | Add or adjust A38/A39/D31 task payloads only if a future implementation sprint authorizes it. |
| Shared task shell | `engines/task-shell-engine.js`, `engines/task-shell-ui.js`, `engines/task-shell.css` | Provide numeric, work-capture, final-answer, notation, and short-explanation interactions. |
| Generated route data | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree/1.1.2.js` | May change only through authorized platform generation/deploy commands, never by hand. |

## Required Future Data Changes

A future implementation sprint should prepare exact diffs or generator changes
for:

1. adding `D31` to the relevant `1.1.2` route scope or otherwise proving D31
   is explicitly part of the math target-operation chain;
2. creating a target-chain task sequence for:
   - EUR 800 to EUR 920 percentage change;
   - EUR 150 to EUR 162 price index;
   - index 108 to 112 percentage change;
   - short explanation of why 4 index points is not 4 percent;
3. keeping local-practice feedback neutral and advisory;
4. preserving `targetEquivalentProof: false` until `L1.7B-Q2` and
   `GATE-L1.7B-Q2`.

## Required Future Task-Shell Families

Future rendered proof should show:

- `numeric_input`;
- `calculation_work_capture`;
- `final_answer_entry`;
- `unit_notation_field`;
- `short_constructed_response` or `structured_reasoning`.

The D31 task must require the student to write or assemble the explanation,
not merely read a hint.

## Validator Requirements

A future implementation sprint should add or extend validators so they fail
when:

- `1.1.2` target-operation coverage omits `D31`;
- target subquestion `d` is not represented by an explicit task;
- D31 coverage is only a generic pitfall mention and not a checked student
  action;
- the route treats `108 -> 112` as `4%`;
- the route lacks visible calculation/work capture for A38/A39 operations;
- generated output shows target-equivalent completion language before
  `GATE-L1.7B-Q2`;
- the short check is visually merged with target-equivalent proof status.

## Rendered-Output Proof Requirements

Future implementation closure should include browser-inspected proof for:

- desktop light-mode `1.1.2` math route with route panel and task shell;
- desktop dark-mode `1.1.2` math route with feedback state;
- mobile or narrow viewport route panel before task controls;
- A38 task showing work capture and final `15%`;
- A39 task showing index `108`;
- D31 task showing index points versus percentage change and about `3.7%`;
- feedback state that suggests local practice without diagnostics, mastery,
  sequencing, target-equivalent proof, or product-use claims.

## Stop Conditions For Future Implementation

Stop a future math implementation sprint if:

- D31 can only be covered by hiding it in unrelated reasoning practice;
- the implementation creates a private feedback/state path outside the shared
  route and shared task shell;
- generated output must be hand-edited to pass;
- `source-data/book-*/exit-ticket/*.json` must be created before
  `L1.7B-Q2`;
- target-equivalent completion copy appears before `GATE-L1.7B-Q2`;
- diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
  Scale Gate 1, or product use is introduced.

## Not Authorized Here

MATH-REFINE-1 does not authorize:

- implementation edits;
- generated lesson output;
- target-exercise field writes;
- protected reference mutation;
- unit minting or answer-skill candidate writes;
- source exit-ticket creation;
- target-equivalent completion language;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use.

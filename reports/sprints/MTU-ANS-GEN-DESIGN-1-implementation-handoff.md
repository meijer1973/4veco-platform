# MTU-ANS-GEN-DESIGN-1 Implementation Handoff

Generated: 2026-06-07

## Recommended Next Sprint

Recommended next sprint: `MTU-ANS-PROOF-IMPL-1`.

Purpose: implement a bounded route-specific proof for the highest-priority
answer-form units without exposing all answer-form MTUs as generic skill-tree
route rows.

## Priority Order

1. `A96` calculation answer form, because calculation-work support already has
   unit/notation fields and direct relevance to reviewed `1.1.2`.
2. `A98` direction-first explanation, because `1.1.1` and reasoning routes
   already carry the A98 versus held-evaluation blocker.
3. `A81` source-use modifier paired with an underlying answer form, because
   `1.1.3` source/table reasoning remains blocked without source-use proof.
4. `A97` given-conclusion explanation, after the route has a live target case.
5. `A80` concise identification, only where a live prompt actually asks for
   noem/geef-aan behavior.
6. `A99` example-answer proof, held until a live evidence case is selected.

## Later Allowed Implementation Surfaces

A later implementation sprint may touch only after explicit plan approval:

- shared task-shell task data or route-specific task fixtures;
- route-specific checker scripts under `build-scripts/sprints/`;
- generated proof fixtures under `reports/sprints/`;
- rendered review labs and screenshots under `reports/sprints/` or
  `reports/review-gates/`;
- source-data or generated lesson output only if the later sprint explicitly
  authorizes it and follows generated-output proof requirements.

It should not start by adding `GEN_A80`, `GEN_A81`, or `GEN_A96`-`GEN_A99` as
old-style skill-tree randomizers unless a later plan proves that format
preserves the required answer action.

## Required Proof For Later Implementation

Every later implementation must include:

- route-specific rendered lab or generated lesson output;
- desktop, mobile, and dark-mode screenshots;
- initial, retry/feedback, next-action, and completed states where relevant;
- checker proof that the task cannot pass as source-only, final-answer-only,
  direction-free, example-only, or standalone A81 proof;
- preserved zero blocked leaks in `check-skilltree-generator-readiness.js`;
- lead-review round 1, correction log, and round 2 before closure;
- human review if any student-facing product-route adoption or
  target-equivalent proof claim is made.

## Explicit Non-Goals

- Do not expose answer-form units in generic `ROUTE_SKILLS`.
- Do not claim diagnostics, mastery, sequencing, Scale Gate 1, or product use.
- Do not implement `A99` before selecting a reviewed live evidence case.
- Do not treat `A81` as a complete answer form.
- Do not convert answer-form MTUs into shallow multiple-choice vocabulary
  checks.

## Handoff Verdict

The next implementation should be route-specific shared-task-shell proof and
not generic skill-tree generator expansion. The generator backlog remains real, but
for these answer-form units the implementation question is "what proof action
does the student perform in a real route?" before it is "which `GEN_Axx`
function exists?".

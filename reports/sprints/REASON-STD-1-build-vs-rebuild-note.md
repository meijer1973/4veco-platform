# Sprint REASON-STD-1: Build Versus Rebuild Note

Generated: 2026-06-02

## Decision

The reasoning game should not be rebuilt from scratch at this sprint boundary.
It should become a thin wrapper around shared standard task families where the
student action is already representable, while the modes that resist the
current standard are refactored before generated-route adoption.

## Keep

Keep the current reasoning engine as the content and problem-shape provider for
local reasoning practice. It still carries useful economics contexts, causal
steps, distractor steps, flow slots, structure groups, and the existing
`structured_reasoning` self-check surface.

Keep mode 5 `Redeneerantwoord opbouwen` as shared `structured_reasoning`
self-check. It remains practice feedback only. It is not answer-form proof,
target-equivalent proof, diagnostic output, mastery, sequencing, summative
status, or product-wide authority.

## Wrap Now

Mode 0 can be wrapped as `step_ordering`.

Mode 1 can be wrapped as a `claim_reason_evidence` reasoning action using the
shared `step_ordering` response shape.

Mode 3 can be wrapped as an ordered `flow_diagram_build` / `cause_effect_chain`
bridge. The current runtime proof uses `step_ordering`; later UI work should
make the visual flow relation stronger when route adoption starts.

## Refactor Before Adoption

Mode 2 `Vind de fout` should not be adopted through a weak generic `choice`
task without review. A later sprint must decide whether it becomes:

- `two_tier_choice` when the student must identify both the faulty step and the
  reason it is wrong;
- a bounded `choice` task only when the reviewed action is truly sparse
  selection;
- a new `error_detection` family if the shared standards cannot represent the
  task honestly.

Mode 4 `Structuren matchen` should be refactored before adoption. The current
learning action is closer to `classification_with_explanation` than plain
`matching_pairs`. A later sprint must add reviewed one-to-one match banks,
distractor checks, and an explanation or repair step where needed.

## Rebuild Trigger

The reasoning game should be rebuilt only if the adoption sprint proves that
current modes cannot consume the shared route layer, shared task shell,
standard feedback model, and next-action model without keeping a separate
bespoke product surface.

If a mode keeps independent UI/state/feedback logic after adoption, that mode
must either be reduced to a thin wrapper or moved into a named rebuild/removal
sprint.

## Next Reasoning Sprints

Recommended sequence:

1. `REASON-ADOPT-1`: adopt the wrapped standard-family tasks in a playable
   generated reasoning route with route-specific screenshots and DOM proof.
2. `REASON-PLAY-1`: run actual usability agents against the playable reasoning
   route and record whether the agents understood how to complete the tasks
   without trial-and-error.
3. `REASON-ANSWERFORM-2`: connect reasoning practice to A97/A98/A99/A81
   answer-form scaffolds and decide whether mode 2/mode 4 need new families.
4. `GATE-REASON-STD-1`: direct-comment human evidence gate with playable
   output, screenshot proof, usability-agent traces, validators, and carried
   flags.

No generated lesson output, source-data mutation, target-equivalent claims,
diagnostics, mastery/sequencing, Scale Gate 1, or product use is authorized by
this note.


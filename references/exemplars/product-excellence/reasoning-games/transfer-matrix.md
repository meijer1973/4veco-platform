# Shared task promotion matrix

## Decision rule

Promote the **student action**, not the paragraph wording. Prefer existing
families or compositions. Add a new primitive only when an existing family
cannot preserve the exemplar interaction without distortion.

| Exemplar pattern | Existing capability | Disposition | Required extension or contract |
|---|---|---|---|
| Order-free evidence cards | `multi_select`, `source_value_selection` | extend/compose | max selection, stable shuffle, selected tray, individual remove |
| Genuine misconception choice | `choice`, `two_tier_choice` | reuse | misconception metadata remains hidden; feedback after attempt |
| Causal chain cards | `source_chain_builder`, `step_ordering` | extend | one-click next placement, local replace/remove, neutral slots, no card role tags |
| Connector in complete sentence | `cloze_tile_select` | extend | reusable tiles, equivalence sets, complete-sentence frame, local replacement |
| Functional answer rows | `sentence_builder`, `structured_short_response` | compose or new family | explicit answer functions, one-click replace, assembled preview, set/order semantics |
| Parallel valid calculations | `multi_select` | extend | formula-card rendering, exact set, stable positions |
| Claim repair grid | functional answer builder | compose | verdict/evidence/explanation rows |
| Graph point evidence | graph module + source selection | new domain primitive likely | accessible point targets, selected tray, stable geometry, textual fallback |
| Claim strength | `choice` or `two_tier_choice` | reuse | observation/estimate/unsupported semantics |
| Source/task dual pane | exit-ticket source workspace pattern | promote shared layout | independent scroll, mobile natural flow, behavior proof |
| Stable randomization | scattered helper logic | shared utility | deterministic seed optional, no reshuffle on state change |

## Proposed minimal shared capability set

1. `stable_session_shuffle` utility.
2. `evidence_selector` composition over multi-select/source-value selection.
3. `functional_answer_builder` primitive or clean composition.
4. `connector_sentence_cloze` extension.
5. `graph_evidence_selector` domain-specific primitive.
6. `dual_pane_source_task_workspace` shared layout component.

## Do not build

- separate paragraph-specific task families for every exemplar;
- a generic "reasoning mode" switcher as the authoring model;
- a universal family whose schema is so broad that validators cannot determine
  the student action;
- shared reuse that removes graph interaction, functional answer rows, local
  repair or stable layout.

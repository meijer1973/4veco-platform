# Sprint REASON-REFINE-1: Answer-Form Integration Plan

Generated: 2026-05-31

## Purpose

Define how a future reasoning-route hardening sprint should connect the
current shared `structured_reasoning` task family to reviewed answer-form
lanes.

This is planning/preparation evidence only. It does not implement route
changes, edit reasoning CSVs, regenerate generated output, or authorize
target-equivalent claims.

## Current Route Shape

The current REASON-UX-2 route is useful local practice:

- it loads the shared route panel;
- it exposes six reasoning modes;
- mode 5, `Redeneerantwoord opbouwen`, uses the shared
  `structured_reasoning` task shell;
- the written-response criteria are generic:
  - name the starting situation or cause;
  - explain the economic intermediate step;
  - finish with the conclusion in context;
- after checking, the route reveals an example route from the current problem
  steps and flow blocks;
- mode 5 is self-check-only and does not count as persistent `goed` progress.

The current route is not yet answer-form specific. A single generic scaffold
cannot prove the different answer patterns required by `leg-uit-dat`,
`leg-uit-of`, source-use answers, calculation-plus-explanation answers, or
correction-model-style answer construction.

## Canonical Future Model

Future reasoning tasks should keep `structured_reasoning` as the interaction
family, but the task payload must declare the answer form being scaffolded.

Proposed planning payload:

```json
{
  "family": "structured_reasoning",
  "answer_form_lane": "ANS_LEG_UIT_OF",
  "answer_form_units": ["A98"],
  "answer_form_modifier": null,
  "underlying_answer_form": "ANS_LEG_UIT_OF",
  "operation_tags": ["choose_direction", "causal_chain", "context_conclusion"],
  "content_units": ["B01", "B02"],
  "source_use_required": false,
  "criteria": [
    "Kies eerst de richting of ja/nee-uitkomst.",
    "Gebruik het economische mechanisme.",
    "Werk de causale schakels uit.",
    "Sluit af met de conclusie in de context."
  ],
  "boundary_flags": {
    "targetEquivalentProof": false,
    "diagnostics": false,
    "masteryDecision": false,
    "automaticSequencing": false,
    "summativeUse": false
  }
}
```

This structure is not a required schema yet. It is the implementation target
that a later exact sprint should validate and either adopt or revise.

## Answer-Form Lanes

| Lane | Unit | Future reasoning scaffold | Current status |
|---|---|---|---|
| `ANS_LEG_UIT_DAT` | `A97` | Use when the question gives the conclusion and the student must build the causal chain toward it. Criteria must include given conclusion, starting cause/context, two or more causal links, and explicit return to the conclusion. | Not implemented in reasoning route; plan only. |
| `ANS_LEG_UIT_OF` | `A98` | Use when the student must first choose a direction, yes/no outcome, or alternative and then justify it. Criteria must include first-sentence choice, mechanism, causal links, and no unresolved both-sides answer. | Not implemented in reasoning route; plan only. |
| `ANS_LEG_UIT_MET_VOORBEELD` | `A99` | Use when the prompt asks for an example plus explanation. Criteria must include fitting example, relevant feature, why it matches the concept/mechanism, and context link. | Not first repair priority for Book 1 targets; plan only. |
| `ANS_NOEM_GEEF_AAN` | `A80` | Use only for concise identification inside a larger chain, such as identifying a source interval or actor. It must not replace required explanation. | Generator-blocked/non-interactive; planning evidence only. |
| `ANS_BRON_GEBRUIKEN` | `A81` | Source-use modifier. Criteria must include source observation with label/period/unit/direction, economic meaning, and connection to an underlying answer form. | Generator-blocked/non-interactive; never standalone. |
| `ANS_BEREKEN` | `A96` | Calculation answer-form wrapper coordinated with math/graph routes. Reasoning may scaffold the explanation after calculation, but calculation mechanics remain owned by math/graph task families. | Generator-blocked/non-interactive; planning evidence only. |

## Paragraph Mapping Candidates

### `1.1.1`

Target reasoning need:

```text
Compare a neighbor's wheat/corn choice and explain whether it is better using
scarcity and opportunity costs.
```

Candidate future mapping:

- `ANS_LEG_UIT_OF` (`A98`) if the prompt asks the student to decide whether
  the choice is better and explain the direction;
- content units such as scarcity and opportunity-cost units remain in the
  underlying route;
- if a later review determines that the prompt is a true evaluation
  (`beoordeel`) rather than a direction-choice explanation, the lane must stay
  held under `ANS_ANALYSEER_BEOORDEEL` until a later gate authorizes it.

Current evidence:

- current reasoning data has scarcity and opportunity-cost causal chains;
- current self-check can support local practice;
- no answer-form-specific criteria are present.

### `1.1.2`

Target reasoning need:

```text
Explain why index 108 to 112 is 4 index points, not 4 percent, and calculate
the correct percentage change.
```

Candidate future mapping:

- `ANS_BEREKEN` (`A96`) for visible calculation, coordinated with math route;
- `ANS_LEG_UIT_DAT` (`A97`) for the given conclusion that the claim is wrong;
- content unit `D31` for index points versus percentage change;
- `ANS_LEG_UIT_OF` (`A98`) only if a future variant asks "is this 4 percent?"
  and leaves the yes/no direction open.

Current evidence:

- current reasoning data includes index-point style practice;
- MATH-REFINE-1 found target-equivalent reliance blocked until D31 is
  explicitly routed and checked;
- current reasoning self-check does not yet distinguish calculation answer
  form from explanation answer form.

### `1.1.3`

Target reasoning need:

```text
Use table/graph evidence to identify where a 50 percent sales drop could have
happened and explain the claim using the source.
```

Candidate future mapping:

- `ANS_NOEM_GEEF_AAN` (`A80`) for identifying the relevant source interval,
  only if the prompt asks for concise identification;
- `ANS_BRON_GEBRUIKEN` (`A81`) as source-use modifier;
- `ANS_BEREKEN` (`A96`) for any required percentage or quantity calculation;
- `ANS_LEG_UIT_DAT` (`A97`) or `ANS_LEG_UIT_OF` (`A98`) for the explanatory
  conclusion, depending on whether the conclusion is given or chosen.

Current evidence:

- current reasoning and graph practice include source/table reasoning;
- GRAPH-REFINE-1 found a graph-axis target-chain blocker, so proof reliance
  remains blocked;
- current reasoning route does not yet require source observation plus
  underlying answer form.

## Held-Lane Boundary

Future implementation must not silently encode held lanes as generic reasoning:

- `ANS_ANALYSEER_BEOORDEEL` remains held until stronger evidence and an exact
  gate approve it;
- `ANS_MOTIVEER_CLASSIFICATIE` / Type 4 remains held until current extraction
  and target evidence support it;
- graph/draw/shade answer forms remain held for graph-object evidence and
  target mapping;
- q3/q15 EX answer-skill overlays remain visible as no-write overlay needs.

If a future reasoning task appears to need one of these lanes, the task must
be marked held or routed to a separate review, not squeezed into A97/A98.

## Source-Use Rule

`A81` may never be a complete answer by itself.

Valid future combinations:

```text
A81 + A97
A81 + A98
A81 + A96 + A97/A98
A81 + held classification/graph lane, only after the underlying lane is authorized
```

Invalid future combination:

```text
A81 alone
```

The future checker must fail standalone source-use records.

## Generator-Blocked Rule

The answer-form units `A80`, `A81`, and `A96`-`A99` currently inform planning
only. They remain generator-blocked/non-interactive in
`reports/json/skilltree-generator-readiness.json`.

A future implementation may use the answer-form concepts in a reasoning
task-shell scaffold only after it proves that the generator-blocked MTUs do
not leak into student-facing skill-tree routes or product-scale claims.

## Student-Facing Copy Rule

Future reasoning output may use local practice language such as:

```text
Vergelijk je antwoord met de zelfcheck.
Oefen deze redenering nog een keer.
Gebruik de bron in je uitleg.
```

It may not use:

```text
Je hebt bewezen dat je de eindopgave kunt.
Je beheerst dit onderdeel.
Je mag automatisch door.
```

No target-equivalent completion language is authorized by this sprint.

## Future Implementation Direction

Recommended future route:

1. Add answer-form metadata to the reasoning data contract or to a reviewed
   derived route payload.
2. Update the reasoning builder to validate allowed answer-form lanes and
   reject standalone `A81`.
3. Update `buildStructuredReasoningTask` to create criteria from answer-form
   metadata rather than one generic criterion set.
4. Keep `structured_reasoning` self-check-only until a later gate approves any
   evaluated constructed-response behavior.
5. Add route-output validators and rendered-output proof for A97/A98/A81
   examples before any target-equivalent use.

This direction is a planning recommendation, not implementation authority.

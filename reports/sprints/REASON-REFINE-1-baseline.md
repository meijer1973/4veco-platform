# Sprint REASON-REFINE-1: Baseline

Generated: 2026-05-31

## Scope

Baseline for `REASON-REFINE-1`, the reasoning answer-form integration
planning sprint authorized by `GATE-ENGINE-1`.

This baseline is read-only evidence. No implementation, generated output,
reasoning CSV edit, protected reference mutation, target-exercise field write,
source exit-ticket write, candidate storage, target-equivalent claim, Scale
Gate 1 reliance, or student/product use is authorized.

## Plan reference

- Plan: `reports/sprints/REASON-REFINE-1-plan.md`
- Plan metadata: `references/data/sprints/REASON-REFINE-1.plan.json`

## Governing Evidence

| Evidence | Baseline finding |
|---|---|
| `../4veco-lessen/specifications/product-end-state.md` | The end state requires a visible route to local target-equivalent proof. Graph/table, calculation, constructed-response, and checkpoint interactions use the shared task shell where actions overlap. |
| `../4veco-lessen/specifications/companion-core-specifications.md` | Advisory short checks are separate from target-equivalent exit tickets. Target-equivalent proof must cover the complete reviewed operation chain at the same level with matching answer forms. |
| `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md` | GATE-ENGINE-1 accepted refactoring reasoning around answer-form and constructed-response standards and authorized only downstream planning/preparation work. |
| `reports/sprints/GAME-ARCH-2-task-shell-api.md` | `structured_reasoning` is live as a shared task-shell family, but it needs refactor around answer-form standards before stronger use. |
| `reports/sprints/GAME-ARCH-2-file-disposition.md` | `engines/reasoning-engine.js` is a wrapper candidate: keep/refactor around shared route/task shell and answer-form quality boundaries. |
| `reports/sprints/REASON-UX-2-student-route-proof.md` | Current reasoning routes render through shared route/task-shell and include `Redeneerantwoord opbouwen` as local practice only. |

## Current Reasoning Route Evidence

Current generated-route evidence:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.1.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.2.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.3.js`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-reasoning-task-shell-fixture.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- `build-scripts/sprints/check-reason-ux2-route-output.js`

Current generated reasoning route state:

- all three Book 1 routes load the shared route panel and task shell;
- each route exposes six modes, including `Redeneerantwoord opbouwen`;
- `Redeneerantwoord opbouwen` uses the `structured_reasoning` task family;
- the current self-check criteria are generic: start/oorzaak,
  economische tussenstap, and conclusion in context;
- feedback remains neutral and self-check based;
- mode 5 completion does not count as persistent `goed` progress;
- no `1.1.2` or `1.1.3` exit-ticket source or page exists;
- no target-exercise `question_type` or `answer_form` fields are written;
- no answer-skill candidate storage exists.

## Target Exercise Baseline

Read-only target exercise source:
`references/authored/course-target-exercises.json`.

### `1.1.1 Schaarste en economisch denken`

The target exercise asks students to calculate revenue from wheat, identify
opportunity costs, then compare a neighbor's wheat/corn choice and explain
whether it is better using scarcity.

Reasoning implication:

- the final subquestion is not only recall; it requires a comparison or
  judgement with an explanation grounded in scarcity/opportunity costs;
- current reasoning practice has scarcity and opportunity-cost causal-chain
  rows, but it does not yet map the final answer to an explicit answer-form
  lane such as `leg-uit-of` or a held evaluation/classification pattern;
- target-equivalent use remains blocked until the answer-form and complete
  operation chain are reviewed.

### `1.1.2 Percentages en indexcijfers`

The target exercise asks students to calculate percentage change, calculate a
price index, calculate inflation from index values, and explain why index 108
to 112 is not 4 percent.

Reasoning implication:

- reasoning must coordinate with the math route rather than duplicate it;
- the short explanation for the index-point trap is a constructed-response
  operation that likely combines calculation answer form (`A96`) with
  explanation (`A97` or `A98`) and the content unit `D31`;
- MATH-REFINE-1 found that D31 target-equivalent reliance is blocked until
  explicit D31 coverage is routed and checked.

### `1.1.3 Evenwicht en vraaggrafieken`

The target exercise asks students to use a table/graph situation and evaluate
a newspaper claim that sales dropped by 50 percent, including an explanation
using table evidence.

Reasoning implication:

- reasoning must coordinate with the graph/table route and source-use
  modifier rather than duplicate graph drawing or table reading;
- the likely answer-form chain includes source use (`A81`) plus explanation
  and/or calculation (`A96`, `A97`, `A98`);
- GRAPH-REFINE-1 found a graph-axis target-chain blocker, so
  target-equivalent graph/reasoning reliance remains blocked until repaired
  and reviewed.

## Answer-Form Unit Baseline

Read-only MTU source: `references/machine/micro-teaching-units.json`.

| Unit | Baseline role for reasoning hardening |
|---|---|
| `A80 Noem of geef-aan antwoord geven` | Concise identification/list answers. Useful for source labels or requested item identification, but not a substitute for explanation. |
| `A81 Bron gebruiken in een antwoord` | Source-use modifier. Must combine with an underlying explanation, calculation, classification, or graph answer form. |
| `A96 Bereken-vraag beantwoorden` | Calculation answer-form wrapper. Reasoning may need to coordinate with it for calculation-plus-explanation tasks, but math owns calculation mechanics. |
| `A97 Leg-uit-dat antwoord opbouwen` | Explanation toward a given conclusion. Requires causal chain and explicit return to the given conclusion. |
| `A98 Leg-uit-of antwoord opbouwen` | Explanation where the student first chooses direction, yes/no, or alternative, then justifies it. |
| `A99 Leg uit met voorbeeld beantwoorden` | Example plus explanation and context connection. Current Book 1 target evidence does not make this the first reasoning repair priority. |

Held lanes at baseline:

- graph/draw/shade answer forms remain held for stronger mapping evidence;
- Type 4 motiveer/classificatie remains held;
- `ANS_ANALYSEER_BEOORDEEL` remains held;
- q3/q15 EX answer-skill overlays remain visible as no-write overlay needs;
- no answer-skill candidate storage may be created or written.

## Generator-Readiness Baseline

`reports/json/skilltree-generator-readiness.json` reports `A80`, `A81`, and
`A96`-`A99` as generator-blocked/non-interactive:

- `generator_implemented: false`;
- `generator_blocked: true`;
- `interactive_skilltree_use_allowed: false`;
- `student_facing_skilltree_use_allowed: false`;
- proof required before unblock includes generator implementation, generator
  coverage validation, and explicit later student-facing approval.

This does not block planning. It does block any student-facing exposure or
implementation claim from this sprint.

## Current Structured-Reasoning Gap

Current self-check criteria:

```text
start/oorzaak
economische tussenstap
conclusie in context
```

These criteria are useful local practice. They are not enough to prove:

- `leg-uit-dat`, where the conclusion is given and must be supported;
- `leg-uit-of`, where the student must first choose a direction or yes/no
  outcome;
- source-use answers, where a source observation must be named and then used
  inside an underlying answer form;
- correction-model-specific answer construction;
- held analysis/evaluation or classification answer forms.

This is the central planning gap for REASON-REFINE-1.

## Protected Surface Baseline

No change is authorized to:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-1/reasoning/*.csv`;
- `source-data/book-*/exit-ticket/*.json`;
- generated Book 1 output;
- reasoning engine/source implementation files.

## Data integrity notes

No protected reference data may change during REASON-REFINE-1.
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` are read-only or
forbidden for this sprint. Reasoning source CSVs and generated Book 1 output
are also read-only evidence only.

## Baseline Stop Conditions

Stop REASON-REFINE-1 if the sprint attempts to:

- repair reasoning implementation directly;
- edit reasoning source CSVs;
- regenerate lesson output;
- create a target-equivalent exit ticket;
- treat generic structured self-check as answer-form proof;
- treat `A81` source use as a standalone answer form;
- hide held analysis/evaluation, Type 4 motiveer/classificatie, graph, or EX
  overlay lanes inside broad reasoning;
- create or write `answer-skill-candidates.json`;
- authorize diagnostics, adaptive routing, mastery, sequencing, summative use,
  PV, Scale Gate 1, or product use.

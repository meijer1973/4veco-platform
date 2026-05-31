# Sprint REASON-REFINE-1: Gate Handoff

Generated: 2026-05-31

## Purpose

Summarize what later planning, implementation, and human gates may consume
from REASON-REFINE-1.

This is not a gate closure and not implementation authority.

## Accepted Planning Baseline

If REASON-REFINE-1 closes, downstream work may use these planning conclusions:

- keep the reasoning route and shared `structured_reasoning` task family;
- refactor reasoning around answer-form metadata and constructed-response
  standards rather than rebuilding from scratch;
- keep `A97`, `A98`, and `A99` as distinct explanation scaffolds;
- treat `A81` as source-use modifier plus underlying answer form;
- coordinate `A96` calculation answer form with math/graph routes rather than
  duplicating calculation ownership inside reasoning;
- keep `ANS_ANALYSEER_BEOORDEEL`, Type 4 motiveer/classificatie, graph lanes,
  and EX overlays held unless a later exact gate authorizes them;
- keep current mode 5 as self-check-only local practice until later review.

## Carried Flags

| Flag | Downstream consequence |
|---|---|
| Generic self-check is not answer-form proof. | A later implementation must create A97/A98/A99/A81-specific criteria and feedback. |
| `1.1.1` final compare/explain may be A98 or held evaluation. | A later reviewer must decide before proof use; do not silently force it into generic reasoning. |
| `1.1.2` D31 explanation remains blocked for target-equivalent reliance. | Coordinate with MATH-REFINE-1/MATH-REFINE-2 or equivalent before Q2 proof. |
| `1.1.3` source reasoning remains blocked by source-use scaffolding and graph-axis repair. | Coordinate with GRAPH-REFINE-1/GRAPH-REFINE-2 or equivalent before Q2 proof. |
| Answer-form MTUs are generator-blocked/non-interactive. | They may guide planning but may not leak into skill-tree/product exposure until explicitly unblocked. |

## Handoff To CHECK-Q2-PLAN

`CHECK-Q2-PLAN` may use this sprint to define the reasoning and constructed-
response requirements for a target-equivalent exit ticket.

It must still prove, separately, that the exit ticket:

- is not the advisory short check;
- is at the same cognitive level as the paragraph target exercise;
- covers the complete reviewed target-exercise operation chain;
- uses matching answer forms;
- handles source use only as modifier plus underlying answer form;
- does not use held lanes without explicit review;
- keeps local paragraph-completion copy behind `GATE-L1.7B-Q2`.

## Handoff To GATE-L1.7B-Q2

Before `GATE-L1.7B-Q2` may approve target-equivalent reasoning use, it must
inspect live rendered output and evidence for:

- `A97` `leg-uit-dat` answer construction where the conclusion is given;
- `A98` `leg-uit-of` answer construction where the student chooses direction;
- `A81` source-use combined with an underlying answer form;
- calculation-plus-explanation coordination for `1.1.2`;
- source/table/graph explanation coordination for `1.1.3`;
- explicit handling of any held analysis/evaluation or classification need;
- no target-equivalent claim from the advisory short check;
- no diagnostics, mastery, automatic sequencing, summative use, AI decision,
  PV projection, PV machine promotion, Scale Gate 1, or product-use claim.

No target-equivalent completion language is authorized by REASON-REFINE-1.

## Handoff To Future Reasoning Implementation

A future reasoning implementation plan may be prepared only if the roadmap or
human decision explicitly authorizes it. That plan must include:

- a data-contract decision for answer-form metadata;
- file-level implementation scope;
- validators for `A81` modifier and held-lane boundaries;
- generator-blocked/non-interactive proof for `A80`, `A81`, and `A96`-`A99`;
- live rendered-output screenshot requirements;
- structural lead review before closure;
- no product authority unless a later gate grants it.

## Product Authority Boundary

REASON-REFINE-1 authorizes none of the following:

- implementation;
- generated lesson output;
- reasoning CSV edits;
- protected reference mutation;
- target-exercise `question_type` or `answer_form` writes;
- answer-skill candidate storage or writes;
- target-equivalent completion language;
- diagnostics;
- adaptive routing;
- mastery or sequencing;
- student-facing AI;
- summative use;
- PV projection or PV machine promotion;
- Scale Gate 1;
- student/product use.

## Recommended Next Action

After REASON-REFINE-1, continue to the remaining GATE-ENGINE-1 authorized
planning lane, `CHECK-Q2-PLAN`, unless the roadmap explicitly inserts a
separate reasoning implementation-planning gate first.

# GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1 Architecture Disposition

Date: 2026-06-20
Status: architecture approved for implementation

## Decision

Use a new narrow Golden renderer variant:

```text
golden_graph_advisory_v1
```

This variant is for the single governed migration of `1.1.3-korte-check` from the legacy task shell to Golden Exercise Workbench. It is advisory only and does not become target-equivalent proof.

## Why Existing Variants Are Not Enough

`golden_graph_reading_claim_v1` is the approved `1.1.3-exit-ticket` shape. It requires graph construction, graph reading, and calculation/claim control. The short check must not add a fake calculation or claim task just to fit that variant.

`golden_advisory_short_check_v1` is the approved simple advisory shape used by choice short checks. It deliberately rejects task-shell graph actions, so it cannot express axis selection, point placement, graph reading, or after-graph proof.

## Required Student Operations

The migrated short check must keep actual graph/table work:

1. Choose economic P-Q axes with plausible distractors.
2. Place two different table points in the graph workspace.
3. Let the straight line appear automatically after the second point.
4. Choose the source interval around the target price.
5. Read/interpolate the quantity with tolerant numeric checking.
6. Choose neutral local repair advice.

These are real student actions. The renderer must not ask for a separate slope, line-shape, or line-confirmation answer after the plotted points determine the line.

## Variant Contract

The variant is supported only when all of these are true:

- `layout.framework === "golden_exercise_workbench"`
- `layout.variant === "golden_graph_advisory_v1"`
- `surface === "advisory_short_check"`
- `targetEquivalent.candidate === false`
- `targetEquivalent.gateApproved === false`
- `targetEquivalent.completionLanguageEligible === false`
- `metadataAlignment.targetReadinessEvidence === false`
- `advisory.targetEquivalentProof === false`
- includes `graph_construction_substitute`
- includes `graph_reading`
- includes `table_value_selection`
- includes context blocks and valid context references
- graph construction has no `lineConfirmationLabel`, `lineShapeLabel`, `lineShapeOptions`, or similar fake line-control fields
- graph reading uses interval selection before numeric read-off
- route-choice options include plausible alternatives and accepted advisory
  values for each local next-step option

## Locking Decision

Graph reading may remain locked until graph construction passes because the prompt asks the student to read from the graph they constructed. The route-choice step must not be treated as a correctness gate: it presents neutral local advice, accepts each listed advisory option, and only shows the selected advice/link after the student asks for the oefentip.

No independent task is locked for style or wizard-flow reasons.

## Authority Boundary

This architecture explicitly does not authorize:

```text
completion language
product-route adoption
diagnostics
mastery or sequencing
PV
summative use
Scale Gate 1
broad product use
student/product use
```

The approved `1.1.3-exit-ticket` target-readiness flags are not changed by this sprint.

## Architecture Lead Review

Sub-agent architecture lead review returned:

```text
ARCHITECTURE_APPROVED_FOR_IMPLEMENTATION
```

Must-fix implementation notes from the reviewer:

- Add explicit advisory authority fields and `layout.variant`.
- Reuse graph primitives and load `golden-ticket-graph.js`.
- Remove `lineConfirmationLabel` and `lineShapeLabel`.
- Keep selectors non-correct-only.
- Keep route advice neutral and local.
- Regenerate generated lesson output later through the governed build/proof flow only.

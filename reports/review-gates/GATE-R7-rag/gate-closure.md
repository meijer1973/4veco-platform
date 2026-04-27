# GATE-R7 RAG Gate Closure

Sprint: R7.4

Gate: GATE-R7-rag

Closed: 2026-04-27

Status: `pass_with_conditions`

## Decision

The R7 retrieval layer may be used for continued internal work and limited teacher-facing / lesson-authoring support, with explicit warnings and human review.

The gate does not approve student-facing diagnostics, adaptive routing, automatic lesson sequencing, mastery decisions, summative assessment decisions, or student-facing AI.

## Approved Uses

- internal dashboard
- reference health reports
- internal retrieval development
- retrieval evaluation
- teacher-facing non-authoritative lookup
- lesson-authoring support with warnings and human review

## Blocked Uses

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions
- unreviewed student-facing publication

## Required Conditions

- Retrieval output must preserve and display source authority.
- Retrieval output must preserve and display edge status.
- Generated-report results must be marked diagnostic-only and not primary evidence.
- Pending-review edges must be visibly marked and not displayed as approved knowledge.
- Diagnostic-only edges must be visibly marked as quality-control signals, not curriculum authority.
- Evidence anchors must be surfaced where available.
- Results without evidence anchors must not imply direct evidence.
- Low-score lexical matches must show score or match-strength warnings.
- Target-exercise retrieval must display the current large-chunk limitation.
- Target exercises must be split into per-exercise chunks before production teacher-facing use.
- Lesson-authoring support must remain human-reviewed and non-authoritative.
- Student diagnostics, adaptive routing, and student-facing AI remain blocked.

## Follow-Up Issues

- `RAG-01` Improve retrieval label wording.
- `RAG-02` Add weak-match warning / score threshold.
- `RAG-03` Split target exercises into per-exercise chunks.
- `RAG-04` Evidence-anchor coverage report for retrieval.

## Validation

Required validation:

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-R7-rag/gate-closure.json
```

## Protected Reference Data

No protected reference data changed.

`references/machine/` and `references/external/` remained read-only.

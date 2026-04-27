# GATE-R7 RAG Review Packet

Packet status: `prepared_for_review`

Gate closure status: `not_closed`

Proposed gate status: `pass_with_conditions`

## Scope

This packet prepares R7.4 for review. It does not close the gate and does not approve student-facing use.

The packet reviews:

- deterministic chunk generation
- internal retrieval query behavior
- retrieval evaluation results
- authority handling
- diagnostic-only handling
- generated-report handling
- pending-review handling
- evidence-anchor surfacing
- allowed and blocked downstream uses

## Evidence

- `references/data/rag/chunk_index.jsonl`
- `references/data/rag/retrieval_eval_set.json`
- `references/data/rag/retrieval_eval_results.json`
- `reports/markdown/retrieval-eval-results.md`
- `reports/json/reference-health.json`
- `reports/review-gates/GATE-R5-alignment-graph/gate-closure.json`

## Evaluation Summary

R7.3 retrieval evaluation:

- cases: 10
- passed: 10
- failed: 0
- authority violations: 0

## Sample Queries

- Welke units ondersteunen prijselasticiteit?
- Welke examenvragen testen producentensurplus?
- Welke live units missen term links?
- Welke edges zijn diagnostic_only?
- Welke graph edges zijn pending_review?
- Welke informatie komt alleen uit generated reports?

## Authority Handling

Retrieval output preserves:

- source path
- source type
- authority level
- entity IDs
- evidence IDs
- edge statuses
- diagnostic-only flags
- pending-review flags
- generated-report warnings
- non-primary-evidence warnings

Generated-report chunks may appear, but only with:

- `generated_report_warning: true`
- `not_primary_evidence: true`
- `curriculum_authority: false`

## Diagnostic-Only Handling

Diagnostic-only graph edges remain visible as diagnostic. They are not curriculum authority and must not be used for student diagnostics, routing, mastery, or automatic sequencing.

## Pending-Review Handling

Pending-review graph edges remain visible as pending. Retrieval may expose them for internal review, but it must not flatten them into approved graph knowledge.

## Evidence-Anchor Surfacing

Evidence-anchor chunks can surface support paths and claim/evidence relations. They are useful for review and inspection, but their authority depends on the underlying source layer.

## Known Failures And Limits

- Lexical ranking can include broad low-score unit matches when a query contains generic words such as `units`.
- The target-exercise chunk is currently a large whole-file chunk rather than per-exercise chunks.
- Retrieval is deterministic lexical/entity search, not semantic vector search.
- Generated reports are diagnostics, not primary evidence.
- Unreviewed graph edges remain `pending_review` or `diagnostic_only`.

## Proposed Allowed Downstream Uses

- internal retrieval development
- retrieval evaluation
- reference health reports
- internal dashboard
- teacher-facing/internal research assistance when clearly marked non-authoritative

## Proposed Blocked Downstream Uses

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions

## Review Questions

Ask these interactively, one at a time:

1. May the deterministic chunk and query layer be used for internal retrieval development and evaluation?
2. May teacher-facing/internal research assistance use this retrieval layer if every answer preserves source authority and non-authoritative warnings?
3. Are generated-report chunks allowed as retrieval warnings only, with `not_primary_evidence=true`?
4. Are `diagnostic_only` and `pending_review` graph edges sufficiently visible for internal retrieval use?
5. Does the lexical ranking weakness require a hold, or is it acceptable as a known limitation for internal use?
6. Should target-exercise chunking be split per exercise before teacher-facing use?
7. Which downstream uses remain blocked after R7.4?
8. Should the gate close as `pass_with_conditions`, `hold`, or `fail`?

## Closure Proposal

Recommended closure: `pass_with_conditions`.

Reason: the retrieval layer passes the deterministic evaluation set and preserves authority metadata, but it is still not appropriate for student-facing or automated decision use.

Do not close this gate until the human review answers are recorded and explicitly confirmed.

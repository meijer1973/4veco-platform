# GATE-R7 RAG Human Interview

Gate: `GATE-R7-rag`

Sprint: `R7.4`

Interview date: `2026-04-27`

Decision: `pass_with_conditions`

## Review Context

The reviewer accepted the R5.3-R7.3 preparation block as completed, with R7.4 explicitly not closed until this review decision.

The review decides whether the retrieval layer is safe for:

- internal research assistance
- teacher-facing non-authoritative lookup
- continued RAG development
- lesson-authoring support with warnings and human review

The review does not approve:

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions
- unreviewed student-facing publication

## Packet Completeness Check

Before the interview, the following files were confirmed present:

- `reports/review-gates/GATE-R7-rag/review-packet.md`
- `reports/review-gates/GATE-R7-rag/review-packet.json`
- `reports/review-gates/GATE-R7-rag/subagent-rag-retrieval.json`
- `reports/review-gates/GATE-R7-rag/subagent-authority-ranking.json`
- `reports/review-gates/GATE-R7-rag/subagent-evidence-surfacing.json`
- `reports/review-gates/GATE-R7-rag/subagent-summary.md`

Validator result:

```text
node build-scripts/review-gates/validate-rag-review-packet.js
OK RAG review packet
```

## Interview Answers

### Q1 - Overall Retrieval Clarity

Answer: `B - Mostly, but labels need improvement.`

Decision note: The packet is clear enough for internal research use, but distinctions between approved knowledge, diagnostic information, pending-review information, and generated-report warnings must be visually and structurally stronger before broader teacher-facing use.

Condition: Every retrieval result must expose status and authority labels in a non-optional field.

### Q2 - Authority Labels

Answer: `B - Yes, but improve wording.`

Decision note: Authority labels are present enough for internal use, but wording should be more explicit.

Required labels include:

- `external_primary`
- `machine_registry`
- `authored_judgement`
- `generated_report_diagnostic`
- `pending_review`
- `diagnostic_only`

Avoid vague labels such as `source`, `report`, or `reference`.

### Q3 - Generated Reports

Answer: `B - Mostly, with minor wording fixes.`

Decision note: Generated reports may appear in retrieval only as diagnostics or warnings.

Required behavior:

```json
{
  "source_type": "generated_report",
  "primary_evidence": false,
  "curriculum_authority": false,
  "diagnostic_only": true
}
```

Required user-facing label: `Generated diagnostic report - not primary evidence.`

### Q4 - Pending Edges

Answer: `B - Yes, but warning should be stronger.`

Decision note: `pending_review` edges may appear, but must carry an unambiguous warning.

Required label: `Pending review - do not treat as approved curriculum knowledge.`

Pending edges must not use the same visual style as approved edges.

### Q5 - Diagnostic-Only Edges

Answer: `B - Yes, with stronger warnings.`

Decision note: `diagnostic_only` edges are allowed in retrieval only when clearly marked.

Required label: `Diagnostic-only signal - useful for quality control, not curriculum authority.`

This applies especially to exam-question gap edges, generated-report warnings, coverage gaps, and unresolved-reference diagnostics.

### Q6 - Evidence Anchors

Answer: `B - Partly.`

Decision note: This is acceptable for the gate with conditions.

Required fields:

```json
{
  "evidence_ids": [],
  "evidence_status": "available | missing | not_applicable | pending"
}
```

Condition: A result without evidence anchors must be visibly marked as lacking direct evidence. Retrieval must not imply evidence where none exists.

### Q7 - Lexical Broad Matches

Answer: `B - Yes, but add a minimum-score warning.`

Decision note: Broad low-score lexical matches are acceptable for internal use if clearly marked.

Required behavior:

- low score -> weak match warning
- very low score -> hidden by default or placed under `possible weak matches`

Required fields:

```json
{
  "score": 0.0,
  "match_strength": "strong | medium | weak",
  "weak_match_warning": true
}
```

### Q8 - Target-Exercise Chunking

Answer: `B - Yes, but must be a follow-up before teacher-facing use.`

Decision note: The current large target-exercise chunk is acceptable for internal retrieval development and evaluation. Before production teacher-facing lesson-authoring or planning workflows, target exercises must be split into per-exercise chunks.

Required warning until then: `Target-exercise chunking limitation: result may contain multiple exercises.`

### Q9 - Allowed Downstream Use

Answer: `C - Internal + teacher-facing lookup + lesson-authoring support.`

Allowed only with strict constraints:

- internal dashboard
- reference health reports
- internal retrieval development
- retrieval evaluation
- teacher-facing non-authoritative lookup
- lesson-authoring support with warnings and human review

Not allowed:

- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions
- unreviewed automated content publication

Lesson-authoring support may find units, terms, evidence, related exercises, and warnings. It may not automatically approve lesson content or silently convert retrieval results into final student-facing material.

### Q10 - Gate Status

Answer: `B - Pass with conditions.`

Final gate status: `pass_with_conditions`.

Do not close as plain `pass`.

## Pattern Analysis

The answer pattern is consistent: the reviewer accepts the internal retrieval layer but requires stronger labeling, warning, and evidence-status behavior before broader teacher-facing use.

No answer requires `hold` or `fail` because the reported validation evidence shows that the core authority fields are present and generated-report results remain non-primary. The risks are presentation and traceability issues, not blockers for internal use.

## Targeted Follow-Ups

The reviewer created four non-blocking follow-up issues:

- `RAG-01` improve retrieval label wording
- `RAG-02` add weak-match warning / score threshold
- `RAG-03` split target exercises into per-exercise chunks
- `RAG-04` evidence-anchor coverage report for retrieval

## Closure Proposal

Close R7.4 as `pass_with_conditions`.

Record conditions in:

- `reports/review-gates/GATE-R7-rag/gate-closure.md`
- `reports/review-gates/GATE-R7-rag/gate-closure.json`

Keep student-facing and automated decision uses blocked.

## Explicit Human Confirmation

The lead developer explicitly authorized closing R7.4 as:

```text
pass_with_conditions
```

Plain `pass` is not authorized.

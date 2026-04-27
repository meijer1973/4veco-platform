# GATE-R7 RAG Follow-Up Issues

These issues are required follow-ups from the R7.4 review. They are not blockers for closing R7.4 as `pass_with_conditions`.

## RAG-01 - Improve Retrieval Label Wording

Severity: medium

Reason: authority and status labels exist but need clearer user-facing wording.

Next action: add explicit display labels for approved, pending-review, diagnostic-only, and generated-report diagnostic results.

Proof required: sample retrieval output shows approved, pending, diagnostic, and generated labels clearly.

## RAG-02 - Add Weak-Match Warning / Score Threshold

Severity: medium

Reason: broad lexical matches can surface low-score results.

Next action: add `match_strength` and `weak_match_warning` to retrieval output, with very low scores hidden or grouped as possible weak matches.

Proof required: retrieval output includes `match_strength` and `weak_match_warning`.

## RAG-03 - Split Target Exercises Into Per-Exercise Chunks

Severity: high before production teacher-facing use

Reason: one large chunk reduces traceability and precision.

Next action: create stable per-exercise chunks with exercise IDs, unit links, and evidence metadata.

Proof required: each target exercise has a stable chunk ID, exercise ID, unit links, and evidence metadata.

## RAG-04 - Evidence-Anchor Coverage Report For Retrieval

Severity: medium

Reason: retrieval partially surfaces evidence anchors, but coverage needs visibility.

Next action: generate a report showing which chunk/entity types have `evidence_ids` and which do not.

Proof required: report shows `evidence_id` coverage by chunk type and entity type.

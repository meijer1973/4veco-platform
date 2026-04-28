# CP-1 Overlay Strategy

Generated: 2026-04-28T21:18:06.045Z

## Decision

Use protected-source-safe overlays for first-pass exercise metadata.

## External Exam Questions

- Source: `references/external/exam-questions.json`
- Policy: protected external source
- Proposed overlay: `references/data/exercises/exam-question-overlays.json`
- Reason: exam-question metadata such as role, scaffolding, Bloom level, operations, and evidence status is authored analysis, not mirrored external authority.

## Target Exercises

- Source: `references/authored/course-target-exercises.json`
- Policy: authored reference, but schema-sensitive
- Proposed first pass: `references/data/exercises/target-exercise-overlays.json`
- Reason: avoid bulk source mutation before CP-1 and CP-3 settle names and dry-run shape.

## RAG Chunks

- Source: `references/data/rag/chunk_index.jsonl`
- Policy: generated projection
- Proposed handling: regenerate from approved source and overlay data.

## Precision Lint

Use `build-scripts/lib/verify_svg_geometry.py` or add a wrapper before making `precision_lint_status` required.

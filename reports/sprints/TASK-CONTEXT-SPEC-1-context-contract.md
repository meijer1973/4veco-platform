# TASK-CONTEXT-SPEC-1 Context Contract

Runtime data uses `contextBlocks` at task-set level and `contextRefs` at task level.

Required context block types: `markdown`, `table`, `svg`, `graph`, `flowchart`, `formula`, and `info`.

Every context block requires stable id, type, student-facing label/title, source reference, and type-specific fields. Visual context requires reconstructed SVG and alt text. Markdown may not embed raw images. Every task in a context-backed task set must cite at least one context block.

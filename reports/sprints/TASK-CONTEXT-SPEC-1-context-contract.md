# TASK-CONTEXT-SPEC-1 Context Contract

Generated: 2026-06-03

## Purpose

This contract defines the context layer that later shared task-shell runtime and
source-ingestion sprints must consume.

The contract is not a renderer. It is an authoring/interchange shape for
`contextBlocks` and task `contextRefs`.

## Context Bundle

A context bundle contains:

- `sourceAuthority` for source-backed bundles;
- `contextBlocks`, each with stable `id` and allowed `type`;
- `tasks`, each with non-empty `contextRefs` that point to existing blocks.

Every source/context block must be referenced by at least one task unless it is
explicitly marked `allowUnreferencedForReviewOnly: true`.

## Allowed Block Types

Allowed block types:

- `markdown`
- `source_excerpt`
- `table`
- `svg_figure`
- `graph`
- `flowchart`
- `formula`
- `info_box`

Visual and structured blocks require accessible text. Source, table, figure,
graph, flowchart, and formula blocks require captions with the correct prefix:
`Bron`, `Tabel`, `Figuur`, or `Formule`.

Source-derived structured blocks must also carry machine-checkable provenance:
`sourceRefs` for source excerpts and `sourceMaterialId` for table, SVG/figure,
graph, flowchart, and formula blocks where the block is derived from the
approved exam source.

## Refs

Task `contextRefs` must:

- be non-empty;
- refer to existing block IDs;
- use stable IDs;
- avoid exposing those IDs to students.

## Rejections

The checker rejects:

- missing alt text or accessibility summary;
- missing `contextRefs`;
- references to unknown blocks;
- unreferenced source blocks;
- answer-hint leakage in student-facing context;
- raw copied images where reconstruction is required;
- inconsistent captions;
- internal-code exposure such as MTU, PV, or unit IDs in student-facing text.

## Boundary

This sprint authorizes no runtime rendering, source reconstruction, task
transformation, generated lesson output, protected reference mutation,
source-data mutation, product-route adoption, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.

## Validation

The deterministic checker is
`build-scripts/sprints/check-task-context-spec1.js`.

It validates `reports/json/task-context-spec1-contract.json`, including a
positive fixture that covers all block types and negative fixtures for each
required rejection category.

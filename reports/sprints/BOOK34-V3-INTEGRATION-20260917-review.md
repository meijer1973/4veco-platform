# Books 3/4 v3 integration — independent technical review

Review date: 17 September 2026. Reviewer: `v3_integration_review`.

Scope: the current uncommitted platform implementation and paired lesson import in `books34-v3-20260917`, against platform base `67374a9808d226f1be7e8fa73eb104312c075267` and lesson base `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`. This is a technical implementation review required by AGENTS.md, not independent exercise-quality approval, classroom-readiness approval, publication approval, or merge authority.

## Review status

**PASS for the reviewed technical implementation after correction of the findings below. No unresolved correctness finding remains in this review scope.** The review covers migration outputs, explicit revision dispatch, v2 isolation, bounded import validation, Book 1/2 preservation, source/asset consumption, the existing RAG export/query path, finite authority transitions, and focused regression tests. It does not independently reproduce the package build or the remote compatibility workflow. The source remains uncommitted at review time; the final report must identify the eventual commit heads and any later substantive edits separately.

## Findings and disposition

1. **Mixed v6 metadata revision — fixed and inspected.** `build-scripts/references/migrate-books34-v3.js:87` originally updated the newly added `structure_revision` but left the existing `current_year_1_structure_revision` at v2. The implementation now updates both existing current-revision metadata and the planning projection to v3. The generated v6 metadata was checked after the fix.

2. **Unversioned Book 3/4 records bypassed the normal source consumer — fixed and inspected.** `build-scripts/rag/build-chunks.js:72` originally invoked `consumeTarget` only when a record happened to declare v3, silently accepting absent or unknown revisions through its fallback. Reproduction: deleting all 31 record revisions exported all 55 targets, including `target-exercise:v5:3.1.1`, with no consumed source contract. The implementation now rejects missing, unknown, and mixed Book 3/4 top-level/record/source revisions while retaining the preserved Book 1/2 schema.

3. **Normal retrieval discarded source context and pending-review status — fixed and verified.** `build-scripts/rag/query.js:140` previously returned only a 500-character excerpt and omitted the new full target payload, revision, and record status. Its pending-review flag was false for candidate records. The implementation now exposes the complete contract in JSON, marks candidate review pending, and makes the text output retain context, questions, and figure locators. The first query test exposed that default top-12 `--unit` ranking was not guaranteed paragraph-target lookup. The fix adds explicit `--paragraph <id> --revision <revision>` lookup with a required revision and a unique-result check. Passing tests now execute the existing query CLI for the derivative, labour/population, table, and separate source-page cases after generating the index.

4. **Frozen snapshot comparisons normalized bytes despite raw-hash provenance — fixed and inspected.** `build-scripts/maintenance/check-books34-v3-import.js:21` previously compared all planned files using CRLF-normalized text, including the frozen v2 snapshots. A CRLF-only change to a snapshot could therefore pass despite contradicting the raw SHA256 stored in `snapshot-manifest.json`. The verifier now uses exact Buffer equality for snapshots in both repositories and for adopted outline bytes; normalized comparison remains limited to other active projections. The focused acceptance tests passed with this correction.

5. **Regression fixture used population data absent from the delivered target — fixed.** The first focused test run expected `650.000`, `400.000`, etc. for §4.3.2. The delivered record instead contains Waterstad's `5.000`, `3.000`, `500`, `1.500` and the `Lᵥ`/`Lₐ` model. The corrected assertions now use the actual immutable package content and explicitly select §3.3.4 for the separate source-page case.

## Verification performed

- Read current AGENTS.md, maintenance workflow, package HANDOFF.md and integration/V3_MIGRATION.md.
- Reviewed the v3 migration, selected-structure dispatch, isolated v2 module/checker, import checker, source consumer, RAG exporter/query, finite authority transitions, affected validator changes and focused tests.
- `node build-scripts/maintenance/check-books34-v3-import.js`: PASS, with working-tree byte checks; staged verification not requested in this reviewer run.
- `node scripts/check-course-target-exercises-v5.js`: PASS, 55 records with 12/12/14/17 counts.
- `npm run check:book-outline-currentness`: PASS for preserved Book 2 authority and 12 target pins.
- Initial focused Jest run: 34 passed, 1 failed (incorrect population fixture).
- Focused recheck after early fixes: 37 passed, 1 failed (new query test's top-12 ranking assumption).
- Final focused recheck: **2 suites passed, 38 tests passed** in 12.167 seconds (`books34-v3.test.js` and `books34-selected-structure.test.js`).

The implementation agent reports that the original v2 verifier passes with `--require-paired --require-tracked` in frozen historical paired worktrees. That result was not independently rerun here. Remote CI, exact final heads, supported merge order, and PDF rebuild/comparison findings must remain separately reported by the implementation agent.

The new import acceptance intentionally requires the actual paired v3 lesson tree. The trusted-main compatibility matrix must determine the supported integration order; this technical PASS does not imply either first-merge state is compatible, and no existing check should be weakened to manufacture an order.

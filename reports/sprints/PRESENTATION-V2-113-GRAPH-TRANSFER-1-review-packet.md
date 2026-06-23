# PRESENTATION-V2-113-GRAPH-TRANSFER-1 Review Packet

Date: 2026-06-23
Status: ready for human review

## Verdict

Ready for paired platform and lesson-output PR review.

## Scope

This pass transfers the section 1.1.3 graph/table presentation into a standalone `presentation-v2` semantic model and web-only build path.

- Adds `b1-113-presentation-v2-model.js` as the production source deck.
- Adds `b1-113-presentation-v2.js` as the web-only generator.
- Wires `b1-113-student-web.js` to the same deck so full student-web regeneration does not revert the route.
- Regenerates only the active 1.1.3 presentation HTML in the lesson repo.
- Leaves the existing PPTX file untouched as a secondary legacy download.

## Student Experience

- The active route opens as a seven-slide `presentation-v2` web presentation.
- Sidebar label is `Lespresentatie`.
- Notes are labelled `Studentgerichte uitleg`.
- The deck removes in-presentation PowerPoint download chrome and old English fullscreen strings.
- No student-facing `beheers*` claim appears in the active presentation route.

## Graph Transfer

Required graph/table learning objects render in the deck:

- `slide_ice_table`
- `slide_pq_graph`
- `slide_interpolation_graph`
- `slide_misleading_axis_comparison`

The route covers table-value selection, P-Q axis convention, interpolation, graph-claim checking, and retrieval checks.

## Validation

- `npm.cmd run build:presentation-113`
- `node build-scripts/content/book-1/b1-113-student-web.js`
- Focused Jest: 2 suites passed, 1 skipped, 10 tests passed, 1 skipped
- `npm.cmd run check:golden-presentation-111`
- `npm.cmd run check:golden-graph-advisory-113`
- `node scripts/validate-paragraph.js --mode complete --profile student-web "<1.1.3 folder>"`
- Rendered browser QA: passed, 42 screenshots captured
- Full `npm.cmd run check:platform`: 60 suites passed, 6 skipped, 898 tests passed
- `git diff --check` in platform and lesson repos
- focused active-route scan for internal labels, teacher-only headings, English fullscreen copy, PowerPoint-download chrome, and unauthorized `beheers*` wording

Screenshot output remains local at `C:\wt\PARA-LANDING-20260610\reports\presentation-v2-113-graph-transfer-1\presentation-v2-qa`.

## Notes

PowerPoint generation is intentionally not part of this pass. The existing `1.1.3 Grafieken en tabellen - presentatie.pptx` remains available through the paragraph landing page until a separate semantic-model-derived PPTX path is reviewed.

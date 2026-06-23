# PRESENTATION-V2-113-GRAPH-TRANSFER-1 Review Packet

Date: 2026-06-23
Status: READY_FOR_HUMAN_REVIEW

## Verdict

Ready for paired platform and lesson-output PR human review. This is student-facing/product content and must not route lead-only.

## Scope

This pass transfers the section 1.1.3 graph/table presentation into a standalone `presentation-v2` semantic model and web-only build path.

- Adds `b1-113-presentation-v2-model.js` as the production source deck.
- Adds `b1-113-presentation-v2.js` as the web-only generator.
- Wires `b1-113-student-web.js` to the same deck so full student-web regeneration does not revert the route.
- Regenerates the active 1.1.3 presentation HTML and corrected rich-page graph helper output in the lesson repo.
- Leaves the existing PPTX file untouched as a secondary legacy download.

## Student Experience

- The active route opens as an eight-slide `presentation-v2` web presentation.
- Sidebar label is `Lespresentatie`.
- Notes are labelled `Studentgerichte uitleg`.
- The deck removes in-presentation PowerPoint download chrome and old English fullscreen strings.
- No student-facing `beheers*` claim or teacher cue appears in the active presentation route.

## Graph Transfer

Required graph/table learning objects render in the deck:

- `slide_ice_table`
- `slide_pq_graph`
- `slide_interpolation_graph`
- `slide_misleading_axis_comparison`

The route covers success criteria, table-value selection, P-Q axis convention, interpolation, graph-claim checking, retrieval checks, and a summary bridge.

## Validation

- `npm.cmd run build:presentation-113`
- `node build-scripts/content/book-1/b1-113-student-web.js`
- `npx.cmd jest engines/tests/presentation-v2-113-graph-transfer.test.js --runInBand`: 9 tests passed
- `node scripts/validate-paragraph.js --mode complete --profile student-web "<1.1.3 folder>"`
- Committed human-review screenshot packet: 11 required PNG files plus `manifest.json` and `human-review-index.md`
- Full `npm.cmd test -- --runInBand`: 69 suites passed, 6 skipped, 983 tests passed
- `git diff --check` in platform and lesson repos
- focused active-route scan for internal labels, teacher-only headings, English fullscreen copy, PowerPoint-download chrome, and unauthorized `beheers*` wording

Screenshot output is committed at `reports/sprints/PRESENTATION-V2-113-GRAPH-TRANSFER-1-human-review/`.

## Notes

PowerPoint generation is intentionally not part of this pass. The existing `1.1.3 Grafieken en tabellen - presentatie.pptx` remains available through the paragraph landing page until a separate semantic-model-derived PPTX path is reviewed.

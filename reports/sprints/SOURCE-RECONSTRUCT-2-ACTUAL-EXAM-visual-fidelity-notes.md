# SOURCE-RECONSTRUCT-2-ACTUAL-EXAM Visual Fidelity Notes

## Reconstruction Surface

The selected source material is a table. No figure, graph, or flowchart is
present in the selected source, so this sprint reconstructs a semantic table
plus a small formula operation note for correction-model comparison.

## Fidelity Matrix

| Requirement | Evidence | Verdict |
|---|---|---|
| Table values preserved | 385, 885, 108,25, 86,25 all appear in `reports/json/source-reconstruct2-actual-exam.json`. | pass |
| Units preserved | Deductible header says per year; premium header says per month. | pass |
| Row order preserved | Wettelijk eigen risico row precedes verhoogd eigen risico row. | pass |
| Source label and caption present | `Tabel 1` and `Tabel 1: Zoohee! zorgverzekering`. | pass |
| Accessibility text present | Table and formula blocks include alt text; markdown/source blocks include accessibility summaries. | pass |
| No copied-image shortcut | `rawCopiedImage: false`; rendered lab uses a semantic HTML table and no image elements. | pass |
| Answer amount not visible in rendered lab | The answer threshold and worked answer amounts are reserved for reviewer comparison files and checker evidence. | pass |
| Mobile proof present | `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md` lists desktop light, mobile light 390px, and mobile dark 390px screenshots; proof JSON confirms both mobile captures requested and rendered at 390px. | pass |
| Dark-mode proof present | `reports/json/source-reconstruct2-actual-exam-proof.json` confirms the mobile dark capture, table values, no raw images, no answer amount, and no non-table overflow. | pass |

## Rendered Review Requirements

The rendered lab must show context before comparison evidence, use student-
facing labels instead of internal IDs, preserve captions and source refs for
reviewers, allow table scrolling on a 390px viewport, and render in light and
dark themes without overlap.

## Omitted Visual Classes

No reconstructed SVG graph, SVG figure, or flowchart is produced because the
selected source does not contain those visual classes. Future sprints may
produce them only when the source material actually requires them.

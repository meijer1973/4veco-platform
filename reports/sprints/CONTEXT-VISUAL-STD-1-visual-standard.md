# Sprint CONTEXT-VISUAL-STD-1: Source Context Visual Standard

## Status

This is the standard/checker output for `CONTEXT-VISUAL-STD-1`. It defines how source context blocks must look, read, cite their source, and prove visual quality before later source-reconstruction or task-transformation sprints can close.

This standard does not reconstruct actual exam or textbook sources, does not authorize generated lesson output, and does not change product-route or target-equivalent proof status.

## Quality Floor

A source-dependent task is not complete when the source is merely present. The rendered context must help the student inspect the same information that the source requires, without copied-image shortcuts, hidden labels, unreadable mobile layouts, dark-mode contrast loss, or internal implementation codes.

Future source reconstruction must prove:

- the source/context appears before task controls;
- every source block has a stable student-facing label and caption where applicable;
- visual information is semantic or reconstructed, not a raw pasted screenshot;
- tables, graphs, flowcharts, formulas, and source excerpts remain legible on desktop, mobile, light mode, and dark mode;
- alt text and accessibility summaries preserve the information needed for the task;
- reviewer evidence compares the reconstructed output with the official or owned source.

## Visual Principles

1. Source first: source context blocks appear before task-family controls and task references point back to student-facing labels.
2. Source-faithful, not decorative: visuals carry task-relevant information and preserve the values, relationships, labels, units, and directionality of the source.
3. Semantic before raster: tables are real tables; formulas are text/code; flowcharts, figures, and graphs are reconstructed SVG or structured renderings. Raw copied screenshots are not acceptable unless a later human waiver explicitly records consequences.
4. One visual language: the context region uses the shared task-shell palette and spacing so source cards, semantic tables, formula boxes, reconstructed SVG graphs, figures, and flowcharts feel like one surface.
5. Legibility beats mimicry: the reconstruction may adapt spacing, label placement, color, and contrast for web/mobile/dark mode, but may not alter source meaning.
6. Evidence is rendered: future review must inspect actual rendered output, not only source JSON or prose claims.

## Color Tokens And Token Roles

The standard uses semantic color tokens and token roles that map to existing task-shell variables or future equivalents. Implementations may alias these roles to CSS custom properties, but the role must remain stable.

Typography and spacing must stay restrained: source context headings are compact, body text uses the shared task-shell readable size, formulas use monospace only for expressions, and repeated blocks keep consistent padding and gaps.

| Role | Purpose | Current runtime baseline |
|---|---|---|
| `surface` | Page or task-shell background behind the context region. | `--ts-bg` |
| `panel` | Source card or visual panel background. | `--ts-panel` |
| `soft_panel` | Subtle table header, formula, or visual backing surface. | `--ts-soft` |
| `text_primary` | Main readable text, labels, values, and headings. | `--ts-text` |
| `text_muted` | Secondary descriptions, accessibility summaries, units, and notes. | `--ts-muted` |
| `border` | Separates context blocks, table cells, axes, and source panels. | `--ts-line` |
| `source_accent` | Source labels, task reference links, selected graph series, and important labels. | `--ts-primary` |
| `comparison_accent` | Second graph series, warnings about units, and contrast pairs. | `--ts-accent` |
| `focus_ring` | Keyboard focus and target highlight. | `--ts-focus` |
| `formula_surface` | Monospace formula box background. | `--ts-panel` on `--ts-soft` |

Color may never be the only carrier of meaning. Graphs, legends, and flowcharts must use labels, shapes, line styles, or direct annotation alongside color.

## Source Labels And Captions

Source-label rules:

| Context type | Label family | Caption rule |
|---|---|---|
| `source_excerpt` | `Bron N` | Caption starts with `Bron N:` and names the source in student language. |
| `table` | `Tabel N` | Caption starts with `Tabel N:` and names the table content. |
| `svg_figure` | `Figuur N` | Caption starts with `Figuur N:` unless the figure is explicitly a schema. |
| `graph` | `Figuur N` | Caption starts with `Figuur N:` and names the relationship shown. |
| `flowchart` | `Schema N` or `Figuur N` | Use `Schema N:` when the block is a process or reasoning route; otherwise `Figuur N:`. |
| `formula` | `Formule N` | Caption starts with `Formule N:` and names the operation. |
| `markdown` | Context title | No numbered source label unless the block is a source. |
| `info_box` | Info title | No numbered source label unless the block cites source material. |

Task references must use the student-facing label (`Bron 1`, `Tabel 1`, `Figuur 2`, `Schema 1`, `Formule 1`) and must not expose raw `ctx-*`, MTU, PV, exam-candidate, or internal operation IDs.

Captions must include the label, the object, and the source-relevant idea. Captions may not give away an answer or correction-model threshold unless that value is visibly part of the source and needed before answering.

## Block Type Rules

| Block type | Visual rule | Accessibility rule | Future proof rule |
|---|---|---|---|
| `markdown` | Plain context text in the context region with short paragraphs and no pseudo-source framing. | Requires `accessibilitySummary` when the text explains task context. | Screenshot proof only when it appears with other source blocks. |
| `source_excerpt` | Source card with label, caption, excerpt text, source references, and no answer-model language. | Requires `accessibilitySummary`; preserve quoted/source wording boundaries. | Reviewer compares excerpt against source map. |
| `table` | Semantic table with real header cells, units in headers or values, no image-table shortcut, horizontal overflow on narrow mobile. | Requires `altText`; table caption exists in markup; headers have `scope="col"` or equivalent. | Screenshot plus source-output parity check for values, units, headers, and row order. |
| `svg_figure` | Reconstructed SVG figure with stable `viewBox`, visible labels, no raw copied image, and no text baked into an inaccessible raster. | Requires `altText`; SVG or wrapper has image role/name; source map records reconstruction status. | Source comparison, SVG safety check, desktop/mobile/dark screenshots. |
| `graph` | Structured graph rendering with named axes, units, readable ticks, direct labels or legend, and source-faithful data. | Requires `altText` naming trend/relationship and key values needed for the task. | Axis/legend review, value parity, mobile/dark screenshots, source map. |
| `flowchart` | Reconstructed flowchart or schema with clear reading order, arrow direction, compact labels, and no purely decorative shapes. | Requires `altText` describing the sequence or relationship chain. | Reviewer checks order, edge labels, mobile stacking, and dark-mode arrow/label contrast. |
| `formula` | Formula box in monospace for the expression plus variable list in normal text; operators and units readable. | Requires `altText`; variable meanings are text, not only symbols. | Formula expression and variable meanings compare to source/answer-model operation. |
| `info_box` | Compact note for unit, warning, or source-use instruction; visually secondary to source blocks. | Requires `accessibilitySummary` when it changes how to read the source. | Review checks it does not become a hint or answer leak in exit-ticket surfaces. |

## Tables

Semantic tables must:

- use actual table markup or an equivalent semantic table model;
- preserve source values, row order, column labels, units, and footnotes;
- place units in headers when repeated across rows;
- allow horizontal scrolling on mobile instead of compressing words into unreadable columns;
- use header/background contrast that works in dark mode;
- include alt text summarizing the task-relevant values and comparison.

## Graphs, Axes, And Legends

Graphs must:

- label both axes and include units where the source uses units;
- use even tick spacing unless the source explicitly uses irregular intervals;
- keep zero visible when zero is meaningful for interpretation;
- directly label series when space allows; otherwise use a legend adjacent to the graph;
- use at least two encodings for distinctions, such as color plus label, dash, marker, or direct annotation;
- avoid cropped axes or implied slopes that change economic meaning;
- preserve source data values and transformations in a source map.

## SVG Figures, SVG Sizing, And Flowcharts

Reconstructed SVG figures and flowcharts must:

- include a stable `viewBox`;
- scale to the available width without overflow;
- keep readable labels at mobile width through wrapping, stacking, or simplified layout;
- avoid light-mode-only backgrounds inside dark-mode surfaces;
- avoid embedded raster images unless a later human waiver allows a temporary source screenshot;
- include no script/event-handler/foreign-object content;
- keep arrows, axes, labels, and fills distinguishable in dark mode.

## Formula Boxes

Formula boxes must:

- render the expression as text in monospace;
- list variables and units in normal text below or beside the expression;
- preserve the operation order needed by the task;
- avoid answer substitution unless the source itself is a worked example;
- include alt text that can be read without the visual box.

## Mobile And Dark Mode

Future rendered proof must include at least:

- desktop light screenshot;
- mobile light screenshot at a narrow viewport such as 390 px;
- mobile dark screenshot at the same narrow viewport;
- completed or feedback state when the task interaction depends on source references.

Mobile behavior must stack source cards to one column, preserve table scroll, preserve graph/figure aspect ratio, and avoid overlapping labels. Dark mode must not hide axes, legends, labels, table borders, arrows, formula operators, or source references.

## Accessibility

Every source context block must have a name available to assistive technology. Visual blocks require `altText`; text-only source blocks require `accessibilitySummary` when the block carries task context. The alt text should summarize the task-relevant structure, not merely say "graph" or "table".

Keyboard focus must be visible on task reference links and on any interactive source-control added later. Source context may not rely on hover-only information.

## Source-Output Parity

Future source reconstruction must produce reviewer evidence that includes:

- source map from prompt/annex/table/figure/formula to every context block;
- visual-fidelity notes for values, labels, units, axes, legends, and transformations;
- a declaration that raw copied images are not used, or a human waiver if one is used temporarily;
- rendered screenshots for desktop, mobile, and dark mode;
- checker output proving required block metadata, captions, labels, alt text, and source references exist.

For official exam material, the proof must tie back to the authorized prompt and correction-model PDFs. This standard does not itself authorize mutation of `references/external/`.

## Current Runtime Crosswalk

`TASK-CONTEXT-RUNTIME-1` already proves placement and baseline rendering for all eight block types. Current selectors that approximate this standard include:

| Standard area | Runtime baseline selector or artifact | Status |
|---|---|---|
| Context region before tasks | `.ts-context` before `.ts-task-list` | Present |
| Source blocks | `.ts-context-block` | Present |
| Semantic tables | `.ts-context-table` and `.ts-context-table-wrap` | Present baseline, future source parity still needed |
| SVG figures | `.ts-context-svg` and `.ts-context-svg-art` | Present baseline, richer source-fidelity rules here |
| Graph summaries | `.ts-context-graph` | Present baseline, future implementation may need true SVG graph renderer |
| Formula boxes | `.ts-context-formula` | Present |
| Flowcharts | `.ts-context-flow` | Present baseline |
| Student-facing references | `.ts-context-refs a` | Present |
| Mobile stacking | `@media (max-width: 640px)` context rules | Present baseline |
| Dark mode tokens | `[data-theme="dark"]` task-shell variables | Present baseline |

Runtime gaps are implementation follow-up, not closure blockers for this standard. In particular, future graph work may need a richer SVG graph renderer before source-output parity can close for real exam graphs.

## Dual-Coding Absorption Decision

This standard absorbs the main visual-source policy previously implied by `DUAL-CODING-STD-1` for source-dependent shared task context: source cards, semantic tables, reconstructed SVG figures/graphs/flowcharts, formula boxes, labels, captions, alt text, mobile, dark mode, and proof expectations are now governed here.

Residual dual-coding work should not remain as a generic decoration sprint. If later task-design work needs a policy for deciding when a task should be plain text, table, graph, flowchart, diagram, formula box, or visual construction, that follow-up must be scoped as task-selection policy and tied to target-exercise operations.

## Closure Checklist For Future Source Reconstruction

A later source-reconstruction sprint using this standard must not close unless it can show:

- reconstructed context blocks for every source item needed by the task;
- source-output parity notes tied to the source map;
- no raw copied screenshot dependency unless waived;
- captions and labels using the rules above;
- alt text and accessibility summaries for all source blocks;
- desktop, mobile, and dark-mode screenshots;
- checker output for block metadata and visual-standard coverage;
- lead review that inspects rendered output and source parity.

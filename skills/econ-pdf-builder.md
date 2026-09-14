---
name: econ-pdf-builder
description: "Adapt economics PDF layout or diagnose a rendering problem when the shared paragraph renderer needs adjustment. For ordinary Part A export use the checklist and thin shared-renderer wrapper; for an unchanged existing edition use the reproduction route. Load content-authoring skills only when the assignment changes content."
pipeline: "Part A producer"
---

# Economics PDF Builder

Use this skill for layout adaptation and rendering faults. The
[textbook skill](econ-textbook-paragraph.md) owns writing and output formats;
the [exercise contract](econ-exercise-builder.md#71-exercisesmd-structure) owns
the printed sequence and paper support. Keep teaching decisions in those sources.

## Default paragraph implementation

For new ordinary paragraph builds, copy the
[thin wrapper](../build-scripts/templates/template-build-paragraph-pdf.py) to
`build_pdf.py` and run it with the adjacent platform checkout, or set
`PLATFORM_ROOT` to that checkout. The
[shared renderer](../build-scripts/textbook/paragraph_pdf.py) owns Pandoc
structural conversion, local image resolution, UTF-8, native list numbering,
styling and pagination. Install Pandoc and the
[declared Python dependencies](../build-scripts/textbook/requirements.txt) when
absent. Follow the [Part A checklist](../docs/workflows/part-a-start.md) for
ordinary export; no copied image, regex, CSS or full-script recipe is needed.

For a layout exception, repair and test the owning implementation, or document
why a specialized builder is necessary. After shared-renderer changes, run
`python -m unittest discover -s build-scripts/textbook -p "test_*.py"` and inspect
affected output. A bounded repair to an existing edition can use its existing
builder without expanding into a renderer migration. For unchanged output, use
[existing-edition reproduction](../docs/workflows/part-a-review.md#reproducing-an-existing-edition)
and its recorded toolchain when a historical rebuild is needed.

## Troubleshoot the affected output

- **Missing images:** verify the final HTML image paths, local assets and the
  renderer's base directory. Repair the path or asset; do not conceal a missing
  file or require base64 embedding and SVG replacement for every build.
- **Broken formulas:** the shared renderer stops on Pandoc conversion warnings,
  including unsupported TeX. Use supported Unicode/plain-text notation such as
  `GTK = TK / q`, or an explicitly tested math renderer for fraction typesetting.
  Preserve mathematical meaning and inspect the final formula.
- **Wrong letters or numbering:** inspect the Markdown list structure and
  generated HTML start/style attributes. Use the shared structural conversion
  and its fixtures instead of adding regex transformations.
- **Clipped tables, orphaned headings or insufficient writing space:** inspect
  source grouping and the owning print styles. Check changed pages and their
  pagination neighbours after repair. Preserve all exercise text, table rows,
  labels and answer space; do not shorten teaching content to hide a layout fault.

## Output checks

Inspect final PDFs at normal reading scale: every page for new material, changed
pages and affected dependencies for a revision. Reuse valid unchanged evidence
under [Part A review](../docs/workflows/part-a-review.md). Check images, formulas,
list letters, table boundaries, headings, exercise grouping, graph labels,
contrast and non-colour cues against the
[rendered-page standard](../references/authored/textbook-rendered-page-acceptance-standard.md).

When browser-delivered HTML is part of the assignment, inspect its affected pages
in the intended browser. Static rendering and source checks are not browser
compatibility evidence. An HTML intermediate for PDF-only delivery does not
require a browser compatibility matrix.

Keep teacher metadata out of student output: difficulty ratings, per-exercise
time estimates, internal blueprint codes (unless used as paragraph numbering)
and scaffold-level annotations. Students see the prescribed teaching headings,
not internal planning labels. Record actual inspection scope and remaining
defects; rendering alone does not grant independent review or publication.

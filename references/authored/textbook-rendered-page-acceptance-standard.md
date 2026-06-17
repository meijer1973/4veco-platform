# Textbook Rendered-Page Acceptance Standard

Status: active standard from `TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1`.

## Core Principle

Markdown remains the content source of truth. Target records, paragraph plans,
source markdown, answer markdown, and governed registries remain the authority
for what the material says and why it belongs in the course.

Rendered PDF and HTML pages are the acceptance proof for student-facing
readability, layout, visual legibility, and print/product quality.

A source validator can prove that files, references, and structures exist. It
cannot prove that a normal student can read the final page at normal scale.
For student-facing textbook closure, the final rendered page is the product
surface reviewers must inspect.

## Scope

This standard applies to textbook sprints that change student-facing printed or
web textbook output, including:

- paragraph markdown, exercises, answers, or source assets;
- chapter assembly, book assembly, print profiles, or page rhythm;
- figures, tables, graphs, captions, answer models, and mixed-opgaven source
  blocks;
- any sprint that claims rendered-output, print-readiness, visual acceptance,
  or publication quality.

For policy-only, registry-only, planning-only, or validator-only sprints with
no student-facing output change, rendered proof may be not applicable. The
sprint plan and result must say why rendered proof is not required.

## Required Rendered Proof

Any sprint that changes student-facing textbook output must provide:

- final PDF and/or HTML generated from the repository workflow;
- full-page PNG render of every changed page, or a contact sheet plus named
  pages inspected;
- rendered proof path in the closure record;
- reviewer statement that full-page rendered proof was inspected at normal
  reading scale;
- defect disposition for clipping, overlap, unreadable labels, table overflow,
  missing images, blank pages, broken glyphs, stale generated output, and
  answer-model readability;
- known warnings, each classified as blocker or non-blocking with proof.

Cropped figures, source SVG inspection, validators, and asset inventories are
supporting evidence only. They do not replace full-page rendered proof.

## Rendered-Page Acceptance Checklist

Use this checklist for every changed rendered textbook page:

- Page opens and renders.
- No clipped text.
- No overlapping text, labels, captions, or table cells.
- No black boxes, missing glyphs, or encoding defects visible to students.
- No broken or missing images.
- Tables do not bleed into neighboring columns or page margins.
- Figure text is readable at normal page scale.
- Captions, labels, and legends are not too dense for the final page size.
- Page breaks do not isolate headings from their content.
- Answer-model text remains readable and not over-compressed.
- Any warning is classified as blocker or non-blocking with proof.

## Pass And Fail Rule

If a defect is visible to a normal student on the final rendered page, it
blocks closure.

PASS WITH FLAGS may carry only non-core future work, such as later print-size
optimization, optional figure simplification, or future chapter-wide polish.

PASS WITH FLAGS may not carry:

- missing rendered proof;
- unreadable figure labels on the final page;
- clipped or overlapping text;
- table overflow;
- missing figures or broken glyphs;
- stale generated output after a source change;
- missing answer model for changed exercises;
- placeholder-backed reviewed-final target evidence.

A student-facing defect is a blocker, not a flag.

## Figure Acceptance Principle

Figure source checks are preflight checks. Final figure acceptance is based on
full-page rendered proof.

`references/authored/textbook-figure-standard.md` defines the detailed figure
and graph source-asset standard for future textbook sprints.

Source-level hygiene should still be maintained:

- figures should keep editable source where possible, normally SVG;
- PNG exports should be generated from the same source;
- SVG and PNG asset pairs should be regenerated together;
- filenames should follow the paragraph convention;
- labels should be short, direct, and wrapped where needed;
- direct labels are preferred over legends when they reduce split attention.

Recommended source guard: avoid figure text below 30 pt in SVG when the figure
is expected to occupy normal textbook-page width. Smaller text requires
explicit rendered-page proof. This is a guard, not the final acceptance rule,
because SVG scaling depends on canvas size and final placement.

A figure passes only when all relevant labels, symbols, values, and captions
are readable on the final rendered page at normal reading scale.

## Proof Artifact Convention

Rendered proof should live under:

```text
reports/rendered-proof/<sprint-id>/<artifact-id>/
```

Recommended files:

```text
manifest.json
contact-sheet.png
pages/page-001.png
pages/page-002.png
```

Recommended manifest fields:

```json
{
  "sprint_id": "<SPRINT-ID>",
  "artifact_id": "<paragraph-or-chapter-artifact>",
  "source_pdf": "../4veco-lessen/path/to/artifact.pdf",
  "source_html": "../4veco-lessen/path/to/artifact.html",
  "rendered_pages": ["pages/page-001.png"],
  "contact_sheet": "contact-sheet.png",
  "pages_inspected": "all",
  "visible_student_defects": 0,
  "warnings": [],
  "inspected_at_normal_reading_scale": true
}
```

Validators may check that expected proof files and manifest fields exist. They
must not claim to judge subjective readability, visual clarity, or pedagogical
quality without human or lead-review inspection.

## Closure Record Requirements

Every textbook closure record must include:

- product end-state citation;
- original sprint or gate specification;
- non-negotiable requirements;
- core-requirement checklist;
- rendered-output proof when student-facing output changes;
- target-trace evidence where target records are involved;
- student-facing quality evidence;
- validator and test evidence;
- classified findings;
- carried issues with `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- boundary statement naming what the sprint closes and what it does not
  authorize.

When student-facing output does not change, the closure record must explicitly
state that rendered proof is not applicable and explain why.

## Quality-Ref Convention

Future quality-ref files may record rendered proof with fields like:

```yaml
rendered_page_proof:
  required: true
  pdf_rendered_to_png: true
  contact_sheet: "reports/rendered-proof/<sprint-id>/<artifact-id>/contact-sheet.png"
  pages_inspected: "all"
  visible_student_defects: 0
  figure_legibility_passed: true
  table_overflow_passed: true
```

Do not mark older paragraphs defective merely because they predate this field.
Apply the standard to new textbook sprints and to older paragraphs when they
are touched or when a chapter/book print QA sprint explicitly backfills proof.

## Mixed-Opgaven Interaction

All `gemengde_opgaven` sections are rendered-output-risk sections unless the
sprint changes only metadata. Mixed sections often contain longer contexts,
dense tables, multi-source prompts, and longer answer models.

Mixed-opgaven closure should combine:

- target acceptance proof from `references/authored/gemengde-opgaven-target-standard.md`;
- rendered-page proof from this standard.

The rendered proof must pay special attention to long context blocks, dense
tables, multi-source headings, graph/table interpretation prompts, and answer
model length.

## Boundary Statement

This standard closes only the proof rule for textbook readability and layout
acceptance. It does not authorize diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, product-route adoption, or student/product-use work.

Those remain separate product gates.

## Follow-Up Standards

The rendered-page acceptance policy intentionally leaves detailed automation
to separate work:

- `RENDERED-PROOF-WORKFLOW-1`: standardized PDF-to-PNG/contact-sheet workflow
  and proof manifests.
- `TEXTBOOK-QUALITY-REF-SCHEMA-RENDERED-PROOF-1`: quality-ref schema or
  convention for rendered-page proof fields.

`TEXTBOOK-FIGURE-STANDARD-1` closed the figure-specific source-asset and
rendered figure standard in `references/authored/textbook-figure-standard.md`.
The remaining follow-ups are not prerequisites for this standard to govern
future textbook sprint closure.

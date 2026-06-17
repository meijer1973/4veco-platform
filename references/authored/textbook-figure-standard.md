# Textbook Figure Standard

Status: active standard from `TEXTBOOK-FIGURE-STANDARD-1`.

## Purpose

This standard defines the source-asset and rendered-figure quality floor for
student-facing textbook figures.

It supports `references/authored/textbook-rendered-page-acceptance-standard.md`.
It does not replace it. Source checks can catch figure risks early, but final
acceptance still depends on full-page rendered proof from the final PDF or HTML
page.

## Scope

This standard applies to textbook figures, including:

- economic graphs and diagrams;
- chart images, flow diagrams, shaded surplus diagrams, and break-even or cost
  curve figures;
- figure labels, captions, legends, axis titles, units, source notes, arrows,
  callouts, and answer-model solution figures;
- SVG/PNG asset pairs used by paragraph, chapter, or book output.

Tables are governed first by the rendered-page acceptance standard. When a
table is converted into an image or mixed with a graph, the figure rules here
also apply.

Policy-only, registry-only, and metadata-only sprints may mark figure proof as
not applicable when they do not change student-facing figures or rendered
figure placement.

## Core Principle

A textbook figure must help the student do one concrete thing: read a value,
see a relation, follow a change, compare alternatives, or connect a visual
model to the text.

Decorative figures, redundant figures, and figures whose meaning is carried
mainly by a separate paragraph add load. A figure earns its place only when a
normal student can see what to attend to, read the labels, and connect it to
the surrounding explanation or question without hunting.

## Source Asset Requirements

Every authored textbook figure should have an editable source where possible,
normally SVG.

Required source hygiene:

- use stable paragraph-scoped filenames;
- keep the source SVG and exported PNG together when both exist;
- regenerate SVG/PNG pairs together after edits;
- do not hand-patch only the PNG when the SVG is the source;
- remove stale exports when a figure is replaced;
- keep all figure references resolvable from paragraph, chapter, and answer
  materials;
- record figure intent in the paragraph plan or sprint evidence when a sprint
  adds or materially changes figures.

When a figure is generated from code, the code or generation record is the
editable source. The exported image must not become the only maintainable
record unless a sprint explicitly accepts that limitation.

## Economic Graph Conventions

Economic figures must use consistent conventions unless a sprint records a
specific reason to differ.

Required graph conventions:

- axes are named with economic quantity and unit where relevant;
- curves or lines are directly labeled when that avoids a legend lookup;
- initial and changed states are clearly distinguished;
- equilibrium points, intersections, shaded areas, and movement or shift arrows
  are labeled where they are part of the learning goal;
- numbers in the figure match the surrounding text, table, exercise, and answer
  model;
- staged figures keep the same axes, scale, and layout across stages unless the
  change is explicitly the point of the figure;
- color is never the only carrier of meaning. Use labels, line style, pattern,
  or position as a second channel.

For supply-demand and cost/revenue figures, prefer direct labels over separate
legends when the page has room. Legends are acceptable only when they stay close
to the plotted marks and do not force split attention.

## Readability And Density

Figure text must be readable on the final rendered page at normal reading
scale.

Source-level guards:

- avoid SVG text below 30 pt when the figure is expected to occupy normal
  textbook-page width;
- avoid more than four visual messages in one figure;
- split dense multi-step reasoning into staged figures instead of compressing
  labels;
- keep labels short and placed next to the thing they name;
- avoid diagonal or rotated labels unless no readable alternative exists;
- keep callouts outside crowded data regions when possible.

The 30 pt source-text rule is a guard, not final acceptance. A figure with
larger source text can still fail if the final rendered page scales it down too
far. A figure with smaller source text can pass only when explicit full-page
rendered proof shows the text is readable.

## Figure To Text Integration

The surrounding text must tell students why the figure matters.

Required integration:

- introduce a figure before or at the point where students need it;
- avoid placing a graph on one page and its essential explanation on a distant
  page;
- use captions to state the figure's function, not to repeat every label;
- ensure answer models reference solution figures when a figure is part of the
  answer;
- keep graph/table interpretation prompts near the source material they use;
- do not make students infer from a figure what the question should have asked.

## Multi-Stage Figures

When a concept is best shown in stages, use separate stage figures or clearly
separated panels.

Multi-stage requirements:

- preserve identical axes, units, scale, and base geometry across stages;
- add one conceptual change per stage where possible;
- label the new element in each stage;
- avoid visual jumps that make students compare two unrelated drawings;
- keep stage order aligned with the explanation and answer model.

## Proof Requirements

Figure proof has two layers.

Source preflight proof may include:

- SVG/PNG pair inventory;
- source text-size check;
- figure-reference validation;
- graph/table concordance notes;
- source screenshot or cropped figure proof.

Rendered acceptance proof must include:

- final PDF or HTML path;
- full-page page PNGs or contact sheet for pages containing changed figures;
- pages inspected;
- defect disposition for figure text, labels, axes, legends, clipping,
  overlap, contrast, missing exports, stale exports, and text/number
  concordance;
- reviewer statement that the final rendered page was inspected at normal
  reading scale.

Source preflight proof is useful but not sufficient for student-facing figure
closure. Cropped figure proof can support a finding, but it cannot replace
full-page rendered proof.

## Blocking Defects

These are blockers for any sprint that changes student-facing figures:

- unreadable labels, numbers, axis titles, legends, or captions on the final
  rendered page;
- clipped or overlapping labels, arrows, curves, captions, or callouts;
- graph numbers, axis units, or curve labels that contradict the text, table,
  question, or answer model;
- a referenced figure is missing from the final output;
- stale PNG export after an SVG/source change;
- a color-only distinction that is required to answer the question;
- staged figures with mismatched scales where comparison is required;
- answer model refers to a missing, stale, or unreadable solution figure;
- figure proof is missing when the sprint changed student-facing figures.

PASS WITH FLAGS may carry only non-core improvements, such as future style
harmonization, optional figure simplification, or backfilling this standard to
older untouched figures. It may not carry a visible figure defect, missing
figure proof, or graph/text contradiction as future work.

## Mixed-Opgaven Interaction

Mixed sections often contain longer contexts and source-heavy graphs. For
`gemengde_opgaven`, a graph is usually source material, not decoration.

Mixed-section figure review must check:

- students know which graph or chart to use for each subquestion;
- graph/table prompts name the required reading operation;
- dense source figures remain readable beside longer text;
- answer models show how graph evidence was used;
- figure proof is combined with
  `references/authored/gemengde-opgaven-target-standard.md` when target status
  is reviewed.

## Closure Record Requirements

For textbook sprints that change figures, closure records must include:

- citation of this standard and the rendered-page acceptance standard;
- list of changed figure assets and generated exports;
- source preflight evidence or a reason source preflight is not applicable;
- full-page rendered proof for every changed rendered page;
- graph/text/table concordance evidence when figures encode values or
  operations;
- classified findings with `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- boundary statement naming which figure surfaces close and which downstream
  claims remain outside scope.

When figure work is not in scope, the closure record must say so explicitly.

## Boundary Statement

This standard governs textbook figure quality only. It does not authorize
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1,
product-route adoption, or student/product-use work.

Those remain separate product gates.


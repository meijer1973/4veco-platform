---
name: econ-paragraph-review
description: "Review economics textbook content or rendered output (bovenbouw vwo/havo), including didactic architecture, mathematical precision and final-page quality. Use when assigned an independent Part A content review or substantive feedback on a paragraph or exercise set. Apply the Part A review workflow for independence, scope, evidence and closure. Generic repository/code review does not trigger this skill."
pipeline: "Part A reviewer"
---

# Economics paragraph review

Review the assigned content and rendered output. Use
[Part A review and closure](../docs/workflows/part-a-review.md) for scope,
independence, evidence, verdicts and publication boundaries. A focused draft
review may stop at its requested findings; it does not establish full paragraph
acceptance. For revisions, inspect changed material and affected dependencies,
reuse named prior evidence and fill any remaining required coverage before a
current paragraph PASS. Book 1 output is frozen; do not retrofit it through the
new Book 2+ theory-paragraph contract.

## Review dimensions

Cover integrity, didactics, precision and final pages to the extent required by
the assigned scope and existing evidence. One review can cover these dimensions;
a prescribed sequence of separate agents is unnecessary. Missing assets block
acceptance of the affected output; report the gaps and review unaffected material
when that remains useful. Author self-checks are not independent evidence.

### Integrity

Resolve image references in the affected Markdown/HTML and verify required
SVG/PNG pairs. Missing referenced files or required outputs are FAIL. Use the
[textbook inventory](econ-textbook-paragraph.md#12-output-files) for theory
paragraphs and the applicable consolidation/test-preparation builder for other
types. Check both source and rendered files. Flag naming deviations and unused
assets; do not confuse the alternate SVG/PNG format with a missing resource.

### Teaching and exercise design

Apply [textbook writing requirements](econ-textbook-paragraph.md#part-3-writing-rules)
and relevant [didactic principles](../references/authored/didactiek-principes.md).
Check the learner's route from the motivating problem through explanation and
practice, concept sequencing, prior-teaching evidence, misconception handling,
integrated representations and method consistency. Detached graph explanations
that cause split attention are FAIL; decorative or unclear content needs repair.

For new Book 2+ theory paragraphs, check the complete
[exercise contract](econ-exercise-builder.md), including alignment, printed
sequence/template, support and fading, target answer form, paper-only usability
and actual lesson timing. For an exercise revision, recheck affected operations
and their dependencies; do not demand a new full set solely for this review.

A missing, reordered, wrong-level or additional exercise stage, misplaced
summary, silent target gap, untaught prerequisite presented as retrieval,
untargeted operation, changed goal, ineffective fading, non-neutral routing,
same-kind arithmetic bonus, new theory in closing review or printed digital
help dependency is a FAIL. A route/time estimate without actual questions is
not evidence of feasibility. Do not accept a reduced target or remove required
support to make the route fit. These checks test the owner's requirements;
the reviewer does not define another exercise sequence.

Apply the [school-fit overlay](../references/external/amstelveencollege_quality_standards.md)
where relevant: visible goals, formative feedback, non-stigmatising support,
meaningful context, self-monitoring and clearly optional enrichment. Flag minor
deviations; failures preventing the intended paper route block acceptance.

### Consolidation and test preparation

Use [consolidation](econ-consolidation-builder.md) for mixed-practice paragraphs
and [test preparation](econ-testprep-builder.md) for the assessment chapter.
Their formats are not new theory paragraphs. Apply only the assigned type:

| Type | Specific acceptance checks |
|---|---|
| Active summary | Five distinct topic blocks, 2–3 MC questions per block, realistic misconception distractors and explanations naming the correct answer and trap. No new theory. Missing blocks/questions/explanations or new theory are FAIL; weak distractors or uneven coverage of the four theory chapters are flags. |
| Exam skills | Normally 4–5 exercises; each targets and names one exam skill (missing/mixed skill is FAIL). Check the book emphasis: graphs/notation, standpuntbepaling, multistep, or real-data/cumulative work respectively. Flag emphasis/range deviations or a missing strong-versus-weak answer comparison. |
| Integration | One coherent scenario with normally 5–7 subquestions, named chapter skills, all four theory chapters and final standpuntbepaling. Book 4 includes a Books 1–3 skill. Missing coherence, labels, chapter/cross-book coverage or evaluative ending is FAIL; question-count deviation is a flag. |
| Practice test | Require the skills × Bloom × points matrix, four-chapter coverage and per-subquestion answer points; Book 4 also needs a cumulative context. Missing requirements are FAIL. Flag deviations from 6–8 open questions in 3–4 contexts, roughly 70% two-point questions, 25/40/35 Bloom balance, or missing graph/data-table/text-source types. |

### Teacher and typical-student coverage

Record both perspectives explicitly; one does not prove the other. Apply these
checks to theory and, where relevant, consolidation/test-preparation output.

| Check | What to look for |
|-------|-----------------|
| 1.9.1 Teacher coverage | Verify goals, target operations, prerequisite classifications, worked examples, exercise progression, formative feedback, differentiation, transfer, retention, and answer completeness against approved authority. Explain whether the paper lesson can be taught as planned. |
| 1.9.2 Student orientation | Walk the actual printed task order as a typical 15-year-old 4 vwo student: can they understand the goal, instructions, next action, optional support/skip route, and answer checking without hidden teacher explanation or online material? |
| 1.9.3 Cognitive load and motivation | Check familiar language, manageable steps, unexplained notation, overcompression, distracting context, and likely confusion or discouragement. The student must be able to connect each graph, table, or flow diagram to its explanatory text. |
| 1.9.4 Readability and accessibility | Verify readable labels and body text, contrast, non-colour cues, meaningful visual descriptions, and semantic/reading order for the in-scope textbook output. Inspect these in the final page; name any concrete issue needing a specialist. |

Missing required coverage or a defect that prevents the intended paper route is
a FAIL. A claim of teacher or student readiness without inspected evidence is
not a PASS.

### Economic and mathematical precision

The [precision reference](../references/authored/economic_mathematical_precision_reference.md)
remains authoritative. Independently solve each affected worked example and
exercise; for new content this means all of them. Check solvability, supplied
data, units, substitution, rounding, economic explanation, hints and answer/figure
references. Match the taught method; do not invent alternative answer demands.

Verify causal directions and the specific economic cause, individual versus
market objects, total versus average costs, ceteris paribus, variable notation,
formula assumptions and domains at first presentation. Piecewise functions need
their thresholds; horizontal addition sums quantities at a common price.
Break-even assumptions and whole-unit rounding must be explicit. Check actual
prior teaching before accepting prerequisite claims and check related material
when a change affects terminology, methods or later reasoning. A material
mathematical/economic error is FAIL.

For affected figures, use [economic-graph](economic-graph.md), including actual
coordinate verification and final rendering. Check plotted geometry against
equations and agreement with text, tables and answers; a helper self-test alone
is insufficient. Judge slope language with the displayed axis orientation and
supplied domain. Do not impose an illustrative supply convention on a supplied
function or add graph production absent from the target.

### Final rendered pages

Apply the [rendered-page acceptance standard](../references/authored/textbook-rendered-page-acceptance-standard.md)
and, for figures, the [figure standard](../references/authored/textbook-figure-standard.md).
Inspect final PDFs and in-scope HTML at normal reading scale, including exercises
and answers. Record full-page PNGs of every changed page, or a contact sheet plus
named pages inspected and output paths. New paragraphs require all pages;
chapter work adds continuity, front matter, final assembly and answer booklet.

Check clipping, overlaps, missing images/glyphs, table overflow, labels/captions,
page breaks, stale renders, contrast, non-colour cues, reading order and answer
readability. Isolated figure crops or source checks cannot replace page proof.
Student-facing rendered defects or missing required proof are FAIL; only
non-core future work may remain as flags under the acceptance standard.

## Record the review

Use the [canonical record and current-file rules](../docs/workflows/part-a-review.md).
Record the scope/inputs, actual checks and evidence, teacher/student coverage,
findings with severity and location, repair dispositions and remaining limits.
Use an identifiable report per paragraph when claiming paragraph closure; retain
`## 2. Verdict` and the manifest binding required there. Organize dimensions in
whatever concise form makes coverage and reused evidence clear. There is no quota
of strengths, examples or report length. Never erase a failure's history or let a
new manifest stand in for substantive rechecking.

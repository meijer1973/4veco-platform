# Bounded exercise correction for independent review

This is the assessment-only requested correction in Book 2 §2.1.1 Opgave 2. The software subscription is EUR 175 per month (previously EUR 150). It is not a discovered corpus error, new paragraph, whole-paragraph acceptance, classroom-release decision or publication request.

## Scope and pedagogy

Question context and answer A: software subscription 150 → 175. Answer C: TCK = 900 + 175 = 1075; TVK = 2Q; TK = 1075 + 2Q. Answer D at Q = 200: TK = 1075 + 400 = 1475 euro. Classification remains fixed rent/subscription versus variable paper/ink. The same operations, answer form and number of steps retain the existing time demand. No Opgave 2 hint, figure, graph or other exercise depends on this charge.

Current target input `references/authored/course-target-exercises.json` lines 1301–1419 establishes classification and construction of TCK/TVK/TK as the affected goals and target operations. The outline row and scoped released-hold metadata were inspected by source search. The existing local theory/worked example supplies the fixed/variable method. Targets, source authority, teaching goals, plans and policies are unchanged.

## Files

The 16 files in `scoped-review-manifest.json` are the three paragraph MD sources; their six HTML/PDF outputs; the opgaven ZIP; and six assembled chapter MD/HTML/PDF outputs. All ordinary text diffs are the requested numeric replacements (26 insertions, 26 deletions). Platform is unchanged.

Existing paragraph and chapter builders were run without code changes, preserving layout. The first chapter run hit Windows MAX_PATH; the same builder succeeded with the Windows extended path prefix. The existing Windows builders double line endings and emit incidental serialization whitespace; an external run-folder step normalized generated whitespace to the committed form. No content was hand-edited in generated HTML/PDF, and source builders remain unchanged.

The old ZIP was stale relative to its current standalone files: its embedded graph, graph-containing HTML/PDF and quality metadata differed already before this task. The rebuilt ZIP retains its exact 15-member inventory and compression method, and all file members now match the paired worktree. This refresh includes the unchanged current graph assets and current historical quality metadata, to keep its markdown/assets/HTML/PDF consistent. Neither historical review nor quality metadata has been renewed or edited in the repository. Please assess this dependency scope explicitly.

## Evidence to inspect

- `source-diff.log` shows the initial source delta; final `git diff -- '*.md' '*.html'` removes the incidental serialization whitespace shown in that initial log.
- `bounded-diff-final.log` and `diff-hygiene-final.log`: exactly 16 files; whitespace check exit 0.
- `paragraph-build.log`, `chapter-build-longpath.log`: successful existing-tool builds.
- `pdf-page-map.json` and `review-pages.json`: same page counts, 6/5/8 for paragraph answers/opgaven/paragraaf and 24/36 for chapter answers/text.
- `visual-page-comparison.json`: six changed pages, ten neighbours pixel-identical to the preserved baseline at 1200-pixel raster height. This establishes local rendering stability, not prior content acceptance.
- Final changed pages in `renders/`: `2.1.1-antwoorden-p2-after.png`, `2.1.1-opgaven-p3-after.png`, `2.1.1-paragraaf-p6-after.png`, `2.1-antwoorden-p2-after.png`, `2.1-antwoorden-p3-after.png`, `2.1-hoofdstuk-p7-after.png`. Matching before images and all neighbouring pages are available.
- Author visually inspected those six final pages: corrected amounts and formulas are legible, with no new clipping/overlap. The unchanged chapter answer splits across pages 2–3.
- `part-a-validator.log`: exit 1 solely because the existing paragraph lacks a current review manifest. No full paragraph acceptance is requested; this baseline gap is preserved and reported rather than manufacturing a new PASS.

Please record independent scoped findings/verdict in the run folder, bound to `scoped-review-manifest.sha256`. The old unbound paragraph review and quality record are historical starting inputs only.

# Coding-agent handoff — finished local Books 3/4 v3 edition

## Assignment

Integrate this edition and its adopted v3 outlines into the paired repositories. This package supersedes the earlier **recovered/incomplete working ZIP**. It contains finished local student books, matching answers, current teacher guides, all editable chapter sources, the populated target-candidate module and reproducible build tools. It does not claim a live repository merge or independent target approval.

**Preserve the supplied material by default.** Do not commission a broad rewrite, recreate v2 targets or run old v2 authoring scripts over these manuscripts. Correct only a substantial defect actually found, with the smallest necessary dependent repair. Do not change Book 1 first edition, publish its second edition or modify Book 2.

## Owner-adopted scope

- Book 3 remains **14 paragraphs (6+4+4)**. Split old 3.2.2 into derivative lesson 3.2.2 and profit-choice lesson 3.2.3.
- Move old 3.2.3 to **new 4.1.1**, retaining its explicit economic-profit, entry/exit and cost conditions. Chapter 4.1 is now **Van concurrentie naar monopolie**, with five paragraphs.
- The Book 3 competition mixed case is short-run only. Trade retrieval 38b and the forward pointer are repaired.
- Defer old **4.3.5** collective bargaining/cao/agreement-policy goals beyond Year 1. Old mixed 4.3.6 becomes new **4.3.5**, with its affected questions repaired. Labour has five paragraphs, not four.
- Book 4 remains **17 paragraphs (5+7+5)**. Total Year 1 remains **12+12+14+17=55**. No additional split or hidden lesson is authorised.
- Accepted student chapter ceilings: Book 3 **50/40/40**, Book 4 **50/60/50**. Actual delivery: **48/34/38** and **48/60/44**. Answers are separate.

## Start here

1. `README.md` links all six complete volumes and current sources.
2. `outlines/` contains the adopted scope and the version-qualified migration CSV. The earlier proposal is preserved under `historical-inputs/outline-proposal-v3/`.
3. `curriculum/book-page-map-v3.json` supplies actual chapter/paragraph/target locators.
4. `curriculum/targets/` contains **31 populated candidates**; the combined module is `curriculum/course-target-exercises-books34-v3.json`.
5. `checks/verification.json`, `math-checks.json`, `rebuild-comparison.json` and `VISUAL_REVIEW.md` state the exact checks and their limits.

## Integrate in the ordinary existing structure

Fetch current main and read both AGENTS/map files before starting. The source baseline for this authoring task was the previously imported v2 edition and the owner-adopted v3 outline; do not assume a branch name or a historical PR head is still current.

Keep the old `edities/chat-2026/` editions and their original hashes/history as v2. Import this revision into clearly versioned current-edition locations under the two existing Book 3/Book 4 directories, or an equivalently explicit shared v3 package location. Prefer the repository's existing edition/archive conventions, not a new storage system. PDFs and Markdown sources must be discoverable without opening a ZIP.

The package is self-contained with `books/book-3/`, `books/book-4/`, `build/`, `outlines/` and `curriculum/`. It can be preserved as a complete source package. If files are relocated across repositories, update the build root/configuration and record locators explicitly; do not change the substantive student text to make paths work. Relative chapter asset paths must continue to resolve. Recheck the source/hash bindings after any locator-only adaptation.

Update book READMEs, entry maps and current indexes to prefer v3. Make the old edition link say v2/historical, not a second current edition. No cover redesign is requested. Known miniature cover-graph limitations are not repaired in this bounded assignment; chapter figures are the instructional reference.

## Curriculum records must follow the edition

`curriculum/blueprint-books34-v3.md` and `structure-v3.json` specify the replacement Books 3/4 structure, test-period boundaries and unchanged counts. Reconcile the relevant v5, v6 and lesson-side projections against them. Do not globally replace numbers: old and new **3.2.3** and **4.3.5** have different meanings.

The target module contains the actual prompt/source/figure/answer content, source hashes, migration origins and teacher routes. It is not just 31 old placeholders with changed labels. Status is **candidate_review_ready**, not reviewed_final. Complete the normal scoped target review before recording final approval; reuse valid previous evidence rather than restarting every book. Never invent machine skill IDs, examination codes, reviewer identities or approval dates.

`build/prepare_registry_update.py EXISTING.json NEW.json` optionally prepares a new candidate file while preserving all non-Book3/4 records. It never edits its input. It is a helper, not a schema/authority bypass; inspect top-level metadata and reconcile source paths with the actual repository layout.

Old approval or historical evidence is not inherited solely through a numeric ID. Unchanged actual targets can retain their question/answer content; moved/revised targets get explicit version-qualified identity. The 156 current target subquestions have corresponding answer text and source bindings.

## Teaching-time boundary — do not conceal it

This selected split resolves the combined lesson design at former 3.2.2 by separating its destinations. It does **not** claim to solve the five pre-existing timing conflicts at **3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5**. They remain marked open in current guides and records. Do not bulk mark all 31 units as classroom-validated or quietly assign two lessons under one number. Other estimates are authored 55-minute routes, not measurements.

The deferred labour goals need a named, funded receiving lesson before later-year targets assume them. No such later-year placement has been invented. This is a separate explicit follow-up, not permission to overload an existing later paragraph.

## Roadmap wording

Record: **Books 3/4 v3 writing, local assembly, answer/teacher alignment and candidate-record preparation complete; repository integration in this PR (until actually merged).** Distinguish this from pending independent target decisions, the named workload follow-ups, later-year allocation, companion production and student-use/publication decisions.

The old instruction to freshly write these chapters or repeat their assembly is superseded for this edition. Do not mark unrelated open work complete. Preserve historical sprint/evidence records; update current projections according to the existing workflow.

## Checks and rebuild

Use the supplied PDF/asset/source integrity checks and required repository CI against the actual proposed pair. Do not reduce checks to make the import pass. If a legacy path checker rejects the edition layout, use the repository's existing narrowly scoped import/edition route, not a blanket exception.

First run `python verify_manifest.py` to verify the delivered file identities. This manifest binds the delivered bytes, not future regenerated PDF metadata.

For a local reproducible build, install the dependencies in `requirements.txt`, have Lato and DejaVu Sans installed, then run:

```text
python build/build_all.py
```

Do not run old `author_*.py` scripts. The current Markdown, SVG and book-matter sources are the editable originals for v3. No font binaries are included. Book matter is source-controlled too: future content changes may require deliberate changes to its glossary/formula overview before rebuilding.

Provide the final source/delivery identities, link checks, required CI and exact PR heads. Keep this report distinct from the author's local checks. Normal owner authorisation and branch protection apply to any merge; **this handoff grants no merge authority**.

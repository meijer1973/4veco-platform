# Part A: paragraph to pull request

Use this checklist for ordinary textbook work after the shared AGENTS guide
and worktree claim. Read the linked section when that step applies; do not
read every chapter, companion and legacy integration manual at entry.

For an unchanged existing PDF edition, use the narrow
[historical reproduction route](part-a-review.md#reproducing-an-existing-edition).
It exports committed PDFs without creating current review evidence. The
authoring and current-closure steps below apply to new or changed material.

1. **Establish the assignment and teaching authority.** Read the paragraph's
   canonical outline entry, target record and chapter plan. For Book 2 run
   `node build-scripts/workflows/paragraph-records.js foundation "<paragraph-folder>" --action paragraph_production`.
   It checks structural currentness, approved use and the exact action together,
   and writes `X.Y.Z-textbook-foundation.json` with source hashes, target pins,
   local chapter-plan hash and hold effects. A BLOCKED decision stops that action.
   The JSON is a reproducible projection, not a new approval. Regenerate it when
   sources or the requested action change. Historical draft/review-ready prose
   in the approved outline describes earlier lifecycle stages; the validated
   current metadata and scoped holds determine current authority. A historical
   chapter-plan pin is audit provenance; establish current chapter-plan authority
   explicitly if the local plan differs. Other books and release/resolution
   actions use their applicable source/action check in the [runbook](textbook-paragraph-lane.md).
2. **Plan and author.** Create `X.Y.Z-textbook-plan.md` from the
   [plan template](../../build-scripts/templates/template-textbook-paragraph-plan.md).
   Link the generated foundation once instead of transcribing its mechanical
   tables. Author the pedagogical decisions: target route, prerequisites,
   explanation/exercise sequence, misconceptions, exclusions and time budget.
   Use the [textbook skill](../../skills/econ-textbook-paragraph.md), its relevant
   didactic rules and the [exercise contract](../../skills/econ-exercise-builder.md).
   Read graph guidance when constructing graphs; consolidation or test-prep
   skills when producing those paragraph types. Book 1 remains frozen.
3. **Render and inspect.** Copy the
   [thin PDF wrapper](../../build-scripts/templates/template-build-paragraph-pdf.py)
   to `build_pdf.py`, then run it with the adjacent platform checkout available.
   It uses the [tested shared renderer](../../build-scripts/textbook/paragraph_pdf.py).
   Install Pandoc and the dependencies in
   [the renderer requirements](../../build-scripts/textbook/requirements.txt) when absent.
   Inspect final HTML and all PDF pages for content, figures, lists, tables and
   pagination. The [PDF skill](../../skills/econ-pdf-builder.md) is a lookup for
   layout adaptation; do not paste its historical regex snippets into a new builder.
4. **Snapshot and independently review.** Run
   `node build-scripts/workflows/paragraph-records.js snapshot "<paragraph-folder>"`.
   One independent reviewer follows [Part A review](part-a-review.md), records
   coverage and the explicit verdict, and includes the printed manifest SHA256
   after checking its files. After repairs, regenerate the snapshot and have the
   same reviewer recheck affected material and bind the new digest. Reuse unchanged
   evidence with its scope. Snapshot generation never renews a review itself.
5. **Generate records and validate.** Run
   `node build-scripts/workflows/paragraph-records.js quality "<paragraph-folder>"`,
   then `node scripts/validate-paragraph.js --mode part-a "<paragraph-folder>"`.
   Quality generation derives inventory, assets and the existing review; it
   preserves authored Part A fields and the companion block. Keep the required
   plan and handoff. Complete chapter assembly uses its chapter-specific checks.
6. **Publish the PR and exact pair evidence.** Run the textbook lane diff check
   from the [runbook](textbook-paragraph-lane.md). Commit and push the actual
   outputs. Use [paired paragraph CI](paired-paragraph-ci.md) for the lesson SHA
   in this PR; required platform CI still uses lesson main. Reuse the completed
   content review for ordinary PR closure. Source/publication decisions remain
   distinct. Only consult protected/bundle integration policy if that scope is
   actually involved; otherwise use the authorized exact-head merge procedure
   linked in [Part A review](part-a-review.md).

Record commands/results, actual skill use and useful friction as work proceeds.
No separate quality reviewer, repeated review of unchanged pages, copied CI
packets or index-only commits are required for this ordinary route.

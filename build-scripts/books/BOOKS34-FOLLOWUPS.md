# Books 3/4 follow-ups: one bounded revision

Implements NAV1, the §3.2.3 answer heading, and teacher planning recommendations
for all 25 theory paragraphs. It preserves questions, answers, exercise IDs,
goals, the 31 target payloads/statuses, mixed-practice exceptions and Part B.
The source contract lists the exact changes. Teacher advice is provisional,
not an empirical two-lesson fit or a rewrite of curriculum capacity.

Use adjacent owned worktrees and the pinned environment in
[EXERCISE-ROUTES.md](EXERCISE-ROUTES.md). The accepted baseline is the merged
Platform #259 / Lessons #58 pair. Keep their manifests, pins, source libraries,
checks and review evidence intact. `books34_assemble.py` remains sealed;
`books34_followups_assemble.py` is its current successor with just link
preservation and teacher-front advice changed. `books34_links.py` converts
named destinations within each source chapter before append, including the
PDF-to-page coordinate transformation. It never merges same-name destinations
from different chapters.

```text
python -X utf8 build-scripts/books/rebuild_books34_followups.py --baseline --lesson-root <new-external-baseline> --report <external-baseline-build.json>
python -X utf8 build-scripts/books/rebuild_books34_followups.py --comparison-root <external-baseline> --report ../4veco-lessen/edities/books34-v3/checks/followups-build.json
node build-scripts/books/record_books34_followups_revision.js --comparison-root <external-baseline> --python <pinned-python>
node build-scripts/maintenance/check-books34-v3-import.js --require-tracked
```

The first command exports the fixed accepted Git edition to a **new** external
directory, validates all inputs and rebuilds it with the predecessor assembler.
Its receipt binds output hashes, exact tools and rendering environment. Revision
builds reject stale receipts or a revised source passed off as a baseline.
The new builder explicitly renders answers for 3.2 and all six teacher chapters
before assembly. It checks one designed page per printed teacher/answer page.
Unrelated regenerated files are restored to accepted bytes only after exact
text/navigation/pixel equivalence (or exact text-file bytes) with that baseline.

The finite successor records 32 publication paths, four refreshed answer pins
plus the combined target file, seven source files and explicit documentation /
current evidence. All other lesson changes are rejected. The current dispatcher
accepts either the new reviewed successor or **exactly** the accepted signed
baseline for platform CI against lesson main. It does not repin old evidence.
The old dispatcher is authenticated against its accepted Git commit; the new
dispatcher is part of the new manifest. Other sealed signed inputs stay equal.

Relevant checks:

```text
python -m unittest discover -s build-scripts/books -p test_books34_links.py -v
python -m unittest discover -s build-scripts/books -p test_books34_followups.py -v
python -X utf8 build-scripts/books/verify_books34_followups.py --report <external-verification.json> --comparison-root <external-baseline>
npx jest build-scripts/books/books34-followups-revision.test.js build-scripts/books/books34-signed-revision.test.js --runInBand
```

The PDF verifier checks every chapter annotation against its source rectangle,
resolved page and position; every unchanged student page against the accepted
complete book text and pixels; answer heading and neighbours; source/HTML/PDF
teacher text; teacher front matter; page maps; all six complete-volume assembly
and main-contents checks; 31 targets and the existing 598 structural checks.
Teacher advice retains null estimates and labels all five heavy cases explicitly.

Review changed pages and code with one independent reviewer. Bind its scoped
report (including per-paragraph coverage and reuse of earlier accepted content
review) to the new manifest. This does not renew full curriculum approval.
Set `books34-followups-lesson-head.txt` to the exact pushed lesson commit; run
the new paired workflow plus required platform CI. Historical paired workflows
keep their original lesson pins and original evidence scope. PRs remain unmerged
until the owner authorizes the new reviewed pair.

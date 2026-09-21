# Book 2: native theory and signed elasticity, 21 September 2026

This is the current bounded Book 2 build. The exercise-route revision remains the
baseline for Books 3/4 and for Book 2's normal guided route. Historical assembly,
import and route receipts remain immutable; they do not certify this revision.

## Edit and rebuild

Student source: lesson edition `bronnen/H*/manuscript/*.md`. Answers and teacher
sources: chapter-root `*antwoorden.md` and `*Docenten*.md`. The 43 semantic native
pages contain whole text blocks, real tables, fraction expressions and captions;
`signed-page-map.json` maps physical PDF pages to the editable manuscripts.
Figures use chapter `_assets/theory-20260921/page-NNN.json` with editable paths,
labels, axes/model annotations. The platform renderer produces SVG/PNG assets.
Do not edit chapter HTML/PDF, paragraph exports, shared engine copies or receipts.

From the adjacent platform checkout, install `requirements-exercise-routes.txt`
and the native Pango/Cairo libraries. The font environment is documented in
`references/staged/books34-v3/BUILD_ENVIRONMENT.md` (Lato and DejaVu Sans).

```text
python -X utf8 build-scripts/books/rebuild_book2_signed.py --all
python -X utf8 build-scripts/books/verify_book2_signed.py
python -X utf8 build-scripts/books/verify_book2_figures.py
python -m unittest discover -s build-scripts/books -p test_book2_native.py -v
node build-scripts/books/project_book2_signed_authority.js
node build-scripts/books/record_book2_signed_revision.js
node build-scripts/maintenance/check-books34-v3-import.js --require-tracked
```

Record the revision only after completed builds; stage lesson files before the
tracked verification. Changing the exact inventory/pin requires independent
review. `--assemble` validates the existing source/chapter record and rejects
changed sources; only a successful `--all` refreshes the chapter record.
A single `--chapter N --derivatives` is useful during editing but cannot renew
assembly provenance. Overlong and off-page native text are fatal build errors.

## Provenance and limits

The supplied package lacked the original revised authoring scripts. Its accepted
text/layout/vector references were ported once into semantic manuscript content
and bounded figures. Package PDFs are comparison evidence, never build inputs.
The clean cover background is the exact approved embedded image; the cost/PS
vectors and signed panel are built from editable sources. There are no full-page
facsimiles. Source and layout remain separate from derived exports.

The complete books retain 110/57/19 pages. The verifier compares all 180 chapter
pages to assembly, all 121 chapter links, 207 paragraph-export pages and 20
paragraph links. Printed numbers run continuously after the unnumbered cover and
contents: students 1–108, answers 1–55, teacher material 1–17. The chapter and
paragraph exports retain these book numbers. Main contents, chapter contents,
compact navigation labels, reference tables and teacher references use the same
printed numbering. PDF viewer labels agree. The overview destinations are printed
pages 70/107 (physical PDF pages 72/109); answer bookmarks remain clickable.
External paragraph links use relative
chapter paths; distribute their folder structure together.

`book2_print.py` owns current contents rendering and counter offsets, deriving
chapter starts from `assembly.json`; `print-pagination.json` binds the convention.
Four contents-number link areas widen to contain the additional digits. Their
reviewed before/after record is `book2-print-review-20260921/navigation-delta.json`;
the historical navigation evidence remains unchanged.

The build also produces `boek/Boek_2_Theorie_43_Herziene_Paginas.pdf` and its JSON
page map/hash record from the current complete student book. This is a reading
extract with preserved book numbers; use the complete book for clickable links.
It is included in the current assembly and closed revision inventories, so it is
available from the lesson PR rather than solely from a local convenience folder.

The policy is canonical in `economic_mathematical_precision_reference.md` §15.
GEN.A15 uses signed, unrounded own-price elasticity and old-value denominators;
zero, undefined price change and positive confounded ratios are separate cases.
The unitary boundary uses exact decimal input cross-products before interpreting
the numeric quotient; it does not classify by rounded display values or tolerance.
Finite revenue is calculated as old/new P×Q. Voluntary absolute-value reasoning
is not penalised, but is no longer a required step or marking point.

Historical chapter-root `build*.py`, `make_assets.py`, old unused absolute-value
figure assets, import/repair/route manifests and historical review evidence are
retained for reproduction. The current renderer overrides their page-body path;
active native pages reference the new figure assets. Do not run the historical
asset or route builder to publish this revision.

The newer guided route and §2.2.4 Hoofdstukcheck 7 label are retained. Exercise
identities, numbering, learning goals and point statuses remain unchanged except
for the explicitly approved signed-elasticity wording and finite target fields.
No lifecycle holds or target approvals are released. Existing 34 theory-paragraph
complete-route timing budgets remain unresolved; no new 55-minute claim is made.
Books 3/4 still contain active retrieval prompts/answers with the older required
absolute-value wording. They are a named downstream alignment follow-up, distinct
from immutable historical evidence; their NAV1 contents links are a separate repair.
Part B is unchanged.

PDF byte hashes depend on the checkout/font/native-library environment. Review
text, actual geometry and pixels as well as same-environment repeatability.

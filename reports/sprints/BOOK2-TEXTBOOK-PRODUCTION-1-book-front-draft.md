# Book 2 front source draft — checks, not assembled-book acceptance

Date: 2026-09-05. Author/checker: codex-root.
Preimplementation plan: `BOOK2-TEXTBOOK-PRODUCTION-1-book-matter-plan.md`.
Status: **DRAFT; INDEPENDENT SOURCE REVIEW PENDING; BOOK NOT BUILT**.

Authored sources in `build-scripts/books/book-manifests/`:

| File | Raw SHA-256 | Preface words |
|---|---|---:|
| book-2-voorwoord.md | `556530cbe5eb59a862e778f3357a36a31965d57336bc2d4e51d7cfce17b25795` | 265 |
| book-2-antwoorden-voorwoord.md | `8f8e9adeb79a0947e2ee275ade0fba2f0a15f17a2a95b9e068b966a0be63446d` | 200 |

Root executed Pandoc markdown→HTML5/mathml on both sources without output files.
Four unique explicit front IDs each, fifteen contents links each, exactly the
three chapter/four-paragraph order and correct student/answer anchor prefix:
PASS. No active script/frame/object, image dependency or external hyperlink.
Both use-prefaces are below 300 words. Source whitespace validation PASS.

These are prospective stable body anchors from the reviewed book profile,
not yet links resolved against actual completed chapters. Source structure
checks are not PDF legibility proof or independent editorial acceptance. No
book manifest, aggregate source, back-matter placeholder, proof manifest or
student-book PDF was generated. Source acceptance requires a non-author review;
final back matter and all front/back rendering remain gated on accepted chapters.

The repository licence text will be preserved in eventual back matter. Neither
front requests web use or sends pupils online for answers; the separate answer
book is explicitly identified. No author or unverified institution on the cover.
Next: independent source review, then actual chapter-derived back matter and
full-book navigation/render checks once the chapter gates are complete.

# Independent wording follow-up and navigation qualification

Reviewer: `review_book2`; author: `codex-root`; 2026-09-21. Both repositories remained read-only. This is a bounded route revision follow-up under the shared Part A review workflow, not a native paragraph-records.js closure, new target approval or merge permission.

## Exact current binding

Lesson commit `fdad5d8f62b7e12618e6a3b8d344c407c259ed35` was independently confirmed clean. Whole-edition manifest SHA256: `a07127c5fe1e2595067c840608b722235188279441116c638f7e7dc7967f3b07`; 1,291 files. The 43 inspected edition-paragraph snapshots and refreshed reports bind their own current JSON-value digests in review-coverage-index.json. The historical lesson baseline remains e2843b47c828784ab594d004cef461cea929717f.

Current platform source inventory: reviewed-platform-inputs-current.json, SHA256 `e271ced4d839e59572fae3ef7c7a69e517d5954f90b8ec2182b0a4acfbf1a530`. Of 41 previously reviewed paths, 37 remain exact after the existing LF normalization contract. Four changed: the previously reviewed npm-ci workflow fix, the lesson-head pin, the finite revision manifest pin, and the one didactic wording rule. platform-input-delta.json records both identities. Workflow SHA256 remains 62ff7ce1d4b006733c77b00a3f747446bde085a28b75a9f582725141d3ffeff7; the earlier CI addendum remains historical and applicable. Current didactic skill SHA256 is ea62dcdf93a76a27ee3514b8f6fede26b606a9f77004df14aa6bd56404939a80.

## Reviewed corrections

- R7 resolved: econ-didactiek.md rule 5 now calls guided practice the normal learning route, retains fading and links to the canonical Part A contract. The old conditional “voor wie het nodig heeft” has been removed. No second route definition or Part B change was introduced.
- R8 resolved: Book 2 §2.2.4 names the actual additional section “Hoofdstukcheck 7” instead of “Herhaling”. Its seven exercises, preparation/target/bonus sequence and answers remain unchanged. The corrected complete student PDF page 66 and neighbours 65/67 were inspected at full size; text is clear and unclipped. Printed chapter page 30 corresponds to complete PDF page 66.

## Independent checks and reused evidence

Independently compared every one of the 32 byte-changed PDFs against lesson commit b946cf04b128a374301e1998653f45583ec97057: 373 pages. Text and exact 72 dpi pixels differ only at the requested note's four occurrences (complete page 66, source H2 page 30, copied H2 page 30, standalone §2.2.4 page 1). Each changed page has exactly the requested text replacement, with unchanged pixels below its route notice. All link semantics and rectangles remain identical. This check preserves existing links; it cannot create or certify previously absent chapter links.

Freshly compared all 43 standalone student exports, 355 pages, to current chapter pages. Fresh protected-source checks confirm all 390 exercise blocks, 726 answer/figure files and 31 target payloads remain preserved. The four H3 answer exports retain the previously disclosed title-only raster exception; answer bodies remain exact. The finite current importer passed for all 1,291 tracked files, and the Part A authoring contract check passed on all 11 surfaces.

The earlier 598-check/632-body-page assembly run and the 251-page visual inspection remain evidence for unchanged inputs. They were not described as a newly executed full verifier run in this follow-up. visual-coverage.json explicitly records original PDF/render provenance, current PDF hashes and justified reuse; pages 65–67 have new inspected renders. All Books 3/4 complete PDF hashes are unchanged. R1–R6 findings and timing limits remain as recorded in overall-review-prior-to-wording.md and individual reports. The original overall report is preserved byte-for-byte, SHA256 41391d7a9ba52043a9a33f0112c8637651cea39e852e3656203acf9f3efe5656.

## NAV1 — open, separate pre-existing chapter-link defect

The four affected complete student pages are Book 3 page 5 (chapter 3.1, 28 source annotations to 0), Book 3 page 87 (3.3, 19 to 0), Book 4 page 53 (4.2, 28 to 0), and Book 4 page 113 (4.3, 24 to 0). Those 99 annotations represent 25 distinct entries. Both local and book-page source PDFs retain them. Direct git-show examination of baseline e2843b47 found the identical losses, so they predate this route revision. An independent PyMuPDF 1.26.7 insertion probe reproduces named-destination loss. No navigation repair was performed; the owner explicitly requested a separate repair.

The previous generic navigation claim is qualified: it covered the complete main contents destinations and range of remaining Book 3/4 links, not survival of chapter contents annotations. Its broader interpretation as complete hyperlink preservation is withdrawn. Visual/pixel checks do not establish clickability, and checking ranges of surviving links does not detect absent ones. Book 2's independently verified preservation of all 105 annotations remains valid. Full details, target pages, source/final hashes and baseline evidence are in chapter-contents-navigation-audit.md (SHA256 f4d37da297f11a0be5ef8217e99087f3df7502b1f53083975a54a3c92f8159fe) and its JSON/probe evidence.

## Verdict

PASS WITH FLAGS

The two requested wording corrections satisfy the bounded route revision and introduce no new content or navigation regression. The independently checked delta justifies refreshing all 43 current bindings while preserving prior evidence. Classroom timing is still not demonstrated for complete routes; unchanged target/curriculum status is not elevated. NAV1 remains acknowledged and open for the separate repair. This verdict does not certify full paragraph content, all navigation, publication or merge readiness.

## Evidence identities

- independent-wording-pdf-delta.json: `8fb1d51dd0da85f59b1b6f786f92f40bed212b4dea5791ce95ec5d698a4bdc6d`
- paragraph-export-review.json: `f3179e14c33faef68c60d454782750b6ecbcd3c389eb9a4e883ff4ef66fa834c`
- source-preservation-current.json: `358caa5fb399cfb0a196a2d1166aaba94f345f32d20ac3aa6e1186d0286f8b98`
- visual-coverage.json: `9e96e11deef6d63da0c6e0c5ce350c28d5ceca1419bd176036325267fbe4c956`
- review-coverage-index.json: `f934accfc37a1e89bf4fa1fc81f74008d5f456feb0fccd31d3578e8bbbfe12a9`

# Interim independent build-path review

Reviewer `review_book2`, author `codex-root`, 2026-09-21. Repositories were read-only during this review. Scope: platform `rebuild_exercise_routes.py`, `books34_assemble.py`, `books34_records.py`, revised `build_book2_chat.py`, and the lesson `edities/books34-v3/build/build_all.py` wrapper. This is not a final artifact or paragraph PASS.

Exact reviewed code identities and independent probe results are in `build-probe-results.json`, SHA256 `fde8bd51c94e099c86d365a8a90eb6edbe64cdc47ac8cabe387e806030d1d519`. The repeatable reviewer probe is `probe-route-build.py`; its temporary fixtures and all evidence are outside both repositories.

## Finding and disposition

R2, resolved: the first assembler version ignored the result of `build_chapter(..., offset)` when rendering the final student chapters with book page numbers. The orchestrator checked only the earlier local-page render. A longer rewritten page reference could overflow only the second render and leave TOC/page maps based on designed counts. The author added rejection of either reported overflow or an actual page-count mismatch. I independently executed the actual assembler function with a controlled renderer in two fixtures: reported overflow and count drift without an overflow flag. Both now raise `Book-page chapter overflow 3.1` before assembly.

No further current-code defect was found in this bounded inspection. The final verifier, documentation, complete rebuild, and rendered artifacts remain pending.

## Ownership and failure handling

The lesson wrapper delegates to the adjacent platform entry point and propagates failures. The current Books 3/4 assembly and record templates live in platform; the received versions remain historical. The entry point checks five reused Books 3/4 renderer/helper files against immutable transport bytes before use, verifies their selected source root, renders current student and teacher source, then runs assembly, record extraction, paragraph export, preview extraction, and current outline rendering in order. It intentionally excludes the historical decision/migration PDF from rerendering.

The existing outline renderer is transformed only after its received bytes have been checked, so the precise loop adaptation is bounded to a known input. Missing required files and subprocess/render failures propagate rather than silently claiming success. The final assembled book-page render now has its own drift check. Authored `back.md` is retained; front matter, its style projection, maps, records, and outputs are regenerated through their owning code.

Book 2 runs each chapter renderer in a separate subprocess, avoiding cross-chapter module-cache contamination. The platform entry point applies its route layout addition, checks designed student page mappings, updates teacher output, exports paragraph views, enforces unchanged student/answer counts, and explicitly binds revised chapters and source files. Teacher pagination may grow. Normal Book 2 reproduction retains the historical chapter-byte check; revised mode uses a distinct input binding and a distinct route-assembly manifest, leaving the old repair manifest intact.

Seven independent negative binding probes passed: unknown revision, missing chapter, duplicate source, omitted manuscript, path escape, stale source hash, and stale chapter hash are rejected. The valid fixture was accepted. These are source/byte bindings, not independent proof that every permitted prose edit preserves learning content; the separate bounded revision verifier remains necessary for that claim.

## Preservation evidence

Independently compared all 31 current Books 3/4 target records with immutable received records. Their only changed top-level fields are `lesson_route` and `source_pin`; within the latter, only `student_manuscript_sha256` changes. Every target payload digest, context, question, answer, goal, figure reference/hash, structural field, and other source locator is identical. The platform record extractor differs from its received version only in the final generated blueprint timing paragraph; it does not change target extraction rules.

All six Books 3/4 central answer manuscripts are byte-identical to received input. All three Book 2 central answer manuscripts and all three reused chapter answer PDFs are byte-identical to lesson baseline `e2843b47c828784ab594d004cef461cea929717f`. Reusing those answer chapter PDFs is justified for these current inputs. The final bounded verifier must retain this check: the builder intentionally does not regenerate answer chapters when an answer source changes, so an unsupported answer edit must not be accepted merely because new source hashes were recorded.

## Reproducibility limit

Current PyMuPDF saves in the assembler/exporters use default PDF-ID regeneration. An independent in-memory probe with available PyMuPDF 1.27.2.2 saved the same document twice and obtained different trailer IDs/bytes. That probe is not a run in the edition's pinned 1.26.7 rendering environment. No byte-identical full-rebuild claim is supported by this review. Stabilize IDs if byte reproducibility is required; otherwise report and verify semantic/text/render reproducibility and bind the actual final PDF bytes. Record the final renderer/native library/font environment, not just the package lock's intended environment.

## Remaining closure work

The author is preparing a separate current-revision manifest/verifier while preserving historical receipt checks. The expected historical full-import failure on amended current files is not a new defect. Final review must inspect that bounded verifier, current source ownership/build documentation, rebuilt teacher pages, all changed rendered pages and relevant neighbours, final page maps/TOC destinations, preserved exercise/answer/goal payloads, and final artifact hashes. In particular, ownership documentation must point current front-matter and record edits to the new platform files, while describing the old lesson scripts as historical.

Executed `C:/Python314/python.exe -B -X utf8 review/probe-route-build.py`: exit 0. It performed preservation comparisons and nine failure probes without rendering or mutating repository outputs. The author’s pending final rebuild is not represented as independently executed here.

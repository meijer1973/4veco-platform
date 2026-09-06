# Book2 reproducible book proof namespaces — bounded tooling plan

Date2026-09-06. Root codex-root, sole integrator. Exact published paired start
P8bd4bd66fa0352a770f5069c50ee1bbdf2f651bd /
L30f57bfad2096c7afa507da48db9d82ee35a3c23. Root's owned task branch/pair
codex/book2-part-a-production-20260905 in C:/wt/book2-part-a-production-20260905.
This normal production-tooling step does not release any student assembly.

## Observed requirement and quality floor

The approved41-PDF package requires native reproducibility and independently
captured immutable proof. Current book_pipeline.build_book always captures in
one fixed reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 root, using PDF-hash
child names. After one successful capture, an unchanged independent rebuild
would reach an occupied child directory and fail; its output writes happen
before that check. The paragraph pipeline already offers a caller-selected
proof root; the book CLI/profile currently cannot select one. Chapter API
already has an explicit proof_root, so it needs no speculative change here.

Quality floor: a distinct explicitly unused Book2 proof namespace for each
authorized full rebuild; fail closed on occupied/out-of-scope roots before
input subprocesses or pupil output mutations; successful repeated builds have
identical MD/HTML/PDF/assets but separate intact PENDING evidence. Preserve
frozen Book1 default behavior, all paragraph rendering, exact student teaching,
authority checks, existing proof and trusted source/hash/reference boundaries.
This improves native reproducibility, not pupil learning or assembly approval.

## Bounded implementation

1. Commit this plan before edits/tests. Main personally read complete chapter,
   book and PDF skills, BUILD-CHAPTER, chapter/book pipeline and existing tests,
   book CLI and relevant lib_book dispatch. Existing approved root/back-matter
   plan wins over generic legacy11pt and website-only-answer recipes: two
   separate paper books,12pt minimum, no website dependence. No source matter
   is created before accepted chapters and independent source review exist.
2. Add optional keyword proof_root to Book2 build_book and common dispatch;
   expose --proof-root in the existing book CLI. A non-null explicit root is
   supported only for the Book2 frozen profile and must resolve below the
   platform's reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 or
   reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-prefixed evidence namespace.
   It must not already exist, even empty, and must not be a broad evidence root.
3. Validate the explicit destination without writing before source preparation.
   After complete input and actual authority checks, reserve it atomically
   with mkdir(exist_ok=False) before any pupil/asset output. Recheck containment
   and occupation before reservation; retain consumed namespace on failure.
   All existing per-artifact hash naming and PENDING manifests remain intact.
   Omitted option preserves the existing default API/CLI and Book1 renderer.
4. Add a separate regression test file; preserve all original test bodies.
   Prove existing empty/populated roots and out-of-scope/escape paths reject
   before prepare/build/authority/output side effects; a namespace appearing
   during preflight fails before student writes; denied authority or stale
   input creates no namespace. Test standard CLI/common-dispatch forwarding
   and nonBook2 rejection without changing default dispatch calls.
5. Actual temporary-fixture native rendering twice at different explicit roots
   must preserve six MD/HTML/PDF bytes and page hashes/pixels, safe asset copies,
   all input provenance and both PENDING manifests. Only fixture authority
   subprocesses may be stubbed, explicitly not an actual assembly grant. No
   production Book2 manifest/source/output is created. Preserve fixture failure
   evidence, original tests and source snapshots; no shared environment edit.
6. Run original print/chapter/book tests plus new tests, relevant common book
   tests and CLI checks, currentness/durable/active bundle, exact lesson/source
   preservation and actual source-bearing incremental/complete scope. Record
   genuine failures and corrections. Commit/publish with explicit paired maps
   and a separate four-index tail, normal remote-clean verification.
7. Assign a distinct independent tooling reviewer before using the new option
   for real assembly. Root authored this change, so root tests do not close
   that review gate. Final comprehensive CI/lead review still applies.

## Owned paths and limits

Only build-scripts/content/book-2/book_pipeline.py,
build-scripts/books/lib_book.py, build-scripts/books/build-book.py,
new build-scripts/content/book-2/test_book_proof_namespace.py and unique
book-proof-namespace sprint evidence; root umbrella logs and final four indexes.
No print_pipeline, chapter_pipeline, old test, paragraph source/guard/native
file, protected reference, registry, hold, governance, actual book manifest or
lesson file changes. Stop for scope drift, needed semantic/authority mutation,
unexpected predecessor bytes, collision or a real unresolved product question.
This step is not a PR merge grant, current fullCI or book/student acceptance.

# Books 3/4: signed retrieval successor

This bounded revision implements the eight owner-specified fragments in
`books34-signed-contract.json`. Six chapter source files change; calculations,
exercise identities, goals, routes and all 31 target payloads/statuses remain.
Use the canonical signed procedure in precision reference §15.1. This is not
programme-wide alignment, target approval, NAV1 repair or TIMING34 closure.

Use adjacent owned worktrees and the pinned rendering environment in
`EXERCISE-ROUTES.md`. Before editing, copy the accepted `edities/books34-v3`
to an external lesson-shaped directory. In a separate Python process build
that unchanged copy with `rebuild_books34_signed.py --baseline`; its six source
hashes and complete input inventory must match baseline `f6518f51`.
The builder writes `.books34-signed-baseline.json` outside the edition with all
rebuilt file hashes, source hashes, tool fingerprints and rendering environment.
Every comparison authenticates this receipt and rejects the revision root, a
revised source copy, changed outputs or a different tool/environment identity.

```text
python -X utf8 build-scripts/books/rebuild_books34_signed.py --lesson-root <baseline-root> --baseline --report <external-baseline-build.json>
python -X utf8 build-scripts/books/rebuild_books34_signed.py --comparison-root <baseline-root> --report ../4veco-lessen/edities/books34-v3/checks/signed-retrieval-build.json
python -X utf8 build-scripts/books/verify_books34_signed.py --comparison-root <baseline-root> --report ../4veco-lessen/edities/books34-v3/checks/signed-retrieval-verification.json
node build-scripts/books/record_books34_signed_revision.js --comparison-root <baseline-root> --python <pinned-python>
node build-scripts/maintenance/check-books34-v3-import.js --require-tracked
```

The builder renders answers for 3.1, 3.2, 3.3 and 4.1 **before assembly**,
then local student chapters 3.2/3.3, the existing platform assembler, records,
paragraph exports and record preview. It reuses the checked received libraries;
it does not invoke the historical assembly/record templates or route controller.
The latter would reuse stale answers and overwrite route evidence.

All 29 content-dependent publications are rebuilt. The unchanged page maps can
remain byte-identical. Assembly also regenerates other dependencies: each changed
dependency outside the finite set is compared to the same-environment baseline
(PDF text, pixels and navigation; exact bytes for generated text), then restored
to its previous accepted bytes. The build report lists these restorations.
Fresh answer HTML includes the already accepted current chapter CSS; the verifier
requires that exact CSS and the immutable renderer suffix, plus precisely the
approved body substitutions. No chapter stylesheet is edited.

Acceptance preserves both predecessor manifests and platform pins. It validates
their inventories against their fixed Git baselines, freezes every other current
lesson file, checks the finite source/output inventory and tracked index, and
requires the 19 actual answer hashes and two manuscript hashes without dropping
any target fields. The recorder reruns source/PDF verification before proposing
a new inventory pin. A new pin is not independent review.

PDF checks keep punctuation/signs, verify all eight output triplets, both extracts,
three changed complete books, unchanged page maps, bookmarks/link rectangles and
destinations, and all existing chapter/body assembly checks. The local baseline
comparison requires exact unchanged-page pixels. CI identifies historical text
comparison separately from same-environment pixel comparison; it does not claim
that Linux recreated the Windows rendering environment.

Review all changed pages and neighbours, including answer layout (the received
renderer only reports student overflow). Review coverage is recorded for 3.1.1,
3.1.5, 3.2.3, 3.3.3, 4.1.2 and mixed-practice 4.1.5, bound to the final inventory.
Run the new paired workflow at the exact lesson SHA plus required platform CI.
Keep original route/Book 2 review packets, receipt, historical inputs, held PV
templates and Part B intact. Merge/publication authority remains separate.

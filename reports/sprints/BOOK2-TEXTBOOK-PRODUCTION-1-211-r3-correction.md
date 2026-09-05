# §2.1.1 R3 correction — builder evidence, not acceptance

Date2026-09-05; builder `released_pin_analysis`.
Root authorized helper316d2f2d (cherry-picked ef9b82b6) and a short printed
prior-knowledge bridge. Independent reviewer correction_plan_review confirmed
the brief bridge fits the accepted plan's A04 retrieval scope, with no new
task/goal/heading needed. The reviewer's safe wording is used verbatim:

> Je hebt al geoefend met invullen in een gegeven formule en met een totaal delen door het bijbehorende aantal. Die rekenstappen gebruik je hier opnieuw. Je leert nu welke productiekosten je moet kiezen en waarom.

It precedes new theory, consumes the existing2-minute motivation/transitions
budget and neither expands Start nor asserts an unverified exact Book1 formula.
All frozen goals, target/cells/points, numerics, exercise and answer models remain
unchanged. The R2 Dutch correction remains present.

## Font-floor correction

All running footer/page-counter text is now12pt, matching the full print quality
floor without exceptions. The prior builder's9pt-footer carve-out was incorrect
and is superseded. `211/check_render.py` now measures every nonempty PDF text
run after its actual transform; no footer-coordinate exclusion remains.
All three PDFs report minimum printed size12.0pt, including footer.

## Canonical R2 → R3 supersession

All artifacts are under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1`.

| Prior R2 artifact | Current R3 artifact | Renewed personal inspection |
|---|---|---|
|211-paragraaf-e136b26a4fcb-r2|211-paragraaf-9837e3a85f31-r3|All15 full-page PNGs individually inspected|
|211-opgaven-111c7436dedc-r2|211-opgaven-97329415bacc-r3|All9 full-page PNGs individually inspected|
|211-antwoorden-979cba5ed213-r2|211-antwoorden-ffdf0905a980-r3|All7 full-page PNGs individually inspected|

No page inspection was carried forward in R3: all31 were actually re-inspected
at full150dpi reading scale after regeneration. Footers fit without collisions;
opening bridge is readable and the frozen target still fits together on
paragraph14/exercise8. No visible clipping, overlap, broken glyph, unreadable
table, severed short callout or inaccurate graph was found by the builder.
Generated manifests remain PENDING independent review. Separate attributed
builder-inspection records bind the exact new LF-manifest and PDF hashes.
Prior R1/R2 records are immutable superseded historical evidence, not current
student-use acceptance. All old local exploratory drafts remain untouched.

Current exact PDF hashes:

- Paragraph: `9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0`
- Exercises: `97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953`
- Answers: `ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a`

## Observed checks

1. Full builder `--proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r3 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-build-r3.json`: clean exit0;31 pages.
2. Second full builder without proof, manifest `BOOK2-TEXTBOOK-PRODUCTION-1-211-build-r3-rebuild.json`: clean exit0; all9 document-file hashes,12 assets and6 input hashes match exactly.
3. `verify_record_freshness` after rebuild: PASS all consumed MD/HTML/PDF and assets.
4. Source11 tests PASS; shared helper19 tests PASS in this branch.
5. Actual `211/check_render.py`: PASS floor12.0pt including footers; all4 exact goals, alltarget cells/prompts/17points and same exercise HTML.
6. Both builds: approved scoped paragraph-production currentness PASS, durable12-record frozen authority PASS.

No fresh independent review/quality-ref is authored by the builder. Root clarified
that platform generators belong in the shared lane, while lesson outputs belong
in textbook; root owns the canonical-proof review-evidence classifier update.
Next: independent reviewers bind their renewed review to this R3 payload and
root integrates only after those checks. Any additional findings trigger source
correction and regenerated evidence, not manual output or manifest edits.

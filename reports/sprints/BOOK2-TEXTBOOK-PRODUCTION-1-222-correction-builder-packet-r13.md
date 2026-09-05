# §2.2.2 R13 correction builder packet

2026-09-05. Builder: paragraph_222_correction_builder.
Task: BOOK2-TEXTBOOK-PRODUCTION-1-222-CORRECTION. Candidate for distinct
paragraph rereview, specialist QC and root decision; **not accepted output**.
Canonical `2.2.2-review.md` remains FAIL, and quality-ref/handoff remain unchanged.

## Corrections and invariant proof

Only `222/answers.md` Opgave 4b and `222/exercises.md` concert metadata change.
Schaatsbaan now calculates signed −5% quantity first, then +10% price, then
Ev = −0.5 with price-inelastic classification. Badmintonhal now calculates
signed +20% quantity first, then −10% price, then Ev = −2 with price-elastic
classification. The exact printed ratios
remain −5% / +10% and +20% / −10%; all values, signs, units, classifications,
conclusions and surrounding answer text remain unchanged. The three R12
supported structural breaks in the unmodified generator remain intact.

The native Markdown image retains its full original 147-character caption and
adds the 100-character noun-first alternative:
“Omzetrechthoeken van het concert: na de prijsstijging is de omzet lager, ondanks interval-Ev = −0,8.”
Both actual student HTML outputs retain all caption words/punctuation and
adjacent explanation. Native Pandoc also removes `aria-hidden="true"` from the
concert figcaption and reflows HTML source whitespace. After reversing exactly
those two attribute changes in an in-memory inspection copy, the complete
normalized DOM hash equals R12. No unrelated DOM allowance or sanitizer patch.

Actual paragraaf HTML alt lengths are 92, 90, 91 and 100; the standalone
opgaven concert alt is also 100. All are functional noun phrases. All four
actual SVG accessible titles satisfy the same ≤120-character noun-first
contract and are unchanged. No generator/geometry/asset metadata fix was needed.
All eight SVG/PNG asset bytes match R12, and fresh CairoSVG rendering passes
raw-byte and decoded-pixel equality with zero tolerance.

## Exact output and direct inspection

| Edition | Pages | R13 PDF SHA-256 | R12 transition |
|---|---:|---|---|
| paragraaf | 10 | 36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c | Exact PDF and all page bytes unchanged |
| opgaven | 6 | 0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555 | Exact PDF and all page bytes unchanged |
| antwoorden | 5 | 61cbde67e81565150128187573a766fffc9bc1d01f3bd24cbe3dacb9ddeb52b2 | Only page 2 PNG changes |

The single changed page is answers page 2:
`7bf2147b456b14e9af54a8e6c0ec4bb417828c0e7ddc97d22abb526024527f40`
→ `65ab004822fdc1eca242363f3b18c340e0cbace06ce03afbaf6545c4b6721043`.
All 21 before/after page hashes are recorded in the after snapshot and the
builder inspection record. Twenty pages are byte-identical, but **all 21 final
full pages were personally viewed afresh** in this correction task. No borrowed
or inherited inspection is claimed. All four full-size figures and fresh
grayscale full pages 2, 3, 4 and 6 were also personally viewed. Direct labels,
old dashed boundaries/new fills, four local directions, scales, periods and
the complete concert caption remain readable. No clipping, collision, broken
absolute-Ev token, missing glyph, caption loss or answer leakage was observed.

Actual body/table/footer minimum is 12.000pt; placed figure minimum 14.378pt.
The answer page clearly shows quantity-before-price for both calculations.
The concert still gives 1.5 × 0.6 = 0.9 and TO1000→900; finite interval Ev does
not prove the local classification at every price. Nova/StreamNow retains
four goals, six target questions, 2/2/2/2/2/1 points and exact short answers.

## Durable evidence and checks

All following filenames are under `reports/sprints/` with prefix
`BOOK2-TEXTBOOK-PRODUCTION-1-222-`:

- `correction-plan-r13.md`: plan written before source edits.
- `correction-before-r13.json`, SHA-256
  `99c56f28b235f69f9d044c3fdf352ebb5a8539e9c661082e317a32e195aa195d`:
  pre-edit source/output/metadata snapshot and original platform/lesson heads.
- `correction-after-r13.json`, SHA-256
  `13618e2469b22125bda9f68aa87a32d9dd8d9428dc0a24d08f4e785f32d50004`:
  exact authored delta, DOM/alt/title audit, all source/output/assets/page hashes,
  zero-tolerance raster parity and 368 historical/authority files unchanged.
- `build-r13.json`: six exact consumed sources, three MD/HTML/PDF outputs and
  paired assets; proof directories `222-paragraaf-36feb7873637-r13`,
  `222-opgaven-0a251a4973b1-r13`, `222-antwoorden-61cbde67e815-r13` under
  `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.
- `render-check-r13.json`: unchanged checker with full second build PASS;
  complete source/HTML/PDF/asset bytes reproduced and every proof page fresh.
- `builder-inspection-r13.json`: actual personal page/figure/grayscale
  observations, explicitly builder-only, not independent acceptance.
- `grayscale-r13/capture.json`: four fresh 150dpi Poppler grayscale captures.
- `CORRECTION-command-log.{jsonl,md}`: append-only execution evidence including
  expected failures; no failed probe was deleted or rewritten as PASS.

The original eleven source tests passed. With three new regressions, R12 failed
exactly two tests: price-first ordering and actual 147-character Pandoc alt.
After the two source edits all fourteen tests passed, including in-memory
mutants of each old defect, supported-break guards and all fifteen numerical
contexts. Twenty unchanged shared print-pipeline tests passed. Three scoped
workflow suites passed all 173 tests. Both actual normal Part A profiles
student-web and publisher-print fail with exactly one error and zero warnings:
the unchanged canonical review FAIL. That expected result is not waived or
concealed. Approved-use currentness for §2.2.2 and durable twelve-target
authority passed within both full builds.

## Ownership and continuation

No target, registry, outline, hold, chapter/paragraph plan, protected reference,
other paragraph, shared print/CSS/sanitizer, short-answer normalization,
canonical review, quality-ref or handoff changes. All R1–R12 records remain
unchanged. New generation and grayscale manifests remain honestly PENDING;
actual builder observations are separate. No extra PDF marker was emitted.

Historical stage-2 §221 R6 pins stay honest history; b2_222 has no runtime
hard §221 acceptance pins. Root must connect the accepted successor externally.
Classroom timing/attainment remains unobserved: core51.5, support-inclusive66.5
and everything79.5 are inherited workload estimates, not new observed results.
Locked dependency install reported eight existing vulnerabilities; no dependency
or lockfile change was made. The shared WeasyPrint deprecation warning remains
a future toolchain concern, not a defect concealed by this correction.

This paired correction has no PR, merge grant, final-head remote CI, complete
book, specialist acceptance or human-readiness claim. Root next adopts the
bounded source/output/evidence commits and assigns distinct rereview and QC.
Publication/scope evidence follows in the correction publication record.

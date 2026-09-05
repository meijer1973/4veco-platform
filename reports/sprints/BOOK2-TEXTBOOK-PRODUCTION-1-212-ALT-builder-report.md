# §2.1.2 metadata correction — builder result

Builder: `paragraph_212_alt_builder`. Date: 2026-09-05.
Status: bounded implementation and builder verification complete; independent
paragraph review, distinct specialist QC and root acceptance still PENDING.
This is supplemental evidence, not canonical paragraph review/quality/handoff.

## Exact correction and retained semantics

Nine native Pandoc alt attributes were appended to the full-caption Markdown.
Five machine-ID accessible titles were replaced with meaningful context-first
titles in `b2_212.asset_sources`. No drawing operation changed.

| Asset | Prior alt length | New actual HTML alt length |
|---|---:|---:|
| fig1 | 130 | 59 |
| fig2 | 146 | 90 |
| fig3 | 138 | 85 |
| fig4 | 131 | 89 |
| ex1 | 137 | 97 |
| ex2 | 131 | 94 |
| ex4 | 151 | 87 |
| ex5 | 172 | 112 |
| ex6 | 159 | 92 |

Native Pandoc produces 12 changed occurrences across the three editions
(7 paragraph, 3 exercises, 2 answers). Each has exactly an `img.alt` replacement
and removal of matching `figcaption[aria-hidden=true]`; native caption softwrap
also changes. The complete before/after caption HTML and exact normalized DOM
delta are enumerated in `BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-mechanical-r6.json`.
After only those permitted normalization adjustments, the entire DOM is equal.
No template, shared print helper, sanitizer, pipeline or validator was patched.
The three existing good alt occurrences, including worked-example repeats,
and all six other SVG titles retain their exact original wording.

Only the new ex5 attribute changes `target-answers.md`; its complete frozen
answer/caption wording remains exact. Target goals, wording, arithmetic,
point allocation2/2/3/4=11, model conditions and graph geometry are unchanged.
All protected §211/§213 material, prerequisite hashes, §212 canonical
review/quality/handoff, plans, registry and authority/hold records remain exact.
Historical R5 sources, proof manifests and page evidence were not overwritten.

## Reproducibility and observed rendering

Full native R6 build and separate native print-only rebuild both passed.
R6 proof names use the accepted native output-hash shape and retain PENDING
inspection fields; builder observations are held separately.

| Edition | Pages | PDF SHA-256, identical to R5 | ZIP members |
|---|---:|---|---:|
| paragraaf | 14 | e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2 | 19 |
| opgaven | 7 | 94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a | 11 |
| antwoorden | 6 | 07a75d7b5b69344d38d5da9e5f2e0a3b964d86cc64c383b37809f8263fb33192 | 9 |

All27 R6 page PNGs are byte-identical to R5. All11 SVGs reproduce through
native CairoSVG into PNGs byte-identical to R5, with maximum RGBA channel
difference exactly0. SVG source equality permits only the five title changes.
All ZIPs have the exact required member sets, no duplicate or CRC error, and
every member equals its current file. Member bytes differ from R5 only for
MD/HTML and the five changed SVGs when referenced. PDFs and all PNG members
are unchanged. The print-only pass reproduced all3 MD/HTML/PDF/ZIP hashes.

I personally opened all27 full pages, all11 standalone PNGs and three own
native grayscale page captures. Exact paths, hashes and distinct observations
are in `BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-builder-inspection-r6.json`
(SHA-256 `8304929cb947fbddc86956766f9822252b1a6929d9d6fee2d348699ec8b3ef81`).
All body/table/caption/footer text is at least12pt; the smallest placed figure
text is12.548pt in the two-scale bonus. No new visible defect was observed.
Grayscale p5 theory, p7 exercises and p5 answers retain readable dashed TK,
solid TO, intersection/zone labels and applicable vertical-gap annotations.

The historical recap model/range reminder flag remains unchanged and is not
silently closed. Timing54/67/77minutes remains an unobserved design estimate.
No claim of classroom timing, independent approval or full-book acceptance.

## Gates and bounded negative regression

Existing10 source tests and native render tests passed before and after.
The new five-test metadata suite retained original failing metadata as fixed
negative fixtures. Before correction four tests failed as expected; the old
length-fixture test passed. After correction all five pass. Exact immutable-base
source and generator transformation tests prohibit collateral source edits.

Actual normal Part A `student-web` and `publisher-print` checks both pass.
Structural and approved paragraph-production currentness, durable authority,
and the active sprint bundle pass. The full command stdout/stderr and expected
negative-test failure are retained in the unique command-log JSONL/Markdown.
Committed-range classification and final publication are recorded separately
after payload commits; no uncommitted-range result substitutes for that gate.

## Execution corrections and boundaries

A supplemental inspection serializer initially assumed a nonexistent
`page_count` key and exited with KeyError before writing any artifact. It was
corrected to count the native `rendered_pages` list, then succeeded. Neither
native proof nor acceptance fields changed. One read-only safety invocation
used unsupported `--cwd`; the corrected invocation runs the existing checker
from the lesson worktree. A few read-only path/search probes failed (including
`specs/2.1.2-plan.md` and a leading-hyphen rg pattern); corrected reads followed.
No production build/check failed, no guard was relaxed, and no historical proof
was overwritten to conceal a failure. No lock override, reset, restore,
destructive deletion, PR creation or merge was performed.

Next: publish the clean paired branch and exact committed-range evidence, then
root assigns independent paragraph review and distinct specialist QC before
any canonical evidence promotion or prerequisite repinning.

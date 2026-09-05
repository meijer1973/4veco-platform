# §2.1.1 R4 metadata correction — builder evidence, not acceptance

Builder: paragraph_211_alt_builder. Date: 2026-09-05.
Authority and exact paired bases are in the preceding implementation plan.
The candidate is ready for distinct paragraph review and specialist QC; both
remain PENDING. No owner decision, aggregate acceptance or merge is asserted.

## Exact source correction

Only two authored student-source lines changed. `211/exercises.md` now adds
native Pandoc `{alt="Totalen en gemiddelden bij 100 en 200 reparaties met dezelfde constante maandkosten"}`
to the bicycle worked image. This is an 83-character functional noun phrase.
The full visible caption remains exactly:

> Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.

`b2_211.py` changes only fig_3's accessible metadata title to
`TVK en daarna TK toegevoegd op dezelfde schalen` (47 characters). The drawing,
visible titles, axis coordinates, labels, scale and all geometry are unchanged.
No other source line, shared print helper, stylesheet or sanitizer changed.

The two new regression tests preserve all eleven original tests. Before edits,
the new tests failed on exactly the old caption-without-short-alt and old
adverb-first title; the old eleven passed. Final source suite: 13/13 pass.
The actual native HTML old alternative was separately measured at 122 characters.

### Actual six-image accessibility audit

| Asset | Actual HTML alt characters | SVG accessible-title characters | Noun-first description |
|---|---:|---:|---|
| fig_1 | 80 | 52 | Figuur 3 / Totale kosten |
| fig_2 | 67 | 24 | Figuur 1 / TCK |
| fig_3 | 84 | 47 | Figuur 2 / TVK |
| fig_4 | 95 | 50 | Figuur 4 / GCK |
| we_1 | 83 (formerly 122) | 60 | Totalen en gemiddelden |
| ex_1 | 91 | 64 | De huurregel / Huur |

The worked and guided images recur unchanged in the exercise edition. The
answer edition has no images. Complete strings, captions and asset hashes are
in `BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-audit-r4.json`.

### Exact native DOM delta

In each student HTML edition, only we_1's `img.alt` value changes and its
`figcaption` loses `aria-hidden="true"`. Pandoc 3.9 naturally exposes the
non-duplicate caption alongside the new short alternative. Caption text-node
soft wrapping changes from line endings after `wordt` and `houden` to line
endings after `reparaties` and `verschillende`. No caption word or punctuation
changes. Every other DOM attribute and normalized text node matches the base,
including the entire visible document body, all other captions, image data,
CSS and dimensions. Answers HTML is byte-identical.

No postprocessor patched those native changes. The regression initially failed
because it compared unnormalized soft wrapping; the test was corrected to
collapse whitespace only. That failed run remains in the command log.

## Native build, reproducibility and immutable proof binding

The build used explicit `C:/Python314/python.exe` with inherited PATH; no MSYS
PATH prefix or alternative native rendering stack was installed. The unchanged
native rN guard accepted unused `r4`; there were no pre-existing r4 directories.
The native generator produced all six SVG/PNG pairs and three MD/HTML/PDF editions.
A second full build and three native `build_document` print-only rebuilds were
identical across every MD/HTML/PDF/asset hash. No invented CLI flag was used.

| Edition | Current Markdown SHA-256 | Current HTML SHA-256 | Unchanged PDF SHA-256 | Pages |
|---|---|---|---|---:|
| paragraaf | de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5 | 10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b | 9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0 | 15 |
| opgaven | bacccc1c9b063c4c786f2749d31993d94eb671fdc5bf0a899fb123d89bc0558b | 9e27b80089dee95fa4ac61a3f07baaf95ff3650518943a730db122befec2a6f8 | 97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953 | 9 |
| antwoorden | 57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb | d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca | ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a | 7 |

Native directories under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`:

| Directory | Immutable manifest SHA-256 |
|---|---|
| 211-paragraaf-9837e3a85f31-r4 | ddbc1f71ed9e136ad23d3bc4a1feda808b2d8a9db09504a4769f26f47bc16bec |
| 211-opgaven-97329415bacc-r4 | cfd31c4e2c9646c2e6d6b36ddde0b707bb95f09581b01964b5e3da164f1b4b05 |
| 211-antwoorden-ffdf0905a980-r4 | b9b2878ec7c38762186ba9664c86bd5805fa9a1c7a1f2d6de19910bf00e84d50 |

Every one of 31 page PNGs is byte-identical and pixel-identical to its R3
counterpart; zero changed pixels. Six generated PNGs are likewise byte/pixel
identical. Removing only SVG `<title>` metadata leaves all six drawing byte
streams identical. Five SVG files are completely identical; fig_3's new hash
is a5a2e464a51461f78f1b98056520c5b3a32e9baef577424f405b64c4790326eb.
Native proof manifests remain truthfully PENDING and have not been overwritten
with builder acceptance. R3 proof/history files remain untouched.

## Personal full-page and figure inspection

I personally opened every final R4 full page at original 150-dpi reading scale,
not just contact sheets, and separately opened all six full-color raster
figures plus their six grayscale views. These are builder observations only.

| Edition/page | Concrete visual observations |
|---|---|
| Paragraph 1 | Four goals, prior-arithmetic bridge and both definitions legible; footer clear. |
| Paragraph 2 | Cost formulas and totals table intact; no equation/cell clipping. |
| Paragraph 3 | TCK-only graph, range 40–80 and nearby panel instructions intact. |
| Paragraph 4 | Both equal-scale TVK/TK panels readable; caption and GCK definition intact. |
| Paragraph 5 | Total-to-average map, positive-Q condition and numeric table readable. |
| Paragraph 6 | Three average changes and model limits remain visually clear. |
| Paragraph 7 | Worked steps 1–4 and classification table fit without clipping. |
| Paragraph 8 | Bicycle figure and ENTIRE original caption visible; step 5 and recap intact. |
| Paragraph 9 | Brief Start route and neutral optional-support text intact. |
| Paragraph 10 | Badge figure, partial classification scaffold and totals table usable. |
| Paragraph 11 | Average scaffold and faded bookmark exercise intact. |
| Paragraph 12 | Complete contract-comparison exercise grouped together. |
| Paragraph 13 | Independent sticker table blank; all a–e prompts intact. |
| Paragraph 14 | Frozen target complete on one page; eight student cells blank; 4/3/3/3/4 points. |
| Paragraph 15 | Bonus and accessible closing task intact; no new theory. |
| Exercises 1 | Worked classification/functions/first quantity intact. |
| Exercises 2 | Second quantity, bicycle figure, full caption and bounded explanation intact. |
| Exercises 3 | Recap, Start tasks and optional-support heading/skip instruction legible. |
| Exercises 4 | Badge figure/table with working blanks and prompts intact. |
| Exercises 5 | Both badge tables and bookmark task intact. |
| Exercises 6 | Contract comparison a–d intact. |
| Exercises 7 | Independent sticker task and blank cells intact. |
| Exercises 8 | Complete bakery target remains unfilled and 17 points. |
| Exercises 9 | Bonus and closing task intact. |
| Answers 1 | Retrieval, units, classification and corrected `extra badge` wording readable. |
| Answers 2 | Badge tables and bookmark explanations readable. |
| Answers 3 | Contract effects and sticker classification table intact. |
| Answers 4 | Sticker averages and bakery classification/functions intact. |
| Answers 5 | Bakery averages, bounded causal answer and scoring introduction intact. |
| Answers 6 | 17-point rubric, fair marking guidance and bonus calculations intact. |
| Answers 7 | Bonus limitation and cumulative-budget explanation intact. |

All six figures retain their original geometry and readable labels in color
and grayscale. Fig_2/fig_3 distinguish TCK/TVK/TK by labeled values and
dash/solid patterns; fig_1 shows each matching numerator and Q; fig_4 separates
the three average changes; we_1 keeps euro/month versus euro/repair; ex_1 keeps
the worked rent classification and division cue. There is no newly introduced
clipping, overlap, glyph damage, missing figure or unexpected visible change.
Historical orange-stroke contrast remains a bounded follow-up, not blanket
WCAG conformance. No classroom timing was observed.

Measured body/table/footer minimum is 12.0 pt in all three actual PDFs. Every
figure is placed 470.55118125 pt wide. Actual minimum placed label sizes:
fig_1 14.377953 pt; fig_2/fig_3 13.724409 pt; fig_4 13.070866 pt;
we_1/ex_1 13.724409 pt. No aspect ratio changed.

## Gates, preserved evidence and exclusions

The normal student-web and publisher-print Part A profiles pass. Scoped
approved paragraph_production currentness, durable twelve-record authority,
existing render checker, source tests and active sprint bundle pass. Validator
recognition of historical review files is NOT new independent approval.

Twenty protected lesson plan/review/QC/handoff/adjacent prerequisite files
were byte-compared to the exact lesson base. Canonical §2.1.1 hashes remain:
review 92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96;
quality-ref 0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18;
handoff 724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8.
The four goals, a–e prompts/answers, 17 points, twelve frozen records, Ei
semantics, plans, holds and §2.1.2/§2.1.3 prerequisite pins remain unchanged.

The existing `opgaven.zip` is an inherited historical archive, not a native
§2.1.1 builder output: neither generator nor thin entrypoint implements ZIP
creation. It contains answer/review files and only the fig_1 pair. It remains
untouched and is explicitly excluded from current student deliverables.
SHA-256 bb951635865a5e7e321f562ef73c640c84948f99441385f217cf366d9e3e996d.
Root was informed; archive repair would require a separate scoped decision.

Failures retained: two expected old-negative source failures; one test-only
softwrap assertion failure; one verifier default-Windows-encoding path failure
(corrected by explicitly reading UTF-8). An initial patch failed verification
without editing either source; the corrected exact-line patch succeeded. No
failed check was converted into a pass or removed from command history.

Actual-base committed scope results and publication identities follow in a
separate tail after payload commits. Distinct review/QC and root's later
canonical successor/pin update remain required. No further PR merge authorized.

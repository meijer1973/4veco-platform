# §223 B223-ALT-01 author correction candidate

Date: 2026-09-06. Actual actor paragraph_231_specialist_qc; role
223metadataauthor. Result: exact metadata correction verified by its author,
awaiting a different independent delta/paragraph reviewer and specialist renewal.
This is not a new QC verdict, root validation, acceptance or handoff.

## Exact permitted change

Published input pair: platform e4fc984c9cb28c6f03d0f3040136af73315ca916 /
lessons 6663532621e1347c12f691862ee85200665ad14f. Operational plan commit
4592685f precedes every source edit. Owned branch in both repositories is
agent/book2-223-alt-correction-20260906.

Only theory.md:84 and exercises.md:63 receive native Pandoc alt attributes.
Their complete image captions and asset paths are unchanged. The shared print
pipeline and b2_223.py generator are byte-exact; no generated HTML was hand edited.
The existing §211/§212 native attribute pattern was verified through actual Pandoc.

| Figure | Exact short alternative | Characters |
|---|---|---|
| 2 | Ei-schaal: inferieur bij Ei<0, normaal bij 0<Ei<1 en luxe bij Ei>1; open grenspunten 0 en 1 zonder categorie. | 109 |
| 4 | Drie scenario's: beginsituatie, alleen hoger inkomen en terug naar dezelfde basis voor alleen een hogere andere prijs. | 118 |

Actual native paragraph HTML lines 214/493 and exercise HTML line 192 now contain
these functional noun-first descriptions. Pandoc also removes aria-hidden from
the now-distinct full captions and rewraps their HTML line whitespace. Complete
visible caption words remain exact. The whole original HTML first reproduces
from immutable input Markdown through the unchanged pipeline; the whole candidate
then reproduces from that fixed Markdown plus only the exact attributes. A separate
DOM comparison permits only the three named image alternatives and their caption
metadata/line whitespace. No other HTML element, text or embedded image changes.

Only six lesson files change: paragraaf/opgaven MD, HTML and ZIP. The entire
antwoorden edition, all three PDFs, four SVG/PNG pairs, native wrapper, plans,
original paragraph review and original QC are unchanged. There is no handoff.

## Complete-byte fail-closed guards

Each expected source file starts with all original bytes from immutable platform
3510fc4dd30c9c01f44111ecc022ae239e855758. One unique exact original image-line
literal is replaced with the same line plus its fixed attribute. Missing, duplicate
or already-transformed anchors fail. Every other source byte remains required.
The existing generator guard still derives only the four published §221 hash
literals from that same immutable whole generator; no generator edit was needed.

The successor controller changes only by one fixed literal insertion and two
fixed call replacements. The added test_alt_metadata.py independently derives
the whole controller from the exact QC platform input and those three operations.
The original seven test_source.py tests remain byte-exact. The new regression file
is an added candidate requiring independent review, not a self-certified authority.
The complete source/controller Git patch and whole-file raw hashes are recorded in
BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-complete-source-delta.json.

| Complete authored/guard file | Raw SHA-256 |
|---|---|
| theory.md | c1a1b83d46295ee4d80d32485b0e3912c57bba04a7b9f63dd82a99cbfe102999 |
| exercises.md | d127349412f8020ce971714f313d452af1f28204f2a195fb63efd6edaaee817b |
| test_successor.py | f2c3cb4773b6730a58d3720699202f80d8b5f8b22a779b2b8cddf664b491d927 |
| test_alt_metadata.py | 314673ab7bf6652d1ba6c1c42ef6f10598ffead34d12785009c5ab77b0187f3d |

All 22 tests pass: seven original, seven succession and eight new metadata tests.
Negative cases reject original bad alternatives, empty/long/imperative alternatives,
caption drift, unrelated generator/source/original-test/controller mutations and
bad derivation anchors. Twelve real-filesystem missing/forged prerequisite cases
use the actual LF hash implementation and fail before any authority subprocess,
source generation, write or render. Four accepted §221 pins and both plan pins
remain exact to published lesson Git bytes.

## Native verification and personal inspection

All registered worktrees in both repositories were scanned recursively for standard,
nested sprint proof and reservation history. Existing r18 was the highest consumed
revision. Fresh r19 full, r20 thin and r21 direct print were each reserved and
announced before execution. Each native call used explicit C:/Python314/python.exe
and an MSYS-first child PATH; no global runtime change, restore or proof overwrite.
The PDF skill artifact marker succeeded immediately before the first PDF rebuild.

| Native output | Pages | Unchanged complete PDF SHA-256 |
|---|---:|---|
| paragraaf | 15 | ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb |
| opgaven | 10 | 50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80 |
| antwoorden | 7 | 30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10 |

Each of the three builds passes full 20-native-file/25-folder-file accounting,
32 raw rendered-page byte and decoded-pixel comparisons to QC r14, four native
SVG/PNG byte and PNG-pixel comparisons and safe unique ZIP checks. ZIP member
counts stay 11/5/3, membership order stays exact, CRCs pass and every member equals
its native file. Only permitted MD/HTML member bytes differ; no PDF/asset differs.
All 32 fresh grayscale pages and four grayscale figures also match original QC
raw bytes exactly. New supplemental grayscale is under the supported sprint path.

I personally viewed all 32 r19 color pages and all four native color figures.
I additionally viewed paragraph pages 3/8, exercise page 2 and native figures 2/4
in grayscale. The exact individual observations and proof hashes are bound in
the personal-inspection JSON; no other personal grayscale view is claimed.
No printed defect was found. The complete captions, open 0/1 boundaries and
three isolated/reset scenarios remain legible. This is author verification only.

The actual existing checker ran with --rebuild and passed: 12pt minimum text,
14.117pt minimum placed figure labels, expected page maps and all proof hashes.
Student-web and publisher-print Part A validators, approved paragraph-production
currentness, durable authority, complete sprint bundle and governance freshness
passed. Those ordinary validators do not renew the original QC or root acceptance.

## Custody, limits and next gate

All 721 pre-existing §223 report/proof/evidence files remain byte-exact, including
original r5 and r17 failure diagnostics, earlier native command whitespace,
reservations and PENDING inspection manifests. All nine new proof manifests also
remain PENDING with no fabricated reviewer inspection completion. The original
paragraph review remains exact; canonical QC remains its original REVISE at raw
6d93128f5cdcd363fc4a7e5a6e5d462162f130a18f4f01fd4656be22ef9e2586.

Target/goals/16 points, strict Ei categories with unlabelled 0/1 boundaries, annual
income, reset baseline, bonus and 54/69/81-minute routes are unchanged. Classroom
timing remains UNOBSERVED. Independent delta review and specialist renewal remain
PENDING, as do root_validation/root_acceptance/handoff_renewal; production_ready is
false. No current full CI, Part B, whole-book readiness, Inspectie or merge claim.

Publish strict owned and genuine incremental/complete native scope results with
their actual exits, then commit the four explicitly paired generated indexes as
the terminal tail. Normal push and clean exact remote equality precede root handoff.
Root assigns the distinct independent reviewers before any acceptance decision.

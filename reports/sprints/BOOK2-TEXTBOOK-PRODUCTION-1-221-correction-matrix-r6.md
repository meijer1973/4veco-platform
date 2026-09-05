# §2.2.1 R6 — bounded reviewer corrections

Date: 2026-09-05. Builder: paragraph_221_builder. This records corrections and
builder inspection only; independent round-2 review and final QC remain pending.
No acceptance, quality-ref, handoff, PR or merge decision is supplied here.

## Authorization and preflight

The independent reviewer inspected all 20 R5 pages and re-solved the operation
chain without an economic, target or rendered defect. The coordinator then
authorized the following two bounded source corrections before final QC.
Starting heads: platform `5ab950112d2e0f369b0cbe314d1947877272a56d`;
lessons `71286d417d922f5470bf663fd866df39bed8b6f0`.
Both worktrees were clean, on their claimed `agent/book2-221-production-20260905`
branches, owned by paragraph_221_builder / BOOK2-TEXTBOOK-PRODUCTION-1-221.
Paired fetch/prune, clean claim checks, governance freshness, approved
`paragraph_production 2.2.1` currentness and durable twelve-record authority all
passed before edits. Governance origin/main remained
`96416b6b5bd57094576e9aba0a42d682584ec479`, with no differing policy.

## Correction matrix

| Requested correction | Bounded source change | Actual printed evidence |
|---|---|---|
| Compact wrong-versus-correct misconception box, keeping the correct sign/magnitude explanation | In `221/theory.md`, immediately after the absolute-value explanation, a three-line warning contrasts the false “−2 < 1, so inelastic” argument with `|−2| = 2 > 1`, and states that the minus sign gives opposite directions. Existing explanation remains intact. | R6 paragraaf page 3: three printed lines in one legible box, beside the triggering concept. |
| Recoverable sign meaning and formula conditions within the existing maximum-five-point recap | In `221/exercises.md`, recap point 1 adds positive old P/Qv and a nonzero price change; point 2 makes negative Ev's opposite directions explicit. Points 3–5, the five-point total, placement and §222 forward link are preserved. | R6 paragraaf page 5 and opgaven page 2: complete five-point recap stays together and remains readable. |

The two changes re-express already taught content; they add no exercise,
operation, example, target hint, formula or point. The original 48.5-minute
component estimate retains its 6.5-minute question allowance; the compact
warning belongs within the existing 10-minute instruction segment and the
recap within the existing 3-minute summary/transition segment. This is not an
observed classroom timing claim. Optional support still adds 10 minutes.

The focused source test now checks both corrections explicitly. The actual
render check defaults to the new R6 build manifest so it cannot accidentally
read a historical R5 build as current. No builder or shared helper changed.

## Fresh surface and provenance checks

Ten source/target/calculation/geometry tests pass. Approved §221 currentness and
durable target authority pass again during generation. Actual HTML/PDF checks,
all source/asset/page hashes, image aspect ratios, literal target letters and
points, and byte-identical MD/HTML/PDF/asset rebuild pass. Text and footer minimum
is 12.000pt; minimum placed figure label remains 12.221pt. The exact frozen
target, its short answers, all calculations, all paired assets and all answers
are unchanged.

| Edition | Pages | Final PDF SHA-256 | R6 proof directory |
|---|---:|---|---|
| paragraaf | 10 | `aafd07e6bb88dcb8833569f2c4d01809d6fcdc0f879d0c7a39c810dfabdbc440` | `221-paragraaf-aafd07e6bb88-r6` |
| opgaven | 6 | `e9def67106ce56f06ff5247bb3d56fe17dcd4297e65ab95ba6942453759761ee` | `221-opgaven-e9def67106ce-r6` |
| antwoorden | 4 | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` | `221-antwoorden-d4a7c139d492-r6` |

Proof directories are under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.
Exact source, HTML and asset hashes: `BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r6.json`.
Mechanical results: `BOOK2-TEXTBOOK-PRODUCTION-1-221-render-check-r6.json`.
Per-page inspection/transfer and both revision manifest pins:
`BOOK2-TEXTBOOK-PRODUCTION-1-221-builder-inspection-r6.json`.

The builder individually opened all four changed 150dpi full-page PNGs at normal
reading scale: paragraaf 3–5 and opgaven 2. No clipping, overlap, broken glyph,
split recap, missing figure or unreadable label was observed. Paragraph page 4
was also inspected because preceding text reflowed onto it. The other 16 pages
transfer only by exact PNG hash from the actual R5 inspection: paragraaf 1–2
and 6–10, opgaven 1 and 3–6, all four answer pages. Each transfer records the
matching old/new hash, old proof path and old manifest hash. Contact sheets
were not substituted for page inspection.

All R5 proof directories, manifests, build/report records and the R5 inspection
remain byte-for-byte unchanged as immutable history. R6 uses separate proof and
report files, with LF JSON. Generated R6 manifests remain **PENDING** with no
fabricated independent inspection or review fields. Root/chapter/paragraph
plans, target registry, outline, historical approvals, machine/external sources,
Book1, PartB, shared helpers and indexes are untouched. Round-2 review and final
specialist QC must bind to the published corrective heads, not infer acceptance
from this builder's checks.

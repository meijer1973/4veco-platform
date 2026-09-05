# §2.2.2 R12 — root candidate verification

Date: 2026-09-05. Accountable integrator: codex-root.
Status: adopted candidate; **independent paragraph review and specialist QC
remain pending**. Historical lesson review/quality files are not R12 acceptance.

## Exact adoption and output

Published builder platform `960c9c8973061cae5ef1403e41f3f75c319ad816` has an index
tail, not imported. Source/evidence commits `a3c23653`, `4c9b0cf2`, `c2ed7adf`,
`b62df758` were cherry-picked as `2dc722ca`, `54583422`, `6ce0e713`, and
`3d7ab0bde1eeaca7807b174bf2816ffb87024568`. Lessons `c50bdda` and
`4b2be1d4a3443705cbaa53600b16ae95316e0c18` were adopted as `a305bea` and
`1dbdb0b30643c3a0c217fcd1c41de419a6ff4ee5`. No manual conflict resolution or
source modification occurred. Earlier generation experiments remain history;
only R12 is the current candidate.

| Edition | Pages | Exact current PDF SHA-256 |
|---|---:|---|
| paragraaf | 10 | 36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c |
| opgaven | 6 | 0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555 |
| antwoorden | 5 | b68d0429a9d739d0587f7a1c95ca922e188061b4821920b1d0f6459766adc6ab |

## Root visual coverage and three corrected tokens

Root personally inspected all 21 full R8 page images before the notation
finding. After the R12 freeze, root rehashed every old/final page in
`BOOK2-TEXTBOOK-PRODUCTION-1-222-r8-r12-page-transition.json`: exactly 19 pages
are byte-identical and only answers pages 1 and 4 differ. These two full R12
pages were then personally viewed at readable size:

- Page 1: `42d2e22c04f6864fad0cf26c72afa70b4b175adfd4828a80882c475d31497131`.
- Page 4: `3969896065943f5d6ff82d4b05fd81ea0acb87fb747a0ce602c907d558034bf8`.

All three absolute-Ev tokens are intact; no new isolated word, clipping,
collision, missing glyph or scoring defect was found. The generator adds
only three supported structural breaks to owned explanations, with explicit
single-anchor checks. No authored words, frozen short answers, student files,
assets or shared CSS/sanitizer changed in the correction. The source test
exercises the unchanged sanitizer; the render checker rejects split tokens.
This final coverage transfers root's own observations, not another agent's:
19 exact R8 page bytes plus two directly viewed changed R12 pages. Immutable
R12 generation manifests and all 21 page hashes remain unchanged and PENDING.

Root also personally viewed and rehashed the published grayscale full-page
probes for paragraph pages 3 and 6:
`6b6036c03b586210c9df7cd517d05db4bf513fcc0acf51438fcc5c206a63ac6d` and
`4bfb284dfd0bae936370dcf71ca9fde199876b56cbf56d07aacdb4247d0fd4be`.
They bind to the identical R8/R12 student PDF. Old dashed boundaries and new
filled revenue areas, common scales, units, labels and counterexample remain
readable without colour. All four figures were also viewed in their actual
full-colour R8 placements, unchanged in R12.

## Actual source and reproduction checks

Root read all four authored sources, final generator, source/render tests,
stage-2 release, final builder packet and transition map. Eleven source tests
passed. The R12 root render checker passed current source/HTML/PDF/asset/page
freshness, frozen goals/context/prompts/11points/short answers, same exercise
HTML in both editions, supported markup and glyph/type-size checks. Actual
body/table/footer minimum is 12pt; smallest placed figure label is 14.378pt.

The first root rebuild incorrectly applied the MSYS-first PATH needed by §223
to §222. Rendering completed but exact HTML parity failed because PNG runtime
bytes differed. That failed command remains in the append-only log; it did not
produce a passing report. The retry used this host's unchanged default process
PATH and explicit `C:/Python314/python.exe`. The complete generator reproduced
R12, then a second full-generator run inside `check_render.py --rebuild`
again passed exact bytes. Lesson status returned clean through generation,
not a manual restore. Immutable build/proof records were not overwritten.

Root evidence:

- `BOOK2-TEXTBOOK-PRODUCTION-1-222-root-rebuild-r12.json`, raw SHA-256
  `db6bf014fd953aabbb04558aeead59e1c80155c57a2c74e4c9687519b4e40c4c`.
- `BOOK2-TEXTBOOK-PRODUCTION-1-222-root-render-check-r12.json`, raw SHA-256
  `81a2b9a4990c3209687c36b57c48a22d1ddd87744bb25f5ebb0b5314c65b15cf`.

Both actual Part A profiles passed; inherited review/quality presence is
excluded from fresh acceptance. Scoped approved-use/durable target checks
ran successfully within each full rebuild. Committed platform delta from
`33e6310d` passed shared scope (seven source/tool files, 358 historical/current
evidence files); lesson delta from `1146bd0` passed textbook scope (18 files).
No lane exception or shared-helper/plan/authority mutation occurred.

## Economic and workload boundaries

All 15 matched old/new revenue contexts and percentage/elasticity calculations
were checked. The local rule is sufficiently small and near one reference
price with other conditions fixed; a finite interval class does not prove the
classification at all intervening prices. Concert, photoclub and fresh
benefiet counterexamples preserve product-factor checks. No arbitrary 10%
cutoff, percentage addition, invented demand curve or revenue-as-profit
inference was found. Nova gives 5000→5040,+0.8% per week; Stream gives
20000→17600,−12% per month. Four goals and six parts retain 2/2/2/2/2/1.

The printed route contains prerequisite retrieval, both worked cases,
guided completion→uncued contrast and fresh independent calculation/critique.
The local Ev/TO machine-unit gap remains explicit; D25 is not promoted.
Core51.5, core+support66.5 and everything79.5 minutes remain estimates, not
classroom observations. Numeric timing is absent from student files.

Unlike §223, §222 does not hardcode current §221 review/handoff bytes at
runtime. Stage-2 R6 prerequisite pins remain honest; the final root handoff
must connect the accepted R7 successor without rewriting that history.
Distinct review/QC and root acceptance/inventory updates are still required.
No PR, final-head remote CI or merge authorization is claimed here.

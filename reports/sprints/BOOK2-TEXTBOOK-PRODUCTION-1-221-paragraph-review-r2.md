# §2.2.1 independent paragraph review — round 2

Date: 2026-09-05, reviewer completion 15:50 UTC.
Independent reviewer: `paragraph_221_review`; recorded by `codex-root` from
the reviewer's actual returned decision, not a coordinator self-review.
Verdict: **PASS WITH FLAGS**. No corrective work remains from this paragraph
review. Separate specialist QC, current lane records and handoff remain required.

## Exact reviewed identity

- Platform: `a5f6c163725a988bff76dcba14254e67d725a169`.
- Lessons: `7523d9c2dc89ada2f736ddcb199118dd5f69270a`.
- Both published, clean, exactly one corrective commit above the R5 pair.
- Authored R5 source/proof is in `5ab950112d2e0f369b0cbe314d1947877272a56d`;
  `e758d06` was baseline evidence only.
- Approved plan LF SHA-256:
  `29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345`.

## Findings and resolution

| Finding | Actual round-2 decision |
|---|---|
| 221-R1-01 | Resolved. `221/theory.md:82` and paragraph p3 now contain a visually distinct wrong/correct warning contrasting `−2 < 1` with `abs(−2) = 2 > 1`, preserving the directional minus sign. |
| 221-R1-02 | Resolved. `221/exercises.md:37` retains five recap points and restores positive old bases, nonzero price change, dimensionless ratio and negative-sign meaning. Classification, bounded interpretation and the §2.2.2 connection remain; recap stays together on paragraph p5 / exercises p2. |

Reviewer personally inspected paragraph pages 3, 4, 5 and exercises page 2
at normal full-page reading scale. No clipping, overlap, missing glyph,
unreadable label, stranded heading or question loss was observed. The shifted
paragraph-p4 continuation is coherent; worked example and recap are readable.

Reviewer independently recomputed all twenty R5 and twenty R6 page hashes
against their own actual round-1 inspection inventory. Precisely these four
pages changed; sixteen pages are exact-hash transfers from that reviewer's
individual R1 inspection, not from builder inspection. The R1 calculations,
target coverage, scaffolding, scope and Dutch-wording conclusions remain valid.
Plans, frozen targets, quantities, questions, answer models, points, figures
and shared renderer did not change. R5 historical evidence remains unchanged.

## Retained flag and executed checks

Observation-dependent timing/attainment flag only: 48.5 minutes is an authored
core estimate, not observed pacing or demonstrated attainment. The optional
guided route adds ten minutes outside the core. Classroom observation is still
required; added support must not silently be counted inside the same lesson.

Reviewer actually reran ten source tests (PASS, 0.011s), explicit R6-manifest
render checking (PASS), approved-use currentness for specialist_review and
paragraph_production (both PASS), and durable authority (all twelve records
PASS). All nine final document hashes and twenty page hashes were recomputed.
Printed body/footer minimum is 12pt; placed figure-label minimum 12.221pt.
Reviewer did not rebuild, run the full repository suite or check remote CI in
this round. Both worktrees remained clean; no files were changed.

## Exact evidence bindings

All SHA-256 values below are raw bytes, except the expressly labelled plan LF hash.
Source and HTML pins, all input/asset pins are bound by
`BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r6.json`, raw SHA-256
`8070b5774424bac7e63438ca107dac41d7e4867777c24e766a0002c0628c9a9b`.

| Edition | Pages | PDF SHA-256 |
|---|---:|---|
| paragraaf | 10 | `aafd07e6bb88dcb8833569f2c4d01809d6fcdc0f879d0c7a39c810dfabdbc440` |
| opgaven | 6 | `e9def67106ce56f06ff5247bb3d56fe17dcd4297e65ab95ba6942453759761ee` |
| antwoorden | 4 | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` |

Proof directory prefix: `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.
Each exact manifest binds every page hash and contact sheet; review covers every
listed page by direct R2 inspection or verified transfer as stated above.

| Directory | Raw manifest SHA-256 |
|---|---|
| 221-paragraaf-aafd07e6bb88-r6 | `808bd3f0757c4a314aa347c814b1ad2baf94ae898563eae170944286463603c4` |
| 221-opgaven-e9def67106ce-r6 | `6bd485ed3d2e7b31743893f6e07fce37067d216cad3cffda32d05321e400e0ca` |
| 221-antwoorden-d4a7c139d492-r6 | `2099a348798eb7724dea7823ba2ba889a6a97ddbb1b2a9cb9520fc46310cc217` |

Original R5 transfer manifest raw pins: paragraph
`1df854936ff152e58ab27cf64888ab38d252b68a212048aac1b7cc0e8aaf6d06`,
exercises `a4a7cfd586710aa21d40d12780e48a0fe9b7839cfa783b537231066706824ba6`,
answers `7b2973e1c87930b9f7a2105752328ea2f056546fbe8d3213b61025a7474d15c1`.
The actual R1 decision remains in the earlier round-one report.

R6 supporting report raw pins: builder-inspection
`22eadf959450da388f245d1aa75aac84b214d74740bd015e90f8e29166790027`,
correction-matrix `21954d1dbe33d3998baee12c8175e43e616bc63139749e835bc8e856345c3b11`,
render-check `21a66961d8c4128c654db4a25d02ea0d417263e9f1120f82c610e8eb56c90de4`.
Generated proof manifests remain honestly PENDING, with no fabricated inspection
records. This decision is not final handoff, merge approval, PR readiness, or a
substitute for specialist QC. Next: complete separate specialist QC.

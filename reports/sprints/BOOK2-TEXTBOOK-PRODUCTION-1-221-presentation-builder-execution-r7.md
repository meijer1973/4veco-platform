# §2.2.1 R7 bounded correction — builder evidence

Date: 2026-09-05. Builder: paragraph_221_presentation_builder.
Finding B2-TIME-PRINT-01. Status: **candidate ready for independent recheck**;
not independent paragraph acceptance, specialist QC, handoff or finding closure.
Preimplementation plan: `BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-builder-plan.md`.
Published governing correction plan and exact task bases are pinned there.

## Actual content correction matrix

Only `build-scripts/content/book-2/221/exercises.md` changes authored content.
The exact-six replacement probe proves byte-for-byte equality to the old source
after only those replacements. Both generated pupil Markdown editions pass the
same exact transformation test. No source/test/generator/layout enhancement is
bundled. The pupil output contract, not an altered lesson-time estimate, drives
this change.

| Passage | Actual correction | Current page: paragraph / exercises |
|---|---|---|
| Start estimate 5½ minutes | Remove estimate; retain check/feedback/repair advice | 6 / 2 |
| Guided estimate ten minutes | Remove estimate; kern becomes korte route; retain continuation/homework and neutral skip | 7 / 3 |
| Independent estimate eleven minutes | Instruction ends at conclusie; full task unchanged | 8 / 4 |
| Target estimate nine minutes | Remove estimate; retain visible total9 and exact frozen target | 9 / 5 |
| Bonus estimate eight minutes | Remove estimate; kernroute becomes korte route | 10 / 6 |
| Closing estimate five minutes | Remove estimate including its second line; preserve homework and korte route | 10 / 6 |

Old exercise raw SHA-256:
e5b37d2b3171a24da7bef24c82695c9ac469632039f4c310a09162653698e562.
New: d94e8f00ca51e6c33792216f6f59d60e95e4cdbf5d4ef10f918d030ef719fa8b.
All seven other checked source/test files, six assets, plans, target registry,
outline/meta, owner grants and historical R6 review/quality/handoff are unchanged.
No §222/§223 path is edited; their accepted R6 prerequisite pins remain historical.

## Reproduction, exact payload and full-page observations

Existing `b2_221.py` and `print_pipeline.py` were used unchanged. All three
canonical Markdown/HTML/PDF editions were generated, then rebuilt byte-identically.
Answer MD/HTML/PDF and all assets remain byte-identical to R6. Only six lesson
files change: paragraph and exercises MD/HTML/PDF.

| Edition | Pages | Current PDF raw SHA-256 | Page PNGs changed from R6 |
|---|---:|---|---|
| paragraaf | 10 | 98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6 | 6–10 |
| opgaven | 6 | a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af | 2–6 |
| antwoorden | 4 | d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d | none |

New proof directories beneath `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`:
`221-paragraaf-98bf4923b4e3-r7`, `221-opgaven-a8119cc769c8-r7`,
`221-antwoorden-d4a7c139d492-r7`. Each contains fresh 150DPI page PNGs,
contact sheet and generation manifest. Manifests remain **PENDING**, with empty
pages_inspected and no invented acceptance or defect disposition.

I personally viewed all **20 current full pages**, not just contact sheets,
and all three PNG figures separately. No acceptance transfer was used, even
for the ten unchanged pages. I read the complete SVG-generating geometry and
checked every current SVG equals its generator source and all ten proportional
bar origins/widths. Builder observations found no clipping, overlap, missing
glyph, distorted figure, stranded heading or lost question. The dense independent
page (paragraph8/exercises4) keeps the complete final prompt above the footer.
All target prompts and 3/2/2/2 scoring remain together on paragraph9/exercises5;
all worked/recap/repair/fading content stays readable. This is builder inspection,
not a fresh independent teacher/student/quality verdict.

Exact source/asset/output/authority before-after hashes and all page PNG old/new
hashes plus individual observations:
`BOOK2-TEXTBOOK-PRODUCTION-1-221-builder-inspection-r7.json`.
Its reproducible bounded evidence script is
`BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-evidence-r7.py`.
This script is evidence generation only and supplies no automatic visual approval.
Build and mechanical evidence: `BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r7.json`
and `BOOK2-TEXTBOOK-PRODUCTION-1-221-render-check-r7.json`.

## Actual successful checks

All commands below were run in the builder's own platform worktree, exit0.

```text
C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py
C:/Python314/python.exe build-scripts/content/book-2/b2_221.py --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r7 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r7.json
C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r7.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-render-check-r7.json
C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-evidence-r7.py
node scripts/validate-paragraph.js --mode part-a --profile student-web <exact own §221 folder>
node scripts/validate-paragraph.js --mode part-a --profile publisher-print <exact own §221 folder>
node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1
node build-scripts/workflows/check-book2-target-authority-remediation.js --durable
git diff --check
git -C ../4veco-lessen diff --check
npm.cmd run check:agent-worktree-safety -- --check --task BOOK2-TEXTBOOK-PRODUCTION-1-221-PRESENTATION --agent paragraph_221_presentation_builder --require-prefix codex/,agent/
npm.cmd run check:agent-worktree-safety -- --check --worktree ../4veco-lessen --task BOOK2-TEXTBOOK-PRODUCTION-1-221-PRESENTATION --agent paragraph_221_presentation_builder --require-prefix codex/,agent/
git fetch --prune origin
git -C ../4veco-lessen fetch --prune origin
npm.cmd run check:governance-freshness
```

Ten unchanged source tests pass, including eight exact-rational Ev chains,
closing percentage reversal, frozen serialization/points/answers, numbering,
seven headings, recap and fading, table geometry and proportional asset checks.
The evidence script separately verifies all six replacements and no pupil
Richttijd/minuut/minuten/kernroute remains in MD/HTML/PDF. The render checker
verifies current source/asset/page hashes, target text in HTML and PDF, identical
exercise HTML, no active resources, all printed text including footer >=12pt,
minimum placed figure label12.221pt, and complete byte-identical rebuild.
Both normal Part A profiles pass. Their inherited R6 review/quality presence
is mechanical evidence only: those historical records do not approve R7.
Publisher-print also reports two legacy companion asset declarations; this is
not companion acceptance. No full repository suite or remote CI is claimed.

Actual paired git-diff and untracked-path scope checks passed, separately using
the existing classifier's `shared` scope for platform-hosted source/evidence
and `textbook` for lesson output, with zero unknown/companion paths and no
exception. Snapshot: `BOOK2-TEXTBOOK-PRODUCTION-1-221-paired-scope-r7.json`.
The operational production lane remains Part A; platform-hosted source is not
misrepresented as a lesson-repository file. Root already uses this paired split
in the published §212/§221 handoff adoption record.

## Honest failure/correction history

1. Preimplementation roadmap filename lookup failed; corrected via rg file
   discovery, as recorded in the preimplementation plan. Some long read outputs
   were truncated and reread in smaller full chunks before source editing.
2. First six-string PowerShell probe incorrectly searched the final passage
   using CRLF; source is LF. It found the first five and failed the sixth,
   exit1, with no mutation. LF-normalized rerun verified all six once each.
3. First paired scope API call combined platform source and lesson output under
   textbook, exit1: platform-hosted exercises.md is correctly classified shared.
   No source/tool/policy exception was added. After reading the classifier and
   existing root precedent, actual paired per-repository classifications passed.
4. An rg lookup passed Windows wildcard paths directly and reported os error123;
   rerun used directories with `-g 'BOOK2-TEXTBOOK-PRODUCTION-1*'` successfully.
5. First safety recheck omitted required --check mode, exit2; no state changed.
   Corrected explicit --check invocations passed for both own claimed worktrees.

No content, build, arithmetic, render, font, parity or normal profile failure
was concealed or resolved by weakening a check. No extra layout fix was needed.

## Remaining gates and publication boundary

Root assigns an independent paragraph recheck, followed by separate specialist
QC bound to this exact R7 payload. Builder does not modify canonical R6 reviews,
quality, handoff or downstream historical prerequisite pins, close B2-TIME-PRINT-01,
create a PR, merge anything, or claim final classroom/book acceptance.
Timing estimates remain 48.5 core,10 guided extra,8 bonus and5 closing (71.5 all);
actual pacing and attainment are unobserved. Part B and protected optional
Inspectie-reference refresh remain separate follow-ups. Root's already executed
41-PDF marker is not repeated; final PDF delivery/citations belong to root.
Next: publish normal clean paired candidate commits and deterministic map/index
tail, report exact pushed heads to root, then stop for the independent gates.

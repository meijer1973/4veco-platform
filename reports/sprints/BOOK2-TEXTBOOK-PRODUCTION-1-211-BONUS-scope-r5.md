# §211 R5 — actual committed scope and publication navigation

2026-09-05. Owner paragraph_211_bonus_correction_builder.
Paired branch `agent/book2-211-bonus-correction-20260905` under
`C:/wt/book2-211-bonus-correction-20260905`.

## Exact committed payload

- Platform base `2bf6260c5d4d799c5408f898d0dab126eff9e5ac` → payload
  `b19579e58bb6597a964dfe7d0a8ca1dcab199ed4`.
- Lessons base `917115c8da631d65eefbdb1f15c13b2291cd9e1d` → payload
  `45064bdfe0c1548f25f097eef648400382403cdf`.
- Both were cleanly claimed for task BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS;
  final pre-commit ownership checks matched this builder/task. No lock override.
- Final fetch/prune and governance check found no policy difference against
  `origin/main` `96416b6b5bd57094576e9aba0a42d682584ec479`.

Actual committed range checks, not empty pre-edit comparisons, passed:

```text
node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 2bf6260c5d4d799c5408f898d0dab126eff9e5ac --head b19579e58bb6597a964dfe7d0a8ca1dcab199ed4
node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 917115c8da631d65eefbdb1f15c13b2291cd9e1d --head 45064bdfe0c1548f25f097eef648400382403cdf
```

Platform: 60 paths = two owned source/test paths and 58 evidence paths.
The two are `build-scripts/content/book-2/211/{answers.md,test_bonus.py}`.
The evidence paths are only the three fresh §211 r5 proof directories, the
owned `BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-*` plan/build/baseline/mechanical/
reproduction/builder/helper/native/grayscale files, and append-only umbrella
command-log entries. No historical report, generator, policy or gate changed.

Lessons: exactly three changed paths under
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/`:

- `2.1.1 Kostenstructuren – antwoorden.md`
- `2.1.1 Kostenstructuren – antwoorden.html`
- `2.1.1 Kostenstructuren – antwoorden.pdf`

The committed insertion is six source lines, no removals. Native generated HTML
adds its fixed heading/list serialization; PDF answers page 7 alone changes.
Paragraph/exercise PDFs, all assets, historical excluded ZIP, plans, canonical
review/QC/handoff and authority/pins remain exact.

## Evidence navigation and boundary

Start at `BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-builder-r5.md` for exact hashes,
31 personally inspected full pages, six native/grayscale inspections, tests,
both Part A profiles, preserved failures, native checker and rebuild evidence.
Mechanical JSON binds all per-page and per-asset hashes, complete DOM reversal,
exact source delta, image geometry/font checks and the three lesson paths.
Reproduction JSON records all 21 file hashes after full and print-only rebuild.
The umbrella command-log JSONL records both actual range commands and their
stdout/stderr hashes, following the payload commit.

This file and command evidence form a separate evidence commit; the URL index
is refreshed before a terminal generated-only agent-index commit. Exact final
scope/index SHAs and normal-push remote verification are supplied in the builder's
handoff to root, avoiding a self-referential commit claim here.

This is a candidate for internal independent paragraph review and separate
specialist QC, not a human integration-ready packet. No exact-head platform CI
success is claimed, and no CI waiver is granted. No PR or merge is performed.
Root alone owns adoption, later acceptance/handoff, any reviewed dependency
repinning, final paired CI/readiness and a separately authorized integration.
Timing 54/66/78 and the bounded orange graphical-stroke contrast flag persist.

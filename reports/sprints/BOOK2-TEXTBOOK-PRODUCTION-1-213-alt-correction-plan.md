# §2.1.3 bounded short-alt correction — implementation and evidence plan

Date: 2026-09-05. Builder: `paragraph_213_alt_builder`.
Task: `BOOK2-TEXTBOOK-PRODUCTION-1-213-ALT`, under the root's combined #229/#223
production continuation. This is candidate construction, not independent review
or acceptance. Separate paragraph rereview, specialist QC and root acceptance follow.

## Exact starting point and permitted delta

Dedicated, claimed paired worktrees at `C:/wt/book2-213-alt-correction-20260905/`
use branch `agent/book2-213-alt-correction-20260905`. Published starting commits:
platform `199772e2aa586fce0f71b647ed5188e568dba2e5`; lessons
`4c4cd7d0c1d2e5242c818399a96dce3e26013e9c`. Governance freshness and clean
worktree ownership checks passed before edits.

Finding authority is the root's committed `B2-SHORT-ALT-01` in
`BOOK2-TEXTBOOK-PRODUCTION-1-review-corrections.md`, supplemented by the root's
explicit confirmation that the corresponding imperative-first we1 SVG title
may be corrected. The full specialist record will be read when published.

Change only the three overlong image alternatives in `213/theory.md` (fig3,
fig4) and `213/exercises.md` (we1), using native Pandoc `{alt="..."}` attributes.
Preserve the complete original image-caption brackets byte-for-byte. Proposed
alternatives describe interval-normalized revenue, interval-normalized profit
change, and the two workshops' right-endpoint marginal patterns respectively.
Each begins with a noun phrase and contains at most 120 characters.

In `b2_213.py` change only the we1 accessible title from
`Vergelijk de drie eindpuntrijen van Lus en Bout; constante en stijgende MK` to
`Drie eindpuntrijen van Lus en Bout; constante en stijgende MK`.
This removes the imperative while retaining all descriptive meaning. All drawing
elements, the other five titles, full captions and adjacent long descriptions stay
unchanged. Audit all six actual HTML alternatives and all six SVG titles.

All visible lesson text, source questions/answers, tables, calculations, goals,
target serialization, Linea/Curva's 10/6 blanks, five prompts, 15 points, Q=0 dashes,
right-endpoint convention, two-interval profit bridge and Start 2 remain identical.
No shared pipeline/CSS/sanitizer, target/hold/outline, plan, review, quality-ref,
handoff, other paragraph or protected-reference changes are permitted. Historical
211 handoff and 212 handoff/review/QC/Markdown prerequisite pins are frozen.

## Implementation and verification sequence

1. Capture an immutable before snapshot: all 24 lesson artifacts, all 29 existing
   R5 page hashes, original HTML alternatives/captions, SVG titles, owned source,
   guarded prerequisite and protected authority bytes. Confirm unused native r6
   proof destinations; do not weaken the existing revision guard.
2. Apply the four metadata edits. Add paragraph-owned regression contracts/tests
   that reject the original long alternatives, require exact noun-first phrases,
   and verify actual generated HTML caption preservation and complete inventories.
   Exercise the native Pandoc/unchanged production preparation route, not a mock
   substitute for rendered output.
3. Run the ten existing source tests plus new regressions. Rebuild all three
   editions and six SVG/PNG pairs using explicit `C:/Python314/python.exe` with
   inherited PATH, normal Node cwd and the exact lesson root. Generate fresh r6
   proof directories and separate immutable JSON evidence. Keep all old R4/R5
   evidence and new generation `PENDING` fields intact.
4. Execute exact source/render/ZIP checks, then full-generator and print-only
   rebuilds. Require byte-identical reproduction of all 24 current artifacts,
   zero pixel/channel/byte SVG-to-PNG drift, exact ZIP membership/CRC/member bytes,
   12pt body/footer and at least 12pt placed figure labels. Compare old/new PDFs,
   page images, visible HTML text/captions, PNGs and SVG drawing trees with zero
   tolerance. Any unexpected visible difference or guard failure stops acceptance
   and is reported without restoration, tolerance or assertion monkeypatching.
5. Personally inspect all 29 final full pages, all six final figures and five fresh
   grayscale figure-bearing pages under the PDF skill. The root's existing
   41-output PDF operation applies; do not create another marker. Record actual
   builder observations separately from machine proof and independent review.
6. Run both normal Part A profiles, approved §213 outline currentness, durable
   target authority, paired lane scope and diff checks. Publish clean, claimed,
   remote-matched paired candidate commits through ordinary branch push. Keep
   generated index changes in a separate tail commit. No PR, merge or final-head
   CI claim. Preserve failures honestly in the append-only task command log.

## Quality criteria and boundaries

- Accessibility: six meaningful noun-first HTML alternatives and six meaningful
  noun-first SVG titles at most 120 characters; full descriptions still visible.
- Didactics: unchanged progressive figures, worked-to-independent fading, normal
  print route and exact seven-heading architecture; no new teaching or target.
- Precision: finite same-interval differences, units, bounded interpretations,
  all frozen values and answer allocations unchanged.
- Visual/print: zero unexpected visible change, complete personal page inspection,
  exact figure raster parity and existing minimum typography maintained.
- Integrity: reproducible 24-artifact package, frozen prerequisite/authority pins,
  safe scoped delta, current evidence with honest generation/inspection distinction.
- Review/classroom: candidate-only handoff to distinct reviewers. Core 54 minutes,
  support 66 and all-item 78 remain unobserved estimates; no empirical classroom
  fit, attainment or current external inspection-compliance assertion. H-213-OPC2
  stays open and outside the agreed scope.

## Pre-build native-path clarification

The final distinct specialist report was read in full from published platform
evidence commit `25e3bdf696b84f8005fe30ce435efd0be8d95c4d`, report
`BOOK2-TEXTBOOK-PRODUCTION-1-213-specialist-review-r5.md`. It confirms exactly
three unique HTML alternatives and the one we1 SVG title as required repairs.
Native Pandoc also removes `aria-hidden="true"` from the four affected full
figcaption occurrences and may change HTML soft wrapping. The delta verifier
therefore enumerates those exact four attribute changes, preserves all caption
words and normalized DOM text/structure, and still requires identical PDF/page
bytes. This is native caption accessibility, not a shared-helper change.

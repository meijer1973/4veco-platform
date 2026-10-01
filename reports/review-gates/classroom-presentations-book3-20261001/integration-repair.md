# Book 3 compatibility after the Book 2 notation merge

Both main branches advanced after the original Book 3 review. Platform main
`537b9fd541906d59ee74eafc95b2acd85ff5239d` and lessons main
`5f2350ee965348832dec5e7816cea02b401f388e` contain the accepted Book 2 notation
and presentation update. Conflict-free synchronization produced platform
`25bb4082baea0268ba1e74c1949948c599ae0174` and lessons
`43de12b0702773ace76803e2f4d4cb9523ab06cd`. There were no overlapping changed
paths and no manual merge resolution. The independent
[base-drift review](integration-base-drift-review.md) verifies the exact trees,
unchanged Book 3 artifacts, and current Book 2 prerequisite continuity.

The synchronized pair exposed two preservation-check failures. The new signed
notation receipt rejects additional Book 3 companions as an unexpected current
inventory. Direct CLI invocation also reaches a circular import before the
classroom adapter has exported `partitionInventory`. The trusted
[compatibility run at the synchronized heads](https://github.com/meijer1973/4veco-platform/actions/runs/36873791439)
failed its final-pair check. Platform-first passed, but that intermediate success
alone does not permit either merge.

The repair adds a notation-specific branch to the current classroom adapter.
It authenticates the original current receipt and checks every original
invariant, including all sealed bytes, baseline blobs, historical evidence,
finite contract and pin paths, approved source hashes and platform-input hashes.
Only the already bounded presentation/PDF/evidence additions are partitioned
out of the sealed inventory. The existing navigation exception remains bounded
to `RESEARCH_AGENT_MAP.md`. Tracked verification includes every sealed file,
new companion and navigation file. Publishing the module API before CLI
execution fixes the recursive callback.

The original notation validator, all signed receipts and pins, all textbook
sources, and every delivered Book 3 builder/PPTX/PDF/evidence file remain
unchanged. The Book 4 allowance is not expanded by this repair.

## Validation

- The three focused adapter/notation suites pass: 69 tests, including 25 new
  cases. Controls reject unknown or misplaced additions, Book 4 additions,
  changed protected and allowed sources, repinned source edits, false or missing
  baseline blobs, wrong source ancestry, altered tools, historical mismatches,
  invalid contracts, extra changed paths, and unstaged saved bytes. A separate
  subprocess executes the CLI branch with the actual recursive import order.
- Direct `node build-scripts/maintenance/check-classroom-edition.js
  --require-tracked` on the synchronized lesson pair passes: all 1,561 files in
  the current notation receipt and 42 additional Book 3 companions.
- The [independent adapter review](integration-adapter-review.md) passes at the
  recorded source/test hashes. It repeats the real-pair check, runs four real-pair
  negative controls without filesystem mutations, and demonstrates that the CLI
  regression test fails against the original synchronized adapter.
- Fresh exact-head CI, final independent repair binding and cross-repository
  compatibility are recorded on PR288 after the repair commit. The failed
  pre-repair run and earlier reviewed payload evidence remain historical.

The unit fixture stubs historical setup and presentation-contract construction;
it exercises the original byte/baseline validator and Git index checks. The real
paired CLI check exercises the complete receipt, history and contract. Neither
is a new visual approval of the 350 unchanged slides.

## Teacher page-reference mapping

Book 2's added notation example shifts later pages by one. The saved §3.1.1
notes deliberately retain their original source edition, lessons
`9b8304d5031cafac936a56281e144573a25fbbc9`. When teaching with current Book 2,
use the following printed-page mapping:

| Saved §3.1.1 notes | Original Book 2 reference | Current Book 2 reference |
|---|---|---|
| Slides 1, 16 and 27 | §2.3.2, pp.81–83 | §2.3.2, pp.82–84 |
| Slide 2 | §2.3.2, pp.82–83 | §2.3.2, pp.83–84 |

The worked example formerly on p.83 is now on p.84. Current p.83 still teaches
the equilibrium calculation recalled by the start task. Printed pages differ
from PDF physical page positions. Book 3 source pages and target questions are
unchanged. Historical predecessor hashes must continue to resolve at their
declared commit; they must not be repinned to the new Book 2 edition.

## Integration authority

Owner comment5933108196 authorizes the previously reviewed platform `64edb338`
and lessons `b26d8997` payloads, including permitted conflict-free synchronization.
This additional authored adapter logic changes the platform payload. Under the
[integration policy](../../../docs/review/pr-integration-lane-policy.md), a new
owner payload decision is required before merging the repaired bundle. No
merge, admin bypass, textbook change, deployment or Book 4 production is claimed
in this repair record. The requested order remains platform first, then lessons.

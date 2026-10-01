# Independent Book 3 base-drift review

Date: 2026-10-01. Read-only repository review. **Payload preservation and instructional continuity PASS; synchronized integration remains blocked by the classroom-adapter compatibility defects below.** This is a bounded drift review, not a fresh full visual review or merge authority. The subsequent in-progress adapter repair is outside this verdict.

## Exact inputs and synchronized identities

| Role | Platform | Lessons |
|---|---|---|
| Original source base | `34464fb6091f721f7a87e8d1bb3165f758770799` | `9b8304d5031cafac936a56281e144573a25fbbc9` |
| Previously reviewed payload | `64edb338e39c91ce2af1670709aef711666089cf` | `b26d8997b841b36e136d71203e34a02723a43395` |
| Fetched main | `537b9fd541906d59ee74eafc95b2acd85ff5239d` | `5f2350ee965348832dec5e7816cea02b401f388e` |
| Conflict-free synchronized head | `25bb4082baea0268ba1e74c1949948c599ae0174` | `43de12b0702773ace76803e2f4d4cb9523ab06cd` |
| Synchronized Git tree | `011cbc5048db891416f274184e536ed8e298dba3` | `8bae1f86ff325ad2f478138d02e964a278199e7d` |

Independent Git tree comparison confirms each synchronized tree is exactly current main plus the previously reviewed payload's changes. The two parents are exactly the payload and fetched main shown above. There are no conflicting paths: platform payload changes 101 paths and main changes 100; lessons payload changes 43 paths and main changes 213. Both overlap sets are empty. No manual resolution or novel assembly change is present in these two synchronized commits.

All Book 3 paragraph builder/helper/manifest blobs, the complete Book 3 lesson subtree including all 28 delivered PPTX/PDF files and 14 evidence records, and the original Book 3 review reports remain the reviewed payload bytes. Main makes no change anywhere under `edities/books34-v3`. The artifact identities and 350-slide assessment in [the original delivery review](review.md) therefore remain applicable to Book 3. Its claim that 12 predecessor Book 2 decks were unchanged describes the old payload pair, not this newer main: main intentionally replaces ten Book 2 PPTX/PDF pairs, preserving §2.1.1 and §2.1.2.

## Integration findings

### P2 — the current notation successor is not accommodated by the additive classroom adapter

At synchronized platform `build-scripts/maintenance/check-classroom-edition.js:140–154`, the fallback recognizes only older successor/follow-up failures and routes only to their validators. New main's `check-books34-v3-import.js:94–98` instead selects `book2-notation-revision`. That signed successor requires its exact current inventory (`book2-notation-revision.js:83–93`), so the 42 added Book 3 companions are rejected before ordinary source validation completes.

Independent reproduction on the synchronized pair, using imported `verify({root: platform, lessons, requireTracked:true})`, returns `passed:false`, `lesson_state:book2-notation-20261001`, and the sole failure `Unexpected current file inventory`. There is no source conflict to resolve, and repinning any historical or current notation receipt would be the wrong remedy.

The smallest sound extension is a separately bounded current-notation branch in the existing classroom adapter. It must authenticate the current pin/manifest/revision/base; preserve `checkContract`, `history`, contract bases, finite Book 2 revision scope and entry README binding; partition only existing approved classroom additions from the sealed manifest inventory; invoke original `verifyFiles` on every sealed path and baseline blob; compare the remaining changed paths against both exact contract and pin lists; preserve every source ancestry/proposed hash and every platform-input hash; and validate stage-0, mode and actual blobs for all sealed and added files. Keep historical validators, all pins and receipts unchanged. Unknown files, textbook edits, missing sealed files, repins, changed inputs and index drift must still fail. An exact current-notation state plus a sole recognized inventory/scope failure is the appropriate fallback boundary; do not suppress arbitrary historical failures. Book 4 must remain outside the companion allowance.

### P2 — CLI exports are unavailable during the new receipt's circular callback

The same synchronized adapter invokes CLI verification before assigning `module.exports` (lines154–159). New `book2-notation-revision.history` calls the adapter's exported `partitionInventory` while authenticating the previously accepted baseline. Direct CLI invocation can therefore see incomplete exports, whereas the imported verification reproduced above reaches the distinct inventory failure. The coordinator reproduced this CLI error; independent code inspection confirms the cycle and order. Publish the adapter API before entering the CLI block. Include direct CLI execution in repair validation, not only imported/Jest calls.

The new notation-specific publication workflow retains its own historical exact pair and twenty named changed Book 2 artifacts. It should not be loosened to accept arbitrary Book 3 paths: current combined-edition compatibility belongs in the current classroom adapter. No need was found to modify the sealed notation validator, publication contract, scope checker or their authenticated hashes.

## Book 2 prerequisite continuity and pagination

I read the actual old/current Book 2 manuscript changes for §§2.1.1–2.1.3 and §§2.3.1–2.3.3, extracted relevant pages from both complete student PDFs, inspected actual saved predecessor slide text and notes, and searched every selected Book 3 deck's saved text/notes for Book 2 references. This pass did not rerender or visually reapprove the newly accepted Book 2 decks; their own main-branch review remains their visual authority.

| Book 3 use | Current Book 2 evidence | Drift assessment |
|---|---|---|
| §3.1.1 start 1, slides5–6: solve equal inverse functions and substitute | §2.3.2 complete-book printed p.83 solves `40−Q=10+0.5Q`, then substitutes P=20; p.84 repeats `(Q,P)=(20,14)`; saved §232 slide21 repeats target algebra | Operation preserved. Old corresponding pages82–83 are now83–84. |
| §3.1.2 start10 and §3.3.2 slide8: triangular CS/PS, appropriate traded units, units | §2.3.1 p.75–76; §2.3.2 p.82–85; saved §232 slides22–26 | Operation/model assumptions preserved. Page shift is +1; no missing prerequisite. |
| §3.2.1 start1/slides8–9 and §3.2.2 start11/slide8: TO, GO, interval MK/MO and Q→q | §2.1.2 p.10–13 still teaches TO=P×Q, GO=TO/Q, profit=TO−TK; §2.1.3 p.19 introduces word formulas, p.20 explicitly introduces Δ and interval differences | Essential symbolic procedure remains taught before use. §322's printed p.19–20 anchor remains correct. |
| §3.2.2 derivative transition and §3.2.3 optimization/profit area | §2.1.3 p.21 interval average; new p.23 still explicitly excludes derivatives and profit maximization; saved §213 slides3/6/11–13 and15 preserve the interval procedure and restriction | No false assumption of prior calculus. Book 3 still supplies the point derivative/new marginal decision and profit-area conversion. |
| §3.1 and §3.3 desired versus actual trade; efficiency and allocation conditions | Current §2.3.3 p.91–96 and saved slides3/5/22/26–28 preserve the binding transaction limit, efficient allocation, no external harm and feasible extra trade | Qd/Qs became Dutch Qv/Qa, aligning with Book 3 usage. Economic quantities, units and conditions are unchanged. |

Material checks: interval `(190−130)/(30−10)=3` and `(240−80)/20=8`; Atelier Boog interval MK 2,6,10 with MO12; posters equilibrium Q20/P20 and CS200+PS100=TS300; notebook example Q20/P14 and CS=PS100. The saved §233 target still gives Qv50/Qa80, actual40, CS600+PS600=1200, loss1350−1200=150, matching `0.5×20×15`; the feasible41st unit gives buyer4.50 and seller9.75 at P25. None produces a new Book 3 prerequisite or assumption contradiction.

The current complete Book 2 PDF has 111 physical pages versus110 before. Printed p.19–22 keep their positions; Atelier Boog occupies added printed p.23 and subsequent material shifts by one. I checked actual printed/footer text, not only `presentation-page-compatibility.json`: §232's former printed81/82/83 correspond to current82/83/84 (physical84/85/86).

The only selected Book 3 saved notes with shifted numeric Book 2 references are §311 notes1/16/27 (`p.81–83`) and note2 (`p.82–83`). These refer to the frozen prior teaching evidence; current p.83 still contains the recalled equilibrium calculation, so there is no instructional blocker and no need to rebuild the pupil-facing deck solely for this drift. A current teacher integration note should map the old reference to §232 current p.82–84 (worked example p.84) and identify the pinned edition, rather than silently treating the old range as the exact current range.

## Historical source identity remains intentional

Thirteen explicitly hashed Book 2 references across §311/312/321/322/323/332 manifests were checked against actual Git blobs. All13 authenticate at their declared lesson source commit `9b8304d...`; twelve now differ from current main, and the §211 PDF visual reference is unchanged. The changed references are the six relevant manuscripts plus the complete-book PDF, with repeats across manifests. These are legitimate historical provenance, not stale author evidence requiring repinning. The current complete PDF SHA-256 is `23d0532a7804fb743f053608a814959c6f09c9259c27762b1dff5952556908d5`; the frozen predecessor PDF remains `e1b4a5648e0eab56d83fe1f69ab05f2bcef8e144905d8630195c6b4da7978493` at its source commit.

The previous 134-reference/current-files check must now be described as the historical payload check. Any new integration validation should resolve the pinned predecessor references at the declared commit and separately attest compatibility with current Book 2, as this review does. Do not rewrite the original evidence or claim all old hashes equal current main. Book 3 primary manuscripts, answers, guidance and printed-page authority remain byte-identical, so their current bindings and all assessed target pages remain valid.

## Authorization and closure boundary

The trusted fetched-main policy `docs/review/pr-integration-lane-policy.md:39–46,84–94` explicitly limits inherited authorization to conflict-free base sync and allowlisted deterministic evidence tails; substantive PR-authored source changes require renewed authorization. The owner record5933108196 binds the original64ed/b26d payload and those permitted descendants. These two automatic synchronization commits fit that inheritance boundary; an authored change to the adapter's accepted validation states does not become deterministic evidence merely because it preserves the product files. A new delta review can establish technical readiness of a concrete repair, but cannot itself expand that recorded payload authority. The coordinator is handling the actual authorization decision and workflow.

Closure requires the narrowly reviewed adapter repair, positive direct-CLI/imported exact-pair checks, negative preservation controls, and fresh exact-head required CI/compatibility evidence. No new CI pass is claimed here. No repositories, author artifacts or GitHub objects were changed during this review. Only this scratch report was written; Book 4 production was not started.

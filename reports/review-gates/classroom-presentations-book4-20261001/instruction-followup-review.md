# Independent instruction-follow-up review

**Instruction verdict: PASS.** No actionable finding in the 14-line instruction-only change. This approves the reviewed seed for fresh testing; it does not establish that the new instructions are effective or accept the old decks.

- Reviewed commit: `d1cb1fe3db3a70dc86682491771ed68a67f45526`.
- Base commit: `7e258769e98cf4c7bee46fe3a7fe8673b3696aba`.
- Sole changed file: `docs/workflows/classroom-presentation.md`.
- Exact committed document SHA-256: `035eb844687c2bbb248d52bd57e8be8fb90736f0a7cd5dcf86b0fa4bcc8193f6`.
- `git diff --check 7e258769 d1cb1fe3`: PASS.

The page-reference rule correctly distinguishes complete-book printed pages from chapter-local page data and requires the cited page to support the claimed teaching. It closes a real provenance gap without giving a paragraph's page answers. The label rule is clear about checking every panel, wrapped line and price guide; shorter tags retain meaning through an explicit key. The linked-model rule correctly requires consistency between displayed firm and market representations, including firm count and capacity, while preserving the distinction between schematic drawing tolerance and the economic assumptions. It does not prescribe a particular slope, numerical parameter, target solution or teaching example. The added text contains no paragraph IDs, exercise answers, scenario data or bespoke answer plan.

## Cold-seed isolation

Both `.book4/retest-411` and `.book4/retest-422` were checked independently. Each platform checkout is clean at the reviewed full commit; each lesson checkout is clean at `e734532a42b27732ac25ce990fc9448b12309d28`. Their instruction bytes match the SHA-256 above. Both have no files under `build-scripts/content/book-4` and no Book 4 presentation/deck/evidence outputs in the current Book 4 lesson tree. The production checkout's untracked Book 4 content directory is absent from these retest pairs and is not included in the instruction commit. Existing textbook source material remains available as intended.

## Bounded observations on earlier cold outputs

These findings concern the specifically requested saved previews, not the instruction verdict. Images were inspected at full-slide size and with lossless local detail crops; no judgment relies only on text-box intersections.

- **422 v6, slides 6, 7, 17 and 22:** actual demand-curve/glyph contact remains. In both panels of 6 and 17 the line intersects the lower part of the `V` in `Vraag`. Slides 7 and 22 repeat the direct-label placement and the curve also crosses the initial `P` in the price annotation. Nearby `MO` and `MK` tags are clear in these panels. The labels inspected in this v6 are single-line: the remaining defect is direct glyph clearance, rather than the earlier wrapped-label mechanism.
- **422 v6, note 5:** the saved note cites prerequisite teaching on printed pages 32–33 and names §4.1.4. Complete-book page 32 contains §4.1.3 independent exercises 26–27; page 33 contains target exercise 28. Those are not the named teaching anchor. Page 28 contains the worked `P → TO → MO` derivation; page 36 contains the §4.1.4 MO/MK method. This is a prerequisite-citation finding, not an arithmetic finding about the authored example.
- **423 v3, slides 8 and 20:** the demand curve really crosses the `G` of `GO = P`, near its lower portion on 8 and more visibly through its lower-middle portion on 20. These are actual glyph/curve collisions, not simply nearby labels.

The exact 422 PPTX reviewed hashes to `e2df4dd8d0f3142afed3e390297d2d0231caef74f2d8a434c1e66b34a05a4557`; the 423 PPTX hashes to `78f5ff10f5e37796cc700f940a768f3882fdaed322ca02b319329f2fddcfa310`. The JSON companion records all inspected slide hashes, the source-PDF hash and the exact seed identities. Detail crops are under `.book4/review/instruction-followup-crops/`.

Only scratch evidence was written. Production, author worktrees and textbook files were not changed. No messages were sent to the active authors. Fresh cold retest effectiveness remains untested and belongs to the subsequent run.

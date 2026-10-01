# Independent shared Book 3 code review — 2026-10-01

**Final bounded verdict: PASS at platform commit `2b263cfd2bd5ea4b2ea172a7687a87a469bc73d7`.** The original candidate alone had one P2 finding in the new straight-scatter helper; the coordinator's subsequent repair was independently verified and closes it. No findings in the Book 3 edition allowance or recipe changes. This is a bounded code/instruction review, not acceptance of any paragraph deck or the queued cold retests.

Reviewed platform commit **ab55a2dd1cbdeb56a0b55f2d361cf62086b22f4a**, branch `codex/ppt-book3-20261001`, against **34464fb6091f721f7a87e8d1bb3165f758770799**. Actual HEAD matched throughout review. Paired lessons HEAD was **9b8304d5031cafac936a56281e144573a25fbbc9**; the working tree already contained additive Book 3 companions. Read platform `AGENTS.md` and `.book3/shared-dispositions.json`, then independently inspected all six committed changed files and the surrounding adapter logic. The untracked `build-scripts/content/book-3/` directory and new deck content were excluded.

## P2 — Preserve schema order and the delete choice when adding chart properties

Location: [straight-scatter.py](C:/wt/ppt/4veco-platform/build-scripts/presentations/straight-scatter.py:24), especially lines 24–35.

`ET.SubElement` appends missing properties to the end of each parent. These chart elements have ordered content models. For example, the committed test fixture already contains `c:showVal` but lacks `c:showLegendKey`. Normalization appends `showLegendKey` after `showVal`, although `showLegendKey` must precede it. The helper therefore turns the fixture's valid `dLbls` subtree into an invalid one while all current tests pass. A strict consumer may reject or repair the chart; successful property lookups and idempotence do not establish package validity.

Two related ordinary inputs expose the same problem:

- A scatter series with an existing `c:extLst` and no `c:smooth` receives `smooth` after `extLst`; `smooth` must come before that final extension element.
- A `dLbls` using the `c:delete` alternative receives the formatting/show-flags alternative as well. Those alternatives are mutually exclusive.

Reproduction used the committed test fixture and helper without modifying either. A focused `lxml.XMLSchema` constraint for the `dLbls` content model accepted the fixture before normalization and rejected it afterward with `showLegendKey ... not expected`. The same validation accepted a `delete`-branch variant before normalization and rejected it afterward. An extension-list series variant produced the child tail `yVal, extLst, smooth` instead of `yVal, smooth, extLst`.

The ordering and choice were checked against Microsoft's [Open XML SDK chart schema metadata](https://github.com/dotnet/Open-XML-SDK/blob/main/data/schemas/schemas_openxmlformats_org_drawingml_2006_chart.json), specifically the `DataLabels` and `ScatterChartSeries` particle definitions. This was a focused subtree check, not a claim to have schema-validated every part of a real deck.

Minimal repair: insert each absent property before its schema successors, including `smooth` before `extLst`; leave a `dLbls` delete branch intact instead of adding the alternative branch. Add regression cases for an existing later show flag, label/series extension lists, and the delete branch, while retaining the existing numeric data, custom-label, embedded-workbook and noneligible-chart preservation assertions. An ordered insertion helper is sufficient; no redesign or new dependency is needed.

This finding concerns the shared utility's supported `line`/`lineMarker` input domain. It does **not** establish that the saved §3.1.5 deck is malformed or visually wrong: that artifact was outside this review and PowerPoint may normalize producer XML during finalization. Paragraph acceptance still requires its own saved-package/render evidence.

### Narrow repair closure and §3.1.5 impact check

After receiving the finding, the coordinator changed only the helper and its Python tests in the working tree. I independently inspected that diff. New absent properties are inserted before their schema successors, missing `smooth` precedes `extLst`, and a label `delete` branch is preserved without adding formatting flags. Existing values in the applicable formatting branch are still set to zero; data/custom-label preservation and the eligible chart-style boundary remain unchanged.

Exact repaired working-file SHA-256 identities:

- `build-scripts/presentations/straight-scatter.py`: `d4cbe6a0a538bf34a7e7cc23b2972f55a07d9b3d76c8dd517e4fe1ceb34daf5f`
- `build-scripts/presentations/test_straight_scatter.py`: `20ba5bb7c968dda8e18845da124c710b6fb7298c9a4dc60e07af95182c347cf9`

All **6 Python tests** and the Jest wrapper passed on that repair. Independent focused subtree schema checks now pass for the original partial-label fixture and delete values 0 and 1. For a negative control, I loaded the original committed helper into memory and ran the three new regression tests against it: **all three failed**, demonstrating that the new tests detect the reviewed defect. No repository file was changed by the reviewer.

Final commit binding: actual HEAD subsequently became **`2b263cfd2bd5ea4b2ea172a7687a87a469bc73d7`**. Both repaired working-file SHA-256 values remained exactly as above and the tracked tree was clean. Their committed Git blobs are `c02bf85bc54ff05b578c106297f26f96ab66f968` (helper) and `c8488e514e5bf4594a1c95daa5cf03b4161db20a` (tests). The only additional change since the first candidate is recipe wording requiring point labels such as E to be offset into clear whitespace and every repeated graph to be rechecked after shared label changes; I inspected it and found it proportionate and correct. It changes label placement, not the point's data coordinate. Final recipe blob: `7978965399a6c332770553a42412709019478975`. All other reviewed files are unchanged from the original candidate.

At the coordinator's request I then inspected only this defect's possible effect in the actual assembled [§3.1.5 PPTX](C:/wt/ppt/4veco-lessen/edities/books34-v3/books/book-3/chapters/3.1/paragraph-pdfs/3.1.5%20Minimumprijs%20en%20quota%20–%20presentatie.pptx), SHA-256 **`df0195e9819f0e1aeba85447aab91a987a719b16b4dcaa009023405e6c932e24`**. Its chart parts are under `ppt/slides/charts/`. Across all **7 native scatter charts, 59 series and 14 series-label subtrees**, the relevant child orders and delete choices are valid; all **59 series explicitly have `smooth=0`**. Thus this saved package does **not** need regeneration for the reported helper defect. This was an ordering/choice/property check of all affected chart subtrees, not full-deck schema, chart-data or visual acceptance.

## Book 3 allowance: preservation and scope pass

`isClassroomAddition` adds only current Book 3 v3 paragraph-PDF destinations, named presentation PPTX/PDF files, and the exact paragraph evidence filename. It requires the corresponding student PDF to be in the authenticated sealed inventory and in the same chapter; an already sealed companion is never treated as an exempt addition. The new rule does not admit Book 4 or broaden manuscript, answer, guide, source-PDF, manifest, or platform-input editing.

The downstream logic still partitions additions from the full sealed inventory and authenticates every sealed file. The original receipt/pin, predecessor, baseline-blob, source/target, changed-path and tracked-byte checks remain in place. The previously narrow authenticated scope-checker insertion exception is unchanged. Historical verifier failures outside the enumerated inventory/scope case are still returned rather than suppressed. No historical module, receipt or pin changed in this six-file commit.

Independent Book 3-specific controls accepted unchanged sealed student bytes with one permitted companion, then rejected all six attempted deviations: changed student bytes; a row repin of those changed bytes; a missing sealed inventory entry; a Book 4 path; a manuscript addition; and an unsealed paragraph number. These checks used a temporary fixture under `%TEMP%`, not either repository.

The actual paired working-tree check passed: **1,480 sealed files**, with **54 permitted additions** (36 existing Book 2 and 18 Book 3 companion/evidence files). This was `node build-scripts/maintenance/check-classroom-edition.js`, without `--require-tracked`, because this bounded review occurs during additive batch assembly. It is preservation/scope evidence, not evidence that pending companions are final or staged. The existing staged-byte negative controls passed in the focused test suite.

## Recipe changes: proportionate and source-consistent

- Current Book 3 v3 source paths, chapter answer/guidance files, figure directory and complete student PDF agree with the current foundation sources previously independently audited in [source-audit.md](C:/wt/ppt/.book3/source-audit.md). No historical v2 source is promoted.
- Starting mixed practice at its first actual exercise corrects the Book 3 numbering cases (46, 31, 31), while retaining all numbered/bonus homework. It does not renumber the textbook or alter target approval.
- Reading complete target context outside an exercise container is necessary for the actual current source format; it does not license inventing missing data.
- Saved-render checks for unwanted smoothing and automatic labels correctly distinguish numerical endpoint correctness from visual straightness. Explicit per-series `smooth=0` remains an opt-in correction for authored straight series.
- The horizontal shift arrow instruction accurately carries forward `skills/economic-graph.md:66`: compare at a common price, separately from the vertical wedge at a common quantity, and verify the endpoints against the functions. It is a representation requirement, not a new economic claim or replacement for the price wedge.
- Current Book 3 output/evidence ownership and same-chapter sealed-export guard agree with the adapter. Original textbook exports remain protected; Book 4 is explicitly excluded.

No additional instruction change is requested by this review. Whether the new wording prevents the original §3.1.1 arrow omission and any §3.2.4 conversion defect remains an empirical question for the separate fresh cold retests; no result is inferred here.

## Verification and exact reviewed files

Ran `node node_modules/jest/bin/jest.js build-scripts/maintenance/check-classroom-edition.test.js build-scripts/presentations/straight-scatter.test.js --runInBand` with the bundled Python selected by `RUNTIME_PYTHON`: **2 suites, 26 Jest tests passed**. The scatter wrapper ran its **3 Python tests**. The tests establish the stated preservation/idempotence properties, but currently miss the schema defect above. Also ran the actual paired edition checker and six independent Book 3 negative controls described above.

| Committed file | Git blob at reviewed commit |
|---|---|
| `build-scripts/maintenance/check-classroom-edition.js` | `b4783f80d4c5cdbb7566ace6828de9c4bb9e3909` |
| `build-scripts/maintenance/check-classroom-edition.test.js` | `19a81c00a2edb26340b778b8992f714fba8e492b` |
| `build-scripts/presentations/straight-scatter.py` | `3757adcc9c3b0a42726e96f52820465dae2f909d` |
| `build-scripts/presentations/straight-scatter.test.js` | `cbe3673ee76b81719a51f6530401e10a723147de` |
| `build-scripts/presentations/test_straight_scatter.py` | `0acaa1aafeb85045ab2d39c8b88b02f401b7c251` |
| `docs/workflows/classroom-presentation.md` | `4c3658c3dfcdbf9a0a55afdd9a32673e535dcd78` |

Limits: no paragraph-builder or full-series review; only the scoped §3.1.5 saved-chart inspection documented above; no new deck visual inspection; no PowerPoint rerender; no complete Jest run or CI verdict; no cold-author contact; no reviewer repository/source/artifact changes. Broader Book 4 support was not part of the reviewed diff. This report is independent review evidence, not merge or classroom-timing authority.
